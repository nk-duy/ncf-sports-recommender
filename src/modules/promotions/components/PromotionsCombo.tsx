export default function PromotionsCombo() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10 md:w-2/3">
        <div className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold tracking-wider rounded-md mb-3 flex items-center gap-1.5 w-fit">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          GÓI COMBO TIẾT KIỆM ĐẾN 40%
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-white drop-shadow-md">
          MUA COMBO TẬP LUYỆN - NHẬN NGAY QUÀ TẶNG KHỦNG
        </h2>
        
        <p className="text-white/90 text-sm md:text-base mb-0">
          Khi mua bộ đôi <span className="font-bold">Giày thể thao + Quần áo Dry-fit</span> hoặc <span className="font-bold">Tạ tay + Thảm Yoga</span>.
          Tặng thêm 01 bình nước thể thao 750ml cao cấp trị giá <span className="line-through opacity-80">199.000đ</span>
        </p>
      </div>

      <div className="relative z-10 md:w-1/3 flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="bg-red-700 border-2 border-dashed border-red-300/50 rounded-xl px-4 py-3 flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-red-200 uppercase tracking-widest font-bold mb-1">Mã voucher combo</span>
          <span className="text-xl font-black tracking-wider">COMBOMAX</span>
        </div>
        <button className="bg-white hover:bg-gray-100 text-red-600 font-black py-4 px-6 rounded-xl whitespace-nowrap shadow-lg transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto">
          ÁP DỤNG NGAY
        </button>
      </div>
    </div>
  );
}
