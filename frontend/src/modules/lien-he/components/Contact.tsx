'use client';

import React from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="text-center max-w-3xl mx-auto mt-12 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Liên hệ với <span className="text-blue-600">PRO SPORTS</span>
          </h1>
          <p className="text-lg text-gray-600">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin liên hệ</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Địa chỉ cửa hàng</h3>
                  <p className="text-gray-600">123 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mr-4">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Điện thoại</h3>
                  <p className="text-gray-600">1900 6868 (Bán hàng)</p>
                  <p className="text-gray-600">1900 6869 (CSKH)</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mr-4">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email hỗ trợ</h3>
                  <p className="text-gray-600">support@prosports.vn</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mr-4">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Giờ mở cửa</h3>
                  <p className="text-gray-600">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Nhập họ tên của bạn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Nhập địa chỉ email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" placeholder="Nhập số điện thoại" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung tin nhắn *</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" placeholder="Vui lòng để lại lời nhắn..."></textarea>
              </div>
              <button type="submit" className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
