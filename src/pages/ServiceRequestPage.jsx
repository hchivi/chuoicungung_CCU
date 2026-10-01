import React, { useState, useEffect } from 'react';
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
    if (!formData.companyName.trim()) {
      alert('Vui lòng nhập tên Doanh nghiệp / Tổ chức của bạn.');
      return false;
    }
    if (!formData.customerName.trim()) {
      alert('Vui lòng nhập họ và tên người liên hệ.');
      return false;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      alert('Vui lòng cung cấp ít nhất số điện thoại hoặc email để tiện liên hệ.');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Vui lòng mô tả tóm tắt nội dung công việc bạn đang cần triển khai.');
      return false;
    }
    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleNextToStep3 = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Xử lý nộp form chính thức (Section 7, 8, 9 Spec 17)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consentToContact) {
      alert('Bạn cần đồng ý cho phép Ban Điều Phối liên hệ về yêu cầu dịch vụ này trước khi nộp.');
      return;
    }

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-28 antialiased selection:bg-[#0052cc] selection:text-white overflow-x-hidden">
      
      {/* ==================================================================== */}
      {/* HERO SECTION (SECTION 2 SPEC 17.TXT) */}
      {/* ==================================================================== */}
      <section className="bg-gradient-to-b from-slate-950 via-[#0A2540] to-[#06182B] text-white pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-800 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 relative z-10">
          <Link
            to="/dich-vu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Trung tâm dịch vụ</span>
          </Link>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Page 17: Service Request Engine
            </span>

            {/* Exact H1 & Subtitle per Section 2 Spec 17.txt */}
            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white leading-tight">
              BẠN ĐANG CẦN TRIỂN KHAI CÔNG VIỆC GÌ?
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              Chọn dịch vụ và mô tả yêu cầu. Thông tin sẽ được chuyển đến đầu mối phù hợp để làm rõ phạm vi và đề xuất cách thực hiện.
            </p>
          </div>

          {/* Draft Notification Banner (Section 13) */}
          {hasDraftNotice && (
            <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bạn có một bản nháp yêu cầu dịch vụ đã lưu trước đó.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  className="py-1 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition"
                >
                  Khôi phục bản nháp
                </button>
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="py-1 px-2.5 text-slate-300 hover:text-white transition"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3-STEP WIZARD PROGRESS INDICATOR (SECTION 22 SPEC 17.TXT) */}
      {/* ==================================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 grid grid-cols-3 gap-2 text-center text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 1 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                : (currentStep > 1 ? 'text-emerald-700 font-bold hover:bg-slate-50' : 'text-slate-400')
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentStep === 1 ? 'bg-blue-600 text-white' : (currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600')
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="truncate">1. Thông tin chung</span>
          </button>

          <button
            type="button"
            onClick={() => { if (validateStep1()) setCurrentStep(2); }}
            className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 2 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                : (currentStep > 2 ? 'text-emerald-700 font-bold hover:bg-slate-50' : 'text-slate-400')
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentStep === 2 ? 'bg-blue-600 text-white' : (currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600')
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="truncate">2. Đặc tả nghiệp vụ</span>
          </button>

          <button
            type="button"
            onClick={() => { if (validateStep1()) setCurrentStep(3); }}
            className={`py-2 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 3 
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                : 'text-slate-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span className="truncate">3. Xem lại & Nộp</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN CONTAINER */}
      {/* ==================================================================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">

          {/* SUCCESS CONFIRMATION SCREEN (SECTION 8 SPEC 17.TXT) */}
          {submittedResult ? (
            <div className="p-6 sm:p-10 bg-blue-50/70 border border-blue-200 rounded-3xl text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 bg-white text-blue-800 rounded-full text-xs font-mono font-bold shadow-2xs border border-blue-200 tracking-wider">
                  MÃ ĐỊNH DANH: {submittedResult.publicCode}
                </span>
                
                {/* Exact Text per Section 8 Spec 17.txt */}
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-heading">
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
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ============================================================ */}
              {/* STEP 1: DỊCH VỤ + THÔNG TIN CHUNG (SECTION 4 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* 1. Chọn dịch vụ chính */}
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-900 font-heading uppercase tracking-wide">
                      1. Chọn loại dịch vụ bạn cần hỗ trợ <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.keys(SERVICE_ENGINE_TYPES).map(key => {
                        const srv = SERVICE_ENGINE_TYPES[key];
                        const isSelected = formData.serviceType === key;
                        return (
                          <div
                            key={key}
                            onClick={() => selectServiceType(key)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${srv.badgeClass}`}>
                                  {srv.shortName}
                                </span>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-xs text-slate-900 font-heading pt-1">
                                {srv.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                Điều phối: {srv.desk}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Thông tin doanh nghiệp & liên hệ */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 font-heading uppercase tracking-wide">
                      2. Doanh nghiệp & Người liên hệ
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Tên Doanh nghiệp / Tổ chức / Hiệp hội <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="VD: Công ty TNHH Chế Tạo Điện Tử Hanbell"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Họ và tên người liên hệ <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.customerName}
                          onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                          placeholder="VD: Nguyễn Văn Minh"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Chức vụ (Optional)</label>
                        <input
                          type="text"
                          value={formData.roleTitle}
                          onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                          placeholder="VD: Trưởng ban Mua sắm / Giám đốc Nhà máy"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="09xx xxx xxx"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-700">Email công việc <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contact@company.com.vn"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Mô tả yêu cầu chung & Kế hoạch */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 font-heading uppercase tracking-wide">
                      3. Mô tả yêu cầu tổng quan & Kế hoạch triển khai
                    </label>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-700">Nội dung công việc cần triển khai <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Mô tả bối cảnh nhu cầu, sản phẩm hoặc sự kiện bạn đang chuẩn bị triển khai..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Địa bàn / Khu công nghiệp</label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          placeholder="VD: KCN VSIP 1, Bình Dương"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Thời gian mong muốn hoàn tất</label>
                        <input
                          type="text"
                          value={formData.desiredDate}
                          onChange={e => setFormData({ ...formData, desiredDate: e.target.value })}
                          placeholder="VD: Tháng 11/2026 hoặc Trước 20/12"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700">Ngân sách dự kiến (Optional)</label>
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={e => setFormData({ ...formData, budget: e.target.value })}
                          placeholder="VD: Theo đề xuất của CCU"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-700">Tệp đính kèm / Link Google Drive (Optional)</label>
                      <input
                        type="text"
                        value={formData.attachedFilesNote}
                        onChange={e => setFormData({ ...formData, attachedFilesNote: e.target.value })}
                        placeholder="VD: https://drive.google.com/drive/folders/... (Bản vẽ, logo, tài liệu)"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Button chuyển bước 2 */}
                  <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleNextToStep2}
                      className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                    >
                      <span>TIẾP TỤC: ĐẶC TẢ NGHIỆP VỤ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: DYNAMIC FORM BY SERVICETYPE (SECTION 5 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 font-heading">Đang đặc tả chuyên biệt:</span>
                      <h3 className="font-black text-sm text-blue-950 font-heading">
                        {currentServiceMeta.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                      {currentServiceMeta.desk}
                    </span>
                  </div>

                  {/* BRANCH A: TỔ CHỨC KẾT NỐI */}
                  {formData.serviceType === 'TO_CHUC_KET_NOI' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Hình thức triển khai mong muốn</label>
                          <select
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
                          <label className="font-bold text-slate-700">Quy mô sự kiện dự kiến (Số người / Doanh nghiệp)</label>
                          <input
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
                          <label className="font-bold text-slate-700">Đối tượng tham gia mục tiêu</label>
                          <input
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
                          <label className="font-bold text-slate-700">Nguồn lực hiện đã có sẵn</label>
                          <input
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
                          <label className="font-bold text-slate-700">Phần việc cần CCU hỗ trợ chính</label>
                          <input
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
                          <label className="font-bold text-slate-700">Số lượng đặt hàng dự kiến</label>
                          <input
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
                          <label className="font-bold text-slate-700">Phân bổ kích cỡ (Bảng size)</label>
                          <input
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
                          <label className="font-bold text-slate-700">Yêu cầu chất liệu & quy cách kỹ thuật</label>
                          <input
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
                          <label className="font-bold text-slate-700">Công nghệ in / thêu logo</label>
                          <input
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
                          <label className="font-bold text-slate-700">Địa điểm giao hàng tận nơi</label>
                          <input
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
                          <label className="font-bold text-slate-700">Sản phẩm / Năng lực chính cần làm nổi bật</label>
                          <input
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
                          <label className="font-bold text-slate-700">Địa chỉ nhà máy quay chụp thực tế</label>
                          <input
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
                          <label className="font-bold text-slate-700">Tài liệu, chứng chỉ hiện có sẵn</label>
                          <input
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
                          <label className="font-bold text-slate-700">Người có thẩm quyền duyệt nội dung</label>
                          <input
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
                          <label className="font-bold text-slate-700">Thời hạn cần hoàn tất bàn giao</label>
                          <input
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
                          <label className="font-bold text-slate-700">Chương trình kết nối quan tâm</label>
                          <select
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
                          <label className="font-bold text-slate-700">Mẫu sản phẩm thực tế dự kiến gửi đối chứng</label>
                          <input
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
                          <label className="font-bold text-slate-700">Người phụ trách phản hồi Buyer sau sự kiện</label>
                          <input
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
                          <label className="font-bold text-slate-700">Link video / Catalogue trực tuyến</label>
                          <input
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
                          <span>Quy định tiếp nhận tài trợ (Mục 5E Spec 17.txt):</span>
                        </div>
                        <p className="leading-relaxed">
                          Hệ thống tiếp nhận yêu cầu dưới dạng <strong>Đề tài tư vấn & thẩm định quyền lợi</strong>. Quyền lợi tài trợ chính thức chỉ được kích hoạt sau khi Hội đồng điều phối và Doanh nghiệp ký kết văn bản thỏa thuận.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700">Chương trình hoặc Chuyên mục tài trợ quan tâm</label>
                          <input
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
                          <label className="font-bold text-slate-700">Hình thức đóng góp dự kiến</label>
                          <select
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
                          <label className="font-bold text-slate-700">Ngân sách tài trợ dự kiến (Optional)</label>
                          <input
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
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                    >
                      ← Quay lại Bước 1
                    </button>

                    <button
                      type="button"
                      onClick={handleNextToStep3}
                      className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                    >
                      <span>TIẾP TỤC: XEM LẠI & XÁC NHẬN</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: REVIEW & CONSENTS (SECTION 6 & 15 SPEC 17.TXT) */}
              {/* ============================================================ */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-base font-black text-slate-900 font-heading">
                      Xác nhận thông tin đề bài trước khi gửi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Vui lòng kiểm tra lại các thông tin đã nhập. Bạn có thể quay lại chỉnh sửa bất kỳ lúc nào.
                    </p>
                  </div>

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
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-800">Thông tin đặc tả nghiệp vụ:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="py-1 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Sửa Bước 2
                      </button>
                    </div>
                  </div>

                  {/* SECTION 15 SPEC 17.TXT: TÁCH RIÊNG 2 CONSENT CHECKBOXES */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="font-bold text-xs text-slate-900 uppercase font-heading">
                      Xác nhận điều khoản & quyền riêng tư
                    </div>

                    {/* Checkbox A: Bắt buộc */}
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consentToContact}
                        onChange={e => setFormData({ ...formData, consentToContact: e.target.checked })}
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

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                    >
                      ← Quay lại Bước 2
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang tạo mã yêu cầu...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>GỬI YÊU CẦU TƯ VẤN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      </main>

      {/* ==================================================================== */}
      {/* STICKY MOBILE CTA BAR (SECTION 22 SPEC 17.TXT) */}
      {/* Tuyệt đối không tràn màn hình 390px */}
      {/* ==================================================================== */}
      {!submittedResult && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 z-40 flex items-center justify-between gap-3">
          <div className="text-left leading-tight text-xs text-slate-300">
            <span className="font-bold text-white block">Bước {currentStep}/3</span>
            <span className="text-[10px] text-slate-400">{currentServiceMeta.shortName}</span>
          </div>

          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleNextToStep2}
              className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition"
            >
              TIẾP TỤC BƯỚC 2 →
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNextToStep3}
              className="py-2.5 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition"
            >
              XEM LẠI BƯỚC 3 →
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md transition"
            >
              GỬI YÊU CẦU TƯ VẤN
            </button>
          )}
        </div>
      )}

    </div>
  );
}
