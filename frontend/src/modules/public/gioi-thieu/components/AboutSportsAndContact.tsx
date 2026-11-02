import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { SPORT_CATEGORIES, BRAND_PARTNERS } from '../data/aboutUsData';

export default function AboutSportsAndContact() {
  return (
    <>
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-16 my-8">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Danh mục trọng tâm
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 text-balance">
                Trang bị chuyên sâu từng bộ môn
              </h2>
            </div>
            <Link
              href="/san-pham"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Xem toàn bộ 551+ sản phẩm <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SPORT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.path}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-balance">
                      {cat.name}
                    </h3>
                    <ArrowRight
                      size={16}
                      className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-pretty">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 text-center">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
          Sản phẩm chính hãng từ các thương hiệu thể thao hàng đầu thế giới
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {BRAND_PARTNERS.map((brand) => (
            <span
              key={brand}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/70 font-black text-slate-500 tracking-wider text-xs sm:text-sm hover:text-slate-900 hover:border-slate-300 transition-all cursor-default select-none shadow-2xs"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                Thông tin liên hệ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 mb-4 text-balance">
                KADY Sport Việt Nam
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 text-pretty">
                Bạn cần hỗ trợ chọn size, tư vấn chọn vợt hoặc cần kiểm tra tình trạng đơn hàng? Đội ngũ CSKH KADY luôn sẵn sàng giải đáp nhanh chóng.
              </p>

              <div className="space-y-3.5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-pretty">
                    Trụ sở chính: 123 Đường Thể Thao, Quận 7, TP. Hồ Chí Minh
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-emerald-400 shrink-0" />
                  <span>
                    Hotline hỗ trợ: <strong className="text-white tabular-nums">1900 6868</strong> (08:00 - 22:00)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-400 shrink-0" />
                  <span>
                    Email:{' '}
                    <a href="mailto:support@kady.vn" className="text-blue-300 hover:underline">
                      support@kady.vn
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-400 shrink-0" />
                  <span>Hoạt động: Tất cả các ngày trong tuần (kể cả Thứ 7 &amp; CN)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Tư vấn trực tuyến đang hoạt động
                </div>
                <h3 className="text-lg font-bold text-white mb-2 text-balance">
                  Bạn cần tư vấn chọn đồ vừa vặn?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 text-pretty">
                  Đừng ngần ngại nhắn tin trực tiếp qua Zalo. Chuyên viên sẽ hỗ trợ bạn đối chiếu số đo, form dáng và hướng dẫn đổi size tận nhà nếu không ưng ý.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://zalo.me/0988888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-sm px-5 py-3 rounded-xl transition shadow-md"
                >
                  <MessageCircle size={18} />
                  Chat Zalo ngay
                </a>
                <a
                  href="tel:19006868"
                  className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition border border-slate-600"
                >
                  <Phone size={18} />
                  Gọi 1900 6868
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
