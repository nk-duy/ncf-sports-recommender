export default function PromotionsFilter() {
  const categories = [
    "Bóng Chuyền",
    "Cầu Lông",
    "Thể Thao",
    "Chạy Bộ",
    "Phụ Kiện",
  ];

  const sizes = ["Freesize", "M", "L", "XL"];
  const colors = [
    { name: "Đen", hex: "#000000" },
    { name: "Trắng", hex: "#ffffff" },
    { name: "Vàng", hex: "#eab308" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 sticky top-24">
      {/* Category Sidebar block */}
      <div className="border border-gray-100 bg-white">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="px-5 py-3 text-sm text-gray-700 hover:text-red-600 cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Size Sidebar block */}
      <div className="border border-gray-100 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Size</h3>
        <div className="flex flex-col gap-3">
          {sizes.map((size, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-red-600 transition">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Sidebar block */}
      <div className="border border-gray-100 bg-white p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Màu</h3>
        <div className="flex flex-col gap-3">
          {colors.map((color, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer" />
              <div 
                className="w-4 h-4 rounded-sm border border-gray-200" 
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm text-gray-600 group-hover:text-red-600 transition">{color.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
