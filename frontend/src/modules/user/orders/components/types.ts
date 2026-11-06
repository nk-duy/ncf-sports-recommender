export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image_url?: string;
  image?: string;
  is_reviewed?: boolean;
}

export interface OrderData {
  _id: string;
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  items: OrderItem[];
  total_amount: number;
  shipping_fee?: number;
  subtotal?: number;
  voucher_code?: string;
  discount_amount?: number;
  status: string;
  rejection_reason?: string;
  tracking_code?: string;
  carrier?: string;
  shipping_method?: string;
  user_id?: string;
  created_at: string;
  is_reviewed?: boolean;
}

export interface ReviewingItem {
  productId: string;
  productName: string;
  size?: string;
  color?: string;
  imageUrl?: string;
  orderId?: string;
}

export const ORDER_TABS = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy / Từ chối", value: "rejected" },
];

export const normalizeOrderStatus = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "pending" || s === "chờ duyệt" || s === "chờ xác nhận") return "pending";
  if (s === "confirmed" || s === "đã xác nhận") return "confirmed";
  if (s === "shipping" || s === "shipped" || s === "đang giao" || s === "đang vận chuyển") return "shipping";
  if (s === "delivered" || s === "completed" || s === "đã giao" || s === "hoàn tất") return "delivered";
  if (s === "rejected" || s === "cancelled" || s === "canceled" || s === "từ chối" || s === "đã hủy") return "rejected";
  return "pending";
};

export function getOrderStatusChipInfo(status: string) {
  switch ((status || "").toLowerCase()) {
    case "pending":
    case "chờ duyệt":
    case "chờ xác nhận":
      return { text: "Chờ duyệt", bg: "bg-amber-50", textCol: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    case "confirmed":
    case "đã xác nhận":
      return { text: "Đã xác nhận", bg: "bg-blue-50", textCol: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" };
    case "shipping":
    case "shipped":
    case "đang giao":
    case "đang vận chuyển":
      return { text: "Đang giao", bg: "bg-indigo-50", textCol: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" };
    case "delivered":
    case "completed":
    case "đã giao":
    case "hoàn tất":
      return { text: "Đã giao", bg: "bg-green-50", textCol: "text-green-700", border: "border-green-200", dot: "bg-green-500" };
    case "rejected":
    case "cancelled":
    case "canceled":
    case "từ chối":
    case "đã hủy":
      return { text: "Đã hủy", bg: "bg-red-50", textCol: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
    default:
      return { text: "Đang xử lý", bg: "bg-gray-50", textCol: "text-gray-700", border: "border-gray-100", dot: "bg-gray-500" };
  }
}
