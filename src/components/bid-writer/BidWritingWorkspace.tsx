'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  CloudArrowUpIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import type { Tender } from '@/lib/hooks/use-tenders';
import type { Bid, BidSection, ResponseLibraryItem } from '@/lib/db/types';
import { ResponseLibraryPanel } from './ResponseLibraryPanel';
import { ComplianceChecker } from './ComplianceChecker';
import { AIResponseGenerator } from './AIResponseGenerator';
import { BidVersionHistory } from './BidVersionHistory';

interface BidWritingWorkspaceProps {
  tender: Tender;
  bid?: Bid;
  companyProfile?: any;
  onSave: (bid: Partial<Bid>) => Promise<void>;
  onSubmit: (bid: Partial<Bid>) => Promise<void>;
}

export function BidWritingWorkspace({
  tender,
  bid,
  companyProfile,
  onSave,
  onSubmit,
}: BidWritingWorkspaceProps) {
  const [sections, setSections] = useState<BidSection[]>(
    bid?.content?.sections || []
  );
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResponseLibrary, setShowResponseLibrary] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showCompliance, setShowCompliance] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [complianceScore, setComplianceScore] = useState<number>(0);
  const [winProbability, setWinProbability] = useState<number | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Parse tender requirements into sections
  useEffect(() => {
    const tenderWithAnalysis = tender as any;
    if (!bid && tenderWithAnalysis.analysis) {
      const requirements = tenderWithAnalysis.analysis.requirements || [];
      const newSections: BidSection[] = requirements.map((req: any) => ({
        id: `section-${Date.now()}-${Math.random()}`,
        title: req.title || req.section || 'Section',
        content: '',
        requirement_ref: req.id,
        compliance_status: 'non-compliant',
        word_count: 0,
      }));
      setSections(newSections);
    }
  }, [tender, bid]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!sections.length) return;
    
    setIsSaving(true);
    try {
      await onSave({
        content: { sections },
        compliance_score: complianceScore,
        predicted_win_probability: winProbability || undefined,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sections, complianceScore, winProbability, onSave]);

  // Trigger auto-save on section changes
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    autoSaveTimer.current = setTimeout(autoSave, 3000); // Auto-save after 3 seconds
    
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [sections, autoSave]);

  const handleSectionUpdate = (sectionId: string, content: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content,
              word_count: content.split(/\s+/).filter(Boolean).length,
            }
          : section
      )
    );
  };

  const handleResponseLibraryInsert = (response: ResponseLibraryItem) => {
    if (!selectedSection) return;
    
    setSections(prev =>
      prev.map(section =>
        section.id === selectedSection
          ? {
              ...section,
              content: section.content + '\n\n' + response.content,
              response_library_ids: [
                ...(section.response_library_ids || []),
                response.id,
              ],
            }
          : section
      )
    );
    
    setShowResponseLibrary(false);
  };

  const handleAIGeneration = (generatedContent: string) => {
    if (!selectedSection) return;
    
    setSections(prev =>
      prev.map(section =>
        section.id === selectedSection
          ? {
              ...section,
              content: section.content + '\n\n' + generatedContent,
            }
          : section
      )
    );
    
    setShowAIGenerator(false);
  };

  const calculateProgress = () => {
    const completedSections = sections.filter(s => s.content.length > 50).length;
    return sections.length > 0 ? (completedSections / sections.length) * 100 : 0;
  };

  const progress = calculateProgress();

  return (
    <div className={`flex h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50' : ''}`}>
      {/* Left Panel - Tender Requirements */}
      <div className="w-1/2 border-r border-slate-700/50 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Tender Requirements</h2>
              <p className="text-sm text-slate-300 mt-1">
                {tender.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompliance(!showCompliance)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  showCompliance
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-900/40 backdrop-blur-xl text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
                Compliance
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-slate-900/40 backdrop-blur-xl transition-colors"
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="w-5 h-5 text-slate-300" />
                ) : (
                  <ArrowsPointingOutIcon className="w-5 h-5 text-slate-300" />
                )}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">Progress</span>
              <span className="text-sm font-medium text-slate-100">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Requirements Sections */}
          <div className="space-y-6">
            {(tender as any).analysis?.requirements?.map((req: any, index: number) => (
              <div
                key={req.id || index}
                className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-slate-100">{req.title || `Section ${index + 1}`}</h3>
                  {sections.find(s => s.requirement_ref === req.id)?.content && (
                    <CheckCircleSolid className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{req.description}</p>
                {req.mandatory && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 mt-3 rounded-full bg-red-900/20 text-red-700 text-xs font-medium">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    Mandatory
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Compliance Panel */}
        {showCompliance && (
          <div className="border-t border-slate-700/50 p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            <ComplianceChecker
              sections={sections}
              requirements={(tender as any).analysis?.requirements || []}
              onScoreUpdate={setComplianceScore}
            />
          </div>
        )}
      </div>
      
      {/* Right Panel - Bid Writing */}
      <div className="w-1/2 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-100">Your Response</h2>
              {isSaving && (
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <CloudArrowUpIcon className="w-4 h-4 animate-pulse" />
                  Saving...
                </span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-sm text-slate-500">
                  Last saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResponseLibrary(!showResponseLibrary)}
                className="px-3 py-1.5 rounded-lg bg-slate-900/40 backdrop-blur-xl hover:bg-slate-800/60 text-slate-200 text-sm font-medium transition-colors"
              >
                <BookmarkIcon className="w-4 h-4 inline mr-1" />
                Library
              </button>
              <button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:shadow-md transition-shadow"
              >
                <SparklesIcon className="w-4 h-4 inline mr-1" />
                AI Write
              </button>
              <button
                onClick={() => onSubmit({ content: { sections } })}
                className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
              >
                Submit Bid
              </button>
            </div>
          </div>
          
          {/* Win Probability */}
          {winProbability !== null && (
            <div className="mt-3 flex items-center gap-3">
              <ChartBarIcon className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300">Win Probability</span>
                  <span className="text-sm font-semibold text-slate-100">
                    {Math.round(winProbability * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-green-500 h-1.5 rounded-full"
                    style={{ width: `${winProbability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto" ref={editorRef}>
          <div className="p-6 space-y-6">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`border rounded-lg transition-all ${
                  selectedSection === section.id
                    ? 'border-blue-400 ring-2 ring-blue-100'
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="px-4 py-3 border-b border-slate-700/50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-100">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">
                        {section.word_count || 0} words
                      </span>
                      {section.compliance_status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            section.compliance_status === 'compliant'
                              ? 'bg-green-100 text-green-700'
                              : section.compliance_status === 'partial'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {section.compliance_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <textarea
                  className="w-full p-4 min-h-[200px] resize-none focus:outline-none"
                  placeholder="Write your response here..."
                  value={section.content}
                  onChange={(e) => handleSectionUpdate(section.id, e.target.value)}
                  onFocus={() => setSelectedSection(section.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Side Panels */}
      <AnimatePresence>
        {showResponseLibrary && (
          <ResponseLibraryPanel
            onClose={() => setShowResponseLibrary(false)}
            onInsert={handleResponseLibraryInsert}
            teamId={bid?.team_id || ''}
            sectorCodes={tender.cpvCodes}
          />
        )}
        
        {showAIGenerator && selectedSection && (
          <AIResponseGenerator
            onClose={() => setShowAIGenerator(false)}
            onGenerate={handleAIGeneration}
            requirement={(tender as any).analysis?.requirements?.find(
              (r: any) => r.id === sections.find(s => s.id === selectedSection)?.requirement_ref
            )}
            companyProfile={companyProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}