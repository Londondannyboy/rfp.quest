/**
 * Companies House Intelligence Standardizer
 * Handles different account types and standardizes extraction
 */

export interface CompaniesHouseAccountType {
  type: 'abbreviated' | 'full' | 'group' | 'micro' | 'dormant';
  size: 'micro' | 'small' | 'medium' | 'large';
  hasGroupStructure: boolean;
  subsidiaries?: string[];
}

export interface StandardizedIntelligence {
  // Company Profile
  companyProfile: {
    name: string;
    number: string;
    sicCodes: string[];
    accountType: CompaniesHouseAccountType;
    incorporationDate: string;
    lastAccountsDate: string;
    nextAccountsDue: string;
    companyStatus: string;
  };

  // Financial Intelligence (varies by account type)
  financial: {
    // Always available
    basicMetrics?: {
      turnover?: number;
      grossProfit?: number;
      netProfit?: number;
      totalAssets?: number;
      totalLiabilities?: number;
      shareholderFunds?: number;
    };
    
    // Full accounts only
    detailedMetrics?: {
      currentAssets?: number;
      currentLiabilities?: number;
      currentRatio?: number;
      quickRatio?: number;
      debtToEquity?: number;
      returnOnAssets?: number;
      workingCapital?: number;
      cashAndEquivalents?: number;
      inventories?: number;
      tradeReceivables?: number;
      tradePayables?: number;
    };

    // Group accounts only
    groupMetrics?: {
      consolidatedTurnover?: number;
      minorityInterests?: number;
      groupCashFlow?: number;
      intercompanyTransactions?: number;
    };

    // Growth & Performance
    performance: {
      revenueGrowth?: number;
      profitGrowth?: number;
      employeeGrowth?: number;
      marginTrends?: {
        grossMargin?: number;
        operatingMargin?: number;
        netMargin?: number;
      };
    };
  };

  // Operational Intelligence
  operational: {
    employeeCount?: number;
    employeeAverage?: number;
    wagesAndSalaries?: number;
    socialSecurityCosts?: number;
    pensionCosts?: number;
    
    // Director information
    directors?: Array<{
      name: string;
      role: string;
      appointedDate: string;
      nationality?: string;
      occupation?: string;
      address?: string;
    }>;
    
    // Facilities & Locations
    registeredOffice: string;
    tradingAddresses?: string[];
    
    // Business segments (from notes)
    businessSegments?: string[];
    principalActivities?: string[];
  };

  // Risk Intelligence
  risks: {
    // Audit & Compliance
    auditOpinion?: 'unqualified' | 'qualified' | 'adverse' | 'disclaimer';
    auditQualifications?: string[];
    goingConcernIssues?: boolean;
    materialUncertainties?: string[];
    
    // Financial risks
    liquidityRisk?: 'low' | 'medium' | 'high';
    solvencyRisk?: 'low' | 'medium' | 'high';
    concentrationRisks?: string[];
    
    // Operational risks
    keyPersonDependencies?: string[];
    regulatoryRisks?: string[];
    marketRisks?: string[];
    
    // Legal & Compliance
    legalProceedings?: string[];
    complianceIssues?: string[];
    fines?: Array<{
      amount: number;
      reason: string;
      authority: string;
      date: string;
    }>;
  };

  // Sustainability Intelligence (SECR & ESG)
  sustainability: {
    // SECR Compliance
    secrCompliant: boolean;
    energyConsumption?: {
      electricity?: number; // kWh
      gas?: number; // kWh
      transport?: number; // kWh
      total?: number; // kWh
    };
    
    carbonEmissions?: {
      scope1?: number; // tCO2e
      scope2?: number; // tCO2e 
      scope3?: number; // tCO2e
      total?: number; // tCO2e
      intensity?: number; // tCO2e per £m revenue
    };
    
    environmentalInitiatives?: string[];
    renewableEnergyUsage?: number; // percentage
    
    // Social metrics
    diversityMetrics?: {
      genderPayGap?: number;
      femaleDirectors?: number;
      totalDirectors?: number;
      ethnicityData?: any;
    };
    
    // Governance
    governanceStructure?: {
      independentDirectors?: number;
      boardCommittees?: string[];
      codeCompliance?: string;
    };
  };

  // Strategic Intelligence
  strategic: {
    // Investment & Growth
    capitalExpenditures?: number;
    rdSpend?: number;
    rdPercentage?: number;
    acquisitions?: Array<{
      target: string;
      amount: number;
      date: string;
      rationale: string;
    }>;
    
    // Market position
    marketShare?: number;
    competitivePosition?: string;
    geographicPresence?: string[];
    
    // Future plans (from directors' report)
    strategicPriorities?: string[];
    investmentPlans?: string[];
    marketExpansion?: string[];
    
    // Partnerships & Contracts
    keyContracts?: Array<{
      counterparty: string;
      value: number;
      duration: string;
      type: string;
    }>;
    
    jointVentures?: Array<{
      partner: string;
      ownership: number;
      purpose: string;
    }>;
  };

  // Government Contracting Intelligence
  contracting: {
    // Public sector readiness
    securityClearances?: string[];
    qualityAccreditations?: string[];
    environmentalCertifications?: string[];
    
    // Framework memberships
    frameworkMemberships?: string[];
    previousContracts?: Array<{
      client: string;
      value: number;
      date: string;
      sector: string;
    }>;
    
    // Compliance status
    gdprCompliance?: boolean;
    modernSlaveryStatement?: boolean;
    taxStrategy?: string;
    socialValueCommitments?: string[];
    
    // Capacity indicators
    bondingCapacity?: number;
    insuranceLimits?: {
      publicLiability?: number;
      professionalIndemnity?: number;
      employersLiability?: number;
    };
  };

  // Competitive Intelligence
  competitive: {
    // Market analysis
    competitorAnalysis?: Array<{
      competitor: string;
      relationship: 'direct' | 'indirect';
      strengths: string[];
      weaknesses: string[];
    }>;
    
    // Differentiation
    uniqueSellingPoints?: string[];
    competitiveAdvantages?: string[];
    marketThreats?: string[];
    
    // Bidding behavior (inferred)
    typicalContractSize?: {
      min: number;
      max: number;
      average: number;
    };
    
    preferredSectors?: string[];
    geographicFocus?: string[];
  };

  // Extraction Metadata
  extractionMetadata: {
    extractionDate: string;
    accountsDate: string;
    accountType: string;
    documentPages: number;
    processingTime: number;
    confidence: number;
    dataCompleteness: number;
    jigsawStackLogId: string;
  };
}

/**
 * Account Type Specific Extraction Strategies
 */
export class CompaniesHouseIntelligenceExtractor {
  
  static determineAccountType(intelligence: any): CompaniesHouseAccountType {
    // Analyze document structure to determine account type
    const hasDetailedPL = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('profit and loss') ||
      s.text?.toLowerCase().includes('income statement')
    );
    
    const hasBalanceSheet = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('balance sheet')
    );
    
    const hasCashFlow = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('cash flow')
    );
    
    const hasNotes = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('notes to') ||
      s.text?.toLowerCase().includes('accounting policies')
    );
    
    const hasDirectorsReport = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('directors\' report') ||
      s.text?.toLowerCase().includes('strategic report')
    );

    const hasGroupStructure = intelligence.sections?.some((s: any) => 
      s.text?.toLowerCase().includes('subsidiary') ||
      s.text?.toLowerCase().includes('consolidated') ||
      s.text?.toLowerCase().includes('group')
    );

    // Revenue thresholds for company size classification
    const revenue = this.extractRevenue(intelligence);
    
    let size: 'micro' | 'small' | 'medium' | 'large';
    if (revenue < 632000) size = 'micro';
    else if (revenue < 10200000) size = 'small';
    else if (revenue < 36000000) size = 'medium';
    else size = 'large';

    // Determine account type
    let type: 'abbreviated' | 'full' | 'group' | 'micro' | 'dormant';
    
    if (hasGroupStructure) {
      type = 'group';
    } else if (size === 'micro') {
      type = 'micro';
    } else if (hasDetailedPL && hasBalanceSheet && hasCashFlow && hasNotes) {
      type = 'full';
    } else if (hasBalanceSheet && hasDirectorsReport) {
      type = 'abbreviated';
    } else {
      type = 'abbreviated'; // fallback
    }

    return {
      type,
      size,
      hasGroupStructure,
    };
  }

  static extractRevenue(intelligence: any): number {
    // Extract revenue from various formats
    const fullText = intelligence.sections?.map((s: any) => s.text).join('\n').toLowerCase() || '';
    
    // Look for revenue/turnover patterns
    const revenuePatterns = [
      /turnover[:\s]+[£$€]?([\d,]+(?:,\d{3})*)/gi,
      /revenue[:\s]+[£$€]?([\d,]+(?:,\d{3})*)/gi,
      /sales[:\s]+[£$€]?([\d,]+(?:,\d{3})*)/gi,
    ];
    
    for (const pattern of revenuePatterns) {
      const matches = Array.from(fullText.matchAll(pattern));
      for (const match of matches) {
        const value = parseInt(match[1].replace(/,/g, ''));
        if (value > 10000) { // Reasonable minimum
          return value;
        }
      }
    }
    
    return 0;
  }

  static getExtractionPrompts(accountType: CompaniesHouseAccountType): string[] {
    const basePrompts = [
      "company name and registration number",
      "annual turnover or revenue in pounds",
      "net profit after tax",
      "total number of employees",
      "directors names and roles",
      "registered office address",
    ];

    const abbreviatedPrompts = [
      ...basePrompts,
      "balance sheet total assets",
      "current assets amount",
      "current liabilities amount", 
      "shareholders funds",
      "principal activities",
      "audit opinion type",
    ];

    const fullAccountPrompts = [
      ...abbreviatedPrompts,
      "gross profit amount",
      "operating profit amount",
      "cash and cash equivalents",
      "trade receivables amount",
      "trade payables amount",
      "inventories value",
      "research and development costs",
      "capital expenditure amount",
      "depreciation charge",
      "interest payments",
      "taxation charge",
      "dividend payments",
      "cash flow from operations",
      "cash flow from investing",
      "cash flow from financing",
      "going concern statement",
      "material uncertainties",
      "subsequent events",
      "contingent liabilities",
      "related party transactions",
      "financial commitments",
    ];

    const sustainabilityPrompts = [
      "SECR compliance mentioned",
      "carbon emissions total tonnes CO2",
      "scope 1 emissions",
      "scope 2 emissions", 
      "scope 3 emissions",
      "energy consumption kWh",
      "renewable energy percentage",
      "environmental initiatives",
      "carbon reduction targets",
      "energy efficiency measures",
    ];

    const groupAccountPrompts = [
      ...fullAccountPrompts,
      "consolidated turnover",
      "subsidiary company names",
      "minority interests",
      "intercompany transactions",
      "group cash pooling",
      "segment reporting",
      "geographic revenue breakdown",
    ];

    switch (accountType.type) {
      case 'micro':
        return basePrompts;
      case 'abbreviated':
        return [...abbreviatedPrompts, ...sustainabilityPrompts];
      case 'full':
        return [...fullAccountPrompts, ...sustainabilityPrompts];
      case 'group':
        return [...groupAccountPrompts, ...sustainabilityPrompts];
      default:
        return [...fullAccountPrompts, ...sustainabilityPrompts];
    }
  }

  /**
   * Generate bid-specific intelligence prompts based on tender requirements
   */
  static getBidSpecificPrompts(tenderRequirements: {
    sectors?: string[];
    minimumTurnover?: number;
    sustainability?: boolean;
    security?: boolean;
    international?: boolean;
  }): string[] {
    const bidPrompts: string[] = [];

    if (tenderRequirements.minimumTurnover) {
      bidPrompts.push(
        `annual revenue exceeds ${tenderRequirements.minimumTurnover}`,
        "revenue growth trend over 3 years",
        "financial stability indicators"
      );
    }

    if (tenderRequirements.sustainability) {
      bidPrompts.push(
        "net zero commitments",
        "carbon reduction strategy",
        "environmental management system",
        "sustainability certifications",
        "circular economy initiatives"
      );
    }

    if (tenderRequirements.security) {
      bidPrompts.push(
        "security clearances held",
        "cyber security certifications", 
        "data protection measures",
        "information security policies"
      );
    }

    if (tenderRequirements.international) {
      bidPrompts.push(
        "international operations",
        "overseas subsidiaries",
        "foreign exchange exposure",
        "export experience"
      );
    }

    if (tenderRequirements.sectors) {
      bidPrompts.push(
        ...tenderRequirements.sectors.map(sector => 
          `experience in ${sector} sector`
        )
      );
    }

    return bidPrompts;
  }
}

/**
 * Intelligence scoring specific to account types
 */
export class IntelligenceScorer {
  
  static scoreDataCompleteness(intelligence: StandardizedIntelligence): number {
    const weights = {
      financial: 0.3,
      operational: 0.2,
      risks: 0.2,
      sustainability: 0.15,
      strategic: 0.1,
      contracting: 0.05,
    };

    let totalScore = 0;
    let maxPossibleScore = 0;

    // Financial completeness
    const financialFields = [
      'basicMetrics.turnover',
      'basicMetrics.netProfit', 
      'basicMetrics.totalAssets',
      'detailedMetrics.currentRatio',
      'performance.revenueGrowth'
    ];
    
    const financialScore = this.scoreFieldCompleteness(intelligence.financial, financialFields);
    totalScore += financialScore * weights.financial;
    maxPossibleScore += weights.financial;

    // Continue for other sections...
    return Math.round((totalScore / maxPossibleScore) * 100);
  }

  private static scoreFieldCompleteness(obj: any, fields: string[]): number {
    let completedFields = 0;
    
    for (const field of fields) {
      if (this.hasNestedValue(obj, field)) {
        completedFields++;
      }
    }
    
    return completedFields / fields.length;
  }

  private static hasNestedValue(obj: any, path: string): boolean {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined && current[key] !== null, obj
    );
  }
}