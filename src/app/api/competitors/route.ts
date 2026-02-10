import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CompetitorData {
  competitors: Array<{
    name: string;
    confidence: number;
    source?: string;
  }>;
  incumbent: {
    name: string;
    contractPeriod?: string;
  } | null;
  enrichedAt: string;
  expiresAt: string;
}

// In-memory cache as fallback if DB table doesn't exist
const memoryCache = new Map<string, { data: CompetitorData; expiresAt: Date }>();

// GET /api/competitors?ocid=X&buyerName=Y&sector=Z
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ocid = searchParams.get('ocid');
    const buyerName = searchParams.get('buyerName');
    const sector = searchParams.get('sector');

    if (!ocid || !buyerName) {
      return NextResponse.json(
        { error: 'ocid and buyerName are required' },
        { status: 400 }
      );
    }

    // Try to get from cache first
    const cached = await getCachedEnrichment(ocid);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch fresh competitor data
    const enriched = await enrichCompetitors(ocid, buyerName, sector || 'general');

    // Cache the result
    await cacheEnrichment(ocid, buyerName, sector || 'general', enriched);

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Competitor enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor data' },
      { status: 500 }
    );
  }
}

async function getCachedEnrichment(ocid: string): Promise<CompetitorData | null> {
  // Try database first
  try {
    const result = await sql`
      SELECT competitors, incumbent, enriched_at, expires_at
      FROM competitor_enrichments
      WHERE ocid = ${ocid}
        AND expires_at > NOW()
      LIMIT 1
    `;

    if (result.length > 0) {
      const row = result[0];
      return {
        competitors: row.competitors as CompetitorData['competitors'],
        incumbent: row.incumbent as CompetitorData['incumbent'],
        enrichedAt: row.enriched_at as string,
        expiresAt: row.expires_at as string,
      };
    }
  } catch (e) {
    // Table might not exist yet, fall back to memory cache
    console.log('DB cache miss, checking memory cache');
  }

  // Check memory cache
  const cached = memoryCache.get(ocid);
  if (cached && cached.expiresAt > new Date()) {
    return cached.data;
  }

  return null;
}

async function cacheEnrichment(
  ocid: string,
  buyerName: string,
  sector: string,
  data: CompetitorData
): Promise<void> {
  // Try to cache in database
  try {
    await sql`
      INSERT INTO competitor_enrichments (ocid, buyer_name, sector, competitors, incumbent, enriched_at, expires_at)
      VALUES (
        ${ocid},
        ${buyerName},
        ${sector},
        ${JSON.stringify(data.competitors)},
        ${data.incumbent ? JSON.stringify(data.incumbent) : null},
        ${data.enrichedAt},
        ${data.expiresAt}
      )
      ON CONFLICT (ocid) DO UPDATE SET
        buyer_name = EXCLUDED.buyer_name,
        sector = EXCLUDED.sector,
        competitors = EXCLUDED.competitors,
        incumbent = EXCLUDED.incumbent,
        enriched_at = EXCLUDED.enriched_at,
        expires_at = EXCLUDED.expires_at
    `;
  } catch (e) {
    // Table might not exist, use memory cache
    console.log('DB cache write failed, using memory cache');
  }

  // Always cache in memory too
  memoryCache.set(ocid, {
    data,
    expiresAt: new Date(data.expiresAt),
  });
}

async function enrichCompetitors(
  ocid: string,
  buyerName: string,
  sector: string
): Promise<CompetitorData> {
  const AGENT_URL = process.env.AGENT_URL || 'https://rfp-quest-agent-production.up.railway.app';

  try {
    // Call the Railway agent's competitor search endpoint
    const response = await fetch(`${AGENT_URL}/api/research/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_name: buyerName,
        sector: sector,
        ocid: ocid,
      }),
    });

    if (response.ok) {
      const result = await response.json();

      // Parse agent response into structured format
      return {
        competitors: parseCompetitors(result.competitor_research || result.competitors || []),
        incumbent: parseIncumbent(result.incumbent || result.competitor_research),
        enrichedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
    }
  } catch (e) {
    console.error('Agent call failed:', e);
  }

  // Return empty data if agent call fails
  // The UI will show "No competitor data available"
  return {
    competitors: [],
    incumbent: null,
    enrichedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour for failed lookups
  };
}

function parseCompetitors(data: unknown): CompetitorData['competitors'] {
  if (!data) return [];

  // If already structured array
  if (Array.isArray(data)) {
    return data
      .filter((item): item is { name: string; confidence?: number; source?: string } =>
        typeof item === 'object' && item !== null && typeof item.name === 'string'
      )
      .map((item) => ({
        name: item.name,
        confidence: item.confidence ?? 50,
        source: item.source,
      }));
  }

  // If string (raw research text), extract company names
  if (typeof data === 'string') {
    const knownCompetitors = extractCompanyNames(data);
    return knownCompetitors.map((name) => ({
      name,
      confidence: 30, // Lower confidence for text extraction
    }));
  }

  return [];
}

function parseIncumbent(data: unknown): CompetitorData['incumbent'] {
  if (!data) return null;

  // If structured object
  if (typeof data === 'object' && data !== null && 'name' in data) {
    const obj = data as { name: string; contractPeriod?: string };
    return {
      name: obj.name,
      contractPeriod: obj.contractPeriod,
    };
  }

  // If string, try to extract incumbent mention
  if (typeof data === 'string') {
    const incumbentMatch = data.match(/incumbent[:\s]+([A-Z][A-Za-z\s&]+(?:Ltd|Limited|PLC|Inc)?)/i);
    if (incumbentMatch) {
      return { name: incumbentMatch[1].trim() };
    }

    const currentProviderMatch = data.match(/current\s+(?:provider|supplier|contractor)[:\s]+([A-Z][A-Za-z\s&]+(?:Ltd|Limited|PLC|Inc)?)/i);
    if (currentProviderMatch) {
      return { name: currentProviderMatch[1].trim() };
    }
  }

  return null;
}

function extractCompanyNames(text: string): string[] {
  // Common UK government IT/consultancy suppliers
  const knownCompanies = [
    'Accenture', 'Atos', 'BT', 'Capita', 'Capgemini', 'CGI', 'Deloitte',
    'EY', 'Fujitsu', 'IBM', 'KPMG', 'McKinsey', 'NTT', 'PA Consulting',
    'PwC', 'Serco', 'Sopra Steria', 'TCS', 'Wipro', 'WPP', 'Interserve',
    'G4S', 'Mitie', 'ISS', 'Sodexo', 'Compass Group', 'Aramark',
  ];

  const found: string[] = [];
  for (const company of knownCompanies) {
    if (text.toLowerCase().includes(company.toLowerCase())) {
      found.push(company);
    }
  }

  return found.slice(0, 10); // Max 10 competitors
}
