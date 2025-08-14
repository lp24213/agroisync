'use client';

// import { WalletConnect } from '../WalletConnect';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe, Menu, Search, Settings, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Farm', href: '/farm', icon: '🌾' },
  { name: 'Stake', href: '/staking', icon: '🔒' },
  { name: 'Swap', href: '/swap', icon: '🔄' },
  { name: 'NFTs', href: '/nft-marketplace', icon: '🎨' },
  { name: 'Governance', href: '/governance', icon: '🏛️' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
];

const ecosystem = [
  { name: 'AGROTM Token', href: '/token', description: 'Token de utilidade nativo' },
  { name: 'Yield Farming', href: '/farming', description: 'Ganhe recompensas' },
  { name: 'Liquidity Pools', href: '/pools', description: 'Forneça liquidez' },
  { name: 'NFT Marketplace', href: '/nfts', description: 'Troque ativos digitais' },
  { name: 'DAO Governance', href: '/dao', description: 'Votação da comunidade' },
  { name: 'Analytics', href: '/analytics', description: 'Dados em tempo real' },
];

export function PremiumNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 lg:h-20'>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className='flex items-center space-x-3'>
            <Link href='/' className='flex items-center space-x-3'>
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-white' />
                </div>
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse' />
              </div>
              <div className='hidden sm:block'>
                <h1 className='text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>
                  AGROTM
                </h1>
                <p className='text-xs text-gray-400'>DeFi Agriculture</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex items-center space-x-8'>
            {navigation.map(item => (
              <motion.div key={item.name} whileHover={{ y: -2 }} className='relative group'>
                <Link
                  href={item.href}
                  className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200'
                >
                  <span className='text-lg'>{item.icon}</span>
                  <span className='font-medium'>{item.name}</span>
                </Link>
                <div className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-300 group-hover:w-full' />
              </motion.div>
            ))}

            {/* Ecosystem Dropdown */}
            <div className='relative'>
              <motion.button
                whileHover={{ y: -2 }}
                onMouseEnter={() => setIsEcosystemOpen(true)}
                onMouseLeave={() => setIsEcosystemOpen(false)}
                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200'
              >
                <Globe className='w-5 h-5' />
                <span className='font-medium'>Ecosystem</span>
                <ChevronDown className='w-4 h-4' />
              </motion.button>

              <AnimatePresence>
                {isEcosystemOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setIsEcosystemOpen(true)}
                    onMouseLeave={() => setIsEcosystemOpen(false)}
                    className='absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl'
                  >
                    <div className='grid grid-cols-1 gap-2'>
                      {ecosystem.map(item => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className='flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors duration-200'
                        >
                          <div>
                            <h3 className='font-medium text-white'>{item.name}</h3>
                            <p className='text-sm text-gray-400'>{item.description}</p>
                          </div>
                          <ChevronDown className='w-4 h-4 text-gray-400 rotate-[-90deg]' />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center space-x-4'>
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='hidden sm:flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200'
            >
              <Search className='w-5 h-5 text-gray-300' />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='hidden sm:flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200 relative'
            >
              <Bell className='w-5 h-5 text-gray-300' />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse' />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='hidden sm:flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200'
            >
              <Settings className='w-5 h-5 text-gray-300' />
            </motion.button>

            {/* Wallet Connect */}
                            {/* <WalletConnect /> */}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className='lg:hidden flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200'
            >
              {isOpen ? (
                <X className='w-6 h-6 text-gray-300' />
              ) : (
                <Menu className='w-6 h-6 text-gray-300' />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10'
          >
            <div className='px-4 py-6 space-y-4'>
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className='flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200'
                >
                  <span className='text-xl'>{item.icon}</span>
                  <span className='font-medium text-white'>{item.name}</span>
                </Link>
              ))}

              <div className='border-t border-white/10 pt-4'>
                <h3 className='text-sm font-medium text-gray-400 mb-3'>ECOSYSTEM</h3>
                {ecosystem.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className='flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors duration-200'
                  >
                    <div>
                      <h4 className='font-medium text-white'>{item.name}</h4>
                      <p className='text-sm text-gray-400'>{item.description}</p>
                    </div>
                    <ChevronDown className='w-4 h-4 text-gray-400 rotate-[-90deg]' />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
