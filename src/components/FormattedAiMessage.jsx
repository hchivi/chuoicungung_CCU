import React from 'react';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

/**
 * Helper render text có hỗ trợ **in đậm** và highlight từ khóa
 */
function renderInlineText(text) {
  if (!text) return null;
  // Tách theo cú pháp **in đậm**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-900 bg-blue-50/60 px-1 py-0.5 rounded text-inherit">
          {boldContent}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Component định dạng phản hồi AI của SUPPI & CHAINY
 * Chuyển đổi markdown thô thành giao diện thẻ trực quan, thoáng đãng, dễ đọc
 */
export default function FormattedAiMessage({ content, isLiveAi = false }) {
  if (!content) return null;

  // Tách nội dung theo dòng
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
              <div className="flex-1">{renderInlineText(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    // Dòng trống
    if (!line) {
      flushList();
      return;
    }

    // Đường kẻ ngang divider
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      elements.push(
        <div key={`hr-${index}`} className="my-2.5 border-t border-slate-200/80" />
      );
      return;
    }

    // Tiêu đề H2 / H3 (## hoặc ###)
    if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
      flushList();
      const headingText = line.replace(/^#+\s*/, '');
      elements.push(
        <div key={`heading-${index}`} className="mt-3 mb-1.5 flex items-center gap-1.5 text-xs sm:text-[13px] font-black text-blue-950 font-heading">
          <ChevronRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{renderInlineText(headingText)}</span>
        </div>
      );
      return;
    }

    // Bullet point (* hoặc - hoặc +)
    if (/^[-*+]\s+/.test(line)) {
      const itemText = line.replace(/^[-*+]\s+/, '');
      currentList.push(itemText);
      return;
    }

    // Numbered list (1. 2. 3.)
    if (/^\d+\.\s+/.test(line)) {
      flushList();
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`num-${index}`} className="my-1.5 flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center mt-0.5">
              {numMatch[1]}
            </span>
            <div className="flex-1">{renderInlineText(numMatch[2])}</div>
          </div>
        );
        return;
      }
    }

    // Đoạn văn thông thường
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-xs sm:text-[13px] text-slate-700 leading-relaxed my-1">
        {renderInlineText(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className="rounded-2xl bg-white border border-blue-100/80 shadow-sm p-3.5 sm:p-4 text-slate-800 space-y-1">
      {isLiveAi && (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 mb-1.5 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
          <span>Phân tích thời gian thực từ SUPPI AI Sourcing</span>
        </div>
      )}
      <div className="ai-formatted-content text-left space-y-0.5">
        {elements}
      </div>
    </div>
  );
}
