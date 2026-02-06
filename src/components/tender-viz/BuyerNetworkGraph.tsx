'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import Link from 'next/link';

interface BuyerNode {
  id: string;
  name: string;
  tenderCount: number;
  totalValue: number;
  region: string | null;
  sectors: string[];
  activeTenders: number;
}

interface BuyerConnection {
  from: string;
  to: string;
  sharedSectors: string[];
  strength: number; // 1-10 based on overlap
}

interface BuyerNetworkGraphProps {
  currentBuyer?: string;
  region?: string | null;
}

function formatValue(value: number): string {
  if (value >= 1000000000) return `£${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value}`;
}

// Generate a consistent color from buyer name
function getBuyerColor(name: string): string {
  const colors = [
    '#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function BuyerNetworkGraph({ currentBuyer, region }: BuyerNetworkGraphProps) {
  const [buyers, setBuyers] = useState<BuyerNode[]>([]);
  const [connections, setConnections] = useState<BuyerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBuyer, setHoveredBuyer] = useState<string | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(currentBuyer || null);

  useEffect(() => {
    async function fetchBuyerNetwork() {
      try {
        const params = new URLSearchParams();
        if (region) params.set('region', region);
        if (currentBuyer) params.set('focus', currentBuyer);

        const res = await fetch(`/api/tenders/buyer-network?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setBuyers(data.buyers || []);
          setConnections(data.connections || []);
        }
      } catch (error) {
        console.error('Failed to fetch buyer network:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBuyerNetwork();
  }, [currentBuyer, region]);

  // Make data available to CopilotKit
  useCopilotReadable({
    description: 'Network of UK government buyers and their tender relationships',
    value: {
      region: region || 'All UK',
      buyerCount: buyers.length,
      totalTenders: buyers.reduce((sum, b) => sum + b.tenderCount, 0),
      topBuyers: buyers.slice(0, 5).map(b => ({
        name: b.name,
        tenderCount: b.tenderCount,
        totalValue: b.totalValue,
        sectors: b.sectors,
      })),
    },
  });

  // CopilotKit action to analyze a specific buyer
  useCopilotAction({
    name: 'analyzeBuyer',
    description: 'Analyze tender patterns for a specific government buyer',
    parameters: [
      {
        name: 'buyerName',
        type: 'string',
        description: 'Name of the buyer organization to analyze',
      },
    ],
    handler: async ({ buyerName }) => {
      const buyer = buyers.find(b =>
        b.name.toLowerCase().includes(buyerName.toLowerCase())
      );
      if (buyer) {
        setSelectedBuyer(buyer.id);
        return `Analyzing ${buyer.name}: ${buyer.tenderCount} tenders, ${formatValue(buyer.totalValue)} total spend, active in ${buyer.sectors.join(', ')}.`;
      }
      return 'Buyer not found in the network.';
    },
  });

  const maxCount = useMemo(() => Math.max(...buyers.map(b => b.tenderCount), 1), [buyers]);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Buyer Network</h2>
        <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (buyers.length === 0) {
    return null;
  }

  // Sort buyers by tender count
  const sortedBuyers = [...buyers].sort((a, b) => b.tenderCount - a.tenderCount);
  const displayBuyers = sortedBuyers.slice(0, 20);

  // Calculate positions for network graph
  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const centerX = 250;
    const centerY = 200;

    displayBuyers.forEach((buyer, index) => {
      // Primary buyer (if any) in center
      if (buyer.name === currentBuyer || (selectedBuyer && buyer.id === selectedBuyer)) {
        pos[buyer.id] = { x: centerX, y: centerY };
      } else {
        // Others in concentric circles
        const ring = Math.floor(index / 6);
        const angleOffset = (index % 6) * (Math.PI / 3) + (ring * Math.PI / 6);
        const radius = 80 + ring * 60;
        pos[buyer.id] = {
          x: centerX + Math.cos(angleOffset) * radius,
          y: centerY + Math.sin(angleOffset) * radius * 0.7,
        };
      }
    });

    return pos;
  }, [displayBuyers, currentBuyer, selectedBuyer]);

  // Get connections for selected/hovered buyer
  const activeConnections = useMemo(() => {
    const activeId = hoveredBuyer || selectedBuyer;
    if (!activeId) return [];
    return connections.filter(c => c.from === activeId || c.to === activeId);
  }, [connections, hoveredBuyer, selectedBuyer]);

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            <strong>Government Buyer</strong> Network
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {buyers.length} organizations • {region || 'All UK'}
          </p>
        </div>
        {selectedBuyer && (
          <button
            onClick={() => setSelectedBuyer(null)}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Network Graph SVG */}
      <div className="relative h-96 rounded-lg overflow-hidden bg-slate-800/30">
        <svg viewBox="0 0 500 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Connection lines */}
          <g>
            {activeConnections.map((conn, i) => {
              const fromPos = positions[conn.from];
              const toPos = positions[conn.to];
              if (!fromPos || !toPos) return null;

              return (
                <line
                  key={i}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="rgba(20, 184, 166, 0.3)"
                  strokeWidth={conn.strength / 3}
                  strokeDasharray={conn.strength < 5 ? '4,4' : 'none'}
                />
              );
            })}
          </g>

          {/* Buyer nodes */}
          {displayBuyers.map((buyer) => {
            const pos = positions[buyer.id];
            if (!pos) return null;

            const isHovered = hoveredBuyer === buyer.id;
            const isSelected = selectedBuyer === buyer.id;
            const isConnected = activeConnections.some(
              (c) => c.from === buyer.id || c.to === buyer.id
            );

            // Size based on tender count
            const sizeScale = Math.sqrt(buyer.tenderCount / maxCount);
            const nodeRadius = 15 + sizeScale * 25;
            const color = getBuyerColor(buyer.name);

            return (
              <g
                key={buyer.id}
                onMouseEnter={() => setHoveredBuyer(buyer.id)}
                onMouseLeave={() => setHoveredBuyer(null)}
                onClick={() => setSelectedBuyer(isSelected ? null : buyer.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow effect */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius + 8}
                    fill={color}
                    opacity={0.3}
                  />
                )}

                {/* Main node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={color}
                  opacity={isHovered || isSelected || isConnected ? 0.9 : 0.5}
                  className="transition-opacity duration-200"
                />

                {/* Count label */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={Math.min(nodeRadius * 0.6, 14)}
                  fontWeight="bold"
                >
                  {buyer.tenderCount}
                </text>

                {/* Name label (on hover/select) */}
                {(isHovered || isSelected) && nodeRadius > 25 && (
                  <text
                    x={pos.x}
                    y={pos.y + nodeRadius + 12}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    className="pointer-events-none"
                  >
                    {buyer.name.length > 20 ? buyer.name.substring(0, 20) + '...' : buyer.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected buyer details */}
      {(hoveredBuyer || selectedBuyer) && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          {sortedBuyers
            .filter((b) => b.id === (hoveredBuyer || selectedBuyer))
            .map((buyer) => (
              <div key={buyer.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{buyer.name}</h3>
                    {buyer.region && (
                      <p className="text-slate-400 text-sm">{buyer.region}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-teal-400 font-bold">{buyer.tenderCount} tenders</div>
                    <div className="text-slate-400 text-sm">{formatValue(buyer.totalValue)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="text-green-400">{buyer.activeTenders} active</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{buyer.sectors.length} sectors</span>
                </div>

                {buyer.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {buyer.sectors.slice(0, 5).map((sector, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/dashboard?buyer=${encodeURIComponent(buyer.name)}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300"
                >
                  View all {buyer.name} tenders →
                </Link>
              </div>
            ))}
        </div>
      )}

      {/* Top buyers list */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {sortedBuyers.slice(0, 8).map((buyer) => {
          const isActive = hoveredBuyer === buyer.id || selectedBuyer === buyer.id;
          const color = getBuyerColor(buyer.name);

          return (
            <button
              key={buyer.id}
              onClick={() => setSelectedBuyer(isActive ? null : buyer.id)}
              className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                isActive ? 'bg-slate-700' : 'hover:bg-slate-800/50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-300 truncate flex-1">
                {buyer.name.length > 20 ? buyer.name.substring(0, 20) + '...' : buyer.name}
              </span>
              <span className="text-xs text-slate-500">{buyer.tenderCount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
