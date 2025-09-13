import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const TXCHeader = () => {
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
        className={`txc-header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="txc-container">
          <div className="txc-header-content">
            {/* Logo */}
            <motion.div
              className="txc-logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="txc-logo-link">
                <img
                  src="/agroisync-main-logo.png"
                  alt="AGROISYNC"
                  className="txc-logo-img"
                />
                <span className="txc-logo-text">AGROISYNC</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="txc-nav-desktop">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Link
                    to={item.path}
                    className={`txc-nav-link ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="txc-header-actions">
              <LanguageSelector />
              <ThemeToggle />
              
              {user ? (
                <div className="txc-user-menu">
                  <motion.div
                    className="txc-user-avatar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      className="txc-avatar-img"
                    />
                  </motion.div>
                  
                  <motion.button
                    className="txc-btn txc-btn-ghost"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('auth.logout')}
                  </motion.button>
                </div>
              ) : (
                <div className="txc-auth-buttons">
                  <Link to="/login" className="txc-btn txc-btn-ghost">
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className="txc-btn txc-btn-primary">
                    {t('auth.register')}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                className="txc-mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className={`txc-hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="txc-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="txc-mobile-nav">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`txc-mobile-nav-link ${
                        location.pathname === item.path ? 'active' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {!user && (
                  <motion.div
                    className="txc-mobile-auth"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="txc-btn txc-btn-ghost txc-btn-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="txc-btn txc-btn-primary txc-btn-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('auth.register')}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <style jsx>{`
        .txc-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--txc-z-fixed);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: all var(--txc-transition-normal);
        }

        .txc-header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px);
          box-shadow: var(--txc-shadow-lg);
        }

        [data-theme="dark"] .txc-header {
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .txc-header.scrolled {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(30px);
        }

        .txc-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--txc-space-md) 0;
          height: 80px;
        }

        .txc-logo-link {
          display: flex;
          align-items: center;
          gap: var(--txc-space-sm);
          text-decoration: none;
          color: var(--txc-petroleum);
        }

        .txc-logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .txc-logo-text {
          font-size: var(--txc-text-xl);
          font-weight: var(--txc-font-bold);
          background: var(--txc-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .txc-nav-desktop {
          display: flex;
          align-items: center;
          gap: var(--txc-space-lg);
        }

        .txc-nav-link {
          padding: var(--txc-space-sm) var(--txc-space-md);
          border-radius: var(--txc-radius-md);
          font-weight: var(--txc-font-medium);
          color: var(--txc-gray-600);
          text-decoration: none;
          transition: all var(--txc-transition-fast);
          position: relative;
        }

        .txc-nav-link:hover {
          color: var(--txc-teal);
          background: rgba(86, 184, 185, 0.1);
        }

        .txc-nav-link.active {
          color: var(--txc-teal);
          background: rgba(86, 184, 185, 0.1);
        }

        .txc-header-actions {
          display: flex;
          align-items: center;
          gap: var(--txc-space-md);
        }

        .txc-user-menu {
          display: flex;
          align-items: center;
          gap: var(--txc-space-sm);
        }

        .txc-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--txc-teal);
        }

        .txc-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .txc-auth-buttons {
          display: flex;
          align-items: center;
          gap: var(--txc-space-sm);
        }

        .txc-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--txc-space-sm);
        }

        .txc-hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 24px;
          height: 18px;
        }

        .txc-hamburger span {
          width: 100%;
          height: 2px;
          background: var(--txc-petroleum);
          transition: all var(--txc-transition-fast);
          border-radius: 1px;
        }

        .txc-hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .txc-hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .txc-hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .txc-mobile-menu {
          background: var(--txc-white);
          border-top: 1px solid var(--txc-gray-200);
          overflow: hidden;
        }

        [data-theme="dark"] .txc-mobile-menu {
          background: var(--txc-gray-800);
          border-top: 1px solid var(--txc-gray-700);
        }

        .txc-mobile-nav {
          padding: var(--txc-space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--txc-space-md);
        }

        .txc-mobile-nav-link {
          padding: var(--txc-space-md);
          border-radius: var(--txc-radius-md);
          font-weight: var(--txc-font-medium);
          color: var(--txc-gray-600);
          text-decoration: none;
          transition: all var(--txc-transition-fast);
        }

        .txc-mobile-nav-link:hover,
        .txc-mobile-nav-link.active {
          color: var(--txc-teal);
          background: rgba(86, 184, 185, 0.1);
        }

        .txc-mobile-auth {
          display: flex;
          flex-direction: column;
          gap: var(--txc-space-sm);
          margin-top: var(--txc-space-md);
          padding-top: var(--txc-space-md);
          border-top: 1px solid var(--txc-gray-200);
        }

        [data-theme="dark"] .txc-mobile-auth {
          border-top: 1px solid var(--txc-gray-700);
        }

        .txc-btn-full {
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .txc-nav-desktop {
            display: none;
          }

          .txc-mobile-menu-btn {
            display: block;
          }

          .txc-header-actions {
            gap: var(--txc-space-sm);
          }

          .txc-auth-buttons {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .txc-header-content {
            padding: var(--txc-space-sm) 0;
            height: 70px;
          }

          .txc-logo-text {
            font-size: var(--txc-text-lg);
          }

          .txc-logo-img {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
};

export default TXCHeader;
