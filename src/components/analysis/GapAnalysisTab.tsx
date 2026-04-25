'use client';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Props {
  gapAnalysis: Record<string, unknown> | null;
}

type DimensionStatus = 'strong' | 'good' | 'partial' | 'gap' | 'critical_gap';

const StatusBar = ({ score, benchmark }: { score: number; benchmark?: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'bg-blue-900/200';
    if (s >= 60) return 'bg-yellow-500';
    if (s >= 40) return 'bg-orange-500';
    return 'bg-red-900/200';
  };

  return (
    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`absolute h-full rounded-full transition-all ${getColor(score)}`}
        style={{ width: `${score}%` }}
      />
      {benchmark && (
        <div
          className="absolute top-0 w-0.5 h-full bg-slate-900/60 backdrop-blur-xl border-slate-700/50/50"
          style={{ left: `${benchmark}%` }}
          title={`Benchmark: ${benchmark}%`}
        />
      )}
    </div>
  );
};

const DimensionIcon = ({ status }: { status: DimensionStatus }) => {
  switch (status) {
    case 'strong':
    case 'good':
      return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    case 'partial':
      return <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />;
    case 'gap':
      return <ExclamationCircleIcon className="h-5 w-5 text-orange-400" />;
    case 'critical_gap':
      return <XCircleIcon className="h-5 w-5 text-red-400" />;
    default:
      return <ExclamationCircleIcon className="h-5 w-5 text-slate-400" />;
  }
};

export function GapAnalysisTab({ gapAnalysis }: Props) {
  if (!gapAnalysis) {
    return (
      <div className="p-8 text-center text-slate-400">
        No gap analysis data available
      </div>
    );
  }

  const overallScore = gapAnalysis.overallScore as number;
  const overallStatus = gapAnalysis.overallStatus as string;
  const bidRecommendation = gapAnalysis.bidRecommendation as string;
  const summary = gapAnalysis.summary as string;
  const dimensions = gapAnalysis.dimensions as Array<Record<string, unknown>> | undefined;
  const actionPlan = gapAnalysis.actionPlan as Array<Record<string, unknown>> | undefined;
  const strengthsToHighlight = gapAnalysis.strengthsToHighlight as Array<Record<string, unknown>> | undefined;
  const riskAssessment = gapAnalysis.riskAssessment as Record<string, unknown> | undefined;
  const visualData = gapAnalysis.visualData as Record<string, unknown> | undefined;

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'proceed':
        return 'bg-blue-900/50 text-green-300 border-blue-700';
      case 'proceed_with_caution':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'needs_work':
        return 'bg-orange-900/50 text-orange-300 border-orange-700';
      case 'do_not_bid':
        return 'bg-red-900/50 text-red-300 border-red-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Header */}
      <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Gap Analysis Score</h3>
            <p className="text-slate-400 text-sm mt-1">{summary}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{overallScore}%</div>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full border ${getRecommendationColor(
                bidRecommendation
              )}`}
            >
              {bidRecommendation?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <StatusBar score={overallScore} benchmark={70} />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Your Score</span>
          <span>|</span>
          <span>Benchmark (70%)</span>
        </div>
      </div>

      {/* Dimensions Grid */}
      {dimensions && dimensions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((dim, index) => (
            <div
              key={index}
              className="p-4 bg-slate-800/50 rounded-lg border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DimensionIcon status={dim.status as DimensionStatus} />
                  <span className="font-medium text-white text-sm">
                    {dim.name as string}
                  </span>
                </div>
                <span className="text-lg font-bold text-white">
                  {dim.score as number}%
                </span>
              </div>
              <StatusBar
                score={dim.score as number}
                benchmark={
                  (visualData?.radarChart as Array<Record<string, unknown>>)?.find(
                    (r) => r.dimension === dim.name
                  )?.benchmark as number
                }
              />

              {/* Matches Summary */}
              {(dim.matches as Array<Record<string, unknown>>)?.length > 0 && (
                <div className="mt-3 text-xs">
                  <span className="text-green-400">
                    ✓ {(dim.matches as Array<Record<string, unknown>>).length} matches
                  </span>
                </div>
              )}

              {/* Gaps Summary */}
              {(dim.gaps as Array<Record<string, unknown>>)?.length > 0 && (
                <div className="mt-1 text-xs">
                  <span className="text-red-400">
                    ✗ {(dim.gaps as Array<Record<string, unknown>>).length} gaps
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detailed Gaps */}
      {dimensions && dimensions.some((d) => ((d.gaps as Array<Record<string, unknown>>)?.length || 0) > 0) && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
            Identified Gaps
          </h3>
          <div className="space-y-4">
            {dimensions.map((dim, dimIndex) =>
              (dim.gaps as Array<Record<string, unknown>>)?.map((gap, gapIndex) => (
                <div
                  key={`${dimIndex}-${gapIndex}`}
                  className="p-4 bg-slate-900/50 rounded-lg border-l-2 border-red-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs text-slate-400">{dim.name as string}</span>
                      <div className="font-medium text-white mt-1">
                        {gap.requirement as string}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        gap.impact === 'high'
                          ? 'bg-red-900/50 text-red-300'
                          : gap.impact === 'medium'
                          ? 'bg-yellow-900/50 text-yellow-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {gap.impact as string} impact
                    </span>
                  </div>
                  <div className="text-sm text-red-300 mb-2">Gap: {gap.gap as string}</div>
                  <div className="text-sm text-blue-300">
                    → {gap.remediation as string}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Timeframe: {gap.timeframe as string}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Strengths to Highlight */}
      {strengthsToHighlight && strengthsToHighlight.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
            Strengths to Highlight
          </h3>
          <div className="space-y-3">
            {strengthsToHighlight.map((strength, index) => (
              <div
                key={index}
                className="p-4 bg-blue-900/20 rounded-lg border-blue-800"
              >
                <div className="font-medium text-white mb-1">
                  {strength.strength as string}
                </div>
                <div className="text-sm text-green-300 mb-2">
                  Evidence: {strength.evidence as string}
                </div>
                <div className="text-xs text-slate-400">
                  Use in: {strength.whereToUse as string}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {actionPlan && actionPlan.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-400" />
            Action Plan
          </h3>
          <div className="space-y-3">
            {actionPlan.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg"
              >
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    action.priority === 'critical'
                      ? 'bg-red-900 text-red-200'
                      : action.priority === 'high'
                      ? 'bg-orange-900 text-orange-200'
                      : action.priority === 'medium'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {action.priority as string}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-white">{action.action as string}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                    <span>Category: {action.category as string}</span>
                    {Boolean(action.deadline) && <span>Deadline: {action.deadline as string}</span>}
                    {Boolean(action.owner) && <span>Owner: {action.owner as string}</span>}
                  </div>
                  {Boolean(action.impact) && (
                    <div className="text-sm text-blue-300 mt-2">
                      Impact: {action.impact as string}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      {riskAssessment && (
        <div className="p-6 bg-slate-800/50 rounded-lg border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
            Risk Assessment
          </h3>

          <div className="mb-4">
            <span className="text-slate-400">Win Probability: </span>
            <span
              className={`font-medium ${
                riskAssessment.winProbability === 'high'
                  ? 'text-green-400'
                  : riskAssessment.winProbability === 'medium'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {String(riskAssessment.winProbability).toUpperCase()}
            </span>
          </div>

          {(riskAssessment.keyRisks as Array<Record<string, unknown>>)?.length > 0 && (
            <div className="space-y-3">
              {(riskAssessment.keyRisks as Array<Record<string, unknown>>).map(
                (risk, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-900/50 rounded-lg border-l-2 border-purple-500"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          risk.impact === 'high'
                            ? 'bg-red-900/50 text-red-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}
                      >
                        {risk.likelihood as string} / {risk.impact as string}
                      </span>
                      <span className="text-white">{risk.risk as string}</span>
                    </div>
                    {Boolean(risk.mitigation) && (
                      <div className="text-sm text-slate-400 mt-1">
                        Mitigation: {risk.mitigation as string}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {(riskAssessment.dealBreakers as string[])?.length > 0 && (
            <div className="mt-4 p-3 bg-red-900/30 rounded-lg border-red-700">
              <div className="text-red-300 font-medium mb-2">Deal Breakers</div>
              <ul className="space-y-1">
                {(riskAssessment.dealBreakers as string[]).map((breaker, index) => (
                  <li key={index} className="text-red-200 text-sm flex items-center gap-2">
                    <XCircleIcon className="h-4 w-4" />
                    {breaker}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
