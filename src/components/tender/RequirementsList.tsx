'use client';

import { useState, useEffect } from 'react';
import { RequirementItem, Requirement } from './RequirementItem';
import { ResponseEditor } from './ResponseEditor';
import { ExportBidButton } from './ExportBidButton';
import {
  ClipboardDocumentListIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface DocumentAnalysis {
  summary: string;
  buyerName?: string;
  contractTitle?: string;
  submissionDeadline?: string;
  estimatedValue?: string;
  evaluationMethodology?: string;
  scoringWeights?: Record<string, number>;
  keyDates?: Array<{ date: string; description: string }>;
}

// Props for tender-based requirements (new flow)
interface TenderBasedProps {
  tenderOcid: string;
  requirements: Requirement[];
  onRequirementsUpdate?: (requirements: Requirement[]) => void;
  documentId?: never;
  onStartResponse?: never;
}

// Props for document-based requirements (legacy flow)
interface DocumentBasedProps {
  documentId: string;
  onStartResponse?: (requirementId: string) => void;
  tenderOcid?: never;
  requirements?: never;
  onRequirementsUpdate?: never;
}

type Props = TenderBasedProps | DocumentBasedProps;

type FilterType = 'all' | 'mandatory' | 'desirable' | 'informational';
type SortType = 'number' | 'weighting' | 'status';

export function RequirementsList(props: Props) {
  const isTenderBased = 'tenderOcid' in props && props.tenderOcid;

  const [localRequirements, setLocalRequirements] = useState<Requirement[]>(
    isTenderBased ? props.requirements : []
  );
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(!isTenderBased);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('number');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [savedResponses, setSavedResponses] = useState<Record<string, string>>({});

  // For tender-based flow, sync with parent requirements
  useEffect(() => {
    if (isTenderBased && props.requirements) {
      setLocalRequirements(props.requirements);
      loadResponsesForRequirements(props.requirements);
    }
  }, [isTenderBased ? props.requirements : null]);

  // For document-based flow, fetch requirements
  useEffect(() => {
    if (!isTenderBased && props.documentId) {
      fetchRequirements();
    }
  }, [!isTenderBased ? props.documentId : null]);

  const loadResponsesForRequirements = async (reqs: Requirement[]) => {
    const responsesMap: Record<string, string> = {};
    const requirementsWithStatus = await Promise.all(
      reqs.map(async (r) => {
        try {
          const responseRes = await fetch(`/api/bid-responses?requirementId=${r.id}`);
          if (responseRes.ok) {
            const responseData = await responseRes.json();
            if (responseData.responseText) {
              responsesMap[r.id] = responseData.responseText;
              return {
                ...r,
                responseStatus: responseData.status as Requirement['responseStatus'],
                currentWordCount: responseData.wordCount,
              };
            }
          }
        } catch {
          // Ignore errors fetching individual responses
        }
        return { ...r, responseStatus: r.responseStatus || ('not_started' as const) };
      })
    );

    setSavedResponses(responsesMap);
    setLocalRequirements(requirementsWithStatus);
  };

  const fetchRequirements = async () => {
    if (isTenderBased) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analyze-document?documentId=${props.documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requirements');
      }

      const data = await response.json();

      if (data.status !== 'completed') {
        setError(`Analysis ${data.status}`);
        return;
      }

      setAnalysis(data.analysis);
      await loadResponsesForRequirements(data.requirements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requirements');
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = localRequirements;

  const filteredRequirements = requirements
    .filter((r) => filter === 'all' || r.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'weighting':
          return (b.weighting || 0) - (a.weighting || 0);
        case 'status':
          const statusOrder = ['not_started', 'draft', 'review', 'complete'];
          return (
            statusOrder.indexOf(a.responseStatus || 'not_started') -
            statusOrder.indexOf(b.responseStatus || 'not_started')
          );
        default:
          return (a.number || '').localeCompare(b.number || '', undefined, { numeric: true });
      }
    });

  const stats = {
    total: requirements.length,
    mandatory: requirements.filter((r) => r.type === 'mandatory').length,
    desirable: requirements.filter((r) => r.type === 'desirable').length,
    informational: requirements.filter((r) => r.type === 'informational').length,
    completed: requirements.filter((r) => r.responseStatus === 'complete').length,
  };

  const completionPercentage = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const handleStartResponse = (requirementId: string) => {
    const requirement = requirements.find((r) => r.id === requirementId);
    if (requirement) {
      setSelectedRequirement(requirement);
      if (!isTenderBased && props.onStartResponse) {
        props.onStartResponse(requirementId);
      }
    }
  };

  const handleSaveResponse = async (response: string) => {
    if (!selectedRequirement) return;

    // Save to API
    const res = await fetch('/api/bid-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requirementId: selectedRequirement.id,
        responseText: response,
        status: 'draft',
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to save response');
    }

    // Save locally
    setSavedResponses((prev) => ({
      ...prev,
      [selectedRequirement.id]: response,
    }));

    // Update requirement status
    const updatedRequirements = localRequirements.map((r) =>
      r.id === selectedRequirement.id
        ? { ...r, responseStatus: 'draft' as const, currentWordCount: response.split(/\s+/).filter(Boolean).length }
        : r
    );
    setLocalRequirements(updatedRequirements);

    // Notify parent if tender-based
    if (isTenderBased && props.onRequirementsUpdate) {
      props.onRequirementsUpdate(updatedRequirements);
    }
  };

  const handleCloseEditor = () => {
    setSelectedRequirement(null);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 border-slate-800">
        <div className="flex items-center justify-center gap-3">
          <ArrowPathIcon className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-slate-300">Loading requirements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl p-8 border-slate-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRequirements}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get export identifier (documentId or tenderOcid)
  const exportId = isTenderBased ? props.tenderOcid : props.documentId;

  return (
    <div className="space-y-6">
      {/* Analysis Summary - only for document-based */}
      {!isTenderBased && analysis && (
        <div className="bg-slate-900 rounded-xl p-6 border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Document Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {analysis.buyerName && (
              <div>
                <span className="text-xs text-slate-500">Buyer</span>
                <p className="text-white font-medium">{analysis.buyerName}</p>
              </div>
            )}
            {analysis.contractTitle && (
              <div>
                <span className="text-xs text-slate-500">Contract Title</span>
                <p className="text-white font-medium">{analysis.contractTitle}</p>
              </div>
            )}
            {analysis.submissionDeadline && (
              <div>
                <span className="text-xs text-slate-500">Deadline</span>
                <p className="text-white font-medium">
                  {new Date(analysis.submissionDeadline).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
            {analysis.estimatedValue && (
              <div>
                <span className="text-xs text-slate-500">Value</span>
                <p className="text-white font-medium">{analysis.estimatedValue}</p>
              </div>
            )}
          </div>

          {analysis.summary && (
            <p className="text-slate-300 text-sm">{analysis.summary}</p>
          )}

          {/* Scoring Weights */}
          {analysis.scoringWeights && Object.keys(analysis.scoringWeights).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Scoring Weights</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.scoringWeights).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-blue-950/30 text-blue-300 text-sm rounded-full border-blue-700/60"
                  >
                    {key}: {value}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requirements Header */}
      <div className="bg-slate-900 rounded-xl p-6 border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Requirements Checklist</h3>
              <p className="text-sm text-slate-400">
                {stats.total} requirements • {completionPercentage}% complete
              </p>
            </div>
          </div>

          {/* Progress Bar + Export */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-white font-medium">{completionPercentage}%</span>
            </div>
            <ExportBidButton
              documentId={!isTenderBased ? exportId : undefined}
              tenderOcid={isTenderBased ? exportId : undefined}
              disabled={stats.completed === 0}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`p-3 rounded-lg text-center transition-colors ${
              filter === 'all'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs">Total</div>
          </button>
          <button
            onClick={() => setFilter('mandatory')}
            className={`p-3 rounded-lg text-center transition-colors ${
              filter === 'mandatory'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-2xl font-bold">{stats.mandatory}</div>
            <div className="text-xs">Mandatory</div>
          </button>
          <button
            onClick={() => setFilter('desirable')}
            className={`p-3 rounded-lg text-center transition-colors ${
              filter === 'desirable'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-2xl font-bold">{stats.desirable}</div>
            <div className="text-xs">Desirable</div>
          </button>
          <button
            onClick={() => setFilter('informational')}
            className={`p-3 rounded-lg text-center transition-colors ${
              filter === 'informational'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="text-2xl font-bold">{stats.informational}</div>
            <div className="text-xs">Info</div>
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500">Sort by:</span>
          {(['number', 'weighting', 'status'] as SortType[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortBy === option
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Requirements List */}
        {filteredRequirements.length > 0 ? (
          <div className="space-y-3">
            {filteredRequirements.map((requirement) => (
              <RequirementItem
                key={requirement.id}
                requirement={requirement}
                onStartResponse={handleStartResponse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            No requirements found matching the filter.
          </div>
        )}
      </div>

      {/* Response Editor Modal */}
      {selectedRequirement && (
        <ResponseEditor
          requirement={selectedRequirement}
          initialResponse={savedResponses[selectedRequirement.id]}
          onSave={handleSaveResponse}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
