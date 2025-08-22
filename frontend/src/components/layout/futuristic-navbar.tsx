'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Truck, 
  Coins, 
  Wheat, 
  MapPin, 
  BarChart3,
  User,
  LogOut,
  Settings
} from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export function FuturisticNavbar({ className = '' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Início', href: '/', icon: null },
    { name: 'Criptomoedas', href: '/crypto', icon: Coins },
    { name: 'Grãos', href: '/grains', icon: Wheat },
    { name: 'Loja', href: '/store', icon: ShoppingCart },
    { name: 'AgroConecta', href: '/agroconecta', icon: Truck },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Sobre', href: '/about', icon: null },
    { name: 'Contato', href: '/contact', icon: null },
  ];

  const userMenuItems = [
    { name: 'Perfil', href: '/settings', icon: User },
    { name: 'Configurações', href: '/settings', icon: Settings },
    { name: 'Sair', href: '/auth/logout', icon: LogOut },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-cyan-500/20' 
            : 'bg-transparent'
        } ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-xl blur opacity-75 animate-pulse"></div>
                </div>
                <span className="text-white font-bold text-xl lg:text-2xl bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  AgroSync
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="group relative text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <motion.button
                    className="px-6 py-2 text-cyan-400 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/auth">Entrar</Link>
                  </motion.button>
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-black rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34, 211, 238, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/auth?mode=register">Cadastrar</Link>
                  </motion.button>
                </>
              ) : (
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full"></div>
                    <span className="text-white font-medium">Usuário</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-cyan-400 transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col h-full pt-20 px-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 py-4 text-white hover:text-cyan-400 transition-colors duration-200 border-b border-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="text-lg font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 pt-8 border-t border-white/20">
                {!isAuthenticated ? (
                  <div className="space-y-4">
                    <motion.button
                      className="w-full py-3 text-cyan-400 border border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        Entrar
                      </Link>
                    </motion.button>
                    <motion.button
                      className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300 font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/auth?mode=register" onClick={() => setIsOpen(false)}>
                        Cadastrar
                      </Link>
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userMenuItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 py-3 text-white hover:text-cyan-400 transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
