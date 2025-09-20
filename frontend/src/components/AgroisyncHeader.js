import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { 
  Menu,
  X,
  Home,
  ShoppingCart,
  Truck,
  LogIn,
  LogOut,
  User,
  Info,
  Coins,
  Crown
} from 'lucide-react';

const AgroisyncHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/loja', label: 'Loja', icon: ShoppingCart },
    { path: '/agroconecta', label: 'AgroConecta', icon: Truck },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/tecnologia', label: 'Crypto', icon: Coins },
    { path: '/about', label: 'Sobre', icon: Info },
    { path: '/planos', label: 'Planos', icon: Crown },
  ];

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <>
      <motion.header
        className={`premium-header ${isScrolled ? 'premium-header-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="premium-header-container">
          {/* Logo - Esquerda */}
          <div className="premium-header-logo">
            <Link to="/" className="premium-header-logo-link">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Ik00NSA1NSBRNTAgNTAgNTUgNDUiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTQ3IDUyIFE0MiA0OCA0MCA0NSIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNDkgNTAgUTQ0IDQ2IDQyIDQzIiBzdHJva2U9IiNEQUE1MjAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjxlbGxpcHNlIGN4PSI1NSIgY3k9IjQ1IiByeD0iOCIgcnk9IjEyIiBmaWxsPSIjREFBNTIwIiBvcGFjaXR5PSIwLjgiLz48ZWxsaXBzZSBjeD0iNTUiIGN5PSI0NSIgcng9IjYiIHJ5PSIxMCIgZmlsbD0iI0RBQTUyMCIvPjxsaW5lIHgxPSI1MCIgeTE9IjM1IiB4Mj0iNTAiIHkyPSIzMCIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI1MiIgeTE9IjM2IiB4Mj0iNTIiIHkyPSIzMSIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI1NCIgeTE9IjM3IiB4Mj0iNTQiIHkyPSIzMiIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI1NiIgeTE9IjM2IiB4Mj0iNTYiIHkyPSIzMSIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI1OCIgeTE9IjM1IiB4Mj0iNTgiIHkyPSIzMCIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI2MCIgeTE9IjM2IiB4Mj0iNjAiIHkyPSIzMSIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvZz48ZyBvcGFjaXR5PSIwLjciPjxwYXRoIGQ9Ik02NSA1OCBRNzAgNTMgNzUgNDgiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNjcgNTUgUTYyIDUxIDYwIDQ4IiBzdHJva2U9IiNEQUE1MjAiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+PGVsbGlwc2UgY3g9Ijc1IiBjeT0iNDgiIHJ4PSI2IiByeT0iOSIgZmlsbD0iI0RBQTUyMCIgb3BhY2l0eT0iMC44Ii8+PGVsbGlwc2UgY3g9Ijc1IiBjeT0iNDgiIHJ4PSI0IiByeT0iNyIgZmlsbD0iI0RBQTUyMCIvPjxsaW5lIHgxPSI3MiIgeTE9IjQwIiB4Mj0iNzIiIHkyPSIzNiIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEiLz48bGluZSB4MT0iNzQiIHkxPSI0MSIgeDI9Ijc0IiB5Mj0iMzciIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PGxpbmUgeDE9Ijc2IiB5MT0iNDIiIHgyPSI3NiIgeTI9IjM4IiBzdHJva2U9IiNEQUE1MjAiIHN0cm9rZS13aWR0aD0iMSIvPjxsaW5lIHgxPSI3OCIgeTE9IjQxIiB4Mj0iNzgiIHkyPSIzNyIgc3Ryb2tlPSIjREFBNTIwIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PHBhdGggZD0iTTQwIDYwIFE1MCA1OCA2MCA2MCBRNzAgNjIgODAgNjAiIHN0cm9rZT0iI0RBQTUyMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHRleHQgeD0iMTAwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIj5BR1JPSVNZTkM8L3RleHQ+PC9zdmc+" alt="AGROISYNC" className="premium-header-logo-img" />
            </Link>
          </div>

          {/* Desktop Navigation - Centro */}
          <nav className="premium-header-menu">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <div key={item.path} className="premium-header-item">
              <Link
                to={item.path}
                className={`premium-header-link agro-btn-animated ${isActive ? 'active' : ''}`}
              >
                    <Icon size={8} />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Actions - Direita */}
          <div className="premium-header-actions">
            {/* Language Selector */}
            <LanguageSelector variant="minimal" showLabel={false} />

            {/* Auth Buttons */}
            <div className="premium-auth-buttons">
              {user ? (
                <div className="premium-user-menu">
                  <span className="premium-user-name">{user.name || user.email}</span>
                  <Link to="/dashboard" className="premium-header-link agro-btn-animated">
                    <User size={16} />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                  <button onClick={handleLogout} className="premium-header-link agro-btn-animated">
                    <LogOut size={16} />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="premium-header-link agro-btn-animated">
                    <LogIn size={8} />
                    <span>{t('nav.login')}</span>
                  </Link>
                  <Link to="/register" className="premium-header-link agro-btn-animated">
                    <span>{t('nav.register')}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
        <button
          className="premium-mobile-toggle agro-btn-animated"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="premium-mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="premium-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
            <div className="premium-mobile-content">
              {/* Mobile Navigation */}
              <nav className="premium-mobile-nav">
                <h3 className="premium-mobile-section-title">Navegação</h3>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <div key={item.path} className="premium-mobile-item">
                      <Link
                        to={item.path}
                        className={`premium-mobile-link ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon size={18} />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Mobile Language Selector */}
              <div>
                <h3 className="premium-mobile-section-title">Idiomas</h3>
                <div className="premium-mobile-lang-grid">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`premium-mobile-lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="premium-lang-flag">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="premium-mobile-auth">
                <h3 className="premium-mobile-section-title">Conta</h3>
                {user ? (
                  <div className="premium-mobile-user">
                    <div className="premium-mobile-user-info">
                      <strong>{user.name || user.email}</strong>
                    </div>
                    <div className="premium-mobile-auth-buttons">
                      <Link 
                        to="/dashboard" 
                        className="premium-mobile-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={20} />
                        <span>Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }} 
                        className="premium-mobile-link"
                      >
                        <LogOut size={20} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="premium-mobile-auth-buttons">
                    <Link 
                      to="/login" 
                      className="premium-mobile-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn size={20} />
                      <span>Entrar</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="premium-mobile-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Registrar</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header Spacer */}
      <div className="premium-header-spacer" />
    </>
  );
};

export default AgroisyncHeader;
