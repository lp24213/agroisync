import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Globe, 
  User, 
  UserPlus, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';

const AgroisyncHeader = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');

  // Menu original do AGROISYNC
  const navigationItems = [
    { path: '/', label: 'Início' },
    { path: '/marketplace', label: 'Loja' },
    { path: '/agroconecta', label: 'AgroConecta' },
    { path: '/crypto', label: 'Cripto' },
    { path: '/about', label: 'Sobre' },
    { path: '/store', label: 'Marketplace' }
  ];

  // Idiomas disponíveis
  const languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'es', name: 'ES', flag: '🇪🇸' },
    { code: 'zh', name: 'ZH', flag: '🇨🇳' }
  ];

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    // Aqui você pode implementar a lógica de mudança de idioma
    console.log('Mudando idioma para:', langCode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

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
                <a href="#" className="agro-social-link">📧</a>
                <a href="#" className="agro-social-link">📱</a>
                <a href="#" className="agro-social-link">💼</a>
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
            <nav className="agro-main-menu">
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

            {/* Ações Direitas */}
            <div className="agro-action-icons">
              {/* Troca de Idioma */}
              <div className="agro-language-selector">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`agro-lang-btn ${currentLanguage === lang.code ? 'active' : ''}`}
                    title={lang.name}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>

              {/* Login/Cadastro */}
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
              <button className="agro-chatbot-btn" title="Chatbot AGROISYNC">
                <MessageCircle size={20} />
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
      </header>

      <style jsx>{`
        .agro-top-bar {
          background: var(--agro-dark-green);
          padding: 8px 0;
          font-size: 14px;
        }

        .agro-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .agro-top-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .agro-top-text {
          color: var(--agro-light-gray);
        }

        .agro-social-links {
          display: flex;
          gap: 12px;
        }

        .agro-social-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .agro-social-link:hover {
          color: var(--agro-green-accent);
        }

        .agro-main-navbar {
          background: var(--agro-dark-green);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .agro-nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          font-family: var(--agro-font-secondary);
          color: white;
          line-height: 1;
        }

        .agro-logo-tagline {
          font-size: 12px;
          color: var(--agro-light-gray);
          font-weight: 400;
          margin-top: 2px;
        }

        .agro-main-menu {
          flex: 1;
          display: flex;
          justify-content: center;
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
          color: var(--agro-light-gray);
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          padding: 8px 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .agro-nav-link:hover,
        .agro-nav-link.active {
          color: var(--agro-green-accent);
        }

        .agro-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--agro-green-accent);
          transition: width 0.3s ease;
        }

        .agro-nav-link:hover::after,
        .agro-nav-link.active::after {
          width: 100%;
        }

        .agro-action-icons {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .agro-language-selector {
          display: flex;
          gap: 8px;
        }

        .agro-lang-btn {
          background: none;
          border: none;
          color: var(--agro-light-gray);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .agro-lang-btn:hover,
        .agro-lang-btn.active {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
        }

        .agro-auth-buttons {
          display: flex;
          gap: 12px;
        }

        .agro-login-btn,
        .agro-register-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .agro-login-btn {
          color: var(--agro-light-gray);
          border: 1px solid var(--agro-light-gray);
        }

        .agro-login-btn:hover {
          background: var(--agro-light-gray);
          color: var(--agro-dark-green);
        }

        .agro-register-btn {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
        }

        .agro-register-btn:hover {
          background: #2dd42d;
        }

        .agro-chatbot-btn {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .agro-chatbot-btn:hover {
          background: #2dd42d;
          transform: scale(1.1);
        }

        .agro-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--agro-light-gray);
          cursor: pointer;
        }

        .agro-mobile-menu {
          background: var(--agro-dark-green);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .agro-mobile-menu-content {
          padding: 20px;
        }

        .agro-mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .agro-mobile-menu-item {
          margin-bottom: 16px;
        }

        .agro-mobile-nav-link {
          color: var(--agro-light-gray);
          text-decoration: none;
          font-size: 18px;
          font-weight: 500;
          display: block;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .agro-mobile-nav-link.active {
          color: var(--agro-green-accent);
        }

        .agro-mobile-auth {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 16px;
        }

        .agro-mobile-login,
        .agro-mobile-register {
          color: var(--agro-light-gray);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 500;
        }

        .agro-mobile-register {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
        }

        .agro-user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agro-user-name {
          color: var(--agro-light-gray);
          font-weight: 500;
        }

        .agro-logout-btn {
          background: none;
          border: 1px solid var(--agro-light-gray);
          color: var(--agro-light-gray);
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .agro-logout-btn:hover {
          background: var(--agro-light-gray);
          color: var(--agro-dark-green);
        }

        @media (max-width: 768px) {
          .agro-main-menu {
            display: none;
          }

          .agro-mobile-menu-btn {
            display: block;
          }

          .agro-language-selector {
            display: none;
          }

          .agro-auth-buttons {
            display: none;
          }

          .agro-chatbot-btn {
            display: none;
          }

          .agro-menu-list {
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .agro-container {
            padding: 0 16px;
          }

          .agro-logo-main {
            font-size: 24px;
          }

          .agro-action-icons {
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default AgroisyncHeader;
