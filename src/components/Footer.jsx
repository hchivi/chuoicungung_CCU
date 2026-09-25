import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, Factory, 
  Layers, CheckCircle2, Globe, Cpu, Award, ExternalLink, Lock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-[#272871] text-white pt-10 sm:pt-14 pb-8 select-none font-sans border-t border-indigo-950/80">

      {/* 1. DONG SON BRONZE DRUM (NỀN TRỐNG ĐỒNG BẢN SẮC DÂN TỘC VÀ HẠ TẦNG QUỐC GIA) */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[550px] sm:w-[720px] md:w-[860px] lg:w-[1020px] aspect-square pointer-events-none z-0 overflow-visible flex items-center justify-center">
        <div
          className="w-full h-full bg-no-repeat bg-center bg-contain opacity-[0.055] animate-spin-reverse-slow origin-center"
          style={{ backgroundImage: "url('/bg-trongdong.png')" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

        {/* ========================================================================= */}
        {/* MAIN 4-COLUMN FOOTER STRUCTURE                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start pb-6">

          {/* CỘT 1: BRAND LOGO + TUYÊN NGÔN HẠ TẦNG SỐ + LIÊN HỆ (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 pr-0 lg:pr-4">
            <div className="space-y-3.5">
              <Link to="/" className="inline-block group">
                <BrandLogo variant="dark" size="md" />
              </Link>

              <p className="text-xs text-slate-200 leading-relaxed">
                Hạ tầng số cốt lõi kết nối chuỗi cung ứng toàn cầu. Khép kín hệ sinh thái 480+ Khu công nghiệp, 14.237+ Nhà máy FDI và 32.000+ Nhà cung ứng qua 6 Giai đoạn &amp; 18 Pha kỹ thuật.
              </p>
            </div>


            {/* Direct Contact Hotline & Email */}
            <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#5ABD76] flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span><strong>Hotline Quốc Gia:</strong> <a href="tel:19008686" className="text-white hover:text-[#5ABD76] transition font-bold font-mono">1900 8686</a></span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-[#5ABD76] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span><strong>Email Hỗ Trợ FDI:</strong> <a href="mailto:hotro@chuoicungung.com" className="text-white hover:text-[#5ABD76] transition">hotro@chuoicungung.com</a></span>
              </div>
            </div>
          </div>

          {/* CỘT 2: TẦM NHÌN & CHIẾN LƯỢC VĨ MÔ (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Tầm Nhìn &amp; Chiến Lược
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3.5"></div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li>
                  <Link to="/tam-nhin-chien-luoc-quoc-gia" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tầm nhìn &amp; Sứ mệnh Quốc gia</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tam-nhin-ha-tang-quoc-gia" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bản Tuyên Ngôn Hạ Tầng Số</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ban-do-6-giai-doan" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bản đồ 6 Giai đoạn &amp; 18 Pha</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ban-do-viet-nam" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Sa bàn Số GIS KCN Quốc Gia</span>
                  </Link>
                </li>
                <li>
                  <Link to="/founding-partner" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Đối tác Sáng lập (Founding Partners)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/todzung" className="text-amber-300 font-semibold hover:text-white transition flex items-center group">
                    <span className="text-amber-400 mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">★</span>
                    <span>Hồ Sơ Giám Đốc: Tô Ngọc Dũng</span>
                  </Link>
                </li>
                <li>
                  <Link to="/thi-truong" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Báo cáo Thị trường &amp; Chỉ số ESG</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dinh-vi-doanh-nghiep" className="text-amber-300 font-semibold hover:underline flex items-center">
                    <span className="text-[#5ABD76] mr-1.5 font-bold">›</span>
                    <span>Trắc nghiệm Định vị 18 Pha</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: HỆ SINH THÁI THỰC CHIẾN (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Hệ Sinh Thái Danh Bạ
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3.5"></div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li>
                  <Link to="/khu-cong-nghiep" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Danh mục 480+ Khu Công Nghiệp</span>
                  </Link>
                </li>
                <li>
                  <Link to="/nha-may" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Mạng lưới 14.237+ Nhà Máy FDI</span>
                  </Link>
                </li>
                <li>
                  <Link to="/doanh-nghiep" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>32.000+ Nhà Cung Ứng Đã KYC</span>
                  </Link>
                </li>
                <li>
                  <Link to="/san-nhu-cau" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Sàn Đấu Thầu &amp; Mua Sắm B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tuyen-dung" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tuyển Dụng Nhân Lực KCN 24/7</span>
                  </Link>
                </li>
                <li>
                  <Link to="/hoi-hiep-hoi" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Hội &amp; Hiệp Hội Bảo Chứng Năng Lực</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dang-nhu-cau" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Đăng Nhu Cầu Tìm Nhà Cung Ứng</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 4: BẢO MẬT & CHỨNG NHẬN (2 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Certification & Socials */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Bảo Mật &amp; Chứng Nhận
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3"></div>
              <div className="flex items-center space-x-2">
                <a 
                  href="https://www.dmca.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block transition-transform hover:scale-105"
                >
                  <img 
                    src="/dmca_protected.png" 
                    alt="DMCA.com Protection Status" 
                    className="h-7 w-auto rounded object-contain shadow-sm"
                  />
                </a>
              </div>
              <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-[#5ABD76] flex-shrink-0" />
                <span>Mã Hóa SSL 256-Bit</span>
              </div>

              {/* Social Channels */}
              <div className="flex items-center space-x-1.5 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="Facebook">f</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="LinkedIn">in</a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="Zalo">Z</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#5ABD76] hover:text-slate-900 text-white flex items-center justify-center text-xs font-bold transition shadow-xs" title="YouTube">▶</a>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COPYRIGHT & LEGAL COMPLIANCE                                       */}
        {/* ========================================================================= */}
        <div className="w-full h-[1px] bg-white/15 my-2"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 space-y-3 sm:space-y-0 pt-1">
          <div className="flex items-center space-x-2">
            <span>© 2026 Chuỗi Cung Ứng Quốc Gia – chuoicungung.com. Bảo lưu mọi quyền.</span>
          </div>
          <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 text-slate-300 text-[11.5px]">
            <Link to="/tam-nhin-ha-tang-quoc-gia" className="hover:text-[#5ABD76] transition">Quy chế Hoạt động</Link>
            <Link to="/tam-nhin-chien-luoc-quoc-gia" className="hover:text-[#5ABD76] transition">Tiêu chuẩn Dữ liệu FDI</Link>
            <Link to="/phap-ly/thoa-thuan-dich-vu-b2b" className="hover:text-[#5ABD76] transition">Thỏa thuận Dịch vụ B2B</Link>
            <Link to="/phap-ly/chinh-sach-bao-mat-du-lieu" className="hover:text-[#5ABD76] transition">Chính sách Bảo mật Dữ liệu</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
