'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FireIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface HotOpportunity {
  title: string;
  slug: string;
  buyerName: string | null;
  valueMax: number | null;
  daysRemaining: number;
  sector?: string;
}

interface HotOpportunitiesProps {
  opportunities: HotOpportunity[];
  loading?: boolean;
}

function formatValue(value: number | null): string {
  if (!value) return 'TBC';
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`;
  return `£${value}`;
}

function getUrgencyBadge(days: number) {
  if (days <= 3) return { text: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' };
  if (days <= 7) return { text: 'This Week', color: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { text: `${days} days`, color: 'bg-green-100 text-green-700 border-green-200' };
}

export function HotOpportunities({ opportunities, loading }: HotOpportunitiesProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-200 rounded animate-pulse" />
          <div className="h-6 bg-orange-200 rounded w-40 animate-pulse" />
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
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <FireIcon className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-slate-100">Hot Opportunities</h3>
        </div>
        <p className="text-slate-500 text-sm">No urgent opportunities right now</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-orange-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FireIcon className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-slate-100">Hot Opportunities</h3>
        </div>
        <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full">
          Closing Soon
        </span>
      </div>

      <div className="space-y-3">
        {opportunities.slice(0, 4).map((opp, index) => {
          const urgency = getUrgencyBadge(opp.daysRemaining);
          return (
            <motion.div
              key={opp.slug}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/tender/${opp.slug}`}
                className="block bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg p-4 hover:shadow-md transition-all group border-transparent hover:border-orange-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-100 text-sm truncate group-hover:text-orange-600 transition-colors">
                      {opp.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {opp.buyerName || 'Government Buyer'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${urgency.color}`}>
                      {urgency.text}
                    </span>
                    {opp.valueMax && (
                      <span className="text-xs font-medium text-slate-200">
                        {formatValue(opp.valueMax)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <Link
        href="#opportunities"
        className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        View all opportunities
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
