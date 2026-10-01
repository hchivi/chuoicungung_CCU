import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, Eye, CheckCircle2, AlertCircle, 
  X, Clock, Send, ShieldCheck, ChevronRight, UserCheck, 
  Building2, MapPin, Calendar, Layers, FileText, ArrowLeft,
  ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, RefreshCw
} from 'lucide-react';
import { 
  getAllMasterRequirements,
  getAllResponses,
  adminReviewSupplierResponse,
  adminUpdateRequirementVisibility,
  getAllAuditLogs
} from '../../data/requirementsData';

export default function AdminDemandsManagement({ initialRequirementId = null }) {
  const [demands, setDemands] = useState([]);
  const [responses, setResponses] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('ALL'); // ALL | PUBLIC_SUMMARY | ONLY_MATCHED | PRIVATE
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Detail view state
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | responses | audit_trail
  
  // Rejection reason modal
  const [rejectModal, setRejectModal] = useState({ isOpen: false, responseId: null, reason: '' });

  const loadData = () => {
    const allDemands = getAllMasterRequirements();
    const allResponses = getAllResponses();
    const logs = getAllAuditLogs();
    setDemands(allDemands);
    setResponses(allResponses);
    setAuditLogs(logs);

    if (initialRequirementId) {
      const found = allDemands.find(d => d.id === initialRequirementId || d.publicCode === initialRequirementId);
      if (found) setSelectedDemand(found);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialRequirementId]);

  // Lọc danh sách nhu cầu
  const filteredDemands = demands.filter(d => {
    if (visibilityFilter !== 'ALL' && d.visibility !== visibilityFilter) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (d.title || '').toLowerCase().includes(q);
      const matchCode = (d.publicCode || '').toLowerCase().includes(q);
      const matchCompany = (d.buyerInfo?.companyName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCompany) return false;
    }
    return true;
  });

  // Xử lý thay đổi visibility
  const handleVisibilityChange = (demandId, newVisibility) => {
    adminUpdateRequirementVisibility(demandId, newVisibility, 'Admin Master');
    loadData();
    if (selectedDemand && selectedDemand.id === demandId) {
      setSelectedDemand(prev => ({ ...prev, visibility: newVisibility }));
    }
  };

  // Xử lý Shortlist
  const handleShortlistResponse = (responseId) => {
    adminReviewSupplierResponse({
      responseId,
      newStatus: 'SHORTLISTED',
      reason: 'Đạt yêu cầu năng lực kỹ thuật và đã được Ban điều phối phê duyệt.',
      actor: 'Admin Master'
    });
    loadData();
  };

  // Xử lý Yêu cầu bổ sung
  const handleRequestMoreInfo = (responseId) => {
    const note = prompt('Nhập nội dung cần nhà cung ứng bổ sung (VD: Gửi thêm bảng test lực kéo mẫu vải):');
    if (!note) return;
    adminReviewSupplierResponse({
      responseId,
      newStatus: 'NEED_MORE_INFO',
      reason: note,
      actor: 'Admin Master'
    });
    loadData();
  };

  // Xử lý Không phù hợp (bắt buộc nhập lý do - Section 16)
  const handleConfirmReject = () => {
    if (!rejectModal.reason.trim()) {
      alert('Vui lòng nhập lý do không phù hợp trước khi xác nhận.');
      return;
    }
    adminReviewSupplierResponse({
      responseId: rejectModal.responseId,
      newStatus: 'NOT_SUITABLE',
      reason: rejectModal.reason,
      actor: 'Admin Master'
    });
    setRejectModal({ isOpen: false, responseId: null, reason: '' });
    loadData();
  };

  // Lấy responses của nhu cầu được chọn
  const demandResponses = selectedDemand 
    ? responses.filter(r => r.requirementId === selectedDemand.id)
    : [];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Quản trị Nhu cầu B2B & Phản hồi Nhà cung ứng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối các nhu cầu công khai (PUBLIC_SUMMARY), thẩm định hồ sơ "Tôi có khả năng đáp ứng" và Shortlist kết nối.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Làm mới dữ liệu
        </button>
      </div>

      {selectedDemand ? (
        /* DETAIL VIEW: /admin/nhu-cau/:id */
        <div className="space-y-6">
          
          {/* Back button & Title Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <button
              onClick={() => setSelectedDemand(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại danh sách nhu cầu
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                    {selectedDemand.publicCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    selectedDemand.visibility === 'PUBLIC_SUMMARY' ? 'bg-emerald-100 text-emerald-800' :
                    selectedDemand.visibility === 'ONLY_MATCHED' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {selectedDemand.visibility}
                  </span>
                  <span className="text-xs text-slate-400">
                    Đăng ngày: {new Date(selectedDemand.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  {selectedDemand.title}
                </h3>
              </div>

              {/* Visibility Switcher (Admin Control - Section 15) */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Phạm vi công bố:</span>
                <select
                  value={selectedDemand.visibility}
                  onChange={(e) => handleVisibilityChange(selectedDemand.id, e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="PUBLIC_SUMMARY">PUBLIC_SUMMARY (Công khai tóm tắt trên Sàn)</option>
                  <option value="ONLY_MATCHED">ONLY_MATCHED (Chỉ ghép đôi nội bộ)</option>
                  <option value="PRIVATE">PRIVATE (Riêng tư nội bộ)</option>
                </select>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-slate-200 gap-6 pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                  activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Thông tin & Bản tóm tắt
              </button>
              <button
                onClick={() => setActiveTab('responses')}
                className={`pb-2.5 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'responses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>PHẢN HỒI NHÀ CUNG ỨNG</span>
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-mono">
                  {demandResponses.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('audit_trail')}
                className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                  activeTab === 'audit_trail' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Nhật ký kiểm duyệt (Audit Log)
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Public Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider font-heading flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  Bản tóm tắt công khai (Public Summary)
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Tiêu đề công khai:</span>
                    <strong className="text-slate-800">{selectedDemand.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tên Buyer công khai:</span>
                    <strong className="text-slate-800">{selectedDemand.buyerInfo?.buyerSummary || 'Nhà máy trong nước'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Địa bàn & KCN:</span>
                    <strong className="text-slate-800">{selectedDemand.province} - {selectedDemand.industrialPark || 'Toàn quốc'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Số lượng & Đơn vị:</span>
                    <strong className="text-slate-800">{selectedDemand.quantity} {selectedDemand.unit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Yêu cầu mẫu / khảo sát:</span>
                    <strong className="text-slate-800">
                      {selectedDemand.sampleRequired ? 'Cần mẫu đối chứng' : 'Không'} | {selectedDemand.surveyRequired ? 'Cần khảo sát xưởng' : 'Không'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mô tả tóm tắt:</span>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedDemand.publicSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Private Buyer Info Card (Chỉ Admin thấy - Bảo mật tuyệt đối) */}
              <div className="bg-white rounded-2xl border border-rose-200 p-6 space-y-4 shadow-xs relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-rose-700 uppercase tracking-wider font-heading flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    Dữ liệu nội bộ Buyer (TUYỆT ĐỐI BẢO MẬT)
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    INTERNAL ONLY
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Tên pháp nhân đầy đủ:</span>
                    <strong className="text-slate-900">{selectedDemand.buyerInfo?.companyName || 'Chưa cung cấp'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Người phụ trách thu mua:</span>
                    <strong className="text-slate-900">{selectedDemand.buyerInfo?.contactPerson || 'Bộ phận Thu mua'}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block">Số điện thoại:</span>
                      <strong className="text-slate-900">{selectedDemand.buyerInfo?.phone || 'Bảo mật'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Email:</span>
                      <strong className="text-slate-900">{selectedDemand.buyerInfo?.email || 'Bảo mật'}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngân sách nội bộ / Target Price:</span>
                    <strong className="text-emerald-700 font-mono">{selectedDemand.buyerInfo?.internalBudget || 'Chưa công bố'}</strong>
                  </div>
                  {selectedDemand.buyerInfo?.internalNotes && (
                    <div>
                      <span className="text-slate-400 block">Ghi chú nội bộ:</span>
                      <p className="text-slate-600 italic bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                        {selectedDemand.buyerInfo.internalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPPLIER RESPONSES (SECTION 16) */}
          {activeTab === 'responses' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-heading">
                    Danh sách Nhà Cung Ứng đã phản hồi ({demandResponses.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ban điều phối rà soát năng lực và quyết định đưa vào Shortlist kết nối.
                  </p>
                </div>
              </div>

              {demandResponses.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Chưa có nhà cung ứng nào gửi phản hồi cho nhu cầu này.
                </div>
              ) : (
                <div className="space-y-4">
                  {demandResponses.map((resp) => (
                    <div 
                      key={resp.id} 
                      className={`p-5 rounded-2xl border transition space-y-3 ${
                        resp.responseStatus === 'SHORTLISTED' ? 'bg-emerald-50/40 border-emerald-300' :
                        resp.responseStatus === 'NOT_SUITABLE' ? 'bg-slate-50 border-slate-200 opacity-60' :
                        'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Response Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            NCC
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs font-heading">
                              {resp.supplierName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Mã NCC: {resp.supplierOrganizationId} • Gửi lúc: {new Date(resp.submittedAt).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            resp.responseStatus === 'SHORTLISTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            resp.responseStatus === 'NEED_MORE_INFO' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            resp.responseStatus === 'NOT_SUITABLE' ? 'bg-rose-100 text-rose-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            Trạng thái: {resp.responseStatus}
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Sản phẩm chào:</span>
                          <strong className="text-slate-800">{resp.productServiceOffered || 'Theo quy cách'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Khu vực & MOQ:</span>
                          <strong className="text-slate-800">{resp.serviceArea || 'Toàn quốc'} ({resp.moqCapacity || 'Linh hoạt'})</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Lead time:</span>
                          <strong className="text-slate-800 font-mono">{resp.leadTimeEstimated || '3-7 ngày'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Mẫu & Khảo sát:</span>
                          <strong className="text-slate-800">
                            {resp.sampleAvailable ? '✓ Có mẫu' : '✗ Không'} | {resp.surveyAvailable ? '✓ Đón tiếp' : '✗ Không'}
                          </strong>
                        </div>
                      </div>

                      {/* Năng lực & Ghi chú */}
                      {resp.capabilityNote && (
                        <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block font-heading mb-1">Mô tả năng lực cung ứng:</strong>
                          <p className="leading-relaxed">{resp.capabilityNote}</p>
                        </div>
                      )}

                      {/* Review Note nếu có */}
                      {resp.reviewNote && (
                        <div className="text-xs bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200">
                          <strong>Ghi chú Ban Điều Phối:</strong> {resp.reviewNote} ({resp.reviewedBy})
                        </div>
                      )}

                      {/* CTA Admin Actions (Section 16) */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => alert(`Xem hồ sơ doanh nghiệp ${resp.supplierName}`)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                          Xem hồ sơ
                        </button>

                        <button
                          onClick={() => handleRequestMoreInfo(resp.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-semibold transition"
                        >
                          Yêu cầu bổ sung
                        </button>

                        <button
                          onClick={() => setRejectModal({ isOpen: true, responseId: resp.id, reason: '' })}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition"
                        >
                          Không phù hợp
                        </button>

                        <button
                          onClick={() => handleShortlistResponse(resp.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đưa vào Shortlist
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit_trail' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider font-heading">
                Nhật ký hoạt động kiểm duyệt
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {auditLogs.filter(l => l.requirementId === selectedDemand.id).map(log => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <p className="text-slate-600">{log.details}</p>
                    </div>
                    <div className="text-right text-slate-400 whitespace-nowrap text-[11px]">
                      <div>{log.actor}</div>
                      <div>{new Date(log.timestamp).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* LIST VIEW: /admin/nhu-cau */
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo mã hoặc tên nhu cầu..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-600"
                />
              </div>

              {/* Visibility Filter (Section 15: Bổ sung filter PUBLIC_SUMMARY) */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">Phạm vi:</span>
                <select
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="ALL">Tất cả phạm vi</option>
                  <option value="PUBLIC_SUMMARY">PUBLIC_SUMMARY (Đang công khai)</option>
                  <option value="ONLY_MATCHED">ONLY_MATCHED (Ghép đôi)</option>
                  <option value="PRIVATE">PRIVATE (Riêng tư)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE_SOURCING">ACTIVE_SOURCING (Đang tìm nguồn)</option>
                  <option value="CLOSED">CLOSED (Đã đóng)</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Tổng số: <strong>{filteredDemands.length}</strong> nhu cầu
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mã nhu cầu</th>
                    <th className="py-3 px-4">Tiêu đề nhu cầu</th>
                    <th className="py-3 px-4">Chuyên mục</th>
                    <th className="py-3 px-4">Địa bàn / KCN</th>
                    <th className="py-3 px-4">Phạm vi công bố</th>
                    <th className="py-3 px-4 text-center">Phản hồi</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDemands.map(d => {
                    const count = responses.filter(r => r.requirementId === d.id).length;
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                          {d.publicCode}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate" title={d.title}>
                            {d.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Hạn: {d.deadline || 'Chưa định'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {d.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{d.province}</div>
                          {d.industrialPark && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{d.industrialPark}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            d.visibility === 'PUBLIC_SUMMARY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            d.visibility === 'ONLY_MATCHED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {d.visibility}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold ${
                            count > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            d.status === 'ACTIVE_SOURCING' ? 'text-emerald-700' : 'text-slate-400'
                          }`}>
                            {d.status === 'ACTIVE_SOURCING' ? 'Đang mở' : 'Đã đóng'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDemand(d);
                              setActiveTab('overview');
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-[#0052cc] hover:text-white rounded-lg text-xs font-bold text-slate-700 transition"
                          >
                            Chi tiết & Thẩm định
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* REJECTION REASON MODAL (SECTION 16: Bắt buộc reason khi chọn không phù hợp) */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-[1300] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Lý do không phù hợp
            </h3>
            <p className="text-xs text-slate-500">
              Vui lòng nêu rõ lý do từ chối phản hồi để hệ thống gửi thông báo cho Nhà Cung Ứng.
            </p>
            <textarea
              required
              rows={3}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="VD: Không đáp ứng đủ sản lượng tối thiểu 50.000m/tháng hoặc thời gian giao hàng vượt quá yêu cầu..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal({ isOpen: false, responseId: null, reason: '' })}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
