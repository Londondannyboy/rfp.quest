'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface Requirement {
  id: string;
  number: string;
  title: string;
  description: string;
  type: 'mandatory' | 'desirable' | 'informational';
  wordLimit?: number;
  weighting?: number;
  scoringCriteria?: string;
}

interface Props {
  requirement: Requirement;
  initialResponse?: string;
  onSave: (response: string) => Promise<void>;
  onClose: () => void;
}

type RefinementOption = 'shorter' | 'longer' | 'formal' | 'conversational' | 'detail' | 'evidence';

const REFINEMENT_OPTIONS: { id: RefinementOption; label: string; prompt: string }[] = [
  { id: 'shorter', label: 'Make Shorter', prompt: 'Make this response more concise while keeping key points' },
  { id: 'longer', label: 'Expand', prompt: 'Expand this response with more detail and examples' },
  { id: 'formal', label: 'More Formal', prompt: 'Rewrite in a more formal, professional tone' },
  { id: 'conversational', label: 'More Conversational', prompt: 'Make the tone more approachable and conversational' },
  { id: 'detail', label: 'Add Technical Detail', prompt: 'Add more technical detail and specifics' },
  { id: 'evidence', label: 'Add Evidence', prompt: 'Add more evidence, examples, and case study references' },
];

export function ResponseEditor({ requirement, initialResponse, onSave, onClose }: Props) {
  const [response, setResponse] = useState(initialResponse || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRefinements, setShowRefinements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = requirement.wordLimit ? wordCount > requirement.wordLimit : false;
  const wordLimitPercentage = requirement.wordLimit
    ? Math.min((wordCount / requirement.wordLimit) * 100, 100)
    : 0;

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    if (response && response !== initialResponse) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [response]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave(response);
      setLastSaved(new Date());
    } catch (err) {
      setError('Failed to save');
    } finally {
      setIsSaving(false);
    }
  }, [response, onSave, isSaving]);

  const generateResponse = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirementId: requirement.id,
          requirement: {
            title: requirement.title,
            description: requirement.description,
            wordLimit: requirement.wordLimit,
            scoringCriteria: requirement.scoringCriteria,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const refineResponse = async (option: RefinementOption) => {
    if (!response) return;

    setIsRefining(true);
    setError(null);
    setShowRefinements(false);

    const refinement = REFINEMENT_OPTIONS.find((o) => o.id === option);
    if (!refinement) return;

    try {
      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirementId: requirement.id,
          requirement: {
            title: requirement.title,
            description: requirement.description,
            wordLimit: requirement.wordLimit,
            scoringCriteria: requirement.scoringCriteria,
          },
          existingResponse: response,
          refinementPrompt: refinement.prompt,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to refine response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refinement failed');
    } finally {
      setIsRefining(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400 font-mono text-sm">{requirement.number}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                requirement.type === 'mandatory'
                  ? 'bg-red-900/50 text-red-300'
                  : requirement.type === 'desirable'
                  ? 'bg-amber-900/50 text-amber-300'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {requirement.type}
              </span>
              {requirement.weighting && (
                <span className="px-2 py-0.5 bg-blue-950/50 text-blue-300 text-xs rounded">
                  {requirement.weighting}%
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-white truncate">{requirement.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Requirement Description */}
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Requirement</h3>
          <p className="text-slate-300 text-sm">{requirement.description}</p>
          {requirement.scoringCriteria && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-slate-500 mb-1">Scoring Criteria</h4>
              <p className="text-slate-400 text-xs">{requirement.scoringCriteria}</p>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-3">
            {/* Generate Button */}
            <button
              onClick={generateResponse}
              disabled={isGenerating || isRefining}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all text-sm font-medium"
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  {response ? 'Regenerate' : 'Generate with AI'}
                </>
              )}
            </button>

            {/* Refinement Dropdown */}
            {response && (
              <div className="relative">
                <button
                  onClick={() => setShowRefinements(!showRefinements)}
                  disabled={isGenerating || isRefining}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors text-sm"
                >
                  {isRefining ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Refine
                      <ChevronDownIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                {showRefinements && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 rounded-lg border-slate-700 shadow-xl z-10">
                    {REFINEMENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => refineResponse(option.id)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1" />

            {/* Copy Button */}
            {response && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
                Copy
              </button>
            )}

            {/* Save Status */}
            <div className="flex items-center gap-2 text-sm">
              {isSaving && (
                <span className="text-slate-400 flex items-center gap-1">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              )}
              {lastSaved && !isSaving && (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-3 bg-red-900/30 border-red-700 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Start typing your response, or click 'Generate with AI' to create a draft..."
              className="w-full h-full p-4 bg-slate-800 border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isGenerating || isRefining}
            />
          </div>

          {/* Word Count */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${isOverLimit ? 'text-red-400' : 'text-slate-400'}`}>
                {wordCount.toLocaleString()} words
                {requirement.wordLimit && (
                  <span className="text-slate-500"> / {requirement.wordLimit.toLocaleString()} limit</span>
                )}
              </span>
              {isOverLimit && (
                <span className="text-red-400 text-sm flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  Over limit by {(wordCount - (requirement.wordLimit || 0)).toLocaleString()} words
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {requirement.wordLimit && (
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverLimit ? 'bg-red-900/200' : wordLimitPercentage > 80 ? 'bg-amber-900/200' : 'bg-blue-950/200'
                  }`}
                  style={{ width: `${Math.min(wordLimitPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !response}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Response'}
          </button>
        </div>
      </div>
    </div>
  );
}
