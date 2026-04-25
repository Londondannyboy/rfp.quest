'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useTenders, type TenderSearchParams } from '@/lib/hooks/use-tenders';
import { useSavedTenders } from '@/lib/hooks/use-saved-tenders';
import { useProfileCompleteness } from '@/lib/hooks/use-profile-completeness';
import { TenderCardGrid } from '@/components/dashboard/TenderCardGrid';
import { TenderRowList, TenderListStats } from '@/components/dashboard/TenderRowList';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionToolbar, type ViewMode } from '@/components/dashboard/ActionToolbar';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { SavedViewsPanel } from '@/components/dashboard/SavedViewsPanel';
import { calculateProfileMatch } from '@/lib/tender-utils';
import type { TenderSearchParams as FilterParams } from '@/lib/api/types';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

function DashboardContent() {
  const router = useRouter();
  const { profile } = useProfileCompleteness();

  // Initialize filters from profile - personalized by default
  const [filters, setFilters] = useState<TenderSearchParams>({
    limit: 50,
    stage: 'tender', // Active tenders only
  });
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('match-desc'); // Sort by match score by default
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { savedTenders, savedCount } = useSavedTenders();

  // Apply profile-based filters on load (personalization default ON)
  useEffect(() => {
    if (profile && !filtersInitialized) {
      setFilters((prev) => ({
        ...prev,
        cpvDivisions: profile.targetCpvDivisions?.length > 0 ? profile.targetCpvDivisions : undefined,
        region: profile.targetRegions?.[0] || undefined, // Use first region
        minValue: profile.minContractValue || undefined,
        maxValue: profile.maxContractValue || undefined,
        sustainability: profile.sustainabilityFocus || undefined,
      }));
      setFiltersInitialized(true);
    }
  }, [profile, filtersInitialized]);

  // Main query for filtered tenders
  const {
    data,
    isLoading,
  } = useTenders(filters);

  // Separate query for saved tenders (fetches by OCIDs directly from DB)
  const savedOcids = useMemo(() => savedTenders.map(t => t.ocid), [savedTenders]);
  const {
    data: savedData,
    isLoading: savedLoading,
  } = useTenders(
    { ocids: savedOcids },
    { enabled: showSavedOnly && savedOcids.length > 0 }
  );

  // Use saved data when showing saved only, otherwise use filtered data
  const activeTenders = showSavedOnly ? (savedData?.tenders ?? []) : (data?.tenders ?? []);
  const activeLoading = showSavedOnly ? savedLoading : isLoading;
  const tenders = activeTenders;
  const totalCount = showSavedOnly ? (savedData?.totalCount ?? 0) : (data?.totalCount ?? 0);

  // Calculate match scores for all tenders based on profile
  const matchScores = useMemo(() => {
    if (!profile) return {};

    const scores: Record<string, number> = {};
    tenders.forEach((tender) => {
      const match = calculateProfileMatch(
        {
          cpvCodes: tender.cpvCodes,
          region: tender.region,
          valueMax: tender.valueMax,
          valueMin: tender.valueMin,
          isSustainability: tender.isSustainability,
          title: tender.title,
          description: tender.description,
        },
        {
          targetCpvDivisions: profile.targetCpvDivisions,
          targetRegions: profile.targetRegions,
          minContractValue: profile.minContractValue,
          maxContractValue: profile.maxContractValue,
          sustainabilityFocus: profile.sustainabilityFocus,
          expertiseAreas: profile.expertiseAreas,
          certifications: profile.certifications,
        }
      );
      scores[tender.ocid] = match.overall;
    });
    return scores;
  }, [tenders, profile]);

  // Sort tenders (filtering is now handled by API when showSavedOnly)
  const displayTenders = useMemo(() => {
    let filtered = [...tenders];

    // Sort based on sortBy
    if (sortBy === 'match-desc') {
      filtered = [...filtered].sort((a, b) => (matchScores[b.ocid] || 0) - (matchScores[a.ocid] || 0));
    } else if (sortBy === 'deadline-asc') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.tenderEndDate) return 1;
        if (!b.tenderEndDate) return -1;
        return new Date(a.tenderEndDate).getTime() - new Date(b.tenderEndDate).getTime();
      });
    } else if (sortBy === 'value-desc') {
      filtered = [...filtered].sort((a, b) => (b.valueMax || 0) - (a.valueMax || 0));
    }

    return filtered;
  }, [tenders, sortBy, matchScores]);

  // Calculate average match score for stats
  const avgMatchScore = useMemo(() => {
    const scores = Object.values(matchScores);
    if (scores.length === 0) return undefined;
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  }, [matchScores]);

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
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
      </div>
      {/* Hero Section with KPIs and Charts */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 px-6 py-6 border-b border-slate-700/50 overflow-auto relative">
        {/* Advanced decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          
          {/* Floating glass orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <DashboardHero
          onSectorClick={(division) => {
            // Filter by sector when clicking pie chart
            const currentDivisions = filters.cpvDivisions || [];
            if (!currentDivisions.includes(division)) {
              setFilters({
                ...filters,
                cpvDivisions: [...currentDivisions, division],
                offset: 0,
              });
              setShowSavedOnly(false);
            }
          }}
          onValueClick={(minValue, maxValue) => {
            // Filter by value range when clicking histogram
            setFilters({
              ...filters,
              minValue,
              maxValue: maxValue === Infinity ? undefined : maxValue,
              offset: 0,
            });
            setShowSavedOnly(false);
          }}
          onUrgentClick={() => {
            // Filter to show only urgent tenders (closing within 7 days)
            // We'll use sortBy to show deadline-asc
            handleSortChange('deadline-asc');
            setShowSavedOnly(false);
            // Scroll to opportunities section
            document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onTopSectorClick={(division) => {
            // Filter by top sector
            const currentDivisions = filters.cpvDivisions || [];
            if (!currentDivisions.includes(division)) {
              setFilters({
                ...filters,
                cpvDivisions: [division],
                offset: 0,
              });
              setShowSavedOnly(false);
            }
            document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onLiveOpportunitiesClick={() => {
            // Clear all filters and show all opportunities
            setFilters({ limit: 50, offset: 0 });
            setShowSavedOnly(false);
            document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Personalization Banner */}
      {profile && filtersInitialized && (
        <div className="bg-gradient-to-r from-slate-900/60 to-blue-900/60 backdrop-blur-xl border-b border-slate-700/50 px-4 py-2.5 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-slate-500/10 rounded-sm pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border-blue-400/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-100">
                <span className="font-semibold">Personalized for {profile.companyName}</span>
                <span className="text-blue-300 ml-2">
                  {profile.targetCpvDivisions?.length || 0} sectors, {profile.targetRegions?.length || 0} regions
                  {profile.sustainabilityFocus && ', sustainability focus'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFilters({ limit: 50, stage: 'tender' });
              setFiltersInitialized(true);
            }}
            className="relative text-sm text-blue-300 hover:text-blue-200 font-medium px-3 py-1 hover:bg-slate-800/50 rounded-lg transition-colors border-slate-600/30 hover:border-blue-500/30 backdrop-blur-sm"
          >
            Show all tenders
          </button>
        </div>
      )}

      {/* Action Toolbar - Search, Filter, Sort, Save, View Toggle */}
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Saved Only Banner */}
      {showSavedOnly && (
        <div className="bg-gradient-to-r from-slate-900/60 to-amber-900/60 backdrop-blur-xl border-b border-slate-700/50 px-4 py-2 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-slate-500/10 rounded-sm pointer-events-none" />
          <p className="relative text-sm text-slate-100">
            Showing <span className="font-medium text-amber-300">{savedCount}</span> saved tenders
          </p>
          <button
            onClick={() => setShowSavedOnly(false)}
            className="relative text-sm text-amber-300 hover:text-amber-200 font-medium px-3 py-1 hover:bg-slate-800/50 rounded-lg transition-colors border-slate-600/30 hover:border-amber-500/30 backdrop-blur-sm"
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

      {/* Main Content */}
      <div id="opportunities" className="relative flex-1 min-h-0 overflow-y-auto bg-slate-900/20 backdrop-blur-sm">
        <div className="relative p-4 space-y-4">
          {/* Saved Views - Horizontal Pills */}
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
            layout="horizontal"
          />

          {/* Stats bar */}
          {displayTenders.length > 0 && (
            <TenderListStats
              total={showSavedOnly ? savedCount : totalCount}
              avgMatchScore={avgMatchScore}
              urgentCount={displayTenders.filter(t => {
                if (!t.tenderEndDate) return false;
                const days = Math.ceil((new Date(t.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return days >= 0 && days <= 7;
              }).length}
              sustainableCount={displayTenders.filter(t => t.isSustainability).length}
            />
          )}

          {/* Tender List or Grid based on viewMode */}
          {viewMode === 'list' ? (
            <TenderRowList
              tenders={displayTenders}
              matchScores={matchScores}
              loading={activeLoading}
              hasMore={data?.hasMore && !showSavedOnly}
              onLoadMore={() => {
                setFilters({
                  ...filters,
                  offset: (filters.offset || 0) + (filters.limit || 50),
                });
              }}
              onSectorClick={(division) => {
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
                router.push(`/tender/${tender.slug}?tab=analysis`);
              }}
            />
          ) : (
            <TenderCardGrid
              tenders={displayTenders}
              matchScores={matchScores}
              isLoading={activeLoading}
              hasMore={data?.hasMore && !showSavedOnly}
              onLoadMore={() => {
                setFilters({
                  ...filters,
                  offset: (filters.offset || 0) + (filters.limit || 50),
                });
              }}
              onSectorClick={(division) => {
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
                router.push(`/tender/${tender.slug}?tab=analysis`);
              }}
              emptyMessage={
                showSavedOnly
                  ? 'No saved tenders yet. Click the bookmark icon on any tender to save it.'
                  : 'No tenders match your current filters. Try adjusting your search criteria.'
              }
            />
          )}
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
