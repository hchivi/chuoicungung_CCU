import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shirt,
  Ship,
  Box,
  Wrench,
  Utensils,
  Cpu,
  Package,
  Layers,
  Tag,
  Zap,
  Thermometer,
  ShieldCheck,
  Coffee,
  Compass,
  LineChart,
  FileText,
  Warehouse,
  Factory,
  Handshake,
  ArrowRight,
  PlusCircle,
  ChevronRight,
  Pause,
  Play,
  RefreshCw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GEAR_OUTER_PATH, GEAR_INNER_PATH } from './gearContours';
import { MATCHING_CYCLE_MS, nextMatchingIndex, matchingCanRun } from './dualGearsUi';
import './DualGearsMatchingSection.css';

// Map icon names to Lucide components
const ICON_MAP = {
  Shirt,
  Ship,
  Box,
  Wrench,
  Utensils,
  Cpu,
  Package,
  Layers,
  Tag,
  Zap,
  Thermometer,
  ShieldCheck,
  Coffee,
  Compass,
  LineChart,
  FileText,
  Warehouse,
  Factory,
  Handshake,
};

export const MATCHING_SCENARIOS = [
  {
    id: 1,
    tag: "May đồng phục",
    stageNum: "05",
    factoryNeed: "Cần may 3.000 áo thun đồng phục công nhân KCN",
    supplierSolution: "Chuyên gia đồng phục & may mặc công nghiệp",
    matchRatio: "99.4%",
    demandNodes: [
      { id: "d1", icon: "Shirt", label: "Đồng phục", sub: "Áo polo & sơ mi" },
      { id: "d2", icon: "Package", label: "Bao bì", sub: "Đóng gói theo ca" },
      { id: "d3", icon: "Wrench", label: "Bảo trì", sub: "Bảo hộ lao động PPE" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Shirt", label: "May đồng phục", sub: "Xưởng 20.000 áo/tháng" },
      { id: "s2", icon: "Package", label: "In bao bì", sub: "In logo thương hiệu" },
      { id: "s3", icon: "Wrench", label: "Dịch vụ bảo trì", sub: "Cung cấp PPE chuẩn CE" },
    ],
    slugDemand: "/dang-nhu-cau?cat=may-mac",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=may-mac",
  },
  {
    id: 2,
    tag: "Logistics quốc tế",
    stageNum: "04",
    factoryNeed: "Cần ship hàng container xuất khẩu đi Mỹ & EU",
    supplierSolution: "Công ty Logistics quốc tế Portalink",
    matchRatio: "98.8%",
    demandNodes: [
      { id: "d1", icon: "Ship", label: "Vận tải biển", sub: "Cước FCL / LCL" },
      { id: "d2", icon: "FileText", label: "Thủ tục HQ", sub: "Thông quan hàng xuất" },
      { id: "d3", icon: "Warehouse", label: "Kho bãi", sub: "Kho gom hàng CFS" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Ship", label: "Portalink Global", sub: "Hợp đồng hãng tàu lớn" },
      { id: "s2", icon: "FileText", label: "Khai báo HQ", sub: "Thủ tục trọn gói 24h" },
      { id: "s3", icon: "Warehouse", label: "Kho ngoại quan", sub: "Lưu kho & đóng container" },
    ],
    slugDemand: "/dang-nhu-cau?cat=logistics",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=logistics",
  },
  {
    id: 3,
    tag: "Bao bì carton",
    stageNum: "04",
    factoryNeed: "Cần 50.000 thùng carton 5 lớp sóng BC xuất khẩu",
    supplierSolution: "Nhà máy bao bì Carton & in ấn Offset",
    matchRatio: "99.1%",
    demandNodes: [
      { id: "d1", icon: "Box", label: "Thùng carton", sub: "5 lớp chịu lực cao" },
      { id: "d2", icon: "Tag", label: "Tem nhãn", sub: "In barcode quản lý" },
      { id: "d3", icon: "Layers", label: "Màng PE", sub: "Quấn pallet chống ẩm" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Box", label: "Sản xuất Carton", sub: "100 tấn/ngày KCN" },
      { id: "s2", icon: "Tag", label: "In offset - Flexo", sub: "Độ sắc nét xuất khẩu" },
      { id: "s3", icon: "Layers", label: "Cung ứng màng PE", sub: "Độ bền dai tiêu chuẩn" },
    ],
    slugDemand: "/dang-nhu-cau?cat=bao-bi",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=bao-bi",
  },
  {
    id: 4,
    tag: "Bảo trì M&E",
    stageNum: "03",
    factoryNeed: "Cần bảo trì định kỳ trạm biến áp & hệ Chiller 500RT",
    supplierSolution: "Đơn vị kỹ thuật cơ điện lạnh M&E chuyên nghiệp",
    matchRatio: "97.9%",
    demandNodes: [
      { id: "d1", icon: "Zap", label: "Trạm biến áp", sub: "Thí nghiệm & lọc dầu" },
      { id: "d2", icon: "Thermometer", label: "Hệ Chiller", sub: "Bảo dưỡng AHU / FCU" },
      { id: "d3", icon: "Wrench", label: "Sửa chữa 24/7", sub: "Trực xử lý sự cố" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Zap", label: "Kỹ thuật M&E", sub: "Kỹ sư chứng chỉ cấp 4" },
      { id: "s2", icon: "Thermometer", label: "Tẩy rửa chiller", sub: "Hóa chất thân thiện" },
      { id: "s3", icon: "Wrench", label: "Dịch vụ khẩn cấp", sub: "Có mặt trong 60 phút" },
    ],
    slugDemand: "/dang-nhu-cau?cat=co-dien",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=co-dien",
  },
  {
    id: 5,
    tag: "Suất ăn KCN",
    stageNum: "05",
    factoryNeed: "Cần 2.000 suất ăn công nghiệp tiêu chuẩn ISO/HACCP",
    supplierSolution: "Hệ thống cung cấp suất ăn công nghiệp KCN",
    matchRatio: "98.5%",
    demandNodes: [
      { id: "d1", icon: "Utensils", label: "Suất ăn ca", sub: "Dinh dưỡng & định lượng" },
      { id: "d2", icon: "ShieldCheck", label: "An toàn VSTP", sub: "Bảo hiểm ngộ độc" },
      { id: "d3", icon: "Coffee", label: "Căn tin phụ", sub: "Cà phê & nước giải khát" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Utensils", label: "Bếp ăn 1 chiều", sub: "Nấu tại chỗ hoặc giao" },
      { id: "s2", icon: "ShieldCheck", label: "Chứng nhận HACCP", sub: "Lưu mẫu nghiệm thu 24h" },
      { id: "s3", icon: "Coffee", label: "Vận hành căn tin", sub: "Phục vụ ca kíp liên tục" },
    ],
    slugDemand: "/dang-nhu-cau?cat=suat-an",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=suat-an",
  },
  {
    id: 6,
    tag: "Tự động hóa",
    stageNum: "06",
    factoryNeed: "Cần tự động hóa đóng gói bằng robot bốc xếp & xe AGV",
    supplierSolution: "Công ty giải pháp tự động hóa & AI Công nghiệp",
    matchRatio: "99.2%",
    demandNodes: [
      { id: "d1", icon: "Cpu", label: "Robot bốc xếp", sub: "Palletizing tự động" },
      { id: "d2", icon: "Compass", label: "Xe tự hành AGV", sub: "Di chuyển nội bộ kho" },
      { id: "d3", icon: "LineChart", label: "Phần mềm MES", sub: "Quản lý dữ liệu OEE" },
    ],
    supplierNodes: [
      { id: "s1", icon: "Cpu", label: "Tích hợp Robot", sub: "Lập trình PLC & bàn giao" },
      { id: "s2", icon: "Compass", label: "Điều hướng LiDAR", sub: "Đội xe AGV thông minh" },
      { id: "s3", icon: "LineChart", label: "SCADA / MES", sub: "Kết nối ERP thời gian thực" },
    ],
    slugDemand: "/dang-nhu-cau?cat=tu-dong-hoa",
    slugSupplier: "/danh-sach-doanh-nghiep?cat=tu-dong-hoa",
  }
];

// 3 node positions on 3 lobes (Top: 270°, Bottom-Left: 150°, Bottom-Right: 30° / -30°)
// Radius r = 365px from gear center
const NODE_OFFSETS = [
  { x: 0, y: -365 },     // Top lobe
  { x: -316, y: 182 },  // Bottom-left lobe
  { x: 316, y: 182 },   // Bottom-right lobe
];

export default function DualGearsMatchingSection() {
  const sectionRef = useRef(null);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion();
    syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  const running = matchingCanRun({ paused, reducedMotion, hidden, inView, hubFocused: false });

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setActiveScenarioIndex(index => nextMatchingIndex(index, MATCHING_SCENARIOS.length));
    }, MATCHING_CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [running, activeScenarioIndex]);

  const current = MATCHING_SCENARIOS[activeScenarioIndex];

  return (
    <section
      ref={sectionRef}
      id="khop-lenh-cung-cau"
      className="dg-matching-console"
      data-running={running}
      aria-labelledby="dg-console-heading"
    >
      <div className="dg-console-shell">
        {/* TOP TITLE & CONTEXT */}
        <div className="dg-console-top">
          <div className="dg-tag-badge">
            <Sparkles size={14} className="text-amber-400" />
            <span>KẾT NỐI B2B CÔNG NGHIỆP TRỰC TIẾP · CHUOICUNGUNG.COM</span>
          </div>
          <h2 id="dg-console-heading" className="dg-console-title">
            BÁNH RĂNG CUNG CẦU KHỚP LỆNH CHÍNH XÁC
          </h2>
          <p className="dg-console-subtitle">
            Nhà máy đưa ra nhu cầu thực tế — Nền tảng tự động kết nối đúng nhà cung ứng có năng lực phù hợp nhất.
          </p>

          {/* SCENARIO SELECTOR TABS */}
          <div className="dg-scenario-pills" role="tablist" aria-label="Chọn tình huống kết nối cung cầu">
            {MATCHING_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                role="tab"
                aria-selected={activeScenarioIndex === idx}
                className={`dg-pill ${activeScenarioIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveScenarioIndex(idx)}
              >
                <span className="dg-pill-dot" />
                <span className="dg-pill-text">{sc.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DUAL HEADERS & EXAMPLES ROW */}
        <div className="dg-dual-headers">
          {/* LEFT: NHU CẦU NHÀ MÁY */}
          <div className="dg-header-col dg-col-left">
            <div className="dg-col-title-wrap">
              <span className="dg-indicator-glow left" />
              <h3 className="dg-title dg-title-left">NHU CẦU NHÀ MÁY</h3>
            </div>
            <div className="dg-example-card left" key={`fact-${current.id}`}>
              <span className="dg-example-badge left">Ví dụ thực tế</span>
              <p className="dg-example-text">"{current.factoryNeed}"</p>
            </div>
          </div>

          {/* RIGHT: NHÀ CUNG ỨNG (Strictly omitted "phù hợp") */}
          <div className="dg-header-col dg-col-right">
            <div className="dg-col-title-wrap">
              <span className="dg-indicator-glow right" />
              <h3 className="dg-title dg-title-right">NHÀ CUNG ỨNG</h3>
            </div>
            <div className="dg-example-card right" key={`supp-${current.id}`}>
              <span className="dg-example-badge right">Giải pháp khớp lệnh</span>
              <p className="dg-example-text">"{current.supplierSolution}"</p>
            </div>
          </div>
        </div>

        {/* MESHING GEARS ARENA (SVG) */}
        <div className="dg-gears-arena">
          <svg
            className="dg-gears-svg"
            viewBox="0 0 2110 1140"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Left Gear Body Gradient (Metallic Dark Slate Blue) */}
              <radialGradient id="dg-left-gear-fill" cx="40%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#1e2c44" />
                <stop offset="55%" stopColor="#111a2a" />
                <stop offset="100%" stopColor="#070c16" />
              </radialGradient>

              {/* Right Gear Body Gradient (Metallic Dark Charcoal Amber) */}
              <radialGradient id="dg-right-gear-fill" cx="40%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#3d2618" />
                <stop offset="55%" stopColor="#21150c" />
                <stop offset="100%" stopColor="#0b0704" />
              </radialGradient>

              {/* Inner White/Silver Core Flower */}
              <radialGradient id="dg-core-silver" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </radialGradient>

              {/* Electric Blue Glow Filter for Left Gear */}
              <filter id="dg-glow-blue" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#38bdf8" floodOpacity="0.9" />
                <feDropShadow dx="0" dy="0" stdDeviation="30" floodColor="#0284c7" floodOpacity="0.55" />
              </filter>

              {/* Warm Amber Glow Filter for Right Gear */}
              <filter id="dg-glow-amber" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#fb923c" floodOpacity="0.9" />
                <feDropShadow dx="0" dy="0" stdDeviation="30" floodColor="#ea580c" floodOpacity="0.55" />
              </filter>

              {/* Core 3D Shadow Filter */}
              <filter id="dg-core-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#000000" floodOpacity="0.75" />
              </filter>

              {/* Center Badge Glow */}
              <filter id="dg-center-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#38bdf8" floodOpacity="0.45" />
                <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#fb923c" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* LEFT GEAR: Centered at (570, 570) */}
            <g className="dg-rotor-group-left">
              <g transform="translate(570, 570)">
                {/* Outer Gear Tooth Mesh Contour */}
                <path
                  d={GEAR_OUTER_PATH}
                  fill="url(#dg-left-gear-fill)"
                  stroke="#38bdf8"
                  strokeWidth="13"
                  strokeLinejoin="round"
                  filter="url(#dg-glow-blue)"
                />
                {/* Inner Bevel Rim Highlight */}
                <path
                  d={GEAR_OUTER_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="3.5"
                  transform="scale(0.965)"
                />
                {/* Center 6-Petal White Flower Core */}
                <path
                  d={GEAR_INNER_PATH}
                  fill="url(#dg-core-silver)"
                  stroke="#ffffff"
                  strokeWidth="4"
                  filter="url(#dg-core-shadow)"
                />
              </g>
            </g>

            {/* RIGHT GEAR: Centered at (1540, 570) - Exactly 970px distance for interlocking teeth */}
            <g className="dg-rotor-group-right">
              <g transform="translate(1540, 570)">
                {/* Outer Gear Tooth Mesh Contour */}
                <path
                  d={GEAR_OUTER_PATH}
                  fill="url(#dg-right-gear-fill)"
                  stroke="#fb923c"
                  strokeWidth="13"
                  strokeLinejoin="round"
                  filter="url(#dg-glow-amber)"
                />
                {/* Inner Bevel Rim Highlight */}
                <path
                  d={GEAR_OUTER_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="3.5"
                  transform="scale(0.965)"
                />
                {/* Center 6-Petal White Flower Core */}
                <path
                  d={GEAR_INNER_PATH}
                  fill="url(#dg-core-silver)"
                  stroke="#ffffff"
                  strokeWidth="4"
                  filter="url(#dg-core-shadow)"
                />
              </g>
            </g>

            {/* LEFT GEAR BADGE NODES (Placed at 3 Lobes, counter-rotated to stay level) */}
            <g transform="translate(570, 570)" className="dg-nodes-layer-left">
              {current.demandNodes.map((node, i) => {
                const pos = NODE_OFFSETS[i];
                const IconComponent = ICON_MAP[node.icon] || Shirt;
                return (
                  <g
                    key={`lnode-${node.id}-${current.id}`}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="dg-node-item dg-node-left"
                  >
                    {/* Badge Circular Background */}
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="#0b1424"
                      stroke="#38bdf8"
                      strokeWidth="5"
                      filter="drop-shadow(0 0 16px rgba(56, 189, 248, 0.6))"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="60"
                      fill="#070d18"
                      stroke="rgba(56, 189, 248, 0.3)"
                      strokeWidth="2"
                    />

                    {/* Node Icon via foreignObject */}
                    <foreignObject x="-26" y="-38" width="52" height="52">
                      <div className="dg-svg-icon-wrap left">
                        <IconComponent size={34} strokeWidth={2.2} />
                      </div>
                    </foreignObject>

                    {/* Node Label Text */}
                    <text
                      x="0"
                      y="32"
                      fill="#ffffff"
                      fontSize="22"
                      fontWeight="800"
                      textAnchor="middle"
                      className="dg-node-svg-text"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* RIGHT GEAR BADGE NODES (Placed at 3 Lobes, counter-rotated to stay level) */}
            <g transform="translate(1540, 570)" className="dg-nodes-layer-right">
              {current.supplierNodes.map((node, i) => {
                const pos = NODE_OFFSETS[i];
                const IconComponent = ICON_MAP[node.icon] || Shirt;
                return (
                  <g
                    key={`rnode-${node.id}-${current.id}`}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="dg-node-item dg-node-right"
                  >
                    {/* Badge Circular Background */}
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="#26150a"
                      stroke="#fb923c"
                      strokeWidth="5"
                      filter="drop-shadow(0 0 16px rgba(251, 146, 60, 0.6))"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="60"
                      fill="#160c05"
                      stroke="rgba(251, 146, 60, 0.3)"
                      strokeWidth="2"
                    />

                    {/* Node Icon via foreignObject */}
                    <foreignObject x="-26" y="-38" width="52" height="52">
                      <div className="dg-svg-icon-wrap right">
                        <IconComponent size={34} strokeWidth={2.2} />
                      </div>
                    </foreignObject>

                    {/* Node Label Text */}
                    <text
                      x="0"
                      y="32"
                      fill="#ffffff"
                      fontSize="22"
                      fontWeight="800"
                      textAnchor="middle"
                      className="dg-node-svg-text"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* CENTER INTERLOCKING CONNECTION BADGE: (1055, 570) */}
            <g transform="translate(1055, 570)" className="dg-center-hub" filter="url(#dg-center-glow)">
              {/* Outer Glowing Capsule/Circle */}
              <circle cx="0" cy="0" r="115" fill="#090f1e" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />
              <circle
                cx="0"
                cy="0"
                r="110"
                fill="none"
                stroke="url(#dg-center-ring-gradient)"
                strokeWidth="4.5"
                strokeDasharray="16 8"
                className="dg-spinning-ring"
              />
              <circle cx="0" cy="0" r="98" fill="#060913" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

              <defs>
                <linearGradient id="dg-center-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>

              {/* Top Curved Arrow (Cyan -> Amber) */}
              <path
                d="M -48 -28 A 55 55 0 0 1 48 -28"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <polygon points="48,-40 60,-26 44,-20" fill="#38bdf8" />

              {/* Bottom Curved Arrow (Amber -> Cyan) */}
              <path
                d="M 48 28 A 55 55 0 0 1 -48 28"
                fill="none"
                stroke="#fb923c"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <polygon points="-48,40 -60,26 -44,20" fill="#fb923c" />

              {/* Center Main Text */}
              <text
                x="0"
                y="-2"
                fill="#ffffff"
                fontSize="24"
                fontWeight="900"
                letterSpacing="1"
                textAnchor="middle"
                className="dg-hub-main-text"
              >
                KHỚP
              </text>
              <text
                x="0"
                y="24"
                fill="#ffffff"
                fontSize="22"
                fontWeight="900"
                letterSpacing="1.2"
                textAnchor="middle"
                className="dg-hub-main-text"
              >
                NHU CẦU
              </text>

              {/* Status Indicator */}
              <g transform="translate(0, 54)">
                <circle cx="-38" cy="-4" r="4.5" fill="#10b981" className="dg-status-dot" />
                <text x="0" y="0" fill="#a7f3d0" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="1.5">
                  TỰ ĐỘNG · 1:1
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* MOBILE DETAILED CARDS BREAKDOWN */}
        <div className="dg-mobile-breakdown">
          <div className="dg-mb-card left">
            <div className="dg-mb-title">
              <span className="dg-dot left" />
              <strong>Nhu cầu nhà máy: {current.tag}</strong>
            </div>
            <p className="dg-mb-need">{current.factoryNeed}</p>
            <div className="dg-mb-nodes">
              {current.demandNodes.map(n => (
                <span key={n.id} className="dg-mb-chip left">{n.label}: {n.sub}</span>
              ))}
            </div>
          </div>

          <div className="dg-mb-connector">
            <RefreshCw size={18} className="text-amber-400 animate-spin" />
            <span>KHỚP NHU CẦU</span>
          </div>

          <div className="dg-mb-card right">
            <div className="dg-mb-title">
              <span className="dg-dot right" />
              <strong>Giải pháp nhà cung ứng</strong>
            </div>
            <p className="dg-mb-need">{current.supplierSolution}</p>
            <div className="dg-mb-nodes">
              {current.supplierNodes.map(n => (
                <span key={n.id} className="dg-mb-chip right">{n.label}: {n.sub}</span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="dg-console-actions">
          <Link to={current.slugDemand} className="dg-btn dg-btn-cyan">
            <PlusCircle size={18} />
            <span>ĐĂNG NHU CẦU NHÀ MÁY</span>
            <ArrowRight size={16} />
          </Link>

          <Link to={current.slugSupplier} className="dg-btn dg-btn-amber">
            <Handshake size={18} />
            <span>KẾT NỐI NHÀ CUNG ỨNG</span>
            <ChevronRight size={16} />
          </Link>

          <Link to="/ban-do-6-giai-doan" className="dg-btn dg-btn-outline">
            <Compass size={18} />
            <span>BẢN ĐỒ 6 GIAI ĐOẠN</span>
          </Link>

          <button
            type="button"
            className="dg-pause-btn"
            aria-pressed={paused}
            onClick={() => setPaused(v => !v)}
            title={paused ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
            <span>{paused ? "Tiếp tục" : "Tạm dừng"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
