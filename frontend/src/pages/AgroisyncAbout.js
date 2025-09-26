import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const values = [
    {
      icon: <Target size={32} />,
      title: t('about.values.innovation', 'Inovação'),
      description: t('about.values.innovationDesc', 'Sempre buscamos as melhores tecnologias para revolucionar o agronegócio'),
    },
    {
      icon: <Heart size={32} />,
      title: t('about.values.passion', 'Paixão'),
      description: t('about.values.passionDesc', 'Amamos o que fazemos e acreditamos no potencial do agronegócio brasileiro'),
    },
    {
      icon: <Users size={32} />,
      title: t('about.values.collaboration', 'Colaboração'),
      description: t('about.values.collaborationDesc', 'Acreditamos que juntos podemos construir um futuro melhor para todos'),
    },
    {
      icon: <Shield size={32} />,
      title: t('about.values.transparency', 'Transparência'),
      description: t('about.values.transparencyDesc', 'Mantemos sempre a transparência em todas as nossas operações'),
    },
  ];

  const team = [
    {
      name: t('about.team.agroisyncTeam', 'Equipe AGROISYNC'),
      role: t('about.team.agroExperts', 'Especialistas em Agronegócio'),
      description: t('about.team.agroisyncDesc', 'Uma equipe dedicada de profissionais apaixonados pelo agronegócio brasileiro, trabalhando incansavelmente para conectar produtores, compradores e transportadores em uma plataforma revolucionária.'),
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybSUyMHRlYW0lMjB3b3JraW5nfGVufDB8fDB8fHww',
    },
    {
      name: t('about.team.techInnovation', 'Tecnologia & Inovação'),
      role: t('about.team.continuousDev', 'Desenvolvimento Contínuo'),
      description: t('about.team.techDesc', 'Nossa equipe de desenvolvimento está constantemente trabalhando para implementar as mais avançadas tecnologias, incluindo blockchain, IA e soluções sustentáveis para o agronegócio.'),
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMHRlYW18ZW58MHx8MHx8fDA%3D',
    },
  ];

  const milestones = [
    {
      year: '2023',
      title: t('about.milestones.ideaBirth', 'Nascimento da Ideia'),
      description: t('about.milestones.ideaDesc', 'A ideia da AGROISYNC foi criada por amigos apaixonados pelo agronegócio, visando revolucionar a forma como produtores e compradores se conectam no Brasil.'),
    },
    {
      year: '2024',
      title: t('about.milestones.executionStart', 'Início da Execução'),
      description: t('about.milestones.executionDesc', 'Começamos a desenvolver a plataforma com foco na sustentabilidade, tecnologia avançada e apoio tanto ao pequeno quanto ao grande agricultor.'),
    },
    {
      year: '2025',
      title: t('about.milestones.fullImplementation', 'Implementação Completa'),
      description: t('about.milestones.implementationDesc', 'Lançamento da plataforma completa com blockchain, IA, e todas as funcionalidades para transformar o agronegócio brasileiro.'),
    },
  ];

  const features = [
    {
      icon: <Target size={32} />,
      title: t('about.features.sustainableTech', 'Tecnologia Sustentável'),
      description: t('about.features.sustainableDesc', 'Implementamos soluções que promovem a agricultura sustentável e o uso eficiente de recursos naturais.'),
    },
    {
      icon: <Users size={32} />,
      title: t('about.features.democratization', 'Democratização do Agronegócio'),
      description: t('about.features.democratizationDesc', 'Conectamos pequenos produtores familiares aos grandes compradores, criando oportunidades iguais para todos.'),
    },
    {
      icon: <Globe size={32} />,
      title: t('about.features.globalInnovation', 'Inovação Global'),
      description: t('about.features.globalDesc', 'Utilizamos as mais avançadas tecnologias internacionais adaptadas para a realidade brasileira.'),
    },
    {
      icon: <Award size={32} />,
      title: t('about.features.guaranteedQuality', 'Qualidade Garantida'),
      description: t('about.features.qualityDesc', 'Sistema de verificação e certificação que garante a qualidade dos produtos comercializados.'),
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
              {t('about.hero.title', 'SOBRE A AGROISYNC')}
            </motion.h1>
            
            <motion.p className="agro-hero-subtitle" variants={itemVariants}>
              {t('about.hero.subtitle', 'Revolucionando o agronegócio brasileiro com tecnologia e inovação')}
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
            <h2 className="agro-section-title">{t('about.mission.title', 'Nossa Missão')}</h2>
            <p className="agro-section-subtitle" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {t('about.mission.description', 'Conectar produtores, compradores e transportadores em uma plataforma única, segura e eficiente, utilizando tecnologia blockchain e inteligência artificial para revolucionar o agronegócio brasileiro.')}
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
            <h2 className="agro-section-title">{t('about.values.title', 'Nossos Valores')}</h2>
            <p className="agro-section-subtitle">
              {t('about.values.subtitle', 'Os princípios que guiam nossa empresa')}
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
            <h2 className="agro-section-title">{t('about.differentiation.title', 'O Que Nos Diferencia')}</h2>
            <p className="agro-section-subtitle">
              {t('about.differentiation.subtitle', 'Inovações que transformam o agronegócio')}
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
                style={{ textAlign: 'center' }}
              >
                <div className="agro-card-icon" style={{ color: 'var(--txc-light-green)' }}>
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

      {/* Team Section */}
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
            style={{ 
              marginBottom: '4rem',
              padding: '0 20px'
            }}
          >
            <h2 className="agro-section-title" style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Nossa Equipe
            </h2>
            <p className="agro-section-subtitle" style={{
              fontSize: '1.25rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {t('about.team.title', 'Conheça as pessoas por trás da AGROISYNC')}
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
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
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 2rem auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 'var(--agro-shadow-lg)',
                  border: '5px solid var(--txc-light-green)'
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
                
                <h3 className="agro-card-title" style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {member.name}
                </h3>
                
                <div style={{
                  color: 'var(--txc-light-green)',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  fontSize: '1.25rem'
                }}>
                  {member.role}
                </div>
                
                <p className="agro-card-description" style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#666'
                }}>
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
            <h2 className="agro-section-title">{t('about.journey.title', 'Nossa Jornada')}</h2>
            <p className="agro-section-subtitle">
              {t('about.journey.subtitle', 'Marcos importantes da nossa história')}
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
            style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              padding: '0 20px'
            }}
          >
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 2rem auto',
              background: 'var(--agro-gradient-accent)',
              borderRadius: 'var(--agro-radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--agro-dark-green)',
              boxShadow: 'var(--agro-shadow-lg)'
            }}>
              <Award size={40} />
            </div>
            <h2 className="agro-section-title" style={{ 
              marginBottom: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              Faça Parte da Revolução
            </h2>
            <p className="agro-section-subtitle" style={{ 
              marginBottom: '3rem',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 3rem auto'
            }}>
              Junte-se a nós na missão de transformar o agronegócio brasileiro
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <Link to="/register" className="agro-btn agro-btn-primary" style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="agro-btn agro-btn-secondary" style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
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
