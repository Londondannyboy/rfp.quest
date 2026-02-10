'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CurrencyPoundIcon,
  TagIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { KPICard } from './KPICard';
import { SectorPieChart } from '@/components/charts/SectorPieChart';
import { ValueHistogram } from '@/components/charts/ValueHistogram';
import { DeadlineTimeline } from '@/components/charts/DeadlineTimeline';
import { HotOpportunities } from '@/components/charts/HotOpportunities';
import { QuickWins } from '@/components/charts/QuickWins';
import type { DashboardStats } from '@/app/api/dashboard-stats/route';

// Animated gradient background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.4), transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Floating particles effect */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-teal-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Loading skeleton for the entire hero
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero banner skeleton */}
      <div className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
            <div className="h-60 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface DashboardHeroProps {
  onSectorClick?: (division: string, sectorName: string) => void;
  onValueClick?: (minValue: number, maxValue: number, label: string) => void;
}

export function DashboardHero({ onSectorClick, onValueClick }: DashboardHeroProps) {
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
    return <LoadingSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Failed to load dashboard stats: {error}</p>
      </div>
    );
  }

  // Format currency for display
  const formatValue = (value: number) => {
    if (value >= 1000000000) return `£${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`;
    return `£${value}`;
  };

  // Calculate total market value (rough estimate based on average * count)
  const estimatedMarketValue = stats.totalOpportunities * stats.averageValue;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <AnimatedBackground />

        <div className="relative z-10 p-8 md:p-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-5 h-5 text-teal-400" />
                <span className="text-teal-400 text-sm font-medium uppercase tracking-wide">
                  Live Market Pulse
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {stats.totalOpportunities.toLocaleString()} Open Tenders
              </h1>
              <p className="text-slate-300 text-lg mb-6">
                Worth an estimated{' '}
                <span className="text-teal-400 font-semibold">
                  {formatValue(estimatedMarketValue)}
                </span>
                {' '}in government contracts
              </p>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400 uppercase">Urgent</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.upcomingDeadlines.filter(d => d.daysRemaining <= 7).length}
                </p>
                <p className="text-xs text-slate-400">Closing This Week</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-slate-400 uppercase">Avg Value</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatValue(stats.averageValue)}
                </p>
                <p className="text-xs text-slate-400">Per Contract</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <TagIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-400 uppercase">Top Sector</span>
                </div>
                <p className="text-xl font-bold text-white truncate">
                  {stats.topSector?.name || 'Various'}
                </p>
                <p className="text-xs text-slate-400">{stats.topSector?.count || 0} tenders</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-lg transition-colors"
              >
                <SparklesIcon className="w-4 h-4" />
                Get Personalized Matches
              </Link>
              <Link
                href="#opportunities"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
                Browse All Tenders
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Action Cards - Hot Opportunities & Quick Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotOpportunities opportunities={stats.hotOpportunities} />
        <QuickWins opportunities={stats.quickWins} />
      </div>

      {/* KPI Cards - Animated Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <KPICard
          title="Live Opportunities"
          value={stats.totalOpportunities}
          icon={BriefcaseIcon}
          color="teal"
          delay={0}
        />
        <KPICard
          title="Closing This Week"
          value={stats.upcomingDeadlines.filter(d => d.daysRemaining <= 7).length}
          icon={CalendarDaysIcon}
          color="amber"
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
          value={stats.topSector?.count || stats.totalOpportunities}
          suffix=" tenders"
          icon={TagIcon}
          color="blue"
          delay={0.3}
        />
      </motion.div>

      {/* Charts Section Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">Market Insights</h2>
          <p className="text-gray-500 text-sm">
            Where the opportunities are
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Updated {new Date(stats.lastUpdated).toLocaleTimeString()}
        </p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorPieChart
          data={stats.sectorBreakdown}
          onSectorClick={onSectorClick}
        />
        <ValueHistogram
          data={stats.valueDistribution}
          onValueClick={onValueClick}
        />
        <DeadlineTimeline data={stats.upcomingDeadlines} />
      </div>
    </motion.div>
  );
}
