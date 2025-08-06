'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const supportedLanguages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export function Header() {
  const { t, i18n } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');
  const languageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Detectar idioma atual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('agrotm-language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, [i18n]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Trocar idioma
  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('agrotm-language', languageCode);
    setIsLanguageOpen(false);
  };

  // Obter idioma atual
  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-[#00FF7F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="flex items-center">
              <Image 
                src="/assets/images/logo/agrotm-logo.svg" 
                alt="AGROTM Logo" 
                width={180} 
                height={60}
                priority
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('agrotm-logo.svg')) {
                    target.src = "/assets/images/logo/agrotm-logo-white.svg";
                  } else if (target.src.includes('agrotm-logo-white.svg')) {
                    target.src = "/assets/images/logo/agrotm-logo.png";
                  } else {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              <span className="hidden text-2xl font-bold text-[#00FF7F] font-orbitron">AGROTM</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/dashboard" 
                className={`text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron relative group ${
                  pathname === '/dashboard' ? 'text-[#00FF7F]' : ''
                }`}
              >
                {t('header.dashboard', 'Dashboard')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/staking" 
                className={`text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron relative group ${
                  pathname === '/staking' ? 'text-[#00FF7F]' : ''
                }`}
              >
                {t('header.staking', 'Staking')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/nft-marketplace" 
                className={`text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron relative group ${
                  pathname === '/nft-marketplace' ? 'text-[#00FF7F]' : ''
                }`}
              >
                NFTs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/about" 
                className={`text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron relative group ${
                  pathname === '/about' ? 'text-[#00FF7F]' : ''
                }`}
              >
                {t('header.about', 'Sobre')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href="/contact" 
                className={`text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron relative group ${
                  pathname === '/contact' ? 'text-[#00FF7F]' : ''
                }`}
              >
                {t('header.contact', 'Contato')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00FF7F] to-[#00cc66] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </nav>

          {/* Language Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={languageRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron"
              >
                <Globe size={16} />
                <span>{getCurrentLanguage().flag}</span>
                <ChevronDown size={12} />
              </motion.button>
              
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-[#000000]/95 backdrop-blur-md border border-[#00FF7F]/20 rounded-xl shadow-neon-green min-w-[150px]"
                >
                  {supportedLanguages.map((language) => (
                    <motion.button
                      key={language.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-[#00FF7F]/10 transition-all duration-300 ${
                        currentLanguage === language.code ? 'text-[#00FF7F]' : 'text-[#cccccc]'
                      }`}
                    >
                      <span>{language.flag}</span>
                      <span className="font-orbitron">{language.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <button className="btn-primary text-sm px-6 py-2 rounded-xl font-orbitron font-bold">
                  {t('header.getStarted', 'Começar Agora')}
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#000000]/95 backdrop-blur-md border-t border-[#00FF7F]/20"
          >
            <nav className="flex flex-col space-y-4 py-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/dashboard" 
                  className={`px-4 py-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron ${
                    pathname === '/dashboard' ? 'text-[#00FF7F]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.dashboard', 'Dashboard')}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/staking" 
                  className={`px-4 py-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron ${
                    pathname === '/staking' ? 'text-[#00FF7F]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.staking', 'Staking')}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/nft-marketplace" 
                  className={`px-4 py-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron ${
                    pathname === '/nft-marketplace' ? 'text-[#00FF7F]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  NFTs
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/about" 
                  className={`px-4 py-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron ${
                    pathname === '/about' ? 'text-[#00FF7F]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.about', 'Sobre')}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/contact" 
                  className={`px-4 py-2 text-[#cccccc] hover:text-[#00FF7F] transition-all duration-300 font-orbitron ${
                    pathname === '/contact' ? 'text-[#00FF7F]' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.contact', 'Contato')}
                </Link>
              </motion.div>
              
              {/* Mobile Language Selector */}
              <div className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {supportedLanguages.map((language) => (
                    <motion.button
                      key={language.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-orbitron transition-all duration-300 ${
                        currentLanguage === language.code 
                          ? 'bg-gradient-to-r from-[#00FF7F] to-[#00cc66] text-black' 
                          : 'bg-[#00FF7F]/10 text-[#cccccc] hover:text-[#00FF7F]'
                      }`}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}