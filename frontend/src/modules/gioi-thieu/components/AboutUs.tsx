'use client';

import React from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Award
} from 'lucide-react';

export default function AboutUs() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  const brandPartners = [
    'NIKE', 'ADIDAS', 'PUMA', 'YONEX', 'MIZUNO', 'UNDER ARMOUR', 'ASICS', 'LINING'
  ];

  const coreValues = [
    {
      icon: ShieldCheck,
      title: '100% Chính Hãng & Minh Bạch',
      desc: 'Toàn bộ giày, vợt, quần áo và phụ kiện đều có nguồn gốc rõ ràng từ các thương hiệu hàng đầu. Cam kết hoàn tiền gấp 10 lần nếu phát hiện hàng giả.',
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      icon: RefreshCw,
      title: 'Đổi Trả Tận Nhà 30 Ngày',
      desc: 'Mua đồ thể thao quan trọng nhất là vừa vặn. Khách thử không vừa size, shipper sẽ mang size mới tới tận nơi đổi cho bạn, không cần mất công ra bưu cục.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      icon: PackageCheck,
      title: 'Đồng Kiểm Khi Nhận Hàng',
      desc: 'Bạn luôn được quyền mở hộp kiểm tra đúng mẫu, đúng size và kiểm tra độ hoàn thiện trước khi thanh toán tiền cho nhân viên giao hàng.',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      icon: Truck,
      title: 'Giao Nhanh 24 - 48H Toàn Quốc',
      desc: 'Đơn hàng được đóng hộp chống sốc 3 lớp cẩn thận. Miễn phí vận chuyển cho mọi đơn hàng từ 499.000đ tới tất cả 63 tỉnh thành.',
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  const sportCategories = [
    { name: 'Cầu lông', desc: 'Vợt, giày chống lật cổ chân, cước & túi chuyên dụng', path: '/san-pham?sport_type=Cầu lông' },
    { name: 'Pickleball', desc: 'Vợt carbon T700, bóng USAPA, giày bám sân & balo', path: '/san-pham?sport_type=Pickleball' },
    { name: 'Chạy bộ (Running)', desc: 'Giày đệm êm, quần áo thoáng khí, đai chạy & tất nén', path: '/san-pham?sport_type=Chạy bộ' },
    { name: 'Bóng đá & Bóng chuyền', desc: 'Giày sân cỏ nhân tạo, phụ kiện bảo hộ đầu gối, găng tay', path: '/san-pham?sport_type=Bóng chuyền' },
  ];

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50/80 border-b border-gray-100 py-2">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section: Gọn gàng & Đúng trọng tâm */}
      <section className="relative bg-slate-900 text-white py-16 lg:py-20 overflow-hidden">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles size={14} className="text-blue-400" />
              Cửa Hàng Thể Thao KADY SPORT
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Đồng hành cùng đam mê thể thao của bạn
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              KADY được thành lập bởi những người yêu thể thao thực thụ. Chúng tôi hiểu rằng một đôi giày vừa vặn hay một cây vợt đúng tầm tay sẽ tạo nên sự khác biệt lớn trong từng pha bóng và từng bước chạy.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link 
                href="/san-pham" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
              >
                <ShoppingBag size={18} />
                Xem sản phẩm ngay
              </Link>
              <a 
                href="https://zalo.me/0988888888" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition"
              >
                <MessageCircle size={18} className="text-blue-400" />
                Chat Zalo tư vấn size
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Thông số thực tế */}
      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Chính hãng có bảo hành</div>
          </div>
          <div className="text-center border-l border-gray-100">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">30 Ngày</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Đổi trả tận nhà miễn phí</div>
          </div>
          <div className="text-center border-l border-gray-100">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">63 Tỉnh</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Giao hàng & đồng kiểm</div>
          </div>
          <div className="text-center border-l border-gray-100">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">4.9 / 5 ⭐</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Mức độ hài lòng</div>
          </div>
        </div>
      </section>

      {/* Cam kết thực tế của KADY */}
      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Vì sao chọn KADY?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">
            Trải nghiệm mua sắm an tâm & tiện lợi
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Không chỉ bán sản phẩm, chúng tôi tập trung giải quyết đúng những nỗi lo của bạn khi mua đồ thể thao online.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${val.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Các môn thể thao KADY tập trung */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Danh mục trọng tâm</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Trang bị chuyên sâu từng môn</h2>
            </div>
            <Link 
              href="/san-pham" 
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem toàn bộ sản phẩm <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sportCategories.map((cat, idx) => (
              <Link 
                key={idx} 
                href={cat.path}
                className="bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Thương hiệu phân phối */}
      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Sản phẩm chính hãng từ các thương hiệu hàng đầu thế giới
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {brandPartners.map((brand, i) => (
            <span 
              key={i} 
              className="font-black text-gray-400 tracking-wider text-sm sm:text-base hover:text-gray-900 transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Thông tin liên hệ & Trụ sở thực tế */}
      <section className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pb-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Thông tin liên hệ</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 mb-4">
                KADY Sport Việt Nam
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Bạn cần hỗ trợ chọn size, tư vấn chọn vợt hoặc cần kiểm tra tình trạng đơn hàng? Đội ngũ CSKH KADY luôn sẵn sàng giải đáp nhanh chóng.
              </p>

              <div className="space-y-3.5 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Trụ sở chính: 123 Đường Thể Thao, Quận 7, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-emerald-400 shrink-0" />
                  <span>Hotline hỗ trợ: <strong className="text-white">1900 6868</strong> (08:00 - 22:00)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-400 shrink-0" />
                  <span>Email: <a href="mailto:support@kady.vn" className="text-blue-300 hover:underline">support@kady.vn</a></span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-400 shrink-0" />
                  <span>Hoạt động: Tất cả các ngày trong tuần (kể cả Thứ 7 & CN)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Tư vấn trực tuyến đang hoạt động
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Bạn cần tư vấn chọn đồ vừa vặn?</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
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
    </div>
  );
}
