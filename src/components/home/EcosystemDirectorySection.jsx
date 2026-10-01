import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Factory, MapPin, Users, Calendar, BookOpen, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

export default function EcosystemDirectorySection() {
  const items = [
    {
      title: "Nhà cung ứng",
      subtitle: "Tìm theo sản phẩm, ngành và năng lực.",
      stats: "21.680 đơn vị",
      desc: "Doanh nghiệp phụ trợ, gia công cơ khí chính xác, bao bì, may mặc, tự động hóa và hóa chất.",
      link: "/nha-cung-ung",
      cta: "Tra cứu nhà cung ứng",
      icon: Building2,
      color: "blue"
    },
    {
      title: "Nhà máy",
      subtitle: "Tra cứu cơ sở sản xuất và nhu cầu vận hành.",
      stats: "14.237 nhà máy",
      desc: "Cơ sở sản xuất FDI và nội địa đang hoạt động tại các vùng kinh tế công nghiệp trọng điểm.",
      link: "/nha-may",
      cta: "Tra cứu nhà máy",
      icon: Factory,
      color: "indigo"
    },
    {
      title: "Khu công nghiệp",
      subtitle: "Tra cứu địa bàn, ngành thu hút và hệ sinh thái xung quanh.",
      stats: "480 KCN & CCN",
      desc: "Bản đồ vị trí GIS, quy mô diện tích, hạ tầng logistics, trạm điện và nguồn cung phụ trợ địa phương.",
      link: "/khu-cong-nghiep",
      cta: "Tra cứu KCN",
      icon: MapPin,
      color: "rose"
    },
    {
      title: "Hội và hiệp hội",
      subtitle: "Tìm tổ chức kết nối theo ngành và địa phương.",
      stats: "Tổ chức ngành",
      desc: "Mạng lưới kết nối cơ khí - điện (HAME), logistics (VLA), dệt may (VITAS), thủy sản (VASEP)...",
      link: "/hiep-hoi",
      cta: "Tra cứu hiệp hội",
      icon: Users,
      color: "violet"
    },
    {
      title: "Chương trình",
      subtitle: "Xem sự kiện, phiên kết nối và hoạt động đang mở.",
      stats: "Sự kiện định kỳ",
      desc: "Các phiên kết nối cung cầu B2B Matchmaking, Sourcing Day trực tiếp và hội thảo chuyên đề.",
      link: "/chuong-trinh",
      cta: "Xem chương trình",
      icon: Calendar,
      color: "amber"
    },
    {
      title: "Catalogue",
      subtitle: "Tra cứu ấn phẩm và hồ sơ năng lực đã công khai.",
      stats: "Ấn phẩm số",
      desc: "Bộ cẩm nang kỹ thuật, danh bạ năng lực nhà cung ứng và tài liệu xúc tiến thương mại 2026.",
      link: "/catalogue",
      cta: "Xem catalogue",
      icon: BookOpen,
      color: "teal"
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "blue": return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: "bg-blue-600 text-white" };
      case "indigo": return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: "bg-indigo-600 text-white" };
      case "rose": return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: "bg-rose-600 text-white" };
      case "violet": return { bg: "bg-violet-50 text-violet-700 border-violet-200", icon: "bg-violet-600 text-white" };
      case "amber": return { bg: "bg-amber-50 text-amber-800 border-amber-200", icon: "bg-amber-600 text-white" };
      case "teal": return { bg: "bg-teal-50 text-teal-800 border-teal-200", icon: "bg-teal-600 text-white" };
      default: return { bg: "bg-slate-50 text-slate-700 border-slate-200", icon: "bg-slate-600 text-white" };
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>MẠNG LƯỚI HẠ TẦNG & SẢN XUẤT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase font-heading tracking-tight">
            Tra cứu hệ sinh thái công nghiệp Việt Nam
          </h2>

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Dữ liệu thực tế đối chiếu từ hệ thống · Cập nhật: 30/09/2026</span>
          </div>
        </div>

        <Link
          to="/he-sinh-thai"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition font-heading shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <span>Xem tổng quan hệ sinh thái</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6 Mục tra cứu chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const styling = getColorClasses(item.color);
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Top: Icon + Stats */}
                <div className="flex items-center justify-between gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 ${styling.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${styling.bg}`}>
                    {item.stats}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-blue-600 font-heading tracking-tight transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#0052cc] hover:text-white text-slate-800 rounded-xl text-xs font-bold font-heading transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs group-hover:bg-[#0052cc] group-hover:text-white"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
