"use client";

import { RotateCw } from "lucide-react";
import { SPORT_TABS, TYPE_TABS } from "../types";

interface RecommendedFilterToolbarProps {
  productsCount: number;
  isAuthenticated: boolean;
  displayUserName?: string;
  isRefreshing: boolean;
  loading: boolean;
  onRefresh: () => void;
  activeSportTab: string;
  onChangeSportTab: (id: string) => void;
  activeTypeTab: string;
  onChangeTypeTab: (id: string) => void;
  sortBy: string;
  onChangeSortBy: (val: string) => void;
}

export default function RecommendedFilterToolbar({
  productsCount,
  isAuthenticated,
  displayUserName,
  isRefreshing,
  loading,
  onRefresh,
  activeSportTab,
  onChangeSportTab,
  activeTypeTab,
  onChangeTypeTab,
  sortBy,
  onChangeSortBy,
}: RecommendedFilterToolbarProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600">
              Tuyển chọn cho bạn
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              {productsCount} sản phẩm
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            {isAuthenticated && displayUserName ? (
              <>
                Sản phẩm gợi ý cho bạn:{" "}
                <span className="text-blue-600">{displayUserName}</span>
              </>
            ) : (
              <>Gợi ý dành cho bạn</>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Các sản phẩm thể thao phù hợp với sở thích và hoạt động mua sắm của bạn.
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing || loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-sm cursor-pointer disabled:opacity-50 self-start md:self-center"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-white" : ""}`} />
          <span>{isRefreshing ? "Đang làm mới..." : "Đổi danh sách khác"}</span>
        </button>
      </div>

      {/* Filter Bar: Sports & Types */}
      <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Sports Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
          {SPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeSportTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSportTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type Filter & Sort Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChangeTypeTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTypeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="default">Phù hợp nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="discount">Giảm giá nhiều nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
}
