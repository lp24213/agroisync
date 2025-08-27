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
    <footer className={`relative ${isDark ? 'bg-black text-white' : 'bg-slate-900 text-white'}`}>
      {/* Background Pattern Premium */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-agro-green via-agro-gold to-tech-blue"></div>
      </div>
      
      {/* Linha superior premium */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green via-agro-gold to-tech-green"></div>

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
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-agro-green to-tech-green flex items-center justify-center shadow-md"
                >
                  <span className="text-white font-bold text-xl">A</span>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gradient-agro">Agroisync</h3>
                  <p className="text-slate-400 text-sm">{t('footer.tagline')}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md">
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
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300">
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
                <a href="/" className="text-slate-300 hover:text-slate-400 transition-colors duration-200">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="/sobre" className="text-slate-300 hover:text-slate-400 transition-colors duration-200">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="/loja" className="text-slate-300 hover:text-slate-400 transition-colors duration-200">
                  {t('nav.store')}
                </a>
              </li>
              <li>
                <a href="/agroconecta" className="text-slate-300 hover:text-slate-400 transition-colors duration-200">
                  {t('nav.agroconecta')}
                </a>
              </li>
              <li>
                <a href="/cripto" className="text-slate-300 hover:text-slate-400 transition-colors duration-200">
                  {t('nav.crypto')}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.contact')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Sinop - MT, Brasil</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">(66) 99236-2830</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">contato@agroisync.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-slate-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">
                © {currentYear} Agroisync. {t('footer.rights')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={scrollToTop}
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-600 transition-colors duration-300"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
