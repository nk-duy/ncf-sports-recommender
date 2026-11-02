import { SizeGuideTabKey } from '../types';
import { MEN_CLOTHING_ROWS, WOMEN_CLOTHING_ROWS } from '../data/sizeGuideData';
import ShoeSizeGuidePanel from './ShoeSizeGuidePanel';

interface SizeGuideTabPanelsProps {
  activeTab: SizeGuideTabKey;
}

export default function SizeGuideTabPanels({ activeTab }: SizeGuideTabPanelsProps) {
  return (
    <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
      {activeTab === 'giay' && <ShoeSizeGuidePanel />}

      {activeTab === 'quan-ao' && (
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Bảng Size Quần Áo Tập Luyện &amp; Thi Đấu
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Chuẩn phom dáng Regular Fit và Slim Fit thể thao
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                1. Bảng số đo Nam (Áo &amp; Quần thể thao)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chiều cao (cm)</th>
                      <th className="p-3">Cân nặng (kg)</th>
                      <th className="p-3">Vòng ngực (cm)</th>
                      <th className="p-3">Vòng eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {MEN_CLOTHING_ROWS.map((row) => (
                      <tr key={row.size} className="hover:bg-blue-50/50">
                        <td className="p-3 font-bold text-blue-600">{row.size}</td>
                        <td className="p-3">{row.height}</td>
                        <td className="p-3">{row.weight}</td>
                        <td className="p-3">{row.chest}</td>
                        <td className="p-3">{row.waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                2. Bảng số đo Nữ (Áo thun, Bra thể thao, Quần legging)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chiều cao (cm)</th>
                      <th className="p-3">Cân nặng (kg)</th>
                      <th className="p-3">Vòng ngực (cm)</th>
                      <th className="p-3">Vòng mông (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {WOMEN_CLOTHING_ROWS.map((row) => (
                      <tr key={row.size} className="hover:bg-blue-50/50">
                        <td className="p-3 font-bold text-blue-600">{row.size}</td>
                        <td className="p-3">{row.height}</td>
                        <td className="p-3">{row.weight}</td>
                        <td className="p-3">{row.chest}</td>
                        <td className="p-3">{row.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vot' && (
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Hướng Dẫn Chọn Thông Số Vợt Cầu Lông &amp; Pickleball
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Lựa chọn đúng trọng lượng và chu vi cán giúp hạn chế chấn thương cổ tay
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                1. Trọng lượng vợt Cầu lông (Ký hiệu chữ U)
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <strong className="text-blue-600 text-sm block mb-1">3U (85 - 89 gram)</strong>
                  <p className="text-xs text-gray-600">
                    Trọng lượng đầm tay, lực đập cầu uy lực. Phù hợp cho nam giới có lực cổ tay khỏe hoặc vận động viên phong trào.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <strong className="text-blue-600 text-sm block mb-1">4U (80 - 84 gram)</strong>
                  <p className="text-xs text-gray-600">
                    <strong>Phổ biến nhất tại Việt Nam (80% người chơi).</strong> Cân bằng hoàn hảo giữa tấn công đập cầu và phòng thủ phản tạt.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <strong className="text-blue-600 text-sm block mb-1">5U (75 - 79 gram)</strong>
                  <p className="text-xs text-gray-600">
                    Trọng lượng siêu nhẹ, linh hoạt xoay sở trên lưới. Rất thích hợp cho nữ giới hoặc người mới bắt đầu tập luyện.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                2. Chu vi cán tay cầm (Ký hiệu chữ G)
              </h3>
              <p className="text-gray-600 mb-2">Ký hiệu số G càng lớn thì cán cầm càng nhỏ:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-xs sm:text-sm">
                <li>
                  <strong>G5:</strong> Cán tiêu chuẩn vừa vặn với kích thước bàn tay trung bình của người Việt Nam.
                </li>
                <li>
                  <strong>G6:</strong> Cán nhỏ, phù hợp với người tay nhỏ hoặc người thích quấn thêm nhiều lớp bọc cán êm tay.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                3. Vợt Pickleball (Độ dày lõi và Trọng lượng)
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-blue-50/40">
                <p>
                  <strong>• Vợt nhẹ (7.3 - 7.8 oz):</strong> Phù hợp cho người chơi ưu tiên kiểm soát bóng tinh tế (Dink shot), giảm mỏi khớp vai và cổ tay.
                </p>
                <p>
                  <strong>• Vợt trung bình (7.9 - 8.4 oz):</strong> Lựa chọn đa năng, vừa có lực đánh sâu (Drive), vừa có độ ổn định khi đỡ bóng nhanh ở vạch Kitchen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
