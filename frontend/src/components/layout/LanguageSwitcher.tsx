import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
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
  const { currentLanguage, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

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
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 border border-gray-600/50 hover:border-cyan-500/50 rounded-xl px-4 py-2 transition-all duration-300 group hover:scale-105 transform"
      >
        <GlobeAltIcon className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
        <span className="text-2xl">{currentLang.flag}</span>
        <span className="text-gray-300 font-medium text-sm hidden sm:block">
          {currentLang.name}
        </span>
        <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:scale-105 transform ${
                  currentLanguage === language.code
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-cyan-300'
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {language.flag}
                </span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{language.name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300">
                    {language.nativeName}
                  </span>
                </div>
                {currentLanguage === language.code && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
