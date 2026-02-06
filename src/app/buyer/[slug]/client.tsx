'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CopilotKit, useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface Buyer {
  name: string;
  slug: string;
  id: string | null;
  region: string | null;
  totalTenders: number;
  activeTenders: number;
  totalValue: number;
}

interface Tender {
  ocid: string;
  slug: string;
  title: string;
  stage: string;
  status: string | null;
  valueMax: number | null;
  publishedDate: string;
  tenderEndDate: string | null;
  region: string | null;
}

interface Sector {
  name: string;
  count: number;
  value: number;
}

interface YearlyData {
  year: string;
  count: number;
  value: number;
}

interface BuyerData {
  buyer: {
    name: string;
    slug: string;
    id: string | null;
    primaryRegion: string | null;
    regions: string[];
    primarySector: string;
    imageSearch: string;
  };
  stats: {
    totalTenders: number;
    activeTenders: number;
    totalValue: number;
    avgValue: number;
    sectors: Sector[];
    yearlyTrend: YearlyData[];
  };
  tenders: Tender[];
}

// Sector to Unsplash image mapping
const sectorUnsplash: Record<string, string> = {
  'Construction': 'photo-1504307651254-35680f356dfd',
  'Software': 'photo-1518770660439-4636190af475',
  'IT Services': 'photo-1558494949-ef010cbdcc31',
  'Healthcare': 'photo-1519494026892-80bbd2d6fd0d',
  'Education': 'photo-1523050854058-8df90110c9f1',
  'Transport': 'photo-1494412574643-ff11b0a5c1c3',
  'Environment': 'photo-1473448912268-2022ce9509d8',
  'Engineering': 'photo-1581094794329-c8112a89af12',
  'Finance': 'photo-1486406146926-c627a92ad1ab',
  'Government': 'photo-1555848962-6e79363ec58f',
  'Utilities': 'photo-1473341304170-971dccb5ac1e',
  'R&D': 'photo-1532187863486-abf9dbad1b69',
  'Business Services': 'photo-1497366216548-37526070297c',
};

function formatValue(value: number): string {
  if (value >= 1000000000) return `£${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value.toLocaleString()}`;
}

const stageColors: Record<string, string> = {
  planning: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  tender: 'bg-green-500/20 text-green-300 border-green-500/30',
  award: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  contract: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

// Spending Trend Chart Component
function SpendingTrendChart({ data }: { data: YearlyData[] }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <ArrowTrendingUpIcon className="w-5 h-5 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">Procurement Trends</h3>
      </div>

      <div className="h-48 flex items-end gap-2">
        {data.map((item) => {
          const valueHeight = (item.value / maxValue) * 100;
          const countHeight = (item.count / maxCount) * 100;

          return (
            <div key={item.year} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-1 h-40">
                {/* Value bar */}
                <div
                  className="flex-1 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all hover:from-teal-500 hover:to-teal-300"
                  style={{ height: `${valueHeight}%` }}
                  title={`Value: ${formatValue(item.value)}`}
                />
                {/* Count bar */}
                <div
                  className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all hover:from-purple-500 hover:to-purple-300"
                  style={{ height: `${countHeight}%` }}
                  title={`Tenders: ${item.count}`}
                />
              </div>
              <span className="text-xs text-slate-400">{item.year}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-teal-500" />
          <span className="text-slate-400">Contract Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-slate-400">Tender Count</span>
        </div>
      </div>
    </div>
  );
}

// Sector Breakdown Donut Chart
function SectorDonutChart({ sectors }: { sectors: Sector[] }) {
  if (sectors.length === 0) return null;

  const total = sectors.reduce((sum, s) => sum + s.count, 0);
  const colors = [
    '#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316',
  ];

  let currentAngle = 0;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Sector Breakdown</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {sectors.slice(0, 6).map((sector, i) => {
              const percent = sector.count / total;
              const angle = percent * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

              const largeArc = angle > 180 ? 1 : 0;

              return (
                <path
                  key={sector.name}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
            {/* Center hole */}
            <circle cx="50" cy="50" r="25" fill="#1e293b" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {sectors.slice(0, 6).map((sector, i) => (
            <div key={sector.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-sm text-slate-300 truncate flex-1">{sector.name}</span>
              <span className="text-sm text-slate-500">{sector.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyerContent({ buyer, initialData }: { buyer: Buyer; initialData: BuyerData | null }) {
  const [data, setData] = useState<BuyerData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [filter, setFilter] = useState<'all' | 'active' | 'awarded'>('all');

  useEffect(() => {
    if (!initialData) {
      fetch(`/api/buyers/${buyer.slug}`)
        .then((res) => res.json())
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [buyer.slug, initialData]);

  // Make data available to CopilotKit
  useCopilotReadable({
    description: 'Information about this government buyer/organization',
    value: data ? {
      name: data.buyer.name,
      region: data.buyer.primaryRegion,
      totalTenders: data.stats.totalTenders,
      activeTenders: data.stats.activeTenders,
      totalValue: data.stats.totalValue,
      sectors: data.stats.sectors.map(s => s.name),
      recentTenders: data.tenders.slice(0, 5).map(t => ({
        title: t.title,
        stage: t.stage,
        value: t.valueMax,
      })),
    } : null,
  });

  // CopilotKit actions
  useCopilotAction({
    name: 'analyzeSpendingPatterns',
    description: 'Analyze the spending patterns and procurement trends of this organization',
    parameters: [],
    handler: async () => {
      if (!data) return 'No data available';
      const trend = data.stats.yearlyTrend;
      const latestYear = trend[trend.length - 1];
      const prevYear = trend[trend.length - 2];
      const growth = prevYear ? ((latestYear.value - prevYear.value) / prevYear.value * 100).toFixed(1) : 0;
      return `${data.buyer.name} has ${data.stats.totalTenders} total tenders worth ${formatValue(data.stats.totalValue)}. Year-over-year spending ${Number(growth) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(Number(growth))}%.`;
    },
  });

  useCopilotAction({
    name: 'findSimilarBuyers',
    description: 'Find other government organizations with similar procurement patterns',
    parameters: [],
    handler: async () => {
      if (!data) return 'No data available';
      return `Looking for organizations similar to ${data.buyer.name} in the ${data.buyer.primarySector} sector in ${data.buyer.primaryRegion || 'UK'}.`;
    },
  });

  const primarySector = data?.buyer.primarySector || 'Government';
  const heroImageId = sectorUnsplash[primarySector] || sectorUnsplash['Government'];

  const filteredTenders = data?.tenders.filter((t) => {
    if (filter === 'active') return t.stage === 'tender';
    if (filter === 'awarded') return t.stage === 'award' || t.stage === 'contract';
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero with Unsplash Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={`https://images.unsplash.com/${heroImageId}?w=1920&h=600&fit=crop&auto=format`}
          alt={`${buyer.name} - ${primarySector} sector`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />

        {/* Back navigation */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            All Tenders
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <BuildingOfficeIcon className="w-5 h-5 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">UK Government Organization</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {buyer.name}
            </h1>
            {buyer.region && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPinIcon className="w-4 h-4" />
                <span>{buyer.region}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <DocumentTextIcon className="w-4 h-4" />
              Total Tenders
            </div>
            <div className="text-2xl font-bold text-white">{buyer.totalTenders}</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CalendarIcon className="w-4 h-4" />
              Active Now
            </div>
            <div className="text-2xl font-bold text-green-400">{buyer.activeTenders}</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CurrencyPoundIcon className="w-4 h-4" />
              Total Value
            </div>
            <div className="text-2xl font-bold text-white">{formatValue(buyer.totalValue)}</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <ChartBarIcon className="w-4 h-4" />
              Avg Value
            </div>
            <div className="text-2xl font-bold text-white">
              {data ? formatValue(data.stats.avgValue) : '-'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-slate-800 rounded-xl" />
            <div className="h-48 bg-slate-800 rounded-xl" />
          </div>
        ) : data ? (
          <>
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SpendingTrendChart data={data.stats.yearlyTrend} />
              <SectorDonutChart sectors={data.stats.sectors} />
            </div>

            {/* Tenders list */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Procurement History
                </h2>
                <div className="flex gap-2">
                  {(['all', 'active', 'awarded'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        filter === f
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Awarded'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredTenders.slice(0, 20).map((tender) => (
                  <Link
                    key={tender.ocid}
                    href={`/tender/${tender.slug}`}
                    className="block p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate hover:text-teal-400">
                          {tender.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span>{new Date(tender.publishedDate).toLocaleDateString('en-GB')}</span>
                          {tender.region && <span>• {tender.region}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {tender.valueMax && (
                          <span className="text-sm text-slate-300">
                            {formatValue(tender.valueMax)}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${stageColors[tender.stage] || stageColors.contract}`}>
                          {tender.stage}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredTenders.length > 20 && (
                <div className="p-4 border-t border-slate-800 text-center">
                  <span className="text-sm text-slate-400">
                    Showing 20 of {filteredTenders.length} tenders
                  </span>
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-2xl p-8 border border-teal-500/20">
          <h2 className="text-2xl font-bold text-white mb-3">
            Win contracts from <strong>{buyer.name}</strong>
          </h2>
          <p className="text-slate-300 mb-6">
            Use RFP.quest to analyze requirements, identify gaps, and craft winning proposals for this buyer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
              Try RFP.quest Free
            </Link>
            <Link href="/dashboard?stage=tender" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
              View Open Tenders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuyerPageClient({ buyer }: { buyer: Buyer }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        labels={{
          title: 'Procurement Analyst',
          initial: `I can help you analyze ${buyer.name}:\n\n• Spending patterns and trends\n• Sector focus areas\n• Active opportunities\n• Similar buyers\n\nAsk me anything!`,
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
      >
        <BuyerContent buyer={buyer} initialData={null} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
