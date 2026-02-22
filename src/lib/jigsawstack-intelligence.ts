// Complete Company Intelligence Extraction using JigsawStack
// Extracts ALL bid-relevant data from company accounts, reports, and documents
// Based on OCR-CTO-finder findings: 91% accuracy, handles chunking for large PDFs

interface CompanyIntelligenceRequest {
  documentUrl?: string;
  documentBuffer?: Buffer;
  companyName: string;
  companyNumber?: string;
  extractionType?: 'comprehensive' | 'financial' | 'strategic' | 'sustainability' | 'governance';
  maxChunkSize?: number;
  targetSectors?: string[]; // CPV codes or sectors they might bid for
}

interface CompanyIntelligence {
  // Core Company Info
  company: {
    name: string;
    number?: string;
    registeredOffice?: string;
    incorporationDate?: string;
    companyType?: string;
    status?: string;
  };
  
  // Financial Intelligence
  financial: {
    // Revenue & Scale
    turnover?: number;
    grossProfit?: number;
    netProfit?: number;
    totalAssets?: number;
    currentRatio?: number;
    debtToEquity?: number;
    
    // Growth & Stability
    revenueGrowth?: number; // YoY %
    profitMargin?: number; // %
    employeeCount?: number;
    averageEmployeeCost?: number;
    
    // Liquidity & Capacity
    cashAndEquivalents?: number;
    workingCapital?: number;
    creditRating?: string;
    bondRating?: string;
    
    // Government Contract Capability
    bondingCapacity?: number;
    insuranceCover?: number;
    contractCapacity?: number; // Max contract size they can handle
    
    financialYear: string;
    currency: string;
  };
  
  // Strategic Intelligence
  strategic: {
    // Business Model
    primaryBusinessAreas?: string[];
    revenueStreams?: Array<{ 
      description: string; 
      percentage?: number; 
      growth?: string;
    }>;
    
    // Market Position
    marketShare?: number;
    competitivePosition?: string;
    majorCompetitors?: string[];
    uniqueValueProps?: string[];
    
    // Growth Strategy
    strategicPriorities?: string[];
    investmentAreas?: string[];
    acquisitionStrategy?: string;
    internationalPresence?: string[];
    
    // Technology & Innovation
    rdSpend?: number;
    rdPercentage?: number;
    technologicalCapabilities?: string[];
    digitalTransformation?: string[];
    patents?: number;
  };
  
  // Operational Intelligence  
  operational: {
    // Capacity & Scale
    facilities?: Array<{
      location: string;
      type: string; // 'manufacturing', 'office', 'warehouse'
      capacity?: string;
    }>;
    
    // Workforce
    employeeBreakdown?: Array<{
      category: string; // 'technical', 'sales', 'management'
      count?: number;
      percentage?: number;
    }>;
    
    // Certifications & Standards
    qualityStandards?: string[]; // ISO 9001, etc.
    environmentalStandards?: string[]; // ISO 14001, etc.
    securityClearances?: string[]; // Security standards
    industryAccreditations?: string[];
    
    // Supply Chain
    supplierDiversity?: number;
    localSuppliers?: number;
    supplyChainResilience?: string;
  };
  
  // Sustainability Intelligence
  sustainability: {
    // Environmental
    carbonEmissions?: {
      scope1?: number;
      scope2?: number; 
      scope3?: number;
      total?: number;
      intensity?: number;
      reductionTarget?: { percentage: number; year: number };
    };
    
    energyData?: {
      consumption?: number;
      renewablePercentage?: number;
      efficiency?: number;
      greenEnergyCertificates?: number;
    };
    
    wasteManagement?: {
      recyclingRate?: number;
      wasteReduction?: number;
      circularEconomy?: boolean;
    };
    
    // Social
    diversityMetrics?: {
      genderDiversity?: number;
      ethnicDiversity?: number;
      boardDiversity?: number;
    };
    
    communityInvestment?: number;
    employeeWellbeing?: string[];
    apprenticeshipPrograms?: boolean;
    
    // Governance
    sustainabilityGovernance?: boolean;
    sustainabilityCommittee?: boolean;
    executiveIncentives?: boolean; // Sustainability-linked pay
    
    // Certifications
    sustainabilityCertifications?: string[]; // B-Corp, Carbon Trust, etc.
    secrCompliant?: boolean;
    tcfdReporting?: boolean;
  };
  
  // Risk Intelligence
  risks: {
    // Financial Risks
    goingConcern?: boolean;
    materialUncertainties?: string[];
    auditQualifications?: string[];
    covenantBreaches?: boolean;
    
    // Operational Risks
    keyPersonRisk?: string[];
    supplierDependency?: string[];
    cybersecurityRisks?: string[];
    regulatoryRisks?: string[];
    
    // Market Risks
    customerConcentration?: number; // % of revenue from top customer
    sectorRisks?: string[];
    geographicalRisks?: string[];
    
    // ESG Risks
    environmentalLiabilities?: number;
    socialRisks?: string[];
    governanceIssues?: string[];
  };
  
  // Government Contracting Intelligence
  contracting: {
    // Experience
    previousContracts?: Array<{
      client: string;
      value?: number;
      sector?: string;
      outcome?: string;
      year?: number;
    }>;
    
    frameworkMemberships?: string[]; // G-Cloud, CCS frameworks
    securityClearance?: string;
    
    // Capabilities
    projectDeliveryRecord?: string;
    contractManagementSystems?: string[];
    qualityAssurance?: string[];
    
    // Compliance
    gdprCompliance?: boolean;
    ir35Compliance?: boolean;
    modernSlaveryStatement?: boolean;
    
    // Social Value
    socialValueCommitments?: string[];
    localEconomicImpact?: number;
    apprenticeshipCommitments?: number;
  };
  
  // Leadership Intelligence
  leadership: {
    keyPersonnel?: Array<{
      name: string;
      position: string;
      background?: string;
      tenure?: number;
      previousRoles?: string[];
      qualifications?: string[];
    }>;
    
    boardComposition?: {
      size: number;
      independentDirectors?: number;
      diversity?: string;
      avgTenure?: number;
    };
    
    leadershipStability?: string;
    successionPlanning?: boolean;
  };
  
  // Competitive Intelligence
  competitive: {
    marketPosition?: string;
    competitiveAdvantages?: string[];
    threats?: string[];
    opportunities?: string[];
    
    // Bidding Behavior
    biddingStrategy?: string;
    pricePositioning?: string; // 'premium', 'competitive', 'value'
    winRate?: number;
    typicalContractSize?: { min: number; max: number };
    
    // Partnerships
    strategicPartnerships?: string[];
    jointVentures?: string[];
    subcontractorNetwork?: string[];
  };
  
  // Raw extraction metadata
  extractionMetadata: {
    documentType: string; // 'annual_report', 'accounts', 'sustainability_report'
    pagesProcessed: number[];
    processingTime: number;
    confidence: number;
    dataCompleteness: number; // % of fields populated
    extractionDate: Date;
    jigsawstackVersion?: string;
    chunkingStrategy?: string;
  };
}

export class JigsawStackIntelligenceExtractor {
  private apiKey: string;
  private baseUrl: string = 'https://api.jigsawstack.com/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async extractCompanyIntelligence(request: CompanyIntelligenceRequest): Promise<CompanyIntelligence> {
    try {
      console.log(`Starting comprehensive intelligence extraction for ${request.companyName}`);
      
      // Prepare document for processing (chunking if needed)
      const chunks = await this.prepareDocumentChunks(request);
      
      // Extract intelligence from each chunk
      const results = await Promise.all(
        chunks.map((chunk, index) => this.extractFromChunk(chunk, request, index))
      );
      
      // Merge all results
      return this.mergeIntelligenceResults(results, request.companyName);
    } catch (error) {
      console.error('Intelligence extraction failed:', error);
      throw new Error(`Failed to extract company intelligence: ${error}`);
    }
  }
  
  private async prepareDocumentChunks(request: CompanyIntelligenceRequest): Promise<any[]> {
    const maxSize = request.maxChunkSize || 1024 * 1024; // 1MB as per your findings
    
    // For now, return as single chunk
    // In production, implement PDF page extraction using pdf-lib
    return [{
      buffer: request.documentBuffer,
      url: request.documentUrl,
      pages: null,
      chunkIndex: 0,
    }];
  }
  
  private async extractFromChunk(chunk: any, request: CompanyIntelligenceRequest, index: number): Promise<Partial<CompanyIntelligence>> {
    const prompt = this.buildComprehensiveExtractionPrompt(request.companyName, request.targetSectors);
    
    const requestBody = {
      document_url: chunk.url,
      document: chunk.buffer ? chunk.buffer.toString('base64') : undefined,
      prompt: prompt,
      extract_type: 'comprehensive',
    };
    
    console.log(`Processing chunk ${index + 1} for ${request.companyName}`);
    
    const response = await fetch(`${this.baseUrl}/ai/document_extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JigsawStack API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    return this.parseIntelligenceResponse(result, index);
  }
  
  private buildComprehensiveExtractionPrompt(companyName: string, targetSectors?: string[]): string {
    const sectorContext = targetSectors?.length 
      ? `The company may bid for contracts in these sectors: ${targetSectors.join(', ')}.`
      : '';
    
    return `
Extract comprehensive business intelligence for ${companyName} that would be valuable for competitive bid analysis and due diligence. ${sectorContext}

**FINANCIAL INTELLIGENCE:**
- Annual turnover/revenue (exact figures and currency)
- Gross profit, net profit, profit margins
- Total assets, current assets, fixed assets
- Current ratio, debt-to-equity ratio
- Cash and cash equivalents, working capital
- Employee count and average employee costs
- Revenue growth year-on-year
- Credit ratings, bond ratings if mentioned
- Financial year end date

**STRATEGIC BUSINESS INTELLIGENCE:**
- Primary business areas and revenue streams
- Market share and competitive position
- Major competitors mentioned
- Strategic priorities and investment areas
- R&D spending and innovation focus
- International presence and expansion plans
- Acquisition strategy and partnerships
- Technology capabilities and digital transformation initiatives
- Patents and intellectual property

**OPERATIONAL CAPABILITIES:**
- Manufacturing facilities and office locations
- Production capacity and operational scale
- Quality certifications (ISO 9001, etc.)
- Environmental standards (ISO 14001, etc.)
- Security clearances and accreditations
- Supply chain information
- Workforce breakdown (technical, sales, management)
- Project delivery methodologies
- Contract management capabilities

**SUSTAINABILITY & ESG:**
- Carbon emissions (Scope 1, 2, 3) and reduction targets
- Energy consumption and renewable energy usage
- Waste management and recycling rates
- Diversity and inclusion metrics
- Community investment and social impact
- Sustainability certifications
- SECR compliance and TCFD reporting
- Board diversity and governance structure
- Executive sustainability incentives

**RISK ASSESSMENT:**
- Going concern statements and material uncertainties
- Audit qualifications or emphasis of matter
- Key person dependencies
- Customer concentration risks
- Regulatory and compliance risks
- Cybersecurity and operational risks
- Environmental liabilities
- Covenant breaches or financial stress indicators

**GOVERNMENT CONTRACTING CAPABILITY:**
- Previous government contracts and outcomes
- Framework memberships (G-Cloud, CCS, etc.)
- Security clearance levels
- Social value commitments and delivery
- GDPR compliance, IR35 compliance
- Modern slavery statement compliance
- Apprenticeship programs and commitments
- Local economic impact initiatives

**LEADERSHIP & GOVERNANCE:**
- Key executives and their backgrounds
- Board composition and independence
- Leadership stability and succession planning
- Director qualifications and tenure
- Corporate governance structure

**COMPETITIVE POSITIONING:**
- Market position and competitive advantages
- Pricing strategy and positioning
- Typical contract sizes and project types
- Win rates and bidding success
- Strategic partnerships and alliances
- Subcontractor relationships

For each data point, include:
1. The exact figure or description found
2. The page number where it was located
3. The context (which section/report)
4. Confidence level (high/medium/low)

Focus on quantified data points and specific facts rather than general statements.
Return structured data that can be easily parsed and analyzed.
`;
  }
  
  private parseIntelligenceResponse(response: any, chunkIndex: number): Partial<CompanyIntelligence> {
    // Parse JigsawStack response into structured intelligence
    // This would need to be adapted based on actual API response format
    const data = response.data || response.content || response;
    
    // For now, return a structure that can be merged
    return {
      financial: this.extractFinancialData(data),
      strategic: this.extractStrategicData(data),
      operational: this.extractOperationalData(data),
      sustainability: this.extractSustainabilityData(data),
      risks: this.extractRiskData(data),
      contracting: this.extractContractingData(data),
      leadership: this.extractLeadershipData(data),
      competitive: this.extractCompetitiveData(data),
      
      extractionMetadata: {
        documentType: this.detectDocumentType(data),
        pagesProcessed: this.extractPageNumbers(data),
        processingTime: Date.now(), // Would track actual processing time
        confidence: this.calculateChunkConfidence(data),
        dataCompleteness: 0, // Calculate based on fields populated
        extractionDate: new Date(),
        chunkingStrategy: chunkIndex === 0 ? 'single_document' : 'multi_chunk',
      },
    };
  }
  
  private extractFinancialData(data: any): any {
    return {
      turnover: this.extractCurrency(data, ['turnover', 'revenue', 'sales', 'total_revenue']),
      grossProfit: this.extractCurrency(data, ['gross_profit', 'gross_margin']),
      netProfit: this.extractCurrency(data, ['net_profit', 'profit_after_tax', 'net_income']),
      totalAssets: this.extractCurrency(data, ['total_assets', 'assets']),
      currentRatio: this.extractNumber(data, ['current_ratio', 'liquidity_ratio']),
      employeeCount: this.extractNumber(data, ['employees', 'employee_count', 'staff_count']),
      revenueGrowth: this.extractPercentage(data, ['revenue_growth', 'growth_rate']),
      cashAndEquivalents: this.extractCurrency(data, ['cash', 'cash_equivalents', 'liquid_assets']),
      workingCapital: this.extractCurrency(data, ['working_capital']),
      financialYear: this.extractString(data, ['financial_year', 'year_end']),
      currency: this.detectCurrency(data) || 'GBP',
    };
  }
  
  private extractStrategicData(data: any): any {
    return {
      primaryBusinessAreas: this.extractArray(data, ['business_areas', 'sectors', 'activities']),
      strategicPriorities: this.extractArray(data, ['strategic_priorities', 'strategy', 'objectives']),
      rdSpend: this.extractCurrency(data, ['rd_spend', 'research_development', 'innovation_spend']),
      technologicalCapabilities: this.extractArray(data, ['technology', 'tech_capabilities', 'digital']),
      internationalPresence: this.extractArray(data, ['international', 'global_presence', 'countries']),
    };
  }
  
  private extractOperationalData(data: any): any {
    return {
      qualityStandards: this.extractArray(data, ['iso_9001', 'quality_standards', 'certifications']),
      environmentalStandards: this.extractArray(data, ['iso_14001', 'environmental_standards']),
      securityClearances: this.extractArray(data, ['security_clearance', 'security_standards']),
      facilities: this.extractFacilities(data),
    };
  }
  
  private extractSustainabilityData(data: any): any {
    return {
      carbonEmissions: {
        scope1: this.extractNumber(data, ['scope1', 'scope_1_emissions']),
        scope2: this.extractNumber(data, ['scope2', 'scope_2_emissions']),
        scope3: this.extractNumber(data, ['scope3', 'scope_3_emissions']),
        total: this.extractNumber(data, ['total_emissions', 'carbon_footprint']),
      },
      energyData: {
        consumption: this.extractNumber(data, ['energy_consumption', 'energy_use']),
        renewablePercentage: this.extractPercentage(data, ['renewable_energy', 'green_energy']),
      },
      wasteManagement: {
        recyclingRate: this.extractPercentage(data, ['recycling_rate', 'waste_recycled']),
      },
      secrCompliant: this.extractBoolean(data, ['secr', 'secr_compliant', 'energy_reporting']),
      tcfdReporting: this.extractBoolean(data, ['tcfd', 'climate_reporting']),
    };
  }
  
  private extractRiskData(data: any): any {
    return {
      goingConcern: this.extractBoolean(data, ['going_concern', 'material_uncertainty']),
      materialUncertainties: this.extractArray(data, ['uncertainties', 'risks', 'material_risks']),
      customerConcentration: this.extractPercentage(data, ['customer_concentration', 'major_customer']),
    };
  }
  
  private extractContractingData(data: any): any {
    return {
      frameworkMemberships: this.extractArray(data, ['frameworks', 'g_cloud', 'ccs_framework']),
      gdprCompliance: this.extractBoolean(data, ['gdpr', 'data_protection']),
      modernSlaveryStatement: this.extractBoolean(data, ['modern_slavery', 'slavery_statement']),
      socialValueCommitments: this.extractArray(data, ['social_value', 'community_benefit']),
    };
  }
  
  private extractLeadershipData(data: any): any {
    return {
      keyPersonnel: this.extractPersonnel(data),
      boardComposition: {
        size: this.extractNumber(data, ['board_size', 'directors']),
        independentDirectors: this.extractNumber(data, ['independent_directors']),
      },
    };
  }
  
  private extractCompetitiveData(data: any): any {
    return {
      competitiveAdvantages: this.extractArray(data, ['advantages', 'differentiators', 'strengths']),
      strategicPartnerships: this.extractArray(data, ['partnerships', 'alliances', 'joint_ventures']),
    };
  }
  
  // Helper extraction methods
  private extractCurrency(data: any, keys: string[]): number | undefined {
    for (const key of keys) {
      if (data[key] !== undefined) {
        // Parse currency values, removing £, $, commas, etc.
        const cleanValue = String(data[key]).replace(/[£$€,\s]/g, '');
        const num = parseFloat(cleanValue);
        if (!isNaN(num)) return num;
      }
    }
    return undefined;
  }
  
  private extractNumber(data: any, keys: string[]): number | undefined {
    for (const key of keys) {
      if (data[key] !== undefined) {
        const num = parseFloat(String(data[key]).replace(/[^\d.-]/g, ''));
        if (!isNaN(num)) return num;
      }
    }
    return undefined;
  }
  
  private extractPercentage(data: any, keys: string[]): number | undefined {
    for (const key of keys) {
      if (data[key] !== undefined) {
        const str = String(data[key]).replace(/[^0-9.]/g, '');
        const num = parseFloat(str);
        if (!isNaN(num)) return num;
      }
    }
    return undefined;
  }
  
  private extractString(data: any, keys: string[]): string | undefined {
    for (const key of keys) {
      if (data[key] && typeof data[key] === 'string') {
        return data[key].trim();
      }
    }
    return undefined;
  }
  
  private extractBoolean(data: any, keys: string[]): boolean {
    for (const key of keys) {
      if (data[key] !== undefined) {
        const val = String(data[key]).toLowerCase();
        return val === 'true' || val === 'yes' || val === '1' || val.includes('compliant');
      }
    }
    return false;
  }
  
  private extractArray(data: any, keys: string[]): string[] {
    for (const key of keys) {
      if (Array.isArray(data[key])) {
        return data[key];
      } else if (typeof data[key] === 'string') {
        // Split on common delimiters
        return data[key].split(/[,;]/).map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  }
  
  private extractFacilities(data: any): any[] {
    // Extract facility/location information
    return [];
  }
  
  private extractPersonnel(data: any): any[] {
    // Extract key personnel information
    return [];
  }
  
  private extractPageNumbers(data: any): number[] {
    // Extract page references from the response
    return [];
  }
  
  private detectDocumentType(data: any): string {
    // Determine what type of document was processed
    if (data.includes?.('annual report')) return 'annual_report';
    if (data.includes?.('sustainability')) return 'sustainability_report';
    return 'accounts';
  }
  
  private detectCurrency(data: any): string | undefined {
    const content = JSON.stringify(data);
    if (content.includes('£') || content.includes('GBP')) return 'GBP';
    if (content.includes('$') || content.includes('USD')) return 'USD';
    if (content.includes('€') || content.includes('EUR')) return 'EUR';
    return undefined;
  }
  
  private calculateChunkConfidence(data: any): number {
    // Calculate confidence based on data extracted
    return 0.8; // Placeholder
  }
  
  private mergeIntelligenceResults(results: Partial<CompanyIntelligence>[], companyName: string): CompanyIntelligence {
    // Merge results from all chunks
    const merged: CompanyIntelligence = {
      company: { name: companyName },
      financial: {},
      strategic: {},
      operational: {},
      sustainability: {},
      risks: {},
      contracting: {},
      leadership: {},
      competitive: {},
      extractionMetadata: {
        documentType: 'comprehensive',
        pagesProcessed: [],
        processingTime: 0,
        confidence: 0.8,
        dataCompleteness: 0.7,
        extractionDate: new Date(),
      },
    };
    
    // Deep merge all results
    results.forEach(result => {
      Object.keys(result).forEach(key => {
        if (key in merged) {
          merged[key as keyof CompanyIntelligence] = {
            ...merged[key as keyof CompanyIntelligence],
            ...result[key as keyof CompanyIntelligence],
          };
        }
      });
    });
    
    return merged;
  }
}

// Integration function for RFP Quest
export async function extractCompanyIntelligence(
  companyNumber: string,
  companyName: string,
  targetSectors?: string[]
): Promise<CompanyIntelligence | null> {
  const jigsawApiKey = process.env.JIGSAWSTACK_API_KEY;
  if (!jigsawApiKey) {
    console.warn('JigsawStack API key not configured');
    return null;
  }
  
  try {
    const extractor = new JigsawStackIntelligenceExtractor(jigsawApiKey);
    
    // Get latest company document (accounts, annual report)
    const documentUrl = await getCompanyDocument(companyNumber);
    
    if (!documentUrl) {
      console.log(`No document found for ${companyName} (${companyNumber})`);
      return null;
    }
    
    console.log(`Extracting comprehensive intelligence for ${companyName}...`);
    
    const intelligence = await extractor.extractCompanyIntelligence({
      documentUrl,
      companyName,
      companyNumber,
      extractionType: 'comprehensive',
      targetSectors,
    });
    
    console.log(`Intelligence extraction completed for ${companyName}:`, {
      confidence: intelligence.extractionMetadata.confidence,
      completeness: intelligence.extractionMetadata.dataCompleteness,
      financialData: !!intelligence.financial.turnover,
      sustainabilityData: !!intelligence.sustainability.carbonEmissions,
    });
    
    return intelligence;
  } catch (error) {
    console.error(`Intelligence extraction failed for ${companyName}:`, error);
    return null;
  }
}

async function getCompanyDocument(companyNumber: string): Promise<string | null> {
  // Get latest accounts/annual report from Companies House
  try {
    const CH_API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
    if (!CH_API_KEY) return null;
    
    const response = await fetch(
      `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history?category=accounts&items_per_page=1`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(CH_API_KEY + ':').toString('base64')}`,
        },
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const latestFiling = data.items?.[0];
    
    if (!latestFiling?.links?.document) return null;
    
    return `https://beta.companieshouse.gov.uk${latestFiling.links.document}`;
  } catch (error) {
    console.error('Failed to get company document:', error);
    return null;
  }
}

export type { CompanyIntelligence, CompanyIntelligenceRequest };