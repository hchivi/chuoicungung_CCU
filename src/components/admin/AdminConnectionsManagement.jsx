// ============================================================================
// ADMIN CONNECTIONS & MATCHING MATRIX (BOARD 03)
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin/connections)
// Chuẩn hóa theo spec 19.txt (Section 5 & Section 7 Board 03) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Handshake, Search, Filter, Eye, CheckCircle2, Clock,
  ArrowRight, ShieldCheck, RefreshCw, Check, X, AlertTriangle,
  Building2, MapPin, DollarSign, Calendar, FileText, Send, PhoneCall
} from 'lucide-react';
import {
  getAllConnections,
  saveAllConnections,
  updateConnectionOutcome,
  MATCH_STATUSES,
  OUTCOME_TYPES,
  logAdminMutationAudit,
  getActiveAdminRole
} from '../../data/adminUnifiedCoordinationData';

export default function AdminConnectionsManagement() {
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  
  // Quick edit status state
  const [editStatus, setEditStatus] = useState('');
  const [editOutcome, setEditOutcome] = useState('');
  const [editNextAction, setEditNextAction] = useState('');
  const [editNextActionAt, setEditNextActionAt] = useState('');

  const activeRole = getActiveAdminRole();
  const nowIso = new Date().toISOString();

  const loadData = () => {
    setConnections(getAllConnections());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredConnections = useMemo(() => {
    return connections.filter(conn => {
      if (statusFilter !== 'ALL' && conn.matchStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchReq = (conn.requirementCode || '').toLowerCase().includes(q) || (conn.requirementTitle || '').toLowerCase().includes(q);
        const matchSupplier = (conn.supplierName || '').toLowerCase().includes(q);
        const matchBuyer = (conn.buyerCompanyName || '').toLowerCase().includes(q);
        if (!matchReq && !matchSupplier && !matchBuyer) return false;
      }
      return true;
    });
  }, [connections, statusFilter, searchQuery]);

  const handleUpdateStatus = (connId, newStatus) => {
    const list = getAllConnections();
    const idx = list.findIndex(c => c.id === connId);
    if (idx >= 0) {
      const old = list[idx].matchStatus;
      list[idx].matchStatus = newStatus;
      list[idx].updatedAt = new Date().toISOString();
      saveAllConnections(list);
      logAdminMutationAudit({
        action: 'MATCH_STATUS_CHANGED',
        entityType: 'SUPPLIER_MATCH',
        entityId: connId,
        actor: activeRole.name,
        details: `Cập nhật trạng thái ghép nối NCC ${list[idx].supplierName}: [${old}] -> [${newStatus}].`
      });
      loadData();
      setActionSuccessMsg('Đã cập nhật trạng thái kết nối thành công!');
      setTimeout(() => setActionSuccessMsg(''), 2500);
    }
  };

  const handleSaveModal = () => {
    if (!selectedConnection) return;
    const list = getAllConnections();
    const idx = list.findIndex(c => c.id === selectedConnection.id);
    if (idx >= 0) {
      if (editStatus) list[idx].matchStatus = editStatus;
      if (editOutcome) list[idx].outcome = editOutcome;
      if (editNextAction) list[idx].nextAction = editNextAction;
      if (editNextActionAt) list[idx].nextActionAt = editNextActionAt;
      list[idx].updatedAt = new Date().toISOString();
      saveAllConnections(list);

      logAdminMutationAudit({
        action: 'CONNECTION_UPDATED',
        entityType: 'CONNECTION',
        entityId: selectedConnection.id,
        actor: activeRole.name,
        details: `Cập nhật hành động tiếp theo và outcome cho kết nối ${selectedConnection.id}.`
      });

      loadData();
      setSelectedConnection(null);
      setActionSuccessMsg('Đã lưu thông tin kết nối thành công!');
      setTimeout(() => setActionSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-1">
            <Handshake className="w-3.5 h-3.5 text-purple-600" />
            <span>BOARD 03: KẾT NỐI TỪNG NHÀ CUNG CẤP (SECTION 7)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Quản Lý Kết Nối & Trạng Thái Ghép Nối NCC
          </h2>
          <p className="text-xs text-slate-500">
            Mỗi cặp Nhu Cầu x Nhà Cung Ứng có trạng thái riêng: Mẫu, Khảo sát, Báo giá, Đàm phán và Kết quả.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm NCC, mã Nhu cầu, Buyer..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none w-56 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
          >
            <option value="ALL">Tất cả trạng thái ghép nối</option>
            {Object.values(MATCH_STATUSES).map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
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

      {/* Connections Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10.5px] uppercase">
                <th className="p-4">Nhu Cầu Buyer</th>
                <th className="p-4">Nhà Cung Ứng</th>
                <th className="p-4">Trạng Thái Ghép Nối</th>
                <th className="p-4">Mẫu / Khảo Sát</th>
                <th className="p-4">Báo Giá</th>
                <th className="p-4">Hành Động Tiếp Theo</th>
                <th className="p-4">Phụ Trách</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConnections.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 italic font-mono">
                    Không có kết nối nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredConnections.map(conn => {
                  const isOverdue = conn.nextActionAt && conn.nextActionAt < nowIso;

                  return (
                    <tr key={conn.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Requirement */}
                      <td className="p-4 space-y-0.5 max-w-[200px]">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {conn.requirementCode}
                        </span>
                        <div className="font-bold text-slate-900 truncate" title={conn.requirementTitle}>
                          {conn.requirementTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {conn.buyerCompanyName}
                        </div>
                      </td>

                      {/* Supplier */}
                      <td className="p-4 space-y-0.5 max-w-[180px]">
                        <div className="font-bold text-slate-900 truncate" title={conn.supplierName}>
                          {conn.supplierName}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {conn.matchReason}
                        </div>
                      </td>

                      {/* Match Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={conn.matchStatus}
                          onChange={(e) => handleUpdateStatus(conn.id, e.target.value)}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold outline-none cursor-pointer"
                        >
                          {Object.values(MATCH_STATUSES).map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Sample & Survey */}
                      <td className="p-4 space-y-0.5 text-[11px] font-mono">
                        <div>Mẫu: <strong>{conn.sampleStatus}</strong></div>
                        <div className="text-slate-400">Khảo sát: {conn.surveyStatus}</div>
                      </td>

                      {/* Quotation */}
                      <td className="p-4 font-mono font-bold text-emerald-800 text-[11px]">
                        {conn.quotationAmount}
                      </td>

                      {/* Next Action & Due */}
                      <td className="p-4 space-y-0.5 max-w-[200px]">
                        <div className="text-slate-800 line-clamp-1" title={conn.nextAction}>
                          {conn.nextAction}
                        </div>
                        <div className={`text-[10px] font-mono flex items-center space-x-1 ${
                          isOverdue ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{conn.nextActionAt ? conn.nextActionAt.slice(0, 10) : 'Chưa hẹn'}</span>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="p-4 text-[11px] font-mono text-slate-600">
                        {conn.ownerName?.split(' ')[0]}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedConnection(conn);
                            setEditStatus(conn.matchStatus);
                            setEditOutcome(conn.outcome || 'NEGOTIATING');
                            setEditNextAction(conn.nextAction || '');
                            setEditNextActionAt(conn.nextActionAt ? conn.nextActionAt.slice(0, 10) : '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg font-bold text-xs transition cursor-pointer"
                        >
                          Chi tiết
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

      {/* Edit Connection Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-700">Chi tiết kết nối</span>
                <h3 className="text-base font-black text-slate-900 font-heading">{selectedConnection.supplierName}</h3>
                <p className="text-xs text-slate-500">Nhu cầu: {selectedConnection.requirementTitle}</p>
              </div>
              <button onClick={() => setSelectedConnection(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Trạng thái ghép nối:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {Object.values(MATCH_STATUSES).map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Xác nhận Outcome thực tế (Section 17):</label>
                <select
                  value={editOutcome}
                  onChange={(e) => setEditOutcome(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {Object.values(OUTCOME_TYPES).map(out => (
                    <option key={out.id} value={out.id}>{out.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Việc tiếp theo (Next Action):</label>
                <input
                  type="text"
                  value={editNextAction}
                  onChange={(e) => setEditNextAction(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Ngày hẹn tiếp theo (Due Date):</label>
                <input
                  type="date"
                  value={editNextActionAt}
                  onChange={(e) => setEditNextActionAt(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedConnection(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-heading uppercase cursor-pointer"
              >
                Lưu kết nối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
