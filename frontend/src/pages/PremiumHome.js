import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PremiumHome = () => {
  const { t } = useTranslation();

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: '🌾',
      title: t('home.features.marketplace.title'),
      description: t('home.features.marketplace.description'),
      link: '/marketplace',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: '🔗',
      title: t('home.features.agroconecta.title'),
      description: t('home.features.agroconecta.description'),
      link: '/agroconecta',
      gradient: 'var(--premium-gradient-accent)',
    },
    {
      icon: '₿',
      title: t('home.features.crypto.title'),
      description: t('home.features.crypto.description'),
      link: '/crypto',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: '📊',
      title: t('home.features.analytics.title'),
      description: t('home.features.analytics.description'),
      link: '/dashboard',
      gradient: 'var(--premium-gradient-cta)',
    },
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.users'), color: 'var(--premium-teal)' },
    { number: '50K+', label: t('home.stats.transactions'), color: 'var(--premium-petroleum)' },
    { number: '$2M+', label: t('home.stats.volume'), color: 'var(--premium-yellow)' },
    { number: '99.9%', label: t('home.stats.uptime'), color: 'var(--premium-teal)' },
  ];

  return (
    <div className="premium-home">
      {/* Hero Section Premium */}
      <section className="premium-hero">
        <div className="premium-container">
          <motion.div
            className="premium-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('home.hero.title')}
            </motion.h1>
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <Link to="/marketplace" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('home.hero.cta.primary')}
              </Link>
              <Link to="/about" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('home.hero.cta.secondary')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual Premium */}
          <motion.div
            className="premium-hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <div className="premium-hero-cards">
              {features.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="premium-hero-card"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                  whileHover={{ y: -15, scale: 1.05 }}
                  style={{ '--card-gradient': feature.gradient }}
                >
                  <div className="premium-hero-card-icon">{feature.icon}</div>
                  <h3 className="premium-hero-card-title">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section Premium */}
      <section className="premium-stats">
        <div className="premium-container">
          <motion.div
            className="premium-stats-grid"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="premium-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.08, y: -8 }}
                style={{ '--stat-color': stat.color }}
              >
                <div className="premium-stat-number">{stat.number}</div>
                <div className="premium-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section Premium */}
      <section className="premium-features">
        <div className="premium-container">
          <motion.div
            className="premium-features-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="premium-features-title">
              {t('home.features.title')}
            </h2>
            <p className="premium-features-subtitle">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="premium-features-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="premium-feature-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ '--feature-gradient': feature.gradient }}
              >
                <div className="premium-feature-icon">{feature.icon}</div>
                <h3 className="premium-feature-title">{feature.title}</h3>
                <p className="premium-feature-description">{feature.description}</p>
                <Link to={feature.link} className="premium-feature-link">
                  {t('home.features.learnMore')} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section Premium */}
      <section className="premium-cta">
        <div className="premium-container">
          <motion.div
            className="premium-cta-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="premium-cta-title">
              {t('home.cta.title')}
            </h2>
            <p className="premium-cta-subtitle">
              {t('home.cta.subtitle')}
            </p>
            <motion.div
              className="premium-cta-actions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/register" className="premium-btn premium-btn-cta premium-btn-lg">
                {t('home.cta.getStarted')}
              </Link>
              <Link to="/contact" className="premium-btn premium-btn-ghost premium-btn-lg">
                {t('home.cta.contact')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-home {
          padding-top: 88px; /* Account for fixed header */
        }

        .premium-hero {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-hero);
          position: relative;
          overflow: hidden;
        }

        .premium-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.6;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .premium-hero-title {
          font-size: var(--premium-text-7xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--premium-space-xl);
          line-height: var(--premium-leading-tight);
          letter-spacing: -0.05em;
        }

        .premium-hero-subtitle {
          font-size: var(--premium-text-2xl);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-3xl);
          line-height: var(--premium-leading-relaxed);
          font-weight: var(--premium-font-medium);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        [data-theme="dark"] .premium-hero-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-hero-actions {
          display: flex;
          gap: var(--premium-space-xl);
          justify-content: center;
          flex-wrap: wrap;
        }

        .premium-hero-visual {
          margin-top: var(--premium-space-5xl);
          display: flex;
          justify-content: center;
        }

        .premium-hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--premium-space-2xl);
          max-width: 800px;
        }

        .premium-hero-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-2xl);
          text-align: center;
          box-shadow: var(--premium-shadow-xl);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-hero-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-gradient);
        }

        .premium-hero-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-hero-card-icon {
          font-size: 64px;
          margin-bottom: var(--premium-space-lg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .premium-hero-card-title {
          font-size: var(--premium-text-xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          letter-spacing: -0.02em;
        }

        .premium-stats {
          padding: var(--premium-space-5xl) 0;
          background: var(--premium-white);
        }

        .premium-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--premium-space-2xl);
        }

        .premium-stat-item {
          text-align: center;
          padding: var(--premium-space-2xl);
          border-radius: var(--premium-radius-2xl);
          background: var(--premium-gradient-secondary);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--stat-color);
        }

        .premium-stat-item:hover {
          transform: translateY(-8px);
          box-shadow: var(--premium-shadow-xl);
        }

        .premium-stat-number {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          color: var(--stat-color);
          margin-bottom: var(--premium-space-sm);
          letter-spacing: -0.03em;
        }

        .premium-stat-label {
          font-size: var(--premium-text-lg);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-semibold);
          letter-spacing: 0.025em;
        }

        [data-theme="dark"] .premium-stat-label {
          color: var(--premium-gray-300);
        }

        .premium-features {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-features-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-features-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-xl);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-features-title {
          color: var(--premium-teal);
        }

        .premium-features-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          max-width: 700px;
          margin: 0 auto;
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-features-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-feature-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--feature-gradient);
        }

        .premium-feature-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-feature-icon {
          font-size: 64px;
          margin-bottom: var(--premium-space-xl);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .premium-feature-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-feature-title {
          color: var(--premium-teal);
        }

        .premium-feature-description {
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-xl);
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-feature-description {
          color: var(--premium-gray-300);
        }

        .premium-feature-link {
          color: var(--premium-teal);
          font-weight: var(--premium-font-bold);
          text-decoration: none;
          transition: all var(--premium-transition-fast);
          font-size: var(--premium-text-lg);
          letter-spacing: 0.025em;
        }

        .premium-feature-link:hover {
          color: var(--premium-petroleum);
          transform: translateX(8px);
        }

        [data-theme="dark"] .premium-feature-link:hover {
          color: var(--premium-yellow);
        }

        .premium-cta {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          position: relative;
          overflow: hidden;
        }

        .premium-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="cta-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23FFFFFF" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23cta-grain)"/></svg>');
          opacity: 0.8;
        }

        .premium-cta-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .premium-cta-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          margin-bottom: var(--premium-space-xl);
          color: var(--premium-white);
          letter-spacing: -0.04em;
        }

        .premium-cta-subtitle {
          font-size: var(--premium-text-xl);
          margin-bottom: var(--premium-space-3xl);
          opacity: 0.95;
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        .premium-cta-actions {
          display: flex;
          gap: var(--premium-space-xl);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-hero-cards {
            grid-template-columns: 1fr;
            gap: var(--premium-space-xl);
          }

          .premium-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--premium-space-xl);
          }

          .premium-features-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions,
          .premium-cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .premium-features-title,
          .premium-cta-title {
            font-size: var(--premium-text-4xl);
          }
        }

        @media (max-width: 480px) {
          .premium-stats-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-features-title,
          .premium-cta-title {
            font-size: var(--premium-text-3xl);
          }

          .premium-hero-subtitle {
            font-size: var(--premium-text-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumHome;
