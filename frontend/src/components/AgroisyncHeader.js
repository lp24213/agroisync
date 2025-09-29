import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelectorPro from './LanguageSelectorPro';
import AgroisyncLogo from './AgroisyncLogo';
import { 
  Menu,
  X,
  Home,
  ShoppingCart,
  Truck,
  LogIn,
  LogOut,
  User,
  Users,
  Info,
  Coins,
  Crown
} from 'lucide-react';

const AgroisyncHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/loja', label: 'Loja', icon: ShoppingCart },
    { path: '/agroconecta', label: 'Frete', icon: Truck },
    { path: '/marketplace', label: 'Produtos', icon: ShoppingCart },
    { path: '/tecnologia', label: 'Crypto', icon: Coins },
    { path: '/partnerships', label: 'Parcerias', icon: Users },
    { path: '/sobre', label: 'Sobre', icon: Info },
    { path: '/planos', label: 'Planos', icon: Crown },
  ];

  // Submenus (desktop)
  const submenuItems = {
    '/marketplace': [
      { path: '/marketplace', label: 'Produtos' },
      { path: '/marketplace/categories', label: 'Categorias' },
      { path: '/marketplace/sellers', label: 'Vendedores' },
      { path: '/marketplace/sell', label: 'Como Vender' },
    ],
    '/agroconecta': [
      { path: '/agroconecta', label: 'Buscar Frete' },
      { path: '/agroconecta/offer', label: 'Oferecer Frete' },
      { path: '/agroconecta/carriers', label: 'Transportadores' },
      { path: '/agroconecta/tracking', label: 'Rastreamento' },
    ],
    '/partnerships': [
      { path: '/partnerships', label: 'Seja Parceiro' },
      { path: '/partnerships/current', label: 'Parceiros Atuais' },
      { path: '/partnerships/benefits', label: 'Benefícios' },
      { path: '/partnerships/contact', label: 'Contato Comercial' },
    ],
  };

  const mobileNavigationItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/loja', label: 'Loja', icon: ShoppingCart },
    { path: '/agroconecta', label: 'Frete', icon: Truck },
    { path: '/marketplace', label: 'Produtos', icon: ShoppingCart },
    { path: '/tecnologia', label: 'Crypto', icon: Coins },
    { path: '/partnerships', label: 'Parcerias', icon: Users },
    { path: '/sobre', label: 'Sobre', icon: Info },
    { path: '/planos', label: 'Planos', icon: Crown },
    { path: '/login', label: 'Entrar', icon: LogIn },
    { path: '/signup', label: 'Cadastrar', icon: User },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`backdrop-blur-md border-b fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled ? 'bg-white/95 border-gray-200/70 shadow-md' : 'bg-white/90 border-gray-200/50 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 flex-wrap md:flex-nowrap">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <AgroisyncLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav id="main-nav" className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const children = submenuItems[item.path];
                return (
                  <div key={item.path} className={`relative group`}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50 hover:shadow-sm'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t ? t(`nav.${item.label.toLowerCase()}`, item.label) : item.label}
                    </Link>
                    {children && children.length > 0 && (
                      <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg min-w-[220px] z-50">
                        <ul className="py-2">
                          {children.map((sub) => (
                            <li key={sub.path}>
                              <Link
                                to={sub.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* User Menu - Apenas para usuários logados */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/user-dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Meu Painel
                </Link>
                <Link
                  to="/messaging"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  Mensagens
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : null}


            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selector */}
              <div className="lang-selector premium-language-selector-desktop">
                <LanguageSelectorPro />
              </div>

              {/* Auth Buttons */}
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-medium">
                    Olá, {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 hover:shadow-md transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button + Acesso rápido (login/register só no drawer) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
              {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
            <div className="px-6 py-4 space-y-2">
              {mobileNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50 hover:shadow-sm'
                    }`}
                  >
                          <Icon className="w-4 h-4" />
                          {t ? t(`nav.${item.label.toLowerCase()}`, item.label) : item.label}
                  </Link>
                );
              })}

              {/* Subitens no mobile */}
              <div className="pt-2 border-t border-gray-200/60" />
              {[ '/marketplace', '/agroconecta', '/partnerships' ].map((parent) => (
                <div key={parent} className="">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                    {parent === '/marketplace' ? 'Marketplace' : parent === '/agroconecta' ? 'AgroConecta' : 'Parcerias'}
                  </div>
                  {(submenuItems[parent] || []).map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="lang-selector px-4 py-3 border-t border-gray-200/50">
                <LanguageSelectorPro />
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default AgroisyncHeader;