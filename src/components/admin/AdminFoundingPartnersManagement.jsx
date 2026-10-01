// ============================================================================
// ADMIN FOUNDING PARTNER MANAGEMENT COMPONENT
// PAGE 18: FOUNDING PARTNER (/admin/founding-partner)
// Chuẩn hóa theo spec 18.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Crown, CheckCircle2, Clock, AlertCircle, Search, Filter,
  Eye, Edit3, ArrowRight, ShieldCheck, ChevronRight, UserCheck,
  FileText, Plus, RefreshCw, X, Layers, Save, ExternalLink,
  Users, Handshake, Calendar, MapPin, Send, ArrowUpRight, Award,
  Check, Play, ArrowLeftRight, AlertTriangle, Video, DollarSign,
  Briefcase, FolderTree, Key, Building2, Tag, ShieldAlert
} from 'lucide-react';
import {
  PARTNERSHIP_STATUSES,
  ENTITLEMENT_TYPES,
  ENTITLEMENT_STATUSES,
  getAllFoundingPartnerships,
  saveAllFoundingPartnerships,
  checkScopeConflict,
  updateFoundingPartnershipStatus,
  updateEntitlementDelivery,
  renewFoundingPartnership,
  getAllFoundingAuditLogs,
  logFoundingAudit
} from '../../data/foundingPartnershipData';
import { CATEGORY_HUBS } from '../../data/categoryHubData';
import { KEYWORD_CLUSTERS } from '../../data/keywordClustersData';

export default function AdminFoundingPartnersManagement({ initialPartnerId = null }) {
  const [partnerships, setPartnerships] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  
  // Search & Filter State (Section 22)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  // Modal State & 14 Detail Tabs (Section 23)
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 14 tabs
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [statusChangeNote, setStatusChangeNote] = useState('');

  // Renewal Form State (Section 24)
  const [renewalStartDate, setRenewalStartDate] = useState('');
  const [renewalEndDate, setRenewalEndDate] = useState('');
  const [renewalContractNumber, setRenewalContractNumber] = useState('');
  const [renewalValue, setRenewalValue] = useState('');

  // Delivery & Evidence State (Section 17 & 18)
  const [selectedEntitlementId, setSelectedEntitlementId] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('DELIVERED');
  const [deliveredQty, setDeliveredQty] = useState(1);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // Load Data
  const loadData = () => {
    const list = getAllFoundingPartnerships();
    const logs = getAllFoundingAuditLogs();
    setPartnerships(list);
    setAuditLogs(logs);

    if (initialPartnerId) {
      const found = list.find(p => p.id === initialPartnerId || p.publicCode === initialPartnerId);
      if (found) {
        openDetail(found);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [initialPartnerId]);

  const openDetail = (partner) => {
    setSelectedPartner(partner);
    setActiveTab('overview');
    setEditStatus(partner.status || 'INQUIRY');
    setStatusChangeNote('');
    setActionSuccessMsg('');

    // Pre-fill renewal defaults
    const nextYear = new Date().getFullYear() + 1;
    setRenewalStartDate(`${nextYear}-01-01`);
    setRenewalEndDate(`${nextYear}-12-31`);
    setRenewalContractNumber(`HD-FP-${nextYear}-${partner.id.slice(-3)}`);
    setRenewalValue(partner.contract?.totalValue || '120.000.000 VNĐ');

    // Reset delivery form
    if (partner.entitlements && partner.entitlements.length > 0) {
      setSelectedEntitlementId(partner.entitlements[0].id);
      setDeliveredQty(partner.entitlements[0].deliveredQuantity || 1);
    }
    setEvidenceTitle('');
    setEvidenceUrl('');
  };

  // Status Change Handler
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedPartner) return;

    const res = updateFoundingPartnershipStatus({
      partnershipId: selectedPartner.id,
      status: editStatus,
      reason: statusChangeNote,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg('Đã cập nhật trạng thái đối tác thành công!');
      loadData();
      setSelectedPartner(res.partner);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  // Record Delivery & Evidence Handler
  const handleRecordDelivery = (e) => {
    e.preventDefault();
    if (!selectedPartner || !selectedEntitlementId) return;

    const res = updateEntitlementDelivery({
      partnershipId: selectedPartner.id,
      entitlementId: selectedEntitlementId,
      status: deliveryStatus,
      deliveredQuantity: Number(deliveredQty),
      evidenceItem: evidenceTitle ? { title: evidenceTitle, url: evidenceUrl } : null,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg('Đã ghi nhận bàn giao quyền lợi & bằng chứng thực tế!');
      loadData();
      setSelectedPartner(res.partner);
      setEvidenceTitle('');
      setEvidenceUrl('');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  // Renewal Handler (Section 24)
  const handleRenewContract = (e) => {
    e.preventDefault();
    if (!selectedPartner) return;

    const res = renewFoundingPartnership({
      partnershipId: selectedPartner.id,
      newStartDate: renewalStartDate,
      newEndDate: renewalEndDate,
      newContractNumber: renewalContractNumber,
      totalValue: renewalValue,
      actor: 'Admin Master'
    });

    if (res.success) {
      setActionSuccessMsg('Đã gia hạn hợp đồng thương mại thành công! Lịch sử hợp đồng cũ đã được lưu trữ an toàn.');
      loadData();
      setSelectedPartner(res.partner);
      setTimeout(() => setActionSuccessMsg(''), 3500);
    }
  };

  // Filter partnerships
  const filteredList = partnerships.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.partnerName || '').toLowerCase().includes(q);
      const matchCode = (p.publicCode || p.id || '').toLowerCase().includes(q);
      const matchCat = (p.categoryName || '').toLowerCase().includes(q);
      const matchCluster = (p.keywordClusterName || '').toLowerCase().includes(q);
      return matchName || matchCode || matchCat || matchCluster;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Page 18: Commercial Sponsorship Engine
          </span>
          <h2 className="text-lg font-black text-slate-900 font-heading mt-1">
            QUẢN LÝ FOUNDING PARTNER (ĐỒNG HÀNH CHUYÊN MỤC)
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Gói tài trợ thương mại theo ngành, cụm từ khóa &amp; địa bàn. Không phải cổ đông, không ưu tiên Matching hữu cơ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition border border-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đồng bộ</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar (Section 22) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên đối tác, mã FP-..., chuyên mục, từ khóa..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái ({partnerships.length})</option>
            {Object.values(PARTNERSHIP_STATUSES).map(st => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table (Section 22) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold font-heading border-b border-slate-200">
              <tr>
                <th className="p-3.5">Mã &amp; Đối Tác</th>
                <th className="p-3.5">Phạm Vi Chuyên Mục</th>
                <th className="p-3.5">Cụm Từ Khóa / Địa Bàn</th>
                <th className="p-3.5">Thời Hạn</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Hợp Đồng</th>
                <th className="p-3.5">Tiến Độ Quyền Lợi</th>
                <th className="p-3.5 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy đối tác nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredList.map(item => {
                  const statusMeta = PARTNERSHIP_STATUSES[item.status] || { label: item.status, color: 'slate' };
                  const isConflict = item.scopeConflictStatus === 'POTENTIAL_CONFLICT_NOTED';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                            {item.publicCode || item.id}
                          </span>
                          {isConflict && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-black uppercase flex items-center gap-0.5" title={item.scopeConflictNote || 'Có xung đột phạm vi'}>
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Overlap</span>
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 mt-1 max-w-[220px] truncate">{item.partnerName}</p>
                        <p className="text-[10px] text-slate-400">{item.ownerName || 'Chuyên viên phụ trách'}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{item.categoryName || 'Chưa gán ngành'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Vị trí: {item.displayPosition || 'TOP_CATEGORY'}</span>
                      </td>

                      <td className="p-3.5">
                        <p className="text-slate-700 font-medium truncate max-w-[180px]">{item.keywordClusterName || 'N/A'}</p>
                        <span className="text-[10px] text-blue-700 font-mono">📍 {item.locationName || 'Toàn quốc'}</span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-600">
                        {item.startDate ? `${item.startDate} → ${item.endDate}` : 'Chưa kích hoạt'}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block font-mono ${
                          item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          item.status === 'EXPIRED' ? 'bg-slate-100 text-slate-600' :
                          item.status === 'INQUIRY' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <span className="text-slate-800 font-bold block">{item.contract?.contractNumber || 'Chưa có HĐ'}</span>
                        <span className="text-[10px] text-slate-400">{item.contract?.totalValue || 'N/A'}</span>
                      </td>

                      <td className="p-3.5">
                        {item.entitlements && item.entitlements.length > 0 ? (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-600">
                              {item.entitlements.filter(e => e.status === 'DELIVERED').length} / {item.entitlements.length} hạng mục
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${(item.entitlements.filter(e => e.status === 'DELIVERED').length / item.entitlements.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Chưa lập danh mục</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => openDetail(item)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
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

      {/* ==================================================================== */}
      {/* DETAIL MODAL WITH 14 TABS (SECTION 23 SPEC 18.TXT) */}
      {/* ==================================================================== */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            
            {/* Header */}
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Hồ sơ Founding Partner #{selectedPartner.publicCode || selectedPartner.id}
                </span>
                <h3 className="text-base sm:text-lg font-black font-heading mt-0.5">
                  {selectedPartner.partnerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 14 Tabs Navigation Bar */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 overflow-x-auto text-xs font-bold gap-1">
              {[
                { id: 'overview', label: '1. Tổng quan' },
                { id: 'scope', label: '2. Phạm vi' },
                { id: 'contract', label: '3. Hợp đồng' },
                { id: 'entitlements', label: '4. Quyền lợi' },
                { id: 'content', label: '5. Nội dung' },
                { id: 'video', label: '6. Video' },
                { id: 'catalogue', label: '7. Catalogue' },
                { id: 'programs', label: '8. Programs' },
                { id: 'delivery', label: '9. Bàn giao & Bằng chứng' },
                { id: 'report', label: '10. Báo cáo' },
                { id: 'finance', label: '11. Tài chính' },
                { id: 'tasks', label: '12. Tasks' },
                { id: 'timeline', label: '13. Timeline' },
                { id: 'audit', label: '14. Audit' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto text-xs">
              
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Trạng thái</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedPartner.status}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Chuyên mục</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedPartner.categoryName || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn hợp đồng</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{selectedPartner.endDate || 'Chưa định'}</span>
                    </div>
                  </div>

                  {/* Form Update Status */}
                  <form onSubmit={handleUpdateStatus} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase">Cập nhật trạng thái đối tác</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Trạng thái mới</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                        >
                          {Object.values(PARTNERSHIP_STATUSES).map(st => (
                            <option key={st.id} value={st.id}>{st.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Ghi chú tiến độ</label>
                        <input
                          type="text"
                          value={statusChangeNote}
                          onChange={e => setStatusChangeNote(e.target.value)}
                          placeholder="Lý do đổi trạng thái..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition">
                      Lưu thay đổi trạng thái
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: SCOPE & EXCLUSIVITY */}
              {activeTab === 'scope' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase">Phạm vi tài trợ thương mại</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>• Ngành / Chuyên mục: <strong>{selectedPartner.categoryName}</strong></div>
                      <div>• Cụm từ khóa: <strong>{selectedPartner.keywordClusterName}</strong></div>
                      <div>• Địa bàn áp dụng: <strong>{selectedPartner.locationName}</strong></div>
                      <div>• KCN liên kết: <strong>{selectedPartner.industrialParkName || 'Toàn bộ KCN địa bàn'}</strong></div>
                      <div>• Vị trí hiển thị: <strong>{selectedPartner.displayPosition}</strong></div>
                      <div>• Thời hạn: <strong>{selectedPartner.startDate} → {selectedPartner.endDate}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Điều khoản độc quyền (nếu có):</span>
                      <p className="font-medium text-slate-800 mt-1 italic">
                        {selectedPartner.exclusivityScope || 'Không có thỏa thuận độc quyền (Non-exclusive).'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTRACT & RENEWAL (SECTION 16 & 24) */}
              {activeTab === 'contract' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase">Hợp đồng thương mại hiện hành</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>• Số hợp đồng: <strong>{selectedPartner.contract?.contractNumber || 'N/A'}</strong></div>
                      <div>• Giá trị thỏa thuận: <strong>{selectedPartner.contract?.totalValue || 'N/A'}</strong></div>
                      <div>• Ngày ký: <strong>{selectedPartner.contract?.signedDate || 'N/A'}</strong></div>
                      <div>• Loại hình: <strong>Gói thương mại tài trợ chuyên mục (Non-equity)</strong></div>
                    </div>
                  </div>

                  {/* Gia Hạn Hợp Đồng (Section 24: Không ghi đè lịch sử cũ) */}
                  <form onSubmit={handleRenewContract} className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-emerald-900 uppercase">Gia hạn hợp tác thương mại (Renewal)</h4>
                    <p className="text-[11px] text-emerald-800">
                      Gia hạn hợp đồng sẽ lưu trữ hợp đồng cũ vào lịch sử và khởi tạo chu kỳ mới, không ghi đè dữ liệu.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Ngày bắt đầu mới</label>
                        <input type="date" value={renewalStartDate} onChange={e => setRenewalStartDate(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Ngày kết thúc mới</label>
                        <input type="date" value={renewalEndDate} onChange={e => setRenewalEndDate(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Số Hợp Đồng Mới</label>
                        <input type="text" value={renewalContractNumber} onChange={e => setRenewalContractNumber(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Giá trị gia hạn</label>
                        <input type="text" value={renewalValue} onChange={e => setRenewalValue(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">
                      Kích hoạt gia hạn hợp đồng
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: ENTITLEMENTS (SECTION 6 & 10) */}
              {activeTab === 'entitlements' && (
                <div className="space-y-4">
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {selectedPartner.entitlements && selectedPartner.entitlements.length > 0 ? (
                      selectedPartner.entitlements.map(ent => (
                        <div key={ent.id} className="p-3.5 bg-white flex items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-slate-900 block">{ENTITLEMENT_TYPES[ent.type]?.name || ent.type}</span>
                            <span className="text-[10px] text-slate-400">Tiến độ: {ent.deliveredQuantity || 0}/{ent.quantity || 1} • Phụ trách: {ent.ownerUserId}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ent.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ent.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400">Chưa thiết lập quyền lợi chi tiết.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 9: DELIVERY & EVIDENCE (SECTION 17 & 18) */}
              {activeTab === 'delivery' && (
                <div className="space-y-4">
                  <form onSubmit={handleRecordDelivery} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase">Ghi nhận bàn giao quyền lợi &amp; Bằng chứng thực tế</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Hạng mục</label>
                        <select
                          value={selectedEntitlementId}
                          onChange={e => setSelectedEntitlementId(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        >
                          {selectedPartner.entitlements?.map(e => (
                            <option key={e.id} value={e.id}>{ENTITLEMENT_TYPES[e.type]?.shortName || e.type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Trạng thái bàn giao</label>
                        <select
                          value={deliveryStatus}
                          onChange={e => setDeliveryStatus(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                        >
                          <option value="IN_PROGRESS">Đang triển khai</option>
                          <option value="DELIVERED">Đã bàn giao</option>
                          <option value="ACCEPTED">Khách hàng nghiệm thu</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Số lượng đã giao</label>
                        <input type="number" min={0} value={deliveredQty} onChange={e => setDeliveredQty(e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Tiêu đề bằng chứng (Evidence)</label>
                        <input type="text" value={evidenceTitle} onChange={e => setEvidenceTitle(e.target.value)} placeholder="Ví dụ: Đã hiển thị khối tài trợ tại /nganh-nghe/..." className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Đường dẫn bằng chứng (URL)</label>
                        <input type="text" value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)} placeholder="https://..." className="w-full p-2 bg-white border border-slate-200 rounded-xl" />
                      </div>
                    </div>

                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
                      Lưu bằng chứng bàn giao
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 11: FINANCE SEPARATION (SECTION 25) */}
              {activeTab === 'finance' && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>Quy định phân tách dòng tiền (Section 25 Spec 18)</span>
                  </div>
                  <p>
                    Khoản thu từ Founding Partner được hạch toán dưới dạng <strong>DOANH THU GÓI DỊCH VỤ TRUYỀN THÔNG &amp; TÀI TRỢ THƯƠNG MẠI</strong>. 
                    Tuyệt đối không coi khoản tiền này là vốn đầu tư (Investment capital), vốn góp cổ phần hay khoản vay.
                  </p>
                </div>
              )}

              {/* TAB 14: AUDIT LOG (SECTION 21 & 30.15) */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 uppercase">Nhật ký kiểm toán biến động</h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    {auditLogs.filter(l => l.partnerId === selectedPartner.id).map(log => (
                      <div key={log.id} className="p-3 bg-white space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-blue-700 text-[10px] bg-blue-50 px-2 py-0.5 rounded">{log.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                        </div>
                        <p className="text-slate-800 text-xs">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
