export default function Header() {
  return (
    <header className="bg-[#0B1E3F] sticky top-0 z-50 text-white shadow-md">
      {/* Top notification strip */}
      <div className="bg-[#050B14] py-1.5 px-4 text-[11px] text-gray-300 border-b border-white/5 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span>🎉 Siêu hội thể thao 9.9 - Giảm tới 50% tất cả đơn hàng</span>
            <span className="text-gray-600">|</span>
            <span>
              Hotline đặt hàng:{" "}
              <strong className="text-white">1900 6868</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a className="hover:text-white transition" href="#">
              Đồ án Tốt nghiệp - ĐHCT
            </a>
            <span className="text-gray-600">|</span>
            <a className="hover:text-white transition" href="#">
              Tra cứu đơn hàng
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <a className="flex items-center gap-3 group flex-shrink-0" href="/home">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M13 3l-2 8h6l-8 10 2-8H5l8-10z"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white uppercase block leading-none flex items-center gap-2">
                SPORTS<span className="text-sky-400">AI</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">NCF 2.0</span>
              </span>
              <span className="text-[9px] text-slate-300 tracking-wider uppercase font-semibold mt-1">
                HÀNG THỂ THAO CHÍNH HÃNG
              </span>
            </div>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-3xl">
            <div className="relative flex items-center">
              <input
                className="w-full pl-5 pr-28 py-2.5 rounded-full bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm transition placeholder-gray-400"
                placeholder="Tìm kiếm giày chạy bộ, quần áo gym, vợt cầu lông, phụ kiện..."
                type="text"
              />
              <button className="absolute right-1 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-full transition flex items-center gap-2 shadow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tìm</span>
              </button>
            </div>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <a href="/account" className="flex items-center gap-3 group text-white hover:text-blue-200 transition">
              <div className="flex flex-col text-right">
                <span className="text-[13px] font-bold leading-none mb-1 text-white">Nguyễn Khánh Duy</span>
                <span className="text-[10px] text-amber-400 font-bold leading-none">VIP Member</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </a>

            <a
              className="flex items-center gap-3 bg-blue-700/60 hover:bg-blue-600 px-4 py-2.5 rounded-xl transition border border-blue-500/20 group text-white shadow-sm"
              href="/checkout"
            >
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 border border-[#0B1E3F] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </div>
              <span className="text-sm font-bold">Giỏ hàng</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#0B1E3F] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-8 py-3.5 text-sm font-bold text-gray-300">
            <a href="/" className="text-sky-400 relative after:absolute after:bottom-[-14px] after:left-0 after:w-full after:h-[3px] after:bg-sky-400">
              Trang chủ
            </a>
            <a href="/products" className="hover:text-white transition">
              Giày thể thao
            </a>
            <a href="/clothing" className="hover:text-white transition">
              Quần áo
            </a>
            <a href="/outdoor" className="hover:text-white transition">
              Ngoài trời
            </a>
            <a href="/equipment" className="hover:text-white transition">
              Dụng cụ
            </a>
            <a href="/promotions" className="text-amber-500 hover:text-amber-400 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-80"></span>
              Khuyến mãi Siêu Sale (-50%) HOT
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
