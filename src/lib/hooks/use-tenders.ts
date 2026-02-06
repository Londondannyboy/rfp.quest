'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { Tender, TenderSearchParams, TenderSearchResponse } from '@/lib/api/types';

async function fetchTenders(params: TenderSearchParams): Promise<TenderSearchResponse> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.stages?.length) searchParams.set('stages', params.stages.join(','));
  if (params.updatedFrom) searchParams.set('updatedFrom', params.updatedFrom);
  if (params.updatedTo) searchParams.set('updatedTo', params.updatedTo);
  if (params.keyword) searchParams.set('keyword', params.keyword);
  if (params.buyerName) searchParams.set('buyerName', params.buyerName);
  if (params.cpvCode) searchParams.set('cpvCode', params.cpvCode);
  if (params.region) searchParams.set('region', params.region);
  if (params.minValue !== undefined) searchParams.set('minValue', String(params.minValue));
  if (params.maxValue !== undefined) searchParams.set('maxValue', String(params.maxValue));

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

export function useTenders(params: Omit<TenderSearchParams, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: ['tenders', params],
    queryFn: ({ pageParam }) => fetchTenders({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      tenders: data.pages.flatMap((page) => page.tenders),
    }),
  });
}

export function useTender(ocid: string | null) {
  return useQuery({
    queryKey: ['tender', ocid],
    queryFn: () => fetchTenderByOcid(ocid!),
    enabled: !!ocid,
  });
}

export function useTendersSimple(params: TenderSearchParams = {}) {
  return useQuery({
    queryKey: ['tenders-simple', params],
    queryFn: () => fetchTenders(params),
  });
}
