import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Zap, 
  Clock, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const PremiumMarketplace = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('marketplace.features.technology'),
      description: t('marketplace.features.technologyDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t('marketplace.features.launch'),
      description: t('marketplace.features.launchDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('marketplace.features.development'),
      description: t('marketplace.features.developmentDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      text: t('marketplace.benefits.pricing'),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: t('marketplace.benefits.security'),
    },
    {
      icon: <Globe className="w-6 h-6" />,
      text: t('marketplace.benefits.global'),
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: t('marketplace.benefits.quality'),
    },
  ];

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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
  };

  return (
    <div className="premium-marketplace">
      {/* Hero Section */}
      <section className="premium-hero">
        <div className="premium-container">
          <motion.div
            className="premium-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="premium-hero-icon"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="premium-icon-container">
                <Rocket className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('marketplace.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('marketplace.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <Link to="/register" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('marketplace.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('marketplace.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Status Section */}
      <section className="premium-status">
        <div className="premium-container">
          <motion.div
            className="premium-status-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-status-header">
              <div className="premium-status-icon">
                <Clock className="w-12 h-12" />
              </div>
              <h2 className="premium-status-title">
                {t('marketplace.status')}
              </h2>
            </div>
            
            <p className="premium-status-description">
              {t('marketplace.description')}
            </p>

            <div className="premium-features-grid">
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
                  <div className="premium-feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="premium-feature-title">{feature.title}</h3>
                  <p className="premium-feature-description">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="premium-benefits">
        <div className="premium-container">
          <motion.div
            className="premium-benefits-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="premium-benefits-title">
              {t('marketplace.benefits.title')}
            </h2>
            
            <div className="premium-benefits-grid">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  className="premium-benefit-item"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                >
                  <div className="premium-benefit-icon">
                    {benefit.icon}
                  </div>
                  <span className="premium-benefit-text">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="premium-newsletter">
        <div className="premium-container">
          <motion.div
            className="premium-newsletter-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-newsletter-header">
              <Star className="w-12 h-12 premium-newsletter-icon" />
              <h2 className="premium-newsletter-title">
                {t('marketplace.notify.title')}
              </h2>
              <p className="premium-newsletter-subtitle">
                {t('marketplace.notify.subtitle')}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="premium-newsletter-form">
              <div className="premium-newsletter-input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('marketplace.notify.placeholder')}
                  className="premium-input"
                  required
                />
                <motion.button
                  type="submit"
                  className="premium-btn premium-btn-accent premium-btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('marketplace.notify.button')}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-marketplace {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="marketplace-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23marketplace-grain)"/></svg>');
          opacity: 0.6;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .premium-hero-icon {
          margin-bottom: var(--premium-space-xl);
        }

        .premium-icon-container {
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-3xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-xl);
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

        .premium-status {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-status-content {
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .premium-status-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--premium-space-lg);
          margin-bottom: var(--premium-space-xl);
        }

        .premium-status-icon {
          width: 80px;
          height: 80px;
          background: var(--premium-gradient-accent);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-lg);
        }

        .premium-status-title {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-status-title {
          color: var(--premium-teal);
        }

        .premium-status-description {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-4xl);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        [data-theme="dark"] .premium-status-description {
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
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-feature-description {
          color: var(--premium-gray-300);
        }

        .premium-benefits {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-benefits-content {
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .premium-benefits-title {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-4xl);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-benefits-title {
          color: var(--premium-teal);
        }

        .premium-benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--premium-space-xl);
        }

        .premium-benefit-item {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          padding: var(--premium-space-lg);
          background: var(--premium-white);
          border-radius: var(--premium-radius-xl);
          box-shadow: var(--premium-shadow-md);
          transition: all var(--premium-transition-normal);
        }

        .premium-benefit-item:hover {
          box-shadow: var(--premium-shadow-lg);
        }

        .premium-benefit-icon {
          width: 48px;
          height: 48px;
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          flex-shrink: 0;
        }

        .premium-benefit-text {
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
        }

        .premium-newsletter {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          position: relative;
          overflow: hidden;
        }

        .premium-newsletter::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="newsletter-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23FFFFFF" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23newsletter-grain)"/></svg>');
          opacity: 0.8;
        }

        .premium-newsletter-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .premium-newsletter-header {
          margin-bottom: var(--premium-space-3xl);
        }

        .premium-newsletter-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-yellow);
          filter: drop-shadow(0 4px 8px rgba(248, 172, 0, 0.3));
        }

        .premium-newsletter-title {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          margin-bottom: var(--premium-space-lg);
          color: var(--premium-white);
          letter-spacing: -0.04em;
        }

        .premium-newsletter-subtitle {
          font-size: var(--premium-text-xl);
          opacity: 0.95;
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        .premium-newsletter-form {
          display: flex;
          justify-content: center;
        }

        .premium-newsletter-input-group {
          display: flex;
          gap: var(--premium-space-md);
          max-width: 500px;
          width: 100%;
        }

        .premium-input {
          flex: 1;
          padding: var(--premium-space-lg);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-base);
          background: rgba(255, 255, 255, 0.1);
          color: var(--premium-white);
          transition: all var(--premium-transition-fast);
          backdrop-filter: blur(10px);
        }

        .premium-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .premium-input:focus {
          outline: none;
          border-color: var(--premium-yellow);
          box-shadow: 0 0 0 4px rgba(248, 172, 0, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-features-grid {
            grid-template-columns: 1fr;
          }

          .premium-benefits-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .premium-status-title,
          .premium-benefits-title,
          .premium-newsletter-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-newsletter-input-group {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-status-title,
          .premium-benefits-title,
          .premium-newsletter-title {
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

export default PremiumMarketplace;
