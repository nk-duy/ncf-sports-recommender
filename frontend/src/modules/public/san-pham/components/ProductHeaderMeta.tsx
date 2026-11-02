'use client';

import { Heart } from 'lucide-react';
import ProductVouchersSection from './ProductVouchersSection';
import { formatVndCurrency } from '../utils/productStockUtils';
import type { ProductDetail } from '../types';

interface ProductHeaderMetaProps {
  product: ProductDetail;
  inStock: boolean;
  isWishlistedProduct: boolean;
  onToggleWishlist: () => void;
}

export default function ProductHeaderMeta({
  product,
  inStock,
  isWishlistedProduct,
  onToggleWishlist,
}: ProductHeaderMetaProps) {
  return (
    <>
      {/* 1. Dòng Thương hiệu & SKU & Trạng thái tồn kho */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded tracking-wide uppercase">
            {product.brand || 'KADY SPORTS'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 font-mono text-xs">Mã SKU: {product.product_id}</span>
          <span className="text-slate-300">|</span>
          {inStock ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Còn hàng
            </span>
          ) : (
            <span className="text-red-500 font-semibold text-xs">Tạm hết hàng</span>
          )}
        </div>

        {/* Nút Yêu thích (Wishlist) */}
        <button
          type="button"
          onClick={onToggleWishlist}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-semibold ${
            isWishlistedProduct
              ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-2xs'
              : 'border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50'
          }`}
          title={isWishlistedProduct ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={16} className={isWishlistedProduct ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
          <span>{isWishlistedProduct ? 'Đã thích' : 'Yêu thích'}</span>
        </button>
      </div>

      {/* 2. Tên sản phẩm */}
      <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">{product.name}</h1>

      {/* 3. Thanh chỉ số uy tín (Chuẩn Shopee Mall) */}
      <div className="flex items-center flex-wrap gap-3 text-xs text-slate-600 pb-0.5">
        <div className="flex items-center text-amber-500 font-bold">
          <span>
            {product.rating !== undefined && product.rating !== null ? Number(product.rating).toFixed(1) : '0.0'}
          </span>
          <div className="flex ml-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'fill-slate-200 text-slate-200'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-slate-300">|</span>
        <a href="#reviews" className="hover:text-blue-600 transition-colors">
          <strong className="text-slate-800">{product.reviews_count || 0}</strong> Đánh giá
        </a>
        {typeof product.sold_count === 'number' && product.sold_count > 0 && (
          <>
            <span className="text-slate-300">|</span>
            <span>
              Đã bán <strong className="text-slate-800">{product.sold_count}</strong>
            </span>
          </>
        )}
        <span className="text-slate-300">|</span>
        <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Đảm bảo chính hãng
        </span>
      </div>

      {/* 4. Khung Giá bán nổi bật (Price Box) */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50 px-4 py-3 rounded-xl border border-blue-100/80 flex items-baseline gap-3 flex-wrap">
        {product.discount_percent && product.discount_percent > 0 ? (
          <>
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight">
              {formatVndCurrency(product.price * (1 - product.discount_percent / 100))}
            </span>
            <span className="text-sm text-slate-400 line-through">
              {formatVndCurrency(product.price)}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-100/90 px-2 py-0.5 rounded-full">
              -{product.discount_percent}%
            </span>
          </>
        ) : (
          <span className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight">
            {formatVndCurrency(product.price)}
          </span>
        )}
      </div>

      {/* 5. Thanh Mã giảm giá dạng Ticket */}
      <ProductVouchersSection />

      {/* 6. Thông tin Vận chuyển nhanh 1 dòng */}
      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50/60 border border-slate-100 px-3 py-2 rounded-lg">
        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span>
          <strong className="text-emerald-700">Miễn phí vận chuyển</strong> đơn từ 500.000đ • Giao hàng toàn quốc 2 - 4 ngày
        </span>
      </div>
    </>
  );
}
