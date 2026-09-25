'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/modules/products/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface DynamicProductListProps {
  initialCategory?: string;
}

export default function DynamicProductList({ initialCategory }: DynamicProductListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const category = searchParams.get('category') || initialCategory;
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sizes = searchParams.get('sizes');
  const colors = searchParams.get('colors');
  const gender = searchParams.get('gender');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:8000/api/v1/products?limit=50';
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (minPrice) url += `&min_price=${encodeURIComponent(minPrice)}`;
        if (maxPrice) url += `&max_price=${encodeURIComponent(maxPrice)}`;
        if (sizes) url += `&sizes=${encodeURIComponent(sizes)}`;
        if (colors) url += `&colors=${encodeURIComponent(colors)}`;
        if (gender) url += `&gender=${encodeURIComponent(gender)}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, brand, minPrice, maxPrice, sizes, colors, gender]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
        <span className="text-gray-400 mb-2">Không tìm thấy sản phẩm nào</span>
        {(search || category || brand || minPrice || maxPrice || sizes || colors || gender) && (
          <span className="text-sm text-gray-500">
            Hãy thử thay đổi từ khóa hoặc bộ lọc
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-bold text-gray-900">{products.length}</span> sản phẩm
          {search && <span> cho từ khóa "<span className="font-bold text-blue-600">{search}</span>"</span>}
          {category && !search && <span> trong danh mục "<span className="font-bold text-blue-600">{category}</span>"</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}
