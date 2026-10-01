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
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected', 'closed'], default: 'pending' },
  responsesCount: { type: Number, default: 0 },
}, { timestamps: true });

demandSchema.index({ status: 1, category: 1, location: 1, deadline: 1 });

export default mongoose.models.Demand || mongoose.model('Demand', demandSchema);
