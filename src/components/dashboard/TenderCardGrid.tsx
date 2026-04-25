'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TenderCard, TenderCardSkeleton } from './TenderCard';
import type { Tender } from '@/lib/hooks/use-tenders';
import { useCompetitors } from '@/lib/hooks/use-competitors';
import { useSavedTenders } from '@/lib/hooks/use-saved-tenders';
import { SECTOR_INFO } from './SectorIndicator';

// MatchScore interface for future batch endpoint
// interface MatchScore {
//   ocid: string;
//   score: number;
// }

interface TenderCardGridProps {
  tenders: Tender[];
  matchScores?: Record<string, number>;
  matchScoresLoading?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSectorClick?: (division: string) => void;
  onAnalyze?: (tender: Tender) => void;
  onDismiss?: (tender: Tender) => void;
  emptyMessage?: string;
  columns?: 1 | 2 | 3;
}

/**
 * Responsive grid of TenderCards with infinite scroll.
 * Handles match scores, competitor data, and saved state.
 */
export function TenderCardGrid({
  tenders,
  matchScores = {},
  matchScoresLoading = false,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onSectorClick,
  onAnalyze,
  onDismiss,
  emptyMessage = 'No tenders found',
  columns,
}: TenderCardGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { savedTenders, saveTender, removeTender } = useSavedTenders();

  // Set up infinite scroll observer
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, onLoadMore]);

  const handleSave = useCallback(
    (tender: Tender) => {
      const isSaved = savedTenders.some((t) => t.ocid === tender.ocid);
      if (isSaved) {
        removeTender(tender.ocid);
      } else {
        saveTender({
          ocid: tender.ocid,
          slug: tender.slug,
          title: tender.title,
          buyerName: tender.buyerName,
          valueMax: tender.valueMax,
          deadline: tender.tenderEndDate,
        });
      }
    },
    [savedTenders, saveTender, removeTender]
  );

  // Column classes
  const gridCols = columns
    ? `grid-cols-${columns}`
    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  if (!isLoading && tenders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 bg-slate-900/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          No Tenders Found
        </h3>
        <p className="text-slate-500 max-w-md">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className={`grid ${gridCols} gap-4`}>
        <AnimatePresence mode="popLayout">
          {tenders.map((tender, index) => (
            <TenderCardWithCompetitors
              key={tender.ocid}
              tender={tender}
              matchScore={matchScores[tender.ocid]}
              matchLoading={matchScoresLoading}
              isSaved={savedTenders.some((t) => t.ocid === tender.ocid)}
              onSave={() => handleSave(tender)}
              onDismiss={onDismiss ? () => onDismiss(tender) : undefined}
              onAnalyze={onAnalyze ? () => onAnalyze(tender) : undefined}
              onSectorClick={onSectorClick}
              delay={index * 0.05}
            />
          ))}
        </AnimatePresence>

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <TenderCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Load more trigger */}
      {hasMore && <div ref={loadMoreRef} className="h-4" />}

      {/* Loading indicator for infinite scroll */}
      {isLoading && tenders.length > 0 && (
        <div className="flex justify-center py-4">
          <motion.div
            className="w-6 h-6 border-2 border-slate-600/50 border-t-teal-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * TenderCard wrapper that fetches competitor data on hover.
 */
function TenderCardWithCompetitors({
  tender,
  matchScore,
  matchLoading,
  isSaved,
  onSave,
  onDismiss,
  onAnalyze,
  onSectorClick,
  delay = 0,
}: {
  tender: Tender;
  matchScore?: number;
  matchLoading?: boolean;
  isSaved: boolean;
  onSave: () => void;
  onDismiss?: () => void;
  onAnalyze?: () => void;
  onSectorClick?: (division: string) => void;
  delay?: number;
}) {
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get sector from CPV code
  const primaryCpv = tender.cpvCodes?.[0];
  const sector = primaryCpv
    ? SECTOR_INFO[primaryCpv.substring(0, 2)]?.label || 'general'
    : 'general';

  // Fetch competitors when card has been hovered (lazy load)
  const {
    data: competitorData,
    isLoading: competitorLoading,
  } = useCompetitors({
    ocid: tender.ocid,
    buyerName: tender.buyerName,
    sector,
    enabled: hasBeenHovered,
  });

  const handleMouseEnter = () => {
    if (!hasBeenHovered) {
      setHasBeenHovered(true);
    }
  };

  const handleAnalyze = () => {
    if (onAnalyze) {
      setIsAnalyzing(true);
      // Call onAnalyze and reset state after
      Promise.resolve(onAnalyze()).finally(() => {
        setIsAnalyzing(false);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay }}
      onMouseEnter={handleMouseEnter}
    >
      <TenderCard
        tender={tender}
        matchScore={matchScore ?? null}
        matchLoading={matchLoading}
        competitors={competitorData?.competitors || []}
        incumbent={competitorData?.incumbent}
        competitorLoading={hasBeenHovered && competitorLoading}
        isSaved={isSaved}
        onSave={onSave}
        onDismiss={onDismiss}
        onAnalyze={onAnalyze ? handleAnalyze : undefined}
        onSectorClick={onSectorClick}
        isAnalyzing={isAnalyzing}
      />
    </motion.div>
  );
}

/**
 * Grid loading skeleton
 */
export function TenderCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TenderCardSkeleton key={i} />
      ))}
    </div>
  );
}
