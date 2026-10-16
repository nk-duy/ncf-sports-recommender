'use client';
import React from 'react';
import { Truck, Copy, AlertTriangle, Eye, Printer, CheckCircle } from 'lucide-react';

interface OrderCardGridProps {
  orders: any[];
  isDeliveredStatus: (status: string) => boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  setSelectedOrder: (order: any) => void;
  handlePrintInvoice: (order: any) => void;
  handleUpdateStatus: (id: string, status: string) => void;
  setShippingModalOrder: (order: any) => void;
  setRejectModalOrder: (order: any) => void;
  setSelectedRejectPreset: (preset: string) => void;
  setCustomRejectReason: (reason: string) => void;
}

export default function OrderCardGrid({
  orders,
  isDeliveredStatus,
  getStatusBadge,
  formatPrice,
  formatDate,
  copyToClipboard,
  copiedId,
  setSelectedOrder,
  handlePrintInvoice,
  handleUpdateStatus,
  setShippingModalOrder,
  setRejectModalOrder,
  setSelectedRejectPreset,
  setCustomRejectReason,
}: OrderCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((order) => {
        const isDelivered = isDeliveredStatus(order.status);
        const orderCode = `ORD-${(order._id || '').slice(-6).toUpperCase()}`;

        return (
          <div
            key={order._id}
            className="bg-white rounded-2xl border border-gray-150/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
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
                      <h3 className="font-bold text-gray-900 text-sm truncate" title={order.customer_name}>
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
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed" title={order.customer_address}>
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
                      onClick={() => copyToClipboard(order.tracking_code, `track-${order._id}`)}
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
            <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 py-1.5 px-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:text-blue-600 transition shadow-2xs"
                >
                  <Eye size={13} />
                  <span>Chi tiết</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintInvoice(order)}
                  className="py-1.5 px-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:text-gray-900 transition shadow-2xs"
                  title="In phiếu giao hàng"
                >
                  <Printer size={13} />
                  <span className="hidden sm:inline">In phiếu</span>
                </button>

                {/* Status switcher select */}
                <div className="relative">
                  <select
                    value={order.status === 'completed' ? 'delivered' : order.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'shipping') {
                        setShippingModalOrder(order);
                      } else if (val === 'rejected') {
                        setRejectModalOrder(order);
                        setSelectedRejectPreset('Hết hàng tồn kho / Tạm ngừng kinh doanh mẫu');
                        setCustomRejectReason(order.rejection_reason || '');
                      } else {
                        handleUpdateStatus(order._id, val);
                      }
                    }}
                    className="text-xs font-bold py-1.5 pl-2.5 pr-6 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer appearance-none"
                    title="Chuyển trạng thái đơn hàng"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Giao hàng...</option>
                    <option value="delivered">Đã giao</option>
                    <option value="rejected">Từ chối đơn</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▾
                  </div>
                </div>
              </div>

              {/* Primary Contextual Action Button */}
              <div>
                {order.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <CheckCircle size={13} />
                    <span>Duyệt đơn hàng</span>
                  </button>
                )}

                {order.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => setShippingModalOrder(order)}
                    className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Truck size={13} />
                    <span>Tạo vận đơn &amp; Giao hàng</span>
                  </button>
                )}

                {order.status === 'shipping' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(order._id, 'delivered')}
                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <CheckCircle size={13} />
                    <span>Xác nhận Đã giao</span>
                  </button>
                )}

                {isDelivered && (
                  <div className="py-1 px-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50/80 rounded-lg border border-emerald-200/60">
                    ✓ Đơn hàng đã hoàn tất
                  </div>
                )}

                {order.status === 'rejected' && (
                  <div className="py-1 px-2 text-center text-xs font-bold text-rose-700 bg-rose-50/80 rounded-lg border border-rose-200/60">
                    ✕ Đơn hàng đã từ chối
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
