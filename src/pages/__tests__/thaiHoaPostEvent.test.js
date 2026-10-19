import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { postEventSnapshot } from '../thaiHoaPostEventModel.js';
import { EVENT_ID, eventProgram, eventState } from '../thaiHoaEventLandingModel.js';

const publicApproved = { visibility: 'PUBLIC', publishStatus: 'PUBLISHED' };
const participants = [{ id: 'b', name: 'Nhà máy kiểm thử', role: 'buyer', logo: '/test-logo.png', industry: 'Thực phẩm', profilePath: '/nha-may/test' }, { id: 's', name: 'Nhà cung ứng kiểm thử', role: 'supplier', industry: 'Bao bì' }];
const programWith = data => ({ id: EVENT_ID, workflowContent: { postEvent: { ...publicApproved, ...data } } });

test('post-event aggregates are unknown unless published and scoped to this event', () => {
  for (const program of [{}, programWith({ visibility: 'INTERNAL', metrics: { registered: 156 } }), programWith({ programId: 'other', metrics: { registered: 156 } })]) {
    const result = postEventSnapshot(program, participants);
    assert.equal(result.published, false);
    assert.ok(Object.values(result.metrics).every(v => v === null));
    assert.deepEqual(result.attended, []);
    assert.equal(result.outcomeTotal, null);
    assert.deepEqual(result.documents, []);
  }
});
test('published metrics validate integers; attendance is deduplicated and intersections are public only', () => {
  const result = postEventSnapshot(programWith({ metrics: { registered: 12, attended: 8, checkedIn: 7, buyers: -1, suppliers: '4', meetings: 2.5, needs: 0, nextActions: 3 }, matchedSuggestions: 9, attendedParticipantIds: ['b', 'b', 's', 'hidden'], tasks: [{ title: 'secret task' }], email: 'secret' }), participants);
  assert.equal(result.metrics.registered, 12);
  assert.equal(result.metrics.needs, 0);
  assert.equal(result.metrics.buyers, null);
  assert.equal(result.metrics.suppliers, null);
  assert.equal(result.metrics.meetings, null);
  assert.equal(result.matchedSuggestions, 9);
  assert.deepEqual(result.attended.map(p => p.id), ['b', 's']);
  assert.ok(!JSON.stringify(result).includes('secret'));
});
test('outcome counts produce honest percentages; incomplete, duplicate or inconsistent breakdowns never draw a donut', () => {
  const outcomes = ['CONTINUE', 'QUOTE', 'SURVEY', 'SAMPLE', 'SECOND_MEETING', 'NOT_FIT'].map((id, index) => ({ id, count: index === 0 ? 5 : 1 }));
  const result = postEventSnapshot(programWith({ metrics: { meetings: 10 }, outcomes }), participants);
  assert.equal(result.outcomeTotal, 10);
  assert.equal(result.outcomes[0].percent, 50);
  for (const invalid of [outcomes.slice(0, 3), [...outcomes, outcomes[0]], outcomes.map(v => ({ ...v, count: -1 })), outcomes.map(v => ({ ...v, count: 0 }))]) assert.equal(postEventSnapshot(programWith({ outcomes: invalid })).outcomeTotal, null);
  assert.equal(postEventSnapshot(programWith({ metrics: { meetings: 11 }, outcomes })).outcomeTotal, null);
});
test('themes, documents and event media require public approval, correct scope and safe URLs', () => {
  const program = programWith({
    demandThemes: [{ label: 'Bao bì', count: 6 }, { label: 'Logistics', count: 4 }, { label: 'invalid', count: -1 }],
    documents: [
      { ...publicApproved, id: 'r', kind: 'SUMMARY', title: 'Báo cáo đã duyệt', url: '/reports/test.pdf', sizeBytes: 1200000 },
      { ...publicApproved, id: 'bad', title: 'secret', url: 'javascript:alert(1)' },
      { ...publicApproved, id: 'other', title: 'secret', url: '/private.pdf', programId: 'other' },
      { id: 'internal', title: 'secret', url: '/private.pdf' },
    ],
    media: [
      { ...publicApproved, id: 'v', kind: 'VIDEO', url: '/videos/test.mp4', poster: '/images/test.jpg', caption: 'Video sự kiện' },
      { ...publicApproved, id: 'bad-video', kind: 'VIDEO', url: '//unsafe.test/a.mp4' },
    ],
  });
  program.workflowContent.gallery = [
    { ...publicApproved, id: 'p', url: '/images/event-real.jpg', caption: 'Cuộc gặp đã duyệt' },
    { ...publicApproved, id: 'wrong-photo', programId: 'other', url: '/private.jpg' },
  ];
  const result = postEventSnapshot(program, participants);
  assert.equal(result.themes.length, 2);
  assert.equal(result.themes[0].percent, 60);
  assert.equal(result.documents.length, 1);
  assert.equal(result.report.url, '/reports/test.pdf');
  assert.equal(result.media.length, 2);
  assert.ok(result.media.some(item => item.kind === 'VIDEO'));
  assert.ok(!JSON.stringify(result).includes('secret'));
  assert.equal(postEventSnapshot({ workflowContent: { gallery: [{ ...publicApproved, url: '/real.jpg' }] } }).media.length, 1);
});
test('after tab renders the requested dashboard, not pre-event fees or invented results', async () => {
  const entry = fileURLToPath(new URL('../ThaiHoaEventLandingPage.jsx', import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' }, plugins: [{ name: 'language', setup(build) { build.onLoad({ filter: /LanguageContext\.jsx$/ }, () => ({ contents: "export const useLanguage=()=>({lang:'vi',t:(_p,f)=>f});", loader: 'js' })); } }] });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url))); mod._compile(result.outputFiles[0].text, entry);
  const now = Date.parse('2026-10-12T09:00:00+07:00');
  const render = (record = {}) => renderToStaticMarkup(React.createElement(StaticRouter, null, React.createElement(mod.exports.ThaiHoaLandingView, { program: eventProgram(record, now), participants, state: eventState(record, now), activeTab: 'after', now, onRegister: () => {}, onTabChange: () => {} })));
  const html = render();
  for (const label of ['Tổng quan kết quả', 'Hành trình kết nối', 'Kết quả sau cuộc gặp', 'Nhu cầu được trao đổi nhiều nhất', 'Những doanh nghiệp tiêu biểu đã tham gia', 'Việc của tôi sau Ngày hội', 'Hình ảnh &amp; Video', 'Tài liệu sự kiện', 'Tải báo cáo tổng quan', 'Chưa công bố cặp kết nối', 'Gửi ảnh và kết quả']) assert.ok(html.includes(label), label);
  assert.equal((html.match(/id="th-lifecycle-panel"/g) || []).length, 1);
  assert.doesNotMatch(html, /ABC Foods|Green Pallet|156|145|312|Gói tài trợ sự kiện|Chi phí tham gia|data-registration-role|lucide-sparkles/);
  const populated = render(programWith({ metrics: { registered: 12, attended: 8, checkedIn: 7, buyers: 4, suppliers: 4, meetings: 10, needs: 6, nextActions: 5 }, outcomes: ['CONTINUE', 'QUOTE', 'SURVEY', 'SAMPLE', 'SECOND_MEETING', 'NOT_FIT'].map((id, i) => ({ id, count: i === 0 ? 5 : 1 })), attendedParticipantIds: ['b', 's'], documents: [{ ...publicApproved, id: 'r', kind: 'SUMMARY', title: 'Báo cáo kết quả đã duyệt', url: '/reports/test.pdf' }], media: [{ ...publicApproved, id: 'v', kind: 'VIDEO', caption: 'Video cuộc gặp', url: '/videos/test.mp4' }], tasks: [{ title: 'private-secret' }] }));
  for (const text of ['Nhà máy kiểm thử', '/reports/test.pdf', 'Video cuộc gặp', '50%', 'preload="none"']) assert.ok(populated.includes(text), text);
  assert.doesNotMatch(populated, /private-secret/);
});
