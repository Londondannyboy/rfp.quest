'use client';

import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';

interface Props {
  compliance: Record<string, unknown> | null;
}

type ComplianceStatus = 'pass' | 'fail' | 'unknown' | 'not_applicable' | 'action_required';

const StatusIcon = ({ status }: { status: ComplianceStatus }) => {
  switch (status) {
    case 'pass':
      return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    case 'fail':
      return <XCircleIcon className="h-5 w-5 text-red-400" />;
    case 'unknown':
      return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-400" />;
    case 'action_required':
      return <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />;
    case 'not_applicable':
      return <MinusCircleIcon className="h-5 w-5 text-slate-500" />;
    default:
      return <QuestionMarkCircleIcon className="h-5 w-5 text-slate-400" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    compliant: 'bg-green-900/50 text-green-300 border-green-700',
    partially_compliant: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    non_compliant: 'bg-red-900/50 text-red-300 border-red-700',
    needs_review: 'bg-orange-900/50 text-orange-300 border-orange-700',
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full border ${
        colors[status] || 'bg-slate-800 text-slate-300 border-slate-600'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export function ComplianceTab({ compliance }: Props) {
  if (!compliance) {
    return (
      <div className="p-8 text-center text-slate-400">
        No compliance data available
      </div>
    );
  }

  const overallStatus = compliance.overallStatus as string;
  const complianceScore = compliance.complianceScore as number;
  const categories = compliance.categories as Array<Record<string, unknown>> | undefined;
  const mandatoryRequirements = compliance.mandatoryRequirements as Array<Record<string, unknown>> | undefined;
  const actionItems = compliance.actionItems as Array<Record<string, unknown>> | undefined;
  const riskFactors = compliance.riskFactors as Array<Record<string, unknown>> | undefined;

  return (
    <div className="space-y-6">
      {/* Overall Status Header */}
      <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Compliance Status</h3>
            <p className="text-slate-400 text-sm">
              Based on detected requirements and your company profile
            </p>
          </div>
          <StatusBadge status={overallStatus} />
        </div>

        {/* Score Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Compliance Score</span>
            <span className="text-white font-medium">{complianceScore}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                complianceScore >= 80
                  ? 'bg-green-500'
                  : complianceScore >= 60
                  ? 'bg-yellow-500'
                  : complianceScore >= 40
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Requirements (Showstoppers) */}
      {mandatoryRequirements && mandatoryRequirements.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            Mandatory Requirements
          </h3>
          <div className="space-y-3">
            {mandatoryRequirements.map((req, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  req.status === 'fail'
                    ? 'bg-red-900/20 border border-red-800'
                    : req.status === 'pass'
                    ? 'bg-green-900/20 border border-green-800'
                    : 'bg-slate-700/50'
                }`}
              >
                <StatusIcon status={req.status as ComplianceStatus} />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {req.requirement as string}
                  </div>
                  {Boolean(req.showstopper) && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-800 text-red-200 text-xs rounded">
                      Showstopper
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="space-y-4">
          {categories.map((category, catIndex) => (
            <details
              key={catIndex}
              className="group p-4 bg-slate-800/50 rounded-lg border border-slate-700"
              open={catIndex === 0}
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <StatusIcon status={category.status as ComplianceStatus} />
                  <span className="font-medium text-white">
                    {category.name as string}
                  </span>
                </div>
                <span className="text-slate-400 text-sm group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="mt-4 space-y-2">
                {(category.items as Array<Record<string, unknown>>)?.map(
                  (item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      <StatusIcon status={item.status as ComplianceStatus} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm">
                          {item.requirement as string}
                        </div>
                        {Boolean(item.evidence) && (
                          <div className="text-green-400 text-xs mt-1">
                            ✓ {item.evidence as string}
                          </div>
                        )}
                        {Boolean(item.action) && (
                          <div className="text-orange-400 text-xs mt-1">
                            → {item.action as string}
                          </div>
                        )}
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded ${
                              item.criticality === 'mandatory'
                                ? 'bg-red-900/50 text-red-300'
                                : item.criticality === 'desirable'
                                ? 'bg-yellow-900/50 text-yellow-300'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {item.criticality as string}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Action Items */}
      {actionItems && actionItems.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">Action Items</h3>
          <div className="space-y-3">
            {actionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
              >
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    item.priority === 'high' || item.priority === 'critical'
                      ? 'bg-red-900/50 text-red-300'
                      : item.priority === 'medium'
                      ? 'bg-yellow-900/50 text-yellow-300'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {item.priority as string}
                </span>
                <div className="flex-1">
                  <div className="text-white text-sm">{item.action as string}</div>
                  <div className="flex gap-4 mt-1 text-xs text-slate-400">
                    <span>Category: {item.category as string}</span>
                    {Boolean(item.deadline) && <span>Deadline: {item.deadline as string}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors && riskFactors.length > 0 && (
        <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            Risk Factors
          </h3>
          <div className="space-y-3">
            {riskFactors.map((risk, index) => (
              <div
                key={index}
                className="p-3 bg-slate-900/50 rounded-lg border-l-2 border-yellow-500"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      risk.severity === 'high'
                        ? 'bg-red-900/50 text-red-300'
                        : risk.severity === 'medium'
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {risk.severity as string}
                  </span>
                  <span className="text-white font-medium">{risk.risk as string}</span>
                </div>
                {Boolean(risk.mitigation) && (
                  <div className="text-sm text-slate-400 mt-1">
                    Mitigation: {risk.mitigation as string}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
