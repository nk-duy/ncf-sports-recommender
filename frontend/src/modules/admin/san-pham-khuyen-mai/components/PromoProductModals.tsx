'use client';

import { FALLBACK_PROMO_IMAGE, PromoProductItem, formatPromoPrice } from '../types';

interface PromoProductModalsProps {
  isModalOpen: boolean;
  onCloseEditModal: () => void;
  editingProduct: PromoProductItem | null;
  discountValue: number;
  onDiscountValueChange: (val: number) => void;
  onUpdateDiscount: () => void;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  addSearchQuery: string;
  onAddSearchQueryChange: (val: string) => void;
  availableProducts: PromoProductItem[];
  selectedProductId: string;
  onSelectProductId: (id: string) => void;
  onAddPromotion: () => void;
}

export default function PromoProductModals({
  isModalOpen,
  onCloseEditModal,
  editingProduct,
  discountValue,
  onDiscountValueChange,
  onUpdateDiscount,
  isAddModalOpen,
  onCloseAddModal,
  addSearchQuery,
  onAddSearchQueryChange,
  availableProducts,
  selectedProductId,
  onSelectProductId,
  onAddPromotion,
}: PromoProductModalsProps) {
  return (
    <>
      {/* Edit Discount Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Chỉnh sửa mức giảm giá</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={editingProduct?.image_url || FALLBACK_PROMO_IMAGE}
                  alt={editingProduct?.name || ''}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_PROMO_IMAGE;
                  }}
                />
                <span className="font-semibold text-sm line-clamp-2">
                  {editingProduct?.name}
                </span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phần trăm giảm giá (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountValue}
                  onChange={(e) => onDiscountValueChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={onCloseEditModal}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={onUpdateDiscount}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Promotion Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Thêm sản phẩm khuyến mãi</h2>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tìm kiếm sản phẩm
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={addSearchQuery}
                  onChange={(e) => onAddSearchQueryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {availableProducts.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    Không tìm thấy sản phẩm phù hợp
                  </div>
                ) : (
                  availableProducts.map((p, index) => (
                    <div
                      key={`${p.product_id}-${index}`}
                      onClick={() => onSelectProductId(p.product_id)}
                      className={`p-2 flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition border-b border-gray-100 last:border-0 ${
                        selectedProductId === p.product_id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <img
                        src={p.image_url || FALLBACK_PROMO_IMAGE}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_PROMO_IMAGE;
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {p.product_id} - {formatPromoPrice(p.price)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedProductId && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mức giảm giá (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountValue}
                    onChange={(e) => onDiscountValueChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={onCloseAddModal}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={onAddPromotion}
                disabled={!selectedProductId || discountValue <= 0}
                className="px-4 py-2 bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Thêm khuyến mãi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
