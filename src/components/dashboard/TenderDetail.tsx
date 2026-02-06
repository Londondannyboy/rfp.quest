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
    <div className="py-4 border-b border-gray-200 last:border-b-0">
      <h3 className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
        <Icon className="h-4 w-4" />
        {title}
      </h3>
      <div className="text-sm text-gray-900">{children}</div>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    tender: 'bg-green-100 text-green-800 border-green-200',
    planning: 'bg-blue-100 text-blue-800 border-blue-200',
    award: 'bg-purple-100 text-purple-800 border-purple-200',
    contract: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colors[stage] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
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
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 pr-8">
              {tender.title}
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <StageBadge stage={tender.stage} />
              <span className="text-sm text-gray-500">
                OCID: {tender.ocid}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
              <p className="text-gray-500 mt-1">{tender.region}</p>
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
              <p className="text-gray-500 mt-1">
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
                    className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <a
              href={findATenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              View on Find a Tender
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
