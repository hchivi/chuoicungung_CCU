import React, { useMemo } from 'react';
import { 
  Filter, Search, RotateCcw, ShieldCheck, CheckSquare, 
  Square, Sparkles, Cpu, Award, Zap, HelpCircle
} from 'lucide-react';

export default function StageFilterSidebar({
  stageId = 1,
  filters,
  setFilters,
  onResetFilters,
  totalResults = 0,
  themeColor = "#8b5cf6"
}) {
  const kycOptions = [
    { id: 'diamond', label: '💎 Kim Cương (KYC Lớp 3)', sub: 'Bảo chứng tài chính & quy mô lớn' },
    { id: 'gold', label: '🥇 Vàng (KYC Lớp 2)', sub: 'Đã xác minh năng lực thực tế' },
    { id: 'silver', label: '🥈 Bạc (KYC Lớp 1)', sub: 'Đã xác thực pháp lý cơ sở' }
  ];

  // Stage-specific Standard & Certification Options
  const standardOptions = useMemo(() => {
    switch (Number(stageId)) {
      case 2:
        return [
          { id: 'LEED Green Building', label: 'LEED Gold/Platinum (Công trình xanh)' },
          { id: 'BIM Level 2', label: 'BIM Level 2/3 (Mô hình 3D kết cấu MEP)' },
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Quản lý chất lượng)' },
          { id: 'QCVN 06:2022 PCCC', label: 'QCVN 06:2022 (Chuẩn PCCC nhà xưởng)' },
          { id: 'ISO 45001', label: 'ISO 45001 (An toàn lao động OHSAS)' },
          { id: 'ISO 14001', label: 'ISO 14001 (Môi trường & Nước thải)' }
        ];
      case 3:
        return [
          { id: 'IEC 61131-3', label: 'IEC 61131-3 (Chuẩn PLC/Scada Tự động hóa)' },
          { id: 'ISO 14644 (Cleanroom)', label: 'ISO 14644 (Phòng sạch Class 100 - 100k)' },
          { id: 'ISO 50001 (Năng lượng)', label: 'ISO 50001 (Quản lý tiết kiệm điện năng)' },
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Quản lý chất lượng)' },
          { id: 'CE Mark', label: 'CE Mark (Tiêu chuẩn an toàn máy Châu Âu)' },
          { id: 'GMP/HACCP', label: 'GMP/HACCP (Dược phẩm & Thực phẩm)' }
        ];
      case 4:
        return [
          { id: 'IATF 16949', label: 'IATF 16949 (Chuỗi cung ứng Ô tô & Điện tử)' },
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Quản lý chất lượng)' },
          { id: 'ISO 27001', label: 'ISO 27001 (Bảo mật dữ liệu Smart Factory)' },
          { id: 'CMMI Level 5', label: 'CMMI Level 5 (Phần mềm MES điều hành)' },
          { id: 'RoHS/REACH', label: 'RoHS/REACH (An toàn hóa chất xuất khẩu)' },
          { id: 'FIATA', label: 'FIATA (Logistics & Kho bãi 3PL)' }
        ];
      case 5:
        return [
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Quản lý dịch vụ)' },
          { id: 'ISO 45001', label: 'ISO 45001 (An toàn vệ sinh lao động)' },
          { id: 'HACCP', label: 'HACCP / ISO 22000 (Suất ăn công nghiệp)' },
          { id: 'C-TPAT', label: 'C-TPAT / AEO (Hải quan bảo đảm an ninh)' },
          { id: 'EN ISO 20345 (S3)', label: 'EN ISO 20345 (Giày & Trang bị BHLĐ S3)' }
        ];
      case 6:
        return [
          { id: 'ESG Standard (GRI/SASB)', label: 'ESG Standard (Báo cáo phát triển bền vững)' },
          { id: 'ISO 14064 (CO2 Offset)', label: 'ISO 14064 (Kiểm kê giảm phát thải CO2)' },
          { id: 'LEED Zero Energy', label: 'LEED Zero Carbon / Điện mặt trời áp mái' },
          { id: 'BSCI / Sedex SMETA', label: 'BSCI / Sedex SMETA (Audit trách nhiệm XH)' },
          { id: 'CMMI Level 5', label: 'CMMI Level 5 (Robot AGV & Chuyển đổi số)' },
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Chuẩn hóa mở rộng quy mô)' }
        ];
      case 1:
      default:
        return [
          { id: 'ISO 9001:2015', label: 'ISO 9001:2015 (Quản lý chất lượng)' },
          { id: 'ISO 14001', label: 'ISO 14001 (Môi trường & ESG)' },
          { id: 'QCVN 06:2022 PCCC', label: 'QCVN 06:2022 (Chuẩn PCCC mới)' },
          { id: 'BIM Level 2', label: 'BIM Level 2 (Số hóa thiết kế 3D)' },
          { id: 'FIATA', label: 'FIATA (Logistics Quốc tế)' },
          { id: 'LEED Green Building', label: 'LEED Green Building (Công trình xanh)' }
        ];
    }
  }, [stageId]);

  const toggleKyc = (kycId) => {
    const current = filters.kycTiers || [];
    if (current.includes(kycId)) {
      setFilters({ ...filters, kycTiers: current.filter(k => k !== kycId) });
    } else {
      setFilters({ ...filters, kycTiers: [...current, kycId] });
    }
  };

  const toggleStandard = (stdId) => {
    const current = filters.standards || [];
    if (current.includes(stdId)) {
      setFilters({ ...filters, standards: current.filter(s => s !== stdId) });
    } else {
      setFilters({ ...filters, standards: [...current, stdId] });
    }
  };

  const hasActiveFilters = 
    Boolean(filters.search) || 
    (filters.kycTiers && filters.kycTiers.length > 0) || 
    (filters.standards && filters.standards.length > 0) || 
    filters.odooOnly;

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6 sticky top-24">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div 
              style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
            >
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase font-heading">
                Bộ Lọc Đặc Quyền
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Tìm thấy <strong className="text-slate-900">{totalResults}</strong> đối tác phù hợp
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center space-x-1 transition"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* 1. Keyword Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading flex items-center justify-between">
            <span>Tìm kiếm từ khóa</span>
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên, dịch vụ, tiêu chuẩn..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 2. Cấp độ Xác thực KYC (3-Tier) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cấp độ KYC B2B</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Độc quyền</span>
          </label>

          <div className="space-y-2">
            {kycOptions.map((opt) => {
              const isChecked = (filters.kycTiers || []).includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleKyc(opt.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-2.5 ${
                    isChecked
                      ? 'bg-slate-50 border-slate-400 shadow-2xs'
                      : 'border-slate-200/80 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="mt-0.5 text-slate-600">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {opt.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Toggle ERP / API Ready */}
        <div className="pt-2 border-t border-slate-100">
          <div 
            onClick={() => setFilters({ ...filters, odooOnly: !filters.odooOnly })}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              filters.odooOnly 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-2xs' 
                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-900 font-heading">
                  Đồng bộ ERP / API Quản trị
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Chỉ hiện đối tác sẵn sàng API dữ liệu đơn hàng
              </p>
            </div>

            {/* Switch UI */}
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${filters.odooOnly ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${filters.odooOnly ? 'transform translate-x-4' : ''}`} />
            </div>
          </div>
        </div>

        {/* 4. Tiêu chuẩn & Chứng chỉ Quốc tế Theo Từng Giai Đoạn */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-heading flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Tiêu chuẩn & Pháp lý GĐ {stageId}</span>
          </label>

          <div className="space-y-2">
            {standardOptions.map((std) => {
              const isChecked = (filters.standards || []).includes(std.id);
              return (
                <label
                  key={std.id}
                  className="flex items-center space-x-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleStandard(std.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] font-medium leading-tight">{std.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 5. Mini B2B Buyer Protection Notice */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Bảo Vệ Giám Đốc Mua Hàng GĐ {stageId}</span>
          </div>
          <p className="leading-snug">
            Toàn bộ thông tin chào giá và năng lực kỹ thuật được bảo chứng qua hợp đồng điện tử CCU SafeMatch SLA &lt; 2h.
          </p>
        </div>

      </div>
    </aside>
  );
}
