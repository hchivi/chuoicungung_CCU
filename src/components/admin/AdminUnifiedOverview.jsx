// ============================================================================
// ADMIN UNIFIED OVERVIEW & COMMAND CENTER
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin)
// Chuẩn hóa theo spec 19.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Users, Building2, AlertTriangle,
  Clock, CheckCircle2, ArrowRight, Zap, Sparkles, Filter,
  ArrowUpRight, Send, PhoneCall, AlertCircle, FileText, ChevronRight,
  TrendingUp, Award, Layers, Bot, MessageSquare, Check, X
} from 'lucide-react';
import {
  getUnifiedDashboardOperationalMetrics,
  PIPELINE_COLUMNS,
  getActiveAdminRole
} from '../../data/adminUnifiedCoordinationData';
import { getAllMasterRequirements } from '../../data/requirementsData';

export default function AdminUnifiedOverview({ onNavigateMenu, onSelectRequirement }) {
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'bottleneck' | 'ai_assistant'
  const activeRole = getActiveAdminRole();

  const loadMetrics = () => {
    const data = getUnifiedDashboardOperationalMetrics();
    setMetrics(data);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 font-mono">
        Đang tải số liệu vận hành bàn điều phối...
      </div>
    );
  }

  const { operationalQuestions, bottleneck, overdueItems } = metrics;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Operational Notice */}
      <div className="bg-gradient-to-r from-[#072847] via-[#0b3f6d] to-[#124d80] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono font-bold border border-amber-400/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>BÀN ĐIỀU PHỐI VẬN HÀNH TRUNG TÂM (MODULE 19 P0)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
            Trung Tâm Chỉ Huy & Điều Phối Chuỗi Cung Ứng Quốc Gia
          </h2>
          <p className="text-xs text-slate-200 max-w-3xl leading-relaxed">
            Hợp nhất toàn bộ chu trình <strong>Đăng Nhu Cầu → Tìm Nguồn → Kết Nối → Theo Dõi → Kết Quả</strong>. 100% số liệu vận hành tính từ dữ liệu thực tế, phục vụ trực tiếp công tác điều phối hàng ngày.
          </p>
        </div>
      </div>

      {/* 2. 5 OPERATIONAL QUESTIONS (Exact Spec Section 2 & 41) */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10.5px] font-mono uppercase font-bold text-blue-700 tracking-wider">
              NGUYÊN TẮC VẬN HÀNH THỰC CHẤT (SECTION 2)
            </span>
            <h3 className="text-base font-black text-slate-900 font-heading">
              5 Câu Hỏi Vận Hành Hàng Ngày
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Cập nhật thời gian thực
          </span>
        </div>

        {/* 5 KPI Cards for the 5 Questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Q1: Có nhu cầu mới nào? */}
          <div 
            onClick={() => onNavigateMenu && onNavigateMenu('pipeline')}
            className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase font-mono block">
                1. Nhu cầu mới tiếp nhận
              </span>
              <div className="text-2xl font-black text-blue-950 font-mono">
                {operationalQuestions.q1_newRequirementsCount}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Nhu cầu đang ở bước tiếp nhận, cần xác thực hoặc làm rõ thêm thông tin.
              </p>
            </div>
            <div className="text-[10.5px] font-bold text-blue-700 flex items-center space-x-1 pt-2 font-heading">
              <span>Xem cột Đăng Nhu Cầu</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Q2: Nhu cầu nào chưa tìm được nguồn? */}
          <div 
            onClick={() => onNavigateMenu && onNavigateMenu('pipeline')}
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 hover:border-amber-400 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase font-mono block">
                2. Chưa tìm được nguồn
              </span>
              <div className="text-2xl font-black text-amber-950 font-mono">
                {operationalQuestions.q2_unsuppliedRequirementsCount}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Đã duyệt nhưng chưa có NCC phản hồi hoặc chưa ghép được nhà máy phù hợp.
              </p>
            </div>
            <div className="text-[10.5px] font-bold text-amber-800 flex items-center space-x-1 pt-2 font-heading">
              <span>Đẩy mạnh Sourcing</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Q3: Kết nối nào đang chờ? */}
          <div 
            onClick={() => onNavigateMenu && onNavigateMenu('connections')}
            className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 hover:border-purple-400 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-purple-800 uppercase font-mono block">
                3. Kết nối đang chờ
              </span>
              <div className="text-2xl font-black text-purple-950 font-mono">
                {operationalQuestions.q3_pendingConnectionsCount}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                NCC đã phản hồi, chờ điều phối viên sắp xếp phiên trao đổi hoặc gửi hồ sơ.
              </p>
            </div>
            <div className="text-[10.5px] font-bold text-purple-800 flex items-center space-x-1 pt-2 font-heading">
              <span>Mở Bảng Kết Nối</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Q4: Việc nào quá hạn? */}
          <div 
            onClick={() => onNavigateMenu && onNavigateMenu('tasks')}
            className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 flex flex-col justify-between ${
              operationalQuestions.q4_overdueWorkCount > 0
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-800 uppercase font-mono block">
                4. Công việc quá hạn
              </span>
              <div className="text-2xl font-black text-rose-950 font-mono flex items-center space-x-2">
                <span>{operationalQuestions.q4_overdueWorkCount}</span>
                {operationalQuestions.q4_overdueWorkCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                    Cảnh báo!
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Next action hoặc deadline đã quá ngày hẹn nhưng chưa có phản hồi.
              </p>
            </div>
            <div className="text-[10.5px] font-bold text-rose-800 flex items-center space-x-1 pt-2 font-heading">
              <span>Xử lý Overdue Center</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Q5: Kết quả nào chưa được xác nhận? */}
          <div 
            onClick={() => onNavigateMenu && onNavigateMenu('connections')}
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition cursor-pointer space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono block">
                5. Kết quả chưa xác nhận
              </span>
              <div className="text-2xl font-black text-emerald-950 font-mono">
                {operationalQuestions.q5_unconfirmedOutcomesCount}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Đang theo dõi gửi mẫu/báo giá, cần điều phối viên đối soát với Buyer.
              </p>
            </div>
            <div className="text-[10.5px] font-bold text-emerald-800 flex items-center space-x-1 pt-2 font-heading">
              <span>Xác nhận kết quả</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. BOTTLENECK ANALYSIS & CONVERSION FUNNEL (Section 18 & 35) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Bottleneck View (Col 7) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10.5px] font-mono uppercase font-bold text-amber-700 tracking-wider">
                PHÂN TÍCH ĐIỂM NGHẼN (SECTION 18)
              </span>
              <h3 className="text-base font-black text-slate-900 font-heading">
                Dòng Chảy 5 Cột & Điểm Nghẽn Vận Hành
              </h3>
            </div>
            <span className="text-[10.5px] font-mono px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold">
              Nghẽn lớn nhất: {PIPELINE_COLUMNS.find(c => c.id === bottleneck.primaryBottleneckColumn)?.shortTitle} ({bottleneck.primaryBottleneckCount})
            </span>
          </div>

          <div className="space-y-3">
            {PIPELINE_COLUMNS.map((col, idx) => {
              const count = bottleneck.columnCounts[col.id] || 0;
              const total = bottleneck.totalActiveRequirements || 1;
              const pct = Math.round((count / total) * 100);
              const isBottleneck = col.id === bottleneck.primaryBottleneckColumn && count > 0;

              return (
                <div key={col.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[10px]">
                        0{idx + 1}
                      </span>
                      <span>{col.title}</span>
                      {isBottleneck && (
                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                          Điểm nghẽn
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-600 font-bold">
                      {count} nhu cầu ({pct}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBottleneck 
                          ? 'bg-rose-500' 
                          : col.id === 'COLUMN_05_OUTCOME' 
                          ? 'bg-emerald-500' 
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-[11px]">
              Tổng số nhu cầu đang xử lý trong toàn hệ thống: <strong>{bottleneck.totalActiveRequirements}</strong>
            </span>
            <button
              onClick={() => onNavigateMenu && onNavigateMenu('pipeline')}
              className="text-blue-700 hover:underline font-bold text-xs font-heading flex items-center space-x-1 cursor-pointer"
            >
              <span>Xem chi tiết Pipeline Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: AI Assistant & Quality Alerts (Col 5 - Section 37 & 31) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* SUPPI & CHAINY Assistant Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-3xl border border-indigo-900/60 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-800/40 pb-2.5">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  TRỢ LÝ ĐIỀU PHỐI AI (SUPPI & CHAINY)
                </span>
              </div>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                AI OUTPUT = DRAFT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              SUPPI phân tích hồ sơ kỹ thuật & gợi ý tiêu chí tìm nguồn. CHAINY theo dõi hạn chót và soạn thảo phương án liên hệ tiếp theo.
            </p>

            {/* Simulated AI Suggestions from live data */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <span>⚡ Gợi ý từ SUPPI (Sourcing):</span>
                  <span className="text-[10px] font-mono text-slate-400">NC-2026-00125</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Nhu cầu may 500 bộ đồng phục KCN Amata yêu cầu vải Kaki 65/35. Hệ thống đã tìm thấy 2 xưởng dệt may đạt chứng nhận OEKO-TEX tại Đồng Nai.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                  <span>⏱️ Nhắc việc từ CHAINY (Follow-up):</span>
                  <span className="text-[10px] font-mono text-rose-400">Hôm nay 17:00</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Cơ Khí Long Thành hẹn gửi dự toán chi tiết phay CNC nhôm cho nhà máy FDI. Cần nhắc Coordinator liên hệ xác nhận.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              * Mọi đề xuất AI chỉ là bản nháp hỗ trợ. Phê duyệt cuối cùng luôn thuộc quyền của Điều phối viên con người.
            </div>
          </div>

          {/* Quick Shortcuts to 6 Work Boards */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              LỐI TẮT 6 BẢNG CÔNG VIỆC CHÍNH (SECTION 7)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('demands')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B1. Nhu Cầu B2B</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('enterprises')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B2. Hồ Sơ & Thiếu</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('connections')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B3. Kết Nối NCC</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('chuong-trinh')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B4. Chương Trình</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('services')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B5. Dịch Vụ & FP</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button 
                onClick={() => onNavigateMenu && onNavigateMenu('tai-chinh')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-left font-bold transition flex items-center justify-between border border-slate-200"
              >
                <span>B6. Thu Chi & HĐ</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
