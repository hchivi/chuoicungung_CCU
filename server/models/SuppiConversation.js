import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  created_at: { type: String, required: true }
}, { _id: false });

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  previous_response_id: { type: String, default: null },
  owner_id: { type: String, default: null },
  assistant_mode: { type: String, enum: ['SUPPI', 'CHAINY'], default: 'SUPPI' },
  dify_conversation_id: { type: String, default: null },
  latest_results: { type: [mongoose.Schema.Types.Mixed], default: [] },
  slots: { type: mongoose.Schema.Types.Mixed, default: {} },
  messages: { type: [messageSchema], default: [] },
  status: { type: String, enum: ['ACTIVE', 'CLOSED'], default: 'ACTIVE' },
  created_at: String,
  updated_at: String
}, { timestamps: true, strict: true });

export default mongoose.models.SuppiConversation || mongoose.model('SuppiConversation', schema);
