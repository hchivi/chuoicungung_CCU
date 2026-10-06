import React from 'react';
import { SqueezeCarousel } from '@/components/ui/carousel-squeeze';

const ECOSYSTEM_SLIDES = [
  {
    id: 'nha-cung-ung',
    title: 'Nhà cung ứng sản xuất phụ trợ & gia công',
    description: 'Năng lực sản xuất phụ trợ, gia công cơ khí chính xác, bao bì, may mặc, hóa chất công nghiệp và tự động hóa nhà xưởng.',
    image: '/images/roles/hero_card_supplier_cnc.jpg',
    imageAlt: 'Nhà cung ứng sản xuất cơ khí chính xác CNC',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300 font-bold">Hệ thống đối tác</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Nhà cung ứng</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/nha-cung-ung',
  },
  {
    id: 'san-pham-dich-vu',
    title: 'Sản phẩm kỹ thuật & dịch vụ công nghiệp',
    description: 'Chi tiết máy CNC, thùng carton sóng, đồ gá Jig, hóa chất công nghiệp, giải pháp kỹ thuật và dịch vụ phụ trợ nhà xưởng.',
    image: '/images/roles/role_supplier_logistics.jpg',
    imageAlt: 'Sản phẩm và dịch vụ công nghiệp chuỗi cung ứng',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300 font-bold">Quy cách kỹ thuật</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Sản phẩm & Dịch vụ</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/nha-cung-ung',
  },
  {
    id: 'nha-may',
    title: 'Nhà máy FDI & doanh nghiệp sản xuất nội địa',
    description: 'Cơ sở dữ liệu các nhà máy sản xuất trực tiếp đang vận hành trên toàn quốc với thông tin dây chuyền và quy mô thực tế.',
    image: '/images/roles/role_factory_smart.jpg',
    imageAlt: 'Nhà máy sản xuất thông minh hiện đại',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">Cơ sở sản xuất</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Nhà máy</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/nha-may',
  },
  {
    id: 'khu-cong-nghiep',
    title: 'Khu công nghiệp & Bản đồ vị trí GIS',
    description: 'Bản đồ vị trí GIS, quy mô diện tích, hạ tầng kỹ thuật, giá thuê và các ngành nghề ưu tiên thu hút đầu tư tại từng địa phương.',
    image: '/images/roles/role_industrial_park_aerial.jpg',
    imageAlt: 'Bản đồ và hạ tầng khu công nghiệp',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-bold">Hạ tầng & Mặt bằng</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Khu công nghiệp</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/khu-cong-nghiep',
  },
  {
    id: 'hiep-hoi',
    title: 'Hội & Hiệp hội ngành nghề sản xuất',
    description: 'Tổ chức ngành nghề cơ khí, dệt may, da giày, điện tử, logistics, chế biến gỗ và các liên minh xuất khẩu hàng đầu Việt Nam.',
    image: '/images/roles/role_association_summit.jpg',
    imageAlt: 'Hội và hiệp hội ngành nghề liên kết',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-300 font-bold">Mạng lưới tổ chức</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Hội & Hiệp hội</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/hiep-hoi',
  },
  {
    id: 'chuong-trinh',
    title: 'Chương trình kết nối giao thương B2B',
    description: 'Ngày hội cung – cầu B2B Matchmaking 1:1, triển lãm chuyên ngành và các phiên xúc tiến thương mại trực tiếp tại các trung tâm kinh tế.',
    image: '/images/roles/role_sponsor_pavilion.jpg',
    imageAlt: 'Chương trình kết nối giao thương cung cầu',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-300 font-bold">Sự kiện & B2B Match</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Chương trình kết nối</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/chuong-trinh',
  },
  {
    id: 'catalogue',
    title: 'E-Catalogue & Hồ sơ năng lực số',
    description: 'Thư viện cẩm nang ngành, profile năng lực nhà cung ứng tiêu biểu, báo cáo chuỗi cung ứng được chuẩn hóa định dạng số.',
    image: '/images/roles/role_partner_strategic.jpg',
    imageAlt: 'E-Catalogue và hồ sơ năng lực',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-teal-300 font-bold">Tài liệu & Cẩm nang</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Catalogue</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/catalogue',
  },
  {
    id: 'san-nhu-cau',
    title: 'Nhu cầu mua hàng & Tìm đối tác công khai',
    description: 'Nhu cầu mua hàng và tìm xưởng sản xuất đã được xác thực, công khai minh bạch điều kiện kỹ thuật và tiến độ phản hồi.',
    image: '/images/roles/hero_card_factory_sourcing.jpg',
    imageAlt: 'Nhu cầu mua hàng công khai chuỗi cung ứng',
    overlay: (
      <div className="flex flex-col text-white">
        <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-bold">Khớp lệnh trực tiếp</span>
        <span className="text-xl sm:text-2xl font-black font-heading tracking-tight">Nhu cầu công khai</span>
      </div>
    ),
    action: 'Xem danh mục',
    href: '/san-nhu-cau',
  },
];

export default function EcosystemDataDirectory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Outer Hardware Shell */}
      <div className="bg-slate-100/80 p-2.5 sm:p-3.5 rounded-[2.5rem] ring-1 ring-slate-900/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        {/* Inner Core Container */}
        <div className="bg-white rounded-[calc(2.5rem-0.75rem)] p-6 sm:p-9 lg:p-11 shadow-xs relative overflow-hidden space-y-8">
          
          {/* Subtle Ambient Accents */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50/90 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          {/* Section Header with synchronized font size and centered layout */}
          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
              <span className="text-gradient-flow-green">
                Tra cứu hệ sinh thái chuỗi cung ứng
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
              Kết quả được tìm từ dữ liệu đang có trong hệ thống và giải thích theo ngành nghề, địa bàn, năng lực, quy mô và yêu cầu thực tế.
            </p>
          </div>

          {/* Squeeze Carousel Presentation */}
          <div className="relative z-10 pt-2">
            <SqueezeCarousel
              slides={ECOSYSTEM_SLIDES}
              height="clamp(260px, 32cqi, 370px)"
              gap={16}
              slatGap={8}
              slatWidth={10}
              radius={20}
              duration={900}
              hoverGrow={true}
              controls={true}
              accent="#0052cc"
              accentForeground="#ffffff"
              label="Tra cứu hệ sinh thái chuỗi cung ứng"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
