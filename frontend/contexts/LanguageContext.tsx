'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, changeLanguage, detectLanguage } from '../lib/i18n';

type SupportedLanguage = 'en' | 'pt' | 'es' | 'zh';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('pt');

  useEffect(() => {
    // Initialize with detected language
    const detectedLang = detectLanguage() as SupportedLanguage;
    console.log('LanguageContext: Detected language:', detectedLang);
    setCurrentLanguage(detectedLang);
    
    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('LanguageContext: Language change event received:', event.detail.language);
      setCurrentLanguage(event.detail.language as SupportedLanguage);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    console.log('LanguageContext: Changing language to:', lang);
    changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  // Debug: Log current state
  useEffect(() => {
    console.log('LanguageContext: Current language:', currentLanguage);
    console.log('LanguageContext: Supported languages:', supportedLanguages);
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage: handleLanguageChange,
      supportedLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 