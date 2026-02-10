'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TenderRow, TenderRowSkeleton, TenderRowHeader } from './TenderRow';
import { useSavedTenders } from '@/lib/hooks/use-saved-tenders';
import { useCompetitors } from '@/lib/hooks/use-competitors';
import { useProfileCompleteness } from '@/lib/hooks/use-profile-completeness';
import type { Tender } from '@/lib/hooks/use-tenders';

interface TenderRowListProps {
  tenders: Tender[];
  matchScores?: Record<string, number | null>;
  matchLoading?: boolean;
  onSectorClick?: (division: string) => void;
  onAnalyze?: (tender: Tender) => void;
  analyzingIds?: Set<string>;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

/**
 * Virtualized tender row list with infinite scroll and lazy competitor loading.
 * Displays visually stunning rows with inline mini-charts.
 */
export function TenderRowList({
  tenders,
  matchScores = {},
  matchLoading = false,
  onSectorClick,
  onAnalyze,
  analyzingIds = new Set(),
  loading = false,
  hasMore = false,
  onLoadMore,
}: TenderRowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSaved, toggleSaved } = useSavedTenders();
  const { profile: companyProfile } = useProfileCompleteness();

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onLoadMore || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // Load more when within 200px of bottom
    if (scrollBottom < 200) {
      onLoadMore();
    }

  }, [onLoadMore, hasMore, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && tenders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <TenderRowHeader />
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <TenderRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (tenders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
      >
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Adjust your filters or check back later for new tenders matching your criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <TenderRowHeader />
      <div
        ref={containerRef}
        className="max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-gray-100"
      >
        <AnimatePresence mode="popLayout">
          {tenders.map((tender, index) => (
            <TenderRowWithCompetitors
              key={tender.ocid}
              tender={tender}
              matchScore={matchScores[tender.ocid]}
              matchLoading={matchLoading}
              isSaved={isSaved(tender.ocid)}
              onSave={() => toggleSaved({
                ocid: tender.ocid,
                slug: tender.slug,
                title: tender.title,
                buyerName: tender.buyerName,
                valueMax: tender.valueMax,
                deadline: tender.tenderEndDate,
              })}
              onDismiss={() => {/* TODO: implement dismiss */}}
              onAnalyze={() => onAnalyze?.(tender)}
              onSectorClick={onSectorClick}
              isAnalyzing={analyzingIds.has(tender.ocid)}
              index={index}
              companyProfile={companyProfile}
            />
          ))}
        </AnimatePresence>

        {/* Loading indicator for infinite scroll */}
        {loading && hasMore && (
          <div className="py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <TenderRowSkeleton key={`loading-${i}`} />
            ))}
          </div>
        )}

        {/* End of list indicator */}
        {!hasMore && tenders.length > 0 && (
          <div className="py-6 text-center text-sm text-gray-400">
            Showing all {tenders.length} opportunities
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual row with lazy-loaded competitor data
 */
function TenderRowWithCompetitors({
  tender,
  matchScore,
  matchLoading,
  isSaved,
  onSave,
  onDismiss,
  onAnalyze,
  onSectorClick,
  isAnalyzing,
  index,
  companyProfile,
}: {
  tender: Tender;
  matchScore?: number | null;
  matchLoading?: boolean;
  isSaved: boolean;
  onSave: () => void;
  onDismiss: () => void;
  onAnalyze: () => void;
  onSectorClick?: (division: string) => void;
  isAnalyzing: boolean;
  index: number;
  companyProfile?: ReturnType<typeof useProfileCompleteness>['profile'];
}) {
  const [shouldLoadCompetitors, setShouldLoadCompetitors] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Lazy load competitors when row is hovered or visible
  const competitorQuery = useCompetitors({
    ocid: tender.ocid,
    buyerName: tender.buyerName,
    sector: tender.cpvCodes?.[0]?.substring(0, 2) || '',
    enabled: shouldLoadCompetitors,
  });

  const competitors = competitorQuery.data?.competitors ?? [];
  const incumbent = competitorQuery.data?.incumbent ?? null;

  // Trigger competitor load on hover
  const handleMouseEnter = useCallback(() => {
    setShouldLoadCompetitors(true);
  }, []);

  return (
    <div ref={rowRef} onMouseEnter={handleMouseEnter}>
      <TenderRow
        tender={tender}
        matchScore={matchScore}
        matchLoading={matchLoading}
        competitors={competitors}
        incumbent={incumbent}
        isSaved={isSaved}
        onSave={onSave}
        onDismiss={onDismiss}
        onAnalyze={onAnalyze}
        onSectorClick={onSectorClick}
        isAnalyzing={isAnalyzing}
        index={index}
        defaultExpanded={index < 3}
        companyProfile={companyProfile}
      />
    </div>
  );
}

/**
 * Compact stats bar for above the list
 */
export function TenderListStats({
  total,
  avgMatchScore,
  urgentCount,
  sustainableCount,
}: {
  total: number;
  avgMatchScore?: number;
  urgentCount: number;
  sustainableCount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 px-4 py-2 bg-gradient-to-r from-teal-50 to-transparent rounded-lg mb-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-teal-600">{total}</span>
        <span className="text-sm text-gray-600">opportunities</span>
      </div>

      {avgMatchScore !== undefined && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-gray-900">{avgMatchScore}%</span>
          <span className="text-gray-500">avg match</span>
        </div>
      )}

      {urgentCount > 0 && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
            {urgentCount}
          </span>
          <span className="text-gray-500">urgent</span>
        </div>
      )}

      {sustainableCount > 0 && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs font-bold">
            {sustainableCount}
          </span>
          <span className="text-gray-500">green</span>
        </div>
      )}
    </motion.div>
  );
}
