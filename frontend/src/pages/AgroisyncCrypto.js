import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Shield,
  Coins,
  Wallet,
  Star,
  CheckCircle
} from 'lucide-react';
import CryptoWidget from '../components/CryptoWidget';

const AgroisyncCrypto = () => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Coins size={32} />,
      title: 'Crypto Agro Token',
      description: 'Token digital exclusivo para transações no agronegócio com valorização garantida',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Blockchain Seguro',
      description: 'Tecnologia blockchain para garantir transparência e segurança em todas as operações',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Wallet size={32} />,
      title: 'Wallet Integrado',
      description: 'Carteira digital integrada para gerenciar seus tokens e fazer transações',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Staking Rewards',
      description: 'Ganhe recompensas ao manter seus tokens bloqueados na plataforma',
      color: 'var(--txc-light-green)',
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle size={24} />,
      text: 'Transações instantâneas',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Taxas reduzidas',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Transparência total',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Segurança máxima',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Liquidez garantida',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte 24/7',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Tokens Emitidos', color: 'var(--agro-green-accent)' },
    { number: '50K+', label: 'Transações', color: 'var(--agro-green-accent)' },
    { number: '$5M+', label: 'Volume', color: 'var(--agro-green-accent)' },
    { number: '99.9%', label: 'Uptime', color: 'var(--agro-green-accent)' },
  ];

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

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
    <div>
      {/* Hero Section Clean */}
      <section className="agro-hero-section" style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '4rem 0'
      }}>
        <div className="agro-hero-content">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              style={{ marginBottom: 'var(--agro-space-xl)' }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                background: 'var(--agro-gradient-accent)',
                borderRadius: 'var(--agro-radius-3xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--agro-dark-green)',
                boxShadow: 'var(--agro-shadow-lg)'
              }}>
                <Coins size={48} />
              </div>
            </motion.div>

            <motion.h1 className="agro-hero-title" variants={itemVariants} style={{ color: '#000000' }}>
              CRYPTO AGRO
            </motion.h1>
            
            <motion.p className="agro-hero-subtitle" variants={itemVariants} style={{ color: '#666666' }}>
              Tecnologia blockchain para revolucionar o agronegócio brasileiro
            </motion.p>

            <motion.div 
              style={{ 
                display: 'flex', 
                gap: 'var(--agro-space-lg)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginTop: 'var(--agro-space-xl)'
              }}
              variants={itemVariants}
            >
              <Link to="/register" className="agro-btn-primary" style={{
                background: '#4CAF50',
                color: '#FFFFFF',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="agro-btn-secondary" style={{
                background: 'transparent',
                color: '#4CAF50',
                border: '2px solid #4CAF50',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}>
                Explorar
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Números que Impressionam</h2>
            <p className="agro-section-subtitle">
              Resultados reais da nossa plataforma blockchain
            </p>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'var(--agro-space-xl)' 
          }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="agro-text-center"
              >
                <div 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: stat.color,
                    marginBottom: 'var(--agro-space-sm)',
                    fontFamily: 'var(--agro-font-secondary)'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Widget Section */}
      <section className="agro-section" style={{ background: 'var(--bg-gradient)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="agro-text-center"
            style={{ marginBottom: '2rem' }}
          >
            <h2 className="agro-section-title">Widget de Criptomoedas</h2>
            <p className="agro-section-subtitle">
              Acompanhe preços em tempo real e conecte sua carteira MetaMask
            </p>
          </motion.div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <CryptoWidget />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Recursos Principais</h2>
            <p className="agro-section-subtitle">
              Tecnologia blockchain avançada para o agronegócio
            </p>
          </motion.div>

          <div className="agro-cards-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="agro-card agro-fade-in"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--agro-green-accent)',
                  borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                }} />
                
                <div className="agro-card-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="agro-card-title">
                  {feature.title}
                </h3>
                <p className="agro-card-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Benefícios do Crypto Agro</h2>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-lg)' 
          }}>
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                className="agro-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-md)', padding: 'var(--agro-space-lg)' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  flexShrink: 0
                }}>
                  {benefit.icon}
                </div>
                <span style={{ fontWeight: '500', fontSize: '1.125rem', color: 'var(--agro-text-dark)' }}>
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto var(--agro-space-lg) auto',
              background: 'var(--agro-gradient-accent)',
              borderRadius: 'var(--agro-radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--agro-dark-green)',
              boxShadow: 'var(--agro-shadow-lg)'
            }}>
              <Star size={32} />
            </div>
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Fique por Dentro
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Receba atualizações sobre o lançamento do Crypto Agro
            </p>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 'var(--agro-space-md)', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                style={{
                  flex: 1,
                  padding: 'var(--agro-space-md)',
                  border: '2px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: 'var(--agro-radius-lg)',
                  fontSize: '1rem',
                  background: 'rgba(57, 255, 20, 0.1)',
                  color: 'var(--agro-text-dark)',
                  transition: 'all var(--agro-transition-normal)',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
              <motion.button
                type="submit"
                className="agro-btn agro-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: 'var(--agro-space-md) var(--agro-space-lg)' }}
              >
                Inscrever
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncCrypto;
