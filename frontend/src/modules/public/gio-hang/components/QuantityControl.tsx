import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useCartStore, type CartItem } from '@/shared/store/cartStore';

export function QuantityControl({
  item,
  disabled,
  onChange,
  onRequestRemove,
}: {
  item: CartItem;
  disabled: boolean;
  onChange: (q: number) => void;
  onRequestRemove: () => void;
}) {
  const cartItems = useCartStore((s) => s.items);
  const otherSameProductQty = cartItems
    .filter((i) => i.product_id === item.product_id && !(i.size === item.size && i.color === item.color))
    .reduce((sum, i) => sum + i.quantity, 0);

  const totalStock = item.total_stock ?? item.stock ?? 100;
  const remainingTotalStock = Math.max(1, totalStock - otherSameProductQty);
  const max = Math.min(item.stock || 100, remainingTotalStock);

  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const displayValue = editingDraft ?? String(item.quantity);

  const commit = () => {
    if (editingDraft === null) return;
    const trimmed = editingDraft.trim();
    setEditingDraft(null);

    if (trimmed === '0') {
      onRequestRemove();
      return;
    }
    let n = parseInt(trimmed, 10);
    if (Number.isNaN(n) || n < 1) {
      return;
    }
    if (n > max) {
      notifications.show({
        title: 'Vượt quá tồn kho khả dụng',
        message: otherSameProductQty > 0
          ? `Phân loại này chỉ có thể chọn tối đa ${max} chiếc do tổng sản phẩm trong giỏ đã có ${otherSameProductQty} chiếc.`
          : `Phân loại này chỉ còn ${max} cái trong kho`,
        color: 'red',
      });
      n = max;
    }
    if (n !== item.quantity) onChange(n);
  };

  return (
    <div className={`flex items-center border border-gray-200 rounded-md overflow-hidden shrink-0 ${disabled ? 'opacity-50' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (item.quantity <= 1 ? onRequestRemove() : onChange(item.quantity - 1))}
        className="w-7 sm:w-8 h-7 sm:h-8 text-gray-600 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center text-base sm:text-lg disabled:cursor-not-allowed cursor-pointer"
        aria-label="Giảm số lượng"
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        className="w-9 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm font-medium focus:outline-none focus:bg-blue-50 disabled:bg-gray-50"
        value={displayValue}
        onChange={(e) => setEditingDraft(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (item.quantity >= max) {
            notifications.show({
              title: 'Vượt quá tồn kho',
              message: `Sản phẩm này chỉ còn ${max} cái trong kho`,
              color: 'red',
            });
          } else {
            onChange(item.quantity + 1);
          }
        }}
        className="w-7 sm:w-8 h-7 sm:h-8 text-gray-600 hover:bg-gray-100 border-l border-gray-200 flex items-center justify-center text-base sm:text-lg disabled:cursor-not-allowed cursor-pointer"
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}
