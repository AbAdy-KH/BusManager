import { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContextInstance';
import ar from '../locales/ar';
import en from '../locales/en';

const translations = { ar, en };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('busmanager_lang') || 'ar');

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem('busmanager_lang', nextLang);
  };

  const t = translations[lang] || translations.ar;
  const isRtl = t.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}
