'use client';

import React, { ReactNode, useEffect } from 'react';
import i18n from '../../lib/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize i18n on client side
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, []);

  return <>{children}</>;
};

export default I18nProvider;
