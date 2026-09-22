import React from "react";

export default function ProductBundle() {
    return (
<>
            {/* Frequently Bought Together / AI Bundle Module */}
            <div className="w-full px-margin-desktop py-space-xl bg-surface-container-low">
                <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
                        <div>
                            <span
                                className="font-data-mono text-label-sm uppercase tracking-wider text-primary font-bold">AI
                                Bundle Optimization</span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Thường được mua cùng
                                bởi các Runner</h2>
                        </div>
                        <span
                            className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-space-md py-1 rounded">Dựa
                            trên 4.280 lượt check-out hoàn tất</span>
                    </div>
                    <div
                        className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                        {/* Products Bundle List */}
                        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-space-md justify-between">
                            {/* Item 1: Main Product */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Giày Carbon Alpha Pro" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-primary font-bold">Sản phẩm này</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Carbon
                                        Alpha Pro</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">2.450.000
                                        đ</span>
                                </div>
                            </div>
                            <span
                                className="material-symbols-outlined text-outline text-[22px] font-bold">tv_displays</span>
                            {/* Item 2: Shirt */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Áo Dry-Fit Pro Training" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1VE-hqvUemUK6N47JSYgfDzkBS4bH6pglQLHkBHQHGW9F5neVdsYhOTvLyioiwBkQ-jzV46G-xMRZK8mSQHq3ItZm2RD5qOp97bloqe0E9k7CFr8K2ZhlL3rHIGB3aWo66CZNKkfUypi_8kWKyaZ9WSQBJfS1cIPQ1f-QNAa0iDvrRiDuI7pSGn-wMQppazs6defjcrfwM6-swS9CnIxuLZiBPRovmW2pQwfezy5nlXPepDhK13iud2lQ" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-secondary">Trang phục</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Áo
                                        Dry-Fit Pro</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">350.000
                                        đ</span>
                                </div>
                            </div>
                            <span
                                className="material-symbols-outlined text-outline text-[22px] font-bold">tv_displays</span>
                            {/* Item 3: Shorts */}
                            <div className="flex items-center gap-space-sm w-full sm:w-auto">
                                <div className="w-20 h-20 bg-surface-container rounded-lg p-1 shrink-0 overflow-hidden">
                                    <img alt="Quần Short Gym Co Giãn" className="w-full h-full object-contain"
                                        src="https://lh3.googleusercontent.com/aida/AEtjO1Wd8RCctv-QUzuwuOymo5pIfZ1uSln5WSqLfEH2aJe9onchv0p9SVnhAZRj_Gszi1VzShIG3joPkUXGkxEY5DtHJ4-mMOYWNfq28XqRReeTn74kXh_Xde20tBJieHOTTxpVLljwZUyH-K7rcTsRpdOwbBhzfUZ1XC0FBRp2TxuScPxRu8eOq6dQ1MC8Oc4gqKPzJpod4OmuHZ_9CMqsc2LQ1E_IfgaHDo0kleRs2-YAh-LBhcofpLrGTAg" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-label-sm text-label-sm text-secondary">Trang phục</span>
                                    <span
                                        className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">Quần
                                        Short Gym Co Giãn</span>
                                    <span className="font-data-mono text-label-sm text-on-surface font-bold">280.000
                                        đ</span>
                                </div>
                            </div>
                        </div>
                        {/* Bundle Pricing & CTA */}
                        <div
                            className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-lg">
                            <div className="flex items-baseline justify-between">
                                <span className="font-label-md text-label-md text-secondary">Giá mua lẻ 3 món:</span>
                                <span className="font-data-mono text-body-sm text-outline line-through">3.080.000 đ</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-label-lg text-label-lg text-on-surface font-bold">Giá ưu đãi trọn
                                    bộ:</span>
                                <div className="flex items-baseline gap-space-xs">
                                    <span
                                        className="font-headline-md text-headline-md text-error font-bold font-data-mono">2.618.000
                                        đ</span>
                                    <span
                                        className="font-data-mono text-[11px] bg-error text-on-error px-1 py-0.2 rounded font-bold">-15%</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-2.5 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded hover:bg-primary-container transition-colors flex items-center justify-center gap-space-xs mt-space-xs shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                Thêm cả bộ 3 sản phẩm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

</>
    );
}
