import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import zh from '../locales/zh.json';

const resources = {
  en: {
    translation: en
  },
  pt: {
    translation: pt
  },
  zh: {
    translation: zh
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// Supported languages
export const supportedLanguages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
  },
  pt: {
    name: 'Português',
    flag: '🇧🇷',
    dir: 'ltr',
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
  },
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// Default language
export const defaultLanguage: SupportedLanguage = 'en';

// Language detection
export function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  // Check localStorage
  const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
  if (savedLanguage && supportedLanguages[savedLanguage]) {
    return savedLanguage;
  }

  // Check browser language
  const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;
  if (supportedLanguages[browserLanguage]) {
    return browserLanguage;
  }

  return defaultLanguage;
}

// Language utilities
export function setLanguage(language: SupportedLanguage) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
    window.location.reload();
  }
}

export function getLanguageName(language: SupportedLanguage): string {
  return supportedLanguages[language]?.name || language;
}

export function getLanguageFlag(language: SupportedLanguage): string {
  return supportedLanguages[language]?.flag || '🌐';
}

// Format utilities
export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  const locales = {
    en: 'en-US',
    pt: 'pt-BR',
    zh: 'zh-CN',
  };

  return new Intl.NumberFormat(locales[language], options).format(value);
}

export function formatCurrency(
  value: number,
  language: SupportedLanguage,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  const locales = {
    en: 'en-US',
    pt: 'pt-BR',
    zh: 'zh-CN',
  };

  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}

export function formatDate(
  date: Date | string | number,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions
): string {
  const locales = {
    en: 'en-US',
    pt: 'pt-BR',
    zh: 'zh-CN',
  };

  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  return new Intl.DateTimeFormat(locales[language], options).format(dateObj);
}

export function formatRelativeTime(
  date: Date | string | number,
  language: SupportedLanguage,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const locales = {
    en: 'en-US',
    pt: 'pt-BR',
    zh: 'zh-CN',
  };

  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const formatter = new Intl.RelativeTimeFormat(locales[language], options);

  if (Math.abs(diffInSeconds) < 60) {
    return formatter.format(diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return formatter.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return formatter.format(diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return formatter.format(diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return formatter.format(diffInYears, 'year');
}

// Validation utilities
export function isValidLanguage(language: string): language is SupportedLanguage {
  return language in supportedLanguages;
}

// SEO utilities
export function getAlternateLanguages(currentLanguage: SupportedLanguage) {
  return Object.keys(supportedLanguages)
    .filter(lang => lang !== currentLanguage)
    .map(lang => ({
      language: lang as SupportedLanguage,
      href: `/${lang}`,
    }));
} 