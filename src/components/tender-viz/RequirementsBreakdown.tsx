'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

type RequirementStatus = 'met' | 'partial' | 'gap' | 'unknown';

interface Requirement {
  id: string;
  category: string;
  title: string;
  description: string;
  mandatory: boolean;
  status: RequirementStatus;
  notes?: string;
  subRequirements?: Omit<Requirement, 'subRequirements' | 'category'>[];
}

interface RequirementsBreakdownProps {
  requirements: Requirement[];
  companyName?: string;
}

const statusConfig: Record<RequirementStatus, { icon: typeof CheckCircleIcon; color: string; bg: string; label: string }> = {
  met: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Met' },
  partial: { icon: QuestionMarkCircleIcon, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Partial' },
  gap: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Gap' },
  unknown: { icon: QuestionMarkCircleIcon, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Unknown' },
};

function RequirementRow({
  requirement,
  depth = 0,
}: {
  requirement: Omit<Requirement, 'category'>;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = statusConfig[requirement.status];
  const StatusIcon = config.icon;
  const hasChildren = requirement.subRequirements && requirement.subRequirements.length > 0;

  return (
    <>
      <div
        className={`
          flex items-start gap-3 p-3 hover:bg-slate-800/30 transition-colors
          ${depth > 0 ? 'ml-6 border-l border-slate-700' : ''}
        `}
      >
        {/* Expand/collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-0.5 p-0.5 rounded ${hasChildren ? 'hover:bg-slate-700' : 'invisible'}`}
        >
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Status icon */}
        <div className={`p-1.5 rounded-lg ${config.bg}`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium">{requirement.title}</h4>
            {requirement.mandatory && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                Mandatory
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">{requirement.description}</p>
          {requirement.notes && (
            <p className="text-sm text-slate-500 mt-2 italic border-l-2 border-slate-600 pl-2">
              {requirement.notes}
            </p>
          )}
        </div>

        {/* Status badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Sub-requirements */}
      {isExpanded && requirement.subRequirements?.map((sub) => (
        <RequirementRow key={sub.id} requirement={sub} depth={depth + 1} />
      ))}
    </>
  );
}

export function RequirementsBreakdown({ requirements, companyName }: RequirementsBreakdownProps) {
  // Group by category
  const grouped = requirements.reduce((acc, req) => {
    if (!acc[req.category]) {
      acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
  }, {} as Record<string, Requirement[]>);

  // Calculate stats
  const stats = requirements.reduce(
    (acc, req) => {
      acc[req.status]++;
      acc.total++;
      if (req.mandatory) acc.mandatory++;
      if (req.mandatory && req.status === 'gap') acc.mandatoryGaps++;
      return acc;
    },
    { met: 0, partial: 0, gap: 0, unknown: 0, total: 0, mandatory: 0, mandatoryGaps: 0 }
  );

  const readinessScore = Math.round(
    ((stats.met + stats.partial * 0.5) / (stats.total - stats.unknown)) * 100
  );

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Requirements Analysis</h3>
            <p className="text-sm text-slate-400 mt-1">
              {companyName ? `Assessment for ${companyName}` : 'Tender requirements breakdown'}
            </p>
          </div>

          {/* Readiness score */}
          <div className="text-right">
            <div className="text-3xl font-bold text-teal-400">{readinessScore}%</div>
            <div className="text-xs text-slate-400">Readiness Score</div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mt-4">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <config.icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-sm text-slate-400">
                {stats[key as RequirementStatus]} {config.label}
              </span>
            </div>
          ))}
        </div>

        {/* Warning for mandatory gaps */}
        {stats.mandatoryGaps > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">
              ⚠️ {stats.mandatoryGaps} mandatory requirement{stats.mandatoryGaps > 1 ? 's' : ''} not met.
              This may disqualify your bid.
            </p>
          </div>
        )}
      </div>

      {/* Requirements by category */}
      <div className="divide-y divide-slate-800">
        {Object.entries(grouped).map(([category, reqs]) => (
          <div key={category}>
            <div className="px-6 py-3 bg-slate-800/50">
              <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wide">
                {category}
              </h4>
            </div>
            <div className="divide-y divide-slate-800/50">
              {reqs.map((req) => (
                <RequirementRow key={req.id} requirement={req} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
