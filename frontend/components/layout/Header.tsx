'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, ChevronDown } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { useTranslation } from 'react-i18next';
// import { LanguageSelector } from '@/components/ui/LanguageSelector';

const navigation = [
  { name: 'navigation.home', href: '/' },
  { name: 'navigation.dashboard', href: '/dashboard' },
  { name: 'navigation.staking', href: '/staking' },
  { name: 'navigation.nft', href: '/nft-marketplace' },
  { name: 'navigation.governance', href: '/governance' },
  { name: 'navigation.about', href: '/about' },
];

const defiDropdown = [
  { name: 'navigation.pools', href: '/pools' },
  { name: 'navigation.farming', href: '/farming' },
  { name: 'navigation.swap', href: '/swap' },
  { name: 'navigation.analytics', href: '/analytics' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDefiOpen, setIsDefiOpen] = useState(false);
  const { connected } = useWallet();

  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex items-center'
          >
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>A</span>
              </div>
              <span className='text-white font-bold text-xl'>AGROTM</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className='text-gray-300 hover:text-white transition-colors duration-200 font-medium'
              >
                {t(item.name)}
              </Link>
            ))}

            {/* DeFi Dropdown */}
            <div className='relative'>
              <button
                onClick={() => setIsDefiOpen(!isDefiOpen)}
                className='flex items-center text-gray-300 hover:text-white transition-colors duration-200 font-medium'
              >
                DeFi
                <ChevronDown className='ml-1 h-4 w-4' />
              </button>

              <AnimatePresence>
                {isDefiOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl'
                  >
                    {defiDropdown.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className='block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200'
                        onClick={() => setIsDefiOpen(false)}
                      >
                        {t(item.name)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Wallet Connection & Language Selector */}
          <div className='flex items-center space-x-4'>
            {/* Language Selector */}
            {/* <LanguageSelector /> */}

            {/* Solana Wallet */}
            <WalletMultiButton className='bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300' />

            {/* Web3 Wallet (MetaMask) */}
            {!connected && (
              <button className='bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2'>
                <Wallet className='h-4 w-4' />
                <span>{t('wallet.connect')}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='md:hidden text-gray-300 hover:text-white transition-colors duration-200'
            >
              {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10'
            >
              <div className='px-2 pt-2 pb-3 space-y-1'>
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200'
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.name)}
                  </Link>
                ))}

                {/* Mobile DeFi Menu */}
                <div className='px-3 py-2'>
                  <div className='text-gray-400 text-sm font-medium mb-2'>DeFi</div>
                  {defiDropdown.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200'
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.name)}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
