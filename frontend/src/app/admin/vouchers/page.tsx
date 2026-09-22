import React from "react";
import VoucherTable from "@/modules/admin/vouchers/components/VoucherTable";
import vouchersData from "@/data/vouchers.json";

export default function AdminVouchersPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý Kho Voucher</h1>
        <p className="text-sm text-gray-500">Tạo, chỉnh sửa và theo dõi các chiến dịch khuyến mãi.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng số Voucher</span>
          <span className="text-2xl font-black text-blue-600">{vouchersData.length}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đang hoạt động</span>
          <span className="text-2xl font-black text-green-600">
            {vouchersData.filter(v => v.status === 'active').length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đã tạm dừng</span>
          <span className="text-2xl font-black text-amber-500">
            {vouchersData.filter(v => v.status === 'inactive').length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng lượt sử dụng</span>
          <span className="text-2xl font-black text-purple-600">
            {vouchersData.reduce((acc, curr) => acc + curr.usedCount, 0)}
          </span>
        </div>
      </div>

      <VoucherTable vouchers={vouchersData} />
    </div>
  );
}
