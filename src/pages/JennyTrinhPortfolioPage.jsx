import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import * as THREE from 'three';
import {
  Share2,
  Download,
  QrCode,
  Copy,
  Check,
  Award,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Send,
  Boxes,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  PhoneCall,
  Shirt,
  Truck,
  ShoppingCart,
  Globe,
  Languages,
  MapPin,
  Landmark,
  Building2,
  DollarSign,
  Receipt
} from 'lucide-react';

// ========================================================
// AUTHENTIC REAL BRAND ICONS
// ========================================================

const ZaloOfficialLogo = ({ className = "w-12 h-12" }) => (
  <img
    src="/images/zalo_official.svg"
    alt="Zalo"
    className={`${className} object-contain shrink-0 drop-shadow-xs`}
  />
);

const WhatsAppOfficialLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path d="M34.5 13.5C31.7 10.7 28 9.2 24 9.2C15.8 9.2 9.2 15.8 9.2 24C9.2 26.6 9.9 29.2 11.2 31.5L9.3 38.7L16.7 36.8C18.9 38 21.4 38.7 24 38.7C32.2 38.7 38.8 32.1 38.8 23.9C38.8 19.9 37.3 16.2 34.5 13.5ZM24 36.2C21.7 36.2 19.5 35.6 17.6 34.5L17.1 34.2L12.7 35.4L13.9 31.1L13.6 30.6C12.4 28.6 11.7 26.3 11.7 24C11.7 17.2 17.2 11.7 24 11.7C27.3 11.7 30.4 13 32.7 15.3C35 17.6 36.3 20.7 36.3 24C36.3 30.7 30.8 36.2 24 36.2ZM30.7 26.9C30.3 26.7 28.5 25.8 28.1 25.7C27.8 25.5 27.6 25.5 27.3 25.8C27.1 26.2 26.4 27 26.2 27.2C26 27.5 25.8 27.5 25.4 27.3C25 27.1 23.8 26.7 22.3 25.4C21.2 24.4 20.4 23.1 20.2 22.8C20 22.4 20.2 22.2 20.4 22C20.6 21.8 20.8 21.5 21 21.3C21.2 21.1 21.3 20.9 21.4 20.7C21.5 20.5 21.5 20.3 21.4 20.1C21.3 19.9 20.6 18.2 20.3 17.5C20 16.8 19.7 16.9 19.5 16.9H18.8C18.6 16.9 18.2 17 17.9 17.3C17.6 17.6 16.7 18.5 16.7 20.3C16.7 22.1 18 23.8 18.2 24.1C18.4 24.3 20.7 27.9 24.3 29.4C25.2 29.8 25.8 30 26.4 30.2C27.3 30.5 28.1 30.5 28.7 30.4C29.4 30.3 30.9 29.5 31.2 28.6C31.5 27.7 31.5 27 31.4 26.9C31.3 26.8 31.1 26.8 30.7 26.9Z" fill="white" />
  </svg>
);

const FacebookOfficialLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path d="M29.5 24.8L30.3 19.6H25.3V16.2C25.3 14.8 26 13.4 28.2 13.4H30.5V8.98C30.5 8.98 28.4 8.62 26.4 8.62C22.3 8.62 19.5 11.1 19.5 15.6V19.6H15V24.8H19.5V37.4C20.4 37.54 21.3 37.62 22.3 37.62C23.3 37.62 24.2 37.54 25.1 37.4V24.8H29.5Z" fill="white" />
  </svg>
);

const GoogleMapsPinOfficial = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <rect width="48" height="48" rx="14" fill="#FEE2E2" />
    <path d="M24 10C17.925 10 13 14.925 13 21C13 29.25 24 38 24 38C24 38 35 29.25 35 21C35 14.925 30.075 10 24 10ZM24 25.5C21.515 25.5 19.5 23.485 19.5 21C19.5 18.515 21.515 16.5 24 16.5C26.485 16.5 28.5 18.515 28.5 21C28.5 23.485 26.485 25.5 24 25.5Z" fill="#EA4335" />
    <circle cx="24" cy="21" r="3.5" fill="#FFFFFF" />
  </svg>
);

const PhoneOfficialIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <rect width="48" height="48" rx="14" fill="#DCFCE7" />
    <path d="M33.2 27.8C31.8 27.8 30.4 27.6 29.1 27.1C28.7 27 28.2 27.1 27.9 27.4L25.7 29.6C22.6 28 20 25.4 18.4 22.3L20.6 20.1C20.9 19.8 21 19.3 20.9 18.9C20.4 17.6 20.2 16.2 20.2 14.8C20.2 14.1 19.6 13.5 18.9 13.5H15.4C14.7 13.5 14 14.1 14 14.8C14 25.4 22.6 34 33.2 34C33.9 34 34.5 33.3 34.5 32.6V29.1C34.5 28.4 33.9 27.8 33.2 27.8Z" fill="#006938" />
  </svg>
);

const MailOfficialIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <rect width="48" height="48" rx="14" fill="#ECFDF5" />
    <path d="M34 14H14C12.9 14 12 14.9 12 16V32C12 33.1 12.9 34 14 34H34C35.1 34 36 33.1 36 32V16C36 14.9 35.1 14 34 14ZM33.2 18.2L24 24L14.8 18.2C14.4 17.9 14.3 17.4 14.6 17C14.9 16.6 15.4 16.5 15.8 16.8L24 22L32.2 16.8C32.6 16.5 33.1 16.6 33.4 17C33.7 17.4 33.6 17.9 33.2 18.2Z" fill="#006938" />
  </svg>
);

const GlobeOfficialIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <rect width="48" height="48" rx="14" fill="#F0FDF4" />
    <path d="M24 12C17.37 12 12 17.37 12 24C12 30.63 17.37 36 24 36C30.63 36 36 30.63 36 24C36 17.37 30.63 12 24 12ZM32.93 22H27.95C27.76 18.66 26.83 15.63 25.43 14.28C28.77 15.46 31.42 18.36 32.93 22ZM24 14.06C25.32 15.67 26.25 18.67 26.43 22H21.57C21.75 18.67 22.68 15.67 24 14.06ZM15.07 26H20.05C20.24 29.34 21.17 32.37 22.57 33.72C19.23 32.54 16.58 29.64 15.07 26ZM20.05 22H15.07C16.58 18.36 19.23 15.46 22.57 14.28C21.17 15.63 20.24 18.66 20.05 22ZM24 33.94C22.68 32.33 21.75 29.33 21.57 26H26.43C26.25 29.33 25.32 32.33 24 33.94ZM27.95 26H32.93C31.42 29.64 28.77 32.54 25.43 33.72C26.83 32.37 27.76 29.34 27.95 26Z" fill="#006938" />
  </svg>
);

const MessengerOfficialLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <defs>
      <linearGradient id="messengerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00B2FE" />
        <stop offset="50%" stopColor="#006AFF" />
        <stop offset="100%" stopColor="#9B35FF" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="24" fill="url(#messengerGrad)" />
    <path d="M12 23.5C12 16.6 17.4 11 24 11C30.6 11 36 16.6 36 23.5C36 30.4 30.6 36 24 36C22.6 36 21.2 35.7 20 35.2L13 37L14.8 30.5C13 28.5 12 26.1 12 23.5ZM22.5 26.5L25.8 23L32 26.5L25.5 19.5L22.2 23L16 19.5L22.5 26.5Z" fill="white" />
  </svg>
);

const SmsOfficialIcon = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0 drop-shadow-xs`}>
    <circle cx="24" cy="24" r="24" fill="#10B981" />
    <path d="M16 15H32C33.1 15 34 15.9 34 17V27C34 28.1 33.1 29 32 29H20L14 34V17C14 15.9 14.9 15 16 15Z" fill="white" />
    <circle cx="20" cy="22" r="1.5" fill="#10B981" />
    <circle cx="24" cy="22" r="1.5" fill="#10B981" />
    <circle cx="28" cy="22" r="1.5" fill="#10B981" />
  </svg>
);

// Reusable Ecosystem Brand Card Component
const EcosystemCard = ({
  brand,
  visitText = "Truy cập hệ thống",
  downloadText = "Tải Catalogue",
  showDownloadButton = false,
  customDownloadButton = null
}) => (
  <div
    className="group relative h-full p-3.5 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs sm:shadow-md shadow-slate-900/5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-[#006938] hover:shadow-xl hover:shadow-[#006938]/15 hover:ring-2 hover:ring-[#006938]/20 hover:bg-gradient-to-b hover:from-white hover:to-[#f0fdf4]/50 hover:-translate-y-1.5"
  >
    {/* High-res Logo Canvas Container as clickable link to website */}
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      className="h-20 sm:h-24 md:h-28 w-full flex items-center justify-center p-2 bg-transparent flex-1 cursor-pointer transition-transform duration-300 hover:scale-105"
      title={`${visitText} ${brand.domain || brand.name} (${brand.url})`}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="max-h-14 sm:max-h-16 md:max-h-20 w-auto max-w-[85%] sm:max-w-[90%] object-contain filter group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
      />
    </a>

    {/* Website Icon + Domain Link */}
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      className="pt-2 sm:pt-2.5 w-full flex items-center justify-center gap-1.5 min-w-0 shrink-0 cursor-pointer group/link hover:opacity-80 transition-opacity"
      title={`${visitText} ${brand.domain || brand.name} (${brand.url})`}
    >
      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#006938] shrink-0 group-hover/link:scale-110 transition-transform duration-300" />
      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#006938] transition-colors font-heading tracking-tight lowercase truncate">
        {brand.domain || brand.url.replace(/^https?:\/\//, '')}
      </span>
    </a>

    {/* Custom Download Button (e.g. The Taho Way for Tahomart) */}
    {customDownloadButton && (
      <div className="pt-3 w-full shrink-0 flex justify-center">
        {customDownloadButton}
      </div>
    )}

    {/* Optional Default Catalogue Download Button */}
    {showDownloadButton && brand.catalogueUrl && !customDownloadButton && (
      <div className="pt-3 w-full shrink-0">
        <a
          href={brand.catalogueUrl}
          download={brand.catalogueFileName || `${brand.name}_Catalogue.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#006938] via-[#007a41] to-[#00542c] hover:from-[#00542c] hover:to-[#003d20] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md shadow-[#006938]/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          title={`${downloadText} - ${brand.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="font-heading tracking-tight">{downloadText}</span>
        </a>
      </div>
    )}
  </div>
);

// Reusable Bank Logo Card Component (Logo Only)
const BankCard = ({ bank, onSelect, className = "" }) => (
  <button
    type="button"
    onClick={() => onSelect(bank)}
    className={`group relative p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs sm:shadow-md shadow-slate-900/5 flex items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-[#006938] hover:shadow-xl hover:shadow-[#006938]/15 hover:ring-2 hover:ring-[#006938]/20 hover:bg-gradient-to-b hover:from-white hover:to-[#f0fdf4]/50 hover:-translate-y-1 active:scale-95 shrink-0 ${className}`}
    title={`Xem mã QR - ${bank.bankName}`}
  >
    <div className="h-14 sm:h-16 w-full flex items-center justify-center p-1 bg-transparent pointer-events-none">
      <img
        src={bank.logo}
        alt={bank.bankName}
        className="max-h-11 sm:max-h-14 w-auto max-w-[88%] object-contain filter group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
      />
    </div>
  </button>
);

// Global Registry for synchronizing font sizes across title groups (e.g. mobile ecosystem headings)
const autoFitSyncGroups = new Map();

// Auto-Fitting Rainbow Heading Component (Supports single/multi-line & group font-size synchronization)
const AutoFitTitle = ({ text, lines, maxFontSize = 26, minFontSize = 10, syncGroup = null, className = "" }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const idRef = useRef(Symbol());

  const titleLines = lines && lines.length > 0 ? lines : (text ? [text] : []);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!containerRef.current || !textRef.current) return;

      // Test at maxFontSize to determine true natural scroll width
      textRef.current.style.fontSize = `${maxFontSize}px`;

      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth <= 0) return;

      const lineElements = textRef.current.querySelectorAll('.autofit-line');
      let maxLineWidth = textRef.current.scrollWidth;

      if (lineElements.length > 0) {
        maxLineWidth = Math.max(...Array.from(lineElements).map(el => el.scrollWidth));
      }

      let targetSize = maxFontSize;
      if (maxLineWidth > containerWidth) {
        const scale = containerWidth / maxLineWidth;
        targetSize = Math.max(minFontSize, Math.floor(maxFontSize * scale * 0.98));
      }

      if (syncGroup) {
        if (!autoFitSyncGroups.has(syncGroup)) {
          autoFitSyncGroups.set(syncGroup, new Map());
        }
        const groupMap = autoFitSyncGroups.get(syncGroup);
        groupMap.set(idRef.current, {
          targetSize,
          applySize: (finalSize) => {
            if (textRef.current) {
              textRef.current.style.fontSize = `${finalSize}px`;
            }
          }
        });

        // Calculate synchronized minimum font size among all members of the group
        const allSizes = Array.from(groupMap.values()).map(item => item.targetSize);
        const unifiedSize = Math.min(...allSizes);

        // Apply synchronized font size to all members
        groupMap.forEach(item => {
          item.applySize(unifiedSize);
        });
      } else {
        textRef.current.style.fontSize = `${targetSize}px`;
      }
    };

    adjustFontSize();
    const ro = new ResizeObserver(adjustFontSize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', adjustFontSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', adjustFontSize);
      if (syncGroup && autoFitSyncGroups.has(syncGroup)) {
        const groupMap = autoFitSyncGroups.get(syncGroup);
        groupMap.delete(idRef.current);
        if (groupMap.size === 0) {
          autoFitSyncGroups.delete(syncGroup);
        }
      }
    };
  }, [text, JSON.stringify(lines), maxFontSize, minFontSize, syncGroup]);

  return (
    <div ref={containerRef} className="w-full min-w-0 overflow-hidden flex items-center">
      <div
        ref={textRef}
        className={`w-full flex flex-col justify-center text-rainbow-gradient font-black uppercase tracking-tight py-0.5 leading-[1.12] ${className}`}
        style={{ fontSize: `${maxFontSize}px` }}
      >
        {titleLines.map((line, idx) => (
          <span key={idx} className="autofit-line block whitespace-nowrap overflow-hidden">
            {line}
          </span>
        ))}
      </div>
    </div>
  );
};

// Auto-Fitting Executive Name Heading that dynamically scales font-size to fit container width on mobile
const AutoFitNameHeading = ({ children, maxFontSize = 30, minFontSize = 11, className = "" }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!containerRef.current || !textRef.current) return;

      // Temporarily set font size to max to measure natural unconstrained scroll width
      textRef.current.style.fontSize = `${maxFontSize}px`;

      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth <= 0) return;

      const textWidth = textRef.current.scrollWidth;
      if (textWidth > 0) {
        if (textWidth > containerWidth) {
          const ratio = containerWidth / textWidth;
          const target = Math.max(minFontSize, Math.floor(maxFontSize * ratio * 0.96));
          setFontSize(target);
          textRef.current.style.fontSize = `${target}px`;
        } else {
          setFontSize(maxFontSize);
          textRef.current.style.fontSize = `${maxFontSize}px`;
        }
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(adjustFontSize);
    }
    adjustFontSize();

    const ro = new ResizeObserver(adjustFontSize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', adjustFontSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', adjustFontSize);
    };
  }, [maxFontSize, minFontSize]);

  return (
    <div ref={containerRef} className="w-full max-w-full overflow-hidden flex items-center justify-center lg:justify-start">
      <div className="animated-underline-6colors pb-1 inline-block max-w-full">
        <h1
          ref={textRef}
          className={`font-black text-slate-900 font-heading tracking-tight leading-tight whitespace-nowrap ${className}`}
          style={{ fontSize: fontSize ? `${fontSize}px` : 'clamp(13px, 4.2vw, 30px)' }}
        >
          {children}
        </h1>
      </div>
    </div>
  );
};

// ========================================================
// LANGUAGES LIST & TRANSLATION DICTIONARIES
// ========================================================
const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', short: 'VI' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'zh', label: '中文 (简体)', flag: '🇨🇳', short: 'ZH' },
  { code: 'ja', label: '日本語', flag: '🇯🇵', short: 'JA' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', short: 'KO' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭', short: 'TH' }
];

const translations = {
  vi: {
    greeting: "Xin chào, Tôi là",
    nameTitle: "NGUYỄN THỊ HÀ TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    company: "CHUỖI CUNG ỨNG",
    share: "Chia sẻ",
    copied: "Đã copy",
    saveContact: "Lưu DB",
    saveShort: "LƯU",
    flipQr: "Mã QR",
    introBadge: "JENNY TRINH",
    introMessage: "Kết nối và đồng hành cùng đối tác, khách hàng trong lĩnh vực may đồng phục nhân viên, trang thiết bị bảo hộ lao động và quà tặng doanh nghiệp, hướng đến các giải pháp tối ưu, chất lượng và hợp tác bền vững nhất.",
    addressLabel: "Địa Chỉ",
    phoneLabel: "Điện Thoại",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "Email",
    websiteLabel: "Website",
    openMaps: "Mở Google Maps",
    copyAddress: "Sao chép địa chỉ",
    callDirect: "Gọi ngay",
    chatZalo: "Chat Zalo",
    connectBtn: "Facebook",
    copyPhone: "Sao chép số điện thoại",
    copyEmail: "Sao chép email",
    visitWebsite: "Truy cập website",
    flipToBackNotice: "Click để lật xem Mã QR Danh Thiếp",
    flipToFrontNotice: "Chạm hoặc click để lật lại ảnh đại diện",
    scanCameraNotice: "Quét camera để lưu & mở danh thiếp",
    visitSystem: "Truy cập hệ thống",
    downloadCatalogue: "Tải Catalogue",

    // Ecosystems
    garmentTitle: "HỆ SINH THÁI MAY MẶC, ĐỒNG PHỤC VÀ QUÀ TẶNG DOANH NGHIỆP",
    garmentTitleLine1: "HỆ SINH THÁI MAY MẶC, ĐỒNG PHỤC",
    garmentTitleLine2: "VÀ QUÀ TẶNG DOANH NGHIỆP",
    garmentKeywords1: ["may đo", "đồng phục nhân viên", "bảo hộ lao động"],
    garmentKeywords2: ["quà tặng doanh nghiệp", "túi vải", "balo", "nón mũ"],

    logisticsTitle: "HỆ SINH THÁI GIAO NHẬN LOGISTIC",
    logisticsTitleLine1: "HỆ SINH THÁI GIAO NHẬN",
    logisticsTitleLine2: "LOGISTIC",
    logisticsKeywords1: ["vận tải đường biển", "vận tải hàng không"],
    logisticsKeywords2: ["vận tải đường bộ", "chuyển phát nhanh"],

    retailTitle: "HỆ SINH THÁI SIÊU THỊ BÁN LẺ",
    retailTitleLine1: "HỆ SINH THÁI",
    retailTitleLine2: "SIÊU THỊ BÁN LẺ",
    retailKeywords: ["hàng tiêu dùng", "văn phòng phẩm", "giỏ quà tặng"],

    // Sticky bottom bar
    callNow: "Gọi Ngay",
    mobileChatZalo: "Chat Zalo",
    saveVCard: "Lưu DB",
    mobileQr: "Mã QR",

    // QR Modal
    qrModalBadge: "MÃ QR DANH THIẾP ĐIỆN TỬ",
    qrModalScanNotice: "Sử dụng camera để quét mã mở danh thiếp",
    qrModalDownloadBtn: "Tải Danh Bạ",

    // Contact Modal
    contactModalBadge: "KẾT NỐI TRỰC TIẾP",
    contactModalTitle: "Gửi Lời Nhắn Đến",
    contactModalSubtitle: "Thông điệp sẽ được chuyển thẳng đến ban thư ký & lãnh đạo",
    contactNameLabel: "Họ và tên của bạn",
    contactNamePlaceholder: "VD: Nguyễn Văn A",
    contactPhoneLabel: "Số điện thoại / Zalo",
    contactPhonePlaceholder: "VD: 0912 345 678",
    contactContentLabel: "Nội dung hợp tác / Trao đổi",
    contactContentPlaceholder: "Nhập nội dung cần kết nối hoặc đề xuất hợp tác...",
    contactSendBtn: "Gửi Lời Nhắn",
    contactSentSuccessTitle: "Đã gửi thành công!",
    contactSentSuccessDesc: "Cảm ơn bạn. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",

    // Share Modal
    shareModalBadge: "CHIA SẺ DANH THIẾP",
    shareModalTitle: "Chia Sẻ Danh Thiếp Điện Tử",
    shareModalSubtitle: "Gửi danh thiếp Nguyễn Thị Hà Trinh đến bạn bè & đối tác",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "Gửi tin nhắn Zalo",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "Đăng lên bảng tin Facebook",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "Gửi qua Messenger",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "Gửi qua WhatsApp",
    shareViaSms: "Tin Nhắn SMS",
    shareViaSmsSub: "Mở ứng dụng tin nhắn điện thoại",
    shareCopyLinkBtn: "Sao Chép",
    shareCopiedSuccess: "Đã sao chép liên kết vào bộ nhớ tạm!",

    // Bank & QR Payment
    bankTitle: "THÔNG TIN TÀI KHOẢN NGÂN HÀNG",
    bankCompanyTitle: "TÀI KHOẢN NGÂN HÀNG CÔNG TY",
    bankPersonalTitle: "TÀI KHOẢN NGÂN HÀNG CÁ NHÂN",
    companyInfoTitle: "THÔNG TIN XUẤT HOÁ ĐƠN",
    bankKeywords: ["chuyển khoản nhanh 24/7", "quét mã vietqr", "napas 247", "chạm xem mã qr"],
    bankTapToViewQr: "Xem mã QR",
    bankAccountNum: "Số TK",
    bankAccountHolder: "Chủ TK",
    bankBranchLabel: "Chi nhánh",
    bankModalTitle: "Quét Mã QR Chuyển Khoản",
    bankModalScanDesc: "Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ để quét mã chuyển tiền nhanh 24/7",
    bankCopiedSuccess: "Đã sao chép số tài khoản!",
    bankDownloadQr: "Tải ảnh QR"
  },
  en: {
    greeting: "Hello, I am",
    nameTitle: "NGUYEN THI HA TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    title: "Director",
    company: "VIETNAM SUPPLY CHAIN",
    share: "Share",
    copied: "Copied",
    saveContact: "Save Contact",
    saveShort: "SAVE",
    flipQr: "QR Code",
    introBadge: "JENNY TRINH",
    introMessage: "Connecting and partnering with businesses and clients in staff uniforms, work safety equipment, and corporate gifts, striving for optimal solutions, quality, and the most sustainable cooperation.",
    addressLabel: "Headquarters Address",
    phoneLabel: "Phone Number",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "Email",
    websiteLabel: "Website",
    openMaps: "Open Google Maps",
    copyAddress: "Copy address",
    callDirect: "Call Now",
    chatZalo: "Chat Zalo",
    connectBtn: "Connect",
    copyPhone: "Copy phone number",
    copyEmail: "Copy email",
    visitWebsite: "Visit website",
    flipToBackNotice: "Click to flip and view Digital Contact QR",
    flipToFrontNotice: "Tap or click to flip back to portrait photo",
    scanCameraNotice: "Scan with camera to save & open contact card",
    visitSystem: "Visit website",
    downloadCatalogue: "Download Catalogue",

    // Ecosystems
    garmentTitle: "GARMENT, UNIFORM & CORPORATE GIFTS ECOSYSTEM",
    garmentTitleLine1: "GARMENT & UNIFORM",
    garmentTitleLine2: "CORPORATE GIFTS ECOSYSTEM",
    garmentKeywords1: ["tailoring", "staff uniforms", "labor protection"],
    garmentKeywords2: ["corporate gifts", "canvas bags", "backpacks", "caps & hats"],

    logisticsTitle: "LOGISTICS & FREIGHT FORWARDING ECOSYSTEM",
    logisticsTitleLine1: "LOGISTICS & FREIGHT",
    logisticsTitleLine2: "FORWARDING ECOSYSTEM",
    logisticsKeywords1: ["ocean freight", "air freight"],
    logisticsKeywords2: ["road transport", "express delivery"],

    retailTitle: "RETAIL SUPERMARKET ECOSYSTEM",
    retailTitleLine1: "RETAIL SUPERMARKET",
    retailTitleLine2: "ECOSYSTEM",
    retailKeywords: ["consumer goods", "stationery", "gift hampers"],

    // Sticky bottom bar
    callNow: "Call Now",
    mobileChatZalo: "Chat Zalo",
    saveVCard: "Save Contact",
    mobileQr: "QR Code",

    // QR Modal
    qrModalBadge: "DIGITAL CONTACT QR CODE",
    qrModalScanNotice: "Use your phone camera to scan and save contact",
    qrModalDownloadBtn: "Download VCF Contact",

    // Contact Modal
    contactModalBadge: "DIRECT CONNECT",
    contactModalTitle: "Send a Message to",
    contactModalSubtitle: "Your message will be sent directly to executive office",
    contactNameLabel: "Your full name",
    contactNamePlaceholder: "e.g. John Doe",
    contactPhoneLabel: "Phone number / WhatsApp",
    contactPhonePlaceholder: "e.g. +84 903 041 286",
    contactContentLabel: "Collaboration message",
    contactContentPlaceholder: "Enter your message or collaboration inquiry...",
    contactSendBtn: "Send Message",
    contactSentSuccessTitle: "Message sent successfully!",
    contactSentSuccessDesc: "Thank you. We will respond to you shortly.",

    // Share Modal
    shareModalBadge: "SHARE CONTACT",
    shareModalTitle: "Share Digital Business Card",
    shareModalSubtitle: "Share Nguyễn Thị Hà Trinh's digital card with partners & friends",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "Share via Zalo chat",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "Share to Facebook feed",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "Send via Messenger",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "Send via WhatsApp",
    shareViaSms: "SMS Message",
    shareViaSmsSub: "Open default messaging app",
    shareCopyLinkBtn: "Copy Link",
    shareCopiedSuccess: "Link copied to clipboard successfully!",

    // Bank & QR Payment
    bankTitle: "BANK ACCOUNTS & PAYMENT QR",
    bankCompanyTitle: "COMPANY BANK ACCOUNT",
    bankPersonalTitle: "PERSONAL BANK ACCOUNT",
    companyInfoTitle: "COMPANY INFORMATION",
    bankKeywords: ["vietqr transfer", "instant 24/7", "napas 247", "tap to view qr"],
    bankTapToViewQr: "View QR Code",
    bankAccountNum: "Acc No.",
    bankAccountHolder: "Account Name",
    bankBranchLabel: "Branch",
    bankModalTitle: "Scan QR For Transfer",
    bankModalScanDesc: "Open any banking or e-wallet app to scan and transfer instantly 24/7",
    bankCopiedSuccess: "Account number copied!",
    bankDownloadQr: "Download QR Code"
  },
  zh: {
    greeting: "您好，我是",
    nameTitle: "NGUYEN THI HA TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    title: "董事",
    company: "越南供应链",
    share: "分享",
    copied: "已复制",
    saveContact: "保存联系人",
    saveShort: "保存",
    flipQr: "二维码",
    introBadge: "JENNY TRINH",
    introMessage: "携手服装制造、高端员工制服、企业商务礼品领域的合作伙伴与客户，致力于提供最优的生产解决方案、卓越品质与可持续合作。",
    addressLabel: "总部地址",
    phoneLabel: "电话号码",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "电子邮箱",
    websiteLabel: "官方网站",
    openMaps: "打开谷歌地图",
    copyAddress: "复制地址",
    callDirect: "立即致电",
    chatZalo: "Zalo 聊天",
    connectBtn: "直接联系",
    copyPhone: "复制电话号码",
    copyEmail: "复制邮箱",
    visitWebsite: "访问网站",
    flipToBackNotice: "点击翻转查看名片二维码",
    flipToFrontNotice: "轻触或点击翻转回个人照片",
    scanCameraNotice: "使用手机相机扫描保存名片",
    visitSystem: "访问系统",
    downloadCatalogue: "下载宣传册",

    // Ecosystems
    garmentTitle: "服装定制、员工制服与商务礼品生态系统",
    garmentTitleLine1: "服装定制、员工制服",
    garmentTitleLine2: "与商务礼品生态系统",
    garmentKeywords1: ["高级定制", "员工制服", "劳保用品"],
    garmentKeywords2: ["企业商务礼品", "帆布袋", "双肩包", "帽子定制"],

    logisticsTitle: "国际货运代理与综合物流生态系统",
    logisticsTitleLine1: "国际货运代理",
    logisticsTitleLine2: "与综合物流生态系统",
    logisticsKeywords1: ["海运货运", "航空货运"],
    logisticsKeywords2: ["陆路运输", "国际特快专递"],

    retailTitle: "超级市场与零售连锁生态系统",
    retailTitleLine1: "超级市场与零售",
    retailTitleLine2: "连锁生态系统",
    retailKeywords: ["快消品", "办公用品", "企业礼品篮"],

    // Sticky bottom bar
    callNow: "立即致电",
    mobileChatZalo: "Zalo 聊天",
    saveVCard: "保存名片",
    mobileQr: "二维码",

    // QR Modal
    qrModalBadge: "电子名片二维码",
    qrModalScanNotice: "使用手机相机或扫码软件扫描保存联系人",
    qrModalDownloadBtn: "下载 VCF 名片",

    // Contact Modal
    contactModalBadge: "直接联系",
    contactModalTitle: "发送信息至",
    contactModalSubtitle: "信息将直接发送至秘书处与管理层",
    contactNameLabel: "您的姓名",
    contactNamePlaceholder: "例: 张先生 / 李女士",
    contactPhoneLabel: "电话号码 / WhatsApp",
    contactPhonePlaceholder: "例: +84 903 041 286",
    contactContentLabel: "合作内容 / 咨询",
    contactContentPlaceholder: "请输入合作意向或咨询内容...",
    contactSendBtn: "发送信息",
    contactSentSuccessTitle: "发送成功！",
    contactSentSuccessDesc: "感谢您的联系。我们将尽快与您取得联系。",

    // Share Modal
    shareModalBadge: "分享名片",
    shareModalTitle: "分享数字名片",
    shareModalSubtitle: "将杜玉勇的电子名片分享给合作伙伴与朋友",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "通过 Zalo 发送",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "分享到 Facebook",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "通过 Messenger 发送",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "通过 WhatsApp 发送",
    shareViaSms: "手机短信",
    shareViaSmsSub: "打开手机短信发送",
    shareCopyLinkBtn: "复制链接",
    shareCopiedSuccess: "已成功复制名片链接！",

    // Bank & QR Payment
    bankTitle: "银行账户与扫码支付",
    bankCompanyTitle: "公司银行账户",
    bankPersonalTitle: "个人银行账户",
    companyInfoTitle: "公司信息",
    bankKeywords: ["24/7 快速转账", "VietQR 扫码", "Napas 247", "点击查看二维码"],
    bankTapToViewQr: "查看二维码",
    bankAccountNum: "账号",
    bankAccountHolder: "户名",
    bankBranchLabel: "开户行",
    bankModalTitle: "扫描二维码转账",
    bankModalScanDesc: "打开任意手机银行或电子钱包扫描二维码即可 24/7 快速转账",
    bankCopiedSuccess: "已复制银行账号！",
    bankDownloadQr: "下载二维码图片"
  },
  ja: {
    greeting: "こんにちは、私は",
    nameTitle: "NGUYEN THI HA TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    title: "取締役 / ディレクター",
    company: "ベトナム・サプライチェーン",
    share: "共有",
    copied: "コピー完了",
    saveContact: "連絡先を保存",
    saveShort: "保存",
    flipQr: "QRコード",
    introBadge: "JENNY TRINH",
    introMessage: "アパレル製造、高品質ユニフォーム、企業ギフトの分野において、最適な生産ソリューション、卓越した品質、持続可能な協力を目指し、パートナーやお客様と連携・協働しています。",
    addressLabel: "本社住所",
    phoneLabel: "電話番号",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "メール",
    websiteLabel: "ウェブサイト",
    openMaps: "Googleマップを開く",
    copyAddress: "住所をコピー",
    callDirect: "今すぐ電話",
    chatZalo: "Zaloチャット",
    connectBtn: "お問い合わせ",
    copyPhone: "電話番号をコピー",
    copyEmail: "メールをコピー",
    visitWebsite: "サイトを訪問",
    flipToBackNotice: "クリックで名刺QRコードを表示",
    flipToFrontNotice: "タップまたはクリックで写真に戻る",
    scanCameraNotice: "スマホのカメラでスキャンして連絡先を保存",
    visitSystem: "システムへ移動",
    downloadCatalogue: "カタログをダウンロード",

    // Ecosystems
    garmentTitle: "アパレル・ユニフォーム・企業ギフト エコシステム",
    garmentTitleLine1: "アパレル・ユニフォーム",
    garmentTitleLine2: "企業ギフト エコシステム",
    garmentKeywords1: ["オーダーメイド", "社員用ユニフォーム", "労働安全用品"],
    garmentKeywords2: ["企業向けギフト", "キャンバスバッグ", "バックパック", "帽子・キャップ"],

    logisticsTitle: "国際貨物輸送＆ロジスティクス エコシステム",
    logisticsTitleLine1: "国際貨物輸送＆",
    logisticsTitleLine2: "ロジスティクス エコシステム",
    logisticsKeywords1: ["海上輸送", "航空貨物輸送"],
    logisticsKeywords2: ["陸上輸送", "国際スピード郵便"],

    retailTitle: "スーパーマーケット＆小売チェーン エコシステム",
    retailTitleLine1: "スーパーマーケット＆",
    retailTitleLine2: "小売チェーン エコシステム",
    retailKeywords: ["日用品・消費財", "オフィス用品・文具", "ギフトセット"],

    // Sticky bottom bar
    callNow: "今すぐ電話",
    mobileChatZalo: "Zaloチャット",
    saveVCard: "連絡先保存",
    mobileQr: "QRコード",

    // QR Modal
    qrModalBadge: "デジタル名刺 QRコード",
    qrModalScanNotice: "スマートフォンのカメラでQRコードをスキャンしてください",
    qrModalDownloadBtn: "VCF名刺をダウンロード",

    // Contact Modal
    contactModalBadge: "ダイレクト連絡",
    contactModalTitle: "メッセージを送信",
    contactModalSubtitle: "メッセージは経営陣および事務局に直接届きます",
    contactNameLabel: "お名前",
    contactNamePlaceholder: "例：山田 太郎",
    contactPhoneLabel: "電話番号 / WhatsApp",
    contactPhonePlaceholder: "例：+84 903 041 286",
    contactContentLabel: "ご相談・提携内容",
    contactContentPlaceholder: "提携のご提案やお問い合わせ内容をご入力ください...",
    contactSendBtn: "送信する",
    contactSentSuccessTitle: "送信が完了しました！",
    contactSentSuccessDesc: "お問い合わせありがとうございます。担当者より迅速にご連絡いたします。",

    // Share Modal
    shareModalBadge: "名刺を共有",
    shareModalTitle: "デジタル名刺を共有",
    shareModalSubtitle: "ト・ゴック・ズンのデジタル名刺をパートナーや知人と共有",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "Zaloで送信",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "Facebookで共有",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "Messengerで送信",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "WhatsAppで送信",
    shareViaSms: "SMS",
    shareViaSmsSub: "SMSメッセージアプリを開く",
    shareCopyLinkBtn: "リンクをコピー",
    shareCopiedSuccess: "リンクが正常にコピーされました！",

    // Bank & QR Payment
    bankTitle: "銀行口座情報・QR決済",
    bankCompanyTitle: "法人銀行口座",
    bankPersonalTitle: "個人銀行口座",
    companyInfoTitle: "会社情報",
    bankKeywords: ["24/7 即時振込", "VietQR コード", "Napas 247", "タップしてQR表示"],
    bankTapToViewQr: "QRコードを表示",
    bankAccountNum: "口座番号",
    bankAccountHolder: "口座名義",
    bankBranchLabel: "支店名",
    bankModalTitle: "送金用QRコード",
    bankModalScanDesc: "銀行アプリまたは電子マネーでQRコードを読み取って即時送金できます",
    bankCopiedSuccess: "口座番号をコピーしました！",
    bankDownloadQr: "QR画像を保存"
  },
  ko: {
    greeting: "안녕하세요, 저는",
    nameTitle: "NGUYEN THI HA TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    title: "대표이사 / 디렉터",
    company: "베트남 공급망 (VIETNAM SUPPLY CHAIN)",
    share: "공유",
    copied: "복사됨",
    saveContact: "연락처 저장",
    saveShort: "저장",
    flipQr: "QR 코드",
    introBadge: "JENNY TRINH",
    introMessage: "의류, 유니폼, 기업 판촉물, 국제 물류 및 리테일 분야에서 지속 가능하고 가치 있는 협력을 위해 파트너 및 고객과 함께합니다.",
    addressLabel: "본사 주소",
    phoneLabel: "전화번호",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "이메일",
    websiteLabel: "웹사이트",
    openMaps: "Google 지도 열기",
    copyAddress: "주소 복사",
    callDirect: "전화 걸기",
    chatZalo: "Zalo 채팅",
    connectBtn: "연락하기",
    copyPhone: "전화번호 복사",
    copyEmail: "이메일 복사",
    visitWebsite: "웹사이트 방문",
    flipToBackNotice: "클릭하여 명함 QR코드를 확인하세요",
    flipToFrontNotice: "터치 또는 클릭하여 사진으로 돌아가기",
    scanCameraNotice: "휴대폰 카메라로 스캔하여 연락처를 저장하세요",
    visitSystem: "시스템 방문",
    downloadCatalogue: "카탈로그 다운로드",

    // Ecosystems
    garmentTitle: "의류, 유니폼 및 기업 선물 생태계",
    garmentTitleLine1: "의류, 유니폼 맞춤제작",
    garmentTitleLine2: "및 기업 선물 생태계",
    garmentKeywords1: ["맞춤 제작", "직원 유니폼", "산업 안전복"],
    garmentKeywords2: ["기업 사은품", "캔버스 에코백", "백팩", "모자 제작"],

    logisticsTitle: "국제 물류 및 포워딩 생태계",
    logisticsTitleLine1: "국제 물류 및 포워딩",
    logisticsTitleLine2: "생태계",
    logisticsKeywords1: ["해상 운송", "항공 운송"],
    logisticsKeywords2: ["육상 운송", "특송 서비스"],

    retailTitle: "슈퍼마켓 및 소매 유통 생태계",
    retailTitleLine1: "슈퍼마켓 및 소매",
    retailTitleLine2: "유통 생태계",
    retailKeywords: ["소비재·생활용품", "사무용품", "선물 세트"],

    // Sticky bottom bar
    callNow: "전화 걸기",
    mobileChatZalo: "Zalo 채팅",
    saveVCard: "연락처 저장",
    mobileQr: "QR 코드",

    // QR Modal
    qrModalBadge: "디지털 명함 QR 코드",
    qrModalScanNotice: "휴대폰 카메라로 QR 코드를 스캔하여 연락처를 저장하세요",
    qrModalDownloadBtn: "VCF 명함 다운로드",

    // Contact Modal
    contactModalBadge: "직접 문의",
    contactModalTitle: "메시지 보내기",
    contactModalSubtitle: "메시지는 경영진 및 비서실로 직접 전달됩니다",
    contactNameLabel: "성함",
    contactNamePlaceholder: "예: 홍길동",
    contactPhoneLabel: "전화번호 / WhatsApp",
    contactPhonePlaceholder: "예: +84 903 041 286",
    contactContentLabel: "협력 및 문의 내용",
    contactContentPlaceholder: "협력 제안 또는 문의 내용을 입력해주세요...",
    contactSendBtn: "메시지 전송",
    contactSentSuccessTitle: "성공적으로 전송되었습니다!",
    contactSentSuccessDesc: "문의해 주셔서 감사합니다. 빠른 시일 내에 답변 드리겠습니다.",

    // Share Modal
    shareModalBadge: "명함 공유",
    shareModalTitle: "디지털 명함 공유하기",
    shareModalSubtitle: "토응옥융의 디지털 명함을 파트너 및 지인과 공유하세요",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "Zalo로 전송",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "Facebook에 공유",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "Messenger로 전송",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "WhatsApp으로 전송",
    shareViaSms: "SMS 문자",
    shareViaSmsSub: "휴대폰 문자 앱 열기",
    shareCopyLinkBtn: "링크 복사",
    shareCopiedSuccess: "링크가 클립보드에 복사되었습니다!",

    // Bank & QR Payment
    bankTitle: "은행 계좌 정보 및 QR 결제",
    bankCompanyTitle: "법인 은행 계좌",
    bankPersonalTitle: "개인 은행 계좌",
    companyInfoTitle: "회사 정보",
    bankKeywords: ["24/7 실시간 이체", "VietQR 코드", "Napas 247", "QR코드 보기"],
    bankTapToViewQr: "QR코드 보기",
    bankAccountNum: "계좌번호",
    bankAccountHolder: "예금주",
    bankBranchLabel: "지점",
    bankModalTitle: "계좌이체 QR코드",
    bankModalScanDesc: "은행 앱 또는 전자지갑으로 QR코드를 스캔하여 24/7 실시간 이체하세요",
    bankCopiedSuccess: "계좌번호가 복사되었습니다!",
    bankDownloadQr: "QR코드 다운로드"
  },
  th: {
    greeting: "สวัสดีครับ ผมคือ",
    nameTitle: "NGUYEN THI HA TRINH | JENNY TRINH",
    name: "Nguyễn Thị Hà Trinh",
    title: "ผู้อำนวยการ",
    company: "ห่วงโซ่อุปทานเวียดนาม (VIETNAM SUPPLY CHAIN)",
    share: "แชร์",
    copied: "คัดลอกแล้ว",
    saveContact: "บันทึกรายชื่อ",
    saveShort: "บันทึก",
    flipQr: "คิวอาร์โค้ด",
    introBadge: "JENNY TRINH",
    introMessage: "เชื่อมโยงและร่วมมือกับพันธมิตรและลูกค้าในด้านสิ่งทอ ยูนิฟอร์ม ของขวัญองค์กร โลจิสติกส์ และค้าปลีก มุ่งสู่ความร่วมมือที่ยั่งยืนและมีประสิทธิภาพ",
    addressLabel: "ที่อยู่สำนักงานใหญ่",
    phoneLabel: "เบอร์โทรศัพท์",
    zaloLabel: "Zalo",
    whatsappLabel: "WhatsApp",
    facebookLabel: "Facebook",
    emailLabel: "อีเมล",
    websiteLabel: "เว็บไซต์",
    openMaps: "เปิด Google Maps",
    copyAddress: "คัดลอกที่อยู่",
    callDirect: "โทรทันที",
    chatZalo: "แชท Zalo",
    connectBtn: "ติดต่อเรา",
    copyPhone: "คัดลอกเบอร์โทร",
    copyEmail: "คัดลอกอีเมล",
    visitWebsite: "เยี่ยมชมเว็บไซต์",
    flipToBackNotice: "คลิกหรือวางเมาส์เพื่อดูคิวอาร์โค้ดนามบัตร",
    flipToFrontNotice: "แตะหรือคลิกเพื่อพลิกกลับไปที่รูปภาพ",
    scanCameraNotice: "สแกนด้วยกล้องมือถือเพื่อบันทึกและเปิดนามบัตร",
    visitSystem: "เข้าสู่ระบบ",
    downloadCatalogue: "ดาวน์โหลดแคตตาล็อก",

    // Ecosystems
    garmentTitle: "ระบบนิเวศสิ่งทอ ยูนิฟอร์ม และของขวัญองค์กร",
    garmentTitleLine1: "ระบบนิเวศสิ่งทอ ยูนิฟอร์ม",
    garmentTitleLine2: "และของขวัญองค์กร",
    garmentKeywords1: ["ตัดเย็บสั่งทำ", "ชุดยูนิฟอร์มพนักงาน", "ชุดนิรภัยแรงงาน"],
    garmentKeywords2: ["ของขวัญองค์กร", "กระเป๋าผ้า", "กระเป๋าเป้", "หมวกสั่งทำ"],

    logisticsTitle: "ระบบนิเวศการขนส่งและโลจิสติกส์ระหว่างประเทศ",
    logisticsTitleLine1: "ระบบนิเวศการขนส่ง",
    logisticsTitleLine2: "และโลจิสติกส์ระหว่างประเทศ",
    logisticsKeywords1: ["ขนส่งทางเรือ", "ขนส่งทางอากาศ"],
    logisticsKeywords2: ["ขนส่งทางบก", "บริการจัดส่งด่วน"],

    retailTitle: "ระบบนิเวศซูเปอร์มาร์เก็ตและค้าปลีก",
    retailTitleLine1: "ระบบนิเวศซูเปอร์มาร์เก็ต",
    retailTitleLine2: "และค้าปลีก",
    retailKeywords: ["สินค้าอุปโภคบริโภค", "เครื่องเขียน", "กระเช้าของขวัญ"],

    // Sticky bottom bar
    callNow: "โทรทันที",
    mobileChatZalo: "แชท Zalo",
    saveVCard: "บันทึกรายชื่อ",
    mobileQr: "คิวอาร์โค้ด",

    // QR Modal
    qrModalBadge: "คิวอาร์โค้ดนามบัตรดิจิทัล",
    qrModalScanNotice: "ใช้กล้องโทรศัพท์มือถือเพื่อสแกนและบันทึกรายชื่อ",
    qrModalDownloadBtn: "ดาวน์โหลด VCF นามบัตร",

    // Contact Modal
    contactModalBadge: "ติดต่อโดยตรง",
    contactModalTitle: "ส่งข้อความถึง",
    contactModalSubtitle: "ข้อความจะถูกส่งตรงถึงผู้บริหารและสำนักงานเลขานุการ",
    contactNameLabel: "ชื่อ-นามสกุลของคุณ",
    contactNamePlaceholder: "เช่น สมชาย ใจดี",
    contactPhoneLabel: "เบอร์โทรศัพท์ / WhatsApp",
    contactPhonePlaceholder: "เช่น +84 903 041 286",
    contactContentLabel: "เนื้อหาความร่วมมือ / ติดต่อ",
    contactContentPlaceholder: "ระบุข้อความหรือข้อเสนอความร่วมมือ...",
    contactSendBtn: "ส่งข้อความ",
    contactSentSuccessTitle: "ส่งข้อความสำเร็จแล้ว!",
    contactSentSuccessDesc: "ขอบคุณสำหรับการติดต่อ เราจะตอบกลับท่านโดยเร็วที่สุด",

    // Share Modal
    shareModalBadge: "แชร์นามบัตร",
    shareModalTitle: "แชร์นามบัตรดิจิทัล",
    shareModalSubtitle: "แชร์นามบัตรดิจิทัลของ โต หง็อก สุง ให้กับพันธมิตรและเพื่อน",
    shareViaZalo: "Zalo",
    shareViaZaloSub: "ส่งผ่าน Zalo",
    shareViaFacebook: "Facebook",
    shareViaFacebookSub: "แชร์ไปยัง Facebook",
    shareViaMessenger: "Messenger",
    shareViaMessengerSub: "ส่งผ่าน Messenger",
    shareViaWhatsApp: "WhatsApp",
    shareViaWhatsAppSub: "ส่งผ่าน WhatsApp",
    shareViaSms: "SMS",
    shareViaSmsSub: "เปิดแอปพลิเคชันข้อความมือถือ",
    shareCopyLinkBtn: "คัดลอกลิงก์",
    shareCopiedSuccess: "คัดลอกลิงก์สำเร็จแล้ว!",

    // Bank & QR Payment
    bankTitle: "ข้อมูลบัญชีธนาคารและการชำระเงิน",
    bankCompanyTitle: "บัญชีธนาคารบริษัท",
    bankPersonalTitle: "บัญชีธนาคารส่วนบุคคล",
    companyInfoTitle: "ข้อมูลบริษัท",
    bankKeywords: ["โอนเงินด่วน 24/7", "สแกน VietQR", "Napas 247", "แตะเพื่อดู QR"],
    bankTapToViewQr: "ดูรหัส QR",
    bankAccountNum: "เลขที่บัญชี",
    bankAccountHolder: "ชื่อบัญชี",
    bankBranchLabel: "สาขา",
    bankModalTitle: "สแกนรหัส QR เพื่อโอนเงิน",
    bankModalScanDesc: "เปิดแอปธนาคารหรือกระเป๋าเงินดิจิทัลเพื่อสแกนและโอนเงินได้ตลอด 24/7",
    bankCopiedSuccess: "คัดลอกเลขที่บัญชีเรียบร้อยแล้ว!",
    bankDownloadQr: "ดาวน์โหลดรูปภาพ QR"
  }
};

export default function JennyTrinhPortfolioPage() {
  const [lang, setLang] = useState('vi');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedBankModal, setSelectedBankModal] = useState(null);
  const [copiedBankId, setCopiedBankId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showBack = isFlipped || isHovered;
  const [messageForm, setMessageForm] = useState({ name: '', phone: '', content: '' });
  const [isSent, setIsSent] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAllCompanyInfo = () => {
    const fullCompanyInfo = `THÔNG TIN XUẤT HOÁ ĐƠN:\nĐơn vị: CÔNG TY TNHH CHUỖI CUNG ỨNG VN\nMã số thuế (MST): 0319430529\nĐại diện pháp luật: Nguyễn Thị Hà Trinh (Giám Đốc)\nSố điện thoại: 0937 151 290\nĐịa chỉ xuất hoá đơn: 29 Quách Văn Tuấn, Phường Bảy Hiền, Tp.HCM\nEmail gửi hoá đơn: info@chuoicungung.vn`;
    handleCopyText(fullCompanyInfo, "allCompanyInfo");
  };

  // Refs for GSAP & Three.js & Gyroscope
  const containerRef = useRef(null);
  const leftColRef = useRef(null);
  const portraitCardRef = useRef(null);
  const tiltWrapperRef = useRef(null);
  const flipCoreRef = useRef(null);
  const frontFaceRef = useRef(null);
  const backFaceRef = useRef(null);
  const mirrorSheenRef = useRef(null);
  const holoGlowRef = useRef(null);
  const backMirrorSheenRef = useRef(null);
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const threeCanvasRef = useRef(null);
  const threeSceneRef = useRef(null);
  const shimmerRef = useRef(null);
  const ecosystemRef = useRef(null);
  const langDropdownRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);
  const avatarRotatingLogoRef = useRef(null);

  const t = translations[lang] || translations.vi;

  // Dedicated handlers for card tilt & hover flip (Only desktop triggers hover flip)
  const handleCardMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
      setIsHovered(true);
    }
  };

  const handleCardMouseMove = (e) => {
    if (!portraitCardRef.current) return;
    const rect = portraitCardRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y))
      };
    }
  };

  const handleCardMouseLeave = () => {
    targetTiltRef.current = { x: 0, y: 0 };
    setIsHovered(false);
  };

  const handleCardTouchMove = (e) => {
    if (!portraitCardRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = portraitCardRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    targetTiltRef.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    };
  };

  const handleCardTouchEnd = () => {
    targetTiltRef.current = { x: 0, y: 0 };
  };

  const handleToggleFlip = (e) => {
    if (e && e.target && (e.target.closest('a') || e.target.closest('button'))) {
      return;
    }
    setIsFlipped((prev) => !prev);
  };

  // Page Loading Intro: Clean rotating logo (xoay 1 lần duy nhất) that flies & shrinks into avatar logo
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPageLoading(false);
        }
      });

      // 1. Big Logo in center fades in and rotates EXACTLY 1 time (360deg)
      tl.fromTo(
        introLogoRef.current,
        { scale: 1, rotate: 0, opacity: 0 },
        { scale: 1, rotate: 360, opacity: 1, duration: 0.9, ease: 'power2.out' }
      );

      // Brief pause on the big centered logo
      tl.to({}, { duration: 0.15 });

      // 2. Shrink and fly into the avatar rotating logo on the card
      tl.add(() => {
        if (introLogoRef.current && avatarRotatingLogoRef.current) {
          const currentRect = introLogoRef.current.getBoundingClientRect();
          const targetRect = avatarRotatingLogoRef.current.getBoundingClientRect();
          if (targetRect.width > 0 && targetRect.left > 0) {
            const deltaX = targetRect.left + targetRect.width / 2 - (currentRect.left + currentRect.width / 2);
            const deltaY = targetRect.top + targetRect.height / 2 - (currentRect.top + currentRect.height / 2);
            const targetScale = targetRect.width / currentRect.width;

            gsap.to(introLogoRef.current, {
              x: deltaX,
              y: deltaY,
              scale: targetScale,
              rotate: 720,
              duration: 0.8,
              ease: 'power3.inOut'
            });
          }
        }
      });

      // 3. Smooth overlay fade out revealing the full page
      tl.to(
        introOverlayRef.current,
        { opacity: 0, duration: 0.5, ease: 'power2.out' },
        "+=0.45"
      );
    });

    return () => ctx.revert();
  }, []);

  // Three.js 3D Ambient Holographic Particle Field for Portrait Card
  useEffect(() => {
    if (!threeCanvasRef.current) return;
    const canvas = threeCanvasRef.current;
    const width = canvas.clientWidth || 360;
    const height = canvas.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 6 CCU Brand Colors
    const brandColors = [
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#10b981'),
      new THREE.Color('#f97316'),
      new THREE.Color('#0284c7'),
      new THREE.Color('#eab308'),
      new THREE.Color('#ef4444')
    ];

    const particleCount = 42;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;

      const c = brandColors[i % brandColors.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    threeSceneRef.current = { scene, camera, renderer, particles };

    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      particles.rotation.y = elapsed * 0.12;
      particles.rotation.x = Math.sin(elapsed * 0.25) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // GSAP 3D Cinematic Flip Animation with Dynamic Swirl & Shimmer
  useEffect(() => {
    if (!flipCoreRef.current) return;

    // React Three.js particles to flip
    if (threeSceneRef.current?.particles) {
      gsap.to(threeSceneRef.current.particles.rotation, {
        y: showBack ? "+=1.8" : "-=1.8",
        duration: 0.65,
        ease: 'power2.out'
      });
    }

    // Keep both faces visible so GPU handles crossover cleanly without disappearance
    if (frontFaceRef.current) {
      frontFaceRef.current.style.visibility = 'visible';
      frontFaceRef.current.style.opacity = '1';
    }
    if (backFaceRef.current) {
      backFaceRef.current.style.visibility = 'visible';
      backFaceRef.current.style.opacity = '1';
    }

    // Cancel in-flight card rotation
    gsap.killTweensOf(flipCoreRef.current);

    // GSAP 3D Card Rotation with tactile lift
    gsap.to(flipCoreRef.current, {
      rotateY: showBack ? 180 : 0,
      duration: 0.65,
      ease: 'power3.inOut',
      transformPerspective: 1200,
      transformOrigin: '50% 50%'
    });

    // Shimmer sheen effect
    if (shimmerRef.current) {
      gsap.fromTo(
        shimmerRef.current,
        { x: showBack ? '-150%' : '150%', opacity: 0 },
        {
          x: showBack ? '150%' : '-150%',
          opacity: 0.45,
          duration: 0.65,
          ease: 'power2.inOut',
          onComplete: () => {
            if (shimmerRef.current) gsap.set(shimmerRef.current, { opacity: 0 });
          }
        }
      );
    }
  }, [showBack]);

  // Gyroscope & Accelerometer 3D Tilt & Subtle Glass Specular Reflection Effect (No permission popup)
  useEffect(() => {
    let isMounted = true;
    let animationFrameId;

    let currentX = 0;
    let currentY = 0;

    let baseGamma = null;
    let baseBeta = null;
    let hasOrientationData = false;

    // Handle orientation sensor (Android Chrome, Firefox, Samsung Internet - zero permission needed)
    const handleOrientation = (e) => {
      if (!isMounted) return;
      if (e.gamma !== null && e.beta !== null && (e.gamma !== 0 || e.beta !== 0)) {
        hasOrientationData = true;

        if (baseGamma === null || baseBeta === null) {
          baseGamma = e.gamma;
          baseBeta = e.beta;
          return;
        }

        // Adaptive baseline drift (smoothly tracks natural holding angle)
        baseGamma += (e.gamma - baseGamma) * 0.02;
        baseBeta += (e.beta - baseBeta) * 0.02;

        const deltaX = e.gamma - baseGamma;
        const deltaY = e.beta - baseBeta;

        // Responsive tilt: +/- 12 degrees is full range
        targetTiltRef.current = {
          x: Math.max(-1, Math.min(1, deltaX / 12)),
          y: Math.max(-1, Math.min(1, deltaY / 12))
        };
      }
    };

    // DeviceMotion fallback (Works automatically on mobile browsers without prompts)
    const handleMotion = (e) => {
      if (!isMounted || hasOrientationData) return;
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null) return;

      if (baseGamma === null || baseBeta === null) {
        baseGamma = acc.x;
        baseBeta = acc.y;
        return;
      }

      baseGamma += (acc.x - baseGamma) * 0.025;
      baseBeta += (acc.y - baseBeta) * 0.025;

      const deltaX = acc.x - baseGamma;
      const deltaY = acc.y - baseBeta;

      targetTiltRef.current = {
        x: Math.max(-1, Math.min(1, -deltaX / 2.0)),
        y: Math.max(-1, Math.min(1, deltaY / 2.0))
      };
    };

    // Direct registration without requesting intrusive permissions
    if (typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, true);
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('devicemotion', handleMotion, true);

      // Support iOS 13+ Safari Permission on user gesture (tap/touch anywhere)
      const enableGyroOnIos = async () => {
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          try {
            const state = await DeviceOrientationEvent.requestPermission();
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          } catch (err) {}
        }
      };
      window.addEventListener('touchstart', enableGyroOnIos, { once: true, passive: true });
      window.addEventListener('click', enableGyroOnIos, { once: true });
    }

    // High-performance 60fps render loop for physical tilt & subtle mirror sheen
    const renderLoop = () => {
      if (!isMounted) return;

      let effTargetX = targetTiltRef.current.x;
      let effTargetY = targetTiltRef.current.y;

      // Natural subtle ambient glass sheen drift when idle so the reflection is always alive
      if (effTargetX === 0 && effTargetY === 0) {
        const time = Date.now() * 0.0014;
        effTargetX = Math.sin(time) * 0.30;
        effTargetY = Math.cos(time * 0.8) * 0.22;
      }

      // Smooth physics damping (0.12 lerp factor)
      currentX += (effTargetX - currentX) * 0.12;
      currentY += (effTargetY - currentY) * 0.12;

      // 1. Tilt 3D Wrapper (subtle, elegant 12-degree tilt)
      if (tiltWrapperRef.current) {
        const rotY = currentX * 12; // degrees
        const rotX = -currentY * 12; // degrees
        tiltWrapperRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      }

      // 2. Corner & Sliding Specular Mirror Light Sheen (Hiệu ứng phản chiếu gương khi nghiêng điện thoại)
      const angle = 45 + currentX * 30;
      const beamPos = 50 + currentX * 55 + currentY * 25;
      const glareX = 50 + currentX * 40;
      const glareY = 35 + currentY * 35;

      if (mirrorSheenRef.current) {
        mirrorSheenRef.current.style.opacity = '1';
        mirrorSheenRef.current.style.background = `
          linear-gradient(
            ${angle.toFixed(1)}deg,
            transparent ${Math.max(0, beamPos - 35).toFixed(1)}%,
            rgba(255, 255, 255, 0.40) ${beamPos.toFixed(1)}%,
            rgba(255, 255, 255, 0.15) ${(beamPos + 10).toFixed(1)}%,
            transparent ${Math.min(100, beamPos + 35).toFixed(1)}%
          ),
          radial-gradient(
            circle 280px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%,
            rgba(255, 255, 255, 0.48) 0%,
            transparent 70%
          )
        `;
      }

      if (backMirrorSheenRef.current) {
        const backGlareX = 50 - currentX * 40;
        const backGlareY = 35 + currentY * 35;
        backMirrorSheenRef.current.style.opacity = '1';
        backMirrorSheenRef.current.style.background = `
          radial-gradient(
            circle 260px at ${backGlareX.toFixed(1)}% ${backGlareY.toFixed(1)}%,
            rgba(0, 105, 56, 0.12) 0%,
            rgba(255, 255, 255, 0.25) 30%,
            transparent 70%
          )
        `;
      }

      // Parallax for Three.js particle halo
      if (threeSceneRef.current?.particles) {
        threeSceneRef.current.particles.rotation.z = currentX * 0.15;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, []);

  // Profile Information
  const profile = {
    name: "Nguyễn Thị Hà Trinh",
    nameUpper: "NGUYỄN THỊ HÀ TRINH | JENNY TRINH",
    company: "CHUỖI CUNG ỨNG",
    phone: "0937151290",
    phoneDisplay: "0937 151 290",
    zaloUrl: "https://zalo.me/0937151290",
    whatsappUrl: "https://wa.me/84937151290",
    address: "29 Quách Văn Tuấn, Bảy Hiền, HCM, VN",
    mapsUrl: "https://www.google.com/maps/dir//AdamEva.vn+-+%C4%90%E1%BB%93ng+Ph%E1%BB%A5c+Cao+C%E1%BA%A5p+%26+Qu%C3%A0+T%E1%BA%B7ng+Doanh+Nghi%E1%BB%87p,+29+Qu%C3%A1ch+V%C4%83n+Tu%E1%BA%A5n,+B%E1%BA%A3y+Hi%E1%BB%81n,+H%E1%BB%93+Ch%C3%AD+Minh+70000,+Vietnam/@10.064123,106.9491426,8z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31752946abeb9d69:0x7c7c2b896958d8a2!2m2!1d106.6525098!2d10.7993581?entry=ttu&g_ep=EgoyMDI2MDkwNi4wIKXMDSoASAFQAw%3D%3D",
    email: "trinh@chuoicungung.vn",
    website: "https://chuoicungung.vn",
    websiteDisplay: "chuoicungung.vn",
    facebookUrl: "https://facebook.com/trinh.ha.33",
    facebookDisplay: "fb.com/jennytrinh",
    avatar: "/images/chi_Trinh.jpg"
  };

  // 1. Garment Ecosystem
  const garmentEcosystem = [
    {
      id: "adameva",
      name: "ADAMEVA",
      domain: "adameva.vn",
      logo: "/images/ecosystem/adameva_hd.png",
      url: "https://adameva.vn",
      catalogueUrl: "/catalogues/CATALOGUE_DP.pdf",
      catalogueFileName: "CATALOGUE_DP.pdf"
    },
    {
      id: "chuyengiadongphuc",
      name: "Chuyên Gia Đồng Phục",
      domain: "chuyengiadongphuc.vn",
      logo: "/images/ecosystem/chuyengiadongphuc_hd.png",
      url: "https://chuyengiadongphuc.vn",
      catalogueUrl: "/catalogues/CATALOGUE_DP.pdf",
      catalogueFileName: "CATALOGUE_DP.pdf"
    },
    {
      id: "cgdp",
      name: "CGDP.vn",
      domain: "cgdp.vn",
      logo: "/images/ecosystem/cgdp_hd.png",
      url: "https://cgdp.vn",
      catalogueUrl: "/catalogues/CATALOGUE_DP.pdf",
      catalogueFileName: "CATALOGUE_DP.pdf"
    },
    {
      id: "piju",
      name: "PIJU",
      domain: "piju.vn",
      logo: "/images/ecosystem/piju_vi.png",
      url: "http://piju.vn",
      catalogueUrl: "/catalogues/CATALOGUE_DP.pdf",
      catalogueFileName: "CATALOGUE_DP.pdf"
    }
  ];

  // 2. Logistics Ecosystem
  const logisticsEcosystem = [
    {
      id: "portalink",
      name: "PORTALINK",
      domain: "portalink.vn",
      logo: "/images/ecosystem/portalink_hd.png",
      url: "https://portalink.vn",
      catalogueUrl: "/catalogues/PROFILE_PORTALINK.pdf",
      catalogueFileName: "PROFILE_PORTALINK.pdf"
    },
    {
      id: "seairlandex",
      name: "SEAIRLANDEX",
      domain: "seairlandex.com",
      logo: "/images/ecosystem/logo_sea_1.png",
      url: "https://seairlandex.com",
      catalogueUrl: "/catalogues/PROFILE_PORTALINK.pdf",
      catalogueFileName: "PROFILE_PORTALINK.pdf"
    }
  ];

  // 3. Retail Ecosystem
  const retailEcosystem = [
    {
      id: "tahomart",
      name: "TAHOMART",
      domain: "tahomart.com",
      logo: "/images/ecosystem/tahomart_hd.png",
      url: "https://tahomart.com",
      catalogueUrl: "/catalogues/TAHOMART_THE_TAHO_WAY.pdf",
      catalogueFileName: "TAHOMART - THE TAHO WAY.pdf"
    }
  ];

  // 4. Bank Accounts (MB Bank: Company VND, Company USD & Personal)
  const companyBankAccount = {
    id: "mb-company",
    type: "company",
    bankName: "MB BANK - Ngân Hàng Quân Đội",
    bankFullName: "Ngân hàng TMCP Quân đội (MB)",
    accountNumber: "676877799",
    accountNumberDisplay: "676877799",
    accountHolder: "CÔNG TY TNHH CHUỖI CUNG ỨNG VN",
    branch: "Hội sở / Chi nhánh TP. Hồ Chí Minh",
    logo: "/images/banks/Logo_MB_new.png",
    noQr: true,
    themeColor: "#002882"
  };

  const companyUsdAccount = {
    id: "mb-company-usd",
    type: "company-usd",
    bankName: "Military commercial joint stock bank",
    bankFullName: "Military commercial joint stock bank",
    swiftCode: "MSCBVNVX",
    accountNumber: "9433987756675",
    accountNumberDisplay: "9433987756675",
    accountHolder: "VN SUPPLY CHAIN CO., LTD",
    branch: "Head Office / Ho Chi Minh City Branch",
    logo: "/images/banks/Logo_MB_new.png",
    noQr: true,
    currency: "USD",
    themeColor: "#002882"
  };

  const personalBankAccount = {
    id: "mb-personal",
    type: "personal",
    bankName: "MB Bank",
    bankFullName: "Ngân hàng TMCP Quân đội (MB)",
    accountNumber: "0937151290",
    accountNumberDisplay: "0937 151 290",
    accountHolder: "NGUYỄN THỊ HÀ TRINH",
    branch: "Ứng dụng MBBank",
    logo: "/images/banks/Logo_MB_new.png",
    qrImage: "/images/banks/qr_mb_personal.jpg",
    themeColor: "#002882"
  };

  const bankAccounts = [companyBankAccount, companyUsdAccount, personalBankAccount];

  const handleCopyBankNumber = (e, bank) => {
    if (e && e.stopPropagation) e.stopPropagation();
    navigator.clipboard.writeText(bank.accountNumber);
    setCopiedBankId(bank.id);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set SEO Meta on Page Mount
  useEffect(() => {
    document.title = t.nameTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.introMessage);
    }
  }, [lang]);

  // GSAP ENTRANCE ANIMATIONS
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left Column Stagger
      gsap.from(leftColRef.current, {
        opacity: 0,
        x: -35,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'all'
      });

      // Portrait 3D Card Zoom & Entrance
      gsap.from(portraitCardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
        clearProps: 'all'
      });

      // Ecosystem Sections Reveal
      gsap.from(ecosystemRef.current, {
        opacity: 0,
        y: 35,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.3,
        clearProps: 'all'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt handler (Mouse & Mobile Touch Support)
  const apply3DTilt = (e, element, maxTilt = 0.045) => {
    if (!element) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (clientX === undefined || clientY === undefined) return;
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const tiltX = (-y / (rect.height / 2)) * (maxTilt * 20);
    const tiltY = (x / (rect.width / 2)) * (maxTilt * 20);
    gsap.to(element, {
      rotateX: tiltX,
      rotateY: tiltY,
      scale: 1.015,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const reset3DTilt = (element) => {
    if (!element) return;
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (e) {
      console.warn('Fallback copy failed:', e);
    }
  };

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = t.nameTitle || "NGUYỄN THỊ HÀ TRINH | JENNY TRINH";
    const shareText = "Kết nối cùng Doanh nhân Nguyễn Thị Hà Trinh - Chuỗi Cung Ứng (Danh thiếp điện tử)";

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl
    };

    // 1. Try Native Web Share API if supported (Android Chrome, iOS Safari, etc.)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return; // Native share launched successfully
        }
      } catch (err) {
        // If user cancelled / dismissed the native share sheet, do NOT copy to clipboard
        if (err.name === 'AbortError') {
          return;
        }
        console.warn('Native share error, falling back to Share Modal:', err);
      }
    }

    // 2. Fallback: In-app browsers (Zalo, Facebook, Instagram), desktop, or when native share is unavailable
    setShowShareModal(true);
  };

  const handleDownloadVCard = () => {
    window.location.href = '/jenny_trinh.vcf';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setShowContactModal(false);
      setMessageForm({ name: '', phone: '', content: '' });
    }, 2200);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#fafcfb] text-[#1c2e24] font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_system-ui,_-apple-system,_sans-serif] selection:bg-[#006938]/20 selection:text-[#006938] flex flex-col justify-between print:bg-white pb-20 sm:pb-0 relative"
    >

      {/* ========================================================
          PAGE LOAD INTRO: 3D logo_onlyc.png transitions & shrinks into Avatar Logo
      ======================================================== */}
      <div
        ref={introOverlayRef}
        className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-none ${!pageLoading ? 'hidden' : ''
          }`}
      >
        <div
          ref={introLogoRef}
          className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center will-change-transform"
        >
          <img
            src="/logo_onlyc.png"
            alt="Loading..."
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ========================================================
          MAIN PORTFOLIO & CONTACT HUB (THREE.JS & GSAP INTEGRATED)
      ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 space-y-8 flex-1 w-full">

        {/* TOP ROW: EXECUTIVE IDENTITY & 3D STUDIO PORTRAIT */}
        <div className="flex flex-col md:flex-row gap-5 lg:gap-8 xl:gap-10 items-start w-full">

          {/* ========================================================
              LEFT COLUMN: IDENTITY, ABOUT STATEMENT, DIRECT CONNECT (FLEX-1)
          ======================================================== */}
          <div ref={leftColRef} className="flex-1 min-w-0 flex flex-col justify-start space-y-4 sm:space-y-4.5 order-2 md:order-1 w-full">

            {/* Main Name & Action Buttons (Lưu DB, QR, Đổi Ngôn Ngữ, Chia sẻ) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4 pb-1 sm:pb-2 w-full">
              <div className="space-y-0.5 min-w-0 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">
                  {t.greeting}
                </p>
                <AutoFitNameHeading maxFontSize={30} minFontSize={11}>
                  NGUYỄN THỊ HÀ TRINH <span className="text-[#006938] font-black">| JENNY TRINH</span>
                </AutoFitNameHeading>
              </div>

              {/* Action Buttons + Language Switcher: 4 buttons full width on mobile, inline on desktop */}
              <div className="w-full lg:w-auto grid grid-cols-4 sm:flex items-center justify-center lg:justify-end gap-1.5 sm:gap-2 shrink-0 lg:mb-1">

                {/* 1. Lưu Danh Bạ (Mobile: icon + Localized Short Text) */}
                <button
                  onClick={handleDownloadVCard}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-3.5 py-2 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-[11px] sm:text-xs font-extrabold shadow-sm shadow-[#006938]/25 transition-all active:scale-95 uppercase font-heading shrink-0"
                  title={t.saveContact}
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  
                  <span className="truncate">{t.saveContact}</span>
                </button>

                {/* 2. Mã QR (Với chữ QR Code) */}
                <button
                  onClick={() => {
                    setIsFlipped((prev) => !prev);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-[10.5px] min-[380px]:text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-[#f0fdf4] hover:text-[#006938] hover:border-emerald-300 rounded-xl transition-all shadow-xs active:scale-95 font-heading shrink-0 truncate"
                  title={showBack ? t.flipToFrontNotice : t.flipToBackNotice}
                >
                  <QrCode className="w-3.5 h-3.5 shrink-0 text-[#006938]" />
                  <span className="truncate">QR Code</span>
                </button>

                {/* 3. Language Switcher Dropdown */}
                <div ref={langDropdownRef} className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-[10.5px] min-[380px]:text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-xs active:scale-95 font-heading shrink-0 truncate"
                    title="Chuyển đổi ngôn ngữ / Change Language"
                  >
                    <Languages className="w-3.5 h-3.5 text-[#006938] shrink-0" />
                    <span className="font-extrabold truncate">{LANGUAGES.find(l => l.code === lang)?.flag} {LANGUAGES.find(l => l.code === lang)?.short}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-1.5 w-44 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLang(l.code);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-emerald-50 transition-colors ${lang === l.code ? 'text-[#006938] bg-emerald-50/70' : 'text-slate-700'}`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{l.flag}</span>
                            <span>{l.label}</span>
                          </span>
                          {lang === l.code && <Check className="w-3.5 h-3.5 text-[#006938]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Chia sẻ (Nằm ở cuối) */}
                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 text-[10.5px] min-[380px]:text-xs font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-xs active:scale-95 font-heading shrink-0 truncate"
                  title={t.share}
                >
                  <Share2 className="w-3.5 h-3.5 text-[#006938] shrink-0" />
                  <span className="truncate">{t.share}</span>
                </button>

              </div>
            </div>

            {/* Profile Introduction Statement with Revolving 6-Color Rainbow Border (Image 3) */}
            <div
              className="relative rounded-2xl p-[2px] clickup-revolving-border shadow-md shadow-[#006938]/10 text-left transition-all duration-300 hover:shadow-xl hover:shadow-[#006938]/20 group"
              
            >
              <div className="relative z-10 rounded-[14px] p-3.5 sm:p-5 bg-white overflow-hidden flex items-center">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#006938]" />

                <div className="pl-1 sm:pl-2">
                  <p className="text-[12.5px] sm:text-[13.5px] md:text-[14.5px] leading-relaxed text-slate-800 font-medium font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_system-ui,_-apple-system,_sans-serif]">
                    <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-lg bg-[#006938] text-white font-black text-[11px] sm:text-xs tracking-wider mr-1.5 sm:mr-2 shadow-xs font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                      {t.introBadge}
                    </span>
                    {t.introMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================
                CONTACT LIST (WITH OFFICIAL REAL ICONS)
            ======================================================== */}
            <div className="space-y-2.5 sm:space-y-3 pt-0.5">

              {/* Row 1: Address Card (Official Google Maps Pin) */}
              <div
                className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#EA4335]/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <GoogleMapsPinOfficial className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                      {t.addressLabel}
                    </span>
                    <a
                      href={profile.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 hover:text-rose-600 transition-colors leading-snug truncate block"
                      title={t.openMaps}
                    >
                      {profile.address}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => copyToClipboard(profile.address, 'address')}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
                    title={t.copyAddress}
                  >
                    {copiedKey === 'address' ? <Check className="w-4 h-4 text-[#006938]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={profile.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title={t.openMaps}
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Row 2: Phone & Official Zalo Direct */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Phone */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#006938]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <PhoneOfficialIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.phoneLabel}
                      </span>
                      <a href={`tel:${profile.phone}`} className="text-sm sm:text-base md:text-lg font-black text-slate-900 hover:text-[#006938] transition-colors block truncate font-heading">
                        {profile.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => copyToClipboard(profile.phone, 'phone')}
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
                      title={t.copyPhone}
                    >
                      {copiedKey === 'phone' ? <Check className="w-4 h-4 text-[#006938]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`tel:${profile.phone}`}
                      className="p-2 sm:p-2.5 text-white bg-[#006938] hover:bg-[#00552d] rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                      title={t.callDirect}
                    >
                      <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>

                {/* Zalo with Official Real Zalo Logo Image */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0068FF]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                      <ZaloOfficialLogo className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.zaloLabel}
                      </span>
                      <a href={profile.zaloUrl} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base md:text-lg font-black text-slate-900 hover:text-[#0068FF] transition-colors block truncate font-heading">
                        {profile.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <a
                    href={profile.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0068FF] hover:bg-[#0056d6] text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 sm:gap-1.5 ml-2 font-heading"
                  >
                    <span>{t.chatZalo}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>

              </div>

              {/* Row 3: WhatsApp & Facebook */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* WhatsApp */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#25D366]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
                      <WhatsAppOfficialLogo className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.whatsappLabel}
                      </span>
                      <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base md:text-lg font-black text-slate-900 hover:text-[#25D366] transition-colors block truncate font-heading">
                        {profile.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <a
                    href={profile.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 sm:gap-1.5 ml-2 font-heading"
                  >
                    <span>WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>

                {/* Facebook */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#1877F2]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs overflow-hidden">
                      <FacebookOfficialLogo className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.facebookLabel}
                      </span>
                      <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm md:text-base font-bold text-[#1877F2] hover:underline block truncate">
                        {profile.facebookDisplay}
                      </a>
                    </div>
                  </div>
                  <a
                    href={profile.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1877F2] hover:bg-[#0c63d4] text-white text-xs font-bold rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 sm:gap-1.5 ml-2 font-heading"
                  >
                    <span>{t.connectBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>

              </div>

              {/* Row 4: Email & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Email */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#006938]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MailOfficialIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.emailLabel}
                      </span>
                      <a href={`mailto:${profile.email}`} className="text-xs sm:text-sm md:text-base font-bold text-slate-900 hover:text-[#006938] transition-colors block truncate">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.email, 'email')}
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all shrink-0 ml-2"
                    title={t.copyEmail}
                  >
                    {copiedKey === 'email' ? <Check className="w-4 h-4 text-[#006938]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Website */}
                <div
                  className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#006938]/60 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-between group shadow-xs hover:shadow-md cursor-default"
                  
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <a
                      href="https://chuoicungung.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#f0fdf4] border border-[#006938]/20 flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-transform overflow-hidden p-1.5 shadow-xs cursor-pointer"
                      title="Truy cập chuoicungung.com"
                    >
                      <img
                        src="/logo_onlyc.png"
                        alt="CCU Logo"
                        className="w-full h-full object-contain animate-[spin_6s_linear_infinite] drop-shadow-xs"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block font-heading">
                        {t.websiteLabel}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs sm:text-[12px] md:text-[13px] font-bold text-[#006938] leading-tight">
                        <a
                          href="https://chuoicungung.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline shrink-0"
                        >
                          chuoicungung.com
                        </a>
                        <span className="text-slate-400 font-normal shrink-0">-</span>
                        <a
                          href="https://chuoicungung.vn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline shrink-0"
                        >
                          chuoicungung.vn
                        </a>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://chuoicungung.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 text-[#006938] hover:bg-[#f0fdf4] rounded-xl transition-colors shrink-0 ml-1.5"
                    title={t.visitWebsite}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: 3D FLIPPABLE PORTRAIT & QR CARD (ALIGNED WITH LEFT COLUMN)
          ======================================================== */}
          <div className="w-full md:w-[290px] lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col items-center md:items-end justify-start relative order-1 md:order-2 z-20 md:pt-7 lg:pt-8">

            {/* 3D Flip Card Container with Three.js Aura & Gyroscope */}
            <div
              ref={portraitCardRef}
              onMouseEnter={handleCardMouseEnter}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onTouchMove={handleCardTouchMove}
              onTouchEnd={handleCardTouchEnd}
              onTouchCancel={handleCardTouchEnd}
              onClick={handleToggleFlip}
              className="relative w-full max-w-[340px] sm:max-w-[360px] md:max-w-[290px] lg:max-w-[320px] xl:max-w-[350px] h-[480px] sm:h-[510px] md:h-[480px] lg:h-[485px] xl:h-[495px] cursor-pointer select-none touch-manipulation group"
              style={{ perspective: 1200 }}
              title={showBack ? t.flipToFrontNotice : t.flipToBackNotice}
            >
              {/* Three.js 3D Ambient Particle Halo Background */}
              <canvas
                ref={threeCanvasRef}
                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none rounded-[36px] -z-10 opacity-75"
              />

              {/* Dynamic Holographic Light Sheen on Flip */}
              <div
                ref={shimmerRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-30 rounded-[32px] opacity-0 bg-gradient-to-r from-transparent via-white/45 to-transparent [transform:skewX(-25deg)]"
              />

              {/* Gyroscope 3D Tilt Wrapper */}
              <div
                ref={tiltWrapperRef}
                className="relative w-full h-full rounded-[32px] will-change-transform"
                style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
              >
                {/* Flippable 3D Core - Driven by GSAP power3.inOut */}
                <div
                  ref={flipCoreRef}
                  className="relative w-full h-full rounded-[32px]"
                  style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
                >

                  {/* FRONT FACE: Studio Portrait */}
                  <div
                    ref={frontFaceRef}
                    className="absolute inset-0 w-full h-full rounded-[32px] p-[2.5px] bg-gradient-to-br from-emerald-400/40 via-slate-200 to-[#006938]/40 shadow-2xl shadow-slate-900/15 flex flex-col overflow-hidden"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      transform: 'rotateY(0deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      opacity: 1,
                      visibility: 'visible'
                    }}
                  >
                    <div className="relative z-10 rounded-[30px] overflow-hidden bg-white w-full h-full shadow-inner flex-1 flex flex-col">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover pointer-events-none transition-transform duration-700"
                        style={{
                          objectPosition: 'left top'
                        }}
                      />

                      {/* Rotating Logo on Top Right of Avatar (Click to visit chuoicungung.com) */}
                      <a
                        ref={avatarRotatingLogoRef}
                        href="https://chuoicungung.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center pointer-events-auto hover:scale-125 active:scale-95 transition-all drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] cursor-pointer"
                        title="Truy cập chuoicungung.com"
                      >
                        <img
                          src="/logo_onlyc.png"
                          alt="CCU Logo"
                          className="w-full h-full object-contain animate-[spin_8s_linear_infinite]"
                        />
                      </a>

                      {/* Gyroscope Specular Mirror Glass Sheen Layer (Nhẹ nhàng, vừa phải, sang trọng) */}
                      <div
                        ref={mirrorSheenRef}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-[30px]"
                        style={{
                          mixBlendMode: 'screen',
                          opacity: 0.85
                        }}
                      />

                      {/* Glass Surface Ambient Glare */}
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-5 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
                    </div>
                  </div>

                  {/* BACK FACE: High-Res QR Code & Quick Actions */}
                  <div
                    ref={backFaceRef}
                    className="absolute inset-0 w-full h-full rounded-[32px] p-[2.5px] bg-gradient-to-br from-emerald-400/40 via-slate-200 to-[#006938]/40 shadow-2xl shadow-slate-900/10 flex flex-col justify-between text-slate-900 text-center overflow-hidden"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      opacity: 1,
                      visibility: 'visible'
                    }}
                  >
                    <div className="relative z-10 rounded-[30px] overflow-hidden bg-white p-5 sm:p-6 w-full h-full flex flex-col items-center justify-between shadow-xs">
                      {/* Back Specular Mirror Reflection */}
                      <div
                        ref={backMirrorSheenRef}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-[30px]"
                        style={{
                          mixBlendMode: 'multiply',
                          opacity: 0.2
                        }}
                      />

                      {/* Name directly above QR Code */}
                      <div className="text-center pt-1 relative z-20">
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 font-heading tracking-tight">
                          {t.nameTitle}
                        </h3>
                      </div>

                      {/* QR Code Container (chuoicungung.com/jennytrinh) */}
                      <div className="p-3 sm:p-3.5 bg-[#f0fdf4] rounded-2xl border-2 border-[#006938]/20 shadow-sm flex items-center justify-center relative z-20">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent('https://chuoicungung.com/jennytrinh')}&color=006938&bgcolor=ffffff`}
                          alt={`Mã QR ${profile.name}`}
                          className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                        />
                      </div>

                      {/* Actions on Back Face */}
                      <div className="w-full space-y-2 text-center pb-1 relative z-20">
                        <p className="text-xs text-slate-500">
                          {t.scanCameraNotice}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadVCard();
                            }}
                            className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-xs font-bold font-heading border border-[#006938] transition-all shadow-xs flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.saveContact}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================
            3. ECOSYSTEM SECTIONS (3 DEDICATED BLOCKS WITH PROMINENT HEADERS)
        ======================================================== */}
        <div ref={ecosystemRef} className="space-y-6 pt-2">

          {/* ========================================================
              BLOCK 1: HỆ SINH THÁI DOANH NGHIỆP MAY MẶC ĐỒNG PHỤC VÀ QUÀ TẶNG DOANH NGHIỆP (4 BRANDS)
          ======================================================== */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">

            {/* Header (Prominent Banner with Keywords underneath) */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#006938]/10 via-[#f0fdf4] to-emerald-50/40 border border-[#006938]/20 space-y-2.5 sm:space-y-3 shadow-xs overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                <div className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-[#006938] text-white flex items-center justify-center shadow-md shadow-[#006938]/30 shrink-0">
                  <Shirt className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <h2 className="min-w-0 flex-1 overflow-hidden leading-tight flex items-center">
                  {/* Mobile: 2 dòng */}
                  <div className="w-full sm:hidden">
                    <AutoFitTitle
                      lines={[t.garmentTitleLine1, t.garmentTitleLine2]}
                      maxFontSize={24}
                      minFontSize={10}
                    />
                  </div>
                  {/* Máy tính / Desktop & Tablet: 1 dòng duy nhất */}
                  <div className="w-full hidden sm:block">
                    <AutoFitTitle
                      text={t.garmentTitle}
                      maxFontSize={24}
                      minFontSize={10}
                    />
                  </div>
                </h2>
              </div>
              {/* Mobile: 2 dedicated lines, centered */}
              <div className="sm:hidden space-y-1.5">
                {/* Dòng 1 Keywords */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {t.garmentKeywords1.map((kw, i) => (
                    <span key={i} className="inline-flex items-center justify-center text-center px-1.5 min-[360px]:px-2 py-0.5 rounded-lg bg-emerald-100/80 border border-[#006938]/20 text-[#006938] text-[9.5px] min-[360px]:text-[10px] font-bold font-heading shadow-2xs lowercase whitespace-nowrap shrink-0">
                      {kw}
                    </span>
                  ))}
                </div>
                {/* Dòng 2 Keywords */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {t.garmentKeywords2.map((kw, i) => (
                    <span key={i} className="inline-flex items-center justify-center text-center px-1.5 min-[360px]:px-2 py-0.5 rounded-lg bg-emerald-100/80 border border-[#006938]/20 text-[#006938] text-[9.5px] min-[360px]:text-[10px] font-bold font-heading shadow-2xs lowercase whitespace-nowrap shrink-0">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop & Tablet: Exactly 1 single line */}
              <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                {[...t.garmentKeywords1, ...t.garmentKeywords2].map((kw, i) => (
                  <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-[#006938]/20 text-[#006938] text-xs font-bold font-heading shadow-2xs lowercase whitespace-nowrap shrink-0">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* 4 Cards Grid - 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
              {garmentEcosystem.map((brand) => (
                <EcosystemCard key={brand.id} brand={brand} visitText={t.visitSystem} showDownloadButton={false} />
              ))}
            </div>

          </section>

          

          {/* ========================================================
              BLOCK 4: THÔNG TIN TÀI KHOẢN NGÂN HÀNG CÔNG TY & CÁ NHÂN (MB BANK)
          ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-stretch">

            {/* BLOCK 4A: TÀI KHOẢN NGÂN HÀNG CÔNG TY */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 overflow-hidden flex flex-col justify-between">
              {/* Header */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#006938]/10 via-[#f0fdf4] to-emerald-50/40 border border-[#006938]/20 shadow-xs overflow-hidden">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#006938] text-white flex items-center justify-center shadow-md shadow-[#006938]/30 shrink-0">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="min-w-0 flex-1 overflow-hidden leading-tight flex items-center">
                    <AutoFitTitle
                      text={t.bankCompanyTitle || "TÀI KHOẢN NGÂN HÀNG CÔNG TY"}
                      maxFontSize={20}
                      minFontSize={11}
                      syncGroup="bank-block-titles"
                    />
                  </h2>
                </div>
              </div>

              {/* 3 Nút trên cùng 1 hàng ngang trong block: Tài khoản công ty - Tài khoản USD - Tài khoản PayPal */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 items-stretch w-full flex-1 py-1">
                {/* 1. Nút MB Bank (Công ty) */}
                <button
                  type="button"
                  onClick={() => setSelectedBankModal(companyBankAccount)}
                  className="group relative p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#006938] hover:shadow-md hover:bg-gradient-to-b hover:from-white hover:to-[#f0fdf4]/50 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer min-h-[74px] sm:min-h-[86px]"
                  title="Tài khoản MB Bank công ty"
                >
                  <div className="h-6 sm:h-7 flex items-center justify-center">
                    <img
                      src="/images/banks/Logo_MB_new.png"
                      alt="MB Bank"
                      className="max-h-6 sm:max-h-7 w-auto max-w-[88%] object-contain filter group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    />
                  </div>
                  <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-[#006938] leading-tight mt-1 text-center font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                    Tài khoản công ty
                  </span>
                </button>

                {/* 2. Nút Tài khoản USD */}
                <button
                  type="button"
                  onClick={() => setSelectedBankModal(companyUsdAccount)}
                  className="group relative p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#002882] hover:bg-blue-50/40 hover:shadow-md transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer min-h-[74px] sm:min-h-[86px]"
                  title="Tài khoản USD"
                >
                  <div className="h-6 sm:h-7 flex items-center justify-center gap-1 text-[#002882]">
                    <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 group-hover:scale-110 transition-transform stroke-[2.5]" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide">USD</span>
                  </div>
                  <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-[#002882] leading-tight mt-1 text-center font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                    Tài khoản USD
                  </span>
                </button>

                {/* 3. Nút Tài khoản PayPal */}
                <a
                  href="https://paypal.me/vnsupplychain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#0079C1] hover:bg-gradient-to-b hover:from-white hover:to-blue-50/50 hover:shadow-md transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer min-h-[74px] sm:min-h-[86px]"
                  title="Thanh toán qua PayPal (https://paypal.me/vnsupplychain)"
                >
                  <div className="h-6 sm:h-7 flex items-center justify-center">
                    <img
                      src="/images/banks/paypal.svg"
                      alt="PayPal"
                      className="h-4 sm:h-5 w-auto object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-[#0079C1] leading-tight mt-1 text-center font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                    Tài khoản PayPal
                  </span>
                </a>
              </div>
            </section>

            {/* BLOCK 4B: TÀI KHOẢN NGÂN HÀNG CÁ NHÂN */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 overflow-hidden flex flex-col justify-between">
              {/* Header */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#006938]/10 via-[#f0fdf4] to-emerald-50/40 border border-[#006938]/20 shadow-xs overflow-hidden">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#006938] text-white flex items-center justify-center shadow-md shadow-[#006938]/30 shrink-0">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="min-w-0 flex-1 overflow-hidden leading-tight flex items-center">
                    <AutoFitTitle
                      text={t.bankPersonalTitle || "TÀI KHOẢN NGÂN HÀNG CÁ NHÂN"}
                      maxFontSize={20}
                      minFontSize={11}
                      syncGroup="bank-block-titles"
                    />
                  </h2>
                </div>
              </div>

              {/* 1 Logo MB Bank */}
              <div className="flex items-center justify-center w-full flex-1 py-1">
                <button
                  type="button"
                  onClick={() => setSelectedBankModal(personalBankAccount)}
                  className="group relative p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#006938] hover:shadow-md hover:bg-gradient-to-b hover:from-white hover:to-[#f0fdf4]/50 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer w-full min-h-[74px] sm:min-h-[86px]"
                  title="Xem mã QR - MB Bank (Cá nhân)"
                >
                  <div className="h-6 sm:h-7 flex items-center justify-center">
                    <img
                      src="/images/banks/Logo_MB_new.png"
                      alt="MB Bank"
                      className="max-h-6 sm:max-h-7 w-auto max-w-[88%] object-contain filter group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    />
                  </div>
                  <span className="text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover:text-[#006938] leading-tight mt-1 text-center font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                    Tài khoản cá nhân
                  </span>
                </button>
              </div>
            </section>

          </div>

          {/* ========================================================
              BLOCK 5: THÔNG TIN XUẤT HOÁ ĐƠN
          ======================================================== */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 overflow-hidden">
            {/* Header */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#006938]/10 via-[#f0fdf4] to-emerald-50/40 border border-[#006938]/20 shadow-xs overflow-hidden">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#006938] text-white flex items-center justify-center shadow-md shadow-[#006938]/30 shrink-0">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h2 className="min-w-0 flex-1 overflow-hidden leading-tight flex items-center">
                  <AutoFitTitle
                    text={t.companyInfoTitle || "THÔNG TIN XUẤT HOÁ ĐƠN"}
                    maxFontSize={20}
                    minFontSize={11}
                    syncGroup="company-info-title"
                  />
                </h2>
              </div>
            </div>

            {/* Nội dung thông tin xuất hoá đơn */}
            <div className="space-y-3 font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_system-ui,_-apple-system,_sans-serif]">
              {/* Tên công ty & Mã số thuế (MST kế tên công ty) & Nút sao chép toàn bộ thông tin */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-slate-50 to-white border border-emerald-100/90 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider block font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                    {t.companyNameLabel || "Doanh nghiệp / Đơn vị xuất hoá đơn"}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <span className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]">
                      Công ty TNHH Chuỗi Cung Ứng VN
                    </span>
                    <span className="hidden sm:inline text-slate-300 font-normal">|</span>
                    {/* On Desktop: MST is displayed inline next to company name */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 py-0.5 px-2 rounded-lg bg-white border border-emerald-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-500">MST:</span>
                      <span className="font-mono font-black text-[#006938] text-xs sm:text-sm">0319430529</span>
                    </div>
                  </div>
                </div>

                {/* On Mobile: MST badge & Nút sao chép toàn bộ nằm NGANG HÀNG với nhau */}
                <div className="flex sm:hidden items-center gap-2 pt-0.5">
                  <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white border border-emerald-200/80 shadow-2xs shrink-0">
                    <span className="text-[11px] font-bold text-slate-500">MST:</span>
                    <span className="font-mono font-black text-[#006938] text-xs">0319430529</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAllCompanyInfo}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-[#006938] hover:text-[#006938] text-slate-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]"
                    title="Sao chép toàn bộ thông tin xuất hoá đơn"
                  >
                    {copiedField === "allCompanyInfo" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 text-[11px] font-bold">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-bold">Sao chép toàn bộ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* On Desktop: Nút sao chép toàn bộ */}
                <button
                  type="button"
                  onClick={handleCopyAllCompanyInfo}
                  className="hidden sm:inline-flex self-start md:self-auto items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#006938] hover:text-[#006938] text-slate-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 font-['Plus_Jakarta_Sans',_'Be_Vietnam_Pro',_sans-serif]"
                  title="Sao chép toàn bộ thông tin xuất hoá đơn"
                >
                  {copiedField === "allCompanyInfo" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px] font-bold">Đã chép toàn bộ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">Sao chép toàn bộ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hàng 1: Tên đại diện & Số điện thoại (cùng hàng) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px]">
                {/* 1. Đại diện & Chức vụ */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block text-[11px]">Đại diện pháp luật</span>
                    <span className="font-bold text-slate-900 text-[13px]">
                      Nguyễn Thị Hà Trinh <span className="font-medium text-emerald-800 text-xs">({profile.companyRole || "Giám Đốc"})</span>
                    </span>
                  </div>
                </div>

                {/* 2. Số điện thoại */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-500 font-medium block text-[11px]">Số điện thoại</span>
                    <a href="tel:0937151290" className="font-mono font-black text-slate-900 hover:text-[#006938] text-sm block">
                      0937 151 290
                    </a>
                  </div>
                </div>
              </div>

              {/* Hàng 2: Địa chỉ và Email gửi hoá đơn (cùng hàng) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px]">
                {/* 3. Địa chỉ */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-slate-500 font-medium block text-[11px]">Địa chỉ xuất hoá đơn</span>
                    <span className="font-semibold text-slate-800 leading-snug block">
                      29 Quách Văn Tuấn, Phường Bảy Hiền, Tp.HCM
                    </span>
                  </div>
                </div>

                {/* 4. Email gửi hoá đơn */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-500 font-medium block text-[11px]">Email gửi hoá đơn</span>
                    <a
                      href="mailto:info@chuoicungung.vn"
                      className="font-bold text-[#006938] hover:underline truncate block text-xs sm:text-[13px]"
                    >
                      info@chuoicungung.vn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              NÚT TẢI HỒ SƠ NĂNG LỰC & CATALOGUE ĐỒNG PHỤC (TRÊN CÙNG 1 HÀNG)
          ======================================================== */}
          <div className="w-full pt-4 sm:pt-6 pb-2 flex flex-nowrap items-center justify-center gap-3 sm:gap-6 md:gap-8 max-w-2xl mx-auto px-1 sm:px-0">

            {/* Nút tải Hồ Sơ Năng Lực (button_hsnl.png) */}
            <a
              href="/catalogues/ho_so_nang_luc.pdf"
              download="ho_so_nang_luc.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 min-w-0 max-w-[200px] sm:max-w-[240px] md:max-w-[260px] inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 drop-shadow-sm hover:drop-shadow-lg cursor-pointer shrink-0"
              title="Tải ngay Hồ Sơ Năng Lực (ho_so_nang_luc.pdf)"
            >
              <img
                src="/images/button_hsnl.png"
                alt="Tải Hồ Sơ Năng Lực"
                className="w-full h-auto max-h-11 min-[380px]:max-h-12 sm:max-h-14 md:max-h-16 object-contain transition-transform"
              />
            </a>

            {/* Nút tải Catalogue Đồng Phục */}
            <a
              href="/catalogues/CATALOGUE_DP.pdf"
              download="CATALOGUE_DP.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 min-w-0 max-w-[200px] sm:max-w-[240px] md:max-w-[260px] inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 drop-shadow-sm hover:drop-shadow-lg cursor-pointer shrink-0"
              title="Tải ngay Catalogue Đồng Phục (CATALOGUE_DP.pdf)"
            >
              <img
                src="/images/button_DP.png"
                alt="Tải Catalogue Đồng Phục"
                className="w-full h-auto max-h-11 min-[380px]:max-h-12 sm:max-h-14 md:max-h-16 object-contain transition-transform"
              />
            </a>

          </div>

        </div>

      </main>

      {/* ========================================================
          5. MOBILE STICKY BOTTOM ACTION BAR
      ======================================================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl flex items-center gap-2">
        <a
          href={`tel:${profile.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#006938] text-white text-xs font-bold shadow-xs active:scale-95 font-heading"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{t.callNow}</span>
        </a>
        <a
          href={profile.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0068FF] text-white text-xs font-bold shadow-xs active:scale-95 font-heading"
        >
          <img src="/images/zalo_official.svg" alt="Zalo" className="w-4 h-4 object-contain shrink-0" />
          <span>{t.mobileChatZalo}</span>
        </a>
        <button
          onClick={handleDownloadVCard}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          title={t.saveVCard}
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowQrModal(true)}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          title={t.mobileQr}
        >
          <QrCode className="w-4 h-4" />
        </button>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors active:scale-95"
          title={t.share}
        >
          <Share2 className="w-4 h-4 text-[#006938]" />
        </button>
      </div>

      {/* ========================================================
          QR CODE MODAL
      ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#006938] shadow-md shadow-[#006938]/20 shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10.5px] font-black text-[#006938] uppercase tracking-widest block font-heading">
                  {t.qrModalBadge}
                </span>
                <h3 className="text-xl font-black text-slate-900 font-heading">
                  {t.nameTitle}
                </h3>
                <p className="text-xs text-[#006938] font-extrabold uppercase">
                  {t.title} • {t.company}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent('https://chuoicungung.com/jennytrinh')}&color=006938&bgcolor=ffffff`}
                alt={`Mã QR ${profile.name}`}
                className="w-52 h-52 mx-auto rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                {t.qrModalScanNotice}
              </p>
              <button
                onClick={handleDownloadVCard}
                className="w-full py-3 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-xs font-bold uppercase tracking-wider font-heading shadow-md"
              >
                {t.qrModalDownloadBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BANK INFORMATION & QR CODE MODAL
      ======================================================== */}
      {selectedBankModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setSelectedBankModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 text-center relative max-h-[92vh] overflow-y-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Action Bar */}
            <div className={`flex items-center ${selectedBankModal.noQr ? 'justify-end' : 'justify-between'} gap-3 pt-0.5`}>
              {!selectedBankModal.noQr && (
                <a
                  href={selectedBankModal.qrImage}
                  download={`QR_${selectedBankModal.id}_JENNY_TRINH.jpg`}
                  className="py-2 px-3.5 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-xs font-bold font-heading shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  title={t.bankDownloadQr || "Tải ảnh"}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.bankDownloadQr || "Tải ảnh"}</span>
                </a>
              )}

              {/* Nút Đóng */}
              <button
                type="button"
                onClick={() => setSelectedBankModal(null)}
                className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-heading flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ml-auto"
                title="Đóng"
              >
                <X className="w-3.5 h-3.5" />
                <span>Đóng</span>
              </button>
            </div>

            {/* TRƯỜNG HỢP 1: TÀI KHOẢN CÔNG TY (VND) - KHÔNG DÙNG QR CODE */}
            {selectedBankModal.type === 'company' && (
              <div className="space-y-3.5 py-1 text-left">
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-center">
                  <img
                    src={selectedBankModal.logo}
                    alt={selectedBankModal.bankName}
                    className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs mb-1.5"
                  />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-heading">
                    TÀI KHOẢN NGÂN HÀNG CÔNG TY
                  </span>
                </div>

                {/* Khối thông tin chi tiết */}
                <div className="p-4 bg-emerald-50/80 border border-[#006938]/20 rounded-2xl space-y-3">
                  {/* STK Công Ty */}
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block">STK Công Ty:</span>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="font-mono font-black text-lg sm:text-xl text-[#006938] tracking-wider">
                        {selectedBankModal.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyBankNumber(e, selectedBankModal)}
                        className="py-1 px-2.5 rounded-lg bg-white border border-emerald-200 text-[#006938] hover:bg-emerald-100/50 shadow-2xs transition-all active:scale-95 flex items-center gap-1 text-xs font-bold cursor-pointer"
                        title="Sao chép STK"
                      >
                        {copiedBankId === selectedBankModal.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.shareCopyLinkBtn || 'Chép'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Ngân hàng */}
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-[11px] font-medium text-slate-500 block">Ngân hàng:</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
                      {selectedBankModal.bankName}
                    </span>
                  </div>

                  {/* Tên TK */}
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-[11px] font-medium text-slate-500 block">Tên TK:</span>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="font-extrabold text-xs sm:text-[13px] text-slate-900 uppercase font-heading leading-snug">
                        {selectedBankModal.accountHolder}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedBankModal.accountHolder, "bankHolder")}
                        className="p-1 rounded-md text-emerald-700 hover:bg-white transition-all shrink-0 cursor-pointer"
                        title="Sao chép tên chủ tài khoản"
                      >
                        {copiedField === "bankHolder" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nút Sao chép toàn bộ thông tin */}
                <button
                  type="button"
                  onClick={() => {
                    const fullInfo = `STK Công Ty: ${selectedBankModal.accountNumber} - ${selectedBankModal.bankName}\nTên TK: ${selectedBankModal.accountHolder}`;
                    handleCopyText(fullInfo, "allBankInfo");
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-xs font-black uppercase tracking-wider font-heading shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  {copiedField === "allBankInfo" ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Đã sao chép thông tin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép toàn bộ thông tin</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TRƯỜNG HỢP 2: COMPANY - USD ACCOUNT */}
            {selectedBankModal.type === 'company-usd' && (
              <div className="space-y-3.5 py-1 text-left">
                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-center">
                  <img
                    src={selectedBankModal.logo}
                    alt={selectedBankModal.bankName}
                    className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs mb-1.5"
                  />
                  <div className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-blue-100 text-[#003087] text-[11px] font-black uppercase tracking-wider font-heading">
                    <Globe className="w-3 h-3" />
                    <span>COMPANY - USD ACCOUNT</span>
                  </div>
                </div>

                {/* Khối thông tin chi tiết USD */}
                <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-2xl space-y-2.5 text-xs">
                  {/* Bank name */}
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block">Bank name:</span>
                    <span className="font-bold text-slate-900 block leading-snug mt-0.5">
                      {selectedBankModal.bankName}
                    </span>
                  </div>

                  {/* Swift code */}
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block">Swift code:</span>
                      <span className="font-mono font-black text-slate-900 text-sm mt-0.5 block">
                        {selectedBankModal.swiftCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedBankModal.swiftCode, "swiftCode")}
                      className="p-1 rounded-md text-blue-700 hover:bg-white transition-all shrink-0 cursor-pointer"
                      title="Copy Swift Code"
                    >
                      {copiedField === "swiftCode" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Account */}
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block">Account:</span>
                      <span className="font-mono font-black text-blue-900 text-base mt-0.5 block">
                        {selectedBankModal.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedBankModal.accountNumber, "usdAccount")}
                      className="p-1 rounded-md text-blue-700 hover:bg-white transition-all shrink-0 cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedField === "usdAccount" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block">Account Name:</span>
                      <span className="font-extrabold text-slate-900 uppercase font-heading text-xs mt-0.5 block">
                        {selectedBankModal.accountHolder}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedBankModal.accountHolder, "usdHolder")}
                      className="p-1 rounded-md text-blue-700 hover:bg-white transition-all shrink-0 cursor-pointer"
                      title="Copy Account Name"
                    >
                      {copiedField === "usdHolder" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nút Copy All Details */}
                <button
                  type="button"
                  onClick={() => {
                    const fullUsdInfo = `Bank name: ${selectedBankModal.bankName}\nSwift code: ${selectedBankModal.swiftCode}\nAccount: ${selectedBankModal.accountNumber}\nAccount Name: ${selectedBankModal.accountHolder}`;
                    handleCopyText(fullUsdInfo, "allUsdInfo");
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#003087] hover:bg-[#002266] text-white text-xs font-black uppercase tracking-wider font-heading shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  {copiedField === "allUsdInfo" ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied All Bank Details</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy All Bank Details</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TRƯỜNG HỢP 3: TÀI KHOẢN CÁ NHÂN (HOẶC TÀI KHOẢN CÓ QR CODE) */}
            {!selectedBankModal.noQr && (
              <>
                {/* QR Image Container */}
                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center">
                  <img
                    src={selectedBankModal.qrImage}
                    alt={`Mã QR ${selectedBankModal.bankName}`}
                    className="w-full max-w-[270px] h-auto object-contain rounded-xl shadow-md border border-slate-200/80"
                  />
                </div>

                {/* Account Details Box */}
                <div className="p-3.5 bg-emerald-50/70 border border-[#006938]/20 rounded-2xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{t.bankAccountHolder}:</span>
                    <span className="font-extrabold text-slate-900 uppercase font-heading">
                      {selectedBankModal.accountHolder}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{t.bankAccountNum}:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-[#006938] text-sm">
                        {selectedBankModal.accountNumberDisplay || selectedBankModal.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyBankNumber(e, selectedBankModal)}
                        className="p-1 rounded-md text-emerald-700 hover:bg-white hover:shadow-xs transition-all active:scale-95 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        {copiedBankId === selectedBankModal.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 text-[10.5px]">{t.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10.5px]">{t.shareCopyLinkBtn || 'Chép'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ========================================================
          SEND MESSAGE MODAL
      ======================================================== */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 relative text-left">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10.5px] font-black text-[#006938] uppercase tracking-widest block font-heading">
                {t.contactModalBadge}
              </span>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                {t.contactModalTitle} {profile.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.contactModalSubtitle}
              </p>
            </div>

            {isSent ? (
              <div className="py-8 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">{t.contactSentSuccessTitle}</h4>
                <p className="text-xs text-emerald-700">{t.contactSentSuccessDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t.contactNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.contactNamePlaceholder}
                    value={messageForm.name}
                    onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#006938] bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t.contactPhoneLabel}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.contactPhonePlaceholder}
                    value={messageForm.phone}
                    onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#006938] bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t.contactContentLabel}</label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.contactContentPlaceholder}
                    value={messageForm.content}
                    onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#006938] bg-slate-50 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#006938] hover:bg-[#00552d] text-white text-xs font-bold uppercase tracking-wider font-heading shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contactSendBtn}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================
          SHARE MODAL (INTERACTIVE FOR ANDROID & ALL DEVICES)
      ======================================================== */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 relative text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10.5px] font-black text-[#006938] uppercase tracking-widest block font-heading">
                {t.shareModalBadge || "CHIA SẺ DANH THIẾP"}
              </span>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                {t.shareModalTitle || "Chia Sẻ Danh Thiếp Điện Tử"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.shareModalSubtitle || "Gửi danh thiếp Nguyễn Thị Hà Trinh đến bạn bè & đối tác"}
              </p>
            </div>

            {/* Profile preview snippet */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#006938] shadow-xs shrink-0">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate font-heading">{profile.name}</div>
                <div className="text-[11px] text-[#006938] font-semibold truncate">{profile.company}</div>
                <div className="text-[10.5px] text-slate-500 truncate">{window.location.origin + window.location.pathname}</div>
              </div>
            </div>

            {/* Direct Social Channels Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              {/* Zalo */}
              <a
                href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200 hover:border-[#0068FF] hover:bg-blue-50/50 transition-all active:scale-95 group shadow-2xs"
              >
                <ZaloOfficialLogo className="w-9 h-9" />
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#0068FF] font-heading">{t.shareViaZalo || "Zalo"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.shareViaZaloSub || "Gửi qua Zalo"}</div>
                </div>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200 hover:border-[#1877F2] hover:bg-blue-50/50 transition-all active:scale-95 group shadow-2xs"
              >
                <FacebookOfficialLogo className="w-9 h-9" />
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#1877F2] font-heading">{t.shareViaFacebook || "Facebook"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.shareViaFacebookSub || "Đăng lên Facebook"}</div>
                </div>
              </a>

              {/* Messenger */}
              <a
                href={`fb-messenger://share?link=${encodeURIComponent(window.location.href)}`}
                onClick={(e) => {
                  setTimeout(() => {
                    window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(window.location.href)}`, '_blank');
                  }, 400);
                }}
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200 hover:border-[#00B2FE] hover:bg-sky-50/50 transition-all active:scale-95 group shadow-2xs"
              >
                <MessengerOfficialLogo className="w-9 h-9" />
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#006AFF] font-heading">{t.shareViaMessenger || "Messenger"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.shareViaMessengerSub || "Gửi Messenger"}</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent((t.nameTitle || 'NGUYỄN THỊ HÀ TRINH') + ' - Danh thiếp điện tử: ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200 hover:border-[#25D366] hover:bg-emerald-50/50 transition-all active:scale-95 group shadow-2xs"
              >
                <WhatsAppOfficialLogo className="w-9 h-9" />
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#25D366] font-heading">{t.shareViaWhatsApp || "WhatsApp"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.shareViaWhatsAppSub || "Gửi WhatsApp"}</div>
                </div>
              </a>

              {/* SMS Message */}
              <a
                href={`sms:?body=${encodeURIComponent((t.nameTitle || 'NGUYỄN THỊ HÀ TRINH') + ' - Danh thiếp điện tử: ' + window.location.href)}`}
                className="col-span-2 flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200 hover:border-[#10B981] hover:bg-emerald-50/50 transition-all active:scale-95 group shadow-2xs"
              >
                <SmsOfficialIcon className="w-9 h-9" />
                <div className="min-w-0 text-left flex-1">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-[#10B981] font-heading">{t.shareViaSms || "Tin Nhắn SMS"}</div>
                  <div className="text-[10px] text-slate-500 truncate">{t.shareViaSmsSub || "Mở ứng dụng tin nhắn điện thoại"}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#10B981] transition-colors" />
              </a>
            </div>

            {/* Native OS Share Button if available */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: t.nameTitle || 'NGUYỄN THỊ HÀ TRINH | JENNY TRINH',
                      text: 'Kết nối cùng Doanh nhân Nguyễn Thị Hà Trinh - Chuỗi Cung Ứng (Danh thiếp điện tử)',
                      url: window.location.href
                    });
                  } catch (err) { }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 font-heading shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mở menu chia sẻ hệ thống (Android / iOS)</span>
              </button>
            )}

            {/* Copy Link Section */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-xs text-slate-600 px-2 flex-1 outline-none font-mono truncate select-all"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => copyToClipboard(window.location.href, 'modal_share')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 font-heading shrink-0 ${copiedKey === 'modal_share'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#006938] hover:bg-[#00552d] text-white shadow-xs'
                    }`}
                >
                  {copiedKey === 'modal_share' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copied || "Đã chép"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.shareCopyLinkBtn || "Sao chép"}</span>
                    </>
                  )}
                </button>
              </div>
              {copiedKey === 'modal_share' && (
                <p className="text-[11px] text-emerald-600 font-medium text-center mt-1.5 animate-in fade-in">
                  {t.shareCopiedSuccess || "Đã sao chép liên kết vào bộ nhớ tạm!"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
