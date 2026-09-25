'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/shared/components/Breadcrumb';

interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
  sizes?: string[];
  colors?: string[];
}

import { useCartStore } from '@/shared/store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [loading, setLoading] = useState(true);

  // States cho tùy chọn mua hàng
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Zustand store
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // 1. Fetch Product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Dummy data for testing if API fails
          setProduct({
            product_id: "SHOE-CARB-902",
            name: "Giày Thể Thao Cao Cấp",
            price: 1500000,
            image_url: "https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8",
            brand: "SportsAI",
            rating: 4.8,
            reviews_count: 120,
            category: ["Giày thể thao", "Chạy bộ"]
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
    // 2. Track Interaction (View)
    trackInteraction('view');
  }, [product]);

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
    
    // Add extra info to cart item if needed (color)
    addItem({
      product_id: product!.product_id,
      name: product!.name,
      price: product!.price,
      image_url: product!.image_url,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    } as any); // Type cast since cartStore item might not have color yet
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
      product_id: product!.product_id,
      name: product!.name,
      price: product!.price,
      image_url: product!.image_url,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    } as any);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Tạo breadcrumb
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    ...(product.category ? product.category.map(c => ({ label: c, href: `/products?category=${c}` })) : [{ label: "Sản phẩm", href: "/products" }]),
    { label: product.name }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="flex flex-col md:flex-row">
            
            {/* Hình ảnh sản phẩm */}
            <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex items-center justify-center bg-gray-50/50">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full max-w-md object-contain rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded">
                  {product.brand || "SportsAI"}
                </span>
                <span className="text-sm text-gray-400">SKU: {product.product_id}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-700 font-medium">{product.rating || "4.5"}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">{product.reviews_count || 0} Đánh giá</span>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                <p className="text-sm text-gray-500 mt-2">Đã bao gồm VAT. Miễn phí vận chuyển cho đơn hàng trên 500k.</p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium border border-red-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errorMsg}
                </div>
              )}

              {/* Tùy chọn Size */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Kích cỡ <span className="text-red-500">*</span></h3>
                  <button className="text-sm text-blue-600 hover:underline">Hướng dẫn chọn size</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes?.length ? product.sizes : (product.category?.includes("Clothing") ? ['S', 'M', 'L', 'XL'] : ['39', '40', '41', '42', '43'])).map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setErrorMsg(''); }}
                      className={`py-2 px-4 text-center border rounded-md font-medium transition-colors ${
                        selectedSize === size 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tùy chọn Màu sắc */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Màu sắc <span className="text-red-500">*</span></h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => { setSelectedColor(color); setErrorMsg(''); }}
                        className={`py-2 px-4 text-center border rounded-md font-medium transition-colors ${
                          selectedColor === color 
                            ? 'border-blue-600 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tùy chọn Số lượng */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Số lượng</h3>
                <div className="flex items-center w-32 border border-gray-200 rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hành động */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 border py-3.5 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    added ? 'bg-green-50 border-green-600 text-green-600 hover:bg-green-100' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Đã thêm
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
                  className="flex-1 bg-blue-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
                >
                  Mua Ngay
                </button>
              </div>

              {/* Thông tin dịch vụ */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Đổi trả 30 ngày</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Miễn phí đổi kích cỡ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Bảo hành 12 tháng</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Chính hãng 100%</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tab Mô tả ngắn */}
        <div className="bg-white rounded-xl shadow-sm mt-8 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết sản phẩm</h2>
          <div className="prose prose-blue max-w-none text-gray-600">
            <p>
              <strong>{product.name}</strong> là sản phẩm chủ đạo trong bộ sưu tập mới nhất của <strong>{product.brand || "SportsAI"}</strong>. 
              Sản phẩm được thiết kế bằng chất liệu cao cấp, mang lại sự thoải mái tối đa và tối ưu hóa hiệu suất vận động cho người dùng.
            </p>
            <p className="mt-4">
              Với thiết kế tinh tế và công nghệ hiện đại, sản phẩm này phù hợp cho cả tập luyện chuyên nghiệp lẫn sử dụng hàng ngày trong các hoạt động thể thao {product.category?.join(", ")}.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
