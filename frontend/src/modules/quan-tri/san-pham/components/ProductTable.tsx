'use client';
import React from 'react';
import { Eye, EyeOff, Edit, Trash2, BadgePercent, RefreshCcw, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';

interface ProductTableProps {
  products: any[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  activeTab: 'all' | 'promo' | 'hidden' | 'trash';
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  formatPrice: (price: number) => string;
  getDisplayTags: (product: any) => string[];
  handleEdit: (product: any) => void;
  handleToggleVisibility: (product: any) => void;
  handleSoftDelete: (product: any) => void;
  handleRestore: (product: any) => void;
  handleDelete: (id: string) => void;
  openDiscountModal: (product: any) => void;
  // Bulk selection props
  selectedProductIds?: string[];
  onToggleSelect?: (productId: string) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
}

export default function ProductTable({
  products,
  loading,
  currentPage,
  itemsPerPage,
  activeTab,
  sortConfig,
  handleSort,
  formatPrice,
  getDisplayTags,
  handleEdit,
  handleToggleVisibility,
  handleSoftDelete,
  handleRestore,
  handleDelete,
  openDiscountModal,
  selectedProductIds = [],
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected = false,
}: ProductTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider select-none">
            <tr>
              {/* Checkbox Select All */}
              <th className="px-4 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected && products.length > 0}
                  onChange={onToggleSelectAll}
                  disabled={loading || products.length === 0}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer transition"
                  title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả sản phẩm trang này"}
                />
              </th>
              <th className="px-3 py-4 w-12 text-center">STT</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Sản phẩm {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('product_id')}>
                <div className="flex items-center gap-1">
                  Mã (ASIN) {sortConfig?.key === 'product_id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4">Danh mục & Môn</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('stock')}>
                <div className="flex items-center gap-1">
                  Kho & Tồn {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Giá {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Không tìm thấy sản phẩm nào</td>
              </tr>
            ) : (
              products.map((product, index) => {
                const stockNum = product.stock !== undefined ? product.stock : 100;
                const isSelected = selectedProductIds.includes(product.product_id);
                const isOutOfStock = stockNum <= 0;
                const isLowStock = stockNum > 0 && stockNum <= 5;

                return (
                  <tr
                    key={`${product.product_id}-${index}`}
                    className={`transition border-b border-gray-100 ${isSelected
                        ? 'bg-blue-50/60 hover:bg-blue-50'
                        : isOutOfStock
                          ? 'bg-red-50/20 hover:bg-red-50/40'
                          : isLowStock
                            ? 'bg-amber-50/20 hover:bg-amber-50/40'
                            : 'hover:bg-gray-50'
                      }`}
                  >
                    {/* Checkbox Single */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect && onToggleSelect(product.product_id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer transition"
                      />
                    </td>

                    <td className="px-3 py-3 text-center text-gray-500 font-medium whitespace-nowrap w-12 text-xs">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-3 flex items-center gap-3">
                      <div className="relative shrink-0 w-12 h-12">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        {product.is_hidden && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white p-0.5 rounded-full shadow-sm" title="Sản phẩm đang bị ẩn">
                            <EyeOff size={11} />
                          </span>
                        )}
                        {product.is_deleted && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full shadow-sm" title="Trong thùng rác">
                            <Trash2 size={11} />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-gray-900 line-clamp-1 max-w-[220px]" title={product.name}>{product.name}</span>
                          {product.brand && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {product.brand}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          {product.gender && <span>Dành cho: <strong className="text-gray-700">{product.gender}</strong></span>}
                          {product.is_hidden && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Đang ẩn</span>}
                          {product.is_deleted && <span className="text-[10px] text-red-600 font-bold uppercase tracking-wide bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Thùng rác</span>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-3 font-mono text-gray-600 text-xs">{product.product_id}</td>

                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {getDisplayTags(product).map((tag, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-xs font-semibold ${i === 0 ? 'bg-blue-100 text-blue-800' :
                              i === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {tag as string}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Cột Kho hàng kèm Cảnh báo thông minh */}
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isOutOfStock
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : isLowStock
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                          {(isOutOfStock || isLowStock) && (
                            <AlertTriangle size={12} className={isOutOfStock ? 'text-red-600 animate-pulse' : 'text-amber-600'} />
                          )}
                          {isOutOfStock ? 'Hết hàng (0)' : isLowStock ? `Sắp hết (${stockNum})` : `${stockNum} chiếc`}
                        </span>

                        {isLowStock && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                            ⚠️ Cần nhập thêm hàng
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-0.5">
                            ⛔ Ngừng bán ngoài web
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3 font-mono font-bold text-gray-900">
                      {product.discount_percent > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                          <span className="text-blue-600">{formatPrice(product.price * (1 - product.discount_percent / 100))}</span>
                        </div>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {activeTab === 'trash' ? (
                          <>
                            <button
                              onClick={() => handleRestore(product)}
                              className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                              title="Khôi phục lại sản phẩm"
                            >
                              <RefreshCcw size={17} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.product_id)}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openDiscountModal(product)}
                              className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                              title="Thiết lập giảm giá"
                            >
                              <BadgePercent size={17} />
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(product)}
                              className={`p-1.5 rounded-lg transition ${product.is_hidden
                                  ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                                  : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                                }`}
                              title={product.is_hidden ? "Hiện lại sản phẩm ra cửa hàng" : "Ẩn sản phẩm khỏi khách hàng"}
                            >
                              {product.is_hidden ? <Eye size={17} /> : <EyeOff size={17} />}
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                              title="Chỉnh sửa sản phẩm"
                            >
                              <Edit size={17} />
                            </button>
                            <button
                              onClick={() => handleSoftDelete(product)}
                              className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                              title="Chuyển vào thùng rác"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
