import React, { useState, useEffect } from 'react';

import { Video } from 'lucide-react';

import { getActiveRelatedPrograms } from '../data/servicesData';

import { PageIntro, Action, Photo, SectionHeading, ProcessStrip, ClosingNote } from '../components/services/EcosystemPageKit';
import { MEDIA_CONTEXTS } from './ecosystemPageContent';

export default function MediaBrandingServicePage() {

  const relatedPrograms = getActiveRelatedPrograms();
  const [activeContextTab, setActiveContextTab] = useState('profile');

  // SEO Setup (Section 16 Spec 15.txt)
  useEffect(() => {
    document.title = 'Hồ Sơ, Video & Truyền Thông Doanh Nghiệp | CHUOICUNGUNG.COM';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Hồ Sơ, Video & Truyền Thông Doanh Nghiệp B2B",
      "description": "Chuẩn hóa hồ sơ năng lực, video giới thiệu 1 phút, ảnh thực tế nhà xưởng và nội dung catalogue để doanh nghiệp sử dụng trên website và trong các chương trình kết nối.",
      "provider": {
        "@type": "Organization",
        "name": "CHUOICUNGUNG.COM",
        "url": "https://chuoicungung.com"
      },
      "url": "https://chuoicungung.com/dich-vu/truyen-thong-doanh-nghiep",
      "serviceType": "Industrial Media Branding and Supplier Profile Standardization"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'media-branding-service-schema';
    script.text = JSON.stringify(schemaData);
    const old = document.getElementById('media-branding-service-schema');
    if (old) old.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('media-branding-service-schema');
      if (el) el.remove();
    };
  }, []);

  const scrollToDeliverables = () => {
    const el = document.getElementById('hang-muc-dich-vu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const context = MEDIA_CONTEXTS[activeContextTab];
  return (
    <div className="ec-page ec-media-page">
      <section className="ec-media-hero ec-container">
        <PageIntro label="Hồ sơ & Truyền thông doanh nghiệp" title="Cho khách thấy năng lực. Trước khi gặp bạn." description="Biến thông tin, nhà xưởng và sản phẩm thành bộ hồ sơ, hình ảnh và video dễ hiểu, dễ dùng.">
          <Action to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep">Gửi yêu cầu nội dung</Action>
          <Action onClick={scrollToDeliverables} secondary>Xem hạng mục</Action>
        </PageIntro>
        <div className="ec-feature-copy"><p>Hồ sơ năng lực.<br />Video giới thiệu.<br />Ảnh nhà xưởng.<br />Catalogue sản phẩm.</p></div>
        <Photo src="/images/ecosystem/media-profile.jpg" alt="Đội quay phim ghi lại năng lực sản xuất tại nhà máy cơ khí" priority />
      </section>

      <section id="hang-muc-dich-vu" className="ec-section ec-container">
        <SectionHeading title="Bốn hạng mục. Một câu chuyện nhất quán.">Chọn riêng từng phần hoặc phối hợp thành bộ tư liệu dùng cho doanh nghiệp.</SectionHeading>
        <div className="ec-media-gallery">
          <article className="ec-media-item"><Photo src="/images/services/matchmaking-samples-v1.jpg" alt="Tài liệu năng lực cùng mẫu sản phẩm cơ khí trên bàn" /><div><h3>Hồ sơ năng lực</h3><p>Ngành cung ứng, sản phẩm chủ lực, năng lực sản xuất và đầu mối liên hệ được trình bày rõ.</p><div className="ec-actions"><Action to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep" secondary>Chuẩn hóa hồ sơ</Action></div></div></article>
          <article className="ec-media-item"><Photo src="/images/ecosystem/factory.jpg" alt="Không gian sản xuất và kỹ sư nhà máy" /><div><h3>Video & Ảnh nhà xưởng</h3><p>Video giới thiệu ngắn và bộ ảnh thiết bị, sản phẩm, quy trình theo danh sách được phép ghi hình.</p></div></article>
          <article className="ec-media-item"><Photo src="/images/ecosystem/catalogue.jpg" alt="Bộ catalogue giới thiệu doanh nghiệp và năng lực cung ứng" /><div><h3>Catalogue sản phẩm</h3><p>Nhóm sản phẩm, thông số và liên hệ được sắp xếp để khách dễ tra cứu, dùng cho bản in hoặc bản số.</p></div></article>
        </div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Dùng ở nơi khách đang tìm hiểu bạn." />
        <div className="ec-modes" aria-label="Ngữ cảnh sử dụng nội dung">
          {Object.entries(MEDIA_CONTEXTS).map(([key, item]) => <button key={key} type="button" className="ec-choice" aria-pressed={activeContextTab === key} onClick={() => setActiveContextTab(key)}>{item.label}</button>)}
        </div>
        <div className="ec-context-panel" aria-live="polite"><h3>{context.title}</h3><p>{context.description}</p><div className="ec-actions"><Action to={context.route} secondary>{context.action}</Action></div></div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Doanh nghiệp duyệt trước khi công bố." />
        <ProcessStrip steps={[['Nhận đề bài', 'Mục đích sử dụng, ngành và tư liệu sẵn có.'], ['Sản xuất nội dung', 'Viết, chụp hoặc quay theo phạm vi đã thống nhất.'], ['Bạn kiểm tra', 'Đối chiếu năng lực, thông số, hình ảnh và liên hệ.'], ['Bàn giao & Sử dụng', 'Công bố bản đã duyệt tại các kênh được phép.']]} />
        <p className="ec-note mt-8">Không tự công bố khu vực nhạy cảm, khách hàng, chứng nhận hay dữ liệu sản xuất khi chưa được phép. Làm nội dung không đồng nghĩa với xác minh nhà cung ứng.</p>
      </section>

      {relatedPrograms.length > 0 && <section className="ec-section ec-container">
        <SectionHeading title="Chuẩn bị trước một chương trình kết nối." />
        <div className="ec-programs">{relatedPrograms.slice(0, 2).map(program => <article key={program.id} className="ec-program"><h3>{program.title}</h3><div className="ec-program-meta"><span>{program.date}</span><span>{program.location}</span></div><div className="ec-actions"><Action to={`/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep&programId=${program.id}`} secondary>Chuẩn bị bộ nội dung</Action></div></article>)}</div>
      </section>}

      <ClosingNote title="Bắt đầu từ tư liệu bạn đang có." description="Gửi mục đích sử dụng và hạng mục cần làm. Phạm vi, lịch sản xuất và chi phí được xác nhận theo đề bài.">
        <Action to="/yeu-cau-dich-vu?service=truyen-thong-doanh-nghiep">Trao đổi đề bài</Action>
      </ClosingNote>
    </div>
  );
}
