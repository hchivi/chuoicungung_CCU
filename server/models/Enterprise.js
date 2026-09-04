import mongoose from 'mongoose';

const enterpriseSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  taxCode: { type: String },
  representative: { type: String },
  role: { type: String, default: 'Nhà cung ứng' },
  industry: { type: String },
  stages: [{ type: Number }],
  phases: [{ type: String }],
  products: [{ type: String }],
  location: { type: String },
  province: { type: String },
  verified: { type: Boolean, default: true },
  avatar: { type: String },
  employees: { type: String },
  establishedYear: { type: Number },
  website: { type: String },
  email: { type: String },
  phone: { type: String },
  description: { type: String },
  certifications: [{ type: String }],
  capacityRating: { type: Number, default: 5 },
}, { timestamps: true, strict: false });

export default mongoose.models.Enterprise || mongoose.model('Enterprise', enterpriseSchema);
