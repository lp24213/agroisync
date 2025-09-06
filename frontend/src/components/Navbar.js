import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Globe,
  ChevronDown,
  Sun,
  Moon,
  Zap,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  // const { isEnabled } = useFeatureFlags();
  const location = useLocation();


  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };


  // Verificar se o usuário está autenticado
  const isUserAuthenticated = isAuthenticated();

  return (
    <nav className={`fixed top-16 left-0 right-0 z-40 backdrop-blur-xl shadow-2xl border-b transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 border-cyan-500/30 shadow-cyan-500/20' 
        : 'bg-gradient-to-r from-white/95 via-emerald-50/95 to-white/95 border-emerald-200/50 shadow-emerald-500/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo Futurista */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                boxShadow: isDark ? '0 0 30px rgba(0, 255, 255, 0.5)' : '0 0 30px rgba(16, 185, 129, 0.5)'
              }}
              transition={{ duration: 0.6 }}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/30' 
                  : 'bg-gradient-to-br from-emerald-500 via-blue-500 to-teal-600 shadow-lg shadow-emerald-500/30'
              }`}
            >
              <Sparkles className={`w-6 h-6 ${
                isDark ? 'text-white' : 'text-white'
              }`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className={`text-xl font-black tracking-tight ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-emerald-600 via-blue-600 to-teal-600 bg-clip-text text-transparent'
              }`}
            >
              AGROISYNC
            </motion.span>
          </Link>

          {/* Desktop Navigation Moderna */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Páginas Principais */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                  : isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              🏠 {t('home')}
            </Link>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/store"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 border ${
                  isActive('/store') || isActive('/loja')
                    ? (isDark 
                        ? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30 border-cyan-400' 
                        : 'text-white bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30 border-emerald-400')
                    : isDark 
                      ? 'text-cyan-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-900/30 hover:to-blue-900/30 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'text-emerald-700 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🛒</span>
                  <span>{t('nav.store')}</span>
                </div>
              </Link>
            </motion.div>
            
            {/* Dropdown para Serviços */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}>
                <span className="text-sm font-medium">⚡ Serviços</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <Link to="/agroconecta" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🌐 {t('nav.agroconecta')}
                </Link>
                <Link to="/cripto" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  ₿ {t('nav.crypto')}
                </Link>
                <Link to="/cotacao" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  📊 Cotação
            </Link>
                <Link to="/commodities" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🌾 {t('nav.commodities')}
            </Link>
                {/* Mensageria removida - é privada e individual */}
              </div>
            </div>

            {/* Dropdown para Informações */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}>
                <span className="text-sm font-medium">ℹ️ Info</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <Link to="/sobre" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
              {t('about')}
            </Link>
                <Link to="/contato" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
              {t('contact')}
            </Link>
                <Link to="/planos" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
              {t('plans')}
            </Link>
                <Link to="/faq" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  ❓ FAQ
                </Link>
                <Link to="/ajuda" className={`block px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🆘 Ajuda
                </Link>
              </div>
            </div>

            {/* Seletor de Idioma Único e Futurista */}
            <div className="relative group">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-500 border ${
                  isDark 
                    ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25'
                    : 'bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                <Globe className={`w-4 h-4 ${
                  isDark ? 'text-cyan-400' : 'text-emerald-600'
                }`} />
                <span className="text-sm font-semibold">
                  {currentLanguage === 'pt' && '🇧🇷 PT'}
                  {currentLanguage === 'en' && '🇺🇸 EN'}
                  {currentLanguage === 'es' && '🇪🇸 ES'}
                  {currentLanguage === 'zh' && '🇨🇳 ZH'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                className={`absolute top-full right-0 mt-3 w-56 rounded-2xl shadow-2xl border backdrop-blur-xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 z-50 ${
                  isDark 
                    ? 'bg-gray-900/95 border-cyan-500/30 shadow-cyan-500/20'
                    : 'bg-white/95 border-emerald-200/50 shadow-emerald-500/20'
                }`}
              >
                <motion.button 
                  whileHover={{ x: 5, backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => changeLanguage('pt')} 
                  className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-300 ${
                    currentLanguage === 'pt' 
                      ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-700')
                      : (isDark ? 'text-gray-300 hover:text-cyan-300' : 'text-gray-600 hover:text-emerald-600')
                  }`}
                >
                  <span className="text-lg">🇧🇷</span>
                  <span className="font-medium">Português</span>
                  {currentLanguage === 'pt' && <Zap className="w-4 h-4 ml-auto" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ x: 5, backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => changeLanguage('en')} 
                  className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-300 ${
                    currentLanguage === 'en' 
                      ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-700')
                      : (isDark ? 'text-gray-300 hover:text-cyan-300' : 'text-gray-600 hover:text-emerald-600')
                  }`}
                >
                  <span className="text-lg">🇺🇸</span>
                  <span className="font-medium">English</span>
                  {currentLanguage === 'en' && <Zap className="w-4 h-4 ml-auto" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ x: 5, backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => changeLanguage('es')} 
                  className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-300 ${
                    currentLanguage === 'es' 
                      ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-700')
                      : (isDark ? 'text-gray-300 hover:text-cyan-300' : 'text-gray-600 hover:text-emerald-600')
                  }`}
                >
                  <span className="text-lg">🇪🇸</span>
                  <span className="font-medium">Español</span>
                  {currentLanguage === 'es' && <Zap className="w-4 h-4 ml-auto" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ x: 5, backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}
                  onClick={() => changeLanguage('zh')} 
                  className={`flex items-center space-x-3 w-full px-4 py-3 transition-all duration-300 ${
                    currentLanguage === 'zh' 
                      ? (isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-emerald-500/20 text-emerald-700')
                      : (isDark ? 'text-gray-300 hover:text-cyan-300' : 'text-gray-600 hover:text-emerald-600')
                  }`}
                >
                  <span className="text-lg">🇨🇳</span>
                  <span className="font-medium">中文</span>
                  {currentLanguage === 'zh' && <Zap className="w-4 h-4 ml-auto" />}
                </motion.button>
              </motion.div>
            </div>

            {/* Toggle de Tema Futurista */}
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                rotate: isDark ? 180 : -180,
                boxShadow: isDark ? '0 0 20px rgba(255, 193, 7, 0.5)' : '0 0 20px rgba(99, 102, 241, 0.5)'
              }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 border ${
                isDark 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400 hover:border-yellow-400'
                  : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-600 hover:border-indigo-400'
              }`}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark ? 
                <Sun className="w-5 h-5 drop-shadow-lg" /> : 
                <Moon className="w-5 h-5 drop-shadow-lg" />
              }
            </motion.button>


            {/* User Menu */}
            {isUserAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  {t('dashboard')}
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                      isDark 
                        ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl border py-2 z-50 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}>
                      <Link
                        to="/painel-usuario"
                        className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 ${
                          isDark 
                            ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                            : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{t('dashboard')}</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className={`flex items-center space-x-2 w-full px-4 py-2 transition-all duration-300 ${
                          isDark 
                            ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                            : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                                        <Link
                          to="/login"
                          className="btn-secondary"
                        >
                          {t('login')}
                        </Link>
                        
                        <Link
                          to="/cadastro"
                          className="btn-primary"
                        >
                          {t('register')}
                        </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`md:hidden border-t ${
            isDark 
              ? 'bg-gray-900 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home')}
            </Link>
            
            <Link
              to="/store"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.store')}
            </Link>
            
                         <Link
               to="/agroconecta"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
               onClick={() => setIsMenuOpen(false)}
             >
               {t('nav.agroconecta')}
             </Link>
             
             <Link
               to="/cripto"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
               onClick={() => setIsMenuOpen(false)}
             >
               {t('nav.crypto')}
             </Link>
            
            <Link
              to="/sobre"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            
            <Link
              to="/contato"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            
            <Link
              to="/planos"
              className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('plans')}
            </Link>

            {/* Theme Toggle Mobile */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            {isUserAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('dashboard')}
                </Link>
                
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                
                <Link
                  to="/cadastro"
                  className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
