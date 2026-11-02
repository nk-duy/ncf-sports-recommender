'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, cartKey } from '@/shared/store/cartStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useWishlistStore } from '@/shared/store/wishlistStore';
import ProductHeaderMeta from './ProductHeaderMeta';
import ProductVariantSelector from './ProductVariantSelector';
import ProductActionCommitments from './ProductActionCommitments';
import {
  getAvailableSizes,
  getDefaultProductSize,
  getVariantSizeStock,
} from '../utils/productStockUtils';
import type { ProductDetail } from '../types';

interface ProductInfoSectionProps {
  product: ProductDetail;
  onOpenSizeGuide: () => void;
  setWishlistToast: (msg: string) => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export default function ProductInfoSection({
  product,
  onOpenSizeGuide,
  setWishlistToast,
  selectedSize: externalSelectedSize,
  onSelectSize: externalOnSelectSize,
}: ProductInfoSectionProps) {
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(() => product.colors?.[0] || '');
  const [internalSelectedSize, setInternalSelectedSize] = useState<string>(() =>
    getDefaultProductSize(product, product.colors?.[0] || '')
  );

  const selectedSize = externalSelectedSize !== undefined ? externalSelectedSize : internalSelectedSize;
  const setSelectedSize = (size: string) => {
    if (externalOnSelectSize) {
      externalOnSelectSize(size);
    } else {
      setInternalSelectedSize(size);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');
  const [added, setAdded] = useState(false);

  const { isWishlisted, toggleItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  const availableSizes = useMemo(() => getAvailableSizes(product), [product]);
  const activeVariants = product.variants || [];
  const productStock = product.stock ?? 25;

  const getSizeStock = (size: string) => getVariantSizeStock(product, size, selectedColor);

  const handleColorSelect = (color: string) => {
    const nextColor = selectedColor === color ? '' : color;
    setSelectedColor(nextColor);
    setErrorMsg('');

    if (availableSizes.length > 0) {
      const isCurrentValid =
        selectedSize &&
        availableSizes.includes(selectedSize) &&
        getVariantSizeStock(product, selectedSize, nextColor) > 0;
      if (!isCurrentValid) {
        const firstAvailable = getDefaultProductSize(product, nextColor);
        if (firstAvailable && firstAvailable !== selectedSize) {
          setSelectedSize(firstAvailable);
        }
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(selectedSize === size ? '' : size);
    setErrorMsg('');
  };

  const trackInteraction = (type: string) => {
    const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8000/api/v1/interactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          interaction_type: type,
        }),
      }).catch((err) => console.error('Tracking failed', err));
    }
  };

  const handleToggleWishlist = () => {
    const isAdded = toggleItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category?.[0] || 'Thể Thao',
      discount_percent: product.discount_percent,
    });

    setWishlistToast(isAdded ? 'Đã thêm vào danh sách yêu thích!' : 'Đã xóa khỏi danh sách yêu thích!');
    setTimeout(() => setWishlistToast(''), 3000);
  };

  const hasColors = Boolean(product.colors && product.colors.length > 0);
  const isReady = selectedSize !== '' && (!hasColors || selectedColor !== '');

  const currentVariant = activeVariants.find(
    (v) => (hasColors ? v.color === selectedColor : true) && v.size === selectedSize
  );

  const effectiveStock =
    currentVariant !== undefined
      ? currentVariant.stock ?? 0
      : selectedSize
      ? getSizeStock(selectedSize)
      : productStock;

  const inStock = effectiveStock > 0;
  const isWishlistedProduct = isWishlisted(product.product_id);

  const validateSelection = (): boolean => {
    if (!selectedSize) {
      setErrorMsg('Vui lòng chọn Kích cỡ!');
      return false;
    }
    if (hasColors && !selectedColor) {
      setErrorMsg('Vui lòng chọn Màu sắc!');
      return false;
    }
    if (effectiveStock <= 0) {
      setErrorMsg('Phân loại màu và kích cỡ này hiện đã hết hàng!');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const buildCartPayload = (): Parameters<typeof addItem>[0] => ({
    product_id: product.product_id,
    name: product.name,
    price: product.discount_percent ? product.price * (1 - product.discount_percent / 100) : product.price,
    image_url: product.image_url,
    quantity,
    size: selectedSize,
    color: selectedColor,
    stock: effectiveStock,
  });

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    trackInteraction('add_to_cart');
    addItem(buildCartPayload());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;
    trackInteraction('purchase');
    addItem(buildCartPayload());
    useCheckoutStore.getState().setSelectedKeys([
      cartKey({ product_id: product.product_id, size: selectedSize, color: selectedColor }),
    ]);
    router.push('/thanh-toan');
  };

  return (
    <div className="w-full flex flex-col justify-start space-y-3.5">
      <ProductHeaderMeta
        product={product}
        inStock={inStock}
        isWishlistedProduct={isWishlistedProduct}
        onToggleWishlist={handleToggleWishlist}
      />

      <ProductVariantSelector
        colors={product.colors}
        selectedColor={selectedColor}
        onSelectColor={handleColorSelect}
        availableSizes={availableSizes}
        selectedSize={selectedSize}
        onSelectSize={handleSizeSelect}
        onOpenSizeGuide={onOpenSizeGuide}
        getSizeStock={getSizeStock}
        hasVariants={activeVariants.length > 0}
        quantity={quantity}
        effectiveStock={effectiveStock}
        onDecrementQuantity={() => setQuantity(Math.max(1, quantity - 1))}
        onIncrementQuantity={() => {
          if (quantity < effectiveStock) {
            setQuantity(quantity + 1);
          } else {
            setErrorMsg(`Rất tiếc, phân loại này chỉ còn ${effectiveStock} sản phẩm trong kho!`);
          }
        }}
        errorMsg={errorMsg}
      />

      <ProductActionCommitments
        isReady={isReady}
        inStock={inStock}
        added={added}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
