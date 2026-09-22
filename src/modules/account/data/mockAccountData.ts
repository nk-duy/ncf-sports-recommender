export const mockUserProfile = {
  name: "Nguyễn Khánh Duy",
  email: "khanhduy.nguyen@email.com",
  initials: "KD",
  memberRank: "Vàng",
  joinDate: "14/03/2023",
  favoriteSports: "Chạy bộ, Gym",
};

export const mockSummaryStats = {
  processingOrders: {
    count: 2,
    delivering: 1,
    packaging: 1,
  },
  wishlist: {
    count: 15,
    flashSale: 3,
  },
  rewardPoints: {
    points: 1250,
    voucherValue: 125000,
  },
};

export const mockRecentOrders = [
  {
    id: "#DH-8902",
    date: "28/05/2024",
    time: "14:32",
    summary: "Giày Alpha Marathon Đệm Khí Carbon",
    details: "Phân loại: Xanh Phối Trắng, Size: 42 • SL: 1",
    total: 2450000,
    originalPrice: 2800000,
    price: 2450000,
    quantity: 1,
    status: "Đang vận chuyển",
    statusColor: "blue",
    shippingProvider: "GHTK",
    trackingNumber: "GHTK89382194",
    paymentMethod: "Đã thanh toán qua VNPAY",
    completedDate: null,
    tags: ["Miễn phí trả hàng 15 ngày", "Chính hãng SPORTSAI"],
    image: "/images/products/vo-the-thao.jpg", // Using existing placeholder path
    imageColor: "bg-blue-100", // Fallback color block
    actions: [
      { label: "Liên hệ hỗ trợ", type: "secondary" },
      { label: "Theo dõi vận đơn", type: "primary" }
    ]
  },
  {
    id: "#DH-8845",
    date: "15/05/2024",
    time: "09:15",
    summary: "Combo Áo Thun Dry-Fit Pro + Quần Đùi Gym",
    details: "Phân loại: Đen Than Thoáng Khí, Size: L • SL: 1",
    total: 630000,
    originalPrice: null,
    price: 630000,
    quantity: 1,
    status: "Đã hoàn tất",
    statusColor: "green",
    shippingProvider: null,
    trackingNumber: null,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    completedDate: "17/05/2024",
    tags: ["Công nghệ HyperDry 2.0"],
    image: "/images/products/ao-balo.jpg",
    imageColor: "bg-gray-200",
    actions: [
      { label: "Xem chi tiết", type: "secondary" },
      { label: "Đánh giá sản phẩm", type: "outline-star" },
      { label: "Mua lại", type: "primary" }
    ]
  },
  {
    id: "#DH-8710",
    date: "24/04/2024",
    time: "18:40",
    summary: "Bộ Tạ Tay Thông Minh Đa Năng 10kg Có Khay Đỡ",
    details: "Phân loại: Đen Carbon Cao Cấp • SL: 1",
    total: 1850000,
    originalPrice: null,
    price: 1850000,
    quantity: 1,
    status: "Đã hoàn tất",
    statusColor: "green",
    shippingProvider: null,
    trackingNumber: null,
    paymentMethod: "Thanh toán qua Ví MoMo",
    completedDate: "26/04/2024",
    tags: ["Bảo hành điện tử 24 tháng"],
    image: "/images/products/binh-nuoc.jpg",
    imageColor: "bg-zinc-200",
    actions: [
      { label: "Hóa đơn VAT", type: "secondary", icon: "file" },
      { label: "Đã đánh giá 5★", type: "success-text" },
      { label: "Mua lại", type: "primary" }
    ]
  },
];

export const mockAIRecommendations = [
  {
    id: 1,
    name: "Vớ Thể Thao Marathon Chống ...",
    price: 85000,
    matchPercentage: 98,
    image: "/images/products/vo-the-thao.jpg", // Placeholder image path, you can use any existing one or random
    color: "purple" // Just for a mock icon if no image
  },
  {
    id: 2,
    name: "Áo Ba Lỗ Tập Gym Cool-Dry Fit",
    price: 220000,
    matchPercentage: 92,
    image: "/images/products/ao-balo.jpg",
    color: "green"
  },
  {
    id: 3,
    name: "Bình Nước Giữ Nhiệt Thể Thao ...",
    price: 199000,
    matchPercentage: 89,
    image: "/images/products/binh-nuoc.jpg",
    color: "blue"
  },
];

export const mockWishlistItems = [
  {
    id: 1,
    name: "Quần Short Tập Gym Co Giãn 4 Chiều 2 Lớp",
    category: "ĐỒ TẬP GYM",
    price: 310000,
    originalPrice: null,
    inStock: true,
    stockWarning: null,
    image: null,
    isBestseller: false,
    discountBadge: null,
  },
  {
    id: 2,
    name: "Bộ Tạ Tay Điều Chỉnh 10kg Đa Năng",
    category: "THIẾT BỊ TẬP LUYỆN",
    price: 1850000,
    originalPrice: null,
    inStock: true,
    stockWarning: "Chỉ còn 3 bộ trong kho",
    image: null,
    isBestseller: true,
    discountBadge: null,
  },
  {
    id: 3,
    name: "Thảm Tập Yoga Định Tuyến Chống Trượt TPE",
    category: "YOGA & PHỤC HỒI",
    price: 450000,
    originalPrice: 550000,
    inStock: true,
    stockWarning: null,
    image: null,
    isBestseller: false,
    discountBadge: "-18%",
  }
];

export const mockAllOrders = [
  ...mockRecentOrders,
  {
    id: "#DH-8501",
    date: "10/03/2024",
    time: "10:00",
    summary: "Vợt Cầu Lông Carbon Pro 99",
    details: "Phân loại: Đỏ Đen • SL: 2",
    total: 1250000,
    originalPrice: 1500000,
    price: 625000,
    quantity: 2,
    status: "Đã hoàn tất",
    statusColor: "green",
    shippingProvider: null,
    trackingNumber: null,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    completedDate: "12/03/2024",
    tags: ["Tặng kèm quấn cán"],
    image: "/images/products/vo-the-thao.jpg",
    imageColor: "bg-red-100",
    actions: [
      { label: "Xem chi tiết", type: "secondary" },
      { label: "Đánh giá sản phẩm", type: "outline-star" },
      { label: "Mua lại", type: "primary" }
    ]
  },
  {
    id: "#DH-8120",
    date: "05/01/2024",
    time: "15:20",
    summary: "Balo Thể Thao Chống Nước Cao Cấp",
    details: "Phân loại: Đen • SL: 1",
    total: 450000,
    originalPrice: null,
    price: 450000,
    quantity: 1,
    status: "Đã hủy",
    statusColor: "gray",
    shippingProvider: null,
    trackingNumber: null,
    paymentMethod: "Chưa thanh toán",
    completedDate: null,
    tags: [],
    image: "/images/products/ao-balo.jpg",
    imageColor: "bg-gray-800",
    actions: [
      { label: "Xem chi tiết", type: "secondary" },
      { label: "Mua lại", type: "primary" }
    ]
  }
];
