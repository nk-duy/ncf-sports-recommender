import Link from 'next/link';
import { AlertTriangle, Bookmark, ChevronDown, Trash2 } from 'lucide-react';
import { type CartItem, cartKey } from '@/shared/store/cartStore';
import { formatVND } from '@/shared/lib/cart';
import CartVariantPicker from '@/modules/public/thanh-toan/cart/components/CartVariantPicker';
import type { LiveInfo } from '../types';
import type { ConfirmState } from './CartConfirmModal';
import { QuantityControl } from './QuantityControl';

const CART_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';

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
  syncProduct?: (id: string, updates: Partial<CartItem>) => void;
  updateQuantity: (id: string, size: string, color: string | undefined, quantity: number) => void;
  setConfirm: (state: ConfirmState) => void;
  saveForLater: (id: string) => void;
  removeSelectedKey: (id: string) => void;
  originalPrice: number | undefined;
}

// Chuẩn hóa phân loại kích thước: nếu sản phẩm thuộc phụ kiện/dụng cụ không phải quần áo giày dép mà dính size số thì đổi thành "Tiêu chuẩn" hoặc "Freesize"
function normalizeDisplaySize(rawSize: string, productName: string): string {
  const s = (rawSize || '').trim();
  const nameLower = (productName || '').toLowerCase();
  const isApparelOrShoes = /giày|dép|áo|quần|socks|tất|shoe|shirt|pant|short|jacket|hoodie|jersey/i.test(nameLower);
  const isAccessoryOrEquipment =
    /bình|nước|chai|túi|balo|dây|thảm|kính|găng|vợt|bóng|nón|mũ|tạ|băng|bó|ống|chuông|khóa|đèn|đệm|lều|ngủ|phụ kiện|accessory|bottle|glove|bag|mat|belt/i.test(
      nameLower
    );

  if (isAccessoryOrEquipment || !isApparelOrShoes) {
    if (/^\d+(\.\d+)?$/.test(s)) return 'Tiêu chuẩn';
    if (/^(s|m|l|xl|xxl)$/i.test(s) && isAccessoryOrEquipment) return 'Freesize';
  }
  return s || 'Tiêu chuẩn';
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
  updateQuantity,
  setConfirm,
  saveForLater,
  removeSelectedKey,
  originalPrice,
}: CartItemRowProps) {
  const id = cartKey(item);
  const lowStock = Boolean(live && !unavailable && live.stock > 0 && live.stock <= 5);
  const hasVariants = Boolean(
    live &&
      !live.missing &&
      ((live.sizes?.filter(Boolean)?.length || 0) > 1 || (live.colors?.filter(Boolean)?.length || 0) > 1)
  );
  const displaySize = normalizeDisplaySize(item.size, item.name);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-4.5 border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${isLast ? 'border-b-0' : ''} ${unavailable ? 'bg-gray-50/80' : ''}`}
    >
      {/* Product Info & Checkbox */}
      <div className="w-full sm:w-[45%] flex items-start gap-3.5 mb-3 sm:mb-0">
        <div className="flex items-center pt-2.5 sm:pt-4">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 transition"
            checked={isSelected}
            disabled={unavailable}
            onChange={(e) => handleSelectItem(id, e.target.checked)}
          />
        </div>
        <Link
          href={`/san-pham/${item.product_id}`}
          className="relative block w-20 h-20 rounded-xl overflow-hidden border border-gray-200/80 bg-gray-50 shrink-0 group"
        >
          <img
            src={item.image_url || CART_FALLBACK_IMG}
            alt={item.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${unavailable ? 'grayscale opacity-60' : ''}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = CART_FALLBACK_IMG;
            }}
          />
          {unavailable && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-[10px] font-bold tracking-wider uppercase text-center px-1">
              {live?.missing ? 'Ngừng bán' : 'Hết hàng'}
            </span>
          )}
        </Link>
        <div className="flex flex-col gap-1 pr-2 min-w-0 flex-1">
          <Link
            href={`/san-pham/${item.product_id}`}
            className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug"
          >
            {item.name}
          </Link>

          {/* Phân loại hàng */}
          <div className="relative w-fit mt-1">
            {hasVariants && !unavailable ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerKey(pickerKey === id ? null : id);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-full transition-colors border border-gray-200/60 font-medium cursor-pointer"
              >
                <span>
                  Phân loại:{' '}
                  <strong className="text-gray-900">
                    {displaySize}
                    {item.color ? ` / ${item.color}` : ''}
                  </strong>
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${pickerKey === id ? 'rotate-180' : ''}`}
                />
              </button>
            ) : (
              <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200/60 font-medium">
                Phân loại: {displaySize}
                {item.color ? ` / ${item.color}` : ''}
              </span>
            )}
            {pickerKey === id && live && (
              <CartVariantPicker
                sizes={Array.from(new Set([...(live.sizes || []), item.size].filter(Boolean))).map((s) =>
                  normalizeDisplaySize(s, item.name)
                )}
                colors={Array.from(new Set([...(live.colors || []), item.color].filter(Boolean))) as string[]}
                size={displaySize}
                color={item.color}
                onClose={() => setPickerKey(null)}
                onConfirm={(s, c) => handleVariantChange(item, s, c)}
              />
            )}
          </div>

          {unavailable && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 mt-0.5">
              <AlertTriangle size={12} />
              {live?.missing ? 'Sản phẩm không còn kinh doanh' : 'Sản phẩm tạm thời hết hàng'}
            </span>
          )}
          {lowStock && live && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-0.5">
              <AlertTriangle size={12} />
              Chỉ còn {live.stock} sản phẩm trong kho
            </span>
          )}
        </div>
      </div>

      {/* Price / Quantity / Subtotal / Actions */}
      <div className="w-full sm:w-[55%] flex items-center justify-between sm:justify-around gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <div className="sm:w-[27%] text-left sm:text-center text-sm">
          {originalPrice && (
            <div className="text-xs text-gray-400 line-through font-normal tabular-nums">
              {formatVND(originalPrice)}
            </div>
          )}
          <div className={`font-semibold tabular-nums ${originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
            {formatVND(item.price)}
          </div>
        </div>

        <div className="sm:w-[27%] flex justify-center">
          <QuantityControl
            item={item}
            disabled={unavailable}
            onChange={(q) => updateQuantity(item.product_id, item.size, item.color, q)}
            onRequestRemove={() => setConfirm({ kind: 'single', item })}
          />
        </div>

        <div className="sm:w-[27%] text-right sm:text-center text-sm font-bold text-blue-600 tabular-nums">
          {formatVND(item.price * item.quantity)}
        </div>

        <div className="sm:w-[19%] flex items-center justify-end sm:justify-center gap-2">
          <button
            onClick={() => {
              saveForLater(id);
              removeSelectedKey(id);
            }}
            title="Lưu để mua sau"
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Bookmark size={16} />
          </button>
          <button
            onClick={() => setConfirm({ kind: 'single', item })}
            title="Xóa khỏi giỏ"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
