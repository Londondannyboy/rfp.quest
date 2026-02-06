import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

interface RelatedTender {
  ocid: string;
  slug: string;
  title: string;
  buyerName: string;
  stage: string;
  valueMax: number | null;
  region: string | null;
  relation: 'same_buyer' | 'same_region' | 'same_cpv';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ocid: string }> }
) {
  try {
    const { ocid: identifier } = await params;
    const sql = neon(process.env.DATABASE_URL!);

    // First, get the current tender to know its buyer, region, and CPV codes
    const isOcid = identifier.startsWith('ocds-');
    const currentResult = isOcid
      ? await sql`
          SELECT ocid, buyer_name, region, cpv_codes
          FROM tenders WHERE ocid = ${identifier} LIMIT 1
        `
      : await sql`
          SELECT ocid, buyer_name, region, cpv_codes
          FROM tenders WHERE slug = ${identifier} LIMIT 1
        `;

    if (currentResult.length === 0) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }

    const current = currentResult[0];
    const related: RelatedTender[] = [];

    // Get tenders from same buyer (limit 3)
    const sameBuyer = await sql`
      SELECT ocid, slug, title, buyer_name, stage, value_max, region
      FROM tenders
      WHERE buyer_name = ${current.buyer_name}
        AND ocid != ${current.ocid}
      ORDER BY published_date DESC
      LIMIT 3
    `;

    for (const t of sameBuyer) {
      related.push({
        ocid: t.ocid,
        slug: t.slug,
        title: t.title,
        buyerName: t.buyer_name,
        stage: t.stage,
        valueMax: t.value_max ? Number(t.value_max) : null,
        region: t.region,
        relation: 'same_buyer',
      });
    }

    // Get tenders from same region (limit 3)
    if (current.region) {
      const sameRegion = await sql`
        SELECT ocid, slug, title, buyer_name, stage, value_max, region
        FROM tenders
        WHERE region = ${current.region}
          AND ocid != ${current.ocid}
          AND buyer_name != ${current.buyer_name}
        ORDER BY published_date DESC
        LIMIT 3
      `;

      for (const t of sameRegion) {
        if (!related.some(r => r.ocid === t.ocid)) {
          related.push({
            ocid: t.ocid,
            slug: t.slug,
            title: t.title,
            buyerName: t.buyer_name,
            stage: t.stage,
            valueMax: t.value_max ? Number(t.value_max) : null,
            region: t.region,
            relation: 'same_region',
          });
        }
      }
    }

    // Get tenders with similar CPV codes (limit 3)
    if (current.cpv_codes && current.cpv_codes.length > 0) {
      const primaryCpv = current.cpv_codes[0];
      // Match on CPV division (first 2 digits)
      const cpvDivision = primaryCpv.substring(0, 2);

      const sameCpv = await sql`
        SELECT ocid, slug, title, buyer_name, stage, value_max, region
        FROM tenders
        WHERE ocid != ${current.ocid}
          AND cpv_codes IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM unnest(cpv_codes) AS cpv
            WHERE cpv LIKE ${cpvDivision + '%'}
          )
        ORDER BY published_date DESC
        LIMIT 5
      `;

      for (const t of sameCpv) {
        if (!related.some(r => r.ocid === t.ocid)) {
          related.push({
            ocid: t.ocid,
            slug: t.slug,
            title: t.title,
            buyerName: t.buyer_name,
            stage: t.stage,
            valueMax: t.value_max ? Number(t.value_max) : null,
            region: t.region,
            relation: 'same_cpv',
          });
        }
      }
    }

    return NextResponse.json({
      current: {
        ocid: current.ocid,
        buyerName: current.buyer_name,
        region: current.region,
      },
      related: related.slice(0, 9), // Max 9 related tenders
    });
  } catch (error) {
    console.error('Related tenders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related tenders' },
      { status: 500 }
    );
  }
}
