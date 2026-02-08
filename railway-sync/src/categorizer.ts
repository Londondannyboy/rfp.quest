/**
 * Tender Categorization Service
 *
 * Categorizes tenders into main category, lead category, and tags
 * using CPV code mapping and keyword matching.
 */

export interface TenderCategory {
  mainCategory: string;
  leadCategory: string;
  tags: string[];
  confidence: number;
}

// Main categories with their CPV prefix mappings and keywords
const CATEGORY_DEFINITIONS: Record<string, {
  cpvPrefixes: string[];
  keywords: string[];
  leadCategories: Record<string, string[]>;
}> = {
  'Technology & IT': {
    cpvPrefixes: ['48', '72'],
    keywords: ['software', 'digital', 'cloud', 'IT', 'cyber', 'data', 'computing', 'systems', 'network', 'database', 'website', 'app', 'platform'],
    leadCategories: {
      'Cloud Services': ['cloud', 'aws', 'azure', 'saas', 'iaas', 'paas'],
      'Cybersecurity': ['cyber', 'security', 'penetration', 'vulnerability', 'firewall'],
      'Software Development': ['software', 'development', 'application', 'programming', 'agile'],
      'Data & Analytics': ['data', 'analytics', 'business intelligence', 'reporting', 'dashboard'],
      'IT Support': ['support', 'helpdesk', 'maintenance', 'managed service'],
      'Infrastructure': ['infrastructure', 'network', 'server', 'hardware'],
    },
  },
  'Construction': {
    cpvPrefixes: ['45'],
    keywords: ['construction', 'building', 'civil', 'engineering', 'refurbishment', 'renovation', 'repair', 'maintenance', 'infrastructure'],
    leadCategories: {
      'Building Construction': ['building', 'construction', 'new build'],
      'Civil Engineering': ['civil', 'roads', 'bridges', 'highways'],
      'Refurbishment': ['refurbishment', 'renovation', 'restoration'],
      'Mechanical & Electrical': ['mechanical', 'electrical', 'm&e', 'hvac'],
      'Demolition': ['demolition', 'deconstruction'],
    },
  },
  'Healthcare': {
    cpvPrefixes: ['33', '85'],
    keywords: ['health', 'medical', 'clinical', 'NHS', 'hospital', 'patient', 'care', 'pharmaceutical', 'diagnostic'],
    leadCategories: {
      'Medical Equipment': ['equipment', 'devices', 'diagnostic', 'imaging'],
      'Pharmaceuticals': ['pharmaceutical', 'drugs', 'medicine', 'prescription'],
      'Clinical Services': ['clinical', 'patient', 'treatment', 'therapy'],
      'Care Services': ['care', 'nursing', 'social care', 'domiciliary'],
    },
  },
  'Professional Services': {
    cpvPrefixes: ['79'],
    keywords: ['consulting', 'consultancy', 'advisory', 'legal', 'audit', 'accounting', 'recruitment', 'HR', 'management'],
    leadCategories: {
      'Management Consulting': ['management', 'consulting', 'strategy', 'advisory'],
      'Legal Services': ['legal', 'solicitor', 'law', 'litigation'],
      'Audit & Accounting': ['audit', 'accounting', 'financial', 'tax'],
      'Recruitment': ['recruitment', 'staffing', 'HR', 'talent'],
      'Marketing & Communications': ['marketing', 'communications', 'PR', 'branding'],
    },
  },
  'Facilities & Support': {
    cpvPrefixes: ['50', '90'],
    keywords: ['cleaning', 'maintenance', 'security', 'catering', 'facilities', 'waste', 'grounds', 'janitorial'],
    leadCategories: {
      'Cleaning Services': ['cleaning', 'janitorial', 'hygiene'],
      'Security Services': ['security', 'guarding', 'CCTV', 'access control'],
      'Catering': ['catering', 'food', 'hospitality'],
      'Waste Management': ['waste', 'recycling', 'refuse', 'disposal'],
      'Grounds Maintenance': ['grounds', 'landscaping', 'garden'],
    },
  },
  'Transport & Logistics': {
    cpvPrefixes: ['60', '63', '64'],
    keywords: ['transport', 'logistics', 'fleet', 'delivery', 'freight', 'courier', 'vehicle', 'bus', 'rail'],
    leadCategories: {
      'Passenger Transport': ['passenger', 'bus', 'coach', 'taxi'],
      'Freight & Delivery': ['freight', 'delivery', 'courier', 'haulage'],
      'Fleet Management': ['fleet', 'vehicle', 'car hire', 'leasing'],
      'Rail Services': ['rail', 'train', 'railway'],
    },
  },
  'Energy & Utilities': {
    cpvPrefixes: ['09', '65'],
    keywords: ['energy', 'electricity', 'gas', 'water', 'utilities', 'renewable', 'solar', 'power'],
    leadCategories: {
      'Electricity Supply': ['electricity', 'power', 'grid'],
      'Gas Supply': ['gas', 'heating'],
      'Water Services': ['water', 'sewage', 'drainage'],
      'Renewable Energy': ['renewable', 'solar', 'wind', 'green energy'],
    },
  },
  'Education & Training': {
    cpvPrefixes: ['80'],
    keywords: ['education', 'training', 'learning', 'course', 'school', 'university', 'apprentice', 'qualification'],
    leadCategories: {
      'Professional Training': ['training', 'professional development', 'CPD'],
      'Educational Services': ['education', 'school', 'teaching'],
      'E-Learning': ['e-learning', 'online learning', 'digital learning'],
      'Apprenticeships': ['apprentice', 'vocational', 'skills'],
    },
  },
  'Financial Services': {
    cpvPrefixes: ['66'],
    keywords: ['insurance', 'banking', 'finance', 'pension', 'investment', 'loan', 'treasury'],
    leadCategories: {
      'Insurance': ['insurance', 'liability', 'indemnity'],
      'Banking': ['banking', 'payment', 'card'],
      'Pensions': ['pension', 'retirement'],
      'Investment': ['investment', 'treasury', 'fund'],
    },
  },
  'Environment & Sustainability': {
    cpvPrefixes: ['77'],
    keywords: ['environmental', 'sustainability', 'carbon', 'climate', 'ecology', 'biodiversity', 'conservation', 'green'],
    leadCategories: {
      'Environmental Consulting': ['environmental', 'assessment', 'impact'],
      'Carbon & Climate': ['carbon', 'climate', 'net zero', 'emissions'],
      'Conservation': ['conservation', 'biodiversity', 'ecology'],
      'Sustainability Services': ['sustainability', 'ESG', 'green'],
    },
  },
  'Defence & Security': {
    cpvPrefixes: ['35'],
    keywords: ['defence', 'military', 'armed forces', 'MOD', 'security', 'police'],
    leadCategories: {
      'Defence Equipment': ['defence', 'military', 'equipment'],
      'Security Systems': ['security', 'surveillance', 'protection'],
      'Police Services': ['police', 'law enforcement'],
    },
  },
  'Childcare & Social Services': {
    cpvPrefixes: ['85'],
    keywords: ['childcare', 'children', 'social', 'foster', 'adoption', 'safeguarding', 'youth', 'family'],
    leadCategories: {
      'Childcare Services': ['childcare', 'nursery', 'early years'],
      'Social Care': ['social care', 'vulnerable', 'support'],
      'Foster & Adoption': ['foster', 'adoption', 'looked after'],
      'Youth Services': ['youth', 'young people', 'family'],
    },
  },
};

// Fallback category
const OTHER_CATEGORY: TenderCategory = {
  mainCategory: 'Other',
  leadCategory: 'General Services',
  tags: [],
  confidence: 0.3,
};

/**
 * Extract tags from text based on common tender terms
 */
function extractTags(text: string): string[] {
  const tagPatterns = [
    // Contract types
    /\b(framework|call-off|dynamic purchasing|lot|single supplier)\b/gi,
    // Delivery models
    /\b(agile|waterfall|prince2|scrum)\b/gi,
    // Compliance
    /\b(GDPR|ISO \d+|cyber essentials|g-cloud|dos)\b/gi,
    // Location types
    /\b(remote|on-site|hybrid)\b/gi,
    // Scale indicators
    /\b(national|regional|local|pan-government)\b/gi,
  ];

  const tags: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  for (const pattern of tagPatterns) {
    const matches = lowerText.match(pattern);
    if (matches) {
      matches.forEach(match => tags.add(match.toLowerCase()));
    }
  }

  return Array.from(tags).slice(0, 10); // Limit to 10 tags
}

/**
 * Match lead category based on keywords
 */
function matchLeadCategory(
  text: string,
  leadCategories: Record<string, string[]>
): { name: string; confidence: number } {
  const lowerText = text.toLowerCase();
  let bestMatch = { name: 'General', confidence: 0 };

  for (const [category, keywords] of Object.entries(leadCategories)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    const confidence = matchCount / keywords.length;
    if (confidence > bestMatch.confidence) {
      bestMatch = { name: category, confidence };
    }
  }

  return bestMatch;
}

/**
 * Categorize a tender based on CPV codes, title, description, and buyer
 */
export function categorizeTender(
  title: string,
  description: string | null,
  cpvCodes: string[],
  buyerName: string
): TenderCategory {
  const fullText = `${title} ${description || ''} ${buyerName}`.toLowerCase();

  // Try CPV code matching first (highest confidence)
  for (const [category, definition] of Object.entries(CATEGORY_DEFINITIONS)) {
    for (const prefix of definition.cpvPrefixes) {
      if (cpvCodes.some(code => code.startsWith(prefix))) {
        const leadMatch = matchLeadCategory(fullText, definition.leadCategories);
        return {
          mainCategory: category,
          leadCategory: leadMatch.name,
          tags: extractTags(fullText),
          confidence: 0.9 + (leadMatch.confidence * 0.1), // 0.9-1.0 for CPV match
        };
      }
    }
  }

  // Try keyword matching (medium confidence)
  let bestMatch: { category: string; score: number } = { category: '', score: 0 };

  for (const [category, definition] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;
    for (const keyword of definition.keywords) {
      if (fullText.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }

  if (bestMatch.score >= 2) {
    const definition = CATEGORY_DEFINITIONS[bestMatch.category];
    const leadMatch = matchLeadCategory(fullText, definition.leadCategories);
    const confidence = Math.min(0.5 + (bestMatch.score * 0.1), 0.85); // 0.5-0.85 for keyword match

    return {
      mainCategory: bestMatch.category,
      leadCategory: leadMatch.name,
      tags: extractTags(fullText),
      confidence,
    };
  }

  // Fallback to Other
  return {
    ...OTHER_CATEGORY,
    tags: extractTags(fullText),
  };
}
