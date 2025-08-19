import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  SparklesIcon
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
    { name: t('home'), href: '/' },
    { name: t('marketplace'), href: '/marketplace' },
    { name: t('staking'), href: '/staking' },
    { name: t('properties'), href: '/properties' },
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('about'), href: '/about' }
  ];

  const isActive = (href: string) => router.pathname === href;

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="cosmic-background text-white border-b border-purple-500/30 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-cosmic-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-cosmic-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-cosmic-pulse animation-delay-4000"></div>
        </div>

        {/* Crypto Prices Ticker */}
        <div className="bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-cyan-900/80 py-3 overflow-hidden relative backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="flex space-x-12 animate-scroll relative z-10">
            <div className="flex items-center space-x-4 text-sm text-purple-silver">
              <span className="font-bold text-cyan-300">BTC</span>
              <span className="text-green-400 font-mono">$43,250.00</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+3.2%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-purple-silver">
              <span className="font-bold text-blue-300">ETH</span>
              <span className="text-green-400 font-mono">$2,650.00</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+2.8%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-purple-silver">
              <span className="font-bold text-purple-300">SOL</span>
              <span className="text-green-400 font-mono">$98.50</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+5.7%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-purple-silver">
              <span className="font-bold text-emerald-300">ADA</span>
              <span className="text-red-400 font-mono">$0.48</span>
              <span className="text-red-400 text-xs bg-red-400/20 px-2 py-1 rounded-full">-1.2%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-purple-silver">
              <span className="font-bold text-yellow-300">DOT</span>
              <span className="text-green-400 font-mono">$7.25</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+1.9%</span>
            </div>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 relative z-10" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1 items-center">
            <Link href="/" className="group">
              <div className="flex items-center space-x-3">
                {/* Animated Logo Icon */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-cosmic-glow tracking-tight">
                    AGROISYNC
                  </span>
                  <span className="text-xs text-purple-silver font-medium tracking-wider uppercase">
                    Revolução Digital no Agronegócio
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'relative text-sm font-semibold leading-6 transition-all duration-300 group',
                  isActive(item.href)
                    ? 'text-cyan-400'
                    : 'text-purple-silver hover:text-cyan-300'
                )}
              >
                {item.name}
                {/* Animated Underline */}
                <div className={clsx(
                  'absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300',
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                )}></div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
            <LanguageSwitcher />
            <button 
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-purple-silver hover:text-cyan-300 transition-all duration-300 group"
            >
              <UserCircleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {t('login')}
            </button>
            <button 
              onClick={() => openAuthModal('register')}
              className="cosmic-button flex items-center gap-2 px-6 py-3 text-sm font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform overflow-hidden group"
            >
              <SparklesIcon className="h-4 w-4 group-hover:animate-spin transition-transform duration-300" />
              <span className="relative z-10">{t('cta_get_started')}</span>
              {/* Shine Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-purple-silver hover:text-cyan-300 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto cosmic-background px-6 py-6 sm:max-w-sm border-l border-purple-500/30">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-black text-cosmic-glow">
                    AGROISYNC
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-purple-silver hover:text-cyan-300 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-purple-500/30">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors',
                          isActive(item.href)
                            ? 'text-cyan-400 bg-purple-500/20 border border-purple-500/30'
                            : 'text-purple-silver hover:text-cyan-400 hover:bg-purple-500/10 hover:border hover:border-purple-500/20'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 space-y-3">
                    <button 
                      onClick={() => {
                        openAuthModal('login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-purple-silver hover:text-cyan-400 hover:bg-purple-500/10 transition-colors"
                    >
                      {t('login')}
                    </button>
                                         <button 
                       onClick={() => {
                         openAuthModal('register');
                         setMobileMenuOpen(false);
                       }}
                       className="w-full cosmic-button px-3 py-2 rounded-lg text-base font-semibold leading-7 hover:shadow-lg transition-all duration-300"
                     >
                       {t('cta_get_started')}
                     </button>
                  </div>
                  
                  {/* Legal Links Mobile */}
                  <div className="py-6 space-y-2">
                    <div className="px-3 py-2">
                      <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-3">
                        {t('legal')}
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/privacy"
                          className="block text-sm text-purple-silver hover:text-cyan-400 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('privacy_policy')}
                        </Link>
                        <Link
                          href="/terms"
                          className="block text-sm text-purple-silver hover:text-cyan-400 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('terms_of_service')}
                        </Link>
                        <Link
                          href="/cookies"
                          className="block text-sm text-purple-silver hover:text-cyan-400 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('cookies_policy')}
                        </Link>
                      </div>
                    </div>
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
