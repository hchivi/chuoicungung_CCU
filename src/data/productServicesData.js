// File: src/data/productServicesData.js
// Specification & Model for Page 07 (CHUOICUNGUNG.COM - Product / Service Detail)

import { slugify } from './categoryHubData.js';
import enterprisesFullList from './enterprisesFull.json' with { type: 'json' };

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
export const SEEDED_PRODUCT_SERVICES = [
  {
    id: "ps-dong-phuc-cong-nhan-01",
    organizationId: "ncc-01",
    supplierSlug: "cong-ty-may-mac-tan-binh-minh",
    supplierName: "Công ty May Mặc Tân Bình Minh",
    slug: "dong-phuc-cong-nhan-nha-may-chong-tinh-dien",
    title: "Đồng phục công nhân nhà máy & Quần áo bảo hộ chống tĩnh điện",
    shortDescription: "Đồng phục công nhân may theo tiêu chuẩn phòng sạch & bảo hộ lao động, chất liệu thấm hút mồ hôi, co giãn 4 chiều và chống bám bụi công nghiệp.",
    description: "Sản phẩm được thiết kế và sản xuất đồng bộ tại xưởng may công nghiệp đạt chuẩn ISO 9001:2015. Phù hợp cho công nhân dây chuyền sản xuất điện tử, cơ khí, chế biến thực phẩm tại các KCN. Hỗ trợ in thêu logo doanh nghiệp sắc nét bằng máy thêu vi tính Tajima, đường may gia cố 2 kim chống rách khi vận động mạnh.",
    categoryId: "may-mac-dong-phuc",
    categoryName: "May mặc & Đồng phục",
    phaseId: "4.1",
    suitableBuyer: "Phòng Mua sắm (Procurement), Quản lý Nhân sự (HR) nhà máy sản xuất FDI từ 100 - 5.000 công nhân.",
    useCase: "Trang bị đồng bộ cho nhân viên nhà xưởng, bảo vệ người lao động và xây dựng nhận diện thương hiệu chuyên nghiệp cho doanh nghiệp.",
    
    // Dynamic specifications matching category schema
    specifications: {
      material: "Kaki 65/35 cao cấp, Cotton 100% hoặc Thun Cá sấu 4 chiều chuyên dụng",
      composition: "65% Polyester - 35% Cotton (Thấm hút mồ hôi, chống nhăn, không xù lông)",
      sewingTech: "May 2 kim móc xích gia cố đũng quần và nách áo; chỉ may Coats chống đứt",
      printEmbroidery: "Thêu vi tính Tajima độ phân giải cao; In lụa Plastisol kháng giặt máy 50+ lần",
      sizing: "Form chuẩn người Việt & Châu Á: S, M, L, XL, 2XL, 3XL; có đo size tận xưởng",
      colorFastness: "Cấp 4-5 (Không phai màu dưới ánh nắng và hóa chất giặt ủi công nghiệp)",
      safetyStandard: "Tiêu chuẩn dệt may an toàn OEKO-TEX Standard 100, chống tĩnh điện ESD 10^6 - 10^9 ohm",
      packagingSpec: "Từng bộ gấp ép chân không túi PE riêng biệt, đóng thùng carton 5 lớp 50 bộ/thùng"
    },

    moq: 100,
    moqUnit: "bộ",
    minOrder: 100,
    maxOrder: 20000,
    leadTimeMin: 10,
    leadTimeMax: 18,
    leadTimeUnit: "ngày làm việc",
    
    sampleAvailable: true,
    sampleLeadTime: "3 - 5 ngày làm việc (Hoàn phí khi ký hợp đồng)",
    surveyAvailable: true,
    surveyTerms: "Đội ngũ kỹ thuật hỗ trợ mang cây vải và bảng màu mẫu đến tận nhà máy để đối soát trực tiếp",
    
    serviceAreas: ["Đồng Nai", "Bình Dương", "TP. Hồ Chí Minh", "Long An", "Bà Rịa - Vũng Tàu", "Tây Ninh"],
    industrialParkCoverage: [
      "KCN Amata Biên Hòa",
      "KCN VSIP 1, 2 & 3",
      "KCN Sóng Thần",
      "KCN Long Đức",
      "KCN Nhơn Trạch",
      "Khu Công Nghệ Cao TP.HCM"
    ],
    deliveryLeadTime: "Giao tận kho xưởng trong 24h đối với Đông Nam Bộ",

    images: [
      "https://pic.trangvangvietnam.com/pics_low/395704506/dong-phuc-bao-ho-lao-dong-2.jpg",
      "https://pic.trangvangvietnam.com/pics_low/395785472/ao-thun-dong-phuc-doanh-nghiep-T408.jpg",
      "https://pic.trangvangvietnam.com/pics_low/395700674/dong-phuc-cong-so-nu-4.jpg",
      "https://pic.trangvangvietnam.com/pics_low/395723531/dong-phuc-cong-so-1494674847.jpg"
    ],

    evidence: [
      {
        id: "ev-ps-1",
        type: "CERTIFICATION",
        title: "Chứng chỉ Vải An toàn Không Chứa Hóa chất Độc hại OEKO-TEX Standard 100",
        source: "Viện Nghiên cứu Dệt may Quốc tế Hohenstein",
        certNumber: "OEKO-TEX-2024-VN",
        status: "CONFIRMED",
        issuedAt: "2024",
        expiresAt: "2027",
        checkedAt: "20/09/2026"
      },
      {
        id: "ev-ps-2",
        type: "PROJECT",
        title: "Hợp đồng cung ứng 3.200 bộ đồng phục công nhân cho nhà máy điện tử KCN Amata",
        source: "Biên bản bàn giao và nghiệm thu chất lượng đợt 2",
        certNumber: "HD-AMATA-UNIFORM-2025",
        status: "DOCUMENT_PROVIDED",
        issuedAt: "11/2025",
        expiresAt: "Đã hoàn thành",
        checkedAt: "15/09/2026"
      }
    ],

    confirmationChecklist: {
      verified: [
        { label: "Chất liệu vải Kaki 65/35 & Cá sấu 4 chiều", note: "Đã có chứng chỉ kiểm định mẫu vải từ nhà dệt" },
        { label: "Năng lực giao xe tải tận cổng nhà máy", note: "Có đội xe tải giao hàng chuyên dụng nội vùng Đông Nam Bộ" },
        { label: "Thời hạn mẫu thực tế 3 - 5 ngày", note: "Đã xác nhận có chuyền may mẫu riêng biệt" }
      ],
      needsConfirmation: [
        { 
          label: "Khả năng may gấp trong 7 ngày đối với đơn trên 1.000 bộ", 
          note: "Cần kiểm tra lịch chạy máy ca 3 tại thời điểm Buyer chốt đơn", 
          status: "CẦN XÁC NHẬN THEO LỊCH CA 3" 
        },
        { 
          label: "Bảo lưu mẫu vải đặc biệt chống tĩnh điện tiêu chuẩn ESD cao cấp", 
          note: "Phụ thuộc vào lượng tồn kho phôi sợi chống tĩnh điện tại thời điểm yêu cầu", 
          status: "CẦN KIỂM TRA TỒN KHO VẢI" 
        }
      ]
    },

    availabilityStatus: "AVAILABLE",
    availabilityCheckedAt: "25/09/2026",
    status: "ACTIVE",
    publishable: true,
    updatedAt: "25/09/2026",
    publishedAt: "01/01/2026"
  },

  {
    id: "ps-co-khi-cnc-01",
    organizationId: "ncc-03",
    supplierSlug: "co-khi-chinh-xac-an-phat",
    supplierName: "Cơ Khí Chính Xác & Khuôn Mẫu An Phát",
    slug: "gia-cong-chi-tiet-may-cnc-chinh-xac-jig-ga",
    title: "Gia công chi tiết máy CNC chính xác, đồ gá Jig & khuôn dập kỹ thuật",
    shortDescription: "Gia công phay, tiện CNC kim loại chính xác dung sai ±0.005mm theo bản vẽ kỹ thuật, đo kiểm bằng máy CMM Mitutoyo.",
    description: "Nhận gia công chi tiết cơ khí đơn chiếc và hàng loạt phục vụ lắp ráp dây chuyền công nghiệp FDI. Sở hữu dàn máy phay CNC 3 trục, 4 trục và 5 trục nhập khẩu từ Nhật Bản. Đảm bảo độ nhám bề mặt Ra < 0.4µm, xử lý nhiệt luyện đạt độ cứng HRC 55-60 theo yêu cầu.",
    categoryId: "co-khi-chinh-xac",
    categoryName: "Cơ khí & Phụ trợ",
    phaseId: "4.2",
    suitableBuyer: "Kỹ sư R&D, Quản lý Bảo trì (Maintenance), Trưởng bộ phận Sourcing nhà máy chế tạo máy và tự động hóa.",
    useCase: "Thay thế chi tiết máy mài mòn, chế tạo cụm Jig gá hàn, gá kiểm tra linh kiện và khuôn dập chính xác cho dây chuyền sản xuất.",

    specifications: {
      material: "Thép hợp kim SKD11, SKD61, S50C, Inox SUS304/316, Nhôm A6061-T6, Đồng Thau",
      tolerance: "Đạt chuẩn ± 0.005mm đến ± 0.01mm (Kiểm soát 100% bằng dưỡng và máy đo)",
      machiningCapacity: "Hành trình máy lớn nhất: X = 1.050mm, Y = 600mm, Z = 550mm",
      surfaceTreatment: "Anodizing nhôm màu/cứng, Mạ Crom cứng, Nhuộm đen, Thấm Nitrit, Nhiệt luyện chân không",
      machineryUsed: "Máy phay CNC Makino/Mori Seiki, Máy tiện CNC Doosan, Máy mài phẳng Okamoto",
      qcMethod: "Máy đo tọa độ 3 chiều CMM Mitutoyo, Kính hiển vi quang học, Máy đo độ nhám Mitutoyo SJ-210",
      cadCamSupport: "Đọc trực tiếp định dạng 3D: STEP, IGES, Parasolid (.x_t), SolidWorks, AutoCAD DWG/DXF",
      standard: "Hệ tiêu chuẩn JIS B 0405 m (Nhật Bản) hoặc ISO 2768-mK"
    },

    moq: 10,
    moqUnit: "chi tiết",
    minOrder: 5,
    maxOrder: 5000,
    leadTimeMin: 5,
    leadTimeMax: 15,
    leadTimeUnit: "ngày làm việc",

    sampleAvailable: true,
    sampleLeadTime: "3 - 5 ngày (Gia công mẫu thử nghiệm kiểm tra dung sai)",
    surveyAvailable: true,
    surveyTerms: "Sẵn sàng đón tiếp đoàn kỹ thuật khách hàng tới kiểm tra xưởng máy và xem chạy thử chi tiết",

    serviceAreas: ["Bắc Ninh", "Hà Nội", "Hải Phòng", "Hưng Yên", "Vĩnh Phúc", "Hải Dương"],
    industrialParkCoverage: [
      "KCN Quế Võ Bắc Ninh",
      "KCN Yên Phong 1 & 2",
      "KCN VSIP Bắc Ninh",
      "KCN Thăng Long 1 & 2",
      "KCN Deep C Hải Phòng"
    ],
    deliveryLeadTime: "Giao trong ngày tại Bắc Ninh - Hà Nội; 24h đối với các tỉnh lân cận",

    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80"
    ],

    evidence: [
      {
        id: "ev-ps-3",
        type: "CERTIFICATION",
        title: "Chứng chỉ Hệ thống Quản lý Chất lượng ISO 9001:2015 Cơ khí Chính xác",
        source: "Tổ chức Đánh giá Tiêu chuẩn TUV Rheinland",
        certNumber: "ISO-TUV-2024-MECH",
        status: "CONFIRMED",
        issuedAt: "2023",
        expiresAt: "2026",
        checkedAt: "18/09/2026"
      },
      {
        id: "ev-ps-4",
        type: "PROJECT",
        title: "Báo cáo Kiểm chuẩn CMM nghiệm thu lô chi tiết gá hàn cho FDI Nhật Bản",
        source: "Phiếu xuất xưởng kiểm nghiệm chất lượng CMM Report",
        certNumber: "CMM-2025-0899",
        status: "DOCUMENT_PROVIDED",
        issuedAt: "12/2025",
        expiresAt: "Vô thời hạn",
        checkedAt: "20/09/2026"
      }
    ],

    confirmationChecklist: {
      verified: [
        { label: "Dung sai đạt chuẩn ±0.005mm", note: "Đã có báo cáo kiểm định máy đo CMM thực tế" },
        { label: "Vật liệu hợp kim nhập khẩu có CO/CQ", note: "Đầy đủ chứng chỉ xuất xưởng phôi kim loại" }
      ],
      needsConfirmation: [
        { 
          label: "Khả năng gia công nhiệt luyện chân không độ cứng > 60 HRC trong 3 ngày", 
          note: "Cần xác nhận theo mẻ lò nhiệt luyện của đối tác chuyên ngành", 
          status: "CẦN XÁC NHẬN LÒ NHIỆT LUYỆN" 
        }
      ]
    },

    availabilityStatus: "AVAILABLE",
    availabilityCheckedAt: "25/09/2026",
    status: "ACTIVE",
    publishable: true,
    updatedAt: "22/09/2026",
    publishedAt: "01/01/2026"
  },

  {
    id: "ps-thung-carton-01",
    organizationId: "ncc-02",
    supplierSlug: "bao-bi-cong-nghiep-toan-thang",
    supplierName: "Bao Bì Công Nghiệp Toàn Thắng",
    slug: "thung-carton-5-lop-song-bc-in-flexo-xuat-khau",
    title: "Thùng carton 5 lớp sóng BC in Flexo chịu lực cao tiêu chuẩn xuất khẩu",
    shortDescription: "Bao bì thùng carton 5 lớp sóng đôi BC chuyên dụng cho nhà máy điện tử, may mặc và đồ gỗ đóng container xuất khẩu.",
    description: "Sản xuất từ nguồn giấy chất lượng cao nhập khẩu và nội địa. Dây chuyền sóng tự động khổ 2.2m năng suất cao, in Flexo sắc nét từ 1 đến 4 màu. Đảm bảo khả năng chịu lực nén đỉnh cao, bảo vệ an toàn hàng hóa khi vận chuyển đường dài hoặc xếp chồng 4-5 tầng trong kho.",
    categoryId: "bao-bi-dong-goi",
    categoryName: "Bao bì & Đóng gói",
    phaseId: "4.1",
    suitableBuyer: "Giám đốc Chuỗi cung ứng, Quản lý Kho vận & Logistics của các nhà máy sản xuất xuất khẩu.",
    useCase: "Đóng gói sản phẩm linh kiện, thành phẩm xuất khẩu đường biển, bảo vệ hàng hóa chống ẩm và móp méo va đập.",

    specifications: {
      cartonLayers: "5 lớp gồm: 2 lớp mặt, 2 lớp sóng B và C, 1 lớp đáy phẳng ở giữa",
      paperGrammage: "Mặt ngoài giấy Kraf vàng nâu K175, sóng M125/M125, mặt trong K150",
      burstStrength: "Độ bục > 13.5 kg/cm²; Khả năng chịu nén mép ECT > 6.0 kN/m",
      printingTech: "In Flexo tự động 1 - 4 màu; Mực in gốc nước an toàn theo chuẩn RoHS",
      waterproof: "Có tùy chọn cán màng mờ hoặc phủ vecni chống thấm nước bề mặt",
      palletLoad: "Cho phép xếp chồng 5 tầng trên pallet tiêu chuẩn tải trọng 800 - 1.200 kg",
      recyclability: "100% tái chế sinh học, đạt tiêu chuẩn bảo vệ môi trường FSC"
    },

    moq: 1000,
    moqUnit: "thùng",
    minOrder: 1000,
    maxOrder: 100000,
    leadTimeMin: 7,
    leadTimeMax: 12,
    leadTimeUnit: "ngày làm việc",

    sampleAvailable: true,
    sampleLeadTime: "2 - 3 ngày làm việc (Cắt mẫu trắng test kích thước lọt lòng)",
    surveyAvailable: true,
    surveyTerms: "Hỗ trợ kỹ thuật đến đo đạc trực tiếp kích thước thùng hàng tại kho Buyer",

    serviceAreas: ["Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Long An", "Tiền Giang", "Tây Ninh"],
    industrialParkCoverage: [
      "KCN VSIP 1, 2, 2A & 3",
      "KCN Sóng Thần 1, 2 & 3",
      "KCN Mỹ Phước 1, 2, 3",
      "KCN Tân Đông Hiệp",
      "KCN Amata Đồng Nai"
    ],
    deliveryLeadTime: "Đội xe tải giao hàng định kỳ 2 chuyến/ngày tới các KCN Bình Dương & Đồng Nai",

    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80"
    ],

    evidence: [
      {
        id: "ev-ps-5",
        type: "CERTIFICATION",
        title: "Chứng chỉ Kiểm định Kiểm nghiệm Độ Bục Thùng Carton Quatest 3",
        source: "Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng 3 (QUATEST 3)",
        certNumber: "QT3-2024-CARTON",
        status: "CONFIRMED",
        issuedAt: "2024",
        expiresAt: "2027",
        checkedAt: "19/09/2026"
      }
    ],

    confirmationChecklist: {
      verified: [
        { label: "Độ chịu bục > 13.5 kg/cm²", note: "Đã có phiếu thử nghiệm Quatest 3" },
        { label: "Năng lực giao xe tải 5 tấn & 10 tấn", note: "Đội xe 8 chiếc giao hằng ngày" }
      ],
      needsConfirmation: [
        { 
          label: "Khả năng lưu kho đệm tại xưởng cho Buyer nhận hàng chia nhỏ theo tuần", 
          note: "Cần thỏa thuận diện tích pallet lưu kho khi ký hợp đồng nguyên tắc", 
          status: "THỎA THUẬN KHO ĐỆM KHI KÝ HỢP ĐỒNG" 
        }
      ]
    },

    availabilityStatus: "AVAILABLE",
    availabilityCheckedAt: "25/09/2026",
    status: "ACTIVE",
    publishable: true,
    updatedAt: "20/09/2026",
    publishedAt: "01/01/2026"
  }
];

// Helper: Dynamically find or generate a structured ProductService entity
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
