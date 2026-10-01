import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function BrandLogo({ 
  variant = 'light', // 'light' (for white/light backgrounds) or 'dark' (for dark/blue footer backgrounds)
  size = 'md', // 'sm', 'md', 'lg'
  badge = null, // e.g. 'AI'
  showAiInLogo = false, // renders 'AI' label inside the center of the flower logo
  showSuppiChainySubtitle = false, // renders 'SUPPI & CHAINY' with blue->pink transition & white '&'
  className = '' 
}) {
  const { lang } = useLanguage();

  // Brand Name Text
  const brandName = lang === 'en' ? 'SUPPLY CHAIN ECOSYSTEM' : 'CHUỖI CUNG ỨNG';
  // Slogan Text: Always in English across all languages as requested
  const sloganText = 'BEYOND CONNECTION. RIGHT PLACE.';

  // Sizing styles (Brand Name font size & tracking calibrated to match slogan width exactly)
  const sizeStyles = {
    sm: {
      imgHeight: 'h-8 sm:h-9',
      brandText: lang === 'en' ? 'text-[10px] sm:text-[11px]' : 'text-[12px] sm:text-[13.5px]',
      brandTracking: lang === 'en' ? '0.07em' : '0.27em',
      sloganText: 'text-[6.5px] sm:text-[7.5px]',
      suppiChainyText: 'text-[9.5px] sm:text-[10.5px]',
      sloganTracking: '0.08em',
      gap: 'space-x-2 sm:space-x-2.5',
      mt: 'mt-0.5'
    },
    md: {
      imgHeight: 'h-9 sm:h-11 md:h-12',
      brandText: lang === 'en' ? 'text-xs sm:text-[13.5px] md:text-[15px]' : 'text-sm sm:text-[16px] md:text-[17.5px]',
      brandTracking: lang === 'en' ? '0.07em' : '0.265em',
      sloganText: 'text-[7.5px] sm:text-[8.5px] md:text-[9.5px]',
      suppiChainyText: 'text-[11.5px] sm:text-[12.5px] md:text-[13.5px]',
      sloganTracking: '0.085em',
      gap: 'space-x-2.5 sm:space-x-3.5',
      mt: 'mt-0.5 sm:mt-1'
    },
    lg: {
      imgHeight: 'h-12 sm:h-14 md:h-16',
      brandText: lang === 'en' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl md:text-2xl',
      brandTracking: lang === 'en' ? '0.07em' : '0.27em',
      sloganText: 'text-[9.5px] sm:text-[11px] md:text-[12px]',
      suppiChainyText: 'text-[14px] sm:text-[15.5px] md:text-[17px]',
      sloganTracking: '0.085em',
      gap: 'space-x-3 sm:space-x-4',
      mt: 'mt-1 sm:mt-1.5'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Colors matching user reference (Image 1)
  const brandColor = variant === 'dark' 
    ? 'text-[#38bdf8]' // Bright sky blue on dark footer
    : 'text-[#0084FF]'; // Vibrant Blue as in user Image 1

  const sloganColor = variant === 'dark' 
    ? 'text-[#F87171]' // Vibrant soft red on dark
    : 'text-[#E53935]'; // Vibrant red as in user Image 1

  return (
    <div className={`inline-flex items-center ${currentSize.gap} group select-none ${className}`}>
      {/* 1. Logo Symbol (logo_only.png) */}
      <div className="relative inline-flex items-center justify-center flex-shrink-0">
        <img
          src="/logo_only.png"
          alt="Logo Chuỗi Cung Ứng"
          className={`${currentSize.imgHeight} w-auto object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/logo.png';
          }}
        />
        {showAiInLogo && (
          <span 
            className="absolute inset-0 flex items-center justify-center font-black font-heading text-[#0052cc] pointer-events-none select-none"
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

      {/* 2. Text Brand Stack (Brand Name on top, Slogan below, centered, matched width) */}
      <div className="flex flex-col justify-center items-center text-center flex-shrink-0 leading-none">
        {/* Brand Name + optional badge */}
        <div className="flex items-center gap-1.5 justify-center">
          <span 
            className={`font-black font-heading uppercase ${brandColor} ${currentSize.brandText} leading-none whitespace-nowrap block text-center`}
            style={{ letterSpacing: currentSize.brandTracking }}
          >
            {brandName}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-2xs leading-none">
              {badge}
            </span>
          )}
        </div>

        {/* Slogan or SUPPI & CHAINY (căn giữa & bold) */}
        {showSuppiChainySubtitle ? (
          <div 
            className={`w-full flex items-center justify-center gap-2 sm:gap-2.5 font-black font-heading uppercase ${currentSize.suppiChainyText} ${currentSize.mt} leading-none select-none text-center`}
          >
            <span 
              className="bg-gradient-to-r from-[#0084FF] to-[#00b4d8] bg-clip-text text-transparent font-black tracking-wider"
              style={{ 
                letterSpacing: '0.09em',
                WebkitTextStroke: '0.35px #0084FF',
                fontWeight: 900
              }}
            >
              SUPPI
            </span>
            <span 
              className="font-black px-0.5 select-none"
              style={{ 
                color: '#ffffff',
                textShadow: '0 0 1.5px #072348, 0 1px 2px rgba(7, 35, 72, 0.85), -1px -1px 0 #072348, 1px -1px 0 #072348, -1px 1px 0 #072348, 1px 1px 0 #072348',
                fontSize: '1em',
                fontWeight: 900,
                lineHeight: 1
              }}
            >
              &
            </span>
            <span 
              className="bg-gradient-to-r from-[#f43f5e] to-[#ff2a85] bg-clip-text text-transparent font-black tracking-wider"
              style={{ 
                letterSpacing: '0.09em',
                WebkitTextStroke: '0.35px #ff2a85',
                fontWeight: 900
              }}
            >
              CHAINY
            </span>
          </div>
        ) : (
          <span 
            className={`font-black uppercase ${sloganColor} ${currentSize.sloganText} ${currentSize.mt} leading-none whitespace-nowrap block text-center`}
            style={{ letterSpacing: currentSize.sloganTracking }}
          >
            {sloganText}
          </span>
        )}
      </div>
    </div>
  );
}
