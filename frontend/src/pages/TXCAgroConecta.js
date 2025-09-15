import React from 'react';
import { motion } from 'framer-motion';
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

const TXCAgroConecta = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Frete Inteligente',
      description: 'Conecte-se com transportadores confiáveis e otimize seus custos de frete',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <MapPin size={32} />,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe sua carga em tempo real com tecnologia GPS avançada',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Parceiros',
      description: 'Conecte-se com uma rede confiável de transportadores e produtores',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Zap size={32} />,
      title: 'IA para Logística',
      description: 'Algoritmos inteligentes para otimizar rotas e reduzir custos',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Segurança Total',
      description: 'Proteção completa para sua carga com seguro e monitoramento',
      color: 'var(--txc-green-accent)',
    },
    {
      icon: <Clock size={32} />,
      title: 'Entrega Rápida',
      description: 'Entregas mais rápidas com otimização de rotas e gestão eficiente',
      color: 'var(--txc-green-accent)',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cadastre sua Carga',
      description: 'Informe os detalhes da sua carga e destino',
      icon: <Truck size={24} />,
    },
    {
      number: '02',
      title: 'Encontre Transportadores',
      description: 'Receba propostas de transportadores qualificados',
      icon: <MapPin size={24} />,
    },
    {
      number: '03',
      title: 'Acompanhe a Entrega',
      description: 'Monitore sua carga em tempo real até o destino',
      icon: <CheckCircle size={24} />,
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
    <div>
      {/* Hero Section TXC */}
      <section className="txc-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop")',
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
                <Truck size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              AGROCONECTA
            </motion.h1>
            
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              Rede de transporte e logística inteligente para o agronegócio
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
              Tecnologia avançada para revolucionar a logística agro
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

      {/* How It Works Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
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
            <h2 className="txc-section-title">Como Funciona</h2>
            <p className="txc-section-subtitle">
              Processo simples e eficiente em apenas 3 passos
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ textAlign: 'center', position: 'relative' }}
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
                
                <div 
                  style={{ 
                    fontSize: '3rem',
                    marginBottom: 'var(--txc-space-lg)',
                    fontWeight: '900',
                    background: 'var(--txc-gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--txc-font-secondary)'
                  }}
                >
                  {step.number}
                </div>
                
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--txc-space-lg) auto',
                  background: 'var(--txc-gradient-accent)',
                  borderRadius: 'var(--txc-radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--txc-dark-green)',
                  boxShadow: 'var(--txc-shadow-md)'
                }}>
                  {step.icon}
                </div>
                
                <h3 className="txc-card-title" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {step.title}
                </h3>
                <p className="txc-card-description">
                  {step.description}
                </p>
              </motion.div>
            ))}
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
              <Globe size={32} />
            </div>
            <h2 className="txc-section-title" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              Pronto para Conectar?
            </h2>
            <p className="txc-section-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              Junte-se à maior rede de logística do agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="txc-btn txc-btn-primary">
                Tenho Carga
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="txc-btn txc-btn-secondary">
                Sou Transportador
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TXCAgroConecta;
