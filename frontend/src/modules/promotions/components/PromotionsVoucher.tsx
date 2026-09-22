export default function PromotionsVoucher() {
  const vouchers = [
    {
      id: 1,
      title: "Mã GIẢM100K",
      desc: "Đơn hàng từ 999.000đ",
      info: "HSD: 30/10/2026",
      btnColor: "bg-red-600 hover:bg-red-700",
      tagColor: "text-red-600 bg-red-100",
      tag: "NGẬP MÃ",
      iconColor: "text-red-500"
    },
    {
      id: 2,
      title: "Mã FREESHIP0Đ",
      desc: "Miễn phí ship tối đa 40k",
      info: "Đã dùng 84%",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      tagColor: "text-blue-600 bg-blue-100",
      tag: "FREESHIP EXTRA",
      iconColor: "text-blue-500"
    },
    {
      id: 3,
      title: "Mã SUPER99",
      desc: "Áp dụng đơn từ 1500k",
      info: "Số lượng có hạn",
      btnColor: "bg-amber-500 hover:bg-amber-600",
      tagColor: "text-amber-600 bg-amber-100",
      tag: "ĐỘC QUYỀN",
      iconColor: "text-amber-500"
    },
    {
      id: 4,
      title: "Mã WELCOME50K",
      desc: "Giảm ngay 50k cho đơn đầu",
      info: "Đơn từ 300.000đ",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
      tagColor: "text-emerald-600 bg-emerald-100",
      tag: "KHÁCH MỚI",
      iconColor: "text-emerald-500"
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
            KHO VOUCHER KHUYẾN MÃI TOÀN SÀN
          </h2>
          <span className="hidden md:inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
            Thu thập mỗi ngày
          </span>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả voucher (12)
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-200 transition-all flex">
            {/* Left side (Discount style notch) */}
            <div className="w-4 bg-gray-50 flex flex-col justify-between items-center py-2 border-r border-dashed border-gray-300">
              <div className="w-3 h-3 bg-gray-50 rounded-full -ml-2 border border-gray-200"></div>
              <div className="w-3 h-3 bg-gray-50 rounded-full -ml-2 border border-gray-200"></div>
              <div className="w-3 h-3 bg-gray-50 rounded-full -ml-2 border border-gray-200"></div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-4 flex flex-col relative">
              <div className="absolute top-4 right-4">
                <svg className={`w-6 h-6 ${voucher.iconColor} opacity-20`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="mb-2">
                <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm mb-2 ${voucher.tagColor}`}>
                  {voucher.tag}
                </span>
                <h3 className="font-bold text-gray-900 leading-tight">{voucher.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{voucher.desc}</p>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="text-[10px] text-gray-400 font-medium">{voucher.info}</span>
                <button className={`px-4 py-1.5 rounded-full text-white text-xs font-bold transition-colors ${voucher.btnColor}`}>
                  Lưu mã
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
