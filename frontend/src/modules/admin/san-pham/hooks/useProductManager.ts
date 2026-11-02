'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import type {
  AdminProductItem,
  ConfirmModalState,
  ProductSortConfig,
  ProductTabCounts,
  ProductTabType,
} from '../types';
import {
  filterAndSortProducts,
  getProductCategoryArray,
  mapProductTag,
} from '../utils/productHelpers';
import { exportProductsToExcel } from '../utils/exportProductsExcel';
import { useProductBulkActions } from './useProductBulkActions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export function useProductManager() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQueryState] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState<string>('');
  const [selectedBrand, setSelectedBrandState] = useState<string>('');
  const [selectedStockStatus, setSelectedStockStatusState] = useState<string>('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [activeTab, setActiveTabState] = useState<ProductTabType>('all');

  // Pagination & Sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<ProductSortConfig | null>(null);
  const itemsPerPage = 10;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [defaultNewSku, setDefaultNewSku] = useState<string>('KADY-100001');
  const [viewingProduct, setViewingProduct] = useState<AdminProductItem | null>(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] =
    useState<AdminProductItem | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountEndDate, setDiscountEndDate] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);

  const bulkActions = useProductBulkActions(API_URL, setProducts);

  const setSearchQuery = (q: string) => {
    setSearchQueryState(q);
    setCurrentPage(1);
  };
  const setSelectedCategory = (cat: string) => {
    setSelectedCategoryState(cat);
    setCurrentPage(1);
  };
  const setSelectedBrand = (brand: string) => {
    setSelectedBrandState(brand);
    setCurrentPage(1);
  };
  const setSelectedStockStatus = (status: string) => {
    setSelectedStockStatusState(status);
    setCurrentPage(1);
  };
  const setActiveTab = (tab: ProductTabType) => {
    setActiveTabState(tab);
    setCurrentPage(1);
  };

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/attributes`);
      if (res.ok) {
        const data = await res.json();
        if (data.brands && data.brands.length > 0) {
          setAvailableBrands(data.brands);
          return;
        }
      }
    } catch {
      // Fallback sang localStorage
    }
    const saved = localStorage.getItem('admin_brands');
    if (saved) setAvailableBrands(JSON.parse(saved));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/products?limit=1000&include_hidden=true&include_deleted=true`
      );
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi tải danh sách sản phẩm',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [fetchProducts, fetchBrands]);

  const handleDelete = async (id: string) => {
    try {
      const checkRes = await fetch(`${API_URL}/products/${id}/check-dependencies`, {
        headers: getAuthHeaders(),
      });
      if (checkRes.ok) {
        const depData = await checkRes.json();
        if (!depData.can_delete) {
          setConfirmModal({
            isOpen: true,
            title: 'Không thể xóa vĩnh viễn',
            message: depData.reason,
            isBlocked: true,
            aiWarning: depData.ai_warning,
            interactionCount: depData.interaction_count,
            orderCount: depData.order_count,
            reviewCount: depData.review_count,
            onConfirm: () => setConfirmModal(null),
          });
          return;
        }
      }

      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận xóa vĩnh viễn',
        message:
          'Sản phẩm này chưa phát sinh đơn hàng hay đánh giá nào. Bạn có chắc chắn muốn xóa vĩnh viễn khỏi hệ thống không?',
        isBlocked: false,
        onConfirm: async () => {
          setConfirmModal(null);
          try {
            const res = await fetch(`${API_URL}/products/${id}`, {
              method: 'DELETE',
              headers: getAuthHeaders(),
            });
            if (res.ok) {
              setProducts((prev) => prev.filter((p) => p.product_id !== id));
              notifications.show({
                title: 'Thành công',
                message: 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống',
                color: 'green',
              });
            } else {
              const err = await res.json().catch(() => null);
              notifications.show({
                title: 'Không thể xóa',
                message: err?.detail || 'Có lỗi xảy ra khi xóa',
                color: 'red',
              });
            }
          } catch {
            notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
          }
        },
      });
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể kiểm tra ràng buộc dữ liệu sản phẩm',
        color: 'red',
      });
    }
  };

  const handleToggleVisibility = async (product: AdminProductItem) => {
    try {
      const newStatus = !product.is_hidden;
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ is_hidden: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.product_id === product.product_id ? { ...p, is_hidden: newStatus } : p
          )
        );
        notifications.show({
          title: 'Thành công',
          message: 'Cập nhật trạng thái thành công',
          color: 'green',
        });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleSoftDelete = async (product: AdminProductItem) => {
    try {
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ is_deleted: true }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.product_id === product.product_id ? { ...p, is_deleted: true } : p))
        );
        notifications.show({
          title: 'Thành công',
          message: 'Đã chuyển sản phẩm vào thùng rác',
          color: 'green',
        });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleRestore = async (product: AdminProductItem) => {
    try {
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ is_deleted: false }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.product_id === product.product_id ? { ...p, is_deleted: false } : p))
        );
        notifications.show({
          title: 'Thành công',
          message: 'Khôi phục sản phẩm thành công',
          color: 'green',
        });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleUpdateDiscount = async () => {
    if (!selectedProductForDiscount) return;
    try {
      const isoEndDate = discountEndDate ? new Date(discountEndDate).toISOString() : null;
      const res = await fetch(`${API_URL}/products/${selectedProductForDiscount.product_id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          discount_percent: Number(discountValue),
          discount_end_date: isoEndDate,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.product_id === selectedProductForDiscount.product_id
              ? { ...p, discount_percent: Number(discountValue), discount_end_date: isoEndDate }
              : p
          )
        );
        notifications.show({
          title: 'Thành công',
          message: 'Đã cập nhật mức giảm giá!',
          color: 'green',
        });
        setIsDiscountModalOpen(false);
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const openDiscountModal = (product: AdminProductItem) => {
    setSelectedProductForDiscount(product);
    setDiscountValue(product.discount_percent || 0);
    setDiscountEndDate(product.discount_end_date ? product.discount_end_date.substring(0, 16) : '');
    setIsDiscountModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategoryState('');
    setSelectedBrandState('');
    setSelectedStockStatusState('');
    setSearchQueryState('');
    setCurrentPage(1);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setDefaultNewSku(`KADY-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsModalOpen(true);
  };

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      const rawTags = [p.product_type, p.sport_type, ...getProductCategoryArray(p)].filter(
        (t): t is string => Boolean(t)
      );
      rawTags.forEach((t) => cats.add(mapProductTag(t)));
    });
    return Array.from(cats).sort();
  }, [products]);

  const sortableProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        searchQuery,
        selectedCategory,
        selectedBrand,
        selectedStockStatus,
        activeTab,
        sortConfig,
      }),
    [products, searchQuery, selectedCategory, selectedBrand, selectedStockStatus, activeTab, sortConfig]
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const counts: ProductTabCounts = useMemo(
    () => ({
      all: products.filter((p) => !p.is_deleted && !p.is_hidden).length,
      promo: products.filter(
        (p) => !p.is_deleted && !p.is_hidden && (p.discount_percent || 0) > 0
      ).length,
      hidden: products.filter((p) => !p.is_deleted && p.is_hidden).length,
      trash: products.filter((p) => p.is_deleted).length,
      low_stock: products.filter(
        (p) => !p.is_deleted && (p.stock !== undefined ? p.stock : 100) <= 5
      ).length,
    }),
    [products]
  );

  const totalPages = Math.ceil(sortableProducts.length / itemsPerPage);
  const currentProducts = sortableProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportExcel = () => {
    exportProductsToExcel(sortableProducts);
  };

  return {
    products,
    setProducts,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedStockStatus,
    setSelectedStockStatus,
    availableBrands,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    sortConfig,
    setSortConfig,
    itemsPerPage,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    setEditingProduct,
    defaultNewSku,
    viewingProduct,
    setViewingProduct,
    isDiscountModalOpen,
    setIsDiscountModalOpen,
    selectedProductForDiscount,
    discountValue,
    setDiscountValue,
    discountEndDate,
    setDiscountEndDate,
    confirmModal,
    setConfirmModal,
    allCategories,
    sortableProducts,
    currentProducts,
    totalPages,
    counts,
    fetchProducts,
    handleDelete,
    handleToggleVisibility,
    handleSoftDelete,
    handleRestore,
    handleUpdateDiscount,
    openDiscountModal,
    handleResetFilters,
    handleCreateProduct,
    handleSort,
    handleExportExcel,
    ...bulkActions,
  };
}
