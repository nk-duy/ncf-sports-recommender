import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVoucher?: any | null;
}

export default function VoucherFormModal({ isOpen, onClose, onSuccess, editingVoucher }: VoucherFormModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "fixed",
    discount_value: 0,
    max_discount: "",
    min_order_value: 0,
    usage_limit: "",
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingVoucher) {
      setFormData({
        code: editingVoucher.code || "",
        discount_type: editingVoucher.discount_type || "fixed",
        discount_value: editingVoucher.discount_value || 0,
        max_discount: editingVoucher.max_discount || "",
        min_order_value: editingVoucher.min_order_value || 0,
        usage_limit: editingVoucher.usage_limit || "",
        is_active: editingVoucher.is_active !== undefined ? editingVoucher.is_active : true
      });
    } else {
      setFormData({
        code: "",
        discount_type: "fixed",
        discount_value: 0,
        max_discount: "",
        min_order_value: 0,
        usage_limit: "",
        is_active: true
      });
    }
  }, [editingVoucher, isOpen]);

  if (!isOpen) return null;

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
      is_active: formData.is_active
    };

    try {
      const url = editingVoucher 
        ? `http://localhost:8000/api/v1/vouchers/${editingVoucher._id}`
        : `http://localhost:8000/api/v1/vouchers/`;
      const method = editingVoucher ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        notifications.show({ title: 'Thành công', message: 'Lưu voucher thành công!', color: 'green' });
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        notifications.show({ title: 'Lỗi', message: errorData.detail || 'Có lỗi xảy ra', color: 'red' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Không thể kết nối tới server', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="voucher-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher (Code)</label>
              <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border rounded-md" placeholder="VD: FREESHIP, SALE20" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
              <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                <option value="fixed">Giảm tiền mặt (VNĐ)</option>
                <option value="percent">Giảm phần trăm (%)</option>
                <option value="freeship">Miễn phí vận chuyển</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
              <input required type="number" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" placeholder="VD: 20000 hoặc 10" />
            </div>

            {formData.discount_type === 'percent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (VNĐ)</label>
                <input type="number" value={formData.max_discount} onChange={e => setFormData({...formData, max_discount: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="Không bắt buộc" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VNĐ)</label>
              <input required type="number" value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" placeholder="VD: 150000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn số lượt dùng (Để trống = vô hạn)</label>
              <input type="number" value={formData.usage_limit} onChange={e => setFormData({...formData, usage_limit: e.target.value})} className="w-full px-3 py-2 border rounded-md" placeholder="Không bắt buộc" />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 accent-blue-600" />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Kích hoạt ngay</label>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Hủy</button>
          <button type="submit" form="voucher-form" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Đang lưu...' : 'Lưu Voucher'}
          </button>
        </div>
      </div>
    </div>
  );
}
