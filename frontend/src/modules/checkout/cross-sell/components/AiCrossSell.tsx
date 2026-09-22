import React from "react";
import { BrainCircuit, Plus } from "lucide-react";

export default function AiCrossSell() {
  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100">
      {/* AI Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Gợi ý mua kèm tối ưu từ AI SportsAI</h2>
        </div>
        <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold flex items-center gap-1.5 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
          Thuật toán NCF &amp; Basket Analysis v2.4
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Dựa trên sự kết hợp hiện tại <strong className="text-gray-900 font-semibold">(Giày chạy Carbon + Áo Dry-fit + Thảm Yoga)</strong>, mô hình AI đề xuất 3 phụ kiện hỗ trợ tối đa hóa hiệu suất bài tập của bạn:
      </p>
      
      {/* 3 Cross-Selling Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rec Card 1 */}
        <div className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
          <div>
            <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden mb-3 border border-gray-100">
              <img alt="Bộ Dây Kháng Lực Latex Tập Thể Lực Đa Năng" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XUzUB9Wr9yxJGSvrJMmf50tUvtKZ1wBgLD702_K_dDKHOnxL8zt3Wtp-HomsilsvNemBsDN7RP9CJZBwun70FJYpck8UwwZukkeC13VimZmFix3oTogZ9dP6lmZgLMalrQUBZtwjtf9w6zuQcFvEBsO7iWSoRAnLpdXl4akAdmffo7D1CdjyboRHGTPVlIREwqfMQUjiKR9tUymv993kTj_q4pdCJt1amnBiIkHVRW2XLiE34EUXlkEg"/>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold shadow-sm">
                Khớp 97% bài tập
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
              Bộ Dây Kháng Lực Latex Tập Thể Lực Đa Năng SportsAI
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono text-sm font-bold text-gray-900">190.000 đ</span>
              <span className="font-mono text-xs text-gray-400 line-through">250.000 đ</span>
              <span className="text-red-600 text-[11px] font-bold">-24%</span>
            </div>
          </div>
          {/* CTA Button strictly minimalist flat black */}
          <button className="w-full h-9 bg-gray-900 hover:bg-black text-white rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm" type="button">
            <Plus size={16} />
            Thêm vào đơn
          </button>
        </div>

        {/* Rec Card 2 */}
        <div className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
          <div>
            <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden mb-3 border border-gray-100">
              <img alt="Quần Short Tập Gym Co Giãn 2 Lớp" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1VbTDd9GBnJYuyFyePfCGJmP_p7E_iU3jNwdOakpW5ckXAj-xKuqSLGsvV7NLvHvOyTPNjZLOSu0mw3WE1l1WoQ31dpm7z0KyXnShCb6pyhvE9laD1BHuPkHiye1FJmI_DtxgnvdAOANbJk_D1-hCHSCEWu7-pYDxaAn7mJZ4RgMbpgg2Igm9f9tRBejHSWMW32uCsMNw76juYttwt4qwZRT7Gf6MnPrC6biYtiN2bNBzJ0mu58mqTewXY"/>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-green-700 text-[10px] font-bold shadow-sm">
                Combo với Áo Dry-Fit
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
              Quần Short Tập Gym Co Giãn 2 Lớp Thoáng Khí SportsAI
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono text-sm font-bold text-gray-900">280.000 đ</span>
              <span className="font-mono text-xs text-gray-500 font-semibold bg-gray-100 px-1 rounded">Chuẩn Pro</span>
            </div>
          </div>
          <button className="w-full h-9 bg-gray-900 hover:bg-black text-white rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm" type="button">
            <Plus size={16} />
            Thêm vào đơn
          </button>
        </div>

        {/* Rec Card 3 */}
        <div className="flex flex-col justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
          <div>
            <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden mb-3 border border-gray-100">
              <img alt="Đôi Tạ Tay Thông Minh Điều Chỉnh 10kg" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XasXB4Iuh85cuNy8s_UKr_GlZ7hAolo_Yk-N-0I1ESohuK8lMD89YSql-4W6JyifL7yuKC33Lsu57jK400-DA96Q4QwjlX6DFE4HtjBQF0FfNdPOJ8xEblP-HK-YUuLduEY0GCaKhT2rt6UY5k4tljMe-wY-VXVRuX1CDgmzpaAiJqi47DgN6MDsiMlIOy6WXsjXqd7dKm35Lrp_eRybeTvkUabpJN5x4D01qlrTnBSpebX6jIizdJE3M"/>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold shadow-sm">
                Mua kèm giảm 100k
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
              Đôi Tạ Tay Thông Minh Điều Chỉnh 10kg SportsAI
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono text-sm font-bold text-gray-900">1.850.000 đ</span>
              <span className="font-mono text-xs text-gray-400 line-through">1.950.000 đ</span>
            </div>
          </div>
          <button className="w-full h-9 bg-gray-900 hover:bg-black text-white rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm" type="button">
            <Plus size={16} />
            Thêm vào đơn
          </button>
        </div>
      </div>
    </section>
  );
}
