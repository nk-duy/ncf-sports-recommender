import React from "react";
import { Truck, RefreshCcw, ShieldCheck, Headset } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Truck size={24} />,
      title: "Miễn phí giao hàng",
      desc: "Đơn hàng từ 499.000đ",
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50"
    },
    {
      icon: <RefreshCcw size={24} />,
      title: "Đổi trả 30 ngày",
      desc: "Thủ tục nhanh gọn, tiện lợi",
      colorClass: "text-green-700",
      bgClass: "bg-green-50"
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "100% Chính hãng",
      desc: "Cam kết bồi thường 200%",
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50"
    },
    {
      icon: <Headset size={24} />,
      title: "Hotline 24/7",
      desc: "Tư vấn tận tình 1900 6868",
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50"
    },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors gap-4 group">
              <div className={`w-14 h-14 rounded-full ${feature.bgClass} ${feature.colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
