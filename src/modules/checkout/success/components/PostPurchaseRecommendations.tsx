import React from "react";
import { BrainCircuit, ChevronsLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PostPurchaseRecommendations() {
  return (
    <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100">
      {/* Section Header with AI Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={24} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Gợi ý bổ trợ cho đơn hàng của bạn từ SportsAI Engine
            </h2>
            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] uppercase font-bold tracking-wider border border-blue-100">
              NCF Next-Basket
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Dựa trên giày marathon Carbon và trang phục Dry-Fit bạn vừa mua, thuật toán Neural Collaborative Filtering đề xuất 3 món đồ tối ưu hiệu suất tập luyện:
          </p>
        </div>
        <Link href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 whitespace-nowrap self-start sm:self-auto transition-colors">
          Xem tất cả gợi ý AI
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Recommendation Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reco 1 */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between group hover:bg-gray-100/50 transition-colors border border-gray-100">
          <div>
            <div className="relative w-full aspect-square rounded-md bg-white overflow-hidden mb-3 border border-gray-100">
              <img alt="Đôi Tạ Tay Thông Minh Điều Chỉnh 10kg SportsAI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1XasXB4Iuh85cuNy8s_UKr_GlZ7hAolo_Yk-N-0I1ESohuK8lMD89YSql-4W6JyifL7yuKC33Lsu57jK400-DA96Q4QwjlX6DFE4HtjBQF0FfNdPOJ8xEblP-HK-YUuLduEY0GCaKhT2rt6UY5k4tljMe-wY-VXVRuX1CDgmzpaAiJqi47DgN6MDsiMlIOy6WXsjXqd7dKm35Lrp_eRybeTvkUabpJN5x4D01qlrTnBSpebX6jIizdJE3M"/>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[10px] text-blue-600 font-bold shadow-sm">
                Khớp 98% mục tiêu
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
              Đôi Tạ Tay Thông Minh Điều Chỉnh 10kg SportsAI
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              Cơ chế xoay đổi tạ từ 2kg - 10kg nhanh trong 1 giây, bổ trợ tăng sức bền cơ bắp khi chạy dài.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <span className="font-mono text-base text-gray-900 font-bold">1.850.000 đ</span>
            </div>
            <button className="h-8 px-3 rounded-md bg-gray-900 text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm" type="button">
              <ChevronsLeft size={14} />
              <span>Thêm nhanh</span>
            </button>
          </div>
        </div>

        {/* Reco 2 */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between group hover:bg-gray-100/50 transition-colors border border-gray-100">
          <div>
            <div className="relative w-full aspect-square rounded-md bg-white overflow-hidden mb-3 border border-gray-100">
              <img alt="Quần Short Tập Gym Co Giãn 2 Lớp Thoáng Khí SportsAI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1VbTDd9GBnJYuyFyePfCGJmP_p7E_iU3jNwdOakpW5ckXAj-xKuqSLGsvV7NLvHvOyTPNjZLOSu0mw3WE1l1WoQ31dpm7z0KyXnShCb6pyhvE9laD1BHuPkHiye1FJmI_DtxgnvdAOANbJk_D1-hCHSCEWu7-pYDxaAn7mJZ4RgMbpgg2Igm9f9tRBejHSWMW32uCsMNw76juYttwt4qwZRT7Gf6MnPrC6biYtiN2bNBzJ0mu58mqTewXY"/>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[10px] text-green-700 font-bold shadow-sm">
                Phối đồ chuẩn AI
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
              Quần Short Tập Gym Co Giãn 2 Lớp Thoáng Khí
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              Thiết kế lớp lót bó cơ đùi chống ma sát, đồng bộ màu sắc hoàn hảo với áo Dry-Fit bạn vừa mua.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <span className="font-mono text-base text-gray-900 font-bold">280.000 đ</span>
            </div>
            <button className="h-8 px-3 rounded-md bg-gray-900 text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm" type="button">
              <ChevronsLeft size={14} />
              <span>Thêm nhanh</span>
            </button>
          </div>
        </div>

        {/* Reco 3 */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between group hover:bg-gray-100/50 transition-colors border border-gray-100">
          <div>
            <div className="relative w-full aspect-square rounded-md bg-white overflow-hidden mb-3 border border-gray-100">
              <img alt="Balo Dã Ngoại Chống Nước Ultra-light" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida/AEtjO1V8NRsSaYUYFyws_w5zmugQVcnp5xjyGsQpom8WJX2ncwp-VZUW4KNjjUKCGQ7hhT9sm50d71cru9bRW5U4NJ2xPnDuvcnUXgtGOLEXcwjed4I1Ka4u1DzLGKYueoh_nYyus2nfOo2bgXCQ-Q_Oa9b6Q2HtZ6Wuk9DVmAZ9QtlqHhULk9R1afxmZO2mxmwpyrlxELH0T1K5SdSKEDKezyIaBliGk6JWTlNK0bursq2TLRM-YBR7Je_3ZGc"/>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[10px] text-blue-600 font-bold shadow-sm">
                Đồng hành Marathon
              </span>
            </div>
            <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
              Balo Dã Ngoại Chống Nước Ultra-light
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              Chất liệu Cordura siêu nhẹ, có ngăn thông khí đựng riêng giày chạy và khăn tập đẫm mồ hôi.
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <span className="font-mono text-base text-gray-900 font-bold">850.000 đ</span>
            </div>
            <button className="h-8 px-3 rounded-md bg-gray-900 text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm" type="button">
              <ChevronsLeft size={14} />
              <span>Thêm nhanh</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
