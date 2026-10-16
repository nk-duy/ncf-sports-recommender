'use client';
import React from 'react';
import { Calendar, Download } from 'lucide-react';

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  onExportReport: () => void;
}

export default function DashboardHeader({
  dateRange,
  setDateRange,
  onExportReport,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi hoạt động kinh doanh, vận hành kho và chỉ số AI Recommender
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar size={16} className="text-gray-400" />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 pl-9 pr-8 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-50 shadow-2xs transition"
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="thisMonth">Tháng này</option>
            <option value="allTime">Toàn thời gian</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onExportReport}
          className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer"
          title="Xuất báo cáo tổng quan ra file Excel (.csv)"
        >
          <Download size={16} className="text-emerald-600" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
}
