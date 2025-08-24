import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, 
  Linkedin, Youtube, ArrowUp, Heart
} from 'lucide-react';

const Footer = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative ${isDark ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Agroisync</h3>
                  <p className="text-green-400 text-sm">Hub do Agronegócio Brasileiro</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                {t('footer.description')}
              </p>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-green-600 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="/sobre" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="/loja" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.store')}
                </a>
              </li>
              <li>
                <a href="/agroconecta" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.freight')}
                </a>
              </li>
              <li>
                <a href="/cripto" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.crypto')}
                </a>
              </li>
              <li>
                <a href="/planos" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('nav.plans')}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="/loja" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('footer.marketplace')}
                </a>
              </li>
              <li>
                <a href="/agroconecta" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('footer.freight')}
                </a>
              </li>
              <li>
                <a href="/cripto" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('footer.crypto')}
                </a>
              </li>
              <li>
                <a href="/planos" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('footer.plans')}
                </a>
              </li>
              <li>
                <a href="/contato" className="text-gray-300 hover:text-green-400 transition-colors duration-200">
                  {t('footer.support')}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">{t('footer.address')}</p>
                <p className="text-white font-medium">Sinop - MT, Brasil</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">{t('footer.phone')}</p>
                <p className="text-white font-medium">(66) 99236-2830</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-300">{t('footer.email')}</p>
                <p className="text-white font-medium">contato@agroisync.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                               <span>© {currentYear} Agroisync. {t('footer.rights')}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>{t('footer.madeIn')}</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacidade" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                {t('footer.privacy')}
              </a>
              <a href="/termos" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                {t('footer.terms')}
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
};

export default Footer;
