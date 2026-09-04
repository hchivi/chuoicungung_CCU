import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function BrandLogo({ 
  variant = 'light', // 'light' (for white/light backgrounds) or 'dark' (for dark/blue footer backgrounds)
  size = 'md', // 'sm', 'md', 'lg'
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
      sloganTracking: '0.08em',
      gap: 'space-x-2 sm:space-x-2.5',
      mt: 'mt-0.5'
    },
    md: {
      imgHeight: 'h-9 sm:h-11 md:h-12',
      brandText: lang === 'en' ? 'text-xs sm:text-[13.5px] md:text-[15px]' : 'text-sm sm:text-[16px] md:text-[17.5px]',
      brandTracking: lang === 'en' ? '0.07em' : '0.265em',
      sloganText: 'text-[7.5px] sm:text-[8.5px] md:text-[9.5px]',
      sloganTracking: '0.085em',
      gap: 'space-x-2.5 sm:space-x-3.5',
      mt: 'mt-0.5 sm:mt-1'
    },
    lg: {
      imgHeight: 'h-12 sm:h-14 md:h-16',
      brandText: lang === 'en' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl md:text-2xl',
      brandTracking: lang === 'en' ? '0.07em' : '0.27em',
      sloganText: 'text-[9.5px] sm:text-[11px] md:text-[12px]',
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
      <img
        src="/logo_only.png"
        alt="Logo Chuỗi Cung Ứng"
        className={`${currentSize.imgHeight} w-auto object-contain flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/logo.png';
        }}
      />

      {/* 2. Text Brand Stack (Brand Name on top, Slogan below, centered, matched width) */}
      <div className="flex flex-col justify-center items-center text-center flex-shrink-0 leading-none">
        {/* Brand Name */}
        <span 
          className={`font-black font-heading uppercase ${brandColor} ${currentSize.brandText} leading-none whitespace-nowrap block text-center`}
          style={{ letterSpacing: currentSize.brandTracking }}
        >
          {brandName}
        </span>

        {/* Slogan */}
        <span 
          className={`font-black uppercase ${sloganColor} ${currentSize.sloganText} ${currentSize.mt} leading-none whitespace-nowrap block text-center`}
          style={{ letterSpacing: currentSize.sloganTracking }}
        >
          {sloganText}
        </span>
      </div>
    </div>
  );
}
