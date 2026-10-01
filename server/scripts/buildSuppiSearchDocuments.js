import crypto from 'node:crypto';
import dotenv from 'dotenv';

import { connectDB } from '../db.js';
import SearchDocument from '../models/SearchDocument.js';
import { loadSuppiData } from '../suppi/dataSource.js';
import { createEmbeddingRequester } from '../suppi/atlasHybridSearch.js';

dotenv.config();

const ENTITY_CONFIG = {
  suppliers: { type: 'supplier', url: '/nha-cung-ung' },
  productsServices: { type: 'product_service', url: '/san-pham-dich-vu' },
  factories: { type: 'factory', url: '/nha-may' },
  industrialParks: { type: 'industrial_park', url: '/khu-cong-nghiep' },
  associations: { type: 'association', url: '/hiep-hoi' },
  programs: { type: 'program', url: '/chuong-trinh' },
  catalogues: { type: 'catalogue', url: '/catalogue' },
  publicRequirements: { type: 'public_requirement', url: '/san-nhu-cau' }
};

function text(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value);
}

function toDocument(item, config) {
  const entityId = String(item.id || item._id || item.slug);
  const title = item.name || item.title || entityId;
  const searchableText = [
    title, item.industry, item.category, item.categoryName, item.description,
    item.shortDescription, item.products, item.productGroups, item.primaryIndustries,
    item.location, item.province, item.region, item.address, item.kcnName, item.topic
  ].map(text).filter(Boolean).join('\n').slice(0, 12000);
  return {
    entity_type: config.type,
    entity_id: entityId,
    title,
    searchable_text: searchableText,
    category_ids: [item.categoryId, item.category, item.categoryName, item.industry].filter(Boolean).map(String),
    province: item.province || item.provinceName || null,
    location: item.location || item.address || item.kcnName || null,
    visibility: 'PUBLIC',
    publish_status: 'PUBLISHED',
    verification_status: item.verified === true || item.isVerified === true ? 'VERIFIED' : 'UNVERIFIED',
    url: `${config.url}/${item.slug || entityId}`,
    source_updated_at: item.updatedAt || item.updated_at || null,
    content_hash: crypto.createHash('sha256').update(searchableText).digest('hex')
  };
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is required to build embeddings');
  const connected = await connectDB();
  if (!connected) throw new Error('MongoDB connection is required');

  const data = await loadSuppiData();
  const documents = Object.entries(ENTITY_CONFIG).flatMap(([key, config]) => data[key].map(item => toDocument(item, config)));
  const embed = createEmbeddingRequester({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
  });

  const batchSize = Math.min(Math.max(Number(process.env.SUPPI_EMBEDDING_BATCH_SIZE) || 64, 1), 128);
  for (let start = 0; start < documents.length; start += batchSize) {
    const batch = documents.slice(start, start + batchSize);
    const existing = await SearchDocument.find({
      $or: batch.map(doc => ({ entity_type: doc.entity_type, entity_id: doc.entity_id, content_hash: doc.content_hash }))
    }).select('entity_type entity_id content_hash').lean();
    const existingKeys = new Set(existing.map(doc => `${doc.entity_type}:${doc.entity_id}:${doc.content_hash}`));
    const changed = batch.filter(doc => !existingKeys.has(`${doc.entity_type}:${doc.entity_id}:${doc.content_hash}`));
    if (changed.length > 0) {
      const embeddings = await embed(changed.map(doc => doc.searchable_text));
      await SearchDocument.bulkWrite(changed.map((doc, index) => ({
        updateOne: {
          filter: { entity_type: doc.entity_type, entity_id: doc.entity_id },
          update: { $set: { ...doc, embedding: embeddings[index] } },
          upsert: true
        }
      })));
    }
    console.log(`SUPPI index: ${Math.min(start + batch.length, documents.length)}/${documents.length}`);
  }
  console.log(`SUPPI search documents ready: ${documents.length}`);
  process.exit(0);
}

main().catch(error => {
  console.error(`SUPPI index failed: ${error.message}`);
  process.exit(1);
});
