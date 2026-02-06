'use client';

import { useMemo, useState } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import {
  DocumentTextIcon,
  ChevronRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  LightBulbIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

interface ScopeOfWorkProps {
  description: string | null;
  title: string;
}

interface ParsedSection {
  type: 'phase' | 'requirements' | 'responsibilities' | 'deliverables' | 'general';
  title?: string;
  content: string[];
  phaseNumber?: number;
}

// Parse description into structured sections
function parseDescription(description: string): ParsedSection[] {
  if (!description) return [];

  const sections: ParsedSection[] = [];
  const lines = description.split(/\n+/).filter(line => line.trim());

  let currentSection: ParsedSection = { type: 'general', content: [] };

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect phase headers
    const phaseMatch = trimmed.match(/^(?:Phase|Stage)\s*(\d+)[:\s-]*(.*)$/i);
    if (phaseMatch) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        type: 'phase',
        phaseNumber: parseInt(phaseMatch[1]),
        title: phaseMatch[2] || `Phase ${phaseMatch[1]}`,
        content: [],
      };
      continue;
    }

    // Detect requirements section
    if (/^(?:requirements?|must have|essential|mandatory)[:\s]*$/i.test(trimmed)) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { type: 'requirements', title: 'Requirements', content: [] };
      continue;
    }

    // Detect responsibilities section
    if (/^(?:responsibilities|scope|deliverables|partner will|the contractor)[:\s]*$/i.test(trimmed)) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { type: 'responsibilities', title: 'Responsibilities', content: [] };
      continue;
    }

    // Detect bullet points
    const bulletMatch = trimmed.match(/^[-•*]\s*(.+)$/);
    if (bulletMatch) {
      currentSection.content.push(bulletMatch[1]);
      continue;
    }

    // Detect numbered items
    const numberedMatch = trimmed.match(/^\d+[.)]\s*(.+)$/);
    if (numberedMatch) {
      currentSection.content.push(numberedMatch[1]);
      continue;
    }

    // Regular paragraph
    if (trimmed.length > 0) {
      currentSection.content.push(trimmed);
    }
  }

  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

// Extract key capabilities/skills mentioned
function extractCapabilities(description: string): string[] {
  const capabilities: string[] = [];
  const patterns = [
    /expertise in ([^,.]+)/gi,
    /experience (?:with|in) ([^,.]+)/gi,
    /knowledge of ([^,.]+)/gi,
    /skilled in ([^,.]+)/gi,
    /proficient in ([^,.]+)/gi,
    /capability in ([^,.]+)/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(description)) !== null) {
      const cap = match[1].trim();
      if (cap.length > 3 && cap.length < 50 && !capabilities.includes(cap)) {
        capabilities.push(cap);
      }
    }
  }

  // Also extract common tech/domain keywords
  const keywords = description.match(/\b(digital twin|AI|machine learning|cloud|data|modeling|analytics|automation|IoT|security|compliance|governance|integration|API|platform)\b/gi);
  if (keywords) {
    keywords.forEach(k => {
      const normalized = k.toLowerCase();
      if (!capabilities.some(c => c.toLowerCase().includes(normalized))) {
        capabilities.push(k);
      }
    });
  }

  return capabilities.slice(0, 8);
}

// Phase visualization card
function PhaseCard({ phase }: { phase: ParsedSection }) {
  const [expanded, setExpanded] = useState(false);

  const phaseColors = [
    { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  ];
  const colorIdx = ((phase.phaseNumber || 1) - 1) % phaseColors.length;
  const color = phaseColors[colorIdx];

  return (
    <div
      className={`bg-gradient-to-r ${color.bg} rounded-xl border ${color.border} overflow-hidden transition-all`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${color.text} font-bold text-lg`}>
          {phase.phaseNumber || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${color.text}`}>Phase {phase.phaseNumber}</h3>
          <p className="text-sm text-slate-300 truncate">{phase.title}</p>
        </div>
        <ChevronRightIcon className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50">
          <ul className="mt-3 space-y-2">
            {phase.content.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircleIcon className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Requirements chips
function RequirementChips({ requirements }: { requirements: string[] }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardDocumentListIcon className="w-5 h-5 text-amber-400" />
        <h3 className="font-semibold text-white">Key Requirements</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {requirements.map((req, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200"
          >
            {req.length > 60 ? req.substring(0, 60) + '...' : req}
          </span>
        ))}
      </div>
    </div>
  );
}

// Capabilities badges
function CapabilityBadges({ capabilities }: { capabilities: string[] }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-3">
        <LightBulbIcon className="w-5 h-5 text-teal-400" />
        <h3 className="font-semibold text-white">Required Capabilities</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {capabilities.map((cap, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-sm text-teal-200"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}

// AI Summary section (triggered by CopilotKit)
function AISummary({ summary }: { summary: string | null }) {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-purple-300">AI Analysis</h3>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
    </div>
  );
}

// General text section
function TextSection({ section }: { section: ParsedSection }) {
  const icons: Record<string, typeof DocumentTextIcon> = {
    responsibilities: UserGroupIcon,
    requirements: ClipboardDocumentListIcon,
    deliverables: CubeTransparentIcon,
    general: DocumentTextIcon,
  };
  const Icon = icons[section.type] || DocumentTextIcon;

  const colors: Record<string, string> = {
    responsibilities: 'text-cyan-400',
    requirements: 'text-amber-400',
    deliverables: 'text-emerald-400',
    general: 'text-slate-400',
  };

  return (
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
      {section.title && (
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${colors[section.type]}`} />
          <h3 className="font-semibold text-white">{section.title}</h3>
        </div>
      )}
      {section.content.length > 0 && (
        section.content.length === 1 && section.content[0].length > 100 ? (
          <p className="text-sm text-slate-300 leading-relaxed">{section.content[0]}</p>
        ) : (
          <ul className="space-y-2">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-slate-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export function ScopeOfWork({ description, title }: ScopeOfWorkProps) {
  const [aiSummary] = useState<string | null>(null);

  const parsed = useMemo(() => parseDescription(description || ''), [description]);
  const capabilities = useMemo(() => extractCapabilities(description || ''), [description]);

  const phases = parsed.filter(s => s.type === 'phase');
  const requirements = parsed.filter(s => s.type === 'requirements').flatMap(s => s.content);
  const other = parsed.filter(s => s.type !== 'phase' && s.type !== 'requirements');

  // Make scope available to CopilotKit
  useCopilotReadable({
    description: 'The parsed scope of work for this tender',
    value: {
      phases: phases.map(p => ({ number: p.phaseNumber, title: p.title, items: p.content })),
      requirements,
      capabilities,
      fullText: description,
    },
  });

  // CopilotKit action to analyze the scope
  useCopilotAction({
    name: 'analyzeScopeOfWork',
    description: 'Analyze the scope of work and provide a concise summary of key points, risks, and opportunities',
    parameters: [],
    handler: async () => {
      // The analysis will come from the AI through the chat
      return 'Analysis complete. See the AI response for key points, risks, and opportunities.';
    },
  });

  if (!description) {
    return (
      <div className="bg-slate-900 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DocumentTextIcon className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-white">Scope of Work</h2>
        </div>
        <p className="text-slate-400 text-sm">No detailed scope available for this tender.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-semibold text-white">
            <strong>{title}</strong> - Scope of Work
          </h2>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {phases.length} phases • {requirements.length} requirements • {capabilities.length} capabilities
        </span>
      </div>

      <div className="space-y-4">
        {/* Phases visualization */}
        {phases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Project Phases</h3>
            <div className="grid gap-3">
              {phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} />
              ))}
            </div>
          </div>
        )}

        {/* Capabilities */}
        {capabilities.length > 0 && <CapabilityBadges capabilities={capabilities} />}

        {/* Requirements */}
        {requirements.length > 0 && <RequirementChips requirements={requirements} />}

        {/* Other sections */}
        {other.length > 0 && (
          <div className="space-y-3">
            {other.map((section, i) => (
              <TextSection key={i} section={section} />
            ))}
          </div>
        )}

        {/* AI Summary */}
        <AISummary summary={aiSummary} />

        {/* Ask AI button */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            Ask the AI assistant for deeper analysis of this scope
          </p>
        </div>
      </div>
    </div>
  );
}
