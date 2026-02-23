'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyPoundIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  FunnelIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface GraphNode {
  id: string;
  name: string;
  type: 'tender' | 'buyer' | 'company' | 'competitor' | 'sector' | 'decision_maker';
  value?: number;
  color?: string;
  size?: number;
  metadata?: any;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'bids_for' | 'competes_with' | 'won_by' | 'issued_by' | 'similar_to' | 'partners_with' | 'works_for';
  strength?: number;
  label?: string;
  color?: string;
}

interface TenderNetworkGraphProps {
  tenders: any[];
  companies?: any[];
  focusId?: string;
  onNodeClick?: (node: GraphNode) => void;
}

export function TenderNetworkGraph({
  tenders,
  companies = [],
  focusId,
  onNodeClick,
}: TenderNetworkGraphProps) {
  const graphRef = useRef<any>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filters, setFilters] = useState({
    showTenders: true,
    showBuyers: true,
    showCompetitors: true,
    showSectors: true,
    showDecisionMakers: false,
    minValue: 0,
    maxConnections: 100,
  });
  const [viewMode, setViewMode] = useState<'network' | 'hierarchy' | 'timeline'>('network');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [physics, setPhysics] = useState(true);
  const [nodeSize, setNodeSize] = useState('value'); // 'value', 'connections', 'uniform'

  // Build the graph data
  useEffect(() => {
    buildGraphData();
  }, [tenders, companies, filters]);

  const buildGraphData = () => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // Add tender nodes
    if (filters.showTenders) {
      tenders.forEach(tender => {
        if (tender.value >= filters.minValue) {
          const node: GraphNode = {
            id: `tender-${tender.id}`,
            name: tender.title,
            type: 'tender',
            value: tender.value,
            color: '#3B82F6', // Blue
            size: Math.log10(tender.value || 1000) * 3,
            metadata: tender,
          };
          nodes.push(node);
          nodeMap.set(node.id, node);
        }
      });
    }

    // Add buyer nodes
    if (filters.showBuyers) {
      const buyerSet = new Set<string>();
      tenders.forEach(tender => {
        if (tender.buyer_name && !buyerSet.has(tender.buyer_name)) {
          buyerSet.add(tender.buyer_name);
          const node: GraphNode = {
            id: `buyer-${tender.buyer_name}`,
            name: tender.buyer_name,
            type: 'buyer',
            color: '#10B981', // Green
            size: 15,
            metadata: { name: tender.buyer_name },
          };
          nodes.push(node);
          nodeMap.set(node.id, node);

          // Link buyer to tender
          if (filters.showTenders && nodeMap.has(`tender-${tender.id}`)) {
            links.push({
              source: `buyer-${tender.buyer_name}`,
              target: `tender-${tender.id}`,
              type: 'issued_by',
              color: '#10B981',
              strength: 0.5,
            });
          }
        }
      });
    }

    // Add competitor nodes
    if (filters.showCompetitors) {
      const competitorMap = new Map<string, Set<string>>();
      
      tenders.forEach(tender => {
        if (tender.competitors) {
          tender.competitors.forEach((competitor: any) => {
            const compId = `company-${competitor.company_number || competitor.name}`;
            
            if (!nodeMap.has(compId)) {
              const node: GraphNode = {
                id: compId,
                name: competitor.name,
                type: 'competitor',
                color: '#F59E0B', // Amber
                size: 12,
                metadata: competitor,
              };
              nodes.push(node);
              nodeMap.set(compId, node);
            }

            // Link competitor to tender
            if (filters.showTenders && nodeMap.has(`tender-${tender.id}`)) {
              links.push({
                source: compId,
                target: `tender-${tender.id}`,
                type: 'bids_for',
                color: '#F59E0B',
                strength: 0.3,
                label: competitor.is_incumbent ? 'Incumbent' : undefined,
              });
            }

            // Track which competitors bid on which tenders
            if (!competitorMap.has(compId)) {
              competitorMap.set(compId, new Set());
            }
            competitorMap.get(compId)!.add(`tender-${tender.id}`);
          });
        }
      });

      // Add "competes_with" relationships
      const competitors = Array.from(competitorMap.keys());
      for (let i = 0; i < competitors.length; i++) {
        for (let j = i + 1; j < competitors.length; j++) {
          const comp1Tenders = competitorMap.get(competitors[i])!;
          const comp2Tenders = competitorMap.get(competitors[j])!;
          
          // Find shared tenders
          const sharedTenders = Array.from(comp1Tenders).filter(t => comp2Tenders.has(t));
          
          if (sharedTenders.length > 0) {
            links.push({
              source: competitors[i],
              target: competitors[j],
              type: 'competes_with',
              color: '#EF4444',
              strength: Math.min(sharedTenders.length * 0.2, 1),
              label: `${sharedTenders.length} shared bids`,
            });
          }
        }
      }
    }

    // Add sector nodes
    if (filters.showSectors) {
      const sectorMap = new Map<string, string[]>();
      
      tenders.forEach(tender => {
        const primaryCpv = tender.cpv_codes?.[0];
        if (primaryCpv) {
          const sectorCode = primaryCpv.substring(0, 2);
          const sectorName = getCpvSectorName(sectorCode);
          const sectorId = `sector-${sectorCode}`;
          
          if (!nodeMap.has(sectorId)) {
            const node: GraphNode = {
              id: sectorId,
              name: sectorName,
              type: 'sector',
              color: '#8B5CF6', // Purple
              size: 10,
              metadata: { code: sectorCode },
            };
            nodes.push(node);
            nodeMap.set(sectorId, node);
          }
          
          // Link tender to sector
          if (filters.showTenders && nodeMap.has(`tender-${tender.id}`)) {
            links.push({
              source: `tender-${tender.id}`,
              target: sectorId,
              type: 'similar_to',
              color: '#8B5CF6',
              strength: 0.2,
            });
          }
        }
      });
    }

    // Add decision maker nodes (if enabled)
    if (filters.showDecisionMakers) {
      companies.forEach(company => {
        if (company.decision_makers) {
          company.decision_makers.forEach((dm: any) => {
            const dmId = `dm-${dm.name.replace(/\s/g, '-')}`;
            
            if (!nodeMap.has(dmId)) {
              const node: GraphNode = {
                id: dmId,
                name: dm.name,
                type: 'decision_maker',
                color: '#06B6D4', // Cyan
                size: 8,
                metadata: dm,
              };
              nodes.push(node);
              nodeMap.set(dmId, node);
              
              // Link to company
              const companyId = `company-${company.company_number}`;
              if (nodeMap.has(companyId)) {
                links.push({
                  source: dmId,
                  target: companyId,
                  type: 'works_for',
                  color: '#06B6D4',
                  strength: 0.4,
                  label: dm.role,
                });
              }
            }
          });
        }
      });
    }

    // Filter nodes by search query
    const filteredNodes = searchQuery
      ? nodes.filter(node => 
          node.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : nodes;

    // Filter links to only include those with both nodes present
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    setGraphData({ nodes: filteredNodes, links: filteredLinks });
  };

  const getCpvSectorName = (code: string): string => {
    const sectors: Record<string, string> = {
      '03': 'Agriculture',
      '09': 'Petroleum',
      '15': 'Food & Beverage',
      '18': 'Clothing',
      '30': 'IT Equipment',
      '31': 'Electrical',
      '33': 'Medical',
      '34': 'Transport',
      '35': 'Defence',
      '37': 'Musical',
      '38': 'Laboratory',
      '39': 'Furniture',
      '42': 'Machinery',
      '44': 'Construction',
      '45': 'Construction Works',
      '48': 'Software',
      '50': 'Repair Services',
      '51': 'Installation',
      '55': 'Hotels',
      '60': 'Transport Services',
      '63': 'Support Services',
      '64': 'Postal',
      '65': 'Utilities',
      '66': 'Financial',
      '70': 'Real Estate',
      '71': 'Architecture',
      '72': 'IT Services',
      '73': 'R&D',
      '75': 'Public Admin',
      '77': 'Agriculture Services',
      '79': 'Business Services',
      '80': 'Education',
      '85': 'Health',
      '90': 'Environmental',
      '92': 'Recreation',
      '98': 'Other Services',
    };
    return sectors[code] || `Sector ${code}`;
  };

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    if (onNodeClick) {
      onNodeClick(node);
    }
    
    // Center on clicked node
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  const getNodeLabel = (node: GraphNode) => {
    if (hoveredNode?.id === node.id || selectedNode?.id === node.id) {
      if (node.type === 'tender' && node.metadata) {
        return `${node.name}\n£${(node.value || 0).toLocaleString()}\nDeadline: ${new Date(node.metadata.deadline).toLocaleDateString()}`;
      }
      return node.name;
    }
    return node.name;
  };

  const getNodeColor = (node: GraphNode) => {
    if (selectedNode?.id === node.id) {
      return '#DC2626'; // Red for selected
    }
    if (hoveredNode?.id === node.id) {
      return '#7C3AED'; // Purple for hovered
    }
    return node.color;
  };

  const getNodeSize = (node: GraphNode) => {
    switch (nodeSize) {
      case 'value':
        return node.size || 10;
      case 'connections':
        const connections = graphData.links.filter(
          l => l.source === node.id || l.target === node.id
        ).length;
        return Math.max(5, Math.min(20, connections * 2));
      case 'uniform':
      default:
        return 10;
    }
  };

  const fitToScreen = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  const resetPhysics = () => {
    setPhysics(false);
    setTimeout(() => setPhysics(true), 100);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 w-80 border border-white/20">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Network Controls
        </h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40"
          />
        </div>
        
        {/* View Mode */}
        <div className="mb-4">
          <label className="text-white/80 text-xs font-medium mb-2 block">View Mode</label>
          <div className="grid grid-cols-3 gap-1">
            {['network', 'hierarchy', 'timeline'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Node Filters */}
        <div className="space-y-2 mb-4">
          <label className="text-white/80 text-xs font-medium">Show Nodes</label>
          {Object.entries({
            showTenders: 'Tenders',
            showBuyers: 'Buyers',
            showCompetitors: 'Competitors',
            showSectors: 'Sectors',
            showDecisionMakers: 'Decision Makers',
          }).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters[key as keyof typeof filters] as boolean}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
                className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        
        {/* Node Size */}
        <div className="mb-4">
          <label className="text-white/80 text-xs font-medium mb-2 block">Node Size</label>
          <select
            value={nodeSize}
            onChange={(e) => setNodeSize(e.target.value)}
            className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          >
            <option value="uniform">Uniform</option>
            <option value="value">By Value</option>
            <option value="connections">By Connections</option>
          </select>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={fitToScreen}
            className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 text-xs font-medium transition-colors"
          >
            Fit View
          </button>
          <button
            onClick={resetPhysics}
            className="flex-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-300 text-xs font-medium transition-colors"
          >
            Reset Physics
          </button>
        </div>
      </div>
      
      {/* Stats Panel */}
      <div className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <div className="text-2xl font-bold">{graphData.nodes.length}</div>
            <div className="text-xs text-white/60">Nodes</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{graphData.links.length}</div>
            <div className="text-xs text-white/60">Connections</div>
          </div>
        </div>
      </div>
      
      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-10 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-2xl mx-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-semibold text-lg">{selectedNode.name}</h4>
                <p className="text-white/60 text-sm capitalize">{selectedNode.type}</p>
                {selectedNode.type === 'tender' && selectedNode.metadata && (
                  <div className="mt-2 space-y-1 text-white/80 text-sm">
                    <p>Value: £{(selectedNode.value || 0).toLocaleString()}</p>
                    <p>Buyer: {selectedNode.metadata.buyer_name}</p>
                    <p>Deadline: {new Date(selectedNode.metadata.deadline).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Graph */}
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={getNodeLabel}
        nodeColor={getNodeColor}
        nodeRelSize={1}
        nodeVal={getNodeSize}
        linkColor={(link: GraphLink) => link.color || '#ffffff33'}
        linkWidth={(link: GraphLink) => (link.strength || 0.5) * 2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        enableNodeDrag={true}
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        cooldownTime={physics ? 3000 : 0}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        backgroundColor="transparent"
      />
    </div>
  );
}