'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface BrandItem {
  name: string;
  logo: string;
}

const BRAND_PRESETS: Record<string, string> = {
  Nike: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  Adidas: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  Yonex: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Yonex_logo.svg/320px-Yonex_logo.svg.png',
  Wilson: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Wilson-Sporting-Goods-Logo.svg/320px-Wilson-Sporting-Goods-Logo.svg.png',
  Puma: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Puma_logo.svg/320px-Puma_logo.svg.png',
  'New Balance': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/320px-New_Balance_logo.svg.png',
  'Under Armour': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Under_armour_logo.svg/320px-under_armour_logo.svg.png',
  'Li-Ning': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Li-Ning_Logo.svg/320px-Li-Ning_Logo.svg.png',
  Lining: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Li-Ning_Logo.svg/320px-Li-Ning_Logo.svg.png',
  Asics: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Asics_Logo.svg/320px-Asics_Logo.svg.png',
  Mizuno: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Mizuno_logo.svg/320px-Mizuno_logo.svg.png',
  Joola: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/JOOLA_Logo_2020.svg/320px-JOOLA_Logo_2020.svg.png',
  Naturehike: 'https://seeklogo.com/images/N/naturehike-logo-5D1C4C7410-seeklogo.com.png',
  Babolat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Babolat_Logo.svg/320px-Babolat_Logo.svg.png',
  Head: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/HEAD_Logo.svg/320px-HEAD_Logo.svg.png',
  Decathlon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Decathlon_Logo.svg/320px-Decathlon_Logo.svg.png',
  Speedo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Speedo_logo.svg/320px-Speedo_logo.svg.png',
  Mikasa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mikasa_Sports_logo.svg/320px-Mikasa_Sports_logo.svg.png',
  Molten: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Molten_Corporation_logo.svg/320px-Molten_Corporation_logo.svg.png',
  Columbia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Columbia_Sportswear_Company_Logo.svg/320px-Columbia_Sportswear_Company_Logo.svg.png',
};

const PRIORITY_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Yonex', 'Lining', 'Asics', 'Mizuno',
  'Under Armour', 'Wilson', 'Joola', 'Babolat', 'Decathlon',
  'New Balance', 'Mikasa', 'Molten', 'Columbia', 'Naturehike',
];

export default function BrandLogos() {
  const [brands, setBrands] = useState<BrandItem[]>([
    { name: 'Nike', logo: BRAND_PRESETS['Nike'] },
    { name: 'Adidas', logo: BRAND_PRESETS['Adidas'] },
    { name: 'Puma', logo: BRAND_PRESETS['Puma'] },
    { name: 'Yonex', logo: BRAND_PRESETS['Yonex'] },
    { name: 'Under Armour', logo: BRAND_PRESETS['Under Armour'] },
    { name: 'Lining', logo: BRAND_PRESETS['Lining'] },
    { name: 'Asics', logo: BRAND_PRESETS['Asics'] },
    { name: 'Mizuno', logo: BRAND_PRESETS['Mizuno'] },
    { name: 'Joola', logo: BRAND_PRESETS['Joola'] },
    { name: 'Wilson', logo: BRAND_PRESETS['Wilson'] },
    { name: 'Decathlon', logo: BRAND_PRESETS['Decathlon'] },
  ]);

  const [totalCount, setTotalCount] = useState<number>(168);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/products/brands')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: string[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTotalCount(data.length);

          const sorted = [...data].sort((a, b) => {
            const aPri = PRIORITY_BRANDS.indexOf(a);
            const bPri = PRIORITY_BRANDS.indexOf(b);
            if (aPri !== -1 && bPri !== -1) return aPri - bPri;
            if (aPri !== -1) return -1;
            if (bPri !== -1) return 1;
            return a.localeCompare(b);
          });

          const selected = sorted.slice(0, 42);
          const list: BrandItem[] = selected.map((b) => ({
            name: b,
            logo: BRAND_PRESETS[b] || '',
          }));
          setBrands(list);
        }
      })
      .catch((err) => console.warn('Using fallback brands:', err));
  }, []);

  const doubled = [...brands, ...brands];

  return (
    <section className="bg-white border-t border-slate-100 py-7 overflow-hidden relative group/section">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs font-black uppercase tracking-[3px] text-slate-500">
            Thương Hiệu Thể Thao Hàng Đầu
          </p>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
            Rê chuột để dừng lại
          </span>
        </div>

        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition group/link"
        >
          <span>Xem tất cả ({totalCount} hãng)</span>
          <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="relative overflow-hidden py-1">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div
          ref={marqueeRef}
          className="flex items-center gap-6 sm:gap-10 animate-marquee whitespace-nowrap py-1"
          style={{ width: 'max-content' }}
        >
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.name}-${i}`}
              href={`/san-pham?brand=${encodeURIComponent(brand.name)}`}
              title={`Xem tất cả sản phẩm của ${brand.name}`}
              className="group flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 shrink-0 cursor-pointer"
            >
              {brand.logo ? (
                <div className="h-7 max-w-[120px] flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-7 max-w-[110px] w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const span = document.createElement('span');
                        span.className =
                          'font-bold text-slate-700 text-xs sm:text-sm tracking-wider uppercase group-hover:text-blue-600';
                        span.innerText = brand.name;
                        parent.appendChild(span);
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="font-bold text-slate-700 text-xs sm:text-sm tracking-wide uppercase group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 130s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
