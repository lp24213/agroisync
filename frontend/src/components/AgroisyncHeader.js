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
  Moon
} from 'lucide-react';

const AgroisyncHeader = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Menu principal
  const navigationItems = [
    { path: '/', label: t('nav.inicio') },
    { path: '/loja', label: t('nav.loja') },
    { path: '/agroconecta', label: t('nav.agroconecta') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/tecnologia', label: t('nav.tecnologia') },
    { path: '/partnerships', label: t('nav.parcerias') }
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
      <nav className="agro-navbar">
        <div className="agro-navbar-container">
          {/* Logo - Esquerda */}
          <div className="agro-logo">
            <Link to="/" className="agro-logo-link">
              <div className="agro-logo-content">
                <span className="agro-logo-text">AGROISYNC</span>
                <span className="agro-logo-tagline">{t('nav.tagline')}</span>
              </div>
            </Link>
          </div>

          {/* Menu Principal - Centro (Desktop) */}
          <ul className="agro-main-menu">
            {navigationItems.map((item) => (
              <li key={item.path} className="agro-menu-item">
                <Link
                  to={item.path}
                  className={`agro-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Ações - Direita */}
          <div className="agro-nav-actions">
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
                        {item.label}
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
      <div className="agro-navbar-spacer"></div>

      <style jsx>{`
        .agro-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: var(--agro-navbar-bg);
          border-bottom: 1px solid var(--agro-border-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .agro-navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 70px;
        }

        .agro-logo {
          flex: 0 0 auto;
        }

        .agro-logo-link {
          text-decoration: none;
          color: inherit;
        }

        .agro-logo-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .agro-logo-text {
          font-size: 24px;
          font-weight: 900;
          color: var(--agro-primary-color);
          line-height: 1;
          text-shadow: 0 0 10px var(--agro-primary-glow);
        }

        .agro-logo-tagline {
          font-size: 12px;
          color: var(--agro-secondary-color);
          font-weight: 500;
          margin-top: 2px;
        }

        .agro-main-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 40px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .agro-menu-item {
          position: relative;
        }

        .agro-nav-link {
          color: var(--agro-text-color);
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .agro-nav-link:hover {
          color: var(--agro-primary-color);
          background: var(--agro-hover-bg);
          transform: translateY(-2px);
        }

        .agro-nav-link.active {
          color: var(--agro-primary-color);
          background: var(--agro-active-bg);
        }

        .agro-nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--agro-primary-color);
          transition: width 0.3s ease;
          box-shadow: 0 0 8px var(--agro-primary-glow);
        }

        .agro-nav-link:hover::after,
        .agro-nav-link.active::after {
          width: 80%;
        }

        .agro-nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 0 0 auto;
        }

        .agro-language-container {
          position: relative;
        }

        .agro-language-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .agro-language-btn:hover {
          background: var(--agro-hover-bg);
          border-color: var(--agro-primary-color);
          transform: translateY(-1px);
        }

        .agro-lang-text {
          font-weight: 500;
        }

        .agro-chevron {
          transition: transform 0.3s ease;
        }

        .agro-chevron.open {
          transform: rotate(180deg);
        }

        .agro-language-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--agro-dropdown-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          padding: 8px 0;
          min-width: 180px;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .agro-lang-option {
          background: none;
          border: none;
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 12px 16px;
          width: 100%;
          text-align: left;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .agro-lang-option:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .agro-lang-option.active {
          background: var(--agro-active-bg);
          color: var(--agro-primary-color);
        }

        .agro-lang-flag {
          font-size: 18px;
        }

        .agro-lang-name {
          font-weight: 500;
        }

        .agro-theme-toggle {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .agro-theme-toggle:hover {
          background: var(--agro-hover-bg);
          border-color: var(--agro-primary-color);
          color: var(--agro-primary-color);
          transform: translateY(-1px);
        }

        .agro-auth-buttons {
          display: flex;
          gap: 12px;
        }

        .agro-login-btn,
        .agro-register-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .agro-login-btn:hover,
        .agro-register-btn:hover {
          background: var(--agro-hover-bg);
          border-color: var(--agro-primary-color);
          color: var(--agro-primary-color);
          transform: translateY(-1px);
        }

        .agro-register-btn {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border-color: var(--agro-primary-color);
        }

        .agro-register-btn:hover {
          background: var(--agro-primary-hover);
          color: var(--agro-primary-text);
        }

        .agro-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .agro-mobile-toggle:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .agro-navbar-spacer {
          height: 110px;
        }

        .agro-mobile-menu {
          background: var(--agro-dropdown-bg);
          border-top: 1px solid var(--agro-border-color);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .agro-mobile-content {
          padding: 20px;
        }

        .agro-mobile-nav {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .agro-mobile-item {
          margin-bottom: 8px;
        }

        .agro-mobile-link {
          color: var(--agro-text-color);
          text-decoration: none;
          padding: 12px 16px;
          display: block;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .agro-mobile-link:hover,
        .agro-mobile-link.active {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .agro-mobile-languages {
          margin-bottom: 20px;
        }

        .agro-mobile-section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--agro-text-color);
          margin-bottom: 12px;
        }

        .agro-mobile-lang-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .agro-mobile-lang-btn {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }

        .agro-mobile-lang-btn:hover,
        .agro-mobile-lang-btn.active {
          background: var(--agro-hover-bg);
          border-color: var(--agro-primary-color);
          color: var(--agro-primary-color);
        }

        .agro-mobile-lang-flag {
          font-size: 16px;
        }

        .agro-mobile-lang-name {
          font-weight: 500;
        }

        .agro-mobile-auth {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .agro-mobile-login,
        .agro-mobile-register {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          flex: 1;
          text-align: center;
        }

        .agro-mobile-login:hover,
        .agro-mobile-register:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-primary-color);
        }

        .agro-mobile-register {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border-color: var(--agro-primary-color);
        }

        .agro-mobile-register:hover {
          background: var(--agro-primary-hover);
          color: var(--agro-primary-text);
        }

        .agro-user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agro-user-name {
          color: var(--agro-text-color);
          font-size: 14px;
          font-weight: 500;
        }

        .agro-logout-btn {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ff3b30;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .agro-logout-btn:hover {
          background: rgba(255, 59, 48, 0.2);
          border-color: #ff3b30;
        }

        .agro-mobile-user {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 8px;
        }

        .agro-mobile-user span {
          color: var(--agro-text-color);
          font-weight: 500;
        }

        .agro-mobile-user button {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ff3b30;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .agro-main-menu {
            gap: 30px;
          }
          
          .agro-nav-link {
            font-size: 15px;
            padding: 10px 14px;
          }
        }

        @media (max-width: 768px) {
          .agro-navbar-container {
            padding: 0 16px;
          }

          .agro-main-menu {
            display: none;
          }

          .agro-mobile-toggle {
            display: block;
          }

          .agro-nav-actions {
            gap: 12px;
          }

          .agro-auth-buttons {
            display: none;
          }

          .agro-language-btn {
            padding: 6px 10px;
            font-size: 13px;
          }

          .agro-lang-text {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .agro-logo-text {
            font-size: 20px;
          }

          .agro-logo-tagline {
            font-size: 11px;
          }

          .agro-nav-actions {
            gap: 8px;
          }

          .agro-language-btn {
            padding: 6px 8px;
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncHeader;