import mongoose from 'mongoose';
import Enterprise from '../models/Enterprise.js';
import Factory from '../models/Factory.js';
import IndustrialPark from '../models/IndustrialPark.js';
import Organization from '../models/Organization.js';
import SuppiConversation from '../models/SuppiConversation.js';
import RequirementDraft from '../models/RequirementDraft.js';
import { createConversationStore } from '../suppi/conversationStore.js';
import { createDraftStore } from '../suppi/draftStore.js';
import { createSearchEngine } from '../suppi/searchEngine.js';
import { createToolExecutor } from '../suppi/toolRegistry.js';
import { createDifyTurnRunner } from './difyOrchestrator.js';
import { loadPublicAssistantData } from './dataSource.js';
import { createAssistantService } from './service.js';
import { createDifyClient, AssistantError } from './difyClient.js';

export function createAssistantRuntime() {
  const conversationStore = createConversationStore({ model: SuppiConversation });
  const draftStore = createDraftStore({ model: RequirementDraft });
  const executeTool = async (name, args) => {
    // Draft ownership is supplied by the server, never the model or browser.
    if (name === 'create_requirement_draft') {
      if (mongoose.connection.readyState !== 1) throw new AssistantError('DATABASE_UNAVAILABLE', 'Chưa lưu bản nháp vì database CCU chưa kết nối. Nội dung trao đổi vẫn được giữ trong phiên hiện tại.', 503);
      const conversation = await conversationStore.get(args.conversation_id);
      if (!conversation?.owner_id) throw new Error('Draft requires an owned conversation');
      return draftStore.create({ ...args, owner_id: conversation.owner_id });
    }
    if (['search_products_services', 'search_programs', 'search_catalogues', 'search_public_requirements'].includes(name)) {
      throw new AssistantError('SOURCE_NOT_CONNECTED', 'Nguồn dữ liệu này chưa được kết nối với trợ lý; chưa thể xác nhận kết quả.', 503);
    }
    const data = await loadPublicAssistantData({ connected: mongoose.connection.readyState === 1, models: {
      suppliers: Enterprise, factories: Factory, industrialParks: IndustrialPark,
      associations: { find: (filter, projection) => Organization.find({ ...filter, roles: 'ASSOCIATION' }, projection) }
    } });
    return createToolExecutor({ searchEngine: createSearchEngine(data), draftStore })(name, args);
  };
  const dify = createDifyClient({ apiKey: process.env.DIFY_API_KEY, baseUrl: process.env.DIFY_API_URL || 'https://api.dify.ai/v1' });
  return createAssistantService({ conversationStore, difyTurn: createDifyTurnRunner({ dify, executeTool }) });
}
