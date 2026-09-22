export default function PromotionsTimeline() {
  const timeSlots = [
    { time: "09:00 - 12:00", label: "ĐANG DIỄN RA", active: true },
    { time: "12:00 - 15:00", label: "SẮP DIỄN RA", active: false },
    { time: "15:00 - 18:00", label: "SẮP DIỄN RA", active: false },
    { time: "20:00 - 24:00", label: "ĐẠI TIỆC ĐÊM", active: false },
  ];

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden mb-8 flex flex-col sm:flex-row shadow-sm">
      {timeSlots.map((slot, index) => (
        <div 
          key={index} 
          className={`flex-1 py-3 px-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            slot.active ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <span className={`text-lg md:text-xl font-black ${slot.active ? 'text-white' : 'text-gray-300'}`}>
            {slot.time}
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5">
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}
