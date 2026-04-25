'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AIResponseGeneratorProps {
  onClose: () => void;
  onGenerate: (content: string) => void;
  requirement?: any;
  companyProfile?: any;
}

type ToneOption = 'professional' | 'conversational' | 'technical' | 'persuasive';
type LengthOption = 'brief' | 'standard' | 'detailed';

export function AIResponseGenerator({
  onClose,
  onGenerate,
  requirement,
  companyProfile,
}: AIResponseGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [tone, setTone] = useState<ToneOption>('professional');
  const [length, setLength] = useState<LengthOption>('standard');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeCaseStudy, setIncludeCaseStudy] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      // Build the prompt
      const prompt = buildPrompt();
      
      // Call AI API (this would be your actual API call)
      const response = await generateAIResponse(prompt);
      
      setGeneratedContent(response);
    } catch (err) {
      setError('Failed to generate response. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const buildPrompt = () => {
    const parts = [];
    
    // Add requirement context
    if (requirement) {
      parts.push(`Requirement: ${requirement.title || 'Section requirement'}`);
      parts.push(`Description: ${requirement.description || ''}`);
    }
    
    // Add company context
    if (companyProfile) {
      parts.push(`Company: ${companyProfile.name}`);
      parts.push(`Industry: ${companyProfile.industry}`);
      parts.push(`Strengths: ${companyProfile.strengths?.join(', ') || 'N/A'}`);
    }
    
    // Add style preferences
    parts.push(`Tone: ${tone}`);
    parts.push(`Length: ${length === 'brief' ? '100-150 words' : length === 'detailed' ? '300-400 words' : '200-250 words'}`);
    
    if (includeStats) {
      parts.push('Include relevant statistics and metrics');
    }
    
    if (includeCaseStudy) {
      parts.push('Include a brief case study or example');
    }
    
    if (customInstructions) {
      parts.push(`Additional instructions: ${customInstructions}`);
    }
    
    return parts.join('\n');
  };

  const generateAIResponse = async (prompt: string): Promise<string> => {
    // This would be your actual API call to OpenAI/Claude/etc
    // For now, returning a placeholder response
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    return `Based on our extensive experience in ${companyProfile?.industry || 'the industry'}, we are uniquely positioned to deliver exceptional value for this requirement.

Our approach combines proven methodologies with innovative solutions tailored to your specific needs. We have successfully delivered similar projects for numerous clients, achieving an average improvement of 35% in operational efficiency.

Key differentiators of our solution include:
• Industry-leading expertise with ${companyProfile?.years_experience || '10+'} years of experience
• Proven track record of on-time, on-budget delivery
• Dedicated team of certified professionals
• Comprehensive quality assurance processes
• 24/7 support and maintenance capabilities

${includeCaseStudy ? `\nFor example, in a recent engagement with a similar organization, we implemented our solution resulting in a 40% reduction in processing time and £250,000 in annual cost savings. This demonstrates our ability to deliver tangible, measurable results.\n` : ''}

We are committed to exceeding your expectations and building a long-term partnership that drives continuous improvement and innovation.`;
  };

  const handleInsert = () => {
    if (generatedContent) {
      onGenerate(generatedContent);
    }
  };

  const toneOptions: { value: ToneOption; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
    { value: 'technical', label: 'Technical', description: 'Detailed and specification-focused' },
    { value: 'persuasive', label: 'Persuasive', description: 'Compelling and benefit-driven' },
  ];

  const lengthOptions: { value: LengthOption; label: string; words: string }[] = [
    { value: 'brief', label: 'Brief', words: '100-150 words' },
    { value: 'standard', label: 'Standard', words: '200-250 words' },
    { value: 'detailed', label: 'Detailed', words: '300-400 words' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-[540px] bg-slate-900/60 backdrop-blur-xl border-slate-700/50 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-slate-100">AI Response Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-900/60 backdrop-blur-xl border-slate-700/50/50 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {requirement && (
          <div className="mt-3 p-3 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-purple-200">
            <p className="text-sm font-medium text-slate-200">
              Generating response for: {requirement.title}
            </p>
          </div>
        )}
      </div>
      
      {/* Settings */}
      <div className="p-6 border-b border-slate-700/50">
        <h4 className="font-medium text-slate-100 mb-4 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          Generation Settings
        </h4>
        
        {/* Tone Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-200 mb-2 block">Tone</label>
          <div className="grid grid-cols-2 gap-2">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTone(option.value)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  tone === option.value
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-slate-500">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Length Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-200 mb-2 block">Length</label>
          <div className="flex gap-2">
            {lengthOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLength(option.value)}
                className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                  length === option.value
                    ? 'border-purple-400 bg-purple-50 text-purple-700'
                    : 'border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-slate-500">{option.words}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Additional Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeStats}
              onChange={(e) => setIncludeStats(e.target.checked)}
              className="rounded border-slate-600/50 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-slate-200">Include statistics and metrics</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCaseStudy}
              onChange={(e) => setIncludeCaseStudy(e.target.checked)}
              className="rounded border-slate-600/50 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-slate-200">Include case study example</span>
          </label>
        </div>
        
        {/* Custom Instructions */}
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-200 mb-1 block">
            Custom Instructions (optional)
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Add any specific requirements or focus areas..."
            className="w-full px-3 py-2 rounded-lg border-slate-700/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
            rows={2}
          />
        </div>
      </div>
      
      {/* Generated Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}
        
        {generatedContent ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-100">Generated Response</h4>
              <button
                onClick={handleGenerate}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Regenerate
              </button>
            </div>
            <div className="p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg border-slate-700/50">
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {generatedContent}
              </p>
            </div>
            <div className="text-sm text-slate-500">
              Word count: {generatedContent.split(/\s+/).filter(Boolean).length}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <LightBulbIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-medium text-slate-100 mb-2">Ready to Generate</h4>
            <p className="text-sm text-slate-500 max-w-xs">
              Configure your preferences above and click generate to create an AI-powered response
            </p>
          </div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-slate-700/50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="flex items-center gap-3">
          {!generatedContent ? (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Generate Response
                </span>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleInsert}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <CheckIcon className="w-4 h-4 inline mr-1" />
                Insert Response
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-700/70 transition-colors font-medium"
              >
                Regenerate
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-700/70 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}