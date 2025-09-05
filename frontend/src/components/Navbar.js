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

          {/* Desktop Navigation Moderna */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Páginas Principais */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              🏠 {t('home')}
            </Link>
            
            <Link
              to="/loja"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/loja') 
                  ? 'text-white bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              🛒 Loja
            </Link>

            {/* Dropdown para Serviços */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300">
                <span className="text-sm font-medium">⚡ Serviços</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/agroconecta" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🌐 AgroConecta
                </Link>
                <Link to="/cripto" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  ₿ Cripto
                </Link>
                <Link to="/cotacao" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  📊 Cotação
                </Link>
                <Link to="/commodities" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🌾 Commodities
                </Link>
                <Link to="/mensageria" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  💬 Mensageria
                </Link>
              </div>
            </div>

            {/* Dropdown para Informações */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300">
                <span className="text-sm font-medium">ℹ️ Info</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/sobre" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  {t('about')}
                </Link>
                <Link to="/contato" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  {t('contact')}
                </Link>
                <Link to="/planos" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  {t('plans')}
                </Link>
                <Link to="/faq" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  ❓ FAQ
                </Link>
                <Link to="/ajuda" className="block px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🆘 Ajuda
                </Link>
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <button onClick={() => changeLanguage('pt')} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🇧🇷 Português
                </button>
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🇺🇸 English
                </button>
                <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🇪🇸 Español
                </button>
                <button onClick={() => changeLanguage('zh')} className="block w-full text-left px-4 py-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                  🇨🇳 中文
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300"
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
