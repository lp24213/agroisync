import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Globe, Sun, Moon, ShoppingCart, Truck, 
  Coins, User, LogIn, ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageOpen(!isLanguageOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsLanguageOpen(false);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsLanguageOpen(false);
    setIsUserMenuOpen(false);
  };

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-menu')) {
        closeMenus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    { name: t('nav.home'), href: '/', icon: null },
    { name: t('nav.about'), href: '/sobre', icon: null },
    { 
      name: t('nav.store'), 
      href: '/loja', 
      icon: <ShoppingCart className="w-4 h-4" />,
      submenu: [
        { name: t('nav.store.products'), href: '/loja' },
        { name: t('nav.store.categories'), href: '/loja' },
        { name: t('nav.store.sellers'), href: '/loja' }
      ]
    },
    { 
      name: t('nav.freight'), 
      href: '/agroconecta', 
      icon: <Truck className="w-4 h-4" />,
      submenu: [
        { name: t('nav.freight.search'), href: '/agroconecta' },
        { name: t('nav.freight.register'), href: '/agroconecta' },
        { name: t('nav.freight.carriers'), href: '/agroconecta' }
      ]
    },
    { 
      name: t('nav.crypto'), 
      href: '/cripto', 
      icon: <Coins className="w-4 h-4" />,
      submenu: [
        { name: t('nav.crypto.quotes'), href: '/cripto' },
        { name: t('nav.crypto.wallet'), href: '/cripto' },
        { name: t('nav.crypto.payments'), href: '/cripto' }
      ]
    },
    { name: t('nav.contact'), href: '/contato', icon: null },
    { name: t('nav.plans'), href: '/planos', icon: null }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark 
          ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="/" className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-gradient-to-r from-green-500 to-blue-600'
              }`}>
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                AgroISync
              </span>
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.name}</span>
                  {item.submenu && <ChevronDown className="w-4 h-4 ml-1" />}
                </a>

                {/* Submenu */}
                {item.submenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                    <div className={`py-2 rounded-lg shadow-lg ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative navbar-menu">
              <button
                onClick={toggleLanguageMenu}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Globe className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                          i18n.language === language.code
                            ? (isDark ? 'bg-gray-700 text-white' : 'bg-green-50 text-green-700')
                            : (isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100')
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm font-medium">{language.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* User Menu */}
            <div className="relative navbar-menu">
              <button
                onClick={toggleUserMenu}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg ${
                      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <a
                      href="/cadastro"
                      className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${
                        isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('nav.register')}</span>
                    </a>
                    <a
                      href="/login"
                      className={`flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${
                        isDark ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('nav.login')}</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden overflow-hidden ${
              isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'
            }`}
          >
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={closeMenus}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.name}</span>
                  </a>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-6 mt-2 space-y-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.href}
                          className={`block px-3 py-2 text-sm transition-colors duration-200 ${
                            isDark 
                              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={closeMenus}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
