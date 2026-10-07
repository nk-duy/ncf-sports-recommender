'use client';

import React from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { Target, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function AboutUs() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-8 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Câu chuyện của <span className="text-blue-600">KADY</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chúng tôi tin rằng thể thao không chỉ là rèn luyện sức khỏe, mà còn là phong cách sống, là niềm đam mê bất tận. Sứ mệnh của chúng tôi là mang đến những sản phẩm thể thao chất lượng cao nhất.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Khách hàng', value: '100K+' },
            { label: 'Sản phẩm', value: '5,000+' },
            { label: 'Thương hiệu', value: '50+' },
            { label: 'Cửa hàng', value: '12' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className="text-4xl font-black text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Giá Trị Cốt Lõi</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Những nguyên tắc định hướng cho mọi hoạt động và quyết định của chúng tôi.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: 'Chất lượng hàng đầu', desc: 'Cam kết 100% sản phẩm chính hãng.' },
            { icon: Heart, title: 'Tận tâm phục vụ', desc: 'Khách hàng là trung tâm, hỗ trợ nhiệt tình.' },
            { icon: Zap, title: 'Đổi mới liên tục', desc: 'Luôn cập nhật xu hướng thể thao mới nhất.' },
            { icon: Target, title: 'Trách nhiệm', desc: 'Đóng góp vào phong trào thể thao cộng đồng.' },
          ].map((value, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-blue-600">
                <value.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
