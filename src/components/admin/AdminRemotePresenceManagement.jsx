import React, { useState } from 'react';
import {
  Radio, CheckCircle2, Clock, AlertTriangle, Search, Filter,
  Eye, FileText, Check, X, ShieldAlert, Package, MessageSquare,
  QrCode, UserCheck, ChevronRight, Sparkles, Send, RefreshCw,
  Calendar, Building2, MapPin, ExternalLink, HelpCircle
} from 'lucide-react';
import {
  REMOTE_PRESENCE_STATUSES,
  SAMPLE_RECEIVED_STATUSES,
  INTERACTION_EVENT_TYPES,
  getAllRemoteRequests,
  checkProgramReadiness,
  approveIntroductionScript,
  recordInteractionEvent,
  recordBuyerInquiry,
  clientAcceptanceHandover
} from '../../data/remotePresenceData.js';

export default function AdminRemotePresenceManagement() {
  const [requests, setRequests] = useState(getAllRemoteRequests());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(requests[0] || null);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, SCOPE_READINESS, SCRIPT, SAMPLES, INTERACTIONS, INQUIRIES, AUDIT

  // Script Approval Form state
  const [scriptDraft, setScriptDraft] = useState('');
  const [scriptApprover, setScriptApprover] = useState('Lê Thu Trang (Điều phối viên)');
  const [scriptError, setScriptError] = useState('');

  // Inquiry Form state
  const [inquiryType, setInquiryType] = useState('QUOTE_REQUEST');
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquiryBuyerCompany, setInquiryBuyerCompany] = useState('');
  const [inquiryBuyerConsent, setInquiryBuyerConsent] = useState(true);

  const refreshData = () => {
    const list = getAllRemoteRequests();
    setRequests(list);
    if (selectedRequest) {
      const updated = list.find(r => r.id === selectedRequest.id);
      setSelectedRequest(updated || list[0] || null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      req.requestPublicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.programTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveScript = (e) => {
    e.preventDefault();
    setScriptError('');
    if (!scriptDraft.trim()) {
      setScriptError('Vui lòng nhập nội dung kịch bản giới thiệu.');
      return;
    }
    try {
      approveIntroductionScript(selectedRequest.id, scriptApprover, scriptDraft, true);
      setScriptDraft('');
      refreshData();
    } catch (err) {
      setScriptError(err.message || 'Lỗi duyệt kịch bản.');
    }
  };

  const handleRecordQuickEvent = (eventType) => {
    try {
      recordInteractionEvent(selectedRequest.id, eventType, { consent: true });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddInquiry = (e) => {
    e.preventDefault();
    if (!inquiryQuestion.trim() || !inquiryBuyerCompany.trim()) return;

    recordBuyerInquiry(selectedRequest.id, {
      inquiryType,
      question: inquiryQuestion,
      buyerCompany: inquiryBuyerCompany,
      buyerConsent: inquiryBuyerConsent
    });

    setInquiryQuestion('');
    setInquiryBuyerCompany('');
    refreshData();
  };

  const handleHandoverDecision = (decision) => {
    const note = prompt(`Nhập ghi chú nghiệm thu cho [${decision}]:`, 'Đã kiểm tra đầy đủ bằng chứng');
    if (note !== null) {
      clientAcceptanceHandover(selectedRequest.id, decision, note);
      refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900">Quản Trị Hiện Diện Từ Xa Tại Sự Kiện</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối ủy thác giới thiệu hồ sơ, kịch bản duyệt và chuyển tiếp câu hỏi Buyer (/admin/hien-dien-tu-xa)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Tổng hồ sơ: {requests.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Danh sách & Chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: DANH SÁCH YÊU CẦU (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Bộ lọc */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm mã RPR, tên công ty, sự kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700"
              >
                <option value="ALL">Tất cả ({requests.length})</option>
                <option value={REMOTE_PRESENCE_STATUSES.SUBMITTED}>Chờ tiếp nhận</option>
                <option value={REMOTE_PRESENCE_STATUSES.READY_FOR_PROGRAM}>Sẵn sàng xuất quân</option>
                <option value={REMOTE_PRESENCE_STATUSES.CONTENT_PREPARATION}>Đang soạn kịch bản</option>
                <option value={REMOTE_PRESENCE_STATUSES.COMPLETED}>Đã nghiệm thu</option>
              </select>
            </div>
          </div>

          {/* List Cards */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredRequests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              const readiness = checkProgramReadiness(req);

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700">{req.requestPublicCode}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === REMOTE_PRESENCE_STATUSES.READY_FOR_PROGRAM
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === REMOTE_PRESENCE_STATUSES.COMPLETED
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{req.supplierName}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{req.programTitle}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Sản phẩm: <span className="font-semibold text-slate-700">{req.selectedProducts?.length || 0}</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        readiness.isReady ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {readiness.isReady ? '✓ Đủ điều kiện ra quân' : `Thiếu ${readiness.missingItems.length} mục`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT ĐIỀU PHỐI (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Header chi tiết */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-blue-700">
                        {selectedRequest.requestPublicCode}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {selectedRequest.id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{selectedRequest.supplierName}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{selectedRequest.programTitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500 block">Đầu mối phản hồi:</span>
                    <span className="text-xs font-bold text-slate-800">
                      {selectedRequest.responderInfo?.fullName} ({selectedRequest.responderInfo?.phone})
                    </span>
                  </div>
                </div>

                {/* Sub-tabs điều phối */}
                <div className="flex items-center gap-1 mt-4 overflow-x-auto pt-2 border-t border-slate-200 text-xs">
                  {[
                    { id: 'OVERVIEW', label: 'Tổng quan' },
                    { id: 'SCOPE_READINESS', label: 'Phạm vi & Sẵn sàng' },
                    { id: 'SCRIPT', label: 'Kịch bản duyệt' },
                    { id: 'INTERACTIONS', label: 'Tương tác & Metric' },
                    { id: 'INQUIRIES', label: 'Câu hỏi Buyer' },
                    { id: 'AUDIT', label: 'Nhật ký' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nội dung tab */}
              <div className="p-5 space-y-4">
                {/* 1. OVERVIEW */}
                {activeTab === 'OVERVIEW' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Sản phẩm / Năng lực trọng tâm:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.selectedProducts?.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-semibold"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block">Vật mẫu đối chứng:</span>
                        <span className="font-bold text-slate-800">
                          {selectedRequest.sampleInfo?.hasSample
                            ? `Có (${selectedRequest.sampleInfo.quantity} mẫu - ${selectedRequest.sampleInfo.receivedStatus})`
                            : 'Không gửi mẫu'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Cam kết phản hồi (SLA):</span>
                        <span className="font-bold text-slate-800">
                          Trong vòng {selectedRequest.responderInfo?.slaHours || 8} giờ
                        </span>
                      </div>
                    </div>

                    {/* Nghiệm thu nhanh */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Nghiệm thu dịch vụ:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleHandoverDecision('ACCEPT_DELIVERY')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs"
                        >
                          Duyệt Nghiệm Thu (COMPLETED)
                        </button>
                        <button
                          onClick={() => handleHandoverDecision('REQUEST_CLARIFICATION')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                        >
                          Yêu cầu giải trình
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SCOPE & READINESS (Section 58 Admin Readiness Gate) */}
                {activeTab === 'SCOPE_READINESS' && (
                  <div className="space-y-4 text-xs">
                    {(() => {
                      const readiness = checkProgramReadiness(selectedRequest);
                      return (
                        <div
                          className={`p-4 rounded-xl border ${
                            readiness.isReady
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-sm mb-2">
                            {readiness.isReady ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <span>ĐỦ 11 ĐIỀU KIỆN SẴN SÀNG RA QUÂN (READY_FOR_PROGRAM)</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <span>CÒN THIẾU {readiness.missingItems.length} HẠNG MỤC TRƯỚC SỰ KIỆN</span>
                              </>
                            )}
                          </div>
                          {!readiness.isReady && (
                            <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                              {readiness.missingItems.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })()}

                    <div>
                      <span className="font-bold text-slate-700 block mb-2">Phạm vi được phép đại diện:</span>
                      <div className="space-y-1.5">
                        {selectedRequest.representationScope?.map((scopeKey) => (
                          <div key={scopeKey} className="flex items-center gap-2 text-slate-700">
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                            <span>{scopeKey}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. APPROVED SCRIPT (Section 37, 38, 39) */}
                {activeTab === 'SCRIPT' && (
                  <div className="space-y-4 text-xs">
                    {selectedRequest.hasApprovedScript ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">
                            Kịch bản đã duyệt ({selectedRequest.approvedScript.version})
                          </span>
                          <span className="text-[11px] text-emerald-700">
                            Người duyệt: {selectedRequest.approvedScript.approvedBy}
                          </span>
                        </div>
                        <p className="text-slate-800 text-xs italic bg-white p-3 rounded border border-emerald-100">
                          "{selectedRequest.approvedScript.text}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                        Chưa duyệt kịch bản giới thiệu chính thức cho yêu cầu này.
                      </div>
                    )}

                    <form onSubmit={handleApproveScript} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="font-bold text-slate-800 block">Duyệt hoặc cập nhật kịch bản giới thiệu:</span>
                      {scriptError && <p className="text-rose-600 text-xs">{scriptError}</p>}
                      <textarea
                        rows={3}
                        required
                        placeholder="Nhập kịch bản ngắn gọn 2–3 câu giới thiệu đúng thông tin tự khai của xưởng..."
                        value={scriptDraft}
                        onChange={(e) => setScriptDraft(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      ></textarea>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">
                          Hard rule: Không được dùng từ 'đã xác minh' nếu là tự khai.
                        </span>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
                        >
                          Phê Duyệt Kịch Bản
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 4. INTERACTIONS & METRIC SEPARATION (Section 18, 19, 59) */}
                {activeTab === 'INTERACTIONS' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-500 block">Lượt quét QR</span>
                        <span className="text-lg font-bold text-blue-700">{selectedRequest.metrics?.qrScans || 0}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-500 block">Xem hồ sơ số</span>
                        <span className="text-lg font-bold text-indigo-700">
                          {selectedRequest.metrics?.profileViews || 0}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-500 block">Contact có Consent</span>
                        <span className="text-lg font-bold text-emerald-700">
                          {selectedRequest.metrics?.contactRequests || 0}
                        </span>
                      </div>
                    </div>

                    {/* Bộ nút bấm ghi nhận nhanh tại hiện trường sự kiện (Section 59 Program Day) */}
                    <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                      <span className="font-bold text-blue-900 block">Thao tác nhanh của điều phối viên tại hiện trường:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleRecordQuickEvent(INTERACTION_EVENT_TYPES.QR_SCAN)}
                          className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded font-semibold text-xs"
                        >
                          +1 Khách Quét QR
                        </button>
                        <button
                          onClick={() => handleRecordQuickEvent(INTERACTION_EVENT_TYPES.VIDEO_VIEW)}
                          className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded font-semibold text-xs"
                        >
                          +1 Lượt Xem Video
                        </button>
                        <button
                          onClick={() => handleRecordQuickEvent(INTERACTION_EVENT_TYPES.CONTACT_REQUEST)}
                          className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded font-semibold text-xs"
                        >
                          +1 Nhận Danh Thiếp (Consent)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. INQUIRIES & QUESTIONS / RFQ (Section 14, 15) */}
                {activeTab === 'INQUIRIES' && (
                  <div className="space-y-4 text-xs">
                    <form onSubmit={handleAddInquiry} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="font-bold text-slate-800 block">Ghi nhận câu hỏi / yêu cầu báo giá từ Buyer:</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-600 block mb-1 font-semibold">Loại câu hỏi:</label>
                          <select
                            value={inquiryType}
                            onChange={(e) => setInquiryType(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                          >
                            <option value="QUOTE_REQUEST">Yêu cầu báo giá (QUOTE_REQUESTED)</option>
                            <option value="TECH_QUESTION">Câu hỏi kỹ thuật (NEEDS_SUPPLIER_RESPONSE)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-600 block mb-1 font-semibold">Tên công ty Buyer:</label>
                          <input
                            type="text"
                            required
                            placeholder="VD: Nhà máy Daikin KCN Thăng Long"
                            value={inquiryBuyerCompany}
                            onChange={(e) => setInquiryBuyerCompany(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-600 block mb-1 font-semibold">Nội dung câu hỏi / quy cách:</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Mô tả cụ thể câu hỏi hoặc số lượng Buyer quan tâm..."
                          value={inquiryQuestion}
                          onChange={(e) => setInquiryQuestion(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                        ></textarea>
                      </div>

                      <div className="flex justify-between items-center">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                          <input
                            type="checkbox"
                            checked={inquiryBuyerConsent}
                            onChange={(e) => setInquiryBuyerConsent(e.target.checked)}
                          />
                          <span>Buyer đồng ý chia sẻ thông tin liên hệ</span>
                        </label>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
                        >
                          Chuyển Về Cho Xưởng
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 6. AUDIT LOGS */}
                {activeTab === 'AUDIT' && (
                  <div className="space-y-2 text-xs">
                    {selectedRequest.auditLogs?.map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-center text-slate-500 mb-1">
                          <span className="font-bold text-slate-800">{log.action}</span>
                          <span>{new Date(log.at).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-slate-700">{log.details}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Người thực hiện: {log.performedBy}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              Chọn một hồ sơ yêu cầu bên trái để xem chi tiết điều phối.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
