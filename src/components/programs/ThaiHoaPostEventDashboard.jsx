import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Factory, Package, CheckCircle2, CalendarDays, ClipboardList, ChartNoAxesCombined, Handshake, ArrowRight, Download, UsersRound, FileText, Camera, ListChecks, Info, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { postEventSnapshot } from '../../pages/thaiHoaPostEventModel.js';
import { featuredParticipants, defaultThaiHoaParticipants } from '../../pages/thaiHoaEventLandingModel.js';
import { FeaturedGroup, ParticipantDialog } from './ThaiHoaConfirmedParticipants.jsx';
import ProgramPostMatchingSection from './ProgramPostMatchingSection.jsx';
import './ThaiHoaPostEventDashboard.css';

const value = number => number === null ? '—' : number.toLocaleString('vi-VN');
const percent = number => number === null ? '—' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(number) + '%';
const taskStates = [{ id: 'todo', label: 'Cần thực hiện' }, { id: 'waiting', label: 'Đang chờ' }, { id: 'done', label: 'Đã hoàn thành' }];
const metricTypes = [
  ['registered', 'Doanh nghiệp đăng ký', Building2, 'green'],
  ['attended', 'Doanh nghiệp tham dự', UsersRound, 'blue'],
  ['checkedIn', 'Đã check-in', CheckCircle2, 'green'],
  ['buyers', 'Nhà máy / Buyer', Factory, 'blue'],
  ['suppliers', 'Nhà cung ứng / Supplier', Package, 'orange'],
  ['meetings', 'Cuộc gặp 1:1', CalendarDays, 'blue'],
  ['needs', 'Nhu cầu được trao đổi', ClipboardList, 'blue'],
  ['nextActions', 'Hành động tiếp theo', ChartNoAxesCombined, 'green'],
];
const journeyTypes = [['registered', 'Đăng ký', Building2], ['attended', 'Tham dự', UsersRound], ['checkedIn', 'Check-in', CheckCircle2], ['matchedSuggestions', 'Match gợi ý', Handshake], ['meetings', 'Cuộc gặp 1:1', CalendarDays], ['nextActions', 'Hành động tiếp theo', ChartNoAxesCombined]];

function Empty({ Icon = Info, title, children }) {
  return <div className="th-post-empty"><Icon aria-hidden="true" /><strong>{title}</strong><p>{children}</p></div>;
}
function PanelHeader({ id, Icon, title, children }) {
  return <header className="th-post-panel-head"><h3 id={id}>{Icon && <Icon aria-hidden="true" />}{title}</h3>{children}</header>;
}
function ExpandButton({ expanded, onClick, label = 'Xem tất cả' }) {
  return <button className="th-post-link" onClick={onClick} aria-expanded={expanded}>{expanded ? 'Thu gọn' : label}<ArrowRight size={15} /></button>;
}
function DocumentLink({ item, report = false }) {
  const isOnlineSpreadsheet = item.url.includes('docs.google.com') || item.kind === 'SPREADSHEET';
  return <a className={report ? 'th-post-button' : 'th-post-document'} href={item.url} target="_blank" rel="noopener noreferrer" download={(!isOnlineSpreadsheet && item.url.startsWith('/')) || undefined}>{report ? <><Download size={19} />Tải báo cáo tổng quan</> : <><FileText aria-hidden="true" /><span><strong>{item.title}</strong><small>{isOnlineSpreadsheet ? 'Bảng tính trực tuyến (Google Sheets)' : item.sizeBytes === null ? 'Tài liệu đã công bố' : `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(item.sizeBytes / 1e6)} MB`}</small></span>{isOnlineSpreadsheet ? <ExternalLink size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}</>}</a>;
}

export default function ThaiHoaPostEventDashboard({ program, participants = [], identity, onLogin }) {
  const data = useMemo(() => postEventSnapshot(program, participants), [program, participants]);
  const [taskState, setTaskState] = useState('todo');
  const [allCompanies, setAllCompanies] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allMedia, setAllMedia] = useState(false);
  const [allMediaModalOpen, setAllMediaModalOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(null);
  const [allDocuments, setAllDocuments] = useState(false);
  const [allThemes, setAllThemes] = useState(false);
  const effectiveParticipants = participants && participants.length > 0 ? participants : defaultThaiHoaParticipants();
  let offset = 0;
  const segments = data.outcomes.map(item => {
    const segment = { ...item, offset };
    offset += item.percent || 0;
    return segment;
  });

  useEffect(() => {
    if (activeMediaIndex === null && !allMediaModalOpen) return;
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        if (activeMediaIndex !== null) setActiveMediaIndex(null);
        else if (allMediaModalOpen) setAllMediaModalOpen(false);
      }
      if (activeMediaIndex !== null) {
        if (e.key === 'ArrowLeft') setActiveMediaIndex(prev => (prev === 0 ? data.media.length - 1 : prev - 1));
        if (e.key === 'ArrowRight') setActiveMediaIndex(prev => (prev === data.media.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaIndex, allMediaModalOpen, data.media.length]);

  return <section id="th-lifecycle-panel" className="th-post" role="tabpanel" aria-labelledby="th-tab-after" tabIndex={0}>
    <header className="th-post-overview"><div><h2>Tổng quan kết quả</h2><p>Những con số nổi bật từ Ngày hội Chuỗi cung ứng KCN Thái Hòa 2026</p></div>{data.report ? <DocumentLink item={data.report} report /> : <div><button className="th-post-button" disabled><Download size={19} />Tải báo cáo tổng quan</button><small>Báo cáo đang chờ công bố</small></div>}</header>
    <div className="th-post-metrics" aria-label="Thống kê kết quả sự kiện">{metricTypes.map(([key, label, Icon, color]) => <article key={key}><span className={`th-post-stat-icon is-${color}`}><Icon aria-hidden="true" /></span><div><strong>{value(data.metrics[key])}</strong><span>{label}</span></div></article>)}</div>
    {data.isHypothetical ? (
      <p className="th-post-data-note"><Info size={16} />Số liệu giả định / minh họa tiến độ kết nối Ngày hội KCN Thái Hòa 2026. Báo cáo chính thức sẽ được BTC công bố sau khi hoàn tất rà soát.</p>
    ) : !data.published ? (
      <p className="th-post-data-note"><Info size={16} />Kết quả tổng hợp đang chờ BTC xác nhận và công bố. Không sử dụng số liệu minh họa làm kết quả chính thức.</p>
    ) : null}

    <div className="th-post-analysis">
      <section className="th-post-panel th-post-journey" aria-labelledby="th-journey-title"><PanelHeader id="th-journey-title" Icon={Handshake} title="Hành trình kết nối" /><p className="th-post-subtitle">Từ đăng ký đến kết quả thực tế</p><ol>{journeyTypes.map(([key, label, Icon]) => <li key={key}><span className={`th-post-journey-icon ${key === 'checkedIn' ? 'is-green' : ''}`}><Icon aria-hidden="true" /></span><strong>{value(key === 'matchedSuggestions' ? data.matchedSuggestions : data.metrics[key])}</strong><span>{label}</span></li>)}</ol><small>Các chỉ số độc lập, không phải tỷ lệ chuyển đổi giữa các bước.</small></section>
      <section className="th-post-panel th-post-outcomes" aria-labelledby="th-outcomes-title"><PanelHeader id="th-outcomes-title" Icon={Handshake} title="Kết quả sau cuộc gặp" /><div className="th-post-outcome-body"><div className="th-post-donut"><svg viewBox="0 0 120 120" role="img" aria-label={data.outcomeTotal === null ? 'Biểu đồ kết quả chưa có dữ liệu công bố' : `Phân bố kết quả của ${data.outcomeTotal} cuộc gặp`}><circle className="th-post-donut-track" cx="60" cy="60" r="45" />{data.outcomeTotal !== null && segments.map(item => <circle key={item.id} cx="60" cy="60" r="45" pathLength="100" fill="none" stroke={item.color} strokeWidth="18" strokeDasharray={`${item.percent} ${100 - item.percent}`} strokeDashoffset={-item.offset} transform="rotate(-90 60 60)" />)}</svg><div><strong>{value(data.outcomeTotal)}</strong><span>{data.outcomeTotal === null ? 'Chờ công bố' : 'Cuộc gặp'}</span></div></div><ul>{data.outcomes.map(item => <li key={item.id}><span className={`th-post-legend-dot th-post-outcome-${item.id.toLowerCase()}`} /><span>{item.label}</span><strong>{percent(item.percent)}</strong></li>)}</ul></div>{data.outcomeTotal === null && <small>Biểu đồ xuất hiện khi dữ liệu phân loại đã được công bố đầy đủ.</small>}</section>
      <section className="th-post-panel th-post-themes" aria-labelledby="th-themes-title"><PanelHeader id="th-themes-title" Icon={ClipboardList} title="Nhu cầu được trao đổi nhiều nhất" />{data.themes.length ? <><ul>{data.themes.slice(0, allThemes ? undefined : 8).map(item => <li key={item.label}><span>{item.label}</span><progress value={item.percent || 0} max={100} aria-label={`${item.label}: ${percent(item.percent)}`} /><strong>{percent(item.percent)}</strong></li>)}</ul><small>Tỷ trọng trong các nhóm nhu cầu đã được phân loại.</small>{data.themes.length > 8 && <ExpandButton expanded={allThemes} onClick={() => setAllThemes(v => !v)} />}</> : <Empty Icon={ClipboardList} title="Chờ công bố nhóm nhu cầu">Các chủ đề được trao đổi nhiều nhất sẽ cập nhật sau khi tổng hợp kết quả.</Empty>}</section>
    </div>

    <div className="th-post-followup-grid">
      <section className="th-post-panel th-post-companies" id="doanh-nghiep" aria-labelledby="th-post-companies-title">
        <PanelHeader id="th-post-companies-title" Icon={Building2} title="Những doanh nghiệp tiêu biểu đã tham gia">
          <ExpandButton expanded={allCompanies} onClick={() => setAllCompanies(v => !v)} label={allCompanies ? 'Thu gọn' : 'Xem tất cả'} />
        </PanelHeader>
        <div className="th-confirmed-columns">
          <FeaturedGroup role="buyer" items={featuredParticipants(effectiveParticipants, 'buyer')} expanded={allCompanies} onShowDetail={setSelectedCompany} />
          <FeaturedGroup role="supplier" items={featuredParticipants(effectiveParticipants, 'supplier')} expanded={allCompanies} onShowDetail={setSelectedCompany} />
        </div>
        {selectedCompany && <ParticipantDialog item={selectedCompany} open={false} onClose={() => setSelectedCompany(null)} />}
      </section>

      <section className="th-post-panel th-post-tasks" aria-labelledby="th-tasks-title"><PanelHeader id="th-tasks-title" Icon={ListChecks} title="Việc của tôi sau Ngày hội" /><div className="th-post-filters" role="group" aria-label="Lọc đầu việc sau sự kiện">{taskStates.map(item => <button key={item.id} aria-pressed={taskState === item.id} onClick={() => setTaskState(item.id)}>{item.label}</button>)}</div><div className="th-post-task-caption">{taskStates.find(item => item.id === taskState).label} · Khu vực riêng tư</div><Empty Icon={ListChecks} title={identity ? 'Chưa có kết nối sổ việc cá nhân' : 'Đăng nhập để theo dõi việc của bạn'}>Đầu việc, đối tác và hạn xử lý chỉ hiển thị từ hệ thống riêng tư đã xác thực; không lấy từ dữ liệu công khai.</Empty>{!identity && <button className="th-post-button" onClick={onLogin}>Đăng nhập tài khoản <ArrowRight size={16} /></button>}</section>
    </div>

    <div className="th-post-assets-grid">
      <section className="th-post-panel th-post-media" aria-labelledby="th-media-title">
        <PanelHeader id="th-media-title" Icon={Camera} title="Hình ảnh & Video">
          {data.media.length > 6 && (
            <ExpandButton
              expanded={allMediaModalOpen}
              onClick={() => setAllMediaModalOpen(true)}
              label={`Xem tất cả ${data.media.length} ảnh`}
            />
          )}
        </PanelHeader>
        {data.media.length ? (
          <div className="th-post-media-list">
            {data.media.slice(0, 6).map((item, idx) => (
              <figure
                key={item.id}
                className="th-post-media-figure"
                onClick={() => { if (item.kind !== 'VIDEO') setActiveMediaIndex(idx); }}
                style={{ cursor: item.kind === 'VIDEO' ? 'default' : 'pointer' }}
              >
                {item.kind === 'VIDEO' ? (
                  <video controls playsInline preload="none" poster={item.poster || undefined} aria-label={item.caption}>
                    <source src={item.url} />Trình duyệt không hỗ trợ video.
                  </video>
                ) : (
                  <img src={item.url} alt={item.caption} loading="lazy" />
                )}
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <Empty Icon={Camera} title="Chờ công bố tư liệu ngày hội">Ảnh và video thật được duyệt sẽ xuất hiện ở đây, không dùng ảnh minh họa làm tư liệu kết quả.</Empty>
        )}
      </section>

      <section className="th-post-panel th-post-documents" id="tai-lieu" aria-labelledby="th-documents-title">
        <PanelHeader id="th-documents-title" Icon={FileText} title="Tài liệu sự kiện">
          {data.documents.length > 3 && <ExpandButton expanded={allDocuments} onClick={() => setAllDocuments(v => !v)} />}
        </PanelHeader>
        {data.documents.length ? (
          <div className="th-post-document-list">
            {data.documents.slice(0, allDocuments ? undefined : 3).map(item => <DocumentLink key={item.id} item={item} />)}
          </div>
        ) : (
          <Empty Icon={FileText} title="Tài liệu đang chờ công bố">Brochure, danh sách tham dự và báo cáo kết quả sẽ có liên kết tải sau khi được duyệt.</Empty>
        )}
      </section>
    </div>

    {allMediaModalOpen && (
      <div className="th-media-gallery-modal" role="dialog" aria-modal="true" aria-label="Tất cả hình ảnh & video sự kiện" onClick={() => setAllMediaModalOpen(false)}>
        <div className="th-media-gallery-container" onClick={e => e.stopPropagation()}>
          <header className="th-media-gallery-header">
            <div>
              <h3>Tất cả hình ảnh & video Ngày hội KCN Thái Hòa 2026</h3>
              <p>{data.media.length} tư liệu hình ảnh chất lượng cao</p>
            </div>
            <button type="button" className="th-media-gallery-close" onClick={() => setAllMediaModalOpen(false)} aria-label="Đóng"><X size={20} /></button>
          </header>
          <div className="th-media-gallery-body">
            <div className="th-media-gallery-grid">
              {data.media.map((item, idx) => (
                <figure
                  key={item.id}
                  className="th-media-gallery-item"
                  onClick={() => {
                    if (item.kind !== 'VIDEO') {
                      setActiveMediaIndex(idx);
                    }
                  }}
                >
                  {item.kind === 'VIDEO' ? (
                    <video controls playsInline preload="none" poster={item.poster || undefined} aria-label={item.caption}>
                      <source src={item.url} />Trình duyệt không hỗ trợ video.
                    </video>
                  ) : (
                    <img src={item.url} alt={item.caption} loading="lazy" />
                  )}
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    {activeMediaIndex !== null && data.media[activeMediaIndex] && (
      <div className="th-media-lightbox" role="dialog" aria-modal="true" aria-label="Xem ảnh tư liệu sự kiện" onClick={() => setActiveMediaIndex(null)}>
        <div className="th-media-lightbox-container" onClick={e => e.stopPropagation()}>
          <button type="button" className="th-media-lightbox-btn-close" onClick={() => setActiveMediaIndex(null)} aria-label="Đóng"><X size={20} /></button>
          {data.media.length > 1 && (
            <>
              <button type="button" className="th-media-lightbox-btn-nav is-prev" onClick={() => setActiveMediaIndex(prev => (prev === 0 ? data.media.length - 1 : prev - 1))} aria-label="Ảnh trước"><ChevronLeft size={26} /></button>
              <button type="button" className="th-media-lightbox-btn-nav is-next" onClick={() => setActiveMediaIndex(prev => (prev === data.media.length - 1 ? 0 : prev + 1))} aria-label="Ảnh tiếp theo"><ChevronRight size={26} /></button>
            </>
          )}
          <div className="th-media-lightbox-stage">
            {data.media[activeMediaIndex].kind === 'VIDEO' ? (
              <video controls autoPlay playsInline poster={data.media[activeMediaIndex].poster || undefined}>
                <source src={data.media[activeMediaIndex].url} />
              </video>
            ) : (
              <img src={data.media[activeMediaIndex].url} alt={data.media[activeMediaIndex].caption} />
            )}
          </div>
          <div className="th-media-lightbox-meta">
            <p className="th-media-lightbox-caption">{data.media[activeMediaIndex].caption}</p>
            <div className="th-media-lightbox-actions">
              <span className="th-media-lightbox-counter">{activeMediaIndex + 1} / {data.media.length}</span>
              <a href={data.media[activeMediaIndex].url} target="_blank" rel="noopener noreferrer" className="th-media-lightbox-open-raw">
                <ExternalLink size={14} /> Mở ảnh gốc
              </a>
            </div>
          </div>
        </div>
      </div>
    )}

    <details className="th-post-evidence" id="sau-matching"><summary><Handshake size={20} /><span>Cặp kết nối & cập nhật kết quả</span><ArrowRight size={17} /></summary><ProgramPostMatchingSection program={program} /></details>
  </section>;
}
