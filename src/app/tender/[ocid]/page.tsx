'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { TenderHero } from '@/components/tender-viz/TenderHero';
import { ValueAnalysis } from '@/components/tender-viz/ValueAnalysis';
import { BuyerProfile } from '@/components/tender-viz/BuyerProfile';
import { TenderStats } from '@/components/tender-viz/TenderStats';
import { KeyDates } from '@/components/tender-viz/KeyDates';
import { CPVExplorer } from '@/components/tender-viz/CPVExplorer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Tender {
  ocid: string;
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

function TenderAnalysisContent({ tender }: { tender: Tender }) {
  // Provide tender context to CopilotKit
  useCopilotReadable({
    description: 'The current tender being analyzed',
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
      status: tender.status,
    },
  });

  // Build key dates from tender data
  const keyDates = [];
  if (tender.publishedDate) {
    keyDates.push({
      id: 'published',
      label: 'Notice Published',
      date: tender.publishedDate,
      description: 'Tender opportunity made public',
      isPast: new Date(tender.publishedDate) < new Date(),
    });
  }
  if (tender.tenderStartDate) {
    keyDates.push({
      id: 'tender-start',
      label: 'Tender Period Opens',
      date: tender.tenderStartDate,
      description: 'Bidders can start submitting proposals',
      isPast: new Date(tender.tenderStartDate) < new Date(),
    });
  }
  if (tender.tenderEndDate) {
    const daysUntil = Math.ceil(
      (new Date(tender.tenderEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    keyDates.push({
      id: 'deadline',
      label: 'Submission Deadline',
      date: tender.tenderEndDate,
      time: tender.tenderEndDate,
      description: 'Final deadline for bid submission',
      isPast: new Date(tender.tenderEndDate) < new Date(),
      isUrgent: daysUntil <= 7 && daysUntil >= 0,
    });
  }
  if (tender.contractStartDate) {
    keyDates.push({
      id: 'contract-start',
      label: 'Contract Start',
      date: tender.contractStartDate,
      description: 'Expected contract commencement',
      isPast: new Date(tender.contractStartDate) < new Date(),
    });
  }
  if (tender.contractEndDate) {
    keyDates.push({
      id: 'contract-end',
      label: 'Contract End',
      date: tender.contractEndDate,
      description: 'Expected contract completion',
      isPast: new Date(tender.contractEndDate) < new Date(),
    });
  }

  // Build CPV codes for explorer
  const cpvCodes = (tender.cpvCodes || []).map((code) => ({
    code,
    description: `CPV Code ${code}`,
    level: code.endsWith('000000') ? 1 : code.endsWith('0000') ? 2 : code.endsWith('00') ? 3 : 4,
  }));

  // Calculate contract duration in months
  let duration: number | undefined;
  if (tender.contractStartDate && tender.contractEndDate) {
    const start = new Date(tender.contractStartDate);
    const end = new Date(tender.contractEndDate);
    duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero section */}
        <TenderHero
          title={tender.title}
          buyerName={tender.buyerName}
          stage={tender.stage}
          valueMin={tender.valueMin}
          valueMax={tender.valueMax}
          deadline={tender.tenderEndDate}
          publishedDate={tender.publishedDate}
          ocid={tender.ocid}
          description={tender.description}
        />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Value Analysis */}
            <ValueAnalysis
              valueMin={tender.valueMin}
              valueMax={tender.valueMax}
              currency={tender.valueCurrency}
              duration={duration}
              priceModel="fixed"
            />

            {/* Key Dates */}
            {keyDates.length > 0 && <KeyDates dates={keyDates} />}

            {/* CPV Codes */}
            {cpvCodes.length > 0 && (
              <CPVExplorer
                codes={cpvCodes}
                primaryCode={cpvCodes[0]?.code}
              />
            )}
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Buyer Profile */}
            <BuyerProfile
              name={tender.buyerName}
              region={tender.region || undefined}
            />

            {/* Quick Stats */}
            <TenderStats
              stats={[
                {
                  label: 'Stage',
                  value: tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1),
                  icon: 'document',
                },
                {
                  label: 'CPV Codes',
                  value: tender.cpvCodes?.length || 0,
                  icon: 'chart',
                },
                ...(tender.region
                  ? [{ label: 'Region', value: tender.region, icon: 'building' as const }]
                  : []),
              ]}
              layout="row"
              title="Quick Facts"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TenderPage() {
  const params = useParams();
  const ocid = params.ocid as string;
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTender() {
      try {
        const response = await fetch(`/api/tenders/${ocid}`);
        if (!response.ok) {
          throw new Error('Tender not found');
        }
        const data = await response.json();
        setTender(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tender');
      } finally {
        setLoading(false);
      }
    }

    fetchTender();
  }, [ocid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading tender...</div>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tender Not Found</h1>
          <p className="text-slate-400">{error || 'The requested tender could not be loaded.'}</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        labels={{
          title: 'Tender Assistant',
          initial: `I'm your AI assistant for analyzing this tender. I can help you:

• Understand the requirements and evaluation criteria
• Identify potential risks and gaps
• Analyze the buyer and market context
• Find related opportunities

Ask me anything about "${tender.title}"!`,
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
      >
        <TenderAnalysisContent tender={tender} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
