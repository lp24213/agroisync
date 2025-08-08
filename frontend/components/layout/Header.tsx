'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { LanguageSelector } from '../ui/LanguageSelector';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.dashboard'), href: '/dashboard' },
    { name: t('nav.staking'), href: '/staking' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(t('auth.logout.success') || 'Logout realizado com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error(t('auth.logout.error') || 'Erro ao fazer logout');
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-premium-black/90 backdrop-blur-xl border-b border-premium-neon-blue/30 shadow-2xl shadow-premium-neon-blue/20' 
          : 'bg-premium-black/20 backdrop-blur-md border-b border-premium-neon-blue/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Logo size="md" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-premium-neon-blue hover:text-premium-neon-green font-medium transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-premium-neon-blue to-premium-neon-green transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <LanguageSelector />
            </motion.div>
            
            {/* Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/30 rounded-lg px-3 py-2"
                    >
                      <User className="w-4 h-4 text-premium-neon-blue" />
                      <span className="text-premium-neon-blue text-sm font-orbitron max-w-24 truncate">
                        {user.email?.split('@')[0]}
                      </span>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-300 font-orbitron text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut className="w-4 h-4" />
                      {t('auth.logout.button') || 'Sair'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onClick={() => router.push('/login')}
                    className="btn-primary px-8 py-3 text-sm font-orbitron"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('auth.login.title') || 'Entrar'}
                  </motion.button>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-premium-neon-blue hover:text-premium-neon-green transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-premium-black/95 backdrop-blur-xl border-t border-premium-neon-blue/20"
            >
              <div className="py-6 px-4 space-y-3">
                {navigation.map((item, index) => (
                  <motion.a
                    key={`${item.name}-${index}`}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="block px-4 py-3 text-premium-neon-blue hover:text-premium-neon-green hover:bg-premium-neon-blue/10 rounded-lg transition-all duration-300 font-orbitron font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                {/* Mobile Auth Section */}
                <div className="border-t border-premium-neon-blue/20 pt-4 mt-4">
                  {!loading && (
                    <>
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-premium-black/50 rounded-lg">
                            <User className="w-4 h-4 text-premium-neon-blue" />
                            <span className="text-premium-neon-blue text-sm font-orbitron">
                              {user.email?.split('@')[0]}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg transition-all duration-300 font-orbitron text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('auth.logout.button') || 'Sair'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            router.push('/login');
                            setIsMenuOpen(false);
                          }}
                          className="w-full btn-primary px-4 py-3 text-sm font-orbitron"
                        >
                          {t('auth.login.title') || 'Entrar'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}