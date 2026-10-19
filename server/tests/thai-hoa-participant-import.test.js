import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDirectoryParticipants, mergeDirectoryParticipants } from '../imports/thaiHoaParticipants.js';
import { XTTM_DIRECTORY_ITEMS } from '../../src/data/xttmDirectoryData.js';
import { findEventRecord, publicParticipants, EVENT_ID, EVENT_PATH } from '../../src/pages/thaiHoaEventLandingModel.js';

test('provided directory produces 40 unique companies, 16 THIP buyers and 24 suppliers', () => {
  const participants = buildDirectoryParticipants(XTTM_DIRECTORY_ITEMS, 'PRG-2026-TEAMKCN-THAIHOA');
  assert.equal(participants.length, 40);
  assert.equal(participants.filter(p => p.role === 'BUYER').length, 16);
  assert.equal(participants.filter(p => p.role === 'SUPPLIER').length, 24);
  assert.equal(new Set(participants.map(p => p.id)).size, 40);
  assert.equal(participants.filter(p => p.name === 'Phương Yên').length, 1);
  assert.equal(participants.filter(p => p.name === 'FRESHAIR').length, 1);
  assert.equal(participants.filter(p => p.name === 'LBS').length, 1);
  assert.equal(participants.find(p => p.name === 'LBS').connectionGroups.length, 2);
  assert.equal(publicParticipants({ id: 'PRG-2026-TEAMKCN-THAIHOA', participants }).length, 40);
});

test('public import is allowlisted, never copies personal contacts or invents logos and needs', () => {
  const rows = [{ company: 'Example', org: 'THIP Members', field: 'Paper', groupCode: 'Group B', email: 'private@example.com', phone: '0900000000', attendee: 'Private person', logo: 'javascript:bad', publicSummary: 'invented demand' }];
  const [p] = buildDirectoryParticipants(rows, EVENT_ID);
  assert.equal(p.industry, 'Paper');
  assert.equal(p.publicSummary, 'Mục tiêu kết nối: Mua chung.');
  assert.deepEqual(p.connectionGroups, ['Mua chung']);
  assert.equal(p.logo, '');
  assert.deepEqual(p.productsServices, []);
  assert.equal(/private|0900000000|javascript|invented/.test(JSON.stringify(p)), false);
  assert.throws(() => buildDirectoryParticipants([{ company: 'Bad', org: 'Unknown', groupCode: 'Group A' }], EVENT_ID), /organization/i);
  assert.throws(() => buildDirectoryParticipants([{ company: 'Bad', org: 'THIP Members', groupCode: 'Unknown' }], EVENT_ID), /group/i);
  assert.deepEqual(buildDirectoryParticipants([{ company: '  ' }], EVENT_ID), []);
  assert.equal(buildDirectoryParticipants([{ company: 'No field', org: 'GEM Members', groupCode: 'Group A' }], EVENT_ID)[0].industry, '');
});

test('merge is idempotent and preserves unrelated participants, logos, private status and other program fields', () => {
  const incoming = buildDirectoryParticipants(XTTM_DIRECTORY_ITEMS, EVENT_ID);
  const existing = { id: EVENT_ID, title: 'Keep title', workflowContent: { agenda: ['Keep agenda'], participants: [{ id: 'other', name: 'Unrelated' }, { ...incoming[0], logo: '/logo.png', visibility: 'INTERNAL', status: 'PENDING' }] } };
  const merged = mergeDirectoryParticipants(existing, incoming);
  assert.equal(merged.title, existing.title);
  assert.deepEqual(merged.workflowContent.agenda, ['Keep agenda']);
  assert.equal(merged.participants.length, 41);
  assert.equal(merged.participants.find(p => p.id === incoming[0].id).logo, '/logo.png');
  assert.equal(merged.participants.find(p => p.id === incoming[0].id).visibility, 'INTERNAL');
  assert.equal(merged.participants.find(p => p.id === incoming[0].id).status, 'PENDING');
  assert.deepEqual(mergeDirectoryParticipants(merged, incoming), merged);
  assert.equal(existing.participants, undefined);
});

test('event lookup recognizes existing Supabase identity as well as canonical and legacy slug', () => {
  const unrelated = { id: 'other' };
  for (const record of [{ id: EVENT_ID }, { id: 'PRG-2026-TEAMKCN-THAIHOA' }, { slug: EVENT_PATH.split('/').at(-1) }, { slug: 'biz-matching-kcn-thai-hoa-team-kcn' }, { publicCode: 'TEAMKCN-TH-2026' }]) {
    assert.equal(findEventRecord([unrelated, record]), record);
  }
  assert.deepEqual(findEventRecord([]), {});
});
