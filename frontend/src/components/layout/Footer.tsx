import React from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Footer: React.FC = () => {
  const { t } = useI18n()

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo e Slogan */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">🌱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AgroSync</h3>
                <p className="text-sm text-gray-400">{t('footer_logo_slogan')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Revolucionando o agronegócio com tecnologia blockchain e inteligência artificial.
              Conectamos produtores, investidores e consumidores em uma plataforma segura e transparente.
            </p>
          </div>

          {/* Links Principais */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer_main_links_title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('marketplace')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/staking" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('staking')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('properties')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('dashboard')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('about')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Legais */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer_legal_links_title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('privacy_policy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('terms_of_service')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('cookies_policy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  <span>{t('contact_title')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações de Contato */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer_contact_title')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <EnvelopeIcon className="w-5 h-5 text-purple-400" />
                <a href="mailto:contato@agroisync.com" className="text-sm">
                  {t('footer_contact_email')}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <PhoneIcon className="w-5 h-5 text-purple-400" />
                <a href="tel:+5566999999999" className="text-sm">
                  {t('footer_contact_phone')}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <MapPinIcon className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t('footer_contact_address')}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <ClockIcon className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Seg-Sex: 8h às 18h</span>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-3">{t('footer_social_title')}</h5>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-110"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-110"
                  title="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-110"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center text-white hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-110"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              {t('footer_copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Servidor Online</span>
              </span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
