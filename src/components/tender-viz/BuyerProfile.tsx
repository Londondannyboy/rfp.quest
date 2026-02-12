'use client';

import { useState } from 'react';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyPoundIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { LeafIcon } from 'lucide-react';
import { useBuyerIntelligence, type BuyerIntelligence } from '@/lib/hooks/use-buyer-intelligence';

interface BuyerStats {
  totalTenders: number;
  activeTenders: number;
  averageValue?: number;
  totalContractValue?: number;
}

interface BuyerContact {
  name?: string;
  email?: string;
  phone?: string;
}

interface BuyerProfileProps {
  name: string;
  department?: string;
  region?: string;
  address?: string;
  website?: string;
  contact?: BuyerContact;
  stats?: BuyerStats;
  description?: string;
  sectors?: string[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof BuildingOfficeIcon }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

export function BuyerProfile({
  name,
  department,
  region,
  address,
  website,
  contact,
  stats,
  description,
  sectors,
}: BuyerProfileProps) {
  const [showIntel, setShowIntel] = useState(false);
  const { data: intel, isLoading: intelLoading } = useBuyerIntelligence(name, { enabled: showIntel });

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start gap-4">
          {/* Avatar/Icon */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            {department && (
              <p className="text-sm text-slate-400 mt-0.5">{department}</p>
            )}
            {region && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
                <MapPinIcon className="w-4 h-4" />
                {region}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-300 mt-4">{description}</p>
        )}

        {/* Sectors */}
        {sectors && sectors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="px-2 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded"
              >
                {sector}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="p-6 border-b border-slate-800">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Procurement Activity</h4>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Total Tenders"
              value={stats.totalTenders}
              icon={DocumentTextIcon}
            />
            <StatCard
              label="Active Now"
              value={stats.activeTenders}
              icon={DocumentTextIcon}
            />
            {stats.averageValue && (
              <StatCard
                label="Avg. Value"
                value={formatCurrency(stats.averageValue)}
                icon={CurrencyPoundIcon}
              />
            )}
            {stats.totalContractValue && (
              <StatCard
                label="Total Value"
                value={formatCurrency(stats.totalContractValue)}
                icon={CurrencyPoundIcon}
              />
            )}
          </div>
        </div>
      )}

      {/* Companies House Intelligence */}
      <div className="p-6 border-b border-slate-800">
        <button
          onClick={() => setShowIntel(!showIntel)}
          className="w-full flex items-center justify-between text-sm font-medium text-slate-400 mb-3 hover:text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BuildingOfficeIcon className="w-4 h-4" />
            Companies House Intelligence
          </span>
          {showIntel ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>

        {showIntel && (
          <div className="space-y-4">
            {intelLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
              </div>
            ) : intel ? (
              <>
                {/* Company Overview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Company Type</p>
                    <p className="text-sm font-medium text-white">{intel.profile.companyType.toUpperCase()}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Established</p>
                    <p className="text-sm font-medium text-white">{intel.profile.dateOfCreation?.split('-')[0] || 'N/A'}</p>
                  </div>
                </div>

                {/* Decision Makers */}
                {intel.decisionMakers.filter(dm => dm.role.toLowerCase().includes('director')).length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1">
                      <UserGroupIcon className="w-3 h-3" />
                      Key Decision Makers
                    </h5>
                    <div className="space-y-2">
                      {intel.decisionMakers
                        .filter(dm => dm.role.toLowerCase().includes('director'))
                        .slice(0, 4)
                        .map((dm, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-slate-800/30 rounded px-3 py-2">
                            <span className="text-slate-200">{dm.name}</span>
                            <span className="text-xs text-slate-500 capitalize">{dm.role.replace('_', ' ')}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Sustainability */}
                {intel.sustainability?.hasSecrContent && (
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-800/30">
                    <h5 className="text-xs font-medium text-green-400 mb-2 flex items-center gap-1">
                      <LeafIcon className="w-3 h-3" />
                      Sustainability (SECR)
                    </h5>
                    {intel.sustainability.secrData && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {intel.sustainability.secrData.scope1Tonnes && (
                          <div>
                            <p className="text-xs text-slate-500">Scope 1</p>
                            <p className="text-green-300">{intel.sustainability.secrData.scope1Tonnes.toLocaleString()} tCO2e</p>
                          </div>
                        )}
                        {intel.sustainability.secrData.scope2Tonnes && (
                          <div>
                            <p className="text-xs text-slate-500">Scope 2</p>
                            <p className="text-green-300">{intel.sustainability.secrData.scope2Tonnes.toLocaleString()} tCO2e</p>
                          </div>
                        )}
                        {intel.sustainability.secrData.netZeroYear && (
                          <div className="col-span-2">
                            <p className="text-xs text-slate-500">Net Zero Target</p>
                            <p className="text-green-300 font-medium">{intel.sustainability.secrData.netZeroYear}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Signals */}
                {intel.signals.riskSignals.length > 0 && (
                  <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-800/30">
                    <h5 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      Risk Signals
                    </h5>
                    <div className="space-y-2">
                      {intel.signals.riskSignals.map((risk, i) => (
                        <div key={i} className="text-sm">
                          <p className="text-amber-300">{risk.message}</p>
                          <p className="text-xs text-slate-500">{risk.implication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Signals */}
                {intel.signals.growthSignals.length > 0 && (
                  <div className="bg-teal-900/20 rounded-lg p-3 border border-teal-800/30">
                    <h5 className="text-xs font-medium text-teal-400 mb-2 flex items-center gap-1">
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                      Growth Signals
                    </h5>
                    <div className="space-y-2">
                      {intel.signals.growthSignals.map((signal, i) => (
                        <div key={i} className="text-sm">
                          <p className="text-teal-300">{signal.message}</p>
                          <p className="text-xs text-slate-500">{signal.implication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bid Insights */}
                {(intel.bidInsights.emphasize.length > 0 || intel.bidInsights.avoid.length > 0) && (
                  <div>
                    <h5 className="text-xs font-medium text-slate-500 mb-2">Bid Writing Insights</h5>
                    <div className="space-y-2">
                      {intel.bidInsights.emphasize.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                      {intel.bidInsights.avoid.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies House Link */}
                <a
                  href={`https://find-and-update.company-information.service.gov.uk/company/${intel.companyNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  View on Companies House →
                </a>
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No Companies House data available for this organization
              </p>
            )}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Contact Information</h4>
        <div className="space-y-3">
          {address && (
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-slate-500 mt-0.5" />
              <p className="text-sm text-slate-300">{address}</p>
            </div>
          )}

          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5" />
              {contact.email}
            </a>
          )}

          {contact?.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <PhoneIcon className="w-5 h-5" />
              {contact.phone}
            </a>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              <GlobeAltIcon className="w-5 h-5" />
              {website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
            View All Tenders
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
