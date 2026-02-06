import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

// CPV Division names for sector labels
const cpvDivisions: Record<string, string> = {
  '45': 'Construction',
  '48': 'Software',
  '50': 'Maintenance',
  '60': 'Transport',
  '65': 'Utilities',
  '71': 'Engineering',
  '72': 'IT Services',
  '73': 'R&D',
  '75': 'Government',
  '79': 'Business',
  '80': 'Education',
  '85': 'Healthcare',
  '90': 'Environment',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const focus = searchParams.get('focus'); // Optional: buyer to focus on

    const sql = neon(process.env.DATABASE_URL!);

    // Get top buyers with their tender stats
    let query;
    if (region) {
      query = sql`
        SELECT
          buyer_name as id,
          buyer_name as name,
          COUNT(*) as tender_count,
          SUM(COALESCE(value_max, 0)) as total_value,
          region,
          array_agg(DISTINCT LEFT(cpv_codes[1], 2)) FILTER (WHERE cpv_codes IS NOT NULL) as sector_divisions,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE buyer_name IS NOT NULL
          AND region = ${region}
        GROUP BY buyer_name, region
        ORDER BY COUNT(*) DESC
        LIMIT 25
      `;
    } else {
      query = sql`
        SELECT
          buyer_name as id,
          buyer_name as name,
          COUNT(*) as tender_count,
          SUM(COALESCE(value_max, 0)) as total_value,
          region,
          array_agg(DISTINCT LEFT(cpv_codes[1], 2)) FILTER (WHERE cpv_codes IS NOT NULL) as sector_divisions,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE buyer_name IS NOT NULL
        GROUP BY buyer_name, region
        ORDER BY COUNT(*) DESC
        LIMIT 25
      `;
    }

    const result = await query;

    const buyers = result.map((row) => {
      const sectorDivisions = (row.sector_divisions as string[]) || [];
      const sectors = sectorDivisions
        .filter(d => d && cpvDivisions[d])
        .map(d => cpvDivisions[d]);

      return {
        id: row.id as string,
        name: row.name as string,
        tenderCount: Number(row.tender_count),
        totalValue: Number(row.total_value) || 0,
        region: row.region as string | null,
        sectors: [...new Set(sectors)],
        activeTenders: Number(row.active_tenders) || 0,
      };
    });

    // Generate connections between buyers based on shared sectors
    const connections: { from: string; to: string; sharedSectors: string[]; strength: number }[] = [];

    for (let i = 0; i < buyers.length; i++) {
      for (let j = i + 1; j < buyers.length; j++) {
        const shared = buyers[i].sectors.filter(s => buyers[j].sectors.includes(s));
        if (shared.length > 0) {
          connections.push({
            from: buyers[i].id,
            to: buyers[j].id,
            sharedSectors: shared,
            strength: Math.min(shared.length * 3, 10),
          });
        }
      }
    }

    // Limit connections to strongest ones
    const topConnections = connections
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 50);

    return NextResponse.json({
      buyers,
      connections: topConnections,
      focusBuyer: focus,
    });
  } catch (error) {
    console.error('Buyer network API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer network data' },
      { status: 500 }
    );
  }
}
