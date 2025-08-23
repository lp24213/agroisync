import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';
import StarfieldBackground from '../StarfieldBackground';

const Layout = ({ children }) => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado de estrelas (apenas no tema escuro) */}
      {isDark && <StarfieldBackground />}
      
      {/* Gradiente sutil sobre o fundo */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDark 
          ? 'bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary' 
          : 'bg-gradient-to-br from-light-bg-primary via-light-bg-secondary to-light-bg-primary'
      }`} />
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
        {/* Seletor de idiomas e tema flutuante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 right-4 z-50 flex flex-col gap-3"
        >
          {/* Botão de alternância de tema */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center justify-center w-12 h-12 backdrop-blur-md border rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              isDark
                ? 'bg-dark-glass-bg border-dark-border-primary text-dark-text-primary hover:bg-dark-bg-card-hover hover:border-dark-border-accent'
                : 'bg-light-glass-bg border-light-border-primary text-light-text-primary hover:bg-light-bg-card-hover hover:border-light-border-accent'
            }`}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>

          {/* Seletor de idiomas */}
          <div className="relative">
            <button 
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 backdrop-blur-md border rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                isDark
                  ? 'bg-dark-glass-bg border-dark-border-primary text-dark-text-primary hover:bg-dark-bg-card-hover hover:border-dark-border-accent'
                  : 'bg-light-glass-bg border-light-border-primary text-light-text-primary hover:bg-light-bg-card-hover hover:border-light-border-accent'
              }`}
            >
              <span className="text-lg">
                {languages.find(lang => lang.code === currentLanguage)?.flag}
              </span>
              <span className="text-sm font-medium">
                {languages.find(lang => lang.code === currentLanguage)?.name}
              </span>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown de idiomas */}
            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-md border rounded-2xl shadow-2xl overflow-hidden ${
                    isDark
                      ? 'bg-dark-bg-card border-dark-border-primary'
                      : 'bg-light-bg-card border-light-border-primary'
                  }`}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                        currentLanguage === language.code 
                          ? (isDark ? 'bg-dark-accent-primary/20 text-dark-accent-primary' : 'bg-light-accent-primary/20 text-light-accent-primary')
                          : (isDark ? 'text-dark-text-primary hover:bg-dark-bg-card-hover' : 'text-light-text-primary hover:bg-light-bg-card-hover')
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm font-medium">{language.name}</span>
                      {currentLanguage === language.code && (
                        <svg className={`w-4 h-4 ml-auto ${isDark ? 'text-dark-accent-primary' : 'text-light-accent-primary'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Header fixo */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-40"
        >
          <Navbar />
        </motion.header>

        {/* Conteúdo principal */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10"
        >
          <Footer />
        </motion.footer>

        {/* Chatbot IA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-20"
        >
          <Chatbot />
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
