import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, MapPin, Building2, CheckCircle2,
  ChevronRight, ArrowRight, RotateCcw, ShieldCheck, Award, Layers,
  Phone, Globe, Mail, ExternalLink, Factory, Cpu, Wrench, Truck, 
  Leaf, Sparkles, Check, ChevronDown, Flame, Zap, Clock, Tag,
  ChevronLeft, ArrowUp, Plus, LayoutGrid, ArrowUpCircle, ArrowDownCircle,
  Compass, HardHat, PackageCheck, Boxes, MessageCircle, FileSearch, HelpCircle,
  Users, RefreshCw, BarChart3, Settings
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
  getCategoryBannerImage 
} from '../utils/companyUtils';
import SupplierTopNavigationBlocks from '../components/SupplierTopNavigationBlocks';

// Default full index letter counts matching exact database (21,680 items)
const DEFAULT_LETTER_COUNTS = {
  A: 415,
  B: 1605,
  C: 2711,
  D: 3427,
  E: 214,
  F: 125,
  G: 1289,
  H: 837,
  I: 130,
  K: 1857,
  L: 410,
  M: 1757,
  N: 897,
  O: 0,
  P: 809,
  Q: 166,
  R: 169,
  S: 651,
  T: 2885,
  U: 0,
  V: 763,
  W: 38,
  X: 525,
  Y: 0,
  Z: 0
};

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

// Rich Taxonomy Map: Suggested Industry Categories & Keywords with exact supplier counts for each of the 18 Phases
const PHASE_TAXONOMY_MAP = {
  "1.1": {
    categories: [
      { nameVi: "Khảo sát Địa hình & Địa chất", nameEn: "Topographic & Geological Survey", query: "Khảo sát địa hình" },
      { nameVi: "Tư vấn Chiến lược Đầu tư & FS", nameEn: "Investment Advisory & FS Report", query: "Tư vấn đầu tư" },
      { nameVi: "Nghiên cứu Thị trường Công nghiệp", nameEn: "Industrial Market Research", query: "Nghiên cứu thị trường" },
      { nameVi: "Quy hoạch Dự án & Khả thi", nameEn: "Project Planning & Feasibility", query: "Quy hoạch" },
      { nameVi: "Thẩm định Giá & Dự toán Dự án", nameEn: "Project Valuation & Estimation", query: "Thẩm định giá" }
    ],
    keywords: [
      { labelVi: "Đo đạc trắc địa", labelEn: "Geodetic survey", query: "Trắc địa", count: 42 },
      { labelVi: "Khoan khảo sát địa chất", labelEn: "Geological drilling", query: "Khảo sát địa chất", count: 56 },
      { labelVi: "Lập báo cáo FS khả thi", labelEn: "Feasibility study", query: "Báo cáo khả thi", count: 28 },
      { labelVi: "Quy hoạch 1/500", labelEn: "Master plan 1/500", query: "Quy hoạch 1/500", count: 32 },
      { labelVi: "Định giá đất KCN", labelEn: "IP land valuation", query: "Định giá đất", count: 24 },
      { labelVi: "Tư vấn tiền khả thi", labelEn: "Pre-feasibility study", query: "Tiền khả thi", count: 40 }
    ]
  },
  "1.2": {
    categories: [
      { nameVi: "Tư vấn Pháp lý Doanh nghiệp FDI", nameEn: "Corporate & FDI Legal Advisory", query: "Tư vấn pháp lý" },
      { nameVi: "Tư vấn Môi trường & Lập ĐTM", nameEn: "Environmental Advisory & EIA", query: "ĐTM" },
      { nameVi: "Cấp phép Xây dựng & Giấy phép IRC", nameEn: "Building Permit & IRC Licensing", query: "Giấy phép xây dựng" },
      { nameVi: "Thẩm duyệt Thiết kế PCCC Cơ sở", nameEn: "Fire Safety Design Approval", query: "Thẩm duyệt PCCC" }
    ],
    keywords: [
      { labelVi: "Báo cáo ĐTM môi trường", labelEn: "EIA report", query: "Báo cáo ĐTM", count: 65 },
      { labelVi: "Giấy phép đầu tư IRC", labelEn: "IRC certificate", query: "Giấy chứng nhận đầu tư", count: 82 },
      { labelVi: "Giấy phép môi trường GPMT", labelEn: "Environmental permit", query: "Giấy phép môi trường", count: 52 },
      { labelVi: "Thẩm duyệt PCCC nhà xưởng", labelEn: "Factory fire approval", query: "Thẩm duyệt PCCC", count: 70 },
      { labelVi: "Tư vấn luật DN FDI", labelEn: "FDI legal consultant", query: "Luật doanh nghiệp", count: 75 }
    ]
  },
  "1.3": {
    categories: [
      { nameVi: "Khu Công Nghiệp & Cụm Công Nghiệp", nameEn: "Industrial Parks & Clusters", query: "Khu công nghiệp" },
      { nameVi: "Cho thuê Đất Công nghiệp & Nhà xưởng", nameEn: "Industrial Land & Ready-Built Factory", query: "Cho thuê nhà xưởng" },
      { nameVi: "Bất Động Sản Công Nghiệp & Kho Bãi", nameEn: "Industrial Real Estate & Warehouses", query: "Bất động sản công nghiệp" },
      { nameVi: "Dịch vụ Môi giới Mặt bằng KCN", nameEn: "IP Site Brokerage Services", query: "Mặt bằng KCN" }
    ],
    keywords: [
      { labelVi: "Thuê đất KCN", labelEn: "IP land lease", query: "Thuê đất KCN", count: 92 },
      { labelVi: "Nhà xưởng xây sẵn (RBF)", labelEn: "Ready-built factory", query: "Nhà xưởng xây sẵn", count: 115 },
      { labelVi: "Nhà kho xây sẵn (RBW)", labelEn: "Ready-built warehouse", query: "Nhà kho xây sẵn", count: 82 },
      { labelVi: "Đất KCN Bình Dương", labelEn: "Binh Duong IP land", query: "KCN Bình Dương", count: 60 },
      { labelVi: "Đất KCN Bắc Ninh", labelEn: "Bac Ninh IP land", query: "KCN Bắc Ninh", count: 55 },
      { labelVi: "Đất KCN Đồng Nai", labelEn: "Dong Nai IP land", query: "KCN Đồng Nai", count: 64 }
    ]
  },
  "2.1": {
    categories: [
      { nameVi: "Thiết kế Kiến trúc & Kết cấu Nhà xưởng", nameEn: "Architectural & Structural Design", query: "Thiết kế nhà xưởng" },
      { nameVi: "Thiết kế Cơ điện MEP & HVAC", nameEn: "MEP & HVAC Engineering Design", query: "Thiết kế MEP" },
      { nameVi: "Tư vấn Phòng sạch Cleanroom & Kho lạnh", nameEn: "Cleanroom & Cold Storage Design", query: "Phòng sạch" },
      { nameVi: "Mô hình Thông tin Công trình BIM 3D", nameEn: "BIM 3D Modeling", query: "BIM" }
    ],
    keywords: [
      { labelVi: "Bản vẽ thiết kế MEP", labelEn: "MEP shop drawings", query: "Bản vẽ MEP", count: 45 },
      { labelVi: "Tính toán tải nhiệt HVAC", labelEn: "HVAC thermal load", query: "Tải nhiệt HVAC", count: 70 },
      { labelVi: "Thiết kế phòng sạch GMP", labelEn: "GMP cleanroom design", query: "Phòng sạch GMP", count: 48 },
      { labelVi: "Hệ thống điện 3 pha công nghiệp", labelEn: "3-phase power design", query: "Điện công nghiệp", count: 82 },
      { labelVi: "Thiết kế trạm biến áp", labelEn: "Substation design", query: "Trạm biến áp", count: 45 }
    ]
  },
  "2.2": {
    categories: [
      { nameVi: "Tổng thầu Xây dựng Công nghiệp (EPC)", nameEn: "EPC General Contractor & Construction", query: "Xây dựng công nghiệp" },
      { nameVi: "Kết cấu Thép & Nhà thép Tiền chế", nameEn: "Steel Structures & Pre-engineered Buildings", query: "Kết cấu thép" },
      { nameVi: "Thi công Sàn Epoxy & Bê tông Mài", nameEn: "Epoxy Flooring & Polished Concrete", query: "Sơn sàn Epoxy" },
      { nameVi: "Vách Panel Cách nhiệt & Chống cháy", nameEn: "Insulated & Fire-rated Panels", query: "Panel" }
    ],
    keywords: [
      { labelVi: "Nhà thép tiền chế Zamil", labelEn: "Pre-engineered steel building", query: "Nhà thép tiền chế", count: 135 },
      { labelVi: "Gia công kết cấu thép", labelEn: "Steel structure fabrication", query: "Gia công kết cấu thép", count: 110 },
      { labelVi: "Sơn sàn Epoxy kháng hóa chất", labelEn: "Chemical-resistant epoxy", query: "Sơn epoxy", count: 72 },
      { labelVi: "Panel EPS / PU / Rockwool", labelEn: "Insulation panel", query: "Panel cách nhiệt", count: 95 },
      { labelVi: "Bê tông xoa nền Hardener", labelEn: "Concrete floor hardener", query: "Xoa nền bê tông", count: 55 }
    ]
  },
  "2.3": {
    categories: [
      { nameVi: "Thi công Hệ thống PCCC & Báo cháy", nameEn: "Fire Safety & Auto Alarm Systems", query: "PCCC" },
      { nameVi: "Trạm Biến Áp & Máy Phát Điện Công Nghiệp", nameEn: "Substations & Generators", query: "Trạm biến áp" },
      { nameVi: "Xử lý Nước thải & Cấp thoát nước KCN", nameEn: "Wastewater Treatment & Water Supply", query: "Xử lý nước thải" },
      { nameVi: "Hệ thống Thông gió & Chiếu sáng Công nghiệp", nameEn: "Industrial Ventilation & Lighting", query: "Thông gió" }
    ],
    keywords: [
      { labelVi: "Hệ thống Sprinkler PCCC", labelEn: "Sprinkler system", query: "Sprinkler", count: 92 },
      { labelVi: "Bình chữa cháy khí CO2/FM200", labelEn: "CO2/FM200 gas system", query: "Khí FM200", count: 98 },
      { labelVi: "Trạm biến áp 110kV/22kV", labelEn: "Substation 110kV/22kV", query: "Trạm biến áp 22kV", count: 68 },
      { labelVi: "Bể xử lý nước thải công nghiệp", labelEn: "Industrial wastewater tank", query: "Bể xử lý nước thải", count: 75 },
      { labelVi: "Kim thu sét tia tiên đạo", labelEn: "Early streamer lightning rod", query: "Kim thu sét", count: 42 }
    ]
  },
  "3.1": {
    categories: [
      { nameVi: "Máy móc Cơ khí Chính xác & Máy CNC", nameEn: "Precision Machine Tools & CNC", query: "Máy CNC" },
      { nameVi: "Dây chuyền Sản xuất & Băng tải Tự động", nameEn: "Assembly Lines & Conveyor Systems", query: "Dây chuyền sản xuất" },
      { nameVi: "Máy Ép Nhựa & Khuôn mẫu Công nghiệp", nameEn: "Plastic Injection Machines & Molds", query: "Máy ép nhựa" },
      { nameVi: "Dịch vụ Nâng hạ & Lắp đặt Máy nặng", nameEn: "Heavy Machinery Rigging Services", query: "Nâng hạ máy móc" }
    ],
    keywords: [
      { labelVi: "Máy phay CNC 5 trục", labelEn: "5-axis CNC milling", query: "Máy phay CNC", count: 115 },
      { labelVi: "Máy tiện CNC Mazak/Doosan", labelEn: "CNC lathe machine", query: "Máy tiện CNC", count: 85 },
      { labelVi: "Cẩu kéo nâng hạ máy nặng", labelEn: "Heavy machinery rigging", query: "Nâng hạ máy móc", count: 72 },
      { labelVi: "Băng tải con lăn công nghiệp", labelEn: "Roller conveyor", query: "Băng tải", count: 68 },
      { labelVi: "Máy cắt Laser Fiber 12kW", labelEn: "Fiber laser cutter", query: "Cắt laser fiber", count: 58 }
    ]
  },
  "3.2": {
    categories: [
      { nameVi: "Thi công Phòng sạch Cleanroom Class 100-100k", nameEn: "Cleanroom Setup Class 100-100k", query: "Phòng sạch" },
      { nameVi: "Hệ thống Khí nén & Máy nén khí Trục vít", nameEn: "Pneumatic & Screw Compressors", query: "Máy nén khí" },
      { nameVi: "Nội thất & Bàn thao tác Công nghiệp", nameEn: "Industrial Workbenches & Furniture", query: "Bàn thao tác" },
      { nameVi: "Vạch kẻ Layout 5S & Bảng biển Nhà xưởng", nameEn: "5S Floor Marking & Signs", query: "Biển báo 5S" }
    ],
    keywords: [
      { labelVi: "Panel phòng sạch GMP", labelEn: "GMP cleanroom panel", query: "Phòng sạch GMP", count: 85 },
      { labelVi: "Máy nén khí trục vít Atlas Copco", labelEn: "Screw air compressor", query: "Máy nén khí trục vít", count: 78 },
      { labelVi: "Bàn thao tác inox chống tĩnh điện", labelEn: "ESD stainless workbench", query: "Bàn thao tác chống tĩnh điện", count: 68 },
      { labelVi: "Hệ thống AHU xử lý khí", labelEn: "AHU air handling unit", query: "AHU phòng sạch", count: 45 },
      { labelVi: "Sơn kẻ vạch layout 5S xưởng", labelEn: "5S floor layout painting", query: "Kẻ vạch 5S", count: 62 }
    ]
  },
  "3.3": {
    categories: [
      { nameVi: "Kiểm định An toàn Thiết bị & Cầu trục", nameEn: "Safety Inspection & Cranes", query: "Kiểm định an toàn" },
      { nameVi: "Hiệu chuẩn Thiết bị Đo lường & Phòng Lab", nameEn: "Calibration & Metrology Lab", query: "Hiệu chuẩn" },
      { nameVi: "Nghiệm thu PCCC & Đo kiểm Môi trường", nameEn: "Commissioning & Environmental Testing", query: "Quan trắc môi trường" },
      { nameVi: "Chứng nhận Tiêu chuẩn Chất lượng ISO", nameEn: "ISO Standards Certification", query: "Chứng nhận ISO" }
    ],
    keywords: [
      { labelVi: "Kiểm định xe nâng & Cầu trục", labelEn: "Forklift & crane inspection", query: "Kiểm định xe nâng", count: 82 },
      { labelVi: "Đo kiểm điện trở tiếp địa", labelEn: "Ground resistance test", query: "Điện trở tiếp địa", count: 45 },
      { labelVi: "Hiệu chuẩn nhiệt kế & Áp kế", labelEn: "Thermometer & gauge calibration", query: "Hiệu chuẩn áp kế", count: 58 },
      { labelVi: "Kiểm định bình chịu áp lực", labelEn: "Pressure vessel inspection", query: "Bình chịu áp lực", count: 70 },
      { labelVi: "Thử tải tĩnh kết cấu sàn xưởng", labelEn: "Structural load testing", query: "Thử tải kết cấu", count: 42 }
    ]
  },
  "4.1": {
    categories: [
      { nameVi: "Hạt nhựa Nguyên sinh, Tái sinh & Phụ gia", nameEn: "Plastic Resin & Masterbatch", query: "Hạt nhựa" },
      { nameVi: "Thép tấm, Thép cuộn & Kim loại Màu", nameEn: "Steel Coils, Plates & Non-ferrous", query: "Thép" },
      { nameVi: "Hóa chất Công nghiệp & Dung môi Pha sơn", nameEn: "Industrial Chemicals & Solvents", query: "Hóa chất" },
      { nameVi: "Bao bì Thùng Carton, Màng PE & Pallet", nameEn: "Carton Packaging, PE Film & Pallets", query: "Bao bì" },
      { nameVi: "Linh kiện Đột dập & Bu lông Ốc vít", nameEn: "Stamped Parts & Fasteners", query: "Bu lông ốc vít" }
    ],
    keywords: [
      { labelVi: "Hạt nhựa PP / ABS / PC / POM", labelEn: "PP / ABS plastic granules", query: "Hạt nhựa PP", count: 140 },
      { labelVi: "Thép không gỉ Inox 304 / 316", labelEn: "Stainless steel 304/316", query: "Inox 304", count: 130 },
      { labelVi: "Dung môi công nghiệp Toluen/Acetone", labelEn: "Industrial solvents", query: "Dung môi", count: 65 },
      { labelVi: "Thùng carton 3 lớp, 5 lớp sóng", labelEn: "Corrugated carton box", query: "Thùng carton", count: 120 },
      { labelVi: "Màng quấn Pallet Stretch Film", labelEn: "Stretch wrap film", query: "Màng PE quấn pallet", count: 98 }
    ]
  },
  "4.2": {
    categories: [
      { nameVi: "Gia công Cơ khí Chính xác CNC & JIG", nameEn: "CNC Precision Machining & JIGs", query: "Gia công cơ khí" },
      { nameVi: "Dầu nhờn & Mỡ bôi trơn Công nghiệp", nameEn: "Industrial Lubricants & Grease", query: "Dầu nhờn" },
      { nameVi: "Xi mạ Kẽm, Mạ Niken & Sơn Tĩnh Điện", nameEn: "Galvanizing, Plating & Powder Coating", query: "Sơn tĩnh điện" },
      { nameVi: "Thiết bị Đo kiểm Chất lượng QA/QC", nameEn: "QA/QC Inspection Instruments", query: "Dụng cụ đo lường" }
    ],
    keywords: [
      { labelVi: "Phay tiện chi tiết cơ khí chính xác", labelEn: "Precision CNC turning & milling", query: "Gia công phay CNC", count: 160 },
      { labelVi: "Xi mạ niken crom cứng", labelEn: "Hard chrome plating", query: "Mạ niken", count: 90 },
      { labelVi: "Dầu thủy lực 46 / 68 Shell/Castrol", labelEn: "Hydraulic oil 46/68", query: "Dầu thủy lực", count: 92 },
      { labelVi: "Thước cặp điện tử Mitutoyo", labelEn: "Mitutoyo digital caliper", query: "Thước cặp", count: 78 },
      { labelVi: "Lò xo nén, Lò xo xoắn inox", labelEn: "Stainless steel springs", query: "Lò xo công nghiệp", count: 65 }
    ]
  },
  "4.3": {
    categories: [
      { nameVi: "Logistics & Vận tải Hàng hóa Đường bộ", nameEn: "Road Freight & Logistics", query: "Logistics" },
      { nameVi: "Cho thuê Kho bãi & Kho Ngoại quan", nameEn: "Warehousing & Bonded Storage", query: "Cho thuê kho" },
      { nameVi: "Dịch vụ Khai báo Hải quan Trọn gói", nameEn: "Customs Clearance Brokerage", query: "Khai báo hải quan" },
      { nameVi: "Vận tải Container Đường biển & Hàng không", nameEn: "Ocean & Air Container Freight", query: "Vận tải container" }
    ],
    keywords: [
      { labelVi: "Vận chuyển container đường bộ", labelEn: "Trucking & container transport", query: "Vận tải container", count: 130 },
      { labelVi: "Thuê kho ngoại quan logistics", labelEn: "Bonded warehouse rental", query: "Kho ngoại quan", count: 92 },
      { labelVi: "Khai báo hải quan điện tử xuất nhập khẩu", labelEn: "Electronic customs filing", query: "Khai báo hải quan", count: 135 },
      { labelVi: "Cước tàu biển FCL / LCL", labelEn: "Ocean freight FCL/LCL", query: "Cước vận tải biển", count: 110 },
      { labelVi: "Đóng kiện pallet gỗ xuất khẩu", labelEn: "Export wood pallet crating", query: "Pallet gỗ", count: 64 }
    ]
  },
  "5.1": {
    categories: [
      { nameVi: "Cung ứng Nhân lực & Cho thuê Lao động", nameEn: "Manpower Sourcing & Staffing", query: "Cung ứng lao động" },
      { nameVi: "Đào tạo An toàn Vệ sinh Lao động", nameEn: "Occupational Safety Training", query: "An toàn lao động" },
      { nameVi: "Dịch vụ Bảo vệ & An ninh Nhà xưởng 24/7", nameEn: "Industrial Factory Security 24/7", query: "Dịch vụ bảo vệ" },
      { nameVi: "Dịch vụ BPO & Tính lương Thuê ngoài", nameEn: "HR Outsourcing & Payroll BPO", query: "Tính lương BPO" }
    ],
    keywords: [
      { labelVi: "Cung ứng lao động thời vụ KCN", labelEn: "Seasonal factory workers", query: "Lao động thời vụ", count: 140 },
      { labelVi: "Cho thuê lại lao động phổ thông", labelEn: "Labor sub-leasing service", query: "Cho thuê lao động", count: 125 },
      { labelVi: "Huấn luyện an toàn lao động nhóm 1-6", labelEn: "Occupational safety training", query: "Huấn luyện an toàn", count: 110 },
      { labelVi: "Dịch vụ bảo vệ nhà máy chuyên nghiệp", labelEn: "Professional security service", query: "Bảo vệ nhà máy", count: 95 },
      { labelVi: "Tuyển dụng kỹ sư sản xuất", labelEn: "Production engineer recruitment", query: "Tuyển dụng kỹ sư", count: 88 }
    ]
  },
  "5.2": {
    categories: [
      { nameVi: "Suất ăn Công nghiệp & Căn tin Nhà máy", nameEn: "Industrial Catering & Canteen", query: "Suất ăn công nghiệp" },
      { nameVi: "Xe Đưa đón Cán bộ Công nhân viên", nameEn: "Staff Shuttle Bus Services", query: "Xe đưa đón công nhân" },
      { nameVi: "Khám Sức khỏe Định kỳ Doanh nghiệp", nameEn: "Corporate Periodic Health Checks", query: "Khám sức khỏe doanh nghiệp" },
      { nameVi: "Vệ sinh Công nghiệp & Giặt ủi Xưởng", nameEn: "Industrial Cleaning & Laundry", query: "Vệ sinh công nghiệp" }
    ],
    keywords: [
      { labelVi: "Suất ăn công nghiệp đạt chuẩn HACCP", labelEn: "HACCP industrial meals", query: "Suất ăn HACCP", count: 135 },
      { labelVi: "Thuê xe đưa đón 29 - 45 chỗ", labelEn: "Shuttle bus 29-45 seats", query: "Thuê xe đưa đón", count: 110 },
      { labelVi: "Gói khám sức khỏe định kỳ công nhân", labelEn: "Worker medical checkup", query: "Khám sức khỏe công nhân", count: 95 },
      { labelVi: "Vệ sinh trần xưởng & Lau kính cao tầng", labelEn: "Factory high-rise cleaning", query: "Vệ sinh trần xưởng", count: 88 },
      { labelVi: "Dịch vụ giặt ủi đồ phòng sạch", labelEn: "Cleanroom laundry service", query: "Giặt ủi công nghiệp", count: 48 }
    ]
  },
  "5.3": {
    categories: [
      { nameVi: "May Đo Đồng phục Công nhân Nhà xưởng", nameEn: "Factory Worker Uniforms", query: "May đồng phục" },
      { nameVi: "Trang thiết bị Bảo hộ Lao động & PPE", nameEn: "Personal Protective Equipment (PPE)", query: "Bảo hộ lao động" },
      { nameVi: "Giày Bảo hộ Mũi thép & Mũ An toàn", nameEn: "Steel-Toe Shoes & Hard Hats", query: "Giày bảo hộ" },
      { nameVi: "Đồ Phòng sạch & Chống tĩnh điện ESD", nameEn: "Cleanroom & ESD Protective Gear", query: "Quần áo phòng sạch" }
    ],
    keywords: [
      { labelVi: "May đồng phục công nhân nhà máy", labelEn: "Factory worker uniform sewing", query: "Đồng phục công nhân", count: 165 },
      { labelVi: "Giày bảo hộ mũi thép chống đinh", labelEn: "Safety shoes steel toe", query: "Giày bảo hộ", count: 130 },
      { labelVi: "Mũ bảo hộ lao động tiêu chuẩn", labelEn: "Standard safety hard hats", query: "Mũ bảo hộ", count: 98 },
      { labelVi: "Găng tay phòng sạch chống tĩnh điện ESD", labelEn: "ESD cleanroom gloves", query: "Găng tay ESD", count: 88 },
      { labelVi: "Khẩu trang than hoạt tính 3M", labelEn: "3M carbon safety masks", query: "Khẩu trang 3M", count: 105 }
    ]
  },
  "6.1": {
    categories: [
      { nameVi: "Tư vấn Mở rộng Dự án & Tăng vốn Đầu tư", nameEn: "Expansion & Capital Increase", query: "Mở rộng đầu tư" },
      { nameVi: "Cải tạo & Nâng cấp Phân xưởng Sản xuất", nameEn: "Workshop Renovation & Upgrade", query: "Cải tạo nhà xưởng" },
      { nameVi: "Thuê thêm Đất & Nhà xưởng Giai đoạn 2", nameEn: "Phase 2 Land & Factory Lease", query: "Thuê thêm nhà xưởng" },
      { nameVi: "Tư vấn M&A & Chuyển nhượng Nhà máy", nameEn: "Factory M&A & Transfer Advisory", query: "M&A nhà máy" }
    ],
    keywords: [
      { labelVi: "Lập báo cáo mở rộng đầu tư", labelEn: "Investment expansion report", query: "Báo cáo mở rộng đầu tư", count: 35 },
      { labelVi: "Thi công mở rộng nhà xưởng giai đoạn 2", labelEn: "Phase 2 factory construction", query: "Mở rộng nhà xưởng", count: 75 },
      { labelVi: "Chuyển nhượng quyền thuê đất KCN", labelEn: "IP land lease transfer", query: "Chuyển nhượng đất KCN", count: 52 },
      { labelVi: "Nâng cấp trạm biến áp xưởng", labelEn: "Substation capacity upgrade", query: "Nâng cấp trạm biến áp", count: 62 },
      { labelVi: "Mua bán sáp nhập nhà máy công nghiệp", labelEn: "Industrial factory M&A", query: "M&A nhà máy", count: 58 }
    ]
  },
  "6.2": {
    categories: [
      { nameVi: "Tư vấn Chứng nhận ISO (9001, 14001, 45001)", nameEn: "ISO Certification Consulting", query: "Chứng nhận ISO" },
      { nameVi: "Tư vấn Tiêu chuẩn Xã hội (BSCI, SMETA)", nameEn: "Social Audits (BSCI, SMETA)", query: "Tiêu chuẩn BSCI" },
      { nameVi: "Chứng chỉ Công trình Xanh LEED & LOTUS", nameEn: "LEED & LOTUS Green Building", query: "Chứng chỉ LEED" },
      { nameVi: "Kiểm toán Năng lượng & An toàn Môi trường", nameEn: "Energy Audit & Environmental Safety", query: "Kiểm toán năng lượng" }
    ],
    keywords: [
      { labelVi: "Chứng nhận ISO 9001:2015", labelEn: "ISO 9001:2015 certificate", query: "Chứng nhận ISO 9001", count: 120 },
      { labelVi: "Đánh giá trách nhiệm xã hội BSCI", labelEn: "BSCI social audit", query: "Đánh giá BSCI", count: 68 },
      { labelVi: "Chứng chỉ công trình xanh LEED Gold", labelEn: "LEED Gold green building", query: "Chứng chỉ LEED", count: 50 },
      { labelVi: "Kiểm toán năng lượng định kỳ", labelEn: "Periodic energy audit", query: "Kiểm toán năng lượng", count: 62 },
      { labelVi: "Báo cáo phát thải Carbon Scope 1-2-3", labelEn: "Carbon footprint report", query: "Báo cáo Carbon", count: 48 }
    ]
  },
  "6.3": {
    categories: [
      { nameVi: "Phần mềm Quản lý Sản xuất MES & ERP", nameEn: "MES & Industrial ERP Software", query: "Phần mềm MES" },
      { nameVi: "Hệ thống Giám sát SCADA & Cảm biến IoT", nameEn: "SCADA & Industrial IoT Sensors", query: "SCADA" },
      { nameVi: "Robot Tự hành AGV & Kho Thông minh AS/RS", nameEn: "AGV Robotics & Automated Storage", query: "Robot AGV" },
      { nameVi: "Lắp đặt Điện Mặt trời Mái nhà & ESG", nameEn: "Rooftop Solar & ESG Solutions", query: "Điện mặt trời mái nhà" }
    ],
    keywords: [
      { labelVi: "Triển khai phần mềm MES nhà máy", labelEn: "MES software deployment", query: "Phần mềm MES", count: 80 },
      { labelVi: "Cảm biến IoT giám sát nhiệt độ rung", labelEn: "IoT vibration/temp sensor", query: "Cảm biến IoT", count: 72 },
      { labelVi: "Robot tự hành AGV vận chuyển phôi", labelEn: "AGV material handling robot", query: "Robot AGV", count: 65 },
      { labelVi: "Hệ thống giám sát hiệu suất OEE máy", labelEn: "OEE machine monitoring", query: "Giám sát OEE", count: 75 },
      { labelVi: "Lắp đặt điện mặt trời áp mái 1MWp", labelEn: "1MWp rooftop solar system", query: "Điện mặt trời áp mái", count: 98 }
    ]
  }
};

// Global default categories when "All 18 Phases" is selected
const GLOBAL_ALL_PHASES_CATEGORIES = [
  { nameVi: "Cơ khí chính xác CNC & Phụ trợ", nameEn: "Precision CNC Machining", query: "Cơ khí" },
  { nameVi: "Bao bì Carton, Màng PE & Pallet", nameEn: "Packaging, PE Film & Pallets", query: "Bao bì" },
  { nameVi: "Hóa chất Công nghiệp & Dung môi", nameEn: "Industrial Chemicals & Solvents", query: "Hóa chất" },
  { nameVi: "Hạt nhựa & Phụ gia Khuôn mẫu", nameEn: "Plastic Resin & Masterbatch", query: "Hạt nhựa" },
  { nameVi: "Tổng thầu Xây dựng & Kết cấu thép", nameEn: "EPC General Contractor & Steel", query: "Kết cấu thép" },
  { nameVi: "Cơ điện Lạnh MEP & Tự động hóa", nameEn: "MEP, HVAC & Automation", query: "Cơ điện" },
  { nameVi: "Thiết bị PCCC & Hạ tầng kỹ thuật", nameEn: "Fire Safety & Infrastructure", query: "PCCC" },
  { nameVi: "Logistics, Kho bãi & Cho thuê Xe nâng", nameEn: "Logistics, Warehousing & Forklift", query: "Logistics" },
  { nameVi: "Cung ứng Nhân lực & Suất ăn Công nghiệp", nameEn: "Manpower & Industrial Catering", query: "Suất ăn công nghiệp" },
  { nameVi: "Phần mềm MES & Điện mặt trời ESG", nameEn: "MES Software & Solar ESG", query: "Điện mặt trời" },
];

// Global default keywords when "All 18 Phases" is selected
const GLOBAL_ALL_PHASES_KEYWORDS = [
  { labelVi: "Máy phay CNC 5 trục", labelEn: "5-axis CNC Milling", query: "Máy phay CNC", count: 160 },
  { labelVi: "Thùng carton sóng 5 lớp", labelEn: "5-ply Carton Box", query: "Thùng carton", count: 120 },
  { labelVi: "Khuôn mẫu ép nhựa chính xác", labelEn: "Plastic Injection Mold", query: "Khuôn mẫu", count: 110 },
  { labelVi: "Sơn sàn Epoxy kháng hóa chất", labelEn: "Epoxy Flooring", query: "Sơn epoxy", count: 135 },
  { labelVi: "Trạm biến áp 22kV", labelEn: "22kV Substation", query: "Trạm biến áp", count: 85 },
  { labelVi: "Tủ điện điều khiển PLC", labelEn: "PLC Electrical Panel", query: "Tủ điện PLC", count: 105 },
  { labelVi: "Băng tải con lăn tự động", labelEn: "Conveyor System", query: "Băng tải", count: 90 },
  { labelVi: "Dầu thủy lực 68 công nghiệp", labelEn: "Hydraulic Oil 68", query: "Dầu thủy lực", count: 92 },
  { labelVi: "Thuê xe nâng điện 2.5 tấn", labelEn: "2.5T Electric Forklift", query: "Thuê xe nâng", count: 105 },
  { labelVi: "Robot tự hành AGV nhà xưởng", labelEn: "AGV Robot", query: "Robot AGV", count: 70 },
  { labelVi: "Điện mặt trời áp mái 1MWp", labelEn: "1MWp Rooftop Solar", query: "Điện mặt trời", count: 98 },
  { labelVi: "Bu lông ốc vít cấp bền", labelEn: "High-tensile Bolts", query: "Bu lông", count: 95 },
];

const PROVINCES = [
  "Toàn quốc", "Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Hà Nội", "Bắc Ninh", 
  "Hải Phòng", "Long An", "Đà Nẵng", "Bà Rịa - Vũng Tàu", "Hưng Yên", "Hải Dương", 
  "Vĩnh Phúc", "Bắc Giang", "Quảng Nam", "Quảng Ngãi", "Khánh Hòa", "Cần Thơ", "Thái Nguyên"
];

// Deterministic base vote generator based on enterprise metadata
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

// Helper: Filter all enterprises by tokenized full-text search and criteria
function filterAllEnterprises(allData, { searchTerm, selectedStage, selectedPhase, selectedProvince, selectedCategory, selectedLetter, votes }) {
  if (!allData || !Array.isArray(allData)) return [];
  let filtered = [...allData];

  // 1. Filter by Multi-term Search Query
  if (searchTerm && searchTerm.trim()) {
    const qClean = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').trim();
    const queryTokens = qClean.split(/\s+/).filter(Boolean);

    filtered = filtered.filter(e => {
      const tokens = e._searchTokens || (
        `${e.name || ''} ${e.category || ''} ${e.industry || ''} ${e.province || ''} ${Array.isArray(e.products) ? e.products.join(' ') : ''}`
      ).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

      return queryTokens.every(tok => tokens.includes(tok));
    });
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

  // 7. Sort by highest total votes (base votes + user vote delta)
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

  // Read URL query params directly
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const searchTerm = queryParams.get('q') || '';
  const selectedPhase = queryParams.get('phase') || 'all';
  const selectedStage = queryParams.get('stage') || 'all';
  const selectedProvince = queryParams.get('province') || 'Toàn quốc';
  const selectedCategory = queryParams.get('category') || 'all';
  const [selectedLetter, setSelectedLetter] = useState(() => queryParams.get('letter') || 'TẤT CẢ');
  const [isLetterMenuOpen, setIsLetterMenuOpen] = useState(true);

  // Sync selectedLetter with URL query param changes
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
      try { localStorage.setItem('ccu_supplier_votes', JSON.stringify(updated)); } catch {}
      return updated;
    });

    setUserVoteActions(prev => {
      const updated = { ...prev, [key]: newAction };
      try { localStorage.setItem('ccu_user_vote_actions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Pagination & Display limit controls
  const [pageSize, setPageSize] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCount, setExpandedCount] = useState(24);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [location.search, selectedLetter]);

  // Dynamic computation of letter supplier counts based on active stage / phase selection
  const dynamicLetterCounts = useMemo(() => {
    const counts = {};
    ALPHABET_LETTERS.forEach(l => counts[l] = 0);

    // If specific phase is selected, compute from phase taxonomy
    if (selectedPhase !== 'all' && phaseTaxonomyAlphabetical[selectedPhase]) {
      Object.entries(phaseTaxonomyAlphabetical[selectedPhase]).forEach(([letter, cats]) => {
        if (counts[letter] !== undefined) {
          counts[letter] = cats.reduce((sum, c) => sum + (c.count || 0), 0);
        }
      });
      return counts;
    }

    // If specific stage is selected, combine phases in that stage
    if (selectedStage !== 'all') {
      const stgNum = parseInt(selectedStage);
      const stagePhases = MASTER_18_PHASES.filter(p => p.stage === stgNum);
      stagePhases.forEach(ph => {
        if (phaseTaxonomyAlphabetical[ph.id]) {
          Object.entries(phaseTaxonomyAlphabetical[ph.id]).forEach(([letter, cats]) => {
            if (counts[letter] !== undefined) {
              counts[letter] += cats.reduce((sum, c) => sum + (c.count || 0), 0);
            }
          });
        }
      });
      return counts;
    }

    // Default when viewing all 18 phases
    return DEFAULT_LETTER_COUNTS;
  }, [selectedPhase, selectedStage]);

  // Automatically select the first letter with suppliers when phase/stage changes
  useEffect(() => {
    if (selectedPhase !== 'all' || selectedStage !== 'all') {
      const currentCount = dynamicLetterCounts[selectedLetter] || 0;
      if (currentCount === 0 && selectedLetter !== 'TẤT CẢ') {
        const firstActiveLetter = ALPHABET_LETTERS.find(l => (dynamicLetterCounts[l] || 0) > 0);
        if (firstActiveLetter) {
          setSelectedLetter(firstActiveLetter);
        }
      }
    }
  }, [selectedPhase, selectedStage, dynamicLetterCounts, selectedLetter]);

  // Categories belonging to selected letter (Dynamic based on selected letter AND active phase/stage)
  const categoriesForLetter = useMemo(() => {
    // 1. If specific Phase is selected (e.g. 5.3 Đồng phục & Bảo hộ)
    if (selectedPhase !== 'all' && phaseTaxonomyAlphabetical[selectedPhase]) {
      const phaseData = phaseTaxonomyAlphabetical[selectedPhase];
      if (selectedLetter === 'TẤT CẢ') {
        const allList = [];
        Object.values(phaseData).forEach(arr => allList.push(...arr));
        return allList.sort((a, b) => b.count - a.count);
      }
      return phaseData[selectedLetter] || [];
    }

    // 2. If specific Stage is selected (e.g. Stage 5)
    if (selectedStage !== 'all') {
      const stgNum = parseInt(selectedStage);
      const stagePhases = MASTER_18_PHASES.filter(p => p.stage === stgNum);
      const mergedCats = [];

      stagePhases.forEach(ph => {
        const pData = phaseTaxonomyAlphabetical[ph.id];
        if (pData) {
          if (selectedLetter === 'TẤT CẢ') {
            Object.values(pData).forEach(arr => mergedCats.push(...arr));
          } else if (pData[selectedLetter]) {
            mergedCats.push(...pData[selectedLetter]);
          }
        }
      });

      return mergedCats.sort((a, b) => b.count - a.count);
    }

    // 3. If All 18 Phases is selected
    if (selectedLetter === 'TẤT CẢ') {
      const allList = [];
      Object.values(categoriesAlphabetical).forEach(arr => allList.push(...arr));
      return allList.sort((a, b) => b.count - a.count).slice(0, 48);
    }

    return categoriesAlphabetical[selectedLetter] || [];
  }, [selectedLetter, selectedPhase, selectedStage]);

  // Master filtered dataset computed instantly
  const allFilteredEnterprises = useMemo(() => {
    return filterAllEnterprises(enterprisesFullList, {
      searchTerm,
      selectedStage,
      selectedPhase,
      selectedProvince,
      selectedCategory,
      selectedLetter,
      votes
    });
  }, [searchTerm, selectedStage, selectedPhase, selectedProvince, selectedCategory, selectedLetter, votes]);

  const totalCount = allFilteredEnterprises.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Active items for current page
  const displayedEnterprises = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allFilteredEnterprises.slice(start, start + expandedCount);
  }, [allFilteredEnterprises, currentPage, pageSize, expandedCount]);

  // Reset expanded count when filters or page changes
  useEffect(() => {
    setExpandedCount(pageSize);
  }, [searchTerm, selectedStage, selectedPhase, selectedProvince, selectedCategory, selectedLetter, currentPage, pageSize]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current active suggested taxonomy (Categories & Keywords) based on selectedPhase or stage
  const currentTaxonomy = useMemo(() => {
    if (selectedPhase !== 'all' && PHASE_TAXONOMY_MAP[selectedPhase]) {
      return {
        phaseObj: MASTER_18_PHASES.find(p => p.id === selectedPhase),
        categories: PHASE_TAXONOMY_MAP[selectedPhase].categories,
        keywords: PHASE_TAXONOMY_MAP[selectedPhase].keywords
      };
    }

    if (selectedStage !== 'all') {
      const stgNum = parseInt(selectedStage);
      const stagePhases = MASTER_18_PHASES.filter(p => p.stage === stgNum);
      const combinedCats = [];
      const combinedKws = [];
      stagePhases.forEach(p => {
        if (PHASE_TAXONOMY_MAP[p.id]) {
          combinedCats.push(...PHASE_TAXONOMY_MAP[p.id].categories);
          combinedKws.push(...PHASE_TAXONOMY_MAP[p.id].keywords);
        }
      });
      return {
        stageNum: stgNum,
        categories: combinedCats.slice(0, 8),
        keywords: combinedKws.slice(0, 10)
      };
    }

    return {
      categories: GLOBAL_ALL_PHASES_CATEGORIES,
      keywords: GLOBAL_ALL_PHASES_KEYWORDS
    };
  }, [selectedPhase, selectedStage]);

  // 6 Structured Stage Column Groups with EXACT names from stagesData
  const stageColumns = [
    { 
      id: 1, 
      name: "GĐ 01", 
      title: lang === 'en' ? "PREP & INVEST" : "CHUẨN BỊ & ĐẦU TƯ", 
      color: "#8b5cf6", 
      bgLight: "bg-purple-50/90", 
      border: "border-purple-200", 
      activeHeader: "bg-purple-600 text-white shadow-purple-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 1) 
    },
    { 
      id: 2, 
      name: "GĐ 02", 
      title: lang === 'en' ? "DESIGN & EPC" : "THIẾT KẾ & XÂY DỰNG", 
      color: "#0052cc", 
      bgLight: "bg-blue-50/90", 
      border: "border-blue-200", 
      activeHeader: "bg-blue-600 text-white shadow-blue-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 2) 
    },
    { 
      id: 3, 
      name: "GĐ 03", 
      title: lang === 'en' ? "INSTALL & TESTING" : "LẮP ĐẶT & HOÀN THIỆN", 
      color: "#06b6d4", 
      bgLight: "bg-cyan-50/90", 
      border: "border-cyan-200", 
      activeHeader: "bg-cyan-600 text-white shadow-cyan-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 3) 
    },
    { 
      id: 4, 
      name: "GĐ 04", 
      title: lang === 'en' ? "PRODUCTION & OPS" : "VẬN HÀNH SẢN XUẤT", 
      color: "#10b981", 
      bgLight: "bg-emerald-50/90", 
      border: "border-emerald-200", 
      activeHeader: "bg-emerald-600 text-white shadow-emerald-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 4) 
    },
    { 
      id: 5, 
      name: "GĐ 05", 
      title: lang === 'en' ? "STAFFING & LOGISTICS" : "NHÂN SỰ & HẬU CẦN", 
      color: "#f59e0b", 
      bgLight: "bg-amber-50/90", 
      border: "border-amber-200", 
      activeHeader: "bg-amber-600 text-white shadow-amber-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 5) 
    },
    { 
      id: 6, 
      name: "GĐ 06", 
      title: lang === 'en' ? "OPTIMIZE & ESG" : "MỞ RỘNG – TỐI ƯU – CHUYỂN ĐỔI", 
      color: "#f43f5e", 
      bgLight: "bg-rose-50/90", 
      border: "border-rose-200", 
      activeHeader: "bg-rose-600 text-white shadow-rose-500/20",
      phases: MASTER_18_PHASES.filter(p => p.stage === 6) 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-20 font-sans select-none text-slate-900 antialiased selection:bg-[#0052cc] selection:text-white space-y-10">
      
      {/* =========================================================================
          1. HERO SECTION (Panoramic B2B Supplier Visual)
         ========================================================================= */}
      <section className="relative overflow-visible bg-[#F4F8FA] border-b border-slate-200/90 pb-16 sm:pb-20 lg:pb-24">
        
        {/* Right Half Supplier Warehouse Photo */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/supplier_b2b_hero.jpg" 
            alt="Vietnam Certified B2B Suppliers Logistics"
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
              <span className="text-[#0052cc] font-bold">{lang === 'en' ? 'B2B Suppliers Directory' : 'Nhà Cung Ứng & Phụ Trợ'}</span>
            </nav>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50/95 backdrop-blur-md border border-blue-200/80 text-[#0047a5] text-[11px] font-bold font-heading tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></span>
              <span>{lang === 'en' ? 'CERTIFIED B2B INDUSTRIAL SUPPLIERS' : 'MẠNG LƯỚI NHÀ CUNG CẤP & DOANH NGHIỆP B2B'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-slate-950 leading-[1.1]">
                {lang === 'en' ? 'Suppliers Ecosystem' : 'Hệ Sinh Thái Nhà Cung Ứng'}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0284c7] bg-clip-text text-transparent leading-[1.1]">
                {lang === 'en' ? 'Manufacturing Capabilities' : 'Đột Phá Năng Lực Sản Xuất'}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
              {lang === 'en' 
                ? 'Providing comprehensive info on 3,418+ A-Z industries, precisely matched across 18 Technical Phases in the 6-Stage Factory Lifecycle.' 
                : 'Danh bạ hơn 24.000+ nhà cung ứng, cơ sở chế tạo, vật liệu và dịch vụ công nghiệp phụ trợ kết nối chuẩn hóa 18 pha chuỗi cung ứng trên toàn quốc.'}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#danh-sach-nha-cung-ung"
                className="px-6 py-3 bg-gradient-to-r from-[#0047a5] via-[#0052cc] to-[#0066d6] hover:from-[#003d8f] hover:to-[#004fa8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition flex items-center space-x-2 font-heading tracking-wide transform hover:-translate-y-0.5"
              >
                <span>{lang === 'en' ? 'Explore Suppliers' : 'Khám Phá Nhà Cung Ứng'}</span>
              </a>

              <Link
                to="/dang-nhu-cau"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#072348] text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition flex items-center space-x-2 font-heading group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0052cc] group-hover:scale-110 transition-transform" />
                <span>{lang === 'en' ? 'Register as Supplier' : 'Đăng Ký Trở Thành NCC'}</span>
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          2. STATS BAR (Đặt CHÍNH GIỮA LINE ở trên)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-14 sm:-mt-16 lg:-mt-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-300/30 p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center space-x-3.5 p-1 sm:p-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#0052cc] flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">24.000+</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'B2B Suppliers' : 'Nhà cung ứng & Phụ trợ B2B'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">18 Pha</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Technical Phases' : 'Pha nghiệp vụ kỹ thuật'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">100%</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Profile Verified' : 'Xác thực năng lực cốt lõi'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 pt-3 sm:pt-0 sm:pl-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono tracking-tight">63</div>
                <p className="text-[11px] text-slate-500 font-medium">{lang === 'en' ? 'Provinces Covered' : 'Tỉnh thành toàn quốc'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Container */}
      <div id="danh-sach-nha-cung-ung" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">

        {/* =========================================================================
            3 TOP BLOCKS: (18 Phases/6 Stages + Founding Partner + A-Z Taxonomy)
           ========================================================================= */}
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

        {/* =========================================================================
            5. SEARCH & FILTER BAR
           ========================================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
            {/* Search Box */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => updateFilterUrl({ q: e.target.value })}
                placeholder={lang === 'en' ? "Search suppliers, CNC machining, raw materials, packaging, logistics..." : "Tìm nhà cung ứng, nan hoa, nhông xích D.I.D, máy móc CNC, bao bì..."}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Province Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedProvince}
                onChange={(e) => updateFilterUrl({ province: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov === "Toàn quốc" ? (lang === 'en' ? "📍 Nationwide (63 Provinces)" : "📍 Toàn quốc (63 Tỉnh thành)") : `📍 ${prov}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="sm:col-span-2 flex items-center">
              <button
                onClick={() => {
                  setSelectedLetter('TẤT CẢ');
                  updateFilterUrl({ q: '', phase: 'all', stage: 'all', category: 'all', province: 'Toàn quốc' });
                }}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Reset' : 'Đặt lại'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            6. RESULTS HEADER & CONTROLS
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading">
              {lang === 'en' ? 'Matching B2B Suppliers' : 'Danh Sách Nhà Cung Ứng & Cơ Sở Chế Tạo'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-xs font-mono font-bold">
              {totalCount.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN')} {lang === 'en' ? 'results' : 'kết quả'}
            </span>
          </div>

          {/* Active Filter Badges */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-1 sm:pb-0">
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
            {searchTerm && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200 font-bold shrink-0">
                Từ khóa: "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* =========================================================================
            7. SUPPLIERS GRID
           ========================================================================= */}
        {displayedEnterprises.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              🔍
            </div>
            <h4 className="text-lg font-bold text-slate-900 font-heading">
              {lang === 'en' ? 'No matching suppliers found' : 'Không tìm thấy nhà cung ứng phù hợp'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {lang === 'en' 
                ? 'Try adjusting your search terms, changing the technical phase, or resetting the filters to view all 24,000+ suppliers.' 
                : 'Vui lòng thử tìm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn bộ danh bạ hơn 24.000 nhà cung ứng.'}
            </p>
            <button
              onClick={() => {
                setSelectedLetter('TẤT CẢ');
                updateFilterUrl({ q: '', phase: 'all', stage: 'all', category: 'all', province: 'Toàn quốc' });
              }}
              className="px-6 py-2.5 bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-[#0041a8]"
            >
              {lang === 'en' ? 'Reset All Filters' : 'Xem toàn bộ nhà cung ứng'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedEnterprises.map((ent) => {
              const entId = ent.id || ent._id || ent.taxCode || ent.name;
              const totalVotes = getEnterpriseBaseVotes(ent) + (votes[String(entId)] || 0);
              const userAction = userVoteActions[String(entId)] || 0;
              const detailUrl = `/doanh-nghiep/${ent.id || ent._id}`;

              return (
                <div
                  key={entId}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-[#0052cc]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group relative"
                >
                  
                  {/* Top: Logo / Avatar + Name + Province */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      {/* Logo / Avatar Image Container */}
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-0.5 shrink-0 overflow-hidden shadow-2xs flex items-center justify-center group-hover:border-[#0052cc]/50 transition-colors relative">
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

                      {/* Name & Industry */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0052cc] text-[10px] font-bold rounded-md font-mono shrink-0">
                            📍 {ent.province || 'Toàn quốc'}
                          </span>

                          {/* Dual Vote Buttons (Upvote & Downvote on the same row with count in middle) */}
                          <div className="flex items-center rounded-lg border border-slate-200/90 bg-slate-50/80 p-0.5 shadow-2xs shrink-0">
                            {/* Upvote Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(ent, 1);
                              }}
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                userAction === 1
                                  ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={userAction === 1 ? "Bỏ bình chọn (+1)" : "Bình chọn uy tín (+1)"}
                            >
                              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                            </button>

                            {/* Count in the Middle */}
                            <span className={`px-1.5 text-[11px] font-mono font-bold select-none min-w-[20px] text-center ${
                              userAction === 1 
                                ? 'text-emerald-700 font-black' 
                                : userAction === -1 
                                ? 'text-rose-600 font-black' 
                                : 'text-slate-700'
                            }`}>
                              {totalVotes}
                            </span>

                            {/* Downvote Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(ent, -1);
                              }}
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                userAction === -1
                                  ? 'bg-rose-600 text-white shadow-2xs scale-105'
                                  : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={userAction === -1 ? "Bỏ đánh giá (-1)" : "Đánh giá thấp (-1)"}
                            >
                              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        <Link
                          to={detailUrl}
                          className="font-black text-xs sm:text-[13px] text-slate-950 group-hover:text-[#0052cc] transition line-clamp-2 font-heading leading-tight"
                          title={ent.name}
                        >
                          {ent.name}
                        </Link>
                      </div>
                    </div>

                    {/* Category / Description */}
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-800">
                        <Tag className="w-3 h-3 text-[#0052cc] shrink-0" />
                        <span className="truncate">{ent.category || ent.industry || "Nhà cung ứng công nghiệp"}</span>
                      </div>
                      
                      {ent.address && (
                        <div className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{ent.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Products / Capabilities Preview */}
                    {Array.isArray(ent.products) && ent.products.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ent.products.slice(0, 3).map((prod, pIdx) => (
                          <span 
                            key={pIdx} 
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md truncate max-w-[140px]"
                            title={prod}
                          >
                            {prod}
                          </span>
                        ))}
                        {ent.products.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded-md font-mono font-bold">
                            +{ent.products.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Contact & Action Links */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-xs">
                      {ent.phone ? (
                        <a 
                          href={`tel:${ent.phone}`}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition flex items-center space-x-1 text-[11px] font-mono"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="hidden sm:inline">{ent.phone}</span>
                          <span className="sm:hidden">Gọi</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Đang cập nhật</span>
                      )}

                      {ent.website && (
                        <a
                          href={ent.website.startsWith('http') ? ent.website : `https://${ent.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg transition"
                          title="Trang web chính thức"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={detailUrl}
                      className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1 font-heading"
                    >
                      <span>{lang === 'en' ? 'Details' : 'Chi tiết'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            8. PAGINATION
           ========================================================================= */}
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
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
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
                    className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center border ${
                      currentPage === pNum
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
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <span>{lang === 'en' ? 'Next' : 'Sau'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
