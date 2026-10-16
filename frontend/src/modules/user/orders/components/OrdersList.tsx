"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  ChevronDown, 
  CheckCircle, 
  Package, 
  Truck, 
  XCircle, 
  FileText, 
  Star, 
  ImageIcon, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  AlertCircle,
  X,
  CreditCard,
  MapPin,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { notifications } from "@mantine/notifications";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderData {
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
  user_id?: string;
  created_at: string;
}

const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy / Từ chối", value: "rejected" }
];

export default function OrdersList() {
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/orders/my-orders", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        notifications.show({
          title: "Lỗi",
          message: "Không thể lấy danh sách đơn hàng",
          color: "red"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      setIsCancelling(true);
      const res = await fetch(`http://localhost:8000/api/v1/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        notifications.show({
          title: "Hủy đơn thành công",
          message: "Đơn hàng của bạn đã được chuyển sang trạng thái đã hủy.",
          color: "green"
        });
        // Update local state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: "rejected" } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: "rejected" } : null);
        }
      } else {
        const errData = await res.json();
        notifications.show({
          title: "Không thể hủy đơn",
          message: errData.detail || "Có lỗi xảy ra khi hủy đơn hàng.",
          color: "red"
        });
      }
    } catch (err) {
      notifications.show({
        title: "Lỗi",
        message: "Không thể kết nối đến máy chủ",
        color: "red"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const normalizeStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "pending" || s === "chờ duyệt") return "pending";
    if (s === "confirmed" || s === "đã xác nhận") return "confirmed";
    if (s === "shipping" || s === "đang giao") return "shipping";
    if (s === "delivered" || s === "đã giao") return "delivered";
    if (s === "rejected" || s === "từ chối" || s === "đã hủy") return "rejected";
    return "pending";
  };

  const filteredOrders = orders.filter(order => {
    const norm = normalizeStatus(order.status);
    if (activeTab !== "all" && norm !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order._id.toLowerCase().includes(q);
      const matchItem = order.items.some(item => item.product_name.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }

    if (timeFilter !== "all") {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      if (timeFilter === "3months") {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        if (orderDate < threeMonthsAgo) return false;
      } else if (timeFilter === "6months") {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        if (orderDate < sixMonthsAgo) return false;
      } else if (timeFilter === "thisYear") {
        if (orderDate.getFullYear() !== now.getFullYear()) return false;
      }
    }

    return true;
  });

  const getTabCount = (tabValue: string) => {
    if (tabValue === "all") return orders.length;
    return orders.filter(o => normalizeStatus(o.status) === tabValue).length;
  };

  const renderStatusBadge = (status: string) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "confirmed":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            Đã xác nhận
          </div>
        );
      case "shipping":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
            Đang vận chuyển
          </div>
        );
      case "delivered":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
            Giao thành công
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
            Đã hủy / Từ chối
          </div>
        );
      case "pending":
      default:
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
            Chờ duyệt
          </div>
        );
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <ShoppingBag size={22} className="text-blue-600" />
              Lịch sử mua hàng
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý chi tiết và theo dõi tiến độ các đơn hàng thể thao của bạn
            </p>
          </div>
          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 self-start sm:self-auto">
            Tổng cộng: <span className="font-bold text-blue-600">{orders.length} đơn</span>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex px-6 overflow-x-auto hide-scrollbar gap-6 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
              }}
              className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center ${
                activeTab === tab.value
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === tab.value ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              }`}>
                {getTabCount(tab.value)}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Mã đơn hàng hoặc Tên sản phẩm..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-56">
              <select 
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-sm leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Thời gian: Toàn bộ</option>
                <option value="3months">Thời gian: 3 tháng gần nhất</option>
                <option value="6months">Thời gian: 6 tháng gần nhất</option>
                <option value="thisYear">Trong năm nay</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <button 
              onClick={() => {
                setSearchQuery("");
                setTimeFilter("all");
                setActiveTab("all");
              }}
              className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              <Filter size={16} className="mr-2 text-gray-500" />
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Orders List Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-12 h-12 text-blue-500 animate-bounce mb-3" />
            <p className="text-gray-600 font-medium text-sm">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : paginatedOrders.length > 0 ? (
          paginatedOrders.map(order => {
            const shortId = order._id.substring(order._id.length - 8).toUpperCase();
            const dateStr = new Date(order.created_at).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            });
            const timeStr = new Date(order.created_at).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit"
            });
            const firstItem = order.items[0];
            const remainingCount = order.items.length - 1;
            const normStatus = normalizeStatus(order.status);

            return (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                {/* Order Card Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center text-sm gap-x-2 gap-y-1">
                    <span className="font-bold text-gray-900">Mã đơn: #{shortId}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">Ngày đặt: {dateStr} lúc {timeStr}</span>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span className="text-gray-500 flex items-center">
                      <Truck size={14} className="mr-1 text-gray-400" />
                      Giao hàng VNExpress
                    </span>
                  </div>
                  <div>
                    {renderStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Card Body */}
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center text-blue-500">
                    <Package size={32} />
                  </div>
                  
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 truncate">
                      {firstItem?.product_name || "Sản phẩm thể thao"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {firstItem?.size ? `Size: ${firstItem.size}` : ""} 
                      {firstItem?.color ? ` • Màu: ${firstItem.color}` : ""} 
                      {` • Số lượng: ${firstItem?.quantity || 1}`}
                      {remainingCount > 0 && (
                        <span className="text-blue-600 font-medium ml-2">
                          (+{remainingCount} sản phẩm khác)
                        </span>
                      )}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                        Người nhận: {order.customer_name} ({order.customer_phone})
                      </span>
                      {order.voucher_code && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 font-medium border border-green-200">
                          Mã ưu đãi: {order.voucher_code} (-{(order.discount_amount || 0).toLocaleString("vi-VN")} đ)
                        </span>
                      )}
                    </div>

                    {normStatus === 'rejected' && (
                      <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-red-800">Lý do từ chối / hủy:</span>{' '}
                          <span>{order.rejection_reason || 'Đơn hàng đã bị hủy theo yêu cầu hoặc do cửa hàng.'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end justify-start min-w-[130px]">
                    <div className="font-bold text-gray-900 text-lg">
                      {order.total_amount.toLocaleString("vi-VN")} đ
                    </div>
                    {order.discount_amount && order.discount_amount > 0 ? (
                      <div className="text-xs text-green-600 font-medium mt-0.5">
                        Đã tiết kiệm {(order.discount_amount).toLocaleString("vi-VN")} đ
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Order Card Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col text-sm w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500">Tổng thanh toán:</span>
                      <span className="font-bold text-gray-900 text-lg">{order.total_amount.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="text-gray-500 flex items-center text-xs">
                      {order.payment_method?.includes("VNPAY") || order.payment_method?.includes("MoMo") ? (
                        <CheckCircle size={14} className="mr-1.5 text-green-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                      )}
                      Phương thức: {order.payment_method}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center shadow-sm"
                    >
                      <Eye size={16} className="mr-1.5 text-gray-500" />
                      Chi tiết đơn
                    </button>

                    {normStatus === "pending" && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={isCancelling}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors flex items-center"
                      >
                        <XCircle size={16} className="mr-1.5 text-red-500" />
                        Hủy đơn hàng
                      </button>
                    )}

                    {normStatus === "delivered" && (
                      <button 
                        onClick={() => {
                          notifications.show({
                            title: "Đánh giá sản phẩm",
                            message: "Cảm ơn bạn! Tính năng đánh giá sao sẽ sớm mở trên ứng dụng.",
                            color: "blue"
                          });
                        }}
                        className="px-4 py-2 border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm font-semibold rounded-lg transition-colors flex items-center"
                      >
                        <Star size={16} className="mr-1.5 fill-amber-500 text-amber-500" />
                        Đánh giá
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy đơn hàng nào</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Bạn chưa có đơn hàng nào phù hợp với bộ lọc hiện tại. Hãy tiếp tục khám phá các sản phẩm thể thao chất lượng nhé!
            </p>
            <Link href="/products" className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2">
              <ShoppingBag size={18} />
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 text-sm text-gray-500">
          <div>
            Hiển thị <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> / <span className="font-semibold text-gray-900">{filteredOrders.length}</span> đơn hàng
          </div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${
                  currentPage === page 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Chi tiết đơn hàng #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Rejection Alert if rejected */}
              {normalizeStatus(selectedOrder.status) === 'rejected' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-red-900">Đơn hàng đã bị từ chối / hủy</p>
                    <p className="mt-1 text-red-700">
                      <span className="font-semibold text-red-800">Lý do:</span> {selectedOrder.rejection_reason || 'Đơn hàng đã được hủy theo yêu cầu hoặc xử lý của cửa hàng.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Status and Recipient Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-600" />
                    Địa chỉ nhận hàng
                  </div>
                  <p className="text-sm font-bold text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{selectedOrder.customer_phone}</p>
                  <p className="text-xs text-gray-600 mt-1">{selectedOrder.customer_address}</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-600" />
                    Thanh toán & Vận chuyển
                  </div>
                  <div className="mb-2">
                    {renderStatusBadge(selectedOrder.status)}
                  </div>
                  <p className="text-xs text-gray-600">PTTT: <span className="font-semibold text-gray-900">{selectedOrder.payment_method}</span></p>
                  <p className="text-xs text-gray-600 mt-1">Đơn vị: <span className="font-semibold text-gray-900">{selectedOrder.carrier || "Giao Hàng Nhanh (GHN)"}</span></p>
                  {selectedOrder.tracking_code && (
                    <p className="text-xs text-indigo-700 mt-1.5 flex items-center gap-1 font-semibold bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                      <span>Mã vận đơn:</span>
                      <span className="font-mono font-bold">{selectedOrder.tracking_code}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                  Danh sách sản phẩm ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                          <Package size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size ? `Size: ${item.size}` : ""} 
                            {item.color ? ` • ${item.color}` : ""} 
                            {` • SL: x${item.quantity}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.price.toLocaleString("vi-VN")} đ / cái
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền hàng (tạm tính):</span>
                  <span>{((selectedOrder.subtotal && selectedOrder.subtotal > 0) ? selectedOrder.subtotal : selectedOrder.total_amount).toLocaleString("vi-VN")} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>{(selectedOrder.shipping_fee || 0).toLocaleString("vi-VN")} đ</span>
                </div>
                {selectedOrder.discount_amount && selectedOrder.discount_amount > 0 ? (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Mã giảm giá ({selectedOrder.voucher_code}):</span>
                    <span>-{(selectedOrder.discount_amount).toLocaleString("vi-VN")} đ</span>
                  </div>
                ) : null}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Tổng thanh toán:</span>
                  <span className="text-blue-600">{selectedOrder.total_amount.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                {normalizeStatus(selectedOrder.status) === "pending" && (
                  <button 
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    disabled={isCancelling}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors flex items-center"
                  >
                    <XCircle size={16} className="mr-1.5 text-red-500" />
                    Hủy đơn hàng này
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
