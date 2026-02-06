'use client';

import { useState } from 'react';
import { useTenders } from '@/lib/hooks/use-tenders';
import { TenderTable } from '@/components/dashboard/TenderTable';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { TenderDetail } from '@/components/dashboard/TenderDetail';
import type { Tender, TenderSearchParams } from '@/lib/api/types';

export default function DashboardPage() {
  const [filters, setFilters] = useState<TenderSearchParams>({
    limit: 50,
    stages: ['tender'], // Default to active tenders
  });
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTenders(filters);

  const tenders = data?.tenders ?? [];

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
              Browse and search opportunities from Find a Tender
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {tenders.length > 0 && (
              <span>{tenders.length} tenders loaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <div className="flex-1 min-h-0">
        <TenderTable
          data={tenders}
          isLoading={isLoading || isFetchingNextPage}
          onRowClick={setSelectedTender}
          onRefresh={() => refetch()}
          hasNextPage={hasNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>

      {/* Detail panel */}
      <TenderDetail
        tender={selectedTender}
        onClose={() => setSelectedTender(null)}
      />
    </div>
  );
}
