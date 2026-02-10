'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  BoltIcon,
  EyeIcon,
  DocumentTextIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { CompetitorPreview, type Competitor, type Incumbent } from './CompetitorPreview';
import { SectorIndicator } from './SectorIndicator';
import { QuickActionButtons } from './QuickActionButtons';
import { useTenderImage } from '@/lib/hooks/use-tender-image';
import { TenderAIButton } from './TenderAIActions';
import {
  MiniPieChart,
  MiniBarChart,
  MiniTimeline,
  RadialGauge,
  Sparkline,
  ActivityRing,
  CompetitionMeter,
  ValueComparison,
} from '@/components/charts/TenderCharts';
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
    positive: <CheckCircleIcon className="w-3.5 h-3.5" />,
    warning: <ExclamationTriangleIcon className="w-3.5 h-3.5" />,
    info: <LightBulbIcon className="w-3.5 h-3.5" />,
    opportunity: <SparklesIcon className="w-3.5 h-3.5" />,
  };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shadow-sm ${styles[type]}`}
    >
      {icons[type]}
      {label}
    </motion.span>
  );
}

// Large visual match score component
function LargeMatchScore({ score, loading }: { score: number | null; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <SparklesIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">Complete profile for match score</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <RadialGauge
        value={score}
        maxValue={100}
        size={110}
        thickness={10}
        label="Match"
        sublabel="Score"
      />
      <div className="mt-2 flex items-center gap-1">
        {score >= 70 ? (
          <span className="text-xs font-medium text-teal-600 flex items-center gap-1">
            <StarIconSolid className="w-3.5 h-3.5" />
            Strong Match
          </span>
        ) : score >= 40 ? (
          <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5" />
            Moderate Match
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-500">Low Match</span>
        )}
      </div>
    </div>
  );
}

// Sector breakdown pie chart with labels
function SectorBreakdown({ cpvCodes }: { cpvCodes: string[] | null }) {
  const segments = useMemo(() => {
    if (!cpvCodes || cpvCodes.length === 0) {
      return [
        { label: 'General', value: 100, color: '#94a3b8' },
      ];
    }

    // Group by first 2 digits (division)
    const divisions: Record<string, number> = {};
    cpvCodes.forEach(code => {
      const div = code.slice(0, 2);
      divisions[div] = (divisions[div] || 0) + 1;
    });

    const colors = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    const divLabels: Record<string, string> = {
      '45': 'Construction',
      '71': 'Architecture',
      '72': 'IT Services',
      '79': 'Business',
      '50': 'Repair',
      '33': 'Medical',
      '34': 'Transport',
      '48': 'Software',
      '30': 'Office',
      '22': 'Printed',
    };

    return Object.entries(divisions).map(([div, count], i) => ({
      label: divLabels[div] || `Div ${div}`,
      value: count,
      color: colors[i % colors.length],
    }));
  }, [cpvCodes]);

  return (
    <div className="flex items-center gap-4">
      <MiniPieChart segments={segments} size={70} />
      <div className="flex-1 space-y-1">
        {segments.slice(0, 3).map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600 truncate">{s.label}</span>
            <span className="text-gray-400 ml-auto">{Math.round((s.value / segments.reduce((a, b) => a + b.value, 0)) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced match breakdown with visual bar chart
function EnhancedMatchBreakdown({ score }: { score: number | null }) {
  if (score === null) return null;

  // Simulate breakdown (in real app, this would come from API)
  const bars = [
    { label: 'Sector', value: Math.min(100, score + Math.floor(Math.random() * 15) - 5), color: '#14b8a6' },
    { label: 'Size', value: Math.min(100, score + Math.floor(Math.random() * 15) - 5), color: '#3b82f6' },
    { label: 'Location', value: Math.min(100, score + Math.floor(Math.random() * 15) - 5), color: '#8b5cf6' },
    { label: 'Experience', value: Math.min(100, score + Math.floor(Math.random() * 15) - 5), color: '#f59e0b' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <ChartBarIcon className="w-4 h-4 text-teal-500" />
          Match Breakdown
        </span>
      </div>
      <MiniBarChart bars={bars} height={80} />
    </div>
  );
}

// Timeline component for tender stages
function TenderTimeline({ tender }: { tender: Tender }) {
  const events = useMemo(() => {
    const timeline = [];

    if (tender.publishedDate) {
      timeline.push({
        date: new Date(tender.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Published',
        isPast: true,
        isActive: false,
      });
    }

    // Current stage
    timeline.push({
      date: 'Now',
      label: tender.stage || 'Active',
      isPast: false,
      isActive: true,
    });

    if (tender.tenderEndDate) {
      const deadline = new Date(tender.tenderEndDate);
      const isPast = deadline < new Date();
      timeline.push({
        date: deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Deadline',
        isPast,
        isActive: false,
      });
    }

    return timeline.slice(0, 4);
  }, [tender]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
        Timeline
      </div>
      <MiniTimeline events={events} orientation="horizontal" />
    </div>
  );
}

// Activity metrics ring
function TenderActivityRing({ tender, matchScore }: { tender: Tender; matchScore: number | null }) {
  const rings = useMemo(() => {
    const match = matchScore || 0;
    // Simulate activity metrics
    const urgency = tender.tenderEndDate
      ? Math.max(0, 100 - Math.ceil((new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7)) * 10)
      : 50;
    const value = tender.valueMax
      ? Math.min(100, (tender.valueMax / 10000000) * 100)
      : 30;

    return [
      { value: match, maxValue: 100, color: '#14b8a6', label: 'Match' },
      { value: urgency, maxValue: 100, color: '#f59e0b', label: 'Urgency' },
      { value: value, maxValue: 100, color: '#8b5cf6', label: 'Value' },
    ];
  }, [tender, matchScore]);

  return <ActivityRing rings={rings} size={90} />;
}

// Market trend sparkline
function MarketTrend() {
  // Simulated market activity data
  const data = useMemo(() => {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 25);
  }, []);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
          <ArrowTrendingUpIcon className="w-3 h-3" />
          Market Activity
        </span>
        <span className="text-[10px] font-medium text-teal-600">+{Math.floor(Math.random() * 15) + 5}%</span>
      </div>
      <Sparkline data={data} width={100} height={20} color="#14b8a6" showDots />
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
    if (daysLeft <= 3 && daysLeft >= 0) insights.push({ type: 'warning', label: 'Urgent deadline' });
    else if (daysLeft <= 7 && daysLeft > 3) insights.push({ type: 'info', label: 'Closing soon' });
  }

  // Competition insights
  if (competitors.length === 0) insights.push({ type: 'opportunity', label: 'Low competition' });
  else if (competitors.length >= 5) insights.push({ type: 'warning', label: 'High competition' });

  // Value insights
  if (tender.valueMax && tender.valueMax >= 1000000) insights.push({ type: 'info', label: 'High value' });
  if (tender.valueMax && tender.valueMax >= 5000000) insights.push({ type: 'opportunity', label: 'Major contract' });

  // Sustainability
  if (tender.isSustainability) insights.push({ type: 'positive', label: 'Green tender' });

  return insights.slice(0, 4);
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
 * Large, visually rich tender card with charts, graphs, and interactive elements.
 * Features match gauges, sector breakdowns, timelines, and AI actions.
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
  const [showDetails, setShowDetails] = useState(false);

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

  // Fetch contextual image for this tender
  const { url: imageUrl, attribution, isLoading: imageLoading } = useTenderImage(
    tender.ocid,
    tender.title,
    tender.cpvCodes,
    tender.description
  );

  const insights = generateInsights(tender, matchScore ?? null, competitors, daysUntilDeadline);

  // Competition level
  const competitionLevel = competitors.length >= 5 ? 'high' : competitors.length >= 2 ? 'medium' : 'low';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Hero Image Section - Larger */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {imageLoading ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
        ) : (
          <Image
            src={imageUrl}
            alt={`${tender.title} - sector image`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Stage badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
              {tender.stage || 'Active'}
            </span>
            {isUrgent && (
              <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                <BoltIcon className="w-3 h-3" />
                {daysUntilDeadline}d left
              </span>
            )}
          </motion.div>

          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
            className={`p-2 rounded-full backdrop-blur-sm shadow-sm transition-colors ${
              isSaved ? 'bg-teal-500 text-white' : 'bg-white/90 text-gray-600 hover:text-teal-500'
            }`}
          >
            {isSaved ? (
              <StarIconSolid className="w-5 h-5" />
            ) : (
              <StarIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-4">
            {/* Sector badge */}
            <SectorIndicator
              cpvCodes={tender.cpvCodes}
              onClick={onSectorClick}
              size="md"
            />

            {/* Value badge */}
            <div className="flex flex-col items-end">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-gray-800 shadow-sm flex items-center gap-1">
                <CurrencyPoundIcon className="w-4 h-4 text-teal-500" />
                {valueDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Unsplash attribution */}
        {attribution && (
          <div className="absolute bottom-1 right-3 text-[8px] text-white/60">
            {attribution}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="p-5">
        {/* Title and Buyer */}
        <div className="mb-4">
          <Link href={`/tender/${tender.slug}`} className="block group">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 mb-2">
              {tender.title}
            </h3>
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[200px]">{tender.buyerName}</span>
            </div>
            {tender.region && (
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span>{tender.region}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {tender.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{tender.description}</p>
        )}

        {/* Insights chips */}
        {insights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {insights.map((insight, i) => (
              <InsightChip key={i} type={insight.type} label={insight.label} />
            ))}
          </div>
        )}

        {/* Visual Dashboard Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Left: Match Score */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
            <LargeMatchScore score={matchScore ?? null} loading={matchLoading} />
          </div>

          {/* Right: Activity Rings & Market Trend */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3">
            <TenderActivityRing tender={tender} matchScore={matchScore ?? null} />
            <MarketTrend />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100/50 mb-5">
          <TenderTimeline tender={tender} />
        </div>

        {/* Expandable Details Section */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          {showDetails ? 'Hide Details' : 'Show More Details'}
          <motion.span
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-5">
                {/* Match Breakdown */}
                {matchScore !== null && matchScore !== undefined && (
                  <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-xl border border-teal-100/50">
                    <EnhancedMatchBreakdown score={matchScore ?? null} />
                  </div>
                )}

                {/* Sector Breakdown */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100/50">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                    <TagIcon className="w-4 h-4 text-purple-500" />
                    Sector Breakdown
                  </div>
                  <SectorBreakdown cpvCodes={tender.cpvCodes} />
                </div>

                {/* Value Comparison */}
                {tender.valueMax && (
                  <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100/50">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                      <CurrencyPoundIcon className="w-4 h-4 text-amber-500" />
                      Value Comparison
                    </div>
                    <ValueComparison
                      value={tender.valueMax}
                      avgValue={tender.valueMax * 0.8}
                      minValue={0}
                      maxValue={tender.valueMax * 1.5}
                    />
                  </div>
                )}

                {/* Competition Analysis */}
                <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-xl border border-red-100/50">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                    <UserGroupIcon className="w-4 h-4 text-red-500" />
                    Competition Level
                  </div>
                  <CompetitionMeter level={competitionLevel} count={competitors.length} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Competitor Section */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <UserGroupIcon className="w-4 h-4 text-gray-500" />
            Competitor Intelligence
          </span>
          {incumbent && (
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Incumbent: {incumbent.name}
            </span>
          )}
        </div>
        <CompetitorPreview
          competitors={competitors}
          incumbent={incumbent}
          loading={competitorLoading}
        />
      </div>

      {/* Deadline Bar */}
      {daysUntilDeadline !== null && (
        <div
          className={`px-5 py-3 flex items-center justify-between ${
            isExpired
              ? 'bg-gray-100 text-gray-500'
              : isUrgent
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
              : 'bg-gradient-to-r from-teal-500 to-blue-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {isUrgent ? (
              <ExclamationTriangleIcon className="w-5 h-5" />
            ) : (
              <ClockIcon className="w-5 h-5" />
            )}
            {isExpired ? (
              <span className="font-medium">Deadline passed</span>
            ) : daysUntilDeadline === 0 ? (
              <span className="font-bold">Deadline today!</span>
            ) : daysUntilDeadline === 1 ? (
              <span className="font-medium">1 day remaining</span>
            ) : (
              <span className="font-medium">{daysUntilDeadline} days remaining</span>
            )}
          </div>
          <span className="text-sm opacity-90">
            {new Date(tender.tenderEndDate!).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <QuickActionButtons
          slug={tender.slug}
          isSaved={isSaved}
          onSave={onSave}
          onDismiss={onDismiss}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
          showLabels
        />
        <TenderAIButton tender={tender} matchScore={matchScore} />
      </div>

      {/* Published date footer */}
      <div className="px-5 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
          <DocumentTextIcon className="w-3 h-3" />
          Published {new Date(tender.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          {tender.ocid && <span className="mx-1">•</span>}
          {tender.ocid && <span className="font-mono">{tender.ocid.slice(-8)}</span>}
        </p>
      </div>
    </motion.article>
  );
}

/**
 * Skeleton loader for TenderCard - matching the larger layout.
 */
export function TenderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-full" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full" />
        <div className="absolute bottom-3 left-3 w-24 h-7 bg-gray-300 rounded-lg" />
        <div className="absolute bottom-3 right-3 w-20 h-7 bg-gray-300 rounded-lg" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="h-7 bg-gray-200 rounded w-4/5" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />

        {/* Insight chips skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-6 bg-gray-200 rounded-full w-28" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>

        {/* Charts grid skeleton */}
        <div className="grid grid-cols-2 gap-5">
          <div className="h-36 bg-gray-100 rounded-xl" />
          <div className="h-36 bg-gray-100 rounded-xl" />
        </div>

        {/* Timeline skeleton */}
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>

      {/* Competitor section skeleton */}
      <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-36 mb-3" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>

      {/* Deadline bar skeleton */}
      <div className="h-12 bg-gray-200" />

      {/* Actions skeleton */}
      <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
        <div className="h-9 bg-gray-200 rounded-lg w-20" />
        <div className="h-9 bg-gray-200 rounded-lg w-20" />
        <div className="h-9 bg-gray-200 rounded-lg w-24" />
        <div className="h-9 bg-gray-200 rounded-lg w-24 ml-auto" />
      </div>
    </div>
  );
}
