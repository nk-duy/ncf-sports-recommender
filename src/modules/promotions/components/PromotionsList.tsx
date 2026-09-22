import ProductCard from "@/modules/products/components/ProductCard";
import { PROMOTIONS_MOCK } from "../data/mockPromotions";

export default function PromotionsList() {
  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {PROMOTIONS_MOCK.map((product) => (
          <ProductCard key={product.id} product={product} isPromo={true} />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        Hiển thị <span className="font-bold text-gray-900">8</span> trong số <span className="font-bold text-gray-900">124</span> sản phẩm khuyến mãi hôm nay
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-red-600 text-white font-bold shadow-sm">
          1
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          2
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          3
        </button>
        <span className="w-9 h-9 flex items-center justify-center text-gray-400 tracking-widest">
          ...
        </span>
        <button className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors font-medium">
          16
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
