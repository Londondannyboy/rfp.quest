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
          <span className="text-sm text-slate-400">All sectors</span>
        ) : (
          selectedDivisions.map((code) => {
            const div = CPV_HIERARCHY.find((d) => d.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-950/20 text-blue-400 rounded-full text-xs"
              >
                {div?.icon} {div?.label}
                <button
                  onClick={() => toggleDivision(code)}
                  className="hover:text-blue-200"
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
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/40">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-100">Sectors</h3>
          <div className="flex gap-2 text-xs">
            <button
              onClick={selectAll}
              className="text-blue-600 hover:text-blue-400"
            >
              Select all
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={clearAll}
              className="text-slate-500 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sectors..."
              className="w-full pl-9 pr-8 py-2 text-sm border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
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
            <div className="py-8 text-center text-slate-500 text-sm">
              No sectors match "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Footer - Selection Summary */}
      {selectedDivisions.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-700/40 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
          <p className="text-xs text-slate-500">
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
          isSelected ? 'bg-blue-950/20' : 'hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        }`}
      >
        {/* Expand Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-0.5 hover:bg-slate-900/40 backdrop-blur-xl rounded"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Checkbox */}
        <button
          onClick={onToggleSelect}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-blue-950/200 border-blue-500/50'
              : 'border-slate-600/50 hover:border-slate-500/50'
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
              isSelected ? 'font-medium text-slate-100' : 'text-slate-200'
            }`}
          >
            {division.label}
          </span>
        </div>

        {/* Count Badge */}
        {count !== undefined && count > 0 && (
          <span className="px-2 py-0.5 bg-slate-900/40 backdrop-blur-xl text-slate-500 text-xs rounded-full">
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
            className="ml-7 pl-2 border-l-2 border-slate-700/40"
          >
            {division.children.map((group) => (
              <div
                key={group.code}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-300 hover:text-slate-100 cursor-default"
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
                ? 'bg-blue-950/200 text-white'
                : 'bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {div.icon} {div.label}
          </button>
        );
      })}
    </div>
  );
}
