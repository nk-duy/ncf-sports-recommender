import { Info } from 'lucide-react';
import { SHOE_SIZE_ROWS } from '../data/sizeGuideData';

export default function ShoeSizeGuidePanel() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bảng Size Giày Thể Thao &amp; Hướng Dẫn Đo Chân
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Áp dụng cho Giày chạy bộ, Cầu lông, Pickleball và Bóng đá
        </p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            1. Bảng quy đổi kích thước chuẩn (Unisex)
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Chiều dài chân (cm)</th>
                  <th className="p-3">Size EU</th>
                  <th className="p-3">Size US (Nam)</th>
                  <th className="p-3">Size UK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {SHOE_SIZE_ROWS.map((row) => (
                  <tr key={row.cm} className="hover:bg-blue-50/50">
                    <td className="p-3 font-medium text-gray-900">{row.cm}</td>
                    <td className="p-3 font-bold text-blue-600">{row.eu}</td>
                    <td className="p-3">{row.us}</td>
                    <td className="p-3">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-2">
            2. Hướng dẫn đo chiều dài bàn chân tại nhà
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 1: Chuẩn bị</span>
              <p className="text-[12px] text-gray-600">
                Đặt tờ giấy A4 trên sàn sát vào mép tường phẳng. Đứng thẳng lên giấy, gót chân chạm sát tường.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 2: Đánh dấu</span>
              <p className="text-[12px] text-gray-600">
                Dùng bút chì giữ thẳng đứng, đánh dấu điểm xa nhất của ngón chân dài nhất trên tờ giấy.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
              <span className="font-bold text-xs text-blue-600 block mb-1">Bước 3: Đối chiếu</span>
              <p className="text-[12px] text-gray-600">
                Đo khoảng cách từ mép giấy đến điểm đánh dấu. <strong>Cộng thêm 0.5cm</strong> nếu bạn mang tất dệt dày khi chơi thể thao.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1 text-xs sm:text-sm">
          <strong className="flex items-center gap-1.5 font-bold">
            <Info size={16} /> Lưu ý quan trọng cho từng môn:
          </strong>
          <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950 mt-1">
            <li>
              <strong>Giày chạy bộ (Running):</strong> Khi chạy đường dài, bàn chân có xu hướng giãn nở. Bạn nên chọn tăng thêm <strong>0.5 – 1 size</strong> so với giày đi dạo phố để tránh bị cấn mũi hoặc bầm móng.
            </li>
            <li>
              <strong>Giày Cầu lông &amp; Pickleball:</strong> Chọn vừa vặn, ôm chân và có độ khóa gót tốt để giảm chấn thương lật cổ chân khi đổi hướng đột ngột.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
