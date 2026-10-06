// Development-only HTML entry. Not imported by App/HomePage.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, AlertCircle } from 'lucide-react';
import AssistantHomepageOptions, { ASSISTANT_OPTIONS, resolveAssistantOption } from './AssistantHomepageOptions';
import '../../index.css';

function Preview() {
  const [option, setOption] = useState(() => resolveAssistantOption(new URLSearchParams(window.location.search).get('option')).id);
  const selected = resolveAssistantOption(option);
  function choose(id) {
    setOption(id);
    const url = new URL(window.location.href); url.searchParams.set('option', id);
    window.history.replaceState(null, '', url);
  }
  return <main className="ai-design-review">
    <header className="ai-review-header"><a href="/" target="_blank" rel="noopener">CCU / Trang chủ ↗</a><h1>Chọn thiết kế SUPPI &amp; CHAINY</h1><p>Bản xem thử riêng. Trang chủ và hai mascot gốc chưa thay đổi.</p>
      <div className="ai-review-options" role="group" aria-label="Chọn phương án thiết kế">{ASSISTANT_OPTIONS.map(item => <button type="button" key={item.id} data-design-option={item.id} aria-pressed={option === item.id} aria-controls="ai-design-result" onClick={() => choose(item.id)}>{item.label}</button>)}</div>
      <p className="ai-review-description" aria-live="polite">{selected.description}</p>
    </header>
    <div id="ai-design-result"><AssistantHomepageOptions key={option} option={option} /></div>
    <details className="ai-review-states"><summary>Kiểm tra trạng thái nút</summary><p>Mẫu giao diện, không gửi yêu cầu hoặc gọi AI.</p><div>{['default','hover','focus','active','disabled','loading','error','success'].map(state => <label key={state}><span>{state}</span><button type="button" className={'ai-option-action is-' + state} disabled={['disabled','loading'].includes(state)} aria-busy={state === 'loading'} aria-invalid={state === 'error'} data-state={state}>{state === 'error' ? <><AlertCircle size={18} />Thử lại</> : state === 'success' ? <><Check size={18} />Đã sẵn sàng</> : state === 'loading' ? 'Đang chuẩn bị…' : 'Hỏi SUPPI'}</button></label>)}</div></details>
  </main>;
}
createRoot(document.getElementById('root')).render(<Preview />);
