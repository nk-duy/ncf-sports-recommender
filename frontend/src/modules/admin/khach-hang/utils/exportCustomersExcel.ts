import { notifications } from "@mantine/notifications";
import type { CustomerItem } from "../types";

function formatJoinDate(dateVal: string | undefined): string {
  if (!dateVal) return "Chưa cập nhật";
  if (typeof dateVal === "string" && dateVal.includes("/")) return dateVal;
  const d = new Date(dateVal);
  if (!Number.isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return String(dateVal);
}

function formatPhone(phoneVal: string | undefined): string {
  if (!phoneVal || phoneVal === "Chưa cập nhật") return "Chưa cập nhật";
  const clean = String(phoneVal).trim();
  if (/^\d{9}$/.test(clean)) return `0${clean}`;
  return clean;
}

// Excel (.xls) Export - Standardized with Dashboard and Product reports
export function exportCustomersToExcel(
  customers: CustomerItem[],
  selectedIds: string[],
  selectedOnly = false
): void {
  // 100% Dữ liệu thực tế từ state/API đang được lọc trên giao diện
  const listToExport =
    selectedOnly && selectedIds.length > 0
      ? customers.filter((c) => selectedIds.includes(c.id))
      : customers;

  if (listToExport.length === 0) {
    notifications.show({
      title: "Thông báo",
      message: "Không có dữ liệu khách hàng nào để xuất file",
      color: "yellow",
    });
    return;
  }

  const exportTimeStr = new Date().toLocaleString("vi-VN");
  const totalOrders = listToExport.reduce((acc, curr) => acc + (Number(curr.orders) || 0), 0);
  const totalSpent = listToExport.reduce((acc, curr) => acc + (Number(curr.spent) || 0), 0);

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>KhachHang_KadySport</x:Name>
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
          <td colspan="12" class="header-title" height="45">DANH SÁCH KHÁCH HÀNG &amp; HỒ SƠ THỂ THAO - HỆ THỐNG KADY SPORT</td>
        </tr>
        <tr height="28">
          <td colspan="12" class="meta-info" height="28">
            Tổng số khách hàng: <strong>${listToExport.length}</strong> hội viên | Ngày giờ xuất: <strong>${exportTimeStr}</strong> | Người xuất: <strong>Quản trị viên</strong>
          </td>
        </tr>
        <tr height="12"><td colspan="12" style="border:none; height: 12px;"></td></tr>
      </table>

      <!-- 2. BẢNG DỮ LIỆU KHÁCH HÀNG (12 CỘT) -->
      <table>
        <tr height="32">
          <th style="width: 50px;">STT</th>
          <th style="width: 130px;">Mã KH</th>
          <th style="width: 220px;">Họ và Tên</th>
          <th style="width: 240px;">Email</th>
          <th style="width: 140px;">Số Điện Thoại</th>
          <th style="width: 280px;">Địa Chỉ Giao Hàng</th>
          <th style="width: 120px;">Phân Hạng</th>
          <th style="width: 260px;">Bộ Môn Quan Tâm (Hồ sơ NCF)</th>
          <th style="width: 120px;">Số Đơn Hàng</th>
          <th style="width: 160px;">Tổng Chi Tiêu (VNĐ)</th>
          <th style="width: 150px;">Lần Cuối Mua Hàng</th>
          <th style="width: 140px;">Ngày Tham Gia</th>
        </tr>
        ${listToExport
          .map((c, idx) => {
            const phone = formatPhone(c.phone);
            const joinDate = formatJoinDate(c.joinDate);
            const sportsStr = Array.isArray(c.sports)
              ? c.sports.filter(Boolean).join(", ") || "Chưa thiết lập"
              : "Chưa thiết lập";
            const spentNum = Number(c.spent) || 0;
            const ordersNum = Number(c.orders) || 0;

            let tierColor = "#475569";
            if (c.tier === "Kim Cương") tierColor = "#059669";
            else if (c.tier === "Vàng") tierColor = "#d97706";
            else if (c.tier === "Bạc") tierColor = "#4b5563";
            else if (c.tier?.includes("Đồng")) tierColor = "#c2410c";

            return `
              <tr height="26">
                <td class="text-center number">${idx + 1}</td>
                <td class="text-center number bold" style="color: #2563eb; font-family: monospace;">${c.code || `#KH-${(c.id || "").slice(-4).toUpperCase()}`}</td>
                <td class="text-left bold">${(c.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                <td class="text-left">${(c.email || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                <td class="text-center number" style="mso-number-format:'\\@';">${phone}</td>
                <td class="text-left">${(c.address || "Chưa cập nhật").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                <td class="text-center bold" style="color: ${tierColor};">${c.tier || "Đồng"}</td>
                <td class="text-left">${sportsStr}</td>
                <td class="currency bold" style="color: #1e293b;">${ordersNum.toLocaleString("vi-VN")} đơn</td>
                <td class="currency bold" style="color: #1e40af; mso-number-format:'\\@';">${spentNum.toLocaleString("vi-VN")} VNĐ</td>
                <td class="text-center number" style="mso-number-format:'\\@';">${c.lastPurchase || "Chưa mua"}</td>
                <td class="text-center number" style="mso-number-format:'\\@';">${joinDate}</td>
              </tr>
            `;
          })
          .join("")}
        <tr class="total-row" height="28">
          <td class="text-center bold" colspan="8" style="background-color: #e2e8f0; color: #1e293b;">
            TỔNG CỘNG (${listToExport.length} KHÁCH HÀNG)
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${totalOrders.toLocaleString("vi-VN")} đơn
          </td>
          <td class="currency bold" style="background-color: #e2e8f0; color: #1e40af;">
            ${totalSpent.toLocaleString("vi-VN")} VNĐ
          </td>
          <td class="number bold" colspan="2" style="background-color: #e2e8f0; color: #64748b;">-</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `DanhSach_KhachHang_KADY_${dateStr}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  notifications.show({
    title: "Xuất Excel thành công",
    message: `Đã xuất ${listToExport.length} khách hàng ra file Excel (.xls) chuyên nghiệp`,
    color: "teal",
  });
}
