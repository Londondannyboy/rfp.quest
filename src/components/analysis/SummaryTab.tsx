'use client';

import {
  CalendarIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Tender {
  ocid: string;
  title: string;
  buyerName: string;
  valueMin: number | null;
  valueMax: number | null;
  valueCurrency: string;
  tenderEndDate: string | null;
  publishedDate: string;
  region: string | null;
  cpvCodes: string[] | null;
}

interface Props {
  summary: Record<string, unknown> | null;
  tender: Tender;
}

export function SummaryTab({ summary, tender }: Props) {
  if (!summary) {
    return (
      <div className="p-8 text-center text-slate-400">
        No summary data available
      </div>
    );
  }

  const overview = summary.overview as Record<string, unknown> | undefined;
  const contract = summary.contract as Record<string, unknown> | undefined;
  const classification = summary.classification as Record<string, unknown> | undefined;
  const framework = summary.framework as Record<string, unknown> | undefined;
  const keyDates = summary.keyDates as Array<Record<string, unknown>> | undefined;
  const buyerInsights = summary.buyerInsights as Record<string, unknown> | undefined;

  const formatValue = (value: number | null | undefined): string => {
    if (!value) return 'TBC';
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
    return `£${value}`;
  };

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'TBC';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Buyer Card */}
        <div className="p-4 bg-slate-800/50 rounded-lg border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <BuildingOfficeIcon className="h-4 w-4" />
            Buyer
          </div>
          <div className="font-medium text-white">
            {String((overview?.buyer as Record<string, unknown>)?.name || '') || tender.buyerName}
          </div>
          {Boolean((overview?.buyer as Record<string, unknown>)?.department) && (
            <div className="text-sm text-slate-400 mt-1">
              {(overview?.buyer as Record<string, unknown>)?.department as string}
            </div>
          )}
        </div>

        {/* Value Card */}
        <div className="p-4 bg-slate-800/50 rounded-lg border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <CurrencyPoundIcon className="h-4 w-4" />
            Contract Value
          </div>
          <div className="font-medium text-white">
            {Boolean(contract?.valueMin) || Boolean(contract?.valueMax) ? (
              <>
                {formatValue(contract?.valueMin as number)} - {formatValue(contract?.valueMax as number)}
              </>
            ) : (
              formatValue(tender.valueMax)
            )}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            {Boolean((contract?.duration as Record<string, unknown>)?.months)
              ? `${(contract?.duration as Record<string, unknown>)?.months} months`
              : 'Duration TBC'}
          </div>
        </div>

        {/* Deadline Card */}
        <div className="p-4 bg-slate-800/50 rounded-lg border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <ClockIcon className="h-4 w-4" />
            Submission Deadline
          </div>
          <div className="font-medium text-white">
            {formatDate((overview?.deadline as string) || tender.tenderEndDate)}
          </div>
          {tender.tenderEndDate && (
            <div className="text-sm text-slate-400 mt-1">
              {(() => {
                const days = Math.ceil(
                  (new Date(tender.tenderEndDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
                if (days < 0) return 'Deadline passed';
                if (days === 0) return 'Due today';
                if (days === 1) return '1 day remaining';
                return `${days} days remaining`;
              })()}
            </div>
          )}
        </div>

        {/* Region Card */}
        <div className="p-4 bg-slate-800/50 rounded-lg border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <MapPinIcon className="h-4 w-4" />
            Region
          </div>
          <div className="font-medium text-white">
            {(classification?.region as string) || tender.region || 'UK-wide'}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            {(contract?.procedure as string)?.replace(/_/g, ' ') || 'Open procedure'}
          </div>
        </div>
      </div>

      {/* Framework Info (if detected) */}
      {Boolean(framework?.name) && (
        <div className="p-4 bg-blue-950/30 rounded-lg border-blue-700/60">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-800/90 text-blue-300 text-xs rounded">
              FRAMEWORK
            </span>
            <span className="font-medium text-white">{framework?.name as string}</span>
          </div>
          {Boolean(framework?.lot) && (
            <div className="text-sm text-blue-300">
              Lot: {framework?.lot as string}
            </div>
          )}
          {Boolean(framework?.callOffType) && (
            <div className="text-sm text-blue-300 mt-1">
              Call-off type: {(framework?.callOffType as string)?.replace(/_/g, ' ')}
            </div>
          )}
        </div>
      )}

      {/* Key Dates Timeline */}
      {keyDates && keyDates.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            Key Dates
          </h3>
          <div className="space-y-3">
            {keyDates.map((dateItem, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 ${
                  dateItem.isPast ? 'opacity-60' : ''
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    dateItem.isPast
                      ? 'bg-slate-600'
                      : 'bg-blue-950/200 ring-4 ring-teal-500/20'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {dateItem.event as string}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatDate(dateItem.date as string)}
                  </div>
                </div>
                {Boolean(dateItem.isPast) && (
                  <span className="text-xs text-slate-500">Past</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CPV Classification */}
      {Boolean((classification?.cpvCodes as string[])?.length || tender.cpvCodes?.length) && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-blue-400" />
            Classification (CPV Codes)
          </h3>
          <div className="flex flex-wrap gap-2">
            {((classification?.cpvCodes as string[]) || tender.cpvCodes || []).map(
              (code, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                >
                  {code}
                </span>
              )
            )}
          </div>
          {(classification?.cpvDescriptions as string[])?.length > 0 && (
            <div className="mt-3 text-sm text-slate-400">
              {(classification?.cpvDescriptions as string[]).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Buyer Insights */}
      {buyerInsights && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <BuildingOfficeIcon className="h-5 w-5 text-blue-400" />
            Buyer Insights
          </h3>
          {Boolean(buyerInsights.organizationType) && (
            <div className="mb-3">
              <span className="text-slate-400">Organization Type:</span>{' '}
              <span className="text-white">{buyerInsights.organizationType as string}</span>
            </div>
          )}
          {Boolean(buyerInsights.recentActivity) && (
            <div className="mb-3">
              <span className="text-slate-400">Recent Activity:</span>{' '}
              <span className="text-white">{buyerInsights.recentActivity as string}</span>
            </div>
          )}
          {(buyerInsights.strategicPriorities as string[])?.length > 0 && (
            <div>
              <span className="text-slate-400">Strategic Priorities:</span>
              <ul className="mt-2 space-y-1">
                {(buyerInsights.strategicPriorities as string[]).map((priority, index) => (
                  <li key={index} className="text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-950/200 rounded-full" />
                    {priority}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
