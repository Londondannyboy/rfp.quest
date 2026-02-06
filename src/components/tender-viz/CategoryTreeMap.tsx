'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCopilotReadable } from '@copilotkit/react-core';
import Link from 'next/link';

interface TenderCategory {
  cpvCode: string;
  cpvName: string;
  count: number;
  totalValue: number;
  tenders: {
    ocid: string;
    slug: string;
    title: string;
    valueMax: number | null;
  }[];
}

interface CategoryTreeMapProps {
  currentCpvCodes: string[] | null;
  currentOcid: string;
}

// CPV Division names
const cpvDivisions: Record<string, string> = {
  '45': 'Construction',
  '48': 'Software & IT Systems',
  '50': 'Repair & Maintenance',
  '55': 'Hospitality',
  '60': 'Transport',
  '64': 'Telecommunications',
  '65': 'Utilities',
  '66': 'Financial Services',
  '70': 'Real Estate',
  '71': 'Engineering & Architecture',
  '72': 'IT Services',
  '73': 'Research & Development',
  '75': 'Public Administration',
  '77': 'Agriculture & Forestry',
  '79': 'Business Services',
  '80': 'Education',
  '85': 'Healthcare',
  '90': 'Environment & Waste',
  '92': 'Recreation & Culture',
  '98': 'Other Services',
};

const categoryColors: Record<string, string> = {
  '45': '#f59e0b',
  '48': '#8b5cf6',
  '50': '#6b7280',
  '55': '#ec4899',
  '60': '#14b8a6',
  '64': '#3b82f6',
  '65': '#eab308',
  '66': '#22c55e',
  '70': '#a855f7',
  '71': '#06b6d4',
  '72': '#6366f1',
  '73': '#10b981',
  '75': '#64748b',
  '77': '#84cc16',
  '79': '#f97316',
  '80': '#0ea5e9',
  '85': '#ef4444',
  '90': '#22c55e',
  '92': '#f472b6',
  '98': '#8b5cf6',
};

function getCpvDivision(code: string): string {
  return code.substring(0, 2);
}

function formatValue(value: number): string {
  if (value >= 1000000000) return `£${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
}

export function CategoryTreeMap({ currentCpvCodes, currentOcid }: CategoryTreeMapProps) {
  const [categories, setCategories] = useState<TenderCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Get primary CPV division
  const primaryDivision = useMemo(() => {
    if (!currentCpvCodes || currentCpvCodes.length === 0) return null;
    return getCpvDivision(currentCpvCodes[0]);
  }, [currentCpvCodes]);

  useEffect(() => {
    async function fetchCategoryData() {
      if (!primaryDivision) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/tenders/by-category?division=${primaryDivision}&exclude=${currentOcid}`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [primaryDivision, currentOcid]);

  // Make data available to CopilotKit
  useCopilotReadable({
    description: 'Category breakdown of similar tenders by CPV classification',
    value: {
      primaryDivision,
      categoryName: primaryDivision ? cpvDivisions[primaryDivision] : null,
      categories: categories.map(c => ({
        name: c.cpvName,
        count: c.count,
        totalValue: c.totalValue,
      })),
    },
  });

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Category Breakdown</h2>
        <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!primaryDivision || categories.length === 0) {
    return null;
  }

  // Calculate total for percentages
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);
  const totalValue = categories.reduce((sum, c) => sum + c.totalValue, 0);

  // Layout categories as a treemap grid
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            <strong>{cpvDivisions[primaryDivision]}</strong> Category Breakdown
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {totalCount} tenders • {formatValue(totalValue)} total value
          </p>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: categoryColors[primaryDivision] || '#14b8a6' }}
        />
      </div>

      {/* Treemap visualization */}
      <div className="relative h-64 rounded-lg overflow-hidden bg-slate-800/30">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
          {sortedCategories.map((category, index) => {
            const percent = category.count / totalCount;
            const cols = 4;
            const rows = Math.ceil(sortedCategories.length / cols);
            const col = index % cols;
            const row = Math.floor(index / cols);
            const cellWidth = 400 / cols;
            const cellHeight = 200 / rows;

            // Size based on count
            const sizeScale = Math.sqrt(percent) * 1.5;
            const width = Math.min(cellWidth * sizeScale, cellWidth - 4);
            const height = Math.min(cellHeight * sizeScale, cellHeight - 4);
            const x = col * cellWidth + (cellWidth - width) / 2;
            const y = row * cellHeight + (cellHeight - height) / 2;

            const isHovered = hoveredCategory === category.cpvCode;
            const color = categoryColors[primaryDivision] || '#14b8a6';

            return (
              <g
                key={category.cpvCode}
                onMouseEnter={() => setHoveredCategory(category.cpvCode)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={4}
                  fill={color}
                  opacity={isHovered ? 0.9 : 0.6}
                  className="transition-opacity"
                />
                {width > 60 && height > 40 && (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={Math.min(width / 8, 12)}
                    fontWeight="500"
                  >
                    {category.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered category details */}
      {hoveredCategory && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          {sortedCategories
            .filter((c) => c.cpvCode === hoveredCategory)
            .map((category) => (
              <div key={category.cpvCode}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{category.cpvName}</span>
                  <span className="text-slate-400 text-sm">
                    {category.count} tenders • {formatValue(category.totalValue)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.tenders.slice(0, 3).map((t) => (
                    <Link
                      key={t.ocid}
                      href={`/tender/${t.slug}`}
                      className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition-colors"
                    >
                      {t.title.length > 40 ? t.title.substring(0, 40) + '...' : t.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {sortedCategories.slice(0, 8).map((category) => {
          const percent = Math.round((category.count / totalCount) * 100);
          return (
            <Link
              key={category.cpvCode}
              href={`/dashboard?cpv=${category.cpvCode}`}
              className="group flex items-center gap-2 text-xs p-2 rounded hover:bg-slate-800/50 transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: categoryColors[primaryDivision] || '#14b8a6',
                  opacity: 0.4 + (percent / 100) * 0.6,
                }}
              />
              <span className="text-slate-400 group-hover:text-white truncate">
                {category.cpvName.length > 25
                  ? category.cpvName.substring(0, 25) + '...'
                  : category.cpvName}
              </span>
              <span className="text-slate-500 ml-auto">{percent}%</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
