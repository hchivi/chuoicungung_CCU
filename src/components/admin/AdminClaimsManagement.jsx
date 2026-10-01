import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, Filter, CheckCircle2, AlertCircle, 
  X, Clock, Building2, UserCheck, FileText, ArrowRight,
  RefreshCw, ThumbsUp, ThumbsDown, AlertTriangle, Eye, Layers
} from 'lucide-react';
import { 
  getAllClaims, 
  adminReviewClaim,
  getAllOrganizations,
  getAllOrgAuditLogs
} from '../../data/organizationsData';

export default function AdminClaimsManagement() {
  const [claims, setClaims] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rejection modal
  const [rejectModal, setRejectModal] = useState({ isOpen: false, claimId: null, reason: '' });

  const loadData = () => {
    setClaims(getAllClaims());
    setOrganizations(getAllOrganizations());
    setAuditLogs(getAllOrgAuditLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredClaims = claims.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchOrg = (c.organizationName || '').toLowerCase().includes(q);
      const matchUser = (c.requesterName || '').toLowerCase().includes(q);
      const matchId = (c.id || '').toLowerCase().includes(q);
      if (!matchOrg && !matchUser && !matchId) return false;
    }
    return true;
  });

  const handleApprove = (claimId) => {
    adminReviewClaim({
      claimId,
      action: 'APPROVED',
      reviewer: 'Admin Master',
      reason: 'Bằng chứng xác thực hợp lệ (Email domain / Giấy phép ĐKKD).'
    });
    loadData();
  };

  const handleRequestMoreInfo = (claimId) => {
    const note = prompt('Nhập yêu cầu bổ sung bằng chứng xác thực (VD: Cần bổ sung giấy ủy quyền có dấu mộc đỏ):');
    if (!note) return;
    adminReviewClaim({
      claimId,
      action: 'NEED_MORE_INFO',
      reviewer: 'Admin Master',
      reason: note
    });
    loadData();
  };

  const handleConfirmReject = () => {
    if (!rejectModal.reason.trim()) {
      alert('Vui lòng nhập lý do từ chối yêu cầu.');
      return;
    }
    adminReviewClaim({
      claimId: rejectModal.claimId,
      action: 'REJECTED',
      reviewer: 'Admin Master',
      reason: rejectModal.reason
    });
    setRejectModal({ isOpen: false, claimId: null, reason: '' });
    loadData();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Yêu cầu Quản lý Hồ sơ Doanh nghiệp (Claims)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xác minh quyền sở hữu pháp nhân, phê duyệt quyền quản trị tổ chức (organization_user membership) và đối chiếu bằng chứng (Section 12).
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Làm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã claim, tên doanh nghiệp..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">PENDING (Chờ xác minh)</option>
              <option value="NEED_MORE_INFO">NEED_MORE_INFO (Cần bổ sung)</option>
              <option value="APPROVED">APPROVED (Đã duyệt quyền)</option>
              <option value="REJECTED">REJECTED (Từ chối)</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-500 font-mono">
          Tổng số: <strong>{filteredClaims.length}</strong> yêu cầu
        </div>
      </div>

      {/* Claims Table (Section 12) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã Claim</th>
                <th className="py-3 px-4">Tổ chức / Doanh nghiệp</th>
                <th className="py-3 px-4">Người yêu cầu</th>
                <th className="py-3 px-4">Vai trò đề xuất</th>
                <th className="py-3 px-4">Bằng chứng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ngày gửi</th>
                <th className="py-3 px-4 text-right">Thao tác Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không có yêu cầu quyền quản lý nào trong bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">
                        {c.organizationName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {c.organizationId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{c.requesterName}</div>
                      <div className="text-[10px] text-slate-400">{c.businessEmail} • {c.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.requestedRoles?.map((r, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] font-medium text-slate-800">
                        {c.evidenceType}
                      </div>
                      {c.evidenceAttachments?.length > 0 && (
                        <div className="text-[10px] text-blue-600 hover:underline cursor-pointer">
                          📎 {c.evidenceAttachments[0]}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'NEED_MORE_INFO' ? 'bg-amber-100 text-amber-800' :
                        c.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {c.status === 'PENDING' || c.status === 'NEED_MORE_INFO' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRequestMoreInfo(c.id)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold"
                            title="Yêu cầu bổ sung bằng chứng"
                          >
                            Bổ sung
                          </button>
                          <button
                            onClick={() => setRejectModal({ isOpen: true, claimId: c.id, reason: '' })}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold"
                            title="Từ chối yêu cầu"
                          >
                            Từ chối
                          </button>
                          <button
                            onClick={() => handleApprove(c.id)}
                            className="px-3 py-1 bg-[#0052cc] hover:bg-[#0047a5] text-white rounded-lg text-xs font-bold shadow-xs"
                            title="Xác nhận cấp quyền quản lý"
                          >
                            Xác nhận
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Đã xử lý ({c.reviewedBy})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-[1300] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Từ chối yêu cầu quản lý hồ sơ
            </h3>
            <p className="text-xs text-slate-500">
              Vui lòng nêu rõ lý do không cấp quyền quản trị (VD: Không chứng minh được tư cách đại diện hợp pháp của doanh nghiệp).
            </p>
            <textarea
              required
              rows={3}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder="Nhập lý do từ chối..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal({ isOpen: false, claimId: null, reason: '' })}
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
