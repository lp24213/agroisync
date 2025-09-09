import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import i18n from '../i18n';
import useStore from '../store/useStore';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage } = useStore();

  const supportedLanguages = useMemo(() => [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ], []);

  const changeLanguage = useCallback(async (langCode) => {
    if (!supportedLanguages.find(lang => lang.code === langCode)) {
      console.error(`Unsupported language: ${langCode}`);
      return;
    }

    try {
      setIsLoading(true);
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
      setLanguage(langCode);
      
      // Salvar preferência no localStorage
      localStorage.setItem('agroisync-language', langCode);
      
      // Atualizar atributo lang do HTML
      document.documentElement.lang = langCode;
      
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setLanguage, supportedLanguages]);

  useEffect(() => {
    // Sincronizar com o store
    if (language && language !== currentLanguage) {
      changeLanguage(language);
    }
  }, [language, currentLanguage, changeLanguage]);

  const t = (key, options = {}) => {
    return i18n.t(key, options);
  };

  const formatDate = (date, options = {}) => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : 
                   currentLanguage === 'es' ? 'es-ES' :
                   currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  };

  const formatCurrency = (amount, currency = 'BRL') => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : 
                   currentLanguage === 'es' ? 'es-ES' :
                   currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (number, options = {}) => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : 
                   currentLanguage === 'es' ? 'es-ES' :
                   currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
    
    return new Intl.NumberFormat(locale, options).format(number);
  };

  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage);
  };

  const value = {
    currentLanguage,
    supportedLanguages,
    isLoading,
    changeLanguage,
    t,
    formatDate,
    formatCurrency,
    formatNumber,
    getCurrentLanguageInfo
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
