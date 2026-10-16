'use client';
import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Eye } from 'lucide-react';

interface RecentOrdersTableProps {
  recentOrders: any[];
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
  getOrderStatusBadge: (status: string) => React.ReactNode;
}

export default function RecentOrdersTable({
  recentOrders,
  formatPrice,
  formatDate,
  getOrderStatusBadge,
}: RecentOrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-gray-900">Đơn hàng mới nhất</h2>
            <p className="text-xs text-gray-500">Các giao dịch phát sinh gần đây nhất trên hệ thống</p>
          </div>
        </div>
        <Link
          href="/admin/don-hang"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          Quản lý toàn bộ đơn hàng <ArrowRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-5 py-3">Mã Đơn</th>
              <th className="px-5 py-3">Khách Hàng</th>
              <th className="px-5 py-3">Thời Gian</th>
              <th className="px-5 py-3">Tổng Tiền</th>
              <th className="px-5 py-3">Trạng Thái</th>
              <th className="px-5 py-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, idx) => {
                const orderId = order._id || order.id || order.order_id || `order-${idx}`;
                const customerName =
                  order.customer_name || order.shipping_address?.full_name || 'Khách vãng lai';
                return (
                  <tr key={orderId} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono font-bold text-gray-900 text-xs">
                      #{orderId.substring(Math.max(0, orderId.length - 8)).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{customerName}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3 font-bold text-blue-600 font-mono">
                      {formatPrice(order.total_amount || 0)}
                    </td>
                    <td className="px-5 py-3">{getOrderStatusBadge(order.status)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href="/admin/don-hang"
                        className="p-1.5 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 rounded-lg inline-flex items-center justify-center transition shadow-2xs"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  Không có đơn hàng nào trong thời gian này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
