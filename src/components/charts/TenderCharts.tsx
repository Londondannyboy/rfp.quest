'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Mini Pie Chart - Shows sector or category breakdown
 */
interface MiniPieChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  showLabels?: boolean;
}

export function MiniPieChart({ segments, size = 80, showLabels = false }: MiniPieChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const center = size / 2;
  const radius = size / 2 - 4;

  let currentAngle = -90; // Start from top

  const paths = segments.map((segment, i) => {
    const percentage = segment.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return (
      <motion.path
        key={i}
        d={d}
        fill={segment.color}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
        className="hover:opacity-80 transition-opacity cursor-pointer"
      />
    );
  });

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths}
        {/* Center hole for donut effect */}
        <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
      </svg>
      {showLabels && (
        <div className="absolute -right-20 top-0 space-y-1">
          {segments.slice(0, 3).map((s, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-gray-600 truncate max-w-[60px]">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Mini Bar Chart - Horizontal bars for comparisons
 */
interface MiniBarChartProps {
  bars: { label: string; value: number; maxValue?: number; color?: string }[];
  height?: number;
}

export function MiniBarChart({ bars, height = 60 }: MiniBarChartProps) {
  const maxValue = Math.max(...bars.map(b => b.maxValue || b.value));

  return (
    <div className="space-y-1" style={{ height }}>
      {bars.map((bar, i) => {
        const percentage = (bar.value / maxValue) * 100;
        const color = bar.color || (percentage >= 70 ? '#14b8a6' : percentage >= 40 ? '#f59e0b' : '#ef4444');

        return (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-gray-500 w-12 truncate">{bar.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[9px] font-medium text-gray-700 w-8 text-right">
              {bar.value}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Timeline Component - Shows key dates and milestones
 */
interface TimelineProps {
  events: { date: string; label: string; isPast?: boolean; isActive?: boolean }[];
  orientation?: 'horizontal' | 'vertical';
}

export function MiniTimeline({ events, orientation = 'horizontal' }: TimelineProps) {
  if (orientation === 'vertical') {
    return (
      <div className="relative pl-4">
        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-blue-400 to-purple-400" />
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pb-3 last:pb-0"
          >
            <div
              className={`absolute -left-3 w-2.5 h-2.5 rounded-full border-2 ${
                event.isActive
                  ? 'bg-teal-500 border-teal-500 ring-2 ring-teal-200'
                  : event.isPast
                  ? 'bg-gray-300 border-gray-300'
                  : 'bg-white border-teal-400'
              }`}
            />
            <div className="ml-2">
              <p className="text-[10px] text-gray-400">{event.date}</p>
              <p className={`text-xs ${event.isActive ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
                {event.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400" />
      <div className="flex justify-between">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex flex-col items-center"
          >
            <div
              className={`w-3 h-3 rounded-full border-2 z-10 ${
                event.isActive
                  ? 'bg-teal-500 border-teal-500 ring-2 ring-teal-200'
                  : event.isPast
                  ? 'bg-gray-300 border-gray-300'
                  : 'bg-white border-blue-400'
              }`}
            />
            <div className="mt-2 text-center">
              <p className="text-[8px] text-gray-400">{event.date}</p>
              <p className={`text-[9px] ${event.isActive ? 'text-teal-600 font-medium' : 'text-gray-500'}`}>
                {event.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Radial Gauge - Animated circular progress indicator
 */
interface RadialGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function RadialGauge({
  value,
  maxValue = 100,
  size = 100,
  thickness = 8,
  label,
  sublabel,
  color,
}: RadialGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gaugeColor = color || (percentage >= 70 ? '#14b8a6' : percentage >= 40 ? '#f59e0b' : '#ef4444');

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={thickness}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={gaugeColor}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color: gaugeColor }}>
          {Math.round(value)}
        </span>
        {label && <span className="text-[9px] text-gray-500">{label}</span>}
        {sublabel && <span className="text-[8px] text-gray-400">{sublabel}</span>}
      </div>
    </div>
  );
}

/**
 * Sparkline - Mini trend line
 */
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
}

export function Sparkline({ data, width = 80, height = 24, color = '#14b8a6', showDots = false }: SparklineProps) {
  const points = useMemo(() => {
    if (data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const xStep = width / (data.length - 1 || 1);

    return data.map((value, i) => {
      const x = i * xStep;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const xStep = width / (data.length - 1 || 1);

    const pointsArr = data.map((value, i) => {
      const x = i * xStep;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    return `M 0,${height} L ${pointsArr.map(p => `${p.x},${p.y}`).join(' L ')} L ${width},${height} Z`;
  }, [data, width, height]);

  if (data.length === 0) return null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill={`${color}20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      {/* End dot */}
      {showDots && data.length > 0 && (
        <motion.circle
          cx={width}
          cy={height - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * (height - 4) - 2}
          r={3}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.2 }}
        />
      )}
    </svg>
  );
}

/**
 * Activity Ring - Shows multiple metrics in concentric rings
 */
interface ActivityRingProps {
  rings: { value: number; maxValue: number; color: string; label: string }[];
  size?: number;
}

export function ActivityRing({ rings, size = 80 }: ActivityRingProps) {
  const center = size / 2;
  const gap = 6;
  const baseThickness = 6;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {rings.map((ring, i) => {
          const radius = center - (i * (baseThickness + gap)) - baseThickness / 2 - 4;
          const circumference = 2 * Math.PI * radius;
          const percentage = Math.min((ring.value / ring.maxValue) * 100, 100);
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <g key={i}>
              {/* Background */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#e5e7eb"
                strokeWidth={baseThickness}
                fill="none"
              />
              {/* Progress */}
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                stroke={ring.color}
                strokeWidth={baseThickness}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
              />
            </g>
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg font-bold text-gray-800">{rings[0]?.value || 0}</span>
          <span className="text-[8px] text-gray-500 block">{rings[0]?.label}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Competition Meter - Visual representation of competition level
 */
interface CompetitionMeterProps {
  level: 'low' | 'medium' | 'high';
  count?: number;
}

export function CompetitionMeter({ level, count }: CompetitionMeterProps) {
  const levels = { low: 1, medium: 2, high: 3 };
  const colors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
  const labels = { low: 'Low Competition', medium: 'Moderate', high: 'High Competition' };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 rounded-sm"
            style={{
              height: 8 + i * 4,
              backgroundColor: i <= levels[level] ? colors[level] : '#e5e7eb',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
      <div className="text-[10px]">
        <span className="font-medium" style={{ color: colors[level] }}>{labels[level]}</span>
        {count !== undefined && <span className="text-gray-400 ml-1">({count} bidders)</span>}
      </div>
    </div>
  );
}

/**
 * Value Comparison Chart - Shows tender value vs market average
 */
interface ValueComparisonProps {
  value: number;
  avgValue: number;
  minValue?: number;
  maxValue?: number;
}

export function ValueComparison({ value, avgValue, minValue, maxValue }: ValueComparisonProps) {
  const formatValue = (v: number) => {
    if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `£${(v / 1_000).toFixed(0)}k`;
    return `£${v}`;
  };

  const range = (maxValue || value * 1.5) - (minValue || 0);
  const valuePosition = ((value - (minValue || 0)) / range) * 100;
  const avgPosition = ((avgValue - (minValue || 0)) / range) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] text-gray-400">
        <span>{formatValue(minValue || 0)}</span>
        <span>{formatValue(maxValue || value * 1.5)}</span>
      </div>
      <div className="relative h-3 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-full">
        {/* Average marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
          style={{ left: `${avgPosition}%` }}
        />
        {/* Value marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full border-2 border-white shadow-sm"
          style={{ left: `${valuePosition}%` }}
          initial={{ scale: 0, left: '0%' }}
          animate={{ scale: 1, left: `${valuePosition}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-[9px]">
        <span className="text-teal-600 font-medium">{formatValue(value)}</span>
        <span className="text-gray-400">Avg: {formatValue(avgValue)}</span>
      </div>
    </div>
  );
}
