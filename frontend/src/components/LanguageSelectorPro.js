import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Sem ícones extras no botão para ficar igual ao layout

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSelectorPro({ className = '' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('agroisync-language', code);
    document.documentElement.lang = code;
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ 
          display: 'flex',
          visibility: 'visible',
          opacity: 1,
          zIndex: 1002
        }}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="font-medium text-gray-900">{currentLang.code.toUpperCase()}</span>
      </button>

      {open && (
        <div 
          className="absolute right-0 mt-2 w-36 rounded-md bg-white border border-gray-200 shadow-xl overflow-hidden"
          style={{ 
            zIndex: 100000,
            position: 'absolute',
            display: 'block',
            visibility: 'visible',
            opacity: 1
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors duration-200 ${
                i18n.language === lang.code ? 'bg-green-50 text-green-700' : ''
              }`}
            >
              <span className="text-base" aria-hidden>{lang.flag}</span>
              <span className="font-medium text-gray-900">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


