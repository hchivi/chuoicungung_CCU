import { createGeminiClient, DEFAULT_GEMINI_MODEL } from './geminiClient.js';
import { createDifyClient, AssistantError } from './difyClient.js';

// No browser-prefixed keys, implicit external failover, or assumed Dify model.
export function getAssistantConfiguration(env = process.env) {
  const provider = env.ASSISTANT_PROVIDER || (env.GEMINI_API_KEY ? 'gemini' : 'dify');
  if (!['gemini', 'dify'].includes(provider)) throw new AssistantError('AI_PROVIDER_INVALID', 'ASSISTANT_PROVIDER phải là gemini hoặc dify.', 503);
  const key = provider === 'gemini' ? env.GEMINI_API_KEY : env.DIFY_API_KEY;
  const model = provider === 'gemini' ? env.GEMINI_SIMPLE_MODEL || env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL : env.DIFY_MODEL || null;
  const routingMode = provider === 'gemini' ? env.GEMINI_ROUTING || 'auto' : 'single';
  if (!['auto', 'single'].includes(routingMode)) throw new AssistantError('AI_ROUTING_INVALID', 'GEMINI_ROUTING phải là auto hoặc single.', 503);
  return { provider, configured: Boolean(key && !/your_|xxxxxxxx/.test(key)),
    model,
    routing: { mode: routingMode, simple_model: model, complex_model: provider === 'gemini' ? env.GEMINI_COMPLEX_MODEL || 'gemini-3.8-flash' : model, automatic_fallback: false },
    model_verified: false };
}

export function createAssistantProvider({ env = process.env, fetchImpl = fetch, model } = {}) {
  const config = getAssistantConfiguration(env);
  const selectedModel = model || config.model;
  const client = config.provider === 'gemini'
    ? createGeminiClient({ apiKey: env.GEMINI_API_KEY, model: selectedModel, fetchImpl })
    : createDifyClient({ apiKey: env.DIFY_API_KEY, baseUrl: env.DIFY_API_URL || 'https://api.dify.ai/v1', fetchImpl });
  return { ...config, model: selectedModel, client };
}
