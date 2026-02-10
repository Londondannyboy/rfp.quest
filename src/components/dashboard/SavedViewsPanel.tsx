'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookmarkIcon,
  PlusIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useSavedViews, type SavedView, type SavedViewFilters } from '@/lib/hooks/use-saved-views';
import { SaveViewModal } from './SaveViewModal';

interface SavedViewsPanelProps {
  currentFilters: SavedViewFilters;
  onApplyView: (filters: SavedViewFilters) => void;
  onSaveCurrentView?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  layout?: 'vertical' | 'horizontal';
}

/**
 * Panel showing user's saved filter views.
 * Can be used in sidebar or as collapsible section.
 */
export function SavedViewsPanel({
  currentFilters,
  onApplyView,
  collapsed = false,
  onToggleCollapse,
  layout = 'vertical',
}: SavedViewsPanelProps) {
  const {
    views,
    isLoading,
    updateView,
    deleteView,
    isDeleting,
  } = useSavedViews();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingView, setEditingView] = useState<SavedView | null>(null);

  const pinnedViews = views.filter((v) => v.isPinned);
  const otherViews = views.filter((v) => !v.isPinned);

  const handleTogglePin = (view: SavedView) => {
    updateView(view.id, { isPinned: !view.isPinned });
  };

  const handleDelete = (view: SavedView) => {
    if (confirm(`Delete "${view.name}"?`)) {
      deleteView(view.id);
    }
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  );

  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Saved Views"
      >
        <BookmarkIcon className="w-5 h-5 text-gray-500" />
      </button>
    );
  }

  // Horizontal layout - compact pills
  if (layout === 'horizontal') {
    if (views.length === 0 && !hasActiveFilters) {
      return null; // Don't show anything if no views and no active filters
    }

    return (
      <>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Quick Views:
          </span>

          {isLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-20 bg-gray-100 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Pinned views first */}
              {pinnedViews.map((view) => (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onApplyView(view.filters)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition-colors"
                >
                  {view.icon && <span>{view.icon}</span>}
                  <StarSolidIcon className="w-3 h-3 text-amber-500" />
                  {view.name}
                </motion.button>
              ))}

              {/* Other views */}
              {otherViews.slice(0, 5).map((view) => (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onApplyView(view.filters)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  {view.icon && <span>{view.icon}</span>}
                  {view.name}
                </motion.button>
              ))}

              {/* Show more count if many views */}
              {otherViews.length > 5 && (
                <span className="text-xs text-gray-400">
                  +{otherViews.length - 5} more
                </span>
              )}
            </>
          )}

          {/* Save current filters button */}
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-dashed border-gray-300 text-gray-500 rounded-full text-sm hover:border-teal-400 hover:text-teal-600 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Save View
            </motion.button>
          )}
        </div>

        {/* Save Modal */}
        <SaveViewModal
          isOpen={showSaveModal || editingView !== null}
          onClose={() => {
            setShowSaveModal(false);
            setEditingView(null);
          }}
          currentFilters={editingView?.filters || currentFilters}
          editingView={editingView}
        />
      </>
    );
  }

  // Vertical layout (default - sidebar)
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-gray-900">Saved Views</h3>
          </div>
          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="p-1.5 hover:bg-teal-50 rounded-lg text-teal-600 transition-colors"
                title="Save current filters"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : views.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              <FunnelIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No saved views yet</p>
              {hasActiveFilters && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="mt-2 text-xs text-teal-600 hover:text-teal-700"
                >
                  Save current filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {/* Pinned Views */}
              {pinnedViews.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 px-2 pt-1">Pinned</p>
                  <AnimatePresence>
                    {pinnedViews.map((view) => (
                      <ViewItem
                        key={view.id}
                        view={view}
                        onApply={() => onApplyView(view.filters)}
                        onEdit={() => setEditingView(view)}
                        onTogglePin={() => handleTogglePin(view)}
                        onDelete={() => handleDelete(view)}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Other Views */}
              {otherViews.length > 0 && (
                <div className="space-y-1">
                  {pinnedViews.length > 0 && (
                    <p className="text-xs text-gray-400 px-2 pt-2">Other</p>
                  )}
                  <AnimatePresence>
                    {otherViews.map((view) => (
                      <ViewItem
                        key={view.id}
                        view={view}
                        onApply={() => onApplyView(view.filters)}
                        onEdit={() => setEditingView(view)}
                        onTogglePin={() => handleTogglePin(view)}
                        onDelete={() => handleDelete(view)}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      <SaveViewModal
        isOpen={showSaveModal || editingView !== null}
        onClose={() => {
          setShowSaveModal(false);
          setEditingView(null);
        }}
        currentFilters={editingView?.filters || currentFilters}
        editingView={editingView}
      />
    </>
  );
}

function ViewItem({
  view,
  onApply,
  onEdit,
  onTogglePin,
  onDelete,
  isDeleting,
}: {
  view: SavedView;
  onApply: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

  // Count active filters
  const filterCount = Object.values(view.filters).filter(
    (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={onApply}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
      >
        {view.icon ? (
          <span className="text-sm">{view.icon}</span>
        ) : (
          <FunnelIcon className="w-4 h-4 text-gray-400" />
        )}
        <span className="flex-1 truncate text-sm text-gray-700">{view.name}</span>
        <span className="text-xs text-gray-400">{filterCount}</span>
      </button>

      {/* Hover Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white shadow-sm rounded-lg border border-gray-100 p-0.5"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-amber-500 transition-colors"
              title={view.isPinned ? 'Unpin' : 'Pin'}
            >
              {view.isPinned ? (
                <StarSolidIcon className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <StarIcon className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit"
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
              className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
