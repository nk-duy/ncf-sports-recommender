'use client';

import { useState, useEffect, useCallback } from 'react';
import { PromoProductItem } from '../types';

export function useAdminPromoProducts() {
  const [promoProducts, setPromoProducts] = useState<PromoProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PromoProductItem | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);

  const [allProducts, setAllProducts] = useState<PromoProductItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const fetchPromoProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/products?limit=100&is_promotion=true&include_hidden=true'
      );
      const data: unknown = await res.json();
      setPromoProducts(Array.isArray(data) ? (data as PromoProductItem[]) : []);
    } catch {
      setPromoProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/products?limit=100&include_hidden=true'
      );
      const data: unknown = await res.json();
      setAllProducts(Array.isArray(data) ? (data as PromoProductItem[]) : []);
    } catch {
      setAllProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchPromoProducts();
    fetchAllProducts();
  }, [fetchPromoProducts, fetchAllProducts]);

  const handleExportExcel = () => {
    if (!promoProducts.length) {
      alert('Không có sản phẩm khuyến mãi nào để xuất.');
      return;
    }
    const headers = [
      'Sản phẩm',
      'Mã ASIN',
      'Giá gốc',
      'Phần trăm giảm',
      'Giá sau giảm',
      'Trạng thái',
    ];
    const rows = promoProducts.map((p) => [
      `"${(p.title || p.name || '').replace(/"/g, '""')}"`,
      p.asin || p.product_id || '',
      p.price || 0,
      `${p.discount_percent || 0}%`,
      Math.round((p.price || 0) * (1 - (p.discount_percent || 0) / 100)),
      p.is_active ? 'Đang áp dụng' : 'Tạm dừng',
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `sp_khuyen_mai_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemovePromotion = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khuyến mãi của sản phẩm này?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discount_percent: 0 }),
      });
      if (res.ok) {
        setPromoProducts((prev) => prev.filter((p) => p.product_id !== id));
        fetchAllProducts();
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleEdit = (product: PromoProductItem) => {
    setEditingProduct(product);
    setDiscountValue(product.discount_percent || 0);
    setIsModalOpen(true);
  };

  const handleUpdateDiscount = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/products/${editingProduct.product_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discount_percent: Number(discountValue) }),
        }
      );
      if (res.ok) {
        setIsModalOpen(false);
        fetchPromoProducts();
      } else {
        alert('Cập nhật thất bại');
      }
    } catch {
      alert('Lỗi kết nối');
    }
  };

  const handleAddPromotion = async () => {
    if (!selectedProductId) {
      alert('Vui lòng chọn sản phẩm');
      return;
    }
    if (discountValue <= 0 || discountValue > 100) {
      alert('Phần trăm giảm giá phải từ 1 đến 100');
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/products/${selectedProductId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discount_percent: Number(discountValue) }),
        }
      );
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchPromoProducts();
        fetchAllProducts();
        setSelectedProductId('');
        setDiscountValue(0);
      } else {
        alert('Thêm khuyến mãi thất bại');
      }
    } catch {
      alert('Lỗi kết nối');
    }
  };

  const openAddModal = () => {
    setDiscountValue(0);
    setSelectedProductId('');
    setAddSearchQuery('');
    setIsAddModalOpen(true);
  };

  const filteredPromoProducts = promoProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hiển thị toàn bộ sản phẩm phù hợp chưa có giảm giá
  const searchFilteredAvailable = allProducts
    .filter((p) => !p.discount_percent || p.discount_percent === 0)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(addSearchQuery.toLowerCase()) ||
        p.product_id.toLowerCase().includes(addSearchQuery.toLowerCase())
    );

  return {
    promoProducts,
    loading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    discountValue,
    setDiscountValue,
    isAddModalOpen,
    setIsAddModalOpen,
    addSearchQuery,
    setAddSearchQuery,
    selectedProductId,
    setSelectedProductId,
    filteredPromoProducts,
    searchFilteredAvailable,
    openAddModal,
    handleExportExcel,
    handleRemovePromotion,
    handleEdit,
    handleUpdateDiscount,
    handleAddPromotion,
  };
}
