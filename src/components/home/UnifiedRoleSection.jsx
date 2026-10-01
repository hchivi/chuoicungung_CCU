import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Sparkles, ShieldCheck, Factory, Boxes, Users,
  ArrowRight
} from 'lucide-react';

const ROLES = [
  {
    id: 'kcn',
    pillLabel: 'Khu công nghiệp',
    icon: Building2,
    iconColor: 'text-amber-400',
    tag: 'HẠ TẦNG KCN',
    title: 'Khu công nghiệp',
    subtitle: 'Quỹ đất · Nhà xưởng · Mạng lưới NCC',
    desc: 'Số hóa quỹ đất, xúc tiến cho thuê nhà xưởng và kết nối chuỗi cung ứng địa phương.',
    badges: ['Hạ tầng & Nhà xưởng', 'Chuỗi KCN', 'NCC địa phương'],
    image: '/images/roles/role_vn_industrial_park.jpg',
    imageAlt: 'Khu công nghiệp và hạ tầng nhà xưởng hiện đại tại Việt Nam',
    accentColor: 'text-amber-300',
    link: '/khu-cong-nghiep',
  },
  {
    id: 'sponsor',
    pillLabel: 'Nhà tài trợ',
    icon: Sparkles,
    iconColor: 'text-rose-400',
    tag: 'NHÀ TÀI TRỢ B2B',
    title: 'Nhà tài trợ',
    subtitle: 'Chương trình · Ngành hàng · Thương hiệu',
    desc: 'Đồng hành thương hiệu tại các kỳ Sourcing Day và kết nối mạng lưới lãnh đạo B2B.',
    badges: ['Tài trợ ngành', 'Nhận diện thương hiệu', 'Quan hệ B2B'],
    image: '/images/roles/role_vn_sponsor_pavilion.jpg',
    imageAlt: 'Nhà tài trợ thương hiệu B2B tại triển lãm công nghiệp Việt Nam',
    accentColor: 'text-rose-300',
    link: '/tai-tro',
  },
  {
    id: 'partner',
    pillLabel: 'Đối tác Đồng hành',
    icon: ShieldCheck,
    iconColor: 'text-indigo-400',
    tag: 'ĐỒNG HÀNH CHIẾN LƯỢC',
    title: 'Đối tác Đồng hành',
    subtitle: 'Độc quyền ngành · Hiện diện VIP',
    desc: 'Độc quyền ngành hàng trọng điểm và đồng kiến tạo hệ điều hành chuỗi cung ứng.',
    badges: ['Độc quyền ngành', 'Hiện diện ưu tiên VIP', 'Quyền lợi sáng lập'],
    image: '/images/roles/role_vn_partner_signing.jpg',
    imageAlt: 'Lễ ký kết đối tác đồng hành chiến lược chuỗi cung ứng Việt Nam',
    accentColor: 'text-indigo-300',
    link: '/founding-partner',
  },
  {
    id: 'factory',
    pillLabel: 'Nhà máy',
    icon: Factory,
    iconColor: 'text-emerald-400',
    tag: 'SẢN XUẤT & VẬN HÀNH',
    title: 'Nhà máy',
    subtitle: 'Tìm nguồn · So sánh giá · Đăng nhu cầu',
    desc: 'Bóc tách tiêu chuẩn kỹ thuật, đối chiếu năng lực máy móc và tìm nhà xưởng tương thích.',
    badges: ['Tìm nguồn cung ứng', 'So sánh báo giá', 'Đăng mua sắm'],
    image: '/images/roles/role_vn_factory.jpg',
    imageAlt: 'Kỹ sư Việt Nam và dây chuyền tự động hóa nhà máy',
    accentColor: 'text-emerald-300',
    link: '/dang-nhu-cau',
  },
  {
    id: 'supplier',
    pillLabel: 'Nhà cung ứng',
    icon: Boxes,
    iconColor: 'text-sky-400',
    tag: 'ĐỐI TÁC CUNG ỨNG',
    title: 'Nhà cung ứng',
    subtitle: 'Hồ sơ năng lực · Tiếp cận Buyer FDI',
    desc: 'Chuẩn hóa năng lực gia công CNC, chứng chỉ ISO/IATF và nhận thông báo mở thầu trực tiếp.',
    badges: ['Chuẩn hóa hồ sơ', 'Tiếp cận FDI', 'Sourcing Day'],
    image: '/images/roles/role_vn_supplier_cnc.jpg',
    imageAlt: 'Kỹ sư cơ khí chính xác CNC và nhà cung ứng Việt Nam',
    accentColor: 'text-sky-300',
    link: '/tao-ho-so',
  },
  {
    id: 'association',
    pillLabel: 'Hội / Hiệp hội',
    icon: Users,
    iconColor: 'text-purple-400',
    tag: 'HIỆP HỘI NGÀNH NGHỀ',
    title: 'Hội / Hiệp hội',
    subtitle: 'Thu thập nhu cầu · Kết nối hội viên',
    desc: 'Dữ liệu hội viên đa ngành, hỗ trợ xúc tiến giao thương và nâng cao tỷ lệ nội địa hóa.',
    badges: ['Nhu cầu ngành', 'Đồng hành hội viên', 'Đo lường kết quả'],
    image: '/images/roles/role_vn_association_delegates.jpg',
    imageAlt: 'Đại biểu hội và hiệp hội ngành nghề công nghiệp Việt Nam',
    accentColor: 'text-purple-300',
    link: '/hiep-hoi',
  },
];

export default function UnifiedRoleSection() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('factory');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Outer Hardware Shell matching Image 2's design system */}
      <div className="bg-slate-100/80 p-2.5 sm:p-3.5 rounded-[2.5rem] ring-1 ring-slate-900/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        {/* Inner Core Container */}
        <div className="bg-white rounded-[calc(2.5rem-0.75rem)] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden space-y-7">
          
          {/* Subtle Ambient Accents */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50/90 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          {/* 1. Header: Strictly 1 Line Title */}
          <div className="relative z-10 text-center w-full max-w-5xl mx-auto px-2 space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black text-slate-950 uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
              CHUOICUNGUNG.COM CÓ THỂ GIÚP GÌ CHO BẠN?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
              Chọn đúng vai trò của bạn để khám phá công cụ, luồng khớp lệnh và dịch vụ chuyên biệt.
            </p>
          </div>



          {/* 3. 6 Photographic Role Cards in Image 2's Style with authentic Vietnamese context */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {ROLES.map((role) => {
              const isActive = activeId === role.id;
              const Icon = role.icon;

              return (
                <div
                  key={role.id}
                  onClick={() => setActiveId(role.id)}
                  className={`rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative group bg-white ${
                    isActive
                      ? 'border-2 border-[#0052cc] shadow-[0_14px_36px_rgba(0,82,204,0.16)] ring-4 ring-blue-500/10 -translate-y-1'
                      : 'border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Visual Photo Header matching Image 2's aesthetic */}
                    <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                      <img
                        src={role.image}
                        alt={role.imageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* Gradient Overlay for high-contrast legible typography */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                      {/* Bottom Image Overlay Text (Title) */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col text-white">
                        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                          {role.title}
                        </span>
                      </div>
                    </div>

                    {/* Content Details: Subtitle & Description */}
                    <div className="px-1 space-y-1.5">
                      <p className="text-xs font-bold text-[#0052cc] font-mono tracking-tight line-clamp-1">
                        {role.subtitle}
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                        {role.desc}
                      </p>
                    </div>

                    {/* Key Capabilities Badges */}
                    <div className="px-1 flex flex-wrap gap-1.5">
                      {role.badges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-900 border border-blue-200/80 font-semibold'
                              : 'bg-slate-50 text-slate-600 border border-slate-200/70'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Clean Action Button */}
                  <div className="px-1 pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0052cc] group-hover:underline flex items-center gap-1 font-heading">
                      Khám phá giải pháp
                    </span>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(role.link);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                        isActive
                          ? 'bg-[#0052cc] text-white shadow-sm shadow-blue-500/30'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#0052cc] group-hover:text-white'
                      }`}
                      title={`Xem giải pháp cho ${role.title}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
