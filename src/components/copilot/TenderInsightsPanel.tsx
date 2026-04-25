'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import {
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Tender {
  ocid: string;
  title: string;
  description: string | null;
  buyerName: string;
  stage: string;
  valueMax: number | null;
  tenderEndDate: string | null;
  cpvCodes: string[] | null;
  region: string | null;
}

interface InsightItem {
  type: 'opportunity' | 'risk' | 'tip' | 'action';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface TenderInsightsPanelProps {
  tender: Tender;
  matchScore?: number | null;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * AI-powered insights panel for tender analysis.
 * Uses CopilotKit to generate smart insights and recommendations.
 */
export function TenderInsightsPanel({
  tender,
  matchScore,
  isExpanded = false,
  onToggle,
}: TenderInsightsPanelProps) {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Expose tender data to CopilotKit
  useCopilotReadable({
    description: 'Current tender for AI insights analysis',
    value: {
      ocid: tender.ocid,
      title: tender.title,
      description: tender.description,
      buyer: tender.buyerName,
      stage: tender.stage,
      value: tender.valueMax,
      deadline: tender.tenderEndDate,
      sectors: tender.cpvCodes,
      region: tender.region,
      matchScore,
    },
  });

  // AI action to analyze tender
  useCopilotAction({
    name: 'analyzeTenderOpportunity',
    description: 'Analyze the tender and provide strategic insights including opportunities, risks, and action items',
    parameters: [],
    handler: async () => {
      setIsAnalyzing(true);

      // Simulate AI analysis - in real app this would call the agent
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generatedInsights: InsightItem[] = [];

      // Opportunity insights based on match score
      if (matchScore != null && matchScore >= 70) {
        generatedInsights.push({
          type: 'opportunity',
          title: 'Strong Profile Match',
          description: `Your company profile matches ${matchScore}% of this tender's requirements. This is a prime opportunity to bid.`,
          priority: 'high',
        });
      }

      // Value insight
      if (tender.valueMax && tender.valueMax >= 1000000) {
        generatedInsights.push({
          type: 'opportunity',
          title: 'High-Value Contract',
          description: `£${(tender.valueMax / 1000000).toFixed(1)}M+ contract value presents significant revenue opportunity.`,
          priority: 'high',
        });
      }

      // Deadline risk
      if (tender.tenderEndDate) {
        const daysLeft = Math.ceil(
          (new Date(tender.tenderEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (daysLeft <= 7 && daysLeft > 0) {
          generatedInsights.push({
            type: 'risk',
            title: 'Tight Deadline',
            description: `Only ${daysLeft} days until submission deadline. Prioritize this bid immediately.`,
            priority: 'high',
          });
        } else if (daysLeft <= 14) {
          generatedInsights.push({
            type: 'tip',
            title: 'Plan Your Timeline',
            description: `${daysLeft} days remaining. Start drafting responses and gathering evidence now.`,
            priority: 'medium',
          });
        }
      }

      // Sector-specific tips
      if (tender.cpvCodes && tender.cpvCodes.length > 0) {
        const firstCode = tender.cpvCodes[0];
        if (firstCode.startsWith('72')) {
          generatedInsights.push({
            type: 'tip',
            title: 'IT Services Focus',
            description: 'Emphasize digital transformation experience, security certifications, and agile delivery methodology.',
            priority: 'medium',
          });
        } else if (firstCode.startsWith('45')) {
          generatedInsights.push({
            type: 'tip',
            title: 'Construction Requirements',
            description: 'Highlight health & safety record, sustainability commitments, and relevant project experience.',
            priority: 'medium',
          });
        }
      }

      // Action items
      generatedInsights.push({
        type: 'action',
        title: 'Review Full Requirements',
        description: 'Download the tender pack and identify all mandatory requirements and evaluation criteria.',
        priority: 'high',
      });

      generatedInsights.push({
        type: 'action',
        title: 'Check Experience Evidence',
        description: 'Prepare case studies and references that demonstrate relevant past performance.',
        priority: 'medium',
      });

      setInsights(generatedInsights);
      setIsAnalyzing(false);
      setAnalysisComplete(true);

      return `Generated ${generatedInsights.length} insights for ${tender.title}`;
    },
  });

  const iconForType = (type: InsightItem['type']) => {
    switch (type) {
      case 'opportunity': return <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />;
      case 'risk': return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
      case 'tip': return <LightBulbIcon className="w-5 h-5 text-amber-400" />;
      case 'action': return <ClipboardDocumentListIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const bgForType = (type: InsightItem['type']) => {
    switch (type) {
      case 'opportunity': return 'bg-green-900/200/10 border-green-500/30';
      case 'risk': return 'bg-red-900/200/10 border-red-500/30';
      case 'tip': return 'bg-amber-900/200/10 border-amber-500/30';
      case 'action': return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  if (!isExpanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/30 to-teal-900/30 rounded-xl border-purple-500/20 hover:border-purple-500/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-white">AI Insights</h3>
            <p className="text-xs text-slate-400">Get smart analysis for this tender</p>
          </div>
        </div>
        <BoltIcon className="w-5 h-5 text-purple-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-900 rounded-xl border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">AI Tender Insights</h3>
            <p className="text-xs text-slate-400">Powered by RFP.quest AI</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {!analysisComplete ? (
          <div className="text-center py-6">
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
                  <SparklesIcon className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span className="text-sm text-purple-300">Analyzing tender...</span>
                </div>
                <p className="text-xs text-slate-500">AI is reviewing requirements and generating insights</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Get AI-powered analysis of this tender including opportunities, risks, and strategic recommendations.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsAnalyzing(true);
                    // Trigger the CopilotKit action
                    setTimeout(() => {
                      const evt = new CustomEvent('copilot:action', {
                        detail: { action: 'analyzeTenderOpportunity' }
                      });
                      window.dispatchEvent(evt);
                    }, 100);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <SparklesIcon className="w-5 h-5" />
                  Generate Insights
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-lg border ${bgForType(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {iconForType(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                        {insight.priority === 'high' && (
                          <span className="px-1.5 py-0.5 bg-red-900/200/20 text-red-400 rounded text-[10px] font-medium">
                            HIGH
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-3 border-t border-slate-700">
              <button
                onClick={() => {
                  setInsights([]);
                  setAnalysisComplete(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Refresh analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Compact AI action button that triggers the insights panel
 */
export function AIInsightsButton({
  tender,
  matchScore,
}: {
  tender: Tender;
  matchScore?: number | null;
}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPanel(!showPanel)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          showPanel
            ? 'bg-purple-600 text-white'
            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
        }`}
      >
        <SparklesIcon className="w-4 h-4" />
        AI Insights
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 z-50"
          >
            <TenderInsightsPanel
              tender={tender}
              matchScore={matchScore}
              isExpanded={true}
              onToggle={() => setShowPanel(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Smart bid recommendation card
 */
export function BidRecommendationCard({
  tender,
  matchScore,
}: {
  tender: Tender;
  matchScore: number | null;
}) {
  const recommendation = useMemo(() => {
    if (matchScore === null) {
      return {
        action: 'complete_profile',
        title: 'Complete Your Profile',
        description: 'Set up your company profile to get personalized bid recommendations.',
        color: 'slate',
      };
    }

    if (matchScore >= 75) {
      return {
        action: 'bid',
        title: 'Strong Bid Recommended',
        description: 'Your profile strongly matches this opportunity. Prioritize this tender.',
        color: 'green',
      };
    }

    if (matchScore >= 50) {
      return {
        action: 'consider',
        title: 'Worth Considering',
        description: 'Moderate match. Review requirements carefully before committing resources.',
        color: 'amber',
      };
    }

    return {
      action: 'caution',
      title: 'Low Match Score',
      description: 'This tender may not be the best fit. Consider other opportunities.',
      color: 'red',
    };
  }, [matchScore]);

  const colorClasses = {
    green: 'bg-green-900/200/10 border-green-500/30 text-green-400',
    amber: 'bg-amber-900/200/10 border-amber-500/30 text-amber-400',
    red: 'bg-red-900/200/10 border-red-500/30 text-red-400',
    slate: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${colorClasses[recommendation.color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-start gap-3">
        {recommendation.action === 'bid' && <CheckCircleIcon className="w-6 h-6 shrink-0" />}
        {recommendation.action === 'consider' && <LightBulbIcon className="w-6 h-6 shrink-0" />}
        {recommendation.action === 'caution' && <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />}
        {recommendation.action === 'complete_profile' && <UserGroupIcon className="w-6 h-6 shrink-0" />}
        <div>
          <h3 className="font-medium text-white">{recommendation.title}</h3>
          <p className="text-sm opacity-80 mt-1">{recommendation.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
