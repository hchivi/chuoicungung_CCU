import mongoose from 'mongoose';

const factorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  no: { type: Number },
  name: { type: String, required: true },
  kcnId: { type: String, required: true },
  kcnName: { type: String, required: true },
  province: { type: String },
  region: { type: String },
  address: { type: String },
  foundedYear: { type: String },
  type: { type: String },
  industry: { type: String },
  taxCode: { type: String },
  status: { type: String, default: 'Đang hoạt động' },
  isVerified: { type: Boolean, default: true },
  rating: { type: String, default: '4.8' },
}, { timestamps: true, strict: false });

export default mongoose.models.Factory || mongoose.model('Factory', factorySchema);
