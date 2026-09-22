export default function OutdoorBanner() {
  return (
    <div className="bg-[#0f2e22] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm flex items-center justify-between">
      {/* Nền trang trí bên phải */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-600/20 skew-x-[20deg] translate-x-10"></div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-block px-4 py-1.5 border border-emerald-500/30 rounded-full text-xs font-semibold tracking-wider mb-5 flex items-center gap-2 w-fit bg-emerald-900/40">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2c-.37 0-.71.18-.91.48l-8 12.01A1 1 0 002 16h16a1 1 0 00.83-1.56l-8-12A1.002 1.002 0 0010 2zm3.32 12l-2.02-3.03a1 1 0 00-1.66 0L8.62 12.5 6.8 9.77a1 1 0 00-1.66 0L3.4 14h13.2l-3.28-2z" clipRule="evenodd" />
          </svg>
          BỘ SƯU TẬP DÃ NGOẠI & TREKKING 2025
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase">
          Thiết Bị Dã Ngoại & Ngoài Trời Chính Hãng
        </h1>
        <p className="text-emerald-50 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          Chinh phục mọi địa hình với trang thiết bị chống nước, chịu tải cao, siêu nhẹ chuẩn
          chuyên nghiệp. Phục vụ leo núi, trekking, cắm trại gia đình và chạy đường mòn trail.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-black/20 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Chống thấm nước Gore-Tex & Ripstop
          </div>
          <div className="flex items-center gap-2 bg-black/20 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Bảo hành chính hãng 12 - 24 tháng
          </div>
          <div className="flex items-center gap-2 bg-black/20 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            100% Chính hãng phân phối
          </div>
        </div>
      </div>

      {/* Mountain/Tent Icon */}
      <div className="relative z-10 hidden lg:block opacity-60 hover:opacity-100 transition-opacity duration-500 mr-8">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 drop-shadow-2xl">
          <path d="M8 19l4-4 4 4" />
          <path d="M22 19L12 3 2 19h20z" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
