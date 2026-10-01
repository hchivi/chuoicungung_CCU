import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Factory, ExternalLink, ChevronRight, Globe, Layers, MapPin, Users, ShoppingBag, Check,
  Sparkles, Compass, ShieldCheck, TrendingUp, Navigation, Anchor, Plane, Sliders
} from 'lucide-react';
import KcnGisMap from '../components/kcn/KcnGisMap';
import { vietnamMapRegions, topProvincesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function VietnamMapPage() {
  const { t, lang } = useLanguage();
  const [activeSelection, setActiveSelection] = useState({ type: 'region', name: 'Toàn quốc' });
  const [flyToTarget, setFlyToTarget] = useState(null);

  // Full list of regions including "Toàn quốc"
  const allRegionsList = [
    {
      name: lang === 'en' ? "Nationwide" : "Toàn quốc",
      kcn: 480,
      factories: 14237,
      pct: "100%",
      desc: lang === 'en' ? "Full perspective of industrial manufacturing network across 34 provinces/cities in Vietnam." : "Toàn cảnh mạng lưới quỹ đất và hạ tầng công nghiệp trên 34 tỉnh/thành phố Việt Nam."
    },
    ...vietnamMapRegions
  ];

  const handleSelectRegion = (regName) => {
    setActiveSelection({ type: 'region', name: regName });
    setFlyToTarget({ type: 'region', name: regName, timestamp: Date.now() });
  };

  const handleSelectProvince = (provName) => {
    setActiveSelection({ type: 'province', name: provName });
    setFlyToTarget({ type: 'province', name: provName, timestamp: Date.now() });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 pt-3 sm:pt-5 bg-[#F8FAFC] min-h-screen font-sans text-slate-900 selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP MACRO COMMAND BAR & BREADCRUMB                                     */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/khu-cong-nghiep" className="hover:text-blue-600 font-medium">Khu công nghiệp</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-700 font-bold uppercase font-heading">
            Sa Bàn Số GIS &amp; Hạ Tầng Vĩ Mô Quốc Gia
          </span>
        </div>

        {/* Title & Authority Badges */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase font-heading tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>HỆ THỐNG THÔNG TIN ĐỊA LÝ GIS CHUẨN QUỐC TẾ CHO DÒNG VỐN FDI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading uppercase tracking-tight">
              Sa Bàn Quỹ Đất &amp; Hạ Tầng Công Nghiệp Việt Nam
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Tích hợp 480+ Khu công nghiệp, cụm công nghiệp sinh thái, 14.237 nhà máy FDI và toàn bộ mạng lưới logistics cảng biển nước sâu, sân bay quốc tế, tuyến cao tốc huyết mạch.
            </p>
          </div>

          {/* 4 Prominent Macro Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center shrink-0">
            <div className="bg-white px-3 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-base sm:text-xl font-black text-blue-600 font-mono">480+</span>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase font-heading">Khu Công Nghiệp</p>
            </div>
            <div className="bg-white px-3 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-base sm:text-xl font-black text-emerald-600 font-mono">132.500 Ha</span>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase font-heading">Quỹ Đất Sẵn Sàng</p>
            </div>
            <div className="bg-white px-3 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-base sm:text-xl font-black text-purple-600 font-mono">14.237</span>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase font-heading">Nhà Máy FDI</p>
            </div>
            <div className="bg-white px-3 py-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
              <span className="text-base sm:text-xl font-black text-rose-600 font-mono">32.000+</span>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase font-heading">NCC Phụ Trợ</p>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. THE FLAGSHIP GIS MAP WORKSPACE (FULL SCREEN COMMAND CENTER)             */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white h-[760px] sm:h-[820px] lg:h-[860px]">
          <KcnGisMap 
            height="100%"
            externalFlyTo={flyToTarget}
            isStandalonePage={true}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 5 KEY ECONOMIC REGIONS STRATEGIC PERSPECTIVE                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
            Khám Phá Chi Tiết 5 Vùng Kinh Tế Trọng Điểm
          </h3>
          <span className="text-xs text-slate-400">Bấm để tự động định vị trên sa bàn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {vietnamMapRegions.map((reg, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition group cursor-pointer"
              onClick={() => handleSelectRegion(reg.name)}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#072348] group-hover:text-blue-600 transition font-heading">
                    {reg.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {reg.pct}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-700 font-mono">
                  {reg.kcn} KCN • {reg.factories.toLocaleString('vi-VN')} Nhà máy
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {reg.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-800 font-heading uppercase">
                <span>Phóng to trên sa bàn</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CALL TO ACTION FOR INVESTORS & FDI ENTERPRISES                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-400/20 text-amber-300 text-[11px] font-bold font-heading uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cổng Dịch Vụ Hỗ Trợ Xúc Tiến Đầu Tư Quốc Gia</span>
            </div>
            <h3 className="text-xl font-bold font-heading">
              Bạn Cần Khảo Sát Quỹ Đất Hoặc Tìm Nhà Thầu Xây Dựng Nhà Máy?
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Hệ thống Chuỗi Cung Ứng kết nối trực tiếp với Ban Quản Lý 480 KCN và 32.000+ Nhà thầu phụ trợ đã xác thực trong 18 Pha triển khai nhà máy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/dang-nhu-cau"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition uppercase tracking-wider font-heading shadow-md"
            >
              Đăng Ký Khảo Sát Quỹ Đất →
            </Link>
            <Link
              to="/khu-cong-nghiep"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider font-heading border border-white/30"
            >
              Tra Cứu Danh Bạ 480 KCN
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
