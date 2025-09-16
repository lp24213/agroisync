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
  Home,
  ShoppingCart,
  Truck,
  Store,
  Zap,
  Users
} from 'lucide-react';

// Ícone da planta Agroisync (baseado na imagem)
const AgroisyncIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Caule central */}
    <path d="M14 8L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    {/* Folha esquerda */}
    <path d="M14 12C10 10 8 8 6 6C4 8 6 10 8 12C10 14 12 12 14 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Folha direita */}
    <path d="M14 12C18 10 20 8 22 6C24 8 22 10 20 12C18 14 16 12 14 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Folha superior */}
    <path d="M14 8C12 6 10 4 8 2C10 4 12 6 14 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Semente superior */}
    <circle cx="14" cy="6" r="2" fill="currentColor"/>
  </svg>
);

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
      {/* Navbar Principal */}
      <nav className={`agro-header ${isOverHero ? 'agro-header-transparent' : ''} ${isScrolled ? 'agro-header-scrolled' : ''}`}>
        <div className="agro-header-container">
          {/* Logo - Esquerda */}
          <div className="agro-header-logo">
            <Link to="/" className="agro-header-logo-link">
              <img src="/assets/logo.png" alt="Agroisync" className="agro-header-logo-img" />
            </Link>
          </div>

          {/* Menu Principal - Centro (Desktop) */}
          <ul className="agro-header-menu">
            {navigationItems.map((item) => (
              <li key={item.path} className="agro-header-item">
                <Link
                  to={item.path}
                  className={`agro-header-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Ações - Direita */}
          <div className="agro-header-actions">
            {/* Menu de Idiomas */}
            <div className="agro-language-selector">
              <button 
                className="agro-language-btn"
                onClick={toggleLanguageMenu}
                aria-label={t('nav.selectLanguage')}
                aria-expanded={isLanguageMenuOpen}
              >
                <span className="agro-lang-text">{currentLanguage.toUpperCase()} ▼</span>
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
                        <span className="agro-lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="agro-register-btn">
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
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="agro-mobile-content">
                {/* Menu Principal Mobile */}
                <ul className="agro-mobile-nav">
                  {navigationItems.map((item, index) => (
                    <motion.li 
                      key={item.path} 
                      className="agro-mobile-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`agro-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="agro-mobile-text">{item.label}</span>
                      </Link>
                    </motion.li>
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
      <div className="agro-header-spacer"></div>

    </>
  );
};

export default AgroisyncHeader;