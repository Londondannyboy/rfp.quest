'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  TagIcon,
  FolderIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { ResponseLibraryItem } from '@/lib/db/types';
import { searchResponseLibrary } from '@/lib/db/operations';

interface ResponseLibraryPanelProps {
  onClose: () => void;
  onInsert: (response: ResponseLibraryItem) => void;
  teamId: string;
  sectorCodes?: string[];
}

const categories = [
  { id: 'technical', label: 'Technical', icon: '🔧' },
  { id: 'commercial', label: 'Commercial', icon: '💰' },
  { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
  { id: 'quality', label: 'Quality', icon: '✨' },
  { id: 'experience', label: 'Experience', icon: '🏆' },
];

export function ResponseLibraryPanel({
  onClose,
  onInsert,
  teamId,
  sectorCodes = [],
}: ResponseLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [responses, setResponses] = useState<ResponseLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<ResponseLibraryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadResponses();
  }, [searchQuery, selectedCategory, selectedTags]);

  const loadResponses = async () => {
    setLoading(true);
    try {
      const results = await searchResponseLibrary(
        teamId,
        searchQuery || undefined,
        selectedCategory || undefined,
        selectedTags.length > 0 ? selectedTags : undefined
      );
      setResponses(results);
    } catch (error) {
      console.error('Failed to load responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async (response: ResponseLibraryItem) => {
    try {
      await navigator.clipboard.writeText(response.content);
      setCopiedId(response.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getWinRateColor = (winRate: number | null) => {
    if (winRate === null) return 'text-slate-500';
    if (winRate >= 0.7) return 'text-green-600';
    if (winRate >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-[480px] bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Response Library</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-900/40 backdrop-blur-xl transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search responses..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-700/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Response List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : responses.length === 0 ? (
          <div className="p-6 text-center">
            <FolderIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">No responses found</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <PlusIcon className="w-4 h-4 inline mr-1" />
              Create New Response
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {responses.map((response) => (
              <div
                key={response.id}
                className={`p-4 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 cursor-pointer transition-colors ${
                  selectedResponse?.id === response.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedResponse(response)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-100 line-clamp-1">
                    {response.title}
                  </h4>
                  <div className="flex items-center gap-2 ml-2">
                    {response.usage_count > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <ClockIcon className="w-3 h-3" />
                        {response.usage_count}
                      </span>
                    )}
                    {response.win_rate !== null && (
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${getWinRateColor(
                          response.win_rate
                        )}`}
                      >
                        <ChartBarIcon className="w-3 h-3" />
                        {Math.round(response.win_rate * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 line-clamp-3 mb-3">
                  {response.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {response.category && (
                      <span className="px-2 py-1 rounded-full bg-slate-900/40 backdrop-blur-xl text-slate-200 text-xs">
                        {categories.find(c => c.id === response.category)?.icon} {response.category}
                      </span>
                    )}
                    {response.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs"
                      >
                        <TagIcon className="w-3 h-3 inline mr-0.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyToClipboard(response);
                      }}
                      className="p-1.5 rounded hover:bg-slate-800/60 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === response.id ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <DocumentDuplicateIcon className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsert(response);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Response Preview */}
      {selectedResponse && (
        <div className="border-t border-slate-700/50 p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-100">Preview</h4>
            <button
              onClick={() => setSelectedResponse(null)}
              className="text-xs text-slate-500 hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <div className="p-3 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50 max-h-32 overflow-y-auto">
            <p className="text-sm text-slate-200 whitespace-pre-wrap">
              {selectedResponse.content}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onInsert(selectedResponse)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Insert Response
            </button>
            <button
              onClick={() => handleCopyToClipboard(selectedResponse)}
              className="px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-700/70 transition-colors text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}