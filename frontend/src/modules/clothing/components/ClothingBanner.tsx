export default function ClothingBanner() {
  return (
    <div className="bg-[#1A2352] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm flex items-center justify-between">
      {/* Nền trang trí bên phải */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600/20 skew-x-[-20deg] translate-x-10"></div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-semibold tracking-wider mb-5 flex items-center gap-2 w-fit">
          <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
          </svg>
          BỘ SƯU TẬP XUÂN HÈ 2025
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase">
          Quần Áo Thể Thao Chính Hãng
        </h1>
        <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          Công nghệ vải thoáng khí Dry-Fit, co giãn 4 chiều và kháng khuẩn. Thiết kế tối ưu cho chạy
          bộ, tập gym, yoga và phong cách năng động hằng ngày.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Vải sợi Dry-Fit thấm hút mồ hôi
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đổi size miễn phí trong 30 ngày
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            100% Chính hãng phân phối
          </div>
        </div>
      </div>

      {/* Vest Icon */}
      <div className="relative z-10 hidden lg:block opacity-60 hover:opacity-100 transition-opacity duration-500">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300 drop-shadow-2xl">
          <path d="M7 3h10" />
          <path d="M5 6v14" />
          <path d="M19 6v14" />
          <path d="M7 21h10" />
          <path d="M5 6h2l2 2 2-2 2 2 2-2h2" />
          <path d="M5 21h2l2-2 2 2 2-2 2 2h2" />
          <circle cx="9" cy="14" r="1.5" fill="currentColor" />
          <path d="M14 13h2v2h-2z" />
        </svg>
      </div>
    </div>
  );
}
