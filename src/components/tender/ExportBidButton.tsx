'use client';

import { useState } from 'react';
import {
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface Props {
  documentId?: string;
  tenderOcid?: string;
  disabled?: boolean;
}

interface ExportOptions {
  includeTableOfContents: boolean;
  includeWordCounts: boolean;
  companyName: string;
}

export function ExportBidButton({ documentId, tenderOcid, disabled }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ExportOptions>({
    includeTableOfContents: true,
    includeWordCounts: true,
    companyName: '',
  });

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportSuccess(false);

    try {
      const response = await fetch('/api/export-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          tenderOcid,
          ...options,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Export failed');
      }

      // Get the blob and download it
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'bid_response.docx';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Main Export Button */}
        <button
          onClick={handleExport}
          disabled={disabled || isExporting}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${exportSuccess
              ? 'bg-blue-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isExporting ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              Downloaded!
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="w-5 h-5" />
              Export to Word
            </>
          )}
        </button>

        {/* Options Button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={disabled || isExporting}
          className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors"
          title="Export options"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-900/90 border-red-700 rounded-lg text-red-200 text-sm whitespace-nowrap z-10">
          {error}
        </div>
      )}

      {/* Options Dropdown */}
      {showOptions && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border-slate-700 rounded-lg shadow-xl z-10">
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-white">Export Options</h3>

            {/* Company Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Company Name (for title page)
              </label>
              <input
                type="text"
                value={options.companyName}
                onChange={(e) => setOptions({ ...options, companyName: e.target.value })}
                placeholder="Leave blank to use profile name"
                className="w-full px-3 py-2 bg-slate-700 border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeTableOfContents}
                  onChange={(e) => setOptions({ ...options, includeTableOfContents: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Include Table of Contents</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeWordCounts}
                  onChange={(e) => setOptions({ ...options, includeWordCounts: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Show Word Counts</span>
              </label>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {isExporting ? 'Exporting...' : 'Export Document'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
