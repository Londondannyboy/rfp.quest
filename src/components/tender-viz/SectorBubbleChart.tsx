'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import Link from 'next/link';

interface SectorData {
  sector: string;
  division: string;
  count: number;
  totalValue: number;
  avgValue: number;
  activeTenders: number;
  topBuyers: string[];
}

interface SectorBubbleChartProps {
  region?: string | null;
}

// Sector metadata with colors and icons
const sectorMeta: Record<string, { color: string; icon: string; label: string }> = {
  '45': { color: '#f59e0b', icon: '🏗️', label: 'Construction' },
  '48': { color: '#8b5cf6', icon: '💻', label: 'Software' },
  '50': { color: '#6b7280', icon: '🔧', label: 'Maintenance' },
  '55': { color: '#ec4899', icon: '🏨', label: 'Hospitality' },
  '60': { color: '#14b8a6', icon: '🚚', label: 'Transport' },
  '64': { color: '#3b82f6', icon: '📡', label: 'Telecoms' },
  '65': { color: '#eab308', icon: '⚡', label: 'Utilities' },
  '66': { color: '#22c55e', icon: '🏦', label: 'Finance' },
  '70': { color: '#a855f7', icon: '🏢', label: 'Real Estate' },
  '71': { color: '#06b6d4', icon: '📐', label: 'Engineering' },
  '72': { color: '#6366f1', icon: '🖥️', label: 'IT Services' },
  '73': { color: '#10b981', icon: '🔬', label: 'R&D' },
  '75': { color: '#64748b', icon: '🏛️', label: 'Government' },
  '77': { color: '#84cc16', icon: '🌾', label: 'Agriculture' },
  '79': { color: '#f97316', icon: '💼', label: 'Business' },
  '80': { color: '#0ea5e9', icon: '🎓', label: 'Education' },
  '85': { color: '#ef4444', icon: '🏥', label: 'Healthcare' },
  '90': { color: '#22c55e', icon: '♻️', label: 'Environment' },
  '92': { color: '#f472b6', icon: '🎭', label: 'Culture' },
  '98': { color: '#8b5cf6', icon: '🤝', label: 'Other' },
};

function formatValue(value: number): string {
  if (value >= 1000000000) return `£${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
}

export function SectorBubbleChart({ region }: SectorBubbleChartProps) {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSectorData() {
      try {
        const params = new URLSearchParams();
        if (region) params.set('region', region);

        const res = await fetch(`/api/tenders/by-sector?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSectors(data.sectors || []);
        }
      } catch (error) {
        console.error('Failed to fetch sector data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSectorData();
  }, [region]);

  // Make data available to CopilotKit
  useCopilotReadable({
    description: 'Sector breakdown of UK government tenders',
    value: {
      region: region || 'All UK',
      sectors: sectors.map(s => ({
        name: sectorMeta[s.division]?.label || s.sector,
        count: s.count,
        totalValue: s.totalValue,
        activeTenders: s.activeTenders,
        topBuyers: s.topBuyers,
      })),
      totalTenders: sectors.reduce((sum, s) => sum + s.count, 0),
      totalValue: sectors.reduce((sum, s) => sum + s.totalValue, 0),
    },
  });

  // CopilotKit action to analyze sector trends
  useCopilotAction({
    name: 'analyzeSectorTrends',
    description: 'Analyze trends and opportunities in the selected sector',
    parameters: [
      {
        name: 'sector',
        type: 'string',
        description: 'The sector to analyze (e.g., "72" for IT Services)',
      },
    ],
    handler: async ({ sector }) => {
      setSelectedSector(sector);
      const sectorData = sectors.find(s => s.division === sector);
      if (sectorData) {
        return `Analyzing ${sectorMeta[sector]?.label || sector}: ${sectorData.count} tenders, ${formatValue(sectorData.totalValue)} total value, ${sectorData.activeTenders} currently active.`;
      }
      return 'Sector not found in current data.';
    },
  });

  const maxCount = useMemo(() => Math.max(...sectors.map(s => s.count), 1), [sectors]);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Sector Overview</h2>
        <div className="h-80 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (sectors.length === 0) {
    return null;
  }

  // Sort by count for display
  const sortedSectors = [...sectors].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            <strong>UK Government Tender</strong> Sectors
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {region ? `${region} region` : 'All UK'} • {sectors.reduce((sum, s) => sum + s.count, 0)} total tenders
          </p>
        </div>
      </div>

      {/* Bubble Chart SVG */}
      <div className="relative h-80 rounded-lg overflow-hidden bg-slate-800/30">
        <svg viewBox="0 0 500 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="500" height="300" fill="url(#grid)" />

          {/* Bubbles */}
          {sortedSectors.slice(0, 15).map((sector, index) => {
            const meta = sectorMeta[sector.division] || { color: '#14b8a6', icon: '📋', label: sector.sector };

            // Position in a spiral pattern
            const angle = (index / 15) * Math.PI * 2 + Math.PI / 4;
            const radius = 80 + (index % 3) * 40;
            const cx = 250 + Math.cos(angle) * radius;
            const cy = 150 + Math.sin(angle) * radius * 0.6;

            // Size based on count
            const sizeScale = Math.sqrt(sector.count / maxCount);
            const bubbleRadius = 20 + sizeScale * 35;

            const isHovered = hoveredSector === sector.division;
            const isSelected = selectedSector === sector.division;

            return (
              <g
                key={sector.division}
                onMouseEnter={() => setHoveredSector(sector.division)}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setSelectedSector(isSelected ? null : sector.division)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow effect */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={bubbleRadius + 5}
                    fill={meta.color}
                    opacity={0.3}
                    className="animate-pulse"
                  />
                )}

                {/* Main bubble */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={bubbleRadius}
                  fill={meta.color}
                  opacity={isHovered || isSelected ? 0.9 : 0.6}
                  className="transition-all duration-200"
                />

                {/* Icon */}
                <text
                  x={cx}
                  y={cy - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={bubbleRadius * 0.5}
                >
                  {meta.icon}
                </text>

                {/* Count label */}
                <text
                  x={cx}
                  y={cy + bubbleRadius * 0.4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={Math.min(bubbleRadius * 0.35, 14)}
                  fontWeight="bold"
                >
                  {sector.count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected/Hovered sector details */}
      {(hoveredSector || selectedSector) && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          {sortedSectors
            .filter((s) => s.division === (hoveredSector || selectedSector))
            .map((sector) => {
              const meta = sectorMeta[sector.division] || { color: '#14b8a6', icon: '📋', label: sector.sector };
              return (
                <div key={sector.division}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{meta.icon}</span>
                    <div>
                      <h3 className="text-white font-semibold">{meta.label}</h3>
                      <p className="text-slate-400 text-sm">
                        {sector.count} tenders • {formatValue(sector.totalValue)} total
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-teal-400 font-medium">{sector.activeTenders} active</div>
                      <div className="text-slate-500 text-xs">Avg: {formatValue(sector.avgValue)}</div>
                    </div>
                  </div>

                  {sector.topBuyers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">Top Buyers:</p>
                      <div className="flex flex-wrap gap-2">
                        {sector.topBuyers.slice(0, 4).map((buyer, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300"
                          >
                            {buyer.length > 30 ? buyer.substring(0, 30) + '...' : buyer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/dashboard?cpv=${sector.division}000000`}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
                  >
                    View all {meta.label} tenders →
                  </Link>
                </div>
              );
            })}
        </div>
      )}

      {/* Sector legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {sortedSectors.slice(0, 10).map((sector) => {
          const meta = sectorMeta[sector.division] || { color: '#14b8a6', icon: '📋', label: sector.sector };
          const isActive = hoveredSector === sector.division || selectedSector === sector.division;

          return (
            <button
              key={sector.division}
              onClick={() => setSelectedSector(isActive ? null : sector.division)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                isActive ? 'bg-slate-700' : 'hover:bg-slate-800/50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-xs text-slate-300 truncate">{meta.label}</span>
              <span className="text-xs text-slate-500 ml-auto">{sector.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
