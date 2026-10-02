'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ProductFormModal from '@/modules/quan-tri/san-pham/components/ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/products?limit=100');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p.product_id !== id));
      } else {
        alert('Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ');
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

  const allCategories = React.useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (Array.isArray(p.category)) {
        p.category.forEach((c: string) => cats.add(c));
      }
    });
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.product_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || (Array.isArray(p.category) && p.category.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

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
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
        
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white min-w-[160px] cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          
          <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition whitespace-nowrap">
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
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã (ASIN)</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Kho</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Không tìm thấy sản phẩm nào</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 flex items-center gap-4">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                      <span className="font-semibold text-gray-900 line-clamp-2 max-w-[250px]">{product.name}</span>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">{product.product_id}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {product.product_type && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{product.product_type}</span>}
                        {product.sport_type && <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">{product.sport_type}</span>}
                        {product.category?.slice(0, 2).map((cat: string) => (
                          <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs truncate max-w-[100px]">{cat}</span>
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
                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.product_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition" title="Xóa">
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
    </div>
  );
}
