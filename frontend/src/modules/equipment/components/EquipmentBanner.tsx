export default function EquipmentBanner() {
  return (
    <div className="bg-[#141b3d] rounded-2xl p-10 text-white relative overflow-hidden mb-8 shadow-sm flex items-center justify-between">
      {/* Nền trang trí bên phải */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600/10 skew-x-[-15deg] translate-x-10"></div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-block px-4 py-1.5 border border-blue-400/30 rounded-full text-xs font-semibold tracking-wider mb-5 flex items-center gap-2 w-fit bg-blue-900/30">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          BỘ SƯU TẬP DỤNG CỤ GYM & HOME FITNESS 2025
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase">
          Thiết Bị Tập Gym & Dụng Cụ Thể Hình Chính Hãng
        </h1>
        <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          Nâng tầm vóc dáng và sức mạnh tại nhà với hệ thống thiết bị tập luyện chuyên nghiệp.
          Thép chịu lực cao cấp, bảo hành tới 24 tháng.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-black/20 border border-blue-500/20 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thép carbon & Cao su cao cấp chống trượt
          </div>
          <div className="flex items-center gap-2 bg-black/20 border border-blue-500/20 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Bảo hành chính hãng 12 - 36 tháng tận nơi
          </div>
          <div className="flex items-center gap-2 bg-black/20 border border-blue-500/20 px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            100% Chính hãng phân phối
          </div>
        </div>
      </div>

      {/* Dumbbell Icon */}
      <div className="relative z-10 hidden lg:flex opacity-40 hover:opacity-100 transition-opacity duration-500 mr-8 items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500 drop-shadow-2xl">
          <path d="M19 6v12h-2V6h2zm-4 2v8h-6V8h6zM7 6v12H5V6h2zm-2 2H2v8h3V8zm14 0h3v8h-3V8z" />
        </svg>
      </div>
    </div>
  );
}
