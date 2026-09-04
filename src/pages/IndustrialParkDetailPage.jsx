import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, Navigation, Download, Zap, Droplets,
  Factory, Search, Filter, Layers, HelpCircle, ExternalLink, Send
} from 'lucide-react';
import fullKcnFallback from '../data/industrialParksFull.json';
import { useLanguage } from '../contexts/LanguageContext';

export default function IndustrialParkDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const [kcn, setKcn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('factories');
  const [factorySearch, setFactorySearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchKCN() {
      try {
        setLoading(true);
        const res = await fetch(`/api/industrial-parks/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setKcn(json.data);
            return;
          }
        }
      } catch (err) {
        console.warn('Fallback tìm kiếm trong file cục bộ:', err.message);
      }

      // Local fallback
      const found = fullKcnFallback.find(k => 
        k.id === id || 
        String(k.stt) === String(id) || 
        (k.name && k.name.toLowerCase().includes(id.toLowerCase()))
      ) || fullKcnFallback[0];

      setKcn(found);
      setLoading(false);
    }

    fetchKCN();
  }, [id]);

  // Filter factories inside KCN
  const filteredFactories = useMemo(() => {
    if (!kcn || !kcn.factories) return [];
    return kcn.factories.filter(f => {
      const q = factorySearch.toLowerCase().trim();
      const matchSearch = !q || 
        f.name.toLowerCase().includes(q) || 
        (f.industry && f.industry.toLowerCase().includes(q)) ||
        (f.address && f.address.toLowerCase().includes(q));

      const matchType = selectedType === 'all' || 
        (f.type && f.type.toLowerCase().includes(selectedType.toLowerCase()));

      return matchSearch && matchType;
    });
  }, [kcn, factorySearch, selectedType]);

  if (!kcn) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-slate-700">{lang === 'en' ? 'Loading Industrial Park details...' : 'Đang tải dữ liệu Khu công nghiệp...'}</h2>
      </div>
    );
  }

  const factoriesCount = kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0);

  const tabs = [
    { id: 'factories', label: lang === 'en' ? `Factories Directory (${factoriesCount})` : `Danh sách Nhà máy (${factoriesCount})` },
    { id: 'overview', label: lang === 'en' ? 'IP Overview' : 'Tổng quan KCN' },
    { id: 'location', label: lang === 'en' ? 'Location & Connectivity' : 'Vị trí & Kết nối' },
    { id: 'infra', label: lang === 'en' ? 'Technical Infrastructure' : 'Hạ tầng kỹ thuật' },
    { id: 'contact', label: lang === 'en' ? 'Contact & Plant Leasing' : 'Liên hệ & Thuê xưởng' },
  ];

  return (
    <div className="space-y-8 pb-20 pt-6 bg-slate-50/60 min-h-screen font-sans">
      
      {/* 1. Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <Link to="/khu-cong-nghiep" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Industrial Parks Directory' : 'Danh mục Khu công nghiệp'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold font-heading">{kcn.name}</span>
        </div>
      </div>

      {/* 2. Header Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-8 shadow-xl overflow-hidden space-y-6">
          
          {/* Subtle Ambient Background Watermark & Glow */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url(${kcn.image || '/stage1_hero.jpg'})` }}
          ></div>
          <div className="absolute -right-20 -bottom-20 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            
            {/* Left Info */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-2xs font-heading">
                  {kcn.status || (lang === 'en' ? "Operating Active" : "Đang hoạt động")}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200 font-mono shadow-2xs">
                  STT: #{kcn.stt || '01'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200 shadow-2xs font-heading">
                  {kcn.region}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072348] font-heading uppercase tracking-tight leading-tight">
                {kcn.name}
              </h1>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{kcn.location || `${kcn.name}, Tỉnh ${kcn.province}, Việt Nam`}</span>
              </div>

              {/* 4 Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide font-heading">{lang === 'en' ? 'Province' : 'Tỉnh thành'}</span>
                  <strong className="text-slate-900 font-bold text-sm block mt-0.5">{kcn.province}</strong>
                </div>
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide font-heading">{lang === 'en' ? 'Total Area' : 'Tổng diện tích'}</span>
                  <strong className="text-slate-900 font-bold text-sm block mt-0.5">{kcn.totalArea || "200 - 500 ha"}</strong>
                </div>
                <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide font-heading">{lang === 'en' ? 'Occupancy' : 'Tỷ lệ lấp đầy'}</span>
                  <strong className="text-emerald-600 font-bold text-sm block mt-0.5">{kcn.occupancyRate || "85%"}</strong>
                </div>
                <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200/80 shadow-2xs">
                  <span className="text-[10px] text-blue-600 block font-medium uppercase tracking-wide font-heading">{lang === 'en' ? 'Operating Plants' : 'Nhà máy hoạt động'}</span>
                  <strong className="text-blue-700 font-black font-mono text-sm block mt-0.5">{factoriesCount} {lang === 'en' ? 'Plants' : 'Nhà máy'}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/dang-nhu-cau"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 font-heading uppercase whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Send Sourcing Demand' : 'Gửi nhu cầu kết nối KCN'}</span>
                </Link>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap font-heading ${
                    isSaved 
                      ? 'bg-amber-50 text-amber-600 border-amber-300' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{isSaved ? (lang === 'en' ? "Saved IP" : "Đã lưu KCN") : (lang === 'en' ? "Bookmark IP" : "Lưu KCN")}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'en' ? "IP link copied to clipboard!" : "Đã sao chép link KCN vào bộ nhớ tạm!");
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap font-heading"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Share' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>

            {/* Right Photo Showcase */}
            <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0">
              <div className="relative h-64 sm:h-72 lg:h-[290px] rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200/80 group bg-slate-100">
                <img 
                  src={kcn.image || "/stage1_hero.jpg"} 
                  alt={kcn.name} 
                  onError={(e) => { e.currentTarget.src = "/stage1_hero.jpg"; }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 brightness-[1.03] contrast-[1.05] saturate-[1.05] filter"
                />
                
                {/* Floating Glassmorphic Badges */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/75 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg flex items-center space-x-1.5 font-heading">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{kcn.province} • {kcn.region}</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-blue-600/90 text-white text-xs font-mono font-bold backdrop-blur-md border border-blue-400/40 shadow-lg">
                  #{kcn.stt || '01'}
                </div>

                <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-2xl bg-slate-950/80 text-white text-[11px] backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg font-heading">
                  <span className="font-semibold truncate max-w-[280px]">
                    📸 {kcn.name}
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono font-bold shrink-0">
                    {factoriesCount} {lang === 'en' ? 'Plants' : 'Nhà máy'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: FACTORIES LIST INSIDE KCN */}
        {activeTab === 'factories' && (
          <div className="space-y-6">
            
            {/* Filter & Search Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={factorySearch}
                  onChange={(e) => setFactorySearch(e.target.value)}
                  placeholder={lang === 'en' ? "Search factory name, manufacturing industry, lot..." : "Tìm tên nhà máy, ngành nghề sản xuất, lô xưởng..."}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">{lang === 'en' ? `All Company Types (${factoriesCount})` : `Tất cả loại hình (${factoriesCount})`}</option>
                  <option value="FDI">{lang === 'en' ? 'FDI Enterprises' : 'Doanh nghiệp FDI'}</option>
                  <option value="Tư nhân">{lang === 'en' ? 'Private Sector' : 'Kinh tế tư nhân'}</option>
                  <option value="Nhà nước">{lang === 'en' ? 'State-Owned Enterprises' : 'Doanh nghiệp Nhà nước'}</option>
                </select>

                <div className="text-xs text-slate-500 whitespace-nowrap pl-2">
                  {lang === 'en' ? 'Showing ' : 'Hiển thị '}<strong>{filteredFactories.length}</strong> / {factoriesCount} {lang === 'en' ? 'plants' : 'nhà máy'}
                </div>
              </div>
            </div>

            {/* Factories Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {filteredFactories.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Factory className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-700 font-heading">
                    {factoriesCount === 0 
                      ? (lang === 'en' ? `No factory list currently registered for ${kcn.name}` : `Chưa có danh sách nhà máy cập nhật cho ${kcn.name}`) 
                      : (lang === 'en' ? 'No factories match your search criteria.' : 'Không tìm thấy nhà máy nào phù hợp với từ khóa tìm kiếm.')}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {lang === 'en' ? 'If your enterprise operates a factory in this IP, submit your info to be listed in the national supply network.' : 'Nếu doanh nghiệp của bạn đang đặt nhà xưởng tại KCN này, hãy gửi thông tin để được niêm yết miễn phí vào mạng lưới.'}
                  </p>
                  <Link
                    to="/dang-nhu-cau"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition font-heading uppercase"
                  >
                    <span>{lang === 'en' ? 'Register Factory Details' : 'Đăng ký thông tin nhà máy'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-extrabold uppercase font-heading border-b border-slate-200 text-[11px] tracking-wider whitespace-nowrap">
                        <th className="py-3.5 px-3 w-14 text-center font-mono shrink-0">#</th>
                        <th className="py-3.5 px-5 min-w-[220px]">{lang === 'en' ? 'COMPANY / PLANT NAME' : 'TÊN CÔNG TY / NHÀ MÁY'}</th>
                        <th className="py-3.5 px-4 text-center min-w-[140px]">{lang === 'en' ? 'FOUNDED YEAR' : 'NĂM THÀNH LẬP'}</th>
                        <th className="py-3.5 px-5 min-w-[260px]">{lang === 'en' ? 'ADDRESS INSIDE INDUSTRIAL PARK' : 'ĐỊA CHỈ TRONG KHU CÔNG NGHIỆP'}</th>
                        <th className="py-3.5 px-4 text-center min-w-[140px]">{lang === 'en' ? 'TYPE' : 'LOẠI HÌNH'}</th>
                        <th className="py-3.5 px-5 min-w-[220px]">{lang === 'en' ? 'PRIMARY SECTOR' : 'NGÀNH NGHỀ CHÍNH'}</th>
                        <th className="py-3.5 px-4 text-right min-w-[110px] shrink-0">{lang === 'en' ? 'CONNECT' : 'KẾT NỐI'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFactories.map((fac, idx) => (
                        <tr 
                          key={idx}
                          className="hover:bg-blue-50/50 transition group"
                        >
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                            {fac.no || idx + 1}
                          </td>
                          <td className="py-3.5 px-5">
                            <strong className="text-slate-900 font-bold group-hover:text-blue-600 transition block leading-snug">
                              {fac.name}
                            </strong>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-600 whitespace-nowrap font-medium">
                            {fac.foundedYear || "—"}
                          </td>
                          <td className="py-3.5 px-5 text-slate-600">
                            <span className="line-clamp-2">{fac.address || kcn.location}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap inline-block leading-none ${
                              fac.type && fac.type.includes('FDI') 
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {fac.type || (lang === 'en' ? "Private Sector" : "Kinh tế tư nhân")}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-700">
                            <span className="line-clamp-2">{fac.industry || (lang === 'en' ? "Manufacturing & Processing" : "Sản xuất & Gia công công nghiệp")}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0">
                            <Link
                              to="/dang-nhu-cau"
                              className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg text-[11px] font-bold transition font-heading uppercase whitespace-nowrap shrink-0"
                            >
                              <span>{lang === 'en' ? 'Connect' : 'Kết nối'}</span>
                              <ChevronRight className="w-3 h-3 ml-0.5 shrink-0" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 font-heading uppercase">
                  {lang === 'en' ? `About ${kcn.name}` : `Giới thiệu ${kcn.name}`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {kcn.description || (lang === 'en' ? `${kcn.name} is a cornerstone industrial park development in ${kcn.province} province, featuring modern infrastructure and convenient multimodal transportation links.` : `${kcn.name} là một trong những khu công nghiệp hạt nhân phát triển công nghiệp của tỉnh ${kcn.province}, sở hữu hệ thống hạ tầng hoàn chỉnh và kết nối giao thương liên vùng thuận lợi.`)}
                </p>
              </div>

              {/* Attracted industries */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 font-heading uppercase">
                  {lang === 'en' ? 'Primary Target Investment Sectors' : 'Ngành nghề thu hút đầu tư chính'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(kcn.primaryIndustries || [
                    lang === 'en' ? 'Supporting Industries & Precision Engineering' : 'Công nghiệp phụ trợ & Cơ khí chính xác',
                    lang === 'en' ? 'Electronics, Semiconductor & Microchips' : 'Điện tử, bán dẫn & Vi mạch',
                    lang === 'en' ? 'High-Tech Textiles & Footwear' : 'Dệt may, da giày kỹ thuật cao',
                    lang === 'en' ? 'Food Processing & Packaging' : 'Chế biến thực phẩm & Đóng gói',
                    lang === 'en' ? 'Warehousing, Logistics & Fulfillment' : 'Kho vận, Logistics & Trung tâm phân phối',
                    lang === 'en' ? 'Green Tech & Renewable Energy' : 'Công nghiệp xanh & Năng lượng tái tạo'
                  ]).map((ind, i) => (
                    <div key={i} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Quick Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs text-xs">
                <h4 className="font-bold text-slate-900 uppercase font-heading border-b border-slate-100 pb-2">
                  {lang === 'en' ? 'Planning & Infrastructure Overview' : 'Thông tin quy hoạch & Hạ tầng'}
                </h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Province:' : 'Tỉnh thành:'}</span>
                    <strong className="text-slate-900">{kcn.province}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Economic Region:' : 'Vùng kinh tế:'}</span>
                    <strong className="text-slate-900">{kcn.region}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Total Scale:' : 'Tổng quy mô:'}</span>
                    <strong className="text-slate-900">{kcn.totalArea || "200 - 500 ha"}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Occupancy Rate:' : 'Tỷ lệ lấp đầy:'}</span>
                    <strong className="text-emerald-600 font-bold">{kcn.occupancyRate || "85%"}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Total Factories:' : 'Số nhà máy:'}</span>
                    <strong className="text-blue-600 font-bold">{factoriesCount} {lang === 'en' ? 'plants' : 'nhà máy'}</strong>
                  </div>
                </div>

                <Link
                  to="/dang-nhu-cau"
                  className="w-full py-2.5 bg-[#072847] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-2 font-heading uppercase mt-4"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Contact IP Management Board' : 'Liên hệ ban quản lý KCN'}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOCATION */}
        {activeTab === 'location' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-heading uppercase">
              {lang === 'en' ? 'Geographic Location & Regional Logistics' : 'Vị trí địa lý & Liên kết vùng'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {kcn.location || `${kcn.name}, Tỉnh ${kcn.province}, Việt Nam`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium font-heading">{lang === 'en' ? 'Road Connectivity' : 'Giao thông đường bộ'}</span>
                <strong className="text-slate-800">{lang === 'en' ? 'Direct access to National Highways & Expressways' : 'Kết nối trực tiếp Quốc lộ & Cao tốc liên tỉnh'}</strong>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium font-heading">{lang === 'en' ? 'Deep-Sea Port / ICD' : 'Cảng biển / ICD'}</span>
                <strong className="text-slate-800">{lang === 'en' ? 'Favorable for industrial export & import logistics' : 'Thuận lợi xuất nhập khẩu hàng hóa công nghiệp'}</strong>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium font-heading">{lang === 'en' ? 'International Airport' : 'Sân bay Quốc tế'}</span>
                <strong className="text-slate-800">{lang === 'en' ? 'Rapid transport for cargo & foreign experts' : 'Đáp ứng vận chuyển hàng không & chuyên gia'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INFRASTRUCTURE */}
        {activeTab === 'infra' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 font-heading uppercase">
              {lang === 'en' ? 'Technical Infrastructure Systems' : 'Hệ thống Hạ tầng Kỹ thuật KCN'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">⚡</div>
                <h4 className="font-bold text-slate-900 font-heading">{lang === 'en' ? 'Power Supply' : 'Hệ thống cấp điện'}</h4>
                <p className="text-slate-500">{lang === 'en' ? 'Dedicated 110/22kV substation supplying 24/7 stable power for plants.' : 'Trạm biến áp 110/22kV cấp điện 24/7 ổn định cho các nhà máy sản xuất.'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">💧</div>
                <h4 className="font-bold text-slate-900 font-heading">{lang === 'en' ? 'Water Supply & Wastewater' : 'Cấp thoát nước'}</h4>
                <p className="text-slate-500">{lang === 'en' ? 'High-capacity water treatment and Column A standard wastewater treatment plant.' : 'Nhà máy nước sạch công suất lớn và trạm xử lý nước thải đạt tiêu chuẩn Cột A.'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">🚒</div>
                <h4 className="font-bold text-slate-900 font-heading">{lang === 'en' ? 'Fire Safety & Security' : 'PCCC & An ninh'}</h4>
                <p className="text-slate-500">{lang === 'en' ? '24/7 fire protection squad with underground hydrants along internal roads.' : 'Đội PCCC chuyên nghiệp túc trực 24/7, họng cứu hỏa ngầm dọc các tuyến đường nội khu.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 font-heading uppercase">
              {lang === 'en' ? 'Investment Promotion & Sourcing Inquiries' : 'Liên hệ Xúc tiến & Hỗ trợ Đầu tư'}
            </h3>
            <p className="text-xs text-slate-600">
              {lang === 'en' 
                ? `Submit your information to connect directly with ${kcn.name} Management Board or supply chain promoters.` 
                : `Gửi thông tin để được hỗ trợ kết nối trực tiếp với Ban Quản lý ${kcn.name} hoặc xúc tiến chuỗi cung ứng.`}
            </p>
            <div className="space-y-3 text-xs">
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Your full name..." : "Họ tên của bạn..."}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Phone / WhatsApp / Zalo..." : "Số điện thoại / Zalo..."}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <textarea 
                rows="3" 
                placeholder={lang === 'en' ? "Plant leasing demand, supplier inquiry, or partnership request..." : "Nhu cầu thuê xưởng, tìm nhà máy cung ứng hoặc đối tác..."}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              ></textarea>
              <button 
                onClick={() => alert(lang === 'en' ? "Inquiry submitted successfully!" : "Đã gửi yêu cầu kết nối thành công!")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition font-heading uppercase"
              >
                {lang === 'en' ? 'Submit Inquiry Now →' : 'Gửi yêu cầu ngay →'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
