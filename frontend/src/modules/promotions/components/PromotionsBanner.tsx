export default function PromotionsBanner() {
  return (
    <div className="bg-[#111827] rounded-2xl p-6 md:p-10 text-white relative overflow-hidden mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute w-64 h-64 bg-red-600 rounded-full blur-[100px] top-10 right-20"></div>
        <div className="absolute w-64 h-64 bg-blue-600 rounded-full blur-[100px] bottom-10 right-40"></div>
      </div>

      <div className="relative z-10 w-full md:w-3/5">
        <div className="inline-block px-3 py-1 bg-amber-500 rounded-tl-xl rounded-br-xl text-xs font-bold tracking-wider mb-4 text-white">
          ⚡ ĐẠI TIỆC MUA SẮM LỚN NHẤT NĂM 2025
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 tracking-tight leading-none uppercase">
          MEGA FLASH SALE
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tight leading-none uppercase">
          <span className="text-amber-400">GIẢM ĐẾN 50%</span> TOÀN BỘ SẢN PHẨM
        </h2>
        
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
          Hàng ngàn mẫu giày chạy bộ, trang phục thể thao Dry-fit, lều cắm trại dã ngoại và 
          thiết bị tập thể hình chính hãng đang loạt giảm sốc. Số lượng có hạn!
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold bg-gray-800/80 rounded-lg px-4 py-3 border border-gray-700">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kết thúc sau
            
            <div className="flex items-center gap-1.5 ml-2">
              <div className="bg-red-600 rounded pt-1 pb-0.5 px-2 text-center w-12 flex flex-col items-center">
                <span className="text-lg leading-none font-black block">02</span>
                <span className="text-[8px] uppercase tracking-wider block opacity-80 mt-1">NGÀY</span>
              </div>
              <span className="text-gray-500 font-bold">:</span>
              <div className="bg-red-600 rounded pt-1 pb-0.5 px-2 text-center w-12 flex flex-col items-center">
                <span className="text-lg leading-none font-black block">14</span>
                <span className="text-[8px] uppercase tracking-wider block opacity-80 mt-1">GIỜ</span>
              </div>
              <span className="text-gray-500 font-bold">:</span>
              <div className="bg-red-600 rounded pt-1 pb-0.5 px-2 text-center w-12 flex flex-col items-center">
                <span className="text-lg leading-none font-black block">38</span>
                <span className="text-[8px] uppercase tracking-wider block opacity-80 mt-1">PHÚT</span>
              </div>
              <span className="text-gray-500 font-bold">:</span>
              <div className="bg-red-600 rounded pt-1 pb-0.5 px-2 text-center w-12 flex flex-col items-center">
                <span className="text-lg leading-none font-black block">52</span>
                <span className="text-[8px] uppercase tracking-wider block opacity-80 mt-1">GIÂY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-8 rounded-lg text-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            SĂN DEAL NGAY
          </button>
          <span className="text-sm text-gray-300 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Áp dụng đồng thời voucher vận chuyển 0đ
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-2/5 flex flex-col gap-4">
        {/* Box 1 */}
        <div className="bg-[#b91c1c] rounded-xl p-5 relative overflow-hidden shadow-lg border border-red-500/30">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="inline-block px-2 py-0.5 bg-red-950 text-red-200 text-[10px] font-bold tracking-wider rounded uppercase mb-2">
            Ưu đãi thanh toán
          </div>
          <h3 className="text-xl font-bold mb-1">Giảm thêm 10% qua VNPay & MoMo</h3>
          <p className="text-red-200 text-xs">Tối đa 100.000đ cho đơn từ 600.000đ</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-800/50 p-2 rounded-lg">
            <svg className="w-8 h-8 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-[#1e3a8a] rounded-xl p-5 relative overflow-hidden shadow-lg border border-blue-500/30">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
            </svg>
          </div>
          <div className="inline-block px-2 py-0.5 bg-blue-950 text-blue-200 text-[10px] font-bold tracking-wider rounded uppercase mb-2">
            Quà tặng kèm
          </div>
          <h3 className="text-xl font-bold mb-1">Tặng Bình Nước Thể Thao 750ml</h3>
          <p className="text-blue-200 text-xs">Cho hóa đơn thể thao từ 1.200.000đ</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-800/50 p-2 rounded-lg">
            <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
