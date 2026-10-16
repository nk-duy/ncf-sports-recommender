import React from "react";
import { Truck, Sparkles, BadgePercent } from "lucide-react";
import { formatVND, SHIPPING_OPTIONS } from "@/shared/lib/cart";

interface CartSummaryProps {
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  shipping_id: string;
  setField: (field: any, value: string) => void;
  voucherDiscount: number;
  appliedVoucher: any;
  finalTotal: number;
  totalSavings: number;
  promoSavings: number;
}

export function CartSummary({
  totalCount,
  subtotal,
  shippingFee,
  shipping_id,
  setField,
  voucherDiscount,
  appliedVoucher,
  finalTotal,
  totalSavings,
  promoSavings
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính ({totalCount} sản phẩm)</span>
          <span className="font-medium text-gray-900">{formatVND(subtotal)}</span>
        </div>

        <div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="flex items-center gap-1.5">
              <Truck size={15} className="text-blue-600" />
              Phí vận chuyển (ước tính)
            </span>
            <div className="text-right">
              {subtotal >= 500000 && shippingFee === 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 line-through">30.000đ</span>
                  <span className="font-bold text-green-600 uppercase text-xs bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                    Miễn Phí
                  </span>
                </div>
              ) : subtotal >= 500000 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 line-through">60.000đ</span>
                  <span className="font-medium text-gray-900">{formatVND(shippingFee)}</span>
                </div>
              ) : (
                <span className="font-medium text-gray-900">{formatVND(shippingFee)}</span>
              )}
            </div>
          </div>
          <select
            value={shipping_id}
            onChange={(e) => setField('shipping_id', e.target.value)}
            className="mt-2 w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
          >
            {SHIPPING_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {formatVND(o.price)} · {o.eta}
              </option>
            ))}
          </select>
          {subtotal >= 500000 && (
            <p className="text-[11px] text-green-600 font-medium mt-1 flex items-center gap-1">
              <Sparkles size={13} className="shrink-0" />
              Đơn trên 500k đã được áp dụng giảm 30.000đ phí vận chuyển!
            </p>
          )}
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Giảm giá voucher ({appliedVoucher?.code})</span>
            <span className="font-medium text-green-600">- {formatVND(voucherDiscount)}</span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-end">
          <span className="font-semibold text-gray-900">Tổng cộng</span>
          <span className="text-2xl font-bold text-blue-600 leading-none">{formatVND(finalTotal)}</span>
        </div>

        {totalSavings > 0 && (
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-2 flex items-start gap-1.5">
            <BadgePercent size={15} className="shrink-0 text-green-600 mt-0.5" />
            <span>
              Bạn tiết kiệm được <span className="font-bold">{formatVND(totalSavings)}</span>
              {promoSavings > 0 && voucherDiscount > 0
                ? ` (khuyến mãi ${formatVND(promoSavings)} + voucher ${formatVND(voucherDiscount)})`
                : promoSavings > 0
                ? ' nhờ giá khuyến mãi'
                : ' nhờ voucher'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
