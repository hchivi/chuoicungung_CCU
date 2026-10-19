// Explicit CLI importer, not an unauthenticated public endpoint.
import { readFile, mkdir, open, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { planSupplierImport, applySupplierPlan } from '../ingestion/supplierImport.js';

const args = process.argv.slice(2);
const option = key => args.includes(key) ? args[args.indexOf(key) + 1] : null;
const sourceFile = option('--source');
if (!sourceFile) throw new Error('Usage: node server/scripts/importTrangVangSupabase.js --source suppliers.jsonl --existing snapshot.json (offline), or --live-read [--apply --confirm-host PROJECT.supabase.co]');
const parseRows = text => text.trim().startsWith('[') ? JSON.parse(text) : text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
const incoming = parseRows(await readFile(resolve(sourceFile), 'utf8'));
if (!incoming.length) throw new Error('No supplier records: nothing imported');
let existing, client;
if (args.includes('--live-read')) {
  const { getSupabase } = await import('../supabase.js');
  client = getSupabase();
  if (!client) throw new Error('Supabase server credentials are not configured');
  if (args.includes('--apply') && option('--confirm-host') !== new URL(process.env.SUPABASE_URL).hostname) throw new Error('Confirm the configured project hostname before writing');
  existing = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from('enterprises').select('*').order('id').range(offset, offset + 999);
    if (error) throw new Error('Supabase read failed; no write attempted');
    existing.push(...data);
    if (data.length < 1000) break;
  }
} else {
  if (args.includes('--apply')) throw new Error('--apply requires --live-read');
  if (!option('--existing')) throw new Error('Offline planning requires --existing snapshot.json; no implicit cloud read');
  existing = JSON.parse(await readFile(resolve(option('--existing')), 'utf8'));
}
const plan = planSupplierImport(incoming, existing);
const output = resolve('.crawl-data/trangvang/imports', new Date().toISOString().replace(/[:.]/g, '-'));
await mkdir(output, { recursive: true, mode: 0o700 });
await writeFile(join(output, 'plan.json'), JSON.stringify(plan), { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ mode: args.includes('--apply') ? 'apply' : 'dry-run', records: incoming.length, inserts: plan.filter(item => item.action === 'insert').length, updates: plan.filter(item => item.action === 'update').length, review: plan.filter(item => item.action === 'review').length, privatePlan: output }));
if (args.includes('--apply')) {
  const journal = await open(join(output, 'journal.jsonl'), 'ax', 0o600);
  const append = async value => { await journal.write(`${JSON.stringify(value)}\n`); await journal.sync(); };
  try {
    const result = await applySupplierPlan(plan, {
      read: async id => {
        const { data, error } = await client.from('enterprises').select('*').eq('id', id).maybeSingle();
        if (error) throw new Error('Supabase recheck failed');
        return data;
      },
      backup: item => append({ kind: 'before-write', ...item }),
      write: async item => {
        const value = { id: item.after.id, name: item.after.name, province: item.after.province, data: item.after.data, updated_at: new Date().toISOString() };
        let query;
        if (item.action === 'insert') query = client.from('enterprises').insert(value);
        else {
          if (!item.before.updated_at) throw new Error('Cannot update without a concurrency timestamp');
          query = client.from('enterprises').update(value).eq('id', value.id).eq('updated_at', item.before.updated_at);
        }
        const { data, error } = await query.select('*').single();
        if (error) throw new Error('Supabase write failed/conflicted; retained backup, stopped batch');
        return data;
      },
      receipt: value => append({ kind: 'ack', ...value })
    });
    console.log(JSON.stringify({ ...result, websiteRefresh: 'Backend cache invalidation/restart and browser reload are required; no real-time publication claimed.' }));
  } finally { await journal.close(); }
}
