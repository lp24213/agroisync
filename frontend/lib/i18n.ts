import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';

const resources = {
  en: {
    translation: en
  },
  pt: {
    translation: pt
  },
  es: {
    translation: es
  },
  zh: {
    translation: zh
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // default language - Portuguese Brazil
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português Brasil' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' }
];

// Language detection
export const detectLanguage = () => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    const supported = supportedLanguages.find(lang => lang.code === browserLang);
    return supported ? browserLang : 'pt';
  }
  return 'pt';
};

// Change language
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang);
  }
};

// Get navigation links for language switcher
export const getLanguageLinks = (currentPath: string) => {
  return supportedLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    flag: lang.flag,
    nativeName: lang.nativeName,
    href: `/${lang}`,
  }));
}; 