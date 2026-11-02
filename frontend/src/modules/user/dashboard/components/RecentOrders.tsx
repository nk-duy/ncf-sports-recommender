"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Table } from "@mantine/core";
import { useAuthStore } from "@/shared/store/authStore";
import { notifications } from "@mantine/notifications";
import {
  getOrderStatusChipInfo,
  type OrderData,
} from "@/modules/user/orders/components/types";
import { reorderItemsToCart } from "@/modules/user/orders/utils/reorderHelper";

export default function RecentOrders() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(() => Boolean(isAuthenticated && token));
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken = localStorage.getItem("kady_customer_token") || token;
      const res = await fetch(`${apiUrl}/api/v1/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      });
      if (res.ok) {
        const data: OrderData[] = await res.json();
        setOrders(data);
      } else {
        notifications.show({
          title: "Lỗi",
          message: "Không thể lấy lịch sử đơn hàng",
          color: "red",
        });
      }
    } catch {
      // ignore transient errors
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (active) await fetchOrders();
    };
    void run();
    return () => {
      active = false;
    };
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      setCancellingId(orderId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const customerToken = localStorage.getItem("kady_customer_token") || token;
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      });
      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã hủy đơn hàng thành công!",
          color: "green",
        });
        await fetchOrders();
      } else {
        const errData = await res.json().catch(() => ({}));
        notifications.show({
          title: "Không thể hủy",
          message: errData.detail || "Đơn hàng không thể hủy ở trạng thái này",
          color: "red",
        });
      }
    } catch {
      notifications.show({
        title: "Lỗi",
        message: "Lỗi kết nối máy chủ",
        color: "red",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Đơn hàng gần đây</h2>
          <p className="text-sm text-gray-500">
            Theo dõi lịch sử mua hàng và tiến độ giao nhận sản phẩm thể thao.
          </p>
        </div>
        <Link
          href="/tai-khoan/orders"
          className="mt-4 md:mt-0 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Xem toàn bộ đơn hàng <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table verticalSpacing="md" className="min-w-[800px]">
          <Table.Thead className="bg-gray-50/50">
            <Table.Tr>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Mã Đơn Hàng</Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày Đặt</Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sản Phẩm Tóm Tắt</Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng Tiền</Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng Thái</Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider pr-6 text-right">Thao Tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</Table.Td>
              </Table.Tr>
            ) : orders.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-8 text-gray-500">Bạn chưa có đơn hàng nào.</Table.Td>
              </Table.Tr>
            ) : (
              orders.map((order) => {
                const statusInfo = getOrderStatusChipInfo(order.status);
                return (
                  <Table.Tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <Table.Td className="pl-6 py-4">
                      <span className="font-semibold font-mono tabular-nums text-blue-600">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </Table.Td>
                    <Table.Td className="py-4">
                      <p className="font-medium text-gray-900 text-sm mb-1">{order.items[0]?.product_name || "Sản phẩm"}</p>
                      <p className="text-xs text-gray-500">
                        {order.items[0]?.size ? `Size ${order.items[0].size}` : ""}
                        {order.items[0]?.color ? `, ${order.items[0].color}` : ""}
                        {order.items.length > 1 ? ` +${order.items.length - 1} sp khác` : ""}
                      </p>
                    </Table.Td>
                    <Table.Td className="py-4">
                      <span className="font-bold text-gray-900">{order.total_amount.toLocaleString("vi-VN")} đ</span>
                    </Table.Td>
                    <Table.Td className="py-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.textCol} ${statusInfo.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${statusInfo.dot}`}></span>
                        {statusInfo.text}
                      </div>
                    </Table.Td>
                    <Table.Td className="pr-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => reorderItemsToCart(order, (href) => router.push(href))}
                          className="px-3 py-1.5 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md transition-colors"
                        >
                          Mua lại
                        </button>
                        {["pending", "chờ duyệt", "chờ xác nhận"].includes((order.status || "").toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                          >
                            {cancellingId === order._id ? "Đang hủy..." : "Hủy đơn"}
                          </button>
                        )}
                        <Link href={`/tai-khoan/orders/${order._id}`} className="inline-block px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-2xs">
                          Chi tiết
                        </Link>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Hiển thị {orders.length} đơn hàng gần đây nhất</span>
        <span>Dữ liệu được cập nhật theo thời gian thực</span>
      </div>
    </div>
  );
}
