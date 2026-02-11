import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/past-bids/[id] - Get a single past bid with responses
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Get past bid
    const bidResult = await sql`
      SELECT * FROM past_bids
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
    `;

    if (bidResult.length === 0) {
      return NextResponse.json({ error: 'Past bid not found' }, { status: 404 });
    }

    const bid = bidResult[0];

    // Get responses for this bid
    const responsesResult = await sql`
      SELECT * FROM past_bid_responses
      WHERE past_bid_id = ${id}
      ORDER BY question_number, created_at
    `;

    return NextResponse.json({
      bid: {
        id: bid.id,
        tenderTitle: bid.tender_title,
        buyerName: bid.buyer_name,
        contractValue: bid.contract_value,
        outcome: bid.outcome,
        submissionDate: bid.submission_date,
        awardDate: bid.award_date,
        sector: bid.sector,
        lessonsLearned: bid.lessons_learned,
        winThemes: bid.win_themes,
        createdAt: bid.created_at,
      },
      responses: responsesResult.map((r) => ({
        id: r.id,
        questionNumber: r.question_number,
        questionText: r.question_text,
        responseText: r.response_text,
        wordCount: r.word_count,
        scoreReceived: r.score_received,
        maxScore: r.max_score,
        evaluatorFeedback: r.evaluator_feedback,
        tags: r.tags,
      })),
    });
  } catch (error) {
    console.error('Error fetching past bid:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past bid' },
      { status: 500 }
    );
  }
}

// PUT /api/past-bids/[id] - Update a past bid
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      tenderTitle,
      buyerName,
      contractValue,
      outcome,
      submissionDate,
      awardDate,
      sector,
      lessonsLearned,
      winThemes,
    } = body;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Update past bid
    const result = await sql`
      UPDATE past_bids
      SET
        tender_title = COALESCE(${tenderTitle}, tender_title),
        buyer_name = COALESCE(${buyerName}, buyer_name),
        contract_value = COALESCE(${contractValue}, contract_value),
        outcome = COALESCE(${outcome}, outcome),
        submission_date = COALESCE(${submissionDate}, submission_date),
        award_date = COALESCE(${awardDate}, award_date),
        sector = COALESCE(${sector}, sector),
        lessons_learned = COALESCE(${lessonsLearned}, lessons_learned),
        win_themes = COALESCE(${winThemes}, win_themes),
        updated_at = NOW()
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Past bid not found' }, { status: 404 });
    }

    return NextResponse.json({
      bid: result[0],
      message: 'Past bid updated successfully',
    });
  } catch (error) {
    console.error('Error updating past bid:', error);
    return NextResponse.json(
      { error: 'Failed to update past bid' },
      { status: 500 }
    );
  }
}

// DELETE /api/past-bids/[id] - Delete a past bid
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Delete past bid (responses will cascade delete)
    const result = await sql`
      DELETE FROM past_bids
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Past bid not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Past bid deleted successfully' });
  } catch (error) {
    console.error('Error deleting past bid:', error);
    return NextResponse.json(
      { error: 'Failed to delete past bid' },
      { status: 500 }
    );
  }
}
