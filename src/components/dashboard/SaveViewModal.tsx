'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { useSavedViews, type SavedView, type SavedViewFilters } from '@/lib/hooks/use-saved-views';

interface SaveViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: SavedViewFilters;
  editingView?: SavedView | null;
}

const ICONS = ['📊', '🏥', '🏗️', '💻', '🚚', '📚', '🌱', '⭐', '🎯', '🔥'];
const COLORS = [
  { name: 'Gray', value: 'gray' },
  { name: 'Teal', value: 'teal' },
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
  { name: 'Orange', value: 'orange' },
  { name: 'Green', value: 'green' },
];

/**
 * Modal for saving or editing a filter view.
 */
export function SaveViewModal({
  isOpen,
  onClose,
  currentFilters,
  editingView,
}: SaveViewModalProps) {
  const { createView, updateView, isCreating, isUpdating } = useSavedViews();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [color, setColor] = useState('gray');
  const [isPinned, setIsPinned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingView;

  // Reset form when modal opens/closes or editing view changes
  useEffect(() => {
    if (isOpen) {
      if (editingView) {
        setName(editingView.name);
        setIcon(editingView.icon);
        setColor(editingView.color || 'gray');
        setIsPinned(editingView.isPinned);
      } else {
        setName('');
        setIcon(undefined);
        setColor('gray');
        setIsPinned(false);
      }
      setError(null);
    }
  }, [isOpen, editingView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a name for this view');
      return;
    }

    try {
      if (isEditing && editingView) {
        updateView(editingView.id, {
          name: name.trim(),
          icon,
          color,
          isPinned,
        });
      } else {
        createView({
          name: name.trim(),
          filters: currentFilters,
          icon,
          color,
          isPinned,
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save view');
    }
  };

  // Count active filters
  const filterCount = Object.values(currentFilters).filter(
    (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-100">
                  {isEditing ? 'Edit View' : 'Save View'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-900/40 backdrop-blur-xl rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Filter Preview */}
              {!isEditing && (
                <div className="p-3 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg">
                  <p className="text-sm text-slate-300">
                    Saving <span className="font-medium">{filterCount}</span> filter
                    {filterCount !== 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentFilters.keyword && (
                      <FilterChip label={`"${currentFilters.keyword}"`} />
                    )}
                    {currentFilters.stage && (
                      <FilterChip label={currentFilters.stage} />
                    )}
                    {currentFilters.region && (
                      <FilterChip label={currentFilters.region} />
                    )}
                    {currentFilters.cpvDivisions?.map((d) => (
                      <FilterChip key={d} label={`CPV ${d}`} />
                    ))}
                    {currentFilters.sustainability && (
                      <FilterChip label="Sustainability" />
                    )}
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  View Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., NHS Opportunities"
                  className="w-full px-4 py-2.5 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Icon (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIcon(undefined)}
                    className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-sm transition-colors ${
                      !icon
                        ? 'border-blue-500/50 bg-blue-950/20'
                        : 'border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    <span className="text-slate-400">—</span>
                  </button>
                  {ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                        icon === emoji
                          ? 'border-blue-500/50 bg-blue-950/20'
                          : 'border-slate-700/50 hover:border-slate-600/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        color === c.value
                          ? 'border-slate-200/30'
                          : 'border-transparent'
                      }`}
                      title={c.name}
                    >
                      <span
                        className={`w-6 h-6 rounded-full bg-${c.value}-500`}
                        style={{
                          backgroundColor:
                            c.value === 'gray'
                              ? '#6b7280'
                              : c.value === 'teal'
                              ? '#14b8a6'
                              : c.value === 'blue'
                              ? '#3b82f6'
                              : c.value === 'purple'
                              ? '#8b5cf6'
                              : c.value === 'pink'
                              ? '#ec4899'
                              : c.value === 'orange'
                              ? '#f97316'
                              : '#22c55e',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Toggle */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-200">Pin to top</p>
                  <p className="text-xs text-slate-500">
                    Pinned views appear first in the list
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isPinned ? 'bg-blue-950/200' : 'bg-slate-700/70'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-full shadow-sm"
                    animate={{ left: isPinned ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 border-red-100 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border-slate-600/50 text-slate-200 rounded-lg hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-950/200 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <CheckIcon className="w-4 h-4" />
                  )}
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 border-slate-700/50 rounded-full text-xs text-slate-300">
      {label}
    </span>
  );
}
