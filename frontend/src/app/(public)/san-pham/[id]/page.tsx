'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/shared/components/Breadcrumb';
import SizeGuideModal from '@/shared/components/SizeGuideModal';
import ProductImageGallery from '@/modules/san-pham/components/ProductImageGallery';
import ProductInfoSection from '@/modules/san-pham/components/ProductInfoSection';
import ProductReviewsSection from '@/modules/san-pham/components/ProductReviewsSection';
import ProductRecommendations from '@/modules/san-pham/components/ProductRecommendations';

interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  images?: string[];
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  description?: string;
  discount_percent?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [loading, setLoading] = useState(true);

  // Toast thông báo Wishlist
  const [wishlistToast, setWishlistToast] = useState('');

  // State for Size Guide Modal
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch Product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Dummy data fallback
          setProduct({
            product_id: "SHOE-CARB-902",
            name: "Giày Thể Thao Cao Cấp",
            price: 1500000,
            image_url: "https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8",
            brand: "KADY",
            rating: 0,
            reviews_count: 0,
            category: ["Giày thể thao", "Chạy bộ"],
            stock: 25,
            description: ""
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const trackInteraction = (type: string) => {
    if (!product) return;
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/api/v1/interactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.product_id,
          interaction_type: type
        })
      }).catch(err => console.error('Tracking failed', err));
    }
  };

  useEffect(() => {
    trackInteraction('view');
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  if (!product) return null;

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    ...(product.category ? product.category.map(c => ({ label: c, href: `/san-pham?category=${c}` })) : [{ label: "Sản phẩm", href: "/san-pham" }]),
    { label: product.name }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Toast thông báo Wishlist */}
      {wishlistToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {wishlistToast}
        </div>
      )}

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4 border border-gray-100">
          <div className="flex flex-col md:flex-row">
            
            {/* 1. Bộ ảnh Thumbnail + Phóng to ảnh (Gallery & Zoom) */}
            <div className="w-full md:w-5/12 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-white">
              <ProductImageGallery
                mainImage={product.image_url}
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Chi tiết thông tin sản phẩm */}
            <ProductInfoSection 
              product={product} 
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              setWishlistToast={setWishlistToast}
            />

          </div>
        </div>

        {/* Tab Mô tả sản phẩm */}
        <div className="bg-white rounded-2xl shadow-sm mt-8 p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Chi tiết & Mô tả sản phẩm</h2>
          <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line text-sm leading-relaxed">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <>
                <p>
                  <strong>{product.name}</strong> là sản phẩm thể thao cao cấp trong bộ sưu tập chính hãng của <strong>{product.brand || "KADY"}</strong>. 
                  Sản phẩm được gia công tỉ mỉ bằng chất liệu chuyên dụng, tối ưu độ co giãn, khả năng thấm hút mồ hôi và độ bền qua hàng trăm trận đấu.
                </p>
                <p className="mt-3">
                  Thích hợp cho nhu cầu luyện tập thể thao chuyên nghiệp lẫn hoạt động thể thao phong trào ({product.category?.join(", ")}).
                </p>
              </>
            )}
          </div>
        </div>

        {/* 2. Khu vực Đánh giá & Bình luận khách hàng chi tiết (Reviews & Ratings) */}
        <div id="reviews">
          <ProductReviewsSection
            productId={product.product_id}
            rating={product.rating || 0}
            reviewsCount={product.reviews_count || 0}
            productName={product.name}
          />
        </div>

        {/* Gợi ý AI (AI Recommendations) */}
        <ProductRecommendations productId={product.product_id} />

      </div>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        categories={product.category || []} 
      />
    </div>
  );
}
