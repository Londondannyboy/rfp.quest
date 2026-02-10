'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { MatchScoreGauge } from './MatchScoreGauge';
import { CompetitorPreview, type Competitor, type Incumbent } from './CompetitorPreview';
import { SectorIndicator } from './SectorIndicator';
import { QuickActionButtons } from './QuickActionButtons';
import type { Tender } from '@/lib/hooks/use-tenders';

interface TenderCardProps {
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
}

/**
 * Rich tender card with match score, competitor info, and quick actions.
 * Designed to replace the Excel-style table row.
 */
export function TenderCard({
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
}: TenderCardProps) {
  // Calculate days until deadline
  const daysUntilDeadline = tender.tenderEndDate
    ? Math.ceil(
        (new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline !== null && daysUntilDeadline < 0;

  // Format value display
  const formatValue = (value: number | null) => {
    if (!value) return null;
    if (value >= 1_000_000) {
      return `£${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `£${(value / 1_000).toFixed(0)}k`;
    }
    return `£${value.toLocaleString()}`;
  };

  const valueDisplay =
    tender.valueMin && tender.valueMax
      ? `${formatValue(tender.valueMin)} - ${formatValue(tender.valueMax)}`
      : formatValue(tender.valueMax) || formatValue(tender.valueMin) || 'TBC';

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Header Row - Sector + Match Score */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <SectorIndicator
          cpvCodes={tender.cpvCodes}
          onClick={onSectorClick}
          size="sm"
        />
        <MatchScoreGauge score={matchScore ?? null} size="sm" loading={matchLoading} />
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/tender/${tender.slug}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
            {tender.title}
          </h3>
        </Link>

        {/* Description snippet */}
        {tender.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{tender.description}</p>
        )}

        {/* Meta Row - Buyer, Value, Deadline */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {/* Buyer */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
            <span className="truncate max-w-[180px]">{tender.buyerName}</span>
          </div>

          {/* Value */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <CurrencyPoundIcon className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{valueDisplay}</span>
          </div>

          {/* Region */}
          {tender.region && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span>{tender.region}</span>
            </div>
          )}
        </div>

        {/* Deadline Row */}
        {daysUntilDeadline !== null && (
          <div
            className={`flex items-center gap-1.5 text-sm ${
              isExpired
                ? 'text-gray-400'
                : isUrgent
                ? 'text-red-600 font-medium'
                : 'text-gray-600'
            }`}
          >
            {isUrgent ? (
              <ExclamationTriangleIcon className="w-4 h-4" />
            ) : (
              <ClockIcon className="w-4 h-4 text-gray-400" />
            )}
            {isExpired ? (
              <span>Deadline passed</span>
            ) : daysUntilDeadline === 0 ? (
              <span>Deadline today!</span>
            ) : daysUntilDeadline === 1 ? (
              <span>1 day remaining</span>
            ) : (
              <span>{daysUntilDeadline} days remaining</span>
            )}
            <span className="text-gray-400 ml-1">
              ({new Date(tender.tenderEndDate!).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
              })})
            </span>
          </div>
        )}

        {/* Sustainability Badge */}
        {tender.isSustainability && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm">
            <SparklesIcon className="w-4 h-4" />
            <span className="font-medium">Sustainability focused</span>
          </div>
        )}
      </div>

      {/* Competitor Section */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <CompetitorPreview
          competitors={competitors}
          incumbent={incumbent}
          loading={competitorLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <QuickActionButtons
          slug={tender.slug}
          isSaved={isSaved}
          onSave={onSave}
          onDismiss={onDismiss}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
          showLabels
        />
        <div className="text-xs text-gray-400">
          Published {new Date(tender.publishedDate).toLocaleDateString('en-GB')}
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Skeleton loader for TenderCard.
 */
export function TenderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="w-24 h-6 bg-gray-200 rounded-full" />
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>

      {/* Competitor */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <div className="h-8 bg-gray-200 rounded-lg w-16" />
        <div className="h-8 bg-gray-200 rounded-lg w-16" />
        <div className="h-8 bg-gray-200 rounded-lg w-20" />
      </div>
    </div>
  );
}
