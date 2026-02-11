import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { parseDocument, isParseError } from '@/lib/document-parser';

export interface TenderDocument {
  id: string;
  tenderOcid: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSizeBytes: number | null;
  extractedText: string | null;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResult: Record<string, unknown> | null;
  uploadedAt: string;
  analyzedAt: string | null;
}

// GET /api/tender-documents?ocid=XXX - Get documents for a tender
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ocid = searchParams.get('ocid');

    if (!ocid) {
      return NextResponse.json({ error: 'OCID is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Get documents for this tender
    const documents = await sql`
      SELECT
        id,
        tender_ocid,
        file_name,
        file_type,
        file_url,
        file_size_bytes,
        extracted_text,
        analysis_status,
        analysis_result,
        uploaded_at,
        analyzed_at
      FROM tender_documents
      WHERE tender_ocid = ${ocid}
      AND company_profile_id = ${companyProfileId}
      ORDER BY uploaded_at DESC
    `;

    const transformedDocuments: TenderDocument[] = documents.map((doc) => ({
      id: doc.id as string,
      tenderOcid: doc.tender_ocid as string,
      fileName: doc.file_name as string,
      fileType: doc.file_type as string,
      fileUrl: doc.file_url as string,
      fileSizeBytes: doc.file_size_bytes as number | null,
      extractedText: doc.extracted_text as string | null,
      analysisStatus: doc.analysis_status as TenderDocument['analysisStatus'],
      analysisResult: doc.analysis_result as Record<string, unknown> | null,
      uploadedAt: doc.uploaded_at as string,
      analyzedAt: doc.analyzed_at as string | null,
    }));

    return NextResponse.json({ documents: transformedDocuments });
  } catch (error) {
    console.error('Error fetching tender documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/tender-documents - Upload a new document
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json(
        { error: 'Company profile required to upload documents' },
        { status: 400 }
      );
    }

    const companyProfileId = profileResult[0].id;

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const ocid = formData.get('ocid') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!ocid) {
      return NextResponse.json({ error: 'OCID is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are supported' },
        { status: 400 }
      );
    }

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the document to extract text
    const parseResult = await parseDocument(buffer, file.type);

    if (isParseError(parseResult)) {
      return NextResponse.json(
        { error: parseResult.error, details: parseResult.details },
        { status: 400 }
      );
    }

    // For now, store document info without R2 (we'll add R2 upload later)
    // In production, upload to R2 and store the URL
    const fileUrl = `local://${file.name}`; // Placeholder

    // Insert document record
    const result = await sql`
      INSERT INTO tender_documents (
        tender_ocid,
        company_profile_id,
        file_name,
        file_type,
        file_url,
        file_size_bytes,
        extracted_text,
        analysis_status
      ) VALUES (
        ${ocid},
        ${companyProfileId},
        ${file.name},
        ${file.type},
        ${fileUrl},
        ${buffer.length},
        ${parseResult.text},
        'pending'
      )
      RETURNING *
    `;

    const doc = result[0];

    return NextResponse.json({
      document: {
        id: doc.id,
        tenderOcid: doc.tender_ocid,
        fileName: doc.file_name,
        fileType: doc.file_type,
        fileUrl: doc.file_url,
        fileSizeBytes: doc.file_size_bytes,
        extractedText: doc.extracted_text,
        analysisStatus: doc.analysis_status,
        uploadedAt: doc.uploaded_at,
        wordCount: parseResult.wordCount,
        pages: parseResult.pages,
      },
      message: 'Document uploaded and text extracted successfully',
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
