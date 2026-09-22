import React from "react";

interface Props {
    product: any;
    formatPrice: (price: number) => string;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    setMainImage: (url: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
}

export default function ProductInfo({
    product, formatPrice, selectedColor, setSelectedColor, setMainImage, selectedSize, setSelectedSize, quantity, setQuantity
}: Props) {
    return (
<>
                    {/* Right Column: Purchasing & Specifications (5 cols ~ 42%) */}
                    <div className="lg:col-span-5 flex flex-col gap-space-lg">
                        {/* Meta & Titles */}
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-widest text-primary font-bold">
                                    SportsAI Pro Athletics
                                </span>
                                <span className="font-data-mono text-label-sm text-outline">SKU: SHOE-CARB-902</span>
                            </div>
                            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            {product.name}
          </h1>
                            {/* Ratings & Counters */}
                            <div className="flex items-center justify-between pt-space-xs pb-space-sm">
                                <div className="flex items-center gap-space-sm">
                                    <div className="flex items-center text-amber-500 font-label-md text-label-md font-bold">
                                        <span className="material-symbols-outlined text-[18px] text-amber-500"
                                            style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
                                        <span className="ml-1 text-on-surface">4.9</span>
                                    </div>
                                    <span className="text-outline">/</span>
                                    <a className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors underline decoration-outline-variant"
                                        href="#reviewsSection">
                                        184 đánh giá
                                    </a>
                                    <span className="text-outline">•</span>
                                    <span className="font-data-mono text-body-sm text-secondary">1.250 đã bán</span>
                                </div>
                                {/* Social Share & Wishlist */}
                                <div className="flex items-center gap-space-xs">
                                    <button
                                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
                                        title="Chia sẻ">
                                        <span className="material-symbols-outlined text-[18px]">share</span>
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-error transition-colors"
                                        id="heartBtn" title="Lưu yêu thích">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Price Section */}
                        <div
                            className="p-space-lg bg-surface-container-lowest rounded-xl flex flex-col gap-space-xs shadow-sm">
                            <div className="flex items-baseline gap-space-md">
                                <span
                                    className="font-headline-xl text-headline-xl font-bold text-on-surface font-data-mono">
                                    2.450.000 đ
                                </span>
                                <span className="font-body-md text-body-md text-outline line-through font-data-mono">
              {formatPrice(product.price * 1.2)}
            </span>
                                <span
                                    className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">
                                    -15% GIẢM
                                </span>
                            </div>
                            {/* VIP Member Incentive Pill */}
                            <div
                                className="mt-space-xs p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-space-xs text-on-surface">
                                    <span
                                        className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                                    <span className="font-label-sm text-label-sm">Ưu đãi Hội viên VIP Gold: Giảm thêm
                                        5%</span>
                                </div>
                                <span className="font-data-mono text-label-sm text-primary font-bold">còn 2.327.500 đ</span>
                            </div>
                        </div>
                        {/* Color Selector */}
                        <div className="flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Màu sắc: <span
                                        className="text-primary font-bold" >{selectedColor}</span></span>
                                <span className="font-label-sm text-label-sm text-secondary">3 tùy chọn</span>
                            </div>
                            <div className="flex items-center gap-space-md" id="colorSelector">
                                <button
                                    className="color-btn active group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg shadow-sm"
                                    data-color="Xanh / Trắng Carbon"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8">
                                    <span className="w-4 h-4 rounded-full bg-blue-500 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Xanh /
                                        Trắng</span>
                                </button>
                                <button
                                    className="color-btn group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg hover:bg-surface-container-high transition-colors"
                                    data-color="Đen Neon Stealth"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8">
                                    <span className="w-4 h-4 rounded-full bg-zinc-900 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Đen
                                        Neon</span>
                                </button>
                                <button
                                    className="color-btn group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg hover:bg-surface-container-high transition-colors"
                                    data-color="Trắng Tối giản Pure"
                                    data-img="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI">
                                    <span className="w-4 h-4 rounded-full bg-slate-200 shadow-inner"></span>
                                    <span className="font-label-md text-label-md text-on-surface font-medium">Trắng Tối
                                        giản</span>
                                </button>
                            </div>
                        </div>
                        {/* Size Selector */}
                        <div className="flex flex-col gap-space-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Kích cỡ
                                        (EU):</span>
                                    <span className="font-label-sm text-label-sm text-error font-medium">Còn 5 đôi
                                        cuối</span>
                                </div>
                                <button
                                    className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-0.5"
                                    id="openSizeGuideModal">
                                    <span className="material-symbols-outlined text-[15px]">straighten</span>
                                    Xem bảng quy đổi size
                                </button>
                            </div>
                            <div className="grid grid-cols-6 gap-space-sm" id="sizeSelector">
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">39</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">40</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">41</button>
                                <button
                                    className="size-btn active py-2.5 bg-on-surface text-surface font-data-mono font-bold rounded text-center shadow-sm">42</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">43</button>
                                <button
                                    className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">44</button>
                            </div>
                        </div>
                        {/* SportsAI Smart Fit Box */}
                        <div
                            className="p-space-md bg-surface-container-lowest rounded-xl flex items-start gap-space-md shadow-sm">
                            <div
                                className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-[20px]">psychology</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-space-xs">
                                    <span
                                        className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">SportsAI
                                        Smart Fit Engine</span>
                                    <span
                                        className="font-data-mono text-[10px] bg-primary text-on-primary px-1 rounded font-bold">98.4%
                                        MATCH</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    Dựa trên hồ sơ thể trạng và chiều dài bàn chân <strong>26.2 cm</strong> của bạn:
                                    Khuyên dùng <strong>Size 42 EU</strong> cho độ ôm chân và khoảng thở ngón tối ưu
                                    trong cự ly 42km.
                                </p>
                            </div>
                        </div>
                        {/* Quantity & Stock Warning */}
                        <div className="flex items-center justify-between pt-space-xs">
                            <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 shadow-sm">
                                <button
                                    className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container rounded transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span className="w-12 text-center font-data-mono text-body-md font-bold text-on-surface"
                                    >{quantity}</span>
                                <button
                                    className="w-8 h-8 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container rounded transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <div className="flex items-center gap-space-xs text-tertiary font-label-sm text-label-sm">
                                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                                <span>Sẵn hàng tại Kho Tổng TP. Hồ Chí Minh (Giao 2H)</span>
                            </div>
                        </div>
                        {/* Call to Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                            <button
                                className="w-full py-3.5 px-space-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold rounded-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                THÊM VÀO GIỎ HÀNG
                            </button>
                            <button
                                className="w-full py-3.5 px-space-lg bg-on-surface text-surface font-label-lg text-label-lg font-bold rounded-md hover:bg-surface-dim hover:text-on-surface transition-all flex items-center justify-center gap-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">bolt</span>
                                MUA NGAY - THANH TOÁN
                            </button>
                        </div>
                        {/* Service Perks (Flat Corporate Grid) */}
                        <div className="grid grid-cols-2 gap-space-sm pt-space-sm">
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Freeship từ
                                        500k</span>
                                    <span className="font-data-mono text-[11px] text-outline">Giao toàn quốc</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span
                                    className="material-symbols-outlined text-primary text-[20px]">published_with_changes</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Đổi size tận
                                        nhà</span>
                                    <span className="font-data-mono text-[11px] text-outline">Miễn phí 30 ngày</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Bảo hành 12
                                        tháng</span>
                                    <span className="font-data-mono text-[11px] text-outline">Chính hãng SportsAI</span>
                                </div>
                            </div>
                            <div
                                className="p-space-sm bg-surface-container-lowest rounded-lg flex items-center gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Cam kết
                                        chính hãng</span>
                                    <span className="font-data-mono text-[11px] text-outline">Đền 200% nếu giả</span>
                                </div>
                            </div>
                        </div>
                    </div>

</>
    );
}
