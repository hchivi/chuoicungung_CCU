import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Factory, ExternalLink, ChevronRight, Globe, Layers, MapPin, Users, ShoppingBag, Check
} from 'lucide-react';
import InteractiveVietnamMap from '../components/InteractiveVietnamMap';
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
      desc: lang === 'en' ? "Full perspective of industrial manufacturing network across 34 provinces/cities in Vietnam." : "Toàn cảnh mạng lưới sản xuất và công nghiệp trên 34 tỉnh/thành phố Việt Nam."
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
    <div className="space-y-6 sm:space-y-8 pb-20 pt-4 sm:pt-6 bg-slate-50/60 min-h-screen font-sans">
      
      {/* 1. Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold uppercase font-heading">{lang === 'en' ? 'Digital Industrial Ecosystem Map' : 'Bản đồ số Hệ sinh thái Sản xuất'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#072348] font-heading uppercase tracking-tight">
              {lang === 'en' ? 'VIETNAM MANUFACTURING ECOSYSTEM MAP' : 'BẢN ĐỒ HỆ SINH THÁI SẢN XUẤT VIỆT NAM'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1 max-w-2xl">
              {lang === 'en' 
                ? 'Interactive GIS platform mapping 480 Industrial Parks, 14,237 Factories, 32,000+ Verified Suppliers, and B2B Sourcing Demands across Vietnam.' 
                : 'Nền tảng GIS trực quan phân bố 480 Khu công nghiệp, 14.237 Nhà máy, 32.000+ Nhà cung ứng và Nhu cầu B2B trên khắp Việt Nam.'}
            </p>
          </div>

          {/* 4 Prominent Header Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 text-center shrink-0">
            <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-sm sm:text-lg font-black text-blue-600 font-mono">480</span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp'}</p>
            </div>
            <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-sm sm:text-lg font-black text-emerald-600 font-mono">14.237</span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{lang === 'en' ? 'Factories' : 'Nhà máy sản xuất'}</p>
            </div>
            <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-sm sm:text-lg font-black text-purple-600 font-mono">32.000+</span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{lang === 'en' ? 'Suppliers' : 'Nhà cung ứng'}</p>
            </div>
            <div className="bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-sm sm:text-lg font-black text-rose-600 font-mono">1.256</span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{lang === 'en' ? 'B2B Demands' : 'Nhu cầu B2B'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Map Interactive Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Main Leaflet Map with 4 Switchable Tabs */}
          <div className="lg:col-span-8 xl:col-span-9 h-[440px] sm:h-[580px] lg:h-full lg:min-h-[820px]">
            <InteractiveVietnamMap 
              height="100%" 
              externalFlyTo={flyToTarget}
            />
          </div>

          {/* Right Regional Analytics */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-5 text-xs">
            
            {/* THỐNG KÊ VÙNG KINH TẾ */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                  {lang === 'en' ? 'ECONOMIC REGIONS STATS' : 'THỐNG KÊ VÙNG KINH TẾ'}
                </h3>
                <span className="text-[10px] font-bold text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-md">
                  480 {lang === 'en' ? 'IPs' : 'KCN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{lang === 'en' ? 'Click tab to zoom & filter directly on map:' : 'Nhấp vào tab để phóng to và lọc trực tiếp trên bản đồ:'}</p>
              
              <div className="space-y-1.5">
                {allRegionsList.map(reg => {
                  const isActive = activeSelection.type === 'region' && activeSelection.name === reg.name;
                  return (
                    <button
                      key={reg.name}
                      onClick={() => handleSelectRegion(reg.name)}
                      className={`w-full text-left flex justify-between items-center p-2.5 rounded-2xl border transition duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40' 
                          : 'bg-slate-50/90 border-slate-200/70 text-slate-800 hover:bg-blue-50/80 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <strong className={`block text-xs font-heading ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {reg.name}
                          </strong>
                          {isActive && <Check className="w-3 h-3 text-sky-200 shrink-0" />}
                        </div>
                        <span className={`text-[10px] block ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                          {reg.pct} {lang === 'en' ? 'of country' : 'cả nước'}
                        </span>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className={`font-black font-mono block ${isActive ? 'text-amber-300' : 'text-blue-700'}`}>
                          {reg.kcn} {lang === 'en' ? 'IPs' : 'KCN'}
                        </span>
                        <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                          {reg.factories.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} {lang === 'en' ? 'Plants' : 'NM'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOP TỈNH / THÀNH PHỐ DẪN ĐẦU */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] font-heading">
                {lang === 'en' ? 'TOP LEADING INDUSTRIAL PROVINCES' : 'TOP TỈNH THÀNH DẪN ĐẦU KCN'}
              </h3>
              <p className="text-[11px] text-slate-400">{lang === 'en' ? 'Click province to locate & open directory:' : 'Nhấp vào tỉnh để định vị và mở danh sách:'}</p>
              
              <div className="space-y-1.5">
                {topProvincesData.map((prov, idx) => {
                  const isActive = activeSelection.type === 'province' && activeSelection.name === prov.name;
                  return (
                    <button 
                      key={prov.name}
                      onClick={() => handleSelectProvince(prov.name)}
                      className={`w-full text-left flex items-center justify-between p-2 rounded-xl border transition duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-400/30 shadow-xs'
                          : 'bg-transparent border-transparent text-slate-800 hover:bg-blue-50/70 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center font-mono ${
                          idx < 3 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <strong className={`text-xs ${isActive ? 'text-blue-900 font-black' : 'text-slate-800'}`}>
                          {prov.name}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-blue-700 font-mono block">{prov.kcn} {lang === 'en' ? 'IPs' : 'KCN'}</span>
                        <span className="text-[10px] text-slate-400">{prov.factories} {lang === 'en' ? 'Plants' : 'NM'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Bottom Regional Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide font-heading">
          {lang === 'en' ? 'EXPLORE 5 KEY ECONOMIC REGIONS' : 'KHÁM PHÁ CHI TIẾT 5 VÙNG KINH TẾ TRỌNG ĐIỂM'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {vietnamMapRegions.map((reg, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition group">
              <div className="space-y-1.5">
                <h4 className="font-black text-sm text-[#072348] group-hover:text-blue-600 transition font-heading">
                  {reg.name}
                </h4>
                <div className="text-[11px] font-bold text-blue-600 font-mono">
                  {reg.kcn} {lang === 'en' ? 'IPs' : 'KCN'} • {reg.factories.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} {lang === 'en' ? 'Factories' : 'Nhà máy'}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {reg.desc}
                </p>
              </div>
              <button 
                onClick={() => handleSelectRegion(reg.name)}
                className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-100 uppercase tracking-wide font-heading cursor-pointer text-left"
              >
                <span>{lang === 'en' ? 'View on map' : 'Xem trên bản đồ'}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#072348] via-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="text-lg font-bold font-heading">{lang === 'en' ? 'Is your enterprise operating inside an Industrial Park?' : 'Doanh nghiệp của bạn đang hoạt động trong KCN?'}</h3>
            <p className="text-xs text-slate-300 mt-1">{lang === 'en' ? 'Register your plant and products on Vietnam National Supply Chain Map.' : 'Đăng ký niêm yết nhà xưởng và sản phẩm vào bản đồ chuỗi cung ứng quốc gia.'}</p>
          </div>
          <Link
            to="/dang-nhu-cau"
            className="px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-xl text-xs transition whitespace-nowrap uppercase tracking-wider font-heading shadow-md"
          >
            {lang === 'en' ? 'Register Listing Now →' : 'Đăng ký hiển thị ngay →'}
          </Link>
        </div>
      </section>

    </div>
  );
}
