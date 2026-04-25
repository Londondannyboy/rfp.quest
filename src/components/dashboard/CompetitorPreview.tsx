'use client';

import { motion } from 'framer-motion';
import { UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline';

export interface Competitor {
  name: string;
  confidence?: number;
}

export interface Incumbent {
  name: string;
  contractPeriod?: string;
}

interface CompetitorPreviewProps {
  competitors: Competitor[];
  incumbent?: Incumbent | null;
  loading?: boolean;
  maxDisplay?: number;
}

/**
 * Shows a preview of competitors and incumbent for a tender.
 * Displays top N competitors with a "+X more" badge.
 */
export function CompetitorPreview({
  competitors,
  incumbent,
  loading = false,
  maxDisplay = 3,
}: CompetitorPreviewProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-slate-600/50 border-t-teal-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Researching competitors...</span>
      </div>
    );
  }

  const hasCompetitors = competitors.length > 0;
  const hasIncumbent = incumbent !== null && incumbent !== undefined;
  const displayedCompetitors = competitors.slice(0, maxDisplay);
  const remainingCount = competitors.length - maxDisplay;

  if (!hasCompetitors && !hasIncumbent) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <UserGroupIcon className="w-4 h-4" />
        <span className="text-xs">No competitor data available</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Competitors row */}
      {hasCompetitors && (
        <div className="flex items-center gap-2 flex-wrap">
          <UserGroupIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {displayedCompetitors.map((competitor, index) => (
            <motion.span
              key={competitor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="inline-flex items-center px-2 py-0.5 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-800/60 rounded-full text-xs text-slate-200 transition-colors cursor-default"
              title={
                competitor.confidence
                  ? `${competitor.confidence}% confidence`
                  : undefined
              }
            >
              {competitor.name}
            </motion.span>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs text-slate-400">+{remainingCount} more</span>
          )}
        </div>
      )}

      {/* Incumbent row */}
      {hasIncumbent && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <TrophyIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="inline-flex items-center px-2 py-0.5 bg-amber-900/20 border-amber-200 rounded-full text-xs text-amber-700">
            <span className="font-medium">{incumbent.name}</span>
            {incumbent.contractPeriod && (
              <span className="ml-1 text-amber-500">
                ({incumbent.contractPeriod})
              </span>
            )}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Compact inline version for space-constrained layouts.
 */
export function CompetitorBadge({
  count,
  incumbentName,
}: {
  count: number;
  incumbentName?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {count > 0 && (
        <span className="inline-flex items-center gap-1 text-slate-500">
          <UserGroupIcon className="w-3.5 h-3.5" />
          {count} competitor{count !== 1 ? 's' : ''}
        </span>
      )}
      {incumbentName && (
        <span className="inline-flex items-center gap-1 text-amber-600">
          <TrophyIcon className="w-3.5 h-3.5" />
          {incumbentName}
        </span>
      )}
    </div>
  );
}
