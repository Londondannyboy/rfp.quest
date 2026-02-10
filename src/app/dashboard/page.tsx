'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useTenders, type TenderSearchParams } from '@/lib/hooks/use-tenders';
import { useSavedTenders } from '@/lib/hooks/use-saved-tenders';
import { TenderRowList, TenderListStats } from '@/components/dashboard/TenderRowList';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionToolbar } from '@/components/dashboard/ActionToolbar';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { SavedViewsPanel } from '@/components/dashboard/SavedViewsPanel';
import type { TenderSearchParams as FilterParams } from '@/lib/api/types';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

function DashboardContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<TenderSearchParams>({
    limit: 50,
    stage: 'tender', // Default to active tenders only
  });
  const [keyword, setKeyword] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('deadline-asc');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const { savedCount, isSaved } = useSavedTenders();

  const {
    data,
    isLoading,
    refetch,
  } = useTenders(filters);

  const tenders = data?.tenders ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Filter to show only saved if enabled
  const displayTenders = showSavedOnly
    ? tenders.filter((t) => isSaved(t.ocid))
    : tenders;

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
    setShowSavedOnly(false);
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
    setShowSavedOnly(false);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    // TODO: Apply sort to API query
  };

  const handleViewSaved = () => {
    setShowSavedOnly(!showSavedOnly);
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

  const activeFilterCount = [
    filterBarFilters.stages?.length,
    filterBarFilters.buyerName,
    filterBarFilters.region,
    filterBarFilters.minValue !== undefined || filterBarFilters.maxValue !== undefined,
    filterBarFilters.sustainability,
    filterBarFilters.cpvDivisions?.length,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section with KPIs and Charts */}
      <div className="bg-gradient-to-b from-gray-50 to-white px-6 py-6 border-b border-gray-200 overflow-auto">
        <DashboardHero />
      </div>

      {/* Action Toolbar - Search, Filter, Sort, Save */}
      <ActionToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        totalCount={showSavedOnly ? savedCount : totalCount}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFilterCount={activeFilterCount}
        savedCount={savedCount}
        onViewSaved={handleViewSaved}
      />

      {/* Saved Only Banner */}
      {showSavedOnly && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
          <p className="text-sm text-amber-800">
            Showing <span className="font-medium">{savedCount}</span> saved tenders
          </p>
          <button
            onClick={() => setShowSavedOnly(false)}
            className="text-sm text-amber-700 hover:text-amber-900 font-medium"
          >
            Show all
          </button>
        </div>
      )}

      {/* Filter Bar */}
      {showFilters && (
        <FilterBar
          filters={filterBarFilters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {/* Main Content - Cards Grid with Optional Saved Views Sidebar */}
      <div id="opportunities" className="flex-1 min-h-0 flex">
        {/* Saved Views Sidebar (visible on larger screens) */}
        <div className="hidden lg:block w-64 flex-shrink-0 p-4 border-r border-gray-200 overflow-y-auto">
          <SavedViewsPanel
            currentFilters={{
              keyword: filters.keyword,
              stage: filters.stage,
              region: filters.region,
              cpvDivisions: filters.cpvDivisions,
              minValue: filters.minValue,
              maxValue: filters.maxValue,
              sustainability: filters.sustainability,
              buyerName: filters.buyerName,
            }}
            onApplyView={(viewFilters) => {
              setFilters({
                limit: filters.limit,
                keyword: viewFilters.keyword,
                stage: viewFilters.stage,
                region: viewFilters.region,
                cpvDivisions: viewFilters.cpvDivisions,
                minValue: viewFilters.minValue,
                maxValue: viewFilters.maxValue,
                sustainability: viewFilters.sustainability,
                buyerName: viewFilters.buyerName,
                offset: 0,
              });
              setShowSavedOnly(false);
            }}
          />
        </div>

        {/* Tender Rows */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Stats bar above the list */}
          {displayTenders.length > 0 && (
            <TenderListStats
              total={showSavedOnly ? savedCount : totalCount}
              urgentCount={displayTenders.filter(t => {
                if (!t.tenderEndDate) return false;
                const days = Math.ceil((new Date(t.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return days >= 0 && days <= 7;
              }).length}
              sustainableCount={displayTenders.filter(t => t.isSustainability).length}
            />
          )}

          <TenderRowList
            tenders={displayTenders}
            loading={isLoading}
            hasMore={data?.hasMore && !showSavedOnly}
            onLoadMore={() => {
              setFilters({
                ...filters,
                offset: (filters.offset || 0) + (filters.limit || 50),
              });
            }}
            onSectorClick={(division) => {
              // Add sector to filters when clicking a sector badge
              const currentDivisions = filters.cpvDivisions || [];
              if (!currentDivisions.includes(division)) {
                setFilters({
                  ...filters,
                  cpvDivisions: [...currentDivisions, division],
                  offset: 0,
                });
              }
            }}
            onAnalyze={(tender) => {
              // Navigate to tender detail with analysis tab
              router.push(`/tender/${tender.slug}?tab=analysis`);
            }}
          />
        </div>
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
