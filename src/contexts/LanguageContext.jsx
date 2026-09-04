import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

// Clear any residual Google Translate cookie/state if exists
function clearGoogleTranslateCookie() {
  if (typeof document === 'undefined') return;
  const domain = window.location.hostname;
  
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;

  // Remove any injected Google translate iframe banner if present
  try {
    const banner = document.querySelector('.goog-te-banner-frame');
    if (banner) banner.remove();
    document.body.style.top = '0px';
  } catch (e) {
    // ignore
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('ccu_language');
      return saved === 'en' ? 'en' : 'vi';
    } catch {
      return 'vi';
    }
  });

  useEffect(() => {
    clearGoogleTranslateCookie();
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (newLang) => {
    const valid = newLang === 'en' ? 'en' : 'vi';
    setLangState(valid);
    try {
      localStorage.setItem('ccu_language', valid);
    } catch (e) {
      console.error('Could not save language to localStorage', e);
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  // Helper to get nested translation value: t('hero.titlePart1')
  const t = (path, fallback = '') => {
    if (!path) return fallback;
    const keys = path.split('.');
    let current = translations[lang];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to Vietnamese if English missing, or return path/fallback
        let viCurrent = translations['vi'];
        for (const viKey of keys) {
          if (viCurrent && typeof viCurrent === 'object' && viKey in viCurrent) {
            viCurrent = viCurrent[viKey];
          } else {
            return fallback || path;
          }
        }
        return viCurrent || fallback || path;
      }
    }
    return current !== undefined ? current : (fallback || path);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

