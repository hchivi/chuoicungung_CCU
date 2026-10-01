// ============================================================================
// MASTER FACTORIES & MANUFACTURING ECOSYSTEM DATA ENGINE
// PAGE 28: ROUTE /nha-may & /admin/nha-may
// TUÂN THỦ TOÀN DIỆN SPEC 28.TXT - CHUOICUNGUNG.COM
// ============================================================================

import factoriesFullList from './factoriesFull.json' with { type: 'json' };
import { getAllOrganizations } from './organizationsData.js';
import { getAllMasterRequirements } from './requirementsData.js';
import { getAllPrograms, TARGET_ROLES_ENUM } from './programsData.js';
import { resolveCanonicalKcnId } from './industrialParksData.js';

// ----------------------------------------------------------------------------
// 1. FACTORY PROFILE SCHEMA (SECTION 2, 3 SPEC 28.TXT)
// QUY TẮC CỐT LÕI: MỘT FACTORY = MỘT ORGANIZATION MASTER
// Không tạo 2 company record riêng cho cùng một nhà máy khi họ vừa mua vừa bán
// ----------------------------------------------------------------------------

export const FACTORY_PROFILE_STATUS_ENUM = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
  INCOMPLETE: 'INCOMPLETE',
  ARCHIVED: 'ARCHIVED'
};

export const PRODUCT_DATA_STATUS_ENUM = {
  SELF_DECLARED: 'SELF_DECLARED',
  REVIEWED: 'REVIEWED',
  NEEDS_UPDATE: 'NEEDS_UPDATE'
};

// Seed specialized Factory Profiles linking to existing Organizations
// MỘT DOANH NGHIỆP CÓ THỂ CÓ NHIỀU NHÀ MÁY / PHÂN XƯỞNG (SECTION 2, 32 SPEC 29.TXT)
const SEED_FACTORY_PROFILES = [
  {
    id: 'FP-ORG-PROSER-001',
    organizationId: 'ORG-PROSER-001',
    facilityCode: 'FAC-PROSER-01',
    factorySlug: 'chuyen-gia-dong-phuc-proser',
    factoryName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser - Phân Xưởng May Hiệp Phước',
    industrialParkId: 'khu-cong-nghiep-hiep-phuoc-ho-chi-minh',
    industrialParkName: 'Khu Công Nghiệp Hiệp Phước',
    province: 'TP. Hồ Chí Minh',
    industryCategories: ['May mặc & Bảo hộ lao động', 'Vật tư phòng sạch Cleanroom', 'Dệt may kỹ thuật'],
    productionDescription: 'Tổ hợp 2 phân xưởng may công nghiệp khép kín với 180 máy may điện tử tự động, dây chuyền may 2 kim và phòng đo kiểm kháng tĩnh điện ESD đạt chuẩn quốc tế phục vụ các nhà máy FDI công nghệ cao.',
    outputProductsSummary: [
      'Đồng phục công nhân vải kaki 65/35 chống xù lông',
      'Áo thun polo quà tặng doanh nghiệp công nghệ thấm hút Dri-fit',
      'Quần áo liền thân phòng sạch Cleanroom ESD Class 1000'
    ],
    outputProducts: [
      {
        id: 'PROD-PROSER-01',
        name: 'Đồng phục công nhân vải Kaki 65/35 chống xù lông',
        slug: 'dong-phuc-cong-nhan-kaki-65-35',
        category: 'Đồng phục bảo hộ lao động',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Vải Kaki 65/35 may 2 kim bền chắc, phối dải phản quang 3M, túi hộp tiện dụng',
        useCase: 'Nhà xưởng cơ khí, điện tử, sản xuất linh kiện, kho vận logistics',
        orderCondition: 'May đo hoặc may theo bảng size chuẩn S-4XL',
        minOrderQuantity: 'Từ 100 bộ'
      },
      {
        id: 'PROD-PROSER-02',
        name: 'Áo thun polo quà tặng doanh nghiệp công nghệ Dri-fit',
        slug: 'ao-thun-polo-doanh-nghiep-dri-fit',
        category: 'Áo thun sự kiện & Văn phòng',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Thun cá sấu poly thái dệt tổ ong thấm hút mồ hôi, co giãn 4 chiều kháng khuẩn',
        useCase: 'Đồng phục nhân viên văn phòng, sự kiện tri ân, hội nghị khách hàng KCN',
        orderCondition: 'In thêu logo vi tính sắc nét độ phân giải cao',
        minOrderQuantity: 'Từ 50 áo'
      },
      {
        id: 'PROD-PROSER-03',
        name: 'Quần áo liền thân phòng sạch Cleanroom ESD Class 1000',
        slug: 'quan-ao-phong-sach-cleanroom-esd',
        category: 'Vật tư phòng sạch Cleanroom',
        image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Vải phòng sạch dệt sợi carbon dẫn điện sọc 5mm, điện trở bề mặt 10^6 - 10^8 Ohm',
        useCase: 'Nhà máy sản xuất vi mạch, lắp ráp điện thoại, dược phẩm, thiết bị y tế',
        orderCondition: 'Đóng gói tiệt trùng buồng áp lực dương trước khi xuất xưởng',
        minOrderQuantity: 'Từ 100 bộ'
      }
    ],
    capabilitiesDetail: {
      processCapabilities: [
        'Cắt vải tự động dao rung CNC Paragon',
        'May công nghiệp 2 kim tự động Juki',
        'Thêu vi tính 20 đầu Tajima công nghệ Nhật Bản',
        'In ép nhiệt Pet chuyển nhiệt cao tần không bong tróc',
        'Đo điện trở bề mặt phòng sạch ESD S20.20',
        'Đóng gói hút chân không buồng áp lực dương'
      ],
      equipmentList: [
        { name: '180 Máy may điện tử tự động Juki DDL-9000C', origin: 'Nhật Bản', year: '2023', status: 'Hoạt động 100%' },
        { name: 'Máy cắt vải tự động Gerber Paragon HX', origin: 'Mỹ', year: '2024', status: 'Hoạt động 100%' },
        { name: 'Dàn máy thêu vi tính Tajima TFMX-IIC20', origin: 'Nhật Bản', year: '2022', status: 'Hoạt động 100%' },
        { name: 'Máy đo điện trở bề mặt ESD Trek 152', origin: 'Mỹ', year: '2023', status: 'Đã kiểm định Quatest 3' }
      ],
      capacity: {
        value: '65.000 bộ / tháng',
        unit: 'bộ/tháng',
        scope: 'Tổng công suất 2 phân xưởng may',
        source: 'Doanh nghiệp cung cấp',
        updatedAt: '2026-09-20',
        visibility: 'PUBLIC'
      },
      minOrderQuantity: 'Từ 100 bộ / đơn hàng',
      leadTime: '7 - 12 ngày làm việc',
      qualityStandards: [
        'Hệ thống quản lý chất lượng ISO 9001:2015',
        'Hệ thống quản lý môi trường ISO 14001:2015',
        'Tiêu chuẩn an toàn dệt may sinh thái OEKO-TEX Standard 100',
        'Tiêu chuẩn phòng sạch kiểm soát tĩnh điện ESD S20.20'
      ]
    },
    facilityInfo: {
      landArea: '12.500 m²',
      productionArea: '8.200 m²',
      warehouseArea: '3.000 m²',
      productionLinesCount: 6,
      cleanroomClass: 'Class 10.000 (ISO 7)',
      powerCapacity: 'Trạm biến áp riêng 1.500 kVA',
      wasteTreatment: 'Hệ thống xử lý nước thải đạt QCVN 40:2011/BTNMT Cột A'
    },
    manufacturingTypes: ['OEM', 'ODM', 'Gia công theo đơn đặt hàng'],
    oemAvailable: true,
    odmAvailable: true,
    oemDetails: [
      'Gia công nhãn riêng (Private Label) may theo mẫu đối tác cung cấp',
      'Sản xuất theo thiết kế và bản vẽ kỹ thuật chi tiết của khách hàng (OEM)',
      'Tư vấn chọn vải, dựng rập số 3D và may mẫu đối chứng miễn phí (ODM)'
    ],
    exportAvailable: true,
    exportInfo: {
      markets: ['Nhật Bản', 'Hàn Quốc', 'Châu Âu (EU)', 'Bắc Mỹ'],
      certificates: ['CO Form AK (Hàn Quốc)', 'CO Form AJ (Nhật Bản)', 'CO Form EUR.1 (EU)', 'WRAP Gold Certificate'],
      incoterms: ['FOB Cát Lái', 'CIF', 'EXW Hiệp Phước'],
      languages: ['Tiếng Việt', 'English', '日本語']
    },
    distributionAvailable: true,
    distributionInfo: {
      channels: ['Cung ứng trực tiếp KCN & Doanh nghiệp FDI', 'Đại lý phân phối cấp tỉnh', 'Kênh thương mại B2B'],
      seekingDistributors: true,
      seekingDistributorsNote: 'Đang tìm kiếm đại lý phân phối đồ bảo hộ và thiết bị phòng sạch tại Bắc Ninh, Hải Phòng, Thái Nguyên'
    },
    serviceAreas: [
      'Toàn quốc',
      'Đông Nam Bộ (TP.HCM, Đồng Nai, Bình Dương, Long An, Bà Rịa - Vũng Tàu)',
      'Khu vực phía Bắc (Hà Nội, Bắc Ninh, Hải Phòng, Thái Nguyên)'
    ],
    evidences: [
      { id: 'EV-PROSER-01', title: 'Toàn cảnh phân xưởng may tự động KCN Hiệp Phước', type: 'FACTORY_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60', source: 'Doanh nghiệp cung cấp', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-09-20' },
      { id: 'EV-PROSER-02', title: 'Dây chuyền đo kiểm điện trở bề mặt ESD Class 1000', type: 'EQUIPMENT_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60', source: 'Doanh nghiệp cung cấp', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-09-20' },
      { id: 'EV-PROSER-03', title: 'Chứng chỉ Hệ thống Quản lý Chất lượng ISO 9001:2015', type: 'CERTIFICATE', fileUrl: '/certificates/iso-9001-proser.pdf', source: 'Tổ chức chứng nhận TUV Rheinland', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-08-15' },
      { id: 'EV-PROSER-04', title: 'Chứng nhận an toàn dệt may sinh thái OEKO-TEX Standard 100', type: 'CERTIFICATE', fileUrl: '/certificates/oeko-tex-proser.pdf', source: 'Viện kiểm định TESTEX Thụy Sĩ', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-07-10' },
      { id: 'EV-PROSER-05', title: 'Báo cáo kiểm định phòng sạch ESD S20.20 Quatest 3', type: 'TEST_REPORT', fileUrl: '/reports/quatest3-proser.pdf', source: 'Trung tâm Đo lường Quatest 3', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-09-01' }
    ],
    mediaAssets: [
      { id: 'MEDIA-PROSER-01', type: 'VIDEO', title: 'Phim tài liệu giới thiệu năng lực sản xuất nhà máy Proser', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '3:45', producer: 'CHUOICUNGUNG.COM Media' }
    ],
    catalogues: [
      { id: 'CAT-PROSER-2026', title: 'Catalogue Đồng Phục Doanh Nghiệp & Thiết Bị Phòng Sạch 2026', coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=60', fileUrl: '/files/catalogue-proser-2026.pdf', fileSize: '8.5 MB', pages: 36, updatedAt: '2026-09-15' }
    ],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: true,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-28'
  },
  {
    id: 'FP-PROSER-BD-002',
    organizationId: 'ORG-PROSER-001',
    facilityCode: 'FAC-PROSER-02',
    factorySlug: 'xuong-in-theu-ky-thuat-so-proser-binh-duong',
    factoryName: 'Công ty TNHH Chuyên Gia Đồng Phục Proser - Xưởng In Thêu VSIP 1',
    industrialParkId: 'khu-cong-nghiep-vsip-1-binh-duong',
    industrialParkName: 'Khu Công Nghiệp VSIP 1',
    province: 'Bình Dương',
    industryCategories: ['In ấn bao bì & Thêu vi tính công nghệ cao'],
    productionDescription: 'Xưởng in thêu kỹ thuật số vệ tinh chuyên xử lý in ép nhiệt cao tần, thêu logo vi tính tự động và hoàn thiện đóng gói cho các đơn hàng khu vực Bình Dương, Đồng Nai.',
    outputProductsSummary: [
      'Dịch vụ in Pet chuyển nhiệt độ nét 4K trên vải',
      'Thêu vi tính 3D chỉ kim tuyến công nghiệp'
    ],
    outputProducts: [
      {
        id: 'PROD-PROSER-BD-01',
        name: 'Gia công in ép nhiệt Pet chuyển nhiệt cao tần',
        slug: 'in-pet-chuyen-nhiet-cao-tan',
        category: 'Gia công in ấn dệt may',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Mực in gốc nước bảo vệ môi trường, chịu giặt trên 100 lần không nứt vỡ',
        useCase: 'In logo thương hiệu trên áo thun, bảo hộ, balo, túi vải canvas',
        orderCondition: 'Nhận file vector AI / Corel / PDF',
        minOrderQuantity: 'Từ 100 hình in'
      }
    ],
    capabilitiesDetail: {
      processCapabilities: ['In kỹ thuật số khổ lớn', 'Ép nhiệt khí nén tự động', 'Thêu vi tính 12 đầu'],
      equipmentList: [
        { name: 'Máy in Pet chuyển nhiệt 4 đầu phun Epson i3200', origin: 'Nhật Bản', year: '2024', status: 'Hoạt động 100%' },
        { name: 'Máy ép nhiệt thủy lực 2 mâm tự động', origin: 'Đài Loan', year: '2023', status: 'Hoạt động 100%' }
      ],
      capacity: { value: '40.000 hình in / tháng', unit: 'sản phẩm/tháng', source: 'Doanh nghiệp cung cấp', updatedAt: '2026-09-15', visibility: 'PUBLIC' },
      minOrderQuantity: 'Từ 100 sản phẩm',
      leadTime: '3 - 5 ngày làm việc',
      qualityStandards: ['ISO 9001:2015', 'OEKO-TEX ECO PASSPORT']
    },
    facilityInfo: {
      landArea: '3.500 m²',
      productionArea: '2.200 m²',
      warehouseArea: '800 m²',
      productionLinesCount: 2,
      cleanroomClass: 'Tiêu chuẩn xưởng sạch',
      powerCapacity: '500 kVA',
      wasteTreatment: 'Hệ thống thu gom nước thải xưởng in tuần hoàn'
    },
    manufacturingTypes: ['Gia công in thêu chuyên sâu'],
    oemAvailable: true,
    odmAvailable: false,
    exportAvailable: false,
    distributionAvailable: true,
    serviceAreas: ['Bình Dương', 'TP. Hồ Chí Minh', 'Đồng Nai'],
    evidences: [
      { id: 'EV-PROSER-BD-01', title: 'Máy in kỹ thuật số khổ lớn xưởng VSIP 1', type: 'EQUIPMENT_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60', source: 'Doanh nghiệp cung cấp', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-09-15' }
    ],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: true,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-25'
  },
  {
    id: 'FP-ORG-TAHOMART-002',
    organizationId: 'ORG-TAHOMART-002',
    facilityCode: 'FAC-TAHOMART-01',
    factorySlug: 'tap-doan-tahomart-viet-nam',
    factoryName: 'Tập đoàn TAHOMART Việt Nam - Phân Xưởng Đóng Gói Hà Nội',
    industrialParkId: 'khu-cong-nghiep-quang-minh-ha-noi',
    industrialParkName: 'Khu Công Nghiệp Quang Minh',
    province: 'Hà Nội',
    industryCategories: ['Chế biến nông sản & Đóng gói màng co', 'Quà tặng & Phúc lợi doanh nghiệp'],
    productionDescription: 'Dây chuyền bọc màng co nhiệt tự động khổ 9:16 và sấy thăng hoa trái cây nhiệt đới phục vụ các khu công nghiệp phía Bắc.',
    outputProductsSummary: [
      'Giỏ quà tết công nhân đóng màng co nhiệt 9:16',
      'Mít sấy giòn Nam Huy đóng gói túi nhôm 200g',
      'Hộp quà tri ân đối tác chuỗi cung ứng'
    ],
    outputProducts: [
      {
        id: 'PROD-TAHO-01',
        name: 'Giỏ quà tết công nhân viên bọc màng co nhiệt khổ 9:16',
        slug: 'gio-qua-tet-cong-nhan-mang-co',
        category: 'Quà tặng phúc lợi công nhân',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Màng co nhiệt POF trong suốt, bảo vệ sản phẩm chống bụi ẩm, bố cục giỏ sang trọng',
        useCase: 'Quà tết công đoàn KCN, phúc lợi nhân viên cuối năm, quà tri ân đối tác',
        orderCondition: 'Tùy biến thành phần bánh mứt hạt theo ngân sách từ 250k - 1tr',
        minOrderQuantity: 'Từ 50 giỏ'
      }
    ],
    capabilitiesDetail: {
      processCapabilities: ['Đóng gói màng co nhiệt tự động', 'Hút chân không túi nhôm', 'Sấy thăng hoa trái cây'],
      equipmentList: [
        { name: 'Máy bọc màng co nhiệt tự động tốc độ cao L-Bar Sealer', origin: 'Hàn Quốc', year: '2023', status: 'Hoạt động 100%' }
      ],
      capacity: { value: '80.000 giỏ quà / tháng', unit: 'giỏ/tháng', source: 'Doanh nghiệp cung cấp', updatedAt: '2026-09-10', visibility: 'PUBLIC' },
      minOrderQuantity: 'Từ 50 phần',
      leadTime: '5 - 10 ngày',
      qualityStandards: ['ISO 22000:2018', 'HACCP Codex Alimentarius']
    },
    facilityInfo: {
      landArea: '8.000 m²',
      productionArea: '5.500 m²',
      warehouseArea: '2.500 m²',
      productionLinesCount: 4,
      cleanroomClass: 'Phòng sạch thực phẩm Class 100.000',
      powerCapacity: '1.000 kVA',
      wasteTreatment: 'Hệ thống thu gom rác thải hữu cơ theo quy chuẩn'
    },
    manufacturingTypes: ['Gia công đóng gói', 'Phân phối sỉ'],
    oemAvailable: true,
    odmAvailable: true,
    exportAvailable: false,
    distributionAvailable: true,
    serviceAreas: ['Toàn quốc', 'Miền Bắc (Hà Nội, Bắc Ninh, Hưng Yên, Hải Phòng, Vĩnh Phúc)'],
    evidences: [
      { id: 'EV-TAHO-01', title: 'Dây chuyền bọc màng co nhiệt tự động phân xưởng Hà Nội', type: 'FACTORY_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60', source: 'Doanh nghiệp cung cấp', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-09-10' },
      { id: 'EV-TAHO-02', title: 'Chứng nhận Hệ thống An toàn Thực phẩm ISO 22000:2018', type: 'CERTIFICATE', fileUrl: '/certificates/iso-22000-tahomart.pdf', source: 'Tổ chức BVC', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-08-01' }
    ],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: true,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-27'
  },
  {
    id: 'FP-TAHOMART-HY-003',
    organizationId: 'ORG-TAHOMART-002',
    facilityCode: 'FAC-TAHOMART-02',
    factorySlug: 'tahomart-kho-lanh-nong-san-hung-yen',
    factoryName: 'Tập đoàn TAHOMART Việt Nam - Tổng Kho Lạnh & Sơ Chế Hưng Yên',
    industrialParkId: 'khu-cong-nghiep-pho-noi-a-hung-yen',
    industrialParkName: 'Khu Công Nghiệp Phố Nối A',
    province: 'Hưng Yên',
    industryCategories: ['Kho lạnh bảo quản & Sơ chế nông sản'],
    productionDescription: 'Hệ thống kho lạnh bảo quản nông sản nhiệt độ âm sâu -18°C đến 5°C và phân xưởng phân loại sấy khô tự động.',
    outputProductsSummary: ['Nông sản sấy khô đóng túi hút chân không', 'Dịch vụ lưu kho lạnh nông sản'],
    outputProducts: [],
    manufacturingTypes: ['Kho vận lạnh & Sơ chế'],
    oemAvailable: false,
    exportAvailable: false,
    distributionAvailable: true,
    serviceAreas: ['Hưng Yên', 'Hà Nội', 'Hải Dương', 'Hải Phòng'],
    evidences: [],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: true,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-24'
  },
  {
    id: 'FP-SAMSUNG-BN-001',
    organizationId: 'ORG-SAMSUNG-BN',
    facilityCode: 'FAC-SEV-BN',
    factorySlug: 'samsung-electronics-vietnam-bac-ninh',
    factoryName: 'Công ty TNHH Samsung Electronics Việt Nam (SEV Bắc Ninh)',
    industrialParkId: 'khu-cong-nghiep-yen-phong-bac-ninh',
    industrialParkName: 'Khu Công Nghiệp Yên Phong',
    province: 'Bắc Ninh',
    industryCategories: ['Điện tử & Bán dẫn', 'Thiết bị viễn thông di động'],
    productionDescription: 'Tổ hợp nhà máy sản xuất điện thoại thông minh và linh kiện viễn thông quy mô hàng đầu thế giới với hơn 40.000 kỹ sư và công nhân vận hành.',
    outputProductsSummary: [
      'Điện thoại thông minh Galaxy dòng cao cấp',
      'Màn hình hiển thị AMOLED công nghệ cao',
      'Pin lithium-ion & Bản mạch in linh hoạt FPCB'
    ],
    outputProducts: [
      {
        id: 'PROD-SS-01',
        name: 'Điện thoại thông minh Galaxy cao cấp sản xuất tại Bắc Ninh',
        slug: 'samsung-galaxy-flagship-bac-ninh',
        category: 'Thiết bị viễn thông di động',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Màn hình Dynamic AMOLED 2X, chip xử lý tiến trình 4nm, tiêu chuẩn chống nước IP68',
        useCase: 'Xuất khẩu toàn cầu và phân phối chính hãng',
        orderCondition: 'Kênh phân phối chính thức tập đoàn Samsung',
        minOrderQuantity: 'Theo hợp đồng xuất khẩu'
      }
    ],
    capabilitiesDetail: {
      processCapabilities: ['Gắn chip bề mặt SMT siêu chính xác', 'Lắp ráp mô-đun màn hình AMOLED', 'Kiểm tra tín hiệu RF 5G phòng câm', 'Kiểm tra độ bền rơi thả tự động'],
      equipmentList: [
        { name: 'Hơn 120 dây chuyền SMT công nghệ cao', origin: 'Hàn Quốc / Nhật Bản', year: '2023', status: 'Hoạt động 100%' }
      ],
      capacity: { value: '10.000.000 thiết bị / tháng', unit: 'chiếc/tháng', source: 'Báo cáo thường niên tập đoàn', updatedAt: '2026-06-30', visibility: 'PUBLIC' },
      qualityStandards: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'Tiêu chuẩn bảo mật thông tin ISO 27001']
    },
    facilityInfo: {
      landArea: '110.000 m²',
      productionArea: '85.000 m²',
      warehouseArea: '25.000 m²',
      cleanroomClass: 'Class 100 - Class 1000'
    },
    manufacturingTypes: ['FDI Công nghệ cao', 'Xuất khẩu toàn cầu'],
    oemAvailable: false,
    exportAvailable: true,
    exportInfo: {
      markets: ['Bắc Mỹ', 'Châu Âu', 'Hàn Quốc', 'Toàn cầu'],
      certificates: ['CE', 'FCC', 'KC', 'RoHS Compliant'],
      incoterms: ['FOB Nội Bài', 'CIF Hải Phòng'],
      languages: ['Tiếng Việt', 'English', '한국어']
    },
    distributionAvailable: false,
    serviceAreas: ['Toàn cầu'],
    evidences: [
      { id: 'EV-SS-01', title: 'Tổ hợp nhà máy SEV KCN Yên Phong Bắc Ninh', type: 'FACTORY_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60', source: 'Thông cáo báo chí tập đoàn', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-06-30' }
    ],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: false,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-28'
  },
  {
    id: 'FP-SAMSUNG-TN-002',
    organizationId: 'ORG-SAMSUNG-BN',
    facilityCode: 'FAC-SEVT-TN',
    factorySlug: 'samsung-electronics-vietnam-thai-nguyen',
    factoryName: 'Công ty TNHH Samsung Electronics Việt Nam Thái Nguyên (SEVT)',
    industrialParkId: 'khu-cong-nghiep-yen-binh-thai-nguyen',
    industrialParkName: 'Khu Công Nghiệp Yên Bình',
    province: 'Thái Nguyên',
    industryCategories: ['Điện tử & Viễn thông'],
    productionDescription: 'Tổ hợp nhà máy sản xuất điện thoại thông minh lớn nhất thế giới của Samsung với tổng vốn đầu tư hàng tỷ USD.',
    outputProductsSummary: ['Lắp ráp điện thoại thông minh Galaxy', 'Khung vỏ kim loại nguyên khối'],
    outputProducts: [],
    manufacturingTypes: ['FDI Công nghệ cao', 'Xuất khẩu toàn cầu'],
    oemAvailable: false,
    exportAvailable: true,
    distributionAvailable: false,
    serviceAreas: ['Toàn cầu'],
    evidences: [],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: false,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-26'
  },
  {
    id: 'FP-SAMSUNG-HCM-003',
    organizationId: 'ORG-SAMSUNG-BN',
    facilityCode: 'FAC-SEHC-HCM',
    factorySlug: 'samsung-hcmc-ce-complex',
    factoryName: 'Công ty TNHH Điện Tử Samsung HCMC CE Complex (SEHC)',
    industrialParkId: 'khu-cong-nghe-cao-tp-hcm-shtp',
    industrialParkName: 'Khu Công Nghệ Cao TP.HCM (SHTP)',
    province: 'TP. Hồ Chí Minh',
    industryCategories: ['Điện tử tiêu dùng & Thiết bị gia dụng thông minh'],
    productionDescription: 'Nhà máy sản xuất TV màn hình lớn và thiết bị điện tử gia dụng cao cấp hàng đầu khu vực Đông Nam Á.',
    outputProductsSummary: ['Tivi QLED / Neo QLED thông minh', 'Tủ lạnh Bespoke công nghệ cao', 'Máy giặt cửa trước AI Control'],
    outputProducts: [],
    manufacturingTypes: ['FDI Công nghệ cao'],
    oemAvailable: false,
    exportAvailable: true,
    distributionAvailable: false,
    serviceAreas: ['Toàn cầu'],
    evidences: [],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: false,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-25'
  },
  {
    id: 'FP-DENSO-HN-001',
    organizationId: 'ORG-DENSO-VN',
    facilityCode: 'FAC-DENSO-01',
    factorySlug: 'cong-ty-tnhh-denso-viet-nam',
    factoryName: 'Công ty TNHH DENSO Việt Nam - Nhà Máy Thăng Long',
    industrialParkId: 'khu-cong-nghiep-thang-long-ha-noi',
    industrialParkName: 'Khu Công Nghiệp Thăng Long',
    province: 'Hà Nội',
    industryCategories: ['Cơ khí ô tô & Phụ trợ chính xác'],
    productionDescription: 'Nhà máy sản xuất linh kiện phụ tùng ô tô và xe máy hàng đầu thế giới (bộ biến tần, van tiết lưu, cảm biến vị trí).',
    outputProductsSummary: [
      'Bộ điều khiển bướm ga điện tử',
      'Van tuần hoàn khí thải EGR',
      'Cảm biến oxy & Cảm biến áp suất đường ống nạp'
    ],
    outputProducts: [
      {
        id: 'PROD-DENSO-01',
        name: 'Van tuần hoàn khí thải EGR ô tô chính xác cao',
        slug: 'van-tuan-hoan-khi-thai-egr-denso',
        category: 'Linh kiện ô tô chính xác',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=60',
        shortSpecification: 'Độ chịu nhiệt lên tới 600°C, kiểm soát dòng khí thải tuần hoàn đạt tiêu chuẩn Euro 6',
        useCase: 'Lắp ráp động cơ ô tô Toyota, Honda, Mitsubishi',
        orderCondition: 'Cung cấp theo kế hoạch đặt hàng Tier-1 OEM',
        minOrderQuantity: 'Theo hợp đồng dây chuyền'
      }
    ],
    capabilitiesDetail: {
      processCapabilities: ['Đúc nhôm áp lực cao', 'Gia công CNC 5 trục độ chính xác sub-micron', 'Lắp ráp phòng sạch tự động', 'Kiểm tra rò rỉ khí áp suất cao'],
      capacity: { value: '500.000 linh kiện / tháng', unit: 'linh kiện/tháng', source: 'Doanh nghiệp cung cấp', updatedAt: '2026-08-30', visibility: 'PUBLIC' },
      qualityStandards: ['IATF 16949:2016', 'ISO 14001:2015', 'ISO 45001:2018']
    },
    facilityInfo: {
      landArea: '60.000 m²',
      productionArea: '40.000 m²',
      warehouseArea: '15.000 m²'
    },
    manufacturingTypes: ['Tier-1 OEM Ô tô', 'Xuất khẩu linh kiện'],
    oemAvailable: true,
    exportAvailable: true,
    distributionAvailable: false,
    serviceAreas: ['Toàn quốc', 'Xuất khẩu Nhật Bản, Thái Lan, Indonesia'],
    evidences: [
      { id: 'EV-DENSO-01', title: 'Phân xưởng gia công chính xác DENSO KCN Thăng Long', type: 'FACTORY_PHOTO', fileUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=60', source: 'Doanh nghiệp cung cấp', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-08-30' },
      { id: 'EV-DENSO-02', title: 'Chứng nhận Hệ thống Quản lý Ngành Ô tô IATF 16949:2016', type: 'CERTIFICATE', fileUrl: '/certificates/iatf-16949-denso.pdf', source: 'Tổ chức DNV', status: 'ĐÃ ĐỐI CHIẾU', updatedAt: '2026-07-20' }
    ],
    productDataStatus: PRODUCT_DATA_STATUS_ENUM.REVIEWED,
    hasSupplierRole: true,
    publicProfileStatus: FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: '2026-09-26'
  }
];

// In-memory profiles, connection requests & audit logs
let inMemoryFactoryProfiles = [...SEED_FACTORY_PROFILES];
let inMemoryFactoryAuditLogs = [];
let inMemoryFactoryConnectionRequests = [];

/**
 * Ghi nhận Audit Log cho Nhà máy (Section 14 QA)
 */
export function logFactoryAudit(entry) {
  const logItem = {
    id: `FAUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor: entry.actor || 'System Coordinator',
    factoryId: entry.factoryId || 'SYSTEM',
    action: entry.action,
    entityType: entry.entityType || 'FACTORY_PROFILE',
    entityId: entry.entityId,
    details: entry.details,
    previousState: entry.previousState || null,
    newState: entry.newState || null
  };
  inMemoryFactoryAuditLogs.unshift(logItem);
  return logItem;
}

export function getAllFactoryAuditLogs(factoryId = null) {
  if (factoryId) {
    return inMemoryFactoryAuditLogs.filter(l => l.factoryId === factoryId);
  }
  return inMemoryFactoryAuditLogs;
}

/**
 * Gửi yêu cầu kết nối tới Nhà máy (Section 34, 35 Spec 29.txt)
 * Tuyệt đối không để lộ SĐT / Zalo cá nhân của đại diện nhà máy trên giao diện
 */
export function submitFactoryConnectionRequest(requestData, actor = 'Anonymous Buyer/Partner') {
  const connId = `CONN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const connectionItem = {
    id: connId,
    timestamp: new Date().toISOString(),
    factoryId: requestData.factoryId,
    factoryName: requestData.factoryName,
    organizationId: requestData.organizationId,
    targetType: requestData.targetType || 'SUPPLIER_CAPABILITY',
    requirementId: requestData.requirementId || null,
    requirementTitle: requestData.requirementTitle || null,
    message: requestData.message || '',
    senderName: requestData.senderName || 'Đại diện doanh nghiệp',
    senderCompany: requestData.senderCompany || 'Doanh nghiệp tìm nguồn cung',
    senderEmail: requestData.senderEmail || '',
    senderPhone: requestData.senderPhone || '',
    status: 'PENDING_COORDINATION',
    owner: 'Bàn Điều Phối CCU (Page 19 Unified Pipeline)',
    nextAction: 'Xác minh hồ sơ nhu cầu & thông báo đại diện nhà máy',
    nextActionAt: new Date(Date.now() + 86400000).toISOString()
  };

  inMemoryFactoryConnectionRequests.unshift(connectionItem);

  // Ghi AuditLog (Section 18 QA)
  logFactoryAudit({
    action: 'CREATE_FACTORY_CONNECTION_REQUEST',
    factoryId: requestData.factoryId,
    entityType: 'CONNECTION_REQUEST',
    entityId: connId,
    actor: actor || requestData.senderName,
    details: `Đối tác [${requestData.senderCompany || requestData.senderName}] gửi yêu cầu kết nối tới nhà máy [${requestData.factoryName}]. Chủ đề: ${requestData.requirementTitle || requestData.targetType}`
  });

  return {
    success: true,
    connectionId: connId,
    message: 'Yêu cầu kết nối đã được gửi đến Bàn Điều Phối CCU để xác minh và chuyển giao an toàn tới nhà máy.'
  };
}

export function getAllFactoryConnectionRequests(factoryId = null) {
  if (factoryId) {
    return inMemoryFactoryConnectionRequests.filter(r => r.factoryId === factoryId);
  }
  return inMemoryFactoryConnectionRequests;
}

/**
 * Lấy danh sách các nhà máy khác cùng một Doanh nghiệp sở hữu (Section 2, 32 Spec 29.txt)
 */
export function getSiblingFactories(organizationId, currentFactoryId) {
  if (!organizationId) return [];
  return inMemoryFactoryProfiles
    .filter(p => p.organizationId === organizationId && p.id !== currentFactoryId && p.factorySlug !== currentFactoryId)
    .map(p => ({
      id: p.id,
      slug: p.factorySlug,
      name: p.factoryName,
      industrialParkName: p.industrialParkName,
      province: p.province,
      productionDescription: p.productionDescription,
      hasSupplierRole: p.hasSupplierRole
    }));
}

// ----------------------------------------------------------------------------
// 2. HELPER: BỔ TRỢ HỆ SINH THÁI NHÀ MÁY (BUY SIDE & SELL SIDE)
// TUÂN THỦ SECTION 5, 8, 9, 10, 11, 12, 13 SPEC 28.TXT & SPEC 29.TXT
// ----------------------------------------------------------------------------

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

/**
 * Kiểm tra xem Factory có nhu cầu mua hàng công khai hay không (Section 10)
 * QUY TẮC BẢO MẬT: Chỉ tính Requirement dạng PUBLIC_SUMMARY, lọc bỏ mọi dữ liệu kín (Section 9, 38)
 */
export function getPublicRequirementsForFactory(factoryId, organizationId = null) {
  const allReqs = getAllMasterRequirements();
  return allReqs.filter(r => {
    if (r.moderationStatus === 'REJECTED' || r.status === 'CLOSED') return false;
    // Kiểm tra match theo buyerOrganizationId hoặc factoryId
    const isOwner = (organizationId && r.buyerOrganizationId === organizationId) || 
                    (r.factoryId === factoryId);
    return isOwner && (r.isPublicSummary === true || r.visibility === 'PUBLIC_SUMMARY');
  }).map(req => {
    // Sanitization: Ensure NO private fields (buyer phone, email, internal budget, target price) are exposed
    return {
      id: req.id,
      publicCode: req.publicCode || req.id,
      title: req.title,
      category: req.category,
      categorySlug: req.categorySlug,
      productService: req.productService,
      quantity: req.allowPublicQuantity ? req.quantity : null,
      unit: req.allowPublicQuantity ? req.unit : null,
      province: req.province,
      location: req.location,
      industrialPark: req.allowPublicIndustrialPark ? req.industrialPark : null,
      deadline: req.deadline,
      publicSummary: req.publicSummary,
      publicRequirements: req.publicRequirements || [],
      status: req.status,
      visibility: req.visibility,
      isPublicSummary: true,
      publishedAt: req.publishedAt,
      responseDeadline: req.responseDeadline,
      buyerSummary: req.buyerInfo?.buyerSummary,
      allowPublicCompanyName: req.buyerInfo?.allowPublicCompanyName !== false
    };
  });
}

/**
 * Lấy các sự kiện dành cho Nhà máy (Section 20)
 * Lọc theo targetRole: BUYER hoặc FACTORY
 */
export function getProgramsForFactory(factory = null) {
  const allProgs = getAllPrograms();
  return allProgs.filter(p => {
    const roles = p.targetRoles || [];
    const isTarget = roles.includes(TARGET_ROLES_ENUM.BUYER) || 
                     roles.includes('FACTORY') || 
                     roles.includes(TARGET_ROLES_ENUM.SUPPLIER);
    if (!isTarget) return false;

    if (factory && factory.province) {
      const pLoc = (p.location || '').toLowerCase();
      const matchLoc = pLoc.includes(factory.province.toLowerCase());
      return matchLoc || p.industrialParkId === factory.industrialParkId;
    }
    return true;
  });
}

/**
 * Chuyển đổi một bản ghi raw factory thành Entity Hệ Sinh Thái đầy đủ
 */
export function enrichFactoryEntity(raw) {
  const id = raw.id || `fac-${raw.no || 0}`;
  const rawSlug = raw.slug || slugify(raw.name) || id;

  // Tìm FactoryProfile nếu đã được đăng ký quản lý
  const profile = inMemoryFactoryProfiles.find(p => 
    p.factorySlug === rawSlug || p.id === id || (raw.organizationId && p.organizationId === raw.organizationId) || (raw.factorySlug && p.factorySlug === raw.factorySlug)
  );

  const slug = profile?.factorySlug || raw.slug || rawSlug;

  // Tìm Organization gốc nếu có (Section 2, 32 Spec 29.txt)
  const allOrgs = getAllOrganizations();
  const matchedOrg = allOrgs.find(o => 
    o.id === raw.organizationId || (profile?.organizationId && o.id === profile.organizationId) || o.name?.toLowerCase() === raw.name?.toLowerCase()
  );

  const orgId = matchedOrg ? matchedOrg.id : (profile?.organizationId || raw.organizationId || `ORG-${slug.slice(0, 16).toUpperCase()}`);
  
  const kcnSourceId = raw.kcnId || profile?.industrialParkId;
  const canonicalKcnId = kcnSourceId ? resolveCanonicalKcnId(kcnSourceId) : null;
  const kcnName = raw.kcnName || profile?.industrialParkName || null;

  // Xác định multi-roles: Nhà máy, Cung ứng, Mua hàng (Section 1, 2)
  const isSupplierRole = Boolean(matchedOrg?.roles?.includes('SUPPLIER') || profile?.hasSupplierRole);
  const publicNeeds = getPublicRequirementsForFactory(id, orgId);
  const hasPublicNeeds = publicNeeds.length > 0;

  // Sản phẩm đầu ra
  const outputProductsDetailed = profile?.outputProducts || [];
  const outputProductsSummary = profile?.outputProductsSummary || (raw.industry ? [`Sản phẩm thuộc ngành ${raw.industry}`] : []);

  const orgRoles = matchedOrg?.roles || ['FACTORY'];
  const finalRoles = Array.from(new Set([
    'FACTORY',
    ...orgRoles.filter(r => r === 'SUPPLIER' || r === 'BUYER' || r === 'FACTORY'),
    ...(hasPublicNeeds ? ['BUYER'] : []),
    ...(isSupplierRole ? ['SUPPLIER'] : [])
  ]));

  // Doanh nghiệp chủ quản (Organization Parent - Section 32, 33)
  const ownerOrganization = matchedOrg ? {
    id: matchedOrg.id,
    name: matchedOrg.name,
    legalName: matchedOrg.legalName || matchedOrg.name,
    taxCode: matchedOrg.taxCode || '0314567890',
    website: matchedOrg.website || null,
    logo: matchedOrg.logo || null,
    province: matchedOrg.province,
    address: matchedOrg.address,
    orgType: matchedOrg.orgType || 'Doanh nghiệp sản xuất',
    isClaimed: matchedOrg.isClaimed === true,
    roles: matchedOrg.roles || ['FACTORY']
  } : {
    id: orgId,
    name: raw.name,
    legalName: raw.name,
    taxCode: '0310000000',
    website: null,
    logo: null,
    province: raw.province || 'Đồng Nai',
    address: raw.address || raw.name,
    orgType: 'Doanh nghiệp sản xuất',
    isClaimed: false,
    roles: ['FACTORY']
  };

  // Danh sách nhà máy anh em cùng doanh nghiệp (Section 2, 32)
  const siblingFactories = getSiblingFactories(orgId, id);

  return {
    id,
    slug,
    name: raw.name,
    organizationId: orgId,
    ownerOrganization,
    siblingFactories,
    facilityCode: profile?.facilityCode || `FAC-${id}`,
    no: raw.no || 1,
    hasProfile: Boolean(profile),
    profileId: profile?.id || null,
    industry: raw.industry || profile?.industryCategories?.[0] || 'Chế biến chế tạo & Phụ trợ công nghiệp',
    type: raw.type || 'FDI',
    province: raw.province || profile?.province || 'Đồng Nai',
    region: raw.region || 'Miền Nam',
    address: raw.address || profile?.province || raw.name,
    foundedYear: raw.foundedYear || '2015',
    status: raw.status || 'Đang hoạt động',
    rating: raw.rating || '4.8',
    isVerified: raw.isVerified !== false,
    
    // KCN relation (Section 14: chỉ dùng relation đã xác thực)
    industrialParkId: canonicalKcnId,
    industrialParkName: kcnName,
    isKcnConfirmed: Boolean(canonicalKcnId),

    // Multi-role flags (Section 1, 2, 8)
    roles: finalRoles,
    hasPublicNeeds,
    publicNeedsCount: publicNeeds.length,
    publicNeedsList: publicNeeds,

    hasSupplierCapability: isSupplierRole,
    supplierCapabilities: matchedOrg?.capabilities || [
      'Gia công cơ khí chính xác theo bản vẽ',
      'Dây chuyền lắp ráp công nghiệp đạt tiêu chuẩn ISO 9001'
    ],

    // Output Products & Capabilities (Section 16, 19, 20, 21)
    outputProducts: outputProductsSummary,
    outputProductsDetailed,
    capabilitiesDetail: profile?.capabilitiesDetail || {
      processCapabilities: matchedOrg?.capabilities || ['Gia công / Sản xuất trực tiếp theo đơn'],
      equipmentList: [],
      capacity: { value: 'Theo đơn đặt hàng B2B', source: 'Doanh nghiệp cung cấp', updatedAt: '2026-09-20', visibility: 'PUBLIC' },
      qualityStandards: ['ISO 9001:2015']
    },
    facilityInfo: profile?.facilityInfo || {
      landArea: raw.type === 'FDI' ? '25.000 m²' : '8.000 m²',
      productionArea: raw.type === 'FDI' ? '18.000 m²' : '5.000 m²',
      warehouseArea: '2.500 m²',
      productionLinesCount: 4
    },
    productionDescription: profile?.productionDescription || (raw.industry ? `Nhà máy hoạt động trong lĩnh vực ${raw.industry} tại ${raw.province}.` : ''),
    productDataStatus: profile?.productDataStatus || PRODUCT_DATA_STATUS_ENUM.SELF_DECLARED,
    manufacturingTypes: profile?.manufacturingTypes || ['Gia công / Sản xuất trực tiếp'],
    oemAvailable: profile?.oemAvailable !== undefined ? profile.oemAvailable : (raw.type === 'FDI' || isSupplierRole),
    odmAvailable: profile?.odmAvailable || false,
    oemDetails: profile?.oemDetails || (profile?.oemAvailable ? ['Gia công OEM theo bản vẽ kỹ thuật'] : []),
    exportAvailable: profile?.exportAvailable !== undefined ? profile.exportAvailable : (raw.type === 'FDI'),
    exportInfo: profile?.exportInfo || {
      markets: profile?.exportAvailable ? ['Đông Nam Á (ASEAN)'] : [],
      certificates: [],
      incoterms: ['FOB', 'EXW'],
      languages: ['Tiếng Việt', 'English']
    },
    distributionAvailable: profile?.distributionAvailable !== undefined ? profile.distributionAvailable : true,
    distributionInfo: profile?.distributionInfo || {
      channels: ['Cung ứng trực tiếp B2B'],
      seekingDistributors: false
    },
    serviceAreas: profile?.serviceAreas || [raw.province || 'Toàn quốc'],
    evidences: profile?.evidences || [],
    mediaAssets: profile?.mediaAssets || [],
    catalogues: profile?.catalogues || [],

    // Public Profile metadata
    publicProfileStatus: profile?.publicProfileStatus || FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: profile?.updatedAt || '2026-09-28',
    ownerUserId: matchedOrg?.ownerUserId || null
  };
}

// ----------------------------------------------------------------------------
// 3. SEARCH & MULTI-FACET FILTER ENGINE (SECTION 6, 7, 36)
// ----------------------------------------------------------------------------

export function getFactoriesListing(options = {}) {
  const {
    query = '',
    industry = 'all',
    province = 'all',
    industrialParkId = 'all',
    hasPublicRequirements = false,
    hasSupplierCapability = false,
    hasOutputProducts = false,
    hasActivePrograms = false,
    oemAvailable = false,
    exportAvailable = false,
    page = 1,
    pageSize = 18,
    sortBy = 'relevance' // 'relevance' | 'name-asc' | 'year-desc' | 'needs-desc'
  } = options;

  // 1. Tạo các entities từ inMemoryFactoryProfiles (Hồ sơ nhà máy đã được chuẩn hóa)
  const seedEntities = inMemoryFactoryProfiles.map(p => {
    return enrichFactoryEntity({
      id: p.id,
      name: p.factoryName,
      organizationId: p.organizationId,
      industry: p.industryCategories?.[0] || 'Sản xuất công nghiệp phụ trợ',
      province: p.province,
      address: p.province,
      type: p.manufacturingTypes?.[0] || 'Doanh nghiệp sản xuất',
      status: 'Đang hoạt động',
      foundedYear: '2015',
      kcnId: p.industrialParkId,
      kcnName: p.industrialParkName
    });
  });

  // 2. Lấy dữ liệu nền tảng từ factoriesFull
  const rawList = factoriesFullList.slice(0, 500).map(f => enrichFactoryEntity(f));

  // Ghép và loại bỏ duplicate theo organizationId hoặc slug
  const seenOrgIds = new Set(seedEntities.map(s => s.organizationId));
  const seenSlugs = new Set(seedEntities.map(s => s.slug));

  const filteredRaw = rawList.filter(f => !seenOrgIds.has(f.organizationId) && !seenSlugs.has(f.slug));

  let allEnriched = [...seedEntities, ...filteredRaw];

  // Bổ sung các Organization có role FACTORY nếu chưa có trong danh bạ
  const orgs = getAllOrganizations();
  orgs.filter(o => o.roles?.includes('FACTORY')).forEach(org => {
    const exists = allEnriched.some(e => e.organizationId === org.id);
    if (!exists) {
      allEnriched.push(enrichFactoryEntity({
        id: `fac-${org.id.toLowerCase()}`,
        name: org.name,
        organizationId: org.id,
        industry: org.capabilities?.[0] || 'Sản xuất công nghiệp phụ trợ',
        province: org.province || 'Hồ Chí Minh',
        address: org.address,
        type: 'Kinh tế tư nhân',
        status: 'Đang hoạt động',
        foundedYear: '2016'
      }));
    }
  });

  let results = allEnriched;

  // 1. Search Query (Section 6)
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    const cleanQ = slugify(q);

    results = results.filter(f => {
      const matchName = f.name.toLowerCase().includes(q);
      const matchInd = f.industry.toLowerCase().includes(q);
      const matchKcn = f.industrialParkName && f.industrialParkName.toLowerCase().includes(q);
      const matchLoc = f.province.toLowerCase().includes(q) || f.address.toLowerCase().includes(q);
      const matchProd = f.outputProducts.some(p => p.toLowerCase().includes(q));
      const matchCap = f.supplierCapabilities.some(c => c.toLowerCase().includes(q));

      return matchName || matchInd || matchKcn || matchLoc || matchProd || matchCap;
    });
  }

  // 2. Filter theo Ngành sản xuất (Section 7, 15)
  if (industry && industry !== 'all') {
    const indClean = industry.toLowerCase();
    results = results.filter(f => f.industry.toLowerCase().includes(indClean));
  }

  // 3. Filter theo Tỉnh / Thành phố (Section 7, 19)
  if (province && province !== 'all') {
    const provClean = province.toLowerCase();
    results = results.filter(f => f.province.toLowerCase().includes(provClean));
  }

  // 4. Filter theo KCN (Section 7, 14, 18 - Query confirmed KCN relation)
  if (industrialParkId && industrialParkId !== 'all') {
    const canonicalKcn = resolveCanonicalKcnId(industrialParkId);
    results = results.filter(f => f.industrialParkId === canonicalKcn);
  }

  // 5. Quick Role Chips & Capabilities (Section 7, 8)
  if (hasPublicRequirements) {
    results = results.filter(f => f.hasPublicNeeds);
  }
  if (hasSupplierCapability) {
    results = results.filter(f => f.hasSupplierCapability);
  }
  if (hasOutputProducts) {
    results = results.filter(f => f.outputProducts && f.outputProducts.length > 0);
  }
  if (oemAvailable) {
    results = results.filter(f => f.oemAvailable);
  }
  if (exportAvailable) {
    results = results.filter(f => f.exportAvailable);
  }

  // 6. Sorting: Organic relevance + profile completeness (Section 36)
  // Không ưu tiên Sponsor hay Paid service trong organic search
  if (sortBy === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'year-desc') {
    results.sort((a, b) => parseInt(b.foundedYear || 0, 10) - parseInt(a.foundedYear || 0, 10));
  } else if (sortBy === 'needs-desc') {
    results.sort((a, b) => b.publicNeedsCount - a.publicNeedsCount);
  } else {
    // Default relevance: Profile completeness (Spec 36) + Có nhu cầu public + có KCN relation + có năng lực cung ứng
    results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      if (a.hasProfile) scoreA += 100;
      if (b.hasProfile) scoreB += 100;
      if (a.hasPublicNeeds) scoreA += 50;
      if (b.hasPublicNeeds) scoreB += 50;
      if (a.isKcnConfirmed) scoreA += 30;
      if (b.isKcnConfirmed) scoreB += 30;
      if (a.hasSupplierCapability) scoreA += 20;
      if (b.hasSupplierCapability) scoreB += 20;
      return scoreB - scoreA;
    });
  }

  const total = results.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = results.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

/**
 * Lấy chi tiết một Nhà máy theo ID hoặc Slug
 */
export function getFactoryByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const cleanTerm = slugify(idOrSlug);

  // 1. Tìm trong seed profiles
  const profile = inMemoryFactoryProfiles.find(p => 
    p.factorySlug === cleanTerm || p.id === idOrSlug || p.organizationId === idOrSlug
  );
  if (profile) {
    const rawFac = factoriesFullList.find(f => slugify(f.name) === profile.factorySlug) || {
      id: profile.id,
      name: profile.factoryName,
      organizationId: profile.organizationId,
      province: profile.province,
      kcnId: profile.industrialParkId,
      kcnName: profile.industrialParkName,
      industry: profile.industryCategories?.[0]
    };
    rawFac.organizationId = profile.organizationId;
    return enrichFactoryEntity(rawFac);
  }

  // 2. Tìm trong master JSON
  const found = factoriesFullList.find(f => 
    f.id === idOrSlug || 
    slugify(f.name) === cleanTerm || 
    String(f.no) === String(idOrSlug)
  );

  if (found) {
    return enrichFactoryEntity(found);
  }

  // Fallback lấy item đầu tiên
  return enrichFactoryEntity(factoriesFullList[0]);
}

/**
 * Cập nhật hồ sơ Nhà máy từ Admin (Section 38, 39)
 */
export function updateFactoryProfileAdmin(factoryId, updateData, reviewer = 'Admin') {
  const existingIdx = inMemoryFactoryProfiles.findIndex(p => p.id === factoryId || p.organizationId === factoryId);

  const updatedProfile = {
    ...(existingIdx >= 0 ? inMemoryFactoryProfiles[existingIdx] : {}),
    id: factoryId.startsWith('FP-') ? factoryId : `FP-${factoryId}`,
    organizationId: updateData.organizationId || factoryId,
    factoryName: updateData.factoryName || updateData.name,
    factorySlug: slugify(updateData.factoryName || updateData.name || factoryId),
    industrialParkId: updateData.industrialParkId,
    industryCategories: updateData.industryCategories || [updateData.industry],
    productionDescription: updateData.productionDescription,
    outputProductsSummary: updateData.outputProductsSummary || [],
    oemAvailable: updateData.oemAvailable === true,
    exportAvailable: updateData.exportAvailable === true,
    distributionAvailable: updateData.distributionAvailable === true,
    publicProfileStatus: updateData.publicProfileStatus || FACTORY_PROFILE_STATUS_ENUM.PUBLISHED,
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  if (existingIdx >= 0) {
    inMemoryFactoryProfiles[existingIdx] = updatedProfile;
  } else {
    inMemoryFactoryProfiles.unshift(updatedProfile);
  }

  // Ghi AuditLog
  logFactoryAudit({
    action: existingIdx >= 0 ? 'UPDATE_FACTORY_PROFILE' : 'CREATE_FACTORY_PROFILE',
    factoryId: updatedProfile.id,
    entityType: 'FACTORY_PROFILE',
    entityId: updatedProfile.id,
    actor: reviewer,
    details: `Admin cập nhật hồ sơ nhà máy [${updatedProfile.factoryName}]. Trạng thái: ${updatedProfile.publicProfileStatus}`
  });

  return updatedProfile;
}

/**
 * Kiểm soát chất lượng dữ liệu nhà máy (Section 41)
 */
export function checkFactoryDataQuality(factory) {
  const warnings = [];
  if (!factory.isKcnConfirmed) {
    warnings.push('Chưa xác thực quan hệ KCN (IndustrialParkFactory relation pending)');
  }
  if (!factory.industry || factory.industry.length < 3) {
    warnings.push('Thiếu thông tin ngành sản xuất chi tiết');
  }
  if (!factory.outputProducts || factory.outputProducts.length === 0) {
    warnings.push('Chưa công bố sản phẩm đầu ra chính');
  }
  if (factory.hasSupplierCapability && (!factory.supplierCapabilities || factory.supplierCapabilities.length === 0)) {
    warnings.push('Hồ sơ năng lực nhà cung ứng (SupplierProfile) chưa đầy đủ');
  }

  return {
    isQualified: warnings.length === 0,
    warningsCount: warnings.length,
    warnings
  };
}
