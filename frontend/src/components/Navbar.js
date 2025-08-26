import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTranslation } from 'react-i18next';
import { 
  Menu, X, Sun, Moon, User, LogOut, Settings, 
  ShoppingCart, Truck, Coins, BarChart3, Globe,
  ChevronDown, Bell, Search, Package, MessageSquare, Leaf, CheckCircle, DollarSign, Shield
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLanguageMenu(false);
  };

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const navigation = [
    { name: 'Home', href: '/', icon: <Leaf className="w-4 h-4" /> },
    { name: 'Loja', href: '/loja', icon: <Package className="w-4 h-4" /> },
    { name: 'AgroConecta', href: '/agroconecta', icon: <Truck className="w-4 h-4" /> },
    { name: 'Planos', href: '/planos', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Cripto', href: '/cripto', icon: <Coins className="w-4 h-4" /> },
    { name: 'Sobre', href: '/sobre', icon: <Globe className="w-4 h-4" /> },
    { name: 'Contato', href: '/contato', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-slate-200' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">AgroSync</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActiveRoute(item.href)
                      ? 'text-slate-800 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showLanguageMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card border border-slate-200 py-2 z-50"
                    >
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => changeLanguage(language.code)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors duration-200 ${
                            i18n.language === language.code ? 'text-slate-800 bg-slate-50' : 'text-slate-600'
                          }`}
                        >
                          <span className="mr-2">{language.flag}</span>
                          {language.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="hidden sm:block">{user.name || user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-slate-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-800">{user.name || user.email}</p>
                          <p className="text-xs text-slate-600">{user.email}</p>
                          {isPaid && (
                            <div className="flex items-center mt-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                              <span className="text-xs text-emerald-600 font-medium">Plano Ativo</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="py-2">
                          <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                            <BarChart3 className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                          
                          {isPaid && (
                            <Link to="/mensageria" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                              <MessageSquare className="w-4 h-4 mr-3" />
                              Mensageria
                            </Link>
                          )}
                          
                          {isAdmin && (
                            <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                              <Shield className="w-4 h-4 mr-3" />
                              Admin
                            </Link>
                          )}
                          
                          <Link to="/ajuda" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Ajuda
                          </Link>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sair
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/cadastro"
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActiveRoute(item.href)
                        ? 'text-slate-800 bg-slate-100'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {!user && (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-3 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/cadastro"
                      className="block px-3 py-3 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Cadastrar
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
