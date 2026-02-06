'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenders, type Tender, type TenderSearchParams } from '@/lib/hooks/use-tenders';
import { TenderTable } from '@/components/dashboard/TenderTable';

export default function DashboardPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TenderSearchParams>({
    limit: 50,
  });
  const [keyword, setKeyword] = useState('');

  const {
    data,
    isLoading,
    refetch,
  } = useTenders(filters);

  const tenders = data?.tenders ?? [];
  const totalCount = data?.totalCount ?? 0;

  const handleSearch = () => {
    setFilters({ ...filters, keyword: keyword || undefined });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              UK Government Tenders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse and search {totalCount.toLocaleString()} opportunities from Find a Tender
            </p>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 max-w-md flex gap-2">
            <input
              type="text"
              placeholder="Search tenders..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.stage || ''}
              onChange={(e) => setFilters({ ...filters, stage: e.target.value || undefined })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All stages</option>
              <option value="tender">Active tenders</option>
              <option value="planning">Planning</option>
              <option value="award">Awarded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0">
        <TenderTable
          data={tenders}
          isLoading={isLoading}
          onRowClick={(tender: Tender) => router.push(`/tender/${tender.slug}`)}
          onRefresh={() => refetch()}
          hasNextPage={data?.hasMore}
          onLoadMore={() => {
            setFilters({
              ...filters,
              offset: (filters.offset || 0) + (filters.limit || 50),
            });
          }}
        />
      </div>
    </div>
  );
}
