const nullableString = description => ({ type: ['string', 'null'], description });
const nullableNumber = description => ({ type: ['number', 'null'], description });
const nullableStrings = description => ({ type: ['array', 'null'], items: { type: 'string' }, description });

const location = {
  type: ['object', 'null'],
  properties: {
    province: nullableString('Tỉnh hoặc thành phố.'),
    district: nullableString('Quận, huyện hoặc thành phố trực thuộc tỉnh.'),
    industrial_park_id: nullableString('ID hoặc tên khu công nghiệp.')
  },
  required: ['province', 'district', 'industrial_park_id'],
  additionalProperties: false
};

const quantity = {
  type: ['object', 'null'],
  properties: {
    value: nullableNumber('Số lượng cần mua hoặc sản xuất.'),
    unit: nullableString('Đơn vị của số lượng.')
  },
  required: ['value', 'unit'],
  additionalProperties: false
};

function functionTool(name, description, properties) {
  return {
    type: 'function', name, description, strict: true,
    parameters: {
      type: 'object', properties,
      required: Object.keys(properties), additionalProperties: false
    }
  };
}

const paging = {
  limit: { type: 'number', description: 'Số kết quả, từ 1 đến 20.' },
  cursor: nullableString('Cursor trang tiếp theo, hoặc null.')
};

export const SUPPI_TOOLS = [
  functionTool('search_suppliers', 'Tìm nhà cung ứng thực có trong CCU theo nhu cầu sourcing.', {
    query: { type: 'string' }, category_ids: nullableStrings('Danh mục chuẩn.'), location,
    quantity, deadline: nullableString('Hạn giao ISO-8601.'), specifications: nullableStrings('Thông số kỹ thuật.'),
    certifications: nullableStrings('Chứng nhận cần có.'), ...paging
  }),
  functionTool('search_products_services', 'Tìm sản phẩm và dịch vụ công khai trong CCU.', {
    query: { type: 'string' }, category_ids: nullableStrings('Danh mục chuẩn.'), supplier_id: nullableString('Giới hạn theo nhà cung ứng.'),
    location, quantity, specifications: nullableStrings('Thông số kỹ thuật.'), ...paging
  }),
  functionTool('search_factories', 'Tìm nhà máy thực có trong CCU.', {
    query: { type: 'string' }, industries: nullableStrings('Ngành hoạt động.'), location,
    industrial_park_id: nullableString('Khu công nghiệp.'), capabilities: nullableStrings('Năng lực cần tìm.'), ...paging
  }),
  functionTool('search_industrial_parks', 'Tìm khu công nghiệp thực có trong CCU.', {
    query: { type: 'string' }, location, target_industries: nullableStrings('Ngành mục tiêu.'),
    minimum_area_ha: nullableNumber('Diện tích tối thiểu.'), maximum_occupancy_percent: nullableNumber('Tỷ lệ lấp đầy tối đa.'), ...paging
  }),
  functionTool('search_associations', 'Tìm hội và hiệp hội công khai trong CCU.', {
    query: { type: 'string' }, industries: nullableStrings('Ngành liên quan.'), location,
    association_type: nullableString('Loại hội hoặc hiệp hội.'), ...paging
  }),
  functionTool('search_programs', 'Tìm chương trình và sự kiện công khai trong CCU.', {
    query: { type: 'string' }, industries: nullableStrings('Ngành liên quan.'), location,
    date_from: nullableString('Ngày bắt đầu ISO-8601.'), date_to: nullableString('Ngày kết thúc ISO-8601.'),
    status: nullableStrings('Trạng thái chương trình.'), participant_role: nullableString('Vai trò người tham dự.'), ...paging
  }),
  functionTool('search_catalogues', 'Tìm catalogue công khai trong CCU.', {
    query: { type: 'string' }, industries: nullableStrings('Ngành liên quan.'),
    organization_id: nullableString('Tổ chức phát hành.'), publish_status: nullableString('Chỉ dùng trạng thái công khai.'), ...paging
  }),
  functionTool('search_public_requirements', 'Tìm nhu cầu công khai thực có trong CCU.', {
    query: { type: 'string' }, categories: nullableStrings('Danh mục nhu cầu.'), location,
    deadline_from: nullableString('Hạn từ ngày ISO-8601.'), deadline_to: nullableString('Hạn đến ngày ISO-8601.'), ...paging
  }),
  functionTool('get_supplier_profile', 'Lấy hồ sơ công khai của một nhà cung ứng theo ID.', { supplier_id: { type: 'string' } }),
  functionTool('get_factory_profile', 'Lấy hồ sơ công khai của một nhà máy theo ID.', { factory_id: { type: 'string' } }),
  functionTool('get_industrial_park', 'Lấy hồ sơ công khai của một khu công nghiệp theo ID.', { industrial_park_id: { type: 'string' } }),
  functionTool('get_association', 'Lấy hồ sơ công khai của một hội hoặc hiệp hội theo ID.', { association_id: { type: 'string' } }),
  functionTool('create_requirement_draft', 'Tạo bản nháp nhu cầu. Không submit, publish hoặc gửi cho nhà cung ứng.', {
    conversation_id: { type: 'string' }, category: { type: 'string' }, product_service: { type: 'string' },
    quantity: nullableNumber('Số lượng.'), unit: nullableString('Đơn vị.'), delivery_location: location,
    deadline: nullableString('Hạn giao ISO-8601.'), specifications: { type: 'array', items: { type: 'string' } },
    certifications: { type: 'array', items: { type: 'string' } }, sample_required: { type: ['boolean', 'null'] },
    notes: nullableString('Ghi chú công khai trong draft.')
  })
];

function validateSchema(schema, path) {
  if (!schema || typeof schema !== 'object') throw new Error(`Invalid schema at ${path}`);
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.includes('object')) {
    if (schema.additionalProperties !== false) throw new Error(`${path} must set additionalProperties=false`);
    const keys = Object.keys(schema.properties || {});
    if (keys.some(key => !(schema.required || []).includes(key))) throw new Error(`${path} must require every property`);
    for (const [key, child] of Object.entries(schema.properties || {})) validateSchema(child, `${path}.${key}`);
  }
  if (types.includes('array') && schema.items) validateSchema(schema.items, `${path}[]`);
}

export function validateStrictToolSchemas(tools) {
  for (const tool of tools) {
    if (tool.type !== 'function' || tool.strict !== true) throw new Error(`${tool.name} must be a strict function`);
    validateSchema(tool.parameters, tool.name);
  }
  return true;
}

function publicProfile(item) {
  if (!item) return { found: false };
  const allowed = [
    'id', 'slug', 'name', 'title', 'industry', 'category', 'categoryName', 'description',
    'shortDescription', 'products', 'productGroups', 'province', 'region', 'location', 'address',
    'serviceAreas', 'industrialParkCoverage', 'certifications', 'verified', 'isVerified',
    'status', 'website', 'images', 'logo', 'primaryIndustries', 'totalArea', 'occupancyRate'
  ];
  return { found: true, data: Object.fromEntries(allowed.filter(key => item[key] !== undefined).map(key => [key, item[key]])) };
}

export function createToolExecutor({ searchEngine, draftStore, hybridSearch = null }) {
  const hybridOrLocal = async (entityType, args, localSearch) => {
    const hybrid = hybridSearch ? await hybridSearch.search(entityType, args) : null;
    return hybrid || localSearch(args);
  };
  const handlers = {
    search_suppliers: args => hybridOrLocal('supplier', args, searchEngine.searchSuppliers),
    search_products_services: args => hybridOrLocal('product_service', args, searchEngine.searchProductsServices),
    search_factories: args => hybridOrLocal('factory', args, searchEngine.searchFactories),
    search_industrial_parks: args => hybridOrLocal('industrial_park', args, searchEngine.searchIndustrialParks),
    search_associations: args => hybridOrLocal('association', args, searchEngine.searchAssociations),
    search_programs: args => hybridOrLocal('program', args, searchEngine.searchPrograms),
    search_catalogues: args => hybridOrLocal('catalogue', args, searchEngine.searchCatalogues),
    search_public_requirements: args => hybridOrLocal('public_requirement', args, searchEngine.searchPublicRequirements),
    get_supplier_profile: args => publicProfile(searchEngine.getSupplierProfile(args.supplier_id)),
    get_factory_profile: args => publicProfile(searchEngine.getFactoryProfile(args.factory_id)),
    get_industrial_park: args => publicProfile(searchEngine.getIndustrialPark(args.industrial_park_id)),
    get_association: args => publicProfile(searchEngine.getAssociation(args.association_id)),
    create_requirement_draft: args => draftStore.create(args)
  };
  return async (name, args) => {
    const handler = handlers[name];
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    return handler(args);
  };
}
