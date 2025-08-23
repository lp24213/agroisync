import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const { isDark, isLight } = useTheme();

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
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/agroconecta' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/agroconecta' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com/agroconecta' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/@agroconecta' }
  ];

  return (
    <footer className={`relative z-10 backdrop-blur-sm border-t ${
      isDark 
        ? 'bg-dark-bg-secondary/50 border-dark-border-primary' 
        : 'bg-light-bg-secondary/50 border-light-border-primary'
    }`}>
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
                    ? 'bg-gradient-to-br from-dark-accent-primary to-dark-accent-secondary'
                    : 'bg-gradient-to-br from-light-accent-primary to-light-accent-secondary'
                }`}>
                  <span className="text-2xl font-bold text-white">AC</span>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                  }`}>
                    AgroConecta
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
                  }`}>
                    Future of Agribusiness
                  </p>
                </div>
              </Link>
              
              <p className={`leading-relaxed mb-6 max-w-md ${
                isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
              }`}>
                {t('footer.description')}
              </p>
              
              {/* Redes sociais */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`w-10 h-10 border rounded-xl flex items-center justify-center text-lg transition-all duration-300 group ${
                      isDark
                        ? 'bg-dark-bg-card border-dark-border-primary hover:bg-dark-bg-card-hover hover:border-dark-accent-primary'
                        : 'bg-light-bg-card border-light-border-primary hover:bg-light-bg-card-hover hover:border-light-accent-primary'
                    }`}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Seções de links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
              }`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors duration-300 hover:underline ${
                        isDark 
                          ? 'text-dark-text-secondary hover:text-dark-text-primary' 
                          : 'text-light-text-secondary hover:text-light-text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Linha divisória */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`h-px mb-8 ${
            isDark ? 'bg-dark-border-primary' : 'bg-light-border-primary'
          }`}
        />

        {/* Rodapé inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`text-sm ${
              isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
            }`}
          >
            © {currentYear} AgroConecta. {t('footer.rights')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className={`flex items-center space-x-6 mt-4 md:mt-0 ${
              isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
            }`}
          >
            <span className="text-xs">
              {t('footer.version')} 2.0.0
            </span>
            <span className="text-xs">
              {t('footer.lastUpdate')} {new Date().toLocaleDateString()}
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
