'use client';

import { useState } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  CurrencyPoundIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { TenderSearchParams } from '@/lib/api/types';

interface FilterBarProps {
  filters: TenderSearchParams;
  onFiltersChange: (filters: TenderSearchParams) => void;
}

// Per Find a Tender API spec, valid stages are: planning, tender, award
const stages = [
  { value: 'tender', label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'award', label: 'Awarded' },
] as const;

const regions = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
  'UK-wide',
];

const valueRanges = [
  { min: 0, max: 50000, label: 'Under 50k' },
  { min: 50000, max: 100000, label: '50k - 100k' },
  { min: 100000, max: 500000, label: '100k - 500k' },
  { min: 500000, max: 1000000, label: '500k - 1M' },
  { min: 1000000, max: undefined, label: 'Over 1M' },
];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [
    filters.stages?.length,
    filters.buyerName,
    filters.region,
    filters.minValue !== undefined || filters.maxValue !== undefined,
    filters.updatedFrom || filters.updatedTo,
  ].filter(Boolean).length;

  const handleStageToggle = (stage: string) => {
    const currentStages = filters.stages || [];
    const newStages = currentStages.includes(stage as 'tender')
      ? currentStages.filter((s) => s !== stage)
      : [...currentStages, stage as 'tender'];

    onFiltersChange({
      ...filters,
      stages: newStages.length > 0 ? newStages : undefined,
    });
  };

  const handleValueRangeSelect = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      minValue: min,
      maxValue: max,
    });
  };

  const handleRegionSelect = (region: string) => {
    onFiltersChange({
      ...filters,
      region: filters.region === region ? undefined : region,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      limit: filters.limit,
    });
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Filter toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-4">
          {/* Stage filters */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="h-4 w-4" />
              Stage
            </label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageToggle(stage.value)}
                  className={`
                    inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                    ${
                      filters.stages?.includes(stage.value as 'tender')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CurrencyPoundIcon className="h-4 w-4" />
              Contract Value
            </label>
            <div className="flex flex-wrap gap-2">
              {valueRanges.map((range) => {
                const isSelected =
                  filters.minValue === range.min && filters.maxValue === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() =>
                      isSelected
                        ? handleValueRangeSelect(undefined, undefined)
                        : handleValueRangeSelect(range.min, range.max)
                    }
                    className={`
                      inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="h-4 w-4" />
              Region
            </label>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionSelect(region)}
                  className={`
                    inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                    ${
                      filters.region === region
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Buyer search */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BuildingOfficeIcon className="h-4 w-4" />
              Buyer
            </label>
            <input
              type="text"
              value={filters.buyerName || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  buyerName: e.target.value || undefined,
                })
              }
              placeholder="Search by buyer name..."
              className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Active filters chips */}
          {activeFilterCount > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {filters.stages?.map((stage) => (
                  <span
                    key={stage}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                  >
                    {stages.find((s) => s.value === stage)?.label}
                    <button
                      onClick={() => handleStageToggle(stage)}
                      className="hover:text-indigo-900"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
                {filters.region && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    {filters.region}
                    <button
                      onClick={() => onFiltersChange({ ...filters, region: undefined })}
                      className="hover:text-indigo-900"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {filters.buyerName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    Buyer: {filters.buyerName}
                    <button
                      onClick={() => onFiltersChange({ ...filters, buyerName: undefined })}
                      className="hover:text-indigo-900"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {(filters.minValue !== undefined || filters.maxValue !== undefined) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    Value: {valueRanges.find(
                      (r) => r.min === filters.minValue && r.max === filters.maxValue
                    )?.label || 'Custom'}
                    <button
                      onClick={() =>
                        onFiltersChange({ ...filters, minValue: undefined, maxValue: undefined })
                      }
                      className="hover:text-indigo-900"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
