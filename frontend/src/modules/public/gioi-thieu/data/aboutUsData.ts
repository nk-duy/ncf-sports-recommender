import {
  ShieldCheck,
  Truck,
  RefreshCw,
  PackageCheck,
  BrainCircuit,
  Zap,
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
    value: '551+',
    label: 'Sản Phẩm Thể Thao',
    sub: 'Đầy đủ size, màu sắc & chứng nhận chính hãng',
    color: 'text-slate-900',
    badge: 'Kho hàng thật',
  },
  {
    value: '29',
    label: 'Môn Thể Thao & Phụ Kiện',
    sub: 'Pickleball, Cầu lông, Running, Bóng đá...',
    color: 'text-blue-600',
    badge: 'Phân loại chuyên sâu',
  },
  {
    value: 'NeuMF',
    label: 'Gợi Ý AI Thông Minh',
    sub: 'PyTorch Neural Collaborative Filtering (NCF)',
    color: 'text-indigo-600',
    badge: 'Học sâu thời gian thực',
  },
  {
    value: '500.000 ₫',
    label: 'Freeship Toàn Quốc',
    sub: 'Miễn phí giao hàng & Đồng kiểm khi nhận',
    color: 'text-emerald-600',
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
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    icon: PackageCheck,
    title: 'Đồng Kiểm Khi Nhận Hàng',
    desc: 'Bạn luôn được quyền mở hộp kiểm tra đúng mẫu mã, đúng size và kiểm tra độ hoàn thiện chất liệu trước khi thanh toán tiền cho nhân viên giao vận.',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    icon: Truck,
    title: 'Giao Nhanh 24 - 48H Toàn Quốc',
    desc: 'Đơn hàng được đóng hộp chống sốc 3 lớp cẩn thận. Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ tới tất cả 63 tỉnh thành trên toàn quốc.',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
];

export const AI_ARCHITECTURE_HIGHLIGHTS = [
  {
    icon: Layers,
    title: 'Generalized Matrix Factorization (GMF)',
    desc: 'Trích xuất và nhân chập các vector đặc trưng tiềm ẩn (latent vectors) giữa người dùng và sản phẩm thể thao, mô hình hóa mối quan hệ tương đồng tuyến tính.',
    badge: 'Linear Interaction',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'Multi-Layer Perceptron (MLP)',
    desc: 'Học sâu qua mạng neuron nhiều tầng phi tuyến tính để nắm bắt sở thích thể thao phức tạp, thói quen vận động và mối liên kết giữa các dòng sản phẩm.',
    badge: 'Deep Non-linear Modeling',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Suy Luận Thời Gian Thực (< 15ms)',
    desc: 'Tích hợp trực tiếp với backend FastAPI bất đồng bộ và MongoDB, tự động xếp hạng danh mục sản phẩm phù hợp nhất ngay khi người dùng tương tác.',
    badge: 'Real-time Async Inference',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
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
    path: '/san-pham?sport_type=Bóng đá',
  },
];
