'use client';

import { Package, Tag } from 'lucide-react';
import type { PublicOrderData, PublicOrderItem } from '../../types';

const ORDER_SUMMARY_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';

export default function OrderSummary({ order }: { order?: PublicOrderData | null }) {
  const items: PublicOrderItem[] = order?.items || [];
  const subtotal = order?.subtotal || order?.total_amount || 0;
  const shippingFee = order?.shipping_fee || 0;
  const discountAmount = order?.discount_amount || 0;
  const voucherCode = order?.voucher_code;
  const totalAmount = order?.total_amount || subtotal;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const totalItemsCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 print:border-slate-400 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-blue-600 shrink-0" />
            <h2 className="text-base font-bold text-slate-900">Chi tiết sản phẩm đã đặt</h2>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full font-sans tabular-nums">
              {totalItemsCount} sản phẩm
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">KADY Official Store</span>
        </div>

        <div className="divide-y divide-slate-100">
          {items.length > 0 ? (
            items.map((item, idx) => {
              const itemPrice = item.price || 0;
              const itemQty = item.quantity || 1;
              const itemTotal = itemPrice * itemQty;
              return (
                <div key={idx} className="py-3.5 flex items-center gap-3.5 group">
                  <div className="size-16 rounded-lg bg-slate-50 shrink-0 overflow-hidden border border-slate-200/80 p-0.5 flex items-center justify-center">
                    <img
                      alt={item.product_name || 'Sản phẩm thể thao'}
                      className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                      src={item.image_url || ORDER_SUMMARY_FALLBACK_IMG}
                      onError={(e) => {
                        e.currentTarget.src = ORDER_SUMMARY_FALLBACK_IMG;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                      {item.product_name || item.name || `Sản phẩm (${item.product_id})`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      {(item.color || item.size) && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {[item.color, item.size ? `Size ${item.size}` : ''].filter(Boolean).join(' / ')}
                        </span>
                      )}
                      <span>
                        Số lượng:{' '}
                        <strong className="text-slate-800 font-bold font-sans tabular-nums">x{itemQty}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        Đơn giá:{' '}
                        <span className="font-sans tabular-nums font-medium">{formatPrice(itemPrice)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right whitespace-nowrap pl-2">
                    <span className="font-bold text-sm sm:text-base text-slate-900 font-sans tabular-nums">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-slate-500 font-medium">
              Đang tải danh sách sản phẩm...
            </div>
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Tạm tính tiền hàng:</span>
          <span className="font-semibold text-slate-900 font-sans tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600 items-center">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold text-slate-900 font-sans tabular-nums">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-xs">
                Miễn phí (Freeship)
              </span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium items-center">
            <span className="flex items-center gap-1.5">
              <Tag size={14} /> Giảm giá voucher {voucherCode ? `(${voucherCode})` : ''}:
            </span>
            <span className="font-bold font-sans tabular-nums">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline mt-2">
          <div>
            <span className="font-bold text-slate-900 text-base">Tổng cộng thanh toán:</span>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
              (Đã bao gồm VAT và toàn bộ chi phí giao vận)
            </p>
          </div>
          <span className="text-xl sm:text-2xl text-blue-600 font-bold font-sans tabular-nums">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
