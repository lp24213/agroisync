import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
// import ThemeToggle from './ThemeToggle';

const PremiumHeader = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { path: '/', label: t('nav.home') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/agroconecta', label: t('nav.agroconecta') },
    { path: '/crypto', label: t('nav.crypto') },
    { path: '/plans', label: t('nav.plans') },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.header
        className={`premium-header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="premium-container">
          <div className="premium-header-content">
            {/* Logo Premium */}
            <motion.div
              className="premium-logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="premium-logo-link" aria-label="AGROISYNC - Página inicial">
                <img
                  src="/agroisync-main-logo.png"
                  alt="AGROISYNC"
                  className="premium-logo-img"
                />
                <span className="premium-logo-text">AGROISYNC</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation Premium */}
            <nav className="premium-nav-desktop" role="navigation" aria-label="Navegação principal">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    to={item.path}
                    className={`premium-nav-link ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Header Actions Premium */}
            <div className="premium-header-actions">
              <LanguageSelector />
              {/* <ThemeToggle /> */}
              
              {user ? (
                <div className="premium-user-menu">
                  <motion.div
                    className="premium-user-avatar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      className="premium-avatar-img"
                    />
                  </motion.div>
                  
                  <motion.button
                    className="premium-btn premium-btn-ghost premium-btn-sm"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('auth.logout')}
                  </motion.button>
                </div>
              ) : (
                <div className="premium-auth-buttons">
                  <Link to="/login" className="premium-btn premium-btn-ghost premium-btn-sm">
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className="premium-btn premium-btn-primary premium-btn-sm">
                    {t('auth.register')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button Premium */}
              <motion.button
                className="premium-mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <span className={`premium-hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Premium */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="premium-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <nav className="premium-mobile-nav" role="navigation" aria-label="Navegação móvel" id="mobile-navigation">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`premium-mobile-nav-link ${
                        location.pathname === item.path ? 'active' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={location.pathname === item.path ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {!user && (
                  <motion.div
                    className="premium-mobile-auth"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="premium-btn premium-btn-ghost premium-btn-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="premium-btn premium-btn-primary premium-btn-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('auth.register')}
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style jsx>{`
        .premium-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--premium-z-fixed);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all var(--premium-transition-normal);
        }

        .premium-header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px);
          box-shadow: var(--premium-shadow-lg);
          border-bottom: 1px solid rgba(86, 184, 185, 0.1);
        }

        [data-theme="dark"] .premium-header {
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .premium-header.scrolled {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(30px);
          border-bottom: 1px solid rgba(86, 184, 185, 0.1);
        }

        .premium-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--premium-space-lg) 0;
          height: 88px;
          position: relative;
        }

        .premium-logo-link {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          text-decoration: none;
          color: var(--premium-petroleum);
        }

        .premium-logo-img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 121, 155, 0.2));
        }

        .premium-logo-text {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-extrabold);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .premium-nav-desktop {
          display: flex;
          align-items: center;
          gap: var(--premium-space-xl);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .premium-nav-link {
          padding: var(--premium-space-md) var(--premium-space-lg);
          border-radius: var(--premium-radius-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-gray-600);
          text-decoration: none;
          transition: all var(--premium-transition-fast);
          position: relative;
          font-size: var(--premium-text-base);
          letter-spacing: 0.025em;
        }

        .premium-nav-link:hover {
          color: var(--premium-teal);
          background: rgba(86, 184, 185, 0.08);
          transform: translateY(-1px);
        }

        .premium-nav-link.active {
          color: var(--premium-teal);
          background: rgba(86, 184, 185, 0.12);
          font-weight: var(--premium-font-bold);
        }

        .premium-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--premium-gradient-accent);
          border-radius: var(--premium-radius-full);
        }

        .premium-header-actions {
          display: flex;
          align-items: center;
          gap: var(--premium-space-lg);
        }

        .premium-user-menu {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
        }

        .premium-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--premium-teal);
          box-shadow: var(--premium-shadow-teal);
        }

        .premium-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .premium-auth-buttons {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
        }

        .premium-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--premium-space-sm);
          border-radius: var(--premium-radius-md);
          transition: all var(--premium-transition-fast);
        }

        .premium-mobile-menu-btn:hover {
          background: rgba(86, 184, 185, 0.1);
        }

        .premium-hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 24px;
          height: 18px;
        }

        .premium-hamburger span {
          width: 100%;
          height: 2px;
          background: var(--premium-petroleum);
          transition: all var(--premium-transition-fast);
          border-radius: 1px;
        }

        .premium-hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .premium-hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .premium-hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .premium-mobile-menu {
          background: var(--premium-white);
          border-top: 1px solid var(--premium-gray-200);
          overflow: hidden;
          box-shadow: var(--premium-shadow-lg);
        }

        [data-theme="dark"] .premium-mobile-menu {
          background: var(--premium-gray-800);
          border-top: 1px solid var(--premium-gray-700);
        }

        .premium-mobile-nav {
          padding: var(--premium-space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-lg);
        }

        .premium-mobile-nav-link {
          padding: var(--premium-space-lg);
          border-radius: var(--premium-radius-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-gray-600);
          text-decoration: none;
          transition: all var(--premium-transition-fast);
          font-size: var(--premium-text-lg);
        }

        .premium-mobile-nav-link:hover,
        .premium-mobile-nav-link.active {
          color: var(--premium-teal);
          background: rgba(86, 184, 185, 0.1);
          transform: translateX(8px);
        }

        .premium-mobile-auth {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-md);
          margin-top: var(--premium-space-lg);
          padding-top: var(--premium-space-lg);
          border-top: 1px solid var(--premium-gray-200);
        }

        [data-theme="dark"] .premium-mobile-auth {
          border-top: 1px solid var(--premium-gray-700);
        }

        .premium-btn-full {
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .premium-nav-desktop {
            display: none;
          }

          .premium-mobile-menu-btn {
            display: block;
          }

          .premium-header-actions {
            gap: var(--premium-space-md);
          }

          .premium-auth-buttons {
            display: none;
          }

          .premium-header-content {
            height: 80px;
            padding: var(--premium-space-md) 0;
          }

          .premium-logo-img {
            width: 40px;
            height: 40px;
          }

          .premium-logo-text {
            font-size: var(--premium-text-xl);
          }
        }

        @media (max-width: 480px) {
          .premium-header-content {
            height: 72px;
            padding: var(--premium-space-sm) 0;
          }

          .premium-logo-text {
            font-size: var(--premium-text-lg);
          }

          .premium-logo-img {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default PremiumHeader;
