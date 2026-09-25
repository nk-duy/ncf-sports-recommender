'use client';
import React, { useEffect, useState } from "react";
import { CheckCircle2, Bookmark, Trash2 } from "lucide-react";
import { useCartStore } from "@/shared/store/cartStore";
import Link from "next/link";

export default function CartItems({ readonly = false }: { readonly?: boolean }) {
  const { items, removeItem, updateQuantity, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!mounted) return <div className="bg-white p-7 rounded-lg shadow-sm border border-gray-100 min-h-[200px] flex items-center justify-center">Đang tải giỏ hàng...</div>;

  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{readonly ? 'Sản phẩm đã chọn' : 'Giỏ hàng SportsAI'}</h1>
          <span className="font-mono text-sm text-gray-500">({getTotalItems()} sản phẩm)</span>
        </div>
        {getTotalItems() > 0 && (
          <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
            <CheckCircle2 size={16} />
            Đủ điều kiện miễn phí giao hàng toàn quốc
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <React.Fragment key={`${item.product_id}-${item.size}`}>
              <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 bg-white">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-100">
                    <img alt={item.name} className="w-full h-full object-cover aspect-square" src={item.image_url} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-[10px] tracking-wider uppercase font-bold">SportsAI</span>
                      <span className="text-xs font-semibold text-green-700">Còn hàng</span>
                    </div>
                    <h2 className="text-sm font-bold text-gray-900 truncate">
                      <Link href={`/products/${item.product_id}`} className="hover:text-blue-600">
                        {item.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-gray-500">
                      Size: {item.size} 
                      {item.color && <span> | Màu: {item.color}</span>}
                    </p>
                    <div className="sm:hidden font-mono text-sm font-bold text-gray-900 mt-1">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  {/* Stepper Quantity */}
                  {!readonly ? (
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-l-md font-bold" 
                        type="button">-</button>
                      <input className="w-9 h-8 text-center bg-transparent font-mono text-sm font-semibold text-gray-900 focus:outline-none" readOnly type="text" value={item.quantity} />
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-r-md font-bold" 
                        type="button">+</button>
                    </div>
                  ) : (
                    <div className="font-mono text-sm font-bold text-gray-900">SL: {item.quantity}</div>
                  )}
                  <div className="text-right hidden sm:block min-w-[120px]">
                    <div className="font-mono text-base font-bold text-gray-900 leading-tight">{formatPrice(item.price * item.quantity)}</div>
                    <div className="font-mono text-xs text-gray-500">Đơn giá: {formatPrice(item.price)}</div>
                  </div>
                  {/* Action buttons */}
                  {!readonly && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <button className="p-1.5 hover:text-blue-600 transition-colors" title="Lưu lại mua sau" type="button">
                        <Bookmark size={20} />
                      </button>
                      <button 
                        onClick={() => removeItem(item.product_id, item.size, item.color)}
                        className="p-1.5 hover:text-red-600 transition-colors" title="Xóa khỏi giỏ hàng" type="button">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </article>
              <div className="w-full h-px bg-gray-100 my-0"></div>
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
