import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Package, Handshake, UsersRound, Clock3, QrCode, Ticket, CircleHelp, CalendarDays, Bell, Building2, Sparkles, ArrowRight, Info, Check, X } from 'lucide-react';
import { EVENT_FACTS, defaultThaiHoaParticipants } from '../../pages/thaiHoaEventLandingModel.js';
import { liveEventSnapshot, agendaAt, MEETING_STATES } from '../../pages/thaiHoaLiveEventModel.js';
import './ThaiHoaLiveEventDashboard.css';

const time = value => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }).format(value);
const date = value => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' }).format(value);
function Empty({ Icon = Info, title, children }) {
  return <div className="th-live-empty"><Icon aria-hidden="true" /><strong>{title}</strong><p>{children}</p></div>;
}
function Company({ item }) {
  return <div className="th-live-company">{item.logo ? <img src={item.logo} alt={`Logo ${item.name}`} loading="lazy" /> : <Building2 aria-hidden="true" />}<div><strong>{item.name}</strong><span>{item.industry || 'Doanh nghiệp tham gia'}</span></div></div>;
}

export default function ThaiHoaLiveEventDashboard({ program, state, participants, identity, onLogin, now = Date.now() }) {
  const effectiveParticipants = useMemo(() => {
    return participants && participants.length > 0 ? participants : defaultThaiHoaParticipants();
  }, [participants]);
  const data = useMemo(() => liveEventSnapshot(program, effectiveParticipants), [program, effectiveParticipants]);
  const [role, setRole] = useState('buyer');
  const defaultMeetingState = useMemo(() => {
    if (data.meetings.some(m => m.status === 'COMPLETED') && !data.meetings.some(m => m.status === 'UPCOMING')) {
      return 'COMPLETED';
    }
    return state?.tab === 'after' && data.meetings.some(m => m.status === 'COMPLETED') ? 'COMPLETED' : 'UPCOMING';
  }, [data.meetings, state?.tab]);
  const [meetingState, setMeetingState] = useState(defaultMeetingState);
  const [allAnnouncements, setAllAnnouncements] = useState(false);
  const [allCompanies, setAllCompanies] = useState(false);
  const [allSuggestions, setAllSuggestions] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const currentAgenda = state.tab === 'during' ? agendaAt(EVENT_FACTS.agenda, program.eventStartAt || EVENT_FACTS.startAt, program.eventEndAt || EVENT_FACTS.endAt, now) : -1;
  const present = data.present.filter(p => p.role === role);
  const meetings = data.meetings.filter(m => m.status === meetingState);
  const metrics = [[UsersRound, 'registered', 'Doanh nghiệp đã đăng ký'], [Factory, 'buyersPresent', 'Nhà máy / Buyer có mặt'], [Package, 'suppliersPresent', 'Nhà cung ứng / Supplier có mặt'], [Handshake, 'meetingsCompleted', 'Cuộc gặp 1:1 đã hoàn thành']];
  return <section id="th-lifecycle-panel" className="th-live" role="tabpanel" aria-labelledby="th-tab-during" tabIndex={0}>
    <div className="th-live-metrics" aria-label="Số liệu sự kiện">{metrics.map(([Icon, key, label], index) => <article className={`th-live-stat th-live-stat-${index}`} key={key}><span className="th-live-stat-icon"><Icon aria-hidden="true" /></span><div><strong>{data.metrics[key] === null ? '—' : data.metrics[key].toLocaleString('vi-VN')}</strong><span>{label}</span></div></article>)}<article className="th-live-update"><Clock3 aria-hidden="true" /><div><span>{data.updatedAt === null ? 'Chờ BTC cập nhật' : `Cập nhật lúc: ${time(data.updatedAt)}`}</span><strong>{data.updatedAt === null ? 'Chưa có số liệu công bố' : date(data.updatedAt)}</strong></div><span className={`th-live-badge ${state.tab === 'during' ? 'is-present' : ''}`}>{state.tab === 'during' ? 'Đang diễn ra' : state.tab === 'after' ? 'Đã kết thúc' : 'Chưa bắt đầu'}</span></article></div>
    <p className="th-live-context"><Info size={16} aria-hidden="true" />{state.tab === 'during' ? 'Bảng điều phối ngày hội · Số liệu theo lần cập nhật của Ban tổ chức.' : `${state.label}. Đây là giao diện điều phối ngày hội, không phải trạng thái trực tiếp hiện tại.`}</p>

    <div className="th-live-primary">
      <section className="th-live-panel th-live-checkin" aria-labelledby="th-checkin-title"><header><h2 id="th-checkin-title"><QrCode />Check-in sự kiện</h2></header><div className="th-live-checkin-grid">
        <div className="th-live-qr"><div className="th-live-qr-placeholder"><QrCode size={72} strokeWidth={1.3} aria-hidden="true" /><span>Mã check-in do BTC cấp</span></div><p>Dành cho người tham dự đã được xác nhận.</p><details><summary><CircleHelp size={17} />Hướng dẫn check-in</summary><ol><li>Mang Event Pass đã được BTC cấp.</li><li>Đến quầy check-in để xác nhận người tham dự.</li><li>Nhận thông tin bàn và lịch gặp 1:1.</li></ol><small>Biểu tượng trên không phải mã QR để quét.</small></details></div>
        <div className="th-live-pass"><h3>Bạn đã check-in?</h3><span className="th-live-pass-status"><Ticket aria-hidden="true" />{identity ? 'Chưa có dữ liệu xác nhận' : 'Đăng nhập để xác định người tham dự'}</span><p>Trạng thái chỉ được xác nhận từ hệ thống check-in của Ban tổ chức.</p><button className="th-live-button" disabled><Ticket size={18} />Event Pass chưa được cấp</button>{!identity && <button className="th-live-text-button" onClick={onLogin}>Đăng nhập tài khoản <ArrowRight size={16} /></button>}</div>
      </div></section>

      <section className="th-live-panel th-live-agenda" aria-labelledby="th-live-agenda-title"><header><h2 id="th-live-agenda-title"><CalendarDays />Lịch trình chương trình</h2></header><ol>{EVENT_FACTS.agenda.map((item, index) => <li key={item.time} className={index === currentAgenda ? 'is-current' : ''}><span className="th-live-timeline-dot" /><time>{item.time}</time><div><strong>{item.title}</strong>{index === currentAgenda && <span className="th-live-badge is-current">Đang diễn ra</span>}</div></li>)}</ol><small>Lịch theo thông tin chương trình · Giờ Việt Nam.</small></section>

      <section className="th-live-panel th-live-announcements" aria-labelledby="th-announcements-title"><header><h2 id="th-announcements-title"><Bell />Thông báo từ Ban tổ chức</h2>{data.announcements.length > 3 && <button className="th-live-text-button" onClick={() => setAllAnnouncements(v => !v)}>{allAnnouncements ? 'Thu gọn' : 'Xem tất cả'} <ArrowRight size={15} /></button>}</header>{data.announcements.length ? <ul>{data.announcements.slice(0, allAnnouncements ? undefined : 3).map(item => <li key={item.id}><time><Clock3 size={15} />{item.publishedAt === null ? '—' : time(item.publishedAt)}</time><p>{item.text}</p></li>)}</ul> : <Empty Icon={Bell} title="Chưa có thông báo công bố">Các hướng dẫn tại sự kiện sẽ xuất hiện ở đây sau khi BTC cập nhật.</Empty>}</section>
    </div>

    <div className="th-live-secondary">
      <section className="th-live-panel" id="doanh-nghiep" aria-labelledby="th-present-title"><header><h2 id="th-present-title"><Building2 />Doanh nghiệp đang có mặt</h2>{present.length > 5 && <button className="th-live-text-button" onClick={() => setAllCompanies(v => !v)}>{allCompanies ? 'Thu gọn' : 'Xem tất cả'} <ArrowRight size={15} /></button>}</header><div className="th-live-filters" role="group" aria-label="Lọc doanh nghiệp có mặt">{[['buyer', 'Nhà máy / Buyer', Factory], ['supplier', 'Nhà cung ứng / Supplier', Package]].map(([id, label, Icon]) => <button key={id} aria-pressed={role === id} onClick={() => { setRole(id); setAllCompanies(false); }}><Icon size={17} />{label} {data.published && `(${data.present.filter(p => p.role === id).length})`}</button>)}</div>{present.length ? <div className="th-live-present-list">{present.slice(0, allCompanies ? undefined : 5).map(item => <article key={item.id}><Company item={item} /><span className="th-live-badge is-present"><Check size={13} />Đã có mặt</span>{item.profilePath && <Link className="th-live-text-button" to={item.profilePath}>Xem hồ sơ <ArrowRight size={14} /></Link>}</article>)}</div> : <Empty Icon={Building2} title="Chờ công bố danh sách có mặt">Chỉ hiển thị doanh nghiệp đã check-in và được phép công khai.</Empty>}</section>

      <section className="th-live-panel th-live-suggestions" aria-labelledby="th-suggestions-title"><header><h2 id="th-suggestions-title"><Sparkles />SUPPI gợi ý: Nên gặp ai tiếp theo?</h2>{data.suggestions.length > 3 && <button className="th-live-text-button" onClick={() => setAllSuggestions(v => !v)}>{allSuggestions ? 'Thu gọn' : 'Xem thêm'} <ArrowRight size={15} /></button>}</header>{data.suggestions.length ? <><p className="th-live-subtitle">Đề xuất kết nối đã được BTC duyệt công bố.</p><div className="th-live-suggestion-list">{data.suggestions.slice(0, allSuggestions ? undefined : 3).map(({ participant, reason, present: isPresent }) => <article key={participant.id}><Company item={participant} /><p>{reason || 'Xem năng lực và nhu cầu để đánh giá mức độ phù hợp.'}</p>{isPresent && <span className="th-live-badge is-present">Đã có mặt</span>}<button className="th-live-button" disabled title="Chưa kết nối chức năng gửi đề nghị gặp tại sự kiện">Đề nghị gặp</button>{participant.profilePath && <Link className="th-live-text-button" to={participant.profilePath}>Xem hồ sơ <ArrowRight size={14} /></Link>}</article>)}</div><small>Gửi đề nghị gặp tại sự kiện chưa được mở; gợi ý không phải lịch hẹn đã xác nhận.</small></> : <Empty Icon={Sparkles} title="Chờ công bố gợi ý phù hợp">Đối tác được đề xuất dựa trên nhu cầu, năng lực và tình trạng tham dự.</Empty>}</section>
    </div>

    <section className="th-live-panel th-live-meetings" aria-labelledby="th-meetings-title"><header><h2 id="th-meetings-title"><Handshake />Cuộc gặp 1:1</h2><span className="th-live-subtitle">Lịch đã được điều phối và công bố</span></header><div className="th-live-filters th-live-meeting-filters" role="group" aria-label="Lọc trạng thái cuộc gặp">{MEETING_STATES.map(status => <button key={status.id} aria-pressed={meetingState === status.id} onClick={() => { setMeetingState(status.id); setSelectedMeeting(null); }}>{status.label}{data.published && ` (${data.meetings.filter(m => m.status === status.id).length})`}</button>)}</div><div className="th-live-table-wrap" tabIndex={0} role="region" aria-label="Bảng lịch gặp, cuộn ngang trên màn hình nhỏ"><table><caption className="sr-only">Lịch gặp 1:1: {MEETING_STATES.find(s => s.id === meetingState).label}</caption><thead><tr>{['Thời gian', 'Bàn', 'Nhà máy / Buyer', 'Nhà cung ứng / Supplier', 'Chủ đề trao đổi', 'Trạng thái', 'Thao tác'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{meetings.length ? meetings.map(meeting => <tr key={meeting.id}><td><time>{time(meeting.startAt)}</time></td><td>{meeting.table || 'Chờ xếp bàn'}</td><td>{meeting.buyer.name}</td><td>{meeting.supplier.name}</td><td>{meeting.topic || 'Chưa công bố chủ đề'}</td><td><span className="th-live-badge">{MEETING_STATES.find(s => s.id === meeting.status).label}</span></td><td><button className="th-live-button" onClick={() => setSelectedMeeting(meeting)}>Xem chi tiết</button></td></tr>) : <tr><td colSpan={7}><Empty Icon={Handshake} title={data.published ? 'Chưa có cuộc gặp ở trạng thái này' : 'Chờ công bố lịch gặp 1:1'}>Thời gian, mã bàn và hai bên tham gia sẽ hiển thị khi lịch được xác nhận.</Empty></td></tr>}</tbody></table></div>{selectedMeeting && <div className="th-live-meeting-detail" role="region" aria-label="Chi tiết cuộc gặp"><button className="th-live-close" aria-label="Đóng chi tiết cuộc gặp" onClick={() => setSelectedMeeting(null)}><X size={19} /></button><h3>{selectedMeeting.buyer.name} <span>↔</span> {selectedMeeting.supplier.name}</h3><p>{time(selectedMeeting.startAt)} · {date(selectedMeeting.startAt)} · {selectedMeeting.table || 'Chờ xếp bàn'}</p><p>{selectedMeeting.topic || 'Chưa công bố chủ đề trao đổi'}</p><small>Chỉ hiển thị thông tin cuộc gặp đã được phép công khai.</small></div>}</section>
  </section>;
}
