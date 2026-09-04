import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Clock, Download, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, Building2, Layers,
  PhoneCall, MessageCircle, ExternalLink, ShieldCheck, Briefcase,
  ImageIcon, Compass, HelpCircle, Check, Smartphone, Contact,
  Headphones, Landmark
} from 'lucide-react';
import associationsList from '../data/associations.json';
import { associationsData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function AssociationDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  
  // Find in crawled associations or mockData
  const assoc = associationsList.find(a => a.id === id) || 
                associationsData.find(a => a.id === id) || 
                associationsList[0] || associationsData[0];

  const [copiedPhone, setCopiedPhone] = useState(false);

  const rawPhone = assoc.phone || '024 3822 5555';
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const zaloUrl = cleanDigits.length >= 9 ? `https://zalo.me/${cleanDigits}` : null;
  const initial = (assoc.name || 'H').charAt(0).toUpperCase();

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const hasGallery = Array.isArray(assoc.galleryGroups) && assoc.galleryGroups.length > 0;

  return (
    <div className="space-y-6 pb-28 pt-2 sm:pt-4 font-sans bg-[#f8fafc] min-h-screen text-slate-800 antialiased">
      
      {/* 1. Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto py-2">
          <Link to="/" className="hover:text-blue-600 transition shrink-0">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/hoi-hiep-hoi" className="hover:text-blue-600 transition shrink-0">Hội / Hiệp Hội / Tổ Chức</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{assoc.name}</span>
        </nav>
      </div>

      {/* 2. Top Hero Profile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#0a2540] to-[#0B3558] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center space-x-4 sm:space-x-5">
              {/* Logo / Initials */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                {assoc.logo ? (
                  <img 
                    src={assoc.logo} 
                    alt={assoc.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  style={{ display: assoc.logo ? 'none' : 'flex' }}
                  className="w-full h-full rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl sm:text-3xl items-center justify-center font-heading shadow-md"
                >
                  {initial}
                </span>
              </div>

              {/* Title & Tags */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-400/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{assoc.status || "Đang hoạt động"}</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[11px] font-bold rounded-full border border-blue-400/30 font-mono">
                    {assoc.region || "Toàn quốc"}
                  </span>
                  <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-[11px] font-bold rounded-full border border-yellow-400/30 font-mono">
                    Năm thành lập: {assoc.establishedYear || "2016"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading leading-tight tracking-tight">
                  {assoc.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
                  {assoc.tagline || "Tổ chức Hiệp hội Doanh nghiệp & Xúc tiến Thương mại Quốc gia"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <a 
                href={`tel:${cleanDigits}`}
                className="flex-1 md:flex-initial px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-yellow-400/20 font-heading"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi trực tiếp</span>
              </a>

              {zaloUrl && (
                <a 
                  href={zaloUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md font-heading"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Zalo</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main 2-Column Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: Main Information */}
          <div className="lg:col-span-8 space-y-6">

            {/* SECTION 1: GIỚI THIỆU TỔNG QUAN */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                  1. Giới thiệu & Sứ mệnh hoạt động
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-normal">
                <p>
                  {assoc.description || `${assoc.name} là tổ chức đại diện uy tín cho cộng đồng doanh nghiệp ngành nghề tại Việt Nam, đóng vai trò then chốt trong việc thúc đẩy liên kết chuỗi giá trị sản xuất, tư vấn chính sách và bảo vệ quyền lợi hợp pháp của hội viên.`}
                </p>
                <p>
                  Thông qua hệ thống các hội nghị xúc tiến đầu tư, kết nối giao thương B2B và chương trình đào tạo nâng cao năng lực cạnh tranh, tổ chức là cầu nối vững chắc đưa sản phẩm và dịch vụ của doanh nghiệp hội viên tiếp cận thị trường trong nước và quốc tế.
                </p>
              </div>

              {/* 4 Stats Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-blue-600 font-mono">{assoc.membersCount || 250}+</span>
                  <p className="text-[10px] text-slate-400 font-medium">Doanh nghiệp hội viên</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-emerald-600 font-mono">{assoc.chaptersCount || 8}+</span>
                  <p className="text-[10px] text-slate-400 font-medium">Chi hội / Ban ngành</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-amber-600 font-mono">{assoc.establishedYear || "2016"}</span>
                  <p className="text-[10px] text-slate-400 font-medium">Năm thành lập</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-lg font-black text-purple-600 font-mono">100%</span>
                  <p className="text-[10px] text-slate-400 font-medium">Hợp chuẩn pháp lý</p>
                </div>
              </div>
            </section>

            {/* SECTION 2: HỒ SƠ PHÁP LÝ & CƠ CẤU */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                  2. Hồ sơ tổ chức & Năng lực pháp lý
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên tổ chức chính thức</span>
                  <p className="font-bold text-slate-900 leading-snug">{assoc.name}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã số thuế / Số quyết định</span>
                  <p className="font-mono font-bold text-slate-900">{assoc.taxCode || "Đã xác thực pháp nhân B2B"}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chủ tịch / Đại diện pháp luật</span>
                  <p className="font-bold text-slate-900">{assoc.president || "Ban Thường Vụ Hiệp Hội"}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khu vực hoạt động chính</span>
                  <p className="font-bold text-slate-900">{assoc.region || "Toàn quốc"}</p>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ trụ sở / Văn phòng đại diện</span>
                  <p className="font-medium text-slate-800 leading-relaxed">{assoc.address || "Hà Nội / TP. Hồ Chí Minh, Việt Nam"}</p>
                </div>
              </div>
            </section>

            {/* SECTION 3: THƯ VIỆN HÌNH ẢNH (Image 1 Style with Sub-Groups) */}
            {hasGallery && (
              <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
                
                {/* Header Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs font-bold font-heading uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-yellow-600" />
                  <span>THƯ VIỆN HÌNH ẢNH</span>
                </div>

                {/* Sub-Groups */}
                <div className="space-y-8">
                  {assoc.galleryGroups.map((grp, gIdx) => (
                    <div key={gIdx} className="space-y-3.5">
                      
                      {/* Group Title with Yellow Bar */}
                      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                        <div className="w-1.5 h-4 bg-yellow-400 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-900 font-heading uppercase tracking-wide">
                          {grp.groupName}
                        </h3>
                      </div>

                      {/* Grid of Product / Activity Photo Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {grp.items.map((it, itIdx) => (
                          <div 
                            key={itIdx}
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:border-yellow-400 transition-all duration-300"
                          >
                            <div className="aspect-4/3 w-full bg-slate-50 p-1.5 flex items-center justify-center overflow-hidden">
                              <img 
                                src={it.image} 
                                alt={it.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2 sm:p-2.5 text-center bg-white flex-1 flex items-center justify-center border-t border-slate-100">
                              <span className="text-xs font-bold text-slate-800 line-clamp-1 font-heading group-hover:text-blue-600 transition">
                                {it.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* SECTION 4: KÊNH LIÊN HỆ & TRỤ SỞ */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Phone className="w-5 h-5 text-amber-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading uppercase">
                  {hasGallery ? "4. Kênh liên hệ & Văn phòng tiếp nhận" : "3. Kênh liên hệ & Văn phòng tiếp nhận"}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 truncate">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-bold text-slate-800">{assoc.phone || "024 3822 5555"}</span>
                  </div>
                  <button 
                    onClick={handleCopyPhone}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition shrink-0"
                  >
                    {copiedPhone ? "Đã chép" : "Sao chép"}
                  </button>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 space-x-2 truncate">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono text-slate-700 truncate">{assoc.email || "info@hiephoi.vn"}</span>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Contact Box (Image 2 Style) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
              
              {/* Header Box (Dark Top Bar) */}
              <div className="bg-[#14120c] text-white p-4 flex items-center space-x-2.5 border-b border-yellow-500/30">
                <Headphones className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 font-heading">
                  LIÊN HỆ NHÀ CUNG CẤP / HIỆP HỘI
                </h3>
              </div>

              {/* Organization Logo & Title */}
              <div className="p-4 sm:p-5 flex items-center space-x-3.5 border-b border-slate-100 bg-slate-50/50">
                <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white p-1.5 shrink-0 shadow-2xs flex items-center justify-center overflow-hidden">
                  {assoc.logo ? (
                    <img 
                      src={assoc.logo} 
                      alt={assoc.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    style={{ display: assoc.logo ? 'none' : 'flex' }}
                    className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl items-center justify-center font-heading shadow-inner"
                  >
                    {initial}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 font-heading line-clamp-2 leading-tight">
                    {assoc.name}
                  </h4>
                </div>
              </div>

              {/* NGƯỜI PHỤ TRÁCH (Exact Image 2 Style) */}
              <div className="p-4 sm:p-5 space-y-4 border-b border-slate-100">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <Contact className="w-3.5 h-3.5 text-amber-700" />
                  <span>NGƯỜI PHỤ TRÁCH</span>
                </div>

                <div className="space-y-4">
                  {(assoc.keyPersonnel && assoc.keyPersonnel.length > 0 ? assoc.keyPersonnel : [
                    {
                      initials: initial,
                      name: assoc.president || "Ban Thường Vụ",
                      role: "Chủ tịch / Đại diện Pháp luật",
                      phone: rawPhone,
                      zalo: zaloUrl,
                      email: assoc.email || "info@hiephoi.vn"
                    }
                  ]).map((p, pIdx) => (
                    <div key={pIdx} className="space-y-2 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      
                      {/* Name & Role with Avatar */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#fff8e6] text-[#b45309] border border-[#fde68a] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs font-mono">
                          {p.initials || "TT"}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate font-heading">{p.name}</h5>
                          {p.role && <p className="text-[10.5px] text-slate-500 truncate">{p.role}</p>}
                        </div>
                      </div>

                      {/* Phone & Zalo */}
                      {p.phone && (
                        <div className="flex items-center space-x-2 pl-1 text-xs">
                          <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <a 
                            href={`tel:${p.phone.replace(/\D/g, '')}`}
                            className="font-mono font-bold text-slate-800 hover:text-blue-600"
                          >
                            {p.phone}
                          </a>
                          <a 
                            href={p.zalo || `https://zalo.me/${p.phone.replace(/\D/g, '')}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-[10px] font-bold flex items-center space-x-1 hover:bg-blue-600 hover:text-white transition shrink-0"
                          >
                            <MessageCircle className="w-2.5 h-2.5" />
                            <span>Zalo</span>
                          </a>
                        </div>
                      )}

                      {/* Email */}
                      {(p.email || assoc.email) && (
                        <div className="flex items-center space-x-2 pl-1 text-[11px] text-slate-600 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{p.email || assoc.email}</span>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* THÔNG TIN NHANH */}
              <div className="p-4 sm:p-5 space-y-2.5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-amber-700" />
                  <span>THÔNG TIN NHANH</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-500 shrink-0">Loại hình</span>
                    <span className="font-bold text-slate-900 text-right">{assoc.businessType || "Nhà sản xuất, Thương mại, Dịch vụ"}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-slate-500 shrink-0">Năm thành lập</span>
                    <span className="font-mono font-bold text-slate-900">{assoc.establishedYear || "2016"}</span>
                  </div>
                </div>
              </div>

              {/* ĐỊA ĐIỂM */}
              <div className="p-4 sm:p-5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>ĐỊA ĐIỂM</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {assoc.address || "Hà Nội, Việt Nam"}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
