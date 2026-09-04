import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ variant = 'topbar' }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'vi', label: 'Tiếng Việt', short: 'VIE', flag: '🇻🇳', country: 'Việt Nam' },
    { code: 'en', label: 'English', short: 'ENG', flag: '🇬🇧', country: 'United Kingdom' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  if (variant === 'topbar') {
    return (
      <div className="relative inline-block text-left font-sans" ref={dropdownRef}>
        {/* Dropdown Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer select-none ${
            isOpen
              ? 'bg-blue-600/90 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 shadow-2xs backdrop-blur-md'
          }`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          title="Chọn ngôn ngữ / Select language"
        >
          <span className="text-xs">{currentLang.flag}</span>
          <span className="tracking-wide font-extrabold">{currentLang.short}</span>
          <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
        </button>

        {/* Dropdown Menu List */}
        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
              <span>{lang === 'en' ? 'Select Language' : 'Chọn ngôn ngữ'}</span>
              <Globe className="w-3 h-3 text-blue-500" />
            </div>

            <div className="p-1 space-y-0.5">
              {languages.map((item) => {
                const isSelected = lang === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectLanguage(item.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-[#0052cc] font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{item.flag}</span>
                      <div>
                        <div className="leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.short}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0052cc] shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile / Drawer variant
  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
      >
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Ngôn ngữ / Language:</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{currentLang.flag}</span>
          <span className="text-xs font-extrabold text-blue-600">{currentLang.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="mt-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-1">
          {languages.map((item) => {
            const isSelected = lang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectLanguage(item.code)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  isSelected ? 'bg-blue-50 text-[#0052cc]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{item.flag}</span>
                  <span>{item.label} ({item.short})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0052cc]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
