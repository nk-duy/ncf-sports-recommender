'use client';

import React, { useState } from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  images?: string[];
  productName: string;
}

export default function ProductImageGallery({
  mainImage,
  images = [],
  productName,
}: ProductImageGalleryProps) {
  // Chuẩn hóa danh sách ảnh (ít nhất 3-4 ảnh để làm thumbnail)
  const allImages = React.useMemo(() => {
    const list = [mainImage, ...(images || [])].filter(Boolean);
    // Nếu chỉ có 1 ảnh, tạo biến thể ảnh minh họa các góc nhìn
    if (list.length === 1) {
      return [
        mainImage,
        mainImage + '?angle=2',
        mainImage + '?angle=3',
        mainImage + '?angle=4',
      ];
    }
    return Array.from(new Set(list));
  }, [mainImage, images]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const currentImage = allImages[selectedIdx] || mainImage;

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
    <div className="w-full flex flex-col gap-4">
      {/* Khung ảnh chính với hiệu ứng Hover Zoom */}
      <div
        className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center cursor-zoom-in group shadow-inner"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={currentImage}
          alt={`${productName} - Ảnh ${selectedIdx + 1}`}
          className={`w-full h-full object-contain p-4 transition-transform duration-300 ${
            zoomPos.show ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Nút phóng to Lightbox ở góc */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 p-2.5 rounded-full shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
          title="Phóng to ảnh"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        {/* Badge chuyển góc nhìn */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full pointer-events-none font-medium">
          {selectedIdx + 1} / {allImages.length}
        </div>
      </div>

      {/* Danh sách Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-gray-50 hover:opacity-90 ${
              selectedIdx === idx
                ? 'border-blue-600 ring-2 ring-blue-600/20 scale-95 shadow-sm'
                : 'border-gray-200 opacity-70 hover:border-gray-300'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-contain"
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
