'use client';

import { motion } from 'framer-motion';
import {
  EyeIcon,
  BookmarkIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface QuickActionButtonsProps {
  slug: string;
  isSaved?: boolean;
  onSave?: () => void;
  onDismiss?: () => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  layout?: 'row' | 'column';
  showLabels?: boolean;
}

/**
 * Quick action buttons for tender cards.
 * View, Save, Analyze, and Dismiss actions.
 */
export function QuickActionButtons({
  slug,
  isSaved = false,
  onSave,
  onDismiss,
  onAnalyze,
  isAnalyzing = false,
  layout = 'row',
  showLabels = false,
}: QuickActionButtonsProps) {
  const containerClass =
    layout === 'row'
      ? 'flex items-center gap-1'
      : 'flex flex-col gap-1';

  const buttonBase = `
    inline-flex items-center justify-center gap-1.5
    rounded-lg transition-all text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-teal-500/50
  `;

  const buttonSize = showLabels
    ? 'px-3 py-1.5'
    : 'p-2';

  return (
    <div className={containerClass}>
      {/* View Details */}
      <Link href={`/tender/${slug}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            ${buttonBase}
            ${buttonSize}
            bg-teal-500 hover:bg-teal-600 text-white
          `}
          title="View tender details"
        >
          <EyeIcon className="w-4 h-4" />
          {showLabels && <span>View</span>}
        </motion.button>
      </Link>

      {/* Save/Unsave */}
      {onSave && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className={`
            ${buttonBase}
            ${buttonSize}
            ${isSaved
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
          `}
          title={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          {isSaved ? (
            <BookmarkSolidIcon className="w-4 h-4" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
          {showLabels && <span>{isSaved ? 'Saved' : 'Save'}</span>}
        </motion.button>
      )}

      {/* Analyze */}
      {onAnalyze && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`
            ${buttonBase}
            ${buttonSize}
            bg-purple-100 hover:bg-purple-200 text-purple-700
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title="AI analysis"
        >
          <SparklesIcon className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
          {showLabels && <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>}
        </motion.button>
      )}

      {/* Dismiss */}
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className={`
            ${buttonBase}
            ${buttonSize}
            bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600
          `}
          title="Dismiss this tender"
        >
          <XMarkIcon className="w-4 h-4" />
          {showLabels && <span>Dismiss</span>}
        </motion.button>
      )}
    </div>
  );
}

/**
 * Minimal action row for list/compact views.
 */
export function QuickActionRow({
  slug,
  isSaved = false,
  onSave,
}: {
  slug: string;
  isSaved?: boolean;
  onSave?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/tender/${slug}`}
        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
      >
        View details
        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
      </Link>
      {onSave && (
        <button
          onClick={onSave}
          className={`p-1 rounded transition-colors ${
            isSaved
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save'}
        >
          {isSaved ? (
            <BookmarkSolidIcon className="w-4 h-4" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
