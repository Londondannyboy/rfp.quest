'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  BookmarkIcon as BookmarkOutline,
  EyeIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import {
  MiniMatchGauge,
  DeadlineBar,
  ValueIndicator,
  CompetitorBadge,
  InsightChip,
  getInsights,
} from './MiniCharts';
import { SectorIndicator } from './SectorIndicator';
import type { Tender } from '@/lib/hooks/use-tenders';
import type { Competitor, Incumbent } from './CompetitorPreview';

interface TenderRowProps {
  tender: Tender;
  matchScore?: number | null;
  matchLoading?: boolean;
  competitors?: Competitor[];
  incumbent?: Incumbent | null;
  competitorLoading?: boolean;
  isSaved?: boolean;
  onSave?: () => void;
  onDismiss?: () => void;
  onAnalyze?: () => void;
  onSectorClick?: (division: string) => void;
  isAnalyzing?: boolean;
  avgValue?: number;
  index?: number;
}

/**
 * Visually stunning tender row with inline mini-charts and AI insights.
 * Replaces card-based layout for denser, more scannable data display.
 */
export function TenderRow({
  tender,
  matchScore,
  matchLoading = false,
  competitors = [],
  incumbent,
  competitorLoading = false,
  isSaved = false,
  onSave,
  onDismiss,
  onAnalyze,
  onSectorClick,
  isAnalyzing = false,
  avgValue,
  index = 0,
}: TenderRowProps) {
  // Calculate days until deadline
  const daysUntilDeadline = tender.tenderEndDate
    ? Math.ceil(
        (new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Generate AI insights
  const insights = getInsights({
    matchScore,
    daysLeft: daysUntilDeadline,
    competitorCount: competitors.length,
    value: tender.valueMax || tender.valueMin || null,
    isSustainability: tender.isSustainability,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.02)' }}
      className="group border-b border-gray-100 last:border-b-0 hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-transparent transition-all"
    >
      <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center">
        {/* Column 1: Match Score Gauge (1 col) */}
        <div className="col-span-1 flex justify-center">
          {matchLoading ? (
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-teal-500 animate-spin" />
          ) : (
            <MiniMatchGauge score={matchScore ?? null} size={36} />
          )}
        </div>

        {/* Column 2: Title + Buyer + Sector (4 cols) */}
        <div className="col-span-4 min-w-0">
          <div className="flex items-start gap-2">
            <SectorIndicator
              cpvCodes={tender.cpvCodes}
              onClick={onSectorClick}
              size="xs"
              iconOnly
            />
            <div className="min-w-0 flex-1">
              <Link href={`/tender/${tender.slug}`} className="block group/link">
                <h3 className="text-sm font-semibold text-gray-900 group-hover/link:text-teal-600 transition-colors truncate">
                  {tender.title}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{tender.buyerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Value Indicator (2 cols) */}
        <div className="col-span-2 flex justify-center">
          <ValueIndicator
            value={tender.valueMax || tender.valueMin || null}
            avgValue={avgValue}
            showComparison
          />
        </div>

        {/* Column 4: Deadline Bar (2 cols) */}
        <div className="col-span-2">
          <DeadlineBar daysLeft={daysUntilDeadline} />
        </div>

        {/* Column 5: Competitors (1 col) */}
        <div className="col-span-1">
          <CompetitorBadge
            count={competitors.length}
            incumbentName={incumbent?.name}
            loading={competitorLoading}
          />
        </div>

        {/* Column 6: AI Insights + Actions (2 cols) */}
        <div className="col-span-2 flex items-center justify-end gap-2">
          {/* AI Insights - Show on hover or always show first one */}
          <div className="hidden group-hover:flex items-center gap-1 flex-wrap justify-end">
            {insights.slice(0, 2).map((insight, i) => (
              <InsightChip key={i} type={insight.type} label={insight.label} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSave}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              {isSaved ? (
                <BookmarkSolid className="w-4 h-4" />
              ) : (
                <BookmarkOutline className="w-4 h-4" />
              )}
            </motion.button>

            <Link href={`/tender/${tender.slug}`}>
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors inline-flex"
              >
                <EyeIcon className="w-4 h-4" />
              </motion.span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50"
              title="AI Analysis"
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Dismiss"
            >
              <XMarkIcon className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Always visible insight (first one) when not hovered */}
          <div className="group-hover:hidden">
            {insights.length > 0 && (
              <InsightChip type={insights[0].type} label={insights[0].label} />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details Row (sustainability, region, extra insights) */}
      {(tender.isSustainability || tender.region || insights.length > 2) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="hidden group-hover:block px-4 pb-3"
        >
          <div className="pl-14 flex items-center gap-2 flex-wrap">
            {tender.region && (
              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                {tender.region}
              </span>
            )}
            {tender.isSustainability && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded text-[10px] text-green-700">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Green Tender
              </span>
            )}
            {insights.slice(2).map((insight, i) => (
              <InsightChip key={i} type={insight.type} label={insight.label} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Skeleton loader for TenderRow
 */
export function TenderRowSkeleton() {
  return (
    <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center animate-pulse border-b border-gray-100">
      <div className="col-span-1 flex justify-center">
        <div className="w-9 h-9 bg-gray-200 rounded-full" />
      </div>
      <div className="col-span-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="col-span-2 flex justify-center">
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="col-span-2">
        <div className="h-2 bg-gray-200 rounded-full w-full" />
      </div>
      <div className="col-span-1">
        <div className="h-5 bg-gray-200 rounded w-12" />
      </div>
      <div className="col-span-2 flex justify-end">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  );
}

/**
 * Header row for the tender list
 */
export function TenderRowHeader() {
  return (
    <div className="px-4 py-2 grid grid-cols-12 gap-4 items-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm">
      <div className="col-span-1 text-center">Match</div>
      <div className="col-span-4">Opportunity</div>
      <div className="col-span-2 text-center">Value</div>
      <div className="col-span-2">Deadline</div>
      <div className="col-span-1">Competition</div>
      <div className="col-span-2 text-right">Insights</div>
    </div>
  );
}
