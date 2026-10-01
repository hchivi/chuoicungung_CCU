// ============================================================================
// ADMIN SPONSORSHIPS MANAGEMENT COMPONENT
// ROUTE: /admin/tai-tro & Admin Dashboard Menu
// Chuẩn hóa theo spec 32.txt (Sections 41-47, 50) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Award, Search, Filter, CheckCircle2, AlertTriangle, Calendar,
  Clock, ShieldCheck, Crown, Eye, Download, Plus, ExternalLink,
  ChevronRight, TrendingUp, FileText, Check, X, Building2, Send,
  Users, BookOpen, Video, Gift, DollarSign, BarChart3, AlertCircle
} from 'lucide-react';

import {
  getAllSponsorships,
  getAllSponsorshipInquiries,
  updateSponsorshipStatus,
  updateEntitlementStatus,
  getSponsorshipAuditLogs,
  SPONSORSHIP_TYPES,
  SPONSORSHIP_STATUSES,
  CONTRACT_TYPES,
  DELIVERY_STATUSES
} from '../../data/sponsorshipData';

export default function AdminSponsorshipsManagement({ initialSponsorshipId = null }) {
  const [sponsorships, setSponsorships] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [activeTab, setActiveTab] = useState('INQUIRIES'); // 'INQUIRIES' | 'CONTRACTS' | 'ENTITLEMENTS' | 'AUDIT'
  const [selectedItem, setSelectedItem] = useState(null);

  const refreshData = () => {
    const sponList = getAllSponsorships();
    const inqList = getAllSponsorshipInquiries();
    const logs = getSponsorshipAuditLogs();
    setSponsorships(sponList);
    setInquiries(inqList);
    setAuditLogs(logs);

    if (initialSponsorshipId) {
      const found = sponList.find(s => s.id === initialSponsorshipId) || inqList.find(i => i.id === initialSponsorshipId);
      if (found) setSelectedItem(found);
    }
  };

  useEffect(() => {
    refreshData();
  }, [initialSponsorshipId]);

  // Bộ lọc hợp đồng tài trợ
  const filteredSponsorships = sponsorships.filter(s => {
    const matchSearch = !searchQuery ||
      s.sponsorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.programTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.catalogueTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'ALL' || s.sponsorshipType === selectedType;
    return matchSearch && matchType;
  });

  // Bộ lọc inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchSearch = !searchQuery ||
      inq.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.programTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'ALL' || inq.sponsorshipType === selectedType;
    return matchSearch && matchType;
  });

  // Xử lý chuyển trạng thái inquiry
  const handleUpdateInquiryStatus = (id, newStatus) => {
    try {
      updateSponsorshipStatus(id, newStatus, { name: 'Admin Điều Phối', role: 'ADMIN' }, 'Cập nhật từ bảng quản trị.');
      refreshData();
      alert(`Đã cập nhật trạng thái hồ sơ ${id} sang: ${SPONSORSHIP_STATUSES[newStatus]?.label || newStatus}`);
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  };

  // Xử lý nghiệm thu quyền lợi
  const handleDeliverEntitlement = (sponsorshipId, entitlementId, status) => {
    try {
      updateEntitlementStatus(
        sponsorshipId,
        entitlementId,
        status,
        { type: 'ADMIN_HANDOVER', url: '/admin/tai-tro', note: 'Biên bản nghiệm thu tại bàn điều phối' },
        { name: 'Admin Điều Phối', role: 'ADMIN' }
      );
      refreshData();
      alert(`Đã cập nhật quyền lợi: ${status}`);
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
              Bàn Điều Phối Tài Trợ & Hợp Tác B2B
            </span>
            <span className="text-xs text-slate-400 font-mono">Page 32 Compliant</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Quản Trị Đề Xuất & Quyền Lợi Tài Trợ (Sponsorship Management)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý phễu tiếp nhận đề xuất, phân tách hợp đồng, kiểm soát giao quyền lợi và nghiệm thu minh bạch.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('INQUIRIES')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'INQUIRIES' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hàng Đợi Đề Xuất ({inquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('CONTRACTS')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'CONTRACTS' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Hợp Đồng Active ({sponsorships.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'AUDIT' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên doanh nghiệp, chương trình, ấn phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Loại hình:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="PROGRAM">Tài trợ Chương trình</option>
            <option value="CATALOGUE">Tài trợ Catalogue</option>
            <option value="MEDIA">Tài trợ Media / Nội dung</option>
            <option value="MERCHANDISE">Tài trợ Vật phẩm</option>
          </select>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: INQUIRIES QUEUE (MỤC 43: HÀNG ĐỢI ĐỀ XUẤT MỚI) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'INQUIRIES' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Danh sách đề xuất mới tiếp nhận (Không để inquiry biến mất trong email)
            </span>
            <span className="text-slate-500">Hiển thị {filteredInquiries.length} đề xuất</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredInquiries.map(inq => {
              const statusObj = SPONSORSHIP_STATUSES[inq.status] || { label: inq.status, color: 'blue' };
              const typeObj = SPONSORSHIP_TYPES[inq.sponsorshipType] || { title: inq.sponsorshipType };

              return (
                <div key={inq.id} className="p-5 hover:bg-slate-50/60 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{inq.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {typeObj.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {statusObj.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{inq.organizationName}</h4>
                      <p className="text-xs text-slate-600">
                        Đầu mối: <strong>{inq.contactName}</strong> ({inq.role || 'Đại diện'}) • SĐT: <strong>{inq.phone}</strong> • Email: <strong>{inq.email}</strong>
                      </p>
                      {inq.programTitle && (
                        <p className="text-xs text-blue-700">Hoạt động quan tâm: <strong>{inq.programTitle}</strong></p>
                      )}
                      {inq.catalogueTitle && (
                        <p className="text-xs text-emerald-700">Ấn phẩm quan tâm: <strong>{inq.catalogueTitle}</strong></p>
                      )}
                      {inq.description && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                          "{inq.description}"
                        </p>
                      )}
                    </div>

                    <div className="text-xs space-y-2 shrink-0">
                      <div className="text-right sm:text-right">
                        <span className="text-slate-400 block text-[11px]">Người phụ trách:</span>
                        <span className="font-semibold text-slate-800">{inq.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        {inq.status === 'INQUIRY' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'PROPOSAL_SENT')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                          >
                            Gửi Proposal
                          </button>
                        )}
                        {inq.status === 'PROPOSAL_SENT' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'NEGOTIATION')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                          >
                            Đàm Phán
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'CANCELLED')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold rounded-lg transition"
                        >
                          Hủy
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
      {/* TAB 2: ACTIVE CONTRACTS (HỢP ĐỒNG ĐANG HOẠT ĐỘNG - MỤC 22, 23) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'CONTRACTS' && (
        <div className="space-y-4">
          {filteredSponsorships.map(spon => {
            const contractObj = CONTRACT_TYPES[spon.contractType] || { name: spon.contractType };
            const entitlements = spon.entitlements || [];

            return (
              <div key={spon.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500">{spon.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {spon.roleLabel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {contractObj.name}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{spon.sponsorName}</h3>
                    <p className="text-xs text-slate-500">
                      Gắn với: <strong>{spon.programTitle || spon.catalogueTitle}</strong> • Thời hạn: {spon.startDate} đến {spon.endDate}
                    </p>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-slate-500 block">Hình thức đóng góp:</span>
                    <span className="font-bold text-xs text-slate-800">
                      {spon.contributionType === 'CASH' ? 'Tài trợ tài chính' : 'Hiện vật / Dịch vụ'}
                    </span>
                    {!spon.isCash && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded block mt-0.5 font-medium">
                        (Mục 49: Không ghi nhận cash revenue)
                      </span>
                    )}
                  </div>
                </div>

                {/* Danh mục quyền lợi của hợp đồng */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tiến độ bàn giao quyền lợi ({entitlements.length} quyền lợi)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {entitlements.map(ent => (
                      <div key={ent.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 line-clamp-1">{ent.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              ent.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                              ent.status === 'DELIVERED' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ent.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">Số lượng: {ent.quantity || 1}</span>
                          {ent.acceptedBy && (
                            <span className="text-[10px] text-emerald-700 block">Nghiệm thu: {ent.acceptedBy}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-200">
                          {ent.status !== 'DELIVERED' && ent.status !== 'ACCEPTED' && (
                            <button
                              onClick={() => handleDeliverEntitlement(spon.id, ent.id, 'DELIVERED')}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold transition"
                            >
                              Bàn giao
                            </button>
                          )}
                          {ent.status === 'DELIVERED' && (
                            <button
                              onClick={() => handleDeliverEntitlement(spon.id, ent.id, 'ACCEPTED')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition"
                            >
                              Nghiệm thu
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: AUDIT LOGS (MỤC 60.18: NHẬT KÝ KIỂM TOÁN) */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Nhật Ký Thao Tác Hệ Thống Tài Trợ (Sponsorship Audit Logs)
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
