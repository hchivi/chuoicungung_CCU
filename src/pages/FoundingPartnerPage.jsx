import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Shield, Crown, Sparkles, CheckCircle2, Download, 
  ArrowRight, Users, Building2, Globe, HeartHandshake, FileText, Check
} from 'lucide-react';
import { foundingPartnersData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function FoundingPartnerPage() {
  const { t, lang } = useLanguage();
  const [selectedTierModal, setSelectedTierModal] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setSelectedTierModal(null);
      alert(lang === 'en' 
        ? "Thank you for registering as a Founding Partner. Our Coordination Board will contact you within 24 hours!" 
        : "Cảm ơn bạn đã gửi thông tin đăng ký Founding Partner. Ban Điều phối sẽ liên hệ trong vòng 24h!");
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-20 pt-6 font-sans">
      
      {/* Breadcrumb & Header Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-xs text-slate-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-blue-600 font-medium">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
          <span>&gt;</span>
          <span className="text-blue-600 font-bold font-heading">{lang === 'en' ? 'Founding Partner Program' : 'Founding Partner'}</span>
        </div>

        <div className="bg-gradient-to-r from-slate-950 via-[#072847] to-[#0b3f6d] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-bold font-heading uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'FOUNDING PARTNER PROGRAM 2024 - 2027' : 'Chương trình Đối tác Sáng lập 2024 - 2027'}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-heading">
              Founding Partner <br />
              <span className="text-amber-400">{lang === 'en' ? 'Pioneering Together' : 'Đồng hành kiến tạo'}</span> {lang === 'en' ? 'the digital supply chain infrastructure of Vietnam.' : 'hạ tầng kết nối doanh nghiệp Việt Nam.'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'en' 
                ? 'Founding Partners are forward-thinking institutions, corporations, and industry leaders sponsoring the foundational development of ChuoiCungUng.vn, laying the groundwork for a transparent, sustainable, and long-term manufacturing ecosystem.' 
                : 'Founding Partner là những tổ chức, doanh nghiệp và cá nhân tiên phong tài trợ và đồng hành cùng Chuỗi Cung Ứng.vn trong giai đoạn kiến tạo nền tảng, đặt nền móng cho một hệ sinh thái sản xuất minh bạch – bền vững – lâu dài.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-4 font-heading uppercase">
              <a
                href="#tiers-section"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-400/20 transition flex items-center space-x-2"
              >
                <span>{lang === 'en' ? 'Become a Founding Partner' : 'Trở thành Founding Partner'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => alert(lang === 'en' ? "Downloading Founding Partner Dossier (PDF)..." : "Tải hồ sơ chương trình Founding Partner (PDF)...")}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-sky-300" />
                <span>{lang === 'en' ? 'Download Program Dossier (PDF)' : 'Tải hồ sơ chương trình (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* 4 Impact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-10 border-t border-white/10 mt-8">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-sky-400 block font-mono">1</span>
              <span className="text-xs font-bold block text-white font-heading">{lang === 'en' ? 'Unified Platform' : 'Nền tảng duy nhất'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Lifecycle-driven matrix' : 'theo vòng đời sản xuất'}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-emerald-400 block font-mono">3 Pillars</span>
              <span className="text-xs font-bold block text-white font-heading">{lang === 'en' ? 'Direct Triple-Link' : 'Kết nối trực tiếp'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Factories - Chambers - Suppliers' : 'Nhà máy - Hội/Hiệp - DN'}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-amber-400 block font-mono">50,000+</span>
              <span className="text-xs font-bold block text-white font-heading">{lang === 'en' ? 'Enterprises' : 'Doanh nghiệp'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Engaged in 5 years' : 'tham gia trong 5 năm'}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-purple-400 block font-mono">1,000+</span>
              <span className="text-xs font-bold block text-white font-heading">{lang === 'en' ? 'Industrial Parks' : 'Khu công nghiệp'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Nationwide coverage' : 'tác động toàn quốc'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VÌ SAO CẦN FOUNDING PARTNER? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {lang === 'en' ? 'Why We Need Founding Partners?' : 'Vì sao cần Founding Partner?'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(lang === 'en' ? [
            { title: "National Digital Infrastructure", desc: "Building a neutral, sustainable, non-profit digital backbone serving Vietnam's manufacturing community." },
            { title: "Precise & Timely Matching", desc: "Connecting enterprises to the exact capabilities, phases, and timing required." },
            { title: "Elevating Competitiveness", desc: "Enhancing supply chain efficiency and agility for Vietnam's whole manufacturing industry." },
            { title: "Social & Economic Contribution", desc: "Creating long-term compounding value for regional economies and supplier ecosystems." },
            { title: "Prestigious Recognition", desc: "Honoring the pioneer role of Founding Partners across all platform surfaces and summits." },
            { title: "Long-term Strategic Alliance", desc: "Co-creating the roadmap, sitting on Advisory Boards, and enjoying perpetual premium privileges." }
          ] : [
            { title: "Kiến tạo hạ tầng số quốc gia", desc: "Xây dựng nền tảng trung lập, phi lợi nhuận, phục vụ cộng đồng doanh nghiệp sản xuất Việt Nam." },
            { title: "Kết nối Đúng – Trúng – Nhanh", desc: "Giúp doanh nghiệp kết nối đúng vai trò, đúng giai đoạn và đúng thời điểm cần thiết." },
            { title: "Tăng năng lực cạnh tranh", desc: "Nâng cao hiệu quả vận hành chuỗi cung ứng cho toàn ngành công nghiệp Việt Nam." },
            { title: "Đóng góp cho cộng đồng", desc: "Tạo giá trị dài hạn cho nền kinh tế và cộng đồng doanh nghiệp địa phương." },
            { title: "Ghi nhận xứng đáng", desc: "Tôn vinh vai trò tiên phong của Founding Partner trên toàn bộ nền tảng và sự kiện." },
            { title: "Đồng hành dài hạn", desc: "Tham gia kiến tạo, cố vấn phát triển và nhận đặc quyền kết nối cao cấp vĩnh viễn." }
          ]).map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm font-mono">
                0{idx + 1}
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-heading">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUYỀN LỢI FOUNDING PARTNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {lang === 'en' ? 'Founding Partner Exclusive Privileges' : 'Quyền lợi Founding Partner'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(lang === 'en' ? [
            { title: "Brand Exposure", desc: "Featured logo, company profile and placement across all ChuoiCungUng.vn platform touchpoints." },
            { title: "PR & Announcements", desc: "Officially acknowledged as a Founding Partner across national press and event communications." },
            { title: "Data Intelligence Access", desc: "Exclusive access to deep industrial intelligence reports, market trends and supply forecasts." },
            { title: "Priority Networking", desc: "VIP priority matching with Tier-1 factories, IP developers, and government chambers." },
            { title: "Strategic Governance", desc: "Join the Platform Advisory Council to shape policy and technical development roadmaps." },
            { title: "Exclusive Summits", desc: "VIP invitations and speaking opportunities at national manufacturing forums." },
            { title: "Bespoke Service Bundles", desc: "Customized enterprise integration packages reserved exclusively for founding sponsors." },
            { title: "Perpetual Diamond Legacy", desc: "Permanent legacy honor recognition on the platform wall with prestigious Diamond badge." }
          ] : [
            { title: "Hiển thị thương hiệu", desc: "Logo và thông tin nổi bật trên toàn bộ nền tảng Chuỗi Cung Ứng.vn." },
            { title: "Truyền thông & Công bố", desc: "Được công bố là Founding Partner trên các kênh truyền thông chính thức." },
            { title: "Quyền truy cập dữ liệu", desc: "Sử dụng dữ liệu thị trường & báo cáo phân tích phục vụ chiến lược." },
            { title: "Ưu tiên kết nối", desc: "Ưu tiên kết nối với các nhà máy, KCN, Hội/Hiệp hội và đối tác chiến lược." },
            { title: "Tham gia định hướng", desc: "Tham gia Hội đồng cố vấn, góp ý chiến lược phát triển nền tảng." },
            { title: "Sự kiện độc quyền", desc: "Ưu tiên tham dự các sự kiện, diễn đàn kinh tế và chương trình đặc biệt." },
            { title: "Gói đặc quyền riêng", desc: "Nhận các gói ưu đãi đối tác đặc biệt chỉ dành riêng cho Founding Partner." },
            { title: "Ghi nhận lâu dài", desc: "Ghi danh & vinh danh vĩnh viễn trên nền tảng với biểu tượng kim cương." }
          ]).map((b, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h4 className="font-bold text-xs text-slate-900 font-heading">{b.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÁC GÓI THAM GIA FOUNDING PARTNER */}
      <section id="tiers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {lang === 'en' ? 'Founding Partner Sponsorship Packages' : 'Các gói tham gia Founding Partner'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'en' ? 'Program applicable for the 2024 – 2027 inaugural phase (3-year foundation term).' : 'Chương trình áp dụng trong giai đoạn 2024 – 2027 (3 năm đầu tiên của dự án).'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundingPartnersData.tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-6 border-2 flex flex-col justify-between shadow-card hover:shadow-card-hover transition relative ${tier.color} ${
                tier.isPopular ? 'ring-2 ring-amber-400' : ''
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm font-heading">
                  {lang === 'en' ? 'Most Popular' : 'Gói tiêu biểu'}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-black text-lg text-slate-900 font-heading">{tier.name}</h3>
                  <div className="text-xl font-extrabold text-blue-700 mt-1 font-mono">{tier.price}</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{tier.target}</p>
                </div>

                <div className="border-t border-slate-200/80 pt-4 space-y-2.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-heading">
                    {lang === 'en' ? 'INCLUDED PRIVILEGES:' : 'QUYỀN LỢI GỒM:'}
                  </span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedTierModal(tier)}
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition font-heading uppercase ${
                  tier.isPopular
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                    : 'bg-[#0b3f6d] hover:bg-blue-900 text-white'
                }`}
              >
                {lang === 'en' ? `Apply for ${tier.name} →` : `Đăng ký gói ${tier.name} →`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDING PARTNER TIÊU BIỂU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider font-heading">
            {lang === 'en' ? 'FEATURED FOUNDING PARTNERS' : 'FOUNDING PARTNER TIÊU BIỂU'}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {foundingPartnersData.featuredPartners.map((partner, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 text-center font-black text-xs text-slate-800 shadow-sm flex items-center justify-center font-heading">
              {partner.name}
            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedTierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase font-heading">{lang === 'en' ? 'Apply for Program' : 'Đăng ký tham gia'}</span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">{lang === 'en' ? `${selectedTierModal.name} Tier` : `Gói ${selectedTierModal.name}`} ({selectedTierModal.price})</h3>
              </div>
              <button onClick={() => setSelectedTierModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Enterprise / Organization Name *' : 'Tên Doanh nghiệp / Tổ chức *'}</label>
                <input required type="text" placeholder={lang === 'en' ? "e.g. ABC Group Corporation" : "VD: Tập đoàn ABC"} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Representative Name *' : 'Người đại diện *'}</label>
                  <input required type="text" placeholder={lang === 'en' ? "Full Name" : "Họ và tên"} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Position / Title *' : 'Chức vụ *'}</label>
                  <input required type="text" placeholder={lang === 'en' ? "CEO / Managing Director" : "Tổng Giám đốc / Giám đốc"} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Phone Number *' : 'Số điện thoại *'}</label>
                  <input required type="tel" placeholder="090 123 4567" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Business Email *' : 'Email *'}</label>
                  <input required type="email" placeholder="contact@company.com" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1 font-heading">{lang === 'en' ? 'Notes or Partnership Objectives' : 'Ghi chú hoặc mong muốn kết nối'}</label>
                <textarea rows="3" placeholder={lang === 'en' ? "Tell us more about your strategic sponsorship goals..." : "Chia sẻ thêm về mục tiêu đồng hành..."} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
              </div>

              <div className="pt-3 flex justify-end space-x-3 font-heading uppercase">
                <button type="button" onClick={() => setSelectedTierModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">
                  {lang === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button type="submit" className="px-6 py-2 bg-[#0b3f6d] hover:bg-blue-900 text-white rounded-xl font-bold shadow-md">
                  {registerSuccess ? (lang === 'en' ? "Submitting..." : "Đang gửi...") : (lang === 'en' ? "Submit Application" : "Gửi thông tin đăng ký")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#072847] to-blue-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-heading">
              {lang === 'en' ? 'Join Us in Shaping Vietnam\'s National Supply Chain' : 'Cùng chung tay kiến tạo hạ tầng kết nối doanh nghiệp Việt Nam'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-200">
              {lang === 'en' ? 'Your sponsorship today creates lasting compounding value for tomorrow\'s economy.' : 'Sự đồng hành của bạn hôm nay – Nền tảng cho giá trị bền vững ngày mai.'}
            </p>
          </div>
          <a
            href="#tiers-section"
            className="px-6 py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm hover:bg-amber-300 transition whitespace-nowrap shadow-lg font-heading uppercase"
          >
            {lang === 'en' ? 'Become a Founding Partner →' : 'Trở thành Founding Partner →'}
          </a>
        </div>
      </section>

    </div>
  );
}
