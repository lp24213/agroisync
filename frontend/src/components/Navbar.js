import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
    { name: 'Planos', href: '/plans' },
    { 
      name: 'Serviços', 
      href: '#',
      submenu: [
        { name: 'Loja Agroisync', href: '/loja' },
        { name: 'AgroConecta', href: '/agroconecta' },
        { name: 'Marketplace', href: '/marketplace' }
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="navbar-brand">
            AgroSync
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {item.submenu ? (
                <div
                  className="navbar-link flex items-center gap-1"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <span>{item.name}</span>
                  <ChevronDown size={16} />
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`navbar-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              )}

              {/* Submenu */}
              <AnimatePresence>
                {item.submenu && isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 card-futuristic z-50"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-gray-50 transition-colors rounded-lg mx-2"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="btn-futuristic btn-secondary btn-sm"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="btn-futuristic btn-primary btn-sm"
          >
            Cadastrar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="navbar-mobile-toggle"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden card-futuristic mx-4 mt-2"
          >
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div className="px-4 py-2">
                      <div className="font-semibold text-primary mb-2">{item.name}</div>
                      <div className="pl-4 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block py-1 text-sm text-secondary hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-4 py-2 font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-secondary hover:text-primary'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="px-4 py-2 border-t border-gray-200 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <ThemeToggle />
                </div>
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center py-2 text-sm font-medium btn-futuristic btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
