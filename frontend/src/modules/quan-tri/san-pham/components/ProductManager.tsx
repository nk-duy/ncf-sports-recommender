'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, BadgePercent, RefreshCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import ProductFormModal from './ProductFormModal';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'promo' | 'hidden' | 'trash'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, activeTab]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState<any | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountEndDate, setDiscountEndDate] = useState<string>('');

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, message: string, onConfirm: () => void} | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?limit=100&include_hidden=true&include_deleted=true`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi tải danh sách sản phẩm', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: 'Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi cơ sở dữ liệu. Bạn có chắc chắn?',
      onConfirm: async () => {
        setConfirmModal(null);
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p.product_id !== id));
        notifications.show({ title: 'Thành công', message: 'Xóa sản phẩm thành công', color: 'green' });
      } else {
        notifications.show({ title: 'Lỗi', message: 'Có lỗi xảy ra khi xóa', color: 'red' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
      }
    });
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
        setProducts(products.map(p => 
          p.product_id === product.product_id ? { ...p, is_hidden: newStatus } : p
        ));
        notifications.show({ title: 'Thành công', message: 'Cập nhật trạng thái thành công', color: 'green' });
      } else {
        notifications.show({ title: 'Lỗi', message: 'Có lỗi xảy ra khi cập nhật', color: 'red' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleSoftDelete = async (product: any) => {
    setConfirmModal({
      isOpen: true,
      message: 'Chuyển sản phẩm này vào thùng rác?',
      onConfirm: async () => {
        setConfirmModal(null);
    try {
      const res = await fetch(`${API_URL}/products/${product.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_deleted: true })
      });
      if (res.ok) {
        setProducts(products.map(p => p.product_id === product.product_id ? { ...p, is_deleted: true } : p));
        notifications.show({ title: 'Thành công', message: 'Đã chuyển vào thùng rác', color: 'green' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối', color: 'red' });
    }
      }
    });
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
        notifications.show({ title: 'Thành công', message: 'Đã khôi phục sản phẩm', color: 'green' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối', color: 'red' });
    }
  };

  const handleUpdateDiscount = async () => {
    if (!selectedProductForDiscount) return;
    if (discountValue < 0 || discountValue > 100) {
      notifications.show({ title: 'Lỗi', message: 'Mức giảm giá phải từ 0 đến 100', color: 'red' });
      return;
    }
    
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
      } else {
        notifications.show({ title: 'Lỗi', message: 'Cập nhật thất bại', color: 'red' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
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
      rawTags.filter(Boolean).forEach(t => {
        cats.add(mapTag(t));
      });
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const tags = [p.product_type, p.sport_type, ...(p.category || [])].filter(Boolean).map(mapTag);
    const matchesCategory = selectedCategory === '' || tags.includes(selectedCategory);
    
    let matchesTab = false;
    if (activeTab === 'all') matchesTab = !p.is_deleted && !p.is_hidden;
    else if (activeTab === 'promo') matchesTab = !p.is_deleted && !p.is_hidden && p.discount_percent > 0;
    else if (activeTab === 'hidden') matchesTab = !p.is_deleted && p.is_hidden;
    else if (activeTab === 'trash') matchesTab = p.is_deleted;

    return matchesSearch && matchesCategory && matchesTab;
  });

  let sortableProducts = [...filteredProducts];
  if (sortConfig !== null) {
    sortableProducts.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'price') {
        aVal = a.price * (1 - (a.discount_percent || 0)/100);
        bVal = b.price * (1 - (b.discount_percent || 0)/100);
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(sortableProducts.length / itemsPerPage);
  const currentProducts = sortableProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const counts = React.useMemo(() => ({
    all: products.filter(p => !p.is_deleted && !p.is_hidden).length,
    promo: products.filter(p => !p.is_deleted && !p.is_hidden && (p.discount_percent || 0) > 0).length,
    hidden: products.filter(p => !p.is_deleted && p.is_hidden).length,
    trash: products.filter(p => p.is_deleted).length,
  }), [products]);

  if (isModalOpen) {
    return (
      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchProducts();
          setIsModalOpen(false);
        }}
        editingProduct={editingProduct}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
          <div className="flex items-center gap-4 mt-2 border-b border-gray-100 w-full overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('all')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Tất cả sản phẩm <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{counts.all}</span>
            </button>
            <button 
              onClick={() => setActiveTab('promo')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'promo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Sản phẩm giảm giá <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'promo' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{counts.promo}</span>
            </button>
            <button 
              onClick={() => setActiveTab('hidden')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'hidden' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Sản phẩm bị ẩn <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'hidden' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{counts.hidden}</span>
            </button>
            <button 
              onClick={() => setActiveTab('trash')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'trash' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Thùng rác <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'trash' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{counts.trash}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên hoặc mã ASIN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full md:w-64"
            />
          </div>

          <select
            suppressHydrationWarning
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white min-w-[160px] cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button suppressHydrationWarning onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition whitespace-nowrap">
            <Plus size={18} />
            <span>Thêm Sản phẩm</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4 w-16 text-center">STT</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Sản phẩm {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('product_id')}>
                  <div className="flex items-center gap-1">Mã (ASIN) {sortConfig?.key === 'product_id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                </th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-1">Kho {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">Giá {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
                </th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Không tìm thấy sản phẩm nào</td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr key={`${product.product_id}-${index}`} className={`hover:bg-gray-50 transition ${product.is_hidden ? 'opacity-50 bg-gray-50' : ''}`}>
                    <td className="px-6 py-3 text-center text-gray-500 font-medium whitespace-nowrap w-16">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-4">
                      <div className="relative">
                        <img src={product.image_url} alt={product.name} className={`w-12 h-12 object-cover rounded-md border border-gray-200 ${product.is_hidden || product.is_deleted ? 'grayscale opacity-70' : ''}`} />
                        {(product.is_hidden || product.is_deleted) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
                            <EyeOff size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 line-clamp-2 max-w-[250px]">{product.name}</span>
                        {product.is_hidden && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wide">Đã ẩn</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">{product.product_id}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {getDisplayTags(product).map((tag, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            i === 0 ? 'bg-blue-100 text-blue-800' : 
                            i === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {tag as string}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        (product.stock || 100) > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock !== undefined ? product.stock : 100}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-gray-900">
                      {product.discount_percent > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</span>
                          <span className="text-blue-600">{formatPrice(product.price * (1 - product.discount_percent / 100))}</span>
                        </div>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'trash' ? (
                          <>
                            <button onClick={() => handleRestore(product)} className="p-1.5 text-gray-400 hover:text-green-600 transition" title="Khôi phục">
                              <RefreshCcw size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.product_id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Xóa vĩnh viễn">
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => {
                              setSelectedProductForDiscount(product);
                              setDiscountValue(product.discount_percent || 0);
                              setDiscountEndDate(product.discount_end_date ? product.discount_end_date.substring(0, 16) : '');
                              setIsDiscountModalOpen(true);
                            }} className="p-1.5 text-gray-400 hover:text-green-600 transition" title="Thiết lập giảm giá">
                              <BadgePercent size={18} />
                            </button>
                            <button onClick={() => handleToggleVisibility(product)} className={`p-1.5 transition ${product.is_hidden ? 'text-gray-400 hover:text-green-600' : 'text-gray-400 hover:text-orange-600'}`} title={product.is_hidden ? "Hiển thị" : "Ẩn"}>
                              {product.is_hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Sửa">
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleSoftDelete(product)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Chuyển vào thùng rác">
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortableProducts.length)} trong số {sortableProducts.length} sản phẩm
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Discount Modal */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Thiết lập khuyến mãi</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img src={selectedProductForDiscount?.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                <span className="font-semibold text-sm line-clamp-2">{selectedProductForDiscount?.name}</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mức giảm giá (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">Đặt 0% để xóa khuyến mãi cho sản phẩm này.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hết hạn vào lúc (tùy chọn)</label>
                <input 
                  type="datetime-local" 
                  value={discountEndDate}
                  onChange={(e) => setDiscountEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">Bỏ trống nếu khuyến mãi là vô thời hạn.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsDiscountModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdateDiscount}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Xác nhận</h2>
              <p className="text-gray-600">{confirmModal.message}</p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
