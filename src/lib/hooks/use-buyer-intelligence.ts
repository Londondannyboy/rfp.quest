'use client';

import { useQuery } from '@tanstack/react-query';

export interface BuyerIntelligence {
  companyNumber: string;
  companyName: string;
  profile: {
    companyStatus: string;
    companyType: string;
    dateOfCreation: string;
    sicCodes: string[];
    hasCharges: boolean;
    hasInsolvencyHistory: boolean;
  };
  decisionMakers: Array<{
    name: string;
    role: string;
    appointedOn: string | null;
    nationality: string | null;
  }>;
  sustainability: {
    hasSecrContent: boolean | null;
    extractionMethod?: string;
    secrData?: {
      ukEnergyKwh: number | null;
      scope1Tonnes: number | null;
      scope2Tonnes: number | null;
      scope3Tonnes: number | null;
      netZeroYear: number | null;
      methodology: string | null;
    };
    keyFindings?: string[];
  } | null;
  signals: {
    growthSignals: Array<{
      signal: string;
      message: string;
      implication: string;
    }>;
    riskSignals: Array<{
      signal: string;
      severity: string;
      message: string;
      implication: string;
    }>;
    overallSentiment: string;
  };
  bidInsights: {
    emphasize: string[];
    consider: string[];
    avoid: string[];
  };
  recentNews?: Array<{
    title: string;
    url: string;
    snippet: string;
    source: string;
  }>;
  enrichedAt: string;
  expiresAt: string;
}

async function fetchBuyerIntelligence(buyerName: string): Promise<BuyerIntelligence | null> {
  const response = await fetch(`/api/buyer-intel?buyerName=${encodeURIComponent(buyerName)}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch buyer intelligence');
  }

  const data = await response.json();
  if (data.error) {
    return null;
  }

  return data;
}

export function useBuyerIntelligence(buyerName: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['buyer-intelligence', buyerName],
    queryFn: () => fetchBuyerIntelligence(buyerName!),
    enabled: !!buyerName && (options?.enabled !== false),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Helper to get sentiment color
export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case 'positive':
      return 'text-green-400 bg-green-900/20';
    case 'cautious':
      return 'text-amber-400 bg-amber-900/20';
    case 'negative':
      return 'text-red-400 bg-red-900/20';
    default:
      return 'text-slate-300 bg-slate-800/50';
  }
}

// Helper to format decision maker role
export function formatRole(role: string): string {
  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
