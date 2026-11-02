import { ArrowRight, Award, BadgePercent, RefreshCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { formatVND, SHIPPING_OPTIONS, type Voucher } from '@/shared/lib/cart';
import type { CheckoutTextField } from '@/shared/store/checkoutStore';

interface CartSummaryProps {
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  shipping_id: string;
  setField: (field: CheckoutTextField, value: string) => void;
  voucherDiscount: number;
  appliedVoucher: Voucher | null;
  finalTotal: number;
  totalSavings: number;
  promoSavings: number;
  onCheckout?: () => void;
  canCheckout?: boolean;
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
  promoSavings,
  onCheckout,
  canCheckout = true,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 sticky top-24">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Tóm tắt đơn hàng</h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 tabular-nums">
          {totalCount} sản phẩm đã chọn
        </span>
      </div>

      <div className="space-y-3 text-sm">
        {/* Tạm tính */}
        <div className="flex justify-between text-gray-600">
          <span>Tiền hàng</span>
          <span className="font-semibold text-gray-900 tabular-nums">{formatVND(subtotal)}</span>
        </div>

        {/* Phí vận chuyển ước tính */}
        <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center text-gray-700 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <Truck size={15} className="text-blue-600" />
              Phương thức giao hàng
            </span>
            <div className="text-right">
              {subtotal >= 500000 && shippingFee === 0 ? (
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="text-xs text-gray-400 line-through">30.000đ</span>
                  <span className="font-bold text-xs bg-green-100/70 text-green-800 px-2 py-0.5 rounded-md border border-green-200">
                    Miễn Phí
                  </span>
                </div>
              ) : subtotal >= 500000 ? (
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="text-xs text-gray-400 line-through">60.000đ</span>
                  <span className="font-bold text-gray-900">{formatVND(shippingFee)}</span>
                </div>
              ) : (
                <span className="font-bold text-gray-900 tabular-nums">{formatVND(shippingFee)}</span>
              )}
            </div>
          </div>
          <select
            value={shipping_id}
            onChange={(e) => setField('shipping_id', e.target.value)}
            className="w-full text-xs font-medium border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer shadow-xs"
          >
            {SHIPPING_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {formatVND(o.price)} ({o.eta})
              </option>
            ))}
          </select>
          {subtotal >= 500000 && (
            <p className="text-[11px] text-green-700 font-medium mt-2 flex items-center gap-1.5">
              <Sparkles size={13} className="shrink-0 text-green-600" />
              Đơn trên 500k: Giảm ngay 30.000đ phí giao hàng!
            </p>
          )}
        </div>

        {/* Giảm giá voucher */}
        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center text-gray-700 bg-green-50/60 px-3 py-2 rounded-lg border border-green-100">
            <span className="text-xs font-semibold text-green-800">
              Voucher áp dụng ({appliedVoucher?.code})
            </span>
            <span className="font-bold text-green-600 tabular-nums">- {formatVND(voucherDiscount)}</span>
          </div>
        )}

        {/* Tiết kiệm */}
        {totalSavings > 0 && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium p-3 flex items-start gap-2 shadow-xs">
            <BadgePercent size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            <div className="leading-relaxed">
              Bạn tiết kiệm được{' '}
              <strong className="font-bold text-emerald-700 tabular-nums">{formatVND(totalSavings)}</strong>
              {promoSavings > 0 && voucherDiscount > 0
                ? ` (khuyến mãi ${formatVND(promoSavings)} + voucher ${formatVND(voucherDiscount)})`
                : promoSavings > 0
                  ? ' từ ưu đãi giá gốc'
                  : ' từ voucher'}
            </div>
          </div>
        )}

        {/* Tổng thanh toán */}
        <div className="border-t border-dashed border-gray-200 pt-3.5 mt-2">
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-gray-900 text-sm sm:text-base">Tổng thanh toán:</span>
            <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight tabular-nums">
              {formatVND(finalTotal)}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 text-right">(Đã bao gồm VAT nếu có)</p>
        </div>

        {/* Direct Checkout CTA Button */}
        {onCheckout && (
          <button
            onClick={onCheckout}
            disabled={!canCheckout}
            className="w-full mt-2 h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 text-sm tracking-wide transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
          >
            <span>Tiến hành đặt hàng</span>
            <ArrowRight size={17} />
          </button>
        )}

        {/* Commitments strip */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <Award size={15} className="text-blue-600 shrink-0" />
            <span>100% Thể thao chính hãng bảo đảm</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <RefreshCcw size={15} className="text-emerald-600 shrink-0" />
            <span>Đổi size miễn phí trong 30 ngày tận nơi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <ShieldCheck size={15} className="text-amber-600 shrink-0" />
            <span>Đồng kiểm hàng trước khi thanh toán</span>
          </div>
        </div>
      </div>
    </div>
  );
}
