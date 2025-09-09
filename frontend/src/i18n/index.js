import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import zhTranslations from './locales/zh.json';

const resources = {
  pt: {
    translation: ptTranslations
  },
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  zh: {
    translation: zhTranslations
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'agrosync-language'
    },

    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'currency') {
          return new Intl.NumberFormat(lng === 'pt' ? 'pt-BR' : 
                                      lng === 'es' ? 'es-ES' :
                                      lng === 'zh' ? 'zh-CN' : 'en-US', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng === 'pt' ? 'pt-BR' : 
                                        lng === 'es' ? 'es-ES' :
                                        lng === 'zh' ? 'zh-CN' : 'en-US').format(new Date(value));
        }
        return value;
      }
    },

    backend: {
      loadPath: '/locales/{{lng}}.json'
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
