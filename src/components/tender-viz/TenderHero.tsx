'use client';

import { CalendarIcon, BuildingOfficeIcon, CurrencyPoundIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TenderHeroProps {
  title: string;
  buyerName: string;
  stage: 'planning' | 'tender' | 'award' | 'contract';
  valueMin?: number | null;
  valueMax?: number | null;
  deadline?: string | null;
  publishedDate: string;
  ocid: string;
  description?: string | null;
}

function formatValue(min: number | null | undefined, max: number | null | undefined): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  });

  if (min && max && min !== max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  } else if (max) {
    return formatter.format(max);
  } else if (min) {
    return `From ${formatter.format(min)}`;
  }
  return 'Value not disclosed';
}

function getDeadlineStatus(deadline: string | null | undefined): { text: string; color: string; urgent: boolean } {
  if (!deadline) return { text: 'No deadline set', color: 'text-gray-500', urgent: false };

  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Deadline passed', color: 'text-gray-400', urgent: false };
  } else if (diffDays === 0) {
    return { text: 'Due today!', color: 'text-red-600', urgent: true };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} days left`, color: 'text-red-600', urgent: true };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, color: 'text-orange-500', urgent: false };
  } else if (diffDays <= 30) {
    return { text: `${diffDays} days left`, color: 'text-yellow-600', urgent: false };
  }
  return { text: `${diffDays} days left`, color: 'text-green-600', urgent: false };
}

const stageBadges: Record<string, { bg: string; text: string; label: string }> = {
  planning: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Planning' },
  tender: { bg: 'bg-green-100', text: 'text-green-800', label: 'Open for Bids' },
  award: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Awarded' },
  contract: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Contracted' },
};

export function TenderHero({
  title,
  buyerName,
  stage,
  valueMin,
  valueMax,
  deadline,
  publishedDate,
  ocid,
  description,
}: TenderHeroProps) {
  const stageBadge = stageBadges[stage] || stageBadges.tender;
  const deadlineStatus = getDeadlineStatus(deadline);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* Header with gradient accent */}
      <div className="h-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500" />

      <div className="p-8">
        {/* Stage badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageBadge.bg} ${stageBadge.text}`}>
            {stageBadge.label}
          </span>
          <span className="text-slate-400 text-sm">
            OCID: {ocid}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        {/* Description snippet */}
        {description && (
          <p className="text-slate-300 text-lg mb-6 line-clamp-2">
            {description}
          </p>
        )}

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Buyer */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <BuildingOfficeIcon className="w-4 h-4" />
              Buyer
            </div>
            <div className="text-white font-medium truncate" title={buyerName}>
              {buyerName}
            </div>
          </div>

          {/* Value */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CurrencyPoundIcon className="w-4 h-4" />
              Contract Value
            </div>
            <div className="text-white font-medium">
              {formatValue(valueMin, valueMax)}
            </div>
          </div>

          {/* Deadline */}
          <div className={`bg-slate-800/50 rounded-xl p-4 ${deadlineStatus.urgent ? 'ring-2 ring-red-500/50' : ''}`}>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <ClockIcon className="w-4 h-4" />
              Deadline
            </div>
            <div className={`font-medium ${deadlineStatus.color}`}>
              {deadlineStatus.text}
            </div>
            {deadline && (
              <div className="text-slate-500 text-xs mt-1">
                {new Date(deadline).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>

          {/* Published */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <CalendarIcon className="w-4 h-4" />
              Published
            </div>
            <div className="text-white font-medium">
              {new Date(publishedDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
