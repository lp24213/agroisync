import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, GlobeAltIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useI18n } from '@/i18n/I18nProvider';

const languages = [
  {
    code: 'pt',
    name: 'Português',
    flag: '🇧🇷',
    nativeName: 'Português'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    nativeName: 'Español'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    nativeName: '中文'
  }
];

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setLocale(languageCode as 'pt' | 'en' | 'es' | 'zh');
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cosmic-button flex items-center space-x-2 bg-gradient-to-r from-purple-600/90 to-cyan-600/90 hover:from-purple-500/90 hover:to-cyan-500/90 border border-purple-400/50 hover:border-purple-300/50 rounded-lg px-3 py-2 transition-all duration-300 group hover:scale-105 transform shadow-lg hover:shadow-purple-500/25"
      >
        <GlobeAltIcon className="h-4 w-4 text-white group-hover:text-cyan-200 transition-colors duration-300" />
        <span className="text-lg group-hover:scale-110 transition-transform duration-300">{currentLang.flag}</span>
        <span className="text-white font-semibold text-xs hidden sm:block group-hover:text-cyan-100 transition-colors duration-300">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDownIcon className={`h-3 w-3 text-white transition-transform duration-300 group-hover:text-cyan-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 cosmic-card border border-purple-500/30 shadow-2xl shadow-purple-500/25 overflow-hidden z-50 animate-fade-in">
          <div className="p-1">
            <div className="mb-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-1">
                <SparklesIcon className="h-3 w-3 text-purple-400" />
                <span className="text-xs font-medium text-purple-silver">🌍</span>
              </div>
            </div>
            
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-300 group hover:scale-105 transform ${
                  locale === language.code
                    ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-400/50 text-purple-200 shadow-lg shadow-purple-500/25'
                    : 'text-purple-silver hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 hover:text-cyan-200 hover:border hover:border-purple-500/30'
                }`}
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-300">
                  {language.flag}
                </span>
                <span className="font-semibold text-xs ml-1">
                  {language.code.toUpperCase()}
                </span>
                {locale === language.code && (
                  <div className="ml-auto">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-600"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-lg transform -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
