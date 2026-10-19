// File: src/data/productServicesData.js
// Specification & Model for Page 07 (CHUOICUNGUNG.COM - Product / Service Detail)

import { slugify } from './categoryHubData.js';
import { suppliers as enterprisesFullList, isCloudBrowser, getCloudRecords } from './cloudData.js';

// Category-specific dynamic specifications schema
export const CATEGORY_SPEC_SCHEMAS = {
  uniform: {
    categoryName: "May mặc & Đồng phục công nhân",
    phase: "4.1 & 5.3",
    fields: [
      { key: "material", label: "Chất liệu vải", type: "text", highlight: true },
      { key: "composition", label: "Tỷ lệ sợi dệt", type: "text" },
      { key: "sewingTech", label: "Kỹ thuật may & mũi chỉ", type: "text" },
      { key: "printEmbroidery", label: "Công nghệ in / thêu", type: "text", highlight: true },
      { key: "sizing", label: "Dải kích thước (Size)", type: "text" },
      { key: "colorFastness", label: "Độ bền màu & Chống xù lông", type: "text" },
      { key: "safetyStandard", label: "Tiêu chuẩn kỹ thuật", type: "text", highlight: true },
      { key: "packagingSpec", label: "Quy cách đóng gói xuất xưởng", type: "text" }
    ]
  },
  mechanical: {
    categoryName: "Gia công cơ khí chính xác & Phụ trợ B2B",
    phase: "4.2",
    fields: [
      { key: "material", label: "Vật liệu phôi gia công", type: "text", highlight: true },
      { key: "tolerance", label: "Dung sai kỹ thuật", type: "text", highlight: true },
      { key: "machiningCapacity", label: "Kích thước gia công tối đa", type: "text" },
      { key: "surfaceTreatment", label: "Xử lý bề mặt", type: "text", highlight: true },
      { key: "machineryUsed", label: "Hệ thống máy gia công", type: "text" },
      { key: "qcMethod", label: "Quy trình đo kiểm KCS", type: "text", highlight: true },
      { key: "cadCamSupport", label: "Tiếp nhận file thiết kế", type: "text" },
      { key: "standard", label: "Tiêu chuẩn dung sai quốc tế", type: "text" }
    ]
  },
  packaging: {
    categoryName: "Bao bì, Thùng carton & Đóng gói công nghiệp",
    phase: "4.1 & 5.2",
    fields: [
      { key: "cartonLayers", label: "Kết cấu số lớp & Loại sóng", type: "text", highlight: true },
      { key: "paperGrammage", label: "Định lượng giấy (g/m²)", type: "text", highlight: true },
      { key: "burstStrength", label: "Độ chịu bục / nén (Bursting/ECT)", type: "text", highlight: true },
      { key: "printingTech", label: "Công nghệ in ấn bề mặt", type: "text" },
      { key: "waterproof", label: "Xử lý cán màng / Chống ẩm", type: "text" },
      { key: "palletLoad", label: "Khả năng xếp chồng tải trọng", type: "text" },
      { key: "recyclability", label: "Tiêu chuẩn tái chế & Môi trường", type: "text" }
    ]
  },
  solar: {
    categoryName: "Điện mặt trời áp mái & Năng lượng xanh KCN",
    phase: "6.2",
    fields: [
      { key: "systemCapacity", label: "Dải công suất triển khai", type: "text", highlight: true },
      { key: "panelTech", label: "Công nghệ Tấm pin PV", type: "text", highlight: true },
      { key: "inverterTech", label: "Biến tần Inverter công nghiệp", type: "text" },
      { key: "epcScope", label: "Phạm vi hợp đồng EPC", type: "text", highlight: true },
      { key: "firePermit", label: "Hồ sơ Thẩm duyệt PCCC", type: "text", highlight: true },
      { key: "evnGrid", label: "Thủ tục đấu nối lưới điện EVN", type: "text" },
      { key: "warranty", label: "Thời hạn bảo hành hệ thống", type: "text" }
    ]
  },
  chemical: {
    categoryName: "Hóa chất công nghiệp & Xử lý nước thải",
    phase: "4.1",
    fields: [
      { key: "purity", label: "Hàm lượng hoạt chất chính", type: "text", highlight: true },
      { key: "form", label: "Trạng thái & Màu sắc", type: "text" },
      { key: "applicationScope", label: "Mục đích sử dụng chính", type: "text", highlight: true },
      { key: "standardQCVN", label: "Quy chuẩn môi trường", type: "text", highlight: true },
      { key: "storagePacking", label: "Quy cách đóng can/phuy/IBC", type: "text" },
      { key: "msdsSupplied", label: "Hồ sơ an toàn hóa chất MSDS", type: "text", highlight: true }
    ]
  },
  default: {
    categoryName: "Sản phẩm & Dịch vụ công nghiệp B2B",
    phase: "4.1 & 4.2",
    fields: [
      { key: "material", label: "Vật liệu / Thành phần chính", type: "text", highlight: true },
      { key: "specifications", label: "Quy cách kỹ thuật tiêu chuẩn", type: "text", highlight: true },
      { key: "capacity", label: "Năng lực cung ứng / tháng", type: "text", highlight: true },
      { key: "origin", label: "Xuất xứ nguồn gốc", type: "text" },
      { key: "standards", label: "Tiêu chuẩn chất lượng áp dụng", type: "text", highlight: true },
      { key: "packing", label: "Quy cách đóng gói vận chuyển", type: "text" }
    ]
  }
};

export function detectCategorySchema(categoryOrTitle) {
  const text = (categoryOrTitle || "").toLowerCase();
  if (text.includes("đồng phục") || text.includes("may mặc") || text.includes("quần áo") || text.includes("bảo hộ") || text.includes("áo thun") || text.includes("nón")) {
    return CATEGORY_SPEC_SCHEMAS.uniform;
  }
  if (text.includes("cơ khí") || text.includes("cnc") || text.includes("phay") || text.includes("tiện") || text.includes("jig") || text.includes("kim loại") || text.includes("bu lông") || text.includes("khuôn")) {
    return CATEGORY_SPEC_SCHEMAS.mechanical;
  }
  if (text.includes("bao bì") || text.includes("carton") || text.includes("thùng") || text.includes("pallet") || text.includes("màng pe") || text.includes("đóng gói")) {
    return CATEGORY_SPEC_SCHEMAS.packaging;
  }
  if (text.includes("mặt trời") || text.includes("solar") || text.includes("điện áp mái") || text.includes("biến áp") || text.includes("mep") || text.includes("pccc")) {
    return CATEGORY_SPEC_SCHEMAS.solar;
  }
  if (text.includes("hóa chất") || text.includes("sơn") || text.includes("dung môi") || text.includes("nhựa") || text.includes("nước thải")) {
    return CATEGORY_SPEC_SCHEMAS.chemical;
  }
  return CATEGORY_SPEC_SCHEMAS.default;
}

// Master Pre-seeded Verified Product / Service Catalog
export const SEED_PRODUCT_SERVICES = websiteSeed('productServicesData.SEED_PRODUCT_SERVICES');

// Helper: Dynamically find or generate a structured ProductService entity
export const SEEDED_PRODUCT_SERVICES = isCloudBrowser() ? getCloudRecords('productsServices') : SEED_PRODUCT_SERVICES;
export function getProductServiceBySlug(slugOrId, supplierParam = '') {
  if (!slugOrId) return SEEDED_PRODUCT_SERVICES[0];
  const target = String(slugOrId).toLowerCase().trim();

  // 1. Check exact match in pre-seeded verified catalog
  const seeded = SEEDED_PRODUCT_SERVICES.find(
    p => p.slug === target || p.id === target || slugify(p.title) === target
  );
  if (seeded) return seeded;

  // 2. Dynamic synthesis from enterprise catalog:
  // Find supplier by supplierParam or find an enterprise whose name/products match
  let supplier = null;
  if (supplierParam) {
    const sTarget = String(supplierParam).toLowerCase().trim();
    supplier = enterprisesFullList.find(e => 
      String(e.id).toLowerCase() === sTarget || 
      (e.slug && String(e.slug).toLowerCase() === sTarget) ||
      (e.name && slugify(e.name) === sTarget)
    );
  }

  if (!supplier) {
    // Try to match from enterprise name in slug
    supplier = enterprisesFullList.find(e => {
      const eSlug = slugify(e.name || '');
      return target.includes(eSlug) || eSlug.includes(target);
    });
  }

  // Fallback to primary enterprise
  if (!supplier) {
    supplier = enterprisesFullList[0];
  }

  // Derive human-readable product title from slug
  const titleFromSlug = target
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const schema = detectCategorySchema(titleFromSlug + ' ' + (supplier.category || ''));
  const categoryName = schema.categoryName;
  const prov = supplier.province || "Đồng Nai";

  return {
    id: `ps-dyn-${slugify(titleFromSlug)}`,
    organizationId: supplier.id || supplier._id || 'ncc-dyn',
    supplierSlug: supplier.slug || slugify(supplier.name || 'nha-cung-ung'),
    supplierName: supplier.name,
    slug: target,
    title: titleFromSlug,
    shortDescription: `Sản phẩm / Dịch vụ ${titleFromSlug} cung ứng theo tiêu chuẩn kỹ thuật nhà máy B2B bởi ${supplier.name}.`,
    description: `${supplier.name} chuyên sản xuất, gia công kỹ thuật và cung ứng ${titleFromSlug} với năng lực máy móc hiện đại, kiểm soát KCS nghiêm ngặt phục vụ trực tiếp các KCN tại ${prov} và khu vực lân cận.`,
    categoryId: slugify(categoryName),
    categoryName: categoryName,
    phaseId: (supplier.phases && supplier.phases[0]) ? String(supplier.phases[0]) : "4.1",
    suitableBuyer: `Phòng Mua sắm (Procurement), Quản lý Dự án & Nhà thầu KCN có nhu cầu đặt hàng ${titleFromSlug}.`,
    useCase: `Ứng dụng trong dây chuyền sản xuất công nghiệp, phụ trợ kỹ thuật và vận hành nhà xưởng B2B.`,

    specifications: {
      material: "Vật liệu tuyển chọn đạt chuẩn chất lượng CO/CQ",
      composition: "Theo tiêu chuẩn kỹ thuật bản vẽ hoặc mẫu đối chiếu",
      tolerance: "Đạt chuẩn dung sai công nghiệp hoặc kiểm tra QC",
      surfaceTreatment: "Gia công hoàn thiện, chống oxy hóa và bảo vệ bề mặt",
      standards: "Hệ thống quản lý chất lượng theo tiêu chuẩn ISO",
      capacity: supplier.capacity || "Theo ca sản xuất và đơn đặt hàng B2B",
      packing: "Đóng kiện / pallet gỗ công nghiệp chống va đập"
    },

    moq: supplier.moq ? parseInt(supplier.moq.replace(/\D/g, '')) || 100 : 100,
    moqUnit: "đơn vị",
    minOrder: 100,
    maxOrder: 10000,
    leadTimeMin: 10,
    leadTimeMax: 20,
    leadTimeUnit: "ngày làm việc",

    sampleAvailable: true,
    sampleLeadTime: "3 - 5 ngày làm việc",
    surveyAvailable: true,
    surveyTerms: "Sẵn sàng đón tiếp đoàn khảo sát thực tế nhà xưởng (thông báo trước 24h)",

    serviceAreas: [prov, "Bình Dương", "TP. Hồ Chí Minh", "Long An"],
    industrialParkCoverage: [
      `KCN Amata ${prov}`,
      `KCN VSIP`,
      `KCN Biên Hòa`,
      `KCN Long Đức`
    ],
    deliveryLeadTime: `Giao tận nơi trong 24h - 48h nội vùng ${prov}`,

    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
    ],

    evidence: [
      {
        id: "ev-dyn-1",
        type: "CERTIFICATION",
        title: "Giấy phép ĐKKD & Hồ sơ Năng lực Pháp nhân Hợp lệ",
        source: "Cổng thông tin Quốc gia về Đăng ký Doanh nghiệp",
        certNumber: supplier.taxCode || "0310966410",
        status: "CONFIRMED",
        issuedAt: "2015",
        expiresAt: "Vô thời hạn",
        checkedAt: "25/09/2026"
      }
    ],

    confirmationChecklist: {
      verified: [
        { label: "Pháp nhân & Địa bàn hoạt động", note: `Đã đối soát tại ${prov}` },
        { label: "Năng lực tiếp nhận đơn hàng B2B", note: "Đã xác nhận có xưởng và nhân sự kỹ thuật" }
      ],
      needsConfirmation: [
        { 
          label: "Tiến độ giao gấp và điều khoản thanh toán cụ thể", 
          note: "Cần trao đổi trực tiếp khi Buyer cung cấp khối lượng và thời hạn bàn giao chi tiết", 
          status: "CẦN XÁC NHẬN KHI GỬI YÊU CẦU" 
        }
      ]
    },

    availabilityStatus: "AVAILABLE",
    availabilityCheckedAt: "25/09/2026",
    status: supplier.status || "ACTIVE",
    publishable: supplier.publishable !== false,
    updatedAt: "25/09/2026",
    publishedAt: "01/01/2026"
  };
}

// Get related products from same supplier or same category
export function getRelatedProductServices(currentProduct) {
  return SEEDED_PRODUCT_SERVICES
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 3);
}
import { websiteSeed } from './websiteSeeds.js';
