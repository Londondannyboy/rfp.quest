import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BuyerIntelligence {
  companyNumber: string;
  companyName: string;
  profile: {
    companyStatus: string;
    companyType: string;
    dateOfCreation: string;
    sicCodes: string[];
    hasCharges: boolean;
    hasInsolvencyHistory: boolean;
  };
  decisionMakers: Array<{
    name: string;
    role: string;
    appointedOn: string | null;
    nationality: string | null;
  }>;
  sustainability: {
    hasSecrContent: boolean | null;
    extractionMethod?: string;
    secrData?: {
      ukEnergyKwh: number | null;
      scope1Tonnes: number | null;
      scope2Tonnes: number | null;
      scope3Tonnes: number | null;
      netZeroYear: number | null;
      methodology: string | null;
    };
    keyFindings?: string[];
  } | null;
  signals: {
    growthSignals: Array<{
      signal: string;
      message: string;
      implication: string;
    }>;
    riskSignals: Array<{
      signal: string;
      severity: string;
      message: string;
      implication: string;
    }>;
    overallSentiment: string;
  };
  bidInsights: {
    emphasize: string[];
    consider: string[];
    avoid: string[];
  };
  recentNews?: Array<{
    title: string;
    url: string;
    snippet: string;
    source: string;
  }>;
  enrichedAt: string;
  expiresAt: string;
}

// In-memory cache
const memoryCache = new Map<string, { data: BuyerIntelligence; expiresAt: Date }>();

// GET /api/buyer-intel?buyerName=X or ?companyNumber=Y
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerName = searchParams.get('buyerName');
    const companyNumber = searchParams.get('companyNumber');

    if (!buyerName && !companyNumber) {
      return NextResponse.json(
        { error: 'buyerName or companyNumber is required' },
        { status: 400 }
      );
    }

    const cacheKey = companyNumber || buyerName || '';

    // Try to get from cache first
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      return NextResponse.json(cached.data);
    }

    // Fetch fresh buyer intelligence
    const intel = await fetchBuyerIntelligence(buyerName, companyNumber);

    if (intel) {
      // Cache the result (1 hour)
      memoryCache.set(cacheKey, {
        data: intel,
        expiresAt: new Date(intel.expiresAt),
      });
    }

    return NextResponse.json(intel || { error: 'No buyer intelligence found' });
  } catch (error) {
    console.error('Buyer intelligence error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyer intelligence' },
      { status: 500 }
    );
  }
}

async function fetchBuyerIntelligence(
  buyerName: string | null,
  companyNumber: string | null
): Promise<BuyerIntelligence | null> {
  const AGENT_URL = process.env.AGENT_URL || 'https://rfp-quest-agent-production.up.railway.app';

  try {
    let resolvedCompanyNumber = companyNumber;

    // If we only have buyer name, search for company number first
    if (!resolvedCompanyNumber && buyerName) {
      const searchResponse = await fetch(
        `${AGENT_URL}/search/company?q=${encodeURIComponent(buyerName)}`,
        { next: { revalidate: 3600 } }
      );

      if (searchResponse.ok) {
        const searchResult = await searchResponse.json();
        if (searchResult.results?.length > 0) {
          // Find best match (prefer active companies)
          const activeCompany = searchResult.results.find(
            (r: { company_status: string }) => r.company_status === 'active'
          );
          resolvedCompanyNumber = activeCompany?.company_number || searchResult.results[0].company_number;
        }
      }
    }

    if (!resolvedCompanyNumber) {
      return null;
    }

    // Fetch full buyer intelligence
    const [intelResponse, signalsResponse] = await Promise.all([
      fetch(`${AGENT_URL}/buyer-intel/${resolvedCompanyNumber}`),
      fetch(`${AGENT_URL}/signals/${resolvedCompanyNumber}`),
    ]);

    if (!intelResponse.ok) {
      console.error('Buyer intel fetch failed:', intelResponse.status);
      return null;
    }

    const intelData = await intelResponse.json();
    const signalsData = signalsResponse.ok ? await signalsResponse.json() : null;

    // Transform to frontend format
    return {
      companyNumber: resolvedCompanyNumber,
      companyName: intelData.profile?.company_name || buyerName || '',
      profile: {
        companyStatus: intelData.profile?.company_status || 'unknown',
        companyType: intelData.profile?.company_type || 'unknown',
        dateOfCreation: intelData.profile?.date_of_creation || '',
        sicCodes: intelData.profile?.sic_codes || [],
        hasCharges: intelData.profile?.has_charges || false,
        hasInsolvencyHistory: intelData.profile?.has_insolvency_history || false,
      },
      decisionMakers: (intelData.decision_makers || []).map((dm: Record<string, unknown>) => ({
        name: dm.name as string,
        role: dm.role as string,
        appointedOn: dm.appointed_on as string | null,
        nationality: dm.nationality as string | null,
      })),
      sustainability: intelData.sustainability ? {
        hasSecrContent: intelData.sustainability.has_secr_content,
        extractionMethod: intelData.sustainability.extraction_method,
        secrData: intelData.sustainability.secr_data ? {
          ukEnergyKwh: intelData.sustainability.secr_data.uk_energy_kwh,
          scope1Tonnes: intelData.sustainability.secr_data.scope1_tonnes,
          scope2Tonnes: intelData.sustainability.secr_data.scope2_tonnes,
          scope3Tonnes: intelData.sustainability.secr_data.scope3_tonnes,
          netZeroYear: intelData.sustainability.secr_data.net_zero_year,
          methodology: intelData.sustainability.secr_data.methodology,
        } : undefined,
        keyFindings: intelData.sustainability.key_findings,
      } : null,
      signals: {
        growthSignals: signalsData?.growth_signals || [],
        riskSignals: signalsData?.risk_signals || [],
        overallSentiment: signalsData?.overall_sentiment || 'neutral',
      },
      bidInsights: {
        emphasize: intelData.bid_insights?.emphasize || [],
        consider: intelData.bid_insights?.consider || [],
        avoid: intelData.bid_insights?.avoid || [],
      },
      recentNews: intelData.recent_news?.news?.map((n: Record<string, unknown>) => ({
        title: n.title as string,
        url: n.url as string,
        snippet: n.snippet as string,
        source: n.source as string,
      })),
      enrichedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
  } catch (error) {
    console.error('Agent call failed:', error);
    return null;
  }
}
