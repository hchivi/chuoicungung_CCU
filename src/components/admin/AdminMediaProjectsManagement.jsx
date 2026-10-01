import React, { useState, useEffect } from 'react';
import { 
  Video, Camera, FileText, BookOpen, CheckCircle2, Clock, 
  AlertTriangle, Search, Filter, Eye, Edit3, ArrowRight, 
  ShieldCheck, ChevronRight, UserCheck, Plus, RefreshCw, 
  X, Layers, Save, ExternalLink, Globe, Play, QrCode,
  Check, ArrowUpRight, Lock, Award
} from 'lucide-react';
import { 
  getAllMediaProjects, 
  saveAllMediaProjects, 
  updateMediaProjectStatus, 
  submitClientApproval, 
  getMediaProjectProgressSummary,
  getAllMediaAssets,
  getAllCatalogues,
  getAllMediaAuditLogs,
  MEDIA_PROJECT_STATUSES 
} from '../../data/mediaContentData';

export default function AdminMediaProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [catalogues, setCatalogues] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [summary, setSummary] = useState({ waitingClient: [], waitingTeam: [], approved: [], published: [] });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL'); // 'ALL' | 'WAITING_CLIENT' | 'WAITING_TEAM' | 'APPROVED' | 'PUBLISHED'

  // Selected Project Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalTab, setModalTab] = useState('deliverables'); // 'deliverables' | 'approval' | 'video_photo' | 'commercial' | 'audit'

  // Edit States
  const [editStatus, setEditStatus] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');

  // Approval Form State
  const [approvalItems, setApprovalItems] = useState({
    copy: false,
    photos: false,
    video: false,
    capabilities: false,
    clientReferences: false,
    contact: false,
    qrDestination: false
  });
  const [approverName, setApproverName] = useState('');
  const [approvalVersion, setApprovalVersion] = useState('v1.0-approved');
  const [approvalNote, setApprovalNote] = useState('');

  const loadData = () => {
    const prjs = getAllMediaProjects();
    const assets = getAllMediaAssets();
    const cats = getAllCatalogues();
    const logs = getAllMediaAuditLogs();
    const summ = getMediaProjectProgressSummary();

    setProjects(prjs);
    setMediaAssets(assets);
    setCatalogues(cats);
    setAuditLogs(logs);
    setSummary(summ);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openProjectDetail = (prj) => {
    setSelectedProject(prj);
    setModalTab('deliverables');
    setEditStatus(prj.status);
    setEditOwner(prj.owner);
    setEditDueDate(prj.dueDate || '');
    setStatusError('');
    setStatusSuccess('');

    // Pre-fill approval state
    setApprovalItems({
      copy: prj.approvalRecord?.reviewedItems?.copy || false,
      photos: prj.approvalRecord?.reviewedItems?.photos || false,
      video: prj.approvalRecord?.reviewedItems?.video || false,
      capabilities: prj.approvalRecord?.reviewedItems?.capabilities || false,
      clientReferences: prj.approvalRecord?.reviewedItems?.clientReferences || false,
      contact: prj.approvalRecord?.reviewedItems?.contact || false,
      qrDestination: prj.approvalRecord?.reviewedItems?.qrDestination || false
    });
    setApproverName(prj.approvalRecord?.approvedBy || prj.contactPerson || '');
    setApprovalVersion(prj.approvalRecord?.version ? `${prj.approvalRecord.version}-rev` : 'v1.0-approved');
    setApprovalNote('');
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setStatusError('');
    setStatusSuccess('');

    const res = updateMediaProjectStatus({
      projectId: selectedProject.id,
      status: editStatus,
      owner: editOwner,
      dueDate: editDueDate,
      actor: 'Admin Master',
      note: `Admin cập nhật trạng thái thủ công thành ${editStatus}`
    });

    if (!res.success) {
      setStatusError(res.message);
      return;
    }

    setStatusSuccess(`Đã cập nhật trạng thái dự án thành công: [${editStatus}]`);
    setSelectedProject(res.project);
    loadData();
  };

  const handleClientApprovalSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const res = submitClientApproval({
      projectId: selectedProject.id,
      approvedBy: approverName,
      reviewedItems: approvalItems,
      version: approvalVersion,
      note: approvalNote || 'Ký duyệt chính thức qua cổng quản trị'
    });

    if (res.success) {
      setStatusSuccess(`Đã lưu phiên bản duyệt ${approvalVersion}. Đủ điều kiện công bố: ${res.allReviewed ? 'CÓ' : 'CHƯA ĐỦ 7 MỤC'}`);
      setSelectedProject(res.project);
      setEditStatus(res.project.status);
      loadData();
    }
  };

  // Filter list
  const filteredProjects = projects.filter(p => {
    const matchSearch = !searchQuery || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (groupFilter === 'ALL') return true;
    if (groupFilter === 'WAITING_CLIENT') return ['NEED_MORE_INFO', 'PROPOSAL_SENT', 'CLIENT_REVIEW'].includes(p.status);
    if (groupFilter === 'WAITING_TEAM') return ['REQUEST', 'SCOPE_CONFIRMED', 'ACCEPTED', 'CONTENT_PREPARATION', 'PRODUCTION', 'REVISION'].includes(p.status);
    if (groupFilter === 'APPROVED') return ['APPROVED', 'DELIVERED'].includes(p.status);
    if (groupFilter === 'PUBLISHED') return p.status === 'PUBLISHED';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* SECTION 13 SPEC 15.TXT: 4 NHÓM TIẾN ĐỘ ADMIN PHẢI NHÌN RÕ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Đang chờ doanh nghiệp */}
        <div 
          onClick={() => setGroupFilter('WAITING_CLIENT')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            groupFilter === 'WAITING_CLIENT' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-700 uppercase font-heading">
              1. ĐANG CHỜ DOANH NGHIỆP
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 font-mono mt-2">
            {summary.waitingClient?.length || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Chờ bổ sung thông tin / Báo giá / Duyệt nội dung
          </div>
        </div>

        {/* KPI 2: Đang chờ team CCU */}
        <div 
          onClick={() => setGroupFilter('WAITING_TEAM')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            groupFilter === 'WAITING_TEAM' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-700 uppercase font-heading">
              2. ĐANG CHỜ TEAM CCU
            </span>
            <Video className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono mt-2">
            {summary.waitingTeam?.length || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Khảo sát xưởng / Quay dựng / Biên soạn kịch bản
          </div>
        </div>

        {/* KPI 3: Đã duyệt */}
        <div 
          onClick={() => setGroupFilter('APPROVED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            groupFilter === 'APPROVED' ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-400' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-700 uppercase font-heading">
              3. ĐÃ DUYỆT (APPROVED)
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-950 font-mono mt-2">
            {summary.approved?.length || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đã ký duyệt đủ 7 mục / Đã bàn giao file gốc
          </div>
        </div>

        {/* KPI 4: Đã publish */}
        <div 
          onClick={() => setGroupFilter('PUBLISHED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            groupFilter === 'PUBLISHED' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-700 uppercase font-heading">
              4. ĐÃ PUBLISH HỆ SINH THÁI
            </span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono mt-2">
            {summary.published?.length || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Đã gắn vào Profile / Catalogue / Sự kiện B2B
          </div>
        </div>

      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 font-heading">Lọc tiến độ:</span>
          {[
            { id: 'ALL', label: `Tất cả (${projects.length})` },
            { id: 'WAITING_CLIENT', label: `Chờ DN (${summary.waitingClient?.length || 0})` },
            { id: 'WAITING_TEAM', label: `Chờ Team (${summary.waitingTeam?.length || 0})` },
            { id: 'APPROVED', label: `Đã duyệt (${summary.approved?.length || 0})` },
            { id: 'PUBLISHED', label: `Đã publish (${summary.published?.length || 0})` }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setGroupFilter(btn.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                groupFilter === btn.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên xưởng, ID, người liên hệ..."
            className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Projects Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 font-heading">
            DANH SÁCH DỰ ÁN HỒ SƠ & TRUYỀN THÔNG ({filteredProjects.length})
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Quản lý theo Spec 15.txt</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Mã DA / Doanh nghiệp</th>
                <th className="p-3.5">Hạng mục bàn giao (Deliverables)</th>
                <th className="p-3.5">Trạng thái (Workflow)</th>
                <th className="p-3.5">Phụ trách / Deadline</th>
                <th className="p-3.5">Phiên bản / Ký duyệt</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map(prj => {
                const statusMeta = MEDIA_PROJECT_STATUSES.find(s => s.id === prj.status) || { name: prj.status, color: 'slate' };
                const isApproved = prj.approvalRecord?.isApproved;

                return (
                  <tr key={prj.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 space-y-1 max-w-[220px]">
                      <div className="font-mono text-[10px] text-slate-400 font-bold">{prj.id}</div>
                      <div className="font-bold text-slate-900 font-heading truncate">{prj.organizationName}</div>
                      <div className="text-[11px] text-slate-500">{prj.contactPerson} ({prj.phone})</div>
                    </td>

                    <td className="p-3.5 space-y-1 max-w-[260px]">
                      <div className="font-semibold text-slate-800 line-clamp-1">{prj.title}</div>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {prj.deliverables?.map(d => (
                          <span key={d.id} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {d.title.split('(')[0]}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        prj.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                        prj.status === 'APPROVED' ? 'bg-teal-100 text-teal-800' :
                        ['NEED_MORE_INFO', 'CLIENT_REVIEW'].includes(prj.status) ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {statusMeta.name}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">{prj.status}</div>
                    </td>

                    <td className="p-3.5 space-y-1 text-[11px]">
                      <div className="font-medium text-slate-800">{prj.owner}</div>
                      <div className="text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Hạn: {prj.dueDate || 'Chưa định'}</span>
                      </div>
                    </td>

                    <td className="p-3.5 space-y-1">
                      <div className="font-mono text-[11px] font-bold text-indigo-700">
                        {prj.approvalRecord?.version || 'v1.0-draft'}
                      </div>
                      <div className="text-[10px]">
                        {isApproved ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã ký duyệt
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium">Chưa ký duyệt</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openProjectDetail(prj)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded-xl text-xs font-bold transition inline-flex items-center gap-1 font-heading"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Chi tiết & Duyệt</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROJECT DETAIL & APPROVAL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-400/30">
                    {selectedProject.id}
                  </span>
                  <span className="text-xs text-slate-300">• Yêu cầu DV: {selectedProject.serviceRequestId}</span>
                </div>
                <h3 className="text-base font-black font-heading text-white">
                  {selectedProject.title}
                </h3>
                <div className="text-xs text-slate-300">
                  {selectedProject.organizationName} • Người liên hệ: {selectedProject.contactPerson} ({selectedProject.phone})
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50 text-xs overflow-x-auto">
              {[
                { id: 'deliverables', label: 'Hạng mục & Tiến độ' },
                { id: 'approval', label: 'Ký duyệt phiên bản (Approval)' },
                { id: 'video_photo', label: 'Kịch bản Video & Ảnh xưởng' },
                { id: 'commercial', label: 'Báo giá & Dự toán' },
                { id: 'audit', label: 'Nhật ký kiểm toán (Audit)' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id)}
                  className={`py-2 px-3 border-b-2 font-bold transition whitespace-nowrap ${
                    modalTab === t.id
                      ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
              
              {statusError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{statusError}</span>
                </div>
              )}

              {statusSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusSuccess}</span>
                </div>
              )}

              {/* TAB 1: DELIVERABLES & STATUS UPDATE */}
              {modalTab === 'deliverables' && (
                <div className="space-y-6">
                  
                  {/* Status Form */}
                  <form onSubmit={handleUpdateStatus} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 font-heading">
                      CẬP NHẬT TRẠNG THÁI TIẾN ĐỘ DỰ ÁN
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 text-[11px]">Trạng thái (Workflow)</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold"
                        >
                          {MEDIA_PROJECT_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 text-[11px]">Người phụ trách chính</label>
                        <input
                          type="text"
                          value={editOwner}
                          onChange={e => setEditOwner(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-600 text-[11px]">Hạn chót bàn giao (Due Date)</label>
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={e => setEditDueDate(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-[#0052cc] text-white font-bold rounded-xl transition text-xs flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu trạng thái dự án</span>
                      </button>
                    </div>
                  </form>

                  {/* Deliverables List */}
                  <div className="space-y-3">
                    <div className="font-bold text-slate-900 font-heading">
                      DANH SÁCH HẠNG MỤC BÀN GIAO THỰC TẾ ({selectedProject.deliverables?.length || 0})
                    </div>

                    <div className="space-y-2">
                      {selectedProject.deliverables?.map(deliv => (
                        <div key={deliv.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 font-heading">{deliv.title}</div>
                            <div className="text-[11px] text-slate-500">Định dạng: {deliv.format} • Số lượng: {deliv.quantity}</div>
                            <div className="text-[11px] text-blue-600 italic">{deliv.reviewNotes}</div>
                          </div>

                          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200 self-start sm:self-auto">
                            {deliv.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relations view */}
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2 text-[11px]">
                    <div className="font-bold text-blue-900 font-heading">LIÊN KẾT HỆ SINH THÁI (SECTION 11 & 12 SPEC 15.TXT)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                      <div>• Tổ chức: <strong>{selectedProject.organizationName}</strong></div>
                      <div>• Gắn với Chương trình: <strong>{selectedProject.relatedProgramId || 'Chưa gắn'}</strong></div>
                      <div>• Gắn với Catalogue: <strong>{selectedProject.relatedCatalogueId || 'Tạo mới draft'}</strong></div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: APPROVAL WORKFLOW (SECTION 8 SPEC 15.TXT) */}
              {modalTab === 'approval' && (
                <form onSubmit={handleClientApprovalSubmit} className="space-y-5">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                    <div className="font-bold text-indigo-900 font-heading flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>XÁC NHẬN KÝ DUYỆT CỦA DOANH NGHIỆP (SECTION 8 SPEC 15.TXT)</span>
                    </div>
                    <p className="text-[11px] text-indigo-800 leading-relaxed">
                      Doanh nghiệp phải duyệt đầy đủ 7 hạng mục. Khi lưu, hệ thống tự động ghi nhận phiên bản mới, người duyệt và thời gian, không bao giờ ghi đè lịch sử cũ.
                    </p>
                  </div>

                  {/* 7 Items checklist */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 font-heading">7 Cấu phần cần khách hàng duyệt:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: 'copy', label: '1. Nội dung bài viết & thông điệp (Copy)' },
                        { key: 'photos', label: '2. Bộ ảnh nhà xưởng & máy móc thực tế' },
                        { key: 'video', label: '3. Video 1 phút & kịch bản phân cảnh' },
                        { key: 'capabilities', label: '4. Thông số năng lực, công suất, MOQ' },
                        { key: 'clientReferences', label: '5. Dự án tiêu biểu & Đối tác tham chiếu' },
                        { key: 'contact', label: '6. Người liên hệ & Pháp nhân' },
                        { key: 'qrDestination', label: '7. Đích đến của Mã QR bảo chứng' }
                      ].map(item => {
                        const checked = approvalItems[item.key];
                        return (
                          <label
                            key={item.key}
                            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                              checked ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e => setApprovalItems({ ...approvalItems, [item.key]: e.target.checked })}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-[11px]">{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 text-[11px]">Người đại diện ký duyệt</label>
                      <input
                        type="text"
                        required
                        value={approverName}
                        onChange={e => setApproverName(e.target.value)}
                        placeholder="VD: Nguyễn Bích Thủy (Giám đốc)"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 text-[11px]">Mã phiên bản (Version tag)</label>
                      <input
                        type="text"
                        required
                        value={approvalVersion}
                        onChange={e => setApprovalVersion(e.target.value)}
                        placeholder="VD: v2.1-approved"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-600 text-[11px]">Ghi chú biên bản duyệt</label>
                      <input
                        type="text"
                        value={approvalNote}
                        onChange={e => setApprovalNote(e.target.value)}
                        placeholder="VD: Doanh nghiệp xác nhận qua Email ngày 28/09 không chỉnh sửa thêm"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Xác nhận ký duyệt & Cập nhật phiên bản</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: VIDEO & PHOTO PLAN */}
              {modalTab === 'video_photo' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>KỊCH BẢN VIDEO GIỚI THIỆU KHOẢNG 1 PHÚT (CARD 02)</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1.5">
                      <div>• Thời lượng dự kiến: <strong>{selectedProject.videoScript?.durationSeconds || 60} giây</strong></div>
                      <div>• Địa điểm quay: <strong>{selectedProject.videoScript?.shootingLocation || 'Tại xưởng'}</strong></div>
                      <div>• Ngôn ngữ: <strong>{selectedProject.videoScript?.languages?.join(', ') || 'Tiếng Việt'}</strong></div>
                      <div>• Chính sách quay lại: <strong>{selectedProject.videoScript?.reshootPolicy || 'Tính phí nếu ngoài phạm vi'}</strong></div>
                    </div>

                    {selectedProject.videoScript?.scenes && (
                      <div className="space-y-1 pt-2">
                        <div className="font-bold text-slate-700 text-[11px]">Phân cảnh 6 phần:</div>
                        <div className="space-y-1 text-[11px]">
                          {selectedProject.videoScript.scenes.map((sc, i) => (
                            <div key={i} className="p-2 bg-white rounded-lg border border-slate-100 flex items-start gap-2">
                              <span className="font-mono text-purple-700 font-bold shrink-0">{sc.sec}</span>
                              <span>{sc.content}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>KẾ HOẠCH BỘ ẢNH NĂNG LỰC & MÁY MÓC (CARD 03)</span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>• Số lượng ảnh bàn giao: <strong>{selectedProject.photoPlan?.deliveredCount || 30} ảnh</strong></div>
                      <div>• Phân loại bằng chứng: <strong className="text-emerald-700">{selectedProject.photoPlan?.evidenceCategory || 'REAL_EVIDENCE'}</strong></div>
                      <div>• Cam kết AI / Mascot: <strong>Tuyệt đối không dùng AI thay thế bằng chứng thực tế</strong></div>
                    </div>

                    {selectedProject.photoPlan?.targetScenes && (
                      <div className="space-y-1 pt-2">
                        <div className="font-bold text-slate-700 text-[11px]">Danh sách cảnh cần chụp:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                          {selectedProject.photoPlan.targetScenes.map((sc, i) => (
                            <li key={i}>{sc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: COMMERCIAL TERMS (SECTION 15 SPEC 15.TXT) */}
              {modalTab === 'commercial' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 font-heading">
                        DỰ TOÁN & BẢO CHỨNG THƯƠNG MẠI
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                        {selectedProject.commercialTerms?.quotationCode || 'BG-PENDING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>• Phí biên soạn hồ sơ: <strong>{Number(selectedProject.commercialTerms?.contentPreparationFee || 0).toLocaleString()} đ</strong></div>
                      <div>• Phí sản xuất video: <strong>{Number(selectedProject.commercialTerms?.videoProductionFee || 0).toLocaleString()} đ</strong></div>
                      <div>• Phí chụp ảnh xưởng: <strong>{Number(selectedProject.commercialTerms?.photoProductionFee || 0).toLocaleString()} đ</strong></div>
                      <div>• Phí tích hợp E-Catalogue: <strong>{Number(selectedProject.commercialTerms?.catalogueIntegrationFee || 0).toLocaleString()} đ</strong></div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div>• Chi phí đi lại: <strong>{selectedProject.commercialTerms?.travelCost || 'Theo thực tế'}</strong></div>
                      <div>• Vòng chỉnh sửa: <strong>{selectedProject.commercialTerms?.revisionPolicy || 'Tối đa 3 vòng'}</strong></div>
                    </div>
                  </div>

                  {/* Section 15 Non-inclusion list */}
                  <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2 text-[11px]">
                    <div className="font-bold text-amber-900 font-heading">CÁC HẠNG MỤC KHÔNG BAO GỒM TRONG GÓI:</div>
                    <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                      {selectedProject.commercialTerms?.itemsNotIncluded?.map((it, i) => (
                        <li key={i}>{it}</li>
                      )) || <li>In ấn số lượng lớn, chi phí quảng cáo Google/Facebook</li>}
                    </ul>
                    <p className="pt-1 text-slate-500 italic">
                      {selectedProject.commercialTerms?.disclaimer}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIT LOGS */}
              {modalTab === 'audit' && (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900 font-heading">LỊCH SỬ THAO TÁC & KIỂM TOÁN DỰ ÁN</div>
                  <div className="space-y-2">
                    {selectedProject.approvalRecord?.auditHistory?.map((h, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                          <span>{h.timestamp}</span>
                          <span className="font-bold text-slate-700">{h.actor}</span>
                        </div>
                        <div className="font-bold text-slate-900">{h.action}</div>
                        <div className="text-slate-600">{h.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                CHUOICUNGUNG.COM Media Desk • Tô Ngọc Dũng
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition"
              >
                Đóng cửa sổ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
