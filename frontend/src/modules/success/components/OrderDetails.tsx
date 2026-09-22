export default function OrderDetails() {
  const items = [
    {
      id: 1,
      name: "Giày Chạy Bộ Marathon Carbon Alpha Pro",
      variant: "Màu: Xanh/Trắng • Size: 42 EU • SL: 1",
      price: 2450000,
      image: "https://www.gstop.vn/wp-content/uploads/2021/04/giay-nike-revolution-5-do-den-bq3204-600-2.jpg",
      tag: "Chính hãng SportsAI Pro"
    },
    {
      id: 2,
      name: "Áo Thun Thể Thao Dry-Fit Pro Training",
      variant: "Màu: Xám Đen • Size: L • SL: 2 (350.000 đ/cái)",
      price: 700000,
      image: "https://www.gstop.vn/wp-content/uploads/2022/10/Giay-Chay-Bo-Nam-Nike-Air-Zoom-Pegasus-39-DH4071-007-DenXanh-2.jpg"
    },
    {
      id: 3,
      name: "Thảm Tập Yoga Định Tuyến TPE 6mm Chống Trượt",
      variant: "Màu: Xanh Rêu • Dày: 6mm TPE • SL: 1",
      price: 450000,
      image: "https://www.gstop.vn/wp-content/uploads/2024/04/Giay-Chay-Bo-Nam-Qiaodan-Feiying-Pb4.0-Qinggong-2.0-Ff-Q322420108-TrangXanh-3-768x768.jpg"
    },
    {
      id: 4,
      name: "Bộ Dây Kháng Lực Latex Tập Thể Lực Đa Năng",
      variant: "Set 5 cấp độ • SL: 1",
      price: 190000,
      oldPrice: 250000,
      image: "https://www.gstop.vn/wp-content/uploads/2021/08/giay-nike-air-force-1-low-triple-white-cw2288-111-2-1.jpg",
      badge: "ƯU ĐÃI KÈM AI -40%"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Sản phẩm trong đơn hàng</h2>
          <p className="text-xs text-gray-500 font-medium">4 sản phẩm - Đóng gói bảo đảm từ AI</p>
        </div>
        <span className="text-xs font-bold text-gray-500 bg-gray-200/50 px-3 py-1.5 rounded-lg border border-gray-200">#S8-8942</span>
      </div>

      {/* Items */}
      <div className="px-5 md:px-6 divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="py-5 flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{item.name}</h3>
              {item.badge && (
                <span className="inline-block bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider mb-1.5">
                  {item.badge}
                </span>
              )}
              <p className="text-xs text-gray-500 mb-1.5">{item.variant}</p>
              {item.tag && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item.tag}
                </span>
              )}
            </div>

            <div className="flex flex-col items-end flex-shrink-0 text-right">
              <span className="font-black text-gray-900">{item.price.toLocaleString('vi-VN')} đ</span>
              {item.oldPrice && (
                <span className="text-[10px] text-gray-400 line-through mt-0.5">{item.oldPrice.toLocaleString('vi-VN')} đ</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="px-5 md:px-6 py-5 bg-gray-50/50 border-t border-b border-gray-100 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Tạm tính sản phẩm</span>
          <span className="font-bold text-gray-900">3.790.000 đ</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Phí vận chuyển tiêu chuẩn</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Freeship đơn {'>'} 500k</span>
          </div>
          <span className="font-bold text-gray-900">0 đ</span>
        </div>
        <div className="flex items-center justify-between text-red-500">
          <span className="font-medium">Đặc quyền hội viên SportsAI VIP (Gold - 5%)</span>
          <span className="font-bold">-180.000 đ</span>
        </div>
        <div className="flex items-center justify-between text-red-500">
          <span className="font-medium">Voucher trợ giá thuật toán NCF</span>
          <span className="font-bold">-50.000 đ</span>
        </div>
      </div>

      {/* Total */}
      <div className="px-5 md:px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100">
        <div>
          <span className="font-bold text-gray-900 uppercase tracking-widest text-sm block mb-0.5">Tổng tiền đã thanh toán</span>
          <span className="text-[11px] text-gray-500 font-medium">(Đã bao gồm VAT và các loại thuế phí)</span>
        </div>
        <span className="text-3xl font-black text-blue-600 leading-none">3.560.000 đ</span>
      </div>

      {/* Action Bar */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[250px]">
            Cần thay đổi thông tin nhận hàng trước khi đóng gói? Liên hệ hotline <strong className="text-gray-900">1900 6868</strong>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải hóa đơn (PDF)
          </button>
          
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Tiếp tục mua sắm
          </button>
          
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors md:col-span-2 shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Theo dõi đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
