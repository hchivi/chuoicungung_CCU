// ============================================================================
// ADMIN DATA QUALITY & COMPLETENESS QUEUE (BOARD 02)
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin/to-chuc?tab=quality)
// Chuẩn hóa theo spec 19.txt (Section 7 Board 02 & Section 31) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Search, Filter,
  Building2, UserCheck, Clock, ArrowRight, RefreshCw, Check
} from 'lucide-react';
import {
  getDataQualityQueue,
  logAdminMutationAudit,
  getActiveAdminRole
} from '../../data/adminUnifiedCoordinationData';

export default function AdminDataQualityQueue() {
  const [issues, setIssues] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const activeRole = getActiveAdminRole();

  const loadData = () => {
    setIssues(getDataQualityQueue());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredIssues = issues.filter(item => {
    if (filterSeverity !== 'ALL' && item.severity !== filterSeverity) return false;
    return true;
  });

  const handleResolveIssue = (issueId, orgName) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
    logAdminMutationAudit({
      action: 'DATA_QUALITY_ISSUE_RESOLVED',
      entityType: 'ORGANIZATION',
      entityId: issueId,
      actor: activeRole.name,
      details: `Đã xác thực và giải quyết cảnh báo chất lượng dữ liệu cho doanh nghiệp ${orgName}.`
    });
    setActionSuccessMsg(`Đã giải quyết cảnh báo của ${orgName}!`);
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>BOARD 02: HỒ SƠ & DỮ LIỆU CẦN KIỂM TRA (SECTION 7 & 31)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Hàng Đợi Kiểm Soát Chất Lượng Dữ Liệu Hồ Sơ
          </h2>
          <p className="text-xs text-slate-500">
            Phát hiện các hồ sơ thiếu năng lực, thiếu MOQ, chứng từ hết hạn hoặc yêu cầu nhận quyền quản trị (Claim) đang chờ duyệt.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="ALL">Tất cả mức độ cảnh báo</option>
            <option value="CRITICAL">Mức Khẩn Cấp (Critical)</option>
            <option value="HIGH">Mức Cao (High)</option>
            <option value="MEDIUM">Mức Trung Bình (Medium)</option>
            <option value="LOW">Mức Thấp (Low)</option>
          </select>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Issues Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10.5px] uppercase">
                <th className="p-4">Mức Độ</th>
                <th className="p-4">Doanh Nghiệp</th>
                <th className="p-4">Vấn Đề Dữ Liệu Phát Hiện</th>
                <th className="p-4">Chi Tiết Cần Bổ Sung</th>
                <th className="p-4">Người Phụ Trách</th>
                <th className="p-4">Hạn Xử Lý</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-emerald-600 font-bold font-mono">
                    🎉 Tuyệt vời! Không có hồ sơ nào bị cảnh báo chất lượng dữ liệu.
                  </td>
                </tr>
              ) : (
                filteredIssues.map(issue => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        issue.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : issue.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      {issue.orgName}
                    </td>

                    <td className="p-4 text-slate-800 font-medium">
                      {issue.title}
                    </td>

                    <td className="p-4 text-slate-500 text-[11px] max-w-xs">
                      {issue.details}
                    </td>

                    <td className="p-4 font-mono text-slate-600">
                      {issue.ownerName}
                    </td>

                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {issue.dueAt?.slice(0, 10)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleResolveIssue(issue.id, issue.orgName)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg font-bold text-xs transition cursor-pointer border border-emerald-200"
                      >
                        Đã xác minh
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
