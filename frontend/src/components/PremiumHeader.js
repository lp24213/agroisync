import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { Menu, X, ShoppingCart, MessageCircle } from 'lucide-react';
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
        className="txc-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="txc-navbar-container">
          {/* Logo à esquerda */}
          <motion.div
            className="txc-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="txc-logo" aria-label="AGROISYNC - Página inicial">
              <img
                src="/agroisync-main-logo.png"
                alt="AGROISYNC"
              />
              <span className="txc-logo-text">AGROISYNC</span>
            </Link>
          </motion.div>

          {/* Menu centralizado */}
          <nav className="txc-nav-menu" role="navigation" aria-label="Navegação principal">
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
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Ícones à direita */}
          <div className="txc-nav-actions">
            <LanguageSelector />
            
            <motion.div
              className="txc-nav-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Carrinho"
            >
              <ShoppingCart size={20} />
            </motion.div>
            
            <motion.div
              className="txc-nav-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Chatbot"
            >
              <MessageCircle size={20} />
            </motion.div>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}>
                <motion.div
                  className="txc-nav-icon"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}
                >
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
                
                <motion.button
                  className="txc-btn-secondary"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: 'var(--txc-space-xs) var(--txc-space-sm)', fontSize: '0.8rem' }}
                >
                  {t('auth.logout')}
                </motion.button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-sm)' }}>
                <Link to="/login" className="txc-btn-secondary" style={{ padding: 'var(--txc-space-xs) var(--txc-space-sm)', fontSize: '0.8rem' }}>
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="txc-btn-primary" style={{ padding: 'var(--txc-space-xs) var(--txc-space-sm)', fontSize: '0.8rem' }}>
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Botão menu mobile */}
            <motion.button
              className="txc-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`txc-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <nav className="txc-mobile-nav" role="navigation" aria-label="Navegação móvel" id="mobile-navigation">
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
                      aria-current={location.pathname === item.path ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {!user && (
                  <motion.div
                    style={{ marginTop: 'var(--txc-space-lg)', paddingTop: 'var(--txc-space-lg)', borderTop: '1px solid rgba(57, 255, 20, 0.2)', display: 'flex', flexDirection: 'column', gap: 'var(--txc-space-sm)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/login"
                      className="txc-btn-secondary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ textAlign: 'center', padding: 'var(--txc-space-sm)' }}
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="txc-btn-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ textAlign: 'center', padding: 'var(--txc-space-sm)' }}
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

    </>
  );
};

export default PremiumHeader;
