import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function BrandLogo({ 
  variant = 'light', // 'light' (for white/light backgrounds) or 'dark' (for dark/blue footer backgrounds)
  size = 'md', // 'sm', 'md', 'lg'
  badge = null, // e.g. 'AI'
  showAiInLogo = false, // renders 'AI' label inside the center of the flower logo
  showSuppiChainySubtitle = false, // renders 'SUPPI & CHAINY' with blue->pink transition & white '&'
  spin = false, // logo spinning animation (disabled for header by default)
  className = '' 
}) {
  const { lang } = useLanguage();

  // Brand Name Text
  const brandName = lang === 'en' ? 'SUPPLY CHAIN ECOSYSTEM' : 'CHUỖI CUNG ỨNG';
  // Slogan Text: Always in English across all languages as requested
  const sloganText = 'BEYOND CONNECTION. RIGHT PLACE.';

  // Sizing styles (Logo icon enlarged & slogan width calibrated to match brand text exactly)
  const sizeStyles = {
    sm: {
      imgHeight: 'h-10 sm:h-11',
      svgWidth: 'w-[165px] sm:w-[180px]',
      gap: 'space-x-2 sm:space-x-2.5',
    },
    md: {
      imgHeight: 'h-11 sm:h-12 md:h-13 lg:h-11 xl:h-[50px] 2xl:h-[52px]',
      svgWidth: 'w-[180px] sm:w-[210px] md:w-[230px] lg:w-[170px] xl:w-[215px] 2xl:w-[238px]',
      gap: 'space-x-2 sm:space-x-2.5 lg:space-x-1.5 xl:space-x-2.5 2xl:space-x-3.5',
    },
    lg: {
      imgHeight: 'h-14 sm:h-16 md:h-20',
      svgWidth: 'w-[235px] sm:w-[265px] md:w-[295px]',
      gap: 'space-x-3 sm:space-x-4',
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Colors matching user reference (CCU Dark Green #006039 on light, Pure White #ffffff on dark footer)
  const brandColorHex = variant === 'dark' ? '#ffffff' : '#006039';
  const sloganColorHex = variant === 'dark' ? '#F87171' : '#E53935';

  return (
    <div className={`inline-flex items-center ${currentSize.gap} group select-none ${className}`}>
      {/* 1. Logo Symbol (logo_only.png) */}
      <div className="relative inline-flex items-center justify-center flex-shrink-0">
        <img
          src="/logo_only.png"
          alt="Logo Chuỗi Cung Ứng"
          className={`${currentSize.imgHeight} w-auto object-contain flex-shrink-0 ${spin ? 'animate-logo-spin' : ''} transition-transform duration-300 group-hover:scale-105`}
          style={{ willChange: 'transform' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/logo.png';
          }}
        />
        {showAiInLogo && (
          <span 
            className="absolute inset-0 flex items-center justify-center font-black text-[#0052cc] pointer-events-none select-none"
            style={{ 
              fontSize: size === 'sm' ? '8px' : size === 'lg' ? '12px' : '9.5px',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}
          >
            AI
          </span>
        )}
      </div>

      {/* 2. Text Brand Stack */}
      {showSuppiChainySubtitle ? (
        <div className="flex flex-col justify-center items-center text-center flex-shrink-0 leading-none">
          <span 
            className="font-black uppercase tracking-[0.22em] text-sm sm:text-[16px] md:text-[17.5px]"
            style={{ color: brandColorHex, fontFamily: "'Space Grotesk', 'SpaceGrotesk', sans-serif" }}
          >
            {brandName}
          </span>
          <div className="w-full flex items-center justify-center gap-2 sm:gap-2.5 font-black uppercase text-[11.5px] sm:text-[12.5px] md:text-[13.5px] mt-1 select-none text-center">
            <span className="bg-gradient-to-r from-[#0084FF] to-[#00b4d8] bg-clip-text text-transparent font-black tracking-wider">
              SUPPI
            </span>
            <span 
              className="font-black px-0.5 select-none text-white"
              style={{ 
                textShadow: '0 0 1.5px #072348, 0 1px 2px rgba(7, 35, 72, 0.85), -1px -1px 0 #072348, 1px -1px 0 #072348, -1px 1px 0 #072348, 1px 1px 0 #072348',
              }}
            >
              &
            </span>
            <span className="bg-gradient-to-r from-[#f43f5e] to-[#ff2a85] bg-clip-text text-transparent font-black tracking-wider">
              CHAINY
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg 
            viewBox="0 0 240 38" 
            className={`${currentSize.svgWidth} h-auto overflow-visible block`}
            style={{ display: 'block' }}
          >
            {/* Top Line: CHUỖI CUNG ỨNG - Dark Green #006039 in Space Grotesk */}
            <text
              x="0"
              y="17"
              textLength="240"
              lengthAdjust="spacing"
              fill={brandColorHex}
              style={{
                fontFamily: "'Space Grotesk', 'SpaceGrotesk', sans-serif",
                fontWeight: 800,
                fontSize: '19.5px',
              }}
            >
              {brandName}
            </text>

            {/* Bottom Line: BEYOND CONNECTION. RIGHT PLACE. - Red, matching horizontal width exactly */}
            <text
              x="0"
              y="32.5"
              textLength="240"
              lengthAdjust="spacing"
              fill={sloganColorHex}
              style={{
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 800,
                fontSize: '9.2px',
              }}
            >
              {sloganText}
            </text>
          </svg>

          {badge && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs leading-none">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
