import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Send, CheckCircle2, Building2, User, Phone, Mail, 
  Calendar, Layers, FileText, ArrowRight, ShieldCheck, 
  Clock, ArrowLeft, Check, Sparkles, AlertCircle, MapPin,
  HelpCircle, ChevronRight, Video, Camera, BookOpen, Globe,
  UploadCloud, AlertTriangle, Package, CheckSquare, Tag,
  ShoppingBag, Award, Palette, Truck, Radio, DollarSign,
  HeartHandshake, Edit3, RotateCcw, ShieldAlert, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MASTER_SERVICES, 
  MATCHMAKING_MODELS,
  getActiveRelatedPrograms
} from '../data/servicesData';
import { 
  SERVICE_ENGINE_TYPES,
  FORM_ENGINE_STATUSES,
  submitUnifiedServiceRequest,
  saveServiceRequestDraft,
  getServiceRequestDraft,
  clearServiceRequestDraft
} from '../data/serviceFormEngineData';
import { createMerchandiseRequest } from '../data/merchandiseEventData';
import { captureReferral } from '../data/developmentPartnerData';
import { SERVICE_PRESENTATION, getServiceRequestErrors, getServiceRequestDetails } from './serviceRequestUi';
import './ServiceRequestPage.css';

const SERVICE_ICONS = {
  TO_CHUC_KET_NOI: HeartHandshake,
  VAT_PHAM_SU_KIEN: Package,
  TRUYEN_THONG_DOANH_NGHIEP: Camera,
  HIEN_DIEN_TU_XA: Globe,
  TAI_TRO: Award,
};
const REQUEST_STEPS = [
  { title: 'Thông tin chung', description: 'Dịch vụ & nhu cầu của bạn' },
  { title: 'Chi tiết dịch vụ', description: 'Làm rõ phạm vi triển khai' },
  { title: 'Kiểm tra & gửi', description: 'Xác nhận trước khi tiếp nhận' },
];

function RequestField({ field, label, value, onChange, errors, required, optional, full, type = 'text', placeholder, autoComplete, children }) {
  const id = `service-${field}`;
  const error = errors[field];
  const props = { id, name: field, value, onChange, placeholder, autoComplete,
    'aria-required': required || undefined, 'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined };
  return (
    <div className={`sr-field${full ? ' sr-full' : ''}`}>
      <label htmlFor={id}>{label}{required && <span className="sr-required">*</span>}{optional && <span className="sr-optional"> (Tùy chọn)</span>}</label>
      {type === 'textarea' ? <textarea {...props} rows={4} /> : <input {...props} type={type} />}
      {error && <p id={`${id}-error`} className="sr-field-error">{error}</p>}
      {children}
    </div>
  );
}

export default function ServiceRequestPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Đọc context từ URL params (Section 3 Spec 17.txt)
  const paramService = searchParams.get('service');
  const paramFormat = searchParams.get('format');
  const paramProgramId = searchParams.get('programId');
  const paramOrgId = searchParams.get('organizationId');
  const paramAssocId = searchParams.get('associationId');
  const paramIpId = searchParams.get('industrialParkId');
  const paramReferralCode = searchParams.get('ref') || searchParams.get('referralCode') || '';
  const paramSourcePage = searchParams.get('sourcePage') || document.referrer || '/yeu-cau-dich-vu';

  const relatedPrograms = getActiveRelatedPrograms();

  // Wizard Step State (1: Thông tin chung, 2: Đặc tả dịch vụ, 3: Review)
  const [currentStep, setCurrentStep] = useState(1);
  const [hasDraftNotice, setHasDraftNotice] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [consentError, setConsentError] = useState('');
  const formPanelRef = useRef(null);
  const previousStep = useRef(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Dịch vụ & Thông tin chung
    serviceType: 'TO_CHUC_KET_NOI',
    serviceIds: ['srv-to-chuc-ket-noi'],
    companyName: '',
    organizationId: paramOrgId || '',
    customerName: '',
    roleTitle: '',
    phone: '',
    email: '',
    description: '',
    location: '',
    desiredDate: '',
    budget: '',
    attachments: [],
    attachedFilesNote: '',
    referralCode: paramReferralCode,

    // Context nguồn (Section 3)
    sourceProgramId: paramProgramId || '',
    sourceAssociationId: paramAssocId || '',
    sourceIndustrialParkId: paramIpId || '',
    sourcePage: paramSourcePage,

    // Step 2A: TỔ CHỨC KẾT NỐI (MATCHMAKING)
    matchmaking: {
      formatType: paramFormat || 'plant-sourcing',
      objective: '',
      targetAudience: 'Nhà máy FDI & Nhà cung ứng Cấp 1, Cấp 2',
      categories: '',
      location: '',
      expectedDate: '',
      scale: '',
      existingResources: '',
      ccuSupportNeeded: ''
    },

    // Step 2B: VẬT PHẨM (MERCHANDISE)
    merchandise: {
      productTypes: ['Áo Polo sự kiện', 'Thẻ đeo tên gắn mã QR', 'Túi vải Canvas'],
      quantities: '500 bộ',
      sizeChart: 'S: 50, M: 180, L: 200, XL: 60, 2XL: 10',
      specifications: 'Áo thun cá sấu Poly 4 chiều 220gsm; Thẻ C300 màng mờ; Túi canvas 100% cotton mộc',
      printRequirements: 'Thêu vi tính ngực áo 8cm; In lụa 2 màu túi canvas; Thẻ in mã QR',
      colors: 'Theo màu nhận diện thương hiệu',
      packagingRequirements: 'Túi OPP từng cái, thùng carton 5 lớp 50 cái/thùng',
      sampleRequired: true,
      deliveryLocation: '',
      approvalContact: ''
    },

    // Step 2C: TRUYỀN THÔNG (MEDIA BRANDING)
    media: {
      mediaItems: ['ho-so', 'video', 'anh', 'catalogue'],
      targetProducts: '',
      existingDocs: '',
      shootingLocation: '',
      languages: ['Tiếng Việt', 'Tiếng Anh'],
      distributionChannels: ['Profile trên website', 'Tài liệu gửi Buyer', 'E-Catalogue'],
      contentApprover: '',
      deadline: ''
    },

    // Step 2D: HIỆN DIỆN TỪ XA (REMOTE PRESENCE)
    remotePresence: {
      targetProgramId: paramProgramId || '',
      presentationFormat: ['Trưng bày catalogue tại quầy', 'Phát video tại màn hình trung tâm'],
      existingMaterials: 'Catalogue PDF và Profile công ty',
      videoCatalogueLink: '',
      physicalSampleTypes: '',
      buyerContactPerson: '',
      representationScope: 'Tiếp nhận danh thiếp, tài liệu và giới thiệu sơ bộ năng lực'
    },

    // Step 2E: TÀI TRỢ CHƯƠNG TRÌNH (SPONSORSHIP CONSULTATION)
    sponsorship: {
      sponsoredProgramId: paramProgramId || '',
      territory: 'Miền Nam (Bình Dương, Đồng Nai, TP.HCM)',
      sponsorshipDuration: 'Sự kiện đơn lẻ',
      benefitsInterested: ['Gian hàng VIP', 'Logo trên ấn phẩm & Video', 'Kết nối riêng với Buyer'],
      contributionType: 'Tài trợ tài chính & Hiện vật',
      sponsorshipBudget: '50 - 100 triệu VNĐ'
    },

    // Step 3: Consent (Section 15 Spec 17: Bắt buộc tách riêng!)
    consentToContact: true, // Checkbox A: Bắt buộc
    marketingConsent: false // Checkbox B: Tùy chọn
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    if (previousStep.current !== currentStep) {
      previousStep.current = currentStep;
      formPanelRef.current?.focus({ preventScroll: true });
      formPanelRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }, [currentStep]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (Object.keys(fieldErrors).length) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        if (field === 'phone' || field === 'email') { delete next.phone; delete next.email; }
        return next;
      });
    }
  };

  // Pre-fill từ query param service
  useEffect(() => {
    if (paramService) {
      const sLower = paramService.toLowerCase().replace(/-/g, '_');
      let targetType = 'TO_CHUC_KET_NOI';
      let targetSrvId = 'srv-to-chuc-ket-noi';

      if (sLower.includes('vat_pham') || sLower.includes('merchandise')) {
        targetType = 'VAT_PHAM_SU_KIEN';
        targetSrvId = 'srv-vat-pham-su-kien';
      } else if (sLower.includes('truyen_thong') || sLower.includes('media')) {
        targetType = 'TRUYEN_THONG_DOANH_NGHIEP';
        targetSrvId = 'srv-truyen-thong-doanh-nghiep';
      } else if (sLower.includes('hien_dien') || sLower.includes('remote')) {
        targetType = 'HIEN_DIEN_TU_XA';
        targetSrvId = 'srv-hien-dien-tu-xa';
      } else if (sLower.includes('tai_tro') || sLower.includes('sponsor')) {
        targetType = 'TAI_TRO';
        targetSrvId = 'srv-tai-tro-dong-hanh';
      }

      setFormData(prev => ({
        ...prev,
        serviceType: targetType,
        serviceIds: [targetSrvId]
      }));
    }
  }, [paramService]);

  // Kiểm tra User session nếu đã login (Không bắt nhập lại company info)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ccu_user_session');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setFormData(prev => ({
          ...prev,
          customerName: u.name || prev.customerName,
          companyName: u.orgName || u.companyName || prev.companyName,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          roleTitle: u.role || prev.roleTitle,
          organizationId: u.organizationId || prev.organizationId
        }));
      }
    } catch (e) {}
  }, []);

  // Kiểm tra Draft đã lưu trước đó (Section 13)
  useEffect(() => {
    const draft = getServiceRequestDraft();
    if (draft && !submittedResult) {
      setHasDraftNotice(true);
    }
  }, []);

  // Tự động lưu Draft mỗi khi formData thay đổi
  useEffect(() => {
    if (!submittedResult && formData.companyName) {
      saveServiceRequestDraft(formData);
    }
  }, [formData, submittedResult]);

  // SEO Setup (Section 23 Spec 17.txt)
  useEffect(() => {
    document.title = 'Gửi Yêu Cầu Dịch Vụ | CHUOICUNGUNG.COM';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Mô tả công việc doanh nghiệp cần triển khai và gửi yêu cầu tư vấn về chương trình kết nối, vật phẩm, truyền thông, hiện diện hoặc tài trợ.';

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = 'https://chuoicungung.com/yeu-cau-dich-vu';
  }, []);

  // Khôi phục bản nháp
  const handleRestoreDraft = () => {
    const draft = getServiceRequestDraft();
    if (draft) {
      setFormData(draft);
      setHasDraftNotice(false);
    }
  };

  const handleDiscardDraft = () => {
    clearServiceRequestDraft();
    setHasDraftNotice(false);
  };

  // Chọn loại dịch vụ chính ở Bước 1
  const selectServiceType = (typeKey) => {
    const meta = SERVICE_ENGINE_TYPES[typeKey] || SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI;
    setFormData(prev => ({
      ...prev,
      serviceType: typeKey,
      serviceIds: [meta.serviceId]
    }));
  };

  // Validation trước khi chuyển bước
  const validateStep1 = () => {
    const errors = getServiceRequestErrors(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setCurrentStep(1);
      requestAnimationFrame(() => document.getElementById(`service-${Object.keys(errors)[0]}`)?.focus());
      return false;
    }
    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextToStep3 = () => {
    setCurrentStep(3);
  };

  // Xử lý nộp form chính thức (Section 7, 8, 9 Spec 17)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (currentStep === 1) { handleNextToStep2(); return; }
    if (currentStep === 2) { handleNextToStep3(); return; }
    if (!validateStep1()) return;
    if (!formData.consentToContact) {
      setConsentError('Vui lòng xác nhận cho phép CCU liên hệ về yêu cầu này.');
      document.getElementById('service-consent-contact')?.focus();
      return;
    }
    setConsentError('');

    setIsSubmitting(true);

    setTimeout(() => {
      // Đóng gói dynamicData tùy theo serviceType
      let dynamicDataPayload = {};
      if (formData.serviceType === 'TO_CHUC_KET_NOI') {
        dynamicDataPayload = formData.matchmaking;
      } else if (formData.serviceType === 'VAT_PHAM_SU_KIEN') {
        dynamicDataPayload = formData.merchandise;
      } else if (formData.serviceType === 'TRUYEN_THONG_DOANH_NGHIEP') {
        dynamicDataPayload = formData.media;
      } else if (formData.serviceType === 'HIEN_DIEN_TU_XA') {
        dynamicDataPayload = formData.remotePresence;
      } else if (formData.serviceType === 'TAI_TRO') {
        dynamicDataPayload = formData.sponsorship;
      }

      const res = submitUnifiedServiceRequest({
        serviceType: formData.serviceType,
        serviceIds: formData.serviceIds,
        companyName: formData.companyName,
        organizationId: formData.organizationId,
        contactName: formData.customerName,
        roleTitle: formData.roleTitle,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        description: formData.description,
        location: formData.location,
        desiredDate: formData.desiredDate,
        budget: formData.budget,
        dynamicData: dynamicDataPayload,
        attachments: formData.attachedFilesNote ? [{ name: 'File / Drive đính kèm', size: 'Cloud Link', type: 'link', link: formData.attachedFilesNote }] : [],
        sourcePage: formData.sourcePage,
        sourceProgramId: formData.sourceProgramId,
        consentToContact: formData.consentToContact,
        marketingConsent: formData.marketingConsent
      });

      // Nếu có mã đối tác phát triển (Referral Code - Section 49 Spec 33)
      if (formData.referralCode) {
        try {
          captureReferral(formData.referralCode, {
            companyName: formData.companyName,
            contactPerson: formData.customerName,
            email: formData.email,
            phone: formData.phone,
            serviceType: formData.serviceType,
            serviceRequestId: res?.id || `SRV-${Date.now()}`
          }, 'SERVICE_REQUEST_FORM');
        } catch (refErr) {
          console.error('Error capturing partner referral:', refErr);
        }
      }

      // Nếu là vật phẩm thì đồng thời đồng bộ vào kho merchandise requests
      if (formData.serviceType === 'VAT_PHAM_SU_KIEN') {
        try {
          createMerchandiseRequest({
            organizationId: formData.organizationId || null,
            companyName: formData.companyName,
            customerName: formData.customerName,
            roleTitle: formData.roleTitle,
            email: formData.email,
            phone: formData.phone,
            objective: formData.description,
            productTypes: formData.merchandise.productTypes,
            quantities: formData.merchandise.quantities,
            sizeChart: formData.merchandise.sizeChart,
            specifications: formData.merchandise.specifications,
            printRequirements: formData.merchandise.printRequirements,
            colors: formData.merchandise.colors,
            packagingRequirements: formData.merchandise.packagingRequirements,
            sampleRequired: formData.merchandise.sampleRequired,
            requestedDate: formData.desiredDate,
            deliveryLocation: formData.merchandise.deliveryLocation || formData.location,
            approvalContact: formData.merchandise.approvalContact || formData.customerName,
            budget: formData.budget,
            coordinationMode: 'PLATFORM_COORDINATION'
          });
        } catch (e) {}
      }

      setIsSubmitting(false);
      if (res.success) {
        setSubmittedResult(res.request);
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    }, 600);
  };

  const currentServiceMeta = SERVICE_ENGINE_TYPES[formData.serviceType] || SERVICE_ENGINE_TYPES.TO_CHUC_KET_NOI;
  const presentation = SERVICE_PRESENTATION[formData.serviceType] || SERVICE_PRESENTATION.TO_CHUC_KET_NOI;
  const reviewDetails = getServiceRequestDetails(formData, { formats: MATCHMAKING_MODELS, programs: relatedPrograms });

  return (
    <div className="service-request font-sans">
      
      {/* ==================================================================== */}
      {/* HERO SECTION (SECTION 2 SPEC 17.TXT - REDESIGNED FOR HIGH TASTE) */}
      {/* ==================================================================== */}
      <section className="sr-intro relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/70 border-b border-slate-200/80 pt-8 pb-10 sm:pt-10 sm:pb-12" aria-labelledby="service-request-title">
        {/* Subtle architectural ambient texture & glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00d_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="sr-wrap relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="sr-breadcrumb mb-6" aria-label="Đường dẫn trang">
            <Link
              to="/dich-vu"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trung tâm dịch vụ</span>
            </Link>
            <ChevronRight size={13} className="text-slate-400" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500" aria-current="page">Gửi yêu cầu dịch vụ</span>
          </nav>

          {/* Hero Main Header */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>DỊCH VỤ DOANH NGHIỆP CCU</span>
            </div>

            {/* Exact H1 & Subtitle per Section 2 Spec 17.txt */}
            <h1 id="service-request-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-heading tracking-tight leading-[1.14]">
              Gửi yêu cầu dịch vụ.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
              Chọn dịch vụ, mô tả công việc cần làm. CCU tiếp nhận và cùng doanh nghiệp trao đổi phạm vi, cách triển khai phù hợp.
            </p>
          </div>

          {/* Draft Notification Banner (Section 13) */}
          {hasDraftNotice && (
            <div className="sr-draft mt-6" role="status">
              <div className="sr-draft-copy">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Bạn có một yêu cầu đang viết dở.</span>
              </div>
              <div className="sr-draft-actions">
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                >
                  Khôi phục bản nháp
                </button>
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                >
                  Bỏ qua bản nháp
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3-STEP WIZARD PROGRESS INDICATOR (SECTION 22 SPEC 17.TXT) */}
      {/* ==================================================================== */}
      <div className="sr-wrap sr-layout">
        <aside className="sr-sidebar" aria-label="Tiến trình yêu cầu">
          {!submittedResult && <>
            <p className="sr-sidebar-title">HOÀN THÀNH YÊU CẦU</p>
            <nav className="sr-progress" aria-label="Các bước điền yêu cầu">
              {REQUEST_STEPS.map((step, index) => (
                <button key={step.title} type="button"
                  className={`sr-step${currentStep > index + 1 ? ' is-complete' : ''}`}
                  aria-current={currentStep === index + 1 ? 'step' : undefined}
                  onClick={() => { if (index === 0 || validateStep1()) setCurrentStep(index + 1); }}>
                  <span className="sr-step-number" aria-hidden="true">{currentStep > index + 1 ? <Check size={15} /> : index + 1}</span>
                  <span><span className="sr-step-title">{step.title}</span><span className="sr-step-description">{step.description}</span></span>
                </button>
              ))}
            </nav>
          </>}
          <div className="sr-preparation">
            <FileText size={23} strokeWidth={1.5} aria-hidden="true" />
            <h2>Một đề bài rõ, dễ bắt đầu.</h2>
            <p>Dành cho doanh nghiệp, nhà máy, KCN, hội/hiệp hội và đơn vị muốn triển khai dịch vụ.</p>
            <ul>
              <li><Check size={15} /><span>Mô tả công việc cần hỗ trợ</span></li>
              <li><Check size={15} /><span>Đầu mối liên hệ của tổ chức</span></li>
              <li><Check size={15} /><span>Địa điểm và thời gian dự kiến</span></li>
            </ul>
            <div className="sr-guidance">
              <strong>{presentation.title}</strong>
              <p>{presentation.guidance}</p>
            </div>
            <p className="sr-helper" style={{ marginTop: 18 }}>Gửi yêu cầu chưa phải xác nhận đặt dịch vụ. Phạm vi và chi phí cần được hai bên thống nhất.</p>
          </div>
        </aside>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER */}
      {/* ==================================================================== */}
      <section className="sr-panel" ref={formPanelRef} tabIndex={-1} aria-labelledby={submittedResult ? 'service-success-title' : 'service-step-title'} style={{ scrollMarginTop: 140 }}>
          {!submittedResult && <div className="sr-panel-heading">
            <div><h2 id="service-step-title">{REQUEST_STEPS[currentStep - 1].title}</h2>
              <p>{currentStep === 1 ? 'Chọn dịch vụ phù hợp và cho CCU biết nhu cầu của bạn.' : currentStep === 2 ? 'Bổ sung chi tiết để làm rõ công việc cần triển khai.' : 'Kiểm tra thông tin. Chỉ gửi khi bạn đã sẵn sàng.'}</p>
            </div>
            <span className="sr-counter">{String(currentStep).padStart(2, '0')} / 03</span>
          </div>}

          {/* SUCCESS CONFIRMATION SCREEN (SECTION 8 SPEC 17.TXT) */}
          {submittedResult ? (
            <div className="sr-success text-center space-y-6" role="status">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 bg-white text-blue-800 rounded-full text-xs font-mono font-bold shadow-2xs border border-blue-200 tracking-wider">
                  MÃ ĐỊNH DANH: {submittedResult.publicCode}
                </span>
                
                {/* Exact Text per Section 8 Spec 17.txt */}
                <h2 id="service-success-title" className="text-slate-900 font-heading">
                  Yêu cầu {submittedResult.publicCode} đã được ghi nhận.
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Bạn có thể theo dõi trạng thái hoặc bổ sung thông tin qua đầu mối được xác nhận.
                </p>
              </div>

              {/* Duplicate Warning notice if detected (Section 12) */}
              {submittedResult.duplicateStatus === 'POSSIBLE_DUPLICATE' && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl max-w-lg mx-auto text-left text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Lưu ý đối soát:</strong> Hệ thống nhận thấy bạn có một yêu cầu gần đây. Chuyên viên sẽ tổng hợp thành một hồ sơ duy nhất để tránh trùng lặp công việc.
                  </div>
                </div>
              )}

              {/* Routing & Assignment Info Card */}
              <div className="p-5 bg-white rounded-2xl border border-blue-100 max-w-lg mx-auto text-left space-y-3 text-xs shadow-2xs">
                <div className="font-bold text-slate-900 font-heading flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Kế hoạch phản hồi & Đầu mối tiếp nhận:</span>
                </div>
                <div className="text-slate-600 space-y-2">
                  <div>• Dịch vụ yêu cầu: <strong className="text-slate-800">{submittedResult.serviceNames?.[0] || 'Dịch vụ B2B'}</strong></div>
                  <div>• Đầu mối phụ trách: <strong className="text-blue-800">{submittedResult.owner}</strong></div>
                  <div>• Trạng thái hiện tại: <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">MỚI TIẾP NHẬN (NEW)</span></div>
                  <div>• Hành động tiếp theo: <strong>{submittedResult.nextAction}</strong></div>
                  <div>• Cam kết phản hồi: <strong>Trong vòng 24 giờ làm việc</strong></div>
                </div>
              </div>

              {/* Transparent Disclaimer (Section 8: Không hứa giá, lịch giao, cuộc gặp...) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 max-w-lg mx-auto text-left text-[11px] text-amber-900 space-y-1">
                <div className="font-bold font-heading flex items-center gap-1 text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cam kết minh bạch & Trách nhiệm</span>
                </div>
                <p className="leading-relaxed">
                  CHUOICUNGUNG.COM không cam kết chi phí cố định, lịch trình hay số lượng cuộc gặp trước khi hai bên cùng khảo sát và thống nhất phạm vi kỹ thuật thực tế.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <Link
                  to={`/tai-khoan/yeu-cau-dich-vu?code=${submittedResult.publicCode}`}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xem trong Không gian tài khoản</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedResult(null);
                    setCurrentStep(1);
                  }}
                  className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            </div>
          ) : (
            <form id="service-request-form" onSubmit={handleSubmit} noValidate className="sr-form">

              {/* ============================================================ */}
              {/* STEP 1: DỊCH VỤ + THÔNG TIN CHUNG (SECTION 4 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 1 && (
                <div>
                  {Object.keys(fieldErrors).length > 0 && <div className="sr-error-summary" role="alert">
                    <AlertCircle size={18} /><p>Một vài thông tin còn thiếu hoặc chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu bên dưới.</p>
                  </div>}
                  
                  {/* 1. Chọn dịch vụ chính */}
                  <fieldset className="sr-section">
                    <legend className="sr-section-header">
                      <h3>Bạn cần hỗ trợ việc gì?</h3>
                      <p>Chọn một dịch vụ chính. Chi tiết sẽ được làm rõ ở bước tiếp theo.</p>
                    </legend>

                    <div className="sr-service-grid">
                      {Object.keys(SERVICE_ENGINE_TYPES).map(key => {
                        const item = SERVICE_PRESENTATION[key];
                        const Icon = SERVICE_ICONS[key];
                        const isSelected = formData.serviceType === key;
                        return (
                          <label
                            key={key}
                            className={`sr-service-option${isSelected ? ' is-selected' : ''}`}
                          >
                            <input type="radio" name="serviceType" value={key} checked={isSelected} onChange={() => selectServiceType(key)} />
                            <Icon className="sr-service-icon" strokeWidth={1.5} aria-hidden="true" />
                            <span className="sr-service-copy"><strong>{item.title}</strong><span>{item.description}</span></span>
                            <span className="sr-radio-mark" aria-hidden="true">{isSelected && <Check size={11} strokeWidth={3} />}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* 2. Thông tin doanh nghiệp & liên hệ */}
                  <section className="sr-section" aria-labelledby="service-contact-heading">
                    <div className="sr-section-header">
                      <h3 id="service-contact-heading">Doanh nghiệp & người liên hệ</h3>
                      <p>Thông tin để trao đổi và làm rõ yêu cầu của tổ chức.</p>
                    </div>

                    <div className="sr-field-grid">
                      <RequestField full required field="companyName" label="Tên doanh nghiệp / tổ chức" value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} errors={fieldErrors} autoComplete="organization" placeholder="Tên công ty, nhà máy, KCN hoặc hội/hiệp hội" />
                      <RequestField required field="customerName" label="Họ và tên người liên hệ" value={formData.customerName} onChange={e => updateField('customerName', e.target.value)} errors={fieldErrors} autoComplete="name" placeholder="Họ và tên" />
                      <RequestField optional field="roleTitle" label="Chức vụ" value={formData.roleTitle} onChange={e => updateField('roleTitle', e.target.value)} errors={fieldErrors} autoComplete="organization-title" placeholder="Ví dụ: Phụ trách mua hàng" />
                      <RequestField field="phone" type="tel" label="Số điện thoại" value={formData.phone} onChange={e => updateField('phone', e.target.value)} errors={fieldErrors} autoComplete="tel" placeholder="Số điện thoại liên hệ" />
                      <RequestField field="email" type="email" label="Email công việc" value={formData.email} onChange={e => updateField('email', e.target.value)} errors={fieldErrors} autoComplete="email" placeholder="contact@company.com.vn" />
                    </div>
                    <p className="sr-helper">Vui lòng cung cấp ít nhất số điện thoại hoặc email.</p>
                  </section>

                  {/* 3. Mô tả yêu cầu chung & Kế hoạch */}
                  <section className="sr-section" aria-labelledby="service-needs-heading">
                    <div className="sr-section-header"><h3 id="service-needs-heading">Công việc cần triển khai</h3><p>Chia sẻ nhu cầu thực tế. Bạn có thể bổ sung chi tiết ở bước sau.</p></div>

                    <div className="sr-field-grid">
                      <RequestField full required field="description" type="textarea" label="Mô tả nhu cầu" value={formData.description} onChange={e => updateField('description', e.target.value)} errors={fieldErrors} placeholder="Bạn đang chuẩn bị công việc gì? Cần CCU hỗ trợ phần nào?" />
                      <RequestField optional field="location" label="Địa điểm / khu công nghiệp" value={formData.location} onChange={e => updateField('location', e.target.value)} errors={fieldErrors} placeholder="Khu vực cần triển khai" />
                      <RequestField optional field="desiredDate" label="Thời gian dự kiến" value={formData.desiredDate} onChange={e => updateField('desiredDate', e.target.value)} errors={fieldErrors} placeholder="Ví dụ: Trong tháng 11/2026" />
                      <RequestField full optional field="budget" label="Ngân sách dự kiến" value={formData.budget} onChange={e => updateField('budget', e.target.value)} errors={fieldErrors} placeholder="Khoảng ngân sách, hoặc cần CCU đề xuất" />
                      <RequestField full optional field="attachedFilesNote" label="Đường dẫn tài liệu tham khảo" value={formData.attachedFilesNote} onChange={e => updateField('attachedFilesNote', e.target.value)} errors={fieldErrors} placeholder="Dán link tài liệu, bản vẽ, logo hoặc thư mục Google Drive">
                        <p className="sr-helper">Đây là đường dẫn tham khảo, không phải tải tệp lên. Hãy kiểm tra quyền truy cập trước khi gửi.</p>
                      </RequestField>
                    </div>
                  </section>

                  {/* Button chuyển bước 2 */}
                  <div className="sr-form-actions">
                    <p><ShieldCheck size={16} /> Bạn sẽ kiểm tra lại thông tin trước khi gửi.</p>
                    <button
                      type="button"
                      onClick={handleNextToStep2}
                      className="sr-button-primary sr-inline-forward"
                    >
                      <span>Tiếp tục: Chi tiết dịch vụ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: DYNAMIC FORM BY SERVICETYPE (SECTION 5 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 2 && (
                <div className="sr-detail-form space-y-6">
                  <div className="sr-branch-heading">
                    {React.createElement(SERVICE_ICONS[formData.serviceType] || HeartHandshake, { size: 24, strokeWidth: 1.5, 'aria-hidden': true, className: 'shrink-0' })}
                    <div>
                      <h3>{presentation.title}</h3>
                      <p>{presentation.guidance}</p>
                    </div>
                  </div>

                  {/* BRANCH A: TỔ CHỨC KẾT NỐI */}
                  {formData.serviceType === 'TO_CHUC_KET_NOI' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label htmlFor="service-matchmaking-formatType" className="font-bold text-slate-700">Hình thức triển khai mong muốn</label>
                          <select
                            id="service-matchmaking-formatType"
                            name="matchmaking.formatType"
                            value={formData.matchmaking.formatType}
                            onChange={e => setFormData({
                              ...formData,
                              matchmaking: { ...formData.matchmaking, formatType: e.target.value }
                            })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc]"
                          >
                            {MATCHMAKING_MODELS.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-matchmaking-scale" className="font-bold text-slate-700">Quy mô sự kiện dự kiến (Số người / Doanh nghiệp)</label>
                          <input
                            id="service-matchmaking-scale"
                            name="matchmaking.scale"
                            type="text"
                            value={formData.matchmaking.scale}
                            onChange={e => setFormData({
                              ...formData,
                              matchmaking: { ...formData.matchmaking, scale: e.target.value }
                            })}
                            placeholder="VD: 50 - 150 doanh nghiệp tham dự"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-matchmaking-targetAudience" className="font-bold text-slate-700">Đối tượng tham gia mục tiêu</label>
                          <input
                            id="service-matchmaking-targetAudience"
                            name="matchmaking.targetAudience"
                            type="text"
                            value={formData.matchmaking.targetAudience}
                            onChange={e => setFormData({
                              ...formData,
                              matchmaking: { ...formData.matchmaking, targetAudience: e.target.value }
                            })}
                            placeholder="VD: Nhà máy FDI Nhật Bản, Hàn Quốc tại KCN Amata và nhà cung ứng cấp 1-2"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-matchmaking-existingResources" className="font-bold text-slate-700">Nguồn lực hiện đã có sẵn</label>
                          <input
                            id="service-matchmaking-existingResources"
                            name="matchmaking.existingResources"
                            type="text"
                            value={formData.matchmaking.existingResources}
                            onChange={e => setFormData({
                              ...formData,
                              matchmaking: { ...formData.matchmaking, existingResources: e.target.value }
                            })}
                            placeholder="VD: Đã có hội trường 200 chỗ, danh sách 30 nhà máy thành viên..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-matchmaking-ccuSupportNeeded" className="font-bold text-slate-700">Phần việc cần CCU hỗ trợ chính</label>
                          <input
                            id="service-matchmaking-ccuSupportNeeded"
                            name="matchmaking.ccuSupportNeeded"
                            type="text"
                            value={formData.matchmaking.ccuSupportNeeded}
                            onChange={e => setFormData({
                              ...formData,
                              matchmaking: { ...formData.matchmaking, ccuSupportNeeded: e.target.value }
                            })}
                            placeholder="VD: Thu thập đề bài mua sắm, matching 1-1, vận hành trang sự kiện..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BRANCH B: VẬT PHẨM & SỰ KIỆN */}
                  {formData.serviceType === 'VAT_PHAM_SU_KIEN' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-bold text-slate-700">Danh mục vật phẩm đặt hàng</label>
                          <div className="flex flex-wrap gap-2">
                            {['Áo Polo sự kiện', 'Thẻ đeo tên gắn mã QR', 'Túi vải Canvas', 'Sổ tay & Bút ký', 'Bảng mica để bàn & Standee', 'Kỷ niệm chương & Cúp pha lê'].map(item => {
                              const active = formData.merchandise.productTypes.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => {
                                    const next = active
                                      ? formData.merchandise.productTypes.filter(p => p !== item)
                                      : [...formData.merchandise.productTypes, item];
                                    setFormData({
                                      ...formData,
                                      merchandise: { ...formData.merchandise, productTypes: next }
                                    });
                                  }}
                                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition ${
                                    active ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-merchandise-quantities" className="font-bold text-slate-700">Số lượng đặt hàng dự kiến</label>
                          <input
                            id="service-merchandise-quantities"
                            name="merchandise.quantities"
                            type="text"
                            value={formData.merchandise.quantities}
                            onChange={e => setFormData({
                              ...formData,
                              merchandise: { ...formData.merchandise, quantities: e.target.value }
                            })}
                            placeholder="VD: 500 áo + 500 thẻ QR"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-merchandise-sizeChart" className="font-bold text-slate-700">Phân bổ kích cỡ (Bảng size)</label>
                          <input
                            id="service-merchandise-sizeChart"
                            name="merchandise.sizeChart"
                            type="text"
                            value={formData.merchandise.sizeChart}
                            onChange={e => setFormData({
                              ...formData,
                              merchandise: { ...formData.merchandise, sizeChart: e.target.value }
                            })}
                            placeholder="VD: S: 50, M: 180, L: 200, XL: 60, 2XL: 10"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-merchandise-specifications" className="font-bold text-slate-700">Yêu cầu chất liệu & quy cách kỹ thuật</label>
                          <input
                            id="service-merchandise-specifications"
                            name="merchandise.specifications"
                            type="text"
                            value={formData.merchandise.specifications}
                            onChange={e => setFormData({
                              ...formData,
                              merchandise: { ...formData.merchandise, specifications: e.target.value }
                            })}
                            placeholder="VD: Vải cá sấu Poly 4 chiều 220gsm; Thẻ C300 cán màng mờ..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-merchandise-printRequirements" className="font-bold text-slate-700">Công nghệ in / thêu logo</label>
                          <input
                            id="service-merchandise-printRequirements"
                            name="merchandise.printRequirements"
                            type="text"
                            value={formData.merchandise.printRequirements}
                            onChange={e => setFormData({
                              ...formData,
                              merchandise: { ...formData.merchandise, printRequirements: e.target.value }
                            })}
                            placeholder="VD: Thêu vi tính ngực 8cm; In lụa 2 màu túi canvas..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-merchandise-deliveryLocation" className="font-bold text-slate-700">Địa điểm giao hàng tận nơi</label>
                          <input
                            id="service-merchandise-deliveryLocation"
                            name="merchandise.deliveryLocation"
                            type="text"
                            value={formData.merchandise.deliveryLocation}
                            onChange={e => setFormData({
                              ...formData,
                              merchandise: { ...formData.merchandise, deliveryLocation: e.target.value }
                            })}
                            placeholder="VD: Kho nhà máy KCN VSIP 1, Bình Dương"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BRANCH C: TRUYỀN THÔNG DOANH NGHIỆP */}
                  {formData.serviceType === 'TRUYEN_THONG_DOANH_NGHIEP' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-media-targetProducts" className="font-bold text-slate-700">Sản phẩm / Năng lực chính cần làm nổi bật</label>
                          <input
                            id="service-media-targetProducts"
                            name="media.targetProducts"
                            type="text"
                            value={formData.media.targetProducts}
                            onChange={e => setFormData({
                              ...formData,
                              media: { ...formData.media, targetProducts: e.target.value }
                            })}
                            placeholder="VD: Gia công ép nhựa kỹ thuật, xưởng may bảo hộ lao động 80 chuyền..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-media-shootingLocation" className="font-bold text-slate-700">Địa chỉ nhà máy quay chụp thực tế</label>
                          <input
                            id="service-media-shootingLocation"
                            name="media.shootingLocation"
                            type="text"
                            value={formData.media.shootingLocation}
                            onChange={e => setFormData({
                              ...formData,
                              media: { ...formData.media, shootingLocation: e.target.value }
                            })}
                            placeholder="VD: Lô D, Đường số 6, KCN Sóng Thần 2, Bình Dương"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-media-existingDocs" className="font-bold text-slate-700">Tài liệu, chứng chỉ hiện có sẵn</label>
                          <input
                            id="service-media-existingDocs"
                            name="media.existingDocs"
                            type="text"
                            value={formData.media.existingDocs}
                            onChange={e => setFormData({
                              ...formData,
                              media: { ...formData.media, existingDocs: e.target.value }
                            })}
                            placeholder="VD: Chứng chỉ ISO 9001:2015, ảnh chụp flycam cũ..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-media-contentApprover" className="font-bold text-slate-700">Người có thẩm quyền duyệt nội dung</label>
                          <input
                            id="service-media-contentApprover"
                            name="media.contentApprover"
                            type="text"
                            value={formData.media.contentApprover}
                            onChange={e => setFormData({
                              ...formData,
                              media: { ...formData.media, contentApprover: e.target.value }
                            })}
                            placeholder="VD: Giám đốc Marketing hoặc Tổng Giám đốc"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-media-deadline" className="font-bold text-slate-700">Thời hạn cần hoàn tất bàn giao</label>
                          <input
                            id="service-media-deadline"
                            name="media.deadline"
                            type="text"
                            value={formData.media.deadline}
                            onChange={e => setFormData({
                              ...formData,
                              media: { ...formData.media, deadline: e.target.value }
                            })}
                            placeholder="VD: Trước 15/10/2026 hoặc Trong 15 ngày làm việc"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BRANCH D: HIỆN DIỆN TỪ XA */}
                  {formData.serviceType === 'HIEN_DIEN_TU_XA' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-remotePresence-targetProgramId" className="font-bold text-slate-700">Chương trình kết nối quan tâm</label>
                          <select
                            id="service-remotePresence-targetProgramId"
                            name="remotePresence.targetProgramId"
                            value={formData.remotePresence.targetProgramId}
                            onChange={e => setFormData({
                              ...formData,
                              remotePresence: { ...formData.remotePresence, targetProgramId: e.target.value }
                            })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          >
                            <option value="">-- Chọn chương trình đang mở --</option>
                            {relatedPrograms.map(p => (
                              <option key={p.id} value={p.id}>{p.title || p.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-remotePresence-physicalSampleTypes" className="font-bold text-slate-700">Mẫu sản phẩm thực tế dự kiến gửi đối chứng</label>
                          <input
                            id="service-remotePresence-physicalSampleTypes"
                            name="remotePresence.physicalSampleTypes"
                            type="text"
                            value={formData.remotePresence.physicalSampleTypes}
                            onChange={e => setFormData({
                              ...formData,
                              remotePresence: { ...formData.remotePresence, physicalSampleTypes: e.target.value }
                            })}
                            placeholder="VD: 03 linh kiện cơ khí tiện phay CNC, bảng mẫu dây cáp điện..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-remotePresence-buyerContactPerson" className="font-bold text-slate-700">Người phụ trách phản hồi Buyer sau sự kiện</label>
                          <input
                            id="service-remotePresence-buyerContactPerson"
                            name="remotePresence.buyerContactPerson"
                            type="text"
                            value={formData.remotePresence.buyerContactPerson}
                            onChange={e => setFormData({
                              ...formData,
                              remotePresence: { ...formData.remotePresence, buyerContactPerson: e.target.value }
                            })}
                            placeholder="VD: Trưởng phòng Kinh doanh B2B (Kèm SĐT)"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-remotePresence-videoCatalogueLink" className="font-bold text-slate-700">Link video / Catalogue trực tuyến</label>
                          <input
                            id="service-remotePresence-videoCatalogueLink"
                            name="remotePresence.videoCatalogueLink"
                            type="text"
                            value={formData.remotePresence.videoCatalogueLink}
                            onChange={e => setFormData({
                              ...formData,
                              remotePresence: { ...formData.remotePresence, videoCatalogueLink: e.target.value }
                            })}
                            placeholder="VD: https://youtube.com/... hoặc link Google Drive"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BRANCH E: TÀI TRỢ CHƯƠNG TRÌNH */}
                  {formData.serviceType === 'TAI_TRO' && (
                    <div className="space-y-4">
                      {/* Notice Rule Section 5E: Chỉ tạo yêu cầu tư vấn, không tự tạo Active Partnership */}
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800 font-heading">
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Yêu cầu tư vấn tài trợ</span>
                        </div>
                        <p className="leading-relaxed">
                          Hệ thống tiếp nhận yêu cầu dưới dạng <strong>Đề tài tư vấn & thẩm định quyền lợi</strong>. Quyền lợi tài trợ chính thức chỉ được kích hoạt sau khi Hội đồng điều phối và Doanh nghiệp ký kết văn bản thỏa thuận.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label htmlFor="service-sponsorship-sponsoredProgramId" className="font-bold text-slate-700">Chương trình hoặc Chuyên mục tài trợ quan tâm</label>
                          <input
                            id="service-sponsorship-sponsoredProgramId"
                            name="sponsorship.sponsoredProgramId"
                            type="text"
                            value={formData.sponsorship.sponsoredProgramId}
                            onChange={e => setFormData({
                              ...formData,
                              sponsorship: { ...formData.sponsorship, sponsoredProgramId: e.target.value }
                            })}
                            placeholder="VD: Ngày hội Chuỗi Cung Ứng KCN VSIP hoặc Chuỗi hội thảo cơ khí"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="service-sponsorship-contributionType" className="font-bold text-slate-700">Hình thức đóng góp dự kiến</label>
                          <select
                            id="service-sponsorship-contributionType"
                            name="sponsorship.contributionType"
                            value={formData.sponsorship.contributionType}
                            onChange={e => setFormData({
                              ...formData,
                              sponsorship: { ...formData.sponsorship, contributionType: e.target.value }
                            })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          >
                            <option value="Tài trợ tài chính & Hiện vật">Tài trợ tài chính & Hiện vật</option>
                            <option value="Tài trợ tài chính trực tiếp">Tài trợ tài chính trực tiếp</option>
                            <option value="Tài trợ hiện vật / Quà tặng đại biểu">Tài trợ hiện vật / Quà tặng đại biểu</option>
                            <option value="Tài trợ địa điểm / Phòng hội thảo">Tài trợ địa điểm / Phòng hội thảo</option>
                            <option value="Đồng hành học bổng / Phúc lợi công nhân">Đồng hành học bổng / Phúc lợi công nhân</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label htmlFor="service-sponsorship-sponsorshipBudget" className="font-bold text-slate-700">Ngân sách tài trợ dự kiến (Tùy chọn)</label>
                          <input
                            id="service-sponsorship-sponsorshipBudget"
                            name="sponsorship.sponsorshipBudget"
                            type="text"
                            value={formData.sponsorship.sponsorshipBudget}
                            onChange={e => setFormData({
                              ...formData,
                              sponsorship: { ...formData.sponsorship, sponsorshipBudget: e.target.value }
                            })}
                            placeholder="VD: 50.000.000 VNĐ - 100.000.000 VNĐ"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons for Step 2 */}
                  <div className="sr-form-actions">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="sr-button-secondary"
                    >
                      <ArrowLeft size={15} /> Thông tin chung
                    </button>

                    <button
                      type="button"
                      onClick={handleNextToStep3}
                      className="sr-button-primary sr-inline-forward"
                    >
                      <span>Tiếp tục: Kiểm tra yêu cầu</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: REVIEW & CONSENTS (SECTION 6 & 15 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 3 && (
                <div className="space-y-6">

                  {/* Summary Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Dịch vụ đã chọn:</span>
                        <div className="font-bold text-sm text-blue-900 font-heading">{currentServiceMeta.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="py-1 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Sửa Bước 1
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                      <div>• Doanh nghiệp: <strong className="text-slate-900">{formData.companyName}</strong></div>
                      <div>• Người liên hệ: <strong className="text-slate-900">{formData.customerName}</strong> ({formData.roleTitle || 'Đại diện'})</div>
                      <div>• Số điện thoại: <strong className="text-slate-900 font-mono">{formData.phone}</strong></div>
                      <div>• Email công việc: <strong className="text-slate-900">{formData.email}</strong></div>
                      <div>• Địa bàn: <strong>{formData.location || 'Chưa chỉ định'}</strong></div>
                      <div>• Thời gian: <strong>{formData.desiredDate || 'Theo sắp xếp'}</strong></div>
                      {formData.budget && <div>• Ngân sách dự kiến: <strong>{formData.budget}</strong></div>}
                    </div>

                    <div className="pt-3 border-t border-slate-200 space-y-1">
                      <div className="font-bold text-slate-800">Mô tả tóm tắt yêu cầu:</div>
                      <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        {formData.description}
                      </p>
                    </div>

                    {/* Dynamic Step 2 Summary */}
                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="font-semibold text-sm mb-4">Chi tiết dịch vụ</h3>
                      <dl className="sr-review-details">
                        {reviewDetails.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value}</dd></React.Fragment>)}
                      </dl>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="py-1 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Sửa chi tiết dịch vụ
                      </button>
                    </div>
                  </div>

                  {/* SECTION 15 SPEC 17.TXT: TÁCH RIÊNG 2 CONSENT CHECKBOXES */}
                  <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
                    <div className="font-bold text-xs text-slate-900 uppercase font-heading">
                      Quyền liên hệ & thông tin nhận thêm
                    </div>

                    {/* Checkbox A: Bắt buộc */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        id="service-consent-contact"
                        required
                        checked={formData.consentToContact}
                        aria-invalid={Boolean(consentError)}
                        aria-describedby={consentError ? 'service-consent-error' : undefined}
                        onChange={e => { setFormData({ ...formData, consentToContact: e.target.checked }); setConsentError(''); }}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                      />
                      <span>
                        <strong className="text-slate-900">Tôi đồng ý cho phép Ban Điều Phối CHUOICUNGUNG.COM liên hệ</strong> với tôi qua số điện thoại hoặc email đã cung cấp để khảo sát phạm vi và trao đổi về yêu cầu dịch vụ này. <span className="text-red-500">* (Bắt buộc)</span>
                      </span>
                    </label>

                    {/* Checkbox B: Tùy chọn Marketing */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={formData.marketingConsent}
                        onChange={e => setFormData({ ...formData, marketingConsent: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                      />
                      <span>
                        Tôi đồng ý nhận các bản tin thị trường, thông báo ngày hội kết nối B2B và chương trình xúc tiến thương mại qua email (Tùy chọn, có thể hủy bất kỳ lúc nào).
                      </span>
                    </label>
                  </div>
                  {consentError && <p id="service-consent-error" role="alert" className="sr-field-error sr-consent-error">{consentError}</p>}

                  {/* Submission Buttons */}
                  <div className="sr-form-actions">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="sr-button-secondary"
                    >
                      <ArrowLeft size={15} /> Chi tiết dịch vụ
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="sr-button-primary sr-inline-forward"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang tạo mã yêu cầu...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Gửi yêu cầu tư vấn</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

      </section>
      </div>

      {/* ==================================================================== */}
      {/* STICKY MOBILE CTA BAR (SECTION 22 SPEC 17.TXT) */}
      {/* Tuyệt đối không tràn màn hình 390px */}
      {/* ==================================================================== */}
      {!submittedResult && (
        <div className="sr-mobile-actions">
          <div>
            <strong>Bước {currentStep} / 3</strong>
            <small>{REQUEST_STEPS[currentStep - 1].title}</small>
          </div>

          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleNextToStep2}
              className="sr-button-primary"
            >
              Tiếp tục <ArrowRight size={16} />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNextToStep3}
              className="sr-button-primary"
            >
              Kiểm tra <ArrowRight size={16} />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="submit"
              form="service-request-form"
              disabled={isSubmitting}
              className="sr-button-primary"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'} <Send size={15} />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
