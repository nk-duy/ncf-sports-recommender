import React from "react";

interface Props {
    mainImage: string;
    setMainImage: (url: string) => void;
    productName: string;
}

export default function ProductGallery({ mainImage, setMainImage, productName }: Props) {
    return (
<>
                    {/* Left Column: Gallery (7 cols ~ 58%) */}
                    <div className="lg:col-span-7 flex flex-col gap-space-lg">
                        {/* Main Image Stage */}
                        <div
                            className="relative w-full aspect-square bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-space-md">
                            {/* Tag Badges */}
                            <div
                                className="absolute top-space-lg left-space-lg z-10 flex flex-col gap-space-xs items-start">
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-wider bg-on-surface text-surface px-space-md py-1 rounded font-bold shadow-sm">
                                    BEST SELLER 2025
                                </span>
                                <span
                                    className="font-data-mono text-label-sm uppercase tracking-wider bg-primary text-on-primary px-space-md py-1 rounded font-semibold shadow-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                                    ĐĨA ĐỆM CARBON FULL-LENGTH
                                </span>
                            </div>
                            {/* Zoom Toggle Action */}
                            <button
                                className="absolute top-space-lg right-space-lg z-10 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-sm"
                                id="zoomBtn" title="Phóng to ảnh">
                                <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                            </button>
                            {/* Primary Photo with dynamic src swapping */}
                            <img alt="Giày Chạy Bộ Marathon Carbon Alpha Pro"
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                id="mainProductImage"
                                src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                            <div
                                className="absolute bottom-space-md right-space-md bg-surface-container-lowest/80 backdrop-blur-sm px-space-sm py-0.5 rounded text-secondary font-data-mono text-label-sm">
                                Tỉ lệ 1:1 HD Studio
                            </div>
                        </div>
                        {/* Thumbnails Strip */}
                        <div className="grid grid-cols-4 gap-space-md" id="thumbnailStrip">
                            <button
                                className="thumb-btn active aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all bg-surface-container-high"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8">
                                <img alt="Màu Xanh Trắng Carbon" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8">
                                <img alt="Màu Đen Neon Stealth" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM">
                                <img alt="Màu Trail Explorer Xám" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1VCR2QaE57VqzkXi_DSFD51SWifz_oAburStL5co7ur7B_lU9f0M5Q4mcZSJNIAQXx4NOGscjC4PAtRf24PheJHk90V3HHnCFQTsI5IKt-EZkd_k9VPmM25qzqt2DJCkvSXvII7L748wyvtWa3WGm-e0RYZoRIkf0JGXeijNu4_3QA9bNdA0_OEQs6NSr8QGbfq2Yjlc4YJ5BHt69CS0SEs55lZIYcuXXx3pXcE9jONtxbgNMUBSyBhDVM" />
                            </button>
                            <button
                                className="thumb-btn aspect-square bg-surface-container-lowest rounded-lg p-space-xs overflow-hidden transition-all hover:bg-surface-container"
                                data-img="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI">
                                <img alt="Màu Trắng Pure White" className="w-full h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI" />
                            </button>
                        </div>
                    </div>

</>
    );
}
