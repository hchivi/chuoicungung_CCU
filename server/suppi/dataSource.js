import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), 'utf8'));
}

export async function loadSuppiData() {
  const [
    suppliers, factories, industrialParks, associations,
    productModule, programModule, catalogueModule, requirementModule
  ] = await Promise.all([
    readJson('src/data/enterprisesFull.json'),
    readJson('server/data/factoriesFull.json'),
    readJson('server/data/industrialParksFull.json'),
    readJson('server/data/associations.json'),
    import('../../src/data/productServicesData.js'),
    import('../../src/data/programsData.js'),
    import('../../src/data/cataloguesData.js'),
    import('../../src/data/requirementsData.js')
  ]);

  return {
    suppliers,
    factories,
    industrialParks,
    associations,
    productsServices: productModule.SEEDED_PRODUCT_SERVICES || [],
    programs: programModule.PROGRAMS_DATA || [],
    catalogues: catalogueModule.SEED_MASTER_CATALOGUES || [],
    publicRequirements: requirementModule.getPublicRequirements?.() || []
  };
}
