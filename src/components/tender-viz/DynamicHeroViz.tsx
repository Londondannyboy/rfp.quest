'use client';

import { useMemo } from 'react';

interface DynamicHeroVizProps {
  cpvCodes?: string[] | null;
  stage: 'planning' | 'tender' | 'award' | 'contract';
  value?: number | null;
  title: string;
}

// Map CPV divisions to sector themes
const sectorThemes: Record<string, { icon: string; gradient: string[]; pattern: string }> = {
  '45': { icon: '🏗️', gradient: ['#f59e0b', '#d97706'], pattern: 'construction' },
  '48': { icon: '💻', gradient: ['#8b5cf6', '#6366f1'], pattern: 'tech' },
  '50': { icon: '🔧', gradient: ['#6b7280', '#4b5563'], pattern: 'maintenance' },
  '55': { icon: '🏨', gradient: ['#ec4899', '#db2777'], pattern: 'hospitality' },
  '60': { icon: '🚚', gradient: ['#14b8a6', '#0d9488'], pattern: 'transport' },
  '64': { icon: '📡', gradient: ['#3b82f6', '#2563eb'], pattern: 'telecom' },
  '65': { icon: '⚡', gradient: ['#eab308', '#ca8a04'], pattern: 'utilities' },
  '66': { icon: '🏦', gradient: ['#22c55e', '#16a34a'], pattern: 'finance' },
  '70': { icon: '🏢', gradient: ['#a855f7', '#9333ea'], pattern: 'realestate' },
  '71': { icon: '📐', gradient: ['#06b6d4', '#0891b2'], pattern: 'engineering' },
  '72': { icon: '🖥️', gradient: ['#6366f1', '#4f46e5'], pattern: 'it' },
  '73': { icon: '🔬', gradient: ['#10b981', '#059669'], pattern: 'research' },
  '75': { icon: '🏛️', gradient: ['#64748b', '#475569'], pattern: 'government' },
  '77': { icon: '🌾', gradient: ['#84cc16', '#65a30d'], pattern: 'agriculture' },
  '79': { icon: '💼', gradient: ['#f97316', '#ea580c'], pattern: 'business' },
  '80': { icon: '🎓', gradient: ['#0ea5e9', '#0284c7'], pattern: 'education' },
  '85': { icon: '🏥', gradient: ['#ef4444', '#dc2626'], pattern: 'health' },
  '90': { icon: '♻️', gradient: ['#22c55e', '#15803d'], pattern: 'environment' },
  '92': { icon: '🎭', gradient: ['#f472b6', '#ec4899'], pattern: 'culture' },
  '98': { icon: '🤝', gradient: ['#8b5cf6', '#7c3aed'], pattern: 'social' },
};

const defaultTheme = { icon: '📋', gradient: ['#14b8a6', '#0d9488'], pattern: 'default' };

// Keyword patterns to detect sector from title
const keywordSectorMap: { keywords: RegExp; division: string }[] = [
  { keywords: /\b(digital twin|data|analytics|software|IT|tech|cloud|cyber|AI|machine learning)\b/i, division: '72' },
  { keywords: /\b(water|sewage|waste|treatment|utilities|energy|electricity)\b/i, division: '90' },
  { keywords: /\b(construction|building|infrastructure|highways|roads|civil)\b/i, division: '45' },
  { keywords: /\b(health|NHS|hospital|medical|clinical|care)\b/i, division: '85' },
  { keywords: /\b(education|school|university|training|learning)\b/i, division: '80' },
  { keywords: /\b(transport|rail|bus|logistics|fleet)\b/i, division: '60' },
  { keywords: /\b(security|police|defence|military)\b/i, division: '75' },
  { keywords: /\b(finance|banking|insurance|audit)\b/i, division: '66' },
  { keywords: /\b(legal|law|solicitor|barrister)\b/i, division: '79' },
  { keywords: /\b(consulting|advisory|strategy|management)\b/i, division: '79' },
  { keywords: /\b(research|R&D|innovation|laboratory)\b/i, division: '73' },
  { keywords: /\b(architecture|design|engineering|survey)\b/i, division: '71' },
  { keywords: /\b(telecom|network|communications|broadband)\b/i, division: '64' },
  { keywords: /\b(environment|climate|sustainability|recycling)\b/i, division: '90' },
];

function getSectorFromCPV(cpvCodes?: string[] | null, title?: string): typeof defaultTheme {
  // First try CPV codes
  if (cpvCodes && cpvCodes.length > 0) {
    const division = cpvCodes[0].substring(0, 2);
    if (sectorThemes[division]) return sectorThemes[division];
  }

  // Fall back to keyword detection from title
  if (title) {
    for (const { keywords, division } of keywordSectorMap) {
      if (keywords.test(title)) {
        return sectorThemes[division] || defaultTheme;
      }
    }
  }

  return defaultTheme;
}

// Generate abstract pattern based on sector
function SectorPattern({ pattern, gradientId }: { pattern: string; gradientId: string }) {
  switch (pattern) {
    case 'tech':
    case 'it':
      return (
        <g opacity="0.2">
          {/* Circuit board pattern */}
          <path d="M20 40 L60 40 L60 20 L100 20" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <path d="M40 60 L40 100 L80 100" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <circle cx="60" cy="40" r="4" fill={`url(#${gradientId})`} />
          <circle cx="40" cy="60" r="4" fill={`url(#${gradientId})`} />
          <circle cx="100" cy="20" r="4" fill={`url(#${gradientId})`} />
          <rect x="70" y="70" width="30" height="30" rx="2" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
        </g>
      );
    case 'construction':
    case 'engineering':
      return (
        <g opacity="0.2">
          {/* Blueprint pattern */}
          <line x1="10" y1="30" x2="110" y2="30" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="5,3" />
          <line x1="10" y1="60" x2="110" y2="60" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="5,3" />
          <line x1="10" y1="90" x2="110" y2="90" stroke={`url(#${gradientId})`} strokeWidth="1" strokeDasharray="5,3" />
          <rect x="30" y="40" width="60" height="40" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <line x1="50" y1="40" x2="50" y2="80" stroke={`url(#${gradientId})`} strokeWidth="1" />
          <line x1="70" y1="40" x2="70" y2="80" stroke={`url(#${gradientId})`} strokeWidth="1" />
        </g>
      );
    case 'environment':
    case 'utilities':
      return (
        <g opacity="0.2">
          {/* Water/wave pattern */}
          <path d="M10 50 Q30 30 50 50 T90 50 T130 50" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <path d="M10 70 Q30 50 50 70 T90 70 T130 70" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <circle cx="70" cy="35" r="15" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <path d="M65 30 L70 20 L75 30" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
        </g>
      );
    case 'health':
      return (
        <g opacity="0.2">
          {/* Medical cross and pulse */}
          <rect x="55" y="30" width="10" height="40" fill={`url(#${gradientId})`} />
          <rect x="40" y="45" width="40" height="10" fill={`url(#${gradientId})`} />
          <path d="M10 90 L30 90 L40 70 L50 100 L60 80 L70 90 L110 90" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
        </g>
      );
    case 'finance':
      return (
        <g opacity="0.2">
          {/* Chart pattern */}
          <rect x="20" y="60" width="15" height="30" fill={`url(#${gradientId})`} />
          <rect x="45" y="40" width="15" height="50" fill={`url(#${gradientId})`} />
          <rect x="70" y="50" width="15" height="40" fill={`url(#${gradientId})`} />
          <rect x="95" y="25" width="15" height="65" fill={`url(#${gradientId})`} />
          <path d="M20 70 L45 50 L70 60 L95 35" stroke="white" strokeWidth="2" fill="none" />
        </g>
      );
    case 'research':
      return (
        <g opacity="0.2">
          {/* DNA/molecule pattern */}
          <circle cx="40" cy="40" r="8" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <circle cx="80" cy="40" r="8" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <circle cx="60" cy="70" r="8" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <line x1="46" y1="45" x2="54" y2="65" stroke={`url(#${gradientId})`} strokeWidth="2" />
          <line x1="74" y1="45" x2="66" y2="65" stroke={`url(#${gradientId})`} strokeWidth="2" />
          <line x1="48" y1="40" x2="72" y2="40" stroke={`url(#${gradientId})`} strokeWidth="2" />
        </g>
      );
    default:
      return (
        <g opacity="0.15">
          {/* Abstract geometric */}
          <polygon points="60,20 100,50 80,90 40,90 20,50" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
          <circle cx="60" cy="55" r="20" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
        </g>
      );
  }
}

// Value indicator ring
function ValueRing({ value, maxValue = 10000000 }: { value?: number | null; maxValue?: number }) {
  if (!value) return null;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <g transform="translate(60, 60)">
      <circle cx="0" cy="0" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
      <circle
        cx="0"
        cy="0"
        r="40"
        stroke="rgba(20,184,166,0.6)"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90)"
      />
    </g>
  );
}

// Stage indicator dots
function StageIndicator({ stage }: { stage: string }) {
  const stages = ['planning', 'tender', 'award', 'contract'];
  const currentIndex = stages.indexOf(stage);

  return (
    <g transform="translate(20, 100)">
      {stages.map((s, i) => (
        <g key={s} transform={`translate(${i * 25}, 0)`}>
          <circle
            cx="0"
            cy="0"
            r="6"
            fill={i <= currentIndex ? 'rgba(20,184,166,0.8)' : 'rgba(255,255,255,0.2)'}
          />
          {i < stages.length - 1 && (
            <line
              x1="6"
              y1="0"
              x2="19"
              y2="0"
              stroke={i < currentIndex ? 'rgba(20,184,166,0.8)' : 'rgba(255,255,255,0.2)'}
              strokeWidth="2"
            />
          )}
        </g>
      ))}
    </g>
  );
}

export function DynamicHeroViz({ cpvCodes, stage, value, title }: DynamicHeroVizProps) {
  const sector = useMemo(() => getSectorFromCPV(cpvCodes, title), [cpvCodes, title]);
  const gradientId = useMemo(() => `hero-grad-${Math.random().toString(36).slice(2, 11)}`, []);

  // Extract key words for display
  const keywords = useMemo(() => {
    const words = title.split(/\s+/).filter(w => w.length > 4 && !/^(and|the|for|with)$/i.test(w));
    return words.slice(0, 3);
  }, [title]);

  return (
    <div className="relative h-full min-h-[200px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      {/* SVG Background Pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 120 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={sector.gradient[0]} />
            <stop offset="100%" stopColor={sector.gradient[1]} />
          </linearGradient>
          <radialGradient id={`${gradientId}-radial`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={sector.gradient[0]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={sector.gradient[1]} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx="60" cy="60" r="50" fill={`url(#${gradientId}-radial)`} />

        {/* Sector-specific pattern */}
        <SectorPattern pattern={sector.pattern} gradientId={gradientId} />

        {/* Value ring if value exists */}
        <ValueRing value={value} />

        {/* Stage progress indicator */}
        <StageIndicator stage={stage} />
      </svg>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-5xl mb-3" role="img" aria-label={sector.pattern}>
          {sector.icon}
        </div>
        <div className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-1">
          UK Government
        </div>
        <div
          className="text-lg font-bold px-3 py-1 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${sector.gradient[0]}33, ${sector.gradient[1]}33)`,
            color: sector.gradient[0]
          }}
        >
          {stage === 'tender' ? 'Open Tender' : stage.charAt(0).toUpperCase() + stage.slice(1)}
        </div>
        {/* Keywords */}
        <div className="mt-3 flex flex-wrap gap-1 justify-center">
          {keywords.map((word, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/70"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
