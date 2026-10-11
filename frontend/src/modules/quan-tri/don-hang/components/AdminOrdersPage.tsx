'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, Search, Eye, X, Users, Printer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filters & pagination
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3 columns * 3 rows
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, dateFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/orders?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : (data.items || data.orders || data.data || []));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200"><Clock size={12} /> Chờ xác nhận</span>;
      case 'confirmed': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"><CheckCircle size={12} /> Đã xác nhận</span>;
      case 'rejected': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200"><XCircle size={12} /> Từ chối</span>;
      case 'delivered': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200"><Truck size={12} /> Đã giao</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200"><Package size={12} /> {status}</span>;
    }
  };

  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    let itemsHtml = '';
    selectedOrder.items?.forEach((item: any) => {
      itemsHtml += `
        <tr>
          <td>
            <strong>${item.name}</strong><br/>
            <small>${item.color ? `Màu: ${item.color}` : ''} ${item.size ? `| Size: ${item.size}` : ''}</small>
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatPrice(item.price)}</td>
          <td style="text-align: right;"><strong>${formatPrice(item.price * item.quantity)}</strong></td>
        </tr>
      `;
    });

    const html = `
      <html>
        <head>
          <title>Phiếu Giao Hàng - ${selectedOrder._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 5px 0 0; color: #555; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .info-box { border: 1px dashed #ccc; padding: 15px; border-radius: 8px; }
            .info-box h3 { margin-top: 0; margin-bottom: 10px; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px; text-transform: uppercase; }
            .info-box p { margin: 5px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-box { float: right; width: 300px; border: 1px solid #000; padding: 15px; border-radius: 8px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .total-row.final { font-weight: bold; font-size: 18px; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #777; clear: both; }
            
            @media print {
              body { padding: 0; }
              .total-box { border: 1px solid #000 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PHIẾU GIAO HÀNG</h1>
            <p>Mã đơn hàng: <strong>${selectedOrder._id}</strong> - Ngày đặt: ${formatDate(selectedOrder.created_at)}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <h3>Thông tin người nhận</h3>
              <p><strong>Họ tên:</strong> ${selectedOrder.customer_name}</p>
              <p><strong>Số điện thoại:</strong> ${selectedOrder.customer_phone}</p>
              <p><strong>Email:</strong> ${selectedOrder.customer_email || 'Không cung cấp'}</p>
            </div>
            <div class="info-box">
              <h3>Giao hàng & Thanh toán</h3>
              <p><strong>Địa chỉ:</strong> ${selectedOrder.customer_address}</p>
              <p><strong>Phương thức:</strong> ${selectedOrder.payment_method || 'Thanh toán khi nhận hàng (COD)'}</p>
              <p><strong>Trạng thái:</strong> ${selectedOrder.status}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="text-align: center; width: 60px;">SL</th>
                <th style="text-align: right; width: 120px;">Đơn giá</th>
                <th style="text-align: right; width: 120px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-row">
              <span>Tạm tính:</span>
              <span>${formatPrice(selectedOrder.total_amount)}</span>
            </div>
            <div class="total-row">
              <span>Phí vận chuyển:</span>
              <span>0 ₫</span>
            </div>
            <div class="total-row final">
              <span>TỔNG TIỀN:</span>
              <span>${formatPrice(selectedOrder.total_amount)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã mua sắm tại Cửa hàng!</p>
            <p>Xin vui lòng quay video khi mở gói hàng để được hỗ trợ tốt nhất.</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Tab filter
      if (activeTab !== 'all' && order.status !== activeTab) return false;
      
      // 2. Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = order.customer_name?.toLowerCase().includes(term);
        const matchPhone = order.customer_phone?.includes(term);
        const matchId = order._id?.toLowerCase().includes(term);
        if (!matchName && !matchPhone && !matchId) return false;
      }

      // 3. Date filter
      if (dateFilter !== 'all' && order.created_at) {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (dateFilter === 'today') {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          if (orderDate < weekAgo) return false;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (orderDate < monthAgo) return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [orders, activeTab, searchTerm, dateFilter]);

  // Pagination derived state
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Duyệt Đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Tìm kiếm, duyệt và in vận đơn giao hàng</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Date Filter */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition shadow-sm"
            >
              <option value="all">Mọi thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">Tháng này</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Mã đơn, Tên khách, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm font-medium"
            />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
        {[
          { id: 'all', label: 'Tất cả', icon: <Package size={14} />, iconColor: 'text-gray-500' },
          { id: 'pending', label: 'Chờ duyệt', icon: <Clock size={14} />, iconColor: 'text-amber-500' },
          { id: 'confirmed', label: 'Đã xác nhận', icon: <CheckCircle size={14} />, iconColor: 'text-blue-600' },
          { id: 'delivered', label: 'Đã giao', icon: <Truck size={14} />, iconColor: 'text-green-500' },
          { id: 'rejected', label: 'Từ chối', icon: <XCircle size={14} />, iconColor: 'text-red-500' },
        ].map(tab => {
          // Count only applies to current date/search filters for accuracy
          const currentFilteredCount = orders.filter(order => {
             // 1. Search filter
            if (searchTerm) {
              const term = searchTerm.toLowerCase();
              const matchName = order.customer_name?.toLowerCase().includes(term);
              const matchPhone = order.customer_phone?.includes(term);
              const matchId = order._id?.toLowerCase().includes(term);
              if (!matchName && !matchPhone && !matchId) return false;
            }

            // 2. Date filter
            if (dateFilter !== 'all' && order.created_at) {
              const orderDate = new Date(order.created_at);
              const now = new Date();
              if (dateFilter === 'today' && orderDate.toDateString() !== now.toDateString()) return false;
              if (dateFilter === 'week' && orderDate < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)) return false;
              if (dateFilter === 'month' && orderDate < new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())) return false;
            }

            // 3. Tab logic
            if (tab.id !== 'all' && order.status !== tab.id) return false;

            return true;
          }).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={isActive ? 'text-white' : tab.iconColor}>{tab.icon}</span>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {currentFilteredCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid view */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Đang tải dữ liệu...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package size={40} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-800 text-lg">Không tìm thấy đơn hàng nào</p>
          <p className="text-sm mt-1 text-gray-500">Thử thay đổi từ khóa hoặc bộ lọc của bạn</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {order.customer_name?.charAt(0).toUpperCase() || 'K'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate" title={order.customer_name}>{order.customer_name}</h3>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-sm font-mono text-gray-500 text-xs truncate">Mã đơn: {order._id}</p>
                    <p className="text-sm text-gray-600 line-clamp-2"><span className="font-semibold text-gray-700">Giao đến:</span> {order.customer_address}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Sản phẩm</p>
                      <p className="font-bold text-gray-900">{order.items?.length || 0} món</p>
                    </div>
                    <div className="text-center border-l border-r border-gray-200 px-3 mx-2">
                      <p className="text-xs text-gray-500 mb-0.5">Thanh toán</p>
                      <p className={`text-xs font-black uppercase tracking-wider ${order.payment_method === 'VNPAY' ? 'text-blue-600' : 'text-gray-700'}`}>
                        {order.payment_method || 'COD'}
                        {order.payment_method === 'VNPAY' && <span className="block text-[9px] text-green-600 mt-0.5">ĐÃ THU TIỀN</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Tổng tiền</p>
                      <p className="font-bold text-blue-600">{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50/50 mt-auto flex flex-col gap-3">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600 transition shadow-sm"
                  >
                    <Eye size={16} /> Xem chi tiết hàng hóa
                  </button>
                  
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Cập nhật nhanh trạng thái</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'pending')}
                        className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'pending' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'}`}
                      >
                        Chờ duyệt
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                        className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'confirmed' ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                      >
                        Đã xác nhận
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'rejected')}
                        className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'rejected' ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'}`}
                      >
                        Từ chối
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                        className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'delivered' ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'}`}
                      >
                        Đã giao
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                Hiển thị <span className="font-bold text-gray-900">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, filteredOrders.length)}</span> trên tổng số <span className="font-bold text-gray-900">{filteredOrders.length}</span> đơn hàng
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Logic hiển thị thu gọn trang nếu quá nhiều (chỉ hiện trang hiện tại, +/- 1 trang, đầu, cuối)
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                            currentPage === page 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/80">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
                <p className="text-sm font-mono text-gray-500 mt-0.5">#{selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-blue-600" /> Thông tin Người nhận
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex"><span className="text-gray-500 w-20 shrink-0">Họ tên:</span> <span className="font-semibold text-gray-900">{selectedOrder.customer_name}</span></p>
                    <p className="flex"><span className="text-gray-500 w-20 shrink-0">SĐT:</span> <span className="font-semibold text-gray-900">{selectedOrder.customer_phone}</span></p>
                    <p className="flex"><span className="text-gray-500 w-20 shrink-0">Email:</span> <span className="text-gray-900">{selectedOrder.customer_email || 'Không cung cấp'}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck size={16} className="text-blue-600" /> Giao hàng & Thanh toán
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex"><span className="text-gray-500 w-24 shrink-0">Địa chỉ:</span> <span className="font-medium text-gray-900">{selectedOrder.customer_address}</span></p>
                    <p className="flex"><span className="text-gray-500 w-24 shrink-0">Thời gian:</span> <span className="text-gray-900">{formatDate(selectedOrder.created_at)}</span></p>
                    <p className="flex"><span className="text-gray-500 w-24 shrink-0">Thanh toán:</span> <span className="font-bold uppercase text-blue-600">{selectedOrder.payment_method || 'COD'}</span></p>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package size={16} className="text-gray-600" /> Danh sách Sản phẩm ({selectedOrder.items?.length || 0})
                </h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">Sản phẩm</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Đơn giá</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-bold text-gray-900 line-clamp-2">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1 flex gap-3">
                              {item.color && <span className="flex items-center gap-1">Màu: <span className="font-semibold text-gray-700">{item.color}</span></span>}
                              {item.size && <span className="flex items-center gap-1">Size: <span className="font-semibold text-gray-700">{item.size}</span></span>}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-600">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-right font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex justify-end">
                <div className="w-full sm:w-72 space-y-2 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>0 ₫</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-black text-lg">
                    <span className="text-gray-900">Tổng cộng</span>
                    <span className="text-blue-600">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer (Actions) */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm font-semibold text-gray-500">Trạng thái:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handlePrintInvoice}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Printer size={16} /> In Phiếu Giao Hàng
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-100 transition shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
