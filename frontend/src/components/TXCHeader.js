import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Pinterest, 
  Search, 
  User, 
  ShoppingCart,
  Menu,
  X
} from 'lucide-react';

const TXCHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const socialIcons = [
    { icon: Instagram, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Youtube, href: '#' },
    { icon: Pinterest, href: '#' },
  ];

  const menuItems = [
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'AgroConecta', path: '/agroconecta' },
    { label: 'Crypto', path: '/crypto' },
    { label: 'Plans', path: '/plans' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Top Bar TXC */}
      <div className="txc-top-bar">
        <div className="txc-top-bar-content">
          <div className="txc-social-icons">
            {socialIcons.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="txc-social-icon"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`${social.icon.name} social media`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
          <div className="txc-top-message">
            Frete grátis acima de R$499,00
          </div>
        </div>
      </div>

      {/* Main Navbar TXC */}
      <nav className="txc-main-navbar">
        <div className="txc-navbar-content">
          {/* Logo TXC */}
          <div className="txc-logo-section">
            <Link to="/" className="txc-logo">
              AGROISYNC
            </Link>
            <span className="txc-logo-tagline">
              Produzindo para quem Produz
            </span>
          </div>

          {/* Menu Central */}
          <div className="txc-main-menu">
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to={item.path}
                  className={`txc-menu-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Ícones da Navbar */}
          <div className="txc-navbar-icons">
            <motion.div
              className="txc-navbar-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Buscar"
            >
              <Search size={24} />
            </motion.div>
            
            <motion.div
              className="txc-navbar-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Minha Conta"
            >
              <User size={24} />
            </motion.div>
            
            <motion.div
              className="txc-navbar-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Carrinho"
            >
              <ShoppingCart size={24} />
            </motion.div>

            {/* Botão Menu Mobile */}
            <motion.button
              className="txc-navbar-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Menu"
              style={{ display: 'none' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Menu Mobile TXC */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="txc-mobile-menu"
            style={{
              background: 'var(--txc-white)',
              borderTop: '1px solid #E5E5E5',
              padding: 'var(--txc-space-lg)',
              display: 'none'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--txc-space-md)' }}>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="txc-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ padding: 'var(--txc-space-md)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* CSS Mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .txc-main-menu {
            display: none;
          }
          
          .txc-navbar-icons button[title="Menu"] {
            display: block !important;
          }
          
          .txc-mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

export default TXCHeader;