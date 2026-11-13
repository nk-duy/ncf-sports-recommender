'use client';

interface ProductVariantSelectorProps {
  colors?: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide: () => void;
  getSizeStock: (size: string) => number;
  hasVariants: boolean;
  quantity: number;
  effectiveStock: number;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  errorMsg: string;
}

export default function ProductVariantSelector({
  colors,
  selectedColor,
  onSelectColor,
  availableSizes,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
  getSizeStock,
  hasVariants,
  quantity,
  effectiveStock,
  onDecrementQuantity,
  onIncrementQuantity,
  errorMsg,
}: ProductVariantSelectorProps) {
  return (
    <>
      {errorMsg && (
        <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* Bộ chọn Màu sắc (Kiểu ô chọn có dấu tích) */}
      {colors && colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-slate-900">
              Màu sắc <span className="text-red-500">*</span>
              {selectedColor && <span className="ml-1.5 font-semibold text-blue-600">({selectedColor})</span>}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => onSelectColor(color)}
                  className={`relative h-9 px-3.5 text-xs md:text-sm font-medium rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-2xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {color}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bộ chọn Kích cỡ (Kiểu ô chọn có dấu tích) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-slate-900">
            Kích cỡ <span className="text-red-500">*</span>
            {selectedSize && <span className="ml-1.5 font-semibold text-blue-600">({selectedSize})</span>}
          </h3>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Bảng quy đổi kích cỡ
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const sizeStock = getSizeStock(size);
            const outOfStock = sizeStock <= 0;
            const isSelected = selectedSize === size;

            return (
              <button
                type="button"
                key={size}
                disabled={outOfStock}
                onClick={() => {
                  if (!outOfStock) onSelectSize(size);
                }}
                className={`relative h-9 px-3.5 text-xs md:text-sm font-medium rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                  outOfStock
                    ? 'border-slate-200 text-slate-300 bg-slate-50 line-through cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {size}
                {isSelected && !outOfStock && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                {outOfStock ? (
                  <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full">
                    Hết
                  </span>
                ) : selectedColor && hasVariants && sizeStock <= 5 ? (
                  <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
                    Còn {sizeStock}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tùy chọn Số lượng & Tồn kho chung 1 hàng */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="text-xs font-bold text-slate-900">Số lượng:</span>
          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden h-8 sm:h-9">
            <button
              type="button"
              onClick={onDecrementQuantity}
              className="w-7 sm:w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-8 sm:w-9 text-center font-bold text-xs text-slate-900">{quantity}</span>
            <button
              type="button"
              onClick={onIncrementQuantity}
              className="w-7 sm:w-8 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-[11px] sm:text-xs shrink-0">
          {effectiveStock <= 0 ? (
            <span className="text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded">Hết hàng</span>
          ) : (
            <span className="text-slate-500 font-medium">
              Còn <strong className="text-slate-800">{effectiveStock}</strong> có sẵn
            </span>
          )}
        </div>
      </div>
    </>
  );
}
