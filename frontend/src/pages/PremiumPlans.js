import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Crown,
  Sparkles,
  Globe
} from 'lucide-react';

const PremiumPlans = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFAQ, setOpenFAQ] = useState(null);

  const plans = [
    {
      name: 'Starter',
      description: t('plans.starter.description'),
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        t('plans.starter.features.transactions'),
        t('plans.starter.features.support'),
        t('plans.starter.features.dashboard'),
        t('plans.starter.features.reports'),
        t('plans.starter.features.users'),
      ],
      popular: false,
      cta: t('plans.starter.cta'),
      ctaLink: '/register',
      icon: <Zap className="w-8 h-8" />,
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      name: 'Professional',
      description: t('plans.professional.description'),
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        t('plans.professional.features.transactions'),
        t('plans.professional.features.support'),
        t('plans.professional.features.dashboard'),
        t('plans.professional.features.reports'),
        t('plans.professional.features.users'),
        t('plans.professional.features.api'),
        t('plans.professional.features.integrations'),
      ],
      popular: true,
      cta: t('plans.professional.cta'),
      ctaLink: '/register',
      icon: <Crown className="w-8 h-8" />,
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      name: 'Enterprise',
      description: t('plans.enterprise.description'),
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        t('plans.enterprise.features.all'),
        t('plans.enterprise.features.support'),
        t('plans.enterprise.features.dashboard'),
        t('plans.enterprise.features.reports'),
        t('plans.enterprise.features.users'),
        t('plans.enterprise.features.sla'),
        t('plans.enterprise.features.training'),
        t('plans.enterprise.features.consulting'),
      ],
      popular: false,
      cta: t('plans.enterprise.cta'),
      ctaLink: '/contact',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('plans.features.performance'),
      description: t('plans.features.performanceDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('plans.features.security'),
      description: t('plans.features.securityDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('plans.features.support'),
      description: t('plans.features.supportDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('plans.features.analytics'),
      description: t('plans.features.analyticsDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-accent)',
    },
  ];

  const faqItems = [
    {
      question: t('plans.faq.changePlan.question'),
      answer: t('plans.faq.changePlan.answer'),
    },
    {
      question: t('plans.faq.trial.question'),
      answer: t('plans.faq.trial.answer'),
    },
    {
      question: t('plans.faq.support.question'),
      answer: t('plans.faq.support.answer'),
    },
    {
      question: t('plans.faq.security.question'),
      answer: t('plans.faq.security.answer'),
    },
    {
      question: t('plans.faq.cancel.question'),
      answer: t('plans.faq.cancel.answer'),
    },
    {
      question: t('plans.faq.discount.question'),
      answer: t('plans.faq.discount.answer'),
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
    <div className="premium-plans">
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
                <Crown className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('plans.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('plans.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <Link to="/register" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('plans.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('plans.contactSales')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="premium-billing-toggle">
        <div className="premium-container">
          <motion.div
            className="premium-billing-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-billing-toggle-container">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`premium-billing-button ${
                  billingCycle === 'monthly' ? 'premium-billing-active' : ''
                }`}
              >
                {t('plans.billing.monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`premium-billing-button ${
                  billingCycle === 'yearly' ? 'premium-billing-active' : ''
                }`}
              >
                {t('plans.billing.yearly')}
                <span className="premium-billing-discount">
                  {t('plans.billing.discount')}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="premium-pricing">
        <div className="premium-container">
          <div className="premium-pricing-grid">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`premium-pricing-card ${
                  plan.popular ? 'premium-pricing-popular' : ''
                }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ '--plan-gradient': plan.gradient }}
              >
                {plan.popular && (
                  <div className="premium-pricing-badge">
                    <Star className="w-4 h-4" />
                    {t('plans.popular')}
                  </div>
                )}
                
                <div className="premium-pricing-header">
                  <div className="premium-pricing-icon" style={{ color: plan.color }}>
                    {plan.icon}
                  </div>
                  <h3 className="premium-pricing-name">{plan.name}</h3>
                  <p className="premium-pricing-description">{plan.description}</p>
                </div>

                <div className="premium-pricing-price">
                  <span className="premium-pricing-amount">
                    R$ {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="premium-pricing-period">
                    /{billingCycle === 'monthly' ? t('plans.billing.month') : t('plans.billing.year')}
                  </span>
                </div>

                {billingCycle === 'yearly' && (
                  <div className="premium-pricing-savings">
                    {t('plans.savings', { amount: (plan.monthlyPrice * 12) - plan.yearlyPrice })}
                  </div>
                )}

                <div className="premium-pricing-features">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="premium-pricing-feature">
                      <Check className="w-5 h-5 premium-pricing-check" />
                      <span className="premium-pricing-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={plan.ctaLink}
                  className={`premium-pricing-cta ${
                    plan.popular ? 'premium-pricing-cta-popular' : ''
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
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
                {t('plans.features.title')}
              </h2>
              <p className="premium-features-subtitle">
                {t('plans.features.subtitle')}
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

      {/* FAQ Section */}
      <section className="premium-faq">
        <div className="premium-container">
          <motion.div
            className="premium-faq-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-faq-header">
              <Globe className="w-12 h-12 premium-faq-icon" />
              <h2 className="premium-faq-title">
                {t('plans.faq.title')}
              </h2>
              <p className="premium-faq-subtitle">
                {t('plans.faq.subtitle')}
              </p>
            </div>

            <div className="premium-faq-grid">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="premium-faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="premium-faq-button"
                  >
                    <h3 className="premium-faq-question">{item.question}</h3>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 premium-faq-chevron" />
                    ) : (
                      <ChevronDown className="w-5 h-5 premium-faq-chevron" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="premium-faq-answer-container"
                      >
                        <div className="premium-faq-answer">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              <Sparkles className="w-12 h-12 premium-cta-icon" />
              <h2 className="premium-cta-title">
                {t('plans.cta.title')}
              </h2>
              <p className="premium-cta-subtitle">
                {t('plans.cta.subtitle')}
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
                {t('plans.cta.trial')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="premium-btn premium-btn-ghost premium-btn-lg">
                {t('plans.cta.sales')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-plans {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="plans-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23plans-grain)"/></svg>');
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
          animation: premium-glow 2s ease-in-out infinite alternate;
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

        .premium-billing-toggle {
          padding: var(--premium-space-4xl) 0;
          background: var(--premium-white);
        }

        .premium-billing-content {
          display: flex;
          justify-content: center;
        }

        .premium-billing-toggle-container {
          display: flex;
          background: var(--premium-white);
          border-radius: var(--premium-radius-xl);
          padding: var(--premium-space-sm);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
        }

        .premium-billing-button {
          padding: var(--premium-space-lg) var(--premium-space-xl);
          border-radius: var(--premium-radius-lg);
          font-weight: var(--premium-font-semibold);
          font-size: var(--premium-text-lg);
          transition: all var(--premium-transition-fast);
          color: var(--premium-gray-600);
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--premium-space-sm);
        }

        .premium-billing-button:hover {
          color: var(--premium-petroleum);
        }

        .premium-billing-active {
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-billing-discount {
          background: var(--premium-yellow);
          color: var(--premium-petroleum);
          padding: var(--premium-space-xs) var(--premium-space-sm);
          border-radius: var(--premium-radius-sm);
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-bold);
        }

        .premium-pricing {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--premium-space-2xl);
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-pricing-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--plan-gradient);
        }

        .premium-pricing-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-pricing-popular {
          transform: scale(1.05);
          border: 2px solid var(--premium-yellow);
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--premium-gradient-cta);
          color: var(--premium-petroleum);
          padding: var(--premium-space-sm) var(--premium-space-lg);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-bold);
          display: flex;
          align-items: center;
          gap: var(--premium-space-xs);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-pricing-header {
          text-align: center;
          margin-bottom: var(--premium-space-2xl);
        }

        .premium-pricing-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--premium-space-lg);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-pricing-name {
          font-size: var(--premium-text-3xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-sm);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-pricing-name {
          color: var(--premium-teal);
        }

        .premium-pricing-description {
          color: var(--premium-gray-600);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-pricing-description {
          color: var(--premium-gray-300);
        }

        .premium-pricing-price {
          text-align: center;
          margin-bottom: var(--premium-space-lg);
        }

        .premium-pricing-amount {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .premium-pricing-period {
          font-size: var(--premium-text-lg);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-pricing-period {
          color: var(--premium-gray-300);
        }

        .premium-pricing-savings {
          text-align: center;
          color: var(--premium-teal);
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-semibold);
          margin-bottom: var(--premium-space-lg);
        }

        .premium-pricing-features {
          margin-bottom: var(--premium-space-2xl);
        }

        .premium-pricing-feature {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          margin-bottom: var(--premium-space-md);
        }

        .premium-pricing-check {
          color: var(--premium-teal);
          flex-shrink: 0;
        }

        .premium-pricing-feature-text {
          color: var(--premium-gray-600);
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-pricing-feature-text {
          color: var(--premium-gray-300);
        }

        .premium-pricing-cta {
          width: 100%;
          padding: var(--premium-space-lg);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-bold);
          transition: all var(--premium-transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--premium-space-sm);
          text-decoration: none;
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-pricing-cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--premium-shadow-lg);
        }

        .premium-pricing-cta-popular {
          background: var(--premium-gradient-cta);
          color: var(--premium-petroleum);
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
          text-align: center;
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
          margin: 0 auto var(--premium-space-xl);
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

        .premium-faq {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-faq-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .premium-faq-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-faq-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-faq-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-faq-title {
          color: var(--premium-teal);
        }

        .premium-faq-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-faq-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-faq-grid {
          display: grid;
          gap: var(--premium-space-lg);
        }

        .premium-faq-item {
          background: var(--premium-white);
          border-radius: var(--premium-radius-xl);
          box-shadow: var(--premium-shadow-md);
          border: 1px solid var(--premium-gray-200);
          overflow: hidden;
        }

        .premium-faq-button {
          width: 100%;
          padding: var(--premium-space-xl);
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all var(--premium-transition-fast);
        }

        .premium-faq-button:hover {
          background: var(--premium-gray-50);
        }

        .premium-faq-question {
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
          margin: 0;
        }

        [data-theme="dark"] .premium-faq-question {
          color: var(--premium-teal);
        }

        .premium-faq-chevron {
          color: var(--premium-gray-500);
          transition: all var(--premium-transition-fast);
        }

        .premium-faq-answer-container {
          overflow: hidden;
        }

        .premium-faq-answer {
          padding: 0 var(--premium-space-xl) var(--premium-space-xl);
          color: var(--premium-gray-600);
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-faq-answer {
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

          .premium-pricing-grid {
            grid-template-columns: 1fr;
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
          .premium-faq-title,
          .premium-cta-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-pricing-popular {
            transform: none;
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-features-title,
          .premium-faq-title,
          .premium-cta-title {
            font-size: var(--premium-text-3xl);
          }

          .premium-hero-subtitle {
            font-size: var(--premium-text-lg);
          }

          .premium-billing-toggle-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumPlans;
