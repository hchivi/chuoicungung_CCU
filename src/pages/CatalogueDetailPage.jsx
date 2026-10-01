import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Printer, 
  Globe, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Search, 
  Filter, 
  ExternalLink, 
  Send, 
  Clock, 
  Crown, 
  Info, 
  AlertTriangle,
  MessageSquare,
  FileText,
  Share2,
  Lock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  getCatalogueBySlug, 
  getPublicApprovedEntries,
  generateCatalogueQrDestinationUrl,
  trackCatalogueQrScan,
  CATALOGUE_TYPES,
  CATALOGUE_STATUSES,
  UPCOMING_EDITIONS_CALL_FOR_PAPERS
} from '../data/cataloguesData';
import CatalogueParticipationModal from '../components/catalogues/CatalogueParticipationModal';
import CatalogueBusinessRequestModal from '../components/catalogues/CatalogueBusinessRequestModal';

export default function CatalogueDetailPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedEditionId = searchParams.get('edition');

  const [catalogue, setCatalogue] = useState(null);
  const [activeEditionId, setActiveEditionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  
  // Modals
  const [isParticipationModalOpen, setIsParticipationModalOpen] = useState(false);
  const [selectedEntryForRequest, setSelectedEntryForRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Load Catalogue
  useEffect(() => {
    const found = getCatalogueBySlug(slug);
    if (found) {
      setCatalogue(found);
      const defaultEdId = requestedEditionId || found.currentEditionId || found.editions?.[0]?.id;
      setActiveEditionId(defaultEdId);
    }
  }, [slug, requestedEditionId]);

  // Current selected edition
  const currentEdition = useMemo(() => {
    if (!catalogue) return null;
    return (catalogue.editions || []).find(e => e.id === activeEditionId) || catalogue.editions?.[0];
  }, [catalogue, activeEditionId]);

  // Is viewing historical/archived edition
  const isArchivedEdition = useMemo(() => {
    if (!currentEdition || !catalogue) return false;
    return currentEdition.status === 'ARCHIVED' || (catalogue.currentEditionId && currentEdition.id !== catalogue.currentEditionId);
  }, [currentEdition, catalogue]);

  // Approved Entries only (Section 9 & 14)
  const approvedEntries = useMemo(() => {
    if (!currentEdition) return [];
    return getPublicApprovedEntries(currentEdition);
  }, [currentEdition]);

  // Filtered Entries inside this Catalogue (Section 16 & 17)
  const filteredEntries = useMemo(() => {
    let list = approvedEntries;
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(e => {
        const matchOrg = (e.organizationName || '').toLowerCase().includes(q);
        const matchTitle = (e.contentSnapshot?.title || '').toLowerCase().includes(q);
        const matchSummary = (e.contentSnapshot?.summary || '').toLowerCase().includes(q);
        const matchCaps = (e.contentSnapshot?.keyCapabilities || []).some(c => c.toLowerCase().includes(q));
        const matchAddr = (e.contentSnapshot?.address || '').toLowerCase().includes(q);
        return matchOrg || matchTitle || matchSummary || matchCaps || matchAddr;
      });
    }

    if (filterCategory !== 'ALL') {
      list = list.filter(e => e.categoryId === filterCategory);
    }

    return list;
  }, [approvedEntries, searchTerm, filterCategory]);

  // Unique categories in this catalogue edition
  const entryCategories = useMemo(() => {
    const map = new Map();
    approvedEntries.forEach(e => {
      if (e.categoryId && e.categoryName) {
        map.set(e.categoryId, e.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [approvedEntries]);

  // Dynamic SEO & Structured Data (Section 54, 55)
  useEffect(() => {
    if (!catalogue) return;

    const pageTitle = `${catalogue.title} | CHUOICUNGUNG.COM`;
    document.title = pageTitle;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Xem ${catalogue.title}, danh sách doanh nghiệp đã duyệt, chủ đề, chương trình và phạm vi phân phối; truy cập hồ sơ doanh nghiệp đang được cập nhật trên CHUOICUNGUNG.COM.`;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://chuoicungung.com/catalogue/${catalogue.slug}`;

    // JSON-LD Structured Data
    let script = document.getElementById('catalogue-detail-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'catalogue-detail-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": catalogue.title,
      "headline": catalogue.title,
      "description": catalogue.shortDescription,
      "datePublished": currentEdition?.publicationDate || catalogue.createdAt,
      "publisher": {
        "@type": "Organization",
        "name": catalogue.publisherName || "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": `https://chuoicungung.com/catalogue/${catalogue.slug}`
    });

    // Analytics event
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'catalogue_detail_view',
        catalogueId: catalogue.id,
        editionId: currentEdition?.id
      });
    }
  }, [catalogue, currentEdition]);

  // Handlers
  const handleEditionSwitch = (edId) => {
    setActiveEditionId(edId);
    setSearchParams({ edition: edId });
  };

  const handleSimulatedScan = (entry) => {
    trackCatalogueQrScan(catalogue.id, currentEdition?.id, entry?.id);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'catalogue_qr_scan',
        catalogueId: catalogue.id,
        editionId: currentEdition?.id,
        entryId: entry?.id
      });
    }
    alert(`[QUÉT MÃ QR ĐỊNH DANH]\n\n• Doanh nghiệp: ${entry.organizationName}\n• Ấn bản: ${currentEdition?.editionCode}\n• Destination URL: ${entry.canonicalUrl}\n\nQuy tắc hệ thống: "Quét mã QR chỉ dẫn về hồ sơ số đang cập nhật, KHÔNG tự động coi là Nhu cầu Mua hàng (Buyer Need)."`);
  };

  const handleOpenBusinessRequest = (entry) => {
    setSelectedEntryForRequest(entry);
    setIsRequestModalOpen(true);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'catalogue_request_click',
        catalogueId: catalogue.id,
        editionId: currentEdition?.id,
        entryId: entry.id
      });
    }
  };

  const handleDownloadPdf = () => {
    if (currentEdition?.fileUrl) {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'catalogue_pdf_download',
          catalogueId: catalogue.id,
          editionId: currentEdition?.id
        });
      }
      alert(`Đang mở tải về tài liệu: ${catalogue.title}\nẤn bản: ${currentEdition.editionCode} (${currentEdition.fileSize || 'PDF'})\n\nLưu ý: Mọi mã QR trên bản in đều dẫn về hồ sơ số đang được cập nhật liên tục.`);
      window.open(currentEdition.fileUrl, '_blank');
    } else {
      alert('Ấn bản này hiện phát hành dưới dạng Bản Số Trực Tuyến (Digital First). Quý khách có thể xem đầy đủ nội dung trực tiếp trên trang web.');
    }
  };

  if (!catalogue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
            📚
          </div>
          <h2 className="text-lg font-bold text-slate-900">Không tìm thấy catalogue yêu cầu</h2>
          <p className="text-xs text-slate-500">
            Ấn phẩm không tồn tại hoặc đã được chuyển sang chế độ lưu trữ nội bộ.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center space-x-1.5 py-2.5 px-5 bg-blue-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>Quay lại Danh Sách Catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  const typeConfig = CATALOGUE_TYPES[catalogue.catalogueType] || CATALOGUE_TYPES.CATEGORY_CATALOGUE;
  const statusConfig = CATALOGUE_STATUSES[currentEdition?.status] || CATALOGUE_STATUSES.PUBLISHED_DIGITAL;

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* 1. Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/catalogue" className="hover:text-blue-600 transition">Catalogue & Ấn Phẩm</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-800 truncate max-w-xs">{catalogue.title}</span>
          </nav>
        </div>
      </div>

      {/* 2. Archived Edition Alert Banner (Section 38 & 39) */}
      {isArchivedEdition && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2.5 text-xs text-center border-b border-amber-600 shadow-xs flex items-center justify-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Bạn đang xem <strong>ẤN BẢN LƯU TRỮ ({currentEdition?.editionCode})</strong> phát hành ngày {currentEdition?.publicationDate}. 
          </span>
          {catalogue.currentEditionId && (
            <button
              onClick={() => handleEditionSwitch(catalogue.currentEditionId)}
              className="underline font-black hover:text-white transition ml-2 cursor-pointer"
            >
              Chuyển sang ấn bản hiện hành mới nhất →
            </button>
          )}
        </div>
      )}

      {/* 3. Hero Section (Section 3 Spec 31.txt) */}
      <header className="relative bg-gradient-to-b from-[#072847] via-[#0b3f6d] to-[#0052cc] text-white pt-8 sm:pt-12 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Metadata & CTAs (7 Cols) */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              
              {/* Type and Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-sm ${typeConfig.badgeClass}`}>
                  {typeConfig.label}
                </span>

                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{statusConfig.label}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-black/40 text-amber-300 border border-white/10">
                  {currentEdition?.editionCode || 'ED-2026'}
                </span>
              </div>

              {/* H1 Title (Section 3) */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading leading-tight tracking-tight text-white">
                {catalogue.title}
              </h1>

              {/* Subtitle (Section 3) */}
              <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed font-normal max-w-3xl">
                Ấn phẩm tổng hợp các hồ sơ doanh nghiệp đã được duyệt theo <strong>{catalogue.topic || catalogue.categoryName}</strong>. Mỗi doanh nghiệp được liên kết về hồ sơ số để xem thông tin đang được cập nhật.
              </p>

              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-300 pt-1 border-t border-white/15">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-300" />
                  <span>Ngày phát hành: <strong className="text-white">{currentEdition?.publicationDate}</strong></span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chủ trì: <strong className="text-white">{catalogue.publisherName}</strong></span>
                </div>

                {catalogue.industrialParkName && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Phạm vi: <strong className="text-white">{catalogue.industrialParkName}</strong></span>
                  </div>
                )}
              </div>

              {/* CTAs (Section 3) */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href="#danh-sach-doanh-nghiep"
                  className="py-3 px-6 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>XEM TRỰC TUYẾN</span>
                </a>

                {currentEdition?.fileUrl ? (
                  <button
                    onClick={handleDownloadPdf}
                    type="button"
                    className="py-3 px-6 bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2 backdrop-blur-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-300" />
                    <span>TẢI BẢN PDF ({currentEdition.fileSize || 'PDF'})</span>
                  </button>
                ) : (
                  <span className="py-3 px-4 bg-white/10 border border-white/20 text-slate-300 text-xs rounded-xl flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-300" />
                    <span>Bản Số Trực Tuyến (Digital First)</span>
                  </span>
                )}
              </div>

            </div>

            {/* Right: Cover Image Box (4 Cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl bg-slate-950 aspect-[3/4] group">
                <img 
                  src={catalogue.coverUrl || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'}
                  alt={catalogue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                    ẤN PHẨM BẢN QUYỀN CHUOICUNGUNG.COM
                  </div>
                  <div className="text-xs font-bold line-clamp-1">{catalogue.title}</div>
                  <div className="text-[10px] text-slate-300">
                    Gồm {approvedEntries.length} doanh nghiệp đã KYC & xác minh xưởng
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* 4. Snapshot vs Live Data Notice (Section 5 & 37 Hard Rule) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Nguyên tắc Dữ liệu: Ấn Phẩm Snapshot vs Hồ Sơ Số Trực Tuyến (Section 5 Spec 31.txt)
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nội dung ấn phẩm phản ánh thông tin tại thời điểm phát hành (<strong>{currentEdition?.publicationDate}</strong>). Hồ sơ doanh nghiệp trên website có thể được cập nhật sau đó. Quét mã QR hoặc nhấn nút xem hồ sơ luôn dẫn tới trang canonical trực tuyến mới nhất.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 hidden lg:block">
            <span className="text-[10.5px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 font-bold">
              QR Scan ≠ Lead
            </span>
          </div>
        </div>
      </div>

      {/* 5. Publication Context & Editions Switcher (Section 4, 38, 39) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Editions Switcher (Section 39) */}
        {(catalogue.editions || []).length > 1 && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Các đợt phát hành (Editions History):</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {catalogue.editions.map((ed) => {
                const isSelected = ed.id === currentEdition?.id;
                const isCur = ed.id === catalogue.currentEditionId;

                return (
                  <button
                    key={ed.id}
                    onClick={() => handleEditionSwitch(ed.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{ed.editionCode}</span>
                    {isCur && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Hiện hành
                      </span>
                    )}
                    {ed.status === 'ARCHIVED' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 text-slate-600 font-mono">
                        Lưu trữ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Publication Facts Grid (Section 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chủ đề ấn phẩm:</div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">{catalogue.topic || catalogue.categoryName}</div>
            <div className="text-[10px] text-slate-500 font-mono">Loại: {typeConfig.shortName}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Số lượng in xác nhận:</div>
            <div className="text-sm font-black text-purple-700 font-mono">
              {currentEdition?.confirmedPrintQuantity > 0 ? `${currentEdition.confirmedPrintQuantity.toLocaleString()} cuốn` : 'Bản Số Trực Tuyến'}
            </div>
            <div className="text-[10px] text-slate-500">
              {currentEdition?.distributedQuantity > 0 ? `Đã giao: ${currentEdition.distributedQuantity.toLocaleString()} cuốn` : 'Chưa qua in ấn'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đơn vị chủ trì phát hành:</div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">{catalogue.publisherName}</div>
            <div className="text-[10px] text-slate-500">Bảo chứng dữ liệu Chuỗi Cung Ứng</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phạm vi phân phối:</div>
            <div className="text-xs font-bold text-slate-900 line-clamp-1">
              {currentEdition?.distributionScopeSummary || 'Phát hành tại các hội chợ B2B & KCN'}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold">100% Hồ sơ đã duyệt KYC</div>
          </div>

        </div>

      </div>

      {/* 6. In-Catalogue Search & Table of Contents (Section 8, 16, 17) */}
      <section id="danh-sach-doanh-nghiep" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                DOANH NGHIỆP TRONG ẤN PHẨM ({approvedEntries.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chỉ những doanh nghiệp đạt chuẩn thẩm định KYC và có xác minh xưởng mới được xuất bản.
            </p>
          </div>

          {/* Search within Catalogue */}
          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm NCC trong cuốn này..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-600 transition shadow-2xs"
              />
            </div>

            {entryCategories.length > 1 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none shadow-2xs"
              >
                <option value="ALL">Mọi nhóm ngành</option>
                {entryCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Business Cards Grid (Section 10, 11, 27, 28, 40) */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntries.map((entry, idx) => {
              const qrDestination = generateCatalogueQrDestinationUrl(
                catalogue.id,
                currentEdition?.id,
                entry.id,
                entry.canonicalUrl || `/doanh-nghiep/${entry.organizationId}`
              );

              return (
                <div 
                  key={entry.id || idx}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-5 sm:p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Page Position & Sponsor Label */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center font-mono">
                          #{entry.position || idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">Trang #{entry.position || idx + 1}</span>
                      </div>

                      {entry.sponsorLabel && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                          {entry.sponsorLabel}
                        </span>
                      )}
                    </div>

                    {/* Company Name */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading line-clamp-2">
                      {entry.organizationName}
                    </h3>

                    {/* Snapshot Summary vs Live Info */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {entry.contentSnapshot?.summary || 'Hồ sơ năng lực nhà cung ứng đã được thẩm định và đối chiếu dữ liệu xưởng sản xuất thực tế.'}
                    </p>

                    {/* Key Capabilities */}
                    {entry.contentSnapshot?.keyCapabilities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.contentSnapshot.keyCapabilities.map((cap, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-semibold">
                            ✓ {cap}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Address / Service Area */}
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{entry.contentSnapshot?.address || 'Việt Nam'}</span>
                    </div>

                    {/* Section 16 Dates Comparison */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span>Ấn bản in: {currentEdition?.publicationDate}</span>
                      <span className="text-emerald-700 font-medium">
                        Hồ sơ trực tuyến: {entry.profileLastUpdatedAt ? new Date(entry.profileLastUpdatedAt).toLocaleDateString('vi-VN') : 'Cập nhật liên tục'}
                      </span>
                    </div>

                  </div>

                  {/* Bottom Actions Bar (Section 10, 11, 40) */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    
                    {/* Simulated QR Action (Section 12, 13) */}
                    <button
                      onClick={() => handleSimulatedScan(entry)}
                      type="button"
                      className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                      title="Mô phỏng quét mã QR trên sách in"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Quét Mã QR</span>
                    </button>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      {/* B2B Connection Request (Section 40) */}
                      <button
                        onClick={() => handleOpenBusinessRequest(entry)}
                        type="button"
                        className="flex-1 sm:flex-initial py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow-2xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Gửi Yêu Cầu</span>
                      </button>

                      {/* Canonical Profile Link (Section 11) */}
                      <Link
                        to={entry.canonicalUrl || `/doanh-nghiep/${entry.organizationId}`}
                        className="flex-1 sm:flex-initial py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow-2xs"
                      >
                        <span>Hồ Sơ Trực Tuyến</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            Không tìm thấy doanh nghiệp nào theo từ khóa tìm kiếm.
          </div>
        )}

      </section>

      {/* 7. Program Integration (Section 19 Spec 31.txt) */}
      {catalogue.programId && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-bold uppercase tracking-wider border border-emerald-500/30">
                Chương Trình Kết Nối Đi Kèm
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                {catalogue.programTitle || 'Ngày Hội Chuỗi Cung Ứng Trọng Điểm'}
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                Ấn phẩm này được trao tặng trực tiếp tại sự kiện cho các đoàn mua hàng FDI và doanh nghiệp tham quan.
              </p>
            </div>

            <Link
              to={`/chuong-trinh/${catalogue.programId}`}
              className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shrink-0 flex items-center space-x-1.5"
            >
              <span>XEM CHƯƠNG TRÌNH</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 8. Distribution Batches Summary (Section 22, 23, 24) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-black font-heading text-slate-900">
                PHẠM VI & TIẾN ĐỘ PHÂN PHỐI ẤN PHẨM (DISTRIBUTION REPORT)
              </h3>
              <p className="text-xs text-slate-500">
                Báo cáo các đợt phát hành chính thức đã hoàn tất bàn giao tới tay người nhận.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                Đã bàn giao: {currentEdition?.distributedQuantity?.toLocaleString() || 0} bản
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(currentEdition?.distributionBatches || []).map((batch, bIdx) => (
              <div key={batch.id || bIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{batch.channelLabel}</span>
                  <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {batch.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-1">{batch.location}</div>
                <div className="text-[10.5px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                  Thực tế: <strong className="text-slate-900 font-sans">{batch.actualQuantity} cuốn</strong>
                  {batch.distributedAt && ` • ${batch.distributedAt}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Block: THAM GIA ẤN PHẨM TIẾP THEO (Section 30, 31, 32 Spec 31.txt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#072847] to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10.5px] font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tuyển Chọn Ấn Bản Tiếp Theo</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
              ĐĂNG KÝ THAM GIA ẤN PHẨM MÙA TIẾP THEO
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn là doanh nghiệp sản xuất phụ trợ hoặc cung ứng vật tư công nghiệp? Đăng ký ngay để chuẩn hóa 01 trang hồ sơ năng lực số, nhận mã QR định danh và đưa vào cuốn Catalogue phát hành đợt tiếp theo.
            </p>
            <div className="text-[11px] text-amber-200/90 pt-1">
              ✓ Miễn phí 100% cho Đối tác Sáng lập (Founding Partner) • Xét duyệt theo quy trình 5 bước nghiêm ngặt.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => setIsParticipationModalOpen(true)}
              type="button"
              className="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>ĐĂNG KÝ HỒ SƠ</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to={`/tai-tro?catalogueId=${catalogue.id}&editionId=${currentEdition.id}&type=catalogue`}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>TÀI TRỢ TRANG IN</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Assistant SUPPI Helper Box (Section 41) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              🤖
            </div>
            <div>
              <span className="font-bold block text-slate-900">Trợ Lý AI SUPPI Hỗ Trợ Tìm Nguồn Trong Cuốn Này:</span>
              <span className="text-[11px] text-slate-600">
                Hỏi SUPPI: "Nhà cung ứng nào trong catalogue này có chứng chỉ OEKO-TEX và xưởng may tại TP.HCM?"
              </span>
            </div>
          </div>

          <Link
            to="/tro-ly-ai"
            className="py-2 px-4 bg-white hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition shadow-2xs shrink-0 hidden sm:inline-block"
          >
            Hỏi Suppi Ngay
          </Link>
        </div>
      </section>

      {/* Participation Modal */}
      <CatalogueParticipationModal
        isOpen={isParticipationModalOpen}
        onClose={() => setIsParticipationModalOpen(false)}
        initialEditionId={currentEdition?.id}
        initialCategory={catalogue.categoryName}
      />

      {/* Business Request Modal */}
      <CatalogueBusinessRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        catalogue={catalogue}
        edition={currentEdition}
        entry={selectedEntryForRequest}
      />

    </main>
  );
}
