import React, { useState } from 'react';
import { 
  Flame, Zap, TrendingUp, MapPin, Building2, Factory, 
  Layers, ArrowUpRight, Search, Filter, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function HeatmapProvincesTable({ lang = 'vi' }) {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const heatmapProvinces = [
    {
      name: 'Bắc Ninh',
      region: 'north',
      kcn: 16,
      factories: 891,
      enterprises: 10500,
      activeRfqs: 342,
      rfqGrowth: '+28.4%',
      intensity: 'high', // 'very_high' | 'high' | 'medium' | 'normal'
      hotPhase: 'Pha 2: Gia công SMT & Chipset điện tử',
      hotPhaseCode: 'P2.2',
      hotPhaseColor: 'bg-sky-100 text-sky-800 border-sky-300',
      avgMatchTime: '3.8 giờ',
      liquidity: 'Cực Nóng 🔥',
      liquidityColor: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      name: 'Hà Nội',
      region: 'north',
      kcn: 35,
      factories: 832,
      enterprises: 18500,
      activeRfqs: 295,
      rfqGrowth: '+31.2%',
      intensity: 'very_high',
      hotPhase: 'Pha 6: Bao bì, Hộp quà dọc tỷ lệ 9:16 (HDBank, VietinBank)',
      hotPhaseCode: 'P6.1',
      hotPhaseColor: 'bg-purple-100 text-purple-800 border-purple-300',
      avgMatchTime: '4.2 giờ',
      liquidity: 'Cực Nóng 🔥',
      liquidityColor: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      name: 'Bình Dương',
      region: 'south',
      kcn: 32,
      factories: 1942,
      enterprises: 19500,
      activeRfqs: 412,
      rfqGrowth: '+19.8%',
      intensity: 'very_high',
      hotPhase: 'Pha 4: Phụ trợ Ép phun, Cơ khí chính xác & Gỗ',
      hotPhaseCode: 'P4.1',
      hotPhaseColor: 'bg-blue-100 text-blue-800 border-blue-300',
      avgMatchTime: '5.1 giờ',
      liquidity: 'Rất Cao ⚡',
      liquidityColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      name: 'Hải Phòng',
      region: 'north',
      kcn: 27,
      factories: 689,
      enterprises: 11200,
      activeRfqs: 218,
      rfqGrowth: '+22.5%',
      intensity: 'high',
      hotPhase: 'Pha 5: Logistics Cảng biển, Kho bãi & Chuỗi cung ứng',
      hotPhaseCode: 'P5.2',
      hotPhaseColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      avgMatchTime: '4.9 giờ',
      liquidity: 'Rất Cao ⚡',
      liquidityColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      name: 'Đồng Nai',
      region: 'south',
      kcn: 27,
      factories: 1667,
      enterprises: 16800,
      activeRfqs: 284,
      rfqGrowth: '+16.3%',
      intensity: 'high',
      hotPhase: 'Pha 3: Polymer kỹ thuật, Cao su & Dây truyền tự động',
      hotPhaseCode: 'P3.1',
      hotPhaseColor: 'bg-orange-100 text-orange-800 border-orange-300',
      avgMatchTime: '6.4 giờ',
      liquidity: 'Rất Cao ⚡',
      liquidityColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      name: 'TP. Hồ Chí Minh',
      region: 'south',
      kcn: 18,
      factories: 1175,
      enterprises: 32000,
      activeRfqs: 388,
      rfqGrowth: '+24.1%',
      intensity: 'very_high',
      hotPhase: 'Pha 1 & 6: Nghiên cứu R&D, Brand Packaging & Bán lẻ',
      hotPhaseCode: 'P1.3',
      hotPhaseColor: 'bg-rose-100 text-rose-800 border-rose-300',
      avgMatchTime: '4.0 giờ',
      liquidity: 'Cực Nóng 🔥',
      liquidityColor: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      name: 'Long An',
      region: 'south',
      kcn: 33,
      factories: 1439,
      enterprises: 14200,
      activeRfqs: 196,
      rfqGrowth: '+18.0%',
      intensity: 'medium',
      hotPhase: 'Pha 4: Chế biến Nông sản, Thực phẩm sấy & Thùng carton',
      hotPhaseCode: 'P4.3',
      hotPhaseColor: 'bg-teal-100 text-teal-800 border-teal-300',
      avgMatchTime: '7.2 giờ',
      liquidity: 'Tích Cực ✨',
      liquidityColor: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  const filteredProvinces = heatmapProvinces.filter(p => {
    const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
    const matchText = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      p.hotPhase.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchText;
  });

  // Heatmap styling helper based on intensity
  const getHeatmapCellStyle = (intensity, baseClass = '') => {
    switch (intensity) {
      case 'very_high':
        return `bg-rose-50/90 text-rose-950 font-bold border-rose-100 ${baseClass}`;
      case 'high':
        return `bg-amber-50/80 text-amber-950 font-semibold border-amber-100 ${baseClass}`;
      case 'medium':
        return `bg-blue-50/70 text-blue-950 border-blue-100 ${baseClass}`;
      default:
        return `bg-slate-50/60 text-slate-900 ${baseClass}`;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-heading">
              {lang === 'en' ? 'Industrial Province Heatmap & Hot Demands' : 'Bảng Nhiệt Hoạt Động & Pha Nhu Cầu Nóng Theo Tỉnh Thành'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Color intensity reflects real-time RFQ liquidity and procurement urgency.'
              : 'Màu nền ô biểu thị cường độ nhiệt giao dịch (Đỏ/Cam = Tăng trưởng đột biến & Khát hàng cung ứng).'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs font-heading">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Toàn quốc' },
              { id: 'north', label: 'Miền Bắc' },
              { id: 'south', label: 'Miền Nam' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                  selectedRegion === r.id ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <Link
            to="/ban-do-viet-nam"
            className="text-[11px] text-[#0052cc] font-bold hover:underline flex items-center shrink-0"
          >
            Bản đồ GIS →
          </Link>
        </div>
      </div>

      {/* Heatmap Intensity Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
        <span className="font-bold font-heading text-slate-700">CHỈ SỐ NHIỆT (LIQUIDITY HEAT):</span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> Khớp Lệnh Đột Biến (&gt;25%)
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Tăng Trưởng Nhanh (15-25%)
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Ổn Định
        </span>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 text-slate-600 text-[10px] uppercase font-bold font-heading border-b border-slate-200">
              <th className="p-3">Tỉnh / Thành Phố</th>
              <th className="p-3 text-center">KCN</th>
              <th className="p-3 text-center">Nhà Máy</th>
              <th className="p-3 text-center">Doanh Nghiệp</th>
              <th className="p-3">Pha Nhu Cầu Nóng Nhất</th>
              <th className="p-3 text-center">Khớp Lệnh RFQ</th>
              <th className="p-3 text-center">Tốc Độ Khớp TB</th>
              <th className="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 font-sans">
            {filteredProvinces.map((p, idx) => (
              <tr key={p.name} className="hover:bg-slate-50/90 transition-colors">
                
                {/* Province Name with Heat indicator */}
                <td className="p-3 font-bold text-slate-900 font-heading">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
                    <span className="text-xs sm:text-sm">{p.name}</span>
                  </div>
                </td>

                {/* KCN Count (Heatmap Cell) */}
                <td className={`p-3 text-center font-mono ${getHeatmapCellStyle(p.intensity)}`}>
                  {p.kcn}
                </td>

                {/* Factories Count (Heatmap Cell) */}
                <td className={`p-3 text-center font-mono ${getHeatmapCellStyle(p.intensity)}`}>
                  {p.factories.toLocaleString()}
                </td>

                {/* Enterprises (Heatmap Cell) */}
                <td className={`p-3 text-center font-mono ${getHeatmapCellStyle(p.intensity)}`}>
                  {p.enterprises.toLocaleString()}
                </td>

                {/* Pha Nhu Cầu Nóng Nhất (Hot Phase Column) */}
                <td className="p-3 max-w-xs">
                  <div className="flex items-start space-x-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black shrink-0 border ${p.hotPhaseColor}`}>
                      {p.hotPhaseCode}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800 leading-snug">
                      {p.hotPhase}
                    </span>
                  </div>
                </td>

                {/* Active RFQs + Growth */}
                <td className={`p-3 text-center font-mono ${getHeatmapCellStyle(p.intensity)}`}>
                  <div className="font-bold text-xs">{p.activeRfqs}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">{p.rfqGrowth}</div>
                </td>

                {/* Match Speed */}
                <td className="p-3 text-center font-mono text-[11px] text-slate-700 font-bold">
                  {p.avgMatchTime}
                </td>

                {/* Action Button */}
                <td className="p-3 text-right">
                  <button
                    onClick={() => navigate(`/nhu-cau?location=${encodeURIComponent(p.name)}`)}
                    className="px-3 py-1.5 bg-[#0052cc] hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition font-heading shadow-xs cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>Vào Sàn</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
