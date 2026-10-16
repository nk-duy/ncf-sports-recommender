'use client';
import React, { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import ProductFormModal from './ProductFormModal';
import ProductToolbar from './ProductToolbar';
import ProductTable from './ProductTable';
import ProductPagination from './ProductPagination';
import ProductDiscountModal from './ProductDiscountModal';
import ProductConfirmModal from './ProductConfirmModal';
import BulkActionsBar from './BulkActionsBar';
import BulkDiscountModal from './BulkDiscountModal';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulk selection states
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDiscountOpen, setIsBulkDiscountOpen] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'promo' | 'hidden' | 'trash'>('all');

  // Pagination & Sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 10;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState<any | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountEndDate, setDiscountEndDate] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    isBlocked?: boolean;
    aiWarning?: string;
    interactionCount?: number;
    orderCount?: number;
    reviewCount?: number;
    onConfirm?: () => void;
  } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, selectedStockStatus, activeTab]);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_URL}/attributes`);
      if (res.ok) {
        const data = await res.json();
        if (data.brands && data.brands.length > 0) {
          setAvailableBrands(data.brands);
          return;
        }
      }
    } catch { }
    const saved = localStorage.getItem('admin_brands');
    if (saved) setAvailableBrands(JSON.parse(saved));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?limit=1000&include_hidden=true&include_deleted=true`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi tải danh sách sản phẩm', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const checkRes = await fetch(`${API_URL}/products/${id}/check-dependencies`);
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
            onConfirm: () => setConfirmModal(null)
          });
          return;
        }
      }

      setConfirmModal({
        isOpen: true,
        title: 'Xác nhận xóa vĩnh viễn',
        message: 'Sản phẩm này chưa phát sinh đơn hàng hay đánh giá nào. Bạn có chắc chắn muốn xóa vĩnh viễn khỏi hệ thống không?',
        isBlocked: false,
        onConfirm: async () => {
          setConfirmModal(null);
          try {
            const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setProducts(products.filter(p => p.product_id !== id));
              notifications.show({ title: 'Thành công', message: 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống', color: 'green' });
            } else {
              const err = await res.json().catch(() => null);
              notifications.show({ title: 'Không thể xóa', message: err?.detail || 'Có lỗi xảy ra khi xóa', color: 'red' });
            }
          } catch (error) {
            notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
          }
        }
      });
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Không thể kiểm tra ràng buộc dữ liệu sản phẩm', color: 'red' });
    }
  };

  const handleToggleVisibility = async (product: any) => {
    try {
      const newStatus = !product.is_hidden;
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hidden: newStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p.product_id === product.product_id ? { ...p, is_hidden: newStatus } : p));
        notifications.show({ title: 'Thành công', message: 'Cập nhật trạng thái thành công', color: 'green' });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleSoftDelete = async (product: any) => {
    try {
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_deleted: true })
      });
      if (res.ok) {
        setProducts(products.map(p => p.product_id === product.product_id ? { ...p, is_deleted: true } : p));
        notifications.show({ title: 'Thành công', message: 'Đã chuyển sản phẩm vào thùng rác', color: 'green' });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleRestore = async (product: any) => {
    try {
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_deleted: false })
      });
      if (res.ok) {
        setProducts(products.map(p => p.product_id === product.product_id ? { ...p, is_deleted: false } : p));
        notifications.show({ title: 'Thành công', message: 'Khôi phục sản phẩm thành công', color: 'green' });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleUpdateDiscount = async () => {
    if (!selectedProductForDiscount) return;
    try {
      const res = await fetch(`${API_URL}/products/${selectedProductForDiscount.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discount_percent: Number(discountValue),
          discount_end_date: discountEndDate ? new Date(discountEndDate).toISOString() : null
        })
      });
      if (res.ok) {
        setProducts(products.map(p =>
          p.product_id === selectedProductForDiscount.product_id
            ? { ...p, discount_percent: Number(discountValue), discount_end_date: discountEndDate ? new Date(discountEndDate).toISOString() : null }
            : p
        ));
        notifications.show({ title: 'Thành công', message: 'Đã cập nhật mức giảm giá!', color: 'green' });
        setIsDiscountModalOpen(false);
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const openDiscountModal = (product: any) => {
    setSelectedProductForDiscount(product);
    setDiscountValue(product.discount_percent || 0);
    setDiscountEndDate(product.discount_end_date ? product.discount_end_date.substring(0, 16) : '');
    setIsDiscountModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedStockStatus('');
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const mapTag = (t: string) => {
    if (t === "Dã ngoại") return "Dã Ngoại / Cắm Trại";
    if (t === "Đa dụng") return "Gym / Yoga";
    if (t === "Đá bóng") return "Bóng Đá";
    if (t === "Chạy bộ") return "Chạy Bộ";
    if (t === "Cầu lông") return "Cầu Lông";
    if (t === "Bóng chuyền") return "Bóng Chuyền";
    if (t === "Giày dép") return "Giày";
    return t;
  };

  const allCategories = React.useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      const rawTags = [p.product_type, p.sport_type, ...(p.category || [])];
      rawTags.filter(Boolean).forEach(t => cats.add(mapTag(t)));
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    const tags = [p.product_type, p.sport_type, ...(p.category || [])].filter(Boolean).map(mapTag);
    const matchesCategory = selectedCategory === '' || tags.includes(selectedCategory);
    const matchesBrand = selectedBrand === '' || (p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase());

    const pStock = p.stock !== undefined ? p.stock : 100;
    let matchesStock = true;
    if (selectedStockStatus === 'in_stock') matchesStock = pStock > 10;
    else if (selectedStockStatus === 'low_stock') matchesStock = pStock > 0 && pStock <= 10;
    else if (selectedStockStatus === 'out_of_stock') matchesStock = pStock <= 0;

    let matchesTab = false;
    if (activeTab === 'all') matchesTab = !p.is_deleted && !p.is_hidden;
    else if (activeTab === 'promo') matchesTab = !p.is_deleted && !p.is_hidden && p.discount_percent > 0;
    else if (activeTab === 'hidden') matchesTab = !p.is_deleted && p.is_hidden;
    else if (activeTab === 'trash') matchesTab = p.is_deleted;

    return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesTab;
  });

  let sortableProducts = [...filteredProducts];
  if (sortConfig !== null) {
    sortableProducts.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'stock') {
        aVal = a.stock !== undefined ? a.stock : 100;
        bVal = b.stock !== undefined ? b.stock : 100;
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getDisplayTags = (product: any) => {
    const rawTags = [product.product_type, product.sport_type, ...(product.category || [])];
    const mappedTags = rawTags.filter(Boolean).map(mapTag);
    return Array.from(new Set(mappedTags)).slice(0, 3);
  };

  // Bulk Actions Handlers
  const handleToggleSelect = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleToggleSelectAll = (visibleProducts: any[]) => {
    const visibleIds = visibleProducts.map(p => p.product_id);
    const allSelected = visibleIds.every(id => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...visibleIds])));
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
        selectedProductIds.map(id =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_hidden: true })
          })
        )
      );
      setProducts(prev =>
        prev.map(p => selectedProductIds.includes(p.product_id) ? { ...p, is_hidden: true } : p)
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã tạm ẩn ${selectedProductIds.length} sản phẩm khỏi khách hàng`,
        color: 'teal'
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi khi thực hiện ẩn hàng loạt', color: 'red' });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkShow = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map(id =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_hidden: false })
          })
        )
      );
      setProducts(prev =>
        prev.map(p => selectedProductIds.includes(p.product_id) ? { ...p, is_hidden: false } : p)
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã hiện bán lại ${selectedProductIds.length} sản phẩm trên cửa hàng`,
        color: 'green'
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi khi thực hiện mở bán hàng loạt', color: 'red' });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkSoftDelete = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map(id =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_deleted: true })
          })
        )
      );
      setProducts(prev =>
        prev.map(p => selectedProductIds.includes(p.product_id) ? { ...p, is_deleted: true } : p)
      );
      notifications.show({
        title: 'Thùng rác',
        message: `Đã chuyển ${selectedProductIds.length} sản phẩm vào thùng rác`,
        color: 'orange'
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi khi chuyển vào thùng rác', color: 'red' });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map(id =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_deleted: false })
          })
        )
      );
      setProducts(prev =>
        prev.map(p => selectedProductIds.includes(p.product_id) ? { ...p, is_deleted: false } : p)
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã khôi phục ${selectedProductIds.length} sản phẩm về kho`,
        color: 'green'
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi khi khôi phục sản phẩm', color: 'red' });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkApplyDiscount = async (discountPercent: number, endDate: string | null) => {
    if (selectedProductIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedProductIds.map(id =>
          fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              discount_percent: discountPercent,
              discount_end_date: endDate
            })
          })
        )
      );
      setProducts(prev =>
        prev.map(p =>
          selectedProductIds.includes(p.product_id)
            ? { ...p, discount_percent: discountPercent, discount_end_date: endDate }
            : p
        )
      );
      notifications.show({
        title: 'Thành công',
        message: `Đã áp dụng giảm giá ${discountPercent}% cho ${selectedProductIds.length} sản phẩm`,
        color: 'green'
      });
      setSelectedProductIds([]);
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi khi cập nhật giảm giá hàng loạt', color: 'red' });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const counts = React.useMemo(() => ({
    all: products.filter(p => !p.is_deleted && !p.is_hidden).length,
    promo: products.filter(p => !p.is_deleted && !p.is_hidden && (p.discount_percent || 0) > 0).length,
    hidden: products.filter(p => !p.is_deleted && p.is_hidden).length,
    trash: products.filter(p => p.is_deleted).length,
    low_stock: products.filter(p => !p.is_deleted && (p.stock !== undefined ? p.stock : 100) <= 5).length,
  }), [products]);

  const totalPages = Math.ceil(sortableProducts.length / itemsPerPage);
  const currentProducts = sortableProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportExcel = () => {
    const listToExport = sortableProducts;
    if (listToExport.length === 0) {
      notifications.show({ title: 'Thông báo', message: 'Không có dữ liệu sản phẩm để xuất file', color: 'yellow' });
      return;
    }
    const headers = ['Mã SP', 'Tên Sản Phẩm', 'Danh Mục', 'Thương Hiệu', 'Giá Gốc (VND)', 'Khuyến Mãi (%)', 'Giá Bán (VND)', 'Tồn Kho', 'Đã Bán', 'Trạng Thái'];
    const rows = listToExport.map(p => [
      `"${p.product_id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${Array.isArray(p.category) ? p.category.join(', ') : p.category || ''}"`,
      `"${p.brand || ''}"`,
      p.original_price || p.price || 0,
      p.discount_percent || 0,
      p.price || 0,
      p.stock !== undefined ? p.stock : 0,
      p.sales_count || 0,
      p.is_deleted ? '"Đã xóa"' : p.is_hidden ? '"Đang ẩn"' : '"Đang bán"'
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_san_pham_kady_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifications.show({ title: 'Thành công', message: `Đã xuất ${listToExport.length} sản phẩm ra file Excel (.csv)`, color: 'teal' });
  };

  if (isModalOpen) {
    return (
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(savedProduct?: any) => {
          if (savedProduct && !editingProduct) {
            setProducts(prev => [savedProduct, ...prev.filter(p => p.product_id !== savedProduct.product_id)]);
          }
          fetchProducts();
          setIsModalOpen(false);
          setActiveTab('all');
          setCurrentPage(1);
          setSortConfig(null);
        }}
        editingProduct={editingProduct}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Toolbar & Filters */}
      <ProductToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        availableBrands={availableBrands}
        selectedStockStatus={selectedStockStatus}
        setSelectedStockStatus={setSelectedStockStatus}
        handleCreate={() => { setEditingProduct(null); setIsModalOpen(true); }}
        handleResetFilters={handleResetFilters}
        onExportExcel={handleExportExcel}
      />

      {/* 2. Bulk Actions Bar (Hiển thị khi Admin tick chọn ≥ 1 sản phẩm) */}
      <BulkActionsBar
        selectedCount={selectedProductIds.length}
        totalVisibleCount={currentProducts.length}
        isAllSelected={currentProducts.length > 0 && currentProducts.every(p => selectedProductIds.includes(p.product_id))}
        onToggleSelectAll={() => handleToggleSelectAll(currentProducts)}
        onClearSelection={handleClearSelection}
        onBulkHide={handleBulkHide}
        onBulkShow={handleBulkShow}
        onBulkSoftDelete={handleBulkSoftDelete}
        onBulkRestore={handleBulkRestore}
        onBulkDiscount={() => setIsBulkDiscountOpen(true)}
        activeTab={activeTab}
        isProcessing={isBulkProcessing}
      />

      {/* 3. Products Table */}
      <ProductTable
        products={currentProducts}
        loading={loading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        activeTab={activeTab}
        sortConfig={sortConfig}
        handleSort={handleSort}
        formatPrice={formatPrice}
        getDisplayTags={getDisplayTags}
        handleEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
        handleToggleVisibility={handleToggleVisibility}
        handleSoftDelete={handleSoftDelete}
        handleRestore={handleRestore}
        handleDelete={handleDelete}
        openDiscountModal={openDiscountModal}
        selectedProductIds={selectedProductIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={() => handleToggleSelectAll(currentProducts)}
        isAllSelected={currentProducts.length > 0 && currentProducts.every(p => selectedProductIds.includes(p.product_id))}
      />

      {/* 3. Pagination */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalProducts={sortableProducts.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* 4. Discount Modal */}
      <ProductDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        selectedProduct={selectedProductForDiscount}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        discountEndDate={discountEndDate}
        setDiscountEndDate={setDiscountEndDate}
        onSave={handleUpdateDiscount}
      />

      {/* 5. Protection & Confirm Delete Modal */}
      <ProductConfirmModal
        modal={confirmModal}
        onClose={() => setConfirmModal(null)}
      />

      {/* 6. Bulk Discount Modal */}
      <BulkDiscountModal
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
        selectedCount={selectedProductIds.length}
        onApply={handleBulkApplyDiscount}
      />
    </div>
  );
}
