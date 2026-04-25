'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface RegionData {
  region: string;
  count: number;
  percentage: number;
}

interface RegionalBarChartProps {
  data: RegionData[];
  loading?: boolean;
}

const COLORS = {
  'England': '#14b8a6',
  'Scotland': '#0ea5e9',
  'Wales': '#ef4444',
  'Northern Ireland': '#22c55e',
  'UK-wide': '#8b5cf6',
};

export function RegionalBarChart({ data, loading }: RegionalBarChartProps) {
  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl p-6 shadow-sm border-slate-700/40 h-80 flex items-center justify-center">
        <div className="w-full space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 h-4 bg-slate-800/60 rounded animate-pulse" />
              <div
                className="h-6 bg-slate-800/60 rounded animate-pulse"
                style={{ width: `${60 - i * 10}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl p-6 shadow-sm border-slate-700/40 h-80 flex items-center justify-center">
        <p className="text-slate-500">No regional data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl p-6 shadow-sm border-slate-700/40"
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Regional Distribution
      </h3>
      <div className="h-72" style={{ minWidth: 300, minHeight: 288 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              type="category"
              dataKey="region"
              tick={{ fontSize: 12, fill: '#374151' }}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RegionData;
                  return (
                    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 px-3 py-2 shadow-lg rounded-lg border-slate-700/40">
                      <p className="font-medium text-slate-100">{item.region}</p>
                      <p className="text-sm text-slate-500">
                        {item.count.toLocaleString()} tenders ({item.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.region as keyof typeof COLORS] || '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
