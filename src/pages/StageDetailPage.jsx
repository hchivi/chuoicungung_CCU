import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass, Building2, Factory, Zap, Users, Sparkles,
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, FileText,
  MapPin, Check, Shield, Wrench, Download, ExternalLink,
  MessageSquare, Layers, Clock, AlertCircle, HelpCircle,
  FolderOpen, ShoppingBag, Eye, UserCheck, Calendar, BookOpen,
  Filter, Tag, Share2, Info
} from 'lucide-react';
import {
  MASTER_SIX_STAGES,
  getStageBySlugOrId,
  getNeedGroupByCode,
  getStagePublicRequirements,
  getStageSourcingDossiers,
  getStageSuppliers,
  getNeedGroupBuyerGuide,
  getStagePrograms,
  getStageRealMetrics,
  verifyStageNeutrality
} from '../data/sixStagesData.js';

export default function StageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận diện Stage hiện tại theo slug hoặc ID
  const currentStage = getStageBySlugOrId(id);
  const stageMetrics = getStageRealMetrics(currentStage.id);

  // Nhóm nhu cầu được chọn (mặc định là nhóm đầu tiên của Stage)
  const [selectedNeedGroupId, setSelectedNeedGroupId] = useState(
    currentStage.needGroups[0]?.phaseId || '1.1'
  );

  // Đọc hash hoặc query param nếu có (VD: #5-3 hoặc #5.3)
  useEffect(() => {
    if (location.hash) {
      const hashClean = location.hash.replace('#', '').replace('-', '.');
      const foundNg = currentStage.needGroups.find(ng => ng.phaseId === hashClean);
      if (foundNg) {
        setSelectedNeedGroupId(foundNg.phaseId);
      }
    } else {
      setSelectedNeedGroupId(currentStage.needGroups[0]?.phaseId || '1.1');
    }
  }, [currentStage.id, location.hash]);

  const selectedNeedGroup = currentStage.needGroups.find(
    ng => ng.phaseId === selectedNeedGroupId
  ) || currentStage.needGroups[0];

  // Dữ liệu cho Need Group đang active
  const buyerGuide = getNeedGroupBuyerGuide(selectedNeedGroup.phaseId);
  const publicRequirements = getStagePublicRequirements(currentStage.id);
  const sourcingDossiers = getStageSourcingDossiers(currentStage.id);
  const suppliers = getStageSuppliers(currentStage.id);
  const programs = getStagePrograms(currentStage.id);

  // Xác định Stage trước và sau (Navigation khám phá, không bắt buộc thứ tự)
  const prevStageIndex = (currentStage.id - 2 + 6) % 6;
  const nextStageIndex = currentStage.id % 6;
  const prevStage = MASTER_SIX_STAGES[prevStageIndex];
  const nextStage = MASTER_SIX_STAGES[nextStageIndex];

  // Dynamic Theme Colors
  const stageThemeMap = {
    1: { color: "#8b5cf6", bgLight: "bg-purple-50", textCol: "text-purple-700", borderCol: "border-purple-200" },
    2: { color: "#0052cc", bgLight: "bg-blue-50", textCol: "text-blue-700", borderCol: "border-blue-200" },
    3: { color: "#06b6d4", bgLight: "bg-cyan-50", textCol: "text-cyan-700", borderCol: "border-cyan-200" },
    4: { color: "#10b981", bgLight: "bg-emerald-50", textCol: "text-emerald-700", borderCol: "border-emerald-200" },
    5: { color: "#f59e0b", bgLight: "bg-amber-50", textCol: "text-amber-700", borderCol: "border-amber-200" },
    6: { color: "#f43f5e", bgLight: "bg-rose-50", textCol: "text-rose-700", borderCol: "border-rose-200" }
  };
  const theme = stageThemeMap[currentStage.id] || stageThemeMap[1];

  // SEO & Schema (Section 51, 52, 53, 54 & URLs 090-095)
  useEffect(() => {
    document.title = `${currentStage.name} trong vòng đời nhà máy | CHUOICUNGUNG.COM`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://chuoicungung.com/giai-doan/${currentStage.slug}`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Tìm hiểu giai đoạn ${currentStage.name} trong vòng đời nhà máy: các nhóm nhu cầu, bên tham gia, sản phẩm, dịch vụ và nhà cung ứng phù hợp.`;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${currentStage.name} – Nhu Cầu & Nguồn Cung`,
      "description": `Khám phá các nhóm nhu cầu, chuyên mục, sản phẩm, dịch vụ, nhà cung ứng và chương trình liên quan đến ${currentStage.name}.`,
      "url": `https://chuoicungung.com/giai-doan/${currentStage.slug}`,
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
            "name": "Bản đồ 6 giai đoạn",
            "item": "https://chuoicungung.com/ban-do-6-giai-doan"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": currentStage.name,
            "item": `https://chuoicungung.com/giai-doan/${currentStage.slug}`
          }
        ]
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": currentStage.needGroups.map((ng, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": ng.name,
          "description": ng.shortDescription
        }))
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'stage-detail-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('stage-detail-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('stage-detail-schema');
      if (el) el.remove();
    };
  }, [currentStage]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-24 overflow-hidden">
      {/* 1. HERO SECTION (Section 9) */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb (Section 54) */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/ban-do-6-giai-doan" className="hover:text-blue-600">Bản đồ 6 giai đoạn</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-semibold">{currentStage.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-slate-900 text-white">
                  GIAI ĐOẠN 0{currentStage.id}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.bgLight} ${theme.textCol}`}>
                  Mã: {currentStage.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentStage.enName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Giai đoạn {currentStage.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Khám phá các nhóm nhu cầu, sản phẩm, dịch vụ và nguồn cung thường liên quan đến giai đoạn này.
              </p>

              {/* BẮT BUỘC: Note nhỏ về tính phi tuần tự (Section 4, 9) */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>Lưu ý:</strong> Các nhóm công việc có thể diễn ra đồng thời. Cấu trúc 6 giai đoạn được CHUOICUNGUNG.COM sử dụng như một lớp ngữ cảnh để giúp doanh nghiệp định vị nhu cầu, không phải là một quy trình pháp lý bắt buộc phải hoàn thành tuần tự.
                </span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <a
                href="#nhom-nhu-cau"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors text-center cursor-pointer"
              >
                <span>XEM NHU CẦU THEO GIAI ĐOẠN</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to={`/nha-cung-ung?stage=${currentStage.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors text-center"
              >
                <Factory className="w-4 h-4 text-slate-500" />
                <span>TÌM ĐƠN VỊ PHÙ HỢP</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PREVIOUS / NEXT STAGE NAVIGATION (Section 10) */}
      <section className="bg-slate-100/80 border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <Link
            to={`/giai-doan/${prevStage.slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giai đoạn trước:</span>
            <strong>{prevStage.name}</strong>
          </Link>

          <Link
            to="/ban-do-6-giai-doan"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800"
          >
            Bản đồ 6 giai đoạn
          </Link>

          <Link
            to={`/giai-doan/${nextStage.slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <span className="hidden sm:inline">Giai đoạn tiếp theo:</span>
            <strong>{nextStage.name}</strong>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* 3. KHỐI 3 NHÓM CÔNG VIỆC CỐT LÕI (Section 11, 12) */}
        <section id="nhom-nhu-cau" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Cấu trúc công việc</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                3 Nhóm Nhu Cầu Cốt Lõi Của Giai Đoạn 0{currentStage.id}
              </h2>
            </div>
            <span className="text-xs text-slate-500">Bấm vào từng nhóm để xem chi tiết danh mục & nhà cung ứng</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStage.needGroups.map((ng) => {
              const isActive = selectedNeedGroupId === ng.phaseId;

              return (
                <div
                  key={ng.id}
                  onClick={() => setSelectedNeedGroupId(ng.phaseId)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      Nhóm {ng.code || ng.phaseId}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                        Đang xem
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {ng.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {ng.shortDescription}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ng.categories?.length || 0} chuyên mục ngành</span>
                    <span className="font-bold text-blue-600 flex items-center gap-1">
                      Chi tiết <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. CHI TIẾT NHÓM NHU CẦU ĐƯỢC CHỌN (Section 13, 14, 15, 16, 17, 18) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header nhóm nhu cầu */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Khám Phá Chi Tiết Nhóm {selectedNeedGroup.code || selectedNeedGroup.phaseId}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {selectedNeedGroup.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {selectedNeedGroup.shortDescription}
            </p>
          </div>

          {/* 4.1 BẠN CÓ THỂ ĐANG CẦN (Categories & Keywords - Section 14, 15, 16) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              BẠN CÓ THỂ ĐANG CẦN (Chuyên Mục & Từ Khóa Cung Ứng):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedNeedGroup.categories?.map((cat, cIdx) => (
                <div key={cIdx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <Link
                    to={`/nganh-nghe/${cat.slug}`}
                    className="font-bold text-xs text-blue-700 hover:underline flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  {/* Keywords */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cat.keywords?.map((kw, kwIdx) => (
                      <Link
                        key={kwIdx}
                        to={`/tu-khoa/${cat.slug}`}
                        className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded hover:border-blue-400"
                      >
                        #{kw}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4.2 BUYER GUIDE: BẠN NÊN CHUẨN BỊ GÌ TRƯỚC KHI TÌM NCC (Section 18, 19) */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/50 border border-amber-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-900">
              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
              <h4 className="text-sm sm:text-base font-bold">
                TRƯỚC KHI TÌM NHÀ CUNG ỨNG, BẠN NÊN CHUẨN BỊ GÌ? (Buyer Preparation Guide)
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              {buyerGuide.map((item, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/60">
              <span className="text-[11px] text-amber-800 italic">
                Đã chuẩn bị đủ thông tin? Đăng đề bài trực tiếp để nhận báo giá đối soát.
              </span>
              <Link
                to={`/dang-nhu-cau?stageId=${currentStage.id}&needGroupId=${selectedNeedGroup.phaseId}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Đăng Nhu Cầu Cho Nhóm Này
              </Link>
            </div>
          </div>

          {/* 4.3 NHU CẦU ĐANG ĐƯỢC PHÉP CHIA SẺ (Section 21, 22) */}
          {publicRequirements && publicRequirements.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Thị trường B2B</span>
                  <h4 className="text-base font-bold text-slate-900">
                    Nhu Cầu Thực Tế Đang Chờ Báo Giá ({publicRequirements.length})
                  </h4>
                </div>
                <Link to="/san-nhu-cau" className="text-xs text-blue-600 font-semibold hover:underline">
                  Xem tất cả sàn nhu cầu →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {publicRequirements.map(req => (
                  <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">{req.publicCode}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        {req.deadline}
                      </span>
                    </div>
                    <Link
                      to={`/nhu-cau/${req.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 line-clamp-2"
                    >
                      {req.title}
                    </Link>
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{req.industrialPark || req.location}</span>
                      <span className="font-bold text-slate-700">{req.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4.4 BỘ HỒ SƠ TUYỂN CHỌN SOURCING DOSSIERS (Section 30 - Page 35 Integration) */}
          {sourcingDossiers && sourcingDossiers.length > 0 && (
            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Bộ Hồ Sơ Tuyển Chọn (Sourcing Dossiers) Cho Giai Đoạn Này
                  </h4>
                  <p className="text-xs text-slate-600">
                    Danh sách nhà cung ứng đã được sàng lọc kèm tiêu chí kỹ thuật và bằng chứng đối chứng (Page 35).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {sourcingDossiers.map(dos => (
                  <div key={dos.id} className="p-3.5 bg-white border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {dos.publicCode}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Phiên bản: {dos.version}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{dos.title}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{dos.purpose}</p>
                    </div>

                    <Link
                      to={`/bo-ho-so/${dos.slug}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shrink-0 text-center"
                    >
                      Xem Bộ Hồ Sơ
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4.5 NHÀ CUNG ỨNG LIÊN QUAN (Explainable Relevance - Section 23, 26, 27) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Mạng lưới sản xuất</span>
                <h4 className="text-base font-bold text-slate-900">
                  Nhà Cung Ứng Có Hồ Sơ Năng Lực Liên Quan ({suppliers.length})
                </h4>
              </div>
              <Link to="/doanh-nghiep" className="text-xs text-blue-600 font-semibold hover:underline">
                Xem toàn bộ danh bạ →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suppliers.map((sup, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{sup.name}</h5>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {sup.province || 'Toàn quốc'}
                    </span>
                  </div>

                  {/* Explainable Relevance Box (Section 27) */}
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 leading-snug">
                    <strong className="text-blue-800">Lý do liên quan:</strong> {sup.explainableReason}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">{sup.category || 'Công nghiệp phụ trợ'}</span>
                    <Link
                      to={`/doanh-nghiep/${sup.slug || sup.id}`}
                      className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Xem Năng Lực</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4.6 ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC TÁCH BIỆT (Section 33, 34) */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-center text-xs text-slate-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              Quy Chế Minh Bạch Vị Trí Cung Ứng
            </span>
            <span>
              Các doanh nghiệp đồng hành hoặc tài trợ chuyên mục được ghi nhận riêng biệt và tuyệt đối không làm sai lệch tính khách quan của danh sách đối soát theo tiêu chuẩn kỹ thuật của Buyer.
            </span>
          </div>
        </section>

        {/* 5. CTA CUỐI TRANG & DIALOGUE TRỢ LÝ (Section 19, 20) */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-8 sm:p-10 text-center shadow-lg space-y-4">
          <h3 className="text-xl sm:text-2xl font-black">
            Bạn Đang Ở Giai Đoạn 0{currentStage.id} Và Cần Đơn Vị Đồng Hành?
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Hệ sinh thái CHUOICUNGUNG.COM sẵn sàng hỗ trợ khảo sát mặt bằng, kết nối tổng thầu xây dựng, xưởng gia công phụ trợ và cung ứng vật tư vận hành theo đúng yêu cầu riêng của bạn.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to={`/dang-nhu-cau?stageId=${currentStage.id}&needGroupId=${selectedNeedGroup.phaseId}`}
              className="px-6 py-3 bg-white text-blue-800 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-blue-50 transition-colors"
            >
              Đăng Nhu Cầu Ngay
            </Link>
            <Link
              to="/ban-do-6-giai-doan"
              className="px-6 py-3 bg-blue-850 hover:bg-blue-900 border border-blue-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
            >
              Khám Phá Toàn Bộ 6 Giai Đoạn
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
