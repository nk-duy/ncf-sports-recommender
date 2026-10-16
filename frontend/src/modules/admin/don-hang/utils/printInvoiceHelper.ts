/**
 * Tiện ích in phiếu giao hàng / vận đơn (Print Shipping Invoice)
 * Độc lập với runtime CSS của Next.js nhằm đảm bảo bản in chuẩn khổ A4/A5,
 * tương thích 100% với mọi loại máy in và không bị vỡ bố cục.
 */

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return 'Chưa rõ';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

export const printOrderInvoice = (order: any) => {
  if (!order) return;
  
  const printWindow = window.open('', '', 'width=800,height=600');
  if (!printWindow) return;

  let itemsHtml = '';
  order.items?.forEach((item: any) => {
    itemsHtml += `
      <tr>
        <td>
          <strong>${item.product_name || item.name || 'Sản phẩm'}</strong><br/>
          <small>${item.color ? `Màu: ${item.color}` : ''} ${item.size ? `| Size: ${item.size}` : ''}</small>
        </td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">${formatPrice(item.price)}</td>
        <td style="text-align: right;"><strong>${formatPrice(item.price * item.quantity)}</strong></td>
      </tr>
    `;
  });

  const subtotal = (order.subtotal && order.subtotal > 0)
    ? order.subtotal
    : (order.items?.reduce((sum: number, it: any) => sum + (it.price * (it.quantity || 1)), 0) || order.total_amount);
  const shippingFee = order.shipping_fee ?? 0;
  const discountAmount = order.discount_amount ?? 0;
  const voucherCode = order.voucher_code;

  const carrierName = order.carrier || 'Giao Hàng Nhanh (GHN)';
  const trackingNum = order.tracking_code || `KADY${(order._id || '').slice(-6).toUpperCase()}`;

  // Barcode SVG giả lập tiêu chuẩn Code 128
  const barcodeSvg = `
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="4" height="40" fill="#000"/>
      <rect x="6" y="0" width="2" height="40" fill="#000"/>
      <rect x="11" y="0" width="6" height="40" fill="#000"/>
      <rect x="20" y="0" width="3" height="40" fill="#000"/>
      <rect x="26" y="0" width="5" height="40" fill="#000"/>
      <rect x="34" y="0" width="2" height="40" fill="#000"/>
      <rect x="39" y="0" width="7" height="40" fill="#000"/>
      <rect x="49" y="0" width="3" height="40" fill="#000"/>
      <rect x="55" y="0" width="5" height="40" fill="#000"/>
      <rect x="63" y="0" width="4" height="40" fill="#000"/>
      <rect x="70" y="0" width="2" height="40" fill="#000"/>
      <rect x="75" y="0" width="6" height="40" fill="#000"/>
      <rect x="84" y="0" width="3" height="40" fill="#000"/>
      <rect x="90" y="0" width="6" height="40" fill="#000"/>
      <rect x="99" y="0" width="2" height="40" fill="#000"/>
      <rect x="104" y="0" width="5" height="40" fill="#000"/>
      <rect x="112" y="0" width="3" height="40" fill="#000"/>
      <rect x="118" y="0" width="7" height="40" fill="#000"/>
      <rect x="128" y="0" width="3" height="40" fill="#000"/>
      <rect x="134" y="0" width="5" height="40" fill="#000"/>
      <rect x="142" y="0" width="2" height="40" fill="#000"/>
      <rect x="147" y="0" width="6" height="40" fill="#000"/>
      <rect x="156" y="0" width="3" height="40" fill="#000"/>
      <rect x="162" y="0" width="5" height="40" fill="#000"/>
      <rect x="170" y="0" width="4" height="40" fill="#000"/>
      <rect x="177" y="0" width="2" height="40" fill="#000"/>
      <rect x="182" y="0" width="6" height="40" fill="#000"/>
      <rect x="191" y="0" width="3" height="40" fill="#000"/>
      <rect x="197" y="0" width="5" height="40" fill="#000"/>
      <rect x="205" y="0" width="4" height="40" fill="#000"/>
      <rect x="212" y="0" width="3" height="40" fill="#000"/>
      <text x="110" y="48" font-size="10" font-family="monospace" text-anchor="middle" fill="#000">${trackingNum}</text>
    </svg>
  `;

  // QR Code Quick Track Image API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=https://kady-sports.vn/tracking?order=${order._id}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Phiếu Giao Hàng - ${order._id}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
            color: #111827; 
            line-height: 1.4; 
            margin: 0; 
            padding: 16px;
            font-size: 13px;
          }
          .shipping-label {
            border: 2px solid #111;
            border-radius: 12px;
            padding: 20px;
            max-width: 820px;
            margin: 0 auto;
          }
          .label-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #111;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }
          .brand-logo {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .brand-title {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #1d4ed8;
            margin: 0;
          }
          .brand-sub {
            font-size: 10px;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 1px;
            margin: 0;
            font-weight: 700;
          }
          .barcode-box {
            text-align: right;
          }
          .routing-badge {
            display: inline-block;
            background-color: #111;
            color: #fff;
            font-weight: 800;
            font-size: 13px;
            padding: 4px 12px;
            border-radius: 6px;
            margin-top: 4px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }
          .card-box {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 14px;
            background-color: #f9fafb;
          }
          .card-title {
            margin: 0 0 6px 0;
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 800;
            color: #4b5563;
            border-bottom: 1px dashed #e5e7eb;
            padding-bottom: 4px;
          }
          .card-content p {
            margin: 3px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 16px; 
            font-size: 12px;
          }
          th, td { 
            border: 1px solid #e5e7eb; 
            padding: 8px 10px; 
            text-align: left; 
          }
          th { 
            background-color: #f3f4f6; 
            font-weight: 800; 
            text-transform: uppercase;
            font-size: 11px;
          }
          .summary-wrap {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 16px;
          }
          .qr-track {
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid #e5e7eb;
            padding: 10px;
            border-radius: 8px;
            background: #fff;
            max-width: 320px;
          }
          .qr-track img {
            width: 75px;
            height: 75px;
          }
          .qr-text {
            font-size: 11px;
            color: #4b5563;
          }
          .qr-text strong {
            color: #111;
            display: block;
            margin-bottom: 2px;
          }
          .total-box { 
            width: 320px; 
            border: 2px solid #111; 
            padding: 12px 14px; 
            border-radius: 8px; 
            background-color: #fff; 
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 6px; 
            font-size: 12px; 
          }
          .total-row.discount { color: #16a34a; font-weight: 600; }
          .total-row.final { 
            font-weight: 900; 
            font-size: 16px; 
            border-top: 2px solid #111; 
            padding-top: 8px; 
            margin-top: 6px; 
            color: #1d4ed8; 
          }
          .signature-box {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            text-align: center;
            margin-top: 24px;
            padding-top: 14px;
            border-top: 1px dashed #ccc;
            font-size: 11px;
          }
          .sign-col {
            height: 80px;
          }
          .sign-title {
            font-weight: 700;
            margin-bottom: 4px;
          }
          .sign-note {
            font-style: italic;
            color: #6b7280;
          }
          .footer-note {
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            margin-top: 16px;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
          }

          @media print {
            body { padding: 0; }
            .shipping-label { border: 2px solid #000; }
          }
        </style>
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
            <tbody>
              ${itemsHtml}
            </tbody>
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
              ${discountAmount > 0 ? `
                <div class="total-row discount">
                  <span>Voucher ${voucherCode ? `(${voucherCode})` : ''}:</span>
                  <span>-${formatPrice(discountAmount)}</span>
                </div>
              ` : ''}
              <div class="total-row final">
                <span>${order.payment_method?.includes('VNPAY') || order.payment_method?.includes('MoMo') ? 'TIỀN THU (COD): 0 ₫' : 'TIỀN THU (COD):'}</span>
                <span>${order.payment_method?.includes('VNPAY') || order.payment_method?.includes('MoMo') ? 'ĐÃ TT' : formatPrice(order.total_amount)}</span>
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
