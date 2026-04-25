'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface QuickWin {
  title: string;
  slug: string;
  buyerName: string | null;
  valueMax: number | null;
  sector?: string;
}

interface QuickWinsProps {
  opportunities: QuickWin[];
  loading?: boolean;
}

function formatValue(value: number | null): string {
  if (!value) return 'TBC';
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`;
  return `£${value}`;
}

export function QuickWins({ opportunities, loading }: QuickWinsProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-200 rounded animate-pulse" />
          <div className="h-6 bg-green-200 rounded w-32 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-slate-800/60 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <RocketLaunchIcon className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-100">Quick Wins</h3>
        </div>
        <p className="text-slate-500 text-sm">No quick wins available right now</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RocketLaunchIcon className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-100">Quick Wins</h3>
        </div>
        <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
          Under £100k
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Smaller contracts ideal for building your track record
      </p>

      <div className="space-y-3">
        {opportunities.slice(0, 4).map((opp, index) => (
          <motion.div
            key={opp.slug}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Link
              href={`/tender/${opp.slug}`}
              className="block bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg p-4 hover:shadow-md transition-all group border-transparent hover:border-green-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                    <h4 className="font-medium text-slate-100 text-sm truncate group-hover:text-green-600 transition-colors">
                      {opp.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate pl-6">
                    {opp.buyerName || 'Government Buyer'}
                  </p>
                </div>
                {opp.valueMax && (
                  <span className="text-xs font-medium text-green-700 bg-green-900/20 px-2 py-1 rounded">
                    {formatValue(opp.valueMax)}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link
        href="#opportunities"
        className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-green-600 hover:text-green-700"
      >
        Find more quick wins
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
