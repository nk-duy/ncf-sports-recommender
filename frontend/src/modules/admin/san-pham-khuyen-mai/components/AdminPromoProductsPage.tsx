'use client';

import {
  Plus,
  Search,
  Download,
  Tag,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { useAdminPromoProducts } from '../hooks/useAdminPromoProducts';
import PromoProductsTable from './PromoProductsTable';
import PromoProductModals from './PromoProductModals';

export default function AdminPromoProductsPage() {
  const {
    promoProducts,
    loading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    discountValue,
    setDiscountValue,
    isAddModalOpen,
    setIsAddModalOpen,
    addSearchQuery,
    setAddSearchQuery,
    selectedProductId,
    setSelectedProductId,
    filteredPromoProducts,
    searchFilteredAvailable,
    openAddModal,
    handleExportExcel,
    handleRemovePromotion,
    handleEdit,
    handleUpdateDiscount,
    handleAddPromotion,
  } = useAdminPromoProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sản phẩm Khuyến mãi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các sản phẩm đang được giảm giá
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã ASIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-10 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
            />
          </div>

          <button
            onClick={handleExportExcel}
            className="h-10 px-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl shadow-2xs inline-flex items-center gap-2 transition"
          >
            <Download size={16} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={openAddModal}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-2xs hover:shadow-xs transition inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Thêm SP Khuyến mãi</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng SP Khuyến mãi
            </span>
            <span className="text-2xl font-black text-gray-900">
              {promoProducts.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Tag size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Mức giảm trung bình
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {promoProducts.length > 0
                ? `${Math.round(
                    promoProducts.reduce(
                      (acc, p) => acc + (p.discount_percent || 0),
                      0
                    ) / promoProducts.length
                  )}%`
                : '0%'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Đang áp dụng
            </span>
            <span className="text-2xl font-black text-purple-600">
              {promoProducts.filter((p) => p.is_active).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      <PromoProductsTable
        loading={loading}
        products={filteredPromoProducts}
        onEdit={handleEdit}
        onRemovePromotion={handleRemovePromotion}
      />

      <PromoProductModals
        isModalOpen={isModalOpen}
        onCloseEditModal={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        discountValue={discountValue}
        onDiscountValueChange={setDiscountValue}
        onUpdateDiscount={handleUpdateDiscount}
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        addSearchQuery={addSearchQuery}
        onAddSearchQueryChange={setAddSearchQuery}
        availableProducts={searchFilteredAvailable}
        selectedProductId={selectedProductId}
        onSelectProductId={setSelectedProductId}
        onAddPromotion={handleAddPromotion}
      />
    </div>
  );
}
