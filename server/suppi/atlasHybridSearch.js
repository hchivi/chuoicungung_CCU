const EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings';
const COMMERCIAL_FIELDS = new Set(['isSponsored', 'sponsor', 'sponsorship', 'featured', 'paidTier']);

function stripCommercialFields(item) {
  return Object.fromEntries(Object.entries(item).filter(([key]) => !COMMERCIAL_FIELDS.has(key)));
}

export function fuseRankedResults(lexical = [], vector = [], limit = 10) {
  const rankConstant = 60;
  const fused = new Map();
  const add = (items, source) => items.forEach((raw, index) => {
    const item = stripCommercialFields(raw);
    const id = String(item.entity_id);
    const current = fused.get(id) || { ...item, hybrid_score: 0, matched_by: [] };
    current.hybrid_score += 1 / (rankConstant + index + 1);
    if (!current.matched_by.includes(source)) current.matched_by.push(source);
    fused.set(id, current);
  });
  add(lexical, 'full_text');
  add(vector, 'vector');
  return [...fused.values()]
    .sort((a, b) => b.hybrid_score - a.hybrid_score || String(a.entity_id).localeCompare(String(b.entity_id)))
    .slice(0, limit);
}

export function createEmbeddingRequester({ apiKey, model = 'text-embedding-3-small', fetchImpl = fetch }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is required for embeddings');
  return async input => {
    const response = await fetchImpl(EMBEDDINGS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, input })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body?.error?.message || `Embedding request failed (${response.status})`);
    return body.data.map(item => item.embedding);
  };
}

export function createAtlasHybridSearch({ model, embed, textIndex, vectorIndex }) {
  return {
    async search(entityType, args) {
      if (!model?.db || model.db.readyState !== 1 || !args.query?.trim()) return null;
      try {
        const [queryVector] = await embed(args.query.trim());
        const filter = { entity_type: entityType, visibility: 'PUBLIC', publish_status: 'PUBLISHED' };
        if (args.location?.province) filter.province = args.location.province;
        const limit = Math.min(Math.max(Number(args.limit) || 5, 1), 20);

        const lexicalPipeline = [
          { $search: { index: textIndex, text: { query: args.query, path: ['title', 'searchable_text'], fuzzy: { maxEdits: 1 } } } },
          { $match: filter },
          { $limit: Math.max(limit * 4, 20) },
          { $project: { _id: 0, entity_id: 1, entity_type: 1, title: 1, url: 1, province: 1, location: 1, verification_status: 1, source_updated_at: 1 } }
        ];
        const vectorPipeline = [
          { $vectorSearch: { index: vectorIndex, path: 'embedding', queryVector, numCandidates: Math.max(limit * 20, 100), limit: Math.max(limit * 4, 20), filter } },
          { $project: { _id: 0, entity_id: 1, entity_type: 1, title: 1, url: 1, province: 1, location: 1, verification_status: 1, source_updated_at: 1 } }
        ];
        const [lexicalResult, vectorResult] = await Promise.allSettled([
          model.aggregate(lexicalPipeline), model.aggregate(vectorPipeline)
        ]);
        const lexical = lexicalResult.status === 'fulfilled' ? lexicalResult.value : [];
        const vector = vectorResult.status === 'fulfilled' ? vectorResult.value : [];
        if (lexical.length === 0 && vector.length === 0) return null;
        const items = fuseRankedResults(lexical, vector, limit).map(item => ({
          entity_type: item.entity_type,
          entity_id: item.entity_id,
          name: item.title,
          url: item.url,
          location: item.province || item.location || null,
          verification_status: item.verification_status || 'UNVERIFIED',
          source_updated_at: item.source_updated_at || null,
          match_signals: [{
            criterion: 'hybrid_relevance',
            value: `Khớp ${item.matched_by.join(' + ')}`,
            source_field: 'search_index'
          }]
        }));
        return { items, total: items.length, applied_filters: filter, search_mode: 'hybrid', next_cursor: null };
      } catch {
        return null;
      }
    }
  };
}
