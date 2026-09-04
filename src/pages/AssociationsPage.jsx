import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Users, MapPin, Globe, Calendar, 
  ArrowRight, ChevronRight, PlusCircle, RotateCcw, Sparkles,
  Building2, Phone, Mail, ShieldCheck, CheckCircle2, Award,
  Compass, Play, Layers, ExternalLink, Briefcase, ChevronDown,
  TrendingUp, Check, Landmark, ArrowUpRight, Handshake, Scale,
  BarChart3, FileText, X, Rocket, Cpu, Database, Server,
  Lock, RefreshCw, Zap, ShieldAlert, BadgePercent, CheckCircle,
  Gem, ArrowDownRight, Share2, Smartphone, Terminal
} from 'lucide-react';
import associationsList from '../data/associations.json';
import { useLanguage } from '../contexts/LanguageContext';
import AssociationApiMotionGraphic3D from '../components/association/AssociationApiMotionGraphic3D';

// Helper for association top sectors & KYC attributes
const associationSectorMap = {
  'hiep-hoi-nghe-tham-viet-nam': ['Thảm trang trí', 'Vật liệu nội thất', 'Xuất khẩu thủ công'],
  'hiep-hoi-bat-dong-san-viet-nam': ['Bất động sản KCN', 'Đầu tư hạ tầng', 'Xây dựng thương mại'],
  'hiep-hoi-che-bien-va-xuat-khau-thuy-san-viet-nam': ['Thủy sản đông lạnh', 'Chế biến tôm cá', 'Xuất khẩu EU/US'],
  'hoi-lam-vuon-viet-nam': ['Nông nghiệp hữu cơ', 'Cây giống & Trái cây', 'Mô hình VAC'],
  'hiep-hoi-thep-viet-nam': ['Thép kết cấu', 'Luyện kim & Cán kéo', 'Thép xây dựng'],
  'hiep-hoi-giay-va-bot-giay-viet-nam': ['Sản xuất bột giấy', 'Bao bì carton', 'Giấy công nghiệp'],
  'hoi-khoa-hoc-ky-thuat-an-toan-thuc-pham-viet-nam': ['Kiểm nghiệm ATTP', 'Tiêu chuẩn HACCP/ISO', 'Tư vấn an toàn'],
  'hoi-dieu-duong-viet-nam': ['Chăm sóc y tế', 'Đào tạo điều dưỡng', 'Thiết bị y tế'],
  'hoi-chu-thap-do-viet-nam': ['Cứu trợ nhân đạo', 'Y tế cộng đồng', 'Xã hội hóa'],
  'hiep-hoi-lang-nghe-viet-nam': ['Thủ công mỹ nghệ', 'Gốm sứ & Mây tre', 'Làng nghề truyền thống'],
  'hoi-dong-y-viet-nam': ['Dược liệu đông y', 'Khám chữa y học cổ truyền', 'Bào chế thảo dược'],
  'hiep-hoi-bong-soi-viet-nam': ['Sợi cotton', 'Kéo sợi dệt kim', 'Nguyên phụ liệu may'],
  'hiep-hoi-det-may-viet-nam': ['May mặc xuất khẩu', 'Dệt nhuộm công nghiệp', 'Thời trang ODM/OEM'],
  'hiep-hoi-nang-luong-viet-nam': ['Điện mặt trời & Gió', 'Năng lượng tái tạo', 'Thiết bị truyền tải'],
  'hoi-bao-ve-thien-nhien-va-moi-truong-viet-nam': ['Xử lý nước & Khí thải', 'Đánh giá ĐTM', 'Công nghệ xanh'],
  'hiep-hoi-tham-dinh-gia-viet-nam': ['Thẩm định tài sản', 'Định giá dự án FDI', 'Giám định độc lập'],
  'hiep-hoi-doanh-nghiep-dich-vu-logistics-viet-nam': ['Vận tải đa phương thức', 'Kho vận & Cảng biển', 'Thủ tục hải quan'],
  'hiep-hoi-phan-bon-viet-nam': ['Phân bón NPK & Hữu cơ', 'Hóa chất nông nghiệp', 'Dinh dưỡng cây trồng'],
  'hiep-hoi-cac-do-thi-viet-nam': ['Quy hoạch đô thị', 'Hạ tầng thông minh', 'Chiếu sáng & Cảnh quan'],
};

// Sector Filters
const SECTOR_FILTERS = [
  { id: 'all', label: 'Tất cả lĩnh vực' },
  { id: 'cokhi', label: 'Cơ khí & Thép', keywords: ['thép', 'cơ khí', 'kim loại', 'vật liệu'] },
  { id: 'detmay', label: 'Dệt may & Da giày', keywords: ['dệt may', 'bông sợi', 'thảm', 'may mặc'] },
  { id: 'nongsan', label: 'Nông nghiệp & Thủy sản', keywords: ['thủy sản', 'làm vườn', 'nông nghiệp', 'phân bón'] },
  { id: 'logistics', label: 'Logistics & Cảng biển', keywords: ['logistics', 'kho vận', 'vận tải', 'giao nhận'] },
  { id: 'kcn', label: 'Bất động sản & KCN', keywords: ['bất động sản', 'đô thị', 'xây dựng', 'hạ tầng'] },
  { id: 'nangluong', label: 'Năng lượng & Môi trường', keywords: ['năng lượng', 'môi trường', 'thiên nhiên'] },
  { id: 'yte', label: 'Y tế & Thực phẩm', keywords: ['thực phẩm', 'y tế', 'điều dưỡng', 'đông y'] }
];

export default function AssociationsPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');

  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Form states for API modal
  const [apiFormData, setApiFormData] = useState({
    orgName: '',
    repName: '',
    phone: '',
    email: '',
    memberCount: '',
    systemType: 'ERP / CRM Nội bộ',
    notes: ''
  });
  const [apiSubmitted, setApiSubmitted] = useState(false);

  // Form states for Member KYC SSO modal
  const [verifyTaxCode, setVerifyTaxCode] = useState('');
  const [verifyAssocId, setVerifyAssocId] = useState(associationsList[0]?.id || '');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const filtered = useMemo(() => {
    return associationsList.filter(a => {
      const matchText = (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (a.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (a.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (a.president || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (a.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRegion = selectedRegion === 'all' || a.region === selectedRegion;

      let matchSector = true;
      if (selectedSector !== 'all') {
        const sectorDef = SECTOR_FILTERS.find(s => s.id === selectedSector);
        if (sectorDef && sectorDef.keywords) {
          const combinedStr = `${a.name} ${a.tagline} ${a.description} ${(associationSectorMap[a.id] || []).join(' ')}`.toLowerCase();
          matchSector = sectorDef.keywords.some(k => combinedStr.includes(k));
        }
      }

      return matchText && matchRegion && matchSector;
    });
  }, [searchTerm, selectedRegion, selectedSector]);

  const handleApiSubmit = (e) => {
    e.preventDefault();
    setApiSubmitted(true);
    setTimeout(() => {
      // Auto reset after 3s
      setTimeout(() => {
        setApiSubmitted(false);
        setShowApiModal(false);
        setApiFormData({
          orgName: '',
          repName: '',
          phone: '',
          email: '',
          memberCount: '',
          systemType: 'ERP / CRM Nội bộ',
          notes: ''
        });
      }, 2500);
    }, 600);
  };

  const handleVerifyKyc = (e) => {
    e.preventDefault();
    if (!verifyTaxCode.trim()) return;
    setIsVerifying(true);
    setVerifyResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const chosenAssoc = associationsList.find(a => a.id === verifyAssocId) || associationsList[0];
      setVerifyResult({
        success: true,
        companyName: `CÔNG TY CỔ PHẦN CÔNG NGHIỆP PHÁT TRIỂN VIỆT NAM (MST: ${verifyTaxCode})`,
        assocName: chosenAssoc.name,
        badgeLevel: 'Bảo Chứng Lớp 3 - Kim Cương 💎',
        verifiedDate: new Date().toLocaleDateString('vi-VN'),
        priorityScore: '98.5/100 (TOP 1 Matching FDI)'
      });
    }, 1000);
  };

  return (
    <div className="space-y-12 pb-24 font-sans bg-[#FBFBFC] min-h-screen text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Summit Visual - Image 1 Exact Layout) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Summit Photo with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/association_summit_hero.jpg" 
            alt="Vietnam International Trade Summit"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 lg:via-[#F4F8FA]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-5">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#0052cc] transition">{lang === 'en' ? 'Home' : 'Trang chủ'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'Trade Associations' : 'Hội / Hiệp Hội / Tổ Chức'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'OFFICIAL VIETNAM ASSOCIATIONS DIRECTORY' : 'MẠNG LƯỚI HỘI & HIỆP HỘI VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Connecting Leaders' : 'Kết Nối Tổ Chức'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Inspiring Tomorrow' : 'Kiến Tạo Chuỗi Giá Trị'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'We unite 71+ certified national trade associations, empowering B2B matchmaking, supply chain synergies, and industrial prosperity.'
                : 'Quy tụ mạng lưới 71+ Hội, Hiệp hội và Tổ chức ngành nghề quốc gia — Cầu nối xúc tiến thương mại, hỗ trợ pháp lý và mở rộng chuỗi cung ứng công nghiệp bền vững.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-hiep-hoi"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Our Directory' : 'Khám Phá Danh Bạ'}</span>
              </a>

              <button
                onClick={() => setShowVideoModal(true)}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#0052cc] text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Watch Overview' : 'Xem Giới Thiệu'}</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* STATS BAR (Image 1 Exact 4-Counter Floating Pill) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">71+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Trade Associations' : 'Hội & Hiệp hội chính thức'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">12.500+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Member Enterprises' : 'Doanh nghiệp hội viên'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">100%</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Legal Verification' : 'Xác thực pháp nhân & ĐKKD'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">34</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces Served' : 'Tỉnh thành toàn quốc'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BLOCK 2: CORE VALUE (Giải Mã Quyền Lợi Kép - Split-Screen UI) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052cc] text-xs font-bold font-heading uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUYỀN LỢI KÉP TOÀN DIỆN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 tracking-tight">
            Giải Pháp Đột Phá Dành Cho <span className="text-[#0052cc]">Ban Điều Hành</span> & <span className="text-amber-600">Doanh Nghiệp</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Mô hình liên kết thông minh chuẩn hóa dữ liệu B2B, số hóa quản trị và cấp bảo chứng thực địa KYC Lớp 3 cho toàn chuỗi cung ứng.
          </p>
        </div>

        {/* 2 Symmetric Columns (Split-Screen UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* CỘT TRÁI: DÀNH CHO BAN ĐIỀU HÀNH HỘI */}
          <div className="bg-white rounded-3xl border border-blue-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-200/50 transition"></div>
            
            <div className="space-y-6 relative z-10">
              {/* Pillar Header */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047a5] to-[#0066d6] text-white flex items-center justify-center shadow-md shadow-blue-900/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#0052cc] uppercase font-mono tracking-wider">
                      DÀNH CHO BAN LÃNH ĐẠO HỘI
                    </span>
                    <h3 className="text-lg sm:text-xl font-black font-heading text-slate-950 leading-tight">
                      Số Hóa Dữ Liệu & Nâng Tầm Vị Thế
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-[#0052cc] text-[11px] font-bold rounded-xl border border-blue-200 shrink-0 font-mono">
                  B2B Hub
                </span>
              </div>

              {/* 4 Core Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 font-bold text-xs">
                    1
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Số Hóa Dữ Liệu Hội Viên Tự Động
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Tích hợp trực tiếp với cơ sở dữ liệu CRM, ERP hoặc Excel nội bộ, loại bỏ hoàn toàn việc cập nhật thủ công.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 font-bold text-xs">
                    2
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Gia Tăng Đặc Quyền Kinh Tế & Thu Hút Hội Viên
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Cấp quyền gắn Huy Hiệu Kim Cương Lớp 3 cho hội viên, giúp doanh nghiệp được ưu tiên trong các gói thầu FDI lớn.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 font-bold text-xs">
                    3
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Kết Nối Thông Báo Đa Kênh Tức Thời
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Tự động gửi thông báo cơ hội giao thương, tin mời thầu và lịch sự kiện qua Zalo ZNS, Webhook và Email API.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 font-bold text-xs">
                    4
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Dashboard Thống Kê Năng Lực Cung Ứng
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Nắm bắt bức tranh tổng thể về doanh thu, số lượng đơn hàng và năng lực sản xuất của toàn thể doanh nghiệp thành viên.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => setShowApiModal(true)}
                className="w-full py-3 bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-900/20 transition flex items-center justify-center space-x-2 font-heading tracking-wide cursor-pointer group"
              >
                <span>Tích Hợp API Dành Cho Ban Điều Hành Hội</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* CỘT PHẢI: DÀNH CHO DOANH NGHIỆP HỘI VIÊN */}
          <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-200/50 transition"></div>
            
            <div className="space-y-6 relative z-10">
              {/* Pillar Header */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-md shadow-amber-900/20">
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase font-mono tracking-wider">
                      DÀNH CHO DOANH NGHIỆP HỘI VIÊN
                    </span>
                    <h3 className="text-lg sm:text-xl font-black font-heading text-slate-950 leading-tight">
                      Bảo Chứng Kim Cương & Đặc Quyền FDI
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-xl border border-amber-200 shrink-0 font-mono flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  <span>KYC Lớp 3</span>
                </span>
              </div>

              {/* 4 Core Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 font-bold text-xs">
                    1
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Đặc Quyền Huy Hiệu Kim Cương Lớp 3 💎
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Bảo chứng thực địa chính thức từ Hiệp hội quản lý, loại bỏ 100% rủi ro doanh nghiệp ảo và nâng cao uy tín đấu thầu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 font-bold text-xs">
                    2
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Lọt TOP 1 Bộ Lọc Của Giám Đốc Mua Hàng FDI
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Doanh nghiệp có bảo chứng được đưa vào danh sách ưu tiên cao nhất khi các tập đoàn FDI & KCN tìm kiếm nhà cung ứng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 font-bold text-xs">
                    3
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Đăng Nhập Một Lần (SSO 1-Chạm)
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Dùng tài khoản BNI Connect / VCCI / HUBA sẵn có để đăng nhập, kích hoạt ngay lập tức mà không cần nộp lại giấy phép kinh doanh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 font-bold text-xs">
                    4
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                      Tiếp Cận Chuỗi 18 Pha Khép Kín
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Kết nối sâu vào từng giai đoạn từ khảo sát đất KCN, xây xưởng, gia công phụ trợ đến vận tải logistics và xuất khẩu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-900/20 transition flex items-center justify-center space-x-2 font-heading tracking-wide cursor-pointer group"
              >
                <span>Kích Hoạt Huy Hiệu Hội Viên Của Bạn</span>
                <Gem className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. BLOCK 3: API INTEGRATION BOX (3D Motion Graphic - Tone Sáng) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AssociationApiMotionGraphic3D />
      </section>

      {/* ========================================================================= */}
      {/* 4. BLOCK 4: ASSOCIATION GRID & SMART SEARCH (Danh Mục Hiệp Hội VIP) */}
      {/* ========================================================================= */}
      <section id="danh-sach-hiep-hoi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-[#0052cc] font-heading uppercase tracking-wider">
              DANH MỤC HIỆP HỘI VIP
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-950 tracking-tight">
              Mạng Lưới 71+ Tổ Chức & Hiệp Hội Toàn Quốc
            </h3>
          </div>

          <div className="text-slate-500 font-medium text-xs">
            Tìm thấy <strong className="text-slate-950 font-bold">{filtered.length}</strong> tổ chức / hiệp hội bảo chứng
          </div>
        </div>

        {/* Smart Search & Dual Filtering Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hiệp hội, ngành nghề thế mạnh, người đại diện, tỉnh thành..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Industry / Sector Filter Tabs */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-[#0052cc]" />
              <span>Ngành nghề & Lĩnh vực:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SECTOR_FILTERS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] font-heading cursor-pointer ${
                    selectedSector === sec.id
                      ? 'bg-[#0052cc] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Khu vực địa lý:</span>
              {['all', 'Miền Bắc', 'Miền Nam', 'Miền Trung', 'Toàn quốc'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1 rounded-lg font-bold transition text-[11px] cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {reg === 'all' ? 'Tất cả vùng miền' : reg}
                </button>
              ))}
            </div>

            {(searchTerm || selectedRegion !== 'all' || selectedSector !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                  setSelectedSector('all');
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>

        </div>

        {/* Association Cards Grid: Micro-interactions + Top 3 Sectors + Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((assoc) => {
            const initial = (assoc.name || 'H').charAt(0).toUpperCase();
            const topSectors = associationSectorMap[assoc.id] || [
              'Sản xuất công nghiệp',
              'Xúc tiến thương mại',
              'Kết nối chuỗi cung ứng'
            ];

            return (
              <div
                key={assoc.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-[#0052cc]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group relative will-change-transform hover:-translate-y-1.5"
              >
                
                {/* Top Header */}
                <div className="space-y-3">
                  
                  {/* Logo + Name + Region Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Logo Box */}
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs group-hover:border-[#0052cc]/50 transition-colors">
                        {assoc.logo ? (
                          <img 
                            src={assoc.logo} 
                            alt={assoc.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          style={{ display: assoc.logo ? 'none' : 'flex' }}
                          className="w-full h-full rounded-xl bg-gradient-to-br from-[#0047a5] to-[#0052cc] text-white font-black text-base items-center justify-center font-heading"
                        >
                          {initial}
                        </span>
                      </div>

                      {/* Association Title */}
                      <div className="min-w-0 flex-1">
                        <Link 
                          to={`/hoi-hiep-hoi/${assoc.id}`}
                          className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-snug"
                          title={assoc.name}
                        >
                          {assoc.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Thành lập: {assoc.establishedYear || '2016'}
                        </span>
                      </div>
                    </div>

                    {/* Badge Vùng Miền */}
                    <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded-md border border-blue-200/60 font-mono shrink-0">
                      {assoc.region || 'Toàn quốc'}
                    </span>
                  </div>

                  {/* KYC Lớp 3 Diamond Pill */}
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[10.5px] font-bold font-mono">
                    <Gem className="w-3 h-3 text-amber-600" />
                    <span>Bảo Chứng Lớp 3 (Kim Cương)</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {assoc.description || assoc.tagline}
                  </p>

                  {/* Top 3 Strong Sectors Tags */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TOP 3 THẾ MẠNH:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {topSectors.map((sec, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/70"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Metrics & Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0052cc]" />
                      <span><strong>{assoc.membersCount || 200}+</strong> hội viên xác thực</span>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-500 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[120px]">{assoc.address ? assoc.address.split(',').pop() : 'Việt Nam'}</span>
                    </div>
                  </div>

                  {/* 2 Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to={`/doanh-nghiep?association=${encodeURIComponent(assoc.name)}`}
                      className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-[#0052cc] text-[11px] font-bold rounded-xl border border-blue-200/80 transition text-center flex items-center justify-center space-x-1 font-heading"
                      title="Xem danh sách doanh nghiệp thuộc hiệp hội này"
                    >
                      <span>Khám phá DN</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <Link
                      to={`/hoi-hiep-hoi/${assoc.id}`}
                      className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl transition text-center flex items-center justify-center space-x-1 font-heading"
                    >
                      <span>Chi tiết hội</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BLOCK 5: SPLIT CTA (Phễu Chuyển Đổi Kép Cuối Trang) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Cánh cửa 1: Dành cho Ban Lãnh Đạo Hội */}
          <div className="bg-gradient-to-br from-[#072348] via-[#0047a5] to-[#0052cc] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold font-heading">
                <Building2 className="w-3.5 h-3.5 text-sky-300" />
                <span>CỔNG KẾT NỐI BAN ĐIỀU HÀNH</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                Tích Hợp API Dành Cho Ban Điều Hành Hội
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
                Đồng bộ hóa dữ liệu hội viên từ ERP/CRM, cấp chứng chỉ số và liên kết xúc tiến thương mại quốc tế cho toàn bộ thành viên.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                onClick={() => setShowApiModal(true)}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#0047a5] text-xs sm:text-sm font-bold rounded-xl shadow-lg transition flex items-center space-x-2 font-heading tracking-wide cursor-pointer group"
              >
                <span>Đăng Ký Tích Hợp API Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Cánh cửa 2: Dành cho Doanh Nghiệp Thành Viên */}
          <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold font-heading">
                <Gem className="w-3.5 h-3.5 text-yellow-200" />
                <span>CỔNG BẢO CHỨNG HỘI VIÊN SSO</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                Kích Hoạt Huy Hiệu Hội Viên Của Bạn
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 font-normal leading-relaxed">
                Đăng nhập một chạm bằng tài khoản Hội hoặc tra cứu MST để tự động gắn Huy Hiệu Kim Cương Lớp 3 và nhận cơ hội đấu thầu FDI.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition flex items-center space-x-2 font-heading tracking-wide cursor-pointer group"
              >
                <span>Tra Cứu & Kích Hoạt Huy Hiệu</span>
                <Gem className="w-4 h-4 group-hover:scale-110 transition-transform text-amber-400" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PARTNER LOGO TICKER (Bottom Ribbon) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="border-t border-slate-200/80 pt-6 pb-2 text-center space-y-3">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest font-heading">
            ĐỒNG HÀNH CÙNG CÁC TỔ CHỨC & HIỆP HỘI HÀNG ĐẦU VIỆT NAM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VCCI VIETNAM</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">HUBA TP.HCM</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">BNI CONNECT</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">JCI VIETNAM</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VASEP THỦY SẢN</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VITAS DỆT MAY</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VNREA BẤT ĐỘNG SẢN</span>
            <span className="text-xs font-black text-slate-700 font-heading tracking-wider">VLA LOGISTICS</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: VIDEO OVERVIEW MODAL */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#0052cc]">
              <Play className="w-5 h-5 fill-[#0052cc]" />
              <h4 className="font-bold text-base font-heading">Giới Thiệu Mạng Lưới Hội / Hiệp Hội Bảo Chứng</h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mạng lưới Hội / Hiệp Hội trên ChuoiCungUng.vn đóng vai trò là hạt nhân của Lớp KYC số 3 (Bảo chứng thực địa). Nền tảng hỗ trợ các tổ chức số hóa danh bạ hội viên, kết nối cơ hội giao thương B2B tự động qua API và tham vấn chính sách phát triển chuỗi cung ứng công nghiệp bền vững.
            </p>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0047a5] to-[#0052cc] text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-900/20 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASSOCIATION API INTEGRATION MODAL */}
      {/* ========================================================================= */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowApiModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0052cc] text-xs font-bold font-mono">
                <Server className="w-3.5 h-3.5" />
                <span>API INTEGRATION PARTNERSHIP</span>
              </div>
              <h4 className="font-black text-xl font-heading text-slate-900">
                Đăng Ký Tích Hợp API Quản Lý Hội Viên
              </h4>
              <p className="text-xs text-slate-500">
                Dành cho Ban Điều Hành, Ban Thư Ký các Hội, Hiệp Hội và Tổ Chức Ngành Nghề.
              </p>
            </div>

            {apiSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm font-heading">
                  Đăng Ký Tích Hợp Thành Công!
                </h5>
                <p className="text-xs text-slate-600">
                  Đội ngũ Kỹ thuật ChuoiCungUng.vn sẽ liên hệ trực tiếp trong vòng 2 giờ làm việc để cấp API Key và hướng dẫn tài liệu SSO / API.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApiSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên Hội / Hiệp Hội / Tổ Chức *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hội Doanh Nghiệp Cơ Khí - Điện TP.HCM"
                    value={apiFormData.orgName}
                    onChange={(e) => setApiFormData({...apiFormData, orgName: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Người đại diện liên hệ *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Ông Nguyễn Văn An"
                      value={apiFormData.repName}
                      onChange={(e) => setApiFormData({...apiFormData, repName: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0909 123 456"
                      value={apiFormData.phone}
                      onChange={(e) => setApiFormData({...apiFormData, phone: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email chính thức *</label>
                    <input
                      type="email"
                      required
                      placeholder="vanphong@hiephoi.vn"
                      value={apiFormData.email}
                      onChange={(e) => setApiFormData({...apiFormData, email: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Hệ thống đang sử dụng</label>
                    <select
                      value={apiFormData.systemType}
                      onChange={(e) => setApiFormData({...apiFormData, systemType: e.target.value})}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                    >
                      <option value="ERP/CRM">Hệ thống ERP / CRM Doanh nghiệp</option>
                      <option value="Custom CRM">CRM Riêng / Web nội bộ</option>
                      <option value="BNI Connect">BNI Connect / BNI API</option>
                      <option value="VCCI Portal">Cổng thông tin VCCI</option>
                      <option value="Excel/Google Sheet">File Excel / Google Sheets</option>
                      <option value="Khác">Hệ thống khác</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ghi chú yêu cầu kỹ thuật (nếu có)</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả số lượng hội viên cần đồng bộ hoặc yêu cầu SSO..."
                    value={apiFormData.notes}
                    onChange={(e) => setApiFormData({...apiFormData, notes: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowApiModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-900/20 font-heading cursor-pointer"
                  >
                    Gửi Yêu Cầu Kết Nối API
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MEMBER KYC SSO VERIFICATION MODAL */}
      {/* ========================================================================= */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowVerifyModal(false);
                setVerifyResult(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold font-mono">
                <Gem className="w-3.5 h-3.5 text-amber-600" />
                <span>MEMBER KYC LỚP 3 SSO</span>
              </div>
              <h4 className="font-black text-xl font-heading text-slate-900">
                Kích Hoạt Huy Hiệu Kim Cương Lớp 3
              </h4>
              <p className="text-xs text-slate-500">
                Tra cứu thông tin theo Mã Số Thuế để xác thực sự bảo chứng từ Hiệp Hội trực thuộc.
              </p>
            </div>

            <form onSubmit={handleVerifyKyc} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Chọn Hiệp Hội Bạn Đang Tham Gia *</label>
                <select
                  value={verifyAssocId}
                  onChange={(e) => setVerifyAssocId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none"
                >
                  {associationsList.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mã Số Thuế Doanh Nghiệp (MST) *</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập MST (VD: 0100109106, 0312345678...)"
                  value={verifyTaxCode}
                  onChange={(e) => setVerifyTaxCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-amber-900/20 font-heading flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang đối soát thuật toán API...</span>
                  </>
                ) : (
                  <>
                    <Gem className="w-4 h-4" />
                    <span>Xác Thực & Kích Hoạt Ngay</span>
                  </>
                )}
              </button>
            </form>

            {/* Verification Result Card */}
            {verifyResult && (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm font-heading">
                    ĐÃ BẢO CHỨNG THÀNH CÔNG!
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-emerald-100">
                  <div className="font-bold text-slate-900">{verifyResult.companyName}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Tổ chức bảo lãnh:</span>
                    <strong className="text-[#0052cc]">{verifyResult.assocName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Cấp độ xác thực:</span>
                    <span className="text-amber-700 font-bold">{verifyResult.badgeLevel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Độ ưu tiên trên 18 Pha:</span>
                    <span className="text-emerald-700 font-bold font-mono">{verifyResult.priorityScore}</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <Link
                    to="/ban-do-6-giai-doan"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 font-heading"
                  >
                    <span>Xem vị trí ưu tiên trên 18 Pha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
