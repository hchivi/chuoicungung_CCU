import { SUPPI_TOOLS } from './toolRegistry.js';
import { SUPPI_DEVELOPER_PROMPT } from './prompt.js';
import { runFallbackTurn } from './fallbackAssistant.js';
import { runResponsesToolLoop } from './openaiResponsesClient.js';

export function createSuppiOrchestrator({ conversationStore, executeTool, openAI, model = 'gpt-5.4-mini' }) {
  return {
    createConversation: initial => conversationStore.create(initial),
    getConversation: id => conversationStore.get(id),
    async sendMessage(id, message) {
      const conversation = await conversationStore.get(id);
      if (!conversation) throw new Error('Không tìm thấy cuộc trao đổi SUPPI');
      if (!message || !message.trim()) throw new Error('Tin nhắn không được để trống');

      let answer;
      if (openAI) {
        const result = await runResponsesToolLoop({
          createResponse: openAI,
          executeTool: (name, args) => executeTool(
            name,
            name === 'create_requirement_draft' ? { ...args, conversation_id: id } : args
          ),
          instructions: `${SUPPI_DEVELOPER_PROMPT}\nConversation ID hiện tại: ${id}`,
          tools: SUPPI_TOOLS,
          model,
          input: message.trim(),
          previousResponseId: conversation.previous_response_id
        });
        const searchResult = [...result.toolResults].reverse().find(item => item.name.startsWith('search_'));
        const draftResult = [...result.toolResults].reverse().find(item => item.name === 'create_requirement_draft');
        answer = {
          message: result.text,
          results: searchResult?.result?.items || [],
          draft: draftResult?.result || null,
          slots: conversation.slots
        };
        conversation.previous_response_id = result.responseId;
      } else {
        answer = await runFallbackTurn({ message: message.trim(), conversation, executeTool });
      }

      conversation.slots = answer.slots || conversation.slots;
      conversation.messages = [...(conversation.messages || []),
        { role: 'user', content: message.trim(), created_at: new Date().toISOString() },
        { role: 'assistant', content: answer.message, created_at: new Date().toISOString() }
      ].slice(-40);
      const saved = await conversationStore.save(conversation);
      return {
        message: answer.message,
        results: answer.results || [],
        draft: answer.draft || null,
        conversation: saved,
        mode: openAI ? 'openai' : 'safe-fallback'
      };
    }
  };
}
