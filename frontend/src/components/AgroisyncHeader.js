import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelectorPro from './LanguageSelectorPro';
import AgroisyncLogo from './AgroisyncLogo';
import { Menu, X, Home, ShoppingCart, Truck, LogIn, LogOut, User, Users, Info, Coins, Crown, LayoutDashboard, MessageSquare, Settings, ChevronDown } from 'lucide-react';

const AgroisyncHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Gera/garante os parâmetros criptográficos e retorna string de busca
  const getCryptoSearch = () => {
    try {
      let storedUsr = localStorage.getItem('agro_usr');
      let storedSess = sessionStorage.getItem('agro_sess');
      let storedZx = localStorage.getItem('agro_zx');
      let storedCr = localStorage.getItem('agro_cr');

      if (!storedUsr) {
        storedUsr = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem('agro_usr', storedUsr);
      }
      if (!storedSess) {
        storedSess = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        sessionStorage.setItem('agro_sess', storedSess);
      }
      if (!storedZx) {
        storedZx = Date.now().toString();
        localStorage.setItem('agro_zx', storedZx);
      }
      if (!storedCr) {
        storedCr = Math.random().toString(36).substring(2, 10);
        localStorage.setItem('agro_cr', storedCr);
      }

      const params = new URLSearchParams({
        zx: storedZx,
        no_sw_cr: storedCr,
        usr: storedUsr,
        sess: storedSess
      });
      return `?${params.toString()}`;
    } catch {
      return '';
    }
  };

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
    { path: '/', label: 'Início', icon: Home, i18nKey: 'inicio' },
    { path: '/loja', label: 'Loja', icon: ShoppingCart, i18nKey: 'loja' },
    { path: '/frete', label: 'Frete', icon: Truck, i18nKey: 'agroconecta' },
    { path: '/produtos', label: 'Produtos', icon: ShoppingCart, i18nKey: 'marketplace' },
    { path: '/tecnologia', label: 'Crypto', icon: Coins, i18nKey: 'tecnologia' },
    { path: '/partnerships', label: 'Parcerias', icon: Users, i18nKey: 'parcerias' },
    { path: '/sobre', label: 'Sobre', icon: Info, i18nKey: 'about' },
    { path: '/planos', label: 'Planos', icon: Crown, i18nKey: 'plans' }
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
    { path: '/', label: 'Início', icon: Home, i18nKey: 'inicio' },
    { path: '/loja', label: 'Loja', icon: ShoppingCart, i18nKey: 'loja' },
    { path: '/frete', label: 'Frete', icon: Truck, i18nKey: 'agroconecta' },
    { path: '/produtos', label: 'Produtos', icon: ShoppingCart, i18nKey: 'marketplace' },
    { path: '/tecnologia', label: 'Crypto', icon: Coins, i18nKey: 'tecnologia' },
    { path: '/partnerships', label: 'Parcerias', icon: Users, i18nKey: 'parcerias' },
    { path: '/sobre', label: 'Sobre', icon: Info, i18nKey: 'about' },
    { path: '/planos', label: 'Planos', icon: Crown, i18nKey: 'plans' },
    { path: '/login', label: 'Entrar', icon: LogIn, i18nKey: 'login' },
    { path: '/signup', label: 'Cadastrar', icon: User, i18nKey: 'register' }
  ];

  const buildPath = (path) => {
    const search = getCryptoSearch();
    return { pathname: path, search };
  };

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
            <Link to={buildPath('/')} className='flex items-center'>
              <AgroisyncLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav id='main-nav' className='hidden items-center space-x-1 md:flex'>
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const children = submenuItems[item.path];
                return (
                  <div key={item.path} className='group relative'>
                    <Link
                      to={buildPath(item.path)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {t ? t(`nav.${item.i18nKey}`, item.label) : item.label}
                    </Link>
                    {children && children.length > 0 && (
                      <div className='absolute left-0 z-50 mt-1 hidden min-w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 group-hover:block'>
                        <ul className='py-2'>
                          {children.map(sub => (
                            <li key={sub.path}>
                              <Link
                                to={buildPath(sub.path)}
                                className='block w-full text-left px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-green-50 hover:text-green-700'
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

            {/* User Menu Dropdown - MENU HAMBURGUER DO USUÁRIO */}
            {user && (
              <div className='relative hidden md:block'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-green-600 hover:shadow-md'
                  type='button'
                >
                  <User className='h-4 w-4' />
                  <span className='max-w-[100px] truncate'>{user.name || user.email}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className='absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl'>
                    <div className='p-2'>
                      <Link
                        to={user?.isAdmin || user?.role === 'admin' ? '/admin' : '/user-dashboard'}
                        onClick={() => setIsUserMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                      >
                        <LayoutDashboard className='h-4 w-4' />
                        {user?.isAdmin || user?.role === 'admin' ? 'Painel Admin' : 'Meu Painel'}
                      </Link>
                      <Link
                        to='/messaging'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                      >
                        <MessageSquare className='h-4 w-4' />
                        Mensagens
                      </Link>
                      <Link
                        to='/user-dashboard?tab=settings'
                        onClick={() => setIsUserMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                      >
                        <Settings className='h-4 w-4' />
                        Configurações
                      </Link>
                      <div className='my-1 border-t border-gray-200' />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className='flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50'
                        type='button'
                      >
                        <LogOut className='h-4 w-4' />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Actions */}
            <div className='hidden items-center gap-4 md:flex'>
              {/* Language Selector */}
              <div className='lang-selector premium-language-selector-desktop'>
                <LanguageSelectorPro />
              </div>

              {/* Auth Buttons - Só mostra se não tiver usuário logado */}
              {!user && (
                <div className='flex items-center gap-2'>
                  <Link
                    to={buildPath('/login')}
                    className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-600'
                  >
                    <LogIn className='h-4 w-4' />
                    Entrar
                  </Link>
                  <Link
                    to={buildPath('/signup')}
                    className='flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-green-600 hover:shadow-md'
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
              type='button'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-gray-200/50 bg-white/95 shadow-lg backdrop-blur-md md:hidden'>
            <div className='space-y-2 px-6 py-4'>
              {/* Menu do Usuário no Mobile - SE ESTIVER LOGADO */}
              {user && (
                <>
                  <div className='mb-3 rounded-lg bg-green-50 p-3'>
                    <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-green-700'>
                      <User className='h-4 w-4' />
                      {user.name || user.email}
                    </div>
                    <div className='space-y-1'>
                      <Link
                        to={user?.isAdmin || user?.role === 'admin' ? '/admin' : '/user-dashboard'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-green-600'
                      >
                        <LayoutDashboard className='h-4 w-4' />
                        {user?.isAdmin || user?.role === 'admin' ? 'Painel Admin' : 'Meu Painel'}
                      </Link>
                      <Link
                        to='/messaging'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-green-600'
                      >
                        <MessageSquare className='h-4 w-4' />
                        Mensagens
                      </Link>
                      <Link
                        to='/user-dashboard?tab=settings'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:text-green-600'
                      >
                        <Settings className='h-4 w-4' />
                        Configurações
                      </Link>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-white'
                        type='button'
                      >
                        <LogOut className='h-4 w-4' />
                        Sair
                      </button>
                    </div>
                  </div>
                  <div className='border-t border-gray-200/60' />
                </>
              )}

              {/* Menu de Navegação Normal */}
              {mobileNavigationItems
                .filter(item => {
                  // Se usuário logado, não mostrar Login/Cadastrar
                  if (user && (item.path === '/login' || item.path === '/signup')) {
                    return false;
                  }
                  return true;
                })
                .map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={buildPath(item.path)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {t ? t(`nav.${item.i18nKey}`, item.label) : item.label}
                    </Link>
                  );
                })}

              {/* Subitens no mobile */}
              <div className='border-t border-gray-200/60 pt-2' />
              {['/produtos', '/frete', '/partnerships'].map(parent => (
                <div key={parent} className=''>
                  <div className='px-4 py-2 text-xs font-semibold text-gray-500'>
                    {parent === '/produtos'
                      ? 'Produtos'
                      : parent === '/frete'
                        ? 'Frete'
                        : 'Parcerias'}
                  </div>
                  {(submenuItems[parent] || []).map(sub => (
                    <Link
                      key={sub.path}
                      to={buildPath(sub.path)}
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

    </>
  );
};

export default AgroisyncHeader;
