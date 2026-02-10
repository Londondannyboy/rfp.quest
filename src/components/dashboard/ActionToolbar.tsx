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
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-xl">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders, buyers, keywords..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            {keyword && (
              <button
                onClick={() => {
                  onKeywordChange('');
                  onSearch();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }
            `}
          >
            <FunnelIcon className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-700 hover:bg-gray-50'
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
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
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
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="ml-auto text-sm text-gray-500">
          <span className="font-medium text-gray-900">{totalCount.toLocaleString()}</span> opportunities
        </div>
      </div>
    </div>
  );
}
