import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Factory, MapPin, Building2, CheckCircle2, 
  ChevronRight, ArrowRight, RotateCcw, LayoutGrid, LayoutList,
  Calendar, ShieldCheck, Sparkles, ExternalLink, Globe, Phone, Briefcase, Layers, Award,
  Send, Lock, Zap, Clock, Users, ArrowUpRight, Eye
} from 'lucide-react';
import kcnFullList from '../data/industrialParksFull.json';
import factoriesFullList from '../data/factoriesFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import FactoryProcurementTicker from '../components/factories/FactoryProcurementTicker';
import FactoryHeatmapMapSection from '../components/factories/FactoryHeatmapMapSection';
import FactoryHunterSidebar from '../components/factories/FactoryHunterSidebar';
import FactoryKycPaywallModal from '../components/factories/FactoryKycPaywallModal';
import FactorySubmitRfqModal from '../components/factories/FactorySubmitRfqModal';

// Master 18-Phase Procurement Demand Catalog for Realistic Random Mapping
const ALL_18_PHASES_DEMANDS = {
  "1.1": [
    { phaseId: '1.1', title: 'Cần Khảo sát địa chất công trình & Báo cáo khả thi FS mở rộng', phaseName: 'Khảo sát FS', color: 'purple' },
    { phaseId: '1.1', title: 'Cần Tư vấn nghiên cứu thị trường & Đánh giá chuỗi cung ứng', phaseName: 'Khảo sát Thị trường', color: 'purple' }
  ],
  "1.2": [
    { phaseId: '1.2', title: 'Cần Đơn vị tư vấn lập hồ sơ ĐTM & Giấy phép môi trường KCN', phaseName: 'ĐTM Môi trường', color: 'purple' },
    { phaseId: '1.2', title: 'Cần Hoàn thiện hồ sơ xin cấp phép đầu tư & Giấy phép xây dựng', phaseName: 'Pháp lý Đầu tư', color: 'purple' }
  ],
  "1.3": [
    { phaseId: '1.3', title: 'Cần Tìm thuê 2-5 ha đất KCN hoặc Nhà xưởng xây sẵn đạt chuẩn', phaseName: 'Quỹ đất & Xưởng', color: 'purple' },
    { phaseId: '1.3', title: 'Cần Thuê nhà xưởng có sẵn trạm điện 1000kVA tại KCN', phaseName: 'Thuê Xưởng KCN', color: 'purple' }
  ],
  "2.1": [
    { phaseId: '2.1', title: 'Cần Tư vấn thiết kế quy hoạch 1/500 & Triển khai mô hình BIM', phaseName: 'Thiết kế & BIM', color: 'sky' },
    { phaseId: '2.1', title: 'Cần Thiết kế kiến trúc tổng thể & Kết cấu nhà máy phụ trợ', phaseName: 'Thiết kế Nhà máy', color: 'sky' }
  ],
  "2.2": [
    { phaseId: '2.2', title: 'Cần Tổng thầu thi công nhà thép tiền chế & Khung kèo nhịp lớn', phaseName: 'Nhà thép tiền chế', color: 'sky' },
    { phaseId: '2.2', title: 'Cần Thi công sàn bê tông mài tăng cứng Hardener & Chống nứt', phaseName: 'Sàn Bê tông', color: 'sky' }
  ],
  "2.3": [
    { phaseId: '2.3', title: 'Cần Bảo trì trạm biến áp 22kV, Cơ điện MEP & PCCC tự động', phaseName: 'Cơ điện MEP & PCCC', color: 'sky' },
    { phaseId: '2.3', title: 'Cần Lắp đặt hệ thống điều hòa thông gió công nghiệp HVAC', phaseName: 'Hệ thống HVAC', color: 'sky' }
  ],
  "3.1": [
    { phaseId: '3.1', title: 'Cần Lắp đặt cẩu trục dầm đôi 10T & Dây chuyền sản xuất tự động', phaseName: 'Cẩu trục & Rigging', color: 'cyan' },
    { phaseId: '3.1', title: 'Cần Đội ngũ căn chỉnh, lắp ráp máy móc chính xác CNC', phaseName: 'Lắp đặt Máy móc', color: 'cyan' }
  ],
  "3.2": [
    { phaseId: '3.2', title: 'Cần Hoàn thiện phòng sạch GMP / Class 1000 & Panel cách nhiệt', phaseName: 'Phòng sạch Cleanroom', color: 'cyan' },
    { phaseId: '3.2', title: 'Cần Thi công sơn sàn Epoxy chống tĩnh điện ESD & Chịu lực', phaseName: 'Sơn sàn Epoxy', color: 'cyan' }
  ],
  "3.3": [
    { phaseId: '3.3', title: 'Cần Chạy thử có tải, Đo kiểm rung động & Kiểm định an toàn', phaseName: 'Kiểm định An toàn', color: 'cyan' },
    { phaseId: '3.3', title: 'Cần Đơn vị đánh giá nghiệm thu kỹ thuật dây chuyền sản xuất', phaseName: 'Nghiệm thu Máy', color: 'cyan' }
  ],
  "4.1": [
    { phaseId: '4.1', title: 'Cần Cung ứng NVL kim loại, Thép cuộn mạ kẽm & Nhôm định hình', phaseName: 'NVL Kim loại', color: 'indigo' },
    { phaseId: '4.1', title: 'Cần Cung ứng Bao bì Carton 5 lớp, Màng co & Khay nhựa định hình', phaseName: 'Bao bì & Đóng gói', color: 'indigo' },
    { phaseId: '4.1', title: 'Cần Cung ứng Bu lông ốc vít cấp bền, Phụ tùng cơ khí & Jig', phaseName: 'Bu lông & Linh kiện', color: 'indigo' }
  ],
  "4.2": [
    { phaseId: '4.2', title: 'Cần Gia công cơ khí chính xác CNC, Phay tiện 5 trục & Khuôn mẫu', phaseName: 'Gia công CNC', color: 'indigo' },
    { phaseId: '4.2', title: 'Cần Triển khai phần mềm Quản lý sản xuất MES & Kiểm soát QA/QC', phaseName: 'Quản lý MES', color: 'indigo' },
    { phaseId: '4.2', title: 'Cần Dịch vụ bảo trì, đại tu máy móc công nghiệp định kỳ', phaseName: 'Bảo trì Nhà máy', color: 'indigo' }
  ],
  "4.3": [
    { phaseId: '4.3', title: 'Cần Logistics, Thuê xe container lạnh & Vận chuyển cảng biển', phaseName: 'Logistics Cảng biển', color: 'blue' },
    { phaseId: '4.3', title: 'Cần Thuê kho bãi ngoại quan & Pallet gỗ xuất khẩu tại KCN', phaseName: 'Kho bãi KCN', color: 'blue' }
  ],
  "5.1": [
    { phaseId: '5.1', title: 'Cần Tuyển dụng 200+ lao động phổ thông & Cung ứng thời vụ KCN', phaseName: 'Tuyển dụng Lao động', color: 'amber' },
    { phaseId: '5.1', title: 'Cần Tuyển dụng kỹ sư tự động hóa, QA/QC & Quản đốc xưởng', phaseName: 'Nhân sự Kỹ thuật', color: 'amber' }
  ],
  "5.2": [
    { phaseId: '5.2', title: 'Cần Cung ứng 1.500 suất ăn công nghiệp tiêu chuẩn HACCP', phaseName: 'Suất ăn HACCP', color: 'amber' },
    { phaseId: '5.2', title: 'Cần Dịch vụ xe đưa đón công nhân & Quà tặng doanh nghiệp', phaseName: 'Phúc lợi & Đưa đón', color: 'amber' }
  ],
  "5.3": [
    { phaseId: '5.3', title: 'Cần May 3.000 bộ đồng phục công nhân & Quần áo ESD Cleanroom', phaseName: 'Đồng phục ESD', color: 'emerald' },
    { phaseId: '5.3', title: 'Cần Cung ứng giày bảo hộ lao động, Nón PPE & Kính an toàn', phaseName: 'Bảo hộ Lao động', color: 'emerald' }
  ],
  "6.1": [
    { phaseId: '6.1', title: 'Cần Tổng thầu mở rộng công suất nhà xưởng Pha 2 & Cải tạo kho', phaseName: 'Mở rộng Nhà máy', color: 'rose' },
    { phaseId: '6.1', title: 'Cần Cải tạo, nâng cấp sàn xưởng & Mở rộng phân xưởng sản xuất', phaseName: 'Nâng cấp Xưởng', color: 'rose' }
  ],
  "6.2": [
    { phaseId: '6.2', title: 'Cần Tư vấn đánh giá chứng nhận ISO 9001, ISO 14001 & ISO 45001', phaseName: 'Chứng nhận ISO', color: 'rose' },
    { phaseId: '6.2', title: 'Cần Tư vấn chuẩn hóa báo cáo ESG xanh & Kiểm kê khí nhà kính', phaseName: 'Tiêu chuẩn ESG', color: 'rose' }
  ],
  "6.3": [
    { phaseId: '6.3', title: 'Cần Triển khai hệ thống Robot tự hành AGV & Kho tự động AS/RS', phaseName: 'Robot AGV & AS/RS', color: 'violet' },
    { phaseId: '6.3', title: 'Cần Lắp đặt hệ thống Điện mặt trời áp mái 1MWp EPC theo PPA', phaseName: 'Điện mặt trời Áp mái', color: 'violet' }
  ]
};

// Deterministic hash code generator for stable variety
function stringHashCode(str) {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getFactoryActiveDemands(factory) {
  if (!factory) return [];
  const ind = (factory.industry || factory.name || '').toLowerCase();
  const hashSeed = stringHashCode(`${factory.id || factory.name || 'ccu'}-${factory.province || 'vn'}`);

  // Sector-specific priority phase groups
  let candidatePhases = ['4.1', '4.3', '5.3'];

  if (/dien\s*tu|ban\s*dan|chip|vi\s*mach|pcb/i.test(ind)) {
    candidatePhases = ['5.3', '3.2', '4.1', '4.2', '6.3', '2.3'];
  } else if (/may\s*mac|det|giay|da\s*giay|vai|soi/i.test(ind)) {
    candidatePhases = ['4.1', '5.2', '4.3', '5.1', '5.3', '6.2'];
  } else if (/co\s*khi|kim\s*loai|thep|o\s*to|xe\s*may|gia\s*cong/i.test(ind)) {
    candidatePhases = ['4.2', '4.1', '2.3', '3.1', '6.3', '4.3'];
  } else if (/thuc\s*pham|do\s*uong|banh\s*keo|nong\s*san|thuy\s*san/i.test(ind)) {
    candidatePhases = ['4.1', '4.3', '5.3', '5.2', '6.2', '3.2'];
  } else if (/bao\s*bi|carton|giay|in\s*an/i.test(ind)) {
    candidatePhases = ['4.1', '4.3', '3.1', '5.1', '6.1', '2.3'];
  } else if (/nhua|cao\s*su|hoa\s*chat/i.test(ind)) {
    candidatePhases = ['4.1', '1.2', '2.3', '4.3', '6.2', '5.3'];
  } else if (/duoc|y\s*te|thuoc/i.test(ind)) {
    candidatePhases = ['3.2', '6.2', '4.1', '5.3', '2.3', '1.2'];
  } else if (/go|noi\s*that/i.test(ind)) {
    candidatePhases = ['4.1', '4.3', '5.1', '4.2', '5.3', '6.1'];
  } else {
    // General manufacturing - select across diverse phases
    const allPhaseIds = Object.keys(ALL_18_PHASES_DEMANDS);
    const p1 = allPhaseIds[hashSeed % allPhaseIds.length];
    const p2 = allPhaseIds[(hashSeed + 5) % allPhaseIds.length];
    const p3 = allPhaseIds[(hashSeed + 11) % allPhaseIds.length];
    candidatePhases = [p1, p2, p3];
  }

  // Pick 2-3 deterministic demands
  const demands = [];
  const pickedPhases = new Set();
  
  for (let i = 0; i < candidatePhases.length; i++) {
    const pId = candidatePhases[(hashSeed + i) % candidatePhases.length];
    if (pickedPhases.has(pId)) continue;
    pickedPhases.add(pId);
    
    const pool = ALL_18_PHASES_DEMANDS[pId] || ALL_18_PHASES_DEMANDS['4.1'];
    const item = pool[(hashSeed + i) % pool.length];
    demands.push(item);
    if (demands.length >= 3) break;
  }

  return demands.length > 0 ? demands : [
    ALL_18_PHASES_DEMANDS['4.1'][0],
    ALL_18_PHASES_DEMANDS['4.3'][0]
  ];
}

// Local resilient filter fallback for factories
function filterFactoriesLocally(allData, { searchTerm, selectedProvince, selectedKcn, selectedIndustry, selectedPhase, selectedType, currentPage, limit = 24, sortBy }) {
  if (!allData || !Array.isArray(allData)) return { data: [], total: 0, totalPages: 1 };
  try {
    let filtered = allData;
    if (searchTerm) {
      const qClean = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        if (!f) return false;
        const nameClean = (f.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const kcnClean = (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const addrClean = (f.address || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const indClean = (f.industry || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const typeClean = (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nameClean.includes(qClean) || kcnClean.includes(qClean) || addrClean.includes(qClean) || indClean.includes(qClean) || typeClean.includes(qClean);
      });
    }
    if (selectedProvince !== 'Toàn quốc' && selectedProvince !== 'all') {
      const provClean = selectedProvince.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => {
        if (!f) return false;
        const fProv = (f.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return fProv.includes(provClean) || provClean.includes(fProv);
      });
    }
    if (selectedKcn !== 'all') {
      const kcnClean = selectedKcn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => f && (f.kcnName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(kcnClean));
    }
    if (selectedIndustry && selectedIndustry !== 'all') {
      const indKeywords = {
        'dien-tu': /dien\s*tu|ban\s*dan|chip|pcb|vi\s*mach|linh\s*kien/i,
        'may-mac': /may\s*mac|det|giay|da|soi|vai|quan\s*ao/i,
        'thuc-pham': /thuc\s*pham|do\s*uong|banh\s*keo|nong\s*san|thuy\s*san/i,
        'co-khi': /co\s*khi|kim\s*loai|thep|khuon|cnc|o\s*to/i,
        'bao-bi': /bao\s*bi|carton|giay|in\s*an/i,
        'nhua-hoa-chat': /nhua|cao\s*su|hoa\s*chat|keo/i,
        'duoc-pham': /duoc|y\s*te|thuoc/i,
        'go-noi-that': /go|noi\s*that|van\s*ep/i
      };
      const regex = indKeywords[selectedIndustry];
      if (regex) {
        filtered = filtered.filter(f => regex.test(f.industry || f.name || ''));
      }
    }
    if (selectedPhase && selectedPhase !== 'all') {
      filtered = filtered.filter(f => {
        const demands = getFactoryActiveDemands(f);
        return demands.some(d => d.phaseId === selectedPhase);
      });
    }
    if (selectedType !== 'all' && selectedType !== 'Tất cả loại hình') {
      const typeClean = selectedType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filtered = filtered.filter(f => f && (f.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(typeClean));
    }
    if (sortBy === 'name-asc') {
      filtered = [...filtered].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    } else if (sortBy === 'year-desc') {
      filtered = [...filtered].sort((a, b) => parseInt(b?.foundedYear || 0) - parseInt(a?.foundedYear || 0));
    }
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);
    return { data: paginated, total, totalPages };
  } catch (e) {
    console.error('Error filtering factories locally:', e);
    return { data: (allData || []).slice(0, limit), total: allData?.length || 0, totalPages: Math.ceil((allData?.length || 0) / limit) || 1 };
  }
}

export default function FactoriesPage() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(queryParams.get('q') || '');
  const [selectedProvince, setSelectedProvince] = useState(queryParams.get('province') || 'Toàn quốc');
  const [selectedKcn, setSelectedKcn] = useState(queryParams.get('kcn') || 'all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState(queryParams.get('phase') || 'all');
  const [selectedType, setSelectedType] = useState(queryParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'name-asc' | 'year-desc'

  // Paywall & Submission Modals state
  const [paywallTarget, setPaywallTarget] = useState(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [rfqModalTarget, setRfqModalTarget] = useState(null);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  // Initialize with local dataset immediately
  const initialLocal = useMemo(() => {
    return filterFactoriesLocally(factoriesFullList, {
      searchTerm: queryParams.get('q') || '',
      selectedProvince: queryParams.get('province') || 'Toàn quốc',
      selectedKcn: queryParams.get('kcn') || 'all',
      selectedIndustry: 'all',
      selectedPhase: queryParams.get('phase') || 'all',
      selectedType: queryParams.get('type') || 'all',
      currentPage: 1,
      limit: 24,
      sortBy: 'default'
    });
  }, []);

  const [factories, setFactories] = useState(initialLocal.data || []);
  const [totalCount, setTotalCount] = useState(initialLocal.total || 14237);
  const [totalPages, setTotalPages] = useState(initialLocal.totalPages || 594);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter KCN list based on chosen province for the KCN dropdown
  const filteredKcnList = useMemo(() => {
    if (!kcnFullList || !Array.isArray(kcnFullList)) return [];
    if (selectedProvince === 'Toàn quốc' || selectedProvince === 'all') {
      return kcnFullList;
    }
    const provClean = selectedProvince.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    return kcnFullList.filter(k => {
      const kProv = (k.province || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      return kProv.includes(provClean) || provClean.includes(kProv);
    });
  }, [selectedProvince]);

  // Dynamic filter updates
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      try {
        const localResult = filterFactoriesLocally(factoriesFullList, {
          searchTerm,
          selectedProvince,
          selectedKcn,
          selectedIndustry,
          selectedPhase,
          selectedType,
          currentPage,
          limit: 24,
          sortBy
        });
        if (isMounted) {
          setFactories(localResult.data);
          setTotalCount(localResult.total);
          setTotalPages(localResult.totalPages);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsLoading(false);
      }
    }, 60);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedProvince, selectedKcn, selectedIndustry, selectedPhase, selectedType, currentPage, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedProvince('Toàn quốc');
    setSelectedKcn('all');
    setSelectedIndustry('all');
    setSelectedPhase('all');
    setSelectedType('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const handleSelectProvinceFromHeatmap = (prov) => {
    setSelectedProvince(prov);
    setSelectedKcn('all');
    setCurrentPage(1);
  };

  const handleOpenPaywall = (factory) => {
    setPaywallTarget({ factory });
    setIsPaywallOpen(true);
  };

  const handleOpenSubmitRfq = (factory) => {
    setRfqModalTarget({ factory });
    setIsRfqModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-24 font-sans text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white space-y-8 sm:space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Seamless Panoramic Smart Factory Visual - EXACT IMAGE 1) */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pt-8 sm:pt-12 lg:pt-14 pb-24 sm:pb-28 lg:pb-32 min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center">
        
        {/* Right Half Smart Factory & Illuminated Industrial Park Flycam Video with Smooth Gradient Blend */}
        <div className="absolute top-0 right-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            poster="/images/smart_factory_hero.jpg"
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none transition-opacity duration-1000"
          >
            <source src="/images/factory_illuminated_drone_1080p.webm" type="video/webm" />
            <source src="/images/factory_illuminated_drone_480p.webm" type="video/webm" />
            <source src="/images/industrial_drone_flycam.webm" type="video/webm" />
            <img 
              src="/images/smart_factory_hero.jpg" 
              alt="Vietnam Smart Manufacturing Plant Flycam"
              className="w-full h-full object-cover object-center scale-105"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FA] via-[#F4F8FA]/90 md:via-[#F4F8FA]/60 lg:via-[#F4F8FA]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F8FA] via-transparent to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 relative z-10 w-full">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar touch-scroll whitespace-nowrap py-0.5">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'FDI Factories Network' : 'Nhà Máy & Cơ Sở Sản Xuất'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'VIETNAM FDI & MANUFACTURING FACTORIES' : 'HỆ THỐNG DỮ LIỆU NHÀ MÁY & FDI VIỆT NAM'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Factory Network' : 'Mạng Lưới Nhà Máy'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Smart Manufacturing Plants' : 'Cơ Sở Sản Xuất Thông Minh'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en'
                ? 'Search comprehensive database of 14,237+ manufacturing plants, fabrication facilities, and FDI enterprises actively operating across 480 Industrial Parks.'
                : 'Tra cứu danh sách 14.237+ nhà máy sản xuất, cơ sở chế tạo và doanh nghiệp FDI đang hoạt động thực tế trong 480 Khu công nghiệp trên toàn quốc.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-nha-may"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <span>{lang === 'en' ? 'Explore Factories' : 'Tra Cứu Nhà Máy'}</span>
              </a>

              <Link
                to="/dang-nhu-cau"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Open Demands' : 'Nhu Cầu Cung Ứng'}</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* STATS BAR (EXACT 4 STAT CARDS FROM IMAGE 1) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">14.237+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Active Factories' : 'Nhà máy đang hoạt động'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">480 KCN</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Connected IPs' : 'Khu công nghiệp kết nối'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">34</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces Covered' : 'Tỉnh thành toàn quốc'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">FDI & B2B</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Sourcing Ready' : 'Nhu cầu mở kết nối'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BẢNG TIN KHỚP LỆNH REALTIME (FOMO TICKER - TONE SÁNG & TỰ ĐỘNG TRƯỢT) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FactoryProcurementTicker onSelectDemand={(d) => {
          setPaywallTarget({ demand: d });
          setIsPaywallOpen(true);
        }} />
      </div>

      {/* ========================================================================= */}
      {/* 3. BẢN ĐỒ NHIỆT KCN & DÒNG VỐN SẢN XUẤT (HEATMAP INTERACTIVE) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FactoryHeatmapMapSection 
          selectedProvince={selectedProvince}
          onSelectProvince={handleSelectProvinceFromHeatmap}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4 & 5. BỘ LỌC SĂN KHÁCH (STICKY SIDEBAR) + LƯỚI BUYER GRID (PAYWALL UX) */}
      {/* ========================================================================= */}
      <div id="danh-sach-nha-may" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* CỘT TRÁI: BỘ LỌC SĂN KHÁCH (HUNTER FILTER - STICKY SIDEBAR) */}
          <FactoryHunterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedKcn={selectedKcn}
            setSelectedKcn={setSelectedKcn}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedPhase={selectedPhase}
            setSelectedPhase={setSelectedPhase}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onResetFilters={handleResetFilters}
            filteredKcnList={filteredKcnList}
            totalMatchingCount={totalCount}
          />

          {/* CỘT PHẢI: LƯỚI DANH SÁCH NHÀ MÁY (BUYER GRID WITH PAYWALL UX) */}
          <div className="flex-1 min-w-0 space-y-5 w-full">
            
            {/* Action Bar & Results Header */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-slate-900 text-sm">
                  {totalCount.toLocaleString('vi-VN')} Nhà Máy Đang Hoạt Động
                </span>
                {selectedProvince !== 'Toàn quốc' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[11px]">
                    📍 {selectedProvince}
                  </span>
                )}
                {selectedPhase !== 'all' && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                    ⚡ Pha {selectedPhase}
                  </span>
                )}
              </div>

              {/* Sorter & View Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span>Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0052cc] outline-none cursor-pointer"
                  >
                    <option value="default">Mặc định STT</option>
                    <option value="name-asc">Tên A → Z</option>
                    <option value="year-desc">Năm thành lập mới</option>
                  </select>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition font-bold cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Dạng Lưới"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition font-bold cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-[#0052cc] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Dạng Bảng"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* FACTORIES PRESENTATION */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs animate-pulse space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-16 bg-slate-50 rounded-2xl" />
                    <div className="h-8 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (!factories || factories.length === 0) ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <Factory className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">Không tìm thấy nhà máy phù hợp</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Hãy thử thay đổi từ khóa tìm kiếm, chọn lại Khu công nghiệp hoặc đặt lại bộ lọc để xem toàn bộ danh mục 14.237 nhà máy.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Xem tất cả nhà máy
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* BUYER GRID VIEW WITH ACTIVE DEMANDS & PAYWALL UX */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {factories.map((fac, idx) => {
                  if (!fac) return null;
                  const initial = (fac.name || 'NM').charAt(0).toUpperCase();
                  const demands = getFactoryActiveDemands(fac);
                  const detailUrl = `/nha-may/${fac.id || fac._id || `factory-${fac.no || idx}`}`;

                  return (
                    <div
                      key={fac.id || fac._id || `fac-${idx}`}
                      className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0052cc]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group relative"
                    >
                      <div className="space-y-3">
                        {/* Header: Prominent Company Name without circular "C" icon */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] font-mono font-bold text-[10px] border border-blue-100 flex items-center gap-1">
                              <Factory className="w-3 h-3 text-[#0052cc]" />
                              <span>{fac.type || "Doanh nghiệp sản xuất"}</span>
                            </span>
                            {fac.province && (
                              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-0.5 shrink-0 font-sans">
                                <MapPin className="w-3 h-3 text-rose-500" />
                                {fac.province}
                              </span>
                            )}
                          </div>

                          <Link
                            to={detailUrl}
                            className="block font-black text-sm sm:text-[14.5px] text-slate-950 group-hover:text-[#0052cc] transition font-heading leading-snug line-clamp-2"
                            title={fac.name}
                          >
                            <span>{fac.name}</span>
                            {fac.province && (
                              <span className="text-slate-500 font-bold ml-1 text-xs">
                                ({fac.province})
                              </span>
                            )}
                          </Link>
                        </div>

                        {/* KCN Link Badge */}
                        <Link 
                          to={`/khu-cong-nghiep/${fac.kcnId}`}
                          className="p-2 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 rounded-xl transition flex items-center gap-1.5 text-xs text-slate-700 group/kcn"
                          title={`Xem KCN ${fac.kcnName}`}
                        >
                          <Building2 className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
                          <span className="font-bold text-slate-900 group-hover/kcn:text-[#0052cc] line-clamp-1 text-[11px]">{fac.kcnName}</span>
                        </Link>

                        {/* CORE UX LEAD MAGNET: ACTIVE PROCUREMENT DEMANDS */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[10.5px]">
                            <span className="font-bold text-slate-600 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                              Nhu Cầu Thu Mua Đang Mở:
                            </span>
                            <span className="font-mono text-emerald-600 font-bold">
                              Nhận báo giá
                            </span>
                          </div>

                          <div className="space-y-1">
                            {demands.slice(0, 2).map((d, dIdx) => (
                              <div 
                                key={dIdx}
                                className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/70 hover:border-emerald-200 rounded-xl text-[10.5px] flex items-center justify-between gap-1.5 transition-colors"
                              >
                                <span className="text-slate-800 font-medium truncate" title={d.title}>
                                  ⚡ {d.title}
                                </span>
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold rounded shrink-0">
                                  Pha {d.phaseId}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sector Info */}
                        <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                          <div className="line-clamp-1 text-[11px]">
                            <span className="font-bold text-slate-700">Ngành SX: </span>
                            <span>{fac.industry || "Sản xuất & Chế tạo"}</span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS & PAYWALL LOCK BUTTONS */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        
                        {/* Dual Action: Gửi Hồ Sơ & Mở Khóa Liên Hệ (Paywall) */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleOpenSubmitRfq(fac)}
                            className="py-2 px-2 bg-gradient-to-r from-[#0047a5] to-[#0052cc] hover:from-[#003d8f] hover:to-[#0047a5] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1 font-heading cursor-pointer whitespace-nowrap"
                          >
                            <Send className="w-3 h-3" />
                            <span>Gửi Hồ Sơ</span>
                          </button>

                          {/* Paywall Locked Contact Button */}
                          <button
                            onClick={() => handleOpenPaywall(fac)}
                            className="py-2 px-2 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer whitespace-nowrap"
                            title="Thông tin liên hệ được bảo vệ chống spam. Bấm để đẩy hồ sơ năng lực vào Dashboard Mua Hàng"
                          >
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Zalo/Email 🔒</span>
                          </button>
                        </div>

                        <Link
                          to={detailUrl}
                          className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[11px] rounded-xl transition flex items-center justify-center space-x-1 font-heading"
                        >
                          <span>Xem Hồ Sơ Nhà Máy</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW: STRICT TABLE-FIXED WITH 0 HORIZONTAL SCROLL */
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="w-full overflow-hidden">
                  <table className="w-full table-fixed text-left text-xs border-collapse">
                    <colgroup>
                      <col className="w-[5%]" />
                      <col className="w-[28%]" />
                      <col className="w-[15%]" />
                      <col className="w-[9%]" />
                      <col className="w-[9%]" />
                      <col className="w-[18%]" />
                      <col className="w-[16%]" />
                    </colgroup>
                    <thead className="bg-slate-900 text-white uppercase text-[10.5px] font-heading tracking-wider">
                      <tr>
                        <th className="py-3 pl-3 pr-1 text-center whitespace-nowrap">STT</th>
                        <th className="py-3 px-2">Tên Nhà Máy & Vị Trí</th>
                        <th className="py-3 px-2">KCN</th>
                        <th className="py-3 px-2">Tỉnh/TP</th>
                        <th className="py-3 px-1 text-center whitespace-nowrap">Pha</th>
                        <th className="py-3 px-2">Ngành</th>
                        <th className="py-3 pr-3 pl-1 text-center whitespace-nowrap">Hồ Sơ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {factories.map((fac, idx) => {
                        if (!fac) return null;
                        const demands = getFactoryActiveDemands(fac);
                        const detailUrl = `/nha-may/${fac.id || fac._id || `factory-${fac.no || idx}`}`;
                        const shortKcnName = fac.kcnName ? fac.kcnName.replace(/^Khu [cC]ông [nN]ghiệp\s+/i, 'KCN ') : '';
                        const shortAddress = fac.address ? fac.address.replace(/Khu [cC]ông [nN]ghiệp/gi, 'KCN') : '';

                        return (
                          <tr key={fac.id || fac._id || `factr-${idx}`} className="hover:bg-blue-50/40 transition">
                            <td className="py-2.5 pl-3 pr-1 text-center text-slate-500 font-bold font-mono whitespace-nowrap">
                              {(currentPage - 1) * 24 + idx + 1}
                            </td>
                            <td className="py-2.5 px-2 overflow-hidden">
                              <Link to={detailUrl} className="font-extrabold text-slate-950 text-xs hover:text-[#0052cc] transition block truncate font-heading" title={fac.name}>
                                {fac.name}
                              </Link>
                              <div className="text-[10.5px] text-slate-500 truncate mt-0.5" title={shortAddress}>{shortAddress}</div>
                            </td>
                            <td className="py-2.5 px-2 overflow-hidden">
                              <Link 
                                to={`/khu-cong-nghiep/${fac.kcnId}`}
                                className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-xs truncate"
                                title={fac.kcnName}
                              >
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{shortKcnName}</span>
                              </Link>
                            </td>
                            <td className="py-2.5 px-2 font-bold text-slate-700 text-xs truncate">
                              {fac.province}
                            </td>
                            <td className="py-2.5 px-1 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                {demands.slice(0, 1).map((d, dIdx) => (
                                  <Link 
                                    key={dIdx} 
                                    to={`/giai-doan-cung-ung/pha/${d.phaseId}`}
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg font-bold font-mono border border-emerald-200 transition shadow-2xs" 
                                    title={d.title}
                                  >
                                    <span>Pha {d.phaseId}</span>
                                  </Link>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-2 overflow-hidden">
                              <span className="text-slate-700 text-xs truncate block" title={fac.industry}>{fac.industry}</span>
                            </td>
                            <td className="py-2.5 pr-3 pl-1 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenSubmitRfq(fac)}
                                  className="px-2.5 py-1.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
                                  title="Gửi hồ sơ năng lực"
                                >
                                  <Send className="w-3 h-3 shrink-0" />
                                  <span>Gửi Hồ Sơ</span>
                                </button>
                                <button
                                  onClick={() => handleOpenPaywall(fac)}
                                  className="p-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition cursor-pointer shrink-0"
                                  title="Xem Zalo/Email Mua Hàng 🔒"
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  &larr; Trang trước
                </button>
                <span className="px-4 py-2 bg-blue-50 border border-blue-200 text-[#0052cc] rounded-xl text-xs font-black">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  Trang sau &rarr;
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. KHỐI CTA DÀNH CHO GIÁM ĐỐC FDI MỚI & CHỦ ĐẦU TƯ KCN (BLOCK 6) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#071b3b] to-slate-950 border border-blue-900/80 p-6 sm:p-8 lg:p-10 text-white shadow-2xl overflow-hidden">
          {/* Ambient lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>DÀNH RIÊNG CHO GIÁM ĐỐC MUA HÀNG & CHỦ ĐẦU TƯ KCN</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                Bạn Là Giám Đốc Mua Hàng / Chủ Đầu Tư KCN?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Đăng tải nhu cầu để 15.000+ Nhà cung cấp xác thực chủ động gửi hồ sơ năng lực & báo giá cạnh tranh qua hệ thống quản lý của bạn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/dang-nhu-cau"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 font-heading cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mở Cổng Thu Mua Miễn Phí</span>
              </Link>

              <Link
                to="/doanh-nghiep"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 font-heading"
              >
                <span>Tra Cứu Nhà Cung Ứng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Paywall & Profile Dispatch Modal */}
      <FactoryKycPaywallModal
        factory={paywallTarget?.factory}
        demand={paywallTarget?.demand}
        isOpen={isPaywallOpen}
        onClose={() => {
          setIsPaywallOpen(false);
          setPaywallTarget(null);
        }}
      />

      {/* RFQ Submission Modal */}
      <FactorySubmitRfqModal
        factory={rfqModalTarget?.factory}
        demand={rfqModalTarget?.demand}
        isOpen={isRfqModalOpen}
        onClose={() => {
          setIsRfqModalOpen(false);
          setRfqModalTarget(null);
        }}
      />

    </div>
  );
}
