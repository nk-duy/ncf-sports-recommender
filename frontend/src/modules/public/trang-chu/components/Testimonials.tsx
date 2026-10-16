'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, ShoppingBag } from 'lucide-react';

interface FeaturedReview {
  id: string;
  user_name: string;
  avatar_url?: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  brand?: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const FALLBACK_TESTIMONIALS: FeaturedReview[] = [
  {
    id: '1',
    user_name: 'Nguyễn Minh Tuấn',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Sản phẩm chất lượng cực kỳ tốt! Mình đã mua vợt ở KADY và rất hài lòng. Giao hàng nhanh, đóng gói cẩn thận, đúng hàng chính hãng.',
    product_id: '',
    product_name: 'Vợt Pickleball Pro T700',
    brand: 'Selkirk',
    timestamp: '2026-10-08T10:00:00Z',
  },
  {
    id: '2',
    user_name: 'Trần Thị Bảo Châu',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'KADY có đa dạng sản phẩm, giá tốt hơn nhiều chỗ khác mà vẫn đảm bảo chính hãng. Giày chạy rất êm chân, bám sân cực kỳ tốt!',
    product_id: '',
    product_name: 'Giày Thể Thao Đa Năng',
    brand: 'Yonex',
    timestamp: '2026-10-07T14:30:00Z',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mt-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<FeaturedReview[]>(FALLBACK_TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/reviews/featured?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch((err) => {
        console.warn('Cannot fetch featured reviews, using fallback:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const go = (dir: 1 | -1) => {
    if (animating || reviews.length <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + dir + reviews.length) % reviews.length);
      setAnimating(false);
    }, 250);
  };

  // Auto rotate
  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const t = reviews[current] || reviews[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 border-t border-slate-100 py-16">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[4px] text-blue-600 mb-2">
            Đánh Giá Trải Nghiệm Khách Hàng
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Khách Hàng Nói Gì Về KADY SPORT
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Tổng hợp các đánh giá thực tế từ khách hàng đã mua và trải nghiệm sản phẩm
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div
            className={`bg-white rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 relative border border-slate-100 transition-all duration-300 ${
              animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Quote badge */}
            <div className="absolute -top-5 left-8 sm:left-12 w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Quote size={20} className="text-white fill-white" />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start pt-2">
              <div className="shrink-0 flex flex-col items-center">
                <img
                  src={t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={t.user_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
                />
                <Stars count={t.rating} />
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Đã mua hàng
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-5 italic font-normal">
                  &ldquo;{t.comment}&rdquo;
                </p>

                <div className="flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="font-black text-slate-900 text-sm sm:text-base">{t.user_name}</p>
                    <p className="text-xs text-slate-400 font-medium">Khách hàng xác thực KADY</p>
                  </div>

                  <div className="text-right">
                    {t.product_id ? (
                      <Link
                        href={`/san-pham/${t.product_id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors max-w-[260px] truncate"
                        title={t.product_name}
                      >
                        <ShoppingBag size={13} className="shrink-0" />
                        <span className="truncate">{t.product_name}</span>
                      </Link>
                    ) : (
                      <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl max-w-[260px] truncate">
                        {t.product_name}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">{formatDate(t.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center text-slate-600 shadow-sm transition cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === current ? 'bg-blue-600 w-6' : 'bg-slate-300 w-2 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center text-slate-600 shadow-sm transition cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
