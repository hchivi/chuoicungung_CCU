import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Module from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const eventPath = new URL('../../../server/data/programs/team-kcn-thai-hoa.json', import.meta.url);
const event = () => JSON.parse(readFileSync(eventPath, 'utf8'));
async function hero(program) {
  const entry = fileURLToPath(new URL('../../components/programs/ProgramDetailHero.jsx', import.meta.url));
  assert.ok(existsSync(entry), 'Dedicated program hero is implemented');
  const output = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry; mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  mod._compile(output.outputFiles[0].text, entry);
  return renderToStaticMarkup(React.createElement(mod.exports.default, { program }));
}
test('new day uses exact supplied schedule, projected attendance and no invented participants/results', () => {
  assert.ok(existsSync(eventPath), 'TeamKCN event record exists');
  const p = event();
  assert.equal(p.date, '07/10/2026'); assert.equal(p.registrationCloseAt, '2026-09-29T23:59:59+07:00');
  assert.equal(p.factoriesCount, 20); assert.equal(p.suppliersCount, 20); assert.equal(p.attendanceIsProjected, true);
  assert.deepEqual(p.agenda.map(x => x.time), ['08:00', '08:30', '08:45', '09:00', '11:00']);
  assert.deepEqual(p.matchedPairs, []); assert.deepEqual(p.needToBuy, []); assert.deepEqual(p.needToSell, []);
});
test('fees preserve all four source amounts, including ambiguous table unit note', () => {
  assert.ok(existsSync(eventPath), 'TeamKCN event record exists');
  const p = event();
  assert.deepEqual(p.participationOptions.map(x => x.amount), [750000, 1000000, 1500000, 2000000]);
  assert.match(p.participationOptions[3].description, /xác nhận.*đơn vị/i);
  assert.equal(p.supportContact.phone, '0906662999');
});
test('hero contains three workflow stages, complete logistics and role-specific registration entry points', async () => {
  const html = await hero({ id: 'p', title: 'Kết nối mua hàng', status: 'dang-nhan-dang-ky', date: '20/11/2026', location: 'Địa chỉ đầy đủ không cắt ngắn', organizer: 'Ban tổ chức đầy đủ', needGroup: ['Cơ khí'] });
  for (const text of ['Đăng ký &amp; tài trợ', 'Matching', 'Sau kết nối', 'Địa chỉ đầy đủ không cắt ngắn', 'Ban tổ chức đầy đủ', 'data-hero-role="buyer"', 'data-hero-role="supplier"', 'data-hero-role="association"', 'data-hero-role="sponsor"']) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /0903 888 777|Lê Minh Quân|đã xác nhận/i);
});
test('video is click-to-load, not auto-downloaded; past event never invites registration', async () => {
  const html = await hero({ title: 'TeamKCN', status: 'da-dien-ra', programStatus: 'COMPLETED', statusName: 'Đã qua ngày tổ chức', introVideo: { src: '/videos/programs/team-kcn-introduction.mp4', poster: '/images/programs/team-kcn-introduction.jpg' }, attendanceIsProjected: true, factoriesCount: 20, suppliersCount: 20 });
  assert.match(html, /Xem video giới thiệu TeamKCN/); assert.match(html, /Dự kiến/);
  assert.doesNotMatch(html, /<video|autoplay|data-hero-role|THÀNH CÔNG/);
  assert.match(html, /href="#sau-matching"/);
});
test('program public support contact is explicit opt-in and does not expose private records', async () => {
  const repo = await import('../../../server/storage/supabaseRepository.js');
  assert.equal(typeof repo.publicProgramRecord, 'function');
  const p = { id: 'p', supportContact: { phone: '0906662999', coordinatorName: 'TeamKCN', visibility: 'PUBLIC', publishStatus: 'PUBLISHED', email: 'private@example.com' } };
  assert.equal(repo.publicProgramRecord(p).supportContact.phone, '0906662999');
  assert.equal(repo.publicProgramRecord(p).supportContact.email, undefined);
  assert.equal(repo.publicProgramRecord({ ...p, supportContact: { phone: 'secret' } }).supportContact.phone, undefined);
  assert.equal(repo.publicProgramRecord({ ...p, visibility: 'PRIVATE' }), null);
  assert.equal(repo.publicRecord(p).supportContact.phone, undefined);
});
