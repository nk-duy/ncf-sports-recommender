'use client';

import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { OrderItem } from '../types';
import { isDeliveredStatus } from '../utils/orderHelpers';

interface OrderStatusTabsProps {
  baseFilteredOrders: OrderItem[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

const ORDER_TABS = [
  { id: 'all', label: 'Tất cả', icon: <Package size={14} />, iconColor: 'text-gray-500' },
  { id: 'pending', label: 'Chờ duyệt', icon: <Clock size={14} />, iconColor: 'text-amber-500' },
  { id: 'confirmed', label: 'Đã xác nhận', icon: <CheckCircle size={14} />, iconColor: 'text-blue-600' },
  { id: 'shipping', label: 'Đang giao', icon: <Truck size={14} />, iconColor: 'text-indigo-600' },
  { id: 'delivered', label: 'Đã giao', icon: <CheckCircle size={14} />, iconColor: 'text-emerald-500' },
  { id: 'rejected', label: 'Từ chối / Hủy', icon: <XCircle size={14} />, iconColor: 'text-rose-500' },
];

export default function OrderStatusTabs({
  baseFilteredOrders,
  activeTab,
  onSelectTab,
}: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl shadow-2xs border border-gray-100">
      {ORDER_TABS.map((tab) => {
        const count = baseFilteredOrders.filter((order) => {
          if (tab.id === 'delivered') return isDeliveredStatus(order.status);
          if (tab.id !== 'all' && order.status?.toLowerCase() !== tab.id) return false;
          return true;
        }).length;

        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className={isActive ? 'text-white' : tab.iconColor}>{tab.icon}</span>
            {tab.label}
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
