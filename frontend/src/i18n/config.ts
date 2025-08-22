export const i18nConfig = {
  defaultLocale: 'pt',
  locales: ['pt', 'en', 'es', 'zh'],
  localeNames: {
    pt: 'Português',
    en: 'English',
    es: 'Español',
    zh: '中文'
  },
  localeFlags: {
    pt: '🇧🇷',
    en: '🇺🇸',
    es: '🇪🇸',
    zh: '🇨🇳'
  }
}

export const namespaces = [
  'common',
  'nav',
  'home',
  'store',
  'crypto',
  'grains',
  'agroconecta',
  'analytics',
  'auth',
  'settings',
  'admin',
  'chatbot',
  'footer'
]

export const defaultNS = 'common'

export function getOptions(lng = i18nConfig.defaultLocale, ns = defaultNS) {
  return {
    supportedLngs: i18nConfig.locales,
    fallbackLng: i18nConfig.defaultLocale,
    debug: process.env.NODE_ENV === 'development',
    defaultNS,
    ns,
    lng,
    fallbackNS: defaultNS,
    interpolation: {
      escapeValue: false
    }
  }
}
