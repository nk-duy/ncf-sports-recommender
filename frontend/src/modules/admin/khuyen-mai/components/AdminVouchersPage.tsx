"use client";

import VoucherTable from "@/modules/admin/khuyen-mai/components/VoucherTable";
import VoucherFormModal from "@/modules/admin/khuyen-mai/components/VoucherFormModal";
import {
  Download,
  Plus,
  Ticket,
  CheckCircle2,
  PauseCircle,
  TrendingUp,
} from "lucide-react";
import { useAdminVouchers } from "../hooks/useAdminVouchers";

export default function AdminVouchersPage() {
  const {
    vouchers,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingVoucher,
    fetchVouchers,
    handleCreate,
    handleEdit,
    handleDelete,
    handleStatusToggle,
    handleExportExcel,
  } = useAdminVouchers();

  return (
    <div className="flex flex-col gap-6 w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản lý Kho Voucher
          </h1>
          <p className="text-sm text-gray-500">
            Tạo, chỉnh sửa và theo dõi các chiến dịch khuyến mãi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            title="Xuất danh sách voucher ra file Excel (.xls)"
            className="h-10 px-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-2xs inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={handleCreate}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-2xs hover:shadow-xs transition inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Tạo Voucher mới</span>
          </button>
        </div>
      </div>

      {/* 4 Standardized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số Voucher
            </span>
            <span className="text-2xl font-black text-gray-900">
              {vouchers.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Đang hoạt động
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {vouchers.filter((v) => v.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Đã tạm dừng
            </span>
            <span className="text-2xl font-black text-amber-500">
              {vouchers.filter((v) => !v.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PauseCircle size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng lượt dùng
            </span>
            <span className="text-2xl font-black text-purple-600">
              {vouchers.reduce((acc, curr) => acc + (curr.used_count || 0), 0)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center">Đang tải dữ liệu...</div>
      ) : (
        <VoucherTable
          vouchers={vouchers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onStatusToggle={handleStatusToggle}
        />
      )}

      <VoucherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVouchers}
        editingVoucher={editingVoucher}
      />
    </div>
  );
}
