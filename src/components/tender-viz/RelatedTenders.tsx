'use client';

import { ArrowRightIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface RelatedTender {
  ocid: string;
  title: string;
  buyerName: string;
  valueMax?: number | null;
  stage: 'planning' | 'tender' | 'award' | 'contract';
  matchReason: string;
  matchScore: number; // 0-100
}

interface RelatedTendersProps {
  tenders: RelatedTender[];
  currentOcid: string;
}

function formatValue(value: number | null | undefined): string {
  if (!value) return 'Undisclosed';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);
}

const stageBadges: Record<string, { bg: string; text: string }> = {
  planning: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  tender: { bg: 'bg-green-500/20', text: 'text-green-400' },
  award: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  contract: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

export function RelatedTenders({ tenders, currentOcid }: RelatedTendersProps) {
  if (tenders.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 text-center">
        <p className="text-slate-400">No related tenders found</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">Related Opportunities</h3>
        <p className="text-sm text-slate-400 mt-1">
          Similar tenders based on sector, buyer, and requirements
        </p>
      </div>

      <div className="divide-y divide-slate-800">
        {tenders.map((tender) => {
          const badge = stageBadges[tender.stage] || stageBadges.tender;

          return (
            <div
              key={tender.ocid}
              className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Match score indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden max-w-24">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                        style={{ width: `${tender.matchScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{tender.matchScore}% match</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-white font-medium line-clamp-2 group-hover:text-teal-400 transition-colors">
                    {tender.title}
                  </h4>

                  {/* Buyer */}
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span className="truncate">{tender.buyerName}</span>
                  </div>

                  {/* Match reason */}
                  <p className="text-xs text-slate-500 mt-2 italic">
                    {tender.matchReason}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Stage badge */}
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {tender.stage}
                  </span>

                  {/* Value */}
                  <span className="text-sm font-medium text-white">
                    {formatValue(tender.valueMax)}
                  </span>

                  {/* Arrow */}
                  <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-800">
        <button className="text-sm text-teal-400 hover:text-teal-300 font-medium">
          View all related tenders →
        </button>
      </div>
    </div>
  );
}
