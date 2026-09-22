"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, ChevronDown, CheckCircle, Package, Truck, XCircle, FileText, Star, Image as ImageIcon } from "lucide-react";
import { mockAllOrders } from "../data/mockAccountData";

const tabs = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Chờ thanh toán", value: "Chờ thanh toán" },
  { label: "Đang xử lý", value: "Đang xử lý" },
  { label: "Đang vận chuyển", value: "Đang vận chuyển" },
  { label: "Đã hoàn tất", value: "Đã hoàn tất" },
  { label: "Đã hủy", value: "Đã hủy" }
];

export default function OrdersList() {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filteredOrders = mockAllOrders.filter(order => {
    if (activeTab === "Tất cả") return true;
    return order.status === activeTab;
  });

  const getTabCount = (tabValue: string) => {
    if (tabValue === "Tất cả") return mockAllOrders.length;
    return mockAllOrders.filter(o => o.status === tabValue).length;
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Đang vận chuyển":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            {status}
          </div>
        );
      case "Đã hoàn tất":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
            {status}
          </div>
        );
      case "Đã hủy":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
            {status}
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
            {status}
          </div>
        );
    }
  };

  const renderActionButton = (action: any, index: number) => {
    switch (action.type) {
      case "primary":
        return (
          <button key={index} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
            {action.label}
          </button>
        );
      case "secondary":
        return (
          <button key={index} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors flex items-center">
            {action.icon === "file" && <FileText size={16} className="mr-1.5 text-gray-500" />}
            {action.label}
          </button>
        );
      case "outline-star":
        return (
          <button key={index} className="px-4 py-2 border border-orange-200 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-md transition-colors flex items-center">
            <Star size={16} className="mr-1.5 fill-orange-500 text-orange-500" />
            {action.label}
          </button>
        );
      case "success-text":
        return (
          <span key={index} className="px-4 py-2 text-green-600 text-sm font-medium flex items-center">
            {action.label}
          </span>
        );
      default:
        return (
          <button key={index} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors">
            {action.label}
          </button>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Lịch sử mua hàng
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý và theo dõi tiến độ các đơn hàng thể thao của bạn
            </p>
          </div>
          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Tổng cộng: <span className="font-bold text-blue-600">{mockAllOrders.length} đơn</span>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex px-6 overflow-x-auto hide-scrollbar gap-8 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center ${
                activeTab === tab.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
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
              placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-56">
              <select className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Thời gian: 6 tháng gần nhất</option>
                <option>Thời gian: 3 tháng gần nhất</option>
                <option>Năm 2024</option>
                <option>Năm 2023</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Lọc đơn
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Card Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center text-sm gap-x-2 gap-y-1">
                  <span className="font-bold text-gray-900">Mã: {order.id}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">Ngày đặt: {order.date} {order.time}</span>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  {order.shippingProvider ? (
                    <span className="text-gray-500 flex items-center">
                      <Truck size={14} className="mr-1.5 text-gray-400" />
                      Đơn vị: {order.shippingProvider} (Vận đơn: {order.trackingNumber})
                    </span>
                  ) : order.completedDate ? (
                    <span className="text-gray-500 flex items-center">
                      <CheckCircle size={14} className="mr-1.5 text-green-500" />
                      Giao thành công: {order.completedDate}
                    </span>
                  ) : null}
                </div>
                <div>
                  {renderStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className={`w-24 h-24 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden ${order.imageColor || 'bg-gray-100'}`}>
                  {/* Using an icon as fallback since actual images might be missing */}
                  <ImageIcon size={32} className="text-black/10" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 mb-1.5 truncate">
                    {order.summary}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {order.details}
                  </p>
                  
                  {order.tags && order.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {order.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-start min-w-[120px]">
                  <div className="font-bold text-gray-900 text-lg">
                    {order.price.toLocaleString("vi-VN")} đ
                  </div>
                  {order.originalPrice && (
                    <div className="text-sm text-gray-400 line-through mt-0.5">
                      {order.originalPrice.toLocaleString("vi-VN")} đ
                    </div>
                  )}
                </div>
              </div>

              {/* Order Card Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col text-sm w-full md:w-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500">Tổng tiền:</span>
                    <span className="font-bold text-gray-900 text-lg">{order.total.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="text-gray-500 flex items-center">
                    {order.paymentMethod === "Đã thanh toán qua VNPAY" || order.paymentMethod === "Thanh toán qua Ví MoMo" ? (
                      <CheckCircle size={14} className="mr-1.5 text-green-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                    )}
                    {order.paymentMethod}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  {order.actions && order.actions.map((action, i) => renderActionButton(action, i))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Không có đơn hàng nào</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Bạn chưa có đơn hàng nào trong trạng thái này. Hãy khám phá thêm các sản phẩm thể thao tuyệt vời nhé!
            </p>
            <button className="mt-6 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors">
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 text-sm text-gray-500">
          <div>
            Hiển thị <span className="font-medium text-gray-900">3</span> / <span className="font-medium text-gray-900">{mockAllOrders.length}</span> đơn hàng
          </div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="w-8 h-8 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 font-medium flex items-center justify-center transition-colors">2</button>
            <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
