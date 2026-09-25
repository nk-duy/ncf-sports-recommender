'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Sản phẩm</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition">
          <Plus size={18} />
          <span>Thêm Sản phẩm</span>
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã (ASIN)</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Không có sản phẩm nào</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 flex items-center gap-4">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                      <span className="font-semibold text-gray-900 line-clamp-2 max-w-[300px]">{product.name}</span>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">{product.product_id}</td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.category?.slice(0, 2).map((cat: string) => (
                          <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 transition" title="Sửa">
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
