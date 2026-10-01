import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight,
  Clock, MapPin, Calendar, Building2, Package, Check, X,
  ExternalLink, Download, MessageSquare, History, ChevronRight,
  Sparkles, Filter, Info, Eye, Layers, Share2, HelpCircle, AlertCircle,
  FileCheck, Lock, UserCheck
} from 'lucide-react';
import {
  DOSSIER_VISIBILITY,
  DOSSIER_STATUSES,
  ENTRY_STATUSES,
  MATCH_REASON_TYPES,
  getDossierBySlug,
  submitDossierAdjustmentRequest,
  exportDossierSummary
} from '../data/sourcingDossiersData.js';

export default function SourcingDossierDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mô phỏng User Session (Buyer hoặc Anonymous)
  const [currentUser, setCurrentUser] = useState({
    userId: 'USER-BUYER-001',
    fullName: 'Trưởng Phòng Mua Hàng FDI',
    role: 'BUYER'
  });

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState('');

  // Interactive Adjustment Modal state
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState('ADD_CRITERION');
  const [adjustmentDesc, setAdjustmentDesc] = useState('');
  const [adjustmentSuccess, setAdjustmentSuccess] = useState(false);

  // Active filter trong danh sách ứng viên
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    try {
      setLoading(true);
      setAccessError('');
      const data = getDossierBySlug(slug, currentUser);
      if (!data) {
        setAccessError('Không tìm thấy bộ hồ sơ tuyển chọn.');
      } else {
        setDossier(data);
      }
    } catch (err) {
      setAccessError(err.message || 'Lỗi truy cập bộ hồ sơ.');
    } finally {
      setLoading(false);
    }
  }, [slug, currentUser]);

  // SEO Setup (Section 40, 41)
  useEffect(() => {
    if (dossier) {
      document.title = `${dossier.title} | CHUOICUNGUNG.COM`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = dossier.purpose ? dossier.purpose.substring(0, 160) : `Bộ hồ sơ tuyển chọn nhà cung ứng: ${dossier.title}`;

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://chuoicungung.com/bo-ho-so/${dossier.slug}`;

      // Nếu là hồ sơ riêng tư (PRIVATE) -> Chặn tìm kiếm (NOINDEX)
      if (dossier.visibility === DOSSIER_VISIBILITY.PRIVATE) {
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (!metaRobots) {
          metaRobots = document.createElement('meta');
          metaRobots.name = 'robots';
          document.head.appendChild(metaRobots);
        }
        metaRobots.content = 'noindex, nofollow';
      } else {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": dossier.title,
          "description": dossier.purpose,
          "datePublished": dossier.publishedAt || dossier.createdAt,
          "dateModified": dossier.updatedAt,
          "author": {
            "@type": "Organization",
            "name": dossier.preparedBy?.team || "CHUOICUNGUNG.COM Sourcing Desk"
          },
          "publisher": {
            "@type": "Organization",
            "name": "CHUOICUNGUNG.COM",
            "url": "https://chuoicungung.com"
          },
          "mainEntityOfPage": `https://chuoicungung.com/bo-ho-so/${dossier.slug}`
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'sourcing-dossier-schema';
        script.text = JSON.stringify(schemaData);
        const old = document.getElementById('sourcing-dossier-schema');
        if (old) old.remove();
        document.head.appendChild(script);
      }
    }

    return () => {
      const el = document.getElementById('sourcing-dossier-schema');
      if (el) el.remove();
    };
  }, [dossier]);

  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();
    if (!adjustmentDesc.trim()) return;

    try {
      submitDossierAdjustmentRequest(dossier.id, {
        type: adjustmentType,
        description: adjustmentDesc
      }, currentUser);

      setAdjustmentSuccess(true);
      setAdjustmentDesc('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExport = () => {
    try {
      const exportedData = exportDossierSummary(dossier.slug, currentUser);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportedData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Dossier_${dossier.publicCode}_Summary.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Đang tải bộ hồ sơ tuyển chọn...
      </div>
    );
  }

  if (accessError || !dossier) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Truy Cập Bị Giới Hạn</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {accessError || 'Bộ hồ sơ này thuộc diện bảo mật riêng tư của Buyer hoặc không tồn tại.'}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/san-nhu-cau"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg"
            >
              Về Sàn Nhu Cầu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredCandidates = dossier.candidates?.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  }) || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-20">
      {/* 1. HERO SECTION (Section 8) */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/san-nhu-cau" className="hover:text-blue-600">Nhu cầu B2B</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">Bộ hồ sơ tuyển chọn</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                  {dossier.publicCode}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  dossier.visibility === DOSSIER_VISIBILITY.PUBLIC
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {dossier.visibility === DOSSIER_VISIBILITY.PUBLIC ? 'HỒ SƠ CÔNG KHAI' : 'BẢO MẬT RIÊNG TƯ'}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Phiên bản: {dossier.version}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {dossier.title}
              </h1>

              {/* Metadata tags */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 pt-1">
                {dossier.categoryName && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{dossier.categoryName}</span>
                  </div>
                )}
                {dossier.industrialParkName && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{dossier.industrialParkName}</span>
                  </div>
                )}
                {dossier.requirementId && (
                  <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                    <FileText className="w-4 h-4" />
                    <Link to={`/nhu-cau/${dossier.requirementId}`} className="hover:underline">
                      Khớp đề bài: {dossier.requirementId}
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>Cập nhật: {new Date(dossier.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (CTA Xem năng lực / Gửi nhu cầu) */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <a
                href="#danh-sach-ung-vien"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                <span>Xem năng lực</span>
              </a>

              <Link
                to={`/dang-nhu-cau?dossier=${dossier.slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Gửi nhu cầu</span>
              </Link>

              <button
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs rounded-xl border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Xuất bản tóm tắt</span>
              </button>
            </div>
          </div>

          {/* Cảnh báo tính thời sự (Section 35) */}
          {dossier.isOutdatedWarning && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Thông tin nhà cung ứng đã có cập nhật sau lần lập bộ hồ sơ này. Vui lòng đối soát phiên bản mới nhất.</span>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* 2. MỤC ĐÍCH BỘ HỒ SƠ (Section 9) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Mục Đích Bộ Hồ Sơ</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Đề Bài Tuyển Chọn Cụ Thể</h2>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 rounded-xl">
            {dossier.purpose}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>Đơn vị lập hồ sơ: <strong className="text-slate-700">{dossier.preparedBy?.team}</strong></span>
            <span>Chuyên viên phụ trách: <strong className="text-slate-700">{dossier.preparedBy?.role}</strong></span>
          </div>
        </section>

        {/* 3. TIÊU CHÍ LỰA CHỌN CÓ NGUỒN GỐC (Section 10, 11) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tiêu chuẩn đối soát</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Tiêu Chí Tuyển Chọn (Structured Criteria)</h2>
            </div>
            <span className="text-xs text-slate-500">Mọi tiêu chí đều có nguồn đối soát cụ thể</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dossier.criteria?.map((crit) => (
              <div key={crit.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-slate-800">{crit.label}</span>
                  {crit.required && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded shrink-0">
                      Bắt buộc
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-900 font-semibold mt-1.5">{crit.expectedValue}</p>
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Nguồn: <strong className="text-slate-600">{crit.source}</strong></span>
                  <span className="font-mono text-slate-400">{crit.id}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DANH SÁCH ỨNG VIÊN ĐƯỢC XEM XÉT (Section 12, 13, 14, 15, 16, 17, 18) */}
        <section id="danh-sach-ung-vien" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Khảo sát & Lựa chọn</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Nhà Cung Ứng Được Xem Xét ({dossier.candidates?.length || 0})
              </h2>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="dossier-status-filter" className="font-semibold text-slate-500">Lọc theo:</label>
              <select
                id="dossier-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">Tất cả ứng viên</option>
                <option value={ENTRY_STATUSES.SHORTLISTED}>Đã vào Shortlist</option>
                <option value={ENTRY_STATUSES.RESPONDED}>Đã phản hồi</option>
                <option value={ENTRY_STATUSES.CONSIDERED}>Đang xem xét</option>
              </select>
            </div>
          </div>

          {/* Candidate Cards (Mobile responsive chuyển bảng -> card, Section 57) */}
          <div className="space-y-6">
            {filteredCandidates.map((cand, idx) => (
              <div
                key={cand.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all"
              >
                {/* Header Card */}
                <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Lựa chọn #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cand.status === ENTRY_STATUSES.SHORTLISTED
                          ? 'bg-emerald-100 text-emerald-800'
                          : cand.status === ENTRY_STATUSES.RESPONDED
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cand.status === ENTRY_STATUSES.SHORTLISTED ? '✓ ĐÃ VÀO SHORTLIST' : cand.status}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {cand.supplierName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/doanh-nghiep/${cand.supplierSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                    >
                      <span>Xem Hồ Sơ Số Gốc</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* BẮT BUỘC: LÝ DO ĐƯA VÀO (Section 15) */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      ★ LÝ DO ĐƯA VÀO BỘ HỒ SƠ TUYỂN CHỌN (Explainable Reason)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      "{cand.inclusionReason}"
                    </p>
                    {cand.matchReasons && cand.matchReasons.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-blue-200/60 flex flex-wrap gap-2">
                        {cand.matchReasons.map((m, mIdx) => (
                          <span
                            key={mIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-900 bg-white border border-blue-200 px-2 py-0.5 rounded"
                          >
                            <Check className="w-3 h-3 text-blue-600" />
                            <span>{m.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CHECKLIST ĐỐI SOÁT TIÊU CHÍ (Thay thế Opaque Score - Section 17) */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Đối soát mức độ thỏa mãn tiêu chí:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {cand.criteriaChecklist?.map((chk, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                            chk.met
                              ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {chk.met ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold">{chk.label}</span>
                            <span className="block text-[11px] text-slate-500 mt-0.5">{chk.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* THÔNG TIN CẦN XÁC NHẬN (Missing Information - Section 18, 19) */}
                  {cand.missingInformation && cand.missingInformation.length > 0 && (
                    <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900 uppercase">
                          Thông Tin Cần Xác Nhận Tiếp Theo (Missing Info)
                        </span>
                      </div>
                      <div className="space-y-2">
                        {cand.missingInformation.map((miss, mIdx) => (
                          <div key={mIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs bg-white p-2.5 rounded-lg border border-amber-200">
                            <div>
                              <span className="font-semibold text-slate-800">{miss.label}:</span>
                              <span className="text-slate-600 ml-1">{miss.note}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                              miss.status === 'ĐÃ CÓ THÔNG TIN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : miss.status === 'CHỜ NCC PHẢN HỒI'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {miss.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BẰNG CHỨNG XÁC THỰC (Evidence - Section 20) */}
                  {cand.evidenceList && cand.evidenceList.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Bằng chứng / Tài liệu đối chứng đính kèm:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cand.evidenceList.map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            className="inline-flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                          >
                            <FileCheck className="w-4 h-4 text-blue-600" />
                            <span>{ev.title}</span>
                            {ev.verified && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Đã xác minh
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION BAR CHO TỪNG NHÀ CUNG ỨNG (Section 31, 32) */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 italic">
                      Hành động kết nối chính ngạch theo quy trình hệ thống:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/yeu-cau-dich-vu?service=mau-doi-chung&supplier=${cand.supplierSlug}&dossier=${dossier.slug}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                      >
                        Yêu Cầu Mẫu Thử
                      </Link>
                      <Link
                        to={`/yeu-cau-dich-vu?service=hen-gap-b2b&supplier=${cand.supplierSlug}&dossier=${dossier.slug}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                      >
                        Đề Nghị Cuộc Gặp
                      </Link>
                      <Link
                        to={`/dang-nhu-cau?targetSupplier=${cand.supplierSlug}&dossierId=${dossier.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
                      >
                        Yêu Cầu Báo Giá
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. KHỐI ĐỐI TÁC TÀI TRỢ CHUYÊN MỤC TÁCH BIỆT (Section 25, 26) */}
        <section className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Minh Bạch Thương Mại (Section 25, 26)
          </span>
          <h4 className="text-sm font-bold text-slate-800">
            Cam Kết Tính Trung Lập Của Bộ Hồ Sơ Tuyển Chọn
          </h4>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto mt-1 leading-relaxed">
            Các đơn vị tài trợ hoặc đối tác thương mại tuyệt đối không được phép mua vị trí hay thay thế tiêu chí tuyển chọn của Buyer. Mọi nhà cung ứng xuất hiện trong danh sách đều phải chứng minh năng lực thực tế.
          </p>
        </section>

        {/* 6. LỊCH SỬ PHIÊN BẢN (Section 33, 34) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">Lịch Sử Phiên Bản Bộ Hồ Sơ</h3>
          </div>
          <div className="space-y-3">
            {dossier.versions?.map((ver, vIdx) => (
              <div key={vIdx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {ver.version}
                    </span>
                    <span className="text-slate-500 text-[11px]">{new Date(ver.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="text-slate-700">{ver.summary}</p>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">Người lập: {ver.createdBy}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CTA CUỐI TRANG (Section 27) */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-8 sm:p-10 text-center shadow-lg">
          <h3 className="text-xl sm:text-2xl font-black">Bạn Có Đề Bài Tuyển Chọn Cần Lập Bộ Hồ Sơ Riêng?</h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
            Đội ngũ chuyên viên điều phối Chuỗi Cung Ứng sẽ hỗ trợ khảo sát năng lực thực tế, xây dựng tiêu chí kỹ thuật và chuẩn bị Sourcing Dossier riêng biệt cho doanh nghiệp của bạn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to={`/dang-nhu-cau?sourceDossierId=${dossier.id}`}
              className="px-6 py-3 bg-white text-blue-800 font-bold text-sm rounded-xl shadow hover:bg-blue-50 transition-colors"
            >
              Gửi Đề Bài / Nhu Cầu Của Bạn
            </Link>
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="px-6 py-3 bg-blue-850 hover:bg-blue-900 border border-blue-400 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Yêu Cầu Bổ Sung Ứng Viên
            </button>
          </div>
        </section>
      </div>

      {/* MODAL: BUYER ADJUSTMENT REQUEST (Section 28, 29) */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => { setShowAdjustmentModal(false); setAdjustmentSuccess(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {adjustmentSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Đã Gửi Yêu Cầu Điều Chỉnh!</h4>
                <p className="text-xs text-slate-600">
                  Tổ điều phối sẽ tiếp nhận, đối soát và cập nhật phiên bản mới cho bộ hồ sơ trong vòng 24 giờ làm việc.
                </p>
                <button
                  onClick={() => { setShowAdjustmentModal(false); setAdjustmentSuccess(false); }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Yêu Cầu Điều Chỉnh Bộ Hồ Sơ</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hồ sơ: <strong className="text-slate-700">{dossier.title}</strong>
                  </p>
                </div>

                <div>
                  <label htmlFor="dossier-adjustment-type" className="block text-xs font-semibold text-slate-700 mb-1">Loại yêu cầu điều chỉnh</label>
                  <select
                    id="dossier-adjustment-type"
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
                  >
                    <option value="ADD_CRITERION">Thêm tiêu chí tuyển chọn mới</option>
                    <option value="REMOVE_CRITERION">Bỏ bớt tiêu chí không cần thiết</option>
                    <option value="ASK_SUPPLIER_INFO">Yêu cầu NCC bổ sung thông tin còn thiếu</option>
                    <option value="ADD_SUPPLIER">Đề xuất thêm nhà cung ứng mới vào hồ sơ</option>
                    <option value="REMOVE_CANDIDATE">Loại bớt ứng viên khỏi danh sách xem xét</option>
                    <option value="REQUEST_SAMPLE">Yêu cầu gửi mẫu đối chứng trực tiếp</option>
                    <option value="REQUEST_MEETING">Đề nghị sắp xếp phiên gặp gỡ B2B 1:1</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dossier-adjustment-desc" className="block text-xs font-semibold text-slate-700 mb-1">Mô tả cụ thể nội dung yêu cầu</label>
                  <textarea
                    id="dossier-adjustment-desc"
                    rows={4}
                    required
                    placeholder="Mô tả tiêu chí cần thêm, thông số kỹ thuật mới hoặc yêu cầu gửi mẫu..."
                    value={adjustmentDesc}
                    onChange={(e) => setAdjustmentDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjustmentModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Gửi Yêu Cầu Điều Chỉnh
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
