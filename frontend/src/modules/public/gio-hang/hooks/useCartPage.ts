'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useHydrated } from '@/shared/hooks/useHydrated';
import { useCartStore, cartKey, type CartItem } from '@/shared/store/cartStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import {
  API_BASE,
  calcEffectiveShippingFee,
  calcOriginalPrice,
  calcVoucherDiscount,
} from '@/shared/lib/cart';
import type { ConfirmState } from '../components/CartConfirmModal';
import type { LiveInfo } from '../types';

interface BackendProductDetail {
  price?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  discount_percent?: number;
  is_hidden?: boolean;
}

export function useCartPage() {
  const router = useRouter();
  const mounted = useHydrated();
  const {
    items,
    savedItems,
    removeItems,
    updateQuantity,
    updateVariant,
    syncProduct,
    saveForLater,
    moveSavedToCart,
    removeSaved,
  } = useCartStore();
  const { selectedKeys, setSelectedKeys, appliedVoucher, shipping_id, setField } = useCheckoutStore();

  const [liveInfo, setLiveInfo] = useState<Record<string, LiveInfo>>({});
  const [pickerKey, setPickerKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const autoSelectedOnceRef = useRef(false);

  /* ---------- Đồng bộ dữ liệu mới nhất (tồn kho, giá, phân loại) từ server ---------- */
  const productIdsKey = useMemo(
    () => Array.from(new Set(items.map((i) => i.product_id))).sort().join('|'),
    [items]
  );

  useEffect(() => {
    if (!mounted || !productIdsKey) return;
    let cancelled = false;
    const ids = productIdsKey.split('|');

    Promise.all(
      ids.map(async (id): Promise<[string, LiveInfo] | null> => {
        try {
          const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`);
          if (res.status === 404) {
            return [
              id,
              { missing: true, price: 0, stock: 0, sizes: [], colors: [], discount_percent: 0, hidden: true },
            ];
          }
          if (!res.ok) return null;
          const p: BackendProductDetail = await res.json();
          return [
            id,
            {
              missing: false,
              price: p.price ?? 0,
              stock: typeof p.stock === 'number' ? p.stock : 100,
              sizes: p.sizes || [],
              colors: p.colors || [],
              discount_percent: p.discount_percent || 0,
              hidden: Boolean(p.is_hidden),
            },
          ];
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, LiveInfo> = {};
      results.forEach((r) => {
        if (r) next[r[0]] = r[1];
      });
      setLiveInfo((prev) => ({ ...prev, ...next }));
      // Tự động đồng bộ tồn kho và giá mới nhất từ server vào giỏ hàng
      Object.entries(next).forEach(([id, info]) => {
        if (!info.missing) {
          syncProduct(id, { stock: info.stock, price: info.price });
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mounted, productIdsKey, syncProduct]);

  const isUnavailable = useCallback(
    (item: CartItem) => {
      const live = liveInfo[item.product_id];
      return Boolean(live && (live.missing || live.hidden || live.stock <= 0));
    },
    [liveInfo]
  );

  // Mặc định tự động chọn tất cả sản phẩm (Default Select All) khi mở trang giỏ hàng lần đầu
  useEffect(() => {
    if (!mounted || items.length === 0 || autoSelectedOnceRef.current) return;
    const availableKeys = items.filter((i) => !isUnavailable(i)).map(cartKey);
    if (availableKeys.length > 0) {
      autoSelectedOnceRef.current = true;
      if (selectedKeys.length === 0) {
        setSelectedKeys(availableKeys);
      }
    }
  }, [mounted, items, isUnavailable, selectedKeys.length, setSelectedKeys]);

  // Bỏ chọn những dòng không còn tồn tại / hết hàng
  useEffect(() => {
    if (!mounted) return;
    const valid = selectedKeys.filter((k) => items.some((i) => cartKey(i) === k && !isUnavailable(i)));
    if (valid.length !== selectedKeys.length && valid.length > 0) {
      setSelectedKeys(valid);
    }
  }, [mounted, items, isUnavailable, selectedKeys, setSelectedKeys]);

  /* ---------- Chọn sản phẩm ---------- */
  const selectableKeys = items.filter((i) => !isUnavailable(i)).map(cartKey);
  const allSelected = selectableKeys.length > 0 && selectableKeys.every((k) => selectedKeys.includes(k));

  const handleSelectAll = (checked: boolean) => setSelectedKeys(checked ? selectableKeys : []);
  const handleSelectItem = (key: string, checked: boolean) =>
    setSelectedKeys(checked ? Array.from(new Set([...selectedKeys, key])) : selectedKeys.filter((k) => k !== key));

  /* ---------- Xóa / lưu mua sau ---------- */
  const removeKeys = (keys: string[]) => {
    removeItems(keys);
    setSelectedKeys(selectedKeys.filter((k) => !keys.includes(k)));
  };

  const doConfirm = (action: 'delete' | 'save') => {
    if (!confirm) return;
    if (confirm.kind === 'single') {
      const key = cartKey(confirm.item);
      if (action === 'save') {
        saveForLater(key);
        notifications.show({
          title: 'Đã lưu',
          message: 'Sản phẩm được chuyển vào mục "Lưu để mua sau".',
          color: 'blue',
        });
      } else {
        removeItems([key]);
        notifications.show({ title: 'Đã xóa', message: 'Đã xóa sản phẩm khỏi giỏ hàng.', color: 'green' });
      }
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    } else {
      removeKeys(selectedKeys);
      notifications.show({ title: 'Thành công', message: 'Đã xóa các sản phẩm đã chọn', color: 'green' });
    }
    setConfirm(null);
  };

  /* ---------- Tổng tiền ---------- */
  const selectedItemsData = items.filter((i) => selectedKeys.includes(cartKey(i)) && !isUnavailable(i));
  const subtotal = selectedItemsData.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = selectedItemsData.reduce((sum, i) => sum + i.quantity, 0);
  const shippingFee = selectedItemsData.length > 0 ? calcEffectiveShippingFee(subtotal, shipping_id) : 0;
  const voucherDiscount = calcVoucherDiscount(appliedVoucher, subtotal, shippingFee);
  const finalTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  const getOriginalPrice = (item: CartItem) => {
    const live = liveInfo[item.product_id];
    // Chỉ hiện giá gốc khi giá trong giỏ khớp giá hiện tại của sản phẩm
    if (!live || live.missing || live.price !== item.price) return undefined;
    const original = calcOriginalPrice(item.price, live.discount_percent);
    return original > item.price ? original : undefined;
  };

  const promoSavings = selectedItemsData.reduce((sum, i) => {
    const original = getOriginalPrice(i);
    return sum + (original ? (original - i.price) * i.quantity : 0);
  }, 0);
  const totalSavings = promoSavings + voucherDiscount;
  const canCheckout = selectedItemsData.length > 0;

  const handleCheckout = () => {
    if (!canCheckout) {
      notifications.show({
        title: 'Chưa chọn sản phẩm',
        message: 'Bạn vẫn chưa chọn sản phẩm nào để mua.',
        color: 'red',
      });
      return;
    }
    setSelectedKeys(selectedItemsData.map(cartKey));
    router.push('/thanh-toan');
  };

  const handleVariantChange = (item: CartItem, newSize: string, newColor: string | undefined) => {
    const oldKey = cartKey(item);
    const newKey = cartKey({ product_id: item.product_id, size: newSize, color: newColor });
    updateVariant(item.product_id, item.size, item.color, newSize, newColor);
    if (selectedKeys.includes(oldKey)) {
      setSelectedKeys(Array.from(new Set(selectedKeys.map((k) => (k === oldKey ? newKey : k)))));
    }
    setPickerKey(null);
  };

  return {
    mounted,
    items,
    savedItems,
    selectedKeys,
    setSelectedKeys,
    appliedVoucher,
    shipping_id,
    setField,
    liveInfo,
    pickerKey,
    setPickerKey,
    confirm,
    setConfirm,
    isUnavailable,
    allSelected,
    handleSelectAll,
    handleSelectItem,
    doConfirm,
    subtotal,
    totalCount,
    shippingFee,
    voucherDiscount,
    finalTotal,
    getOriginalPrice,
    promoSavings,
    totalSavings,
    canCheckout,
    handleCheckout,
    handleVariantChange,
    syncProduct,
    updateQuantity,
    saveForLater,
    moveSavedToCart,
    removeSaved,
  };
}
