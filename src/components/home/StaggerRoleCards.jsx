import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const ROLES = [
  {
    id: "factory",
    num: "01",
    role: "Nhà máy & Doanh nghiệp FDI",
    shortRole: "Nhà máy FDI",
    desc: "Tìm kiếm nguồn cung phụ trợ đạt chuẩn, thẩm định năng lực nhà xưởng và đăng thầu mua sắm linh kiện, thiết bị nhanh chóng.",
    tags: ["Tìm NCC tin cậy", "So sánh báo giá NCC", "Đăng thầu mua sắm"],
    link: "/tro-ly-ai?role=factory",
    image: "/images/roles/role_factory_smart.jpg",
    accentColor: "#2563eb",
    glowBorder: "hover:border-blue-500/80",
    activeBorder: "border-blue-500/90 shadow-[0_0_30px_-5px_rgba(37,99,235,0.35)]",
    btnGradient: "from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
  },
  {
    id: "supplier",
    num: "02",
    role: "Nhà cung ứng phụ trợ",
    shortRole: "Nhà cung ứng",
    desc: "Chuẩn hóa hồ sơ năng lực sản xuất, tiếp cận các Buyer lớn trong nước & FDI, mở rộng mạng lưới nhận đơn hàng gia công.",
    tags: ["Tiếp cận Buyer lớn", "Hồ sơ năng lực chuẩn", "Nhận đơn hàng mới"],
    link: "/tro-ly-ai?role=supplier",
    image: "/images/roles/role_supplier_logistics.jpg",
    accentColor: "#059669",
    glowBorder: "hover:border-emerald-500/80",
    activeBorder: "border-emerald-500/90 shadow-[0_0_30px_-5px_rgba(5,150,105,0.35)]",
    btnGradient: "from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
  },
  {
    id: "association",
    num: "03",
    role: "Hội & Hiệp hội ngành nghề",
    shortRole: "Hội / Hiệp hội",
    desc: "Thu thập nhu cầu hội viên, kết nối cơ hội giao thương B2B liên ngành, xúc tiến thương mại và báo cáo kết quả minh bạch.",
    tags: ["Xúc tiến thương mại", "Hỗ trợ hội viên", "Báo cáo kết nối"],
    link: "/tro-ly-ai?role=association",
    image: "/images/roles/role_association_summit.jpg",
    accentColor: "#7c3aed",
    glowBorder: "hover:border-purple-500/80",
    activeBorder: "border-purple-500/90 shadow-[0_0_30px_-5px_rgba(124,58,237,0.35)]",
    btnGradient: "from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
  },
  {
    id: "industrial-park",
    num: "04",
    role: "Khu công nghiệp & Cụm CN",
    shortRole: "Khu công nghiệp",
    desc: "Quảng bá quỹ đất, nhà xưởng xây sẵn, thu hút dự án FDI thứ cấp và kết nối mạng lưới công nghiệp phụ trợ địa phương.",
    tags: ["Thu hút đầu tư FDI", "Quỹ đất & Nhà xưởng", "Hệ sinh thái phụ trợ"],
    link: "/tro-ly-ai?role=industrial-park",
    image: "/images/roles/role_industrial_park_aerial.jpg",
    accentColor: "#0284c7",
    glowBorder: "hover:border-sky-500/80",
    activeBorder: "border-sky-500/90 shadow-[0_0_30px_-5px_rgba(2,132,199,0.35)]",
    btnGradient: "from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400"
  },
  {
    id: "sponsor",
    num: "05",
    role: "Nhà tài trợ & Nhãn hàng B2B",
    shortRole: "Nhà tài trợ",
    desc: "Đồng hành cùng chuỗi sự kiện, triển lãm Expo và hội nghị xúc tiến, tiếp cận trực tiếp hơn 3.000+ lãnh đạo doanh nghiệp.",
    tags: ["Tài trợ chuyên ngành", "Đồng hành thương hiệu", "Kết nối lãnh đạo B2B"],
    link: "/tro-ly-ai?role=sponsor",
    image: "/images/roles/role_sponsor_pavilion.jpg",
    accentColor: "#d97706",
    glowBorder: "hover:border-amber-500/80",
    activeBorder: "border-amber-500/90 shadow-[0_0_30px_-5px_rgba(217,119,6,0.35)]",
    btnGradient: "from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
  },
  {
    id: "founding-partner",
    num: "06",
    role: "Đối tác Đồng hành Chiến lược",
    shortRole: "Đối tác Chiến lược",
    desc: "Tham gia kiến tạo hệ điều hành chuỗi cung ứng, sở hữu quyền lợi độc quyền ngành hàng và vị thế bảo trợ thương hiệu dài hạn.",
    tags: ["Độc quyền ngành hàng", "Hiện diện ưu tiên VIP", "Quyền lợi sáng lập"],
    link: "/founding-partner",
    image: "/images/roles/role_partner_strategic.jpg",
    accentColor: "#e11d48",
    glowBorder: "hover:border-rose-500/80",
    activeBorder: "border-rose-500/90 shadow-[0_0_30px_-5px_rgba(225,29,72,0.35)]",
    btnGradient: "from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400"
  }
];

export default function StaggerRoleCards() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide transition across cards every 3.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full">
      {/* =========================================================================
          DESKTOP VIEW: EXPANDABLE ACCORDION STRIP (AUTO-PLAYING & HOVER-EXPANDABLE)
         ========================================================================= */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="hidden lg:flex flex-row h-[550px] w-full gap-3 xl:gap-3.5 select-none"
      >
        {ROLES.map((item, idx) => {
          const isExpanded = activeIndex === idx;

          return (
            <div
              key={item.id}
              onMouseEnter={() => {
                setIsPaused(true);
                setActiveIndex(idx);
              }}
              onClick={() => navigate(item.link)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(item.link)}
              aria-label={`${item.role} - Khám phá vai trò`}
              className={cn(
                "relative rounded-[28px] overflow-hidden cursor-pointer border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isExpanded
                  ? cn("flex-[4.2] border-slate-700/80", item.activeBorder)
                  : cn("flex-[1] border-slate-200/90 bg-slate-900/90 hover:flex-[1.2]", item.glowBorder)
              )}
            >
              {/* Background Photo with Cinematic Treatment */}
              <img
                src={item.image}
                alt={item.role}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out",
                  isExpanded ? "scale-105" : "scale-100 opacity-60 filter brightness-75"
                )}
                loading="lazy"
              />

              {/* Dynamic Gradient Scrim */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isExpanded
                    ? "bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30 opacity-95"
                    : "bg-slate-950/75 hover:bg-slate-950/60"
                )}
              />

              {/* ===============================================================
                  EXPANDED CARD STATE CONTENT (Clean: No top badges, only clean number)
                 =============================================================== */}
              {isExpanded ? (
                <div className="relative z-10 h-full p-7 xl:p-8 flex flex-col justify-between text-white animate-fade-in">
                  
                  {/* Top Header: Only Clean Monospace Index */}
                  <div className="flex items-center justify-end">
                    <span className="font-mono text-3xl font-black text-white/35 tracking-widest">
                      {item.num}
                    </span>
                  </div>

                  {/* Bottom Content: Title, Subtext, Tags & Direct CTA */}
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-tight text-white leading-tight">
                        {item.role}
                      </h3>
                      <p className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Functional Capability Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-xl text-xs font-medium bg-white/10 backdrop-blur-md text-slate-100 border border-white/15 hover:bg-white/20 transition-colors shadow-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <span
                        className={cn(
                          "inline-flex items-center space-x-2.5 px-5 py-3 rounded-2xl text-white font-bold text-xs uppercase tracking-wider font-heading transition-all shadow-lg active:scale-95 bg-gradient-to-r",
                          item.btnGradient
                        )}
                      >
                        <span>Khám phá vai trò {item.shortRole}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                /* ===============================================================
                   COLLAPSED CARD STATE (Clean: Number & Vertical Title, No Dots/Chevrons)
                   =============================================================== */
                <div className="relative z-10 h-full p-5 flex flex-col justify-between items-center text-center">
                  
                  {/* Top Number */}
                  <span className="font-mono text-sm font-bold text-white/60 tracking-wider">
                    {item.num}
                  </span>

                  {/* Center Vertical Title */}
                  <div className="flex-1 flex items-center justify-center py-6">
                    <span
                      className="text-sm font-bold font-heading uppercase text-white/90 tracking-widest select-none whitespace-nowrap [writing-mode:vertical-rl] rotate-180"
                    >
                      {item.shortRole}
                    </span>
                  </div>

                  {/* Clean bottom anchor */}
                  <span className="w-3 h-0.5 rounded-full bg-white/20" />

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MOBILE / TABLET VIEW: ADAPTIVE TOUCH STACK (< LG SCREENS)
         ========================================================================= */}
      <div className="flex lg:hidden flex-col gap-3 w-full">
        {ROLES.map((item, idx) => {
          const isExpanded = activeIndex === idx;

          return (
            <div
              key={`m-${item.id}`}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              className={cn(
                "relative rounded-2xl overflow-hidden border transition-all duration-500 ease-out cursor-pointer",
                isExpanded
                  ? cn("min-h-[360px] p-5 border-slate-700 bg-slate-950", item.activeBorder)
                  : "h-[68px] p-3 border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-between"
              )}
            >
              {isExpanded ? (
                /* Expanded Mobile Card */
                <div className="relative z-10 h-full flex flex-col justify-between space-y-4 text-white">
                  <img
                    src={item.image}
                    alt={item.role}
                    className="absolute inset-0 w-full h-full object-cover -z-10 opacity-40 filter brightness-75 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50 -z-10 rounded-2xl" />

                  <div className="flex items-center justify-end">
                    <span className="font-mono text-sm font-bold text-white/60">{item.num}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black font-heading uppercase text-white leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md text-[10.5px] bg-white/10 text-slate-200 border border-white/15">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(item.link);
                    }}
                    className={cn("w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs uppercase font-heading flex items-center justify-center space-x-2 bg-gradient-to-r mt-2", item.btnGradient)}
                  >
                    <span>Khám phá vai trò</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Collapsed Mobile Bar */
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img src={item.image} alt={item.role} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-black font-heading text-slate-900 leading-snug">{item.role}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">{item.num}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
