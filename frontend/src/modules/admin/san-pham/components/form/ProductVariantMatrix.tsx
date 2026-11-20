'use client';
import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, XCircle, Sparkles, Hash } from 'lucide-react';
import { COLOR_HEX_MAP } from '../../utils/variantMatrixHelpers';

export interface ProductVariantItem {
  color?: string;
  size?: string;
  stock: number;
  sku?: string;
  price?: number;
}

interface ProductVariantMatrixProps {
  colors: string[];
  sizes: string[];
  variants: ProductVariantItem[];
  onChangeVariants: (variants: ProductVariantItem[]) => void;
  productId?: string;
  targetTotalStock?: number;
}

export default function ProductVariantMatrix({
  colors,
  sizes,
  variants,
  onChangeVariants,
  targetTotalStock,
}: ProductVariantMatrixProps) {
  const [bulkStock, setBulkStock] = useState<number | ''>('');

  const handleStockChange = (index: number, newStock: number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], stock: Math.max(0, newStock) };
    onChangeVariants(updated);
  };

  const handleSkuChange = (index: number, newSku: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], sku: newSku };
    onChangeVariants(updated);
  };

  const handleApplyBulk = () => {
    if (bulkStock === '' || isNaN(Number(bulkStock))) return;
    const val = Math.max(0, Number(bulkStock));
    const updated = variants.map(v => ({ ...v, stock: val }));
    onChangeVariants(updated);
  };

  // Tính năng: Phân bổ đều tổng số lượng tồn kho cho các phân loại
  const handleDistributeTotal = (targetVal: number) => {
    if (isNaN(targetVal) || targetVal <= 0 || variants.length === 0) return;

    const count = variants.length;
    const base = Math.floor(targetVal / count);
    let remainder = targetVal % count;

    const updated = variants.map(v => {
      const added = remainder > 0 ? 1 : 0;
      if (remainder > 0) remainder--;
      return {
        ...v,
        stock: base + added,
      };
    });

    onChangeVariants(updated);
  };

  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  if (colors.length === 0 && sizes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center gap-3 text-gray-500 text-xs">
        <Layers size={18} className="text-gray-400 shrink-0" />
        <span>
          💡 Hãy chọn ít nhất <strong>1 Màu sắc</strong> hoặc <strong>1 Kích cỡ</strong> ở phía trên để hệ thống tự động sinh <strong>Ma trận Tồn kho theo từng phân loại</strong>.
        </span>
      </div>
    );
  }

  return (
    <div className="border border-blue-100 bg-blue-50/20 rounded-2xl p-5 space-y-4">
      {/* Header Ma trận */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Ma trận Phân loại & Tồn kho chi tiết
            </h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {variants.length} phân loại
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Nhập số lượng thực tế trong kho cho từng kết hợp Màu và Kích cỡ
          </p>
        </div>

        {/* Tổng tồn kho badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
          <span className="text-xs text-gray-500 font-medium">Tổng kho:</span>
          <span className="text-sm font-black text-blue-600">{totalStock}</span>
          <span className="text-xs text-gray-400">sản phẩm</span>
        </div>
      </div>

      {/* Thanh công cụ: Điền nhanh số lượng đồng loạt & Presets */}
      <div className="bg-white p-3 rounded-xl border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-amber-500" />
          <span className="text-xs font-semibold text-gray-700">Điền nhanh cho mỗi phân loại:</span>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={bulkStock}
            onChange={e => setBulkStock(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-18 px-2.5 py-1 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-center"
          />
          <button
            type="button"
            onClick={handleApplyBulk}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-2xs cursor-pointer"
          >
            Áp dụng tất cả
          </button>
        </div>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {targetTotalStock !== undefined && targetTotalStock > 0 && (
            <button
              type="button"
              onClick={() => handleDistributeTotal(targetTotalStock)}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-[11px] cursor-pointer"
            >
              Chia đều {targetTotalStock}
            </button>
          )}
          <button
            type="button"
            onClick={() => { onChangeVariants(variants.map(v => ({ ...v, stock: 10 }))); }}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold text-[11px] cursor-pointer"
          >
            Mỗi loại 10
          </button>
          <button
            type="button"
            onClick={() => { onChangeVariants(variants.map(v => ({ ...v, stock: 20 }))); }}
            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-semibold text-[11px] cursor-pointer"
          >
            Mỗi loại 20
          </button>
          <button
            type="button"
            onClick={() => { onChangeVariants(variants.map(v => ({ ...v, stock: 0 }))); }}
            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md font-semibold text-[11px] cursor-pointer"
          >
            Đặt hết về 0
          </button>
        </div>
      </div>

      {/* Bảng Ma trận biến thể */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs max-h-80 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 sticky top-0 z-10 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Màu sắc</th>
              <th className="px-4 py-3">Kích cỡ</th>
              <th className="px-4 py-3 w-36">Tồn kho</th>
              <th className="px-4 py-3 w-40">Mã SKU</th>
              <th className="px-4 py-3 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {variants.map((v, idx) => {
              const hex = v.color ? COLOR_HEX_MAP[v.color] || '#9CA3AF' : null;
              const isOutOfStock = (v.stock || 0) === 0;
              const isLowStock = (v.stock || 0) > 0 && (v.stock || 0) <= 10;

              return (
                <tr key={`${v.color || 'none'}-${v.size || 'none'}-${idx}`} className="hover:bg-blue-50/30 transition-colors">
                  {/* Cột Màu sắc */}
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {v.color ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: hex || '#ccc' }}
                        />
                        <span>{v.color}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Mặc định</span>
                    )}
                  </td>

                  {/* Cột Kích cỡ */}
                  <td className="px-4 py-2.5 font-bold">
                    {v.size ? (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md border border-gray-200">
                        {v.size}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Mặc định</span>
                    )}
                  </td>

                  {/* Cột Tồn kho */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={e => handleStockChange(idx, Number(e.target.value))}
                        className={`w-20 px-2.5 py-1 border rounded-lg text-xs font-bold outline-none text-center transition-all ${
                          isOutOfStock
                            ? 'border-red-300 bg-red-50 text-red-600'
                            : isLowStock
                            ? 'border-amber-300 bg-amber-50 text-amber-700'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900'
                        }`}
                      />
                      <span className="text-[11px] text-gray-400">cái</span>
                    </div>
                  </td>

                  {/* Cột SKU */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <Hash size={12} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={v.sku || ''}
                        onChange={e => handleSkuChange(idx, e.target.value)}
                        placeholder="Mã SKU"
                        className="w-full px-2 py-1 border border-gray-200 rounded-md text-[11px] font-mono text-gray-600 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </td>

                  {/* Cột Trạng thái */}
                  <td className="px-4 py-2.5 text-right">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        <XCircle size={12} /> Hết hàng
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <AlertTriangle size={12} /> Sắp hết ({v.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 size={12} /> Còn hàng ({v.stock})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
