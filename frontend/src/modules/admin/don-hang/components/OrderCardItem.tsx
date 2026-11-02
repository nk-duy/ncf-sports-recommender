'use client';

import React from 'react';
import { Truck, Copy, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { OrderItem } from '../types';
import OrderCardItemFooter from './OrderCardItemFooter';

interface OrderCardItemProps {
  order: OrderItem;
  isDelivered: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  formatPrice: (price: number) => string;
  formatDate: (dateStr?: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  setSelectedOrder: (order: OrderItem) => void;
  handlePrintInvoice: (order: OrderItem) => void;
  handleUpdateStatus: (id: string, status: string) => void;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
  setShippingModalOrder: (order: OrderItem) => void;
  setRejectModalOrder: (order: OrderItem) => void;
  setSelectedRejectPreset: (preset: string) => void;
  setCustomRejectReason: (reason: string) => void;
}

export default function OrderCardItem({
  order,
  isDelivered,
  getStatusBadge,
  formatPrice,
  formatDate,
  copyToClipboard,
  copiedId,
  setSelectedOrder,
  handlePrintInvoice,
  handleUpdateStatus,
  handleUpdatePaymentStatus,
  setShippingModalOrder,
  setRejectModalOrder,
  setSelectedRejectPreset,
  setCustomRejectReason,
}: OrderCardItemProps) {
  const orderCode = `ORD-${(order._id || '').slice(-6).toUpperCase()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-150/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Body Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Customer & Status Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {order.customer_name?.charAt(0).toUpperCase() || 'K'}
              </div>
              <div className="min-w-0">
                <h3
                  className="font-bold text-gray-900 text-sm truncate"
                  title={order.customer_name}
                >
                  {order.customer_name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{order.customer_phone}</p>
              </div>
            </div>

            <div className="shrink-0">{getStatusBadge(order.status)}</div>
          </div>

          {/* Order Metadata Row (ID & Date) */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-3 pb-2.5 border-b border-gray-100">
            <button
              type="button"
              onClick={() => copyToClipboard(orderCode, order._id)}
              className="inline-flex items-center gap-1 font-mono text-gray-500 hover:text-blue-600 transition"
              title="Bấm để sao chép mã đơn"
            >
              <span className="font-bold text-gray-800">#{orderCode}</span>
              {copiedId === order._id ? (
                <span className="text-[10px] text-emerald-600 font-bold">Đã chép!</span>
              ) : (
                <Copy size={11} className="opacity-60" />
              )}
            </button>
            <span>{formatDate(order.created_at)}</span>
          </div>

          {/* Address */}
          <div className="mb-3.5">
            <p
              className="text-xs text-gray-600 line-clamp-2 leading-relaxed"
              title={order.customer_address}
            >
              <span className="font-semibold text-gray-700">Đến:</span> {order.customer_address}
            </p>
          </div>

          {/* Metric Row Box */}
          <div className="bg-gray-50/90 rounded-xl p-2.5 grid grid-cols-3 gap-2 text-center border border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold">Sản phẩm</span>
              <span className="text-xs font-bold text-gray-800">{order.items?.length || 0} món</span>
            </div>
            <div className="border-x border-gray-200/80 px-1">
              <span className="text-[10px] text-gray-400 block font-semibold">Thanh toán</span>
              <span
                className={`text-[11px] font-black uppercase ${
                  order.payment_method?.includes('VNPAY') || order.payment_method?.includes('MoMo')
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {order.payment_method || 'COD'}
              </span>
              <div className="mt-0.5">
                {order.payment_status === 'paid' ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1 py-0.2 rounded">
                    <CheckCircle2 size={9} className="text-emerald-600" /> Đã trả
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-100/70 px-1 py-0.2 rounded">
                    <Clock size={9} className="text-amber-600" /> Chưa thu
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block font-semibold">Tổng tiền</span>
              <span className="text-xs font-black text-blue-600 truncate block">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Coupon & Freeship badges */}
          {(order.voucher_code || (order.shipping_fee === 0 && order.total_amount >= 500000)) && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {order.voucher_code && (
                <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Giảm {formatPrice(order.discount_amount || 0)}
                </span>
              )}
              {order.shipping_fee === 0 && (
                <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Freeship 0đ
                </span>
              )}
            </div>
          )}

          {/* Carrier & Tracking badge */}
          {order.tracking_code && (
            <div className="mt-2.5 p-2 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Truck size={13} className="text-indigo-600 shrink-0" />
                <span className="truncate text-[11px]">
                  <strong>{order.carrier || 'ĐVVC'}:</strong>{' '}
                  <span className="font-mono font-bold">{order.tracking_code}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(order.tracking_code || '', `track-${order._id}`)}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold shrink-0 ml-1.5"
                title="Sao chép mã vận đơn"
              >
                {copiedId === `track-${order._id}` ? 'Đã chép' : 'Chép'}
              </button>
            </div>
          )}

          {/* Rejected reason alert */}
          {order.status === 'rejected' && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-1.5">
              <AlertTriangle size={14} className="shrink-0 text-rose-500 mt-0.5" />
              <div className="min-w-0 text-[11px]">
                <strong className="text-rose-900">Lý do từ chối:</strong>{' '}
                {order.rejection_reason || 'Chưa ghi chú'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <OrderCardItemFooter
        order={order}
        isDelivered={isDelivered}
        setSelectedOrder={setSelectedOrder}
        handlePrintInvoice={handlePrintInvoice}
        handleUpdateStatus={handleUpdateStatus}
        handleUpdatePaymentStatus={handleUpdatePaymentStatus}
        setShippingModalOrder={setShippingModalOrder}
        setRejectModalOrder={setRejectModalOrder}
        setSelectedRejectPreset={setSelectedRejectPreset}
        setCustomRejectReason={setCustomRejectReason}
      />
    </div>
  );
}
