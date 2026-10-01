// ============================================================================
// FACTORY CARD COMPONENT (SECTION 8, 9, 10, 16 SPEC 28.TXT)
// HIỂN THỊ CẢ 2 VAI TRÒ MUA VÀ BÁN DƯỚI CÙNG MỘT THỰC THỂ DOANH NGHIỆP
// ============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Factory, CheckCircle2, ChevronRight, 
  ShoppingBag, ShieldCheck, Zap, Globe, Package, Layers, ArrowUpRight
} from 'lucide-react';

export default function FactoryCard({ factory }) {
  if (!factory) return null;

  const detailUrl = `/nha-may/${factory.slug || factory.id}`;

  return (
    <article 
      className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group"
      aria-label={`Hồ sơ nhà máy ${factory.name}`}
    >
      <div className="space-y-3">
        
        {/* Top Badges & Verification */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {factory.type ? (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {factory.type}
              </span>
            ) : factory.isFdi ? (
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                FDI
              </span>
            ) : null}

            {/* Public Role Chips (Section 8) */}
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-[#0052cc]">
              NHÀ MÁY SẢN XUẤT
            </span>

            {factory.hasSupplierCapability && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 flex items-center space-x-0.5">
                <Zap className="w-2.5 h-2.5" />
                <span>CÓ NĂNG LỰC CUNG ỨNG</span>
              </span>
            )}

            {factory.hasPublicNeeds && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 flex items-center space-x-0.5">
                <ShoppingBag className="w-2.5 h-2.5" />
                <span>CÓ NHU CẦU CÔNG KHAI</span>
              </span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            {factory.updatedAt}
          </span>
        </div>

        {/* Factory Name & Industry */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-base font-heading group-hover:text-[#0052cc] transition line-clamp-2 leading-snug">
            <Link to={detailUrl}>
              {factory.name}
            </Link>
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">
            Ngành: <span className="font-semibold text-slate-800">{factory.industry}</span>
          </p>
        </div>

        {/* Location & Confirmed KCN Relation (Section 14 & 18) */}
        <div className="text-xs text-slate-500 space-y-1 pt-0.5">
          <div className="flex items-center space-x-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium text-slate-700">{factory.address}</span>
          </div>

          {factory.isKcnConfirmed && factory.industrialParkName && (
            <div className="flex items-center space-x-1 text-[11px] text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded-md w-fit">
              <Factory className="w-3 h-3 shrink-0" />
              <span className="font-bold">{factory.industrialParkName}</span>
              <span className="text-[9px] text-emerald-600 font-mono font-bold">(Xác thực)</span>
            </div>
          )}
        </div>

        {/* Output Products or Capabilities (Section 16) */}
        {factory.outputProducts && factory.outputProducts.length > 0 && (
          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <span className="text-[10.5px] font-bold text-slate-400 block font-heading uppercase">
              Sản phẩm / Năng lực công bố:
            </span>
            <div className="flex flex-wrap gap-1">
              {factory.outputProducts.slice(0, 2).map((prod, pIdx) => (
                <span 
                  key={pIdx} 
                  className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200/60 truncate max-w-full"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Public Capabilities Tag */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 font-mono">
          {factory.oemAvailable && (
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
              OEM / GIA CÔNG
            </span>
          )}
          {factory.exportAvailable && (
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
              XUẤT KHẨU
            </span>
          )}
          {factory.distributionAvailable && (
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
              PHÂN PHỐI
            </span>
          )}
        </div>
      </div>

      {/* Card Footer & Dual CTAs */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[10.5px] text-slate-400 font-mono">
          Hoạt động từ {factory.foundedYear}
        </span>

        <div className="flex items-center space-x-1.5">
          {factory.hasPublicNeeds && (
            <Link
              to={`/nhu-cau-mua-hang?factoryId=${factory.id}`}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-xl transition flex items-center space-x-1"
              title="Xem các gói thu mua công khai của nhà máy"
            >
              <ShoppingBag className="w-3 h-3 text-amber-600" />
              <span>Nhu cầu ({factory.publicNeedsCount})</span>
            </Link>
          )}

          <Link
            to={detailUrl}
            className="px-3 py-1.5 bg-[#0052cc] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shadow-xs"
          >
            <span>XEM NHÀ MÁY</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
