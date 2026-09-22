export default function SuccessCommitments() {
  const features = [
    {
      title: "Đổi size tận nơi 30 ngày",
      desc: "Không vừa chân, đổi lại miễn phí 100%.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Bảo hành thể thao 12 tháng",
      desc: "Cam kết chính hãng bằng mã kích hoạt AI.",
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Trực ban hỗ trợ 24/7",
      desc: "Hotline: 1900 6868 (Miễn cước).",
      icon: (
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
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
