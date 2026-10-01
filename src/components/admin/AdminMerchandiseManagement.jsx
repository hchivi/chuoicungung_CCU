import React, { useState, useEffect } from 'react';
import { 
  Package, CheckCircle2, Clock, AlertTriangle, Search, Filter, 
  Eye, Edit3, ArrowRight, ShieldCheck, ChevronRight, UserCheck, 
  Plus, RefreshCw, X, Layers, Save, ExternalLink, Tag, 
  ShoppingBag, Award, Palette, Truck, FileText, Check, ShieldAlert,
  Calendar, MapPin, DollarSign, ListChecks
} from 'lucide-react';
import { 
  getAllMerchandiseRequests,
  saveAllMerchandiseRequests,
  updateMerchandiseRequestStatus,
  recordSampleApproval,
  saveMerchandiseQuotation,
  getAllMerchandiseAuditLogs,
  getMerchandiseProgressSummary,
  findMatchingSuppliersForMerchandise,
  MERCHANDISE_STATUSES,
  COORDINATION_MODES,
  SAMPLE_QUOTATION_TEMPLATE
} from '../../data/merchandiseEventData';

export default function AdminMerchandiseManagement({ initialRequestId = null }) {
  const [requests, setRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [summary, setSummary] = useState({ total: 0, waitingClient: 0, waitingTeam: 0, inProduction: 0, completed: 0 });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Request Modal & Detail Tabs (Section 13 Spec 16.txt)
  // Tabs: overview | products | specifications | supplier | sample | quotation | production | delivery | tasks | files | timeline | audit
  const [selectedReq, setSelectedReq] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');

  // Edit States
  const [editStatus, setEditStatus] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editNextAction, setEditNextAction] = useState('');
  const [editNextActionAt, setEditNextActionAt] = useState('');
  const [editConfirmedDeliveryDate, setEditConfirmedDeliveryDate] = useState('');
  const [editCoordinationMode, setEditCoordinationMode] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Sample Approval Form State (Section 9)
  const [sampleApprovalStatus, setSampleApprovalStatus] = useState('APPROVED');
  const [sampleApprover, setSampleApprover] = useState('');
  const [sampleVersion, setSampleVersion] = useState('v1.0');
  const [sampleNotes, setSampleNotes] = useState('');

  // Sourcing Match List
  const [matchedSuppliers, setMatchedSuppliers] = useState([]);

  const loadData = () => {
    const list = getAllMerchandiseRequests();
    const logs = getAllMerchandiseAuditLogs();
    const summ = getMerchandiseProgressSummary();
    setRequests(list);
    setAuditLogs(logs);
    setSummary(summ);

    if (initialRequestId) {
      const found = list.find(r => r.id === initialRequestId);
      if (found) openDetail(found);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialRequestId]);

  const openDetail = (req) => {
    setSelectedReq(req);
    setDetailTab('overview');
    setEditStatus(req.status || 'NEW');
    setEditOwner(req.owner || 'Trần Đình Trọng (Production & Procurement Lead)');
    setEditNextAction(req.nextAction || '');
    setEditNextActionAt(req.nextActionAt ? req.nextActionAt.slice(0, 16) : '');
    setEditConfirmedDeliveryDate(req.confirmedDeliveryDate || '');
    setEditCoordinationMode(req.coordinationMode || 'PLATFORM_COORDINATION');
    setActionError('');
    setActionSuccess('');

    // Pre-fill sample state
    setSampleApprovalStatus(req.sampleStatus || 'SAMPLE_REQUESTED');
    setSampleApprover(req.sampleRecord?.approvedBy || req.customerName || '');
    setSampleVersion(req.sampleRecord?.version || 'v1.1');
    setSampleNotes(req.sampleRecord?.notes || '');

    // Sourcing suppliers
    const foundSuppliers = findMatchingSuppliersForMerchandise({
      productType: req.productTypes?.[0] || '',
      location: req.deliveryLocation || ''
    });
    setMatchedSuppliers(foundSuppliers);
  };

  // Cập nhật trạng thái yêu cầu
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setActionError('');
    setActionSuccess('');

    const res = updateMerchandiseRequestStatus({
      requestId: selectedReq.id,
      status: editStatus,
      owner: editOwner,
      nextAction: editNextAction,
      nextActionAt: editNextActionAt ? new Date(editNextActionAt).toISOString() : null,
      confirmedDeliveryDate: editConfirmedDeliveryDate,
      coordinationMode: editCoordinationMode,
      actor: 'Admin Master'
    });

    if (!res.success) {
      setActionError(res.message);
      return;
    }

    setActionSuccess('Cập nhật trạng thái thành công!');
    setSelectedReq(res.request);
    loadData();
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Ký duyệt mẫu (Section 9)
  const handleSampleApprovalSubmit = (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setActionError('');
    setActionSuccess('');

    const res = recordSampleApproval({
      requestId: selectedReq.id,
      sampleStatus: sampleApprovalStatus,
      approvedBy: sampleApprover,
      version: sampleVersion,
      notes: sampleNotes,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccess('Đã cập nhật biên bản duyệt mẫu vật lý thành công!');
      setSelectedReq(res.request);
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  // Áp dụng báo giá chuẩn 13 hạng mục
  const handleApplyQuotation = () => {
    if (!selectedReq) return;
    const res = saveMerchandiseQuotation({
      requestId: selectedReq.id,
      quotationData: {
        ...SAMPLE_QUOTATION_TEMPLATE,
        id: `BG-2026-${selectedReq.id}`,
        requestId: selectedReq.id,
        buyer: {
          name: selectedReq.companyName,
          taxId: '3700999888',
          address: selectedReq.deliveryLocation || 'Nhà máy khách hàng',
          contactPerson: selectedReq.customerName,
          phone: selectedReq.phone,
          email: selectedReq.email
        },
        estimatedTimeline: {
          ...SAMPLE_QUOTATION_TEMPLATE.estimatedTimeline,
          requestedDeliveryDate: selectedReq.requestedDate || 'Theo đề bài',
          confirmedDeliveryDate: editConfirmedDeliveryDate || '2026-04-20',
          deliveryLocation: selectedReq.deliveryLocation || 'Kho khách hàng'
        }
      },
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccess('Đã phát hành báo giá 13 hạng mục cho yêu cầu này!');
      setSelectedReq(res.request);
      loadData();
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch = !searchQuery ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.productTypes && r.productTypes.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchStatus && matchSearch;
  });

  const reqAuditLogs = selectedReq
    ? auditLogs.filter(l => l.requestId === selectedReq.id || l.details?.includes(selectedReq.id))
    : [];

  return (
    <div className="space-y-6">
      
      {/* 4 Summary Buckets (Section 13 Spec 16.txt) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Chờ doanh nghiệp phản hồi</div>
          <div className="text-2xl font-black text-amber-600 font-heading mt-1">
            {summary.waitingClient}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Duyệt mẫu / Chốt báo giá</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Chờ đội ngũ xử lý</div>
          <div className="text-2xl font-black text-blue-600 font-heading mt-1">
            {summary.waitingTeam}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Làm mẫu / Quy cách / Báo giá</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Đang sản xuất & KCS</div>
          <div className="text-2xl font-black text-teal-600 font-heading mt-1">
            {summary.inProduction}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Đã duyệt mẫu & chạy chuyền</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Đã hoàn tất bàn giao</div>
          <div className="text-2xl font-black text-emerald-600 font-heading mt-1">
            {summary.completed}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Nghiệm thu đủ 100%</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã DV, công ty, sản phẩm..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] font-medium"
          >
            <option value="ALL">Tất cả trạng thái ({requests.length})</option>
            {MERCHANDISE_STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading">
                <th className="p-3 font-bold">Mã đề bài</th>
                <th className="p-3 font-bold">Doanh nghiệp & Liên hệ</th>
                <th className="p-3 font-bold">Danh mục vật phẩm & SL</th>
                <th className="p-3 font-bold">Mô hình & NCC</th>
                <th className="p-3 font-bold">Tình trạng mẫu</th>
                <th className="p-3 font-bold">Trạng thái</th>
                <th className="p-3 font-bold">Ngày giao cam kết</th>
                <th className="p-3 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => {
                const statusObj = MERCHANDISE_STATUSES.find(s => s.id === req.status) || MERCHANDISE_STATUSES[0];
                return (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-800">
                      {req.id}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{req.companyName}</div>
                      <div className="text-[11px] text-slate-500">{req.customerName} • {req.phone}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-800">
                        {(req.productTypes || []).join(', ')}
                      </div>
                      <div className="text-[11px] text-teal-700 font-mono font-semibold">
                        SL: {req.quantities || 'Theo báo giá'}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {req.coordinationMode === 'DIRECT_SALE' ? 'Mode B: Direct' : 'Mode A: Coor'}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                        {req.assignedSupplierName || 'Đang tìm NCC'}
                      </div>
                    </td>

                    <td className="p-3">
                      {req.sampleRequired ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.sampleStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : (req.sampleStatus === 'REVISION_REQUIRED' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800')
                        }`}>
                          {req.sampleStatus === 'APPROVED' ? `Đã duyệt (${req.sampleRecord?.version || 'v1.0'})` : 'Chưa duyệt'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Không yêu cầu</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        statusObj.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        statusObj.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        statusObj.color === 'teal' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                        statusObj.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {statusObj.name}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      {req.confirmedDeliveryDate ? (
                        <span className="font-bold text-emerald-700">{req.confirmedDeliveryDate}</span>
                      ) : (
                        <span className="text-amber-600 italic">Chờ confirm (Khách muốn: {req.requestedDate || 'N/A'})</span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(req)}
                        className="py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DETAIL MODAL WITH 12 MANDATORY TABS (SECTION 13 SPEC 16.TXT) */}
      {/* Tabs: Tổng quan | Sản phẩm | Quy cách | Supplier | Mẫu | Báo giá | Sản xuất | Giao hàng | Tasks | Files | Timeline | Audit */}
      {/* ==================================================================== */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/70 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-800 text-white font-mono font-bold text-xs">
                    {selectedReq.id}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedReq.companyName}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black font-heading text-slate-900 line-clamp-1">
                  {selectedReq.objective}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 12 Tabs Navigation Bar */}
            <div className="border-b border-slate-200 bg-slate-100/70 px-4 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none text-xs font-bold">
              {[
                { id: 'overview', label: 'Tổng quan' },
                { id: 'products', label: 'Sản phẩm' },
                { id: 'specifications', label: 'Quy cách' },
                { id: 'supplier', label: 'Supplier' },
                { id: 'sample', label: 'Mẫu duyệt' },
                { id: 'quotation', label: 'Báo giá (13)' },
                { id: 'production', label: 'Sản xuất' },
                { id: 'delivery', label: 'Giao hàng' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'files', label: 'Files' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'audit', label: 'Audit' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDetailTab(t.id)}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${
                    detailTab === t.id
                      ? 'border-teal-600 text-teal-800 bg-white font-black'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {actionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              {actionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* TAB 1: TỔNG QUAN */}
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-800 uppercase font-heading text-[11px]">Thông tin khách hàng</div>
                      <div>• Người liên hệ: <strong>{selectedReq.customerName}</strong> ({selectedReq.roleTitle || 'Đại diện'})</div>
                      <div>• Số điện thoại: <strong>{selectedReq.phone}</strong></div>
                      <div>• Email: <strong>{selectedReq.email}</strong></div>
                      <div>• Doanh nghiệp: <strong>{selectedReq.companyName}</strong></div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-slate-800 uppercase font-heading text-[11px]">Điều phối & Pháp lý</div>
                      <div>• Mô hình: <strong>{selectedReq.coordinationMode === 'DIRECT_SALE' ? 'Mode B: Cung ứng trực tiếp CCU' : 'Mode A: Điều phối sàn'}</strong></div>
                      <div>• Người phụ trách: <strong>{selectedReq.owner}</strong></div>
                      <div>• Trạng thái hiện tại: <strong className="text-teal-700">{selectedReq.status}</strong></div>
                      <div>• Ngày mong muốn: <strong>{selectedReq.requestedDate || 'Chưa rõ'}</strong></div>
                      <div>• Ngày giao cam kết: <strong className="text-emerald-700">{selectedReq.confirmedDeliveryDate || 'Chờ xác nhận'}</strong></div>
                    </div>
                  </div>

                  {/* Form Update Status */}
                  <form onSubmit={handleUpdateStatus} className="p-5 rounded-2xl bg-teal-50/40 border border-teal-200 space-y-4">
                    <div className="font-bold text-sm text-teal-950 font-heading">
                      Cập nhật trạng thái & Tiến độ bàn giao
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Trạng thái vận hành</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                        >
                          {MERCHANDISE_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Ngày giao cam kết (Confirmed Delivery Date)</label>
                        <input
                          type="text"
                          value={editConfirmedDeliveryDate}
                          onChange={e => setEditConfirmedDeliveryDate(e.target.value)}
                          placeholder="VD: 2026-04-14 (Có xác nhận từ xưởng)"
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Mô hình hợp đồng</label>
                        <select
                          value={editCoordinationMode}
                          onChange={e => setEditCoordinationMode(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                        >
                          <option value="PLATFORM_COORDINATION">Mode A: Điều phối sàn</option>
                          <option value="DIRECT_SALE">Mode B: Cung ứng trực tiếp CCU</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Chuyên viên phụ trách</label>
                        <input
                          type="text"
                          value={editOwner}
                          onChange={e => setEditOwner(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Hành động tiếp theo (Next action)</label>
                        <input
                          type="text"
                          value={editNextAction}
                          onChange={e => setEditNextAction(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="py-2 px-5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs transition"
                      >
                        Lưu cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SẢN PHẨM */}
              {detailTab === 'products' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 font-heading">Danh mục vật phẩm đặt hàng:</div>
                    <div className="flex flex-wrap gap-2">
                      {(selectedReq.productTypes || []).map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-teal-800">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Khối lượng đặt hàng (Quantities):</div>
                    <div className="text-slate-700 font-mono text-sm font-bold">{selectedReq.quantities || 'Chưa cung cấp'}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Bảng phân bổ kích cỡ (Size Chart):</div>
                    <div className="text-slate-700 font-mono">{selectedReq.sizeChart || 'Theo đo size thực tế tại nhà máy'}</div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUY CÁCH */}
              {detailTab === 'specifications' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Quy cách kỹ thuật & Vật liệu:</div>
                    <p className="text-slate-700 leading-relaxed">{selectedReq.specifications || 'Chưa mô tả chi tiết'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Yêu cầu công nghệ in / thêu:</div>
                    <p className="text-slate-700 leading-relaxed">{selectedReq.printRequirements || 'In lụa / thêu vi tính'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Màu sắc nhận diện (Pantone):</div>
                    <p className="text-slate-700 leading-relaxed">{selectedReq.colors || 'Theo nhận diện công ty'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">Quy cách đóng gói:</div>
                    <p className="text-slate-700 leading-relaxed">{selectedReq.packagingRequirements || 'Túi OPP từng cái, đóng thùng 5 lớp'}</p>
                  </div>
                </div>
              )}

              {/* TAB 4: SUPPLIER SOURCING */}
              {detailTab === 'supplier' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 font-heading">Xưởng sản xuất đang gán:</div>
                    <div className="text-slate-700 text-sm font-bold">
                      {selectedReq.assignedSupplierName || 'Đang điều phối tìm xưởng'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-xs text-slate-800 uppercase font-heading">
                      Gợi ý nhà cung cấp phù hợp (Matching không bias Sponsor):
                    </div>
                    <div className="space-y-2">
                      {matchedSuppliers.map((sup, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900">{sup.supplierName}</strong>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              Điểm match: {sup.matchScore}%
                            </span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            MOQ: {sup.moq} • Tiến độ: {sup.leadTime} • Mẫu thử: {sup.sampleLeadTime}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Tiêu chí: {sup.matchFactors.join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MẪU DUYỆT (SECTION 9) */}
              {detailTab === 'sample' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <div className="font-bold text-purple-900 font-heading">Biên bản duyệt mẫu hiện tại:</div>
                    <div>• Tình trạng: <strong>{selectedReq.sampleStatus || 'CHƯA LÀM MẪU'}</strong></div>
                    <div>• Người duyệt: <strong>{selectedReq.sampleRecord?.approvedBy || 'Chưa duyệt'}</strong></div>
                    <div>• Thời gian duyệt: <strong>{selectedReq.sampleRecord?.approvedAt || 'N/A'}</strong></div>
                    <div>• Phiên bản: <strong>{selectedReq.sampleRecord?.version || 'N/A'}</strong></div>
                    <div>• Ghi chú: <em>{selectedReq.sampleRecord?.notes || 'Không có ghi chú'}</em></div>
                  </div>

                  {/* Form duyệt mẫu */}
                  <form onSubmit={handleSampleApprovalSubmit} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 font-heading">Ký duyệt / Cập nhật tiến độ mẫu vật lý</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Tình trạng mẫu</label>
                        <select
                          value={sampleApprovalStatus}
                          onChange={e => setSampleApprovalStatus(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold"
                        >
                          <option value="APPROVED">APPROVED (Đã duyệt chính thức)</option>
                          <option value="REVISION_REQUIRED">REVISION_REQUIRED (Cần may/in lại mẫu)</option>
                          <option value="SAMPLE_SENT">SAMPLE_SENT (Đã gửi mẫu cho khách)</option>
                          <option value="SAMPLE_PREPARING">SAMPLE_PREPARING (Đang chuẩn bị)</option>
                          <option value="REJECTED">REJECTED (Từ chối mẫu)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Phiên bản mẫu (Version)</label>
                        <input
                          type="text"
                          value={sampleVersion}
                          onChange={e => setSampleVersion(e.target.value)}
                          placeholder="VD: v1.0, v1.1"
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Họ tên người ký duyệt</label>
                        <input
                          type="text"
                          value={sampleApprover}
                          onChange={e => setSampleApprover(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Ghi chú đối soát chất liệu / màu sắc</label>
                        <textarea
                          rows={2}
                          value={sampleNotes}
                          onChange={e => setSampleNotes(e.target.value)}
                          placeholder="VD: Đã duyệt mẫu áo polo vải cá sấu Navy, logo thêu sắc nét..."
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="py-2 px-5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs"
                      >
                        Lưu biên bản duyệt mẫu
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: BÁO GIÁ 13 HẠNG MỤC */}
              {detailTab === 'quotation' && (
                <div className="space-y-4">
                  {selectedReq.quotation ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 font-heading">
                          Báo giá: {selectedReq.quotation.id}
                        </div>
                        <span className="font-mono font-bold text-teal-700 text-sm">
                          {selectedReq.quotation.costBreakdown?.grandTotal?.toLocaleString('vi-VN')} đ (Đã gồm VAT)
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px] space-y-1">
                        <div>• Chi phí sản xuất: {selectedReq.quotation.costBreakdown?.productionCost?.toLocaleString('vi-VN')} đ</div>
                        <div>• Phí mẫu: {selectedReq.quotation.costBreakdown?.sampleCost?.toLocaleString('vi-VN')} đ (Được hoàn khi ký HĐ)</div>
                        <div>• Vận chuyển: {selectedReq.quotation.costBreakdown?.shippingCost?.toLocaleString('vi-VN')} đ</div>
                        <div>• Thuế VAT 8%: {selectedReq.quotation.costBreakdown?.vatTaxAmount?.toLocaleString('vi-VN')} đ</div>
                        <div>• Cam kết lỗi: {selectedReq.quotation.defectPolicy}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
                      <p className="text-slate-500">Chưa có báo giá 13 hạng mục chính thức cho yêu cầu này.</p>
                      <button
                        type="button"
                        onClick={handleApplyQuotation}
                        className="py-2 px-4 rounded-xl bg-teal-700 text-white font-bold shadow-xs hover:bg-teal-800"
                      >
                        Phát hành Báo giá 13 hạng mục chuẩn
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: SẢN XUẤT */}
              {detailTab === 'production' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">Kế hoạch chạy chuyền sản xuất:</div>
                    <div>• Tình trạng KCS: <strong>{selectedReq.status === 'PRODUCTION' ? 'Đang may & in đợt 1' : 'Chờ mở lệnh'}</strong></div>
                    <div>• Tỷ lệ hao hụt kỹ thuật cho phép: <strong>Dưới 0.5%</strong></div>
                    <div>• Tiêu chuẩn kiểm hàng: <strong>Kiểm 100% đường may, độ bền màu in & xếp size</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 8: GIAO HÀNG */}
              {detailTab === 'delivery' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">Thông tin giao nhận tận nơi:</div>
                    <div>• Địa chỉ giao hàng: <strong>{selectedReq.deliveryLocation || 'Chưa cung cấp'}</strong></div>
                    <div>• Người nhận & kiểm đếm: <strong>{selectedReq.approvalContact || selectedReq.customerName}</strong></div>
                    <div>• Ngày giao cam kết: <strong className="text-emerald-700">{selectedReq.confirmedDeliveryDate || 'Đang thẩm định'}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 9: TASKS */}
              {detailTab === 'tasks' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>1. Thẩm định quy cách in/thêu và gửi báo giá</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>2. May mẫu thực tế đối soát</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>3. Giao hàng và ký biên bản nghiệm thu</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}

              {/* TAB 10: FILES */}
              {detailTab === 'files' && (
                <div className="space-y-2">
                  {(selectedReq.attachments || []).map((f, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="font-mono text-teal-800 font-bold">{f.name || f.link}</span>
                      <span className="text-slate-400">{f.size || 'Link'}</span>
                    </div>
                  ))}
                  {(!selectedReq.attachments || selectedReq.attachments.length === 0) && (
                    <p className="text-slate-400 italic">Chưa có file đính kèm.</p>
                  )}
                </div>
              )}

              {/* TAB 11: TIMELINE */}
              {detailTab === 'timeline' && (
                <div className="space-y-2">
                  <div className="text-slate-600">• Khởi tạo đề bài: {new Date(selectedReq.createdAt).toLocaleString('vi-VN')}</div>
                  <div className="text-slate-600">• Cập nhật gần nhất: {new Date(selectedReq.updatedAt).toLocaleString('vi-VN')}</div>
                </div>
              )}

              {/* TAB 12: AUDIT LOGS */}
              {detailTab === 'audit' && (
                <div className="space-y-2">
                  {reqAuditLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-700">{log.action}</span>
                        <span className="text-slate-400">{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{log.details}</p>
                    </div>
                  ))}
                  {reqAuditLogs.length === 0 && (
                    <p className="text-slate-400 italic">Chưa có audit log cho yêu cầu này.</p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Mã yêu cầu: <strong className="font-mono">{selectedReq.id}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="py-2 px-5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
