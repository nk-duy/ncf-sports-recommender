'use client';

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

export type Language = 'vi' | 'en';

export interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

export const dictionary: Translations = {
  // Navigation
  'nav.home': { vi: 'Trang chủ', en: 'Home' },
  'nav.products': { vi: 'Sản phẩm', en: 'Products' },
  'nav.sale': { vi: 'SALE', en: 'SALE' },
  'nav.track_order': { vi: 'Tra cứu đơn', en: 'Track Order' },
  'nav.about': { vi: 'Giới thiệu', en: 'About Us' },
  'nav.contact': { vi: 'Liên hệ', en: 'Contact' },

  // Header Elements
  'header.search_placeholder': {
    vi: 'Tìm kiếm giày chạy, vợt pickleball, áo thể thao...',
    en: 'Search running shoes, pickleball paddles, apparel...'
  },
  'header.login': { vi: 'Đăng Nhập', en: 'Login' },
  'header.cart': { vi: 'Giỏ hàng', en: 'Cart' },
  'header.admin': { vi: 'Trang quản trị', en: 'Admin Portal' },
  'header.my_account': { vi: 'Tài khoản của tôi', en: 'My Account' },
  'header.logout': { vi: 'Đăng xuất', en: 'Logout' },
  'header.featured_rec': { vi: 'Gợi ý nổi bật', en: 'Featured Pick' },
  'header.featured_title': {
    vi: 'Đồ Thể Thao Phù Hợp Nhất Với Bạn',
    en: 'Best Sports Gear For You'
  },
  'header.featured_desc': {
    vi: 'Hệ thống phân tích nhu cầu và dáng vóc để đề xuất sản phẩm tối ưu hiệu suất.',
    en: 'NCF AI analyzes your athletic needs and sizing for peak performance.'
  },
  'header.view_for_you': { vi: 'Xem gợi ý dành riêng', en: 'View personalized gear' },
  'header.view_all_products': { vi: 'XEM TẤT CẢ SẢN PHẨM', en: 'VIEW ALL PRODUCTS' },
  'header.authentic_badge': {
    vi: 'Hơn 570+ sản phẩm thể thao chính hãng sẵn sàng giao hỏa tốc',
    en: 'Over 570+ authentic sports products ready for express delivery'
  },
  'header.coupon_note': {
    vi: '🎁 Mã KADY10 giảm 10% đơn đầu',
    en: '🎁 Code KADY10 for 10% off 1st order'
  },

  // Sports & Disciplines
  'sport.running': { vi: 'Chạy bộ', en: 'Running' },
  'sport.football': { vi: 'Đá bóng', en: 'Football' },
  'sport.badminton': { vi: 'Cầu lông', en: 'Badminton' },
  'sport.pickleball': { vi: 'Pickleball', en: 'Pickleball' },
  'sport.volleyball': { vi: 'Bóng chuyền', en: 'Volleyball' },
  'sport.gym': { vi: 'Gym & Fitness', en: 'Gym & Fitness' },
  'sport.outdoor': { vi: 'Dã ngoại', en: 'Outdoor & Camping' },
  'sport.accessories': { vi: 'Phụ kiện', en: 'Accessories' },

  // Announcements
  'announcement.freeship': {
    vi: 'Miễn phí giao hàng cho đơn từ 500.000đ',
    en: 'Free nationwide delivery on orders from 500,000đ'
  },
  'announcement.return': {
    vi: 'Đổi trả miễn phí trong 30 ngày',
    en: 'Free 30-day hassle-free returns'
  },
  'announcement.voucher': {
    vi: 'Nhập KADY10 — Giảm 10% cho đơn hàng đầu tiên',
    en: 'Enter KADY10 — 10% off your first order'
  },
  'announcement.hotline': {
    vi: 'Hotline hỗ trợ 24/7: 1900 6868',
    en: '24/7 Hotline support: 1900 6868'
  },

  // Footer
  'footer.brand_desc': {
    vi: 'Hệ thống phân phối đồ thể thao, giày dép và phụ kiện tập luyện hàng đầu Việt Nam. Cam kết chất lượng chính hãng 100%.',
    en: 'Leading sports gear, footwear, and fitness distributor in Vietnam. 100% authentic quality guaranteed.'
  },
  'footer.policies': { vi: 'Chính Sách', en: 'Policies' },
  'footer.categories': { vi: 'Danh Mục', en: 'Categories' },
  'footer.contact': { vi: 'Liên Hệ', en: 'Contact Us' },
  'footer.shipping_policy': { vi: 'Chính sách giao hàng', en: 'Shipping Policy' },
  'footer.return_policy': { vi: 'Đổi trả trong 30 ngày', en: '30-Day Return Policy' },
  'footer.size_guide': { vi: 'Hướng dẫn chọn size', en: 'Size Guide' },
  'footer.warranty_policy': { vi: 'Chính sách bảo hành', en: 'Warranty Policy' },
  'footer.terms': { vi: 'Điều khoản sử dụng', en: 'Terms of Use' },
  'footer.privacy': { vi: 'Chính sách bảo mật', en: 'Privacy Policy' },
  'footer.special_sale': { vi: 'Sale đặc biệt', en: 'Flash Deals' },
  'footer.address': {
    vi: '123 Đường Thể Thao, Quận 7, TP. Hồ Chí Minh',
    en: '123 Sports Blvd, District 7, Ho Chi Minh City'
  },
  'footer.copyright': {
    vi: '© 2026 KADY Sports Store. Bản quyền thuộc về KADY.',
    en: '© 2026 KADY Sports Store. All rights reserved.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
  translateSport: (sport: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
  translateSport: (sport: string) => sport,
});

const langListeners = new Set<() => void>();
let memoryLang: Language = 'vi';

function subscribeLanguage(callback: () => void) {
  langListeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'kady_lang') callback();
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    langListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getClientLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'vi';
  try {
    const savedLang = localStorage.getItem('kady_lang');
    if (savedLang === 'vi' || savedLang === 'en') {
      memoryLang = savedLang;
      return savedLang;
    }
  } catch {
    // fallback to memoryLang when storage is inaccessible
  }
  return memoryLang;
}

function getServerLanguageSnapshot(): Language {
  return 'vi';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getClientLanguageSnapshot,
    getServerLanguageSnapshot
  );

  const setLanguage = (lang: Language) => {
    memoryLang = lang;
    try {
      localStorage.setItem('kady_lang', lang);
    } catch {
      // ignore storage errors
    }
    langListeners.forEach((listener) => listener());
  };

  const toggleLanguage = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const entry = dictionary[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText !== undefined ? defaultText : key;
  };

  const translateSport = (sport: string): string => {
    if (language === 'vi') return sport === 'Đa dụng' ? 'Gym & Fitness' : sport;
    const s = (sport || '').toLowerCase();
    if (s.includes('chạy')) return 'Running';
    if (s.includes('bóng đá') || s.includes('đá bóng')) return 'Football';
    if (s.includes('cầu lông')) return 'Badminton';
    if (s.includes('pickleball')) return 'Pickleball';
    if (s.includes('bóng chuyền')) return 'Volleyball';
    if (s.includes('đa dụng') || s.includes('gym')) return 'Gym & Fitness';
    if (s.includes('dã ngoại')) return 'Outdoor';
    if (s.includes('phụ kiện')) return 'Accessories';
    return sport;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translateSport }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
