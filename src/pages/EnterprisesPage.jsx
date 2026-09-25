import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Building2, CheckCircle2,
  ChevronRight, ArrowRight, RotateCcw, ShieldCheck, Award, Layers,
  Phone, Globe, Mail, ExternalLink, Factory, Cpu, Wrench, Truck,
  Leaf, Sparkles, Check, ChevronDown, Flame, Zap, Clock, Tag,
  ChevronLeft, ArrowUp, Plus, LayoutGrid, List, ArrowUpCircle, ArrowDownCircle,
  Compass, HardHat, PackageCheck, Boxes, MessageCircle, FileSearch, HelpCircle,
  Users, RefreshCw, BarChart3, Settings, Eye, PhoneCall, Send, Star, X
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import categoriesAlphabetical from '../data/categoriesAlphabetical.json';
import phaseTaxonomyAlphabetical from '../data/phaseTaxonomyAlphabetical.json';
import enterprisesFullList from '../data/enterprisesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';
import FoundingPartnerCard from '../components/FoundingPartnerCard';
import {
  getCompanyMonogram,
  getMonogramGradient,
  isValidCustomLogo,
  getEnterpriseAvatarImage,
  getCategoryBannerImage,
  getEnterpriseKYCLevel,
  getEnterprisePhone,
  maskPhoneNumber,
  getEnterpriseThumbnails
} from '../utils/companyUtils';
import SupplierTopNavigationBlocks from '../components/SupplierTopNavigationBlocks';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';
import SupplierRegistrationModal from '../components/suppliers/SupplierRegistrationModal';

// 24 Latin Alphabet Letters matching directory
const ALPHABET_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X'];

// Exact 18-Phase Reference mapped strictly from stagesData (Stage 1 to 6)
const MASTER_18_PHASES = [
  // Giai đoạn 1: Chuẩn bị & Đầu tư (Purple)
  { id: "1.1", stage: 1, title: "1.1 Khảo sát & Định hướng", enTitle: "1.1 Feasibility & Strategic Survey", icon: Search, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },
  { id: "1.2", stage: 1, title: "1.2 Pháp lý & Thủ tục", enTitle: "1.2 Legal Licensing & Procedures", icon: ShieldCheck, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },
  { id: "1.3", stage: 1, title: "1.3 Chọn địa điểm & Mặt bằng", enTitle: "1.3 Site Selection & Industrial Park", icon: MapPin, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },

  // Giai đoạn 2: Thiết kế & Xây dựng (Blue / Green)
  { id: "2.1", stage: 2, title: "2.1 Thiết kế & Quy hoạch", enTitle: "2.1 Master Planning & Architecture", icon: Layers, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },
  { id: "2.2", stage: 2, title: "2.2 Thi công xây dựng", enTitle: "2.2 Civil & Structural Construction", icon: Building2, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },
  { id: "2.3", stage: 2, title: "2.3 Cơ điện & Hạ tầng kỹ thuật", enTitle: "2.3 MEP & Technical Infrastructure", icon: Flame, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },

  // Giai đoạn 3: Lắp đặt & Hoàn thiện (Cyan)
  { id: "3.1", stage: 3, title: "3.1 Lắp đặt máy & Dây chuyền", enTitle: "3.1 Machinery Rigging & Lines", icon: Factory, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },
  { id: "3.2", stage: 3, title: "3.2 Hoàn thiện không gian sản xuất", enTitle: "3.2 Cleanroom & Fit-out", icon: Cpu, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },
  { id: "3.3", stage: 3, title: "3.3 Kiểm tra & Chạy thử Nghiệm thu", enTitle: "3.3 Trial Runs & Acceptance", icon: Award, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },

  // Giai đoạn 4: Vận hành Sản xuất (Emerald)
  { id: "4.1", stage: 4, title: "4.1 Cung ứng đầu vào (NVL, linh kiện)", enTitle: "4.1 Input Sourcing (Materials & Parts)", icon: Zap, stageName: "Vận hành Sản xuất", color: "#10b981" },
  { id: "4.2", stage: 4, title: "4.2 Quản lý sản xuất & Kiểm soát", enTitle: "4.2 Production Management & QA/QC", icon: Wrench, stageName: "Vận hành Sản xuất", color: "#10b981" },
  { id: "4.3", stage: 4, title: "4.3 Giao nhận & Phân phối", enTitle: "4.3 Warehousing & Outbound Logistics", icon: Truck, stageName: "Vận hành Sản xuất", color: "#10b981" },

  // Giai đoạn 5: Nhân sự & Hậu cần (Amber)
  { id: "5.1", stage: 5, title: "5.1 Tuyển dụng & Lao động", enTitle: "5.1 Staffing & Labor Recruitment", icon: Users, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },
  { id: "5.2", stage: 5, title: "5.2 Đời sống & Phúc lợi", enTitle: "5.2 Catering, Commuting & Welfare", icon: PackageCheck, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },
  { id: "5.3", stage: 5, title: "5.3 Đồng phục & Bảo hộ (PPE)", enTitle: "5.3 Uniforms & PPE Safety Gear", icon: ShieldCheck, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },

  // Giai đoạn 6: Mở rộng – Tối ưu – Chuyển đổi (Rose / Red)
  { id: "6.1", stage: 6, title: "6.1 Mở rộng công suất & Nhà máy", enTitle: "6.1 Capacity Expansion & Phase 2", icon: Sparkles, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
  { id: "6.2", stage: 6, title: "6.2 Audit & ISO – Chuẩn hóa", enTitle: "6.2 Auditing, ISO & Standards", icon: CheckCircle2, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
  { id: "6.3", stage: 6, title: "6.3 Chuyển đổi số & Tự động hóa", enTitle: "6.3 Digital & Green ESG Transition", icon: Leaf, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
];

// Highlighted Prominent Keywords (2-3 keywords per phase for ALL 18 phases)
export const HIGHLIGHT_PHASE_KEYWORDS = [
  // GĐ 1: Chuẩn bị & Đầu tư
  { label: "khảo sát địa chất", query: "khảo sát địa chất", phase: "1.1", tag: "Địa chất" },
  { label: "báo cáo khả thi FS", query: "báo cáo khả thi", phase: "1.1", tag: "FS" },
  { label: "lập hồ sơ ĐTM", query: "đánh giá tác động môi trường", phase: "1.2", tag: "ĐTM" },
  { label: "giấy phép xây dựng", query: "giấy phép xây dựng", phase: "1.2", tag: "Pháp lý" },
  { label: "thuê đất KCN", query: "thuê đất khu công nghiệp", phase: "1.3", tag: "Quỹ đất" },
  { label: "nhà xưởng xây sẵn", query: "nhà xưởng cho thuê", phase: "1.3", tag: "Xưởng KCN" },

  // GĐ 2: Thiết kế & Xây dựng
  { label: "thiết kế quy hoạch 1/500", query: "thiết kế quy hoạch", phase: "2.1", tag: "Quy hoạch" },
  { label: "mô hình BIM nhà máy", query: "mô hình BIM", phase: "2.1", tag: "BIM" },
  { label: "thi công nhà thép tiền chế", query: "nhà thép tiền chế", phase: "2.2", tag: "Xây dựng" },
  { label: "sàn bê tông mài tăng cứng", query: "sàn bê tông", phase: "2.2", tag: "Sàn xưởng" },
  { label: "trạm biến áp 22kV", query: "trạm biến áp 22kV", phase: "2.3", tag: "Cơ điện" },
  { label: "hệ thống PCCC tự động", query: "PCCC tự động", phase: "2.3", tag: "PCCC" },
  { label: "điều hòa thông gió HVAC", query: "điều hòa thông gió", phase: "2.3", tag: "HVAC" },

  // GĐ 3: Lắp đặt & Hoàn thiện
  { label: "lắp đặt cẩu trục 10T", query: "cẩu trục", phase: "3.1", tag: "Cẩu trục" },
  { label: "lắp đặt dây chuyền máy", query: "dây chuyền sản xuất", phase: "3.1", tag: "Dây chuyền" },
  { label: "phòng sạch Class 1000", query: "phòng sạch", phase: "3.2", tag: "Phòng sạch" },
  { label: "sơn sàn Epoxy chống tĩnh điện", query: "sơn sàn Epoxy", phase: "3.2", tag: "Epoxy" },
  { label: "chạy thử & nghiệm thu", query: "nghiệm thu", phase: "3.3", tag: "Nghiệm thu" },
  { label: "kiểm định an toàn máy móc", query: "kiểm định", phase: "3.3", tag: "Kiểm định" },

  // GĐ 4: Vận hành Sản xuất
  { label: "thép cuộn mạ kẽm", query: "thép cuộn", phase: "4.1", tag: "Vật liệu" },
  { label: "gia công CNC chính xác", query: "gia công CNC", phase: "4.1", tag: "Cơ khí" },
  { label: "bu lông ốc vít cấp bền", query: "bu lông ốc vít", phase: "4.1", tag: "Linh kiện" },
  { label: "quản lý sản xuất MES", query: "phần mềm MES", phase: "4.2", tag: "MES" },
  { label: "bảo trì máy công nghiệp", query: "bảo trì", phase: "4.2", tag: "Bảo trì" },
  { label: "vận tải container lạnh", query: "container lạnh", phase: "4.3", tag: "Vận tải" },
  { label: "pallet gỗ xuất khẩu", query: "pallet gỗ", phase: "4.3", tag: "Logistics" },
  { label: "cho thuê kho bãi KCN", query: "cho thuê kho bãi", phase: "4.3", tag: "Kho bãi" },

  // GĐ 5: Nhân sự & Hậu cần
  { label: "tuyển dụng lao động KCN", query: "tuyển dụng lao động", phase: "5.1", tag: "Nhân sự" },
  { label: "cung ứng lao động thời vụ", query: "lao động thời vụ", phase: "5.1", tag: "Lao động" },
  { label: "suất ăn công nghiệp HACCP", query: "suất ăn công nghiệp", phase: "5.2", tag: "Suất ăn" },
  { label: "quà tặng doanh nghiệp Tết", query: "quà tặng", phase: "5.2", tag: "Quà tặng" },
  { label: "áo thun đồng phục công nhân", query: "áo thun", phase: "5.3", tag: "Đồng phục" },
  { label: "giày bảo hộ & nón PPE", query: "bảo hộ lao động", phase: "5.3", tag: "Bảo hộ" },

  // GĐ 6: Mở rộng – Tối ưu – Chuyển đổi
  { label: "mở rộng nhà máy Pha 2", query: "mở rộng nhà máy", phase: "6.1", tag: "Mở rộng" },
  { label: "cải tạo nâng cấp xưởng", query: "nâng cấp nhà máy", phase: "6.1", tag: "Nâng cấp" },
  { label: "tư vấn chứng nhận ISO 9001", query: "chứng nhận ISO", phase: "6.2", tag: "ISO Audit" },
  { label: "chứng chỉ xanh ESG", query: "tiêu chuẩn ESG", phase: "6.2", tag: "ESG" },
  { label: "robot tự hành AGV", query: "robot tự hành AGV", phase: "6.3", tag: "Robot AGV" },
  { label: "điện mặt trời áp mái 1MWp", query: "điện mặt trời áp mái", phase: "6.3", tag: "Năng lượng" }
];
export const TRENDING_NICHE_PILLS = HIGHLIGHT_PHASE_KEYWORDS;

// Top Trending Spotlight Topics
const SPOTLIGHT_TOPICS = [
  {
    id: "gift-tet",
    title: "🎁 Top Quà Tặng Doanh Nghiệp & Tết 2025",
    subtitle: "Hộp quà, màng co, nông sản, giỏ quà cao cấp",
    query: "quà tặng",
    badge: "Xu hướng mua sắm Q4",
    color: "from-rose-500 to-amber-500",
    border: "hover:border-rose-300",
    bgLight: "bg-rose-50/50"
  },
  {
    id: "cnc-jig",
    title: "⚙️ Top Cơ Khí Chính Xác & Jig CNC",
    subtitle: "Gia công chi tiết máy, khuôn mẫu, phay 5 trục",
    query: "gia công CNC",
    badge: "Chuỗi FDI & Bán dẫn",
    color: "from-blue-600 to-cyan-600",
    border: "hover:border-blue-300",
    bgLight: "bg-blue-50/50"
  },
  {
    id: "logistics-port",
    title: "🚚 Top Logistics Cảng Biển & Forwarding",
    subtitle: "Container lạnh, kho ngoại quan, xe nâng, pallet",
    query: "logistics",
    badge: "Xuất nhập khẩu",
    color: "from-emerald-600 to-teal-600",
    border: "hover:border-emerald-300",
    bgLight: "bg-emerald-50/50"
  },
  {
    id: "mep-cleanroom",
    title: "🏗️ Top Xây Dựng & Phòng Sạch MEP",
    subtitle: "Nhà xưởng tiền chế, sàn Epoxy, hệ thống HVAC",
    query: "phòng sạch",
    badge: "Hạ tầng nhà máy",
    color: "from-indigo-600 to-purple-600",
    border: "hover:border-indigo-300",
    bgLight: "bg-indigo-50/50"
  }
];

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh",
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương",
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên"
];

const QUICK_PROVINCE_CHIPS = [
  "Toàn quốc", "Hà Nội", "TP. Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Bắc Ninh", "Hải Phòng", "Long An", "Đà Nẵng"
];

// Deterministic base vote generator
export function getEnterpriseBaseVotes(ent) {
  if (typeof ent?.votes === 'number' && ent.votes > 0) return ent.votes;
  if (typeof ent?.baseVotes === 'number' && ent.baseVotes > 0) return ent.baseVotes;

  const str = String(ent?.id || ent?._id || ent?.taxCode || ent?.name || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  const bonus = (ent?.website ? 25 : 0) + (ent?.logo ? 20 : 0) + (ent?.images && ent.images.length > 0 ? 15 : 0);
  const base = 18 + (hash % 95) + bonus;
  return base;
}

// Filter enterprises by full token matching and all criteria
function filterAllEnterprises(allData, { 
  searchTerm, 
  selectedStage, 
  selectedPhase, 
  selectedProvince, 
  selectedCategory, 
  selectedLetter, 
  selectedKyc,
  filterApiReady,
  filterFastQuote,
  filterIsoCertified,
  votes 
}) {
  if (!allData || !Array.isArray(allData)) return [];
  let filtered = [...allData];

  // 1. Filter by Multi-term Search Query with smart multi-word fallback
  if (searchTerm && searchTerm.trim()) {
    const qClean = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').trim();
    const queryTokens = qClean.split(/\s+/).filter(Boolean);

    const strictMatches = filtered.filter(e => {
      const tokens = e._searchTokens || (
        `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''} ${Array.isArray(e.products) ? e.products.join(' ') : ''} ${e.taxCode || ''}`
      ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

      return queryTokens.every(tok => tokens.includes(tok));
    });

    if (strictMatches.length > 0) {
      filtered = strictMatches;
    } else if (queryTokens.length > 1) {
      // Smart fallback: match any key tokens so searches never return empty unexpectedly
      filtered = filtered.filter(e => {
        const tokens = e._searchTokens || (
          `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''} ${Array.isArray(e.products) ? e.products.join(' ') : ''} ${e.taxCode || ''}`
        ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

        return queryTokens.some(tok => tokens.includes(tok));
      });
    } else {
      filtered = strictMatches;
    }
  }

  // 2. Filter by 6 Stages
  if (selectedStage !== 'all') {
    const stgNum = parseInt(selectedStage);
    filtered = filtered.filter(e => e.stages && e.stages.includes(stgNum));
  }

  // 3. Filter by 18 Phases
  if (selectedPhase !== 'all') {
    filtered = filtered.filter(e => e.phases && e.phases.includes(selectedPhase));
  }

  // 4. Filter by Province
  if (selectedProvince && selectedProvince !== 'Toàn quốc') {
    filtered = filtered.filter(e => e.province && (e.province === selectedProvince || e.province.includes(selectedProvince)));
  }

  // 5. Filter by Category
  if (selectedCategory !== 'all') {
    const targetCat = selectedCategory.toLowerCase();
    filtered = filtered.filter(e => {
      const cat = (e.category || e.industry || '').toLowerCase();
      return cat.includes(targetCat) || targetCat.includes(cat);
    });
  }

  // 6. Filter by Letter
  if (selectedLetter !== 'TẤT CẢ') {
    filtered = filtered.filter(e => {
      if (e.phaseLetter) {
        return e.phaseLetter === selectedLetter;
      }
      const cat = (e.category || e.industry || '').trim();
      const first = cat.charAt(0).toUpperCase();
      const targetFirst = (first === 'Đ' || first === 'đ') ? 'D' : first;
      return targetFirst === selectedLetter;
    });
  }

  // 7. Filter by KYC Level (Diamond, Gold, Silver)
  if (selectedKyc && selectedKyc !== 'all') {
    filtered = filtered.filter(e => {
      const kyc = getEnterpriseKYCLevel(e);
      return kyc.level === selectedKyc;
    });
  }

  // 8. Filter by Tech & Standard Toggles
  if (filterApiReady) {
    filtered = filtered.filter(e => {
      const kyc = getEnterpriseKYCLevel(e);
      return kyc.level === 'diamond' || e.isVerifiedPartner || e.website;
    });
  }

  if (filterFastQuote) {
    filtered = filtered.filter(e => Boolean(e.phone || e.email));
  }

  if (filterIsoCertified) {
    filtered = filtered.filter(e => {
      const text = `${e.name || ''} ${e.category || ''} ${e.description || ''} ${e.notes || ''}`.toLowerCase();
      return /iso|haccp|gmp|fda|ce|rohs|esg/i.test(text) || getEnterpriseKYCLevel(e).level !== 'silver';
    });
  }

  // 9. Sort by highest total votes
  filtered.sort((a, b) => {
    const keyA = String(a.id || a._id || a.name);
    const keyB = String(b.id || b._id || b.name);

    const totalA = getEnterpriseBaseVotes(a) + ((votes && votes[keyA]) || 0);
    const totalB = getEnterpriseBaseVotes(b) + ((votes && votes[keyB]) || 0);

    return totalB - totalA;
  });

  return filtered;
}

export default function EnterprisesPage() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Read URL query params
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const searchTerm = queryParams.get('q') || '';
  const selectedPhase = queryParams.get('phase') || 'all';
  const selectedStage = queryParams.get('stage') || 'all';
  const selectedProvince = queryParams.get('province') || 'Toàn quốc';
  const selectedCategory = queryParams.get('category') || 'all';
  const selectedKyc = queryParams.get('kyc') || 'all';

  const [selectedLetter, setSelectedLetter] = useState(() => queryParams.get('letter') || 'TẤT CẢ');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterApiReady, setFilterApiReady] = useState(false);
  const [filterFastQuote, setFilterFastQuote] = useState(false);
  const [filterIsoCertified, setFilterIsoCertified] = useState(false);

  // Modals state
  const [quoteModalSupplier, setQuoteModalSupplier] = useState(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isBottomBannerVisible, setIsBottomBannerVisible] = useState(true);

  // Elastic search suggestions state
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Sync selectedLetter with URL
  useEffect(() => {
    const urlLetter = queryParams.get('letter');
    if (urlLetter && urlLetter !== selectedLetter) {
      setSelectedLetter(urlLetter);
    } else if (!urlLetter && selectedLetter !== 'TẤT CẢ') {
      setSelectedLetter('TẤT CẢ');
    }
  }, [location.search]);

  // Helper to push new query params to browser history & update URL
  const updateFilterUrl = (newParams) => {
    const current = new URLSearchParams(location.search);

    Object.entries(newParams).forEach(([key, val]) => {
      if (!val || val === 'all' || val === 'Toàn quốc' || val === 'TẤT CẢ') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });

    const searchString = current.toString();
    navigate({
      pathname: location.pathname,
      search: searchString ? `?${searchString}` : ''
    }, { replace: false });
  };

  // User Voting System state with LocalStorage persistence
  const [votes, setVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_supplier_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userVoteActions, setUserVoteActions] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_user_vote_actions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleVote = (ent, delta) => {
    const key = typeof ent === 'object' && ent !== null ? String(ent.id || ent._id || ent.name) : String(ent);
    const currentAction = userVoteActions[key] || 0;
    let newDelta = delta;
    let newAction = delta;

    if (currentAction === delta) {
      newDelta = -delta;
      newAction = 0;
    } else if (currentAction !== 0) {
      newDelta = delta * 2;
      newAction = delta;
    }

    setVotes(prev => {
      const updated = { ...prev, [key]: (prev[key] || 0) + newDelta };
      try { localStorage.setItem('ccu_supplier_votes', JSON.stringify(updated)); } catch { }
      return updated;
    });

    setUserVoteActions(prev => {
      const updated = { ...prev, [key]: newAction };
      try { localStorage.setItem('ccu_user_vote_actions', JSON.stringify(updated)); } catch { }
      return updated;
    });
  };

  // Pagination & Display limit controls
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [location.search, selectedLetter, filterApiReady, filterFastQuote, filterIsoCertified]);

  // Filtered dataset
  const filteredEnterprises = useMemo(() => {
    return filterAllEnterprises(enterprisesFullList, {
      searchTerm,
      selectedStage,
      selectedPhase,
      selectedProvince,
      selectedCategory,
      selectedLetter,
      selectedKyc,
      filterApiReady,
      filterFastQuote,
      filterIsoCertified,
      votes
    });
  }, [
    searchTerm,
    selectedStage,
    selectedPhase,
    selectedProvince,
    selectedCategory,
    selectedLetter,
    selectedKyc,
    filterApiReady,
    filterFastQuote,
    filterIsoCertified,
    votes
  ]);

  const totalCount = filteredEnterprises.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const displayedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEnterprises.slice(start, start + pageSize);
  }, [filteredEnterprises, currentPage, pageSize]);

  // Instant Search Suggestions Matching
  const instantSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 2) return { pills: [], phases: [], categories: [] };
    const cleanQ = searchTerm.toLowerCase().trim();

    // Check trending niche pills
    const matchedPills = (HIGHLIGHT_PHASE_KEYWORDS || []).filter(p => (p.label && p.label.toLowerCase().includes(cleanQ)) || (p.query && p.query.toLowerCase().includes(cleanQ)));

    // Check matching phases
    const matchedPhases = (MASTER_18_PHASES || []).filter(p => (p.title && p.title.toLowerCase().includes(cleanQ)) || (p.id && p.id.includes(cleanQ)));

    // Check matching categories - Flatten categoriesAlphabetical safely
    const allCategoriesList = Object.values(categoriesAlphabetical || {}).flat();
    const matchedCats = allCategoriesList.filter(c => c && c.name && c.name.toLowerCase().includes(cleanQ)).slice(0, 4);

    return { pills: matchedPills, phases: matchedPhases, categories: matchedCats };
  }, [searchTerm]);

  // Scroll listener for back to top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans select-none text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white space-y-8">

      {/* =========================================================================
          1. BLOCK 1: GLOBAL SEARCH BOX & HERO BANNER
         ========================================================================= */}
      <section className="relative overflow-visible bg-gradient-to-b from-[#F0F6FF] via-[#F8FAFC] to-[#F8FAFC] border-b border-slate-200/80 pt-6 pb-12 sm:pb-16 lg:pb-20">

        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-blue-400/10 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 left-10 w-[400px] h-[300px] bg-gradient-to-tr from-indigo-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl mx-auto text-center space-y-4">

            {/* Breadcrumb */}
            <nav className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap py-0.5 max-w-full">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">
                {lang === 'en' ? 'Verified Suppliers Directory' : 'Danh bạ Nhà cung cấp Xác thực'}
              </span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-[#0047a5] text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'B2B INDUSTRIAL VERIFIED DATA EXCHANGE' : 'SÀN DỮ LIỆU NHÀ CUNG CẤP & CHẾ TẠO B2B XÁC THỰC'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-tight">
                Danh Bạ Nhà Cung Cấp Xác Thực
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                Hệ sinh thái hơn <strong className="text-slate-950 font-bold">24.000+ nhà máy, cơ sở chế tạo & gia công phụ trợ</strong> kết nối trực tiếp với 18 Pha kỹ thuật trong chuỗi cung ứng công nghiệp.
              </p>
            </div>

            {/* ClickUp Style Search Bar with Revolving Rainbow Conic Border (Exact Image 1 Style) */}
            <div className="pt-2 relative max-w-4xl mx-auto group">
              <div className="clickup-search-border shadow-lg shadow-blue-950/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm && searchTerm.trim()) {
                      navigate(`/tu-khoa/${slugify(searchTerm)}?q=${encodeURIComponent(searchTerm)}`);
                    }
                    setSearchFocused(false);
                  }}
                  className="relative z-10 bg-white p-1 sm:p-1.5 rounded-[24px] flex flex-col sm:flex-row items-stretch gap-1.5 sm:gap-2"
                >
                  {/* Category Selector Dropdown */}
                  <div className="relative sm:w-52 flex-shrink-0">
                    <select
                      value={selectedCategory}
                      onChange={(e) => updateFilterUrl({ category: e.target.value })}
                      className="w-full h-10 sm:h-12 px-3.5 sm:px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer pr-9 font-sans transition"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="Cơ khí & Chế tạo">Cơ khí & Chế tạo</option>
                      <option value="Điện tử & Bán dẫn">Điện tử & Bán dẫn</option>
                      <option value="Xây dựng & Nhà xưởng">Xây dựng & Nhà xưởng</option>
                      <option value="Cơ điện & MEP">Cơ điện & MEP</option>
                      <option value="Phòng sạch & Vật tư">Phòng sạch & Vật tư</option>
                      <option value="Bao bì & In ấn">Bao bì & In ấn</option>
                      <option value="Logistics & Vận tải">Logistics & Vận tải</option>
                      <option value="Đồng phục & PPE">Đồng phục & PPE</option>
                      <option value="Nhân sự & Lao động">Nhân sự & Lao động</option>
                      <option value="Tự động hóa & ESG">Tự động hóa & ESG</option>
                    </select>
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Search Keyword Input */}
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onFocus={() => setSearchFocused(true)}
                      onChange={(e) => updateFilterUrl({ q: e.target.value })}
                      placeholder={lang === 'en' ? "Search suppliers, materials, equipment, industrial parks..." : "Tìm nhà cung cấp, vật tư, thiết bị, KCN..."}
                      className="w-full h-10 sm:h-12 pl-10 sm:pl-11 pr-8 bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => updateFilterUrl({ q: '' })}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 mr-2 cursor-pointer"
                        title="Xóa tìm kiếm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    className="h-10 sm:h-12 px-6 sm:px-9 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition flex items-center justify-center space-x-2 whitespace-nowrap font-heading uppercase tracking-wide cursor-pointer flex-shrink-0"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>TÌM KIẾM</span>
                  </button>
                </form>
              </div>

              {/* Elastic Instant Autocomplete Dropdown */}
              {searchFocused && searchTerm.trim().length >= 2 && instantSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-40 text-left space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {/* Matched Trending Pills */}
                  {instantSuggestions.pills?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Gợi ý từ khóa Hot</span>
                      <div className="flex flex-wrap gap-1.5">
                        {instantSuggestions.pills.map((pill, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(`/tu-khoa/${slugify(pill.label || pill.query)}?q=${encodeURIComponent(pill.query || pill.label)}`);
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0052cc] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>{pill.label}</span>
                            <span className="text-[10px] px-1 bg-blue-200/60 rounded text-blue-800">{pill.tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Categories */}
                  {instantSuggestions.categories?.length > 0 && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ngành hàng khớp nối</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {instantSuggestions.categories.map((cat, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(`/nganh-nghe/${slugify(cat.name)}?name=${encodeURIComponent(cat.name)}`);
                              setSearchFocused(false);
                            }}
                            className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0052cc] rounded-xl text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer"
                          >
                            <span className="truncate">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">{cat.count || 10}+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Phases */}
                  {instantSuggestions.phases?.length > 0 && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Pha kỹ thuật 18 Chuỗi Cung Ứng</span>
                      <div className="flex flex-wrap gap-1.5">
                        {instantSuggestions.phases.map((ph, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              updateFilterUrl({ phase: ph.id, stage: String(ph.stage), q: '' });
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Pha {ph.id}: {ph.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Sourcing Marquee Tags (3 Full-Width Horizontal Rows Scrolling Edge-to-Edge with Left/Right Fade Masks) */}
        <div className="w-full mt-6 relative overflow-hidden space-y-2.5">
          {/* Subtle Left & Right Edge Blur Fade Overlay */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#F0F6FF] via-[#F0F6FF]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent z-20" />

          {/* Track 1: GĐ 1 & 2 (Pháp lý, Quy hoạch, Xây dựng, Cơ điện) - Scrolling Left */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-left flex items-center space-x-2.5">
              {[
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(0, 13),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(0, 13),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(0, 13)
              ].map((kw, i) => {
                return (
                  <button
                    key={`row1-${i}`}
                    type="button"
                    onClick={() => navigate(`/tu-khoa/${slugify(kw.label || kw.query)}?q=${encodeURIComponent(kw.query || kw.label)}`)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs whitespace-nowrap hover:scale-105 cursor-pointer flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-blue-600 border border-slate-200/90 hover:border-blue-600 text-slate-700 hover:text-white"
                    title={`Xem chi tiết từ khóa "${kw.label}" (Pha ${kw.phase})`}
                  >
                    <span>{kw.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono bg-slate-100 text-slate-500">
                      {kw.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Track 2: GĐ 3 & 4 (Lắp đặt máy, Phòng sạch, CNC, Vật liệu, Kho bãi) - Scrolling Right */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-right flex items-center space-x-2.5">
              {[
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(13, 26),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(13, 26),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(13, 26)
              ].map((kw, i) => {
                return (
                  <button
                    key={`row2-${i}`}
                    type="button"
                    onClick={() => navigate(`/tu-khoa/${slugify(kw.label || kw.query)}?q=${encodeURIComponent(kw.query || kw.label)}`)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs whitespace-nowrap hover:scale-105 cursor-pointer flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-blue-600 border border-slate-200/90 hover:border-blue-600 text-slate-700 hover:text-white"
                    title={`Xem chi tiết từ khóa "${kw.label}" (Pha ${kw.phase})`}
                  >
                    <span>{kw.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono bg-slate-100 text-slate-500">
                      {kw.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Track 3: GĐ 5 & 6 (Nhân sự, Suất ăn, Đồng phục, ISO, Robot AGV, Năng lượng) - Scrolling Left Slow */}
          <div className="flex overflow-hidden py-0.5">
            <div className="animate-marquee-left-slow flex items-center space-x-2.5">
              {[
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(26),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(26),
                ...HIGHLIGHT_PHASE_KEYWORDS.slice(26)
              ].map((kw, i) => {
                return (
                  <button
                    key={`row3-${i}`}
                    type="button"
                    onClick={() => navigate(`/tu-khoa/${slugify(kw.label || kw.query)}?q=${encodeURIComponent(kw.query || kw.label)}`)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs whitespace-nowrap hover:scale-105 cursor-pointer flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-blue-600 border border-slate-200/90 hover:border-blue-600 text-slate-700 hover:text-white"
                    title={`Xem chi tiết từ khóa "${kw.label}" (Pha ${kw.phase})`}
                  >
                    <span>{kw.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono bg-slate-100 text-slate-500">
                      {kw.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BLOCK 4: TOP TRENDING SPOTLIGHT (BẢNG XẾP HẠNG NGÁCH)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black">
                ⭐
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading">
                  Top Trending Spotlight • Bảng Xếp Hạng Ngách
                </h3>
                <p className="text-xs text-slate-500">
                  Các nhóm ngành có nhu cầu chào thầu & tìm kiếm năng lực sản xuất cao nhất hiện nay.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-slate-400 self-start sm:self-auto">
              Real-time Market Demands
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SPOTLIGHT_TOPICS.map((topic) => {
              const isActive = searchTerm.toLowerCase() === topic.query.toLowerCase();
              return (
                <div
                  key={topic.id}
                  onClick={() => updateFilterUrl({ q: isActive ? '' : topic.query, category: 'all' })}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 group ${isActive
                      ? 'border-[#0052cc] bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md'
                      : `border-slate-200/90 bg-slate-50/60 hover:bg-white hover:shadow-md ${topic.border}`
                    }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono shadow-2xs">
                        {topic.badge}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping" />
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0052cc] transition font-heading">
                      {topic.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {topic.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-bold text-[#0052cc]">
                    <span>{isActive ? 'Đang lọc chủ đề này' : 'Khám phá ngay'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TOP NAVIGATION BLOCK (18 Phases Tabs / 6 Stages / A-Z Alphabet Directory)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SupplierTopNavigationBlocks
          selectedStage={selectedStage}
          selectedPhase={selectedPhase}
          selectedCategory={selectedCategory}
          selectedKeyword={searchTerm}
          selectedLetter={selectedLetter}
          onSelectLetter={(letterVal) => {
            setSelectedLetter(letterVal);
            updateFilterUrl({ letter: letterVal === 'TẤT CẢ' ? '' : letterVal });
          }}
          onSelectStage={(stageId) => {
            if (selectedStage === stageId && selectedPhase === 'all') {
              updateFilterUrl({ stage: 'all', phase: 'all', category: 'all', q: '' });
            } else {
              updateFilterUrl({ stage: stageId, phase: 'all', category: 'all', q: '' });
            }
          }}
          onSelectPhase={(phaseId, stageId) => {
            if (phaseId === 'all') {
              updateFilterUrl({ phase: 'all', stage: 'all', category: 'all', q: '' });
            } else if (selectedPhase === phaseId) {
              updateFilterUrl({ phase: 'all', stage: 'all', category: 'all', q: '' });
            } else {
              updateFilterUrl({ phase: phaseId, stage: stageId, category: 'all', q: '' });
            }
          }}
          onSelectCategory={(catName) => updateFilterUrl({ category: catName })}
          onSelectKeyword={(kw) => updateFilterUrl({ q: kw })}
        />
      </div>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT (2 COLUMNS: STICKY LEFT SIDEBAR + RIGHT SUPPLIER GRID)
         ========================================================================= */}
      <div id="danh-sach-nha-cung-ung" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* =======================================================================
              BLOCK 2: SMART FILTER PANEL (STICKY LEFT SIDEBAR)
             ======================================================================= */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-5">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#0052cc]" />
                  <h3 className="text-sm font-black text-slate-900 uppercase font-heading tracking-wider">
                    Bộ Lọc Thông Minh
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setSelectedLetter('TẤT CẢ');
                    setFilterApiReady(false);
                    setFilterFastQuote(false);
                    setFilterIsoCertified(false);
                    updateFilterUrl({ q: '', phase: 'all', stage: 'all', category: 'all', province: 'Toàn quốc', kyc: 'all' });
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                  title="Đặt lại tất cả bộ lọc"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              </div>

              {/* 1. KYC LEVELS FILTER */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Cấp Độ Xác Thực KYC</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </label>

                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'Tất cả cấp độ', icon: '🌐', count: enterprisesFullList.length },
                    { id: 'diamond', label: 'Kim Cương (Hiệp hội/BNI)', icon: '💎', color: 'text-sky-700 bg-sky-50 border-sky-200' },
                    { id: 'gold', label: 'Vàng (Nhà xưởng/Thực địa)', icon: '🥇', color: 'text-amber-800 bg-amber-50 border-amber-200' },
                    { id: 'silver', label: 'Bạc (Pháp nhân & MST)', icon: '🥈', color: 'text-slate-700 bg-slate-100 border-slate-200' },
                  ].map((kycOption) => {
                    const isSelected = selectedKyc === kycOption.id;
                    return (
                      <button
                        key={kycOption.id}
                        onClick={() => updateFilterUrl({ kyc: kycOption.id })}
                        className={`w-full p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${isSelected
                            ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{kycOption.icon}</span>
                          <span className="text-[11px]">{kycOption.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TECH INFRASTRUCTURE & STANDARDS TOGGLES */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Hạ Tầng & Tiêu Chuẩn</span>
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                </label>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">Sẵn sàng kết nối API / ERP</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filterApiReady}
                      onChange={(e) => setFilterApiReady(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">Báo giá nhanh 24h</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filterFastQuote}
                      onChange={(e) => setFilterFastQuote(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">Chứng nhận ISO / ESG</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filterIsoCertified}
                      onChange={(e) => setFilterIsoCertified(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* 3. PROVINCES & GEOGRAPHY FILTER */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Khu Vực Địa Lý</span>
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                </label>

                {/* Quick Province Chips */}
                <div className="flex flex-wrap gap-1">
                  {QUICK_PROVINCE_CHIPS.map((prov) => {
                    const isSelected = selectedProvince === prov;
                    return (
                      <button
                        key={prov}
                        onClick={() => updateFilterUrl({ province: prov })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${isSelected
                            ? 'bg-[#0052cc] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        {prov === 'Toàn quốc' ? '📍 Tất cả' : prov}
                      </button>
                    );
                  })}
                </div>

                {/* Full 63 Provinces Dropdown */}
                <select
                  value={selectedProvince}
                  onChange={(e) => updateFilterUrl({ province: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 cursor-pointer outline-none"
                >
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov === "Toàn quốc" ? "📍 Toàn quốc (34 Tỉnh thành)" : `📍 ${prov}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. ACTIVE 18 PHASES COORDINATE SHORTCUTS */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Pha Kỹ Thuật (18 Pha)</span>
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                </label>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  <button
                    onClick={() => updateFilterUrl({ phase: 'all', stage: 'all' })}
                    className={`w-full p-2 rounded-lg text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${selectedPhase === 'all'
                        ? 'bg-blue-50 text-[#0052cc] font-black'
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span>Toàn bộ 18 Pha</span>
                    {selectedPhase === 'all' && <Check className="w-3 h-3 text-[#0052cc]" />}
                  </button>

                  {MASTER_18_PHASES.map((p) => {
                    const isSelected = selectedPhase === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => updateFilterUrl({ phase: isSelected ? 'all' : p.id, stage: String(p.stage) })}
                        className={`w-full p-2 rounded-lg text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer ${isSelected
                            ? 'bg-emerald-50 text-emerald-800 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        <span className="truncate">Pha {p.id}: {p.title.split(' ')[1]}</span>
                        {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* =======================================================================
              BLOCK 3: VERIFIED SUPPLIER GRID (B2B DATA EXCHANGE CARDS)
             ======================================================================= */}
          <main className="lg:col-span-9 space-y-5">

            {/* Results Header & Sort Info */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading">
                  {lang === 'en' ? 'Verified Industrial Suppliers' : 'Danh Sách Nhà Cung Cấp & Cơ Sở Chế Tạo B2B'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-xs font-mono font-bold">
                  {totalCount.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} {lang === 'en' ? 'suppliers' : 'doanh nghiệp'}
                </span>
              </div>

              {/* Right: View Mode Toggle & Active Filter Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* View Mode: Grid vs List */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#0052cc] shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Chế độ xem dạng ô (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#0052cc] shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Chế độ xem dạng hàng (List)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Filter Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  {selectedPhase !== 'all' && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 font-bold shrink-0">
                      Pha {selectedPhase}
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-bold shrink-0">
                      Ngành: {selectedCategory}
                    </span>
                  )}
                  {selectedKyc !== 'all' && (
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md border border-sky-200 font-bold shrink-0">
                      KYC: {selectedKyc.toUpperCase()}
                    </span>
                  )}
                  {selectedProvince !== 'Toàn quốc' && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 font-bold shrink-0">
                      📍 {selectedProvince}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Supplier Cards (Grid or List View Mode) */}
            {displayedEnterprises.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                  🔍
                </div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  {lang === 'en' ? 'No matching suppliers found' : 'Không tìm thấy nhà cung ứng phù hợp'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Vui lòng thử tìm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn bộ danh bạ hơn 24.000 nhà cung ứng.
                </p>
                <button
                  onClick={() => {
                    setSelectedLetter('TẤT CẢ');
                    setFilterApiReady(false);
                    setFilterFastQuote(false);
                    setFilterIsoCertified(false);
                    updateFilterUrl({ q: '', phase: 'all', stage: 'all', category: 'all', province: 'Toàn quốc', kyc: 'all' });
                  }}
                  className="px-6 py-2.5 bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-[#0041a8] cursor-pointer"
                >
                  Xem toàn bộ 24.000+ nhà cung ứng
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
                {displayedEnterprises.map((ent) => {
                  const entId = ent.id || ent._id || ent.taxCode || ent.name;
                  const totalVotes = getEnterpriseBaseVotes(ent) + (votes[String(entId)] || 0);
                  const userAction = userVoteActions[String(entId)] || 0;
                  const detailUrl = `/doanh-nghiep/${ent.id || ent._id}`;
                  const kyc = getEnterpriseKYCLevel(ent);
                  const thumbnails = getEnterpriseThumbnails(ent);
                  const rawPhone = getEnterprisePhone(ent);
                  const maskedPhone = maskPhoneNumber(rawPhone);
                  const phaseId = (ent.phases && ent.phases[0]) || '4.1';
                  const provinceStr = ent.province && ent.province !== 'Toàn quốc' ? ent.province : '';
                  const hasProvinceInName = provinceStr && ent.name.toLowerCase().includes(provinceStr.toLowerCase());
                  const displayName = provinceStr && !hasProvinceInName ? `${ent.name} (${provinceStr})` : ent.name;

                  const entKeywords = Array.from(new Set([
                    ...(Array.isArray(ent.products) ? ent.products : []),
                    ...(Array.isArray(ent.productGroups) ? ent.productGroups.flatMap(g => g.items || []) : []),
                    ...(Array.isArray(ent.keywords) ? ent.keywords : []),
                    ent.category,
                    ent.industry
                  ].filter(Boolean))).slice(0, 3);

                  const websiteUrl = ent.website 
                    ? (ent.website.startsWith('http') ? ent.website : `https://${ent.website}`) 
                    : (ent.sourceUrl || ent.url || `https://www.google.com/search?q=${encodeURIComponent(ent.name + ' ' + (ent.province || ''))}`);

                  // Render single enterprise card
                  return (
                    <div
                      key={entId}
                      className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-[#0052cc]/50 hover:-translate-y-0.5 transition-all duration-300 flex ${
                        viewMode === 'list' 
                          ? 'flex-col lg:flex-row lg:items-center justify-between gap-6' 
                          : 'flex-col justify-between space-y-4'
                      } group relative`}
                    >
                      {/* Left / Top Header: Logo on Left + Company Name next to Logo */}
                      <div className={viewMode === 'list' ? "flex-1 space-y-3" : "space-y-3"}>
                        
                        {/* Row 1: Logo & Company Name side-by-side */}
                        <div className="flex items-start gap-3">
                          {/* Avatar / Logo */}
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center group-hover:border-[#0052cc]/50 transition-colors">
                            <img
                              src={getEnterpriseAvatarImage(ent)}
                              alt={ent.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                const fallbackUrl = getCategoryBannerImage(ent.category || ent.industry || ent.name);
                                if (e.target.src !== fallbackUrl) {
                                  e.target.src = fallbackUrl;
                                }
                              }}
                            />
                          </div>

                          {/* Company Name + Category */}
                          <div className="min-w-0 flex-1">
                            <Link
                              to={detailUrl}
                              className="font-black text-xs sm:text-[13px] text-slate-950 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-snug block"
                              title={displayName}
                            >
                              <span>{ent.name}</span>
                              {provinceStr && !hasProvinceInName && (
                                <span className="text-slate-600 font-bold ml-1">
                                  ({provinceStr})
                                </span>
                              )}
                            </Link>

                            <div className="text-[11px] text-slate-500 truncate mt-0.5" title={ent.category || ent.industry}>
                              {ent.category || ent.industry || "Chế tạo & Cung ứng"}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Phase Badge & KYC Level moved down, with Vote button on the same line */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                          {/* Phase & KYC Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              to={`/giai-doan-cung-ung/pha/${phaseId}`}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-xl font-mono border border-emerald-200 shadow-2xs transition-colors flex items-center gap-1"
                              title={`Xem chi tiết Pha ${phaseId}`}
                            >
                              <span>Pha {phaseId}</span>
                            </Link>

                            <div
                              className={`px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1 shrink-0 ${kyc.badgeBg} ${kyc.glow}`}
                              title={kyc.tag}
                            >
                              <span>{kyc.icon}</span>
                              <span>{kyc.label}</span>
                            </div>
                          </div>

                          {/* Prominent Vote Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(ent, userAction === 1 ? -1 : 1);
                            }}
                            className={`px-2.5 py-1 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                              userAction === 1
                                ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/40 scale-105'
                                : 'bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-200'
                            }`}
                            title={userAction === 1 ? "Bỏ bình chọn (+1)" : "Bình chọn tín nhiệm (+1)"}
                          >
                            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{totalVotes}</span>
                          </button>
                        </div>

                        {/* SHOWCASE PRODUCT THUMBNAILS & KEYWORDS */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Từ khóa nhà cung cấp nổi bật
                            </span>
                          </div>

                          {/* Actual Supplier Keywords Pills */}
                          {entKeywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entKeywords.map((kw, kIdx) => (
                                <Link
                                  key={kIdx}
                                  to={`/tu-khoa/${slugify(kw)}?q=${encodeURIComponent(kw)}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10.5px] font-medium transition max-w-full truncate"
                                  title={`Tìm kiếm từ khóa: ${kw}`}
                                >
                                  <Tag className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                  <span className="truncate">{kw}</span>
                                </Link>
                              ))}
                            </div>
                          )}

                          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                            {thumbnails.map((imgUrl, tIdx) => (
                              <div
                                key={tIdx}
                                className="h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 relative group/thumb cursor-pointer"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Product showcase ${tIdx + 1}`}
                                  className="w-full h-full object-cover group-hover/thumb:scale-125 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover/thumb:bg-transparent transition-colors" />
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono text-center">
                            3 Hình ảnh sản phẩm / Năng lực thực tế
                          </p>
                        </div>

                      </div>

                      {/* Bottom / Right Section: Masked Phone & Quick Contact Icons (Zalo, WhatsApp, Email, Web) + CTAs */}
                      <div className={`pt-3 border-t border-slate-100 space-y-2.5 ${viewMode === 'list' ? 'lg:border-t-0 lg:border-l lg:pl-6 lg:w-72 lg:pt-0 shrink-0' : ''}`}>

                        {/* Masked Phone with direct Contact Icons */}
                        <div className="flex items-center justify-between bg-slate-50/90 rounded-xl py-1.5 px-3 border border-slate-200/80">
                          <div className="flex items-center space-x-1.5 text-xs min-w-0">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-mono font-bold text-slate-800 text-[11px] tracking-wide truncate">
                              {maskedPhone}
                            </span>
                          </div>

                          {/* Quick Contact Icons (Zalo, WhatsApp, Email, Web) */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Zalo Icon */}
                            <a
                              href={`https://zalo.me/${rawPhone ? rawPhone.replace(/\D/g, '') : '0582877799'}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded-lg bg-blue-50 hover:bg-blue-100 p-0.5 border border-blue-200/60 shadow-2xs transition flex items-center justify-center overflow-hidden"
                              title="Nhắn tin Zalo"
                            >
                              <img src="/images/icons/zalo-icon.png" alt="Zalo" className="w-full h-full object-contain rounded-xs" />
                            </a>
                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/84${rawPhone ? rawPhone.replace(/\D/g, '').replace(/^0/, '') : '912345678'}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-2xs transition"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            {/* Email */}
                            <a
                              href={`mailto:${ent.email || 'hotro@chuoicungung.com'}`}
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-[10px] shadow-2xs transition"
                              title="Gửi Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            {/* Website */}
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 rounded-lg bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-[10px] shadow-2xs transition"
                              title={ent.website ? `Truy cập Website: ${ent.website}` : `Tra cứu thông tin ${ent.name}`}
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Dual Action CTAs: Request Quote + Details */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setQuoteModalSupplier(ent)}
                            className="w-full py-2 px-2 bg-gradient-to-r from-[#0047a5] to-[#0052cc] hover:from-[#003d8f] hover:to-[#0047a5] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1 font-heading cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Báo giá</span>
                          </button>

                          <Link
                            to={detailUrl}
                            className="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 font-heading"
                          >
                            <span>Chi tiết</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  {lang === 'en'
                    ? `Showing page ${currentPage} of ${totalPages} (${totalCount.toLocaleString('en-US')} suppliers)`
                    : `Hiển thị trang ${currentPage} / ${totalPages} (Tổng ${totalCount.toLocaleString('vi-VN')} nhà cung ứng)`}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      scrollToTop();
                    }}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Prev' : 'Trước'}</span>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pNum = currentPage;
                    if (currentPage <= 3) pNum = i + 1;
                    else if (currentPage >= totalPages - 2) pNum = totalPages - 4 + i;
                    else pNum = currentPage - 2 + i;

                    if (pNum < 1 || pNum > totalPages) return null;

                    return (
                      <button
                        key={pNum}
                        onClick={() => {
                          setCurrentPage(pNum);
                          scrollToTop();
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border cursor-pointer ${currentPage === pNum
                            ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      scrollToTop();
                    }}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'Next' : 'Sau'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* =========================================================================
          BLOCK 5: BOTTOM LEAD CAPTURE DOCKED FLOATING BANNER (NÚT BẮT LEAD SME)
         ========================================================================= */}
      {isBottomBannerVisible && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:max-w-xl z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-[#072348] via-[#0052cc] to-[#0284c7] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 flex items-center justify-between gap-4 backdrop-blur-md">

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold text-sky-200 uppercase tracking-wider font-mono">
                  Dành riêng cho Doanh Nghiệp & Nhà Máy SME
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                Đối thủ của bạn đang nhận Lead từ khối FDI mỗi ngày.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsRegistrationModalOpen(true)}
                className="px-4 py-2.5 bg-white hover:bg-amber-50 text-[#0052cc] font-black text-xs rounded-xl shadow-lg shadow-black/10 transition transform hover:scale-105 font-heading cursor-pointer whitespace-nowrap"
              >
                Đăng Ký Hồ Sơ Ngay
              </button>

              <button
                onClick={() => setIsBottomBannerVisible(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODALS
         ========================================================================= */}
      <SupplierRequestQuoteModal
        supplier={quoteModalSupplier}
        isOpen={Boolean(quoteModalSupplier)}
        onClose={() => setQuoteModalSupplier(null)}
      />

      <SupplierRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-40 p-3 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
