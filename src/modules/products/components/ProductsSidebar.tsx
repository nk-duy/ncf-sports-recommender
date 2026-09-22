export default function ProductsSidebar() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Sản Phẩm
          </h2>
          <button className="text-xs text-blue-600 font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        {/* Môn thể thao */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Môn thể thao</h3>
          <div className="space-y-3">
            {[
              { label: 'Giày Chạy Bộ (Running)', count: 142, checked: true },
              { label: 'Tập Gym & Fitness', count: 89, checked: false },
              { label: 'Chạy Trail & Dã Ngoại', count: 45, checked: false },
              { label: 'Sneaker Thể Thao / Lifestyle', count: 68, checked: false },
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

        {/* Thương hiệu */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Thương hiệu</h3>
          <div className="space-y-3">
            {[
              { label: 'Nike Performance', count: 62, checked: true },
              { label: 'Adidas Adizero', count: 48, checked: false },
              { label: 'Salomon Trail', count: 31, checked: false },
              { label: 'Aura Lifestyle', count: 27, checked: false },
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

        {/* Kích thước */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Kích thước (Size EU)</h3>
          <div className="grid grid-cols-3 gap-2">
            {['39', '40', '41', '42', '43', '44', '45'].map((size) => (
              <button 
                key={size}
                className={`py-2 text-sm font-medium rounded-lg border transition-colors ${size === '41' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
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
              { label: 'Dưới 1.000.000đ', checked: false },
              { label: '1.000.000đ - 2.500.000đ', checked: true },
              { label: '2.500.000đ - 4.000.000đ', checked: false },
              { label: 'Trên 4.000.000đ', checked: false },
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

        {/* Bảng màu */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Bảng màu</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { bg: 'bg-white', border: 'border-gray-200' },
              { bg: 'bg-gray-900', border: 'border-gray-900' },
              { bg: 'bg-blue-600', border: 'border-blue-600' },
              { bg: 'bg-green-500', border: 'border-green-500' },
              { bg: 'bg-red-500', border: 'border-red-500' },
            ].map((color, idx) => (
              <button 
                key={idx}
                className={`w-7 h-7 rounded-full border-2 ${color.bg} ${idx === 2 ? 'ring-2 ring-offset-2 ring-blue-500 ' + color.border : color.border}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-max px-3 py-1 rounded-full mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          QUÀ TẶNG KÈM
        </div>
        <h3 className="text-xl font-black leading-tight mb-2">TẶNG TẤT CHẠY BỘ CHUYÊN DỤNG</h3>
        <p className="text-sm text-orange-50 leading-snug mb-6">
          Cho tất cả đơn hàng giày chạy bộ có giá trị trên 1.500.000đ trong tuần này.
        </p>
        <div className="bg-white text-orange-600 text-sm font-black text-center py-2.5 rounded-lg border-2 border-dashed border-orange-300">
          Mã: FREESOCKS
        </div>
      </div>
    </div>
  );
}
