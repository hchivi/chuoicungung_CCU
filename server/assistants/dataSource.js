import { AssistantError } from './difyClient.js';

const FIELDS = ['id', 'name', 'title', 'slug', 'canonical_slug', 'industry', 'category', 'description', 'shortDescription', 'products', 'province', 'location', 'address', 'serviceAreas', 'certifications', 'status', 'visibility', 'publish_status', 'publishStatus', 'publishable', 'updatedAt', 'kcnId', 'kcnName', 'primaryIndustries', 'totalArea', 'occupancyRate'];
const KEYS = ['suppliers', 'factories', 'industrialParks', 'associations', 'productsServices', 'programs', 'catalogues', 'publicRequirements'];

// Only explicitly published records. Legacy verification defaults are not evidence.
export async function loadPublicAssistantData({ connected, models }) {
  if (!connected) throw new AssistantError('DATABASE_UNAVAILABLE', 'Chưa kết nối được database CCU; chưa thể tìm nguồn. Vui lòng thử lại.', 503);
  const projection = Object.fromEntries(FIELDS.map(key => [key, 1]));
  const filter = { $and: [
    { $or: [{ status: 'PUBLISHED' }, { publish_status: 'PUBLISHED' }, { publishStatus: 'PUBLISHED' }] },
    { visibility: { $nin: ['PRIVATE', 'INTERNAL', 'CHỈ NCC PHÙ HỢP'] } },
    { status: { $nin: ['DRAFT', 'ARCHIVED', 'draft', 'pending', 'rejected', 'closed'] } },
    { publishable: { $ne: false } }
  ] };
  return Object.fromEntries(await Promise.all(KEYS.map(async key => {
    if (!models[key]) return [key, []];
    const records = await models[key].find(filter, projection).limit(50000).lean();
    return [key, records.map(record => ({ ...Object.fromEntries(FIELDS.filter(field => record[field] !== undefined).map(field => [field, record[field]])), slug: record.canonical_slug || record.slug, verified: false, isVerified: false }))];
  })));
}
