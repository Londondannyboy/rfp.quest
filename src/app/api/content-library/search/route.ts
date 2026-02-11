import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

// GET /api/content-library/search - Search content library for relevant items
// Used by the response generator to find relevant boilerplate, case studies, etc.
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const types = searchParams.get('types')?.split(',').filter(Boolean);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Search for relevant content
    // Using simple text matching - could be enhanced with vector embeddings later
    let items;

    if (types && types.length > 0) {
      items = await sql`
        SELECT
          id,
          type,
          title,
          content,
          tags,
          usage_count,
          CASE
            WHEN title ILIKE ${'%' + query + '%'} THEN 3
            WHEN content ILIKE ${'%' + query + '%'} THEN 2
            WHEN EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE ${'%' + query + '%'}) THEN 1
            ELSE 0
          END AS relevance_score
        FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND type = ANY(${types})
        AND (
          title ILIKE ${'%' + query + '%'}
          OR content ILIKE ${'%' + query + '%'}
          OR EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE ${'%' + query + '%'})
        )
        ORDER BY relevance_score DESC, usage_count DESC
        LIMIT ${limit}
      `;
    } else {
      items = await sql`
        SELECT
          id,
          type,
          title,
          content,
          tags,
          usage_count,
          CASE
            WHEN title ILIKE ${'%' + query + '%'} THEN 3
            WHEN content ILIKE ${'%' + query + '%'} THEN 2
            WHEN EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE ${'%' + query + '%'}) THEN 1
            ELSE 0
          END AS relevance_score
        FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND (
          title ILIKE ${'%' + query + '%'}
          OR content ILIKE ${'%' + query + '%'}
          OR EXISTS (SELECT 1 FROM unnest(tags) AS t WHERE t ILIKE ${'%' + query + '%'})
        )
        ORDER BY relevance_score DESC, usage_count DESC
        LIMIT ${limit}
      `;
    }

    // Also search past bid responses for similar questions
    const pastResponses = await sql`
      SELECT
        pbr.id,
        pbr.question_text,
        pbr.response_text,
        pbr.word_count,
        pbr.score_received,
        pbr.max_score,
        pb.tender_title,
        pb.buyer_name,
        pb.outcome
      FROM past_bid_responses pbr
      JOIN past_bids pb ON pb.id = pbr.past_bid_id
      WHERE pb.company_profile_id = ${companyProfileId}
      AND (
        pbr.question_text ILIKE ${'%' + query + '%'}
        OR pbr.response_text ILIKE ${'%' + query + '%'}
      )
      ORDER BY
        CASE WHEN pb.outcome = 'won' THEN 0 ELSE 1 END,
        pbr.score_received DESC NULLS LAST
      LIMIT ${limit}
    `;

    return NextResponse.json({
      contentItems: items.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        tags: item.tags,
        usageCount: item.usage_count,
        relevanceScore: item.relevance_score,
      })),
      pastResponses: pastResponses.map((pr) => ({
        id: pr.id,
        questionText: pr.question_text,
        responseText: pr.response_text,
        wordCount: pr.word_count,
        scoreReceived: pr.score_received,
        maxScore: pr.max_score,
        tenderTitle: pr.tender_title,
        buyerName: pr.buyer_name,
        outcome: pr.outcome,
      })),
    });
  } catch (error) {
    console.error('Error searching content library:', error);
    return NextResponse.json(
      { error: 'Failed to search content library' },
      { status: 500 }
    );
  }
}
