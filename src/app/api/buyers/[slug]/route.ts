import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

// CPV Division names
const cpvDivisions: Record<string, string> = {
  '45': 'Construction',
  '48': 'Software',
  '50': 'Maintenance',
  '55': 'Hospitality',
  '60': 'Transport',
  '64': 'Telecoms',
  '65': 'Utilities',
  '66': 'Finance',
  '70': 'Real Estate',
  '71': 'Engineering',
  '72': 'IT Services',
  '73': 'R&D',
  '75': 'Government',
  '77': 'Agriculture',
  '79': 'Business Services',
  '80': 'Education',
  '85': 'Healthcare',
  '90': 'Environment',
  '92': 'Culture',
  '98': 'Other',
};

// Sector to Unsplash search term mapping
const sectorImages: Record<string, string> = {
  'Construction': 'construction site building',
  'Software': 'technology software office',
  'IT Services': 'data center technology',
  'Healthcare': 'hospital medical healthcare',
  'Education': 'university education campus',
  'Transport': 'transport logistics vehicles',
  'Environment': 'sustainability green environment',
  'Engineering': 'engineering blueprint design',
  'Finance': 'finance business city',
  'Government': 'government building civic',
  'Utilities': 'power energy utilities',
  'R&D': 'research laboratory science',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sql = neon(process.env.DATABASE_URL!);

    // Find buyer by slug match
    const buyerResult = await sql`
      SELECT DISTINCT buyer_name, buyer_id, region
      FROM tenders
      WHERE buyer_name IS NOT NULL
      ORDER BY buyer_name
    `;

    // Find the buyer whose slugified name matches
    const buyer = buyerResult.find(
      (b) => slugify(b.buyer_name as string) === slug
    );

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const buyerName = buyer.buyer_name as string;

    // Get all tenders for this buyer
    const tenders = await sql`
      SELECT
        ocid, slug, title, description, stage, status,
        value_min, value_max, value_currency,
        published_date, tender_end_date,
        cpv_codes, region
      FROM tenders
      WHERE buyer_name = ${buyerName}
      ORDER BY published_date DESC
    `;

    // Calculate stats
    const totalTenders = tenders.length;
    const activeTenders = tenders.filter((t) => t.stage === 'tender').length;
    const totalValue = tenders.reduce(
      (sum, t) => sum + (Number(t.value_max) || 0),
      0
    );
    const avgValue = totalTenders > 0 ? totalValue / totalTenders : 0;

    // Get sector breakdown
    const sectorCounts: Record<string, number> = {};
    const sectorValues: Record<string, number> = {};
    tenders.forEach((t) => {
      const cpvCodes = t.cpv_codes as string[] | null;
      if (cpvCodes && cpvCodes.length > 0) {
        const division = cpvCodes[0].substring(0, 2);
        const sectorName = cpvDivisions[division] || 'Other';
        sectorCounts[sectorName] = (sectorCounts[sectorName] || 0) + 1;
        sectorValues[sectorName] =
          (sectorValues[sectorName] || 0) + (Number(t.value_max) || 0);
      }
    });

    const sectors = Object.entries(sectorCounts)
      .map(([name, count]) => ({
        name,
        count,
        value: sectorValues[name] || 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Determine primary sector for hero image
    const primarySector = sectors[0]?.name || 'Government';
    const imageSearch = sectorImages[primarySector] || 'business corporate office';

    // Get spending by year
    const spendingByYear: Record<string, { count: number; value: number }> = {};
    tenders.forEach((t) => {
      const year = new Date(t.published_date as string).getFullYear().toString();
      if (!spendingByYear[year]) {
        spendingByYear[year] = { count: 0, value: 0 };
      }
      spendingByYear[year].count += 1;
      spendingByYear[year].value += Number(t.value_max) || 0;
    });

    const yearlyTrend = Object.entries(spendingByYear)
      .map(([year, data]) => ({ year, ...data }))
      .sort((a, b) => a.year.localeCompare(b.year));

    // Get regions
    const regions = [...new Set(tenders.map((t) => t.region).filter(Boolean))];

    return NextResponse.json({
      buyer: {
        name: buyerName,
        slug: slugify(buyerName),
        id: buyer.buyer_id,
        primaryRegion: buyer.region || regions[0] || null,
        regions,
        primarySector,
        imageSearch,
      },
      stats: {
        totalTenders,
        activeTenders,
        totalValue,
        avgValue,
        sectors,
        yearlyTrend,
      },
      tenders: tenders.map((t) => ({
        ocid: t.ocid,
        slug: t.slug,
        title: t.title,
        stage: t.stage,
        status: t.status,
        valueMax: t.value_max ? Number(t.value_max) : null,
        publishedDate: t.published_date,
        tenderEndDate: t.tender_end_date,
        region: t.region,
      })),
    });
  } catch (error) {
    console.error('Buyer API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer data' },
      { status: 500 }
    );
  }
}
