#!/usr/bin/env node
/**
 * Test JigsawStack Intelligence Extraction
 * Tests the comprehensive company intelligence extraction using JigsawStack API
 */

const fetch = require('node-fetch');

// Test configuration
const TEST_CONFIG = {
  // Use your JigsawStack API key
  apiKey: 'sk_a6afc41105983e67dbeda7c46267e7a74a1602606e2c81fc8ede95b3c1621cc12f16209ec3fea4c5ea46750449b9dd90a59640c0635d2d35b8f3c288925c707d0249lzZ3Aj9Ni4gYw0yuX',
  
  // Test company - using a well-known UK company with public accounts
  testCompany: {
    name: 'Rolls-Royce Holdings PLC',
    number: '07524813', // Companies House number
    sectors: ['35000000'], // Defence/aerospace CPV codes
  },
  
  // Alternative test - smaller company
  alternativeCompany: {
    name: 'Northumbrian Water Limited', 
    number: '02366880',
    sectors: ['65000000'], // Water/utilities CPV codes
  }
};

async function testJigsawStackExtraction() {
  console.log('🧪 Testing JigsawStack Intelligence Extraction\n');
  
  try {
    const extractor = new JigsawStackIntelligenceExtractor(TEST_CONFIG.apiKey);
    
    // Test with Rolls-Royce (large company with comprehensive data)
    console.log(`📊 Testing with ${TEST_CONFIG.testCompany.name}...`);
    console.log(`Company Number: ${TEST_CONFIG.testCompany.number}\n`);
    
    const startTime = Date.now();
    
    // Get latest accounts document URL
    console.log('🔍 Fetching latest accounts document...');
    const documentUrl = await getLatestAccountsDocument(TEST_CONFIG.testCompany.number);
    
    if (!documentUrl) {
      throw new Error('No accounts document found');
    }
    
    console.log(`📄 Document URL: ${documentUrl.substring(0, 80)}...`);
    console.log(`📄 Document size: Checking...`);
    
    // Check document size
    const docResponse = await fetch(documentUrl, { method: 'HEAD' });
    const contentLength = docResponse.headers.get('content-length');
    console.log(`📄 Document size: ${contentLength ? `${(parseInt(contentLength) / 1024 / 1024).toFixed(1)}MB` : 'Unknown'}`);
    
    // Extract intelligence
    console.log('\n🚀 Starting intelligence extraction...');
    const intelligence = await extractor.extractCompanyIntelligence({
      documentUrl,
      companyName: TEST_CONFIG.testCompany.name,
      companyNumber: TEST_CONFIG.testCompany.number,
      extractionType: 'comprehensive',
      targetSectors: TEST_CONFIG.testCompany.sectors,
      maxChunkSize: 1024 * 1024, // 1MB chunks as per your findings
    });
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Intelligence extraction completed!\n');
    
    // Display results
    displayIntelligenceResults(intelligence, processingTime);
    
    // Test financial health scoring
    console.log('\n💰 Testing Financial Health Scoring...');
    const healthScore = calculateFinancialHealthScore(intelligence);
    console.log(`Financial Health Score: ${healthScore.score}/100 (${healthScore.rating})`);
    console.log(`Key Factors:`);
    healthScore.factors.forEach(factor => {
      console.log(`  • ${factor.factor}: ${factor.score}/10 - ${factor.reason}`);
    });
    
    // Test competitive analysis
    console.log('\n🏆 Testing Competitive Analysis...');
    const competitiveProfile = generateCompetitiveProfile(intelligence);
    console.log('Competitive Strengths:');
    competitiveProfile.strengths.forEach(strength => console.log(`  ✅ ${strength}`));
    console.log('Competitive Weaknesses:');
    competitiveProfile.weaknesses.forEach(weakness => console.log(`  ⚠️ ${weakness}`));
    console.log('Bid Recommendation:', competitiveProfile.bidRecommendation);
    
    // Test export for Clay
    console.log('\n🔗 Testing Clay Export Format...');
    const clayFormat = formatForClay(intelligence);
    console.log('Clay-formatted data:', JSON.stringify(clayFormat, null, 2).substring(0, 500) + '...');
    
    return intelligence;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    // If main test fails, try with smaller company
    console.log('\n🔄 Trying with smaller company...');
    return testWithAlternativeCompany();
  }
}

async function testWithAlternativeCompany() {
  try {
    const extractor = new JigsawStackIntelligenceExtractor(TEST_CONFIG.apiKey);
    
    console.log(`📊 Testing with ${TEST_CONFIG.alternativeCompany.name}...`);
    
    const documentUrl = await getLatestAccountsDocument(TEST_CONFIG.alternativeCompany.number);
    
    if (!documentUrl) {
      throw new Error('No accounts document found for alternative company');
    }
    
    const intelligence = await extractor.extractCompanyIntelligence({
      documentUrl,
      companyName: TEST_CONFIG.alternativeCompany.name,
      companyNumber: TEST_CONFIG.alternativeCompany.number,
      extractionType: 'comprehensive',
      targetSectors: TEST_CONFIG.alternativeCompany.sectors,
    });
    
    console.log('✅ Alternative company extraction completed!');
    displayIntelligenceResults(intelligence, 0);
    
    return intelligence;
    
  } catch (error) {
    console.error('❌ Alternative test also failed:', error);
    throw error;
  }
}

async function getLatestAccountsDocument(companyNumber) {
  try {
    // Using publicly available Companies House API (no key required for basic data)
    const response = await fetch(
      `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history?category=accounts&items_per_page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Companies House API error: ${response.status}`);
    }
    
    const data = await response.json();
    const latestFiling = data.items?.[0];
    
    if (!latestFiling?.links?.document) {
      throw new Error('No document link found');
    }
    
    return `https://beta.companieshouse.gov.uk${latestFiling.links.document}`;
  } catch (error) {
    console.error('Failed to get accounts document:', error);
    throw error;
  }
}

function displayIntelligenceResults(intelligence, processingTime) {
  console.log('📈 EXTRACTION RESULTS:');
  console.log(`⏱️  Processing Time: ${processingTime}ms`);
  console.log(`🎯 Confidence: ${(intelligence.extractionMetadata.confidence * 100).toFixed(1)}%`);
  console.log(`📊 Data Completeness: ${(intelligence.extractionMetadata.dataCompleteness * 100).toFixed(1)}%`);
  
  // Financial data
  if (intelligence.financial?.turnover) {
    console.log(`\n💰 FINANCIAL DATA:`);
    console.log(`   Revenue: £${intelligence.financial.turnover.toLocaleString()}`);
    if (intelligence.financial.netProfit) {
      console.log(`   Net Profit: £${intelligence.financial.netProfit.toLocaleString()}`);
    }
    if (intelligence.financial.employeeCount) {
      console.log(`   Employees: ${intelligence.financial.employeeCount.toLocaleString()}`);
    }
    if (intelligence.financial.currentRatio) {
      console.log(`   Current Ratio: ${intelligence.financial.currentRatio.toFixed(2)}`);
    }
  }
  
  // Sustainability data
  if (intelligence.sustainability?.secrCompliant !== undefined) {
    console.log(`\n🌱 SUSTAINABILITY:`);
    console.log(`   SECR Compliant: ${intelligence.sustainability.secrCompliant ? '✅' : '❌'}`);
    if (intelligence.sustainability.carbonEmissions?.total) {
      console.log(`   Total Emissions: ${intelligence.sustainability.carbonEmissions.total} tCO2e`);
    }
    if (intelligence.sustainability.energyData?.renewablePercentage) {
      console.log(`   Renewable Energy: ${intelligence.sustainability.energyData.renewablePercentage}%`);
    }
  }
  
  // Risk assessment
  if (intelligence.risks) {
    console.log(`\n⚠️  RISK ASSESSMENT:`);
    console.log(`   Going Concern: ${intelligence.risks.goingConcern ? '❌ Issues' : '✅ Clean'}`);
    if (intelligence.risks.materialUncertainties?.length > 0) {
      console.log(`   Material Uncertainties: ${intelligence.risks.materialUncertainties.length} found`);
    }
  }
  
  // Operational capabilities
  if (intelligence.operational) {
    console.log(`\n⚙️  OPERATIONS:`);
    if (intelligence.operational.qualityStandards?.length > 0) {
      console.log(`   Quality Standards: ${intelligence.operational.qualityStandards.join(', ')}`);
    }
    if (intelligence.operational.environmentalStandards?.length > 0) {
      console.log(`   Environmental Standards: ${intelligence.operational.environmentalStandards.join(', ')}`);
    }
  }
}

function calculateFinancialHealthScore(intelligence) {
  const factors = [];
  let totalScore = 0;
  let maxScore = 0;
  
  // Revenue stability (0-15 points)
  if (intelligence.financial?.revenueGrowth !== undefined) {
    const growth = intelligence.financial.revenueGrowth;
    let score = 10;
    let reason = 'Stable growth';
    
    if (growth > 15) {
      score = 15;
      reason = 'Strong growth';
    } else if (growth < -10) {
      score = 3;
      reason = 'Declining revenue';
    } else if (growth < 0) {
      score = 6;
      reason = 'Negative growth';
    }
    
    factors.push({ factor: 'Revenue Growth', score, reason, weight: 15 });
    totalScore += score;
    maxScore += 15;
  }
  
  // Profitability (0-15 points)
  if (intelligence.financial?.turnover && intelligence.financial?.netProfit) {
    const margin = (intelligence.financial.netProfit / intelligence.financial.turnover) * 100;
    let score = 10;
    let reason = `${margin.toFixed(1)}% margin`;
    
    if (margin > 15) {
      score = 15;
      reason = `Excellent ${margin.toFixed(1)}% margin`;
    } else if (margin > 8) {
      score = 12;
      reason = `Good ${margin.toFixed(1)}% margin`;
    } else if (margin < 0) {
      score = 2;
      reason = `Loss-making (${margin.toFixed(1)}% margin)`;
    } else if (margin < 3) {
      score = 5;
      reason = `Low ${margin.toFixed(1)}% margin`;
    }
    
    factors.push({ factor: 'Profitability', score, reason, weight: 15 });
    totalScore += score;
    maxScore += 15;
  }
  
  // Liquidity (0-15 points) 
  if (intelligence.financial?.currentRatio) {
    const ratio = intelligence.financial.currentRatio;
    let score = 8;
    let reason = `Current ratio ${ratio.toFixed(2)}`;
    
    if (ratio > 2.5) {
      score = 15;
      reason = `Excellent liquidity (${ratio.toFixed(2)})`;
    } else if (ratio > 1.5) {
      score = 12;
      reason = `Good liquidity (${ratio.toFixed(2)})`;
    } else if (ratio < 0.8) {
      score = 2;
      reason = `Poor liquidity (${ratio.toFixed(2)})`;
    } else if (ratio < 1.2) {
      score = 5;
      reason = `Adequate liquidity (${ratio.toFixed(2)})`;
    }
    
    factors.push({ factor: 'Liquidity', score, reason, weight: 15 });
    totalScore += score;
    maxScore += 15;
  }
  
  // Risk factors (0-15 points)
  let riskScore = 15;
  let riskReasons = [];
  
  if (intelligence.risks?.goingConcern) {
    riskScore -= 8;
    riskReasons.push('Going concern issues');
  }
  
  if (intelligence.risks?.materialUncertainties?.length > 0) {
    riskScore -= Math.min(5, intelligence.risks.materialUncertainties.length * 2);
    riskReasons.push(`${intelligence.risks.materialUncertainties.length} material uncertainties`);
  }
  
  if (intelligence.risks?.auditQualifications?.length > 0) {
    riskScore -= 3;
    riskReasons.push('Audit qualifications');
  }
  
  const riskReason = riskReasons.length > 0 ? riskReasons.join('; ') : 'Clean risk profile';
  factors.push({ factor: 'Risk Profile', score: Math.max(0, riskScore), reason: riskReason, weight: 15 });
  totalScore += Math.max(0, riskScore);
  maxScore += 15;
  
  // ESG compliance (0-10 points)
  let esgScore = 5;
  let esgReasons = [];
  
  if (intelligence.sustainability?.secrCompliant) {
    esgScore += 3;
    esgReasons.push('SECR compliant');
  }
  
  if (intelligence.sustainability?.tcfdReporting) {
    esgScore += 2;
    esgReasons.push('TCFD reporting');
  }
  
  const esgReason = esgReasons.length > 0 ? esgReasons.join('; ') : 'Basic ESG compliance';
  factors.push({ factor: 'ESG Compliance', score: esgScore, reason: esgReason, weight: 10 });
  totalScore += esgScore;
  maxScore += 10;
  
  // Calculate final score
  const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  let rating = 'Poor';
  if (finalScore >= 85) rating = 'Excellent';
  else if (finalScore >= 70) rating = 'Good';
  else if (finalScore >= 55) rating = 'Fair';
  else if (finalScore >= 40) rating = 'Weak';
  
  return {
    score: finalScore,
    rating,
    factors,
    totalScore,
    maxScore,
  };
}

function generateCompetitiveProfile(intelligence) {
  const strengths = [];
  const weaknesses = [];
  
  // Analyze financial strengths
  if (intelligence.financial?.turnover > 100000000) {
    strengths.push('Large scale operations (£100M+ revenue)');
  }
  
  if (intelligence.financial?.revenueGrowth > 10) {
    strengths.push(`Strong growth trajectory (${intelligence.financial.revenueGrowth}% YoY)`);
  }
  
  if (intelligence.financial?.currentRatio > 1.5) {
    strengths.push('Strong financial liquidity');
  }
  
  // Analyze capabilities
  if (intelligence.operational?.qualityStandards?.includes('ISO 9001')) {
    strengths.push('ISO 9001 quality certification');
  }
  
  if (intelligence.sustainability?.secrCompliant) {
    strengths.push('SECR compliant (good for public sector)');
  }
  
  // Identify weaknesses
  if (intelligence.risks?.goingConcern) {
    weaknesses.push('Going concern uncertainties');
  }
  
  if (intelligence.financial?.revenueGrowth < -5) {
    weaknesses.push('Declining revenue trend');
  }
  
  if (intelligence.financial?.currentRatio < 1.0) {
    weaknesses.push('Liquidity concerns');
  }
  
  // Generate bid recommendation
  let bidRecommendation = 'Proceed with caution';
  
  const healthScore = calculateFinancialHealthScore(intelligence);
  if (healthScore.score >= 80 && !intelligence.risks?.goingConcern) {
    bidRecommendation = 'Strong competitor - prepare robust differentiation';
  } else if (healthScore.score >= 60) {
    bidRecommendation = 'Viable competitor - focus on competitive advantages';
  } else if (healthScore.score < 40) {
    bidRecommendation = 'Weak competitor - opportunity for aggressive pricing';
  }
  
  return {
    strengths,
    weaknesses,
    bidRecommendation,
    competitiveScore: healthScore.score,
  };
}

function formatForClay(intelligence) {
  return {
    company_name: intelligence.company.name,
    company_number: intelligence.company.number,
    financial_health_score: calculateFinancialHealthScore(intelligence).score,
    revenue: intelligence.financial?.turnover,
    profit_margin: intelligence.financial?.turnover && intelligence.financial?.netProfit 
      ? (intelligence.financial.netProfit / intelligence.financial.turnover * 100).toFixed(1)
      : null,
    employee_count: intelligence.financial?.employeeCount,
    current_ratio: intelligence.financial?.currentRatio,
    going_concern_issues: intelligence.risks?.goingConcern || false,
    secr_compliant: intelligence.sustainability?.secrCompliant || false,
    quality_standards: intelligence.operational?.qualityStandards?.join('; '),
    extraction_confidence: Math.round((intelligence.extractionMetadata.confidence || 0) * 100),
    last_updated: intelligence.extractionMetadata.extractionDate,
  };
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testJigsawStackExtraction()
    .then(result => {
      console.log('\n✅ Test completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}