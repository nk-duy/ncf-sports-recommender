import { notifications } from "@mantine/notifications";
import { useCartStore } from "@/shared/store/cartStore";
import type { OrderData } from "../components/types";

export const SPORTS_ORDER_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80";

export function reorderItemsToCart(
  order: OrderData | null | undefined,
  navigate: (href: string) => void,
  onBeforeNavigate?: () => void
): void {
  if (!order || !order.items || order.items.length === 0) return;
  const { addItem } = useCartStore.getState();

  for (const item of order.items) {
    addItem({
      product_id: item.product_id,
      name: item.product_name,
      price: item.price,
      image_url: item.image_url || item.image || SPORTS_ORDER_FALLBACK_IMG,
      quantity: item.quantity || 1,
      size: item.size || "Tiêu chuẩn",
      color: item.color || "Tiêu chuẩn",
      stock: 50,
    });
  }

  notifications.show({
    title: "Thành công",
    message: "Đã thêm toàn bộ sản phẩm của đơn hàng vào giỏ hàng!",
    color: "green",
  });

  onBeforeNavigate?.();
  navigate("/gio-hang");
}
