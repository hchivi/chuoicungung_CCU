import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  QrCode, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Crown, 
  Eye, 
  Download, 
  Plus, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  getAllCatalogues, 
  CATALOGUE_TYPES, 
  CATALOGUE_STATUSES,
  checkPrintGate,
  getAllCatalogueAuditLogs,
  getAllCatalogueParticipations
} from '../../data/cataloguesData';

export default function AdminCataloguesManagement() {
  const [catalogues, setCatalogues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCatalogue, setSelectedCatalogue] = useState(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [auditLogs, setAuditLogs] = useState([]);
  const [participations, setParticipations] = useState([]);

  useEffect(() => {
    setCatalogues(getAllCatalogues());
    setAuditLogs(getAllCatalogueAuditLogs());
    setParticipations(getAllCatalogueParticipations());
  }, []);

  const filteredCatalogues = catalogues.filter(cat => {
    const matchesSearch = !searchQuery || 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || cat.catalogueType === selectedType;
    return matchesSearch && matchesType;
  });

  const curEdition = selectedCatalogue 
    ? (selectedCatalogue.editions?.find(e => e.id === selectedCatalogue.currentEditionId) || selectedCatalogue.editions?.[0])
    : null;

  const printGateCheck = curEdition ? checkPrintGate(curEdition) : { canPrint: false, blockers: [] };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Summary Stats */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 font-heading">
              Quản Lý Catalogue & Ấn Phẩm Nhà Cung Ứng
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối ấn phẩm theo chuyên mục, duyệt danh sách doanh nghiệp, cổng in ấn (Print Gate) và đối soát phân phối B2B.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right pr-3 border-r border-slate-200 hidden sm:block">
            <div className="text-[10.5px] uppercase font-bold text-slate-400">Hồ sơ tiếp nhận mới</div>
            <div className="text-base font-black text-blue-600 font-mono">
              {participations.length} đăng ký
            </div>
          </div>
          <button
            onClick={() => alert('Mở form tạo mới Catalogue / Edition trong hệ thống')}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Ấn Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* 2. Main Admin View: List / Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Catalogue Listing Table (Section 44) */}
        <div className={`${selectedCatalogue ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm catalogue, chủ đề..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-blue-600 transition"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none"
            >
              <option value="ALL">Mọi loại ấn phẩm</option>
              {Object.values(CATALOGUE_TYPES).map(t => (
                <option key={t.id} value={t.id}>{t.shortName}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto divide-y divide-slate-100">
            {filteredCatalogues.map((cat) => {
              const ed = cat.editions?.find(e => e.id === cat.currentEditionId) || cat.editions?.[0];
              const approvedCount = (ed?.entries || []).filter(e => e.approvalStatus === 'APPROVED').length;
              const isSelected = selectedCatalogue?.id === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCatalogue(cat)}
                  className={`p-3.5 rounded-2xl transition cursor-pointer flex flex-col space-y-2 ${
                    isSelected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {ed?.editionCode || 'ED-2026'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.status === 'DISTRIBUTING' ? 'bg-sky-100 text-sky-800' :
                      cat.status === 'PRINTED' ? 'bg-teal-100 text-teal-800' :
                      cat.status === 'PUBLISHED_DIGITAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {CATALOGUE_STATUSES[cat.status]?.label || cat.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {cat.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Duyệt: <strong className="text-slate-900 font-sans">{approvedCount} NCC</strong></span>
                    <span>Đã in: <strong className="text-purple-700">{ed?.confirmedPrintQuantity?.toLocaleString() || 0}</strong></span>
                    <span>Đã giao: <strong className="text-emerald-700">{ed?.distributedQuantity?.toLocaleString() || 0}</strong></span>
                  </div>

                  {cat.owner && (
                    <div className="text-[10.5px] text-slate-400 truncate">
                      Phụ trách: <span className="text-slate-600">{cat.owner}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Detailed Administration Tabs (Section 45) */}
        {selectedCatalogue && (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            
            {/* Header of Detail */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedCatalogue.id}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {selectedCatalogue.categoryName}
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900 font-heading">
                  {selectedCatalogue.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedCatalogue(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Navigation Tabs (Section 45) */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs border-b border-slate-100">
              {[
                { id: 'OVERVIEW', label: 'Tổng quan' },
                { id: 'ENTRIES', label: `Hồ sơ (${curEdition?.entries?.length || 0})` },
                { id: 'PRINT_GATE', label: 'Cổng In Ấn (Print Gate)' },
                { id: 'DISTRIBUTION', label: 'Phân phối' },
                { id: 'METRICS', label: 'Báo cáo chỉ số' },
                { id: 'AUDIT', label: 'Audit Log' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT 1: OVERVIEW */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hành động tiếp theo (Section 48):</div>
                  <div className="text-slate-800 font-bold">{selectedCatalogue.nextAction || 'Đang rà soát định kỳ'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Hạn chót: {selectedCatalogue.nextActionAt || 'N/A'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-slate-500">Chủ trì xuất bản:</span>
                    <div className="font-bold text-slate-900">{selectedCatalogue.publisherName}</div>
                  </div>
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                    <span className="text-slate-500">Người phụ trách (Owner):</span>
                    <div className="font-bold text-slate-900">{selectedCatalogue.owner}</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
                  <span className="font-bold text-slate-900">Phạm vi phân phối: </span>
                  <span>{curEdition?.distributionScopeSummary || 'Chưa thiết lập'}</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ENTRIES APPROVAL (Section 46) */}
            {activeTab === 'ENTRIES' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Danh sách doanh nghiệp trong ấn bản {curEdition?.editionCode}:</span>
                  <span className="text-blue-600 font-bold">Chỉ hồ sơ APPROVED mới xuất hiện trên public</span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {(curEdition?.entries || []).map((entry, idx) => (
                    <div key={entry.id || idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>#{entry.position || idx + 1}</span>
                          <span>{entry.organizationName}</span>
                          {entry.sponsorLabel && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9.5px] font-black uppercase">
                              {entry.sponsorLabel}
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {entry.contentSnapshot?.title || 'Chưa có tiêu đề'}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          entry.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.approvalStatus}
                        </span>
                        <Link
                          to={entry.canonicalUrl || '#'}
                          className="p-1 hover:text-blue-600 text-slate-400"
                          title="Xem profile canonical"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: PRINT GATE (Section 12 & 47) */}
            {activeTab === 'PRINT_GATE' && (
              <div className="space-y-4 text-xs">
                <div className={`p-4 rounded-2xl border ${
                  printGateCheck.canPrint 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center space-x-2 font-black text-sm">
                    {printGateCheck.canPrint ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>ĐỦ ĐIỀU KIỆN KÝ LỆNH IN THÀNH PHẨM (PRINT GATE PASSED)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span>CHƯA ĐỦ ĐIỀU KIỆN CHUYỂN PRINT_CONFIRMED</span>
                      </>
                    )}
                  </div>

                  {!printGateCheck.canPrint && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="font-bold">Các yếu tố chặn (Blockers) cần giải quyết:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                        {printGateCheck.blockers.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block">Kế hoạch in:</span>
                    <strong className="text-sm font-mono text-slate-900">
                      {curEdition?.plannedPrintQuantity?.toLocaleString() || 0} cuốn
                    </strong>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="text-[11px] text-purple-700 block">Số lượng in xác nhận (Confirmed):</span>
                    <strong className="text-sm font-mono text-purple-900">
                      {curEdition?.confirmedPrintQuantity?.toLocaleString() || 0} cuốn
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: DISTRIBUTION BATCHES (Section 36 & 37) */}
            {activeTab === 'DISTRIBUTION' && (
              <div className="space-y-3 text-xs">
                <div className="text-slate-500 flex items-center justify-between">
                  <span>Kế hoạch & Bằng chứng bàn giao (Section 36, 37):</span>
                  <span className="font-mono text-slate-700 font-bold">
                    Tổng giao: {curEdition?.distributedQuantity?.toLocaleString() || 0} cuốn
                  </span>
                </div>

                <div className="space-y-2">
                  {(curEdition?.distributionBatches || []).map((batch, bIdx) => (
                    <div key={batch.id || bIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{batch.channelLabel}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          batch.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {batch.status}
                        </span>
                      </div>
                      <div className="text-slate-600">{batch.location}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span>Thực tế giao: <strong className="text-slate-900 font-sans">{batch.actualQuantity} cuốn</strong></span>
                        <span>Người nhận: {batch.receiverName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: METRICS SEPARATION (Section 40) */}
            {activeTab === 'METRICS' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-mono font-bold text-[11px]">
                  PRINTED ≠ DISTRIBUTED ≠ READ ≠ QR SCAN ≠ PROFILE ENGAGEMENT ≠ CONTACT REQUEST ≠ BUYER NEED ≠ DEAL
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Số bản đã in:</span>
                    <strong className="text-base font-black text-purple-700 font-mono">
                      {curEdition?.metrics?.printedConfirmed?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Số bản đã phát:</span>
                    <strong className="text-base font-black text-emerald-700 font-mono">
                      {curEdition?.metrics?.distributedConfirmed?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Lượt quét QR:</span>
                    <strong className="text-base font-black text-blue-700 font-mono">
                      {curEdition?.metrics?.qrScans?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Lượt xem Profile:</span>
                    <strong className="text-base font-black text-slate-800 font-mono">
                      {curEdition?.metrics?.profileVisits?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Yêu cầu kết nối:</span>
                    <strong className="text-base font-black text-amber-700 font-mono">
                      {curEdition?.metrics?.contactRequests?.toLocaleString() || 0}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10.5px]">Nhu cầu mua tạo mới:</span>
                    <strong className="text-base font-black text-teal-700 font-mono">
                      {curEdition?.metrics?.requirementsCreated?.toLocaleString() || 0}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: AUDIT LOG (Section 55 QA 17) */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 text-[11px]">Nhật ký thao tác và thẩm định ấn phẩm:</div>
                <div className="space-y-1.5 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="pt-2 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-800 font-mono text-[11px]">{log.action}</div>
                        <div className="text-[10px] text-slate-500">Thực hiện bởi: {log.actor}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
