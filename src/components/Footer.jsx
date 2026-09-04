import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-[#272871] text-white pt-12 sm:pt-14 pb-8 select-none font-sans border-t border-indigo-950/80">

      {/* 1. DONG SON BRONZE DRUM (SCALE NHỎ LẠI, MÉP TRÊN VÒNG TRÒN BẰNG VỚI MÉP TRÊN FOOTER) */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[550px] sm:w-[720px] md:w-[860px] lg:w-[960px] aspect-square pointer-events-none z-0 overflow-visible flex items-center justify-center">
        <div
          className="w-full h-full bg-no-repeat bg-center bg-contain opacity-[0.05] animate-spin-reverse-slow origin-center"
          style={{ backgroundImage: "url('/bg-trongdong.png')" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ROW 1: MAIN 4 COLUMNS (CÂN ĐỐI CHIỀU CAO & ALIGNMENT CẢ 4 CỘT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch pb-6 sm:pb-8">

          {/* CỘT 1: BRAND LOGO + GIỚI THIỆU + LIÊN HỆ (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 pr-0 lg:pr-4 h-full">
            <div className="space-y-3">
              <Link to="/" className="inline-block group">
                <BrandLogo variant="dark" size="md" />
              </Link>

              <p className="text-xs text-slate-200 leading-relaxed max-w-sm">
                {t('footer.brandDesc')}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-white/10 lg:border-t-0">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#5ABD76] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span><strong>Hotline:</strong> <a href="tel:19008686" className="text-white hover:text-[#5ABD76] transition font-bold">1900 8686</a></span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#5ABD76] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span><strong>Email:</strong> <a href="mailto:hotro@chuoicungung.com" className="text-white hover:text-[#5ABD76] transition">hotro@chuoicungung.com</a></span>
              </div>
            </div>
          </div>

          {/* CỘT 2: VỀ CHUỖI CUNG ỨNG (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3 h-full">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                {lang === 'en' ? 'About Supply Chain' : 'Về Chuỗi Cung Ứng'}
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-4"></div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li><Link to="/" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Project Introduction' : 'Giới thiệu dự án'}</Link></li>
                <li><Link to="/he-sinh-thai" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Vision & Mission' : 'Tầm nhìn & Sứ mệnh'}</Link></li>
                <li><Link to="/ban-do-6-giai-doan" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? '6-Stage & 18-Phase Map' : 'Bản đồ 6 Giai đoạn & 18 Pha'}</Link></li>
                <li><Link to="/founding-partner" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Founding Partners' : 'Đối tác Sáng lập (Founding Partner)'}</Link></li>
                <li><Link to="/ban-do-viet-nam" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'National Digital IP Map' : 'Bản đồ số KCN Quốc gia'}</Link></li>
                <li><Link to="/thi-truong" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Market Reports & ESG' : 'Báo cáo thị trường & ESG'}</Link></li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: HỆ SINH THÁI DỊCH VỤ (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3 h-full">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                {lang === 'en' ? 'Service Ecosystem' : 'Hệ Sinh Thái Dịch Vụ'}
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-4"></div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li><Link to="/khu-cong-nghiep" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Industrial Parks Directory' : 'Danh mục Khu công nghiệp'}</Link></li>
                <li><Link to="/nha-may" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Factories & Workshops Directory' : 'Danh mục Nhà máy / Xưởng'}</Link></li>
                <li><Link to="/doanh-nghiep" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Verified Suppliers Directory' : 'Doanh nghiệp Cung ứng Năng lực'}</Link></li>
                <li><Link to="/san-nhu-cau" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'B2B2C Demands Hub' : 'Sàn Nhu Cầu B2B2C'}</Link></li>
                <li><Link to="/tuyen-dung" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Industrial Recruitment' : 'Tuyển Dụng Nhân Lực KCN'}</Link></li>
                <li><Link to="/hoi-hiep-hoi" className="hover:text-[#5ABD76] transition flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Trade Associations & Guilds' : 'Hội / Hiệp hội Kết nối'}</Link></li>
                <li><Link to="/dinh-vi-doanh-nghiep" className="text-emerald-300 font-semibold hover:underline flex items-center"><span className="text-[#5ABD76] mr-1.5 font-bold">›</span> {lang === 'en' ? 'Which stage am I in?' : 'Tôi đang ở giai đoạn nào?'}</Link></li>
              </ul>
            </div>
          </div>

          {/* CỘT 4: FOLLOW SOCIALS & CERTIFICATION (2 COLS) */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4 h-full">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  {lang === 'en' ? 'Follow Socials' : 'Mạng Xã Hội'}
                </h4>
                <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-4"></div>
              </div>

              <div className="flex items-center space-x-2 pt-0.5">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="Facebook">f</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="LinkedIn">in</a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="Zalo">Z</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="YouTube">▶</a>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10 lg:border-t-0">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'en' ? 'Certification' : 'Chứng Nhận'}
              </h5>
              <a 
                href="https://www.dmca.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-block transition-transform hover:scale-105"
              >
                <img 
                  src="/dmca_protected.png" 
                  alt="DMCA.com Protection Status" 
                  className="h-8 sm:h-9 w-auto rounded object-contain shadow-sm"
                />
              </a>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-300 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5ABD76] flex-shrink-0" />
                <span>Bảo mật SSL 256-Bit</span>
              </div>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="w-full h-[1px] bg-white/15 my-4"></div>

        {/* BOTTOM COPYRIGHT (PORTALINK ABSOLUTE FOOTER STYLE) */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span>© 2026 Chuỗi Cung Ứng – chuoicungung.com</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-300">
            <Link to="/" className="hover:text-[#5ABD76] transition">{lang === 'en' ? 'Terms of Service' : 'Điều khoản sử dụng'}</Link>
            <Link to="/" className="hover:text-[#5ABD76] transition">{lang === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
