'use client';

import { useState } from 'react';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface MatchBreakdown {
  category: string;
  weight: number;
  score: number;
  details: string;
}

interface MatchResult {
  overallScore: number;
  breakdown: MatchBreakdown[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface MatchAnalysisCardProps {
  ocid: string;
}

function ScoreGauge({ score }: { score: number }) {
  // Calculate stroke-dashoffset for the circular progress
  const circumference = 2 * Math.PI * 45; // radius of 45
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-red-500';
  if (score >= 70) colorClass = 'text-green-500';
  else if (score >= 50) colorClass = 'text-yellow-500';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-700"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colorClass}`}>{score}%</span>
        <span className="text-xs text-slate-400">Match</span>
      </div>
    </div>
  );
}

function BreakdownBar({ item }: { item: MatchBreakdown }) {
  let colorClass = 'bg-red-500';
  if (item.score >= 70) colorClass = 'bg-green-500';
  else if (item.score >= 50) colorClass = 'bg-yellow-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{item.category}</span>
        <span className="text-slate-400">{item.score}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${item.score}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{item.details}</p>
    </div>
  );
}

export function MatchAnalysisCard({ ocid }: MatchAnalysisCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/match-analysis?ocid=${encodeURIComponent(ocid)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze match');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-6 h-6 text-teal-400" />
          <h3 className="text-lg font-semibold text-white">Company Match Analysis</h3>
        </div>

        <p className="text-slate-400 text-sm mb-4">
          Analyze how well this tender matches your company profile and capabilities.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Analyze Match
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 space-y-6">
      {/* Header with score */}
      <div className="flex items-start gap-6">
        <ScoreGauge score={result.overallScore} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">Match Analysis</h3>
          <p className="text-slate-400 text-sm">
            {result.overallScore >= 70
              ? 'Strong match with your company profile'
              : result.overallScore >= 50
              ? 'Moderate match - review requirements'
              : 'Low match - may require additional capabilities'}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Score Breakdown</h4>
        {result.breakdown.map((item) => (
          <BreakdownBar key={item.category} item={item} />
        ))}
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            Strengths
          </h4>
          <ul className="space-y-1">
            {result.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-slate-300 pl-6">
                • {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {result.gaps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yellow-400 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            Gaps
          </h4>
          <ul className="space-y-1">
            {result.gaps.map((gap, i) => (
              <li key={i} className="text-sm text-slate-300 pl-6">
                • {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-teal-400 flex items-center gap-2">
            <LightBulbIcon className="w-4 h-4" />
            Recommendations
          </h4>
          <ul className="space-y-1">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-slate-300 pl-6">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Re-analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
      >
        <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Re-analyze
      </button>
    </div>
  );
}
