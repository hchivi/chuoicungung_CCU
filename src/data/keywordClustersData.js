// Keyword Clusters, Buyer Intents & Dynamic Filter Schemas
// Standardized according to CHUOICUNGUNG.COM Specification 09.txt

import { slugify, CURATED_CATEGORIES, getCategoryHubBySlug } from './categoryHubData';
import enterprisesFullList from './enterprisesFull.json' with { type: 'json' };
import { STRATEGIC_FOUNDING_PARTNERS } from './strategicFoundingPartners.js';
import { getActiveEligiblePartnership } from './foundingPartnershipData.js';
import { PROGRAMS_DATA } from './programsData.js';
import { SEEDED_PRODUCT_SERVICES } from './productServicesData.js';

export { slugify };

// Master Curated Keyword Clusters (Primary Canonical Buyer Intents)
export const CURATED_KEYWORD_CLUSTERS = [
  {
    id: "cluster-solar-rooftop",
    slug: "dien-mat-troi-ap-mai-1mwp",
    name: "Điện Mặt Trời Áp Mái Cho Nhà Máy (Rooftop Solar 1MWp+)",
    synonyms: [
      "dien-mat-troi-nha-xuong",
      "solar-rooftop-nha-may",
      "dien-mat-troi-ap-mai-cong-nghiep",
      "dien-mat-troi-1mwp",
      "epc-dien-mat-troi-mai-nha"
    ],
    categoryId: "cat-nang-luong-dien-mat-troi",
    categorySlug: "dien-mat-troi-nang-luong-tai-tao",
    categoryName: "Năng Lượng Tái Tạo & Điện Mặt Trời Mái Nhà",
    stageId: 6,
    stageName: "Mở rộng – Tối ưu – Chuyển đổi",
    phaseId: "6.3",
    phaseName: "6.3 Chuyển đổi số & Tự động hóa",
    buyerIntent: "Tìm nhà thầu tổng thầu EPC triển khai hệ thống điện mặt trời áp mái nhà xưởng có công suất từ 500kWp đến 2MWp, khảo sát kết cấu mái, thẩm định PCCC và hỗ trợ mô hình PPA đầu tư 0 đồng.",
    shortDescription: "Giải pháp lắp đặt hệ thống điện mặt trời áp mái nhà xưởng công nghiệp, trạm biến áp hòa lưới và chứng chỉ năng lượng tái tạo I-REC đạt chuẩn ESG xuất khẩu.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1400&q=85",
    seoTitle: "Điện Mặt Trời Áp Mái Cho Nhà Máy 1MWp+ | Tìm Tổng Thầu EPC | CHUOICUNGUNG.COM",
    seoDescription: "Tìm nhà thầu EPC điện mặt trời áp mái nhà máy KCN, khảo sát kết cấu, thẩm định PCCC và mô hình PPA 0 đồng. Gửi nhu cầu để SUPPI làm rõ và kết nối nguồn uy tín.",
    
    // Dynamic Filter Schema configured specifically for Solar
    filterSchema: [
      {
        id: "capacity",
        label: "Công suất dự kiến",
        type: "select",
        options: [
          { value: "all", label: "Tất cả công suất" },
          { value: "sub-500", label: "Dưới 500 kWp (Mái xưởng nhỏ)" },
          { value: "500-1000", label: "500 kWp - 1 MWp (Quy mô vừa)" },
          { value: "above-1000", label: "Trên 1 MWp - 3 MWp (Đại quy mô)" }
        ]
      },
      {
        id: "model",
        label: "Mô hình đầu tư",
        type: "select",
        options: [
          { value: "all", label: "Tất cả mô hình" },
          { value: "self-invest", label: "Doanh nghiệp tự đầu tư (Tiết kiệm 100%)" },
          { value: "ppa-zero", label: "Hợp đồng PPA Quỹ đầu tư 0 đồng (Mua điện giá rẻ)" }
        ]
      },
      {
        id: "roofArea",
        label: "Diện tích mái khả dụng",
        type: "select",
        options: [
          { value: "all", label: "Tất cả diện tích mái" },
          { value: "small", label: "3.000m² - 5.000m²" },
          { value: "medium", label: "5.000m² - 10.000m²" },
          { value: "large", label: "Trên 10.000m²" }
        ]
      }
    ],

    // Buyer Guide Schema
    buyerGuide: {
      title: "TRƯỚC KHI TÌM NGUỒN EPC ĐIỆN MẶT TRỜI, DOANH NGHIỆP CẦN CHUẨN BỊ:",
      items: [
        { label: "1. Diện tích mái & Hiện trạng kết cấu khung kèo", desc: "Bản vẽ hoàn công kết cấu xưởng, loại mái tôn (Seamlock / Kliplok) và tải trọng dư cho phép (tối thiểu 15-20 kg/m²)." },
        { label: "2. Hóa đơn tiền điện & Công suất trạm biến áp", desc: "Hóa đơn tiền điện 12 tháng gần nhất, biểu đồ phụ tải giờ cao điểm / thấp điểm và dung lượng trạm biến áp hiện hữu (kVA)." },
        { label: "3. Hồ sơ an toàn PCCC cơ sở", desc: "Biên bản nghiệm thu PCCC hiện tại của nhà máy để làm hồ sơ bổ sung an toàn hệ thống pin theo quy chuẩn mới." },
        { label: "4. Định hướng mô hình tài chính", desc: "Xác định rõ tự bỏ vốn CAPEX hay cần kết nối Quỹ đầu tư mô hình PPA không cần bỏ vốn." }
      ]
    },

    // Curated Sourcing Dossier
    sourcingDossier: {
      id: "dos-solar-01",
      title: "Bộ Hồ Sơ Đề Xuất Nguồn Cung EPC Điện Mặt Trời KCN 2026",
      isPublic: true,
      updatedAt: "2026-09-15",
      purpose: "Đánh giá và đề xuất danh sách ngắn (shortlist) 5 nhà thầu EPC đạt chuẩn thiết kế, có chứng chỉ Tier 1 và kinh nghiệm trên 10MWp tại KCN miền Nam.",
      selectionCriteria: [
        "Đã thi công tối thiểu 3 dự án nhà máy FDI quy mô > 1MWp",
        "Có kỹ sư PCCC và kết cấu độc lập chứng chỉ hành nghề hạng 1",
        "Bảo hành hiệu suất pin 25 năm từ các hãng Bloomberg Tier 1",
        "Hỗ trợ thủ tục thỏa thuận đấu nối với EVN địa phương"
      ],
      selectedSuppliers: [
        "Công ty Cổ phần Năng Lượng Xanh Bách Khoa",
        "Tổng thầu EPC Solar KCN Miền Nam"
      ],
      missingInfoPrompt: "Cần xác nhận lại thỏa thuận đấu nối với Điện lực địa phương đối với các dự án trên 1MWp."
    },

    // FAQs
    faqs: [
      {
        q: "Doanh nghiệp không có vốn đầu tư có lắp được điện mặt trời không?",
        a: "Hoàn toàn được. Mô hình PPA (Power Purchase Agreement) cho phép các quỹ năng lượng quốc tế tài trợ 100% chi phí lắp đặt, doanh nghiệp chỉ cần cung cấp mái xưởng và mua lại điện với giá chiết khấu rẻ hơn EVN từ 10% - 25%."
      },
      {
        q: "Lắp đặt điện mặt trời có phải xin lại giấy phép PCCC không?",
        a: "Có. Mọi công trình điện mặt trời áp mái nhà xưởng công nghiệp đều phải lập hồ sơ thẩm duyệt hoặc nghiệm thu an toàn PCCC bổ sung theo Thông tư của Bộ Công An trước khi hòa lưới."
      },
      {
        q: "SUPPI có thể hỗ trợ thẩm định báo giá EPC như thế nào?",
        a: "SUPPI sẽ đối soát báo giá của nhà thầu về thông số tấm pin (Watt-peak), Inverter (hãng và hiệu suất chuyển đổi), chi phí khung giàn nhôm kẹp và các điều khoản bảo hành để tránh phát sinh chi phí."
      }
    ],

    // Video
    video: {
      title: "Quy Trình Khảo Sát Thẩm Định Kết Cấu Mái Lắp Pin Solar Nhà Xưởng",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "04:15"
    },

    // Catalogues
    catalogues: [
      { id: "catl-sol-1", title: "Cẩm Nang Thẩm Định PCCC & Đấu Nối Điện Mặt Trời KCN 2026", size: "11.2 MB", format: "PDF", pages: 32 }
    ]
  },
  {
    id: "cluster-dong-phuc-cong-nhan",
    slug: "dong-phuc-cong-nhan",
    name: "Đồng Phục Công Nhân Nhà Máy & Quần Áo Phòng Sạch ESD",
    synonyms: [
      "dong-phuc-nha-may",
      "ao-thun-cong-nhan",
      "quan-ao-phong-sach",
      "ao-polo-cong-nhan",
      "may-dong-phuc-kcn"
    ],
    categoryId: "cat-dong-phuc-bao-ho",
    categorySlug: "dong-phuc-bao-ho",
    categoryName: "Đồng Phục & Bảo Hộ Lao Động (PPE)",
    stageId: 5,
    stageName: "Nhân sự & Hậu cần",
    phaseId: "5.3",
    phaseName: "5.3 Đồng phục & Bảo hộ (PPE)",
    buyerIntent: "Tìm xưởng may trực tiếp may áo thun polo, áo bảo hộ kaki công nhân nhà máy, áo choàng phòng sạch chống tĩnh điện với số lượng từ 100 đến 10.000 bộ.",
    shortDescription: "Xưởng may công nghiệp cung ứng đồng phục công nhân, áo polo thun co giãn 4 chiều kháng khuẩn, quần áo bảo hộ Kaki 65/35 may 3 kim bền chắc đạt chuẩn Oeko-Tex.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1400&q=85",
    seoTitle: "Đồng Phục Công Nhân Nhà Máy | Xưởng May Trực Tiếp Giá Sỉ | CHUOICUNGUNG.COM",
    seoDescription: "Tìm xưởng may đồng phục công nhân nhà máy, áo polo doanh nghiệp, đồ bảo hộ PPE đạt chuẩn ISO/Oeko-Tex theo năng lực, MOQ và tiến độ giao hàng trên toàn quốc.",
    
    filterSchema: [
      {
        id: "uniformType",
        label: "Loại đồng phục",
        type: "select",
        options: [
          { value: "all", label: "Tất cả chủng loại" },
          { value: "polo", label: "Áo thun Polo có cổ (Công nhân / Chuyền trưởng)" },
          { value: "kaki-ppe", label: "Bộ quần áo Kaki bảo hộ lao động" },
          { value: "cleanroom-esd", label: "Áo choàng / Quần áo phòng sạch tĩnh điện ESD" },
          { value: "vest-reflector", label: "Áo phản quang kỹ sư công trình" }
        ]
      },
      {
        id: "orderQuantity",
        label: "Số lượng dự kiến",
        type: "select",
        options: [
          { value: "all", label: "Tất cả quy mô" },
          { value: "small", label: "50 - 200 bộ (Đơn mẫu / Xưởng nhỏ)" },
          { value: "medium", label: "200 - 1.000 bộ (Nhà máy vừa)" },
          { value: "large", label: "Trên 1.000 - 10.000 bộ (Tập đoàn FDI)" }
        ]
      },
      {
        id: "samplePolicy",
        label: "Chính sách mẫu",
        type: "select",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "free-sample", label: "May mẫu miễn phí trước khi sản xuất" },
          { value: "fast-sample", label: "Cung cấp mẫu đối chứng trong 48h" }
        ]
      }
    ],

    buyerGuide: {
      title: "TRƯỚC KHI ĐẶT MAY ĐỒNG PHỤC CÔNG NHÂN, DOANH NGHIỆP CẦN CHUẨN BỊ:",
      items: [
        { label: "1. Số lượng theo size & Dự phòng nhân sự", desc: "Tổng hợp số lượng size S, M, L, XL, 2XL và cộng thêm 10% size phổ thông cho công nhân mới tuyển." },
        { label: "2. Môi trường nhiệt độ & Hoạt động thực tế", desc: "Xưởng cơ khí nhiệt cao cần Kaki cotton thấm hút; chuyền điện tử yêu cầu vải không xơ rụng và có dải sợi carbon ESD." },
        { label: "3. Yêu cầu in thêu logo nhận diện", desc: "File logo vector (.AI hoặc .EPS), vị trí in ngực trái, thêu vi tính sau lưng áo hoặc in phản quang ban đêm." },
        { label: "4. Mốc thời gian bàn giao & Cấp phát", desc: "Thời điểm khánh thành, bắt đầu năm làm việc mới hoặc đợt phát đồng phục định kỳ hàng năm." }
      ]
    },

    sourcingDossier: {
      id: "dos-uniform-01",
      title: "Danh Sách Xưởng May Đồng Phục KCN Đạt Chuẩn ISO & Oeko-Tex",
      isPublic: true,
      updatedAt: "2026-09-20",
      purpose: "Đề xuất các xưởng may công nghiệp có năng lực trên 30.000 áo/tháng, sở hữu máy may lập trình và chứng chỉ không chứa chất gây ung thư Formaldehyde.",
      selectionCriteria: [
        "Xưởng may trực tiếp sở hữu trên 50 máy may công nghiệp",
        "Có chứng nhận kiểm định vải Quatest 3 hoặc Oeko-Tex Standard 100",
        "Cam kết giao mẫu trong 3 ngày và bảo hành đường may 6 tháng"
      ],
      selectedSuppliers: [
        "Chuyên Gia Đồng Phục - Công Ty TNHH Proser",
        "Xưởng May Công Nghiệp Sài Gòn"
      ],
      missingInfoPrompt: "Cần xác nhận lại bảng màu vải thực tế dưới ánh sáng xưởng trước khi lên chuyền nhuộm hàng loạt."
    },

    faqs: [
      {
        q: "Nhà máy có được duyệt mẫu vải và size trước khi may hàng loạt không?",
        a: "Có. Các nhà cung ứng đạt chuẩn trên CHUOICUNGUNG.COM đều bắt buộc cung cấp bộ size mẫu (Fitting Sample) và áo mẫu chuẩn màu để Buyer ký duyệt đối chứng trước khi sản xuất đại trà."
      },
      {
        q: "Thời gian may 1.000 áo đồng phục công nhân thường mất bao lâu?",
        a: "Thời gian trung bình từ 7 - 10 ngày làm việc sau khi duyệt áo mẫu và đặt cọc. Với các đơn gấp phục vụ sự kiện, một số xưởng có dây chuyền Fast-Track có thể đáp ứng trong 4 - 5 ngày."
      },
      {
        q: "Nếu công nhân giặt bị phai màu hoặc xù lông thì xử lý thế nào?",
        a: "Hợp đồng theo chuẩn CCU quy định tỷ lệ độ bền màu cấp 4 trở lên. Nếu xảy ra lỗi bung chỉ, xù lông hay lem màu do vải trong 30 ngày, nhà cung ứng có nghĩa vụ may bù 1-1 miễn phí."
      }
    ],

    video: {
      title: "Tham Quan Dây Chuyền Thêu Vi Tính & May Lập Trình Đồng Phục Nhà Máy",
      embedUrl: "https://www.youtube.com/embed/OvvhcglmHzc",
      duration: "03:45"
    },

    catalogues: [
      { id: "catl-uni-1", title: "Bảng Màu Vải Kaki & Thun Cá Sấu Kháng Khuẩn 2026", size: "8.5 MB", format: "PDF", pages: 20 }
    ]
  },
  {
    id: "cluster-thung-carton-5-lop",
    slug: "thung-carton-5-lop",
    name: "Thùng Carton Sóng 5 Lớp Chịu Lực Xuất Khẩu",
    synonyms: [
      "thung-carton-dong-hang",
      "bao-bi-carton-5-lop",
      "thung-carton-song-bc",
      "thung-giay-carton",
      "hop-carton-cong-nghiep"
    ],
    categoryId: "cat-bao-bi-dong-goi",
    categorySlug: "bao-bi",
    categoryName: "Bao Bì & Đóng Gói Công Nghiệp",
    stageId: 4,
    stageName: "Vận hành Sản xuất",
    phaseId: "4.3",
    phaseName: "4.3 Giao nhận & Phân phối",
    buyerIntent: "Tìm nhà máy sản xuất thùng carton sóng 5 lớp (BC, AB) chịu nén cao, in flexo, đạt chuẩn xuất khẩu đi Mỹ và EU cho hàng điện tử, may mặc, nông sản.",
    shortDescription: "Bao bì thùng carton sóng 5 lớp chịu tải 20-50kg, độ nén BCT cao, giấy Kraft ngoại nhập gia keo chống ẩm, sản xuất tự động trên dây chuyền sóng 2.2m.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85",
    seoTitle: "Thùng Carton Sóng 5 Lớp Chịu Lực Xuất Khẩu | CHUOICUNGUNG.COM",
    seoDescription: "Tìm nhà máy sản xuất thùng carton sóng 5 lớp chịu lực cao, đạt chuẩn FSC và RoHS xuất khẩu. Báo giá trực tiếp theo kích thước và định lượng giấy.",
    
    filterSchema: [
      {
        id: "fluteType",
        label: "Loại sóng giấy",
        type: "select",
        options: [
          { value: "all", label: "Tất cả loại sóng" },
          { value: "flute-bc", label: "Sóng BC (Chịu lực đâm thủng & phân tán lực nén tốt nhất)" },
          { value: "flute-be", label: "Sóng BE (Mặt ngoài mịn đẹp, phù hợp in sắc nét)" },
          { value: "flute-b", label: "Sóng B (Độ dày 2.5 - 3.0mm, thùng chịu tải nhẹ)" }
        ]
      },
      {
        id: "paperQuality",
        label: "Chất lượng giấy mặt",
        type: "select",
        options: [
          { value: "all", label: "Tất cả chất lượng giấy" },
          { value: "kraft-import", label: "Kraft vàng nhập khẩu (Đài Loan / Thái Lan / Mỹ)" },
          { value: "kraft-vn", label: "Kraft nâu nội địa (Tiết kiệm chi phí đóng gói)" },
          { value: "white-top", label: "Giấy trắng mặt ngoài (In ấn thương hiệu cao cấp)" }
        ]
      }
    ],

    buyerGuide: {
      title: "TRƯỚC KHI ĐẶT SẢN XUẤT THÙNG CARTON 5 LỚP, BẠN CẦN CHUẨN BỊ:",
      items: [
        { label: "1. Kích thước phủ bì & Lọt lòng (DxRxC)", desc: "Xác định rõ kích thước bên trong thùng để vừa vặn sản phẩm và kích thước bên ngoài để tối ưu xếp pallet tiêu chuẩn (1.1m x 1.1m)." },
        { label: "2. Tải trọng chứa & Số tầng xếp chồng", desc: "Tổng trọng lượng hàng bên trong và số lớp thùng xếp chồng trong kho hoặc container (ảnh hưởng trực tiếp đến chỉ số nén BCT)." },
        { label: "3. Yêu cầu chống ẩm & Vận chuyển đường biển", desc: "Hàng xuất khẩu đường biển cần giấy sóng gia keo chống ẩm (Water-resistant) để không bị mềm mục khi qua vùng ẩm cao." },
        { label: "4. Ký hiệu cảnh báo an toàn & In ấn", desc: "Ký hiệu hàng dễ vỡ, hướng mở nắp, giới hạn xếp chồng và mã QR/Barcode nhận diện kho tự động." }
      ]
    },

    sourcingDossier: null,

    faqs: [
      {
        q: "MOQ tối thiểu cho đơn đặt làm thùng carton theo kích thước riêng là bao nhiêu?",
        a: "Với thùng chạy khuôn bế riêng hoặc in flexo, MOQ tối ưu thường từ 500 đến 1.000 thùng để bù trừ hao hụt dàn sóng và tiền làm bản in Polymer."
      },
      {
        q: "Làm thế nào để biết thùng carton có đủ khỏe để xếp chồng 5 lớp trong container?",
        a: "Nhà máy sẽ tính toán lực nén thùng BCT (Box Compression Test) và lực bục ECT dựa trên trọng lượng hàng để chỉ định định lượng giấy (GSM) phù hợp trước khi sản xuất."
      }
    ],

    video: null,

    catalogues: [
      { id: "catl-box-1", title: "Bảng Quy Chuẩn Tải Trọng Sóng & Kích Thước Pallet 2026", size: "7.1 MB", format: "PDF", pages: 16 }
    ]
  },
  {
    id: "cluster-cnc-jig-ga",
    slug: "gia-cong-chi-tiet-may-cnc",
    name: "Gia Công Chi Tiết Máy CNC Chính Xác & Chế Tạo Jig Gá",
    synonyms: [
      "chi-tiet-may-cnc",
      "jig-ga",
      "che-tao-do-ga",
      "gia-cong-cnc-5-truc",
      "co-khi-chinh-xac-cnc"
    ],
    categoryId: "cat-co-khi-chinh-xac",
    categorySlug: "co-khi",
    categoryName: "Cơ Khí Chính Xác & Khuôn Mẫu (CNC)",
    stageId: 3,
    stageName: "Lắp đặt & Hoàn thiện",
    phaseId: "3.1",
    phaseName: "3.1 Lắp đặt máy & Dây chuyền",
    buyerIntent: "Tìm xưởng cơ khí chính xác gia công linh kiện phụ tùng máy móc CNC, chế tạo đồ gá kiểm tra (Inspection Jig) và đồ gá lắp ráp dung sai dưới ±0.005mm.",
    shortDescription: "Gia công phay tiện CNC 3-4-5 trục, cắt dây EDM, nhiệt luyện và đo kiểm kích thước 3D trên máy CMM Mitutoyo kèm chứng nhận xuất xưởng CO/CQ.",
    status: "ACTIVE",
    publishable: true,
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    seoTitle: "Gia Công Chi Tiết Máy CNC & Jig Gá Chính Xác | CHUOICUNGUNG.COM",
    seoDescription: "Tìm xưởng gia công chi tiết máy CNC, đồ gá Jig lắp ráp dung sai ±0.005mm. Đo kiểm CMM, nhiệt luyện và xi mạ anode hoàn thiện theo bản vẽ kỹ thuật.",
    
    filterSchema: [
      {
        id: "machiningType",
        label: "Phương pháp gia công",
        type: "select",
        options: [
          { value: "all", label: "Tất cả phương pháp" },
          { value: "milling-5axis", label: "Phay CNC 4 - 5 trục (Chi tiết biên dạng phức tạp)" },
          { value: "turning-cnc", label: "Tiện CNC & Tiện phay kết hợp" },
          { value: "edm-wire", label: "Cắt dây Molipden / Đồng & Bắn điện EDM" },
          { value: "grinding", label: "Mài phẳng & Mài tròn chính xác cao" }
        ]
      },
      {
        id: "material",
        label: "Vật liệu gia công",
        type: "select",
        options: [
          { value: "all", label: "Tất cả vật liệu" },
          { value: "al-6061-7075", label: "Nhôm hợp kim (A6061, A7075)" },
          { value: "steel-skd-s50c", label: "Thép chế tạo & thép làm khuôn (S50C, SKD11, SCM440)" },
          { value: "inox-304-316", label: "Thép không gỉ Inox (SUS304, SUS316)" },
          { value: "plastic-pom", label: "Nhựa kỹ thuật (POM, Bakelite, MC Nylon, Teflon)" }
        ]
      }
    ],

    buyerGuide: {
      title: "TRƯỚC KHI GỬI YÊU CẦU BÁO GIÁ GIA CÔNG CNC, DOANH NGHIỆP CẦN:",
      items: [
        { label: "1. Bản vẽ 2D (PDF/DWG) & File 3D (STEP/IGES)", desc: "Bản vẽ 2D thể hiện đầy đủ dung sai kích thước quan trọng, độ nhám Ra và ren; file 3D để lập trình đường chạy dao CAM." },
        { label: "2. Vật liệu & Xử lý bề mặt cụ thể", desc: "Ghi rõ mác vật liệu và yêu cầu xử lý: Anode nhôm (cứng/màu), mạ crom, nhuộm đen hay tôi cứng nhiệt luyện đạt bao nhiêu HRC." },
        { label: "3. Số lượng sản xuất đợt 1 & Kế hoạch lặp lại", desc: "Gia công 1-2 bộ mẫu thử nghiệm hay gia công hàng loạt định kỳ hàng tháng (ảnh hưởng lớn đến chi phí gá đặt và dao cụ)." },
        { label: "4. Yêu cầu đo kiểm CMM & Báo cáo chất lượng", desc: "Phiếu đo kích thước chi tiết (FAIR report), giấy chứng nhận xuất xưởng nguyên vật liệu CO/CQ." }
      ]
    },

    sourcingDossier: null,

    faqs: [
      {
        q: "Xưởng có nhận gia công từ 1 - 2 chi tiết mẫu thử không?",
        a: "Có. Các xưởng cơ khí liên kết trên nền tảng đều có bộ phận Rapid Prototyping chuyên gia công mẫu đơn chiếc thử nghiệm trước khi Buyer chốt sản xuất hàng loạt."
      },
      {
        q: "Dung sai nhỏ nhất mà xưởng có thể đạt được là bao nhiêu?",
        a: "Với các máy phay Mazak, Makino và máy mài tọa độ, dung sai kích thước có thể đạt đến ±0.003mm đến ±0.005mm, kiểm soát hoàn toàn trên máy đo tọa độ không gian 3 chiều CMM."
      }
    ],

    video: null,
    catalogues: []
  }
];

export const KEYWORD_CLUSTERS = CURATED_KEYWORD_CLUSTERS;

// Helper: Resolve any slug into a canonical keyword cluster or dynamic synthesis
export function getKeywordClusterBySlug(slug, queryParam) {
  if (!slug) slug = '';
  const cleanSlug = slugify(slug);

  // 1. Direct match with curated cluster canonical slug
  let match = CURATED_KEYWORD_CLUSTERS.find(k => k.slug === cleanSlug);
  if (match) return match;

  // 2. Synonym match -> maps to canonical cluster
  match = CURATED_KEYWORD_CLUSTERS.find(k => k.synonyms && k.synonyms.includes(cleanSlug));
  if (match) return match;

  // 3. Fallback: Check if name matches
  const qClean = (queryParam || cleanSlug.replace(/-/g, ' ')).toLowerCase();
  match = CURATED_KEYWORD_CLUSTERS.find(k => k.name.toLowerCase().includes(qClean) || qClean.includes(k.slug.replace(/-/g, ' ')));
  if (match) return match;

  // 4. Dynamic synthesis for non-curated keywords (Guarantees NO 404, maps to appropriate category)
  const categoryInfo = getCategoryHubBySlug(cleanSlug, queryParam);
  const keywordName = queryParam || cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    id: `cluster-dyn-${cleanSlug}`,
    slug: cleanSlug,
    name: keywordName,
    synonyms: [],
    categoryId: categoryInfo.id,
    categorySlug: categoryInfo.slug,
    categoryName: categoryInfo.name,
    stageId: categoryInfo.stageId,
    stageName: categoryInfo.stageName,
    phaseId: categoryInfo.phaseId,
    phaseName: categoryInfo.phaseName,
    buyerIntent: `Tìm nhà sản xuất, xưởng gia công và đơn vị cung cấp ${keywordName} đạt chuẩn chất lượng B2B, có năng lực giao hàng theo cam kết.`,
    shortDescription: `Danh bạ tìm nguồn cung ứng ${keywordName} cho nhà máy sản xuất và dự án công nghiệp trên toàn quốc.`,
    status: "ACTIVE",
    publishable: true,
    bannerImage: categoryInfo.bannerImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85",
    seoTitle: `${keywordName} | Tìm Nhà Cung Ứng Chuẩn B2B | CHUOICUNGUNG.COM`,
    seoDescription: `Tìm nhà cung ứng cho ${keywordName} theo năng lực, địa bàn và điều kiện đáp ứng. Gửi nhu cầu để SUPPI hỗ trợ làm rõ và tìm nguồn phù hợp.`,
    filterSchema: [
      {
        id: "orderScale",
        label: "Quy mô nhu cầu",
        type: "select",
        options: [
          { value: "all", label: "Tất cả quy mô" },
          { value: "small", label: "Đơn mẫu thử nghiệm / Số lượng nhỏ" },
          { value: "medium", label: "Quy mô đơn hàng vừa" },
          { value: "large", label: "Cung ứng định kỳ quy mô lớn" }
        ]
      }
    ],
    buyerGuide: {
      title: `TRƯỚC KHI TÌM NGUỒN ${keywordName.toUpperCase()}, BẠN NÊN CHUẨN BỊ:`,
      items: [
        { label: "1. Quy cách & Thông số kỹ thuật", desc: `Mô tả cụ thể thông số kỹ thuật, dung sai hoặc tiêu chuẩn áp dụng cho ${keywordName}.` },
        { label: "2. Sản lượng đợt đầu & Kế hoạch tiêu thụ", desc: "Số lượng đơn hàng mẫu thử và dự kiến sản lượng hàng tháng/quý." },
        { label: "3. Địa bàn giao nhận & Tiến độ", desc: "Tỉnh thành hoặc KCN nhận hàng, thời hạn giao hàng đợt 1." }
      ]
    },
    sourcingDossier: null,
    faqs: [
      {
        q: `Làm thế nào để tìm được nhà cung ứng ${keywordName} uy tín?`,
        a: `Bạn có thể xem các doanh nghiệp có huy hiệu Xác minh B2B (Verified), kiểm tra hồ sơ năng lực và chứng chỉ trước khi gửi yêu cầu báo giá.`
      },
      {
        q: "SUPPI có thể hỗ trợ kết nối và bảo mật thông tin như thế nào?",
        a: "Hệ thống chỉ chuyển tiếp thông tin kỹ thuật của nhu cầu sau khi được Buyer phê duyệt, đảm bảo tuyệt đối không lộ giá hay thông tin nội bộ của doanh nghiệp."
      }
    ],
    video: null,
    catalogues: []
  };
}

// Helper: Query related Products/Services for this Keyword Cluster
export function getKeywordProducts(cluster) {
  if (!cluster) return [];
  const qLower = (cluster.name || cluster.slug || '').toLowerCase();
  const catSlug = slugify(cluster.categoryName || '');

  return SEEDED_PRODUCT_SERVICES.filter(p => {
    const titleLower = (p.title || '').toLowerCase();
    const pCatSlug = slugify(p.categoryName || '');
    return titleLower.includes(qLower) || qLower.includes(titleLower) || pCatSlug === catSlug;
  });
}

// Helper: Find Active Founding Partner for this Keyword Cluster
export function getKeywordFoundingPartner(cluster) {
  if (!cluster) return null;

  // 1. Query từ FoundingPartnershipService theo Spec 18 (Section 20)
  const activeFounding = getActiveEligiblePartnership({
    keywordClusterId: cluster.id,
    keyword: cluster.name || cluster.slug
  });
  if (activeFounding) return activeFounding;

  // 2. Fallback tìm theo STRATEGIC_FOUNDING_PARTNERS
  const qLower = (cluster.name || cluster.slug || '').toLowerCase();
  const phaseId = cluster.phaseId;

  return STRATEGIC_FOUNDING_PARTNERS.find(fp => {
    if (!fp.verified) return false;
    const matchesPhase = fp.phaseId === phaseId;
    const matchesKeyword = Array.isArray(fp.keywords) && fp.keywords.some(kw => qLower.includes(kw.toLowerCase()));
    return matchesPhase || matchesKeyword;
  }) || null;
}

// Helper: Find Related Programs for this Keyword Cluster
export function getKeywordPrograms(cluster) {
  if (!cluster) return [];
  const qLower = (cluster.name || cluster.categoryName || '').toLowerCase();

  return PROGRAMS_DATA.filter(prog => {
    return (prog.industries || []).some(ind => {
      const iLower = ind.toLowerCase();
      return iLower.includes(qLower) || qLower.includes(iLower) || iLower === 'tất cả ngành hàng';
    });
  }).slice(0, 3);
}

// Local Storage for Admin Keywords Management
const ADMIN_KEYWORDS_KEY = 'ccu_admin_keywords_list';

export function getAdminKeywords() {
  try {
    const saved = localStorage.getItem(ADMIN_KEYWORDS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return CURATED_KEYWORD_CLUSTERS;
}

export function saveAdminKeyword(updatedKeyword, actionType = 'UPDATE') {
  try {
    const list = getAdminKeywords();
    const index = list.findIndex(k => k.id === updatedKeyword.id);
    let newList = [];
    if (index >= 0) {
      newList = [...list];
      newList[index] = { ...updatedKeyword, updatedAt: new Date().toISOString() };
    } else {
      newList = [
        ...list,
        { ...updatedKeyword, id: updatedKeyword.id || `cluster-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
    }
    localStorage.setItem(ADMIN_KEYWORDS_KEY, JSON.stringify(newList));
    return true;
  } catch (e) {
    console.error("Error saving admin keyword", e);
    return false;
  }
}
