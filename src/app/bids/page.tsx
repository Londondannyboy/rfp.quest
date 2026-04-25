'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  ChartBarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface BidSummary {
  documentId: string;
  tenderOcid: string;
  fileName: string;
  contractTitle: string | null;
  buyerName: string | null;
  submissionDeadline: string | null;
  analysisStatus: string;
  totalRequirements: number;
  completedResponses: number;
  draftResponses: number;
  completionPercentage: number;
  lastUpdated: string;
  uploadedAt: string;
}

interface Stats {
  totalBids: number;
  inProgress: number;
  completed: number;
  notStarted: number;
  upcomingDeadlines: number;
}

export default function MyBidsPage() {
  const [bids, setBids] = useState<BidSummary[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/my-bids');
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

  const filteredBids = bids.filter((bid) => {
    switch (filter) {
      case 'in_progress':
        return bid.completionPercentage > 0 && bid.completionPercentage < 100;
      case 'completed':
        return bid.completionPercentage === 100;
      case 'not_started':
        return bid.completionPercentage === 0;
      default:
        return true;
    }
  });

  const getDaysUntilDeadline = (deadline: string | null): number | null => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDeadlineStatus = (days: number | null) => {
    if (days === null) return { color: 'text-slate-400', bg: 'bg-slate-700', label: 'No deadline' };
    if (days < 0) return { color: 'text-red-400', bg: 'bg-red-900/50', label: 'Overdue' };
    if (days === 0) return { color: 'text-red-400', bg: 'bg-red-900/50', label: 'Due today' };
    if (days <= 3) return { color: 'text-red-400', bg: 'bg-red-900/50', label: `${days} days` };
    if (days <= 7) return { color: 'text-amber-400', bg: 'bg-amber-900/50', label: `${days} days` };
    return { color: 'text-slate-400', bg: 'bg-slate-700', label: `${days} days` };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'from-blue-500 to-blue-400';
    if (percentage >= 50) return 'from-blue-600 to-blue-500';
    if (percentage > 0) return 'from-amber-500 to-orange-500';
    return 'from-slate-600 to-slate-500';
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
                <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                My Bids
              </h1>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              New Bid
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-900 rounded-xl p-4 border-slate-800">
              <div className="text-2xl font-bold text-white">{stats.totalBids}</div>
              <div className="text-sm text-slate-400">Total Bids</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border-slate-800">
              <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
              <div className="text-sm text-slate-400">In Progress</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border-slate-800">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border-slate-800">
              <div className="text-2xl font-bold text-slate-400">{stats.notStarted}</div>
              <div className="text-sm text-slate-400">Not Started</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border-red-900/50">
              <div className="text-2xl font-bold text-red-400">{stats.upcomingDeadlines}</div>
              <div className="text-sm text-slate-400">Due This Week</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All Bids' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'not_started', label: 'Not Started' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-blue-600 text-white'
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
            <ArrowPathIcon className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid) => {
              const daysUntil = getDaysUntilDeadline(bid.submissionDeadline);
              const deadlineStatus = getDeadlineStatus(daysUntil);

              return (
                <Link
                  key={bid.documentId}
                  href={`/tender/${bid.tenderOcid}/analysis`}
                  className="block bg-slate-900 rounded-xl border-slate-800 p-6 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Left: Title and Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {bid.contractTitle || bid.fileName}
                      </h3>
                      {bid.buyerName && (
                        <p className="text-slate-400 text-sm mb-3">{bid.buyerName}</p>
                      )}

                      {/* Progress Bar */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(bid.completionPercentage)} transition-all`}
                            style={{ width: `${bid.completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-white font-medium text-sm w-12 text-right">
                          {bid.completionPercentage}%
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-slate-400">
                          <ChartBarIcon className="w-4 h-4" />
                          {bid.completedResponses}/{bid.totalRequirements} responses
                        </span>
                        {bid.draftResponses > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <ClockIcon className="w-4 h-4" />
                            {bid.draftResponses} drafts
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Deadline and Status */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Deadline Badge */}
                      {bid.submissionDeadline && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${deadlineStatus.bg}`}>
                          <CalendarDaysIcon className={`w-4 h-4 ${deadlineStatus.color}`} />
                          <span className={`text-sm font-medium ${deadlineStatus.color}`}>
                            {deadlineStatus.label}
                          </span>
                        </div>
                      )}

                      {/* Status Icon */}
                      {bid.completionPercentage === 100 ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircleIcon className="w-5 h-5" />
                          <span className="text-sm">Complete</span>
                        </div>
                      ) : daysUntil !== null && daysUntil <= 3 && bid.completionPercentage < 100 ? (
                        <div className="flex items-center gap-1 text-red-400">
                          <ExclamationTriangleIcon className="w-5 h-5" />
                          <span className="text-sm">Urgent</span>
                        </div>
                      ) : null}

                      {/* Last Updated */}
                      <span className="text-xs text-slate-500">
                        Updated {new Date(bid.lastUpdated).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl border-slate-800 p-12 text-center">
            <DocumentTextIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Bids Yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Start working on a tender by uploading an ITT document from the tender analysis page.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Find Tenders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
