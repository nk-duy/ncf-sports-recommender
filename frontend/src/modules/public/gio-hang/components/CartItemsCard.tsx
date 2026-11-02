import { Trash2 } from 'lucide-react';
import { type CartItem, cartKey } from '@/shared/store/cartStore';
import type { LiveInfo } from '../types';
import type { ConfirmState } from './CartConfirmModal';
import { CartItemRow } from './CartItemRow';

interface CartItemsCardProps {
  items: CartItem[];
  selectedKeys: string[];
  allSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (key: string, checked: boolean) => void;
  liveInfo: Record<string, LiveInfo>;
  isUnavailable: (item: CartItem) => boolean;
  getOriginalPrice: (item: CartItem) => number | undefined;
  pickerKey: string | null;
  setPickerKey: (key: string | null) => void;
  handleVariantChange: (item: CartItem, newSize: string, newColor: string | undefined) => void;
  syncProduct: (id: string, updates: Partial<CartItem>) => void;
  updateQuantity: (id: string, size: string, color: string | undefined, quantity: number) => void;
  setConfirm: (state: ConfirmState) => void;
  saveForLater: (id: string) => void;
  removeSelectedKey: (id: string) => void;
}

export function CartItemsCard({
  items,
  selectedKeys,
  allSelected,
  handleSelectAll,
  handleSelectItem,
  liveInfo,
  isUnavailable,
  getOriginalPrice,
  pickerKey,
  setPickerKey,
  handleVariantChange,
  syncProduct,
  updateQuantity,
  setConfirm,
  saveForLater,
  removeSelectedKey,
}: CartItemsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-t-2xl">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span>Chọn tất cả ({items.length} món)</span>
        </div>
        <div className="hidden sm:flex items-center justify-end gap-10 pr-4">
          <span className="w-20 text-center">Đơn giá</span>
          <span className="w-24 text-center">Số lượng</span>
          <span className="w-24 text-center">Thành tiền</span>
          <span className="w-16 text-center">Thao tác</span>
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setConfirm({ kind: 'bulk' })}
            disabled={selectedKeys.length === 0}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-500 flex items-center gap-1 transition-colors"
          >
            <Trash2 size={13} />
            <span>Xóa chọn ({selectedKeys.length})</span>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-100">
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
              saveForLater={saveForLater}
              removeSelectedKey={removeSelectedKey}
              originalPrice={originalPrice}
            />
          );
        })}
      </div>

      {/* Card Footer Action Bar (Bulk Select & Delete) */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gray-50/60 border-t border-gray-100 rounded-b-2xl text-xs sm:text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-gray-700 hover:text-blue-600 transition-colors">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={allSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span>Chọn tất cả ({items.length})</span>
        </label>
        <button
          onClick={() => setConfirm({ kind: 'bulk' })}
          disabled={selectedKeys.length === 0}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Xóa các mục đã chọn ({selectedKeys.length})</span>
        </button>
      </div>
    </div>
  );
}
