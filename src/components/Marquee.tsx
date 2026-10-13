import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div className="bg-[#141517] border-b border-[#222428] py-2 overflow-hidden text-xs text-[#a1a1aa] tracking-wider uppercase select-none">
      <div className="flex w-max animate-pulse">
        <div className="flex items-center space-x-8 px-4 font-mono">
          <span>DROP 04 LIVE</span>
          <span className="text-[#52525b]">/</span>
          <span>FREE DOMESTIC CAMPUS DELIVERY OVER ₹1,999</span>
          <span className="text-[#52525b]">/</span>
          <span>STUDENT VERIFIED: USE CODE <strong className="text-white">COLLEGE10</strong> FOR 10% OFF</span>
          <span className="text-[#52525b]">/</span>
          <span>280-460 GSM CUSTOM HEAVYWEIGHT TEXTILES</span>
          <span className="text-[#52525b]">/</span>
          <span>PRE-SHRUNK ANTI-BACON COLLAR GUARANTEE</span>
          <span className="text-[#52525b]">/</span>
          <span>CAMPUS DORMS & HOSTEL EXPRESS SHIPPING</span>
          <span className="text-[#52525b]">/</span>
          <span>DROP 04 LIVE</span>
          <span className="text-[#52525b]">/</span>
          <span>FREE DOMESTIC CAMPUS DELIVERY OVER ₹1,999</span>
          <span className="text-[#52525b]">/</span>
          <span>STUDENT VERIFIED: USE CODE <strong className="text-white">COLLEGE10</strong> FOR 10% OFF</span>
        </div>
      </div>
    </div>
  );
};
