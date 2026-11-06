'use client';

import React, { useState } from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
  productName: string;
}

const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";

export default function ProductImageGallery({
  mainImage,
  images = [],
  productName,
}: ProductImageGalleryProps) {
  // Chuẩn hóa danh sách ảnh: Đảm bảo đúng 4 ô ảnh chi tiết
  const allImages = React.useMemo(() => {
    const list = (images && images.length > 0) ? [...images] : [];
    
    // Nếu mảng images đã có đủ 4 phần tử
    if (list.length >= 4) {
      return list.slice(0, 4);
    }
    
    // Nếu chưa đủ 4 phần tử, lặp lại dựa trên mainImage với hậu tố view=1..4
    const base = mainImage || DEFAULT_FALLBACK_IMG;
    const sep = base.includes('?') ? '&' : '?';
    const result = [...list];
    for (let i = result.length + 1; i <= 4; i++) {
      result.push(`${base}${sep}view=${i}`);
    }
    return result;
  }, [mainImage, images]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const currentImage = allImages[selectedIdx] || mainImage || DEFAULT_FALLBACK_IMG;

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_FALLBACK_IMG;
  };

  // Xử lý zoom khi rê chuột qua ảnh chính
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos({ x: 0, y: 0, show: false });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Khung ảnh chính vuông vức chuẩn E-Commerce */}
      <div
        className="relative w-full aspect-square max-h-[400px] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center cursor-zoom-in group shadow-xs hover:shadow-md transition-all mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Badge góc trái trên: Chính hãng 100% */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            Chính hãng 100%
          </span>
        </div>

        <img
          src={currentImage}
          alt={`${productName} - Ảnh ${selectedIdx + 1}`}
          className={`w-full h-full object-contain p-2.5 transition-transform duration-300 ease-out select-none hover:scale-105 ${
            zoomPos.show ? 'scale-110 drop-shadow-md' : 'scale-100'
          }`}
          loading="eager"
          onError={handleImgError}
        />

        {/* Nút phóng to Lightbox ở góc */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-10 border border-slate-100 cursor-pointer"
          title="Phóng to ảnh (Toàn màn hình)"
          type="button"
        >
          <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        {/* Badge chuyển góc nhìn / tổng số ảnh */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/75 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none font-medium shadow-xs tracking-wider">
          {selectedIdx + 1} / {allImages.length}
        </div>
      </div>

      {/* Danh sách 4 ảnh nhỏ (thumbnails) */}
      <div className="flex justify-center gap-2 sm:gap-2.5 mt-3 w-full overflow-x-auto py-1">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border transition-all p-0.5 bg-white shrink-0 cursor-pointer ${
              selectedIdx === idx
                ? 'ring-2 ring-blue-600 border-transparent shadow-sm scale-100'
                : 'border-slate-200/90 opacity-80 hover:opacity-100 hover:border-slate-300'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover rounded-md select-none"
              loading="lazy"
              onError={handleImgError}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal xem ảnh toàn màn hình */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Nút đóng */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Nút Previous */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
            className="absolute left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Khung ảnh chính trong Modal */}
          <div className="max-w-4xl max-h-[85vh] p-4 flex flex-col items-center">
            <img
              src={currentImage}
              alt={productName}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
              onError={handleImgError}
            />
            <p className="text-white/80 text-sm mt-4 font-medium">
              {productName} ({selectedIdx + 1}/{allImages.length})
            </p>
          </div>

          {/* Nút Next */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
            className="absolute right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
