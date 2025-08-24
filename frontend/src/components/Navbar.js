import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
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
          ? 'navbar-theme shadow-2xl'
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
                    ? 'bg-gradient-to-br from-cyan-400 to-purple-500'
                    : 'bg-gradient-to-br from-green-600 to-blue-600'
                }`}>
                  <span className="text-2xl lg:text-3xl font-bold text-white">
                    AC
                  </span>
                </div>
                <div className={`absolute inset-0 rounded-2xl animate-pulse ${
                  isDark 
                    ? 'bg-gradient-to-br from-cyan-400/20 to-transparent'
                    : 'bg-gradient-to-br from-green-600/20 to-transparent'
                }`} />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl lg:text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('common.brand')}
                </h1>
                <p className={`text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('common.tagline')}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? (isDark
                          ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20'
                          : 'text-green-600 bg-green-600/10 border border-green-600/20')
                      : (isDark
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50')
                  }`}
                >
                  {link.label}
                </Link>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                      isDark ? 'bg-cyan-400' : 'bg-green-600'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <span className="text-lg">{languages.find(l => l.code === currentLanguage)?.flag}</span>
              </button>

              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl backdrop-blur-xl ${
                      isDark 
                        ? 'bg-gray-900/95 border border-gray-700' 
                        : 'bg-white/95 border border-gray-200'
                    }`}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors duration-200 ${
                          currentLanguage === language.code
                            ? (isDark
                                ? 'bg-cyan-400/20 text-cyan-400'
                                : 'bg-green-600/20 text-green-600')
                            : (isDark
                                ? 'text-gray-300 hover:bg-gray-800/50'
                                : 'text-gray-600 hover:bg-gray-100/50')
                        }`}
                      >
                        <span className="mr-3">{language.flag}</span>
                        {language.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10' 
                  : 'text-green-600 hover:text-green-500 hover:bg-green-600/10'
              }`}
            >
              {isDark ? '☀️' : '🌙'}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden border-t ${
              isDark ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'
            } backdrop-blur-xl`}
          >
            <div className="px-4 py-4 space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? (isDark
                          ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20'
                          : 'text-green-600 bg-green-600/10 border border-green-600/20')
                      : (isDark
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50')
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
