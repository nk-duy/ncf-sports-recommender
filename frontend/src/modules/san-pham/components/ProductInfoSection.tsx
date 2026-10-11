'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductVouchersSection from '@/modules/san-pham/components/ProductVouchersSection';
import { useCartStore, cartKey } from '@/shared/store/cartStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useWishlistStore } from '@/shared/store/wishlistStore';

interface ProductInfoSectionProps {
  product: any;
  onOpenSizeGuide: () => void;
  setWishlistToast: (msg: string) => void;
}

export default function ProductInfoSection({ product, onOpenSizeGuide, setWishlistToast }: ProductInfoSectionProps) {
  const router = useRouter();
  
  // States cho tùy chọn mua hàng
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Wishlist Zustand Store
  const { isWishlisted, toggleItem } = useWishlistStore();

  // Cart Zustand Store
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

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

  const handleToggleWishlist = () => {
    if (!product) return;
    const added = toggleItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category?.[0] || 'Thể Thao',
      discount_percent: product.discount_percent,
    });

    setWishlistToast(added ? 'Đã thêm vào danh sách yêu thích!' : 'Đã xóa khỏi danh sách yêu thích!');
    setTimeout(() => setWishlistToast(''), 3000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMsg('Vui lòng chọn Kích cỡ!');
      return;
    }
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg('Vui lòng chọn Màu sắc!');
      return;
    }
    setErrorMsg('');
    trackInteraction('add_to_cart');
    
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.discount_percent ? product.price * (1 - product.discount_percent / 100) : product.price,
      image_url: product.image_url,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock || 100
    } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setErrorMsg('Vui lòng chọn Kích cỡ!');
      return;
    }
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg('Vui lòng chọn Màu sắc!');
      return;
    }
    setErrorMsg('');
    trackInteraction('purchase');
    
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.discount_percent ? product.price * (1 - product.discount_percent / 100) : product.price,
      image_url: product.image_url,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      stock: product.stock || 100
    } as any);
    useCheckoutStore.getState().setSelectedKeys([
      cartKey({ product_id: product.product_id, size: selectedSize, color: selectedColor })
    ]);
    router.push('/thanh-toan');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const hasColors = product.colors && product.colors.length > 0;
  const isReady = selectedSize !== '' && (!hasColors || selectedColor !== '');
  const productStock = product.stock ?? 25;
  const inStock = productStock > 0;

  // Tính toán tồn kho giả định theo từng Size (Variant Stock Status)
  const availableSizes = product.sizes?.length
    ? product.sizes
    : product.category?.includes("Clothing") || product.name.toLowerCase().includes("áo") || product.name.toLowerCase().includes("quần")
    ? ['S', 'M', 'L', 'XL', 'XXL']
    : ['39', '40', '41', '42', '43'];

  // Giả định trạng thái kho theo biến thể: ví dụ XXL hoặc 43 bị hết hàng nếu tổng kho nhỏ hơn 10
  const isSizeOutOfStock = (size: string) => {
    if (productStock <= 0) return true;
    if (size === 'XXL' || size === '43') return productStock < 10;
    return false;
  };

  const isWishlistedProduct = isWishlisted(product.product_id);

  return (
    <div className="w-full md:w-7/12 p-6 md:p-10 lg:p-12 flex flex-col justify-start">
      {/* Header & Wishlist Button */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-md">
            {product.brand || "KADY"}
          </span>
          <span className="text-xs text-gray-400 font-mono">SKU: {product.product_id}</span>
        </div>

        {/* 3. Nút Yêu thích (Wishlist) */}
        <button
          onClick={handleToggleWishlist}
          className={`p-2.5 rounded-full border transition-all ${
            isWishlistedProduct
              ? 'border-red-200 bg-red-50 text-red-500 scale-110 shadow-sm'
              : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
          }`}
          title={isWishlistedProduct ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
        >
          <svg className={`w-5 h-5 ${isWishlistedProduct ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
      
      {/* Rating summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-yellow-400">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-gray-800 font-bold">{product.rating ? Number(product.rating).toFixed(1) : '0.0'}</span>
        </div>
        <span className="text-gray-300">|</span>
        <a href="#reviews" className="text-sm font-medium text-gray-500 hover:text-blue-600 underline decoration-gray-300">
          {product.reviews_count || 0} Đánh giá
        </a>
      </div>

      {/* Khối hiển thị Giá */}
      <div className="mb-6 flex items-end gap-3 bg-gray-50/80 p-4 rounded-xl">
        {product.discount_percent && product.discount_percent > 0 ? (
          <>
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">{formatPrice(product.price * (1 - product.discount_percent / 100))}</span>
            <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.price)}</span>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded mb-1.5">-{product.discount_percent}%</span>
          </>
        ) : (
          <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
        )}
      </div>

      {/* 3. Khối Mã giảm giá áp dụng (Vouchers) */}
      <ProductVouchersSection />

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-shake">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {errorMsg}
        </div>
      )}

      {/* 4. Tùy chọn Size & Báo trạng thái tồn kho theo biến thể (Variant Stock) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-900">Kích cỡ <span className="text-red-500">*</span></h3>
          <button onClick={onOpenSizeGuide} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Hướng dẫn chọn size
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {availableSizes.map((size: string) => {
            const outOfStock = isSizeOutOfStock(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                disabled={outOfStock}
                onClick={() => {
                  if (outOfStock) return;
                  setSelectedSize(isSelected ? '' : size);
                  setErrorMsg('');
                }}
                className={`relative py-2.5 px-4 text-center rounded-xl font-bold text-sm transition-all border ${
                  outOfStock
                    ? 'border-gray-200 text-gray-300 bg-gray-50 line-through cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
                {outOfStock && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">Hết</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tùy chọn Màu sắc */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900">Màu sắc <span className="text-red-500">*</span></h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(selectedColor === color ? '' : color); setErrorMsg(''); }}
                className={`py-2 px-4 text-center border rounded-xl font-medium text-sm transition-all ${
                  selectedColor === color 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600/20' 
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tùy chọn Số lượng & Hiển thị Tồn kho */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-sm font-bold text-gray-900">Số lượng</h3>
          <span className="text-xs">
            <span className="text-gray-500">Tồn kho: </span>
            {productStock <= 0 ? (
              <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">Hết hàng</span>
            ) : productStock <= 5 ? (
              <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Chỉ còn {productStock} sản phẩm!</span>
            ) : (
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Còn hàng ({productStock})</span>
            )}
          </span>
        </div>

        <div className="flex items-center w-32 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold transition-colors"
          >
            -
          </button>
          <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
          <button 
            onClick={() => {
              if (quantity < productStock) {
                setQuantity(quantity + 1);
              } else {
                setErrorMsg(`Rất tiếc, sản phẩm này chỉ còn ${productStock} sản phẩm trong kho!`);
              }
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Hành động Thêm giỏ / Mua ngay */}
      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        <button 
          onClick={handleAddToCart}
          disabled={!isReady || !inStock}
          className={`flex-1 border py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            !isReady || !inStock 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70' 
              : added 
                ? 'bg-green-50 border-green-600 text-green-600 hover:bg-green-100' 
                : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 shadow-sm'
          }`}
        >
          {added ? (
            <>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Đã thêm vào giỏ
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Thêm vào giỏ
            </>
          )}
        </button>

        <button 
          onClick={handleBuyNow}
          disabled={!isReady || !inStock}
          className={`flex-1 py-3.5 px-6 rounded-xl font-bold shadow-md transition-all ${
            !isReady || !inStock
              ? 'bg-blue-300 text-white cursor-not-allowed opacity-70 shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 active:scale-98'
          }`}
        >
          Mua Ngay
        </button>
      </div>

      {/* Thông tin Dịch vụ Cam kết */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase">Đổi trả 30 ngày</h4>
            <p className="text-xs text-gray-500 mt-0.5">Miễn phí đổi kích cỡ</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase">Bảo hành 12 tháng</h4>
            <p className="text-xs text-gray-500 mt-0.5">Chính hãng 100% KADY</p>
          </div>
        </div>
      </div>

    </div>
  );
}
