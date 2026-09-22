export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                S
              </div>
              <span className="text-xl font-black text-white uppercase">
                Sports<span className="text-sky-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Hệ thống phân phối đồ thể thao, giày dép và phụ kiện tập luyện
              hàng đầu Việt Nam. Cam kết chất lượng chính hãng 100%.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              Chính sách mua hàng
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  className="hover:text-white hover:underline transition"
                  href="#"
                >
                  Giao hàng & vận chuyển
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white hover:underline transition"
                  href="#"
                >
                  Đổi trả trong 30 ngày
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              Kết nối với chúng tôi
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Theo dõi fanpage để nhận ngay mã giảm giá độc quyền cho đơn hàng
              đầu tiên.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>© 2026 SportsAI Vietnam. Tất cả quyền được bảo lưu.</div>
        </div>
      </div>
    </footer>
  );
}
