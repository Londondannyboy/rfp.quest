'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  BookmarkIcon,
  XMarkIcon,
  ChevronDownIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

export type ViewMode = 'list' | 'grid';

interface ActionToolbarProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: () => void;
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  savedCount: number;
  onViewSaved: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

const sortOptions = [
  { value: 'deadline-asc', label: 'Deadline (soonest)' },
  { value: 'deadline-desc', label: 'Deadline (latest)' },
  { value: 'value-desc', label: 'Value (highest)' },
  { value: 'value-asc', label: 'Value (lowest)' },
  { value: 'published-desc', label: 'Newest first' },
  { value: 'published-asc', label: 'Oldest first' },
];

export function ActionToolbar({
  keyword,
  onKeywordChange,
  onSearch,
  totalCount,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  savedCount,
  onViewSaved,
  viewMode = 'list',
  onViewModeChange,
}: ActionToolbarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border-b border-slate-700/50 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenders, buyers, keywords..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-600/50 text-sm placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {keyword && (
              <button
                onClick={() => {
                  onKeywordChange('');
                  onSearch();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <button
            onClick={onToggleFilters}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${showFilters || activeFilterCount > 0
                ? 'bg-blue-950/20 text-blue-400 border-blue-700/50'
                : 'bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60 border-transparent'
              }
            `}
          >
            <FunnelIcon className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-blue-700 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
              Sort
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg shadow-lg border-slate-700/50 py-1 z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm transition-colors
                        ${sortBy === option.value
                          ? 'bg-blue-950/20 text-blue-400'
                          : 'text-slate-200 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Saved/Tracked */}
          <button
            onClick={onViewSaved}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${savedCount > 0
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 border-amber-200'
                : 'bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60 border-transparent'
              }
            `}
          >
            {savedCount > 0 ? (
              <BookmarkSolidIcon className="w-4 h-4" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
            Saved
            {savedCount > 0 && (
              <span className="bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center bg-slate-900/40 backdrop-blur-xl rounded-lg p-0.5">
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-sm text-blue-600'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
                title="List view"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-sm text-blue-600'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="ml-auto text-sm text-slate-500">
          <span className="font-medium text-slate-100">{totalCount.toLocaleString()}</span> opportunities
        </div>
      </div>
    </div>
  );
}
