import test from 'node:test';
import assert from 'node:assert/strict';

import { createSearchEngine } from '../suppi/searchEngine.js';

const suppliers = [
  {
    id: 'organic-far',
    name: 'May Mặc Miền Bắc',
    industry: 'May mặc và đồng phục',
    products: ['Áo polo'],
    province: 'Hà Nội',
    serviceAreas: ['Hà Nội'],
    verified: true,
    isSponsored: false
  },
  {
    id: 'sponsored-near',
    name: 'Đồng Phục Long Thành',
    industry: 'May mặc và đồng phục',
    products: ['Áo polo doanh nghiệp'],
    province: 'Đồng Nai',
    serviceAreas: ['Long Thành', 'Đồng Nai'],
    verified: true,
    isSponsored: true
  },
  {
    id: 'organic-near',
    name: 'Xưởng Polo Đồng Nai',
    industry: 'Đồng phục công nghiệp',
    products: ['Áo polo'],
    province: 'Đồng Nai',
    serviceAreas: ['Long Thành', 'Đồng Nai'],
    verified: true,
    isSponsored: false
  }
];

test('search_suppliers uses natural-language terms and structured location filters', () => {
  const engine = createSearchEngine({ suppliers });
  const result = engine.searchSuppliers({
    query: 'may áo polo',
    category_ids: null,
    location: { province: 'Đồng Nai', district: 'Long Thành', industrial_park_id: null },
    quantity: { value: 800, unit: 'áo' },
    deadline: null,
    specifications: null,
    certifications: null,
    limit: 10,
    cursor: null
  });

  assert.equal(result.search_mode, 'hybrid-ready');
  assert.deepEqual(result.items.map(item => item.entity_id).sort(), ['organic-near', 'sponsored-near']);
  assert.ok(result.items.every(item => item.match_signals.some(signal => signal.criterion === 'location')));
});

test('sponsorship never changes organic ranking', () => {
  const engine = createSearchEngine({ suppliers });
  const args = {
    query: 'áo polo đồng phục',
    category_ids: null,
    location: null,
    quantity: null,
    deadline: null,
    specifications: null,
    certifications: null,
    limit: 10,
    cursor: null
  };

  const first = engine.searchSuppliers(args).items.map(item => item.entity_id);
  const withoutSponsorFlags = createSearchEngine({
    suppliers: suppliers.map(({ isSponsored, ...supplier }) => supplier)
  }).searchSuppliers(args).items.map(item => item.entity_id);

  assert.deepEqual(first, withoutSponsorFlags);
});

test('empty query and filters return a bounded public result set', () => {
  const engine = createSearchEngine({ suppliers });
  const result = engine.searchSuppliers({
    query: '', category_ids: null, location: null, quantity: null,
    deadline: null, specifications: null, certifications: null,
    limit: 2, cursor: null
  });
  assert.equal(result.items.length, 2);
  assert.equal(result.next_cursor, '2');
});

test('product search enforces supplier and quantity constraints when present', () => {
  const engine = createSearchEngine({
    productsServices: [
      { id: 'small', title: 'Áo polo', supplierId: 'supplier-a', minOrder: 50, maxOrder: 500 },
      { id: 'fit', title: 'Áo polo', supplierId: 'supplier-a', minOrder: 100, maxOrder: 2000 },
      { id: 'other', title: 'Áo polo', supplierId: 'supplier-b', minOrder: 100, maxOrder: 2000 }
    ]
  });
  const result = engine.searchProductsServices({
    query: 'áo polo', category_ids: null, supplier_id: 'supplier-a', location: null,
    quantity: { value: 800, unit: 'áo' }, specifications: null, limit: 10, cursor: null
  });
  assert.deepEqual(result.items.map(item => item.entity_id), ['fit']);
});
