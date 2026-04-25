'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import {
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import type { Tender } from '@/lib/hooks/use-tenders';

interface TenderAIActionsProps {
  tender: Tender;
  matchScore?: number | null;
  onClose?: () => void;
}

/**
 * CopilotKit-powered AI actions for a tender card.
 * Provides quick AI analysis, match insights, and suggestions.
 */
export function TenderAIActions({ tender, matchScore, onClose }: TenderAIActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Expose this tender to CopilotKit
  useCopilotReadable({
    description: 'The currently selected tender for AI analysis',
    value: {
      ocid: tender.ocid,
      title: tender.title,
      description: tender.description,
      buyer: tender.buyerName,
      stage: tender.stage,
      value: tender.valueMax,
      deadline: tender.tenderEndDate,
      cpvCodes: tender.cpvCodes,
      region: tender.region,
      matchScore,
    },
  });

  // Quick summary action
  useCopilotAction({
    name: 'quickTenderSummary',
    description: 'Provide a quick 2-3 sentence summary of what this tender is about',
    parameters: [],
    handler: async () => {
      setActiveAction('summary');
      const summary = `This ${tender.buyerName} tender for "${tender.title.slice(0, 50)}..." is in the ${tender.stage} stage. ` +
        `${tender.valueMax ? `Estimated value: £${(tender.valueMax / 1000000).toFixed(1)}M. ` : ''}` +
        `${tender.tenderEndDate ? `Deadline: ${new Date(tender.tenderEndDate).toLocaleDateString()}.` : ''}`;
      setResult(summary);
      return summary;
    },
  });

  // Match analysis action
  useCopilotAction({
    name: 'analyzeMatch',
    description: 'Analyze how well this tender matches the company profile',
    parameters: [],
    handler: async () => {
      setActiveAction('match');
      const analysis = matchScore !== null && matchScore !== undefined
        ? `Match score: ${matchScore}%. ${matchScore >= 70 ? 'Strong match - good fit for your capabilities.' : matchScore >= 40 ? 'Moderate match - review requirements carefully.' : 'Lower match - may require additional capabilities.'}`
        : 'Match analysis pending. Complete your company profile for personalized scoring.';
      setResult(analysis);
      return analysis;
    },
  });

  // Win strategy action
  useCopilotAction({
    name: 'suggestWinStrategy',
    description: 'Suggest key points for a winning bid strategy',
    parameters: [],
    handler: async () => {
      setActiveAction('strategy');
      const strategy = `Key focus areas for "${tender.title.slice(0, 30)}...": ` +
        `1) Highlight relevant experience with ${tender.buyerName}. ` +
        `2) Address specific CPV requirements. ` +
        `3) Demonstrate value for money with clear pricing. ` +
        `4) Include social value commitments.`;
      setResult(strategy);
      return strategy;
    },
  });

  const actions = [
    {
      id: 'summary',
      label: 'Quick Summary',
      icon: DocumentMagnifyingGlassIcon,
      color: 'text-blue-500 bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'match',
      label: 'Match Analysis',
      icon: CheckBadgeIcon,
      color: 'text-blue-500 bg-blue-950/20 hover:bg-blue-900/30',
    },
    {
      id: 'strategy',
      label: 'Win Strategy',
      icon: LightBulbIcon,
      color: 'text-purple-500 bg-purple-50 hover:bg-purple-100',
    },
    {
      id: 'chat',
      label: 'Ask AI',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-amber-500 bg-amber-900/20 hover:bg-amber-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-br from-slate-50 to-white border-t border-slate-700/40 p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-slate-200">AI Actions</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-900/40 backdrop-blur-xl rounded-full transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (action.id === 'chat') {
                // Focus the CopilotSidebar - this triggers the sidebar to open
                // The user can then ask questions about the tender
                const input = document.querySelector('[data-copilot-input]') as HTMLInputElement;
                if (input) {
                  input.focus();
                  input.value = `Tell me about the "${tender.title.slice(0, 40)}..." tender`;
                }
              } else {
                setActiveAction(action.id);
                // The action will be triggered through CopilotKit
              }
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${action.color}`}
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </motion.button>
        ))}
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {result && activeAction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <SparklesIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-200 leading-relaxed">{result}</p>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setActiveAction(null);
              }}
              className="mt-2 text-[10px] text-slate-400 hover:text-slate-300"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Compact AI button for tender row/card that expands on click.
 */
export function TenderAIButton({
  tender,
  matchScore,
}: {
  tender: Tender;
  matchScore?: number | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <TenderAIActions
        tender={tender}
        matchScore={matchScore}
        onClose={() => setExpanded(false)}
      />
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setExpanded(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
    >
      <SparklesIcon className="w-3.5 h-3.5" />
      AI Actions
    </motion.button>
  );
}
