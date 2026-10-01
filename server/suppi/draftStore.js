import crypto from 'node:crypto';

export function createDraftStore({ model = null } = {}) {
  const memory = new Map();
  const canUseModel = () => model && model.db?.readyState === 1;

  return {
    async create(input) {
      // 1. Idempotency Check: if idempotency_key is provided, return existing draft if found
      if (input.idempotency_key) {
        if (canUseModel()) {
          const existing = await model.findOne({ 
            conversation_id: input.conversation_id, 
            idempotency_key: input.idempotency_key 
          }).lean();
          if (existing) return existing;
        } else {
          for (const d of memory.values()) {
            if (d.conversation_id === input.conversation_id && d.idempotency_key === input.idempotency_key) {
              return d;
            }
          }
        }
      }

      const now = new Date().toISOString();
      const draft = {
        ...input,
        id: `REQ-DRAFT-${crypto.randomUUID()}`,
        owner_id: input.owner_id || null,
        idempotency_key: input.idempotency_key || null,
        status: 'DRAFT',
        submitted_at: null,
        published_at: null,
        created_at: now,
        updated_at: now
      };

      if (canUseModel()) {
        const saved = await model.create(draft);
        return saved.toObject ? saved.toObject() : saved;
      }

      memory.set(draft.id, draft);
      return draft;
    },

    async get(id, { owner_id = null } = {}) {
      if (canUseModel()) {
        const query = { id };
        if (owner_id) query.owner_id = owner_id;
        const persisted = await model.findOne(query).lean();
        if (persisted) return persisted;
      }

      const inMem = memory.get(id);
      if (inMem) {
        if (owner_id && inMem.owner_id && inMem.owner_id !== owner_id) return null;
        return inMem;
      }

      return null;
    },

    async update(id, patch, { owner_id = null } = {}) {
      const forbidden = ['status', 'submitted_at', 'published_at', 'id', 'conversation_id'];
      const safePatch = Object.fromEntries(
        Object.entries(patch).filter(([key]) => !forbidden.includes(key))
      );
      safePatch.updated_at = new Date().toISOString();

      if (canUseModel()) {
        const query = { id };
        if (owner_id) query.owner_id = owner_id;
        return model.findOneAndUpdate(query, { $set: safePatch }, { new: true }).lean();
      }

      const current = memory.get(id);
      if (!current) return null;
      if (owner_id && current.owner_id && current.owner_id !== owner_id) return null;

      const updated = { ...current, ...safePatch };
      memory.set(id, updated);
      return updated;
    }
  };
}
