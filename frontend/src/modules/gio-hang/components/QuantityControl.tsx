import React, { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { CartItem } from "@/shared/store/cartStore";

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
  const max = item.stock || 100;
  const [draft, setDraft] = useState(String(item.quantity));

  useEffect(() => {
    setDraft(String(item.quantity));
  }, [item.quantity]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === '0') {
      setDraft(String(item.quantity));
      onRequestRemove();
      return;
    }
    let n = parseInt(trimmed, 10);
    if (isNaN(n) || n < 1) {
      setDraft(String(item.quantity));
      return;
    }
    if (n > max) {
      notifications.show({ title: 'Vượt quá tồn kho', message: `Sản phẩm này chỉ còn ${max} cái trong kho`, color: 'red' });
      n = max;
    }
    setDraft(String(n));
    if (n !== item.quantity) onChange(n);
  };

  return (
    <div className={`flex items-center border border-gray-200 rounded-md overflow-hidden ${disabled ? 'opacity-50' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (item.quantity <= 1 ? onRequestRemove() : onChange(item.quantity - 1))}
        className="w-8 h-8 text-gray-600 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center text-lg disabled:cursor-not-allowed"
        aria-label="Giảm số lượng"
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        className="w-12 h-8 text-center text-sm font-medium focus:outline-none focus:bg-blue-50 disabled:bg-gray-50"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
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
            notifications.show({ title: 'Vượt quá tồn kho', message: `Sản phẩm này chỉ còn ${max} cái trong kho`, color: 'red' });
          } else {
            onChange(item.quantity + 1);
          }
        }}
        className="w-8 h-8 text-gray-600 hover:bg-gray-100 border-l border-gray-200 flex items-center justify-center text-lg disabled:cursor-not-allowed"
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}
