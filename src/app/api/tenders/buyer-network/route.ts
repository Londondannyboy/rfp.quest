import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const focus = searchParams.get('focus'); // Optional: buyer to focus on

    const sql = neon(process.env.DATABASE_URL!);

    // Get top buyers with their tender stats (simplified query)
    const query = region
      ? sql`
        SELECT
          buyer_name as id,
          buyer_name as name,
          COUNT(*) as tender_count,
          COALESCE(SUM(value_max), 0) as total_value,
          region,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE buyer_name IS NOT NULL
          AND region = ${region}
        GROUP BY buyer_name, region
        ORDER BY COUNT(*) DESC
        LIMIT 25
      `
      : sql`
        SELECT
          buyer_name as id,
          buyer_name as name,
          COUNT(*) as tender_count,
          COALESCE(SUM(value_max), 0) as total_value,
          region,
          COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders
        FROM tenders
        WHERE buyer_name IS NOT NULL
        GROUP BY buyer_name, region
        ORDER BY COUNT(*) DESC
        LIMIT 25
      `;

    const result = await query;

    const buyers = result.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      tenderCount: Number(row.tender_count),
      totalValue: Number(row.total_value) || 0,
      region: row.region as string | null,
      activeTenders: Number(row.active_tenders) || 0,
    }));

    // Generate connections between buyers based on shared region
    const connections: { from: string; to: string; strength: number }[] = [];

    for (let i = 0; i < buyers.length; i++) {
      for (let j = i + 1; j < buyers.length; j++) {
        // Connect buyers in the same region
        if (buyers[i].region && buyers[i].region === buyers[j].region) {
          connections.push({
            from: buyers[i].id,
            to: buyers[j].id,
            strength: 5,
          });
        }
      }
    }

    // Limit connections to top ones
    const topConnections = connections.slice(0, 50);

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
