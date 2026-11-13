'use client';

import { Package } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CategorySharePoint, ChartViewMode, RevenueMonthPoint } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

interface ChartTooltipEntry {
  name?: string;
  value?: number;
  color?: string;
  payload?: {
    fill?: string;
  };
}

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string;
  formatPrice: (price: number) => string;
}

function CustomChartTooltip({ active, payload, label, formatPrice }: CustomChartTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm font-sans">
        <p className="font-bold text-slate-800 mb-2">{label || payload[0].name}</p>
        {payload.map((entry, index) => {
          const itemColor = entry.color || entry.payload?.fill || '#3b82f6';
          return (
            <div
              key={`${entry.name ?? 'item'}-${index}`}
              className="flex items-center gap-2 font-medium tabular-nums"
              style={{ color: itemColor }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: itemColor }} />
              {entry.name === 'Doanh thu'
                ? formatPrice(entry.value ?? 0)
                : `${entry.name}: ${entry.value ?? 0}`}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

interface DashboardChartsProps {
  revenueData: RevenueMonthPoint[];
  categoryData: CategorySharePoint[];
  chartViewMode: ChartViewMode;
  setChartViewMode: (mode: ChartViewMode) => void;
  formatPrice: (price: number) => string;
}

export default function DashboardCharts({
  revenueData,
  categoryData,
  chartViewMode,
  setChartViewMode,
  formatPrice,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Revenue Chart (Span 7) */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Biểu đồ Doanh thu &amp; Sản lượng (7 Tháng)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Biến động kinh doanh qua từng tháng gần nhất
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setChartViewMode('revenue')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'revenue'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doanh thu
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('orders')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'orders'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Số đơn
            </button>
          </div>
        </div>

        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'revenue' ? (
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  domain={[0, (dataMax: number) => Math.max(Number(dataMax) || 0, 5000000)]}
                  tickFormatter={(val: number) => {
                    const num = Number(val) || 0;
                    if (num <= 0) return '0 đ';
                    if (num >= 1000000000) {
                      const billions = num / 1000000000;
                      return `${Number.isInteger(billions) ? billions : billions.toFixed(1)} tỷ`;
                    }
                    if (num >= 1000000) {
                      const millions = num / 1000000;
                      return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} tr`;
                    }
                    if (num >= 1000) {
                      return `${Math.round(num / 1000)} k`;
                    }
                    return `${num}`;
                  }}
                  width={72}
                />
                <Tooltip content={<CustomChartTooltip formatPrice={formatPrice} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            ) : (
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={40}
                />
                <Tooltip content={<CustomChartTooltip formatPrice={formatPrice} />} />
                <Bar dataKey="orders" name="Số đơn hàng" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart (Span 5) */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Tỷ trọng Danh mục Bán ra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Số lượng sản phẩm bán theo bộ môn thể thao
          </p>
        </div>

        <div className="h-[290px] w-full flex items-center justify-center">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="48%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip formatPrice={formatPrice} />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 font-medium flex flex-col items-center">
              <Package size={42} className="mb-2 opacity-25" />
              <span>Chưa có dữ liệu bán hàng trong kỳ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
