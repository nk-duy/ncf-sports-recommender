import Link from 'next/link';
import { ShoppingBag, Sparkles, MessageCircle, Cpu } from 'lucide-react';
import { SYSTEM_METRICS } from '../data/aboutUsData';

export default function AboutHeroAndMetrics() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-transparent pointer-events-none" />

        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold border border-blue-400/25 tracking-wide shadow-xs">
              <Sparkles size={14} className="text-blue-400" />
              HỆ THỐNG KADY SPORTS &amp; NCF RECOMMENDATION ENGINE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
              Đồng hành cùng đam mê thể thao &amp; Công nghệ gợi ý thông minh
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-pretty max-w-2xl">
              KADY Sport kết hợp nguồn trang bị thể thao chính hãng tuyển chọn với hệ thống gợi ý cá nhân hóa dựa trên học sâu (Neural Collaborative Filtering - NeuMF). Chúng tôi giúp bạn nhanh chóng tìm thấy trang thiết bị vừa vặn và tối ưu nhất cho từng buổi tập luyện.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <ShoppingBag size={18} />
                Khám phá 551+ sản phẩm
              </Link>
              <Link
                href="/#ai-recommendations"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-all duration-200 cursor-pointer"
              >
                <Cpu size={18} className="text-indigo-400" />
                Trải nghiệm Gợi ý AI (NCF)
              </Link>
              <a
                href="https://zalo.me/0988888888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-white/15 transition-all duration-200"
              >
                <MessageCircle size={18} className="text-blue-400" />
                Tư vấn chọn size
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SYSTEM_METRICS.map((metric, idx) => (
            <div
              key={metric.label}
              className={`flex flex-col justify-between ${
                idx !== 0 ? 'sm:border-l sm:border-slate-100 sm:pl-6' : ''
              }`}
            >
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  {metric.badge}
                </span>
                <div className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-slate-800 text-balance">{metric.label}</div>
                <div className="text-xs text-slate-500 mt-0.5 text-pretty leading-relaxed">
                  {metric.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
