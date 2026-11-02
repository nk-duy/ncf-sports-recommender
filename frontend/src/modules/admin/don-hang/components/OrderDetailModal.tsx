'use client';

import React from 'react';
import { X, AlertTriangle, Truck, XCircle, Printer } from 'lucide-react';
import type { OrderItem } from '../types';
import OrderDetailCustomerInfo from './OrderDetailCustomerInfo';
import OrderDetailItemsSection from './OrderDetailItemsSection';

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  formatPrice: (price: number) => string;
  formatDate: (dateStr?: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
  onOpenRejectModal: (order: OrderItem) => void;
  onOpenShippingModal: (order: OrderItem) => void;
  onPrintInvoice: (order: OrderItem) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  formatPrice,
  formatDate,
  getStatusBadge,
  handleUpdatePaymentStatus,
  onOpenRejectModal,
  onOpenShippingModal,
  onPrintInvoice,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
            <p className="text-sm font-mono text-gray-500 mt-0.5">
              <span className="font-bold text-blue-600">
                #ORD-{(order._id || '').slice(-6).toUpperCase()}
              </span>{' '}
              • <span className="text-gray-400">ID: {order._id}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {order.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-red-900">
                  Đơn hàng này đã bị từ chối / hủy
                </h4>
                <p className="text-sm text-red-700 mt-0.5">
                  <span className="font-semibold text-red-800">Lý do từ chối:</span>{' '}
                  {order.rejection_reason || 'Không có ghi chú lý do chi tiết'}
                </p>
              </div>
            </div>
          )}

          <OrderDetailCustomerInfo
            order={order}
            formatDate={formatDate}
            handleUpdatePaymentStatus={handleUpdatePaymentStatus}
          />

          <OrderDetailItemsSection order={order} formatPrice={formatPrice} />
        </div>

        {/* Modal Footer (Actions) */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-500">Trạng thái:</span>
            {getStatusBadge(order.status)}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {order.status !== 'rejected' ? (
              <button
                type="button"
                onClick={() => onOpenRejectModal(order)}
                className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <XCircle size={16} /> Từ chối đơn
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenRejectModal(order)}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <AlertTriangle size={15} /> Sửa lý do từ chối
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenShippingModal(order)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
              title="Cập nhật đơn vị vận chuyển và mã vận đơn"
            >
              <Truck size={16} /> Giao hàng &amp; Mã Vận đơn
            </button>
            <button
              type="button"
              onClick={() => onPrintInvoice(order)}
              className="flex-1 sm:flex-none px-5 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Printer size={16} /> In Phiếu Giao Hàng
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-100 transition shadow-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
