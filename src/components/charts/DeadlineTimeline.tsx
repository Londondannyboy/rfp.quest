'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface DeadlineItem {
  title: string;
  ocid: string;
  slug: string;
  deadline: string;
  daysRemaining: number;
  buyerName: string | null;
}

interface DeadlineTimelineProps {
  data: DeadlineItem[];
  loading?: boolean;
}

function getUrgencyColor(days: number): string {
  if (days <= 7) return 'bg-red-500';
  if (days <= 14) return 'bg-amber-500';
  return 'bg-green-500';
}

function getUrgencyBadgeColor(days: number): string {
  if (days <= 7) return 'bg-red-100 text-red-700';
  if (days <= 14) return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
}

export function DeadlineTimeline({ data, loading }: DeadlineTimelineProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="w-3 h-3 bg-gray-200 rounded-full mt-2" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 flex items-center justify-center">
        <p className="text-gray-500">No upcoming deadlines</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">
          Upcoming Deadlines
        </h3>
      </div>

      <div className="space-y-4">
        {data.slice(0, 5).map((item, index) => (
          <motion.div
            key={item.ocid}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="relative"
          >
            <Link
              href={`/tender/${item.slug}`}
              className="flex items-start gap-4 group"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${getUrgencyColor(
                    item.daysRemaining
                  )}`}
                />
                {index < data.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadgeColor(
                      item.daysRemaining
                    )}`}
                  >
                    {item.daysRemaining === 1
                      ? '1 day'
                      : `${item.daysRemaining} days`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {item.buyerName || 'Unknown buyer'} &middot;{' '}
                  {new Date(item.deadline).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <ArrowRightIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
