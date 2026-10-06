import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2, MapPin, Calendar, Clock, DollarSign, ShieldCheck,
  CheckCircle2, Phone, Mail, Globe, MessageSquare, FileText,
  Download, ArrowLeft, Share2, Heart, Award, Sparkles, Send,
  Layers, ChevronRight, Eye, Users, AlertCircle, ExternalLink,
  Check, X, Plus, Edit3, RefreshCw, Upload, Filter, UserCheck,
  AlertTriangle, Play, PauseCircle, HelpCircle, Bot, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllMasterRequirements } from '../data/requirementsData';

export default function DemandWorkspacePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  // Tab state: 1 to 8 matching spec
  // 1: Tổng quan, 2: Nhà cung ứng, 3: Bằng chứng, 4: Mẫu / Khảo sát,
  // 5: Báo giá, 6: Trao đổi, 7: Việc tiếp theo, 8: Kết quả
  const [activeTab, setActiveTab] = useState('overview');

  // Industry Pipeline Mode (Flexible pipeline order per industry)
  // Options: 'apparel' (Mẫu -> Quote -> PO), 'cnc' (Quote -> Survey -> Sample), 'construction' (Survey -> Quote), 'packaging' (Quote -> Sample)
  const [pipelineProfile, setPipelineProfile] = useState('apparel');

  // Load demand data from localStorage or master requirements (An toàn: Không mock fallback khi sai ID - Mục 13, 31, 64)
  const [demandData, setDemandData] = useState(() => {
    const targetId = id || searchParams.get('id');
    try {
      if (targetId) {
        const savedById = localStorage.getItem('ccu_draft_' + targetId);
        if (savedById) return JSON.parse(savedById);

        const listStr = localStorage.getItem('ccu_user_demands');
        if (listStr) {
          const list = JSON.parse(listStr);
          const found = list.find(d => String(d.id) === String(targetId) || d.publicCode === targetId);
          if (found) return found;
        }

        const masterList = getAllMasterRequirements();
        const foundMaster = masterList.find(d => String(d.id) === String(targetId) || d.publicCode === targetId);
        if (foundMaster) return foundMaster;
      }

      const latestDraft = localStorage.getItem('ccu_requirement_draft');
      if (latestDraft) {
        const parsed = JSON.parse(latestDraft);
        if (!targetId || targetId.startsWith('REQ-') || parsed.id === targetId || parsed.publicCode === targetId) {
          return parsed;
        }
      }
    } catch (e) {}

    // Khách truy cập ID không tồn tại -> Trả về null để hiển thị 404/403 an toàn
    return null;
  });

  // State machine status for the demand (Section 13.1)
  const NEED_STATUS_FLOW = [
    { key: 'NEW', label: 'MỚI NHẬN' },
    { key: 'NEEDS_INFO', label: 'CẦN BỔ SUNG' },
    { key: 'CONFIRMED', label: 'ĐÃ XÁC NHẬN' },
    { key: 'ACTIVE_SOURCING', label: 'ĐANG TÌM NGUỒN' },
    { key: 'CONNECTING', label: 'ĐANG KẾT NỐI' },
    { key: 'DISCUSSING', label: 'ĐANG TRAO ĐỔI' },
    { key: 'COMPLETED', label: 'ĐÃ CÓ KẾT QUẢ' }
  ];

  const [currentNeedStatus, setCurrentNeedStatus] = useState('ACTIVE_SOURCING');

  // Supplier List State (Section 12 - Tab 2 & Section 13.2)
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-01',
      name: 'Công ty Cổ phần May Mặc Đông Nam',
      address: 'KCN Amata, TP. Biên Hòa, Đồng Nai',
      distance: 'Cách nhà máy 3.2 km',
      matchRate: 98,
      kycTier: 'KYC Kim Cương',
      capacity: '50.000 bộ/tháng · 4 xưởng may',
      status: 'ĐÃ BÁO GIÁ', // ĐỀ XUẤT -> ĐÃ MỜI -> ĐÃ PHẢN HỒI -> ĐÃ KẾT NỐI -> MẪU / KHẢO SÁT -> ĐÃ BÁO GIÁ -> THƯƠNG LƯỢNG -> CÓ KẾT QUẢ
      quotePrice: '185.000 VNĐ / bộ',
      quoteTotal: '92.500.000 VNĐ',
      quoteFile: 'BG_DongNam_500bo_Kaki.pdf',
      sampleStatus: 'Đã gửi mẫu vải (Đang nghiệm thu)',
      avatar: '/mascots/SUPPI_2.png',
      isTopPick: true
    },
    {
      id: 'SUP-02',
      name: 'Công ty TNHH Dệt May & Bảo Hộ Sài Gòn',
      address: 'KCN Sóng Thần 2, Dĩ An, Bình Dương',
      distance: 'Cách nhà máy 18 km',
      matchRate: 95,
      kycTier: 'KYC Vàng',
      capacity: '30.000 bộ/tháng · Tiêu chuẩn xuất khẩu',
      status: 'MẪU / KHẢO SÁT',
      quotePrice: '195.000 VNĐ / bộ',
      quoteTotal: '97.500.000 VNĐ',
      quoteFile: 'BaoGia_DetMaySG_2026.xlsx',
      sampleStatus: 'Chuẩn bị gửi mẫu áo test',
      avatar: '/logo_onlyc.png',
      isTopPick: false
    },
    {
      id: 'SUP-03',
      name: 'Tổng Công ty Sản Xuất May Mặc Việt Thắng',
      address: 'KCN Biên Hòa 2, TP. Biên Hòa, Đồng Nai',
      distance: 'Cách nhà máy 6.5 km',
      matchRate: 91,
      kycTier: 'KYC Kim Cương',
      capacity: '80.000 bộ/tháng',
      status: 'ĐÃ PHẢN HỒI',
      quotePrice: '210.000 VNĐ / bộ',
      quoteTotal: '105.000.000 VNĐ',
      quoteFile: null,
      sampleStatus: 'Chưa gửi mẫu',
      avatar: '/logo_onlyc.png',
      isTopPick: false
    }
  ]);

  // Tasks Tracker State (Section 12 - Tab 7 & Section 13.3)
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-1',
      title: 'Kiểm tra và nghiệm thu mẫu áo Kaki 65/35 từ May Đông Nam',
      ownerUserId: 'Nguyễn Văn Nam (Trưởng phòng mua hàng)',
      deadline: '2026-09-30 15:00',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      isOverdue: false
    },
    {
      id: 'TSK-2',
      title: 'Đối chiếu điều khoản thanh toán (Tạm ứng 30% vs 50%)',
      ownerUserId: 'Trần Thị Mai (Kế toán mua sắm)',
      deadline: '2026-10-02 17:00',
      status: 'PENDING',
      priority: 'MEDIUM',
      isOverdue: false
    },
    {
      id: 'TSK-3',
      title: 'Lên lịch khảo sát đo size trực tiếp cho 120 công nhân xưởng 2',
      ownerUserId: 'Phạm Hùng (Quản đốc xưởng)',
      deadline: '2026-10-05 10:00',
      status: 'PENDING',
      priority: 'NORMAL',
      isOverdue: false
    }
  ]);

  // Timeline / Notes state (Section 12 - Tab 6)
  const [timelineNotes, setTimelineNotes] = useState([
    {
      id: 'NOTE-1',
      author: 'SUPPI AI Matcher',
      type: 'AI_EVENT',
      time: '10:45 hôm nay',
      content: 'Đã nhận diện nhu cầu từ AI Workspace. Phân tích 13 trường chuẩn hóa và gán nhãn Pha 4.2.'
    },
    {
      id: 'NOTE-2',
      author: 'Nguyễn Văn Nam (Thu mua)',
      type: 'INTERNAL_NOTE',
      time: '11:15 hôm nay',
      content: 'Nhà máy yêu cầu chất liệu Kaki 65/35 không xù lông sau khi giặt công nghiệp. Ưu tiên xưởng có kiểm định OEKO-TEX.'
    },
    {
      id: 'NOTE-3',
      author: 'May Mặc Đông Nam',
      type: 'SUPPLIER_REPLY',
      time: '11:40 hôm nay',
      content: 'Chúng tôi nhận may mẫu miễn phí 2 bộ và gửi đến xưởng KCN Amata trong 48h. Báo giá trọn gói 185.000 VNĐ/bộ đã bao gồm in logo.'
    }
  ]);

  const [newNoteText, setNewNoteText] = useState('');
  const [isInternalOnly, setIsInternalOnly] = useState(true);

  // Result Selection state (Section 12 - Tab 8)
  const [finalResult, setFinalResult] = useState({
    outcome: 'selected', // 'selected' | 'not_suitable' | 'paused' | 'unknown'
    selectedSupplierId: 'SUP-01',
    contractValue: '92.500.000 VNĐ',
    reason: 'Giá cạnh tranh nhất, đáp ứng đầy đủ chứng chỉ OEKO-TEX và ISO 9001, vị trí xưởng tại KCN Amata thuận lợi kiểm tra định kỳ.',
    rating: 5,
    closedAt: null
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: 'NOTE-' + Date.now(),
      author: 'Bạn (Phòng Mua hàng)',
      type: isInternalOnly ? 'INTERNAL_NOTE' : 'PUBLIC_MESSAGE',
      time: 'Vừa xong',
      content: newNoteText.trim()
    };
    setTimelineNotes(prev => [newEntry, ...prev]);
    setNewNoteText('');
  };

  const handleSelectWinner = (supplierId) => {
    const s = suppliers.find(item => item.id === supplierId);
    if (!s) return;
    setFinalResult({
      outcome: 'selected',
      selectedSupplierId: supplierId,
      contractValue: s.quoteTotal || 'Theo thỏa thuận',
      reason: `Đã chọn ${s.name} do đáp ứng tối ưu yêu cầu kỹ thuật và đơn giá hợp lý.`,
      rating: 5,
      closedAt: new Date().toLocaleDateString('vi-VN')
    });
    setActiveTab('result');
  };

  if (!demandData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Không Tìm Thấy Hồ Sơ Nhu Cầu
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Mã nhu cầu <strong className="text-slate-800">{id || 'không xác định'}</strong> không tồn tại trong hệ thống hoặc bạn chưa có quyền truy cập. Vui lòng kiểm tra lại đường dẫn.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/san-nhu-cau"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition text-center shadow-xs"
            >
              Về Sàn Nhu Cầu B2B
            </Link>
            <Link
              to="/dang-nhu-cau"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition text-center"
            >
              Đăng Nhu Cầu Mới
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 pt-6 font-sans bg-slate-50 min-h-screen">

      {/* Top Breadcrumb & Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-xs text-slate-500 flex flex-wrap items-center space-x-2">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <span>&gt;</span>
          <Link to="/tai-khoan" className="hover:text-[#0052cc]">Tài khoản</Link>
          <span>&gt;</span>
          <Link to="/nhu-cau" className="hover:text-[#0052cc]">Nhu cầu của tôi</Link>
          <span>&gt;</span>
          <span className="text-[#0052cc] font-semibold">{demandData.id}</span>
        </div>

        {/* WORKSPACE HERO HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0052cc] text-xs font-black uppercase font-mono tracking-wider">
                  WORKSPACE NHU CẦU
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                  Mã: {demandData.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase font-mono">
                  {currentNeedStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
                  Phạm vi: {demandData.visibility === 'ONLY_MATCHED' ? 'Chỉ NCC phù hợp' : (demandData.visibility === 'PRIVATE' ? 'Riêng tư' : 'Công khai Sàn')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                {demandData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-[#0052cc]" />
                  {demandData.kcn}, {demandData.location}
                </span>
                <span className="text-slate-300">·</span>
                <span>Số lượng: <strong className="text-slate-900">{demandData.quantity} {demandData.unit}</strong></span>
                <span className="text-slate-300">·</span>
                <span>Hạn chót: <strong className="text-slate-900">{demandData.deadline}</strong></span>
                <span className="text-slate-300">·</span>
                <span>Ngân sách: <strong className="text-[#0052cc] font-mono">{demandData.budgetMin} - {demandData.budgetMax} VNĐ</strong></span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to={`/tro-ly-ai?need=${demandData.id}`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0052cc] to-sky-600 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Chat SUPPI & CHAINY</span>
              </Link>

              <Link
                to={`/dang-nhu-cau?draft=${demandData.id}`}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa thông số</span>
              </Link>
            </div>
          </div>

          {/* Section 12 Special Rule: Mẫu, khảo sát, quote diễn ra khác thứ tự theo ngành */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ⚙
              </span>
              <div>
                <strong className="text-blue-950 font-heading">Quy trình linh hoạt theo ngành: </strong>
                <span className="text-blue-900 font-medium">Không ép mọi ngành vào một pipeline cố định. Tùy đặc thù ngành mà xem mẫu, khảo sát hoặc báo giá trước.</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
              <span className="text-[11px] text-slate-500 font-bold">Mô hình:</span>
              {[
                { key: 'apparel', label: 'May mặc (Mẫu → Quote)' },
                { key: 'cnc', label: 'Cơ khí (Quote → Đo đạc → Mẫu)' },
                { key: 'construction', label: 'MEP (Khảo sát → Dự toán)' },
                { key: 'packaging', label: 'Bao bì (Quote → Test in)' }
              ].map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPipelineProfile(p.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${pipelineProfile === p.key
                    ? 'bg-[#0052cc] text-white shadow-2xs'
                    : 'bg-white hover:bg-blue-100 text-slate-700 border border-blue-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 8 SPECIFIC TABS AS DEFINED IN SPEC */}
          <div className="border-t border-slate-100 pt-2 overflow-x-auto">
            <nav className="flex space-x-1.5 min-w-max pb-1">
              {[
                { id: 'overview', num: 1, label: 'Tổng quan', desc: 'Yêu cầu + Version' },
                { id: 'suppliers', num: 2, label: 'Nhà cung ứng', desc: 'Xem xét / Mời / Phản hồi', count: suppliers.length },
                { id: 'evidence', num: 3, label: 'Bằng chứng', desc: 'Capability & Tiêu chuẩn' },
                { id: 'samples', num: 4, label: 'Mẫu / Khảo sát', desc: 'Lịch & Nghiệm thu' },
                { id: 'quotes', num: 5, label: 'Báo giá', desc: 'Tệp, Hiệu lực & Điều kiện', count: 2 },
                { id: 'messages', num: 6, label: 'Trao đổi', desc: 'Timeline & Note', count: timelineNotes.length },
                { id: 'tasks', num: 7, label: 'Việc tiếp theo', desc: 'Owner, Task, Deadline', count: tasks.length },
                { id: 'result', num: 8, label: 'Kết quả', desc: 'Selected / Status' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-2xl text-left transition cursor-pointer flex items-center space-x-2 ${activeTab === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] font-mono font-bold ${activeTab === tab.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.num}
                  </span>
                  <div>
                    <div className="text-xs font-heading font-black leading-tight flex items-center gap-1.5">
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#0052cc]'}`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] ${activeTab === tab.id ? 'text-blue-100' : 'text-slate-400'} font-normal`}>
                      {tab.desc}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* WORKSPACE CONTENT AREA (TAB SWITCHER) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ======================================================== */}
        {/* TAB 1: TỔNG QUAN — YÊU CẦU HIỆN TẠI + VERSION */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 cols: Current Requirement specs */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                  YÊU CẦU HIỆN TẠI (CURRENT SPECIFICATION)
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                  Phiên bản: v1.2 (Active)
                </span>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Sản phẩm / Dịch vụ:</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{demandData.productService}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Số lượng & Đơn vị:</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{demandData.quantity} {demandData.unit}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Địa bàn & KCN giao hàng:</span>
                  <strong className="text-slate-900 block mt-0.5">{demandData.kcn}, {demandData.location}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Thời gian cần hoàn thành:</span>
                  <strong className="text-slate-900 block mt-0.5">{demandData.deadline}</strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Khung ngân sách dự kiến:</span>
                  <strong className="text-[#0052cc] font-mono block mt-0.5">
                    {demandData.budgetMin} - {demandData.budgetMax} VNĐ
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Tiêu chuẩn bắt buộc:</span>
                  <strong className="text-slate-900 block mt-0.5">{demandData.certificationRequirements}</strong>
                </div>
              </div>

              {/* Full Specs */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wide font-heading block">
                  Tiêu chí kỹ thuật chi tiết:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {demandData.specifications}
                </p>
              </div>

              {/* Delivery and Samples */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Yêu cầu gửi mẫu thực tế:</span>
                  <strong className="text-emerald-700 font-bold block mt-0.5">
                    {demandData.sampleRequired ? '✓ Bắt buộc duyệt mẫu trước' : 'Không bắt buộc'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Yêu cầu khảo sát xưởng:</span>
                  <strong className="text-slate-800 font-bold block mt-0.5">
                    {demandData.surveyRequired ? '✓ Khảo sát đo đạc thực tế' : 'Không yêu cầu'}
                  </strong>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
                <span><strong>Doanh nghiệp:</strong> {demandData.companyName}</span>
                <span><strong>Người phụ trách:</strong> {demandData.contactName} ({demandData.phone})</span>
              </div>
            </div>

            {/* Right 4 cols: Version History (Audit Trail) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
              <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider font-heading">
                LỊCH SỬ PHIÊN BẢN (VERSION HISTORY)
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 font-heading">v1.2 (Hiện tại)</span>
                    <span className="text-[10px] text-blue-700 font-mono font-bold">28/09/2026</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700">
                    Xác nhận nhu cầu và chuyển trạng thái sang ACTIVE_SOURCING. Bổ sung thông số vải Kaki 65/35 may 2 kim và tiêu chuẩn OEKO-TEX.
                  </p>
                  <span className="text-[10px] text-slate-500 block pt-1">Thực hiện bởi: Doanh nghiệp + SUPPI</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-heading">v1.1</span>
                    <span className="text-[10px] text-slate-500 font-mono">28/09/2026</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600">
                    Làm rõ địa bàn giao hàng tại KCN Amata Đồng Nai và xác định số lượng 500 bộ từ cuộc hội thoại AI Workspace.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">Thực hiện bởi: SUPPI AI Scout</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 font-heading">v1.0 (Khởi tạo)</span>
                    <span className="text-[10px] text-slate-500 font-mono">28/09/2026</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600">
                    Tự động tạo bản nháp nhu cầu (DRAFT_AI) ở nền khi nhận diện truy vấn mua sắm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: NHÀ CUNG ỨNG — ĐƯỢC XEM XÉT / MỜI / PHẢN HỒI */}
        {/* ======================================================== */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                  DANH SÁCH NHÀ CUNG ỨNG ĐƯỢC SUPPI KHỚP LỆNH ({suppliers.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân loại theo pipeline: Đề xuất → Đã mời → Đã phản hồi → Mẫu / Khảo sát → Đã báo giá → Chốt kết quả.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('quotes')}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#0052cc] font-bold text-xs border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                >
                  Xem bảng so sánh báo giá →
                </button>
              </div>
            </div>

            {/* Suppliers Cards */}
            <div className="space-y-4">
              {suppliers.map(s => (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border-2 transition ${s.isTopPick ? 'bg-gradient-to-r from-blue-50/60 via-white to-sky-50/40 border-blue-300 shadow-xs' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0052cc] flex items-center justify-center font-black text-sm shrink-0 border border-blue-200">
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-sm sm:text-base text-slate-900 font-heading">
                            {s.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10.5px] border border-amber-300">
                            {s.kycTier}
                          </span>
                          {s.isTopPick && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10.5px] border border-emerald-300">
                              ★ SUPPI khuyên chọn
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {s.address} ({s.distance})
                          </span>
                          <span className="text-slate-300">·</span>
                          <span>Năng lực: <strong>{s.capacity}</strong></span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <span className="text-slate-500">
                            Trạng thái pipeline: <strong className="text-[#0052cc]">{s.status}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            Báo giá: <strong className="text-emerald-700 font-mono">{s.quotePrice || 'Chưa gửi'}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            Mẫu thử: <strong className="text-slate-700">{s.sampleStatus}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions & Match Score */}
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Độ khớp lệnh</div>
                        <div className="text-lg font-black text-emerald-600 font-mono">
                          {s.matchRate}%
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectWinner(s.id)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Chọn NCC này
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('messages')}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Nhắn tin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BẰNG CHỨNG — CAPABILITY, CHỨNG CHỈ, DỮ LIỆU CÒN THIẾU */}
        {/* ======================================================== */}
        {activeTab === 'evidence' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                BẰNG CHỨNG NĂNG LỰC & XÁC THỰC DỮ LIỆU (SECTION 14)
              </h3>
              <p className="text-xs text-slate-500">
                SUPPI phân biệt 4 nhóm dữ liệu: Dữ liệu đã xác nhận · Dữ liệu tự khai · Dữ liệu cần xác nhận · Dữ liệu còn thiếu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Group 1: Dữ liệu đã xác nhận (Verified) */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-900 font-heading uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Dữ liệu đã xác nhận (Verified Data)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px]">
                    100% Tin cậy
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700">
                    <strong>Chứng chỉ ISO 9001:2015:</strong> Còn hiệu lực đến 15/08/2027. Tổ chức cấp: Quacert. (Mã kiểm tra: QC-2024-88)
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700">
                    <strong>Chứng chỉ OEKO-TEX Standard 100:</strong> Mã chứng nhận VN-2024-889 kiểm nghiệm an toàn hóa chất vải.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700">
                    <strong>Kiểm xưởng thực tế tại KCN Amata:</strong> Đội ngũ thẩm định CCU đã kiểm tra nhà máy ngày 15/06/2026.
                  </div>
                </div>
              </div>

              {/* Group 2: Dữ liệu NCC tự khai (Self-declared) */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-blue-900 font-heading uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>2. Dữ liệu NCC tự khai (Self-Declared)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-bold text-[10px]">
                    Khai báo trực tuyến
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-slate-700">
                    <strong>Quy mô công suất:</strong> 50.000 bộ/tháng với 120 công nhân may chính quy.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-slate-700">
                    <strong>Thời gian may mẫu:</strong> Cam kết 3 - 5 ngày làm việc.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-slate-700">
                    <strong>Tỷ lệ đúng hạn tự khai:</strong> 99.4% trong năm 2025.
                  </div>
                </div>
              </div>

              {/* Group 3: Dữ liệu cần xác nhận thêm (Pending) */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-900 font-heading uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>3. Dữ liệu cần xác nhận thêm (Pending Verification)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                    Cần nghiệm thu mẫu
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100 text-slate-700">
                    <strong>Độ bền màu & In logo chịu nhiệt:</strong> Cần giặt test mẫu thực tế trước khi duyệt hợp đồng hàng loạt.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100 text-slate-700">
                    <strong>CO/CQ nguồn gốc sợi dệt:</strong> NCC cần xuất trình hồ sơ hải quan cho lô vải Kaki nhập khẩu.
                  </div>
                </div>
              </div>

              {/* Group 4: Dữ liệu còn thiếu / Khuyến nghị SUPPI */}
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-900 font-heading uppercase tracking-wide flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>4. Đánh giá & Khuyến nghị của SUPPI</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-bold text-[10px]">
                    Phân tích AI
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1.5 text-slate-700">
                  <div className="font-bold text-purple-950">
                    Kết luận đối chiếu: "Có khả năng phù hợp — Cần xác nhận thêm khi nhận mẫu vải."
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Xưởng May Đông Nam nằm tại KCN Amata đáp ứng 100% tiêu chí địa bàn và ISO. Để loại bỏ rủi ro xù vải, bạn nên đợi nhận mẫu áo kiểm nghiệm vào ngày 30/09 trước khi ký hợp đồng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MẪU / KHẢO SÁT — LỊCH, CHI PHÍ, KẾT QUẢ */}
        {/* ======================================================== */}
        {activeTab === 'samples' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                  THEO DÕI MẪU VẬT PHẨM & LỊCH KHẢO SÁT THỰC TẾ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý tiến độ may mẫu vải, đo đạc mặt bằng xưởng và biên bản nghiệm thu trước hợp đồng.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm lịch hẹn mẫu / khảo sát</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Sample */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm font-heading">
                    MẪU VẢI & FORM ÁO THỬ NGHIỆM (#SMP-01)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0052cc] font-bold text-[10.5px]">
                    Đang may mẫu
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <div><strong>Đơn vị thực hiện:</strong> May Mặc Đông Nam</div>
                  <div><strong>Lịch giao mẫu dự kiến:</strong> 30/09/2026 (15:00)</div>
                  <div><strong>Chi phí mẫu:</strong> <span className="text-emerald-700 font-bold">Miễn phí (Tài trợ cho đơn hàng 500 bộ)</span></div>
                  <div><strong>Quy cách mẫu:</strong> 02 bộ áo Kaki 65/35 size L và XL, thêu logo mẫu thử.</div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Người nhận: Nguyễn Văn Nam</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                  >
                    Duyệt nghiệm thu mẫu
                  </button>
                </div>
              </div>

              {/* Card 2: Survey */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm font-heading">
                    KHẢO SÁT ĐO SIZE TẬN NƠI (#SRV-02)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10.5px]">
                    Chờ sau duyệt mẫu
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-700">
                  <div><strong>Đơn vị phụ trách:</strong> Đội kỹ thuật đo Đông Nam</div>
                  <div><strong>Thời gian dự kiến:</strong> 05/10/2026 (sau khi duyệt mẫu vải)</div>
                  <div><strong>Địa điểm:</strong> Nhà xưởng số 2, KCN Amata, Đồng Nai</div>
                  <div><strong>Quy mô khảo sát:</strong> Đo size trực tiếp cho 120 công nhân ca sáng.</div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Người điều phối xưởng: Quản đốc Hùng</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-[11px] hover:bg-slate-100 cursor-pointer"
                  >
                    Chỉnh sửa lịch hẹn
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BÁO GIÁ — TỆP, HIỆU LỰC, ĐIỀU KIỆN */}
        {/* ======================================================== */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                  BẢNG SO SÁNH BÁO GIÁ CẠNH TRANH (QUOTATIONS)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  So sánh tệp báo giá, đơn giá, tổng tiền, điều kiện thanh toán và thời hạn hiệu lực.
                </p>
              </div>

              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất bảng Excel so sánh</span>
              </button>
            </div>

            {/* Quotations Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="p-3.5 rounded-l-xl font-heading">Nhà cung ứng</th>
                    <th className="p-3.5">Đơn giá / bộ</th>
                    <th className="p-3.5">Tổng tiền (500 bộ)</th>
                    <th className="p-3.5">Tệp báo giá</th>
                    <th className="p-3.5">Hiệu lực</th>
                    <th className="p-3.5">Điều kiện thanh toán</th>
                    <th className="p-3.5 rounded-r-xl text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-blue-50/40 hover:bg-blue-50/70 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>Công ty CP May Mặc Đông Nam</div>
                      <span className="text-[10.5px] text-emerald-700 font-semibold">★ Lựa chọn tối ưu</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 font-mono">185.000 VNĐ</td>
                    <td className="p-3.5 font-black text-[#0052cc] font-mono text-sm">92.500.000 VNĐ</td>
                    <td className="p-3.5">
                      <a href="#download" className="text-[#0052cc] hover:underline flex items-center gap-1 font-bold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>BG_DongNam_500bo.pdf</span>
                      </a>
                    </td>
                    <td className="p-3.5 text-slate-600">30 ngày (đến 28/10)</td>
                    <td className="p-3.5 text-slate-600">Tạm ứng 30% · 70% sau nghiệm thu</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectWinner('SUP-01')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Chấp thuận giá
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>Dệt May & Bảo Hộ Sài Gòn</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 font-mono">195.000 VNĐ</td>
                    <td className="p-3.5 font-bold text-slate-800 font-mono">97.500.000 VNĐ</td>
                    <td className="p-3.5">
                      <a href="#download" className="text-[#0052cc] hover:underline flex items-center gap-1 font-bold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>BaoGia_DetMaySG.xlsx</span>
                      </a>
                    </td>
                    <td className="p-3.5 text-slate-600">20 ngày (đến 18/10)</td>
                    <td className="p-3.5 text-slate-600">Thanh toán 100% trong 15 ngày sau hóa đơn</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectWinner('SUP-02')}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Chọn thầu
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>May Mặc Việt Thắng</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 font-mono">210.000 VNĐ</td>
                    <td className="p-3.5 font-bold text-slate-800 font-mono">105.000.000 VNĐ</td>
                    <td className="p-3.5 text-slate-400">Chưa nộp tệp</td>
                    <td className="p-3.5 text-slate-600">15 ngày</td>
                    <td className="p-3.5 text-slate-600">Thanh toán theo tiến độ 3 đợt</td>
                    <td className="p-3.5 text-right">
                      <span className="text-slate-400 font-medium">Vượt ngân sách</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: TRAO ĐỔI — TIMELINE CHAT / NOTE ĐƯỢC PHÉP LƯU */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                NHẬT KÝ TRAO ĐỔI & GHI CHÚ NỘI BỘ (TIMELINE)
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ dòng sự kiện, tin nhắn từ AI, phản hồi của nhà cung ứng và các ghi chú nội bộ được phép lưu trữ an toàn.
              </p>
            </div>

            {/* Post Note Form */}
            <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <textarea
                rows="2"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Nhập ghi chú nội bộ hoặc nội dung trao đổi cần lưu lại..."
                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalOnly}
                    onChange={(e) => setIsInternalOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span className="font-semibold text-slate-700">
                    Ghi chú bảo mật nội bộ (Chỉ đội ngũ mua sắm thấy)
                  </span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu ghi chú</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="space-y-3 pt-2">
              {timelineNotes.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${item.type === 'AI_EVENT' ? 'bg-blue-50/70 border-blue-200' : (item.type === 'INTERNAL_NOTE' ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200')}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-heading flex items-center gap-1.5">
                      {item.type === 'AI_EVENT' && <Bot className="w-3.5 h-3.5 text-[#0052cc]" />}
                      {item.type === 'INTERNAL_NOTE' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{item.author}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: VIỆC TIẾP THEO — OWNER, TASK, DEADLINE (SECTION 13.3) */}
        {/* ======================================================== */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0052cc] text-[10.5px] font-black uppercase font-mono">
                    QUY TẮC SECTION 13.3
                  </span>
                  <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                    VIỆC CẦN LÀM TIẾP THEO (NEXT ACTIONS)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Không cho phép một nhu cầu đang xử lý thiếu: <code>ownerUserId, nextAction, nextActionAt, status, lastUpdatedAt</code>. Quá hạn sẽ cảnh báo nổi bật.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0041a8] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Giao việc mới</span>
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-3">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition ${t.isOverdue ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200 hover:border-blue-200'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 font-bold">{t.id}</span>
                      <strong className="text-slate-900 text-sm font-heading">{t.title}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                        {t.priority === 'HIGH' ? 'Ưu tiên cao' : 'Bình thường'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      <span><strong>Người phụ trách (Owner):</strong> {t.ownerUserId}</span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 font-mono text-[#0052cc] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Hạn chót: {t.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#0052cc] font-bold text-[11px]">
                      {t.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Chờ đến hạn'}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Hoàn thành
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: KẾT QUẢ — SELECTED / NOT SUITABLE / PAUSED / UNKNOWN */}
        {/* ======================================================== */}
        {activeTab === 'result' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h3 className="text-base font-black text-slate-900 font-heading uppercase tracking-wide">
                KẾT QUẢ XỬ LÝ NHU CẦU (OUTCOME)
              </h3>
              <p className="text-xs text-slate-500">
                Lựa chọn kết quả cuối cùng: Chọn nhà cung ứng (Selected) · Không phù hợp · Tạm dừng · Chưa xác định.
              </p>
            </div>

            {/* 4 Outcome Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { key: 'selected', label: '1. ĐÃ CHỌN NCC (Selected)', desc: 'Đã đàm phán thành công và chọn đối tác chính thức.', color: 'emerald' },
                { key: 'not_suitable', label: '2. KHÔNG PHÙ HỢP (Not Suitable)', desc: 'Các NCC chưa đáp ứng được giá hoặc tiêu chuẩn.', color: 'rose' },
                { key: 'paused', label: '3. TẠM DỪNG (Paused)', desc: 'Tạm hoãn nhu cầu do thay đổi kế hoạch sản xuất.', color: 'amber' },
                { key: 'unknown', label: '4. CHƯA XÁC ĐỊNH (Unknown)', desc: 'Tiếp tục tìm kiếm thêm nguồn cung mới.', color: 'slate' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFinalResult(prev => ({ ...prev, outcome: opt.key }))}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer space-y-1.5 ${finalResult.outcome === opt.key
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="font-black text-slate-900 font-heading text-xs">
                    {opt.label}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Detail Outcome Form */}
            {finalResult.outcome === 'selected' && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-heading font-black text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>XÁC NHẬN NHÀ CUNG ỨNG TRÚNG THẦU</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Nhà cung ứng được chọn:</label>
                    <select
                      value={finalResult.selectedSupplierId}
                      onChange={(e) => setFinalResult({ ...finalResult, selectedSupplierId: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.quotePrice || 'Đang thương lượng'})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Giá trị hợp đồng thực tế:</label>
                    <input
                      type="text"
                      value={finalResult.contractValue}
                      onChange={(e) => setFinalResult({ ...finalResult, contractValue: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold font-mono text-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Lý do chọn & Ghi chú nghiệm thu:</label>
                  <textarea
                    rows="2"
                    value={finalResult.reason}
                    onChange={(e) => setFinalResult({ ...finalResult, reason: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-slate-600 text-[11px]">
                    Hệ thống sẽ lưu trữ hồ sơ và cập nhật lịch sử uy tín cho nhà cung ứng.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentNeedStatus('COMPLETED');
                      alert('✓ Đã cập nhật kết quả nhu cầu thành công!');
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Lưu & Đóng quy trình tìm nguồn
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
