import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, BadgePercent, Download, Tag, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function AdminPromoProductsPage() {
  const [promoProducts, setPromoProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);

  // New states for adding promotion to existing products
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleExportExcel = () => {
    if (!promoProducts.length) {
      alert("Không có sản phẩm khuyến mãi nào để xuất.");
      return;
    }
    const headers = ["Sản phẩm", "Mã ASIN", "Giá gốc", "Phần trăm giảm", "Giá sau giảm", "Trạng thái"];
    const rows = promoProducts.map(p => [
      `"${(p.title || "").replace(/"/g, '""')}"`,
      p.asin || "",
      p.price || 0,
      `${p.discount_percent || 0}%`,
      Math.round((p.price || 0) * (1 - (p.discount_percent || 0) / 100)),
      p.is_active ? "Đang áp dụng" : "Tạm dừng"
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sp_khuyen_mai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchPromoProducts();
    fetchAllProducts();
  }, []);

  const fetchPromoProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/products?limit=100&is_promotion=true&include_hidden=true');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPromoProducts(data);
      } else {
        setPromoProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch promo products");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/products?limit=100&include_hidden=true');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllProducts(data);
      } else {
        setAllProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch all products");
    }
  };

  const handleRemovePromotion = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khuyến mãi của sản phẩm này?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ discount_percent: 0 })
      });
      if (res.ok) {
        setPromoProducts(promoProducts.filter(p => p.product_id !== id));
        fetchAllProducts(); // Refresh
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setDiscountValue(product.discount_percent || 0);
    setIsModalOpen(true);
  };

  const handleUpdateDiscount = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${editingProduct.product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ discount_percent: Number(discountValue) })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPromoProducts();
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (error) {
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
      const res = await fetch(`http://localhost:8000/api/v1/products/${selectedProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ discount_percent: Number(discountValue) })
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchPromoProducts();
        setSelectedProductId('');
        setDiscountValue(0);
      } else {
        alert('Thêm khuyến mãi thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredPromoProducts = promoProducts.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.product_id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const availableProductsToAdd = allProducts.filter(p => !p.discount_percent || p.discount_percent === 0);
  const searchFilteredAvailable = availableProductsToAdd.filter(p => 
    p.name.toLowerCase().includes(addSearchQuery.toLowerCase()) || 
    p.product_id.toLowerCase().includes(addSearchQuery.toLowerCase())
  ); // Hiển thị toàn bộ sản phẩm phù hợp thay vì chỉ 10

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sản phẩm Khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các sản phẩm đang được giảm giá</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm tên hoặc mã ASIN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-10 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
            />
          </div>

          <button
            onClick={handleExportExcel}
            className="h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs inline-flex items-center gap-2 transition"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button 
            onClick={() => {
              setDiscountValue(0);
              setSelectedProductId('');
              setAddSearchQuery('');
              setIsAddModalOpen(true);
            }} 
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-2xs hover:shadow-xs transition inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Thêm SP Khuyến mãi</span>
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng SP Khuyến mãi</span>
            <span className="text-2xl font-black text-gray-900">{promoProducts.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Tag size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mức giảm trung bình</span>
            <span className="text-2xl font-black text-emerald-600">
              {promoProducts.length > 0 
                ? `${Math.round(promoProducts.reduce((acc, p) => acc + (p.discount_percent || 0), 0) / promoProducts.length)}%` 
                : '0%'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Đang áp dụng</span>
            <span className="text-2xl font-black text-purple-600">
              {promoProducts.filter(p => p.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã (ASIN)</th>
                <th className="px-6 py-4">Giá gốc</th>
                <th className="px-6 py-4">Giảm giá</th>
                <th className="px-6 py-4">Giá sau giảm</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredPromoProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Không có sản phẩm khuyến mãi nào</td>
                </tr>
              ) : (
                filteredPromoProducts.map((product, index) => (
                  <tr key={`${product.product_id}-${index}`} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 flex items-center gap-4">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                      <span className="font-semibold text-gray-900 line-clamp-2 max-w-[250px]">{product.name}</span>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">{product.product_id}</td>
                    <td className="px-6 py-3 font-mono text-gray-500 line-through">{formatPrice(product.price)}</td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        -{product.discount_percent}%
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-blue-600">
                      {formatPrice(product.price * (1 - product.discount_percent / 100))}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Sửa mức giảm">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemovePromotion(product.product_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Xóa khuyến mãi">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Discount Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Chỉnh sửa mức giảm giá</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img src={editingProduct?.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                <span className="font-semibold text-sm line-clamp-2">{editingProduct?.name}</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phần trăm giảm giá (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
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

      {/* Add Promotion Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Thêm sản phẩm khuyến mãi</h2>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tìm kiếm sản phẩm</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên sản phẩm..."
                  value={addSearchQuery}
                  onChange={(e) => setAddSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {searchFilteredAvailable.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy sản phẩm phù hợp</div>
                ) : (
                  searchFilteredAvailable.map((p, index) => (
                    <div 
                      key={`${p.product_id}-${index}`}
                      onClick={() => setSelectedProductId(p.product_id)}
                      className={`p-2 flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition border-b border-gray-100 last:border-0 ${selectedProductId === p.product_id ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{p.product_id} - {formatPrice(p.price)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedProductId && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mức giảm giá (%)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddPromotion}
                disabled={!selectedProductId || discountValue <= 0}
                className="px-4 py-2 bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Thêm khuyến mãi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
