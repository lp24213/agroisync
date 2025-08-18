import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from '../auth/AuthModal';
import { useI18n } from '@/i18n/I18nProvider';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const { t } = useI18n();

  const navigation = [
    { name: t('nav_home'), href: '/' },
    { name: t('nav_marketplace'), href: '/marketplace' },
    { name: t('nav_staking'), href: '/staking' },
    { name: t('nav_properties'), href: '/properties' },
    { name: t('nav_dashboard'), href: '/dashboard' },
    { name: t('nav_about'), href: '/about' }
  ];

  const isActive = (href: string) => router.pathname === href;

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-black text-gray-200 border-b border-gray-800">
        {/* Crypto Prices Ticker */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-800 py-2 overflow-hidden">
          <div className="flex space-x-8 animate-scroll">
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-semibold">BTC</span>
              <span className="text-green-400">$43,250.00</span>
              <span className="text-green-400 text-xs">+3.2%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-semibold">ETH</span>
              <span className="text-green-400">$2,650.00</span>
              <span className="text-green-400 text-xs">+7.8%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-semibold">ADA</span>
              <span className="text-red-400">$0.4850</span>
              <span className="text-red-400 text-xs">-1.5%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-semibold">SOL</span>
              <span className="text-green-400">$98.50</span>
              <span className="text-green-400 text-xs">+12.3%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-semibold">DOT</span>
              <span className="text-green-400">$7.25</span>
              <span className="text-green-400 text-xs">+5.7%</span>
            </div>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">AgroSync</span>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-slate-300 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">🌱</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">AgroSync</span>
              </div>
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'text-sm font-semibold leading-6 transition-colors',
                  isActive(item.href)
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-blue-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
            <LanguageSwitcher />
            <button 
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-300 hover:text-blue-300 transition-colors"
            >
              <UserCircleIcon className="h-5 w-5" />
              {t('login')}
            </button>
            <button 
              onClick={() => openAuthModal('register')}
              className="bg-gradient-to-r from-blue-500 to-slate-300 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-400 hover:to-slate-200 transition-all duration-200"
            >
              Criar Conta
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">AgroSync</span>
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-slate-300 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-lg">🌱</span>
                    </div>
                    <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">AgroSync</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-800">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors',
                          isActive(item.href)
                            ? 'text-blue-400 bg-gray-900'
                            : 'text-gray-200 hover:bg-gray-900'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Language</span>
                      <LanguageSwitcher />
                    </div>
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-gray-900"
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      {t('login')}
                    </button>
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-slate-300 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-400 hover:to-slate-200 transition-all duration-200"
                    >
                      Criar Conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
};

export default Header;
