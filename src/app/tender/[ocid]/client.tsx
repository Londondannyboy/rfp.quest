'use client';

import { useState } from 'react';
import { CopilotKit, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { TenderHero } from '@/components/tender-viz/TenderHero';
import { ValueAnalysis } from '@/components/tender-viz/ValueAnalysis';
import { BuyerProfile } from '@/components/tender-viz/BuyerProfile';
import { TenderStats } from '@/components/tender-viz/TenderStats';
import { KeyDates } from '@/components/tender-viz/KeyDates';
import { CPVExplorer } from '@/components/tender-viz/CPVExplorer';
import { DynamicHeroViz } from '@/components/tender-viz/DynamicHeroViz';
import { ScopeOfWork } from '@/components/tender-viz/ScopeOfWork';
import { RelatedTenders } from '@/components/tender-viz/RelatedTenders';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

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

// CPV code descriptions
const cpvDescriptions: Record<string, string> = {
  '72000000': 'IT services: consulting, software development, Internet and support',
  '72200000': 'Software programming and consultancy services',
  '72300000': 'Data services',
  '72400000': 'Internet services',
  '72500000': 'Computer-related services',
  '72600000': 'Computer support and consultancy services',
  '79000000': 'Business services: law, marketing, consulting, recruitment, printing and security',
  '79400000': 'Business and management consultancy services',
  '79500000': 'Office-support services',
  '79600000': 'Recruitment services',
  '79800000': 'Printing and related services',
  '79900000': 'Miscellaneous business and business-related services',
  '45000000': 'Construction work',
  '48000000': 'Software package and information systems',
  '50000000': 'Repair and maintenance services',
  '55000000': 'Hotel, restaurant and retail trade services',
  '60000000': 'Transport services (excl. Waste transport)',
  '64000000': 'Postal and telecommunications services',
  '65000000': 'Public utilities',
  '66000000': 'Financial and insurance services',
  '70000000': 'Real estate services',
  '71000000': 'Architectural, construction, engineering and inspection services',
  '73000000': 'Research and development services and related consultancy services',
  '75000000': 'Administration, defence and social security services',
  '76000000': 'Services related to the oil and gas industry',
  '77000000': 'Agricultural, forestry, horticultural, aquacultural and apicultural services',
  '80000000': 'Education and training services',
  '85000000': 'Health and social work services',
  '90000000': 'Sewage, refuse, cleaning and environmental services',
  '92000000': 'Recreational, cultural and sporting services',
  '98000000': 'Other community, social and personal services',
};

function getCpvDescription(code: string): string {
  if (cpvDescriptions[code]) return cpvDescriptions[code];
  const division = code.substring(0, 2) + '000000';
  if (cpvDescriptions[division]) return cpvDescriptions[division];
  return `CPV Classification ${code}`;
}

function formatValue(value: number | null): string {
  if (!value) return 'Value not disclosed';
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
}

function TenderAnalysisContent({ tender }: { tender: Tender }) {
  const [showRawData, setShowRawData] = useState(false);

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

  const keyDates = [];
  if (tender.publishedDate) {
    keyDates.push({
      id: 'published',
      label: 'Notice Published',
      date: tender.publishedDate,
      description: 'Tender opportunity made public on Find a Tender',
      isPast: new Date(tender.publishedDate) < new Date(),
    });
  }
  if (tender.tenderStartDate) {
    keyDates.push({
      id: 'tender-start',
      label: 'Tender Period Opens',
      date: tender.tenderStartDate,
      description: 'Suppliers can start submitting proposals',
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
      description: 'Expected contract commencement date',
      isPast: new Date(tender.contractStartDate) < new Date(),
    });
  }
  if (tender.contractEndDate) {
    keyDates.push({
      id: 'contract-end',
      label: 'Contract End',
      date: tender.contractEndDate,
      description: 'Expected contract completion date',
      isPast: new Date(tender.contractEndDate) < new Date(),
    });
  }

  const cpvCodes = (tender.cpvCodes || []).map((code) => ({
    code,
    description: getCpvDescription(code),
    level: code.endsWith('000000') ? 1 : code.endsWith('0000') ? 2 : code.endsWith('00') ? 3 : 4,
  }));

  let duration: number | undefined;
  if (tender.contractStartDate && tender.contractEndDate) {
    const start = new Date(tender.contractStartDate);
    const end = new Date(tender.contractEndDate);
    duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  const findATenderUrl = `https://www.find-tender.service.gov.uk/Notice/${tender.ocid.split('-').pop()}`;
  const year = new Date(tender.publishedDate).getFullYear();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to UK Government Tenders
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={findATenderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Official Notice
            </a>
            <button
              onClick={() => navigator.share?.({ title: tender.title, url: window.location.href })}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Hero with image */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
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
          </div>
          {/* Dynamic sector visualization */}
          <div className="hidden lg:block">
            <DynamicHeroViz
              cpvCodes={tender.cpvCodes}
              stage={tender.stage}
              value={tender.valueMax}
              title={tender.title}
            />
          </div>
        </div>

        {/* SEO-rich summary section */}
        <article className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            About This <strong>{tender.buyerName}</strong> Contract
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            This <strong>{tender.stage === 'tender' ? 'open tender' : tender.stage + ' stage contract'}</strong> from{' '}
            <strong>{tender.buyerName}</strong>
            {tender.region && <> in <strong>{tender.region}</strong></>} was published in{' '}
            <strong>{year}</strong>. The <strong>{tender.title}</strong> contract
            {tender.valueMax && <> has an estimated value of <strong>{formatValue(tender.valueMax)}</strong></>}
            {tender.tenderEndDate && (
              <> with a submission deadline of{' '}
                <strong>{new Date(tender.tenderEndDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </>
            )}.
          </p>
          {tender.description && (
            <p className="text-slate-400 text-sm">
              This <strong>UK government contract</strong> opportunity is part of the{' '}
              <strong>public procurement</strong> process, openly available via Find a Tender.
            </p>
          )}
        </article>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Scope of Work with smart parsing */}
            <ScopeOfWork
              description={tender.description}
              title={tender.title}
            />

            <ValueAnalysis
              valueMin={tender.valueMin}
              valueMax={tender.valueMax}
              currency={tender.valueCurrency}
              duration={duration}
              priceModel="fixed"
            />

            {keyDates.length > 0 && <KeyDates dates={keyDates} />}

            {cpvCodes.length > 0 && (
              <CPVExplorer codes={cpvCodes} primaryCode={cpvCodes[0]?.code} />
            )}

            {/* What This Means section with bold keywords */}
            <div className="bg-slate-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                What This <strong>{tender.buyerName}</strong> Contract Means
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-medium text-teal-400 mb-2">For Citizens</h3>
                  <p className="text-sm text-slate-300">
                    This is a <strong>public procurement</strong> by <strong>{tender.buyerName}</strong>
                    {tender.region && <> in <strong>{tender.region}</strong></>}.
                    {tender.valueMax && <> Up to <strong>{formatValue(tender.valueMax)}</strong> of public funds may be spent.</>}
                    {' '}All <strong>UK government contracts</strong> are publicly accessible for transparency.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-medium text-cyan-400 mb-2">For Businesses</h3>
                  <p className="text-sm text-slate-300">
                    {tender.stage === 'tender' ? (
                      <>This <strong>{tender.buyerName} tender</strong> is <strong>open for bids</strong>.
                      {tender.tenderEndDate && <> Deadline: <strong>{new Date(tender.tenderEndDate).toLocaleDateString('en-GB')}</strong>.</>}
                      {' '}Submit your proposal via <strong>Find a Tender</strong>.</>
                    ) : tender.stage === 'planning' ? (
                      <>This <strong>{year} contract</strong> is in planning. Register interest to bid when it opens.</>
                    ) : tender.stage === 'award' ? (
                      <>This <strong>{tender.buyerName} contract</strong> has been awarded. Review for market intelligence.</>
                    ) : (
                      <>This <strong>government contract</strong> is active. Look for subcontracting opportunities.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tenders - Cross-linking for SEO */}
            <RelatedTenders
              currentOcid={tender.ocid}
              buyerName={tender.buyerName}
              region={tender.region}
            />

            {/* Raw Data */}
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-lg font-semibold text-white">Raw Contract Data</span>
                {showRawData ? <ChevronUpIcon className="w-5 h-5 text-slate-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
              </button>
              {showRawData && (
                <div className="p-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-4">
                    Data from <strong>Find a Tender</strong> using the <strong>Open Contracting Data Standard (OCDS)</strong>.
                    Available under the <strong>Open Government Licence</strong>.
                  </p>
                  <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-xs text-slate-300 font-mono">
                    {JSON.stringify(tender, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BuyerProfile name={tender.buyerName} region={tender.region || undefined} />

            <TenderStats
              stats={[
                { label: 'Stage', value: tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1), icon: 'document' },
                ...(tender.status ? [{ label: 'Status', value: tender.status, icon: 'chart' as const }] : []),
                { label: 'CPV Codes', value: tender.cpvCodes?.length || 0, icon: 'chart' },
                ...(tender.region ? [{ label: 'Region', value: tender.region, icon: 'building' as const }] : []),
                ...(duration ? [{ label: 'Duration', value: `${duration} months`, icon: 'clock' as const }] : []),
              ]}
              layout="row"
              title="Quick Facts"
            />

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Official Links</h3>
              <div className="space-y-3">
                <a href={findATenderUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-teal-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Find a Tender</div>
                    <div className="text-xs text-slate-400">Official UK portal</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Reference ID</h3>
              <code className="text-xs text-teal-400 bg-slate-800 px-2 py-1 rounded break-all">{tender.ocid}</code>
            </div>
          </div>
        </div>

        {/* CTA + Internal Links */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-2xl p-8 border border-teal-500/20">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-white mb-3">Win More <strong>UK Government Contracts</strong></h2>
              <p className="text-slate-300 mb-6">
                <strong>RFP.quest</strong> helps UK businesses find and win <strong>public sector tenders</strong>.
                Our AI platform analyzes requirements, identifies gaps, and helps craft winning proposals.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/" className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
                  Try RFP.quest Free
                </Link>
                <Link href="/dashboard?stage=tender" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
                  View Open Tenders
                </Link>
                <Link href={`/dashboard?buyer=${encodeURIComponent(tender.buyerName)}`} className="px-5 py-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700">
                  More from {tender.buyerName.length > 25 ? tender.buyerName.substring(0, 25) + '...' : tender.buyerName}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/rfp-software" className="group p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
              <h3 className="text-sm font-medium text-white group-hover:text-teal-400">RFP Software</h3>
              <p className="text-xs text-slate-500 mt-1">AI-powered bid management</p>
            </Link>
            <Link href="/tender-software" className="group p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
              <h3 className="text-sm font-medium text-white group-hover:text-teal-400">Tender Software</h3>
              <p className="text-xs text-slate-500 mt-1">UK procurement tools</p>
            </Link>
            <Link href="/bid-writing" className="group p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
              <h3 className="text-sm font-medium text-white group-hover:text-teal-400">Bid Writing</h3>
              <p className="text-xs text-slate-500 mt-1">Expert guidance</p>
            </Link>
            <Link href="/how-to-write-a-tender" className="group p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
              <h3 className="text-sm font-medium text-white group-hover:text-teal-400">How to Write a Tender</h3>
              <p className="text-xs text-slate-500 mt-1">Step-by-step guide</p>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>
              <strong>UK tender</strong> data from{' '}
              <a href="https://www.find-tender.service.gov.uk" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Find a Tender</a>
              {' '}under the Open Government Licence. Powered by{' '}
              <Link href="/" className="text-teal-400 hover:underline"><strong>RFP.quest</strong></Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TenderPageClient({ tender }: { tender: Tender }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar
        labels={{
          title: 'Tender Assistant',
          initial: `I can help you understand this ${tender.buyerName} contract:\n\n• Requirements and evaluation criteria\n• Risks and gaps analysis\n• Buyer and market context\n• Related opportunities\n\nAsk me anything about "${tender.title}"!`,
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
      >
        <TenderAnalysisContent tender={tender} />
      </CopilotSidebar>
    </CopilotKit>
  );
}
