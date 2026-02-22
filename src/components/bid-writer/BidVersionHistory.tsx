'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { BidVersion } from '@/lib/db/types';

interface BidVersionHistoryProps {
  bidId: string;
  currentVersion: number;
  versions: BidVersion[];
  onRestore: (version: BidVersion) => void;
}

export function BidVersionHistory({
  bidId,
  currentVersion,
  versions,
  onRestore,
}: BidVersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<BidVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getVersionLabel = (version: number) => {
    if (version === currentVersion) return 'Current';
    if (version === currentVersion - 1) return 'Previous';
    return `v${version}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          Version History
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedVersion?.id === version.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    version.version_number === currentVersion
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {getVersionLabel(version.version_number)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Version {version.version_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(version.created_at)}
                  </p>
                </div>
              </div>
              
              {version.version_number !== currentVersion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(version);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  Restore
                </button>
              )}
            </div>
            
            {version.changes_summary && (
              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                {version.changes_summary}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {versions.length === 0 && (
        <div className="p-8 text-center">
          <DocumentDuplicateIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No version history yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Versions are created automatically as you save
          </p>
        </div>
      )}
    </div>
  );
}