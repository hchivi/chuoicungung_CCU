import crypto from 'node:crypto';

export function createConversationStore({ model = null } = {}) {
  const memory = new Map();
  const canUseModel = () => model && model.db?.readyState === 1;

  return {
    async create(initial = {}) {
      const now = new Date().toISOString();
      const conversation = {
        id: `SUPPI-CONV-${crypto.randomUUID()}`,
        previous_response_id: null,
        slots: {},
        messages: [],
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
        ...initial
      };
      if (canUseModel()) {
        const saved = await model.create(conversation);
        return saved.toObject ? saved.toObject() : saved;
      }
      memory.set(conversation.id, conversation);
      return conversation;
    },
    async get(id) {
      if (canUseModel()) {
        const persisted = await model.findOne({ id }).lean();
        if (persisted) return persisted;
      }
      return memory.get(id) || null;
    },
    async save(conversation) {
      const updated = { ...conversation, updated_at: new Date().toISOString() };
      if (canUseModel()) return model.findOneAndUpdate({ id: updated.id }, { $set: updated }, { upsert: true, new: true }).lean();
      memory.set(updated.id, updated);
      return updated;
    }
  };
}
