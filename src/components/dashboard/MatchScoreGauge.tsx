'use client';

import { motion } from 'framer-motion';

interface MatchScoreGaugeProps {
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * Compact circular gauge showing match score percentage.
 * Adapted from MatchAnalysisCard's ScoreGauge.
 */
export function MatchScoreGauge({
  score,
  size = 'md',
  loading = false,
}: MatchScoreGaugeProps) {
  const sizes = {
    sm: { width: 48, radius: 18, stroke: 4, fontSize: 'text-sm' },
    md: { width: 64, radius: 24, stroke: 5, fontSize: 'text-lg' },
    lg: { width: 80, radius: 30, stroke: 6, fontSize: 'text-xl' },
  };

  const config = sizes[size];
  const circumference = 2 * Math.PI * config.radius;
  const displayScore = score ?? 0;
  const offset = circumference - (displayScore / 100) * circumference;

  // Color based on score
  let colorClass = 'text-gray-400';
  if (score !== null) {
    if (score >= 75) {
      colorClass = 'text-green-500';
    } else if (score >= 50) {
      colorClass = 'text-yellow-500';
    } else if (score >= 25) {
      colorClass = 'text-orange-500';
    } else {
      colorClass = 'text-red-500';
    }
  }

  if (loading) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: config.width, height: config.width }}
      >
        <motion.div
          className={`w-full h-full rounded-full border-${config.stroke} border-gray-200 border-t-teal-500`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ borderWidth: config.stroke }}
        />
      </div>
    );
  }

  if (score === null) {
    return (
      <div
        className="relative flex items-center justify-center bg-gray-100 rounded-full"
        style={{ width: config.width, height: config.width }}
      >
        <span className="text-xs text-gray-400">N/A</span>
      </div>
    );
  }

  return (
    <div
      className="relative"
      style={{ width: config.width, height: config.width }}
    >
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={config.radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`font-bold ${config.fontSize} ${colorClass}`}
        >
          {displayScore}
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Inline badge version of match score for compact displays.
 */
export function MatchScoreBadge({
  score,
  loading = false,
}: {
  score: number | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-400">
        <span className="w-3 h-3 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
        <span>...</span>
      </span>
    );
  }

  if (score === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-400">
        No score
      </span>
    );
  }

  let bgClass = 'bg-gray-100 text-gray-600';
  if (score >= 75) {
    bgClass = 'bg-green-100 text-green-700';
  } else if (score >= 50) {
    bgClass = 'bg-yellow-100 text-yellow-700';
  } else if (score >= 25) {
    bgClass = 'bg-orange-100 text-orange-700';
  } else {
    bgClass = 'bg-red-100 text-red-700';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bgClass}`}
    >
      {score}% Match
    </span>
  );
}
