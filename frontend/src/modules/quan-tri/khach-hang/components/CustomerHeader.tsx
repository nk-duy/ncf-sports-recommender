"use client";

import React from "react";
import { Download, Megaphone, Plus } from "lucide-react";

interface CustomerHeaderProps {
  onExportExcel: () => void;
  onOpenSendVoucher: () => void;
  onOpenAddCustomer: () => void;
}

export default function CustomerHeader({
  onExportExcel,
  onOpenSendVoucher,
  onOpenAddCustomer,
}: CustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold tracking-tight">
            Danh sách Khách hàng &amp; Phân hạng Hội viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông tin tài khoản, lịch sử mua hàng thể thao, phân nhóm RFM và gắn thẻ sở thích bộ môn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={onExportExcel}
            className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer"
            title="Xuất danh sách khách hàng ra file Excel (.csv)"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={onOpenSendVoucher}
            className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs transition cursor-pointer"
          >
            <Megaphone size={16} className="text-blue-600" />
            <span>Gửi thông báo / Voucher</span>
          </button>
          <button
            onClick={onOpenAddCustomer}
            className="flex items-center justify-center gap-2 h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm khách hàng mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
