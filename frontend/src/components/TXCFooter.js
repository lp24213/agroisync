import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TXCFooter = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('footer.product'),
      links: [
        { path: '/marketplace', label: t('nav.marketplace') },
        { path: '/agroconecta', label: t('nav.agroconecta') },
        { path: '/crypto', label: t('nav.crypto') },
        { path: '/plans', label: t('nav.plans') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
        { path: '/help', label: t('nav.help') },
        { path: '/faq', label: t('nav.faq') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { path: '/terms', label: t('nav.terms') },
        { path: '/privacy', label: t('nav.privacy') },
        { path: '/cookies', label: t('nav.cookies') },
      ],
    },
    {
      title: t('footer.connect'),
      links: [
        { href: 'https://linkedin.com/company/agroisync', label: 'LinkedIn' },
        { href: 'https://twitter.com/agroisync', label: 'Twitter' },
        { href: 'https://instagram.com/agroisync', label: 'Instagram' },
        { href: 'https://youtube.com/agroisync', label: 'YouTube' },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.footer
      className="txc-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="txc-container">
        {/* Main Footer Content */}
        <div className="txc-footer-main">
          {/* Brand Section */}
          <motion.div
            className="txc-footer-brand"
            variants={itemVariants}
          >
            <div className="txc-footer-logo">
              <img
                src="/agroisync-main-logo.png"
                alt="AGROISYNC"
                className="txc-footer-logo-img"
              />
              <span className="txc-footer-logo-text">AGROISYNC</span>
            </div>
            <p className="txc-footer-description">
              {t('footer.description')}
            </p>
            <div className="txc-footer-social">
              {footerSections[3].links.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="txc-social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className="txc-footer-links">
            {footerSections.slice(0, 3).map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="txc-footer-section"
                variants={itemVariants}
              >
                <h3 className="txc-footer-section-title">{section.title}</h3>
                <ul className="txc-footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    >
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="txc-footer-link"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.path} className="txc-footer-link">
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="txc-footer-newsletter"
          variants={itemVariants}
        >
          <div className="txc-newsletter-content">
            <h3 className="txc-newsletter-title">
              {t('footer.newsletter.title')}
            </h3>
            <p className="txc-newsletter-description">
              {t('footer.newsletter.description')}
            </p>
            <form className="txc-newsletter-form">
              <div className="txc-newsletter-input-group">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="txc-newsletter-input"
                />
                <motion.button
                  type="submit"
                  className="txc-btn txc-btn-accent"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('footer.newsletter.subscribe')}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="txc-footer-bottom"
          variants={itemVariants}
        >
          <div className="txc-footer-bottom-content">
            <p className="txc-footer-copyright">
              © {new Date().getFullYear()} AGROISYNC. {t('footer.copyright')}
            </p>
            <div className="txc-footer-bottom-links">
              <Link to="/terms" className="txc-footer-bottom-link">
                {t('nav.terms')}
              </Link>
              <Link to="/privacy" className="txc-footer-bottom-link">
                {t('nav.privacy')}
              </Link>
              <Link to="/cookies" className="txc-footer-bottom-link">
                {t('nav.cookies')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>

      <style jsx>{`
      .txc-footer {
        background: var(--txc-gradient-secondary);
        border-top: 1px solid var(--txc-gray-200);
        margin-top: var(--txc-space-4xl);
      }

      [data-theme="dark"] .txc-footer {
        background: linear-gradient(135deg, var(--txc-gray-800) 0%, var(--txc-gray-900) 100%);
        border-top: 1px solid var(--txc-gray-700);
      }

      .txc-footer-main {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--txc-space-4xl);
        padding: var(--txc-space-4xl) 0;
      }

      .txc-footer-brand {
        display: flex;
        flex-direction: column;
        gap: var(--txc-space-lg);
      }

      .txc-footer-logo {
        display: flex;
        align-items: center;
        gap: var(--txc-space-sm);
      }

      .txc-footer-logo-img {
        width: 48px;
        height: 48px;
        object-fit: contain;
      }

      .txc-footer-logo-text {
        font-size: var(--txc-text-2xl);
        font-weight: var(--txc-font-bold);
        background: var(--txc-gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .txc-footer-description {
        color: var(--txc-gray-600);
        line-height: var(--txc-leading-relaxed);
        max-width: 300px;
      }

      [data-theme="dark"] .txc-footer-description {
        color: var(--txc-gray-300);
      }

      .txc-footer-social {
        display: flex;
        gap: var(--txc-space-md);
      }

      .txc-social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--txc-radius-md);
        background: var(--txc-white);
        color: var(--txc-teal);
        text-decoration: none;
        font-weight: var(--txc-font-medium);
        font-size: var(--txc-text-sm);
        box-shadow: var(--txc-shadow-sm);
        transition: all var(--txc-transition-fast);
      }

      .txc-social-link:hover {
        background: var(--txc-gradient-primary);
        color: var(--txc-white);
        box-shadow: var(--txc-shadow-md);
      }

      .txc-footer-links {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--txc-space-xl);
      }

      .txc-footer-section {
        display: flex;
        flex-direction: column;
        gap: var(--txc-space-md);
      }

      .txc-footer-section-title {
        font-size: var(--txc-text-lg);
        font-weight: var(--txc-font-semibold);
        color: var(--txc-petroleum);
        margin-bottom: var(--txc-space-sm);
      }

      [data-theme="dark"] .txc-footer-section-title {
        color: var(--txc-teal);
      }

      .txc-footer-section-links {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: var(--txc-space-sm);
      }

      .txc-footer-link {
        color: var(--txc-gray-600);
        text-decoration: none;
        font-weight: var(--txc-font-medium);
        transition: color var(--txc-transition-fast);
      }

      .txc-footer-link:hover {
        color: var(--txc-teal);
      }

      [data-theme="dark"] .txc-footer-link {
        color: var(--txc-gray-300);
      }

      [data-theme="dark"] .txc-footer-link:hover {
        color: var(--txc-yellow);
      }

      .txc-footer-newsletter {
        padding: var(--txc-space-3xl) 0;
        border-top: 1px solid var(--txc-gray-200);
        border-bottom: 1px solid var(--txc-gray-200);
      }

      [data-theme="dark"] .txc-footer-newsletter {
        border-top: 1px solid var(--txc-gray-700);
        border-bottom: 1px solid var(--txc-gray-700);
      }

      .txc-newsletter-content {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
      }

      .txc-newsletter-title {
        font-size: var(--txc-text-3xl);
        font-weight: var(--txc-font-bold);
        color: var(--txc-petroleum);
        margin-bottom: var(--txc-space-md);
      }

      [data-theme="dark"] .txc-newsletter-title {
        color: var(--txc-teal);
      }

      .txc-newsletter-description {
        color: var(--txc-gray-600);
        margin-bottom: var(--txc-space-xl);
        font-size: var(--txc-text-lg);
      }

      [data-theme="dark"] .txc-newsletter-description {
        color: var(--txc-gray-300);
      }

      .txc-newsletter-form {
        display: flex;
        justify-content: center;
      }

      .txc-newsletter-input-group {
        display: flex;
        gap: var(--txc-space-sm);
        max-width: 400px;
        width: 100%;
      }

      .txc-newsletter-input {
        flex: 1;
        padding: var(--txc-space-md);
        border: 2px solid var(--txc-gray-200);
        border-radius: var(--txc-radius-md);
        font-size: var(--txc-text-base);
        background: var(--txc-white);
        transition: all var(--txc-transition-fast);
      }

      .txc-newsletter-input:focus {
        outline: none;
        border-color: var(--txc-teal);
        box-shadow: 0 0 0 3px rgba(86, 184, 185, 0.1);
      }

      [data-theme="dark"] .txc-newsletter-input {
        background: var(--txc-gray-800);
        border-color: var(--txc-gray-600);
        color: var(--txc-white);
      }

      .txc-footer-bottom {
        padding: var(--txc-space-xl) 0;
      }

      .txc-footer-bottom-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--txc-space-md);
      }

      .txc-footer-copyright {
        color: var(--txc-gray-500);
        font-size: var(--txc-text-sm);
      }

      [data-theme="dark"] .txc-footer-copyright {
        color: var(--txc-gray-400);
      }

      .txc-footer-bottom-links {
        display: flex;
        gap: var(--txc-space-lg);
      }

      .txc-footer-bottom-link {
        color: var(--txc-gray-500);
        text-decoration: none;
        font-size: var(--txc-text-sm);
        font-weight: var(--txc-font-medium);
        transition: color var(--txc-transition-fast);
      }

      .txc-footer-bottom-link:hover {
        color: var(--txc-teal);
      }

      [data-theme="dark"] .txc-footer-bottom-link {
        color: var(--txc-gray-400);
      }

      [data-theme="dark"] .txc-footer-bottom-link:hover {
        color: var(--txc-yellow);
      }

      @media (max-width: 768px) {
        .txc-footer-main {
          grid-template-columns: 1fr;
          gap: var(--txc-space-2xl);
        }

        .txc-footer-links {
          grid-template-columns: repeat(2, 1fr);
          gap: var(--txc-space-lg);
        }

        .txc-footer-bottom-content {
          flex-direction: column;
          text-align: center;
        }

        .txc-newsletter-input-group {
          flex-direction: column;
        }

        .txc-footer-social {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .txc-footer-links {
          grid-template-columns: 1fr;
        }

        .txc-footer-bottom-links {
          flex-direction: column;
          gap: var(--txc-space-sm);
        }
      }
    `}</style>
  );
};

export default TXCFooter;
