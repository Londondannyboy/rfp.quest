'use client';

import { Fragment } from 'react';
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CurrencyPoundIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { Tender } from '@/lib/hooks/use-tenders';

interface TenderDetailProps {
  tender: Tender | null;
  onClose: () => void;
}

function formatValue(min: number | null, max: number | null, currency: string = 'GBP'): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max && min !== max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  } else if (max) {
    return formatter.format(max);
  } else if (min) {
    return `From ${formatter.format(min)}`;
  }
  return 'Not specified';
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 border-b border-slate-700/50 last:border-b-0">
      <h3 className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      <div className="text-sm text-slate-100">{children}</div>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    tender: 'bg-green-100 text-green-800 border-green-200',
    planning: 'bg-blue-100 text-blue-800 border-blue-200',
    award: 'bg-purple-100 text-purple-800 border-purple-200',
    contract: 'bg-slate-900/40 backdrop-blur-xl text-slate-100 border-slate-700/50',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colors[stage] || 'bg-slate-900/40 backdrop-blur-xl text-slate-300 border-slate-700/50'}`}
    >
      {stage.charAt(0).toUpperCase() + stage.slice(1)}
    </span>
  );
}

export function TenderDetail({ tender, onClose }: TenderDetailProps) {
  if (!tender) return null;

  const findATenderUrl = `https://www.find-tender.service.gov.uk/Notice/${tender.ocid.split('-').pop()}`;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700/50">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-100 pr-8">
              {tender.title}
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <StageBadge stage={tender.stage} />
              <span className="text-sm text-slate-500">
                OCID: {tender.ocid}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-900/40 backdrop-blur-xl"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          {tender.description && (
            <DetailSection title="Description" icon={DocumentTextIcon}>
              <p className="whitespace-pre-wrap">{tender.description}</p>
            </DetailSection>
          )}

          {/* Buyer */}
          <DetailSection title="Buyer" icon={BuildingOfficeIcon}>
            <p className="font-medium">{tender.buyerName}</p>
            {tender.region && (
              <p className="text-slate-500 mt-1">{tender.region}</p>
            )}
          </DetailSection>

          {/* Value */}
          <DetailSection title="Contract Value" icon={CurrencyPoundIcon}>
            <p className="text-lg font-semibold">
              {formatValue(tender.valueMin, tender.valueMax, tender.valueCurrency)}
            </p>
          </DetailSection>

          {/* Deadline */}
          <DetailSection title="Submission Deadline" icon={CalendarIcon}>
            <p className="font-medium">{formatDate(tender.tenderEndDate)}</p>
            {tender.tenderEndDate && (
              <p className="text-slate-500 mt-1">
                {new Date(tender.tenderEndDate).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </DetailSection>

          {/* Published */}
          <DetailSection title="Published" icon={ClockIcon}>
            <p>{formatDate(tender.publishedDate)}</p>
          </DetailSection>

          {/* Region */}
          {tender.region && (
            <DetailSection title="Region" icon={MapPinIcon}>
              <p>{tender.region}</p>
            </DetailSection>
          )}

          {/* CPV Codes */}
          {tender.cpvCodes && tender.cpvCodes.length > 0 && (
            <DetailSection title="CPV Codes" icon={TagIcon}>
              <div className="flex flex-wrap gap-2">
                {tender.cpvCodes.map((code) => (
                  <span
                    key={code}
                    className="inline-flex items-center rounded-md bg-slate-900/40 backdrop-blur-xl px-2.5 py-1 text-sm font-medium text-slate-200"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
          <div className="flex gap-3">
            <a
              href={findATenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              View on Find a Tender
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="rounded-md border-slate-600/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
