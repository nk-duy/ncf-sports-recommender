"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Table } from "@mantine/core";
import { mockRecentOrders } from "../data/mockAccountData";

export default function RecentOrders() {
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
          href="/account/orders" 
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
            {mockRecentOrders.map((order) => (
              <Table.Tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                <Table.Td className="pl-6 py-4">
                  <span className="font-semibold text-blue-600">{order.id}</span>
                </Table.Td>
                <Table.Td className="py-4 text-sm text-gray-600">
                  {order.date}
                </Table.Td>
                <Table.Td className="py-4">
                  <p className="font-medium text-gray-900 text-sm mb-1">{order.summary}</p>
                  <p className="text-xs text-gray-500">{order.details}</p>
                </Table.Td>
                <Table.Td className="py-4">
                  <span className="font-bold text-gray-900">
                    {order.total.toLocaleString("vi-VN")} đ
                  </span>
                </Table.Td>
                <Table.Td className="py-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    order.statusColor === 'blue' 
                      ? 'bg-blue-50 text-blue-700 border-blue-100' 
                      : 'bg-green-50 text-green-700 border-green-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      order.statusColor === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></span>
                    {order.status}
                  </div>
                </Table.Td>
                <Table.Td className="pr-6 py-4 text-right">
                  <button className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors">
                    {order.action}
                  </button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Hiển thị {mockRecentOrders.length} đơn hàng gần đây nhất</span>
        <span>Dữ liệu được cập nhật theo thời gian thực</span>
      </div>
    </div>
  );
}
