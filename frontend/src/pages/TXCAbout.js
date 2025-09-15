import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Users,
  Target,
  Heart,
  Globe,
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

const TXCAbout = () => {
  const values = [
    {
      icon: <Target size={32} />,
      title: 'Inovação',
      description: 'Sempre buscamos as melhores tecnologias para revolucionar o agronegócio',
    },
    {
      icon: <Heart size={32} />,
      title: 'Paixão',
      description: 'Amamos o que fazemos e acreditamos no potencial do agronegócio brasileiro',
    },
    {
      icon: <Users size={32} />,
      title: 'Colaboração',
      description: 'Acreditamos que juntos podemos construir um futuro melhor para todos',
    },
    {
      icon: <Shield size={32} />,
      title: 'Transparência',
      description: 'Mantemos sempre a transparência em todas as nossas operações',
    },
  ];

  const team = [
    {
      name: 'João Silva',
      role: 'CEO & Fundador',
      description: '15 anos de experiência no agronegócio e tecnologia',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Maria Santos',
      role: 'CTO',
      description: 'Especialista em blockchain e desenvolvimento de software',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    },
    {
      name: 'Pedro Costa',
      role: 'Head de Produto',
      description: 'Experiência em produtos digitais para o agronegócio',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Fundação da AGROISYNC',
      description: 'Nascimento da ideia de revolucionar o agronegócio brasileiro',
    },
    {
      year: '2024',
      title: 'Primeiro MVP',
      description: 'Lançamento da primeira versão da plataforma',
    },
    {
      year: '2025',
      title: 'Expansão Nacional',
      description: 'Plataforma disponível em todo o território nacional',
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
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop")',
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
                <Globe size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              SOBRE A AGROISYNC
            </motion.h1>
            
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              Revolucionando o agronegócio brasileiro com tecnologia e inovação
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
              <Link to="/contact" className="txc-btn-outline">
                Fale Conosco
                <ArrowRight size={20} />
              </Link>
              <Link to="/plans" className="txc-btn-outline">
                Nossos Planos
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Nossa Missão</h2>
            <p className="txc-section-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>
              Conectar produtores, compradores e transportadores em uma plataforma única, 
              segura e eficiente, utilizando tecnologia blockchain e inteligência artificial 
              para revolucionar o agronegócio brasileiro.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Nossos Valores</h2>
            <p className="txc-section-subtitle">
              Os princípios que guiam nossa empresa
            </p>
          </motion.div>

          <div className="txc-cards-grid">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="txc-card txc-fade-in"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ textAlign: 'center' }}
              >
                <div className="txc-card-icon" style={{ color: 'var(--txc-green-accent)' }}>
                  {value.icon}
                </div>
                <h3 className="txc-card-title">
                  {value.title}
                </h3>
                <p className="txc-card-description">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Nossa Equipe</h2>
            <p className="txc-section-subtitle">
              Conheça as pessoas por trás da AGROISYNC
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto var(--txc-space-lg) auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 'var(--txc-shadow-lg)',
                  border: '4px solid var(--txc-green-accent)'
                }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                <h3 className="txc-card-title" style={{ marginBottom: 'var(--txc-space-sm)' }}>
                  {member.name}
                </h3>
                
                <div style={{
                  color: 'var(--txc-green-accent)',
                  fontWeight: '600',
                  marginBottom: 'var(--txc-space-md)',
                  fontSize: '1.125rem'
                }}>
                  {member.role}
                </div>
                
                <p className="txc-card-description">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Nossa Jornada</h2>
            <p className="txc-section-subtitle">
              Marcos importantes da nossa história
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--txc-space-xl)',
            marginTop: 'var(--txc-space-3xl)'
          }}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
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
                  {milestone.year}
                </div>
                
                <h3 className="txc-card-title" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {milestone.title}
                </h3>
                <p className="txc-card-description">
                  {milestone.description}
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
              <Award size={32} />
            </div>
            <h2 className="txc-section-title" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              Faça Parte da Revolução
            </h2>
            <p className="txc-section-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              Junte-se a nós na missão de transformar o agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="txc-btn txc-btn-primary">
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="txc-btn txc-btn-secondary">
                Fale Conosco
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TXCAbout;
