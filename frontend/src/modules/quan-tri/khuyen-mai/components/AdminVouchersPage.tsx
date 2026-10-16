"use client";

import React, { useState, useEffect } from "react";
import VoucherTable from "@/modules/quan-tri/khuyen-mai/components/VoucherTable";
import VoucherFormModal from "@/modules/quan-tri/khuyen-mai/components/VoucherFormModal";
import { Download, Plus, Ticket, CheckCircle2, PauseCircle, TrendingUp } from "lucide-react";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/vouchers');
      const data = await res.json();
      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: any) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setVouchers(vouchers.filter(v => v._id !== id));
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/vouchers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) {
        setVouchers(vouchers.map(v => v._id === id ? { ...v, is_active: !currentStatus } : v));
      } else {
        alert("Không thể cập nhật trạng thái");
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  const handleExportExcel = () => {
    if (!vouchers.length) {
      alert("Không có voucher nào để xuất.");
      return;
    }
    const headers = [
      "Mã Voucher",
      "Tiêu đề",
      "Loại giảm giá",
      "Giá trị giảm",
      "Giảm tối đa (đ)",
      "Đơn tối thiểu (đ)",
      "Lượt đã dùng",
      "Giới hạn sử dụng",
      "Trạng thái",
      "Ngày bắt đầu",
      "Ngày hết hạn",
    ];

    const rows = vouchers.map((v) => [
      v.code || "",
      `"${(v.title || "").replace(/"/g, '""')}"`,
      v.discount_type === "percent" ? "Phần trăm" : "Cố định",
      v.discount_value || 0,
      v.max_discount || 0,
      v.min_order_value || 0,
      v.used_count || 0,
      v.usage_limit || "Không giới hạn",
      v.is_active ? "Đang hoạt động" : "Đã tạm dừng",
      v.start_date ? new Date(v.start_date).toLocaleDateString("vi-VN") : "",
      v.end_date ? new Date(v.end_date).toLocaleDateString("vi-VN") : "",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_voucher_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Kho Voucher</h1>
          <p className="text-sm text-gray-500">Tạo, chỉnh sửa và theo dõi các chiến dịch khuyến mãi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="h-10 px-3.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-2xs inline-flex items-center gap-2 transition"
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
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng số Voucher</span>
            <span className="text-2xl font-black text-gray-900">{vouchers.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đang hoạt động</span>
            <span className="text-2xl font-black text-emerald-600">
              {vouchers.filter(v => v.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đã tạm dừng</span>
            <span className="text-2xl font-black text-amber-500">
              {vouchers.filter(v => !v.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <PauseCircle size={20} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng lượt dùng</span>
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
