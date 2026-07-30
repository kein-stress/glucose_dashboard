import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_FLAGS, detectLocale, translate } from './translations.js';

const LOCALE_STORAGE_KEY = 'locale';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(
    () => localStorage.getItem(LOCALE_STORAGE_KEY) || detectLocale()
  );

  function setLocale(next) {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      supportedLocales: SUPPORTED_LOCALES,
      localeLabels: LOCALE_LABELS,
      localeFlags: LOCALE_FLAGS,
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
