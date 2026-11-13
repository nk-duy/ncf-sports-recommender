"use client";

import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { VoucherItem } from "../types";
import { exportVouchersToExcel } from "../utils/exportVouchersExcel";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import { getAuthHeaders } from "@/shared/lib/authHeader";

export function useAdminVouchers() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);

  const fetchVouchers = useCallback(async () => {
    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/vouchers`, {
        headers: getAuthHeaders(),
      });
      const data: unknown = await res.json();
      setVouchers(Array.isArray(data) ? (data as VoucherItem[]) : []);
    } catch {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleCreate = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setVouchers((prev) => prev.filter((v) => v._id !== id));
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/vouchers/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (res.ok) {
        setVouchers((prev) =>
          prev.map((v) =>
            v._id === id ? { ...v, is_active: !currentStatus } : v
          )
        );
      } else {
        notifications.show({
          title: "Lỗi",
          message: "Không thể cập nhật trạng thái voucher",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Lỗi kết nối đến máy chủ",
        color: "red",
      });
    }
  };

  const handleExportExcel = () => {
    exportVouchersToExcel(vouchers);
  };

  return {
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
  };
}
