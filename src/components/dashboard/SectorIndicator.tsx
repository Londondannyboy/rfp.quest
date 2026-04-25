'use client';

import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  HeartIcon,
  AcademicCapIcon,
  TruckIcon,
  GlobeAltIcon,
  BeakerIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  HomeIcon,
  SparklesIcon,
  PaintBrushIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

// CPV Division code to sector mapping
export const SECTOR_INFO: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  '45': { label: 'Construction', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: BuildingOfficeIcon },
  '48': { label: 'Software', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ComputerDesktopIcon },
  '50': { label: 'Maintenance', color: 'bg-slate-900/40 backdrop-blur-xl text-slate-200 border-slate-700/50', icon: WrenchScrewdriverIcon },
  '55': { label: 'Hospitality', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: HomeIcon },
  '60': { label: 'Transport', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: TruckIcon },
  '64': { label: 'Telecom', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: GlobeAltIcon },
  '65': { label: 'Utilities', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: LightBulbIcon },
  '66': { label: 'Finance', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: BuildingLibraryIcon },
  '70': { label: 'Real Estate', color: 'bg-stone-100 text-stone-700 border-stone-200', icon: HomeIcon },
  '71': { label: 'Engineering', color: 'bg-slate-800/60 text-slate-700 border-slate-200', icon: BeakerIcon },
  '72': { label: 'IT Services', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: ComputerDesktopIcon },
  '73': { label: 'R&D', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: BeakerIcon },
  '75': { label: 'Government', color: 'bg-red-100 text-red-700 border-red-200', icon: BuildingLibraryIcon },
  '77': { label: 'Agriculture', color: 'bg-lime-100 text-lime-700 border-lime-200', icon: SparklesIcon },
  '79': { label: 'Business', color: 'bg-blue-900/30 text-blue-400 border-blue-700/50', icon: BriefcaseIcon },
  '80': { label: 'Education', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AcademicCapIcon },
  '85': { label: 'Healthcare', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: HeartIcon },
  '90': { label: 'Environment', color: 'bg-blue-100 text-green-400 border-blue-200', icon: SparklesIcon },
  '92': { label: 'Culture', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', icon: PaintBrushIcon },
  '98': { label: 'Other', color: 'bg-slate-900/40 backdrop-blur-xl text-slate-200 border-slate-700/50', icon: BriefcaseIcon },
};

interface SectorIndicatorProps {
  cpvCodes: string[];
  onClick?: (division: string) => void;
  interactive?: boolean;
  showIcon?: boolean;
  iconOnly?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * Displays the primary sector for a tender based on CPV codes.
 * Optionally clickable to filter by sector.
 */
export function SectorIndicator({
  cpvCodes,
  onClick,
  interactive = true,
  showIcon = true,
  iconOnly = false,
  size = 'md',
}: SectorIndicatorProps) {
  // Get the first CPV code's division (first 2 digits)
  const primaryCpv = cpvCodes?.[0];
  const division = primaryCpv?.substring(0, 2) || '';
  const sectorInfo = SECTOR_INFO[division] || {
    label: division ? `CPV ${division}` : 'Unknown',
    color: 'bg-slate-900/40 backdrop-blur-xl text-slate-200 border-slate-700/50',
    icon: BriefcaseIcon,
  };

  const Icon = sectorInfo.icon;
  const isClickable = interactive && onClick;

  const sizeClasses = {
    xs: iconOnly ? 'p-1' : 'px-1.5 py-0.5 text-[10px] gap-0.5',
    sm: iconOnly ? 'p-1.5' : 'px-2 py-0.5 text-xs gap-1',
    md: iconOnly ? 'p-2' : 'px-2.5 py-1 text-sm gap-1.5',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <motion.button
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      onClick={() => isClickable && onClick(division)}
      disabled={!isClickable}
      className={`
        inline-flex items-center rounded-full border font-medium
        transition-all
        ${sectorInfo.color}
        ${sizeClasses[size]}
        ${isClickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}
      `}
      title={sectorInfo.label}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {!iconOnly && <span>{sectorInfo.label}</span>}
    </motion.button>
  );
}

/**
 * Displays multiple sector badges for tenders with multiple CPV codes.
 */
export function SectorBadges({
  cpvCodes,
  onClick,
  maxDisplay = 2,
}: {
  cpvCodes: string[];
  onClick?: (division: string) => void;
  maxDisplay?: number;
}) {
  // Get unique divisions
  const divisions = [...new Set(cpvCodes.map((code) => code.substring(0, 2)))];
  const displayDivisions = divisions.slice(0, maxDisplay);
  const remainingCount = divisions.length - maxDisplay;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {displayDivisions.map((division) => {
        const sectorInfo = SECTOR_INFO[division] || {
          label: `CPV ${division}`,
          color: 'bg-slate-900/40 backdrop-blur-xl text-slate-200 border-slate-700/50',
          icon: BriefcaseIcon,
        };
        const Icon = sectorInfo.icon;

        return (
          <button
            key={division}
            onClick={() => onClick?.(division)}
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium
              transition-all hover:shadow-sm
              ${sectorInfo.color}
              ${onClick ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            <Icon className="w-3 h-3" />
            <span>{sectorInfo.label}</span>
          </button>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs text-slate-400">+{remainingCount}</span>
      )}
    </div>
  );
}
