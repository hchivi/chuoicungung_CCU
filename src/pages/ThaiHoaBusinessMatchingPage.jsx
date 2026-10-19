import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, Search, Filter, Download,
  Share2, ChevronRight, CheckCircle2, Phone, Mail, Globe,
  MessageCircle, ExternalLink, RotateCcw, FileText, Check,
  AlertCircle, ChevronDown, ChevronLeft, ArrowRight, Eye,
  Building2, Factory, Sparkles, X, Send, ShieldCheck,
  Briefcase, Layers, UserCheck, PhoneCall, HelpCircle,
  Video, Camera, TrendingUp, Award, BookmarkCheck, ArrowUpRight,
  Handshake, Target, ArrowDown, Package, QrCode, Tag
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { persistSubmission } from '../services/submissionService.js';

// 42 Participating Enterprises for Business Matching KCN Thai Hoa 2026
const PARTICIPATING_ENTERPRISES = [
  {
    id: 1,
    code: '01',
    name: 'Green Pallet',
    logoBg: 'bg-emerald-600 text-white',
    logoText: 'GP',
    industry: 'Pallet gỗ, vật tư đóng gói',
    category: 'Pallet & Đóng gói',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Pallet gỗ, pallet nhựa, vật tư đóng gói',
    meetingsCount: 5,
    nextAction: 'Gửi báo giá pallet',
    status: 'processing',
    statusName: 'Đang xử lý',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0903 123 456',
    email: 'sales@greenpallet.vn',
    website: 'https://greenpallet.vn',
    zalo: '0903123456',
    region: 'KCN Thái Hòa',
    notes: 'Đã gặp đại diện Đồng Tiến Long An và Gia Hoàng về nhu cầu pallet đóng hàng xuất khẩu.'
  },
  {
    id: 2,
    code: '02',
    name: 'VACETCO',
    logoBg: 'bg-blue-600 text-white',
    logoText: 'VA',
    industry: 'Xử lý nước thải, môi trường',
    category: 'Môi trường & Nước thải',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Giải pháp xử lý nước thải công nghiệp',
    meetingsCount: 4,
    nextAction: 'Khảo sát nhà máy',
    status: 'waiting',
    statusName: 'Chờ phản hồi',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    phone: '0912 345 678',
    email: 'info@vacetco.com.vn',
    website: 'https://vacetco.com.vn',
    zalo: '0912345678',
    region: 'TP.HCM',
    notes: 'Khảo sát hệ thống xử lý nước thải dệt nhuộm và phân bón tại KCN Thái Hòa.'
  },
  {
    id: 3,
    code: '03',
    name: 'FRESHAIR',
    logoBg: 'bg-sky-600 text-white',
    logoText: 'FA',
    industry: 'HVAC & công nghiệp',
    category: 'Cơ điện & HVAC',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Hệ thống HVAC, thông gió nhà xưởng',
    meetingsCount: 3,
    nextAction: 'Gửi hồ sơ kỹ thuật',
    status: 'contacted',
    statusName: 'Đã liên hệ',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    phone: '0988 776 655',
    email: 'contact@freshair.vn',
    website: 'https://freshair.vn',
    zalo: '0988776655',
    region: 'TP.HCM',
    notes: 'Hẹn gửi bản vẽ thiết kế hệ thống làm mát áp suất âm cho nhà xưởng bao bì.'
  },
  {
    id: 4,
    code: '04',
    name: 'MB Bank',
    logoBg: 'bg-indigo-700 text-white',
    logoText: 'MB',
    industry: 'Tài chính, ngân hàng',
    category: 'Tài chính & Ngân hàng',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Giải pháp tài chính cho DN KCN',
    meetingsCount: 6,
    nextAction: 'Hẹn gặp lần 2',
    status: 'processing',
    statusName: 'Đang xử lý',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '028 3822 8888',
    email: 'kcn.support@mbbank.com.vn',
    website: 'https://mbbank.com.vn',
    zalo: '0901234888',
    region: 'Tây Ninh',
    notes: 'Gói tín dụng ưu đãi lãi suất vay vốn lưu động và bảo lãnh thanh toán nguyên liệu.'
  },
  {
    id: 5,
    code: '05',
    name: 'XDroneAI',
    logoBg: 'bg-slate-900 text-white',
    logoText: 'XD',
    industry: 'Thiết bị, máy móc',
    category: 'Công nghệ & Tự động hóa',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Drone, giám sát nhà xưởng',
    meetingsCount: 2,
    nextAction: 'Gửi catalogue',
    status: 'pending',
    statusName: 'Chưa thực hiện',
    statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
    phone: '0908 999 888',
    email: 'ai@xdrone.vn',
    website: 'https://xdrone.vn',
    zalo: '0908999888',
    region: 'Tây Ninh',
    notes: 'Ứng dụng bay quét nhiệt phát hiện rò rỉ nhiệt và kiểm tra mái tôn KCN.'
  },
  {
    id: 6,
    code: '06',
    name: 'SEA HORSE SHIPPING',
    logoBg: 'bg-red-600 text-white',
    logoText: 'SH',
    industry: 'Logistics quốc tế',
    category: 'Logistics & Kho bãi',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Vận chuyển quốc tế, hải quan',
    meetingsCount: 4,
    nextAction: 'Báo giá vận chuyển',
    status: 'processing',
    statusName: 'Đang xử lý',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0903 456 789',
    email: 'rates@seahorseshipping.com',
    website: 'https://seahorseshipping.com',
    zalo: '0903456789',
    region: 'TP.HCM',
    notes: 'Đội xe kéo container KCN Thái Hòa về cảng Cát Lái và Cái Mép.'
  },
  {
    id: 7,
    code: '07',
    name: 'Đồng Tiến Long An',
    logoBg: 'bg-amber-600 text-white',
    logoText: 'ĐT',
    industry: 'Nước giải khát / Bao bì',
    category: 'Thực phẩm & Đồ uống',
    role: 'buyer',
    roleName: 'Nhà máy',
    isBooth: false,
    mainProducts: 'Bao bì carton, nhựa PET',
    meetingsCount: 3,
    nextAction: 'Tìm NCC bao bì',
    status: 'confirmed',
    statusName: 'Đã xác nhận',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0272 388 9999',
    email: 'purchasing@dongtien.com.vn',
    website: 'https://dongtien.com.vn',
    zalo: '0918776655',
    region: 'KCN Thái Hòa',
    notes: 'Nhu cầu mua hàng lớn: 100.000 thùng carton 5 lớp sóng BC và phôi chai PET.'
  },
  {
    id: 8,
    code: '08',
    name: 'Đài Cát',
    logoBg: 'bg-orange-500 text-white',
    logoText: 'ĐC',
    industry: 'Hóa chất',
    category: 'Hóa chất công nghiệp',
    role: 'buyer',
    roleName: 'Nhà máy',
    isBooth: false,
    mainProducts: 'Hóa chất, nguyên liệu',
    meetingsCount: 4,
    nextAction: 'Khảo sát nhà máy',
    status: 'processing',
    statusName: 'Đang xử lý',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0902 334 455',
    email: 'supply@daicatchem.com',
    website: 'https://daicatchem.com',
    zalo: '0902334455',
    region: 'KCN Thái Hòa',
    notes: 'Tìm nguồn cung ứng dung môi công nghiệp và hóa chất cơ bản đạt chuẩn COA.'
  },
  {
    id: 9,
    code: '09',
    name: 'Phương Yên',
    logoBg: 'bg-blue-700 text-white',
    logoText: 'PY',
    industry: 'Phân bón',
    category: 'Nông nghiệp & Phân bón',
    role: 'buyer',
    roleName: 'Nhà máy',
    isBooth: false,
    mainProducts: 'Bao bì, pallet, vận chuyển',
    meetingsCount: 2,
    nextAction: 'Gửi mẫu',
    status: 'waiting',
    statusName: 'Chờ phản hồi',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    phone: '0913 221 100',
    email: 'contact@phuongyenfertilizer.vn',
    website: 'https://phuongyenfertilizer.vn',
    zalo: '0913221100',
    region: 'KCN Thái Hòa',
    notes: 'Cần bao PP dệt tráng màng in Flexo và xe tải chuyên dụng giao đại lý miền Tây.'
  },
  {
    id: 10,
    code: '10',
    name: 'Nghiệp Nông',
    logoBg: 'bg-green-600 text-white',
    logoText: 'NN',
    industry: 'Thuốc BVTV',
    category: 'Nông dược & BVTV',
    role: 'buyer',
    roleName: 'Nhà máy',
    isBooth: false,
    mainProducts: 'Bao bì, tài chính, logistics',
    meetingsCount: 3,
    nextAction: 'Hẹn gặp lần 2',
    status: 'contacted',
    statusName: 'Đã liên hệ',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    phone: '028 3755 8899',
    email: 'purchasing@nghiepnong.vn',
    website: 'https://nghiepnong.vn',
    zalo: '0919888999',
    region: 'KCN Thái Hòa',
    notes: 'Cần chai lọ nhựa HDPE chống rò rỉ dung môi và kiểm định an toàn cháy nổ.'
  },
  {
    id: 11,
    code: '11',
    name: 'Thiên Phúc Hưng',
    logoBg: 'bg-red-700 text-white',
    logoText: 'TP',
    industry: 'Cơ khí, thiết bị',
    category: 'Thiết bị & Máy móc',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Bơm công nghiệp, máy nén khí',
    meetingsCount: 4,
    nextAction: 'Gửi báo giá kỹ thuật',
    status: 'processing',
    statusName: 'Đang xử lý',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0903 777 222',
    email: 'kinhdoanh@thienphuchung.com',
    website: 'https://thienphuchung.com',
    zalo: '0903777222',
    region: 'TP.HCM',
    notes: 'Cung cấp máy nén khí trục vít biến tần tiết kiệm điện năng cho nhà máy dệt.'
  },
  {
    id: 12,
    code: '12',
    name: 'Long Trường Vũ',
    logoBg: 'bg-rose-700 text-white',
    logoText: 'LV',
    industry: 'Hóa chất xử lý nước',
    category: 'Hóa chất công nghiệp',
    role: 'supplier',
    roleName: 'Nhà cung ứng',
    isBooth: true,
    mainProducts: 'Hóa chất chống cáu cặn lò hơi',
    meetingsCount: 5,
    nextAction: 'Lấy mẫu nước kiểm tra',
    status: 'confirmed',
    statusName: 'Đã xác nhận',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    phone: '0918 222 333',
    email: 'sales@longtruongvu.vn',
    website: 'https://longtruongvu.vn',
    zalo: '0918222333',
    region: 'TP.HCM',
    notes: 'Đã kiểm tra mẫu nước lò hơi tại Nhà máy Phân bón và Bột mì Thái Hòa.'
  }
];

// Extend up to 42 items for complete database representation
for (let i = 13; i <= 42; i++) {
  const isBuyer = i % 2 === 0;
  const isBooth = i % 2 !== 0 && i < 36;
  PARTICIPATING_ENTERPRISES.push({
    id: i,
    code: String(i).padStart(2, '0'),
    name: isBuyer ? `Nhà máy Thành Viên ${i} (KCN Thái Hòa)` : `Công ty Cung Ứng ${i} (Team KCN)`,
    logoBg: isBuyer ? 'bg-emerald-700 text-white' : 'bg-blue-700 text-white',
    logoText: isBuyer ? `NM` : `CC`,
    industry: isBuyer ? 'Sản xuất công nghiệp & Gia công' : 'Vật tư phụ trợ & Dịch vụ kỹ thuật',
    category: isBuyer ? 'Sản xuất công nghiệp' : 'Công nghiệp phụ trợ',
    role: isBuyer ? 'buyer' : 'supplier',
    roleName: isBuyer ? 'Nhà máy' : 'Nhà cung ứng',
    isBooth: isBooth,
    mainProducts: isBuyer ? 'Nguyên vật liệu, dịch vụ bảo trì, logistics' : 'Thiết bị phụ trợ, bao bì, hóa chất công nghiệp',
    meetingsCount: (i % 5) + 2,
    nextAction: isBuyer ? 'Khảo sát nhà máy' : 'Gửi báo giá & hồ sơ năng lực',
    status: i % 3 === 0 ? 'confirmed' : i % 3 === 1 ? 'processing' : 'contacted',
    statusName: i % 3 === 0 ? 'Đã xác nhận' : i % 3 === 1 ? 'Đang xử lý' : 'Đã liên hệ',
    statusColor: i % 3 === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : i % 3 === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200',
    phone: '0906 662 999',
    email: `contact.dn${i}@chuoicungung.com`,
    website: 'https://chuoicungung.com',
    zalo: '0906662999',
    region: i % 4 === 0 ? 'KCN Thái Hòa' : i % 4 === 1 ? 'TP.HCM' : i % 4 === 2 ? 'Long An' : 'Tây Ninh',
    notes: 'Doanh nghiệp đã hoàn tất phiên kết nối 1:1 trong buổi Biz Matching.'
  });
}

// Representative Buyers for Image 1 Card Preview
const FEATURED_BUYERS = [
  { name: 'ABC Foods', industry: 'Thực phẩm', need: 'Cần bao bì carton, pallet', logoText: 'ABC', logoBg: 'bg-rose-50 text-rose-600 border border-rose-200' },
  { name: 'TTF Furniture', industry: 'Gỗ nội thất', need: 'Cần phụ kiện, logistics', logoText: 'TTF', logoBg: 'bg-red-50 text-red-600 border border-red-200' },
  { name: 'GreenTech', industry: 'Nông nghiệp', need: 'Cần máy móc, vật tư', logoText: 'GT', logoBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  { name: 'Vinatex', industry: 'Dệt may', need: 'Cần hóa chất, BHLĐ', logoText: 'VT', logoBg: 'bg-blue-50 text-blue-600 border border-blue-200' },
  { name: 'Đồng Tiến Long An', industry: 'Bao bì & Nhựa', need: 'Cần màng in, phôi PET', logoText: 'ĐT', logoBg: 'bg-amber-50 text-amber-600 border border-amber-200' },
  { name: 'SPM Pharma', industry: 'Dược phẩm', need: 'Cần phòng sạch, BHLĐ', logoText: 'SP', logoBg: 'bg-teal-50 text-teal-600 border border-teal-200' }
];

// Representative Suppliers for Image 1 Card Preview
const FEATURED_SUPPLIERS = [
  { name: 'Green Pallet', industry: 'Pallet gỗ', product: 'Pallet gỗ, vật tư đóng gói', logoText: 'GP', logoBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  { name: 'VACETCO', industry: 'Xử lý nước thải', product: 'Giải pháp môi trường', logoText: 'VA', logoBg: 'bg-blue-50 text-blue-600 border border-blue-200' },
  { name: 'FRESHAIR', industry: 'HVAC', product: 'Thông gió, làm mát xưởng', logoText: 'FA', logoBg: 'bg-sky-50 text-sky-600 border border-sky-200' },
  { name: 'Seahorse Shipping', industry: 'Logistics', product: 'Vận chuyển quốc tế', logoText: 'SH', logoBg: 'bg-rose-50 text-rose-600 border border-rose-200' },
  { name: 'MB Bank', industry: 'Tài chính', product: 'Vốn lưu động & thanh toán', logoText: 'MB', logoBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200' },
  { name: 'XDroneAI', industry: 'Thiết bị thông minh', product: 'Giám sát nhà xưởng', logoText: 'XD', logoBg: 'bg-slate-100 text-slate-800 border border-slate-300' }
];

// Revolving Gear Examples
const GEAR_MATCHING_EXAMPLES = [
  { need: 'Cần bao bì carton 5 lớp', solution: 'Nhà cung ứng bao bì Phương Yên', icon: '📦' },
  { need: 'Cần logistics vận chuyển cảng', solution: 'Seahorse Shipping quốc tế', icon: '🚢' },
  { need: 'Cần giải pháp xử lý nước thải', solution: 'Công ty Môi trường VACETCO', icon: '💧' },
  { need: 'Cần bảo hộ & đồng phục công nhân', solution: 'Chuyên gia đồng phục Team KCN', icon: '👕' },
  { need: 'Cần hệ thống HVAC thông gió xưởng', solution: 'FRESHAIR giải pháp làm mát', icon: '❄️' }
];

export default function ThaiHoaBusinessMatchingPage() {
  const { lang } = useLanguage();
  const location = useLocation();

  // Lifecycle Tabs:
  // 'pre-event': TRƯỚC SỰ KIỆN (Chuẩn bị & Matching) - Focus
  // 'live-event': ĐANG DIỄN RA (Check-in & Kết nối)
  // 'post-event': SAU SỰ KIỆN (Kết quả & Follow-up / Bảng 42 Doanh nghiệp)
  const [activeLifecycleTab, setActiveLifecycleTab] = useState('pre-event');

  // Gear revolving index
  const [gearIndex, setGearIndex] = useState(0);

  // Directory Filters for Post-event / 42 enterprises
  const [searchKw, setSearchKw] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'buyer', 'supplier', 'booth'
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Feedback
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showZaloModal, setShowZaloModal] = useState(null);
  const [showChainyHelp, setShowChainyHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Registration Form State
  const [regRole, setRegRole] = useState('buyer'); // 'buyer', 'supplier', 'sponsor'
  const [regPackage, setRegPackage] = useState('member'); // 'member', 'non_member', 'booth_member', 'booth_non_member', 'sponsor_diamond', 'sponsor_gold', 'sponsor_silver'
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    position: '',
    companyName: '',
    taxCode: '',
    address: '',
    industry: '',
    needsOrProducts: '',
    attendeeCount: 1,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState(null);

  // Handle Hash anchor navigation like #dang_ky
  useEffect(() => {
    if (location.hash === '#dang_ky' || location.hash === '#dang-ky') {
      const el = document.getElementById('dang_ky');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  // Rotate gear examples every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGearIndex(prev => (prev + 1) % GEAR_MATCHING_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered enterprises for directory tab
  const filteredList = useMemo(() => {
    return PARTICIPATING_ENTERPRISES.filter(item => {
      if (roleFilter === 'buyer' && item.role !== 'buyer') return false;
      if (roleFilter === 'supplier' && item.role !== 'supplier') return false;
      if (roleFilter === 'booth' && !item.isBooth) return false;
      if (industryFilter !== 'all' && item.category !== industryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (regionFilter !== 'all' && item.region !== regionFilter) return false;
      if (searchKw.trim()) {
        const kw = searchKw.toLowerCase();
        return (
          item.name.toLowerCase().includes(kw) ||
          item.industry.toLowerCase().includes(kw) ||
          item.mainProducts.toLowerCase().includes(kw) ||
          item.nextAction.toLowerCase().includes(kw) ||
          item.region.toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [roleFilter, industryFilter, statusFilter, regionFilter, searchKw]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Distinct Filter options
  const distinctIndustries = useMemo(() => {
    return Array.from(new Set(PARTICIPATING_ENTERPRISES.map(i => i.category))).filter(Boolean);
  }, []);
  const distinctRegions = useMemo(() => {
    return Array.from(new Set(PARTICIPATING_ENTERPRISES.map(i => i.region))).filter(Boolean);
  }, []);

  // Quick Counts
  const counts = useMemo(() => {
    return {
      all: PARTICIPATING_ENTERPRISES.length,
      buyer: PARTICIPATING_ENTERPRISES.filter(i => i.role === 'buyer').length,
      supplier: PARTICIPATING_ENTERPRISES.filter(i => i.role === 'supplier').length,
      booth: PARTICIPATING_ENTERPRISES.filter(i => i.isBooth).length
    };
  }, []);

  // Handle Export Data
  const handleExportData = () => {
    const headers = ['STT,Doanh nghiệp,Vai trò,Ngành nghề,Sản phẩm chính,Số cuộc gặp,Next Action,Trạng thái,Khu vực,Điện thoại'];
    const rows = filteredList.map(item =>
      `"${item.code}","${item.name}","${item.roleName}","${item.industry}","${item.mainProducts}","${item.meetingsCount}","${item.nextAction}","${item.statusName}","${item.region}","${item.phone}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_dn_matching_kcn_thai_hoa_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải danh sách doanh nghiệp thành công (CSV)');
  };

  // Handle Registration Submit
  const handleRegSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.phone || !regForm.companyName) {
      showToast('Vui lòng điền họ tên, số điện thoại và tên doanh nghiệp');
      return;
    }
    setIsSubmitting(true);
    try {
      const passCode = 'TH2026-' + Math.floor(1000 + Math.random() * 9000);
      const submission = {
        formType: 'EVENT_REGISTRATION',
        eventId: 'PRG-2026-TEAMKCN-THAIHOA',
        eventName: 'Ngày Hội Chuỗi Cung Ứng KCN Thái Hòa 2026',
        passCode,
        role: regRole,
        package: regPackage,
        ...regForm,
        createdAt: new Date().toISOString()
      };
      await persistSubmission(submission);
      setSubmittedPass(passCode);
      showToast('Đăng ký tham gia thành công! Mã vé của bạn: ' + passCode);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">

      {/* ========================================================
          1. EVENT MINI HEADER: 3 LOGOS IN EXACT ORDER (IMAGE 2)
          [ LOGO KCN THÁI HÒA ] — [ LOGO CHUOICUNGUNG.COM ] — [ LOGO TEAM KCN ]
      ======================================================== */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Group 3 Logos */}
          <div className="w-full flex items-center justify-center sm:justify-between gap-4 sm:gap-8">
            
            {/* Logo 1: VIETSON / KCN Thái Hòa (Image 3) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                src="/images/events/vietson-logo.png"
                alt="VIETSON ECO-Industrial Park - KCN Thái Hòa"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-10 h-10 rounded-xl bg-blue-900 text-white font-black text-xs items-center justify-center">
                TH
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-none uppercase">
                  KCN THÁI HÒA
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                  Ban Quản lý KCN Thái Hòa
                </div>
                <div className="text-[9px] text-blue-700 font-bold leading-tight">
                  Đơn vị phối hợp
                </div>
              </div>
            </div>

            {/* Logo 2: CHUOICUNGUNG.COM (Center Logo) */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/80 px-3.5 py-1.5 rounded-2xl border border-slate-100 shadow-2xs">
              <img
                src="/logo_only.png"
                alt="CHUOICUNGUNG.COM Logo"
                className="h-9 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
              <div className="text-left">
                <div className="text-xs sm:text-base font-black text-[#0052cc] tracking-tight leading-none">
                  CHUOICUNGUNG<span className="text-[#ff5500]">.COM</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 hidden xs:block">
                  Kết nối doanh nghiệp Việt
                </div>
                <div className="text-[9px] text-amber-700 font-bold leading-tight">
                  Nền tảng kết nối & điều phối
                </div>
              </div>
            </div>

            {/* Logo 3: TEAM KCN / Hội (Image 4) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img
                src="/images/events/team-kcn-logo.jpg"
                alt="Team Khu Công Nghiệp Miền Nam"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/logo_teamkcn.jpg';
                }}
              />
              <div className="text-left hidden md:block">
                <div className="text-xs sm:text-sm font-black text-emerald-800 tracking-tight leading-none uppercase">
                  TEAM KCN MIỀN NAM
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                  Chuỗi cung ứng KCN MN
                </div>
                <div className="text-[9px] text-emerald-700 font-bold leading-tight">
                  Đơn vị phối hợp
                </div>
              </div>
            </div>

          </div>

          {/* Quick Header CTA */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a
              href="#dang_ky"
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Đăng ký tham gia</span>
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================
          2. LIFECYCLE TABS (TRƯỚC SỰ KIỆN — ĐANG DIỄN RA — SAU SỰ KIỆN)
      ======================================================== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center sm:justify-start gap-2 py-3 overflow-x-auto no-scrollbar">
            
            {/* TAB 1: TRƯỚC SỰ KIỆN (ACTIVE FOCUS) */}
            <button
              onClick={() => setActiveLifecycleTab('pre-event')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                activeLifecycleTab === 'pre-event'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>TRƯỚC SỰ KIỆN</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeLifecycleTab === 'pre-event' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 font-bold'
              }`}>
                Chuẩn bị & Matching
              </span>
            </button>

            {/* TAB 2: ĐANG DIỄN RA */}
            <button
              onClick={() => setActiveLifecycleTab('live-event')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                activeLifecycleTab === 'live-event'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>ĐANG DIỄN RA</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Check-in & Kết nối
              </span>
            </button>

            {/* TAB 3: SAU SỰ KIỆN */}
            <button
              onClick={() => setActiveLifecycleTab('post-event')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                activeLifecycleTab === 'post-event'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>SAU SỰ KIỆN</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                Kết quả & Follow-up (42 DN)
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* ========================================================
          VIEWPORT FOR TAB 1: TRƯỚC SỰ KIỆN (COMPLETE LANDING DESIGN - IMAGE 1)
      ======================================================== */}
      {activeLifecycleTab === 'pre-event' && (
        <>
          {/* ====================================================
              3. HERO SECTION WITH UNIFIED AI BANNER (IMAGE 1)
          ==================================================== */}
          <section className="relative overflow-hidden bg-slate-100 border-b border-slate-200">
            
            {/* Background Panorama Banner */}
            <div className="relative w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-center">
              
              {/* AI Generated Unified Background with SUPPI & CHAINY */}
              <img
                src="/images/events/thaihoa-hero-banner.jpg"
                alt="Ngày Hội Chuỗi Cung Ứng KCN Thái Hòa 2026 - SUPPI & CHAINY"
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
              />

              {/* Soft atmospheric radial overlay to ensure center text readability */}
              <div className="absolute inset-0 bg-radial from-white/95 via-white/70 to-transparent pointer-events-none" />

              {/* Speech bubble for SUPPI (Left) */}
              <div className="hidden lg:block absolute left-6 xl:left-14 top-[32%] z-20 animate-bounce-slow">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-blue-200 shadow-lg text-center max-w-[200px] relative">
                  <p className="text-xs font-black text-blue-900 leading-snug">
                    Tìm đúng đối tác nên gặp!
                  </p>
                  <div className="w-3 h-3 bg-white border-b border-r border-blue-200 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    SUPPI
                  </span>
                  <div className="text-[10px] font-bold text-slate-800 drop-shadow-xs mt-0.5">
                    Khớp nhu cầu • Tìm nguồn phù hợp
                  </div>
                </div>
              </div>

              {/* Speech bubble for CHAINY (Right) */}
              <div className="hidden lg:block absolute right-6 xl:right-14 top-[32%] z-20 animate-bounce-slow">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-blue-200 shadow-lg text-center max-w-[200px] relative">
                  <p className="text-xs font-black text-blue-900 leading-snug">
                    Kết nối và theo việc đến cùng!
                  </p>
                  <div className="w-3 h-3 bg-white border-b border-r border-blue-200 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#0052cc] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    CHAINY
                  </span>
                  <div className="text-[10px] font-bold text-slate-800 drop-shadow-xs mt-0.5">
                    Ghi nhận • Theo dõi • Đến kết quả
                  </div>
                </div>
              </div>

              {/* Center Content Overlaid */}
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center space-y-4">
                
                {/* 3 Partner Badges in Center Top */}
                <div className="inline-flex items-center gap-3 sm:gap-6 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2 rounded-2xl border border-slate-200/90 shadow-sm mx-auto">
                  <div className="flex items-center gap-2">
                    <img src="/images/events/vietson-logo.png" alt="KCN Thái Hòa" className="h-6 sm:h-7 w-auto object-contain" />
                    <span className="text-[10px] font-bold text-slate-700 hidden sm:inline">KCN Thái Hòa</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <img src="/logo_only.png" alt="Chuỗi Cung Ứng" className="h-6 sm:h-7 w-auto object-contain" />
                    <span className="text-[10px] font-bold text-blue-700 font-heading">CHUỖI CUNG ỨNG</span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <img src="/images/events/team-kcn-logo.jpg" alt="Team KCN" className="h-6 sm:h-7 w-auto object-contain rounded" />
                    <span className="text-[10px] font-bold text-slate-700 hidden sm:inline">Team KCN Miền Nam</span>
                  </div>
                </div>

                {/* Subheading / Tag */}
                <div className="pt-1">
                  <div className="text-sm sm:text-base font-black text-orange-600 tracking-wider uppercase font-heading">
                    NGÀY HỘI
                  </div>
                  
                  {/* Main H1 Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-[#003d99] tracking-tight leading-none mt-1 drop-shadow-xs">
                    CHUỖI CUNG ỨNG
                  </h1>
                  
                  <div className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-1.5">
                    BUSINESS MATCHING KCN THÁI HÒA 2026
                  </div>
                </div>

                {/* Slogan */}
                <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-xl mx-auto leading-relaxed">
                  Nhu cầu thật – Nguồn cung phù hợp – Cuộc gặp được theo dõi đến kết quả
                </p>

                {/* Event Facts Strip with High Legibility */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-blue-100 shadow-md max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-3 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Thứ Tư, 07/10/2026</div>
                      <div className="text-[10px] text-slate-500">Ngày tổ chức</div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-7 bg-slate-200" />

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">08:00 – 11:00</div>
                      <div className="text-[10px] text-slate-500">Giao thương & kết nối trực tiếp</div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-7 bg-slate-200" />

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Văn phòng BQL KCN Thái Hòa</div>
                      <div className="text-[10px] text-slate-500">Ấp Tân Hòa, xã Đức Lập III, Tây Ninh</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Mascots Badges */}
                <div className="flex lg:hidden items-center justify-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                    🤖 SUPPI: Khớp nhu cầu
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-200">
                    🔗 CHAINY: Theo dõi kết nối
                  </span>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              4. QUICK EVENT STATS & MAIN CTAs STRIP (IMAGE 1)
          ==================================================== */}
          <section className="bg-white py-5 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* 4 KPI Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full lg:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">150+</div>
                      <div className="text-[11px] text-slate-500 font-medium">Doanh nghiệp tham gia</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">40+</div>
                      <div className="text-[11px] text-slate-500 font-medium">Nhà máy / Buyer</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">70+</div>
                      <div className="text-[11px] text-slate-500 font-medium">Nhà cung ứng / Supplier</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">1.000+</div>
                      <div className="text-[11px] text-slate-500 font-medium">Cuộc gặp 1:1 dự kiến</div>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-center">
                  <a
                    href="#dang_ky"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm transition shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <span>ĐĂNG KÝ THAM GIA</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setActiveLifecycleTab('post-event')}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 font-bold text-sm transition shadow-2xs cursor-pointer"
                  >
                    <span>XEM DOANH NGHIỆP THAM GIA</span>
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              5. TWO AUDIENCE BLOCKS & INTERLOCKING GEARS (IMAGE 1)
          ==================================================== */}
          <section className="py-12 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. LEFT CARD: DÀNH CHO NHÀ MÁY / BUYER */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-emerald-200/90 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 transition">
                  <div className="space-y-4">
                    
                    {/* Header badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                      <Factory className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Dành cho Nhà máy / Buyer</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">
                      Tối ưu chi phí mua hàng & Kết nối nguồn cung đáng tin cậy
                    </h3>

                    {/* Image factory */}
                    <div className="rounded-2xl overflow-hidden h-36 border border-slate-100 relative">
                      <img
                        src="/images/ecosystem/factory.jpg"
                        alt="Nhà máy KCN Thái Hòa"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/kcn_images/khu-cong-nghiep-thai-hoa-long-an.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-bold text-white">Khảo sát & Matching theo đơn đặt hàng</span>
                      </div>
                    </div>

                    {/* 4 Check items */}
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Tìm nhà cung ứng theo đúng danh mục vật tư cần mua</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Tối ưu chi phí vận hành, logistics và bao bì nhà xưởng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Xem hồ sơ năng lực và chứng nhận trước khi gặp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Đặt lịch 1:1 tại phòng VIP và theo việc cùng CHAINY</span>
                      </li>
                    </ul>

                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <a
                      href="#dang_ky"
                      onClick={() => setRegRole('buyer')}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Đăng ký Nhà máy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 2. CENTER: BÁNH RĂNG KẾT NỐI (NEED ↔ SOLUTION GEARS) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between items-center text-center relative overflow-hidden">
                  
                  {/* Decorative background glow */}
                  <div className="w-48 h-48 rounded-full bg-blue-500/20 blur-3xl absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

                  <div className="w-full relative z-10 space-y-4">
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold border border-white/15">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>CƠ CHẾ MATCHING THÔNG MINH</span>
                    </div>

                    <h4 className="text-lg font-black text-white">
                      SUPPI KHỚP NHU CẦU ↔ NĂNG LỰC
                    </h4>

                    {/* Animated Interlocking Gears Illustration */}
                    <div className="relative py-4 flex items-center justify-center gap-4">
                      
                      {/* Left Gear: Nhu cầu Nhà máy (Blue) */}
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 relative flex items-center justify-center">
                          <svg className="w-full h-full text-blue-400 animate-spin" style={{ animationDuration: '22s' }} viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 15a35 35 0 100 70 35 35 0 000-70zm0 15a20 20 0 110 40 20 20 0 010-40z" opacity="0.4"/>
                            <circle cx="50" cy="50" r="16" fill="#1e3a8a"/>
                            <rect x="46" y="2" width="8" height="16" rx="3" fill="#38bdf8"/>
                            <rect x="46" y="82" width="8" height="16" rx="3" fill="#38bdf8"/>
                            <rect x="2" y="46" width="16" height="8" rx="3" fill="#38bdf8"/>
                            <rect x="82" y="46" width="16" height="8" rx="3" fill="#38bdf8"/>
                            <rect x="15" y="15" width="14" height="8" rx="3" transform="rotate(45 22 19)" fill="#38bdf8"/>
                            <rect x="71" y="71" width="14" height="8" rx="3" transform="rotate(45 78 75)" fill="#38bdf8"/>
                            <rect x="15" y="75" width="14" height="8" rx="3" transform="rotate(-45 22 79)" fill="#38bdf8"/>
                            <rect x="71" y="19" width="14" height="8" rx="3" transform="rotate(-45 78 23)" fill="#38bdf8"/>
                          </svg>
                          <Factory className="w-6 h-6 text-white absolute" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-300 mt-1 uppercase">Nhu cầu Nhà máy</span>
                      </div>

                      {/* Center Pulse Arrow */}
                      <div className="flex flex-col items-center px-1">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-400/40 animate-pulse">
                          ⇄
                        </div>
                      </div>

                      {/* Right Gear: Giải pháp NCC (Orange) */}
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 relative flex items-center justify-center">
                          <svg className="w-full h-full text-orange-400 animate-spin" style={{ animationDuration: '22s', animationDirection: 'reverse' }} viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 15a35 35 0 100 70 35 35 0 000-70zm0 15a20 20 0 110 40 20 20 0 010-40z" opacity="0.4"/>
                            <circle cx="50" cy="50" r="16" fill="#7c2d12"/>
                            <rect x="46" y="2" width="8" height="16" rx="3" fill="#fb923c"/>
                            <rect x="46" y="82" width="8" height="16" rx="3" fill="#fb923c"/>
                            <rect x="2" y="46" width="16" height="8" rx="3" fill="#fb923c"/>
                            <rect x="82" y="46" width="16" height="8" rx="3" fill="#fb923c"/>
                            <rect x="15" y="15" width="14" height="8" rx="3" transform="rotate(45 22 19)" fill="#fb923c"/>
                            <rect x="71" y="71" width="14" height="8" rx="3" transform="rotate(45 78 75)" fill="#fb923c"/>
                            <rect x="15" y="75" width="14" height="8" rx="3" transform="rotate(-45 22 79)" fill="#fb923c"/>
                            <rect x="71" y="19" width="14" height="8" rx="3" transform="rotate(-45 78 23)" fill="#fb923c"/>
                          </svg>
                          <Handshake className="w-6 h-6 text-white absolute" />
                        </div>
                        <span className="text-[10px] font-bold text-orange-300 mt-1 uppercase">Giải pháp NCC</span>
                      </div>

                    </div>

                    {/* Dynamic Rotating Example Box */}
                    <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-left transition-all duration-500">
                      <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Ví dụ matching tự động #{gearIndex + 1}:</span>
                        <span>{GEAR_MATCHING_EXAMPLES[gearIndex].icon}</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1">
                        {GEAR_MATCHING_EXAMPLES[gearIndex].need}
                      </div>
                      <div className="text-[11px] font-medium text-emerald-300 flex items-center gap-1.5 mt-0.5">
                        <span>↳ Khớp với:</span>
                        <strong className="text-white">{GEAR_MATCHING_EXAMPLES[gearIndex].solution}</strong>
                      </div>
                    </div>

                  </div>

                  <div className="w-full pt-4 mt-2">
                    <p className="text-[10px] text-slate-300 italic">
                      *Matching hoàn toàn dựa trên Nhu cầu × Năng lực × Địa bàn (không phụ thuộc tài trợ).
                    </p>
                  </div>
                </div>

                {/* 3. RIGHT CARD: DÀNH CHO NHÀ CUNG ỨNG / SUPPLIER */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-orange-200/90 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-orange-300 transition">
                  <div className="space-y-4">
                    
                    {/* Header badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
                      <Handshake className="w-3.5 h-3.5 text-orange-700" />
                      <span>Dành cho Nhà cung ứng / Supplier</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">
                      Tiếp cận trực tiếp 40+ Nhà máy & Bàn giao thương hiệu quả
                    </h3>

                    {/* Image supplier */}
                    <div className="rounded-2xl overflow-hidden h-36 border border-slate-100 relative">
                      <img
                        src="/images/ecosystem/partnership.jpg"
                        alt="Hợp tác cung ứng B2B"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/kcn_images/khu-cong-nghiep-thai-hoa-long-an.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-bold text-white">Gặp gỡ 1:1 có chuẩn bị trước</span>
                      </div>
                    </div>

                    {/* 4 Check items */}
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>Giới thiệu năng lực và sản phẩm chủ lực tới đúng ban mua hàng</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>Được SUPPI tự động ghép vào các nhóm nhu cầu nhà máy thực tế</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>Trưng bày sản phẩm tại Bàn giao thương & Giao lưu tiệc trưa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>Theo dõi báo giá, gửi mẫu và tiến độ ký hợp đồng cùng CHAINY</span>
                      </li>
                    </ul>

                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <a
                      href="#dang_ky"
                      onClick={() => setRegRole('supplier')}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Đăng ký Nhà cung ứng</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              6. NHỮNG DOANH NGHIỆP TIÊU BIỂU ĐÃ XÁC NHẬN THAM GIA
          ==================================================== */}
          <section className="py-12 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 uppercase">
                    NHỮNG DOANH NGHIỆP TIÊU BIỂU ĐÃ XÁC NHẬN THAM GIA
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Danh sách các nhà máy và nhà cung ứng đã chốt đăng ký tham dự buổi Biz Matching
                  </p>
                </div>

                <button
                  onClick={() => setActiveLifecycleTab('post-event')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer self-start sm:self-auto"
                >
                  <span>Xem tất cả 42 doanh nghiệp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2 Columns: Buyers on Left vs Suppliers on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Column Left: Nhà máy / Buyer nổi bật */}
                <div className="bg-slate-50/70 rounded-3xl p-5 border border-slate-200/90 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <Factory className="w-4 h-4 text-emerald-600" />
                      <span>Nhà máy / Buyer nổi bật</span>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      18 Nhà máy
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURED_BUYERS.map((buyer, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${buyer.logoBg}`}>
                          {buyer.logoText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-slate-900 truncate">{buyer.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{buyer.industry}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                            ↳ {buyer.need}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column Right: Nhà cung ứng / Supplier nổi bật */}
                <div className="bg-slate-50/70 rounded-3xl p-5 border border-slate-200/90 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                      <Handshake className="w-4 h-4 text-blue-600" />
                      <span>Nhà cung ứng / Supplier nổi bật</span>
                    </div>
                    <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      20+ Nhà cung ứng
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURED_SUPPLIERS.map((supplier, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-300 transition flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${supplier.logoBg}`}>
                          {supplier.logoText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-slate-900 truncate">{supplier.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{supplier.industry}</div>
                          <div className="text-[10px] text-blue-700 font-semibold truncate mt-0.5">
                            ↳ {supplier.product}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              7. 4 GRID BLOCKS: AGENDA — 4 NHÓM KẾT NỐI — CHI PHÍ — TÀI TRỢ (IMAGE 1)
          ==================================================== */}
          <section className="py-12 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                
                {/* 1. AGENDA DỰ KIẾN */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Agenda dự kiến</span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold">Thứ 4, 07/10</span>
                    </div>

                    <div className="mt-4 space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-slate-500 shrink-0 text-[11px]">08:00 – 08:30</span>
                        <span className="text-slate-700 font-medium">Check-in & giao lưu đầu giờ</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-slate-500 shrink-0 text-[11px]">08:30 – 08:45</span>
                        <span className="text-slate-700 font-medium">Giới thiệu KCN Thái Hòa</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-slate-500 shrink-0 text-[11px]">08:45 – 09:00</span>
                        <span className="text-slate-700 font-medium">Giới thiệu Team KCN Miền Nam</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-blue-700 shrink-0 text-[11px]">09:00 – 11:00</span>
                        <span className="text-blue-900 font-black">Giới thiệu DN & Business Matching 1:1</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="font-mono font-bold text-slate-500 shrink-0 text-[11px]">11:00 – 13:00</span>
                        <span className="text-slate-700 font-medium">Tổng kết & Tiệc trưa kết nối</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500">
                    Địa điểm: Văn phòng BQL KCN Thái Hòa, Đức Lập Hạ, Tây Ninh.
                  </div>
                </div>

                {/* 2. 4 NHÓM KẾT NỐI CHÍNH */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>4 nhóm kết nối chính</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">Trọng tâm</span>
                    </div>

                    <div className="mt-4 space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">01</span>
                        <div>
                          <strong className="text-slate-900">Mua bán & vật tư:</strong>
                          <p className="text-[11px] text-slate-500">Bao bì, pallet, nguyên liệu, hóa chất, máy móc</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">02</span>
                        <div>
                          <strong className="text-slate-900">Logistics & hạ tầng:</strong>
                          <p className="text-[11px] text-slate-500">Vận chuyển, kho bãi, xe container, cảng biển</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">03</span>
                        <div>
                          <strong className="text-slate-900">Dịch vụ chuyên môn:</strong>
                          <p className="text-[11px] text-slate-500">Xử lý nước thải, HVAC, ngân hàng, bảo hiểm</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">04</span>
                        <div>
                          <strong className="text-slate-900">Chia sẻ vận hành:</strong>
                          <p className="text-[11px] text-slate-500">Chuyển đổi số, năng lượng, bảo trì xưởng</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500">
                    Khảo sát trước nhu cầu để xếp lịch chính xác.
                  </div>
                </div>

                {/* 3. CHI PHÍ THAM GIA */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span>Chi phí tham gia</span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-bold">Minh bạch</span>
                    </div>

                    {/* Pricing Table */}
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase">
                          <tr>
                            <th className="p-2">Hạng mục</th>
                            <th className="p-2 text-center">Hội viên</th>
                            <th className="p-2 text-right">Không phải HV</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          <tr>
                            <td className="p-2 font-medium">Tham dự (pax)</td>
                            <td className="p-2 text-center font-bold text-blue-700">750k</td>
                            <td className="p-2 text-right font-bold text-slate-700">1.000k</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">Bàn trưng bày</td>
                            <td className="p-2 text-center font-bold text-blue-700">1.500k</td>
                            <td className="p-2 text-right font-bold text-slate-700">2.000k</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 text-[11px] text-slate-600 space-y-1">
                      <p>✓ Đã bao gồm teabreak, tài liệu, kết nối 1:1.</p>
                      <p>✓ Tiệc trưa giao lưu cùng BQL KCN & nhà máy.</p>
                      <p className="text-orange-700 font-bold">Hạn chót đăng ký: 29/09/2026</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <a
                      href="#dang_ky"
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Đăng ký tham dự ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 4. GÓI TÀI TRỢ SỰ KIỆN */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>Gói tài trợ sự kiện</span>
                      </div>
                      <span className="text-[10px] text-purple-600 font-bold">Tăng hiện diện</span>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      
                      {/* Kim Cương */}
                      <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
                        <div className="flex items-center justify-between font-black text-purple-900">
                          <span>💎 KIM CƯƠNG</span>
                          <span>50.000.000đ</span>
                        </div>
                        <p className="text-[10px] text-purple-700 mt-0.5">Logo chính, phát biểu, bàn VIP, kết nối toàn đoàn</p>
                      </div>

                      {/* Vàng */}
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <div className="flex items-center justify-between font-black text-amber-900">
                          <span>🥇 VÀNG</span>
                          <span>30.000.000đ</span>
                        </div>
                        <p className="text-[10px] text-amber-700 mt-0.5">Logo backdrop, 1 bàn tiêu chuẩn, giao lưu BTC</p>
                      </div>

                      {/* Bạc */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between font-black text-slate-800">
                          <span>🥈 BẠC</span>
                          <span>15.000.000đ</span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5">Logo ấn phẩm, tham gia tiệc trưa networking</p>
                      </div>

                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <p className="text-[9px] text-slate-400 italic mb-2">
                      *Tài trợ không ảnh hưởng thuật toán matching hữu cơ.
                    </p>
                    <a
                      href="#dang_ky"
                      onClick={() => setRegRole('sponsor')}
                      className="w-full py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Liên hệ tài trợ BTC</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              8. QUY TRÌNH 6 BƯỚC CHUẨN BỊ TRƯỚC NGÀY HỘI
          ==================================================== */}
          <section className="py-12 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
              
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 uppercase">
                  QUY TRÌNH THAM GIA & CHUẨN BỊ TRƯỚC NGÀY HỘI
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  6 bước đơn giản để cuộc gặp 1:1 đạt hiệu quả cao nhất
                </p>
              </div>

              {/* 6 Steps Horizontal Chain */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">01</div>
                  <div className="font-bold text-xs text-slate-900">Hoàn thiện hồ sơ</div>
                  <div className="text-[10px] text-slate-500 mt-1">Đăng ký thông tin DN & ngành hàng</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">02</div>
                  <div className="font-bold text-xs text-slate-900">Cập nhật nhu cầu</div>
                  <div className="text-[10px] text-slate-500 mt-1">Gửi chi tiết vật tư cần mua hoặc bán</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">03</div>
                  <div className="font-bold text-xs text-slate-900">Đăng ký attendee</div>
                  <div className="text-[10px] text-slate-500 mt-1">Xác nhận nhân sự tham gia & thanh toán</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">04</div>
                  <div className="font-bold text-xs text-slate-900">Nhận QR Event Pass</div>
                  <div className="text-[10px] text-slate-500 mt-1">Mã check-in tự động vào sự kiện</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">05</div>
                  <div className="font-bold text-xs text-slate-900">Xem SUPPI Matching</div>
                  <div className="text-[10px] text-slate-500 mt-1">Nhận danh sách đối tác được ghép</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center relative group">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center mx-auto mb-2">06</div>
                  <div className="font-bold text-xs text-slate-900">Xác nhận lịch 1:1</div>
                  <div className="text-[10px] text-slate-500 mt-1">Chốt khung giờ meeting tại sự kiện</div>
                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              9. REGISTRATION FORM SECTION (#dang_ky)
          ==================================================== */}
          <section id="dang_ky" className="py-14 bg-gradient-to-b from-white to-blue-50/40">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              
              <div className="bg-white rounded-3xl border border-blue-200/90 p-6 sm:p-10 shadow-lg relative">
                
                {/* Header */}
                <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                  <span className="px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase">
                    Đăng ký trực tiếp
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                    ĐĂNG KÝ THAM GIA BIZ MATCHING KCN THÁI HÒA 2026
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Vui lòng hoàn tất thông tin để Ban Tổ Chức tiến hành khảo sát và lên lịch ghép 1:1 trước ngày 29/09/2026.
                  </p>
                </div>

                {/* Submitted Success Notice */}
                {submittedPass ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-emerald-900">ĐĂNG KÝ THÀNH CÔNG!</h4>
                      <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                        Cảm ơn bạn đã đăng ký tham gia Ngày hội Chuỗi Cung Ứng KCN Thái Hòa 2026.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-emerald-200 max-w-sm mx-auto shadow-2xs">
                      <div className="text-xs text-slate-500 font-medium">Mã vé QR Event Pass:</div>
                      <div className="text-2xl font-mono font-black text-blue-700 my-1">{submittedPass}</div>
                      <div className="text-[11px] text-slate-400">Vui lòng lưu lại mã vé để check-in tại cổng sự kiện.</div>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setSubmittedPass(null)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Đăng ký thêm người tham gia
                      </button>
                      <button
                        onClick={() => setActiveLifecycleTab('post-event')}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                      >
                        Xem danh sách doanh nghiệp
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegSubmit} className="space-y-6">
                    
                    {/* Role Selector Pills */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        1. Bạn đại diện cho nhóm doanh nghiệp nào? *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        
                        <button
                          type="button"
                          onClick={() => { setRegRole('buyer'); setRegPackage('member'); }}
                          className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            regRole === 'buyer'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <Factory className={`w-5 h-5 shrink-0 ${regRole === 'buyer' ? 'text-emerald-700' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-xs">Nhà máy / Buyer</div>
                            <div className="text-[10px] text-slate-500 leading-tight">Có nhu cầu tìm nguồn cung</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setRegRole('supplier'); setRegPackage('member'); }}
                          className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            regRole === 'supplier'
                              ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <Handshake className={`w-5 h-5 shrink-0 ${regRole === 'supplier' ? 'text-blue-700' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-xs">Nhà cung ứng / Supplier</div>
                            <div className="text-[10px] text-slate-500 leading-tight">Cung cấp sản phẩm, dịch vụ</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => { setRegRole('sponsor'); setRegPackage('sponsor_diamond'); }}
                          className={`p-3.5 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            regRole === 'sponsor'
                              ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <Award className={`w-5 h-5 shrink-0 ${regRole === 'sponsor' ? 'text-purple-700' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-xs">Nhà Tài Trợ</div>
                            <div className="text-[10px] text-slate-500 leading-tight">Quảng bá thương hiệu & Bàn VIP</div>
                          </div>
                        </button>

                      </div>
                    </div>

                    {/* Personal & Business Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên người đại diện *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Nguyễn Văn An"
                          value={regForm.fullName}
                          onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Chức vụ</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Trưởng phòng Mua hàng / Giám đốc"
                          value={regForm.position}
                          onChange={(e) => setRegForm({ ...regForm, position: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại / Zalo *</label>
                        <input
                          type="tel"
                          required
                          placeholder="090x xxx xxx"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ *</label>
                        <input
                          type="email"
                          required
                          placeholder="email@company.vn"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Doanh nghiệp / Nhà máy *</label>
                        <input
                          type="text"
                          required
                          placeholder="Tên công ty đầy đủ"
                          value={regForm.companyName}
                          onChange={(e) => setRegForm({ ...regForm, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Khu công nghiệp / Địa chỉ</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: KCN Thái Hòa, Tây Ninh / TP.HCM"
                          value={regForm.address}
                          onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                    </div>

                    {/* Needs or Products Specification */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {regRole === 'buyer' ? 'Chi tiết Nhu cầu cần mua / kết nối *' : 'Sản phẩm & Năng lực chủ lực muốn giới thiệu *'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder={
                          regRole === 'buyer'
                            ? 'Ví dụ: Cần mua thùng carton 5 lớp 100.000 cái/tháng, tìm đơn vị vận tải xe tải 5 tấn, cần xử lý nước thải...'
                            : 'Ví dụ: Cung cấp pallet gỗ tiêu chuẩn xuất khẩu, hóa chất xử lý cáu cặn lò hơi, hệ thống lọc bụi...'
                        }
                        value={regForm.needsOrProducts}
                        onChange={(e) => setRegForm({ ...regForm, needsOrProducts: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    {/* Package Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Chọn gói đăng ký tham gia:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                        
                        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer ${regPackage === 'member' ? 'border-blue-600 bg-blue-50/70 font-bold' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pkg"
                              checked={regPackage === 'member'}
                              onChange={() => setRegPackage('member')}
                            />
                            <span>Hội viên CCU / KCN</span>
                          </div>
                          <div className="text-sm font-black text-blue-700 mt-2">750.000đ / pax</div>
                        </label>

                        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer ${regPackage === 'non_member' ? 'border-blue-600 bg-blue-50/70 font-bold' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pkg"
                              checked={regPackage === 'non_member'}
                              onChange={() => setRegPackage('non_member')}
                            />
                            <span>Chưa là Hội viên</span>
                          </div>
                          <div className="text-sm font-black text-slate-900 mt-2">1.000.000đ / pax</div>
                        </label>

                        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer ${regPackage === 'booth_member' ? 'border-blue-600 bg-blue-50/70 font-bold' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pkg"
                              checked={regPackage === 'booth_member'}
                              onChange={() => setRegPackage('booth_member')}
                            />
                            <span>Bàn trưng bày (Hội viên)</span>
                          </div>
                          <div className="text-sm font-black text-orange-600 mt-2">1.500.000đ</div>
                        </label>

                        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer ${regPackage === 'booth_non_member' ? 'border-blue-600 bg-blue-50/70 font-bold' : 'border-slate-200 bg-white'}`}>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="pkg"
                              checked={regPackage === 'booth_non_member'}
                              onChange={() => setRegPackage('booth_non_member')}
                            />
                            <span>Bàn trưng bày (Non-HV)</span>
                          </div>
                          <div className="text-sm font-black text-orange-600 mt-2">2.000.000đ</div>
                        </label>

                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Thông tin đăng ký được bảo mật & chỉ gửi đối tác khi có sự đồng ý.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm transition shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Đang gửi đăng ký...' : 'XÁC NHẬN ĐĂNG KÝ NGAY'}
                      </button>
                    </div>

                  </form>
                )}

              </div>

            </div>
          </section>
        </>
      )}

      {/* ========================================================
          VIEWPORT FOR TAB 2: ĐANG DIỄN RA
      ======================================================== */}
      {activeLifecycleTab === 'live-event' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">PHIÊN KẾT NỐI ĐANG DIỄN RA</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Sự kiện sẽ chính thức kích hoạt vào <strong>08:00 Thứ Tư, 07/10/2026</strong>.
              Hệ thống sẽ mở luồng check-in QR Pass và điều phối bàn gặp 1:1 thời gian thực tại đây.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveLifecycleTab('pre-event')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Về trang thông tin & Đăng ký
              </button>
              <button
                onClick={() => setActiveLifecycleTab('post-event')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Xem trước danh sách 42 doanh nghiệp
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          VIEWPORT FOR TAB 3: SAU SỰ KIỆN (BẢNG 42 DOANH NGHIỆP THAM GIA ĐÃ HOÀN THIỆN)
      ======================================================== */}
      {activeLifecycleTab === 'post-event' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header Title + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                  Danh sách doanh nghiệp tham gia
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Tìm kiếm, xem thông tin và kết nối nhanh với các doanh nghiệp đã tham gia Ngày hội Chuỗi Cung Ứng KCN Thái Hòa 2026.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải danh sách</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Đã sao chép liên kết sự kiện!');
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>

            {/* Quick Role Filter Pills + Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* 4 Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 text-xs font-bold">
                <button
                  onClick={() => { setRoleFilter('all'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    roleFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-2xs font-black'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Tất cả ({counts.all})
                </button>

                <button
                  onClick={() => { setRoleFilter('buyer'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    roleFilter === 'buyer'
                      ? 'bg-blue-600 text-white shadow-2xs font-black'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Nhà máy / Buyer ({counts.buyer})
                </button>

                <button
                  onClick={() => { setRoleFilter('supplier'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    roleFilter === 'supplier'
                      ? 'bg-blue-600 text-white shadow-2xs font-black'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Nhà cung ứng / Supplier ({counts.supplier})
                </button>

                <button
                  onClick={() => { setRoleFilter('booth'); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                    roleFilter === 'booth'
                      ? 'bg-blue-600 text-white shadow-2xs font-black'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Bàn trưng bày ({counts.booth})
                </button>
              </div>

              {/* Search Input */}
              <div className="relative min-w-[280px] lg:w-80">
                <input
                  type="text"
                  placeholder="Tìm tên doanh nghiệp, ngành nghề..."
                  value={searchKw}
                  onChange={(e) => { setSearchKw(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

            </div>

            {/* Secondary Filter Dropdowns Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Ngành nghề */}
                <select
                  value={industryFilter}
                  onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Ngành nghề</option>
                  {distinctIndustries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>

                {/* 2. Vai trò */}
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Vai trò</option>
                  <option value="buyer">Nhà máy / Buyer</option>
                  <option value="supplier">Nhà cung ứng / Supplier</option>
                  <option value="booth">Bàn trưng bày</option>
                </select>

                {/* 3. Nhu cầu / Sản phẩm */}
                <select
                  value={searchKw}
                  onChange={(e) => { setSearchKw(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer max-w-[200px]"
                >
                  <option value="">Nhu cầu / Sản phẩm</option>
                  <option value="Pallet">Pallet gỗ, pallet nhựa</option>
                  <option value="Xử lý nước">Xử lý nước thải</option>
                  <option value="HVAC">HVAC & thông gió</option>
                  <option value="Tài chính">Tài chính, ngân hàng</option>
                  <option value="Drone">Drone, giám sát nhà xưởng</option>
                  <option value="Logistics">Logistics, vận chuyển</option>
                  <option value="Bao bì">Bao bì carton, chai PET</option>
                  <option value="Hóa chất">Hóa chất công nghiệp</option>
                  <option value="Phân bón">Phân bón</option>
                  <option value="Thuốc BVTV">Thuốc BVTV</option>
                </select>

                {/* 4. Trạng thái follow-up */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Trạng thái follow-up</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="waiting">Chờ phản hồi</option>
                  <option value="contacted">Đã liên hệ</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="pending">Chưa thực hiện</option>
                </select>

                {/* 5. Khu vực */}
                <select
                  value={regionFilter}
                  onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">Khu vực</option>
                  {distinctRegions.map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* Nút Xóa lọc */}
              <button
                onClick={() => {
                  setSearchKw('');
                  setRoleFilter('all');
                  setIndustryFilter('all');
                  setStatusFilter('all');
                  setRegionFilter('all');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium px-2 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa lọc</span>
              </button>

            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border border-slate-200/90 rounded-2xl shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 w-10 text-center">#</th>
                    <th className="py-3 px-2 w-12 text-center">Logo</th>
                    <th className="py-3 px-3 min-w-[150px]">Doanh nghiệp</th>
                    <th className="py-3 px-3 min-w-[140px]">Ngành nghề</th>
                    <th className="py-3 px-2 text-center min-w-[90px]">Vai trò</th>
                    <th className="py-3 px-3 min-w-[180px]">Nhu cầu / Sản phẩm chính</th>
                    <th className="py-3 px-2 text-center min-w-[70px]">Số cuộc gặp</th>
                    <th className="py-3 px-3 min-w-[130px]">Next Action</th>
                    <th className="py-3 px-2 text-center min-w-[100px]">Trạng thái</th>
                    <th className="py-3 px-3 text-center min-w-[180px]">Liên hệ nhanh</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* 1. STT */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                        {item.code}
                      </td>

                      {/* 2. Logo */}
                      <td className="py-3.5 px-2 text-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto overflow-hidden">
                          {item.id === 1 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <path d="M12 14c-3.3 0-6 2.7-6 6s2.7 6 6 6c3 0 5.4-2.2 7-4.6 1.6-2.4 4-4.6 7-4.6 3.3 0 6 2.7 6 6s-2.7 6-6 6c-3 0-5.4-2.2-7-4.6" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : item.id === 2 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <circle cx="20" cy="20" r="16" stroke="#0284c7" strokeWidth="3" />
                              <path d="M12 22c4 4 12 4 16-4" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          ) : item.id === 3 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <path d="M20 6v28M6 20h28M10 10l20 20M30 10L10 30" stroke="#0072ce" strokeWidth="3.5" strokeLinecap="round"/>
                              <circle cx="20" cy="20" r="3.5" fill="#0072ce"/>
                            </svg>
                          ) : item.id === 4 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <circle cx="20" cy="20" r="15" fill="#e11d48"/>
                              <circle cx="20" cy="20" r="7.5" fill="#1e3a8a"/>
                              <circle cx="20" cy="20" r="3.5" fill="white"/>
                            </svg>
                          ) : item.id === 5 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="black">
                              <path d="M8 8h6l18 24h-6L8 8z" fill="#0f172a"/>
                              <path d="M32 8h-6L8 32h6l18-24z" fill="#0f172a"/>
                            </svg>
                          ) : item.id === 6 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <circle cx="20" cy="20" r="15" fill="#dc2626"/>
                              <path d="M12 24h16l-3 5H15l-3-5z" fill="white"/>
                              <path d="M20 11v10M17 15l3-4 3 4" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                          ) : item.id === 7 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <path d="M14 15a6 6 0 100 10h5" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round"/>
                              <path d="M26 25a6 6 0 100-10h-5" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          ) : item.id === 8 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <rect x="8" y="8" width="24" height="24" rx="6" stroke="#f97316" strokeWidth="3.5"/>
                              <path d="M15 14h6a5 5 0 010 10h-6V14z" fill="#f97316"/>
                            </svg>
                          ) : item.id === 9 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <circle cx="20" cy="20" r="15" fill="#0284c7"/>
                              <path d="M16 13h5.5a4.5 4.5 0 010 9H16V13z" fill="white"/>
                              <path d="M16 13v14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                          ) : item.id === 10 ? (
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                              <circle cx="20" cy="20" r="15" fill="#16a34a"/>
                              <path d="M20 12c-5 0-8 5-8 10 0 3 2 5 5 5 5 0 11-4 11-12 0-2-3-3-8-3z" fill="white"/>
                            </svg>
                          ) : (
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-2xs ${item.logoBg}`}>
                              {item.logoText}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Tên Doanh nghiệp */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition">
                          {item.name}
                        </div>
                      </td>

                      {/* 4. Ngành nghề */}
                      <td className="py-3.5 px-3 text-slate-600 text-[11px] leading-tight">
                        {item.industry}
                      </td>

                      {/* 5. Vai trò */}
                      <td className="py-3.5 px-2 text-center whitespace-nowrap">
                        {item.role === 'buyer' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#dcfce7] text-[#15803d]">
                            Nhà máy
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#0084ff] text-white">
                            Nhà cung ứng
                          </span>
                        )}
                      </td>

                      {/* 6. Nhu cầu / Sản phẩm chính */}
                      <td className="py-3.5 px-3 font-medium text-slate-800 text-[11px] leading-tight">
                        {item.mainProducts}
                      </td>

                      {/* 7. Số cuộc gặp */}
                      <td className="py-3.5 px-2 text-center font-bold text-slate-900 text-sm">
                        {item.meetingsCount}
                      </td>

                      {/* 8. Next Action */}
                      <td className="py-3.5 px-3 text-slate-700 font-medium text-[11px]">
                        {item.nextAction}
                      </td>

                      {/* 9. Trạng thái */}
                      <td className="py-3.5 px-2 text-center whitespace-nowrap">
                        {item.status === 'processing' || item.status === 'confirmed' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f9ed] text-[#15803d]">
                            {item.statusName}
                          </span>
                        ) : item.status === 'waiting' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
                            {item.statusName}
                          </span>
                        ) : item.status === 'contacted' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e0f2fe] text-[#0369a1]">
                            {item.statusName}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fee2e2] text-[#b91c1c]">
                            {item.statusName}
                          </span>
                        )}
                      </td>

                      {/* 10. Bộ Liên hệ nhanh */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                          
                          {/* Nút Hồ sơ */}
                          <button
                            onClick={() => setSelectedCompany(item)}
                            title="Xem hồ sơ chi tiết"
                            className="px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hồ sơ</span>
                          </button>

                          {/* Call */}
                          <a
                            href={`tel:${item.phone}`}
                            title={`Gọi: ${item.phone}`}
                            className="w-7 h-7 rounded-md bg-[#e6f9ed] hover:bg-emerald-100 text-[#15803d] flex items-center justify-center transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* Email */}
                          <a
                            href={`mailto:${item.email}`}
                            title={`Email: ${item.email}`}
                            className="w-7 h-7 rounded-md bg-[#e0f2fe] hover:bg-blue-100 text-[#0284c7] flex items-center justify-center transition"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          {/* Web */}
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            title={`Website: ${item.website}`}
                            className="w-7 h-7 rounded-md bg-[#f0f4f8] hover:bg-slate-200 text-[#475569] flex items-center justify-center transition"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>

                          {/* Zalo */}
                          <button
                            onClick={() => setShowZaloModal(item)}
                            title={`Kết nối Zalo: ${item.zalo}`}
                            className="px-2.5 py-1 rounded-md bg-[#0068ff] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                          >
                            <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-sans uppercase">Zalo</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-600">
              
              <div>
                Hiển thị <strong>{((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredList.length)}</strong> của <strong>{filteredList.length}</strong> doanh nghiệp
              </div>

              <div className="flex items-center gap-3">
                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentPage === p
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Page Size Select */}
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <span>Số dòng mỗi trang:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={42}>42</option>
                  </select>
                </div>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ========================================================
          MODAL: PROFILE POPUP
      ======================================================== */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setSelectedCompany(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white ${selectedCompany.logoBg}`}>
                {selectedCompany.logoText}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">{selectedCompany.name}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-semibold text-blue-700">{selectedCompany.roleName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{selectedCompany.industry}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 border-y border-slate-100 py-3.5">
              <div>
                <span className="text-slate-500 font-medium">Sản phẩm / Nhu cầu chính:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedCompany.mainProducts}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Next Action:</span>
                <p className="font-bold text-blue-700 mt-0.5">{selectedCompany.nextAction} ({selectedCompany.statusName})</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Khu vực:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedCompany.region}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Ghi chú kết nối:</span>
                <p className="font-medium text-slate-700 mt-0.5 italic">{selectedCompany.notes}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2.5">
              <a
                href={`tel:${selectedCompany.phone}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi: {selectedCompany.phone}</span>
              </a>
              <button
                onClick={() => {
                  setSelectedCompany(null);
                  setShowZaloModal(selectedCompany);
                }}
                className="px-4 py-2 rounded-xl bg-[#0068ff] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Nhắn Zalo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ZALO CONNECT POPUP
      ======================================================== */}
      {showZaloModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-blue-200 text-center relative animate-scale-up">
            <button
              onClick={() => setShowZaloModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#0068ff] text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-md">
              Zalo
            </div>

            <h4 className="text-base font-black text-slate-900">Kết nối Zalo nhanh</h4>
            <p className="text-xs text-slate-600 mt-1 mb-4">
              Kết nối với đầu mối <strong>{showZaloModal.name}</strong> qua số điện thoại:
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-4">
              <div className="text-base font-mono font-black text-[#0068ff]">{showZaloModal.zalo}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{showZaloModal.name}</div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://zalo.me/${showZaloModal.zalo.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#0068ff] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Mở Zalo kết nối ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showZaloModal.zalo.replace(/\s+/g, ''));
                  showToast('Đã sao chép số Zalo: ' + showZaloModal.zalo);
                  setShowZaloModal(null);
                }}
                className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Sao chép số điện thoại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
