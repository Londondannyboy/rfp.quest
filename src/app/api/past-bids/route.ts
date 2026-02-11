import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

export interface PastBid {
  id: string;
  tenderTitle: string;
  buyerName: string | null;
  contractValue: number | null;
  outcome: 'won' | 'lost' | 'pending' | 'withdrawn';
  submissionDate: string | null;
  awardDate: string | null;
  sector: string | null;
  lessonsLearned: string | null;
  winThemes: string[];
  responseCount: number;
  createdAt: string;
}

// GET /api/past-bids - List all past bids
export async function GET() {
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
      return NextResponse.json({ bids: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Get all past bids with response counts
    const bidsResult = await sql`
      SELECT
        pb.id,
        pb.tender_title,
        pb.buyer_name,
        pb.contract_value,
        pb.outcome,
        pb.submission_date,
        pb.award_date,
        pb.sector,
        pb.lessons_learned,
        pb.win_themes,
        pb.created_at,
        COUNT(pbr.id) as response_count
      FROM past_bids pb
      LEFT JOIN past_bid_responses pbr ON pbr.past_bid_id = pb.id
      WHERE pb.company_profile_id = ${companyProfileId}
      GROUP BY pb.id
      ORDER BY pb.submission_date DESC NULLS LAST, pb.created_at DESC
    `;

    const bids: PastBid[] = bidsResult.map((row) => ({
      id: row.id as string,
      tenderTitle: row.tender_title as string,
      buyerName: row.buyer_name as string | null,
      contractValue: row.contract_value ? Number(row.contract_value) : null,
      outcome: row.outcome as PastBid['outcome'],
      submissionDate: row.submission_date as string | null,
      awardDate: row.award_date as string | null,
      sector: row.sector as string | null,
      lessonsLearned: row.lessons_learned as string | null,
      winThemes: (row.win_themes || []) as string[],
      responseCount: Number(row.response_count) || 0,
      createdAt: row.created_at as string,
    }));

    // Stats
    const stats = {
      total: bids.length,
      won: bids.filter(b => b.outcome === 'won').length,
      lost: bids.filter(b => b.outcome === 'lost').length,
      pending: bids.filter(b => b.outcome === 'pending').length,
      winRate: bids.filter(b => b.outcome === 'won' || b.outcome === 'lost').length > 0
        ? Math.round((bids.filter(b => b.outcome === 'won').length / bids.filter(b => b.outcome === 'won' || b.outcome === 'lost').length) * 100)
        : 0,
      totalValue: bids.filter(b => b.outcome === 'won' && b.contractValue).reduce((sum, b) => sum + (b.contractValue || 0), 0),
    };

    return NextResponse.json({ bids, stats });
  } catch (error) {
    console.error('Error fetching past bids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past bids' },
      { status: 500 }
    );
  }
}

// POST /api/past-bids - Create a new past bid
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tenderTitle,
      buyerName,
      contractValue,
      outcome = 'pending',
      submissionDate,
      awardDate,
      sector,
      lessonsLearned,
      winThemes = [],
    } = body;

    if (!tenderTitle) {
      return NextResponse.json({ error: 'tenderTitle is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Insert past bid
    const result = await sql`
      INSERT INTO past_bids (
        company_profile_id,
        tender_title,
        buyer_name,
        contract_value,
        outcome,
        submission_date,
        award_date,
        sector,
        lessons_learned,
        win_themes
      ) VALUES (
        ${companyProfileId},
        ${tenderTitle},
        ${buyerName || null},
        ${contractValue || null},
        ${outcome},
        ${submissionDate || null},
        ${awardDate || null},
        ${sector || null},
        ${lessonsLearned || null},
        ${winThemes}
      )
      RETURNING *
    `;

    const bid = result[0];

    return NextResponse.json({
      bid: {
        id: bid.id,
        tenderTitle: bid.tender_title,
        buyerName: bid.buyer_name,
        contractValue: bid.contract_value,
        outcome: bid.outcome,
        submissionDate: bid.submission_date,
        sector: bid.sector,
        createdAt: bid.created_at,
      },
      message: 'Past bid created successfully',
    });
  } catch (error) {
    console.error('Error creating past bid:', error);
    return NextResponse.json(
      { error: 'Failed to create past bid' },
      { status: 500 }
    );
  }
}
