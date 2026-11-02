'use client';
import React, { useState, useEffect } from "react";

interface CartVariantPickerProps {
  sizes: string[];
  colors: string[];
  size: string;
  color?: string;
  onConfirm: (size: string, color: string | undefined) => void;
  onClose: () => void;
}

/** Popover đổi phân loại hàng (size / màu) ngay trong giỏ hàng */
export default function CartVariantPicker({ sizes, colors, size, color, onConfirm, onClose }: CartVariantPickerProps) {
  const [draftSize, setDraftSize] = useState(size);
  const [draftColor, setDraftColor] = useState<string | undefined>(color);

  // Tự động đóng popover khi người dùng lăn chuột/scroll trang để tránh cảm giác bị kéo trôi/đơ giật
  useEffect(() => {
    const handleScroll = () => {
      onClose();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onClose]);

  const needColor = colors.length > 0;
  const canConfirm = !!draftSize && (!needColor || !!draftColor);

  const chip = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md border transition-all ${
      active
        ? 'border-blue-600 text-blue-600 bg-blue-50 font-semibold'
        : 'border-gray-200 text-gray-700 hover:border-blue-400 bg-white'
    }`;

  return (
    <>
      {/* Lớp nền trong suốt để bấm ra ngoài thì đóng popover */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
      />
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="absolute left-0 top-full mt-2 z-50 w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150"
      >
        {sizes.filter(Boolean).length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kích cỡ</div>
            <div className="flex flex-wrap gap-2">
              {sizes.filter(Boolean).map((s) => (
                <button key={s} type="button" className={chip(draftSize === s)} onClick={() => setDraftSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {colors.filter(Boolean).length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Màu sắc</div>
            <div className="flex flex-wrap gap-2">
              {colors.filter(Boolean).map((c) => (
                <button key={c} type="button" className={chip(draftColor === c)} onClick={() => setDraftColor(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Trở lại
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => onConfirm(draftSize, draftColor)}
            className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </>
  );
}
