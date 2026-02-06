'use client';

import { createColumnHelper } from '@tanstack/react-table';
import type { Tender } from '@/lib/hooks/use-tenders';

const columnHelper = createColumnHelper<Tender>();

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
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    tender: 'bg-green-100 text-green-800',
    planning: 'bg-blue-100 text-blue-800',
    award: 'bg-purple-100 text-purple-800',
    contract: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[stage] || 'bg-gray-100 text-gray-600'}`}
    >
      {stage.charAt(0).toUpperCase() + stage.slice(1)}
    </span>
  );
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) {
    return <span className="text-gray-400">Not specified</span>;
  }

  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let colorClass = 'text-gray-900';
  if (diffDays < 0) {
    colorClass = 'text-gray-400';
  } else if (diffDays <= 3) {
    colorClass = 'text-red-600 font-medium';
  } else if (diffDays <= 7) {
    colorClass = 'text-orange-600';
  }

  return <span className={colorClass}>{formatDate(deadline)}</span>;
}

function CPVBadges({ codes }: { codes: string[] }) {
  if (!codes || !codes.length) {
    return <span className="text-gray-400">-</span>;
  }

  const displayCodes = codes.slice(0, 2);
  const remaining = codes.length - 2;

  return (
    <div className="flex flex-wrap gap-1">
      {displayCodes.map((code) => (
        <span
          key={code}
          className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
          title={code}
        >
          {code.slice(0, 8)}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          +{remaining}
        </span>
      )}
    </div>
  );
}

function SustainabilityBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
      title="Sustainability-related tender"
    >
      🌿 Sustainability
    </span>
  );
}

export const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <div className="max-w-md">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 truncate" title={info.getValue()}>
            {info.getValue()}
          </span>
          {info.row.original.isSustainability && <SustainabilityBadge />}
        </div>
        {info.row.original.description && (
          <div className="text-sm text-gray-500 truncate" title={info.row.original.description}>
            {info.row.original.description.slice(0, 100)}...
          </div>
        )}
      </div>
    ),
    size: 400,
  }),

  columnHelper.accessor('buyerName', {
    header: 'Buyer',
    cell: (info) => (
      <div className="text-sm text-gray-900 truncate max-w-48" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
    size: 200,
  }),

  columnHelper.accessor((row) => formatValue(row.valueMin, row.valueMax, row.valueCurrency), {
    id: 'value',
    header: 'Value',
    cell: (info) => (
      <div className="text-sm text-gray-900 whitespace-nowrap">
        {info.getValue()}
      </div>
    ),
    size: 150,
  }),

  columnHelper.accessor('tenderEndDate', {
    id: 'deadline',
    header: 'Deadline',
    cell: (info) => <DeadlineBadge deadline={info.getValue()} />,
    size: 140,
  }),

  columnHelper.accessor('stage', {
    header: 'Stage',
    cell: (info) => <StageBadge stage={info.getValue()} />,
    size: 100,
  }),

  columnHelper.accessor('cpvCodes', {
    header: 'CPV Codes',
    cell: (info) => <CPVBadges codes={info.getValue()} />,
    size: 150,
  }),

  columnHelper.accessor('region', {
    header: 'Region',
    cell: (info) => (
      <span className="text-sm text-gray-600">
        {info.getValue() || '-'}
      </span>
    ),
    size: 120,
  }),

  columnHelper.accessor('publishedDate', {
    header: 'Published',
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {formatDate(info.getValue())}
      </span>
    ),
    size: 110,
  }),
];

export const defaultVisibleColumns = {
  title: true,
  buyerName: true,
  value: true,
  deadline: true,
  stage: true,
  cpvCodes: false,
  region: false,
  publishedDate: true,
};
