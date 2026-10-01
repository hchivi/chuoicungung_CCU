const DEFAULT_LIMIT = 5;

export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function flattenText(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(flattenText).join(' ');
  if (typeof value === 'object') return Object.values(value).map(flattenText).join(' ');
  return String(value);
}

function searchableText(item) {
  return normalizeText([
    item.name, item.title, item.industry, item.category, item.categoryName,
    item.description, item.shortDescription, item.products, item.productGroups,
    item.primaryIndustries, item.location, item.province, item.region,
    item.address, item.kcnName, item.tagline, item.topic
  ].map(flattenText).join(' '));
}

function locationText(item) {
  return normalizeText([
    item.province, item.location, item.address, item.region, item.kcnName,
    item.serviceAreas, item.industrialParkCoverage
  ].map(flattenText).join(' '));
}

function matchesLocation(item, location) {
  if (!location) return true;
  const values = [location.province, location.district, location.industrial_park_id]
    .filter(Boolean)
    .map(normalizeText);
  if (values.length === 0) return true;
  const haystack = locationText(item);
  return values.some(value => haystack.includes(value));
}

function lexicalScore(item, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 1;
  const haystack = searchableText(item);
  const tokens = normalizedQuery.split(' ').filter(token => token.length > 1);
  if (tokens.length === 0) return haystack.includes(normalizedQuery) ? 1 : 0;
  const matched = tokens.filter(token => haystack.includes(token)).length;
  const phraseBonus = haystack.includes(normalizedQuery) ? 2 : 0;
  return matched / tokens.length + phraseBonus;
}

function publicItem(item) {
  return item.publishable !== false &&
    item.visibility !== 'PRIVATE' &&
    item.visibility !== 'INTERNAL' &&
    item.publishStatus !== 'UNPUBLISHED' &&
    item.status !== 'ARCHIVED';
}

function matchesStructuredFilters(item, args) {
  if (args.supplier_id) {
    const supplierId = String(item.supplierId || item.supplier_id || item.organizationId || '');
    if (supplierId !== String(args.supplier_id)) return false;
  }
  if (args.industrial_park_id) {
    const park = normalizeText(item.kcnId || item.industrialParkId || item.kcnName || item.location || '');
    if (!park.includes(normalizeText(args.industrial_park_id))) return false;
  }
  const quantityValue = Number(args.quantity?.value);
  if (Number.isFinite(quantityValue) && quantityValue > 0) {
    const minimum = Number(item.minOrder ?? item.moq);
    const maximum = Number(item.maxOrder ?? item.capacityMax);
    if (Number.isFinite(minimum) && quantityValue < minimum) return false;
    if (Number.isFinite(maximum) && quantityValue > maximum) return false;
  }
  if (args.certifications?.length) {
    const certificates = normalizeText(flattenText(item.certifications || item.evidence || ''));
    if (!args.certifications.every(cert => certificates.includes(normalizeText(cert)))) return false;
  }
  if (args.specifications?.length) {
    const details = searchableText(item);
    if (!args.specifications.every(spec => details.includes(normalizeText(spec)))) return false;
  }
  if (args.status?.length && item.status && !args.status.includes(item.status)) return false;
  if (args.publish_status && item.publishStatus && item.publishStatus !== args.publish_status) return false;
  return true;
}

function createMatchSignals(item, args, score) {
  const signals = [];
  if (args.query && score > 0) {
    signals.push({ criterion: 'relevance', value: 'Nội dung hồ sơ khớp nhu cầu tìm kiếm', source_field: 'searchable_text' });
  }
  if (args.location && matchesLocation(item, args.location)) {
    signals.push({ criterion: 'location', value: item.province || item.location || item.address || 'Có phục vụ địa bàn yêu cầu', source_field: 'location' });
  }
  if (item.verified === true || item.isVerified === true || item.verificationStatus === 'VERIFIED') {
    signals.push({ criterion: 'verification', value: 'Hồ sơ có trạng thái xác minh trong hệ thống', source_field: 'verification_status' });
  }
  return signals;
}

function entityUrl(entityType, item) {
  const id = item.slug || item.id || item._id;
  const prefixes = {
    supplier: '/nha-cung-ung', product_service: '/san-pham-dich-vu', factory: '/nha-may',
    industrial_park: '/khu-cong-nghiep', association: '/hiep-hoi',
    program: '/chuong-trinh', catalogue: '/catalogue', public_requirement: '/san-nhu-cau'
  };
  return `${prefixes[entityType] || ''}/${id}`;
}

function searchCollection(items, args, entityType) {
  const limit = Math.min(Math.max(Number(args.limit) || DEFAULT_LIMIT, 1), 20);
  const offset = Math.max(Number(args.cursor) || 0, 0);
  const categoryTerms = (args.category_ids || args.industries || args.categories || []).map(normalizeText);

  const ranked = items
    .filter(publicItem)
    .filter(item => matchesLocation(item, args.location))
    .filter(item => matchesStructuredFilters(item, args))
    .map((item, index) => ({ item, index, score: lexicalScore(item, args.query) }))
    .filter(({ item, score }) => {
      if (args.query && score === 0) return false;
      if (categoryTerms.length === 0) return true;
      const text = searchableText(item);
      return categoryTerms.some(term => text.includes(term));
    })
    // Stable organic ranking. Commercial/sponsorship fields are deliberately absent.
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const page = ranked.slice(offset, offset + limit);
  return {
    items: page.map(({ item, score }) => ({
      entity_type: entityType,
      entity_id: String(item.id || item._id || item.slug),
      name: item.name || item.title,
      url: entityUrl(entityType, item),
      match_signals: createMatchSignals(item, args, score),
      verification_status: item.verified === true || item.isVerified === true ? 'VERIFIED' : 'UNVERIFIED',
      source_updated_at: item.updatedAt || item.updated_at || null,
      summary: item.shortDescription || item.description || item.industry || item.category || null,
      location: item.province || item.location || item.address || null
    })),
    total: ranked.length,
    applied_filters: {
      query: args.query || '',
      location: args.location || null,
      categories: args.category_ids || args.industries || args.categories || null
    },
    search_mode: 'hybrid-ready',
    next_cursor: offset + limit < ranked.length ? String(offset + limit) : null
  };
}

export function createSearchEngine(data = {}) {
  const collections = {
    suppliers: data.suppliers || [], productsServices: data.productsServices || [],
    factories: data.factories || [], industrialParks: data.industrialParks || [],
    associations: data.associations || [], programs: data.programs || [],
    catalogues: data.catalogues || [], publicRequirements: data.publicRequirements || []
  };

  const findProfile = (list, id) => list.find(item => String(item.id || item._id || item.slug) === String(id)) || null;
  return {
    searchSuppliers: args => searchCollection(collections.suppliers, args, 'supplier'),
    searchProductsServices: args => searchCollection(collections.productsServices, args, 'product_service'),
    searchFactories: args => searchCollection(collections.factories, args, 'factory'),
    searchIndustrialParks: args => searchCollection(collections.industrialParks, args, 'industrial_park'),
    searchAssociations: args => searchCollection(collections.associations, args, 'association'),
    searchPrograms: args => searchCollection(collections.programs, args, 'program'),
    searchCatalogues: args => searchCollection(collections.catalogues, args, 'catalogue'),
    searchPublicRequirements: args => searchCollection(collections.publicRequirements, args, 'public_requirement'),
    getSupplierProfile: id => findProfile(collections.suppliers, id),
    getFactoryProfile: id => findProfile(collections.factories, id),
    getIndustrialPark: id => findProfile(collections.industrialParks, id),
    getAssociation: id => findProfile(collections.associations, id)
  };
}
