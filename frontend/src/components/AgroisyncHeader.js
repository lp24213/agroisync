import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  UserPlus, 
  Menu,
  X,
  Globe,
  ChevronDown,
  Sun,
  Moon,
  Home,
  ShoppingCart,
  Truck,
  Store,
  Zap,
  Handshake
} from 'lucide-react';

const AgroisyncHeader = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Menu principal com ícones profissionais
  const navigationItems = [
    { path: '/', label: t('nav.inicio'), icon: Home },
    { path: '/loja', label: t('nav.loja'), icon: ShoppingCart },
    { path: '/agroconecta', label: t('nav.agroconecta'), icon: Truck },
    { path: '/marketplace', label: t('nav.marketplace'), icon: Store },
    { path: '/tecnologia', label: t('nav.tecnologia'), icon: Zap },
    { path: '/partnerships', label: t('nav.parcerias'), icon: Handshake }
  ];

  // Idiomas disponíveis
  const languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷', label: 'Português' },
    { code: 'en', name: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'es', name: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'zh', name: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('agroisync-language') || 'pt';
    const savedTheme = localStorage.getItem('agroisync-theme') || 'dark';
    
    setCurrentLanguage(savedLanguage);
    setIsDarkTheme(savedTheme === 'dark');
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Aplicar idioma
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setIsLanguageMenuOpen(false);
    localStorage.setItem('agroisync-language', langCode);
    i18n.changeLanguage(langCode);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    const themeValue = newTheme ? 'dark' : 'light';
    localStorage.setItem('agroisync-theme', themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };


  return (
    <>
      {/* Navbar Principal */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo - Esquerda */}
          <div className="navbar-logo">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo-content">
                <span className="navbar-logo-text">AGROISYNC</span>
                <span className="navbar-logo-tagline">{t('nav.tagline')}</span>
              </div>
            </Link>
          </div>

          {/* Menu Principal - Centro (Desktop) */}
          <ul className="navbar-menu">
            {navigationItems.map((item) => (
              <li key={item.path} className="navbar-item">
                <Link
                  to={item.path}
                  className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span className="navbar-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Ações - Direita */}
          <div className="navbar-actions">
            {/* Menu de Idiomas */}
            <div className="agro-language-container">
              <button 
                className="agro-language-btn"
                onClick={toggleLanguageMenu}
                aria-label={t('nav.selectLanguage')}
                aria-expanded={isLanguageMenuOpen}
              >
                <Globe size={18} />
                <span className="agro-lang-text">{t('nav.languages')}</span>
                <ChevronDown size={14} className={`agro-chevron ${isLanguageMenuOpen ? 'open' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="agro-language-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`agro-lang-option ${currentLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="agro-lang-flag">{lang.flag}</span>
                        <span className="agro-lang-name">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle de Tema */}
            <button 
              className="agro-theme-toggle"
              onClick={toggleTheme}
              aria-label={t('nav.toggleTheme')}
            >
              {isDarkTheme ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Botões de Auth */}
            <div className="agro-auth-buttons">
              {user ? (
                <div className="agro-user-menu">
                  <span className="agro-user-name">{user.name}</span>
                  <button onClick={logout} className="agro-logout-btn">
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="agro-login-btn">
                    <User size={18} />
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="agro-register-btn">
                    <UserPlus size={18} />
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>

            {/* Botão Mobile */}
            <button
              className="agro-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label={t('nav.toggleMenu')}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="agro-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="agro-mobile-content">
                {/* Menu Principal Mobile */}
                <ul className="agro-mobile-nav">
                  {navigationItems.map((item) => (
                    <li key={item.path} className="agro-mobile-item">
                      <Link
                        to={item.path}
                        className={`agro-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="agro-mobile-icon">{item.icon}</span>
                        <span className="agro-mobile-text">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Idiomas Mobile */}
                <div className="agro-mobile-languages">
                  <h4 className="agro-mobile-section-title">{t('nav.languages')}</h4>
                  <div className="agro-mobile-lang-grid">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`agro-mobile-lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="agro-mobile-lang-flag">{lang.flag}</span>
                        <span className="agro-mobile-lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Auth Mobile */}
                <div className="agro-mobile-auth">
                  {user ? (
                    <div className="agro-mobile-user">
                      <span>{user.name}</span>
                      <button onClick={logout}>{t('nav.logout')}</button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="agro-mobile-login">
                        {t('nav.login')}
                      </Link>
                      <Link to="/register" className="agro-mobile-register">
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Espaçador para não sobrepor conteúdo */}
      <div className="navbar-spacer"></div>

    </>
  );
};

export default AgroisyncHeader;