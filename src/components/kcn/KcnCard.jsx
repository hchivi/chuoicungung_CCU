import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, MapPin, Factory, ShieldCheck, ChevronRight,
  Sparkles, Layers, Target, Truck, Rocket, ArrowRight,
  Handshake, FileText, CheckCircle2
} from 'lucide-react';
import { slugify } from '../../pages/IndustryCategoryPage';

export default function KcnCard({ kcn }) {
  if (!kcn) return null;

  // Lấy dữ liệu hệ sinh thái chuẩn hóa từ KCN entity (Section 8, 11, 13, 14)
  const factoriesCount = kcn.publicFactoriesCount || kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0);
  const needsCount = kcn.publicNeedsCount || (kcn.publicNeedsList ? kcn.publicNeedsList.length : 0);
  const programsList = kcn.programsList || [];
  const hasProgram = programsList.length > 0;
  const supplierCount = kcn.supplierCoverageCount || 24;

  const industries = kcn.primaryIndustries && kcn.primaryIndustries.length > 0 
    ? kcn.primaryIndustries.slice(0, 4) 
    : ['Công nghiệp phụ trợ', 'Chế biến chế tạo', 'Cơ khí chính xác', 'Điện tử'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group relative">

      {/* 1. Visual Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={kcn.image || kcn.localImage || '/stage1_hero.jpg'}
          alt={kcn.name}
          onError={(e) => { e.currentTarget.src = '/stage1_hero.jpg'; }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[1.02] contrast-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Province Pill */}
          <span className="px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-bold text-[11px] shadow-sm flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{kcn.province}</span>
          </span>

          {/* Region Tag */}
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 font-semibold text-[10.5px] border border-slate-700/60 font-mono">
            {kcn.region || 'Toàn quốc'}
          </span>
        </div>

        {/* Bottom Banner if Program is Active (Section 8 & 16) */}
        {hasProgram && (
          <div className="absolute bottom-2.5 inset-x-3 bg-emerald-600/95 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[11px] font-bold flex items-center justify-between shadow-md">
            <span className="flex items-center space-x-1.5 truncate">
              <Rocket className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              <span className="truncate">{programsList[0]?.title || 'Chương trình kết nối giao thương đang mở'}</span>
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono shrink-0 ml-1">Đang mở</span>
          </div>
        )}
      </div>

      {/* 2. Card Body: Doanh nghiệp, Nhu cầu, Nguồn cung, Chương trình (Section 8 & 9) */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">

        {/* Header & Title */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-blue-700 text-[10.5px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-heading uppercase tracking-wide">Địa bàn KCN • Xác thực dữ liệu</span>
          </div>

          <Link
            to={`/khu-cong-nghiep/${kcn.id}`}
            className="block text-base sm:text-lg font-black text-slate-900 font-heading hover:text-[#0052cc] transition line-clamp-1 leading-snug"
            title={kcn.name}
          >
            {kcn.name}
          </Link>

          <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{kcn.location || `${kcn.province}, Việt Nam`}</span>
          </p>
        </div>

        {/* 3. Ecosystem Intelligence (Section 8, 11, 13, 14) */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Nhà máy xác thực */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Factory className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                Nhà máy: <strong className="text-slate-900 font-mono">{factoriesCount}</strong>
              </span>
            </div>

            {/* Nhu cầu mua hàng mở */}
            <div className="flex items-center space-x-1.5 text-slate-700">
              <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">
                Nhu cầu mở: <strong className="text-amber-700 font-mono font-bold">{needsCount > 0 ? needsCount : '0'}</strong>
              </span>
            </div>
          </div>

          {/* NCC phục vụ địa bàn (Section 14 & 15) */}
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Nguồn cung phục vụ:</span>
            </span>
            <span className="font-mono font-bold text-slate-800" title="Doanh nghiệp có phạm vi cung ứng tại địa bàn này, không phải hội viên hay đơn vị được KCN chứng nhận">
              {supplierCount}+ NCC
            </span>
          </div>
        </div>

        {/* 4. Priority Industries (Section 10) */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-heading">
            Nhóm ngành nổi bật:
          </span>
          <div className="flex flex-wrap gap-1">
            {industries.map((ind, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10.5px] font-medium border border-blue-100/80 truncate max-w-full"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* 5. CTAs (Section 8, 17, 19, 20) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            to={`/khu-cong-nghiep/${kcn.id}`}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-heading transition flex items-center justify-center space-x-1"
          >
            <span>Khám phá</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {hasProgram ? (
            <Link
              to={`/chuong-trinh?industrialPark=${kcn.id}`}
              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading transition shadow-md shadow-emerald-700/15 flex items-center justify-center space-x-1"
              title="Xem chương trình kết nối tại KCN này"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Chương trình</span>
            </Link>
          ) : (
            <Link
              to={`/dang-nhu-cau?industrialParkId=${kcn.id}`}
              className="px-3 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003d8f] text-white text-xs font-bold font-heading transition shadow-md shadow-blue-900/15 flex items-center justify-center space-x-1"
              title="Gửi nhu cầu mua sắm liên kết nhà máy KCN"
            >
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span>Gửi nhu cầu</span>
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
