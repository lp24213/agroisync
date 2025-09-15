import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  UserPlus, 
  MessageCircle,
  Menu,
  X,
  Globe,
  ChevronDown
} from 'lucide-react';

const AgroisyncHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');

  // Menu exato solicitado
  const navigationItems = [
    { path: '/', label: 'Início' },
    { path: '/loja', label: 'Loja' },
    { path: '/agroconecta', label: 'AgroConecta' },
    { path: '/crypto', label: 'Cripto' },
    { path: '/about', label: 'Sobre' },
    { path: '/marketplace', label: 'Marketplace' }
  ];

  // Idiomas disponíveis
  const languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷', label: 'Português' },
    { code: 'en', name: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'es', name: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'zh', name: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setIsLanguageMenuOpen(false);
    // Aqui você pode implementar a lógica de mudança de idioma
    console.log('Mudando idioma para:', langCode);
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

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <>
      {/* Top Bar */}
      <div className="agro-top-bar">
        <div className="agro-container">
          <div className="agro-top-content">
            <div className="agro-top-left">
              <span className="agro-top-text">
                🌱 Conectando o agronegócio brasileiro
              </span>
            </div>
            <div className="agro-top-right">
              <div className="agro-social-links">
                <button className="agro-social-link">📧</button>
                <button className="agro-social-link">📱</button>
                <button className="agro-social-link">💼</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="agro-main-navbar">
        <div className="agro-container">
          <div className="agro-nav-content">
            {/* Logo */}
            <div className="agro-logo">
              <Link to="/" className="agro-logo-link">
                <div className="agro-logo-text">
                  <span className="agro-logo-main">AGROISYNC</span>
                  <span className="agro-logo-tagline">AgroTech Solutions</span>
                </div>
              </Link>
            </div>

            {/* Menu Central */}
            <nav className="agro-main-menu" role="navigation" aria-label="Menu principal">
              <ul className="agro-menu-list">
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
            </nav>

            {/* Action Icons */}
            <div className="agro-action-icons">
              {/* Language Selector */}
              <div className="agro-language-container">
                <button 
                  className="agro-language-btn"
                  onClick={toggleLanguageMenu}
                  aria-label="Selecionar idioma"
                  aria-expanded={isLanguageMenuOpen}
                >
                  <Globe size={18} />
                  <span className="agro-lang-code">{currentLang.name}</span>
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

              {/* Auth Buttons */}
              <div className="agro-auth-buttons">
                {user ? (
                  <div className="agro-user-menu">
                    <span className="agro-user-name">{user.name}</span>
                    <button onClick={logout} className="agro-logout-btn">
                      Sair
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="agro-login-btn">
                      <User size={18} />
                      Login
                    </Link>
                    <Link to="/register" className="agro-register-btn">
                      <UserPlus size={18} />
                      Cadastro
                    </Link>
                  </>
                )}
              </div>

              {/* Chatbot */}
              <button className="agro-chatbot-btn" aria-label="Abrir chatbot">
                <MessageCircle size={18} />
              </button>

              {/* Mobile Menu Button */}
              <button
                className="agro-mobile-menu-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="agro-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="agro-mobile-menu-content">
                <ul className="agro-mobile-menu-list">
                  {navigationItems.map((item) => (
                    <li key={item.path} className="agro-mobile-menu-item">
                      <Link
                        to={item.path}
                        className={`agro-mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="agro-mobile-auth">
                  {user ? (
                    <div className="agro-mobile-user">
                      <span>{user.name}</span>
                      <button onClick={logout}>Sair</button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="agro-mobile-login">
                        Login
                      </Link>
                      <Link to="/register" className="agro-mobile-register">
                        Cadastro
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style jsx>{`
        .agro-top-bar {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid rgba(57, 255, 20, 0.1);
        }

        .agro-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .agro-top-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .agro-top-text {
          color: #39FF14;
          font-weight: 500;
        }

        .agro-social-links {
          display: flex;
          gap: 12px;
        }

        .agro-social-link {
          background: none;
          border: none;
          color: #EDEDED;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .agro-social-link:hover {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.1);
        }

        .agro-main-navbar {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(57, 255, 20, 0.2);
        }

        .agro-nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 60px;
        }

        .agro-logo {
          position: absolute;
          left: 0;
          z-index: 10;
        }

        .agro-logo-link {
          text-decoration: none;
          color: white;
        }

        .agro-logo-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .agro-logo-main {
          font-size: 28px;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
          color: #39FF14;
          line-height: 1;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }

        .agro-logo-tagline {
          font-size: 12px;
          color: #EDEDED;
          font-weight: 400;
          margin-top: 2px;
        }

        .agro-main-menu {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
        }

        .agro-menu-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 40px;
        }

        .agro-menu-item {
          position: relative;
        }

        .agro-nav-link {
          color: #EDEDED;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          position: relative;
          border-radius: 6px;
          display: block;
        }

        .agro-nav-link:hover {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.1);
          transform: translateY(-2px);
        }

        .agro-nav-link.active {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.15);
        }

        .agro-nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #39FF14;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.6);
        }

        .agro-nav-link:hover::after,
        .agro-nav-link.active::after {
          width: 80%;
        }

        .agro-action-icons {
          display: flex;
          align-items: center;
          gap: 20px;
          position: absolute;
          right: 0;
          z-index: 10;
        }

        .agro-language-container {
          position: relative;
        }

        .agro-language-btn {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: #EDEDED;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .agro-language-btn:hover {
          background: rgba(57, 255, 20, 0.2);
          border-color: #39FF14;
          transform: translateY(-1px);
        }

        .agro-lang-code {
          font-weight: 600;
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
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          padding: 8px 0;
          min-width: 160px;
          z-index: 1001;
        }

        .agro-lang-option {
          background: none;
          border: none;
          color: #EDEDED;
          cursor: pointer;
          padding: 10px 16px;
          width: 100%;
          text-align: left;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .agro-lang-option:hover {
          background: rgba(57, 255, 20, 0.1);
          color: #39FF14;
        }

        .agro-lang-option.active {
          background: rgba(57, 255, 20, 0.15);
          color: #39FF14;
        }

        .agro-lang-flag {
          font-size: 16px;
        }

        .agro-lang-name {
          font-weight: 500;
        }

        .agro-auth-buttons {
          display: flex;
          gap: 12px;
        }

        .agro-login-btn,
        .agro-register-btn {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: #EDEDED;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .agro-login-btn:hover,
        .agro-register-btn:hover {
          background: rgba(57, 255, 20, 0.2);
          border-color: #39FF14;
          color: #39FF14;
          transform: translateY(-1px);
        }

        .agro-register-btn {
          background: #39FF14;
          color: #0a0a0a;
          border-color: #39FF14;
        }

        .agro-register-btn:hover {
          background: #2dd42d;
          color: #0a0a0a;
        }

        .agro-chatbot-btn {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: #39FF14;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .agro-chatbot-btn:hover {
          background: rgba(57, 255, 20, 0.2);
          border-color: #39FF14;
          transform: translateY(-1px);
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.4);
        }

        .agro-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #EDEDED;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .agro-mobile-menu-btn:hover {
          background: rgba(57, 255, 20, 0.1);
          color: #39FF14;
        }

        .agro-mobile-menu {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          border-top: 1px solid rgba(57, 255, 20, 0.2);
          overflow: hidden;
        }

        .agro-mobile-menu-content {
          padding: 20px;
        }

        .agro-mobile-menu-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .agro-mobile-menu-item {
          margin-bottom: 8px;
        }

        .agro-mobile-nav-link {
          color: #EDEDED;
          text-decoration: none;
          padding: 12px 16px;
          display: block;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .agro-mobile-nav-link:hover,
        .agro-mobile-nav-link.active {
          background: rgba(57, 255, 20, 0.1);
          color: #39FF14;
        }

        .agro-mobile-auth {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .agro-mobile-login,
        .agro-mobile-register {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: #EDEDED;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          flex: 1;
          text-align: center;
        }

        .agro-mobile-login:hover,
        .agro-mobile-register:hover {
          background: rgba(57, 255, 20, 0.2);
          color: #39FF14;
        }

        .agro-mobile-register {
          background: #39FF14;
          color: #0a0a0a;
          border-color: #39FF14;
        }

        .agro-mobile-register:hover {
          background: #2dd42d;
          color: #0a0a0a;
        }

        .agro-user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agro-user-name {
          color: #EDEDED;
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

        @media (max-width: 1024px) {
          .agro-menu-list {
            gap: 30px;
          }
          
          .agro-nav-link {
            font-size: 15px;
            padding: 10px 14px;
          }
        }

        @media (max-width: 768px) {
          .agro-container {
            padding: 0 16px;
          }

          .agro-main-menu {
            display: none;
          }

          .agro-mobile-menu-btn {
            display: block;
          }

          .agro-action-icons {
            gap: 12px;
          }

          .agro-auth-buttons {
            display: none;
          }

          .agro-language-btn {
            padding: 6px 10px;
            font-size: 13px;
          }

          .agro-chatbot-btn {
            padding: 6px;
          }
        }

        @media (max-width: 480px) {
          .agro-logo-main {
            font-size: 24px;
          }

          .agro-logo-tagline {
            font-size: 11px;
          }

          .agro-action-icons {
            gap: 8px;
          }

          .agro-language-btn {
            padding: 6px 8px;
          }

          .agro-language-btn span {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncHeader;