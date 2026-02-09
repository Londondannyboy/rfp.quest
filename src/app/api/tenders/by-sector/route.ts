import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

// CPV Division names
const cpvDivisions: Record<string, string> = {
  '45': 'Construction',
  '48': 'Software & IT Systems',
  '50': 'Repair & Maintenance',
  '55': 'Hospitality',
  '60': 'Transport',
  '64': 'Telecommunications',
  '65': 'Utilities',
  '66': 'Financial Services',
  '70': 'Real Estate',
  '71': 'Engineering & Architecture',
  '72': 'IT Services',
  '73': 'Research & Development',
  '75': 'Public Administration',
  '77': 'Agriculture & Forestry',
  '79': 'Business Services',
  '80': 'Education',
  '85': 'Healthcare',
  '90': 'Environment & Waste',
  '92': 'Recreation & Culture',
  '98': 'Other Services',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');

    const sql = neon(process.env.DATABASE_URL!);

    // Get sector breakdown from CPV codes (simplified query for compatibility)
    const query = region
      ? sql`
        SELECT
          LEFT(cpv_codes[1], 2) as division,
          COUNT(*) as count,
          COALESCE(SUM(value_max), 0) as total_value,
          COALESCE(AVG(value_max), 0) as avg_value,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE cpv_codes IS NOT NULL
          AND array_length(cpv_codes, 1) > 0
          AND region = ${region}
        GROUP BY LEFT(cpv_codes[1], 2)
        ORDER BY count DESC
        LIMIT 20
      `
      : sql`
        SELECT
          LEFT(cpv_codes[1], 2) as division,
          COUNT(*) as count,
          COALESCE(SUM(value_max), 0) as total_value,
          COALESCE(AVG(value_max), 0) as avg_value,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE cpv_codes IS NOT NULL
          AND array_length(cpv_codes, 1) > 0
        GROUP BY LEFT(cpv_codes[1], 2)
        ORDER BY count DESC
        LIMIT 20
      `;

    const result = await query;

    const sectors = result.map((row) => ({
      sector: cpvDivisions[row.division as string] || `CPV ${row.division}`,
      division: row.division as string,
      count: Number(row.count),
      totalValue: Number(row.total_value) || 0,
      avgValue: Number(row.avg_value) || 0,
      activeTenders: Number(row.active_tenders) || 0,
    }));

    return NextResponse.json({ sectors });
  } catch (error) {
    console.error('By-sector API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sector data' },
      { status: 500 }
    );
  }
}
