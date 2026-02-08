import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { authServer } from '@/lib/auth/server';

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

// Value distribution buckets
const VALUE_BUCKETS = [
  { label: 'Under £50k', min: 0, max: 50000 },
  { label: '£50k - £100k', min: 50000, max: 100000 },
  { label: '£100k - £500k', min: 100000, max: 500000 },
  { label: '£500k - £1M', min: 500000, max: 1000000 },
  { label: 'Over £1M', min: 1000000, max: Infinity },
];

export interface DashboardStats {
  totalOpportunities: number;
  matchedCount: number;
  matchedPercentage: number;
  averageValue: number;
  topSector: { name: string; count: number; division: string } | null;
  sectorBreakdown: Array<{
    sector: string;
    division: string;
    count: number;
    percentage: number;
  }>;
  valueDistribution: Array<{
    bucket: string;
    count: number;
    min: number;
    max: number;
  }>;
  regionalDistribution: Array<{
    region: string;
    count: number;
    percentage: number;
  }>;
  upcomingDeadlines: Array<{
    title: string;
    ocid: string;
    slug: string;
    deadline: string;
    daysRemaining: number;
    buyerName: string | null;
  }>;
  lastUpdated: string;
}

export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    // Get user's target CPV divisions if logged in
    let targetCpvDivisions: string[] = [];
    if (session?.user) {
      const profileResult = await sql`
        SELECT target_cpv_divisions FROM company_profiles WHERE user_id = ${session.user.id}
      `;
      if (profileResult.length > 0 && profileResult[0].target_cpv_divisions) {
        targetCpvDivisions = profileResult[0].target_cpv_divisions as string[];
      }
    }

    // Total live opportunities (stage = 'tender')
    const totalResult = await sql`
      SELECT COUNT(*) as count FROM tenders WHERE stage = 'tender'
    `;
    const totalOpportunities = Number(totalResult[0]?.count) || 0;

    // Matched opportunities (if user has CPV preferences)
    let matchedCount = 0;
    if (targetCpvDivisions.length > 0) {
      const matchedResult = await sql`
        SELECT COUNT(*) as count
        FROM tenders
        WHERE stage = 'tender'
          AND cpv_codes IS NOT NULL
          AND array_length(cpv_codes, 1) > 0
          AND LEFT(cpv_codes[1], 2) = ANY(${targetCpvDivisions})
      `;
      matchedCount = Number(matchedResult[0]?.count) || 0;
    }
    const matchedPercentage = totalOpportunities > 0
      ? Math.round((matchedCount / totalOpportunities) * 100)
      : 0;

    // Average value
    const avgResult = await sql`
      SELECT AVG(COALESCE(value_max, value_amount, 0))::numeric as avg_value
      FROM tenders
      WHERE stage = 'tender'
        AND (value_max > 0 OR value_amount > 0)
    `;
    const averageValue = Math.round(Number(avgResult[0]?.avg_value) || 0);

    // Sector breakdown
    const sectorResult = await sql`
      SELECT
        LEFT(cpv_codes[1], 2) as division,
        COUNT(*) as count
      FROM tenders
      WHERE stage = 'tender'
        AND cpv_codes IS NOT NULL
        AND array_length(cpv_codes, 1) > 0
      GROUP BY LEFT(cpv_codes[1], 2)
      ORDER BY count DESC
      LIMIT 10
    `;

    const sectorTotal = sectorResult.reduce((sum, row) => sum + Number(row.count), 0);
    const sectorBreakdown = sectorResult.map((row) => ({
      sector: cpvDivisions[row.division as string] || `CPV ${row.division}`,
      division: row.division as string,
      count: Number(row.count),
      percentage: sectorTotal > 0 ? Math.round((Number(row.count) / sectorTotal) * 100) : 0,
    }));

    const topSector = sectorBreakdown.length > 0
      ? { name: sectorBreakdown[0].sector, count: sectorBreakdown[0].count, division: sectorBreakdown[0].division }
      : null;

    // Value distribution
    const valueResults = await Promise.all(
      VALUE_BUCKETS.map(async (bucket) => {
        const result = await sql`
          SELECT COUNT(*) as count
          FROM tenders
          WHERE stage = 'tender'
            AND COALESCE(value_max, value_amount, 0) >= ${bucket.min}
            AND COALESCE(value_max, value_amount, 0) < ${bucket.max === Infinity ? 999999999999 : bucket.max}
        `;
        return {
          bucket: bucket.label,
          count: Number(result[0]?.count) || 0,
          min: bucket.min,
          max: bucket.max === Infinity ? 999999999999 : bucket.max,
        };
      })
    );
    const valueDistribution = valueResults;

    // Regional distribution
    const regionResult = await sql`
      SELECT
        COALESCE(region, 'UK-wide') as region,
        COUNT(*) as count
      FROM tenders
      WHERE stage = 'tender'
      GROUP BY COALESCE(region, 'UK-wide')
      ORDER BY count DESC
    `;

    const regionTotal = regionResult.reduce((sum, row) => sum + Number(row.count), 0);
    const regionalDistribution = regionResult.map((row) => ({
      region: row.region as string,
      count: Number(row.count),
      percentage: regionTotal > 0 ? Math.round((Number(row.count) / regionTotal) * 100) : 0,
    }));

    // Upcoming deadlines (next 5 tenders ending soon)
    const deadlineResult = await sql`
      SELECT
        title,
        ocid,
        slug,
        tender_end_date,
        buyer_name
      FROM tenders
      WHERE stage = 'tender'
        AND tender_end_date IS NOT NULL
        AND tender_end_date > NOW()
      ORDER BY tender_end_date ASC
      LIMIT 5
    `;

    const upcomingDeadlines = deadlineResult.map((row) => {
      const deadline = new Date(row.tender_end_date as string);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        title: row.title as string,
        ocid: row.ocid as string,
        slug: row.slug as string,
        deadline: (row.tender_end_date as Date).toISOString(),
        daysRemaining,
        buyerName: row.buyer_name as string | null,
      };
    });

    const stats: DashboardStats = {
      totalOpportunities,
      matchedCount,
      matchedPercentage,
      averageValue,
      topSector,
      sectorBreakdown,
      valueDistribution,
      regionalDistribution,
      upcomingDeadlines,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
