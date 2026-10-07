import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Building2, CheckCircle2,
  ChevronRight, ArrowRight, RotateCcw, ShieldCheck, Award, Layers,
  Phone, Globe, Mail, ExternalLink, Factory, Cpu, Wrench, Truck,
  Leaf, Sparkles, Check, ChevronDown, Flame, Zap, Clock, Tag,
  ChevronLeft, ArrowUp, Plus, LayoutGrid, List, ArrowUpCircle, ArrowDownCircle,
  Compass, HardHat, PackageCheck, Boxes, MessageCircle, FileSearch, HelpCircle,
  Users, RefreshCw, BarChart3, Settings, Eye, PhoneCall, Send, Star, X, Bot
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import categoriesAlphabetical from '../data/categoriesAlphabetical.json';
import phaseTaxonomyAlphabetical from '../data/phaseTaxonomyAlphabetical.json';
import enterprisesFullList from '../data/enterprisesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';
import {
  getCompanyMonogram,
  getMonogramGradient,
  isValidCustomLogo,
  getEnterpriseAvatarImage,
  getCategoryBannerImage,
  getEnterpriseKYCLevel,
  getEnterpriseThumbnails
} from '../utils/companyUtils';
import SupplierTopNavigationBlocks from '../components/SupplierTopNavigationBlocks';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';
import SupplierRegistrationModal from '../components/suppliers/SupplierRegistrationModal';
import SupplierDirectoryCard from '../components/suppliers/SupplierDirectoryCard';
import SupplierDirectoryFilters from '../components/suppliers/SupplierDirectoryFilters';
import { getSupplierMaskedPhone } from '../components/suppliers/supplierDirectoryModel';
import '../components/suppliers/SupplierDirectory.css';

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

  // Dynamic SEO Resolver & Self-Canonical (Section 1 Spec)
  useEffect(() => {
    // 1. Title
    document.title = "Danh bạ nhà cung ứng | CHUOICUNGUNG.COM";

    // 2. Canonical
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', 'https://chuoicungung.com/nha-cung-ung');

    // 3. Meta Description based on real verified directory data
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Danh bạ hơn 21.680+ nhà cung ứng, xưởng gia công, nhà máy phụ trợ B2B tại Việt Nam. Tìm kiếm và kết nối trực tiếp theo năng lực thực tế, vùng phục vụ, MOQ và hồ sơ năng lực xác minh.";

    // 4. Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = "Danh bạ nhà cung ứng | CHUOICUNGUNG.COM";

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = "Danh bạ hơn 21.680+ nhà cung ứng, xưởng gia công, nhà máy phụ trợ B2B tại Việt Nam. Kết nối trực tiếp bên mua và nhà cung cấp.";

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = "https://chuoicungung.com/nha-cung-ung";
  }, []);

  // Read URL query params
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const searchTerm = queryParams.get('q') || '';
  const selectedPhase = queryParams.get('phase') || 'all';
  const selectedStage = queryParams.get('stage') || 'all';
  const selectedProvince = queryParams.get('province') || 'Toàn quốc';
  const selectedCategory = queryParams.get('category') || 'all';
  const selectedKyc = queryParams.get('kyc') || 'all';
  const requirementId = queryParams.get('requirement') || queryParams.get('need') || queryParams.get('draft') || '';

  const [activeRequirement, setActiveRequirement] = useState(null);
  const [addedSupplierIds, setAddedSupplierIds] = useState([]);

  // Load Requirement Context if requirementId is present in URL (Section 5 Spec - Mode 2)
  useEffect(() => {
    if (!requirementId) {
      setActiveRequirement(null);
      return;
    }
    try {
      const savedById = localStorage.getItem('ccu_draft_' + requirementId);
      if (savedById) {
        setActiveRequirement(JSON.parse(savedById));
        return;
      }
      const latestDraft = localStorage.getItem('ccu_requirement_draft');
      if (latestDraft) {
        const parsed = JSON.parse(latestDraft);
        if (parsed.id === requirementId || requirementId === 'latest') {
          setActiveRequirement(parsed);
          return;
        }
      }
      const listStr = localStorage.getItem('ccu_user_demands');
      if (listStr) {
        const list = JSON.parse(listStr);
        const found = list.find(d => String(d.id) === String(requirementId));
        if (found) {
          setActiveRequirement(found);
          return;
        }
      }
      setActiveRequirement({
        id: requirementId,
        title: 'Nhu cầu đang tìm nguồn (' + requirementId + ')',
        quantity: '500',
        unit: 'bộ / đơn vị',
        location: 'KCN Amata, Đồng Nai',
        deadline: 'Tháng sau'
      });
    } catch (e) {
      console.warn('Error loading requirement context:', e);
    }
  }, [requirementId]);

  const handleAddSupplierToRequirement = (ent) => {
    const entId = ent.id || ent._id || ent.taxCode || ent.name;
    setAddedSupplierIds(prev => [...prev, entId]);
    try {
      if (requirementId) {
        const key = 'ccu_draft_' + requirementId;
        const currentData = localStorage.getItem(key);
        let draftObj = currentData ? JSON.parse(currentData) : (activeRequirement || {});
        draftObj.suppliers = draftObj.suppliers || [];
        if (!draftObj.suppliers.find(s => s.id === entId || s.name === ent.name)) {
          draftObj.suppliers.push({
            id: entId,
            name: ent.name,
            address: ent.province || ent.address || 'Việt Nam',
            distance: 'Đã thêm từ Sàn',
            matchRate: 95,
            status: 'CONSIDERING',
            notes: 'Mời từ Sàn Tìm Nhà Cung Ứng Theo Năng Lực'
          });
          localStorage.setItem(key, JSON.stringify(draftObj));
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

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

  const resetDirectoryFilters = () => {
    setSelectedLetter('TẤT CẢ');
    setFilterApiReady(false);
    setFilterFastQuote(false);
    setFilterIsoCertified(false);
    updateFilterUrl({ q: '', phase: 'all', stage: 'all', category: 'all', province: 'Toàn quốc', kyc: 'all', letter: 'TẤT CẢ' });
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
    <main className="sd-directory min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white space-y-8">

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
            <nav aria-label="Breadcrumb" className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap py-0.5 max-w-full">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
                <span className="ml-1.5 text-slate-600 hover:text-[#0052cc]">Trang chủ</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">
                {lang === 'en' ? 'Verified Suppliers Directory' : 'Danh bạ nhà cung ứng'}
              </span>
            </nav>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-tight">
                {lang === 'en' ? 'Find Suppliers on Demand' : 'Tìm nhà cung ứng theo nhu cầu'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                Khám phá và kết nối trực tiếp với nhà cung ứng theo <strong className="text-slate-950 font-bold">năng lực thật, vùng phục vụ, MOQ và thời gian giao hàng</strong> — không thổi phồng, có căn cứ xác minh.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                to="/dang-nhu-cau"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Mô tả nhu cầu</span>
              </Link>
              <a
                href="#supplier-results-list"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 transition cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Xem hồ sơ</span>
              </a>
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
                    <label htmlFor="supplier-category-select" className="sr-only">Chọn ngành hàng nhà cung ứng</label>
                    <select
                      id="supplier-category-select"
                      name="category"
                      aria-label="Chọn ngành hàng nhà cung ứng"
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
                    <label htmlFor="supplier-search-input" className="sr-only">Tìm nhà cung cấp, vật tư, thiết bị, KCN</label>
                    <input
                      ref={searchInputRef}
                      id="supplier-search-input"
                      name="search"
                      aria-label="Tìm nhà cung cấp, vật tư, thiết bị, KCN"
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
      <div id="danh-sach-nha-cung-ung" className="sd-workspace max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* =======================================================================
              BLOCK 2: SMART FILTER PANEL (STICKY LEFT SIDEBAR)
             ======================================================================= */}
          <aside className="sd-sidebar">
            <SupplierDirectoryFilters
              selectedKyc={selectedKyc}
              selectedProvince={selectedProvince}
              selectedPhase={selectedPhase}
              selectedStage={selectedStage}
              phases={MASTER_18_PHASES}
              provinces={PROVINCES}
              quickProvinces={QUICK_PROVINCE_CHIPS}
              filters={{ api: filterApiReady, fast: filterFastQuote, iso: filterIsoCertified }}
              activeCount={Number(selectedKyc !== 'all') + Number(selectedProvince !== 'Toàn quốc') + Number(selectedPhase !== 'all' || selectedStage !== 'all') + Number(filterApiReady) + Number(filterFastQuote) + Number(filterIsoCertified)}
              onChange={updateFilterUrl}
              onToggle={(key, value) => ({ api: setFilterApiReady, fast: setFilterFastQuote, iso: setFilterIsoCertified })[key](value)}
              onReset={resetDirectoryFilters}
            />

            {/* In-flow Lead Capture Card inside Sidebar (Không che bộ lọc, không đè mascot) */}
            <div className="sd-register-note">
              <details>
              <summary>Hồ sơ doanh nghiệp</summary>
              <h3>Giới thiệu năng lực doanh nghiệp.</h3>
              <p>Bổ sung ngành nghề, pha cung ứng và hình ảnh trong hồ sơ của bạn.</p>
              </details>
              <button
                type="button"
                onClick={() => setIsRegistrationModalOpen(true)}
                className="sd-button sd-button-primary"
              >
                Đăng ký hồ sơ
              </button>
            </div>

          </aside>

          {/* =======================================================================
              BLOCK 3: VERIFIED SUPPLIER GRID (B2B DATA EXCHANGE CARDS)
             ======================================================================= */}
          <section id="supplier-results-list" className="lg:col-span-9 space-y-5">

            {/* Results Header & Sort Info */}
            <div className="sd-results-heading">
              <div className="sd-results-intro">
                <p>{lang === 'en' ? 'Industrial capability directory' : 'Danh mục năng lực doanh nghiệp'}</p>
                <h3>
                  {lang === 'en' ? 'Find your next supplier.' : 'Tìm đối tác cho nhu cầu thực tế.'}
                </h3>
                <span aria-live="polite" aria-atomic="true" className="sd-results-count">
                  {totalCount.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} {lang === 'en' ? 'suppliers' : 'doanh nghiệp'}
                </span>
              </div>

              {/* Right: View Mode Toggle & Active Filter Badges */}
              <div className="sd-results-tools">
                {/* View Mode: Grid vs List */}
                <div className="sd-view-toggle" role="group" aria-label={lang === 'en' ? 'Result layout' : 'Cách hiển thị kết quả'}>
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-pressed={viewMode === 'grid'}
                    aria-label="Chế độ xem dạng ô"
                    title="Chế độ xem dạng ô (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-pressed={viewMode === 'list'}
                    aria-label="Chế độ xem dạng hàng"
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

            {/* Mode 2: Requirement Context Banner (Section 5 Spec) */}
            {activeRequirement && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border-2 border-blue-400/40 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-black font-mono tracking-wider border border-blue-400/30">
                        CHẾ ĐỘ TÌM THEO NHU CẦU: #{activeRequirement.id}
                      </span>
                      <span className="text-xs text-blue-200 font-medium">
                        Đang lọc & ưu tiên các nhà cung ứng có năng lực đáp ứng thực tế
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black font-heading text-white">
                      {activeRequirement.title || activeRequirement.productService}
                    </h2>
                    <div className="text-xs text-blue-200/90 flex flex-wrap gap-4 pt-0.5">
                      <span>Quy mô: <strong className="text-white font-bold">{activeRequirement.quantity} {activeRequirement.unit}</strong></span>
                      <span>Địa bàn: <strong className="text-white font-bold">{activeRequirement.kcn || activeRequirement.location || 'Toàn quốc'}</strong></span>
                      <span>Thời gian cần: <strong className="text-white font-bold">{activeRequirement.deadline}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/tai-khoan/nhu-cau/${activeRequirement.id}`}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/30 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Về Workspace Nhu Cầu</span>
                    </Link>
                    <button
                      onClick={() => updateFilterUrl({ requirement: null, need: null, draft: null })}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                      title="Thoát chế độ tìm theo nhu cầu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier Cards (Grid or List View Mode) */}
            {displayedEnterprises.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                  🔍
                </div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  {lang === 'en' ? 'No matching suppliers found' : 'Không tìm thấy nhà cung ứng phù hợp'}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thử từ khoá khác, chọn lại pha hoặc đặt lại bộ lọc để xem toàn bộ danh bạ.
                </p>
                <button
                  onClick={() => {
                    resetDirectoryFilters();
                  }}
                  className="px-6 py-2.5 bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-[#0041a8] cursor-pointer"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="sd-supplier-grid" data-view={viewMode}>
                {displayedEnterprises.map(ent => {
                  const entId = ent.id || ent._id || ent.taxCode || ent.name;
                  const entSlug = ent.slug || slugify(ent.name || '');
                  const detailUrl = `/nha-cung-ung/${entSlug || ent.id || ent._id}${location.search || ''}`;
                  return <SupplierDirectoryCard
                    key={entId}
                    supplier={ent}
                    phases={MASTER_18_PHASES}
                    selectedPhase={selectedPhase}
                    images={getEnterpriseThumbnails(ent)}
                    avatar={getEnterpriseAvatarImage(ent)}
                    maskedPhone={getSupplierMaskedPhone(ent)}
                    detailUrl={detailUrl}
                    viewMode={viewMode}
                    onQuote={setQuoteModalSupplier}
                    requirement={activeRequirement}
                    added={addedSupplierIds.includes(entId)}
                    onAdd={handleAddSupplierToRequirement}
                  />;
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

          </section>

        </div>
      </div>

      {/* =========================================================================
          BLOCK 4: SOURCING HUBS & RELATED DIRECTORIES (BÊN MUA, KCN, HIỆP HỘI)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading">
                Hệ sinh thái kết nối Chuỗi Cung Ứng B2B
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Liên kết nhanh phục vụ trực tiếp Nhà máy / Bên mua, Ban quản lý KCN và Hiệp hội ngành hàng
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold self-start sm:self-auto">
              Dữ liệu thực tế xác minh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1: Dành cho Nhà máy / Bên mua */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-3">
              <div className="flex items-center space-x-2 text-[#0052cc]">
                <Factory className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold font-heading uppercase tracking-wide">Nhà máy & Bên mua</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đăng nhu cầu tìm nguồn cung ứng, mở gói thầu phụ trợ và tra cứu năng lực xưởng sản xuất thực tế.
              </p>
              <ul className="space-y-2 pt-1 text-xs">
                <li>
                  <Link to="/dang-nhu-cau" className="text-[#0052cc] hover:underline font-semibold flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Đăng nhu cầu tìm nguồn cung B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/nha-may" className="text-slate-700 hover:text-[#0052cc] hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Danh bạ Nhà máy & Cơ sở sản xuất</span>
                  </Link>
                </li>
                <li>
                  <Link to="/nhu-cau" className="text-slate-700 hover:text-[#0052cc] hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Nhu cầu mua sắm & chào thầu đang mở</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Box 2: Dành cho KCN & Hạ tầng */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Building2 className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold font-heading uppercase tracking-wide">Khu Công Nghiệp (KCN)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bản đồ quy hoạch 400+ KCN/KKT toàn quốc, quỹ đất công nghiệp và liên kết chuỗi phụ trợ nội khu.
              </p>
              <ul className="space-y-2 pt-1 text-xs">
                <li>
                  <Link to="/kcn" className="text-emerald-700 hover:underline font-semibold flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Bản đồ & Danh bạ 400+ KCN toàn quốc</span>
                  </Link>
                </li>
                <li>
                  <Link to="/kcn?region=mien-bac" className="text-slate-700 hover:text-emerald-700 hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>KCN Vùng kinh tế trọng điểm phía Bắc</span>
                  </Link>
                </li>
                <li>
                  <Link to="/kcn?region=mien-nam" className="text-slate-700 hover:text-emerald-700 hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>KCN Đông Nam Bộ & ĐBSCL</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Box 3: Dành cho Hiệp hội & Tổ chức */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-3">
              <div className="flex items-center space-x-2 text-amber-700">
                <Users className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold font-heading uppercase tracking-wide">Hiệp Hội & Xúc Tiến</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mạng lưới hiệp hội ngành hàng (cơ khí, điện tử, logistics, da giày...) và các ấn bản hồ sơ năng lực.
              </p>
              <ul className="space-y-2 pt-1 text-xs">
                <li>
                  <Link to="/hiep-hoi" className="text-amber-700 hover:underline font-semibold flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Danh bạ Hiệp hội ngành hàng B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/an-ban" className="text-slate-700 hover:text-amber-700 hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Ấn bản Sourcing Dossier & Báo cáo ngành</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tao-ho-so" className="text-slate-700 hover:text-amber-700 hover:underline flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Đăng ký gia nhập mạng lưới xác thực</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



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

      {/* Floating Back-to-Top Button (Raised above bottom-right mascot) */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-40 p-2.5 sm:p-3 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </main>
  );
}
