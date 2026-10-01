// ============================================================================
// PAGE 32: TÀI TRỢ & ĐỒNG HÀNH CHƯƠNG TRÌNH
// ROUTE: /tai-tro
// Triển khai chuẩn hóa theo đặc tả 32.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Award, Shield, Sparkles, CheckCircle2, ArrowRight, Building2,
  FileText, Check, Search, Filter, MapPin, Eye, PhoneCall, Send,
  X, Layers, ChevronRight, ArrowUpRight, Zap, Factory, CheckCircle,
  Lock, ShieldCheck, RotateCcw, SlidersHorizontal, ArrowLeftRight,
  AlertTriangle, Video, Download, HelpCircle, AlertCircle, Info,
  ExternalLink, Calendar, Users, Briefcase, BookOpen, Gift, Camera,
  Share2, BarChart3, Clock, DollarSign, Package, CheckSquare, MessageSquare
} from 'lucide-react';

import {
  SPONSORSHIP_TYPES,
  CONTRIBUTION_TYPES,
  CONTRACT_TYPES,
  SPONSORSHIP_STATUSES,
  ENTITLEMENT_TYPES,
  DELIVERY_STATUSES,
  getAllSponsorships,
  getAllSponsorshipInquiries,
  submitSponsorshipInquiry,
  getSponsorshipReport,
  checkScopeConflict,
  verifySupplierMatchingNeutrality
} from '../data/sponsorshipData';

import { getAllPrograms, PROGRAM_STATUSES_ENUM } from '../data/programsData';
import { getAllCatalogues } from '../data/cataloguesData';

export default function SponsorshipPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const typesRef = useRef(null);
  const opportunitiesRef = useRef(null);

  // SEO & Head title (Section 55)
  useEffect(() => {
    document.title = "Tài Trợ Chương Trình & Hoạt Động Doanh Nghiệp | CHUOICUNGUNG.COM";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Đồng hành cùng chương trình kết nối, catalogue, nội dung, thư viện ảnh và vật phẩm doanh nghiệp với phạm vi, quyền lợi, thời hạn và báo cáo được thống nhất rõ.'
      );
    }

    // Structured Data JSON-LD
    let scriptTag = document.getElementById('sponsorship-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'sponsorship-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Tài Trợ Chương Trình & Hoạt Động Doanh Nghiệp",
      "description": "Đồng hành cùng chương trình kết nối, catalogue, nội dung, thư viện ảnh và vật phẩm doanh nghiệp với phạm vi, quyền lợi minh bạch.",
      "url": "https://chuoicungung.com/tai-tro",
      "publisher": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      }
    });

    return () => {
      const existing = document.getElementById('sponsorship-jsonld');
      if (existing) existing.remove();
    };
  }, []);

  // Đọc ngữ cảnh prefill từ URL parameters (Sections 51, 52, 53)
  const initialProgramId = searchParams.get('programId') || '';
  const initialCatalogueId = searchParams.get('catalogueId') || '';
  const initialEditionId = searchParams.get('editionId') || '';
  const initialTypeParam = (searchParams.get('type') || '').toUpperCase();

  // Xác định sponsorshipType ban đầu từ query
  const resolveInitialType = () => {
    if (initialTypeParam === 'CATALOGUE' || initialCatalogueId) return 'CATALOGUE';
    if (initialTypeParam === 'MEDIA') return 'MEDIA';
    if (initialTypeParam === 'MERCHANDISE') return 'MERCHANDISE';
    if (initialTypeParam === 'CATEGORY') return 'CATEGORY';
    return 'PROGRAM';
  };

  // State cho Form gửi đề xuất
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    sponsorshipType: resolveInitialType(),
    programId: initialProgramId,
    catalogueId: initialCatalogueId,
    catalogueEditionId: initialEditionId,
    contributionType: 'CASH',
    estimatedBudget: '',
    expectedBenefits: ['PROGRAM_LOGO', 'PROGRAM_BOOTH'],
    description: '',
    consentAccepted: false
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Lấy dữ liệu Programs & Catalogues
  const programs = useMemo(() => {
    try {
      const all = getAllPrograms();
      return all.filter(p =>
        p.status === PROGRAM_STATUSES_ENUM.REGISTRATION_OPEN ||
        p.status === PROGRAM_STATUSES_ENUM.UPCOMING ||
        p.status === 'UPCOMING' ||
        p.status === 'REGISTRATION_OPEN'
      );
    } catch (e) {
      return [];
    }
  }, []);

  const catalogues = useMemo(() => {
    try {
      return getAllCatalogues();
    } catch (e) {
      return [];
    }
  }, []);

  // Danh sách hợp đồng & báo cáo mẫu (Section 36, 37)
  const [selectedReportId, setSelectedReportId] = useState('SPON-PROG-2026-001');
  const activeReport = useMemo(() => {
    return getSponsorshipReport(selectedReportId);
  }, [selectedReportId]);

  // Bộ lọc danh sách cơ hội tài trợ
  const [activeOpportunityTab, setActiveOpportunityTab] = useState('ALL');

  // Xử lý chuyển tab / click vào loại tài trợ
  const handleSelectSponsorshipType = (typeKey) => {
    if (typeKey === 'CATEGORY') {
      // Hard rule Section 2 & 11: Redirect sang /founding-partner
      navigate('/founding-partner');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sponsorshipType: typeKey,
      expectedBenefits: typeKey === 'CATALOGUE'
        ? ['CATALOGUE_PLACEMENT', 'REPORT']
        : typeKey === 'MEDIA'
        ? ['VIDEO_PRODUCTION', 'PHOTO_LIBRARY']
        : typeKey === 'MERCHANDISE'
        ? ['MERCHANDISE_BRANDING', 'REPORT']
        : ['PROGRAM_LOGO', 'PROGRAM_BOOTH']
    }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nút prefill từ một Program / Catalogue cụ thể
  const handleSelectActivity = (type, id, title) => {
    setFormData(prev => ({
      ...prev,
      sponsorshipType: type,
      programId: type === 'PROGRAM' ? id : prev.programId,
      catalogueId: type === 'CATALOGUE' ? id : prev.catalogueId,
      description: `Đề xuất đồng hành cùng hoạt động: ${title}`
    }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle checkbox quyền lợi kỳ vọng
  const handleBenefitToggle = (benefitId) => {
    setFormData(prev => {
      const exists = prev.expectedBenefits.includes(benefitId);
      return {
        ...prev,
        expectedBenefits: exists
          ? prev.expectedBenefits.filter(b => b !== benefitId)
          : [...prev.expectedBenefits, benefitId]
      };
    });
  };

  // Xử lý gửi đề xuất tài trợ
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.organizationName || !formData.contactName || !formData.email || !formData.phone) {
      setFormError('Vui lòng điền đầy đủ Tên doanh nghiệp, Người liên hệ, Email và Số điện thoại.');
      return;
    }

    if (!formData.consentAccepted) {
      setFormError('Vui lòng tích xác nhận đồng ý với nguyên tắc đồng hành minh bạch của hệ thống.');
      return;
    }

    setFormSubmitting(true);

    try {
      const result = submitSponsorshipInquiry(formData, {
        name: formData.contactName,
        role: 'PROSPECTIVE_SPONSOR'
      });

      setSubmitSuccess(result);
      setFormSubmitting(false);

      // Scroll to success banner
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi nộp đề xuất. Vui lòng thử lại.');
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ---------------------------------------------------------------------- */}
      {/* BREADCRUMB & CONTEXT BANNER */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-xs text-slate-500 space-x-2">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Tài trợ & Đồng hành</span>
          </nav>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. HERO SECTION (MỤC 3 SPEC 32.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>Chương Trình Đồng Hành B2B Minh Bạch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              ĐỒNG HÀNH CÙNG CHƯƠNG TRÌNH PHỤC VỤ DOANH NGHIỆP
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Lựa chọn chương trình, chuyên mục hoặc hoạt động phù hợp để đồng hành cùng <strong>CHUOICUNGUNG.COM</strong>. Mỗi gói thống nhất phạm vi hiện diện, nội dung, thời hạn và báo cáo quyền lợi đã bàn giao.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI ĐỀ XUẤT TÀI TRỢ</span>
              </button>

              <button
                onClick={() => typesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold rounded-xl transition flex items-center gap-2"
              >
                <span>XEM CÁC HÌNH THỨC ĐỒNG HÀNH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Ba cam kết chuẩn hóa */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 pt-8 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Nghiệm thu theo bằng chứng thực tế</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bảo mật danh bạ & dữ liệu đối tác</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Không can thiệp thuật toán matching</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. NĂM HÌNH THỨC ĐỒNG HÀNH (MỤC 4 SPEC 32.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={typesRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            5 Danh Mục Tài Trợ Chuẩn Hóa
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            LỰA CHỌN HÌNH THỨC PHÙ HỢP VỚI MỤC TIÊU DOANH NGHIỆP
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Mỗi hình thức được quy định rạch ròi về quyền lợi, danh mục hiện diện và không bị trộn lẫn với các sản phẩm thương mại khác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 01: Chương trình kết nối */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  HÌNH THỨC 01
                </span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Tài Trợ Chương Trình Kết Nối
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Đồng hành tại Ngày hội Chuỗi Cung Ứng, Sourcing Day 1:1, gian hàng chung và các phiên pitching năng lực trực tiếp trước 500+ nhà máy FDI.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Logo trên backdrop, website và tài liệu chính thức</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Gian hàng trưng bày giải pháp và bàn kết nối B2B</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Suất chia sẻ tham luận chuyên môn trước đại biểu</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectSponsorshipType('PROGRAM')}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Chọn Chương Trình Này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 02: Catalogue / Ấn phẩm */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  HÌNH THỨC 02
                </span>
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Tài Trợ Catalogue / Ấn Phẩm
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hiện diện trang quảng bá màu A4 trong các ấn bản in chuyên ngành phát hành trực tiếp đến phòng Mua hàng các nhà máy tại KCN.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Trang màu quảng bá hoặc bài phỏng vấn chuyên gia</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Mã QR độc lập dẫn về hồ sơ số trực tuyến</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Báo cáo bàn giao số lượng bản in thực tế đến KCN</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectSponsorshipType('CATALOGUE')}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Chọn Tài Trợ Ấn Phẩm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 03: Video / Thư viện ảnh / Nội dung */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  HÌNH THỨC 03
                </span>
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Video / Thư Viện Ảnh / Nội Dung
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Bảo trợ sản xuất phim phóng sự nhà xưởng, tư liệu hình ảnh chất lượng cao và cẩm nang tiêu chuẩn phục vụ cộng đồng chuỗi cung ứng.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>Ghi hình xưởng máy 4K và phỏng vấn năng lực quản trị</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>Bộ ảnh sự kiện lưu trữ chính thức trong Program Library</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>Bài viết cẩm nang nghiệm thu kỹ thuật theo ngành</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectSponsorshipType('MEDIA')}
              className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Chọn Tài Trợ Nội Dung</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 04: Tài trợ vật phẩm sự kiện */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  HÌNH THỨC 04
                </span>
                <Gift className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Tài Trợ Vật Phẩm Sự Kiện
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Đồng hành in ấn thương hiệu trên dây đeo thẻ, túi hội nghị canvas, sổ tay doanh nghiệp B2B, quà tặng lưu niệm và ấn phẩm phát tay.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>In logo thương hiệu trên 500-1.000 bộ vật phẩm</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>Chấp nhận đóng góp bằng hiện vật đạt chuẩn kỹ thuật</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>Tái sử dụng quy trình Page 16 (Vật phẩm sự kiện)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleSelectSponsorshipType('MERCHANDISE')}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Chọn Tài Trợ Vật Phẩm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 05: Đồng hành chuyên mục (FOUNDING PARTNER - MỤC 11) */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-md border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-800" />
                  HÌNH THỨC 05: ĐỒNG HÀNH CHUYÊN MỤC
                </span>
                <span className="text-xs font-bold text-amber-800">Gói Chiến Lược Dài Hạn</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Đồng Hành Chuyên Mục & Cụm Nhu Cầu (Founding Partner)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Nếu doanh nghiệp muốn đồng hành <strong>dài hạn 12 tháng</strong> theo chuyên mục ngành hoặc cụm từ khóa (Keyword Cluster) tại địa bàn KCN cụ thể, hãy xem gói <strong>Founding Partner</strong>. Hệ thống quản lý thỏa thuận và quyền lợi chuyên mục riêng biệt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800 mb-6 bg-white/70 p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Khối hiển thị đầu trang ngành & từ khóa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Phạm vi KCN & Địa phương độc quyền</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Hồ sơ năng lực chuẩn hóa & Video xưởng</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Suất hiện diện trong Catalogue số & In ấn</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs text-slate-600 italic">
                * Không bán Category Sponsorship trực tiếp tại /tai-tro để tránh chồng lấn chính sách.
              </span>
              <Link
                to="/founding-partner"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                <span>TÌM HIỂU FOUNDING PARTNER</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 4 NGUYÊN TẮC CỐT LÕI (MỤC 12, 13, 14, 35) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Nguyên Tắc Minh Bạch & Bảo Vệ Khách Quan
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Ranh Giới Quyền Lợi & Tính Độc Lập
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm mb-3">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Tài Trợ ≠ Đầu Tư
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tài trợ là thỏa thuận hiện diện thương hiệu và đồng hành tổ chức. Không xác lập quyền sở hữu cổ phần, lợi tức đầu tư hay quyền cổ đông của nền tảng.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm mb-3">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Tài Trợ ≠ Bảo Trợ
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Danh xưng chuẩn hóa là "NHÀ TÀI TRỢ" hoặc "ĐỐI TÁC ĐỒNG HÀNH". Hệ thống không tùy tiện dùng từ "bảo trợ" khi chưa có văn bản pháp lý chuyên biệt.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm mb-3">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Không Mua Quyền Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nhà tài trợ không được tăng điểm thuật toán kết nối, không đứng #1 tìm kiếm mù quáng và không được đảm bảo bắt buộc Buyer phải chốt đơn hàng.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-3">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Bảo Vệ Dữ Liệu Riêng Tư
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sponsor không được cung cấp danh bạ Buyer bảo mật, hồ sơ báo giá nội bộ hay thông tin người tham dự nếu không có sự đồng thuận chính thức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. DANH SÁCH HOẠT ĐỘNG ĐANG MỞ TÀI TRỢ (LIVE OPPORTUNITIES - MỤC 6) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={opportunitiesRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Cơ Hội Đang Nhận Đăng Ký
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              CÁC CHƯƠNG TRÌNH & ẤN PHẨM TIÊU BIỂU
            </h2>
          </div>

          {/* Filter Tab */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveOpportunityTab('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${activeOpportunityTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Tất cả ({programs.length + catalogues.length})
            </button>
            <button
              onClick={() => setActiveOpportunityTab('PROGRAM')}
              className={`px-3 py-1.5 rounded-lg transition ${activeOpportunityTab === 'PROGRAM' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Chương trình ({programs.length})
            </button>
            <button
              onClick={() => setActiveOpportunityTab('CATALOGUE')}
              className={`px-3 py-1.5 rounded-lg transition ${activeOpportunityTab === 'CATALOGUE' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Catalogue ({catalogues.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render Programs */}
          {(activeOpportunityTab === 'ALL' || activeOpportunityTab === 'PROGRAM') &&
            programs.slice(0, 3).map(prog => (
              <div key={prog.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      CHƯƠNG TRÌNH KẾT NỐI
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {prog.date || 'Tháng 10/2026'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {prog.subtitle || prog.description || 'Chương trình kết nối giao thương trực tiếp giữa doanh nghiệp FDI và nhà cung ứng phụ trợ.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prog.location || 'KCN Biên Hòa, Đồng Nai'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/chuong-trinh/${prog.slug}`}
                    className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    onClick={() => handleSelectActivity('PROGRAM', prog.id, prog.title)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Đăng ký tài trợ
                  </button>
                </div>
              </div>
            ))}

          {/* Render Catalogues */}
          {(activeOpportunityTab === 'ALL' || activeOpportunityTab === 'CATALOGUE') &&
            catalogues.slice(0, 3).map(cat => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      CATALOGUE ẤN PHẨM
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Q1/2026
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {cat.description || 'Tập hợp các nhà cung ứng tiêu biểu đã qua thẩm định năng lực thực tế.'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Phát hành: 1.000 bản in đến các KCN</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/catalogue/${cat.slug}`}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-600"
                  >
                    Xem ấn phẩm
                  </Link>
                  <button
                    onClick={() => handleSelectActivity('CATALOGUE', cat.id, cat.title)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Tài trợ trang in
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. FORM GỬI ĐỀ XUẤT TÀI TRỢ (FORM ENGINE - MỤC 15-20) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={formRef} className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                Tiếp Nhận Nhu Cầu Đồng Hành
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                GỬI ĐỀ XUẤT TÀI TRỢ HOẠT ĐỘNG
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Điền thông tin ban đầu để điều phối viên CCU kết nối, gửi Proposal chi tiết và cùng xác lập phạm vi quyền lợi phù hợp.
              </p>
            </div>

            {/* Thông báo thành công */}
            {submitSuccess && (
              <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-950 mb-1">
                      Đã Tiếp Nhận Đề Xuất Thành Công! (Mã: {submitSuccess.id})
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      Hồ sơ của <strong>{submitSuccess.organizationName}</strong> đã được ghi nhận vào hàng đợi điều phối tài trợ (Trạng thái: <strong>ĐỀ XUẤT MỚI TIẾP NHẬN - INQUIRY</strong>).
                    </p>
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                      <p>• <strong>Người phụ trách:</strong> {submitSuccess.ownerName}</p>
                      <p>• <strong>Cam kết phản hồi:</strong> Trong vòng 4 giờ làm việc</p>
                      <p>• <strong>Hành động kế tiếp:</strong> Điều phối viên sẽ liên hệ qua điện thoại ({submitSuccess.phone}) hoặc email ({submitSuccess.email}) để gửi bộ Proposal chi tiết.</p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      Gửi thêm đề xuất khác
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {!submitSuccess && (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* 1. Chọn loại tài trợ */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    1. Hình thức tài trợ quan tâm *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['PROGRAM', 'CATALOGUE', 'MEDIA', 'MERCHANDISE'].map(typeKey => {
                      const typeObj = SPONSORSHIP_TYPES[typeKey];
                      const isSelected = formData.sponsorshipType === typeKey;
                      return (
                        <button
                          key={typeKey}
                          type="button"
                          onClick={() => handleSelectSponsorshipType(typeKey)}
                          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-black text-slate-400 block mb-1">
                            {typeObj.code}
                          </span>
                          <span className="text-xs font-bold leading-tight">
                            {typeObj.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chọn hoạt động cụ thể nếu có */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.sponsorshipType === 'PROGRAM' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chương trình muốn đồng hành (Tùy chọn)
                      </label>
                      <select
                        value={formData.programId}
                        onChange={(e) => setFormData(prev => ({ ...prev, programId: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="">-- Chưa chọn (Tư vấn chương trình phù hợp) --</option>
                        {programs.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.sponsorshipType === 'CATALOGUE' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Catalogue / Ấn phẩm muốn tài trợ
                      </label>
                      <select
                        value={formData.catalogueId}
                        onChange={(e) => setFormData(prev => ({ ...prev, catalogueId: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="">-- Chưa chọn ấn phẩm cụ thể --</option>
                        {catalogues.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hình thức đóng góp dự kiến *
                    </label>
                    <select
                      value={formData.contributionType}
                      onChange={(e) => setFormData(prev => ({ ...prev, contributionType: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {Object.values(CONTRIBUTION_TYPES).map(c => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ngân sách dự kiến (VNĐ - Không bắt buộc)
                    </label>
                    <input
                      type="number"
                      placeholder="Ví dụ: 30000000 (30 triệu)"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      * Không bắt buộc đưa ngân sách trước khi xác lập phạm vi.
                    </span>
                  </div>
                </div>

                {/* 3. Thông tin người đại diện & Doanh nghiệp */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    2. Thông tin doanh nghiệp & Đầu mối liên hệ *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-700 font-medium mb-1">
                        Tên doanh nghiệp / Đơn vị *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Công ty TNHH / Cổ phần..."
                        value={formData.organizationName}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 font-medium mb-1">
                        Người đại diện liên hệ *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Họ và tên..."
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 font-medium mb-1">
                        Chức vụ / Phòng ban
                      </label>
                      <input
                        type="text"
                        placeholder="Giám đốc Marketing / Trưởng phòng Kinh doanh..."
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 font-medium mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-700 font-medium mb-1">
                        Email nhận hồ sơ đề xuất (Proposal) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Quyền lợi kỳ vọng (Checkboxes) */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    3. Quyền lợi kỳ vọng hướng tới (Chọn các mục phù hợp)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.values(ENTITLEMENT_TYPES).slice(0, 8).map(ent => {
                      const isChecked = formData.expectedBenefits.includes(ent.id);
                      return (
                        <label
                          key={ent.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                            isChecked ? 'bg-blue-50/60 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleBenefitToggle(ent.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <span className="font-medium">{ent.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Ghi chú mô tả thêm */}
                <div>
                  <label className="block text-xs text-slate-700 font-medium mb-1">
                    Ghi chú chi tiết về mục tiêu đồng hành hoặc yêu cầu đặc thù
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả thông điệp muốn truyền tải, quy mô xưởng sản xuất hoặc số lượng sản phẩm dự kiến tài trợ..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  ></textarea>
                </div>

                {/* 6. Checkbox đồng thuận */}
                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consentAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, consentAccepted: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>
                      Chúng tôi hiểu rằng đề xuất này là bước tiếp nhận thông tin (Inquiry). Mọi quyền lợi, nghĩa vụ tài chính và biên bản nghiệm thu sẽ được thống nhất qua Hợp đồng chính thức theo quy định của CHUOICUNGUNG.COM.
                    </span>
                  </label>
                </div>

                {/* Nút gửi */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <span>Đang chuyển hồ sơ...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>XÁC NHẬN GỬI ĐỀ XUẤT TÀI TRỢ</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 8. MẪU BÁO CÁO NGHIỆM THU MINH BẠCH (SECTIONS 26, 28, 36, 37) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
            Minh Bạch Quyền Lợi & Đo Lường
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            MẪU BÁO CÁO BÀN GIAO QUYỀN LỢI THỰC TẾ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mỗi đối tác tài trợ đều được bàn giao báo cáo chi tiết kèm bằng chứng nghiệm thu (Ảnh maket, link bài viết, biên bản giao nhận).
          </p>
        </div>

        {activeReport && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500">Mã hợp đồng: {activeReport.sponsorshipId}</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {activeReport.sponsorName}
                </h3>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                  {CONTRACT_TYPES[activeReport.contractType]?.name || activeReport.contractType}
                </span>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-500 block">Tiến độ nghiệm thu:</span>
                <span className="text-2xl font-black text-emerald-600">
                  {activeReport.entitlementsSummary.deliveryPercentage}%
                </span>
                <span className="text-xs text-slate-500 block">
                  ({activeReport.entitlementsSummary.accepted + activeReport.entitlementsSummary.delivered}/{activeReport.entitlementsSummary.total} quyền lợi)
                </span>
              </div>
            </div>

            {/* Phân tách thước đo minh bạch (Section 37) */}
            <div className="mt-6 mb-8">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Số liệu tương tác độc lập (Impresion ≠ QR Scan ≠ Contact Request)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Lượt xem trang</span>
                  <span className="text-lg font-black text-slate-900">{activeReport.metrics.programViews.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Đại biểu dự</span>
                  <span className="text-lg font-black text-slate-900">{activeReport.metrics.attendeesConfirmed}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Quét mã QR</span>
                  <span className="text-lg font-black text-blue-600">{activeReport.metrics.qrScans}</span>
                  <span className="text-[9px] text-slate-400 block">≠ Lead</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Gửi danh thiếp</span>
                  <span className="text-lg font-black text-purple-600">{activeReport.metrics.contactRequests}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Nhu cầu phù hợp</span>
                  <span className="text-lg font-black text-emerald-600">{activeReport.metrics.buyerNeedsMatched}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Giao dịch chốt</span>
                  <span className="text-lg font-black text-slate-400">0</span>
                  <span className="text-[9px] text-slate-400 block">Thực tế</span>
                </div>
              </div>
            </div>

            {/* Bảng quyền lợi và bằng chứng bàn giao (Sections 26, 27, 28) */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Danh mục quyền lợi & Bằng chứng bàn giao
              </h4>
              <div className="space-y-3">
                {activeReport.entitlementsList.map(ent => {
                  const statusObj = DELIVERY_STATUSES[ent.status] || { label: ent.status, color: 'slate' };
                  return (
                    <div key={ent.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            ent.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                            ent.status === 'DELIVERED' ? 'bg-amber-100 text-amber-800' :
                            ent.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {statusObj.label}
                          </span>
                          <span className="font-bold text-xs text-slate-900">{ent.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 space-x-3">
                          <span>Số lượng: <strong>{ent.quantity || 1}</strong></span>
                          {ent.acceptedBy && <span>Người nghiệm thu: <strong>{ent.acceptedBy}</strong></span>}
                          {ent.startAt && <span>Thời hạn: {ent.startAt} đến {ent.endAt}</span>}
                        </div>
                      </div>

                      {ent.evidence && ent.evidence.length > 0 && (
                        <div className="text-xs shrink-0 flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Bằng chứng:</span>
                          {ent.evidence.map((ev, i) => (
                            <a
                              key={i}
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-500 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            >
                              <span>{ev.type}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 9. SUPPI & FAQ HỖ TRỢ NHANH */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-6 rounded-3xl">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-lg font-black mb-2">Trợ Lý Ảo SUPPI</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Bạn cần tư vấn gói tài trợ phù hợp với ngành hàng, quy mô và ngân sách? Trợ lý SUPPI sẵn sàng kết nối và gợi ý các cơ hội hiện diện tối ưu.
              </p>
              <button
                onClick={() => alert('Trợ lý ảo SUPPI: "Xin chào! Bạn quan tâm đến tài trợ Ngày hội Chuỗi Cung Ứng KCN Biên Hòa 2026 hay Catalogue ngành may mặc bảo hộ?"')}
                className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-xs transition"
              >
                Hỏi Trợ Lý SUPPI Ngay
              </button>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-black text-slate-900 mb-2">
                CÂU HỎI THƯỜNG GẶP VỀ ĐỒNG HÀNH TÀI TRỢ
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 mb-1">
                  1. Doanh nghiệp có được xuất hóa đơn VAT cho khoản tài trợ không?
                </h4>
                <p className="text-slate-600">
                  Có. Toàn bộ các gói tài trợ truyền thông, quảng bá thương hiệu hoặc dịch vụ sự kiện đều được ký kết Hợp đồng thương mại và xuất hóa đơn Giá trị gia tăng (VAT) hợp lệ theo đúng quy định pháp luật.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 mb-1">
                  2. Tài trợ bằng sản phẩm hiện vật (In-Kind) được ghi nhận như thế nào?
                </h4>
                <p className="text-slate-600">
                  Các sản phẩm tài trợ (Áo đồng phục, túi quà, in ấn catalogue, thiết bị sự kiện) được lập Biên bản giao nhận và ghi nhận giá trị tương đương theo thỏa thuận. Hệ thống hạch toán riêng và không tự ý ghi nhận thành doanh thu tiền mặt (Mục 49).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 mb-1">
                  3. Nếu muốn tài trợ chuyên mục từ khóa thì đăng ký ở đâu?
                </h4>
                <p className="text-slate-600">
                  Tài trợ độc quyền theo chuyên mục ngành hoặc từ khóa thuộc quyền lợi của chương trình <strong>Founding Partner</strong>. Vui lòng truy cập chuyên trang <Link to="/founding-partner" className="text-blue-600 font-bold underline">/founding-partner</Link> để tra cứu phạm vi KCN và từ khóa còn trống.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
