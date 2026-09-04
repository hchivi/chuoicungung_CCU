import mongoose from 'mongoose';

const demandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  stageId: { type: Number, required: true },
  phaseId: { type: String, required: true },
  category: { type: String, required: true },
  authorName: { type: String, required: true },
  authorCompany: { type: String, required: true },
  authorEmail: { type: String, required: true },
  authorPhone: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: String },
  deadline: { type: String },
  requirements: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'closed'], default: 'approved' },
  responsesCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Demand || mongoose.model('Demand', demandSchema);
