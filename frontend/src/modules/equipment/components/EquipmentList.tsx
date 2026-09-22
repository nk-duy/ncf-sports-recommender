import ProductCard from "@/modules/products/components/ProductCard";
import { CATEGORY_EQUIPMENT_MOCK } from "../data/mockEquipment";

export default function EquipmentList() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-bold text-gray-900">8</span> trong số <span className="font-bold text-gray-900">186</span> dụng cụ & thiết bị gym
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Sắp xếp theo:</span>
          <select className="border border-gray-200 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 font-medium">
            <option>Bán chạy nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao xuống Thấp</option>
            <option>Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {CATEGORY_EQUIPMENT_MOCK.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold shadow-sm">
          1
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
          2
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
          3
        </button>
        <span className="w-9 h-9 flex items-center justify-center text-gray-400 tracking-widest">
          ...
        </span>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
          9
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
