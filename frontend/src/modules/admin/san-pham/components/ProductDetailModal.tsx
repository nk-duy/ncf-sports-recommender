'use client';
import React, { useState } from 'react';
import { 
  X, ExternalLink, Edit3, Eye, EyeOff, Tag, Package, Star, 
  Layers, Palette, Ruler, CheckCircle2, AlertTriangle, ShieldCheck, 
  Calendar, Info, ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

interface ProductDetailModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: any) => void;
  onToggleVisibility?: (product: any) => void;
  formatPrice: (price: number) => string;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onEdit,
  onToggleVisibility,
  formatPrice,
}: ProductDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');

  if (!isOpen || !product) return null;

  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  const mainImage = selectedImage || product.image_url || FALLBACK_IMG;

  // Extract gallery images
  const rawImages: string[] = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image_url || FALLBACK_IMG];

  const stockNum = typeof product.stock === 'number' ? product.stock : 100;
  const isOutOfStock = stockNum <= 0;
  const isLowStock = stockNum > 0 && stockNum <= 10;

  const discountPercent = product.discount_percent || 0;
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount ? product.price * (1 - discountPercent / 100) : product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 via-white to-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-500/25">
              <Package size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Chi tiết sản phẩm</h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                  {product.product_id}
                </span>
              </div>
              <p className="text-xs text-gray-500">Xem toàn bộ thông tin kho, phân loại, giá bán và đặc tính</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/san-pham/${product.product_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
              title="Xem trang hiển thị ngoài Website"
            >
              <span>Xem ngoài Web</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition cursor-pointer"
              aria-label="Đóng"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Cột trái: Ảnh sản phẩm + Gallery (5/12 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center p-2 group">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    -{discountPercent}%
                  </span>
                )}
                {product.is_hidden && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                    Đang ẩn
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {rawImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {rawImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 p-1 transition cursor-pointer bg-white ${
                        mainImage === img 
                          ? 'border-blue-600 ring-2 ring-blue-500/20' 
                          : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cột phải: Thông số chi tiết (7/12 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Tên sản phẩm & Thương hiệu */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {product.brand && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {product.brand}
                    </span>
                  )}
                  {product.gender && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      Dành cho: {product.gender}
                    </span>
                  )}
                  {product.sport_type && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Môn: {product.sport_type}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {product.name}
                </h3>
              </div>

              {/* Hộp Giá bán & Tồn kho */}
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">Giá bán hiện tại:</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-red-600">
                      {formatPrice(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 font-medium block">Trạng thái kho:</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isOutOfStock
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : isLowStock
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {(isOutOfStock || isLowStock) ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                      {isOutOfStock ? 'Hết hàng (0)' : isLowStock ? `Sắp hết (${stockNum})` : `${stockNum} chiếc có sẵn`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danh mục & Phân cấp */}
              {Array.isArray(product.category) && product.category.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} />
                    Danh mục phân cấp:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.category.map((cat: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Thuộc tính Kích cỡ & Màu sắc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Sizes */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler size={13} />
                    Kích cỡ có sẵn:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                      product.sizes.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 shadow-2xs">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">Tiêu chuẩn / Freesize</span>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={13} />
                    Màu sắc:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(product.colors) && product.colors.length > 0 ? (
                      product.colors.map((c: string) => (
                        <span key={c} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">Mặc định theo ảnh</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Đánh giá & Phản hồi */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-400" />
                  <span className="font-bold text-gray-900">{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
                  <span className="text-gray-400">({product.reviews_count || product.reviewsCount || 0} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingCart size={14} className="text-gray-400" />
                  <span>Đã bán: <strong className="text-gray-900">{product.sold || 0}</strong></span>
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              {product.description && (
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Info size={13} />
                    Mô tả sản phẩm:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100 max-h-36 overflow-y-auto">
                    {product.description}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {onToggleVisibility && (
              <button
                type="button"
                onClick={() => {
                  onToggleVisibility(product);
                  onClose();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  product.is_hidden
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {product.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{product.is_hidden ? 'Hiện ra cửa hàng' : 'Ẩn khỏi cửa hàng'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(product);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa sản phẩm</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
