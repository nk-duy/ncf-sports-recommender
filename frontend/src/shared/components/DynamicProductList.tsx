'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/modules/san-pham/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Pagination from '@/shared/components/Pagination';

interface DynamicProductListProps {
  initialCategory?: string;
}

export default function DynamicProductList({ initialCategory }: DynamicProductListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get('search');
  const category = searchParams.get('category') || initialCategory;
  const product_type = searchParams.get('product_type');
  const sport_type = searchParams.get('sport_type');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sizes = searchParams.get('sizes');
  const colors = searchParams.get('colors');
  const gender = searchParams.get('gender');
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        let url = `http://localhost:8000/api/v1/products?skip=${skip}&limit=${ITEMS_PER_PAGE}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (product_type) url += `&product_type=${encodeURIComponent(product_type)}`;
        if (sport_type) url += `&sport_type=${encodeURIComponent(sport_type)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (minPrice) url += `&min_price=${encodeURIComponent(minPrice)}`;
        if (maxPrice) url += `&max_price=${encodeURIComponent(maxPrice)}`;
        if (sizes) url += `&sizes=${encodeURIComponent(sizes)}`;
        if (colors) url += `&colors=${encodeURIComponent(colors)}`;
        if (gender) url += `&gender=${encodeURIComponent(gender)}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const totalHeader = res.headers.get('x-total-count') || res.headers.get('X-Total-Count');
          const data = await res.json();
          setProducts(data);
          setTotalCount(totalHeader ? parseInt(totalHeader, 10) : data.length);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, product_type, sport_type, brand, minPrice, maxPrice, sizes, colors, gender, currentPage]);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(pathname + '?' + params.toString());
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-bold text-gray-900">{startIdx} - {endIdx}</span> trên tổng số <span className="font-bold text-blue-600">{totalCount}</span> sản phẩm
          {search && <span> cho từ khóa "<span className="font-bold text-blue-600">{search}</span>"</span>}
          {sport_type && !search && <span> môn "<span className="font-bold text-blue-600">{sport_type}</span>"</span>}
          {product_type && !search && <span> loại "<span className="font-bold text-blue-600">{product_type}</span>"</span>}
          {category && !search && <span> trong danh mục "<span className="font-bold text-blue-600">{category}</span>"</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {products.map((p, idx) => {
          const discountPct = p.discount_percent || 0;
          const discountedPrice = discountPct > 0 ? p.price * (1 - discountPct / 100) : p.price;
          const displayCategory = p.category && p.category.length > 0 ? p.category[p.category.length - 1] : "SẢN PHẨM THỂ THAO";
          
          return (
            <ProductCard 
              key={`${p.product_id}-${idx}`} 
              product={{
                id: p.product_id,
                name: p.name,
                price: discountedPrice,
                originalPrice: discountPct > 0 ? p.price.toLocaleString('vi-VN') + 'đ' : undefined,
                imageUrl: p.image_url,
                discountLabel: discountPct > 0 ? `-${discountPct}%` : undefined,
                category: displayCategory,
                discountPercent: discountPct > 0 ? discountPct : undefined,
              }} 
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4 pb-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            siblingCount={1}
            showEllipsis={totalPages > 6}
          />
        </div>
      )}
    </div>
  );
}
