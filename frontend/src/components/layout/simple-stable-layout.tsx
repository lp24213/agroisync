'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Truck, 
  Coins, 
  Wheat, 
  BarChart3,
  MessageCircle,
  Bot
} from 'lucide-react';

interface SimpleStableLayoutProps {
  children: React.ReactNode
}

export function SimpleStableLayout({ children }: SimpleStableLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 20);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/20 rounded-lg animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-purple-500/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-cyan-500/20' 
            : 'bg-transparent'
        }`}
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
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col h-full pt-20 px-6">
            {navItems.map((item, index) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 py-4 text-white hover:text-cyan-400 transition-colors duration-200 border-b border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 relative z-10">
        {children}
      </main>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isChatOpen ? (
            <X className="w-8 h-8 text-white mx-auto" />
          ) : (
            <MessageCircle className="w-8 h-8 text-white mx-auto" />
          )}
        </motion.button>

        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="absolute bottom-24 right-0 w-96 h-[500px] bg-black/90 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-600/20 p-4 border-b border-cyan-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AgroSync AI</h3>
                  <p className="text-cyan-400 text-sm">Assistente Virtual</p>
                </div>
              </div>
            </div>
            <div className="p-4 text-center text-gray-400">
              <p>Chatbot em desenvolvimento...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
