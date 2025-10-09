import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// Simple i18n hook with fallback support
export function useI18n() {
  const router = useRouter();
  const [locale, setLocale] = useState('pt');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const currentLocale = router.locale || router.defaultLocale || 'pt';
    setLocale(currentLocale);
    
    // Load translations for current locale
    fetch(`/locales/${currentLocale}/common.json`)
      .then(res => res.json())
      .then(data => setTranslations(data))
      .catch(() => setTranslations({}));
  }, [router.locale, router.defaultLocale]);

  const t = (key, fallback = '') => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  return { t, locale, setLocale };
}

