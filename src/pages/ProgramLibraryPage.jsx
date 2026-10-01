import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Building2, Factory, ArrowRight,
  ChevronRight, Sparkles, Filter, Search, ShoppingCart, Truck,
  Store, Handshake, Info, Award, ArrowLeft, ShieldCheck,
  CheckCircle2, Clock, Globe, DollarSign, AlertCircle, X,
  Send, Camera, FileText, Check, RotateCcw, Tag, ExternalLink,
  ShieldAlert, PhoneCall, Mail, MessageSquare, Download, Layers,
  Lock, QrCode, AlertTriangle, Eye, Video, File, Share2,
  FolderOpen, Compass, CheckSquare
} from 'lucide-react';
import { getProgramByIdOrSlug } from '../data/programsData';
import {
  getProgramLibrary,
  requestAssetDownload,
  createLibraryExchangeRequest,
  MEDIA_TYPE_ENUM,
  MEDIA_VISIBILITY_ENUM,
  DOWNLOAD_PERMISSION_ENUM,
  SESSION_TAGS_ENUM
} from '../data/programLibraryData';

export default function ProgramLibraryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active section tab: 'all' | 'moments' | 'enterprises' | 'videos' | 'documents' | 'next_steps'
  const initialTab = searchParams.get('tab') || 'moments';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // Interactive Lightbox State
  const [lightboxAsset, setLightboxAsset] = useState(null);

  // Video Player Modal State
  const [playingVideo, setPlayingVideo] = useState(null);

  // Exchange Request Modal State (Section 10 & 11)
  const [exchangeTarget, setExchangeTarget] = useState(null); // { organizationId, name, boothCode }
  const [exchangeForm, setExchangeForm] = useState({
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderCompany: '',
    notes: ''
  });
  const [exchangeSubmitting, setExchangeSubmitting] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(null);

  // Simulated User Context (supports guest / participant / admin)
  const [userContext, setUserContext] = useState(() => {
    try {
      const stored = localStorage.getItem('ccu_user_session_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // safe ignore
    }
    return {
      isAuthenticated: false,
      userId: 'guest_user',
      isProgramParticipant: false,
      participatedProgramId: null,
      isAdmin: false
    };
  });

  // Load Program & Library
  const program = useMemo(() => getProgramByIdOrSlug(slug), [slug]);

  const libraryData = useMemo(() => {
    if (!program) return null;
    return getProgramLibrary(program.id, {
      keyword: searchKeyword,
      type: selectedType,
      albumId: selectedAlbum,
      sessionTag: selectedSession
    }, userContext);
  }, [program, searchKeyword, selectedType, selectedAlbum, selectedSession, userContext]);

  // SEO setup (Section 38)
  useEffect(() => {
    if (program) {
      document.title = `Ảnh & Tài Liệu ${program.title || program.name} | CHUOICUNGUNG.COM`;
    } else {
      document.title = 'Thư Viện Ảnh & Tài Liệu Chương Trình | CHUOICUNGUNG.COM';
    }
  }, [program]);

  // Sync tab with URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('tab', tabId);
      return p;
    });
  };

  // Handle Download Request (Section 7 Secure Download)
  const handleDownloadAsset = (asset) => {
    try {
      const res = requestAssetDownload(asset.id, userContext);
      if (res && res.downloadUrl) {
        // Trigger browser download or open in new tab
        const a = document.createElement('a');
        a.href = res.downloadUrl;
        a.download = res.filename || 'tai-lieu-chuong-trinh';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Submit Exchange Request (Section 11)
  const handleExchangeSubmit = (e) => {
    e.preventDefault();
    if (!exchangeTarget) return;

    if (!exchangeForm.senderName.trim() || !exchangeForm.senderPhone.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại liên hệ.');
      return;
    }

    setExchangeSubmitting(true);
    try {
      const res = createLibraryExchangeRequest({
        programId: program.id,
        targetOrganizationId: exchangeTarget.organizationId,
        targetEnterpriseName: exchangeTarget.name,
        senderName: exchangeForm.senderName,
        senderPhone: exchangeForm.senderPhone,
        senderEmail: exchangeForm.senderEmail,
        senderCompany: exchangeForm.senderCompany,
        notes: exchangeForm.notes
      });

      setExchangeSubmitting(false);
      setExchangeSuccess(res.exchangeRequest);
    } catch (err) {
      setExchangeSubmitting(false);
      alert(err.message);
    }
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-900 font-heading">Không tìm thấy chương trình</h2>
          <p className="text-xs text-slate-500">Mã chương trình "{slug}" không tồn tại hoặc đã bị tạm ẩn.</p>
          <Link to="/chuong-trinh" className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
            Quay về danh sách chương trình
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900">
      
      {/* ========================================================
          1. HERO BANNER (SECTION 2 SPEC)
      ======================================================== */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs text-blue-300 font-mono mb-3">
            <Link to="/" className="hover:text-white transition">Trang chủ</Link>
            <span>/</span>
            <Link to="/chuong-trinh" className="hover:text-white transition">Chương trình kết nối</Link>
            <span>/</span>
            <Link to={`/chuong-trinh/${program.slug || program.id}`} className="hover:text-white transition truncate max-w-[200px]">
              {program.shortName || program.title}
            </Link>
            <span>/</span>
            <span className="text-white font-bold">Thư viện ảnh & tư liệu</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20 text-xs font-bold font-mono">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>THƯ VIỆN CHƯƠNG TRÌNH CHÍNH THỨC • {program.publicCode || 'PRG-2026'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white leading-tight">
                ẢNH VÀ TÀI LIỆU TỪ {program.title || program.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Tìm hình ảnh, nội dung giới thiệu và tài liệu được chia sẻ trong chương trình. Bạn có thể xem lại hồ sơ doanh nghiệp hoặc gửi yêu cầu trao đổi tiếp theo.
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{program.date}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[240px]">{program.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-xl">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{program.organizer || 'Ban Quản trị CCU'}</span>
                </div>
              </div>
            </div>

            {/* Back CTA Button (Section 2) */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              <Link
                to={`/chuong-trinh/${program.slug || program.id}`}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-blue-700" />
                <span>Xem Chi Tiết Chương Trình</span>
              </Link>
              <Link
                to={`/chuong-trinh/${program.slug || program.id}/dang-ky`}
                className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
              >
                <span>Hồ Sơ Đăng Ký Của Tôi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. NAVIGATION TABS (5 SECTIONS - SECTION 3)
      ======================================================== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-slate-600">
            <button
              onClick={() => handleTabChange('moments')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'moments'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>01. Khoảnh Khắc Chương Trình ({libraryData?.momentsPhotos?.length || 0})</span>
            </button>

            <button
              onClick={() => handleTabChange('enterprises')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'enterprises'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>02. Gian Hàng & Doanh Nghiệp ({libraryData?.enterpriseShowcases?.length || 0})</span>
            </button>

            <button
              onClick={() => handleTabChange('videos')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>03. Video Giới Thiệu ({libraryData?.videos?.length || 0})</span>
            </button>

            <button
              onClick={() => handleTabChange('documents')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>04. Catalogue & Tài Liệu ({libraryData?.documents?.length || 0})</span>
            </button>

            <button
              onClick={() => handleTabChange('next_steps')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeTab === 'next_steps'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Handshake className="w-4 h-4" />
              <span>05. Hoạt Động Tiếp Theo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. SEARCH & DYNAMIC FILTER BAR (SECTIONS 15, 16, 17)
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên doanh nghiệp, gian hàng, tài liệu, danh mục sản phẩm..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by Album */}
            {libraryData?.albums && libraryData.albums.length > 0 && (
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium"
              >
                <option value="ALL">Tất cả Album ({libraryData.albums.length})</option>
                {libraryData.albums.map(alb => (
                  <option key={alb.id} value={alb.id}>{alb.title}</option>
                ))}
              </select>
            )}

            {/* Filter by Session Tag */}
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium"
            >
              <option value="ALL">Tất cả phiên làm việc</option>
              <option value={SESSION_TAGS_ENUM.OPENING}>Khai mạc & Toạ đàm</option>
              <option value={SESSION_TAGS_ENUM.B2B_MEETING}>Phiên 1:1 trực tiếp</option>
              <option value={SESSION_TAGS_ENUM.BOOTH_SHOWCASE}>Gian hàng trưng bày</option>
              <option value={SESSION_TAGS_ENUM.MASCOT_MOMENTS}>Khoảnh khắc Suppi & Chainy</option>
            </select>

            {/* Clear filters button */}
            {(searchKeyword || selectedAlbum !== 'ALL' || selectedSession !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedAlbum('ALL');
                  setSelectedSession('ALL');
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-600 hover:bg-slate-100 font-bold"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          4. MAIN CONTENT TABS (SECTIONS 8 - 14)
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: KHOẢNH KHẮC CHƯƠNG TRÌNH */}
        {activeTab === 'moments' && (
          <div className="space-y-6">
            
            {/* Mascot Album Highlight (Section 9) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-xs text-amber-900">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-700 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block font-heading text-sm">Album Lưu Niệm Cùng Suppi & Chainy</strong>
                  <p className="text-[11px] text-amber-800">
                    Khoảnh khắc tương tác check-in tại sự kiện. <em>Lưu ý: Hoạt động chụp ảnh nhận diện không thay thế cho kết quả thẩm định năng lực nhà máy chính thức.</em>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(SESSION_TAGS_ENUM.MASCOT_MOMENTS)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition"
              >
                Xem ảnh Mascot
              </button>
            </div>

            {/* Photo Grid */}
            {libraryData?.momentsPhotos?.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Camera className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">Chưa có ảnh nào phù hợp với bộ lọc</h4>
                <p className="text-xs text-slate-400">Vui lòng chọn album khác hoặc xóa từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {libraryData.momentsPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxAsset(photo)}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer flex flex-col"
                  >
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-mono backdrop-blur-xs">
                        {photo.sessionTag || 'KHOẢNH KHẮC'}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2 group-hover:text-blue-600 transition">
                          {photo.title}
                        </h4>
                        {photo.enterpriseName && (
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {photo.enterpriseName}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                        <span>{photo.fileSize || '2.4 MB'}</span>
                        <span className="text-blue-600 font-bold flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Xem ảnh lớn</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: GIAN HÀNG & DOANH NGHIỆP (SECTIONS 10 & 11) */}
        {activeTab === 'enterprises' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Doanh Nghiệp Đã Tham Gia Trưng Bày & Giao Thương
                </h3>
                <p className="text-xs text-slate-500">
                  Xem lại hồ sơ nhà cung cấp đã gặp tại chương trình hoặc gửi yêu cầu kết nối trao đổi chi tiết.
                </p>
              </div>
            </div>

            {libraryData?.enterpriseShowcases?.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">Chưa có thông tin gian hàng</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {libraryData.enterpriseShowcases.map((ent) => (
                  <div
                    key={ent.organizationId}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {ent.coverImage ? (
                            <img src={ent.coverImage} alt={ent.name} className="w-full h-full object-cover" />
                          ) : (
                            ent.name.charAt(0)
                          )}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                          {ent.boothCode}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                          {ent.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-1">
                          {ent.name}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {ent.capabilitySnippet}
                        </p>
                      </div>
                    </div>

                    {/* CTAs (Section 10 & 11) */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        to={`/doanh-nghiep/${ent.slug || ent.organizationId}`}
                        className="flex-1 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center transition"
                      >
                        Xem Hồ Sơ
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setExchangeTarget(ent);
                          setExchangeSuccess(null);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs text-center transition shadow-xs flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Gửi Trao Đổi</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIDEO GIỚI THIỆU (SECTION 12) */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Video Giới Thiệu Năng Lực & Trực Quan Xưởng Sản Xuất
                </h3>
                <p className="text-xs text-slate-500">
                  Video thực tế ghi nhận máy móc, công nghệ và năng lực đáp ứng đơn hàng của các nhà máy tham gia.
                </p>
              </div>
            </div>

            {libraryData?.videos?.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
                <Video className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">Chưa có video được xuất bản</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryData.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => setPlayingVideo(vid)}
                        className="relative aspect-video bg-slate-900 cursor-pointer group"
                      >
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:opacity-85 transition"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Video className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                          {vid.duration || '01:30'}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          {vid.enterpriseName || 'Doanh nghiệp CCU'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {vid.caption || vid.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {vid.language || 'Tiếng Việt'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPlayingVideo(vid)}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Phát video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATALOGUE & TÀI LIỆU (SECTIONS 13 & 14) */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Kỷ Yếu, E-Catalogue & Báo Cáo Chuyên Đề
                </h3>
                <p className="text-xs text-slate-500">
                  Tài liệu chính thức do Ban tổ chức và các doanh nghiệp cung cấp theo quyền chia sẻ được duyệt.
                </p>
              </div>

              {/* Security notice Section 14 */}
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-mono flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dữ liệu CRM, báo giá và ghi chú đàm phán được bảo mật tuyệt đối</span>
              </div>
            </div>

            {libraryData?.documents?.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">Chưa có tài liệu công khai</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {libraryData.documents.map((doc) => {
                  const isParticipantOnly = doc.visibility === MEDIA_VISIBILITY_ENUM.PROGRAM_PARTICIPANTS;
                  const canDownload = doc.downloadPermission !== DOWNLOAD_PERMISSION_ENUM.NONE;

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              {doc.fileSize || '5.0 MB'} • {doc.pageCount || 24} trang
                            </span>
                            {isParticipantOnly && (
                              <span className="px-2 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Dành cho người tham dự
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {doc.description}
                          </p>
                          <span className="text-[10px] text-slate-400 block pt-1">
                            Đơn vị phát hành: <strong>{doc.providerName || 'Ban tổ chức CCU'}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Download & View Actions (Section 6 & 7) */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                        {canDownload && (
                          <button
                            type="button"
                            onClick={() => handleDownloadAsset(doc)}
                            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center space-x-1.5 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải xuống ({doc.fileSize || 'PDF'})</span>
                          </button>
                        )}
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center space-x-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem trực tuyến</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: HOẠT ĐỘNG TIẾP THEO (SECTIONS 21 & 22) */}
        {activeTab === 'next_steps' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-md space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                BƯỚC TIẾP THEO SAU CHƯƠNG TRÌNH
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading max-w-xl">
                Tiếp Tục Kết Nối Cung Cầu & Khảo Sát Năng Lực Nhà Máy
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                Chương trình kết thúc nhưng các cơ hội giao thương mới chỉ bắt đầu. Bạn có thể đăng ký nhu cầu mua hàng mới, yêu cầu CCU bố trí phiên gặp riêng hoặc tra cứu các sự kiện tiếp theo.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/dang-nhu-cau"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Đăng Nhu Cầu Tìm Nhà Cung Ứng</span>
                </Link>

                <Link
                  to="/tao-ho-so"
                  className="px-5 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition border border-white/20"
                >
                  <Factory className="w-4 h-4" />
                  <span>Hoàn Thiện Hồ Sơ Năng Lực NCC</span>
                </Link>

                <Link
                  to="/chuong-trinh"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                >
                  <Compass className="w-4 h-4" />
                  <span>Xem Lịch Chương Trình Mới</span>
                </Link>
              </div>
            </div>

            {/* Program Result Link (Section 22) */}
            {program.recap && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Số Liệu Đã Xác Thực (Section 21 Spec)</span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Biên Bản Tổng Hợp Kết Quả Giao Thương Tại {program.shortName || program.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gồm {program.recap.attendanceCount} đại biểu điểm danh, {program.recap.sessionsCompleted} phiên gặp 1:1 và {program.recap.quotesRecorded} báo giá được ghi nhận.
                  </p>
                </div>
                <Link
                  to={`/chuong-trinh/${program.slug || program.id}#ket-qua`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0 transition"
                >
                  Xem Báo Cáo Kết Quả
                </Link>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================
          5. LIGHTBOX MODAL FULLSCREEN (SECTION 40)
      ======================================================== */}
      {lightboxAsset && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full flex flex-col items-center justify-center space-y-4">
            
            {/* Close button */}
            <button
              onClick={() => setLightboxAsset(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-slate-300 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="max-h-[75vh] overflow-hidden rounded-2xl">
              <img
                src={lightboxAsset.url}
                alt={lightboxAsset.title}
                className="max-h-[75vh] w-auto object-contain mx-auto rounded-2xl shadow-2xl"
              />
            </div>

            {/* Captions & Actions */}
            <div className="bg-white/10 text-white p-4 rounded-2xl w-full backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="px-2 py-0.5 rounded bg-blue-600 font-mono text-[10px] font-bold">
                  {lightboxAsset.sessionTag || 'KHOẢNH KHẮC'}
                </span>
                <h4 className="font-bold text-sm text-white">{lightboxAsset.title}</h4>
                <p className="text-slate-300 text-[11px]">{lightboxAsset.description}</p>
              </div>

              {lightboxAsset.downloadPermission !== DOWNLOAD_PERMISSION_ENUM.NONE && (
                <button
                  type="button"
                  onClick={() => handleDownloadAsset(lightboxAsset)}
                  className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-sm shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh gốc ({lightboxAsset.fileSize || '2.4 MB'})</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          6. VIDEO PLAYER MODAL (SECTION 35)
      ======================================================== */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-3">
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] text-blue-400 font-mono font-bold block">{playingVideo.enterpriseName}</span>
                <h4 className="font-bold text-sm text-white line-clamp-1">{playingVideo.title}</h4>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {playingVideo.videoEmbedUrl ? (
                <iframe
                  src={playingVideo.videoEmbedUrl}
                  title={playingVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  <span>Trình phát video trực tiếp</span>
                </div>
              )}
            </div>

            <div className="p-4 text-xs text-slate-300">
              <p>{playingVideo.caption || playingVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. GỬI YÊU CẦU TRAO ĐỔI MODAL (SECTION 11 WORKFLOW)
      ======================================================== */}
      {exchangeTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Gửi Yêu Cầu Trao Đổi B2B (Section 11)</span>
              </div>
              <button
                type="button"
                onClick={() => setExchangeTarget(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {exchangeSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Đã Tiếp Nhận Yêu Cầu Ghép Nối!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mã tiếp nhận: <strong className="font-mono text-blue-700">{exchangeSuccess.id}</strong>.
                  Điều phối viên CCU sẽ xác minh nhu cầu và chuyển thông tin đến ban thu mua/kinh doanh của <strong>{exchangeTarget.name}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setExchangeTarget(null)}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="space-y-3">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Đơn vị tiếp nhận</span>
                  <strong className="text-slate-900 text-xs">{exchangeTarget.name}</strong>
                  <span className="text-[11px] text-blue-700 block font-mono">Gian hàng: {exchangeTarget.boothCode}</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Họ và tên của bạn (*):</label>
                  <input
                    type="text"
                    required
                    value={exchangeForm.senderName}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, senderName: e.target.value })}
                    placeholder="Nguyễn Văn A..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Số điện thoại (*):</label>
                    <input
                      type="tel"
                      required
                      value={exchangeForm.senderPhone}
                      onChange={(e) => setExchangeForm({ ...exchangeForm, senderPhone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Email:</label>
                    <input
                      type="email"
                      value={exchangeForm.senderEmail}
                      onChange={(e) => setExchangeForm({ ...exchangeForm, senderEmail: e.target.value })}
                      placeholder="email@company.vn"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Doanh nghiệp của bạn:</label>
                  <input
                    type="text"
                    value={exchangeForm.senderCompany}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, senderCompany: e.target.value })}
                    placeholder="Công ty TNHH Mua Hàng FDI..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Nội dung đề xuất trao đổi / Sản phẩm quan tâm:</label>
                  <textarea
                    rows={3}
                    value={exchangeForm.notes}
                    onChange={(e) => setExchangeForm({ ...exchangeForm, notes: e.target.value })}
                    placeholder="Ví dụ: Chúng tôi quan tâm đến giải pháp bu lông inox vi sinh và muốn nhận báo giá 50.000 pcs..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setExchangeTarget(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={exchangeSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#0052cc] hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{exchangeSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Ghép Nối'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
