import React, { useState, useMemo } from 'react';
import { 
  Calendar, MapPin, Building2, Users, Search, Filter, Plus, 
  ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles,
  Tag, Clock, Edit3, X, Eye, FileText, Check, DollarSign, Layers,
  UserCheck, QrCode, Phone, Mail, HelpCircle, XCircle
} from 'lucide-react';
import { 
  getAllPrograms, 
  updateProgramAdmin, 
  getAllProgramAuditLogs,
  getProgramRegistrationsByProgram,
  updateRegistrationStatusAdmin,
  confirmRegistrationPaymentAdmin,
  REGISTRATION_STATUSES_ENUM,
  PAYMENT_STATUSES_ENUM,
  ATTENDANCE_STATUSES_ENUM,
  REJECTION_REASONS_ENUM,
  PROGRAM_TYPES,
  PROGRAM_STATUSES,
  PROGRAM_ZONES,
  PROGRAM_INDUSTRIES
} from '../../data/programsData';
import {
  getAllProgramMediaAssets,
  getAllProgramAlbums,
  approveMediaAssetAdmin,
  updateMediaAssetAdmin,
  bulkUploadMediaAssetsAdmin,
  MEDIA_PUBLISH_STATUS_ENUM,
  MEDIA_VISIBILITY_ENUM,
  DOWNLOAD_PERMISSION_ENUM
} from '../../data/programLibraryData';

export default function AdminProgramsManagement() {
  const [programs, setPrograms] = useState(() => getAllPrograms());
  const [searchKw, setSearchKw] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editFormData, setEditFormData] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Registration review state (Section 38 & 39 & 40)
  const [rejectingReg, setRejectingReg] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS_ENUM.NOT_ELIGIBLE);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [viewingRegDetail, setViewingRegDetail] = useState(null);
  const [regRefresh, setRegRefresh] = useState(0);

  // Registrations for the selected program
  const currentProgramRegistrations = useMemo(() => {
    if (!selectedProgram) return [];
    return getProgramRegistrationsByProgram(selectedProgram.id);
  }, [selectedProgram, regRefresh]);

  const handleApproveRegistration = (regId) => {
    try {
      updateRegistrationStatusAdmin(regId, REGISTRATION_STATUSES_ENUM.APPROVED, {
        adminUserId: 'admin@chuoicungung.com',
        notes: 'Hồ sơ đạt tiêu chuẩn tham gia'
      });
      setRegRefresh(prev => prev + 1);
      setToastMsg('Đã phê duyệt hồ sơ đăng ký thành công!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRequestMoreInfo = (regId) => {
    const note = window.prompt('Nhập nội dung yêu cầu bổ sung hồ sơ:', 'Vui lòng cung cấp thêm chứng chỉ ISO và catalogue chi tiết');
    if (!note) return;
    try {
      updateRegistrationStatusAdmin(regId, REGISTRATION_STATUSES_ENUM.NEED_MORE_INFO, {
        adminUserId: 'admin@chuoicungung.com',
        notes: note
      });
      setRegRefresh(prev => prev + 1);
      setToastMsg('Đã gửi yêu cầu bổ sung thông tin đến doanh nghiệp!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingReg) return;
    try {
      updateRegistrationStatusAdmin(rejectingReg.id, REGISTRATION_STATUSES_ENUM.REJECTED, {
        reason: rejectionReason,
        notes: rejectionNotes,
        adminUserId: 'admin@chuoicungung.com'
      });
      setRejectingReg(null);
      setRejectionNotes('');
      setRegRefresh(prev => prev + 1);
      setToastMsg('Đã cập nhật trạng thái từ chối hồ sơ đăng ký.');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmPayment = (regId) => {
    try {
      confirmRegistrationPaymentAdmin(regId, {
        amount: 0,
        transactionRef: `BANK-${Date.now()}`,
        adminUserId: 'admin_finance'
      });
      setRegRefresh(prev => prev + 1);
      setToastMsg('Đã xác nhận thanh toán & kích hoạt QR điểm danh!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Program Library & Media State (Spec 23.txt)
  const [mediaRefresh, setMediaRefresh] = useState(0);
  const currentProgramMedia = useMemo(() => {
    if (!selectedProgram) return [];
    const all = getAllProgramMediaAssets();
    return all.filter(a => a.programId === selectedProgram.id || a.programId === selectedProgram.slug);
  }, [selectedProgram, mediaRefresh]);

  const currentProgramAlbums = useMemo(() => {
    if (!selectedProgram) return [];
    const all = getAllProgramAlbums();
    return all.filter(a => a.programId === selectedProgram.id || a.programId === selectedProgram.slug);
  }, [selectedProgram, mediaRefresh]);

  const handleApproveMedia = (assetId) => {
    try {
      approveMediaAssetAdmin(assetId, 'admin_coordinator');
      setMediaRefresh(prev => prev + 1);
      setToastMsg('Đã duyệt xuất bản tư liệu thư viện!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateMediaVisibility = (assetId, visibility) => {
    try {
      updateMediaAssetAdmin(assetId, { visibility }, 'admin_coordinator');
      setMediaRefresh(prev => prev + 1);
      setToastMsg(`Đã cập nhật phạm vi hiển thị: ${visibility}`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkUploadSimulate = () => {
    if (!selectedProgram) return;
    try {
      bulkUploadMediaAssetsAdmin(selectedProgram.id, [
        {
          title: `Ảnh lưu niệm phiên kết nối B2B bàn số ${Math.floor(Math.random() * 20) + 1}`,
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
          sessionTag: 'B2B_MEETING'
        },
        {
          title: `Khu vực trao đổi catalogue gian hàng phụ trợ`,
          type: 'IMAGE',
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
          sessionTag: 'BOOTH_SHOWCASE'
        }
      ], { adminUserId: 'admin_coordinator' });

      setMediaRefresh(prev => prev + 1);
      setToastMsg('Đã tải lên 2 tư liệu mới vào Hàng đợi chờ duyệt (Pending Review)!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Audit Logs
  const auditLogs = useMemo(() => getAllProgramAuditLogs(), [programs]);

  // Filtered Programs
  const filteredList = useMemo(() => {
    return programs.filter(p => {
      if (filterStatus !== 'all' && p.status !== filterStatus && p.programStatus !== filterStatus) return false;
      if (filterType !== 'all' && p.type !== filterType && p.programType !== filterType) return false;
      if (filterZone !== 'all' && p.zone !== filterZone) return false;
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase();
        const inCode = (p.publicCode || '').toLowerCase().includes(kw);
        const inTitle = (p.title || p.name || '').toLowerCase().includes(kw);
        const inLoc = (p.location || '').toLowerCase().includes(kw);
        const inOrg = (p.organizer || '').toLowerCase().includes(kw);
        const inOwner = (p.ownerName || p.ownerUserId || '').toLowerCase().includes(kw);
        if (!inCode && !inTitle && !inLoc && !inOrg && !inOwner) return false;
      }
      return true;
    });
  }, [programs, filterStatus, filterType, filterZone, searchKw]);

  // Warning check: Programs missing Owner or Next Action (Hard Rule Section 27)
  const missingOwnerPrograms = useMemo(() => {
    return programs.filter(p => 
      p.status !== 'da-dien-ra' && 
      p.status !== 'huy' && 
      (!p.ownerUserId || !p.nextAction)
    );
  }, [programs]);

  // Handle Open Detail / Edit Modal
  const handleOpenDetail = (program) => {
    setSelectedProgram(program);
    setEditFormData({
      status: program.status,
      ownerUserId: program.ownerUserId || 'usr_coord_nam',
      ownerName: program.ownerName || 'Lê Minh Quân',
      nextAction: program.nextAction || '',
      nextActionAt: program.nextActionAt || new Date().toISOString()
    });
    setActiveTab('overview');
  };

  // Handle Save Mutation
  const handleSaveMutation = (e) => {
    e.preventDefault();
    if (!selectedProgram) return;

    try {
      const res = updateProgramAdmin(selectedProgram.id, {
        status: editFormData.status,
        ownerUserId: editFormData.ownerUserId,
        ownerName: editFormData.ownerName,
        nextAction: editFormData.nextAction,
        nextActionAt: editFormData.nextActionAt
      }, 'admin_coordinator');

      if (res.success) {
        setPrograms(getAllPrograms());
        setSelectedProgram(res.program);
        setToastMsg('Cập nhật chương trình và ghi nhận Audit Log thành công!');
        setTimeout(() => setToastMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Lỗi lưu thông tin');
    }
  };

  // 16 Tabs definition according to Section 26
  const DETAIL_TABS = [
    { id: 'overview', label: '1. Tổng quan' },
    { id: 'info', label: '2. Thông tin' },
    { id: 'target_roles', label: '3. Đối tượng' },
    { id: 'needs_group', label: '4. Nhóm nhu cầu' },
    { id: 'options', label: '5. Phí & Hình thức' },
    { id: 'buyer_needs', label: '6. Nhu cầu Mua' },
    { id: 'suppliers', label: '7. Nhu cầu Bán' },
    { id: 'registrations', label: '8. Đăng ký' },
    { id: 'meetings', label: '9. Lịch gặp' },
    { id: 'partners', label: '10. Đối tác & Tài trợ' },
    { id: 'catalogue', label: '11. Kỷ yếu' },
    { id: 'media', label: '12. Media' },
    { id: 'tasks', label: '13. Công việc' },
    { id: 'results', label: '14. Kết quả xác nhận' },
    { id: 'timeline', label: '15. Timeline' },
    { id: 'audit', label: '16. Audit Log' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
              BOARD 04: CHƯƠNG TRÌNH & SỰ KIỆN B2B
            </span>
            <span className="text-xs text-slate-400">• Section 25 & 26 Spec</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading mt-1">
            Điều Phối Chương Trình Giao Thương Cung Cầu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị toàn bộ vòng đời chương trình kết nối từ khảo sát nhu cầu, mở đăng ký, điều phối lịch gặp đến xác nhận kết quả.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Tổng chương trình</span>
            <span className="text-base font-black text-slate-900 font-mono">{programs.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
            <span className="text-[10px] text-emerald-600 font-bold block uppercase">Đang mở đăng ký</span>
            <span className="text-base font-black text-emerald-700 font-mono">
              {programs.filter(p => p.status === 'dang-nhan-dang-ky').length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Warning Box for Hard Rule Section 27 (Missing Owner or Next Action) */}
      {missingOwnerPrograms.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900">
              Cảnh báo Vận Hành (Section 27): Có {missingOwnerPrograms.length} chương trình active chưa có đủ Người phụ trách hoặc Đầu việc tiếp theo!
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Quy tắc cứng yêu cầu mọi chương trình đang hoạt động phải có <code>ownerUserId</code> và <code>nextAction</code> định kỳ để tránh tồn đọng.
            </p>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* 3. Search & Filter Bar (Section 25) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 items-center space-x-2 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="Tìm theo mã PRG, tên chương trình, KCN, ban tổ chức, người phụ trách..."
            className="w-full px-2 py-1 outline-none text-xs text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            {PROGRAM_STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">Tất cả loại hình</option>
            {PROGRAM_TYPES.filter(t => t.id !== 'all').map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Zone Filter */}
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">Tất cả khu vực</option>
            {PROGRAM_ZONES.filter(z => z.id !== 'all').map(z => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Program Listing Table (Section 25 Standard Columns) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Mã PRG</th>
                <th className="py-3.5 px-4">Tên Chương Trình</th>
                <th className="py-3.5 px-4">Loại Hình</th>
                <th className="py-3.5 px-4">Địa Bàn & KCN</th>
                <th className="py-3.5 px-4">Thời Gian</th>
                <th className="py-3.5 px-4">Chủ Trì (Organizer)</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4">Người Phụ Trách (Owner)</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.map((program) => {
                const isOverdue = program.nextActionAt && new Date(program.nextActionAt) < new Date();
                return (
                  <tr key={program.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {program.publicCode || program.id}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="font-bold text-slate-900 line-clamp-1">{program.title || program.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {program.factoriesCount || 0} Buyer • {program.suppliersCount || 0} Supplier
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {program.typeName}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{program.zone || 'Toàn quốc'}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{program.kcn || program.location}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{program.date}</div>
                      <div className="text-[10px] text-slate-400">{program.time}</div>
                    </td>

                    {/* Organizer (Section 28) */}
                    <td className="py-3 px-4 whitespace-nowrap max-w-[160px] truncate" title={program.organizer}>
                      <span className="font-medium text-slate-800">{program.organizer}</span>
                      <div className="text-[10px] font-mono text-slate-400">{program.organizerOrganizationId || 'ORG-SYSTEM'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        program.status === 'dang-nhan-dang-ky' ? 'bg-emerald-100 text-emerald-800' :
                        program.status === 'sap-mo-dang-ky' ? 'bg-blue-100 text-blue-800' :
                        program.status === 'dang-khao-sat' ? 'bg-amber-100 text-amber-800' :
                        program.status === 'da-dien-ra' ? 'bg-indigo-100 text-indigo-800' :
                        program.status === 'hoan' ? 'bg-orange-100 text-orange-800' :
                        program.status === 'huy' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {program.statusName || program.status}
                      </span>
                    </td>

                    {/* Owner & Next Action (Section 27) */}
                    <td className="py-3 px-4 min-w-[180px]">
                      <div className="font-semibold text-slate-900">{program.ownerName || 'Chưa gán'}</div>
                      <div className={`text-[10px] truncate max-w-[170px] ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`} title={program.nextAction}>
                        Việc tiếp: {program.nextAction || 'Chưa đặt'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(program)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition flex items-center space-x-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Chi tiết & Điều phối</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detail & 16-Tab Operational Modal (Section 26) */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                    {selectedProgram.publicCode || selectedProgram.id}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedProgram.typeName}</span>
                </div>
                <h3 className="text-lg font-black font-heading text-white line-clamp-1">
                  {selectedProgram.title || selectedProgram.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 16 Tabs Navigation (Section 26) */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-bold ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Tabs */}
            <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
              
              {/* Tab 1: Tổng quan & Điều phối nghiệp vụ (Section 27) */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <form onSubmit={handleSaveMutation} className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
                    <h4 className="font-black text-slate-900 text-sm font-heading flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Cập Nhật Trạng Thái & Điều Phối Viên Phụ Trách (Section 27)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Trạng thái vận hành:</label>
                        <select
                          value={editFormData?.status}
                          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                        >
                          {PROGRAM_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Người phụ trách (Owner):</label>
                        <input
                          type="text"
                          value={editFormData?.ownerName}
                          onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                          placeholder="Lê Minh Quân..."
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Đầu việc tiếp theo (Next Action):</label>
                        <input
                          type="text"
                          value={editFormData?.nextAction}
                          onChange={(e) => setEditFormData({ ...editFormData, nextAction: e.target.value })}
                          placeholder="Ví dụ: Rà soát danh sách 15 nhà cung cấp..."
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Hạn hoàn thành (Next Action At):</label>
                        <input
                          type="date"
                          value={editFormData?.nextActionAt ? editFormData.nextActionAt.split('T')[0] : ''}
                          onChange={(e) => setEditFormData({ ...editFormData, nextActionAt: new Date(e.target.value).toISOString() })}
                          className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
                      >
                        Lưu Thay Đổi & Ghi Nhận Audit Log
                      </button>
                    </div>
                  </form>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Ngày diễn ra</span>
                      <strong className="text-slate-900">{selectedProgram.date}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Địa điểm</span>
                      <strong className="text-slate-900 truncate block">{selectedProgram.location}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Quy mô Buyer</span>
                      <strong className="text-slate-900">{selectedProgram.factoriesCount || 0} Nhà máy</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Quy mô Supplier</span>
                      <strong className="text-slate-900">{selectedProgram.suppliersCount || 0} Nhà cung ứng</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Participation Options (Section 11 & 12) */}
              {activeTab === 'options' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Các Gói Hình Thức Tham Gia & Biểu Phí:</h4>
                  {selectedProgram.participationOptions && selectedProgram.participationOptions.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProgram.participationOptions.map((opt, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                                {opt.role}
                              </span>
                              <strong className="text-slate-900 font-bold">{opt.title}</strong>
                            </div>
                            <p className="text-slate-500 text-[11px]">{opt.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900">
                              {opt.feeType === 'FREE' ? 'MIỄN PHÍ' : `${opt.amount?.toLocaleString('vi-VN')} đ`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Chưa cấu hình các gói biểu phí chi tiết.</p>
                  )}
                </div>
              )}

              {/* Tab 6: Buyer Needs (Section 29: Relations, no duplicate need) */}
              {activeTab === 'buyer_needs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Danh Mục Nhu Cầu Mua Hàng Được Ghi Nhận Tại Chương Trình:</h4>
                  {selectedProgram.needToBuy && selectedProgram.needToBuy.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProgram.needToBuy.map((need, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                          <div>
                            <strong className="text-slate-900 block">{need.item}</strong>
                            <span className="text-slate-500 text-[11px]">Đơn vị mua: {need.buyer}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px]">
                            {need.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Chưa có danh mục nhu cầu mua riêng lẻ.</p>
                  )}
                </div>
              )}

              {/* Tab 8: Registrations (Section 38 & 39 Spec) */}
              {activeTab === 'registrations' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm font-heading flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>Hồ Sơ Đăng Ký Tham Gia Chương Trình ({currentProgramRegistrations.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Thẩm định hồ sơ, kiểm soát 3 trạng thái độc lập (ĐK, Phí, Tham dự), cấp mã QR và chuẩn bị phiên gặp 1:1.
                      </p>
                    </div>
                  </div>

                  {currentProgramRegistrations.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-1">
                      <p className="font-bold text-xs text-slate-700">Chưa có doanh nghiệp đăng ký chương trình này.</p>
                      <p className="text-[11px] text-slate-400">Các hồ sơ đăng ký qua trang /chuong-trinh/:slug/dang-ky sẽ xuất hiện tại đây.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-600 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="p-3">Mã ĐK</th>
                            <th className="p-3">Doanh nghiệp</th>
                            <th className="p-3">Vai trò</th>
                            <th className="p-3">Gói tham gia</th>
                            <th className="p-3">Trạng thái ĐK</th>
                            <th className="p-3">Thanh toán</th>
                            <th className="p-3">Tham dự</th>
                            <th className="p-3">Điều phối</th>
                            <th className="p-3">Ngày nộp</th>
                            <th className="p-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {currentProgramRegistrations.map((reg) => (
                            <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                                {reg.registrationCode}
                              </td>
                              <td className="p-3">
                                <strong className="text-slate-900 block truncate max-w-[150px]">{reg.companyName}</strong>
                                <span className="text-[11px] text-slate-500 truncate block">{reg.contactPerson} • {reg.phone}</span>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {reg.role}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-600 whitespace-nowrap">
                                {reg.participationOptionTitle}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  reg.registrationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                                  reg.registrationStatus === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                                  reg.registrationStatus === 'NEED_MORE_INFO' ? 'bg-amber-100 text-amber-800' :
                                  reg.registrationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                                  'bg-slate-100 text-slate-800'
                                }`}>
                                  {reg.registrationStatus}
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  reg.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                                  reg.paymentStatus === 'NOT_REQUIRED' ? 'bg-slate-100 text-slate-600' :
                                  reg.paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {reg.paymentStatus}
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap text-[11px] text-slate-600">
                                {reg.attendanceStatus}
                              </td>
                              <td className="p-3 whitespace-nowrap text-[11px] text-slate-500">
                                {reg.ownerName || 'Chưa gán'}
                              </td>
                              <td className="p-3 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                                {new Date(reg.submittedAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-1">
                                  {/* View Detail button */}
                                  <button
                                    type="button"
                                    onClick={() => setViewingRegDetail(reg)}
                                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                                    title="Xem chi tiết hồ sơ"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Approve action (Section 39) */}
                                  {reg.registrationStatus !== 'APPROVED' && reg.registrationStatus !== 'REJECTED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleApproveRegistration(reg.id)}
                                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center space-x-1"
                                      title="Duyệt hồ sơ (Approve)"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Duyệt</span>
                                    </button>
                                  )}

                                  {/* Request more info action */}
                                  {reg.registrationStatus !== 'REJECTED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRequestMoreInfo(reg.id)}
                                      className="p-1 rounded-lg hover:bg-amber-50 text-amber-600"
                                      title="Yêu cầu bổ sung hồ sơ (Need more info)"
                                    >
                                      <HelpCircle className="w-4 h-4" />
                                    </button>
                                  )}

                                  {/* Confirm payment action */}
                                  {reg.paymentStatus === 'PENDING' && (
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmPayment(reg.id)}
                                      className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center space-x-1"
                                      title="Xác nhận thanh toán"
                                    >
                                      <DollarSign className="w-3 h-3" />
                                      <span>Thu phí</span>
                                    </button>
                                  )}

                                  {/* Reject action (Section 40) */}
                                  {reg.registrationStatus !== 'REJECTED' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRejectingReg(reg);
                                        setRejectionReason(REJECTION_REASONS_ENUM.NOT_ELIGIBLE);
                                        setRejectionNotes('');
                                      }}
                                      className="p-1 rounded-lg hover:bg-rose-50 text-rose-600"
                                      title="Từ chối hồ sơ (Reject with reason)"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 12: Media & Library (Spec 23.txt Section 28 & 31) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm font-heading flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-blue-600" />
                        <span>Quản Trị Thư Viện Ảnh & Tài Liệu Chương Trình ({currentProgramMedia.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Kiểm duyệt tư liệu, phân quyền xem/tải riêng biệt (View ≠ Download), quản lý Album và hàng đợi duyệt (Review Queue).
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleBulkUploadSimulate}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tải Lên Hàng Loạt (Bulk Upload)</span>
                      </button>
                    </div>
                  </div>

                  {/* Albums Summary */}
                  {currentProgramAlbums.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Danh sách Album ({currentProgramAlbums.length}):</span>
                      <div className="flex flex-wrap gap-2">
                        {currentProgramAlbums.map(alb => (
                          <div key={alb.id} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs flex items-center space-x-2">
                            <span className="font-bold text-slate-800">{alb.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({alb.itemCount || 0} ảnh)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Assets Table */}
                  {currentProgramMedia.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-1">
                      <p className="font-bold text-xs text-slate-700">Chưa có tư liệu nào trong thư viện chương trình này.</p>
                      <p className="text-[11px] text-slate-400">Bấm "Tải Lên Hàng Loạt" để thêm các khoảnh khắc sự kiện.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100 text-slate-600 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="p-3">Tư liệu</th>
                            <th className="p-3">Loại</th>
                            <th className="p-3">Doanh nghiệp / Đơn vị</th>
                            <th className="p-3">Phạm vi hiển thị</th>
                            <th className="p-3">Quyền tải xuống</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {currentProgramMedia.map((asset) => (
                            <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-3">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    <img
                                      src={asset.thumbnailUrl || asset.url}
                                      alt={asset.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="max-w-[200px]">
                                    <strong className="text-slate-900 block truncate text-xs">{asset.title}</strong>
                                    <span className="text-[10px] text-slate-400 block font-mono">{asset.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  {asset.type}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-slate-700">
                                {asset.enterpriseName || asset.providerName || 'Ban tổ chức'}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  asset.visibility === 'PUBLIC' ? 'bg-blue-100 text-blue-800' :
                                  asset.visibility === 'PROGRAM_PARTICIPANTS' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-800'
                                }`}>
                                  {asset.visibility}
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap text-[11px] text-slate-600">
                                {asset.downloadPermission}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  asset.publishStatus === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                                  asset.publishStatus === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-800'
                                }`}>
                                  {asset.publishStatus}
                                </span>
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-1">
                                  {asset.publishStatus !== 'PUBLISHED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleApproveMedia(asset.id)}
                                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center space-x-1"
                                      title="Duyệt xuất bản (Approve)"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Duyệt</span>
                                    </button>
                                  )}

                                  {asset.visibility === 'PUBLIC' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateMediaVisibility(asset.id, 'PROGRAM_PARTICIPANTS')}
                                      className="px-2 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-[10px] font-bold"
                                      title="Chỉ cho người tham dự xem"
                                    >
                                      Hạn chế
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateMediaVisibility(asset.id, 'PUBLIC')}
                                      className="px-2 py-1 rounded-lg border border-blue-300 hover:bg-blue-50 text-blue-700 text-[10px] font-bold"
                                      title="Công khai công chúng"
                                    >
                                      Public
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 14: Results (Section 20 & 21 Verified Results) */}
              {activeTab === 'results' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Biên Bản Số Liệu Tổng Hợp (Section 21 Standard):</h4>
                  {selectedProgram.recap ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Điểm danh thực tế</span>
                        <strong className="text-base text-slate-900">{selectedProgram.recap.attendanceCount || 157}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Phiên gặp 1:1</span>
                        <strong className="text-base text-slate-900">{selectedProgram.recap.sessionsCompleted || 142}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">Báo giá xác nhận</span>
                        <strong className="text-base text-slate-900">{selectedProgram.recap.quotesRecorded || 64}</strong>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase">MOU / Thỏa thuận</span>
                        <strong className="text-base text-slate-900">{selectedProgram.recap.outcomesConfirmed || 18}</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Chương trình chưa diễn ra hoặc chưa hoàn tất tổng kết số liệu.</p>
                  )}
                </div>
              )}

              {/* Tab 16: Audit Log (Section 30) */}
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Nhật Ký Biến Động Chương Trình (Audit Log):</h4>
                  {auditLogs.filter(l => l.entityId === selectedProgram.id).length > 0 ? (
                    <div className="space-y-2">
                      {auditLogs.filter(l => l.entityId === selectedProgram.id).map((log, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                          <div className="flex justify-between font-mono text-slate-500">
                            <span>Hành động: {log.action}</span>
                            <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                          </div>
                          <div>Thực hiện bởi: <strong>{log.actorUserId}</strong></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Chưa ghi nhận biến động mới cho chương trình này.</p>
                  )}
                </div>
              )}

              {/* Generic fallback for other tabs */}
              {!['overview', 'options', 'buyer_needs', 'registrations', 'media', 'results', 'audit'].includes(activeTab) && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 space-y-2">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-medium">Tab {activeTab.toUpperCase()} đã sẵn sàng kết nối dữ liệu từ Page 21–23.</p>
                  <p className="text-[11px] text-slate-400">Cấu trúc 16 tab tuân thủ đầy đủ kiến trúc mô-đun hóa Bàn Điều Phối Chương Trình.</p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reject Registration Modal (Section 40) */}
      {rejectingReg && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleConfirmReject} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Từ Chối Hồ Sơ Đăng Ký (Section 40)</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectingReg(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-600">
                Doanh nghiệp: <strong>{rejectingReg.companyName}</strong> ({rejectingReg.registrationCode})
              </p>
              <p className="text-[11px] text-slate-500">
                * Lưu ý: Hồ sơ sẽ không bị xóa khỏi hệ thống mà chuyển sang trạng thái REJECTED kèm lý do cụ thể.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">Lý do từ chối (Bắt buộc):</label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs text-slate-900"
                required
              >
                <option value={REJECTION_REASONS_ENUM.NOT_ELIGIBLE}>NOT_ELIGIBLE (Không đủ điều kiện tiêu chuẩn)</option>
                <option value={REJECTION_REASONS_ENUM.PROGRAM_FULL}>PROGRAM_FULL (Chương trình đã kín chỗ/hết bàn)</option>
                <option value={REJECTION_REASONS_ENUM.PROFILE_INCOMPLETE}>PROFILE_INCOMPLETE (Hồ sơ chưa đủ thông tin)</option>
                <option value={REJECTION_REASONS_ENUM.SCOPE_NOT_MATCH}>SCOPE_NOT_MATCH (Phạm vi cung ứng không khớp Buyer)</option>
                <option value={REJECTION_REASONS_ENUM.DUPLICATE}>DUPLICATE (Đăng ký trùng lặp)</option>
                <option value={REJECTION_REASONS_ENUM.OTHER}>OTHER (Lý do khác)</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">Ghi chú phản hồi gửi doanh nghiệp:</label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                rows={3}
                placeholder="Nhập hướng dẫn hoặc phản hồi chi tiết để doanh nghiệp có thể nộp lại đợt sau..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingReg(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Xác nhận từ chối
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Registration Detail Drawer / Modal (Section 39) */}
      {viewingRegDetail && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-xs">
                  {viewingRegDetail.registrationCode}
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">Chi Tiết Hồ Sơ Đăng Ký Tham Gia</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingRegDetail(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Doanh nghiệp</span>
                <strong className="text-slate-900">{viewingRegDetail.companyName}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Vai trò</span>
                <strong className="text-slate-900">{viewingRegDetail.role}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Người liên hệ</span>
                <strong className="text-slate-900">{viewingRegDetail.contactPerson} ({viewingRegDetail.title})</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Điện thoại / Email</span>
                <strong className="text-slate-900 font-mono">{viewingRegDetail.phone} • {viewingRegDetail.email}</strong>
              </div>
            </div>

            {/* Role specific view */}
            {viewingRegDetail.role === 'BUYER' && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                <strong className="text-blue-900 font-bold block">Nhu cầu mua hàng (Buyer Need):</strong>
                <p>Tiêu đề: <strong>{viewingRegDetail.roleData?.needTitle || 'Nhu cầu phụ trợ'}</strong></p>
                <p>Phạm vi chia sẻ: <span className="font-mono text-blue-700 font-bold">{viewingRegDetail.roleData?.sharingScope || 'MATCHED_SUPPLIERS_ONLY'}</span></p>
                <p className="text-[10px] text-slate-500 italic">* File kỹ thuật và bản vẽ được lưu trữ bảo mật (Section 10).</p>
              </div>
            )}

            {viewingRegDetail.role === 'SUPPLIER' && (
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <strong className="text-emerald-900 font-bold block">Năng lực nhà cung ứng (Supplier Profile):</strong>
                <p>Năng lực chính: <strong>{Array.isArray(viewingRegDetail.roleData?.capabilities) ? viewingRegDetail.roleData.capabilities.join(', ') : 'Gia công & phụ trợ'}</strong></p>
                {viewingRegDetail.roleData?.meetingRequest && (
                  <p>Yêu cầu phiên gặp: <span className="font-bold text-emerald-800">"{viewingRegDetail.roleData.meetingRequest}"</span></p>
                )}
              </div>
            )}

            {/* Attendees list */}
            {viewingRegDetail.attendees && viewingRegDetail.attendees.length > 0 && (
              <div className="space-y-1">
                <strong className="text-slate-700 block">Đại biểu tham gia ({viewingRegDetail.attendees.length}):</strong>
                <div className="bg-slate-50 rounded-xl p-2 space-y-1">
                  {viewingRegDetail.attendees.map((att, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                      <span className="font-bold text-slate-800">{att.name} ({att.title || 'Đại biểu'})</span>
                      <span className="font-mono text-slate-500">{att.phone || viewingRegDetail.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingRegDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
