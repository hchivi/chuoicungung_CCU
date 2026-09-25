import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Info, ShieldCheck, 
  Building2, Factory, ShoppingBag, DollarSign, Layers, CheckCircle2 
} from 'lucide-react';

/**
 * Micro SVG Sparkline Chart component
 */
function Sparkline({ data = [30, 40, 35, 50, 49, 60, 70, 91], color = '#10b981', height = 36, width = 120 }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / range) * (height - padding * 2) - padding;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylineStr = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');
  const areaPoints = `${padding},${height} ${polylineStr} ${width - padding},${height}`;

  const gradientId = `spark-grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area Fill */}
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      {/* Stroke Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylineStr}
      />
      {/* Last Value Pulsing Dot */}
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="3" fill={color} className="animate-pulse" />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="6" fill={color} opacity="0.25" className="animate-ping" />
    </svg>
  );
}

export default function MacroKpiSparklines({ lang = 'vi' }) {
  // Live ticker counter simulation
  const [gmvVal, setGmvVal] = useState(8756);
  const [dealCount, setDealCount] = useState(2847);

  useEffect(() => {
    const interval = setInterval(() => {
      // Occasional micro-increment
      setGmvVal(prev => prev + (Math.random() > 0.6 ? 1 : 0));
      setDealCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    {
      id: 'gmv',
      title: lang === 'en' ? 'Total GMV Matched' : 'Tổng Giá Trị GD (GMV)',
      value: `${(gmvVal / 1000).toFixed(3)}B VNĐ`,
      change: '+1.256B (16.7%)',
      isPositive: true,
      sparkColor: '#0052cc',
      sparkData: [6800, 7100, 7350, 7800, 8100, 8420, 8600, 8756],
      icon: DollarSign,
      note: 'Dữ liệu đối soát từ ERP & e-Invoice'
    },
    {
      id: 'demands',
      title: lang === 'en' ? 'Active Demands (RFQs)' : 'Nhu Cầu Đang Mở (RFQ)',
      value: '1.256',
      change: '+68 (5.72%)',
      isPositive: true,
      sparkColor: '#10b981',
      sparkData: [1100, 1140, 1180, 1195, 1210, 1235, 1248, 1256],
      icon: ShoppingBag,
      note: 'Xác thực định danh nhà máy 100%'
    },
    {
      id: 'deals',
      title: lang === 'en' ? 'Closed B2B Contracts' : 'Giao Dịch Thành Công',
      value: dealCount.toLocaleString(),
      change: '+342 (13.68%)',
      isPositive: true,
      sparkColor: '#059669',
      sparkData: [2300, 2410, 2520, 2600, 2690, 2750, 2810, 2847],
      icon: CheckCircle2,
      note: 'Hợp đồng điện tử ký số hoàn tất'
    },
    {
      id: 'kcn',
      title: lang === 'en' ? 'Industrial Parks' : 'Khu Công Nghiệp',
      value: '416',
      change: '+12 (2.97%)',
      isPositive: true,
      sparkColor: '#0284c7',
      sparkData: [390, 395, 400, 404, 408, 410, 414, 416],
      icon: Building2,
      note: 'Bao phủ 63 tỉnh thành Việt Nam'
    },
    {
      id: 'factories',
      title: lang === 'en' ? 'Verified Factories' : 'Nhà Máy & Xưởng',
      value: '10.256',
      change: '+256 (2.56%)',
      isPositive: true,
      sparkColor: '#7c3aed',
      sparkData: [9600, 9750, 9890, 9980, 10050, 10120, 10190, 10256],
      icon: Factory,
      note: 'Xác minh tọa độ GIS & Giấy phép SX'
    },
    {
      id: 'enterprises',
      title: lang === 'en' ? 'Industrial Enterprises' : 'Doanh Nghiệp KCN',
      value: '128.540',
      change: '+1.245 (0.98%)',
      isPositive: true,
      sparkColor: '#ea580c',
      sparkData: [124000, 125200, 126100, 126800, 127400, 127900, 128200, 128540],
      icon: Layers,
      note: 'Cơ sở dữ liệu mã số thuế & liên kết KCN'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Top Audit Tagline */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 bg-blue-50/70 border border-blue-200/70 rounded-xl px-3.5 py-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
          <span className="font-bold text-slate-800 font-heading">
            {lang === 'en' ? 'MACRO INTELLIGENCE SYSTEM' : 'HỆ THỐNG TÌNH BÁO VĨ MÔ CHUỖI CUNG ỨNG'}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-[11px] text-slate-600">
            {lang === 'en' 
              ? 'Real-time telemetry verified via ERP bridges, Electronic Invoicing (e-Invoice) and 400+ Industrial Park nodes.' 
              : 'Dữ liệu đối soát tự động từ cầu nối ERP, Hóa đơn điện tử (e-Invoice) và 400+ cổng KCN toàn quốc.'}
          </span>
        </div>
        <div className="flex items-center space-x-1 font-mono text-[11px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYNC 7-DAY SPARKLINE</span>
        </div>
      </div>

      {/* 6 Grid KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id}
              className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 group relative flex flex-col justify-between"
            >
              {/* Header & Title */}
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-heading truncate" title={kpi.title}>
                    {kpi.title}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100/80 group-hover:bg-blue-50 group-hover:text-[#0052cc] transition">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Big Number */}
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight my-0.5">
                  {kpi.value}
                </div>

                {/* % Change */}
                <div className="flex items-center text-[10px] font-bold text-emerald-600 font-mono mb-2">
                  <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" />
                  <span>▲ {kpi.change}</span>
                </div>
              </div>

              {/* Sparkline mini chart (7 days) */}
              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between">
                <Sparkline data={kpi.sparkData} color={kpi.sparkColor} width={100} height={28} />
                <div className="relative group/tip cursor-help">
                  <Info className="w-3 h-3 text-slate-300 hover:text-slate-500 transition" />
                  <div className="absolute bottom-full right-0 mb-1 hidden group-hover/tip:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl z-30 font-sans leading-tight">
                    {kpi.note}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
