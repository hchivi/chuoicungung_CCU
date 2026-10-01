import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  conversation_id: { type: String, required: true, index: true },
  owner_id: { type: String, default: null, index: true },
  idempotency_key: { type: String, default: null, index: { sparse: true } },
  category: { type: String, required: true },
  product_service: { type: String, required: true },
  quantity: { type: Number, default: null },
  unit: { type: String, default: null },
  delivery_location: { type: mongoose.Schema.Types.Mixed, default: null },
  deadline: { type: String, default: null },
  specifications: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  sample_required: { type: Boolean, default: null },
  notes: { type: String, default: null },
  status: { type: String, enum: ['DRAFT'], default: 'DRAFT', immutable: true },
  submitted_at: { type: String, default: null, immutable: true },
  published_at: { type: String, default: null, immutable: true },
  created_at: String,
  updated_at: String
}, { timestamps: true, strict: true });

schema.index({ conversation_id: 1, idempotency_key: 1 });
schema.index({ owner_id: 1, conversation_id: 1, status: 1 });

export default mongoose.models.RequirementDraft || mongoose.model('RequirementDraft', schema);
