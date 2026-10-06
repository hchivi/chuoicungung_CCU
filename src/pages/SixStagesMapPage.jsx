import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Compass, HardHat, Wrench, Factory, Users, Leaf, ChevronDown, Check, Building2, Network } from 'lucide-react';
import { stagesData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { resolveMapSelection, selectMapStage, selectMapPhase, getMapContext, mapKeywordHref, mapStageStyle } from './sixStagesMapUi';
import SixStagesLifecycleBoard from './SixStagesLifecycleBoard';
import './SixStagesMapPage.css';

const STAGE_ICONS = [Compass, HardHat, Wrench, Factory, Users, Leaf];

export const PHASE_ORIENTATION_KEYWORDS = {
  "1.1": [
    ["khảo sát địa chất", "báo cáo khả thi FS", "nghiên cứu thị trường", "định hướng đầu tư", "tư vấn tiền khả thi", "quy hoạch dự án"],
    ["đánh giá tác động", "khảo sát hiện trạng", "tư vấn cấu trúc vốn", "định vị KCN phù hợp", "phân tích chuỗi cung ứng"]
  ],
  "1.2": [
    ["pháp lý đầu tư IRC/ERC", "hồ sơ ĐTM môi trường", "giấy phép xây dựng", "thẩm duyệt PCCC", "pháp lý KCN", "thủ tục hải quan"],
    ["tư vấn luật FDI", "chứng nhận phòng cháy", "hồ sơ cấp phép xưởng", "thẩm định quy hoạch 1/500", "đăng ký doanh nghiệp"]
  ],
  "1.3": [
    ["thuê đất KCN", "nhà xưởng xây sẵn RBF", "hạ tầng kỹ thuật KCN", "mặt bằng sản xuất", "kho xưởng RBW", "đất công nghiệp"],
    ["nhà xưởng cao tầng", "đất KCN sinh thái", "hạ tầng điện nước 22kV", "kho bãi ngoại quan", "thuê xưởng tiêu chuẩn"]
  ],
  "2.1": [
    ["thiết kế quy hoạch 1/500", "mô hình BIM", "kiến trúc công nghiệp", "công trình xanh LEED", "thiết kế kết cấu", "quy hoạch mặt bằng"],
    ["tính toán tải trọng", "bản vẽ thi công MEP", "tư vấn LOTUS", "mô phỏng năng lượng", "thiết kế kết cấu thép"]
  ],
  "2.2": [
    ["nhà thép tiền chế", "sàn bê tông Hardener", "thi công xây dựng", "kết cấu chịu lực", "móng cọc xưởng", "khung giàn thép"],
    ["ép cọc bê tông", "lợp mái tôn chống nóng", "sơn chống rỉ kết cấu", "thi công tường bao Panel", "đổ sàn bê tông cốt thép"]
  ],
  "2.3": [
    ["trạm biến áp 22kV", "cơ điện MEP", "PCCC tự động", "điều hòa HVAC", "xử lý nước thải WWTP", "cấp thoát nước xưởng"],
    ["tủ điện phân phối MSB", "hệ thống Sprinkler", "đường ống dẫn khí nén", "chiếu sáng nhà xưởng", "trạm bơm PCCC"]
  ],
  "3.1": [
    ["phòng sạch Cleanroom", "sơn sàn Epoxy", "panel cách nhiệt", "cửa trượt tự động", "hệ thống lọc HEPA", "sàn vinyl ESD"],
    ["phòng sạch Class 1000", "sơn Epoxy tự phẳng", "panel bông khoáng PIR", "buồng thổi khí Air Shower", "hộp trung chuyển Pass Box"]
  ],
  "3.2": [
    ["lắp đặt cẩu trục", "dây chuyền tự động SMT", "căn chỉnh máy CNC", "rigging & line setup", "lắp đặt robot", "băng tải công nghiệp"],
    ["cẩu trục dầm đôi 10T", "định vị máy chính xác", "cân chỉnh laser máy móc", "băng chuyền con lăn", "lắp đặt hệ thống khí nén"]
  ],
  "3.3": [
    ["chạy thử tải SAT/FAT", "đo kiểm rung động", "kiểm định an toàn máy", "nghiệm thu bàn giao", "hiệu chuẩn Quatest", "test áp lực ống"],
    ["kiểm tra không tải", "hiệu chỉnh sensor", "đo độ ồn công nghiệp", "nghiệm thu chạy thử", "biên bản bàn giao thiết bị"]
  ],
  "4.1": [
    ["NVL kim loại & thép", "hạt nhựa & phụ gia", "linh kiện bu lông", "thùng carton 5 lớp", "bao bì màng co", "hóa chất công nghiệp"],
    ["thép tấm SS400", "nhựa nguyên sinh ABS/PP", "ốc vít inox 304", "pallet gỗ ván ép", "màng PE quấn hàng", "hạt hút ẩm"]
  ],
  "4.2": [
    ["gia công CNC chính xác", "khuôn mẫu & đồ gá Jig", "phần mềm MES/SCADA", "bảo trì định kỳ TPM", "lắp ráp linh kiện", "đo kiểm CMM 3D"],
    ["phay tiện CNC 5 trục", "khuôn ép nhựa chính xác", "gia công chi tiết máy", "bảo dưỡng phòng ngừa", "lắp ráp cụm SMT"]
  ],
  "4.3": [
    ["logistics cảng biển", "vận tải container", "cho thuê kho bãi", "pallet gỗ xuất khẩu", "khai báo hải quan", "fulfillment KCN"],
    ["vận chuyển xe tải lạnh", "kho ngoại quan KCN", "cước tàu quốc tế", "dịch vụ bốc xếp hàng hóa", "thủ tục C/O xuất khẩu"]
  ],
  "5.1": [
    ["tuyển dụng lao động KCN", "cung ứng lao động thời vụ", "kỹ sư tự động hóa", "headhunt cấp cao", "đào tạo an toàn", "cung ứng nhân sự"],
    ["tuyển công nhân may", "lao động phổ thông KCN", "đào tạo kỹ năng 5S", "kỹ sư cơ điện MEP", "dịch vụ tính lương Payroll"]
  ],
  "5.2": [
    ["suất ăn công nghiệp", "xe đưa đón công nhân", "quà tặng doanh nghiệp", "văn phòng phẩm", "vệ sinh công nghiệp", "dịch vụ giặt ủi KCN"],
    ["catering chuẩn HACCP", "xe buýt 45 chỗ đưa đón", "cung ứng nước uống văn phòng", "dịch vụ bảo vệ nhà máy", "cây xanh cảnh quan xưởng"]
  ],
  "5.3": [
    ["may đồng phục công nhân", "quần áo ESD phòng sạch", "giày bảo hộ PPE", "nón bảo hộ lao động", "găng tay chống cắt", "kính bảo hộ chuẩn EN"],
    ["đồng phục kỹ sư cao cấp", "áo thun polo công ty", "ủng bảo hộ mũi thép", "dây đai an toàn trên cao", "khẩu trang than hoạt tính"]
  ],
  "6.1": [
    ["mở rộng nhà máy Pha 2", "nâng cấp dây chuyền", "cải tạo công suất", "tăng vốn đầu tư", "xây thêm phân xưởng", "lắp thêm máy móc"],
    ["cơi nới xưởng sản xuất", "tối ưu hóa layout xưởng", "nâng cấp trạm điện xưởng", "tái cấu trúc sản xuất", "mở rộng diện tích kho"]
  ],
  "6.2": [
    ["tư vấn ISO 9001/14001", "tiêu chuẩn ESG xanh", "kiểm kê khí nhà kính", "audit nhà máy FDI", "chứng chỉ CBAM", "chứng nhận RoHS/REACH"],
    ["chứng chỉ IATF 16949", "báo cáo bền vững ESG", "chứng nhận ISO 45001", "kiểm toán năng lượng", "tư vấn tín chỉ Carbon"]
  ],
  "6.3": [
    ["robot tự hành AGV/AMR", "kho thông minh AS/RS", "điện mặt trời 1MWp", "tự động hóa SCADA", "chuyển đổi số IoT", "hệ thống AI Factory"],
    ["hệ thống tay gắp Robot", "cảm biến IoT giám sát", "điện mặt trời áp mái PPA", "phần mềm ERP Cloud", "bảo trì dự đoán AI"]
  ]
};

export default function SixStagesMapPage() {
  const { lang } = useLanguage();
  const copy = (vi, en) => lang === 'en' ? en : vi;
  const stageTitle = stage => lang === 'en' ? stage.titleEn : stage.title;
  const phaseTitle = phase => lang === 'en' ? phase.titleEn : phase.title;
  const scrollFrame = useRef(null);
  useEffect(() => () => window.cancelAnimationFrame(scrollFrame.current), []);
  const revealSection = (id, headingId) => {
    window.cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = window.requestAnimationFrame(() => {
      document.getElementById(headingId)?.focus({ preventScroll: true });
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      scrollFrame.current = null;
    });
  };
  const [selection, setSelection] = useState(() => {
    try {
      return resolveMapSelection(localStorage.getItem('ccu_selected_stage') || '1', localStorage.getItem('ccu_selected_phase') || '1.2');
    } catch {
      return resolveMapSelection('1', '1.2');
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('ccu_selected_stage', String(selection.stageId));
      localStorage.setItem('ccu_selected_phase', selection.phaseId);
    } catch { /* Browsing still works when storage is unavailable. */ }
  }, [selection]);

  const { stage: currentStage, phase: currentPhase } = getMapContext(selection);
  const isOverview = selection.stageId === 'all';
  const visibleStages = isOverview ? stagesData : [currentStage];
  const StageIcon = STAGE_ICONS[currentStage.id - 1];
  const changeStage = id => {
    window.cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = null;
    setSelection(previous => selectMapStage(previous, id));
  };
  const changePhase = id => {
    setSelection(previous => selectMapPhase(previous, id));
    revealSection('sm-phase-detail', 'sm-detail-title');
  };
  const stageHref = `/giai-doan/${currentStage.slug}`;
  const phaseHref = `/pha/${currentPhase.slug}`;

  return (
    <div className="six-stages-map">
      <section className="sm-hero sm-hero-cinematic relative overflow-hidden bg-[#003822] min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
        {/* Right Half Panoramic Factory Background with Smooth Gradient Fade matching Image 2 */}
        <div className="absolute top-0 right-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none overflow-hidden z-0">
          <img 
            className="w-full h-full object-cover object-center scale-105" 
            src="/images/six-stages-industrial-lifecycle-v1.jpg" 
            fetchpriority="high" 
            alt={copy('Toàn cảnh không gian công nghiệp với nhà xưởng, khu xây dựng và hạ tầng giao thông', 'Industrial landscape with manufacturing halls, construction and transport infrastructure')} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003822] via-[#003822]/90 md:via-[#003822]/60 lg:via-[#003822]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#003822] via-transparent to-transparent"></div>
        </div>

        <div className="sm-wrap sm-hero-inner relative z-10 w-full">
          <nav className="sm-breadcrumb" aria-label={copy('Đường dẫn', 'Breadcrumb')}>
            <Link to="/"><img src="/logo_only.png" width="18" height="18" alt={copy('Trang chủ', 'Home')} /></Link>
            <span aria-hidden="true">/</span><span>{copy('Bản đồ 6 giai đoạn', 'Six-stage map')}</span>
          </nav>
          <div className="sm-hero-copy">
            <span className="sm-eyebrow">{copy('Định vị nhu cầu. Kết nối đúng nguồn.', 'Locate your need. Find the right source.')}</span>
            <h1>{copy('BẢN ĐỒ CHUỖI CUNG ỨNG QUỐC GIA', 'NATIONAL SUPPLY CHAIN MAP')} <span>{copy('THEO 6 GIAI ĐOẠN & 18 PHA', 'ACROSS 6 STAGES & 18 PHASES')}</span></h1>
            <p>{copy('Xác định giai đoạn hiện tại, chọn đúng nhu cầu và tìm nguồn cung phù hợp.', 'Find your current stage, identify your need and connect with relevant sources.')}</p>
            <div className="sm-actions">
              <a href="#lifecycle-explorer" onClick={event => { event.preventDefault(); revealSection('lifecycle-explorer', 'sm-explorer-heading'); }} className="sm-button sm-primary">{copy('Khám phá bản đồ', 'Explore the map')}<ArrowRight size={18} aria-hidden="true" /></a>
              <Link to="/dang-nhu-cau" className="sm-text-link">{copy('Tôi có nhu cầu cụ thể', 'I have a specific need')}<ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
      <nav className="sm-stage-rail" aria-label={copy('Đi nhanh đến một giai đoạn', 'Jump to a stage')}>
        <div className="sm-wrap">
          {stagesData.map(stage => <button type="button" key={stage.id} data-hero-stage={stage.id} style={mapStageStyle(stage.id)} aria-pressed={selection.stageId === stage.id} aria-controls="lifecycle-explorer" onClick={() => { changeStage(stage.id); revealSection('lifecycle-explorer', 'sm-explorer-heading'); }}>
            <span>{String(stage.id).padStart(2, '0')}</span><strong>{stageTitle(stage)}</strong><ArrowUpRight size={15} aria-hidden="true" />
          </button>)}
        </div>
      </nav>

      <section id="lifecycle-explorer" className="sm-explorer sm-wrap" aria-labelledby="sm-explorer-heading">
        <div className="sm-section-heading">
          <div><span className="sm-eyebrow">{copy('Bức tranh tổng thể', 'The big picture')}</span><h2 id="sm-explorer-heading" tabIndex={-1}>{copy('Tìm đúng điểm bắt đầu.', 'Find your starting point.')}</h2></div>
          <p>{copy('Chọn một giai đoạn trên bản đồ. Mỗi thẻ mở 3 pha cùng công việc và nhóm nhu cầu tương ứng.', 'Choose a stage on the map. Each card opens three phases with related tasks and needs.')}</p>
        </div>
        <div className="sm-explorer-grid">
          <SixStagesLifecycleBoard stages={stagesData} lang={lang} selection={selection} onSelect={id => { changeStage(id); revealSection('sm-phase-list', 'sm-phases-heading'); }} />

          <article id="sm-stage-panel" className="sm-stage-panel" style={mapStageStyle(currentStage.id)}>
            <div className="sm-stage-photo"><img key={currentStage.id} src={`/stage${currentStage.id}_hero.jpg`} width="1376" height="768" loading="lazy" alt={stageTitle(currentStage)} /></div>
            <div className="sm-stage-copy">
              <div className="sm-stage-label"><StageIcon size={18} aria-hidden="true" /><span>{copy('Giai đoạn', 'Stage')} {String(currentStage.id).padStart(2, '0')}</span><span>{currentStage.phases.length} {copy('pha', 'phases')}</span></div>
              <h2>{stageTitle(currentStage)}</h2>
              <p>{lang === 'en' ? currentStage.summaryEn : currentStage.summary}</p>
              <Link to={stageHref} className="sm-text-link">{copy('Khám phá giai đoạn này', 'Explore this stage')}<ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
        <p className="sm-visually-hidden" role="status" aria-live="polite">{copy('Đang xem', 'Viewing')}: {isOverview ? copy('Tất cả 6 giai đoạn', 'All six stages') : stageTitle(currentStage)}. {copy('Pha', 'Phase')} {currentPhase.id}: {phaseTitle(currentPhase)}.</p>
      </section>

      <section id="sm-phase-list" className="sm-phases sm-wrap" aria-labelledby="sm-phases-heading">
        <div className="sm-section-heading">
          <div><span className="sm-eyebrow">{isOverview ? copy('Toàn bộ 18 pha', 'All 18 phases') : copy(`3 pha trong giai đoạn ${currentStage.id}`, `3 phases in stage ${currentStage.id}`)}</span><h2 id="sm-phases-heading" tabIndex={-1}>{copy('Bạn đang cần gì ở giai đoạn này?', 'What do you need at this stage?')}</h2></div>
          <button type="button" className="sm-view-toggle" aria-pressed={isOverview} onClick={() => changeStage(isOverview ? currentStage.id : 'all')}>
            {isOverview ? copy('Thu gọn về giai đoạn đang chọn', 'Focus on selected stage') : copy('Xem toàn bộ 6 giai đoạn', 'View all six stages')}<ArrowUpRight size={17} aria-hidden="true" />
          </button>
        </div>
        {visibleStages.map(stage => <div key={stage.id} className="sm-phase-group" style={mapStageStyle(stage.id)}>
          {isOverview && <div className="sm-group-heading"><span>{String(stage.id).padStart(2, '0')}</span><div><h3>{stageTitle(stage)}</h3><p>{lang === 'en' ? stage.summaryEn : stage.summary}</p></div><Link to={`/giai-doan/${stage.slug}`} aria-label={copy(`Xem giai đoạn ${stage.id}: ${stage.title}`, `Explore stage ${stage.id}: ${stage.titleEn}`)}><ArrowUpRight size={21} aria-hidden="true" /></Link></div>}
          <div className="sm-phase-grid">
            {stage.phases.map(phase => <article key={phase.id} className={`sm-phase-card ${selection.phaseId === phase.id ? 'is-selected' : ''}`}>
              <button type="button" data-phase-select={phase.id} aria-pressed={selection.phaseId === phase.id} aria-controls="sm-phase-detail" onClick={() => changePhase(phase.id)}>
                <div className="sm-phase-top"><span>{copy('Pha', 'Phase')} {phase.id}</span>{selection.phaseId === phase.id ? <Check size={20} aria-hidden="true" /> : <ArrowUpRight size={20} aria-hidden="true" />}</div>
                <h3>{phaseTitle(phase)}</h3>
                <p>{lang === 'en' ? phase.summaryEn : phase.summary}</p>
                <span className="sm-phase-hint">{selection.phaseId === phase.id ? copy('Đang xem nội dung bên dưới', 'Details shown below') : copy('Xem công việc & nhóm nhu cầu', 'See tasks & related needs')}<ArrowRight size={16} aria-hidden="true" /></span>
              </button>
              <details className="sm-keyword-details">
                <summary>{copy('Từ khóa sản phẩm / dịch vụ', 'Product / service keywords')}<ChevronDown size={15} aria-hidden="true" /></summary>
                <div className="sm-keywords">{(PHASE_ORIENTATION_KEYWORDS[phase.id] || []).flat().map(keyword => <Link key={keyword} to={mapKeywordHref(keyword)}>{keyword}<ArrowUpRight size={13} aria-hidden="true" /></Link>)}</div>
              </details>
            </article>)}
          </div>
        </div>)}
      </section>

      <section id="sm-phase-detail" className="sm-detail-wrap" style={mapStageStyle(currentStage.id)} aria-labelledby="sm-detail-title">
        <div className="sm-wrap">
          <div className="sm-detail-heading"><div><span className="sm-eyebrow">{copy('Đưa nhu cầu vào đúng ngữ cảnh', 'Put your need in context')}</span><h2 id="sm-detail-title" tabIndex={-1}><span>{currentPhase.id}</span>{phaseTitle(currentPhase)}</h2></div><Link data-current-phase-link to={phaseHref} className="sm-button sm-primary">{copy('Xem chi tiết pha', 'Explore this phase')}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          <a href="#sm-phase-list" onClick={event => { event.preventDefault(); revealSection('sm-phase-list', 'sm-phases-heading'); }} className="sm-back-link">{copy('Trở lại danh sách pha', 'Back to phases')}<ArrowUpRight size={15} aria-hidden="true" /></a>
          <div className="sm-detail-grid">
            <div className="sm-task-column"><h3>{copy('Công việc cần triển khai', 'Tasks to undertake')}</h3><ul className="sm-task-list">{currentPhase.tasks.map(task => <li key={task}><Check size={17} aria-hidden="true" /><span>{task}</span></li>)}</ul>
              {currentPhase.outputs && <details className="sm-outputs"><summary>{copy('Đầu ra của pha', 'Phase outputs')}<ChevronDown size={16} aria-hidden="true" /></summary><ul>{currentPhase.outputs.map(output => <li key={output}>{output}</li>)}</ul></details>}
            </div>
            <div className="sm-needs-column"><h3>{copy('Nhóm nhu cầu thường gặp', 'Common needs')}</h3><div className="sm-need-links">{currentPhase.commonDemands.map(need => <Link key={need} to={mapKeywordHref(need)}>{need}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div>
              <div className="sm-participants"><h3>{copy('Ai tham gia pha này?', 'Who participates?')}</h3><p>{currentPhase.roles.join(' · ')}</p></div>
            </div>
          </div>
          <div className="sm-detail-next"><span>{copy('Đã xác định được nhu cầu?', 'Know what you need?')}</span><Link to="/dang-nhu-cau" className="sm-text-link">{copy('Đăng nhu cầu để bắt đầu tìm nguồn', 'Post a need and start sourcing')}<ArrowRight size={17} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="sm-next sm-wrap" aria-labelledby="sm-next-title">
        <div><span className="sm-eyebrow">{copy('Từ bản đồ đến hành động', 'From the map to action')}</span><h2 id="sm-next-title">{copy('Tìm đúng vai trò. Mở đúng kết nối.', 'Find your role. Start the right connection.')}</h2><p>{copy('Nhà máy tìm nguồn. Nhà cung ứng tìm cơ hội. KCN và hội cùng kết nối hệ sinh thái.', 'Factories find sources. Suppliers find opportunities. Industrial parks and associations connect the ecosystem.')}</p></div>
        <div className="sm-directory-links">
          {[['/nha-cung-ung', copy('Tìm nhà cung ứng', 'Find suppliers'), Building2], ['/san-nhu-cau', copy('Xem nhu cầu công khai', 'Browse public needs'), Factory], ['/khu-cong-nghiep', copy('Khám phá khu công nghiệp', 'Explore industrial parks'), Compass], ['/hiep-hoi', copy('Kết nối hội / hiệp hội', 'Connect with associations'), Network]].map(([href, label, Icon]) => <Link key={href} to={href}><Icon size={22} aria-hidden="true" /><span>{label}</span><ArrowUpRight size={20} aria-hidden="true" /></Link>)}
        </div>
      </section>
    </div>
  );
}
