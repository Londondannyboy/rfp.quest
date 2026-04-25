'use client';

import { useState } from 'react';
import {
  Squares2X2Icon,
  TableCellsIcon,
  ShareIcon,
  ChartBarIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export type DashboardView = 'cards' | 'table' | 'graph' | 'analytics';

interface ViewOption {
  id: DashboardView;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  features: string[];
}

interface DashboardViewToggleProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  showFeatures?: boolean;
  compactMode?: boolean;
}

export function DashboardViewToggle({
  currentView,
  onViewChange,
  showFeatures = false,
  compactMode = false,
}: DashboardViewToggleProps) {
  const [hoveredView, setHoveredView] = useState<DashboardView | null>(null);

  const viewOptions: ViewOption[] = [
    {
      id: 'cards',
      label: 'Card View',
      description: 'Visual overview with match scores and quick actions',
      icon: Squares2X2Icon,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Visual tender cards',
        'Match score gauges',
        'Quick actions',
        'Expandable details',
        'Deadline indicators',
      ],
    },
    {
      id: 'table',
      label: 'Table View',
      description: 'Spreadsheet-style data manipulation and bulk actions',
      icon: TableCellsIcon,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Inline editing',
        'Bulk selection',
        'Advanced filtering',
        'CSV export',
        'Custom columns',
      ],
    },
    {
      id: 'graph',
      label: 'Network Graph',
      description: 'Interactive visualization of relationships and connections',
      icon: ShareIcon,
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Force-directed layout',
        'Competitor mapping',
        'Buyer networks',
        'Sector clustering',
        'Interactive exploration',
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Deep insights and trend analysis',
      icon: ChartBarIcon,
      gradient: 'from-orange-500 to-orange-600',
      features: [
        'Win probability',
        'Market analysis',
        'Trend forecasting',
        'Performance metrics',
        'AI recommendations',
      ],
    },
  ];

  if (compactMode) {
    return (
      <div className="inline-flex rounded-lg bg-slate-900/40 backdrop-blur-xl p-1 gap-1">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onViewChange(option.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
              ${currentView === option.id
                ? `bg-gradient-to-r ${option.gradient} text-white shadow-sm`
                : 'text-slate-200 hover:text-slate-100 hover:bg-slate-900/60 backdrop-blur-xl border-slate-700/50'
              }
            `}
            title={option.description}
          >
            <option.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <EyeIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Dashboard Views</h3>
          <p className="text-slate-300 text-sm">Choose how you want to analyze your opportunities</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {viewOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setHoveredView(option.id)}
            onHoverEnd={() => setHoveredView(null)}
            onClick={() => onViewChange(option.id)}
            className={`
              relative cursor-pointer rounded-xl border-2 transition-all duration-200
              ${currentView === option.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-700/50 hover:border-slate-600/50 hover:shadow-md'
              }
            `}
          >
            <div className="p-6">
              {/* Icon and Selection Indicator */}
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${currentView === option.id
                    ? `bg-gradient-to-r ${option.gradient} shadow-lg`
                    : 'bg-slate-900/40 backdrop-blur-xl'
                  }
                `}>
                  <option.icon className={`w-6 h-6 ${
                    currentView === option.id ? 'text-white' : 'text-slate-300'
                  }`} />
                </div>
                
                {currentView === option.id && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-900/60 backdrop-blur-xl border-slate-700/50"></div>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div>
                <h4 className={`font-semibold mb-2 ${
                  currentView === option.id ? 'text-blue-900' : 'text-slate-100'
                }`}>
                  {option.label}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  currentView === option.id ? 'text-blue-700' : 'text-slate-300'
                }`}>
                  {option.description}
                </p>
              </div>
              
              {/* Features (when expanded) */}
              {showFeatures && (hoveredView === option.id || currentView === option.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700/50"
                >
                  <ul className="space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="text-xs text-slate-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800/70"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
            
            {/* Animated border on hover */}
            {hoveredView === option.id && currentView !== option.id && (
              <motion.div
                layoutId="hoverBorder"
                className="absolute inset-0 rounded-xl border-2 border-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* View Benefits */}
      {currentView && (
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-slate-700/50"
        >
          <div className="flex items-start gap-3">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-slate-100 mb-1">
                Perfect for: {viewOptions.find(v => v.id === currentView)?.label}
              </h5>
              <div className="flex flex-wrap gap-2">
                {viewOptions.find(v => v.id === currentView)?.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}