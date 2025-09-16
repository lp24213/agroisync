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
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';

const AgroisyncAgroConecta = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Frete Inteligente',
      description: 'Conecte-se com transportadores confiáveis e otimize seus custos de frete',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <MapPin size={32} />,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe sua carga em tempo real com tecnologia GPS avançada',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Parceiros',
      description: 'Conecte-se com uma rede confiável de transportadores e produtores',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Zap size={32} />,
      title: 'IA para Logística',
      description: 'Algoritmos inteligentes para otimizar rotas e reduzir custos',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Shield size={32} />,
      title: 'Segurança Total',
      description: 'Proteção completa para sua carga com seguro e monitoramento',
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Clock size={32} />,
      title: 'Entrega Rápida',
      description: 'Entregas mais rápidas com otimização de rotas e gestão eficiente',
      color: 'var(--txc-light-green)',
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

  const sectionVariants = {
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
      {/* HERO COM IMAGEM 4K DE CAMINHÕES */}
      <AgroisyncHeroPrompt 
        title="AgroConecta"
        subtitle="Logística Inteligente para o Agronegócio"
        heroImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop&q=80"
        showCTA={true}
      />

      {/* Features Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="agro-text-center"
          >
            <motion.h2 className="agro-section-title" variants={itemVariants}>
              Recursos Principais
            </motion.h2>
            <motion.p className="agro-section-subtitle" variants={itemVariants}>
              Tecnologia avançada para revolucionar a logística agro
            </motion.p>
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

      {/* How It Works Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
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
            <h2 className="agro-section-title">Como Funciona</h2>
            <p className="agro-section-subtitle">
              Processo simples e eficiente em apenas 3 passos
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-xl)' 
          }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="agro-card"
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
                  background: 'var(--agro-green-accent)',
                  borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                }} />
                
                <div 
                  style={{ 
                    fontSize: '3rem',
                    marginBottom: 'var(--agro-space-lg)',
                    fontWeight: '900',
                    background: 'var(--agro-gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: 'var(--agro-font-secondary)'
                  }}
                >
                  {step.number}
                </div>
                
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--agro-space-lg) auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-md)'
                }}>
                  {step.icon}
                </div>
                
                <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {step.title}
                </h3>
                <p className="agro-card-description">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Globe size={32} />
            </div>
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Pronto para Conectar?
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Junte-se à maior rede de logística do agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--agro-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="agro-btn agro-btn-primary">
                Tenho Carga
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="agro-btn agro-btn-secondary">
                Sou Transportador
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncAgroConecta;
