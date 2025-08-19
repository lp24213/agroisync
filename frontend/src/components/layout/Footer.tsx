import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <footer className="cosmic-background text-white relative overflow-hidden">
      {/* Efeitos cósmicos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nebulosas flutuantes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-full blur-3xl animate-nebula-drift"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
        
        {/* Portais quânticos */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-3000"></div>
        
        {/* Ondas de energia */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-cosmic-wave"></div>
        
        {/* Estrelas cintilantes */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-sparkle"></div>
        <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-blue-400 rounded-full animate-sparkle animation-delay-4000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6 group">
                <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                  <span className="text-white font-bold text-2xl">🌱</span>
                </div>
                <span className="ml-4 text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300">
                  {t('app_name')}
                </span>
              </div>
              <p className="text-purple-silver mb-6 max-w-md text-lg leading-relaxed">
                {t('features_sub')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="group p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-400/30 hover:to-blue-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 hover-cosmic-pulse">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="group p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl hover:from-blue-400/30 hover:to-purple-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover-cosmic-pulse">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="group p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-400/30 hover:to-pink-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-110 hover-cosmic-pulse">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-6 flex items-center">
                <RocketLaunchIcon className="h-4 w-4 mr-2 animate-pulse" />
                {t('nav_marketplace')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/marketplace" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('nav_marketplace')}
                  </Link>
                </li>
                <li>
                  <Link href="/staking" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('nav_staking')}
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('nav_properties')}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('nav_dashboard')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-6 flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-2 animate-pulse" />
                {t('nav_about')}
              </h3>
              <ul className="space-y-4">
                <li className="group">
                  <a href="mailto:contato@agroisync.com" className="flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    contato@agroisync.com
                  </a>
                </li>
                <li className="group">
                  <a href="tel:+5566992362830" className="flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <PhoneIcon className="h-5 w-5 mr-3 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    +55 (66) 99236-2830
                  </a>
                </li>
                <li className="group flex items-center text-purple-silver">
                  <MapPinIcon className="h-5 w-5 mr-3 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  <span>Mato Grosso, Brasil</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-6 flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2 animate-pulse" />
                {t('legal')}
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('privacy_policy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('terms_of_service')}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="group flex items-center text-purple-silver hover:text-cyan-300 transition-all duration-300 hover:translate-x-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                    {t('cookies_policy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cyan-500/20 py-8 relative">
          {/* Efeito de brilho na borda */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-cosmic-wave"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-purple-silver text-sm flex items-center">
              <StarIcon className="h-4 w-4 mr-2 text-cyan-400 animate-pulse" />
              © 2024 AGROISYNC. {t('nav_about')}.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-purple-silver hover:text-cyan-300 text-sm transition-all duration-300 hover:scale-105">
                {t('privacy_policy')}
              </Link>
              <Link href="/terms" className="text-purple-silver hover:text-cyan-300 text-sm transition-all duration-300 hover:scale-105">
                {t('terms_of_service')}
              </Link>
              <Link href="/cookies" className="text-purple-silver hover:text-cyan-300 text-sm transition-all duration-300 hover:scale-105">
                {t('cookies_policy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
