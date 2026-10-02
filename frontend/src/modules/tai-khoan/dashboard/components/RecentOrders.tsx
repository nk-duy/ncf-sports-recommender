"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Table, Loader } from "@mantine/core";
import { useAuthStore } from "@/shared/store/authStore";
import { notifications } from "@mantine/notifications";

export default function RecentOrders() {
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders/my-orders", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        notifications.show({ title: "Lỗi", message: "Không thể lấy lịch sử đơn hàng", color: "red" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'pending': return { text: 'Chờ xử lý', bg: 'bg-orange-50', textCol: 'text-orange-700', border: 'border-orange-100', dot: 'bg-orange-500' };
      case 'processing': return { text: 'Đang chuẩn bị', bg: 'bg-blue-50', textCol: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500' };
      case 'shipping': return { text: 'Đang giao', bg: 'bg-blue-50', textCol: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500' };
      case 'completed': return { text: 'Đã giao', bg: 'bg-green-50', textCol: 'text-green-700', border: 'border-green-100', dot: 'bg-green-500' };
      case 'cancelled': return { text: 'Đã hủy', bg: 'bg-red-50', textCol: 'text-red-700', border: 'border-red-100', dot: 'bg-red-500' };
      default: return { text: status, bg: 'bg-gray-50', textCol: 'text-gray-700', border: 'border-gray-100', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Đơn hàng gần đây
          </h2>
          <p className="text-sm text-gray-500">
            Theo dõi lịch sử mua hàng và tiến độ giao nhận sản phẩm thể thao.
          </p>
        </div>
        <Link 
          href="/tai-khoan/orders" 
          className="mt-4 md:mt-0 inline-flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Xem toàn bộ đơn hàng <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table verticalSpacing="md" className="min-w-[800px]">
          <Table.Thead className="bg-gray-50/50">
            <Table.Tr>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">
                Mã Đơn Hàng
              </Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Ngày Đặt
              </Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Sản Phẩm Tóm Tắt
              </Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tổng Tiền
              </Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </Table.Th>
              <Table.Th className="text-xs font-bold text-gray-500 uppercase tracking-wider pr-6 text-right">
                Thao Tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </Table.Td>
              </Table.Tr>
            ) : orders.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                  Bạn chưa có đơn hàng nào.
                </Table.Td>
              </Table.Tr>
            ) : (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                <Table.Tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <Table.Td className="pl-6 py-4">
                    <span className="font-semibold text-blue-600">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
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
                    <span className="font-bold text-gray-900">
                      {order.total_amount.toLocaleString("vi-VN")} đ
                    </span>
                  </Table.Td>
                  <Table.Td className="py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.textCol} ${statusInfo.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${statusInfo.dot}`}></span>
                      {statusInfo.text}
                    </div>
                  </Table.Td>
                  <Table.Td className="pr-6 py-4 text-right">
                    <button className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors">
                      Chi tiết
                    </button>
                  </Table.Td>
                </Table.Tr>
              )})
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Hiển thị {orders.length} đơn hàng gần đây nhất</span>
        <span>Dữ liệu được cập nhật theo thời gian thực</span>
      </div>
    </div>
  );
}
