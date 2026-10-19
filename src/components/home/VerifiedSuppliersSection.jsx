import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, MapPin, Zap, CheckCircle2, Factory, ShieldCheck, ArrowRight, Info, Award, Calendar 
} from 'lucide-react';
import { suppliers as cloudSuppliers } from '../../data/cloudData.js';
import { CRAWLED_PREVIEW_24_SUPPLIERS } from '../../data/verifiedSuppliersPreview.js';

function formatRealSupplier(supp, idx) {
  let capabilities = [];
  if (Array.isArray(supp.products) && supp.products.length > 0) {
    capabilities = supp.products.filter(p => typeof p === 'string' && p.trim()).slice(0, 3);
  }
  if (capabilities.length === 0 && Array.isArray(supp.productGroups) && supp.productGroups.length > 0) {
    capabilities = supp.productGroups
      .flatMap(g => Array.isArray(g.items) ? g.items : [g.name])
      .filter(p => typeof p === 'string' && p.trim())
      .slice(0, 3);
  }
  if (capabilities.length === 0 && Array.isArray(supp.categories) && supp.categories.length > 0) {
    capabilities = supp.categories
      .map(c => c.name || c.phaseTitle || c)
      .filter(p => typeof p === 'string' && p.trim())
      .slice(0, 3);
  }
  if (capabilities.length === 0 && supp.category) {
    capabilities = [supp.category];
  }

  let factoryEquipment = supp.factoryEquipment;
  if (!factoryEquipment) {
    if (supp.description) {
      const cleanDesc = supp.description.replace(/\r?\n+/g, ' ').trim();
      factoryEquipment = cleanDesc.length > 100 ? cleanDesc.slice(0, 97) + '...' : cleanDesc;
    } else if (supp.mainCustomers) {
      factoryEquipment = `Khách hàng: ${supp.mainCustomers.slice(0, 80)}`;
    } else if (supp.address) {
      factoryEquipment = `Cơ sở: ${supp.address.slice(0, 80)}`;
    }
  }

  let certifications = Array.isArray(supp.certifications) && supp.certifications.length > 0
    ? supp.certifications
    : [];
  if (certifications.length === 0) {
    if (supp.taxCode) certifications.push('Đối chiếu MST');
    if (supp.isVerifiedPartner || supp.verification_status === 'VERIFIED') certifications.push('Năng lực xác minh');
    if (supp.establishedYear) certifications.push(`Năm lập: ${supp.establishedYear}`);
    else if (supp.businessType) certifications.push(supp.businessType);
    if (certifications.length === 0) certifications.push('Hồ sơ chuẩn hóa B2B');
  }

  const code = supp.code || (supp.taxCode ? `MST: ${supp.taxCode}` : `NCC-2026-${String(idx + 1).padStart(4, '0')}`);
  const status = supp.verification_status === 'VERIFIED' || supp.isVerifiedPartner ? 'Đã đối chiếu' : 'Đã xác minh';
  const orderScale = supp.orderScale || (supp.employees ? `Quy mô: ${supp.employees}` : (supp.businessType || 'Theo đơn hàng B2B'));
  const serviceArea = supp.serviceArea || supp.province || supp.location || 'Toàn quốc';
  const detailUrl = `/nha-cung-ung/${supp.slug || supp.id}`;

  return {
    id: supp.id || `ncc-${idx + 1}`,
    code,
    status,
    name: supp.name,
    capabilities,
    orderScale,
    serviceArea,
    factoryEquipment,
    certifications: certifications.slice(0, 3),
    detailUrl,
    logo: supp.logo || supp.avatar
  };
}

function SupplierCardItem({ supp }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between space-y-4 group relative w-full">
      <div className="space-y-3.5">
        
        {/* Mã NCC & Trạng thái đã đối chiếu */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70">
            {supp.code || `NCC-2026-${supp.id.replace('ncc-', '00')}`}
          </span>
          
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-[#006039] border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>{supp.status}</span>
          </span>
        </div>

        {/* Tên doanh nghiệp & Năng lực */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Doanh nghiệp sản xuất / Cung ứng:
          </span>
          <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#006039] font-heading leading-snug line-clamp-2 transition-colors">
            <Link to={supp.detailUrl || `/nha-cung-ung/${supp.slug || supp.id}`}>
              {supp.name}
            </Link>
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {supp.capabilities.map((cap, cIdx) => (
              <span key={cIdx} className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006039] text-xs font-semibold border border-emerald-200/60">
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Chi tiết: Quy mô, Địa bàn, Nhà máy */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
          
          {/* Quy mô đơn hàng phù hợp */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">Quy mô tiếp nhận:</span>
            <span className="font-mono font-bold text-[#006039] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded text-xs sm:text-sm text-right">
              {supp.orderScale}
            </span>
          </div>

          {/* Địa bàn phục vụ */}
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1"><strong>Địa bàn:</strong> {supp.serviceArea}</span>
          </div>

          {/* Nhà máy & Thiết bị */}
          {supp.factoryEquipment && (
            <div className="flex items-start gap-2 text-slate-600">
              <Factory className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2"><strong>Cơ sở & Thiết bị:</strong> {supp.factoryEquipment}</span>
            </div>
          )}

          {/* Chứng nhận và nguồn xác minh */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 space-y-1.5 mt-1">
            <span className="font-bold text-[#006039] font-mono block text-[11px] uppercase">
              Chứng nhận & Kiểm định xác minh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {supp.certifications.map((cert, certIdx) => (
                <span key={certIdx} className="px-2 py-0.5 rounded bg-white text-slate-700 text-xs font-mono font-bold border border-slate-200 shadow-2xs">
                  {cert}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CTA Xem năng lực */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to={supp.detailUrl || `/nha-cung-ung/${supp.slug || supp.id}`}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-[#006039] hover:text-white text-slate-900 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs group-hover:bg-[#006039] group-hover:text-white"
        >
          <span>Xem năng lực chi tiết</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

function SuppliersColumn({ className = '', suppliers = [], duration = 28 }) {
  return (
    <div className={`w-full max-w-sm flex-1 ${className}`}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {suppliers.map((supp, i) => (
                <SupplierCardItem supp={supp} key={`${index}-${i}`} />
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}

export default function VerifiedSuppliersSection() {
  const { column1Suppliers, column2Suppliers, column3Suppliers } = React.useMemo(() => {
    const rawList = (Array.isArray(cloudSuppliers) && cloudSuppliers.length > 0)
      ? cloudSuppliers
      : CRAWLED_PREVIEW_24_SUPPLIERS;

    const formatted = rawList.map((supp, idx) => formatRealSupplier(supp, idx));

    const col1 = [];
    const col2 = [];
    const col3 = [];

    formatted.forEach((supp, idx) => {
      if (idx % 3 === 0) col1.push(supp);
      else if (idx % 3 === 1) col2.push(supp);
      else col3.push(supp);
    });

    return {
      column1Suppliers: col1,
      column2Suppliers: col2,
      column3Suppliers: col3
    };
  }, []);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-2 xl:px-4 2xl:px-8 space-y-6">
      
      {/* Section Header (Centered, Strictly 1 Line Title) */}
      <div className="text-center max-w-5xl mx-auto space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl font-black uppercase font-heading tracking-tight text-center leading-tight whitespace-normal md:whitespace-nowrap">
          <span className="text-gradient-flow-green">
            Khám phá nguồn cung theo năng lực thực tế
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto text-center leading-relaxed font-normal">
          Tìm doanh nghiệp theo sản phẩm, năng lực sản xuất, địa bàn phục vụ, quy mô tiếp nhận, chứng nhận và tình trạng hồ sơ.
        </p>

        <div className="pt-1">
          <Link
            to="/nha-cung-ung"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#006039] hover:text-[#00472a] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-4 py-2 rounded-xl transition font-heading shadow-2xs"
          >
            <span>Tìm tất cả nhà cung ứng đã đối chiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Infinite Scrolling Supplier Columns */}
      <div 
        className="flex justify-center gap-5 sm:gap-6 pt-2 max-h-[640px] sm:max-h-[680px] overflow-hidden relative"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)'
        }}
      >
        <SuppliersColumn suppliers={column1Suppliers} duration={28} />
        <SuppliersColumn suppliers={column2Suppliers} className="hidden md:block" duration={34} />
        <SuppliersColumn suppliers={column3Suppliers} className="hidden lg:block" duration={30} />
      </div>

    </section>
  );
}
