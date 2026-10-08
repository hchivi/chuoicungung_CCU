import { getSupabase } from '../supabase.js';
import { createSupabaseConversationStore, createSupabaseDraftStore } from '../storage/assistantStores.js';
import { createSupabaseRepository } from '../storage/supabaseRepository.js';
import { createSearchEngine } from '../suppi/searchEngine.js';
import { createToolExecutor } from '../suppi/toolRegistry.js';
import { createDifyTurnRunner } from './difyOrchestrator.js';
import { createAssistantService } from './service.js';
import { createAssistantProvider } from './provider.js';

export function createAssistantRuntime({ env = process.env, fetchImpl = fetch, client = getSupabase(), repository = createSupabaseRepository({ client }) } = {}) {
  const conversationStore = createSupabaseConversationStore({ client });
  const draftStore = createSupabaseDraftStore({ client });
  const executeTool = async (name, args) => {
    // Draft ownership is supplied by the server, never the model or browser.
    if (name === 'create_requirement_draft') {
      const conversation = await conversationStore.get(args.conversation_id);
      if (!conversation?.owner_id) throw new Error('Draft requires an owned conversation');
      return draftStore.create({ ...args, owner_id: conversation.owner_id });
    }
    const sources = ['suppliers', 'factories', 'industrialParks', 'associations', 'productsServices', 'programs', 'catalogues', 'publicRequirements'];
    const data = Object.fromEntries(await Promise.all(sources.map(async key => [key, await repository.all(key)])));
    return createToolExecutor({ searchEngine: createSearchEngine(data), draftStore })(name, args);
  };
  const provider = createAssistantProvider({ env, fetchImpl });
  return createAssistantService({ conversationStore, difyTurn: createDifyTurnRunner({
    dify: provider.client, executeTool, engine: provider.provider, model: provider.model,
    skipReplyWhenNoTool: provider.provider === 'gemini'
  }) });
}
