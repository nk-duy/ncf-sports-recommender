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
import ProductDetailModal from './ProductDetailModal';
import { getAuthHeaders } from '@/shared/lib/authHeader';

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
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
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
      const checkRes = await fetch(`${API_URL}/products/${id}/check-dependencies`, {
        headers: getAuthHeaders()
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
            const res = await fetch(`${API_URL}/products/${id}`, { 
              method: 'DELETE',
              headers: getAuthHeaders()
            });
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
    const matchesBrand = selectedBrand === '' 
      ? true 
      : selectedBrand === 'none'
        ? (!p.brand || p.brand.trim() === '')
        : (p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase());

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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
    // 100% Dữ liệu thực tế từ state/API đang được lọc trên giao diện
    const listToExport = sortableProducts;
    if (listToExport.length === 0) {
      notifications.show({ title: 'Thông báo', message: 'Không có dữ liệu sản phẩm để xuất file', color: 'yellow' });
      return;
    }

    const exportTimeStr = new Date().toLocaleString('vi-VN');
    const totalStock = listToExport.reduce((acc, curr) => acc + Number(curr.stock !== undefined ? curr.stock : 0), 0);
    const totalSales = listToExport.reduce((acc, curr) => acc + Number(curr.sales_count || curr.sold || 0), 0);

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>DanhSach_SanPham_Kady</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
          .header-title { background-color: #1e40af; color: #ffffff; font-size: 14pt; font-weight: bold; text-align: center; height: 45px; vertical-align: middle; }
          .meta-info { background-color: #f8fafc; color: #475569; font-size: 10pt; font-style: italic; text-align: center; height: 28px; vertical-align: middle; border: 1px solid #cbd5e1; }
          table { border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #dbeafe; color: #1e3a8a; font-weight: bold; font-size: 10.5pt; border: 1px solid #cbd5e1; height: 32px; text-align: center; vertical-align: middle; white-space: nowrap; }
          td { border: 1px solid #cbd5e1; font-size: 10pt; height: 26px; padding: 4px 8px; vertical-align: middle; white-space: nowrap; }
          .text-left { text-align: left; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .currency { mso-number-format:"\\@"; text-align: right; white-space: nowrap; }
          .number { mso-number-format:"\\@"; text-align: center; white-space: nowrap; }
          .bold { font-weight: bold; }
          .total-row { background-color: #f1f5f9; font-weight: bold; height: 28px; }
        </style>
      </head>
      <body>
        <!-- 1. TIÊU ĐỀ BÁO CÁO & THÔNG TIN CHUNG -->
        <table>
          <tr height="45">
            <td colspan="14" class="header-title" height="45">DANH SÁCH SẢN PHẨM &amp; TỒN KHO HỆ THỐNG KADY SPORT</td>
          </tr>
          <tr height="28">
            <td colspan="14" class="meta-info" height="28">
              Tổng số sản phẩm xuất: <strong>${listToExport.length}</strong> mặt hàng | Ngày giờ xuất: <strong>${exportTimeStr}</strong> | Người xuất: <strong>Quản trị viên</strong>
            </td>
          </tr>
          <tr height="12"><td colspan="14" style="border:none; height: 12px;"></td></tr>
        </table>

        <!-- 2. BẢNG DỮ LIỆU SẢN PHẨM (14 CỘT) -->
        <table>
          <tr height="32">
            <th style="width: 50px;">STT</th>
            <th style="width: 240px;">Mã Sản Phẩm (ID/ASIN)</th>
            <th style="width: 380px;">Tên Sản Phẩm</th>
            <th style="width: 140px;">Môn Thể Thao</th>
            <th style="width: 120px;">Phân Loại</th>
            <th style="width: 180px;">Danh Mục Con</th>
            <th style="width: 130px;">Thương Hiệu</th>
            <th style="width: 140px;">Giá Gốc (VNĐ)</th>
            <th style="width: 100px;">Giảm Giá (%)</th>
            <th style="width: 140px;">Giá Bán (VNĐ)</th>
            <th style="width: 100px;">Tồn Kho</th>
            <th style="width: 100px;">Đã Bán</th>
            <th style="width: 100px;">Đánh Giá</th>
            <th style="width: 120px;">Trạng Thái</th>
          </tr>
          ${listToExport.map((p, idx) => {
            // Tính toán giá gốc và giá bán chuẩn xác đồng bộ với giao diện
            let originalPrice = Number(p.price || 0);
            let discountPercent = Number(p.discount_percent || 0);
            let salePrice = originalPrice;

            if (p.original_price && Number(p.original_price) > Number(p.price)) {
              originalPrice = Math.round(Number(p.original_price));
              salePrice = Math.round(Number(p.price));
              discountPercent = discountPercent > 0 
                ? discountPercent 
                : Math.round(((originalPrice - salePrice) / originalPrice) * 100);
            } else if (discountPercent > 0) {
              originalPrice = Math.round(Number(p.original_price || p.price || 0));
              salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
            } else {
              originalPrice = Math.round(Number(p.price || 0));
              salePrice = originalPrice;
              discountPercent = 0;
            }

            const stock = Number(p.stock !== undefined ? p.stock : 0);
            const salesCount = Number(p.sales_count || p.sold || 0);
            const ratingText = p.rating ? `${Number(p.rating).toFixed(1)} ★` : '5.0 ★';

            let statusText = 'Đang bán';
            let statusColor = '#15803d';
            if (p.is_deleted) {
              statusText = 'Thùng rác';
              statusColor = '#b91c1c';
            } else if (p.is_hidden) {
              statusText = 'Đang ẩn';
              statusColor = '#d97706';
            } else if (stock <= 0) {
              statusText = 'Hết hàng';
              statusColor = '#dc2626';
            }

            const sportType = p.sport_type || (Array.isArray(p.category) && p.category[1]) || 'Thể Thao';
            const productType = p.product_type || (Array.isArray(p.category) && p.category[2]) || 'Thiết bị';
            const subCategory = p.sub_category || (Array.isArray(p.category) && p.category[0]) || (typeof p.category === 'string' ? p.category : '');
            const brand = p.brand || 'KADY';

            return `
              <tr height="26">
                <td class="text-center number">${idx + 1}</td>
                <td class="text-left number" style="font-family: monospace;">${p.product_id}</td>
                <td class="text-left bold">${(p.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td class="text-center">${sportType}</td>
                <td class="text-center">${productType}</td>
                <td class="text-left">${subCategory}</td>
                <td class="text-center bold">${brand}</td>
                <td class="currency" style="color: #64748b;">${originalPrice.toLocaleString('vi-VN')} VNĐ</td>
                <td class="number" style="${discountPercent > 0 ? 'color: #dc2626; font-weight: bold;' : 'color: #64748b;'}">${discountPercent}%</td>
                <td class="currency bold" style="color: #1e40af;">${salePrice.toLocaleString('vi-VN')} VNĐ</td>
                <td class="currency bold" style="${stock <= 5 ? 'color: #dc2626;' : 'color: #15803d;'}">${stock.toLocaleString('vi-VN')}</td>
                <td class="currency">${salesCount.toLocaleString('vi-VN')}</td>
                <td class="number" style="color: #d97706; font-weight: bold;">${ratingText}</td>
                <td class="text-center bold" style="color: ${statusColor};">${statusText}</td>
              </tr>
            `;
          }).join('')}
          <tr class="total-row" height="28">
            <td class="text-center bold" colspan="10" style="background-color: #e2e8f0; color: #1e293b;">
              TỔNG CỘNG (${listToExport.length} SẢN PHẨM)
            </td>
            <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
              ${totalStock.toLocaleString('vi-VN')}
            </td>
            <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
              ${totalSales.toLocaleString('vi-VN')}
            </td>
            <td class="number bold" colspan="2" style="background-color: #e2e8f0; color: #64748b;">-</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateFormatted = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `DanhSach_SanPham_KADY_${dateFormatted}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    notifications.show({ 
      title: 'Xuất Excel thành công', 
      message: `Đã xuất ${listToExport.length} sản phẩm ra file Excel (.xls) chuyên nghiệp`, 
      color: 'teal' 
    });
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
        onViewDetail={(p) => setViewingProduct(p)}
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

      {/* 4. Product Detail Modal (Khi click vào tên / ảnh sản phẩm) */}
      <ProductDetailModal
        isOpen={!!viewingProduct}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(p) => {
          setViewingProduct(null);
          setEditingProduct(p);
          setIsModalOpen(true);
        }}
        onToggleVisibility={handleToggleVisibility}
        formatPrice={formatPrice}
      />

      {/* 5. Discount Modal */}
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

      {/* 6. Protection & Confirm Delete Modal */}
      <ProductConfirmModal
        modal={confirmModal}
        onClose={() => setConfirmModal(null)}
      />

      {/* 7. Bulk Discount Modal */}
      <BulkDiscountModal
        isOpen={isBulkDiscountOpen}
        onClose={() => setIsBulkDiscountOpen(false)}
        selectedCount={selectedProductIds.length}
        onApply={handleBulkApplyDiscount}
      />
    </div>
  );
}
