import { createAssistantProvider, getAssistantConfiguration } from './provider.js';
import { createDifyTurnRunner } from './difyOrchestrator.js';

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().trim();
const COMPLEX = /\b(?:rfq|rfp|bom|cad|iso|astm|jis|din|iec)\b|phan tich|so sanh|doi chieu|dung sai|ban ve|thong so ky thuat|danh gia nang luc|yeu cau bao gia|(?:soan|lap|viet|tao).{0,35}(?:rfq|ho so ky thuat)/;
const FOLLOW_UP = /^(?:viet lai|soan lai|sua lai|rut gon|ngan hon|chi tiet hon|dieu chinh|bo sung|them\b|tiep tuc|lam ro)/;

// Local classification costs no model call. It never grants tool permissions.
export function selectModelTier(query, conversation = {}) {
  const text = normalize(query);
  if (COMPLEX.test(text)) return { tier: 'complex', reason: 'technical_comparison_or_rfq' };
  if (text.length > 1200) return { tier: 'complex', reason: 'long_request' };
  if (FOLLOW_UP.test(text)) {
    const previous = [...(conversation.messages || [])].reverse().find(message => message.role === 'user');
    if (COMPLEX.test(normalize(previous?.content))) return { tier: 'complex', reason: 'complex_follow_up' };
  }
  return { tier: 'simple', reason: 'greeting_basic_question_or_search' };
}

export function createModelRoutedTurn({ env = process.env, fetchImpl = fetch, executeTool } = {}) {
  const config = getAssistantConfiguration(env);
  const makeRunner = model => {
    const provider = createAssistantProvider({ env, fetchImpl, model });
    return createDifyTurnRunner({ dify: provider.client, executeTool, engine: provider.provider, model: provider.model, skipReplyWhenNoTool: provider.provider === 'gemini' });
  };
  const simple = makeRunner(config.model);
  const complex = config.provider === 'gemini' && config.routing.mode === 'auto' ? makeRunner(config.routing.complex_model) : simple;
  return async context => {
    const selection = config.provider === 'gemini' && config.routing.mode === 'auto'
      ? selectModelTier(context.query, context.conversation) : { tier: 'simple', reason: 'single_model_configuration' };
    // Lock both planning and evidence-grounded reply to one model for this turn.
    // Errors propagate: no retries or hidden paid-provider/model failover.
    const result = await (selection.tier === 'complex' ? complex : simple)(context);
    return { ...result, modelRouting: { ...selection, configured_model: selection.tier === 'complex' ? config.routing.complex_model : config.model } };
  };
}
