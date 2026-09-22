export default function PromotionsFilter() {
  const filters = [
    { label: "Tất cả deal giảm giá", active: true },
    { label: "Giày chạy & sneaker (-40%)", active: false },
    { label: "Quần áo tập Dry-Fit (-55%)", active: false },
    { label: "Lều & Đồ dã ngoại (-30%)", active: false },
    { label: "Thiết bị tập Gym & Yoga (-50%)", active: false },
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter, index) => (
          <button 
            key={index}
            className={`py-2 px-4 rounded-full text-xs font-bold transition-colors ${
              filter.active 
                ? 'bg-gray-900 text-white' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm text-gray-500">Sắp xếp theo:</span>
        <select className="border border-gray-200 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white font-medium shadow-sm">
          <option>% Giảm giá nhiều nhất</option>
          <option>Giá: Thấp đến Cao</option>
          <option>Giá: Cao xuống Thấp</option>
          <option>Bán chạy nhất</option>
        </select>
      </div>
    </div>
  );
}
