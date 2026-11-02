'use client';

import { CheckCircle, Clock, Headphones, MapPin, PhoneCall, Truck } from 'lucide-react';
import type { PublicOrderData } from '../../types';

export default function OrderMetadata({ order }: { order?: PublicOrderData | null }) {
  const customerName = order?.customer_name || 'Quý khách';
  const customerPhone = order?.customer_phone || 'Chưa cập nhật';
  const customerAddress = order?.customer_address || 'Chưa có địa chỉ';

  let paymentLabel = 'Thanh toán khi nhận hàng (COD)';
  if (order?.payment_method === 'BANK_TRANSFER' || order?.payment_method === 'banking') {
    paymentLabel = 'Chuyển khoản Ngân hàng';
  } else if (order?.payment_method === 'VNPAY') {
    paymentLabel = 'VNPAY-QR';
  } else if (order?.payment_method === 'momo' || order?.payment_method === 'MOMO') {
    paymentLabel = 'Ví MoMo';
  }

  const shippingMethod =
    order?.shipping_method ||
    (order?.shipping_fee === 60000
      ? 'Hỏa Tốc 24H'
      : order?.shipping_fee === 35000
        ? 'Giao Hàng Nhanh'
        : 'VNExpress Tiêu chuẩn');

  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Vừa xong';

  return (
    <div className="space-y-4">
      {/* 1. Recipient Information Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 print:border-slate-400 space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Địa chỉ nhận hàng</h3>
            <p className="text-[11px] text-slate-400">Thông tin giao nhận bưu phẩm</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm">
          <p className="font-bold text-slate-900">
            {customerName} <span className="font-normal text-slate-400">•</span>{' '}
            <span className="font-sans text-blue-600 font-semibold tabular-nums">{customerPhone}</span>
          </p>
          <p className="text-slate-600 leading-relaxed pt-0.5">{customerAddress}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/70 text-xs text-blue-800 flex items-center gap-2 font-medium">
          <Clock size={15} className="text-blue-600 shrink-0" />
          <span>Shipper sẽ liên hệ trước khi giao hàng 15-30 phút.</span>
        </div>
      </div>

      {/* 2. Shipping & Payment Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 print:border-slate-400 space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Truck size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Giao vận &amp; Thanh toán</h3>
            <p className="text-[11px] text-slate-400">Hình thức thanh toán và vận chuyển</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hình thức thanh toán:</span>
            <span className="font-semibold text-slate-900 text-right">{paymentLabel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Gói vận chuyển:</span>
            <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md text-xs">
              {shippingMethod}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Trạng thái đơn:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs">
              <CheckCircle size={12} />
              {order?.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Thời gian đặt:</span>
            <span className="font-sans text-slate-700 font-semibold text-xs tabular-nums">{orderDate}</span>
          </div>

          {order?.tracking_code && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Mã vận đơn:</span>
              <span className="font-sans font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-xs border border-indigo-200 tabular-nums">
                {order.carrier || 'GHN'}: {order.tracking_code}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Customer Care & Support */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Headphones size={20} className="text-blue-400 shrink-0" />
          <h4 className="font-bold text-sm">Hỗ trợ đơn hàng KADY 24/7</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Nếu cần thay đổi địa chỉ nhận hàng hoặc tư vấn thêm, vui lòng liên hệ trực tiếp tổng đài:
        </p>
        <div className="flex items-center justify-between pt-1">
          <a
            href="tel:19006868"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Hotline: 1900 6868</span>
          </a>
          <span className="text-[11px] text-slate-400 font-medium">Miễn phí cước gọi</span>
        </div>
      </div>
    </div>
  );
}
