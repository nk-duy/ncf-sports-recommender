'use client';
import React, { useEffect, useState } from "react";
import { Ticket, X, Check, Loader2 } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useCheckoutStore } from "@/shared/store/checkoutStore";
import {
  API_BASE,
  Voucher,
  describeVoucher,
  fetchVoucherByCode,
  formatVND,
  getVoucherError,
} from "@/shared/lib/cart";

/** Ô nhập mã + danh sách voucher khả dụng ở trang giỏ hàng */
export default function CartVoucherBox({ subtotal }: { subtotal: number }) {
  const { appliedVoucher, setAppliedVoucher } = useCheckoutStore();
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [available, setAvailable] = useState<Voucher[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/vouchers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Voucher[]) => {
        if (cancelled || !Array.isArray(data)) return;
        // Chỉ hiện voucher còn hiệu lực (bỏ qua điều kiện giá trị đơn tối thiểu để người dùng thấy cần mua thêm bao nhiêu)
        setAvailable(data.filter((v) => getVoucherError(v, Number.MAX_SAFE_INTEGER) === null));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const applyVoucher = async (rawCode: string) => {
    if (!rawCode.trim()) {
      notifications.show({ title: 'Chưa nhập mã', message: 'Vui lòng nhập mã giảm giá.', color: 'orange' });
      return;
    }
    if (subtotal <= 0) {
      notifications.show({
        title: 'Chưa chọn sản phẩm',
        message: 'Hãy chọn sản phẩm cần mua trước khi áp dụng voucher.',
        color: 'orange',
      });
      return;
    }
    setApplying(true);
    try {
      const voucher = await fetchVoucherByCode(rawCode);
      const error = getVoucherError(voucher, subtotal);
      if (error) {
        notifications.show({ title: 'Không thể áp dụng', message: error, color: 'red' });
        return;
      }
      setAppliedVoucher(voucher);
      setCode('');
      notifications.show({
        title: 'Áp dụng thành công',
        message: `${voucher.code}: ${describeVoucher(voucher)}`,
        color: 'green',
      });
    } catch (e: any) {
      notifications.show({ title: 'Lỗi', message: e?.message || 'Không thể kết nối đến máy chủ.', color: 'red' });
    } finally {
      setApplying(false);
    }
  };

  const appliedError = appliedVoucher ? getVoucherError(appliedVoucher, subtotal) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Ticket size={20} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Voucher KADY</h2>
      </div>

      {/* Voucher đang áp dụng */}
      {appliedVoucher && (
        <div
          className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${
            appliedError ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'
          }`}
        >
          <div className="text-sm">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              {!appliedError && <Check size={16} className="text-green-600" />}
              {appliedVoucher.code}
              <span className="font-medium text-gray-600">· {describeVoucher(appliedVoucher)}</span>
            </div>
            {appliedError && <div className="text-amber-700 text-xs mt-1">{appliedError}</div>}
          </div>
          <button
            type="button"
            onClick={() => setAppliedVoucher(null)}
            className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
            aria-label="Bỏ voucher"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Nhập mã */}
      <div className="flex">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyVoucher(code)}
          placeholder="Nhập mã giảm giá"
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-l-lg text-sm uppercase focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => applyVoucher(code)}
          disabled={applying}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-r-lg text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-1.5"
        >
          {applying && <Loader2 size={14} className="animate-spin" />}
          Áp dụng
        </button>
      </div>

      {/* Voucher khả dụng */}
      {available.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Voucher dành cho bạn</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {available.map((v) => {
              const error = getVoucherError(v, subtotal);
              const isApplied = appliedVoucher?.code === v.code;
              const missing = v.min_order_value ? v.min_order_value - subtotal : 0;
              return (
                <button
                  key={v.code}
                  type="button"
                  disabled={isApplied}
                  onClick={() => applyVoucher(v.code)}
                  className={`text-left rounded-lg border border-dashed px-3 py-2.5 transition-all ${
                    isApplied
                      ? 'border-green-400 bg-green-50 cursor-default'
                      : error
                      ? 'border-gray-300 bg-gray-50 opacity-70 hover:opacity-100'
                      : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-blue-700">{v.code}</span>
                    {isApplied && <span className="text-[11px] font-semibold text-green-600">Đang dùng</span>}
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">{describeVoucher(v)}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {v.min_order_value ? `Đơn tối thiểu ${formatVND(v.min_order_value)}` : 'Không yêu cầu đơn tối thiểu'}
                    {!isApplied && missing > 0 && subtotal > 0 && (
                      <span className="text-amber-600 font-medium"> · mua thêm {formatVND(missing)}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
