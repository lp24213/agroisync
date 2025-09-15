import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Lock,
  Coins,
  Wallet,
  Star,
  CheckCircle,
  DollarSign
} from 'lucide-react';

const TXCCrypto = () => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Coins size={32} />,
      title: 'Crypto Agro Token',
      description: 'Token digital exclusivo para transações no agronegócio com valorização garantida',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Blockchain Seguro',
      description: 'Tecnologia blockchain para garantir transparência e segurança em todas as operações',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Wallet size={32} />,
      title: 'Wallet Integrado',
      description: 'Carteira digital integrada para gerenciar seus tokens e fazer transações',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Staking Rewards',
      description: 'Ganhe recompensas ao manter seus tokens bloqueados na plataforma',
      color: 'var(--txc-green-accent)',
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
    { number: '1M+', label: 'Tokens Emitidos', color: 'var(--txc-green-accent)' },
    { number: '50K+', label: 'Transações', color: 'var(--txc-green-accent)' },
    { number: '$5M+', label: 'Volume', color: 'var(--txc-green-accent)' },
    { number: '99.9%', label: 'Uptime', color: 'var(--txc-green-accent)' },
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
      {/* Hero Section TXC */}
      <section className="txc-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="txc-hero-content">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
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
                boxShadow: 'var(--txc-shadow-lg)'
              }}>
                <Coins size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              CRYPTO AGRO
            </motion.h1>
            
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              Tecnologia blockchain para revolucionar o agronegócio brasileiro
            </motion.p>

            <motion.div 
              style={{ 
                display: 'flex', 
                gap: 'var(--txc-space-lg)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginTop: 'var(--txc-space-xl)'
              }}
              variants={itemVariants}
            >
              <Link to="/register" className="txc-btn-outline">
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="txc-btn-outline">
                Explorar
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Números que Impressionam</h2>
            <p className="txc-section-subtitle">
              Resultados reais da nossa plataforma blockchain
            </p>
          </motion.div>
          
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
                className="txc-text-center"
              >
                <div 
                  style={{ 
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: stat.color,
                    marginBottom: 'var(--txc-space-sm)',
                    fontFamily: 'var(--txc-font-secondary)'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '500',
                    color: 'var(--txc-text-dark)'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Recursos Principais</h2>
            <p className="txc-section-subtitle">
              Tecnologia blockchain avançada para o agronegócio
            </p>
          </motion.div>

          <div className="txc-cards-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card txc-fade-in"
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
                  background: 'var(--txc-green-accent)',
                  borderRadius: 'var(--txc-radius-xl) var(--txc-radius-xl) 0 0'
                }} />
                
                <div className="txc-card-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="txc-card-title">
                  {feature.title}
                </h3>
                <p className="txc-card-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Benefícios do Crypto Agro</h2>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
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
                <span style={{ fontWeight: '500', fontSize: '1.125rem', color: 'var(--txc-text-dark)' }}>
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
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
            <h2 className="txc-section-title" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              Fique por Dentro
            </h2>
            <p className="txc-section-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              Receba atualizações sobre o lançamento do Crypto Agro
            </p>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 'var(--txc-space-md)', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                style={{
                  flex: 1,
                  padding: 'var(--txc-space-md)',
                  border: '2px solid rgba(57, 255, 20, 0.2)',
                  borderRadius: 'var(--txc-radius-lg)',
                  fontSize: '1rem',
                  background: 'rgba(57, 255, 20, 0.1)',
                  color: 'var(--txc-text-dark)',
                  transition: 'all var(--txc-transition-normal)',
                  backdropFilter: 'blur(10px)'
                }}
                required
              />
              <motion.button
                type="submit"
                className="txc-btn txc-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: 'var(--txc-space-md) var(--txc-space-lg)' }}
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

export default TXCCrypto;
