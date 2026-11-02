'use client';

import { CreditCard, ShieldCheck, User } from 'lucide-react';
import type { TrackedOrder } from '../types';

interface OrderRecipientGridProps {
  order: TrackedOrder;
}

export default function OrderRecipientGrid({ order }: OrderRecipientGridProps) {
  return (
    <div className="p-5 sm:p-6 bg-slate-50/40">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-1.5">
        <User size={15} className="text-blue-600" />
        Thông Tin Người Nhận &amp; Giao Vận
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
            Họ và tên
          </span>
          <span className="font-bold text-slate-900">{order.customer_name || 'Khách hàng'}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
            Số điện thoại
          </span>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {order.customer_phone || 'Chưa cập nhật'}
          </span>
        </div>

        <div className="sm:col-span-2 bg-white p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
            Địa chỉ nhận hàng
          </span>
          <span className="font-medium text-slate-800 leading-relaxed text-pretty">
            {order.customer_address || 'Chưa cập nhật'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
            Hình thức thanh toán
          </span>
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <CreditCard size={14} className="text-blue-600" />
            {order.payment_method || 'Thanh toán khi nhận hàng (COD)'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider mb-1">
            Trạng thái thanh toán
          </span>
          <span
            className={`inline-flex items-center gap-1.5 font-bold text-xs uppercase px-2 py-0.5 rounded-md ${
              order.payment_status === 'paid'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <ShieldCheck size={13} />
            {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </span>
        </div>
      </div>
    </div>
  );
}
