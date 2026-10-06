// Local alternatives. Approved A shares its component with the homepage.
import React, { useState } from 'react';
import { ArrowUpRight, Check, Search, CalendarCheck, ImageOff } from 'lucide-react';
import './AssistantHomepageOptions.css';
import { resolveAssistantOption } from './assistantHomepageOptionsUi';
import AssistantDuoStage from './AssistantDuoStage';
export { ASSISTANT_OPTIONS, resolveAssistantOption } from './assistantHomepageOptionsUi';
const assistants = {
  suppi: { name: 'SUPPI', title: 'Tìm nguồn đúng nhu cầu', description: 'Làm rõ yêu cầu, đối chiếu thông tin và chuẩn bị câu hỏi cho nhà cung cấp.', keywords: ['Quy cách', 'Năng lực', 'RFQ / RFI'], action: 'Hỏi SUPPI', Icon: Search },
  chainy: { name: 'CHAINY', title: 'Rõ việc tiếp theo', description: 'Chuẩn bị nội dung kết nối, lịch gặp, gửi mẫu và những mốc cần theo dõi.', keywords: ['Lịch gặp', 'Mẫu thử', 'Báo giá'], action: 'Hỏi CHAINY', Icon: CalendarCheck },
};

function Action({ assistant, secondary = false }) {
  return <a className={'ai-option-action' + (secondary ? ' ai-option-action--secondary' : '')} data-assistant-link={assistant} href={'/tro-ly-ai?assistant=' + assistant} target="_blank" rel="noopener">{assistants[assistant].action}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}

// Same sprite files AND laptop poses as DualMascotInteractive's initial rendering.
// No re-generation, recoloring or substitute standing characters.
function Mascot({ assistant }) {
  const [state, setState] = useState('loading');
  return <span className={'ai-option-mascot ai-option-mascot--' + assistant} data-mascot={assistant} data-media-state={state} aria-busy={state === 'loading'}>
    {state === 'error' ? <span className="ai-option-image-error" role="status"><ImageOff aria-hidden="true" size={24} />{assistants[assistant].name}</span> : <img src={'/mascots/' + assistant + '-directions.webp?v=8'} width="1080" height="1080" decoding="async" alt={'Mascot ' + assistants[assistant].name + ' cầm laptop hiện có của CCU'} onLoad={() => setState('success')} onError={() => setState('error')} />}
  </span>;
}
function Journey() {
  return <AssistantDuoStage titleId="ai-option-title" />;
}
function Desk() {
  const [selected, setSelected] = useState('suppi');
  const data = assistants[selected];
  return <div className="ai-visual-selector" data-composition="visual-selector" data-selected-assistant={selected}>
    <header className="ai-option-heading"><h2 id="ai-option-title">CHỌN VIỆC. <span>CHỌN TRỢ LÝ.</span></h2><p>Chạm vào SUPPI hoặc CHAINY để chọn cách bắt đầu.</p></header>
    <div className="ai-option-task-switch" role="group" aria-label="Chọn công việc cần hỗ trợ">{Object.entries(assistants).map(([id, assistant]) => <button type="button" key={id} data-assistant-task={id} aria-label={'Chọn '+assistant.name+(id === 'suppi' ? ' tìm nguồn' : ' theo việc')} aria-pressed={selected === id} aria-controls="ai-option-task-panel" onClick={() => setSelected(id)}><span className="ai-selector-name">{assistant.name}</span><Mascot assistant={id} /><span className="ai-selector-intent"><assistant.Icon size={20} aria-hidden="true" />{id === 'suppi' ? 'Tìm nguồn' : 'Theo việc'}{selected === id && <Check size={20} aria-hidden="true" />}</span></button>)}</div>
    <div className="ai-selector-answer">
      <div id="ai-option-task-panel" className="ai-option-task-panel" aria-live="polite" aria-atomic="true"><p className="ai-option-name">{data.name}</p><h3>{data.title}</h3><p>{data.description}</p></div>
      <div className="ai-option-desk-actions"><Action assistant={selected} /><Action assistant={selected === 'suppi' ? 'chainy' : 'suppi'} secondary /></div>
    </div>
  </div>;
}
function Editorial() {
  return <div className="ai-brand-poster" data-composition="brand-poster">
    <header className="ai-option-heading"><h2 id="ai-option-title">BỘ ĐÔI <span>ĐỒNG HÀNH.</span></h2><p>Hai vai trò riêng. Cùng hỗ trợ công việc của doanh nghiệp.</p></header>
    {Object.entries(assistants).map(([id,data])=><article key={id} className={'ai-poster-role ai-poster-role--'+id}>
      <div className="ai-poster-copy"><h3>{data.name}</h3><p>{id==='suppi'?'TÌM NGUỒN ĐÚNG NHU CẦU':'RÕ VIỆC TIẾP THEO'}</p><Action assistant={id} secondary={id==='chainy'} /></div><Mascot assistant={id} />
    </article>)}
  </div>;
}
export default function AssistantHomepageOptions({ option = 'journey' }) {
  const id = resolveAssistantOption(option).id;
  return <section className={'ai-options ai-option--' + id} data-assistant-option={id} aria-labelledby="ai-option-title">{id === 'desk' ? <Desk /> : id === 'editorial' ? <Editorial /> : <Journey />}</section>;
}
