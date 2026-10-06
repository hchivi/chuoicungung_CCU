// Presentation copy only. Existing data layers remain responsible for records and submissions.
export const PARTNER_STORIES = {
  ASSOCIATION: {
    label: 'Hội & Hiệp hội', title: 'Đưa năng lực hội viên đến đúng nhu cầu.',
    description: 'Phối hợp tổ chức kết nối theo ngành, giới thiệu hội viên và tiếp nhận nhu cầu từ doanh nghiệp mua hàng.',
    image: '/images/ecosystem/association.jpg', alt: 'Các đại biểu trao đổi tại không gian hội nghị doanh nghiệp',
    points: ['Chọn ngành và nhóm hội viên tham gia.', 'Cùng xây dựng chương trình kết nối.', 'Có đầu mối theo dõi sau chương trình.'],
    route: '/dich-vu/to-chuc-ket-noi?source=partnership&partnerType=association', routeLabel: 'Xem dịch vụ kết nối'
  },
  INDUSTRIAL_PARK: {
    label: 'KCN & Ban quản lý', title: 'Kết nối nguồn cung quanh khu công nghiệp.',
    description: 'Phối hợp với KCN và ban quản lý để thu thập nhu cầu nhà máy, lựa chọn ngành cung ứng và tổ chức chương trình phù hợp địa bàn.',
    image: '/images/ecosystem/industrial-park.jpg', alt: 'Nhà xưởng và hạ tầng giao thông trong khu công nghiệp',
    points: ['Tập hợp nhu cầu mua hàng trong KCN.', 'Mời nguồn cung phù hợp với nhà máy.', 'Thống nhất địa điểm, quy mô và cách phối hợp.'],
    route: '/dich-vu/to-chuc-ket-noi?source=partnership&partnerType=industrial-park', routeLabel: 'Xem dịch vụ kết nối'
  },
  SPONSOR: {
    label: 'Nhà tài trợ', title: 'Đồng hành với hoạt động có phạm vi rõ.',
    description: 'Chọn chương trình, ấn phẩm, nội dung hoặc vật phẩm để hiện diện thương hiệu theo quyền lợi đã thống nhất.',
    image: '/images/ecosystem/remote-presence.jpg', alt: 'Không gian giới thiệu hồ sơ và sản phẩm tại bàn kết nối',
    points: ['Chọn hoạt động và hình thức đóng góp.', 'Chốt vị trí, thời hạn và quyền lợi.', 'Đối soát các hạng mục khi bàn giao.'],
    route: '/tai-tro', routeLabel: 'Xem hình thức tài trợ'
  },
  FOUNDING_PARTNER: {
    label: 'Founding Partner', title: 'Xây dựng hiện diện theo chuyên mục ngành.',
    description: 'Dành cho doanh nghiệp muốn đồng hành với chuyên mục hoặc nhóm từ khóa phù hợp năng lực cung ứng.',
    image: '/images/ecosystem/founding-campus.jpg', alt: 'Kiến trúc khuôn viên công nghiệp hiện đại',
    points: ['Chọn chuyên mục và phạm vi từ khóa.', 'Thống nhất gói hiện diện thương mại.', 'Không phải góp vốn hay mua thứ hạng matching.'],
    route: '/founding-partner', routeLabel: 'Khám phá Founding Partner'
  },
  DEVELOPMENT_PARTNER: {
    label: 'Đối tác phát triển', title: 'Cùng mở rộng kết nối tại địa phương.',
    description: 'Phối hợp phát triển quan hệ doanh nghiệp, giới thiệu nhu cầu và triển khai hoạt động tại ngành hoặc địa bàn phù hợp.',
    image: '/images/ecosystem/factory.jpg', alt: 'Kỹ sư trao đổi trong không gian nhà máy sản xuất',
    points: ['Đăng ký ngành hoặc địa bàn phụ trách.', 'Thống nhất vai trò và cách ghi nhận.', 'Theo dõi từng hoạt động phối hợp.'],
    route: '/doi-tac-phat-trien', routeLabel: 'Xem cơ chế phối hợp'
  },
  ADVISOR: {
    label: 'Chuyên gia & Cố vấn', title: 'Đóng góp chuyên môn cho bài toán cụ thể.',
    description: 'Đề xuất lĩnh vực tư vấn, nội dung chuyên môn hoặc hoạt động hỗ trợ doanh nghiệp trong chuỗi cung ứng.',
    image: '/images/services/matchmaking-meeting-v1.jpg', alt: 'Nhóm chuyên môn trao đổi bản vẽ và mẫu chi tiết cơ khí',
    points: ['Nêu lĩnh vực và kinh nghiệm chuyên môn.', 'Chọn hình thức tham gia phù hợp.', 'Thống nhất trách nhiệm và phạm vi tư vấn.']
  },
  INVESTOR: {
    label: 'Nhà đầu tư', title: 'Trao đổi riêng về định hướng đầu tư.',
    description: 'Dành cho tổ chức và nhà đầu tư muốn tìm hiểu định hướng phát triển CCU, không phải đăng ký tài trợ hay mua gói hiện diện.',
    image: '/images/ecosystem/partnership.jpg', alt: 'Đại diện doanh nghiệp trao đổi tại phòng họp',
    points: ['Giới thiệu tổ chức và mục tiêu đầu tư.', 'Nêu phạm vi thông tin muốn trao đổi.', 'Thống nhất đầu mối và bước làm việc tiếp theo.']
  }
};

export const MERCH_STORIES = {
  'kit-tham-du-ngay-hoi': { title: 'Bộ đại biểu & Hội nghị', description: 'Thẻ tên, dây đeo, túi và sổ tay cho trải nghiệm tham dự đồng bộ.', image: '/images/ecosystem/corporate-gifts.jpg', alt: 'Bộ thẻ đeo, sổ tay và quà tặng doanh nghiệp' },
  'kit-nhan-dien-gian-hang': { title: 'Bộ nhận diện gian hàng', description: 'Đồng phục, bảng QR và tài liệu giúp khách dễ nhận ra và liên hệ doanh nghiệp.', image: '/images/founding-partners/products/ao-thun-dong-phuc.jpg', alt: 'Áo polo đồng phục doanh nghiệp' },
  'kit-hoat-dong-doanh-nghiep': { title: 'Bộ sự kiện doanh nghiệp', description: 'Áo, nón và quà tặng cho hoạt động nội bộ, ngày hội và sự kiện nhà máy.', image: '/images/founding-partners/products/qua-tang-doanh-nghiep.jpg', alt: 'Các vật phẩm quà tặng dành cho doanh nghiệp' },
  'kit-dat-theo-yeu-cau-rieng': { title: 'Đặt theo danh sách riêng', description: 'Gửi quy cách và số lượng từng món để tìm nguồn cung, duyệt mẫu và chốt tiến độ.', image: '/images/founding-partners/products/may-tui-vai.jpg', alt: 'Túi vải theo quy cách đặt hàng' }
};

export const SPONSOR_STORIES = {
  PROGRAM: { label: 'Chương trình', title: 'Hiện diện tại chương trình kết nối', description: 'Logo, không gian giới thiệu và nội dung đồng hành theo quy mô từng chương trình.', image: '/images/ecosystem/remote-presence.jpg', alt: 'Bàn giới thiệu năng lực và mẫu sản phẩm tại không gian kết nối' },
  CATALOGUE: { label: 'Catalogue', title: 'Đồng hành cùng ấn phẩm ngành', description: 'Vị trí thương hiệu và nội dung trong catalogue theo ấn bản, phạm vi và thời hạn đã chọn.', image: '/images/ecosystem/catalogue.jpg', alt: 'Ấn phẩm giới thiệu năng lực nhà cung ứng' },
  MEDIA: { label: 'Nội dung', title: 'Góp sức cho nội dung chuyên môn', description: 'Đồng hành với video, ảnh hoặc nội dung hữu ích cho doanh nghiệp trong hệ sinh thái.', image: '/images/ecosystem/media-profile.jpg', alt: 'Đội quay phim ghi hình dây chuyền sản xuất' },
  MERCHANDISE: { label: 'Vật phẩm', title: 'Thương hiệu trên vật phẩm chương trình', description: 'Tài trợ sản phẩm, quà tặng hoặc chi phí vật phẩm theo mẫu và kế hoạch bàn giao.', image: '/images/ecosystem/corporate-gifts.jpg', alt: 'Đồng phục và vật phẩm doanh nghiệp' }
};

export const SPONSOR_RIGHTS = {
  PROGRAM: ['PROGRAM_LOGO', 'PROGRAM_BOOTH', 'PROGRAM_CONTENT', 'PROGRAM_STAGE_RECOGNITION', 'REPORT', 'OTHER'],
  CATALOGUE: ['CATALOGUE_PLACEMENT', 'CATALOGUE_CONTENT', 'REPORT', 'OTHER'],
  MEDIA: ['VIDEO_PRODUCTION', 'PHOTO_LIBRARY', 'REPORT', 'OTHER'],
  MERCHANDISE: ['MERCHANDISE_BRANDING', 'REPORT', 'OTHER'],
};

export const MEDIA_CONTEXTS = {
  profile: { label: 'Hồ sơ online', title: 'Một bộ hồ sơ, dùng cho nhiều điểm chạm.', description: 'Đặt năng lực, sản phẩm và đầu mối liên hệ trong hồ sơ doanh nghiệp để khách xem trước khi trao đổi.', route: '/nha-cung-ung', action: 'Xem hồ sơ nhà cung ứng' },
  program: { label: 'Chương trình', title: 'Giới thiệu ngắn để cuộc trao đổi đi sâu hơn.', description: 'Dùng video, ảnh và catalogue khi giới thiệu tại gian hàng, pitching hoặc phiên kết nối.', route: '/chuong-trinh', action: 'Xem chương trình' },
  remote: { label: 'Hiện diện từ xa', title: 'Tư liệu thay bạn giới thiệu năng lực.', description: 'Cung cấp bộ nội dung đã duyệt cho điều phối viên giới thiệu khi doanh nghiệp chưa thể có mặt.', route: '/dich-vu/hien-dien-tu-xa', action: 'Xem hiện diện từ xa' }
};
