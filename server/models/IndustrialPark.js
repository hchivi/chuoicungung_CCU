import mongoose from 'mongoose';

const factorySchema = new mongoose.Schema({
  no: { type: Number },
  name: { type: String, required: true },
  foundedYear: { type: String },
  address: { type: String },
  type: { type: String }, // FDI, Tư nhân, Nhà nước...
  industry: { type: String }
}, { _id: false });

const industrialParkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  stt: { type: Number, index: true },
  name: { type: String, required: true, index: true },
  code: { type: String },
  province: { type: String, index: true },
  location: { type: String },
  region: { type: String, index: true },
  investor: { type: String },
  totalArea: { type: String },
  occupancyRate: { type: String },
  stages: [{ type: Number }],
  primaryIndustries: [{ type: String }],
  totalEnterprises: { type: Number, default: 0 },
  totalFactories: { type: Number, default: 0 },
  website: { type: String },
  hotline: { type: String },
  description: { type: String },
  image: { type: String },
  sourceUrl: { type: String },
  factories: [factorySchema]
}, { timestamps: true, strict: false });

export default mongoose.models.IndustrialPark || mongoose.model('IndustrialPark', industrialParkSchema);
