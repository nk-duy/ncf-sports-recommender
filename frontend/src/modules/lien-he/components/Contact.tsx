'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      notifications.show({
        title: 'Thông tin chưa đầy đủ',
        message: 'Vui lòng điền các trường bắt buộc có dấu (*).',
        color: 'red',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      notifications.show({
        title: 'Email không hợp lệ',
        message: 'Vui lòng nhập đúng định dạng email (ví dụ: name@example.com).',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/contacts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gửi liên hệ thất bại");

      setFormData({ name: '', email: '', phone: '', message: '' });
      notifications.show({
        title: 'Gửi thành công!',
        message: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Có lỗi xảy ra',
        message: 'Không thể gửi liên hệ lúc này, vui lòng thử lại sau.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="text-center max-w-3xl mx-auto mt-12 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Liên hệ với <span className="text-blue-600">KADY</span>
          </h1>
          <p className="text-lg text-gray-600">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin liên hệ</h2>
            <div className="space-y-8 mb-10">
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

            <div className="pt-8 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaFacebookF size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-pink-600 hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-colors">
                  <FaTiktok size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-colors" title="Zalo">
                  <span className="font-bold text-sm">Zalo</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  placeholder="Nhập họ tên của bạn" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  placeholder="Nhập địa chỉ email" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  placeholder="Nhập số điện thoại" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung tin nhắn *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none" 
                  placeholder="Vui lòng để lại lời nhắn..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} /> Gửi liên hệ
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Google Maps Embed */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2 h-[450px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.89668351582!2d105.80376171540188!3d20.996775694247547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbd25a075e7%3A0xc48c037daea41e06!2zMTIzIMSQLiBOZ3V54buFbiBUcsOjaSwgVGhhbmggWHXDom4gVHJ1bmcsIFRoYW5oIFh1w6JuLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1683100582522!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1.25rem' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            {[
              { q: "Thời gian giao hàng mất bao lâu?", a: "Thông thường, thời gian giao hàng sẽ từ 2-4 ngày làm việc đối với khu vực nội thành, và 3-7 ngày làm việc đối với các tỉnh thành khác." },
              { q: "Tôi có thể đổi trả hàng không?", a: "Có. Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng, miễn là sản phẩm còn nguyên tem mác và chưa qua sử dụng." },
              { q: "Cửa hàng có chấp nhận thanh toán qua thẻ không?", a: "Có, chúng tôi chấp nhận thanh toán qua hầu hết các loại thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB) và qua cổng thanh toán VNPay." },
              { q: "Làm sao để tôi kiểm tra tình trạng đơn hàng?", a: "Bạn có thể đăng nhập vào tài khoản, vào mục 'Lịch sử mua hàng' để xem trạng thái đơn, hoặc liên hệ trực tiếp qua hotline/Zalo CSKH." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
