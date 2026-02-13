import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', native: 'Português' },
  { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'es', label: 'Español', flag: '🇪🇸', native: 'Español' },
  { code: 'zh', label: '中文', flag: '🇨🇳', native: '中文' }
];

export default function LanguageSelectorPro({ className = '' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = code => {
    localStorage.setItem('i18nextLng', code);
    i18n.changeLanguage(code);
    setOpen(false);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botão Principal - Moderno e Bonito */}
      <button
        onClick={() => setOpen(!open)}
        className='group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95'
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
        aria-haspopup='menu'
        aria-expanded={open}
        aria-label='Selecionar idioma'
      >
        {/* Efeito de brilho */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        
        <Globe className='h-4 w-4 relative z-10 drop-shadow-sm' />
        <span className='text-xl relative z-10 drop-shadow-sm'>{currentLang.flag}</span>
        <span className='font-bold relative z-10 drop-shadow-sm tracking-wide'>{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`h-4 w-4 relative z-10 drop-shadow-sm transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown - Animado e Elegante */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl backdrop-blur-sm'
            style={{ zIndex: 100000 }}
          >
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => changeLanguage(lang.code)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  i18n.language === lang.code
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 font-bold'
                    : 'text-gray-950 hover:bg-gray-100 font-semibold'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <span className='text-2xl' aria-hidden='true'>
                    {lang.flag}
                  </span>
                  <div className='flex flex-col items-start'>
                    <span className='font-bold text-gray-950'>{lang.native}</span>
                    <span className='text-xs text-gray-700 font-medium'>{lang.label}</span>
                  </div>
                </div>
                {i18n.language === lang.code && (
                  <Check className='h-4 w-4 text-green-600' />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
