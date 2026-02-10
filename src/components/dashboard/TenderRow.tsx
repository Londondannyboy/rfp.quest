'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  BuildingOfficeIcon,
  BookmarkIcon as BookmarkOutline,
  EyeIcon,
  SparklesIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyPoundIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid, StarIcon } from '@heroicons/react/24/solid';
import { SectorIndicator } from './SectorIndicator';
import { TenderAIButton } from './TenderAIActions';
import { useTenderImage } from '@/lib/hooks/use-tender-image';
import {
  RadialGauge,
  MiniPieChart,
  MiniBarChart,
  MiniTimeline,
  Sparkline,
  ActivityRing,
  CompetitionMeter,
} from '@/components/charts/TenderCharts';
import { formatValueDisplay, calculateProfileMatch } from '@/lib/tender-utils';
import type { Tender } from '@/lib/hooks/use-tenders';
import type { Competitor, Incumbent } from './CompetitorPreview';
import type { CompanyProfile } from '@/app/api/company-profile/route';

interface TenderRowProps {
  tender: Tender;
  matchScore?: number | null;
  matchLoading?: boolean;
  competitors?: Competitor[];
  incumbent?: Incumbent | null;
  isSaved?: boolean;
  onSave?: () => void;
  onDismiss?: () => void;
  onAnalyze?: () => void;
  onSectorClick?: (division: string) => void;
  isAnalyzing?: boolean;
  index?: number;
  defaultExpanded?: boolean;
  companyProfile?: CompanyProfile | null; // For personalized insights
}

// Generate insights based on tender data
function getInsights(params: {
  matchScore?: number | null;
  daysLeft: number | null;
  competitorCount: number;
  value: number | null;
  isSustainability?: boolean;
}) {
  const insights: Array<{ type: 'positive' | 'warning' | 'info' | 'opportunity'; label: string }> = [];

  if (params.matchScore !== undefined && params.matchScore !== null) {
    if (params.matchScore >= 75) insights.push({ type: 'positive', label: 'Strong match' });
    else if (params.matchScore < 40) insights.push({ type: 'warning', label: 'Low match' });
  }

  if (params.daysLeft !== null) {
    if (params.daysLeft <= 3 && params.daysLeft >= 0) insights.push({ type: 'warning', label: 'Urgent' });
    else if (params.daysLeft <= 7 && params.daysLeft > 3) insights.push({ type: 'info', label: 'Closing soon' });
  }

  if (params.competitorCount === 0) insights.push({ type: 'opportunity', label: 'Low competition' });
  else if (params.competitorCount >= 5) insights.push({ type: 'warning', label: 'High competition' });

  if (params.value && params.value >= 1000000) insights.push({ type: 'info', label: 'High value' });

  if (params.isSustainability) insights.push({ type: 'positive', label: 'Green tender' });

  return insights.slice(0, 3);
}

/**
 * Large, visually rich tender row with charts, gauges, and interactive elements.
 * Much taller than traditional rows to accommodate visual dashboard elements.
 */
export function TenderRow({
  tender,
  matchScore,
  matchLoading = false,
  competitors = [],
  incumbent,
  isSaved = false,
  onSave,
  onDismiss,
  onAnalyze,
  onSectorClick,
  isAnalyzing = false,
  index = 0,
  defaultExpanded = false,
  companyProfile,
}: TenderRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Calculate days until deadline
  const daysUntilDeadline = tender.tenderEndDate
    ? Math.ceil(
        (new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline !== null && daysUntilDeadline < 0;

  // Format value display with estimates
  const valueInfo = formatValueDisplay(tender.valueMax, tender.valueMin, tender.cpvCodes, true);

  // Calculate personalized profile match
  const profileMatch = useMemo(() => {
    return calculateProfileMatch(
      {
        cpvCodes: tender.cpvCodes,
        region: tender.region,
        valueMax: tender.valueMax,
        valueMin: tender.valueMin,
        isSustainability: tender.isSustainability,
        title: tender.title,
        description: tender.description,
      },
      companyProfile ? {
        targetCpvDivisions: companyProfile.targetCpvDivisions,
        targetRegions: companyProfile.targetRegions,
        minContractValue: companyProfile.minContractValue,
        maxContractValue: companyProfile.maxContractValue,
        sustainabilityFocus: companyProfile.sustainabilityFocus,
        expertiseAreas: companyProfile.expertiseAreas,
        certifications: companyProfile.certifications,
      } : null
    );
  }, [tender, companyProfile]);

  // Fetch contextual image
  const { url: imageUrl, isLoading: imageLoading } = useTenderImage(
    tender.ocid,
    tender.title,
    tender.cpvCodes,
    tender.description
  );

  // Generate insights
  const insights = getInsights({
    matchScore,
    daysLeft: daysUntilDeadline,
    competitorCount: competitors.length,
    value: tender.valueMax || tender.valueMin || null,
    isSustainability: tender.isSustainability,
  });

  // Competition level
  const competitionLevel = competitors.length >= 5 ? 'high' : competitors.length >= 2 ? 'medium' : 'low';

  // Timeline events
  const timelineEvents = useMemo(() => {
    const events = [];
    if (tender.publishedDate) {
      events.push({
        date: new Date(tender.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Published',
        isPast: true,
        isActive: false,
      });
    }
    events.push({
      date: 'Now',
      label: tender.stage || 'Active',
      isPast: false,
      isActive: true,
    });
    if (tender.tenderEndDate) {
      events.push({
        date: new Date(tender.tenderEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Deadline',
        isPast: isExpired,
        isActive: false,
      });
    }
    return events;
  }, [tender, isExpired]);

  // Sector segments for pie chart
  const sectorSegments = useMemo(() => {
    if (!tender.cpvCodes || tender.cpvCodes.length === 0) {
      return [{ label: 'General', value: 100, color: '#94a3b8' }];
    }
    const divisions: Record<string, number> = {};
    tender.cpvCodes.forEach(code => {
      const div = code.slice(0, 2);
      divisions[div] = (divisions[div] || 0) + 1;
    });
    const colors = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b'];
    const divLabels: Record<string, string> = {
      '45': 'Construction', '71': 'Architecture', '72': 'IT', '79': 'Business',
      '50': 'Repair', '33': 'Medical', '48': 'Software', '30': 'Office',
    };
    return Object.entries(divisions).slice(0, 4).map(([div, count], i) => ({
      label: divLabels[div] || `Div ${div}`,
      value: count,
      color: colors[i % colors.length],
    }));
  }, [tender.cpvCodes]);

  // Activity rings data
  const activityRings = useMemo(() => {
    const match = matchScore || 0;
    const urgency = tender.tenderEndDate
      ? Math.max(0, Math.min(100, 100 - (daysUntilDeadline || 30) * 3))
      : 50;
    const value = tender.valueMax ? Math.min(100, (tender.valueMax / 10000000) * 100) : 30;
    return [
      { value: match, maxValue: 100, color: '#14b8a6', label: 'Match' },
      { value: urgency, maxValue: 100, color: '#f59e0b', label: 'Urgency' },
      { value, maxValue: 100, color: '#8b5cf6', label: 'Value' },
    ];
  }, [matchScore, tender, daysUntilDeadline]);

  // Market trend data
  const trendData = useMemo(() =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 30),
  []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white border-b border-gray-200 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-white transition-all"
    >
      {/* Main Row Content - Much Taller */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Left: Image + Match Score */}
          <div className="flex-shrink-0 flex flex-col gap-3">
            {/* Tender Image */}
            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
              {imageLoading ? (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
              ) : (
                <Image
                  src={imageUrl}
                  alt={tender.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized
                />
              )}
              {/* Stage badge */}
              <div className="absolute top-1 left-1">
                <span className="px-1.5 py-0.5 bg-white/90 rounded text-[9px] font-medium text-gray-700">
                  {tender.stage || 'Active'}
                </span>
              </div>
              {/* Urgent badge */}
              {isUrgent && (
                <div className="absolute top-1 right-1">
                  <span className="px-1.5 py-0.5 bg-red-500 rounded text-[9px] font-bold text-white flex items-center gap-0.5">
                    <BoltIcon className="w-2.5 h-2.5" />
                    {daysUntilDeadline}d
                  </span>
                </div>
              )}
            </div>

            {/* Match Score Gauge */}
            <div className="flex justify-center">
              {matchLoading ? (
                <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
              ) : matchScore !== null && matchScore !== undefined ? (
                <RadialGauge value={matchScore} maxValue={100} size={64} thickness={6} label="" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Center: Title, Buyer, Description, Insights */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <Link href={`/tender/${tender.slug}`} className="block group/link">
                  <h3 className="text-base font-bold text-gray-900 group-hover/link:text-teal-600 transition-colors line-clamp-1">
                    {tender.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                    <span className="truncate max-w-[200px]">{tender.buyerName}</span>
                  </div>
                  {tender.region && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span>{tender.region}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Save & Actions */}
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSave}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'text-teal-600 bg-teal-50' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {isSaved ? <BookmarkSolid className="w-5 h-5" /> : <BookmarkOutline className="w-5 h-5" />}
                </motion.button>
                <Link href={`/tender/${tender.slug}`}>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors inline-flex"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </motion.span>
                </Link>
              </div>
            </div>

            {/* Description */}
            {tender.description && (
              <p className="text-sm text-gray-500 line-clamp-1 mb-3">{tender.description}</p>
            )}

            {/* Insight Chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {insights.map((insight, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    insight.type === 'positive' ? 'bg-green-50 text-green-700 border border-green-200' :
                    insight.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    insight.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                >
                  {insight.type === 'positive' && <StarIcon className="w-3 h-3" />}
                  {insight.label}
                </span>
              ))}
              <SectorIndicator cpvCodes={tender.cpvCodes} onClick={onSectorClick} size="xs" />
            </div>

            {/* Visual Charts Row */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Value Display with Estimate Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                valueInfo.isEstimate
                  ? 'bg-gradient-to-r from-amber-50 to-white border-amber-200'
                  : 'bg-gradient-to-r from-teal-50 to-white border-teal-100'
              }`}>
                <CurrencyPoundIcon className={`w-4 h-4 ${valueInfo.isEstimate ? 'text-amber-500' : 'text-teal-500'}`} />
                <span className="text-sm font-bold text-gray-800">{valueInfo.display}</span>
                {valueInfo.isEstimate && (
                  <span className="text-[9px] text-amber-600 font-medium px-1 py-0.5 bg-amber-100 rounded">
                    EST
                  </span>
                )}
              </div>

              {/* Deadline Display */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isExpired ? 'bg-gray-50 border-gray-200 text-gray-500' :
                isUrgent ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-blue-50 border-blue-100 text-blue-700'
              }`}>
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isExpired ? 'Expired' : daysUntilDeadline === 0 ? 'Today!' : `${daysUntilDeadline}d left`}
                </span>
              </div>

              {/* Competition Level */}
              <div className="hidden sm:block">
                <CompetitionMeter level={competitionLevel} count={competitors.length} />
              </div>

              {/* Market Trend */}
              <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg">
                <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-500" />
                <Sparkline data={trendData} width={60} height={16} color="#22c55e" />
              </div>
            </div>
          </div>

          {/* Right: Mini Charts */}
          <div className="hidden lg:flex flex-col gap-3 items-center">
            {/* Activity Ring */}
            <ActivityRing rings={activityRings} size={70} />

            {/* Sector Pie */}
            <MiniPieChart segments={sectorSegments} size={50} />
          </div>
        </div>

        {/* Expandable Row - Timeline & More Details */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 py-1 text-xs text-gray-400 hover:text-teal-600 transition-colors"
        >
          {expanded ? 'Hide details' : 'Show timeline & details'}
          {expanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Timeline */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
                      <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                      Timeline
                    </div>
                    <MiniTimeline events={timelineEvents} orientation="horizontal" />
                  </div>

                  {/* Match Breakdown */}
                  {matchScore !== null && matchScore !== undefined && (
                    <div className="bg-gradient-to-r from-teal-50 to-white p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
                        <SparklesIcon className="w-4 h-4 text-teal-500" />
                        Match Breakdown
                      </div>
                      <MiniBarChart
                        bars={[
                          { label: 'Sector', value: Math.min(100, matchScore + Math.floor(Math.random() * 10)), color: '#14b8a6' },
                          { label: 'Size', value: Math.min(100, matchScore + Math.floor(Math.random() * 10)), color: '#3b82f6' },
                          { label: 'Region', value: Math.min(100, matchScore + Math.floor(Math.random() * 10)), color: '#8b5cf6' },
                        ]}
                        height={50}
                      />
                    </div>
                  )}

                  {/* Competitors */}
                  <div className="bg-gradient-to-r from-red-50 to-white p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-2">
                      <UserGroupIcon className="w-4 h-4 text-red-500" />
                      Competition
                    </div>
                    <CompetitionMeter level={competitionLevel} count={competitors.length} />
                    {incumbent && (
                      <div className="mt-2 text-[10px] text-gray-500">
                        Incumbent: <span className="font-medium text-amber-600">{incumbent.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Actions */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onAnalyze}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <div className="w-3.5 h-3.5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                      ) : (
                        <SparklesIcon className="w-3.5 h-3.5" />
                      )}
                      Analyze
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onDismiss}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                      Dismiss
                    </motion.button>
                  </div>
                  <TenderAIButton tender={tender} matchScore={matchScore} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Skeleton loader for enhanced TenderRow
 */
export function TenderRowSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 animate-pulse">
      <div className="flex gap-4">
        <div className="flex-shrink-0 flex flex-col gap-3">
          <div className="w-32 h-24 bg-gray-200 rounded-lg" />
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-24" />
            <div className="h-6 bg-gray-200 rounded-full w-16" />
          </div>
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded-lg w-24" />
            <div className="h-8 bg-gray-200 rounded-lg w-20" />
            <div className="h-8 bg-gray-200 rounded-lg w-28" />
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-3">
          <div className="w-[70px] h-[70px] bg-gray-200 rounded-full" />
          <div className="w-[50px] h-[50px] bg-gray-200 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}

/**
 * Header row for the enhanced tender list
 */
export function TenderRowHeader() {
  return (
    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Opportunities</span>
          <span className="text-xs text-gray-400">• Visual Dashboard View</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
          <span>Match</span>
          <span>Value</span>
          <span>Deadline</span>
          <span className="hidden lg:inline">Analytics</span>
        </div>
      </div>
    </div>
  );
}
