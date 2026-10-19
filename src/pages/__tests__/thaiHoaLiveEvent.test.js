import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { liveEventSnapshot, agendaAt } from '../thaiHoaLiveEventModel.js';
import { EVENT_ID, EVENT_FACTS, eventProgram, eventState } from '../thaiHoaEventLandingModel.js';

const approved = { visibility: 'PUBLIC', publishStatus: 'PUBLISHED' };
const participants = [{ id: 'buyer', name: 'Nhà máy thử', role: 'buyer' }, { id: 'supplier', name: 'Nhà cung ứng thử', role: 'supplier' }];
const publishedProgram = liveEvent => ({ id: EVENT_ID, workflowContent: { liveEvent: { ...approved, ...liveEvent } } });

test('missing or unpublished live snapshots show unknown metrics, never fabricated attendance', () => {
  for (const program of [{}, publishedProgram({ visibility: 'INTERNAL' }), publishedProgram({ programId: 'wrong' })]) {
    const data = liveEventSnapshot(program, participants);
    assert.equal(data.published, false);
    assert.deepEqual(data.metrics, { registered: null, buyersPresent: null, suppliersPresent: null, meetingsCompleted: null });
    assert.deepEqual(data.present, []);
    assert.deepEqual(data.meetings, []);
  }
});
test('published metrics validate integer values and attendance intersects approved participants', () => {
  const data = liveEventSnapshot(publishedProgram({ updatedAt: 'bad', metrics: { registered: 156, buyersPresent: -1, suppliersPresent: '68', meetingsCompleted: 1.5 }, presentParticipantIds: ['buyer', 'unknown', 'buyer'], privatePassToken: 'secret' }), participants);
  assert.equal(data.published, true);
  assert.deepEqual(data.metrics, { registered: 156, buyersPresent: null, suppliersPresent: null, meetingsCompleted: null });
  assert.equal(data.updatedAt, null);
  assert.deepEqual(data.present.map(p => p.id), ['buyer']);
  assert.ok(!JSON.stringify(data).includes('secret'));
});
test('only scoped public announcements, suggestions and meetings are projected without private fields', () => {
  const meeting = { ...approved, id: 'm1', programId: EVENT_ID, status: 'UPCOMING', startAt: '2026-10-07T09:15:00+07:00', buyerId: 'buyer', supplierId: 'supplier', table: 'Bàn 05', publicTopic: 'Bao bì', phone: 'secret', notes: 'secret' };
  const data = liveEventSnapshot(publishedProgram({ updatedAt: '2026-10-07T09:42:00+07:00', presentParticipantIds: ['supplier'], meetings: [meeting, meeting, { ...meeting, id: 'm2', programId: 'other' }, { ...meeting, id: 'm3', visibility: 'INTERNAL' }, { ...meeting, id: 'm4', status: 'UNKNOWN' }, { ...meeting, id: 'm5', buyerId: 'hidden' }], announcements: [{ ...approved, id: 'a', publishedAt: '2026-10-07T08:30:00+07:00', text: 'Chào mừng', email: 'secret' }, { id: 'b', text: 'secret' }], suggestions: [{ ...approved, participantId: 'supplier', publicReason: 'Phù hợp nhu cầu bao bì' }, { ...approved, participantId: 'hidden' }] }), participants);
  assert.equal(data.meetings.length, 1);
  assert.equal(data.meetings[0].buyer.name, 'Nhà máy thử');
  assert.equal(data.announcements.length, 1);
  assert.equal(data.suggestions.length, 1);
  assert.ok(Number.isFinite(data.updatedAt));
  assert.ok(!JSON.stringify(data).includes('secret'));
});
test('agenda highlights only the actual event time, not the selected view mode', () => {
  assert.equal(agendaAt(EVENT_FACTS.agenda, EVENT_FACTS.startAt, EVENT_FACTS.endAt, Date.parse('2026-10-07T08:50:00+07:00')), 2);
  assert.equal(agendaAt(EVENT_FACTS.agenda, EVENT_FACTS.startAt, EVENT_FACTS.endAt, Date.parse('2026-10-12T08:50:00+07:00')), -1);
  assert.equal(agendaAt([], 'bad', 'bad', 0), -1);
});
test('during tab replaces pre-event content with a complete honest dashboard', async () => {
  const entry = fileURLToPath(new URL('../ThaiHoaEventLandingPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' }, plugins: [{ name: 'language', setup(build) { build.onLoad({ filter: /LanguageContext\.jsx$/ }, () => ({ contents: "export const useLanguage=()=>({lang:'vi',t:(_p,f)=>f});", loader: 'js' })); } }] });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const now = Date.parse('2026-10-12T08:00:00+07:00');
  const html = renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.ThaiHoaLandingView, { program: eventProgram({}, now), state: eventState({}, now), activeTab: 'during', now, onRegister: () => {}, onTabChange: () => {} })));
  for (const text of ['Check-in sự kiện', 'Lịch trình chương trình', 'Thông báo từ Ban tổ chức', 'Doanh nghiệp đang có mặt', 'SUPPI gợi ý', 'Cuộc gặp 1:1', 'Event Pass chưa được cấp', 'Chờ công bố', 'Sắp diễn ra', 'Đổi lịch', 'Đã hủy']) assert.ok(html.includes(text), text);
  assert.equal((html.match(/id="th-lifecycle-panel"/g) || []).length, 1);
  assert.doesNotMatch(html, /ABC Foods|Green Pallet|156|Đã check-in|Gói tài trợ sự kiện|Chi phí tham gia|data:image/);
  assert.ok(html.includes('Sau sự kiện · Chờ công bố kết quả'));
  const record = publishedProgram({ metrics: { registered: 12, buyersPresent: 4, suppliersPresent: 8, meetingsCompleted: 2 }, updatedAt: '2026-10-07T08:50:00+07:00', presentParticipantIds: ['buyer', 'supplier'], announcements: [{ ...approved, id: 'notice', text: 'Thông báo thử đã duyệt', publishedAt: '2026-10-07T08:45:00+07:00' }], suggestions: [{ ...approved, participantId: 'supplier', publicReason: 'Năng lực bao bì phù hợp' }], meetings: [{ ...approved, id: 'meeting', buyerId: 'buyer', supplierId: 'supplier', startAt: '2026-10-07T09:15:00+07:00', table: 'Bàn 05', publicTopic: 'Bao bì thử', status: 'UPCOMING', phone: 'private-secret' }] });
  const liveNow = Date.parse('2026-10-07T08:50:00+07:00');
  const liveHtml = renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.ThaiHoaLandingView, { program: eventProgram(record, liveNow), participants, state: eventState(record, liveNow), activeTab: 'during', now: liveNow, identity: { id: 'test' }, onRegister: () => {}, onTabChange: () => {} })));
  for (const text of ['Thông báo thử đã duyệt', 'Năng lực bao bì phù hợp', 'Nhà máy thử', 'Nhà cung ứng thử', 'Bàn 05', 'Bao bì thử', 'Đã có mặt', 'Xem chi tiết', 'Đề nghị gặp', 'Sắp diễn ra (1)', '08:50']) assert.ok(liveHtml.includes(text), text);
  assert.match(liveHtml, /class="is-current"/);
  assert.doesNotMatch(liveHtml, /private-secret|Đã check-in|Đăng nhập tài khoản/);
});
