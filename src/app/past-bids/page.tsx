'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrophyIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CurrencyPoundIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

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
  responseCount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  won: number;
  lost: number;
  pending: number;
  winRate: number;
  totalValue: number;
}

export default function PastBidsPage() {
  const [bids, setBids] = useState<PastBid[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBid, setEditingBid] = useState<PastBid | null>(null);
  const [filter, setFilter] = useState<'all' | 'won' | 'lost' | 'pending'>('all');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/past-bids');
      if (response.ok) {
        const data = await response.json();
        setBids(data.bids);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this past bid?')) return;

    try {
      const response = await fetch(`/api/past-bids/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBids((prev) => prev.filter((b) => b.id !== id));
        fetchBids(); // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting bid:', error);
    }
  };

  const filteredBids = bids.filter((bid) => {
    if (filter === 'all') return true;
    return bid.outcome === filter;
  });

  const formatValue = (value: number | null): string => {
    if (!value) return '-';
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
    return `£${value}`;
  };

  const getOutcomeStyle = (outcome: PastBid['outcome']) => {
    switch (outcome) {
      case 'won':
        return { bg: 'bg-green-900/50', text: 'text-green-400', icon: TrophyIcon };
      case 'lost':
        return { bg: 'bg-red-900/50', text: 'text-red-400', icon: XCircleIcon };
      case 'pending':
        return { bg: 'bg-amber-900/50', text: 'text-amber-400', icon: ClockIcon };
      case 'withdrawn':
        return { bg: 'bg-slate-700', text: 'text-slate-400', icon: XCircleIcon };
      default:
        return { bg: 'bg-slate-700', text: 'text-slate-400', icon: ClockIcon };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-amber-400" />
                Past Bids
              </h1>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Past Bid
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Bids</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-green-900/50">
              <div className="text-2xl font-bold text-green-400">{stats.won}</div>
              <div className="text-sm text-slate-400">Won</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-red-900/50">
              <div className="text-2xl font-bold text-red-400">{stats.lost}</div>
              <div className="text-sm text-slate-400">Lost</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-bold text-teal-400">{stats.winRate}%</div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-bold text-amber-400">{formatValue(stats.totalValue)}</div>
              <div className="text-sm text-slate-400">Value Won</div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl p-4 border border-teal-500/20 mb-6">
          <div className="flex items-start gap-3">
            <ChartBarIcon className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-medium">Your winning responses power AI generation</h3>
              <p className="text-slate-400 text-sm mt-1">
                Add your past bid responses here. When you generate new responses, the AI will reference
                your winning answers to match your style and improve quality.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All' },
            { id: 'won', label: 'Won' },
            { id: 'lost', label: 'Lost' },
            { id: 'pending', label: 'Pending' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bids List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <ArrowPathIcon className="w-8 h-8 text-teal-400 animate-spin" />
          </div>
        ) : filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid) => {
              const outcomeStyle = getOutcomeStyle(bid.outcome);
              const OutcomeIcon = outcomeStyle.icon;

              return (
                <div
                  key={bid.id}
                  className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Left: Title and Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {bid.tenderTitle}
                        </h3>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${outcomeStyle.bg} ${outcomeStyle.text}`}>
                          <OutcomeIcon className="w-3 h-3" />
                          {bid.outcome.charAt(0).toUpperCase() + bid.outcome.slice(1)}
                        </span>
                      </div>

                      {bid.buyerName && (
                        <p className="text-slate-400 text-sm mb-3">{bid.buyerName}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        {bid.contractValue && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <CurrencyPoundIcon className="w-4 h-4" />
                            {formatValue(bid.contractValue)}
                          </span>
                        )}
                        {bid.sector && (
                          <span className="text-slate-400">{bid.sector}</span>
                        )}
                        {bid.submissionDate && (
                          <span className="text-slate-500">
                            Submitted {new Date(bid.submissionDate).toLocaleDateString('en-GB')}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-teal-400">
                          <DocumentTextIcon className="w-4 h-4" />
                          {bid.responseCount} responses
                        </span>
                      </div>

                      {bid.winThemes && bid.winThemes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {bid.winThemes.map((theme, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/past-bids/${bid.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                      >
                        View
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setEditingBid(bid)}
                        className="p-1.5 text-slate-400 hover:text-white transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bid.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
            <TrophyIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Past Bids Yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Add your historical bids to help the AI learn your writing style and
              generate better responses for future tenders.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Past Bid
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingBid) && (
        <PastBidModal
          bid={editingBid}
          onClose={() => {
            setShowAddModal(false);
            setEditingBid(null);
          }}
          onSave={() => {
            setShowAddModal(false);
            setEditingBid(null);
            fetchBids();
          }}
        />
      )}
    </div>
  );
}

interface PastBidModalProps {
  bid: PastBid | null;
  onClose: () => void;
  onSave: () => void;
}

function PastBidModal({ bid, onClose, onSave }: PastBidModalProps) {
  const [tenderTitle, setTenderTitle] = useState(bid?.tenderTitle || '');
  const [buyerName, setBuyerName] = useState(bid?.buyerName || '');
  const [contractValue, setContractValue] = useState(bid?.contractValue?.toString() || '');
  const [outcome, setOutcome] = useState<PastBid['outcome']>(bid?.outcome || 'pending');
  const [submissionDate, setSubmissionDate] = useState(bid?.submissionDate?.split('T')[0] || '');
  const [sector, setSector] = useState(bid?.sector || '');
  const [lessonsLearned, setLessonsLearned] = useState(bid?.lessonsLearned || '');
  const [winThemes, setWinThemes] = useState(bid?.winThemes?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!tenderTitle.trim()) {
      setError('Tender title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        bid ? `/api/past-bids/${bid.id}` : '/api/past-bids',
        {
          method: bid ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenderTitle: tenderTitle.trim(),
            buyerName: buyerName.trim() || null,
            contractValue: contractValue ? parseFloat(contractValue) : null,
            outcome,
            submissionDate: submissionDate || null,
            sector: sector.trim() || null,
            lessonsLearned: lessonsLearned.trim() || null,
            winThemes: winThemes.split(',').map(t => t.trim()).filter(Boolean),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">
            {bid ? 'Edit Past Bid' : 'Add Past Bid'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tender Title *
              </label>
              <input
                type="text"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                placeholder="e.g., IT Support Services Framework"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Buyer Name
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g., NHS England"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contract Value (£)
              </label>
              <input
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                placeholder="e.g., 500000"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Outcome
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as PastBid['outcome'])}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="pending">Pending</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Submission Date
              </label>
              <input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sector
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g., Healthcare, IT Services, Construction"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Win Themes (comma separated)
              </label>
              <input
                type="text"
                value={winThemes}
                onChange={(e) => setWinThemes(e.target.value)}
                placeholder="e.g., Innovation, Cost Savings, Local Delivery"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lessons Learned
              </label>
              <textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="What worked well? What could be improved?"
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : bid ? 'Update' : 'Add Past Bid'}
          </button>
        </div>
      </div>
    </div>
  );
}
