import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, Compass, Map, BarChart3, Building2, Factory, 
  Users, ShoppingBag, Crown, ShieldCheck, ArrowRight, CheckCircle2, 
  Sparkles, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function EcosystemOverviewPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-12 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb & Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold font-heading">{lang === 'en' ? 'Supply Chain Ecosystem Map' : 'Bản đồ Hệ sinh thái Tổng thể'}</span>
        </div>

        <div className="bg-gradient-to-r from-[#072847] via-[#0b3f6d] to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-4xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/20 border border-sky-400/30 text-sky-200 rounded-full text-xs font-bold font-heading uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'NATIONAL SUPPLY CHAIN ECOSYSTEM MAP' : 'SUPPLY CHAIN ECOSYSTEM MAP (21 TRANG CHUẨN UX/UI)'}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading">
              {lang === 'en' ? 'VIETNAM INDUSTRIAL' : 'BẢN ĐỒ HỆ SINH THÁI'} <br />
              <span className="text-sky-300">{lang === 'en' ? 'ECOSYSTEM BLUEPRINT' : 'CHUỖI CUNG ỨNG.VN'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {lang === 'en' 
                ? 'A comprehensive digital architecture connecting right partners, right engineering resources, and right timing across all stages of manufacturing in Vietnam.' 
                : 'Nền tảng kết nối toàn diện giúp doanh nghiệp tìm đúng đối tác, đúng nguồn lực, đúng thời điểm trong toàn bộ chuỗi cung ứng sản xuất Việt Nam.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Levels Breakdown: CẤP 1 - CẤP 6 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CẤP 1: CỬA VÀO HỆ THỐNG */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-black text-xs font-heading">
              {lang === 'en' ? 'TIER 1' : 'CẤP 1'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {lang === 'en' ? 'SYSTEM GATEWAY & CORE LIFECYCLE' : 'CỬA VÀO HỆ THỐNG (Thu hút người dùng)'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <Link to="/" className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-200 transition group">
              <strong className="text-slate-900 font-bold block text-sm group-hover:text-blue-600 font-heading">{lang === 'en' ? '01. Home Portal' : '01. Trang chủ'}</strong>
              <p className="text-slate-500 mt-1">{lang === 'en' ? 'Interactive 3D Flower, 6-stage lifecycle, value matrix.' : 'Landing page, vòng đời 6 giai đoạn, so sánh & 3 nguyên tắc.'}</p>
            </Link>
            <Link to="/ban-do-6-giai-doan" className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-200 transition group">
              <strong className="text-slate-900 font-bold block text-sm group-hover:text-blue-600 font-heading">{lang === 'en' ? '02. 6-Stage Master Map' : '02. Bản đồ 6 giai đoạn'}</strong>
              <p className="text-slate-500 mt-1">{lang === 'en' ? 'Comprehensive 6-stage 18-phase industrial matrix.' : 'Ma trận 6 giai đoạn – 18 pha toàn diện.'}</p>
            </Link>
            <Link to="/giai-doan/1" className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-200 transition group">
              <strong className="text-slate-900 font-bold block text-sm group-hover:text-blue-600 font-heading">{lang === 'en' ? '03. Stage Specifications' : '03. Chi tiết Giai đoạn'}</strong>
              <p className="text-slate-500 mt-1">{lang === 'en' ? 'Stage 1: Preparation & Investment (3 core technical phases).' : 'VD Giai đoạn 1: Chuẩn bị & Đầu tư (3 pha chuyên sâu).'}</p>
            </Link>
            <Link to="/pha/1.2" className="p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl border border-slate-200 transition group">
              <strong className="text-slate-900 font-bold block text-sm group-hover:text-blue-600 font-heading">{lang === 'en' ? '04. Phase Deep-Dive' : '04. Trang Pha mẫu'}</strong>
              <p className="text-slate-500 mt-1">{lang === 'en' ? 'Phase 1.2: Legal, EIA Permits & Standard Deliverables.' : 'VD Pha 1.2: Pháp lý & Thủ tục (Tabs, nhiệm vụ, kết quả, DN).'}</p>
            </Link>
          </div>
        </div>

        {/* CẤP 2: HỆ SINH THÁI KẾT NỐI */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs font-heading">
              {lang === 'en' ? 'TIER 2' : 'CẤP 2'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {lang === 'en' ? 'STAKEHOLDERS & ENTITIES DIRECTORY' : 'HỆ SINH THÁI KẾT NỐI (Các chủ thể tham gia)'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'SUPPLIERS' : 'DOANH NGHIỆP'}</span>
              <Link to="/nha-cung-ung" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '05. Suppliers Directory' : '05. Danh mục Doanh nghiệp'}</Link>
              <Link to="/doanh-nghiep/deep-c" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '06. Enterprise Profile' : '06. Chi tiết DEEP C'}</Link>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'FACTORIES' : 'NHÀ MÁY'}</span>
              <Link to="/nha-may" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '09. Factories Directory' : '09. Danh mục Nhà máy'}</Link>
              <Link to="/nha-may/samsung-bacninh" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '10. Factory Profile' : '10. Chi tiết Samsung Bắc Ninh'}</Link>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'INDUSTRIAL PARKS' : 'KHU CÔNG NGHIỆP'}</span>
              <Link to="/khu-cong-nghiep" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '07. IP Directory' : '07. Danh mục KCN'}</Link>
              <Link to="/khu-cong-nghiep/vsip-bac-ninh" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '08. IP Profile & Tenants' : '08. Chi tiết VSIP Bắc Ninh'}</Link>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'ASSOCIATIONS' : 'HỘI / HIỆP HỘI'}</span>
              <Link to="/hoi-hiep-hoi" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '11. Associations Directory' : '11. Danh mục Hội / Hiệp hội'}</Link>
              <Link to="/hoi-hiep-hoi/bni-vietnam" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '12. Chamber Profile' : '12. Chi tiết BNI Việt Nam'}</Link>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-heading">{lang === 'en' ? 'SOURCING RFQS' : 'GIAO THƯƠNG'}</span>
              <Link to="/nhu-cau" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '13. Demands Marketplace' : '13. Danh mục Nhu cầu'}</Link>
              <Link to="/dang-nhu-cau" className="font-bold text-slate-900 hover:text-blue-600 block">{lang === 'en' ? '14. Post Sourcing RFQ' : '14. Đăng nhu cầu (6 bước)'}</Link>
            </div>
          </div>
        </div>

        {/* CẤP 3, 4, 5, 6 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CẤP 3: CÔNG CỤ THÔNG MINH */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-xs font-heading">{lang === 'en' ? 'TIER 3' : 'CẤP 3'}</span>
              <h3 className="font-bold text-slate-900 text-sm font-heading">{lang === 'en' ? 'INTELLIGENT DIAGNOSTIC QUIZ' : 'CÔNG CỤ THÔNG MINH (Giá trị khác biệt)'}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'en' 
                ? 'Automated quiz evaluating enterprise lifecycle positioning across 6 stages with instant recommendation matrix.' 
                : 'Công cụ trắc nghiệm & chẩn đoán tự động vị trí của doanh nghiệp trong 6 giai đoạn và gợi ý giải pháp phù hợp tức thì.'}
            </p>
            <Link to="/dinh-vi-doanh-nghiep" className="inline-flex items-center text-xs font-bold text-amber-700 hover:underline font-heading">
              {lang === 'en' ? '15. Which Stage Am I In? (Interactive Assessment) →' : '15. Tôi đang ở giai đoạn nào? (Định vị Doanh nghiệp) →'}
            </Link>
          </div>

          {/* CẤP 4: DỮ LIỆU QUỐC GIA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-black text-xs font-heading">{lang === 'en' ? 'TIER 4' : 'CẤP 4'}</span>
              <h3 className="font-bold text-slate-900 text-sm font-heading">{lang === 'en' ? 'NATIONAL GIS INDUSTRIAL DATA' : 'DỮ LIỆU QUỐC GIA (Toàn quốc Real-time)'}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'en' 
                ? 'Interactive Vietnam industrial GIS map and real-time national production benchmark dashboard.' 
                : 'Bản đồ số công nghiệp GIS toàn quốc và bảng theo dõi chỉ số thị trường theo thời gian thực.'}
            </p>
            <div className="flex space-x-4 text-xs font-bold text-purple-700 font-heading">
              <Link to="/ban-do-viet-nam" className="hover:underline">{lang === 'en' ? '16. Vietnam GIS Map →' : '16. Bản đồ Việt Nam →'}</Link>
              <Link to="/thi-truong" className="hover:underline">{lang === 'en' ? '17. Market Dashboard →' : '17. Dashboard Thị trường →'}</Link>
            </div>
          </div>

          {/* CẤP 5: THƯƠNG MẠI HÓA */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-black text-xs font-heading">{lang === 'en' ? 'TIER 5' : 'CẤP 5'}</span>
              <h3 className="font-bold text-slate-900 text-sm font-heading">{lang === 'en' ? 'COMMERCIAL MONETIZATION' : 'THƯƠNG MẠI HÓA (Mô hình doanh thu)'}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'en' 
                ? '4-tier Founding Partner sponsorship model accelerating digital infrastructure for Vietnam manufacturing.' 
                : 'Mô hình 4 gói Founding Partner tài trợ kiến tạo hạ tầng kết nối số cho ngành sản xuất Việt Nam.'}
            </p>
            <Link to="/founding-partner" className="inline-flex items-center text-xs font-bold text-amber-700 hover:underline font-heading">
              {lang === 'en' ? '18. Founding Partner Opportunities →' : '18. Trang Founding Partner (Đối tác sáng lập) →'}
            </Link>
          </div>

          {/* CẤP 6: QUẢN TRỊ */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-black text-xs font-heading">{lang === 'en' ? 'TIER 6' : 'CẤP 6'}</span>
              <h3 className="font-bold text-slate-900 text-sm font-heading">{lang === 'en' ? 'ADMINISTRATION & GOVERNANCE' : 'QUẢN TRỊ (Vận hành hệ thống)'}</h3>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'en' 
                ? 'Central administrative portal: supplier verification, IP & factory management, RFQ moderations.' 
                : 'Cổng quản trị toàn diện: phê duyệt doanh nghiệp, quản lý KCN, nhà máy, người dùng và báo cáo tăng trưởng.'}
            </p>
            <Link to="/admin" className="inline-flex items-center text-xs font-bold text-blue-700 hover:underline font-heading">
              {lang === 'en' ? '19. Admin Command Dashboard →' : '19. Dashboard Quản trị Admin →'}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

