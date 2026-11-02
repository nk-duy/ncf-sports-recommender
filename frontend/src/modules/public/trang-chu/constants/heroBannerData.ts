import { Flame, ShieldCheck, Sparkles, Ticket, Truck } from "lucide-react";
import type { BannerItem } from "../types";

export const DEFAULT_SLIDES: BannerItem[] = [
  {
    _id: "slide-1",
    title: "MEGA SPORTS SALE",
    subtitle: "Giảm đến 50% trang phục & thiết bị thể thao đỉnh cao",
    badge: "ĐẠI TIỆC MUA SẮM LỚN NHẤT",
    image_url:
      "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1920&auto=format&fit=crop&q=80",
    link: "/khuyen-mai",
  },
  {
    _id: "slide-2",
    title: "BỘ SƯU TẬP PICKLEBALL 2026",
    subtitle: "Vợt carbon T700 siêu nhẹ & bóng đạt chuẩn USAPA",
    badge: "XU HƯỚNG THỂ THAO MỚI",
    image_url:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=1920&auto=format&fit=crop&q=80",
    link: "/san-pham?sport_type=Pickleball",
  },
  {
    _id: "slide-3",
    title: "PRO RUNNING SPEED",
    subtitle: "Đệm khí đàn hồi cao, bứt phá mọi kỷ lục cá nhân",
    badge: "BỘ SƯU TẬP CHẠY BỘ",
    image_url:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&auto=format&fit=crop&q=80",
    link: "/san-pham?sport_type=Chạy bộ",
  },
];

export const QUICK_ACTIONS = [
  {
    id: "sale",
    title: "Siêu Sale 50%",
    sub: "Deal chớp nhoáng",
    href: "/khuyen-mai",
    icon: Flame,
    colorClass: "text-red-600 bg-red-50 group-hover:bg-red-600 group-hover:text-white",
    badge: "HOT",
  },
  {
    id: "voucher",
    title: "Kho Voucher",
    sub: "Mã giảm đến 150k",
    href: "/khuyen-mai#kho-voucher",
    icon: Ticket,
    colorClass: "text-amber-600 bg-amber-50 group-hover:bg-amber-600 group-hover:text-white",
  },
  {
    id: "freeship",
    title: "Freeship Toàn Quốc",
    sub: "Đơn hàng từ 500K",
    href: "/khuyen-mai",
    icon: Truck,
    colorClass: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
  },
  {
    id: "new",
    title: "Hàng Mới Về",
    sub: "Bộ sưu tập 2026",
    href: "/san-pham?sort_by=created_desc",
    icon: Sparkles,
    colorClass: "text-purple-600 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white",
  },
  {
    id: "authentic",
    title: "100% Chính Hãng",
    sub: "Bồi hoàn 200%",
    href: "/gioi-thieu",
    icon: ShieldCheck,
    colorClass: "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
  },
];
