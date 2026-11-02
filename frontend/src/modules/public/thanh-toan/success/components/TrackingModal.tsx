'use client';

import { useState } from 'react';
import { Check, CheckCircle, Copy, Receipt, Truck, X } from 'lucide-react';
import type { PublicOrderData } from '../../types';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: PublicOrderData | null;
}

export default function TrackingModal({ isOpen, onClose, order }: TrackingModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const orderId = order?._id || order?.id || '';
  const shortCode = orderId ? `ORD-${orderId.slice(-6).toUpperCase()}` : '';
  const trackingCode =
    order?.tracking_code || (orderId ? `TRK-${orderId.slice(-8).toUpperCase()}` : 'TRK-KADY');
  const carrier = order?.carrier || order?.shipping_method || 'KADY Express Logistics';
  const customerName = order?.customer_name || 'Quý khách';
  const customerPhone = order?.customer_phone || '';
  const customerAddress = order?.customer_address || '';
  const totalAmount = order?.total_amount || 0;

  let paymentMethod = 'Thanh toán khi nhận hàng (COD)';
  if (order?.payment_method === 'BANK_TRANSFER' || order?.payment_method === 'banking') {
    paymentMethod = 'Chuyển khoản Ngân hàng';
  } else if (order?.payment_method === 'VNPAY') {
    paymentMethod = 'VNPAY-QR';
  }

  const createdDate = order?.created_at ? new Date(order.created_at) : new Date();
  const timeFormatted = createdDate.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const isConfirmed =
    order?.status === 'confirmed' ||
    order?.status === 'shipping' ||
    order?.status === 'delivered' ||
    order?.status === 'completed';
  const isShipping =
    order?.status === 'shipping' || order?.status === 'delivered' || order?.status === 'completed';
  const isDelivered = order?.status === 'delivered' || order?.status === 'completed';

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Hành trình vận chuyển đơn hàng
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wide border border-blue-200">
                {order?.status === 'confirmed' ? 'Đã xác nhận' : 'Đang xử lý'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium pt-0.5">
              <span>
                Mã vận đơn:{' '}
                <strong className="font-sans font-semibold text-slate-900 tabular-nums">{trackingCode}</strong>
              </span>
              <button
                onClick={() => handleCopy(trackingCode)}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
                type="button"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Đã chép' : 'Copy'}</span>
              </button>
              <span className="text-slate-300">•</span>
              <span>
                Đơn hàng:{' '}
                <strong className="font-sans font-semibold text-slate-900 tabular-nums">#{shortCode}</strong>
              </span>
            </div>
          </div>
          <button
            className="size-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            onClick={onClose}
            type="button"
            title="Đóng cửa sổ"
            aria-label="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50 text-xs sm:text-sm">
          <div className="bg-white rounded-xl p-4.5 space-y-3 border border-slate-200/80 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Đơn vị &amp; Gói vận chuyển:
                </div>
                <div className="text-sm text-blue-700 font-bold flex items-center gap-1.5">
                  <Truck size={16} />
                  <span>{carrier}</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Địa chỉ giao hàng:
                </div>
                <div className="text-xs sm:text-sm text-slate-800 line-clamp-2 leading-relaxed">
                  <strong>{customerName}</strong> ({customerPhone}) - {customerAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-7 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 mt-4">
            <div className="relative flex flex-col items-start gap-1">
              <div className="absolute -left-7 top-0.5 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                <Check size={14} />
              </div>
              <span className="text-xs text-emerald-600 font-bold font-sans tabular-nums">
                Bước 1 • {timeFormatted}
              </span>
              <div className="text-sm font-bold text-slate-900">Đặt hàng thành công</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Khách hàng hoàn tất tạo đơn hàng #{shortCode} với hình thức {paymentMethod} (
                <span className="font-sans tabular-nums font-semibold">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
                ).
              </p>
            </div>

            <div className="relative flex flex-col items-start gap-1">
              <div
                className={`absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                  isConfirmed ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white animate-pulse'
                }`}
              >
                <Receipt size={13} />
              </div>
              <span className={`text-xs font-bold ${isConfirmed ? 'text-emerald-600' : 'text-blue-600'}`}>
                {isConfirmed ? 'Đã xong' : 'Mốc hiện tại'}
              </span>
              <div className="text-sm font-bold text-slate-900">Tiếp nhận &amp; Đóng gói hàng tại kho KADY</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Đội ngũ kho trung tâm kiểm tra chất lượng sản phẩm, niêm phong hộp và chuẩn bị nhãn bưu gửi.
              </p>
            </div>

            <div className="relative flex flex-col items-start gap-1">
              <div
                className={`absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                  isShipping ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Truck size={13} />
              </div>
              <div className="text-sm font-bold text-slate-900">Bàn giao cho đối tác bưu cục</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Kiện hàng được tài xế lấy hàng và vận chuyển đến trung tâm khai thác gần nhất.
              </p>
            </div>

            <div className="relative flex flex-col items-start gap-1">
              <div
                className={`absolute -left-7 top-0.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                  isDelivered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <CheckCircle size={13} />
              </div>
              <div className="text-sm font-bold text-slate-900">Giao hàng thành công đến tay khách hàng</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                Khách hàng kiểm tra hàng hóa, đồng kiểm cùng shipper và nhận hàng.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Hotline hỗ trợ: <strong className="text-slate-900">1900 6868</strong>
          </span>
          <button
            className="h-9 px-4 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}
