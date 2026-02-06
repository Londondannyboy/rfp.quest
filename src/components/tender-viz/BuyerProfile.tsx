'use client';

import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CurrencyPoundIcon,
} from '@heroicons/react/24/outline';

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
