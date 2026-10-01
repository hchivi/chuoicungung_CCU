import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  entity_type: { type: String, required: true, index: true },
  entity_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  searchable_text: { type: String, required: true },
  category_ids: { type: [String], default: [] },
  province: { type: String, default: null },
  location: { type: String, default: null },
  visibility: { type: String, enum: ['PUBLIC'], default: 'PUBLIC', index: true },
  publish_status: { type: String, enum: ['PUBLISHED'], default: 'PUBLISHED', index: true },
  verification_status: { type: String, enum: ['VERIFIED', 'UNVERIFIED'], default: 'UNVERIFIED' },
  url: { type: String, required: true },
  source_updated_at: { type: String, default: null },
  content_hash: { type: String, required: true },
  embedding: { type: [Number], default: [] }
}, { timestamps: true, strict: true });

schema.index({ entity_type: 1, entity_id: 1 }, { unique: true });

export default mongoose.models.SearchDocument || mongoose.model('SearchDocument', schema);
