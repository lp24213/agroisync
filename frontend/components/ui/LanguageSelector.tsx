'use client';

import { useState } from 'react';
import { 
  supportedLanguages, 
  changeLanguage 
} from '../../lib/i18n';

export type SupportedLanguage = 'en' | 'pt' | 'zh';

export interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'flags';
}

const getLanguageName = (code: SupportedLanguage): string => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang ? lang.name : code;
};

const getLanguageFlag = (code: SupportedLanguage): string => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang ? lang.flag : '🌐';
};

export function LanguageSelector({ 
  currentLanguage, 
  className = '',
  variant = 'dropdown' 
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: SupportedLanguage) => {
    if (language !== currentLanguage) {
      changeLanguage(language);
    }
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {Object.entries(supportedLanguages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              code === currentLanguage
                ? 'bg-[#00FF00] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {getLanguageFlag(code as SupportedLanguage)} {getLanguageName(code as SupportedLanguage)}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'flags') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {Object.entries(supportedLanguages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            className={`p-2 rounded-lg text-lg transition-colors ${
              code === currentLanguage
                ? 'bg-[#00FF00] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            title={getLanguageName(code as SupportedLanguage)}
          >
            {getLanguageFlag(code as SupportedLanguage)}
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg">{getLanguageFlag(currentLanguage)}</span>
        <span className="text-sm font-medium">{getLanguageName(currentLanguage)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          {Object.entries(supportedLanguages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as SupportedLanguage)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                code === currentLanguage ? 'bg-[#00FF00]/10 dark:bg-[#00FF00]/20' : ''
              }`}
            >
              <span className="text-lg">{getLanguageFlag(code as SupportedLanguage)}</span>
              <span className="text-sm font-medium">{getLanguageName(code as SupportedLanguage)}</span>
              {code === currentLanguage && (
                <svg className="w-4 h-4 ml-auto text-[#00FF00]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 