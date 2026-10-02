export const mockUserProfile = {
  name: "Khách Hàng",
  email: "khachhang@gmail.com",
  phone: "0123456789",
  tier: "Thành viên Vàng",
  points: 1250,
  avatarUrl: "https://i.pravatar.cc/150?img=11"
};

export const mockSummaryStats = {
  processingOrders: {
    count: 2,
    delivering: 1,
    packaging: 1
  },
  wishlist: {
    count: 5,
    flashSale: 2
  },
  rewardPoints: {
    points: 1250,
    voucherValue: 50000
  }
};

export const mockRecentOrders = [
  {
    id: "ORD-2023-001",
    date: "12/10/2023",
    summary: "Áo Thun Chạy Bộ",
    details: "Size M, Màu Đen",
    total: 350000,
    status: "Đang giao",
    statusColor: "blue",
    action: "Theo dõi"
  },
  {
    id: "ORD-2023-002",
    date: "05/10/2023",
    summary: "Giày Thể Thao Pro",
    details: "Size 42, Màu Trắng",
    total: 1250000,
    status: "Đã giao",
    statusColor: "green",
    action: "Mua lại"
  }
];

export const mockAllOrders = [
  ...mockRecentOrders,
  {
    id: "ORD-2023-003",
    date: "15/09/2023",
    summary: "Quần Short Tập Gym",
    details: "Size L, Màu Xanh",
    total: 250000,
    status: "Đã giao",
    statusColor: "green",
    action: "Mua lại"
  }
];

export const mockAIRecommendations = [
  {
    id: "B00004U31L",
    name: "Áo Thun Tập Gym ADIDAS",
    price: 350000,
    imageUrl: "http://ecx.images-amazon.com/images/I/41D83E3R3VL._SY300_.jpg",
    reason: "Dựa trên áo thun chạy bộ bạn vừa mua"
  },
  {
    id: "0899332757",
    name: "Quần Short Thể Thao",
    price: 200000,
    imageUrl: "http://ecx.images-amazon.com/images/I/41D83E3R3VL._SY300_.jpg",
    reason: "Khách hàng mua giày thường mua kèm"
  }
];

export const mockWishlistItems = [
  {
    id: "B00004U9IW",
    name: "Giày Thể Thao Cao Cấp",
    price: 850000,
    imageUrl: "http://ecx.images-amazon.com/images/I/41D83E3R3VL._SY300_.jpg",
    inStock: true
  }
];
