import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

interface SaveResponseBody {
  requirementId: string;
  responseText: string;
  status?: 'draft' | 'review' | 'complete';
}

// POST /api/bid-responses - Save a bid response
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SaveResponseBody = await request.json();
    const { requirementId, responseText, status = 'draft' } = body;

    if (!requirementId) {
      return NextResponse.json({ error: 'requirementId is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json(
        { error: 'Company profile required' },
        { status: 400 }
      );
    }

    const companyProfileId = profileResult[0].id;
    const wordCount = responseText?.trim().split(/\s+/).filter(Boolean).length || 0;

    // Check if response exists
    const existingResponse = await sql`
      SELECT id, version FROM bid_responses
      WHERE requirement_id = ${requirementId}
      AND company_profile_id = ${companyProfileId}
    `;

    let responseId: string;

    if (existingResponse.length > 0) {
      // Update existing response
      const newVersion = (existingResponse[0].version as number) + 1;
      await sql`
        UPDATE bid_responses
        SET
          response_text = ${responseText || ''},
          word_count = ${wordCount},
          status = ${status},
          version = ${newVersion},
          updated_at = NOW()
        WHERE id = ${existingResponse[0].id}
      `;
      responseId = existingResponse[0].id as string;
    } else {
      // Insert new response
      const result = await sql`
        INSERT INTO bid_responses (
          requirement_id,
          company_profile_id,
          response_text,
          word_count,
          status,
          version,
          ai_generated
        ) VALUES (
          ${requirementId},
          ${companyProfileId},
          ${responseText || ''},
          ${wordCount},
          ${status},
          1,
          false
        )
        RETURNING id
      `;
      responseId = result[0].id as string;
    }

    return NextResponse.json({
      id: responseId,
      wordCount,
      status,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    );
  }
}

// GET /api/bid-responses?requirementId=XXX - Get a saved response
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get('requirementId');

    if (!requirementId) {
      return NextResponse.json({ error: 'requirementId is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ response: null });
    }

    const companyProfileId = profileResult[0].id;

    // Get saved response
    const responseResult = await sql`
      SELECT
        id,
        response_text,
        word_count,
        status,
        version,
        ai_generated,
        created_at,
        updated_at
      FROM bid_responses
      WHERE requirement_id = ${requirementId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (responseResult.length === 0) {
      return NextResponse.json({ response: null });
    }

    const savedResponse = responseResult[0];

    return NextResponse.json({
      id: savedResponse.id,
      responseText: savedResponse.response_text,
      wordCount: savedResponse.word_count,
      status: savedResponse.status,
      version: savedResponse.version,
      aiGenerated: savedResponse.ai_generated,
      createdAt: savedResponse.created_at,
      updatedAt: savedResponse.updated_at,
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response' },
      { status: 500 }
    );
  }
}
