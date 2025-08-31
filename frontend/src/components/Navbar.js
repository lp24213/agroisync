import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Globe,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage, t, availableLanguages } = useLanguage();
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-premium border-b-2 border-accent-emerald">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-premium rounded-lg flex items-center justify-center shadow-premium-soft w-10 h-10"
            >
              <span className="text-xl font-bold bg-gradient-to-r from-accent-emerald to-accent-gold bg-clip-text text-transparent">
                A
              </span>
            </motion.div>
            <span className="text-xl font-bold text-premium-dark-gray">AgroSync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-premium-dark-gray bg-premium-platinum' 
                  : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
              }`}
            >
              {t('home')}
            </Link>
            
            <Link
              to="/sobre"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/sobre') 
                  ? 'text-premium-dark-gray bg-premium-platinum' 
                  : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
              }`}
            >
              {t('about')}
            </Link>
            
            <Link
              to="/contato"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/contato') 
                  ? 'text-premium-dark-gray bg-premium-platinum' 
                  : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
              }`}
            >
              {t('contact')}
            </Link>
            
            <Link
              to="/planos"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/planos') 
                  ? 'text-premium-dark-gray bg-premium-platinum' 
                  : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
              }`}
            >
              {t('plans')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-1 px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{languageNames[currentLanguage]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-premium-soft border border-premium-platinum py-2 z-50">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => selectLanguage(lang)}
                      className={`w-full text-left px-4 py-2 text-sm transition-all duration-300 ${
                        currentLanguage === lang 
                          ? 'text-premium-dark-gray bg-premium-platinum' 
                          : 'text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum'
                      }`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-accent-emerald text-white rounded-lg hover:bg-accent-emerald/80 transition-all duration-300 font-medium"
                >
                  {t('dashboard')}
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-premium-soft border border-premium-platinum py-2 z-50">
                      <Link
                        to="/painel-usuario"
                        className="flex items-center space-x-2 px-4 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{t('dashboard')}</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum transition-all duration-300"
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
                  className="px-4 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300 font-medium"
                >
                  {t('login')}
                </Link>
                
                <Link
                  to="/cadastro"
                  className="px-4 py-2 bg-accent-emerald text-white rounded-lg hover:bg-accent-emerald/80 transition-all duration-300 font-medium"
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
              className="p-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
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
          className="md:hidden bg-white border-t border-premium-platinum"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home')}
            </Link>
            
            <Link
              to="/sobre"
              className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            
            <Link
              to="/contato"
              className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            
            <Link
              to="/planos"
              className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('plans')}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('dashboard')}
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                
                <Link
                  to="/cadastro"
                  className="block px-3 py-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-all duration-300"
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
