/**
 * Unsplash API integration for fetching unique, contextual images.
 */

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'c_y_xJaw-p05vjKOKC5kdiZGw21trx9DbRYjWx-9AVY';

// Sector keywords for contextual image searches
const sectorKeywords: Record<string, string[]> = {
  '45': ['construction site', 'building construction', 'architecture project'],
  '48': ['software development', 'coding', 'technology office'],
  '50': ['maintenance worker', 'repair service', 'facility management'],
  '55': ['hotel lobby', 'restaurant interior', 'hospitality service'],
  '60': ['logistics warehouse', 'transport truck', 'delivery service'],
  '64': ['network infrastructure', 'telecommunications tower', 'fiber optic'],
  '65': ['power plant', 'utilities infrastructure', 'energy grid'],
  '66': ['financial services', 'banking office', 'investment'],
  '70': ['commercial real estate', 'office building', 'property'],
  '71': ['engineering design', 'architecture blueprint', 'civil engineering'],
  '72': ['IT infrastructure', 'data center', 'cloud computing'],
  '73': ['research laboratory', 'science innovation', 'R&D facility'],
  '75': ['government building', 'public administration', 'civic center'],
  '77': ['agriculture farm', 'sustainable farming', 'rural landscape'],
  '79': ['business meeting', 'consulting office', 'professional services'],
  '80': ['education classroom', 'university campus', 'learning environment'],
  '85': ['healthcare hospital', 'medical facility', 'health services'],
  '90': ['environmental sustainability', 'recycling facility', 'green energy'],
  '92': ['cultural arts', 'museum gallery', 'performance venue'],
  '98': ['community center', 'social services', 'public space'],
};

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  blur_hash: string | null;
}

interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// In-memory cache for images (in production, use Redis or similar)
const imageCache = new Map<string, { url: string; attribution: string; blurHash: string | null }>();

/**
 * Generate a cache key from tender data.
 */
function getCacheKey(ocid: string): string {
  return `unsplash_${ocid}`;
}

/**
 * Get sector keywords for a CPV code.
 */
function getSectorSearchTerms(cpvCodes: string[] | null | undefined): string[] {
  if (!cpvCodes || cpvCodes.length === 0) {
    return ['business office', 'professional workplace'];
  }

  const division = cpvCodes[0].substring(0, 2);
  return sectorKeywords[division] || ['business office', 'professional workplace'];
}

/**
 * Extract relevant keywords from tender title/description.
 */
function extractKeywords(title: string, description: string | null): string[] {
  const text = `${title} ${description || ''}`.toLowerCase();
  const keywords: string[] = [];

  // Common tender-related keywords to look for
  const patterns = [
    /\b(construction|building|renovation|refurbishment)\b/gi,
    /\b(software|IT|technology|digital|cloud)\b/gi,
    /\b(healthcare|medical|hospital|NHS)\b/gi,
    /\b(education|school|university|training)\b/gi,
    /\b(transport|logistics|fleet|vehicle)\b/gi,
    /\b(energy|utilities|power|electricity)\b/gi,
    /\b(environment|waste|recycling|sustainability)\b/gi,
    /\b(security|CCTV|safety|protection)\b/gi,
    /\b(catering|food|kitchen|meals)\b/gi,
    /\b(cleaning|facilities|maintenance)\b/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      keywords.push(...matches.map(m => m.toLowerCase()));
    }
  }

  return [...new Set(keywords)].slice(0, 3);
}

/**
 * Fetch a unique image from Unsplash based on tender context.
 */
export async function fetchTenderImage(
  ocid: string,
  title: string,
  cpvCodes: string[] | null | undefined,
  description: string | null = null
): Promise<{ url: string; attribution: string; blurHash: string | null } | null> {
  // Check cache first
  const cacheKey = getCacheKey(ocid);
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    // Build search query from tender context
    const sectorTerms = getSectorSearchTerms(cpvCodes);
    const contextKeywords = extractKeywords(title, description);

    // Combine for a contextual search - use OCID hash to get consistent but unique results
    const ocidHash = ocid.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const searchIndex = Math.abs(ocidHash) % sectorTerms.length;
    const primaryTerm = sectorTerms[searchIndex];

    // Add context keyword if available
    const query = contextKeywords.length > 0
      ? `${primaryTerm} ${contextKeywords[0]}`
      : primaryTerm;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return null;
    }

    const data: UnsplashSearchResult = await response.json();

    if (data.results.length === 0) {
      return null;
    }

    // Use OCID hash to pick a consistent photo from results
    const photoIndex = Math.abs(ocidHash) % data.results.length;
    const photo = data.results[photoIndex];

    const result = {
      url: `${photo.urls.regular}&w=600&h=300&fit=crop&q=80`,
      attribution: `Photo by ${photo.user.name} on Unsplash`,
      blurHash: photo.blur_hash,
    };

    // Cache the result
    imageCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Failed to fetch Unsplash image:', error);
    return null;
  }
}

/**
 * Get a fallback image URL based on sector.
 */
export function getFallbackImage(cpvCodes: string[] | null | undefined): string {
  const sectorImages: Record<string, string> = {
    '45': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=300&fit=crop&q=80',
    '48': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop&q=80',
    '72': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&q=80',
    '85': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=300&fit=crop&q=80',
    '80': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=300&fit=crop&q=80',
    '71': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=300&fit=crop&q=80',
  };

  if (!cpvCodes || cpvCodes.length === 0) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop&q=80';
  }

  const division = cpvCodes[0].substring(0, 2);
  return sectorImages[division] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop&q=80';
}
