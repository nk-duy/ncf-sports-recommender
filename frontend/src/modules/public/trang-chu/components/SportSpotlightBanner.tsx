"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HOME_FALLBACK_SPORT_IMG, type SportMeta } from "../types";

interface SportSpotlightBannerProps {
  sport: SportMeta;
}

export default function SportSpotlightBanner({ sport }: SportSpotlightBannerProps) {
  const SportIcon = sport.icon;

  return (
    <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] lg:min-h-[440px] flex flex-col justify-end p-5 sm:p-6 group">
      <img
        src={sport.bannerImage}
        alt={sport.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = HOME_FALLBACK_SPORT_IMG;
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {sport.tag}
        </span>
      </div>

      <div className="relative z-10 text-white space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
            <SportIcon className="w-5 h-5 text-amber-300" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            {sport.name}
          </h3>
        </div>

        <p className="text-amber-300 font-bold text-sm sm:text-base leading-snug">
          {sport.slogan}
        </p>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal opacity-90">
          {sport.description}
        </p>

        <div className="pt-1.5">
          <Link
            href={`/san-pham?sport_type=${encodeURIComponent(sport.dbSportType)}`}
            className="h-10 px-5 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Khám phá bộ sưu tập {sport.name}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
