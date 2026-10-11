'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import Link from 'next/link';
import { 
  Target, 
  Heart, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Phone, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Headphones,
  Check
} from 'lucide-react';

const DEFAULT_STORES = {
  hanoi: [
    { name: 'KADY Cầu Giấy', address: '123 Đường Cầu Giấy, Q. Cầu Giấy, Hà Nội', phone: '024 3888 9999', hours: '08:00 - 22:00' },
    { name: 'KADY Ba Đình', address: '45 Đường Kim Mã, Q. Ba Đình, Hà Nội', phone: '024 3777 6666', hours: '08:30 - 21:30' },
    { name: 'KADY Đống Đa', address: '88 Đường Chùa Bộc, Q. Đống Đa, Hà Nội', phone: '024 3555 4444', hours: '08:00 - 22:00' },
  ],
  hcm: [
    { name: 'KADY Quận 1', address: '254 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh', phone: '028 3999 1111', hours: '08:00 - 22:00' },
    { name: 'KADY Tân Bình', address: '112 Đường Lê Văn Sỹ, Q. Tân Bình, TP. Hồ Chí Minh', phone: '028 3888 2222', hours: '08:30 - 21:30' },
    { name: 'KADY Bình Thạnh', address: '69 Đường Điện Biên Phủ, Q. Bình Thạnh, TP. HCM', phone: '028 3777 3333', hours: '08:00 - 22:00' },
  ],
  danang: [
    { name: 'KADY Hải Châu', address: '56 Đường Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng', phone: '0236 3666 888', hours: '08:00 - 21:30' },
    { name: 'KADY Thanh Khê', address: '142 Đường Hùng Vương, Q. Thanh Khê, Đà Nẵng', phone: '0236 3555 777', hours: '08:30 - 21:30' },
  ]
};

export default function AboutUs() {
  const [activeCity, setActiveCity] = useState<'hanoi' | 'hcm' | 'danang'>('hanoi');
  const [storesData, setStoresData] = useState<Record<string, any[]>>(DEFAULT_STORES);
  const [statsData, setStatsData] = useState({
    total_users: '100K+',
    total_products: '5,000+',
    total_brands: '50+',
    total_stores: '12',
    satisfaction_rate: '99.4%'
  });

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Fetch public stats from backend
    fetch(`${API_URL}/stores/public-stats`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStatsData({
            total_users: data.total_users ? `${(data.total_users / 1000).toFixed(0)}K+` : '100K+',
            total_products: data.total_products ? `${data.total_products.toLocaleString()}+` : '5,000+',
            total_brands: data.total_brands ? `${data.total_brands}+` : '50+',
            total_stores: data.total_stores ? `${data.total_stores}` : '12',
            satisfaction_rate: data.satisfaction_rate || '99.4%'
          });
        }
      })
      .catch(() => {});

    // Fetch stores from backend
    fetch(`${API_URL}/stores`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const grouped: Record<string, any[]> = { hanoi: [], hcm: [], danang: [] };
          data.forEach(s => {
            const city = s.city || 'hanoi';
            if (!grouped[city]) grouped[city] = [];
            grouped[city].push(s);
          });
          setStoresData(prev => ({
            ...prev,
            ...grouped
          }));
        }
      })
      .catch(() => {});
  }, []);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  const timelineEvents = [
    {
      year: '2018',
      tag: 'Khởi đầu',
      title: 'Thành lập thương hiệu KADY Sports',
      description: 'Khai trương showroom đầu tiên tại Hà Nội với sứ mệnh mang đến trang phục và dụng cụ thể thao chính hãng, cao cấp cho người Việt.'
    },
    {
      year: '2020',
      tag: 'Mở rộng',
      title: 'Phát triển chuỗi cửa hàng toàn quốc',
      description: 'Mở rộng showroom tới TP. Hồ Chí Minh và Đà Nẵng, đồng thời ra mắt nền tảng thương mại điện tử phục vụ khách hàng trên khắp 63 tỉnh thành.'
    },
    {
      year: '2022',
      tag: 'Đối tác chiến lược',
      title: 'Hợp tác các thương hiệu thể thao toàn cầu',
      description: 'Trở thành đối tác phân phối chính thức của Nike, Adidas, Puma, Yonex, Mizuno; hoàn thiện quy trình chăm sóc và bảo hành chuẩn quốc tế.'
    },
    {
      year: '2024',
      tag: 'Ứng dụng AI',
      title: 'Tích hợp hệ thống gợi ý thông minh NCF',
      description: 'Ứng dụng mô hình AI Deep Learning (Neural Collaborative Filtering) giúp khách hàng tìm kiếm đúng sản phẩm vừa vặn với vóc dáng và môn thể thao yêu thích.'
    },
    {
      year: '2026',
      tag: 'Vươn xa',
      title: 'Hệ sinh thái thể thao thông minh',
      description: 'Đạt mốc hơn 100,000 khách hàng tin dùng cùng hệ thống 12 showroom hiện đại, tiên phong nâng tầm phong cách sống năng động.'
    }
  ];

  const teamMembers = [
    {
      name: 'Nguyễn Văn An',
      role: 'Đồng sáng lập & CEO',
      bio: 'Cựu vận động viên marathon, 10 năm kinh nghiệm trong ngành bán lẻ dụng cụ thể thao chuyên nghiệp.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Trần Thị Mai',
      role: 'Giám đốc Sản phẩm & Thiết kế',
      bio: 'Chuyên gia thiết kế trang phục thể thao công năng cao, từng làm việc cho các thương hiệu quốc tế.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Phạm Minh Đức',
      role: 'Giám đốc Công nghệ & AI',
      bio: 'Chuyên gia khoa học dữ liệu, người chịu trách nhiệm phát triển hệ thống gợi ý sản phẩm thể thao NCF.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Lê Hoàng Nam',
      role: 'Trưởng ban Tư vấn Fitting & Chăm sóc',
      bio: 'HLV Thể hình & Điền kinh chứng chỉ quốc tế, tận tâm tư vấn đúng size & form dáng cho mọi vận động viên.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const testimonials = [
    {
      quote: "Sản phẩm của KADY có độ co dãn tuyệt vời, thấm hút mồ hôi cực tốt. Đặc biệt tính năng gợi ý AI chọn đúng mẫu giày chạy bộ vừa vặn nhất với dáng chân mình!",
      name: "Hoàng Tấn Đạt",
      title: "Vận động viên Marathon phong trào",
      rating: 5
    },
    {
      quote: "Hệ thống cửa hàng hiện đại, nhân viên am hiểu kiến thức thể thao chuyên sâu chứ không chỉ bán hàng đơn thuần. Rất đáng tin tưởng!",
      name: "Nguyễn Thị Phương",
      title: "Huấn luyện viên Yoga & Pilates",
      rating: 5
    },
    {
      quote: "Đã mua ở KADY 3 năm nay, hàng chính hãng 100%, bảo hành uy tín. Dịch vụ giao hàng hỏa tốc trong 2h tại nội thành cực kỳ tiện lợi.",
      name: "Lê Minh Quốc",
      title: "Cầu thủ CLB Bán Chuyên Hà Nội",
      rating: 5
    }
  ];

  const brandPartners = [
    'NIKE', 'ADIDAS', 'PUMA', 'YONEX', 'MIZUNO', 'UNDER ARMOUR', 'ASICS', 'LINING'
  ];

  return (
    <div className="bg-white min-h-screen pb-20 overflow-hidden">
      {/* Breadcrumb Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} className="text-blue-400" />
                Thương hiệu thể thao hàng đầu Việt Nam
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Nâng Tầm Phong Cách & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Hiệu Suất Thể Thao</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Tại KADY, chúng tôi tin rằng thể thao không chỉ là rèn luyện thể chất, mà là tinh thần chinh phục, phong cách sống hiện đại và niềm đam mê không giới hạn.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/danh-muc" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag size={18} />
                  Khám phá sản phẩm
                </Link>
                <a 
                  href="#he-thong-cua-hang" 
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/15 backdrop-blur-md transition-all"
                >
                  <MapPin size={18} className="text-blue-400" />
                  Tìm cửa hàng gần nhất
                </a>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
                {[
                  { title: '100% Chính Hãng', desc: 'Cam kết nguồn gốc' },
                  { title: 'Đổi Trả 30 Ngày', desc: 'Lỗi 1 đổi 1 miễn phí' },
                  { title: 'Tư Vấn AI (NCF)', desc: 'Gợi ý chuẩn size & form' },
                  { title: 'Giao Hàng 2H', desc: 'Nội thành nhanh chóng' },
                ].map((item, idx) => (
                  <div key={idx} className="text-left">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold text-sm mb-0.5">
                      <CheckCircle2 size={15} />
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" 
                    alt="KADY Sports Showroom" 
                    className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-600 rounded-lg text-white">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold">100,000+ Khách hàng tin dùng</div>
                        <div className="text-xs text-slate-300">Đồng hành cùng thể thao Việt Nam từ năm 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {[
            { label: 'Khách Hàng Thân Thiết', value: statsData.total_users, icon: Users, color: 'text-blue-600' },
            { label: 'Sản Phẩm Thể Thao', value: statsData.total_products, icon: ShoppingBag, color: 'text-emerald-600' },
            { label: 'Thương Hiệu Toàn Cầu', value: statsData.total_brands, icon: Award, color: 'text-purple-600' },
            { label: 'Showroom Chi Nhánh', value: statsData.total_stores, icon: Building2, color: 'text-amber-600' },
            { label: 'Tỷ Lệ Hài Lòng', value: statsData.satisfaction_rate, icon: Star, color: 'text-rose-600' },
          ].map((stat, index) => (

            <div key={index} className="text-center pt-4 md:pt-0 first:pt-0">
              <div className={`inline-flex p-3 rounded-xl bg-gray-50 ${stat.color} mb-3`}>
                <stat.icon size={26} />
              </div>
              <div className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-8 lg:p-10 border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-600">
              <Target size={160} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Target size={24} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Sứ Mệnh Của Chúng Tôi</h2>
              <p className="text-gray-600 leading-relaxed">
                KADY sinh ra với mục tiêu cung cấp giải pháp trang phục và trang thiết bị thể thao chất lượng cao nhất cho cộng đồng Việt Nam. Chúng tôi liên tục ứng dụng các công nghệ mới (như thuật toán NCF) để giúp mỗi cá nhân dễ dàng lựa chọn sản phẩm vừa vặn, tối ưu hiệu suất tập luyện và phòng tránh chấn thương.
              </p>
              <ul className="space-y-2 pt-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-blue-600" />
                  Cung cấp 100% đồ thể thao đạt chuẩn chất lượng quốc tế
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-blue-600" />
                  Tư vấn chuyên sâu theo từng môn thể thao cụ thể
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-blue-600" />
                  Đồng hành cùng sự phát triển của thể thao cộng đồng
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 lg:p-10 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400">
              <Sparkles size={160} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Tầm Nhìn Đến 2030</h2>
              <p className="text-slate-300 leading-relaxed">
                Trở thành hệ sinh thái bán lẻ trang thiết bị thể thao thông minh hàng đầu Đông Nam Á. Nơi công nghệ AI hòa quyện cùng tinh thần thể thao, mang lại trải nghiệm cá nhân hóa đỉnh cao cho hàng triệu người yêu vận động.
              </p>
              <ul className="space-y-2 pt-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Hệ thống 50+ Showroom trải dài khắp các tỉnh thành
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Nâng cấp AI Recommender dự đoán xu hướng & tư vấn 3D
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-cyan-400" />
                  Phát triển các dòng trang phục thể thao bền vững (Eco-Friendly)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Định Hướng Hoạt Động
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mt-3">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 mt-3">Những nguyên tắc kiên định giúp KADY nhận được niềm tin yêu từ hàng trăm nghìn khách hàng.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Chất Lượng Tuyệt Đối', 
                desc: 'Cam kết 100% sản phẩm chính hãng có nguồn gốc rõ ràng, đã qua kiểm định khắt khe trước khi tới tay người dùng.',
                color: 'bg-blue-500' 
              },
              { 
                icon: Heart, 
                title: 'Tận Tâm Khách Hàng', 
                desc: 'Đặt trải nghiệm của người mua lên hàng đầu. Đội ngũ tư vấn tận tình, sẵn sàng hỗ trợ 24/7 mọi thắc mắc.',
                color: 'bg-rose-500' 
              },
              { 
                icon: Zap, 
                title: 'Công Nghệ Tiên Phong', 
                desc: 'Ứng dụng thuật toán AI gợi ý thông minh NCF giúp người dùng chọn đúng sản phẩm theo vóc dáng & môn thể thao.',
                color: 'bg-amber-500' 
              },
              { 
                icon: Target, 
                title: 'Trách Nhiệm Cộng Đồng', 
                desc: 'Đồng hành tài trợ cho các giải chạy phong trào, giải bóng đá sinh viên và phát động phong trào sống khỏe.',
                color: 'bg-emerald-500' 
              },
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${value.color} rounded-2xl shadow-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Cột Mốc Lịch Sử
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mt-3">Hành Trình Phát Triển</h2>
          <p className="text-gray-600 mt-3">Tóm tắt các chặng đường phát triển ấn tượng của KADY từ ngày đầu thành lập.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-200 -translate-x-1/2"></div>

          <div className="space-y-12">
            {timelineEvents.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Circle Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-blue-600 shadow-md items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>

                  {/* Content Box */}
                  <div className="w-full md:w-[45%]">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-blue-600">{item.year}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Store Locator Section */}
      <div id="he-thong-cua-hang" className="bg-slate-900 text-white py-20">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800">
              Trải Nghiệm Thực Tế
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mt-3">Hệ Thống Showroom Cửa Hàng</h2>
            <p className="text-slate-400 mt-3">Đến thăm showroom gần nhất để được đo size chân chuẩn và trải nghiệm trực tiếp sản phẩm.</p>
            
            {/* City Tabs */}
            <div className="flex justify-center gap-3 mt-8">
              {[
                { id: 'hanoi', label: 'Hà Nội' },
                { id: 'hcm', label: 'TP. Hồ Chí Minh' },
                { id: 'danang', label: 'Đà Nẵng' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCity(tab.id as any)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCity === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {(storesData[activeCity] || []).map((store, idx) => (

              <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 size={18} className="text-blue-400" />
                      {store.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Mở cửa
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <span className="font-mono text-blue-300">{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock size={16} className="text-slate-400 shrink-0" />
                      <span>Giờ hoạt động: {store.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Xem vị trí trên Google Maps
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership & Experts Team */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Con Người KADY
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mt-3">Đội Ngũ Điều Hành & Chuyên Gia</h2>
          <p className="text-gray-600 mt-3">Những con người nhiệt huyết đứng đằng sau sự phát triển vượt bậc của KADY.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">{member.role}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Khách Hàng Nói Gì
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mt-3">Niềm Tin Từ Vận Động Viên</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-6">"{t.quote}"</p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Partners */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Đối tác phân phối chính hãng
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {brandPartners.map((brand, idx) => (
            <span key={idx} className="text-xl font-black tracking-widest text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Sẵn Sàng Chinh Phục Mọi Thử Thách Thể Thao?
            </h2>
            <p className="text-blue-100 text-lg">
              Trải nghiệm ngay ứng dụng AI gợi ý sản phẩm phù hợp với nhu cầu và phong cách của riêng bạn.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link 
                href="/danh-muc"
                className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
              >
                Khám phá bộ sưu tập ngay
              </Link>
              <Link
                href="/khuyen-mai"
                className="bg-blue-800/60 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition-all"
              >
                Săn Voucher Ưu Đãi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

