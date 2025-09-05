import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
// import { useFeatureFlags } from '../contexts/FeatureFlagsContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Globe,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, t, availableLanguages } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  // const { isEnabled } = useFeatureFlags();
  const location = useLocation();

  const languageNames = {
    pt: 'Português',
    en: 'English',
    es: 'Español',
    zh: '中文'
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  // Verificar se o usuário está autenticado
  const isUserAuthenticated = isAuthenticated();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center shadow-lg w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg"
            >
              <img 
                src="/logo-agroisync.svg" 
                alt="AGROISYNC" 
                width="24" 
                height="24" 
                className="w-6 h-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  // Fallback para texto se SVG não carregar
                  const fallbackText = document.createElement('span');
                  fallbackText.textContent = 'A';
                  fallbackText.className = 'text-lg font-bold text-emerald-600';
                  e.target.parentNode.appendChild(fallbackText);
                }}
              />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">AGROISYNC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {t('home')}
            </Link>
            
            <Link
              to="/loja"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/loja') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Loja
            </Link>
            
            <Link
              to="/agroconecta"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/agroconecta') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              AgroConecta
            </Link>
            
            <Link
              to="/cripto"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/cripto') 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Cripto
            </Link>
            
            <Link
              to="/sobre"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/sobre') 
                  ? 'text-agro-text-primary bg-agro-bg-card' 
                  : 'text-agro-text-tertiary hover:text-agro-text-primary hover:bg-agro-bg-card/30'
              }`}
            >
              {t('about')}
            </Link>
            
            <Link
              to="/contato"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/contato') 
                  ? 'text-agro-text-primary bg-agro-bg-card' 
                  : 'text-agro-text-tertiary hover:text-agro-text-primary hover:bg-agro-bg-card/30'
              }`}
            >
              {t('contact')}
            </Link>
            
            <Link
              to="/planos"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/planos') 
                  ? 'text-agro-text-primary bg-agro-bg-card' 
                  : 'text-agro-text-tertiary hover:text-agro-text-primary hover:bg-agro-bg-card/30'
              }`}
            >
              {t('plans')}
            </Link>

            {/* Language Selector */}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
                              <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{languageNames[currentLanguage]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => selectLanguage(lang)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all duration-300 ${
                          currentLanguage === lang 
                            ? 'text-emerald-600 bg-emerald-50' 
                            : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                )}
            </div>

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
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <Link
                        to="/painel-usuario"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{t('dashboard')}</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sair</span>
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
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
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
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home')}
            </Link>
            
            <Link
              to="/loja"
              className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Loja
            </Link>
            
                         <Link
               to="/agroconecta"
               className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
               onClick={() => setIsMenuOpen(false)}
             >
               AgroConecta
             </Link>
             
             <Link
               to="/cripto"
               className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
               onClick={() => setIsMenuOpen(false)}
             >
               Cripto
             </Link>
            
            <Link
              to="/sobre"
              className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            
            <Link
              to="/contato"
              className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            
            <Link
              to="/planos"
              className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
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
              className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            {isUserAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('dashboard')}
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/30 rounded-lg transition-all duration-300"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                
                <Link
                  to="/cadastro"
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
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
