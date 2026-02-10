/**
 * Sector-to-Unsplash image mapping for tender cards.
 * Uses Unsplash Source for reliable, high-quality images.
 */

// Map CPV division codes to Unsplash photo IDs for consistent, beautiful images
const sectorImages: Record<string, { id: string; query: string }> = {
  '45': { id: 'photo-1504307651254-35680f356dfd', query: 'construction' }, // Construction
  '48': { id: 'photo-1555066931-4365d14bab8c', query: 'software code' }, // Software
  '50': { id: 'photo-1581092160562-40aa08e78837', query: 'maintenance repair' }, // Maintenance
  '55': { id: 'photo-1566073771259-6a8506099945', query: 'hotel hospitality' }, // Hospitality
  '60': { id: 'photo-1494412574643-ff11b0a5c1c3', query: 'transport logistics' }, // Transport
  '64': { id: 'photo-1558494949-ef010cbdcc31', query: 'telecommunications network' }, // Telecoms
  '65': { id: 'photo-1473341304170-971dccb5ac1e', query: 'utilities energy' }, // Utilities
  '66': { id: 'photo-1554224155-6726b3ff858f', query: 'finance banking' }, // Finance
  '70': { id: 'photo-1486406146926-c627a92ad1ab', query: 'real estate building' }, // Real Estate
  '71': { id: 'photo-1503387762-592deb58ef4e', query: 'architecture engineering' }, // Engineering
  '72': { id: 'photo-1551288049-bebda4e38f71', query: 'IT technology' }, // IT Services
  '73': { id: 'photo-1532094349884-543bc11b234d', query: 'research laboratory' }, // R&D
  '75': { id: 'photo-1555848962-6e79363ec58f', query: 'government administration' }, // Government
  '77': { id: 'photo-1500382017468-9049fed747ef', query: 'agriculture farming' }, // Agriculture
  '79': { id: 'photo-1553877522-43269d4ea984', query: 'business consulting' }, // Business Services
  '80': { id: 'photo-1523050854058-8df90110c9f1', query: 'education learning' }, // Education
  '85': { id: 'photo-1519494026892-80bbd2d6fd0d', query: 'healthcare medical' }, // Healthcare
  '90': { id: 'photo-1532996122724-e3c354a0b15b', query: 'environment recycling' }, // Environment
  '92': { id: 'photo-1507003211169-0a1dd7228f2d', query: 'culture arts' }, // Culture
  '98': { id: 'photo-1517245386807-bb43f82c33c4', query: 'community services' }, // Other Services
};

// Default image for unknown sectors
const defaultImage = { id: 'photo-1454165804606-c3d57bc86b40', query: 'business office' };

/**
 * Get an Unsplash image URL for a given CPV sector.
 * @param cpvCodes - Array of CPV codes
 * @param width - Image width (default 400)
 * @param height - Image height (default 200)
 * @returns Unsplash image URL
 */
export function getSectorImage(
  cpvCodes: string[] | null | undefined,
  width: number = 400,
  height: number = 200
): string {
  if (!cpvCodes || cpvCodes.length === 0) {
    return `https://images.unsplash.com/${defaultImage.id}?w=${width}&h=${height}&fit=crop&q=80`;
  }

  // Get the division (first 2 digits) of the primary CPV code
  const division = cpvCodes[0].substring(0, 2);
  const imageConfig = sectorImages[division] || defaultImage;

  return `https://images.unsplash.com/${imageConfig.id}?w=${width}&h=${height}&fit=crop&q=80`;
}

/**
 * Get sector image with blur placeholder data URL.
 * For use with Next.js Image blur placeholder.
 */
export function getSectorImageWithPlaceholder(
  cpvCodes: string[] | null | undefined,
  width: number = 400,
  height: number = 200
): { src: string; blurDataURL: string } {
  const src = getSectorImage(cpvCodes, width, height);

  // Tiny placeholder (10x5 pixels, heavily compressed)
  const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAFAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAUABhEHEiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEEAAAgAlI7FoooAu//Z';

  return { src, blurDataURL };
}

/**
 * Get the query term for a sector (useful for dynamic fetching).
 */
export function getSectorQuery(cpvCodes: string[] | null | undefined): string {
  if (!cpvCodes || cpvCodes.length === 0) {
    return defaultImage.query;
  }

  const division = cpvCodes[0].substring(0, 2);
  return (sectorImages[division] || defaultImage).query;
}
