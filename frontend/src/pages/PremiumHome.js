import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import AgroNewsCarousel from '../components/AgroNewsCarousel';

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
      icon: <TrendingUp size={48} />,
      title: t('home.features.marketplace.title', 'Marketplace'),
      description: t('home.features.marketplace.description', 'Conecte-se com compradores e vendedores de commodities agrícolas'),
      link: '/marketplace',
    },
    {
      icon: <Users size={48} />,
      title: t('home.features.agroconecta.title', 'AgroConecta'),
      description: t('home.features.agroconecta.description', 'Rede de transporte e logística para o agronegócio'),
      link: '/agroconecta',
    },
    {
      icon: <Zap size={48} />,
      title: t('home.features.crypto.title', 'Crypto Agro'),
      description: t('home.features.crypto.description', 'Tecnologia blockchain para transações seguras'),
      link: '/crypto',
    },
    {
      icon: <Shield size={48} />,
      title: t('home.features.analytics.title', 'Analytics'),
      description: t('home.features.analytics.description', 'Dados e insights para tomada de decisão'),
      link: '/dashboard',
    },
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.users', 'Usuários Ativos'), color: 'var(--txc-light-green)' },
    { number: '50K+', label: t('home.stats.transactions', 'Transações'), color: 'var(--txc-light-green)' },
    { number: '$2M+', label: t('home.stats.volume', 'Volume'), color: 'var(--txc-light-green)' },
    { number: '99.9%', label: t('home.stats.uptime', 'Uptime'), color: 'var(--txc-light-green)' },
  ];

  return (
    <div style={{ background: 'var(--txc-dark-green)', minHeight: '100vh' }}>
      {/* Hero Section TXC */}
      <section className="txc-section" style={{ paddingTop: 'var(--txc-space-3xl)' }}>
        <div className="txc-container">
          <motion.div
            className="txc-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
          >
            <motion.h1 className="txc-title h1" variants={itemVariants}>
              {t('home.hero.title', 'AGROISYNC - O Futuro do Agronegócio')}
            </motion.h1>
            <motion.p className="txc-subtitle" variants={itemVariants}>
              {t('home.hero.subtitle', 'Conectamos produtores, compradores e tecnologia para revolucionar o agronegócio brasileiro')}
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
              <Link to="/marketplace" className="txc-btn-primary">
                {t('home.hero.cta.primary', 'Explorar Marketplace')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="txc-btn-secondary">
                {t('home.hero.cta.secondary', 'Saiba Mais')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Carrossel de Notícias */}
      <AgroNewsCarousel />

      {/* Features Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: 'var(--txc-space-3xl)' }}
          >
            <h2 className="txc-title h2">{t('home.features.title', 'Nossas Soluções')}</h2>
            <p className="txc-subtitle">
              {t('home.features.subtitle', 'Tecnologia avançada para o agronegócio moderno')}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ 
                  marginBottom: 'var(--txc-space-lg)',
                  color: 'var(--txc-light-green)',
                  filter: 'drop-shadow(0 4px 8px rgba(57, 255, 20, 0.3))'
                }}>
                  {feature.icon}
                </div>
                <h3 className="txc-title h3" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {feature.title}
                </h3>
                <p className="txc-text" style={{ marginBottom: 'var(--txc-space-lg)' }}>
                  {feature.description}
                </p>
                <Link to={feature.link} className="txc-btn-primary">
                  {t('home.explore', 'Explorar')}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="txc-section" style={{ background: 'var(--txc-dark-gray)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center' }}
          >
            <h2 className="txc-title h2" style={{ marginBottom: 'var(--txc-space-2xl)' }}>
              {t('home.stats.title', 'Números que Impressionam')}
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 'var(--txc-space-xl)' 
            }}>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  style={{ textAlign: 'center' }}
                >
                  <div 
                    className="txc-title h1" 
                    style={{ 
                      color: stat.color,
                      fontSize: '3rem',
                      marginBottom: 'var(--txc-space-sm)',
                      fontWeight: '900'
                    }}
                  >
                    {stat.number}
                  </div>
                  <div className="txc-text" style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="txc-title h2" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              {t('home.cta.title', 'Pronto para Revolucionar seu Agronegócio?')}
            </h2>
            <p className="txc-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              {t('home.cta.subtitle', 'Junte-se a milhares de produtores que já transformaram seus negócios com a AGROISYNC')}
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="txc-btn-primary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('home.cta.primary', 'Começar Agora')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="txc-btn-secondary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('home.cta.secondary', 'Falar com Especialista')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PremiumHome;