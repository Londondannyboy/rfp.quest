import { useState, useEffect } from 'react';
import { getFallbackImage } from '@/lib/unsplash';

interface TenderImageResult {
  url: string;
  attribution: string | null;
  blurHash: string | null;
  isLoading: boolean;
}

// Client-side cache
const imageCache = new Map<string, { url: string; attribution: string | null; blurHash: string | null }>();

/**
 * Hook to fetch and cache tender images.
 */
export function useTenderImage(
  ocid: string,
  title: string,
  cpvCodes: string[] | null | undefined,
  description: string | null = null,
  enabled: boolean = true
): TenderImageResult {
  const [result, setResult] = useState<TenderImageResult>({
    url: getFallbackImage(cpvCodes),
    attribution: null,
    blurHash: null,
    isLoading: enabled,
  });

  useEffect(() => {
    if (!enabled) {
      setResult({
        url: getFallbackImage(cpvCodes),
        attribution: null,
        blurHash: null,
        isLoading: false,
      });
      return;
    }

    // Check cache first
    if (imageCache.has(ocid)) {
      const cached = imageCache.get(ocid)!;
      setResult({
        ...cached,
        isLoading: false,
      });
      return;
    }

    // Fetch from API
    const fetchImage = async () => {
      try {
        const params = new URLSearchParams({
          ocid,
          title,
          ...(cpvCodes && cpvCodes.length > 0 && { cpv: cpvCodes.join(',') }),
          ...(description && { description }),
        });

        const response = await fetch(`/api/tender-image?${params}`);
        const data = await response.json();

        imageCache.set(ocid, {
          url: data.url,
          attribution: data.attribution,
          blurHash: data.blurHash,
        });

        setResult({
          url: data.url,
          attribution: data.attribution,
          blurHash: data.blurHash,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to fetch tender image:', error);
        setResult({
          url: getFallbackImage(cpvCodes),
          attribution: null,
          blurHash: null,
          isLoading: false,
        });
      }
    };

    fetchImage();
  }, [ocid, title, cpvCodes, description, enabled]);

  return result;
}
