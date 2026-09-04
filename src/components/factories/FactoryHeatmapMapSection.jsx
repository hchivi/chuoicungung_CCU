import React, { useState, useMemo } from 'react';
import { MapPin, Building2, Factory, Zap, TrendingUp, ChevronRight, Sparkles, Filter } from 'lucide-react';

const TOP_INDUSTRIAL_HUBS = [
  { id: 'binh-duong', name: 'Bình Dương', region: 'Đông Nam Bộ', kcns: 33, factories: 3450, openDemands: 248, growth: '+14%', color: 'from-blue-600 to-indigo-700', x: 74, y: 72 },
  { id: 'dong-nai', name: 'Đồng Nai', region: 'Đông Nam Bộ', kcns: 35, factories: 2980, openDemands: 195, growth: '+12%', color: 'from-indigo-600 to-purple-700', x: 78, y: 74 },
  { id: 'tphcm', name: 'TP. Hồ Chí Minh', region: 'Đông Nam Bộ', kcns: 22, factories: 2100, openDemands: 310, growth: '+18%', color: 'from-emerald-600 to-teal-700', x: 72, y: 76 },
  { id: 'bac-ninh', name: 'Bắc Ninh', region: 'Miền Bắc', kcns: 25, factories: 1850, openDemands: 176, growth: '+22%', color: 'from-amber-600 to-orange-700', x: 38, y: 18 },
  { id: 'long-an', name: 'Long An', region: 'Đồng bằng Sông Cửu Long', kcns: 32, factories: 1420, openDemands: 142, growth: '+15%', color: 'from-rose-600 to-pink-700', x: 68, y: 78 },
  { id: 'hai-phong', name: 'Hải Phòng', region: 'Miền Bắc', kcns: 20, factories: 980, openDemands: 112, growth: '+16%', color: 'from-cyan-600 to-blue-700', x: 42, y: 20 },
  { id: 'ha-noi', name: 'Hà Nội', region: 'Miền Bắc', kcns: 18, factories: 850, openDemands: 184, growth: '+9%', color: 'from-purple-600 to-indigo-700', x: 36, y: 19 },
  { id: 'bac-giang', name: 'Bắc Giang', region: 'Miền Bắc', kcns: 15, factories: 620, openDemands: 94, growth: '+28%', color: 'from-orange-600 to-amber-700', x: 40, y: 16 },
  { id: 'ba-ria-vung-tau', name: 'Bà Rịa - Vũng Tàu', region: 'Đông Nam Bộ', kcns: 16, factories: 650, openDemands: 88, growth: '+11%', color: 'from-teal-600 to-emerald-700', x: 79, y: 78 },
  { id: 'da-nang', name: 'Đà Nẵng', region: 'Miền Trung', kcns: 8, factories: 420, openDemands: 64, growth: '+8%', color: 'from-sky-600 to-blue-700', x: 58, y: 45 },
  { id: 'quang-nam', name: 'Quảng Nam', region: 'Miền Trung', kcns: 12, factories: 380, openDemands: 52, growth: '+10%', color: 'from-blue-600 to-cyan-700', x: 60, y: 47 },
  { id: 'hai-duong', name: 'Hải Dương', region: 'Miền Bắc', kcns: 16, factories: 540, openDemands: 68, growth: '+12%', color: 'from-indigo-600 to-blue-700', x: 39, y: 20 },
  { id: 'hung-yen', name: 'Hưng Yên', region: 'Miền Bắc', kcns: 15, factories: 490, openDemands: 61, growth: '+14%', color: 'from-amber-600 to-yellow-600', x: 37, y: 21 },
  { id: 'vinh-phuc', name: 'Vĩnh Phúc', region: 'Miền Bắc', kcns: 14, factories: 470, openDemands: 55, growth: '+13%', color: 'from-emerald-600 to-green-700', x: 35, y: 17 },
  { id: 'tien-giang', name: 'Tiền Giang', region: 'Đồng bằng Sông Cửu Long', kcns: 8, factories: 310, openDemands: 38, growth: '+7%', color: 'from-rose-600 to-orange-600', x: 67, y: 81 }
];

export default function FactoryHeatmapMapSection({ selectedProvince, onSelectProvince }) {
  const [activeRegion, setActiveRegion] = useState('Toàn quốc');
  const [hoveredHub, setHoveredHub] = useState(null);

  const filteredHubs = useMemo(() => {
    if (activeRegion === 'Toàn quốc') return TOP_INDUSTRIAL_HUBS;
    return TOP_INDUSTRIAL_HUBS.filter(h => h.region === activeRegion);
  }, [activeRegion]);

  const handleHubClick = (hubName) => {
    if (onSelectProvince) {
      onSelectProvince(hubName);
    }
    const target = document.getElementById('danh-sach-nha-may');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 lg:p-8 shadow-sm space-y-6">
      
      {/* Header & Region Switcher */}
      <div className="flex flex-col items-center text-center space-y-4 border-b border-slate-100 pb-5">
        <div className="space-y-1 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>BẢN ĐỒ NHIỆT KCN & DÒNG VỐN SẢN XUẤT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-950">
            Tọa Độ Mạng Lưới Nhà Máy & Vùng Công Nghiệp Trọng Điểm
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Bấm chọn tỉnh thành để tự động định vị & lọc ngay danh sách các nhà máy FDI đang mở nhu cầu thu mua.
          </p>
        </div>

        {/* Region Tabs - Always 1 single horizontal row centered */}
        <div className="w-full flex justify-center items-center overflow-x-auto no-scrollbar pt-1">
          <div className="inline-flex items-center flex-nowrap gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0 shadow-2xs">
            {['Toàn quốc', 'Miền Bắc', 'Miền Trung', 'Đông Nam Bộ', 'Đồng bằng Sông Cửu Long'].map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeRegion === reg 
                    ? 'bg-white text-[#0052cc] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Key Industrial Hotspots Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {filteredHubs.map((hub) => {
          const isSelected = selectedProvince === hub.name;
          const isHovered = hoveredHub?.id === hub.id;

          return (
            <div
              key={hub.id}
              onClick={() => handleHubClick(hub.name)}
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? 'bg-blue-50/90 border-[#0052cc] shadow-md ring-2 ring-blue-500/20'
                  : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-[#0052cc]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-extrabold text-slate-900 text-sm font-heading group-hover:text-[#0052cc] transition">
                      {hub.name}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{hub.region}</span>
                </div>

                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-mono font-bold">
                  {hub.growth}
                </span>
              </div>

              {/* Data numbers */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Quy mô KCN</span>
                  <strong className="text-slate-800 font-mono font-bold">{hub.kcns} KCN</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Nhà máy</span>
                  <strong className="text-slate-800 font-mono font-bold">{hub.factories.toLocaleString()}+</strong>
                </div>
              </div>

              {/* Open Demands Indicator */}
              <div className="pt-1.5 flex items-center justify-between text-[11px] bg-white rounded-xl p-2 border border-slate-200/70 shadow-2xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Nhu cầu mở:
                </span>
                <strong className="text-[#0052cc] font-mono font-bold">
                  {hub.openDemands} RFQ
                </strong>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
