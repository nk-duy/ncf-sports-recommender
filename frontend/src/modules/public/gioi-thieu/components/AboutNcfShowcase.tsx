import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { CORE_VALUES, AI_ARCHITECTURE_HIGHLIGHTS } from '../data/aboutUsData';

export default function AboutNcfShowcase() {
  return (
    <>
      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Vì sao chọn KADY?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 text-balance">
            Trải nghiệm mua sắm an tâm &amp; Chuẩn xác
          </h2>
          <p className="text-sm text-slate-500 mt-2 text-pretty leading-relaxed">
            Không chỉ phân phối trang thiết bị thể thao, chúng tôi tập trung giải quyết triệt để nỗi lo chọn nhầm size, hàng kém chất lượng hay chính sách giao vận thiếu linh hoạt.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${val.color}`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 text-balance">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-pretty">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 mb-3">
              <Cpu size={14} className="text-indigo-400" />
              ĐIỂM NHẤN CÔNG NGHỆ ĐỒ ÁN
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white text-balance tracking-tight">
              Hệ Thống Gợi Ý Cá Nhân Hóa Neural Collaborative Filtering (NCF)
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 text-pretty leading-relaxed">
              KADY tích hợp mô hình học sâu NeuMF (PyTorch) kết hợp song song giữa Generalized Matrix Factorization (GMF) và Multi-Layer Perceptron (MLP) để thấu hiểu nhu cầu của từng vận động viên theo thời gian thực.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {AI_ARCHITECTURE_HIGHLIGHTS.map((arch) => {
              const Icon = arch.icon;
              return (
                <div
                  key={arch.title}
                  className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-colors duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${arch.color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 uppercase tracking-wide">
                        {arch.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-2 text-balance">
                      {arch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-pretty">
                      {arch.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>
                Dữ liệu huấn luyện được cập nhật liên tục từ tương tác thật của người dùng và đơn hàng.
              </span>
            </div>
            <Link
              href="/#ai-recommendations"
              className="inline-flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Xem khối gợi ý NCF trên Trang chủ <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
