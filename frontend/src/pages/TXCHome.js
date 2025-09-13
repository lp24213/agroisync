import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TXCHome = () => {
  const { t } = useTranslation();

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: '🌾',
      title: t('home.features.marketplace.title'),
      description: t('home.features.marketplace.description'),
      link: '/marketplace',
    },
    {
      icon: '🔗',
      title: t('home.features.agroconecta.title'),
      description: t('home.features.agroconecta.description'),
      link: '/agroconecta',
    },
    {
      icon: '₿',
      title: t('home.features.crypto.title'),
      description: t('home.features.crypto.description'),
      link: '/crypto',
    },
    {
      icon: '📊',
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
      link: '/dashboard',
    },
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.users') },
    { number: '50K+', label: t('home.stats.transactions') },
    { number: '$2M+', label: t('home.stats.volume') },
    { number: '99.9%', label: t('home.stats.uptime') },
  ];

  return (
    <div className="txc-home">
      {/* Hero Section */}
      <section className="txc-hero">
        <div className="txc-container">
          <motion.div
            className="txc-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              {t('home.hero.title')}
            </motion.h1>
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div className="txc-hero-actions" variants={itemVariants}>
              <Link to="/marketplace" className="txc-btn txc-btn-primary txc-btn-lg">
                {t('home.hero.cta.primary')}
              </Link>
              <Link to="/about" className="txc-btn txc-btn-secondary txc-btn-lg">
                {t('home.hero.cta.secondary')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="txc-hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="txc-hero-cards">
              {features.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="txc-hero-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <div className="txc-hero-card-icon">{feature.icon}</div>
                  <h3 className="txc-hero-card-title">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="txc-stats">
        <div className="txc-container">
          <motion.div
            className="txc-stats-grid"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="txc-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="txc-stat-number">{stat.number}</div>
                <div className="txc-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="txc-features">
        <div className="txc-container">
          <motion.div
            className="txc-features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="txc-features-title">
              {t('home.features.title')}
            </h2>
            <p className="txc-features-subtitle">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="txc-features-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-feature-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="txc-feature-icon">{feature.icon}</div>
                <h3 className="txc-feature-title">{feature.title}</h3>
                <p className="txc-feature-description">{feature.description}</p>
                <Link to={feature.link} className="txc-feature-link">
                  {t('home.features.learnMore')} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="txc-cta">
        <div className="txc-container">
          <motion.div
            className="txc-cta-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="txc-cta-title">
              {t('home.cta.title')}
            </h2>
            <p className="txc-cta-subtitle">
              {t('home.cta.subtitle')}
            </p>
            <motion.div
              className="txc-cta-actions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/register" className="txc-btn txc-btn-accent txc-btn-lg">
                {t('home.cta.getStarted')}
              </Link>
              <Link to="/contact" className="txc-btn txc-btn-ghost txc-btn-lg">
                {t('home.cta.contact')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .txc-home {
          padding-top: 80px; /* Account for fixed header */
        }

        .txc-hero {
          padding: var(--txc-space-4xl) 0;
          background: var(--txc-gradient-secondary);
          position: relative;
          overflow: hidden;
        }

        .txc-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .txc-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .txc-hero-title {
          font-size: var(--txc-text-6xl);
          font-weight: var(--txc-font-extrabold);
          background: var(--txc-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--txc-space-lg);
          line-height: var(--txc-leading-tight);
        }

        .txc-hero-subtitle {
          font-size: var(--txc-text-xl);
          color: var(--txc-gray-600);
          margin-bottom: var(--txc-space-2xl);
          line-height: var(--txc-leading-relaxed);
        }

        [data-theme="dark"] .txc-hero-subtitle {
          color: var(--txc-gray-300);
        }

        .txc-hero-actions {
          display: flex;
          gap: var(--txc-space-lg);
          justify-content: center;
          flex-wrap: wrap;
        }

        .txc-btn-lg {
          padding: var(--txc-space-lg) var(--txc-space-2xl);
          font-size: var(--txc-text-lg);
        }

        .txc-hero-visual {
          margin-top: var(--txc-space-4xl);
          display: flex;
          justify-content: center;
        }

        .txc-hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--txc-space-xl);
          max-width: 600px;
        }

        .txc-hero-card {
          background: var(--txc-white);
          border-radius: var(--txc-radius-xl);
          padding: var(--txc-space-xl);
          text-align: center;
          box-shadow: var(--txc-shadow-lg);
          border: 1px solid var(--txc-gray-200);
          transition: all var(--txc-transition-normal);
        }

        .txc-hero-card:hover {
          box-shadow: var(--txc-shadow-xl);
        }

        .txc-hero-card-icon {
          font-size: 48px;
          margin-bottom: var(--txc-space-md);
        }

        .txc-hero-card-title {
          font-size: var(--txc-text-lg);
          font-weight: var(--txc-font-semibold);
          color: var(--txc-petroleum);
        }

        .txc-stats {
          padding: var(--txc-space-4xl) 0;
          background: var(--txc-white);
        }

        .txc-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--txc-space-xl);
        }

        .txc-stat-item {
          text-align: center;
          padding: var(--txc-space-xl);
          border-radius: var(--txc-radius-lg);
          background: var(--txc-gradient-secondary);
          transition: all var(--txc-transition-normal);
        }

        .txc-stat-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--txc-shadow-lg);
        }

        .txc-stat-number {
          font-size: var(--txc-text-4xl);
          font-weight: var(--txc-font-bold);
          background: var(--txc-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--txc-space-sm);
        }

        .txc-stat-label {
          font-size: var(--txc-text-base);
          color: var(--txc-gray-600);
          font-weight: var(--txc-font-medium);
        }

        [data-theme="dark"] .txc-stat-label {
          color: var(--txc-gray-300);
        }

        .txc-features {
          padding: var(--txc-space-4xl) 0;
          background: var(--txc-gradient-secondary);
        }

        .txc-features-header {
          text-align: center;
          margin-bottom: var(--txc-space-4xl);
        }

        .txc-features-title {
          font-size: var(--txc-text-4xl);
          font-weight: var(--txc-font-bold);
          color: var(--txc-petroleum);
          margin-bottom: var(--txc-space-lg);
        }

        [data-theme="dark"] .txc-features-title {
          color: var(--txc-teal);
        }

        .txc-features-subtitle {
          font-size: var(--txc-text-lg);
          color: var(--txc-gray-600);
          max-width: 600px;
          margin: 0 auto;
        }

        [data-theme="dark"] .txc-features-subtitle {
          color: var(--txc-gray-300);
        }

        .txc-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--txc-space-xl);
        }

        .txc-feature-card {
          background: var(--txc-white);
          border-radius: var(--txc-radius-xl);
          padding: var(--txc-space-2xl);
          box-shadow: var(--txc-shadow-md);
          border: 1px solid var(--txc-gray-200);
          transition: all var(--txc-transition-normal);
        }

        .txc-feature-card:hover {
          box-shadow: var(--txc-shadow-lg);
        }

        .txc-feature-icon {
          font-size: 48px;
          margin-bottom: var(--txc-space-lg);
        }

        .txc-feature-title {
          font-size: var(--txc-text-xl);
          font-weight: var(--txc-font-semibold);
          color: var(--txc-petroleum);
          margin-bottom: var(--txc-space-md);
        }

        [data-theme="dark"] .txc-feature-title {
          color: var(--txc-teal);
        }

        .txc-feature-description {
          color: var(--txc-gray-600);
          margin-bottom: var(--txc-space-lg);
          line-height: var(--txc-leading-relaxed);
        }

        [data-theme="dark"] .txc-feature-description {
          color: var(--txc-gray-300);
        }

        .txc-feature-link {
          color: var(--txc-teal);
          font-weight: var(--txc-font-semibold);
          text-decoration: none;
          transition: color var(--txc-transition-fast);
        }

        .txc-feature-link:hover {
          color: var(--txc-petroleum);
        }

        [data-theme="dark"] .txc-feature-link:hover {
          color: var(--txc-yellow);
        }

        .txc-cta {
          padding: var(--txc-space-4xl) 0;
          background: var(--txc-gradient-primary);
          color: var(--txc-white);
        }

        .txc-cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .txc-cta-title {
          font-size: var(--txc-text-4xl);
          font-weight: var(--txc-font-bold);
          margin-bottom: var(--txc-space-lg);
          color: var(--txc-white);
        }

        .txc-cta-subtitle {
          font-size: var(--txc-text-lg);
          margin-bottom: var(--txc-space-2xl);
          opacity: 0.9;
        }

        .txc-cta-actions {
          display: flex;
          gap: var(--txc-space-lg);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .txc-hero-title {
            font-size: var(--txc-text-4xl);
          }

          .txc-hero-cards {
            grid-template-columns: 1fr;
            gap: var(--txc-space-lg);
          }

          .txc-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--txc-space-lg);
          }

          .txc-features-grid {
            grid-template-columns: 1fr;
          }

          .txc-hero-actions,
          .txc-cta-actions {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .txc-stats-grid {
            grid-template-columns: 1fr;
          }

          .txc-hero-title {
            font-size: var(--txc-text-3xl);
          }

          .txc-features-title,
          .txc-cta-title {
            font-size: var(--txc-text-3xl);
          }
        }
      `}</style>
    </div>
  );
};

export default TXCHome;
