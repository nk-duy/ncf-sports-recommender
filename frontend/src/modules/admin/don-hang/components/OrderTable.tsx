'use client';

import React from 'react';
import { Copy, Truck, Eye, Printer, CheckCircle2, Clock } from 'lucide-react';
import type { OrderItem } from '../types';
import { getPaymentActionRule } from '../utils/orderHelpers';

interface OrderTableProps {
  orders: OrderItem[];
  getStatusBadge: (status: string) => React.ReactNode;
  formatPrice: (price: number) => string;
  formatDate: (dateStr?: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
  setShippingModalOrder: (order: OrderItem) => void;
  setSelectedOrder: (order: OrderItem) => void;
  handlePrintInvoice: (order: OrderItem) => void;
}

export default function OrderTable({
  orders,
  getStatusBadge,
  formatPrice,
  formatDate,
  copyToClipboard,
  copiedId,
  handleUpdateStatus,
  handleUpdatePaymentStatus,
  setShippingModalOrder,
  setSelectedOrder,
  handlePrintInvoice,
}: OrderTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200/80 select-none">
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Mã đơn &amp; Ngày đặt
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Khách hàng
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Địa chỉ giao hàng
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-center">
                Sản phẩm
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">
                Tổng thanh toán
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">
                Vận chuyển
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-center">
                Trạng thái
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.map((order) => {
              const orderCode = `ORD-${(order._id || '').slice(-6).toUpperCase()}`;

              return (
                <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans tabular-nums font-bold text-slate-900">
                        #{orderCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderCode, order._id)}
                        className="text-slate-400 hover:text-blue-600 transition"
                        title="Chép mã đơn"
                        aria-label="Chép mã đơn"
                      >
                        {copiedId === order._id ? (
                          <span className="text-[10px] text-emerald-600 font-bold">Chép!</span>
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
                      {formatDate(order.created_at)}
                    </span>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{order.customer_name}</div>
                    <div className="text-slate-500 text-[11px] tabular-nums">
                      {order.customer_phone}
                    </div>
                  </td>

                  <td
                    className="py-3 px-3.5 max-w-xs truncate text-slate-600"
                    title={order.customer_address}
                  >
                    {order.customer_address}
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap font-semibold text-slate-900 tabular-nums">
                    {order.items?.length || 0} món
                  </td>

                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="font-bold text-blue-600 font-sans tabular-nums">
                      {formatPrice(order.total_amount)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        {order.payment_method || 'COD'}
                      </span>
                      <span className="text-slate-300">·</span>
                      {order.payment_status === 'paid' ? (
                        <span className="whitespace-nowrap inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="whitespace-nowrap inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Clock size={10} className="text-amber-500" />
                          Chưa thu tiền
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="text-[11px] font-semibold text-slate-800">
                      {order.shipping_method ||
                        (order.shipping_fee === 60000
                          ? 'Hỏa Tốc 24H'
                          : order.shipping_fee === 35000
                            ? 'Giao Hàng Nhanh'
                            : 'Tiêu chuẩn')}
                    </div>
                    {order.tracking_code ? (
                      <div className="text-[11px] text-indigo-700 font-sans tabular-nums font-semibold mt-0.5">
                        {order.carrier || 'ĐVVC'}: {order.tracking_code}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">Chưa phát mã</span>
                    )}
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {handleUpdatePaymentStatus &&
                        (order.payment_status === 'paid' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentStatus(order._id, 'unpaid')}
                            className="size-8 inline-flex items-center justify-center bg-emerald-50 hover:bg-amber-50 text-emerald-600 hover:text-amber-700 rounded-lg transition-colors duration-150 cursor-pointer"
                            title="Đã thanh toán (Nhấn để chuyển sang Chưa thu tiền)"
                            aria-label="Chuyển trạng thái thanh toán"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        ) : (() => {
                          const rule = getPaymentActionRule(order);
                          if (rule.isHidden) return null;
                          if (!rule.canCollect) {
                            return (
                              <button
                                type="button"
                                disabled
                                className="h-8 px-2.5 bg-gray-100 text-gray-400 border border-gray-200 font-semibold rounded-lg text-xs opacity-50 cursor-not-allowed flex items-center gap-1"
                                title={rule.tooltipReason}
                                aria-label="Nút thu tiền bị khóa"
                              >
                                <CheckCircle2 size={12} className="text-gray-400" />
                                <span>Thu tiền</span>
                              </button>
                            );
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentStatus(order._id, 'paid')}
                              className="h-8 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold rounded-lg text-xs transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                              title="Xác nhận đã nhận tiền"
                              aria-label="Xác nhận đã nhận tiền"
                            >
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              <span>Thu tiền</span>
                            </button>
                          );
                        })())}

                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors duration-150 shadow-2xs cursor-pointer inline-flex items-center justify-center"
                          title="Duyệt đơn ngay"
                        >
                          Duyệt
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setShippingModalOrder(order)}
                          className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors duration-150 shadow-2xs flex items-center gap-1 cursor-pointer"
                          title="Tạo vận đơn &amp; giao hàng"
                        >
                          <Truck size={12} /> Giao
                        </button>
                      )}

                      {order.status === 'shipping' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order._id, 'delivered')}
                          className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors duration-150 shadow-2xs cursor-pointer inline-flex items-center justify-center"
                          title="Xác nhận đã giao"
                        >
                          Đã giao
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors duration-150"
                        title="Xem chi tiết đơn hàng"
                        aria-label="Xem chi tiết đơn hàng"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintInvoice(order)}
                        className="size-8 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors duration-150"
                        title="In phiếu giao hàng"
                        aria-label="In phiếu giao hàng"
                      >
                        <Printer size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
