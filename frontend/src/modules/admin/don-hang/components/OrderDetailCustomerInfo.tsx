'use client';

import { Users, Truck, CheckCircle2, Clock } from 'lucide-react';
import type { OrderItem } from '../types';
import { getPaymentActionRule } from '../utils/orderHelpers';

interface OrderDetailCustomerInfoProps {
  order: OrderItem;
  formatDate: (dateStr?: string) => string;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
}

export default function OrderDetailCustomerInfo({
  order,
  formatDate,
  handleUpdatePaymentStatus,
}: OrderDetailCustomerInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Users size={16} className="text-blue-600" /> Thông tin Người nhận
        </h3>
        <div className="space-y-2 text-sm">
          <p className="flex">
            <span className="text-gray-500 w-20 shrink-0">Họ tên:</span>{' '}
            <span className="font-semibold text-gray-900">{order.customer_name}</span>
          </p>
          <p className="flex">
            <span className="text-gray-500 w-20 shrink-0">SĐT:</span>{' '}
            <span className="font-semibold text-gray-900">{order.customer_phone}</span>
          </p>
          <p className="flex">
            <span className="text-gray-500 w-20 shrink-0">Email:</span>{' '}
            <span className="text-gray-900">{order.customer_email || 'Không cung cấp'}</span>
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Truck size={16} className="text-blue-600" /> Giao hàng &amp; Thanh toán
        </h3>
        <div className="space-y-2 text-sm">
          <p className="flex">
            <span className="text-gray-500 w-24 shrink-0">Địa chỉ:</span>{' '}
            <span className="font-medium text-gray-900">{order.customer_address}</span>
          </p>
          <p className="flex">
            <span className="text-gray-500 w-24 shrink-0">Thời gian:</span>{' '}
            <span className="text-gray-900">{formatDate(order.created_at)}</span>
          </p>
          <div className="flex flex-col gap-1.5 py-1.5 my-1 border-y border-blue-100/70">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5">
                <span className="text-gray-500 w-24 shrink-0">Hình thức:</span>{' '}
                <span className="font-bold uppercase text-blue-600">
                  {order.payment_method || 'COD'}
                </span>
              </p>
              {order.payment_status === 'paid' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Đã thanh toán
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Clock size={12} className="text-amber-500" />
                  Chưa thu tiền
                </span>
              )}
            </div>

            {order.paid_at && (
              <p className="flex text-xs text-gray-500">
                <span className="w-24 shrink-0">Ngày thu tiền:</span>
                <span className="font-medium text-gray-700">{formatDate(order.paid_at)}</span>
              </p>
            )}

            {handleUpdatePaymentStatus && (
              <div className="pt-1 flex items-center justify-end">
                {order.payment_status === 'paid' ? (
                  <button
                    type="button"
                    onClick={() => handleUpdatePaymentStatus(order._id, 'unpaid')}
                    className="text-xs text-gray-500 hover:text-amber-700 underline font-medium cursor-pointer"
                  >
                    Chuyển về Chưa thu tiền
                  </button>
                ) : (() => {
                  const rule = getPaymentActionRule(order);
                  if (rule.isHidden) return null;
                  if (!rule.canCollect) {
                    return (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1 bg-gray-100 text-gray-400 border border-gray-200 font-bold rounded-lg text-xs flex items-center gap-1.5 opacity-50 cursor-not-allowed"
                        title={rule.tooltipReason}
                      >
                        <CheckCircle2 size={13} className="text-gray-400" />
                        <span>Xác nhận Đã nhận tiền (Thu tiền)</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      onClick={() => handleUpdatePaymentStatus(order._id, 'paid')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>Xác nhận Đã nhận tiền (Thu tiền)</span>
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
          <p className="flex">
            <span className="text-gray-500 w-24 shrink-0">Gói giao hàng:</span>{' '}
            <span className="font-semibold text-gray-900">
              {order.shipping_method ||
                (order.shipping_fee === 60000
                  ? 'Hỏa Tốc 24H'
                  : order.shipping_fee === 35000
                    ? 'Giao Hàng Nhanh'
                    : 'VNExpress Tiêu chuẩn')}
            </span>
          </p>
          <p className="flex items-center">
            <span className="text-gray-500 w-24 shrink-0">Mã vận đơn:</span>
            {order.tracking_code ? (
              <span className="inline-flex items-center gap-1 font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {order.carrier || 'GHN'}: {order.tracking_code}
              </span>
            ) : (
              <span className="text-gray-400 italic text-xs">Chưa tạo mã</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
