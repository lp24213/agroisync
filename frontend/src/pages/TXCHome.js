import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Truck,
  Globe
} from 'lucide-react';
import AgroNewsCarousel from '../components/AgroNewsCarousel';
import WeatherWidget from '../components/WeatherWidget';
import CryptoChart from '../components/CryptoChart';
import StockWidget from '../components/StockWidget';

const TXCHome = () => {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Marketplace Inteligente',
      description: 'Conecte-se com compradores e vendedores de commodities agrícolas em uma plataforma segura e eficiente.',
      link: '/marketplace',
    },
    {
      icon: <Truck size={32} />,
      title: 'AgroConecta',
      description: 'Rede de transporte e logística inteligente para otimizar sua cadeia de suprimentos.',
      link: '/agroconecta',
    },
    {
      icon: <Zap size={32} />,
      title: 'Crypto Agro',
      description: 'Tecnologia blockchain para transações seguras e transparentes no agronegócio.',
      link: '/crypto',
    },
    {
      icon: <Shield size={32} />,
      title: 'Analytics Avançado',
      description: 'Dados e insights para tomada de decisão baseada em inteligência artificial.',
      link: '/dashboard',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Usuários Ativos', color: 'var(--txc-green-accent)' },
    { number: '50K+', label: 'Transações', color: 'var(--txc-green-accent)' },
    { number: '$2M+', label: 'Volume', color: 'var(--txc-green-accent)' },
    { number: '99.9%', label: 'Uptime', color: 'var(--txc-green-accent)' },
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
    <div>
      {/* Hero Section TXC */}
      <section className="txc-hero-section">
        <div className="txc-hero-content">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              GREEN MONEY
            </motion.h1>
            
            <motion.div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'var(--txc-space-md)',
                marginBottom: 'var(--txc-space-lg)'
              }}
              variants={itemVariants}
            >
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--txc-white)',
                borderRadius: 'var(--txc-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--txc-green-accent)'
              }}>
                <Globe size={24} />
              </div>
            </motion.div>
            
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              MENTALIDADE E PERTENCIMENTO
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
              <Link to="/marketplace" className="txc-btn-outline">
                CONFIRA
                <ArrowRight size={20} />
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
            className="txc-text-center"
          >
            <h2 className="txc-section-title">NAVEGUE POR CATEGORIAS</h2>
            <p className="txc-section-subtitle">
              Tecnologia avançada para o agronegócio moderno
            </p>
          </motion.div>

          <div className="txc-cards-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card txc-fade-in"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="txc-card-icon">
                  {feature.icon}
                </div>
                <h3 className="txc-card-title">
                  {feature.title}
                </h3>
                <p className="txc-card-description">
                  {feature.description}
                </p>
                <Link to={feature.link} className="txc-card-button">
                  Explorar
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
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
              Resultados reais de quem confia na AGROISYNC
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

      {/* Dashboard de Dados em Tempo Real */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
            style={{ marginBottom: 'var(--txc-space-xl)' }}
          >
            <h2 className="txc-section-title">Dados em Tempo Real</h2>
            <p className="txc-section-subtitle">
              Informações atualizadas automaticamente para sua tomada de decisão
            </p>
          </motion.div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {/* Clima */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: 'var(--txc-text-dark)', 
                marginBottom: 'var(--txc-space-md)' 
              }}>
                Clima
              </h3>
              <WeatherWidget city="São Paulo" />
            </motion.div>
            
            {/* Criptomoedas */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: 'var(--txc-text-dark)', 
                marginBottom: 'var(--txc-space-md)' 
              }}>
                Criptomoedas
              </h3>
              <CryptoChart selectedCoin="bitcoin" />
            </motion.div>
            
            {/* Bolsa de Valores */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ gridColumn: '1 / -1' }}
            >
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: 'var(--txc-text-dark)', 
                marginBottom: 'var(--txc-space-md)' 
              }}>
                Bolsa de Valores
              </h3>
              <StockWidget />
            </motion.div>
          </div>
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
            className="txc-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="txc-section-title">
              Pronto para Revolucionar seu Agronegócio?
            </h2>
            <p className="txc-section-subtitle">
              Junte-se a milhares de produtores que já transformaram seus negócios com a AGROISYNC
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginTop: 'var(--txc-space-xl)'
            }}>
              <Link to="/register" className="txc-btn txc-btn-primary">
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="txc-btn txc-btn-secondary">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TXCHome;