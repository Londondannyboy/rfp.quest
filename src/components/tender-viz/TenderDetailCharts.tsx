'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyPoundIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
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

interface TenderData {
  valueMin: number | null;
  valueMax: number | null;
  cpvCodes: string[] | null;
  stage: string;
  publishedDate: string;
  tenderEndDate: string | null;
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  buyerName: string;
  region: string | null;
}

/**
 * Large match score gauge for tender detail page
 */
export function TenderMatchGauge({ score, size = 140 }: { score: number | null; size?: number }) {
  if (score === null) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl border-slate-700">
        <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
          <SparklesIcon className="w-12 h-12 text-slate-500" />
        </div>
        <p className="mt-4 text-sm text-slate-400 text-center">
          Complete your profile for personalized match scoring
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      <RadialGauge
        value={score}
        maxValue={100}
        size={size}
        thickness={12}
        label="Match"
        sublabel="Score"
      />
      <div className="mt-3 text-center">
        <p className={`text-sm font-medium ${
          score >= 70 ? 'text-blue-400' :
          score >= 40 ? 'text-amber-400' :
          'text-red-400'
        }`}>
          {score >= 70 ? 'Strong Match' : score >= 40 ? 'Moderate Match' : 'Low Match'}
        </p>
        <p className="text-xs text-slate-500 mt-1">Based on your company profile</p>
      </div>
    </motion.div>
  );
}

/**
 * Sector breakdown visualization for tender detail
 */
export function TenderSectorChart({ cpvCodes }: { cpvCodes: string[] | null }) {
  const segments = useMemo(() => {
    if (!cpvCodes || cpvCodes.length === 0) {
      return [{ label: 'General', value: 100, color: '#64748b' }];
    }

    const divisions: Record<string, number> = {};
    cpvCodes.forEach(code => {
      const div = code.slice(0, 2);
      divisions[div] = (divisions[div] || 0) + 1;
    });

    const colors = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e'];
    const divLabels: Record<string, string> = {
      '45': 'Construction',
      '71': 'Architecture & Engineering',
      '72': 'IT Services',
      '79': 'Business Services',
      '50': 'Repair & Maintenance',
      '33': 'Medical Equipment',
      '34': 'Transport Equipment',
      '48': 'Software Packages',
      '30': 'Office Equipment',
      '22': 'Printing',
      '60': 'Transport Services',
      '64': 'Telecommunications',
      '73': 'R&D Services',
      '80': 'Education',
      '85': 'Health Services',
      '90': 'Environmental Services',
    };

    return Object.entries(divisions).map(([div, count], i) => ({
      label: divLabels[div] || `Division ${div}`,
      value: count,
      color: colors[i % colors.length],
    }));
  }, [cpvCodes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <TagIcon className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-medium text-white">Sector Distribution</h3>
      </div>
      <div className="flex items-center gap-6">
        <MiniPieChart segments={segments} size={100} />
        <div className="flex-1 space-y-2">
          {segments.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm text-slate-300 truncate flex-1">{s.label}</span>
              <span className="text-sm text-slate-500">
                {Math.round((s.value / segments.reduce((a, b) => a + b.value, 0)) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Value comparison visualization
 */
export function TenderValueChart({
  valueMin,
  valueMax,
  averageMarketValue,
}: {
  valueMin: number | null;
  valueMax: number | null;
  averageMarketValue?: number;
}) {
  if (!valueMax) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <CurrencyPoundIcon className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-medium text-white">Value Analysis</h3>
        </div>
        <p className="text-sm text-slate-400">Contract value not disclosed</p>
      </motion.div>
    );
  }

  const avgValue = averageMarketValue || valueMax * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <CurrencyPoundIcon className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-medium text-white">Value Comparison</h3>
      </div>
      <ValueComparison
        value={valueMax}
        avgValue={avgValue}
        minValue={valueMin || 0}
        maxValue={valueMax * 1.5}
      />
      {valueMin && (
        <p className="text-xs text-slate-500 mt-3">
          Range: £{(valueMin / 1000000).toFixed(1)}M - £{(valueMax / 1000000).toFixed(1)}M
        </p>
      )}
    </motion.div>
  );
}

/**
 * Timeline visualization for tender stages
 */
export function TenderStageTimeline({ tender }: { tender: TenderData }) {
  const events = useMemo(() => {
    const timeline = [];
    const now = new Date();

    if (tender.publishedDate) {
      timeline.push({
        date: new Date(tender.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Published',
        isPast: new Date(tender.publishedDate) < now,
        isActive: false,
      });
    }

    // Current stage
    const stageLabels: Record<string, string> = {
      planning: 'Planning',
      tender: 'Open for Bids',
      award: 'Award Phase',
      contract: 'Contracted',
    };
    timeline.push({
      date: 'Current',
      label: stageLabels[tender.stage] || tender.stage,
      isPast: false,
      isActive: true,
    });

    if (tender.tenderEndDate) {
      const deadline = new Date(tender.tenderEndDate);
      timeline.push({
        date: deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Deadline',
        isPast: deadline < now,
        isActive: false,
      });
    }

    if (tender.contractStartDate) {
      timeline.push({
        date: new Date(tender.contractStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        label: 'Start',
        isPast: false,
        isActive: false,
      });
    }

    return timeline.slice(0, 4);
  }, [tender]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDaysIcon className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-medium text-white">Contract Timeline</h3>
      </div>
      <MiniTimeline events={events} orientation="horizontal" />
    </motion.div>
  );
}

/**
 * Activity rings showing multiple metrics
 */
export function TenderActivityMetrics({ tender, matchScore }: { tender: TenderData; matchScore: number | null }) {
  const rings = useMemo(() => {
    const match = matchScore || 0;

    // Calculate urgency based on deadline
    let urgency = 50;
    if (tender.tenderEndDate) {
      const daysLeft = Math.ceil(
        (new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      urgency = Math.max(0, Math.min(100, 100 - daysLeft * 3));
    }

    // Calculate value score (relative to 10M)
    const value = tender.valueMax
      ? Math.min(100, (tender.valueMax / 10000000) * 100)
      : 30;

    return [
      { value: match, maxValue: 100, color: '#14b8a6', label: 'Match' },
      { value: urgency, maxValue: 100, color: '#f59e0b', label: 'Urgency' },
      { value: value, maxValue: 100, color: '#8b5cf6', label: 'Value' },
    ];
  }, [tender, matchScore]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-medium text-white">Key Metrics</h3>
      </div>
      <div className="flex items-center justify-center">
        <ActivityRing rings={rings} size={120} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {rings.map((ring, i) => (
          <div key={i}>
            <div className="text-lg font-bold" style={{ color: ring.color }}>{ring.value}%</div>
            <div className="text-[10px] text-slate-500">{ring.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Market activity sparkline
 */
export function MarketActivityChart({ region }: { region?: string | null }) {
  // Simulated market activity data
  const data = useMemo(() => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 20);
  }, []);

  const trend = data[data.length - 1] > data[0] ? '+' : '';
  const trendValue = Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
          <h3 className="text-sm font-medium text-white">Market Activity</h3>
        </div>
        <span className={`text-sm font-medium ${trendValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend}{trendValue}%
        </span>
      </div>
      <Sparkline data={data} width={200} height={40} color="#22c55e" showDots />
      <p className="text-xs text-slate-500 mt-3">
        {region ? `${region} region` : 'UK'} tender activity (12 months)
      </p>
    </motion.div>
  );
}

/**
 * Competition level meter
 */
export function TenderCompetitionChart({ competitorCount }: { competitorCount: number }) {
  const level = competitorCount >= 5 ? 'high' : competitorCount >= 2 ? 'medium' : 'low';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <UserGroupIcon className="w-5 h-5 text-red-400" />
        <h3 className="text-sm font-medium text-white">Competition Level</h3>
      </div>
      <CompetitionMeter level={level} count={competitorCount} />
      <p className="text-xs text-slate-500 mt-3">
        {level === 'low' ? 'Low competition - good opportunity' :
         level === 'medium' ? 'Moderate competition' :
         'High competition - strong proposal needed'}
      </p>
    </motion.div>
  );
}

/**
 * Match breakdown bar chart
 */
export function MatchBreakdownChart({ matchScore }: { matchScore: number | null }) {
  if (matchScore === null) return null;

  // Simulated breakdown - in real app this comes from API
  const bars = useMemo(() => [
    { label: 'Sector Match', value: Math.min(100, matchScore + Math.floor(Math.random() * 20) - 10), color: '#14b8a6' },
    { label: 'Company Size', value: Math.min(100, matchScore + Math.floor(Math.random() * 20) - 10), color: '#3b82f6' },
    { label: 'Location', value: Math.min(100, matchScore + Math.floor(Math.random() * 20) - 10), color: '#8b5cf6' },
    { label: 'Experience', value: Math.min(100, matchScore + Math.floor(Math.random() * 20) - 10), color: '#f59e0b' },
    { label: 'Certifications', value: Math.min(100, matchScore + Math.floor(Math.random() * 20) - 10), color: '#22c55e' },
  ], [matchScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-5 border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-medium text-white">Match Breakdown</h3>
      </div>
      <MiniBarChart bars={bars} height={120} />
    </motion.div>
  );
}

/**
 * Full dashboard of charts for tender detail page
 */
export function TenderDetailDashboard({
  tender,
  matchScore,
  competitorCount = 0,
}: {
  tender: TenderData;
  matchScore: number | null;
  competitorCount?: number;
}) {
  return (
    <div className="space-y-6">
      {/* Primary metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TenderActivityMetrics tender={tender} matchScore={matchScore} />
        <TenderSectorChart cpvCodes={tender.cpvCodes} />
      </div>

      {/* Timeline */}
      <TenderStageTimeline tender={tender} />

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TenderValueChart valueMin={tender.valueMin} valueMax={tender.valueMax} />
        <MarketActivityChart region={tender.region} />
      </div>

      {/* Match and competition */}
      {matchScore !== null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchBreakdownChart matchScore={matchScore} />
          <TenderCompetitionChart competitorCount={competitorCount} />
        </div>
      )}
    </div>
  );
}
