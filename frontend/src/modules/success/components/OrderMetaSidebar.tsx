export default function OrderMetaSidebar() {
  return (
    <div className="space-y-6">
      {/* 1. Địa chỉ nhận hàng */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Địa chỉ nhận hàng
        </h3>
        <div className="text-sm">
          <p className="font-bold text-gray-900 mb-1">Nguyễn Khánh Duy</p>
          <p className="text-gray-600 mb-1">0908 123 456</p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
          </p>
          <div className="flex items-start gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-xs">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Shipper sẽ gọi trước khi giao 15 phút.</p>
          </div>
        </div>
      </div>

      {/* 2. Phương thức thanh toán */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Phương thức thanh toán
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Hình thức:</span>
            <span className="font-bold text-gray-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
              VNPAY-QR
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded tracking-wider uppercase">Đã quyết toán</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Thời gian:</span>
            <span className="text-gray-900 font-medium">14:28:19 - <span className="text-gray-500">Hôm nay</span></span>
          </div>
        </div>
      </div>

      {/* 3. Dịch vụ vận chuyển */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Dịch vụ vận chuyển
        </h3>
        <div className="text-sm">
          <p className="text-gray-600 mb-3">SportsAI Express Logistics <span className="font-medium text-gray-900">(Tiêu chuẩn)</span></p>
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
            <span className="text-gray-500">Mã vận đơn:</span>
            <span className="font-bold text-gray-900 font-mono tracking-widest">SPAI-VN-772918</span>
          </div>
        </div>
      </div>
    </div>
  );
}
