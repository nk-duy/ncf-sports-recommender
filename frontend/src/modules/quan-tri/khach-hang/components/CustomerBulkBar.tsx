"use client";

import React from "react";
import { CheckSquare, Gift, Download } from "lucide-react";

interface CustomerBulkBarProps {
  selectedCount: number;
  onSendVoucher: () => void;
  onExportExcel: () => void;
  onDeselectAll: () => void;
}

export default function CustomerBulkBar({
  selectedCount,
  onSendVoucher,
  onExportExcel,
  onDeselectAll,
}: CustomerBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-600 text-white rounded-xl px-5 py-3 shadow-lg flex items-center justify-between flex-wrap gap-3 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <CheckSquare size={18} />
        <span className="font-bold text-sm">
          Đã chọn {selectedCount} khách hàng
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSendVoucher}
          className="px-3 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Gift size={14} />
          <span>Gửi Voucher ({selectedCount})</span>
        </button>
        <button
          onClick={onExportExcel}
          className="px-3 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download size={14} />
          <span>Xuất Excel ({selectedCount})</span>
        </button>
        <button
          onClick={onDeselectAll}
          className="px-3 h-8 rounded-lg bg-black/20 hover:bg-black/30 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Bỏ chọn
        </button>
      </div>
    </div>
  );
}
