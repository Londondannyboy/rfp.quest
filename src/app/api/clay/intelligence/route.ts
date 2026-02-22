import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Clay HTTPS endpoint for company intelligence extraction
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyNumber = searchParams.get('company_number');
    const companyName = searchParams.get('company_name');
    const sectors = searchParams.get('sectors')?.split(',') || [];
    
    // Validate required parameters
    if (!companyNumber || !companyName) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          required: ['company_number', 'company_name'],
          provided: { companyNumber, companyName }
        },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Clay API: Extracting intelligence for ${companyName} (${companyNumber})`);
    
    // Check if we have recent cached intelligence from database
    const cached = await getCachedIntelligenceFromDB(companyNumber);
    
    if (cached) {
      console.log(`✅ Clay API: Returning cached data for ${companyName}`);
      return NextResponse.json({
        success: true,
        cached: true,
        company: formatIntelligenceForClay(cached, companyName, companyNumber),
        extracted_at: cached.extraction_date,
        cache_expires: cached.expires_at,
      });
    }
    
    // If no cached data, trigger extraction via our main API
    console.log(`🚀 Clay API: Triggering fresh intelligence extraction for ${companyName}...`);
    
    try {
      const extractionResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/intelligence/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_number: companyNumber,
          company_name: companyName,
          rfp_context: sectors.length > 0 ? { sectors } : undefined,
        }),
      });

      if (!extractionResponse.ok) {
        throw new Error(`Extraction API failed: ${extractionResponse.status}`);
      }

      const extractionData = await extractionResponse.json();
      
      if (!extractionData.success) {
        return NextResponse.json({
          success: false,
          error: 'Intelligence extraction failed',
          details: extractionData.error,
          company_number: companyNumber,
          company_name: companyName,
        }, { status: 500 });
      }
      
      const clayFormattedData = formatIntelligenceForClay(extractionData.intelligence, companyName, companyNumber);
      
      console.log(`✅ Clay API: Successfully extracted intelligence for ${companyName}`);
      
      return NextResponse.json({
        success: true,
        cached: false,
        company: clayFormattedData,
        extracted_at: new Date().toISOString(),
        processing_time: extractionData.processing_time_ms,
        confidence: extractionData.intelligence?.extractionMetadata?.confidence,
      });
      
    } catch (extractionError) {
      console.error(`❌ Clay API: Extraction failed for ${companyName}:`, extractionError);
      
      return NextResponse.json({
        success: false,
        error: 'Intelligence extraction failed',
        details: extractionError instanceof Error ? extractionError.message : 'Unknown error',
        company_number: companyNumber,
        company_name: companyName,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Clay API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for batch intelligence extraction
export async function POST(request: NextRequest) {
  try {
    const { companies, sectors } = await request.json();
    
    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json(
        { error: 'Invalid companies array' },
        { status: 400 }
      );
    }
    
    if (companies.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 companies per batch request' },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Clay API: Batch extracting intelligence for ${companies.length} companies`);
    
    const results = await Promise.allSettled(
      companies.map(async (company) => {
        if (!company.company_number || !company.company_name) {
          throw new Error(`Invalid company data: ${JSON.stringify(company)}`);
        }
        
        try {
          // Check cache first
          const cached = await getCachedIntelligence(company.company_number);
          
          if (cached && isRecentEnoughForClay(cached.created_at)) {
            return {
              success: true,
              cached: true,
              company: formatIntelligenceForClay(cached.data, company.company_name, company.company_number),
            };
          }
          
          // Extract fresh intelligence
          const intelligence = await extractCompanyIntelligence(
            company.company_number,
            company.company_name,
            sectors || company.sectors
          );
          
          if (!intelligence) {
            throw new Error('No data extracted');
          }
          
          // Cache the results
          await cacheIntelligence(company.company_number, intelligence);
          
          return {
            success: true,
            cached: false,
            company: formatIntelligenceForClay(intelligence, company.company_name, company.company_number),
          };
          
        } catch (error) {
          return {
            success: false,
            company_number: company.company_number,
            company_name: company.company_name,
            error: error instanceof Error ? error.message : 'Extraction failed',
          };
        }
      })
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    console.log(`✅ Clay API: Batch completed - ${successful} successful, ${failed} failed`);
    
    return NextResponse.json({
      success: true,
      summary: {
        total: companies.length,
        successful,
        failed,
      },
      results: results.map(r => 
        r.status === 'fulfilled' ? r.value : { success: false, error: r.reason }
      ),
      extracted_at: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Clay batch API error:', error);
    return NextResponse.json(
      { error: 'Batch processing failed' },
      { status: 500 }
    );
  }
}

// Format intelligence data for Clay consumption
function formatIntelligenceForClay(intelligence: any, companyName: string, companyNumber: string) {
  // Calculate key scores
  const financialHealth = calculateFinancialHealthScore(intelligence);
  const riskScore = calculateRiskScore(intelligence);
  const esgScore = calculateESGScore(intelligence);
  
  return {
    // Basic Info
    company_name: companyName,
    company_number: companyNumber,
    
    // Financial Health (0-100)
    financial_health_score: financialHealth.score,
    financial_health_rating: financialHealth.rating,
    
    // Key Financial Metrics
    annual_revenue: intelligence.financial?.turnover,
    revenue_currency: intelligence.financial?.currency || 'GBP',
    net_profit: intelligence.financial?.netProfit,
    profit_margin: intelligence.financial?.turnover && intelligence.financial?.netProfit
      ? Math.round((intelligence.financial.netProfit / intelligence.financial.turnover) * 100 * 10) / 10
      : null,
    employee_count: intelligence.financial?.employeeCount,
    revenue_growth_yoy: intelligence.financial?.revenueGrowth,
    
    // Liquidity & Stability
    current_ratio: intelligence.financial?.currentRatio,
    cash_position: intelligence.financial?.cashAndEquivalents,
    working_capital: intelligence.financial?.workingCapital,
    
    // Risk Assessment (0-100, lower is riskier)
    risk_score: riskScore,
    going_concern_issues: intelligence.risks?.goingConcern || false,
    material_uncertainties: intelligence.risks?.materialUncertainties?.length || 0,
    audit_qualifications: intelligence.risks?.auditQualifications?.length || 0,
    
    // ESG & Compliance (0-100)
    esg_score: esgScore,
    secr_compliant: intelligence.sustainability?.secrCompliant || false,
    tcfd_reporting: intelligence.sustainability?.tcfdReporting || false,
    carbon_emissions_total: intelligence.sustainability?.carbonEmissions?.total,
    renewable_energy_pct: intelligence.sustainability?.energyData?.renewablePercentage,
    
    // Operational Capabilities
    iso_9001_certified: intelligence.operational?.qualityStandards?.includes('ISO 9001') || false,
    iso_14001_certified: intelligence.operational?.environmentalStandards?.includes('ISO 14001') || false,
    security_clearances: intelligence.operational?.securityClearances?.length || 0,
    facilities_count: intelligence.operational?.facilities?.length || 0,
    
    // Government Contracting
    framework_memberships: intelligence.contracting?.frameworkMemberships?.length || 0,
    gdpr_compliant: intelligence.contracting?.gdprCompliance || false,
    modern_slavery_compliant: intelligence.contracting?.modernSlaveryStatement || false,
    social_value_score: intelligence.contracting?.socialValueCommitments?.length || 0,
    
    // Strategic Intelligence  
    rd_spend: intelligence.strategic?.rdSpend,
    rd_percentage: intelligence.strategic?.rdPercentage,
    international_presence: intelligence.strategic?.internationalPresence?.length || 0,
    strategic_partnerships: intelligence.competitive?.strategicPartnerships?.length || 0,
    
    // Bid Recommendation
    recommended_for_partnership: financialHealth.score >= 70 && riskScore >= 60,
    competitive_threat_level: calculateCompetitiveThreat(intelligence),
    contract_capacity_estimate: estimateContractCapacity(intelligence),
    
    // Metadata
    data_completeness_pct: Math.round((intelligence.extractionMetadata?.dataCompleteness || 0) * 100),
    extraction_confidence_pct: Math.round((intelligence.extractionMetadata?.confidence || 0) * 100),
    last_updated: intelligence.extractionMetadata?.extractionDate || new Date().toISOString(),
  };
}

function calculateFinancialHealthScore(intelligence: any): { score: number; rating: string } {
  let score = 50; // Base score
  
  // Revenue size (0-20 points)
  const revenue = intelligence.financial?.turnover;
  if (revenue) {
    if (revenue > 500000000) score += 20; // £500M+
    else if (revenue > 100000000) score += 15; // £100M+
    else if (revenue > 10000000) score += 10; // £10M+
    else if (revenue > 1000000) score += 5; // £1M+
  }
  
  // Profitability (0-15 points)
  if (intelligence.financial?.turnover && intelligence.financial?.netProfit) {
    const margin = (intelligence.financial.netProfit / intelligence.financial.turnover) * 100;
    if (margin > 15) score += 15;
    else if (margin > 8) score += 10;
    else if (margin > 3) score += 5;
    else if (margin < 0) score -= 10;
  }
  
  // Growth (0-10 points)
  const growth = intelligence.financial?.revenueGrowth;
  if (growth !== undefined) {
    if (growth > 20) score += 10;
    else if (growth > 10) score += 7;
    else if (growth > 0) score += 3;
    else if (growth < -10) score -= 10;
  }
  
  // Liquidity (0-10 points)
  const currentRatio = intelligence.financial?.currentRatio;
  if (currentRatio) {
    if (currentRatio > 2) score += 10;
    else if (currentRatio > 1.5) score += 7;
    else if (currentRatio > 1) score += 3;
    else score -= 5;
  }
  
  // Risk penalties
  if (intelligence.risks?.goingConcern) score -= 20;
  if (intelligence.risks?.materialUncertainties?.length > 0) score -= 10;
  
  score = Math.max(0, Math.min(100, score));
  
  let rating = 'Poor';
  if (score >= 85) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 55) rating = 'Fair';
  else if (score >= 40) rating = 'Weak';
  
  return { score, rating };
}

function calculateRiskScore(intelligence: any): number {
  let score = 80; // Start with good risk score
  
  // Going concern issues
  if (intelligence.risks?.goingConcern) score -= 30;
  
  // Material uncertainties
  const uncertainties = intelligence.risks?.materialUncertainties?.length || 0;
  score -= Math.min(20, uncertainties * 5);
  
  // Audit issues
  const auditIssues = intelligence.risks?.auditQualifications?.length || 0;
  score -= Math.min(15, auditIssues * 5);
  
  // Customer concentration risk
  if (intelligence.risks?.customerConcentration > 50) score -= 10;
  else if (intelligence.risks?.customerConcentration > 30) score -= 5;
  
  return Math.max(0, Math.min(100, score));
}

function calculateESGScore(intelligence: any): number {
  let score = 30; // Base score
  
  // SECR compliance
  if (intelligence.sustainability?.secrCompliant) score += 20;
  
  // TCFD reporting
  if (intelligence.sustainability?.tcfdReporting) score += 15;
  
  // Carbon data available
  if (intelligence.sustainability?.carbonEmissions?.total) score += 10;
  
  // Renewable energy
  const renewablePercentage = intelligence.sustainability?.energyData?.renewablePercentage;
  if (renewablePercentage) {
    if (renewablePercentage > 50) score += 15;
    else if (renewablePercentage > 20) score += 10;
    else score += 5;
  }
  
  // Diversity metrics
  if (intelligence.sustainability?.diversityMetrics) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateCompetitiveThreat(intelligence: any): string {
  const healthScore = calculateFinancialHealthScore(intelligence).score;
  const revenue = intelligence.financial?.turnover || 0;
  
  if (healthScore >= 80 && revenue > 100000000) return 'High';
  if (healthScore >= 65 && revenue > 10000000) return 'Medium';
  if (healthScore >= 50) return 'Low';
  return 'Minimal';
}

function estimateContractCapacity(intelligence: any): number | null {
  const revenue = intelligence.financial?.turnover;
  if (!revenue) return null;
  
  // Rough estimate: companies can typically handle contracts up to 10-20% of annual revenue
  return Math.round(revenue * 0.15);
}

// Helper functions for database operations
async function getCachedIntelligenceFromDB(companyNumber: string) {
  try {
    const result = await sql`
      SELECT *
      FROM company_intelligence
      WHERE company_number = ${companyNumber}
        AND expires_at > NOW()
      ORDER BY extraction_date DESC
      LIMIT 1
    `;
    
    if (result.length > 0) {
      const row = result[0];
      return {
        ...row.intelligence_data,
        extraction_date: row.extraction_date,
        expires_at: row.expires_at,
        financial_health_score: row.financial_health_score,
        risk_score: row.risk_score,
        esg_score: row.esg_score,
        data_completeness_score: row.data_completeness_score,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Database lookup error:', error);
    return null;
  }
}