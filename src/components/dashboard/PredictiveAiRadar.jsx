import React, { useState } from 'react';
import { 
  Sparkles, Brain, AlertTriangle, TrendingUp, ShieldAlert, 
  Clock, ArrowRight, CheckCircle2, ChevronRight, BarChart3, Database
} from 'lucide-react';

export default function PredictiveAiRadar({ lang = 'vi' }) {
  const [activeTab, setActiveTab] = useState('shortage'); // 'shortage' | 'price' | 'inventory'

  const aiInsights = [
    {
      id: 1,
      title: 'Dự Báo Cạn Kiệt Nguồn Cung Bao Bì Màng Co & Túi Canvas',
      category: 'Bao Bì & Đóng Gói (Pha 6)',
      riskLevel: 'Nguy Cơ Cao (85%)',
      riskColor: 'bg-rose-100 text-rose-800 border-rose-200',
      timeframe: '25 - 35 ngày tới',
      recommendation: 'Khuyến nghị tăng mức tồn kho an toàn (Safety Stock) thêm 15 ngày hoặc chốt sớm hợp đồng cung ứng 3 tháng.',
      affectedZones: 'KCN Bắc Ninh, Hà Nội, Hưng Yên'
    },
    {
      id: 2,
      title: 'Cảnh Báo Biến Động Giá Hạt Nhựa Kỹ Thuật PP/ABS (+7.5%)',
      category: 'Nhựa & Cao Su (Pha 4)',
      riskLevel: 'Cảnh Báo Vàng (68%)',
      riskColor: 'bg-amber-100 text-amber-800 border-amber-200',
      timeframe: '45 ngày tới',
      recommendation: 'Tận dụng hợp đồng kỳ hạn cố định giá trên sàn CCU trước chu kỳ điều chỉnh giá hạt nhựa thế giới.',
      affectedZones: 'KCN Bình Dương, Đồng Nai, Long An'
    },
    {
      id: 3,
      title: 'Độ Trễ Cung Ứng Linh Kiện Thụ Động SMD Cho Dây Chuyền SMT',
      category: 'Điện Tử & Bán Dẫn (Pha 2)',
      riskLevel: 'Cảnh Báo Đỏ (91%)',
      riskColor: 'bg-rose-100 text-rose-800 border-rose-200',
      timeframe: '10 - 20 ngày tới',
      recommendation: 'Kích hoạt 3 nhà cung ứng thay thế đã qua xác thực KYC tại miền Nam để bù đắp thiếu hụt.',
      affectedZones: 'KCN Quế Võ, VSIP Hải Phòng'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-indigo-900/60 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800/60">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md">
              <Brain className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider font-mono text-purple-300">
              AI PREDICTIVE SUPPLY RADAR (THUẬT TOÁN DỰ ĐOÁN NGUỒN CUNG)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-heading text-white">
            {lang === 'en' ? 'Predictive AI: Supply Shortage & Price Volatility Advisory' : 'Dự Báo Cạn Kiệt Nguồn Cung & Đề Xuất Tồn Kho An Toàn'}
          </h3>
        </div>

        <div className="flex items-center space-x-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AI ACCURACY: 94.2%</span>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {aiInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/50 transition-all duration-300 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              {/* Category & Risk */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-indigo-300 font-mono font-semibold">
                  {insight.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${insight.riskColor}`}>
                  {insight.riskLevel}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-extrabold text-xs sm:text-sm text-white font-heading leading-snug">
                {insight.title}
              </h4>

              {/* Affected Zones */}
              <div className="text-[10px] text-slate-400 font-mono">
                📍 Điểm nóng: {insight.affectedZones}
              </div>

              {/* Recommendation */}
              <p className="text-[11px] text-indigo-100/90 leading-relaxed bg-indigo-900/40 p-2.5 rounded-xl border border-indigo-700/40">
                💡 <strong>Khuyến nghị AI:</strong> {insight.recommendation}
              </p>
            </div>

            {/* Timeframe */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Dự kiến biến động: {insight.timeframe}</span>
              <span className="text-sky-400 font-bold flex items-center">
                Chi tiết <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
