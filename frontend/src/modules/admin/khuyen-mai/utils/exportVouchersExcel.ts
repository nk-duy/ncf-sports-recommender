import { notifications } from "@mantine/notifications";
import { VoucherItem } from "../types";

function formatDate(dateVal: string | null | undefined): string | null {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch {
    // fallback below
  }
  return String(dateVal);
}

// Excel (.xls) Export - Standardized with Dashboard, Product, and Customer reports
export function exportVouchersToExcel(vouchers: VoucherItem[]): void {
  if (!vouchers.length) {
    notifications.show({
      title: "Thông báo",
      message: "Không có voucher nào để xuất file",
      color: "yellow",
    });
    return;
  }

  const exportTimeStr = new Date().toLocaleString("vi-VN");
  const totalUsed = vouchers.reduce(
    (acc, curr) => acc + (Number(curr.used_count) || 0),
    0
  );
  const limitedVouchers = vouchers.filter(
    (v) => v.usage_limit && Number(v.usage_limit) > 0
  );
  const totalLimit = limitedVouchers.reduce(
    (acc, curr) => acc + Number(curr.usage_limit),
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
              <x:Name>KhoVoucher_KadySport</x:Name>
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
      <table>
        <tr height="45">
          <td colspan="13" class="header-title" height="45">DANH SÁCH MÃ GIẢM GIÁ (VOUCHER) &amp; CHƯƠNG TRÌNH KHUYẾN MÃI - KADY SPORT</td>
        </tr>
        <tr height="28">
          <td colspan="13" class="meta-info" height="28">
            Tổng số mã khuyến mãi: <strong>${vouchers.length}</strong> voucher | Ngày giờ xuất: <strong>${exportTimeStr}</strong> | Người xuất: <strong>Quản trị viên</strong>
          </td>
        </tr>
        <tr height="12"><td colspan="13" style="border:none; height: 12px;"></td></tr>
      </table>

      <table>
        <tr height="32">
          <th style="width: 50px;">STT</th>
          <th style="width: 140px;">Mã Voucher</th>
          <th style="width: 280px;">Tiêu Đề / Nội Dung Ưu Đãi</th>
          <th style="width: 130px;">Loại Giảm Giá</th>
          <th style="width: 140px;">Giá Trị Giảm</th>
          <th style="width: 150px;">Giảm Tối Đa (VNĐ)</th>
          <th style="width: 160px;">Đơn Tối Thiểu (VNĐ)</th>
          <th style="width: 120px;">Lượt Đã Dùng</th>
          <th style="width: 140px;">Giới Hạn Sử Dụng</th>
          <th style="width: 130px;">Tỷ Lệ Sử Dụng (%)</th>
          <th style="width: 140px;">Trạng Thái</th>
          <th style="width: 130px;">Ngày Bắt Đầu</th>
          <th style="width: 130px;">Ngày Hết Hạn</th>
        </tr>
        ${vouchers
          .map((v, idx) => {
            const isPercent =
              v.discount_type === "percent" || v.discount_type === "percentage";
            const isFreeship =
              v.discount_type === "freeship" ||
              v.code?.toUpperCase().includes("FREESHIP");

            let title = v.title || v.description || v.name;
            if (!title) {
              const minOrderStr =
                v.min_order_value && Number(v.min_order_value) > 0
                  ? `${Number(v.min_order_value).toLocaleString("vi-VN")}đ`
                  : "0đ";

              if (isFreeship) {
                const shipVal = v.discount_value
                  ? `${Number(v.discount_value).toLocaleString("vi-VN")}đ`
                  : "toàn quốc";
                title = `Miễn phí vận chuyển ${shipVal} cho đơn từ ${minOrderStr}`;
              } else if (isPercent) {
                const maxStr =
                  v.max_discount && Number(v.max_discount) > 0
                    ? ` tối đa ${Number(v.max_discount).toLocaleString("vi-VN")}đ`
                    : "";
                title = `Giảm ${v.discount_value}%${maxStr} cho đơn từ ${minOrderStr}`;
              } else {
                title = `Giảm ${Number(v.discount_value || 0).toLocaleString("vi-VN")}đ cho đơn từ ${minOrderStr}`;
              }
            }

            const discountTypeLabel = isPercent
              ? "Giảm theo %"
              : isFreeship
              ? "Freeship cố định"
              : "Giảm cố định";

            const discountValueStr = isPercent
              ? `${v.discount_value}%`
              : `${Number(v.discount_value || 0).toLocaleString("vi-VN")} VNĐ`;

            let maxDiscountStr = "";
            if (isPercent) {
              maxDiscountStr =
                v.max_discount && Number(v.max_discount) > 0
                  ? `${Number(v.max_discount).toLocaleString("vi-VN")} VNĐ`
                  : "Không giới hạn";
            } else {
              const fixedMax =
                v.max_discount && Number(v.max_discount) > 0
                  ? Number(v.max_discount)
                  : Number(v.discount_value || 0);
              maxDiscountStr = `${fixedMax.toLocaleString("vi-VN")} VNĐ`;
            }

            const minOrderStr = `${Number(v.min_order_value || 0).toLocaleString("vi-VN")} VNĐ`;
            const usedCount = Number(v.used_count || 0);
            const usageLimit = v.usage_limit ? Number(v.usage_limit) : null;
            const usageLimitStr = usageLimit
              ? `${usageLimit.toLocaleString("vi-VN")} lượt`
              : "Không giới hạn";

            let usageRateStr = "-";
            if (usageLimit && usageLimit > 0) {
              const rate = Math.min((usedCount / usageLimit) * 100, 100);
              usageRateStr = `${rate.toFixed(1)}%`;
            }

            const startDateStr =
              formatDate(v.start_date || v.valid_from || v.created_at) ||
              "Từ khi kích hoạt";
            const endDateStr =
              formatDate(
                v.end_date || v.valid_until || v.expiry_date || v.expired_at
              ) || "Vô thời hạn";

            const now = new Date();
            const rawEnd =
              v.end_date || v.valid_until || v.expiry_date || v.expired_at;
            const isExpired = rawEnd && new Date(rawEnd) < now;

            let statusText = "Đang hoạt động";
            let statusColor = "#059669";
            if (!v.is_active) {
              statusText = "Đã tạm dừng";
              statusColor = "#d97706";
            } else if (isExpired) {
              statusText = "Hết hạn";
              statusColor = "#dc2626";
            }

            return `
              <tr height="26">
                <td class="text-center number">${idx + 1}</td>
                <td class="text-center number bold" style="color: #2563eb; font-family: monospace;">${v.code || ""}</td>
                <td class="text-left bold">${title.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                <td class="text-center">${discountTypeLabel}</td>
                <td class="currency bold" style="color: #dc2626;">${discountValueStr}</td>
                <td class="currency" style="color: #475569;">${maxDiscountStr}</td>
                <td class="currency">${minOrderStr}</td>
                <td class="currency bold" style="color: #1e40af;">${usedCount.toLocaleString("vi-VN")}</td>
                <td class="currency">${usageLimitStr}</td>
                <td class="number bold" style="color: #0284c7;">${usageRateStr}</td>
                <td class="text-center bold" style="color: ${statusColor};">${statusText}</td>
                <td class="text-center number" style="mso-number-format:'\\@';">${startDateStr}</td>
                <td class="text-center number" style="mso-number-format:'\\@';">${endDateStr}</td>
              </tr>
            `;
          })
          .join("")}
        <tr class="total-row" height="28">
          <td class="text-center bold" colspan="7" style="background-color: #e2e8f0; color: #1e293b;">
            TỔNG CỘNG (${vouchers.length} VOUCHER)
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${totalUsed.toLocaleString("vi-VN")} lượt
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${
              limitedVouchers.length === vouchers.length
                ? `${totalLimit.toLocaleString("vi-VN")} lượt`
                : `${totalLimit.toLocaleString("vi-VN")} lượt (kèm mã vô hạn)`
            }
          </td>
          <td class="number bold" colspan="4" style="background-color: #e2e8f0; color: #64748b;">-</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelTemplate], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `DanhSach_Voucher_KADY_${dateStr}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  notifications.show({
    title: "Xuất Excel thành công",
    message: `Đã xuất ${vouchers.length} mã voucher ra file Excel (.xls) chuyên nghiệp`,
    color: "teal",
  });
}
