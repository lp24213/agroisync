import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Menu,
  X,
  Home,
  ShoppingCart,
  Truck,
  Store,
  Zap,
  Users
} from 'lucide-react';


const AgroisyncHeader = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);

  // Menu principal com ícones profissionais
  const navigationItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/loja', label: 'Loja', icon: ShoppingCart },
    { path: '/agroconecta', label: 'AgroConecta', icon: Truck },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/tecnologia', label: 'Tecnologia', icon: Zap },
    { path: '/partnerships', label: 'Parcerias', icon: Users }
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
    
    setCurrentLanguage(savedLanguage);
    
    // Aplicar tema fixo dark
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Aplicar idioma
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  // Efeito de scroll para navbar e detecção de hero
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detectar se está sobre hero/banner
      const heroElement = document.querySelector('[data-hero="true"]');
      if (heroElement) {
        const heroRect = heroElement.getBoundingClientRect();
        setIsOverHero(heroRect.top <= 72 && heroRect.bottom > 72);
      } else {
        setIsOverHero(false);
      }
    };

    // Verificar estado inicial
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setIsLanguageMenuOpen(false);
    localStorage.setItem('agroisync-language', langCode);
    i18n.changeLanguage(langCode);
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
      {/* Navbar Principal Premium */}
      <nav className={`premium-header ${isScrolled ? 'premium-header-scrolled' : ''}`}>
        <div className="premium-header-container">
          {/* Logo - Esquerda */}
          <div className="premium-header-logo">
            <Link to="/" className="premium-header-logo-link">
              <img src="/agroisync-logo.svg" alt="Agroisync" className="premium-header-logo-img" />
            </Link>
          </div>

          {/* Menu Principal - Centro (Desktop) */}
          <ul className="premium-header-menu">
            {navigationItems.map((item) => (
              <li key={item.path} className="premium-header-item">
                <Link
                  to={item.path}
                  className={`premium-header-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Ações - Direita */}
          <div className="premium-header-actions">
            {/* Menu de Idiomas */}
            <div className="premium-language-selector">
              <button 
                className="premium-language-btn"
                onClick={toggleLanguageMenu}
                aria-label={t('nav.selectLanguage')}
                aria-expanded={isLanguageMenuOpen}
              >
                <span className="premium-lang-text">{currentLanguage.toUpperCase()} ▼</span>
              </button>
              
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="premium-language-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`premium-lang-option ${currentLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="premium-lang-flag">{lang.flag}</span>
                        <span className="premium-lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botões de Auth */}
            <div className="premium-auth-buttons">
              {user ? (
                <div className="premium-user-menu">
                  <span className="premium-user-name">{user.name}</span>
                  <button onClick={logout} className="btn-premium-secondary">
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-premium-secondary">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn-premium-primary">
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>

            {/* Botão Mobile */}
            <button
              className="premium-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label={t('nav.toggleMenu')}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Premium */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="premium-mobile-menu"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="premium-mobile-content">
                {/* Menu Principal Mobile */}
                <ul className="premium-mobile-nav">
                  {navigationItems.map((item, index) => (
                    <motion.li 
                      key={item.path} 
                      className="premium-mobile-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`premium-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="premium-mobile-text">{item.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Idiomas Mobile */}
                <div className="premium-mobile-languages">
                  <h4 className="premium-mobile-section-title">{t('nav.languages')}</h4>
                  <div className="premium-mobile-lang-grid">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`premium-mobile-lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="premium-mobile-lang-flag">{lang.flag}</span>
                        <span className="premium-mobile-lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Auth Mobile */}
                <div className="premium-mobile-auth">
                  {user ? (
                    <div className="premium-mobile-user">
                      <span>{user.name}</span>
                      <button onClick={logout} className="btn-premium-secondary">
                        {t('nav.logout')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="btn-premium-secondary">
                        {t('nav.login')}
                      </Link>
                      <Link to="/register" className="btn-premium-primary">
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
      <div className="premium-header-spacer"></div>

    </>
  );
};

export default AgroisyncHeader;