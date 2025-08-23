import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
    <footer className="relative z-10 bg-bg-secondary/50 backdrop-blur-sm border-t border-border-primary">
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
                <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">AC</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gradient">AgroConecta</h3>
                  <p className="text-sm text-text-tertiary">Future of Agribusiness</p>
                </div>
              </Link>
              
              <p className="text-text-secondary leading-relaxed mb-6 max-w-md">
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
                    className="w-10 h-10 bg-bg-card border border-border-primary rounded-xl flex items-center justify-center text-lg hover:bg-bg-card-hover hover:border-accent-primary transition-all duration-300 group"
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
              <h4 className="text-lg font-semibold text-text-primary mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-accent-primary transition-colors duration-300 text-sm"
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
        <div className="border-t border-border-primary/50 mb-8" />

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h4 className="text-xl font-semibold text-text-primary mb-4">
            {t('footer.newsletter.title')}
          </h4>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            {t('footer.newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('footer.newsletter.placeholder')}
              className="input flex-1"
            />
            <button className="btn btn-primary whitespace-nowrap">
              {t('footer.newsletter.subscribe')}
            </button>
          </div>
        </motion.div>

        {/* Linha divisória */}
        <div className="border-t border-border-primary/50 mb-8" />

        {/* Rodapé inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-text-tertiary text-sm"
          >
            © {currentYear} AgroConecta. {t('footer.rights')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6 text-sm"
          >
            <Link to="/privacidade" className="text-text-tertiary hover:text-accent-primary transition-colors duration-300">
              {t('footer.privacy')}
            </Link>
            <Link to="/termos" className="text-text-tertiary hover:text-accent-primary transition-colors duration-300">
              {t('footer.terms')}
            </Link>
            <Link to="/cookies" className="text-text-tertiary hover:text-accent-primary transition-colors duration-300">
              {t('footer.cookies')}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Indicador de tema no rodapé (apenas para debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center py-2 text-xs text-text-tertiary bg-bg-tertiary/30">
          Tema atual: {theme} | Versão: {process.env.REACT_APP_VERSION || '1.0.0'}
        </div>
      )}
    </footer>
  );
};

export default Footer;
