import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelectorPro from './LanguageSelectorPro';
import AgroisyncLogo from './AgroisyncLogo';
import { Menu, X, Home, ShoppingCart, Truck, LogIn, LogOut, User, Users, Info, Coins, Crown } from 'lucide-react';

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
    { path: '/frete', label: 'Frete', icon: Truck },
    { path: '/produtos', label: 'Produtos', icon: ShoppingCart },
    { path: '/tecnologia', label: 'Crypto', icon: Coins },
    { path: '/partnerships', label: 'Parcerias', icon: Users },
    { path: '/sobre', label: 'Sobre', icon: Info },
    { path: '/planos', label: 'Planos', icon: Crown }
  ];

  // Submenus (desktop)
  const submenuItems = {
    '/produtos': [
      { path: '/produtos', label: 'Produtos' },
      { path: '/produtos/categories', label: 'Categorias' },
      { path: '/produtos/sellers', label: 'Vendedores' },
      { path: '/produtos/sell', label: 'Como Vender' }
    ],
    '/frete': [
      { path: '/frete', label: 'Buscar Frete' },
      { path: '/frete/offer', label: 'Oferecer Frete' },
      { path: '/frete/carriers', label: 'Transportadores' },
      { path: '/frete/tracking', label: 'Rastreamento' }
    ],
    '/partnerships': [
      { path: '/partnerships', label: 'Seja Parceiro' },
      { path: '/partnerships/current', label: 'Parceiros Atuais' },
      { path: '/partnerships/benefits', label: 'Benefícios' },
      { path: '/partnerships/contact', label: 'Contato Comercial' }
    ]
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
    { path: '/signup', label: 'Cadastrar', icon: User }
  ];

  return (
    <>
      <header
        id='main-header'
        className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-200 ${
          isScrolled ? 'border-gray-200/70 bg-white/95 shadow-md' : 'border-gray-200/50 bg-white/90 shadow-sm'
        }`}
      >
        <div className='mx-auto max-w-7xl px-4'>
          <div className='flex h-16 flex-wrap items-center justify-between md:flex-nowrap'>
            {/* Logo */}
            <Link to='/' className='flex items-center'>
              <AgroisyncLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav id='main-nav' className='hidden items-center space-x-1 md:flex'>
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const children = submenuItems[item.path];
                return (
                  <div key={item.path} className={`group relative`}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {t ? t(`nav.${item.label.toLowerCase()}`, item.label) : item.label}
                    </Link>
                    {children && children.length > 0 && (
                      <div className='absolute left-0 z-50 mt-2 hidden min-w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block'>
                        <ul className='py-2'>
                          {children.map(sub => (
                            <li key={sub.path}>
                              <Link
                                to={sub.path}
                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700'
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
              <div className='hidden items-center gap-3 md:flex'>
                <Link
                  to='/user-dashboard'
                  className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                >
                  <User className='h-4 w-4' />
                  Meu Painel
                </Link>
                <Link
                  to='/messaging'
                  className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                >
                  <Users className='h-4 w-4' />
                  Mensagens
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600'
                >
                  <LogOut className='h-4 w-4' />
                  Sair
                </button>
              </div>
            ) : null}

            {/* Desktop Actions */}
            <div className='hidden items-center gap-4 md:flex'>
              {/* Language Selector */}
              <div className='lang-selector premium-language-selector-desktop'>
                <LanguageSelectorPro />
              </div>

              {/* Auth Buttons */}
              {user && (
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-medium text-gray-700'>Olá, {user.name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600'
                  >
                    <LogOut className='h-4 w-4' />
                    Sair
                  </button>
                </div>
              )}
              {!user && (
                <div className='flex items-center gap-2'>
                  <Link
                    to='/login'
                    className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                  >
                    <LogIn className='h-4 w-4' />
                    Entrar
                  </Link>
                  <Link
                    to='/signup'
                    className='flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition-all duration-200 hover:bg-green-700 hover:shadow-md'
                  >
                    <User className='h-4 w-4' />
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button + Acesso rápido (login/register só no drawer) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='rounded-lg p-2.5 text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600 md:hidden'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-gray-200/50 bg-white/95 shadow-lg backdrop-blur-md md:hidden'>
            <div className='space-y-2 px-6 py-4'>
              {mobileNavigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-sm'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {t ? t(`nav.${item.label.toLowerCase()}`, item.label) : item.label}
                  </Link>
                );
              })}

              {/* Subitens no mobile */}
              <div className='border-t border-gray-200/60 pt-2' />
              {['/marketplace', '/agroconecta', '/partnerships'].map(parent => (
                <div key={parent} className=''>
                  <div className='px-4 py-2 text-xs font-semibold text-gray-500'>
                    {parent === '/marketplace'
                      ? 'Marketplace'
                      : parent === '/agroconecta'
                        ? 'AgroConecta'
                        : 'Parcerias'}
                  </div>
                  {(submenuItems[parent] || []).map(sub => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className='block rounded px-6 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700'
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Mobile Language Selector */}
              <div className='lang-selector border-t border-gray-200/50 px-4 py-3'>
                <LanguageSelectorPro />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className='h-16'></div>
    </>
  );
};

export default AgroisyncHeader;
