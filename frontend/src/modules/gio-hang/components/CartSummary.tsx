import React from "react";
import { Truck } from "lucide-react";
import { formatVND, SHIPPING_OPTIONS } from "@/shared/lib/cart";

interface CartSummaryProps {
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  shipping_id: string;
  setField: (field: string, value: string) => void;
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
            <span className="font-medium text-gray-900">{formatVND(shippingFee)}</span>
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
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-2">
            🎉 Bạn tiết kiệm được <span className="font-bold">{formatVND(totalSavings)}</span>
            {promoSavings > 0 && voucherDiscount > 0
              ? ` (khuyến mãi ${formatVND(promoSavings)} + voucher ${formatVND(voucherDiscount)})`
              : promoSavings > 0
              ? ' nhờ giá khuyến mãi'
              : ' nhờ voucher'}
          </div>
        )}
      </div>
    </div>
  );
}
