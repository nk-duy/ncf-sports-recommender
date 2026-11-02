/**
 * Tiện ích in phiếu giao hàng / vận đơn (Print Shipping Invoice)
 * Độc lập với runtime CSS của Next.js nhằm đảm bảo bản in chuẩn khổ A4/A5,
 * tương thích 100% với mọi loại máy in và không bị vỡ bố cục.
 */
import type { OrderItem } from '../types';
import { buildBarcodeSvg, INVOICE_PRINT_STYLES } from './invoiceStyles';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Chưa rõ';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const printOrderInvoice = (order: OrderItem | null | undefined): void => {
  if (!order) return;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;

  const itemsHtml = (order.items || [])
    .map(
      (item, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td>
          <strong>${item.product_name || item.name || 'Sản phẩm'}</strong><br/>
          <small>${item.color ? `Màu: ${item.color}` : ''} ${item.size ? `| Size: ${item.size}` : ''}</small>
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatPrice(item.price)}</td>
        <td style="text-align: right;"><strong>${formatPrice(item.price * item.quantity)}</strong></td>
      </tr>
    `
    )
    .join('');

  const subtotal =
    order.subtotal && order.subtotal > 0
      ? order.subtotal
      : order.items?.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0) ||
        order.total_amount;
  const shippingFee = order.shipping_fee ?? 0;
  const discountAmount = order.discount_amount ?? 0;
  const voucherCode = order.voucher_code;

  const carrierName = order.carrier || 'Giao Hàng Nhanh (GHN)';
  const trackingNum = order.tracking_code || `KADY${(order._id || '').slice(-6).toUpperCase()}`;
  const barcodeSvg = buildBarcodeSvg(trackingNum);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://kady-sports.vn/tracking?order=${order._id}`;
  const isOnlinePaid =
    Boolean(order.payment_method?.includes('VNPAY')) ||
    Boolean(order.payment_method?.includes('MoMo'));

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Phiếu Giao Hàng - ${order._id}</title>
        <style>${INVOICE_PRINT_STYLES}</style>
      </head>
      <body>
        <div class="shipping-label">
          <div class="label-top">
            <div class="brand-logo">
              <div>
                <h1 class="brand-title">KADY SPORTS</h1>
                <p class="brand-sub">Hệ thống Thiết bị & Phục trang Thể thao</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #4b5563;">Hotline: <strong>1900 6868</strong> • Web: kady-sports.vn</p>
              </div>
            </div>
            <div class="barcode-box">
              <div>${barcodeSvg}</div>
              <div class="routing-badge">${carrierName.toUpperCase()}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card-box">
              <div class="card-title">Từ (Người gửi):</div>
              <div class="card-content">
                <p><strong>KADY SPORTS FLAGSHIP STORE</strong></p>
                <p>SĐT: 0987.654.321</p>
                <p>Địa chỉ: 123 Đường Thể Thao, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div class="card-box">
              <div class="card-title">Đến (Người nhận):</div>
              <div class="card-content">
                <p><strong style="font-size: 14px;">${order.customer_name}</strong></p>
                <p>SĐT: <strong style="font-size: 14px; color: #1d4ed8;">${order.customer_phone}</strong></p>
                <p>Địa chỉ: <strong>${order.customer_address}</strong></p>
              </div>
            </div>
          </div>

          <div class="card-box" style="margin-bottom: 16px; background: #eff6ff; border-color: #bfdbfe;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <span>Mã đơn hàng: <strong style="font-family: monospace;">#${order._id}</strong></span>
              <span>Ngày đặt: <strong>${formatDate(order.created_at)}</strong></span>
              <span>Đơn vị vận chuyển: <strong>${carrierName}</strong></span>
              <span>Mã vận đơn: <strong style="color: #1d4ed8; font-family: monospace;">${trackingNum}</strong></span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">STT</th>
                <th>Tên sản phẩm & Phân loại</th>
                <th style="text-align: center; width: 60px;">SL</th>
                <th style="text-align: right; width: 110px;">Đơn giá</th>
                <th style="text-align: right; width: 120px;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div class="summary-wrap">
            <div class="qr-track">
              <img src="${qrCodeUrl}" alt="QR Tra cứu" />
              <div class="qr-text">
                <strong>Quét mã QR tra cứu</strong>
                <span>Khách hàng hoặc shipper quét QR để xem hành trình đơn & chính sách đổi trả 30 ngày.</span>
              </div>
            </div>

            <div class="total-box">
              <div class="total-row">
                <span>Tiền hàng (tạm tính):</span>
                <span>${formatPrice(subtotal)}</span>
              </div>
              <div class="total-row">
                <span>Phí giao hàng:</span>
                <span>${shippingFee > 0 ? formatPrice(shippingFee) : '<strong style="color: #16a34a;">0 ₫ (Miễn phí)</strong>'}</span>
              </div>
              ${
                discountAmount > 0
                  ? `<div class="total-row discount">
                      <span>Voucher ${voucherCode ? `(${voucherCode})` : ''}:</span>
                      <span>-${formatPrice(discountAmount)}</span>
                    </div>`
                  : ''
              }
              <div class="total-row final">
                <span>${isOnlinePaid ? 'TIỀN THU (COD): 0 ₫' : 'TIỀN THU (COD):'}</span>
                <span>${isOnlinePaid ? 'ĐÃ TT' : formatPrice(order.total_amount)}</span>
              </div>
              <div style="font-size: 11px; margin-top: 4px; color: #4b5563; text-align: right;">
                Hình thức: <strong>${order.payment_method || 'COD'}</strong>
              </div>
            </div>
          </div>

          <div class="signature-box">
            <div class="sign-col">
              <div class="sign-title">Người gửi hàng</div>
              <div class="sign-note">(Ký & ghi rõ họ tên)</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Nhân viên giao nhận (Shipper)</div>
              <div class="sign-note">(Ký & ghi rõ họ tên)</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Người nhận hàng</div>
              <div class="sign-note">(Xác nhận hàng nguyên vẹn)</div>
            </div>
          </div>

          <div class="footer-note">
            Lưu ý: Quý khách vui lòng đồng kiểm cùng shipper. Hỗ trợ đổi trả miễn phí trong 30 ngày tại nhà.
          </div>
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
