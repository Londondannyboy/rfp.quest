'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  Leaf,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Newspaper,
  Target,
  Shield,
  Calendar,
  Briefcase,
} from 'lucide-react';
import type { BuyerIntelligence } from '@/lib/hooks/use-buyer-intelligence';
import { getSentimentColor, formatRole } from '@/lib/hooks/use-buyer-intelligence';

interface BuyerIntelligencePanelProps {
  intel: BuyerIntelligence;
  compact?: boolean;
}

export function BuyerIntelligencePanel({ intel, compact = false }: BuyerIntelligencePanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const directors = intel.decisionMakers.filter(dm =>
    dm.role.toLowerCase().includes('director')
  );

  const hasRiskSignals = intel.signals.riskSignals.length > 0;
  const hasSustainability = intel.sustainability?.hasSecrContent;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {/* Company Status Badge */}
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
          <Building2 className="w-3 h-3" />
          {intel.profile.companyType.toUpperCase()}
        </span>

        {/* Decision Makers Badge */}
        {directors.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
            <Users className="w-3 h-3" />
            {directors.length} Directors
          </span>
        )}

        {/* Sustainability Badge */}
        {hasSustainability && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
            <Leaf className="w-3 h-3" />
            SECR Reported
          </span>
        )}

        {/* Risk Badge */}
        {hasRiskSignals && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
            <AlertTriangle className="w-3 h-3" />
            {intel.signals.riskSignals.length} Risk Signal{intel.signals.riskSignals.length > 1 ? 's' : ''}
          </span>
        )}

        {/* Sentiment Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(intel.signals.overallSentiment)}`}>
          {intel.signals.overallSentiment === 'positive' ? (
            <TrendingUp className="w-3 h-3" />
          ) : intel.signals.overallSentiment === 'cautious' ? (
            <Shield className="w-3 h-3" />
          ) : (
            <Target className="w-3 h-3" />
          )}
          {intel.signals.overallSentiment.charAt(0).toUpperCase() + intel.signals.overallSentiment.slice(1)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-600" />
          <h4 className="font-semibold text-slate-900">Buyer Intelligence</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(intel.signals.overallSentiment)}`}>
          {intel.signals.overallSentiment}
        </span>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase className="w-4 h-4" />
          <span>{intel.profile.companyType.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Est. {intel.profile.dateOfCreation?.split('-')[0] || 'N/A'}</span>
        </div>
      </div>

      {/* Decision Makers Section */}
      {directors.length > 0 && (
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => toggleSection('directors')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm text-slate-800">
                Decision Makers ({directors.length})
              </span>
            </div>
            {expandedSection === 'directors' ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'directors' && (
            <div className="mt-2 space-y-2">
              {directors.slice(0, 5).map((dm, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1 px-2 bg-white rounded">
                  <span className="font-medium text-slate-800">{dm.name}</span>
                  <span className="text-slate-500">{formatRole(dm.role)}</span>
                </div>
              ))}
              {directors.length > 5 && (
                <p className="text-xs text-slate-500 text-center">
                  +{directors.length - 5} more directors
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sustainability Section */}
      {intel.sustainability && (
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => toggleSection('sustainability')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Leaf className={`w-4 h-4 ${hasSustainability ? 'text-green-600' : 'text-slate-400'}`} />
              <span className="font-medium text-sm text-slate-800">
                Sustainability {hasSustainability ? '(SECR)' : ''}
              </span>
            </div>
            {expandedSection === 'sustainability' ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'sustainability' && (
            <div className="mt-2 space-y-2">
              {intel.sustainability.secrData && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {intel.sustainability.secrData.scope1Tonnes && (
                    <div className="bg-white p-2 rounded">
                      <p className="text-xs text-slate-500">Scope 1</p>
                      <p className="font-semibold text-slate-800">
                        {intel.sustainability.secrData.scope1Tonnes.toLocaleString()} tCO2e
                      </p>
                    </div>
                  )}
                  {intel.sustainability.secrData.scope2Tonnes && (
                    <div className="bg-white p-2 rounded">
                      <p className="text-xs text-slate-500">Scope 2</p>
                      <p className="font-semibold text-slate-800">
                        {intel.sustainability.secrData.scope2Tonnes.toLocaleString()} tCO2e
                      </p>
                    </div>
                  )}
                  {intel.sustainability.secrData.netZeroYear && (
                    <div className="bg-white p-2 rounded col-span-2">
                      <p className="text-xs text-slate-500">Net Zero Target</p>
                      <p className="font-semibold text-green-700">
                        {intel.sustainability.secrData.netZeroYear}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {intel.sustainability.keyFindings && intel.sustainability.keyFindings.length > 0 && (
                <div className="space-y-1">
                  {intel.sustainability.keyFindings.slice(0, 3).map((finding, i) => (
                    <p key={i} className="text-xs text-slate-600 bg-white p-2 rounded">
                      {finding}
                    </p>
                  ))}
                </div>
              )}
              {!hasSustainability && (
                <p className="text-xs text-slate-500 bg-white p-2 rounded">
                  No SECR data found in latest accounts
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Risk Signals Section */}
      {hasRiskSignals && (
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => toggleSection('risks')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm text-slate-800">
                Risk Signals ({intel.signals.riskSignals.length})
              </span>
            </div>
            {expandedSection === 'risks' ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'risks' && (
            <div className="mt-2 space-y-2">
              {intel.signals.riskSignals.map((risk, i) => (
                <div
                  key={i}
                  className={`text-sm p-2 rounded ${
                    risk.severity === 'high'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}
                >
                  <p className="font-medium text-slate-800">{risk.message}</p>
                  <p className="text-xs text-slate-600 mt-1">{risk.implication}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bid Insights Section */}
      {(intel.bidInsights.emphasize.length > 0 || intel.bidInsights.avoid.length > 0) && (
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => toggleSection('insights')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-sm text-slate-800">Bid Insights</span>
            </div>
            {expandedSection === 'insights' ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'insights' && (
            <div className="mt-2 space-y-2">
              {intel.bidInsights.emphasize.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-medium">+</span>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
              {intel.bidInsights.avoid.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-red-50 p-2 rounded">
                  <span className="text-red-600 font-medium">!</span>
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent News Section */}
      {intel.recentNews && intel.recentNews.length > 0 && (
        <div className="border-t border-slate-200 pt-3">
          <button
            onClick={() => toggleSection('news')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-slate-600" />
              <span className="font-medium text-sm text-slate-800">
                Recent News ({intel.recentNews.length})
              </span>
            </div>
            {expandedSection === 'news' ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {expandedSection === 'news' && (
            <div className="mt-2 space-y-2">
              {intel.recentNews.slice(0, 3).map((news, i) => (
                <a
                  key={i}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm bg-white p-2 rounded hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800 line-clamp-2">{news.title}</p>
                    <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{news.source}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Companies House Link */}
      <div className="border-t border-slate-200 pt-3">
        <a
          href={`https://find-and-update.company-information.service.gov.uk/company/${intel.companyNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <span>View on Companies House</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// Loading skeleton
export function BuyerIntelligenceSkeleton() {
  return (
    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-slate-200 rounded" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-6 bg-slate-200 rounded" />
        <div className="h-6 bg-slate-200 rounded" />
      </div>
      <div className="h-8 bg-slate-200 rounded" />
      <div className="h-8 bg-slate-200 rounded" />
    </div>
  );
}
