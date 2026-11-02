'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import type { DashboardOrder } from '../types';

interface RecentOrdersTableProps {
  recentOrders: DashboardOrder[];
  formatPrice: (price: number) => string;
  formatDate: (dateStr?: string) => string;
  getOrderStatusBadge: (status?: string) => ReactNode;
}

export default function RecentOrdersTable({
  recentOrders,
  formatPrice,
  formatDate,
  getOrderStatusBadge,
}: RecentOrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Đơn hàng mới nhất</h2>
            <p className="text-xs text-slate-500">
              Các giao dịch phát sinh gần đây nhất trên hệ thống
            </p>
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
          <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Mã Đơn
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Khách Hàng
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Thời Gian
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Tổng Tiền
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Trạng Thái
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, idx) => {
                const orderId = order._id || order.id || order.order_id || `order-${idx}`;
                const customerName =
                  order.customer_name || order.shipping_address?.full_name || 'Khách vãng lai';
                return (
                  <tr key={orderId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5 font-sans tabular-nums font-bold text-slate-900 text-xs">
                      #{orderId.substring(Math.max(0, orderId.length - 8)).toUpperCase()}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900">{customerName}</td>
                    <td className="py-3 px-3.5 text-slate-500 text-xs tabular-nums">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-blue-600 font-sans tabular-nums">
                      {formatPrice(order.total_amount || 0)}
                    </td>
                    <td className="py-3 px-3.5">{getOrderStatusBadge(order.status)}</td>
                    <td className="py-3 px-3.5 text-right">
                      <Link
                        href="/admin/don-hang"
                        className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors duration-150"
                        title="Xem chi tiết đơn hàng"
                        aria-label="Xem chi tiết đơn hàng"
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
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
