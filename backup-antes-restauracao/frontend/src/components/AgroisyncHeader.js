import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelectorPro from './LanguageSelectorPro';
import AgroisyncLogo from './AgroisyncLogo';
import { Menu, X, Home, ShoppingCart, Truck, LogIn, LogOut, User, Users, Info, Coins, Crown, LayoutDashboard, MessageSquare, Settings, ChevronDown, Store, Cloud } from 'lucide-react';

const AgroisyncHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [, forceUpdate] = useState({});
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Forçar re-render quando idioma mudar
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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

  const navigationItems = useMemo(() => [
    { path: '/', icon: Home, i18nKey: 'home' },
    { path: '/produtos', icon: ShoppingCart, i18nKey: 'marketplace' },
    { path: '/frete', icon: Truck, i18nKey: 'agroconecta' },
    { path: '/clima', icon: Cloud, i18nKey: 'weather' },
    { path: '/loja', icon: Store, i18nKey: 'store' },
    // { path: '/tecnologia', icon: Coins, i18nKey: 'tecnologia' }, // Temporariamente oculto
    { path: '/sobre', icon: Info, i18nKey: 'about' },
    { path: '/planos', icon: Crown, i18nKey: 'plans' }
  ], []);

  // Submenus (desktop) - Recria quando idioma muda
  const submenuItems = useMemo(() => ({
    '/produtos': [
      { path: '/produtos', label: t('nav.products') },
      { path: '/produtos/categories', label: t('nav.categories') },
      { path: '/produtos/sellers', label: t('nav.sellers') },
      { path: '/produtos/sell', label: t('nav.howToSell') }
    ],
    '/frete': [
      { path: '/frete', label: t('nav.searchFreight') },
      { path: '/frete/offer', label: t('nav.offerFreight') },
      { path: '/frete/carriers', label: t('nav.carriers') },
      { path: '/frete/tracking', label: t('nav.tracking') }
    ],
    '/partnerships': [
      { path: '/partnerships', label: t('nav.bePartner') },
      { path: '/partnerships/current', label: t('nav.currentPartners') },
      { path: '/partnerships/benefits', label: t('nav.benefits') },
      { path: '/partnerships/contact', label: t('nav.businessContact') }
    ]
  }), [t]);

  const mobileNavigationItems = useMemo(() => [
    { path: '/', icon: Home, i18nKey: 'home' },
    { path: '/produtos', icon: ShoppingCart, i18nKey: 'marketplace' },
    { path: '/frete', icon: Truck, i18nKey: 'agroconecta' },
    { path: '/clima', icon: Cloud, i18nKey: 'weather' },
    { path: '/loja', icon: Store, i18nKey: 'store' },
    // { path: '/tecnologia', icon: Coins, i18nKey: 'tecnologia' }, // Temporariamente oculto
    { path: '/partnerships', icon: Users, i18nKey: 'partnerships' },
    { path: '/sobre', icon: Info, i18nKey: 'about' },
    { path: '/planos', icon: Crown, i18nKey: 'plans' },
    { path: '/login', icon: LogIn, i18nKey: 'login' },
    { path: '/signup', icon: User, i18nKey: 'register' }
  ], []);

  const buildPath = (path) => {
    const search = getCryptoSearch();
    return { pathname: path, search };
  };

  return (
    <>
      <header
        id='main-header'
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-200 ${
          isScrolled ? 'border-gray-200/70 bg-white/95 shadow-lg' : 'border-gray-200/50 bg-white/90 shadow-sm'
        }`}
        style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className='mx-auto max-w-7xl px-4'>
          <div className='flex h-12 md:h-16 items-center justify-between'>
            {/* Logo - Esquerda */}
            <Link to={buildPath('/')} className='flex items-center flex-shrink-0'>
              <AgroisyncLogo />
            </Link>

            {/* Desktop Navigation - Centralizado */}
            <nav key={i18n.language} id='main-nav' className='hidden items-center justify-center space-x-1 md:flex flex-1'>
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const children = submenuItems[item.path];
                return (
                  <div key={item.path} className='group relative'>
                    <Link
                      to={buildPath(item.path)}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {t(`nav.${item.i18nKey}`)}
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

            {/* User Menu / Login Button - Direita */}
            <div className='flex items-center gap-3 flex-shrink-0'>
              {user ? (
                <div className='relative hidden md:block'>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className='flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-md'
                    style={{
                      background: '#000000'
                    }}
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
                          className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600'
                        >
                          <LayoutDashboard className='h-4 w-4' />
                          {user?.isAdmin || user?.role === 'admin' ? 'Painel Admin' : 'Meu Painel'}
                        </Link>
                        <Link
                          to='/messaging'
                          onClick={() => setIsUserMenuOpen(false)}
                          className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600'
                        >
                          <MessageSquare className='h-4 w-4' />
                          Mensagens
                        </Link>
                        <Link
                          to='/user-dashboard?tab=settings'
                          onClick={() => setIsUserMenuOpen(false)}
                          className='flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600'
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
              ) : (
                <Link
                  to={buildPath('/register')}
                  className='hidden md:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:shadow-md'
                  style={{
                    background: '#000000'
                  }}
                >
                  {t('nav.register')}
                </Link>
              )}
              {/* Language Selector */}
              <div className='lang-selector premium-language-selector-desktop hidden md:block'>
                <LanguageSelectorPro />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='rounded-lg p-2.5 text-gray-700 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 md:hidden'
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
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:shadow-sm'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {t(`nav.${item.i18nKey}`)}
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
                      className='block rounded px-6 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700'
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
