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
    <nav className={`fixed top-16 left-0 right-0 z-40 backdrop-blur-md shadow-xl border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-black/95 border-gray-800' 
        : 'bg-white/95 border-gray-200'
    }`}>
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
                  : isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
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
                  : isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              🛒 {t('nav.store')}
            </Link>
            
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

            {/* Language Selector */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}>
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <button onClick={() => changeLanguage('pt')} className={`block w-full text-left px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🇧🇷 Português
                </button>
                <button onClick={() => changeLanguage('en')} className={`block w-full text-left px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🇺🇸 English
                </button>
                <button onClick={() => changeLanguage('es')} className={`block w-full text-left px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🇪🇸 Español
                </button>
                <button onClick={() => changeLanguage('zh')} className={`block w-full text-left px-4 py-3 transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}>
                  🇨🇳 中文
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:text-emerald-400 hover:bg-emerald-900/20'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>


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
              to="/loja"
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
