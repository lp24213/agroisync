import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar arquivos de tradução
import ptCommon from '../public/locales/pt/common.json';
import enCommon from '../public/locales/en/common.json';
import esCommon from '../public/locales/es/common.json';
import zhCommon from '../public/locales/zh/common.json';

const resources = {
  pt: {
    common: ptCommon,
  },
  en: {
    common: enCommon,
  },
  es: {
    common: esCommon,
  },
  zh: {
    common: zhCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React já escapa valores
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n; 