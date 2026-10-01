import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, MapPin, Users, ArrowRight, ArrowUpRight, Sparkles, Building2, CheckCircle2 
} from 'lucide-react';
import { EXPO_EVENTS } from '../../data/expoEventsData';

// 3D Testimonial/Event Card (Light Theme as requested)
function Program3DCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chuong-trinh/${event.id}`)}
      className="w-[280px] sm:w-[315px] p-4.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-3.5 select-none"
    >
      <div className="space-y-3">
        {/* Top: Avatar/Icon + Name + Zone Flag */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#0052cc] group-hover:text-white transition-colors text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-slate-900 group-hover:text-[#0052cc] text-sm font-heading leading-tight truncate transition-colors">
                {event.shortName || event.name}
              </span>
              <span className="text-xs shrink-0" title={event.zone}>
                {event.zone === 'Miền Bắc' ? '🇻🇳 MB' : event.zone === 'Miền Trung' ? '🇻🇳 MT' : '🇻🇳 MN'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
              <span>@{event.id}</span>
              <span>·</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Đang mở
              </span>
            </div>
          </div>
        </div>

        {/* Content / Highlight Quote (Like Testimonial in Image 3) */}
        <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed line-clamp-3">
          "{event.tagline || event.highlight}"
        </p>

        {/* Key Event Metrics Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-mono font-bold border border-blue-100/80">
            {event.factoriesCount}+ FDI
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold border border-indigo-100/80">
            {event.suppliersCount}+ NCC
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
            {event.zone}
          </span>
        </div>

        {/* Schedule & Location */}
        <div className="space-y-1 pt-2 border-t border-slate-100 text-[11.5px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{event.date} ({event.time || '08:00 - 17:00'})</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold font-heading text-slate-500 group-hover:text-[#0052cc] transition-colors">
        <span>Xem chương trình</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
}

// Infinite Vertical Marquee Column with pause on hover
function Marquee3DColumn({ events, duration = 30, reverse = false, className = '' }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-[280px] sm:w-[315px] flex-shrink-0 ${className}`}
    >
      <motion.div
        animate={{
          translateY: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[...events, ...events].map((event, idx) => (
          <Program3DCard key={`${event.id}-${idx}`} event={event} />
        ))}
      </motion.div>
    </div>
  );
}

export default function B2BProgramsMarquee3D() {
  // Distribute real events across 4 columns
  const allEvents = [
    ...EXPO_EVENTS,
    {
      id: "vsip-hai-phong",
      name: "Ngày Hội Xúc Tiến Cung Ứng KCN VSIP Hải Phòng",
      shortName: "Ngày Hội Cung Ứng VSIP Hải Phòng",
      date: "10/12/2026",
      time: "08:30 - 17:00",
      location: "KCN VSIP Hải Phòng, Thủy Nguyên, Hải Phòng",
      zone: "Miền Bắc",
      tagline: "Điện Tử Công Nghệ Cao, Thiết Bị Y Tế & Gia Công Phụ Trợ Bán Dẫn",
      factoriesCount: 52,
      suppliersCount: 140,
      highlight: "Kết nối các nhà máy sản xuất thiết bị ngoại vi và gia công kim loại tấm chính xác.",
    },
    {
      id: "song-may-dong-nai",
      name: "Diễn Đàn Chuỗi Cung Ứng KCN Sông Mây & Giang Điền",
      shortName: "Diễn Đàn Cung Ứng Sông Mây & Giang Điền",
      date: "18/12/2026",
      time: "08:00 - 16:30",
      location: "KCN Giang Điền, Trảng Bom, Tỉnh Đồng Nai",
      zone: "Miền Nam",
      tagline: "Đúc Nhôm, Xi Mạ Anode, Nhựa Ép Kỹ Thuật & Đóng Gói Carton",
      factoriesCount: 45,
      suppliersCount: 120,
      highlight: "Tập trung giải pháp cung ứng vật tư phụ trợ cho cụm nhà máy công nghiệp hỗ trợ Đồng Nai.",
    },
    {
      id: "bac-ninh-yen-phong",
      name: "Sourcing Day Công Nghiệp Điện Tử KCN Yên Phong Bắc Ninh",
      shortName: "Sourcing Day Yên Phong Bắc Ninh",
      date: "08/01/2027",
      time: "08:30 - 17:30",
      location: "Trung tâm Đào tạo KCN Yên Phong, Bắc Ninh",
      zone: "Miền Bắc",
      tagline: "Linh Kiện Bán Dẫn, Băng Tải Tự Động & Hóa Chất Tẩy Rửa Vi Mạch",
      factoriesCount: 60,
      suppliersCount: 155,
      highlight: "Khớp lệnh trực tiếp cho chuỗi cung ứng linh kiện vi điện tử của các tập đoàn hàng đầu thế giới.",
    },
    {
      id: "chau-duc-ba-ria",
      name: "Ngày Hội Kết Nối Chuỗi Cung Ứng KCN Châu Đức",
      shortName: "Ngày Hội Cung Ứng KCN Châu Đức",
      date: "15/01/2027",
      time: "08:00 - 17:00",
      location: "KCN Đô thị Châu Đức, Bà Rịa - Vũng Tàu",
      zone: "Miền Nam",
      tagline: "Cơ Khí Chế Tạo Nặng, Thiết Bị Cảng Biển & Vật Tư Dầu Khí",
      factoriesCount: 38,
      suppliersCount: 95,
      highlight: "Đẩy mạnh nội địa hóa nhà cung ứng thiết bị nâng hạ, kết cấu thép và gia công cơ khí nặng.",
    }
  ];

  const col1 = [allEvents[0], allEvents[1], allEvents[4]];
  const col2 = [allEvents[2], allEvents[3], allEvents[5]];
  const col3 = [allEvents[4], allEvents[0], allEvents[6]];
  const col4 = [allEvents[1], allEvents[2], allEvents[7]];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono">
              Sự kiện & Ngày hội B2B Matchmaking
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 uppercase font-heading tracking-tight">
            CHƯƠNG TRÌNH DÀNH CHO DOANH NGHIỆP
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Các phiên gặp gỡ, ngày hội kết nối cung - cầu đang mở đăng ký tại các Khu Công Nghiệp trọng điểm.
          </p>
        </div>

        <Link
          to="/chuong-trinh"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0052cc] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition font-heading shadow-2xs self-start sm:self-auto"
        >
          <span>Xem tất cả chương trình</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3D Testimonials/Events Stage (Light Theme like Image 3) */}
      <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-[#F4F8FC] via-[#F9FBFE] to-[#EEF5FC] border border-slate-200/90 shadow-sm p-4 sm:p-8 overflow-hidden select-none">
        
        {/* Soft Ambient Radial Lights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Tilted Viewport Canvas */}
        <div 
          className="relative w-full h-[540px] sm:h-[600px] overflow-hidden flex items-center justify-center [perspective:1200px]"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          {/* 3D Rotated Deck Plane (Tilted as in Image 3) */}
          <div
            className="flex items-center justify-center gap-5 sm:gap-6 will-change-transform"
            style={{
              transform: 'rotateX(22deg) rotateY(-10deg) rotateZ(14deg) scale(0.96)',
              transformStyle: 'preserve-3d',
            }}
          >
            <Marquee3DColumn events={col1} duration={26} />
            <Marquee3DColumn events={col2} duration={32} reverse />
            <Marquee3DColumn events={col3} duration={28} className="hidden sm:block" />
            <Marquee3DColumn events={col4} duration={34} reverse className="hidden lg:block" />
          </div>
        </div>

        {/* Bottom subtle hint */}
        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
          <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">
            Rê chuột vào thẻ để tạm dừng · Nhấp vào để xem chi tiết & đăng ký
          </span>
        </div>

      </div>

    </section>
  );
}
