// Barcode SVG giả lập tiêu chuẩn Code 128 cho phiếu vận đơn A4/A5
export function buildBarcodeSvg(trackingNum: string): string {
  const bars = [
    [0, 4], [6, 2], [11, 6], [20, 3], [26, 5], [34, 2], [39, 7], [49, 3],
    [55, 5], [63, 4], [70, 2], [75, 6], [84, 3], [90, 6], [99, 2], [104, 5],
    [112, 3], [118, 7], [128, 3], [134, 5], [142, 2], [147, 6], [156, 3], [162, 5],
    [170, 4], [177, 2], [182, 6], [191, 3], [197, 5], [205, 4], [212, 3],
  ];
  const rects = bars
    .map(([x, w]) => `<rect x="${x}" y="0" width="${w}" height="40" fill="#000"/>`)
    .join('');

  return `
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg">
      ${rects}
      <text x="110" y="48" font-size="10" font-family="monospace" text-anchor="middle" fill="#000">${trackingNum}</text>
    </svg>
  `;
}

export const INVOICE_PRINT_STYLES = `
  @page { size: A4 portrait; margin: 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #111827; line-height: 1.4; margin: 0; padding: 16px; font-size: 13px;
  }
  .shipping-label { border: 2px solid #111; border-radius: 12px; padding: 20px; max-width: 820px; margin: 0 auto; }
  .label-top {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid #111; padding-bottom: 14px; margin-bottom: 16px;
  }
  .brand-logo { display: flex; align-items: center; gap: 10px; }
  .brand-title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #1d4ed8; margin: 0; }
  .brand-sub { font-size: 10px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin: 0; font-weight: 700; }
  .barcode-box { text-align: right; }
  .routing-badge {
    display: inline-block; background-color: #111; color: #fff;
    font-weight: 800; font-size: 13px; padding: 4px 12px; border-radius: 6px; margin-top: 4px;
  }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .card-box { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 14px; background-color: #f9fafb; }
  .card-title {
    margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase;
    font-weight: 800; color: #4b5563; border-bottom: 1px dashed #e5e7eb; padding-bottom: 4px;
  }
  .card-content p { margin: 3px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
  th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; }
  th { background-color: #f3f4f6; font-weight: 800; text-transform: uppercase; font-size: 11px; }
  .summary-wrap { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 16px; }
  .qr-track {
    display: flex; align-items: center; gap: 12px; border: 1px solid #e5e7eb;
    padding: 10px; border-radius: 8px; background: #fff; max-width: 320px;
  }
  .qr-track img { width: 75px; height: 75px; }
  .qr-text { font-size: 11px; color: #4b5563; }
  .qr-text strong { color: #111; display: block; margin-bottom: 2px; }
  .total-box { width: 320px; border: 2px solid #111; padding: 12px 14px; border-radius: 8px; background-color: #fff; }
  .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
  .total-row.discount { color: #16a34a; font-weight: 600; }
  .total-row.final {
    font-weight: 900; font-size: 16px; border-top: 2px solid #111;
    padding-top: 8px; margin-top: 6px; color: #1d4ed8;
  }
  .signature-box {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; text-align: center;
    margin-top: 24px; padding-top: 14px; border-top: 1px dashed #ccc; font-size: 11px;
  }
  .sign-col { height: 80px; }
  .sign-title { font-weight: 700; margin-bottom: 4px; }
  .sign-note { font-style: italic; color: #6b7280; }
  .footer-note {
    text-align: center; font-size: 11px; color: #6b7280;
    margin-top: 16px; border-top: 1px solid #e5e7eb; padding-top: 8px;
  }
  @media print {
    body { padding: 0; }
    .shipping-label { border: 2px solid #000; }
  }
`;
