import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, ArrowRight, CheckCircle2, ChevronRight, Sparkles, 
  Building2, Factory, Users, ShieldCheck, MapPin, Search, Compass,
  FolderOpen, Zap, Landmark, Award, FileText, Check, Download,
  Activity, ArrowUpRight
} from 'lucide-react';
import { stagesData } from '../data/mockData';
import InteractiveExplodedFlower3D from '../components/InteractiveExplodedFlower3D';
import MoUModal from '../components/six-stages/MoUModal';
import ThreeLayerKYCSection from '../components/six-stages/ThreeLayerKYCSection';
import LiveMatchTicker from '../components/six-stages/LiveMatchTicker';
import CaseStudiesSection from '../components/six-stages/CaseStudiesSection';
import StickyPhaseCTA from '../components/six-stages/StickyPhaseCTA';
import { useLanguage } from '../contexts/LanguageContext';

// 6 Primary Stage Themes
const STAGE_THEMES = {
  1: {
    name: 'purple',
    primary: '#8b5cf6',
    activeTabClass: 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg shadow-purple-900/25 ring-2 ring-purple-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900',
    tabBadgeActive: 'bg-white text-purple-950 font-black',
    tabBadgeInactive: 'bg-purple-100 text-purple-800 font-bold',
    phaseBadge: 'bg-purple-700 text-white',
    phaseBadgeSelected: 'bg-purple-800 text-white',
    phaseCardSelected: 'bg-purple-50/25 border-purple-500 shadow-xl ring-2 ring-purple-500/20 scale-[1.01]',
    phaseActiveText: 'text-purple-700',
    phaseActiveChevron: 'text-purple-600',
    feedBorder: 'border-2 border-purple-200/90 shadow-purple-900/5',
    feedPhaseBadge: 'bg-purple-700 text-white',
    feedSubTitle: 'text-purple-600',
    feedCtaBtn: 'bg-purple-50 hover:bg-purple-600 text-purple-900 hover:text-white',
    stdCodeColor: 'text-purple-700',
    counterBorder: 'border-purple-200/80 hover:border-purple-400',
    counterText: 'text-purple-700',
  },
  2: {
    name: 'emerald',
    primary: '#10b981',
    activeTabClass: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/25 ring-2 ring-emerald-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900',
    tabBadgeActive: 'bg-white text-emerald-950 font-black',
    tabBadgeInactive: 'bg-emerald-100 text-emerald-800 font-bold',
    phaseBadge: 'bg-emerald-700 text-white',
    phaseBadgeSelected: 'bg-emerald-800 text-white',
    phaseCardSelected: 'bg-emerald-50/25 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20 scale-[1.01]',
    phaseActiveText: 'text-emerald-700',
    phaseActiveChevron: 'text-emerald-600',
    feedBorder: 'border-2 border-emerald-200/90 shadow-emerald-900/5',
    feedPhaseBadge: 'bg-emerald-700 text-white',
    feedSubTitle: 'text-emerald-600',
    feedCtaBtn: 'bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white',
    stdCodeColor: 'text-emerald-700',
    counterBorder: 'border-emerald-200/80 hover:border-emerald-400',
    counterText: 'text-emerald-700',
  },
  3: {
    name: 'orange',
    primary: '#f97316',
    activeTabClass: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-900/25 ring-2 ring-orange-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-900',
    tabBadgeActive: 'bg-white text-orange-950 font-black',
    tabBadgeInactive: 'bg-orange-100 text-orange-800 font-bold',
    phaseBadge: 'bg-orange-600 text-white',
    phaseBadgeSelected: 'bg-orange-700 text-white',
    phaseCardSelected: 'bg-orange-50/25 border-orange-500 shadow-xl ring-2 ring-orange-500/20 scale-[1.01]',
    phaseActiveText: 'text-orange-700',
    phaseActiveChevron: 'text-orange-600',
    feedBorder: 'border-2 border-orange-200/90 shadow-orange-900/5',
    feedPhaseBadge: 'bg-orange-600 text-white',
    feedSubTitle: 'text-orange-600',
    feedCtaBtn: 'bg-orange-50 hover:bg-orange-600 text-orange-900 hover:text-white',
    stdCodeColor: 'text-orange-700',
    counterBorder: 'border-orange-200/80 hover:border-orange-400',
    counterText: 'text-orange-700',
  },
  4: {
    name: 'blue',
    primary: '#0284c7',
    activeTabClass: 'bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg shadow-blue-900/25 ring-2 ring-blue-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900',
    tabBadgeActive: 'bg-white text-blue-950 font-black',
    tabBadgeInactive: 'bg-blue-100 text-blue-800 font-bold',
    phaseBadge: 'bg-blue-600 text-white',
    phaseBadgeSelected: 'bg-blue-700 text-white',
    phaseCardSelected: 'bg-blue-50/25 border-blue-500 shadow-xl ring-2 ring-blue-500/20 scale-[1.01]',
    phaseActiveText: 'text-blue-700',
    phaseActiveChevron: 'text-blue-600',
    feedBorder: 'border-2 border-blue-200/90 shadow-blue-900/5',
    feedPhaseBadge: 'bg-blue-600 text-white',
    feedSubTitle: 'text-blue-600',
    feedCtaBtn: 'bg-blue-50 hover:bg-blue-600 text-blue-900 hover:text-white',
    stdCodeColor: 'text-blue-700',
    counterBorder: 'border-blue-200/80 hover:border-blue-400',
    counterText: 'text-blue-700',
  },
  5: {
    name: 'amber',
    primary: '#d97706',
    activeTabClass: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-900/25 ring-2 ring-amber-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900',
    tabBadgeActive: 'bg-white text-amber-950 font-black',
    tabBadgeInactive: 'bg-amber-100 text-amber-900 font-bold',
    phaseBadge: 'bg-amber-600 text-white',
    phaseBadgeSelected: 'bg-amber-700 text-white',
    phaseCardSelected: 'bg-amber-50/25 border-amber-500 shadow-xl ring-2 ring-amber-500/20 scale-[1.01]',
    phaseActiveText: 'text-amber-700',
    phaseActiveChevron: 'text-amber-600',
    feedBorder: 'border-2 border-amber-200/90 shadow-amber-900/5',
    feedPhaseBadge: 'bg-amber-600 text-white',
    feedSubTitle: 'text-amber-600',
    feedCtaBtn: 'bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white',
    stdCodeColor: 'text-amber-700',
    counterBorder: 'border-amber-200/80 hover:border-amber-400',
    counterText: 'text-amber-700',
  },
  6: {
    name: 'rose',
    primary: '#e11d48',
    activeTabClass: 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-900/25 ring-2 ring-rose-400 scale-[1.02]',
    inactiveTabClass: 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900',
    tabBadgeActive: 'bg-white text-rose-950 font-black',
    tabBadgeInactive: 'bg-rose-100 text-rose-800 font-bold',
    phaseBadge: 'bg-rose-600 text-white',
    phaseBadgeSelected: 'bg-rose-700 text-white',
    phaseCardSelected: 'bg-rose-50/25 border-rose-500 shadow-xl ring-2 ring-rose-500/20 scale-[1.01]',
    phaseActiveText: 'text-rose-700',
    phaseActiveChevron: 'text-rose-600',
    feedBorder: 'border-2 border-rose-200/90 shadow-rose-900/5',
    feedPhaseBadge: 'bg-rose-600 text-white',
    feedSubTitle: 'text-rose-600',
    feedCtaBtn: 'bg-rose-50 hover:bg-rose-600 text-rose-900 hover:text-white',
    stdCodeColor: 'text-rose-700',
    counterBorder: 'border-rose-200/80 hover:border-rose-400',
    counterText: 'text-rose-700',
  }
};

// Helper slugify function for keyword detail links
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Từ khóa sản phẩm / dịch vụ nổi bật 2 dòng theo 18 Pha kỹ thuật (chữ thường, chuẩn B2B)
export const PHASE_ORIENTATION_KEYWORDS = {
  "1.1": [
    ["khảo sát địa chất", "báo cáo khả thi FS", "nghiên cứu thị trường", "định hướng đầu tư", "tư vấn tiền khả thi", "quy hoạch dự án"],
    ["đánh giá tác động", "khảo sát hiện trạng", "tư vấn cấu trúc vốn", "định vị KCN phù hợp", "phân tích chuỗi cung ứng"]
  ],
  "1.2": [
    ["pháp lý đầu tư IRC/ERC", "hồ sơ ĐTM môi trường", "giấy phép xây dựng", "thẩm duyệt PCCC", "pháp lý KCN", "thủ tục hải quan"],
    ["tư vấn luật FDI", "chứng nhận phòng cháy", "hồ sơ cấp phép xưởng", "thẩm định quy hoạch 1/500", "đăng ký doanh nghiệp"]
  ],
  "1.3": [
    ["thuê đất KCN", "nhà xưởng xây sẵn RBF", "hạ tầng kỹ thuật KCN", "mặt bằng sản xuất", "kho xưởng RBW", "đất công nghiệp"],
    ["nhà xưởng cao tầng", "đất KCN sinh thái", "hạ tầng điện nước 22kV", "kho bãi ngoại quan", "thuê xưởng tiêu chuẩn"]
  ],
  "2.1": [
    ["thiết kế quy hoạch 1/500", "mô hình BIM", "kiến trúc công nghiệp", "công trình xanh LEED", "thiết kế kết cấu", "quy hoạch mặt bằng"],
    ["tính toán tải trọng", "bản vẽ thi công MEP", "tư vấn LOTUS", "mô phỏng năng lượng", "thiết kế kết cấu thép"]
  ],
  "2.2": [
    ["nhà thép tiền chế", "sàn bê tông Hardener", "thi công xây dựng", "kết cấu chịu lực", "móng cọc xưởng", "khung giàn thép"],
    ["ép cọc bê tông", "lợp mái tôn chống nóng", "sơn chống rỉ kết cấu", "thi công tường bao Panel", "đổ sàn bê tông cốt thép"]
  ],
  "2.3": [
    ["trạm biến áp 22kV", "cơ điện MEP", "PCCC tự động", "điều hòa HVAC", "xử lý nước thải WWTP", "cấp thoát nước xưởng"],
    ["tủ điện phân phối MSB", "hệ thống Sprinkler", "đường ống dẫn khí nén", "chiếu sáng nhà xưởng", "trạm bơm PCCC"]
  ],
  "3.1": [
    ["phòng sạch Cleanroom", "sơn sàn Epoxy", "panel cách nhiệt", "cửa trượt tự động", "hệ thống lọc HEPA", "sàn vinyl ESD"],
    ["phòng sạch Class 1000", "sơn Epoxy tự phẳng", "panel bông khoáng PIR", "buồng thổi khí Air Shower", "hộp trung chuyển Pass Box"]
  ],
  "3.2": [
    ["lắp đặt cẩu trục", "dây chuyền tự động SMT", "căn chỉnh máy CNC", "rigging & line setup", "lắp đặt robot", "băng tải công nghiệp"],
    ["cẩu trục dầm đôi 10T", "định vị máy chính xác", "cân chỉnh laser máy móc", "băng chuyền con lăn", "lắp đặt hệ thống khí nén"]
  ],
  "3.3": [
    ["chạy thử tải SAT/FAT", "đo kiểm rung động", "kiểm định an toàn máy", "nghiệm thu bàn giao", "hiệu chuẩn Quatest", "test áp lực ống"],
    ["kiểm tra không tải", "hiệu chỉnh sensor", "đo độ ồn công nghiệp", "nghiệm thu chạy thử", "biên bản bàn giao thiết bị"]
  ],
  "4.1": [
    ["NVL kim loại & thép", "hạt nhựa & phụ gia", "linh kiện bu lông", "thùng carton 5 lớp", "bao bì màng co", "hóa chất công nghiệp"],
    ["thép tấm SS400", "nhựa nguyên sinh ABS/PP", "ốc vít inox 304", "pallet gỗ ván ép", "màng PE quấn hàng", "hạt hút ẩm"]
  ],
  "4.2": [
    ["gia công CNC chính xác", "khuôn mẫu & đồ gá Jig", "phần mềm MES/SCADA", "bảo trì định kỳ TPM", "lắp ráp linh kiện", "đo kiểm CMM 3D"],
    ["phay tiện CNC 5 trục", "khuôn ép nhựa chính xác", "gia công chi tiết máy", "bảo dưỡng phòng ngừa", "lắp ráp cụm SMT"]
  ],
  "4.3": [
    ["logistics cảng biển", "vận tải container", "cho thuê kho bãi", "pallet gỗ xuất khẩu", "khai báo hải quan", "fulfillment KCN"],
    ["vận chuyển xe tải lạnh", "kho ngoại quan KCN", "cước tàu quốc tế", "dịch vụ bốc xếp hàng hóa", "thủ tục C/O xuất khẩu"]
  ],
  "5.1": [
    ["tuyển dụng lao động KCN", "cung ứng lao động thời vụ", "kỹ sư tự động hóa", "headhunt cấp cao", "đào tạo an toàn", "cung ứng nhân sự"],
    ["tuyển công nhân may", "lao động phổ thông KCN", "đào tạo kỹ năng 5S", "kỹ sư cơ điện MEP", "dịch vụ tính lương Payroll"]
  ],
  "5.2": [
    ["suất ăn công nghiệp", "xe đưa đón công nhân", "quà tặng doanh nghiệp", "văn phòng phẩm", "vệ sinh công nghiệp", "dịch vụ giặt ủi KCN"],
    ["catering chuẩn HACCP", "xe buýt 45 chỗ đưa đón", "cung ứng nước uống văn phòng", "dịch vụ bảo vệ nhà máy", "cây xanh cảnh quan xưởng"]
  ],
  "5.3": [
    ["may đồng phục công nhân", "quần áo ESD phòng sạch", "giày bảo hộ PPE", "nón bảo hộ lao động", "găng tay chống cắt", "kính bảo hộ chuẩn EN"],
    ["đồng phục kỹ sư cao cấp", "áo thun polo công ty", "ủng bảo hộ mũi thép", "dây đai an toàn trên cao", "khẩu trang than hoạt tính"]
  ],
  "6.1": [
    ["mở rộng nhà máy Pha 2", "nâng cấp dây chuyền", "cải tạo công suất", "tăng vốn đầu tư", "xây thêm phân xưởng", "lắp thêm máy móc"],
    ["cơi nới xưởng sản xuất", "tối ưu hóa layout xưởng", "nâng cấp trạm điện xưởng", "tái cấu trúc sản xuất", "mở rộng diện tích kho"]
  ],
  "6.2": [
    ["tư vấn ISO 9001/14001", "tiêu chuẩn ESG xanh", "kiểm kê khí nhà kính", "audit nhà máy FDI", "chứng chỉ CBAM", "chứng nhận RoHS/REACH"],
    ["chứng chỉ IATF 16949", "báo cáo bền vững ESG", "chứng nhận ISO 45001", "kiểm toán năng lượng", "tư vấn tín chỉ Carbon"]
  ],
  "6.3": [
    ["robot tự hành AGV/AMR", "kho thông minh AS/RS", "điện mặt trời 1MWp", "tự động hóa SCADA", "chuyển đổi số IoT", "hệ thống AI Factory"],
    ["hệ thống tay gắp Robot", "cảm biến IoT giám sát", "điện mặt trời áp mái PPA", "phần mềm ERP Cloud", "bảo trì dự đoán AI"]
  ]
};

export default function SixStagesMapPage() {
  const { t, lang } = useLanguage();
  
  // State persistence via localStorage
  const [selectedStageId, setSelectedStageId] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_selected_stage');
      if (saved === 'all') return 'all';
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [selectedPhaseId, setSelectedPhaseId] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_selected_phase');
      return saved || '1.2';
    } catch {
      return '1.2';
    }
  });

  const [isMoUOpen, setIsMoUOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ccu_selected_stage', selectedStageId.toString());
      localStorage.setItem('ccu_selected_phase', selectedPhaseId);
    } catch (e) {
      // ignore
    }
  }, [selectedStageId, selectedPhaseId]);

  // Find parent stage of selected phase
  let currentPhase = null;
  let parentStageOfPhase = stagesData[0];
  for (const s of stagesData) {
    const found = s.phases.find(p => p.id === selectedPhaseId);
    if (found) {
      currentPhase = found;
      parentStageOfPhase = s;
      break;
    }
  }
  if (!currentPhase) {
    currentPhase = stagesData[0].phases[0];
    parentStageOfPhase = stagesData[0];
  }

  const currentStage = selectedStageId === 'all' 
    ? parentStageOfPhase 
    : (stagesData.find(s => s.id === selectedStageId) || stagesData[0]);

  const currentTheme = STAGE_THEMES[currentStage.id] || STAGE_THEMES[1];

  const handleStageChange = (stageId) => {
    setSelectedStageId(stageId);
    if (stageId === 'all') return;
    const targetStage = stagesData.find(s => s.id === stageId);
    if (targetStage && targetStage.phases.length > 0) {
      const phaseInStage = targetStage.phases.some(p => p.id === selectedPhaseId);
      if (!phaseInStage) {
        setSelectedPhaseId(targetStage.phases[0].id);
      }
    }
  };

  // Standards map for the dynamic feed
  const phaseStandardsMap = {
    "1.1": [
      { code: "VCCI-STD-01", name: "Quy chuẩn Khảo sát Thị trường & Khả thi KCN", req: "Bắt buộc" },
      { code: "QCVN 01:2021", name: "Quy chuẩn Kỹ thuật Quốc gia về Quy hoạch", req: "Bắt buộc" },
      { code: "ESG Readiness", name: "Đánh giá sơ bộ tác động môi trường & xã hội", req: "Khuyến nghị" }
    ],
    "1.2": [
      { code: "Luật Đầu tư 2020", name: "Quy định cấp phép đầu tư IRC / ERC cho FDI", req: "Bắt buộc" },
      { code: "QCVN 06:2022/BXD", name: "Quy chuẩn An toàn Cháy cho Nhà & Công trình", req: "Bắt buộc" },
      { code: "ISO 14001:2015", name: "Đánh giá Tác động Môi trường (ĐTM) & Giấy phép", req: "Bắt buộc" },
      { code: "TCVN PCCC", name: "Thẩm duyệt & Nghiệm thu Phòng cháy chữa cháy", req: "Bắt buộc" }
    ],
    "1.3": [
      { code: "TCVN 12870:2020", name: "Quy chuẩn Khu Công Nghiệp Sinh Thái Xanh", req: "Khuyến nghị" },
      { code: "Quy hoạch 1/2000", name: "Mặt bằng KCN đã hoàn thiện hạ tầng kỹ thuật", req: "Bắt buộc" }
    ],
    "2.1": [
      { code: "BIM Level 2", name: "Mô hình hóa thông tin công trình xây dựng", req: "Khuyến nghị" },
      { code: "LEED / LOTUS", name: "Tiêu chuẩn Công trình Xanh Công nghiệp", req: "Khuyến nghị" }
    ],
    "2.2": [
      { code: "TCVN 5574:2018", name: "Tiêu chuẩn Thiết kế Kết cấu Bê tông cốt thép", req: "Bắt buộc" },
      { code: "QCVN 03:2012", name: "Phân cấp Công trình Xây dựng Công nghiệp", req: "Bắt buộc" }
    ],
    "2.3": [
      { code: "Nghị định 136/2020", name: "Hệ thống Báo cháy tự động & Sprinkler", req: "Bắt buộc" },
      { code: "NFPA 13/72", name: "Chuẩn PCCC Quốc tế cho Nhà máy FDI", req: "Khuyến nghị" }
    ],
    "3.1": [
      { code: "ISO 14644-1", name: "Tiêu chuẩn Phòng Sạch Cleanroom Class 100-1000", req: "Bắt buộc" },
      { code: "ASHRAE 90.1", name: "Tiêu chuẩn Hiệu quả Năng lượng Hệ thống HVAC", req: "Khuyến nghị" }
    ],
    "3.2": [
      { code: "JIS / DIN / ASTM", name: "Dung sai Lắp đặt & Căn chỉnh Máy móc", req: "Bắt buộc" },
      { code: "CE Marking", name: "Chứng nhận Tiêu chuẩn Châu Âu cho Dây chuyền", req: "Bắt buộc" }
    ],
    "3.3": [
      { code: "ISO 9001:2015", name: "Quy trình Đo kiểm & Nghiệm thu Bàn giao (SAT)", req: "Bắt buộc" },
      { code: "Hiệu chuẩn Quatest", name: "Kiểm định An toàn Thiết bị Áp lực & Điện", req: "Bắt buộc" }
    ],
    "4.1": [
      { code: "RoHS / REACH", name: "Kiểm soát Hóa chất Nguy hại trong Linh kiện", req: "Bắt buộc" },
      { code: "ASTM / JIS", name: "Chứng chỉ Xuất xưởng CO/CQ Nguyên vật liệu", req: "Bắt buộc" }
    ],
    "4.2": [
      { code: "IATF 16949", name: "Hệ thống Quản lý Chất lượng Ngành Ô tô / Xe máy", req: "Bắt buộc" },
      { code: "IPC-A-610", name: "Tiêu chuẩn Chấp nhận Cụm Bo mạch Điện tử", req: "Bắt buộc" },
      { code: "Dung sai ±0.005mm", name: "Kiểm định Đo lường Tọa độ CMM 3D", req: "Bắt buộc" }
    ],
    "4.3": [
      { code: "ISO 22000 / HACCP", name: "Bao bì Tiếp xúc Thực phẩm An toàn", req: "Bắt buộc" },
      { code: "FSC Certified", name: "Chứng chỉ Nguồn gốc Gỗ / Thùng Carton Bền vững", req: "Khuyến nghị" }
    ],
    "5.1": [
      { code: "ISO 28000:2007", name: "Hệ thống Quản lý An ninh Chuỗi Cung ứng", req: "Bắt buộc" },
      { code: "FIATA / IATA", name: "Tiêu chuẩn Vận tải & Logistics Đa phương thức", req: "Bắt buộc" }
    ],
    "5.2": [
      { code: "OEKO-TEX 100", name: "An toàn Sinh thái Đồng phục & Đồ bảo hộ", req: "Bắt buộc" },
      { code: "HACCP / ISO 22000", name: "Chứng nhận An toàn Vệ sinh Thực phẩm Suất ăn", req: "Bắt buộc" }
    ],
    "5.3": [
      { code: "Big4 Audit Ready", name: "Chuẩn mực Kế toán & Thuế Doanh nghiệp FDI", req: "Bắt buộc" },
      { code: "Luật Lao động 2019", name: "Tuân thủ Quy chế Nhân sự & Bảo hiểm", req: "Bắt buộc" }
    ],
    "6.1": [
      { code: "SCADA / Industry 4.0", name: "Chuẩn Kết nối Tự động hóa & Đo lường OEE", req: "Khuyến nghị" },
      { code: "TPM / 5S", name: "Hệ thống Bảo trì Năng suất Toàn diện", req: "Bắt buộc" }
    ],
    "6.2": [
      { code: "ISO 14064", name: "Kiểm kê Khí nhà kính & Báo cáo Phát thải Scope 1-2", req: "Bắt buộc" },
      { code: "CBAM / ESG Matrix", name: "Cơ chế Điều chỉnh Biên giới Carbon Quốc tế", req: "Khuyến nghị" }
    ],
    "6.3": [
      { code: "M&A Industrial Standard", name: "Thẩm định Pháp lý & Tài chính Mở rộng", req: "Bắt buộc" },
      { code: "Chuyển giao Công nghệ", name: "Đăng ký Sở hữu Trí tuệ & Bằng Sáng chế", req: "Bắt buộc" }
    ]
  };

  const currentStandards = phaseStandardsMap[selectedPhaseId] || phaseStandardsMap["1.2"];

  // Verified VIP Suppliers for the dynamic feed
  const vipSuppliers = [
    {
      id: 1,
      name: "Tập Đoàn Đầu Tư & Phát Triển KCN DEEP C",
      badge: "Kim Cương 💎",
      badgeCol: "bg-blue-100 text-blue-800 border-blue-300",
      roles: ["Chủ đầu tư KCN", "Pha 1.3", "Pha 2.1"],
      verifiedISO: ["ISO 14001", "Eco-IP Standard", "VCCI Member"],
      location: "Hải Phòng & Quảng Ninh",
      verifiedRevenue: "500+ Triệu USD"
    },
    {
      id: 2,
      name: "Công Ty Tư Vấn Pháp Lý & Đầu Tư VietAn Law",
      badge: "Vàng 🥇",
      badgeCol: "bg-amber-100 text-amber-900 border-amber-300",
      roles: ["Tư vấn cấp phép FDI", "Pha 1.2", "PCCC"],
      verifiedISO: ["Luật sư Đoàn VN", "ERP Connected", "VCCI Certified"],
      location: "Hà Nội & TP.HCM",
      verifiedRevenue: "150+ Dự án FDI"
    },
    {
      id: 3,
      name: "Mạng Lưới Logistics Quốc Tế PORTALINK",
      badge: "Kim Cương 💎",
      badgeCol: "bg-blue-100 text-blue-800 border-blue-300",
      roles: ["Thông quan & Kho bãi", "Pha 5.1", "Pha 1.2"],
      verifiedISO: ["ISO 28000", "FIATA Standard", "Hải quan điện tử"],
      location: "Bình Dương, Hải Phòng, Bắc Ninh",
      verifiedRevenue: "2.400+ Container/Tháng"
    },
    {
      id: 4,
      name: "Hệ Thống Sản Xuất Chuyên Gia Đồng Phục",
      badge: "Vàng 🥇",
      badgeCol: "bg-amber-100 text-amber-900 border-amber-300",
      roles: ["Đồng phục & PPE", "Pha 5.2", "ESG Supply"],
      verifiedISO: ["OEKO-TEX 100", "ISO 9001:2015", "ERP VIP"],
      location: "TP.HCM & Bình Dương",
      verifiedRevenue: "50.000+ Bộ/Tháng"
    },
    {
      id: 5,
      name: "Công Ty Cơ Khí Chính Xác Tiến Bộ CNC",
      badge: "Kim Cương 💎",
      badgeCol: "bg-blue-100 text-blue-800 border-blue-300",
      roles: ["Gia công Jig & Khuôn", "Pha 4.2", "Bán dẫn"],
      verifiedISO: ["IATF 16949", "CMM ±0.005mm", "Samsung Tier 1"],
      location: "Bắc Ninh & Thái Nguyên",
      verifiedRevenue: "1.200+ Tỷ VNĐ"
    }
  ];

  // Render individual Phase Card with 2-row Marquee Animation
  const renderPhaseCard = (phase, stageTheme) => {
    const isSelected = phase.id === selectedPhaseId;
    const rawKeywords = PHASE_ORIENTATION_KEYWORDS[phase.id] || [];
    const row1 = Array.isArray(rawKeywords[0]) ? rawKeywords[0] : rawKeywords.slice(0, Math.ceil(rawKeywords.length / 2));
    const row2 = Array.isArray(rawKeywords[1]) ? rawKeywords[1] : rawKeywords.slice(Math.ceil(rawKeywords.length / 2));

    const repeatedRow1 = [...row1, ...row1, ...row1];
    const repeatedRow2 = [...row2, ...row2, ...row2];

    return (
      <div
        key={phase.id}
        onClick={() => setSelectedPhaseId(phase.id)}
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group ${
          isSelected
            ? stageTheme.phaseCardSelected
            : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-xs hover:border-slate-300'
        }`}
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className={`font-mono font-black text-xs px-2.5 py-1 rounded shadow-xs ${
              isSelected ? stageTheme.phaseBadgeSelected : stageTheme.phaseBadge
            }`}>
              Pha {phase.id}
            </span>
            <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
              isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {phase.totalEnterprises || 80}+ DN Xác Thực
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-[#072348] uppercase font-heading leading-snug">
            {lang === 'en' ? phase.titleEn : phase.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {lang === 'en' ? phase.summaryEn : phase.summary}
          </p>

          {/* TỪ KHÓA SẢN PHẨM / DỊCH VỤ NỔI BẬT - 2 DÒNG MARQUEE CHẠY CHẬM MƯỢT CÓ HOVER VÀ LINK DATABASE */}
          <div className="pt-2 border-t border-slate-100/90 space-y-1.5">
            <div className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500 font-heading text-center">
              {lang === 'en' ? 'FEATURED PRODUCTS / SERVICES:' : 'TỪ KHÓA SẢN PHẨM / DỊCH VỤ NỔI BẬT:'}
            </div>

            <div className="relative overflow-hidden w-full space-y-1.5 py-0.5">
              {/* Left & Right Edge Blur Fade Overlays */}
              <div className={`pointer-events-none absolute inset-y-0 left-0 w-5 z-10 bg-gradient-to-r ${isSelected ? 'from-purple-50/90' : 'from-white'} to-transparent`} />
              <div className={`pointer-events-none absolute inset-y-0 right-0 w-5 z-10 bg-gradient-to-l ${isSelected ? 'from-purple-50/90' : 'from-white'} to-transparent`} />

              {/* Marquee Row 1 (Slow Left) */}
              <div className="flex overflow-hidden py-0.5">
                <div className="animate-marquee-slow-left flex items-center space-x-1.5">
                  {repeatedRow1.map((kw, kwIdx) => {
                    const kwSlug = slugify(kw);
                    return (
                      <Link
                        key={`r1-${kwIdx}`}
                        to={`/tu-khoa/${kwSlug}?q=${encodeURIComponent(kw)}`}
                        onClick={(e) => e.stopPropagation()}
                        title={`Tra cứu doanh nghiệp & tiêu chuẩn: ${kw}`}
                        className={`text-[9.5px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-200 inline-flex items-center shadow-2xs hover:scale-105 active:scale-95 flex-shrink-0 ${
                          isSelected
                            ? 'bg-purple-100/90 text-purple-900 border border-purple-200/90 font-semibold hover:bg-purple-600 hover:text-white hover:border-purple-600'
                            : 'bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                        }`}
                      >
                        #{kw}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Marquee Row 2 (Slow Right) */}
              <div className="flex overflow-hidden py-0.5">
                <div className="animate-marquee-slow-right flex items-center space-x-1.5">
                  {repeatedRow2.map((kw, kwIdx) => {
                    const kwSlug = slugify(kw);
                    return (
                      <Link
                        key={`r2-${kwIdx}`}
                        to={`/tu-khoa/${kwSlug}?q=${encodeURIComponent(kw)}`}
                        onClick={(e) => e.stopPropagation()}
                        title={`Tra cứu doanh nghiệp & tiêu chuẩn: ${kw}`}
                        className={`text-[9.5px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-200 inline-flex items-center shadow-2xs hover:scale-105 active:scale-95 flex-shrink-0 ${
                          isSelected
                            ? 'bg-purple-100/90 text-purple-900 border border-purple-200/90 font-semibold hover:bg-purple-600 hover:text-white hover:border-purple-600'
                            : 'bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                        }`}
                      >
                        #{kw}
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
          <span className={isSelected ? stageTheme.phaseActiveText : 'text-slate-400'}>
            {isSelected ? '● Đang mở dòng khớp lệnh' : 'Bấm để tra cứu chi tiết'}
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? `${stageTheme.phaseActiveChevron} rotate-90` : 'text-slate-400'}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-28 bg-slate-50/70 font-sans overflow-x-hidden">
      
      {/* 0. LIVE MATCH TICKER STREAM */}
      <LiveMatchTicker />

      {/* 1. HERO HEADER (BẢNG CHỈ HUY QUỐC GIA) */}
      <section className="relative overflow-hidden pt-6 pb-6 sm:pt-8 sm:pb-8 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 border-b border-slate-200">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 sm:space-y-6">
          
          {/* Breadcrumb & National Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
              <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
                <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
              </Link>
              <span>&gt;</span>
              <span className="text-[#072348] font-black font-heading uppercase">Sa Bàn 6 Giai Đoạn & 18 Pha</span>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900 text-amber-300 text-xs font-black uppercase font-heading border border-amber-400/40 shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Sa Bàn Chuỗi Cung Ứng Chuẩn ISO Quốc Gia</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center max-w-4xl mx-auto space-y-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072348] tracking-normal uppercase font-heading leading-tight">
              <span>BẢN ĐỒ CHUỖI CUNG ỨNG QUỐC GIA </span>
              <span className="text-rainbow-gradient">THEO 6 GIAI ĐOẠN & 18 PHA</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Hệ thống sa bàn điều phối dòng chảy năng lực sản xuất, kết nối chính xác Nhà máy FDI, KCN và Nhà cung cấp B2B đã qua thẩm định 3 Lớp.
            </p>
          </div>

          {/* 3 COUNTER ANIMATION METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-purple-200/80 shadow-md text-center space-y-1 hover:border-purple-400 transition">
              <span className="text-3xl sm:text-4xl font-black text-purple-700 font-mono">6</span>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase font-heading">Giai Đoạn Vòng Đời</div>
              <div className="text-[11px] text-slate-500">Chuẩn hóa tuần tự khép kín</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-200/80 shadow-md text-center space-y-1 hover:border-emerald-400 transition">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">18</span>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase font-heading">Pha Kỹ Thuật</div>
              <div className="text-[11px] text-slate-500">Định vị rõ ràng đầu ra & chuẩn ISO</div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-blue-200/80 shadow-md text-center space-y-1 hover:border-blue-400 transition">
              <span className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">24.000+</span>
              <div className="text-xs sm:text-sm font-black text-slate-900 uppercase font-heading">Doanh Nghiệp Đã Xác Thực</div>
              <div className="text-[11px] text-slate-500">Thẩm định qua 3 Lớp KYC B2B</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MACRO VIEW (STICKY HORIZONTAL PROCESS FLOW - TAB TẤT CẢ(6 GĐ) + 6 GIAI ĐOẠN) */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/90 shadow-sm py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
            
            {/* TAB TẤT CẢ (18 PHA) */}
            <button
              type="button"
              onClick={() => handleStageChange('all')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[12.5px] font-black uppercase font-heading whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                selectedStageId === 'all'
                  ? 'bg-gradient-to-r from-slate-900 to-blue-950 text-amber-300 shadow-md shadow-slate-900/25 ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] ${
                selectedStageId === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700 font-bold'
              }`}>
                ★
              </span>
              <span>{lang === 'en' ? 'ALL (6 STAGES)' : 'TẤT CẢ(6 GĐ)'}</span>
            </button>

            {stagesData.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              const theme = STAGE_THEMES[stage.id] || STAGE_THEMES[1];
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageChange(stage.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-[12.5px] font-black uppercase font-heading whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? theme.activeTabClass
                      : theme.inactiveTabClass
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] ${
                    isSelected ? theme.tabBadgeActive : theme.tabBadgeInactive
                  }`}>
                    {stage.id}
                  </span>
                  <span>{lang === 'en' ? stage.titleEn : stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MICRO VIEW (18 PHA CARDS & ACCORDION TABS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className={`text-[11px] font-black uppercase tracking-wider font-heading ${currentTheme.feedSubTitle}`}>
              {selectedStageId === 'all' ? 'Toàn Cảnh 6 Giai Đoạn & 18 Pha Kỹ Thuật' : `Giai Đoạn ${currentStage.id}: ${lang === 'en' ? currentStage.titleEn : currentStage.title}`}
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#072348] uppercase font-heading">
              Chọn Pha Kỹ Thuật Để Tra Cứu Bộ Tiêu Chuẩn & Doanh Nghiệp Khớp Lệnh
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:block">
            {selectedStageId === 'all' ? '18 Pha Kỹ Thuật Khép Kín' : '3 Pha Kỹ Thuật Phân Cấp'}
          </span>
        </div>

        {/* Phase Cards View: Render All 6 Stages or Single Stage */}
        {selectedStageId === 'all' ? (
          <div className="space-y-8">
            {stagesData.map((stage) => {
              const stageTheme = STAGE_THEMES[stage.id] || STAGE_THEMES[1];
              return (
                <div key={stage.id} className="space-y-3 bg-white/60 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-black text-white ${stageTheme.phaseBadge}`}>
                        {stage.id}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#072348] uppercase font-heading">
                        Giai Đoạn {stage.id}: {lang === 'en' ? stage.titleEn : stage.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      3 Pha Kỹ Thuật
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stage.phases.map((phase) => renderPhaseCard(phase, stageTheme))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStage.phases.map((phase) => renderPhaseCard(phase, currentTheme))}
          </div>
        )}

      </section>

      {/* 4. DYNAMIC FEED (BẢNG KHỚP LỆNH THỰC CHIẾN 2 CỘT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div className={`bg-white rounded-3xl ${currentTheme.feedBorder} p-6 sm:p-8 space-y-6 shadow-xl`}>
          
          {/* Feed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className={`w-10 h-10 rounded-2xl ${currentTheme.feedPhaseBadge} flex items-center justify-center font-mono font-black text-sm shadow-md`}>
                {currentPhase.id}
              </span>
              <div>
                <div className={`text-[10.5px] font-extrabold uppercase tracking-wider font-heading ${currentTheme.feedSubTitle}`}>
                  KHUNG KHỚP LỆNH NĂNG LỰC THỰC CHIẾN
                </div>
                <h3 className="text-base sm:text-xl font-black text-[#072348] uppercase font-heading">
                  {currentPhase.title}
                </h3>
              </div>
            </div>

            <Link
              to={`/giai-doan/${currentStage.id}/pha/${currentPhase.id}`}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase font-heading tracking-wide transition shadow-2xs ${currentTheme.feedCtaBtn}`}
            >
              <span>Xem Toàn Bộ {currentPhase.totalEnterprises || 80}+ Nhà Cung Cấp</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2 Columns: Left = Standards & ESG, Right = Verified VIP Suppliers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Cột Trái (5 Cols): Bộ Tiêu Chuẩn Kỹ Thuật / ESG Bắt Buộc */}
            <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className={`w-4 h-4 ${currentTheme.stdCodeColor}`} />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-heading">
                    Tiêu Chuẩn Kỹ Thuật & ESG Bắt Buộc
                  </h4>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  FDI Criteria
                </span>
              </div>

              <div className="space-y-2.5">
                {currentStandards.map((std, sIdx) => (
                  <div key={sIdx} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono font-black text-xs ${currentTheme.stdCodeColor}`}>{std.code}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        std.req === 'Bắt buộc' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {std.req}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium leading-snug">
                      {std.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/dang-nhu-cau"
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold font-heading uppercase flex items-center justify-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Checklist Nghiệm Thu Pha {currentPhase.id}</span>
                </Link>
              </div>
            </div>

            {/* Cột Phải (7 Cols): Danh Sách Nhà Cung Cấp VIP Đã Gắn Huy Hiệu */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase font-heading">
                    Nhà Cung Cấp VIP Sẵn Sàng Nhận Khớp Lệnh
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-slate-500 font-mono">
                  Ưu Tiên Top 1% KYC
                </span>
              </div>

              <div className="space-y-3">
                {vipSuppliers.slice(0, 3).map((supp) => (
                  <div
                    key={supp.id}
                    className="p-4 rounded-2xl bg-white hover:bg-blue-50/40 border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <h5 className="font-extrabold text-[#072348] text-xs sm:text-sm font-heading leading-tight">
                          {supp.name}
                        </h5>
                      </div>
                      <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${supp.badgeCol} flex-shrink-0`}>
                        {supp.badge}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {supp.verifiedISO.map((iso, iIdx) => (
                        <span key={iIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          ✔ {iso}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Khu vực: <strong>{supp.location}</strong></span>
                      <span>Quy mô: <strong className="text-emerald-700 font-mono">{supp.verifiedRevenue}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 5. 3D EXPLODED FLOWER VIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#072348] uppercase font-heading">
            Sa Bàn Tương Tác 3D Toàn Cảnh 6 Giai Đoạn
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Xem tổng thể liên kết giữa các giai đoạn và chuyển động của dòng chảy giá trị công nghiệp.
          </p>
        </div>
        <InteractiveExplodedFlower3D />
      </section>

      {/* 6. QUY TRÌNH XÁC THỰC 3 LỚP (KYC B2B) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ThreeLayerKYCSection />
      </section>

      {/* 7. CASE STUDIES / THỰC CHỨNG TÍCH HỢP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CaseStudiesSection />
      </section>

      {/* 8. STICKY FLOATING CTA BAR */}
      <StickyPhaseCTA activePhase={currentPhase} activeStage={currentStage} />

      {/* MODAL XEM CHI TIẾT VĂN BẢN BẢO TRỢ / MOU */}
      <MoUModal isOpen={isMoUOpen} onClose={() => setIsMoUOpen(false)} />

    </div>
  );
}
