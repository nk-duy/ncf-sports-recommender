'use client';

import {
  APPAREL_SIZE_ROWS,
  SHOE_SIZE_ROWS,
  type SizeTabId,
} from './sizeGuideData';

interface SizeGuideTablesProps {
  activeTab: SizeTabId;
  recommendedShoeSize: string;
  recommendedApparelSize: string;
  onSelectSize?: (size: string) => void;
  onClose: () => void;
}

export default function SizeGuideTables({
  activeTab,
  recommendedShoeSize,
  recommendedApparelSize,
  onSelectSize,
  onClose,
}: SizeGuideTablesProps) {
  if (activeTab === 'shoes') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            Bảng quy đổi kích cỡ Giày Thể Thao (Running / Badminton / Pickleball)
          </h4>
          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Chuẩn EUR / US / UK / CM</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
          <table className="w-full text-xs text-left text-gray-600">
            <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3.5 py-3 font-bold text-blue-700">Size EU</th>
                <th className="px-3.5 py-3 font-bold">Chiều dài chân (cm)</th>
                <th className="px-3.5 py-3 font-bold">US Nam</th>
                <th className="px-3.5 py-3 font-bold">US Nữ</th>
                <th className="px-3.5 py-3 font-bold">UK</th>
                <th className="px-3.5 py-3 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SHOE_SIZE_ROWS.map((row) => {
                const isRec = row.eu === recommendedShoeSize;
                return (
                  <tr
                    key={row.eu}
                    className={`transition-colors ${
                      isRec ? 'bg-blue-50/70 font-semibold text-blue-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-blue-600 flex items-center gap-1.5">
                      {row.eu}
                      {isRec && (
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Gợi ý
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">{row.cm}</td>
                    <td className="px-3.5 py-2.5">{row.usMen}</td>
                    <td className="px-3.5 py-2.5">{row.usWomen}</td>
                    <td className="px-3.5 py-2.5">{row.uk}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      {onSelectSize ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSize(row.eu);
                            onClose();
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
                        >
                          Chọn size {row.eu}
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1 text-amber-800">
            💡 Kinh nghiệm chọn size giày chạy &amp; sân đấu không bị bầm móng:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 pl-1">
            <li>
              <strong>Giày Chạy Bộ (Running):</strong> Nên chọn tăng thêm <strong>0.5 - 1 size</strong> so với giày đi chơi thông thường vì bàn chân sẽ giãn nở nhiệt sau 3km - 5km chạy liên tục.
            </li>
            <li>
              <strong>Giày Cầu Lông &amp; Pickleball:</strong> Cần ôm khít ngang má chân nhưng mũi ngón chân cái vẫn phải cách mũi giày khoảng <strong>0.5cm</strong> để hãm phanh gấp an toàn.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeTab === 'apparel') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900">
            Bảng thông số kích cỡ Quần Áo Thể Thao (Form Regular-fit &amp; Athletic)
          </h4>
          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Nam &amp; Nữ Châu Á</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
          <table className="w-full text-xs text-left text-gray-600">
            <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3.5 py-3 font-bold text-indigo-700">Size</th>
                <th className="px-3.5 py-3 font-bold">Chiều cao (cm)</th>
                <th className="px-3.5 py-3 font-bold">Cân nặng (kg)</th>
                <th className="px-3.5 py-3 font-bold">Vòng ngực (cm)</th>
                <th className="px-3.5 py-3 font-bold">Vòng bụng/eo (cm)</th>
                <th className="px-3.5 py-3 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {APPAREL_SIZE_ROWS.map((row) => {
                const isRec = row.size === recommendedApparelSize;
                return (
                  <tr
                    key={row.size}
                    className={`transition-colors ${
                      isRec ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-indigo-600 flex items-center gap-1.5">
                      {row.size}
                      {isRec && (
                        <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          Gợi ý
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5">{row.h}</td>
                    <td className="px-3.5 py-2.5">{row.w}</td>
                    <td className="px-3.5 py-2.5">{row.chest}</td>
                    <td className="px-3.5 py-2.5">{row.waist}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      {onSelectSize ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSize(row.size);
                            onClose();
                          }}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5"
                        >
                          Chọn size {row.size}
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900">
          <span className="font-semibold">Mẹo chọn form:</span> Nếu bạn có vòng bụng lớn hoặc thích mặc rộng rãi để cử động cổ tay và vai linh hoạt khi chơi thể thao, hãy ưu tiên chọn theo <strong>Cân nặng</strong> thay vì Chiều cao.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-blue-600">
            🏸 Trọng lượng Vợt Cầu Lông (Chỉ số U)
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>4U (80g - 84g)</span>
                <span className="text-blue-600">Phổ biến nhất</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">Dành cho đa số người chơi phong trào, cổ tay trung bình, linh hoạt công thủ toàn diện.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>3U (85g - 89g)</span>
                <span className="text-orange-600">Đập cầu uy lực</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">Dành cho người chơi lực tay khỏe, ưa chuộng lối tấn công smash mạnh mẽ.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>5U (&lt; 80g)</span>
                <span className="text-emerald-600">Trợ lực cao</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">Thích hợp cho nữ giới, người mới làm quen hoặc đánh lưới phản tạt tốc độ.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5 text-indigo-600">
            🏓 Vợt Pickleball &amp; Chu vi cán (Paddle Specs)
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>Lightweight (7.3 - 7.8 oz)</span>
                <span className="text-emerald-600">Tốc độ &amp; Phản xạ</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">Tối ưu tốc độ dink bóng và cứu bóng nhanh trên lưới, giảm mỏi cổ tay.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>Midweight (7.9 - 8.3 oz)</span>
                <span className="text-indigo-600">Cân bằng vàng</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">Lựa chọn tiêu chuẩn lý tưởng kết hợp giữa sức mạnh giao bóng và kiểm soát.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="font-bold text-gray-900 flex justify-between">
                <span>Độ dày lõi 16mm vs 13mm</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-0.5">16mm cho độ êm và cảm giác bóng tối đa (Control); 13mm cho tốc độ bay bóng nảy uy lực (Power).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
