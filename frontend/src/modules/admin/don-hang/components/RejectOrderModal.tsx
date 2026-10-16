'use client';
import React from 'react';
import { AlertTriangle, X, XCircle } from 'lucide-react';

interface RejectOrderModalProps {
  order: any | null;
  onClose: () => void;
  selectedRejectPreset: string;
  setSelectedRejectPreset: (preset: string) => void;
  customRejectReason: string;
  setCustomRejectReason: (reason: string) => void;
  onConfirmReject: () => void;
}

const PRESET_REASONS = [
  'Hết hàng tồn kho / Tạm ngừng kinh doanh mẫu',
  'Không thể liên lạc qua số điện thoại khách hàng',
  'Khách hàng yêu cầu hủy đơn hàng',
  'Địa chỉ giao hàng không hợp lệ hoặc quá xa',
  'Nghi ngờ đơn hàng spam / thông tin không chính xác',
  'Khác',
];

export default function RejectOrderModal({
  order,
  onClose,
  selectedRejectPreset,
  setSelectedRejectPreset,
  customRejectReason,
  setCustomRejectReason,
  onConfirmReject,
}: RejectOrderModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-red-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Từ chối đơn hàng</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">#{order._id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Vui lòng chọn hoặc nhập lý do từ chối đơn hàng của khách hàng{' '}
            <strong className="text-gray-900">{order.customer_name}</strong>:
          </p>

          {/* Preset Reason Options */}
          <div className="space-y-2">
            {PRESET_REASONS.map((preset) => (
              <label
                key={preset}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition ${
                  selectedRejectPreset === preset
                    ? 'bg-red-50/80 border-red-300 text-red-900 font-semibold shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="rejectPreset"
                  checked={selectedRejectPreset === preset}
                  onChange={() => setSelectedRejectPreset(preset)}
                  className="text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span>{preset}</span>
              </label>
            ))}
          </div>

          {/* Custom text area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              {selectedRejectPreset === 'Khác'
                ? 'Nhập chi tiết lý do từ chối *'
                : 'Ghi chú bổ sung (tùy chọn)'}
            </label>
            <textarea
              rows={3}
              value={customRejectReason}
              onChange={(e) => setCustomRejectReason(e.target.value)}
              placeholder={
                selectedRejectPreset === 'Khác'
                  ? 'Nhập lý do chi tiết để thông báo cho khách hàng...'
                  : 'Thêm ghi chú nếu cần thiết (ví dụ: gọi 3 cuộc không nghe máy)...'
              }
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-100 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirmReject}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-bold text-sm transition shadow-sm flex items-center gap-2"
          >
            <XCircle size={16} />
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
