import {
  ShieldCheck,
  Truck,
  RefreshCw,
  PackageCheck,
  Award,
  Ruler,
  Layers,
} from 'lucide-react';

export const BRAND_PARTNERS = [
  'NIKE',
  'ADIDAS',
  'PUMA',
  'YONEX',
  'MIZUNO',
  'UNDER ARMOUR',
  'ASICS',
  'LINING',
];

export const SYSTEM_METRICS = [
  {
    value: '633+',
    label: 'Sản Phẩm Thể Thao',
    sub: 'Đầy đủ size, màu sắc & chứng nhận chính hãng',
    color: 'text-slate-900',
    badge: 'Kho hàng thật',
  },
  {
    value: '8',
    label: 'Bộ Môn Trọng Điểm',
    sub: 'Đá bóng, Cầu lông, Running, Pickleball, Gym...',
    color: 'text-blue-600',
    badge: 'Danh mục chuyên sâu',
  },
  {
    value: '24/7',
    label: 'Tư Vấn Chọn Size',
    sub: 'Hỗ trợ chọn form dáng chuẩn thể trạng Việt Nam',
    color: 'text-slate-800',
    badge: 'Chăm sóc tận tâm',
  },
  {
    value: '500.000 ₫',
    label: 'Freeship Toàn Quốc',
    sub: 'Miễn phí giao hàng & Đồng kiểm khi nhận',
    color: 'text-slate-800',
    badge: 'Chính sách minh bạch',
  },
];

export const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: '100% Chính Hãng & Minh Bạch',
    desc: 'Toàn bộ giày, vợt, trang phục và phụ kiện đều có nguồn gốc xuất xứ rõ ràng từ các thương hiệu thể thao hàng đầu. Cam kết hoàn tiền gấp 10 lần nếu phát hiện hàng giả.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: RefreshCw,
    title: 'Đổi Trả Tận Nhà 30 Ngày',
    desc: 'Mua đồ thể thao quan trọng nhất là vừa vặn. Khách thử không vừa size, shipper mang size mới tới tận nơi đổi cho bạn, không cần mất công ra bưu cục.',
    color: 'text-slate-800 bg-slate-100 border-slate-200',
  },
  {
    icon: PackageCheck,
    title: 'Đồng Kiểm Khi Nhận Hàng',
    desc: 'Bạn luôn được quyền mở hộp kiểm tra đúng mẫu mã, đúng size và kiểm tra độ hoàn thiện chất liệu trước khi thanh toán tiền cho nhân viên giao vận.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: Truck,
    title: 'Giao Nhanh 24 - 48H Toàn Quốc',
    desc: 'Đơn hàng được đóng hộp chống sốc 3 lớp cẩn thận. Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ tới tất cả 63 tỉnh thành trên toàn quốc.',
    color: 'text-slate-800 bg-slate-100 border-slate-200',
  },
];

export const AI_ARCHITECTURE_HIGHLIGHTS = [
  {
    icon: Layers,
    title: 'Tuyển Chọn Theo Bộ Môn',
    desc: 'Phân loại rõ ràng trang phục, giày thi đấu và phụ kiện chuyên dụng cho từng bộ môn từ phong trào đến bán chuyên.',
    badge: '8 Bộ Môn',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Ruler,
    title: 'Chuẩn Size & Form Dáng',
    desc: 'Bảng quy đổi kích cỡ giày, quần áo và thông số vợt chi tiết giúp bạn tự tin đặt mua trực tuyến không lo chật hay rộng.',
    badge: 'Tư Vấn Size',
    color: 'text-slate-200 bg-slate-700/60 border-slate-600',
  },
  {
    icon: Award,
    title: 'Bảo Hành & Đổi Trả Linh Hoạt',
    desc: 'Chế độ bảo hành sản phẩm rõ ràng lên đến 12 tháng cùng chính sách đổi size tận nhà miễn phí trong 30 ngày.',
    badge: 'Cam Kết KADY',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
];

export const SPORT_CATEGORIES = [
  {
    name: 'Cầu lông',
    desc: 'Vợt cân bằng, giày chống lật cổ chân, cước & túi chuyên dụng',
    path: '/san-pham?sport_type=Cầu lông',
  },
  {
    name: 'Pickleball',
    desc: 'Vợt carbon T700, bóng USAPA, giày bám sân & balo đựng đồ',
    path: '/san-pham?sport_type=Pickleball',
  },
  {
    name: 'Chạy bộ (Running)',
    desc: 'Giày đệm êm chống chấn thương, áo quần thoáng khí, đai chạy & tất nén',
    path: '/san-pham?sport_type=Chạy bộ',
  },
  {
    name: 'Bóng đá & Thể thao đồng đội',
    desc: 'Giày sân cỏ nhân tạo, phụ kiện bảo hộ đầu gối, găng tay & bình nước',
    path: '/san-pham?sport_type=Đá bóng',
  },
];
