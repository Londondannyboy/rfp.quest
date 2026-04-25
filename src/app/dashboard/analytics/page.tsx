'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  SectorPieChart,
  ValueHistogram,
  RegionalBarChart,
  DeadlineTimeline,
} from '@/components/charts';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

// Dynamic import for 3D scene (no SSR)
const GlobeScene = dynamic(
  () => import('@/components/three/GlobeScene').then((mod) => mod.GlobeScene),
  { ssr: false, loading: () => <GlobeLoadingFallback /> }
);

function GlobeLoadingFallback() {
  return (
    <div className="w-full h-64 bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard-stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border-red-200 rounded-xl p-6">
          <p className="text-red-600">Failed to load analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400">
          Explore tender market insights and trends
        </p>
      </motion.div>

      {/* Globe + Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlobeScene />
        </div>
        <div className="lg:col-span-2">
          <SectorPieChart
            data={stats?.sectorBreakdown || []}
            loading={loading}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ValueHistogram
          data={stats?.valueDistribution || []}
          loading={loading}
        />
        <RegionalBarChart
          data={stats?.regionalDistribution || []}
          loading={loading}
        />
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeadlineTimeline
          data={stats?.upcomingDeadlines || []}
          loading={loading}
        />

        {/* Summary Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl p-6 shadow-sm border-slate-700/40"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            Market Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Opportunities</span>
              <span className="font-semibold text-slate-100">
                {stats?.totalOpportunities?.toLocaleString() || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Average Contract Value</span>
              <span className="font-semibold text-slate-100">
                {stats?.averageValue
                  ? `£${(stats.averageValue / 1000).toFixed(0)}k`
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Your Match Rate</span>
              <span className="font-semibold text-blue-400">
                {stats?.matchedPercentage || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Top Sector</span>
              <span className="font-semibold text-slate-100">
                {stats?.topSector?.name || '-'}
              </span>
            </div>
          </div>
          {stats?.lastUpdated && (
            <p className="text-xs text-slate-400 mt-4">
              Last updated: {new Date(stats.lastUpdated).toLocaleString('en-GB')}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
