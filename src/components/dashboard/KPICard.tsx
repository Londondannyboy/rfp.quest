'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import type { ComponentType } from 'react';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ComponentType<{ className?: string }>;
  color?: 'teal' | 'blue' | 'purple' | 'amber' | 'green';
  delay?: number;
  formatLarge?: boolean;
  onClick?: () => void;
  clickHint?: string;
}

const colorClasses = {
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-100 text-teal-600',
    text: 'text-teal-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    text: 'text-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    text: 'text-green-600',
  },
};

export function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  color = 'teal',
  delay = 0,
  formatLarge = false,
  onClick,
  clickHint,
}: KPICardProps) {
  const colors = colorClasses[color];
  const isClickable = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: isClickable ? 1.03 : 1.02, transition: { duration: 0.2 } }}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${
        isClickable ? 'cursor-pointer hover:shadow-md hover:border-gray-200' : 'cursor-default'
      }`}
      title={clickHint}
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-lg ${colors.icon}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-3xl font-bold ${colors.text}`}>
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            formatLarge={formatLarge}
          />
        </p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </motion.div>
  );
}
