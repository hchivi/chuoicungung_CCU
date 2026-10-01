// ============================================================================
// PAGE 18: FOUNDING PARTNER
// ROUTE: /founding-partner
// Triển khai chuẩn hóa theo đặc tả 18.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Crown, Shield, Sparkles, CheckCircle2, ArrowRight, Building2,
  FileText, Check, Search, Filter, MapPin, Eye, PhoneCall, Send,
  X, Layers, ChevronRight, ArrowUpRight, Zap, Factory, CheckCircle,
  Lock, ShieldCheck, RotateCcw, SlidersHorizontal, ArrowLeftRight,
  AlertTriangle, Video, Download, HelpCircle, AlertCircle, Info,
  ExternalLink, Calendar, Users, Briefcase, Award, FolderTree, Key
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getAllFoundingPartnerships,
  submitFoundingPartnershipInquiry,
  checkScopeConflict,
  ENTITLEMENT_TYPES,
  PARTNERSHIP_STATUSES
} from '../data/foundingPartnershipData';
import { CURATED_CATEGORIES } from '../data/categoryHubData';
import { KEYWORD_CLUSTERS } from '../data/keywordClustersData';

export default function FoundingPartnerPage() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const howItWorksRef = useRef(null);
  const scopeRef = useRef(null);

  // SEO & Head title (Section 28)
  useEffect(() => {
    document.title = "Founding Partner | Đồng Hành Chuyên Mục | CHUOICUNGUNG.COM";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Đồng hành phát triển chuyên mục và cụm nhu cầu phù hợp với năng lực doanh nghiệp thông qua phạm vi hiển thị, nội dung, video, catalogue và chương trình được thống nhất rõ.'
      );
    }
  }, []);

  // Preload query parameters if coming from category or keyword page
  const initialCategoryParam = searchParams.get('category') || searchParams.get('cat') || '';
  const initialClusterParam = searchParams.get('cluster') || searchParams.get('kw') || '';

  // --------------------------------------------------------------------------
  // 1. SCOPE CONFIGURATOR STATE (Section 4 & 5)
  // --------------------------------------------------------------------------
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategoryParam || 'dong-phuc-bao-ho');
  const [selectedClusterId, setSelectedClusterId] = useState(initialClusterParam || 'cluster-dong-phuc-cong-nhan');
  const [selectedLocation, setSelectedLocation] = useState('Đồng Nai & TP.HCM');
  const [selectedKcn, setSelectedKcn] = useState('KCN Amata Đồng Nai');
  const [selectedPeriod, setSelectedPeriod] = useState('12_MONTHS');
  const [selectedPosition, setSelectedPosition] = useState('TOP_CATEGORY_SPONSORED_BLOCK');
  const [selectedServices, setSelectedServices] = useState([
    'FEATURED_SPONSORED_BLOCK',
    'CAPABILITY_PROFILE_SHOWCASE',
    'VIDEO_SHOWCASE',
    'CATALOGUE_INCLUSION'
  ]);

  // Available clusters based on selected category
  const availableClusters = useMemo(() => {
    if (!selectedCategorySlug) return KEYWORD_CLUSTERS;
    // Map curated category to cluster group
    if (selectedCategorySlug.includes('dong-phuc')) {
      return KEYWORD_CLUSTERS.filter(c => c.id.includes('dong-phuc') || c.categorySlug?.includes('dong-phuc'));
    }
    if (selectedCategorySlug.includes('hop-qua') || selectedCategorySlug.includes('qua-tang')) {
      return KEYWORD_CLUSTERS.filter(c => c.id.includes('hop-qua') || c.categorySlug?.includes('qua-tang'));
    }
    if (selectedCategorySlug.includes('co-khi')) {
      return KEYWORD_CLUSTERS.filter(c => c.id.includes('co-khi') || c.categorySlug?.includes('co-khi'));
    }
    return KEYWORD_CLUSTERS;
  }, [selectedCategorySlug]);

  const currentCategoryObj = useMemo(() => {
    return CURATED_CATEGORIES.find(c => c.slug === selectedCategorySlug || c.id === selectedCategorySlug) || CURATED_CATEGORIES[0];
  }, [selectedCategorySlug]);

  const currentClusterObj = useMemo(() => {
    return availableClusters.find(c => c.id === selectedClusterId) || availableClusters[0] || KEYWORD_CLUSTERS[0];
  }, [availableClusters, selectedClusterId]);

  // --------------------------------------------------------------------------
  // 2. FORM STATE (Section 12: REQUEST FORM)
  // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    website: '',
    contactName: '',
    roleTitle: '',
    contactEmail: '',
    contactPhone: '',
    categorySlug: selectedCategorySlug,
    categoryName: currentCategoryObj?.name || 'Đồng Phục & Bảo Hộ Lao Động (PPE)',
    clusterId: selectedClusterId,
    clusterName: currentClusterObj?.clusterName || currentClusterObj?.canonicalKeyword || 'Đồng phục công nhân nhà máy',
    location: selectedLocation,
    kcn: selectedKcn,
    expectedDuration: selectedPeriod,
    displayPosition: selectedPosition,
    objective: '',
    budget: 'Theo phạm vi đề xuất',
    consent: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync configurator to form fields
  const handleApplyScopeToForm = () => {
    setFormData(prev => ({
      ...prev,
      categorySlug: selectedCategorySlug,
      categoryName: currentCategoryObj?.name || '',
      clusterId: selectedClusterId,
      clusterName: currentClusterObj?.clusterName || currentClusterObj?.canonicalKeyword || '',
      location: selectedLocation,
      kcn: selectedKcn,
      expectedDuration: selectedPeriod,
      displayPosition: selectedPosition
    }));
    // Scroll smoothly to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleToggleService = (srvKey) => {
    if (selectedServices.includes(srvKey)) {
      setSelectedServices(selectedServices.filter(s => s !== srvKey));
    } else {
      setSelectedServices([...selectedServices, srvKey]);
    }
  };

  // Form submit handler - STRICT: ONLY CREATES INQUIRY, NEVER ACTIVE (Section 11 & 13)
  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactName.trim() || !formData.contactPhone.trim() || !formData.contactEmail.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin liên hệ bắt buộc (*).");
      return;
    }
    if (!formData.consent) {
      alert("Vui lòng xác nhận đồng ý với nguyên tắc minh bạch thương mại của gói Founding Partner.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = submitFoundingPartnershipInquiry({
        companyName: formData.companyName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        roleTitle: formData.roleTitle,
        categoryId: formData.categorySlug,
        categoryName: formData.categoryName,
        keywordClusterId: formData.clusterId,
        keywordClusterName: formData.clusterName,
        locationName: formData.location,
        industrialParkName: formData.kcn,
        expectedDuration: formData.expectedDuration,
        displayPosition: formData.displayPosition,
        servicesInterested: selectedServices,
        objective: formData.objective,
        budget: formData.budget,
        consentToContact: true
      });

      setSubmissionResult(res);
      setFormSubmitted(true);
      setIsSubmitting(false);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  };

  // --------------------------------------------------------------------------
  // 3. ACTIVE PARTNERS SHOWCASE DATA (Section 20 & 21)
  // --------------------------------------------------------------------------
  const allPartners = useMemo(() => {
    return getAllFoundingPartnerships();
  }, [formSubmitted]);

  const activePartners = useMemo(() => {
    return allPartners.filter(p => p.status === 'ACTIVE');
  }, [allPartners]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (Exact Spec Section 2) */}
      {/* ==================================================================== */}
      <section className="relative bg-slate-950 text-white pt-10 pb-16 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center">
          
          {/* Breadcrumb & Commercial Tag */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-white transition flex items-center space-x-1">
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">Founding Partner</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-wide">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>GÓI THƯƠNG MẠI ĐỒNG HÀNH CHUYÊN MỤC B2B MINH BẠCH</span>
          </div>

          {/* Exact H1 */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-snug">
            ĐỒNG HÀNH PHÁT TRIỂN CHUYÊN MỤC PHÙ HỢP VỚI NĂNG LỰC DOANH NGHIỆP
          </h1>

          {/* Exact Sub */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Gói Founding Partner dành cho đối tác tiên phong tài trợ một phạm vi chuyên mục được xác định rõ. Quyền lợi có thể gồm khối giới thiệu nổi bật, nội dung doanh nghiệp, video, catalogue và báo cáo theo thỏa thuận.
          </p>

          {/* Exact CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm font-heading uppercase tracking-wide shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>TRAO ĐỔI PHẠM VI ĐỒNG HÀNH</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs sm:text-sm font-heading transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>XEM CÁCH FOUNDING PARTNER HOẠT ĐỘNG</span>
            </button>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <div className="text-amber-400 font-mono text-xs font-bold">01. Minh Bạch</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Nhãn "ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC" rõ ràng</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <div className="text-amber-400 font-mono text-xs font-bold">02. Không Bán Lead</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Không che search, không can thiệp matching</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <div className="text-amber-400 font-mono text-xs font-bold">03. Cụm Ý Định</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Quy chuẩn theo Keyword Cluster, không bán từ khóa lẻ</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <div className="text-amber-400 font-mono text-xs font-bold">04. Deliverable Thật</div>
              <div className="text-slate-300 text-[11px] mt-0.5">Bàn giao có URL, Video, Catalogue & Báo cáo</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-10">

        {/* ==================================================================== */}
        {/* 2. GIẢI THÍCH FOUNDING PARTNER (Section 3) */}
        {/* ==================================================================== */}
        <section ref={howItWorksRef} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>ĐỊNH NGHĨA CHUẨN MỰC THƯƠNG MẠI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              FOUNDING PARTNER LÀ GÌ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 max-w-3xl">
              <strong>Founding Partner</strong> là đối tác tài trợ phát triển một phạm vi chuyên mục hoặc cụm nhu cầu cụ thể trên <strong>CHUOICUNGUNG.COM</strong>. Thay vì quảng cáo ngẫu nhiên, doanh nghiệp đồng hành cùng hệ thống kiến tạo nội dung chuẩn hóa, hồ sơ năng lực xưởng 360°, video dây chuyền và cẩm nang kỹ thuật giúp Buyer FDI tìm nguồn cung nhanh chóng và chuẩn xác.
            </p>
          </div>

          {/* Phạm vi xác định 6 thành phần */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-heading uppercase text-slate-500 tracking-wider">
              Một Phạm Vi Đồng Hành Chuẩn Gồm 6 Thành Phần Cụ Thể:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs font-mono">1</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Ngành / Category</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Ví dụ: Đồng phục & Bảo hộ lao động (PPE), Hộp quà tặng & Nông sản, Cơ khí CNC...</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs font-mono">2</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Keyword Cluster / Buyer Intent</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Cụm ý định tìm kiếm thống nhất, gồm từ khóa chính và các từ khóa đồng nghĩa (synonyms).</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">3</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Địa Bàn & KCN (Optional)</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Phạm vi địa lý (Đồng Nai, Bắc Ninh, Bình Dương...) hoặc cụm Khu công nghiệp trọng điểm.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs font-mono">4</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Thời Hạn Thỏa Thuận</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Thời gian hiệu lực rõ ràng (6 tháng, 12 tháng...). Khi hết hạn sẽ tự động dừng paid placement.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs font-mono">5</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Vị Trí Hiển Thị</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Khối đầu trang chuyên mục với nhãn bắt buộc "ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC".</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs font-mono">6</div>
                <h5 className="text-xs font-bold text-slate-900 font-heading">Quyền Lợi Theo Hợp Đồng</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">Được liệt kê thành từng deliverable chi tiết (video, catalogue, profile, bài viết, báo cáo).</p>
              </div>
            </div>
          </div>

          {/* Exact Note box (Section 3 Spec) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-950 space-y-1 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-heading uppercase block text-amber-900">Lưu ý pháp lý và thương mại:</strong>
              “Founding Partner là gói thương mại. Việc tham gia không tạo quyền sở hữu CHUOICUNGUNG.COM và không đồng nghĩa với bảo trợ hoặc chứng nhận năng lực.”
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. CHỌN PHẠM VI ĐỒNG HÀNH & KEYWORD CLUSTER RULE (Section 4 & 5) */}
        {/* ==================================================================== */}
        <section ref={scopeRef} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>BỘ CẤU HÌNH TRỰC QUAN</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                CHỌN PHẠM VI ĐỒNG HÀNH
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tự định hình phạm vi chuyên mục phù hợp với năng lực sản xuất thực tế trước khi gửi đề xuất.
              </p>
            </div>

            <button
              onClick={handleApplyScopeToForm}
              className="px-4 py-2 bg-[#0052cc] hover:bg-blue-800 text-white rounded-xl text-xs font-bold font-heading uppercase transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start md:self-auto shrink-0"
            >
              <span>Áp dụng vào mẫu đề xuất</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Scope Form (Col 7) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Ngành hàng / Chuyên mục (Category):</span>
                </label>
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => {
                    setSelectedCategorySlug(e.target.value);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                >
                  {CURATED_CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.phaseName || 'Giai đoạn chuỗi cung ứng'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Cluster Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Cụm ý định tìm kiếm (Keyword Cluster / Intent):</span>
                </label>
                <select
                  value={selectedClusterId}
                  onChange={(e) => setSelectedClusterId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                >
                  {availableClusters.map(cl => (
                    <option key={cl.id} value={cl.id}>
                      {cl.clusterName || cl.canonicalKeyword} (Gồm các từ khóa đồng nghĩa: {cl.synonyms?.slice(0, 2).join(', ')}...)
                    </option>
                  ))}
                </select>
              </div>

              {/* Location & KCN Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Địa bàn ưu tiên (Optional):</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                  >
                    <option value="Toàn quốc">Toàn quốc (Không giới hạn địa bàn)</option>
                    <option value="Đồng Nai & TP.HCM">Đồng Nai & TP.HCM</option>
                    <option value="Bắc Ninh & Hà Nội">Bắc Ninh & Hà Nội</option>
                    <option value="Bình Dương">Bình Dương & Vùng phụ cận</option>
                    <option value="Hải Phòng & Quảng Ninh">Hải Phòng & Vùng Duyên Hải</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Factory className="w-3.5 h-3.5 text-slate-600" />
                    <span>4. Khu công nghiệp (Optional):</span>
                  </label>
                  <input
                    type="text"
                    value={selectedKcn}
                    onChange={(e) => setSelectedKcn(e.target.value)}
                    placeholder="VD: KCN Amata, VSIP Bắc Ninh..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                  />
                </div>
              </div>

              {/* Period & Display Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>5. Thời hạn dự kiến:</span>
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                  >
                    <option value="6_MONTHS">6 Tháng (Thử nghiệm & Đo lường)</option>
                    <option value="12_MONTHS">12 Tháng (Đồng hành chu kỳ 1 năm)</option>
                    <option value="24_MONTHS">24 Tháng (Chiến lược dài hạn)</option>
                    <option value="CUSTOM">Thỏa thuận theo đề xuất dự án</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-600" />
                    <span>6. Vị trí hiển thị quan tâm:</span>
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#0052cc] outline-none"
                  >
                    <option value="TOP_CATEGORY_SPONSORED_BLOCK">Đầu trang chuyên mục (Top Sponsored Block)</option>
                    <option value="TOP_KEYWORD_SPONSORED_BLOCK">Đầu cụm từ khóa tìm kiếm (Top Keyword Block)</option>
                    <option value="CATEGORY_SIDEBAR_SPONSOR">Cột nội dung đồng hành (Sidebar Sponsored)</option>
                  </select>
                </div>
              </div>

              {/* Entitlement Services Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block">
                  7. Các dịch vụ & quyền lợi quan tâm (Mỗi hợp đồng quyết định thực tế):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(ENTITLEMENT_TYPES).map(ent => (
                    <label
                      key={ent.id}
                      className={`p-2.5 rounded-xl border flex items-start space-x-2 cursor-pointer transition select-none ${
                        selectedServices.includes(ent.id)
                          ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(ent.id)}
                        onChange={() => handleToggleService(ent.id)}
                        className="w-3.5 h-3.5 text-blue-600 rounded mt-0.5"
                      />
                      <div className="leading-tight">
                        <span className="font-bold text-[11px] block">{ent.shortName}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{ent.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Scope Preview & Keyword Cluster Rule Box (Col 5) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Scope Preview Card */}
              <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      XEM TRƯỚC PHẠM VI ĐÃ CHỌN
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Sẵn sàng đề xuất
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Chuyên mục:</span>
                    <strong className="text-white font-bold">{currentCategoryObj?.name}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Cụm ý định:</span>
                    <strong className="text-amber-300 font-bold">{currentClusterObj?.clusterName || currentClusterObj?.canonicalKeyword}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Địa bàn:</span>
                      <span className="text-slate-200">{selectedLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Thời hạn:</span>
                      <span className="text-slate-200">
                        {selectedPeriod === '6_MONTHS' ? '6 tháng' : selectedPeriod === '12_MONTHS' ? '12 tháng' : 'Theo dự án'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-mono block mb-1">Quyền lợi quan tâm:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedServices.map(sid => (
                        <span key={sid} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {ENTITLEMENT_TYPES[sid]?.shortName || sid}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyScopeToForm}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-heading uppercase transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <span>Chuyển sang mẫu đề xuất</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exact Section 5: KEYWORD CLUSTER RULE Box */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-xs font-heading text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>QUY TẮC BẮT BUỘC: KEYWORD CLUSTER RULE</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Ví dụ: <em>“đồng phục công nhân”</em>, <em>“áo công nhân nhà máy”</em>, <em>“đồng phục nhà xưởng”</em> nếu cùng chung <strong>Buyer Intent</strong> thì bắt buộc quy về <strong>cùng một Keyword Cluster</strong>.
                </p>
                <div className="p-2 rounded-xl bg-white/80 border border-blue-200 text-[10.5px] font-mono text-slate-800">
                  ⚠️ <strong>Chính sách minh bạch:</strong> Không bán 3 quyền Founding Partner riêng rẽ chỉ vì có 3 URL hoặc từ khóa gần giống nhau.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 4. QUYỀN LỢI CÓ THỂ CÓ (01 ĐẾN 07 MODULES - Section 6) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>DANH MỤC ENTITLEMENTS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              QUYỀN LỢI CÓ THỂ CÓ
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hiển thị dạng module tiêu chuẩn. <strong>KHÔNG cam kết mặc định tất cả</strong> — Mỗi hợp đồng sẽ quyết định phạm vi entitlement thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                title: "KHỐI GIỚI THIỆU NỔI BẬT",
                desc: "Vị trí nhận diện trang trọng đầu trang ngành hoặc cụm từ khóa tương ứng, luôn gắn nhãn bắt buộc 'ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC'.",
                deliverable: "URL chuyên mục & ảnh chụp placement"
              },
              {
                num: "02",
                title: "HỒ SƠ NĂNG LỰC / PRODUCT SERVICE",
                desc: "Chuẩn hóa hồ sơ năng lực 360° giới thiệu xưởng, dây chuyền máy móc, chứng chỉ ISO/FDI và quy cách sản phẩm dịch vụ.",
                deliverable: "Trang hồ sơ năng lực doanh nghiệp"
              },
              {
                num: "03",
                title: "VIDEO GIỚI THIỆU",
                desc: "Nhúng khung video phóng sự trực quan về xưởng may, xưởng cơ khí hoặc dây chuyền đóng gói giúp Buyer xác thực nhanh.",
                deliverable: "Video YouTube 4K nhúng trực tiếp"
              },
              {
                num: "04",
                title: "CATALOGUE KỸ THUẬT SỐ",
                desc: "Đính kèm E-Catalogue hoặc tài liệu giới thiệu giải pháp kỹ thuật dạng PDF cho phép Buyer tải về nghiên cứu.",
                deliverable: "File PDF Catalogue kiểm duyệt"
              },
              {
                num: "05",
                title: "NỘI DUNG CHUYÊN MỤC",
                desc: "Đồng hành xây dựng cẩm nang tiêu chuẩn kỹ thuật, kinh nghiệm nghiệm thu và hướng dẫn mua hàng cho Buyer.",
                deliverable: "Bài viết chuyên sâu chuẩn Buyer Guide"
              },
              {
                num: "06",
                title: "HIỆN DIỆN TRONG CHƯƠNG TRÌNH",
                desc: "Tham gia kết nối giao thương 1-1 tại ngày hội chuỗi cung ứng hoặc sự kiện B2B ngành nếu trong hợp đồng có thỏa thuận.",
                deliverable: "Biên bản tham gia & kỷ yếu chương trình"
              },
              {
                num: "07",
                title: "BÁO CÁO QUYỀN LỢI",
                desc: "Báo cáo minh bạch về các hạng mục đã hoàn thành, số liệu hiển thị thực tế (không dùng số liệu ảo) và phản hồi chuyên mục.",
                deliverable: "File Báo cáo định kỳ Quý/Năm"
              }
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-blue-300 transition"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-black flex items-center justify-center text-xs shadow-xs">
                    {m.num}
                  </div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 font-heading">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-[10px] font-mono text-slate-500">
                  <span className="text-slate-400">Minh chứng: </span>
                  <span className="text-blue-700 font-bold">{m.deliverable}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 italic">
            * Lưu ý: Mỗi hợp đồng tài trợ cụ thể sẽ xác định chi tiết số lượng, tiến độ và tiêu chí nghiệm thu từng deliverable.
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. LABEL BẮT BUỘC & MINH HỌA MINH BẠCH (Section 7) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>TIÊU CHUẨN GIAO DIỆN CÔNG KHAI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              LABEL BẮT BUỘC TRÊN CHUYÊN MỤC CÔNG CỘNG
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Khi xuất hiện trên <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">/nganh-nghe/[slug]</code> hoặc <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">/tu-khoa/[slug]</code>, khối tài trợ luôn có nhãn minh bạch rõ ràng.
            </p>
          </div>

          {/* Visual Comparison Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Khối Tài Trợ Chuyên Mục (Có Label) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-xs">
                  ★ ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Thời hạn: 01/2026 - 12/2026
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 font-heading">
                  Chuyên Gia Đồng Phục - Công Ty TNHH Proser
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Đồng hành tài trợ chuyên mục <strong>Đồng phục công nhân nhà máy</strong> tại Đồng Nai & TP.HCM.
                </p>
              </div>
              <div className="text-[11px] text-blue-700 flex items-center space-x-1 font-medium">
                <Info className="w-3 h-3 text-blue-600" />
                <Link to="/founding-partner" className="hover:underline">
                  Tìm hiểu về chính sách Founding Partner →
                </Link>
              </div>
            </div>

            {/* Box 2: Kết Quả Tìm Kiếm Tự Nhiên (Organic Search) */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md">
                  KẾT QUẢ TÌM KIẾM TỰ NHIÊN (ORGANIC)
                </span>
                <span className="text-[10px] font-mono text-emerald-700">
                  Xếp hạng theo năng lực & KYC
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 font-heading">
                  Nhà Cung Cấp Đã Thẩm Định KYC 3 Lớp
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Kết quả sắp xếp 100% trung lập theo tiêu chí kỹ thuật, số lượng máy, chứng chỉ và đánh giá của Buyer.
                </p>
              </div>
              <div className="text-[11px] text-slate-500">
                Founding Partner <strong>không được can thiệp</strong> thứ tự hoặc thay thế kết quả tìm kiếm tự nhiên.
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 6. FOUNDING PARTNER KHÔNG ĐƯỢC LÀM GÌ (10 HARD RULES - Section 8) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md mb-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>10 NGUYÊN TẮC GIỚI HẠN BẮT BUỘC</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              FOUNDING PARTNER KHÔNG ĐƯỢC LÀM GÌ?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống bảo vệ tính trung lập tuyệt đối của sàn giao dịch chuỗi cung ứng quốc gia theo các điều khoản sau:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { rule: "01. KHÔNG thay thế bộ lọc/tìm kiếm", desc: "Không làm sai lệch hoặc vô hiệu hóa bộ lọc kỹ thuật của Buyer." },
              { rule: "02. KHÔNG che khuất kết quả tìm kiếm", desc: "Không dùng pop-up, banner che lấp màn hình làm gián đoạn trải nghiệm." },
              { rule: "03. KHÔNG tự động đứng #1 Organic Search", desc: "Kết quả tự nhiên sắp xếp độc lập, đối tác chỉ đứng ở khối tài trợ được phân định." },
              { rule: "04. KHÔNG tăng Matching Score", desc: "SupplierMatchingService tuyệt đối không dùng số tiền tài trợ làm yếu tố chấm điểm." },
              { rule: "05. KHÔNG nhận toàn bộ Buyer Lead", desc: "Mọi Buyer có quyền chọn gửi RFQ cho bất kỳ nhà cung ứng phù hợp nào." },
              { rule: "06. KHÔNG xem dữ liệu Buyer Private", desc: "Thông tin liên hệ bảo mật, file dự toán riêng tư của Buyer không được chia sẻ trái phép." },
              { rule: "07. KHÔNG tự biến thành Verified Supplier", desc: "Vẫn phải trải qua quy trình xác thực MST, năng lực xưởng như mọi doanh nghiệp." },
              { rule: "08. KHÔNG tự thành Recommended Supplier", desc: "Nhãn gợi ý chỉ cấp khi đạt điểm tín nhiệm vận hành và kiểm tra thực địa." },
              { rule: "09. KHÔNG độc quyền kết quả / ngăn NCC khác", desc: "Không ngăn cản các nhà sản xuất cùng ngành hiển thị trên sàn." },
              { rule: "10. KHÔNG tạo quyền cổ đông / vốn đầu tư", desc: "Founding Partner là gói thương mại, không tạo quyền sở hữu hay can thiệp quản trị." }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start space-x-3"
              >
                <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✕
                </div>
                <div>
                  <h4 className="text-xs font-bold font-heading text-rose-950">
                    {item.rule}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-[11px] text-amber-300">
              ⚡ SupplierMatchingService: 100% Thuật toán trung lập khách quan
            </span>
            <span className="text-[10px] text-slate-400">
              Cam kết tuân thủ quy chuẩn dữ liệu B2B quốc gia
            </span>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 7. QUY TRÌNH HỢP TÁC 7 BƯỚC (Section 13) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>TIẾN TRÌNH MINH BẠCH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              QUY TRÌNH HỢP TÁC TỪ ĐỀ XUẤT ĐẾN KÍCH HOẠT
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gửi đề xuất chỉ tạo <strong>INQUIRY</strong> — Không bao giờ tự động kích hoạt thành Active Partnership khi chưa qua kiểm tra xung đột và hợp đồng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 text-xs">
            {[
              { step: "01", title: "Doanh Nghiệp", desc: "Tìm hiểu mô hình và định hình mục tiêu tài trợ" },
              { step: "02", title: "Chọn Phạm Vi", desc: "Xác định Category + Cluster + Địa bàn + Thời hạn" },
              { step: "03", title: "Gửi Đề Xuất", desc: "Submit form (Tạo mã INQUIRY duy nhất)" },
              { step: "04", title: "Review & Check", desc: "Kiểm tra xung đột phạm vi (Scope Conflict Check)" },
              { step: "05", title: "Quyền Lợi & Proposal", desc: "Thống nhất các deliverable cụ thể" },
              { step: "06", title: "Ký Hợp Đồng", desc: "Ký kết hợp đồng thương mại có giá trị pháp lý" },
              { step: "07", title: "Active & Báo Cáo", desc: "Bàn giao quyền lợi, minh chứng & nghiệm thu" }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col justify-between space-y-2 relative"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                    BƯỚC {s.step}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 font-heading mt-0.5">
                    {s.title}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 8. ACTIVE FOUNDING PARTNERS SHOWCASE (Section 20 & 21) */}
        {/* ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>ĐỐI TÁC TIÊN PHONG</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
                CÁC FOUNDING PARTNER ĐANG ĐỒNG HÀNH
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Các doanh nghiệp đang tài trợ phát triển chuyên mục và cụm ý định tìm kiếm
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Đang hoạt động: <strong className="text-emerald-700 font-bold">{activePartners.length}</strong> chuyên mục
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePartners.map(partner => (
              <div
                key={partner.id}
                className="rounded-3xl p-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 space-y-4 shadow-sm"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md shadow-2xs">
                    ★ ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Hiệu lực: {partner.startDate} → {partner.endDate}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-base text-slate-900 font-heading">
                    {partner.partnerName}
                  </h3>
                  <div className="text-xs text-blue-700 font-bold mt-0.5">
                    {partner.brandTitle}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {partner.slogan}
                  </p>
                </div>

                {/* Scope Details */}
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Chuyên mục:</span>
                    <strong className="text-slate-800 text-right">{partner.categoryName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Cụm ý định:</span>
                    <span className="text-amber-700 font-bold text-right">{partner.keywordClusterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Địa bàn:</span>
                    <span className="text-slate-600 text-right">{partner.locationName}</span>
                  </div>
                </div>

                {/* Core Products / Deliverables */}
                {Array.isArray(partner.coreProducts) && partner.coreProducts.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Sản phẩm tiêu biểu:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.coreProducts.map((p, pIdx) => (
                        <span key={pIdx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <div className="text-xs text-slate-500 flex items-center space-x-1">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{partner.hotline}</span>
                  </div>

                  <Link
                    to={`/nganh-nghe/${partner.categoryId}`}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 font-heading"
                  >
                    <span>Xem Trên Chuyên Mục</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-center space-x-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <strong>Nguyên tắc vận hành nền tảng:</strong> Nếu một chuyên mục không có Founding Partner, trang ngành và từ khóa vẫn hoạt động đầy đủ 100% với Tìm kiếm, Lọc, Nhà cung ứng, SUPPI, Cẩm nang và Catalogue. Founding Partner là đối tác tăng cường, không phải điều kiện bắt buộc để chuyên mục tồn tại.
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 9. REQUEST FORM (Exact Section 12: TRAO ĐỔI PHẠM VI ĐỒNG HÀNH) */}
        {/* ==================================================================== */}
        <section ref={formRef} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-1.5">
              <Send className="w-3.5 h-3.5 text-amber-600" />
              <span>TIẾP NHẬN ĐỀ XUẤT HỢP TÁC</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
              TRAO ĐỔI PHẠM VI ĐỒNG HÀNH
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gửi thông tin đề xuất tài trợ chuyên mục. Ban Điều Phối sẽ kiểm tra xung đột phạm vi và gửi bản dự thảo Proposal trong vòng 24 giờ.
            </p>
          </div>

          {/* Confirmation Alert after submit */}
          {formSubmitted && submissionResult && (
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <h3 className="text-base font-black font-heading text-emerald-900">
                  Gửi Đề Xuất Thành Công! (Mã Hồ Sơ: {submissionResult.publicCode})
                </h3>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Đề xuất hợp tác của doanh nghiệp đã được ghi nhận với trạng thái <strong>INQUIRY (Tiếp nhận đề xuất)</strong>. Ban Điều Phối sẽ tiến hành kiểm tra xung đột phạm vi (Scope Conflict Check) và gửi phản hồi đến email <strong>{formData.contactEmail}</strong> trong 24 giờ làm việc.
              </p>
              {submissionResult.isConflictWarning && (
                <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs">
                  ⚠️ <strong>Lưu ý nội bộ:</strong> Chuyên mục này hiện đang có đối tác khác đang đàm phán hoặc hoạt động. Ban Điều Phối sẽ tư vấn điều chỉnh thời điểm kích hoạt hoặc mở rộng sang cụm từ khóa phụ cận.
                </div>
              )}
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setSubmissionResult(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold font-heading uppercase transition"
                >
                  Gửi thêm đề xuất khác
                </button>
              </div>
            </div>
          )}

          {/* The Actual Form */}
          {!formSubmitted && (
            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              
              {/* Organization Info */}
              <div className="space-y-3">
                <h4 className="font-bold font-heading text-slate-800 text-xs uppercase tracking-wider text-blue-700">
                  A. THÔNG TIN DOANH NGHIỆP / TỔ CHỨC
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Tên Doanh Nghiệp / Tổ Chức *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="VD: Công Ty Cổ Phần May Mặc Á Châu..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Mã Số Thuế (MST) *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="VD: 0312345678"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Website / Profile Doanh Nghiệp (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#0052cc] outline-none"
                  />
                </div>
              </div>

              {/* Contact Person */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold font-heading text-slate-800 text-xs uppercase tracking-wider text-blue-700">
                  B. THÔNG TIN NGƯỜI ĐẠI DIỆN LIÊN HỆ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Họ và Tên *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Họ tên người liên hệ"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Chức Vụ *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.roleTitle}
                      onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                      placeholder="Giám đốc / Trưởng phòng B2B..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Email Doanh Nghiệp *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="email@company.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      Số Điện Thoại / Zalo *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="090 123 4567"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#0052cc] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Scope Confirmation in Form */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-heading text-slate-800 text-xs uppercase tracking-wider text-blue-700">
                    C. PHẠM VI CHUYÊN MỤC ĐỀ XUẤT ĐỒNG HÀNH
                  </h4>
                  <button
                    type="button"
                    onClick={() => scopeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-[11px] text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Thay đổi bộ chọn</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Chuyên mục:</span>
                    <strong className="text-slate-800 block truncate">{formData.categoryName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Cụm từ khóa:</span>
                    <strong className="text-amber-700 block truncate">{formData.clusterName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Địa bàn & KCN:</span>
                    <span className="text-slate-700 block truncate">{formData.location} ({formData.kcn || 'Chung'})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Thời hạn:</span>
                    <span className="text-slate-700 block font-mono">
                      {formData.expectedDuration === '6_MONTHS' ? '6 tháng' : formData.expectedDuration === '12_MONTHS' ? '12 tháng' : 'Thỏa thuận'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Objectives & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Mục Tiêu Đồng Hành & Mong Muốn Kết Nối
                  </label>
                  <textarea
                    rows="3"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="VD: Tiếp cận các tập đoàn FDI tại KCN Amata, giới thiệu dòng sản phẩm bảo hộ lao động đạt chuẩn xuất khẩu..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0052cc] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Ngân Sách Dự Kiến / Thỏa Thuận (Optional)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0052cc] outline-none"
                  >
                    <option value="Theo phạm vi đề xuất">Nhận phương án & dự toán theo phạm vi</option>
                    <option value="Dưới 50 triệu / năm">Dưới 50 triệu / năm</option>
                    <option value="50 - 100 triệu / năm">50 - 100 triệu / năm</option>
                    <option value="100 - 200 triệu / năm">100 - 200 triệu / năm</option>
                    <option value="Trên 200 triệu / năm">Gói chiến lược chuyên sâu (trên 200 triệu)</option>
                  </select>
                  <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                    * Khoản tài trợ được hạch toán là chi phí truyền thông/sự kiện thương mại, hoàn toàn tách biệt khỏi vốn góp hay cổ phần.
                  </p>
                </div>
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                  <input
                    required
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded mt-0.5"
                  />
                  <div className="text-[11px] text-amber-950 leading-relaxed">
                    <strong className="block font-heading">CAM KẾT MINH BẠCH THƯƠNG MẠI:</strong>
                    Tôi xác nhận hiểu rõ <strong>Founding Partner</strong> là gói tài trợ thương mại theo phạm vi xác định, không tạo quyền sở hữu/cổ đông tại CHUOICUNGUNG.COM, không can thiệp thuật toán tìm kiếm tự nhiên và tuân thủ các nguyên tắc minh bạch của hệ thống.
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phản hồi kết quả Scope Check trong 24 giờ làm việc.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl font-heading uppercase tracking-wide shadow-md transition cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Đang gửi đề xuất..." : "GỬI ĐỀ XUẤT ĐỒNG HÀNH CHUYÊN MỤC"}</span>
                </button>
              </div>
            </form>
          )}
        </section>

      </div>
    </div>
  );
}
