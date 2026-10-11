import { ArrowRightLeft, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function SuccessCommitments() {
  const features = [
    {
      title: "Đổi size tận nơi 30 ngày",
      desc: "Không vừa chân, đổi lại miễn phí 100%.",
      icon: (
        <ArrowRightLeft className="w-5 h-5 text-blue-600" />
      )
    },
    {
      title: "Bảo hành thể thao 12 tháng",
      desc: "Cam kết chính hãng bằng mã kích hoạt AI.",
      icon: (
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
      )
    },
    {
      title: "Trực ban hỗ trợ 24/7",
      desc: "Hotline: 1900 6868 (Miễn cước).",
      icon: (
        <LifeBuoy className="w-5 h-5 text-gray-700" />
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
            {feature.icon}
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">{feature.title}</h4>
            <p className="text-[11px] text-gray-500">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
