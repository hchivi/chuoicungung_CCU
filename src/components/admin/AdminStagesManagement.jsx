import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Plus, Edit, Trash2, Eye, EyeOff, Check, X,
  Tag, Building2, Package, Calendar, FileText, Crown, Globe,
  History, ArrowRight, ShieldCheck, AlertCircle, Save, RotateCcw,
  Sparkles, CheckCircle2, ChevronRight, Compass, FolderTree
} from 'lucide-react';
import { 
  MASTER_SIX_STAGES, 
  getAdminStages, 
  saveAdminStage, 
  getStageRealMetrics,
  slugify 
} from '../../data/sixStagesData';
import { getAdminAuditLogs } from '../../data/categoryHubData';

export default function AdminStagesManagement() {
  const [stages, setStages] = useState(() => getAdminStages());
  const [auditLogs, setAuditLogs] = useState(() => getAdminAuditLogs());
  const [selectedStageId, setSelectedStageId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const selectedStage = useMemo(() => {
    return stages.find(s => s.id === selectedStageId) || stages[0];
  }, [stages, selectedStageId]);

  // Real metrics calculated dynamically
  const metrics = useMemo(() => {
    return getStageRealMetrics(selectedStageId);
  }, [selectedStageId]);

  const handleSelectStage = (sId) => {
    setSelectedStageId(sId);
    const target = stages.find(s => s.id === sId);
    setEditForm(target ? { ...target } : null);
    setIsEditing(false);
    setSaveSuccessMsg('');
  };

  const handleSave = () => {
    if (!editForm) return;

    const updated = {
      ...editForm,
      slug: slugify(editForm.slug || editForm.name)
    };

    const success = saveAdminStage(updated);
    if (success) {
      setStages(getAdminStages());
      setIsEditing(false);
      setSaveSuccessMsg(`Đã cập nhật Giai đoạn ${updated.id}: ${updated.name} thành công và lưu Audit Log!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleArchive = () => {
    if (!confirm(`Bạn có chắc muốn chuyển Giai đoạn ${selectedStage.id} sang trạng thái ARCHIVED? Không xóa cứng để bảo vệ dữ liệu chuỗi cung ứng.`)) {
      return;
    }
    const updated = { ...selectedStage, status: 'ARCHIVED', publishable: false };
    saveAdminStage(updated);
    setStages(getAdminStages());
    setEditForm(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 font-mono uppercase">
            <Layers className="w-4 h-4" />
            <span>QUẢN LÝ BẢN ĐỒ 6 GIAI ĐOẠN CHUỖI CUNG ỨNG (PAGE 10)</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 font-heading">
            Quản Trị Vòng Đời & Phân Tách Nhu Cầu 6 Giai Đoạn
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị URL /ban-do-6-giai-doan, các nhóm nhu cầu (Pha), liên kết chuyên mục ngành và nhà cung ứng.
          </p>
        </div>

        <a
          href="/ban-do-6-giai-doan"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-2 transition"
        >
          <Compass className="w-4 h-4" />
          <span>Xem Bản Đồ Live</span>
        </a>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 6 Stages List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase font-mono px-1">
            DANH SÁCH 6 GIAI ĐOẠN MASTER
          </h3>

          <div className="space-y-2">
            {stages.map(st => {
              const isSelected = selectedStageId === st.id;
              const stMetrics = getStageRealMetrics(st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => handleSelectStage(st.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between space-x-3 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span 
                      style={{ backgroundColor: st.color }}
                      className="w-7 h-7 rounded-xl text-white text-xs font-black flex items-center justify-center font-mono shrink-0 shadow-2xs"
                    >
                      {st.id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate font-heading">
                        {st.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {st.needGroups?.length || 0} pha • {stMetrics.supplierCount} NCC
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    st.status === 'ACTIVE' && st.publishable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {st.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stage Detail & Tree Hierarchy (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono text-blue-600 font-bold uppercase">
                GIAI ĐOẠN {selectedStage.id} • VÒNG ĐỜI NHÀ MÁY
              </span>
              <h2 className="text-lg font-black text-slate-900 font-heading">
                {selectedStage.name}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Giai Đoạn</span>
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditForm(null); }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsEditing(true); setEditForm({ ...selectedStage }); }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa Thông Tin</span>
                  </button>
                  <button
                    onClick={handleArchive}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl border border-amber-200"
                  >
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-black text-slate-900 font-mono">{selectedStage.needGroups?.length || 0}</div>
              <div className="text-[10px] text-slate-500">Pha (Need Groups)</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-black text-blue-600 font-mono">{metrics.categoryCount}</div>
              <div className="text-[10px] text-slate-500">Chuyên mục</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-black text-emerald-600 font-mono">{metrics.supplierCount}</div>
              <div className="text-[10px] text-slate-500">Nhà cung ứng</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-base font-black text-purple-600 font-mono">{metrics.programCount}</div>
              <div className="text-[10px] text-slate-500">Chương trình</div>
            </div>
          </div>

          {/* Edit Form or View */}
          {isEditing && editForm ? (
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Giai Đoạn</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={editForm.slug}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={editForm.shortDescription}
                  onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cho phép Public</label>
                  <select
                    value={editForm.publishable ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, publishable: e.target.value === 'true' })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="true">Có (Public)</option>
                    <option value="false">Không (Ẩn)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedStage.shortDescription}
            </p>
          )}

          {/* Tree Structure: GIAI ĐOẠN → NHÓM NHU CẦU → CATEGORY → KEYWORDS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-blue-600" />
              <span>CÂY PHÂN CẤP NHÓM NHU CẦU & CHUYÊN MỤC NGÀNH</span>
            </h3>

            <div className="space-y-3">
              {selectedStage.needGroups.map((ng) => (
                <div key={ng.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">
                        PHA {ng.phaseId}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 font-heading pt-0.5">{ng.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{ng.categories.length} chuyên mục</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ng.categories.map((c, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {c.keywords.map((k, kIdx) => (
                            <span key={kIdx} className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[9px] rounded font-mono">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
