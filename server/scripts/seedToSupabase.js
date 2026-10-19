// Additive, repeatable import. Never truncates or overwrites existing cloud rows.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { getSupabase } from '../supabase.js';
import { publicRecord, databaseResult, requireDatabase } from '../storage/supabaseRepository.js';

const readJson = async name => JSON.parse(await readFile(new URL(`../../src/data/${name}.json`, import.meta.url), 'utf8'));
async function insertMissing(client, table, records, onConflict = 'id') {
  const unique = [...new Map(records.map(row => [`${row.collection || ''}:${row.id}`, row])).values()];
  for (let offset = 0; offset < unique.length; offset += 200) await databaseResult(client.from(table).upsert(unique.slice(offset, offset + 200), { onConflict, ignoreDuplicates: true }));
  console.log(`${table}: processed ${unique.length} source records (existing rows preserved)`);
}
async function requirePrivateTables() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error('Public key is required to verify deny-by-default access before importing.');
  const publicClient = createClient(process.env.SUPABASE_URL, key, { auth: { persistSession: false } });
  for (const table of ['enterprises','factories','industrial_parks','organizations','demands','suppi_conversations','requirement_drafts','ccu_documents','ccu_submissions']) {
    const { error, status } = await publicClient.from(table).select('id').limit(1);
    if (!error || ![401, 403].includes(status)) throw new Error(`Import stopped: ${table} public access is not explicitly denied.`);
  }
}
export async function seedSupabase() {
  const client = getSupabase();
  requireDatabase(client);
  await requirePrivateTables();
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  try {
    const module = name => vite.ssrLoadModule(`/src/data/${name}.js`);
    const programs = await module('programsData');
    const catalogues = await module('cataloguesData');
    const orgs = await module('organizationsData');
    const associations = await module('associationsData');
    const factories = await module('factoriesData');
    const parks = await module('industrialParksData');
    const requirements = await module('requirementsData');
    const products = await module('productServicesData');
    // Original site content is preserved as content, not certified as verified facts.
    const rawAssociations = await readJson('associations');
    const organizations = [...orgs.SEED_ORGANIZATIONS, ...rawAssociations.map(row => ({ ...row, roles: ['ASSOCIATION'], province: row.region || row.province, slug: row.slug }))];
    await insertMissing(client, 'organizations', organizations.map(row => ({ id: String(row.id), name: row.name, roles: row.roles || [], canonical_slug: row.slug || null, status: row.isPublished === false ? 'DRAFT' : 'PUBLISHED', verification_status: 'UNVERIFIED', metadata: { ...publicRecord({ ...row, isPublished: true }), migrationSource: 'existing-website-content' } })));
    const collections = {
      programs: programs.SEED_PROGRAMS,
      catalogues: catalogues.SEED_MASTER_CATALOGUES,
      associationProfiles: associations.SEED_ASSOCIATION_PROFILES,
      programOrganizations: associations.SEED_PROGRAM_ORGANIZATIONS.filter(row => row.status === 'CONFIRMED' || row.status === 'ACTIVE'),
      organizationMemberships: associations.SEED_ORGANIZATION_MEMBERSHIPS.filter(row => row.publicDisplay === true && row.status === 'CONFIRMED'),
      factoryProfiles: factories.SEED_FACTORY_PROFILES,
      kcnOrganizations: parks.SEED_KCN_ORGANIZATIONS.filter(row => row.status === 'CONFIRMED'),
      supplyGaps: [],
      productsServices: products.SEED_PRODUCT_SERVICES,
      publicRequirements: requirements.SEED_REQUIREMENTS.filter(row => ['PUBLIC','PUBLIC_SUMMARY'].includes(row.visibility) && row.moderationStatus === 'APPROVED').map(row => ({ ...requirements.toPublicRequirementSummary(row), moderationStatus: 'APPROVED' })),
      categories: await readJson('industryCategories69Pages'),
      categoriesAlphabetical: Object.entries(await readJson('categoriesAlphabetical')).map(([id, items]) => ({ id, items }))
    };
    for (const [collection, records] of Object.entries(collections)) {
      const rows = records.map((row, index) => { const data = publicRecord(row); return data ? { id: String(row.id || row.slug || row.organizationId || `${collection}-${index}`), collection, visibility: 'PUBLIC', data } : null; }).filter(Boolean);
      await insertMissing(client, 'ccu_documents', rows, 'collection,id');
      console.log(`  ${collection}: ${rows.length}`);
    }
    for (const [file, table] of [['enterprisesFull','enterprises'], ['factoriesFull','factories'], ['industrialParksFull','industrial_parks']]) {
      const raw = await readJson(file);
      await insertMissing(client, table, raw.map(row => ({ id: String(row.id || row.code || row.name), name: row.name, province: row.province || '', data: row })));
    }
    console.log('Import completed. Existing cloud records were not overwritten; no demo registrations/claims or private browser records were imported.');
  } finally { await vite.close(); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) seedSupabase().catch(error => { console.error('Import failed:', error.code || error.message); process.exitCode = 1; });
