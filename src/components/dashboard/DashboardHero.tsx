'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyPoundIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { KPICard } from './KPICard';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

export function DashboardHero() {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Your personalized tender opportunities at a glance
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Live Opportunities"
          value={stats.totalOpportunities}
          icon={BriefcaseIcon}
          color="teal"
          delay={0}
        />
        <KPICard
          title="Match Rate"
          value={stats.matchedPercentage}
          suffix="%"
          icon={ChartBarIcon}
          color="blue"
          delay={0.1}
        />
        <KPICard
          title="Average Value"
          value={stats.averageValue}
          prefix="£"
          icon={CurrencyPoundIcon}
          color="purple"
          delay={0.2}
          formatLarge
        />
        <KPICard
          title={stats.topSector?.name || 'Top Sector'}
          value={stats.topSector?.count || 0}
          suffix=" tenders"
          icon={TagIcon}
          color="amber"
          delay={0.3}
        />
      </div>
    </motion.div>
  );
}
