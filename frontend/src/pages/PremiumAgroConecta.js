import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe
} from 'lucide-react';

const PremiumAgroConecta = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: t('agroconecta.features.freight'),
      description: t('agroconecta.features.freightDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('agroconecta.features.tracking'),
      description: t('agroconecta.features.trackingDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('agroconecta.features.network'),
      description: t('agroconecta.features.networkDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('agroconecta.features.ai'),
      description: t('agroconecta.features.aiDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-accent)',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('agroconecta.features.security'),
      description: t('agroconecta.features.securityDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('agroconecta.features.fast'),
      description: t('agroconecta.features.fastDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('agroconecta.howItWorks.step1'),
      description: t('agroconecta.howItWorks.step1Desc'),
      icon: <Truck className="w-6 h-6" />,
    },
    {
      number: '02',
      title: t('agroconecta.howItWorks.step2'),
      description: t('agroconecta.howItWorks.step2Desc'),
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      number: '03',
      title: t('agroconecta.howItWorks.step3'),
      description: t('agroconecta.howItWorks.step3Desc'),
      icon: <CheckCircle className="w-6 h-6" />,
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

  return (
    <div className="premium-agroconecta">
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
                <Truck className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('agroconecta.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('agroconecta.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <Link to="/register" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('agroconecta.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/marketplace" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('agroconecta.explore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="premium-features">
        <div className="premium-container">
          <motion.div
            className="premium-features-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-features-header">
              <h2 className="premium-features-title">
                {t('agroconecta.features.title')}
              </h2>
              <p className="premium-features-subtitle">
                {t('agroconecta.features.subtitle')}
              </p>
            </div>

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

      {/* How It Works Section */}
      <section className="premium-how-it-works">
        <div className="premium-container">
          <motion.div
            className="premium-how-it-works-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-how-it-works-header">
              <Star className="w-12 h-12 premium-how-it-works-icon" />
              <h2 className="premium-how-it-works-title">
                {t('agroconecta.howItWorks.title')}
              </h2>
              <p className="premium-how-it-works-subtitle">
                {t('agroconecta.howItWorks.subtitle')}
              </p>
            </div>

            <div className="premium-steps-grid">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="premium-step-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="premium-step-number">{step.number}</div>
                  <div className="premium-step-icon">
                    {step.icon}
                  </div>
                  <h3 className="premium-step-title">{step.title}</h3>
                  <p className="premium-step-description">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta">
        <div className="premium-container">
          <motion.div
            className="premium-cta-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-cta-header">
              <Globe className="w-12 h-12 premium-cta-icon" />
              <h2 className="premium-cta-title">
                {t('agroconecta.cta.title')}
              </h2>
              <p className="premium-cta-subtitle">
                {t('agroconecta.cta.subtitle')}
              </p>
            </div>

            <motion.div
              className="premium-cta-actions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/register" className="premium-btn premium-btn-cta premium-btn-lg">
                {t('agroconecta.cta.haveLoad')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="premium-btn premium-btn-ghost premium-btn-lg">
                {t('agroconecta.cta.transporter')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-agroconecta {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="agroconecta-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23agroconecta-grain)"/></svg>');
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

        .premium-features {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-features-content {
          max-width: 1200px;
          margin: 0 auto;
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

        .premium-how-it-works {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-how-it-works-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .premium-how-it-works-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-how-it-works-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-how-it-works-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-how-it-works-title {
          color: var(--premium-teal);
        }

        .premium-how-it-works-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-how-it-works-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-step-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .premium-step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-accent);
        }

        .premium-step-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-step-number {
          font-size: var(--premium-text-4xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--premium-space-lg);
        }

        .premium-step-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--premium-space-lg);
          background: var(--premium-gradient-accent);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-step-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-step-title {
          color: var(--premium-teal);
        }

        .premium-step-description {
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-step-description {
          color: var(--premium-gray-300);
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

        .premium-cta-header {
          margin-bottom: var(--premium-space-3xl);
        }

        .premium-cta-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-yellow);
          filter: drop-shadow(0 4px 8px rgba(248, 172, 0, 0.3));
        }

        .premium-cta-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          margin-bottom: var(--premium-space-lg);
          color: var(--premium-white);
          letter-spacing: -0.04em;
        }

        .premium-cta-subtitle {
          font-size: var(--premium-text-xl);
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

          .premium-features-grid {
            grid-template-columns: 1fr;
          }

          .premium-steps-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions,
          .premium-cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .premium-features-title,
          .premium-how-it-works-title,
          .premium-cta-title {
            font-size: var(--premium-text-4xl);
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-features-title,
          .premium-how-it-works-title,
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

export default PremiumAgroConecta;
