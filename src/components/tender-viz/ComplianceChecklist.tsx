'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CurrencyPoundIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
type ComplianceCategory = 'legal' | 'financial' | 'technical' | 'regulatory' | 'experience' | 'other';

interface ComplianceItem {
  id: string;
  category: ComplianceCategory;
  title: string;
  description: string;
  status: ComplianceStatus;
  mandatory: boolean;
  evidence?: string;
  notes?: string;
  documentRequired?: string;
}

interface ComplianceChecklistProps {
  items: ComplianceItem[];
  overallStatus?: ComplianceStatus;
  lastAssessed?: string;
}

const statusConfig: Record<ComplianceStatus, { icon: typeof CheckCircleIcon; color: string; bg: string; label: string }> = {
  compliant: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Compliant' },
  'non-compliant': { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Non-Compliant' },
  partial: { icon: ExclamationTriangleIcon, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Partial' },
  'not-assessed': { icon: ClipboardDocumentCheckIcon, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Not Assessed' },
};

const categoryConfig: Record<ComplianceCategory, { icon: typeof DocumentTextIcon; label: string; color: string }> = {
  legal: { icon: BuildingLibraryIcon, label: 'Legal', color: 'text-blue-400' },
  financial: { icon: CurrencyPoundIcon, label: 'Financial', color: 'text-green-400' },
  technical: { icon: ShieldCheckIcon, label: 'Technical', color: 'text-purple-400' },
  regulatory: { icon: DocumentTextIcon, label: 'Regulatory', color: 'text-orange-400' },
  experience: { icon: ClipboardDocumentCheckIcon, label: 'Experience', color: 'text-cyan-400' },
  other: { icon: DocumentTextIcon, label: 'Other', color: 'text-slate-400' },
};

function ComplianceItemRow({ item }: { item: ComplianceItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[item.status];
  const category = categoryConfig[item.category];
  const StatusIcon = status.icon;
  const CategoryIcon = category.icon;

  return (
    <div className={`border-b border-slate-800 last:border-b-0 ${item.mandatory && item.status === 'non-compliant' ? 'bg-red-500/5' : ''}`}>
      <button
        className="w-full p-4 text-left hover:bg-slate-800/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {/* Status indicator */}
          <div className={`p-2 rounded-lg ${status.bg}`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Category and mandatory badges */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                <CategoryIcon className={`w-3 h-3 ${category.color}`} />
                <span className={`text-xs font-medium ${category.color}`}>
                  {category.label}
                </span>
              </div>
              {item.mandatory && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                  Mandatory
                </span>
              )}
            </div>

            {/* Title */}
            <h4 className="text-white font-medium">{item.title}</h4>

            {/* Description preview */}
            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{item.description}</p>
          </div>

          {/* Status badge */}
          <span className={`px-2 py-1 text-xs font-medium rounded ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 ml-14 space-y-3">
          <p className="text-sm text-slate-300">{item.description}</p>

          {item.documentRequired && (
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-xs font-medium text-slate-400 mb-1">Document Required</div>
              <p className="text-sm text-white">{item.documentRequired}</p>
            </div>
          )}

          {item.evidence && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-xs font-medium text-green-400 mb-1">Evidence Provided</div>
              <p className="text-sm text-slate-300">{item.evidence}</p>
            </div>
          )}

          {item.notes && (
            <div className="p-3 bg-slate-800/50 rounded-lg border-l-2 border-slate-600">
              <div className="text-xs font-medium text-slate-400 mb-1">Notes</div>
              <p className="text-sm text-slate-300 italic">{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ComplianceChecklist({ items, overallStatus, lastAssessed }: ComplianceChecklistProps) {
  const [filterCategory, setFilterCategory] = useState<ComplianceCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ComplianceStatus | 'all'>('all');

  // Group items by category
  const categories = Object.keys(categoryConfig) as ComplianceCategory[];

  // Calculate stats
  const stats = items.reduce(
    (acc, item) => {
      acc[item.status]++;
      if (item.mandatory) {
        acc.mandatory++;
        if (item.status === 'non-compliant') acc.mandatoryFailed++;
      }
      return acc;
    },
    { compliant: 0, 'non-compliant': 0, partial: 0, 'not-assessed': 0, mandatory: 0, mandatoryFailed: 0 }
  );

  const filteredItems = items.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Compliance Checklist</h3>
            <p className="text-sm text-slate-400 mt-1">
              Pre-qualification and eligibility requirements
            </p>
            {lastAssessed && (
              <p className="text-xs text-slate-500 mt-2">
                Last assessed: {new Date(lastAssessed).toLocaleDateString('en-GB')}
              </p>
            )}
          </div>

          {/* Overall status badge */}
          {overallStatus && (
            <div className={`px-3 py-2 rounded-lg ${statusConfig[overallStatus].bg}`}>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = statusConfig[overallStatus].icon;
                  return <Icon className={`w-5 h-5 ${statusConfig[overallStatus].color}`} />;
                })()}
                <span className={`font-medium ${statusConfig[overallStatus].color}`}>
                  {statusConfig[overallStatus].label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mt-4">
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? 'all' : key as ComplianceStatus)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                filterStatus === key ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`}
            >
              <config.icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-sm text-slate-400">
                {stats[key as ComplianceStatus]} {config.label}
              </span>
            </button>
          ))}
        </div>

        {/* Warning for mandatory failures */}
        {stats.mandatoryFailed > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">
              ⚠️ {stats.mandatoryFailed} mandatory compliance requirement{stats.mandatoryFailed > 1 ? 's' : ''} not met.
              This will likely disqualify your bid at the selection stage.
            </p>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filterCategory === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const CategoryIcon = config.icon;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterCategory === cat ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CategoryIcon className={`w-3.5 h-3.5 ${config.color}`} />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Checklist items */}
      <div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ComplianceItemRow key={item.id} item={item} />
          ))
        ) : (
          <div className="p-8 text-center">
            <ClipboardDocumentCheckIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No items match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
