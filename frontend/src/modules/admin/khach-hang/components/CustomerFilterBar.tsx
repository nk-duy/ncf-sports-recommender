"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

interface CustomerFilterBarProps {
  activeTab: "all" | "vip" | "new" | "potential" | "churn_risk";
  onTabChange: (tab: "all" | "vip" | "new" | "potential" | "churn_risk") => void;
  stats: {
    total: number;
    active: number;
    vip: number;
    new: number;
    potential: number;
    churn_risk: number;
    clv: number;
  };
  search: string;
  onSearchChange: (val: string) => void;
  tierFilter: string;
  onTierChange: (val: string) => void;
  sportFilter: string;
  onSportChange: (val: string) => void;
  regionFilter: string;
  onRegionChange: (val: string) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

export default function CustomerFilterBar({
  activeTab,
  onTabChange,
  stats,
  search,
  onSearchChange,
  tierFilter,
  onTierChange,
  sportFilter,
  onSportChange,
  regionFilter,
  onRegionChange,
  onApplyFilter,
  onResetFilter,
}: CustomerFilterBarProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 flex flex-col gap-4">
      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onTabChange("all")}
          className={`px-4 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-blue-50 text-blue-700 font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          Tất cả <span className="ml-1 text-[11px] opacity-75 font-mono">({stats.total.toLocaleString("vi-VN")})</span>
        </button>

        <button
          onClick={() => onTabChange("vip")}
          className={`px-4 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "vip"
              ? "bg-blue-50 text-blue-700 font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          Hội viên VIP <span className="ml-1 text-[11px] font-mono">({stats.vip.toLocaleString("vi-VN")})</span>
        </button>

        <button
          onClick={() => onTabChange("new")}
          className={`px-4 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "new"
              ? "bg-blue-50 text-blue-700 font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          Khách hàng mới <span className="ml-1 text-[11px] font-mono">({stats.new > 0 ? stats.new : Math.floor(stats.total * 0.15)})</span>
        </button>

        <button
          onClick={() => onTabChange("potential")}
          className={`px-4 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "potential"
              ? "bg-blue-50 text-blue-700 font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          Tiềm năng <span className="ml-1 text-[11px] font-mono">({stats.potential > 0 ? stats.potential : Math.floor(stats.total * 0.4)})</span>
        </button>

        <button
          onClick={() => onTabChange("churn_risk")}
          className={`px-4 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === "churn_risk"
              ? "bg-red-100 text-red-700 font-bold"
              : "text-red-600 hover:bg-red-50 hover:text-red-700"
          }`}
        >
          Nguy cơ rời bỏ <span className="ml-1 text-[11px] font-mono">({stats.churn_risk > 0 ? stats.churn_risk : Math.floor(stats.total * 0.05)})</span>
        </button>
      </div>

      {/* Search and Select Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Box (Span 4) */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT, mã KH (#KH-...)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApplyFilter()}
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown 1: Tier (Span 2) */}
        <div className="md:col-span-2">
          <select
            value={tierFilter}
            onChange={(e) => onTierChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="">Phân hạng: Tất cả</option>
            <option value="Kim Cương">Kim Cương</option>
            <option value="Vàng">Vàng</option>
            <option value="Bạc">Bạc</option>
            <option value="Đồng">Đồng</option>
          </select>
        </div>

        {/* Dropdown 2: Sport Category (Span 2) */}
        <div className="md:col-span-2">
          <select
            value={sportFilter}
            onChange={(e) => onSportChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="">Bộ môn: Tất cả</option>
            <option value="Chạy bộ">Chạy bộ</option>
            <option value="Gym">Gym / Fitness</option>
            <option value="Yoga">Yoga</option>
            <option value="Camping">Camping / Dã ngoại</option>
            <option value="Bóng đá">Bóng đá</option>
          </select>
        </div>

        {/* Dropdown 3: Region (Span 2) */}
        <div className="md:col-span-2">
          <select
            value={regionFilter}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="">Khu vực: Tất cả</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </div>

        {/* Actions Buttons (Span 2) */}
        <div className="md:col-span-2 flex items-center gap-2 justify-end">
          <button
            onClick={onApplyFilter}
            className="h-10 px-4 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-sm flex items-center justify-center gap-1.5 flex-1 transition-colors cursor-pointer"
          >
            <Filter size={16} />
            <span>Lọc</span>
          </button>
          <button
            onClick={onResetFilter}
            className="h-10 w-10 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Làm mới bộ lọc"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
