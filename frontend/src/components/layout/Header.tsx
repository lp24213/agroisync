import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
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
      <header className="bg-black text-gray-200 border-b border-gray-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Crypto Prices Ticker */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-cyan-900 py-3 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          <div className="flex space-x-12 animate-scroll relative z-10">
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-bold text-cyan-300">BTC</span>
              <span className="text-green-400 font-mono">$43,250.00</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+3.2%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-bold text-blue-300">ETH</span>
              <span className="text-green-400 font-mono">$2,650.00</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+2.8%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-bold text-purple-300">SOL</span>
              <span className="text-green-400 font-mono">$98.50</span>
              <span className="text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">+5.7%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span className="font-bold text-emerald-300">ADA</span>
              <span className="text-red-400 font-mono">$0.48</span>
              <span className="text-red-400 text-xs bg-red-400/20 px-2 py-1 rounded-full">-1.2%</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
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
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-500 group-hover:scale-110">
                    <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    AGROISYNC
                  </span>
                  <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                    Agricultural Intelligence
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
                    : 'text-gray-300 hover:text-cyan-300'
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
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-300 hover:text-cyan-300 transition-all duration-300 group"
            >
              <UserCircleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {t('login')}
            </button>
            <button 
              onClick={() => openAuthModal('register')}
              className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 transform overflow-hidden group"
            >
              <span className="relative z-10">Criar Conta</span>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shine Effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
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
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    AGROISYNC
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-400"
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
                            ? 'text-cyan-400 bg-gray-800'
                            : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
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
                      className="w-full text-left -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
                    >
                      {t('login')}
                    </button>
                    <button 
                      onClick={() => {
                        openAuthModal('register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg text-base font-semibold leading-7 hover:shadow-lg transition-all duration-300"
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
