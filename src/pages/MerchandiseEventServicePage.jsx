import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ChevronRight, ChevronDown } from 'lucide-react';

import { MERCHANDISE_KITS, COORDINATION_MODES } from '../data/merchandiseEventData';
import { PROGRAMS_DATA } from '../data/programsData';

import { PageIntro, Action, Photo, SectionHeading, ProcessStrip, ClosingNote, Modal } from '../components/services/EcosystemPageKit';
import { MERCH_STORIES } from './ecosystemPageContent';

export default function MerchandiseEventServicePage() {

  // State
  const [selectedKit, setSelectedKit] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [activeCoordinationMode, setActiveCoordinationMode] = useState('PLATFORM_COORDINATION');

  // SEO Setup (Section 16 Spec 16.txt)
  useEffect(() => {
    document.title = 'Vật Phẩm Doanh Nghiệp & Sự Kiện | CHUOICUNGUNG.COM';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Tiếp nhận yêu cầu đồng phục, thẻ QR, túi, quà tặng và vật phẩm chương trình theo số lượng, quy cách, thời gian và địa điểm bàn giao.';

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = 'https://chuoicungung.com/dich-vu/vat-pham-su-kien';
  }, []);

  const scrollToKits = () => {
    const el = document.getElementById('cac-bo-vat-pham');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Lấy các chương trình thật có nhu cầu vật phẩm
  const relatedPrograms = (PROGRAMS_DATA || []).slice(0, 2);

  const mode = COORDINATION_MODES[activeCoordinationMode];
  return (
    <div className="ec-page ec-merch-page">
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        {/* Right Half Panoramic Showcase Visual with Smooth Gradient Fade matching Image 2 */}
        <div className="absolute top-0 right-0 w-full lg:w-[66%] xl:w-[60%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/images/ecosystem/corporate-gifts.jpg" 
            alt="Đồng phục, thẻ đeo, sổ tay và bình giữ nhiệt trong không gian trưng bày sáng" 
            className="w-full h-full object-cover object-center scale-105 pointer-events-none select-none opacity-25 sm:opacity-40 lg:opacity-100 transition-opacity"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/70 lg:via-white/35 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>

        <div className="ec-container relative z-10 w-full">
          <nav className="ec-breadcrumb" aria-label="Đường dẫn trang">
            <Link to="/">Trang chủ</Link><ChevronRight size={16} aria-hidden="true" />
            <Link to="/dich-vu">Dịch vụ</Link><ChevronRight size={16} aria-hidden="true" />
            <span aria-current="page">Vật phẩm doanh nghiệp & Sự kiện</span>
          </nav>
          <div className="max-w-xl">
            <PageIntro
              label="Vật phẩm doanh nghiệp & Sự kiện"
              title={<>Một bộ nhận diện.<br />Nhiều điểm chạm.</>}
              description="Đồng phục, thẻ đeo, túi và quà tặng. Đặt theo số lượng, quy cách và ngày cần của doanh nghiệp."
            >
              <Action to="/yeu-cau-dich-vu?service=vat-pham-su-kien">Gửi yêu cầu vật phẩm</Action>
              <Action onClick={scrollToKits} secondary>Xem các bộ vật phẩm</Action>
            </PageIntro>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
            <p className="font-medium text-slate-700">Duyệt mẫu trước khi sản xuất hàng loạt. Cam kết tiến độ và chất lượng.</p>
            <button type="button" onClick={scrollToKits} className="inline-flex items-center gap-1 text-[#0052cc] font-semibold hover:underline">
              Xem các bộ vật phẩm gợi ý <ChevronDown size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section id="cac-bo-vat-pham" className="ec-section ec-container">
        <SectionHeading title="Chọn bộ theo mục đích sử dụng.">Các hạng mục có thể điều chỉnh theo nhận diện, ngân sách và quy mô của bạn.</SectionHeading>
        <div className="ec-collection">
          {MERCHANDISE_KITS.map(kit => {
            const story = MERCH_STORIES[kit.id];
            return <article key={kit.id} className="ec-product">
              <Photo src={story.image} alt={story.alt} />
              <div className="ec-product-info"><h3>{story.title}</h3><p>{story.description}</p>
                <div className="ec-actions">
                  <Action to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&package=${kit.id}`}>Yêu cầu bộ này</Action>
                  <Action onClick={() => setSelectedKit(kit)} secondary>Xem hạng mục</Action>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="ec-section ec-container ec-pair">
        <Photo src="/images/founding-partners/products/may-ao-thun-dong-phuc.jpg" alt="Mẫu áo polo để lựa chọn chất liệu và màu sắc đồng phục" />
        <div className="ec-feature-copy">
          <h2>Duyệt mẫu trước. Sản xuất sau.</h2>
          <p>Chốt chất liệu, màu, logo, bảng size và đóng gói trước khi đặt hàng. Tiến độ giao chỉ được xác nhận sau khi nguồn cung đồng ý.</p>
          <ul className="ec-feature-list">{['Gửi file logo và quy cách từng món.', 'Kiểm tra mẫu hoặc bản thiết kế cần duyệt.', 'Chốt báo giá, số lượng và địa điểm giao.'].map(text => <li key={text}><Check size={20} strokeWidth={1.5} aria-hidden="true" />{text}</li>)}</ul>
          <Action onClick={() => setShowQuotationModal(true)} secondary>Xem cấu trúc báo giá</Action>
        </div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Rõ vai trò ngay từ đầu.">Chọn cơ chế làm việc phù hợp. Bên ký hợp đồng và xuất hóa đơn sẽ được xác nhận trong đề xuất.</SectionHeading>
        <div className="ec-modes" aria-label="Cơ chế cung ứng">
          <button type="button" className="ec-choice" aria-pressed={activeCoordinationMode === 'PLATFORM_COORDINATION'} onClick={() => setActiveCoordinationMode('PLATFORM_COORDINATION')}>CCU điều phối nguồn cung</button>
          <button type="button" className="ec-choice" aria-pressed={activeCoordinationMode === 'DIRECT_SALE'} onClick={() => setActiveCoordinationMode('DIRECT_SALE')}>CCU cung ứng trực tiếp</button>
        </div>
        <div className="ec-detail-line" aria-live="polite"><h3>{activeCoordinationMode === 'PLATFORM_COORDINATION' ? 'Làm việc với nhà cung cấp được chọn.' : 'CCU là đầu mối cung ứng.'}</h3><div>
          <p>{activeCoordinationMode === 'PLATFORM_COORDINATION' ? 'CCU tiếp nhận đề bài và phối hợp tìm nguồn. Nhà cung cấp chịu trách nhiệm theo hợp đồng với khách hàng.' : 'Áp dụng khi CCU nhận vai trò bên bán trong hợp đồng cụ thể. Phạm vi cung ứng được xác nhận trước khi triển khai.'}</p>
          <p>Bên ký hợp đồng: <strong>{mode.contractSigner}</strong></p>
          <p>Bên xuất hóa đơn: <strong>{activeCoordinationMode === 'DIRECT_SALE' ? 'CCU theo pháp nhân trên hợp đồng' : mode.vatIssuer}</strong></p>
        </div></div>
      </section>

      <section className="ec-section ec-container">
        <SectionHeading title="Từ đề bài đến bàn giao." />
        <ProcessStrip steps={[['Làm rõ đề bài', 'Số lượng, quy cách, ngân sách và ngày cần.'], ['Nguồn cung & Mẫu', 'Chọn phương án và duyệt mẫu phù hợp.'], ['Chốt triển khai', 'Xác nhận báo giá, hợp đồng và tiến độ.'], ['Giao & Nghiệm thu', 'Kiểm đếm, đối chiếu mẫu và bàn giao.']]} />
      </section>

      {relatedPrograms.length > 0 && <section className="ec-section ec-container">
        <SectionHeading title="Chuẩn bị vật phẩm cho chương trình." />
        <div className="ec-programs">{relatedPrograms.map(prog => <article key={prog.id} className="ec-program"><h3>{prog.title}</h3><div className="ec-program-meta"><span>{prog.date}</span><span>{prog.location}</span></div><div className="ec-actions"><Action to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&programId=${prog.id}`} secondary>Gửi yêu cầu vật phẩm</Action></div></article>)}</div>
      </section>}

      <ClosingNote title="Đã có danh sách cần đặt?" description="Gửi loại vật phẩm, số lượng, ngày cần và nơi giao. CCU sẽ tiếp nhận để làm rõ phương án phù hợp.">
        <Action to="/yeu-cau-dich-vu?service=vat-pham-su-kien">Gửi đề bài của bạn</Action>
      </ClosingNote>

      {selectedKit && <Modal title={MERCH_STORIES[selectedKit.id].title} onClose={() => setSelectedKit(null)}>
        <Photo src={MERCH_STORIES[selectedKit.id].image} alt={MERCH_STORIES[selectedKit.id].alt} />
        <dl>{selectedKit.itemsList.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.spec}</dd></div>)}</dl>
        <p className="ec-note">Quy cách trên là phương án tham khảo. Báo giá, mẫu, số lượng tối thiểu và ngày giao cần được xác nhận theo đề bài.</p>
        <div className="ec-actions"><Action to={`/yeu-cau-dich-vu?service=vat-pham-su-kien&package=${selectedKit.id}`}>Gửi yêu cầu bộ này</Action></div>
      </Modal>}

      {showQuotationModal && <Modal title="Cấu trúc báo giá cần đối chiếu" onClose={() => setShowQuotationModal(false)}>
        <p className="mb-6">Các nội dung cần làm rõ khi nhận báo giá, không phải báo giá có hiệu lực.</p>
        <dl>{[['Sản phẩm & Quy cách', 'Tên từng món, chất liệu, size, màu, logo và cách đóng gói.'], ['Số lượng & Đơn giá', 'Đơn giá theo số lượng đặt; tách chi phí mẫu, thiết kế và in hoặc thêu.'], ['Thuế & Vận chuyển', 'Thuế áp dụng, chi phí giao hàng và trách nhiệm bàn giao.'], ['Tiến độ & Thanh toán', 'Mốc duyệt mẫu, ngày giao đã xác nhận và điều kiện thanh toán.'], ['Nghiệm thu', 'Tiêu chí đối chiếu mẫu và cách xử lý thiếu số lượng hoặc lỗi sản phẩm.']].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        <div className="ec-actions"><Action to="/yeu-cau-dich-vu?service=vat-pham-su-kien">Gửi yêu cầu báo giá</Action></div>
      </Modal>}
    </div>
  );
}
