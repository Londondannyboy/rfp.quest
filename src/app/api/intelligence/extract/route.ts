import { NextRequest, NextResponse } from 'next/server';
import { JigsawStack } from 'jigsawstack';
import { sql } from '@/lib/db';
import { CompaniesHouseIntelligenceExtractor } from '@/lib/companies-house-intelligence-standardizer';

const jigsaw = JigsawStack({ 
  apiKey: 'sk_ae59b7c93dd5a071266ce32722feb5b06cfdf6bb67d32cf25cd1ca2178e1ef4ccf6f5834d28ceb0edfa08412a08edb36e8a15033d33609f8c5f06eb4a4ecc53a024FAvUyt9dkrUomG473n'
});

const COMPANIES_HOUSE_API_KEY = '3a953db3-d41e-47a6-98df-637b591cb63d';

// Main intelligence extraction endpoint
export async function POST(request: NextRequest) {
  try {
    const { company_number, company_name, force_refresh = false, rfp_context } = await request.json();
    
    if (!company_number) {
      return NextResponse.json({
        error: 'company_number is required'
      }, { status: 400 });
    }

    console.log(`🔍 Intelligence extraction request for ${company_number} (${company_name || 'Unknown'})`);
    
    // Check if we have recent intelligence (unless force refresh)
    if (!force_refresh) {
      const cachedIntelligence = await getCachedIntelligence(company_number);
      if (cachedIntelligence) {
        console.log(`✅ Returning cached intelligence for ${company_number}`);
        return NextResponse.json({
          success: true,
          cached: true,
          intelligence: cachedIntelligence,
          extraction_date: cachedIntelligence.extraction_date,
        });
      }
    }

    // Extract fresh intelligence
    console.log(`🚀 Starting fresh intelligence extraction for ${company_number}...`);
    const startTime = Date.now();
    
    try {
      const intelligence = await extractCompanyIntelligence(company_number, company_name, rfp_context);
      const processingTime = Date.now() - startTime;
      
      // Save to database
      const savedIntelligence = await saveIntelligenceToDatabase(
        company_number, 
        company_name || intelligence.companyProfile.name,
        intelligence,
        processingTime
      );
      
      console.log(`✅ Intelligence extraction completed for ${company_number} in ${processingTime}ms`);
      
      return NextResponse.json({
        success: true,
        cached: false,
        intelligence: savedIntelligence,
        processing_time_ms: processingTime,
        extraction_date: new Date().toISOString(),
      });
      
    } catch (extractionError) {
      console.error(`❌ Extraction failed for ${company_number}:`, extractionError);
      
      return NextResponse.json({
        success: false,
        error: 'Intelligence extraction failed',
        details: extractionError instanceof Error ? extractionError.message : 'Unknown error',
        company_number,
        company_name,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Intelligence API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Batch extraction endpoint  
export async function PATCH(request: NextRequest) {
  try {
    const { companies, rfp_context } = await request.json();
    
    if (!Array.isArray(companies) || companies.length === 0) {
      return NextResponse.json({
        error: 'companies array is required'
      }, { status: 400 });
    }
    
    if (companies.length > 5) {
      return NextResponse.json({
        error: 'Maximum 5 companies per batch request'
      }, { status: 400 });
    }
    
    console.log(`🔍 Batch intelligence extraction for ${companies.length} companies`);
    
    const results = await Promise.allSettled(
      companies.map(async (company) => {
        if (!company.company_number) {
          throw new Error(`Missing company_number: ${JSON.stringify(company)}`);
        }
        
        try {
          // Check cache first
          const cached = await getCachedIntelligence(company.company_number);
          
          if (cached) {
            return {
              success: true,
              cached: true,
              company_number: company.company_number,
              intelligence: cached,
            };
          }
          
          // Extract fresh intelligence
          const startTime = Date.now();
          const intelligence = await extractCompanyIntelligence(
            company.company_number,
            company.company_name,
            rfp_context
          );
          const processingTime = Date.now() - startTime;
          
          // Save to database
          const savedIntelligence = await saveIntelligenceToDatabase(
            company.company_number,
            company.company_name || intelligence.companyProfile.name,
            intelligence,
            processingTime
          );
          
          return {
            success: true,
            cached: false,
            company_number: company.company_number,
            intelligence: savedIntelligence,
            processing_time_ms: processingTime,
          };
          
        } catch (error) {
          return {
            success: false,
            company_number: company.company_number,
            error: error instanceof Error ? error.message : 'Extraction failed',
          };
        }
      })
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    console.log(`✅ Batch extraction completed - ${successful} successful, ${failed} failed`);
    
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
      extraction_date: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Batch intelligence API error:', error);
    return NextResponse.json({
      error: 'Batch processing failed'
    }, { status: 500 });
  }
}

// Core intelligence extraction function
async function extractCompanyIntelligence(
  companyNumber: string, 
  companyName?: string,
  rfpContext?: any
) {
  // Get Companies House document with 60-second AWS workflow
  console.log(`📄 Fetching Companies House document for ${companyNumber}...`);
  const documentUrl = await getCompaniesHouseDocument(companyNumber);
  
  if (!documentUrl) {
    throw new Error('No Companies House document found');
  }
  
  console.log(`✅ Got AWS presigned URL (60 seconds to process)`);
  
  // Determine account type to customize prompts
  const basicInfo = companyName ? { companyProfile: { name: companyName } } : null;
  const accountType = basicInfo ? 
    CompaniesHouseIntelligenceExtractor.determineAccountType(basicInfo) : 
    { type: 'full' as const, size: 'medium' as const, hasGroupStructure: false };
  
  // Get extraction prompts based on account type
  const basePrompts = CompaniesHouseIntelligenceExtractor.getExtractionPrompts(accountType);
  
  // Add RFP-specific prompts if context provided
  const rfpPrompts = rfpContext ? 
    CompaniesHouseIntelligenceExtractor.getBidSpecificPrompts(rfpContext) : [];
  
  const allPrompts = [...basePrompts, ...rfpPrompts];
  
  console.log(`🔍 Extracting with ${allPrompts.length} prompts (${basePrompts.length} base + ${rfpPrompts.length} RFP-specific)`);
  
  // Extract intelligence with JigsawStack
  const response = await jigsaw.vision.vocr({
    url: documentUrl,
    prompt: allPrompts
  });
  
  if (!response.success) {
    throw new Error(`JigsawStack extraction failed: ${JSON.stringify(response)}`);
  }
  
  // Standardize the extracted data
  const standardizedIntelligence = standardizeIntelligence(
    response, 
    companyNumber, 
    companyName,
    accountType
  );
  
  return standardizedIntelligence;
}

// Get Companies House document with 60-second AWS workflow
async function getCompaniesHouseDocument(companyNumber: string): Promise<string> {
  const baseUrl = 'https://api.company-information.service.gov.uk';
  const authHeader = 'Basic ' + Buffer.from(COMPANIES_HOUSE_API_KEY + ':').toString('base64');
  
  // Step 1: Get filing history
  const filingResponse = await fetch(
    `${baseUrl}/company/${companyNumber}/filing-history?category=accounts&items_per_page=1`,
    { headers: { 'Authorization': authHeader } }
  );
  
  if (!filingResponse.ok) {
    throw new Error(`Failed to get filing history: ${filingResponse.status}`);
  }
  
  const filingData = await filingResponse.json();
  const latestFiling = filingData.items?.[0];
  
  if (!latestFiling?.links?.document_metadata) {
    throw new Error('No document metadata found');
  }
  
  // Step 2: Get document metadata
  const metadataResponse = await fetch(latestFiling.links.document_metadata, {
    headers: { 'Authorization': authHeader }
  });
  
  if (!metadataResponse.ok) {
    throw new Error(`Failed to get document metadata: ${metadataResponse.status}`);
  }
  
  const metadata = await metadataResponse.json();
  const documentLinkUrl = metadata.links?.document;
  
  if (!documentLinkUrl) {
    throw new Error('No document link found in metadata');
  }
  
  // Step 3: Trigger 60-second AWS presigned URL
  const documentResponse = await fetch(documentLinkUrl, {
    method: 'HEAD',
    headers: { 'Authorization': authHeader },
    redirect: 'manual'
  });
  
  // Get AWS presigned URL from redirect
  if (documentResponse.status >= 300 && documentResponse.status < 400) {
    const awsUrl = documentResponse.headers.get('location');
    if (!awsUrl) {
      throw new Error('No redirect URL found');
    }
    
    console.log(`📄 AWS URL obtained: ${awsUrl.substring(0, 80)}...`);
    return awsUrl;
  }
  
  // If no redirect, use the document link directly
  return documentLinkUrl;
}

// Standardize extracted intelligence data
function standardizeIntelligence(jigsawResponse: any, companyNumber: string, companyName?: string, accountType?: any) {
  // This would implement the full standardization logic
  // For now, return a structured format
  return {
    companyProfile: {
      name: companyName || 'Unknown Company',
      number: companyNumber,
      accountType: accountType || { type: 'unknown', size: 'unknown', hasGroupStructure: false },
    },
    financial: {
      basicMetrics: extractFinancialMetrics(jigsawResponse),
      performance: extractPerformanceMetrics(jigsawResponse),
    },
    operational: {
      employeeCount: extractEmployeeCount(jigsawResponse),
    },
    sustainability: {
      secrCompliant: extractSECRCompliance(jigsawResponse),
      carbonEmissions: extractCarbonData(jigsawResponse),
    },
    risks: {
      goingConcernIssues: extractGoingConcern(jigsawResponse),
      auditOpinion: extractAuditOpinion(jigsawResponse),
    },
    strategic: {
      rdSpend: extractRDSpend(jigsawResponse),
    },
    contracting: {
      qualityAccreditations: extractAccreditations(jigsawResponse),
    },
    extractionMetadata: {
      extractionDate: new Date().toISOString(),
      accountType: accountType?.type || 'unknown',
      confidence: 0.85, // Would calculate based on data completeness
      dataCompleteness: 0.78,
      jigsawStackLogId: jigsawResponse.log_id,
      processingTime: jigsawResponse._usage?.inference_time_tokens || 0,
    }
  };
}

// Helper functions to extract specific data types
function extractFinancialMetrics(response: any) {
  const context = response.context || {};
  
  return {
    turnover: extractNumber(context['annual revenue or turnover in pounds']),
    netProfit: extractNumber(context['net profit figure']),
    totalAssets: extractNumber(context['balance sheet total assets']),
  };
}

function extractPerformanceMetrics(response: any) {
  return {
    revenueGrowth: null, // Would calculate from multi-year data
  };
}

function extractEmployeeCount(response: any) {
  const context = response.context || {};
  return extractNumber(context['number of employees']) || 
         extractNumber(context['total number of employees']);
}

function extractSECRCompliance(response: any) {
  const context = response.context || {};
  const secrData = context['SECR compliance mentioned'] || [];
  return secrData.length > 0;
}

function extractCarbonData(response: any) {
  const context = response.context || {};
  
  return {
    total: extractNumber(context['carbon emissions total tonnes CO2']) ||
           extractNumber(context['carbon emissions total']),
    scope1: extractNumber(context['scope 1 emissions']),
    scope2: extractNumber(context['scope 2 emissions']),
    scope3: extractNumber(context['scope 3 emissions']),
  };
}

function extractGoingConcern(response: any) {
  const context = response.context || {};
  const goingConcernData = context['going concern statement'] || [];
  
  // Look for indicators of going concern issues
  const text = JSON.stringify(goingConcernData).toLowerCase();
  return text.includes('uncertainty') || text.includes('doubt') || text.includes('material');
}

function extractAuditOpinion(response: any) {
  const context = response.context || {};
  const auditData = context['audit opinion type'] || [];
  
  const text = JSON.stringify(auditData).toLowerCase();
  if (text.includes('qualified')) return 'qualified';
  if (text.includes('adverse')) return 'adverse';
  if (text.includes('disclaimer')) return 'disclaimer';
  return 'unqualified'; // assumption
}

function extractRDSpend(response: any) {
  const context = response.context || {};
  return extractNumber(context['research and development costs']);
}

function extractAccreditations(response: any) {
  const context = response.context || {};
  // Would extract quality certifications, security clearances etc
  return [];
}

function extractNumber(data: any): number | null {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }
  
  const text = data.join(' ');
  const matches = text.match(/[\d,]+/g);
  
  if (matches && matches.length > 0) {
    const number = parseInt(matches[0].replace(/,/g, ''));
    return isNaN(number) ? null : number;
  }
  
  return null;
}

// Database operations
async function getCachedIntelligence(companyNumber: string) {
  try {
    const result = await sql`
      SELECT * FROM company_intelligence
      WHERE company_number = ${companyNumber}
        AND expires_at > NOW()
      ORDER BY extraction_date DESC
      LIMIT 1
    `;
    
    if (result.length > 0) {
      return {
        ...result[0].intelligence_data,
        extraction_date: result[0].extraction_date,
        accounts_date: result[0].accounts_date,
        financial_health_score: result[0].financial_health_score,
        risk_score: result[0].risk_score,
        esg_score: result[0].esg_score,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching cached intelligence:', error);
    return null;
  }
}

async function saveIntelligenceToDatabase(
  companyNumber: string,
  companyName: string, 
  intelligence: any,
  processingTimeMs: number
) {
  try {
    // Calculate scores
    const financialScore = calculateFinancialHealthScore(intelligence);
    const riskScore = calculateRiskScore(intelligence);
    const esgScore = calculateESGScore(intelligence);
    const completenessScore = calculateDataCompleteness(intelligence);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day cache
    
    await sql`
      INSERT INTO company_intelligence (
        company_number,
        company_name,
        accounts_date,
        accounts_type,
        company_size,
        jigsawstack_response,
        jigsawstack_log_id,
        intelligence_data,
        financial_health_score,
        risk_score,
        esg_score,
        data_completeness_score,
        processing_time_ms,
        expires_at
      ) VALUES (
        ${companyNumber},
        ${companyName},
        ${intelligence.extractionMetadata?.accountsDate || '2024-12-31'},
        ${intelligence.extractionMetadata?.accountType || 'unknown'},
        ${intelligence.companyProfile?.accountType?.size || 'unknown'},
        ${JSON.stringify({ success: true, timestamp: new Date() })},
        ${intelligence.extractionMetadata?.jigsawStackLogId},
        ${JSON.stringify(intelligence)},
        ${financialScore},
        ${riskScore},
        ${esgScore},
        ${completenessScore},
        ${processingTimeMs},
        ${expiresAt.toISOString()}
      )
      ON CONFLICT (company_number, accounts_date)
      DO UPDATE SET
        intelligence_data = EXCLUDED.intelligence_data,
        financial_health_score = EXCLUDED.financial_health_score,
        risk_score = EXCLUDED.risk_score,
        esg_score = EXCLUDED.esg_score,
        processing_time_ms = EXCLUDED.processing_time_ms,
        updated_at = NOW()
    `;
    
    return {
      ...intelligence,
      financial_health_score: financialScore,
      risk_score: riskScore,
      esg_score: esgScore,
      data_completeness_score: completenessScore,
    };
    
  } catch (error) {
    console.error('Error saving intelligence to database:', error);
    throw error;
  }
}

// Scoring functions
function calculateFinancialHealthScore(intelligence: any): number {
  let score = 50; // Base score
  
  const financial = intelligence.financial?.basicMetrics;
  if (!financial) return score;
  
  // Revenue size (0-20 points)
  const revenue = financial.turnover;
  if (revenue) {
    if (revenue > 100000000) score += 15; // £100M+
    else if (revenue > 10000000) score += 10; // £10M+
    else if (revenue > 1000000) score += 5; // £1M+
  }
  
  // Risk deductions
  if (intelligence.risks?.goingConcernIssues) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}

function calculateRiskScore(intelligence: any): number {
  let score = 80; // Start with good risk score
  
  if (intelligence.risks?.goingConcernIssues) score -= 30;
  if (intelligence.risks?.auditOpinion === 'qualified') score -= 15;
  if (intelligence.risks?.auditOpinion === 'adverse') score -= 25;
  
  return Math.max(0, Math.min(100, score));
}

function calculateESGScore(intelligence: any): number {
  let score = 30; // Base score
  
  if (intelligence.sustainability?.secrCompliant) score += 25;
  if (intelligence.sustainability?.carbonEmissions?.total) score += 15;
  
  return Math.max(0, Math.min(100, score));
}

function calculateDataCompleteness(intelligence: any): number {
  let completedFields = 0;
  let totalFields = 0;
  
  // Check key data availability
  const checks = [
    intelligence.financial?.basicMetrics?.turnover,
    intelligence.financial?.basicMetrics?.netProfit,
    intelligence.operational?.employeeCount,
    intelligence.sustainability?.secrCompliant !== undefined,
    intelligence.risks?.goingConcernIssues !== undefined,
    intelligence.risks?.auditOpinion,
  ];
  
  checks.forEach(check => {
    totalFields++;
    if (check !== null && check !== undefined) completedFields++;
  });
  
  return Math.round((completedFields / totalFields) * 100);
}