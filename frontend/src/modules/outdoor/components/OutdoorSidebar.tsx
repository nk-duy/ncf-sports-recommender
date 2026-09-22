export default function OutdoorSidebar() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Dã Ngoại
          </h2>
          <button className="text-xs text-blue-600 font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        {/* Loại thiết bị & dụng cụ */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Loại thiết bị & dụng cụ</h3>
          <div className="space-y-3">
            {[
              { label: 'Lều & Bạt Dã Ngoại', count: 42, checked: true },
              { label: 'Balo Trekking & Hiking', count: 68, checked: true },
              { label: 'Giày Leo Núi & Trail', count: 35, checked: false },
              { label: 'Bình Nước & Túi Nước', count: 29, checked: false },
              { label: 'Bếp & Dụng Cụ Cắm Trại', count: 24, checked: false },
              { label: 'Đèn Pin & Thiết Bị Sinh Tồn', count: 19, checked: false },
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

        {/* Mục đích hoạt động */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mục đích hoạt động</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Leo Núi / Trek', checked: true },
              { label: 'Camping Cắm Trại', checked: false },
              { label: 'Chạy Trail', checked: false },
              { label: 'Du Lịch Phượt', checked: false },
            ].map((activity, idx) => (
              <button 
                key={idx}
                className={`py-2 px-1 text-[11px] sm:text-xs font-medium rounded-lg border transition-colors flex items-center justify-center ${activity.checked ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {activity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sức chứa / Dung tích */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Sức chứa / Dung tích</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '1 - 2 Người', checked: false },
              { label: '3 - 4 Người', checked: true },
              { label: '5 - 8 Người', checked: false },
              { label: '25L - 35L', checked: false },
              { label: '45L - 60L', checked: true },
              { label: '70L+', checked: false },
            ].map((capacity, idx) => (
              <button 
                key={idx}
                className={`py-2 flex flex-col items-center justify-center text-xs font-medium rounded-lg border transition-colors ${capacity.checked ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {capacity.label.split(' ').map((word, i) => (
                  <span key={i}>{word}</span>
                ))}
              </button>
            ))}
          </div>
        </div>

        {/* Mức giá */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mức giá</h3>
          <div className="space-y-3">
            {[
              { label: 'Dưới 500.000đ', checked: false },
              { label: '500.000đ - 1.500.000đ', checked: true },
              { label: '1.500.000đ - 3.000.000đ', checked: false },
              { label: 'Trên 3.000.000đ', checked: false },
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

        {/* Chỉ số chống nước */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Chỉ số chống nước</h3>
          <div className="space-y-3">
            {[
              { label: 'Chống nước PU 3000mm - 5000mm', checked: true },
              { label: 'Vải GORE-TEX chuyên dụng', checked: false },
              { label: 'Khung hợp kim nhôm hàng không siêu nhẹ', checked: true },
            ].map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                  {item.checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${item.checked ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col items-center text-center">
        <div className="mb-3 bg-white/20 p-3 rounded-full">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 className="text-lg font-black leading-tight mb-2 uppercase">COMBO DÃ NGOẠI TRỌN GÓI</h3>
        <p className="text-xs text-orange-50 leading-snug mb-5">
          Mua trọn bộ Lều Cắm Trại + 2 Balo Trekking nhận ngay bếp gas dã ngoại mini trị giá 350.000đ
        </p>
        <div className="bg-white text-orange-600 text-xs font-black text-center py-2 px-6 rounded-lg border-2 border-dashed border-orange-300 uppercase tracking-wider">
          Mã: COMBOCAMP
        </div>
      </div>
    </div>
  );
}
