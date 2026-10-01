// ============================================================================
// ADMIN COMPONENT: QUẢN TRỊ HỘI / HIỆP HỘI & DUYỆT HỘI VIÊN
// TUÂN THỦ SECTION 28, 29, 30, 31, 32 SPEC 24.TXT
// ============================================================================

import React, { useState } from 'react';
import {
  Landmark, Users, ShieldCheck, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, Plus, Calendar, Clock, ArrowRight, ExternalLink,
  Edit3, Check, X, FileText, ChevronRight, AlertTriangle, Eye
} from 'lucide-react';
import {
  getAssociationsListing,
  getAllOrganizationMemberships,
  getAllProgramOrganizations,
  reviewMembershipClaimAdmin,
  getAllAssociationAuditLogs,
  MEMBERSHIP_STATUS_ENUM,
  PROGRAM_ORG_STATUS_ENUM
} from '../../data/associationsData';

export default function AdminAssociationsManagement() {
  const [activeTab, setActiveTab] = useState('associations'); // 'associations' | 'claims' | 'program_relations' | 'logs'
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Listing data
  const listingData = getAssociationsListing({ query: searchTerm });
  const allMemberships = getAllOrganizationMemberships();
  const allProgOrgs = getAllProgramOrganizations();
  const auditLogs = getAllAssociationAuditLogs();

  // Pending claims for badge
  const pendingClaims = allMemberships.filter(m => m.status === MEMBERSHIP_STATUS_ENUM.PENDING);

  // Handle Review Claim
  const handleReview = (claimId, decision) => {
    const notes = prompt(`Nhập ghi chú cho quyết định [${decision}]:`, 'Đã đối chiếu danh bạ hội viên.');
    try {
      reviewMembershipClaimAdmin(claimId, decision, {
        reviewer: 'Lê Minh Quân (Admin Trưởng ban Hợp tác)',
        notes: notes || ''
      });
      alert(`Đã xử lý hồ sơ: ${decision}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      alert(err.message || 'Lỗi xử lý');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-50 text-[#0052cc] text-xs font-bold font-mono">
            <Landmark className="w-3.5 h-3.5" />
            <span>PAGE 24 ADMIN MANAGEMENT ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
            Quản Lý Hội / Hiệp Hội & Hàng Đợi Duyệt Hội Viên
          </h2>
          <p className="text-xs text-slate-500">
            Giám sát hồ sơ tổ chức, thẩm tra quan hệ Chương trình và duyệt đề nghị liên kết hội viên chính thức.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('associations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'associations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Danh Sách Hội ({listingData.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'claims' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Duyệt Hội Viên ({pendingClaims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('program_relations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'program_relations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quan Hệ Sự Kiện ({allProgOrgs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DANH SÁCH HỘI & HIỆP HỘI (SECTION 28 & 32) */}
      {activeTab === 'associations' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm Hội theo tên, viết tắt hoặc địa bàn..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {listingData.associations.length} tổ chức
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10.5px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tổ chức / Viết tắt</th>
                  <th className="py-3 px-4">Phạm vi & Địa bàn</th>
                  <th className="py-3 px-4">Chương trình Active</th>
                  <th className="py-3 px-4">Hội viên xác thực</th>
                  <th className="py-3 px-4">Chủ trì (Owner) & Next Action</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listingData.associations.map(assoc => (
                  <tr key={assoc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug line-clamp-1">{assoc.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ID: {assoc.id} {assoc.profile?.shortName && `• [${assoc.profile.shortName}]`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] rounded font-bold text-[10px] font-mono">
                        {assoc.profile?.scopeType || 'NATIONAL'}
                      </span>
                      <div className="text-[11px] text-slate-500 pt-0.5">{assoc.province || 'Toàn quốc'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        assoc.activePrograms?.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {assoc.activePrograms?.length || 0} Sự kiện
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {assoc.verifiedMembersCount || 200}+
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-semibold text-slate-800">{assoc.profile?.ownerName || 'Chưa gán'}</div>
                      <div className="text-[10.5px] text-slate-500 line-clamp-1">
                        👉 {assoc.profile?.nextAction || 'Khảo sát định kỳ'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/hoi-hiep-hoi/${assoc.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0052cc] rounded-lg text-[11px] font-bold transition inline-flex items-center space-x-1"
                      >
                        <span>Hồ sơ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HÀNG ĐỢI DUYỆT HỘI VIÊN (SECTION 30 SPEC 24.TXT) */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 font-heading">
                Hàng Đợi Kiểm Duyệt Đề Nghị Hội Viên (Membership Claims Review)
              </h3>
              <p className="text-xs text-slate-500">
                Quy tắc Section 30: Không auto approve. Phải đối chiếu với sổ bộ hội viên trước khi xác nhận.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold text-xs border border-amber-200">
              {pendingClaims.length} Chờ thẩm tra
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10.5px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã Claim / Ngày gửi</th>
                  <th className="py-3 px-4">Doanh nghiệp đề nghị</th>
                  <th className="py-3 px-4">Hiệp hội mục tiêu</th>
                  <th className="py-3 px-4">Ghi chú & Bằng chứng</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allMemberships.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">{claim.id}</span>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('vi-VN') : '28/09/2026'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{claim.memberOrganizationName}</div>
                      <div className="text-[11px] text-slate-500">{claim.requester?.name || 'Đại diện DN'} - {claim.requester?.phone || ''}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {claim.associationOrganizationId}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {claim.evidenceNotes || 'Chưa cung cấp'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                        claim.status === MEMBERSHIP_STATUS_ENUM.CONFIRMED ? 'bg-emerald-50 text-emerald-700' :
                        claim.status === MEMBERSHIP_STATUS_ENUM.REJECTED ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {claim.status === MEMBERSHIP_STATUS_ENUM.PENDING ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleReview(claim.id, 'APPROVE')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleReview(claim.id, 'REJECT')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROGRAM RELATIONS REVIEW (SECTION 31 SPEC 24.TXT) */}
      {activeTab === 'program_relations' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 font-heading">
              Thẩm Định Vai Trò Tổ Chức Trong Chương Trình (Section 31)
            </h3>
            <p className="text-xs text-slate-500">
              Quy tắc Section 31: Chỉ quan hệ có trạng thái CONFIRMED mới được công khai trên giao diện người dùng.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10.5px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Chương trình</th>
                  <th className="py-3 px-4">Tổ chức / Hiệp hội</th>
                  <th className="py-3 px-4">Vai trò khai báo</th>
                  <th className="py-3 px-4">Trạng thái xác nhận</th>
                  <th className="py-3 px-4">Public UI?</th>
                  <th className="py-3 px-4 text-right">Người xác nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allProgOrgs.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{po.programTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{po.programId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {po.organizationId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] rounded font-bold text-[10px] font-mono">
                        {po.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                        po.status === PROGRAM_ORG_STATUS_ENUM.CONFIRMED ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {po.publicDisplay ? (
                        <span className="text-emerald-600 font-bold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Hiển thị</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic flex items-center space-x-1">
                          <X className="w-3.5 h-3.5" />
                          <span>Bị chặn (Pending)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {po.confirmedBy || 'Chưa duyệt'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS (SECTION 41.13) */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 font-heading">
              Nhật Ký Thẩm Tra & Quyết Định (Association Audit Logs)
            </h3>
            <p className="text-xs text-slate-500">
              Lưu vết 100% các hành động gửi đề nghị hội viên, thẩm định quan hệ và quyết định phê duyệt của Ban Điều Hành.
            </p>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">Chưa có nhật ký phát sinh trong phiên này.</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold text-[10px]">
                        {log.action}
                      </span>
                      <span className="font-bold text-slate-800">{log.entityId}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px]">{log.details}</p>
                  </div>
                  <div className="text-right text-[10.5px] font-mono text-slate-400 shrink-0">
                    <div>{log.actor}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
