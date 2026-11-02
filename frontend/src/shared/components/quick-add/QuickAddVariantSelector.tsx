'use client';

interface QuickAddVariantSelectorProps {
  availableColors: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  quantity: number;
  onDecreaseQty: () => void;
  onIncreaseQty: () => void;
}

export default function QuickAddVariantSelector({
  availableColors,
  selectedColor,
  onSelectColor,
  availableSizes,
  selectedSize,
  onSelectSize,
  quantity,
  onDecreaseQty,
  onIncreaseQty,
}: QuickAddVariantSelectorProps) {
  return (
    <div className="border-t border-slate-100 pt-4 space-y-4">
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Màu sắc:{' '}
              <span className={selectedColor ? 'text-blue-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {selectedColor || '(Vui lòng chọn màu)'}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onSelectColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            Kích cỡ / Size:{' '}
            <span className={selectedSize ? 'text-blue-600 font-semibold' : 'text-amber-600 font-semibold'}>
              {selectedSize || '(Vui lòng chọn kích cỡ)'}
            </span>
          </span>
        </div>

        {availableSizes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`min-w-[42px] px-3 py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/25'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="inline-block px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Tiêu chuẩn (Freesize)
          </div>
        )}
      </div>

      {/* Quantity Selection */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-slate-700">Số lượng:</span>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={onDecreaseQty}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors cursor-pointer"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center font-bold text-xs text-slate-900 bg-white h-8 flex items-center justify-center border-x border-slate-200">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncreaseQty}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
