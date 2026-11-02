import { Activity, Disc, Dumbbell, Tent, Trophy, Zap } from "lucide-react";
import type { SportMeta } from "../types";

export const SPORTS_CONFIG: SportMeta[] = [
  {
    id: "pickleball",
    name: "Pickleball",
    dbSportType: "Pickleball",
    tag: "ĐANG THỊNH HÀNH",
    slogan: "Tốc Độ & Kiểm Soát Cầu Chuẩn Xác",
    description:
      "Bộ sưu tập vợt sợi carbon T700, bóng thi đấu USAPA và giày bám sân chuyên dụng cho bộ môn hot nhất hiện nay.",
    bannerImage:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-amber-600 via-orange-600 to-red-600",
    accentColor: "text-amber-500",
    icon: Disc,
  },
  {
    id: "badminton",
    name: "Cầu Lông",
    dbSportType: "Cầu lông",
    tag: "SMASH UY LỰC",
    slogan: "Linh Hoạt Trên Từng Bước Di Chuyển",
    description:
      "Khám phá các dòng vợt công thủ toàn diện 3U/4U, cước trợ lực và giày đệm khí giảm chấn thương gối.",
    bannerImage:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-blue-600 via-indigo-600 to-cyan-600",
    accentColor: "text-blue-500",
    icon: Zap,
  },
  {
    id: "running",
    name: "Chạy Bộ",
    dbSportType: "Chạy bộ",
    tag: "BỨT TỐC TỐI ĐA",
    slogan: "Đệm Êm Vượt Trội, Chinh Phục Mọi Cung Đường",
    description:
      "Giày chạy bộ đệm carbon siêu nhẹ, trang phục Dry-fit thoáng khí và phụ kiện đai chạy bộ điện thoại tiện lợi.",
    bannerImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accentColor: "text-emerald-500",
    icon: Activity,
  },
  {
    id: "football",
    name: "Bóng Đá",
    dbSportType: "Đá bóng",
    tag: "LÀM CHỦ TRẬN ĐẤU",
    slogan: "Cảm Giác Bóng Chuẩn Xác, Bám Sân Tối Đa",
    description:
      "Giày đinh TF sân cỏ nhân tạo, bóng thi đấu đạt chuẩn FIFA PRO và găng tay thủ môn dính bóng cao cấp.",
    bannerImage:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-red-600 via-rose-600 to-pink-600",
    accentColor: "text-rose-500",
    icon: Trophy,
  },
  {
    id: "outdoor",
    name: "Dã Ngoại",
    dbSportType: "Dã ngoại",
    tag: "KHÁM PHÁ THIÊN NHIÊN",
    slogan: "Bền Bỉ Trong Mọi Điều Kiện Thời Tiết",
    description:
      "Lều cắm trại chống thấm PU3000, balo leo núi công thái học, đèn pin dã ngoại và gậy trekking siêu bền.",
    bannerImage:
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-yellow-600 via-amber-600 to-stone-700",
    accentColor: "text-amber-500",
    icon: Tent,
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    dbSportType: "Gym & Fitness",
    tag: "XÂY DỰNG THỂ LỰC",
    slogan: "Tối Ưu Form Tập & Thấm Hút Mồ Hôi",
    description:
      "Bộ quần áo tập gym co giãn 4 chiều, găng tay nâng tạ trợ lực cổ tay và bình lắc thể thao 750ml.",
    bannerImage:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    colorGradient: "from-purple-600 via-violet-600 to-indigo-600",
    accentColor: "text-purple-500",
    icon: Dumbbell,
  },
];
