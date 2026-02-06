'use client';

import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Risk {
  id: string;
  category: string;
  title: string;
  description: string;
  level: RiskLevel;
  mitigation?: string;
}

interface RiskAssessmentProps {
  risks: Risk[];
  overallScore: number; // 0-100, higher is better (less risky)
}

const riskColors: Record<RiskLevel, { bg: string; text: string; border: string; icon: string }> = {
  low: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: 'text-green-500' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: 'text-yellow-500' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', icon: 'text-orange-500' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: 'text-red-500' },
};

function RiskIcon({ level }: { level: RiskLevel }) {
  const color = riskColors[level];

  switch (level) {
    case 'low':
      return <CheckCircleIcon className={`w-5 h-5 ${color.icon}`} />;
    case 'medium':
      return <InformationCircleIcon className={`w-5 h-5 ${color.icon}`} />;
    case 'high':
      return <ExclamationTriangleIcon className={`w-5 h-5 ${color.icon}`} />;
    case 'critical':
      return <XCircleIcon className={`w-5 h-5 ${color.icon}`} />;
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-400';
  if (score >= 60) return 'from-yellow-500 to-amber-400';
  if (score >= 40) return 'from-orange-500 to-amber-500';
  return 'from-red-500 to-rose-400';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Moderate Risk';
  if (score >= 40) return 'Elevated Risk';
  return 'High Risk';
}

export function RiskAssessment({ risks, overallScore }: RiskAssessmentProps) {
  const riskCounts = risks.reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    return acc;
  }, {} as Record<RiskLevel, number>);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header with overall score */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
            <p className="text-sm text-slate-400 mt-1">
              AI-powered analysis of bid risks and concerns
            </p>
          </div>

          {/* Score gauge */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-xs text-slate-400">{getScoreLabel(overallScore)}</div>
            </div>

            {/* Circular gauge */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 176} 176`}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className={`${getScoreGradient(overallScore).includes('green') ? 'text-green-500' : getScoreGradient(overallScore).includes('yellow') ? 'text-yellow-500' : getScoreGradient(overallScore).includes('orange') ? 'text-orange-500' : 'text-red-500'}`} stopColor="currentColor" />
                    <stop offset="100%" className={`${getScoreGradient(overallScore).includes('emerald') ? 'text-emerald-400' : getScoreGradient(overallScore).includes('amber') ? 'text-amber-400' : 'text-rose-400'}`} stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Risk level summary */}
        <div className="flex gap-4 mt-4">
          {(['critical', 'high', 'medium', 'low'] as RiskLevel[]).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <RiskIcon level={level} />
              <span className="text-sm text-slate-400">
                {riskCounts[level] || 0} {level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk list */}
      <div className="divide-y divide-slate-800">
        {risks.map((risk) => {
          const colors = riskColors[risk.level];

          return (
            <div key={risk.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <RiskIcon level={risk.level} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
                      {risk.category}
                    </span>
                    <span className={`text-xs uppercase font-semibold ${colors.text}`}>
                      {risk.level}
                    </span>
                  </div>

                  <h4 className="text-white font-medium mt-2">{risk.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{risk.description}</p>

                  {risk.mitigation && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="text-xs font-medium text-teal-400 mb-1">
                        Suggested Mitigation
                      </div>
                      <p className="text-sm text-slate-300">{risk.mitigation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {risks.length === 0 && (
        <div className="p-8 text-center">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-white font-medium">No significant risks identified</p>
          <p className="text-sm text-slate-400 mt-1">This opportunity appears straightforward</p>
        </div>
      )}
    </div>
  );
}
