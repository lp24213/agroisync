import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Globe, Sun, Moon, ChevronDown, User, 
  ShoppingCart, Truck, Coins, BarChart3, HelpCircle, 
  Activity, Settings, LogOut
} from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? (isDark ? 'bg-black/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md')
        : 'bg-transparent'
    } ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 flex-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            <span className="text-xl font-bold">Agroisync</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <a href="/" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.home')}
            </a>
            <a href="/sobre" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.about')}
            </a>
            <a href="/loja" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.store')}
            </a>
            <a href="/agroconecta" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.agroconnect')}
            </a>
            <a href="/cripto" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.crypto')}
            </a>
            <a href="/planos" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.plans')}
            </a>
            <a href="/faq" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.faq')}
            </a>
            <a href="/ajuda" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.help')}
            </a>
            <a href="/status" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.status')}
            </a>
            <a href="/contato" className="hover:text-green-500 transition-colors duration-200">
              {t('nav.contact')}
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm">{currentLanguage?.flag}</span>
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          i18n.changeLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu or Login/Register */}
            {user ? (
              <div className="relative">
              <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name}</span>
              </button>

                {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sair</span>
                        </button>
                      </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {t('nav.login')}
                </a>
                <a
                  href="/cadastro"
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  {t('nav.register')}
                </a>
              </div>
            )}
            </div>

            {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
            className="lg:hidden bg-black border-t border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-4">
                <a href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span>{t('nav.home')}</span>
                </a>
                <a href="/sobre" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <span>{t('nav.about')}</span>
                </a>
                <a href="/loja" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span>{t('nav.store')}</span>
                </a>
                <a href="/agroconecta" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <Truck className="w-5 h-5 text-white" />
                  <span>{t('nav.agroconnect')}</span>
                </a>
                <a href="/cripto" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <Coins className="w-5 h-5 text-white" />
                  <span>{t('nav.crypto')}</span>
                </a>
                <a href="/planos" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span>{t('nav.plans')}</span>
                </a>
                <a href="/faq" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <span>{t('nav.faq')}</span>
                </a>
                <a href="/ajuda" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <span>{t('nav.help')}</span>
                </a>
                <a href="/status" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <Activity className="w-5 h-5 text-white" />
                  <span>{t('nav.status')}</span>
                </a>
                <a href="/contato" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <span>{t('nav.contact')}</span>
                </a>
              </div>

              {/* Mobile Language and Theme */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-white">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-sm">{currentLanguage?.flag}</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                >
                  {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
                </button>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full px-4 py-2 text-sm font-medium text-white hover:text-gray-200 transition-colors duration-200 text-center"
                    >
                      {t('nav.login')}
                    </a>
                    <a
                      href="/cadastro"
                      onClick={() => setIsOpen(false)}
                      className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
                    >
                      {t('nav.register')}
                    </a>
                  </>
                  )}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
