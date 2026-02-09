'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useTenders, type Tender, type TenderSearchParams } from '@/lib/hooks/use-tenders';
import { TenderTable } from '@/components/dashboard/TenderTable';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import type { TenderSearchParams as FilterParams } from '@/lib/api/types';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

function DashboardContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<TenderSearchParams>({
    limit: 50,
  });
  const [keyword, setKeyword] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const {
    data,
    isLoading,
    refetch,
  } = useTenders(filters);

  const tenders = data?.tenders ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Fetch stats for CopilotKit context
  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  // Make dashboard stats available to CopilotKit
  useCopilotReadable({
    description: 'Current UK government tender market statistics',
    value: stats ? {
      totalLiveOpportunities: stats.totalOpportunities,
      averageContractValue: `£${(stats.averageValue / 1000000).toFixed(1)}M`,
      sectorBreakdown: stats.sectorBreakdown.map(s => ({
        sector: s.sector,
        count: s.count,
        percentage: `${s.percentage}%`,
      })),
      valueDistribution: stats.valueDistribution.map(v => ({
        range: v.bucket,
        count: v.count,
      })),
      upcomingDeadlines: stats.upcomingDeadlines.map(d => ({
        title: d.title,
        buyer: d.buyerName,
        daysRemaining: d.daysRemaining,
      })),
      topSector: stats.topSector,
    } : 'Loading...',
  });

  // Make current search filters available to CopilotKit
  useCopilotReadable({
    description: 'Current search filters applied to tender list',
    value: {
      keyword: filters.keyword || 'none',
      stage: filters.stage || 'all',
      region: filters.region || 'all',
      valueRange: filters.minValue || filters.maxValue
        ? `£${filters.minValue || 0} - £${filters.maxValue || 'unlimited'}`
        : 'any',
      sectors: filters.cpvDivisions?.join(', ') || 'all',
      resultsShowing: tenders.length,
      totalResults: totalCount,
    },
  });

  const handleSearch = () => {
    setFilters({ ...filters, keyword: keyword || undefined, offset: 0 });
  };

  const handleFiltersChange = (newFilters: FilterParams) => {
    setFilters({
      limit: filters.limit,
      keyword: filters.keyword,
      stage: newFilters.stages?.[0],
      region: newFilters.region,
      minValue: newFilters.minValue,
      maxValue: newFilters.maxValue,
      cpvDivisions: newFilters.cpvDivisions,
      sustainability: newFilters.sustainability,
      buyerName: newFilters.buyerName,
      offset: 0,
    });
  };

  const filterBarFilters: FilterParams = {
    stages: filters.stage ? [filters.stage as 'planning' | 'tender' | 'award'] : undefined,
    region: filters.region,
    minValue: filters.minValue,
    maxValue: filters.maxValue,
    cpvDivisions: filters.cpvDivisions,
    sustainability: filters.sustainability,
    buyerName: filters.buyerName,
    limit: filters.limit,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section with KPIs and Charts */}
      <div className="bg-gradient-to-b from-gray-50 to-white px-6 py-6 border-b border-gray-200 overflow-auto">
        <DashboardHero />

        {/* Quick search */}
        <div id="opportunities" className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
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
          <p className="text-sm text-gray-500">
            {totalCount.toLocaleString()} opportunities
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterBarFilters}
        onFiltersChange={handleFiltersChange}
      />

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

export default function DashboardPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        labels={{
          title: 'Tender AI Assistant',
          initial: "Hi! I'm your tender market assistant. I can help you explore opportunities, understand market trends, and find relevant tenders. What would you like to know?",
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
        className="z-50"
      >
        <DashboardContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
