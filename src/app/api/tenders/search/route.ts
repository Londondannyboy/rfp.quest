import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const keyword = searchParams.get('keyword') || '';
    const buyerName = searchParams.get('buyerName') || '';
    const stage = searchParams.get('stage') || '';
    const sortBy = searchParams.get('sortBy') || 'published_date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    // Get total count first
    let totalCount: number;
    let tenders: Record<string, unknown>[];

    // Build queries based on filters
    // Using separate queries for different filter combinations for type safety with Neon
    if (keyword && buyerName && stage) {
      const keywordPattern = `%${keyword}%`;
      const buyerPattern = `%${buyerName}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND buyer_name ILIKE ${buyerPattern}
        AND stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND buyer_name ILIKE ${buyerPattern}
        AND stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (keyword && buyerName) {
      const keywordPattern = `%${keyword}%`;
      const buyerPattern = `%${buyerName}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND buyer_name ILIKE ${buyerPattern}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND buyer_name ILIKE ${buyerPattern}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (keyword && stage) {
      const keywordPattern = `%${keyword}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern})
        AND stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (buyerName && stage) {
      const buyerPattern = `%${buyerName}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE buyer_name ILIKE ${buyerPattern}
        AND stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE buyer_name ILIKE ${buyerPattern}
        AND stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (keyword) {
      const keywordPattern = `%${keyword}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (buyerName) {
      const buyerPattern = `%${buyerName}%`;
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders WHERE buyer_name ILIKE ${buyerPattern}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE buyer_name ILIKE ${buyerPattern}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (stage) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders WHERE stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      // No filters - get all
      const countResult = await sql`SELECT COUNT(*) as total FROM tenders`;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Transform to match expected format
    const transformedTenders = tenders.map((t) => ({
      id: t.id as string,
      ocid: t.ocid as string,
      title: t.title as string,
      description: t.description as string | null,
      status: t.status as string | null,
      stage: t.stage as string,
      buyerName: t.buyer_name as string,
      buyerId: t.buyer_id as string | null,
      valueAmount: t.value_amount ? parseFloat(t.value_amount as string) : null,
      valueCurrency: t.value_currency as string,
      valueMin: t.value_min ? parseFloat(t.value_min as string) : null,
      valueMax: t.value_max ? parseFloat(t.value_max as string) : null,
      publishedDate: t.published_date as string,
      tenderStartDate: t.tender_start_date as string | null,
      tenderEndDate: t.tender_end_date as string | null,
      cpvCodes: t.cpv_codes as string[],
      region: t.region as string | null,
      syncedAt: t.synced_at as string,
    }));

    return NextResponse.json({
      tenders: transformedTenders,
      totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount,
    });
  } catch (error) {
    console.error('Tender search error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search tenders',
      },
      { status: 500 }
    );
  }
}
