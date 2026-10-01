import test from 'node:test';
import assert from 'node:assert/strict';

import { loadSuppiData } from '../suppi/dataSource.js';

test('SUPPI data source covers every searchable CCU entity type', async () => {
  const data = await loadSuppiData();
  assert.ok(data.suppliers.length > 20000);
  assert.ok(data.factories.length > 14000);
  assert.ok(data.industrialParks.length >= 480);
  assert.ok(data.associations.length >= 70);
  assert.ok(data.productsServices.length > 0);
  assert.ok(data.programs.length > 0);
  assert.ok(data.catalogues.length > 0);
  assert.ok(data.publicRequirements.length > 0);
});
