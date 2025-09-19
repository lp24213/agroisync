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
  Coins,
  Users,
  LogIn,
  LogOut,
  User,
  Info
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
    setIsLanguageMenuOpen(false);
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
    { path: '/about', label: 'Sobre', icon: Info },
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
              <img src="/assets/logo.png" alt="Agroisync" className="premium-header-logo-img" />
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
                    <Icon size={16} />
                    <span>{item.label}</span>
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
                    <LogIn size={16} />
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
                        <Icon size={20} />
                        <span>{item.label}</span>
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
