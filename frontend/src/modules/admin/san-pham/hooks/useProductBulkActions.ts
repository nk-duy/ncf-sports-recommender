'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import type { AdminProductItem } from '../types';

export function useProductBulkActions(
  apiUrl: string,
  setProducts: React.Dispatch<React.SetStateAction<AdminProductItem[]>>
) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const handleToggleSelect = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleToggleSelectAll = (visibleProducts: AdminProductItem[]) => {
    const visibleIds = visibleProducts.map((p) => p.product_id);
    const allSelected = visibleIds.every((id) => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  const handleBulkHide = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ is_hidden: true }),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) => (selectedProductIds.includes(p.product_id) ? { ...p, is_hidden: true } : p))
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã tạm ẩn ${selectedProductIds.length} sản phẩm khỏi khách hàng`,
        color: 'teal',
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi thực hiện ẩn hàng loạt',
        color: 'red',
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkShow = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ is_hidden: false }),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          selectedProductIds.includes(p.product_id) ? { ...p, is_hidden: false } : p
        )
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã hiện bán lại ${selectedProductIds.length} sản phẩm trên cửa hàng`,
        color: 'green',
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi thực hiện mở bán hàng loạt',
        color: 'red',
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkSoftDelete = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ is_deleted: true }),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          selectedProductIds.includes(p.product_id) ? { ...p, is_deleted: true } : p
        )
      );
      notifications.show({
        title: 'Thùng rác',
        message: `Đã chuyển ${selectedProductIds.length} sản phẩm vào thùng rác`,
        color: 'orange',
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi chuyển vào thùng rác',
        color: 'red',
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ is_deleted: false }),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          selectedProductIds.includes(p.product_id) ? { ...p, is_deleted: false } : p
        )
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã khôi phục ${selectedProductIds.length} sản phẩm về kho`,
        color: 'green',
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi khôi phục sản phẩm',
        color: 'red',
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkApplyDiscount = async (discountPercent: number, endDate: string | null) => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${apiUrl}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
              discount_percent: discountPercent,
              discount_end_date: endDate,
            }),
          })
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          selectedProductIds.includes(p.product_id)
            ? { ...p, discount_percent: discountPercent, discount_end_date: endDate }
            : p
        )
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã áp dụng giảm giá ${discountPercent}% cho ${selectedProductIds.length} sản phẩm`,
        color: 'green',
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi cập nhật giảm giá hàng loạt',
        color: 'red',
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return {
    selectedProductIds,
    isBulkDiscountOpen,
    setIsBulkDiscountOpen,
    isBulkProcessing,
    handleToggleSelect,
    handleToggleSelectAll,
    handleClearSelection,
    handleBulkHide,
    handleBulkShow,
    handleBulkSoftDelete,
    handleBulkRestore,
    handleBulkApplyDiscount,
  };
}
