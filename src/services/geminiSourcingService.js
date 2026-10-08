import { sendDifyMessage } from './difyService.js';

// Compatibility only: provider keys, business instructions, context and tool
// execution now belong exclusively to the authenticated/session-owned backend.
export async function askGeminiSourcingAgent({ query, mode = 'SUPPI' }) {
  const result = await sendDifyMessage({ query, mode });
  return result?.answer || null;
}
