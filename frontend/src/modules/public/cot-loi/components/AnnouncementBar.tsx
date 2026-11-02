'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Gift, PhoneCall, X } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';

const emptySubscribe = () => () => {};

function getStoredDismissed(): boolean {
  try {
    return sessionStorage.getItem('announcement_dismissed') === '1';
  } catch {
    return false;
  }
}

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissedByClick, setDismissedByClick] = useState(false);
  const storedDismissed = useSyncExternalStore(
    emptySubscribe,
    getStoredDismissed,
    () => false
  );
  const { t } = useLanguage();

  const messages = [
    {
      icon: Truck,
      text: t('announcement.freeship', 'Miễn phí giao hàng cho đơn từ 500.000đ'),
      link: '/san-pham',
    },
    {
      icon: RotateCcw,
      text: t('announcement.return', 'Đổi trả miễn phí trong 30 ngày'),
      link: '/chinh-sach',
    },
    {
      icon: Gift,
      text: t('announcement.voucher', 'Nhập KADY10 — Giảm 10% cho đơn hàng đầu tiên'),
      link: '/khuyen-mai',
    },
    {
      icon: PhoneCall,
      text: t('announcement.hotline', 'Hotline hỗ trợ 24/7: 1900 6868'),
      link: 'tel:19006868',
    },
  ];

  const messageCount = messages.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messageCount);
    }, 3500);
    return () => clearInterval(timer);
  }, [messageCount]);

  if (dismissedByClick || storedDismissed) return null;

  const activeMsg = messages[current];
  const Icon = activeMsg.icon;

  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white text-xs font-medium relative overflow-hidden shadow-xs">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-9 flex items-center justify-center relative">
        <div className="overflow-hidden h-full flex items-center flex-1 justify-center relative">
          <Link
            key={current}
            href={activeMsg.link}
            className="flex items-center justify-center gap-2 hover:text-blue-100 transition-opacity animate-in fade-in duration-300 select-none"
          >
            <Icon size={14} className="shrink-0 text-blue-200" />
            <span className="font-semibold tracking-wide truncate max-w-[70vw] sm:max-w-none">
              {activeMsg.text}
            </span>
          </Link>
        </div>

        <div className="absolute right-10 hidden sm:flex items-center gap-1.5">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-3.5' : 'bg-white/40 w-1.5 hover:bg-white/70'
              }`}
              aria-label={`Chuyển đến thông báo ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setDismissedByClick(true);
            try {
              sessionStorage.setItem('announcement_dismissed', '1');
            } catch {
              // Ignore storage errors
            }
          }}
          className="absolute right-3 text-white/70 hover:text-white transition p-1 hover:bg-white/10 rounded-full"
          aria-label="Đóng thông báo"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
