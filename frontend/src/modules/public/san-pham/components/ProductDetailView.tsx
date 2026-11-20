'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/shared/components/Breadcrumb';
import SizeGuideModal from '@/shared/components/SizeGuideModal';
import ProductImageGallery from './ProductImageGallery';
import ProductInfoSection from './ProductInfoSection';
import ProductSpecsSection from './ProductSpecsSection';
import ProductReviewsSection from './ProductReviewsSection';
import ProductRecommendations from './ProductRecommendations';
import { buildProductBreadcrumbs } from '../utils/buildProductBreadcrumbs';
import {
  detectProductSizeKind,
  normalizeProductVariants,
} from '../utils/normalizeProductVariants';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import type { ProductDetail } from '../types';

interface ProductDetailViewProps {
  id: string;
}

export default function ProductDetailView({ id }: ProductDetailViewProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<'not_found' | 'network' | null>(null);
  const [wishlistToast, setWishlistToast] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/products/${id}`);
      if (res.status === 404) {
        setProduct(null);
        setErrorState('not_found');
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const rawProduct: ProductDetail = await res.json();
      // Bảo vệ dữ liệu biến thể: Giày dép luôn 38–44, Quần áo S–2XL, thiết bị không có size quần áo.
      const resolvedProduct = normalizeProductVariants(rawProduct);
      setProduct(resolvedProduct);
      // Không chọn sẵn kích cỡ, để người dùng chủ động lựa chọn
      setSelectedSize('');
    } catch (err) {
      console.error(err);
      setProduct(null);
      setErrorState('network');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (!product) return;
    const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
    if (token) {
      const apiUrl = resolveApiBaseUrl();
      fetch(`${apiUrl}/interactions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          interaction_type: 'view',
        }),
      }).catch((err) => console.error('Tracking failed', err));
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  if (errorState || !product) {
    return (
      <div className="min-h-[65vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            {errorState === 'not_found'
              ? 'Không tìm thấy sản phẩm'
              : 'Không thể tải dữ liệu sản phẩm'}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {errorState === 'not_found'
              ? 'Sản phẩm bạn tìm kiếm có thể đã ngừng kinh doanh hoặc đường dẫn không tồn tại.'
              : 'Không thể kết nối đến máy chủ KADY Sports. Vui lòng kiểm tra kết nối và thử lại.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            {errorState !== 'not_found' && (
              <button
                type="button"
                onClick={() => void loadProduct()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition cursor-pointer"
              >
                Thử lại
              </button>
            )}
            <Link
              href="/san-pham"
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition"
            >
              Về cửa hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = buildProductBreadcrumbs(product);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 overflow-x-hidden">
      {wishlistToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          {wishlistToast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-2.5 pb-2">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-1.5 border border-slate-100 p-3.5 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5 w-full self-start">
              <ProductImageGallery
                mainImage={product.image_url}
                images={product.images}
                productName={product.name}
              />
            </div>

            <div className="lg:col-span-7">
              <ProductInfoSection
                key={product.product_id}
                product={product}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
                setWishlistToast={setWishlistToast}
                selectedSize={selectedSize}
                onSelectSize={(s) => setSelectedSize(s)}
              />
            </div>
          </div>
        </div>

        <ProductSpecsSection product={product} />

        <div id="reviews">
          <ProductReviewsSection
            productId={product.product_id}
            rating={product.rating || 0}
            reviewsCount={product.reviews_count || 0}
            productName={product.name}
          />
        </div>

        <ProductRecommendations
          productId={product.product_id}
          sportType={product.sport_type}
          productType={product.product_type}
        />
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categories={product.category || []}
        productName={product.name}
        sizeKind={detectProductSizeKind(product)}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
}
