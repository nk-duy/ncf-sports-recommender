'use client';

import { Edit, Trash2 } from 'lucide-react';
import { FALLBACK_PROMO_IMAGE, PromoProductItem, formatPromoPrice } from '../types';

interface PromoProductsTableProps {
  loading: boolean;
  products: PromoProductItem[];
  onEdit: (product: PromoProductItem) => void;
  onRemovePromotion: (id: string) => void;
}

export default function PromoProductsTable({
  loading,
  products,
  onEdit,
  onRemovePromotion,
}: PromoProductsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Mã (ASIN)</th>
              <th className="px-6 py-4">Giá gốc</th>
              <th className="px-6 py-4">Giảm giá</th>
              <th className="px-6 py-4">Giá sau giảm</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Không có sản phẩm khuyến mãi nào
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={`${product.product_id}-${index}`} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 flex items-center gap-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PROMO_IMAGE;
                      }}
                    />
                    <span className="font-semibold text-gray-900 line-clamp-2 max-w-[250px]">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-gray-600">{product.product_id}</td>
                  <td className="px-6 py-3 font-mono text-gray-500 line-through">
                    {formatPromoPrice(product.price)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      -{product.discount_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono font-bold text-blue-600">
                    {formatPromoPrice(product.price * (1 - product.discount_percent / 100))}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition"
                        title="Sửa mức giảm"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onRemovePromotion(product.product_id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition"
                        title="Xóa khuyến mãi"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
