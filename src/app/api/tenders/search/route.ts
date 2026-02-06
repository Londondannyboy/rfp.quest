import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from '@/lib/db';

// Sustainability-related CPV divisions and keywords
const SUSTAINABILITY_CPV_PREFIXES = ['90', '77'];
const SUSTAINABILITY_KEYWORDS = [
  'sustainable', 'sustainability', 'carbon', 'net zero', 'net-zero',
  'climate', 'environmental', 'renewable', 'green energy', 'circular economy',
  'biodiversity', 'eco-friendly', 'decarbonisation', 'decarbonization',
  'emissions', 'recycling', 'waste reduction', 'zero waste'
];

function checkIsSustainability(cpvCodes: string[], title: string, description: string | null): boolean {
  // Check CPV codes
  const hasSustainCpv = cpvCodes.some((code) =>
    SUSTAINABILITY_CPV_PREFIXES.some((prefix) => code.startsWith(prefix))
  );
  if (hasSustainCpv) return true;

  // Check keywords in title/description
  const text = `${title} ${description || ''}`.toLowerCase();
  return SUSTAINABILITY_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const keyword = searchParams.get('keyword') || '';
    const buyerName = searchParams.get('buyerName') || '';
    const stage = searchParams.get('stage') || '';
    const region = searchParams.get('region') || '';
    const minValue = searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : null;
    const maxValue = searchParams.get('maxValue') ? parseInt(searchParams.get('maxValue')!) : null;
    const sustainability = searchParams.get('sustainability') === 'true';
    const cpvDivisions = searchParams.get('cpvDivisions')?.split(',').filter(Boolean) || [];

    // Prepare patterns
    const keywordPattern = keyword ? `%${keyword}%` : '';
    const buyerPattern = buyerName ? `%${buyerName}%` : '';

    // For sustainability, we'll filter client-side after fetching
    // This is simpler than building complex dynamic SQL

    let tenders: Record<string, unknown>[];
    let totalCount: number;

    // Base query - fetch more than limit if we need to filter client-side
    const fetchLimit = sustainability || cpvDivisions.length > 0 ? 500 : limit;

    // Build query based on simple filters
    if (keyword && stage && region) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND stage = ${stage}
        AND region = ${region}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND stage = ${stage}
        AND region = ${region}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (keyword && stage) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (keyword && region) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND region = ${region}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE (title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern})
        AND region = ${region}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (stage && region) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE stage = ${stage} AND region = ${region}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE stage = ${stage} AND region = ${region}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (keyword) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders
        WHERE title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE title ILIKE ${keywordPattern} OR description ILIKE ${keywordPattern} OR buyer_name ILIKE ${keywordPattern}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (buyerName) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders WHERE buyer_name ILIKE ${buyerPattern}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE buyer_name ILIKE ${buyerPattern}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (stage) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders WHERE stage = ${stage}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE stage = ${stage}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else if (region) {
      const countResult = await sql`
        SELECT COUNT(*) as total FROM tenders WHERE region = ${region}
      `;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        WHERE region = ${region}
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    } else {
      // No basic filters - get all
      const countResult = await sql`SELECT COUNT(*) as total FROM tenders`;
      totalCount = parseInt(countResult[0].total as string);

      tenders = await sql`
        SELECT id, ocid, slug, title, description, status, stage, buyer_name, buyer_id,
               value_amount, value_currency, value_min, value_max,
               published_date, tender_start_date, tender_end_date, cpv_codes, region, synced_at
        FROM tenders
        ORDER BY published_date DESC NULLS LAST
        LIMIT ${fetchLimit} OFFSET ${offset}
      `;
    }

    // Transform and apply client-side filters
    let transformedTenders = tenders.map((t) => {
      const cpvCodes = (t.cpv_codes as string[]) || [];
      const isSustainability = checkIsSustainability(
        cpvCodes,
        t.title as string,
        t.description as string | null
      );

      return {
        id: t.id as string,
        ocid: t.ocid as string,
        slug: t.slug as string,
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
        cpvCodes,
        region: t.region as string | null,
        syncedAt: t.synced_at as string,
        isSustainability,
      };
    });

    // Apply sustainability filter
    if (sustainability) {
      transformedTenders = transformedTenders.filter((t) => t.isSustainability);
    }

    // Apply CPV division filter
    if (cpvDivisions.length > 0) {
      transformedTenders = transformedTenders.filter((t) =>
        t.cpvCodes.some((code) =>
          cpvDivisions.some((div) => code.startsWith(div))
        )
      );
    }

    // Apply value range filters
    if (minValue !== null) {
      transformedTenders = transformedTenders.filter((t) =>
        (t.valueAmount !== null && t.valueAmount >= minValue) ||
        (t.valueMin !== null && t.valueMin >= minValue) ||
        (t.valueMax !== null && t.valueMax >= minValue)
      );
    }
    if (maxValue !== null) {
      transformedTenders = transformedTenders.filter((t) =>
        (t.valueAmount !== null && t.valueAmount <= maxValue) ||
        (t.valueMin !== null && t.valueMin <= maxValue) ||
        (t.valueMax !== null && t.valueMax <= maxValue)
      );
    }

    // Update count after client-side filtering
    const filteredCount = transformedTenders.length;

    // Apply pagination to filtered results
    const paginatedTenders = transformedTenders.slice(0, limit);

    return NextResponse.json({
      tenders: paginatedTenders,
      totalCount: sustainability || cpvDivisions.length > 0 || minValue !== null || maxValue !== null
        ? filteredCount
        : totalCount,
      limit,
      offset,
      hasMore: paginatedTenders.length === limit && filteredCount > limit,
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
