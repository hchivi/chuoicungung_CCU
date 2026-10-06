const RESPONSES_URL = 'https://api.openai.com/v1/responses';

export function createOpenAIResponseRequester({ 
  apiKey, 
  fetchImpl = fetch,
  timeoutMs = 30000,
  maxRetries = 2
}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  return async payload => {
    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(RESPONSES_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${apiKey}` 
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Safe body parsing - avoid JSON.parse crash on empty body or HTML error pages
        const rawText = await response.text();
        let body = null;
        if (rawText && rawText.trim().length > 0) {
          try {
            body = JSON.parse(rawText);
          } catch {
            body = { error: { message: `Phản hồi từ OpenAI không phải JSON hợp lệ: ${rawText.substring(0, 100)}` } };
          }
        } else {
          body = { error: { message: 'Phản hồi từ OpenAI rỗng' } };
        }

        // Retry on 429 (Rate Limit) or 5xx (Server Errors)
        if (!response.ok) {
          const isRetryable = response.status === 429 || (response.status >= 500 && response.status < 600);
          if (isRetryable && attempt < maxRetries) {
            attempt += 1;
            const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
          throw new Error(body?.error?.message || `OpenAI Responses API failed (${response.status})`);
        }

        return body;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;
        if (attempt < maxRetries && (err.name === 'AbortError' || err.message?.includes('fetch failed'))) {
          attempt += 1;
          const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw lastError;
      }
    }

    throw lastError || new Error('OpenAI request failed after retries');
  };
}

export async function runResponsesToolLoop({
  createResponse, 
  executeTool, 
  instructions, 
  tools, 
  model, 
  input,
  previousResponseId = null, 
  maxIterations = 6
}) {
  const targetModel = model || process.env.OPENAI_RESPONSES_MODEL || process.env.OPENAI_MODEL || 'gpt-4o';
  let nextInput = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
  let previousId = previousResponseId;
  const toolResults = [];

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const request = {
      model: targetModel,
      instructions,
      tools,
      input: nextInput,
      store: true,
      parallel_tool_calls: true
    };
    if (previousId) request.previous_response_id = previousId;

    const response = await createResponse(request);
    const calls = (response?.output || []).filter(item => item?.type === 'function_call');
    
    if (calls.length === 0) {
      const text = response?.output_text || (response?.output || [])
        .filter(item => item.type === 'message')
        .flatMap(item => item.content || [])
        .filter(item => item.type === 'output_text')
        .map(item => item.text || '').join('\n');
      if (!text.trim()) throw new Error('SUPPI chưa nhận được nội dung trả lời từ model.');
      return { 
        text,
        responseId: response?.id || null, 
        usage: response?.usage || null, 
        toolResults 
      };
    }

    const outputs = await Promise.all(calls.map(async call => {
      let args;
      try { 
        args = JSON.parse(call.arguments || '{}'); 
      } catch { 
        throw new Error(`Invalid arguments for tool ${call.name}`); 
      }
      const result = await executeTool(call.name, args);
      toolResults.push({ name: call.name, result });
      return { 
        type: 'function_call_output', 
        call_id: call.call_id, 
        output: JSON.stringify(result) 
      };
    }));

    previousId = response?.id || null;
    nextInput = outputs;
  }

  throw new Error('SUPPI exceeded the maximum tool iterations');
}
