'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import {
  SparklesIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Tender {
  ocid: string;
  title: string;
  description: string | null;
  buyerName: string;
  stage: string;
  valueMax: number | null;
  tenderEndDate: string | null;
  cpvCodes: string[] | null;
  region: string | null;
}

interface BidAssistantProps {
  tender: Tender;
  onClose?: () => void;
}

/**
 * CopilotKit-powered bid writing assistant.
 * Provides AI-assisted help with tender responses.
 */
export function BidAssistant({ tender, onClose }: BidAssistantProps) {
  const [activeMode, setActiveMode] = useState<'chat' | 'outline' | 'draft' | 'review' | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Expose tender to CopilotKit
  useCopilotReadable({
    description: 'Tender being worked on for bid writing',
    value: {
      title: tender.title,
      buyer: tender.buyerName,
      description: tender.description,
      value: tender.valueMax,
      deadline: tender.tenderEndDate,
      sectors: tender.cpvCodes,
    },
  });

  // Generate bid outline action
  useCopilotAction({
    name: 'generateBidOutline',
    description: 'Generate a structured outline for the bid response',
    parameters: [],
    handler: async () => {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const outline = `
# Bid Response Outline: ${tender.title}

## 1. Executive Summary
- Company introduction and capabilities
- Understanding of ${tender.buyerName}'s requirements
- Key differentiators and value proposition
- Summary of proposed solution

## 2. Technical Approach
- Detailed methodology
- Project phases and milestones
- Quality assurance procedures
- Risk management approach

## 3. Experience & Capability
- Relevant past projects
- Case studies demonstrating similar work
- Team qualifications and CVs
- Subcontractor management (if applicable)

## 4. Social Value
- Local employment commitments
- Environmental sustainability measures
- Community engagement initiatives
- Supply chain diversity

## 5. Commercial Proposal
- Pricing breakdown
- Payment schedule
- Value for money demonstration
- Cost efficiency measures

## 6. Appendices
- Certifications and accreditations
- Financial statements
- Insurance documentation
- References
      `.trim();

      setGeneratedContent(outline);
      setIsGenerating(false);
      return outline;
    },
  });

  // Generate executive summary draft
  useCopilotAction({
    name: 'draftExecutiveSummary',
    description: 'Draft an executive summary for the bid',
    parameters: [],
    handler: async () => {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 2500));

      const summary = `
# Executive Summary

## Understanding Your Requirements

We understand that ${tender.buyerName} is seeking a qualified partner for ${tender.title}. Based on our review of the tender documentation, we recognize the critical importance of delivering high-quality outcomes that meet your specific needs${tender.region ? ` across the ${tender.region} region` : ''}.

## Our Proposal

[Company Name] is ideally positioned to deliver this contract, bringing:

- **Proven Track Record**: [X] years of experience delivering similar projects for public sector clients
- **Technical Excellence**: Our team holds all required certifications and has deep expertise in this sector
- **Local Presence**: ${tender.region ? `Strong operational presence in ${tender.region}` : 'Nationwide delivery capability'} with a commitment to local employment
- **Value for Money**: Competitive pricing backed by efficient delivery methodology

## Why Choose Us

We offer ${tender.buyerName}:

1. A dedicated project team with relevant qualifications
2. A robust quality management system certified to ISO 9001
3. Clear communication channels and regular progress reporting
4. Flexible, agile approach to meet evolving requirements
5. Strong social value commitments including local hiring and sustainability initiatives

## Commitment

We are fully committed to delivering this contract to the highest standards, on time and within budget. We look forward to the opportunity to demonstrate our capabilities and build a long-term partnership with ${tender.buyerName}.
      `.trim();

      setGeneratedContent(summary);
      setIsGenerating(false);
      return summary;
    },
  });

  // Review bid response action
  useCopilotAction({
    name: 'reviewBidResponse',
    description: 'Provide feedback and improvement suggestions for a bid response',
    parameters: [],
    handler: async () => {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const review = `
# Bid Response Review

## Overall Assessment: 7/10

### Strengths
- Clear executive summary that addresses buyer needs
- Good evidence of relevant experience
- Strong social value section

### Areas for Improvement

#### 1. Technical Approach (Priority: High)
- Add more specific methodology details
- Include risk mitigation strategies
- Reference relevant standards and frameworks

#### 2. Evidence & Proof (Priority: Medium)
- Add quantifiable outcomes from past projects
- Include client testimonials where permitted
- Reference specific certifications

#### 3. Compliance Check (Priority: High)
- Ensure all mandatory questions are answered
- Verify word counts are within limits
- Check all required documents are attached

#### 4. Language & Tone (Priority: Low)
- Reduce jargon where possible
- Use more action-oriented language
- Ensure consistent formatting throughout

## Recommended Actions
1. Strengthen technical methodology section
2. Add 2-3 relevant case studies with measurable outcomes
3. Review against evaluation criteria weightings
4. Proofread for typos and grammatical errors
5. Have a colleague review before submission
      `.trim();

      setGeneratedContent(review);
      setIsGenerating(false);
      return review;
    },
  });

  const modes = [
    {
      id: 'chat',
      icon: ChatBubbleLeftRightIcon,
      title: 'Ask Questions',
      description: 'Chat with AI about this tender',
      color: 'teal',
    },
    {
      id: 'outline',
      icon: ClipboardDocumentListIcon,
      title: 'Generate Outline',
      description: 'Create a bid structure',
      color: 'blue',
    },
    {
      id: 'draft',
      icon: PencilSquareIcon,
      title: 'Draft Content',
      description: 'AI-assisted writing',
      color: 'purple',
    },
    {
      id: 'review',
      icon: CheckBadgeIcon,
      title: 'Review Draft',
      description: 'Get feedback on your bid',
      color: 'amber',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-teal-900/50 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Bid Assistant</h2>
              <p className="text-sm text-slate-300">Powered by RFP.quest</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Tender Context */}
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2 text-sm">
          <DocumentTextIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 truncate">{tender.title}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">{tender.buyerName}</div>
      </div>

      {/* Mode Selection */}
      {!activeMode ? (
        <div className="p-4 grid grid-cols-2 gap-3">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMode(mode.id as 'chat' | 'outline' | 'draft' | 'review')}
              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-left group"
            >
              <mode.icon className={`w-6 h-6 mb-2 text-${mode.color}-400`} />
              <h3 className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">
                {mode.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{mode.description}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="p-4">
          {/* Back button */}
          <button
            onClick={() => {
              setActiveMode(null);
              setGeneratedContent(null);
            }}
            className="mb-4 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back to options
          </button>

          {/* Active Mode Content */}
          {activeMode === 'chat' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-medium text-white">Ask About This Tender</h3>
              </div>
              <div className="space-y-2">
                {[
                  'What are the key requirements?',
                  'Who else might be bidding?',
                  'What makes a winning bid?',
                  'What evidence do I need?',
                ].map((question, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-teal-500/50 transition-all text-left text-sm text-slate-300 hover:text-white flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">
                Click a question or use the chat sidebar for custom questions
              </p>
            </div>
          )}

          {activeMode === 'outline' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardDocumentListIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-white">Bid Response Outline</h3>
              </div>

              {isGenerating ? (
                <div className="text-center py-8">
                  <SparklesIcon className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-400 mt-3">Generating outline...</p>
                </div>
              ) : generatedContent ? (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-auto max-h-64">
                    {generatedContent}
                  </pre>
                  <div className="flex gap-2 mt-4">
                    <button className="text-xs text-teal-400 hover:text-teal-300">Copy to clipboard</button>
                    <button className="text-xs text-slate-400 hover:text-white">Regenerate</button>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsGenerating(true)}
                  className="w-full p-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-5 h-5" />
                  Generate Bid Outline
                </motion.button>
              )}
            </div>
          )}

          {activeMode === 'draft' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <PencilSquareIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-medium text-white">Draft Content</h3>
              </div>

              {isGenerating ? (
                <div className="text-center py-8">
                  <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-400 mt-3">Drafting executive summary...</p>
                </div>
              ) : generatedContent ? (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-auto max-h-64">
                    {generatedContent}
                  </pre>
                  <div className="flex gap-2 mt-4">
                    <button className="text-xs text-teal-400 hover:text-teal-300">Copy to clipboard</button>
                    <button className="text-xs text-slate-400 hover:text-white">Regenerate</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Choose a section to draft:</p>
                  {[
                    { label: 'Executive Summary', desc: 'Overview of your bid' },
                    { label: 'Technical Approach', desc: 'Methodology and delivery' },
                    { label: 'Social Value', desc: 'Community benefits' },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setIsGenerating(true)}
                      className="w-full p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all text-left"
                    >
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMode === 'review' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckBadgeIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-medium text-white">Review Your Bid</h3>
              </div>

              {isGenerating ? (
                <div className="text-center py-8">
                  <DocumentMagnifyingGlassIcon className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-400 mt-3">Analyzing your response...</p>
                </div>
              ) : generatedContent ? (
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-auto max-h-64">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    Upload or paste your draft response for AI-powered feedback and improvement suggestions.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsGenerating(true)}
                    className="w-full p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                  >
                    <LightBulbIcon className="w-5 h-5" />
                    Get Review Feedback
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/30">
        <p className="text-[10px] text-slate-500 text-center">
          AI-generated content should be reviewed and customized before submission
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Floating bid assistant button
 */
export function BidAssistantButton({ tender }: { tender: Tender }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
      >
        <SparklesIcon className="w-5 h-5" />
        AI Bid Assistant
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <BidAssistant tender={tender} onClose={() => setIsOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
