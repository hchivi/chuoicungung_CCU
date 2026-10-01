import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Bot, Sparkles, Compass } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#272871] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 select-none font-sans border-t border-indigo-950/80">

      {/* 1. NỀN TRỐNG ĐỒNG BẢN SẮC DÂN TỘC & HẠ TẦNG SỐ */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[550px] sm:w-[720px] md:w-[860px] lg:w-[1020px] aspect-square pointer-events-none z-0 overflow-visible flex items-center justify-center">
        <div
          className="w-full h-full bg-no-repeat bg-center bg-contain opacity-[0.055] animate-spin-reverse-slow origin-center"
          style={{ backgroundImage: "url('/bg-trongdong.png')" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ========================================================================= */}
        {/* MAIN 4-COLUMN FOOTER STRUCTURE (KHỚP CHÍNH XÁC NỘI DUNG CHUOICUNGUNG.COM) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-start">

          {/* CỘT 1: THƯƠNG HIỆU & THÔNG TIN KẾT NỐI (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 pr-0 lg:pr-2">
            <div className="space-y-3.5">
              <Link to="/" className="inline-block group">
                <BrandLogo variant="dark" size="md" />
              </Link>

              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Hạ tầng số cốt lõi kết nối chuỗi cung ứng công nghiệp Việt Nam. Khép kín hệ sinh thái 480+ Khu công nghiệp, 14.237+ Nhà máy FDI và 32.000+ Nhà cung ứng qua 6 Giai đoạn &amp; 18 Pha kỹ thuật.
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

            {/* AI Assistant Quick Link */}
            <div className="pt-2">
              <Link 
                to="/tro-ly-ai"
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-[#5ABD76] hover:text-slate-950 text-white text-xs font-semibold transition border border-white/15 group shadow-xs"
              >
                <Bot className="w-4 h-4 text-[#5ABD76] group-hover:text-slate-950 transition-colors" />
                <span>Trợ lý AI Suppi &amp; Chainy</span>
              </Link>
            </div>
          </div>

          {/* CỘT 2: HỆ SINH THÁI & DANH BẠ (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Hệ Sinh Thái Danh Bạ
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3.5"></div>
              <ul className="space-y-2 text-xs text-slate-200 font-normal">
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
                  <Link to="/nha-cung-ung" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>32.000+ Nhà Cung Ứng Đã KYC</span>
                  </Link>
                </li>
                <li>
                  <Link to="/hiep-hoi" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Hội &amp; Hiệp Hội Ngành Hàng</span>
                  </Link>
                </li>
                <li>
                  <Link to="/san-nhu-cau" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Sàn Nhu Cầu Tìm Nguồn B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dang-nhu-cau" className="hover:text-[#5ABD76] transition flex items-center group text-emerald-300 font-medium">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Đăng Nhu Cầu Mua Hàng &amp; Báo Giá</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalogue" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Catalogue &amp; Ấn Phẩm Nhà Cung Ứng</span>
                  </Link>
                </li>
                <li>
                  <Link to="/he-sinh-thai" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tổng Quan Hạ Tầng Hệ Sinh Thái</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 3: 6 GIAI ĐOẠN & DỊCH VỤ DOANH NGHIỆP (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                6 Giai Đoạn &amp; Dịch Vụ
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3.5"></div>
              <ul className="space-y-2 text-xs text-slate-200 font-normal">
                <li>
                  <Link to="/ban-do-6-giai-doan" className="hover:text-[#5ABD76] transition flex items-center group font-medium text-sky-200">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bản Đồ 6 Giai Đoạn &amp; 18 Pha</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dinh-vi-doanh-nghiep" className="text-amber-300 font-semibold hover:underline flex items-center">
                    <span className="text-amber-400 mr-1.5 font-bold">★</span>
                    <span>Trắc Nghiệm Định Vị 18 Pha</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dich-vu" className="text-emerald-300 font-semibold hover:text-white transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">★</span>
                    <span>Trung Tâm Dịch Vụ Doanh Nghiệp</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dich-vu/to-chuc-ket-noi" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tổ Chức Phiên Kết Nối B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dich-vu/hien-dien-tu-xa" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Hiện Diện Từ Xa Sự Kiện KCN</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dich-vu/truyen-thong-doanh-nghiep" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Hồ Sơ &amp; Truyền Thông Năng Lực</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dich-vu/vat-pham-su-kien" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Vật Phẩm Doanh Nghiệp &amp; Quà Tặng</span>
                  </Link>
                </li>
                <li>
                  <Link to="/yeu-cau-dich-vu" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Gửi Yêu Cầu Tư Vấn Dịch Vụ</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CỘT 4: CHƯƠNG TRÌNH & HỢP TÁC (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Chương Trình &amp; Hợp Tác
              </h4>
              <div className="w-16 h-[2px] bg-[#5ABD76] mt-2 mb-3.5"></div>
              <ul className="space-y-2 text-xs text-slate-200 font-normal">
                <li>
                  <Link to="/chuong-trinh" className="text-amber-300 font-semibold hover:text-white transition flex items-center group">
                    <span className="text-amber-400 mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">★</span>
                    <span>Ngày Hội Chuỗi Cung Ứng (Expo)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/hop-tac" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Trung Tâm Hợp Tác Toàn Diện</span>
                  </Link>
                </li>
                <li>
                  <Link to="/founding-partner" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Đối Tác Sáng Lập (Founding Partners)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tai-tro" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tài Trợ &amp; Đồng Hành Sự Kiện</span>
                  </Link>
                </li>
                <li>
                  <Link to="/doi-tac-phat-trien" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Đối Tác Phát Triển / B2B Referral</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tam-nhin-chien-luoc-quoc-gia" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Tầm Nhìn &amp; Sứ Mệnh Quốc Gia</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tam-nhin-ha-tang-quoc-gia" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Bản Tuyên Ngôn Hạ Tầng Số</span>
                  </Link>
                </li>
                <li>
                  <Link to="/thi-truong" className="hover:text-[#5ABD76] transition flex items-center group">
                    <span className="text-[#5ABD76] mr-1.5 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                    <span>Báo Cáo Thị Trường &amp; Chỉ Số ESG</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
