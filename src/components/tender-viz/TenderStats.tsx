'use client';

import {
  DocumentTextIcon,
  CurrencyPoundIcon,
  ClockIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface StatItem {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: 'document' | 'currency' | 'clock' | 'users' | 'building' | 'chart';
}

interface TenderStatsProps {
  stats: StatItem[];
  layout?: 'grid' | 'row';
  title?: string;
  subtitle?: string;
}

const iconMap = {
  document: DocumentTextIcon,
  currency: CurrencyPoundIcon,
  clock: ClockIcon,
  users: UsersIcon,
  building: BuildingOfficeIcon,
  chart: ChartBarIcon,
};

function TrendIndicator({ trend, value }: { trend: 'up' | 'down' | 'neutral'; value?: string }) {
  if (trend === 'neutral' || !value) return null;

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${
      trend === 'up' ? 'text-green-400' : 'text-red-400'
    }`}>
      {trend === 'up' ? (
        <ArrowTrendingUpIcon className="w-3 h-3" />
      ) : (
        <ArrowTrendingDownIcon className="w-3 h-3" />
      )}
      {value}
    </div>
  );
}

function StatCard({ stat, compact }: { stat: StatItem; compact?: boolean }) {
  const Icon = stat.icon ? iconMap[stat.icon] : ChartBarIcon;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">{stat.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{stat.value}</span>
          {stat.trend && <TrendIndicator trend={stat.trend} value={stat.trendValue} />}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-slate-700/50 rounded-lg">
          <Icon className="w-5 h-5 text-teal-400" />
        </div>
        {stat.trend && <TrendIndicator trend={stat.trend} value={stat.trendValue} />}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-white">{stat.value}</div>
        <div className="text-sm text-slate-400 mt-0.5">{stat.label}</div>
        {stat.subtext && (
          <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>
        )}
      </div>
    </div>
  );
}

export function TenderStats({ stats, layout = 'grid', title, subtitle }: TenderStatsProps) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      {(title || subtitle) && (
        <div className="p-6 border-b border-slate-800">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Stats */}
      <div className={`p-6 ${layout === 'grid' ? '' : 'space-y-2'}`}>
        {layout === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>
        ) : (
          stats.map((stat, i) => (
            <StatCard key={i} stat={stat} compact />
          ))
        )}
      </div>
    </div>
  );
}

// Preset configurations for common stat displays
export function TenderQuickStats({
  value,
  deadline,
  lots,
  bidders,
  duration,
}: {
  value?: string;
  deadline?: string;
  lots?: number;
  bidders?: number;
  duration?: string;
}) {
  const stats: StatItem[] = [];

  if (value) {
    stats.push({ label: 'Contract Value', value, icon: 'currency' });
  }
  if (deadline) {
    stats.push({ label: 'Time Remaining', value: deadline, icon: 'clock' });
  }
  if (lots) {
    stats.push({ label: 'Lots', value: lots, icon: 'document' });
  }
  if (bidders !== undefined) {
    stats.push({ label: 'Expected Bidders', value: bidders, icon: 'users' });
  }
  if (duration) {
    stats.push({ label: 'Contract Duration', value: duration, icon: 'clock' });
  }

  return <TenderStats stats={stats} layout="grid" />;
}

// Market position stats
export function MarketPositionStats({
  marketShare,
  competitorCount,
  winRate,
  averageBidValue,
}: {
  marketShare?: string;
  competitorCount?: number;
  winRate?: string;
  averageBidValue?: string;
}) {
  const stats: StatItem[] = [];

  if (marketShare) {
    stats.push({
      label: 'Your Market Share',
      value: marketShare,
      icon: 'chart',
      trend: 'up',
      trendValue: '+2.3%',
    });
  }
  if (competitorCount !== undefined) {
    stats.push({
      label: 'Known Competitors',
      value: competitorCount,
      icon: 'building',
    });
  }
  if (winRate) {
    stats.push({
      label: 'Win Rate',
      value: winRate,
      icon: 'chart',
      trend: 'up',
      trendValue: '+5%',
    });
  }
  if (averageBidValue) {
    stats.push({
      label: 'Avg Bid Value',
      value: averageBidValue,
      icon: 'currency',
    });
  }

  return (
    <TenderStats
      stats={stats}
      layout="grid"
      title="Market Position"
      subtitle="Your competitive standing in this sector"
    />
  );
}
