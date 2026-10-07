'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, BadgePercent } from 'lucide-react';

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

  useEffect(() => {
    fetchPromoProducts();
    fetchAllProducts();
  }, []);

  const fetchPromoProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/products?limit=100&is_promotion=true');
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
      const res = await fetch('http://localhost:8000/api/v1/products?limit=100');
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
  ).slice(0, 10); // Limit to 10 for performance in dropdown

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sản phẩm Khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các sản phẩm đang được giảm giá</p>
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

          <button 
            onClick={() => {
              setDiscountValue(0);
              setSelectedProductId('');
              setAddSearchQuery('');
              setIsAddModalOpen(true);
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Thêm SP Khuyến mãi</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng SP Khuyến mãi</span>
          <span className="text-2xl font-black text-blue-600">{promoProducts.length}</span>
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
                filteredPromoProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
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
              
              {addSearchQuery && (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  {searchFilteredAvailable.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy sản phẩm phù hợp</div>
                  ) : (
                    searchFilteredAvailable.map(p => (
                      <div 
                        key={p.product_id}
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
              )}

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
