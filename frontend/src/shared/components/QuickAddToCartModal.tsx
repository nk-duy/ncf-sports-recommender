'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useCartStore } from '@/shared/store/cartStore';
import { getMatchingVariantStock } from '@/shared/lib/cart';
import {
  SPORTS_FALLBACK_IMAGE,
  computeAvailableColors,
  computeAvailableSizes,
} from './quick-add/quickAddHelpers';
import QuickAddVariantSelector from './quick-add/QuickAddVariantSelector';

export interface QuickAddProduct {
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  image_url: string;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category?: string[];
  product_type?: string;
  sport_type?: string;
  variants?: Array<{ size?: string; color?: string; stock?: number; sku?: string }>;
}

interface QuickAddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: QuickAddProduct | null;
}

function QuickAddModalDialog({
  product,
  onClose,
}: {
  product: QuickAddProduct;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);

  const availableSizes = useMemo(() => computeAvailableSizes(product), [product]);
  const availableColors = useMemo(() => computeAvailableColors(product), [product]);

  const [selectedSize, setSelectedSize] = useState<string>(() =>
    availableSizes.length === 1 ? availableSizes[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(() =>
    availableColors.length === 1 ? availableColors[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  const discount = product.discount_percent || 0;
  const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
  const totalPrice = salePrice * quantity;

  const handleConfirmAdd = () => {
    if (availableSizes.length > 1 && !selectedSize) {
      notifications.show({
        title: 'Chưa chọn kích cỡ!',
        message: 'Vui lòng chọn kích cỡ / size trước khi thêm vào giỏ.',
        color: 'red',
        autoClose: 2500,
      });
      return;
    }

    if (availableColors.length > 1 && !selectedColor) {
      notifications.show({
        title: 'Chưa chọn màu sắc!',
        message: 'Vui lòng chọn màu sắc bạn mong muốn.',
        color: 'red',
        autoClose: 2500,
      });
      return;
    }

    const finalSize = selectedSize || (availableSizes.length === 1 ? availableSizes[0] : 'Tiêu chuẩn');
    const finalColor = selectedColor || (availableColors.length === 1 ? availableColors[0] : '');

    const variantStock = getMatchingVariantStock(
      product.variants,
      finalSize,
      finalColor,
      product.stock || 100
    );

    addItem({
      product_id: product.product_id,
      name: product.name,
      price: salePrice,
      original_price: discount > 0 ? product.price : undefined,
      image_url: product.image_url,
      quantity,
      size: finalSize,
      color: finalColor,
      stock: variantStock,
      total_stock: product.stock || 100,
    });

    notifications.show({
      title: 'Đã thêm vào giỏ hàng!',
      message: `${product.name} (Size: ${finalSize}${finalColor ? ` · Màu: ${finalColor}` : ''})`,
      color: 'teal',
      icon: <Check size={16} />,
      autoClose: 2500,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden z-10 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Modal Header & Product Info */}
        <div className="flex gap-4 items-start pr-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden">
            <img
              src={product.image_url || SPORTS_FALLBACK_IMAGE}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SPORTS_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              {product.sport_type || (product.category && product.category[0]) || 'Thể Thao'}
            </span>
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mt-0.5">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-base font-black text-red-600">
                {salePrice.toLocaleString('vi-VN')}đ
              </span>
              {discount > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
          </div>
        </div>

        <QuickAddVariantSelector
          availableColors={availableColors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          availableSizes={availableSizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          quantity={quantity}
          onDecreaseQty={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncreaseQty={() => setQuantity((q) => q + 1)}
        />

        {/* Modal Footer */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Tổng tiền tạm tính:</span>
            <span className="text-lg font-black text-slate-900">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmAdd}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Xác nhận thêm vào giỏ hàng</span>
          </button>

          <div className="text-center">
            <Link
              href={`/san-pham/${product.product_id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span>Xem trang thông tin chi tiết sản phẩm</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickAddToCartModal({
  isOpen,
  onClose,
  product,
}: QuickAddToCartModalProps) {
  if (!isOpen || !product) return null;

  return (
    <QuickAddModalDialog
      key={product.product_id}
      product={product}
      onClose={onClose}
    />
  );
}
