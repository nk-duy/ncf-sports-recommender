import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Grid */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 – Brand */}
          <div>
            <img src="/logo.png" alt="KADY Logo" className="h-12 w-auto object-contain mb-4 brightness-200" />
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Hệ thống phân phối đồ thể thao, giày dép và phụ kiện tập luyện hàng đầu Việt Nam. Cam kết chất lượng chính hãng 100%.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Col 2 – Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" />
              Chính Sách
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Chính sách giao hàng', href: '#' },
                { label: 'Đổi trả trong 30 ngày', href: '#' },
                { label: 'Chính sách bảo hành', href: '#' },
                { label: 'Điều khoản sử dụng', href: '#' },
                { label: 'Chính sách bảo mật', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" />
              Danh Mục
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Pickleball', href: '/san-pham?sport_type=Pickleball' },
                { label: 'Cầu lông', href: '/san-pham?sport_type=Cầu lông' },
                { label: 'Bóng chuyền', href: '/san-pham?sport_type=Bóng chuyền' },
                { label: 'Chạy bộ', href: '/san-pham?sport_type=Chạy bộ' },
                { label: 'Sale đặc biệt', href: '/khuyen-mai' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 – Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 inline-block" />
              Liên Hệ
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={15} className="shrink-0 text-blue-400 mt-0.5" />
                <span>123 Đường Thể Thao, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={15} className="shrink-0 text-blue-400" />
                <a href="tel:19006868" className="hover:text-white transition-colors">1900 6868</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={15} className="shrink-0 text-blue-400" />
                <a href="mailto:support@kady.vn" className="hover:text-white transition-colors">support@kady.vn</a>
              </li>
            </ul>

            {/* Hotline badge */}
            <div className="mt-5 bg-blue-600/20 border border-blue-600/30 rounded-xl p-4">
              <p className="text-xs text-blue-400 font-semibold mb-1">Hotline hỗ trợ 24/7</p>
              <p className="text-white font-black text-xl tracking-wide">1900 6868</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 KADY Vietnam. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/124px-PayPal.svg.png"
              alt="PayPal" className="h-5 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/72px-Mastercard-logo.svg.png"
              alt="Mastercard" className="h-5 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
              alt="Visa" className="h-5 opacity-50 hover:opacity-100 transition-opacity brightness-200" />
          </div>
        </div>
      </div>
    </footer>
  );
}
