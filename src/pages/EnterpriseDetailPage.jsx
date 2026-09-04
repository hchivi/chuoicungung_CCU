import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, Star, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, ExternalLink,
  Layers, Factory, Cpu, Wrench, Truck, Leaf, X, MessageCircle,
  Tag, ShieldCheck, Check, Clock, ChevronDown, ChevronUp,
  Briefcase, Target, UserCheck, HelpCircle, ArrowUpRight,
  Send, Copy, CheckCheck, Bookmark, Eye, Image as ImageIcon,
  CheckCircle, Hash, Compass, Info, Headphones, User
} from 'lucide-react';
import enterprisesFullList from '../data/enterprisesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getCompanyMonogram, 
  getMonogramGradient, 
  isValidCustomLogo, 
  getCategoryBannerImage, 
  getEnterpriseAvatarImage 
} from '../utils/companyUtils';

const MASTER_18_PHASES_MAP = {
  "1.1": { title: "1.1 Khảo sát & Định hướng", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "1.2": { title: "1.2 Pháp lý & Giấy phép ĐTM", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "1.3": { title: "1.3 Lựa chọn Địa điểm & KCN", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "2.1": { title: "2.1 Thiết kế Quy hoạch & MEP", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "2.2": { title: "2.2 Thi công Nhà xưởng & Kết cấu", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "2.3": { title: "2.3 Hạ tầng Kỹ thuật & PCCC", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "3.1": { title: "3.1 Cung ứng Máy móc Dây chuyền", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "3.2": { title: "3.2 Cơ điện Lạnh & Tự động hóa", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "3.3": { title: "3.3 Hiệu chuẩn & Nghiệm thu", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "4.1": { title: "4.1 Cung ứng Nguyên vật liệu & Hóa chất", stage: 4, stageName: "Vận hành Sản xuất" },
  "4.2": { title: "4.2 Gia công Cơ khí & Phụ trợ", stage: 4, stageName: "Vận hành Sản xuất" },
  "4.3": { title: "4.3 Bảo trì Thiết bị & Quản lý QC", stage: 4, stageName: "Vận hành Sản xuất" },
  "5.1": { title: "5.1 Tuyển dụng & Đào tạo Lao động", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "5.2": { title: "5.2 Logistics, Kho bãi & Xe nâng", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "5.3": { title: "5.3 Suất ăn Công nghiệp & Tiện ích", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "6.1": { title: "6.1 Chuyển đổi số & Smart Factory", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
  "6.2": { title: "6.2 Năng lượng Xanh & Tiêu chuẩn ESG", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
  "6.3": { title: "6.3 Mở rộng Công suất & M&A", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
};

const FALLBACK_CATEGORY_POOLS = {
  mechanical: [
    { image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80", title: "Máy gia công cơ khí CNC" },
    { image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80", title: "Gia công cắt Laser kim loại" },
    { image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80", title: "Dây chuyền phay tiện chi tiết" },
    { image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80", title: "Hàn kết cấu & chế tạo khung" },
    { image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80", title: "Hệ thống kiểm chuẩn QC đo lường" },
    { image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80", title: "Lắp ráp cụm chi tiết máy B2B" }
  ],
  uniform: [
    { image: "https://pic.trangvangvietnam.com/pics_low/395785472/ao-thun-dong-phuc-doanh-nghiep-T408.jpg", title: "Áo thun đồng phục doanh nghiệp" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395700674/dong-phuc-cong-so-nu-4.jpg", title: "Đồng phục công sở & sơ mi" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395704506/dong-phuc-bao-ho-lao-dong-2.jpg", title: "Đồng phục bảo hộ lao động nhà máy" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395723531/dong-phuc-cong-so-1494674847.jpg", title: "Áo khoác gió & áo khoác sự kiện" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395704506/dong-phuc-ao-thun-5.jpg", title: "Áo thun nhóm & áo sự kiện" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395785472/ao-khoac-DH-Mo-TP.HCM.jpg", title: "Nón & phụ kiện bảo hộ đồng phục" }
  ],
  office: [
    { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80", title: "Không gian làm việc & Thiết bị văn phòng" },
    { image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80", title: "Máy in & photocopy đa chức năng" },
    { image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80", title: "Bàn ghế công thái học văn phòng" },
    { image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80", title: "Thiết bị trình chiếu & họp trực tuyến" },
    { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80", title: "Hệ thống máy chủ server & IT" }
  ],
  packaging: [
    { image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80", title: "Thùng carton sóng & bao bì B2B" },
    { image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80", title: "Pallet nhựa & pallet gỗ công nghiệp" },
    { image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80", title: "Màng PE quấn pallet & băng keo" },
    { image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80", title: "Dây đai đóng kiện & vật liệu chèn lót" }
  ],
  chemical: [
    { image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80", title: "Hóa chất công nghiệp & dung môi" },
    { image: "https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?w=800&auto=format&fit=crop&q=80", title: "Sơn công nghiệp chống rỉ & sàn epoxy" },
    { image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80", title: "Hạt nhựa nguyên sinh & phụ gia ngành nhựa" },
    { image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80", title: "Hóa chất xử lý nước thải nhà máy" }
  ]
};

export function getCategoryFallbackPool(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("đồng phục") || cat.includes("may mặc") || cat.includes("quần áo") || cat.includes("bảo hộ")) {
    return FALLBACK_CATEGORY_POOLS.uniform;
  } else if (cat.includes("văn phòng") || cat.includes("tin học") || cat.includes("máy tính") || cat.includes("phần mềm")) {
    return FALLBACK_CATEGORY_POOLS.office;
  } else if (cat.includes("bao bì") || cat.includes("carton") || cat.includes("pallet") || cat.includes("in ấn")) {
    return FALLBACK_CATEGORY_POOLS.packaging;
  } else if (cat.includes("hóa chất") || cat.includes("nhựa") || cat.includes("dung môi") || cat.includes("sơn")) {
    return FALLBACK_CATEGORY_POOLS.chemical;
  }
  return FALLBACK_CATEGORY_POOLS.mechanical;
}

export default function EnterpriseDetailPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const enterpriseId = id || "ncc-1";

  // Immediate lookup from local dataset
  const localMatch = useMemo(() => {
    return enterprisesFullList.find(e => String(e.id) === String(enterpriseId) || String(e._id) === String(enterpriseId)) 
      || enterprisesFullList[0];
  }, [enterpriseId]);

  const [enterprise, setEnterprise] = useState(localMatch);
  const [activeSection, setActiveSection] = useState('gioi-thieu');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqSent, setRfqSent] = useState(false);

  // Sync from API if online
  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/enterprises/${enterpriseId}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.data) {
            setEnterprise(json.data);
          }
        }
      } catch (e) {
        // Fallback to local
      }
    };
    fetchDetail();
    return () => { isMounted = false; };
  }, [enterpriseId]);

  // Scroll spy to update active anchor link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['gioi-thieu', 'ho-so-phap-ly', 'thu-vien-anh', '18-pha-cung-ung', 'faq', 'lien-he'];
      const scrollPos = window.scrollY + 200;

      for (const sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAnchor = (anchorId) => {
    const el = document.getElementById(anchorId);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(anchorId);
    }
  };

  // Clean URLs & Phone format
  const cleanDomain = enterprise.displayWebsite || (enterprise.website || '').replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim() || 'chuoicungung.com';
  const fullWebUrl = enterprise.website && enterprise.website.startsWith('http') ? enterprise.website : `https://${cleanDomain}`;
  const initial = (enterprise.name || 'DN').charAt(0).toUpperCase();

  const rawPhone = enterprise.phone || enterprise.hotline || '0988123456';
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const zaloUrl = cleanDigits.length >= 9 ? `https://zalo.me/${cleanDigits}` : null;

  // Key personnel generator / mapper
  const keyPersonnel = useMemo(() => {
    if (Array.isArray(enterprise.keyPersonnel) && enterprise.keyPersonnel.length > 0) {
      return enterprise.keyPersonnel;
    }
    const phone = enterprise.hotline || enterprise.phone || '0903 04 12 86';
    const rep = enterprise.legalRepresentative || enterprise.representative || 'Ban Giám Đốc';
    const initials = rep.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'GD';
    return [
      { initials: initials, name: rep, role: 'Giám Đốc / Đại Diện Pháp Luật', phone: phone },
      { initials: 'KD', name: 'Phòng Kinh Doanh & Báo Giá B2B', role: 'Giám Đốc Kinh Doanh', phone: enterprise.hotline || phone },
      { initials: 'MN', name: 'Bộ Phận Kinh Doanh Miền Nam', role: 'Phụ trách Hợp đồng & RFQ', phone: phone },
      { initials: 'MB', name: 'Bộ Phận Kinh Doanh Miền Bắc', role: 'Tư vấn kỹ thuật & Giao dịch', phone: phone }
    ];
  }, [enterprise]);

  // Group company phases by stages
  const groupedPhases = useMemo(() => {
    const phases = enterprise.phases || ["4.1"];
    const groups = {};
    phases.forEach(phId => {
      const meta = MASTER_18_PHASES_MAP[phId] || { title: `Pha ${phId}`, stage: 4, stageName: "Vận hành Sản xuất" };
      if (!groups[meta.stage]) {
        groups[meta.stage] = { stageName: meta.stageName, list: [] };
      }
      groups[meta.stage].list.push({ id: phId, title: meta.title });
    });
    return groups;
  }, [enterprise]);

  // Anchor Nav Items (Hồ sơ pháp lý được đưa lên trước Thư viện ảnh)
  const anchorNavItems = [
    { id: 'gioi-thieu', label: lang === 'en' ? 'About & Capability' : 'Giới thiệu & Năng lực', icon: Briefcase },
    { id: 'ho-so-phap-ly', label: lang === 'en' ? 'Legal Profile' : 'Hồ sơ pháp lý & MST', icon: ShieldCheck },
    { id: 'thu-vien-anh', label: lang === 'en' ? 'Product Gallery' : 'Sản phẩm & Hình ảnh', icon: ImageIcon },
    { id: '18-pha-cung-ung', label: lang === 'en' ? '18 Phases Map' : 'Bản đồ 18 Pha', icon: Compass },
    { id: 'faq', label: lang === 'en' ? 'FAQ' : 'Câu hỏi thường gặp', icon: HelpCircle },
    { id: 'lien-he', label: lang === 'en' ? 'Contact Channels' : 'Liên hệ trực tiếp', icon: Phone },
  ];

  // Gallery and Product Groups resolution
  const structuredProductGroups = useMemo(() => {
    // If enterprise has detailed structured product groups
    if (enterprise.productGroups && enterprise.productGroups.length > 0 && typeof enterprise.productGroups[0] === 'object' && enterprise.productGroups[0].groupName) {
      return enterprise.productGroups.map(grp => {
        const items = Array.isArray(grp.items) && grp.items.length > 0
          ? grp.items.map((it, idx) => typeof it === 'string' ? { image: (grp.images && grp.images[idx]) || getCategoryFallbackPool(enterprise.category)[idx % 5].image, title: it } : it)
          : (grp.images || []).map((img, idx) => ({ image: img, title: (grp.products && grp.products[idx]) || `${grp.groupName} ${idx + 1}` }));
        
        return {
          groupName: grp.groupName,
          items: items.length > 0 ? items : getCategoryFallbackPool(enterprise.category)
        };
      });
    }

    // Default pool matching this enterprise's category
    const pool = getCategoryFallbackPool(enterprise.category || enterprise.industry);
    return [
      {
        groupName: enterprise.category || "Sản Phẩm & Dịch Vụ Tiêu Biểu",
        items: pool
      }
    ];
  }, [enterprise]);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(enterprise.hotline || enterprise.phone || rawPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="space-y-6 pb-28 pt-2 sm:pt-4 font-sans select-none bg-[#f8fafc] min-h-screen text-slate-800 antialiased">
      
      {/* 1. Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto py-2">
          <Link to="/" className="hover:text-blue-600 transition shrink-0">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/doanh-nghiep" className="hover:text-blue-600 transition shrink-0">Hồ sơ nhà cung ứng B2B</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{enterprise.name}</span>
        </nav>
      </div>

      {/* 2. Top Hero Profile Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#0a2540] to-[#0B3558] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700/60">
          
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
            
            {/* Left: Avatar / Logo + Titles */}
            <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
              
              {/* Logo Box */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-lg border border-white/20 overflow-hidden relative">
                <img 
                  src={getEnterpriseAvatarImage(enterprise)} 
                  alt={enterprise.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    const fallbackUrl = getCategoryBannerImage(enterprise.category || enterprise.industry || enterprise.name);
                    if (e.target.src !== fallbackUrl) {
                      e.target.src = fallbackUrl;
                    }
                  }}
                />
              </div>

              {/* Company Info Header */}
              <div className="space-y-2.5 flex-1">
                
                {/* Badges */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-xs">
                  <span className="px-3 py-1 bg-yellow-400 text-slate-950 font-black rounded-lg text-[11px] uppercase tracking-wider font-heading shadow-xs">
                    {enterprise.category || "Nhà Cung Ứng Chuẩn Hóa B2B"}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-lg text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Đã xác thực năng lực B2B
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 backdrop-blur-xs text-slate-300 rounded-lg text-[11px] font-mono">
                    MST: {enterprise.taxCode || "0310966410"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-heading leading-snug tracking-tight">
                  {enterprise.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{enterprise.address || enterprise.location || "Việt Nam"}</span>
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(enterprise.industries || [enterprise.category || "Sản xuất công nghiệp"]).slice(0, 5).map((ind, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 text-[11px] font-medium border border-white/10">
                      {ind}
                    </span>
                  ))}
                </div>

              </div>

            </div>

            {/* Right: Quick Action Controls & RFQ CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72 shrink-0 pt-2 lg:pt-0">
              
              <button
                onClick={() => setShowRfqModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition font-heading cursor-pointer transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>YÊU CẦU BÁO GIÁ B2B (RFQ)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Zalo Button */}
                {zaloUrl && (
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5 font-heading"
                  >
                    <span className="font-black text-xs bg-white text-[#0068FF] px-1 rounded-xs">Z</span>
                    <span>Chat Zalo</span>
                  </a>
                )}

                {/* Direct Call */}
                <a
                  href={`tel:${enterprise.phone || enterprise.hotline || rawPhone}`}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5 font-heading"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Ngay</span>
                </a>
              </div>

            </div>

          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Năm thành lập</span>
              <strong className="text-white font-mono text-sm">{enterprise.establishedYear || enterprise.established || 2011}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Loại hình doanh nghiệp</span>
              <strong className="text-white text-xs truncate block">{enterprise.businessType || "Nhà Sản Xuất & B2B"}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Thị trường cung ứng</span>
              <strong className="text-white text-xs truncate block">{enterprise.mainMarkets || "Toàn quốc & Nhà máy FDI"}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Số pha kỹ thuật</span>
              <strong className="text-yellow-400 font-mono text-sm">{(enterprise.phases || ["4.1"]).length} Pha Kỹ Thuật</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Sticky Anchor Navigation Bar */}
      <div className="sticky top-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {anchorNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToAnchor(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 whitespace-nowrap transition cursor-pointer font-heading ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => scrollToAnchor('lien-he')}
            className="hidden sm:flex px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs items-center space-x-1.5 transition font-heading shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Liên Hệ Trực Tiếp</span>
          </button>

        </div>
      </div>

      {/* 4. Main Two-Column Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: MAIN DETAILED CONTENT (8 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION 1: GIỚI THIỆU CHUNG & NĂNG LỰC CUNG ỨNG */}
          <section id="gioi-thieu" className="scroll-mt-32 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-blue-600 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                1. Giới Thiệu Doanh Nghiệp & Năng Lực Cung Ứng
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4">
                <p>
                  <strong>{enterprise.name}</strong> là đơn vị chuyên nghiệp hoạt động trong lĩnh vực <strong>{enterprise.category || enterprise.industry || "sản xuất & cung ứng công nghiệp"}</strong>. Doanh nghiệp cung cấp các giải pháp toàn diện, đạt tiêu chuẩn kỹ thuật cao phục vụ cho các nhà máy sản xuất, khu công nghiệp và đối tác B2B trong và ngoài nước.
                </p>
                <p>
                  Với hệ thống cơ sở vật chất hiện đại, quy trình kiểm soát chất lượng nghiêm ngặt cùng đội ngũ nhân sự giàu kinh nghiệm, {enterprise.name} cam kết mang đến sản phẩm ổn định về chất lượng, tiến độ giao hàng chuẩn xác và chính sách bảo hành, hậu mãi tối ưu nhất cho quý khách hàng.
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                  <span className="text-[11px] font-bold text-blue-800 uppercase font-heading flex items-center gap-1.5">
                    <Factory className="w-4 h-4 text-blue-600" />
                    NĂNG LỰC SẢN XUẤT
                  </span>
                  <p className="text-xs text-slate-700 font-medium">Đáp ứng đơn hàng quy mô lớn, gia công theo tiêu chuẩn bản vẽ kỹ thuật B2B.</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase font-heading flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    CHUẨN HÓA CHẤT LƯỢNG
                  </span>
                  <p className="text-xs text-slate-700 font-medium">Quy trình kiểm tra chất lượng KCS/QC từng khâu, chứng từ CO/CQ đầy đủ.</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase font-heading flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    TIẾN ĐỘ & BẢO HÀNH
                  </span>
                  <p className="text-xs text-slate-700 font-medium">Giao hàng toàn quốc tận nơi, hỗ trợ kỹ thuật và đổi trả nhanh chóng.</p>
                </div>
              </div>

            </div>

          </section>

          {/* SECTION 2: HỒ SƠ DOANH NGHIỆP & NĂNG LỰC PHÁP LÝ (IMAGE 2 STYLE - MOVED ABOVE IMAGES) */}
          <section id="ho-so-phap-ly" className="scroll-mt-32 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-emerald-600 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                2. Hồ Sơ Doanh Nghiệp & Năng Lực Pháp Lý
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Profile Info (7 cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-heading flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>THÔNG TIN ĐĂNG KÝ DOANH NGHIỆP</span>
                </h3>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-slate-500">Tên pháp nhân đầy đủ:</span>
                    <strong className="text-slate-900 font-bold sm:text-right">{enterprise.name}</strong>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-500">Mã số thuế doanh nghiệp (MST):</span>
                    <strong className="text-slate-900 font-mono font-black text-sm">{enterprise.taxCode || "0310966410"}</strong>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-500">Năm đăng ký thành lập:</span>
                    <strong className="text-slate-900 font-mono font-bold">{enterprise.establishedYear || enterprise.established || "2011"}</strong>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-slate-500">Người đại diện pháp luật:</span>
                    <strong className="text-slate-900 font-bold">{enterprise.legalRepresentative || enterprise.representative || "Ban Giám Đốc"}</strong>
                  </div>

                  <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-slate-500">Trụ sở / Nhà xưởng sản xuất:</span>
                    <span className="text-slate-900 font-medium sm:text-right">{enterprise.address || enterprise.location || "Việt Nam"}</span>
                  </div>
                </div>

              </div>

              {/* Right Certifications (5 cols) */}
              <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-heading flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>TIÊU CHUẨN & CHỨNG CHỈ</span>
                </h3>

                <div className="space-y-2.5">
                  {[
                    { title: "ISO 9001:2015", sub: "Hệ thống quản lý chất lượng tiêu chuẩn quốc tế" },
                    { title: "ISO 14001:2015", sub: "Quản lý môi trường và xử lý phát thải" },
                    { title: "Chứng nhận Tier 1 B2B", sub: "Đạt chuẩn cung ứng nhà máy FDI" },
                    { title: "Hàng Việt Nam Chất Lượng Cao", sub: "Chứng nhận uy tín từ hiệp hội doanh nghiệp" },
                  ].map((cert, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-start space-x-2.5">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-black text-emerald-950 font-heading block">{cert.title}</strong>
                        <span className="text-[10px] text-emerald-700 leading-snug">{cert.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </section>

          {/* SECTION 3: THƯ VIỆN HÌNH ẢNH SẢN PHẨM & DỊCH VỤ (IMAGE 1 STYLE: CHIA THEO NHÓM SẢN PHẨM, GỌN GÀNG) */}
          <section id="thu-vien-anh" className="scroll-mt-32 space-y-6">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-purple-600 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                3. Thư Viện Hình Ảnh Sản Phẩm & Nhà Xưởng
              </h2>
            </div>

            <div className="space-y-6">
              {structuredProductGroups.map((grp, gIdx) => (
                <div key={gIdx} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  
                  {/* Category Title Indicator like Image 1 */}
                  <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 font-heading lowercase first-letter:uppercase">
                      {grp.groupName}
                    </h3>
                  </div>

                  {/* Compact, Neat Grid of Product Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {grp.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        onClick={() => setSelectedImage(item.image)}
                        className="group flex flex-col rounded-xl overflow-hidden border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition cursor-pointer"
                      >
                        {/* Image Box */}
                        <div className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-1">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              const pool = getCategoryFallbackPool(enterprise.category);
                              e.target.src = pool[iIdx % pool.length].image;
                            }}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="p-1.5 rounded-full bg-white/90 text-slate-900 text-[10px] font-bold flex items-center gap-1 shadow">
                              <Eye className="w-3 h-3" />
                              <span>Xem lớn</span>
                            </span>
                          </div>
                        </div>

                        {/* Product Title Caption below image (Like Image 1) */}
                        <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                          <p className="text-[11px] font-semibold text-slate-700 truncate group-hover:text-blue-600 transition">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </section>

          {/* SECTION 4: BẢN ĐỒ ĐỊNH VỊ 6 GIAI ĐOẠN & 18 PHA KỸ THUẬT */}
          <section id="18-pha-cung-ung" className="scroll-mt-32 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-blue-700 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                4. Bản Đồ Định Vị Trong 6 Giai Đoạn & 18 Pha Kỹ Thuật
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Doanh nghiệp được chuẩn hóa và thẩm định trực tiếp tham gia cung ứng tại <strong>{(enterprise.phases || []).length} Pha kỹ thuật chuyên sâu</strong> trong toàn bộ vòng đời phát triển của một nhà máy công nghiệp:
              </p>

              <div className="space-y-4">
                {Object.keys(groupedPhases).map(stgNum => {
                  const grp = groupedPhases[stgNum];
                  return (
                    <div key={stgNum} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-black text-slate-800 font-heading uppercase tracking-wide flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[11px]">
                            GIAI ĐOẠN 0{stgNum}
                          </span>
                          <span>{grp.stageName}</span>
                        </span>
                        <Link to={`/giai-doan/${stgNum}`} className="text-xs text-blue-600 font-bold hover:underline">
                          Xem chi tiết giai đoạn ➔
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {grp.list.map(ph => (
                          <Link 
                            key={ph.id}
                            to={`/pha/${ph.id}`} 
                            className="p-3 bg-white hover:bg-blue-50 text-slate-900 hover:text-blue-800 rounded-xl text-xs font-bold border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center justify-between group"
                          >
                            <span>{ph.title}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </section>

          {/* SECTION 5: CÂU HỎI THƯỜNG GẶP (FAQ) */}
          <section id="faq" className="scroll-mt-32 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-orange-500 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                5. Giải Đáp Kỹ Thuật & Câu Hỏi Thường Gặp (FAQ)
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
              {(enterprise.faq || [
                { q: `${enterprise.name} có khả năng cung ứng cho đơn hàng lớn KCN không?`, a: "Có. Doanh nghiệp có năng lực sản xuất quy mô lớn, máy móc tự động hóa và đáp ứng đầy đủ CO/CQ cho các nhà máy KCN." },
                { q: `Quy trình gửi báo giá và duyệt mẫu kỹ thuật ra sao?`, a: "Quý đối tác có thể liên hệ trực tiếp qua Hotline/Zalo hoặc gửi yêu cầu RFQ. Bộ phận kỹ thuật sẽ phản hồi báo giá chi tiết trong vòng 2-4 giờ làm việc." }
              ]).map((item, idx) => (
                <div key={idx} className="border border-slate-200/90 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                    className="w-full p-4 text-left text-xs sm:text-sm font-extrabold text-slate-900 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer font-heading"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">?</span>
                      <span>{item.q}</span>
                    </span>
                    {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openFaqIndex === idx && (
                    <div className="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </section>

          {/* SECTION 6: KÊNH LIÊN HỆ TRỰC TIẾP & KẾT NỐI B2B */}
          <section id="lien-he" className="scroll-mt-32 space-y-4">
            
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <span className="w-2.5 h-7 bg-emerald-600 rounded-full" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase">
                6. Kênh Liên Hệ Trực Tiếp & Kết Nối B2B
              </h2>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-[#072348] to-[#0A3060] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-700">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black font-heading tracking-tight">
                    Kết Nối Cung Ứng Trực Tiếp Với {enterprise.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Hỗ trợ tư vấn thông số kỹ thuật, gửi mẫu vật lý và báo giá nhà xưởng 24/7.
                  </p>
                </div>

                <button
                  onClick={() => setShowRfqModal(true)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition font-heading cursor-pointer shrink-0"
                >
                  Gửi Yêu Cầu Báo Giá (RFQ)
                </button>
              </div>

              {/* Direct Contact Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Phone Hotline */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-heading flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    HOTLINE KINH DOANH
                  </span>
                  <p className="text-sm font-black text-amber-300 font-mono">
                    {enterprise.hotline || enterprise.phone || rawPhone}
                  </p>
                  <button
                    onClick={handleCopyPhone}
                    className="text-[11px] text-slate-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPhone ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPhone ? "Đã sao chép" : "Sao chép số"}</span>
                  </button>
                </div>

                {/* Zalo Direct */}
                {zaloUrl && (
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-[#0068FF]/20 hover:bg-[#0068FF]/30 rounded-2xl border border-[#0068FF]/40 space-y-2 transition block"
                  >
                    <span className="text-[11px] font-bold text-blue-300 uppercase font-heading flex items-center gap-1.5">
                      <span className="bg-white text-[#0068FF] px-1 rounded-xs font-black text-[9px]">Z</span>
                      ZALO OFFICIAL
                    </span>
                    <p className="text-xs font-black text-white font-heading">Chat Zalo Ngay</p>
                    <span className="text-[10px] text-blue-200 block">Nhận báo giá & gửi mẫu ➔</span>
                  </a>
                )}

                {/* Corporate Email */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-heading flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    HỘP THƯ BÁO GIÁ
                  </span>
                  <p className="text-xs font-black text-white truncate font-mono">
                    {enterprise.email || "contact@chuoicungung.com"}
                  </p>
                  <a 
                    href={`mailto:${enterprise.email || 'contact@chuoicungung.com'}?subject=Yêu cầu báo giá B2B`}
                    className="text-[10px] text-blue-300 hover:underline block"
                  >
                    Gửi email trực tiếp ➔
                  </a>
                </div>

                {/* Website */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-heading flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-yellow-400" />
                    CỔNG THÔNG TIN
                  </span>
                  <p className="text-xs font-black text-white truncate">
                    {cleanDomain}
                  </p>
                  <a 
                    href={fullWebUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-amber-300 hover:underline block"
                  >
                    Mở website ➔
                  </a>
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIÊN HỆ NHÀ CUNG CẤP & NGƯỜI PHỤ TRÁCH (GIỐNG IMAGE 1) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] text-white rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6 sticky top-24">
            
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="p-2 bg-yellow-400/20 text-yellow-400 rounded-xl">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 font-heading">
                  LIÊN HỆ NHÀ CUNG CẤP
                </h3>
                <p className="text-[11px] text-slate-400">Kết nối trực tiếp & hỗ trợ 24/7</p>
              </div>
            </div>

            {/* Company Short Profile */}
            <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700">
                {enterprise.logo ? (
                  <img src={enterprise.logo} alt={enterprise.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-slate-900 font-black text-lg">{initial}</span>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-white font-heading line-clamp-2 leading-tight">
                  {enterprise.name}
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Nhà cung ứng đã xác thực
                </span>
              </div>
            </div>

            {/* NGƯỜI PHỤ TRÁCH (IMAGE 1 STYLE) */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase text-slate-400 font-heading flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-yellow-400" />
                <span>NGƯỜI PHỤ TRÁCH</span>
              </h4>

              <div className="space-y-2.5">
                {keyPersonnel.map((person, pIdx) => (
                  <div key={pIdx} className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-between gap-2.5 hover:border-slate-700 transition">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 border border-amber-400/30 font-mono">
                        {person.initials}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs font-black text-white font-heading block truncate">
                          {person.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 block truncate">{person.role}</span>
                      </div>
                    </div>

                    <a 
                      href={`tel:${person.phone}`}
                      className="p-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white transition flex items-center gap-1 shrink-0 text-[10px] font-bold font-mono"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{person.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* THÔNG TIN NHANH (IMAGE 1 STYLE) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <h4 className="text-[11px] font-black uppercase text-slate-400 font-heading flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-yellow-400" />
                <span>THÔNG TIN NHANH</span>
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Loại hình:</span>
                  <span className="font-bold text-white">{enterprise.businessType || "Nhà Sản Xuất B2B"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Năm thành lập:</span>
                  <span className="font-bold text-white">{enterprise.establishedYear || enterprise.established || "2011"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Mã số thuế:</span>
                  <span className="font-mono font-bold text-amber-300">{enterprise.taxCode || "0310966410"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowRfqModal(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition font-heading cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI YÊU CẦU BÁO GIÁ (RFQ)</span>
              </button>

              {zaloUrl && (
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span className="font-black text-xs bg-white text-[#0068FF] px-1 rounded-xs">Z</span>
                  <span>Chat Zalo Báo Giá Ngay</span>
                </a>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* RFQ Quotation Modal */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => { setShowRfqModal(false); setRfqSent(false); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {rfqSent ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 font-heading">Gửi Yêu Cầu Báo Giá Thành Công!</h3>
                <p className="text-xs text-slate-600">
                  Hệ thống Chuỗi Cung Ứng VN đã chuyển tiếp yêu cầu đến phòng kinh doanh của <strong>{enterprise.name}</strong>. Đại diện kỹ thuật sẽ liên hệ trong vòng 2 giờ.
                </p>
                <button
                  onClick={() => { setShowRfqModal(false); setRfqSent(false); }}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl font-heading cursor-pointer"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    Gửi Yêu Cầu Báo Giá (RFQ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gửi trực tiếp đến <strong>{enterprise.name}</strong>
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setRfqSent(true); }} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Họ tên & Đơn vị công tác *</label>
                    <input required placeholder="Ví dụ: Nguyễn Văn A - Công ty FDI Long An" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Số điện thoại / Zalo *</label>
                      <input required placeholder="0988xxxxxx" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-500" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email nhận báo giá *</label>
                      <input required type="email" placeholder="email@congty.com" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hạng mục sản phẩm / Quy cách yêu cầu *</label>
                    <textarea rows={3} required placeholder="Mô tả số lượng, tiêu chuẩn chất lượng hoặc đính kèm link bản vẽ..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-blue-500 resize-none" />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition font-heading cursor-pointer"
                  >
                    GỬI YÊU CẦU NGAY
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Gallery */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-transparent rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Preview" referrerPolicy="no-referrer" className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
