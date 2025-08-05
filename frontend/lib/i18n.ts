import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && supportedLanguages.find(lang => lang.code === savedLang)) {
      return savedLang;
    }
    const browserLang = navigator.language.split('-')[0];
    const supported = supportedLanguages.find(lang => lang.code === browserLang);
    return supported ? browserLang : 'pt';
  }
  return 'pt';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to AGROTM",
          startNow: "Start Now",
          documentation: "Documentation",
          staking: "Staking Premium",
          security: "Advanced Security",
          nfts: "Agricultural NFTs",
          home: "Home",
          about: "About",
          contact: "Contact",
          dashboard: "Dashboard",
          getStarted: "Get Started"
        }
      },
      pt: {
        translation: {
          welcome: "Bem-vindo ao AGROTM",
          startNow: "Começar Agora",
          documentation: "Documentação",
          staking: "Staking Premium",
          security: "Segurança Avançada",
          nfts: "NFTs Agrícolas",
          home: "Início",
          about: "Sobre",
          contact: "Contato",
          dashboard: "Dashboard",
          getStarted: "Começar"
        }
      },
      es: {
        translation: {
          welcome: "Bienvenido a AGROTM",
          startNow: "Comenzar Ahora",
          documentation: "Documentación",
          staking: "Staking Premium",
          security: "Seguridad Avanzada",
          nfts: "NFTs Agrícolas",
          home: "Inicio",
          about: "Acerca de",
          contact: "Contacto",
          dashboard: "Dashboard",
          getStarted: "Comenzar"
        }
      },
      zh: {
        translation: {
          welcome: "欢迎来到AGROTM",
          startNow: "立即开始",
          documentation: "文档",
          staking: "高级质押",
          security: "高级安全",
          nfts: "农业NFT",
          home: "首页",
          about: "关于",
          contact: "联系",
          dashboard: "仪表板",
          getStarted: "开始使用"
        }
      }
    },
    lng: detectLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

// Change language
export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang);
    // Trigger a custom event to notify components about language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
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