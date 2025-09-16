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
  Users,
  Sprout
} from 'lucide-react';

const AgroisyncHeader = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [isScrolled, setIsScrolled] = useState(false);

  // Menu principal com ícones profissionais
  const navigationItems = [
    { path: '/', label: t('nav.inicio'), icon: Home },
    { path: '/loja', label: t('nav.loja'), icon: ShoppingCart },
    { path: '/agroconecta', label: t('nav.agroconecta'), icon: Truck },
    { path: '/marketplace', label: t('nav.marketplace'), icon: Store },
    { path: '/tecnologia', label: t('nav.tecnologia'), icon: Zap },
    { path: '/partnerships', label: t('nav.parcerias'), icon: Users }
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

  // Efeito de scroll para navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo - Esquerda */}
          <div className="navbar-logo">
            <Link to="/" className="navbar-logo-link">
              <div className="navbar-logo-content">
                <div className="navbar-logo-icon">
                  <Sprout size={28} />
                </div>
                <div className="navbar-logo-text-container">
                  <span className="navbar-logo-text">AGROISYNC</span>
                  <span className="navbar-logo-tagline">{t('nav.tagline')}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Menu Principal - Centro (Desktop) */}
          <ul className="navbar-menu">
            {navigationItems.map((item) => (
              <motion.li 
                key={item.path} 
                className="navbar-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <motion.div
                    className="navbar-icon"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <span className="navbar-text">{item.label}</span>
                </Link>
              </motion.li>
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
                        <motion.span 
                          className="agro-mobile-icon"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <item.icon size={20} />
                        </motion.span>
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
      <div className="navbar-spacer"></div>

    </>
  );
};

export default AgroisyncHeader;