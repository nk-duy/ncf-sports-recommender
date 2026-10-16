'use client';
import React from 'react';
import { X, AlertTriangle, Users, Truck, Package, XCircle, Printer } from 'lucide-react';

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onOpenRejectModal: (order: any) => void;
  onOpenShippingModal: (order: any) => void;
  onPrintInvoice: (order: any) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  formatPrice,
  formatDate,
  getStatusBadge,
  onOpenRejectModal,
  onOpenShippingModal,
  onPrintInvoice,
}: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
            <p className="text-sm font-mono text-gray-500 mt-0.5">
              <span className="font-bold text-blue-600">#ORD-{(order._id || '').slice(-6).toUpperCase()}</span> • <span className="text-gray-400">ID: {order._id}</span>
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
          {/* Rejection Alert if rejected */}
          {order.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-red-900">Đơn hàng này đã bị từ chối / hủy</h4>
                <p className="text-sm text-red-700 mt-0.5">
                  <span className="font-semibold text-red-800">Lý do từ chối:</span>{' '}
                  {order.rejection_reason || 'Không có ghi chú lý do chi tiết'}
                </p>
              </div>
            </div>
          )}

          {/* Customer Info */}
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
                <p className="flex">
                  <span className="text-gray-500 w-24 shrink-0">Thanh toán:</span>{' '}
                  <span className="font-bold uppercase text-blue-600">{order.payment_method || 'COD'}</span>
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

          {/* Order Items Table */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package size={16} className="text-gray-600" /> Danh sách Sản phẩm ({order.items?.length || 0})
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3 text-center">SL</th>
                    <th className="px-4 py-3 text-right">Đơn giá</th>
                    <th className="px-4 py-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 line-clamp-2">
                          {item.product_name || item.name || 'Sản phẩm'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex gap-3">
                          {item.color && (
                            <span className="flex items-center gap-1">
                              Màu: <span className="font-semibold text-gray-700">{item.color}</span>
                            </span>
                          )}
                          {item.size && (
                            <span className="flex items-center gap-1">
                              Size: <span className="font-semibold text-gray-700">{item.size}</span>
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          {(() => {
            const subtotal =
              order.subtotal && order.subtotal > 0
                ? order.subtotal
                : order.items?.reduce((sum: number, it: any) => sum + it.price * (it.quantity || 1), 0) ||
                  order.total_amount;
            const shippingFee = order.shipping_fee ?? 0;
            const discountAmount = order.discount_amount ?? 0;
            const voucherCode = order.voucher_code;

            return (
              <div className="flex justify-end">
                <div className="w-full sm:w-80 space-y-2.5 text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Tiền hàng (tạm tính):</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className={shippingFee > 0 ? 'font-semibold text-gray-900' : 'font-bold text-green-600'}>
                      {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí (0 ₫)'}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Mã giảm giá {voucherCode ? `(${voucherCode})` : ''}:</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-3 mt-2 border-t border-gray-200 flex justify-between font-black text-base items-baseline">
                    <span className="text-gray-900">Tổng thanh toán:</span>
                    <span className="text-xl text-blue-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            );
          })()}
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
