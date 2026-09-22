'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [loading, setLoading] = useState(true);

  // For interactive states
  const [activeTab, setActiveTab] = useState('tab-desc');
  const [selectedColor, setSelectedColor] = useState('Xanh / Trắng Carbon');
  const [selectedSize, setSelectedSize] = useState('42');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    // 1. Fetch Product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setMainImage(data.image_url);
        } else {
          // Fallback to dummy data for UI testing if API fails
          setProduct({
            product_id: "SHOE-CARB-902",
            name: "Giày Chạy Bộ Marathon Carbon Alpha Pro",
            price: 2450000,
            image_url: "https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8",
            brand: "SportsAI Pro Athletics",
            rating: 4.9,
            reviews_count: 184
          });
          setMainImage("https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, router]);

  useEffect(() => {
    // 2. Track Interaction (View)
    if (product) {
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
            interaction_type: 'view'
          })
        }).catch(err => console.error('Tracking failed', err));
      }
    }
  }, [product]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-md">Đang tải dữ liệu...</div>;
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <main className="w-full pt-28 bg-surface">
        <div className="flex flex-col w-full">
            {/* Breadcrumb Navigation */}
            <div className="w-full px-margin-desktop py-space-md bg-surface-container-lowest">
                <nav className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                    <a className="hover:text-primary transition-colors" href="#">Trang chủ</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="#">Giày thể thao</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <a className="hover:text-primary transition-colors" href="#">Giày chạy bộ Marathon</a>
                    <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                    <span className="text-on-surface font-semibold truncate max-w-xs md:max-w-md">Giày Chạy Bộ Marathon
                        Carbon Alpha Pro</span>
                </nav>
            </div>
            {/* Main Product Section: 55% - 45% Split */}
            <div className="w-full px-margin-desktop py-space-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
                    {/* Left Column: Gallery (7 cols ~ 58%) */}
                    <div className="lg:col-span-7 flex flex-col gap-space-lg">
                        {/* Main Image Stage */}
                        <div
                            className="relative w-full aspect-square bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-space-md">
                            {/* Tag Badges */}
                            <div
                                className="absolute top-space-lg left-space-lg z-10 flex flex-col gap-space-xs items-start">
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-wider bg-on-surface text-surface px-space-md py-1 rounded font-bold shadow-sm">
                                    BEST SELLER 2025
                                </span>
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-wider bg-primary text-on-primary px-space-md py-1 rounded font-semibold shadow-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                                    ĐĨA ĐỆM CARBON FULL-LENGTH
                                </span>
                            </div>
                            {/* Zoom Toggle Action */}
                            <button
                                className="absolute top-space-lg right-space-lg z-10 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm"
                                id="zoomBtn" title="Phóng to ảnh">
                                <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                            </button>
                            {/* Primary Photo with dynamic src swapping */}
                            <img alt="Giày Chạy Bộ Marathon Carbon Alpha Pro"
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                id="mainProductImage"
                                src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                            <div
                                className="absolute bottom-space-md right-space-md bg-surface-container-lowest/80 backdrop-blur-sm px-space-sm py-0.5 rounded text-secondary font-data-mono text-label-sm">
                                Tỉ lệ 1:1 HD Studio
                            </div>
                        </div>
                        {/* Thumbnails Strip */}
                        <div className="grid grid-cols-4 gap-space-md" id="thumbnailStrip">
                            <button
                                className="thumb-btn active aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all bg-surface-container-high"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8">
                                <img alt="Màu Xanh Trắng Carbon" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8">
                                <img alt="Màu Đen Neon Stealth" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM">
                                <img alt="Màu Trail Explorer Xám" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI">
                                <img alt="Màu Trắng Pure White" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI" />
                            </button>
                        </div>
                    </div>
                    {/* Right Column: Purchasing & Specifications (5 cols ~ 42%) */}
                    <div className="lg:col-span-5 flex flex-col gap-space-lg">
                        {/* Meta & Titles */}
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-widest text-primary font-bold">
                                    SportsAI Pro Athletics
                                </span>
                                <span className="font-data-mono text-label-sm text-outline">SKU: SHOE-CARB-902</span>
                            </div>
                            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            {product.name}
          </h1>
                            {/* Ratings & Counters */}
                            <div className="flex items-center justify-between pt-space-xs pb-space-sm">
                                <div className="flex items-center gap-space-sm">
                                    <div className="flex items-center text-amber-500 font-label-md text-label-md font-bold">
                                        <span className="material-symbols-outlined text-[18px] text-amber-500"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="ml-1 text-on-surface">4.9</span>
                                    </div>
                                    <span className="text-outline">/</span>
                                    <a className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors underline decoration-outline-variant"
                                        href="#reviewsSection">
                                        184 đánh giá
                                    </a>
                                    <span className="text-outline">•</span>
                                    <span className="font-data-mono text-body-sm text-secondary">1.250 đã bán</span>
                                </div>
                                {/* Social Share & Wishlist */}
                                <div className="flex items-center gap-space-xs">
                                    <button
                                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
                                        title="Chia sẻ">
                                        <span className="material-symbols-outlined text-[18px]">share</span>
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-error transition-colors"
                                        id="heartBtn" title="Lưu yêu thích">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Price Section */}
                        <div
                            className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-xs shadow-sm">
                            <div className="flex items-baseline gap-space-md">
                                <span
                                    className="font-headline-xl text-headline-xl font-bold text-on-surface font-data-mono">
                                    2.450.000 đ
                                </span>
                                <span className="font-body-md text-body-md text-outline line-through font-data-mono">
              {formatPrice(product.price * 1.2)}
            </span>
                                <span
                                    className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">
                                    -15% GIẢM
                                </span>
                            </div>
                            {/* VIP Member Incentive Pill */}
                            <div
                                className="mt-space-xs p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-space-xs text-on-surface">
                                    <span
                                        className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                                    <span className="font-label-sm text-label-sm">Ưu đãi Hội viên VIP Gold: Giảm thêm
                                        5%</span>
                                </div>
                                <span className="font-data-mono text-label-sm text-primary font-bold">còn 2.327.500 đ</span>
                            </div>
                        </div>
                        {/* Color Selector */}
                        <div className="flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Màu sắc: <span
                                        className="text-primary font-bold" >{selectedColor}</span></span>
                                <span className="font-label-sm text-label-sm text-secondary">3 tùy chọn</span>
                            </div>
                            <div className="flex items-center gap-space-md" id="colorSelector">
                                <button
                                    className="color-btn active group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg shadow-sm"
                                    data-color="Xanh / Trắng Carbon"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8">
                                    <span className="w-4 h-4 rounded-full bg-blue-500 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Xanh /
                                        Trắng</span>
                                </button>
                                <button
                                    className="color-btn group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg hover:bg-surface-container-high transition-colors"
                                    data-color="Đen Neon Stealth"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8">
                                    <span className="w-4 h-4 rounded-full bg-zinc-900 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Đen
                                        Neon</span>
                                </button>
                                <button
                                    className="color-btn group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg hover:bg-surface-container-high transition-colors"
                                    data-color="Trắng Tối giản Pure"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI">
                                    <span className="w-4 h-4 rounded-full bg-slate-200 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Trắng Tối
                                        giản</span>
                                </button>
                            </div>
                        </div>
                        {/* Size Selector */}
                        <div className="flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Kích cỡ
                                        (EU):</span>
                                    <span className="font-label-sm text-label-sm text-error font-medium">Còn 5 đôi
                                        cuối</span>
                                </div>
                                <button
                                    className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-0.5"
                                    id="openSizeGuideModal">
                                    <span className="material-symbols-outlined text-[15px]">straighten</span>
                                    Xem bảng quy đổi size
                                </button>
                            </div>
                            <div className="grid grid-cols-6 gap-space-sm" id="sizeSelector">
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">39</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">40</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">41</button>
                                <button
                                    className="size-btn active py-2.5 bg-on-surface text-surface font-data-mono font-bold rounded text-center shadow-sm">42</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">43</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">44</button>
                            </div>
                        </div>
                        {/* SportsAI Smart Fit Box */}
                        <div
                            className="p-space-md bg-surface-container-lowest rounded-xl flex items-start gap-space-md shadow-sm">
                            <div
                                className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-[20px]">psychology</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-space-xs">
                                    <span
                                        className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">SportsAI
                                        Smart Fit Engine</span>
                                    <span
                                        className="font-data-mono text-[10px] bg-primary text-on-primary px-1 rounded font-bold">98.4%
                                        MATCH</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    Dựa trên hồ sơ thể trạng và chiều dài bàn chân <strong>26.2 cm</strong> của bạn:
                                    Khuyên dùng <strong>Size 42 EU</strong> cho độ ôm chân và khoảng thở ngón tối ưu
                                    trong cự ly 42km.
                                </p>
                            </div>
                        </div>
                        {/* Quantity & Stock Warning */}
                        <div className="flex items-center justify-between pt-space-xs">
                            <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 shadow-sm">
                                <button
                                    className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container rounded transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span className="w-12 text-center font-data-mono text-body-md font-bold text-on-surface"
                                    >{quantity}</span>
                                <button
                                    className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container rounded transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <div className="flex items-center gap-space-xs text-tertiary font-label-sm text-label-sm">
                                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                <span>Sẵn hàng tại Kho Tổng TP. Hồ Chí Minh (Giao 2H)</span>
                            </div>
                        </div>
                        {/* Call to Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                            <button
                                className="w-full py-3.5 px-space-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold rounded-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                THÊM VÀO GIỎ HÀNG
                            </button>
                            <button
                                className="w-full py-3.5 px-space-lg bg-on-surface text-surface font-label-lg text-label-lg font-bold rounded-md hover:bg-surface-dim hover:text-on-surface transition-all flex items-center justify-center gap-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">bolt</span>
                                MUA NGAY - THANH TOÁN
                            </button>
                        </div>
                        {/* Service Perks (Flat Corporate Grid) */}
                        <div className="grid grid-cols-2 gap-space-sm pt-space-sm">
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Freeship từ
                                        500k</span>
                                    <span className="font-data-mono text-[11px] text-outline">Giao toàn quốc</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span
                                    className="material-symbols-outlined text-primary text-[20px]">published_with_changes</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Đổi size tận
                                        nhà</span>
                                    <span className="font-data-mono text-[11px] text-outline">Miễn phí 30 ngày</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Bảo hành 12
                                        tháng</span>
                                    <span className="font-data-mono text-[11px] text-outline">Chính hãng SportsAI</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Cam kết
                                        chính hãng</span>
                                    <span className="font-data-mono text-[11px] text-outline">Đền 200% nếu giả</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Frequently Bought Together / AI Bundle Module */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface-container-low">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
                        <div>
                            <span
                                className="font-data-mono text-label-sm uppercase tracking-wider text-primary font-bold">AI
                                Bundle Optimization</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Thường được mua cùng
                                bởi các Runner</h2>
                        </div>
                        <span
                            className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-space-md py-1 rounded">Dựa
                            trên 4.280 lượt check-out hoàn tất</span>
                    </div>
                    <div
                        className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                        {/* Products Bundle List */}
                        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-space-md justify-between">
                            {/* Item 1: Main Product */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Giày Carbon Alpha Pro" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-primary font-bold">Sản phẩm này</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Carbon
                                        Alpha Pro</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">2.450.000
                                        đ</span>
                                </div>
                            </div>
                            <span
                                className="material-symbols-outlined text-outline text-[22px] font-bold">tv_displays</span>
                            {/* Item 2: Shirt */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Áo Dry-Fit Pro Training" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1VE-hqvUemUK6N47JSYgfDzkBS4bH6pglQLHkBHQHGW9F5neVdsYhOTvLyioiwBkQ-jzV46G-xMRZK8mSQHq3ItZm2RD5qOp97bloqe0E9k7CFr8K2ZhlL3rHIGB3aWo66CZNKkfUypi_8kWKyaZ9WSQBJfS1cIPQ1f-QNAa0iDvrRiDuI7pSGn-wMQppazs6defjcrfwM6-swS9CnIxuLZiBPRovmW2pQwfezy5nlXPepDhK13iud2lQ" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-secondary">Trang phục</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Áo
                                        Dry-Fit Pro</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">350.000
                                        đ</span>
                                </div>
                            </div>
                            <span
                                className="material-symbols-outlined text-outline text-[22px] font-bold">tv_displays</span>
                            {/* Item 3: Shorts */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Quần Short Gym Co Giãn" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1Wd8RCctv-QUzuwuOymo5pIfZ1uSln5WSqLfEH2aJe9onchv0p9SVnhAZRj_Gszi1VzShIG3joPkUXGkxEY5DtHJ4-mMOYWNfq28XqRReeTn74kXh_Xde20tBJieHOTTxpVLljwZUyH-K7rcTsRpdOwbBhzfUZ1XC0FBRp2TxuScPxRu8eOq6dQ1MC8Oc4gqKPzJpod4OmuHZ_9CMqsc2LQ1E_IfgaHDo0kleRs2-YAh-LBhcofpLrGTAg" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-secondary">Trang phục</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Quần
                                        Short Gym Co Giãn</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">280.000
                                        đ</span>
                                </div>
                            </div>
                        </div>
                        {/* Bundle Pricing & CTA */}
                        <div
                            className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-lg">
                            <div className="flex items-baseline justify-between">
                                <span className="font-label-md text-label-md text-secondary">Giá mua lẻ 3 món:</span>
                                <span className="font-data-mono text-body-sm text-outline line-through">3.080.000 đ</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-label-lg text-label-lg text-on-surface font-bold">Giá ưu đãi trọn
                                    bộ:</span>
                                <div className="flex items-baseline gap-space-xs">
                                    <span
                                        className="font-headline-md text-headline-md text-error font-bold font-data-mono">2.618.000
                                        đ</span>
                                    <span
                                        className="font-data-mono text-[11px] bg-error text-on-error px-1 py-0.2 rounded font-bold">-15%</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-2.5 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded hover:bg-primary-container transition-colors flex items-center justify-center gap-space-xs mt-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                Thêm cả bộ 3 sản phẩm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Detailed Specifications & Tabs Section */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    {/* Tab Controls */}
                    <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl w-fit"
                        id="tabGroup">
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-desc" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-desc")}>Mô tả &amp; Công nghệ</button>
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-size" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-size")}>Bảng kích cỡ (Size Guide)</button>
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-reviews" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-reviews")}>Đánh giá từ khách hàng (184)</button>
                    </div>
                    {/* Tab 1: Description & Specs */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "tab-desc" ? "block" : "hidden"}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
                            <div className="lg:col-span-7 flex flex-col gap-space-md">
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                                    Công nghệ Chế tác Đỉnh cao cho Chặng đua Marathon
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    <strong>Giày Chạy Bộ Marathon Carbon Alpha Pro</strong> được nghiên cứu và tinh
                                    chỉnh thông qua thuật toán sinh trắc học NCF 2.0. Đôi giày tối ưu hóa lực hoàn trả
                                    sau mỗi cú chạm đất, hỗ trợ duy trì guồng chân (cadence) ổn định xuyên suốt 42.195
                                    km.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                                    <div
                                        className="p-space-md bg-surface-container-lowest rounded-xl flex flex-col gap-1 shadow-sm">
                                        <div className="flex items-center gap-space-xs text-primary font-bold">
                                            <span className="material-symbols-outlined text-[20px]">layers</span>
                                            <span className="font-label-lg text-label-lg">Carbon-Drive Plate</span>
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                                            Tấm sợi carbon nguyên khối uốn cong dạng thìa sóng (spoon-shaped) giúp tạo
                                            lực đẩy tiến về phía trước mạnh mẽ tại pha búng ngón (toe-off).
                                        </p>
                                    </div>
                                    <div
                                        className="p-space-md bg-surface-container-lowest rounded-xl flex flex-col gap-1 shadow-sm">
                                        <div className="flex items-center gap-space-xs text-primary font-bold">
                                            <span className="material-symbols-outlined text-[20px]">speed</span>
                                            <span className="font-label-lg text-label-lg">Nitro-Foam Supercritical</span>
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                                            Bọt đệm nén siêu tới hạn với nitơ lỏng đạt mức hoàn trả năng lượng lên tới
                                            85%, giảm thiểu tối đa áp lực tải lên khớp gối và cơ bắp.
                                        </p>
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    Phần thân trên (Upper) ứng dụng sợi nguyên khối Nano-Weave siêu nhẹ, kháng nước văng
                                    nhẹ và gia tăng lưu thông luồng khí 40% so với lưới truyền thống, giữ bàn chân luôn
                                    khô ráo trong điều kiện thời tiết nhiệt đới.
                                </p>
                            </div>
                            {/* Specs Table (High Density Corporate Format) */}
                            <div className="lg:col-span-5 flex flex-col gap-space-sm">
                                <h4
                                    className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
                                    Thông số kỹ thuật chi tiết</h4>
                                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left font-body-sm text-body-sm">
                                        <tbody>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Trọng lượng
                                                </td>
                                                <td
                                                    className="py-2.5 px-space-md font-data-mono font-semibold text-on-surface">
                                                    198 gram (Size 42 EU)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Độ chênh lệch
                                                    gót - mũi (Drop)</td>
                                                <td
                                                    className="py-2.5 px-space-md font-data-mono font-semibold text-on-surface">
                                                    8 mm (Gót 38mm / Mũi 30mm)</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Đĩa đệm
                                                    (Carbon Plate)</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Carbon
                                                    Fiber 3K Full-length</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Chất liệu đệm
                                                    giữa (Midsole)</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Nitro-Foam
                                                    Dual-Density</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Cự ly tối ưu
                                                </td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">
                                                    Half-Marathon (21K) &amp; Full (42K)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Bề mặt chạy
                                                    phù hợp</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Đường nhựa
                                                    Road, Đường điền kinh Track</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Xuất xứ / Tiêu
                                                    chuẩn</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">SportsAI
                                                    R&amp;D Lab Vietnam / Tiêu chuẩn World Athletics</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tab 2: Size Guide Table */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "tab-size" ? "block" : "hidden"}`}>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Bảng quy đổi kích cỡ
                                chuẩn quốc tế</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Để có trải nghiệm chạy marathon
                                hoàn hảo, hãy đo từ gót chân đến đầu ngón chân dài nhất và cộng thêm 0.5cm.</p>
                        </div>
                        <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-sm">
                            <table className="w-full text-left font-data-mono text-body-sm">
                                <thead>
                                    <tr className="bg-surface-container-high text-on-surface">
                                        <th className="py-3 px-space-md font-bold uppercase">EU Size</th>
                                        <th className="py-3 px-space-md font-bold uppercase">US Men</th>
                                        <th className="py-3 px-space-md font-bold uppercase">UK Size</th>
                                        <th className="py-3 px-space-md font-bold uppercase">Chiều dài chân (CM)</th>
                                        <th className="py-3 px-space-md font-bold uppercase">SportsAI Khuyên dùng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">39</td>
                                        <td className="py-3 px-space-md">6.5</td>
                                        <td className="py-3 px-space-md">6.0</td>
                                        <td className="py-3 px-space-md">24.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Phù hợp bàn chân thon</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">40</td>
                                        <td className="py-3 px-space-md">7.5</td>
                                        <td className="py-3 px-space-md">7.0</td>
                                        <td className="py-3 px-space-md">25.0 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cỡ thông thường</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">41</td>
                                        <td className="py-3 px-space-md">8.0</td>
                                        <td className="py-3 px-space-md">7.5</td>
                                        <td className="py-3 px-space-md">25.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cỡ thông thường</td>
                                    </tr>
                                    <tr className="bg-primary/5 font-semibold text-primary">
                                        <td className="py-3 px-space-md font-bold">42 (Đang chọn)</td>
                                        <td className="py-3 px-space-md">8.5</td>
                                        <td className="py-3 px-space-md">8.0</td>
                                        <td className="py-3 px-space-md font-bold">26.0 - 26.5 cm</td>
                                        <td className="py-3 px-space-md font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Phù
                                            hợp với bạn nhất
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">43</td>
                                        <td className="py-3 px-space-md">9.5</td>
                                        <td className="py-3 px-space-md">9.0</td>
                                        <td className="py-3 px-space-md">27.0 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cho bàn chân bè ngang</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">44</td>
                                        <td className="py-3 px-space-md">10.0</td>
                                        <td className="py-3 px-space-md">9.5</td>
                                        <td className="py-3 px-space-md">27.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Bàn chân lớn</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Tab 3: Customer Reviews */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "reviewsSection" ? "block" : "hidden"}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
                            {/* Rating Breakdown Summary */}
                            <div
                                className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-md shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <span
                                        className="font-headline-xl text-headline-xl font-bold text-on-surface font-data-mono">4.9</span>
                                    <div className="flex items-center text-amber-500 my-1">
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-secondary">Dựa trên 184 đánh giá thực
                                        tế</span>
                                </div>
                                {/* Star Bars Visualization */}
                                <div className="flex flex-col gap-space-xs font-data-mono text-label-sm">
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">5 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[90%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">166</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">4 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[8%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">14</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">3 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[2%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">4</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm text-outline">
                                        <span className="w-10">2 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[0%]"></div>
                                        </div>
                                        <span className="w-8 text-right">0</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm text-outline">
                                        <span className="w-10">1 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[0%]"></div>
                                        </div>
                                        <span className="w-8 text-right">0</span>
                                    </div>
                                </div>
                            </div>
                            {/* Reviews Feed */}
                            <div className="lg:col-span-8 flex flex-col gap-space-md">
                                {/* Review 1 */}
                                <div
                                    className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-sm shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-space-sm">
                                            <div
                                                className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center font-data-mono">
                                                LH
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-space-xs">
                                                    <span
                                                        className="font-label-lg text-label-lg font-bold text-on-surface">Lê
                                                        Hoàng Nam (Marathoner)</span>
                                                    <span
                                                        className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 rounded font-semibold">Đã
                                                        mua hàng</span>
                                                </div>
                                                <span className="font-data-mono text-[11px] text-secondary">Phân loại: Xanh
                                                    / Trắng • Size 42</span>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface">
                                        Vừa hoàn thành giải marathon cự ly 42km cuối tuần qua với đôi giày này. Đĩa
                                        carbon cực kỳ nảy, giữ cadence rất đều ở pace 4:45 mà không hề bị mỏi cổ chân.
                                        Lớp bọt Nitro êm ái hơn hẳn các dòng trước. Rất xứng đáng từng đồng bỏ ra!
                                    </p>
                                    <div className="flex items-center gap-space-sm pt-space-xs">
                                        <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden p-0.5">
                                            <img alt="Ảnh thực tế người mua" className="w-full h-full object-contain"
                                                src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                                        </div>
                                        <span className="font-label-sm text-label-sm text-outline">Đính kèm ảnh chạy thực
                                            tế</span>
                                    </div>
                                </div>
                                {/* Review 2 */}
                                <div
                                    className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-sm shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-space-sm">
                                            <div
                                                className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center justify-center font-data-mono">
                                                TD
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-space-xs">
                                                    <span
                                                        className="font-label-lg text-label-lg font-bold text-on-surface">Trần
                                                        Minh Đức</span>
                                                    <span
                                                        className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 rounded font-semibold">Đã
                                                        mua hàng</span>
                                                </div>
                                                <span className="font-data-mono text-[11px] text-secondary">Phân loại: Đen
                                                    Neon • Size 41</span>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface">
                                        Tư vấn size AI của website rất chuẩn xác. Chân mình 25.5cm chọn size 41 mang vừa
                                        khít, upper dệt thoáng mát chạy giữa trưa nắng không bị bí rộp ngón chân. Đóng
                                        gói hộp rất cao cấp, ship 2H đúng hẹn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Related & Recommended Products (AI Engine Grid) */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface-container-low">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                        <div>
                            <span
                                className="font-data-mono text-label-sm uppercase tracking-wider text-primary font-bold">Neural
                                Recommendations</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Sản phẩm liên quan
                                bạn có thể quan tâm</h2>
                        </div>
                        <a className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-0.5"
                            href="#">
                            Khám phá toàn bộ danh mục <span
                                className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </a>
                    </div>
                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
                        {/* Card 1 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-on-surface text-surface text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    TRAINING
                                </span>
                                <img alt="Giày Training Đa Năng Shadow Blade"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Speed</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Training Đa Năng Shadow Blade
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.890.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-tertiary text-on-tertiary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    TRAIL RUN
                                </span>
                                <img alt="Giày Chạy Địa Hình Trail Explorer Pro"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Outdoor</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Chạy Địa Hình Trail Explorer Pro
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">2.150.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    LIFESTYLE
                                </span>
                                <img alt="Giày Thể Thao Classic Streetwear"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Lifestyle</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Thể Thao Classic Streetwear
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.450.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    EQUIPMENT
                                </span>
                                <img alt="Đôi Tạ Tay Thông Minh 10kg Điều Chỉnh"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VHFXTP4eYC5cfPd4HH2jWZFHyOdOS5lZjD7lFq05nSDbBBbJXSMtlYlAAg2yPIwAjdOX28KCOV-O63yuw4cUxEMRLGF5T_oKcIB6XdjRk42p5HM_IFkGqBECHfHN6OEoiUrMIuqA8PDj3wBwz38l4dAo9vs3xatPZB07RBqe6n5C2uGlayqx_s84mPljbN1YSdFAOd7_OYZIESr4SWQuOWuZXWeBqIZTJlqatGBwEPiAP4oiyY9mdE1rs" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Gear</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Đôi Tạ Tay Thông Minh 10kg Điều Chỉnh
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.850.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Interactive JavaScript for Product Page Mechanics */}
            
        </div>
    </main>
    </>
  );
}
