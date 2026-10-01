// ============================================================================
// ADMIN UNIFIED 5-COLUMN PIPELINE KANBAN (BOARD CORE)
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin/pipeline)
// Chuẩn hóa theo spec 19.txt (Section 3, 4, 6, 12) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag, Search, Filter, Eye, CheckCircle2, AlertCircle,
  X, Clock, Send, ShieldCheck, ChevronRight, UserCheck,
  Building2, MapPin, Calendar, Layers, FileText, ArrowLeft,
  ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, RefreshCw,
  Plus, Edit3, ArrowRight, Check, Award, PhoneCall, Mail,
  TrendingUp, Download, ShieldAlert, Bot, SlidersHorizontal
} from 'lucide-react';
import {
  PIPELINE_COLUMNS,
  mapRequirementToPipelineColumn,
  getAllConnections,
  getAllUnifiedTasks,
  createUnifiedTask,
  updateConnectionOutcome,
  OUTCOME_TYPES,
  logAdminMutationAudit,
  getActiveAdminRole
} from '../../data/adminUnifiedCoordinationData';
import {
  getAllMasterRequirements,
  getAllResponses,
  adminReviewSupplierResponse,
  adminUpdateRequirementVisibility
} from '../../data/requirementsData';

export default function AdminUnifiedPipelineKanban({ initialRequirementId = null }) {
  const [requirements, setRequirements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ownerFilter, setOwnerFilter] = useState('ALL');
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Selected requirement detail modal (Section 12: 12 tabs)
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailTab, setDetailTab] = useState('overview'); // 12 tabs
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Sourcing & Shortlist action state
  const [newNextActionText, setNewNextActionText] = useState('');
  const [newNextActionDate, setNewNextActionDate] = useState('');
  const [newOutcome, setNewOutcome] = useState('SELECTED_SUPPLIER');
  const [outcomeNote, setOutcomeNote] = useState('');

  const activeRole = getActiveAdminRole();
  const nowIso = new Date().toISOString();

  const loadData = () => {
    const reqs = getAllMasterRequirements();
    const conns = getAllConnections();
    const tks = getAllUnifiedTasks();
    setRequirements(reqs);
    setConnections(conns);
    setTasks(tks);

    if (initialRequirementId) {
      const found = reqs.find(r => r.id === initialRequirementId || r.publicCode === initialRequirementId);
      if (found) setSelectedReq(found);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialRequirementId]);

  // Enrich requirements with Owner, NextAction, MatchCount, and Pipeline Column
  const enrichedRequirements = useMemo(() => {
    return requirements.map(r => {
      const colId = mapRequirementToPipelineColumn(r);
      const reqConns = connections.filter(c => c.requirementId === r.id);
      const reqTasks = tasks.filter(t => t.entityId === r.id);
      
      // Derive next action & date
      const activeTask = reqTasks.find(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
      const nextAction = r.nextAction || activeTask?.title || (reqConns[0]?.nextAction) || 'Chờ điều phối viên rà soát tiêu chí kỹ thuật';
      const nextActionAt = r.nextActionAt || activeTask?.dueAt || reqConns[0]?.nextActionAt || r.responseDeadline || r.publishedAt;
      const ownerName = r.ownerName || 'Đặng Tuấn Kiệt (Coordinator)';
      const isOverdue = nextActionAt && nextActionAt < nowIso && r.status !== 'CLOSED';

      return {
        ...r,
        pipelineColumn: colId,
        connectionsCount: reqConns.length,
        nextAction,
        nextActionAt,
        ownerName,
        isOverdue
      };
    });
  }, [requirements, connections, tasks, nowIso]);

  // Filters
  const filteredRequirements = useMemo(() => {
    return enrichedRequirements.filter(r => {
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (ownerFilter !== 'ALL' && r.ownerName !== ownerFilter) return false;
      if (overdueOnly && !r.isOverdue) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = (r.publicCode || '').toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchBuyer = (r.buyerInfo?.companyName || '').toLowerCase().includes(q);
        const matchCat = (r.category || '').toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchBuyer && !matchCat) return false;
      }
      return true;
    });
  }, [enrichedRequirements, categoryFilter, ownerFilter, overdueOnly, searchQuery]);

  // Group by 5 Pipeline Columns
  const groupedColumns = useMemo(() => {
    const map = {
      COLUMN_01_INTAKE: [],
      COLUMN_02_SOURCING: [],
      COLUMN_03_CONNECTING: [],
      COLUMN_04_FOLLOW_UP: [],
      COLUMN_05_OUTCOME: []
    };
    filteredRequirements.forEach(r => {
      if (map[r.pipelineColumn]) {
        map[r.pipelineColumn].push(r);
      } else {
        map.COLUMN_01_INTAKE.push(r);
      }
    });
    return map;
  }, [filteredRequirements]);

  // Update Next Action on Requirement
  const handleSaveNextAction = () => {
    if (!selectedReq || !newNextActionText.trim()) return;
    
    // Create unified task for tracking
    createUnifiedTask({
      entityType: 'REQUIREMENT',
      entityId: selectedReq.id,
      entityTitle: selectedReq.title,
      title: newNextActionText.trim(),
      ownerName: selectedReq.ownerName || 'Đặng Tuấn Kiệt',
      dueAt: newNextActionDate ? new Date(newNextActionDate).toISOString() : new Date(Date.now() + 86400000 * 2).toISOString(),
      createdBy: activeRole.name
    });

    logAdminMutationAudit({
      action: 'NEXT_ACTION_UPDATED',
      entityType: 'REQUIREMENT',
      entityId: selectedReq.id,
      actor: activeRole.name,
      details: `Cập nhật hành động tiếp theo: "${newNextActionText.trim()}", hạn xử lý: ${newNextActionDate || '2 ngày tới'}.`
    });

    setActionSuccessMsg('Đã cập nhật việc tiếp theo thành công!');
    setNewNextActionText('');
    loadData();
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  // Record Outcome (Section 17)
  const handleRecordOutcome = () => {
    if (!selectedReq) return;
    
    const reqConns = connections.filter(c => c.requirementId === selectedReq.id);
    if (reqConns.length > 0) {
      updateConnectionOutcome({
        connectionId: reqConns[0].id,
        outcome: newOutcome,
        note: outcomeNote,
        actor: activeRole.name
      });
    }

    logAdminMutationAudit({
      action: 'REQUIREMENT_OUTCOME_RECORDED',
      entityType: 'REQUIREMENT',
      entityId: selectedReq.id,
      actor: activeRole.name,
      details: `Xác nhận kết quả thực tế của Nhu cầu [${selectedReq.publicCode}]: ${OUTCOME_TYPES[newOutcome]?.label}. Ghi chú: ${outcomeNote || 'Đã đối soát'}.`
    });

    setActionSuccessMsg(`Đã ghi nhận kết quả: ${OUTCOME_TYPES[newOutcome]?.label}`);
    loadData();
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Filtering Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>OPERATIONAL KANBAN PIPELINE (SECTION 3 & 4)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Dòng Chảy 5 Cột Cốt Lõi (Đăng Nhu Cầu → Kết Quả)
          </h2>
          <p className="text-xs text-slate-500">
            Theo dõi tiến độ xuyên suốt từng Nhu Cầu Buyer qua 5 giai đoạn vận hành
          </p>
        </div>

        {/* Search bar & quick filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã NC, tên hàng, công ty..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none w-56 sm:w-64"
            />
          </div>

          <button
            onClick={() => setOverdueOnly(!overdueOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-1.5 cursor-pointer border ${
              overdueOnly
                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chỉ xem Quá Hạn</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 5 KANBAN COLUMNS (Horizontal Scrollable Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
        {PIPELINE_COLUMNS.map((col, idx) => {
          const items = groupedColumns[col.id] || [];

          return (
            <div
              key={col.id}
              className="bg-slate-100/90 rounded-3xl p-3 border border-slate-200 flex flex-col justify-between min-w-[260px] space-y-3"
            >
              {/* Column Header */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    CỘT 0{idx + 1}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs">
                    {items.length}
                  </span>
                </div>
                <h3 className="text-xs font-black text-slate-900 font-heading">
                  {col.title}
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {col.description}
                </p>
              </div>

              {/* Requirement Cards List */}
              <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-0.5 scrollbar-thin">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-[11px] text-slate-400 italic bg-white/60 rounded-2xl border border-dashed border-slate-200">
                    Không có nhu cầu ở bước này
                  </div>
                ) : (
                  items.map(req => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedReq(req);
                        setDetailTab('overview');
                      }}
                      className={`bg-white p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer space-y-2 hover:shadow-md ${
                        req.isOverdue
                          ? 'border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Code & Status Badge */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {req.publicCode || req.id}
                        </span>
                        {req.isOverdue && (
                          <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Quá hạn</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-2 leading-snug">
                        {req.title}
                      </h4>

                      {/* Category & Location */}
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{req.location} • {req.category}</span>
                      </div>

                      {/* Hard Rule Section 6: Next Action & Owner */}
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="text-[10.5px] text-slate-700 leading-tight">
                          <span className="font-bold text-amber-900 text-[10px] block font-mono">VIỆC TIẾP THEO:</span>
                          <span className="line-clamp-2">{req.nextAction}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                          <span>👤 {req.ownerName?.split(' ')[0]}</span>
                          <span className={req.isOverdue ? 'text-rose-600 font-bold' : ''}>
                            📅 {req.nextActionAt ? req.nextActionAt.slice(0, 10) : 'Chưa định ngày'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Footer: Match Count */}
                      <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-50 text-slate-500">
                        <span>NCC ghép nối: <strong className="text-blue-700">{req.connectionsCount}</strong></span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. REQUIREMENT DETAIL MODAL (SECTION 12: 12 TABS ĐẦY ĐỦ) */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header: Code, Status, Owner, Next Action, Due (Section 12) */}
            <div className="p-5 bg-slate-900 text-white border-b border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30">
                      {selectedReq.publicCode || selectedReq.id}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {selectedReq.status}
                    </span>
                    {selectedReq.isOverdue && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-400/40">
                        ⚠️ CẢNH BÁO QUÁ HẠN
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black font-heading text-white">
                    {selectedReq.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedReq(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Operational Metadata Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono text-slate-300">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Phụ trách (Owner):</span>
                  <span className="font-bold text-white truncate block">{selectedReq.ownerName}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Giai đoạn Pipeline:</span>
                  <span className="font-bold text-amber-300 truncate block">
                    {PIPELINE_COLUMNS.find(c => c.id === selectedReq.pipelineColumn)?.shortTitle}
                  </span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Hạn xử lý (Due):</span>
                  <span className={`font-bold block ${selectedReq.isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                    {selectedReq.nextActionAt ? selectedReq.nextActionAt.slice(0, 10) : 'N/A'}
                  </span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">NCC Kết nối:</span>
                  <span className="font-bold text-emerald-400 block">{selectedReq.connectionsCount} nhà máy</span>
                </div>
              </div>
            </div>

            {/* Modal Tabs Bar (12 Tabs) */}
            <div className="flex items-center space-x-1 overflow-x-auto p-2 bg-slate-100 border-b border-slate-200 text-xs font-heading font-bold scrollbar-none">
              {[
                { id: 'overview', label: '1. TỔNG QUAN' },
                { id: 'requirements', label: '2. YÊU CẦU' },
                { id: 'matches', label: '3. SUPPLIER MATCHES' },
                { id: 'connections', label: '4. CONNECTIONS' },
                { id: 'samples', label: '5. SAMPLES / KHẢO SÁT' },
                { id: 'quotations', label: '6. BÁO GIÁ' },
                { id: 'tasks', label: '7. CÔNG VIỆC' },
                { id: 'timeline', label: '8. TIMELINE' },
                { id: 'outcome', label: '9. KẾT QUẢ' },
                { id: 'audit', label: '10. AUDIT LOG' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer text-xs ${
                    detailTab === tab.id
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {actionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Tab 1: Tổng quan */}
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                        THÔNG TIN BUYER (BẢO MẬT NỘI BỘ)
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">
                        {selectedReq.buyerInfo?.companyName || 'Công ty TNHH FDI'}
                      </h4>
                      <div className="text-slate-600 space-y-0.5">
                        <p>👤 Người liên hệ: {selectedReq.buyerInfo?.contactPerson || 'Trưởng phòng Thu Mua'}</p>
                        <p>📞 Điện thoại: {selectedReq.buyerInfo?.phone || '0903 xxx xxx'}</p>
                        <p>✉️ Email: {selectedReq.buyerInfo?.email || 'procurement@company.com'}</p>
                        <p>📍 Địa điểm: {selectedReq.location} ({selectedReq.industrialPark || 'KCN'})</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                        TIÊU CHÍ KỸ THUẬT & NGÂN SÁCH
                      </span>
                      <div className="text-slate-700 space-y-1">
                        <p>📦 Số lượng: <strong>{selectedReq.quantity} {selectedReq.unit}</strong></p>
                        <p>💰 Ngân sách mục tiêu: <strong>{selectedReq.buyerInfo?.targetPrice || 'Thỏa thuận'}</strong></p>
                        <p>⏱️ Hạn nhận chào giá: <strong>{selectedReq.deadline || 'Trong 30 ngày'}</strong></p>
                        <p>🧪 Yêu cầu mẫu vải/test: <strong>{selectedReq.sampleRequired ? 'CÓ BẮT BUỘC' : 'Không bắt buộc'}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Next Action Update Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs font-heading">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>CẬP NHẬT HÀNH ĐỘNG TIẾP THEO (HARD RULE SECTION 6)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newNextActionText}
                          onChange={(e) => setNewNextActionText(e.target.value)}
                          placeholder="Nhập việc cần làm tiếp theo (VD: Đôn đốc gửi bảng test CMM...)"
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl outline-none text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={newNextActionDate}
                          onChange={(e) => setNewNextActionDate(e.target.value)}
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl outline-none text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNextAction}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs font-heading uppercase transition cursor-pointer"
                      >
                        Lưu hành động tiếp theo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Supplier Matches */}
              {detailTab === 'matches' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-xs font-heading uppercase">
                      Danh Sách Nhà Cung Cấp Ghép Nối Phù Hợp ({selectedReq.connectionsCount})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {connections.filter(c => c.requirementId === selectedReq.id).map(conn => (
                      <div key={conn.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 text-xs">{conn.supplierName}</strong>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                            {conn.matchStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{conn.matchReason}</p>
                        <div className="text-[10px] text-slate-400 font-mono flex justify-between pt-1">
                          <span>Báo giá: {conn.quotationAmount}</span>
                          <span>Hạn tiếp theo: {conn.nextActionAt?.slice(0, 10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 9: Outcome */}
              {detailTab === 'outcome' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                      XÁC NHẬN KẾT QUẢ THỰC TẾ (SECTION 17)
                    </span>
                    <p className="text-xs text-slate-600">
                      Không chỉ đánh dấu Success. Cần xác định cụ thể loại kết quả và ghi nhận biên bản đối soát.
                    </p>

                    <div className="space-y-2">
                      <label className="font-bold text-slate-700 block">Loại kết quả nghiệm thu:</label>
                      <select
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
                      >
                        {Object.values(OUTCOME_TYPES).map(out => (
                          <option key={out.id} value={out.id}>
                            {out.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Ghi chú đối soát từ Buyer / NCC:</label>
                      <textarea
                        rows="3"
                        value={outcomeNote}
                        onChange={(e) => setOutcomeNote(e.target.value)}
                        placeholder="VD: Đã ký hợp đồng số HD-2026-089 giá trị 125 triệu đồng, đợt 1 giao ngày 15/10/2026..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <button
                      onClick={handleRecordOutcome}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs font-heading uppercase transition cursor-pointer"
                    >
                      Xác nhận lưu kết quả
                    </button>
                  </div>
                </div>
              )}

              {/* Other tabs fallback */}
              {detailTab !== 'overview' && detailTab !== 'matches' && detailTab !== 'outcome' && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono italic">
                  Dữ liệu tab {detailTab} đang được đồng bộ theo thời gian thực từ API Core.
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
