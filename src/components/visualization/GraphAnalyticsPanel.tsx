'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { RFPQuestGraphDB } from '@/lib/zep-client';

interface GraphAnalyticsPanelProps {
  teamId: string;
  selectedNodeId?: string;
  graphData: any;
}

export function GraphAnalyticsPanel({
  teamId,
  selectedNodeId,
  graphData,
}: GraphAnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'competitive' | 'insights' | 'patterns'>('overview');

  useEffect(() => {
    if (selectedNodeId) {
      loadNodeAnalytics(selectedNodeId);
    } else {
      loadOverviewAnalytics();
    }
  }, [selectedNodeId, graphData]);

  const loadNodeAnalytics = async (nodeId: string) => {
    setLoading(true);
    try {
      const graphDB = new RFPQuestGraphDB(teamId);
      
      // Get node neighborhood
      const neighborhood = await graphDB.getNodeNeighborhood(nodeId, 2);
      
      // If it's a tender, get competitive analysis
      let competitiveAnalysis = null;
      if (nodeId.startsWith('tender-')) {
        competitiveAnalysis = await graphDB.analyzeCompetitiveLandscape(nodeId);
      }
      
      setAnalytics({
        type: 'node',
        nodeId,
        neighborhood,
        competitiveAnalysis,
        metrics: calculateNodeMetrics(nodeId, neighborhood),
      });
    } catch (error) {
      console.error('Failed to load node analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewAnalytics = () => {
    const metrics = calculateOverviewMetrics(graphData);
    setAnalytics({
      type: 'overview',
      metrics,
      insights: generateInsights(graphData),
      patterns: identifyPatterns(graphData),
    });
  };

  const calculateNodeMetrics = (nodeId: string, neighborhood: any) => {
    const { nodes, relationships } = neighborhood;
    
    return {
      connectionCount: relationships.length,
      neighborTypes: nodes.reduce((acc: any, node: any) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {}),
      centralityScore: relationships.length / Math.max(nodes.length - 1, 1),
      strongestConnections: relationships
        .sort((a: any, b: any) => (b.weight || 0) - (a.weight || 0))
        .slice(0, 5),
    };
  };

  const calculateOverviewMetrics = (data: any) => {
    const { nodes, links } = data;
    
    // Network density
    const maxConnections = nodes.length * (nodes.length - 1) / 2;
    const density = maxConnections > 0 ? links.length / maxConnections : 0;
    
    // Node type distribution
    const nodeTypes = nodes.reduce((acc: any, node: any) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {});
    
    // Connection strength analysis
    const avgConnectionStrength = links.reduce((sum: number, link: any) => 
      sum + (link.strength || 0.5), 0
    ) / Math.max(links.length, 1);
    
    // Market concentration (if we have tender/company data)
    const tenderNodes = nodes.filter((n: any) => n.type === 'tender');
    const totalValue = tenderNodes.reduce((sum: number, t: any) => 
      sum + (t.value || 0), 0
    );
    
    return {
      networkDensity: density,
      nodeTypes,
      avgConnectionStrength,
      totalTenderValue: totalValue,
      networkComplexity: Math.log(nodes.length) * Math.log(links.length),
    };
  };

  const generateInsights = (data: any) => {
    const insights = [];
    
    // Market concentration insight
    const companies = data.nodes.filter((n: any) => n.type === 'company' || n.type === 'competitor');
    const tenders = data.nodes.filter((n: any) => n.type === 'tender');
    
    if (companies.length > 0 && tenders.length > 0) {
      const avgCompetitorsPerTender = data.links
        .filter((l: any) => l.type === 'bids_for')
        .reduce((acc: any, link: any) => {
          const tenderId = link.target;
          acc[tenderId] = (acc[tenderId] || 0) + 1;
          return acc;
        }, {});
      
      const competitorCounts = Object.values(avgCompetitorsPerTender) as number[];
      const avgCompetition = competitorCounts.length > 0
        ? competitorCounts.reduce((a, b) => a + b, 0) / competitorCounts.length
        : 0;
      
      if (avgCompetition > 8) {
        insights.push({
          type: 'warning',
          title: 'High Competition Market',
          description: `Average ${avgCompetition.toFixed(1)} competitors per tender. Focus on differentiation.`,
          icon: ExclamationTriangleIcon,
        });
      } else if (avgCompetition < 3) {
        insights.push({
          type: 'opportunity',
          title: 'Low Competition Opportunity',
          description: `Only ${avgCompetition.toFixed(1)} average competitors. Good market entry potential.`,
          icon: TrophyIcon,
        });
      }
    }
    
    // Network effects insight
    const networkDensity = calculateOverviewMetrics(data).networkDensity;
    if (networkDensity > 0.3) {
      insights.push({
        type: 'info',
        title: 'Highly Connected Market',
        description: 'Dense network suggests established relationships. Partnerships may be key.',
        icon: UserGroupIcon,
      });
    }
    
    // Value concentration
    const highValueTenders = tenders.filter((t: any) => (t.value || 0) > 1000000);
    if (highValueTenders.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'High-Value Opportunities',
        description: `${highValueTenders.length} tenders worth over £1M identified in network.`,
        icon: CurrencyPoundIcon,
      });
    }
    
    return insights;
  };

  const identifyPatterns = (data: any) => {
    const patterns = [];
    
    // Identify key players (high-degree nodes)
    const nodeDegrees = data.nodes.map((node: any) => ({
      ...node,
      degree: data.links.filter((l: any) => 
        l.source === node.id || l.target === node.id
      ).length,
    }));
    
    const topNodes = nodeDegrees
      .sort((a: any, b: any) => b.degree - a.degree)
      .slice(0, 5);
    
    if (topNodes.length > 0) {
      patterns.push({
        title: 'Key Market Players',
        type: 'nodes',
        data: topNodes,
        description: 'Most connected entities in the network',
      });
    }
    
    // Identify collaboration patterns
    const partnerships = data.links.filter((l: any) => 
      l.type === 'partners_with'
    );
    
    if (partnerships.length > 0) {
      patterns.push({
        title: 'Partnership Networks',
        type: 'partnerships',
        data: partnerships,
        description: 'Companies collaborating on bids',
      });
    }
    
    // Identify sector clustering
    const sectorLinks = data.links.filter((l: any) => 
      l.type === 'similar_to'
    );
    
    if (sectorLinks.length > 0) {
      patterns.push({
        title: 'Sector Clustering',
        type: 'sectors',
        data: sectorLinks,
        description: 'Related tender categories and specializations',
      });
    }
    
    return patterns;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-80 max-h-[600px] overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-white/20">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'competitive', label: 'Competition', icon: TrophyIcon },
            { id: 'insights', label: 'Insights', icon: LightBulbIcon },
            { id: 'patterns', label: 'Patterns', icon: SparklesIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'text-white bg-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-[500px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {selectedNodeId ? (
              // Single node analytics
              <>
                <div>
                  <h4 className="text-white font-medium mb-2">Node Analysis</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">
                        {analytics.metrics?.connectionCount || 0}
                      </div>
                      <div className="text-xs text-white/60">Connections</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-white">
                        {(analytics.metrics?.centralityScore * 100 || 0).toFixed(0)}%
                      </div>
                      <div className="text-xs text-white/60">Centrality</div>
                    </div>
                  </div>
                </div>
                
                {analytics.metrics?.neighborTypes && (
                  <div>
                    <h5 className="text-white/80 font-medium mb-2 text-sm">Connected Node Types</h5>
                    <div className="space-y-1">
                      {Object.entries(analytics.metrics.neighborTypes).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm text-white/70">
                          <span className="capitalize">{type}:</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Network overview
              <>
                <div>
                  <h4 className="text-white font-medium mb-2">Network Overview</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        {graphData.nodes.length}
                      </div>
                      <div className="text-xs text-white/60">Nodes</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        {graphData.links.length}
                      </div>
                      <div className="text-xs text-white/60">Connections</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        {(analytics.metrics?.networkDensity * 100 || 0).toFixed(1)}%
                      </div>
                      <div className="text-xs text-white/60">Density</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-lg font-bold text-white">
                        £{((analytics.metrics?.totalTenderValue || 0) / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-white/60">Total Value</div>
                    </div>
                  </div>
                </div>
                
                {analytics.metrics?.nodeTypes && (
                  <div>
                    <h5 className="text-white/80 font-medium mb-2 text-sm">Node Distribution</h5>
                    <div className="space-y-1">
                      {Object.entries(analytics.metrics.nodeTypes).map(([type, count]) => (
                        <div key={type} className="flex justify-between text-sm text-white/70">
                          <span className="capitalize">{type}:</span>
                          <span>{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {/* Competitive Analysis Tab */}
        {activeTab === 'competitive' && analytics.competitiveAnalysis && (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Competitive Landscape</h4>
              <div className="space-y-2">
                {analytics.competitiveAnalysis.competitors.slice(0, 5).map((comp: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/10 rounded">
                    <span className="text-white text-sm">{comp.company.properties.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-red-400 to-red-600 h-1.5 rounded-full"
                          style={{ width: `${comp.strength * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/70">
                        {(comp.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-lg font-bold text-white">
                  {(analytics.competitiveAnalysis.incumbentAdvantage * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-white/60">Incumbent Advantage</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-lg font-bold text-white">
                  {(analytics.competitiveAnalysis.marketConcentration * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-white/60">Market Concentration</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Insights Tab */}
        {activeTab === 'insights' && analytics.insights && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">AI Insights</h4>
            {analytics.insights.map((insight: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${
                  insight.type === 'warning' 
                    ? 'bg-red-500/20 border-red-500/50' 
                    : insight.type === 'opportunity'
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-blue-500/20 border-blue-500/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <insight.icon className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-white font-medium text-sm">{insight.title}</h5>
                    <p className="text-white/80 text-xs mt-1">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Patterns Tab */}
        {activeTab === 'patterns' && analytics.patterns && (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Network Patterns</h4>
            {analytics.patterns.map((pattern: any, i: number) => (
              <div key={i} className="bg-white/10 rounded-lg p-3">
                <h5 className="text-white font-medium text-sm mb-2">{pattern.title}</h5>
                <p className="text-white/70 text-xs mb-2">{pattern.description}</p>
                
                {pattern.type === 'nodes' && (
                  <div className="space-y-1">
                    {pattern.data.slice(0, 3).map((node: any, j: number) => (
                      <div key={j} className="flex justify-between text-xs">
                        <span className="text-white/80 truncate">{node.name}</span>
                        <span className="text-white/60">{node.degree} connections</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {pattern.type === 'partnerships' && (
                  <div className="text-xs text-white/80">
                    {pattern.data.length} active partnerships identified
                  </div>
                )}
                
                {pattern.type === 'sectors' && (
                  <div className="text-xs text-white/80">
                    {pattern.data.length} sector relationships mapped
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}