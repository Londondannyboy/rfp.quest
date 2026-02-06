import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

interface RouteParams {
  params: Promise<{ ocid: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { ocid } = await params;

    if (!ocid) {
      return NextResponse.json(
        { error: 'Identifier is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Support lookup by slug or OCID
    const isOcid = ocid.startsWith('ocds-');

    const result = isOcid
      ? await sql`
          SELECT
            ocid,
            slug,
            title,
            description,
            stage,
            status,
            buyer_name,
            buyer_id,
            value_min,
            value_max,
            value_currency,
            tender_start_date,
            tender_end_date,
            contract_start_date,
            contract_end_date,
            published_date,
            cpv_codes,
            region,
            created_at,
            updated_at
          FROM tenders
          WHERE ocid = ${ocid}
          LIMIT 1
        `
      : await sql`
          SELECT
            ocid,
            slug,
            title,
            description,
            stage,
            status,
            buyer_name,
            buyer_id,
            value_min,
            value_max,
            value_currency,
            tender_start_date,
            tender_end_date,
            contract_start_date,
            contract_end_date,
            published_date,
            cpv_codes,
            region,
            created_at,
            updated_at
          FROM tenders
          WHERE slug = ${ocid}
          LIMIT 1
        `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Tender not found' },
        { status: 404 }
      );
    }

    const row = result[0];

    // Transform to camelCase for frontend
    const tender = {
      ocid: row.ocid,
      slug: row.slug,
      title: row.title,
      description: row.description,
      stage: row.stage,
      status: row.status,
      buyerName: row.buyer_name,
      buyerId: row.buyer_id,
      valueMin: row.value_min ? Number(row.value_min) : null,
      valueMax: row.value_max ? Number(row.value_max) : null,
      valueCurrency: row.value_currency || 'GBP',
      tenderStartDate: row.tender_start_date,
      tenderEndDate: row.tender_end_date,
      contractStartDate: row.contract_start_date,
      contractEndDate: row.contract_end_date,
      publishedDate: row.published_date,
      cpvCodes: row.cpv_codes,
      region: row.region,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return NextResponse.json(tender);
  } catch (error) {
    console.error('Tender fetch error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch tender',
      },
      { status: 500 }
    );
  }
}
