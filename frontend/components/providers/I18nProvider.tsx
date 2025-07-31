'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    // Detectar idioma do navegador ou localStorage
    const savedLanguage = localStorage.getItem('i18nextLng');
    const browserLanguage = navigator.language.split('-')[0];

    if (savedLanguage && ['en', 'pt', 'zh'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    } else if (['en', 'pt', 'zh'].includes(browserLanguage)) {
      i18n.changeLanguage(browserLanguage);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
