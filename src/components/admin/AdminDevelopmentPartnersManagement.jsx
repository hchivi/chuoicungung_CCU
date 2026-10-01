// ============================================================================
// ADMIN DEVELOPMENT PARTNERS MANAGEMENT COMPONENT
// ROUTE: /admin/doi-tac-phat-trien & Admin Dashboard Menu
// Chuẩn hóa theo spec 33.txt (Sections 37-43) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Handshake, Search, Filter, CheckCircle2, AlertTriangle, Calendar,
  Clock, ShieldCheck, Crown, Eye, Download, Plus, ExternalLink,
  ChevronRight, TrendingUp, FileText, Check, X, Building2, Send,
  Users, BookOpen, Video, Gift, DollarSign, BarChart3, AlertCircle,
  Link2, UserCheck, ShieldAlert, RotateCcw
} from 'lucide-react';

import {
  getAllDevelopmentPartners,
  getAllPartnerApplications,
  getAllReferrals,
  getPartnerAuditLogs,
  updatePartnerApplicationStatus,
  approvePartnerApplication,
  updateReferralStatus,
  adjustSettlementForRefund,
  COOPERATION_TYPES,
  PARTNER_ROLES,
  PARTNER_STATUSES,
  REFERRAL_STATUSES
} from '../../data/developmentPartnerData';

export default function AdminDevelopmentPartnersManagement({ initialPartnerId = null }) {
  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [activeTab, setActiveTab] = useState('APPLICATIONS'); // 'APPLICATIONS' | 'PARTNERS' | 'REFERRALS' | 'AUDIT'

  const refreshData = () => {
    setPartners(getAllDevelopmentPartners());
    setApplications(getAllPartnerApplications());
    setReferrals(getAllReferrals());
    setAuditLogs(getPartnerAuditLogs());
  };

  useEffect(() => {
    refreshData();
  }, [initialPartnerId]);

  // Bộ lọc Applications
  const filteredApps = applications.filter(app => {
    const matchSearch = !searchQuery ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'ALL' || app.partnerType === selectedType;
    return matchSearch && matchType;
  });

  // Bộ lọc Partners
  const filteredPartners = partners.filter(p => {
    const matchSearch = !searchQuery ||
      p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partnerCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'ALL' || p.partnerType === selectedType;
    return matchSearch && matchType;
  });

  // Bộ lọc Referrals
  const filteredReferrals = referrals.filter(r => {
    return !searchQuery ||
      r.referredCompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Xử lý duyệt đơn ứng tuyển -> cấp mã đối tác
  const handleApproveApp = (app) => {
    const code = prompt('Nhập mã đối tác mong muốn (hoặc để trống để sinh tự động):', `DTPT-${app.applicantName.slice(0, 3).toUpperCase()}-01`);
    if (code === null) return;

    try {
      approvePartnerApplication(app.id, code, { agreementId: `AGREEMENT_${code}` }, { name: 'Admin Điều Phối', role: 'ADMIN' });
      refreshData();
      alert(`Đã phê duyệt đối tác thành công! Cấp mã: ${code}`);
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  };

  // Xử lý từ chối đơn
  const handleRejectApp = (appId) => {
    const reason = prompt('Nhập lý do từ chối hồ sơ:', 'Chưa đủ điều kiện về quy mô mạng lưới tại thời điểm này.');
    if (!reason) return;

    try {
      updatePartnerApplicationStatus(appId, 'REJECTED', { name: 'Admin Điều Phối', role: 'ADMIN' }, 'Từ chối đơn ứng tuyển', reason);
      refreshData();
      alert('Đã cập nhật trạng thái từ chối hồ sơ.');
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  };

  // Thẩm định referral
  const handleReviewReferral = (refId, status) => {
    try {
      updateReferralStatus(refId, status, { name: 'Admin Điều Phối', role: 'ADMIN' }, 'Thẩm định hồ sơ giới thiệu');
      refreshData();
      alert(`Đã cập nhật referral sang trạng thái: ${REFERRAL_STATUSES[status]?.label || status}`);
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
              Bàn Điều Phối Đối Tác Phát Triển B2B
            </span>
            <span className="text-xs text-slate-400 font-mono">Page 33 Compliant</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Quản Trị Đối Tác Phát Triển & Mạng Lưới Referral
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thẩm định hồ sơ đối tác, quản lý mã giới thiệu, đối soát yêu cầu hợp lệ và nhật ký kiểm toán minh bạch.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'APPLICATIONS' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hàng Đợi Ứng Tuyển ({applications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PARTNERS')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'PARTNERS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Đối Tác Active ({partners.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('REFERRALS')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'REFERRALS' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Thẩm Định Referrals ({referrals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'AUDIT' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên đối tác, người liên hệ, email, mã giới thiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Vai trò:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          >
            <option value="ALL">Tất cả đối tượng</option>
            {Object.values(PARTNER_ROLES).map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: APPLICATIONS QUEUE (MỤC 38, 39: HÀNG ĐỢI ĐƠN ỨNG TUYỂN) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'APPLICATIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Danh sách hồ sơ ứng tuyển đối tác (Mục 25: Nộp đơn chỉ tạo APPLIED, không auto duyệt)
            </span>
            <span className="text-slate-500">Hiển thị {filteredApps.length} hồ sơ</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredApps.map(app => {
              const statusObj = PARTNER_STATUSES[app.status] || { label: app.status, color: 'blue' };
              const roleObj = PARTNER_ROLES[app.partnerType] || { label: app.partnerType };

              return (
                <div key={app.id} className="p-5 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{app.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {roleObj.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {statusObj.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{app.applicantName}</h4>
                      <p className="text-xs text-slate-600">
                        Đầu mối: <strong>{app.contactPerson}</strong> ({app.role || 'Đại diện'}) • SĐT: <strong>{app.phone}</strong> • Email: <strong>{app.email}</strong>
                      </p>
                      <p className="text-xs text-slate-600">
                        Địa bàn: <strong>{app.geographicScopes?.join(', ') || 'Toàn quốc'}</strong>
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 mt-1">
                        <span className="font-bold block text-slate-900">Mạng lưới tiếp cận:</span>
                        <p className="italic">"{app.targetAudienceDescription}"</p>
                      </div>
                      {app.rejectionReason && (
                        <p className="text-xs text-rose-700 font-semibold mt-1">
                          Lý do từ chối: {app.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="text-xs space-y-2 shrink-0">
                      <div className="text-right sm:text-right">
                        <span className="text-slate-400 block text-[11px]">Người phụ trách:</span>
                        <span className="font-semibold text-slate-800">{app.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => {
                              updatePartnerApplicationStatus(app.id, 'DISCUSSION', { name: 'Admin Điều Phối', role: 'ADMIN' }, 'Chuyển sang trao đổi trực tiếp');
                              refreshData();
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                          >
                            Hẹn Trao Đổi
                          </button>
                        )}
                        {app.status === 'DISCUSSION' && (
                          <button
                            onClick={() => handleApproveApp(app)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Phê Duyệt & Cấp Mã</span>
                          </button>
                        )}
                        {app.status !== 'REJECTED' && app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleRejectApp(app.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold rounded-lg transition"
                          >
                            Từ Chối
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: ACTIVE PARTNERS (MỤC 37: DANH SÁCH ĐỐI TÁC ACTIVE) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'PARTNERS' && (
        <div className="space-y-4">
          {filteredPartners.map(p => {
            const roleObj = PARTNER_ROLES[p.partnerType] || { label: p.partnerType };

            return (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500">{p.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {roleObj.label}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{p.partnerName}</h3>
                    <p className="text-xs text-slate-500">
                      Đầu mối: <strong>{p.contactPerson}</strong> • SĐT: {p.phone} • Email: {p.email}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-400 block">Mã đối tác định danh:</span>
                    <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                      {p.partnerCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Tổng lượt giới thiệu</span>
                    <span className="text-base font-black text-slate-900">{p.totalValidReferrals} lượt</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Đã đối soát chi trả</span>
                    <span className="text-base font-black text-emerald-600">{(p.settledAmount || 0).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Chờ đối soát</span>
                    <span className="text-base font-black text-amber-600">{(p.pendingSettlementAmount || 0).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Hợp đồng thỏa thuận</span>
                    <span className="text-xs font-mono font-bold text-slate-800 line-clamp-1">{p.agreementId}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: REFERRALS REVIEW QUEUE (MỤC 40: HÀNG ĐỢI THẨM ĐỊNH REFERRALS) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'REFERRALS' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Kiểm tra tính hợp lệ của lượt giới thiệu (Khách mới? Trùng lặp? Khách cũ?)
            </span>
            <span className="text-slate-500">Hiển thị {filteredReferrals.length} referrals</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredReferrals.map(ref => {
              const statusObj = REFERRAL_STATUSES[ref.status] || { label: ref.status, color: 'blue' };

              return (
                <div key={ref.id} className="p-5 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{ref.id}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {ref.referralCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ref.status === 'VALID' ? 'bg-teal-100 text-teal-800' :
                            ref.status === 'ELIGIBLE_FOR_SETTLEMENT' ? 'bg-emerald-100 text-emerald-800' :
                              ref.status === 'EXISTING_CUSTOMER' ? 'bg-amber-100 text-amber-800' :
                                ref.status === 'DUPLICATE' ? 'bg-rose-100 text-rose-800' :
                                  'bg-slate-100 text-slate-700'
                          }`}>
                          {statusObj.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{ref.referredCompanyName}</h4>
                      <p className="text-xs text-slate-600">
                        Liên hệ: {ref.contactMasked} • Dịch vụ: <strong>{ref.serviceType}</strong>
                      </p>
                      {ref.note && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                          Ghi chú hệ thống: "{ref.note}"
                        </p>
                      )}
                    </div>

                    <div className="text-xs space-y-2 shrink-0">
                      <div className="text-right sm:text-right">
                        <span className="text-slate-400 block text-[11px]">Thời điểm ghi nhận:</span>
                        <span className="text-slate-600">{ref.firstCapturedAt?.split('T')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        {ref.status === 'VALID' && (
                          <button
                            onClick={() => handleReviewReferral(ref.id, 'ELIGIBLE_FOR_SETTLEMENT')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                          >
                            Xác Nhận Đủ ĐK Đối Soát
                          </button>
                        )}
                        {ref.status === 'ELIGIBLE_FOR_SETTLEMENT' && (
                          <button
                            onClick={() => handleReviewReferral(ref.id, 'SETTLED')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                          >
                            Đã Chi Trả Hoàn Tất
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const amt = prompt('Nhập số tiền hoàn hủy cần điều chỉnh giảm trừ (VNĐ):', '5000000');
                            if (amt) adjustSettlementForRefund(ref.id, amt, 'Khách hàng hủy hợp đồng dịch vụ');
                            refreshData();
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold rounded-lg transition"
                        >
                          Hoàn Tiền / Giảm Trừ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: AUDIT LOGS (MỤC 59.17: NHẬT KÝ KIỂM TOÁN) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Nhật Ký Thao Tác Hệ Thống Đối Tác Phát Triển (Audit Logs)
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {auditLogs.map(log => (
              <div key={log.id} className="pt-2 pb-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-800">{log.entityId}</span>
                    <span className="text-slate-400">({log.entityType})</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.note}</p>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <span className="text-slate-400 text-[11px] block">{log.timestamp?.split('T')[0]}</span>
                  <span className="text-slate-500 text-[10px] font-medium">{log.actor?.name || 'Hệ thống'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
