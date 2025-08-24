import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('footer.company.title'),
      links: [
        { label: t('footer.company.about'), path: '/sobre' },
        { label: t('footer.company.contact'), path: '/contato' },
        { label: t('footer.company.careers'), path: '/carreiras' },
        { label: t('footer.company.press'), path: '/imprensa' }
      ]
    },
    {
      title: t('footer.services.title'),
      links: [
        { label: t('footer.services.quotes'), path: '/cotacao' },
        { label: t('footer.services.marketplace'), path: '/loja' },
        { label: t('footer.services.agroconnect'), path: '/agroconecta' },
        { label: t('footer.services.crypto'), path: '/cripto' }
      ]
    },
    {
      title: t('footer.support.title'),
      links: [
        { label: t('footer.support.help'), path: '/ajuda' },
        { label: t('footer.support.faq'), path: '/faq' },
        { label: t('footer.support.documentation'), path: '/documentacao' },
        { label: t('footer.support.status'), path: '/status' }
      ]
    },
    {
      title: t('footer.legal.title'),
      links: [
        { label: t('footer.legal.privacy'), path: '/privacidade' },
        { label: t('footer.legal.terms'), path: '/termos' },
        { label: t('footer.legal.cookies'), path: '/cookies' },
        { label: t('footer.legal.compliance'), path: '/compliance' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com/company/agroisync' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, url: 'https://twitter.com/agroisync' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/agroisync' },
    { name: 'YouTube', icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@agroisync' }
  ];

  return (
    <footer className="footer-theme relative z-10 backdrop-blur-sm border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Conteúdo principal do footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-cyan-400 to-purple-500'
                    : 'bg-gradient-to-br from-green-600 to-blue-600'
                }`}>
                  <span className="text-2xl font-bold text-white">AC</span>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('common.brand')}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('common.tagline')}
                  </p>
                </div>
              </Link>
              
              <p className={`leading-relaxed mb-6 max-w-md ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('footer.description')}
              </p>

              {/* Links sociais */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDark 
                        ? 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50' 
                        : 'text-gray-500 hover:text-green-600 hover:bg-gray-100/50'
                    }`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Seções de links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors duration-200 hover:underline ${
                        isDark 
                          ? 'text-gray-300 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Linha divisória */}
        <div className={`border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } mb-8`} />

        {/* Rodapé inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            © {currentYear} {t('common.brand')}. {t('footer.rights')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`flex space-x-6 mt-4 md:mt-0 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <Link to="/privacidade" className="text-sm hover:underline">
              {t('footer.legal.privacy')}
            </Link>
            <Link to="/termos" className="text-sm hover:underline">
              {t('footer.legal.terms')}
            </Link>
            <Link to="/cookies" className="text-sm hover:underline">
              {t('footer.legal.cookies')}
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
