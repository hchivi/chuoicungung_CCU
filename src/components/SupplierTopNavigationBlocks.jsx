import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Building2, ShieldCheck, Layers, Tag,
  ChevronDown, ChevronUp, ChevronRight, Check, Wrench, Factory, Cpu,
  Truck, Users, Leaf, Sparkles, Flame, Zap, PackageCheck, CheckCircle2, Award
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import categoriesAlphabetical from '../data/categoriesAlphabetical.json';
import phaseTaxonomyAlphabetical from '../data/phaseTaxonomyAlphabetical.json';
import { detectPhaseAndStage } from '../utils/companyUtils';
import SupplierDirectoryExplorer from './suppliers/SupplierDirectoryExplorer';

// Exact 18-Phase Reference mapped strictly from stagesData (Stage 1 to 6)
export const MASTER_18_PHASES = [
  // Giai đoạn 1: Chuẩn bị & Đầu tư
  { id: "1.1", stage: 1, title: "1.1 Khảo sát & Định hướng", enTitle: "1.1 Feasibility & Strategic Survey", icon: Search, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },
  { id: "1.2", stage: 1, title: "1.2 Pháp lý & Thủ tục", enTitle: "1.2 Legal Licensing & Procedures", icon: ShieldCheck, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },
  { id: "1.3", stage: 1, title: "1.3 Chọn địa điểm & Mặt bằng", enTitle: "1.3 Site Selection & Industrial Park", icon: MapPin, stageName: "Chuẩn bị & Đầu tư", color: "#8b5cf6" },

  // Giai đoạn 2: Thiết kế & Xây dựng
  { id: "2.1", stage: 2, title: "2.1 Thiết kế & Quy hoạch", enTitle: "2.1 Master Planning & Architecture", icon: Layers, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },
  { id: "2.2", stage: 2, title: "2.2 Thi công xây dựng", enTitle: "2.2 Civil & Structural Construction", icon: Building2, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },
  { id: "2.3", stage: 2, title: "2.3 Cơ điện & Hạ tầng kỹ thuật", enTitle: "2.3 MEP & Technical Infrastructure", icon: Flame, stageName: "Thiết kế & Xây dựng", color: "#0052cc" },

  // Giai đoạn 3: Lắp đặt & Hoàn thiện
  { id: "3.1", stage: 3, title: "3.1 Lắp đặt máy & Dây chuyền", enTitle: "3.1 Machinery Rigging & Lines", icon: Factory, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },
  { id: "3.2", stage: 3, title: "3.2 Hoàn thiện không gian sản xuất", enTitle: "3.2 Cleanroom & Fit-out", icon: Cpu, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },
  { id: "3.3", stage: 3, title: "3.3 Kiểm tra & Chạy thử Nghiệm thu", enTitle: "3.3 Trial Runs & Acceptance", icon: Award, stageName: "Lắp đặt & Hoàn thiện", color: "#06b6d4" },

  // Giai đoạn 4: Vận hành Sản xuất
  { id: "4.1", stage: 4, title: "4.1 Cung ứng đầu vào (NVL, linh kiện)", enTitle: "4.1 Input Sourcing (Materials & Parts)", icon: Zap, stageName: "Vận hành Sản xuất", color: "#10b981" },
  { id: "4.2", stage: 4, title: "4.2 Quản lý sản xuất & Kiểm soát", enTitle: "4.2 Production Management & QA/QC", icon: Wrench, stageName: "Vận hành Sản xuất", color: "#10b981" },
  { id: "4.3", stage: 4, title: "4.3 Giao nhận & Phân phối", enTitle: "4.3 Warehousing & Outbound Logistics", icon: Truck, stageName: "Vận hành Sản xuất", color: "#10b981" },

  // Giai đoạn 5: Nhân sự & Hậu cần
  { id: "5.1", stage: 5, title: "5.1 Tuyển dụng & Lao động", enTitle: "5.1 Staffing & Labor Recruitment", icon: Users, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },
  { id: "5.2", stage: 5, title: "5.2 Đời sống & Phúc lợi", enTitle: "5.2 Catering, Commuting & Welfare", icon: PackageCheck, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },
  { id: "5.3", stage: 5, title: "5.3 Đồng phục & Bảo hộ (PPE)", enTitle: "5.3 Uniforms & PPE Safety Gear", icon: ShieldCheck, stageName: "Nhân sự & Hậu cần", color: "#f59e0b" },

  // Giai đoạn 6: Mở rộng – Tối ưu – Chuyển đổi
  { id: "6.1", stage: 6, title: "6.1 Mở rộng công suất & Nhà máy", enTitle: "6.1 Capacity Expansion & Phase 2", icon: Sparkles, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
  { id: "6.2", stage: 6, title: "6.2 Audit & ISO – Chuẩn hóa", enTitle: "6.2 Auditing, ISO & Standards", icon: CheckCircle2, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
  { id: "6.3", stage: 6, title: "6.3 Chuyển đổi số & Tự động hóa", enTitle: "6.3 Digital & Green ESG Transition", icon: Leaf, stageName: "Mở rộng – Tối ưu – Chuyển đổi", color: "#f43f5e" },
];

const DEFAULT_LETTER_COUNTS = {
  A: 415, B: 1605, C: 2711, D: 3427, E: 214, F: 125, G: 1289, H: 837, I: 130,
  K: 1857, L: 410, M: 1757, N: 897, O: 0, P: 809, Q: 166, R: 169,
  S: 651, T: 2885, U: 0, V: 763, W: 38, X: 525, Y: 0, Z: 0
};

export const LETTER_KEYWORDS_MAP = {
  A: [
    { labelVi: "Ắc quy ô tô & Xe máy", query: "Ắc quy", count: 85 },
    { labelVi: "Áo mưa quảng cáo quà tặng", query: "Áo mưa", count: 120 },
    { labelVi: "An ninh camera giám sát KCN", query: "Camera an ninh", count: 95 },
    { labelVi: "Áo thun đồng phục công nhân", query: "Đồng phục", count: 165 },
    { labelVi: "Anode nhôm & Xi mạ bề mặt", query: "Anode nhôm", count: 63 },
    { labelVi: "Amply ô tô & Loa công nghiệp", query: "Amply", count: 32 },
    { labelVi: "Áo khoác gió & Áo bảo hộ", query: "Áo khoác", count: 78 },
    { labelVi: "Áo choàng phòng sạch Cleanroom", query: "Phòng sạch", count: 54 }
  ],
  B: [
    { labelVi: "Ba lô du lịch & Balo quà tặng", query: "Ba lô", count: 140 },
    { labelVi: "Bao bì carton sóng 3-5 lớp", query: "Thùng carton", count: 185 },
    { labelVi: "Bạc đạn vòng bi công nghiệp", query: "Vòng bi bạc đạn", count: 110 },
    { labelVi: "Băng tải con lăn tự động", query: "Băng tải", count: 95 },
    { labelVi: "Bảo hộ lao động & Mũ giày PPE", query: "Bảo hộ lao động", count: 160 },
    { labelVi: "Bê tông thương phẩm & Ép cọc", query: "Bê tông", count: 120 },
    { labelVi: "Bu lông ốc vít cấp bền inox", query: "Bu lông ốc vít", count: 135 },
    { labelVi: "Bàn thao tác inox chống tĩnh điện ESD", query: "Bàn thao tác", count: 75 }
  ],
  C: [
    { labelVi: "Cơ khí chính xác & Phay tiện CNC", query: "Cơ khí chính xác", count: 190 },
    { labelVi: "Cắt laser kim loại tấm & Ống", query: "Cắt laser", count: 145 },
    { labelVi: "Cẩu trục nhà xưởng 5T - 20T", query: "Cẩu trục", count: 85 },
    { labelVi: "Cáp điện công nghiệp & Dây cáp", query: "Dây cáp điện", count: 130 },
    { labelVi: "Cao su kỹ thuật & Đệm chống rung", query: "Cao su kỹ thuật", count: 90 },
    { labelVi: "Cảm biến IoT & Đo lường", query: "Cảm biến", count: 78 },
    { labelVi: "Chiller làm lạnh nước công nghiệp", query: "Chiller", count: 68 },
    { labelVi: "Căn tin & Suất ăn công nghiệp", query: "Suất ăn công nghiệp", count: 155 }
  ],
  D: [
    { labelVi: "Đá mài đá cắt công nghiệp", query: "Đá mài", count: 110 },
    { labelVi: "Điện mặt trời áp mái ESG 1MWp", query: "Điện mặt trời", count: 125 },
    { labelVi: "Đồng phục công nhân & Sơ mi", query: "Đồng phục", count: 180 },
    { labelVi: "Dây đai đóng kiện & Màng PE", query: "Dây đai", count: 95 },
    { labelVi: "Dầu nhờn & Dầu thủy lực 46/68", query: "Dầu nhờn", count: 115 },
    { labelVi: "Dây chuyền lắp ráp tự động", query: "Dây chuyền sản xuất", count: 85 },
    { labelVi: "Đột dập kim loại chính xác", query: "Đột dập", count: 98 },
    { labelVi: "Đèn LED chiếu sáng nhà xưởng", query: "Đèn LED nhà xưởng", count: 105 }
  ],
  E: [
    { labelVi: "Sơn sàn Epoxy kháng hóa chất", query: "Sơn Epoxy", count: 135 },
    { labelVi: "Thiết bị ESD chống tĩnh điện", query: "Chống tĩnh điện", count: 85 },
    { labelVi: "ERP & Phần mềm quản lý sản xuất", query: "Phần mềm ERP", count: 92 },
    { labelVi: "Tư vấn tiêu chuẩn môi trường ESG", query: "Tiêu chuẩn ESG", count: 65 }
  ],
  F: [
    { labelVi: "Báo cáo nghiên cứu khả thi FS", query: "Báo cáo khả thi", count: 58 },
    { labelVi: "Xe nâng Forklift điện & Dầu", query: "Xe nâng Forklift", count: 115 },
    { labelVi: "FDI tư vấn đầu tư nhà máy", query: "Tư vấn đầu tư FDI", count: 75 },
    { labelVi: "Forwarding & Giao nhận quốc tế", query: "Forwarding", count: 90 }
  ],
  G: [
    { labelVi: "Gia công cơ khí CNC theo yêu cầu", query: "Gia công cơ khí", count: 185 },
    { labelVi: "Găng tay phòng sạch & Găng bảo hộ", query: "Găng tay bảo hộ", count: 120 },
    { labelVi: "Giày bảo hộ mũi thép chống đinh", query: "Giày bảo hộ", count: 145 },
    { labelVi: "Gỗ pallet & Thùng gỗ xuất khẩu", query: "Pallet gỗ", count: 110 },
    { labelVi: "Giấy carton sóng & Bao bì in Offset", query: "Giấy carton", count: 130 },
    { labelVi: "Gia công khuôn mẫu ép nhựa chính xác", query: "Khuôn mẫu", count: 95 }
  ],
  H: [
    { labelVi: "Hóa chất công nghiệp & Dung môi", query: "Hóa chất công nghiệp", count: 165 },
    { labelVi: "Hạt nhựa nguyên sinh PP/ABS/PC", query: "Hạt nhựa", count: 140 },
    { labelVi: "Hệ thống PCCC tự động Sprinkler", query: "PCCC", count: 125 },
    { labelVi: "HVAC điều hòa thông gió phân xưởng", query: "HVAC", count: 115 },
    { labelVi: "Hàn kết cấu thép & Nhà tiền chế", query: "Kết cấu thép", count: 130 },
    { labelVi: "Hiệu chuẩn thiết bị đo phòng Lab", query: "Hiệu chuẩn", count: 75 }
  ],
  I: [
    { labelVi: "Thép không gỉ Inox 304/316 tấm cuộn", query: "Inox 304", count: 140 },
    { labelVi: "Cảm biến IoT giám sát nhiệt rung", query: "Cảm biến IoT", count: 85 },
    { labelVi: "Tư vấn chứng nhận ISO 9001/14001", query: "Chứng nhận ISO", count: 98 },
    { labelVi: "In ấn bao bì tem nhãn decal", query: "In ấn bao bì", count: 120 }
  ],
  K: [
    { labelVi: "Khuôn mẫu chính xác ép nhựa đúc", query: "Khuôn mẫu chính xác", count: 160 },
    { labelVi: "Kết cấu thép nhà xưởng công nghiệp", query: "Kết cấu thép", count: 175 },
    { labelVi: "Khai báo hải quan & Thủ tục XNK", query: "Khai báo hải quan", count: 140 },
    { labelVi: "Kiểm định an toàn máy móc cầu trục", query: "Kiểm định an toàn", count: 95 },
    { labelVi: "Khí nén công nghiệp Oxy/Nito/Argon", query: "Khí công nghiệp", count: 88 },
    { labelVi: "Kính an toàn & Vách kính nhà xưởng", query: "Kính xây dựng", count: 75 }
  ],
  L: [
    { labelVi: "Logistics kho bãi & Kho ngoại quan", query: "Logistics", count: 160 },
    { labelVi: "Lắp đặt dây chuyền máy móc", query: "Lắp đặt máy móc", count: 105 },
    { labelVi: "Lò hơi công nghiệp tầng sôi đốt than", query: "Lò hơi công nghiệp", count: 85 },
    { labelVi: "Linh kiện điện tử & Vi mạch PCB", query: "Linh kiện điện tử", count: 110 },
    { labelVi: "Lưới thép hàn bê tông & Hàng rào", query: "Lưới thép hàn", count: 92 }
  ],
  M: [
    { labelVi: "Máy phay CNC 5 trục nhập khẩu", query: "Máy phay CNC", count: 170 },
    { labelVi: "Màng PE quấn pallet Stretch Film", query: "Màng PE", count: 135 },
    { labelVi: "May đồng phục công nhân KCN", query: "May đồng phục", count: 180 },
    { labelVi: "Máy nén khí trục vít Atlas Copco", query: "Máy nén khí", count: 125 },
    { labelVi: "Mạ niken mạ kẽm mạ crom cứng", query: "Xi mạ", count: 110 },
    { labelVi: "Mực in bao bì công nghiệp", query: "Mực in", count: 75 }
  ],
  N: [
    { labelVi: "Nhà thép tiền chế & Tổng thầu EPC", query: "Nhà thép tiền chế", count: 165 },
    { labelVi: "Nhựa ép định hình & Thùng nhựa Danpla", query: "Nhựa định hình", count: 120 },
    { labelVi: "Nồi hơi đốt gas & Biomass", query: "Nồi hơi", count: 85 },
    { labelVi: "Nội thất văn phòng & Bàn ghế xưởng", query: "Nội thất văn phòng", count: 110 },
    { labelVi: "Nghiệm thu PCCC & Giấy phép", query: "Nghiệm thu PCCC", count: 95 }
  ],
  P: [
    { labelVi: "Phòng sạch Cleanroom chuẩn GMP", query: "Phòng sạch", count: 145 },
    { labelVi: "Pallet gỗ keo & Pallet nhựa chịu tải", query: "Pallet gỗ", count: 155 },
    { labelVi: "Phay tiện CNC chi tiết cơ khí", query: "Phay tiện CNC", count: 160 },
    { labelVi: "Phần mềm MES & Quản lý bảo trì CMMS", query: "Phần mềm MES", count: 95 },
    { labelVi: "PCCC bình chữa cháy & Cuộn vòi", query: "Thiết bị PCCC", count: 120 },
    { labelVi: "Phụ liệu ngành may (Chỉ, Nút, Dây kéo)", query: "Phụ liệu may", count: 110 }
  ],
  Q: [
    { labelVi: "Quy hoạch dự án 1/500 KCN", query: "Quy hoạch 1/500", count: 65 },
    { labelVi: "Quạt thông gió làm mát xưởng", query: "Quạt thông gió", count: 110 },
    { labelVi: "Quan trắc môi trường định kỳ", query: "Quan trắc môi trường", count: 85 },
    { labelVi: "Quản lý chất lượng QA/QC dụng cụ đo", query: "QA/QC", count: 75 }
  ],
  R: [
    { labelVi: "Robot hàn & Máy hàn tự động", query: "Robot hàn", count: 77 },
    { labelVi: "Rơ moóc & Sơ mi rơ moóc", query: "Rơ moóc", count: 71 },
    { labelVi: "Rơle công nghiệp & Khởi động từ", query: "Rơle", count: 24 },
    { labelVi: "Rổ nhựa & Sóng nhựa công nghiệp", query: "Rổ nhựa", count: 30 },
    { labelVi: "Rọ đá mạ kẽm bọc nhựa", query: "Rọ đá", count: 64 },
    { labelVi: "Rèm hội trường & Rèm nhà xưởng", query: "Rèm hội trường", count: 12 }
  ],
  S: [
    { labelVi: "Sơn sàn Epoxy tự san phẳng & Chống tĩnh điện", query: "Sơn sàn Epoxy", count: 160 },
    { labelVi: "Sơn tĩnh điện kim loại gia công", query: "Sơn tĩnh điện", count: 140 },
    { labelVi: "Suất ăn công nghiệp chuẩn HACCP", query: "Suất ăn công nghiệp", count: 175 },
    { labelVi: "Sợi dệt may & Vải không dệt", query: "Sợi dệt", count: 95 },
    { labelVi: "Sắt thép xây dựng & Thép hình H/I/V", query: "Sắt thép xây dựng", count: 150 },
    { labelVi: "SCADA giám sát OEE dây chuyền", query: "Hệ thống SCADA", count: 85 }
  ],
  T: [
    { labelVi: "Thùng carton sóng 5 lớp 7 lớp xuất khẩu", query: "Thùng carton", count: 180 },
    { labelVi: "Trạm biến áp 22kV / 110kV trọn gói", query: "Trạm biến áp 22kV", count: 125 },
    { labelVi: "Tủ điện điều khiển PLC & ATS", query: "Tủ điện PLC", count: 140 },
    { labelVi: "Thuê xe nâng điện Komatsu 2.5T", query: "Thuê xe nâng điện", count: 155 },
    { labelVi: "Tuyển dụng kỹ sư & Lao động thời vụ", query: "Tuyển dụng lao động", count: 165 },
    { labelVi: "Thép tấm Inox & Cuộn mạ kẽm", query: "Thép tấm", count: 150 },
    { labelVi: "Thi công nhà xưởng tiền chế", query: "Thi công nhà xưởng", count: 160 }
  ],
  V: [
    { labelVi: "Vận tải container & Kéo mooc KCN", query: "Vận tải container", count: 170 },
    { labelVi: "Vòng bi bạc đạn SKF / NSK", query: "Vòng bi bạc đạn", count: 135 },
    { labelVi: "Vách panel cách nhiệt bông khoáng Rockwool", query: "Vách panel cách nhiệt", count: 125 },
    { labelVi: "Vệ sinh công nghiệp & Lau kính trần xưởng", query: "Vệ sinh công nghiệp", count: 110 },
    { labelVi: "Van bi, Van bướm, Van điều khiển khí nén", query: "Van công nghiệp", count: 95 },
    { labelVi: "Vật tư tiêu hao phòng sạch & PPE", query: "Vật tư phòng sạch", count: 115 }
  ],
  W: [
    { labelVi: "Warehousing & Cho thuê kho bãi logistics", query: "Cho thuê kho bãi", count: 85 },
    { labelVi: "Wastewater xử lý nước thải nhà máy", query: "Xử lý nước thải", count: 90 },
    { labelVi: "Workstation bàn thao tác lắp ráp", query: "Bàn thao tác", count: 65 }
  ],
  X: [
    { labelVi: "Xe nâng hàng dầu/điện 1.5T - 10T", query: "Xe nâng hàng", count: 165 },
    { labelVi: "Xử lý nước thải & Nước cấp RO", query: "Xử lý nước thải", count: 130 },
    { labelVi: "Xi mạ niken crom cứng chống rỉ", query: "Xi mạ", count: 115 },
    { labelVi: "Xây dựng nhà xưởng kết cấu thép", query: "Xây dựng nhà xưởng", count: 150 },
    { labelVi: "Xốp EPS/PE foam chèn lót hàng", query: "Xốp định hình", count: 95 }
  ]
};

const ALPHABET_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X'];

export const PHASE_KEYWORDS_MAP = {
  "1.1": [
    { labelVi: "Nghiên cứu thị trường FDI", labelEn: "FDI Market Survey", query: "Nghiên cứu thị trường", count: 45 },
    { labelVi: "Báo cáo khả thi FS", labelEn: "Feasibility Study (FS)", query: "Báo cáo khả thi", count: 30 },
    { labelVi: "Khảo sát địa chất công trình", labelEn: "Soil & Geo Survey", query: "Khảo sát địa chất", count: 56 },
    { labelVi: "Đo đạc trắc địa địa hình", labelEn: "Topographical Survey", query: "Đo đạc trắc địa", count: 42 },
    { labelVi: "Tư vấn đầu tư nhà máy", labelEn: "Factory Investment Advisory", query: "Tư vấn đầu tư", count: 68 }
  ],
  "1.2": [
    { labelVi: "Giấy phép xây dựng nhà xưởng", labelEn: "Construction Permit", query: "Giấy phép xây dựng", count: 48 },
    { labelVi: "Báo cáo đánh giá ĐTM", labelEn: "EIA Environmental Report", query: "Đánh giá tác động môi trường", count: 65 },
    { labelVi: "Thẩm duyệt PCCC cơ sở", labelEn: "Fire Safety Approval", query: "Thẩm duyệt PCCC", count: 52 },
    { labelVi: "Thành lập pháp nhân FDI", labelEn: "FDI Entity Setup", query: "Thành lập doanh nghiệp", count: 38 }
  ],
  "1.3": [
    { labelVi: "Thuê đất khu công nghiệp", labelEn: "Industrial Land Lease", query: "Thuê đất khu công nghiệp", count: 120 },
    { labelVi: "Thuê nhà xưởng xây sẵn", labelEn: "Ready-Built Factory", query: "Nhà xưởng cho thuê", count: 95 },
    { labelVi: "Mặt bằng sản xuất phụ trợ", labelEn: "Ancillary Land Plot", query: "Mặt bằng sản xuất", count: 60 }
  ],
  "2.1": [
    { labelVi: "Thiết kế kiến trúc công nghiệp", labelEn: "Industrial Architecture", query: "Thiết kế kiến trúc", count: 88 },
    { labelVi: "Thiết kế quy hoạch 1/500", labelEn: "Master Planning 1/500", query: "Thiết kế quy hoạch", count: 45 },
    { labelVi: "Mô hình BIM nhà máy", labelEn: "Factory BIM Modeling", query: "Mô hình BIM", count: 35 }
  ],
  "2.2": [
    { labelVi: "Thi công nhà thép tiền chế", labelEn: "Pre-engineered Steel", query: "Nhà thép tiền chế", count: 150 },
    { labelVi: "Ép cọc bê tông móng xưởng", labelEn: "Foundation Piling", query: "Ép cọc bê tông", count: 90 },
    { labelVi: "Sàn bê tông mài tăng cứng", labelEn: "Hardened Concrete Floor", query: "Sàn bê tông mài", count: 110 }
  ],
  "2.3": [
    { labelVi: "Trạm biến áp 22kV / 110kV", labelEn: "22kV Substation", query: "Trạm biến áp 22kV", count: 85 },
    { labelVi: "Hệ thống PCCC tự động", labelEn: "Auto Fire Protection", query: "PCCC tự động", count: 95 },
    { labelVi: "Điều hòa thông gió HVAC xưởng", labelEn: "Industrial HVAC", query: "Điều hòa thông gió", count: 105 },
    { labelVi: "Hệ thống xử lý nước thải", labelEn: "Wastewater Treatment", query: "Xử lý nước thải", count: 75 }
  ],
  "3.1": [
    { labelVi: "Lắp đặt cẩu trục xưởng 10T", labelEn: "10T Overhead Crane", query: "Cẩu trục xưởng", count: 65 },
    { labelVi: "Lắp đặt dây chuyền sản xuất", labelEn: "Assembly Line Rigging", query: "Dây chuyền sản xuất", count: 80 },
    { labelVi: "Vận chuyển máy siêu trường", labelEn: "Oversized Machine Transport", query: "Vận chuyển máy siêu trường", count: 45 }
  ],
  "3.2": [
    { labelVi: "Sơn sàn Epoxy kháng hóa chất", labelEn: "Chemical resistant Epoxy", query: "Sơn sàn Epoxy", count: 135 },
    { labelVi: "Thi công phòng sạch Cleanroom", labelEn: "Cleanroom Fitout", query: "Phòng sạch", count: 70 },
    { labelVi: "Vách panel cách nhiệt EPS/PU", labelEn: "Insulated Panels", query: "Vách panel", count: 95 }
  ],
  "3.3": [
    { labelVi: "Chạy thử tải dây chuyền", labelEn: "Line Load Trial Run", query: "Chạy thử tải", count: 50 },
    { labelVi: "Hiệu chuẩn thiết bị đo", labelEn: "Calibration Services", query: "Hiệu chuẩn thiết bị", count: 65 },
    { labelVi: "Kiểm định an toàn máy móc", labelEn: "Machinery Inspection", query: "Kiểm định máy móc", count: 72 }
  ],
  "4.1": [
    { labelVi: "Thùng carton sóng 5 lớp", labelEn: "5-layer corrugated carton", query: "Thùng carton 5 lớp", count: 120 },
    { labelVi: "Hạt nhựa nguyên sinh PP/ABS", labelEn: "Virgin Plastic Resin", query: "Hạt nhựa nguyên sinh", count: 110 },
    { labelVi: "Bu lông ốc vít cấp bền", labelEn: "High tensile fasteners", query: "Bu lông ốc vít", count: 95 },
    { labelVi: "Màng PE quấn pallet", labelEn: "PE Stretch Film", query: "Màng PE quấn pallet", count: 85 }
  ],
  "4.2": [
    { labelVi: "Máy phay CNC 5 trục", labelEn: "5-axis CNC Milling", query: "Máy phay CNC", count: 160 },
    { labelVi: "Khuôn mẫu ép nhựa chính xác", labelEn: "Precision plastic molds", query: "Khuôn mẫu ép nhựa", count: 110 },
    { labelVi: "Gia công cắt laser kim loại", labelEn: "Laser Sheet Cutting", query: "Cắt laser kim loại", count: 140 },
    { labelVi: "Kiểm soát chất lượng QA/QC", labelEn: "QA/QC Quality Inspection", query: "Kiểm soát chất lượng", count: 60 }
  ],
  "4.3": [
    { labelVi: "Thuê xe nâng điện 2.5 tấn", labelEn: "Electric Forklift 2.5T", query: "Thuê xe nâng điện", count: 105 },
    { labelVi: "Dịch vụ kho bãi logistics", labelEn: "Warehousing Services", query: "Dịch vụ kho bãi", count: 90 },
    { labelVi: "Băng tải con lăn tự động", labelEn: "Automated Roller Conveyor", query: "Băng tải con lăn", count: 90 }
  ],
  "5.1": [
    { labelVi: "Cung ứng lao động thời vụ", labelEn: "Seasonal Labor Supply", query: "Cung ứng lao động", count: 130 },
    { labelVi: "Tuyển dụng kỹ sư nhà máy", labelEn: "Factory Engineer Headhunting", query: "Tuyển dụng kỹ sư", count: 75 },
    { labelVi: "Đào tạo an toàn lao động", labelEn: "Labor Safety Training", query: "Đào tạo an toàn lao động", count: 60 }
  ],
  "5.2": [
    { labelVi: "Suất ăn công nghiệp đạt chuẩn", labelEn: "Industrial Catering", query: "Suất ăn công nghiệp", count: 115 },
    { labelVi: "Xe đưa đón công nhân viên", labelEn: "Staff Commuter Shuttles", query: "Xe đưa đón công nhân", count: 80 },
    { labelVi: "Quà tặng công đoàn & phúc lợi", labelEn: "Union Welfare Gifts", query: "Quà tặng công đoàn", count: 65 }
  ],
  "5.3": [
    { labelVi: "May đồng phục công nhân nhà máy", labelEn: "Factory Worker Uniforms", query: "Đồng phục công nhân", count: 145 },
    { labelVi: "Xưởng may Balo túi xách quà tặng", labelEn: "Backpack & Bag Factory", query: "May balo túi xách", count: 160 },
    { labelVi: "Giày bảo hộ mũi thép chống đinh", labelEn: "Steel-toe Safety Shoes", query: "Giày bảo hộ", count: 120 },
    { labelVi: "Mũ nón & Áo phản quang PPE", labelEn: "PPE Helmets & Reflective Vests", query: "Áo phản quang", count: 95 }
  ],
  "6.1": [
    { labelVi: "Mở rộng phân xưởng giai đoạn 2", labelEn: "Phase 2 Factory Expansion", query: "Mở rộng phân xưởng", count: 40 },
    { labelVi: "Nâng cấp công suất dây chuyền", labelEn: "Capacity Upgrade", query: "Nâng cấp công suất", count: 55 }
  ],
  "6.2": [
    { labelVi: "Tư vấn chứng nhận ISO 9001/14001", labelEn: "ISO Certification Advisory", query: "Chứng nhận ISO", count: 85 },
    { labelVi: "Audit trách nhiệm xã hội BSCI/Sedex", labelEn: "BSCI / Sedex Social Audit", query: "Audit trách nhiệm xã hội", count: 45 },
    { labelVi: "Đo kiểm kiểm toán năng lượng", labelEn: "Energy Auditing", query: "Kiểm toán năng lượng", count: 35 }
  ],
  "6.3": [
    { labelVi: "Robot tự hành AGV nhà xưởng", labelEn: "Factory AGV Robot", query: "Robot tự hành AGV", count: 70 },
    { labelVi: "Điện mặt trời áp mái 1MWp", labelEn: "1MWp Rooftop Solar", query: "Điện mặt trời áp mái", count: 98 },
    { labelVi: "Hệ thống quản lý sản xuất MES", labelEn: "MES Production Software", query: "Hệ thống MES", count: 65 }
  ]
};

const DEFAULT_KEYWORDS = [
  { labelVi: "Máy phay CNC 5 trục", labelEn: "5-axis CNC Milling", query: "Máy phay CNC", count: 160 },
  { labelVi: "Thùng carton sóng 5 lớp", labelEn: "5-layer corrugated carton", query: "Thùng carton 5 lớp", count: 120 },
  { labelVi: "Khuôn mẫu ép nhựa chính xác", labelEn: "Precision plastic molds", query: "Khuôn mẫu ép nhựa", count: 110 },
  { labelVi: "Sơn sàn Epoxy kháng hóa chất", labelEn: "Chemical resistant Epoxy", query: "Sơn sàn Epoxy", count: 135 },
  { labelVi: "Trạm biến áp 22kV", labelEn: "22kV Substation", query: "Trạm biến áp 22kV", count: 85 },
  { labelVi: "Tủ điện điều khiển PLC", labelEn: "PLC Control Panel", query: "Tủ điện điều khiển PLC", count: 105 },
  { labelVi: "Băng tải con lăn tự động", labelEn: "Automated Roller Conveyor", query: "Băng tải con lăn", count: 90 },
  { labelVi: "Dầu thủy lực 68 công nghiệp", labelEn: "Hydraulic oil 68", query: "Dầu thủy lực 68", count: 92 },
  { labelVi: "Thuê xe nâng điện 2.5 tấn", labelEn: "Electric Forklift 2.5T", query: "Thuê xe nâng điện", count: 105 },
  { labelVi: "Robot tự hành AGV nhà xưởng", labelEn: "Factory AGV Robot", query: "Robot tự hành AGV", count: 70 },
  { labelVi: "Điện mặt trời áp mái 1MWp", labelEn: "1MWp Rooftop Solar", query: "Điện mặt trời áp mái", count: 98 },
  { labelVi: "Bu lông ốc vít cấp bền", labelEn: "High tensile fasteners", query: "Bu lông ốc vít", count: 95 }
];

export default function SupplierTopNavigationBlocks({
  selectedStage = 'all',
  selectedPhase = 'all',
  selectedCategory = 'all',
  selectedKeyword = '',
  selectedLetter: propSelectedLetter,
  onSelectStage,
  onSelectPhase,
  onSelectCategory,
  onSelectKeyword,
  onSelectLetter,
  initialLetter,
  layoutOrder = 'default' // 'default' or 'active-first' (Founding Partner -> 18 Phases -> A-Z)
}) {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  // Auto-detect matching phase & stage from category or keyword if phase is 'all'
  const detectedContext = useMemo(() => {
    if (selectedPhase !== 'all' && selectedPhase) {
      const match = MASTER_18_PHASES.find(p => p.id === selectedPhase);
      return { phase: selectedPhase, stage: match ? String(match.stage) : selectedStage || 'all' };
    }
    if (selectedCategory && selectedCategory !== 'all') {
      return detectPhaseAndStage(selectedCategory);
    }
    if (selectedKeyword) {
      return detectPhaseAndStage(selectedKeyword);
    }
    return { phase: selectedPhase || 'all', stage: selectedStage || 'all' };
  }, [selectedPhase, selectedStage, selectedCategory, selectedKeyword]);

  const effectivePhase = detectedContext.phase || 'all';
  const effectiveStage = detectedContext.stage || 'all';

  // Auto-detect letter from selected category if available
  const activeInitialLetter = useMemo(() => {
    if (propSelectedLetter) return propSelectedLetter;
    if (initialLetter) return initialLetter;
    if (selectedCategory && selectedCategory !== 'all') {
      const firstChar = selectedCategory.charAt(0).toUpperCase();
      const normalized = firstChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D');
      if (ALPHABET_LETTERS.includes(normalized)) return normalized;
    }
    return 'TẤT CẢ';
  }, [propSelectedLetter, initialLetter, selectedCategory]);

  const [internalSelectedLetter, setInternalSelectedLetter] = useState(activeInitialLetter);
  const selectedLetter = propSelectedLetter !== undefined ? propSelectedLetter : internalSelectedLetter;

  const handleSelectLetter = (letter) => {
    setInternalSelectedLetter(letter);
    if (onSelectLetter) {
      onSelectLetter(letter);
    }
  };

  // Sync letter when activeInitialLetter changes
  React.useEffect(() => {
    if (activeInitialLetter && propSelectedLetter === undefined) {
      setInternalSelectedLetter(activeInitialLetter);
    }
  }, [activeInitialLetter, propSelectedLetter]);

  // 6 Structured Stage Column Groups
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

  // Group categories by phase/stage
  const activeTaxonomyDataset = useMemo(() => {
    // 1. If a specific phase is selected
    if (effectivePhase !== 'all' && phaseTaxonomyAlphabetical[effectivePhase]) {
      return phaseTaxonomyAlphabetical[effectivePhase];
    }
    // 2. If a stage is selected (and phase is 'all')
    if (effectiveStage !== 'all') {
      const stageObj = stageColumns.find(col => String(col.id) === effectiveStage);
      if (stageObj && stageObj.phases) {
        const merged = {};
        stageObj.phases.forEach(ph => {
          const phData = phaseTaxonomyAlphabetical[ph.id];
          if (phData) {
            Object.entries(phData).forEach(([letter, list]) => {
              if (Array.isArray(list)) {
                if (!merged[letter]) merged[letter] = [];
                merged[letter].push(...list);
              }
            });
          }
        });
        if (Object.keys(merged).length > 0) return merged;
      }
    }
    // 3. Fallback to global categoriesAlphabetical
    return categoriesAlphabetical;
  }, [effectivePhase, effectiveStage]);

  // Dynamic Letter Counts
  const dynamicLetterCounts = useMemo(() => {
    const counts = {};
    ALPHABET_LETTERS.forEach(lettr => {
      const list = activeTaxonomyDataset[lettr];
      if (Array.isArray(list)) {
        counts[lettr] = list.reduce((sum, item) => sum + (item.count || 1), 0);
      } else {
        counts[lettr] = 0;
      }
    });
    return counts;
  }, [activeTaxonomyDataset]);

  // Categories for active letter
  const categoriesForLetter = useMemo(() => {
    if (selectedLetter === 'TẤT CẢ') {
      const allList = [];
      Object.values(activeTaxonomyDataset).forEach(arr => {
        if (Array.isArray(arr)) allList.push(...arr);
      });
      return allList;
    }
    return activeTaxonomyDataset[selectedLetter] || [];
  }, [selectedLetter, activeTaxonomyDataset]);

  // Current taxonomy keywords matching active phase or active letter
  const keywordsList = useMemo(() => {
    if (effectivePhase !== 'all' && PHASE_KEYWORDS_MAP[effectivePhase]) {
      return PHASE_KEYWORDS_MAP[effectivePhase];
    }
    if (selectedLetter && selectedLetter !== 'TẤT CẢ' && LETTER_KEYWORDS_MAP[selectedLetter]) {
      return LETTER_KEYWORDS_MAP[selectedLetter];
    }
    return DEFAULT_KEYWORDS;
  }, [effectivePhase, selectedLetter]);

  const handleStageClick = (stageId) => {
    if (onSelectStage) {
      onSelectStage(stageId);
    } else {
      navigate(`/nha-cung-ung?stage=${stageId}&phase=all`);
    }
  };

  const handlePhaseClick = (phaseId, stageId) => {
    if (onSelectPhase) {
      onSelectPhase(phaseId, stageId);
    } else {
      navigate(`/nha-cung-ung?phase=${phaseId}&stage=${stageId}`);
    }
  };

  const handleAllPhasesClick = () => {
    if (onSelectPhase) {
      onSelectPhase('all', 'all');
    } else {
      navigate(`/nha-cung-ung?phase=all&stage=all`);
    }
  };

  return (
    <div className="space-y-8">
      <SupplierDirectoryExplorer
        phases={MASTER_18_PHASES}
        categories={categoriesForLetter}
        letters={ALPHABET_LETTERS}
        keywords={keywordsList}
        selectedLetter={selectedLetter}
        effectivePhase={effectivePhase}
        effectiveStage={effectiveStage}
        selectedCategory={selectedCategory}
        selectedKeyword={selectedKeyword}
        letterCounts={dynamicLetterCounts}
        onAllPhases={handleAllPhasesClick}
        onStage={handleStageClick}
        onPhase={handlePhaseClick}
        onLetter={handleSelectLetter}
        onCategory={onSelectCategory}
        onKeyword={onSelectKeyword}
        lang={lang}
      />
    </div>
  );
}
