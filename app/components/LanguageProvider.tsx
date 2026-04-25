'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Lang, type TranslationKey } from '../../lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Persist language choice and update document direction/font
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('app-lang', l);
  }, []);

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as Lang | null;
    if (saved && saved in translations) setLangState(saved);
  }, []);

  // Sync <html dir> and <html lang> whenever language changes
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    // Swap body font for Arabic
    document.body.style.fontFamily =
      lang === 'ar' ? "'Cairo', sans-serif" : "'Outfit', sans-serif";
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] as string,
    [lang]
  );

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
