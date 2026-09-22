import React from "react";

export default function RecommendedProducts() {
    return (
<>
            {/* Related & Recommended Products (AI Engine Grid) */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface-container-low">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
                        <div>
                            <span
                                className="font-data-mono text-label-sm uppercase tracking-wider text-primary font-bold">Neural
                                Recommendations</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Sản phẩm liên quan
                                bạn có thể quan tâm</h2>
                        </div>
                        <a className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-0.5"
                            href="#">
                            Khám phá toàn bộ danh mục <span
                                className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </a>
                    </div>
                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
                        {/* Card 1 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-on-surface text-surface text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    TRAINING
                                </span>
                                <img alt="Giày Training Đa Năng Shadow Blade"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Speed</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Training Đa Năng Shadow Blade
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.890.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-tertiary text-on-tertiary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    TRAIL RUN
                                </span>
                                <img alt="Giày Chạy Địa Hình Trail Explorer Pro"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Outdoor</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Chạy Địa Hình Trail Explorer Pro
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">2.150.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-secondary text-on-secondary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    LIFESTYLE
                                </span>
                                <img alt="Giày Thể Thao Classic Streetwear"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Lifestyle</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Giày Thể Thao Classic Streetwear
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.450.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div
                            className="group bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm">
                            <div
                                className="relative w-full aspect-square bg-surface-container-low rounded-lg p-space-sm mb-space-sm flex items-center justify-center overflow-hidden">
                                <span
                                    className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-data-mono uppercase font-bold px-1.5 py-0.5 rounded">
                                    EQUIPMENT
                                </span>
                                <img alt="Đôi Tạ Tay Thông Minh 10kg Điều Chỉnh"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VHFXTP4eYC5cfPd4HH2jWZFHyOdOS5lZjD7lFq05nSDbBBbJXSMtlYlAAg2yPIwAjdOX28KCOV-O63yuw4cUxEMRLGF5T_oKcIB6XdjRk42p5HM_IFkGqBECHfHN6OEoiUrMIuqA8PDj3wBwz38l4dAo9vs3xatPZB07RBqe6n5C2uGlayqx_s84mPljbN1YSdFAOd7_OYZIESr4SWQuOWuZXWeBqIZTJlqatGBwEPiAP4oiyY9mdE1rs" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">SportsAI
                                    Gear</span>
                                <h3
                                    className="font-label-lg text-label-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                    Đôi Tạ Tay Thông Minh 10kg Điều Chỉnh
                                </h3>
                                <div className="flex items-center justify-between pt-space-xs">
                                    <span
                                        className="font-data-mono text-headline-sm text-headline-sm font-bold text-on-surface">1.850.000
                                        đ</span>
                                    <button
                                        className="w-8 h-8 rounded bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors"
                                        title="Thêm vào giỏ">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

</>
    );
}
