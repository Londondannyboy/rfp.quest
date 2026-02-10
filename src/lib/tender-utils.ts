/**
 * Utility functions for tender analysis and value estimation
 */

// Average contract values by CPV division (based on UK government data patterns)
const CPV_VALUE_ESTIMATES: Record<string, { min: number; max: number; avg: number; label: string }> = {
  '45': { min: 500000, max: 50000000, avg: 5000000, label: 'Construction' },
  '71': { min: 100000, max: 5000000, avg: 500000, label: 'Architecture/Engineering' },
  '72': { min: 50000, max: 10000000, avg: 1000000, label: 'IT Services' },
  '79': { min: 50000, max: 5000000, avg: 500000, label: 'Business Services' },
  '50': { min: 100000, max: 10000000, avg: 1000000, label: 'Repair/Maintenance' },
  '33': { min: 100000, max: 20000000, avg: 2000000, label: 'Medical Equipment' },
  '34': { min: 200000, max: 50000000, avg: 5000000, label: 'Transport Equipment' },
  '48': { min: 50000, max: 5000000, avg: 500000, label: 'Software' },
  '30': { min: 20000, max: 2000000, avg: 200000, label: 'Office Equipment' },
  '22': { min: 10000, max: 500000, avg: 100000, label: 'Printing' },
  '60': { min: 100000, max: 20000000, avg: 2000000, label: 'Transport Services' },
  '64': { min: 100000, max: 10000000, avg: 1000000, label: 'Telecommunications' },
  '73': { min: 100000, max: 5000000, avg: 500000, label: 'R&D Services' },
  '80': { min: 50000, max: 5000000, avg: 500000, label: 'Education' },
  '85': { min: 200000, max: 50000000, avg: 5000000, label: 'Health Services' },
  '90': { min: 100000, max: 20000000, avg: 2000000, label: 'Environmental' },
  '77': { min: 50000, max: 5000000, avg: 500000, label: 'Forestry/Agriculture' },
  '55': { min: 50000, max: 5000000, avg: 500000, label: 'Hotel/Restaurant' },
  '63': { min: 50000, max: 2000000, avg: 300000, label: 'Support Transport' },
  '66': { min: 100000, max: 10000000, avg: 1000000, label: 'Financial Services' },
};

// Default estimate for unknown CPV codes
const DEFAULT_ESTIMATE = { min: 100000, max: 5000000, avg: 500000, label: 'General' };

/**
 * Estimate contract value based on CPV codes and other tender data
 */
export function estimateContractValue(
  cpvCodes: string[] | null,
  buyerName?: string,
  title?: string
): { estimated: number; range: { min: number; max: number }; confidence: 'low' | 'medium' | 'high' } {
  // If no CPV codes, use default estimate
  if (!cpvCodes || cpvCodes.length === 0) {
    return {
      estimated: DEFAULT_ESTIMATE.avg,
      range: { min: DEFAULT_ESTIMATE.min, max: DEFAULT_ESTIMATE.max },
      confidence: 'low',
    };
  }

  // Get the primary CPV division
  const primaryDivision = cpvCodes[0].substring(0, 2);
  const estimate = CPV_VALUE_ESTIMATES[primaryDivision] || DEFAULT_ESTIMATE;

  // Adjust based on keywords in title
  let multiplier = 1;
  const titleLower = (title || '').toLowerCase();

  // Framework agreements tend to be larger
  if (titleLower.includes('framework')) multiplier *= 2;

  // National vs regional
  if (titleLower.includes('national') || titleLower.includes('uk-wide')) multiplier *= 1.5;

  // Multi-year contracts
  if (titleLower.includes('multi-year') || titleLower.includes('4 year') || titleLower.includes('5 year')) {
    multiplier *= 1.5;
  }

  // Large/major keywords
  if (titleLower.includes('major') || titleLower.includes('large-scale')) multiplier *= 1.5;

  // Buyer patterns (NHS, councils, central gov tend to have different scales)
  const buyerLower = (buyerName || '').toLowerCase();
  if (buyerLower.includes('nhs') || buyerLower.includes('health')) multiplier *= 1.3;
  if (buyerLower.includes('ministry') || buyerLower.includes('home office')) multiplier *= 2;
  if (buyerLower.includes('council') || buyerLower.includes('borough')) multiplier *= 0.8;

  const estimated = Math.round(estimate.avg * multiplier);

  return {
    estimated,
    range: {
      min: Math.round(estimate.min * multiplier),
      max: Math.round(estimate.max * multiplier),
    },
    confidence: multiplier !== 1 ? 'medium' : 'low',
  };
}

/**
 * Get sector label from CPV code
 */
export function getSectorFromCPV(cpvCode: string): string {
  const division = cpvCode.substring(0, 2);
  return CPV_VALUE_ESTIMATES[division]?.label || 'General';
}

/**
 * Calculate match score breakdown based on company profile
 */
export interface ProfileMatch {
  overall: number;
  sectorMatch: number;
  regionMatch: number;
  valueMatch: number;
  sustainabilityMatch: number;
  matchingCpvs: string[];
  matchingRegions: string[];
  insights: Array<{ type: 'positive' | 'warning' | 'info' | 'opportunity'; text: string }>;
}

export function calculateProfileMatch(
  tender: {
    cpvCodes: string[] | null;
    region: string | null;
    valueMax: number | null;
    valueMin: number | null;
    isSustainability?: boolean;
    title?: string;
    description?: string | null;
  },
  profile: {
    targetCpvDivisions: string[];
    targetRegions: string[];
    minContractValue: number | null;
    maxContractValue: number | null;
    sustainabilityFocus: boolean;
    expertiseAreas: string[];
    certifications: string[];
  } | null
): ProfileMatch {
  if (!profile) {
    return {
      overall: 0,
      sectorMatch: 0,
      regionMatch: 0,
      valueMatch: 0,
      sustainabilityMatch: 0,
      matchingCpvs: [],
      matchingRegions: [],
      insights: [{ type: 'info', text: 'Complete your profile for personalized matching' }],
    };
  }

  const insights: ProfileMatch['insights'] = [];
  let totalScore = 0;
  let maxScore = 0;

  // Sector match (40% weight)
  let sectorMatch = 0;
  const matchingCpvs: string[] = [];
  if (tender.cpvCodes && tender.cpvCodes.length > 0 && profile.targetCpvDivisions.length > 0) {
    tender.cpvCodes.forEach(code => {
      const division = code.substring(0, 2);
      if (profile.targetCpvDivisions.includes(division)) {
        matchingCpvs.push(division);
      }
    });
    sectorMatch = matchingCpvs.length > 0 ? 100 : 0;
    if (sectorMatch === 100) {
      insights.push({ type: 'positive', text: `Matches your ${getSectorFromCPV(matchingCpvs[0])} expertise` });
    }
  }
  totalScore += sectorMatch * 0.4;
  maxScore += 40;

  // Region match (25% weight)
  let regionMatch = 0;
  const matchingRegions: string[] = [];
  if (tender.region && profile.targetRegions.length > 0) {
    const tenderRegionLower = tender.region.toLowerCase();
    profile.targetRegions.forEach(r => {
      if (tenderRegionLower.includes(r.toLowerCase()) || r.toLowerCase().includes(tenderRegionLower)) {
        matchingRegions.push(r);
      }
    });
    regionMatch = matchingRegions.length > 0 ? 100 : 0;
    if (regionMatch === 100) {
      insights.push({ type: 'positive', text: `In your target region: ${tender.region}` });
    }
  }
  totalScore += regionMatch * 0.25;
  maxScore += 25;

  // Value match (20% weight)
  let valueMatch = 50; // Default if no value specified
  const tenderValue = tender.valueMax || tender.valueMin;
  if (tenderValue) {
    const minOk = !profile.minContractValue || tenderValue >= profile.minContractValue;
    const maxOk = !profile.maxContractValue || tenderValue <= profile.maxContractValue;
    if (minOk && maxOk) {
      valueMatch = 100;
      insights.push({ type: 'positive', text: 'Value within your target range' });
    } else if (tenderValue > (profile.maxContractValue || Infinity)) {
      valueMatch = 30;
      insights.push({ type: 'warning', text: 'Above your typical contract size' });
    } else if (tenderValue < (profile.minContractValue || 0)) {
      valueMatch = 50;
      insights.push({ type: 'info', text: 'Below your minimum target value' });
    }
  }
  totalScore += valueMatch * 0.2;
  maxScore += 20;

  // Sustainability match (15% weight)
  let sustainabilityMatch = 50;
  if (profile.sustainabilityFocus) {
    sustainabilityMatch = tender.isSustainability ? 100 : 30;
    if (tender.isSustainability) {
      insights.push({ type: 'positive', text: 'Aligns with your sustainability focus' });
    }
  } else {
    sustainabilityMatch = 50; // Neutral if not focused on sustainability
  }
  totalScore += sustainabilityMatch * 0.15;
  maxScore += 15;

  // Calculate overall percentage
  const overall = Math.round((totalScore / maxScore) * 100);

  // Add opportunity insights based on score
  if (overall >= 75) {
    insights.unshift({ type: 'opportunity', text: 'Strong match - prioritize this bid!' });
  } else if (overall >= 50 && overall < 75) {
    insights.unshift({ type: 'info', text: 'Good potential - review requirements' });
  }

  return {
    overall,
    sectorMatch,
    regionMatch,
    valueMatch,
    sustainabilityMatch,
    matchingCpvs,
    matchingRegions,
    insights,
  };
}

/**
 * Format value display with estimation indicator
 */
export function formatValueDisplay(
  valueMax: number | null,
  valueMin: number | null,
  cpvCodes: string[] | null,
  showEstimate: boolean = true
): { display: string; isEstimate: boolean; confidence?: 'low' | 'medium' | 'high' } {
  if (valueMax) {
    if (valueMax >= 1_000_000) {
      return { display: `£${(valueMax / 1_000_000).toFixed(1)}M`, isEstimate: false };
    }
    if (valueMax >= 1_000) {
      return { display: `£${Math.round(valueMax / 1_000)}k`, isEstimate: false };
    }
    return { display: `£${valueMax.toLocaleString()}`, isEstimate: false };
  }

  if (valueMin) {
    if (valueMin >= 1_000_000) {
      return { display: `£${(valueMin / 1_000_000).toFixed(1)}M+`, isEstimate: false };
    }
    if (valueMin >= 1_000) {
      return { display: `£${Math.round(valueMin / 1_000)}k+`, isEstimate: false };
    }
    return { display: `£${valueMin.toLocaleString()}+`, isEstimate: false };
  }

  // No value - show estimate if requested
  if (showEstimate && cpvCodes && cpvCodes.length > 0) {
    const estimate = estimateContractValue(cpvCodes);
    if (estimate.estimated >= 1_000_000) {
      return {
        display: `~£${(estimate.estimated / 1_000_000).toFixed(1)}M`,
        isEstimate: true,
        confidence: estimate.confidence,
      };
    }
    if (estimate.estimated >= 1_000) {
      return {
        display: `~£${Math.round(estimate.estimated / 1_000)}k`,
        isEstimate: true,
        confidence: estimate.confidence,
      };
    }
    return {
      display: `~£${estimate.estimated.toLocaleString()}`,
      isEstimate: true,
      confidence: estimate.confidence,
    };
  }

  return { display: 'TBC', isEstimate: false };
}
