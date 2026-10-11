'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, cartKey, CartItem } from "@/shared/store/cartStore";
import { useCheckoutStore } from "@/shared/store/checkoutStore";
import { notifications } from "@mantine/notifications";
import { ShoppingCart } from "lucide-react";
import {
  API_BASE,
  calcOriginalPrice,
  calcVoucherDiscount,
  getShippingOption,
} from "@/shared/lib/cart";
import CartVoucherBox from "@/modules/thanh-toan/cart/components/CartVoucherBox";
import CartRecommendations from "@/modules/thanh-toan/cart/components/CartRecommendations";
import { CartItemRow } from "@/modules/gio-hang/components/CartItemRow";
import { CartSummary } from "@/modules/gio-hang/components/CartSummary";
import { SavedForLater } from "@/modules/gio-hang/components/SavedForLater";
import { CartFooter } from "@/modules/gio-hang/components/CartFooter";

/** Thông tin mới nhất của sản phẩm lấy từ server (tồn kho, giá, biến thể) */
interface LiveInfo {
  missing: boolean;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  discount_percent: number;
  hidden: boolean;
}

import CartConfirmModal, { ConfirmState } from "@/modules/gio-hang/components/CartConfirmModal";

export default function CartPage() {
  const router = useRouter();
  const {
    items, savedItems, removeItems, updateQuantity, updateVariant, syncProduct,
    saveForLater, moveSavedToCart, removeSaved,
  } = useCartStore();
  const { selectedKeys, setSelectedKeys, appliedVoucher, shipping_id, setField } = useCheckoutStore();

  const [mounted, setMounted] = useState(false);
  const [liveInfo, setLiveInfo] = useState<Record<string, LiveInfo>>({});
  const [pickerKey, setPickerKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            return [id, { missing: true, price: 0, stock: 0, sizes: [], colors: [], discount_percent: 0, hidden: true }];
          }
          if (!res.ok) return null;
          const p = await res.json();
          return [
            id,
            {
              missing: false,
              price: p.price ?? 0,
              stock: typeof p.stock === 'number' ? p.stock : 100,
              sizes: p.sizes || [],
              colors: p.colors || [],
              discount_percent: p.discount_percent || 0,
              hidden: !!p.is_hidden,
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
      // Tồn kho luôn được cập nhật tự động; giá thì hỏi người dùng (xem cảnh báo "Giá đã thay đổi")
      Object.entries(next).forEach(([id, info]) => {
        if (!info.missing) syncProduct(id, { stock: info.stock });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [mounted, productIdsKey, syncProduct]);

  const isUnavailable = (item: CartItem) => {
    const live = liveInfo[item.product_id];
    return !!live && (live.missing || live.hidden || live.stock <= 0);
  };

  // Bỏ chọn những dòng không còn tồn tại / hết hàng
  useEffect(() => {
    if (!mounted) return;
    const valid = selectedKeys.filter((k) => items.some((i) => cartKey(i) === k && !isUnavailable(i)));
    if (valid.length !== selectedKeys.length) setSelectedKeys(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, items, liveInfo]);

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
        notifications.show({ title: 'Đã lưu', message: 'Sản phẩm được chuyển vào mục "Lưu để mua sau".', color: 'blue' });
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
  const shippingOption = getShippingOption(shipping_id);
  const shippingFee = selectedItemsData.length > 0 ? shippingOption.price : 0;
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
      notifications.show({ title: 'Chưa chọn sản phẩm', message: 'Bạn vẫn chưa chọn sản phẩm nào để mua.', color: 'red' });
      return;
    }
    // Chỉ các sản phẩm đã tick được chuyển sang trang thanh toán
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

  if (!mounted) return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Đang tải giỏ hàng...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-700 font-bold text-2xl tracking-tighter">KADY</span>
            <span className="text-blue-700 text-xl">|</span>
            <span className="text-blue-700 text-xl font-medium">Giỏ Hàng</span>
          </Link>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6">
        
        {/* Table Header */}
        <div className="bg-white rounded shadow-sm flex items-center px-5 py-4 mb-3 text-sm text-gray-500">
          <div className="w-[45%] flex items-center gap-3">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-blue-600 cursor-pointer rounded-sm"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="font-medium text-gray-700">Sản Phẩm</span>
          </div>
          <div className="w-[15%] text-center">Đơn Giá</div>
          <div className="w-[15%] text-center">Số Lượng</div>
          <div className="w-[15%] text-center">Số Tiền</div>
          <div className="w-[10%] text-center">Thao Tác</div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="bg-white rounded shadow-sm py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-4">Giỏ hàng của bạn còn trống</p>
            <Link href="/" className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
              Mua ngay
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded shadow-sm flex flex-col mb-6">
            {items.map((item, index) => {
              const id = cartKey(item);
              const live = liveInfo[item.product_id];
              const originalPrice = getOriginalPrice(item);
              
              return (
                <CartItemRow
                  key={id}
                  item={item}
                  live={live}
                  unavailable={isUnavailable(item)}
                  isSelected={selectedKeys.includes(id)}
                  isLast={index === items.length - 1}
                  pickerKey={pickerKey}
                  setPickerKey={setPickerKey}
                  handleSelectItem={handleSelectItem}
                  handleVariantChange={handleVariantChange}
                  syncProduct={syncProduct}
                  updateQuantity={updateQuantity}
                  setConfirm={setConfirm}
                  saveForLater={(idKey) => {
                    saveForLater(idKey);
                    notifications.show({ title: 'Đã lưu', message: 'Sản phẩm được chuyển vào mục "Lưu để mua sau".', color: 'blue' });
                  }}
                  removeSelectedKey={(idKey) => {
                    setSelectedKeys(selectedKeys.filter((k) => k !== idKey));
                  }}
                  originalPrice={originalPrice}
                />
              );
            })}
          </div>
        )}

        {/* Voucher + Tóm tắt đơn hàng */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <CartVoucherBox subtotal={subtotal} />
            </div>
            <CartSummary
              totalCount={totalCount}
              subtotal={subtotal}
              shippingFee={shippingFee}
              shipping_id={shipping_id}
              setField={setField}
              voucherDiscount={voucherDiscount}
              appliedVoucher={appliedVoucher}
              finalTotal={finalTotal}
              totalSavings={totalSavings}
              promoSavings={promoSavings}
            />
          </div>
        )}

        {/* Lưu để mua sau */}
        <SavedForLater
          savedItems={savedItems}
          moveSavedToCart={moveSavedToCart}
          removeSaved={removeSaved}
          showNotification={(msg) => notifications.show({ title: 'Đã chuyển vào giỏ', message: msg, color: 'green' })}
        />

        {/* Gợi ý sản phẩm liên quan */}
        <CartRecommendations />
      </div>

      {/* Sticky Footer */}
      <CartFooter
        itemsLength={items.length}
        allSelected={allSelected}
        handleSelectAll={handleSelectAll}
        hasSelected={selectedKeys.length > 0}
        setConfirmBulk={() => setConfirm({ kind: 'bulk' })}
        totalCount={totalCount}
        finalTotal={finalTotal}
        totalSavings={totalSavings}
        canCheckout={canCheckout}
        handleCheckout={handleCheckout}
      />

      {/* Hộp thoại xác nhận xóa */}
      <CartConfirmModal 
        confirm={confirm}
        selectedKeysLength={selectedKeys.length}
        onCancel={() => setConfirm(null)}
        onConfirm={doConfirm}
      />
    </div>
  );
}
