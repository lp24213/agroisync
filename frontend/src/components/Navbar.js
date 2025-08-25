import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Globe, Sun, Moon, User, 
  ShoppingCart, Truck, Coins, BarChart3, HelpCircle, 
  Activity, LogOut, Award, MessageCircle, Newspaper
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

  const scrollToNews = () => {
    const newsSection = document.getElementById('news-section');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`w-full transition-all duration-300 ${
      isScrolled 
        ? (isDark ? 'bg-black/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md')
        : 'bg-transparent'
    } ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Centralizado */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 mr-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            <span className="text-xl font-bold">{t('nav.brand')}</span>
          </motion.div>

          {/* Desktop Navigation - Ajustado para todas as páginas */}
          <div className="hidden lg:flex items-center space-x-3 text-sm">
            <a href="/" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.home')}
            </a>
            <button 
              onClick={scrollToNews}
              className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap flex items-center space-x-1"
            >
              <Newspaper className="w-4 h-4" />
              <span>Notícias</span>
            </button>
            <a href="/loja" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.store')}
            </a>
            <a href="/agroconecta" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.agroconnect')}
            </a>
            <a href="/cripto" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.crypto')}
            </a>
            <a href="/parcerias" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              Parcerias
            </a>
            {/* Mensageria só visível para usuários com plano ativo - NÃO MOSTRAR NO MENU PÚBLICO */}
            <a href="/faq" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.faq')}
            </a>
            <a href="/status" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.status')}
            </a>
            <a href="/ajuda" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.help')}
            </a>
            <a href="/sobre" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.about')}
            </a>
            <a href="/contato" className="hover:text-green-500 transition-colors duration-200 whitespace-nowrap">
              {t('nav.contact')}
            </a>
          </div>

          {/* Right Side - Language, Theme, User */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <span className="text-2xl">{currentLanguage?.flag}</span>
                <span className="hidden sm:block text-sm">{currentLanguage?.code.toUpperCase()}</span>
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          i18n.changeLanguage(language.code);
                          setIsLanguageOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <span className="text-2xl">{language.flag}</span>
                        <span className="text-sm">{language.name}</span>
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
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <a
                          href="/perfil"
                          className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <User className="w-4 h-4" />
                          <span>Perfil</span>
                        </a>
                        
                        {/* Mensagerias */}
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Mensageria</p>
                          <a
                            href="/messages"
                            className="flex items-center space-x-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                          >
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span>Painel de Mensagens</span>
                          </a>
                          <a
                            href="/messages/products"
                            className="flex items-center space-x-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                          >
                            <ShoppingCart className="w-4 h-4 text-blue-500" />
                            <span>Produtos</span>
                          </a>
                          <a
                            href="/messages/freights"
                            className="flex items-center space-x-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 rounded"
                          >
                            <Truck className="w-4 h-4 text-green-500" />
                            <span>Fretes</span>
                          </a>
                        </div>
                        
                        <button
                          onClick={logout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
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
                  className="px-4 py-2 text-sm font-medium hover:text-green-500 transition-colors duration-200"
                >
                  {t('nav.login')}
                </a>
                <a
                  href="/cadastro"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                >
                  {t('nav.register')}
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-black border-t border-gray-700"
            >
              <div className="py-4 space-y-2">
                {/* Grupo 1: Páginas Principais */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Páginas Principais</h3>
                  <div className="space-y-2">
                    <a 
                      href="/" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      <span>{t('nav.home')}</span>
                    </a>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        scrollToNews();
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <Newspaper className="w-5 h-5 text-blue-400" />
                      <span>Notícias</span>
                    </button>
                    <a 
                      href="/loja" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                      <span>Marketplace</span>
                    </a>
                    <a 
                      href="/agroconecta" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <Truck className="w-5 h-5 text-green-400" />
                      <span>{t('nav.agroconnect')}</span>
                    </a>
                    <a 
                      href="/cripto" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span>{t('nav.crypto')}</span>
                    </a>
                  </div>
                </div>

                {/* Grupo 2: Informações e Suporte */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Informações</h3>
                  <div className="space-y-2">
                    <a 
                      href="/parcerias" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span>Parcerias</span>
                    </a>
                    <a 
                      href="/faq" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <HelpCircle className="w-5 h-5 text-blue-400" />
                      <span>{t('nav.faq')}</span>
                    </a>
                    <a 
                      href="/status" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span>{t('nav.status')}</span>
                    </a>
                    <a 
                      href="/sobre" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <HelpCircle className="w-5 h-5 text-gray-400" />
                      <span>{t('nav.about')}</span>
                    </a>
                    <a 
                      href="/ajuda" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <HelpCircle className="w-5 h-5 text-green-400" />
                      <span>{t('nav.help')}</span>
                    </a>
                    <a 
                      href="/contato" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <HelpCircle className="w-5 h-5 text-purple-400" />
                      <span>{t('nav.contact')}</span>
                    </a>
                  </div>
                </div>

                {/* Grupo 3: Serviços */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Serviços</h3>
                  <div className="space-y-2">
                    <a 
                      href="/cotacao" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                      <span>Cotação</span>
                    </a>
                  </div>
                </div>

                {/* Mensagerias - Só visível para usuários logados */}
                {user && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Mensageria Privada</h3>
                    <div className="space-y-2">
                      <a 
                        href="/messages" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white bg-gradient-to-r from-purple-600/20 to-purple-800/20 border border-purple-500/30"
                      >
                        <MessageCircle className="w-5 h-5 text-purple-400" />
                        <span>Painel de Mensagens</span>
                      </a>
                      <a 
                        href="/messages/products" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30"
                      >
                        <ShoppingCart className="w-5 h-5 text-blue-400" />
                        <span>Produtos</span>
                      </a>
                      <a 
                        href="/messages/freights" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30"
                      >
                        <Truck className="w-5 h-5 text-green-400" />
                        <span>Fretes</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Chatbot IA */}
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assistente IA</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Scroll para o chatbot
                      const chatbotElement = document.getElementById('chatbot');
                      if (chatbotElement) {
                        chatbotElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30"
                  >
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <span>{t('chatbot.name')}</span>
                  </button>
                </div>

                {/* Admin - Somente se logado como admin */}
                {user && user.isAdmin && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Administração</h3>
                    <div className="space-y-2">
                      <a 
                        href="/admin" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30"
                      >
                        <BarChart3 className="w-5 h-5 text-red-400" />
                        <span>Painel Admin</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Mobile Language & Theme */}
                <div className="flex items-center justify-between p-3 border-t border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      {isDark ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Moon className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-white"
                    >
                      <span className="text-xl">{currentLanguage?.flag}</span>
                      <span className="text-sm">{currentLanguage?.code.toUpperCase()}</span>
                    </button>
                  </div>
                </div>

                {/* Mobile User Info */}
                {user ? (
                  <>
                    <div className="px-3 py-2 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
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
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-center"
                    >
                      {t('nav.register')}
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
