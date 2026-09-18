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
    summary: "Giày Alpha Marathon Đệm Khí Carbon",
    details: "Size 42 • Màu Xanh Phối Trắng • Kèm quà tặng",
    total: 2450000,
    status: "Đang giao",
    statusColor: "blue",
    action: "Theo dõi vận đơn",
  },
  {
    id: "#DH-8845",
    date: "15/05/2024",
    summary: "Combo Áo Thun Dry-Fit Pro + Quần Đ...",
    details: "Size L • Màu Đen than thoáng khí (Set 2 món)",
    total: 630000,
    status: "Đã hoàn tất",
    statusColor: "green",
    action: "Mua lại",
  },
  {
    id: "#DH-8710",
    date: "24/04/2024",
    summary: "Bộ Tạ Tay Thông Minh Đa Năng 10kg",
    details: "Kèm khay đỡ & đệm bảo vệ cao su cao cấp",
    total: 1850000,
    status: "Đã hoàn tất",
    statusColor: "green",
    action: "Đánh giá",
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
