import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Building2, CheckCircle2, AlertCircle, ShieldCheck, 
  ArrowRight, ArrowLeft, PlusCircle, Check, X, FileText, 
  Upload, Sparkles, Factory, Users, MapPin, Globe, ExternalLink,
  ChevronRight, RefreshCw, AlertTriangle, HelpCircle, Bot,
  Award, Layers, Briefcase, FileCheck, Phone
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  searchOrganizations,
  detectDuplicateOrganization,
  submitOrganizationClaim,
  createNewOrganization,
  calculateProfileCompleteness
} from '../data/organizationsData';
import AuthModal from '../components/auth/AuthModal';

// Danh sách các vai trò tổ chức (Multi-role support - Section 8)
const AVAILABLE_ROLES = [
  { id: 'SUPPLIER', label: 'Nhà cung ứng (Supplier)', desc: 'Cung cấp sản phẩm, linh kiện, nguyên phụ liệu hoặc dịch vụ kỹ thuật cho nhà máy.' },
  { id: 'BUYER', label: 'Chủ đầu tư / Thu mua (Buyer)', desc: 'Tìm nguồn cung ứng, phát hành RFQ và mua sắm thiết bị, vật tư định kỳ.' },
  { id: 'FACTORY', label: 'Nhà máy sản xuất (Factory)', desc: 'Cơ sở sản xuất công nghiệp, xưởng gia công chế tạo trong hoặc ngoài KCN.' },
  { id: 'ASSOCIATION', label: 'Hội / Hiệp hội (Association)', desc: 'Tổ chức đại diện ngành nghề, kết nối cộng đồng doanh nghiệp và hội viên.' },
  { id: 'INDUSTRIAL_PARK', label: 'Khu công nghiệp / BQL (Industrial Park)', desc: 'Chủ đầu tư hạ tầng KCN, khu chế xuất hoặc ban quản lý khu kinh tế.' },
  { id: 'FDI', label: 'Doanh nghiệp FDI', desc: 'Doanh nghiệp có vốn đầu tư nước ngoài tại Việt Nam.' },
  { id: 'INVESTOR', label: 'Nhà đầu tư / Quỹ đầu tư (Investor)', desc: 'Tìm kiếm cơ hội hợp tác đầu tư phát triển dự án công nghiệp.' },
  { id: 'FOUNDING_PARTNER', label: 'Đối tác Sáng lập (Founding Partner)', desc: 'Đơn vị đồng hành chiến lược cùng Chuỗi Cung Ứng Quốc Gia.' }
];

export default function CreateProfilePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Source context parameters (Section 16)
  const source = searchParams.get('source');
  const returnRequirement = searchParams.get('requirement');

  // Mode: 'search_existing' | 'create_new' | 'completion_checklist'
  const [activeTab, setActiveTab] = useState('search_existing');

  // Authenticated user state from session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isLoggedIn: false,
      name: 'Khách vãng lai',
      email: '',
      role: 'Guest'
    };
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // --------------------------------------------------------------------------
  // STATE CHO TAB 1: TÌM HỒ SƠ ĐÃ CÓ & CLAIM PROFILE
  // --------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [claimModal, setClaimModal] = useState({
    isOpen: false,
    organization: null,
    requestedRoles: ['SUPPLIER'],
    businessEmail: '',
    phone: '',
    evidenceType: 'BUSINESS_LICENSE',
    evidenceAttachments: ['Giay_DKKD_Doanh_Nghiep.pdf'],
    note: ''
  });
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Search logic
  useEffect(() => {
    const results = searchOrganizations(searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  // --------------------------------------------------------------------------
  // STATE CHO TAB 2: TẠO HỒ SƠ MỚI
  // --------------------------------------------------------------------------
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    legalName: '',
    taxCode: '',
    website: '',
    country: 'Việt Nam',
    province: 'Đồng Nai',
    address: '',
    orgType: 'Doanh nghiệp sản xuất',
    logo: '',
    roles: ['SUPPLIER']
  });

  // Duplicate warning state (Section 6)
  const [duplicateWarning, setDuplicateWarning] = useState({
    hasDuplicate: false,
    matches: []
  });
  const [ignoreDuplicateWarning, setIgnoreDuplicateWarning] = useState(false);

  // Kiểm tra trùng lặp tự động khi người dùng nhập MST hoặc Tên
  const runDuplicateCheck = () => {
    if (!newOrgForm.name && !newOrgForm.taxCode) return;
    const check = detectDuplicateOrganization({
      taxCode: newOrgForm.taxCode,
      legalName: newOrgForm.legalName || newOrgForm.name,
      name: newOrgForm.name,
      website: newOrgForm.website
    });
    setDuplicateWarning(check);
  };

  // State sau khi hoàn tất tạo/claim hồ sơ (Section 10)
  const [completedOrg, setCompletedOrg] = useState(null);

  // SEO Setup
  useEffect(() => {
    document.title = 'Tạo hồ sơ tổ chức | CHUOICUNGUNG.COM';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Tạo hồ sơ tổ chức trên sàn kết nối Chuỗi Cung Ứng Quốc Gia. Cập nhật thông tin doanh nghiệp, năng lực nhà máy, hồ sơ pháp lý và kết nối mạng lưới đối tác công nghiệp B2B.';

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://chuoicungung.com/tao-ho-so');
  }, []);

  // Xử lý nộp yêu cầu Claim Profile
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!currentUser?.isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }

    const res = submitOrganizationClaim({
      organizationId: claimModal.organization.id,
      requesterUserId: currentUser.email || currentUser.name,
      requesterName: currentUser.name,
      requestedRoles: claimModal.requestedRoles,
      businessEmail: claimModal.businessEmail,
      phone: claimModal.phone,
      evidenceType: claimModal.evidenceType,
      evidenceAttachments: claimModal.evidenceAttachments,
      note: claimModal.note
    });

    if (res.success) {
      setClaimSuccess(true);
    } else {
      alert(res.message);
    }
  };

  // Xử lý tạo mới Organization
  const handleCreateOrgSubmit = (e) => {
    e.preventDefault();

    // Check duplicate nếu chưa bỏ qua
    if (duplicateWarning.hasDuplicate && !ignoreDuplicateWarning) {
      alert('Phát hiện doanh nghiệp có thông tin trùng lặp. Vui lòng kiểm tra mục cảnh báo hoặc chọn "Vẫn tiếp tục tạo mới".');
      return;
    }

    const res = createNewOrganization({
      name: newOrgForm.name,
      legalName: newOrgForm.legalName || newOrgForm.name,
      taxCode: newOrgForm.taxCode,
      website: newOrgForm.website,
      country: newOrgForm.country,
      province: newOrgForm.province,
      address: newOrgForm.address,
      orgType: newOrgForm.orgType,
      logo: newOrgForm.logo || null,
      roles: newOrgForm.roles,
      creatorUserId: currentUser.email || 'USER_CREATOR',
      creatorName: currentUser.name || 'Người đại diện'
    });

    if (res.success) {
      setCompletedOrg(res.organization);
      setActiveTab('completion_checklist');
    }
  };

  // Profile completeness data
  const completeness = useMemo(() => {
    return calculateProfileCompleteness(completedOrg);
  }, [completedOrg]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — HERO HEADER (SECTION 02 SPEC 12.TXT) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-900 via-[#0B2545] to-[#071E3D] text-white border-b border-slate-800 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12 relative z-10 space-y-5">
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <Link to="/" title="Trang chủ" className="inline-flex items-center hover:text-white transition">
              <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain brightness-200" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Tạo hồ sơ tổ chức</span>
          </nav>

          {/* Context banner nếu chuyển từ Sàn Nhu Cầu sang (Section 16) */}
          {source && (
            <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-200 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300 shrink-0" />
                <span>
                  Bạn đang hoàn thiện hồ sơ để phản hồi nhu cầu <strong>{returnRequirement || 'trên Sàn Nhu Cầu'}</strong>. Sau khi hoàn tất, hệ thống sẽ tự động đưa bạn quay lại nhu cầu này.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Cổng Đăng Ký & Quản Trị Tổ Chức Toàn Hệ Sinh Thái</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight text-white">
              Tạo hồ sơ tổ chức
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Tạo hồ sơ mới hoặc nhận quyền quản lý hồ sơ đã có trên CHUOICUNGUNG.COM để giới thiệu năng lực, sản phẩm, và tham gia các cơ hội cung ứng B2B.
            </p>

            {/* KYC Notice Disclaimer */}
            <div className="p-3.5 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200 max-w-2xl">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Lưu ý xác thực KYC:</strong> Việc định danh pháp nhân nhằm đối soát tư cách pháp lý thật của tổ chức trong hệ thống dữ liệu, không đồng nghĩa với bảo chứng hoặc cam kết chất lượng sản phẩm/dịch vụ thương mại.
              </p>
            </div>
          </div>

          {/* Two Primary Choices Switcher (Section 02) */}
          {activeTab !== 'completion_checklist' && (
            <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 max-w-md">
              <button
                onClick={() => {
                  setActiveTab('search_existing');
                  setDuplicateWarning({ hasDuplicate: false, matches: [] });
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'search_existing'
                    ? 'bg-[#0052cc] text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>TÌM HỒ SƠ ĐÃ CÓ</span>
              </button>

              <button
                onClick={() => setActiveTab('create_new')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'create_new'
                    ? 'bg-[#0052cc] text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>TẠO HỒ SƠ MỚI</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 relative z-20 space-y-6">

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: TÌM HỒ SƠ ĐÃ CÓ & CLAIM PROFILE (SECTION 3, 4, 5 SPEC 12.TXT)   */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'search_existing' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Tìm kiếm hồ sơ doanh nghiệp đã có trên hệ thống
              </h2>
              <p className="text-xs text-slate-500">
                Nhập tên doanh nghiệp, tên pháp lý, mã số thuế hoặc tên miền website để kiểm tra hồ sơ đã tồn tại.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên công ty, MST (VD: 0314567890, Proser, Amata, TAHOMART...)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>

            {/* Results Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Kết quả tìm kiếm: <strong>{searchResults.length}</strong> tổ chức phù hợp</span>
                <button
                  onClick={() => setActiveTab('create_new')}
                  className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1"
                >
                  Không tìm thấy? Tạo hồ sơ mới
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {searchResults.map((org) => (
                  <div
                    key={org.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                        {org.logo ? (
                          <img src={org.logo} alt={org.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm font-heading truncate">
                            {org.name}
                          </span>
                          {org.taxCode && (
                            <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono text-[10px] font-semibold">
                              MST: {org.taxCode}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {org.province || 'Việt Nam'}
                          </span>
                          <span>•</span>
                          <span>{org.orgType}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {org.roles?.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Claim Profile CTA Button (Section 3 & 4) */}
                    <button
                      onClick={() => {
                        setClaimModal({
                          isOpen: true,
                          organization: org,
                          requestedRoles: org.roles?.length > 0 ? org.roles : ['SUPPLIER'],
                          businessEmail: currentUser?.email || '',
                          phone: currentUser?.phone || '',
                          evidenceType: 'BUSINESS_LICENSE',
                          evidenceAttachments: ['Giay_DKKD_Doanh_Nghiep.pdf'],
                          note: ''
                        });
                        setClaimSuccess(false);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-blue-50 border border-blue-300 hover:border-blue-600 text-[#0052cc] text-xs font-bold transition shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>ĐÂY LÀ DOANH NGHIỆP CỦA TÔI</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: TẠO HỒ SƠ MỚI (SECTION 6, 7, 8 SPEC 12.TXT)                      */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'create_new' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                Tạo mới hồ sơ Doanh nghiệp / Tổ chức
              </h2>
              <p className="text-xs text-slate-500">
                Điền thông tin định danh cơ bản. Bạn có thể bổ sung năng lực, sản phẩm chi tiết sau khi khởi tạo.
              </p>
            </div>

            {/* Duplicate Detection Alert Banner (Section 6) */}
            {duplicateWarning.hasDuplicate && !ignoreDuplicateWarning && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-900 font-heading">
                      Cảnh báo: Có thể doanh nghiệp này đã tồn tại trên hệ thống
                    </h4>
                    <p className="text-xs text-amber-800">
                      Hệ thống phát hiện thông tin bạn vừa nhập tương đồng với hồ sơ đã có:
                    </p>
                    <ul className="text-xs list-disc list-inside text-amber-900 font-medium pt-1">
                      {duplicateWarning.matches.map((m, idx) => (
                        <li key={idx}>
                          <strong>{m.organization.name}</strong> - {m.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('search_existing');
                      setSearchQuery(newOrgForm.taxCode || newOrgForm.name);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
                  >
                    Xem hồ sơ đã có & Yêu cầu quản lý
                  </button>
                  <button
                    type="button"
                    onClick={() => setIgnoreDuplicateWarning(true)}
                    className="py-1.5 px-3 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold transition"
                  >
                    Vẫn tiếp tục tạo mới
                  </button>
                </div>
              </div>
            )}

            {/* Creation Form */}
            <form onSubmit={handleCreateOrgSubmit} className="space-y-5">
              
              {/* Row 1: Tên doanh nghiệp & Tên pháp lý */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Tên doanh nghiệp / thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrgForm.name}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                    onBlur={runDuplicateCheck}
                    placeholder="VD: May Mặc Đồng Nai Proser"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Tên pháp lý đầy đủ trên ĐKKD
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.legalName}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, legalName: e.target.value })}
                    onBlur={runDuplicateCheck}
                    placeholder="VD: CÔNG TY TNHH MAY MẶC ĐỒNG NAI PROSER"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition"
                  />
                </div>
              </div>

              {/* Row 2: Mã số thuế & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Mã số thuế (MST) <span className="text-slate-400 font-normal">(Rất quan trọng để đối chiếu)</span>
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.taxCode}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, taxCode: e.target.value })}
                    onBlur={runDuplicateCheck}
                    placeholder="VD: 0314567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none font-mono transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Website / Domain chính thức
                  </label>
                  <input
                    type="text"
                    value={newOrgForm.website}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, website: e.target.value })}
                    onBlur={runDuplicateCheck}
                    placeholder="VD: https://congty.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition"
                  />
                </div>
              </div>

              {/* Row 3: Tỉnh thành & Địa chỉ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    disabled
                    value={newOrgForm.country}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newOrgForm.province}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition font-semibold"
                  >
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Long An">Long An</option>
                    <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                    <option value="Bắc Ninh">Bắc Ninh</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Hà Nội">Hà Nội</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Loại tổ chức
                  </label>
                  <select
                    value={newOrgForm.orgType}
                    onChange={(e) => setNewOrgForm({ ...newOrgForm, orgType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition font-semibold"
                  >
                    <option value="Doanh nghiệp sản xuất">Doanh nghiệp sản xuất</option>
                    <option value="Doanh nghiệp thương mại">Doanh nghiệp thương mại</option>
                    <option value="Chủ đầu tư KCN">Chủ đầu tư KCN</option>
                    <option value="Hội / Hiệp hội">Hội / Hiệp hội</option>
                    <option value="Đơn vị cung cấp dịch vụ">Đơn vị cung cấp dịch vụ</option>
                  </select>
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Địa chỉ trụ sở / Nhà máy
                </label>
                <input
                  type="text"
                  value={newOrgForm.address}
                  onChange={(e) => setNewOrgForm({ ...newOrgForm, address: e.target.value })}
                  placeholder="VD: Lô A2, Đường số 3, KCN Amata, TP. Biên Hòa, Đồng Nai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0052cc] outline-none transition"
                />
              </div>

              {/* SECTION 8: CHỌN NHIỀU VAI TRÒ (MULTI-ROLE CARDS) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-black text-slate-900 font-heading">
                    Chọn vai trò của tổ chức trong Chuỗi Cung Ứng (Có thể chọn nhiều vai trò) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Cùng một doanh nghiệp có thể vừa là Nhà cung ứng (Supplier), vừa có Nhà máy (Factory), vừa có nhu cầu Thu mua (Buyer). Không cần tạo nhiều hồ sơ tách biệt.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_ROLES.map((role) => {
                    const isSelected = newOrgForm.roles.includes(role.id);
                    return (
                      <div
                        key={role.id}
                        onClick={() => {
                          const current = newOrgForm.roles;
                          const next = isSelected 
                            ? current.filter(r => r !== role.id)
                            : [...current, role.id];
                          setNewOrgForm({ ...newOrgForm, roles: next });
                        }}
                        className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50/60 border-[#0052cc] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected ? 'bg-[#0052cc] border-[#0052cc] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 font-heading">
                            {role.label}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {role.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('search_existing')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Quay lại tìm kiếm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem('ccu_org_draft', JSON.stringify(newOrgForm));
                      alert('Đã lưu bản nháp hồ sơ thành công vào trình duyệt!');
                    } catch(e) {}
                  }}
                  className="py-3 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 transition"
                >
                  Lưu nháp
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Gửi duyệt</span>
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* STEP 3: MÀN HÌNH HOÀN TẤT & CHECKLIST HOÀN THIỆN NĂNG LỰC (SECTION 10) */}
        {/* ----------------------------------------------------------------------- */}
        {activeTab === 'completion_checklist' && completedOrg && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Top Success Banner */}
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-emerald-950 font-heading">
                  Đã khởi tạo thành công hồ sơ: {completedOrg.name}!
                </h3>
                <p className="text-xs text-emerald-800 max-w-lg mx-auto">
                  Mã định danh hệ sinh thái: <strong className="font-mono">{completedOrg.id}</strong>. Hồ sơ của bạn đã được lưu vào hệ thống và đang ở trạng thái chuẩn bị duyệt xuất bản (Pending Review).
                </p>
              </div>
            </div>

            {/* Profile Completeness Score Card (Section 10) */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-heading uppercase">
                    Mức độ hoàn thiện hồ sơ của bạn: {completeness.score}%
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bổ sung các mục dưới đây để hồ sơ đạt chuẩn và xuất hiện ưu tiên khi đối tác tìm kiếm.
                  </p>
                </div>
                <span className="text-xl font-black text-blue-600 font-mono">
                  {completeness.score}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness.score}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                {completeness.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className={item.done ? 'text-slate-800 font-medium' : 'text-slate-500'}>
                      {item.label}
                    </span>
                    {item.done ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                        <Check className="w-3.5 h-3.5" />
                        Đã có
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-[11px]">
                        Chưa hoàn tất
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Return context action button (Section 16) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => navigate('/doanh-nghiep')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Về danh bạ doanh nghiệp
              </button>

              {source === 'san-nhu-cau' ? (
                <button
                  onClick={() => navigate('/san-nhu-cau')}
                  className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Quay lại Sàn Nhu Cầu & Phản hồi cơ hội</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => alert('Chuyển tới bảng điều khiển quản trị doanh nghiệp của bạn.')}
                  className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Vào Bảng Quản Trị Hồ Sơ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* CLAIM PROFILE MODAL (SECTION 4 & 5 SPEC 12.TXT)                           */}
      {/* ========================================================================= */}
      {claimModal.isOpen && claimModal.organization && (
        <div className="fixed inset-0 z-[1200] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 text-slate-900 space-y-5 animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {claimSuccess ? (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-3xl text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-blue-950 font-heading">
                    Đã tiếp nhận yêu cầu quyền quản lý hồ sơ!
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed max-w-md mx-auto">
                    Mã yêu cầu: <strong>CLM-{Date.now().toString().slice(-6)}</strong>. Trạng thái: <strong className="underline">PENDING (Chờ xác minh)</strong>. Ban Quản Trị sẽ đối chiếu bằng chứng xác thực và gửi thông báo qua email trong vòng 24 giờ.
                  </p>
                </div>
                <button
                  onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
                  className="py-2 px-6 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0047a5] transition"
                >
                  Đã hiểu & Đóng lại
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                
                <div className="space-y-1 border-b border-slate-100 pb-3 pr-8">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded">
                    XÁC THỰC CHỦ SỞ HỮU HỒ SƠ
                  </span>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    Yêu cầu quyền quản lý: {claimModal.organization.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quyền quản trị hồ sơ chỉ được cấp khi có bằng chứng xác minh hợp lệ (Section 5).
                  </p>
                </div>

                {/* Email domain & SĐT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Email doanh nghiệp *</label>
                    <input
                      type="email"
                      required
                      value={claimModal.businessEmail}
                      onChange={(e) => setClaimModal({ ...claimModal, businessEmail: e.target.value })}
                      placeholder="VD: contact@proser.vn"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      value={claimModal.phone}
                      onChange={(e) => setClaimModal({ ...claimModal, phone: e.target.value })}
                      placeholder="09xx xxx xxx"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc]"
                    />
                  </div>
                </div>

                {/* Loại bằng chứng xác thực (Section 5) */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-800">Phương thức bằng chứng xác thực *</label>
                  <select
                    value={claimModal.evidenceType}
                    onChange={(e) => setClaimModal({ ...claimModal, evidenceType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc] font-semibold"
                  >
                    <option value="BUSINESS_LICENSE">Giấy chứng nhận Đăng ký kinh doanh (ĐKKD)</option>
                    <option value="BUSINESS_EMAIL_DOMAIN">Xác thực qua Email tên miền doanh nghiệp</option>
                    <option value="AUTHORIZATION_LETTER">Thư ủy quyền có chữ ký & dấu mộc pháp nhân</option>
                    <option value="ADMIN_MANUAL_REVIEW">Liên hệ xác minh trực tiếp qua Hotline</option>
                  </select>
                </div>

                {/* File đính kèm */}
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-800">Tài liệu đính kèm đối chứng</label>
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Giay_DKKD_Doanh_Nghiep.pdf</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold">Đã sẵn sàng</span>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-800">Ghi chú bổ sung cho Ban Quản Trị</label>
                  <textarea
                    rows={2}
                    value={claimModal.note}
                    onChange={(e) => setClaimModal({ ...claimModal, note: e.target.value })}
                    placeholder="Mô tả chức vụ của bạn tại doanh nghiệp..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0052cc]"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setClaimModal({ ...claimModal, isOpen: false })}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-[#0047a5] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Gửi yêu cầu xác nhận</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          try {
            const saved = localStorage.getItem('ccu_user_session');
            if (saved) setCurrentUser(JSON.parse(saved));
          } catch (e) {}
        }}
        initialTab="login"
      />

    </main>
  );
}
