import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Check, CalendarDays, MapPin } from 'lucide-react';
import { MATCHMAKING_MODELS, MATCHMAKING_ADDONS, getActiveRelatedPrograms } from '../data/servicesData';
import './MatchmakingServicePage.css';

const REQUEST_URL = '/yeu-cau-dich-vu?service=to-chuc-ket-noi';
// Replace these illustrations with approved event photographs when available.
const PHOTOS = {
  meeting: '/images/services/executive_uniform_meeting.jpg',
  samples: '/images/services/matchmaking-samples-v1.jpg',
};

const FORMATS = [
  { id: 'plant-sourcing', audience: 'Nhà máy · Bên mua', title: 'Tìm nguồn cho một nhà máy' },
  { id: 'kcn-expo', audience: 'KCN · Hội / Hiệp hội', title: 'Kết nối cho một cụm doanh nghiệp' },
  { id: 'joint-booth', audience: 'Nhóm nhà cung ứng · Chi hội', title: 'Cùng hiện diện tại hội chợ' },
  { id: 'pitching-session', audience: 'Doanh nghiệp công nghệ · Giải pháp', title: 'Giới thiệu giải pháp với bên mua' },
];

const PHASES = [
  { name: 'Trước cuộc gặp', title: 'Hiểu nhu cầu. Chuẩn bị đúng người.',
    items: ['Danh mục mua sắm, thông số và tiêu chí lựa chọn', 'Hồ sơ năng lực và danh sách đối tác đề xuất', 'Lịch hẹn, tài liệu trao đổi và đầu mối tham gia'],
    receipt: 'Đầu ra: nhu cầu được xác nhận và kế hoạch cuộc gặp.' },
  { name: 'Trong cuộc gặp', title: 'Trao đổi có trọng tâm. Ghi nhận có trách nhiệm.',
    items: ['Xác nhận đại diện và điều phối bàn làm việc', 'Ghi nhận nhu cầu phát sinh, yêu cầu mẫu và báo giá', 'Chốt người phụ trách, bước tiếp theo và thời hạn'],
    receipt: 'Đầu ra: ghi nhận cuộc gặp và các việc cần tiếp tục.' },
  { name: 'Sau cuộc gặp', title: 'Theo dõi đầu việc. Nhìn vào kết quả thực.',
    items: ['Cập nhật tiến độ mẫu thử, báo giá và phản hồi', 'Ghi nhận kết quả đánh giá hoặc tình trạng đàm phán', 'Tổng hợp báo cáo và khuyến nghị bước tiếp theo'],
    receipt: 'Đầu ra: bảng tiến độ và báo cáo kết quả kết nối.' },
];

const FAQS = [
  ['Chưa có danh sách tham gia?', 'Có thể bắt đầu bằng mục tiêu và nhóm doanh nghiệp anh/chị muốn kết nối. CCU cùng đơn vị tổ chức làm rõ nhu cầu, tiêu chí mời và nguồn dữ liệu có thể sử dụng trước khi đề xuất phương án. Chưa cần chốt ngay quy mô sự kiện.'],
  ['Có bao gồm gian hàng?', 'Các hạng mục này có thể được bổ sung nếu phù hợp. Chi phí và đầu ra của nhiếp ảnh, video, catalogue, vật phẩm hoặc thi công gian hàng được tách rõ trong đề xuất; không mặc định đi kèm dịch vụ kết nối.'],
  ['Theo dõi trong bao lâu?', 'Thời gian theo dõi được thống nhất theo mục tiêu và nguồn lực của từng chương trình. Phạm vi theo dõi được chốt riêng, không mặc định cùng một thời hạn cho mọi yêu cầu.'],
  ['Có cam kết hợp đồng?', 'Không. CCU không cam kết số hợp đồng hoặc doanh thu. Dịch vụ tập trung vào chuẩn bị, điều phối và theo dõi đầu việc; quyết định thử mẫu, báo giá hay ký kết thuộc về các doanh nghiệp tham gia.'],
];

function BriefLink({ format, children = 'Gửi đề bài', className = 'mm-button' }) {
  return <Link className={className} to={format ? REQUEST_URL + '&format=' + format : REQUEST_URL}>
    <span>{children}</span><ArrowUpRight size={20} aria-hidden="true" />
  </Link>;
}

export default function MatchmakingServicePage() {
  const [activeStage, setActiveStage] = useState(0);
  const relatedPrograms = getActiveRelatedPrograms();
  const existingIds = new Set(MATCHMAKING_MODELS.map(model => model.id));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Tổ chức kết nối doanh nghiệp B2B | CHUOICUNGUNG.COM';
    const description = 'Tổ chức kết nối B2B cho nhà máy, KCN, hội và nhà cung ứng: chuẩn hóa nhu cầu, sắp xếp cuộc gặp, theo dõi mẫu thử, báo giá và đầu việc.';
    const existingMeta = document.querySelector('meta[name="description"]');
    const previousDescription = existingMeta?.getAttribute('content');
    const meta = existingMeta || document.createElement('meta');
    meta.name = 'description';
    meta.content = description;
    if (!existingMeta) document.head.appendChild(meta);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'matchmaking-service-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Service',
      name: 'Tổ chức chương trình kết nối doanh nghiệp theo nhu cầu thật', description,
      provider: { '@type': 'Organization', name: 'CHUOICUNGUNG.COM', url: 'https://chuoicungung.com' },
      url: 'https://chuoicungung.com/dich-vu/to-chuc-ket-noi',
      serviceType: 'B2B Matchmaking and Supply Chain Sourcing Event Management',
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
      document.title = previousTitle;
      if (!existingMeta) meta.remove();
      else if (previousDescription == null) meta.removeAttribute('content');
      else meta.setAttribute('content', previousDescription);
    };
  }, []);

  const formatImages = {
    'plant-sourcing': PHOTOS.samples,
    'kcn-expo': '/images/ecosystem/association.jpg',
    'joint-booth': '/images/ecosystem/remote-presence.jpg',
    'pitching-session': PHOTOS.meeting,
  };
  const formatSummaries = {
    'plant-sourcing': 'Đối chiếu danh mục mua sắm với năng lực nhà cung ứng, rồi sắp xếp cuộc gặp 1:1.',
    'kcn-expo': 'Cùng KCN, hội hoặc hiệp hội tạo một ngày kết nối theo ngành hàng và nhu cầu.',
    'joint-booth': 'Nhóm doanh nghiệp giới thiệu năng lực và sản phẩm trong một không gian chung.',
    'pitching-session': 'Đưa công nghệ hoặc giải pháp đến nhóm bên mua có nhu cầu liên quan.',
  };
  return <div className="mm-page">
    <section className="mm-hero relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center" aria-labelledby="mm-title">
      {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 4 */}
      <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
        <img 
          src={PHOTOS.meeting} 
          width="1536" 
          height="1024" 
          fetchpriority="high" 
          decoding="async" 
          alt="Minh họa nhóm chuyên viên mua hàng và sản xuất trao đổi mẫu linh kiện tại bàn làm việc" 
          className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-25 sm:opacity-40 lg:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <div className="mm-container relative z-10 w-full">
        <nav className="mm-breadcrumb" aria-label="Đường dẫn trang">
          <Link to="/">Trang chủ</Link><ChevronRight size={16} aria-hidden="true" />
          <Link to="/dich-vu">Dịch vụ</Link><ChevronRight size={16} aria-hidden="true" />
          <span aria-current="page">Tổ chức kết nối B2B</span>
        </nav>
        <div className="mm-hero-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
          <div className="mm-hero-copy max-w-xl">
            <p className="mm-service-label">Tổ chức kết nối doanh nghiệp</p>
            <h1 id="mm-title" className="text-4xl sm:text-5xl lg:text-[54px] font-black font-heading tracking-tight leading-[1.08] text-slate-950 uppercase mb-4">Kết nối từ<br />{' '}nhu cầu thật.</h1>
            <p className="mm-lede">Đúng người để trao đổi.<br />{' '}Rõ việc để đi tiếp.</p>
            <p className="mm-hero-description">CCU cùng doanh nghiệp, KCN và hội chuẩn bị nhu cầu, điều phối cuộc gặp, theo dõi đầu việc.</p>
            <div className="mm-actions">
              <BriefLink />
              <Link className="mm-text-link" to="/chuong-trinh">Xem chương trình <ArrowRight size={20} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
        <div className="mm-hero-note">
          <p>Mỗi kết nối cần một đầu việc có thể tiếp tục.</p>
          <a href="#mm-process">Cách CCU triển khai <ChevronDown size={20} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <section className="mm-section mm-container" aria-labelledby="mm-formats-title"><header className="mm-section-head"><h2 id="mm-formats-title">Bắt đầu từ mục tiêu.<br />{' '}Chọn hình thức phù hợp.</h2><p>Chưa cần chốt quy mô sự kiện. Anh/chị muốn giải quyết nhu cầu nào?</p></header>
      <div className="mm-format-list">{FORMATS.filter(item => existingIds.has(item.id)).map((format, index) => <article className="mm-format" key={format.id} data-format={format.id}>
        <figure><img src={formatImages[format.id]} width="1536" height="1024" loading="lazy" decoding="async" alt={'Minh họa hình thức ' + format.title.toLowerCase()} /></figure>
        <div className="mm-format-copy"><p className="mm-format-audience"><span>0{index + 1}</span>{format.audience}</p><h3>{format.title}</h3><p>{formatSummaries[format.id]}</p><BriefLink format={format.id} className="mm-text-link">Chọn hình thức này</BriefLink></div>
      </article>)}</div>
    </section>
    <section id="mm-process" className="mm-process" aria-labelledby="mm-process-title"><div className="mm-container">
      <header className="mm-section-head"><h2 id="mm-process-title">Cuộc gặp là điểm bắt đầu.<br />{' '}Đầu việc mới là điều cần theo dõi.</h2><p>Một quy trình xuyên suốt, từ đề bài đến phản hồi sau chương trình.</p></header>
      <div className="mm-process-grid"><figure className="mm-process-photo"><img src={PHOTOS.samples} width="1536" height="1024" loading="lazy" decoding="async" alt="Minh họa kỹ sư trao đổi mẫu linh kiện và bản vẽ kỹ thuật" /></figure>
        <div className="mm-stages"><div className="mm-stage-buttons" role="group" aria-label="Giai đoạn triển khai">{PHASES.map((phase, index) => <button key={phase.name} id={'mm-stage-' + index} type="button" aria-label={phase.name} aria-pressed={activeStage === index} aria-controls={'mm-phase-' + index} onClick={() => setActiveStage(index)}><span className="mm-stage-index">0{index + 1}</span><span className="mm-stage-full">{phase.name}</span><span className="mm-stage-short">{['Chuẩn bị', 'Điều phối', 'Theo dõi'][index]}</span></button>)}</div>
          {PHASES.map((phase, index) => <article key={phase.name} id={'mm-phase-' + index} className="mm-phase" hidden={activeStage !== index} aria-labelledby={'mm-stage-' + index}><h3>{phase.title}</h3><ul>{phase.items.map(item => <li key={item}><Check size={20} aria-hidden="true" />{item}</li>)}</ul><p className="mm-phase-receipt">{phase.receipt}</p></article>)}
        </div>
      </div>
      <div className="mm-next-action"><p>Chốt sau mỗi cuộc gặp</p><dl><div><dt>Người phụ trách</dt><dd>Ai tiếp tục xử lý?</dd></div><div><dt>Bước tiếp theo</dt><dd>Mẫu thử, báo giá hay trao đổi thêm?</dd></div><div><dt>Hạn phản hồi</dt><dd>Khi nào hai bên cập nhật?</dd></div></dl></div>
    </div></section>
    <section className="mm-section mm-container" aria-labelledby="mm-handover-title"><header className="mm-section-head"><h2 id="mm-handover-title">Bàn giao theo phạm vi đã thống nhất.</h2><p>Chốt hạng mục và tiêu chí nghiệm thu trước khi triển khai.</p></header>
      <dl className="mm-handover-list">{[
        ['Hồ sơ chương trình', 'Trang chương trình, biểu mẫu và dữ liệu đăng ký theo quyền truy cập được thống nhất.'],
        ['Phương án kết nối', 'Danh sách đối tác đề xuất, tiêu chí đối chiếu và lịch gặp B2B.'],
        ['Đầu việc sau cuộc gặp', 'Người phụ trách, yêu cầu mẫu, báo giá và thời hạn phản hồi.'],
        ['Kết quả theo dõi', 'Bảng tiến độ và báo cáo kết quả do các bên xác nhận.'],
      ].map(([name, note], index) => <div key={name}><span aria-hidden="true">0{index + 1}</span><dt>{name}</dt><dd>{note}</dd></div>)}</dl>
      <details className="mm-ai-note"><summary>AI hỗ trợ. Con người xác nhận.<ChevronDown size={20} aria-hidden="true" /></summary><p>SUPPI hỗ trợ làm rõ nhu cầu và tìm thông tin; CHAINY hỗ trợ tổng hợp, đề xuất đầu việc. Khả năng sử dụng tùy cấu hình triển khai. AI không thay thế quyết định của doanh nghiệp, không tự xác nhận năng lực hay công bố kết quả.</p></details>
    </section>
    <section className="mm-commercial" aria-labelledby="mm-commercial-title"><div className="mm-container mm-commercial-grid"><div><h2 id="mm-commercial-title">Phạm vi rõ.<br />{' '}Chi phí rõ.</h2><p>Đề xuất theo mục tiêu, ngành hàng, địa bàn, quy mô và thời gian theo dõi. Làm rõ đề bài trước khi báo giá.</p><BriefLink /></div>
      <div className="mm-commercial-notes"><h3>Những nguyên tắc không thay đổi</h3><ul><li>Không cam kết số hợp đồng hoặc doanh thu.</li><li>Tài trợ không làm thay đổi ưu tiên matching.</li><li>Chỉ chia sẻ dữ liệu trong phạm vi được phép.</li><li>Hạng mục bổ sung được báo giá và chốt riêng.</li></ul><details className="mm-addons"><summary>Hạng mục có thể bổ sung <ChevronDown size={20} aria-hidden="true" /></summary><ul>{MATCHMAKING_ADDONS.map(item => <li key={item.id}>{item.name}</li>)}</ul></details></div>
    </div></section>
    {relatedPrograms.length > 0 && <section className="mm-section mm-container mm-programs" aria-labelledby="mm-programs-title"><header className="mm-section-head"><h2 id="mm-programs-title">Khám phá chương trình.</h2><p>Thông tin theo dữ liệu hiện có của website. Xem lịch và điều kiện tại trang chi tiết.</p></header><div className="mm-program-list">{relatedPrograms.map(program => <Link key={program.id} className="mm-program" to={'/chuong-trinh/' + program.id}><div><h3>{program.name}</h3><div className="mm-program-meta">{program.date && <span><CalendarDays size={16} aria-hidden="true" />{program.date}</span>}{program.location && <span><MapPin size={16} aria-hidden="true" />{program.location}</span>}</div></div><span className="mm-program-action">Xem chi tiết <ArrowUpRight size={20} aria-hidden="true" /></span></Link>)}</div></section>}
    <section className="mm-section mm-container mm-faq" aria-labelledby="mm-faq-title"><h2 id="mm-faq-title">Trước khi gửi đề bài.</h2><div>{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>
    <section className="mm-close" aria-labelledby="mm-close-title"><div className="mm-container mm-close-grid"><div><p className="mm-service-label">Cùng xây dựng phương án</p><h2 id="mm-close-title">Doanh nghiệp cần gì<br />{' '}từ cuộc kết nối này?</h2><p>Gửi mục tiêu, nhóm doanh nghiệp, địa bàn và thời gian dự kiến. Chưa có kế hoạch hoàn chỉnh vẫn có thể bắt đầu.</p><BriefLink /><p className="mm-close-note">Chuyển đến biểu mẫu yêu cầu; chưa phải xác nhận đặt dịch vụ.</p></div><figure><img src="/images/ecosystem/association.jpg" width="1536" height="1024" loading="lazy" decoding="async" alt="Minh họa đại diện doanh nghiệp trao đổi về cơ hội hợp tác" /></figure></div><div className="mm-container mm-other-services"><Link className="mm-text-link" to="/dich-vu">Xem các dịch vụ khác <ArrowRight size={20} aria-hidden="true" /></Link></div></section>
  </div>;
}
