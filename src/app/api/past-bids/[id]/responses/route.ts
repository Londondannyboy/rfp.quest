import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/past-bids/[id]/responses - Add a response to a past bid
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: pastBidId } = await params;
    const body = await request.json();
    const {
      questionNumber,
      questionText,
      responseText,
      scoreReceived,
      maxScore,
      evaluatorFeedback,
      tags = [],
    } = body;

    if (!questionText || !responseText) {
      return NextResponse.json(
        { error: 'questionText and responseText are required' },
        { status: 400 }
      );
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Verify past bid belongs to user
    const bidResult = await sql`
      SELECT id FROM past_bids
      WHERE id = ${pastBidId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (bidResult.length === 0) {
      return NextResponse.json({ error: 'Past bid not found' }, { status: 404 });
    }

    // Calculate word count
    const wordCount = responseText.trim().split(/\s+/).filter(Boolean).length;

    // Insert response
    const result = await sql`
      INSERT INTO past_bid_responses (
        past_bid_id,
        question_number,
        question_text,
        response_text,
        word_count,
        score_received,
        max_score,
        evaluator_feedback,
        tags
      ) VALUES (
        ${pastBidId},
        ${questionNumber || null},
        ${questionText},
        ${responseText},
        ${wordCount},
        ${scoreReceived || null},
        ${maxScore || null},
        ${evaluatorFeedback || null},
        ${tags}
      )
      RETURNING *
    `;

    const response = result[0];

    return NextResponse.json({
      response: {
        id: response.id,
        questionNumber: response.question_number,
        questionText: response.question_text,
        responseText: response.response_text,
        wordCount: response.word_count,
        scoreReceived: response.score_received,
        maxScore: response.max_score,
        evaluatorFeedback: response.evaluator_feedback,
        tags: response.tags,
      },
      message: 'Response added successfully',
    });
  } catch (error) {
    console.error('Error adding response:', error);
    return NextResponse.json(
      { error: 'Failed to add response' },
      { status: 500 }
    );
  }
}

// DELETE /api/past-bids/[id]/responses?responseId=XXX - Delete a response
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: pastBidId } = await params;
    const { searchParams } = new URL(request.url);
    const responseId = searchParams.get('responseId');

    if (!responseId) {
      return NextResponse.json({ error: 'responseId is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Verify past bid belongs to user
    const bidResult = await sql`
      SELECT id FROM past_bids
      WHERE id = ${pastBidId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (bidResult.length === 0) {
      return NextResponse.json({ error: 'Past bid not found' }, { status: 404 });
    }

    // Delete response
    const result = await sql`
      DELETE FROM past_bid_responses
      WHERE id = ${responseId}
      AND past_bid_id = ${pastBidId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    return NextResponse.json(
      { error: 'Failed to delete response' },
      { status: 500 }
    );
  }
}
