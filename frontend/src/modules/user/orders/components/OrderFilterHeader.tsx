"use client";

import React from "react";
import { Search, ChevronDown, Filter, ShoppingBag } from "lucide-react";
import { ORDER_TABS, normalizeOrderStatus, OrderData } from "./types";

interface OrderFilterHeaderProps {
  orders: OrderData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  onResetFilter: () => void;
  setCurrentPage: (page: number) => void;
}

export default function OrderFilterHeader({
  orders,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  timeFilter,
  setTimeFilter,
  onResetFilter,
  setCurrentPage,
}: OrderFilterHeaderProps) {
  const getTabCount = (tabValue: string) => {
    if (tabValue === "all") return orders.length;
    return orders.filter(o => normalizeOrderStatus(o.status) === tabValue).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <ShoppingBag size={22} className="text-blue-600" />
            Lịch sử mua hàng
          </h2>
          <p className="text-sm text-gray-500">
            Quản lý chi tiết và theo dõi tiến độ các đơn hàng thể thao của bạn
          </p>
        </div>
        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 self-start sm:self-auto">
          Tổng cộng: <span className="font-bold text-blue-600">{orders.length} đơn</span>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex px-6 overflow-x-auto hide-scrollbar gap-6 border-b border-gray-100">
        {ORDER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setCurrentPage(1);
            }}
            className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center ${
              activeTab === tab.value
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === tab.value ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
            }`}>
              {getTabCount(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-56">
            <select 
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Thời gian: Toàn bộ</option>
              <option value="3months">Thời gian: 3 tháng gần nhất</option>
              <option value="6months">Thời gian: 6 tháng gần nhất</option>
              <option value="thisYear">Trong năm nay</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <button 
            onClick={onResetFilter}
            className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Filter size={16} className="mr-2 text-gray-500" />
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
}
