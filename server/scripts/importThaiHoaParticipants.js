import { writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { getSupabase } from '../supabase.js';
import { XTTM_DIRECTORY_ITEMS } from '../../src/data/xttmDirectoryData.js';
import { buildDirectoryParticipants, mergeDirectoryParticipants } from '../imports/thaiHoaParticipants.js';
import { publicParticipants } from '../../src/pages/thaiHoaEventLandingModel.js';

// One-time, verified source import. Does not modify the Google workbook.
// Run without --apply first; the source's business fields were reconciled
// against the downloaded workbook, tab "Danh Bạ XTTM Chi Tiết", gid 370501853.
const client = getSupabase();
if (!client) throw new Error('Supabase is not configured');
const id = 'PRG-2026-TEAMKCN-THAIHOA';
const result = await client.from('ccu_documents').select('id,data,updated_at').eq('collection', 'programs').eq('id', id).single();
if (result.error) throw new Error(`Cannot read target program: ${result.error.code || 'DATABASE_UNAVAILABLE'}`);
const before = result.data;
const incoming = buildDirectoryParticipants(XTTM_DIRECTORY_ITEMS, before.data.id || id);
const data = mergeDirectoryParticipants(before.data, incoming);
const visible = publicParticipants(data);
const summary = { programId: id, sourceRows: XTTM_DIRECTORY_ITEMS.length, uniqueCompanies: incoming.length, publicCompanies: visible.length, buyers: visible.filter(p => p.role === 'buyer').length, suppliers: visible.filter(p => p.role === 'supplier').length };
if (incoming.length !== 40 || summary.buyers !== 16 || summary.suppliers !== 24) throw new Error('Import reconciliation failed; nothing written');
if (process.argv.includes('--apply')) {
  const backup = `/private/tmp/ccu-thaihoa-program-${Date.now()}.json`;
  await writeFile(backup, JSON.stringify(before), { mode: 0o600, flag: 'wx' });
  const updated = await client.from('ccu_documents').update({ data, updated_at: new Date().toISOString() }).eq('collection', 'programs').eq('id', id).eq('updated_at', before.updated_at).select('id').maybeSingle();
  if (updated.error || !updated.data) throw new Error('Import not confirmed: database error or concurrent edit');
  const saved = await client.from('ccu_documents').select('data').eq('collection', 'programs').eq('id', id).single();
  if (saved.error || !isDeepStrictEqual(saved.data.data, data)) throw new Error('Read-back verification failed');
  console.log(JSON.stringify({ ...summary, applied: true, backup }));
} else console.log(JSON.stringify({ ...summary, applied: false }));
