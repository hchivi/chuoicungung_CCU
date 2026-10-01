import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bot, ExternalLink, Loader2, MapPin, Search, Send, ShieldCheck, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Tìm nhà cung ứng', 'Tìm sản phẩm/dịch vụ', 'Tìm nhà máy',
  'Tìm KCN', 'Tìm Hội/Hiệp hội', 'Tìm chương trình'
];

export default function SuppiSearchPage() {
  const [params] = useSearchParams();
  const initialQuery = params.get('q')?.trim() || '';
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const sentInitial = useRef(false);
  const endRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function startConversation() {
      try {
        const response = await fetch('/api/suppi/conversations', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Không thể bắt đầu cuộc trao đổi');
        if (!cancelled) setConversationId(body.data.id);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    startConversation();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (conversationId && initialQuery && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialQuery);
    }
  }, [conversationId, initialQuery]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendMessage(text = input) {
    const message = text.trim();
    if (!message || !conversationId || isLoading) return;
    setMessages(current => [...current, { role: 'user', text: message }]);
    setInput('');
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`/api/suppi/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'SUPPI chưa thể xử lý yêu cầu');
      setMessages(current => [...current, {
        role: 'assistant',
        text: body.data.message,
        results: body.data.results || [],
        draft: body.data.draft || null,
        mode: body.data.mode
      }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" /> Trang chủ
          </Link>
          <div className="flex items-center gap-2">
            <img src="/mascots/SUPPI_2.png" alt="SUPPI" className="h-10 w-10 object-contain" />
            <div>
              <div className="font-heading text-sm font-black text-blue-950">SUPPI AI SEARCH</div>
              <div className="text-[11px] text-slate-500">Tìm nguồn từ dữ liệu CHUOICUNGUNG.COM</div>
            </div>
          </div>
          <div className="hidden text-xs text-emerald-700 sm:flex sm:items-center sm:gap-1">
            <ShieldCheck className="h-4 w-4" /> Không ưu tiên tài trợ
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-4xl flex-col px-4 py-6 sm:px-6">
        <section className="flex-1 space-y-5 pb-36">
          {messages.length === 0 && !initialQuery && (
            <div className="mx-auto max-w-2xl py-12 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Sparkles className="h-8 w-8" />
              </div>
              <h1 className="font-heading text-2xl font-black text-blue-950 sm:text-3xl">Anh/chị đang cần gì cho doanh nghiệp?</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Mô tả tự nhiên nhu cầu. SUPPI sẽ tự hiểu danh mục, địa bàn, số lượng và thời hạn.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(label => (
                  <button key={label} type="button" onClick={() => setInput(label + ' ')} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={message.role === 'user' ? 'ml-auto max-w-2xl' : 'mr-auto max-w-3xl'}>
              <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${message.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {message.role === 'user' ? <span className="text-xs font-bold">Bạn</span> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === 'user' ? 'bg-blue-700 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
                  {message.text}
                </div>
              </div>

              {message.results?.length > 0 && (
                <div className="mt-3 grid gap-3 pl-12 sm:grid-cols-2">
                  {message.results.map(result => (
                    <div key={`${result.entity_type}-${result.entity_id}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{result.entity_type.replaceAll('_', ' ')}</div>
                          <h2 className="mt-1 text-sm font-bold text-slate-900">{result.name}</h2>
                        </div>
                        {result.verification_status === 'VERIFIED' && <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
                      </div>
                      {result.location && <div className="mb-2 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{result.location}</div>}
                      <ul className="space-y-1 text-xs leading-5 text-slate-600">
                        {(result.match_signals || []).slice(0, 2).map((signal, signalIndex) => <li key={signalIndex}>• {signal.value}</li>)}
                      </ul>
                      <Link to={result.url} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">
                        Xem hồ sơ <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {message.draft && (
                <div className="ml-12 mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-heading font-black">BẢN NHÁP NHU CẦU</div>
                    <span className="rounded-full bg-amber-200 px-2 py-1 text-[10px] font-black">{message.draft.status}</span>
                  </div>
                  <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div><dt className="font-bold">Sản phẩm/dịch vụ</dt><dd>{message.draft.product_service}</dd></div>
                    <div><dt className="font-bold">Danh mục</dt><dd>{message.draft.category}</dd></div>
                    <div><dt className="font-bold">Số lượng</dt><dd>{message.draft.quantity ? `${message.draft.quantity} ${message.draft.unit || ''}` : 'Chưa xác định'}</dd></div>
                    <div><dt className="font-bold">Hạn giao</dt><dd>{message.draft.deadline || 'Chưa xác định'}</dd></div>
                  </dl>
                  <p className="mt-3 border-t border-amber-200 pt-3 text-[11px] leading-5">Bản nháp chưa được submit hoặc publish. Anh/chị có thể tiếp tục nhắn để bổ sung thông tin.</p>
                </div>
              )}
            </article>
          ))}

          {isLoading && conversationId && (
            <div className="flex items-center gap-3 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /> SUPPI đang tìm trong dữ liệu CCU…</div>
          )}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div ref={endRef} />
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-xl shadow-slate-900/10 focus-within:border-blue-500">
            <Search className="mb-3 ml-2 h-5 w-5 shrink-0 text-slate-400" />
            <textarea
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); }
              }}
              rows={1}
              placeholder="Anh/chị đang cần gì cho doanh nghiệp?"
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-1 py-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button type="submit" disabled={!input.trim() || !conversationId || isLoading} className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <p className="mx-auto mt-2 max-w-4xl text-center text-[10px] text-slate-400">SUPPI chỉ dùng dữ liệu có trong hệ thống. Hãy kiểm tra thông tin trước khi giao dịch.</p>
        </div>
      </div>
    </main>
  );
}
