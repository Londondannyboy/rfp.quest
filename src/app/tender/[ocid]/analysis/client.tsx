'use client';

import { useState, useCallback, useEffect } from 'react';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  SparklesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  LightBulbIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import { AnalysisTabs } from '@/components/analysis/AnalysisTabs';
import { SummaryTab } from '@/components/analysis/SummaryTab';
import { ComplianceTab } from '@/components/analysis/ComplianceTab';
import { GapAnalysisTab } from '@/components/analysis/GapAnalysisTab';
import { DocumentUpload } from '@/components/tender/DocumentUpload';
import { RequirementsList } from '@/components/tender/RequirementsList';

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

interface TenderRequirement {
  id: string;
  number: string;
  title: string;
  description: string;
  type: 'mandatory' | 'desirable' | 'informational';
  wordLimit?: number;
  weighting?: number;
  scoringCriteria?: string;
  responseStatus?: 'not_started' | 'draft' | 'review' | 'complete';
  currentWordCount?: number;
}

interface TenderAnalysisResult {
  summary?: string;
  evaluationMethodology?: string;
  keyThemes?: string[];
  suggestedApproach?: string;
}

interface Props {
  tender: Tender;
  existingAnalysis: ExistingAnalysis | null;
}

type TabId = 'write' | 'summary' | 'compliance' | 'gap-analysis' | 'documents';

function AnalysisContent({ tender, existingAnalysis }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('write');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ExistingAnalysis | null>(existingAnalysis);
  const [requirements, setRequirements] = useState<TenderRequirement[]>([]);
  const [tenderAnalysis, setTenderAnalysis] = useState<TenderAnalysisResult | null>(null);
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(true);
  const [analyzedDocumentId, setAnalyzedDocumentId] = useState<string | null>(null);

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

  // Load existing requirements or auto-extract on mount
  useEffect(() => {
    loadOrExtractRequirements();
  }, [tender.ocid]);

  const loadOrExtractRequirements = async () => {
    setIsLoadingRequirements(true);
    try {
      // First, check if we have existing requirements
      const response = await fetch(`/api/analyze-tender?ocid=${tender.ocid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.hasRequirements && data.requirements.length > 0) {
          // Cast requirements to proper type
          const typedRequirements: TenderRequirement[] = data.requirements.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            number: r.number as string,
            title: r.title as string,
            description: r.description as string,
            type: (r.type as string) === 'mandatory' || (r.type as string) === 'desirable' || (r.type as string) === 'informational'
              ? (r.type as TenderRequirement['type'])
              : 'mandatory',
            wordLimit: r.wordLimit as number | undefined,
            weighting: r.weighting as number | undefined,
            scoringCriteria: r.scoringCriteria as string | undefined,
            responseStatus: r.response ? ((r.response as Record<string, unknown>).status as TenderRequirement['responseStatus']) : undefined,
            currentWordCount: r.response ? ((r.response as Record<string, unknown>).wordCount as number) : undefined,
          }));
          setRequirements(typedRequirements);
          setIsLoadingRequirements(false);
          return;
        }
      }

      // No existing requirements - auto-extract from tender notice
      await extractRequirements();
    } catch (error) {
      console.error('Error loading requirements:', error);
    } finally {
      setIsLoadingRequirements(false);
    }
  };

  const extractRequirements = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderOcid: tender.ocid }),
      });

      if (response.ok) {
        const data = await response.json();
        // Cast requirements to proper type
        const typedRequirements: TenderRequirement[] = (data.requirements || []).map((r: Record<string, unknown>) => ({
          id: r.id as string,
          number: r.number as string,
          title: r.title as string,
          description: r.description as string,
          type: (r.type as string) === 'mandatory' || (r.type as string) === 'desirable' || (r.type as string) === 'informational'
            ? (r.type as TenderRequirement['type'])
            : 'mandatory',
          wordLimit: r.wordLimit as number | undefined,
          weighting: r.weighting as number | undefined,
          scoringCriteria: r.scoringCriteria as string | undefined,
        }));
        setRequirements(typedRequirements);
        if (data.analysis) {
          setTenderAnalysis(data.analysis);
        }
      }
    } catch (error) {
      console.error('Failed to extract requirements:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startLegacyAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
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
    { id: 'write' as const, label: 'Write Bid', icon: '✍️' },
    { id: 'summary' as const, label: 'Summary', icon: '📊' },
    { id: 'compliance' as const, label: 'Compliance', icon: '✅' },
    { id: 'gap-analysis' as const, label: 'Gap Analysis', icon: '📈' },
    { id: 'documents' as const, label: 'Documents', icon: '📄' },
  ];

  const handleDocumentAnalyzed = (documentId: string) => {
    setAnalyzedDocumentId(documentId);
    // Reload requirements when document is analyzed
    loadOrExtractRequirements();
  };

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
              {/* Requirements count badge */}
              {requirements.length > 0 && (
                <span className="px-3 py-1 bg-teal-900/50 text-teal-300 text-sm rounded-full border border-teal-700">
                  {requirements.length} requirements
                </span>
              )}

              {/* Refresh button */}
              <button
                onClick={extractRequirements}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <AnalysisTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {/* Write Bid Tab - Main flow */}
          {activeTab === 'write' && (
            <div className="space-y-6">
              {/* AI Insights Panel */}
              {tenderAnalysis && (
                <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl p-6 border border-teal-800/50">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-teal-400" />
                    AI Analysis
                  </h3>
                  {tenderAnalysis.summary && (
                    <p className="text-slate-300 mb-4">{tenderAnalysis.summary}</p>
                  )}
                  {tenderAnalysis.keyThemes && tenderAnalysis.keyThemes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-sm text-slate-400">Key themes:</span>
                      {tenderAnalysis.keyThemes.map((theme, i) => (
                        <span key={i} className="px-2 py-1 bg-teal-800/50 text-teal-300 rounded text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                  {tenderAnalysis.suggestedApproach && (
                    <p className="text-sm text-slate-400 italic">
                      Tip: {tenderAnalysis.suggestedApproach}
                    </p>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoadingRequirements ? (
                <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
                  <ArrowPathIcon className="w-12 h-12 text-teal-400 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Analyzing Tender...</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Extracting requirements from the tender notice. This usually takes a few seconds.
                  </p>
                </div>
              ) : requirements.length > 0 ? (
                /* Requirements List */
                <RequirementsList
                  tenderOcid={tender.ocid}
                  requirements={requirements}
                  onRequirementsUpdate={setRequirements}
                />
              ) : (
                /* No requirements yet */
                <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
                  <PencilSquareIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Start Writing</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                    Click the button below to analyze this tender and extract the key requirements you need to address.
                  </p>
                  <button
                    onClick={extractRequirements}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" />
                        Extract Requirements
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            hasAnalysis ? (
              <SummaryTab
                summary={analysis.summary as Record<string, unknown>}
                tender={tender}
              />
            ) : (
              <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
                <SparklesIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Detailed Analysis</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                  Get AI-powered insights on this tender including buyer context and strategic recommendations.
                </p>
                <button
                  onClick={startLegacyAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Run Deep Analysis
                    </>
                  )}
                </button>
              </div>
            )
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            hasAnalysis ? (
              <ComplianceTab
                compliance={analysis.compliance as Record<string, unknown>}
              />
            ) : (
              <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
                <CheckCircleIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Compliance Check</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Run the deep analysis from the Summary tab to see compliance requirements.
                </p>
              </div>
            )
          )}

          {/* Gap Analysis Tab */}
          {activeTab === 'gap-analysis' && (
            hasAnalysis ? (
              <GapAnalysisTab
                gapAnalysis={analysis.gapAnalysis as Record<string, unknown>}
              />
            ) : (
              <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
                <SparklesIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Gap Analysis</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Run the deep analysis from the Summary tab to identify capability gaps.
                </p>
              </div>
            )
          )}

          {/* Documents Tab - Optional ITT upload */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <DocumentArrowUpIcon className="w-5 h-5 text-teal-400" />
                  Upload ITT Document (Optional)
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Have the full ITT/RFP document? Upload it for more detailed requirements extraction
                  with exact word limits and scoring criteria.
                </p>
                <DocumentUpload
                  ocid={tender.ocid}
                  onDocumentAnalyzed={handleDocumentAnalyzed}
                />
              </div>

              {analyzedDocumentId && (
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Document analyzed! Requirements updated on the Write Bid tab.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analysis Metadata */}
        {hasAnalysis && (
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
          title: 'Bid Writing Assistant',
          initial: `I can help you write compelling responses for this tender. Ask me to draft responses, improve your writing, or suggest relevant experience to include.`,
        }}
        defaultOpen={false}
      >
        <AnalysisContent tender={tender} existingAnalysis={existingAnalysis} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
