import React from "react";
import Link from "next/link";
import { ChevronDown, AlertTriangle, RefreshCw, Bookmark } from "lucide-react";
import { CartItem, cartKey } from "@/shared/store/cartStore";
import { formatVND } from "@/shared/lib/cart";
import { QuantityControl } from "./QuantityControl";
import CartVariantPicker from "@/modules/thanh-toan/cart/components/CartVariantPicker";

interface LiveInfo {
  missing: boolean;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  discount_percent: number;
  hidden: boolean;
}

interface CartItemRowProps {
  item: CartItem;
  live: LiveInfo | undefined;
  unavailable: boolean;
  isSelected: boolean;
  isLast: boolean;
  pickerKey: string | null;
  setPickerKey: (key: string | null) => void;
  handleSelectItem: (key: string, checked: boolean) => void;
  handleVariantChange: (item: CartItem, newSize: string, newColor: string | undefined) => void;
  syncProduct: (id: string, updates: Partial<CartItem>) => void;
  updateQuantity: (id: string, size: string, color: string | undefined, quantity: number) => void;
  setConfirm: (state: any) => void;
  saveForLater: (id: string) => void;
  removeSelectedKey: (id: string) => void;
  originalPrice: number | undefined;
}

export function CartItemRow({
  item,
  live,
  unavailable,
  isSelected,
  isLast,
  pickerKey,
  setPickerKey,
  handleSelectItem,
  handleVariantChange,
  syncProduct,
  updateQuantity,
  setConfirm,
  saveForLater,
  removeSelectedKey,
  originalPrice
}: CartItemRowProps) {
  const id = cartKey(item);
  const priceChanged = !!live && !live.missing && live.price !== item.price;
  const lowStock = !!live && !unavailable && live.stock > 0 && live.stock <= 5;
  const hasVariants = !!live && !live.missing && (live.sizes.length > 0 || live.colors.length > 0);

  return (
    <div className={`flex items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 ${isLast ? 'border-b-0' : ''} ${unavailable ? 'bg-gray-50/70' : ''}`}>
      <div className="w-[45%] flex items-start gap-3">
        <div className="flex items-center pt-6">
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-blue-600 cursor-pointer rounded-sm disabled:cursor-not-allowed disabled:opacity-40"
            checked={isSelected}
            disabled={unavailable}
            onChange={(e) => handleSelectItem(id, e.target.checked)}
          />
        </div>
        <Link href={`/san-pham/${item.product_id}`} className="relative block w-20 h-20 border border-gray-200 shrink-0">
          <img src={item.image_url} alt={item.name} className={`w-full h-full object-cover ${unavailable ? 'grayscale opacity-60' : ''}`} />
          {unavailable && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-[11px] font-bold">
              {live?.missing ? 'Ngừng bán' : 'Hết hàng'}
            </span>
          )}
        </Link>
        <div className="flex flex-col gap-1 pr-4 min-w-0">
          <Link href={`/san-pham/${item.product_id}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {item.name}
          </Link>

          {/* Phân loại hàng */}
          <div className="relative w-fit mt-1">
            {hasVariants && !unavailable ? (
              <button
                type="button"
                onClick={() => setPickerKey(pickerKey === id ? null : id)}
                className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 px-2 py-1 rounded transition-colors"
              >
                Phân loại hàng: {item.size}{item.color ? `, ${item.color}` : ''}
                <ChevronDown size={14} className={`transition-transform ${pickerKey === id ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded block">
                Phân loại hàng: {item.size}{item.color ? `, ${item.color}` : ''}
              </span>
            )}
            {pickerKey === id && live && (
              <CartVariantPicker
                sizes={live.sizes}
                colors={live.colors}
                size={item.size}
                color={item.color}
                onClose={() => setPickerKey(null)}
                onConfirm={(s, c) => handleVariantChange(item, s, c)}
              />
            )}
          </div>

          {/* Cảnh báo */}
          {unavailable && (
            <span className="flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertTriangle size={13} />
              {live?.missing ? 'Sản phẩm không còn được kinh doanh' : 'Sản phẩm đã hết hàng'}
            </span>
          )}
          {lowStock && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
              <AlertTriangle size={13} />
              Chỉ còn {live!.stock} sản phẩm
            </span>
          )}
          {priceChanged && !unavailable && (
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-amber-600">
              <RefreshCw size={13} />
              Giá đã thay đổi: {formatVND(item.price)} → {formatVND(live!.price)}
              <button
                type="button"
                onClick={() => syncProduct(item.product_id, { price: live!.price })}
                className="text-blue-600 hover:underline font-semibold"
              >
                Cập nhật giá
              </button>
            </span>
          )}
        </div>
      </div>
      <div className="w-[15%] text-center text-sm text-gray-700">
        {originalPrice && <div className="text-xs text-gray-400 line-through">{formatVND(originalPrice)}</div>}
        <div className={originalPrice ? 'text-red-600 font-medium' : ''}>{formatVND(item.price)}</div>
      </div>
      <div className="w-[15%] flex justify-center">
        <QuantityControl
          item={item}
          disabled={unavailable}
          onChange={(q) => updateQuantity(item.product_id, item.size, item.color, q)}
          onRequestRemove={() => setConfirm({ kind: 'single', item })}
        />
      </div>
      <div className="w-[15%] text-center text-sm font-bold text-gray-900">
        {formatVND(item.price * item.quantity)}
      </div>
      <div className="w-[10%] flex flex-col items-center gap-1.5 text-sm">
        <button 
          onClick={() => setConfirm({ kind: 'single', item })}
          className="text-gray-500 hover:text-red-600 transition-colors font-medium"
        >
          Xóa
        </button>
        <button
          onClick={() => {
            saveForLater(id);
            removeSelectedKey(id);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
        >
          <Bookmark size={12} />
          Lưu mua sau
        </button>
      </div>
    </div>
  );
}
