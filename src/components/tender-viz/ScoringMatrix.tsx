'use client';

import { useState } from 'react';

interface ScoringCriterion {
  id: string;
  name: string;
  weight: number; // percentage
  maxScore: number;
  yourScore?: number;
  description?: string;
  subCriteria?: Omit<ScoringCriterion, 'subCriteria'>[];
}

interface ScoringMatrixProps {
  criteria: ScoringCriterion[];
  totalWeight?: number; // Should be 100
  priceWeight?: number; // Quality vs Price split
}

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  const percentage = (score / max) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-white w-16 text-right">
        {score}/{max}
      </span>
    </div>
  );
}

function WeightDonut({ weights }: { weights: { name: string; weight: number; color: string }[] }) {
  let accumulated = 0;
  const segments = weights.map((w) => {
    const start = accumulated;
    accumulated += w.weight;
    return { ...w, start, end: accumulated };
  });

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {segments.map((segment, i) => {
          const circumference = 2 * Math.PI * 40;
          const strokeDasharray = `${(segment.weight / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((segment.start / 100) * circumference);

          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className={segment.color}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-white">100%</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
      </div>
    </div>
  );
}

export function ScoringMatrix({ criteria, totalWeight = 100, priceWeight }: ScoringMatrixProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Calculate weighted score
  const totalPossible = criteria.reduce((acc, c) => acc + c.maxScore * (c.weight / 100), 0);
  const yourTotal = criteria.reduce((acc, c) => {
    if (c.yourScore !== undefined) {
      return acc + c.yourScore * (c.weight / 100);
    }
    return acc;
  }, 0);
  const overallPercentage = totalPossible > 0 ? Math.round((yourTotal / totalPossible) * 100) : null;

  // Colors for donut
  const colors = [
    'text-teal-500',
    'text-cyan-500',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500',
    'text-pink-500',
    'text-orange-500',
  ];

  const donutWeights = criteria.map((c, i) => ({
    name: c.name,
    weight: c.weight,
    color: colors[i % colors.length],
  }));

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Scoring Criteria</h3>
            <p className="text-sm text-slate-400 mt-1">
              Evaluation weightings and scoring breakdown
            </p>
          </div>

          {/* Weight donut */}
          <WeightDonut weights={donutWeights} />
        </div>

        {/* Price/Quality split if provided */}
        {priceWeight !== undefined && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Price vs Quality Split</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center"
                style={{ width: `${100 - priceWeight}%` }}
              >
                <span className="text-xs font-medium text-white">
                  Quality {100 - priceWeight}%
                </span>
              </div>
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center"
                style={{ width: `${priceWeight}%` }}
              >
                <span className="text-xs font-medium text-white">
                  Price {priceWeight}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Your overall score */}
        {overallPercentage !== null && (
          <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-teal-400">Your Projected Score</span>
              <span className="text-2xl font-bold text-teal-400">{overallPercentage}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Criteria list */}
      <div className="divide-y divide-slate-800">
        {criteria.map((criterion, i) => {
          const isExpanded = expandedId === criterion.id;
          const color = colors[i % colors.length].replace('text-', 'bg-');

          return (
            <div key={criterion.id}>
              <button
                className="w-full p-4 text-left hover:bg-slate-800/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : criterion.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Weight indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${colors[i % colors.length]}`}>
                        {criterion.weight}%
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium">{criterion.name}</h4>
                    {criterion.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                        {criterion.description}
                      </p>
                    )}

                    {/* Score bar if score exists */}
                    {criterion.yourScore !== undefined && (
                      <div className="mt-2">
                        <ScoreBar
                          score={criterion.yourScore}
                          max={criterion.maxScore}
                          color={color}
                        />
                      </div>
                    )}
                  </div>

                  {/* Max score */}
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Max Score</div>
                    <div className="text-lg font-semibold text-white">{criterion.maxScore}</div>
                  </div>
                </div>
              </button>

              {/* Sub-criteria */}
              {isExpanded && criterion.subCriteria && (
                <div className="px-4 pb-4 ml-16 space-y-2">
                  {criterion.subCriteria.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-white">{sub.name}</span>
                          <span className="text-xs text-slate-400 ml-2">({sub.weight}%)</span>
                        </div>
                        <span className="text-sm text-slate-400">
                          Max: {sub.maxScore}
                        </span>
                      </div>
                      {sub.yourScore !== undefined && (
                        <div className="mt-2">
                          <ScoreBar
                            score={sub.yourScore}
                            max={sub.maxScore}
                            color="bg-slate-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
