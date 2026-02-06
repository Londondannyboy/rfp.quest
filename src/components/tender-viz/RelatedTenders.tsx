'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  TagIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface RelatedTender {
  ocid: string;
  slug: string;
  title: string;
  buyerName: string;
  stage: string;
  valueMax: number | null;
  region: string | null;
  relation: 'same_buyer' | 'same_region' | 'same_cpv';
}

interface RelatedTendersProps {
  currentOcid: string;
  buyerName: string;
  region: string | null;
}

const stageColors: Record<string, string> = {
  planning: 'bg-blue-500/20 text-blue-300',
  tender: 'bg-green-500/20 text-green-300',
  award: 'bg-purple-500/20 text-purple-300',
  contract: 'bg-gray-500/20 text-gray-300',
};

function formatValue(value: number | null): string {
  if (!value) return '';
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
}

export function RelatedTenders({ currentOcid, buyerName, region }: RelatedTendersProps) {
  const [related, setRelated] = useState<RelatedTender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/tenders/${encodeURIComponent(currentOcid)}/related`);
        if (res.ok) {
          const data = await res.json();
          setRelated(data.related || []);
        }
      } catch (error) {
        console.error('Failed to fetch related tenders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [currentOcid]);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Related Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) {
    return null;
  }

  // Group by relation type
  const byBuyer = related.filter((t) => t.relation === 'same_buyer');
  const byRegion = related.filter((t) => t.relation === 'same_region');
  const byCpv = related.filter((t) => t.relation === 'same_cpv');

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Related <strong>UK Government Contracts</strong>
      </h2>

      <div className="space-y-6">
        {/* Same Buyer */}
        {byBuyer.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BuildingOfficeIcon className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-medium text-teal-400">
                More from <strong>{buyerName}</strong>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {byBuyer.map((tender) => (
                <TenderCard key={tender.ocid} tender={tender} />
              ))}
            </div>
          </div>
        )}

        {/* Same Region */}
        {byRegion.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPinIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-cyan-400">
                Other opportunities in <strong>{region}</strong>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {byRegion.map((tender) => (
                <TenderCard key={tender.ocid} tender={tender} />
              ))}
            </div>
          </div>
        )}

        {/* Same CPV/Sector */}
        {byCpv.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-purple-400">
                Similar <strong>sector contracts</strong>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {byCpv.map((tender) => (
                <TenderCard key={tender.ocid} tender={tender} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Browse all link */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          Browse all <strong>UK tenders</strong>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function TenderCard({ tender }: { tender: RelatedTender }) {
  const value = formatValue(tender.valueMax);

  return (
    <Link
      href={`/tender/${tender.slug}`}
      className="group block bg-slate-800/50 hover:bg-slate-800 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`px-2 py-0.5 text-xs rounded-full ${stageColors[tender.stage] || stageColors.contract}`}>
          {tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1)}
        </span>
        {value && (
          <span className="text-xs text-slate-400">{value}</span>
        )}
      </div>
      <h4 className="text-sm font-medium text-white group-hover:text-teal-400 line-clamp-2 mb-2 transition-colors">
        {tender.title}
      </h4>
      <p className="text-xs text-slate-500 truncate">{tender.buyerName}</p>
    </Link>
  );
}
