'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { CPV_HIERARCHY, type CpvDivision, searchCpvCodes } from '@/lib/cpv-hierarchy';

interface SectorFilterTreeProps {
  selectedDivisions: string[];
  onSelectionChange: (divisions: string[]) => void;
  sectorCounts?: Record<string, number>;
  collapsed?: boolean;
  searchable?: boolean;
  maxHeight?: number;
}

/**
 * Hierarchical sector/CPV filter tree with collapsible groups.
 * Supports selecting divisions and showing tender counts per sector.
 */
export function SectorFilterTree({
  selectedDivisions,
  onSelectionChange,
  sectorCounts = {},
  collapsed = false,
  searchable = true,
  maxHeight = 400,
}: SectorFilterTreeProps) {
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter divisions based on search
  const filteredDivisions = useMemo(() => {
    if (!searchQuery.trim()) return CPV_HIERARCHY;

    const searchResults = searchCpvCodes(searchQuery);
    const matchingDivisionCodes = new Set(
      searchResults.map((r) => r.code.substring(0, 2))
    );

    return CPV_HIERARCHY.filter((div) => matchingDivisionCodes.has(div.code));
  }, [searchQuery]);

  const toggleDivision = (code: string) => {
    if (selectedDivisions.includes(code)) {
      onSelectionChange(selectedDivisions.filter((d) => d !== code));
    } else {
      onSelectionChange([...selectedDivisions, code]);
    }
  };

  const toggleExpanded = (code: string) => {
    const newExpanded = new Set(expandedDivisions);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedDivisions(newExpanded);
  };

  const selectAll = () => {
    onSelectionChange(CPV_HIERARCHY.map((d) => d.code));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (collapsed) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {selectedDivisions.length === 0 ? (
          <span className="text-sm text-gray-400">All sectors</span>
        ) : (
          selectedDivisions.map((code) => {
            const div = CPV_HIERARCHY.find((d) => d.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs"
              >
                {div?.icon} {div?.label}
                <button
                  onClick={() => toggleDivision(code)}
                  className="hover:text-teal-900"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Sectors</h3>
          <div className="flex gap-2 text-xs">
            <button
              onClick={selectAll}
              className="text-teal-600 hover:text-teal-700"
            >
              Select all
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={clearAll}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sectors..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tree */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        <div className="p-2">
          <AnimatePresence>
            {filteredDivisions.map((division) => (
              <DivisionRow
                key={division.code}
                division={division}
                isSelected={selectedDivisions.includes(division.code)}
                isExpanded={expandedDivisions.has(division.code)}
                count={sectorCounts[division.code]}
                onToggleSelect={() => toggleDivision(division.code)}
                onToggleExpand={() => toggleExpanded(division.code)}
              />
            ))}
          </AnimatePresence>

          {filteredDivisions.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No sectors match "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Footer - Selection Summary */}
      {selectedDivisions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            {selectedDivisions.length} sector{selectedDivisions.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}

function DivisionRow({
  division,
  isSelected,
  isExpanded,
  count,
  onToggleSelect,
  onToggleExpand,
}: {
  division: CpvDivision;
  isSelected: boolean;
  isExpanded: boolean;
  count?: number;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
}) {
  const hasChildren = division.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors cursor-pointer ${
          isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'
        }`}
      >
        {/* Expand Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Checkbox */}
        <button
          onClick={onToggleSelect}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-teal-500 border-teal-500'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
        </button>

        {/* Icon & Label */}
        <div
          className="flex-1 flex items-center gap-2 min-w-0"
          onClick={onToggleSelect}
        >
          {division.icon && <span className="text-sm">{division.icon}</span>}
          <span
            className={`truncate text-sm ${
              isSelected ? 'font-medium text-gray-900' : 'text-gray-700'
            }`}
          >
            {division.label}
          </span>
        </div>

        {/* Count Badge */}
        {count !== undefined && count > 0 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            {count}
          </span>
        )}
      </div>

      {/* Children (Groups) */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-7 pl-2 border-l-2 border-gray-100"
          >
            {division.children.map((group) => (
              <div
                key={group.code}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 cursor-default"
              >
                <span className="truncate">{group.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Compact inline sector selector for mobile/small spaces
 */
export function SectorFilterChips({
  selectedDivisions,
  onSelectionChange,
}: {
  selectedDivisions: string[];
  onSelectionChange: (divisions: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CPV_HIERARCHY.map((div) => {
        const isSelected = selectedDivisions.includes(div.code);
        return (
          <button
            key={div.code}
            onClick={() => {
              if (isSelected) {
                onSelectionChange(selectedDivisions.filter((d) => d !== div.code));
              } else {
                onSelectionChange([...selectedDivisions, div.code]);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              isSelected
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {div.icon} {div.label}
          </button>
        );
      })}
    </div>
  );
}
