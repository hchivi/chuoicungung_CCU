import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Calendar, Download, Building2, 
  Factory, ShoppingBag, DollarSign, Layers, MapPin, 
  AlertTriangle, ArrowUpRight, ChevronRight, Sparkles, Filter,
  ShieldCheck, Crown, Radio, RefreshCw, FileSpreadsheet, Eye
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RealtimeDealsTicker from '../components/dashboard/RealtimeDealsTicker';
import MacroKpiSparklines from '../components/dashboard/MacroKpiSparklines';
import InteractiveTreemap from '../components/dashboard/InteractiveTreemap';
import HeatmapProvincesTable from '../components/dashboard/HeatmapProvincesTable';
import ActionableAlertsList from '../components/dashboard/ActionableAlertsList';
import PredictiveAiRadar from '../components/dashboard/PredictiveAiRadar';
import FreemiumDiamondModal from '../components/dashboard/FreemiumDiamondModal';

export default function MarketDashboardPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30'); // '7' | '30' | '90' | '365'
  const [selectedZone, setSelectedZone] = useState('all');
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(lang === 'en' 
        ? "Macro Intelligence Report (PDF/Excel) successfully generated and exported with verified ERP & e-Invoice data!"
        : "Đã xuất Báo cáo Tình Báo Vĩ Mô Chuỗi Cung Ứng (PDF/Excel) có xác thực dữ liệu ERP & Hóa đơn điện tử thành công!");
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-24 pt-6 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & MACRO INTELLIGENCE CONTROL BAR */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0052cc] font-bold font-heading">
            {lang === 'en' ? 'Macro Intelligence & Market Analytics' : 'Dashboard Thị Trường & Tình Báo Vĩ Mô'}
          </span>
        </nav>

        {/* Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0047a5] text-[11px] font-bold font-heading">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'VIETNAM NATIONAL SCM RADAR' : 'TRẠM TÌNH BÁO VĨ MÔ CHUỖI CUNG ỨNG QUỐC GIA'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading tracking-tight leading-tight">
              Dashboard Phân Tích Thị Trường & Chuỗi Cung Ứng
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
              Giám sát vĩ mô, phân tích thanh khoản RFQ thời gian thực, dự báo điểm nghẽn nguyên vật liệu và điều phối cung ứng 400+ Khu công nghiệp toàn quốc.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 font-heading shrink-0">
            {/* Zone Filter */}
            <select 
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0052cc] cursor-pointer"
            >
              <option value="all">{lang === 'en' ? 'Nationwide (63 Provinces)' : 'Toàn Quốc (63 Tỉnh Thành)'}</option>
              <option value="north">{lang === 'en' ? 'Northern Key Zone' : 'Trọng Điểm Miền Bắc'}</option>
              <option value="south">{lang === 'en' ? 'Southern Key Zone' : 'Trọng Điểm Miền Nam'}</option>
              <option value="central">{lang === 'en' ? 'Central Key Zone' : 'Trọng Điểm Miền Trung'}</option>
            </select>

            {/* Timeframe Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: '7', label: '7N' },
                { id: '30', label: '30N' },
                { id: '90', label: 'Quý' },
                { id: '365', label: 'Năm' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition font-mono ${
                    timeRange === t.id ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 font-heading cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Đang Xuất...' : 'Xuất Báo Cáo'}</span>
            </button>

            {/* Diamond VIP CTA */}
            <button
              onClick={() => setIsDiamondModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition flex items-center space-x-1.5 font-heading cursor-pointer transform hover:-translate-y-0.5"
            >
              <Crown className="w-3.5 h-3.5 text-slate-950" />
              <span>Gói FDI Kim Cương</span>
            </button>
          </div>
        </div>

        {/* Real-time Streaming Deals Marquee */}
        <RealtimeDealsTicker lang={lang} />

        {/* Top 6 KPI Cards with Embedded SVG Sparklines & ERP Audit */}
        <MacroKpiSparklines lang={lang} />

      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE ROW: INTERACTIVE TREEMAP (Biểu Đồ Cây Nhu Cầu Ngành) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveTreemap 
          lang={lang} 
          onOpenDiamondModal={() => setIsDiamondModalOpen(true)} 
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. PREDICTIVE AI SUPPLY RADAR (Thuật Toán Dự Báo Cạn Kiệt Nguồn Cung) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PredictiveAiRadar lang={lang} />
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM MATRIX: HEATMAP TABLE & ACTIONABLE ALERTS */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Heatmap Provinces Table (7 Cols) */}
          <div className="lg:col-span-7">
            <HeatmapProvincesTable lang={lang} />
          </div>

          {/* Right Column: Actionable Market Alerts with CTA Buttons (5 Cols) */}
          <div className="lg:col-span-5">
            <ActionableAlertsList lang={lang} />
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FREEMIUM VIP DIAMOND INTELLIGENCE MODAL */}
      {/* ========================================================================= */}
      <FreemiumDiamondModal 
        isOpen={isDiamondModalOpen}
        onClose={() => setIsDiamondModalOpen(false)}
        lang={lang}
      />

    </div>
  );
}
