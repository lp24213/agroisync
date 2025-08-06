'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

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
    // Carregar idioma do localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('agrotm-language');
      if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        setCurrentLanguage(i18n.language || 'pt');
      }
    } else {
      setCurrentLanguage(i18n.language || 'pt');
    }
  }, [i18n.language]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar menu mobile quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Trocar idioma
  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setIsLanguageOpen(false);
    
    // Mudar idioma usando react-i18next
    i18n.changeLanguage(languageCode);
    
    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrotm-language', languageCode);
    }
  };

  // Obter idioma atual
  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
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
            <span className="hidden text-2xl font-bold text-[#00F0FF] font-orbitron">AGROTM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                pathname === '/dashboard' ? 'text-[#00F0FF]' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/staking" 
              className={`text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                pathname === '/staking' ? 'text-[#00F0FF]' : ''
              }`}
            >
              Staking
            </Link>
            <Link 
              href="/nft-marketplace" 
              className={`text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                pathname === '/nft-marketplace' ? 'text-[#00F0FF]' : ''
              }`}
            >
              NFTs
            </Link>
            <Link 
              href="/farm" 
              className={`text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                pathname === '/farm' ? 'text-[#00F0FF]' : ''
              }`}
            >
              Farm
            </Link>
            <Link 
              href="/contact" 
              className={`text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                pathname === '/contact' ? 'text-[#00F0FF]' : ''
              }`}
            >
              Contato
            </Link>
          </nav>

          {/* Language Selector */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="font-orbitron">{getCurrentLanguage().flag}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#000000] border border-[#00F0FF]/20 rounded-lg shadow-lg py-2 z-50">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[#00F0FF]/10 transition-colors duration-300 ${
                        currentLanguage === language.code ? 'text-[#00F0FF]' : 'text-[#cccccc]'
                      }`}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/dashboard">
              <button className="bg-[#00F0FF] text-black px-6 py-2 rounded-xl font-orbitron font-semibold hover:bg-[#00d4e0] transition-all duration-300 shadow-neon">
                Acessar
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden mobile-menu-button p-2 text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu absolute top-full left-0 right-0 bg-[#000000]/95 backdrop-blur-md border-b border-[#00F0FF]/20">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/dashboard" 
                className={`block text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                  pathname === '/dashboard' ? 'text-[#00F0FF]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/staking" 
                className={`block text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                  pathname === '/staking' ? 'text-[#00F0FF]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Staking
              </Link>
              <Link 
                href="/nft-marketplace" 
                className={`block text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                  pathname === '/nft-marketplace' ? 'text-[#00F0FF]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                NFTs
              </Link>
              <Link 
                href="/farm" 
                className={`block text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                  pathname === '/farm' ? 'text-[#00F0FF]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Farm
              </Link>
              <Link 
                href="/contact" 
                className={`block text-[#cccccc] hover:text-[#00F0FF] transition-colors duration-300 font-orbitron ${
                  pathname === '/contact' ? 'text-[#00F0FF]' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-[#00F0FF]/20">
                <div className="flex flex-wrap gap-2">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${
                        currentLanguage === language.code 
                          ? 'bg-[#00F0FF] text-black' 
                          : 'bg-[#00F0FF]/10 text-[#cccccc] hover:bg-[#00F0FF]/20'
                      }`}
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}