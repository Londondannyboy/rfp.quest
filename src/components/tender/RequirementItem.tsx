'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

export interface Requirement {
  id: string;
  number: string;
  title: string;
  description: string;
  type: 'mandatory' | 'desirable' | 'informational';
  wordLimit?: number;
  pageLimit?: number;
  weighting?: number;
  scoringCriteria?: string;
  sectionReference?: string;
  responseStatus?: 'not_started' | 'draft' | 'review' | 'complete';
  currentWordCount?: number;
}

interface Props {
  requirement: Requirement;
  onStartResponse?: (requirementId: string) => void;
}

export function RequirementItem({ requirement, onStartResponse }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeStyles = (type: Requirement['type']) => {
    switch (type) {
      case 'mandatory':
        return {
          bg: 'bg-red-900/30',
          border: 'border-red-700',
          text: 'text-red-300',
          icon: <ExclamationCircleIcon className="w-4 h-4" />,
          label: 'Mandatory',
        };
      case 'desirable':
        return {
          bg: 'bg-amber-900/30',
          border: 'border-amber-700',
          text: 'text-amber-300',
          icon: <CheckCircleIcon className="w-4 h-4" />,
          label: 'Desirable',
        };
      case 'informational':
      default:
        return {
          bg: 'bg-slate-800/50',
          border: 'border-slate-700',
          text: 'text-slate-400',
          icon: <InformationCircleIcon className="w-4 h-4" />,
          label: 'Info',
        };
    }
  };

  const getStatusStyles = (status?: Requirement['responseStatus']) => {
    switch (status) {
      case 'complete':
        return { bg: 'bg-green-600', text: 'Complete' };
      case 'review':
        return { bg: 'bg-purple-600', text: 'In Review' };
      case 'draft':
        return { bg: 'bg-amber-600', text: 'Draft' };
      default:
        return { bg: 'bg-slate-600', text: 'Not Started' };
    }
  };

  const typeStyle = getTypeStyles(requirement.type);
  const statusStyle = getStatusStyles(requirement.responseStatus);

  return (
    <div className={`rounded-lg border ${typeStyle.border} ${typeStyle.bg} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-900/60 backdrop-blur-xl border-slate-700/50/5 transition-colors"
      >
        {/* Type Badge */}
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${typeStyle.text}`}>
          {typeStyle.icon}
          {typeStyle.label}
        </span>

        {/* Requirement Number */}
        <span className="text-blue-400 font-mono text-sm">{requirement.number}</span>

        {/* Title */}
        <span className="flex-1 text-white font-medium truncate">{requirement.title}</span>

        {/* Weighting */}
        {requirement.weighting && (
          <span className="px-2 py-0.5 bg-blue-950/50 text-blue-300 text-xs rounded">
            {requirement.weighting}%
          </span>
        )}

        {/* Word Limit */}
        {requirement.wordLimit && (
          <span className="text-slate-400 text-sm">
            {requirement.currentWordCount || 0}/{requirement.wordLimit} words
          </span>
        )}

        {/* Status */}
        <span className={`px-2 py-0.5 ${statusStyle.bg} text-white text-xs rounded`}>
          {statusStyle.text}
        </span>

        {/* Expand Icon */}
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50">
          {/* Description */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Description</h4>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{requirement.description}</p>
          </div>

          {/* Metadata Grid */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {requirement.wordLimit && (
              <div>
                <span className="text-xs text-slate-500">Word Limit</span>
                <p className="text-white font-medium">{requirement.wordLimit.toLocaleString()}</p>
              </div>
            )}
            {requirement.pageLimit && (
              <div>
                <span className="text-xs text-slate-500">Page Limit</span>
                <p className="text-white font-medium">{requirement.pageLimit}</p>
              </div>
            )}
            {requirement.weighting && (
              <div>
                <span className="text-xs text-slate-500">Weighting</span>
                <p className="text-white font-medium">{requirement.weighting}%</p>
              </div>
            )}
            {requirement.sectionReference && (
              <div>
                <span className="text-xs text-slate-500">Section</span>
                <p className="text-white font-medium">{requirement.sectionReference}</p>
              </div>
            )}
          </div>

          {/* Scoring Criteria */}
          {requirement.scoringCriteria && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Scoring Criteria</h4>
              <p className="text-slate-300 text-sm">{requirement.scoringCriteria}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onStartResponse?.(requirement.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <PencilSquareIcon className="w-4 h-4" />
              {requirement.responseStatus === 'not_started' ? 'Write Response' : 'Edit Response'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
