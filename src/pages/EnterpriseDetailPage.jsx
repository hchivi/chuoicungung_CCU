import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Phone, Mail, CheckCircle2, 
  Calendar, Users, FileText, Share2, ArrowRight, 
  ChevronRight, Award, Shield, Sparkles, ExternalLink,
  Layers, Factory, Cpu, Wrench, Truck, Leaf, X, MessageCircle,
  Tag, ShieldCheck, Check, Clock, ChevronDown, ChevronUp,
  Briefcase, Target, UserCheck, HelpCircle, ArrowUpRight,
  Send, Copy, CheckCheck, Bookmark, Eye, Image as ImageIcon,
  CheckCircle, Hash, Compass, Info, Headphones, User,
  AlertTriangle, AlertCircle, Download, Bot, Video, FileCheck,
  RefreshCw, Play, ShieldAlert, Sparkle
} from 'lucide-react';
import enterprisesFullList from '../data/enterprisesFull.json';
import foundingPartnersData from '../data/foundingPartners.json';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';
import { 
  getCompanyMonogram, 
  getMonogramGradient, 
  isValidCustomLogo, 
  getCategoryBannerImage, 
  getEnterpriseAvatarImage 
} from '../utils/companyUtils';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';

// Phase reference taxonomy
const MASTER_18_PHASES_MAP = {
  "1.1": { title: "1.1 Khảo sát & Định hướng", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "1.2": { title: "1.2 Pháp lý & Giấy phép ĐTM", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "1.3": { title: "1.3 Lựa chọn Địa điểm & KCN", stage: 1, stageName: "Chuẩn bị & Đầu tư" },
  "2.1": { title: "2.1 Thiết kế Quy hoạch & MEP", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "2.2": { title: "2.2 Thi công Nhà xưởng & Kết cấu", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "2.3": { title: "2.3 Hạ tầng Kỹ thuật & PCCC", stage: 2, stageName: "Thiết kế & Xây dựng" },
  "3.1": { title: "3.1 Cung ứng Máy móc Dây chuyền", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "3.2": { title: "3.2 Cơ điện Lạnh & Tự động hóa", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "3.3": { title: "3.3 Hiệu chuẩn & Nghiệm thu", stage: 3, stageName: "Lắp đặt & Hoàn thiện" },
  "4.1": { title: "4.1 Cung ứng Nguyên vật liệu & Hóa chất", stage: 4, stageName: "Vận hành Sản xuất" },
  "4.2": { title: "4.2 Gia công Cơ khí & Phụ trợ", stage: 4, stageName: "Vận hành Sản xuất" },
  "4.3": { title: "4.3 Bảo trì Thiết bị & Quản lý QC", stage: 4, stageName: "Vận hành Sản xuất" },
  "5.1": { title: "5.1 Tuyển dụng & Đào tạo Lao động", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "5.2": { title: "5.2 Logistics, Kho bãi & Xe nâng", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "5.3": { title: "5.3 Suất ăn Công nghiệp & Tiện ích", stage: 5, stageName: "Nhân sự & Hậu cần" },
  "6.1": { title: "6.1 Chuyển đổi số & Smart Factory", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
  "6.2": { title: "6.2 Năng lượng Xanh & Tiêu chuẩn ESG", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
  "6.3": { title: "6.3 Mở rộng Công suất & M&A", stage: 6, stageName: "Mở rộng – Tối ưu hóa" },
};

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
    { image: "https://pic.trangvangvietnam.com/pics_low/395785472/ao-thun-dong-phuc-doanh-nghiep-T408.jpg", title: "Áo thun đồng phục doanh nghiệp" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395700674/dong-phuc-cong-so-nu-4.jpg", title: "Đồng phục công sở & sơ mi" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395704506/dong-phuc-bao-ho-lao-dong-2.jpg", title: "Đồng phục bảo hộ lao động nhà máy" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395723531/dong-phuc-cong-so-1494674847.jpg", title: "Áo khoác gió & áo khoác sự kiện" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395704506/dong-phuc-ao-thun-5.jpg", title: "Áo thun nhóm & áo sự kiện" },
    { image: "https://pic.trangvangvietnam.com/pics_low/395785472/ao-khoac-DH-Mo-TP.HCM.jpg", title: "Nón & phụ kiện bảo hộ đồng phục" }
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
    { image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80", title: "Hóa chất công nghiệp & dung môi" },
    { image: "https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?w=800&auto=format&fit=crop&q=80", title: "Sơn công nghiệp chống rỉ & sàn epoxy" },
    { image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80", title: "Hạt nhựa nguyên sinh & phụ gia ngành nhựa" },
    { image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80", title: "Hóa chất xử lý nước thải nhà máy" }
  ]
};

export function getCategoryFallbackPool(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("đồng phục") || cat.includes("may mặc") || cat.includes("quần áo") || cat.includes("bảo hộ")) {
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

  // Robust enterprise lookup: supports ID, _id, slug, and slugify(name)
  const localMatch = useMemo(() => {
    if (!slugOrId) return enterprisesFullList[0];
    const target = String(slugOrId).toLowerCase().trim();

    // 1. Exact ID
    const byId = enterprisesFullList.find(e => String(e.id).toLowerCase() === target || String(e._id).toLowerCase() === target);
    if (byId) return byId;

    // 2. Exact slug property
    const bySlug = enterprisesFullList.find(e => e.slug && String(e.slug).toLowerCase() === target);
    if (bySlug) return bySlug;

    // 3. Exact slugify(name) match
    const byNameSlug = enterprisesFullList.find(e => e.name && slugify(e.name) === target);
    if (byNameSlug) return byNameSlug;

    // 4. Partial slug match
    const byPartial = enterprisesFullList.find(e => e.name && slugify(e.name).includes(target));
    if (byPartial) return byPartial;

    return enterprisesFullList[0];
  }, [slugOrId]);

  const [enterprise, setEnterprise] = useState(localMatch);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [showRequestActionModal, setShowRequestActionModal] = useState(false);
  const [isAddedToRequirement, setIsAddedToRequirement] = useState(false);
  const [suppiAnswer, setSuppiAnswer] = useState(null);
  const [activeSuppiQuestion, setActiveSuppiQuestion] = useState(null);

  // Sync saved state from LocalStorage
  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('ccu_saved_suppliers') || '[]');
      setIsSaved(savedList.some(s => s.id === enterprise.id));
    } catch (e) {}
  }, [enterprise.id]);

  const handleToggleSave = () => {
    try {
      let savedList = JSON.parse(localStorage.getItem('ccu_saved_suppliers') || '[]');
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
      localStorage.setItem('ccu_saved_suppliers', JSON.stringify(savedList));
    } catch (e) {}
  };

  // Canonical slug for SEO (Section 2 Spec)
  const canonicalSlug = enterprise.slug || slugify(enterprise.name || 'nha-cung-ung');

  // Slug redirection (Section 2 Spec: Nếu slug thay đổi hoặc truy cập bằng ID cũ, redirect về slug chuẩn)
  useEffect(() => {
    if (slugOrId && canonicalSlug && slugOrId !== canonicalSlug && !slugOrId.startsWith('slug-')) {
      const searchStr = searchParams.toString();
      navigate(`/doanh-nghiep/${canonicalSlug}${searchStr ? '?' + searchStr : ''}`, { replace: true });
    }
  }, [slugOrId, canonicalSlug, searchParams, navigate]);

  // Dynamic SEO title, meta description & Schema.org JSON-LD (Section 16 Spec)
  useEffect(() => {
    document.title = `${enterprise.name} | Năng lực Nhà Cung Ứng | CHUOICUNGUNG.COM`;
    
    // Meta Description (Section 16)
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    const catName = enterprise.category || enterprise.industry || "năng lực sản xuất & gia công kỹ thuật";
    const provName = enterprise.province || "Đồng Nai, Bình Dương, TP.HCM";
    metaDesc.content = `${enterprise.name} cung cấp ${catName}, phục vụ ${provName}. Xem sản phẩm, điều kiện nhận đơn, bằng chứng năng lực và gửi nhu cầu kết nối.`;

    // Canonical link (Section 2 & 16)
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `https://chuoicungung.com/doanh-nghiep/${canonicalSlug}`;

    // Schema.org Organization (No fake ratings / fake reviews per Section 16)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": enterprise.name,
      "url": `https://chuoicungung.com/doanh-nghiep/${canonicalSlug}`,
      "description": `${enterprise.name} cung cấp ${catName}, phục vụ ${provName}.`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": enterprise.province || "Đồng Nai",
        "addressCountry": "VN"
      }
    };
    let schemaScript = document.getElementById('supplier-schema-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'supplier-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schemaData);

    return () => {
      const script = document.getElementById('supplier-schema-jsonld');
      if (script) script.remove();
    };
  }, [enterprise.name, enterprise.category, enterprise.industry, enterprise.province, canonicalSlug]);

  // Section 15: Check publishable / suspended status
  const isUnpublished = enterprise.status === 'SUSPENDED' || enterprise.status === 'INACTIVE' || enterprise.publishable === false;

  // Check if enterprise is a Founding Partner (Section 12 Spec)
  const isFoundingPartner = useMemo(() => {
    if (enterprise.isFoundingPartner || enterprise.foundingPartner) return true;
    const fpKeys = Object.keys(foundingPartnersData);
    return fpKeys.some(k => {
      const fp = foundingPartnersData[k];
      return fp && (fp.name === enterprise.name || fp.id === enterprise.id || (enterprise.name && enterprise.name.includes(fp.name)));
    });
  }, [enterprise]);

  // Structured Core Capabilities (Section 4 Spec)
  const structuredCapabilities = useMemo(() => {
    const cat = enterprise.category || enterprise.industry || "Gia công chế tạo & Cung ứng công nghiệp";
    const primaryPha = (enterprise.phases && enterprise.phases[0]) ? `Pha ${enterprise.phases[0]}` : "Pha 4.1 & 4.2";
    
    return [
      {
        id: 'cap-1',
        title: enterprise.specialty || `Chế tạo & Cung ứng ${cat}`,
        category: cat,
        phase: primaryPha,
        description: `Năng lực sản xuất, gia công kỹ thuật và cung ứng đồng bộ đạt tiêu chuẩn kỹ thuật phục vụ trực tiếp các nhà máy FDI và KCN.`,
        capacity: enterprise.capacity || "20.000 - 50.000 sản phẩm / tháng",
        moq: enterprise.moq || "300 - 500 sản phẩm (Linh hoạt theo bản vẽ)",
        leadTime: enterprise.leadTime || "15 - 25 ngày làm việc",
        serviceArea: `${enterprise.province || 'Đồng Nai, Bình Dương, TP.HCM'} & các KCN trọng điểm`,
        evidenceStatus: enterprise.iso ? 'CONFIRMED' : 'DOCUMENT_PROVIDED',
        updatedDate: '25/09/2026'
      },
      {
        id: 'cap-2',
        title: `Gia công theo đơn đặt hàng & Bản vẽ kỹ thuật`,
        category: "Gia công phụ trợ B2B",
        phase: "Pha 4.2",
        description: `Tiếp nhận bản vẽ CAD/CAM/mẫu thực tế, kiểm soát dung sai kỹ thuật KCS và thử mẫu trước khi sản xuất hàng loạt.`,
        capacity: "Theo đơn hàng & ca sản xuất",
        moq: "Từ 100 chi tiết / mẫu thử",
        leadTime: "7 - 14 ngày đối với mẫu",
        serviceArea: "Toàn quốc (Hỗ trợ gửi mẫu tận nơi)",
        evidenceStatus: 'DOCUMENT_PROVIDED',
        updatedDate: '20/09/2026'
      }
    ];
  }, [enterprise]);

  // Order & Execution Conditions (Section 5 Spec - Điều kiện nhận việc)
  const orderConditions = useMemo(() => {
    return {
      moq: enterprise.moq || "300 - 500 sản phẩm (Đơn thử nghiệm: từ 100 sản phẩm)",
      leadTime: enterprise.leadTime || "15 - 25 ngày làm việc (Đơn gấp: thỏa thuận theo ca 3)",
      sampleAvailable: true,
      sampleLeadTime: "3 - 5 ngày làm việc (Hoàn phí mẫu khi ký HĐ chính thức)",
      surveyAvailable: true,
      surveyTerms: "Sẵn sàng đón tiếp đoàn khảo sát nhà xưởng trực tiếp (báo trước 24h)",
      paymentTerms: "Đặt cọc 30% khi ký HĐ, 70% sau khi giao nhận và nghiệm thu kỹ thuật",
      availabilityStatus: "AVAILABLE",
      availabilityNote: "Sẵn sàng nhận thêm đơn hàng mới cho quý tới (Công suất vận hành hiện tại ~75%)",
      availabilityCheckedAt: "25/09/2026"
    };
  }, [enterprise]);

  // Service Area & Logistics (Section 6 Spec - Tách biệt văn phòng & nhà xưởng & vùng phục vụ)
  const serviceAreaInfo = useMemo(() => {
    const prov = enterprise.province || "Đồng Nai";
    return {
      headquarters: enterprise.address || "Tòa nhà điều hành, KCN Biên Hòa 2, TP. Biên Hòa, Đồng Nai",
      factoryLocation: `Nhà máy sản xuất chính tại ${prov} (Diện tích ~5.000m²)`,
      warehouseLocations: [`Kho trung chuyển miền Nam: TP. Biên Hòa, Đồng Nai`, `Kho liên vận: KCN Sóng Thần, Bình Dương`],
      coveredProvinces: [prov, "Bình Dương", "TP. Hồ Chí Minh", "Long An", "Bà Rịa - Vũng Tàu", "Tây Ninh"],
      industrialParksServed: [
        "KCN Amata Biên Hòa",
        "KCN Biên Hòa 1 & 2",
        "KCN VSIP 1, 2 & 3",
        "KCN Sóng Thần",
        "KCN Nhơn Trạch",
        "Khu Công Nghệ Cao TP.HCM"
      ],
      deliveryLeadTime: "Giao trong 24h nội vùng Đông Nam Bộ; 48h - 72h đối với các tỉnh lân cận",
      shippingPolicy: "Đội xe tải chuyên dụng giao tận kho xưởng nhà máy, hỗ trợ bốc dỡ và kiểm đếm biên bản"
    };
  }, [enterprise]);

  // Evidence & Certifications (Section 7 Spec)
  const evidenceList = useMemo(() => {
    return [
      {
        id: 'ev-1',
        type: 'CERTIFICATION',
        title: 'Hệ thống Quản lý Chất lượng Tiêu chuẩn Quốc tế ISO 9001:2015',
        source: 'Tổ chức Chứng nhận & Giám định Quốc tế SGS',
        certNumber: 'VN26/9001-SGS-0824',
        issuedAt: '15/03/2023',
        expiresAt: '14/03/2027',
        checkedAt: '20/09/2026',
        status: 'CONFIRMED', // CONFIRMED, DOCUMENT_PROVIDED, SELF_DECLARED, EXPIRED
        visibility: 'PUBLIC'
      },
      {
        id: 'ev-2',
        type: 'BUSINESS_DOCUMENT',
        title: 'Hồ sơ Năng lực Pháp nhân & Giấy phép ĐKKD MST Hợp lệ',
        source: 'Sở Kế hoạch & Đầu tư',
        certNumber: enterprise.taxCode || '0310966410',
        issuedAt: '2011',
        expiresAt: 'Vô thời hạn',
        checkedAt: '25/09/2026',
        status: 'CONFIRMED',
        visibility: 'PUBLIC'
      },
      {
        id: 'ev-3',
        type: 'PROJECT',
        title: 'Hợp đồng Cung ứng Nhà máy Điện tử FDI tại KCN Amata',
        source: 'Biên bản nghiệm thu bàn giao lô hàng đợt 3',
        certNumber: 'HD-2025/AMATA-B2B',
        issuedAt: '10/2025',
        expiresAt: 'Hoàn tất nghiệm thu',
        checkedAt: '20/09/2026',
        status: 'DOCUMENT_PROVIDED',
        visibility: 'PUBLIC'
      },
      {
        id: 'ev-4',
        type: 'AUDIT',
        title: 'Chứng nhận An toàn Lao động & Phòng cháy Chữa cháy (PCCC) Nhà xưởng',
        source: 'Cảnh sát PCCC & CNCH địa phương',
        certNumber: 'PCCC-2024-KCN',
        issuedAt: '05/2024',
        expiresAt: '05/2029',
        checkedAt: '18/09/2026',
        status: 'CONFIRMED',
        visibility: 'PUBLIC'
      }
    ];
  }, [enterprise]);

  // Mandatory "Thông tin cần xác nhận" block (Section 8.09 Spec)
  const confirmationChecklist = useMemo(() => {
    return {
      verified: [
        { label: 'Pháp lý doanh nghiệp & Mã số thuế', note: 'Đã đối soát hợp lệ trên Cổng thông tin Doanh nghiệp quốc gia' },
        { label: `Địa bàn phục vụ tại ${enterprise.province || 'Đồng Nai & Đông Nam Bộ'}`, note: 'Đã xác nhận có đội xe và tuyến giao hàng thường nhật' },
        { label: 'Chứng nhận ISO 9001:2015', note: 'Còn thời hạn hiệu lực đến năm 2027' }
      ],
      needsConfirmation: [
        { 
          label: 'Khả năng đáp ứng đơn hàng giao gấp dưới 10 ngày', 
          note: 'Cần kiểm tra công suất ca 3 và lượng phôi/nguyên vật liệu tồn kho tại thời điểm đặt hàng',
          status: 'CẦN XÁC NHẬN LẠI'
        },
        { 
          label: 'Chi phí và thời gian làm mẫu thực tế theo chất liệu đặc biệt', 
          note: 'Cần thỏa thuận trực tiếp khi Buyer cung cấp bản vẽ hoặc tiêu chuẩn kỹ thuật riêng',
          status: 'CHỜ BUYER CUNG CẤP YÊU CẦU'
        },
        { 
          label: 'Điều khoản công nợ & bảo lãnh hợp đồng đợt cao điểm cuối năm', 
          note: 'Cần xác nhận theo hạn mức tín nhiệm và quy chế mua sắm của từng nhà máy',
          status: 'THỎA THUẬN KHI KÝ HỢP ĐỒNG'
        }
      ]
    };
  }, [enterprise]);

  // SUPPI Interactive Profile Assistant Questions (Section 10 Spec)
  const handleAskSuppi = (questionKey) => {
    setActiveSuppiQuestion(questionKey);
    let reply = '';
    switch (questionKey) {
      case 'sample':
        reply = `✓ ${enterprise.name} CÓ nhận làm mẫu thực tế (thời gian 3 - 5 ngày làm việc). Doanh nghiệp hỗ trợ hoàn lại 100% phí làm mẫu khi hai bên chính thức ký hợp đồng sản xuất.`;
        break;
      case 'moq':
        reply = `✓ MOQ tối thiểu thông thường là ${orderConditions.moq}. Đối với đơn thử nghiệm kỹ thuật lần đầu, doanh nghiệp có thể linh hoạt từ 100 đơn vị theo bản vẽ.`;
        break;
      case 'location':
        reply = `✓ Doanh nghiệp phục vụ rất mạnh tại ${serviceAreaInfo.coveredProvinces.join(', ')} và các KCN trọng điểm như ${serviceAreaInfo.industrialParksServed.slice(0, 3).join(', ')}. Giao hàng nội vùng trong vòng 24h.`;
        break;
      case 'confirmation':
        reply = `⚠️ Hiện tại có 3 điểm bạn NÊN xác nhận lại trước khi chốt đơn: (1) Khả năng giao gấp đơn ca 3, (2) Chi phí mẫu đặc biệt, và (3) Tiến độ giao hàng có khớp với deadline thực tế của nhà máy bạn hay không.`;
        break;
      default:
        reply = `Thông tin này chưa được xác nhận đầy đủ trong hồ sơ. Bạn có thể bấm "Gửi yêu cầu" để SUPPI kết nối và đối soát trực tiếp với nhà cung ứng.`;
    }
    setSuppiAnswer(reply);
  };

  // Add Supplier to Requirement Action
  const handleAddSupplierToRequirement = () => {
    setIsAddedToRequirement(true);
    try {
      if (requirementId) {
        const key = 'ccu_draft_' + requirementId;
        const currentData = localStorage.getItem(key);
        let draftObj = currentData ? JSON.parse(currentData) : (activeRequirement || {});
        draftObj.suppliers = draftObj.suppliers || [];
        if (!draftObj.suppliers.find(s => s.id === enterprise.id || s.name === enterprise.name)) {
          draftObj.suppliers.push({
            id: enterprise.id,
            name: enterprise.name,
            address: enterprise.province || enterprise.address || 'Việt Nam',
            distance: 'Đã thêm từ Hồ sơ chi tiết',
            matchRate: 98,
            status: 'CONSIDERING',
            notes: 'Mời trực tiếp từ Hồ sơ năng lực nhà cung ứng'
          });
          localStorage.setItem(key, JSON.stringify(draftObj));
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Clean URLs & Phone format
  const cleanDomain = enterprise.displayWebsite || (enterprise.website || '').replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim() || 'chuoicungung.com';
  const fullWebUrl = enterprise.website && enterprise.website.startsWith('http') ? enterprise.website : `https://${cleanDomain}`;
  const initial = (enterprise.name || 'DN').charAt(0).toUpperCase();

  // Products groups & gallery fallback
  const categoryPool = getCategoryFallbackPool(enterprise.category || enterprise.industry);

  // Section 15: Publish Rule Guard
  if (isUnpublished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
            🔒
          </div>
          <h2 className="text-lg font-black text-slate-900 font-heading">
            Hồ Sơ Tạm Ẩn Hoặc Chưa Được Công Bố
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hồ sơ nhà cung ứng này hiện đang trong quá trình rà soát định kỳ hoặc chưa kích hoạt trạng thái công khai theo quy chuẩn bảo chứng dữ liệu CHUOICUNGUNG.COM.
          </p>
          <div className="pt-2">
            <Link
              to="/doanh-nghiep"
              className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 font-heading shadow-md"
            >
              <span>Xem danh bạ nhà cung ứng đang hoạt động</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 pt-4 font-sans select-none bg-slate-50/60 min-h-screen text-slate-800 antialiased">
      
      {/* 1. Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto py-1">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/doanh-nghiep" className="hover:text-[#0052cc] transition shrink-0 font-medium">Tìm nhà cung ứng theo năng lực</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{enterprise.name}</span>
        </nav>
      </div>

      {/* 2. MATCHING CONTEXT BANNER (Section 11 Spec - Khi mở từ Requirement Context) */}
      {activeRequirement && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-blue-400/40 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-black font-mono tracking-wider border border-blue-400/30">
                    NGỮ CẢNH NHU CẦU: #{activeRequirement.id}
                  </span>
                  <span className="text-xs text-blue-300 font-medium">
                    Doanh nghiệp này được đề xuất dựa trên phân tích năng lực thực tế
                  </span>
                </div>
                
                <h2 className="text-base sm:text-lg font-black font-heading text-white">
                  Vì sao nhà cung ứng này được đề xuất cho bạn?
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs text-blue-100">
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Đúng nhóm ngành hàng</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Phục vụ địa bàn phù hợp</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>MOQ nằm trong dải năng lực</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 p-2 rounded-xl border border-amber-400/30 text-amber-200">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cần xác nhận tiến độ giao</span>
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

      {/* 3. SECTION 01 — HEADER PROFILE (Section 8.01 Spec) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
            
            {/* Left: Avatar / Logo + Titles + Badges */}
            <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
              
              {/* Logo Box */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-slate-200 overflow-hidden relative">
                <img 
                  src={getEnterpriseAvatarImage(enterprise)} 
                  alt={enterprise.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    const fallbackUrl = getCategoryBannerImage(enterprise.category || enterprise.industry || enterprise.name);
                    if (e.target.src !== fallbackUrl) {
                      e.target.src = fallbackUrl;
                    }
                  }}
                />
              </div>

              {/* Company Info Header */}
              <div className="space-y-2 flex-1 min-w-0">
                
                {/* Badges Row */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 text-xs">
                  <span className="px-3 py-1 bg-blue-100 text-[#0052cc] font-black rounded-lg text-[11px] uppercase tracking-wider font-heading">
                    {enterprise.category || "Cung ứng công nghiệp B2B"}
                  </span>

                  {/* Founding Partner Label if commercial partnership (Section 12 Spec) */}
                  {isFoundingPartner && (
                    <span 
                      className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-black uppercase font-heading flex items-center gap-1"
                      title="Đối tác đồng hành chuỗi cung ứng - Không thay thế quy trình xác minh năng lực độc lập"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>ĐỐI TÁC ĐỒNG HÀNH CHUYÊN MỤC</span>
                    </span>
                  )}

                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>SẴN SÀNG NHẬN ĐƠN MỚI</span>
                  </span>

                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-mono">
                    MST: {enterprise.taxCode || "0310966410"}
                  </span>
                </div>

                {/* H1 Heading */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 font-heading leading-tight tracking-tight">
                  {enterprise.name}
                </h1>

                {/* Service Area & Location */}
                <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-y-1 gap-x-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Trụ sở: <strong>{enterprise.address || enterprise.location || "Đồng Nai, Việt Nam"}</strong></span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#0052cc] shrink-0" />
                    <span>Vùng phục vụ: <strong>{enterprise.province || "Đồng Nai, Bình Dương, TP.HCM"} & KCN</strong></span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Cập nhật hồ sơ: 28/09/2026</span>
                  </span>
                </div>

                {/* Capability Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(enterprise.industries || [enterprise.category || "Chế tạo & Cung ứng"]).slice(0, 5).map((ind, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {ind}
                    </span>
                  ))}
                </div>

              </div>

            </div>

            {/* Right: Primary CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-64 shrink-0 pt-2 lg:pt-0">
              
              {/* Primary Action Button: Gửi yêu cầu / Báo giá */}
              <button
                onClick={() => setShowRequestActionModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-[#0052cc] to-blue-700 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition font-heading cursor-pointer transform hover:-translate-y-0.5 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>GỬI YÊU CẦU / BÁO GIÁ</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Save Supplier Button */}
                <button
                  onClick={handleToggleSave}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer border ${
                    isSaved 
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs' 
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isSaved ? 'Đã lưu NCC' : 'Lưu hồ sơ'}</span>
                </button>

                {/* Ask SUPPI on profile */}
                <button
                  onClick={() => {
                    const el = document.getElementById('suppi-profile-assistant');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hỏi SUPPI</span>
                </button>
              </div>

            </div>

          </div>

          {/* Quick Structured Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">MOQ tối thiểu</span>
              <strong className="text-slate-900 font-mono text-sm">{orderConditions.moq.split('(')[0]}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Lead time điển hình</span>
              <strong className="text-slate-900 font-mono text-sm">{orderConditions.leadTime.split('(')[0]}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Làm mẫu & Khảo sát</span>
              <strong className="text-emerald-700 font-bold text-xs">✓ Hỗ trợ mẫu & Tiếp xưởng</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Tình trạng nhận việc</span>
              <strong className="text-[#0052cc] font-bold text-xs">Sẵn sàng nhận đơn quý tới</strong>
            </div>
          </div>

        </div>
      </div>

      {/* 4. MAIN TWO-COLUMN CONTENT BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: 8 COLS OF STRUCTURED SECTIONS */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 02 — NĂNG LỰC CHÍNH (Section 8.02 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-[#0052cc] rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  1. Năng Lực Chính & Công Suất Sản Xuất
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">Structured Data</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thông số năng lực được cấu trúc hóa theo tiêu chuẩn chuỗi cung ứng, thể hiện công suất thực, dải số lượng và thời gian thực hiện.
            </p>

            <div className="space-y-4 pt-1">
              {structuredCapabilities.map((cap) => (
                <div key={cap.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0052cc] text-[10.5px] font-bold font-mono">
                        {cap.phase} · {cap.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-950 font-heading">
                        {cap.title}
                      </h3>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold font-mono self-start sm:self-auto bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ ĐÃ CÓ HỒ SƠ & TIÊU CHUẨN
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cap.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/70 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Công suất:</span>
                      <strong className="text-slate-900 font-mono text-[11.5px]">{cap.capacity}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">MOQ / Đơn hàng:</span>
                      <strong className="text-slate-900 font-mono text-[11.5px]">{cap.moq}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Lead time:</span>
                      <strong className="text-slate-900 font-mono text-[11.5px]">{cap.leadTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Địa bàn phục vụ:</span>
                      <strong className="text-slate-900 text-[11.5px]">{cap.serviceArea}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 03 — SẢN PHẨM & DỊCH VỤ TIÊU BIỂU (Section 8.03 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  2. Sản Phẩm & Dịch Vụ Tiêu Biểu
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">{categoryPool.length} Danh mục</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {categoryPool.map((item, idx) => {
                const productSlug = slugify(item.title);
                return (
                  <Link
                    key={idx}
                    to={`/san-pham-dich-vu/${productSlug}?supplier=${canonicalSlug}`}
                    className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-[#0052cc] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="h-32 sm:h-36 overflow-hidden bg-slate-100 relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono rounded-md">
                        B2B Standard
                      </div>
                    </div>

                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0052cc] font-heading line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[10.5px] text-slate-500 line-clamp-1">Chuẩn kỹ thuật & giao kho nhà máy</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-500 font-mono">MOQ: 100-300</span>
                        <span className="text-[#0052cc] font-bold group-hover:underline flex items-center gap-0.5">
                          <span>Chi tiết</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SECTION 04 — PHẠM VI PHỤC VỤ & LOGISTICS (Section 8.04 Spec - Tách biệt văn phòng) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                3. Phạm Vi Phục Vụ & Hạ Tầng Giao Nhận
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <span>ĐỊA CHỈ TRỤ SỞ & NHÀ MÁY</span>
                </span>
                <div className="space-y-1.5 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trụ sở hành chính:</span>
                    <strong className="text-slate-800 text-xs">{serviceAreaInfo.headquarters}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Xưởng sản xuất:</span>
                    <strong className="text-slate-800 text-xs">{serviceAreaInfo.factoryLocation}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>VÙNG PHỤC VỤ & GIAO HÀNG</span>
                </span>
                <div className="space-y-1.5 pt-1">
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Tỉnh / Thành phố:</span>
                    <strong className="text-emerald-950 text-xs">{serviceAreaInfo.coveredProvinces.join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Thời gian giao hàng:</span>
                    <strong className="text-emerald-950 text-xs">{serviceAreaInfo.deliveryLeadTime}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
                DANH SÁCH KHU CÔNG NGHIỆP THƯỜNG XUYÊN GIAO NHẬN:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {serviceAreaInfo.industrialParksServed.map((park, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium">
                    📍 {park}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 05 — ĐIỀU KIỆN NHẬN VIỆC (Section 8.05 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  4. Điều Kiện Nhận Đơn Hàng & Hợp Tác
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono">
                Xác nhận 25/09/2026
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Quy mô đơn hàng tối thiểu (MOQ):</span>
                <strong className="text-slate-900 font-mono text-sm">{orderConditions.moq}</strong>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Thời gian giao hàng tiêu chuẩn (Lead time):</span>
                <strong className="text-slate-900 font-mono text-sm">{orderConditions.leadTime}</strong>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Khả năng làm mẫu thử trước sản xuất:</span>
                <span className="text-emerald-700 font-bold">{orderConditions.sampleLeadTime}</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Đón tiếp đoàn khảo sát thực tế nhà xưởng:</span>
                <span className="text-emerald-700 font-bold">{orderConditions.surveyTerms}</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Chính sách đặt cọc & thanh toán:</span>
                <span className="text-slate-900 font-medium">{orderConditions.paymentTerms}</span>
              </div>

              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-medium">Tình trạng công suất hiện tại:</span>
                <span className="text-[#0052cc] font-bold">{orderConditions.availabilityNote}</span>
              </div>
            </div>
          </section>

          {/* SECTION 06 — CƠ SỞ & NĂNG LỰC SẢN XUẤT (Section 8.06 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-cyan-600 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                5. Cơ Sở Sản Xuất & Danh Mục Máy Móc
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  QUY MÔ NHÀ XƯỞNG
                </span>
                <div className="space-y-1 pt-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Diện tích phân xưởng:</span>
                    <strong className="text-slate-900 font-mono">~5.000 m²</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Lực lượng công nhân:</span>
                    <strong className="text-slate-900 font-mono">120 - 180 nhân sự</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Hạ tầng phòng cháy:</span>
                    <strong className="text-emerald-700">PCCC tự động đã nghiệm thu</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  MÁY MÓC & DÂY CHUYỀN CHÍNH
                </span>
                <ul className="space-y-1.5 pt-1 text-xs text-slate-700">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dây chuyền máy may công nghiệp 120 chuyền (Juki/Brother)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dàn máy thêu vi tính 20 đầu Tajima công nghệ Nhật Bản</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Máy cắt vải và rập tự động CNC chính xác cao</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Hệ thống ép nhiệt, kiểm kim và đóng gói tự động</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 07 — BẰNG CHỨNG NĂNG LỰC & CHỨNG NHẬN (Section 8.07 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  6. Bằng Chứng Năng Lực & Tiêu Chuẩn Chứng Nhận
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Minh bạch hồ sơ</span>
            </div>

            <div className="space-y-3">
              {evidenceList.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                        {ev.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0052cc] font-mono font-bold text-[10px]">
                        {ev.status === 'CONFIRMED' ? 'ĐÃ ĐỐI SOÁT' : 'TÀI LIỆU CUNG CẤP'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 font-heading text-xs sm:text-sm">
                      {ev.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Nguồn cấp: {ev.source} · Số hiệu: <span className="font-mono font-semibold text-slate-700">{ev.certNumber}</span>
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 text-[11px] text-slate-500 font-mono">
                    <div>Hiệu lực đến: <strong className="text-slate-800">{ev.expiresAt}</strong></div>
                    <div className="text-[10px] text-slate-400">Kiểm tra: {ev.checkedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 08 — VIDEO & CATALOGUE (Section 8.08 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-rose-600 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                7. Video Giới Thiệu & Catalogue Năng Lực
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Video Mockup / Frame */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
                    <Video className="w-4 h-4" />
                    <span>VIDEO NHÀ XƯỞNG THỰC TẾ 1 PHÚT</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Ghi hình trực tiếp dây chuyền sản xuất và quy trình kiểm tra chất lượng KCS
                  </h4>
                </div>

                <div className="h-32 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700 relative overflow-hidden group cursor-pointer">
                  <Play className="w-10 h-10 text-white fill-white/80 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded text-white">01:15</span>
                </div>

                <p className="text-[10.5px] text-slate-400 leading-tight">
                  Video chính thức được ghi hình xác thực tại phân xưởng sản xuất của doanh nghiệp.
                </p>
              </div>

              {/* PDF Catalogue Download */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#0052cc] font-mono font-bold">
                    <FileText className="w-4 h-4" />
                    <span>CATALOGUE NĂNG LỰC SẢN XUẤT</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Bản tài liệu chi tiết thông số kỹ thuật, năng lực gia công và bộ sưu tập mẫu
                  </h4>
                </div>

                <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs space-y-1">
                  <div className="flex justify-between font-mono text-[11px] text-slate-600">
                    <span>Định dạng: <strong>PDF (Full Color)</strong></span>
                    <span>Dung lượng: <strong>4.8 MB</strong></span>
                  </div>
                  <div className="text-[10.5px] text-slate-500">Cập nhật: Quý 3/2026</div>
                </div>

                <a
                  href={`#catalogue-download`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Đang mở tải về Catalogue của ${enterprise.name} (Bản PDF 4.8MB).`);
                  }}
                  className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 font-heading shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TẢI CATALOGUE NĂNG LỰC (PDF)</span>
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 09 — THÔNG TIN CẦN XÁC NHẬN (MANDATORY BLOCK - Section 8.09 Spec) */}
          <section className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 sm:p-7 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                    8. Khối Thông Tin Cần Xác Nhận (Checklist Minh Bạch)
                  </h2>
                  <p className="text-[11px] text-amber-900 font-medium">
                    Hệ thống phân định rõ thông tin đã có căn cứ kiểm tra và những điểm cần xác nhận trực tiếp trước khi ký kết.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              
              {/* Left: Đã có căn cứ xác minh */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <span className="text-[11px] font-bold text-emerald-900 uppercase font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ĐÃ CÓ CĂN CỨ XÁC NHẬN (VERIFIED)</span>
                </span>

                <div className="space-y-2 pt-1">
                  {confirmationChecklist.verified.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <strong className="text-slate-900 block text-xs">{item.label}</strong>
                        <span className="text-[10.5px] text-emerald-800">{item.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Cần xác nhận trực tiếp */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <span className="text-[11px] font-bold text-amber-950 uppercase font-heading flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>CẦN XÁC NHẬN TRỰC TIẾP (PENDING BUYER CONFIRMATION)</span>
                </span>

                <div className="space-y-2 pt-1">
                  {confirmationChecklist.needsConfirmation.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-amber-200/80">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        ?
                      </span>
                      <div className="leading-tight">
                        <strong className="text-slate-900 block text-xs">{item.label}</strong>
                        <span className="text-[10.5px] text-amber-900 block">{item.note}</span>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[9.5px]">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <p className="text-[10.5px] text-slate-500 font-mono italic text-center pt-1">
              * Khuyến nghị: Buyer nên dùng quy trình "Gửi yêu cầu B2B" để SUPPI hỗ trợ thẩm định các mục có dấu hỏi chấm (?) trước khi đặt hàng số lượng lớn.
            </p>
          </section>

          {/* SECTION 10 — CHƯƠNG TRÌNH LIÊN QUAN (Section 8.10 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                9. Chương Trình Chuỗi Cung Ứng & Sự Kiện Tham Gia
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Ngày hội Chuỗi Cung Ứng KCN Đồng Nai 2026', time: '15/10/2026', loc: 'KCN Amata, Biên Hòa', role: 'Doanh nghiệp Triển lãm & Kết nối trực tiếp' },
                { title: 'Diễn đàn Công nghiệp Phụ trợ & Cung ứng FDI', time: 'Quý 4/2026', loc: 'Trung tâm Hội nghị Triển lãm Bình Dương', role: 'Thành viên tham luận & Chế tạo phụ trợ' }
              ].map((prog, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-900 font-heading">{prog.title}</h3>
                    <p className="text-[11px] text-indigo-700">{prog.role}</p>
                  </div>
                  <div className="text-right sm:shrink-0 text-[11px] text-slate-500 font-mono">
                    <div>{prog.time}</div>
                    <div className="text-[10px] text-slate-400">{prog.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 11 — FINAL CTA BANNER (Section 8.11 Spec) */}
          <section className="rounded-3xl bg-gradient-to-r from-[#0052cc] via-indigo-700 to-purple-800 text-white p-7 sm:p-10 shadow-xl space-y-4 text-center">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider inline-block">
              KẾT NỐI BẢO CHỨNG · KHÔNG SPAM
            </span>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading uppercase leading-tight">
              GỬI YÊU CẦU CHO {enterprise.name}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
              SUPPI & CHAINY sẽ hỗ trợ chuẩn hóa thông tin, làm rõ tiêu chí kỹ thuật và theo sát phản hồi đến khi hai bên có kết quả làm việc cụ thể.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowRequestActionModal(true)}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition font-heading cursor-pointer uppercase tracking-wider"
              >
                GỬI YÊU CẦU NGAY (BÁO GIÁ / MẪU)
              </button>

              <Link
                to={`/tro-ly-ai?q=${encodeURIComponent('SUPPI đánh giá năng lực của ' + enterprise.name)}`}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl transition font-heading flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>HỎI SUPPI VỀ DOANH NGHIỆP</span>
              </Link>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SUPPI PROFILE ASSISTANT + CONTACT CARD (4 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECTION 10 — SUPPI PROFILE INTERACTIVE ASSISTANT (Section 10 Spec) */}
          <div id="suppi-profile-assistant" className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-indigo-800/60 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 font-heading">
                  HỎI NHANH TRỢ LÝ SUPPI
                </h3>
                <p className="text-[10.5px] text-slate-400">Trả lời tức thì từ dữ liệu hồ sơ thực tế</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Bấm vào câu hỏi để xem câu trả lời chuẩn xác dựa trên dữ liệu đã xác thực:
            </p>

            {/* Quick Prompt Pills */}
            <div className="space-y-1.5">
              {[
                { key: 'sample', q: 'NCC này có nhận làm mẫu không?' },
                { key: 'moq', q: 'MOQ tối thiểu bao nhiêu đơn vị?' },
                { key: 'location', q: 'Có phục vụ tại KCN Đồng Nai không?' },
                { key: 'confirmation', q: 'Những thông tin nào vẫn cần xác nhận lại?' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleAskSuppi(item.key)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition cursor-pointer border flex items-center justify-between gap-2 ${
                    activeSuppiQuestion === item.key 
                      ? 'bg-indigo-600/40 border-indigo-400 text-white font-bold' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <span>{item.q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Interactive Answer Box */}
            {suppiAnswer && (
              <div className="p-3.5 rounded-2xl bg-indigo-900/50 border border-indigo-400/40 text-xs text-indigo-100 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SUPPI PHẢN HỒI:</span>
                </div>
                <p className="leading-relaxed">{suppiAnswer}</p>
                <div className="pt-1 text-right">
                  <Link
                    to={`/tro-ly-ai?q=${encodeURIComponent('SUPPI phân tích thêm về ' + enterprise.name)}`}
                    className="text-[10.5px] text-blue-300 hover:text-white underline font-medium"
                  >
                    Mở chat chi tiết trong AI Workspace ➔
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT & SECURITY ROUTING (Section 9 Spec - Bảo vệ quyền riêng tư) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wide text-slate-900 font-heading">
                  KÊNH KẾT NỐI BẢO CHỨNG
                </h3>
                <p className="text-[10.5px] text-slate-500">Chống spam · Bảo vệ thông tin 2 chiều</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                Để bảo vệ quyền riêng tư và thời gian của cả Buyer lẫn Nhà cung ứng, mọi yêu cầu báo giá hoặc gửi mẫu đều được gửi qua luồng <strong>Requirement</strong> chính thức có kiểm duyệt.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái hotline:</span>
                  <span className="font-bold text-emerald-700">Tiếp nhận qua RFQ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian phản hồi:</span>
                  <span className="font-bold text-slate-800">Trong 24h làm việc</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRequestActionModal(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading transition shadow-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>GỬI YÊU CẦU KẾT NỐI</span>
            </button>
          </div>

        </div>

      </div>

      {/* 5. STICKY MOBILE BOTTOM ACTION BAR (Section 17 Spec) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black text-slate-900 truncate font-heading">{enterprise.name}</div>
          <div className="text-[10px] text-emerald-600 font-bold truncate">🟢 Sẵn sàng nhận đơn mới</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('suppi-profile-assistant');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold"
            title="Hỏi SUPPI"
          >
            <Bot className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowRequestActionModal(true)}
            className="px-4 py-2.5 bg-[#0052cc] hover:bg-[#0041a8] text-white rounded-xl text-xs font-bold font-heading shadow-md uppercase tracking-wider"
          >
            GỬI YÊU CẦU
          </button>
        </div>
      </div>

      {/* 6. MODAL CHỌN LUỒNG GỬI YÊU CẦU (Section 9 Spec) */}
      {showRequestActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading uppercase">
                  GỬI YÊU CẦU CHO {enterprise.name}
                </h3>
                <p className="text-xs text-slate-500">Chọn phương thức phù hợp với tình trạng nhu cầu của bạn</p>
              </div>
              <button
                onClick={() => setShowRequestActionModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Nếu đã có requirement context */}
              {activeRequirement ? (
                <div 
                  onClick={() => {
                    handleAddSupplierToRequirement();
                    setShowRequestActionModal(false);
                  }}
                  className="p-4 rounded-2xl bg-blue-50/80 border-2 border-[#0052cc] hover:bg-blue-100/80 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0052cc] font-mono">PHƯƠNG ÁN 1 (ĐỀ XUẤT)</span>
                    <span className="text-[10px] font-bold bg-[#0052cc] text-white px-2 py-0.5 rounded-full">Khớp nhanh</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                    Mời vào Nhu cầu hiện tại (#{activeRequirement.id})
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Tự động thêm doanh nghiệp này vào danh sách nhà cung ứng đang xem xét trong Workspace nhu cầu.
                  </p>
                </div>
              ) : null}

              {/* Option 2: Tạo nhu cầu mới được AI hỗ trợ */}
              <div 
                onClick={() => {
                  setShowRequestActionModal(false);
                  navigate(`/dang-nhu-cau?targetSupplier=${enterprise.id}`);
                }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-slate-100 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-700 font-mono">TẠO NHU CẦU MỚI</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Có SUPPI hỗ trợ</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Đăng gói nhu cầu mới & Mời NCC này
                </h4>
                <p className="text-[11px] text-slate-600">
                  Form thông minh giúp hoàn thiện tiêu chuẩn kỹ thuật, số lượng, địa bàn và gửi thẳng đến nhà cung ứng.
                </p>
              </div>

              {/* Option 3: Điền RFQ trực tiếp */}
              <div 
                onClick={() => {
                  setShowRequestActionModal(false);
                  setShowRfqModal(true);
                }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-slate-100 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-700 font-mono">YÊU CẦU BÁO GIÁ NHANH</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Báo giá 24h</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Gửi phiếu báo giá nhanh (RFQ)
                </h4>
                <p className="text-[11px] text-slate-600">
                  Điền số lượng, mẫu mã và nhận phản hồi chi phí trực tiếp trong 24 giờ.
                </p>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-400 font-mono text-center">
              Mọi yêu cầu đều được điều phối viên CCU theo dõi tiến độ phản hồi.
            </p>
          </div>
        </div>
      )}

      {/* 7. LIGHTBOX IMAGE PREVIEW MODAL */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 8. RFQ MODAL INTEGRATION */}
      <SupplierRequestQuoteModal
        supplier={enterprise}
        isOpen={showRfqModal}
        onClose={() => setShowRfqModal(false)}
      />

    </div>
  );
}
