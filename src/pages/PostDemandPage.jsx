import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, ArrowLeft, Shield, Clock, DollarSign,
  HelpCircle, Phone, Mail, MessageSquare, FileText, Upload, Sparkles,
  Building2, Factory, Bot, Eye, AlertCircle, RefreshCw, X, ChevronRight,
  ExternalLink, Layers, Check, Share2, Lock, Users, Globe, Save, Bookmark,
  ChevronDown, MapPin
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function PostDemandPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Workflow steps:
  // 1: Điền thông tin nhu cầu (Form đặc tả kỹ thuật, số lượng, địa bàn & liên hệ)
  // 2: Xem trước & Xác nhận (Kiểm tra lại dữ liệu & chọn phạm vi chia sẻ)
  // 3: Hoàn tất & Khởi động tìm nguồn (Thông báo kết quả & khớp nối sơ bộ)
  const [currentStep, setCurrentStep] = useState(1);
  const [aiDraftInfo, setAiDraftInfo] = useState(null);
  const [showSuppiAssistModal, setShowSuppiAssistModal] = useState(false);
  const [draftToast, setDraftToast] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([
    { name: 'Bang_thong_so_ky_thuat_DP.pdf', size: '1.4 MB' }
  ]);

  // SEO & Metadata setup
  useEffect(() => {
    // 1. Exact Title requested: "Đăng nhu cầu | CHUOICUNGUNG.COM"
    document.title = 'Đăng nhu cầu | CHUOICUNGUNG.COM';

    // 2. Meta description tailored to actual B2B procurement data
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Cổng đăng nhu cầu tìm nhà cung ứng, nhà máy gia công phụ trợ và thu mua công nghiệp cho các chủ đầu tư, nhà máy FDI và bộ phận mua hàng tại 480+ KCN Việt Nam.';

    // 3. Self-canonical: https://chuoicungung.com/dang-nhu-cau
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://chuoicungung.com/dang-nhu-cau';

    // 4. Schema JSON-LD Structured Data
    const schemaScriptId = 'post-demand-schema-jsonld';
    let schemaScript = document.getElementById(schemaScriptId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaScriptId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Đăng nhu cầu | CHUOICUNGUNG.COM",
      "description": "Cổng đăng nhu cầu tìm nhà cung ứng, gia công phụ trợ và thu mua công nghiệp cho nhà máy, chủ đầu tư và bộ phận mua hàng.",
      "url": "https://chuoicungung.com/dang-nhu-cau",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://chuoicungung.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Nhu cầu mua sắm B2B",
            "item": "https://chuoicungung.com/san-nhu-cau"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Đăng nhu cầu",
            "item": "https://chuoicungung.com/dang-nhu-cau"
          }
        ]
      }
    });

    return () => {
      // Keep canonical and meta cleanly
    };
  }, []);

  // Default AI Draft Template (Ensures page is never blank and showcases practical B2B structure)
  const defaultAiDraft = {
    id: 'REQ-979488',
    title: 'TÌM 500 BỘ ĐỒNG PHỤC CÔNG NHÂN',
    productService: 'Đồng phục công nhân may kỹ',
    quantity: '500',
    unit: 'bộ',
    location: 'Đồng Nai',
    province: 'Đồng Nai',
    kcn: 'KCN Amata, TP. Biên Hòa',
    industrialParkId: 'KCN Amata / KCN Biên Hòa 2',
    deadline: 'Trong 30 ngày',
    specifications: 'Chất liệu vải Kaki 65/35 may kỹ, đường may 2 kim bền chắc, form chuẩn công nghiệp, thoáng mát, in thêu logo 2 màu trước ngực.',
    certificationRequirements: 'ISO 9001:2015, OEKO-TEX Standard 100',
    sampleRequired: true,
    surveyRequired: false,
    budgetMin: '30.000.000',
    budgetMax: '150.000.000',
    notes: 'Cần xem mẫu thực tế trước khi duyệt đặt số lượng hàng loạt.',
    visibility: 'ONLY_MATCHED', // Mặc định: Chỉ NCC phù hợp
    status: 'DRAFT_AI',
    completenessScore: 85,
    createdFrom: 'ai_chat',
    companyName: 'Công ty Cổ phần May Mặc Đông Nam',
    orgType: 'Nhà máy',
    contactName: 'Phòng Mua sắm & Thu mua',
    phone: '0901 234 567',
    email: 'procurement@factory.vn',
    category: 'May mặc & Đồng phục',
    stageId: '4',
    phaseId: '4.2'
  };

  // Form states with all practical procurement fields
  const [formData, setFormData] = useState(defaultAiDraft);

  // Load draft from URL ?draft={id} or localStorage
  useEffect(() => {
    try {
      const draftId = searchParams.get('draft');
      let savedDraftStr = null;

      if (draftId) {
        savedDraftStr = localStorage.getItem('ccu_draft_' + draftId);
      }
      if (!savedDraftStr) {
        savedDraftStr = localStorage.getItem('ccu_requirement_draft');
      }
      if (!savedDraftStr) {
        const convStr = localStorage.getItem('ccu_active_conversation');
        if (convStr) {
          const parsedConv = JSON.parse(convStr);
          if (parsedConv.activeEntityDraft) {
            savedDraftStr = JSON.stringify(parsedConv.activeEntityDraft);
          }
        }
      }

      if (savedDraftStr) {
        const draft = JSON.parse(savedDraftStr);
        setAiDraftInfo(draft);

        const prod = draft.productService || draft.product_service || draft.title || defaultAiDraft.productService;
        const loc = draft.province || draft.location || defaultAiDraft.location;
        const ip = draft.industrialParkId || draft.industrial_park || draft.kcn || defaultAiDraft.kcn;
        const specs = draft.specifications || defaultAiDraft.specifications;

        setFormData(prev => ({
          ...prev,
          id: draft.id || prev.id,
          title: draft.title || `TÌM ${draft.quantity || '500'} ${draft.unit || 'BỘ'} ${prod.toUpperCase()}`,
          productService: prod,
          quantity: draft.quantity || prev.quantity,
          unit: draft.unit || prev.unit,
          location: loc,
          province: loc,
          kcn: ip,
          industrialParkId: ip,
          deadline: draft.deadline || prev.deadline,
          specifications: specs,
          certificationRequirements: draft.certificationRequirements || draft.certification_requirements || prev.certificationRequirements,
          budgetMin: draft.budgetMin || draft.budget_min || prev.budgetMin,
          budgetMax: draft.budgetMax || draft.budget_max || prev.budgetMax,
          sampleRequired: draft.sampleRequired ?? draft.sample_required ?? prev.sampleRequired,
          surveyRequired: draft.surveyRequired ?? draft.survey_required ?? prev.surveyRequired,
          visibility: draft.visibility || 'ONLY_MATCHED',
          notes: draft.notes || prev.notes,
          companyName: draft.organizationId || draft.companyName || prev.companyName,
          contactName: draft.userId && draft.userId !== 'GUEST' ? draft.userId : prev.contactName,
          phone: draft.phone || prev.phone,
          email: draft.email || prev.email,
          status: draft.status || 'DRAFT_AI',
          completenessScore: draft.completenessScore || draft.completeness_score || 85
        }));
      } else {
        setAiDraftInfo(defaultAiDraft);
        setFormData(defaultAiDraft);
      }
    } catch (e) {
      console.error('Failed to parse requirement draft:', e);
    }
  }, [searchParams]);

  // Dynamic Completeness Score Calculation
  const calculateCompleteness = (data) => {
    let score = 0;
    if (data.productService?.trim()) score += 15;
    if (data.quantity?.toString().trim()) score += 10;
    if (data.unit?.trim()) score += 5;
    if (data.location?.trim()) score += 5;
    if (data.kcn?.trim()) score += 5;
    if (data.deadline?.trim()) score += 10;
    if (data.specifications?.trim()) score += 15;
    if (data.certificationRequirements?.trim()) score += 10;
    if (data.sampleRequired !== undefined) score += 5;
    if (data.surveyRequired !== undefined) score += 5;
    if (data.budgetMin || data.budgetMax) score += 5;
    if (data.companyName?.trim()) score += 5;
    if (data.phone?.trim()) score += 5;
    return Math.min(100, Math.max(30, score));
  };

  const completeness = calculateCompleteness(formData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper check for field status
  const isFilled = (val) => Boolean(val && val.toString().trim().length > 0);

  // Field styling with gentle focus and missing status indication
  const getFieldClass = (filled, isOptional = false) => {
    if (filled) {
      return 'w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] text-slate-800 font-medium transition shadow-2xs text-sm';
    }
    if (isOptional) {
      return 'w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-800 font-medium transition text-sm';
    }
    return 'w-full p-3 bg-amber-50/40 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-500 text-slate-800 font-medium transition shadow-xs text-sm';
  };

  // Preset Industry Standard Specifications for 1-Click Assistance
  const INDUSTRY_PRESETS = [
    {
      id: 'workwear',
      name: 'Đồng phục công nhân may kỹ',
      specs: 'Chất liệu vải Kaki 65/35 may kỹ, đường may 2 kim bền chắc, form chuẩn công nghiệp, thoáng mát, in thêu logo 2 màu trước ngực.',
      certs: 'ISO 9001:2015, OEKO-TEX Standard 100',
      unit: 'bộ',
      qty: '500',
      sample: true,
      survey: false,
      budgetMin: '30.000.000',
      budgetMax: '150.000.000',
      deadline: 'Trong 30 ngày'
    },
    {
      id: 'packaging',
      name: 'Thùng carton 5 lớp chống thấm',
      specs: 'Thùng carton 5 lớp sóng BC, giấy Kraft nhập khẩu chống thấm, chịu tải 25kg, in flexo 2 màu sắc nét, định lượng 150/140/150 gsm.',
      certs: 'FSC CoC, ISO 9001, RoHS',
      unit: 'thùng',
      qty: '10.000',
      sample: true,
      survey: false,
      budgetMin: '80.000.000',
      budgetMax: '200.000.000',
      deadline: 'Trong 21 ngày'
    },
    {
      id: 'cnc',
      name: 'Gia công chi tiết cơ khí CNC',
      specs: 'Gia công phay/tiện CNC chi tiết trục máy, vật liệu Thép S45C nhiệt luyện độ cứng 45-50 HRC, dung sai kích thước ±0.01mm, bề mặt Ra 0.8.',
      certs: 'ISO 9001:2015, Chứng chỉ xuất xưởng C/Q',
      unit: 'chi tiết',
      qty: '1.200',
      sample: true,
      survey: true,
      budgetMin: '50.000.000',
      budgetMax: '180.000.000',
      deadline: 'Trong 28 ngày'
    },
    {
      id: 'pallet',
      name: 'Pallet gỗ công nghiệp tải trọng 2 tấn',
      specs: 'Pallet gỗ tràm 4 hướng nâng, kích thước tiêu chuẩn 1100x1100x150mm, khử trùng nhiệt HT chuẩn ISPM 15, tải trọng tĩnh 2.5 tấn, động 1.2 tấn.',
      certs: 'Hun trùng ISPM 15, FSC',
      unit: 'pallet',
      qty: '800',
      sample: false,
      survey: false,
      budgetMin: '90.000.000',
      budgetMax: '140.000.000',
      deadline: 'Cần gấp trong 10 ngày'
    }
  ];

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      title: `TÌM ${preset.qty} ${preset.unit.toUpperCase()} ${preset.name.toUpperCase()}`,
      productService: preset.name,
      quantity: preset.qty,
      unit: preset.unit,
      specifications: preset.specs,
      certificationRequirements: preset.certs,
      sampleRequired: preset.sample,
      surveyRequired: preset.survey,
      budgetMin: preset.budgetMin,
      budgetMax: preset.budgetMax,
      deadline: preset.deadline
    }));
    setShowSuppiAssistModal(false);
  };

  // Action: Lưu bản nháp (Save draft)
  const handleSaveDraft = () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const draftObj = {
        ...formData,
        completenessScore: completeness,
        lastSavedAt: now.toISOString()
      };
      localStorage.setItem('ccu_requirement_draft', JSON.stringify(draftObj));
      if (formData.id) {
        localStorage.setItem('ccu_draft_' + formData.id, JSON.stringify(draftObj));
      }
      setLastSavedAt(timeStr);
      setDraftToast(`Đã lưu bản nháp thành công lúc ${timeStr}! Bạn có thể quay lại tiếp tục bất kỳ lúc nào.`);
      setTimeout(() => setDraftToast(null), 4000);
    } catch (e) {
      console.warn('Draft save error:', e);
      setDraftToast('Có lỗi khi lưu nháp. Vui lòng kiểm tra bộ nhớ trình duyệt.');
      setTimeout(() => setDraftToast(null), 4000);
    }
  };

  // Action: Xem trước (Preview demand ticket)
  const handlePreview = (e) => {
    if (e) e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action: Xác nhận & Bắt đầu tìm nguồn
  const handleConfirmPublish = async () => {
    const finalNeed = {
      ...formData,
      status: 'ACTIVE_SOURCING',
      completenessScore: completeness,
      confirmedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save locally
    try {
      localStorage.setItem('ccu_requirement_draft', JSON.stringify(finalNeed));
      if (finalNeed.id) {
        localStorage.setItem('ccu_draft_' + finalNeed.id, JSON.stringify(finalNeed));
      }
      const savedDemandsStr = localStorage.getItem('ccu_user_demands');
      let demandsList = savedDemandsStr ? JSON.parse(savedDemandsStr) : [];
      demandsList = [finalNeed, ...demandsList.filter(d => d.id !== finalNeed.id)];
      localStorage.setItem('ccu_user_demands', JSON.stringify(demandsList));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    // Try mock API dispatch
    try {
      await fetch('/api/demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalNeed.title,
          stageId: 4,
          phaseId: '4.2',
          productService: finalNeed.productService,
          quantity: `${finalNeed.quantity} ${finalNeed.unit}`,
          location: `${finalNeed.kcn}, ${finalNeed.location}`,
          budget: `${finalNeed.budgetMin} - ${finalNeed.budgetMax} VNĐ`,
          deadline: finalNeed.deadline,
          status: 'ACTIVE_SOURCING',
          visibility: finalNeed.visibility
        })
      });
    } catch (e) {}

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-24 pt-6 antialiased overflow-x-hidden">

      {/* Toast notification for Save Draft */}
      {draftToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-medium leading-relaxed">{draftToast}</div>
          <button
            type="button"
            onClick={() => setDraftToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Container & Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Breadcrumb có căn cứ */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center space-x-2 flex-wrap">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Chuỗi Cung Ứng" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <span className="text-slate-300">/</span>
          <Link to="/san-nhu-cau" className="hover:text-[#0052cc] transition font-medium">Nhu cầu mua sắm B2B</Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#0052cc] font-semibold">Đăng nhu cầu</span>
        </nav>

        {/* Hero Card with Single H1, Target Audience & CTA Actions */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0052cc] text-xs font-black uppercase font-mono tracking-wider">
                  DÀNH CHO NHÀ MÁY, CHỦ ĐẦU TƯ & BỘ PHẬN MUA HÀNG
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                  Mã: {formData.id || 'REQ-979488'}
                </span>
                {lastSavedAt && (
                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Đã lưu nháp {lastSavedAt}
                  </span>
                )}
              </div>

              {/* Exact H1 requested: "Đăng nhu cầu tìm nhà cung ứng" */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                Đăng nhu cầu tìm nhà cung ứng
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nền tảng hỗ trợ nhà máy sản xuất, chủ đầu tư dự án và phòng mua sắm chuẩn hóa đặc tả kỹ thuật, lưu nháp linh hoạt, xem trước hồ sơ và kết nối bảo mật với nhà cung ứng uy tín tại các KCN.
              </p>
            </div>

            {/* Completeness Card & Header CTAs */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50 to-indigo-50/70 border border-blue-200/80 min-w-[280px] space-y-3 shrink-0 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Độ hoàn thiện hồ sơ</span>
                <span className="text-base font-black text-[#0052cc] font-mono">
                  {completeness}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-blue-200/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-600 flex items-center justify-between">
                <span>{completeness >= 80 ? '✓ Đạt chuẩn tiếp nhận' : 'Cần bổ sung một số trường'}</span>
                <span className="font-semibold text-[#0052cc]">
                  {completeness >= 100 ? 'Đã đủ trường chính' : 'Field thiếu có viền vàng'}
                </span>
              </div>

              {/* Quick Actions inside Hero */}
              <div className="pt-2 border-t border-blue-200/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lưu bản nháp</span>
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem trước</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Notice & AI Presets Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Trường đã điền đầy đủ</span>
              <span className="text-slate-300">|</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span className="text-amber-900 font-semibold">Trường còn thiếu (viền vàng)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowSuppiAssistModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#0052cc] font-bold text-xs border border-blue-200/80 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Mẫu đặc tả ngành sẵn có</span>
              </button>

              <Link
                to="/tro-ly-ai"
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Trợ lý AI Suppi</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Step Interactive Tabs: Step 1: Điền thông tin -> Step 2: Xem trước & Xác nhận */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`p-3 rounded-xl text-left transition flex items-center space-x-3 cursor-pointer ${currentStep === 1
                ? 'bg-blue-50 text-[#0052cc] border-2 border-blue-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === 1 ? 'bg-[#0052cc] text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <div>
                <div className="font-heading text-xs sm:text-sm font-black">1. ĐIỀN THÔNG TIN NHU CẦU</div>
                <div className="text-[11px] text-slate-500 font-normal">Quy cách, số lượng, địa bàn nhà máy & liên hệ</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className={`p-3 rounded-xl text-left transition flex items-center space-x-3 cursor-pointer ${currentStep === 2
                ? 'bg-blue-50 text-[#0052cc] border-2 border-blue-300 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === 2 ? 'bg-[#0052cc] text-white' : 'bg-slate-100 text-slate-500'}`}>
                2
              </span>
              <div>
                <div className="font-heading text-xs sm:text-sm font-black">2. XEM TRƯỚC & XÁC NHẬN</div>
                <div className="text-[11px] text-slate-500 font-normal">Kiểm tra lại dữ liệu & chọn quyền chia sẻ bảo mật</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Main Workspace Form (8 cols) */}
          <div className="lg:col-span-8">

            {/* ======================================================== */}
            {/* VIEW 1: ĐIỀN THÔNG TIN NHU CẦU (BƯỚC 1) */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <form
                onSubmit={handlePreview}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8"
              >
                {/* Block A: Sản phẩm, Số lượng & Đơn vị */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide font-heading flex items-center gap-2">
                        <span>A. SẢN PHẨM & SỐ LƯỢNG MUA SẮM</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Xác định chính xác chủng loại sản phẩm và quy mô lô hàng cần thu mua.</p>
                    </div>
                    {isFilled(formData.productService) && isFilled(formData.quantity) && (
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ✓ Đã xác định
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* 1. Sản phẩm / dịch vụ */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="demand-product-service"
                          className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                        >
                          <span>1. Sản phẩm / Dịch vụ *</span>
                          {isFilled(formData.productService) ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                              ✓ Đã điền
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                              ⚡ Trường bắt buộc
                            </span>
                          )}
                        </label>

                        <button
                          type="button"
                          onClick={() => setShowSuppiAssistModal(true)}
                          className="text-[11px] text-[#0052cc] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Gợi ý mẫu ngành</span>
                        </button>
                      </div>

                      <input
                        id="demand-product-service"
                        required
                        type="text"
                        name="productService"
                        value={formData.productService || ''}
                        onChange={handleChange}
                        placeholder="VD: Đồng phục công nhân may kỹ, Thùng carton 5 lớp, Gia công phay CNC..."
                        className={getFieldClass(isFilled(formData.productService))}
                      />
                    </div>

                    {/* Tiêu đề tóm tắt nhu cầu */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="demand-title"
                          className="font-bold text-slate-700 text-xs font-heading"
                        >
                          Tiêu đề nhu cầu hiển thị *
                        </label>
                      </div>
                      <input
                        id="demand-title"
                        required
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        placeholder="VD: TÌM 500 BỘ ĐỒNG PHỤC CÔNG NHÂN"
                        className={getFieldClass(isFilled(formData.title))}
                      />
                    </div>

                    {/* 2. Số lượng & 3. Đơn vị */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="demand-quantity"
                            className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                          >
                            <span>2. Số lượng cần mua *</span>
                            {isFilled(formData.quantity) ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                ✓ Đã điền
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                                ⚡ Cần bổ sung
                              </span>
                            )}
                          </label>
                        </div>
                        <input
                          id="demand-quantity"
                          required
                          type="text"
                          name="quantity"
                          value={formData.quantity || ''}
                          onChange={handleChange}
                          placeholder="VD: 500, 10.000, 1.200..."
                          className={getFieldClass(isFilled(formData.quantity))}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="demand-unit"
                            className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                          >
                            <span>3. Đơn vị tính *</span>
                            {isFilled(formData.unit) ? (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                ✓ Đã điền
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                                ⚡ Cần bổ sung
                              </span>
                            )}
                          </label>
                        </div>
                        <input
                          id="demand-unit"
                          required
                          type="text"
                          name="unit"
                          value={formData.unit || ''}
                          onChange={handleChange}
                          placeholder="bộ / cái / thùng / pallet / chi tiết / tấn..."
                          className={getFieldClass(isFilled(formData.unit))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Block B: Địa điểm / KCN & Thời gian cần */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide font-heading">
                        B. ĐỊA ĐIỂM GIAO NHẬN & TIẾN ĐỘ THỰC HIỆN
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Xác định vị trí nhà máy tiếp nhận và thời hạn giao hàng mong muốn.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 4.1 Địa điểm (Tỉnh/Thành) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="demand-province"
                          className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                        >
                          <span>4.1 Tỉnh / Thành phố *</span>
                        </label>
                      </div>
                      <select
                        id="demand-province"
                        name="location"
                        value={formData.location || 'Đồng Nai'}
                        onChange={handleChange}
                        className={getFieldClass(isFilled(formData.location))}
                      >
                        <option value="Đồng Nai">Đồng Nai</option>
                        <option value="Bình Dương">Bình Dương</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Long An">Long An</option>
                        <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                        <option value="Bắc Ninh">Bắc Ninh</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                    </div>

                    {/* 4.2 Khu công nghiệp / Địa chỉ xưởng */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="demand-kcn"
                          className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                        >
                          <span>4.2 Khu công nghiệp / Địa chỉ xưởng *</span>
                          {isFilled(formData.kcn) ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                              ✓ Đã điền
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                              ⚡ Cần bổ sung
                            </span>
                          )}
                        </label>
                      </div>
                      <input
                        id="demand-kcn"
                        type="text"
                        name="kcn"
                        value={formData.kcn || ''}
                        onChange={handleChange}
                        placeholder="VD: KCN Amata / KCN Biên Hòa 2 / KCN VSIP II..."
                        className={getFieldClass(isFilled(formData.kcn))}
                      />
                    </div>
                  </div>

                  {/* 5. Thời gian cần */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="demand-deadline"
                        className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                      >
                        <span>5. Thời gian cần giao hàng / Hoàn thành *</span>
                        {isFilled(formData.deadline) ? (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            ✓ {formData.deadline}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                            ⚡ Cần bổ sung
                          </span>
                        )}
                      </label>
                    </div>
                    <input
                      id="demand-deadline"
                      required
                      type="text"
                      name="deadline"
                      value={formData.deadline || ''}
                      onChange={handleChange}
                      placeholder="VD: Trong 30 ngày, trong 2 tuần, hoặc ngày cụ thể 2026-10-31"
                      className={getFieldClass(isFilled(formData.deadline))}
                    />
                  </div>
                </div>

                {/* Block C: Tiêu chí kỹ thuật, Chứng chỉ & Ngân sách */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide font-heading">
                        C. TIÊU CHÍ KỸ THUẬT & YÊU CẦU TIÊU CHUẨN
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Quy cách kỹ thuật giúp các nhà máy và đơn vị gia công gửi báo giá chính xác.</p>
                    </div>
                  </div>

                  {/* 6. Tiêu chí bắt buộc */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="demand-specifications"
                        className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                      >
                        <span>6. Tiêu chí bắt buộc (Quy cách kỹ thuật, vật liệu, thông số) *</span>
                        {isFilled(formData.specifications) ? (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            ✓ Đã hoàn thiện
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                            ⚡ Cần bổ sung
                          </span>
                        )}
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowSuppiAssistModal(true)}
                        className="text-[11px] text-[#0052cc] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Tôi chưa xác định rõ — cần SUPPI hỗ trợ</span>
                      </button>
                    </div>

                    <textarea
                      id="demand-specifications"
                      required
                      rows="3"
                      name="specifications"
                      value={formData.specifications || ''}
                      onChange={handleChange}
                      placeholder="VD: Chất liệu vải Kaki 65/35 may kỹ, đường may 2 kim chắc chắn, form chuẩn công nghiệp, thoáng mát, in thêu logo 2 màu trước ngực..."
                      className={getFieldClass(isFilled(formData.specifications))}
                    />
                  </div>

                  {/* 10. Chứng chỉ / tiêu chuẩn */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="demand-certifications"
                        className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5"
                      >
                        <span>7. Chứng chỉ / Tiêu chuẩn bắt buộc</span>
                        {isFilled(formData.certificationRequirements) ? (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            ✓ {formData.certificationRequirements}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            (Tùy chọn)
                          </span>
                        )}
                      </label>
                    </div>
                    <input
                      id="demand-certifications"
                      type="text"
                      name="certificationRequirements"
                      value={formData.certificationRequirements || ''}
                      onChange={handleChange}
                      placeholder="VD: ISO 9001:2015, OEKO-TEX Standard 100, FSC CoC, RoHS..."
                      className={getFieldClass(isFilled(formData.certificationRequirements), true)}
                    />
                  </div>

                  {/* Ngân sách dự kiến */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-slate-800 text-xs font-heading flex items-center gap-1.5">
                        <span>8. Ngân sách dự kiến (VND) — <em className="text-slate-500 font-normal">Không bắt buộc</em></span>
                      </span>
                      <span className="text-[11px] text-slate-500">Hỗ trợ lọc đúng phân khúc năng lực nhà máy</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="demand-budget-min" className="text-[11px] text-slate-500 block mb-1">
                          Mức tối thiểu:
                        </label>
                        <input
                          id="demand-budget-min"
                          type="text"
                          name="budgetMin"
                          value={formData.budgetMin || ''}
                          onChange={handleChange}
                          placeholder="VD: 30.000.000"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold font-mono text-[#0052cc] text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="demand-budget-max" className="text-[11px] text-slate-500 block mb-1">
                          Mức tối đa:
                        </label>
                        <input
                          id="demand-budget-max"
                          type="text"
                          name="budgetMax"
                          value={formData.budgetMax || ''}
                          onChange={handleChange}
                          placeholder="VD: 150.000.000"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold font-mono text-[#0052cc] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Yêu cầu mẫu & Yêu cầu khảo sát */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className={`p-3.5 rounded-2xl border transition ${formData.sampleRequired ? 'bg-blue-50/80 border-blue-300 shadow-2xs' : 'bg-slate-50/60 border-slate-200 hover:bg-white'}`}>
                      <label htmlFor="demand-sample-required" className="flex items-start space-x-3 cursor-pointer">
                        <input
                          id="demand-sample-required"
                          type="checkbox"
                          name="sampleRequired"
                          checked={formData.sampleRequired || false}
                          onChange={handleChange}
                          className="mt-0.5 rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block font-heading">
                            9. Yêu cầu xem mẫu thử trước
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Cần gửi mẫu thực tế trước khi duyệt đặt số lượng hàng loạt.
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className={`p-3.5 rounded-2xl border transition ${formData.surveyRequired ? 'bg-blue-50/80 border-blue-300 shadow-2xs' : 'bg-slate-50/60 border-slate-200 hover:bg-white'}`}>
                      <label htmlFor="demand-survey-required" className="flex items-start space-x-3 cursor-pointer">
                        <input
                          id="demand-survey-required"
                          type="checkbox"
                          name="surveyRequired"
                          checked={formData.surveyRequired || false}
                          onChange={handleChange}
                          className="mt-0.5 rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-xs block font-heading">
                            10. Yêu cầu khảo sát thực tế
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            NCC cần cử kỹ thuật qua đo đạc hoặc khảo sát mặt bằng xưởng.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Block D: File đính kèm & Liên hệ doanh nghiệp */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide font-heading">
                        D. HỒ SƠ ĐÍNH KÈM & LIÊN HỆ DOANH NGHIỆP
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Đính kèm bản vẽ hoặc ảnh mẫu và thông tin nhận báo giá chính xác.</p>
                    </div>
                  </div>

                  {/* 11. File / ảnh / tài liệu */}
                  <div>
                    <label
                      htmlFor="demand-file-upload"
                      className="font-bold text-slate-800 text-xs font-heading block mb-1.5"
                    >
                      11. File / Ảnh mẫu / Bản vẽ kỹ thuật đính kèm
                    </label>

                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-2 bg-slate-50/60 hover:border-blue-400 transition cursor-pointer">
                      <input
                        id="demand-file-upload"
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const f = e.target.files[0];
                            setAttachedFiles(prev => [...prev, { name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB` }]);
                          }
                        }}
                      />
                      <Upload className="w-6 h-6 text-[#0052cc] mx-auto" />
                      <div className="text-xs font-bold text-slate-700">Kéo thả file bản vẽ hoặc bấm để tải lên</div>
                      <div className="text-[10.5px] text-slate-400">PDF, DWG, DOCX, XLSX, JPG, PNG (Tối đa 25MB)</div>
                    </div>

                    {attachedFiles.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {attachedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                              <FileText className="w-4 h-4 text-[#0052cc] shrink-0" />
                              <span className="truncate">{f.name}</span>
                              <span className="text-slate-400 text-[10px]">({f.size})</span>
                            </div>
                            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                              Đã tải lên
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 12. Người liên hệ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label
                        htmlFor="demand-company-name"
                        className="font-bold text-slate-800 text-xs font-heading block mb-1"
                      >
                        12.1 Doanh nghiệp / Nhà máy *
                      </label>
                      <input
                        id="demand-company-name"
                        required
                        type="text"
                        name="companyName"
                        value={formData.companyName || ''}
                        onChange={handleChange}
                        placeholder="VD: Công ty Cổ phần May Mặc Đông Nam"
                        className={getFieldClass(isFilled(formData.companyName))}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demand-contact-name"
                        className="font-bold text-slate-800 text-xs font-heading block mb-1"
                      >
                        12.2 Người đại diện / Chức vụ *
                      </label>
                      <input
                        id="demand-contact-name"
                        required
                        type="text"
                        name="contactName"
                        value={formData.contactName || ''}
                        onChange={handleChange}
                        placeholder="VD: Phòng Thu mua / Trưởng phòng mua sắm"
                        className={getFieldClass(isFilled(formData.contactName))}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demand-phone"
                        className="font-bold text-slate-800 text-xs font-heading block mb-1"
                      >
                        12.3 Số điện thoại liên hệ *
                      </label>
                      <input
                        id="demand-phone"
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="0901 234 567"
                        className={getFieldClass(isFilled(formData.phone))}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="demand-email"
                        className="font-bold text-slate-800 text-xs font-heading block mb-1"
                      >
                        12.4 Email nhận báo giá *
                      </label>
                      <input
                        id="demand-email"
                        required
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="procurement@factory.vn"
                        className={getFieldClass(isFilled(formData.email))}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons: Lưu bản nháp & Xem trước */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
                  >
                    <Save className="w-4 h-4 text-slate-600" />
                    <span>Lưu bản nháp</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem trước & Chọn quyền chia sẻ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: XEM TRƯỚC & XÁC NHẬN (BƯỚC 2) */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">

                {/* Header Section */}
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[11px] font-black uppercase font-mono">
                      BƯỚC 2: XEM TRƯỚC HỒ SƠ & BẢO MẬT
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      Bản nháp: #{formData.id}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading">
                    Xem trước & Xác nhận nhu cầu
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Vui lòng đối soát lại toàn bộ dữ liệu thu mua. Hệ thống cam kết không công bố công khai thông tin liên hệ khi bạn chưa cho phép.
                  </p>
                </div>

                {/* Full Data Review Card */}
                <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/60 via-white to-sky-50/40 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-blue-100">
                    <div className="font-black text-base text-slate-900 font-heading">
                      {formData.title || 'TÌM NHÀ CUNG CẤP B2B'}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-bold text-xs shadow-2xs">
                      Độ hoàn thiện: {completeness}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Sản phẩm / Dịch vụ:</span>
                      <strong className="text-slate-900 text-sm">{formData.productService}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Số lượng & Đơn vị:</span>
                      <strong className="text-slate-900 text-sm">{formData.quantity} {formData.unit}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Địa bàn & Khu công nghiệp:</span>
                      <strong className="text-slate-900">{formData.kcn}, {formData.location}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Thời hạn cần giao nhận:</span>
                      <strong className="text-slate-900">{formData.deadline}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Ngân sách dự kiến:</span>
                      <strong className="text-[#0052cc] font-mono">
                        {formData.budgetMin || formData.budgetMax ? `${formData.budgetMin || '0'} - ${formData.budgetMax || 'Thương lượng'} VNĐ` : 'Theo báo giá cạnh tranh'}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-blue-100">
                      <span className="text-slate-500 block text-[11px]">Tiêu chuẩn & Chứng chỉ:</span>
                      <strong className="text-slate-900">{formData.certificationRequirements || 'Theo tiêu chuẩn ngành'}</strong>
                    </div>
                  </div>

                  {/* Specifications full block */}
                  <div className="p-3.5 rounded-xl bg-white border border-blue-100 text-xs space-y-1">
                    <span className="text-slate-500 block text-[11px] font-bold">Tiêu chí kỹ thuật bắt buộc:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {formData.specifications}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-blue-100 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${formData.sampleRequired ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className="font-semibold text-slate-700">
                        {formData.sampleRequired ? '✓ Cần xem mẫu thực tế trước' : 'Không bắt buộc gửi mẫu'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-blue-100 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${formData.surveyRequired ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className="font-semibold text-slate-700">
                        {formData.surveyRequired ? '✓ Cần khảo sát đo đạc thực tế' : 'Không yêu cầu khảo sát'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 border border-slate-200">
                    <span><strong>Doanh nghiệp:</strong> {formData.companyName}</span>
                    <span><strong>Liên hệ:</strong> {formData.contactName} ({formData.phone} · {formData.email})</span>
                  </div>
                </div>

                {/* Chọn quyền chia sẻ (Mặc định: Chỉ NCC phù hợp) */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-sky-50/80 border-2 border-blue-300/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-xs sm:text-sm text-slate-900 font-heading uppercase tracking-wide flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#0052cc]" />
                      <span>PHẠM VI CHIA SẺ THÔNG TIN</span>
                    </div>
                    <span className="text-[10.5px] font-bold text-[#0052cc] bg-blue-100 px-2 py-0.5 rounded-full">
                      Mặc định: Chỉ NCC phù hợp
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Option 1: Riêng tư */}
                    <div className={`p-3.5 rounded-xl border transition ${formData.visibility === 'PRIVATE' ? 'bg-white border-blue-500 shadow-xs' : 'bg-white/60 border-slate-200 hover:bg-white'}`}>
                      <label htmlFor="visibility-private" className="flex items-start space-x-3 cursor-pointer">
                        <input
                          id="visibility-private"
                          type="radio"
                          name="visibility"
                          value="PRIVATE"
                          checked={formData.visibility === 'PRIVATE'}
                          onChange={handleChange}
                          className="mt-0.5 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                            <span>1. Riêng tư (Bảo mật nội bộ)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Chỉ chuyên viên điều phối Chuỗi Cung Ứng tiếp cận để hỗ trợ tìm nguồn kín và bảo mật hoàn toàn.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Option 2: Chỉ NCC phù hợp (Mặc định) */}
                    <div className={`p-3.5 rounded-xl border-2 transition ${formData.visibility === 'ONLY_MATCHED' ? 'bg-white border-[#0052cc] shadow-md ring-2 ring-blue-100' : 'bg-white/60 border-slate-200 hover:bg-white'}`}>
                      <label htmlFor="visibility-only-matched" className="flex items-start space-x-3 cursor-pointer">
                        <input
                          id="visibility-only-matched"
                          type="radio"
                          name="visibility"
                          value="ONLY_MATCHED"
                          checked={formData.visibility === 'ONLY_MATCHED'}
                          onChange={handleChange}
                          className="mt-0.5 text-[#0052cc] focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-black text-slate-900 text-xs sm:text-[13px] flex items-center gap-1.5 text-[#0052cc]">
                              <Users className="w-3.5 h-3.5 text-[#0052cc]" />
                              <span>2. Chỉ NCC phù hợp (Khuyến nghị cho Nhà máy & Thu mua)</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">
                              Khuyên dùng
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Hồ sơ thông số chỉ được chuyển đến các nhà cung ứng đã xác thực KYC và đạt chứng chỉ năng lực sản xuất phù hợp.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Option 3: Đăng trên Sàn Nhu Cầu */}
                    <div className={`p-3.5 rounded-xl border transition ${formData.visibility === 'PUBLIC' ? 'bg-white border-blue-500 shadow-xs' : 'bg-white/60 border-slate-200 hover:bg-white'}`}>
                      <label htmlFor="visibility-public" className="flex items-start space-x-3 cursor-pointer">
                        <input
                          id="visibility-public"
                          type="radio"
                          name="visibility"
                          value="PUBLIC"
                          checked={formData.visibility === 'PUBLIC'}
                          onChange={handleChange}
                          className="mt-0.5 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-600" />
                            <span>3. Đăng công khai trên Sàn Nhu Cầu B2B</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Hiển thị công khai trên Sàn Nhu Cầu B2B (ẩn thông tin liên hệ nhạy cảm để phòng ngừa spam chào thầu rác).
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại chỉnh sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-600 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      title="Lưu bản nháp"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu nháp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPublish}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#0052cc] via-blue-600 to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>XÁC NHẬN & BẮT ĐẦU TÌM NGUỒN</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: HOÀN TẤT & KHỞI ĐỘNG TÌM NGUỒN THÀNH CÔNG */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase font-mono tracking-wider">
                    ĐÃ TIẾP NHẬN HỒ SƠ THÀNH CÔNG
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                    Đã xác nhận & Khởi động tìm nguồn
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Hệ thống điều phối Chuỗi Cung Ứng đã tiếp nhận nhu cầu #{formData.id}. Hồ sơ đã sẵn sàng kết nối bảo mật với mạng lưới nhà cung ứng đạt chuẩn.
                  </p>
                </div>

                {/* Result Card Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">{formData.title}</div>
                  <div className="text-slate-600">
                    <strong>Phạm vi chia sẻ:</strong> {formData.visibility === 'ONLY_MATCHED' ? 'Chỉ NCC phù hợp (Mặc định)' : (formData.visibility === 'PRIVATE' ? 'Riêng tư' : 'Đăng trên Sàn Nhu Cầu')}
                  </div>
                  <div className="text-slate-600">
                    <strong>Địa điểm:</strong> {formData.kcn}, {formData.location}
                  </div>
                  <div className="text-slate-600">
                    <strong>Trạng thái:</strong> <span className="text-emerald-700 font-bold uppercase font-mono">ACTIVE_SOURCING</span>
                  </div>
                </div>

                {/* Pre-matched Suppliers preview */}
                <div className="pt-2 max-w-lg mx-auto space-y-2 text-left">
                  <div className="text-xs font-bold text-slate-700 font-heading uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#0052cc]" />
                    <span>3 Nhà cung ứng sơ bộ đạt chuẩn năng lực khớp lệnh:</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Công ty Cổ phần May Mặc Đông Nam', loc: 'KCN Amata, Đồng Nai', match: '98%', kyc: 'KYC Kim Cương' },
                      { name: 'Công ty TNHH Dệt May Công Nghiệp Sài Gòn', loc: 'KCN Biên Hòa 2, Đồng Nai', match: '95%', kyc: 'KYC Vàng' },
                      { name: 'Tổng Công ty Sản Xuất & May Mặc Việt Thắng', loc: 'TP. Biên Hòa, Đồng Nai', match: '92%', kyc: 'KYC Kim Cương' }
                    ].map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-500">{s.loc} · <span className="text-[#0052cc] font-semibold">{s.kyc}</span></div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10.5px]">
                          Khớp {s.match}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation CTA Buttons */}
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/san-nhu-cau"
                    className="px-6 py-3 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold transition font-heading uppercase shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Xem trên Sàn Nhu Cầu B2B</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({
                        ...defaultAiDraft,
                        id: 'REQ-' + Math.floor(100000 + Math.random() * 900000)
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition font-heading uppercase cursor-pointer"
                  >
                    Đăng thêm nhu cầu mới
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Assistant Status & Related Links Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Suppi Assistant Status Card */}
            <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-sm space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src="/mascots/SUPPI_2.png"
                  alt="Trợ lý SUPPI"
                  className="w-12 h-12 object-contain rounded-2xl bg-blue-50 p-1 border border-blue-100"
                />
                <div>
                  <div className="font-black text-sm text-slate-900 font-heading">TRỢ LÝ SUPPI</div>
                  <div className="text-[11px] text-blue-700 font-semibold">Trinh sát Nguồn cung B2B</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 text-slate-700">
                <div className="font-bold text-slate-900 text-xs">
                  Trạng thái hồ sơ: {completeness >= 80 ? '✓ Đã sẵn sàng phát hành' : 'Đang được hoàn thiện'}
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  Hệ thống tự động đối soát thông số kỹ thuật với dữ liệu nhà máy và KCN tại Việt Nam. Không phát hành ra bên ngoài nếu bạn chưa bấm xác nhận.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSuppiAssistModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-blue-200 text-[#0052cc] font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Mẫu đặc tả ngành chuẩn hóa</span>
              </button>
            </div>

            {/* Procurement Checklist Status */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3.5 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                TIÊU CHÍ CHUẨN HÓA HỒ SƠ
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Sản phẩm / dịch vụ', ok: isFilled(formData.productService) },
                  { label: 'Số lượng & Đơn vị', ok: isFilled(formData.quantity) && isFilled(formData.unit) },
                  { label: 'Địa điểm / KCN', ok: isFilled(formData.location) && isFilled(formData.kcn) },
                  { label: 'Thời gian cần', ok: isFilled(formData.deadline) },
                  { label: 'Tiêu chí kỹ thuật (quy cách)', ok: isFilled(formData.specifications) },
                  { label: 'Ngân sách dự kiến', ok: isFilled(formData.budgetMin) || isFilled(formData.budgetMax) },
                  { label: 'Yêu cầu mẫu thử', ok: true },
                  { label: 'Yêu cầu khảo sát', ok: true },
                  { label: 'Chứng chỉ / tiêu chuẩn', ok: isFilled(formData.certificationRequirements) },
                  { label: 'File / bản vẽ đính kèm', ok: attachedFiles.length > 0 },
                  { label: 'Người liên hệ', ok: isFilled(formData.contactName) && isFilled(formData.phone) },
                  { label: 'Phạm vi chia sẻ (Bảo mật)', ok: isFilled(formData.visibility) }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      <span>{item.label}</span>
                    </span>
                    <span className={`font-mono text-[11px] font-bold ${item.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {item.ok ? '✓' : 'Cần điền'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Links có căn cứ */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                LIÊN KẾT LIÊN QUAN & TRA CỨU
              </h3>
              <div className="space-y-2.5">
                <Link
                  to="/san-nhu-cau"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#0052cc]">Sàn nhu cầu B2B</div>
                    <div className="text-[11px] text-slate-500">Tra cứu các gói mua sắm đang mở thầu</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/ban-do-kcn"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#0052cc]">Bản đồ 480+ KCN Việt Nam</div>
                    <div className="text-[11px] text-slate-500">Định vị nhà máy & đối tác theo vùng công nghiệp</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/he-sinh-thai"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#0052cc]">Hệ sinh thái Chuỗi Cung Ứng</div>
                    <div className="text-[11px] text-slate-500">Mạng lưới nhà cung cấp & dịch vụ phụ trợ</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/6-giai-doan"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-[#0052cc]">Quy trình 6 giai đoạn dự án</div>
                    <div className="text-[11px] text-slate-500">Khung chuẩn hóa quy trình mua sắm công nghiệp</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </div>

            {/* Security & Confidentiality */}
            <div className="bg-amber-50/60 rounded-3xl border border-amber-200/80 p-6 space-y-3 text-xs">
              <h3 className="font-bold text-amber-900 flex items-center font-heading">
                <Shield className="w-4 h-4 mr-1 text-amber-600" />
                Bảo mật & Quyền riêng tư
              </h3>
              <ul className="space-y-1.5 text-amber-800 text-[11px]">
                <li>• Không tự ý publish công khai khi chưa được bạn duyệt.</li>
                <li>• Quyền chia sẻ mặc định: <strong>Chỉ NCC phù hợp</strong>.</li>
                <li>• Số điện thoại & email được bảo vệ chống spam tiếp thị rác.</li>
              </ul>
            </div>

            {/* Support Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                HỖ TRỢ BỘ PHẬN THU MUA
              </h3>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Hotline: <strong className="text-slate-900 font-mono">1900 8686</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-mono">hotro@chuoicungung.com</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: MẪU ĐẶC TẢ NGÀNH SẴN CÓ CHO THU MUA */}
      {/* ======================================================== */}
      {showSuppiAssistModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#0052cc] flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    MẪU ĐẶC TẢ KỸ THUẬT TIÊU CHUẨN
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chọn nhanh mẫu tiêu chuẩn ngành để tự động điền các thông số kỹ thuật:
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSuppiAssistModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Đóng modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {INDUSTRY_PRESETS.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer space-y-2"
                  onClick={() => applyPreset(p)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-heading">{p.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0052cc] font-mono text-[10.5px] font-bold">
                      {p.qty} {p.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {p.specs}
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Chứng chỉ: <strong className="text-slate-700">{p.certs}</strong></span>
                    <span className="text-[#0052cc] font-bold">Áp dụng mẫu này →</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 text-[11px]">
                Cần thêm tư vấn chuyên sâu từ trợ lý AI?
              </span>
              <Link
                to={`/tro-ly-ai?draft=${formData.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-1.5 shadow-sm hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Trò chuyện cùng SUPPI</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
