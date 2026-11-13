"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { getAuthHeaders } from "@/shared/lib/authHeader";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import { VoucherItem } from "../types";

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVoucher?: VoucherItem | null;
}

function buildInitialForm(editingVoucher?: VoucherItem | null) {
  if (editingVoucher) {
    return {
      code: editingVoucher.code || "",
      discount_type: editingVoucher.discount_type || "fixed",
      discount_value: editingVoucher.discount_value || 0,
      max_discount:
        editingVoucher.max_discount !== null &&
        editingVoucher.max_discount !== undefined
          ? String(editingVoucher.max_discount)
          : "",
      min_order_value: editingVoucher.min_order_value || 0,
      usage_limit:
        editingVoucher.usage_limit !== null &&
        editingVoucher.usage_limit !== undefined
          ? String(editingVoucher.usage_limit)
          : "",
      valid_from: editingVoucher.valid_from
        ? new Date(editingVoucher.valid_from).toISOString().substring(0, 16)
        : "",
      valid_until: editingVoucher.valid_until
        ? new Date(editingVoucher.valid_until).toISOString().substring(0, 16)
        : "",
      applicable_categories: editingVoucher.applicable_categories || [],
      is_active:
        editingVoucher.is_active !== undefined ? editingVoucher.is_active : true,
    };
  }
  return {
    code: "",
    discount_type: "fixed",
    discount_value: 0,
    max_discount: "",
    min_order_value: 0,
    usage_limit: "",
    valid_from: "",
    valid_until: "",
    applicable_categories: [] as string[],
    is_active: true,
  };
}

function VoucherFormModalInner({
  onClose,
  onSuccess,
  editingVoucher,
}: Omit<VoucherFormModalProps, "isOpen">) {
  const [formData, setFormData] = useState(() => buildInitialForm(editingVoucher));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      min_order_value: Number(formData.min_order_value),
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      valid_from: formData.valid_from
        ? new Date(formData.valid_from).toISOString()
        : null,
      valid_until: formData.valid_until
        ? new Date(formData.valid_until).toISOString()
        : null,
      applicable_categories: formData.applicable_categories,
      is_active: formData.is_active,
    };

    try {
      const apiUrl = resolveApiBaseUrl();
      const url = editingVoucher
        ? `${apiUrl}/vouchers/${editingVoucher._id}`
        : `${apiUrl}/vouchers`;
      const method = editingVoucher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Lưu voucher thành công!",
          color: "green",
        });
        onSuccess();
        onClose();
      } else {
        const errorData: { detail?: string } = await res.json();
        notifications.show({
          title: "Lỗi",
          message: errorData.detail || "Có lỗi xảy ra",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Không thể kết nối tới server",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            {editingVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form
            id="voucher-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mã Voucher (Code) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="VD: FREESHIP, SALE20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại giảm giá
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) =>
                  setFormData({ ...formData, discount_type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="fixed">Giảm tiền mặt (VNĐ)</option>
                <option value="percent">Giảm phần trăm (%)</option>
                <option value="freeship">Miễn phí vận chuyển</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Áp dụng cho loại sản phẩm
              </label>
              <select
                value={
                  formData.applicable_categories.length > 0
                    ? formData.applicable_categories[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applicable_categories: e.target.value ? [e.target.value] : [],
                  })
                }
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Tất cả các sản phẩm</option>
                <optgroup label="Môn thể thao">
                  <option value="Pickleball">Pickleball</option>
                  <option value="Bóng chuyền">Bóng chuyền</option>
                  <option value="Chạy bộ">Chạy bộ</option>
                </optgroup>
                <optgroup label="Loại hàng">
                  <option value="Quần áo">Quần áo</option>
                  <option value="Giày dép">Giày dép</option>
                  <option value="Thiết bị">Thiết bị &amp; Phụ kiện</option>
                </optgroup>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Giá trị giảm <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_value: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="VD: 20000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  value={formData.max_discount}
                  onChange={(e) =>
                    setFormData({ ...formData, max_discount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Để trống nếu = 0"
                  disabled={formData.discount_type !== "percent"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Đơn tối thiểu (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_value: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="VD: 150000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Giới hạn số lượt dùng
                </label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, usage_limit: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Để trống = vô hạn"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={formData.valid_from}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_from: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_until: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 -mt-2">
              Lưu ý: Để trống Thời gian nếu muốn Voucher có hiệu lực vĩnh viễn.
            </p>

            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 accent-blue-600 rounded border-gray-300"
              />
              <label
                htmlFor="is_active"
                className="text-sm font-bold text-gray-700 cursor-pointer"
              >
                Kích hoạt chiến dịch ngay lập tức
              </label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="voucher-form"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? "Đang lưu..." : editingVoucher ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VoucherFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingVoucher,
}: VoucherFormModalProps) {
  if (!isOpen) return null;
  return (
    <VoucherFormModalInner
      key={editingVoucher?._id ?? "new"}
      onClose={onClose}
      onSuccess={onSuccess}
      editingVoucher={editingVoucher}
    />
  );
}
