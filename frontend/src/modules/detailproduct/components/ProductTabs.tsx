import React from "react";

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ProductTabs({ activeTab, setActiveTab }: Props) {
    return (
<>
            {/* Detailed Specifications & Tabs Section */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    {/* Tab Controls */}
                    <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl w-fit"
                        id="tabGroup">
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-desc" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-desc")}>Mô tả &amp; Công nghệ</button>
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-size" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-size")}>Bảng kích cỡ (Size Guide)</button>
                        <button className={`px-space-lg py-2 font-label-lg text-label-lg rounded-lg font-medium transition-all ${activeTab === "tab-reviews" ? "text-on-surface font-semibold bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} onClick={() => setActiveTab("tab-reviews")}>Đánh giá từ khách hàng (184)</button>
                    </div>
                    {/* Tab 1: Description & Specs */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "tab-desc" ? "block" : "hidden"}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
                            <div className="lg:col-span-7 flex flex-col gap-space-md">
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                                    Công nghệ Chế tác Đỉnh cao cho Chặng đua Marathon
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    <strong>Giày Chạy Bộ Marathon Carbon Alpha Pro</strong> được nghiên cứu và tinh
                                    chỉnh thông qua thuật toán sinh trắc học NCF 2.0. Đôi giày tối ưu hóa lực hoàn trả
                                    sau mỗi cú chạm đất, hỗ trợ duy trì guồng chân (cadence) ổn định xuyên suốt 42.195
                                    km.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                                    <div
                                        className="p-space-md bg-surface-container-lowest rounded-xl flex flex-col gap-1 shadow-sm">
                                        <div className="flex items-center gap-space-xs text-primary font-bold">
                                            <span className="material-symbols-outlined text-[20px]">layers</span>
                                            <span className="font-label-lg text-label-lg">Carbon-Drive Plate</span>
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                                            Tấm sợi carbon nguyên khối uốn cong dạng thìa sóng (spoon-shaped) giúp tạo
                                            lực đẩy tiến về phía trước mạnh mẽ tại pha búng ngón (toe-off).
                                        </p>
                                    </div>
                                    <div
                                        className="p-space-md bg-surface-container-lowest rounded-xl flex flex-col gap-1 shadow-sm">
                                        <div className="flex items-center gap-space-xs text-primary font-bold">
                                            <span className="material-symbols-outlined text-[20px]">speed</span>
                                            <span className="font-label-lg text-label-lg">Nitro-Foam Supercritical</span>
                                        </div>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                                            Bọt đệm nén siêu tới hạn với nitơ lỏng đạt mức hoàn trả năng lượng lên tới
                                            85%, giảm thiểu tối đa áp lực tải lên khớp gối và cơ bắp.
                                        </p>
                                    </div>
                                </div>
                                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                    Phần thân trên (Upper) ứng dụng sợi nguyên khối Nano-Weave siêu nhẹ, kháng nước văng
                                    nhẹ và gia tăng lưu thông luồng khí 40% so với lưới truyền thống, giữ bàn chân luôn
                                    khô ráo trong điều kiện thời tiết nhiệt đới.
                                </p>
                            </div>
                            {/* Specs Table (High Density Corporate Format) */}
                            <div className="lg:col-span-5 flex flex-col gap-space-sm">
                                <h4
                                    className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-bold">
                                    Thông số kỹ thuật chi tiết</h4>
                                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left font-body-sm text-body-sm">
                                        <tbody>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Trọng lượng
                                                </td>
                                                <td
                                                    className="py-2.5 px-space-md font-data-mono font-semibold text-on-surface">
                                                    198 gram (Size 42 EU)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Độ chênh lệch
                                                    gót - mũi (Drop)</td>
                                                <td
                                                    className="py-2.5 px-space-md font-data-mono font-semibold text-on-surface">
                                                    8 mm (Gót 38mm / Mũi 30mm)</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Đĩa đệm
                                                    (Carbon Plate)</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Carbon
                                                    Fiber 3K Full-length</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Chất liệu đệm
                                                    giữa (Midsole)</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Nitro-Foam
                                                    Dual-Density</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Cự ly tối ưu
                                                </td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">
                                                    Half-Marathon (21K) &amp; Full (42K)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Bề mặt chạy
                                                    phù hợp</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">Đường nhựa
                                                    Road, Đường điền kinh Track</td>
                                            </tr>
                                            <tr className="bg-surface-container-low/50">
                                                <td className="py-2.5 px-space-md text-secondary font-medium">Xuất xứ / Tiêu
                                                    chuẩn</td>
                                                <td className="py-2.5 px-space-md font-semibold text-on-surface">SportsAI
                                                    R&amp;D Lab Vietnam / Tiêu chuẩn World Athletics</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tab 2: Size Guide Table */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "tab-size" ? "block" : "hidden"}`}>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Bảng quy đổi kích cỡ
                                chuẩn quốc tế</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Để có trải nghiệm chạy marathon
                                hoàn hảo, hãy đo từ gót chân đến đầu ngón chân dài nhất và cộng thêm 0.5cm.</p>
                        </div>
                        <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-sm">
                            <table className="w-full text-left font-data-mono text-body-sm">
                                <thead>
                                    <tr className="bg-surface-container-high text-on-surface">
                                        <th className="py-3 px-space-md font-bold uppercase">EU Size</th>
                                        <th className="py-3 px-space-md font-bold uppercase">US Men</th>
                                        <th className="py-3 px-space-md font-bold uppercase">UK Size</th>
                                        <th className="py-3 px-space-md font-bold uppercase">Chiều dài chân (CM)</th>
                                        <th className="py-3 px-space-md font-bold uppercase">SportsAI Khuyên dùng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container">
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">39</td>
                                        <td className="py-3 px-space-md">6.5</td>
                                        <td className="py-3 px-space-md">6.0</td>
                                        <td className="py-3 px-space-md">24.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Phù hợp bàn chân thon</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">40</td>
                                        <td className="py-3 px-space-md">7.5</td>
                                        <td className="py-3 px-space-md">7.0</td>
                                        <td className="py-3 px-space-md">25.0 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cỡ thông thường</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">41</td>
                                        <td className="py-3 px-space-md">8.0</td>
                                        <td className="py-3 px-space-md">7.5</td>
                                        <td className="py-3 px-space-md">25.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cỡ thông thường</td>
                                    </tr>
                                    <tr className="bg-primary/5 font-semibold text-primary">
                                        <td className="py-3 px-space-md font-bold">42 (Đang chọn)</td>
                                        <td className="py-3 px-space-md">8.5</td>
                                        <td className="py-3 px-space-md">8.0</td>
                                        <td className="py-3 px-space-md font-bold">26.0 - 26.5 cm</td>
                                        <td className="py-3 px-space-md font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Phù
                                            hợp với bạn nhất
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">43</td>
                                        <td className="py-3 px-space-md">9.5</td>
                                        <td className="py-3 px-space-md">9.0</td>
                                        <td className="py-3 px-space-md">27.0 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Cho bàn chân bè ngang</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-space-md font-bold text-on-surface">44</td>
                                        <td className="py-3 px-space-md">10.0</td>
                                        <td className="py-3 px-space-md">9.5</td>
                                        <td className="py-3 px-space-md">27.5 cm</td>
                                        <td className="py-3 px-space-md text-secondary">Bàn chân lớn</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Tab 3: Customer Reviews */}
                    <div className={`flex flex-col gap-space-xl ${activeTab === "reviewsSection" ? "block" : "hidden"}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
                            {/* Rating Breakdown Summary */}
                            <div
                                className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-md shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <span
                                        className="font-headline-xl text-headline-xl font-bold text-on-surface font-data-mono">4.9</span>
                                    <div className="flex items-center text-amber-500 my-1">
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-[20px]"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-secondary">Dựa trên 184 đánh giá thực
                                        tế</span>
                                </div>
                                {/* Star Bars Visualization */}
                                <div className="flex flex-col gap-space-xs font-data-mono text-label-sm">
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">5 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[90%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">166</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">4 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[8%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">14</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm">
                                        <span className="w-10">3 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[2%]"></div>
                                        </div>
                                        <span className="w-8 text-right text-outline">4</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm text-outline">
                                        <span className="w-10">2 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[0%]"></div>
                                        </div>
                                        <span className="w-8 text-right">0</span>
                                    </div>
                                    <div className="flex items-center gap-space-sm text-outline">
                                        <span className="w-10">1 sao</span>
                                        <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[0%]"></div>
                                        </div>
                                        <span className="w-8 text-right">0</span>
                                    </div>
                                </div>
                            </div>
                            {/* Reviews Feed */}
                            <div className="lg:col-span-8 flex flex-col gap-space-md">
                                {/* Review 1 */}
                                <div
                                    className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-sm shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-space-sm">
                                            <div
                                                className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center font-data-mono">
                                                LH
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-space-xs">
                                                    <span
                                                        className="font-label-lg text-label-lg font-bold text-on-surface">Lê
                                                        Hoàng Nam (Marathoner)</span>
                                                    <span
                                                        className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 rounded font-semibold">Đã
                                                        mua hàng</span>
                                                </div>
                                                <span className="font-data-mono text-[11px] text-secondary">Phân loại: Xanh
                                                    / Trắng • Size 42</span>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface">
                                        Vừa hoàn thành giải marathon cự ly 42km cuối tuần qua với đôi giày này. Đĩa
                                        carbon cực kỳ nảy, giữ cadence rất đều ở pace 4:45 mà không hề bị mỏi cổ chân.
                                        Lớp bọt Nitro êm ái hơn hẳn các dòng trước. Rất xứng đáng từng đồng bỏ ra!
                                    </p>
                                    <div className="flex items-center gap-space-sm pt-space-xs">
                                        <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden p-0.5">
                                            <img alt="Ảnh thực tế người mua" className="w-full h-full object-contain"
                                                src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                                        </div>
                                        <span className="font-label-sm text-label-sm text-outline">Đính kèm ảnh chạy thực
                                            tế</span>
                                    </div>
                                </div>
                                {/* Review 2 */}
                                <div
                                    className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-sm shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-space-sm">
                                            <div
                                                className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center justify-center font-data-mono">
                                                TD
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-space-xs">
                                                    <span
                                                        className="font-label-lg text-label-lg font-bold text-on-surface">Trần
                                                        Minh Đức</span>
                                                    <span
                                                        className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-1.5 rounded font-semibold">Đã
                                                        mua hàng</span>
                                                </div>
                                                <span className="font-data-mono text-[11px] text-secondary">Phân loại: Đen
                                                    Neon • Size 41</span>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[16px]"
                                                style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        </div>
                                    </div>
                                    <p className="font-body-md text-body-md text-on-surface">
                                        Tư vấn size AI của website rất chuẩn xác. Chân mình 25.5cm chọn size 41 mang vừa
                                        khít, upper dệt thoáng mát chạy giữa trưa nắng không bị bí rộp ngón chân. Đóng
                                        gói hộp rất cao cấp, ship 2H đúng hẹn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

</>
    );
}
