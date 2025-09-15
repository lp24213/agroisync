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
      icon: <Truck size={32} />,
      title: t('agroconecta.features.freight', 'Frete Inteligente'),
      description: t('agroconecta.features.freightDesc', 'Conecte-se com transportadores confiáveis e otimize seus custos de frete'),
      color: 'var(--txc-light-green)',
    },
    {
      icon: <MapPin size={32} />,
      title: t('agroconecta.features.tracking', 'Rastreamento em Tempo Real'),
      description: t('agroconecta.features.trackingDesc', 'Acompanhe sua carga em tempo real com tecnologia GPS avançada'),
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Users size={32} />,
      title: t('agroconecta.features.network', 'Rede de Parceiros'),
      description: t('agroconecta.features.networkDesc', 'Conecte-se com uma rede confiável de transportadores e produtores'),
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Zap size={32} />,
      title: t('agroconecta.features.ai', 'IA para Logística'),
      description: t('agroconecta.features.aiDesc', 'Algoritmos inteligentes para otimizar rotas e reduzir custos'),
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Shield size={32} />,
      title: t('agroconecta.features.security', 'Segurança Total'),
      description: t('agroconecta.features.securityDesc', 'Proteção completa para sua carga com seguro e monitoramento'),
      color: 'var(--txc-light-green)',
    },
    {
      icon: <Clock size={32} />,
      title: t('agroconecta.features.fast', 'Entrega Rápida'),
      description: t('agroconecta.features.fastDesc', 'Entregas mais rápidas com otimização de rotas e gestão eficiente'),
      color: 'var(--txc-light-green)',
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('agroconecta.howItWorks.step1', 'Cadastre sua Carga'),
      description: t('agroconecta.howItWorks.step1Desc', 'Informe os detalhes da sua carga e destino'),
      icon: <Truck size={24} />,
    },
    {
      number: '02',
      title: t('agroconecta.howItWorks.step2', 'Encontre Transportadores'),
      description: t('agroconecta.howItWorks.step2Desc', 'Receba propostas de transportadores qualificados'),
      icon: <MapPin size={24} />,
    },
    {
      number: '03',
      title: t('agroconecta.howItWorks.step3', 'Acompanhe a Entrega'),
      description: t('agroconecta.howItWorks.step3Desc', 'Monitore sua carga em tempo real até o destino'),
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
                <Truck size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-title h1" variants={itemVariants}>
              {t('agroconecta.title', 'AgroConecta')}
            </motion.h1>
            
            <motion.p className="txc-subtitle" variants={itemVariants}>
              {t('agroconecta.subtitle', 'Rede de transporte e logística inteligente para o agronegócio')}
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
                {t('agroconecta.getStarted', 'Começar Agora')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="txc-btn-secondary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('agroconecta.explore', 'Explorar')}
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
            <h2 className="txc-title h2">
              {t('agroconecta.features.title', 'Recursos Principais')}
            </h2>
            <p className="txc-subtitle">
              {t('agroconecta.features.subtitle', 'Tecnologia avançada para revolucionar a logística agro')}
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
                  color: feature.color,
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

      {/* How It Works Section */}
      <section className="txc-section">
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
              <Star size={32} />
            </div>
            <h2 className="txc-title h2">
              {t('agroconecta.howItWorks.title', 'Como Funciona')}
            </h2>
            <p className="txc-subtitle">
              {t('agroconecta.howItWorks.subtitle', 'Processo simples e eficiente em apenas 3 passos')}
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
                  background: 'var(--txc-light-green)',
                  borderRadius: 'var(--txc-radius-xl) var(--txc-radius-xl) 0 0'
                }} />
                
                <div 
                  className="txc-title h1" 
                  style={{ 
                    fontSize: '3rem',
                    marginBottom: 'var(--txc-space-lg)',
                    fontWeight: '900',
                    background: 'var(--txc-gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
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
                
                <h3 className="txc-title h3" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {step.title}
                </h3>
                <p className="txc-text">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <Globe size={32} />
            </div>
            <h2 className="txc-title h2" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              {t('agroconecta.cta.title', 'Pronto para Conectar?')}
            </h2>
            <p className="txc-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              {t('agroconecta.cta.subtitle', 'Junte-se à maior rede de logística do agronegócio brasileiro')}
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="txc-btn-primary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('agroconecta.cta.haveLoad', 'Tenho Carga')}
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="txc-btn-secondary" style={{ padding: 'var(--txc-space-md) var(--txc-space-xl)' }}>
                {t('agroconecta.cta.transporter', 'Sou Transportador')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PremiumAgroConecta;