'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrophyIcon,
  CurrencyPoundIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface IntelligenceData {
  company_name: string;
  company_number: string;
  financial_health_score: number;
  financial_health_rating: string;
  annual_revenue?: number;
  profit_margin?: number;
  employee_count?: number;
  revenue_growth_yoy?: number;
  current_ratio?: number;
  risk_score: number;
  going_concern_issues: boolean;
  esg_score: number;
  secr_compliant: boolean;
  competitive_threat_level: string;
  recommended_for_partnership: boolean;
  extraction_confidence_pct: number;
}

interface IntelligenceDashboardProps {
  companyNumber: string;
  companyName: string;
  onDataLoaded?: (data: IntelligenceData) => void;
}

export function IntelligenceDashboard({
  companyNumber,
  companyName,
  onDataLoaded,
}: IntelligenceDashboardProps) {
  const [intelligence, setIntelligence] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'risk' | 'esg' | 'competitive'>('overview');

  useEffect(() => {
    loadIntelligence();
  }, [companyNumber]);

  const loadIntelligence = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/clay/intelligence?company_number=${encodeURIComponent(companyNumber)}&company_name=${encodeURIComponent(companyName)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load intelligence: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Intelligence extraction failed');
      }

      setIntelligence(data.company);
      onDataLoaded?.(data.company);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IntelligenceLoadingSkeleton />;
  }

  if (error || !intelligence) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-red-200 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Intelligence Extraction Failed</h3>
            <p className="text-sm text-red-500 mt-1">
              {error || 'Unable to extract company intelligence'}
            </p>
          </div>
        </div>
        <button
          onClick={loadIntelligence}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Retry Extraction
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Key Scores */}
      <IntelligenceHeader intelligence={intelligence} />
      
      {/* Navigation Tabs */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-700/50">
        <div className="border-b border-slate-700/50">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'financial', label: 'Financial', icon: CurrencyPoundIcon },
              { id: 'risk', label: 'Risk', icon: ShieldCheckIcon },
              { id: 'esg', label: 'ESG', icon: SparklesIcon },
              { id: 'competitive', label: 'Competitive', icon: TrophyIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-slate-600/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <AnimatedTabContent activeTab={activeTab} intelligence={intelligence} />
        </div>
      </div>
    </div>
  );
}

function IntelligenceHeader({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl text-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{intelligence.company_name}</h2>
          <p className="text-blue-100 text-sm">Company #{intelligence.company_number}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-200">Confidence:</span>
          <span className="text-sm font-semibold">{intelligence.extraction_confidence_pct}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <ScoreCard
          title="Financial Health"
          score={intelligence.financial_health_score}
          rating={intelligence.financial_health_rating}
          color="emerald"
        />
        <ScoreCard
          title="Risk Score" 
          score={intelligence.risk_score}
          rating={getRiskRating(intelligence.risk_score)}
          color="orange"
        />
        <ScoreCard
          title="ESG Score"
          score={intelligence.esg_score}
          rating={getESGRating(intelligence.esg_score)}
          color="green"
        />
        <ThreatLevelCard intelligence={intelligence} />
      </div>
    </div>
  );
}

function ScoreCard({ 
  title, 
  score, 
  rating, 
  color 
}: { 
  title: string; 
  score: number; 
  rating: string; 
  color: 'emerald' | 'orange' | 'green';
}) {
  const colorClasses = {
    emerald: 'text-emerald-200 bg-emerald-500/20',
    orange: 'text-orange-200 bg-orange-500/20', 
    green: 'text-green-200 bg-green-900/200/20',
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{title}</span>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="w-full bg-slate-900/60 backdrop-blur-xl border-slate-700/50/20 rounded-full h-1.5">
        <div 
          className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-full h-1.5 transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs opacity-75 mt-1 block">{rating}</span>
    </div>
  );
}

function ThreatLevelCard({ intelligence }: { intelligence: IntelligenceData }) {
  const threatColors = {
    High: 'text-red-200 bg-red-900/200/20',
    Medium: 'text-yellow-200 bg-yellow-500/20',
    Low: 'text-green-200 bg-green-900/200/20',
    Minimal: 'text-blue-200 bg-blue-500/20',
  };

  const colorClass = threatColors[intelligence.competitive_threat_level as keyof typeof threatColors] 
    || threatColors.Low;

  return (
    <div className={`rounded-lg p-4 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">Competitive Threat</span>
        <TrophyIcon className="w-5 h-5" />
      </div>
      <span className="text-xl font-bold block">{intelligence.competitive_threat_level}</span>
      <span className="text-xs opacity-75 mt-1 block">
        {intelligence.recommended_for_partnership ? 'Partnership Ready' : 'Approach Carefully'}
      </span>
    </div>
  );
}

function AnimatedTabContent({ 
  activeTab, 
  intelligence 
}: { 
  activeTab: string; 
  intelligence: IntelligenceData; 
}) {
  const tabContent = {
    overview: <OverviewTab intelligence={intelligence} />,
    financial: <FinancialTab intelligence={intelligence} />,
    risk: <RiskTab intelligence={intelligence} />,
    esg: <ESGTab intelligence={intelligence} />,
    competitive: <CompetitiveTab intelligence={intelligence} />,
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {tabContent[activeTab as keyof typeof tabContent]}
    </motion.div>
  );
}

function OverviewTab({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Annual Revenue"
          value={intelligence.annual_revenue ? `£${(intelligence.annual_revenue / 1000000).toFixed(1)}M` : 'N/A'}
          trend={intelligence.revenue_growth_yoy}
        />
        <MetricCard
          title="Employees"
          value={intelligence.employee_count?.toLocaleString() || 'N/A'}
        />
        <MetricCard
          title="Profit Margin"
          value={intelligence.profit_margin ? `${intelligence.profit_margin.toFixed(1)}%` : 'N/A'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickInsights intelligence={intelligence} />
        <ActionRecommendations intelligence={intelligence} />
      </div>
    </div>
  );
}

function FinancialTab({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
          <h4 className="font-semibold text-slate-100 mb-3">Revenue Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Annual Revenue:</span>
              <span className="font-semibold">
                {intelligence.annual_revenue 
                  ? `£${(intelligence.annual_revenue / 1000000).toFixed(1)}M`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Growth Rate:</span>
              <div className="flex items-center gap-1">
                {intelligence.revenue_growth_yoy !== undefined && (
                  <>
                    {intelligence.revenue_growth_yoy > 0 ? (
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      intelligence.revenue_growth_yoy > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {intelligence.revenue_growth_yoy.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Profit Margin:</span>
              <span className="font-semibold">
                {intelligence.profit_margin ? `${intelligence.profit_margin.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
          <h4 className="font-semibold text-slate-100 mb-3">Liquidity & Stability</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Current Ratio:</span>
              <span className="font-semibold">
                {intelligence.current_ratio ? intelligence.current_ratio.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Employee Count:</span>
              <span className="font-semibold">
                {intelligence.employee_count?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Health Rating:</span>
              <span className={`font-semibold ${
                intelligence.financial_health_score >= 70 ? 'text-green-600' :
                intelligence.financial_health_score >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {intelligence.financial_health_rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskTab({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">Risk Assessment</h4>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            {intelligence.going_concern_issues ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}
            <div>
              <span className="font-medium">Going Concern</span>
              <p className="text-sm text-slate-300">
                {intelligence.going_concern_issues 
                  ? 'Material uncertainties identified'
                  : 'No concerns identified'
                }
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Risk Score</span>
              <span className="text-2xl font-bold text-slate-100">
                {intelligence.risk_score}
              </span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2">
              <div 
                className={`rounded-full h-2 ${
                  intelligence.risk_score >= 70 ? 'bg-green-900/200' :
                  intelligence.risk_score >= 50 ? 'bg-yellow-500' :
                  'bg-red-900/200'
                }`}
                style={{ width: `${intelligence.risk_score}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {getRiskRating(intelligence.risk_score)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">Risk Recommendations</h4>
          <div className="space-y-2">
            {getRiskRecommendations(intelligence).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded bg-blue-50">
                <InformationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-900">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ESGTab({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">ESG Compliance</h4>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            {intelligence.secr_compliant ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            )}
            <div>
              <span className="font-medium">SECR Compliance</span>
              <p className="text-sm text-slate-300">
                {intelligence.secr_compliant 
                  ? 'Compliant with energy reporting'
                  : 'Status unknown or non-compliant'
                }
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">ESG Score</span>
              <span className="text-2xl font-bold text-slate-100">
                {intelligence.esg_score}
              </span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2">
              <div 
                className="bg-green-900/200 rounded-full h-2"
                style={{ width: `${intelligence.esg_score}%` }}
              />
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {getESGRating(intelligence.esg_score)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">Public Sector Readiness</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
              <span className="text-sm">SECR Compliant</span>
              {intelligence.secr_compliant ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              {intelligence.secr_compliant 
                ? 'Ready for public sector bids requiring sustainability reporting'
                : 'May face challenges in sustainability-focused public sector bids'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitiveTab({ intelligence }: { intelligence: IntelligenceData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">Competitive Assessment</h4>
          
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-purple-900">Threat Level</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                intelligence.competitive_threat_level === 'High' ? 'bg-red-100 text-red-800' :
                intelligence.competitive_threat_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                intelligence.competitive_threat_level === 'Low' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {intelligence.competitive_threat_level}
              </span>
            </div>
            <p className="text-sm text-purple-700">
              {getCompetitiveInsight(intelligence)}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            <div className="flex items-center gap-2 mb-2">
              <UserGroupIcon className="w-4 h-4 text-slate-300" />
              <span className="font-medium">Partnership Potential</span>
            </div>
            <p className="text-sm text-slate-200">
              {intelligence.recommended_for_partnership 
                ? 'Recommended for strategic partnerships and collaborations'
                : 'Approach partnerships with caution due to risk factors'
              }
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-100">Bidding Strategy</h4>
          <div className="space-y-2">
            {getBiddingRecommendations(intelligence).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded bg-blue-50">
                <TrophyIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-900">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function MetricCard({ 
  title, 
  value, 
  trend 
}: { 
  title: string; 
  value: string; 
  trend?: number; 
}) {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{title}</span>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
            ) : trend < 0 ? (
              <ArrowTrendingDownIcon className="w-3 h-3 text-red-600" />
            ) : null}
            <span className={`text-xs ${
              trend > 0 ? 'text-green-600' : 
              trend < 0 ? 'text-red-600' : 
              'text-slate-500'
            }`}>
              {trend > 0 ? '+' : ''}{trend?.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <span className="text-2xl font-bold text-slate-100">{value}</span>
    </div>
  );
}

function QuickInsights({ intelligence }: { intelligence: IntelligenceData }) {
  const insights = [
    {
      icon: CheckCircleIcon,
      color: 'text-green-600',
      text: `${intelligence.financial_health_rating} financial health`,
    },
    {
      icon: intelligence.going_concern_issues ? ExclamationTriangleIcon : CheckCircleIcon,
      color: intelligence.going_concern_issues ? 'text-yellow-600' : 'text-green-600',
      text: intelligence.going_concern_issues ? 'Going concern issues' : 'Financially stable',
    },
    {
      icon: intelligence.secr_compliant ? CheckCircleIcon : ExclamationTriangleIcon,
      color: intelligence.secr_compliant ? 'text-green-600' : 'text-yellow-600',
      text: intelligence.secr_compliant ? 'SECR compliant' : 'SECR status unclear',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-4">
      <h4 className="font-semibold text-slate-100 mb-3">Quick Insights</h4>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center gap-2">
            <insight.icon className={`w-4 h-4 ${insight.color}`} />
            <span className="text-sm text-slate-200">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionRecommendations({ intelligence }: { intelligence: IntelligenceData }) {
  const actions = getActionRecommendations(intelligence);

  return (
    <div className="bg-blue-50 rounded-lg p-4 border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-3">Recommended Actions</h4>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <div key={index} className="flex items-start gap-2">
            <SparklesIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-blue-900">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntelligenceLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-800/60 rounded-xl h-48"></div>
      <div className="bg-slate-800/60 rounded-xl h-64"></div>
    </div>
  );
}

// Helper functions
function getRiskRating(score: number): string {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Moderate Risk';
  if (score >= 40) return 'High Risk';
  return 'Very High Risk';
}

function getESGRating(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function getCompetitiveInsight(intelligence: IntelligenceData): string {
  switch (intelligence.competitive_threat_level) {
    case 'High':
      return 'Strong financial position and large scale operations make this a formidable competitor';
    case 'Medium':
      return 'Solid competitor with good capabilities - prepare strong differentiation';
    case 'Low':
      return 'Manageable competition - focus on your unique strengths';
    default:
      return 'Limited competitive threat - opportunity for aggressive positioning';
  }
}

function getRiskRecommendations(intelligence: IntelligenceData): string[] {
  const recommendations = [];
  
  if (intelligence.going_concern_issues) {
    recommendations.push('Avoid partnerships due to going concern issues');
    recommendations.push('Monitor financial stability closely');
  }
  
  if (intelligence.risk_score < 50) {
    recommendations.push('Require additional financial guarantees');
    recommendations.push('Consider shorter contract terms');
  } else if (intelligence.risk_score >= 70) {
    recommendations.push('Low risk partner - suitable for long-term contracts');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Standard risk management procedures apply');
  }
  
  return recommendations;
}

function getBiddingRecommendations(intelligence: IntelligenceData): string[] {
  const recommendations = [];
  
  if (intelligence.competitive_threat_level === 'High') {
    recommendations.push('Prepare robust technical differentiation');
    recommendations.push('Consider competitive pricing strategy');
    recommendations.push('Emphasize unique value propositions');
  } else if (intelligence.competitive_threat_level === 'Low') {
    recommendations.push('Opportunity for premium pricing');
    recommendations.push('Focus on quality and service excellence');
  }
  
  if (intelligence.recommended_for_partnership) {
    recommendations.push('Consider joint bidding opportunities');
  } else {
    recommendations.push('Proceed as direct competitor');
  }
  
  return recommendations;
}

function getActionRecommendations(intelligence: IntelligenceData): string[] {
  const actions = [];
  
  if (intelligence.financial_health_score < 50) {
    actions.push('Request additional financial documentation');
  }
  
  if (!intelligence.secr_compliant) {
    actions.push('Verify sustainability reporting requirements');
  }
  
  if (intelligence.competitive_threat_level === 'High') {
    actions.push('Develop competitive response strategy');
  }
  
  if (intelligence.recommended_for_partnership) {
    actions.push('Explore partnership opportunities');
  }
  
  if (actions.length === 0) {
    actions.push('Monitor for business development opportunities');
  }
  
  return actions;
}

export type { IntelligenceData };