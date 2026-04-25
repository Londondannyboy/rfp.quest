'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface PastBidResponse {
  id: string;
  questionNumber: number | null;
  questionText: string;
  responseText: string;
  wordCount: number;
  scoreReceived: number | null;
  maxScore: number | null;
  evaluatorFeedback: string | null;
  tags: string[];
}

interface PastBid {
  id: string;
  tenderTitle: string;
  buyerName: string | null;
  contractValue: number | null;
  outcome: 'won' | 'lost' | 'pending' | 'withdrawn';
  submissionDate: string | null;
  awardDate: string | null;
  sector: string | null;
  lessonsLearned: string | null;
  winThemes: string[];
  createdAt: string;
}

export default function PastBidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bid, setBid] = useState<PastBid | null>(null);
  const [responses, setResponses] = useState<PastBidResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [editingResponse, setEditingResponse] = useState<PastBidResponse | null>(null);
  const [formData, setFormData] = useState({
    questionNumber: '',
    questionText: '',
    responseText: '',
    scoreReceived: '',
    maxScore: '',
    evaluatorFeedback: '',
    tags: '',
  });

  useEffect(() => {
    fetchBidDetails();
  }, [id]);

  const fetchBidDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/past-bids/${id}`);
      if (!response.ok) throw new Error('Failed to fetch bid details');
      const data = await response.json();
      setBid(data.bid);
      setResponses(data.responses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/past-bids/${id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionNumber: formData.questionNumber ? parseInt(formData.questionNumber) : null,
          questionText: formData.questionText,
          responseText: formData.responseText,
          scoreReceived: formData.scoreReceived ? parseFloat(formData.scoreReceived) : null,
          maxScore: formData.maxScore ? parseFloat(formData.maxScore) : null,
          evaluatorFeedback: formData.evaluatorFeedback || null,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      });

      if (!response.ok) throw new Error('Failed to add response');
      const data = await response.json();
      setResponses([...responses, data.response]);
      setIsAddingResponse(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add response');
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    try {
      const response = await fetch(`/api/past-bids/${id}/responses?responseId=${responseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete response');
      setResponses(responses.filter((r) => r.id !== responseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete response');
    }
  };

  const resetForm = () => {
    setFormData({
      questionNumber: '',
      questionText: '',
      responseText: '',
      scoreReceived: '',
      maxScore: '',
      evaluatorFeedback: '',
      tags: '',
    });
    setEditingResponse(null);
  };

  const startEditResponse = (response: PastBidResponse) => {
    setEditingResponse(response);
    setFormData({
      questionNumber: response.questionNumber?.toString() || '',
      questionText: response.questionText,
      responseText: response.responseText,
      scoreReceived: response.scoreReceived?.toString() || '',
      maxScore: response.maxScore?.toString() || '',
      evaluatorFeedback: response.evaluatorFeedback || '',
      tags: response.tags.join(', '),
    });
    setIsAddingResponse(true);
  };

  const getOutcomeConfig = (outcome: string) => {
    switch (outcome) {
      case 'won':
        return { icon: CheckCircleIcon, color: 'text-green-400', bg: 'bg-blue-900/30', label: 'Won' };
      case 'lost':
        return { icon: XCircleIcon, color: 'text-red-400', bg: 'bg-red-900/30', label: 'Lost' };
      case 'pending':
        return { icon: ClockIcon, color: 'text-amber-400', bg: 'bg-amber-900/30', label: 'Pending' };
      default:
        return { icon: DocumentTextIcon, color: 'text-slate-400', bg: 'bg-slate-800', label: 'Withdrawn' };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !bid) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || 'Bid not found'}</p>
        <Link
          href="/past-bids"
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          Back to Past Bids
        </Link>
      </div>
    );
  }

  const outcomeConfig = getOutcomeConfig(bid.outcome);
  const OutcomeIcon = outcomeConfig.icon;

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/past-bids"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Past Bids
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{bid.tenderTitle}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                {bid.buyerName && <span>{bid.buyerName}</span>}
                {bid.sector && (
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-xs">
                    {bid.sector}
                  </span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${outcomeConfig.bg}`}>
              <OutcomeIcon className={`w-5 h-5 ${outcomeConfig.color}`} />
              <span className={`font-medium ${outcomeConfig.color}`}>{outcomeConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Bid Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bid.contractValue && (
            <div className="bg-slate-900 rounded-lg p-4 border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Contract Value</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(bid.contractValue)}</p>
            </div>
          )}
          {bid.submissionDate && (
            <div className="bg-slate-900 rounded-lg p-4 border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Submitted</p>
              <p className="text-lg font-semibold text-white">
                {new Date(bid.submissionDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
          {bid.awardDate && (
            <div className="bg-slate-900 rounded-lg p-4 border-slate-800">
              <p className="text-xs text-slate-500 mb-1">Award Date</p>
              <p className="text-lg font-semibold text-white">
                {new Date(bid.awardDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
          <div className="bg-slate-900 rounded-lg p-4 border-slate-800">
            <p className="text-xs text-slate-500 mb-1">Responses</p>
            <p className="text-lg font-semibold text-white">{responses.length}</p>
          </div>
        </div>

        {/* Win Themes */}
        {bid.winThemes && bid.winThemes.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-4 border-slate-800 mb-8">
            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Win Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {bid.winThemes.map((theme, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-950/30 text-blue-400 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Learned */}
        {bid.lessonsLearned && (
          <div className="bg-slate-900 rounded-lg p-4 border-slate-800 mb-8">
            <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Lessons Learned
            </h3>
            <p className="text-slate-300 whitespace-pre-wrap">{bid.lessonsLearned}</p>
          </div>
        )}

        {/* Responses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Bid Responses</h2>
            <button
              onClick={() => {
                resetForm();
                setIsAddingResponse(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Response
            </button>
          </div>

          {/* Add/Edit Response Form */}
          {isAddingResponse && (
            <div className="bg-slate-900 rounded-lg p-6 border-slate-800 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                {editingResponse ? 'Edit Response' : 'Add New Response'}
              </h3>
              <form onSubmit={handleAddResponse} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Question #</label>
                    <input
                      type="number"
                      value={formData.questionNumber}
                      onChange={(e) => setFormData({ ...formData, questionNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Score Received</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.scoreReceived}
                      onChange={(e) => setFormData({ ...formData, scoreReceived: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Max Score</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Question Text *</label>
                  <textarea
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    required
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Enter the question that was asked..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Response Text *</label>
                  <textarea
                    value={formData.responseText}
                    onChange={(e) => setFormData({ ...formData, responseText: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Enter your bid response..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.responseText.trim().split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Evaluator Feedback</label>
                  <textarea
                    value={formData.evaluatorFeedback}
                    onChange={(e) => setFormData({ ...formData, evaluatorFeedback: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Any feedback received from evaluators..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., methodology, case study, pricing"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingResponse ? 'Save Changes' : 'Add Response'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingResponse(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Responses List */}
          {responses.length === 0 ? (
            <div className="bg-slate-900 rounded-lg p-8 border-slate-800 text-center">
              <DocumentTextIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-2">No responses added yet</p>
              <p className="text-sm text-slate-500">
                Add your bid responses to build your content library for future bids.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="bg-slate-900 rounded-lg p-5 border-slate-800"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {response.questionNumber && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-medium">
                            Q{response.questionNumber}
                          </span>
                        )}
                        {response.scoreReceived !== null && response.maxScore !== null && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              response.scoreReceived / response.maxScore >= 0.8
                                ? 'bg-blue-900/30 text-green-400'
                                : response.scoreReceived / response.maxScore >= 0.6
                                ? 'bg-amber-900/30 text-amber-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}
                          >
                            Score: {response.scoreReceived}/{response.maxScore}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">{response.wordCount} words</span>
                      </div>
                      <h4 className="text-white font-medium">{response.questionText}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditResponse(response)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResponse(response.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3 line-clamp-4">
                    {response.responseText}
                  </p>

                  {response.evaluatorFeedback && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 mb-1">Evaluator Feedback</p>
                      <p className="text-sm text-slate-400">{response.evaluatorFeedback}</p>
                    </div>
                  )}

                  {response.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {response.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
