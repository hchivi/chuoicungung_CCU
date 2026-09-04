import React, { useState } from 'react';
import { 
  Filter, Search, MapPin, Building2, Layers, RotateCcw, 
  Sparkles, Check, ChevronDown, Award, Briefcase, Zap, ShieldCheck
} from 'lucide-react';

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên",
  "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Tây Ninh", "Bình Phước", "Tiền Giang", "Bến Tre"
];

const INDUSTRIES = [
  { id: 'all', label: 'Tất cả ngành nghề' },
  { id: 'dien-tu', label: '⚡ Điện tử & Bán dẫn (FDI)' },
  { id: 'may-mac', label: '🧵 Dệt may, Da giày & Thời trang' },
  { id: 'thuc-pham', label: '🍱 Thực phẩm, Đồ uống & Nông sản' },
  { id: 'co-khi', label: '⚙️ Cơ khí chính xác, Ô tô & Khuôn mẫu' },
  { id: 'bao-bi', label: '📦 Bao bì, In ấn & Thùng Carton' },
  { id: 'nhua-hoa-chat', label: '🧪 Nhựa, Cao su & Hóa chất' },
  { id: 'duoc-pham', label: '💊 Dược phẩm & Phòng sạch GMP' },
  { id: 'go-noi-that', label: '🪵 Gỗ, Nội thất & Xuất khẩu' }
];

const PROCUREMENT_PHASES = [
  { id: "all", label: "Tất cả các Pha Nhu Cầu" },
  { id: "4.1", label: "Pha 4.1: Cung ứng NVL & Bao bì, Carton", color: "indigo" },
  { id: "4.2", label: "Pha 4.2: Gia công CNC & Xử lý bề mặt", color: "amber" },
  { id: "4.3", label: "Pha 4.3: Logistics Kho bãi & Vận tải KCN", color: "blue" },
  { id: "5.1", label: "Pha 5.1: Tuyển dụng & Đào tạo nhân lực", color: "purple" },
  { id: "5.2", label: "Pha 5.2: Suất ăn công nghiệp & Phúc lợi", color: "amber" },
  { id: "5.3", label: "Pha 5.3: Đồng phục & Bảo hộ lao động (PPE)", color: "emerald" },
  { id: "2.3", label: "Pha 2.3: Cơ điện MEP & PCCC nhà máy", color: "sky" },
  { id: "3.2", label: "Pha 3.2: Hoàn thiện Phòng sạch & Sơn Epoxy", color: "purple" },
  { id: "6.3", label: "Pha 6.3: Tự động hóa & Robot AGV", color: "teal" }
];

const FACTORY_TYPES = [
  "Tất cả loại hình",
  "Doanh nghiệp FDI",
  "100% Vốn nước ngoài",
  "Kinh tế tư nhân",
  "Công ty Cổ phần",
  "Công ty TNHH"
];

export default function FactoryHunterSidebar({
  searchTerm,
  setSearchTerm,
  selectedProvince,
  setSelectedProvince,
  selectedKcn,
  setSelectedKcn,
  selectedIndustry,
  setSelectedIndustry,
  selectedPhase,
  setSelectedPhase,
  selectedType,
  setSelectedType,
  onResetFilters,
  filteredKcnList,
  totalMatchingCount
}) {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  const hasActiveFilter = Boolean(
    searchTerm || 
    (selectedProvince && selectedProvince !== 'Toàn quốc' && selectedProvince !== 'all') || 
    (selectedKcn && selectedKcn !== 'all') || 
    (selectedIndustry && selectedIndustry !== 'all') || 
    (selectedPhase && selectedPhase !== 'all') || 
    (selectedType && selectedType !== 'all' && selectedType !== 'Tất cả loại hình')
  );

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 lg:sticky lg:top-24">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black font-heading tracking-wide uppercase text-slate-900">
                BỘ LỌC SĂN KHÁCH
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {totalMatchingCount?.toLocaleString('vi-VN')} Nhà máy khớp lệnh
              </p>
            </div>
          </div>

          {hasActiveFilter && (
            <button
              onClick={onResetFilters}
              className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Search className="w-3 h-3 text-[#0052cc]" />
            <span>Tìm kiếm từ khóa</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tên nhà máy, MST, ngành..."
              className="w-full pl-3.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
            />
          </div>
        </div>

        {/* 1. Lọc theo Tỉnh Thành (34 Tỉnh) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Tỉnh / Thành phố</span>
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedKcn('all');
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none cursor-pointer"
          >
            {PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov === "Toàn quốc" ? "📍 Toàn quốc (34 Tỉnh)" : `📍 ${prov}`}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Lọc theo Khu Công Nghiệp (480+ KCN) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#0052cc]" />
            <span>Khu Công Nghiệp ({filteredKcnList?.length || 0})</span>
          </label>
          <select
            value={selectedKcn}
            onChange={(e) => setSelectedKcn(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none cursor-pointer"
          >
            <option value="all">🏢 Tất cả Khu công nghiệp</option>
            {filteredKcnList?.map((k) => (
              <option key={k.id || k._id || k.stt} value={k.name}>
                {k.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Lọc theo Pha Nhu Cầu Cung Ứng (Pha 1.1 đến 6.3) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Pha Nhu Cầu Cung Ứng</span>
          </label>
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="w-full px-3 py-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none cursor-pointer"
          >
            {PROCUREMENT_PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Lọc theo Ngành Nghề Sản Xuất */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-indigo-500" />
            <span>Ngành nghề sản xuất</span>
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none cursor-pointer"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Lọc theo Loại Hình Doanh Nghiệp (FDI/Vốn nước ngoài) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-sky-500" />
            <span>Loại hình sở hữu</span>
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none cursor-pointer"
          >
            {FACTORY_TYPES.map((t) => (
              <option key={t} value={t === "Tất cả loại hình" ? "all" : t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Pro Hunter VIP Tip */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/80 rounded-2xl p-3 space-y-1 text-xs text-slate-700">
          <div className="flex items-center space-x-1 text-[#0052cc] font-bold text-[11px]">
            <Sparkles className="w-3 h-3" />
            <span>Thuật Toán Săn Khách B2B</span>
          </div>
          <p className="text-[10.5px] text-slate-600 leading-relaxed">
            Hội viên đạt chuẩn <strong>KYC Lớp 2 & 3</strong> được ưu tiên chuyển hồ sơ báo giá thẳng vào Dashboard Mua Hàng FDI trong 0.45s.
          </p>
        </div>

      </div>
    </aside>
  );
}
