'use client';
import React from 'react';
import { Eye, EyeOff, Edit, Trash2, BadgePercent, RefreshCcw, ChevronUp, ChevronDown, AlertTriangle, Info } from 'lucide-react';

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
  onViewDetail?: (product: any) => void;
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
  onViewDetail,
  selectedProductIds = [],
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected = false,
}: ProductTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200/80 select-none">
            <tr>
              {/* Checkbox Select All */}
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected && products.length > 0}
                  onChange={onToggleSelectAll}
                  disabled={loading || products.length === 0}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer transition"
                  title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả sản phẩm trang này"}
                />
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 w-12 text-center">STT</th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Sản phẩm {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('product_id')}>
                <div className="flex items-center gap-1">
                  Mã SKU {sortConfig?.key === 'product_id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5">Danh mục & Môn</th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('stock')}>
                <div className="flex items-center gap-1">
                  Kho & Tồn {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Giá {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-500 uppercase py-3 px-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">Không tìm thấy sản phẩm nào</td>
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
                    className={`transition border-b border-slate-100 ${isSelected
                        ? 'bg-blue-50/60 hover:bg-blue-50'
                        : isOutOfStock
                          ? 'bg-rose-50/20 hover:bg-rose-50/40'
                          : isLowStock
                            ? 'bg-amber-50/20 hover:bg-amber-50/40'
                            : 'hover:bg-slate-50/70'
                      }`}
                  >
                    {/* Checkbox Single */}
                    <td className="px-3.5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect && onToggleSelect(product.product_id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer transition"
                      />
                    </td>

                    <td className="px-3.5 py-3 text-center text-slate-500 font-medium whitespace-nowrap w-12 text-xs tabular-nums">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-3.5 py-3 flex items-center gap-3">
                      <div 
                        onClick={() => onViewDetail && onViewDetail(product)}
                        className="relative shrink-0 size-12 cursor-pointer group rounded-lg overflow-hidden border border-slate-200"
                        title="Click để xem chi tiết sản phẩm"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="size-12 object-cover rounded-lg transition-transform duration-200 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                          <Eye size={16} className="text-white drop-shadow" />
                        </div>
                        {product.is_hidden && (
                          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white p-0.5 rounded-full shadow-sm z-10" title="Sản phẩm đang bị ẩn">
                            <EyeOff size={11} />
                          </span>
                        )}
                        {product.is_deleted && (
                          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-0.5 rounded-full shadow-sm z-10" title="Trong thùng rác">
                            <Trash2 size={11} />
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => onViewDetail && onViewDetail(product)}
                            className="font-semibold text-slate-900 truncate max-w-[220px] text-left hover:text-blue-600 transition-colors cursor-pointer"
                            title={`Xem chi tiết: ${product.name}`}
                          >
                            {product.name}
                          </button>
                          {product.brand && (
                            <span className="whitespace-nowrap inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {product.brand}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          {product.gender && <span>Dành cho: <strong className="text-slate-700 font-medium">{product.gender}</strong></span>}
                          {product.is_hidden && <span className="whitespace-nowrap inline-flex items-center text-[10px] text-amber-700 font-bold uppercase tracking-wide bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Đang ẩn</span>}
                          {product.is_deleted && <span className="whitespace-nowrap inline-flex items-center text-[10px] text-rose-700 font-bold uppercase tracking-wide bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Thùng rác</span>}
                        </div>
                      </div>
                    </td>

                    <td className="px-3.5 py-3 font-sans tabular-nums text-slate-600 text-xs">{product.product_id}</td>

                    <td className="px-3.5 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {getDisplayTags(product).map((tag, i) => (
                          <span key={i} className={`whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${i === 0 ? 'bg-blue-50 text-blue-700 border border-blue-200/60' :
                              i === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                            }`}>
                            {tag as string}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Cột Kho hàng kèm Cảnh báo thông minh */}
                    <td className="px-3.5 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium tabular-nums ${isOutOfStock
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isLowStock
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                          {(isOutOfStock || isLowStock) && (
                            <AlertTriangle size={12} className={isOutOfStock ? 'text-rose-600 animate-pulse' : 'text-amber-600'} />
                          )}
                          {isOutOfStock ? 'Hết hàng (0)' : isLowStock ? `Sắp hết (${stockNum})` : `${stockNum} chiếc`}
                        </span>

                        {isLowStock && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                            ⚠️ Cần nhập thêm hàng
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-0.5">
                            ⛔ Ngừng bán ngoài web
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3.5 py-3 font-sans tabular-nums font-bold text-slate-900">
                      {product.discount_percent > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 line-through tabular-nums">{formatPrice(product.price)}</span>
                          <span className="text-blue-600 tabular-nums">{formatPrice(product.price * (1 - product.discount_percent / 100))}</span>
                        </div>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>

                    <td className="px-3.5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {activeTab === 'trash' ? (
                          <>
                            <button
                              onClick={() => handleRestore(product)}
                              className="size-8 inline-flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-150"
                              title="Khôi phục lại sản phẩm"
                              aria-label="Khôi phục lại sản phẩm"
                            >
                              <RefreshCcw size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.product_id)}
                              className="size-8 inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                              title="Xóa vĩnh viễn"
                              aria-label="Xóa vĩnh viễn"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onViewDetail && onViewDetail(product)}
                              className="size-8 inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                              title="Xem chi tiết sản phẩm"
                              aria-label="Xem chi tiết sản phẩm"
                            >
                              <Info size={16} />
                            </button>
                            <button
                              onClick={() => openDiscountModal(product)}
                              className="size-8 inline-flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-150"
                              title="Thiết lập giảm giá"
                              aria-label="Thiết lập giảm giá"
                            >
                              <BadgePercent size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(product)}
                              className={`size-8 inline-flex items-center justify-center rounded-lg transition-colors duration-150 ${product.is_hidden
                                  ? 'text-teal-600 hover:bg-teal-50'
                                  : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                              title={product.is_hidden ? "Hiện lại sản phẩm ra cửa hàng" : "Ẩn sản phẩm khỏi khách hàng"}
                              aria-label={product.is_hidden ? "Hiện lại sản phẩm ra cửa hàng" : "Ẩn sản phẩm khỏi khách hàng"}
                            >
                              {product.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="size-8 inline-flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                              title="Chỉnh sửa sản phẩm"
                              aria-label="Chỉnh sửa sản phẩm"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleSoftDelete(product)}
                              className="size-8 inline-flex items-center justify-center text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                              title="Chuyển vào thùng rác"
                              aria-label="Chuyển vào thùng rác"
                            >
                              <Trash2 size={16} />
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
