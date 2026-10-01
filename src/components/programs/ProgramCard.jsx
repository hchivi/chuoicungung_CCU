import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Building2, Users, ArrowRight, 
  Sparkles, CheckCircle2, ShieldCheck, Tag, Info, AlertTriangle, XCircle, Check
} from 'lucide-react';
import { calculateFeeDisplay } from '../../data/programsData';

export default function ProgramCard({ 
  program, 
  userRole = 'ALL', 
  userLocation = '', 
  onOpenInterestModal,
  onOpenRecapModal 
}) {
  if (!program) return null;

  const isCompleted = program.status === 'da-dien-ra' || program.programStatus === 'COMPLETED';
  const isPostponed = program.status === 'hoan' || program.programStatus === 'POSTPONED';
  const isCancelled = program.status === 'huy' || program.programStatus === 'CANCELLED';
  const isNeedsDiscovery = program.status === 'dang-khao-sat' || program.programStatus === 'NEEDS_DISCOVERY';
  const isUpcoming = program.status === 'sap-mo-dang-ky' || program.programStatus === 'UPCOMING';
  const isRegOpen = program.status === 'dang-nhan-dang-ky' || program.programStatus === 'REGISTRATION_OPEN';
  const isRegClosed = program.status === 'da-dong-dang-ky' || program.programStatus === 'REGISTRATION_CLOSED';

  // Fee calculation adhering to strict rule in Section 11 & 12
  const feeDisplayText = calculateFeeDisplay(program, userRole);

  // Status Badge Styling & Label
  const getStatusBadge = () => {
    if (isRegOpen) {
      return {
        bg: 'bg-emerald-500/90 text-white',
        border: 'border-emerald-600',
        dot: 'bg-emerald-300',
        text: 'Đang nhận đăng ký'
      };
    }
    if (isUpcoming) {
      return {
        bg: 'bg-blue-600/90 text-white',
        border: 'border-blue-700',
        dot: 'bg-blue-200',
        text: 'Sắp mở đăng ký'
      };
    }
    if (isNeedsDiscovery) {
      return {
        bg: 'bg-amber-500/95 text-white',
        border: 'border-amber-600',
        dot: 'bg-amber-200',
        text: 'Đang khảo sát nhu cầu'
      };
    }
    if (isRegClosed) {
      return {
        bg: 'bg-slate-700/90 text-white',
        border: 'border-slate-800',
        dot: 'bg-slate-400',
        text: 'Đã đóng đăng ký'
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-indigo-600/90 text-white',
        border: 'border-indigo-700',
        dot: 'bg-indigo-200',
        text: 'Đã diễn ra'
      };
    }
    if (isPostponed) {
      return {
        bg: 'bg-orange-500/95 text-white',
        border: 'border-orange-600',
        dot: 'bg-orange-200',
        text: 'Hoãn'
      };
    }
    if (isCancelled) {
      return {
        bg: 'bg-rose-600/90 text-white',
        border: 'border-rose-700',
        dot: 'bg-rose-200',
        text: 'Đã hủy'
      };
    }
    return {
      bg: 'bg-slate-600 text-white',
      border: 'border-slate-700',
      dot: 'bg-slate-300',
      text: program.statusName || 'Chương trình'
    };
  };

  const statusBadge = getStatusBadge();

  // Relevance explanation (Section 16: No fake percentage, only verified match reasons)
  const relevanceReasons = [];
  if (userRole && userRole !== 'ALL' && program.targetRoles) {
    const roleUpper = userRole.toUpperCase();
    if (program.targetRoles.includes(roleUpper) || program.targetRoles.includes(userRole.toLowerCase())) {
      relevanceReasons.push(`Phù hợp vai trò: ${userRole}`);
    }
  }
  if (userLocation && program.location && program.location.toLowerCase().includes(userLocation.toLowerCase())) {
    relevanceReasons.push(`Tại địa bàn: ${userLocation}`);
  }

  return (
    <div 
      className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isCancelled 
          ? 'border-rose-200 bg-rose-50/20 opacity-90' 
          : isPostponed
            ? 'border-orange-200 bg-orange-50/20'
            : 'border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* 1. Header Image with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img 
          src={program.image || '/images/supply_chain_expo_hero.jpg'} 
          alt={program.title || program.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          {/* Status Badge */}
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md shadow-xs border ${statusBadge.bg} ${statusBadge.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`}></span>
            <span>{statusBadge.text}</span>
          </span>

          {/* Sponsored Label (Section 19: Transparency) */}
          {program.isSponsored ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-400/95 text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-slate-900" />
              <span>Được tài trợ</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-900/60 text-white backdrop-blur-md text-[10px] font-mono">
              {program.publicCode || 'CCU-PRG'}
            </span>
          )}
        </div>

        {/* Bottom Format & Type Badge over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold">
            <Tag className="w-3 h-3 text-blue-400" />
            <span>{program.typeName}</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px]">
            {program.formatName || 'Trực tiếp'}
          </span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
        
        {/* Title */}
        <div className="space-y-1.5">
          <Link 
            to={`/chuong-trinh/${program.slug || program.id}`}
            className="text-base sm:text-lg font-black text-slate-900 font-heading hover:text-[#0052cc] transition line-clamp-2 leading-snug"
          >
            {program.title || program.name}
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {program.shortDescription || program.description}
          </p>
        </div>

        {/* Relevance Hint (Section 16: Grounded in real criteria, no fake percentage) */}
        {relevanceReasons.length > 0 && (
          <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-900 space-y-0.5">
            <div className="font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Phù hợp với hồ sơ doanh nghiệp của bạn:</span>
            </div>
            <div className="pl-4 text-blue-700 font-medium">
              {relevanceReasons.map((r, i) => (
                <span key={i} className="inline-block mr-2">✓ {r}</span>
              ))}
            </div>
          </div>
        )}

        {/* Key Logistics Metadata */}
        <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
          {/* Date & Time */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">{program.date}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{program.time}</span>
          </div>

          {/* Location & KCN */}
          <div className="flex items-start space-x-2">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {program.location}
              {program.kcn && <span className="font-semibold text-slate-700"> (KCN {program.kcn})</span>}
            </span>
          </div>

          {/* Organizer Relation (Section 28) */}
          <div className="flex items-center space-x-2">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate text-slate-600">
              Đơn vị chủ trì: <strong className="text-slate-800 font-semibold">{program.organizer}</strong>
            </span>
          </div>
        </div>

        {/* Needs & Target Category Tags */}
        {program.needGroup && program.needGroup.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Nhu cầu kết nối trọng tâm:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {program.needGroup.slice(0, 3).map((item, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/80 truncate max-w-[200px]"
                >
                  {item}
                </span>
              ))}
              {program.needGroup.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
                  +{program.needGroup.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fee Display Banner (Section 11 & 12) */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Chi phí tham gia:
            </span>
            <span className={`text-xs font-black ${
              feeDisplayText.includes('Miễn phí') ? 'text-emerald-600' : 'text-slate-800'
            }`}>
              {feeDisplayText}
            </span>
          </div>

          {/* Scale info badge */}
          {(program.factoriesCount || program.suppliersCount) && (
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <span className="font-bold text-slate-800">{program.factoriesCount || 0}</span> Buyer • <span className="font-bold text-slate-800">{program.suppliersCount || 0}</span> Supplier
            </div>
          )}
        </div>

        {/* 3. Action Buttons according to Status (Section 13) */}
        <div className="pt-2">
          {/* Case 1: Đang khảo sát nhu cầu (NEEDS_DISCOVERY) */}
          {isNeedsDiscovery && (
            <button
              onClick={() => onOpenInterestModal && onOpenInterestModal(program)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Đăng Ký Quan Tâm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Case 2: Sắp mở đăng ký (UPCOMING) */}
          {isUpcoming && (
            <button
              onClick={() => onOpenInterestModal && onOpenInterestModal(program)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Nhận Thông Tin Khi Mở Đăng Ký</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Case 3: Đang nhận đăng ký (REGISTRATION_OPEN) */}
          {isRegOpen && (
            <Link
              to={`/chuong-trinh/${program.slug || program.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-1.5"
            >
              <span>Xem Chi Tiết & Đăng Ký</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Case 4: Đã đóng đăng ký (REGISTRATION_CLOSED) */}
          {isRegClosed && (
            <Link
              to={`/chuong-trinh/${program.slug || program.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Đã Đóng Đăng Ký (Xem Chi Tiết)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Case 5: Đã diễn ra (COMPLETED) */}
          {isCompleted && (
            <div className="flex gap-2">
              <Link
                to={`/chuong-trinh/${program.slug || program.id}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition text-center"
              >
                Kỷ Yếu Chi Tiết
              </Link>
              <button
                onClick={() => onOpenRecapModal && onOpenRecapModal(program)}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1"
                title="Xem kết quả xác thực"
              >
                <span>Xem Kết Quả</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Case 6: Hoãn (POSTPONED) */}
          {isPostponed && (
            <Link
              to={`/chuong-trinh/${program.slug || program.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />
              <span>Tạm Hoãn (Xem Thông Báo Lịch Mới)</span>
            </Link>
          )}

          {/* Case 7: Hủy (CANCELLED) */}
          {isCancelled && (
            <Link
              to={`/chuong-trinh/${program.slug || program.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Đã Hủy (Xem Lý Do Sáp Nhập)</span>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
