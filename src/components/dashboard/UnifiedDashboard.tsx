'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  ArrowsPointingOutIcon,
  SparklesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Import all our dashboard components
import { DashboardViewToggle, type DashboardView } from './DashboardViewToggle';
import { TenderCardGrid } from './TenderCardGrid';
import { TenderTableView } from './TenderTableView';
import { TenderNetworkGraph } from '../visualization/TenderNetworkGraph';
import { GraphAnalyticsPanel } from '../visualization/GraphAnalyticsPanel';
import { WinPredictionPanel } from './WinPredictionPanel';
import { BidWritingWorkspace } from '../bid-writer/BidWritingWorkspace';
import { EnrichmentButton } from '../enrichment/EnrichmentButton';

import type { Tender } from '@/lib/hooks/use-tenders';

interface UnifiedDashboardProps {
  tenders: Tender[];
  teamId: string;
  userId?: string;
  companyProfile?: any;
}

export function UnifiedDashboard({
  tenders,
  teamId,
  userId,
  companyProfile,
}: UnifiedDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [showBidWriter, setShowBidWriter] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    minValue: 0,
    maxDaysToDeadline: 365,
    sectors: [] as string[],
    matchScoreMin: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Filter tenders based on current filters
  const filteredTenders = tenders.filter(tender => {
    if (searchQuery && !tender.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (filters.status !== 'all' && tender.status !== filters.status) {
      return false;
    }
    
    if ((tender.valueAmount || 0) < filters.minValue) {
      return false;
    }
    
    const daysToDeadline = tender.tenderEndDate ? Math.ceil(
      (new Date(tender.tenderEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ) : Infinity;
    if (daysToDeadline > filters.maxDaysToDeadline) {
      return false;
    }
    
    if (filters.sectors.length > 0) {
      const hasMatchingSector = tender.cpvCodes?.some(code => 
        filters.sectors.some(sector => code.startsWith(sector))
      );
      if (!hasMatchingSector) {
        return false;
      }
    }
    
    if ((tender as any).match_score !== null && (tender as any).match_score < filters.matchScoreMin) {
      return false;
    }
    
    return true;
  });

  const handleTenderAnalyze = (tender: Tender) => {
    setSelectedTender(tender);
    setShowBidWriter(true);
  };

  const handleTenderEdit = (tender: Tender) => {
    // Handle tender editing
    console.log('Edit tender:', tender);
  };

  const handleExport = (selectedTenders: Tender[]) => {
    // Export functionality
    const csvData = selectedTenders.map(tender => ({
      title: tender.title,
      buyer: tender.buyerName,
      value: tender.valueAmount,
      deadline: tender.tenderEndDate,
      match_score: (tender as any).match_score,
      status: tender.status,
    }));
    
    // Use the utility function from utils.ts
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBidSave = async (bid: any) => {
    console.log('Saving bid:', bid);
  };

  const handleBidSubmit = async (bid: any) => {
    console.log('Submitting bid:', bid);
  };

  const handleNodeClick = (node: any) => {
    setSelectedNodeId(node.id);
    if (node.type === 'tender') {
      const tender = tenders.find(t => `tender-${t.id}` === node.id);
      if (tender) {
        setSelectedTender(tender);
      }
    }
  };

  // Transform tender data for graph visualization
  const graphTenders = filteredTenders.map(tender => ({
    ...tender,
    competitors: (tender as any).competitor_analysis?.competitors || [],
  }));

  return (
    <div className={`h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Bid Writing Workspace Overlay */}
      <AnimatePresence>
        {showBidWriter && selectedTender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            <BidWritingWorkspace
              tender={selectedTender}
              companyProfile={companyProfile}
              onSave={handleBidSave}
              onSubmit={handleBidSubmit}
            />
            <button
              onClick={() => setShowBidWriter(false)}
              className="fixed top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-lg z-10"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RFP Dashboard</h1>
              <p className="text-gray-600">
                {filteredTenders.length} of {tenders.length} opportunities
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4" />
                Add Tender
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowsPointingOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tenders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
            </button>
            
            {/* View Toggle - Compact */}
            <DashboardViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
              compactMode={true}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full p-6"
              >
                <TenderCardGrid
                  tenders={filteredTenders}
                  onAnalyze={handleTenderAnalyze}
                />
              </motion.div>
            )}

            {currentView === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full p-6"
              >
                <TenderTableView
                  tenders={filteredTenders}
                  teamId={teamId}
                  onEdit={handleTenderEdit}
                  onAnalyze={handleTenderAnalyze}
                  onExport={handleExport}
                />
              </motion.div>
            )}

            {currentView === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full relative"
              >
                <TenderNetworkGraph
                  tenders={graphTenders}
                  focusId={selectedTender?.id}
                  onNodeClick={handleNodeClick}
                />
                
                {/* Analytics Overlay */}
                {selectedNodeId && (
                  <div className="absolute bottom-4 right-4">
                    <GraphAnalyticsPanel
                      teamId={teamId}
                      selectedNodeId={selectedNodeId}
                      graphData={{ nodes: [], links: [] }} // This would be populated with actual graph data
                    />
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full p-6 overflow-y-auto"
              >
                <div className="max-w-7xl mx-auto space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {filteredTenders.length}
                          </div>
                          <div className="text-sm text-gray-600">Active Opportunities</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            £{(filteredTenders.reduce((sum, t) => sum + (t.valueAmount || 0), 0) / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-600">Total Value</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {Math.round(filteredTenders.reduce((sum, t) => sum + (t.match_score || 0), 0) / Math.max(filteredTenders.length, 1))}%
                          </div>
                          <div className="text-sm text-gray-600">Avg Match Score</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {filteredTenders.filter(t => {
                              const days = Math.ceil((new Date(t.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return days <= 14;
                            }).length}
                          </div>
                          <div className="text-sm text-gray-600">Closing Soon</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Win Prediction for Selected Tender */}
                  {selectedTender && (
                    <WinPredictionPanel
                      tender={selectedTender}
                      company={companyProfile}
                      onImprove={() => handleTenderAnalyze(selectedTender)}
                    />
                  )}

                  {/* Placeholder for additional analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Sector Distribution</h3>
                      {/* Sector chart would go here */}
                      <div className="text-gray-500">Chart component coming soon...</div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4">Timeline Forecast</h3>
                      {/* Timeline chart would go here */}
                      <div className="text-gray-500">Timeline component coming soon...</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}