"use client";

export default function StatsCard({ title, number, iconSrc, bottomImageSrc }) {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 px-3 group">
      <div className="border border-[#FFFFFF0F] rounded-[20px] p-7 bg-[#0A0A0A] min-h-[320px] flex flex-col justify-between">
        {/* Top section */}
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-bold w-35">{title}</h3>
            <div className="relative p-2.5 rounded-full">
              <div className="absolute inset-0 rounded-full scale-0 group-hover:scale-100  bg-[linear-gradient(120deg,#A93E17,#15399A)] transition-all duration-300 ease-in-out"></div>
              <img src={iconSrc}  alt={title + " icon"} className="relative z-10" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl mt-9 font-light">{number}</h2>
          </div>
        </div>

        {/* Bottom image */}
        <div>
          <img src={bottomImageSrc} alt={title + " illustration"} className="max-h-[80px]" />
        </div>
      </div>
    </div>
  );
}
