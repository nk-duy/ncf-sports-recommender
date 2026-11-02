'use client';

import Link from 'next/link';
import { MessageCircle, ShoppingBag, Tag } from 'lucide-react';
import { formatOrderPrice, SPORTS_TRACKING_FALLBACK_IMG, type TrackedOrder } from '../types';

interface OrderItemsBreakdownProps {
  order: TrackedOrder;
}

export default function OrderItemsBreakdown({ order }: OrderItemsBreakdownProps) {
  return (
    <div className="p-5 sm:p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <ShoppingBag size={15} className="text-blue-600" />
          Chi Tiết Sản Phẩm ({order.items?.length || 0})
        </h3>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
        {order.items?.map((item, idx) => {
          const itemName = item.product_name || item.name || `Sản phẩm (${item.product_id})`;
          const itemTotal = (item.price || 0) * (item.quantity || 1);

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 relative">
                  <img
                    src={item.image_url || SPORTS_TRACKING_FALLBACK_IMG}
                    alt={itemName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = SPORTS_TRACKING_FALLBACK_IMG;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                    {itemName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    {(item.color || item.size) && (
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {[item.color, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' • ')}
                      </span>
                    )}
                    <span>
                      Số lượng: <strong className="text-slate-900 tabular-nums">{item.quantity}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Đơn giá:{' '}
                      <strong className="font-mono text-slate-700 tabular-nums">
                        {formatOrderPrice(item.price)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base tabular-nums">
                  {formatOrderPrice(itemTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Cost Breakdown */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs sm:text-sm">
        {order.subtotal !== undefined && (
          <div className="flex justify-between text-slate-600">
            <span>Tạm tính hàng hóa:</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {formatOrderPrice(order.subtotal)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển:</span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {order.shipping_fee && order.shipping_fee > 0
              ? formatOrderPrice(order.shipping_fee)
              : 'Miễn phí (Freeship)'}
          </span>
        </div>

        {order.discount_amount !== undefined && order.discount_amount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span className="flex items-center gap-1">
              <Tag size={14} /> Giảm giá {order.voucher_code ? `(${order.voucher_code})` : 'Voucher'}:
            </span>
            <span className="font-mono tabular-nums">-{formatOrderPrice(order.discount_amount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <span className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight">
            Tổng thanh toán:
          </span>
          <span className="text-lg sm:text-2xl font-black font-mono text-blue-600 tabular-nums">
            {formatOrderPrice(order.total_amount)}
          </span>
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <Link
          href="/san-pham"
          className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
        >
          <ShoppingBag size={14} />
          Tiếp tục mua sắm
        </Link>
        <a
          href="https://zalo.me/0988888888"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-colors text-xs"
        >
          <MessageCircle size={14} className="text-blue-500" />
          Cần hỗ trợ đơn hàng này?
        </a>
      </div>
    </div>
  );
}
