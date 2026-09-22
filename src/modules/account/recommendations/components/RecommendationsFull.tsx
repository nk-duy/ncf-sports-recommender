"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Brain, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  Footprints, 
  ArrowRight,
  Zap,
  Heart,
  ShoppingBag,
  ThumbsUp,
  Link as LinkIcon,
  Activity,
  Mountain,
  Info
} from "lucide-react";

export default function RecommendationsFull() {
  return (
    <div className="flex flex-col gap-8">
      {/* Top Title & Subtitle Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
            <Brain size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl text-gray-900 font-bold">Gợi ý thông minh dành riêng cho bạn</h1>
        </div>
        <p className="text-base text-gray-500 max-w-3xl leading-relaxed">
          Hệ gợi ý cá nhân hóa NCF (Neural Collaborative Filtering) phân tích sâu theo hành vi tập luyện, cường độ vận động và lịch sử mua sắm thực tế của bạn.
        </p>
      </div>

      {/* AI Profile Summary Card */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-hidden flex flex-col gap-6">
        {/* Top aesthetic accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-green-500"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" size={24} />
            <h3 className="text-xl text-gray-900 font-bold">Hồ sơ thị hiếu thể thao của Duy</h3>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold transition-colors">
            <SlidersHorizontal size={16} />
            Tùy chỉnh sở thích AI
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Item 1: Cluster */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Cụm hành vi (Cluster)</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-gray-900 leading-tight">Marathon & Fitness</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
                96% Khớp
              </span>
            </div>
            <span className="text-sm text-gray-500">Cường độ cao ~ 4 buổi/tuần</span>
          </div>

          {/* Item 2: Sizes */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Thông số Form dáng AI</span>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500 font-normal">Cỡ giày:</span> 42 EU
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500 font-normal">Trang phục:</span> L (Slim-fit)
              </span>
            </div>
            <span className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Chuẩn xác theo lượt mua gần nhất
            </span>
          </div>

          {/* Item 3: Sports breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="text-xs text-gray-500 uppercase font-semibold">Môn trọng tâm</span>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex my-1">
              <div className="bg-blue-600 h-full" style={{ width: '60%' }} title="Chạy bộ: 60%"></div>
              <div className="bg-blue-400 h-full" style={{ width: '30%' }} title="Gym / Thể lực: 30%"></div>
              <div className="bg-green-500 h-full" style={{ width: '10%' }} title="Dã ngoại: 10%"></div>
            </div>
            <p className="text-sm text-gray-600 truncate">
              Chạy bộ (60%) • Gym (30%) • Dã ngoại (10%)
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Top AI Picks for Running */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Footprints className="text-blue-600" size={28} />
            <div>
              <h2 className="text-xl text-gray-900 font-bold">
                Sản phẩm phù hợp nhất với mục tiêu Chạy bộ của bạn
              </h2>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Top AI Picks For You</span>
            </div>
          </div>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline">
            Xem thêm 12 gợi ý
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              {/* Note: using standard img tag here since it's a mock external URL, replace with next/image if internal */}
              <img 
                alt="Giày Alpha Marathon Đệm Khí Carbon Plate" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1XYuYUz9zvHDX3OxC-fA3mes3FG-S_cigmUpJHaT5L_cw7wxU19QlyeH5IIe1fvbt7JRlssQQpGIDPcWVhBFrddpZta4ygM_j6QzSXco8C5IS9z4z2CvZ1YLkGY05gwEER5foQImNTzHVzAUWL1AfyiRsGyhiHF3QFx0QBv0F__kjeO37ZdSMxdm8spjsGBvSP8JjT_R_A2X_vVqARelByxRC6v6TrHMTQiBDhVbYHkSub-xyzDR6WUyH4"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-sm">
                  <Zap size={14} className="fill-white" />
                  98% Tương đồng NCF
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm" title="Thêm vào yêu thích">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100 text-xs font-semibold w-fit">
                  Đúng Size 42
                </span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Giày Alpha Marathon Đệm Khí Carbon Plate
                </h3>
                <span className="text-sm text-gray-500">Tối ưu phản hồi lực cho Pace dưới 5:00</span>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">2.450.000 đ</span>
                  <span className="text-sm text-gray-400 line-through">2.890.000 đ</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              <img 
                alt="Giày Trail Running Kháng Nước Summit Pro" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1W99qj6J_pZwocUq67enn2HnnVDL-4NGDNvJojRYStbiaEJItrjFFEKyu-_VRQww2mXgCG63V5OwljNMgkh8jpYL4jgOCYysZy023zUAjgsd4Xk2gnW9osG9AtoiDTTk0nblvA4OQsBgnmuPtE63D7doeC5CrJD52oK0-6-02CZRIhF_ZCyunlkySJUAq9ucsaq8nMOgs4sllYhrQ6k89OpDf05pI05Wt9CV2rArvIKiGflUwHMNbVxc88"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold shadow-sm">
                  <Zap size={14} className="fill-white" />
                  94% Tương đồng
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm" title="Thêm vào yêu thích">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold w-fit">
                  Đề xuất theo hành vi ngoài trời
                </span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Giày Trail Running Kháng Nước Summit Pro
                </h3>
                <span className="text-sm text-gray-500">Đế đinh Vibram bám chắc địa hình trơn trượt</span>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">2.100.000 đ</span>
                  <span className="text-sm text-gray-400 line-through">2.350.000 đ</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              <img 
                alt="Áo Thun Chạy Bộ Dry-Fit Ultra Light Siêu Nhẹ" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VZG8y0JaTv6K5siAnZupPcNAyRFsf4Z5xUog7tgSuciEktaGy37v5V9maJhICLb56z_Fmg19nq6htv726WbcvM1DBM844cOxlrW2OfGKk97Xe2cNtSlSqt9dKJPGRK_hEAivZS495m054z5_UiIUDC-siIYHJftxe-t6kiVmzffAtdYagZx6vPU-_Y-9JSEv2pTPWx1A72Tf8gCT2bQSk3irooPPsAcLt0r6t5LZ8p61M9ugpSXS845A"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-600 text-white text-xs font-bold shadow-sm">
                  <ThumbsUp size={14} className="fill-white" />
                  92% Khuyên dùng kèm
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm" title="Thêm vào yêu thích">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-semibold w-fit">
                  Phù hợp thời tiết nắng nóng
                </span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Áo Thun Chạy Bộ Dry-Fit Ultra Light Siêu Nhẹ
                </h3>
                <span className="text-sm text-gray-500">Thoát ẩm tức thì, chuẩn form Size L</span>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">350.000 đ</span>
                  <span className="text-sm text-gray-500">Size: L có sẵn</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Cross-selling Accessories */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <LinkIcon className="text-blue-600" size={26} />
            <div>
              <h2 className="text-xl text-gray-900 font-bold">
                Phụ kiện bổ trợ thường được mua cùng
              </h2>
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Cross-Selling Recommendations</span>
            </div>
          </div>
          <span className="text-sm text-gray-500 hidden sm:inline">Dựa trên 1.200+ vận động viên tương tự</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Dây Kháng Lực */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              <img 
                alt="Dây Kháng Lực Latex Tập Cơ Đùi & Khởi Động" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1U63tJc0fXcGm-mCHpMd--mHnj4w5-qlThPZi_4ynNz9gBqwe_KrUSdhEVQil2PtGetRD2sGzcNlI05tcVKaFOZ72lLo7mXLfHFJLVbTcC7aE2kGZLmiGVopzrtWdVMeBdoSx9ooGPB0QJUXE5xED4ZvggNKEZpbDQl9QQobq-67kEjOhh2Or6TuBms9EUCpJZNlOvlvuzPWyufMCC7stGpJWyDOtAnEqlFqq91Ys4iYeKVAY4W3h-v2w"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-200 text-gray-900 text-xs font-semibold shadow-sm border border-gray-300">
                  <Activity size={14} className="text-blue-600" />
                  89% Tương thích bài tập
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Hỗ trợ cổ chân & nhóm cơ đùi</span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Dây Kháng Lực Latex Tập Cơ Đùi & Khởi Động
                </h3>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">180.000 đ</span>
                  <span className="text-sm text-gray-500">Set 5 mức lực</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Balo Nước Chạy Bộ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              <img 
                alt="Balo Nước Chạy Bộ Địa Hình Chống Rung 5L" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VXk5jFFRhY_wFZoXFaYt5Pt6o_dEBHMA46LRHeW0LZ5j8dErpw3gcaX0CSh9PRYGBz5Z2AuBbGHGtcVHZWGSoauFzHQIPIH68vWyxKsSYXivymFbjAN-YbVEEY5Afgjg-MtGB8hCOwCFBfxJozoIQ72pdkgJJCh2f7MMPMBP8-OOsjF1ly3E9x4vj5wyp97caOyB4DLHsGbaWPXZqKsb8tx41v2bJgc9T86_9JrGaQNY9s02Pk74LU_oQ"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-200 text-gray-900 text-xs font-semibold shadow-sm border border-gray-300">
                  <Mountain size={14} className="text-blue-600" />
                  88% Đề xuất dã ngoại
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Chạy cự ly 21K - 42K Trail</span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Balo Nước Chạy Bộ Địa Hình Chống Rung 5L
                </h3>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">680.000 đ</span>
                  <span className="text-sm text-gray-500">Kèm túi nước 1.5L</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Quần Short Chạy Bộ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all duration-200 hover:shadow-md">
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-4">
              <img 
                alt="Quần Short Chạy Bộ 2 Lớp Chống Cọ Xát" 
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VV2bF4FydgIH77_eQO8SRxJrpaPULzjQngEL8icY-AjclpFCrVXhddqWc9Od2-sCnJ1tV40l6YPvx7QXGwzZHCTel2zz4bDAhU5mLUqmQI2I7k-MZ5-dOpyFl6pK879V73zDdCl4-xgdJ7IdE1PFZFw3PK8SQ6UVBvSIgGesw1ZvXzxRTqod-QuKlGqpKtCLFQgkRkWC0MYWzG9NOMNAzVK50SjBzYlI8Q540tKL2pAxN8BbENukN50IY"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-200 text-gray-900 text-xs font-semibold shadow-sm border border-gray-300">
                  <LinkIcon size={14} className="text-blue-600" />
                  87% Mua cùng giày Marathon
                </span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm">
                <Heart size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500">Có ngăn đựng điện thoại rung</span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  Quần Short Chạy Bộ 2 Lớp Chống Cọ Xát
                </h3>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-gray-900">290.000 đ</span>
                  <span className="text-sm text-gray-500">Size: L</span>
                </div>
                <button className="w-full py-2 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.99]">
                  <ShoppingBag size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Footer Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex items-start gap-4 mt-2">
        <div className="p-2 rounded-lg bg-white text-blue-600 flex-shrink-0 shadow-sm border border-blue-50">
          <Info size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-gray-900">Tại sao bạn thấy danh sách gợi ý này?</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hệ thống sử dụng mô hình mạng nơ-ron học sâu <strong className="text-gray-900 font-medium">NeuMF (Neural Matrix Factorization)</strong> kết hợp dữ liệu ẩn danh từ hành vi xem 15 sản phẩm và 8 đơn hàng bạn đã mua trước đây để tối ưu danh mục phù hợp. Toàn bộ tính toán được bảo mật nội bộ và cam kết tuyệt đối không chia sẻ dữ liệu nhận dạng ra bên ngoài.
          </p>
        </div>
      </div>
    </div>
  );
}
