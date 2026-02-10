'use client';

import { useQuery } from '@tanstack/react-query';

export interface Competitor {
  name: string;
  confidence: number;
  source?: string;
}

export interface Incumbent {
  name: string;
  contractPeriod?: string;
}

export interface CompetitorData {
  competitors: Competitor[];
  incumbent: Incumbent | null;
  enrichedAt: string;
  expiresAt: string;
}

interface UseCompetitorsParams {
  ocid: string;
  buyerName: string;
  sector?: string;
  enabled?: boolean;
}

async function fetchCompetitors({
  ocid,
  buyerName,
  sector,
}: UseCompetitorsParams): Promise<CompetitorData> {
  const params = new URLSearchParams({
    ocid,
    buyerName,
  });
  if (sector) {
    params.set('sector', sector);
  }

  const response = await fetch(`/api/competitors?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch competitor data');
  }

  return response.json();
}

/**
 * Hook to fetch competitor and incumbent data for a tender.
 * Uses React Query with 1 hour stale time.
 */
export function useCompetitors({
  ocid,
  buyerName,
  sector,
  enabled = true,
}: UseCompetitorsParams) {
  return useQuery({
    queryKey: ['competitors', ocid, buyerName, sector],
    queryFn: () => fetchCompetitors({ ocid, buyerName, sector }),
    enabled: enabled && !!ocid && !!buyerName,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1, // Only retry once
  });
}

/**
 * Batch fetch competitors for multiple tenders.
 * Returns a map of ocid -> CompetitorData.
 *
 * Note: Currently a stub. For MVP, tenders fetch competitors individually.
 * This will be implemented with a proper batch endpoint in the future.
 */
export function useCompetitorsBatch(
  _tenders: Array<{ ocid: string; buyerName: string; sector?: string }>,
  _enabled = true
) {
  const results = new Map<string, CompetitorData>();

  return {
    data: results,
    isLoading: false,
    isError: false,
  };
}
