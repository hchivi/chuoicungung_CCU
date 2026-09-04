// Full Dataset for ChuoiCungUng.vn - Grounded in UX UI PDF specifications

export const stagesData = [
  {
    id: 1,
    title: "Chuẩn bị & Đầu tư",
    titleEn: "Preparation & Investment",
    code: "GD-01",
    color: "#8b5cf6", // tím (purple)
    bgLight: "bg-purple-50",
    borderLight: "border-purple-200",
    textCol: "text-purple-700",
    badgeBg: "bg-purple-600",
    gradient: "from-purple-600 to-indigo-600",
    summary: "Từ định hướng chiến lược đến pháp lý và lựa chọn địa điểm. Đây là giai đoạn nền tảng quyết định sự thành công của hệ thống sản xuất trong dài hạn.",
    summaryEn: "From strategic orientation to legal procedures and site selection. Foundational stage driving long-term manufacturing success.",
    stats: { phases: 3, enterprises: "250+", industrialParks: "60+" },
    phases: [
      {
        id: "1.1",
        stageId: 1,
        title: "Khảo sát & Định hướng",
        titleEn: "Feasibility & Strategic Survey",
        summary: "Xác định định hướng đầu tư, nghiên cứu thị trường, khảo sát hiện trạng và đánh giá tính khả thi.",
        summaryEn: "Determining investment roadmap, market research, initial survey and feasibility assessment.",
        tasks: [
          "Nghiên cứu thị trường & ngành nghề",
          "Đánh giá nhu cầu sản phẩm",
          "Khảo sát hiện trạng khu vực",
          "Phân tích tính khả thi dự án",
          "Định hướng chiến lược đầu tư"
        ],
        commonDemands: [
          "Tư vấn chiến lược đầu tư",
          "Nghiên cứu thị trường",
          "Khảo sát địa hình, địa chất",
          "Đánh giá tác động môi trường sơ bộ"
        ],
        roles: ["Nhà máy / Chủ đầu tư", "Hội / Hiệp hội", "Doanh nghiệp cung ứng", "KCN"],
        featuredCompanies: ["VietinBank", "DEEP C", "PM Group"],
        totalEnterprises: 85
      },
      {
        id: "1.2",
        stageId: 1,
        title: "Pháp lý & Thủ tục",
        titleEn: "Legal Licensing & Procedures",
        summary: "Hoàn thiện pháp lý dự án, thủ tục đầu tư và các giấy phép liên quan để đảm bảo dự án triển khai đúng quy định và đúng tiến độ.",
        summaryEn: "Completing project licensing, investment certificates, and construction/fire safety permits on schedule.",
        tasks: [
          "Thủ tục chủ trương đầu tư / chấp thuận đầu tư",
          "Thành lập doanh nghiệp / pháp nhân dự án",
          "Thẩm định & phê duyệt dự án đầu tư",
          "Thủ tục đất đai, thuê đất, chuyển mục đích sử dụng đất",
          "Giấy phép xây dựng",
          "Thẩm duyệt PCCC",
          "Đánh giá tác động môi trường (ĐTM) / Giấy phép môi trường",
          "Các thủ tục chuyên ngành khác"
        ],
        commonDemands: [
          "Tư vấn pháp lý dự án",
          "Dịch vụ xin giấy phép xây dựng",
          "Dịch vụ lập ĐTM / xin GP môi trường",
          "Dịch vụ công chứng, hợp pháp hóa",
          "Dịch vụ lập hồ sơ đầu tư",
          "Dịch vụ PCCC",
          "Dịch vụ đo đạc, quy hoạch, đất đai",
          "Tư vấn thuế, ưu đãi đầu tư"
        ],
        outputs: [
          "Hồ sơ pháp lý dự án hoàn chỉnh",
          "Giấy phép đầu tư (IRC/ERC)",
          "Giấy phép xây dựng & PCCC",
          "Giấy phép môi trường"
        ],
        roles: ["Nhà máy / Chủ đầu tư", "Hội / Hiệp hội", "Doanh nghiệp cung ứng", "Khu công nghiệp / Đối tác"],
        featuredCompanies: ["Viet An Law", "VILAF", "DEEP C", "LNT & Partners", "RSM", "Deloitte"],
        totalEnterprises: 150,
        documents: [
          { name: "Checklist thủ tục pháp lý dự án", format: "PDF", size: "1.2 MB" },
          { name: "Quy trình thủ tục đầu tư FDI", format: "PDF", size: "2.4 MB" },
          { name: "Mẫu hồ sơ đăng ký doanh nghiệp", format: "PDF", size: "850 KB" },
          { name: "Danh mục giấy phép theo loại dự án", format: "PDF", size: "1.8 MB" },
          { name: "Hướng dẫn thẩm duyệt PCCC", format: "PDF", size: "3.1 MB" }
        ]
      },
      {
        id: "1.3",
        stageId: 1,
        title: "Chọn địa điểm & Mặt bằng",
        titleEn: "Site Selection & Industrial Park",
        summary: "Lựa chọn khu công nghiệp, mặt bằng phù hợp với chiến lược và quy mô sản xuất.",
        summaryEn: "Selecting optimal industrial zones and land plots matching production scale and strategic location.",
        tasks: [
          "Tìm kiếm & khảo sát KCN",
          "Đánh giá hạ tầng & vị trí địa lý",
          "Đàm phán thuê / mua mặt bằng công nghiệp",
          "Ký kết hợp đồng nguyên tắc",
          "Hoàn thiện pháp lý mặt bằng"
        ],
        commonDemands: [
          "Thông tin KCN & quỹ đất sạch",
          "Tư vấn lựa chọn địa điểm theo ngành nghề",
          "Dịch vụ môi giới BĐS công nghiệp",
          "Đo đạc, quy hoạch chi tiết"
        ],
        roles: ["Nhà máy / Chủ đầu tư", "Hội / Hiệp hội", "Doanh nghiệp cung ứng", "KCN"],
        featuredCompanies: ["VSIP", "Long Hậu", "Savills Vietnam"],
        totalEnterprises: 72
      }
    ]
  },
  {
    id: 2,
    title: "Thiết kế & Xây dựng",
    titleEn: "Design & Construction",
    code: "GD-02",
    color: "#10b981", // xanh lá (green)
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    textCol: "text-emerald-700",
    badgeBg: "bg-emerald-600",
    gradient: "from-emerald-500 to-green-600",
    summary: "Quy hoạch, thiết kế nhà xưởng và triển khai thi công xây dựng đồng bộ hạ tầng cơ điện.",
    summaryEn: "Master planning, plant architecture design and synchronous execution of civil & MEP engineering.",
    stats: { phases: 3, enterprises: "320+", industrialParks: "80+" },
    phases: [
      {
        id: "2.1",
        stageId: 2,
        title: "Thiết kế & Quy hoạch",
        titleEn: "Master Planning & Architecture",
        summary: "Thiết kế tổng mặt bằng, kiến trúc, kết cấu và MEP cho toàn bộ nhà máy.",
        summaryEn: "Master plan layout, architectural design, steel structure and MEP blueprint creation.",
        tasks: ["Khảo sát địa chất chi tiết", "Thiết kế cơ sở & bản vẽ thi công", "Mô hình hóa BIM", "Tối ưu hóa công năng dây chuyền"],
        commonDemands: ["Thiết kế kiến trúc công nghiệp", "Thiết kế kết cấu thép", "Tư vấn thiết kế MEP"],
        roles: ["Chủ đầu tư", "Tổng thầu thiết kế", "Tư vấn giám sát"],
        featuredCompanies: ["Ricons", "Coteccons", "Archetype Group"],
        totalEnterprises: 95
      },
      {
        id: "2.2",
        stageId: 2,
        title: "Thi công xây dựng",
        titleEn: "Civil & Structural Construction",
        summary: "Triển khai thi công móng, kết cấu bê tông, nhà xưởng kết cấu thép và hạ tầng nội khu.",
        summaryEn: "Foundation piling, concrete structure, pre-engineered steel erection and internal infrastructure.",
        tasks: ["Thi công san lấp & móng", "Lắp dựng kết cấu thép tiền chế", "Xây dựng bao che & mái xưởng", "Hạ tầng đường nội bộ, thoát nước"],
        commonDemands: ["Tổng thầu xây dựng (EPC)", "Gia công & lắp dựng kết cấu thép", "Sơn sàn epoxy, chống thấm"],
        roles: ["Tổng thầu", "Thầu phụ xây dựng", "Nhà cung ứng VLXD"],
        featuredCompanies: ["Ricons", "ATAD Steel", "Hòa Phát"],
        totalEnterprises: 140
      },
      {
        id: "2.3",
        stageId: 2,
        title: "Cơ điện & Hạ tầng kỹ thuật",
        titleEn: "MEP & Technical Infrastructure",
        summary: "Thi công hệ thống điện trung hạ thế, trạm biến áp, HVAC, PCCC và cấp thoát nước công nghiệp.",
        summaryEn: "Medium/low voltage grid, transformer substations, HVAC cleanroom systems and industrial wastewater.",
        tasks: ["Lắp đặt trạm biến áp & tủ điện", "Hệ thống thông gió & điều hòa không khí (HVAC)", "Hệ thống PCCC tự động", "Xử lý nước cấp và nước thải sản xuất"],
        commonDemands: ["Thi công MEP trọn gói", "Thi công hệ thống PCCC tiêu chuẩn", "Cung cấp máy làm lạnh Chiller & HVAC"],
        roles: ["Nhà thầu MEP", "Nhà cung cấp thiết bị", "Đơn vị thẩm duyệt PCCC"],
        featuredCompanies: ["Trane Technologies", "Searefico", "Hòa Bình PCCC"],
        totalEnterprises: 110
      }
    ]
  },
  {
    id: 3,
    title: "Lắp đặt & Hoàn thiện",
    titleEn: "Installation & Commissioning",
    code: "GD-03",
    color: "#f97316", // cam (orange)
    bgLight: "bg-orange-50",
    borderLight: "border-orange-200",
    textCol: "text-orange-700",
    badgeBg: "bg-orange-500",
    gradient: "from-orange-500 to-amber-600",
    summary: "Máy móc, dây chuyền, cơ điện, phòng sạch, kiểm định chất lượng và bàn giao đưa vào vận hành.",
    summaryEn: "Machinery delivery, automatic line calibration, cleanroom finishing, quality audit and handover.",
    stats: { phases: 3, enterprises: "210+", industrialParks: "55+" },
    phases: [
      {
        id: "3.1",
        stageId: 3,
        title: "Lắp đặt máy & Dây chuyền",
        titleEn: "Machinery Rigging & Production Lines",
        summary: "Vận chuyển máy móc siêu trường siêu trọng, định vị căn chỉnh và đấu nối dây chuyền tự động hóa.",
        summaryEn: "Heavy-duty machinery rigging, precision positioning, leveling and automation bus connection.",
        tasks: ["Nâng hạ máy móc thiết bị", "Lắp đặt dây chuyền sản xuất chính", "Đấu nối tín hiệu và cấp nguồn điều khiển"],
        commonDemands: ["Dịch vụ cẩu kéo nâng hạ máy nặng", "Cáp điện điều khiển công nghiệp", "Kỹ sư căn chỉnh máy"],
        roles: ["Nhà sản xuất thiết bị", "Đơn vị lắp máy chuyên dụng"],
        featuredCompanies: ["LAPP Vietnam", "Tân Phát Etek", "Siemens"],
        totalEnterprises: 78
      },
      {
        id: "3.2",
        stageId: 3,
        title: "Hoàn thiện không gian sản xuất",
        titleEn: "Cleanroom Setup & Facility Fit-out",
        summary: "Thi công phòng sạch Cleanroom, hệ thống khí nén, chiếu sáng, bảng biển 5S và nội thất công nghiệp.",
        summaryEn: "Cleanroom panel assembly, pneumatic compressed air piping, 5S layout marking and industrial furniture.",
        tasks: ["Thi công panel phòng sạch", "Lắp đặt đường ống khí nén, khí gas", "Setup vạch kẻ layout 5S xưởng"],
        commonDemands: ["Thi công panel EPS/PU", "Máy nén khí trục vít công nghiệp", "Bàn ghế thao tác công nghiệp"],
        roles: ["Nhà thầu phòng sạch", "Cung cấp thiết bị phụ trợ"],
        featuredCompanies: ["System Fan", "Kaeser", "Việt Tín Cleanroom"],
        totalEnterprises: 65
      },
      {
        id: "3.3",
        stageId: 3,
        title: "Kiểm tra & Chạy thử Nghiệm thu",
        titleEn: "Trial Runs & Safety Acceptance",
        summary: "Chạy thử không tải và có tải, hiệu chuẩn thiết bị đo lường, kiểm định an toàn và nghiệm thu bàn giao.",
        summaryEn: "No-load & loaded commissioning, sensor calibration, safety inspections and official handover acceptance.",
        tasks: ["Chạy thử liên động dây chuyền", "Hiệu chuẩn sensor và cảm biến", "Nghiệm thu PCCC & môi trường", "Bàn giao hồ sơ hoàn công"],
        commonDemands: ["Kiểm định thiết bị áp lực", "Đo kiểm môi trường lao động", "Dịch vụ cấp chứng chỉ hiệu chuẩn"],
        roles: ["Trung tâm kiểm định", "Chủ đầu tư", "Nhà thầu chính"],
        featuredCompanies: ["Vinacontrol", "Quatest 3", "SGS Vietnam"],
        totalEnterprises: 67
      }
    ]
  },
  {
    id: 4,
    title: "Vận hành Sản xuất",
    titleEn: "Production Operations",
    code: "GD-04",
    color: "#0284c7", // xanh dương (blue)
    bgLight: "bg-sky-50",
    borderLight: "border-sky-200",
    textCol: "text-sky-700",
    badgeBg: "bg-blue-600",
    gradient: "from-blue-600 to-sky-500",
    summary: "Nguyên vật liệu, quản lý sản xuất, bảo trì máy móc, logistics và kiểm soát chất lượng đầu ra.",
    summaryEn: "Raw materials sourcing, factory MES execution, machine preventive maintenance and outbound logistics.",
    stats: { phases: 3, enterprises: "580+", industrialParks: "120+" },
    phases: [
      {
        id: "4.1",
        stageId: 4,
        title: "Cung ứng đầu vào (NVL, linh kiện)",
        titleEn: "Input Sourcing (Raw Materials & Parts)",
        summary: "Thu mua nguyên liệu thô, phụ tùng thay thế, bao bì đóng gói và linh kiện lắp ráp.",
        summaryEn: "Procuring raw materials, consumable spare parts, packaging and precision sub-components.",
        tasks: ["Tìm kiếm nhà cung cấp vật tư", "Quản lý tồn kho Just-in-Time (JIT)", "Đánh giá chất lượng nhà cung cấp"],
        commonDemands: ["Thép cuộn, hạt nhựa nguyên sinh", "Bao bì carton 3-5 lớp, in flexo", "Linh kiện dập, ốc vít khuôn mẫu"],
        roles: ["Nhà máy sản xuất", "Nhà cung cấp NVL", "Hội ngành nghề"],
        featuredCompanies: ["Hòa Phát", "An Phát Holdings", "Vinapack"],
        totalEnterprises: 290
      },
      {
        id: "4.2",
        stageId: 4,
        title: "Quản lý sản xuất & Kiểm soát",
        titleEn: "Production Management & QA/QC",
        summary: "Vận hành hệ thống MES, quản trị bảo trì TPM, kiểm soát sai số chất lượng QA/QC.",
        summaryEn: "Operating MES software, TPM preventive maintenance and AQL quality inspection.",
        tasks: ["Lập kế hoạch sản xuất hàng ngày", "Bảo trì phòng ngừa sự cố máy", "Kiểm tra chất lượng mẫu theo AQL"],
        commonDemands: ["Phần mềm quản lý MES/ERP", "Dầu mỡ bôi trơn công nghiệp", "Dịch vụ sửa chữa bảo trì định kỳ"],
        roles: ["Ban giám đốc nhà máy", "Trưởng ca sản xuất", "Kỹ sư bảo trì"],
        featuredCompanies: ["Bosch Rexroth", "TotalEnergies", "FPT Software"],
        totalEnterprises: 160
      },
      {
        id: "4.3",
        stageId: 4,
        title: "Giao nhận & Phân phối",
        titleEn: "Warehousing & Outbound Logistics",
        summary: "Kho bãi thành phẩm, dịch vụ vận chuyển nội địa, thủ tục hải quan và logistics xuất khẩu.",
        summaryEn: "Finished goods warehousing, domestic trucking, customs brokerages and multimodal export shipping.",
        tasks: ["Quản lý kho WMS & xuất nhập kho", "Khai báo hải quan điện tử", "Vận tải đường bộ, đường biển, hàng không"],
        commonDemands: ["Vận chuyển container đường biển", "Thuê kho ngoại quan / kho lạnh", "Đại lý thủ tục hải quan trọn gói"],
        roles: ["Nhà máy", "Doanh nghiệp Logistics (3PL/4PL)", "Cảng biển"],
        featuredCompanies: ["ALS Aviation Logistics", "Gemadept", "Viconship"],
        totalEnterprises: 130
      }
    ]
  },
  {
    id: 5,
    title: "Nhân sự & Hậu cần",
    titleEn: "Workforce & Logistics",
    code: "GD-05",
    color: "#eab308", // vàng (yellow)
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    textCol: "text-amber-700",
    badgeBg: "bg-amber-500",
    gradient: "from-yellow-400 to-amber-500",
    summary: "Lao động, đời sống công nhân, suất ăn công nghiệp, xe đưa đón và bảo hộ an toàn lao động.",
    summaryEn: "Workforce recruitment, catering, dormitory amenities, daily commuting buses and PPE safety gear.",
    stats: { phases: 3, enterprises: "340+", industrialParks: "95+" },
    phases: [
      {
        id: "5.1",
        stageId: 5,
        title: "Tuyển dụng & Lao động",
        titleEn: "Staffing & Labor Recruitment",
        summary: "Tuyển dụng kỹ sư, nhân công phổ thông số lượng lớn, đào tạo an toàn và tay nghề nghề nghiệp.",
        summaryEn: "Mass recruitment of technical engineers & workers, vocational onboarding and safety trainings.",
        tasks: ["Đăng tuyển & cung ứng nhân lực thời vụ", "Ký kết HĐLĐ & chế độ BHXH", "Đào tạo nhập môn & nội quy an toàn"],
        commonDemands: ["Dịch vụ cho thuê lại lao động", "Đào tạo an toàn lao động nhóm 1-6", "Headhunting cấp quản lý nhà máy"],
        roles: ["Phòng nhân sự HR", "Công ty cung ứng lao động", "Trường nghề"],
        featuredCompanies: ["Manpower Vietnam", "Navigos Group", "Adecco"],
        totalEnterprises: 140
      },
      {
        id: "5.2",
        stageId: 5,
        title: "Đời sống & Phúc lợi",
        titleEn: "Catering, Commuting & Welfare",
        summary: "Cung cấp suất ăn công nghiệp an toàn vệ sinh, ký túc xá, y tế nhà máy và xe đưa rước công nhân viên.",
        summaryEn: "HACCP industrial catering, worker dormitories, factory clinic and staff commuter bus networks.",
        tasks: ["Setup bếp ăn công nghiệp", "Hợp đồng xe đưa đón chuyên gia/công nhân", "Tổ chức khám sức khỏe định kỳ"],
        commonDemands: ["Suất ăn công nghiệp đạt chuẩn HACCP", "Thuê xe du lịch 29-45 chỗ", "Gói khám sức khỏe định kỳ doanh nghiệp"],
        roles: ["Nhà máy", "Đơn vị F&B công nghiệp", "Bệnh viện/Phòng khám"],
        featuredCompanies: ["Aden Services", "Hoa Mai Food", "Bệnh viện Đa khoa Quốc tế"],
        totalEnterprises: 115
      },
      {
        id: "5.3",
        stageId: 5,
        title: "Đồng phục & Bảo hộ (PPE)",
        titleEn: "Uniforms & PPE Safety Gear",
        summary: "Trang bị đồng phục công sở/công nhân, giày bảo hộ mũi thép, mũ bảo hộ, găng tay và kính an toàn.",
        summaryEn: "Custom manufacturing uniforms, steel-toe safety footwear, hard hats, ESD gloves and safety goggles.",
        tasks: ["May đo đồng phục theo mùa", "Cấp phát trang thiết bị bảo hộ định kỳ", "Kiểm định chất lượng đồ chống tĩnh điện ESD"],
        commonDemands: ["May đồng phục công nhân 5.000+ bộ", "Giày bảo hộ Jogger, King's", "Găng tay phòng sạch, khẩu trang than hoạt tính"],
        roles: ["Xưởng may đồng phục", "Nhà phân phối trang thiết bị BHLĐ"],
        featuredCompanies: ["Gia Định Garment", "Bảo Hộ Việt Nam", "3M Vietnam"],
        totalEnterprises: 85
      }
    ]
  },
  {
    id: 6,
    title: "Mở rộng – Tối ưu – Chuyển đổi",
    titleEn: "Expansion, Optimization & ESG",
    code: "GD-06",
    color: "#ef4444", // đỏ (red)
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    textCol: "text-rose-700",
    badgeBg: "bg-red-600",
    gradient: "from-red-500 to-rose-600",
    summary: "Chuẩn hóa, audit, mở rộng công suất nhà máy, tự động hóa và chuyển đổi số toàn diện theo tiêu chuẩn ESG.",
    summaryEn: "Capacity expansion, ISO compliance auditing, automation AGV and green ESG digital transition.",
    stats: { phases: 3, enterprises: "190+", industrialParks: "65+" },
    phases: [
      {
        id: "6.1",
        stageId: 6,
        title: "Mở rộng công suất & Nhà máy",
        titleEn: "Capacity Expansion & Phase 2",
        summary: "Đầu tư thêm xưởng mới, mở rộng chuyền sản xuất, nâng cấp công suất trạm điện và kho bãi.",
        summaryEn: "Constructing Phase-2 workshops, adding production lines, expanding power transformer and warehouses.",
        tasks: ["Lập báo cáo mở rộng đầu tư", "Xin điều chỉnh giấy chứng nhận đầu tư", "Thi công mở rộng giai đoạn 2"],
        commonDemands: ["Thuê thêm quỹ đất KCN", "Tư vấn điều chỉnh quy hoạch", "Cải tạo và nâng tầng nhà xưởng"],
        roles: ["Chủ đầu tư", "KCN", "Tổng thầu thi công"],
        featuredCompanies: ["VSIP Group", "DEEP C", "Becamex IDC"],
        totalEnterprises: 70
      },
      {
        id: "6.2",
        stageId: 6,
        title: "Audit & ISO – Chuẩn hóa",
        titleEn: "Auditing, ISO & Standardization",
        summary: "Đánh giá tuân thủ quy chuẩn ISO 9001, ISO 14001, ISO 45001, BSCI, SMETA, chứng chỉ xanh LEED.",
        summaryEn: "Auditing international standards: ISO 9001, 14001, 45001, BSCI, SEDEX/SMETA and LEED green buildings.",
        tasks: ["Audit quy trình sản xuất nội bộ", "Khắc phục lỗi không phù hợp (CAR)", "Đánh giá cấp chứng chỉ quốc tế"],
        commonDemands: ["Tư vấn cấp chứng chỉ ISO 9001/14001", "Audit trách nhiệm xã hội BSCI/SEDEX", "Tư vấn công trình xanh LEED"],
        roles: ["Tổ chức chứng nhận quốc tế", "Đơn vị tư vấn kiểm toán"],
        featuredCompanies: ["TUV Rheinland", "Bureau Veritas", "BSI Vietnam"],
        totalEnterprises: 62
      },
      {
        id: "6.3",
        stageId: 6,
        title: "Chuyển đổi số & Tối ưu hệ thống",
        titleEn: "Digital Transformation & ESG Green",
        summary: "Tích hợp IoT cảm biến công nghiệp, robot tự hành AGV, giải pháp ERP/SCM và giám sát năng lượng thông minh.",
        summaryEn: "Deploying industrial IoT sensors, AGV mobile robots, ERP/SCM suites and ESG carbon reduction systems.",
        tasks: ["Triển khai nền tảng Smart Factory", "Tự động hóa kho thông minh Smart Warehouse", "Giám sát giảm phát thải CO2 (ESG)"],
        commonDemands: ["Giải pháp ERP SAP/Oracle", "Lắp đặt hệ thống điện mặt trời mái xưởng", "Robot AGV vận chuyển vật tư"],
        roles: ["Doanh nghiệp công nghệ", "Nhà cung cấp giải pháp xanh"],
        featuredCompanies: ["Viettel Solutions", "FPT Smart Cloud", "Schneider Electric"],
        totalEnterprises: 58
      }
    ]
  }
];

export const enterprisesData = [
  {
    id: "deep-c",
    name: "DEEP C Industrial Zones",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=60",
    tagline: "Phát triển hạ tầng KCN & Bất động sản công nghiệp hàng đầu",
    description: "DEEP C là tổ hợp khu công nghiệp xanh hàng đầu tại Việt Nam với hơn 25 năm kinh nghiệm, kiến tạo hệ sinh thái bền vững, hiệu quả cho nhà đầu tư trong và ngoài nước.",
    taxCode: "0200794868",
    foundedYear: 1997,
    hq: "Tòa nhà DEEP C, KCN Đình Vũ, Hải An, Hải Phòng",
    employeeCount: "250+",
    website: "www.deepc.vn",
    phone: "+84 225 3 905 999",
    email: "marketing@deepc.vn",
    isPriority: true,
    isVerified: true,
    companyType: "Công ty TNHH",
    market: "Toàn quốc",
    languages: "Tiếng Việt, English",
    stages: [1, 2],
    phases: ["1.1", "1.2", "1.3", "2.1"],
    industry: "Bất động sản công nghiệp & Hạ tầng",
    locations: ["Hải Phòng", "Quảng Ninh", "Hải Dương"],
    services: [
      { title: "Phát triển KCN", desc: "Phát triển hạ tầng khu công nghiệp đồng bộ, hiện đại, đạt tiêu chuẩn sinh thái quốc tế." },
      { title: "Cho thuê đất & nhà xưởng", desc: "Cung cấp giải pháp thuê đất linh hoạt, nhà xưởng xây sẵn và theo yêu cầu chất lượng cao." },
      { title: "Dịch vụ tiện ích trọn gói", desc: "Hệ thống tiện ích nội khu đầy đủ: điện, nước, xử lý nước thải, viễn thông tin cậy." },
      { title: "Hỗ trợ thủ tục đầu tư", desc: "Hỗ trợ nhà đầu tư trong suốt quá trình xin giấy phép IRC, ERC và vận hành thuận lợi." },
      { title: "Phát triển bền vững", desc: "Cam kết phát triển KCN sinh thái, năng lượng tái tạo và bảo vệ môi trường." }
    ],
    projects: [
      { name: "DEEP C Hải Phòng I", loc: "Hải Phòng", area: "1.600 ha", year: 2008, img: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=400&auto=format&fit=crop&q=60" },
      { name: "DEEP C Hải Phòng II", loc: "Hải Phòng", area: "540 ha", year: 2015, img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=60" },
      { name: "DEEP C Quảng Ninh I", loc: "Quảng Ninh", area: "1.168 ha", year: 2013, img: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=400&auto=format&fit=crop&q=60" },
      { name: "DEEP C Quảng Ninh II", loc: "Quảng Ninh", area: "119 ha", year: 2021, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60" }
    ],
    certifications: ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "LEED Gold"],
    clients: ["LG", "Bridgestone", "Canon", "Pega", "TCL"]
  },
  {
    id: "ricons",
    name: "Ricons Construction",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&auto=format&fit=crop&q=60",
    tagline: "Tổng thầu thiết kế & thi công xây dựng công nghiệp uy tín",
    description: "Ricons là một trong những tổng thầu xây dựng hàng đầu Việt Nam, chuyên thực hiện các dự án nhà máy công nghiệp quy mô lớn đòi hỏi kỹ thuật cao.",
    isPriority: true,
    isVerified: true,
    stages: [2],
    phases: ["2.1", "2.2"],
    industry: "Xây dựng công nghiệp",
    locations: ["TP. Hồ Chí Minh", "Hà Nội", "Bình Dương", "Bắc Ninh"],
    certifications: ["ISO 9001:2015", "ISO 45001:2018"]
  },
  {
    id: "trane",
    name: "Trane Technologies Vietnam",
    logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=60",
    tagline: "Giải pháp HVAC & Hệ thống cơ điện thông minh",
    description: "Nhà cung cấp giải pháp làm lạnh Chiller, hệ thống HVAC và điều hòa trung tâm tiết kiệm năng lượng hàng đầu thế giới.",
    isPriority: false,
    isVerified: true,
    stages: [2],
    phases: ["2.3"],
    industry: "Cơ điện & HVAC",
    locations: ["Hà Nội", "TP. Hồ Chí Minh", "Đồng Nai"],
    certifications: ["ISO 9001:2015", "AHRI Certified"]
  },
  {
    id: "lapp",
    name: "LAPP Vietnam",
    logo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&auto=format&fit=crop&q=60",
    tagline: "Cáp điện, cáp điều khiển & giải pháp kết nối tự động hóa",
    description: "Tập đoàn Đức dẫn đầu về cáp điều khiển, cáp tín hiệu servo và đầu nối công nghiệp trong các dây chuyền sản xuất tự động.",
    isPriority: false,
    isVerified: true,
    stages: [3],
    phases: ["3.1"],
    industry: "Thiết bị điện & Tự động hóa",
    locations: ["Bình Dương", "Đồng Nai", "Bắc Ninh"],
    certifications: ["ISO 9001:2015", "VDE", "UL Listed"]
  },
  {
    id: "als",
    name: "ALS Aviation Logistics",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=60",
    tagline: "Dịch vụ logistics & chuỗi cung ứng hàng không tiên phong",
    description: "Cung cấp hệ sinh thái logistics toàn diện gồm ga hàng hóa kéo dài, kho lạnh ngoại quan, vận tải công nghệ cao cho các nhà máy công nghệ.",
    isPriority: true,
    isVerified: true,
    stages: [4],
    phases: ["4.3"],
    industry: "Logistics & Kho bãi",
    locations: ["Hà Nội", "Bắc Ninh", "Hải Phòng", "TP. Hồ Chí Minh"],
    certifications: ["ISO 9001:2015", "TAPA Security Class A"]
  },
  {
    id: "vietanlaw",
    name: "Viet An Law",
    logo: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=150&auto=format&fit=crop&q=60",
    tagline: "Tư vấn pháp lý & giải pháp đầu tư FDI doanh nghiệp",
    description: "Hãng luật chuyên tư vấn cấp phép đầu tư FDI, thành lập nhà máy, chuyển nhượng dự án và tuân thủ pháp luật lao động tại Việt Nam.",
    isPriority: false,
    isVerified: true,
    stages: [1],
    phases: ["1.2"],
    industry: "Tư vấn pháp lý & Tài chính",
    locations: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"],
    certifications: ["Vietnam Bar Association"]
  }
];

import industrialParksFullList from './industrialParksFull.json' with { type: 'json' };

export const industrialParksData = industrialParksFullList;

export const factoriesData = [
  {
    id: "samsung-bacninh",
    name: "Nhà máy Samsung Electronics Việt Nam - Bắc Ninh",
    companyName: "Samsung Electronics Co., Ltd.",
    status: "Đang hoạt động",
    isVerified: true,
    location: "Bắc Ninh",
    ipName: "Yên Phong I, Bắc Ninh",
    industry: "Điện tử & Linh kiện",
    employees: "20.000+ nhân viên",
    investment: "6.5+ tỷ USD",
    area: "1.35 triệu m²",
    capacity: "Top 1 kim ngạch xuất khẩu",
    exportYears: [
      { year: "2020", value: 34.2 },
      { year: "2021", value: 38.5 },
      { year: "2022", value: 41.0 },
      { year: "2023", value: 39.5 },
      { year: "2024 (E)", value: 44.0 }
    ],
    activeDemands: [
      { title: "Cung cấp đồng phục công nhân 5.000 bộ/tháng", type: "Sản phẩm", budget: "1.2 - 1.5 tỷ VND", deadline: "Còn 31 ngày" },
      { title: "Tìm đơn vị vận chuyển quốc tế hàng không", type: "Dịch vụ", budget: "Thương thảo", deadline: "Còn 15 ngày" },
      { title: "Nhà cung ứng khay nhựa chống tĩnh điện ESD", type: "Sản phẩm", budget: "500 - 800 triệu VND", deadline: "Còn 20 ngày" },
      { title: "Thầu nhà máy xử lý bùn thải nguy hại", type: "Giải pháp", budget: "1.5 - 2 tỷ VND", deadline: "Còn 25 ngày" }
    ],
    featuredSuppliers: ["Samsung SDI", "LG Innotek", "Hana Micron", "SEMV", "Dongjin", "JNTC", "YURA"],
    awards: ["Doanh nghiệp FDI tiêu biểu 2023", "Top 100 Nơi làm việc tốt nhất", "Huân chương Lao động hạng Nhất"],
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "bosch-vietnam",
    name: "Nhà máy Bosch Việt Nam",
    companyName: "Bosch Global Software Technologies",
    status: "Đang hoạt động",
    isVerified: true,
    location: "Đồng Nai",
    ipName: "Long Thành, Đồng Nai",
    industry: "Cơ khí chính xác & Linh kiện ô tô",
    employees: "4.500 nhân viên",
    investment: "450 triệu USD",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "nestle-trian",
    name: "Nhà máy Nestlé Trị An",
    companyName: "Nestlé Việt Nam",
    status: "Đang hoạt động",
    isVerified: true,
    location: "Đồng Nai",
    ipName: "Amata, Đồng Nai",
    industry: "Thực phẩm & Đồ uống",
    employees: "2.300 nhân viên",
    investment: "330 triệu USD",
    img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "vinamilk-binhduong",
    name: "Nhà máy Sữa Mega Vinamilk Bình Dương",
    companyName: "Công ty Cổ phần Sữa Việt Nam",
    status: "Đang hoạt động",
    isVerified: true,
    location: "Bình Dương",
    ipName: "VSIP II, Bình Dương",
    industry: "Thực phẩm & Sản phẩm từ sữa",
    employees: "3.200 nhân viên",
    investment: "2.400 tỷ VND",
    img: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "intel-vietnam",
    name: "Nhà máy Intel Products Vietnam",
    companyName: "Intel Products Vietnam Co., Ltd.",
    status: "Đang hoạt động",
    isVerified: true,
    location: "TP. Hồ Chí Minh",
    ipName: "Khu Công Nghệ Cao (SHTP), TP.HCM",
    industry: "Điện tử & Bán dẫn",
    employees: "1.500 nhân viên",
    investment: "1.5 tỷ USD",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "thaco-chulai",
    name: "Tổ hợp Sản xuất Ô tô THACO Chu Lai",
    companyName: "THACO INDUSTRIES",
    status: "Đang hoạt động",
    isVerified: true,
    location: "Quảng Nam",
    ipName: "Chu Lai, Quảng Nam",
    industry: "Cơ khí chế tạo & Ô tô",
    employees: "6.000 nhân viên",
    investment: "3.5 tỷ USD",
    img: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60"
  }
];

export const associationsData = [
  {
    id: "bni-vietnam",
    name: "BNI Việt Nam",
    status: "Đang hoạt động",
    tagline: "Mạng lưới kết nối kinh doanh lớn nhất thế giới",
    foundedYear: "1985 (Toàn cầu) - 2005 (Việt Nam)",
    type: "Tổ chức kết nối doanh nghiệp",
    hq: "Hà Nội & TP. Hồ Chí Minh",
    website: "www.bni.vn",
    members: "12.850+",
    provinces: "45",
    chaptersCount: "250+",
    intro: "BNI (Business Network International) là tổ chức kết nối kinh doanh theo triết lý 'Givers Gain - Cho là nhận', giúp các doanh nghiệp xây dựng mối quan hệ chất lượng cao và tạo ra doanh thu bền vững.",
    chapters: [
      { name: "BNI Hanoi 1", loc: "Hà Nội", members: "120+", year: 2010 },
      { name: "BNI HCM City Central", loc: "TP. Hồ Chí Minh", members: "150+", year: 2008 },
      { name: "BNI Danang Chapter", loc: "Đà Nẵng", members: "80+", year: 2012 },
      { name: "BNI Hai Phong Chapter", loc: "Hải Phòng", members: "70+", year: 2015 },
      { name: "BNI Binh Duong Chapter", loc: "Bình Dương", members: "90+", year: 2011 }
    ],
    upcomingEvents: [
      { date: "25 MAY", title: "BNI Vietnam National Conference 2024", loc: "Hà Nội", time: "08:00 - 17:00" },
      { date: "08 JUN", title: "Business Matching Day - BNI HCM", loc: "TP. Hồ Chí Minh", time: "08:30 - 12:00" },
      { date: "22 JUN", title: "BNI Members Training Summit", loc: "Hà Nội", time: "13:30 - 17:00" }
    ],
    partners: ["ActionCOACH", "Sapo", "Viettel Solutions", "Microsoft", "VTP", "VCCI"]
  },
  {
    id: "vcci",
    name: "VCCI - Liên đoàn Thương mại & Công nghiệp Việt Nam",
    status: "Đang hoạt động",
    tagline: "Tổ chức quốc gia đại diện cho cộng đồng doanh nghiệp Việt Nam",
    members: "150.000+",
    provinces: "63",
    type: "Hiệp hội quốc gia"
  },
  {
    id: "vla",
    name: "Hiệp hội Logistics Việt Nam (VLA)",
    status: "Đang hoạt động",
    tagline: "Đại diện cho cộng đồng doanh nghiệp logistics Việt Nam",
    members: "1.200+",
    provinces: "63",
    type: "Hiệp hội chuyên ngành"
  },
  {
    id: "vami",
    name: "Hiệp hội Cơ khí Việt Nam (VAMI)",
    status: "Đang hoạt động",
    tagline: "Đại diện cho cộng đồng doanh nghiệp cơ khí chế tạo Việt Nam",
    members: "2.100+",
    provinces: "63",
    type: "Hiệp hội chuyên ngành"
  },
  {
    id: "vitas",
    name: "Hiệp hội Dệt may Việt Nam (VITAS)",
    status: "Đang hoạt động",
    tagline: "Đại diện cho ngành sản xuất và xuất khẩu dệt may Việt Nam",
    members: "1.500+",
    provinces: "63",
    type: "Hiệp hội chuyên ngành"
  },
  {
    id: "vpa",
    name: "Hiệp hội Nhựa Việt Nam (VPA)",
    status: "Đang hoạt động",
    tagline: "Kết nối và phát triển ngành công nghiệp nhựa và polyme",
    members: "1.100+",
    provinces: "63",
    type: "Hiệp hội chuyên ngành"
  }
];

export const demandsMarketplaceData = [
  {
    id: "dem-proser-vai-dong-phuc",
    biddingCode: "RFQ-2026-FDI-0842",
    title: "Tìm kiếm nguồn cung cấp vải may đồng phục cao cấp (Kate Mỹ, Kaki Cotton 100%, Thun Poly 4 chiều, Vải kháng tĩnh điện ESD)",
    category: "Sản phẩm",
    industry: "Dệt may & Nguyên phụ liệu",
    company: "Chuyên Gia Đồng Phục - Công Ty TNHH Proser",
    shortCompany: "Chuyên Gia Đồng Phục (Proser)",
    isAnonymousBuyer: false,
    anonymousBuyerName: "Doanh Nghiệp FDI Dệt May & PPE (TP. HCM)",
    logo: "/images/founding-partners/chuyen-gia-dong-phuc-logo.png",
    isFoundingPartner: true,
    isVerified: true,
    isFeatured: true,
    kcn: "Xưởng may & Văn phòng Proser, Q. Gò Vấp",
    location: "TP. Hồ Chí Minh",
    budget: "2,5 tỷ - 4,0 tỷ VND / đợt",
    estBudget: "2,5 Tỷ - 4,0 Tỷ VND",
    budgetValue: 4000000000,
    budgetTier: "1b-5b",
    quantity: "50.000m - 100.000m / tháng (Định kỳ)",
    postedDate: "Hôm nay 08:30",
    deadline: "Còn 30 ngày (Ưu tiên gửi mẫu vải trong 7 ngày)",
    timeRemaining: "⏳ Còn 30 ngày",
    isUrgent: false,
    currentBids: 6,
    maxBids: 10,
    progressPercent: 60,
    kycLevelRequired: 2,
    autoMatchedSuppliers: 5,
    status: "Đang mở nhận mẫu & báo giá",
    phaseId: "5.3",
    stageId: 5,
    stageName: "GD 05 - Nhân sự & Hậu cần",
    phaseName: "5.3 Đồng phục & Bảo hộ (PPE)",
    phaseBadge: "Pha 5.3 • Đồng phục & PPE",
    description: "Chuyên Gia Đồng Phục (Công ty TNHH Proser) đang mở rộng năng lực sản xuất các đơn hàng đồng phục doanh nghiệp FDI, chuỗi nhà hàng khách sạn và bảo hộ lao động nhà máy KCN. Chúng tôi cần tìm kiếm các nhà dệt, nhà máy dệt nhuộm và tổng đại lý phân phối vải chất lượng cao, cung ứng định kỳ lâu dài.",
    detailedRequirements: [
      {
        type: "Vải Kate Mỹ / Kate Ý",
        usage: "May áo sơ mi công sở cao cấp, đồng phục văn phòng",
        specs: "Mật độ dệt 133x72, định lượng 120-140 gsm, thành phần 65% Cotton / 35% Poly, chống nhăn, giữ form tốt, bề mặt mềm mịn, không phai màu sau 50 lần giặt."
      },
      {
        type: "Vải Kaki Cotton 100% & Kaki 65/35",
        usage: "May đồng phục bảo hộ lao động, đồng phục kỹ sư & công nhân nhà máy",
        specs: "Định lượng 260-320 gsm, độ bền kéo đứt cao, chịu mài mòn ma sát, nhuộm hoạt tính bền màu, có tùy chọn xử lý chống tĩnh điện hoặc chống cháy chậm."
      },
      {
        type: "Vải Thun Cá Sấu 4 chiều & Thun CVC Poly",
        usage: "May áo thun polo doanh nghiệp, áo sự kiện thương hiệu",
        specs: "Thành phần 65/35 hoặc 100% Cotton chải kỹ (Combed Cotton), co giãn 4 chiều, định lượng 220-240 gsm, dệt tổ ong mắt chim thoáng khí, không xù lông."
      },
      {
        type: "Vải Kháng Tĩnh Điện ESD (Chuyên dụng)",
        usage: "May trang phục phòng sạch nhà máy điện tử bán dẫn",
        specs: "Có dệt sợi carbon sọc 5mm/caro 5mm, điện trở bề mặt 10^6 - 10^8 Ohm, đạt chuẩn Cleanroom Class 100 - 1000."
      }
    ],
    contactInfo: {
      representative: "Ban Giám Đốc / Phòng Mua Hàng & Sourcing Proser",
      phone: "0582 87 77 99",
      hotline: "0582 87 77 99",
      zalo: "https://zalo.me/0582877799",
      email: "contact@chuyengiadongphuc.com",
      website: "https://chuyengiadongphuc.com/",
      address: "154 Phạm Văn Chiêu, P. 9, Q. Gò Vấp, TP. HCM",
      taxCode: "0316881973",
      yearsExperience: 12,
      capacity: "50.000+ sản phẩm / tháng"
    },
    interestedSuppliers: [
      {
        id: "ent-pp",
        name: "Tổng Công Ty Cổ Phần Dệt May Phong Phú",
        shortName: "Phong Phú Corp",
        avatar: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&auto=format&fit=crop&q=80",
        monogram: "PP",
        bgGradient: "from-blue-600 to-indigo-600",
        viewedAt: "15 phút trước",
        status: "Đã gửi mẫu vải"
      },
      {
        id: "ent-tcm",
        name: "Công Ty Cổ Phần Dệt May Đầu Tư Thương Mại Thành Công",
        shortName: "Dệt May Thành Công (TCM)",
        avatar: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&auto=format&fit=crop&q=80",
        monogram: "TC",
        bgGradient: "from-emerald-600 to-teal-600",
        viewedAt: "32 phút trước",
        status: "Đang chào giá"
      }
    ],
    totalInterestedCount: 24
  },
  {
    id: "dem-gio-qua-amata",
    biddingCode: "RFQ-2026-FDI-0915",
    title: "Cung cấp 2.000 giỏ quà màng co, hộp 9:16 thiết yếu (Trà Cozy, Cà phê G7) phúc lợi công nhân",
    category: "Sản phẩm",
    industry: "Quà tặng & Bao bì",
    company: "Tập đoàn Điện tử FDI Nhật Bản (KCN Amata)",
    shortCompany: "Nhà máy FDI Amata",
    isAnonymousBuyer: true,
    anonymousBuyerName: "Nhà máy Điện tử FDI tại KCN Amata (Đồng Nai)",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80",
    isFoundingPartner: false,
    isVerified: true,
    isFeatured: true,
    kcn: "KCN Amata, Đồng Nai",
    location: "Đồng Nai",
    budget: "850 Triệu - 1,2 Tỷ VND",
    estBudget: "850 Triệu - 1,2 Tỷ VND",
    budgetValue: 1200000000,
    budgetTier: "1b-5b",
    quantity: "2.000 suất giỏ quà chuẩn 9:16",
    postedDate: "Vừa xong 10 phút",
    deadline: "Còn 24 giờ (Khẩn)",
    timeRemaining: "⏳ Đóng thầu sau: 24h",
    isUrgent: true,
    currentBids: 4,
    maxBids: 10,
    progressPercent: 40,
    kycLevelRequired: 2,
    autoMatchedSuppliers: 5,
    status: "Đang mở nhận hồ sơ",
    phaseId: "6.1",
    stageId: 6,
    stageName: "GD 06 - Vận hành & Nâng cấp",
    phaseName: "6.1 Quà tặng, Bao bì & Văn phòng phẩm",
    phaseBadge: "Pha 6.1 • Quà tặng & Bao bì",
    description: "Cần tìm gấp đơn vị cung ứng và đóng gói 2.000 giỏ quà thiết yếu bao gồm Trà Cozy, Cà phê G7, bánh kẹo xuất khẩu, màng co nhiệt trong suốt, hộp cứng in offset logo tập đoàn giao tận xưởng KCN Amata trước ngày 25 hàng tháng.",
    interestedSuppliers: [
      { id: "s-g1", name: "Bao bì Tân Á", monogram: "TA", bgGradient: "from-amber-600 to-orange-600", viewedAt: "10 phút trước" }
    ],
    totalInterestedCount: 8
  },
  {
    id: "dem-dong-phuc-esd-cleanroom",
    biddingCode: "RFQ-2026-FDI-0789",
    title: "May 5.000 áo đồng phục chống tĩnh điện ESD Cleanroom Class 1000 cho Nhà máy Bán dẫn",
    category: "Sản phẩm",
    industry: "Dệt may & Bảo hộ lao động",
    company: "Tập đoàn Bán dẫn FDI Hàn Quốc",
    shortCompany: "Nhà máy Bán dẫn FDI",
    isAnonymousBuyer: true,
    anonymousBuyerName: "Tập đoàn Bán dẫn FDI Hàn Quốc tại KCN Yên Phong (Bắc Ninh)",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80",
    isFoundingPartner: false,
    isVerified: true,
    isFeatured: true,
    kcn: "KCN Yên Phong I, Bắc Ninh",
    location: "Bắc Ninh",
    budget: "1,5 Tỷ - 2,2 Tỷ VND",
    estBudget: "1,5 Tỷ - 2,2 Tỷ VND",
    budgetValue: 2200000000,
    budgetTier: "1b-5b",
    quantity: "5.000 bộ (Gồm áo liền quần ESD + Nón + Giày)",
    postedDate: "1 giờ trước",
    deadline: "Còn 48 giờ",
    timeRemaining: "⏳ Đóng thầu sau: 48h",
    isUrgent: true,
    currentBids: 7,
    maxBids: 10,
    progressPercent: 70,
    kycLevelRequired: 3,
    autoMatchedSuppliers: 4,
    status: "Đang mở nhận hồ sơ",
    phaseId: "5.3",
    stageId: 5,
    stageName: "GD 05 - Nhân sự & Hậu cần",
    phaseName: "5.3 Đồng phục & Bảo hộ (PPE)",
    phaseBadge: "Pha 5.3 • Đồng phục & PPE",
    description: "Yêu cầu vải sợi carbon sọc 5mm, điện trở bề mặt 10^6 - 10^8 Ohm, chịu được hấp khử trùng phòng sạch 100 lần giặt không xù lông. Nhà cung cấp cần có chứng nhận test vải từ bên thứ 3 (SGS/Intertek).",
    interestedSuppliers: [
      { id: "s-esd1", name: "Chuyên Gia Đồng Phục (Proser)", monogram: "PS", bgGradient: "from-blue-600 to-indigo-600", viewedAt: "25 phút trước" }
    ],
    totalInterestedCount: 15
  },
  {
    id: "dem-logistics-portalink",
    biddingCode: "RFQ-2026-FDI-0633",
    title: "Vận chuyển thiết bị máy móc siêu trường siêu trọng từ Cảng Cái Mép về Nhà máy KCN VSIP III",
    category: "Dịch vụ",
    industry: "Logistics & Hải quan",
    company: "Tập đoàn Năng lượng & Thiết bị Công nghiệp Đức",
    shortCompany: "Nhà máy Công nghiệp FDI VSIP III",
    isAnonymousBuyer: true,
    anonymousBuyerName: "Tập đoàn Năng lượng FDI tại KCN VSIP III (Bình Dương)",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80",
    isFoundingPartner: false,
    isVerified: true,
    isFeatured: true,
    kcn: "KCN VSIP III, Bình Dương",
    location: "Bình Dương",
    budget: "3,8 Tỷ - 5,5 Tỷ VND",
    estBudget: "3,8 Tỷ - 5,5 Tỷ VND",
    budgetValue: 5500000000,
    budgetTier: "above-5b",
    quantity: "42 kiện siêu trường (Khối lượng lớn nhất 120 tấn/kiện)",
    postedDate: "2 giờ trước",
    deadline: "Còn 3 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 3 ngày",
    isUrgent: false,
    currentBids: 3,
    maxBids: 8,
    progressPercent: 37,
    kycLevelRequired: 2,
    autoMatchedSuppliers: 5,
    status: "Đang mở nhận hồ sơ",
    phaseId: "1.1",
    stageId: 1,
    stageName: "GD 01 - Khởi tạo & Pháp lý",
    phaseName: "1.1 Logistics Siêu trường & Thủ tục cảng",
    phaseBadge: "Pha 1.1 • Logistics Siêu trường",
    description: "Cần đơn vị có năng lực xe rơ-moóc thủy lực chuyên dụng (Multi-axle hydraulic trailer), giấy phép lưu hành đặc biệt của Bộ GTVT, thông quan trực tiếp tại cảng Tân Cảng - Cái Mép và hạ đặt an toàn vào móng xưởng KCN VSIP III.",
    interestedSuppliers: [
      { id: "s-pl1", name: "PORTALINK Logistics Group", monogram: "PL", bgGradient: "from-blue-700 to-indigo-800", viewedAt: "30 phút trước" }
    ],
    totalInterestedCount: 12
  },
  {
    id: "dem-epc-me-deepc",
    biddingCode: "RFQ-2026-FDI-0512",
    title: "Tổng thầu EPC thi công trạm biến áp 110kV và hệ thống PCCC tự động đạt chuẩn NFPA",
    category: "Dịch vụ",
    industry: "Xây dựng & Cơ điện M&E",
    company: "Tập đoàn Sản xuất Ô tô & Pin Điện",
    shortCompany: "Tổ hợp Sản xuất Ô tô Deep C",
    isAnonymousBuyer: true,
    anonymousBuyerName: "Tập đoàn Sản xuất Ô tô & Pin Điện tại KCN Deep C (Hải Phòng)",
    logo: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=100&auto=format&fit=crop&q=80",
    isFoundingPartner: false,
    isVerified: true,
    isFeatured: true,
    kcn: "KCN Deep C, Hải Phòng",
    location: "Hải Phòng",
    budget: "18 Tỷ - 25 Tỷ VND",
    estBudget: "18 Tỷ - 25 Tỷ VND",
    budgetValue: 25000000000,
    budgetTier: "above-5b",
    quantity: "01 Trạm biến áp 110kV + Hệ thống PCCC 25.000m²",
    postedDate: "Hôm qua 16:00",
    deadline: "Còn 5 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 5 ngày",
    isUrgent: false,
    currentBids: 5,
    maxBids: 10,
    progressPercent: 50,
    kycLevelRequired: 3,
    autoMatchedSuppliers: 6,
    status: "Đang mở nhận hồ sơ",
    phaseId: "2.1",
    stageId: 2,
    stageName: "GD 02 - Quy hoạch & Xây dựng",
    phaseName: "2.1 Tổng thầu Xây dựng EPC & M&E",
    phaseBadge: "Pha 2.1 • Tổng thầu EPC & M&E",
    description: "Tìm kiếm Tổng thầu Cơ điện (M&E) và PCCC có chứng chỉ năng lực hoạt động xây dựng Hạng 1, kinh nghiệm thi công ít nhất 3 dự án nhà máy FDI quy mô trên 20 triệu USD tại miền Bắc.",
    interestedSuppliers: [],
    totalInterestedCount: 19
  },
  {
    id: "dem-02",
    biddingCode: "RFQ-2026-FDI-0419",
    title: "Tìm nhà cung cấp bao bì carton 3 lớp & 5 lớp in Flexo chống ẩm cho ngành Thực phẩm",
    category: "Sản phẩm",
    industry: "Bao bì & In ấn",
    company: "Nestlé Việt Nam (Nhà máy Trị An)",
    shortCompany: "Nestlé Trị An",
    isAnonymousBuyer: false,
    anonymousBuyerName: "Tập đoàn Thực phẩm & Đồ uống Đa quốc gia (Đồng Nai)",
    kcn: "KCN Amata, Đồng Nai",
    location: "Đồng Nai",
    budget: "800 Triệu - 1,2 Tỷ VND",
    estBudget: "800 Triệu - 1,2 Tỷ VND",
    budgetValue: 1200000000,
    budgetTier: "1b-5b",
    postedDate: "19/05/2026 14:15",
    deadline: "Còn 18 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 18 ngày",
    isUrgent: false,
    currentBids: 4,
    maxBids: 10,
    progressPercent: 40,
    kycLevelRequired: 2,
    autoMatchedSuppliers: 5,
    status: "Đang mở",
    phaseId: "4.1",
    stageId: 4,
    stageName: "GD 04 - Sản xuất & Gia công",
    phaseName: "4.1 Bao bì, Thùng Carton & In ấn",
    phaseBadge: "Pha 4.1 • Bao bì & In ấn",
    description: "Cung cấp thùng carton sóng BC, định lượng 175/150/150 gsm, cán màng chống thấm nước tiêu chuẩn xuất khẩu EU/Mỹ. Sản lượng 100.000 thùng/tháng.",
    interestedSuppliers: [
      { id: "s4", name: "Bao bì Liksin", monogram: "LK", bgGradient: "from-amber-600 to-orange-600", viewedAt: "2 giờ trước" },
      { id: "s5", name: "Bao bì Biên Hòa", monogram: "BH", bgGradient: "from-blue-600 to-cyan-600", viewedAt: "4 giờ trước" }
    ],
    totalInterestedCount: 9
  },
  {
    id: "dem-04",
    biddingCode: "RFQ-2026-FDI-0382",
    title: "Hệ thống xử lý nước thải công suất 500 m³/ngày đêm đạt chuẩn Cột A QCVN 40",
    category: "Giải pháp",
    industry: "Môi trường & Xử lý nước",
    company: "THACO Chu Lai Complex",
    shortCompany: "THACO Chu Lai",
    isAnonymousBuyer: false,
    anonymousBuyerName: "Tập đoàn Cơ khí Ô tô & Công nghiệp Chu Lai (Quảng Nam)",
    kcn: "KCN Chu Lai, Quảng Nam",
    location: "Quảng Nam",
    budget: "5,0 - 7,0 Tỷ VND",
    estBudget: "5,0 - 7,0 Tỷ VND",
    budgetValue: 7000000000,
    budgetTier: "above-5b",
    postedDate: "17/05/2026 16:20",
    deadline: "Còn 15 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 15 ngày",
    isUrgent: false,
    currentBids: 2,
    maxBids: 6,
    progressPercent: 33,
    kycLevelRequired: 3,
    autoMatchedSuppliers: 4,
    status: "Đang mở",
    phaseId: "2.3",
    stageId: 2,
    stageName: "GD 02 - Quy hoạch & Xây dựng",
    phaseName: "2.3 Hệ thống Môi trường & PCCC",
    phaseBadge: "Pha 2.3 • Môi trường & Xử lý nước",
    description: "Đầu tư trọn gói hệ thống xử lý nước thải sinh hoạt và công nghiệp cho khu nhà xưởng mới, công nghệ MBR/AAO tự động hóa hoàn toàn với cảm biến giám sát online 24/7.",
    interestedSuppliers: [
      { id: "s8", name: "Môi trường Ecoba", monogram: "EB", bgGradient: "from-purple-600 to-pink-600", viewedAt: "1 giờ trước" }
    ],
    totalInterestedCount: 7
  },
  {
    id: "dem-05",
    biddingCode: "RFQ-2026-FDI-0310",
    title: "Gia công linh kiện điện tử: IC, bo mạch PCB nhiều lớp, Đầu nối Connector chính xác",
    category: "Sản phẩm",
    industry: "Điện tử & Bán dẫn",
    company: "Intel Products Vietnam",
    shortCompany: "Intel SHTP",
    isAnonymousBuyer: true,
    anonymousBuyerName: "Tập đoàn Công nghệ Bán dẫn Hoa Kỳ tại KCN SHTP (TP. HCM)",
    kcn: "KCN SHTP, TP. Hồ Chí Minh",
    location: "TP. Hồ Chí Minh",
    budget: "3,0 - 5,0 Tỷ VND",
    estBudget: "3,0 - 5,0 Tỷ VND",
    budgetValue: 5000000000,
    budgetTier: "1b-5b",
    postedDate: "16/05/2026 11:05",
    deadline: "Còn 25 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 25 ngày",
    isUrgent: false,
    currentBids: 6,
    maxBids: 10,
    progressPercent: 60,
    kycLevelRequired: 3,
    autoMatchedSuppliers: 5,
    status: "Đang mở",
    phaseId: "4.1",
    stageId: 4,
    stageName: "GD 04 - Sản xuất & Gia công",
    phaseName: "4.1 Linh kiện Điện tử & Bán dẫn",
    phaseBadge: "Pha 4.1 • Điện tử & Bán dẫn",
    description: "Cần đối tác Tier-2 cung ứng PCB 6-8 lớp, bề mặt mạ vàng ENIG, đáp ứng tiêu chuẩn IPC Class 3 và ISO 13485.",
    interestedSuppliers: [
      { id: "s9", name: "FPT Semiconductor", monogram: "FP", bgGradient: "from-orange-600 to-red-600", viewedAt: "45 phút trước" }
    ],
    totalInterestedCount: 22
  },
  {
    id: "dem-07",
    biddingCode: "RFQ-2026-FDI-0205",
    title: "Phần mềm Quản lý Sản xuất Nhà máy Thông minh (MES) tích hợp Odoo / SAP ERP",
    category: "Giải pháp",
    industry: "Công nghệ thông tin & Tự động hóa",
    company: "Bosch Powertrain Vietnam",
    shortCompany: "Bosch Long Thành",
    isAnonymousBuyer: false,
    anonymousBuyerName: "Tập đoàn Kỹ thuật Công nghệ Bosch tại Long Thành (Đồng Nai)",
    kcn: "KCN Long Thành, Đồng Nai",
    location: "Đồng Nai",
    budget: "2,0 - 4,0 Tỷ VND",
    estBudget: "2,0 - 4,0 Tỷ VND",
    budgetValue: 4000000000,
    budgetTier: "1b-5b",
    postedDate: "14/05/2026 15:40",
    deadline: "Còn 28 ngày",
    timeRemaining: "⏳ Đóng thầu sau: 28 ngày",
    isUrgent: false,
    currentBids: 3,
    maxBids: 8,
    progressPercent: 37,
    kycLevelRequired: 2,
    autoMatchedSuppliers: 4,
    status: "Đang mở",
    phaseId: "6.3",
    stageId: 6,
    stageName: "GD 06 - Vận hành & Nâng cấp",
    phaseName: "6.3 Chuyển đổi số & Tự động hóa",
    phaseBadge: "Pha 6.3 • Số hóa & MES ERP",
    description: "Triển khai hệ thống MES thu thập dữ liệu máy móc theo thời gian thực (IoT Gateways), tính toán OEE tự động, truy xuất nguồn gốc QR Code từng công đoạn sản xuất.",
    interestedSuppliers: [],
    totalInterestedCount: 16
  }
];

export const foundingPartnersData = {
  tiers: [
    {
      name: "Đồng hành",
      price: "Từ 100 triệu VNĐ",
      target: "Dành cho cá nhân, doanh nghiệp và tổ chức muốn đồng hành cùng dự án.",
      icon: "Handshake",
      color: "border-slate-300",
      features: [
        "Hiển thị logo (nhóm Đồng hành)",
        "Thư cảm ơn & Chứng nhận đối tác",
        "Tham dự sự kiện đặc biệt hàng năm",
        "Cập nhật tiến độ dự án định kỳ"
      ]
    },
    {
      name: "Đối tác Bạc",
      price: "Từ 500 triệu VNĐ",
      target: "Dành cho doanh nghiệp mong muốn tăng mức độ hiện diện và đồng hành lâu dài.",
      icon: "Award",
      color: "border-blue-400 bg-blue-50/30",
      features: [
        "Hiển thị logo (nhóm Đối tác Bạc)",
        "Truyền thông trên website & mạng xã hội",
        "Quyền truy cập báo cáo cơ bản",
        "Thư cảm ơn & Chứng nhận danh dự",
        "Ưu tiên kết nối với doanh nghiệp"
      ]
    },
    {
      name: "Đối tác Vàng",
      price: "Từ 1 tỷ VNĐ",
      target: "Dành cho doanh nghiệp dẫn đầu muốn đóng vai trò kiến tạo hệ sinh thái.",
      icon: "Crown",
      isPopular: true,
      color: "border-amber-400 bg-amber-50/40",
      features: [
        "Hiển thị logo (nhóm Đối tác Vàng)",
        "Truyền thông & phỏng vấn chuyên sâu",
        "Quyền truy cập báo cáo nâng cao",
        "Tham gia Hội đồng cố vấn chiến lược",
        "Ưu tiên kết nối chiến lược các KCN",
        "Vinh danh tại sự kiện thường niên"
      ]
    },
    {
      name: "Đối tác Kim cương",
      price: "Từ 3 tỷ VNĐ",
      target: "Dành cho đối tác chiến lược – kiến tạo và đồng hành dài hạn cùng nền tảng.",
      icon: "Sparkles",
      color: "border-purple-500 bg-purple-50/40",
      features: [
        "Hiển thị logo (nhóm Đối tác Kim cương)",
        "Đồng thương hiệu các chương trình lớn",
        "Quyền truy cập toàn bộ dữ liệu & API",
        "Tham gia định hướng chiến lược quốc gia",
        "Ưu tiên kết nối đặc quyền cấp cao",
        "Vinh danh cao nhất tại tất cả sự kiện"
      ]
    }
  ],
  featuredPartners: [
    { name: "VINGROUP", logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&auto=format&fit=crop&q=60" },
    { name: "VSIP", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=60" },
    { name: "THACO", logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=60" },
    { name: "BECAMEX", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60" },
    { name: "VIETTEL SOLUTIONS", logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=60" },
    { name: "FPT", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60" },
    { name: "HÒA PHÁT", logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&auto=format&fit=crop&q=60" },
    { name: "VCCI", logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=60" }
  ]
};

export const diagnosticQuestions = [
  {
    id: 1,
    title: "Bạn là ai trong hệ sinh thái sản xuất?",
    options: [
      { label: "Doanh nghiệp cung ứng", desc: "Tôi cung cấp sản phẩm / dịch vụ / giải pháp cho nhà máy", type: "supplier" },
      { label: "Nhà máy / Chủ đầu tư", desc: "Tôi đang đầu tư, xây dựng hoặc vận hành nhà máy sản xuất", type: "factory" },
      { label: "Khu công nghiệp / BĐS", desc: "Tôi cung cấp đất công nghiệp, hạ tầng và nhà xưởng", type: "kcn" },
      { label: "Hội / Hiệp hội ngành nghề", desc: "Tôi là tổ chức kết nối và hỗ trợ cộng đồng doanh nghiệp", type: "association" }
    ]
  },
  {
    id: 2,
    title: "Doanh nghiệp của bạn hiện đang ở giai đoạn nào?",
    options: [
      { stageId: 1, label: "Giai đoạn 1: Chuẩn bị & Đầu tư", desc: "Tôi đang tìm hiểu, lập kế hoạch đầu tư, xin phép" },
      { stageId: 2, label: "Giai đoạn 2: Thiết kế & Xây dựng", desc: "Tôi đang thiết kế, xin phép xây dựng, thi công nhà xưởng" },
      { stageId: 3, label: "Giai đoạn 3: Lắp đặt & Hoàn thiện", desc: "Tôi đang lắp đặt máy móc, cơ điện, PCCC, chạy thử nghiệm thu" },
      { stageId: 4, label: "Giai đoạn 4: Vận hành Sản xuất", desc: "Tôi đã đi vào sản xuất, cần NVL, bảo trì, logistics" },
      { stageId: 5, label: "Giai đoạn 5: Nhân sự & Hậu cần", desc: "Tôi cần tuyển dụng lao động, may đồng phục, suất ăn, xe đưa đón" },
      { stageId: 6, label: "Giai đoạn 6: Mở rộng & Chuyển đổi", desc: "Tôi đang mở rộng quy mô, audit ISO, chuyển đổi số, tối ưu hệ thống" }
    ]
  },
  {
    id: 3,
    title: "Nhu cầu cấp bách nhất hiện tại của bạn là gì?",
    options: [
      { label: "Tìm nhà thầu cơ điện MEP & PCCC", phase: "2.3" },
      { label: "Tìm nhà cung cấp nguyên vật liệu / linh kiện đầu vào", phase: "4.1" },
      { label: "Tìm xưởng may đồng phục & thiết bị bảo hộ PPE", phase: "5.3" },
      { label: "Tư vấn hồ sơ pháp lý & Giấy phép môi trường", phase: "1.2" },
      { label: "Chuyển đổi số MES & Tự động hóa nhà xưởng", phase: "6.3" }
    ]
  }
];

export const vietnamMapRegions = [
  {
    name: "Miền Bắc",
    kcn: 182,
    factories: 4801,
    pct: "38%",
    desc: "Thủ phủ công nghiệp công nghệ cao, điện tử và cơ khí chính xác với 182 KCN.",
    coords: { x: 45, y: 18 },
    provinces: ["Hà Nội", "Hải Phòng", "Bắc Ninh", "Vĩnh Phúc", "Hải Dương", "Thái Nguyên", "Quảng Ninh", "Hưng Yên", "Hà Nam", "Nam Định", "Ninh Bình", "Bắc Giang", "Phú Thọ", "Lào Cai", "Yên Bái", "Hòa Bình"]
  },
  {
    name: "Miền Trung",
    kcn: 101,
    factories: 1493,
    pct: "21%",
    desc: "Cửa ngõ logistics biển, công nghiệp nặng, lọc hóa dầu và công nghiệp phụ trợ với 101 KCN.",
    coords: { x: 55, y: 45 },
    provinces: ["Đà Nẵng", "Nghệ An", "Quảng Nam", "Thanh Hóa", "Hà Tĩnh", "Quảng Ngãi", "Khánh Hòa", "Bình Định", "Phú Yên", "Quảng Trị", "Quảng Bình", "Thừa Thiên Huế", "Ninh Thuận", "Bình Thuận"]
  },
  {
    name: "Đông Nam Bộ",
    kcn: 103,
    factories: 5721,
    pct: "21%",
    desc: "Động lực tăng trưởng kinh tế, trung tâm sản xuất và xuất khẩu sôi động nhất với 103 KCN.",
    coords: { x: 56, y: 76 },
    provinces: ["Bình Dương", "Đồng Nai", "TP. Hồ Chí Minh", "Bà Rịa – Vũng Tàu", "Bình Phước", "Tây Ninh"]
  },
  {
    name: "Đồng bằng Sông Cửu Long",
    kcn: 76,
    factories: 1952,
    pct: "16%",
    desc: "Thế mạnh nông nghiệp, thủy hải sản và công nghiệp chế biến xuất khẩu với 76 KCN.",
    coords: { x: 48, y: 84 },
    provinces: ["Long An", "Tiền Giang", "Cần Thơ", "Hậu Giang", "An Giang", "Kiên Giang", "Đồng Tháp", "Vĩnh Long", "Bến Tre", "Trà Vinh", "Sóc Trăng", "Bạc Liêu", "Cà Mau"]
  },
  {
    name: "Tây Nguyên",
    kcn: 18,
    factories: 270,
    pct: "4%",
    desc: "Tiềm năng phát triển công nghiệp chế biến nông lâm sản và năng lượng tái tạo với 18 KCN.",
    coords: { x: 62, y: 62 },
    provinces: ["Đắk Lắk", "Lâm Đồng", "Gia Lai", "Kon Tum", "Đắk Nông"]
  }
];

export const topProvincesData = [
  { name: "Hà Nội", kcn: 35, factories: 832, enterprises: 18500 },
  { name: "Long An", kcn: 33, factories: 1439, enterprises: 14200 },
  { name: "Bình Dương", kcn: 32, factories: 1942, enterprises: 19500 },
  { name: "Đồng Nai", kcn: 27, factories: 1667, enterprises: 16800 },
  { name: "Hải Phòng", kcn: 27, factories: 689, enterprises: 11200 },
  { name: "TP. Hồ Chí Minh", kcn: 18, factories: 1175, enterprises: 32000 },
  { name: "Bắc Ninh", kcn: 16, factories: 891, enterprises: 10500 }
];

export const marketAlertsData = [
  {
    title: "Biến động giá nguyên vật liệu",
    content: "Giá thép cuộn cán nóng (HRC) tăng 5,2% trong tuần qua do nhu cầu phục hồi từ các nhà thầu kết cấu thép.",
    time: "20/05/2024 09:15",
    type: "price"
  },
  {
    title: "Xu hướng Logistics quốc tế",
    content: "Cước vận chuyển container tăng 12% trên tuyến Á - Âu do điều chỉnh hải trình quanh Mũi Hảo Vọng.",
    time: "20/05/2024 08:45",
    type: "logistics"
  },
  {
    title: "Chính sách đầu tư mới",
    content: "Nghị định mới về ưu đãi thuế thu nhập doanh nghiệp và tiền thuê đất cho các KCN sinh thái đạt chuẩn ESG.",
    time: "20/05/2024 08:30",
    type: "policy"
  },
  {
    title: "Cơ hội kết nối cung ứng",
    content: "Có 126 nhà cung cấp mới phù hợp với nhu cầu cơ điện MEP & phòng sạch của bạn vừa tham gia hệ thống.",
    time: "20/05/2024 10:00",
    type: "matching"
  }
];
