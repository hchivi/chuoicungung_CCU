// File: src/pages/ProductServiceDetailPage.jsx
// Page 07: Chi Tiết Sản Phẩm / Dịch Vụ (/san-pham-dich-vu/[slug])
// Specification 7.txt — ChuoiCungUng.com

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
  RefreshCw, Play, ShieldAlert, Sparkle, ShoppingBag, Package
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { slugify } from './IndustryCategoryPage';
import enterprisesFullList from '../data/enterprisesFull.json';
import foundingPartnersData from '../data/foundingPartners.json';
import { 
  getProductServiceBySlug, 
  detectCategorySchema, 
  getRelatedProductServices 
} from '../data/productServicesData';
import { 
  getEnterpriseAvatarImage, 
  getCategoryBannerImage 
} from '../utils/companyUtils';
import SupplierRequestQuoteModal from '../components/suppliers/SupplierRequestQuoteModal';

export default function ProductServiceDetailPage() {
  const { t, lang } = useLanguage();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const supplierParam = searchParams.get('supplier') || searchParams.get('ncc') || '';
  const requirementId = searchParams.get('requirement') || searchParams.get('draft') || '';

  // 1. Fetch ProductService Data
  const product = useMemo(() => {
    return getProductServiceBySlug(slug, supplierParam);
  }, [slug, supplierParam]);

  // 2. Fetch Supplier / Organization Identity (Master identity)
  const supplier = useMemo(() => {
    if (product.organizationId) {
      const byId = enterprisesFullList.find(e => 
        String(e.id) === String(product.organizationId) || 
        String(e._id) === String(product.organizationId)
      );
      if (byId) return byId;
    }
    if (product.supplierSlug) {
      const bySlug = enterprisesFullList.find(e => 
        e.slug === product.supplierSlug || slugify(e.name || '') === product.supplierSlug
      );
      if (bySlug) return bySlug;
    }
    if (product.supplierName) {
      const nameSlug = product.supplierSlug || slugify(product.supplierName);
      return {
        id: product.organizationId || nameSlug,
        name: product.supplierName,
        slug: nameSlug,
        category: product.categoryName || 'Sản xuất công nghiệp',
        province: (product.serviceAreas && product.serviceAreas[0]) || 'Đồng Nai',
        address: 'Khu công nghiệp trọng điểm',
        phone: '0903 000 000',
        email: 'contact@chuoicungung.com',
        verified: true,
        verificationStatus: 'VERIFIED',
        tier: 'VERIFIED_SUPPLIER',
        description: `Nhà cung ứng chuyên nghiệp trong lĩnh vực ${product.categoryName || 'sản xuất công nghiệp'}.`
      };
    }
    return enterprisesFullList[0];
  }, [product]);

  // Active requirement context if opened with ?requirement=...
  const [activeRequirement, setActiveRequirement] = useState(null);
  useEffect(() => {
    if (!requirementId) {
      setActiveRequirement(null);
      return;
    }
    try {
      const draft = localStorage.getItem('ccu_draft_' + requirementId);
      if (draft) {
        setActiveRequirement(JSON.parse(draft));
        return;
      }
      const latest = localStorage.getItem('ccu_requirement_draft');
      if (latest) {
        setActiveRequirement(JSON.parse(latest));
        return;
      }
    } catch (e) {}
  }, [requirementId]);

  // Category Schema for dynamic specification rendering
  const categorySchema = useMemo(() => {
    return detectCategorySchema(product.title + ' ' + (product.categoryName || ''));
  }, [product]);

  // Related products
  const relatedProducts = useMemo(() => {
    return getRelatedProductServices(product);
  }, [product]);

  // States
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showRequestActionModal, setShowRequestActionModal] = useState(false);
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [isAddedToRequirement, setIsAddedToRequirement] = useState(false);
  const [suppiAnswer, setSuppiAnswer] = useState(null);
  const [activeSuppiQuestion, setActiveSuppiQuestion] = useState(null);

  // Sync saved state
  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('ccu_saved_products') || '[]');
      setIsSaved(savedList.some(p => p.id === product.id));
    } catch (e) {}
  }, [product.id]);

  const handleToggleSave = () => {
    try {
      let savedList = JSON.parse(localStorage.getItem('ccu_saved_products') || '[]');
      if (isSaved) {
        savedList = savedList.filter(p => p.id !== product.id);
        setIsSaved(false);
      } else {
        savedList.push({
          id: product.id,
          title: product.title,
          slug: product.slug,
          supplierName: supplier.name,
          category: product.categoryName,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
      }
      localStorage.setItem('ccu_saved_products', JSON.stringify(savedList));
    } catch (e) {}
  };

  // Section 02 Spec: Canonical Slug & Auto-redirect if slug changed
  const canonicalSlug = product.slug || slugify(product.title || 'san-pham');

  useEffect(() => {
    if (slug && canonicalSlug && slug !== canonicalSlug) {
      const searchStr = searchParams.toString();
      navigate(`/san-pham-dich-vu/${canonicalSlug}${searchStr ? '?' + searchStr : ''}`, { replace: true });
    }
  }, [slug, canonicalSlug, searchParams, navigate]);

  // Section 09 Spec: Dynamic SEO Head & Schema.org JSON-LD (Product + Organization, No fake ratings)
  useEffect(() => {
    document.title = `${product.title} | CHUOICUNGUNG.COM`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    const areaStr = (product.serviceAreas || []).join(', ') || supplier.province || 'Việt Nam';
    metaDesc.content = `${product.title} do ${supplier.name} sản xuất và cung ứng tại ${areaStr}. MOQ ${product.moq} ${product.moqUnit}, thời gian giao hàng ${product.leadTimeMin}-${product.leadTimeMax} ${product.leadTimeUnit}, quy chuẩn kỹ thuật và báo giá B2B minh bạch.`;

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `https://chuoicungung.com/san-pham-dich-vu/${canonicalSlug}`;

    // Schema.org Product & Organization (No fake review/AggregateRating per Section 9 Spec)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.shortDescription,
      "image": product.images || [],
      "category": product.categoryName,
      "brand": {
        "@type": "Brand",
        "name": supplier.name
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "VND",
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": product.moq,
          "unitText": product.moqUnit
        }
      }
    };

    let schemaScript = document.getElementById('product-schema-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'product-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schemaData);

    return () => {
      const script = document.getElementById('product-schema-jsonld');
      if (script) script.remove();
    };
  }, [product, supplier, canonicalSlug]);

  // Section 10 Spec: Publication Rule Guard
  const isUnpublished = 
    supplier.status === 'SUSPENDED' || 
    supplier.status === 'INACTIVE' || 
    product.status === 'INACTIVE' || 
    product.publishable === false;

  // SUPPI Product Assistant Questions (Section 06 Spec)
  const handleAskSuppi = (key) => {
    setActiveSuppiQuestion(key);
    let reply = '';
    switch (key) {
      case 'suitable':
        reply = `✓ Sản phẩm/dịch vụ này được thiết kế chuyên biệt cho: ${product.suitableBuyer}. Phù hợp nhất cho ${product.useCase}`;
        break;
      case 'moq':
        reply = `✓ Số lượng đặt hàng tối thiểu (MOQ) là ${product.moq} ${product.moqUnit}. Khả năng cung ứng tối đa có thể lên tới ${product.maxOrder?.toLocaleString() || 'hàng chục nghìn'} ${product.moqUnit}/tháng.`;
        break;
      case 'leadtime':
        reply = `✓ Thời gian sản xuất & bàn giao tiêu chuẩn là ${product.leadTimeMin} - ${product.leadTimeMax} ${product.leadTimeUnit}. Đối với đơn hàng khẩn cấp ca 3, hai bên có thể thỏa thuận bổ sung.`;
        break;
      case 'sample':
        reply = `✓ ${supplier.name} ${product.sampleAvailable ? `CÓ nhận làm mẫu thực tế (${product.sampleLeadTime || '3-5 ngày làm việc'}).` : 'Hiện chỉ cung cấp mẫu có sẵn tại kho xưởng.'}`;
        break;
      case 'location':
        reply = `✓ Địa bàn giao hàng thường nhật bao gồm: ${(product.serviceAreas || []).join(', ')} và các KCN trọng điểm như ${(product.industrialParkCoverage || []).slice(0, 3).join(', ')}. Giao hàng trong vòng ${product.deliveryLeadTime || '24h - 48h'}.`;
        break;
      case 'evidence':
        reply = `✓ Sản phẩm đã có ${(product.evidence || []).length} tài liệu kiểm chuẩn, bao gồm: ${(product.evidence || []).map(e => e.title).join('; ')}.`;
        break;
      case 'confirmation':
        reply = `⚠️ Các thông tin bạn NÊN xác nhận lại trước khi đặt hàng: ${product.confirmationChecklist?.needsConfirmation?.map(c => `(•) ${c.label}`).join(' ') || 'Thời gian giao hàng ca 3 và điều khoản thanh toán.'}`;
        break;
      default:
        reply = "Thông tin này hiện chưa được xác nhận đầy đủ trong hồ sơ. Bạn có thể bấm 'Gửi yêu cầu' để SUPPI điều phối và kết nối trực tiếp với nhà cung ứng.";
    }
    setSuppiAnswer(reply);
  };

  // Section 05 Spec: CTA Gửi Yêu Cầu tạo Requirement Draft
  const handleCreateRequirementDraft = () => {
    const draftId = 'NC-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const draftPayload = {
      id: draftId,
      title: `Tìm nguồn cung ${product.title}`,
      productServiceId: product.id,
      productTitle: product.title,
      supplierOrganizationId: supplier.id || supplier._id,
      supplierName: supplier.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      quantity: product.moq,
      unit: product.moqUnit,
      location: (product.serviceAreas && product.serviceAreas[0]) || supplier.province || 'Đồng Nai',
      deadline: `${product.leadTimeMax} ngày tới`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      suppliers: [
        {
          id: supplier.id || supplier._id,
          name: supplier.name,
          address: supplier.province || supplier.address,
          status: 'TARGETED',
          matchRate: 98,
          notes: `Được tạo trực tiếp từ trang sản phẩm: ${product.title}`
        }
      ]
    };
    try {
      localStorage.setItem('ccu_draft_' + draftId, JSON.stringify(draftPayload));
      localStorage.setItem('ccu_requirement_draft', JSON.stringify(draftPayload));
    } catch (e) {}
    setShowRequestActionModal(false);
    navigate(`/dang-nhu-cau?draft=${draftId}&targetSupplier=${supplier.id || supplier._id}`);
  };

  // Add Product to existing requirement
  const handleAddToActiveRequirement = () => {
    if (!activeRequirement) return;
    setIsAddedToRequirement(true);
    try {
      const key = 'ccu_draft_' + activeRequirement.id;
      const current = localStorage.getItem(key);
      let draftObj = current ? JSON.parse(current) : activeRequirement;
      draftObj.suppliers = draftObj.suppliers || [];
      if (!draftObj.suppliers.find(s => s.name === supplier.name)) {
        draftObj.suppliers.push({
          id: supplier.id || supplier._id,
          name: supplier.name,
          address: supplier.province || 'Việt Nam',
          productService: product.title,
          status: 'CONSIDERING',
          matchRate: 99,
          notes: `Mời cung cấp gói sản phẩm: ${product.title}`
        });
        localStorage.setItem(key, JSON.stringify(draftObj));
      }
    } catch (e) {}
    setShowRequestActionModal(false);
  };

  // Section 10: Unpublished check
  if (isUnpublished) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
            🔒
          </div>
          <h2 className="text-lg font-black text-slate-900 font-heading">
            Sản Phẩm / Dịch Vụ Tạm Ẩn Hoặc Chưa Công Bố
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sản phẩm/dịch vụ này hiện đang trong quá trình rà soát tiêu chuẩn hoặc nhà cung ứng chưa kích hoạt trạng thái công bố công khai.
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

  const supplierSlug = supplier.slug || slugify(supplier.name || 'nha-cung-ung');

  return (
    <main className="space-y-6 pb-28 pt-4 font-sans select-none bg-slate-50/60 min-h-screen text-slate-800 antialiased">
      
      {/* 1. BREADCRUMB BAR (Section 4.01 Spec) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto py-1">
          <Link to="/" title="Trang chủ" className="inline-flex items-center hover:opacity-80 transition shrink-0 p-0.5">
            <img src="/logo_only.png" alt="Trang chủ" className="w-4 h-4 object-contain shrink-0" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/doanh-nghiep" className="hover:text-[#0052cc] transition shrink-0 font-medium">Nhà cung ứng</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to={`/doanh-nghiep/${supplierSlug}`} className="hover:text-[#0052cc] transition shrink-0 font-medium truncate max-w-[200px]">
            {supplier.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{product.title}</span>
        </nav>
      </div>

      {/* 2. MATCHING CONTEXT NOTIFICATION IF ACCESSED FROM REQUIREMENT */}
      {activeRequirement && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-blue-400/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[11px] font-mono font-bold">
                  NHU CẦU #{activeRequirement.id}
                </span>
                <span className="text-xs text-blue-200">Sản phẩm này khớp chính xác tiêu chí bạn đang tìm</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {product.title} của {supplier.name}
              </h3>
            </div>

            <button
              onClick={handleAddToActiveRequirement}
              disabled={isAddedToRequirement}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-md ${
                isAddedToRequirement ? 'bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isAddedToRequirement ? 'Đã thêm vào Nhu cầu' : '+ Chọn cho Nhu cầu hiện tại'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. SECTION 01 — HEADER & PRIMARY PRODUCT DISPLAY (Section 4.01 Spec) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Product Image Gallery */}
            <div className="lg:col-span-5 space-y-3">
              {/* Main Large Image */}
              <div 
                onClick={() => setLightboxImage(selectedImage || product.images?.[0])}
                className="h-72 sm:h-84 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group cursor-pointer"
              >
                <img 
                  src={selectedImage || product.images?.[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ảnh thực tế xưởng sản xuất</span>
                </div>
                <div className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-xl shadow-md text-slate-700 text-xs font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Phóng to</span>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-4 gap-2">
                {(product.images || []).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      selectedImage === img ? 'border-[#0052cc] scale-102 shadow-xs' : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Product Details & CTAs */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-blue-100 text-[#0052cc] font-black rounded-lg text-[11px] uppercase tracking-wider font-heading">
                  {product.categoryName}
                </span>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>SẴN SÀNG NHẬN ĐƠN HÀNG</span>
                </span>

                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-mono">
                  Pha {product.phaseId}
                </span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 font-heading leading-tight tracking-tight">
                {product.title}
              </h1>

              {/* Supplier Identity Line */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-0.5 overflow-hidden shrink-0 shadow-2xs">
                    <img 
                      src={getEnterpriseAvatarImage(supplier)} 
                      alt={supplier.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block font-medium">Nhà cung ứng / Đơn vị sản xuất:</span>
                    <Link 
                      to={`/doanh-nghiep/${supplierSlug}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0052cc] transition font-heading truncate block"
                    >
                      {supplier.name} ➔
                    </Link>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono shrink-0">
                  <div>Địa bàn: <strong className="text-slate-800">{supplier.province || "Đồng Nai"}</strong></div>
                  <div>Cập nhật: {product.updatedAt}</div>
                </div>
              </div>

              {/* Key Quick Conditions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                  <span className="text-blue-700 block text-[11px] font-medium">MOQ tối thiểu:</span>
                  <strong className="text-blue-950 font-mono text-sm">{product.moq} {product.moqUnit}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-medium">Lead time giao hàng:</span>
                  <strong className="text-slate-900 font-mono text-sm">{product.leadTimeMin} - {product.leadTimeMax} {product.leadTimeUnit}</strong>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <span className="text-emerald-700 block text-[11px] font-medium">Hỗ trợ làm mẫu:</span>
                  <strong className="text-emerald-950 text-xs">{product.sampleAvailable ? '✓ Có làm mẫu trước' : 'Mẫu tại kho'}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-medium">Khảo sát nhà máy:</span>
                  <strong className="text-slate-900 text-xs">✓ Đón tiếp đoàn</strong>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={() => setShowRequestActionModal(true)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#0052cc] to-blue-700 hover:from-[#0041a8] hover:to-[#0052cc] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition font-heading cursor-pointer transform hover:-translate-y-0.5 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu báo giá</span>
                </button>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleToggleSave}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer border ${
                      isSaved ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{isSaved ? 'Đã lưu' : 'Lưu'}</span>
                  </button>

                  <Link
                    to={`/doanh-nghiep/${supplierSlug}`}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading"
                  >
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>Xem hồ sơ nhà cung ứng</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 4. MAIN CONTENT BODY (8 COLS LEFT + 4 COLS RIGHT) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: 8 COLS OF STRUCTURED SECTIONS */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 02 — TỔNG QUAN & PHẠM VI ỨNG DỤNG (Section 4.02 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-[#0052cc] rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                1. Tổng Quan & Nhóm Khách Hàng Phù Hợp
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-800 text-sm">
                {product.shortDescription}
              </p>
              <p>
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                <span className="font-bold text-blue-900 uppercase font-mono text-[11px] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>PHÙ HỢP VỚI NHÓM BUYER:</span>
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {product.suitableBuyer}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-slate-700 uppercase font-mono text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>MỤC ĐÍCH SỬ DỤNG CHÍNH:</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {product.useCase}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 03 — THÔNG SỐ KỸ THUẬT / PHẠM VI (Section 4.03 Spec - Dynamic Schema) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  2. Thông Số Kỹ Thuật & Quy Cách Thực Tế
                </h2>
              </div>
              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {categorySchema.categoryName}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Các thông số dưới đây được đối soát trực tiếp theo tiêu chuẩn xuất xưởng của đơn vị sản xuất:
            </p>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              {categorySchema.fields.map((field) => {
                const val = product.specifications?.[field.key] || product.specifications?.[field.label] || 'Theo thỏa thuận bản vẽ';
                return (
                  <div key={field.key} className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition ${
                    field.highlight ? 'bg-purple-50/30' : 'bg-white'
                  }`}>
                    <span className="text-slate-500 font-medium sm:w-1/3 flex items-center gap-1.5">
                      {field.highlight && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                      <span>{field.label}</span>
                    </span>
                    <strong className="text-slate-900 sm:w-2/3 sm:text-right font-sans text-xs sm:text-[12.5px]">
                      {val}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 04 — ĐIỀU KIỆN NHẬN ĐƠN & GIAO HÀNG (Section 4.04 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  3. Điều Kiện Nhận Đơn & Thời Gian Thực Hiện
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                Xác nhận {product.availabilityCheckedAt}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Số lượng tối thiểu (MOQ):</span>
                  <strong className="text-slate-900 font-mono text-sm">{product.moq} {product.moqUnit}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Dải số lượng tối ưu:</span>
                  <strong className="text-slate-900 font-mono text-xs">{product.minOrder} - {product.maxOrder?.toLocaleString()} {product.moqUnit}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Lead time sản xuất:</span>
                  <strong className="text-slate-900 font-mono text-sm">{product.leadTimeMin} - {product.leadTimeMax} {product.leadTimeUnit}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Chính sách làm mẫu:</span>
                  <span className="text-emerald-700 font-bold">{product.sampleLeadTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Khảo sát & Đối soát:</span>
                  <span className="text-emerald-700 font-bold">{product.surveyTerms}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tình trạng nhận đơn:</span>
                  <span className="text-[#0052cc] font-bold">Sẵn sàng nhận thêm đơn mới</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 05 — ĐỊA BÀN PHỤC VỤ (Section 4.05 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                4. Địa Bàn Phục Vụ & Tuyến Giao Nhận KCN
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 uppercase font-mono flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>TỈNH / THÀNH PHỐ PHỤC VỤ TRỰC TIẾP:</span>
                </span>
                <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                  {(product.serviceAreas || []).join(' · ')}
                </p>
                <div className="text-[11px] text-emerald-800 pt-1">
                  {product.deliveryLeadTime}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase font-mono flex items-center gap-1.5">
                  <Factory className="w-4 h-4 text-slate-600" />
                  <span>CÁC KHU CÔNG NGHIỆP TRỌNG ĐIỂM GIAO THƯỜNG NHẬT:</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(product.industrialParkCoverage || []).map((kcn, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px]">
                      📍 {kcn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 06 — BẰNG CHỨNG NĂNG LỰC & CHỨNG NHẬN (Section 4.06 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-cyan-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  5. Bằng Chứng Kỹ Thuật & Tài Liệu Kiểm Chuẩn
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Đối soát nguồn cấp</span>
            </div>

            <div className="space-y-3">
              {(product.evidence || []).map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0052cc] font-mono font-bold text-[10px]">
                        {ev.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                        {ev.status === 'CONFIRMED' ? 'ĐÃ ĐỐI SOÁT' : 'TÀI LIỆU CUNG CẤP'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 font-heading text-xs sm:text-sm">
                      {ev.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Nguồn cấp: {ev.source} · Số hiệu: <span className="font-mono text-slate-700 font-semibold">{ev.certNumber}</span>
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

          {/* SECTION 07 — KHỐI THÔNG TIN CẦN XÁC NHẬN (Section 4.07 Spec - MANDATORY BLOCK) */}
          <section className="bg-white rounded-3xl border-2 border-amber-300/80 p-6 sm:p-7 shadow-md space-y-4 relative overflow-hidden">
            <div className="flex items-center space-x-2.5 border-b border-amber-200 pb-3">
              <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  6. Khối Thông Tin Cần Xác Nhận (Checklist Minh Bạch)
                </h2>
                <p className="text-[11px] text-amber-900">
                  Phân định rõ ràng các nội dung đã có chứng chỉ đối soát và các điểm Buyer cần xác nhận lại trước khi chốt đơn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Verified */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-900 uppercase font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ĐÃ CÓ CĂN CỨ KIỂM SOÁT (VERIFIED)</span>
                </span>
                <div className="space-y-2 pt-1">
                  {(product.confirmationChecklist?.verified || []).map((item, idx) => (
                    <div key={idx} className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/60 leading-tight">
                      <strong className="text-slate-900 block text-xs">{item.label}</strong>
                      <span className="text-[10.5px] text-emerald-800">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs confirmation */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="text-[11px] font-bold text-amber-950 uppercase font-heading flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>CẦN XÁC NHẬN TRỰC TIẾP TRƯỚC KHI ĐẶT:</span>
                </span>
                <div className="space-y-2 pt-1">
                  {(product.confirmationChecklist?.needsConfirmation || []).map((item, idx) => (
                    <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-amber-200/80 leading-tight">
                      <strong className="text-slate-900 block text-xs">{item.label}</strong>
                      <span className="text-[10.5px] text-amber-900 block">{item.note}</span>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-bold text-[9.5px]">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 08 — SUPPLIER IDENTITY BLOCK (Section 4.08 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <span className="w-2.5 h-6 bg-slate-800 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                7. Thông Tin Nhà Cung Ứng Trực Thuộc
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 shadow-sm shrink-0 overflow-hidden">
                  <img src={getEnterpriseAvatarImage(supplier)} alt={supplier.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    {supplier.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trụ sở: {supplier.address || supplier.province || 'Việt Nam'} · MST: {supplier.taxCode || '0310966410'}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Năng lực chính: {supplier.specialty || supplier.category || 'Gia công & Cung ứng công nghiệp B2B'}
                  </p>
                </div>
              </div>

              <Link
                to={`/doanh-nghiep/${supplierSlug}`}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 font-heading shadow-xs"
              >
                <span>XEM HỒ SƠ NHÀ CUNG ỨNG</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* SECTION 09 — SẢN PHẨM / DỊCH VỤ LIÊN QUAN (Section 4.09 Spec) */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-indigo-600 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 font-heading uppercase tracking-wide">
                  8. Sản Phẩm & Dịch Vụ Cùng Chuyên Mục
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">B2B Standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/san-pham-dich-vu/${rel.slug}?supplier=${rel.supplierSlug}`}
                  className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-[#0052cc] hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="h-32 bg-slate-100 overflow-hidden">
                    <img src={rel.images?.[0]} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0052cc] line-clamp-2 font-heading">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">MOQ: {rel.moq} {rel.moqUnit}</p>
                    </div>
                    <span className="text-[11px] text-[#0052cc] font-bold flex items-center gap-0.5 pt-2 border-t border-slate-100">
                      <span>Xem thông số</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* SECTION 10 — FINAL CTA BANNER (Section 4.10 Spec) */}
          <section className="rounded-3xl bg-gradient-to-r from-[#0052cc] via-indigo-700 to-purple-800 text-white p-7 sm:p-10 shadow-xl space-y-4 text-center">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider inline-block">
              CHUỖI CUNG ỨNG BẢO CHỨNG
            </span>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading uppercase leading-tight">
              BẠN ĐANG CẦN {product.title}?
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Tạo gói nhu cầu hoặc gửi yêu cầu báo giá trực tiếp. SUPPI & CHAINY sẽ hỗ trợ chuẩn hóa quy cách kỹ thuật và theo sát phản hồi đến khi hai bên ký kết hợp đồng.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowRequestActionModal(true)}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition font-heading cursor-pointer uppercase tracking-wider"
              >
                GỬI YÊU CẦU CHO SẢN PHẨM NÀY
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('suppi-product-assistant');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl transition font-heading flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>HỎI SUPPI TRỢ LÝ</span>
              </button>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SUPPI INTERACTIVE ASSISTANT (4 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SUPPI Interactive Product Assistant (Section 06 Spec) */}
          <div id="suppi-product-assistant" className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-indigo-800/60 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 font-heading">
                  HỎI NHANH TRỢ LÝ SUPPI
                </h3>
                <p className="text-[10.5px] text-slate-400">Dữ liệu có cấu trúc từ hồ sơ kỹ thuật</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Bấm vào từng câu hỏi để xem giải đáp chính xác từ thông số sản phẩm:
            </p>

            <div className="space-y-1.5">
              {[
                { key: 'suitable', q: 'Sản phẩm này phù hợp với đối tượng nào?' },
                { key: 'moq', q: 'Số lượng tối thiểu (MOQ) bao nhiêu?' },
                { key: 'leadtime', q: 'Thời gian giao hàng (Lead time) bao lâu?' },
                { key: 'sample', q: 'Có nhận gửi mẫu hoặc may mẫu thử không?' },
                { key: 'location', q: 'Có giao hàng tận KCN Đồng Nai / Bình Dương không?' },
                { key: 'evidence', q: 'Sản phẩm có chứng nhận chất lượng gì?' },
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

            {/* Answer Display */}
            {suppiAnswer && (
              <div className="p-3.5 rounded-2xl bg-indigo-900/50 border border-indigo-400/40 text-xs text-indigo-100 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SUPPI PHẢN HỒI:</span>
                </div>
                <p className="leading-relaxed">{suppiAnswer}</p>
                <div className="pt-1 text-right">
                  <Link
                    to={`/tro-ly-ai?q=${encodeURIComponent('Đánh giá sản phẩm ' + product.title + ' của ' + supplier.name)}`}
                    className="text-[10.5px] text-blue-300 hover:text-white underline font-medium"
                  >
                    Mở chat chuyên sâu trong AI Workspace ➔
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Secure Channel Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wide text-slate-900 font-heading">
                  KÊNH KẾT NỐI BẢO CHỨNG
                </h3>
                <p className="text-[10.5px] text-slate-500">Chống phá giá · Tránh rò rỉ thông tin mua sắm</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mọi yêu cầu báo giá sản phẩm đều được gửi qua luồng <strong>Requirement Draft</strong> chính thức để ban điều phối CCU theo sát tiến độ và đảm bảo cam kết bảo mật.
            </p>

            <button
              onClick={() => setShowRequestActionModal(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading transition shadow-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>GỬI YÊU CẦU BÁO GIÁ SẢN PHẨM</span>
            </button>
          </div>

        </div>

      </div>

      {/* 5. STICKY MOBILE BOTTOM ACTION DOCK (Section 11 Spec) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black text-slate-900 truncate font-heading">{product.title}</div>
          <div className="text-[10.5px] text-slate-500 truncate font-mono">MOQ: {product.moq} {product.moqUnit} · {supplier.name}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const el = document.getElementById('suppi-product-assistant');
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

      {/* 6. MODAL CHỌN LUỒNG GỬI YÊU CẦU (Section 5 Spec) */}
      {showRequestActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-950 font-heading uppercase">
                  GỬI YÊU CẦU SẢN PHẨM
                </h3>
                <p className="text-xs text-slate-500">{product.title}</p>
              </div>
              <button
                onClick={() => setShowRequestActionModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Add to current requirement if present */}
              {activeRequirement && (
                <div 
                  onClick={handleAddToActiveRequirement}
                  className="p-4 rounded-2xl bg-blue-50/80 border-2 border-[#0052cc] hover:bg-blue-100/80 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0052cc] font-mono">DÙNG NHU CẦU HIỆN CÓ</span>
                    <span className="text-[10px] font-bold bg-[#0052cc] text-white px-2 py-0.5 rounded-full">Đề xuất</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                    Gắn vào Nhu cầu #{activeRequirement.id}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Tự động đưa sản phẩm và nhà cung ứng {supplier.name} vào danh sách xem xét trong Workspace nhu cầu của bạn.
                  </p>
                </div>
              )}

              {/* Option 2: Create new requirement with prefilled product context */}
              <div 
                onClick={handleCreateRequirementDraft}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-slate-100 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-700 font-mono">TẠO NHU CẦU MỚI (AI SUPPORT)</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Chuẩn hóa RFQ</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Tạo gói nhu cầu mới từ sản phẩm này
                </h4>
                <p className="text-[11px] text-slate-600">
                  Tự động điền trước tên sản phẩm, thông số kỹ thuật, số lượng MOQ và đích danh nhà cung ứng mà không phải nhập lại.
                </p>
              </div>

              {/* Option 3: Quick RFQ */}
              <div 
                onClick={() => {
                  setShowRequestActionModal(false);
                  setShowRfqModal(true);
                }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-slate-100 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-700 font-mono">PHIẾU BÁO GIÁ NHANH</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">24 Giờ</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Gửi phiếu hỏi giá trực tiếp
                </h4>
                <p className="text-[11px] text-slate-600">
                  Điền nhanh số lượng dự kiến và yêu cầu gửi báo giá / mẫu tận nơi.
                </p>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-400 font-mono text-center">
              CHAINY sẽ điều phối và thông báo ngay khi nhà cung ứng phản hồi.
            </p>
          </div>
        </div>
      )}

      {/* 7. LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img src={lightboxImage} alt="Enlarged preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 8. RFQ MODAL */}
      <SupplierRequestQuoteModal
        supplier={{
          ...supplier,
          productInterest: product.title
        }}
        isOpen={showRfqModal}
        onClose={() => setShowRfqModal(false)}
      />

    </main>
  );
}
