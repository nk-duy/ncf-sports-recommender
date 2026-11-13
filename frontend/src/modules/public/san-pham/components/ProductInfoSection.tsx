'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useCartStore, cartKey } from '@/shared/store/cartStore';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useWishlistStore } from '@/shared/store/wishlistStore';
import ProductHeaderMeta from './ProductHeaderMeta';
import ProductVariantSelector from './ProductVariantSelector';
import ProductActionCommitments from './ProductActionCommitments';
import {
  getAvailableSizes,
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
  // Không chọn sẵn màu sắc và kích cỡ, để người dùng chủ động lựa chọn
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [internalSelectedSize, setInternalSelectedSize] = useState<string>('');

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

    // Nếu kích cỡ đang chọn không còn hàng ở màu mới, bỏ chọn kích cỡ để người dùng tự chọn lại
    if (selectedSize && availableSizes.length > 0) {
      const isCurrentValid =
        availableSizes.includes(selectedSize) &&
        getVariantSizeStock(product, selectedSize, nextColor) > 0;
      if (!isCurrentValid) {
        setSelectedSize('');
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
      const apiUrl = resolveApiBaseUrl();
      fetch(`${apiUrl}/interactions/`, {
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
    if (hasColors && !selectedColor) {
      setErrorMsg('Vui lòng chọn Màu sắc!');
      notifications.show({
        title: 'Chưa chọn màu sắc',
        message: 'Vui lòng chọn Màu sắc sản phẩm!',
        color: 'orange',
      });
      return false;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setErrorMsg('Vui lòng chọn Kích cỡ!');
      notifications.show({
        title: 'Chưa chọn kích cỡ',
        message: 'Vui lòng chọn Kích cỡ / Size sản phẩm!',
        color: 'orange',
      });
      return false;
    }
    if (effectiveStock <= 0) {
      setErrorMsg('Phân loại màu và kích cỡ này hiện đã hết hàng!');
      notifications.show({
        title: 'Hết hàng',
        message: 'Phân loại này hiện đã hết hàng, vui lòng chọn phân loại khác!',
        color: 'red',
      });
      return false;
    }

    // Kiểm tra giới hạn tồn kho biến thể và tổng kho sản phẩm kết hợp giỏ hàng hiện tại
    const cartItems = useCartStore.getState().items;
    const sameVariantInCart = cartItems.find(
      (i) => i.product_id === product.product_id && i.size === selectedSize && i.color === selectedColor
    )?.quantity || 0;
    const totalSameProductInCart = cartItems
      .filter((i) => i.product_id === product.product_id)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (sameVariantInCart + quantity > effectiveStock) {
      const remainingVariant = Math.max(0, effectiveStock - sameVariantInCart);
      setErrorMsg(
        remainingVariant > 0
          ? `Phân loại này chỉ có thể thêm tối đa ${remainingVariant} sản phẩm nữa (bạn đã có ${sameVariantInCart} trong giỏ).`
          : `Bạn đã có tối đa ${sameVariantInCart} sản phẩm phân loại này trong giỏ hàng (tồn kho: ${effectiveStock}).`
      );
      notifications.show({
        title: 'Vượt quá tồn kho phân loại',
        message: `Phân loại ${selectedSize}${selectedColor ? ` · ${selectedColor}` : ''} chỉ còn ${effectiveStock} sản phẩm (bạn đã có ${sameVariantInCart} trong giỏ).`,
        color: 'orange',
      });
      return false;
    }

    if (totalSameProductInCart + quantity > productStock) {
      const remainingTotal = Math.max(0, productStock - totalSameProductInCart);
      setErrorMsg(
        remainingTotal > 0
          ? `Sản phẩm này chỉ có thể mua thêm tối đa ${remainingTotal} chiếc (tổng các phân loại trong giỏ đã là ${totalSameProductInCart}).`
          : `Tổng số lượng sản phẩm này trong giỏ đã đạt mức tối đa tồn kho (${productStock} chiếc).`
      );
      notifications.show({
        title: 'Vượt quá tổng tồn kho sản phẩm',
        message: `Tổng tồn kho của sản phẩm chỉ còn ${productStock} chiếc (giỏ hàng đã có ${totalSameProductInCart} chiếc ở các phân loại khác).`,
        color: 'orange',
      });
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
    total_stock: productStock,
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
    trackInteraction('add_to_cart');
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
