import { notifications } from '@mantine/notifications';
import type { AdminProductItem } from '../types';

export function exportProductsToExcel(listToExport: AdminProductItem[]): void {
  // 100% Dữ liệu thực tế từ state/API đang được lọc trên giao diện
  if (listToExport.length === 0) {
    notifications.show({
      title: 'Thông báo',
      message: 'Không có dữ liệu sản phẩm để xuất file',
      color: 'yellow',
    });
    return;
  }

  const exportTimeStr = new Date().toLocaleString('vi-VN');
  const totalStock = listToExport.reduce(
    (acc, curr) => acc + Number(curr.stock !== undefined ? curr.stock : 0),
    0
  );
  const totalSales = listToExport.reduce(
    (acc, curr) => acc + Number(curr.sales_count || curr.sold || 0),
    0
  );

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>DanhSach_SanPham_Kady</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
        .header-title { background-color: #1e40af; color: #ffffff; font-size: 14pt; font-weight: bold; text-align: center; height: 45px; vertical-align: middle; }
        .meta-info { background-color: #f8fafc; color: #475569; font-size: 10pt; font-style: italic; text-align: center; height: 28px; vertical-align: middle; border: 1px solid #cbd5e1; }
        table { border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #dbeafe; color: #1e3a8a; font-weight: bold; font-size: 10.5pt; border: 1px solid #cbd5e1; height: 32px; text-align: center; vertical-align: middle; white-space: nowrap; }
        td { border: 1px solid #cbd5e1; font-size: 10pt; height: 26px; padding: 4px 8px; vertical-align: middle; white-space: nowrap; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .currency { mso-number-format:"\\@"; text-align: right; white-space: nowrap; }
        .number { mso-number-format:"\\@"; text-align: center; white-space: nowrap; }
        .bold { font-weight: bold; }
        .total-row { background-color: #f1f5f9; font-weight: bold; height: 28px; }
      </style>
    </head>
    <body>
      <!-- 1. TIÊU ĐỀ BÁO CÁO & THÔNG TIN CHUNG -->
      <table>
        <tr height="45">
          <td colspan="14" class="header-title" height="45">DANH SÁCH SẢN PHẨM &amp; TỒN KHO HỆ THỐNG KADY SPORT</td>
        </tr>
        <tr height="28">
          <td colspan="14" class="meta-info" height="28">
            Tổng số sản phẩm xuất: <strong>${listToExport.length}</strong> mặt hàng | Ngày giờ xuất: <strong>${exportTimeStr}</strong> | Người xuất: <strong>Quản trị viên</strong>
          </td>
        </tr>
        <tr height="12"><td colspan="14" style="border:none; height: 12px;"></td></tr>
      </table>

      <!-- 2. BẢNG DỮ LIỆU SẢN PHẨM (14 CỘT) -->
      <table>
        <tr height="32">
          <th style="width: 50px;">STT</th>
          <th style="width: 240px;">Mã Sản Phẩm (ID/ASIN)</th>
          <th style="width: 380px;">Tên Sản Phẩm</th>
          <th style="width: 140px;">Môn Thể Thao</th>
          <th style="width: 120px;">Phân Loại</th>
          <th style="width: 180px;">Danh Mục Con</th>
          <th style="width: 130px;">Thương Hiệu</th>
          <th style="width: 140px;">Giá Gốc (VNĐ)</th>
          <th style="width: 100px;">Giảm Giá (%)</th>
          <th style="width: 140px;">Giá Bán (VNĐ)</th>
          <th style="width: 100px;">Tồn Kho</th>
          <th style="width: 100px;">Đã Bán</th>
          <th style="width: 100px;">Đánh Giá</th>
          <th style="width: 120px;">Trạng Thái</th>
        </tr>
        ${listToExport
          .map((p, idx) => {
            // Tính toán giá gốc và giá bán chuẩn xác đồng bộ với giao diện
            let originalPrice = Number(p.price || 0);
            let discountPercent = Number(p.discount_percent || 0);
            let salePrice = originalPrice;

            if (p.original_price && Number(p.original_price) > Number(p.price)) {
              originalPrice = Math.round(Number(p.original_price));
              salePrice = Math.round(Number(p.price));
              discountPercent =
                discountPercent > 0
                  ? discountPercent
                  : Math.round(((originalPrice - salePrice) / originalPrice) * 100);
            } else if (discountPercent > 0) {
              originalPrice = Math.round(Number(p.original_price || p.price || 0));
              salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
            } else {
              originalPrice = Math.round(Number(p.price || 0));
              salePrice = originalPrice;
              discountPercent = 0;
            }

            const stock = Number(p.stock !== undefined ? p.stock : 0);
            const salesCount = Number(p.sales_count || p.sold || 0);
            const ratingText = p.rating ? `${Number(p.rating).toFixed(1)} ★` : '5.0 ★';

            let statusText = 'Đang bán';
            let statusColor = '#15803d';
            if (p.is_deleted) {
              statusText = 'Thùng rác';
              statusColor = '#b91c1c';
            } else if (p.is_hidden) {
              statusText = 'Đang ẩn';
              statusColor = '#d97706';
            } else if (stock <= 0) {
              statusText = 'Hết hàng';
              statusColor = '#dc2626';
            }

            const sportType =
              p.sport_type || (Array.isArray(p.category) && p.category[1]) || 'Thể Thao';
            const productType =
              p.product_type || (Array.isArray(p.category) && p.category[2]) || 'Thiết bị';
            const subCategory =
              p.sub_category ||
              (Array.isArray(p.category) && p.category[0]) ||
              (typeof p.category === 'string' ? p.category : '');
            const brand = p.brand || 'KADY';

            return `
              <tr height="26">
                <td class="text-center number">${idx + 1}</td>
                <td class="text-left number" style="font-family: monospace;">${p.product_id}</td>
                <td class="text-left bold">${(p.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td class="text-center">${sportType}</td>
                <td class="text-center">${productType}</td>
                <td class="text-left">${subCategory}</td>
                <td class="text-center bold">${brand}</td>
                <td class="currency" style="color: #64748b;">${originalPrice.toLocaleString('vi-VN')} VNĐ</td>
                <td class="number" style="${discountPercent > 0 ? 'color: #dc2626; font-weight: bold;' : 'color: #64748b;'}">${discountPercent}%</td>
                <td class="currency bold" style="color: #1e40af;">${salePrice.toLocaleString('vi-VN')} VNĐ</td>
                <td class="currency bold" style="${stock <= 5 ? 'color: #dc2626;' : 'color: #15803d;'}">${stock.toLocaleString('vi-VN')}</td>
                <td class="currency">${salesCount.toLocaleString('vi-VN')}</td>
                <td class="number" style="color: #d97706; font-weight: bold;">${ratingText}</td>
                <td class="text-center bold" style="color: ${statusColor};">${statusText}</td>
              </tr>
            `;
          })
          .join('')}
        <tr class="total-row" height="28">
          <td class="text-center bold" colspan="10" style="background-color: #e2e8f0; color: #1e293b;">
            TỔNG CỘNG (${listToExport.length} SẢN PHẨM)
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${totalStock.toLocaleString('vi-VN')}
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${totalSales.toLocaleString('vi-VN')}
          </td>
          <td class="number bold" colspan="2" style="background-color: #e2e8f0; color: #64748b;">-</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateFormatted = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `DanhSach_SanPham_KADY_${dateFormatted}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  notifications.show({
    title: 'Xuất Excel thành công',
    message: `Đã xuất ${listToExport.length} sản phẩm ra file Excel (.xls) chuyên nghiệp`,
    color: 'teal',
  });
}
