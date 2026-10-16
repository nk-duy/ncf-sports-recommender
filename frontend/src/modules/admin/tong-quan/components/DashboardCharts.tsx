'use client';
import React from 'react';
import { Package } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6'];

interface DashboardChartsProps {
  revenueData: any[];
  categoryData: any[];
  chartViewMode: 'revenue' | 'orders';
  setChartViewMode: (mode: 'revenue' | 'orders') => void;
  formatPrice: (price: number) => string;
}

export default function DashboardCharts({
  revenueData,
  categoryData,
  chartViewMode,
  setChartViewMode,
  formatPrice,
}: DashboardChartsProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
          <p className="font-bold text-gray-800 mb-2">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 font-medium" style={{ color: entry.color || entry.payload.fill }}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill }}></span>
              {entry.name === 'Doanh thu' ? formatPrice(entry.value) : `${entry.name}: ${entry.value}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Revenue Chart (Span 7) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Biểu đồ Doanh thu &amp; Sản lượng (7 Tháng)</h2>
            <p className="text-xs text-gray-500 mt-0.5">Biến động kinh doanh qua từng tháng gần nhất</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setChartViewMode('revenue')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'revenue' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doanh thu
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('orders')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'orders' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
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
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val / 1000000}tr`} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            ) : (
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" name="Số đơn hàng" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart (Span 5) */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-2xs border border-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Tỷ trọng Danh mục Bán ra</h2>
          <p className="text-xs text-gray-500 mt-0.5">Số lượng sản phẩm bán theo bộ môn thể thao</p>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 font-medium flex flex-col items-center">
              <Package size={42} className="mb-2 opacity-25" />
              <span>Chưa có dữ liệu bán hàng trong kỳ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
