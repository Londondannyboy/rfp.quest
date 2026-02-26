// Enhanced SECR Data Extraction using JigsawStack API
// Based on findings from OCR-CTO-Finder project showing 91% accuracy vs traditional methods

interface JigsawStackConfig {
  apiKey: string;
  baseUrl: string;
}

interface SECRExtractionRequest {
  documentUrl?: string;
  documentBuffer?: Buffer;
  companyName: string;
  extractionType?: 'comprehensive' | 'targeted' | 'regulatory';
  maxChunkSize?: number; // For large PDFs, chunk into smaller parts
}

interface SECRData {
  // Core SECR Requirements
  secrCompliant: boolean;
  secrStatementPage?: number;
  
  // Energy Consumption
  energyConsumption?: {
    total?: number; // MWh
    intensity?: number; // MWh per £m revenue
    baseYear?: number;
    currency?: string;
  };
  
  // Emissions Data
  emissions?: {
    scope1?: number; // tCO2e
    scope2?: number; // tCO2e
    scope3?: number; // tCO2e (if reported)
    total?: number; // tCO2e
    intensity?: number; // tCO2e per £m revenue
    baseYear?: number;
  };
  
  // Reduction Targets & Progress
  reductionTargets?: {
    energyReduction?: {
      target?: number; // MWh
      achieved?: number; // MWh
      percentage?: number; // %
      baseYear?: number;
    };
    emissionReduction?: {
      target?: number; // tCO2e
      achieved?: number; // tCO2e
      percentage?: number; // %
      baseYear?: number;
    };
    netZeroTarget?: {
      year?: number;
      scope?: string; // 'Scope 1+2', 'All Scopes', etc.
    };
  };
  
  // Verification & Assurance
  verification?: {
    verified?: boolean;
    verificationBody?: string; // e.g., "Bureau Veritas"
    scope?: string; // What was verified
    standard?: string; // e.g., "ISO 14064"
  };
  
  // Supply Chain & Sustainability
  supplyChain?: {
    tier1Coverage?: number; // % of suppliers
    sustainabilityRequirements?: boolean;
    carbonAssessment?: boolean;
  };
  
  // Waste & Circular Economy
  waste?: {
    recyclingRate?: number; // %
    wasteToLandfill?: number; // tonnes or %
    circularEconomy?: boolean;
  };
  
  // Renewable Energy
  renewableEnergy?: {
    percentage?: number; // % of total energy
    capacity?: number; // MW
    sources?: string[]; // ['Solar', 'Wind', etc.]
  };
  
  // Governance
  governance?: {
    boardOversight?: boolean;
    executiveResponsibility?: string;
    sustainabilityCommittee?: boolean;
  };
  
  // Raw extraction metadata
  extractionMetadata: {
    pagesProcessed: number[];
    processingTime: number;
    confidence: number; // 0-1
    chunksProcessed: number;
    extractedDate: Date;
  };
}

export class JigsawStackSECRExtractor {
  private config: JigsawStackConfig;
  
  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.jigsawstack.com/v1',
    };
  }
  
  async extractSECRData(request: SECRExtractionRequest): Promise<SECRData> {
    try {
      // For large PDFs, we need to chunk them
      const chunks = await this.prepareDocumentChunks(request);
      
      let allData: Partial<SECRData> = {};
      const processedPages: number[] = [];
      let totalProcessingTime = 0;
      
      for (const chunk of chunks) {
        const startTime = Date.now();
        const chunkData = await this.extractFromChunk(chunk, request.companyName);
        const processingTime = Date.now() - startTime;
        
        // Merge results
        allData = this.mergeExtractionResults(allData, chunkData);
        processedPages.push(...(chunkData.extractionMetadata?.pagesProcessed || []));
        totalProcessingTime += processingTime;
      }
      
      return {
        ...allData,
        extractionMetadata: {
          pagesProcessed: processedPages,
          processingTime: totalProcessingTime,
          confidence: this.calculateOverallConfidence(allData),
          chunksProcessed: chunks.length,
          extractedDate: new Date(),
        },
      } as SECRData;
    } catch (error) {
      console.error('SECR extraction failed:', error);
      throw new Error(`Failed to extract SECR data: ${error}`);
    }
  }
  
  private async prepareDocumentChunks(request: SECRExtractionRequest): Promise<any[]> {
    // For now, return single chunk - in production, implement PDF chunking
    // Based on your findings: 14.9MB → 0.75MB chunks works best
    const maxSize = request.maxChunkSize || 1024 * 1024; // 1MB default
    
    if (request.documentBuffer && request.documentBuffer.length > maxSize) {
      // TODO: Implement PDF page extraction using pdf-lib
      // For now, process as single document
      console.warn('Large PDF detected. Consider implementing chunking for better results.');
    }
    
    return [{
      buffer: request.documentBuffer,
      url: request.documentUrl,
      pages: null, // Process all pages
    }];
  }
  
  private async extractFromChunk(chunk: any, companyName: string): Promise<Partial<SECRData>> {
    const prompt = this.buildSECRExtractionPrompt(companyName);
    
    const requestBody = {
      document_url: chunk.url,
      document: chunk.buffer ? chunk.buffer.toString('base64') : undefined,
      prompt: prompt,
      extract_type: 'comprehensive', // or 'targeted' for specific data points
    };
    
    const response = await fetch(`${this.config.baseUrl}/ai/document_extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`JigsawStack API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return this.parseJigsawStackResponse(result);
  }
  
  private buildSECRExtractionPrompt(companyName: string): string {
    return `
Extract SECR (Streamlined Energy and Carbon Reporting) data for ${companyName} from this document.

Find and extract the following information:

**SECR COMPLIANCE:**
- Is there a SECR statement? (yes/no and page number)
- SECR compliance confirmation text

**ENERGY CONSUMPTION:**
- Total energy consumption (MWh)
- Energy intensity ratio (MWh per £million revenue)
- Base year for comparisons
- Energy consumption breakdown by source if available

**EMISSIONS DATA:**
- Scope 1 emissions (tCO2e)
- Scope 2 emissions (tCO2e)  
- Scope 3 emissions (tCO2e) if reported
- Total emissions (tCO2e)
- Emissions intensity (tCO2e per £million revenue)
- Base year for emissions

**REDUCTION TARGETS & PROGRESS:**
- Energy reduction achieved (MWh and %)
- Emission reduction achieved (tCO2e and %)
- Net zero target year
- Progress against targets

**VERIFICATION & ASSURANCE:**
- External verification (yes/no)
- Verification body (e.g., Bureau Veritas, DNV GL)
- What was verified
- Assurance standard used

**SUSTAINABILITY METRICS:**
- Renewable energy percentage
- Supply chain sustainability coverage (% of suppliers)
- Waste recycling rate
- Waste to landfill figures

**GOVERNANCE:**
- Board oversight of sustainability
- Executive responsibility
- Sustainability committee existence

For each data point found, include the page number where it was located.

Return structured data with confidence levels for each extracted value.
`;
  }
  
  private parseJigsawStackResponse(response: any): Partial<SECRData> {
    // Parse the response from JigsawStack
    // This would need to be adapted based on actual API response format
    const data = response.data || response;
    
    return {
      secrCompliant: this.extractBoolean(data, ['secr_compliant', 'secr_statement']),
      secrStatementPage: this.extractNumber(data, ['secr_page', 'statement_page']),
      
      energyConsumption: {
        total: this.extractNumber(data, ['energy_total', 'energy_consumption', 'total_energy']),
        intensity: this.extractNumber(data, ['energy_intensity', 'energy_per_million']),
        baseYear: this.extractNumber(data, ['energy_base_year', 'base_year']),
      },
      
      emissions: {
        scope1: this.extractNumber(data, ['scope1', 'scope_1_emissions']),
        scope2: this.extractNumber(data, ['scope2', 'scope_2_emissions']),
        scope3: this.extractNumber(data, ['scope3', 'scope_3_emissions']),
        total: this.extractNumber(data, ['total_emissions', 'emissions_total']),
        intensity: this.extractNumber(data, ['emissions_intensity', 'emissions_per_million']),
      },
      
      reductionTargets: {
        energyReduction: {
          achieved: this.extractNumber(data, ['energy_reduction_achieved', 'energy_saved']),
          percentage: this.extractNumber(data, ['energy_reduction_percentage', 'energy_reduction_percent']),
          baseYear: this.extractNumber(data, ['reduction_base_year', 'base_year']),
          target: this.extractNumber(data, ['energy_reduction_target', 'energy_target']),
        },
        netZeroTarget: {
          year: this.extractNumber(data, ['net_zero_year', 'net_zero_target']),
          scope: this.extractString(data, ['net_zero_scope']),
        },
      },
      
      verification: {
        verified: this.extractBoolean(data, ['external_verification', 'verified']),
        verificationBody: this.extractString(data, ['verification_body', 'verifier', 'bureau_veritas']),
        standard: this.extractString(data, ['verification_standard', 'assurance_standard']),
      },
      
      supplyChain: {
        tier1Coverage: this.extractNumber(data, ['supplier_coverage', 'tier1_coverage']),
      },
      
      waste: {
        recyclingRate: this.extractNumber(data, ['recycling_rate', 'waste_recycled']),
      },
      
      renewableEnergy: {
        percentage: this.extractNumber(data, ['renewable_percentage', 'renewable_energy']),
      },
    };
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
        return val === 'true' || val === 'yes' || val === '1';
      }
    }
    return false;
  }
  
  private mergeExtractionResults(existing: Partial<SECRData>, newData: Partial<SECRData>): Partial<SECRData> {
    // Merge results from multiple chunks, preferring non-null values
    return {
      secrCompliant: newData.secrCompliant ?? existing.secrCompliant ?? false,
      secrStatementPage: newData.secrStatementPage || existing.secrStatementPage,
      
      energyConsumption: {
        ...existing.energyConsumption,
        ...newData.energyConsumption,
      },
      
      emissions: {
        ...existing.emissions,
        ...newData.emissions,
      },
      
      reductionTargets: {
        ...existing.reductionTargets,
        ...newData.reductionTargets,
      },
      
      verification: {
        ...existing.verification,
        ...newData.verification,
      },
      
      supplyChain: {
        ...existing.supplyChain,
        ...newData.supplyChain,
      },
      
      waste: {
        ...existing.waste,
        ...newData.waste,
      },
      
      renewableEnergy: {
        ...existing.renewableEnergy,
        ...newData.renewableEnergy,
      },
      
      governance: {
        ...existing.governance,
        ...newData.governance,
      },
    };
  }
  
  private calculateOverallConfidence(data: Partial<SECRData>): number {
    // Calculate confidence based on completeness of critical SECR data
    let score = 0;
    let maxScore = 0;
    
    // Critical fields for SECR compliance
    const criticalFields = [
      data.secrCompliant,
      data.energyConsumption?.total,
      data.emissions?.total,
      data.verification?.verified,
    ];
    
    criticalFields.forEach(field => {
      maxScore += 1;
      if (field !== undefined && field !== null) {
        score += 1;
      }
    });
    
    return maxScore > 0 ? score / maxScore : 0;
  }
}

// Helper function for integration with existing RFP Quest systems
export async function enhanceCompanyWithSECR(
  companyNumber: string,
  companyName: string,
  jigsawApiKey: string
): Promise<SECRData | null> {
  try {
    const extractor = new JigsawStackSECRExtractor(jigsawApiKey);
    
    // Get latest accounts document from Companies House
    const accountsUrl = await getLatestAccountsDocument(companyNumber);
    
    if (!accountsUrl) {
      console.log(`No accounts document found for ${companyName}`);
      return null;
    }
    
    const secrData = await extractor.extractSECRData({
      documentUrl: accountsUrl,
      companyName,
      extractionType: 'comprehensive',
      maxChunkSize: 1024 * 1024, // 1MB chunks as per your findings
    });
    
    console.log(`SECR extraction completed for ${companyName}:`, {
      compliant: secrData.secrCompliant,
      confidence: secrData.extractionMetadata.confidence,
      verified: secrData.verification?.verified,
    });
    
    return secrData;
  } catch (error) {
    console.error(`SECR extraction failed for ${companyName}:`, error);
    return null;
  }
}

// Get latest accounts document URL from Companies House
async function getLatestAccountsDocument(companyNumber: string): Promise<string | null> {
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
    console.error('Failed to get accounts document:', error);
    return null;
  }
}

// Export types for use in other parts of RFP Quest
export type { SECRData, SECRExtractionRequest };