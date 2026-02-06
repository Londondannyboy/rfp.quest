'use client';

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  CurrencyPoundIcon,
} from '@heroicons/react/24/outline';

interface ValueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface MarketComparison {
  metric: string;
  thisValue: number;
  marketAverage: number;
  trend: 'above' | 'below' | 'average';
}

interface ValueAnalysisProps {
  valueMin?: number | null;
  valueMax?: number | null;
  currency?: string;
  breakdown?: ValueBreakdown[];
  comparisons?: MarketComparison[];
  duration?: number; // months
  priceModel?: 'fixed' | 'variable' | 'framework' | 'lot-based';
}

function formatCurrency(value: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value);
}

const priceModelLabels: Record<string, { label: string; description: string }> = {
  fixed: { label: 'Fixed Price', description: 'Single contract value agreed upfront' },
  variable: { label: 'Variable', description: 'Value depends on actual usage/delivery' },
  framework: { label: 'Framework', description: 'Maximum value across multiple call-offs' },
  'lot-based': { label: 'Lot-Based', description: 'Divided into separately awarded lots' },
};

function TrendIcon({ trend }: { trend: 'above' | 'below' | 'average' }) {
  switch (trend) {
    case 'above':
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    case 'below':
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    default:
      return <MinusIcon className="w-4 h-4 text-slate-500" />;
  }
}

export function ValueAnalysis({
  valueMin,
  valueMax,
  currency = 'GBP',
  breakdown,
  comparisons,
  duration,
  priceModel,
}: ValueAnalysisProps) {
  const hasRange = valueMin && valueMax && valueMin !== valueMax;
  const displayValue = valueMax || valueMin;
  const monthlyValue = displayValue && duration ? displayValue / duration : null;

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header with main value */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Contract Value</h3>
            {priceModel && (
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded">
                  {priceModelLabels[priceModel]?.label || priceModel}
                </span>
                <span className="text-xs text-slate-500">
                  {priceModelLabels[priceModel]?.description}
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl">
            <CurrencyPoundIcon className="w-6 h-6 text-teal-400" />
          </div>
        </div>

        {/* Main value display */}
        <div className="mt-4">
          {displayValue ? (
            <>
              <div className="text-4xl font-bold text-white">
                {hasRange ? (
                  <>
                    {formatCompact(valueMin!, currency)} - {formatCompact(valueMax!, currency)}
                  </>
                ) : (
                  formatCurrency(displayValue, currency)
                )}
              </div>
              {duration && monthlyValue && (
                <div className="text-sm text-slate-400 mt-2">
                  ≈ {formatCompact(monthlyValue, currency)}/month over {duration} months
                </div>
              )}
            </>
          ) : (
            <div className="text-2xl font-medium text-slate-400">
              Value not disclosed
            </div>
          )}
        </div>
      </div>

      {/* Value breakdown */}
      {breakdown && breakdown.length > 0 && (
        <div className="p-6 border-b border-slate-800">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Value Breakdown</h4>
          <div className="space-y-3">
            {breakdown.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{item.category}</span>
                  <span className="text-sm font-medium text-white">
                    {formatCompact(item.amount, currency)}
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market comparison */}
      {comparisons && comparisons.length > 0 && (
        <div className="p-6">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Market Comparison</h4>
          <div className="space-y-4">
            {comparisons.map((comparison, i) => {
              const difference = ((comparison.thisValue - comparison.marketAverage) / comparison.marketAverage) * 100;

              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendIcon trend={comparison.trend} />
                    <div>
                      <div className="text-sm text-white">{comparison.metric}</div>
                      <div className="text-xs text-slate-500">
                        Market avg: {formatCompact(comparison.marketAverage, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {formatCompact(comparison.thisValue, currency)}
                    </div>
                    <div className={`text-xs font-medium ${
                      comparison.trend === 'above' ? 'text-green-400' :
                      comparison.trend === 'below' ? 'text-red-400' :
                      'text-slate-400'
                    }`}>
                      {difference > 0 ? '+' : ''}{difference.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Value indicator bar */}
      {displayValue && (
        <div className="px-6 pb-6">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
              <span>Major</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30" />

              {/* Position marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
                style={{
                  left: `${Math.min(
                    Math.log10(displayValue) / Math.log10(1000000000) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>£10k</span>
              <span>£100k</span>
              <span>£1M</span>
              <span>£100M+</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
