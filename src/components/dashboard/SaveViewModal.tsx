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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit View' : 'Save View'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Filter Preview */}
              {!isEditing && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  View Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., NHS Opportunities"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Icon (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIcon(undefined)}
                    className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-sm transition-colors ${
                      !icon
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-gray-400">—</span>
                  </button>
                  {ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg transition-colors ${
                        icon === emoji
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                          ? 'border-gray-900'
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
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Pin to top</p>
                  <p className="text-xs text-gray-500">
                    Pinned views appear first in the list
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isPinned ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
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
                  className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <span className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
      {label}
    </span>
  );
}
