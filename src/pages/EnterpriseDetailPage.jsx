import { privateBrowserStorage } from "../services/privateBrowserStorage.js";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, ArrowRight, 
  ChevronRight, ChevronLeft, Award, Shield, Sparkles, ExternalLink,
  Layers, Factory, Cpu, Wrench, Truck, Leaf, X, MessageCircle,
  Tag, ShieldCheck, Check, Clock, ChevronDown, ChevronUp,
  Briefcase, Target, UserCheck, HelpCircle, ArrowUpRight,
  Send, Copy, CheckCheck, Bookmark, Eye, Image as ImageIcon,
  CheckCircle, Hash, Compass, Info, Headphones, User,
  AlertTriangle, AlertCircle, Download, Bot, Video, FileCheck,
  RefreshCw, Play, ShieldAlert, Sparkle, Search, ThumbsUp,
  Smartphone, Contact, ImageOff
} from 'lucide-react';
import { suppliers as enterprisesFullList } from '../data/cloudData.js';
import foundingPartnersData from '../data/foundingPartners.json';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';
import { 
  getCompanyMonogram, 
  getMonogramGradient, 
  isValidCustomLogo, 
  getCategoryBannerImage, 
  getEnterpriseAvatarImage,
  synthesizeEnterpriseProfile
} from '../utils/companyUtils';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';

// Phase reference taxonomy
export const MASTER_18_PHASES_MAP = {
  "1.1": { title: "1.1 Khảo sát & Định hướng", stage: 1, stageName: "Chuẩn bị & Đầu tư", color: "blue" },
  "1.2": { title: "1.2 Pháp lý & Giấy phép ĐTM", stage: 1, stageName: "Chuẩn bị & Đầu tư", color: "blue" },
  "1.3": { title: "1.3 Lựa chọn Địa điểm & KCN", stage: 1, stageName: "Chuẩn bị & Đầu tư", color: "blue" },
  "2.1": { title: "2.1 Thiết kế Quy hoạch & MEP", stage: 2, stageName: "Thiết kế & Xây dựng", color: "indigo" },
  "2.2": { title: "2.2 Thi công Nhà xưởng & Kết cấu", stage: 2, stageName: "Thiết kế & Xây dựng", color: "indigo" },
  "2.3": { title: "2.3 Hạ tầng Kỹ thuật & PCCC", stage: 2, stageName: "Thiết kế & Xây dựng", color: "indigo" },
  "3.1": { title: "3.1 Cung ứng Máy móc Dây chuyền", stage: 3, stageName: "Lắp đặt & Hoàn thiện", color: "cyan" },
  "3.2": { title: "3.2 Cơ điện Lạnh & Tự động hóa", stage: 3, stageName: "Lắp đặt & Hoàn thiện", color: "cyan" },
  "3.3": { title: "3.3 Hiệu chuẩn & Nghiệm thu", stage: 3, stageName: "Lắp đặt & Hoàn thiện", color: "cyan" },
  "4.1": { title: "4.1 Cung ứng Nguyên vật liệu & Hóa chất", stage: 4, stageName: "Vận hành Sản xuất", color: "emerald" },
  "4.2": { title: "4.2 Gia công Cơ khí & Phụ trợ", stage: 4, stageName: "Vận hành Sản xuất", color: "emerald" },
  "4.3": { title: "4.3 Bảo trì Thiết bị & Quản lý QC", stage: 4, stageName: "Vận hành Sản xuất", color: "emerald" },
  "5.1": { title: "5.1 Tuyển dụng & Đào tạo Lao động", stage: 5, stageName: "Nhân sự & Hậu cần", color: "amber" },
  "5.2": { title: "5.2 Logistics, Kho bãi & Xe nâng", stage: 5, stageName: "Nhân sự & Hậu cần", color: "amber" },
  "5.3": { title: "5.3 Suất ăn Công nghiệp & Đồng phục PPE", stage: 5, stageName: "Nhân sự & Hậu cần", color: "amber" },
  "6.1": { title: "6.1 Chuyển đổi số & Smart Factory", stage: 6, stageName: "Mở rộng – Tối ưu hóa", color: "purple" },
  "6.2": { title: "6.2 Năng lượng Xanh & Tiêu chuẩn ESG", stage: 6, stageName: "Mở rộng – Tối ưu hóa", color: "purple" },
  "6.3": { title: "6.3 Mở rộng Công suất & M&A", stage: 6, stageName: "Mở rộng – Tối ưu hóa", color: "purple" },
};

// Category to Phase Mapping Function (Gán pha tự động cho mọi ngành nghề)
export function getCategoryPhaseInfo(categoryName) {
  const cat = (categoryName || "").toLowerCase();
  
  if (cat.includes("phao") || cat.includes("áo phao") || cat.includes("bảo hộ") || cat.includes("đồng phục") || cat.includes("cứu hộ") || cat.includes("an toàn sông nước") || cat.includes("ppe")) {
    return {
      phase: "5.3",
      phaseTitle: "Đồng phục & Bảo hộ lao động (PPE)",
      stage: 5,
      stageName: "Nhân sự & Hậu cần",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagColor: "bg-amber-500 text-white",
      roleDescription: "Cung cấp trang thiết bị bảo hộ an toàn sông nước, phao cứu sinh đạt chuẩn kiểm định cho nhà máy, khu nghỉ dưỡng và công trình thủy lợi."
    };
  }
  if (cat.includes("bể bơi") || cat.includes("hồ bơi") || cat.includes("máy bơm") || cat.includes("dây chuyền") || cat.includes("thiết bị công nghiệp") || cat.includes("lắp đặt máy")) {
    return {
      phase: "3.1",
      phaseTitle: "Cung ứng Máy móc Dây chuyền & Thiết bị",
      stage: 3,
      stageName: "Lắp đặt & Hoàn thiện",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      tagColor: "bg-blue-600 text-white",
      roleDescription: "Cung ứng thiết bị lọc nước tuần hoàn, bình lọc cát, máy cấp nhiệt và giải pháp công nghệ kỹ thuật bể bơi trọn gói."
    };
  }
  if (cat.includes("thi công") || cat.includes("xây dựng") || cat.includes("kết cấu") || cat.includes("nhà xưởng") || cat.includes("hạ tầng")) {
    return {
      phase: "2.2",
      phaseTitle: "Thi công Nhà xưởng & Công trình Kết cấu",
      stage: 2,
      stageName: "Thiết kế & Xây dựng",
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
      tagColor: "bg-indigo-600 text-white",
      roleDescription: "Tư vấn thiết kế kiến trúc, kết cấu bể bơi và thi công chống thấm, hoàn thiện cảnh quan tiện ích cho công trình."
    };
  }
  if (cat.includes("xông hơi") || cat.includes("cơ điện lạnh") || cat.includes("mep") || cat.includes("tiện ích") || cat.includes("nhiệt lạnh")) {
    return {
      phase: "3.2",
      phaseTitle: "Cơ điện Lạnh & Tiện ích Không gian",
      stage: 3,
      stageName: "Lắp đặt & Hoàn thiện",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-300",
      tagColor: "bg-cyan-600 text-white",
      roleDescription: "Lắp đặt phòng xông khô (Sauna), xông ướt (Steam), máy xông hơi nhập khẩu cho tổ hợp thể thao và tiện ích công nghiệp."
    };
  }
  if (cat.includes("gạch") || cat.includes("mosaic") || cat.includes("vật liệu") || cat.includes("vật tư hoàn thiện") || cat.includes("sơn")) {
    return {
      phase: "4.1",
      phaseTitle: "Cung ứng Nguyên vật liệu & Hoàn thiện",
      stage: 4,
      stageName: "Vận hành Sản xuất",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagColor: "bg-emerald-600 text-white",
      roleDescription: "Phân phối gạch mosaic thủy tinh, mosaic gốm sứ cao cấp chống trơn trượt, chịu hóa chất chuyên dụng cho bể bơi và công trình."
    };
  }
  if (cat.includes("hóa chất") || cat.includes("chất trợ lắng") || cat.includes("xử lý nước") || cat.includes("nước thải") || cat.includes("chlorine") || cat.includes("pac") || cat.includes("dung môi")) {
    return {
      phase: "4.1",
      phaseTitle: "Hóa chất Công nghiệp & Xử lý Môi trường",
      stage: 4,
      stageName: "Vận hành Sản xuất",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagColor: "bg-emerald-600 text-white",
      roleDescription: "Cung ứng số lượng lớn hóa chất khử trùng Chlorine 70%, trợ lắng PAC, TCCA khử khuẩn nguồn nước công nghiệp và bể bơi."
    };
  }
  if (cat.includes("bao bì") || cat.includes("carton") || cat.includes("pallet") || cat.includes("in ấn")) {
    return {
      phase: "4.1",
      phaseTitle: "Bao bì & Vật tư Phụ trợ Đóng gói",
      stage: 4,
      stageName: "Vận hành Sản xuất",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagColor: "bg-emerald-600 text-white",
      roleDescription: "Sản xuất và cung ứng bao bì carton, pallet, màng PE phục vụ đóng gói và lưu kho công nghiệp."
    };
  }
  if (cat.includes("logistics") || cat.includes("kho bãi") || cat.includes("vận chuyển") || cat.includes("xe nâng")) {
    return {
      phase: "5.2",
      phaseTitle: "Logistics, Kho bãi & Xe nâng",
      stage: 5,
      stageName: "Nhân sự & Hậu cần",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      tagColor: "bg-amber-600 text-white",
      roleDescription: "Dịch vụ vận tải liên vùng, bến bãi lưu kho và bốc xếp hàng hóa công nghiệp an toàn."
    };
  }
  if (cat.includes("chế tạo") || cat.includes("cơ khí") || cat.includes("gia công") || cat.includes("cnc") || cat.includes("khuôn")) {
    return {
      phase: "4.2",
      phaseTitle: "Gia công Cơ khí & Phụ trợ B2B",
      stage: 4,
      stageName: "Vận hành Sản xuất",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      tagColor: "bg-emerald-600 text-white",
      roleDescription: "Gia công chi tiết máy, đồ gá, linh kiện cơ khí chính xác theo bản vẽ kỹ thuật CAD/CAM."
    };
  }
  
  return {
    phase: "4.1",
    phaseTitle: "Cung ứng Sản xuất & Dịch vụ Kỹ thuật",
    stage: 4,
    stageName: "Vận hành Sản xuất",
    badgeColor: "bg-slate-100 text-slate-900 border-slate-300",
    tagColor: "bg-slate-700 text-white",
    roleDescription: "Cung ứng sản phẩm, hàng hóa và dịch vụ kỹ thuật phục vụ vận hành chuỗi cung ứng công nghiệp."
  };
}

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
    { image: "/api/media/pic/395750113/Ao-phao(2).jpg", title: "Áo phao bơi cứu hộ tiêu chuẩn TCVN" },
    { image: "/api/media/pic/395750113/Phao-cuu-sinh-tron(1).jpg", title: "Phao cứu sinh tròn xốp tổng hợp" },
    { image: "/api/media/pic/395750113/Day-phao-chia-lan(1).jpg", title: "Dây phao chia làn bơi thi đấu hồ bơi" },
    { image: "/api/media/pic/395750113/Phao-nem(1).jpg", title: "Phao ném cứu hộ chuyên dụng mặt nước" },
    { image: "/api/media/pic/395750113/Ao-phao(1).jpg", title: "Áo phao phản quang cứu hộ sông nước" },
    { image: "/api/media/pic/395750113/Phao-cuu-sinh-tron(3).jpg", title: "Phao tròn cứu hộ bể bơi và tàu thuyền" }
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
    { image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80", title: "Hóa chất công nghiệp & dung môi xử lý" },
    { image: "https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?w=800&auto=format&fit=crop&q=80", title: "Dung dịch khử trùng & hóa chất xử lý nước" },
    { image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80", title: "Hóa chất trợ lắng & xử lý môi trường" },
    { image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80", title: "Nguyên liệu & hóa chất đóng can tiêu chuẩn B2B" }
  ]
};

export function getCategoryFallbackPool(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("đồng phục") || cat.includes("may mặc") || cat.includes("quần áo") || cat.includes("bảo hộ") || cat.includes("phao")) {
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
  const { id: slugOrId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read matching requirement context from URL (?requirement=NC-... or ?draft=...)
  const requirementId = searchParams.get('requirement') || searchParams.get('need') || searchParams.get('draft') || '';
  const [activeRequirement, setActiveRequirement] = useState(null);

  useEffect(() => {
    if (!requirementId) {
      setActiveRequirement(null);
      return;
    }
    try {
      const savedById = privateBrowserStorage.getItem('ccu_draft_' + requirementId);
      if (savedById) {
        setActiveRequirement(JSON.parse(savedById));
        return;
      }
      const latestDraft = privateBrowserStorage.getItem('ccu_requirement_draft');
      if (latestDraft) {
        const parsed = JSON.parse(latestDraft);
        if (parsed.id === requirementId || requirementId === 'latest') {
          setActiveRequirement(parsed);
          return;
        }
      }
      const listStr = privateBrowserStorage.getItem('ccu_user_demands');
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
        title: 'Gói nhu cầu đang tìm nguồn (' + requirementId + ')',
        productService: 'Sản phẩm/dịch vụ công nghiệp',
        quantity: '500',
        unit: 'đơn vị',
        location: 'KCN Amata, Đồng Nai',
        deadline: 'Tháng sau'
      });
    } catch (e) {
      console.warn('Error reading requirement context:', e);
    }
  }, [requirementId]);

  // Robust enterprise lookup: supports ID, _id, sourceId, slug, and slugify(name)
  const localMatch = useMemo(() => {
    if (!slugOrId) return enterprisesFullList[0];
    const target = String(slugOrId).toLowerCase().trim();

    // 1. Exact ID or sourceId
    const byId = enterprisesFullList.find(e => 
      String(e.id).toLowerCase() === target || 
      String(e._id).toLowerCase() === target ||
      (e.sourceId && String(e.sourceId).toLowerCase() === target)
    );
    if (byId) return byId;

    // 2. Exact slug property
    const bySlug = enterprisesFullList.find(e => e.slug && String(e.slug).toLowerCase() === target);
    if (bySlug) return bySlug;

    // 3. Exact slugify(name) match
    const byNameSlug = enterprisesFullList.find(e => e.name && slugify(e.name) === target);
    if (byNameSlug) return byNameSlug;

    // 4. Partial slug match
    const byPartial = enterprisesFullList.find(e => {
      const s = e.slug || (e.name ? slugify(e.name) : '');
      return s.includes(target) || target.includes(s) || (e.sourceId && target.includes(e.sourceId));
    });
    if (byPartial) return byPartial;

    // Never fallback to Hanteco if not found in preview list
    return null;
  }, [slugOrId]);

  const [enterprise, setEnterprise] = useState(() => localMatch || {
    id: slugOrId,
    name: 'Đang tải hồ sơ doanh nghiệp...',
    category: 'Chuỗi Cung Ứng',
    isLoading: true
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTax, setCopiedTax] = useState(false);
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqNote, setRfqNote] = useState('');
  const [showRequestActionModal, setShowRequestActionModal] = useState(false);
  const [isAddedToRequirement, setIsAddedToRequirement] = useState(false);
  
  // Interactive Tabs & Keyword State
  const [selectedGalleryTab, setSelectedGalleryTab] = useState('all');
  const [showAllDetailKeywords, setShowAllDetailKeywords] = useState(false);
  const [showAllSuppiQuestions, setShowAllSuppiQuestions] = useState(false);

  // Câu hỏi gợi ý phong phú cho SUPPI & CHAINY được tạo tự động tương ứng theo từng doanh nghiệp
  const suppiChainyQuestions = useMemo(() => {
    const compName = enterprise?.shortName || (enterprise?.name ? enterprise.name.split('-')[0].trim() : 'Doanh nghiệp');
    const prov = enterprise?.province || 'toàn quốc';
    return [
      { label: `Sản phẩm và dịch vụ của ${compName} đáp ứng những tiêu chuẩn kỹ thuật, chứng chỉ chất lượng nào?` },
      { label: `${compName} có nhận gia công, may đo hoặc sản xuất theo yêu cầu kỹ thuật số lượng lớn không?` },
      { label: 'Chính sách số lượng đặt hàng tối thiểu (MOQ) và mức chiết khấu cho nhà thầu/đại lý ra sao?' },
      { label: `Thời gian giao hàng và tiến độ cung ứng đến các dự án tại ${prov} là bao lâu?` },
      { label: 'Các mặt hàng chủ lực có sẵn chứng chỉ xuất xứ CO/CQ, bảng kiểm định chất lượng không?' },
      { label: 'Quy cách đóng gói, chính sách bảo hành và đổi trả hàng hóa khi có lỗi kỹ thuật?' },
      { label: `${compName} có hỗ trợ khảo sát thực tế mặt bằng, tư vấn giải pháp kỹ thuật tận nơi không?` },
      { label: `Xin gửi bảng báo giá cạnh tranh mới nhất và hồ sơ năng lực chi tiết của ${compName}?` }
    ];
  }, [enterprise]);

  // Synthesized profile (3 paragraphs + factoryArea + monthlyOutput + mainCustomers + brands)
  const profile = useMemo(() => synthesizeEnterpriseProfile(enterprise), [enterprise]);

  // Update enterprise when localMatch changes or fetch from API if not in local list
  useEffect(() => {
    let isCancelled = false;
    const target = String(slugOrId || '').toLowerCase().trim();
    if (!target) return;

    if (localMatch) {
      setEnterprise(localMatch);
    }

    // Always fetch from backend API which has all 152,623 suppliers in SQLite to get full crawled data
    fetch(`/api/enterprises/${encodeURIComponent(slugOrId)}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!isCancelled && json?.success && json?.data) {
          setEnterprise(json.data);
        }
      })
      .catch(() => {});

    return () => { isCancelled = true; };
  }, [slugOrId, localMatch]);

  // Sync saved state from LocalStorage
  useEffect(() => {
    try {
      const savedList = JSON.parse(privateBrowserStorage.getItem('ccu_saved_suppliers') || '[]');
      setIsSaved(savedList.some(s => s.id === enterprise.id));
    } catch (e) {}
  }, [enterprise.id]);

  const handleToggleSave = () => {
    try {
      let savedList = JSON.parse(privateBrowserStorage.getItem('ccu_saved_suppliers') || '[]');
      if (isSaved) {
        savedList = savedList.filter(s => s.id !== enterprise.id);
        setIsSaved(false);
      } else {
        savedList.push({
          id: enterprise.id,
          name: enterprise.name,
          category: enterprise.category || enterprise.industry,
          province: enterprise.province,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
      }
      privateBrowserStorage.setItem('ccu_saved_suppliers', JSON.stringify(savedList));
    } catch (e) {}
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {}
  };

  // Canonical slug for SEO & URLs
  const canonicalSlug = enterprise.slug || slugify(enterprise.name || 'nha-cung-ung');

  // Slug redirection: Keep canonical path /nha-cung-ung/:canonicalSlug
  useEffect(() => {
    if (slugOrId && canonicalSlug && slugOrId !== canonicalSlug && !slugOrId.startsWith('slug-')) {
      const searchStr = searchParams.toString();
      navigate(`/nha-cung-ung/${canonicalSlug}${searchStr ? '?' + searchStr : ''}`, { replace: true });
    }
  }, [slugOrId, canonicalSlug, searchParams, navigate]);

  // Dynamic SEO title & meta
  useEffect(() => {
    document.title = `${enterprise.name} | Danh bạ Nhà Cung Ứng Chuỗi Cung Ứng`;
  }, [enterprise.name]);

  // Check if enterprise is a Founding Partner
  const isFoundingPartner = useMemo(() => {
    if (enterprise.isFoundingPartner || enterprise.foundingPartner) return true;
    const fpKeys = Object.keys(foundingPartnersData);
    return fpKeys.some(k => {
      const fp = foundingPartnersData[k];
      return fp && (fp.name === enterprise.name || fp.id === enterprise.id || (enterprise.name && enterprise.name.includes(fp.name)));
    });
  }, [enterprise]);

  // Structured categories list with phases
  const categoriesWithPhases = useMemo(() => {
    if (enterprise.categories && Array.isArray(enterprise.categories) && enterprise.categories.length > 0) {
      return enterprise.categories.map(cat => {
        const catName = typeof cat === 'string' ? cat : cat.name;
        const phaseInfo = getCategoryPhaseInfo(catName);
        return {
          id: cat.id || slugify(catName),
          name: catName,
          url: cat.url,
          ...phaseInfo,
          ...(typeof cat === 'object' ? cat : {})
        };
      });
    }
    
    // Fallback if enterprise has single category / industry
    const fallbackList = [
      enterprise.category || "An Toàn Sông Nước - Phao, áo phao,..",
      enterprise.industry || "Thiết bị bảo hộ & an toàn"
    ].filter(Boolean);

    return [...new Set(fallbackList)].map(catName => ({
      id: slugify(catName),
      name: catName,
      ...getCategoryPhaseInfo(catName)
    }));
  }, [enterprise]);

  // All Crawled Images with Captions & Phân loại danh mục
  const allCrawledImages = useMemo(() => {
    const isHanteco = (enterprise?.name || '').toLowerCase().includes('hanteco');

    if (enterprise?.images && Array.isArray(enterprise.images) && enterprise.images.length > 0) {
      return enterprise.images.map((imgUrl, idx) => {
        let caption = (enterprise.imageCaptions && enterprise.imageCaptions[idx]) || '';
        const text = (caption + ' ' + imgUrl).toLowerCase();

        if (isHanteco) {
          let categoryName = 'Thiết bị & Dịch vụ khác';
          let categoryKey = 'other';
          if (text.includes('ao-phao') || text.includes('áo phao')) {
            categoryName = 'Áo phao các loại';
            categoryKey = 'lifebuoy';
            if (!caption) caption = 'Áo phao';
          } else if (text.includes('cuu-sinh') || text.includes('phao-cuu-sinh') || text.includes('phao-nem') || text.includes('chia-lan') || text.includes('phao cứu sinh') || text.includes('phao tròn') || text.includes('phao ném')) {
            categoryName = 'Phao cứu sinh';
            categoryKey = 'rescue_buoy';
            if (!caption) caption = text.includes('chia-lan') ? 'Dây phao chia làn' : (text.includes('nem') ? 'Phao ném' : 'Phao cứu sinh tròn');
          } else if (text.includes('be-boi') || text.includes('binh loc') || text.includes('binh-loc') || text.includes('may-bom') || text.includes('robot') || text.includes('gia-nhiet') || text.includes('cau-truot') || text.includes('sen-tam') || text.includes('den') || text.includes('thang')) {
            categoryName = 'Thiết bị bể bơi';
            categoryKey = 'pool_equipment';
            if (!caption) caption = 'Thiết bị bể bơi';
          } else if (text.includes('mosaic') || text.includes('gach')) {
            categoryName = 'Gạch mosaic';
            categoryKey = 'mosaic';
            if (!caption) caption = 'Gạch mosaic';
          } else if (text.includes('hoa-chat') || text.includes('xong-hoi') || text.includes('pac') || text.includes('chlorine') || text.includes('tcca') || text.includes('70plus')) {
            categoryName = 'Hóa chất & Thiết bị xông hơi';
            categoryKey = 'chemical_steam';
            if (!caption) caption = 'Hóa chất xử lý nước';
          } else {
            if (!caption) caption = `Sản phẩm ${idx + 1}`;
          }
          return { url: imgUrl, caption, index: idx, categoryName, categoryKey };
        }

        // Generic dynamic classification for all other suppliers
        let categoryName = 'Sản phẩm tiêu biểu';
        let categoryKey = 'prod_main';

        if (Array.isArray(enterprise.productGroups) && enterprise.productGroups.length > 0) {
          const matchedGroup = enterprise.productGroups.find(g => {
            const gName = typeof g === 'string' ? g : (g?.name || '');
            return gName && (text.includes(gName.toLowerCase()) || gName.toLowerCase().includes(caption.toLowerCase()));
          });
          if (matchedGroup) {
            const gName = typeof matchedGroup === 'string' ? matchedGroup : (matchedGroup?.name || 'Sản phẩm tiêu biểu');
            categoryName = gName;
            categoryKey = 'grp_' + gName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
          } else {
            // Distribute across product groups by index
            const g = enterprise.productGroups[idx % enterprise.productGroups.length];
            const gName = typeof g === 'string' ? g : (g?.name || 'Sản phẩm tiêu biểu');
            categoryName = gName;
            categoryKey = 'grp_' + gName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
          }
        }

        if (!caption) {
          caption = `${enterprise.shortName || 'Sản phẩm'} - Mẫu ${idx + 1}`;
        }

        return {
          url: imgUrl,
          caption,
          index: idx,
          categoryName,
          categoryKey
        };
      });
    }
    
    // Không tự động chèn ảnh mẫu hay fallback ảnh ngoài nếu crawl không có ảnh theo yêu cầu
    return [];
  }, [enterprise]);

  // Grouped Gallery Images chia thành các danh mục riêng biệt
  const groupedGalleryImages = useMemo(() => {
    const isHanteco = (enterprise?.name || '').toLowerCase().includes('hanteco');

    if (isHanteco) {
      const definitions = [
        { id: 'lifebuoy', title: 'Áo phao các loại' },
        { id: 'rescue_buoy', title: 'Phao cứu sinh' },
        { id: 'pool_equipment', title: 'Thiết bị bể bơi' },
        { id: 'mosaic', title: 'Gạch mosaic' },
        { id: 'chemical_steam', title: 'Hóa chất & Thiết bị xông hơi' },
        { id: 'other', title: 'Sản phẩm & Dự án khác' }
      ];
      const map = {};
      definitions.forEach(d => { map[d.id] = { ...d, items: [] }; });
      allCrawledImages.forEach(img => {
        const k = img.categoryKey || 'other';
        if (map[k]) map[k].items.push(img);
        else {
          if (!map['other']) map['other'] = { id: 'other', title: 'Sản phẩm khác', items: [] };
          map['other'].items.push(img);
        }
      });
      return definitions.map(d => map[d.id]).filter(d => d && d.items.length > 0);
    }

    // Dynamic grouping for all other suppliers
    const map = {};
    allCrawledImages.forEach(img => {
      const k = img.categoryKey || 'other';
      if (!map[k]) {
        map[k] = {
          id: k,
          title: img.categoryName || 'Sản phẩm tiêu biểu',
          items: []
        };
      }
      map[k].items.push(img);
    });

    return Object.values(map);
  }, [allCrawledImages, enterprise]);

  // Gallery category tabs
  const galleryTabs = useMemo(() => {
    const tabs = [{ id: 'all', label: 'Tất cả', count: allCrawledImages.length }];
    groupedGalleryImages.forEach(g => {
      tabs.push({ id: g.id, label: g.title, count: g.items.length });
    });
    return tabs;
  }, [allCrawledImages, groupedGalleryImages]);

  // Dữ liệu từ khóa phân nhóm chuẩn tương ứng từng doanh nghiệp
  const groupedKeywords = useMemo(() => {
    const isHanteco = (enterprise?.name || '').toLowerCase().includes('hanteco');

    if (isHanteco) {
      return [
        {
          title: "Áo phao - Phao cứu sinh - Phao ném",
          keywords: ["Phao ném", "Áo phao bơi", "Phao cứu sinh", "Áo phao cứu hộ", "Phao chia làn bơi"]
        },
        {
          title: "Thiết bị bể bơi",
          keywords: [
            "Thang bể bơi", "Máy bơm bể bơi", "Bình lọc cát bể bơi", "Máy cấp nhiệt bể bơi",
            "Đèn bể bơi chịu nước", "Thiết bị vệ sinh hồ bơi", "Cây sen tắm ngoài trời",
            "Thanh thoát tràn bể bơi", "Cụm xử lý nước bể bơi", "Thiết bị khử trùng bể bơi",
            "Cây sen tắm ngoài trời Ruby"
          ]
        },
        {
          title: "Gạch mosaic – Gạch mosaic trang trí",
          keywords: [
            "Gạch thẻ mosaic", "Gạch mosaic gốm", "Gạch mosaic vảy cá",
            "Gạch mosaic bể bơi", "Gạch mosaic trang trí", "Gạch mosaic thủy tinh"
          ]
        },
        {
          title: "Hóa chất bể bơi",
          keywords: [
            "Hóa chất PAC", "Hóa chất TCCA", "Hoá chất Chlorine",
            "Hóa chất đồng sunfat", "Hóa chất diệt rêu Atrine", "Hóa chất K-Chlorine 70 Plus"
          ]
        },
        {
          title: "Thiết bị xông hơi",
          keywords: [
            "Máy xông hơi khô", "Máy xông hơi ướt", "Ghế phòng xông hơi", "Gỗ thông phòng xông hơi",
            "Bồn tắm Ruby", "Bồn sục Jacuzzi", "Bồn tắm sục Ruby", "Bồn cầu thông minh Ruby"
          ]
        },
        {
          title: "Dịch vụ bể bơi & Thi công",
          keywords: [
            "Tư vấn thiết kế phòng xông", "Thi công lắp đặt phòng xông", "Sản xuất áo phao theo yêu cầu",
            "Cải tạo nâng cấp sửa chữa bể bơi", "Tư vấn thiết kế thi công lắp đặt bể bơi", "Cải tạo nâng cấp sửa chữa phòng xông"
          ]
        }
      ];
    }

    if (enterprise?.groupedKeywords && enterprise.groupedKeywords.length > 0) {
      return enterprise.groupedKeywords;
    }

    // Dynamic groups for non-Hanteco suppliers based on productGroups
    if (Array.isArray(enterprise?.productGroups) && enterprise.productGroups.length > 0) {
      const allKws = Array.isArray(enterprise.keywords) ? [...enterprise.keywords] : [];
      return enterprise.productGroups.map((g, gIdx) => {
        const groupName = typeof g === 'string' ? g : (g?.name || `Nhóm sản phẩm ${gIdx + 1}`);
        const groupItems = Array.isArray(g?.items) ? g.items : [];
        const matched = allKws.filter(kw => {
          const kwStr = typeof kw === 'string' ? kw : String(kw || '');
          return kwStr.toLowerCase().includes(groupName.toLowerCase()) || groupName.toLowerCase().includes(kwStr.toLowerCase());
        });
        const groupKws = groupItems.length > 0 ? groupItems : (matched.length > 0 ? matched : allKws.slice(gIdx * 4, (gIdx + 1) * 4));
        return {
          title: groupName,
          keywords: groupKws.length > 0 ? groupKws : [groupName]
        };
      });
    }

    // Chunk enterprise keywords if available
    if (Array.isArray(enterprise?.keywords) && enterprise.keywords.length > 0) {
      const chunks = [];
      const kws = enterprise.keywords;
      const chunkSize = 6;
      for (let i = 0; i < kws.length; i += chunkSize) {
        chunks.push({
          title: `Nhóm năng lực & Sản phẩm ${Math.floor(i / chunkSize) + 1}`,
          keywords: kws.slice(i, i + chunkSize)
        });
      }
      return chunks;
    }

    // Fallback: generate from enterprise name, category, and products
    const mainTitle = enterprise?.category || enterprise?.industry || 'Sản phẩm & Dịch vụ chủ lực';
    const kws = Array.isArray(enterprise?.products) && enterprise.products.length > 0
      ? enterprise.products.slice(0, 8)
      : [mainTitle, `Gia công ${mainTitle}`, `Cung cấp ${mainTitle}`, `Nhà sản xuất ${mainTitle}`];
    return [
      {
        title: mainTitle,
        keywords: kws
      }
    ];
  }, [enterprise]);

  // Crawled Keywords List
  const crawledKeywordsList = useMemo(() => {
    if (enterprise?.keywords && Array.isArray(enterprise.keywords) && enterprise.keywords.length > 0) {
      return enterprise.keywords;
    }
    if (enterprise?.products && Array.isArray(enterprise.products) && enterprise.products.length > 0) {
      return enterprise.products;
    }
    const isHanteco = (enterprise?.name || '').toLowerCase().includes('hanteco');
    if (isHanteco) {
      return [
        "Áo phao bơi", "Phao cứu sinh", "Phao ném", "Áo phao cứu hộ", "Phao chia làn bơi",
        "Máy bơm bể bơi", "Bình lọc cát", "Máy cấp nhiệt bể bơi", "Đèn bể bơi chịu nước",
        "Gạch mosaic gốm", "Gạch mosaic thủy tinh", "Hóa chất PAC", "Hóa chất Chlorine",
        "Máy xông hơi khô", "Máy xông hơi ướt"
      ];
    }
    return [
      enterprise?.category || 'Sản phẩm công nghiệp B2B',
      enterprise?.industry || 'Thiết bị & Phụ trợ',
      'Cung ứng B2B',
      'Gia công sản xuất'
    ];
  }, [enterprise]);

  // Add Supplier to Requirement Workspace
  const handleAddSupplierToRequirement = () => {
    setIsAddedToRequirement(true);
    try {
      if (requirementId) {
        const key = 'ccu_draft_' + requirementId;
        const currentData = privateBrowserStorage.getItem(key);
        let draftObj = currentData ? JSON.parse(currentData) : (activeRequirement || {});
        draftObj.suppliers = draftObj.suppliers || [];
        if (!draftObj.suppliers.find(s => s.id === enterprise.id || s.name === enterprise.name)) {
          draftObj.suppliers.push({
            id: enterprise.id,
            name: enterprise.name,
            address: enterprise.province || enterprise.address || 'Việt Nam',
            distance: 'Đã thêm từ Hồ sơ chi tiết',
            matchRate: 99,
            status: 'CONSIDERING',
            notes: 'Mời trực tiếp từ Hồ sơ năng lực nhà cung ứng xác thực'
          });
          privateBrowserStorage.setItem(key, JSON.stringify(draftObj));
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Open RFQ Modal with pre-filled question from SUPPI
  const handleOpenRfqWithQuestion = (questionText) => {
    setRfqNote(`Xin chào ${enterprise.name}, tôi cần được tư vấn và báo giá cụ thể về vấn đề: "${questionText}". Xin vui lòng phản hồi qua email hoặc số điện thoại của tôi.`);
    setShowRfqModal(true);
  };

  return (
    <div className="space-y-6 pb-28 pt-4 font-sans select-none bg-slate-50/70 min-h-screen text-slate-800 antialiased">
      
      {/* 1. BREADCRUMB BAR */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 font-medium overflow-x-auto py-1.5">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_onlyc.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/nha-cung-ung" className="hover:text-[#0052cc] transition shrink-0 font-medium">Danh bạ nhà cung ứng</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-600 truncate">{enterprise.province || "Toàn quốc"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">{enterprise.name}</span>
        </nav>
      </div>

      {/* 2. MATCHING CONTEXT BANNER (Khi mở từ Requirement Workspace) */}
      {activeRequirement && (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-blue-400/40 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-black font-mono tracking-wider border border-blue-400/30">
                    NGỮ CẢNH NHU CẦU: #{activeRequirement.id}
                  </span>
                  <span className="text-xs text-blue-300 font-medium">
                    Doanh nghiệp này được đề xuất khớp năng lực chuỗi cung ứng
                  </span>
                </div>
                
                <h2 className="text-base sm:text-lg font-black font-heading text-white">
                  Khớp nối năng lực cho gói nhu cầu của bạn
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs text-blue-100">
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Đúng nhóm ngành hàng</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Phục vụ toàn quốc & KCN</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Có hàng sẵn số lượng lớn</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-xl border border-emerald-400/30 text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Đã xác minh MST & Pháp lý</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAddSupplierToRequirement}
                  disabled={isAddedToRequirement}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md font-heading cursor-pointer ${
                    isAddedToRequirement 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {isAddedToRequirement ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã thêm vào Nhu cầu #{activeRequirement.id}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>+ Mời vào Nhu cầu #{activeRequirement.id}</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/tai-khoan/nhu-cau/${activeRequirement.id}`}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Về Workspace</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SECTION 01 — HEADER PROFILE HOÀNH TRÁNG, BỀ THẾ (IMAGE 4 TO & CAO) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-9 shadow-md relative overflow-hidden space-y-6">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
            
            {/* Left: Avatar / Logo + Titles + Thông tin hành chính */}
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 flex-1 min-w-0">
              
              {/* Logo / Thumbnail Box To Rõ Ràng */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-3xl bg-slate-50 p-3 flex items-center justify-center shrink-0 shadow-md border-2 border-slate-200/90 overflow-hidden relative self-start">
                {(enterprise.logo || enterprise.avatar) ? (
                  <img 
                    src={enterprise.logo || enterprise.avatar} 
                    alt={enterprise.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-2xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex flex-col items-center justify-center text-slate-400 select-none"
                  style={{ display: (enterprise.logo || enterprise.avatar) ? 'none' : 'flex' }}
                >
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-400">
                    {getCompanyMonogram(enterprise.name)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 font-medium">Chưa có logo</span>
                </div>
                <span className="absolute bottom-2 right-2 p-1 bg-emerald-500 rounded-full text-white shadow-sm" title="Đã đối soát MST">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </div>

              {/* Company Info Header */}
              <div className="space-y-3.5 flex-1 min-w-0">
                
                {/* Badges Row */}
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5 text-xs sm:text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-[#0052cc] border border-blue-200 font-black rounded-lg uppercase tracking-wider font-heading">
                    {enterprise.category || "An Toàn Sông Nước & Bể Bơi"}
                  </span>

                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ĐỐI TÁC XÁC THỰC CHUỖI CUNG ỨNG</span>
                  </span>

                  {enterprise.taxCode && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-mono font-bold">
                      MST: {enterprise.taxCode}
                    </span>
                  )}
                </div>

                {/* H1 Heading: Tên Doanh Nghiệp In Hoa To & Đậm Nét */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-heading leading-tight tracking-tight uppercase">
                  {enterprise.name}
                </h1>

                {/* Thông Tin Chi Tiết To Rõ Ràng - ĐẦY ĐỦ KHÔNG BỊ CẮT BỚT */}
                <div className="space-y-3 text-sm sm:text-base text-slate-700 pt-1">
                  
                  {/* Trụ sở chính - Dài Full Dòng Rõ Ràng */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-400 mr-2 font-medium">Trụ sở:</span>
                      <strong className="text-slate-900 font-semibold break-words leading-relaxed select-text">
                        {enterprise.address || enterprise.location || "Việt Nam"}
                      </strong>
                    </div>
                  </div>

                  {/* Chi nhánh / Tổng kho / Cơ sở - Hiển thị ĐẦY ĐỦ tất cả địa chỉ không bị cắt */}
                  {(() => {
                    let branchItems = [];
                    if (Array.isArray(enterprise.branches)) {
                      branchItems = enterprise.branches
                        .map(b => (typeof b === 'object' ? (b.address || b.name || '') : String(b)).trim())
                        .filter(Boolean);
                    } else if (typeof enterprise.branches === 'string' && enterprise.branches.trim()) {
                      branchItems = enterprise.branches
                        .split('\n')
                        .map(line => line.replace(/^[✔★►\+\-\s:]+/, '').trim())
                        .filter(Boolean);
                    }
                    if (branchItems.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        {branchItems.map((bText, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2.5">
                            <Factory className="w-5 h-5 text-[#0052cc] shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-slate-400 mr-2 font-medium">
                                {bIdx === 0 ? "Chi nhánh / Kho:" : "Cơ sở / Kho khác:"}
                              </span>
                              <strong className="text-slate-900 font-semibold break-words leading-relaxed select-text">
                                {bText}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Hàng Hotline & Website / Email - Trải Rộng Không Bị Cắt */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-2.5 gap-x-6 pt-1 flex-wrap">
                    
                    {/* Hotline / Điện thoại */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-400 mr-1 font-medium">Hotline:</span>
                      <span className="inline-flex items-center gap-3 flex-wrap">
                        {(() => {
                          const phones = (Array.isArray(enterprise.phones) && enterprise.phones.length > 0)
                            ? enterprise.phones
                            : (enterprise.phone ? [enterprise.phone] : []);
                          if (phones.length === 0) {
                            return <span className="text-slate-500 font-medium">Đang cập nhật</span>;
                          }
                          return phones.map((p, idx) => (
                            <a 
                              key={idx} 
                              href={`tel:${p.replace(/\s+/g, '')}`} 
                              className="text-[#0052cc] font-bold hover:underline font-mono text-base whitespace-nowrap select-text"
                            >
                              {p}
                            </a>
                          ));
                        })()}
                      </span>
                    </div>

                    {/* Email & Website - Hiển thị ĐẦY ĐỦ không có dấu "..." */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {(() => {
                        const websites = (Array.isArray(enterprise.websites) && enterprise.websites.length > 0)
                          ? enterprise.websites
                          : (enterprise.website ? [enterprise.website] : []);
                        if (websites.length === 0) return null;
                        return (
                          <div className="inline-flex items-center gap-3 flex-wrap">
                            {websites.map((ws, idx) => {
                              const cleanUrl = ws.startsWith('http') ? ws : `https://${ws}`;
                              const displayUrl = ws.replace(/^https?:\/\//, '').replace(/\/$/, '');
                              return (
                                <div key={idx} className="flex items-center gap-1.5">
                                  <Globe className="w-5 h-5 text-indigo-600 shrink-0" />
                                  <a 
                                    href={cleanUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[#0052cc] font-bold hover:underline inline-flex items-center gap-1 break-all select-text"
                                  >
                                    <span>{displayUrl}</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {((Array.isArray(enterprise.websites) && enterprise.websites.length > 0) || enterprise.website) && 
                       ((Array.isArray(enterprise.emails) && enterprise.emails.length > 0) || enterprise.email) && (
                        <span className="text-slate-300 hidden sm:inline">·</span>
                      )}

                      {(() => {
                        const emails = (Array.isArray(enterprise.emails) && enterprise.emails.length > 0)
                          ? enterprise.emails
                          : (enterprise.email ? [enterprise.email] : []);
                        if (emails.length === 0) return null;
                        return (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                            <div className="inline-flex items-center gap-2 flex-wrap">
                              {emails.map((em, idx) => (
                                <a 
                                  key={idx}
                                  href={`mailto:${em}`} 
                                  className="text-slate-800 hover:text-[#0052cc] font-medium break-all select-text"
                                >
                                  {em}{idx < emails.length - 1 ? ',' : ''}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Right: Primary CTAs & Quick Actions To Bề Thế */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-64 shrink-0 pt-2 lg:pt-0">
              
              {/* Primary Action Button: Gửi yêu cầu / Báo giá */}
              <button
                onClick={() => {
                  setRfqNote(`Tôi quan tâm đến sản phẩm của ${enterprise.name}. Xin vui lòng gửi báo giá và danh mục mẫu.`);
                  setShowRfqModal(true);
                }}
                className="w-full py-4 bg-[#006837] hover:bg-[#00522c] text-white font-black text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center space-x-2 transition font-heading cursor-pointer uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>YÊU CẦU BÁO GIÁ (RFQ)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Save Supplier Button */}
                <button
                  onClick={handleToggleSave}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer border ${
                    isSaved 
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isSaved ? 'Đã lưu' : 'Lưu hồ sơ'}</span>
                </button>

                {/* Share Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="py-3 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer"
                >
                  {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-600" />}
                  <span>{copiedLink ? 'Đã chép' : 'Chia sẻ'}</span>
                </button>
              </div>

              {/* Hotline Quick Call */}
              {(() => {
                const phone = enterprise.phone || (Array.isArray(enterprise.phones) ? enterprise.phones[0] : null);
                if (!phone) return null;
                return (
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="w-full py-3 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-bold transition flex items-center justify-center space-x-2 font-heading"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Hotline: {phone}</span>
                  </a>
                );
              })()}

            </div>

          </div>

          {/* Quick Structured Metrics Strip - Thông tin doanh nghiệp To & Cao Hơn */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-500 block text-xs sm:text-sm font-medium">Năm thành lập</span>
              <strong className="text-slate-900 font-mono text-base sm:text-lg font-black">
                {enterprise.establishedYear 
                  ? `${enterprise.establishedYear} (${Math.max(1, new Date().getFullYear() - Number(enterprise.establishedYear))}+ năm)`
                  : "Đang cập nhật"}
              </strong>
            </div>
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-500 block text-xs sm:text-sm font-medium">Quy mô lao động</span>
              <strong className="text-slate-900 font-semibold text-base sm:text-lg">
                {enterprise.employees || "Quy mô tiêu chuẩn"}
              </strong>
            </div>
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-500 block text-xs sm:text-sm font-medium">Loại hình doanh nghiệp</span>
              <strong className="text-slate-900 font-semibold text-base sm:text-lg break-words block">
                {enterprise.businessType || "Sản xuất, Thương mại B2B"}
              </strong>
            </div>
            <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-slate-500 block text-xs sm:text-sm font-medium">Thị trường chính</span>
              <strong className="text-emerald-700 font-black text-base sm:text-lg break-words block">
                {enterprise.mainMarkets || "Toàn quốc"}
              </strong>
            </div>
          </div>

        </div>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: 8 COLS (STRUCTURED CONTENT, PHASES, SUPPI, GALLERY, KEYWORDS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1: THÔNG TIN DOANH NGHIỆP & NĂNG LỰC SẢN XUẤT (CHUẨN IMAGE 1) */}
          <section className="space-y-4">
            {/* 1. Narrative Description: 3 Paragraphs completely rewritten from crawled data */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
              {profile.paragraphs.map((para, idx) => (
                <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* 2. Production Highlights: Two Green Outline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-300/80 bg-white p-5 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base">
                  <Factory className="w-5 h-5 text-[#006837] shrink-0" />
                  <span>Quy mô phân xưởng & kho bãi</span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {profile.factoryArea}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-300/80 bg-white p-5 space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm sm:text-base">
                  <Cpu className="w-5 h-5 text-[#006837] shrink-0" />
                  <span>Sản lượng & Năng lực cung ứng</span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {profile.monthlyOutput}
                </p>
              </div>
            </div>

            {/* 3. Target Customers & Official Brand Representation */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4">
                <span className="text-slate-500 font-bold shrink-0 sm:w-60">Khách hàng mục tiêu:</span>
                <span className="text-slate-900 font-bold flex-1 sm:text-right leading-relaxed">
                  {profile.mainCustomers}
                </span>
              </div>
              {profile.brands && (
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-4 pt-3 border-t border-slate-200/70">
                  <span className="text-slate-500 font-bold shrink-0 sm:w-60">Đại lý chính thức các thương hiệu:</span>
                  <span className="text-[#006837] font-bold flex-1 sm:text-right leading-relaxed">
                    {profile.brands}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 2: NGÀNH NGHỀ KINH DOANH & PHÂN ĐỊNH PHA CHUỖI CUNG ỨNG (GỌN GÀNG THEO YÊU CẦU) */}
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                <div>
                  <h2 className="text-base sm:text-xl font-black text-slate-950 font-heading uppercase tracking-wide">
                    Ngành Nghề Kinh Doanh & Pha Chuỗi Cung Ứng
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Phân định theo 18 Pha trong Chuỗi Cung Ứng (1.1 - 6.3)
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-mono font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full">
                {categoriesWithPhases.length} Ngành nghề
              </span>
            </div>

            {/* Compact Rows List */}
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
              {categoriesWithPhases.map((cat, idx) => (
                <div 
                  key={cat.id || idx} 
                  className="p-3.5 sm:px-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-sm"
                >
                  {/* Left: STT + Tên ngành nghề */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base break-words">
                      {cat.name}
                    </span>
                  </div>

                  {/* Right: Badge Pha CCU + Giai đoạn + Link */}
                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pl-9 sm:pl-0">
                    <span className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold font-mono tracking-wider border ${cat.badgeColor || 'bg-blue-100 text-blue-900 border-blue-300'}`}>
                      Pha {cat.phase}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hidden md:inline-block">
                      {cat.stageName}
                    </span>
                    <Link
                      to={`/nganh-nghe/${slugify(cat.name)}`}
                      className="text-[#0052cc] hover:text-blue-800 font-bold inline-flex items-center gap-1 text-xs sm:text-sm hover:underline shrink-0"
                      title="Xem danh mục ngành nghề"
                    >
                      <span>Xem NCC</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3: DANH MỤC TỪ KHÓA (CHIA THEO TỪNG NHÓM - TONE XANH LÁ WEB CHUẨN CCU) */}
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-[#006837] rounded-full" />
                <div>
                  <h2 className="text-base sm:text-xl font-black text-slate-950 font-heading uppercase tracking-wide">
                    Danh Mục Từ Khóa & Sản Phẩm Dịch Vụ
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Phân loại chi tiết theo từng nhóm ngành hàng sản xuất và cung ứng B2B
                  </p>
                </div>
              </div>
            </div>

            {/* Các nhóm từ khóa hiển thị tone xanh lá chuẩn CCU - Không có dấu tick, mỗi từ khóa có border xanh lá */}
            <div className="space-y-6">
              {groupedKeywords.map((group, gIdx) => (
                <div key={gIdx} className="space-y-3 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                  {/* Nhóm tiêu đề có vạch đứng màu xanh lá CCU */}
                  <div className="flex items-center gap-2.5 border-l-4 border-[#006837] pl-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      {group.title}
                    </h3>
                  </div>

                  {/* Lưới từ khóa có border màu xanh lá, bỏ dấu tick */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {group.keywords.map((kw, kIdx) => (
                      <Link
                        key={kIdx}
                        to={`/tu-khoa/${slugify(kw)}`}
                        className="flex items-center px-3.5 py-2.5 rounded-xl border border-emerald-600/80 bg-white hover:bg-emerald-50/70 text-emerald-950 hover:text-[#006837] font-semibold text-xs sm:text-sm transition-all duration-150 shadow-2xs group"
                      >
                        <span className="break-words group-hover:translate-x-0.5 transition-transform">{kw}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: THƯ VIỆN HÌNH ẢNH SẢN PHẨM & DỰ ÁN THỰC TẾ (PHÂN NHÓM DANH MỤC CHUẨN CCU) */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-[#0052cc] rounded-full" />
                <div>
                  <h2 className="text-base sm:text-xl font-black text-slate-950 font-heading uppercase tracking-wide">
                    Thư Viện Hình Ảnh Sản Phẩm & Dự Án Thực Tế
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hình ảnh chụp thực tế sản phẩm, xưởng sản xuất và kho bãi phân theo từng danh mục chuyên ngành
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Category Filter Tabs / Nhảy nhanh */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {galleryTabs.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedGalleryTab(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    selectedGalleryTab === cat.id
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedGalleryTab === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Các khối danh mục ảnh phân chia bên dưới hoặc trạng thái chưa có ảnh */}
            {allCrawledImages.length === 0 ? (
              <div className="py-12 px-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-2">
                <ImageOff className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">Doanh nghiệp chưa cập nhật hình ảnh sản phẩm</p>
                <p className="text-xs text-slate-400">Hình ảnh sản phẩm thực tế sẽ hiển thị tại đây khi doanh nghiệp cập nhật hồ sơ.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {(selectedGalleryTab === 'all' 
                  ? groupedGalleryImages 
                  : groupedGalleryImages.filter(g => g.id === selectedGalleryTab)
                ).map((group) => (
                <div key={group.id} className="space-y-3.5 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                  {/* Nhóm tiêu đề có vạch đứng tone xanh web chuẩn CCU (bỏ text số ảnh) */}
                  <div className="flex items-center gap-2.5 border-l-4 border-[#0052cc] pl-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      {group.title}
                    </h3>
                  </div>

                  {/* Lưới ảnh 5 cột */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {group.items.map((imgItem) => (
                      <div
                        key={imgItem.index}
                        onClick={() => setLightboxIndex(imgItem.index)}
                        className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-[#0052cc] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                      >
                        <div className="h-32 sm:h-36 overflow-hidden bg-slate-50 relative p-1.5 flex items-center justify-center">
                          <img
                            src={imgItem.url}
                            alt={imgItem.caption}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/logo_onlyc.png";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="p-1.5 bg-white/90 rounded-full text-slate-900 shadow-md">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 border-t border-slate-100 bg-white text-center">
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-[#0052cc]">
                            {imgItem.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Gallery footer note */}
            <div className="pt-2 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-mono border-t border-slate-100">
              <span>Hình ảnh sản phẩm & dự án thực tế phân theo từng danh mục chuyên ngành</span>
              <span className="text-[#0052cc] font-bold">Bấm vào ảnh để phóng to Lightbox</span>
            </div>
          </section>

          {/* SECTION 5: FINAL BANNER KẾT NỐI - TONE XANH CHỦ ĐẠO WEBSITE CCU */}
          <section className="rounded-3xl bg-gradient-to-br from-[#002855] via-[#003875] to-[#0052cc] text-white p-8 sm:p-11 shadow-xl space-y-4 text-center border border-blue-400/20">
            <span className="px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider inline-block">
              KẾT NỐI BẢO CHỨNG · KHÔNG SPAM
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading uppercase leading-tight">
              GỬI YÊU CẦU BÁO GIÁ CHO {enterprise.name}
            </h2>

            <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Trợ lý SUPPI & Hệ thống Chuỗi Cung Ứng hỗ trợ chuẩn hóa yêu cầu, làm rõ tiêu chí kỹ thuật và kết nối báo giá trực tiếp trong 24 giờ.
            </p>

            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setRfqNote(`Tôi quan tâm đến sản phẩm của ${enterprise.name}. Xin vui lòng gửi báo giá và danh mục mẫu.`);
                  setShowRfqModal(true);
                }}
                className="px-7 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition font-heading cursor-pointer uppercase tracking-wider"
              >
                GỬI YÊU CẦU BÁO GIÁ NGAY (RFQ)
              </button>

              {(() => {
                const phone = enterprise.phone || (Array.isArray(enterprise.phones) ? enterprise.phones[0] : null);
                if (!phone) return null;
                return (
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-2xl transition font-heading flex items-center gap-2 border border-white/20"
                  >
                    <Phone className="w-4 h-4 text-amber-300" />
                    <span>GỌI HOTLINE: {phone}</span>
                  </a>
                );
              })()}
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 4 COLS (IMAGE 2 CHUẨN LIÊN HỆ NCC + SUPPI/CHAINY KHÔNG CROP)*/}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20 self-start max-h-[calc(100vh-85px)] overflow-y-auto no-scrollbar">
          
          {/* CARD 1: ĐẠI DIỆN CUNG ỨNG B2B & KẾT NỐI DOANH NGHIỆP (PHONG CÁCH CHUỖI CUNG ỨNG CHUYÊN NGHIỆP) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header Tone Xanh Lá Chuỗi Cung Ứng */}
            <div className="bg-gradient-to-r from-[#004d28] via-[#006837] to-[#047857] px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-white font-heading block">
                    ĐẠI DIỆN CUNG ỨNG B2B
                  </span>
                  <span className="text-[10px] text-emerald-100 font-medium block">
                    Kênh liên hệ & xác thực chính thức
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs border border-white/30">
                CCU Verified
              </span>
            </div>

            {/* Company Info Row */}
            <div className="p-4 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
              <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs">
                {(enterprise.logo || enterprise.avatar) ? (
                  <img
                    src={enterprise.logo || enterprise.avatar}
                    alt={enterprise.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-slate-400 select-none"
                  style={{ display: (enterprise.logo || enterprise.avatar) ? 'none' : 'flex' }}
                >
                  <span className="text-xs font-black font-mono text-slate-400">
                    {getCompanyMonogram(enterprise.name)}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug font-heading line-clamp-2">
                  {enterprise.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Đối tác cung ứng đã xác minh</span>
                </div>
              </div>
            </div>

            {/* Section: ĐẦU MỐI LIÊN HỆ THEO VÙNG MIỀN */}
            <div className="p-4 space-y-3 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 font-heading">
                  <Headphones className="w-3.5 h-3.5 text-[#006837]" />
                  <span>HOTLINE TƯ VẤN & BÁO GIÁ</span>
                </span>
                <span className="text-[10.5px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Hỗ trợ trực tiếp
                </span>
              </div>

              {/* Primary Contact / Trụ sở chính */}
              {(() => {
                const primaryPhone = (Array.isArray(enterprise.phones) && enterprise.phones[0]) || enterprise.phone;
                const primaryEmail = (Array.isArray(enterprise.emails) && enterprise.emails[0]) || enterprise.email;
                const cleanPhone = primaryPhone ? primaryPhone.replace(/\D/g, '') : '';
                return (
                  <div className="p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        {enterprise.province ? `Khu Vực ${enterprise.province}` : 'Trụ sở chính'}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-500">
                        {enterprise.province || 'Việt Nam'}
                      </span>
                    </div>

                    {/* Địa chỉ trụ sở đầy đủ */}
                    {enterprise.address && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-700 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="break-words leading-relaxed select-text font-medium">
                          {enterprise.address}
                        </span>
                      </div>
                    )}
                    
                    {primaryPhone ? (
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-slate-950 font-bold font-mono text-sm sm:text-base">
                          <Smartphone className="w-4 h-4 text-[#006837]" />
                          <a href={`tel:${cleanPhone}`} className="hover:text-[#006837] select-text">{primaryPhone}</a>
                        </div>
                        <a
                          href={`https://zalo.me/${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006837] hover:bg-[#004d28] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Chat Zalo</span>
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Hotline: Đang cập nhật</p>
                    )}

                    {primaryEmail && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${primaryEmail}`} className="hover:text-[#006837] break-all select-text">
                          {primaryEmail}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Secondary Contact or Branch if available */}
              {(() => {
                const secondPhone = Array.isArray(enterprise.phones) && enterprise.phones.length > 1 ? enterprise.phones[1] : null;
                const secondEmail = Array.isArray(enterprise.emails) && enterprise.emails.length > 1 ? enterprise.emails[1] : null;
                
                let branchItems = [];
                if (Array.isArray(enterprise.branches)) {
                  branchItems = enterprise.branches
                    .map(b => (typeof b === 'object' ? (b.address || b.name || '') : String(b)).trim())
                    .filter(Boolean);
                } else if (typeof enterprise.branches === 'string' && enterprise.branches.trim()) {
                  branchItems = enterprise.branches
                    .split('\n')
                    .map(line => line.replace(/^[✔★►\+\-\s:]+/, '').trim())
                    .filter(Boolean);
                }

                if (!secondPhone && branchItems.length === 0) return null;

                const cleanSecondPhone = secondPhone ? secondPhone.replace(/\D/g, '') : '';
                return (
                  <div className="p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 transition space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block shrink-0" />
                        <span>Chi nhánh & Kho vận</span>
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-500 shrink-0">Hỗ trợ dự án</span>
                    </div>

                    {/* Danh sách địa chỉ chi nhánh đầy đủ */}
                    {branchItems.length > 0 && (
                      <div className="space-y-1.5 pt-0.5">
                        {branchItems.map((bText, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <Factory className="w-3.5 h-3.5 text-[#0052cc] shrink-0 mt-0.5" />
                            <span className="break-words leading-relaxed select-text font-medium">
                              {bText}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {secondPhone && (
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-200/50">
                        <div className="flex items-center gap-1.5 text-slate-950 font-bold font-mono text-sm sm:text-base">
                          <Smartphone className="w-4 h-4 text-[#006837]" />
                          <a href={`tel:${cleanSecondPhone}`} className="hover:text-[#006837] select-text">{secondPhone}</a>
                        </div>
                        <a
                          href={`https://zalo.me/${cleanSecondPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006837] hover:bg-[#004d28] text-white rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Chat Zalo</span>
                        </a>
                      </div>
                    )}

                    {secondEmail && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${secondEmail}`} className="hover:text-[#006837] break-all select-text">
                          {secondEmail}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Section: HỒ SƠ PHÁP LÝ & NĂNG LỰC DOANH NGHIỆP */}
            <div className="p-4 space-y-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-heading">
                <FileCheck className="w-3.5 h-3.5 text-[#006837]" />
                <span>HỒ SƠ PHÁP LÝ & VẬN HÀNH</span>
              </div>

              <div className="space-y-2 text-xs sm:text-[13px] bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Mã số thuế:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-950 font-mono font-bold select-text">
                      {enterprise.taxCode || "Đang cập nhật"}
                    </strong>
                    {enterprise.taxCode && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(enterprise.taxCode);
                          setCopiedTax(true);
                          setTimeout(() => setCopiedTax(false), 2000);
                        }}
                        title="Sao chép MST"
                        className="p-1 text-slate-400 hover:text-emerald-700 rounded transition"
                      >
                        {copiedTax ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                  <span className="text-slate-500 font-medium">Năm thành lập:</span>
                  <strong className="text-slate-950 font-bold font-mono">
                    {enterprise.establishedYear 
                      ? `${enterprise.establishedYear} (${Math.max(1, new Date().getFullYear() - Number(enterprise.establishedYear))}+ năm)`
                      : "Đang cập nhật"}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
                  <span className="text-slate-500 font-medium">Mô hình:</span>
                  <strong className="text-slate-950 font-bold break-words">
                    {enterprise.businessType || "Sản xuất, Thương mại B2B"}
                  </strong>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-200/50">
                  <span className="text-slate-500 font-medium shrink-0">Địa chỉ trụ sở:</span>
                  <span className="text-slate-900 font-semibold flex items-start gap-1 break-words text-right">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="break-words leading-relaxed select-text">{enterprise.address || (enterprise.province ? `${enterprise.province}, Việt Nam` : "Việt Nam")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRfqModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#006837] to-[#047857] hover:from-[#004d28] hover:to-[#006837] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Báo Giá (RFQ)</span>
              </button>
            </div>
          </div>

          {/* CARD 2: HỎI NHANH TRỢ LÝ SUPPI & CHAINY (SIÊU GỌN GÀNG, KHÔNG BỊ CROP) */}
          <div className="bg-[#0b1329] text-white rounded-2xl p-3 sm:p-3.5 border border-indigo-500/30 shadow-md space-y-2">
            <div className="flex items-center justify-between border-b border-indigo-800/50 pb-2">
              <div className="flex items-center gap-2">
                {/* Avatar SUPPI & CHAINY */}
                <div className="flex items-center -space-x-1.5 shrink-0">
                  <img 
                    src="/mascots/type_suppi.png" 
                    alt="SUPPI" 
                    className="w-6 h-6 rounded-full border border-indigo-900 bg-white object-contain p-0.5 shadow-xs" 
                    onError={(e) => { e.currentTarget.src = '/type_suppi.png'; }}
                  />
                  <img 
                    src="/mascots/type_chainy.png" 
                    alt="CHAINY" 
                    className="w-6 h-6 rounded-full border border-indigo-900 bg-white object-contain p-0.5 shadow-xs" 
                    onError={(e) => { e.currentTarget.src = '/type_chainy.png'; }}
                  />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 font-heading">
                  HỎI NHANH TRỢ LÝ SUPPI & CHAINY
                </h3>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-tight">
              Bấm vào câu hỏi để nhận tư vấn và hướng dẫn chuẩn B2B:
            </p>

            <div className="space-y-1.5">
              {(showAllSuppiQuestions ? suppiChainyQuestions : suppiChainyQuestions.slice(0, 3)).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenRfqWithQuestion(item.label)}
                  className="w-full text-left py-2 px-2.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition cursor-pointer flex items-center justify-between gap-1.5"
                >
                  <span className="line-clamp-1">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>

            {suppiChainyQuestions.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllSuppiQuestions(!showAllSuppiQuestions)}
                className="w-full text-center py-1 text-xs font-semibold text-indigo-300 hover:text-white transition cursor-pointer"
              >
                {showAllSuppiQuestions ? 'Thu gọn' : `+${suppiChainyQuestions.length - 3} Xem thêm câu hỏi`}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 5. STICKY MOBILE BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black text-slate-900 truncate font-heading">{enterprise.name}</div>
          <div className="text-[10px] text-emerald-600 font-bold truncate">🟢 Đã xác thực Chuỗi Cung Ứng</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(() => {
            const phone = enterprise.phone || (Array.isArray(enterprise.phones) ? enterprise.phones[0] : null);
            if (!phone) return null;
            return (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold"
                title={`Gọi ${phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            );
          })()}

          <button
            onClick={() => {
              setRfqNote(`Tôi quan tâm đến sản phẩm của ${enterprise.name}. Xin vui lòng gửi báo giá.`);
              setShowRfqModal(true);
            }}
            className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold font-heading shadow-md uppercase tracking-wider"
          >
            BÁO GIÁ RFQ
          </button>
        </div>
      </div>

      {/* 6. LIGHTBOX MODAL (XEM TOÀN BỘ ẢNH CHẤT LƯỢNG CAO) */}
      {lightboxIndex >= 0 && (
        <div 
          onClick={() => setLightboxIndex(-1)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          {/* Top Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 px-2"
          >
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-mono font-bold">
                {lightboxIndex + 1} / {allCrawledImages.length}
              </span>
              <span className="text-xs text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
                {allCrawledImages[lightboxIndex]?.caption}
              </span>
            </div>

            <button 
              onClick={() => setLightboxIndex(-1)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Frame with Navigation */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/10"
          >
            <img 
              src={allCrawledImages[lightboxIndex]?.url} 
              alt={allCrawledImages[lightboxIndex]?.caption} 
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />

            {/* Prev Button */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + allCrawledImages.length) % allCrawledImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % allCrawledImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption underneath */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl text-center pt-3 text-xs sm:text-sm text-slate-200 font-medium"
          >
            {allCrawledImages[lightboxIndex]?.caption}
          </div>
        </div>
      )}

      {/* 7. RFQ MODAL INTEGRATION */}
      <SupplierRequestQuoteModal
        supplier={enterprise}
        isOpen={showRfqModal}
        initialNote={rfqNote}
        onClose={() => {
          setShowRfqModal(false);
          setRfqNote('');
        }}
      />

    </div>
  );
}
