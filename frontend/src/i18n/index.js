import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traduções
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
