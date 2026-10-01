import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink,
  ShieldAlert, PhoneCall, Mail, MessageSquare, Download, Layers,
  Lock, QrCode, AlertTriangle, Plus, Trash2
} from 'lucide-react';
import {
  getProgramByIdOrSlug,
  calculateFeeDisplay,
  submitProgramRegistration,
  saveProgramRegistrationDraft,
  getProgramRegistrationDraft,
  clearProgramRegistrationDraft,
  checkProgramRegistrationDuplicate,
  REGISTRATION_STATUSES_ENUM,
  PAYMENT_STATUSES_ENUM,
  ATTENDANCE_STATUSES_ENUM,
  TARGET_ROLES_ENUM
} from '../data/programsData';

export default function ProgramRegistrationPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Load Program
  const program = useMemo(() => {
    return getProgramByIdOrSlug(slug);
  }, [slug]);

  // Determine initial role from query param ?role=buyer | ?role=supplier | ?role=sponsor
  const roleParam = searchParams.get('role');
  const initialRole =
    roleParam === 'buyer' ? TARGET_ROLES_ENUM.BUYER :
      roleParam === 'sponsor' ? TARGET_ROLES_ENUM.SPONSOR :
        TARGET_ROLES_ENUM.SUPPLIER;

  // Multi-step Stepper State (Step 1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Autosave Draft Notification
  const [draftSavedTime, setDraftSavedTime] = useState(null);

  // Duplicate Warning Modal
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Success Submission State
  const [submittedRegistration, setSubmittedRegistration] = useState(null);

  // Loading & Submission Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // --------------------------------------------------------------------------
  // FORM STATE (STEP 1, 2, 3)
  // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    // Step 1: Role & Common Info
    role: initialRole,
    companyName: '',
    organizationId: '',
    contactPerson: '',
    title: '',
    email: '',
    phone: '',
    attendeesCount: 1,
    attendees: [],
    participationOptionId: '',

    // Step 2: Buyer specific
    buyerData: {
      needCategory: '',
      needTitle: '',
      needDescription: '',
      serviceArea: '',
      timeline: 'Trong 30 ngày',
      estimatedQuantity: '',
      technicalStandards: 'Đạt chuẩn ISO 9001 hoặc tương đương',
      sampleRequired: true,
      surveyRequired: false,
      sharingScope: 'MATCHED_SUPPLIERS_ONLY', // 'PRIVATE' | 'MATCHED_SUPPLIERS_ONLY' | 'PUBLIC_SUMMARY'
      technicalAttachments: []
    },

    // Step 2: Supplier specific
    supplierData: {
      category: '',
      capabilities: ['Gia công CNC chính xác', 'Cung ứng phụ trợ KCN'],
      productsServices: '',
      serviceArea: 'Miền Nam & toàn quốc',
      websiteUrl: '',
      catalogueUrl: '',
      samplesToDisplay: '',
      meetingRequest: '',
      notes: ''
    },

    // Step 2: Sponsor specific
    sponsorData: {
      tierInterest: 'Tài trợ Vàng (Gian làm việc lớn & Kỷ yếu)',
      contributionMode: 'Tài chính & Đồng hành truyền thông',
      budgetRange: 'Từ 20.000.000 VNĐ',
      expectedBenefits: 'Logo trên backdrop, kỷ yếu, phát biểu VIP',
      representativeName: '',
      notes: ''
    },

    // Step 3: Consents (Section 21)
    consents: {
      dataProcessing: true,  // Required
      programSharing: true,  // Required
      marketing: false       // Optional
    }
  });

  // Load Saved Draft on mount
  useEffect(() => {
    if (!slug) return;
    const saved = getProgramRegistrationDraft(slug);
    if (saved) {
      setFormData(prev => ({
        ...prev,
        ...saved,
        role: roleParam ? initialRole : (saved.role || initialRole)
      }));
      setDraftSavedTime(saved.savedAt ? new Date(saved.savedAt).toLocaleTimeString('vi-VN') : null);
    }
  }, [slug, roleParam, initialRole]);

  // Set default participation option when program loads or role changes
  useEffect(() => {
    if (program && program.participationOptions) {
      const availableForRole = program.participationOptions.filter(
        o => o.role === formData.role || o.role === 'ALL'
      );
      if (availableForRole.length > 0 && !formData.participationOptionId) {
        setFormData(prev => ({ ...prev, participationOptionId: availableForRole[0].id }));
      }
    }
  }, [program, formData.role, formData.participationOptionId]);

  // Pre-fill Buyer or Supplier defaults from Program
  useEffect(() => {
    if (program) {
      setFormData(prev => ({
        ...prev,
        buyerData: {
          ...prev.buyerData,
          needCategory: prev.buyerData.needCategory || program.industry || '',
          serviceArea: prev.buyerData.serviceArea || program.kcn || program.location || ''
        },
        supplierData: {
          ...prev.supplierData,
          category: prev.supplierData.category || program.industry || '',
          serviceArea: prev.supplierData.serviceArea || program.zone || ''
        }
      }));
    }
  }, [program]);

  // Autosave Draft upon changes (Section 34)
  const handleFormChange = (updates) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      saveProgramRegistrationDraft(slug, next);
      setDraftSavedTime(new Date().toLocaleTimeString('vi-VN'));
      return next;
    });
  };

  // SEO: NOINDEX on Registration Form (Section 51)
  useEffect(() => {
    document.title = `Đăng Ký Tham Gia: ${program?.shortName || program?.title || 'Chương trình'} | CHUOICUNGUNG.COM`;
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (metaRobots) metaRobots.setAttribute('content', 'index, follow');
    };
  }, [program]);

  // Validation before step transition
  const validateStep1 = () => {
    setSubmitError('');
    if (!formData.companyName.trim()) {
      setSubmitError('Vui lòng nhập tên doanh nghiệp / nhà máy.');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setSubmitError('Vui lòng nhập họ tên người phụ trách liên hệ.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSubmitError('Vui lòng nhập địa chỉ email hợp lệ để nhận thông báo.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setSubmitError('Vui lòng nhập số điện thoại liên hệ hợp lệ.');
      return false;
    }

    // Duplicate Check
    const existing = checkProgramRegistrationDuplicate(program.id, formData.companyName, formData.role);
    if (existing) {
      setDuplicateWarning(existing);
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    setSubmitError('');
    if (formData.role === TARGET_ROLES_ENUM.BUYER) {
      if (!formData.buyerData.needTitle.trim()) {
        setSubmitError('Vui lòng nhập tóm tắt nhu cầu phụ trợ / linh kiện cần tìm.');
        return false;
      }
    } else if (formData.role === TARGET_ROLES_ENUM.SUPPLIER) {
      if (!formData.supplierData.productsServices.trim()) {
        setSubmitError('Vui lòng nhập các sản phẩm / dịch vụ chính của doanh nghiệp.');
        return false;
      }
    }
    return true;
  };

  // Submit Handler (Section 22 & 23)
  const handleSubmitRegistration = (e) => {
    if (e) e.preventDefault();
    setSubmitError('');

    if (!formData.consents.dataProcessing) {
      setSubmitError('Vui lòng đồng ý với điều khoản xử lý thông tin để tiếp tục.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Resolve role-specific payload
      let roleData = {};
      if (formData.role === TARGET_ROLES_ENUM.BUYER) {
        roleData = formData.buyerData;
      } else if (formData.role === TARGET_ROLES_ENUM.SUPPLIER) {
        roleData = formData.supplierData;
      } else if (formData.role === TARGET_ROLES_ENUM.SPONSOR) {
        roleData = formData.sponsorData;
      }

      const selectedOption = program.participationOptions?.find(
        o => o.id === formData.participationOptionId
      ) || program.participationOptions?.[0];

      const res = submitProgramRegistration({
        programId: program.id,
        role: formData.role,
        participationOptionId: selectedOption?.id,
        companyName: formData.companyName,
        organizationId: formData.organizationId,
        contactPerson: formData.contactPerson,
        title: formData.title,
        email: formData.email,
        phone: formData.phone,
        attendeesCount: formData.attendeesCount,
        attendees: formData.attendees,
        roleData,
        consents: formData.consents
      });

      if (res.success) {
        clearProgramRegistrationDraft(slug);
        setSubmittedRegistration(res.registration);
      }
    } catch (err) {
      setSubmitError(err.message || 'Lỗi gửi hồ sơ đăng ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If program is not found or cancelled
  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Chương Trình Không Tồn Tại
          </h2>
          <p className="text-xs text-slate-600">
            Không tìm thấy chương trình theo mã này. Vui lòng quay lại danh sách.
          </p>
          <Link
            to="/chuong-trinh"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0052cc] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách chương trình</span>
          </Link>
        </div>
      </div>
    );
  }

  // Selected Option details
  const selectedOption = program.participationOptions?.find(
    o => o.id === formData.participationOptionId
  ) || program.participationOptions?.[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 sm:pb-20 font-sans">

      {/* ========================================================
          1. HEADER & PROGRAM SUMMARY (SECTION 2)
      ======================================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/chuong-trinh/${program.slug || program.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chi tiết chương trình</span>
            </Link>

            {draftSavedTime && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Đã tự động lưu nháp ({draftSavedTime})</span>
              </span>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0052cc] font-mono">
              {program.publicCode} • {program.typeName}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-slate-950 tracking-tight">
              ĐĂNG KÝ THAM GIA: {program.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chọn vai trò và cho biết nhu cầu hoặc năng lực của doanh nghiệp. Thông tin giúp đội điều phối chuẩn bị hình thức tham gia và bàn kết nối phù hợp.
            </p>
          </div>

          {/* Quick Fact Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{program.date} ({program.time})</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="truncate max-w-[250px]">{program.venue || program.location}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{calculateFeeDisplay(program, formData.role)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. STEPPER PROGRESS (SECTION 3)
      ======================================================== */}
      {!submittedRegistration && (
        <div className="bg-white border-b border-slate-200/90 py-3 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 p-2 rounded-xl transition cursor-pointer ${currentStep === 1
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : currentStep > 1
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 1 ? 'bg-[#0052cc] text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <span className="truncate hidden sm:inline">BƯỚC 1: VAI TRÒ & THÔNG TIN CHUNG</span>
                <span className="sm:hidden font-bold">BƯỚC 1</span>
              </div>

              <div
                onClick={() => { if (validateStep1()) setCurrentStep(2); }}
                className={`flex items-center gap-2 p-2 rounded-xl transition cursor-pointer ${currentStep === 2
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : currentStep > 2
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 2 ? 'bg-[#0052cc] text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </span>
                <span className="truncate hidden sm:inline">BƯỚC 2: NHU CẦU / NĂNG LỰC</span>
                <span className="sm:hidden font-bold">BƯỚC 2</span>
              </div>

              <div
                onClick={() => { if (validateStep1() && validateStep2()) setCurrentStep(3); }}
                className={`flex items-center gap-2 p-2 rounded-xl transition cursor-pointer ${currentStep === 3
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : 'text-slate-400'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 3 ? 'bg-[#0052cc] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  3
                </span>
                <span className="truncate hidden sm:inline">BƯỚC 3: KIỂM TRA & XÁC NHẬN</span>
                <span className="sm:hidden font-bold">BƯỚC 3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MAIN FORM BODY
      ======================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Error Alert */}
        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>{submitError}</div>
          </div>
        )}

        {/* ----------------------------------------------------
            SUCCESS SUBMISSION VIEW (SECTIONS 23, 27, 28, 29)
        ---------------------------------------------------- */}
        {submittedRegistration ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                TIẾP NHẬN HỒ SƠ THÀNH CÔNG
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                CHÚNG TÔI ĐÃ NHẬN ĐĂNG KÝ {submittedRegistration.registrationCode}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Hồ sơ tham gia của Quý doanh nghiệp đã được chuyển tới Điều phối viên phụ trách ({submittedRegistration.ownerName}).
              </p>
            </div>

            {/* THREE SEPARATE STATUSES (SECTION 27) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500 font-medium">1. Hồ sơ đăng ký</div>
                <div className="font-bold text-blue-700 font-mono mt-0.5">
                  {submittedRegistration.registrationStatus}
                </div>
                <div className="text-[10px] text-slate-400">Đang thẩm định</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500 font-medium">2. Thanh toán</div>
                <div className="font-bold text-emerald-700 font-mono mt-0.5">
                  {submittedRegistration.paymentStatus}
                </div>
                <div className="text-[10px] text-slate-400">
                  {submittedRegistration.paymentStatus === 'NOT_REQUIRED' ? 'Miễn phí' : 'Chờ duyệt hồ sơ'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="text-[11px] text-slate-500 font-medium">3. Thẻ tham dự</div>
                <div className="font-bold text-slate-700 font-mono mt-0.5">
                  {submittedRegistration.attendanceStatus}
                </div>
                <div className="text-[10px] text-slate-400">Cấp QR sau khi duyệt</div>
              </div>
            </div>

            {/* Next Steps Advisory */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 text-left max-w-xl mx-auto space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Quy trình điều phối tiếp theo (Next Steps):</span>
              </div>
              <ul className="pl-4 list-disc space-y-1 text-slate-700">
                <li>Điều phối viên sẽ đối soát hồ sơ năng lực và danh mục phụ trợ trong vòng 24 giờ.</li>
                <li>Sau khi được phê duyệt (APPROVED), hệ thống sẽ gửi thông báo qua Email & SMS kèm đường dẫn hoàn tất thanh toán (nếu có phí) và mã QR Check-in.</li>
                <li>Lịch hẹn 1:1 với Người mua sẽ được bố trí dựa trên mức độ phù hợp kỹ thuật.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/chuong-trinh/${program.slug || program.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition"
              >
                Quay lại trang chương trình
              </Link>
              <Link
                to="/tai-khoan/yeu-cau-dich-vu"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                Theo dõi tại Workspace cá nhân
              </Link>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------
              STEP-BY-STEP FORM ENGINE
          ---------------------------------------------------- */
          <form onSubmit={handleSubmitRegistration} className="space-y-6">

            {/* ==================================================
                STEP 1: ROLE SELECTION & COMMON INFORMATION
            ================================================== */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">

                {/* 1. Role Selection (Section 5) */}
                <div className="space-y-3">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">
                    1. Chọn vai trò tham gia của doanh nghiệp <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => handleFormChange({ role: TARGET_ROLES_ENUM.BUYER })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${formData.role === TARGET_ROLES_ENUM.BUYER
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Factory className={`w-5 h-5 ${formData.role === TARGET_ROLES_ENUM.BUYER ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          FDI / Nhà Máy
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">Người Mua (Buyer)</div>
                        <p className="text-[11px] text-slate-500 leading-snug">Tìm nhà cung cấp phụ trợ, vật tư sản xuất và gia công nội địa.</p>
                      </div>
                    </div>

                    <div
                      onClick={() => handleFormChange({ role: TARGET_ROLES_ENUM.SUPPLIER })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${formData.role === TARGET_ROLES_ENUM.SUPPLIER
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className={`w-5 h-5 ${formData.role === TARGET_ROLES_ENUM.SUPPLIER ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Nhà Cung Ứng
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">Nhà Cung Cấp (Supplier)</div>
                        <p className="text-[11px] text-slate-500 leading-snug">Cơ khí CNC, khuôn mẫu, bao bì, phòng sạch, vật tư công nghiệp.</p>
                      </div>
                    </div>

                    <div
                      onClick={() => handleFormChange({ role: TARGET_ROLES_ENUM.SPONSOR })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${formData.role === TARGET_ROLES_ENUM.SPONSOR
                        ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Award className={`w-5 h-5 ${formData.role === TARGET_ROLES_ENUM.SPONSOR ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          Đồng Hành
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">Tài Trợ / KCN (Sponsor)</div>
                        <p className="text-[11px] text-slate-500 leading-snug">Quảng bá thương hiệu, đồng hành tổ chức và kết nối hệ sinh thái.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Common Fields (Section 6) */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    2. Thông tin pháp nhân & Đại diện liên hệ
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">
                        Tên doanh nghiệp / Nhà máy <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleFormChange({ companyName: e.target.value })}
                        placeholder="VD: Công ty TNHH Cơ Khí Chính Xác Long Thành"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Họ và tên người liên hệ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => handleFormChange({ contactPerson: e.target.value })}
                        placeholder="VD: Nguyễn Văn Nam"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Chức vụ / Phòng ban
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleFormChange({ title: e.target.value })}
                        placeholder="VD: Trưởng phòng Mua hàng / Giám đốc Kinh doanh"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Email xác nhận thông báo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleFormChange({ email: e.target.value })}
                        placeholder="contact@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleFormChange({ phone: e.target.value })}
                        placeholder="09xx xxx xxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Số đại biểu dự kiến tham gia
                      </label>
                      <select
                        value={formData.attendeesCount}
                        onChange={(e) => handleFormChange({ attendeesCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>01 người (Chính thức)</option>
                        <option value={2}>02 người (Tiêu chuẩn bàn B2B)</option>
                        <option value={3}>03 người</option>
                        <option value={4}>04 người (Đoàn doanh nghiệp)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Participation Option Selection (Section 10 & 19) */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-bold text-slate-900">
                      3. Chọn hình thức tham gia & Gói dịch vụ <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-500">Áp dụng theo vai trò đang chọn</span>
                  </div>

                  <div className="space-y-2.5">
                    {program.participationOptions && program.participationOptions
                      .filter(o => o.role === formData.role || o.role === 'ALL')
                      .map((opt) => {
                        const isSelected = formData.participationOptionId === opt.id;
                        const isFree = opt.feeType === 'FREE';

                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleFormChange({ participationOptionId: opt.id })}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSelected
                              ? 'border-[#0052cc] bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {opt.title}
                                </span>
                                {isFree && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                                    MIỄN PHÍ
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {opt.description}
                              </p>
                            </div>

                            <div className="shrink-0 sm:text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-black font-mono inline-block ${isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-900'
                                }`}>
                                {isFree ? '0 đ' : `${opt.amount?.toLocaleString('vi-VN')} ${opt.currency || 'VND'}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Bước 1/3: Khởi tạo thông tin cơ bản
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Tiếp Tục Bước 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 2: ROLE-SPECIFIC DETAILED INFORMATION
            ================================================== */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">

                {/* A. BUYER SPECIFIC FIELDS (SECTION 8, 9, 10) */}
                {formData.role === TARGET_ROLES_ENUM.BUYER && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <Factory className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                          Thông Tin Nhu Cầu Tìm Nguồn Cung Ứng (Buyer Sourcing Need)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Hệ thống sẽ dùng thông tin này để thẩm định và sắp xếp bàn gặp nhà cung cấp phụ trợ phù hợp.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Tiêu đề nhu cầu linh kiện / vật tư cần tìm <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.buyerData.needTitle}
                          onChange={(e) => handleFormChange({
                            buyerData: { ...formData.buyerData, needTitle: e.target.value }
                          })}
                          placeholder="VD: Cần tìm nhà máy gia công đồ gá Jig & chi tiết nhôm CNC 5 trục"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Nhóm ngành hàng / Chuyên mục
                        </label>
                        <input
                          type="text"
                          value={formData.buyerData.needCategory}
                          onChange={(e) => handleFormChange({
                            buyerData: { ...formData.buyerData, needCategory: e.target.value }
                          })}
                          placeholder="VD: Cơ khí chính xác & Bán dẫn"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Địa bàn giao hàng / KCN
                        </label>
                        <input
                          type="text"
                          value={formData.buyerData.serviceArea}
                          onChange={(e) => handleFormChange({
                            buyerData: { ...formData.buyerData, serviceArea: e.target.value }
                          })}
                          placeholder="VD: KCN VSIP 1, Thuận An, Bình Dương"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Mô tả kỹ thuật & Quy cách chi tiết
                        </label>
                        <textarea
                          rows={3}
                          value={formData.buyerData.needDescription}
                          onChange={(e) => handleFormChange({
                            buyerData: { ...formData.buyerData, needDescription: e.target.value }
                          })}
                          placeholder="Mô tả thông số vật liệu, dung sai gia công, số lượng dự kiến theo tháng..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                        />
                      </div>

                      <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <label className="block text-slate-900 font-bold">
                          Phạm vi chia sẻ thông tin nhu cầu (Sharing Scope - Section 8 & 10):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sharingScope"
                              value="MATCHED_SUPPLIERS_ONLY"
                              checked={formData.buyerData.sharingScope === 'MATCHED_SUPPLIERS_ONLY'}
                              onChange={() => handleFormChange({
                                buyerData: { ...formData.buyerData, sharingScope: 'MATCHED_SUPPLIERS_ONLY' }
                              })}
                            />
                            <span>Chỉ gửi nhà cung cấp đã duyệt</span>
                          </label>

                          <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sharingScope"
                              value="PUBLIC_SUMMARY"
                              checked={formData.buyerData.sharingScope === 'PUBLIC_SUMMARY'}
                              onChange={() => handleFormChange({
                                buyerData: { ...formData.buyerData, sharingScope: 'PUBLIC_SUMMARY' }
                              })}
                            />
                            <span>Công khai tóm tắt trên sàn</span>
                          </label>

                          <label className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="sharingScope"
                              value="PRIVATE"
                              checked={formData.buyerData.sharingScope === 'PRIVATE'}
                              onChange={() => handleFormChange({
                                buyerData: { ...formData.buyerData, sharingScope: 'PRIVATE' }
                              })}
                            />
                            <span>Kín tuyệt đối (Chỉ CCU)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. SUPPLIER SPECIFIC FIELDS (SECTION 11, 12, 14, 15) */}
                {formData.role === TARGET_ROLES_ENUM.SUPPLIER && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                          Thông Tin Năng Lực Sản Xuất & Mẫu Trưng Bày (Supplier Capability)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Cung cấp danh mục phụ trợ để Điều phối viên thẩm định và kết nối với các Trưởng phòng Purchasing.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Ngành hàng / Lĩnh vực cung ứng chính
                        </label>
                        <input
                          type="text"
                          value={formData.supplierData.category}
                          onChange={(e) => handleFormChange({
                            supplierData: { ...formData.supplierData, category: e.target.value }
                          })}
                          placeholder="VD: Gia công cơ khí chính xác, đồ gá Jig"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Địa bàn phục vụ chính
                        </label>
                        <input
                          type="text"
                          value={formData.supplierData.serviceArea}
                          onChange={(e) => handleFormChange({
                            supplierData: { ...formData.supplierData, serviceArea: e.target.value }
                          })}
                          placeholder="VD: Bình Dương, Đồng Nai, TP.HCM"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Sản phẩm / Dịch vụ chào hàng tại sự kiện <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.supplierData.productsServices}
                          onChange={(e) => handleFormChange({
                            supplierData: { ...formData.supplierData, productsServices: e.target.value }
                          })}
                          placeholder="VD: Bu lông Inox 304, đai ốc tiêu chuẩn DIN, đồ gá kiểm tra bản mạch"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Mẫu sản phẩm mang theo trưng bày tại bàn B2B (Physical Samples)
                        </label>
                        <input
                          type="text"
                          value={formData.supplierData.samplesToDisplay}
                          onChange={(e) => handleFormChange({
                            supplierData: { ...formData.supplierData, samplesToDisplay: e.target.value }
                          })}
                          placeholder="VD: 01 hộp mẫu bulong Inox vi sinh và 02 đồ gá phôi nhôm mạ crom"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Đề nghị cuộc gặp 1:1 (Meeting Request - Section 14)
                        </label>
                        <textarea
                          rows={2}
                          value={formData.supplierData.meetingRequest}
                          onChange={(e) => handleFormChange({
                            supplierData: { ...formData.supplierData, meetingRequest: e.target.value }
                          })}
                          placeholder="Ghi rõ nhà máy hoặc nhóm nhu cầu bạn mong muốn gặp để Điều phối viên xem xét xếp lịch."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 leading-relaxed"
                        />
                        <span className="text-[11px] text-amber-700 block mt-1">
                          ⚠️ Lưu ý: Đề nghị cuộc gặp sẽ được đối soát theo tính phù hợp kỹ thuật. Đăng ký tham gia không tự động bảo đảm lịch gặp.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. SPONSOR SPECIFIC FIELDS (SECTION 16 & 17) */}
                {formData.role === TARGET_ROLES_ENUM.SPONSOR && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                      <Award className="w-5 h-5 text-purple-600" />
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">
                          Thông Tin Quan Tâm Đồng Hành & Tài Trợ (Sponsor Inquiry)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Hồ sơ sẽ được chuyển tới Ban Tổ chức để gửi Proposal quyền lợi chi tiết.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Hạng mức tài trợ quan tâm</label>
                        <select
                          value={formData.sponsorData.tierInterest}
                          onChange={(e) => handleFormChange({
                            sponsorData: { ...formData.sponsorData, tierInterest: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                        >
                          <option>Tài trợ Kim Cương (Đồng chủ trì & VIP)</option>
                          <option>Tài trợ Vàng (Gian làm việc lớn & Kỷ yếu)</option>
                          <option>Tài trợ Bạc (Kỷ yếu & Logo)</option>
                          <option>Đồng hành hạ tầng KCN & Dịch vụ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Ngân sách dự kiến</label>
                        <input
                          type="text"
                          value={formData.sponsorData.budgetRange}
                          onChange={(e) => handleFormChange({
                            sponsorData: { ...formData.sponsorData, budgetRange: e.target.value }
                          })}
                          placeholder="VD: 50.000.000 VNĐ"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">Quyền lợi mong muốn</label>
                        <input
                          type="text"
                          value={formData.sponsorData.expectedBenefits}
                          onChange={(e) => handleFormChange({
                            sponsorData: { ...formData.sponsorData, expectedBenefits: e.target.value }
                          })}
                          placeholder="VD: Phát biểu tại phiên khai mạc, đặt standee tại sảnh chính"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Quay Lại Bước 1
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setCurrentStep(3);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003ea8] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Tiếp Tục Bước 3: Xem Lại & Gửi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                STEP 3: REVIEW, POLICIES & CONSENTS (SECTION 18-21)
            ================================================== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                    Bước 3: Kiểm Tra Lại Hồ Sơ & Xác Nhận Đăng Ký
                  </h3>
                  <p className="text-xs text-slate-500">
                    Vui lòng rà soát lại thông tin trước khi gửi lên Ban điều phối sự kiện.
                  </p>
                </div>

                {/* Review Cards Grid */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Doanh nghiệp đăng ký:</span>
                      <div className="font-bold text-slate-900 text-sm">{formData.companyName}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Vai trò tham gia:</span>
                      <div className="font-bold text-[#0052cc] text-sm">
                        {formData.role === 'BUYER' ? 'Người Mua (Buyer / FDI)' : formData.role === 'SUPPLIER' ? 'Nhà Cung Ứng (Supplier)' : 'Tài Trợ / Đối Tác'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Người phụ trách liên hệ:</span>
                      <div className="font-bold text-slate-900">{formData.contactPerson} ({formData.phone})</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Email nhận kết quả:</span>
                      <div className="font-bold text-slate-900">{formData.email}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Gói tham gia đã chọn:</span>
                      <div className="font-bold text-slate-800">{selectedOption?.title}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Mức phí áp dụng:</span>
                      <div className="font-black text-sm text-emerald-700 font-mono">
                        {selectedOption?.feeType === 'FREE' ? 'MIỄN PHÍ' : `${selectedOption?.amount?.toLocaleString('vi-VN')} VND`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policies Accordion (Section 20) */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-2 text-slate-700">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Chính sách chương trình được cam kết (Program Policies):</span>
                  </div>
                  <ul className="pl-4 list-disc space-y-1 text-slate-600">
                    <li><strong>Thay đổi thông tin:</strong> Đại biểu có thể cập nhật thông tin trước ngày đóng cổng 05 ngày.</li>
                    <li><strong>Bảo lưu & Hoàn phí:</strong> Hoàn 100% nếu sự kiện bị hủy; bảo lưu suất sang kỳ tiếp theo nếu xin rút trước 10 ngày.</li>
                    <li><strong>Bảo mật:</strong> Bản vẽ và nhu cầu nội bộ của Buyer được bảo mật tuyệt đối, không chia sẻ bừa bãi.</li>
                  </ul>
                </div>

                {/* Three Consents Checkboxes (Section 21) */}
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="font-bold text-slate-900">
                    Điều khoản xác nhận & Cam kết tham gia:
                  </div>

                  <label className="flex items-start gap-2.5 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consents.dataProcessing}
                      onChange={(e) => handleFormChange({
                        consents: { ...formData.consents, dataProcessing: e.target.checked }
                      })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      <strong>(A) Bắt buộc:</strong> Tôi xác nhận thông tin cung cấp là chính xác và đồng ý để Ban Điều phối CHUOICUNGUNG.COM xử lý hồ sơ tham dự chương trình này.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consents.programSharing}
                      onChange={(e) => handleFormChange({
                        consents: { ...formData.consents, programSharing: e.target.checked }
                      })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      <strong>(B) Bắt buộc:</strong> Tôi đồng ý chia sẻ thông tin đại biểu trong phạm vi giao thương của chương trình với các đối tác đã qua kiểm duyệt phù hợp.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consents.marketing}
                      onChange={(e) => handleFormChange({
                        consents: { ...formData.consents, marketing: e.target.checked }
                      })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      <strong>(C) Tùy chọn:</strong> Nhận bản tin cập nhật danh mục nhu cầu mua sắm và cơ hội giao thương định kỳ tại cụm KCN qua Email / Zalo.
                    </span>
                  </label>
                </div>

                {/* Final Submit Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Quay Lại Bước 2
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Đang Gửi Hồ Sơ...</span>
                    ) : (
                      <>
                        <span>GỬI ĐĂNG KÝ THAM GIA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </form>
        )}

      </div>

      {/* ========================================================
          4. STICKY MOBILE BOTTOM NAV BAR (SECTION 52)
      ======================================================== */}
      {!submittedRegistration && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 sm:hidden shadow-lg">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="text-xs text-slate-600 font-bold">
              Bước {currentStep}/3
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Quay lại
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
                    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0052cc] text-white font-bold text-xs shadow-sm"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitRegistration}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. DUPLICATE REGISTRATION MODAL (SECTION 33)
      ======================================================== */}
      {duplicateWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-amber-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-heading">
                Doanh Nghiệp Đã Có Đăng Ký
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doanh nghiệp <strong>{duplicateWarning.companyName}</strong> đã nộp hồ sơ tham gia chương trình này với mã:
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 font-mono font-bold text-amber-900 text-sm">
                {duplicateWarning.registrationCode}
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Để tránh trùng lặp thông tin bàn làm việc, bạn có thể xem lại hoặc liên hệ điều phối viên để cập nhật thay vì đăng ký mới.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDuplicateWarning(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Tiếp tục chỉnh sửa
              </button>
              <Link
                to={`/chuong-trinh/${program.slug || program.id}`}
                className="px-4 py-2 rounded-xl bg-[#0052cc] text-white text-xs font-bold"
              >
                Về trang chương trình
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
