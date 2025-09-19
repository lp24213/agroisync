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
  Shield
} from 'lucide-react';

const AgroisyncAbout = () => {
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
      name: 'Luis Paulo',
      role: 'CEO & Fundador',
      description: '15 anos de experiência no agronegócio e tecnologia',
      image: '/assets/logo-agroisync.svg',
    },
    {
      name: 'Taiza Dellazzari',
      role: 'Co-fundador',
      description: 'Especialista em blockchain e desenvolvimento de software',
      image: '/assets/logo-agroisync.svg',
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
      <section className="agro-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://media.istockphoto.com/id/1364083240/pt/foto/technology-in-the-field-laptop.webp?a=1&b=1&s=612x612&w=0&k=20&c=BtnjQ7Ndc3CWQE1fi0h-80owrTk2vZb9wGQtycK-52M=")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
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
                <Globe size={48} />
              </div>
            </motion.div>

            <motion.h1 className="agro-hero-title" variants={itemVariants}>
              SOBRE A AGROISYNC
            </motion.h1>
            
            <motion.p className="agro-hero-subtitle" variants={itemVariants}>
              Revolucionando o agronegócio brasileiro com tecnologia e inovação
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
              <Link to="/contact" className="agro-btn-outline">
                Fale Conosco
                <ArrowRight size={20} />
              </Link>
              <Link to="/plans" className="agro-btn-outline">
                Nossos Planos
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Nossa Missão</h2>
            <p className="agro-section-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>
              Conectar produtores, compradores e transportadores em uma plataforma única, 
              segura e eficiente, utilizando tecnologia blockchain e inteligência artificial 
              para revolucionar o agronegócio brasileiro.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Nossos Valores</h2>
            <p className="agro-section-subtitle">
              Os princípios que guiam nossa empresa
            </p>
          </motion.div>

          <div className="agro-cards-grid">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="agro-card agro-fade-in"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ textAlign: 'center' }}
              >
                <div className="agro-card-icon" style={{ color: 'var(--txc-light-green)' }}>
                  {value.icon}
                </div>
                <h3 className="agro-card-title">
                  {value.title}
                </h3>
                <p className="agro-card-description">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Nossa Equipe</h2>
            <p className="agro-section-subtitle">
              Conheça as pessoas por trás da AGROISYNC
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-xl)' 
          }}>
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="agro-card"
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
                  margin: '0 auto var(--agro-space-lg) auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 'var(--agro-shadow-lg)',
                  border: '4px solid var(--txc-light-green)'
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
                
                <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-sm)' }}>
                  {member.name}
                </h3>
                
                <div style={{
                  color: 'var(--txc-light-green)',
                  fontWeight: '600',
                  marginBottom: 'var(--agro-space-md)',
                  fontSize: '1.125rem'
                }}>
                  {member.role}
                </div>
                
                <p className="agro-card-description">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Nossa Jornada</h2>
            <p className="agro-section-subtitle">
              Marcos importantes da nossa história
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-xl)',
            marginTop: 'var(--agro-space-3xl)'
          }}>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="agro-card"
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
                  background: 'var(--txc-light-green)',
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
                  {milestone.year}
                </div>
                
                <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {milestone.title}
                </h3>
                <p className="agro-card-description">
                  {milestone.description}
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
              <Award size={32} />
            </div>
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Faça Parte da Revolução
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Junte-se a nós na missão de transformar o agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--agro-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="agro-btn agro-btn-primary">
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="agro-btn agro-btn-secondary">
                Fale Conosco
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncAbout;
