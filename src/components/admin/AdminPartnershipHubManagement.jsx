// ============================================================================
// ADMIN PARTNERSHIP HUB & CROSS-ECOSYSTEM COORDINATION
// PAGE 37: /admin/hop-tac (SECTION 54-58 SPEC 37.TXT)
// ============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Handshake, Search, Filter, CheckCircle2, AlertTriangle,
  Building2, Users, FileText, ExternalLink, Calendar,
  ArrowRight, ShieldCheck, DollarSign, Clock, UserCheck, Eye, X
} from 'lucide-react';
import {
  PARTNERSHIP_CATEGORIES,
  FINANCE_CLASSIFICATIONS,
  getAllPartnershipInquiries,
  updatePartnershipRequestStatus,
  getAllPartnershipAuditLogs
} from '../../data/partnershipHubData.js';

export default function AdminPartnershipHubManagement({ initialInquiryId = null }) {
  const [inquiries, setInquiries] = useState(getAllPartnershipInquiries());
  const [selectedInquiry, setSelectedInquiry] = useState(
    initialInquiryId ? inquiries.find(i => i.id === initialInquiryId || i.publicCode === initialInquiryId) : null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeDetailTab, setActiveDetailTab] = useState('OVERVIEW');

  // Mutation form state
  const [newStatus, setNewStatus] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Reload data
  const reloadData = () => {
    const list = getAllPartnershipInquiries();
    setInquiries(list);
    if (selectedInquiry) {
      setSelectedInquiry(list.find(i => i.id === selectedInquiry.id));
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter(item => {
    const matchSearch =
      (item.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.representativeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.publicCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || '').includes(searchQuery) ||
      (item.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status);
    setNewOwner(inquiry.ownerUserId || 'coordinator_partnership');
    setNextAction(inquiry.nextAction || '');
    setAdminNote('');
    setActionMessage('');
    setActiveDetailTab('OVERVIEW');
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    const res = updatePartnershipRequestStatus(selectedInquiry.id, newStatus, {
      ownerUserId: newOwner,
      nextAction: nextAction,
      note: adminNote,
      adminUser: 'Admin Coordinator'
    });

    if (res.success) {
      setActionMessage('Cập nhật trạng thái và điều phối thành công!');
      reloadData();
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const auditLogs = getAllPartnershipAuditLogs();

  return (
    <div className="space-y-6">
      {/* 1. HEADER & KPI CARDS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1">
            <Handshake className="w-3.5 h-3.5 text-blue-600" />
            <span>MODULE 37: QUẢN TRỊ TRUNG TÂM HỢP TÁC & PHÂN TÁCH TÀI CHÍNH</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Điều Phối Quan Hệ Đối Tác Hệ Sinh Thái
          </h2>
          <p className="text-xs text-slate-500">
            Tổng quan đa phân hệ: Hội, KCN, Tài trợ, Founding Partner, Đối tác phát triển, Cố vấn và Nhà đầu tư.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 block">TỔNG ĐỀ XUẤT</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{inquiries.length}</div>
          <span className="text-[10px] text-slate-500">Toàn bộ 7 phân hệ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10.5px] font-mono uppercase font-bold text-amber-500 block">CHỜ THẨM ĐỊNH</span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
            {inquiries.filter(i => i.status === 'RECEIVED' || i.status === 'UNDER_REVIEW').length}
          </div>
          <span className="text-[10px] text-slate-500">Cần phản hồi trong 48h</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10.5px] font-mono uppercase font-bold text-emerald-500 block">ĐANG HOẠT ĐỘNG</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
            {inquiries.filter(i => i.status === 'ACTIVE').length}
          </div>
          <span className="text-[10px] text-slate-500">Đã xác nhận thỏa thuận</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10.5px] font-mono uppercase font-bold text-purple-500 block">VỐN ĐẦU TƯ / CỐ VẤN</span>
          <div className="text-2xl font-black text-purple-600 font-mono mt-0.5">
            {inquiries.filter(i => i.category === 'INVESTOR' || i.category === 'ADVISOR').length}
          </div>
          <span className="text-[10px] text-slate-500">Luồng riêng phi doanh thu</span>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Mã HT, Tên tổ chức, Người đại diện, SĐT, Email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">Tất cả phân hệ hợp tác</option>
            {PARTNERSHIP_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="RECEIVED">Mới tiếp nhận (RECEIVED)</option>
            <option value="UNDER_REVIEW">Đang thẩm định (UNDER_REVIEW)</option>
            <option value="DISCUSSION">Đang trao đổi (DISCUSSION)</option>
            <option value="SCOPE_DEFINITION">Xác định phạm vi (SCOPE_DEFINITION)</option>
            <option value="AGREEMENT_PENDING">Chờ ký kết (AGREEMENT_PENDING)</option>
            <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
            <option value="DECLINED">Từ chối (DECLINED)</option>
          </select>
        </div>
      </div>

      {/* 3. TABLE OF INQUIRIES (SECTION 55 SPEC 37.TXT) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-xs text-slate-900 uppercase font-heading">
            Danh Sách Đề Xuất Hợp Tác ({filteredInquiries.length})
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            Phân định quyền truy cập & dòng tiền
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10.5px] uppercase">
                <th className="p-3.5">Mã Đề Xuất</th>
                <th className="p-3.5">Đơn Vị Đề Xuất</th>
                <th className="p-3.5">Phân Hệ Hợp Tác</th>
                <th className="p-3.5">Phân Loại Tài Chính</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Phụ Trách (Owner)</th>
                <th className="p-3.5">Hành Động Tiếp Theo</th>
                <th className="p-3.5 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Không tìm thấy đề xuất hợp tác nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-blue-700">
                      {item.publicCode}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.organizationName}</div>
                      <div className="text-[10.5px] text-slate-500 line-clamp-1">
                        {item.representativeName} – {item.roleTitle}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.categoryName}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.financeClassification === 'INVESTMENT_CAPITAL'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : item.financeClassification === 'NON_COMMERCIAL_ALLIANCE'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.financeClassification}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'RECEIVED' || item.status === 'UNDER_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'DECLINED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-slate-600">
                      {item.ownerUserId || 'Chưa gán'}
                    </td>

                    <td className="p-3.5 text-[11px] text-slate-600 max-w-xs truncate">
                      {item.nextAction || 'Chờ điều phối'}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition inline-flex items-center gap-1 text-[11px] font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DETAIL MODAL (SECTION 56 SPEC 37.TXT) */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg">
                  {selectedInquiry.publicCode}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedInquiry.categoryName}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 px-5 bg-white text-xs">
              {['OVERVIEW', 'PHÂN ĐỊNH TÀI CHÍNH', 'ĐIỀU PHỐI & CẬP NHẬT', 'AUDIT LOG'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`py-3 px-3 font-bold border-b-2 transition ${
                    activeDetailTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {activeDetailTab === 'OVERVIEW' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Đơn vị đề xuất</span>
                      <strong className="text-slate-900 text-sm">{selectedInquiry.organizationName}</strong>
                      {selectedInquiry.legalName && (
                        <p className="text-[11px] text-slate-500">{selectedInquiry.legalName}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Người đại diện</span>
                      <strong className="text-slate-900 text-sm">{selectedInquiry.representativeName}</strong>
                      <p className="text-[11px] text-slate-500">{selectedInquiry.roleTitle}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Email liên hệ</span>
                      <span className="font-mono text-slate-700">{selectedInquiry.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Số điện thoại</span>
                      <span className="font-mono text-slate-700">{selectedInquiry.phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Nội dung & Phạm vi đề xuất:</span>
                    <p className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.proposalScope || 'Không có mô tả chi tiết.'}
                    </p>
                  </div>

                  {/* Dedicated Routing (Section 57) */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
                    <span>Cần xử lý trong phân hệ chuyên biệt?</span>
                    <Link
                      to={
                        selectedInquiry.category === 'SPONSOR'
                          ? '/admin/tai-tro'
                          : selectedInquiry.category === 'FOUNDING_PARTNER'
                            ? '/admin/founding-partner'
                            : selectedInquiry.category === 'DEVELOPMENT_PARTNER'
                              ? '/admin/doi-tac-phat-trien'
                              : selectedInquiry.category === 'ASSOCIATION'
                                ? '/admin/hoi-hiep-hoi'
                                : selectedInquiry.category === 'INDUSTRIAL_PARK'
                                  ? '/admin/khu-cong-nghiep'
                                  : '/hop-tac'
                      }
                      className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-1"
                    >
                      <span>Mở Phân Hệ</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {activeDetailTab === 'PHÂN ĐỊNH TÀI CHÍNH' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
                      CHUẨN MỰC HẠCH TOÁN (SECTION 25 & 56)
                    </span>
                    <div className="text-base font-bold font-mono">
                      Phân loại: {selectedInquiry.financeClassification}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {FINANCE_CLASSIFICATIONS[selectedInquiry.financeClassification]?.description || 'Phân loại tài chính theo thỏa thuận.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      <strong>Cảnh báo phân định:</strong> {selectedInquiry.category === 'INVESTOR'
                        ? 'Vốn đầu tư (INVESTMENT_CAPITAL) tuyệt đối KHÔNG hạch toán vào doanh thu bán hàng hay tiền tài trợ.'
                        : 'Các khoản thu thương mại từ dịch vụ hoặc tài trợ bắt buộc phải có hợp đồng và xuất hóa đơn VAT theo tiến độ.'}
                    </span>
                  </div>
                </div>
              )}

              {activeDetailTab === 'ĐIỀU PHỐI & CẬP NHẬT' && (
                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  {actionMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800">
                      {actionMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trạng Thái Xử Lý</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="RECEIVED">RECEIVED (Mới tiếp nhận)</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW (Đang thẩm định)</option>
                        <option value="DISCUSSION">DISCUSSION (Đang trao đổi)</option>
                        <option value="SCOPE_DEFINITION">SCOPE_DEFINITION (Xác định phạm vi)</option>
                        <option value="AGREEMENT_PENDING">AGREEMENT_PENDING (Chờ ký thỏa thuận)</option>
                        <option value="ACTIVE">ACTIVE (Đang hoạt động)</option>
                        <option value="DECLINED">DECLINED (Từ chối đề xuất)</option>
                        <option value="CANCELLED">CANCELLED (Hủy bỏ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Người Phụ Trách (Owner)</label>
                      <input
                        type="text"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                        placeholder="VD: coordinator_partnership"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Hành Động Tiếp Theo</label>
                    <input
                      type="text"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      placeholder="VD: Lên lịch họp trực tuyến thẩm định năng lực..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Ghi Chú Tiến Độ</label>
                    <textarea
                      rows={3}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Ghi nhận nội dung trao đổi, rà soát xung đột độc quyền..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition"
                    >
                      Cập Nhật Tiến Độ
                    </button>
                  </div>
                </form>
              )}

              {activeDetailTab === 'AUDIT LOG' && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">Nhật Ký Thẩm Định & Điều Phối:</span>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {auditLogs
                      .filter(log => log.inquiryId === selectedInquiry.id)
                      .map((log, lIdx) => (
                        <div key={lIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                            <span>{log.actor}</span>
                            <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                          </div>
                          <div className="font-bold text-slate-900">{log.action}</div>
                          <p className="text-slate-600">{log.details}</p>
                        </div>
                      ))}
                    {auditLogs.filter(log => log.inquiryId === selectedInquiry.id).length === 0 && (
                      <p className="text-slate-400 italic">Chưa có lịch sử audit cho hồ sơ này.</p>
                    )}
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
