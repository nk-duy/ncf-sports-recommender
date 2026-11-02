'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2, ShieldCheck, ShoppingBag, Tag, Ticket, X } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import type { CartItem } from '@/shared/store/cartStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import {
  API_BASE,
  describeVoucher,
  fetchVoucherByCode,
  formatVND,
  getVoucherError,
  type Voucher,
} from '@/shared/lib/cart';
import CheckoutItemsCollapsible from './CheckoutItemsCollapsible';
import CheckoutVoucherModal from './CheckoutVoucherModal';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  total: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  loading: boolean;
  onPlaceOrder: () => void;
}

export default function CheckoutOrderSummary({
  items,
  total,
  shippingFee,
  discountAmount,
  finalTotal,
  loading,
  onPlaceOrder,
}: CheckoutOrderSummaryProps) {
  const { appliedVoucher, setAppliedVoucher } = useCheckoutStore();
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const voucherError = appliedVoucher ? getVoucherError(appliedVoucher, total) : null;

  useEffect(() => {
    fetch(`${API_BASE}/vouchers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Voucher[]) => {
        if (Array.isArray(data)) {
          setAvailableVouchers(data.filter((v) => getVoucherError(v, Number.MAX_SAFE_INTEGER) === null));
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      notifications.show({ title: 'Chưa nhập mã', message: 'Vui lòng nhập mã voucher.', color: 'orange' });
      return;
    }

    setIsApplyingVoucher(true);
    try {
      const voucher = await fetchVoucherByCode(voucherCode);
      const error = getVoucherError(voucher, total);
      if (error) {
        notifications.show({ title: 'Không thể dùng', message: error, color: 'red' });
        return;
      }
      setAppliedVoucher(voucher);
      setVoucherCode('');
      notifications.show({
        title: 'Áp dụng thành công',
        message: `${voucher.code}: ${describeVoucher(voucher)}`,
        color: 'green',
      });
    } catch (error: unknown) {
      const message = error instanceof Error && error.message ? error.message : 'Mã giảm giá không tồn tại.';
      notifications.show({ title: 'Lỗi', message, color: 'red' });
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-gray-900">Đơn hàng ({totalQuantity} món)</h2>
        </div>
        <Link
          href="/gio-hang"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Sửa giỏ hàng
        </Link>
      </div>

      {/* Product List */}
      <CheckoutItemsCollapsible
        items={items}
        isExpanded={isItemsExpanded}
        onToggle={() => setIsItemsExpanded(!isItemsExpanded)}
      />

      {/* Voucher Input & Selector */}
      <div className="pt-3 border-t border-gray-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-700">
            <Ticket size={15} className="text-blue-600" />
            <span>Mã ưu đãi / Voucher KADY</span>
          </div>

          {availableVouchers.length > 0 && (
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Tag size={12} />
              <span>Chọn mã ({availableVouchers.length})</span>
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleApplyVoucher()}
            placeholder="Nhập mã voucher"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-colors"
          />
          <button
            type="button"
            onClick={() => void handleApplyVoucher()}
            disabled={isApplyingVoucher || !voucherCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1"
          >
            {isApplyingVoucher && <Loader2 size={12} className="animate-spin" />}
            <span>Áp dụng</span>
          </button>
        </div>

        {appliedVoucher && (
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
              voucherError
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Check size={14} className="text-emerald-600 shrink-0" />
              <div className="truncate">
                <strong>{appliedVoucher.code}</strong>: {describeVoucher(appliedVoucher)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAppliedVoucher(null)}
              className="text-gray-400 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer shrink-0 ml-2"
              title="Gỡ bỏ voucher"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <span>Tạm tính tiền hàng:</span>
          <span className="font-semibold text-gray-900 tabular-nums">{formatVND(total)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Phí giao hàng:</span>
          <div>
            {total >= 500000 && shippingFee === 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 line-through tabular-nums">30.000đ</span>
                <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px]">
                  Miễn phí
                </span>
              </div>
            ) : total >= 500000 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 line-through tabular-nums">60.000đ</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatVND(shippingFee)}</span>
              </div>
            ) : (
              <span className="font-semibold text-gray-900 tabular-nums">{formatVND(shippingFee)}</span>
            )}
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
            <span className="font-medium">Giảm giá voucher ({appliedVoucher?.code}):</span>
            <span className="font-bold tabular-nums">- {formatVND(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-dashed border-gray-200">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
            <span className="text-2xl font-black text-blue-600 tracking-tight tabular-nums">
              {formatVND(finalTotal)}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 text-right">Đã bao gồm VAT &amp; phí vận chuyển</p>
        </div>
      </div>

      {/* Primary CTA Submit Button */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={loading || items.length === 0}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-base tracking-wide transition-colors transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang xử lý đơn hàng...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={19} />
              <span>Xác Nhận Đặt Hàng</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Nhấn &quot;Xác Nhận Đặt Hàng&quot; đồng nghĩa với việc bạn đồng ý với{' '}
          <Link href="/chinh-sach" className="text-blue-600 hover:underline">
            Điều khoản KADY
          </Link>
        </p>
      </div>

      <CheckoutVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        availableVouchers={availableVouchers}
        appliedVoucher={appliedVoucher}
        total={total}
        onSelectVoucher={setAppliedVoucher}
      />
    </div>
  );
}
