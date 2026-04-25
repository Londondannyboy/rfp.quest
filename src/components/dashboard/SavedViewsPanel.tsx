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
        className="p-2 hover:bg-slate-900/40 backdrop-blur-xl rounded-lg transition-colors"
        title="Saved Views"
      >
        <BookmarkIcon className="w-5 h-5 text-slate-500" />
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
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Quick Views:
          </span>

          {isLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-20 bg-slate-900/40 backdrop-blur-xl rounded-full animate-pulse" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/20 border-blue-700/50 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-900/30 transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-slate-700/50 text-slate-200 rounded-full text-sm font-medium hover:bg-slate-900/40 backdrop-blur-xl transition-colors"
                >
                  {view.icon && <span>{view.icon}</span>}
                  {view.name}
                </motion.button>
              ))}

              {/* Show more count if many views */}
              {otherViews.length > 5 && (
                <span className="text-xs text-slate-400">
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border-dashed border-slate-600/50 text-slate-500 rounded-full text-sm hover:border-blue-500/60 hover:text-blue-600 transition-colors"
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
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-100">Saved Views</h3>
          </div>
          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="p-1.5 hover:bg-blue-950/20 rounded-lg text-blue-600 transition-colors"
                title="Save current filters"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            )}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-slate-900/40 backdrop-blur-xl rounded-lg text-slate-400 transition-colors"
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
                  className="h-10 bg-slate-900/40 backdrop-blur-xl rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : views.length === 0 ? (
            <div className="py-6 text-center text-slate-500">
              <FunnelIcon className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">No saved views yet</p>
              {hasActiveFilters && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-400"
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
                  <p className="text-xs text-slate-400 px-2 pt-1">Pinned</p>
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
                    <p className="text-xs text-slate-400 px-2 pt-2">Other</p>
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
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-colors text-left"
      >
        {view.icon ? (
          <span className="text-sm">{view.icon}</span>
        ) : (
          <FunnelIcon className="w-4 h-4 text-slate-400" />
        )}
        <span className="flex-1 truncate text-sm text-slate-200">{view.name}</span>
        <span className="text-xs text-slate-400">{filterCount}</span>
      </button>

      {/* Hover Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-sm rounded-lg border-slate-700/40 p-0.5"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className="p-1 hover:bg-slate-900/40 backdrop-blur-xl rounded text-slate-400 hover:text-amber-500 transition-colors"
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
              className="p-1 hover:bg-slate-900/40 backdrop-blur-xl rounded text-slate-400 hover:text-slate-300 transition-colors"
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
              className="p-1 hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
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
