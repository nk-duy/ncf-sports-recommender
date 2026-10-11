"use client";

import React, { useState, useEffect } from "react";
import VoucherTable from "@/modules/quan-tri/khuyen-mai/components/VoucherTable";
import VoucherFormModal from "@/modules/quan-tri/khuyen-mai/components/VoucherFormModal";

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

  return (
    <div className="flex flex-col gap-6 w-full w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Kho Voucher</h1>
        <p className="text-sm text-gray-500">Tạo, chỉnh sửa và theo dõi các chiến dịch khuyến mãi.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng số Voucher</span>
          <span className="text-2xl font-black text-blue-600">{vouchers.length}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đang hoạt động</span>
          <span className="text-2xl font-black text-green-600">
            {vouchers.filter(v => v.is_active).length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đã tạm dừng</span>
          <span className="text-2xl font-black text-amber-500">
            {vouchers.filter(v => !v.is_active).length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng lượt sử dụng</span>
          <span className="text-2xl font-black text-purple-600">
            {vouchers.reduce((acc, curr) => acc + (curr.used_count || 0), 0)}
          </span>
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
