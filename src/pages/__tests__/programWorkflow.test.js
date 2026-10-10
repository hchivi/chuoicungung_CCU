import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

async function component(name, props) {
  const entry = fileURLToPath(new URL(`../../components/programs/${name}.jsx`, import.meta.url));
  const result = await build({ entryPoints: [entry], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-router-dom'], loader: { '.css': 'empty' } });
  const mod = new Module(entry); mod.filename = entry;
  mod.paths = Module._nodeModulePaths(fileURLToPath(new URL('../..', import.meta.url)));
  mod._compile(result.outputFiles[0].text, entry);
  return renderToStaticMarkup(React.createElement(mod.exports.default, props));
}
const model = () => import('../../components/programs/programWorkflowModel.js');
const program = { id: 'test-event', title: 'Giao thương', status: 'dang-nhan-dang-ky', participationOptions: [{ id: 'buyer-free', role: 'BUYER', feeType: 'FREE', amount: 0 }, { id: 'supplier-paid', role: 'SUPPLIER', feeType: 'FIXED', amount: 6500000 }] };
const valid = { companyName: 'Doanh nghiệp kiểm thử', contactPerson: 'Đại diện', phone: '0901234567', email: 'qa@example.com', productsNeeded: 'Bao bì', productsOffered: 'CNC', targetFactories: 'Nhà máy A', memberCount: '4', consent: true };

test('registration has four roles, labelled fields and no invented sponsorship prices', async () => {
  const html = await component('ProgramRegistrationSection', { program });
  for (const role of ['buyer', 'supplier', 'association', 'sponsor']) assert.ok(html.includes(`data-registration-role="${role}"`));
  assert.match(html, /for="pw-companyName"/);
  assert.match(html, /6\.500\.000/);
  assert.doesNotMatch(html, /50\.000\.000|30\.000\.000|15\.000\.000|3\.500\.000/);
});
test('canonical status takes precedence; closed/cancelled/unknown cannot register', async () => {
  const { registrationState } = await model();
  assert.equal(registrationState(program).open, true);
  assert.equal(registrationState({ ...program, programStatus: 'CANCELLED' }).open, false);
  for (const status of ['da-dien-ra', 'da-dong-dang-ky', 'hoan', 'huy', 'sap-mo-dang-ky', 'dang-khao-sat', 'unknown']) assert.equal(registrationState({ status }).open, false);
});
test('fees and agenda use this program only, including FREE, FIXED and unpublished rates', async () => {
  const { feeLabel, workflowContent } = await model();
  assert.equal(feeLabel({ feeType: 'FREE' }), 'Miễn phí');
  assert.match(feeLabel(program.participationOptions[1]), /6\.500\.000/);
  assert.equal(feeLabel({ feeType: 'FIXED', amount: -1 }), 'Chờ công bố mức phí');
  assert.equal(feeLabel({}), 'Chờ công bố mức phí');
  assert.deepEqual(workflowContent(program).agenda, []);
  assert.deepEqual(workflowContent({ ...program, workflowContent: { agenda: [] }, agenda: [{ time: '08:00' }] }).agenda, []);
});
test('matching targets select the correct opposite role and preserve need identity', async () => {
  const { meetingTarget } = await model();
  assert.deepEqual(meetingTarget('buyer', { id: 'n1', buyerSummary: 'Nhà máy A', title: 'Cần CNC' }), { role: 'supplier', name: 'Nhà máy A', needId: 'n1', product: 'Cần CNC' });
  assert.equal(meetingTarget('supplier', { name: 'NCC A' }).role, 'buyer');
});
test('all four roles build compatible private programRegistration payloads', async () => {
  const { buildRegistration } = await model();
  for (const [role, canonical, section] of [['buyer', 'BUYER', 'buyerData'], ['supplier', 'SUPPLIER', 'supplierData'], ['association', 'PARTNER', 'partnerData'], ['sponsor', 'SPONSOR', 'sponsorData']]) {
    const payload = buildRegistration(program, role, valid, '');
    assert.equal(payload.role, canonical); assert.ok(payload[section]);
    assert.equal(payload.programId, program.id);
    assert.equal(payload.consent, true);
    assert.equal(payload.paymentStatus, undefined);
    assert.equal(payload.confirmed, undefined);
    assert.equal(payload.submittedAt, undefined, 'retry payload must be stable');
  }
});
test('invalid, non-consenting, closed and stale package registrations are rejected', async () => {
  const { buildRegistration } = await model();
  for (const fields of [{ ...valid, consent: false }, { ...valid, phone: 'x' }, { ...valid, email: 'invalid' }, { ...valid, companyName: ' ' }, { ...valid, productsNeeded: '' }]) assert.throws(() => buildRegistration(program, 'buyer', fields, ''));
  for (const memberCount of ['0', '1.5', '-2']) assert.throws(() => buildRegistration(program, 'association', { ...valid, memberCount }, ''));
  for (const attendeesCount of ['0', '1.5', '-2', 'not-number']) assert.throws(() => buildRegistration(program, 'buyer', { ...valid, attendeesCount }, ''));
  assert.throws(() => buildRegistration(program, 'association', { ...valid, productsOffered: '' }, ''));
  assert.throws(() => buildRegistration(program, 'sponsor', { ...valid, presentationTopic: '' }, ''));
  assert.throws(() => buildRegistration({ ...program, status: 'huy' }, 'buyer', valid, ''));
  assert.throws(() => buildRegistration(program, 'supplier', valid, 'buyer-free'));
  assert.throws(() => buildRegistration(program, 'unknown', valid, ''));
});
test('only server ACK produces success and failure propagates without local fallback', async () => {
  const { sendRegistration } = await model();
  const data = { programId: 'test' };
  const receipt = await sendRegistration(data, async (kind, payload) => {
    assert.equal(kind, 'programRegistration'); assert.equal(payload, data);
    return { id: 'CCU-real-id', persisted: true };
  });
  assert.equal(receipt.id, 'CCU-real-id');
  await assert.rejects(sendRegistration(data, async () => { throw new Error('Supabase chưa truy cập được'); }), /Supabase/);
  await assert.rejects(sendRegistration(data, async () => ({})), /xác nhận/);
});
test('public results are scoped, opt-in, allowlisted and unsafe photo URLs are removed', async () => {
  const { publicResults } = await model();
  const pair = { id: 'm1', programId: 'test-event', visibility: 'PUBLIC', publishStatus: 'PUBLISHED', buyer: 'Buyer A', supplier: 'NCC A', product: 'CNC', phone: 'private', budget: 100, note: 'private' };
  const result = publicResults({ ...program, matchedPairs: [pair, { ...pair, programId: 'other' }, { ...pair, visibility: 'INTERNAL' }, { ...pair, publishStatus: 'DRAFT' }], gallery: [{ url: 'javascript:alert(1)', visibility: 'PUBLIC', publishStatus: 'PUBLISHED' }, { url: '/images/real.jpg', visibility: 'PUBLIC', publishStatus: 'PUBLISHED', caption: 'Ảnh thật' }] });
  assert.equal(result.pairs.length, 1);
  assert.equal(result.pairs[0].phone, undefined); assert.equal(result.pairs[0].budget, undefined); assert.equal(result.pairs[0].note, undefined);
  assert.equal(result.photos.length, 1);
});
test('post matching is an honest empty state, not identical fabricated deals on every event', async () => {
  const html = await component('ProgramPostMatchingSection', { program });
  assert.match(html, /Chưa công bố cặp kết nối/);
  assert.match(html, /Gửi ảnh và kết quả/);
  assert.doesNotMatch(html, /CJ Cầu Tre|86\.4%|142|18<|Đã Ký MOU/);
});
test('matching exposes readable public demand and capability with no blanket KYC guarantee', async () => {
  const html = await component('ProgramMatchingSection', { program, publicBuyerNeeds: [{ id: 'need-1', title: 'Bao bì carton', buyerSummary: 'Nhà máy A', publicSummary: 'Số lượng 1000', publicRequirements: ['ISO'] }] });
  assert.match(html, /Bao bì carton/); assert.match(html, /Nhà máy A/);
  assert.match(html, /data-matching-target="need-1"/);
  assert.doesNotMatch(html, /Đã thẩm định nhu cầu thật|KYC Verified|42 DN/);
});
