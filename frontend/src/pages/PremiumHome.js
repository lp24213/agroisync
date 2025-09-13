import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  // Removed unused imports
} from 'lucide-react';

const PremiumHome = () => {
  const { t } = useTranslation();
  // Removed unused state and scroll variables

  // Removed unused scroll effect


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
    <div className="txc-home">
      {/* Hero Section TXC */}
      <section className="txc-hero">
        <div className="txc-container">
          <motion.div
            className="txc-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="txc-title" variants={itemVariants}>
              {t('home.hero.title')}
            </motion.h1>
            <motion.p className="txc-subtitle" variants={itemVariants}>
              {t('home.hero.subtitle')}
            </motion.p>
            <motion.div className="txc-hero-actions" variants={itemVariants}>
              <Link to="/marketplace" className="txc-btn txc-btn-primary">
                {t('home.hero.cta.primary')}
              </Link>
              <Link to="/about" className="txc-btn txc-btn-secondary">
                {t('home.hero.cta.secondary')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Visual TXC */}
          <motion.div
            className="txc-hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <div className="txc-hero-cards">
              {features.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="txc-card"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                  whileHover={{ y: -15, scale: 1.05 }}
                >
                  <div className="txc-card-icon">{feature.icon}</div>
                  <h3 className="txc-card-title">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section TXC */}
      <section className="txc-section-alt">
        <div className="txc-container">
          <motion.div
            className="txc-grid-4"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="txc-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.08, y: -8 }}
              >
                <div className="txc-stat-number">{stat.number}</div>
                <div className="txc-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section TXC */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            className="txc-features-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="txc-section-title">
              {t('home.features.title')}
            </h2>
            <p className="txc-section-subtitle">
              {t('home.features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="txc-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <div className="txc-feature-icon">{feature.icon}</div>
                <h3 className="txc-feature-title">{feature.title}</h3>
                <p className="txc-feature-description">{feature.description}</p>
                <Link to={feature.link} className="txc-btn txc-btn-accent">
                  {t('home.features.learnMore')} →
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section TXC */}
      <section className="txc-section-alt">
        <div className="txc-container">
          <motion.div
            className="txc-cta-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="txc-title">
              {t('home.cta.title')}
            </h2>
            <p className="txc-subtitle">
              {t('home.cta.subtitle')}
            </p>
            <motion.div
              className="txc-cta-actions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/register" className="txc-btn txc-btn-primary">
                {t('home.cta.getStarted')}
              </Link>
              <Link to="/contact" className="txc-btn txc-btn-secondary">
                {t('home.cta.contact')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .txc-home {
          padding-top: 88px; /* Account for fixed header */
        }

        .txc-hero-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .txc-hero-visual {
          margin-top: var(--txc-space-5xl);
          display: flex;
          justify-content: center;
        }

        .txc-hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--txc-space-2xl);
          max-width: 800px;
        }

        .txc-card-icon {
          font-size: 64px;
          margin-bottom: var(--txc-space-lg);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .txc-card-title {
          font-size: var(--txc-text-xl);
          font-weight: var(--txc-font-bold);
          color: var(--txc-gray-800);
          letter-spacing: -0.02em;
        }

        .txc-stat-number {
          font-size: var(--txc-text-5xl);
          font-weight: var(--txc-font-black);
          background: var(--txc-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--txc-space-sm);
          letter-spacing: -0.03em;
        }

        .txc-stat-label {
          font-size: var(--txc-text-lg);
          color: var(--txc-gray-600);
          font-weight: var(--txc-font-semibold);
          letter-spacing: 0.025em;
        }

        .txc-feature-icon {
          font-size: 64px;
          margin-bottom: var(--txc-space-xl);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .txc-feature-title {
          font-size: var(--txc-text-2xl);
          font-weight: var(--txc-font-bold);
          color: var(--txc-gray-800);
          margin-bottom: var(--txc-space-lg);
          letter-spacing: -0.02em;
        }

        .txc-feature-description {
          color: var(--txc-gray-600);
          margin-bottom: var(--txc-space-xl);
          line-height: var(--txc-leading-relaxed);
          font-size: var(--txc-text-lg);
          font-weight: var(--txc-font-medium);
        }

        .txc-hero-actions,
        .txc-cta-actions {
          display: flex;
          gap: var(--txc-space-xl);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .txc-hero-cards {
            grid-template-columns: 1fr;
            gap: var(--txc-space-xl);
          }

          .txc-hero-actions,
          .txc-cta-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumHome;
