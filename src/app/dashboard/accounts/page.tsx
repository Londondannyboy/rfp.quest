'use client';

import { useState } from 'react';
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

interface CompanySignal {
  companyNumber: string;
  companyName: string;
  companyType: string;
  dateOfCreation: string;
  signals: {
    growthSignals: Array<{ signal: string; message: string }>;
    riskSignals: Array<{ signal: string; severity: string; message: string }>;
    overallSentiment: string;
  };
  sustainability?: {
    hasSecrContent: boolean;
    secrData?: {
      scope1Tonnes: number | null;
      scope2Tonnes: number | null;
      netZeroYear: number | null;
    };
  };
  directorsCount: number;
  enrichedAt: string;
}

function CompanyCard({ company }: { company: CompanySignal }) {
  const hasRisks = company.signals.riskSignals.length > 0;
  const hasGrowth = company.signals.growthSignals.length > 0;
  const hasSECR = company.sustainability?.hasSecrContent;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BuildingOffice2Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 line-clamp-1">{company.companyName}</h3>
            <p className="text-sm text-slate-400">{company.companyType.toUpperCase()} • Est. {company.dateOfCreation.split('-')[0]}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          company.signals.overallSentiment === 'positive' ? 'bg-blue-600/20 text-green-400 border border-blue-500/30' :
          company.signals.overallSentiment === 'cautious' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' :
          'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-300'
        }`}>
          {company.signals.overallSentiment}
        </span>
      </div>

      {/* Signal Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full">
          <UserGroupIcon className="w-3 h-3" />
          {company.directorsCount} Directors
        </span>

        {hasSECR && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-600/20 text-green-400 border border-blue-500/30 rounded-full">
            <Leaf className="w-3 h-3" />
            SECR Reported
          </span>
        )}

        {hasRisks && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-full">
            <ExclamationTriangleIcon className="w-3 h-3" />
            {company.signals.riskSignals.length} Risk{company.signals.riskSignals.length > 1 ? 's' : ''}
          </span>
        )}

        {hasGrowth && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 rounded-full">
            <ArrowTrendingUpIcon className="w-3 h-3" />
            Growth Signal
          </span>
        )}
      </div>

      {/* SECR Data */}
      {company.sustainability?.secrData && (
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-slate-400 mb-2">Sustainability Data</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {company.sustainability.secrData.scope1Tonnes && (
              <div>
                <p className="text-xs text-slate-400">Scope 1</p>
                <p className="font-medium text-slate-100">{company.sustainability.secrData.scope1Tonnes} tCO2e</p>
              </div>
            )}
            {company.sustainability.secrData.scope2Tonnes && (
              <div>
                <p className="text-xs text-slate-400">Scope 2</p>
                <p className="font-medium text-slate-100">{company.sustainability.secrData.scope2Tonnes} tCO2e</p>
              </div>
            )}
            {company.sustainability.secrData.netZeroYear && (
              <div>
                <p className="text-xs text-slate-400">Net Zero</p>
                <p className="font-medium text-green-400">{company.sustainability.secrData.netZeroYear}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
        <a
          href={`https://find-and-update.company-information.service.gov.uk/company/${company.companyNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View on Companies House →
        </a>
        <span className="text-xs text-slate-400">
          Updated {new Date(company.enrichedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default function AccountsFeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanySignal[]>([]);

  // Search companies
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Search Companies House
      const searchRes = await fetch(`/api/buyer-intel?buyerName=${encodeURIComponent(searchQuery)}`);
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data && !data.error) {
          setSearchResults([{
            companyNumber: data.companyNumber,
            companyName: data.companyName,
            companyType: data.profile.companyType,
            dateOfCreation: data.profile.dateOfCreation,
            signals: data.signals,
            sustainability: data.sustainability,
            directorsCount: data.decisionMakers.filter((dm: { role: string }) =>
              dm.role.toLowerCase().includes('director')
            ).length,
            enrichedAt: data.enrichedAt,
          }]);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Company Accounts Feed</h1>
        <p className="text-slate-300 mt-1">
          Search UK companies and view their latest accounts, signals, and sustainability data
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-600/50 p-4 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a company (e.g., Rolls-Royce, NHS, BAE Systems)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border-slate-500/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Powered by Companies House API • Data includes SECR, officers, and filing history
        </p>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Search Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {searchResults.map((company) => (
              <CompanyCard key={company.companyNumber} company={company} />
            ))}
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-5 border border-slate-700/50">
          <DocumentTextIcon className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">Company Accounts</h3>
          <p className="text-sm text-slate-300">
            View latest filed accounts with SECR sustainability data extracted automatically
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-5 border border-slate-700/50">
          <Leaf className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">Sustainability Signals</h3>
          <p className="text-sm text-slate-300">
            Scope 1, Scope 2 emissions, net zero targets, and environmental commitments
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-5 border border-slate-700/50">
          <ExclamationTriangleIcon className="w-8 h-8 text-amber-600 mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">Risk Detection</h3>
          <p className="text-sm text-slate-300">
            Insolvency history, charges, going concern warnings, and financial health indicators
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg p-6 border-slate-600/50">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 font-bold">1</div>
            <p className="text-sm text-slate-300">Search for any UK company</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 font-bold">2</div>
            <p className="text-sm text-slate-300">We fetch their Companies House data</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 font-bold">3</div>
            <p className="text-sm text-slate-300">AI extracts SECR from annual accounts</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 font-bold">4</div>
            <p className="text-sm text-slate-300">View signals, risks, and bid insights</p>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
