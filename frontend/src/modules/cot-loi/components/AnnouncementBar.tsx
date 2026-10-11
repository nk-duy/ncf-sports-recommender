'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const messages = [
  { text: '🚚 Miễn phí giao hàng cho đơn từ 499.000đ', link: '/san-pham' },
  { text: '🔄 Đổi trả miễn phí trong 30 ngày', link: '/chinh-sach' },
  { text: '🎁 Nhập KADY10 — Giảm 10% cho đơn hàng đầu tiên', link: '/khuyen-mai' },
  { text: '📞 Hotline hỗ trợ 24/7: 1900 6868', link: '/lien-he' },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (dismissed) setVisible(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-blue-700 text-white text-xs font-semibold relative overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-9 flex items-center justify-center relative">
        {/* Sliding messages */}
        <div className="overflow-hidden h-full flex items-center flex-1 justify-center">
          {messages.map((msg, i) => (
            <Link
              key={i}
              href={msg.link}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 hover:text-blue-200
                ${i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
              {msg.text}
            </Link>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="absolute right-10 flex items-center gap-1">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setVisible(false);
            sessionStorage.setItem('announcement_dismissed', '1');
          }}
          className="absolute right-3 text-white/70 hover:text-white transition p-1"
          aria-label="Đóng thông báo"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
