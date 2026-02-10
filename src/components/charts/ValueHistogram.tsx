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

interface ValueData {
  bucket: string;
  count: number;
  min: number;
  max: number;
}

interface ValueHistogramProps {
  data: ValueData[];
  loading?: boolean;
  onValueClick?: (minValue: number, maxValue: number, label: string) => void;
}

const COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'];

export function ValueHistogram({ data, loading, onValueClick }: ValueHistogramProps) {
  const handleBarClick = (entry: ValueData) => {
    if (onValueClick) {
      onValueClick(entry.min, entry.max, entry.bucket);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 flex items-center justify-center">
        <div className="flex items-end gap-2">
          {[40, 60, 80, 50, 70].map((h, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-t"
              style={{ width: 40, height: h }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-80 flex items-center justify-center">
        <p className="text-gray-500">No value data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contract Value Distribution
      </h3>
      <div className="h-72" style={{ minWidth: 300, minHeight: 288 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ValueData;
                  return (
                    <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
                      <p className="font-medium text-gray-900">{item.bucket}</p>
                      <p className="text-sm text-gray-500">
                        {item.count.toLocaleString()} tenders
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              onClick={(data) => handleBarClick(data as unknown as ValueData)}
              style={{ cursor: onValueClick ? 'pointer' : 'default' }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: onValueClick ? 'pointer' : 'default' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
