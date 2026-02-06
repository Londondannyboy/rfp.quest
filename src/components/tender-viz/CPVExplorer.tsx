'use client';

import { useState } from 'react';
import { TagIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface CPVCode {
  code: string;
  description: string;
  level: number; // 1 = division, 2 = group, 3 = class, 4 = category, 5 = subcategory
  parent?: string;
  children?: CPVCode[];
}

interface CPVExplorerProps {
  codes: CPVCode[];
  primaryCode?: string;
  showHierarchy?: boolean;
}

// CPV division colors for visual distinction
const divisionColors: Record<string, { bg: string; text: string; border: string }> = {
  '03': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  '09': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  '14': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  '15': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  '18': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  '22': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  '30': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  '31': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  '32': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  '33': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  '34': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  '35': { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/30' },
  '38': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  '39': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  '42': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  '44': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  '45': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  '48': { bg: 'bg-blue-600/10', text: 'text-blue-300', border: 'border-blue-600/30' },
  '50': { bg: 'bg-green-600/10', text: 'text-green-300', border: 'border-green-600/30' },
  '55': { bg: 'bg-yellow-600/10', text: 'text-yellow-300', border: 'border-yellow-600/30' },
  '60': { bg: 'bg-orange-600/10', text: 'text-orange-300', border: 'border-orange-600/30' },
  '63': { bg: 'bg-red-600/10', text: 'text-red-300', border: 'border-red-600/30' },
  '64': { bg: 'bg-pink-600/10', text: 'text-pink-300', border: 'border-pink-600/30' },
  '65': { bg: 'bg-purple-600/10', text: 'text-purple-300', border: 'border-purple-600/30' },
  '66': { bg: 'bg-indigo-600/10', text: 'text-indigo-300', border: 'border-indigo-600/30' },
  '70': { bg: 'bg-cyan-600/10', text: 'text-cyan-300', border: 'border-cyan-600/30' },
  '71': { bg: 'bg-teal-600/10', text: 'text-teal-300', border: 'border-teal-600/30' },
  '72': { bg: 'bg-emerald-600/10', text: 'text-emerald-300', border: 'border-emerald-600/30' },
  '73': { bg: 'bg-lime-600/10', text: 'text-lime-300', border: 'border-lime-600/30' },
  '75': { bg: 'bg-amber-600/10', text: 'text-amber-300', border: 'border-amber-600/30' },
  '76': { bg: 'bg-rose-600/10', text: 'text-rose-300', border: 'border-rose-600/30' },
  '77': { bg: 'bg-violet-600/10', text: 'text-violet-300', border: 'border-violet-600/30' },
  '79': { bg: 'bg-fuchsia-600/10', text: 'text-fuchsia-300', border: 'border-fuchsia-600/30' },
  '80': { bg: 'bg-sky-600/10', text: 'text-sky-300', border: 'border-sky-600/30' },
  '85': { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30' },
  '90': { bg: 'bg-stone-500/10', text: 'text-stone-300', border: 'border-stone-500/30' },
  '92': { bg: 'bg-neutral-500/10', text: 'text-neutral-300', border: 'border-neutral-500/30' },
  '98': { bg: 'bg-zinc-500/10', text: 'text-zinc-300', border: 'border-zinc-500/30' },
};

function getColorForCode(code: string) {
  const division = code.substring(0, 2);
  return divisionColors[division] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
}

function CPVCodeBadge({ code, isPrimary }: { code: CPVCode; isPrimary?: boolean }) {
  const colors = getColorForCode(code.code);

  return (
    <div
      className={`
        p-3 rounded-lg border transition-all cursor-pointer hover:scale-102
        ${colors.bg} ${colors.border}
        ${isPrimary ? 'ring-2 ring-teal-500/50' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-medium ${colors.text}`}>
              {code.code}
            </span>
            {isPrimary && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-400 rounded">
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 mt-1">{code.description}</p>
        </div>
        <TagIcon className={`w-4 h-4 flex-shrink-0 ${colors.text}`} />
      </div>

      {/* Level indicator */}
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < code.level ? colors.bg.replace('/10', '/50') : 'bg-slate-700'
            }`}
          />
        ))}
        <span className="text-xs text-slate-500 ml-1">L{code.level}</span>
      </div>
    </div>
  );
}

function CPVHierarchy({ codes, primaryCode }: { codes: CPVCode[]; primaryCode?: string }) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpand = (code: string) => {
    setExpanded((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const renderNode = (code: CPVCode, depth: number = 0) => {
    const hasChildren = code.children && code.children.length > 0;
    const isExpanded = expanded.includes(code.code);
    const colors = getColorForCode(code.code);
    const isPrimary = code.code === primaryCode;

    return (
      <div key={code.code} style={{ marginLeft: depth * 16 }}>
        <button
          className={`
            w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all
            hover:bg-slate-800/50
            ${isPrimary ? 'bg-teal-500/10 ring-1 ring-teal-500/30' : ''}
          `}
          onClick={() => hasChildren && toggleExpand(code.code)}
        >
          {hasChildren ? (
            <ChevronRightIcon
              className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          ) : (
            <div className="w-4" />
          )}

          <span className={`font-mono text-sm ${colors.text}`}>{code.code}</span>
          <span className="text-sm text-slate-300 flex-1 truncate">{code.description}</span>

          {isPrimary && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-400 rounded">
              Primary
            </span>
          )}
        </button>

        {isExpanded && code.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  // Build hierarchy from flat list
  const rootCodes = codes.filter((c) => c.level === 1 || !c.parent);

  return (
    <div className="space-y-1">
      {rootCodes.map((code) => renderNode(code, 0))}
    </div>
  );
}

export function CPVExplorer({ codes, primaryCode, showHierarchy = false }: CPVExplorerProps) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'hierarchy'>(showHierarchy ? 'hierarchy' : 'grid');

  const filteredCodes = codes.filter(
    (code) =>
      code.code.toLowerCase().includes(search.toLowerCase()) ||
      code.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">CPV Classification</h3>
            <p className="text-sm text-slate-400 mt-1">
              Common Procurement Vocabulary codes for this tender
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === 'hierarchy' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tree
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search CPV codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCodes.map((code) => (
              <CPVCodeBadge key={code.code} code={code} isPrimary={code.code === primaryCode} />
            ))}
          </div>
        ) : (
          <CPVHierarchy codes={filteredCodes} primaryCode={primaryCode} />
        )}

        {filteredCodes.length === 0 && (
          <div className="text-center py-8">
            <TagIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">No matching CPV codes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
