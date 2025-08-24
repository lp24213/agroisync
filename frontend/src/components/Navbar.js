import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isDark, isLight, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navigationLinks = [
    { path: '/', label: t('navigation.home') },
    { path: '/sobre', label: t('navigation.about') },
    { path: '/cotacao', label: t('navigation.quotes') },
    { path: '/loja', label: t('navigation.store') },
    { path: '/agroconecta', label: t('navigation.agroconnect') },
    { path: '/cripto', label: t('navigation.crypto') },
    { path: '/cadastro', label: t('navigation.register') },
    { path: '/contato', label: t('navigation.contact') }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? (isDark 
              ? 'bg-dark-bg-card/95 backdrop-blur-xl border-b border-dark-border-primary shadow-2xl'
              : 'bg-light-bg-card/95 backdrop-blur-xl border-b border-light-border-primary shadow-2xl')
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-dark-accent-primary to-dark-accent-secondary'
                    : 'bg-gradient-to-br from-light-accent-primary to-light-accent-secondary'
                }`}>
                  <span className="text-2xl lg:text-3xl font-bold text-white">
                    AC
                  </span>
                </div>
                <div className={`absolute inset-0 rounded-2xl animate-pulse ${
                  isDark 
                    ? 'bg-gradient-to-br from-dark-accent-primary/20 to-transparent'
                    : 'bg-gradient-to-br from-light-accent-primary/20 to-transparent'
                }`} />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl lg:text-2xl font-bold ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}>
                  {t('common.brand')}
                </h1>
                <p className={`text-xs font-medium ${
                  isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
                }`}>
                  {t('common.tagline')}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive(link.path)
                      ? (isDark 
                          ? 'text-dark-text-primary bg-dark-accent-primary/20 border border-dark-accent-primary/50'
                          : 'text-light-text-primary bg-light-accent-primary/20 border border-light-accent-primary/50')
                      : (isDark 
                          ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-card-hover'
                          : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-card-hover')
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl border ${
                        isDark 
                          ? 'bg-gradient-to-r from-dark-accent-primary/20 to-dark-accent-secondary/20 border-dark-accent-primary/50'
                          : 'bg-gradient-to-r from-light-accent-primary/20 to-light-accent-secondary/20 border-light-accent-primary/50'
                      }`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-r from-dark-accent-primary/0 via-dark-accent-primary/10 to-dark-accent-primary/0'
                      : 'bg-gradient-to-r from-light-accent-primary/0 via-light-accent-primary/10 to-light-accent-primary/0'
                  }`} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Theme and Language Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 backdrop-blur-md border rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                isDark
                  ? 'bg-dark-glass-bg border-dark-border-primary text-dark-text-primary hover:bg-dark-bg-card-hover hover:border-dark-border-accent'
                  : 'bg-light-glass-bg border-light-border-primary text-light-text-primary hover:bg-light-bg-card-hover hover:border-light-border-accent'
              }`}
              title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`flex items-center space-x-2 px-3 py-2 backdrop-blur-md border rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  isDark
                    ? 'bg-dark-glass-bg border-dark-border-primary text-dark-text-primary hover:bg-dark-bg-card-hover hover:border-dark-border-accent'
                    : 'bg-light-glass-bg border-light-border-primary text-light-text-primary hover:bg-light-bg-card-hover hover:border-light-border-accent'
                }`}
              >
                <span className="text-sm">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
                <span className="hidden sm:block text-xs font-medium">
                  {languages.find(lang => lang.code === currentLanguage)?.name}
                </span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Language Dropdown */}
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full right-0 mt-2 w-40 backdrop-blur-md border rounded-xl shadow-2xl overflow-hidden z-50 ${
                      isDark
                        ? 'bg-dark-bg-card border-dark-border-primary'
                        : 'bg-light-bg-card border-light-border-primary'
                    }`}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-colors duration-200 ${
                          currentLanguage === language.code 
                            ? (isDark ? 'bg-dark-accent-primary/20 text-dark-accent-primary' : 'bg-light-accent-primary/20 text-light-accent-primary')
                            : (isDark ? 'text-dark-text-primary hover:bg-dark-bg-card-hover' : 'text-light-text-primary hover:bg-light-bg-card-hover')
                        }`}
                      >
                        <span className="text-sm">{language.flag}</span>
                        <span className="text-xs font-medium">{language.name}</span>
                        {currentLanguage === language.code && (
                          <svg className={`w-3 h-3 ml-auto ${isDark ? 'text-dark-accent-primary' : 'text-light-accent-primary'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-dark-bg-card-hover border border-dark-border-primary text-dark-text-primary hover:bg-dark-bg-card-hover'
                    : 'bg-light-bg-card-hover border border-light-border-primary text-light-text-primary hover:bg-light-bg-card-hover'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className={`px-2 pt-2 pb-3 space-y-1 rounded-b-2xl ${
                isDark
                  ? 'bg-dark-bg-card/95 backdrop-blur-xl border-t border-dark-border-primary'
                  : 'bg-light-bg-card/95 backdrop-blur-xl border-t border-light-border-primary'
              }`}>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? (isDark 
                            ? 'text-dark-text-primary bg-dark-accent-primary/20 border border-dark-accent-primary/50'
                            : 'text-light-text-primary bg-light-accent-primary/20 border border-light-accent-primary/50')
                        : (isDark 
                            ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-card-hover'
                            : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-card-hover')
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
