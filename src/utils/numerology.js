/**
 * PYTHAGOREAN NUMEROLOGY ANALYTICS ENGINE FOR INDUSTRIAL WORKFORCE & RECRUITMENT
 * Chuyên sâu cho định vị nhân sự, chọn người & chọn việc trong Nhà máy, Xưởng sản xuất và KCN
 */

// Pythagorean Letter Value Mapping
const LETTER_VALUES = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// Remove Vietnamese accents and special characters
export function normalizeVietnameseText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

// Reduce digits to single digit or master numbers (11, 22, 33)
export function reduceToSingleOrMaster(num) {
  let val = num;
  while (val > 9 && val !== 11 && val !== 22 && val !== 33) {
    val = String(val)
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return val;
}

// Reduce to single digit only (1-9)
export function reduceToSingle(num) {
  let val = num;
  while (val > 9) {
    val = String(val)
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return val;
}

/**
 * Calculate Life Path Number (Số Chủ Đạo) from birthdate
 * @param {number|string} day 
 * @param {number|string} month 
 * @param {number|string} year 
 */
export function calculateLifePathNumber(day, month, year) {
  const d = reduceToSingle(parseInt(day, 10));
  const m = reduceToSingle(parseInt(month, 10));
  const y = reduceToSingle(parseInt(year, 10));
  return reduceToSingleOrMaster(d + m + y);
}

/**
 * Calculate Destiny Number (Số Sứ Mệnh) from full name
 * @param {string} fullName 
 */
export function calculateDestinyNumber(fullName) {
  const clean = normalizeVietnameseText(fullName);
  if (!clean) return 1;
  const total = clean.split('').reduce((sum, char) => {
    return sum + (LETTER_VALUES[char] || 0);
  }, 0);
  return reduceToSingleOrMaster(total);
}

/**
 * Calculate Soul Urge Number (Số Linh Hồn - từ các nguyên âm A, E, I, O, U, Y)
 */
export function calculateSoulNumber(fullName) {
  const clean = normalizeVietnameseText(fullName);
  if (!clean) return 1;
  const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
  const total = clean.split('').reduce((sum, char) => {
    return vowels.includes(char) ? sum + (LETTER_VALUES[char] || 0) : sum;
  }, 0);
  return total === 0 ? 1 : reduceToSingleOrMaster(total);
}

/**
 * Calculate Personality Number (Số Tính Cách - từ các phụ âm)
 */
export function calculatePersonalityNumber(fullName) {
  const clean = normalizeVietnameseText(fullName);
  if (!clean) return 1;
  const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];
  const total = clean.split('').reduce((sum, char) => {
    return !vowels.includes(char) ? sum + (LETTER_VALUES[char] || 0) : sum;
  }, 0);
  return total === 0 ? 1 : reduceToSingleOrMaster(total);
}

/**
 * Complete Numerology Knowledge Base & Industrial Recruitment Insights
 */
export const NUMEROLOGY_PROFILES = {
  1: {
    number: 1,
    title: "Người Tiên Phong & Quyết Đoán",
    element: "Kim / Lãnh đạo",
    keywords: ["Độc lập", "Tự chủ", "Quyết đoán", "Chịu trách nhiệm cao", "Dám dẫn đầu"],
    workStyle: "Thích làm việc tự chủ, không ngại áp lực tiến độ sản xuất, có khả năng ra quyết định dứt khoát khi có sự cố kỹ thuật trên chuyền.",
    strengths: ["Lãnh đạo đội nhóm", "Khởi động dự án xưởng mới", "Tập trung cao độ", "Ý chí kiên cường"],
    challenges: ["Có thể thiếu kiên nhẫn với người làm chậm", "Thích tự làm hơn là ủy quyền chi tiết"],
    recommendedRoles: [
      "Giám Đốc / Quản Đốc Nhà Máy Sản Xuất",
      "Trưởng Phòng Quản Lý Sản Xuất (Production Manager)",
      "Trưởng Nhóm Setup Dây Chuyền Mới (Line Leader)",
      "Kỹ Sư Trưởng Dự Án Đầu Tư KCN"
    ],
    suitableIndustries: ["Cơ khí chế tạo", "Điện tử công nghệ cao", "Tự động hóa", "Xây dựng KCN"],
    compatibility: [1, 3, 5, 8],
    adviceForRecruiter: "Bố trí ứng viên này vào các vị trí độc lập tác chiến, giao quyền tự quyết và KPI rõ ràng. Tránh giám sát vi mô quá chi tiết."
  },
  2: {
    number: 2,
    title: "Sứ Giả Hòa Hợp & Ngoại Giao",
    element: "Thủy / Kết nối",
    keywords: ["Hòa giải", "Thấu hiểu", "Lắng nghe", "Hợp tác", "Tinh tế"],
    workStyle: "Giỏi dung hòa mâu thuẫn giữa các phòng ban (Sản xuất - QA - Kho vận), có khả năng giao tiếp khéo léo và xây dựng môi trường làm việc đoàn kết.",
    strengths: ["Đàm phán & Ngoại giao", "Quản lý nhân sự xưởng", "Làm việc nhóm xuất sắc", "Cẩn trọng"],
    challenges: ["Dễ nhạy cảm với xung đột gay gắt", "Cần thời gian khi phải đưa ra quyết định sa thải/kỷ luật"],
    recommendedRoles: [
      "Trưởng Phòng Hành Chính - Nhân Sự (HR Manager) Nhà Máy",
      "Chuyên Viên Quan Hệ Đối Tác & Khách Hàng FDI",
      "Điều Phối Viên Chuỗi Cung Ứng & Thu Mua (Buyer / Sourcing Coordinator)",
      "Trợ Lý Ban Giám Đốc Nhà Máy"
    ],
    suitableIndustries: ["Dệt may & Da giày", "Logistics & Thu mua", "Hiệp hội công nghiệp", "Dịch vụ KCN"],
    compatibility: [2, 4, 6, 8],
    adviceForRecruiter: "Rất thích hợp cho vị trí cầu nối giữa Ban giám đốc và Công nhân xưởng hoặc đàm phán hợp đồng cung ứng với đối tác."
  },
  3: {
    number: 3,
    title: "Nhà Sáng Tạo & Truyền Cảm Hứng",
    element: "Hỏa / Lan tỏa",
    keywords: ["Sáng tạo", "Linh hoạt", "Lạc quan", "Giao tiếp tốt", "Cải tiến Kaizen"],
    workStyle: "Luôn tìm ra phương pháp mới để tối ưu quy trình sản xuất, giỏi khích lệ tinh thần công nhân trong các đợt tăng ca chạy dự án gấp.",
    strengths: ["Cải tiến sáng tạo (Kaizen / Lean)", "Đào tạo & Hướng dẫn thao tác", "Thuyết trình báo cáo", "Tạo động lực"],
    challenges: ["Dễ chán nản với các công việc lặp đi lặp lại không có đổi mới", "Cần quản lý tốt thời gian hoàn thành"],
    recommendedRoles: [
      "Chuyên Viên Cải Tiến Năng Suất (Kaizen / IE Engineer)",
      "Trưởng Bộ Phận Đào Tạo & Huấn Luyện Tay Nghề Kỹ Thuật",
      "Thiết Kế Mẫu & Phát Triển Sản Phẩm (R&D / Sampling)",
      "Chuyên Viên Marketing & Truyền Thông B2B Công Nghiệp"
    ],
    suitableIndustries: ["Thiết kế sản phẩm", "Bao bì & In ấn", "Dệt may thời trang", "Công nghệ tự động hóa"],
    compatibility: [1, 3, 5, 9],
    adviceForRecruiter: "Giao cho các đề tài nghiên cứu cải tiến quy trình, giảm lãng phí trong chuyền sản xuất để phát huy tối đa tư duy đổi mới."
  },
  4: {
    number: 4,
    title: "Bậc Thầy Kỷ Luật & Quy Trình Chuẩn Hóa",
    element: "Thổ / Nền tảng",
    keywords: ["Kỷ luật", "Chính xác", "Quy trình", "Tỉ mỉ", "Độ tin cậy 100%"],
    workStyle: "Tôn trọng tuyệt đối tiêu chuẩn kỹ thuật (ISO, 5S, AQL), làm việc bài bản, kiểm soát chặt chẽ từng chi tiết nhỏ nhất trong dây chuyền.",
    strengths: ["Kiểm soát chất lượng QA/QC", "Tuân thủ quy trình chuẩn SOP", "Bền bỉ, chịu khó", "Quản lý rủi ro kỹ thuật"],
    challenges: ["Đôi khi hơi cứng nhắc, chậm thích ứng với thay đổi đột ngột", "Cần số liệu và bằng chứng cụ thể"],
    recommendedRoles: [
      "Trưởng Phòng Quản Lý Chất Lượng (QA/QC Manager)",
      "Kỹ Sư Tiêu Chuẩn & An Toàn Lao Động (EHS / ISO Officer)",
      "Kỹ Thuật Viên Lập Trình & Gia Công Chính Xác CNC",
      "Kỹ Sư Bảo Trì Cơ Điện & Thiết Bị (ME Maintenance)"
    ],
    suitableIndustries: ["Cơ khí chính xác", "Linh kiện điện tử SMT", "Dược phẩm & Phòng sạch", "Hóa chất"],
    compatibility: [2, 4, 8, 22],
    adviceForRecruiter: "Ứng viên số 4 là 'xương sống' cho bất kỳ nhà máy nào cần tiêu chuẩn khắt khe, kiểm soát sai số và độ ổn định lâu dài."
  },
  5: {
    number: 5,
    title: "Người Tiên Phong Thích Ứng & Khai Phá Thị Trường",
    element: "Phong / Linh hoạt",
    keywords: ["Linh hoạt", "Thích ứng nhanh", "Đa nhiệm", "Mở rộng", "Táo bạo"],
    workStyle: "Phản ứng cực nhanh với biến động thị trường, đứt gãy chuỗi cung ứng hoặc sự cố nguyên vật liệu; thích các thử thách mới.",
    strengths: ["Xử lý khủng hoảng chuỗi cung ứng", "Phát triển thị trường mới", "Làm việc trong môi trường đa văn hóa FDI", "Thương lượng giá tốt"],
    challenges: ["Không thích ngồi yên một chỗ trong văn phòng", "Dễ nhảy việc nếu môi trường gò bó thiếu thử thách"],
    recommendedRoles: [
      "Trưởng Phòng Thu Mua & Sourcing Quốc Tế",
      "Giám Đốc Phát Triển Kinh Doanh KCN (BDM / Industrial Real Estate)",
      "Chuyên Viên Xuất Nhập Khẩu & Thủ Tục Hải Quan",
      "Kỹ Sư Hiện Trường & Triển Khai Lắp Đặt Thiết Bị"
    ],
    suitableIndustries: ["Logistics & Kho vận quốc tế", "Bất động sản công nghiệp", "Sourcing đa quốc gia", "Thương mại B2B"],
    compatibility: [1, 3, 5, 7],
    adviceForRecruiter: "Tạo cơ hội cho họ đi công tác, đàm phán trực tiếp với đối tác cung ứng trong nước và nước ngoài."
  },
  6: {
    number: 6,
    title: "Người Bảo Hộ Trách Nhiệm & Chăm Sóc Đội Ngũ",
    element: "Thổ / Nuôi dưỡng",
    keywords: ["Trách nhiệm", "Tận tâm", "Bảo bọc", "Trung thành", "Chu đáo"],
    workStyle: "Luôn đặt sự an toàn của công nhân và chất lượng sản phẩm lên hàng đầu, xây dựng sự gắn kết nội bộ bền vững trong nhà máy.",
    strengths: ["Quản lý phúc lợi & đời sống công nhân", "Kiểm soát an toàn lao động", "Xây dựng văn hóa doanh nghiệp", "Độ trung thành cao"],
    challenges: ["Dễ lo lắng ôm đồm công việc", "Cần học cách từ chối các yêu cầu quá tải"],
    recommendedRoles: [
      "Trưởng Phòng Chăm Sóc Nhân Sự & Đời Sống Công Nhân KCN",
      "Giám Sát An Toàn Vệ Sinh Lao Động (HSE Manager)",
      "Quản Lý Xưởng May & Đội Ngũ Công Nhân Chuyền",
      "Chuyên Viên Quản Lý Chất Lượng Dịch Vụ Khách Hàng B2B"
    ],
    suitableIndustries: ["Dệt may & Da giày", "Chế biến thực phẩm", "Y tế & Dược phẩm", "Dịch vụ tiện ích KCN"],
    compatibility: [2, 3, 6, 9],
    adviceForRecruiter: "Người giữ lửa cho sự ổn định nhân sự xưởng, giúp giảm tỷ lệ nhảy việc của công nhân chuyền sản xuất."
  },
  7: {
    number: 7,
    title: "Chuyên Gia Nghiên Cứu, Kỹ Thuật & Phân Tích Dữ Liệu",
    element: "Thủy / Trí tuệ",
    keywords: ["Chuyên sâu", "Phân tích logic", "Độc lập", "Khám phá", "Cầu toàn"],
    workStyle: "Thích đào sâu nguyên nhân gốc rễ (Root Cause Analysis - 5 Whys), say mê công nghệ cao, tự động hóa và các bài toán kỹ thuật hóc búa.",
    strengths: ["Thiết kế vi mạch & Lập trình PLC/SCADA", "Phân tích dữ liệu sản xuất OEE", "R&D phòng lab", "Xử lý lỗi hệ thống"],
    challenges: ["Ít nói, thích làm việc một mình", "Cần cải thiện kỹ năng giao tiếp truyền tải với công nhân phổ thông"],
    recommendedRoles: [
      "Kỹ Sư Thiết Kế Vi Mạch Bán Dẫn (IC / Semiconductor Engineer)",
      "Kỹ Sư Tự Động Hóa & Lập Trình PLC / SCADA",
      "Chuyên Gia Phân Tích Dữ Liệu Sản Xuất & Chuyển Đổi Số",
      "Trưởng Phòng Nghiên Cứu & Phát Triển Kỹ Thuật (R&D Chief)"
    ],
    suitableIndustries: ["Bán dẫn & Vi mạch", "Tự động hóa & Robot", "Hóa học công nghệ cao", "Phần mềm công nghiệp MES"],
    compatibility: [1, 5, 7, 11],
    adviceForRecruiter: "Trang bị cho họ công cụ làm việc và phòng lab chuyên nghiệp, tôn trọng không gian tư duy độc lập của họ."
  },
  8: {
    number: 8,
    title: "Nhà Điều Hành Chiến Lược & Quản Trị Chuỗi Cung Ứng",
    element: "Kim / Quyền uy",
    keywords: ["Tầm nhìn vĩ mô", "Hiệu quả tài chính", "Quản trị chuỗi cung ứng", "Quyết đoán", "Thực thi xuất sắc"],
    workStyle: "Luôn nhìn nhận bài toán sản xuất dưới góc độ chi phí - lợi nhuận (ROI), tối ưu hóa dòng tiền và năng lực giao hàng đúng hạn (OTIF).",
    strengths: ["Quản trị chuỗi cung ứng tổng thể (SCM)", "Đàm phán thương mại quy mô lớn", "Quyết sách tài chính nhà máy", "Bản lĩnh lãnh đạo"],
    challenges: ["Áp đặt tiêu chuẩn quá cao cho cấp dưới", "Cần cân bằng giữa hiệu quả kinh tế và yếu tố con người"],
    recommendedRoles: [
      "Giám Đốc Điều Hành Chuỗi Cung Ứng (Supply Chain Director)",
      "Giám Đốc Vận Hành Nhà Máy (Chief Operating Officer - COO)",
      "Trưởng Phòng Thu Mua Chiến Lược (Strategic Procurement Head)",
      "Giám Đốc Tổng Kho Logistics WMS Vùng"
    ],
    suitableIndustries: ["Chuỗi cung ứng đa quốc gia", "Logistics cảng biển & Kho bãi", "Tập đoàn sản xuất FDI", "Chủ đầu tư KCN"],
    compatibility: [2, 4, 8, 22],
    adviceForRecruiter: "Vị trí lãnh đạo cấp cao hoặc điều hành chuỗi cung ứng lớn là 'sân khấu' hoàn hảo nhất cho con số 8."
  },
  9: {
    number: 9,
    title: "Nhà Lãnh Đạo Tầm Nhìn & Phát Triển Bền Vững (ESG)",
    element: "Hỏa / Nhân văn",
    keywords: ["Tầm nhìn", "Phát triển bền vững", "Chuyển đổi xanh", "Trách nhiệm xã hội", "Cố vấn"],
    workStyle: "Hướng đến các tiêu chuẩn sản xuất xanh, giảm phát thải carbon, xây dựng chuỗi cung ứng tuần hoàn và uy tín quốc tế cho nhà máy.",
    strengths: ["Chuyển đổi xanh ESG & Net Zero", "Đại diện tiếng nói Hiệp hội ngành hàng", "Chiến lược thương hiệu bền vững", "Thu hút nhân tài"],
    challenges: ["Đôi khi quá lý tưởng hóa thực tế sản xuất khắt khe", "Cần người hỗ trợ quản trị chi tiết số liệu"],
    recommendedRoles: [
      "Giám Đốc Phát Triển Bền Vững & Chuyển Đổi Xanh (ESG Director)",
      "Chủ Tịch / Tổng Thư Ký Hội / Hiệp Hội Doanh Nghiệp KCN",
      "Cố Vấn Chiến Lược Hội Nhập Chuỗi Cung Ứng Toàn Cầu",
      "Trưởng Ban Quan Hệ Chính Phủ & Đối Ngoại Tập Đoàn"
    ],
    suitableIndustries: ["Năng lượng tái tạo", "Hiệp hội & Tổ chức kết nối B2B", "Sản xuất đạt chứng chỉ xanh ESG", "Tư vấn chuỗi cung ứng"],
    compatibility: [3, 6, 9, 33],
    adviceForRecruiter: "Rất phù hợp cho vai trò lãnh đạo đại diện tổ chức, thúc đẩy các dự án hợp tác tầm cỡ quốc gia hoặc hiệp hội."
  },
  11: {
    number: 11,
    title: "Bậc Thầy Trực Giác & Cảm Hứng Đột Phá (Master Number)",
    element: "Ánh sáng / Trực giác",
    keywords: ["Trực giác nhạy bén", "Tầm nhìn dẫn đường", "Truyền cảm hứng", "Đột phá"],
    workStyle: "Có giác quan thứ sáu về xu hướng công nghệ sản xuất mới, khả năng kết nối con người và ý tưởng vượt ra khỏi khuôn mẫu cũ.",
    strengths: ["Dự báo xu hướng công nghệ", "Truyền cảm hứng cho đội ngũ kỹ sư", "Giải pháp sáng tạo khác biệt"],
    challenges: ["Dễ bị quá tải cảm xúc khi áp lực dồn dập", "Cần không gian tĩnh lặng để tái tạo năng lượng"],
    recommendedRoles: [
      "Kiến Trúc Sư Giải Pháp Nhà Máy Thông Minh (Smart Factory Architect)",
      "Chuyên Gia Cố Vấn Đổi Mới Sáng Tạo Doanh Nghiệp",
      "Trưởng Nhóm Nghiên Cứu Công Nghệ Mới (Emerging Tech Lead)"
    ],
    suitableIndustries: ["Chuyển đổi số nhà máy", "Công nghệ AI & IoT", "Tự động hóa thế hệ mới"],
    compatibility: [7, 11, 22],
    adviceForRecruiter: "Tạo điều kiện để ứng viên tham gia vào việc hoạch định các giải pháp công nghệ mang tính tương lai."
  },
  22: {
    number: 22,
    title: "Bậc Thầy Kiến Tạo Vĩ Mô & Tổng Công Trình Sư (Master Builder)",
    element: "Đất Mẹ / Kiến tạo",
    keywords: ["Kiến tạo vĩ mô", "Hiện thực hóa ước mơ lớn", "Năng lực thực thi phi thường", "Quy mô nghìn tỷ"],
    workStyle: "Biến những kế hoạch phức tạp nhất thành hiện thực; có tầm nhìn của số 11 kết hợp sự kỷ luật vững chắc của số 4.",
    strengths: ["Quy hoạch tổng thể KCN & Đại tổ hợp sản xuất", "Quản lý siêu dự án hàng tỷ USD", "Xây dựng hệ sinh thái công nghiệp"],
    challenges: ["Áp lực công việc khổng lồ", "Đòi hỏi rất cao ở đội ngũ cộng sự"],
    recommendedRoles: [
      "Tổng Giám Đốc / Chủ Đầu Tư Phát Triển Hạ Tầng KCN",
      "Tổng Công Trình Sư Thiết Kế Đại Dự Án Nhà Máy",
      "Chủ Tịch Hội Đồng Quản Trị Tập Đoàn Công Nghiệp"
    ],
    suitableIndustries: ["Quy hoạch & Xây dựng KCN", "Tổ hợp công nghiệp nặng", "Hạ tầng chuỗi cung ứng quốc gia"],
    compatibility: [4, 8, 22],
    adviceForRecruiter: "Đây là nhân tài hiếm có cho các dự án quy mô chiến lược cấp vùng và quốc gia."
  },
  33: {
    number: 33,
    title: "Bậc Thầy Cố Vấn & Khai Sáng Cộng Đồng (Master Teacher)",
    element: "Đại ngàn / Phụng sự",
    keywords: ["Phụng sự", "Cố vấn thông thái", "Đạo đức kinh doanh", "Nâng tầm cộng đồng"],
    workStyle: "Cống hiến hết mình cho sự phát triển của cộng đồng doanh nghiệp sản xuất, nâng chuẩn đạo đức nghề nghiệp và tay nghề lao động.",
    strengths: ["Cố vấn cấp cao", "Đào tạo thế hệ kế thừa", "Kết nối liên minh hiệp hội"],
    challenges: ["Dễ quên đi lợi ích bản thân vì trách nhiệm cộng đồng"],
    recommendedRoles: [
      "Viện Trưởng / Giám Đốc Viện Nghiên Cứu Chuỗi Cung Ứng",
      "Chủ Tịch Liên Minh Hiệp Hội Doanh Nghiệp Sản Xuất",
      "Chuyên Gia Cố Vấn Cấp Cao Ban Chiến Lược Tập Đoàn"
    ],
    suitableIndustries: ["Đào tạo nhân lực chất lượng cao", "Tổ chức xúc tiến thương mại quốc tế", "Viện chính sách công nghiệp"],
    compatibility: [6, 9, 33],
    adviceForRecruiter: "Phù hợp bậc nhất cho vị trí Cố vấn cấp cao, Viện trưởng đào tạo hoặc Lãnh đạo Hiệp hội."
  }
};

/**
 * Calculate compatibility between a candidate (Life Path) and a Job/Role Requirement
 * @param {number} lifePathNumber 
 * @param {string} roleTitle 
 * @param {string} industry 
 */
export function calculateRoleMatchScore(lifePathNumber, roleTitle = '', industry = '') {
  const profile = NUMEROLOGY_PROFILES[lifePathNumber] || NUMEROLOGY_PROFILES[4];
  let score = 75; // Baseline high match

  const lowerTitle = roleTitle.toLowerCase();
  const lowerInd = industry.toLowerCase();

  // Role keyword match boosts
  profile.recommendedRoles.forEach(r => {
    if (lowerTitle.includes(r.toLowerCase().slice(0, 8))) {
      score += 15;
    }
  });

  // Industry match boosts
  profile.suitableIndustries.forEach(ind => {
    if (lowerInd.includes(ind.toLowerCase().slice(0, 5))) {
      score += 8;
    }
  });

  // Number specific natural alignments
  if ([4, 7].includes(lifePathNumber) && (lowerTitle.includes('qa') || lowerTitle.includes('qc') || lowerTitle.includes('kỹ sư') || lowerTitle.includes('bảo trì') || lowerTitle.includes('cnc'))) {
    score += 10;
  }
  if ([1, 8, 22].includes(lifePathNumber) && (lowerTitle.includes('quản đốc') || lowerTitle.includes('giám đốc') || lowerTitle.includes('trưởng phòng') || lowerTitle.includes('quản lý'))) {
    score += 12;
  }
  if ([2, 5, 6].includes(lifePathNumber) && (lowerTitle.includes('logistics') || lowerTitle.includes('hải quan') || lowerTitle.includes('nhân sự') || lowerTitle.includes('thu mua'))) {
    score += 10;
  }

  // Cap between 68% and 99%
  return Math.min(99, Math.max(68, score));
}
