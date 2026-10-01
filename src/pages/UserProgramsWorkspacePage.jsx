import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink,
  ShieldAlert, PhoneCall, Mail, MessageSquare, Download, Layers,
  Lock, QrCode, AlertTriangle, UserCheck, RefreshCw, Printer
} from 'lucide-react';
import {
  getAllProgramRegistrations,
  getRegistrationByCode,
  REGISTRATION_STATUSES_ENUM,
  PAYMENT_STATUSES_ENUM,
  ATTENDANCE_STATUSES_ENUM,
  TARGET_ROLES_ENUM
} from '../data/programsData';

export default function UserProgramsWorkspacePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const codeParam = searchParams.get('code') || searchParams.get('id') || '';

  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(codeParam);
  const [selectedReg, setSelectedReg] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Lấy thông tin user hiện tại từ session
  const currentUser = useMemo(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }, []);

  // Load registrations from localStorage / memory với cơ chế bảo mật chống IDOR (Mục 13, 30, 31, 82)
  const reloadData = () => {
    const list = getAllProgramRegistrations();
    setRegistrations(list);

    // 1. Trường hợp có mã đăng ký cụ thể (?code=DK-... hoặc ?id=...)
    if (codeParam) {
      const found = list.find(r => r.registrationCode === codeParam || r.id === codeParam);
      if (found) {
        setSelectedReg(found);
      } else {
        setSelectedReg(null);
      }
      return;
    }

    // 2. Trường hợp đã đăng nhập với tổ chức hoặc thông tin liên hệ
    if (currentUser?.organizationId || currentUser?.phone || currentUser?.email) {
      const userOrgId = currentUser.organizationId;
      const userPhone = currentUser.phone;
      const userEmail = currentUser.email;

      const myRegs = list.filter(r =>
        (userOrgId && r.organizationId === userOrgId) ||
        (userPhone && r.phone === userPhone) ||
        (userEmail && r.email === userEmail)
      );

      if (myRegs.length > 0) {
        setSelectedReg(myRegs[0]);
      } else {
        setSelectedReg(null);
      }
      return;
    }

    // 3. Khách vãng lai chưa đăng nhập: Không auto-select hồ sơ của người khác
    setSelectedReg(null);
  };

  useEffect(() => {
    reloadData();
  }, [codeParam, currentUser]);

  // Filter list
  const filteredList = useMemo(() => {
    let result = [...registrations];

    // Phân quyền cách ly dữ liệu
    if (currentUser?.organizationId || currentUser?.phone || currentUser?.email) {
      const userOrgId = currentUser.organizationId;
      const userPhone = currentUser.phone;
      const userEmail = currentUser.email;
      result = result.filter(r =>
        (userOrgId && r.organizationId === userOrgId) ||
        (userPhone && r.phone === userPhone) ||
        (userEmail && r.email === userEmail)
      );
    } else if (!codeParam && !searchQuery.trim()) {
      // Khách vãng lai chưa tìm kiếm: Trả về danh sách trống để yêu cầu nhập mã tra cứu
      return [];
    }

    if (roleFilter !== 'ALL') {
      result = result.filter(r => r.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(r => r.registrationStatus === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(r =>
        (r.registrationCode && r.registrationCode.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q))
      );
    }

    return result;
  }, [registrations, roleFilter, statusFilter, searchQuery, currentUser, codeParam]);

  // Keep selected registration synced
  useEffect(() => {
    if (filteredList.length > 0) {
      if (!selectedReg || !filteredList.some(r => r.id === selectedReg.id)) {
        setSelectedReg(filteredList[0]);
      }
    } else {
      setSelectedReg(null);
    }
  }, [filteredList]);

  // Helper status color badges
  const getRegStatusBadge = (st) => {
    switch (st) {
      case REGISTRATION_STATUSES_ENUM.APPROVED:
        return { label: 'Đã duyệt hồ sơ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case REGISTRATION_STATUSES_ENUM.UNDER_REVIEW:
        return { label: 'Đang thẩm định', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case REGISTRATION_STATUSES_ENUM.NEED_MORE_INFO:
        return { label: 'Cần bổ sung hồ sơ', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case REGISTRATION_STATUSES_ENUM.REJECTED:
        return { label: 'Không phù hợp', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case REGISTRATION_STATUSES_ENUM.WITHDRAWN:
        return { label: 'Đã rút đăng ký', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case REGISTRATION_STATUSES_ENUM.CANCELLED:
        return { label: 'Đã hủy', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: 'Đã nộp đăng ký', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
  };

  const getPayStatusBadge = (st) => {
    switch (st) {
      case PAYMENT_STATUSES_ENUM.PAID:
        return { label: 'Đã thanh toán', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case PAYMENT_STATUSES_ENUM.NOT_REQUIRED:
        return { label: 'Miễn phí', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
      case PAYMENT_STATUSES_ENUM.PENDING:
        return { label: 'Chờ thanh toán', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case PAYMENT_STATUSES_ENUM.FAILED:
        return { label: 'Thanh toán thất bại', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case PAYMENT_STATUSES_ENUM.REFUNDED:
        return { label: 'Đã hoàn tiền', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Chưa bắt đầu', bg: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  const getAttStatusBadge = (st) => {
    switch (st) {
      case ATTENDANCE_STATUSES_ENUM.CHECKED_IN:
        return { label: 'Đã Check-in', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case ATTENDANCE_STATUSES_ENUM.ATTENDED:
        return { label: 'Đã tham dự', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case ATTENDANCE_STATUSES_ENUM.NO_SHOW:
        return { label: 'Vắng mặt', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case ATTENDANCE_STATUSES_ENUM.CANCELLED:
        return { label: 'Đã hủy', bg: 'bg-slate-100 text-slate-500 border-slate-200' };
      default:
        return { label: 'Dự kiến tham dự', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  // SEO
  useEffect(() => {
    document.title = 'Chương Trình Đã Đăng Ký | CHUOICUNGUNG.COM';
  }, []);

  const selectRegistration = (reg) => {
    setSelectedReg(reg);
    setSearchParams({ code: reg.registrationCode });
  };

  // Check if QR eligible (Section 29: Registration APPROVED AND Payment eligible AND Attendance EXPECTED)
  const isQrEligible = selectedReg &&
    selectedReg.registrationStatus === REGISTRATION_STATUSES_ENUM.APPROVED &&
    (selectedReg.paymentStatus === PAYMENT_STATUSES_ENUM.PAID || selectedReg.paymentStatus === PAYMENT_STATUSES_ENUM.NOT_REQUIRED) &&
    selectedReg.attendanceStatus === ATTENDANCE_STATUSES_ENUM.EXPECTED;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-300 font-mono mb-2">
                <Link to="/" className="hover:text-white transition">CCU B2B</Link>
                <span>/</span>
                <Link to="/chuong-trinh" className="hover:text-white transition">Chương trình kết nối</Link>
                <span>/</span>
                <span className="text-white font-bold">Hồ sơ tham gia của tôi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white flex items-center space-x-3">
                <Layers className="w-8 h-8 text-blue-400" />
                <span>Theo Dõi & Quản Lý Đăng Ký Chương Trình</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Tra cứu mã đăng ký, tiến độ thẩm định hồ sơ, xác nhận thanh toán, thẻ điện tử Check-in QR và lịch gặp 1:1 được điều phối.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={reloadData}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Làm mới dữ liệu</span>
              </button>
              <Link
                to="/chuong-trinh"
                className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
              >
                <span>Xem thêm sự kiện</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mã đăng ký (DK-2026-...), tên chương trình, doanh nghiệp, email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value={TARGET_ROLES_ENUM.BUYER}>Người mua (Buyer)</option>
              <option value={TARGET_ROLES_ENUM.SUPPLIER}>Nhà cung ứng (Supplier)</option>
              <option value={TARGET_ROLES_ENUM.SPONSOR}>Đối tác tài trợ (Sponsor)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value={REGISTRATION_STATUSES_ENUM.SUBMITTED}>Đã nộp đăng ký</option>
              <option value={REGISTRATION_STATUSES_ENUM.UNDER_REVIEW}>Đang thẩm định</option>
              <option value={REGISTRATION_STATUSES_ENUM.APPROVED}>Đã phê duyệt</option>
              <option value={REGISTRATION_STATUSES_ENUM.NEED_MORE_INFO}>Cần bổ sung hồ sơ</option>
              <option value={REGISTRATION_STATUSES_ENUM.REJECTED}>Từ chối</option>
            </select>
          </div>
        </div>

        {/* Master - Detail Workspace */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Chưa tìm thấy đăng ký nào</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Không có hồ sơ nào khớp với bộ lọc hoặc từ khóa tìm kiếm. Bạn có thể xóa bộ lọc hoặc đăng ký tham gia một chương trình mới.
              </p>
            </div>
            <Link
              to="/chuong-trinh"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-blue-600 transition"
            >
              <span>Khám phá các chương trình đang mở</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Registrations List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-500 px-1 flex items-center justify-between">
                <span>Danh sách đăng ký ({filteredList.length})</span>
                <span className="font-mono text-[11px] text-slate-400">Section 35 Account Spec</span>
              </div>

              {filteredList.map((reg) => {
                const isSelected = selectedReg && selectedReg.id === reg.id;
                const regBadge = getRegStatusBadge(reg.registrationStatus);
                const payBadge = getPayStatusBadge(reg.paymentStatus);
                const attBadge = getAttStatusBadge(reg.attendanceStatus);

                return (
                  <div
                    key={reg.id}
                    onClick={() => selectRegistration(reg)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {reg.registrationCode}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {reg.role}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1.5">
                      {reg.programTitle}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1 mb-3">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{reg.companyName}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Nộp lúc: {new Date(reg.submittedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* 3 Status Micro Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-medium ${regBadge.bg}`}>
                        ĐK: {regBadge.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-medium ${payBadge.bg}`}>
                        Phí: {payBadge.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-medium ${attBadge.bg}`}>
                        TD: {attBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed View (7 cols) */}
            {selectedReg && (
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Main Overview Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                  
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono text-xs font-black">
                          {selectedReg.registrationCode}
                        </span>
                        <span className="text-xs text-slate-400">• Vai trò: <strong className="text-slate-700">{selectedReg.role}</strong></span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                        {selectedReg.programTitle}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Gói tham gia: <strong className="text-slate-800">{selectedReg.participationOptionTitle}</strong> ({selectedReg.feeType === 'FREE' ? 'Miễn phí' : `${selectedReg.feeAmount?.toLocaleString('vi-VN')} đ`})
                      </p>
                    </div>

                    <Link
                      to={`/chuong-trinh/${selectedReg.programId}`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center space-x-1 transition shrink-0"
                    >
                      <span>Trang sự kiện</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 3 SEPARATE STATUS CARDS (SECTION 24, 25, 26, 27) */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Ba Trạng Thái Vận Hành Độc Lập (Section 27 Spec)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      
                      {/* Status 1: Registration */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">1. Hồ sơ đăng ký</span>
                        <span className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-bold ${getRegStatusBadge(selectedReg.registrationStatus).bg}`}>
                          {getRegStatusBadge(selectedReg.registrationStatus).label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {selectedReg.registrationStatus === REGISTRATION_STATUSES_ENUM.APPROVED
                            ? 'Ban điều phối đã chấp thuận điều kiện tham gia.'
                            : selectedReg.registrationStatus === REGISTRATION_STATUSES_ENUM.NEED_MORE_INFO
                            ? 'Cần bổ sung chi tiết theo yêu cầu.'
                            : 'Hồ sơ đang đợi ban điều phối thẩm định.'}
                        </p>
                      </div>

                      {/* Status 2: Payment */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">2. Trạng thái phí</span>
                        <span className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-bold ${getPayStatusBadge(selectedReg.paymentStatus).bg}`}>
                          {getPayStatusBadge(selectedReg.paymentStatus).label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {selectedReg.paymentStatus === PAYMENT_STATUSES_ENUM.NOT_REQUIRED
                            ? 'Hình thức tham gia không tính phí.'
                            : selectedReg.paymentStatus === PAYMENT_STATUSES_ENUM.PAID
                            ? 'Đã xác nhận thanh toán đầy đủ.'
                            : 'Chờ thanh toán sau khi duyệt hồ sơ.'}
                        </p>
                      </div>

                      {/* Status 3: Attendance */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">3. Điểm danh tham dự</span>
                        <span className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-bold ${getAttStatusBadge(selectedReg.attendanceStatus).bg}`}>
                          {getAttStatusBadge(selectedReg.attendanceStatus).label}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {selectedReg.attendanceStatus === ATTENDANCE_STATUSES_ENUM.CHECKED_IN
                            ? 'Đã quét mã tại quầy lễ tân sự kiện.'
                            : 'Sẵn sàng khi đến địa điểm tổ chức.'}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* 2. QR CHECK-IN CARD (SECTION 29: Only when approved & paid/free) */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <QrCode className="w-5 h-5 text-blue-400" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                            Thẻ Điện Tử Check-In Sự Kiện
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white font-heading">
                          Mã Thẻ Quét Điểm Danh Tại Quầy Lễ Tân
                        </h3>
                        <p className="text-xs text-slate-300 max-w-sm">
                          {isQrEligible 
                            ? 'Mã hợp lệ. Vui lòng xuất trình ảnh này tại cổng kiểm soát hoặc mở trên điện thoại khi đến sự kiện.'
                            : 'Mã QR chỉ được cấp phát tự động sau khi Hồ sơ được Duyệt (Approved) và hoàn tất nghĩa vụ phí (nếu có).'}
                        </p>
                        {isQrEligible && (
                          <div className="pt-1">
                            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
                              TOKEN: {selectedReg.qrToken || `QR-${selectedReg.registrationCode}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Visual QR Box */}
                      <div className="p-3 bg-white rounded-2xl shadow-lg shrink-0 text-center">
                        {isQrEligible ? (
                          <div className="space-y-1">
                            {/* Stylized QR Simulation */}
                            <div className="w-32 h-32 bg-slate-950 p-2 rounded-xl flex flex-col justify-between">
                              <div className="flex justify-between">
                                <div className="w-7 h-7 border-4 border-white bg-slate-950 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white"></div>
                                </div>
                                <div className="w-7 h-7 border-4 border-white bg-slate-950 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white"></div>
                                </div>
                              </div>
                              <div className="flex items-center justify-center">
                                <span className="font-mono text-[9px] text-white font-bold tracking-widest">CCU-PASS</span>
                              </div>
                              <div className="flex justify-between">
                                <div className="w-7 h-7 border-4 border-white bg-slate-950 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white"></div>
                                </div>
                                <div className="w-5 h-5 bg-white"></div>
                              </div>
                            </div>
                            <span className="font-mono text-[10px] text-slate-600 font-bold block">
                              {selectedReg.registrationCode}
                            </span>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-slate-100 rounded-xl flex flex-col items-center justify-center p-3 text-center border-2 border-dashed border-slate-300">
                            <Lock className="w-6 h-6 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-500">Chưa Đủ Điều Kiện Cấp QR</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Rejection Reason Warning (Section 40) */}
                  {selectedReg.registrationStatus === REGISTRATION_STATUSES_ENUM.REJECTED && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                      <div className="flex items-center space-x-2 font-bold text-xs text-rose-900">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Lý do không phù hợp tiêu chí đợt này:</span>
                      </div>
                      <p className="text-xs">
                        {selectedReg.rejectionReason === 'NOT_ELIGIBLE' ? 'Chưa đáp ứng tiêu chuẩn ngành hàng của chương trình.' :
                         selectedReg.rejectionReason === 'PROGRAM_FULL' ? 'Số lượng bàn làm việc đã đạt giới hạn tiếp nhận.' :
                         selectedReg.rejectionReason === 'PROFILE_INCOMPLETE' ? 'Hồ sơ năng lực chưa đủ thông tin kỹ thuật.' :
                         selectedReg.rejectionReason === 'SCOPE_NOT_MATCH' ? 'Phạm vi cung ứng chưa trùng khớp với nhu cầu Buyer.' :
                         selectedReg.rejectionReason || 'Hồ sơ chưa phù hợp với đợt giao thương này.'}
                      </p>
                      {selectedReg.reviewNotes && (
                        <p className="text-xs text-rose-700 italic pt-1">
                          Ghi chú từ điều phối viên: "{selectedReg.reviewNotes}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* 4. Company & Delegate Info (Section 31 & 32) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Thông Tin Doanh Nghiệp & Đoàn Đại Biểu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Tên doanh nghiệp</span>
                        <strong className="text-slate-900">{selectedReg.companyName}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Đầu mối phụ trách</span>
                        <strong className="text-slate-900">{selectedReg.contactPerson} ({selectedReg.title})</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Số điện thoại liên hệ</span>
                        <strong className="text-slate-900">{selectedReg.phone}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Email xác nhận</span>
                        <strong className="text-slate-900">{selectedReg.email}</strong>
                      </div>
                    </div>

                    {/* Attendee list */}
                    {selectedReg.attendees && selectedReg.attendees.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          Danh sách đại biểu tham gia ({selectedReg.attendees.length} người):
                        </span>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-2.5">Họ và tên</th>
                                <th className="p-2.5">Chức vụ</th>
                                <th className="p-2.5">Số điện thoại</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedReg.attendees.map((att, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-2.5 font-bold text-slate-800">{att.name}</td>
                                  <td className="p-2.5 text-slate-600">{att.title || 'Đại biểu'}</td>
                                  <td className="p-2.5 text-slate-600 font-mono">{att.phone || selectedReg.phone}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. Role Specific Details */}
                  {selectedReg.role === TARGET_ROLES_ENUM.BUYER && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                      <h4 className="font-bold text-blue-900 flex items-center space-x-1.5">
                        <ShoppingCart className="w-4 h-4 text-blue-700" />
                        <span>Nhu Cầu Mua Hàng Đăng Ký Tìm Nhà Cung Ứng (Section 8 & 9)</span>
                      </h4>
                      <p className="text-slate-700">
                        Hạng mục: <strong>{selectedReg.roleData?.needTitle || 'Nhu cầu cung ứng linh kiện/vật tư'}</strong>
                      </p>
                      <p className="text-slate-600">
                        Phạm vi chia sẻ: <span className="font-mono font-bold text-blue-800">{selectedReg.roleData?.sharingScope || 'MATCHED_SUPPLIERS_ONLY'}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        * Nhu cầu mua hàng được lưu ở chế độ bảo mật theo đúng phạm vi bạn cho phép, không tự động công khai toàn mạng lưới.
                      </p>
                    </div>
                  )}

                  {selectedReg.role === TARGET_ROLES_ENUM.SUPPLIER && (
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs">
                      <h4 className="font-bold text-emerald-900 flex items-center space-x-1.5">
                        <Factory className="w-4 h-4 text-emerald-700" />
                        <span>Hồ Sơ Năng Lực & Đề Nghị Cuộc Gặp (Section 11, 14 & 15)</span>
                      </h4>
                      <p className="text-slate-700">
                        Năng lực đăng ký: <strong>{Array.isArray(selectedReg.roleData?.capabilities) ? selectedReg.roleData.capabilities.join(', ') : 'Gia công & cung ứng'}</strong>
                      </p>
                      {selectedReg.roleData?.meetingRequest && (
                        <p className="text-slate-700">
                          Đề nghị kết nối: <span className="font-bold text-emerald-900">"{selectedReg.roleData.meetingRequest}"</span>
                        </p>
                      )}
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                        <strong>Quy tắc Section 15:</strong> Việc nộp đề nghị gặp và đóng phí tham gia chưa đồng nghĩa cuộc gặp đã được xác nhận. Ban điều phối sẽ kiểm tra độ phù hợp của Buyer và gửi lịch chốt trước sự kiện 03 ngày.
                      </div>
                    </div>
                  )}

                  {selectedReg.role === TARGET_ROLES_ENUM.SPONSOR && (
                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2 text-xs">
                      <h4 className="font-bold text-purple-900 flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-purple-700" />
                        <span>Hồ Sơ Quan Tâm Đồng Hành & Tài Trợ (Section 16 & 17)</span>
                      </h4>
                      <p className="text-slate-700">
                        Hình thức đề xuất: <strong>{selectedReg.roleData?.sponsorshipType || 'Tài trợ gian hàng / Media'}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        * Đăng ký của đối tác tài trợ được tiếp nhận dưới dạng Inquiry trao đổi thương mại, chưa tự kích hoạt hợp đồng quyền lợi chính thức.
                      </p>
                    </div>
                  )}

                  {/* 6. Coordinator Assigned Info (Section 22) */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        ĐP
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Điều phối viên phụ trách</span>
                        <strong className="text-slate-800">{selectedReg.ownerName || 'Lê Minh Quân (CCU Nam)'}</strong>
                      </div>
                    </div>

                    <a
                      href="tel:0901234567"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                      <span>Hỗ trợ nhanh</span>
                    </a>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
