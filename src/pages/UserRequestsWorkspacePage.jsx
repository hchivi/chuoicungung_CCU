import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText, Search, ArrowRight, Clock, CheckCircle2, AlertCircle,
  Building2, User, Phone, Mail, MapPin, Calendar, ShieldCheck,
  ChevronRight, RefreshCw, Layers, Award, Download, ArrowLeft,
  Package, Video, Radio, Handshake, DollarSign, Send, Check,
  X, Filter, Eye, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getAllServiceRequests 
} from '../data/servicesData';
import {
  SERVICE_ENGINE_TYPES,
  FORM_ENGINE_STATUSES,
  PROPOSAL_STATUSES,
  getUserServiceRequests,
  getServiceRequestByCodeOrId
} from '../data/serviceFormEngineData';

export default function UserRequestsWorkspacePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const codeParam = searchParams.get('code') || searchParams.get('id') || '';
  const [searchQuery, setSearchQuery] = useState(codeParam);
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'owner' | 'files' | 'proposal' | 'timeline' | 'result'
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Lấy thông tin phiên đăng nhập hiện tại
  const currentUser = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }, []);

  // Tải danh sách yêu cầu dịch vụ với cơ chế bảo mật chống IDOR / Data Leakage (Mục 13, 30, 31, 82)
  useEffect(() => {
    const list = getAllServiceRequests();
    setAllRequests(list);

    // 1. Trường hợp có mã tra cứu cụ thể trên URL (?code=DV-... hoặc ?id=...)
    if (codeParam) {
      const found = getServiceRequestByCodeOrId(codeParam);
      if (found) {
        setSelectedRequest(found);
        setSearchQuery(found.publicCode || found.id);
        setFilteredRequests([found]);
      } else {
        setSelectedRequest(null);
        setFilteredRequests([]);
      }
      return;
    }

    // 2. Trường hợp người dùng đã đăng nhập với tổ chức cụ thể
    if (currentUser?.organizationId || currentUser?.phone || currentUser?.email) {
      const userOrgId = currentUser.organizationId;
      const userPhone = currentUser.phone;
      const userEmail = currentUser.email;

      const myRequests = list.filter(r => 
        (userOrgId && r.organizationId === userOrgId) ||
        (userPhone && (r.phone === userPhone || r.contactPhone === userPhone)) ||
        (userEmail && (r.email === userEmail || r.contactEmail === userEmail))
      );

      setFilteredRequests(myRequests);
      setSelectedRequest(myRequests.length > 0 ? myRequests[0] : null);
      return;
    }

    // 3. Khách vãng lai chưa đăng nhập và không truyền mã:
    // TUYỆT ĐỐI KHÔNG tự động hiển thị đơn hàng của người khác (Không auto gán list[0])
    setFilteredRequests([]);
    setSelectedRequest(null);
  }, [codeParam, currentUser]);

  // Bộ lọc tìm kiếm: Chỉ cho phép tra cứu nếu đã đăng nhập hoặc tìm đúng mã / SĐT
  useEffect(() => {
    let result = [...allRequests];

    if (currentUser?.organizationId || currentUser?.phone || currentUser?.email) {
      const userOrgId = currentUser.organizationId;
      const userPhone = currentUser.phone;
      const userEmail = currentUser.email;
      result = result.filter(r => 
        (userOrgId && r.organizationId === userOrgId) ||
        (userPhone && (r.phone === userPhone || r.contactPhone === userPhone)) ||
        (userEmail && (r.email === userEmail || r.contactEmail === userEmail))
      );
    } else if (!codeParam && !searchQuery.trim()) {
      // Chưa đăng nhập và chưa tìm kiếm: Giữ danh sách trống
      setFilteredRequests([]);
      return;
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(r => 
        (r.publicCode && r.publicCode.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.contactPhone && r.contactPhone.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.contactEmail && r.contactEmail.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q))
      );
    }

    setFilteredRequests(result);

    // Keep selected request in sync
    if (selectedRequest) {
      const matched = result.find(r => r.id === selectedRequest.id || r.publicCode === selectedRequest.publicCode);
      if (matched) {
        setSelectedRequest(matched);
      } else {
        setSelectedRequest(result.length > 0 ? result[0] : null);
      }
    } else {
      setSelectedRequest(result.length > 0 ? result[0] : null);
    }
  }, [allRequests, searchQuery, statusFilter, currentUser, codeParam]);

  // SEO
  useEffect(() => {
    document.title = 'Theo Dõi Yêu Cầu Dịch Vụ | CHUOICUNGUNG.COM';
  }, []);

  const selectRequest = (req) => {
    setSelectedRequest(req);
    setSearchParams({ code: req.publicCode || req.id });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const getStatusMeta = (statusId) => {
    return FORM_ENGINE_STATUSES.find(s => s.id === statusId) || {
      id: statusId,
      name: statusId,
      color: 'slate',
      step: 1
    };
  };

  const getServiceTypeMeta = (typeKey) => {
    return SERVICE_ENGINE_TYPES[typeKey] || SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ==================================================================== */}
      {/* HEADER SECTION (SECTION 16 SPEC 17.TXT) */}
      {/* ==================================================================== */}
      <div className="bg-gradient-to-b from-[#0A2540] to-[#06182B] text-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Link to="/" className="hover:text-white transition">Trang chủ</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <Link to="/dich-vu" className="hover:text-white transition">Dịch vụ</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-blue-400 font-semibold">Theo dõi yêu cầu</span>
            </div>

            <Link
              to="/yeu-cau-dich-vu"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs"
            >
              <span>Gửi yêu cầu dịch vụ mới</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Account Workspace • /tai-khoan/yeu-cau-dich-vu
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              THEO DÕI YÊU CẦU DỊCH VỤ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tra cứu tiến độ xử lý đề bài theo mã định danh công khai <strong>DV-2026-xxxxx</strong>. 
              Xem trực tiếp người phụ trách, bước kế tiếp, dự thảo phương án và kết quả nghiệm thu được chia sẻ.
            </p>
          </div>

          {/* Quick Search & Filter Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Nhập mã DV-2026-xxxxx, tên công ty, số điện thoại hoặc email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả trạng thái ({allRequests.length})</option>
                {FORM_ENGINE_STATUSES.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN WORKSPACE CONTENT */}
      {/* ==================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================================================================ */}
          {/* LEFT COLUMN: REQUESTS LIST (4 cols) */}
          {/* ================================================================ */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                Danh sách yêu cầu ({filteredRequests.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Sắp xếp: Mới nhất
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Không tìm thấy yêu cầu nào phù hợp từ khóa.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                filteredRequests.map(req => {
                  const isSelected = selectedRequest && (selectedRequest.id === req.id || selectedRequest.publicCode === req.publicCode);
                  const statusMeta = getStatusMeta(req.status);
                  const serviceMeta = getServiceTypeMeta(req.serviceType);

                  return (
                    <button
                      key={req.id}
                      onClick={() => selectRequest(req)}
                      className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-blue-50/70 border-l-4 border-blue-600' 
                          : 'hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                          {req.publicCode || req.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-slate-900 line-clamp-1">
                        {req.companyName || req.customerName}
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{req.serviceNames?.[0] || serviceMeta.name}</span>
                      </div>

                      <div className="pt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {statusMeta.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                          {req.owner ? req.owner.split('(')[0].trim() : 'Đang điều phối'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: REQUEST DETAIL VIEW (8 cols) */}
          {/* ================================================================ */}
          <div className="lg:col-span-8 space-y-6">
            {selectedRequest ? (
              <div className="space-y-6">
                
                {/* 1. Header Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm sm:text-base font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                          {selectedRequest.publicCode || selectedRequest.id}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {getStatusMeta(selectedRequest.status).name}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading mt-2">
                        {selectedRequest.serviceNames?.[0] || 'Dịch vụ kết nối cung ứng B2B'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Đơn vị đề xuất: <strong className="text-slate-800">{selectedRequest.companyName}</strong> 
                        {selectedRequest.contactName && ` • Người liên hệ: ${selectedRequest.contactName}`}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium block">Thời điểm gửi yêu cầu</span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Pipeline Progress Indicator (Section 10) */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tiến độ xử lý 5 bước chuẩn hóa:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {[
                        { step: 1, label: 'Tiếp nhận', active: ['NEW', 'NEED_MORE_INFO', 'PREPARING_PROPOSAL', 'PROPOSAL_SENT', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_ACCEPTANCE', 'COMPLETED'].includes(selectedRequest.status) },
                        { step: 2, label: 'Lập đề xuất', active: ['PREPARING_PROPOSAL', 'PROPOSAL_SENT', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_ACCEPTANCE', 'COMPLETED'].includes(selectedRequest.status) },
                        { step: 3, label: 'Chấp thuận', active: ['ACCEPTED', 'IN_PROGRESS', 'WAITING_ACCEPTANCE', 'COMPLETED'].includes(selectedRequest.status) },
                        { step: 4, label: 'Triển khai', active: ['IN_PROGRESS', 'WAITING_ACCEPTANCE', 'COMPLETED'].includes(selectedRequest.status) },
                        { step: 5, label: 'Nghiệm thu', active: ['WAITING_ACCEPTANCE', 'COMPLETED'].includes(selectedRequest.status) }
                      ].map((item) => (
                        <div key={item.step} className="space-y-1 text-center">
                          <div className={`h-2 rounded-full transition-all ${
                            item.active ? 'bg-blue-600' : 'bg-slate-200'
                          }`} />
                          <span className={`text-[10px] font-bold block truncate ${
                            item.active ? 'text-blue-700' : 'text-slate-400'
                          }`}>
                            {item.step}. {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Detail Tabs (Section 16: Mã, Dịch vụ, Ngày gửi, Status, Owner, Next action, Files, Proposal, Timeline, Result) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 overflow-x-auto text-xs font-bold gap-1 sm:gap-2">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'overview'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Tổng quan đề bài
                    </button>
                    <button
                      onClick={() => setActiveTab('owner')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'owner'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Đầu mối & Bước kế tiếp
                    </button>
                    <button
                      onClick={() => setActiveTab('files')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'files'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Tệp đính kèm ({selectedRequest.attachments?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('proposal')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'proposal'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Phương án & Báo giá
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'timeline'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Tiến trình mốc thời gian
                    </button>
                    <button
                      onClick={() => setActiveTab('result')}
                      className={`py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
                        activeTab === 'result'
                          ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Kết quả nghiệm thu
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 text-xs text-slate-700">
                    
                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doanh nghiệp / Tổ chức</span>
                            <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.companyName}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">{selectedRequest.location || 'Chưa cập nhật địa bàn'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Người đại diện liên hệ</span>
                            <p className="font-bold text-slate-900 mt-0.5">{selectedRequest.contactName || selectedRequest.customerName}</p>
                            <p className="text-slate-600 text-[11px] mt-0.5">{selectedRequest.contactPhone || selectedRequest.phone} • {selectedRequest.contactEmail || selectedRequest.email}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian mong muốn</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{selectedRequest.desiredDate || selectedRequest.expectedDate || 'Thỏa thuận sau khi khảo sát'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngân sách dự kiến</span>
                            <p className="font-semibold text-slate-800 mt-0.5">{selectedRequest.budget || selectedRequest.budgetNote || 'Nhận đề xuất theo phạm vi'}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Mô tả nội dung công việc & Mục tiêu
                          </h4>
                          <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                            {selectedRequest.description || selectedRequest.objective || selectedRequest.scopeDetails || 'Chưa có mô tả chi tiết'}
                          </div>
                        </div>

                        {/* Dynamic Data Breakdown (A, B, C, D, E) */}
                        {selectedRequest.dynamicData && Object.keys(selectedRequest.dynamicData).length > 0 && (
                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                              Đặc tả kỹ thuật theo phân hệ nghiệp vụ ({selectedRequest.serviceType})
                            </h4>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 font-normal">
                              {Object.entries(selectedRequest.dynamicData).map(([key, val]) => {
                                if (val === null || val === undefined || val === '') return null;
                                const displayVal = Array.isArray(val) ? val.join(', ') : (typeof val === 'boolean' ? (val ? 'Có yêu cầu' : 'Không') : String(val));
                                return (
                                  <div key={key} className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                                    <p className="text-xs text-slate-800 font-medium">{displayVal}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: OWNER & NEXT ACTION */}
                    {activeTab === 'owner' && (
                      <div className="space-y-6">
                        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Chuyên viên phụ trách tiếp nhận (Owner)</span>
                              <h4 className="text-sm font-black text-slate-900 mt-0.5">
                                {selectedRequest.owner || 'Ban điều phối dịch vụ CHUOICUNGUNG.COM'}
                              </h4>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                Bộ phận điều phối: <strong>{selectedRequest.desk || 'Partnership & Operations Desk'}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-blue-200/60 space-y-2">
                            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                              Bước kế tiếp đang triển khai (Next Action):
                            </span>
                            <div className="p-3 bg-white rounded-xl border border-blue-200 text-slate-900 font-bold text-xs">
                              {selectedRequest.nextAction || 'Chuyên viên đang rà soát đề bài và liên hệ trong vòng 24h'}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Hạn xử lý cam kết: {selectedRequest.nextActionAt ? new Date(selectedRequest.nextActionAt).toLocaleString('vi-VN') : 'Trong vòng 24h làm việc'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600 text-[11px] leading-relaxed">
                          <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Cam kết chuẩn mực dịch vụ nền tảng:</span>
                          </div>
                          <p>
                            Mọi yêu cầu tiếp nhận trên hệ thống đều có chuyên viên phụ trách và hạn xử lý rõ ràng. 
                            Chúng tôi không đưa ra mức giá hay cam kết kết quả trước khi thống nhất phạm vi kỹ thuật với doanh nghiệp.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: FILES (PROTECTED STORAGE) */}
                    {activeTab === 'files' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            Tệp tài liệu đính kèm ({selectedRequest.attachments?.length || 0})
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                            <span>Protected Storage • Private by default</span>
                          </span>
                        </div>

                        {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                            {selectedRequest.attachments.map((file, idx) => (
                              <div key={idx} className="p-3.5 bg-white flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-xs">{file.name || 'Tài liệu dự án'}</p>
                                    <p className="text-[10px] text-slate-400">
                                      {file.size || 'N/A'} • Tải lên: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('vi-VN') : 'Mới'}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                  Bảo mật nội bộ
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                            <p className="text-xs text-slate-500 font-medium">Chưa có tệp tài liệu nào được đính kèm với yêu cầu này.</p>
                          </div>
                        )}

                        <p className="text-[11px] text-slate-400 italic">
                          * Lưu ý: Tệp đính kèm được phân quyền nghiêm ngặt theo chủ sở hữu và chuyên viên phụ trách. Không công khai qua liên kết ngoài.
                        </p>
                      </div>
                    )}

                    {/* TAB 4: PROPOSAL / QUOTATION */}
                    {activeTab === 'proposal' && (
                      <div className="space-y-4">
                        {selectedRequest.proposal && selectedRequest.proposal.sharedWithCustomer ? (
                          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                                  {selectedRequest.proposal.proposalId || 'PROPOSAL-V1'}
                                </span>
                                <h4 className="text-sm font-black text-slate-900 mt-1">
                                  {selectedRequest.proposal.title || 'Phương án dịch vụ & Dự toán chi phí'}
                                </h4>
                              </div>
                              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                                Trạng thái: {selectedRequest.proposal.status || 'SENT'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Dự toán ngân sách:</span>
                                <p className="text-base font-black text-blue-700 font-mono mt-0.5">
                                  {selectedRequest.proposal.totalAmount || 'Liên hệ làm rõ'}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] font-bold uppercase">Thời hạn hiệu lực:</span>
                                <p className="font-bold text-slate-800 mt-0.5">
                                  {selectedRequest.proposal.validUntil ? new Date(selectedRequest.proposal.validUntil).toLocaleDateString('vi-VN') : '14 ngày'}
                                </p>
                              </div>
                            </div>

                            {selectedRequest.proposal.deliverables && (
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hạng mục triển khai & Bàn giao:</span>
                                <ul className="space-y-1 text-xs text-slate-700">
                                  {selectedRequest.proposal.deliverables.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {selectedRequest.proposal.note && (
                              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg">
                                Ghi chú: {selectedRequest.proposal.note}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                            <Clock className="w-8 h-8 text-indigo-500 mx-auto" />
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Đang trong giai đoạn khảo sát & Lập phương án
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                              Đầu mối phụ trách đang đối soát yêu cầu kỹ thuật và lên dự thảo phương án. 
                              Bảng đề xuất và báo giá chi tiết sẽ xuất hiện tại đây ngay khi hoàn tất duyệt nội bộ.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 5: TIMELINE (NO INTERNAL NOTES) */}
                    {activeTab === 'timeline' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            Nhật ký tiến trình công khai
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            Cập nhật theo thời gian thực
                          </span>
                        </div>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                          {selectedRequest.statusHistory && selectedRequest.statusHistory.length > 0 ? (
                            selectedRequest.statusHistory.map((h, idx) => (
                              <div key={idx} className="relative space-y-1">
                                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-900">
                                    {getStatusMeta(h.status).name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(h.changedAt).toLocaleString('vi-VN')}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                  {h.note || 'Cập nhật trạng thái tiến trình xử lý'}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="relative space-y-1">
                              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                              <span className="font-bold text-xs text-slate-900">Tiếp nhận yêu cầu dịch vụ</span>
                              <p className="text-xs text-slate-500">Đề bài đã được ghi nhận trên hệ thống và chuyển giao đầu mối.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 6: RESULT */}
                    {activeTab === 'result' && (
                      <div className="space-y-4">
                        {['COMPLETED', 'WAITING_ACCEPTANCE'].includes(selectedRequest.status) ? (
                          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                              <Award className="w-5 h-5 text-emerald-600" />
                              <span>Đã có báo cáo kết quả & Biên bản bàn giao</span>
                            </div>
                            <p className="text-xs text-emerald-700 leading-relaxed">
                              Đầu việc kết nối / thực hiện đã hoàn thành các hạng mục theo phạm vi cam kết. 
                              Biên bản nghiệm thu và danh mục tài liệu đã được lưu trữ an toàn.
                            </p>
                          </div>
                        ) : (
                          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Chưa có kết quả nghiệm thu
                            </h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                              Kết quả và biên bản bàn giao chỉ hiển thị khi chương trình hoàn tất hoặc khách hàng nghiệm thu dịch vụ.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Vui lòng chọn hoặc tra cứu một yêu cầu dịch vụ
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sử dụng thanh tìm kiếm phía trên để nhập mã DV-2026-xxxxx hoặc số điện thoại người liên hệ để xem tiến độ.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
