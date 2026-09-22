export default function EquipmentSidebar() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Dụng Cụ Gym
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
              { label: 'Tạ Tay & Tạ Đòn Thông Minh', count: 38, checked: true },
              { label: 'Dây Kháng Lực & Dây Nhảy', count: 45, checked: true },
              { label: 'Thảm Tập Yoga & Phụ Kiện', count: 28, checked: false },
              { label: 'Con Lăn Bụng & Dụng Cụ Core', count: 19, checked: false },
              { label: 'Ghế Tập & Giàn Tạ Đa Năng', count: 14, checked: false },
              { label: 'Bình Nước & Phụ Kiện Bảo Hộ', count: 22, checked: false },
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

        {/* Nhóm cơ rèn luyện */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Nhóm cơ rèn luyện</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { label: 'Ngực & Tay', checked: true },
              { label: 'Lưng & Xô', checked: false },
              { label: 'Chân & Mông', checked: false },
              { label: 'Cơ Bụng (Core)', checked: false },
            ].map((activity, idx) => (
              <button 
                key={idx}
                className={`py-2 px-1 text-[11px] sm:text-xs font-medium rounded-lg border transition-colors flex items-center justify-center ${activity.checked ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {activity.label}
              </button>
            ))}
          </div>
          <button className="w-full py-2 px-1 text-[11px] sm:text-xs font-medium rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center">
            Toàn Thân
          </button>
        </div>

        {/* Mức tạ / Trọng lượng */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Mức tạ / Trọng lượng</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '1kg - 5kg', checked: false },
              { label: '10kg - 20kg', checked: true },
              { label: '25kg - 50kg', checked: false },
              { label: 'Tùy chỉnh linh hoạt', checked: false },
            ].map((capacity, idx) => (
              <button 
                key={idx}
                className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition-colors ${capacity.checked ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                {capacity.label}
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
              { label: '300.000đ - 1.000.000đ', checked: true },
              { label: '1.000.000đ - 3.000.000đ', checked: false },
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

        {/* Thương hiệu uy tín */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Thương hiệu uy tín</h3>
          <div className="space-y-3">
            {[
              { label: 'IronMaster Pro', checked: true },
              { label: 'PowerFit Tech', checked: false },
              { label: 'AuraFlow Yoga', checked: false },
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
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-md flex flex-col items-center text-center">
        <div className="mb-3">
          <svg className="w-8 h-8 text-white/90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-black leading-tight mb-2 uppercase">COMBO TẬP TẠI NHÀ SIÊU TIẾT KIỆM</h3>
        <p className="text-xs text-orange-50 leading-snug mb-5">
          Mua Bộ Tạ Đơn + Thảm Tập tặng ngay Dây Kháng Lực 5 Cấp Độ trị giá 220.000đ.
        </p>
        <div className="bg-white text-orange-600 text-xs font-black text-center py-2 px-6 rounded-lg border-2 border-dashed border-orange-300 uppercase tracking-wider">
          Mã: COMBOHOMEGYM
        </div>
      </div>
    </div>
  );
}
