'use client';

import { useState, useCallback } from 'react';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AnalysisTabs } from '@/components/analysis/AnalysisTabs';
import { SummaryTab } from '@/components/analysis/SummaryTab';
import { ComplianceTab } from '@/components/analysis/ComplianceTab';
import { GapAnalysisTab } from '@/components/analysis/GapAnalysisTab';

export interface Tender {
  ocid: string;
  slug: string;
  title: string;
  description: string | null;
  stage: 'planning' | 'tender' | 'award' | 'contract';
  status: string | null;
  buyerName: string;
  buyerId: string | null;
  valueMin: number | null;
  valueMax: number | null;
  valueCurrency: string;
  tenderStartDate: string | null;
  tenderEndDate: string | null;
  contractStartDate: string | null;
  contractEndDate: string | null;
  publishedDate: string;
  cpvCodes: string[] | null;
  region: string | null;
}

export interface ExistingAnalysis {
  id: string;
  status: string;
  frameworkType: string | null;
  summary: Record<string, unknown> | null;
  compliance: Record<string, unknown> | null;
  gapAnalysis: Record<string, unknown> | null;
  createdAt: string;
  completedAt: string | null;
}

interface Props {
  tender: Tender;
  existingAnalysis: ExistingAnalysis | null;
}

type TabId = 'summary' | 'compliance' | 'gap-analysis';

function AnalysisContent({ tender, existingAnalysis }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ExistingAnalysis | null>(existingAnalysis);

  // Share tender context with CopilotKit
  useCopilotReadable({
    description: 'The tender being analyzed',
    value: {
      ocid: tender.ocid,
      title: tender.title,
      description: tender.description,
      buyer: tender.buyerName,
      stage: tender.stage,
      valueMin: tender.valueMin,
      valueMax: tender.valueMax,
      currency: tender.valueCurrency,
      deadline: tender.tenderEndDate,
      published: tender.publishedDate,
      region: tender.region,
      cpvCodes: tender.cpvCodes,
    },
  });

  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Call the analysis API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderOcid: tender.ocid }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [tender.ocid]);

  const formatValue = (value: number | null): string => {
    if (!value) return 'TBC';
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
    return `£${value}`;
  };

  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: '📊' },
    { id: 'compliance' as const, label: 'Compliance', icon: '✅' },
    { id: 'gap-analysis' as const, label: 'Gap Analysis', icon: '📈' },
  ];

  const hasAnalysis = analysis && analysis.status === 'completed';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/tender/${tender.slug}`}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Tender</span>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <h1 className="text-lg font-semibold text-white truncate max-w-md">
                  {tender.title}
                </h1>
                <p className="text-sm text-slate-400">
                  {tender.buyerName} • {formatValue(tender.valueMax)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Framework Badge */}
              {analysis?.frameworkType && (
                <span className="px-3 py-1 bg-teal-900/50 text-teal-300 text-sm rounded-full border border-teal-700">
                  {analysis.frameworkType.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}

              {/* Analysis Status */}
              {analysis?.status === 'completed' && (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircleIcon className="h-4 w-4" />
                  Analysis Complete
                </span>
              )}
              {analysis?.status === 'pending' && (
                <span className="flex items-center gap-1 text-yellow-400 text-sm">
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              )}

              {/* Start/Refresh Analysis Button */}
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : hasAnalysis ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5" />
                    Refresh Analysis
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasAnalysis ? (
          /* No Analysis State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                AI-Powered Tender Analysis
              </h2>
              <p className="text-slate-400 mb-6">
                Get instant insights on compliance requirements, identify gaps in your
                capabilities, and receive actionable recommendations to strengthen your bid.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium text-white">Summary</div>
                  <div className="text-slate-400 text-xs mt-1">
                    Key dates & buyer insights
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-medium text-white">Compliance</div>
                  <div className="text-slate-400 text-xs mt-1">
                    Requirements checklist
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-medium text-white">Gap Analysis</div>
                  <div className="text-slate-400 text-xs mt-1">
                    Your profile vs requirements
                  </div>
                </div>
              </div>

              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Starting Analysis...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Analyze This Tender
                  </>
                )}
              </button>

              {!isAnalyzing && (
                <p className="text-slate-500 text-sm mt-4">
                  Analysis typically takes 30-60 seconds
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div>
            {/* Tabs */}
            <AnalysisTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'summary' && (
                <SummaryTab
                  summary={analysis.summary as Record<string, unknown>}
                  tender={tender}
                />
              )}
              {activeTab === 'compliance' && (
                <ComplianceTab
                  compliance={analysis.compliance as Record<string, unknown>}
                />
              )}
              {activeTab === 'gap-analysis' && (
                <GapAnalysisTab
                  gapAnalysis={analysis.gapAnalysis as Record<string, unknown>}
                />
              )}
            </div>

            {/* Analysis Metadata */}
            <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700 text-sm text-slate-400">
              <div className="flex items-center justify-between">
                <span>
                  Analysis ID: <code className="text-slate-300">{analysis.id}</code>
                </span>
                <span>
                  Completed:{' '}
                  {analysis.completedAt
                    ? new Date(analysis.completedAt).toLocaleString()
                    : 'In progress'}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export function AnalysisPageClient({ tender, existingAnalysis }: Props) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="tender_analyzer">
      <CopilotSidebar
        labels={{
          title: 'Analysis Assistant',
          initial: `I can help you understand this tender analysis. Ask me about compliance requirements, gap analysis recommendations, or how to strengthen your bid.`,
        }}
        defaultOpen={false}
      >
        <AnalysisContent tender={tender} existingAnalysis={existingAnalysis} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
