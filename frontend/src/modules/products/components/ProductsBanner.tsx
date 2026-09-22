export default function ProductsBanner() {
  return (
    <div className="bg-[#1A2352] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm">
      {/* Decorative background elements can go here if needed */}
      <div className="relative z-10 max-w-2xl">
        <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-semibold tracking-wider mb-5">
          BỘ SƯU TẬP GIÀY 2025
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
          GIÀY THỂ THAO CHÍNH HÃNG
        </h1>
        <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          Khám phá hơn 250+ mẫu giày chạy bộ, training, marathon và sneaker thời trang từ các thương
          hiệu hàng đầu thế giới với trợ lực êm ái, bứt phá giới hạn.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cam kết chính hãng 100%
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đổi size miễn phí trong 30 ngày
          </div>
        </div>
      </div>
    </div>
  );
}
