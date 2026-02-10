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
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { MatchScoreGauge } from './MatchScoreGauge';
import { CompetitorPreview, type Competitor, type Incumbent } from './CompetitorPreview';
import { SectorIndicator } from './SectorIndicator';
import { QuickActionButtons } from './QuickActionButtons';
import type { Tender } from '@/lib/hooks/use-tenders';

// AI Insight chip component
function InsightChip({ type, label }: { type: 'positive' | 'warning' | 'info' | 'opportunity'; label: string }) {
  const styles = {
    positive: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    opportunity: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  const icons = {
    positive: <CheckCircleIcon className="w-3 h-3" />,
    warning: <ExclamationTriangleIcon className="w-3 h-3" />,
    info: <LightBulbIcon className="w-3 h-3" />,
    opportunity: <SparklesIcon className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${styles[type]}`}>
      {icons[type]}
      {label}
    </span>
  );
}

// Match breakdown bar component
function MatchBreakdown({ score }: { score: number | null }) {
  if (score === null) return null;

  // Simulate breakdown (in real app, this would come from API)
  const breakdown = [
    { label: 'Sector', value: Math.min(100, score + Math.floor(Math.random() * 20) - 10), color: 'bg-teal-500' },
    { label: 'Size', value: Math.min(100, score + Math.floor(Math.random() * 20) - 10), color: 'bg-blue-500' },
    { label: 'Location', value: Math.min(100, score + Math.floor(Math.random() * 20) - 10), color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">Match Breakdown</span>
        <ChartBarIcon className="w-3.5 h-3.5" />
      </div>
      <div className="space-y-1">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-12">{item.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${item.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
            <span className="text-[10px] font-medium text-gray-600 w-6">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generate smart insights based on tender data
function generateInsights(tender: Tender, matchScore: number | null, competitors: Competitor[], daysLeft: number | null) {
  const insights: Array<{ type: 'positive' | 'warning' | 'info' | 'opportunity'; label: string }> = [];

  // Match score insights
  if (matchScore !== null) {
    if (matchScore >= 80) insights.push({ type: 'positive', label: 'Strong match' });
    else if (matchScore < 40) insights.push({ type: 'warning', label: 'Low match' });
  }

  // Deadline insights
  if (daysLeft !== null) {
    if (daysLeft <= 3 && daysLeft >= 0) insights.push({ type: 'warning', label: 'Urgent' });
    else if (daysLeft <= 7 && daysLeft > 3) insights.push({ type: 'info', label: 'Closing soon' });
  }

  // Competition insights
  if (competitors.length === 0) insights.push({ type: 'opportunity', label: 'Low competition' });
  else if (competitors.length >= 5) insights.push({ type: 'warning', label: 'High competition' });

  // Value insights
  if (tender.valueMax && tender.valueMax >= 1000000) insights.push({ type: 'info', label: 'High value' });

  // Sustainability
  if (tender.isSustainability) insights.push({ type: 'positive', label: 'Green tender' });

  return insights.slice(0, 3);
}

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

        {/* AI Insights Row */}
        {(() => {
          const insights = generateInsights(tender, matchScore ?? null, competitors, daysUntilDeadline);
          if (insights.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {insights.map((insight, i) => (
                <InsightChip key={i} type={insight.type} label={insight.label} />
              ))}
            </div>
          );
        })()}
      </div>

      {/* Match Breakdown Section */}
      {matchScore !== null && matchScore !== undefined && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <MatchBreakdown score={matchScore} />
        </div>
      )}

      {/* Competitor Section */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <UserGroupIcon className="w-3.5 h-3.5" />
            Competitor Intelligence
          </span>
        </div>
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
        {/* AI Insights skeleton */}
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-24" />
        </div>
      </div>

      {/* Match Breakdown skeleton */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="flex items-center gap-2">
            <div className="h-2 bg-gray-200 rounded w-10" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-gray-200 rounded w-10" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-gray-200 rounded w-10" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Competitor */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="h-3 bg-gray-200 rounded w-28 mb-2" />
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
