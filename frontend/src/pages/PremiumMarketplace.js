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
      color: 'var(--txc-secondary)',
      gradient: 'var(--txc-gradient-primary)',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t('marketplace.features.launch'),
      description: t('marketplace.features.launchDesc'),
      color: 'var(--txc-primary)',
      gradient: 'var(--txc-gradient-secondary)',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('marketplace.features.development'),
      description: t('marketplace.features.developmentDesc'),
      color: 'var(--txc-accent)',
      gradient: 'var(--txc-gradient-accent)',
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
    <div style={{ background: 'var(--txc-dark-green)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="txc-section" style={{ paddingTop: 'var(--txc-space-3xl)' }}>
        <div className="txc-container">
          <motion.div
            className="txc-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{ marginBottom: 'var(--txc-space-xl)' }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                background: 'var(--txc-gradient-accent)',
                borderRadius: 'var(--txc-radius-3xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--txc-dark-green)',
                boxShadow: 'var(--txc-shadow-lg)',
                animation: 'premium-glow 2s ease-in-out infinite alternate'
              }}>
                <Rocket size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-title h1" variants={itemVariants}>
              {t('marketplace.title', 'Marketplace Agro')}
            </motion.h1>
            
            <motion.p className="txc-subtitle" variants={itemVariants}>
              {t('marketplace.subtitle', 'Conecte-se com compradores e vendedores de commodities agrícolas em uma plataforma segura e eficiente')}
            </motion.p>

            <motion.div 
              className="txc-hero-actions" 
              variants={itemVariants}
              style={{ 
                display: 'flex', 
                gap: 'var(--txc-space-lg)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginTop: 'var(--txc-space-xl)'
              }}
            >
              <Link to="/register" className="txc-btn-primary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('marketplace.getStarted', 'Começar Agora')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="txc-btn-secondary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('marketplace.learnMore', 'Saiba Mais')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="txc-section" style={{ background: 'var(--txc-dark-gray)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: 'var(--txc-space-3xl)' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--txc-space-lg) auto',
              background: 'var(--txc-gradient-accent)',
              borderRadius: 'var(--txc-radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--txc-dark-green)',
              boxShadow: 'var(--txc-shadow-lg)'
            }}>
              <Clock size={32} />
            </div>
            <h2 className="txc-title h2">
              {t('marketplace.status', 'Status do Marketplace')}
            </h2>
            <p className="txc-subtitle">
              {t('marketplace.description', 'Plataforma em desenvolvimento com tecnologia de ponta')}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--txc-light-green)',
                  borderRadius: 'var(--txc-radius-xl) var(--txc-radius-xl) 0 0'
                }} />
                
                <div style={{ 
                  marginBottom: 'var(--txc-space-xl)',
                  color: 'var(--txc-light-green)',
                  filter: 'drop-shadow(0 4px 8px rgba(57, 255, 20, 0.3))'
                }}>
                  {feature.icon}
                </div>
                <h3 className="txc-title h3" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {feature.title}
                </h3>
                <p className="txc-text">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: 'var(--txc-space-3xl)' }}
          >
            <h2 className="txc-title h2">
              {t('marketplace.benefits.title', 'Benefícios do Marketplace')}
            </h2>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--txc-space-lg)' 
          }}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                className="txc-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--txc-space-md)', padding: 'var(--txc-space-lg)' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--txc-gradient-accent)',
                  borderRadius: 'var(--txc-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--txc-dark-green)',
                  flexShrink: 0
                }}>
                  {benefit.icon}
                </div>
                <span className="txc-text" style={{ fontWeight: '500', fontSize: '1.125rem' }}>
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="txc-section" style={{ background: 'var(--txc-dark-gray)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--txc-space-lg) auto',
              background: 'var(--txc-gradient-accent)',
              borderRadius: 'var(--txc-radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--txc-dark-green)',
              boxShadow: 'var(--txc-shadow-lg)'
            }}>
              <Star size={32} />
            </div>
            <h2 className="txc-title h2" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              {t('marketplace.notify.title', 'Fique por Dentro')}
            </h2>
            <p className="txc-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              {t('marketplace.notify.subtitle', 'Receba atualizações sobre o lançamento do marketplace')}
            </p>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 'var(--txc-space-md)', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('marketplace.notify.placeholder', 'Seu melhor email')}
                style={{
                  flex: 1,
                  padding: 'var(--txc-space-md)',
                  border: '2px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: 'var(--txc-radius-lg)',
                  fontSize: '1rem',
                  background: 'rgba(57, 255, 20, 0.1)',
                  color: 'var(--txc-white)',
                  transition: 'all var(--txc-transition-normal)',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
              <motion.button
                type="submit"
                className="txc-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: 'var(--txc-space-md) var(--txc-space-lg)' }}
              >
                {t('marketplace.notify.button', 'Inscrever')}
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default PremiumMarketplace;
