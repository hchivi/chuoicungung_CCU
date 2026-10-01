import React, { useState } from 'react';
import {
  FileText, CheckCircle2, Clock, AlertTriangle, Search, Filter,
  Eye, Check, X, ShieldAlert, Package, MessageSquare, QrCode,
  UserCheck, ChevronRight, Sparkles, Send, RefreshCw, Calendar,
  Building2, MapPin, ExternalLink, Plus, History, Lock, Globe
} from 'lucide-react';
import {
  DOSSIER_TYPES,
  DOSSIER_VISIBILITY,
  DOSSIER_STATUSES,
  ENTRY_STATUSES,
  getAllSourcingDossiers,
  addCandidateToDossier,
  updateCandidateStatus,
  createDossierVersion
} from '../../data/sourcingDossiersData.js';

export default function AdminSourcingDossiersManagement() {
  const [dossiers, setDossiers] = useState(getAllSourcingDossiers());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedDossier, setSelectedDossier] = useState(dossiers[0] || null);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, CRITERIA, CANDIDATES, ADJUSTMENTS, VERSIONS, AUDIT

  // Form Thêm Ứng viên mới
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newInclusionReason, setNewInclusionReason] = useState('');
  const [newSupplierSlug, setNewSupplierSlug] = useState('');
  const [addError, setAddError] = useState('');

  // Form Phát hành Phiên bản mới
  const [newVersionTag, setNewVersionTag] = useState('');
  const [newVersionSummary, setNewVersionSummary] = useState('');

  const refreshData = () => {
    const list = getAllSourcingDossiers();
    setDossiers(list);
    if (selectedDossier) {
      const updated = list.find(d => d.id === selectedDossier.id);
      setSelectedDossier(updated || list[0] || null);
    }
  };

  const filteredDossiers = dossiers.filter(d => {
    const matchesSearch =
      d.publicCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.requirementId && d.requirementId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || d.dossierType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddCandidate = (e) => {
    e.preventDefault();
    setAddError('');
    if (!newSupplierName.trim() || !newInclusionReason.trim()) {
      setAddError('Bắt buộc phải nhập tên nhà cung ứng và LÝ DO ĐƯA VÀO.');
      return;
    }

    try {
      addCandidateToDossier(selectedDossier.id, {
        supplierOrganizationId: `ORG-MANUAL-${Date.now()}`,
        supplierName: newSupplierName,
        supplierSlug: newSupplierSlug || 'ncc-moi',
        inclusionReason: newInclusionReason
      }, { userId: 'ADMIN-SOURCING' });

      setNewSupplierName('');
      setNewInclusionReason('');
      setNewSupplierSlug('');
      refreshData();
    } catch (err) {
      setAddError(err.message || 'Lỗi thêm ứng viên.');
    }
  };

  const handleUpdateStatus = (candidateId, newStatus) => {
    const reason = prompt(`Nhập lý do chuyển trạng thái sang [${newStatus}]:`, 'Thẩm định hồ sơ bổ sung');
    if (reason !== null) {
      updateCandidateStatus(selectedDossier.id, candidateId, newStatus, reason, { userId: 'ADMIN-SOURCING' });
      refreshData();
    }
  };

  const handleCreateVersion = (e) => {
    e.preventDefault();
    if (!newVersionTag.trim() || !newVersionSummary.trim()) return;

    createDossierVersion(selectedDossier.id, newVersionTag, newVersionSummary, { fullName: 'Admin Điều Phối' });
    setNewVersionTag('');
    setNewVersionSummary('');
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Quản Trị Bộ Hồ Sơ Tuyển Chọn (Sourcing Dossiers)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối danh sách ứng viên có tiêu chí, nguồn gốc đối soát và quản lý phiên bản (/admin/bo-ho-so)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Tổng bộ hồ sơ: {dossiers.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Danh sách & Chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: DANH SÁCH BỘ HỒ SƠ (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm mã BHS, tên hồ sơ, NC-..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Phân loại:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700"
              >
                <option value="ALL">Tất cả ({dossiers.length})</option>
                <option value={DOSSIER_TYPES.REQUIREMENT_SHORTLIST}>Khớp Nhu cầu</option>
                <option value={DOSSIER_TYPES.CATEGORY_SHORTLIST}>Chuyên mục</option>
                <option value={DOSSIER_TYPES.CUSTOM_SOURCING}>Đề bài riêng</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredDossiers.map((d) => {
              const isSelected = selectedDossier?.id === d.id;

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDossier(d)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700">{d.publicCode}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.visibility === DOSSIER_VISIBILITY.PUBLIC
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {d.visibility}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {d.version}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">{d.title}</h4>
                  
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Ứng viên: <strong className="text-slate-700">{d.candidates?.length || 0}</strong></span>
                    <span>Tiêu chí: <strong className="text-slate-700">{d.criteria?.length || 0}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT ĐIỀU PHỐI (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDossier ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{selectedDossier.publicCode}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {selectedDossier.id}
                      </span>
                      <a
                        href={`/bo-ho-so/${selectedDossier.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Mở trang Public</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDossier.title}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 block">Phụ trách:</span>
                    <span className="text-xs font-bold text-slate-800">{selectedDossier.preparedBy?.role}</span>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 mt-4 overflow-x-auto pt-2 border-t border-slate-200 text-xs">
                  {[
                    { id: 'OVERVIEW', label: 'Mục đích & Tổng quan' },
                    { id: 'CRITERIA', label: 'Tiêu chí tuyển chọn' },
                    { id: 'CANDIDATES', label: `Ứng viên (${selectedDossier.candidates?.length || 0})` },
                    { id: 'VERSIONS', label: `Phiên bản (${selectedDossier.versions?.length || 0})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* 1. OVERVIEW */}
                {activeTab === 'OVERVIEW' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Mục đích đề bài:</span>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {selectedDossier.purpose}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-slate-500 block">Nhu cầu liên kết:</span>
                        <span className="font-bold text-slate-800">{selectedDossier.requirementId || 'Không gắn'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Khu công nghiệp:</span>
                        <span className="font-bold text-slate-800">{selectedDossier.industrialParkName || 'Toàn tỉnh'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CRITERIA */}
                {activeTab === 'CRITERIA' && (
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-700 block">Danh sách tiêu chí đối soát:</span>
                    <div className="space-y-2">
                      {selectedDossier.criteria?.map(crit => (
                        <div key={crit.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800">{crit.label}</span>
                            {crit.required && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                                Bắt buộc
                              </span>
                            )}
                          </div>
                          <p className="text-blue-900 font-semibold">{crit.expectedValue}</p>
                          <span className="text-[11px] text-slate-500 mt-1 block">Nguồn: {crit.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CANDIDATES */}
                {activeTab === 'CANDIDATES' && (
                  <div className="space-y-4 text-xs">
                    {/* Form thêm ứng viên (Section 49) */}
                    <form onSubmit={handleAddCandidate} className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                      <span className="font-bold text-blue-900 block">Thêm ứng viên mới vào bộ hồ sơ:</span>
                      {addError && <p className="text-rose-600 text-xs">{addError}</p>}
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Tên nhà cung ứng..."
                          value={newSupplierName}
                          onChange={(e) => setNewSupplierName(e.target.value)}
                          className="p-2 bg-white border border-slate-300 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Slug hồ sơ (tùy chọn)..."
                          value={newSupplierSlug}
                          onChange={(e) => setNewSupplierSlug(e.target.value)}
                          className="p-2 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="LÝ DO ĐƯA VÀO (Bắt buộc - giải thích rõ năng lực, cự ly, chứng chỉ...)"
                        value={newInclusionReason}
                        onChange={(e) => setNewInclusionReason(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
                        >
                          Bổ Sung Ứng Viên
                        </button>
                      </div>
                    </form>

                    {/* Danh sách ứng viên hiện có */}
                    <div className="space-y-3">
                      {selectedDossier.candidates?.map((cand) => (
                        <div key={cand.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-800">{cand.supplierName}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              cand.status === ENTRY_STATUSES.SHORTLISTED
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {cand.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                            <strong>Lý do:</strong> {cand.inclusionReason}
                          </p>

                          <div className="flex justify-end gap-2 pt-1">
                            {cand.status !== ENTRY_STATUSES.SHORTLISTED && (
                              <button
                                onClick={() => handleUpdateStatus(cand.id, ENTRY_STATUSES.SHORTLISTED)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded text-xs"
                              >
                                Đưa vào Shortlist
                              </button>
                            )}
                            {cand.status !== ENTRY_STATUSES.NOT_SUITABLE && (
                              <button
                                onClick={() => handleUpdateStatus(cand.id, ENTRY_STATUSES.NOT_SUITABLE)}
                                className="px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded text-xs"
                              >
                                Chưa phù hợp
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. VERSIONS (Section 33, 34) */}
                {activeTab === 'VERSIONS' && (
                  <div className="space-y-4 text-xs">
                    <form onSubmit={handleCreateVersion} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="font-bold text-slate-800 block">Phát hành phiên bản mới (Versioning):</span>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Mã phiên bản (VD: v2.2)..."
                          value={newVersionTag}
                          onChange={(e) => setNewVersionTag(e.target.value)}
                          className="p-2 bg-white border border-slate-300 rounded text-xs"
                        />
                        <div className="col-span-2">
                          <input
                            type="text"
                            required
                            placeholder="Tóm tắt thay đổi phiên bản..."
                            value={newVersionSummary}
                            onChange={(e) => setNewVersionSummary(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs"
                        >
                          Phát Hành Phiên Bản
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2">
                      {selectedDossier.versions?.map((ver, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono font-bold text-blue-700">{ver.version}</span>
                            <span className="text-slate-400 text-[11px]">{new Date(ver.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <p className="text-slate-700">{ver.summary}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">Người tạo: {ver.createdBy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              Chọn một bộ hồ sơ bên trái để xem chi tiết điều phối.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
