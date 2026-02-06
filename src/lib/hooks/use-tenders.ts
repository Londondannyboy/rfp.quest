'use client';

import { useQuery } from '@tanstack/react-query';

export interface Tender {
  id: string;
  ocid: string;
  title: string;
  description: string | null;
  status: string | null;
  stage: string;
  buyerName: string;
  buyerId: string | null;
  valueAmount: number | null;
  valueCurrency: string;
  valueMin: number | null;
  valueMax: number | null;
  publishedDate: string;
  tenderStartDate: string | null;
  tenderEndDate: string | null;
  cpvCodes: string[];
  region: string | null;
  syncedAt: string;
}

export interface TenderSearchParams {
  limit?: number;
  offset?: number;
  keyword?: string;
  buyerName?: string;
  stage?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TenderSearchResponse {
  tenders: Tender[];
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

async function fetchTenders(params: TenderSearchParams): Promise<TenderSearchResponse> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));
  if (params.keyword) searchParams.set('keyword', params.keyword);
  if (params.buyerName) searchParams.set('buyerName', params.buyerName);
  if (params.stage) searchParams.set('stage', params.stage);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const response = await fetch(`/api/tenders/search?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tenders');
  }

  return response.json();
}

async function fetchTenderByOcid(ocid: string): Promise<Tender> {
  const response = await fetch(`/api/tenders/${encodeURIComponent(ocid)}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch tender');
  }

  return response.json();
}

export function useTenders(params: TenderSearchParams = {}) {
  return useQuery({
    queryKey: ['tenders', params],
    queryFn: () => fetchTenders(params),
  });
}

export function useTender(ocid: string | null) {
  return useQuery({
    queryKey: ['tender', ocid],
    queryFn: () => fetchTenderByOcid(ocid!),
    enabled: !!ocid,
  });
}
