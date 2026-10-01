// ============================================================================
// PAGE 33: ĐỐI TÁC PHÁT TRIỂN / REFERRAL / B2B BUSINESS DEVELOPMENT
// ROUTE: /doi-tac-phat-trien
// Triển khai chuẩn hóa theo đặc tả 33.txt - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Handshake, Shield, Sparkles, CheckCircle2, ArrowRight, Building2,
  FileText, Check, Search, Filter, MapPin, Eye, PhoneCall, Send,
  X, Layers, ChevronRight, ArrowUpRight, Zap, Factory, CheckCircle,
  Lock, ShieldCheck, RotateCcw, SlidersHorizontal, ArrowLeftRight,
  AlertTriangle, Video, Download, HelpCircle, AlertCircle, Info,
  ExternalLink, Calendar, Users, Briefcase, BookOpen, Gift, Camera,
  Share2, BarChart3, Clock, DollarSign, Package, CheckSquare, MessageSquare,
  Link2, Award, UserCheck, ShieldAlert
} from 'lucide-react';

import {
  COOPERATION_TYPES,
  PARTNER_ROLES,
  PARTNER_STATUSES,
  REFERRAL_STATUSES,
  getAllDevelopmentPartners,
  getAllPartnerApplications,
  submitPartnerApplication,
  getPartnerWorkspaceData,
  verifySupplierMatchingNeutrality
} from '../data/developmentPartnerData';

export default function DevelopmentPartnerPage() {
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  const typesRef = useRef(null);
  const workflowRef = useRef(null);

  // SEO & Head title (Section 55)
  useEffect(() => {
    document.title = "Đối tác phát triển | CHUOICUNGUNG.COM";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Phối hợp giới thiệu dịch vụ, phát triển nhóm doanh nghiệp tham gia chương trình và kết nối đơn vị có nhu cầu tổ chức với cơ chế ghi nhận, theo dõi và đối soát rõ ràng.'
      );
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://chuoicungung.com/doi-tac-phat-trien');

    // JSON-LD Structured Data
    let scriptTag = document.getElementById('dev-partner-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dev-partner-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Đối tác phát triển | CHUOICUNGUNG.COM",
      "description": "Cùng phát triển chương trình và dịch vụ cho doanh nghiệp với cơ chế ghi nhận minh bạch.",
      "url": "https://chuoicungung.com/doi-tac-phat-trien",
      "publisher": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      }
    });

    return () => {
      const existing = document.getElementById('dev-partner-jsonld');
      if (existing) existing.remove();
    };
  }, []);

  // Form State (Section 23, 24, 25)
  const [formData, setFormData] = useState({
    applicantName: '',
    partnerType: 'BUSINESS_ASSOCIATION',
    contactPerson: '',
    role: '',
    email: '',
    phone: '',
    website: '',
    geographicScopes: ['Đồng Nai', 'TP. Hồ Chí Minh'],
    targetAudienceDescription: '',
    cooperationTypes: ['SERVICE_CONTENT', 'PROGRAM_PARTICIPANTS'],
    expectedCooperation: '',
    consentAccepted: false
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // Sample Partner Workspace Preview (Mục 32, 33, 34)
  const sampleWorkspaceData = useMemo(() => {
    return getPartnerWorkspaceData('DTPT-2026-001');
  }, []);

  // Toggle hình thức hợp tác trong form
  const handleToggleCooperationType = (typeKey) => {
    setFormData(prev => {
      const exists = prev.cooperationTypes.includes(typeKey);
      return {
        ...prev,
        cooperationTypes: exists
          ? prev.cooperationTypes.filter(t => t !== typeKey)
          : [...prev.cooperationTypes, typeKey]
      };
    });
  };

  // Nộp đơn đăng ký hợp tác
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.applicantName || !formData.contactPerson || !formData.email || !formData.phone) {
      setFormError('Vui lòng điền đầy đủ Tên tổ chức/cá nhân, Người liên hệ, Email và Số điện thoại.');
      return;
    }

    if (!formData.targetAudienceDescription) {
      setFormError('Vui lòng mô tả ngắn gọn nhóm doanh nghiệp bạn có thể tiếp cận (VD: Các nhà máy FDI tại KCN Biên Hòa).');
      return;
    }

    if (formData.cooperationTypes.length === 0) {
      setFormError('Vui lòng chọn ít nhất 01 hình thức phối hợp quan tâm.');
      return;
    }

    if (!formData.consentAccepted) {
      setFormError('Vui lòng tích đồng ý với nguyên tắc hợp tác minh bạch và trung lập của hệ thống.');
      return;
    }

    setFormSubmitting(true);

    try {
      const app = submitPartnerApplication(formData, {
        name: formData.contactPerson,
        role: 'APPLICANT'
      });

      setSubmitSuccess(app);
      setFormSubmitting(false);

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi nộp hồ sơ. Vui lòng kiểm tra lại.');
      setFormSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* ---------------------------------------------------------------------- */}
      {/* BREADCRUMB */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-xs text-slate-500 space-x-2">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Đối tác phát triển</span>
          </nav>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 1. HERO SECTION (MỤC 2 SPEC 33.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Handshake className="w-3.5 h-3.5" />
              <span>Chương Trình Đối Tác Phát Triển B2B</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Đối tác phát triển
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-blue-200 mb-6">
              Cùng phát triển chương trình và dịch vụ cho doanh nghiệp
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              <strong>CHUOICUNGUNG.COM</strong> tìm đối tác có mạng lưới doanh nghiệp và mong muốn phối hợp giới thiệu dịch vụ phù hợp. Phạm vi giới thiệu, trách nhiệm hỗ trợ và cơ chế ghi nhận được thống nhất trước khi triển khai. Hợp tác phát triển không ảnh hưởng đến tính trung lập, thuật toán matching và kết quả KYC của nhà cung ứng.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => workflowRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold rounded-xl transition flex items-center gap-2"
              >
                <span>XEM NGUYÊN TẮC</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI ĐỀ NGHỊ</span>
              </button>
            </div>

            {/* 4 Ranh giới cam kết minh bạch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 pt-8 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-black">✕</span>
                <span>Không phải affiliate marketplace mở / chạy click</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-black">✕</span>
                <span>Không phải mô hình MLM / đa cấp tuyển downline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-black">✕</span>
                <span>Không thu mua hay yêu cầu upload danh bạ Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-black">✕</span>
                <span>Không trả tiền để tác động hay ưu ái Supplier Matching</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. ĐỐI TƯỢNG PHÙ HỢP (MỤC 3 SPEC 33.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Tiêu Chuẩn Mạng Lưới
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              ĐỐI TƯỢNG PHÙ HỢP THAM GIA ĐỒNG HÀNH
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Chúng tôi ưu tiên các tổ chức và chuyên gia có uy tín thực tế trong cộng đồng sản xuất công nghiệp và chuỗi cung ứng.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {Object.values(PARTNER_ROLES).map(role => (
              <div key={role.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {role.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. NĂM HÌNH THỨC PHỐI HỢP (MỤC 4 SPEC 33.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={typesRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            5 Lĩnh Vực Phối Hợp Chính Thức
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            HÌNH THỨC PHỐI HỢP & PHẠM VI GIỚI THIỆU
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Mỗi hình thức được ký Thỏa thuận hợp tác rõ ràng, có bộ tài liệu giải pháp chuẩn hóa và đầu mối điều phối hỗ trợ xuyên suốt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Form A */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  HÌNH THỨC A
                </span>
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Giới Thiệu Khách Đặt Dịch Vụ Nội Dung
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Kết nối các nhà máy sản xuất, nhà cung ứng FDI có nhu cầu làm hồ sơ năng lực số chuẩn quốc tế, quay phim phóng sự xưởng 4K, chụp ảnh máy móc hoặc ấn bản Catalogue ngành.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-4">
                <p>• Hồ sơ năng lực số & E-Catalogue</p>
                <p>• Video phóng sự xưởng sản xuất 4K</p>
                <p>• Trang quảng bá trong Catalogue in ấn</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, cooperationTypes: ['SERVICE_CONTENT'] }));
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition"
            >
              Đăng Ký Hình Thức Này
            </button>
          </div>

          {/* Form B */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  HÌNH THỨC B
                </span>
                <Gift className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Giới Thiệu Khách Đặt Vật Phẩm Sự Kiện
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Giới thiệu các doanh nghiệp, ban tổ chức sự kiện B2B cần đặt quà tặng hội nghị, dây đeo thẻ, túi vải canvas thân thiện môi trường, sổ tay hoặc in ấn tài liệu phát tay.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-4">
                <p>• Quà tặng doanh nghiệp khắc logo</p>
                <p>• Thẻ đại biểu & Dây đeo hội nghị</p>
                <p>• Túi vải canvas chuỗi cung ứng</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, cooperationTypes: ['SERVICE_MERCHANDISE'] }));
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs transition"
            >
              Đăng Ký Hình Thức Này
            </button>
          </div>

          {/* Form C */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  HÌNH THỨC C
                </span>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Phát Triển Nhóm DN Tham Gia Chương Trình
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Vận động và tập hợp nhóm nhà cung ứng phụ trợ hoặc đoàn mua hàng FDI tham gia Ngày hội Chuỗi Cung Ứng, Sourcing Day 1:1, gian hàng chung kết nối giao thương trực tiếp.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-4">
                <p>• Đoàn doanh nghiệp tham quan & mua hàng</p>
                <p>• Nhà cung ứng đăng ký gian hàng chung</p>
                <p>• Doanh nghiệp tham gia phiên pitching</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, cooperationTypes: ['PROGRAM_PARTICIPANTS'] }));
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs transition"
            >
              Đăng Ký Hình Thức Này
            </button>
          </div>

          {/* Form D */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  HÌNH THỨC D
                </span>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Giới Thiệu Đơn Vị Có Nhu Cầu Tổ Chức
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Kết nối các Ban Quản lý Khu Công Nghiệp, Hiệp hội ngành hàng hoặc Tập đoàn có nhu cầu phối hợp tổ chức các ngày hội giao thương, hội thảo chuyên đề hoặc sourcing riêng.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1 mb-4">
                <p>• Ban Quản lý KCN tổ chức Sourcing Day</p>
                <p>• Hiệp hội ngành hàng tổ chức hội thảo</p>
                <p>• Tập đoàn FDI tìm 20-30 NCC vệ tinh</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, cooperationTypes: ['PROGRAM_ORGANIZATION'] }));
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition"
            >
              Đăng Ký Hình Thức Này
            </button>
          </div>

          {/* Form E */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                  HÌNH THỨC E
                </span>
                <MapPin className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Phối Hợp Điều Phối Tại Địa Phương (Theo Thỏa Thuận Riêng)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dành cho các đơn vị tư vấn địa phương, đại diện hội ngành nghề tại các tỉnh thành trọng điểm (Đồng Nai, Bình Dương, Bắc Ninh, Hải Phòng) mong muốn hỗ trợ công tác thực địa, kết nối chính quyền và thẩm định sơ bộ năng lực nhà máy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 mb-4">
                <p>• Khảo sát thực địa và hỗ trợ thẩm định xưởng</p>
                <p>• Phối hợp điều phối đoàn đại biểu tại địa bàn</p>
                <p>• Tiếp nhận và hướng dẫn doanh nghiệp đăng ký</p>
                <p>• Cầu nối thông tin với Ban Quản lý KCN sở tại</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, cooperationTypes: ['LOCAL_COORDINATION'] }));
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
            >
              Đăng Ký Phối Hợp Địa Phương
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. QUY TRÌNH 7 BƯỚC GHI NHẬN MINH BẠCH (MỤC 11 SPEC 33.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={workflowRef} className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Quy Trình 7 Bước Chuẩn Hóa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              CƠ CHẾ GHI NHẬN & ĐỐI SOÁT MINH BẠCH
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Mọi quyền lợi và chi phí hỗ trợ đối tác phát triển được theo dõi trên hệ thống số, đối soát rõ ràng và không phụ thuộc vào hứa hẹn cảm tính.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-blue-600 block mb-1">BƯỚC 01</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Xác Nhận Thỏa Thuận</h3>
              <p className="text-[11px] text-slate-600">Thống nhất phạm vi dịch vụ, địa bàn, trách nhiệm và tỷ lệ chia sẻ chi phí theo hợp đồng hợp tác.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-blue-600 block mb-1">BƯỚC 02</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Cấp Mã & Referral Link</h3>
              <p className="text-[11px] text-slate-600">Sau khi duyệt, đối tác nhận mã định danh (Ví dụ: <code>DTPT-AMATA-01</code>) và link giới thiệu độc lập.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-blue-600 block mb-1">BƯỚC 03</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Ghi Nhận Nhu Cầu Hợp Lệ</h3>
              <p className="text-[11px] text-slate-600">Khách hàng gửi yêu cầu dịch vụ hoặc đăng ký chương trình qua link/mã đối tác.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-blue-600 block mb-1">BƯỚC 04</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Theo Dõi Giao Dịch</h3>
              <p className="text-[11px] text-slate-600">Điều phối viên CCU tiếp nhận, khảo sát, gửi proposal và ký hợp đồng thương mại với khách hàng.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-emerald-600 block mb-1">BƯỚC 05</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Xác Định Đủ Điều Kiện</h3>
              <p className="text-[11px] text-slate-600">Khách hàng hoàn tất thanh toán và nghiệm thu dịch vụ $\rightarrow$ chuyển trạng thái <code>ELIGIBLE</code>.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-emerald-600 block mb-1">BƯỚC 06</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Đối Soát Kỳ Bàn Giao</h3>
              <p className="text-[11px] text-slate-600">Lập bảng tổng hợp đối soát theo chu kỳ tháng/quý có đính kèm hợp đồng và hóa đơn thực tế.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2 lg:col-span-2">
              <span className="text-xs font-black text-emerald-600 block mb-1">BƯỚC 07</span>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Chi Trả & Chứng Từ Hợp Lệ</h3>
              <p className="text-[11px] text-slate-600">Thực hiện thanh toán theo đúng quy định tài chính và khấu trừ thuế theo luật định. Mọi hoàn hủy giao dịch đều được điều chỉnh minh bạch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. KHỐI BẠN ĐƯỢC HỖ TRỢ GÌ? (MỤC 30 SPEC 33.TXT) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Hỗ Trợ Đồng Hành Chuyên Nghiệp
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-4">
              BẠN ĐƯỢC HỖ TRỢ GÌ TỪ NỀN TẢNG?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              CHUOICUNGUNG.COM đồng hành cùng bạn như một đội ngũ hậu cần vững chắc. Bạn không cần tự xây dựng sản phẩm, đội ngũ quay dựng hay tổ chức sự kiện phức tạp.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">Tài liệu giới thiệu sản phẩm đã kiểm duyệt</h3>
                  <p className="text-slate-500">Cung cấp trọn bộ Brochure, Portfolio, bảng thông số kỹ thuật 4K và biểu phí chuẩn hóa.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">Đầu mối điều phối viên CCU chuyên trách</h3>
                  <p className="text-slate-500">Mỗi đối tác có 01 điều phối viên trực tiếp hỗ trợ tư vấn kỹ thuật và chốt hợp đồng với khách.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900">Bảng theo dõi trực tuyến minh bạch</h3>
                  <p className="text-slate-500">Xem tình trạng từng lượt giới thiệu, tiến độ thanh toán và đối soát trực tiếp trên hệ thống.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mô phỏng Dashboard Đối tác (Mục 32, 33, 34) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Mô Phỏng Tài Khoản Đối Tác</span>
                <h3 className="text-sm font-black text-slate-900">{sampleWorkspaceData.partnerName}</h3>
                <span className="text-xs font-mono text-blue-600 font-bold">Mã: {sampleWorkspaceData.partnerCode}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                {sampleWorkspaceData.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Tổng giới thiệu</span>
                <span className="text-base font-black text-slate-900">{sampleWorkspaceData.stats.totalReferrals}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Hợp lệ</span>
                <span className="text-base font-black text-blue-600">{sampleWorkspaceData.stats.validReferrals}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Đủ ĐK đối soát</span>
                <span className="text-base font-black text-emerald-600">{sampleWorkspaceData.stats.eligibleForSettlement}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Lượt giới thiệu gần đây (Masked Data - Mục 34)
              </span>
              <div className="space-y-2">
                {sampleWorkspaceData.referrals.slice(0, 3).map(ref => (
                  <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{ref.referredCompanyName}</span>
                      <span className="text-[11px] text-slate-500">{ref.contactMasked}</span>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ref.status === 'ELIGIBLE_FOR_SETTLEMENT' ? 'bg-emerald-100 text-emerald-800' :
                        ref.status === 'VALID' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ref.statusLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ref.firstCapturedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. FORM ĐĂNG KÝ HỢP TÁC (MỤC 23, 24, 25) */}
      {/* ---------------------------------------------------------------------- */}
      <section ref={formRef} className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                Tiếp Nhận Hồ Sơ Hợp Tác
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                ĐĂNG KÝ TRAO ĐỔI HỢP TÁC PHÁT TRIỂN
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Điền thông tin ban đầu để Bàn Điều Phối kết nối, thẩm định phạm vi và tiến hành ký kết Thỏa thuận Đối tác Phát triển.
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-8 p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-950 mb-1">
                      Đã Tiếp Nhận Hồ Sơ Hợp Tác! (Mã Đơn: {submitSuccess.id})
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      Hồ sơ của <strong>{submitSuccess.applicantName}</strong> đã được chuyển đến Bàn Điều Phối Đối Tác Phát Triển (Trạng thái: <strong>HỒ SƠ MỚI NỘP - APPLIED</strong>).
                    </p>
                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                      <p>• <strong>Người phụ trách:</strong> {submitSuccess.ownerName}</p>
                      <p>• <strong>Quy trình xét duyệt:</strong> Xem xét hồ sơ $\rightarrow$ Trao đổi thống nhất phạm vi $\rightarrow$ Ký thỏa thuận $\rightarrow$ Cấp mã đối tác.</p>
                      <p>• <strong>Cam kết phản hồi:</strong> Trong vòng 8 giờ làm việc qua điện thoại ({submitSuccess.phone}) hoặc email ({submitSuccess.email}).</p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      Nộp thêm hồ sơ khác
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
                {/* 1. Thông tin chung */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    1. Thông tin tổ chức hoặc cá nhân ứng tuyển *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="dev-partner-applicant-name" className="block text-xs text-slate-700 font-medium mb-1">
                        Tên tổ chức hoặc cá nhân *
                      </label>
                      <input
                        id="dev-partner-applicant-name"
                        type="text"
                        required
                        placeholder="Hiệp hội / Doanh nghiệp tư vấn / Họ và tên chuyên gia..."
                        value={formData.applicantName}
                        onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="dev-partner-partner-type" className="block text-xs text-slate-700 font-medium mb-1">
                        Vai trò / Lĩnh vực hoạt động *
                      </label>
                      <select
                        id="dev-partner-partner-type"
                        value={formData.partnerType}
                        onChange={(e) => setFormData(prev => ({ ...prev, partnerType: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      >
                        {Object.values(PARTNER_ROLES).map(r => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dev-partner-website" className="block text-xs text-slate-700 font-medium mb-1">
                        Website / Trang thông tin (Tùy chọn)
                      </label>
                      <input
                        id="dev-partner-website"
                        type="url"
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Đầu mối liên hệ */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    2. Đầu mối liên hệ trực tiếp *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dev-partner-contact-person" className="block text-xs text-slate-700 font-medium mb-1">
                        Người đại diện liên hệ *
                      </label>
                      <input
                        id="dev-partner-contact-person"
                        type="text"
                        required
                        placeholder="Họ và tên..."
                        value={formData.contactPerson}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="dev-partner-role" className="block text-xs text-slate-700 font-medium mb-1">
                        Chức vụ / Vị trí
                      </label>
                      <input
                        id="dev-partner-role"
                        type="text"
                        placeholder="Phó Chủ Tịch / Giám Đốc / Chuyên gia..."
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="dev-partner-email" className="block text-xs text-slate-700 font-medium mb-1">
                        Email làm việc *
                      </label>
                      <input
                        id="dev-partner-email"
                        type="email"
                        required
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="dev-partner-phone" className="block text-xs text-slate-700 font-medium mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        id="dev-partner-phone"
                        type="tel"
                        required
                        placeholder="09xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Mạng lưới tiếp cận & Hình thức phối hợp */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    3. Hình thức phối hợp mong muốn (Chọn ít nhất 1) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                    {Object.values(COOPERATION_TYPES).map(coop => {
                      const isChecked = formData.cooperationTypes.includes(coop.id);
                      return (
                        <label
                          key={coop.id}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                            isChecked ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCooperationType(coop.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
                          />
                          <div>
                            <span className="font-bold block">{coop.title}</span>
                            <span className="text-[11px] text-slate-500">{coop.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div>
                    <label htmlFor="dev-partner-target-desc" className="block text-xs text-slate-700 font-medium mb-1">
                      Mô tả ngắn gọn nhóm doanh nghiệp bạn có thể tiếp cận *
                    </label>
                    <textarea
                      id="dev-partner-target-desc"
                      rows={3}
                      required
                      placeholder="Ví dụ: Khoảng 150 nhà máy gia công cơ khí chính xác tại KCN Sóng Thần & Đồng Nai; hoặc 50 doanh nghiệp dệt may xuất khẩu..."
                      value={formData.targetAudienceDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudienceDescription: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    ></textarea>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      * Bắt buộc theo Mục 24: Chỉ mô tả quy mô nhóm doanh nghiệp. Tuyệt đối không yêu cầu hay tải lên file Excel danh bạ cá nhân.
                    </span>
                  </div>
                </div>

                {/* 4. Đồng thuận */}
                <div className="pt-2">
                  <label htmlFor="dev-partner-consent" className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      id="dev-partner-consent"
                      type="checkbox"
                      required
                      checked={formData.consentAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, consentAccepted: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span>
                      Chúng tôi hiểu rằng đây là bước đăng ký trao đổi ban đầu. Quyền hạn, mã đối tác, phạm vi giới thiệu và cơ chế đối soát sẽ được quy định cụ thể qua Thỏa thuận Hợp tác chính thức sau khi được phê duyệt.
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
                      <span>Đang nộp hồ sơ...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>NỘP HỒ SƠ ĐỐI TÁC PHÁT TRIỂN</span>
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
      {/* 7. FAQ & CHÍNH SÁCH MINH BẠCH (MỤC 20, 21, 22) */}
      {/* ---------------------------------------------------------------------- */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Giải Đáp Thắc Mắc & Chính Sách
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              CÂU HỎI THƯỜNG GẶP VỀ ĐỐI TÁC PHÁT TRIỂN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                1. Tỷ lệ chia sẻ chi phí phát triển đối tác là bao nhiêu?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Mức chia sẻ được quy định rõ trong Thỏa thuận hợp tác theo từng gói dịch vụ (Video xưởng, Hồ sơ số, Vật phẩm) hoặc suất tham gia sự kiện. Hệ thống không áp dụng một con số cứng nhắc mà dựa trên mức độ đóng góp và hỗ trợ thực tế của đối tác (Mục 20).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                2. Nếu khách hàng đã có trên hệ thống trước đó thì xử lý thế nào?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Hệ thống tự động kiểm tra lịch sử giao dịch. Nếu doanh nghiệp đã có tài khoản và hoạt động trước thời điểm giới thiệu, giao dịch sẽ được gắn cờ <code>EXISTING_CUSTOMER</code> theo quy định Mục 16 để đảm bảo tính khách quan cho các bên.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                3. Giới thiệu doanh nghiệp có giúp họ được ưu tiên ghép nối không?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Tuyệt đối không. Thuật toán ghép nối (Supplier Matching) của CHUOICUNGUNG.COM hoàn toàn độc lập, dựa trên năng lực kỹ thuật, chứng chỉ và địa bàn thực tế. Không một khoản phí nào có thể can thiệp để ưu ái nhà cung ứng (Mục 9 & 10).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">
                4. Khi nào đối tác được nhận chi trả đối soát?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Bảng đối soát được lập định kỳ hàng tháng cho các giao dịch đã hoàn tất nghiệm thu và thanh toán 100%. Khoản chi trả được thanh toán chuyển khoản kèm theo biên lai/hóa đơn dịch vụ hợp lệ theo đúng quy định pháp luật thuế (Mục 21 & 43).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
