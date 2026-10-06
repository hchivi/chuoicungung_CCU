import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function SupplyChainExpoWidget() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-28 sm:top-36 z-30 select-none flex justify-end">
      <button
        type="button"
        onClick={() => navigate('/ngay-hoi-chuoi-cung-ung')}
        className="group relative flex flex-col items-center py-3.5 px-2 sm:px-2.5 bg-gradient-to-b from-red-600 via-rose-600 to-amber-500 hover:from-red-700 hover:via-rose-700 hover:to-amber-600 text-white rounded-l-2xl shadow-2xl shadow-red-950/40 border-y border-l border-white/40 cursor-pointer backdrop-blur-md transition-all duration-300 ease-out hover:-translate-x-1.5 hover:shadow-red-600/50"
        title={lang === 'en' ? "Supply Chain Expo - Click to view" : "Ngày hội Chuỗi Cung Ứng - Bấm để xem"}
      >
        {/* 1. Logo image 2 đưa ra trước (ở trên cùng của tab dọc) */}
        <div className="relative mb-2.5">
          <span className="animate-ping absolute -inset-0.5 rounded-full bg-white opacity-40" />
          <img 
            src="/logo_onlyc.png" 
            alt="CCU Logo" 
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain animate-[spin_8s_linear_infinite] drop-shadow-md relative z-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.png';
            }}
          />
        </div>

        {/* 2. CHUỖI CUNG ỨNG (nằm phía trên, sau NGÀY HỘI khi đọc từ dưới lên) */}
        <span 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          className="rotate-180 block font-black text-xs sm:text-[13px] uppercase tracking-wider text-amber-200 whitespace-nowrap drop-shadow-sm select-none py-1"
        >
          CHUỖI CUNG ỨNG
        </span>

        {/* 3. NGÀY HỘI (nằm ở dưới cùng, đọc đầu tiên khi đọc từ dưới lên) */}
        <span 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          className="rotate-180 block font-black text-xs sm:text-[13px] uppercase tracking-wider text-white whitespace-nowrap py-1 drop-shadow-sm select-none"
        >
          NGÀY HỘI
        </span>
      </button>
    </div>
  );
}
