'use client';

import { motion } from 'framer-motion';

/**
 * Inline mini-charts for tender rows
 */

// Mini circular gauge for match score
export function MiniMatchGauge({ score, size = 32 }: { score: number | null; size?: number }) {
  if (score === null) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900/40 backdrop-blur-xl rounded-full text-[10px] text-slate-400"
        style={{ width: size, height: size }}
      >
        —
      </div>
    );
  }

  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#ef4444'; // red
  if (score >= 75) color = '#22c55e'; // green
  else if (score >= 50) color = '#eab308'; // yellow
  else if (score >= 25) color = '#f97316'; // orange

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

// Deadline countdown bar
export function DeadlineBar({ daysLeft }: { daysLeft: number | null }) {
  if (daysLeft === null) {
    return <span className="text-xs text-slate-400">No deadline</span>;
  }

  const isExpired = daysLeft < 0;
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isNear = daysLeft <= 14 && daysLeft > 7;

  // Calculate bar width (max 30 days = 100%)
  const maxDays = 30;
  const percentage = Math.max(0, Math.min(100, (daysLeft / maxDays) * 100));

  let barColor = 'bg-blue-900/200';
  let textColor = 'text-slate-300';
  if (isExpired) {
    barColor = 'bg-slate-700/70';
    textColor = 'text-slate-400';
  } else if (isUrgent) {
    barColor = 'bg-red-900/200';
    textColor = 'text-red-600 font-semibold';
  } else if (isNear) {
    barColor = 'bg-yellow-500';
    textColor = 'text-yellow-700';
  }

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className={`text-xs whitespace-nowrap ${textColor}`}>
        {isExpired ? 'Expired' : daysLeft === 0 ? 'Today!' : `${daysLeft}d`}
      </span>
    </div>
  );
}

// Value comparison indicator
export function ValueIndicator({
  value,
  avgValue,
  showComparison = true
}: {
  value: number | null;
  avgValue?: number;
  showComparison?: boolean;
}) {
  if (value === null) {
    return <span className="text-xs text-slate-400">TBC</span>;
  }

  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `£${(v / 1_000).toFixed(0)}k`;
    return `£${v.toLocaleString()}`;
  };

  // Compare to average if provided
  let comparison = null;
  if (showComparison && avgValue && avgValue > 0) {
    const ratio = value / avgValue;
    if (ratio >= 1.5) {
      comparison = { icon: '▲', color: 'text-green-600', label: 'High' };
    } else if (ratio <= 0.5) {
      comparison = { icon: '▼', color: 'text-orange-500', label: 'Low' };
    }
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-medium text-slate-100">{formatValue(value)}</span>
      {comparison && (
        <span className={`text-[10px] ${comparison.color}`} title={comparison.label}>
          {comparison.icon}
        </span>
      )}
    </div>
  );
}

// Competitor count badge
export function CompetitorBadge({
  count,
  incumbentName,
  loading = false
}: {
  count: number;
  incumbentName?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 border-slate-600/50 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {count > 0 && (
        <span className="inline-flex items-center px-1.5 py-0.5 bg-slate-900/40 backdrop-blur-xl rounded text-[10px] text-slate-300">
          {count} bidder{count !== 1 ? 's' : ''}
        </span>
      )}
      {incumbentName && (
        <span className="inline-flex items-center px-1.5 py-0.5 bg-amber-900/20 border-amber-200 rounded text-[10px] text-amber-700">
          ★ {incumbentName}
        </span>
      )}
      {count === 0 && !incumbentName && (
        <span className="text-[10px] text-slate-400">—</span>
      )}
    </div>
  );
}

// AI Insight Chip
export function InsightChip({
  type,
  label,
}: {
  type: 'positive' | 'warning' | 'neutral' | 'opportunity';
  label: string;
}) {
  const styles = {
    positive: 'bg-blue-600/20 text-green-400 border border-blue-500/30 border-blue-200',
    warning: 'bg-red-900/20 text-red-700 border-red-200',
    neutral: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-300 border-slate-700/50',
    opportunity: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const icons = {
    positive: '✓',
    warning: '!',
    neutral: '•',
    opportunity: '★',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium ${styles[type]}`}
    >
      <span>{icons[type]}</span>
      {label}
    </motion.span>
  );
}

// Generate AI insights based on tender data
export function getInsights(tender: {
  matchScore?: number | null;
  daysLeft?: number | null;
  competitorCount?: number;
  value?: number | null;
  isSustainability?: boolean;
}): Array<{ type: 'positive' | 'warning' | 'neutral' | 'opportunity'; label: string }> {
  const insights: Array<{ type: 'positive' | 'warning' | 'neutral' | 'opportunity'; label: string }> = [];

  // Match score insights
  if (tender.matchScore !== null && tender.matchScore !== undefined) {
    if (tender.matchScore >= 80) {
      insights.push({ type: 'positive', label: 'Strong match' });
    } else if (tender.matchScore >= 60) {
      insights.push({ type: 'neutral', label: 'Good fit' });
    } else if (tender.matchScore < 40) {
      insights.push({ type: 'warning', label: 'Low match' });
    }
  }

  // Deadline insights
  if (tender.daysLeft !== null && tender.daysLeft !== undefined) {
    if (tender.daysLeft <= 3 && tender.daysLeft >= 0) {
      insights.push({ type: 'warning', label: 'Urgent' });
    } else if (tender.daysLeft <= 7 && tender.daysLeft > 3) {
      insights.push({ type: 'neutral', label: 'Closing soon' });
    }
  }

  // Competition insights
  if (tender.competitorCount !== undefined) {
    if (tender.competitorCount === 0) {
      insights.push({ type: 'opportunity', label: 'Low competition' });
    } else if (tender.competitorCount >= 5) {
      insights.push({ type: 'warning', label: 'High competition' });
    }
  }

  // Sustainability
  if (tender.isSustainability) {
    insights.push({ type: 'positive', label: 'Green tender' });
  }

  return insights.slice(0, 3); // Max 3 insights
}
