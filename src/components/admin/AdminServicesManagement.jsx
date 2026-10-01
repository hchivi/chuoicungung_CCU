import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckCircle2, Clock, AlertCircle, Search, Filter, 
  Eye, Edit3, ArrowRight, ShieldCheck, ChevronRight, UserCheck, 
  FileText, Plus, RefreshCw, X, Layers, Save, ExternalLink,
  Users, Handshake, Calendar, MapPin, Send, ArrowUpRight, Award,
  Check, Play, ArrowLeftRight, AlertTriangle, Video, DollarSign
} from 'lucide-react';
import { 
  getAllAdminServices, 
  saveAllServices, 
  getAllServiceRequests, 
  updateServiceRequestStatus, 
  reassignServiceRequestCoordinator,
  createProgramFromServiceRequest,
  getAllServiceAuditLogs, 
  logServiceAudit,
  SERVICE_REQUEST_STATUSES
} from '../../data/servicesData';
import {
  FORM_ENGINE_STATUSES,
  PROPOSAL_STATUSES,
  updateFormEngineRequestStatus,
  updateServiceRequestProposal,
  addServiceRequestTask
} from '../../data/serviceFormEngineData';
import AdminMediaProjectsManagement from './AdminMediaProjectsManagement';
import AdminMerchandiseManagement from './AdminMerchandiseManagement';
import { createMediaProjectFromServiceRequest } from '../../data/mediaContentData';

export default function AdminServicesManagement({ initialRequestId = null }) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'services' | 'media' | 'merchandise' | 'audit'
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Filters & Search (Section 17 Spec 17.txt)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  
  // Selected Request Modal State (9 tabs: overview, scope, organization, files, proposal, tasks, timeline, result, audit)
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalTab, setModalTab] = useState('overview'); 
  
  const [editStatus, setEditStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelErrorMsg, setCancelErrorMsg] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editNextAction, setEditNextAction] = useState('');
  const [editNextActionAt, setEditNextActionAt] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Coordinator Handoff Form State (Section 13)
  const [newCoordinator, setNewCoordinator] = useState('Lê Thu Trang (Regional Coordinator Desk)');
  const [handoffNote, setHandoffNote] = useState('');

  // Create Program Form State (Section 9 & 10)
  const [programTitle, setProgramTitle] = useState('');
  const [programDate, setProgramDate] = useState('');
  const [programLocation, setProgramLocation] = useState('');

  // Edit Service Modal
  const [editingService, setEditingService] = useState(null);

  // Load Data
  const loadAllData = () => {
    const s = getAllAdminServices();
    const r = getAllServiceRequests();
    const a = getAllServiceAuditLogs();
    setServices(s);
    setRequests(r);
    setAuditLogs(a);

    if (initialRequestId) {
      const found = r.find(item => item.id === initialRequestId);
      if (found) {
        openRequestDetail(found);
      }
    }
  };

  useEffect(() => {
    loadAllData();
  }, [initialRequestId]);

  // Proposal State (Section 19 Spec 17.txt)
  const [proposalStatus, setProposalStatus] = useState('DRAFT');
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalDeliverables, setProposalDeliverables] = useState('');
  const [proposalValidUntil, setProposalValidUntil] = useState('');
  const [proposalShared, setProposalShared] = useState(false);
  const [proposalNote, setProposalNote] = useState('');

  // Task State (Section 7 Spec 17.txt)
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const openRequestDetail = (req) => {
    setSelectedRequest(req);
    setModalTab('overview');
    setEditStatus(req.status || 'NEW');
    setCancelReason(req.cancellationReason || '');
    setCancelErrorMsg('');
    setEditOwner(req.owner || 'Đang chờ phân công');
    setEditNextAction(req.nextAction || '');
    setEditNextActionAt(req.nextActionAt ? req.nextActionAt.slice(0, 16) : '');
    setActionSuccessMsg('');

    // Pre-fill proposal manager
    setProposalStatus(req.proposal?.status || 'DRAFT');
    setProposalAmount(req.proposal?.totalAmount || req.budget || '');
    setProposalDeliverables(Array.isArray(req.proposal?.deliverables) ? req.proposal.deliverables.join('\n') : '');
    setProposalValidUntil(req.proposal?.validUntil || '');
    setProposalShared(Boolean(req.proposal?.sharedWithCustomer));
    setProposalNote(req.proposal?.note || '');

    // Reset task form
    setNewTaskTitle('');
    setNewTaskAssignee(req.owner || 'Chuyên viên phụ trách');
    setNewTaskDueDate('');

    // Pre-fill program generator values
    setProgramTitle(req.objective ? `Ngày Hội Kết Nối: ${req.companyName}` : `Chương Trình Kết Nối ${req.companyName}`);
    setProgramDate(req.expectedDate || 'Tháng 11/2026');
    setProgramLocation(req.location || 'KCN Đồng Nai / TP. Hồ Chí Minh');
    setHandoffNote('');
  };

  const handleUpdateRequest = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    // RULE SECTION 10: Nếu CANCELLED, bắt buộc phải có reason
    if (editStatus === 'CANCELLED' && !cancelReason.trim()) {
      setCancelErrorMsg('LỖI QUY TRÌNH (Spec 17 - Mục 10): Khi chuyển trạng thái sang CANCELLED, bắt buộc phải nhập lý do hủy (Cancellation Reason).');
      return;
    }
    setCancelErrorMsg('');

    const res = updateFormEngineRequestStatus({
      requestId: selectedRequest.id,
      status: editStatus,
      reason: cancelReason,
      owner: editOwner,
      nextAction: editNextAction,
      nextActionAt: editNextActionAt ? new Date(editNextActionAt).toISOString() : null,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg('Đã cập nhật trạng thái yêu cầu dịch vụ thành công!');
      loadAllData();
      setSelectedRequest(res.request);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } else {
      setCancelErrorMsg(res.message);
    }
  };

  // Proposal Update Handler (Section 19)
  const handleSaveProposal = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const deliverablesList = proposalDeliverables.split('\n').map(s => s.trim()).filter(Boolean);
    const res = updateServiceRequestProposal({
      requestId: selectedRequest.id,
      proposalStatus,
      totalAmount: proposalAmount,
      deliverables: deliverablesList,
      validUntil: proposalValidUntil,
      sharedWithCustomer: proposalShared,
      note: proposalNote,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg('Đã cập nhật Proposal / Báo giá thành công!');
      loadAllData();
      setSelectedRequest(res.request);
      setTimeout(() => setActionSuccessMsg(''), 3500);
    }
  };

  // Task Add Handler (Section 7)
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!selectedRequest || !newTaskTitle.trim()) return;

    const res = addServiceRequestTask({
      requestId: selectedRequest.id,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      dueDate: newTaskDueDate,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg(`Đã tạo đầu việc mới: "${newTaskTitle}"!`);
      loadAllData();
      setSelectedRequest(res.request);
      setNewTaskTitle('');
      setTimeout(() => setActionSuccessMsg(''), 3500);
    }
  };

  // Handoff to Coordinator (Section 13 Spec 14.txt)
  const handleCoordinatorHandoff = (e) => {
    e.preventDefault();
    if (!selectedRequest || !newCoordinator) return;

    const res = reassignServiceRequestCoordinator({
      requestId: selectedRequest.id,
      coordinatorName: newCoordinator,
      actor: 'Admin Master (Partnership Lead)',
      note: handoffNote
    });

    if (res.success) {
      setActionSuccessMsg(`Đã bàn giao thành công cho Coordinator: ${newCoordinator}!`);
      loadAllData();
      setSelectedRequest(res.request);
      setEditOwner(res.request.owner);
      setEditStatus(res.request.status);
      setEditNextAction(res.request.nextAction);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  // Create Program from Service Request (Section 9 & 10 Spec 14.txt)
  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (!selectedRequest || !programTitle) return;

    const res = createProgramFromServiceRequest({
      requestId: selectedRequest.id,
      programTitle,
      programDate,
      programLocation,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg(`Đã khởi tạo thành công Program liên kết: ${res.programId}!`);
      loadAllData();
      setSelectedRequest(res.request);
      setEditStatus(res.request.status);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handleToggleAcceptingRequests = (serviceId) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        const nextState = !s.acceptingRequests;
        logServiceAudit({
          action: 'TOGGLE_SERVICE_ACCEPTING',
          serviceId: s.id,
          actor: 'Admin Master',
          details: `Dịch vụ "${s.name}" đổi trạng thái tiếp nhận yêu cầu: ${nextState ? 'BẬT' : 'TẮT'}`
        });
        return { ...s, acceptingRequests: nextState, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    setServices(updated);
    saveAllServices(updated);
    loadAllData();
  };

  const handleSaveServiceEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;

    const updated = services.map(s => s.id === editingService.id ? { ...editingService, updatedAt: new Date().toISOString() } : s);
    setServices(updated);
    saveAllServices(updated);

    logServiceAudit({
      action: 'UPDATE_SERVICE_METADATA',
      serviceId: editingService.id,
      actor: 'Admin Master',
      details: `Cập nhật thông tin dịch vụ "${editingService.name}" (Trạng thái: ${editingService.status})`
    });

    setEditingService(null);
    loadAllData();
  };

  // KPIs
  const totalRequests = requests.length;
  const newRequests = requests.filter(r => r.status === 'NEW').length;
  const inProgressRequests = requests.filter(r => ['NEED_MORE_INFO', 'PREPARING_PROPOSAL', 'PROPOSAL_SENT', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_ACCEPTANCE'].includes(r.status)).length;
  const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;

  // Filtered requests (Section 17 Spec 17.txt)
  const filteredRequests = requests.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchService = serviceFilter === 'ALL' || 
      r.serviceType === serviceFilter ||
      (r.serviceIds && r.serviceIds.includes(serviceFilter));
    const matchUnassigned = !unassignedOnly || (!r.owner || r.owner.includes('chờ phân công') || r.owner.includes('Chưa gán'));
    const matchOverdue = !overdueOnly || (r.nextActionAt && new Date(r.nextActionAt).getTime() < Date.now() && !['COMPLETED', 'CANCELLED'].includes(r.status));
    const matchLocation = !locationFilter || (r.location && r.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      (r.publicCode && r.publicCode.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.contactName && r.contactName.toLowerCase().includes(q)) ||
      (r.companyName && r.companyName.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.contactPhone && r.contactPhone.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.contactEmail && r.contactEmail.toLowerCase().includes(q)) ||
      (r.serviceNames && r.serviceNames.some(name => name.toLowerCase().includes(q)));

    return matchStatus && matchService && matchUnassigned && matchOverdue && matchLocation && matchSearch;
  });

  // Filtered audit logs for modal
  const requestAuditLogs = selectedRequest 
    ? auditLogs.filter(l => l.details.includes(selectedRequest.id) || l.serviceId?.includes(selectedRequest.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 font-heading">
              Quản Lý Dịch Vụ & Tiếp Nhận Đề Bài (Pages 13 & 14)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối quy trình thực thi theo spec 13.txt & 14.txt: Đề bài ➔ Làm rõ phạm vi ➔ Proposal ➔ Program ➔ Matching ➔ Kết quả
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'requests' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yêu cầu dịch vụ ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'services' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Danh mục dịch vụ ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'media' 
                ? 'bg-white text-indigo-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hồ sơ & Truyền thông (P15)
          </button>
          <button
            onClick={() => setActiveTab('merchandise')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'merchandise' 
                ? 'bg-white text-teal-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vật phẩm & Sự kiện (P16)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'audit' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nhật ký Audit Log
          </button>
        </div>
      </div>

      {/* KPI Cards (Only on Requests tab) */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổng số đề bài</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-slate-900 font-mono">{totalRequests}</span>
              <span className="p-2 rounded-lg bg-slate-100 text-slate-600">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Tất cả đề bài từ /yeu-cau-dich-vu</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Yêu cầu mới (SLA 24h)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-amber-600 font-mono">{newRequests}</span>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <span className="text-[10px] text-amber-700 mt-1 block">Cần rà soát & liên hệ khách hàng</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Đang khảo sát & Triển khai</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-blue-600 font-mono">{inProgressRequests}</span>
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <RefreshCw className="w-4 h-4" />
              </span>
            </div>
            <span className="text-[10px] text-blue-700 mt-1 block">Proposal, Handoff & Vận hành</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Đã hoàn tất / Nghiệm thu</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-emerald-600 font-mono">{completedRequests}</span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 mt-1 block">Đã bàn giao báo cáo & kết quả</span>
          </div>
        </div>
      )}

      {/* TAB 1: SERVICE REQUESTS TABLE */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Controls (Section 17 Spec 17.txt) */}
          <div className="p-4 border-b border-slate-200 flex flex-col gap-3 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm mã DV-2026-xxxxx, đơn vị, liên hệ, SĐT..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                
                {/* Service Filter */}
                <select
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Tất cả dịch vụ</option>
                  <option value="TO_CHUC_KET_NOI">Tổ chức kết nối (P14)</option>
                  <option value="VAT_PHAM_SU_KIEN">Vật phẩm & Quà tặng (P16)</option>
                  <option value="TRUYEN_THONG_DOANH_NGHIEP">Hồ sơ & Truyền thông (P15)</option>
                  <option value="HIEN_DIEN_TU_XA">Hiện diện từ xa</option>
                  <option value="TAI_TRO">Tài trợ chương trình</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">Tất cả trạng thái ({FORM_ENGINE_STATUSES.length})</option>
                  {FORM_ENGINE_STATUSES.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>

                {/* Location Filter */}
                <input
                  type="text"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  placeholder="Lọc địa bàn / KCN..."
                  className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Filter Checkboxes (Section 17: Overdue, Unassigned) */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1 border-t border-slate-200/60">
              <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={unassignedOnly}
                  onChange={e => setUnassignedOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Chỉ hiện đề bài chưa gán (Unassigned)</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer text-amber-700 hover:text-amber-900">
                <input
                  type="checkbox"
                  checked={overdueOnly}
                  onChange={e => setOverdueOnly(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Chỉ hiện đề bài quá hạn SLA (Overdue)</span>
              </label>

              {(serviceFilter !== 'ALL' || statusFilter !== 'ALL' || unassignedOnly || overdueOnly || locationFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setServiceFilter('ALL');
                    setStatusFilter('ALL');
                    setUnassignedOnly(false);
                    setOverdueOnly(false);
                    setLocationFilter('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-blue-600 hover:underline font-bold ml-auto"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Table (Section 17: Mã, Organization, Service, Location, Status, Owner, Next Action, Due, Created, Updated) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-3.5">Mã (Code)</th>
                  <th className="py-3 px-3.5">Doanh nghiệp / Tổ chức</th>
                  <th className="py-3 px-3.5">Dịch vụ</th>
                  <th className="py-3 px-3.5">Địa bàn</th>
                  <th className="py-3 px-3.5">Trạng thái (9 Bước)</th>
                  <th className="py-3 px-3.5">Người phụ trách</th>
                  <th className="py-3 px-3.5">Bước kế tiếp & Due</th>
                  <th className="py-3 px-3.5">Thời gian</th>
                  <th className="py-3 px-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Không tìm thấy yêu cầu dịch vụ nào phù hợp bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => {
                    const statusMeta = FORM_ENGINE_STATUSES.find(s => s.id === req.status) || {
                      name: req.status,
                      color: 'slate'
                    };

                    const statusBg = {
                      NEW: 'bg-amber-100 text-amber-800 border-amber-200',
                      NEED_MORE_INFO: 'bg-orange-100 text-orange-800 border-orange-200',
                      PREPARING_PROPOSAL: 'bg-blue-100 text-blue-800 border-blue-200',
                      PROPOSAL_SENT: 'bg-purple-100 text-purple-800 border-purple-200',
                      ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                      WAITING_ACCEPTANCE: 'bg-sky-100 text-sky-800 border-sky-200',
                      COMPLETED: 'bg-teal-100 text-teal-800 border-teal-200',
                      CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200'
                    }[req.status] || 'bg-slate-100 text-slate-700 border-slate-200';

                    const isDuplicate = req.duplicateStatus === 'POSSIBLE_DUPLICATE';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-blue-700">
                          <span>{req.publicCode || req.id}</span>
                          {isDuplicate && (
                            <span className="block mt-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 w-max">
                              ⚠️ CỜ TRÙNG LẶP
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="font-bold text-slate-900 block">{req.companyName || 'Doanh nghiệp'}</span>
                          <span className="text-[11px] text-slate-500 block">{req.customerName || req.contactName}</span>
                          <span className="text-[10px] text-slate-400">{req.phone || req.contactPhone}</span>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold">
                            {req.serviceNames?.[0] || req.serviceType}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-slate-700 text-[11px]">
                          {req.location || 'Toàn quốc / Chưa rõ'}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBg}`}>
                            {statusMeta.name}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-slate-800 block text-[11px]">
                            {req.owner ? req.owner.split('(')[0] : 'Đang chờ phân công'}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="text-slate-800 font-semibold block text-[11px] line-clamp-1 max-w-[160px]">
                            {req.nextAction || 'Chưa thiết lập'}
                          </span>
                          {req.nextActionAt && (
                            <span className="text-[10px] text-amber-700 font-mono flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> Due: {new Date(req.nextActionAt).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-[10px] font-mono text-slate-500">
                          <div>Tạo: {new Date(req.createdAt).toLocaleDateString('vi-VN')}</div>
                          {req.updatedAt && <div className="text-slate-400">Sửa: {new Date(req.updatedAt).toLocaleDateString('vi-VN')}</div>}
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={() => openRequestDetail(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Xử lý
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER SERVICES CONFIGURATION */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(srv => {
            const isPhucLoi = srv.slug === 'phuc-loi-doanh-nghiep';
            return (
              <div 
                key={srv.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  srv.status === 'ACTIVE' ? 'border-slate-200' : 'border-dashed border-slate-300 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {srv.slug}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 font-heading flex items-center gap-2">
                        {srv.name}
                        {isPhucLoi && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                            Section 4: Ẩn nếu chưa sẵn sàng
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {srv.shortDescription}
                      </p>
                    </div>

                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                      srv.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {srv.status}
                    </span>
                  </div>

                  {/* Owner & Deliverables count */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] font-semibold text-slate-500">Người phụ trách (Owner):</span>
                      <span className="font-bold text-slate-800">{srv.ownerName}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] font-semibold text-slate-500">Đầu ra quy định (Deliverables):</span>
                      <span className="font-bold text-blue-700">{srv.deliverables?.length || 0} hạng mục</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] font-semibold text-slate-500">Báo giá:</span>
                      <span className="font-bold text-slate-700">{srv.pricingNote}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Switch */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={srv.acceptingRequests}
                      onChange={() => handleToggleAcceptingRequests(srv.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Tiếp nhận yêu cầu</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingService(srv)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa cấu hình
                    </button>
                    <a
                      href={srv.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Xem link đích"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: MEDIA PROJECTS (PAGE 15 SPEC 15.TXT) */}
      {activeTab === 'media' && (
        <AdminMediaProjectsManagement />
      )}

      {/* TAB 4: MERCHANDISE PROJECTS (PAGE 16 SPEC 16.TXT) */}
      {activeTab === 'merchandise' && (
        <AdminMerchandiseManagement />
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Nhật ký kiểm toán hệ thống (Audit Trail)
            </h3>
            <span className="text-xs text-slate-400">
              Ghi nhận mọi thao tác cấu hình, đổi trạng thái và bàn giao điều phối
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-4">Thời gian</th>
                  <th className="py-2.5 px-4">Hành động</th>
                  <th className="py-2.5 px-4">Người thực hiện</th>
                  <th className="py-2.5 px-4">Chi tiết thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Chưa có nhật ký hoạt động nào.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {log.actor}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: DETAIL & WORKFLOW HANDOFF (SECTION 12 & 13 SPEC 14.TXT)          */}
      {/* ======================================================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Quản lý đề bài dịch vụ #{selectedRequest.id}
                </span>
                <h3 className="text-lg font-black font-heading mt-0.5">
                  {selectedRequest.customerName} - {selectedRequest.companyName}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs (Section 17: 9 Detail Tabs) */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 overflow-x-auto text-xs font-bold gap-1 sm:gap-2">
              <button
                onClick={() => setModalTab('overview')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'overview' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Tổng quan
              </button>
              <button
                onClick={() => setModalTab('scope')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'scope' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Đề bài
              </button>
              <button
                onClick={() => setModalTab('organization')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'organization' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Doanh nghiệp
              </button>
              <button
                onClick={() => setModalTab('files')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'files' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Files ({selectedRequest.attachments?.length || 0})
              </button>
              <button
                onClick={() => setModalTab('proposal')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'proposal' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                5. Báo giá
              </button>
              <button
                onClick={() => setModalTab('tasks')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'tasks' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                6. Tasks ({selectedRequest.tasks?.length || 0})
              </button>
              <button
                onClick={() => setModalTab('timeline')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'timeline' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                7. Timeline
              </button>
              <button
                onClick={() => setModalTab('result')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'result' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                8. Result & Program
              </button>
              <button
                onClick={() => setModalTab('audit')}
                className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                  modalTab === 'audit' 
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                9. Audit ({requestAuditLogs.length})
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
              
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* Duplicate Flag Alert (Section 12 Spec 17.txt) */}
              {selectedRequest.duplicateStatus === 'POSSIBLE_DUPLICATE' && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-amber-900 block font-bold uppercase tracking-wider">
                      CỜ CẢNH BÁO TRÙNG LẶP (POSSIBLE_DUPLICATE)
                    </strong>
                    <p className="text-amber-800 mt-1 leading-relaxed">
                      {selectedRequest.duplicateNote || 'Đề bài này có thông tin liên hệ tương đồng với một yêu cầu vừa gửi trong vòng 48h. Vui lòng rà soát trước khi triển khai hoặc lập báo giá.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 1: OVERVIEW & STATUS FORM (SECTION 10 & 11) */}
              {/* ============================================================= */}
              {modalTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Khách hàng / Liên hệ</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.customerName || selectedRequest.contactName}</p>
                      <p className="text-slate-600">{selectedRequest.phone || selectedRequest.contactPhone} • {selectedRequest.email || selectedRequest.contactEmail}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Đơn vị & Địa bàn</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.companyName}</p>
                      <p className="text-slate-600">{selectedRequest.location || 'Chưa cung cấp địa bàn'}</p>
                    </div>

                    <div className="md:col-span-2 pt-2 border-t border-slate-200">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Dịch vụ yêu cầu & Mã công khai</span>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {selectedRequest.publicCode || selectedRequest.id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-xs">
                          {selectedRequest.serviceNames?.[0] || selectedRequest.serviceType}
                        </span>
                        {selectedRequest.budget && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                            Ngân sách: {selectedRequest.budget}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Cập nhật Workflow (Section 10 & 11 Spec 17.txt) */}
                  <form onSubmit={handleUpdateRequest} className="space-y-4 border-t border-slate-200 pt-5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 font-heading">
                      Cập Nhật Trạng Thái & Điều Phối (Sections 10 & 11)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Trạng thái xử lý (Status) *
                        </label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {FORM_ENGINE_STATUSES.map(st => (
                            <option key={st.id} value={st.id}>{st.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Người phụ trách (Owner) *
                        </label>
                        <input
                          type="text"
                          value={editOwner}
                          onChange={e => setEditOwner(e.target.value)}
                          placeholder="VD: Đặng Tuấn Kiệt (Head of Matchmaking Desk)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* RULE SECTION 10: NẾU CANCELLED BẮT BUỘC NHẬP REASON */}
                      {editStatus === 'CANCELLED' && (
                        <div className="md:col-span-2 p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5">
                          <label className="block text-xs font-bold text-rose-900">
                            Lý do hủy yêu cầu (Bắt buộc theo Spec 17 - Mục 10) *
                          </label>
                          <textarea
                            rows={2}
                            value={cancelReason}
                            onChange={e => { setCancelReason(e.target.value); setCancelErrorMsg(''); }}
                            placeholder="Nhập cụ thể lý do hủy đề bài (khách chủ động hủy, không liên lạc được, ngoài phạm vi năng lực...)..."
                            className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                            required
                          />
                          {cancelErrorMsg && (
                            <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{cancelErrorMsg}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bước kế tiếp bắt buộc (Next Action - Section 11) *
                        </label>
                        <input
                          type="text"
                          value={editNextAction}
                          onChange={e => setEditNextAction(e.target.value)}
                          placeholder="VD: Gửi bản dự thảo kịch bản và báo giá sơ bộ qua Zalo / Email"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Hạn chót bước kế tiếp (SLA Next Action Deadline)
                        </label>
                        <input
                          type="datetime-local"
                          value={editNextActionAt}
                          onChange={e => setEditNextActionAt(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      {(selectedRequest.serviceType === 'MEDIA_BRANDING' || selectedRequest.serviceIds?.includes('srv-truyen-thong-doanh-nghiep')) ? (
                        <button
                          type="button"
                          onClick={() => {
                            createMediaProjectFromServiceRequest({ serviceRequest: selectedRequest });
                            setSelectedRequest(null);
                            setActiveTab('media');
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Video className="w-4 h-4 text-indigo-600" />
                          <span>Khởi tạo / Xem Media Project (P15)</span>
                        </button>
                      ) : <div />}

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        <Save className="w-4 h-4" /> Lưu cập nhật & Ghi Audit Log
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: SCOPE / ĐỀ BÀI (SECTION 4 & 5 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'scope' && (
                <div className="space-y-5 text-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mô tả yêu cầu chung</span>
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                      {selectedRequest.description || selectedRequest.objective || selectedRequest.scopeDetails || 'Chưa có mô tả'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Thời gian mong muốn</span>
                      <p className="font-bold text-slate-800 mt-1">{selectedRequest.desiredDate || selectedRequest.expectedDate || 'Thỏa thuận'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Ngân sách dự kiến</span>
                      <p className="font-bold text-slate-800 mt-1">{selectedRequest.budget || selectedRequest.budgetNote || 'Nhận đề xuất theo phạm vi'}</p>
                    </div>
                  </div>

                  {/* Dynamic Data Breakdown */}
                  {selectedRequest.dynamicData && Object.keys(selectedRequest.dynamicData).length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Đặc tả trường dữ liệu động ({selectedRequest.serviceType})
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(selectedRequest.dynamicData).map(([k, v]) => (
                          <div key={k} className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{k}</span>
                            <p className="text-xs font-medium text-slate-800">
                              {Array.isArray(v) ? v.join(', ') : (typeof v === 'boolean' ? (v ? 'Có' : 'Không') : String(v || 'N/A'))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.existingResources && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Nguồn lực doanh nghiệp đã có</span>
                      <p className="text-slate-800 mt-1">{selectedRequest.existingResources}</p>
                    </div>
                  )}

                  {selectedRequest.ccuSupportNeeded && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Phần việc cần CCU hỗ trợ</span>
                      <p className="text-slate-800 mt-1">{selectedRequest.ccuSupportNeeded}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: ORGANIZATION (SECTION 4 & 20 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'organization' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tên Doanh nghiệp / Tổ chức</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedRequest.companyName}</p>
                      {selectedRequest.organizationId && (
                        <span className="inline-block mt-1 font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Org ID: {selectedRequest.organizationId}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Địa bàn / KCN</span>
                      <p className="font-bold text-slate-800 mt-0.5">{selectedRequest.location || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Người liên hệ đại diện</span>
                      <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.customerName || selectedRequest.contactName}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{selectedRequest.roleTitle || 'Đại diện doanh nghiệp'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Kênh liên hệ xác thực</span>
                      <p className="text-slate-800 font-semibold mt-0.5">SĐT: {selectedRequest.phone || selectedRequest.contactPhone}</p>
                      <p className="text-slate-800 font-semibold mt-0.5">Email: {selectedRequest.email || selectedRequest.contactEmail}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-[11px] text-blue-900">
                    <span className="font-bold block">Context nguồn phát sinh yêu cầu:</span>
                    <p>Trang nguồn: {selectedRequest.sourcePage || '/yeu-cau-dich-vu'}</p>
                    {selectedRequest.sourceProgramId && <p>Chương trình liên kết: {selectedRequest.sourceProgramId}</p>}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: FILES (SECTION 14 SPEC 17.TXT - PRIVATE BY DEFAULT) */}
              {/* ============================================================= */}
              {modalTab === 'files' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 uppercase">Tệp tài liệu đính kèm ({selectedRequest.attachments?.length || 0})</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      Private by default / Protected Storage
                    </span>
                  </div>

                  {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {selectedRequest.attachments.map((f, i) => (
                        <div key={i} className="p-3 bg-white flex items-center justify-between gap-3 hover:bg-slate-50">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">{f.name || 'File đính kèm'}</p>
                              <span className="text-[10px] text-slate-400">{f.size || 'N/A'} • Uploaded: {new Date().toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
                            Signed URL Valid
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500">
                      Không có tệp đính kèm nào với đề bài này.
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 5: PROPOSAL / QUOTATION (SECTION 19 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'proposal' && (
                <div className="space-y-5 text-xs">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950 space-y-1.5">
                    <h4 className="font-black uppercase flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-purple-700" />
                      <span>Quản Lý Báo Giá & Đề Xuất (Section 19 Spec 17.txt)</span>
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      "ServiceRequest status và proposal status là hai state hoàn toàn tách nhau. Không đưa quotation vào public profile."
                    </p>
                  </div>

                  <form onSubmit={handleSaveProposal} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Trạng thái Proposal (7 Bước) *
                        </label>
                        <select
                          value={proposalStatus}
                          onChange={e => setProposalStatus(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                        >
                          {Object.values(PROPOSAL_STATUSES).map(ps => (
                            <option key={ps} value={ps}>{ps}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Tổng dự toán ngân sách (Total Amount)
                        </label>
                        <input
                          type="text"
                          value={proposalAmount}
                          onChange={e => setProposalAmount(e.target.value)}
                          placeholder="VD: 45.000.000 VNĐ"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-700 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Hạng mục đầu ra cam kết (1 dòng / hạng mục)
                        </label>
                        <textarea
                          rows={3}
                          value={proposalDeliverables}
                          onChange={e => setProposalDeliverables(e.target.value)}
                          placeholder="Hạng mục 1: Khảo sát danh mục...&#10;Hạng mục 2: Lập danh sách 15 NCC...&#10;Hạng mục 3: Tổ chức phiên gặp 1:1..."
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Thời hạn hiệu lực (Valid Until)
                        </label>
                        <input
                          type="date"
                          value={proposalValidUntil}
                          onChange={e => setProposalValidUntil(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                        />
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                          <input
                            type="checkbox"
                            checked={proposalShared}
                            onChange={e => setProposalShared(e.target.checked)}
                            className="rounded text-purple-600 focus:ring-0 w-4 h-4"
                          />
                          <span>Chia sẻ Proposal với Khách hàng (Hiển thị tại /tai-khoan/yeu-cau-dich-vu)</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                      >
                        <Save className="w-4 h-4" /> Lưu Proposal & Ghi Audit Log
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 6: TASKS (SECTION 7 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'tasks' && (
                <div className="space-y-5 text-xs">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-1">
                    <span className="font-bold block">Quản lý đầu việc thực thi (Task Queue)</span>
                    <p className="text-[11px]">Mỗi yêu cầu dịch vụ được tiếp nhận luôn đi kèm ít nhất 1 đầu việc ban đầu để rà soát mục tiêu.</p>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-700 uppercase">Danh sách đầu việc ({selectedRequest.tasks?.length || 0}):</h5>
                    {selectedRequest.tasks && selectedRequest.tasks.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                        {selectedRequest.tasks.map((task, idx) => (
                          <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">{task.title}</span>
                              <span className="text-[10px] text-slate-500">Phụ trách: <strong>{task.assignee}</strong> • Hạn: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : 'Trong ngày'}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {task.status || 'PENDING'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">Chưa có đầu việc nào được tạo.</p>
                    )}
                  </div>

                  {/* Add Task Form */}
                  <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <span className="font-bold text-slate-800 uppercase block">Thêm đầu việc mới:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          placeholder="Mô tả công việc cần xử lý..."
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={newTaskDueDate}
                          onChange={e => setNewTaskDueDate(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tạo Task
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 7: TIMELINE (SECTION 10 & 16 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'timeline' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase">Lịch sử thay đổi trạng thái (Status History)</h4>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedRequest.statusHistory && selectedRequest.statusHistory.length > 0 ? (
                      selectedRequest.statusHistory.map((h, i) => (
                        <div key={i} className="relative space-y-1">
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {h.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(h.changedAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{h.note || 'Cập nhật trạng thái'}</p>
                          <span className="text-[10px] text-slate-400 block">Thực hiện: {h.changedBy || 'Hệ thống'}</span>
                        </div>
                      ))
                    ) : (
                      <div className="relative space-y-1">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                        <span className="font-bold text-slate-900">Tiếp nhận đề bài</span>
                        <p className="text-slate-500 text-[11px]">Đã ghi nhận yêu cầu và khởi tạo chu trình xử lý.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 8: RESULT & PROGRAM (SPEC 14 & SPEC 17) */}
              {/* ============================================================= */}
              {modalTab === 'result' && (
                <div className="space-y-6 text-xs">
                  {/* Coordinator Handoff Form */}
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                    <h4 className="font-black uppercase text-blue-950 flex items-center gap-1.5">
                      <ArrowLeftRight className="w-4 h-4 text-blue-700" />
                      <span>Bàn giao Điều Phối Viên (Coordinator Handoff - Spec 14)</span>
                    </h4>
                    <form onSubmit={handleCoordinatorHandoff} className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Chỉ định Điều phối viên *</label>
                        <select
                          value={newCoordinator}
                          onChange={e => setNewCoordinator(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                        >
                          <option value="Lê Thu Trang (Regional Coordinator Desk)">Lê Thu Trang (Regional Coordinator Desk)</option>
                          <option value="Trần Đình Trọng (Production & Procurement Lead)">Trần Đình Trọng (Production & Procurement Lead)</option>
                          <option value="Đặng Tuấn Kiệt (Head of Matchmaking Desk)">Đặng Tuấn Kiệt (Head of Matchmaking Desk)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Ghi chú bàn giao</label>
                        <textarea
                          rows={2}
                          value={handoffNote}
                          onChange={e => setHandoffNote(e.target.value)}
                          placeholder="Nội dung bàn giao nghiệp vụ..."
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" /> Bàn giao & Chuyển sang IN_PROGRESS
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Create Program Form */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                    <h4 className="font-black uppercase text-indigo-950 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-700" />
                      <span>Khởi tạo Program chính thức trên /chuong-trinh (Spec 14)</span>
                    </h4>
                    {selectedRequest.programId ? (
                      <div className="p-3 bg-white border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center justify-between">
                        <span>Đã liên kết Program: {selectedRequest.programId}</span>
                        <a
                          href={`/chuong-trinh/${selectedRequest.programId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Xem trang</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <form onSubmit={handleCreateProgram} className="space-y-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên chương trình kết nối *</label>
                          <input
                            type="text"
                            value={programTitle}
                            onChange={e => setProgramTitle(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Thời gian dự kiến</label>
                            <input
                              type="text"
                              value={programDate}
                              onChange={e => setProgramDate(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Địa điểm / KCN</label>
                            <input
                              type="text"
                              value={programLocation}
                              onChange={e => setProgramLocation(e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                          >
                            <Play className="w-4 h-4" /> Khởi tạo Program
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 9: AUDIT LOG (SECTION 21 SPEC 17.TXT) */}
              {/* ============================================================= */}
              {modalTab === 'audit' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 font-heading">
                    Nhật ký kiểm toán biến động của đề bài #{selectedRequest.publicCode || selectedRequest.id}
                  </h4>

                  {requestAuditLogs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl">
                      Chưa có ghi nhận biến động bổ sung cho đề bài này.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {requestAuditLogs.map(log => (
                        <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-blue-700 text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(log.timestamp).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs">{log.details}</p>
                          <span className="text-[10px] text-slate-500 block">Thực hiện bởi: <strong>{log.actor}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE CONFIG */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Cấu hình dịch vụ #{editingService.id}
                </span>
                <h3 className="text-lg font-black font-heading mt-0.5">
                  {editingService.name}
                </h3>
              </div>
              <button 
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên dịch vụ</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={e => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái (Status)</label>
                  <select
                    value={editingService.status}
                    onChange={e => setEditingService({ ...editingService, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="ACTIVE">ACTIVE - Hoạt động</option>
                    <option value="PAUSED">PAUSED - Tạm dừng</option>
                    <option value="INACTIVE">INACTIVE - Chưa kích hoạt</option>
                    <option value="DRAFT">DRAFT - Bản nháp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú giá (Không fake price)</label>
                  <input
                    type="text"
                    value={editingService.pricingNote}
                    onChange={e => setEditingService({ ...editingService, pricingNote: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                    placeholder="VD: Nhận báo giá theo phạm vi"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Người phụ trách (Owner)</label>
                <input
                  type="text"
                  value={editingService.ownerName}
                  onChange={e => setEditingService({ ...editingService, ownerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" /> Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
