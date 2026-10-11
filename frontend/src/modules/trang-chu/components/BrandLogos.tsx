'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface BrandItem {
  name: string;
  logo: string;
  count?: number;
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
};

export default function BrandLogos() {
  const [brands, setBrands] = useState<BrandItem[]>([
    { name: 'Nike', logo: BRAND_PRESETS['Nike'] },
    { name: 'Adidas', logo: BRAND_PRESETS['Adidas'] },
    { name: 'Yonex', logo: BRAND_PRESETS['Yonex'] },
    { name: 'Under Armour', logo: BRAND_PRESETS['Under Armour'] },
    { name: 'Lining', logo: BRAND_PRESETS['Lining'] },
    { name: 'Asics', logo: BRAND_PRESETS['Asics'] },
    { name: 'Mizuno', logo: BRAND_PRESETS['Mizuno'] },
    { name: 'Joola', logo: BRAND_PRESETS['Joola'] },
  ]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/products/brands')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: string[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map DB brands to visual items
          const list: BrandItem[] = data.map((b) => ({
            name: b,
            logo: BRAND_PRESETS[b] || '',
          }));
          setBrands(list);
        }
      })
      .catch((err) => console.warn('Using fallback brands:', err));
  }, []);

  // Duplicate for seamless infinite marquee
  const doubled = [...brands, ...brands];

  return (
    <section className="bg-white border-t border-slate-100 py-8 overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mb-5 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[4px] text-slate-400">
          Thương Hiệu Thể Thao Hàng Đầu
        </p>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
        >
          Xem tất cả ({brands.length} hãng)
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Infinite scrolling track */}
        <div className="flex gap-8 sm:gap-12 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.name}-${i}`}
              href={`/san-pham?brand=${encodeURIComponent(brand.name)}`}
              title={`Xem sản phẩm ${brand.name}`}
              className="group flex items-center justify-center px-4 py-2 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-300 shrink-0"
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-8 max-w-[110px] w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text tag if external image doesn't render
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'font-black text-slate-600 text-xs sm:text-sm tracking-wider uppercase group-hover:text-blue-600';
                      span.innerText = brand.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="font-black text-slate-600 text-xs sm:text-sm tracking-wider uppercase group-hover:text-blue-600 transition-colors">
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
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
