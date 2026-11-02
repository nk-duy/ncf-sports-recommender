import { notifications } from '@mantine/notifications';
import type { OrderItem } from '../types';
import { formatOrderDate, isDeliveredStatus } from './orderHelpers';

export function exportOrdersToCsv(filteredOrders: OrderItem[]): void {
  if (!filteredOrders.length) {
    notifications.show({
      title: 'Thông báo',
      message: 'Không có dữ liệu đơn hàng để xuất file!',
      color: 'yellow',
    });
    return;
  }

  const headers = [
    'Mã Đơn Hàng',
    'Tên Khách Hàng',
    'Số Điện Thoại',
    'Địa Chỉ Giao Hàng',
    'Ngày Đặt',
    'Hình Thức Thanh Toán',
    'Trạng Thái Thanh Toán',
    'Mã Giảm Giá',
    'Giảm Giá (VND)',
    'Phí Vận Chuyển (VND)',
    'Tổng Tiền (VND)',
    'Trạng Thái',
    'Đơn Vị Vận Chuyển',
    'Mã Vận Đơn',
    'Số Lượng Sản Phẩm',
    'Chi Tiết Sản Phẩm',
  ];

  const rows = filteredOrders.map((order) => {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.product_name || item.name || 'SP'} (x${item.quantity})`)
      .join(' | ');

    let statusText = order.status;
    if (order.status === 'pending') statusText = 'Chờ duyệt';
    else if (order.status === 'confirmed') statusText = 'Đã xác nhận';
    else if (order.status === 'shipping') statusText = 'Đang giao';
    else if (isDeliveredStatus(order.status)) statusText = 'Đã giao';
    else if (order.status === 'rejected') statusText = 'Từ chối / Hủy';

    return [
      `"${order._id || ''}"`,
      `"${(order.customer_name || '').replace(/"/g, '""')}"`,
      `"${order.customer_phone || ''}"`,
      `"${(order.customer_address || '').replace(/"/g, '""')}"`,
      `"${formatOrderDate(order.created_at)}"`,
      `"${order.payment_method || 'COD'}"`,
      `"${order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thu tiền'}"`,
      `"${order.voucher_code || ''}"`,
      order.discount_amount || 0,
      order.shipping_fee || 0,
      order.total_amount || 0,
      `"${statusText}"`,
      `"${order.carrier || ''}"`,
      `"${order.tracking_code || ''}"`,
      order.items?.length || 0,
      `"${itemsSummary.replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `DonHang_KADY_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  notifications.show({
    title: 'Xuất file thành công',
    message: `Đã xuất ${filteredOrders.length} đơn hàng ra file Excel (.csv)`,
    color: 'teal',
  });
}
