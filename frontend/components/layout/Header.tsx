'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
    setCurrentLanguage(i18n.language || 'pt');
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
    
    // Mudar idioma usando next-i18next
    i18n.changeLanguage(languageCode);
    
    // Atualizar URL com o novo locale
    const currentPath = pathname;
    const newPath = currentPath.replace(`/${i18n.language}`, `/${languageCode}`);
    router.push(newPath);
  };

  // Obter idioma atual
  const getCurrentLanguage = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-bold text-xl">AGROTM</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">
              {t('header.home')}
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors">
              {t('header.dashboard')}
            </Link>
            <Link href="/staking" className="text-gray-300 hover:text-cyan-400 transition-colors">
              {t('header.staking')}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
              {t('header.about')}
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">
              {t('header.contact')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors"
              >
                <Globe size={16} />
                <span>{getCurrentLanguage().flag}</span>
                <span className="text-sm">{getCurrentLanguage().code.toUpperCase()}</span>
                <ChevronDown size={12} className={`transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-cyan-500/20 rounded-lg shadow-xl z-[9999]">
                  <div className="py-2">
                    {supportedLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                          currentLanguage === language.code ? 'text-cyan-400 bg-gray-800' : 'text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        {currentLanguage === language.code && (
                          <span className="ml-auto text-cyan-400">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Get Started Button */}
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
            >
              {t('header.getStarted')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-button md:hidden text-gray-300 hover:text-cyan-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden absolute top-full left-0 right-0 bg-gray-900 border-t border-cyan-500/20 shadow-xl z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-4">
                <Link
                  href="/"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.dashboard')}
                </Link>
                <Link
                  href="/staking"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.staking')}
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.about')}
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.contact')}
                </Link>
              </nav>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Idioma / Language</h3>
                <div className="space-y-2">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentLanguage === language.code
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      {currentLanguage === language.code && (
                        <span className="ml-auto text-cyan-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Get Started Button */}
              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.getStarted')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}