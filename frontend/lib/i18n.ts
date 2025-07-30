import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import zh from '../locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;

export type Locale = 'en' | 'pt' | 'zh';

export const locales: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  zh: '中文',
};

export const useLanguage = () => {
  const changeLanguage = (lng: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
    i18n.changeLanguage(lng);
  };

  return { changeLanguage };
}; 