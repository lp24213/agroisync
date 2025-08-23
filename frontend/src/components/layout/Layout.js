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
  const { theme, toggleTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fundo animado de estrelas (apenas no tema escuro) */}
      {theme === 'dark' && <StarfieldBackground />}
      
      {/* Gradiente sutil sobre o fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none z-0" />
      
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
            className="flex items-center justify-center w-12 h-12 bg-glass-bg backdrop-blur-md border border-border-primary rounded-2xl text-text-primary hover:bg-bg-card-hover hover:border-border-accent transition-all duration-300 shadow-lg hover:shadow-xl"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? (
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
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 bg-glass-bg backdrop-blur-md border border-border-primary rounded-2xl text-text-primary hover:bg-bg-card-hover hover:border-border-accent transition-all duration-300 shadow-lg hover:shadow-xl">
              <span className="text-lg">
                {languages.find(lang => lang.code === currentLanguage)?.flag}
              </span>
              <span className="text-sm font-medium">
                {languages.find(lang => lang.code === currentLanguage)?.name}
              </span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown de idiomas */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-bg-card backdrop-blur-md border border-border-primary rounded-2xl shadow-2xl overflow-hidden"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-bg-card-hover transition-colors duration-200 ${
                      currentLanguage === language.code ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-primary'
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium">{language.name}</span>
                    {currentLanguage === language.code && (
                      <svg className="w-4 h-4 ml-auto text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </motion.div>
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
