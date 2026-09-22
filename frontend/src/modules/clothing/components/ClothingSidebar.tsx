export default function ClothingSidebar() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Trang Phục
          </h2>
          <button className="text-xs text-blue-600 font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        {/* Loại trang phục */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Loại trang phục</h3>
          <div className="space-y-3">
            {[
              { label: 'Áo Thun Dry-Fit', count: 86, checked: true },
              { label: 'Quần Đùi / Shorts Tập Gym', count: 64, checked: true },
              { label: 'Áo Khoác Gió Thể Thao', count: 38, checked: false },
              { label: 'Áo Nén Cơ (Compression)', count: 29, checked: false },
              { label: 'Quần Dài Jogger & Legging', count: 42, checked: false },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                    {item.checked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{item.label}</span>
                </div>
                <span className="text-xs text-gray-400">{item.count}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dành cho */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Dành cho</h3>
          <div className="grid grid-cols-3 gap-2">
            {['Nam', 'Nữ', 'Unisex'].map((gender) => (
              <button 
                key={gender}
                className={`py-2 text-sm font-medium rounded-lg border transition-colors ${gender === 'Nam' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Kích thước */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Kích cỡ (Size)</h3>
            <span className="text-[10px] text-blue-600 font-medium hover:underline cursor-pointer">Bảng size</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
              <button 
                key={size}
                className={`py-2 text-sm font-medium rounded-lg border transition-colors ${size === 'M' || size === 'L' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Mức giá */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mức giá</h3>
          <div className="space-y-3">
            {[
              { label: 'Dưới 300.000đ', checked: false },
              { label: '300.000đ - 700.000đ', checked: true },
              { label: '700.000đ - 1.200.000đ', checked: false },
              { label: 'Trên 1.200.000đ', checked: false },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${item.checked ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                  {item.checked && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                </div>
                <span className={`text-sm ${item.checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Màu sắc */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Màu sắc</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { bg: 'bg-black', border: 'border-gray-900' },
              { bg: 'bg-gray-500', border: 'border-gray-500' },
              { bg: 'bg-white', border: 'border-gray-200' },
              { bg: 'bg-blue-600', border: 'border-blue-600' },
              { bg: 'bg-green-500', border: 'border-green-500' },
              { bg: 'bg-red-600', border: 'border-red-600' },
            ].map((color, idx) => (
              <button 
                key={idx}
                className={`w-7 h-7 rounded-full border-2 ${color.bg} ${idx === 0 ? 'ring-2 ring-offset-2 ring-blue-500 ' + color.border : color.border}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-md flex flex-col items-center text-center">
        <div className="mb-3">
          <svg className="w-8 h-8 text-white/90" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        </div>
        <h3 className="text-lg font-black leading-tight mb-2 uppercase">COMBO ĐỒ TẬP ƯU ĐÃI</h3>
        <p className="text-xs text-orange-50 leading-snug mb-5">
          Mua Combo 1 Áo Dry-fit + 1 Quần Shorts giảm thêm ngay 15%
        </p>
        <div className="bg-white text-orange-600 text-xs font-black text-center py-2 px-6 rounded-lg border-2 border-dashed border-orange-300 uppercase tracking-wider">
          Mã: COMBOSPORT
        </div>
      </div>
    </div>
  );
}
