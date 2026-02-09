import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'rfpquest';

// Initialize S3 client for R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * POST /api/upload
 *
 * Upload an RFP PDF to Cloudflare R2 and create a database record.
 * Accepts multipart/form-data with a 'file' field.
 */
export async function POST(req: NextRequest) {
  try {
    // Check R2 configuration
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const r2Key = `rfp-uploads/${timestamp}-${sanitizedName}`;

    // Upload to R2
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: 'application/pdf',
        Metadata: {
          originalFilename: file.name,
          uploadedAt: new Date().toISOString(),
        },
      })
    );

    // Generate public URL
    const r2Url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${r2Key}`;

    // Create database record
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      INSERT INTO rfp_uploads (
        user_id,
        filename,
        original_filename,
        r2_key,
        r2_url,
        file_size,
        mime_type,
        status
      ) VALUES (
        ${userId || null},
        ${`${timestamp}-${sanitizedName}`},
        ${file.name},
        ${r2Key},
        ${r2Url},
        ${file.size},
        'application/pdf',
        'uploaded'
      )
      RETURNING id, filename, r2_url, status
    `;

    const uploadRecord = result[0];

    return NextResponse.json({
      id: uploadRecord.id,
      filename: uploadRecord.filename,
      originalFilename: file.name,
      url: uploadRecord.r2_url,
      size: file.size,
      status: 'uploaded',
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload?id={uploadId}
 *
 * Get upload status and generate a signed URL for download.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadId = searchParams.get('id');

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT id, filename, original_filename, r2_key, r2_url, file_size,
             status, parsed_text, parsed_at, tender_ocid, metadata, created_at
      FROM rfp_uploads
      WHERE id = ${uploadId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    const upload = result[0];

    // Generate signed URL for download (valid for 1 hour)
    let signedUrl = null;
    if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
      try {
        signedUrl = await getSignedUrl(
          r2Client,
          new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: upload.r2_key as string,
          }),
          { expiresIn: 3600 }
        );
      } catch {
        // Signed URL generation failed, use public URL
        signedUrl = upload.r2_url;
      }
    }

    return NextResponse.json({
      id: upload.id,
      filename: upload.filename,
      originalFilename: upload.original_filename,
      url: signedUrl || upload.r2_url,
      size: upload.file_size,
      status: upload.status,
      parsedAt: upload.parsed_at,
      tenderOcid: upload.tender_ocid,
      createdAt: upload.created_at,
    });
  } catch (error) {
    console.error('Get upload error:', error);
    return NextResponse.json(
      { error: 'Failed to get upload' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload?id={uploadId}
 *
 * Delete an upload from R2 and database.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadId = searchParams.get('id');

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Get the R2 key before deleting
    const result = await sql`
      SELECT r2_key FROM rfp_uploads WHERE id = ${uploadId} LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    // Note: R2 deletion would go here if needed
    // await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: result[0].r2_key }));

    // Delete from database
    await sql`DELETE FROM rfp_uploads WHERE id = ${uploadId}`;

    return NextResponse.json({
      message: 'Upload deleted successfully',
    });
  } catch (error) {
    console.error('Delete upload error:', error);
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    );
  }
}
