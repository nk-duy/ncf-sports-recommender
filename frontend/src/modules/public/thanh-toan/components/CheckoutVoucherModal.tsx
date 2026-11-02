'use client';

import { Ticket, X } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { describeVoucher, formatVND, getVoucherError, type Voucher } from '@/shared/lib/cart';

interface CheckoutVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableVouchers: Voucher[];
  appliedVoucher: Voucher | null;
  total: number;
  onSelectVoucher: (voucher: Voucher) => void;
}

export default function CheckoutVoucherModal({
  isOpen,
  onClose,
  availableVouchers,
  appliedVoucher,
  total,
  onSelectVoucher,
}: CheckoutVoucherModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
            <Ticket className="text-blue-600" size={20} />
            <span>Chọn Voucher KADY</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {availableVouchers.map((v) => {
            const error = getVoucherError(v, total);
            const isApplied = appliedVoucher?.code === v.code;
            const missing = v.min_order_value ? v.min_order_value - total : 0;

            return (
              <div
                key={v.code}
                className={`rounded-xl border p-4 transition-all flex items-start justify-between gap-3 ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : error
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-blue-200 bg-blue-50/30 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-blue-700 text-sm tracking-wider">{v.code}</span>
                    {isApplied && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Đang dùng
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mt-1">{describeVoucher(v)}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {v.min_order_value
                      ? `Đơn tối thiểu ${formatVND(v.min_order_value)}`
                      : 'Không yêu cầu đơn tối thiểu'}
                  </p>
                  {missing > 0 && total > 0 && (
                    <p className="text-[11px] text-amber-600 font-medium mt-1">
                      Cần mua thêm {formatVND(missing)} để sử dụng
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isApplied || Boolean(error)}
                  onClick={() => {
                    onSelectVoucher(v);
                    onClose();
                    notifications.show({
                      title: 'Áp dụng thành công',
                      message: `${v.code}: ${describeVoucher(v)}`,
                      color: 'green',
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : error
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm shadow-blue-200'
                  }`}
                >
                  {isApplied ? 'Đã chọn' : 'Áp dụng'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
