import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, Target, Heart, Globe, Award, Shield } from 'lucide-react';
import CryptoHash from '../components/CryptoHash';

const AgroisyncAbout = () => {
  const { t } = useTranslation();
  const values = [
    {
      icon: <Target size={32} />,
      title: t('about.values.innovation', 'Inovação'),
      description: t(
        'about.values.innovationDesc',
        'Sempre buscamos as melhores tecnologias para revolucionar o agronegócio'
      )
    },
    {
      icon: <Heart size={32} />,
      title: t('about.values.passion', 'Paixão'),
      description: t(
        'about.values.passionDesc',
        'Amamos o que fazemos e acreditamos no potencial do agronegócio brasileiro'
      )
    },
    {
      icon: <Users size={32} />,
      title: t('about.values.collaboration', 'Colaboração'),
      description: t(
        'about.values.collaborationDesc',
        'Acreditamos que juntos podemos construir um futuro melhor para todos'
      )
    },
    {
      icon: <Shield size={32} />,
      title: t('about.values.transparency', 'Transparência'),
      description: t('about.values.transparencyDesc', 'Mantemos sempre a transparência em todas as nossas operações')
    }
  ];

  const team = [
    {
      name: t('about.team.agroisyncTeam', 'Equipe AGROISYNC'),
      role: t('about.team.agroExperts', 'Especialistas em Agronegócio'),
      description: t(
        'about.team.agroisyncDesc',
        'Uma equipe dedicada de profissionais apaixonados pelo agronegócio brasileiro, trabalhando incansavelmente para conectar produtores, compradores e transportadores em uma plataforma revolucionária.'
      ),
      image:
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybSUyMHRlYW0lMjB3b3JraW5nfGVufDB8fDB8fHww'
    },
    {
      name: t('about.team.techInnovation', 'Tecnologia & Inovação'),
      role: t('about.team.continuousDev', 'Desenvolvimento Contínuo'),
      description: t(
        'about.team.techDesc',
        'Nossa equipe de desenvolvimento está constantemente trabalhando para implementar as mais avançadas tecnologias, incluindo blockchain, IA e soluções sustentáveis para o agronegócio.'
      ),
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMHRlYW18ZW58MHx8MHx8fDA%3D'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: t('about.milestones.ideaBirth', 'Nascimento da Ideia'),
      description: t(
        'about.milestones.ideaDesc',
        'A ideia da AGROISYNC foi criada por amigos apaixonados pelo agronegócio, visando revolucionar a forma como produtores e compradores se conectam no Brasil.'
      )
    },
    {
      year: '2024',
      title: t('about.milestones.executionStart', 'Início da Execução'),
      description: t(
        'about.milestones.executionDesc',
        'Começamos a desenvolver a plataforma com foco na sustentabilidade, tecnologia avançada e apoio tanto ao pequeno quanto ao grande agricultor.'
      )
    },
    {
      year: '2025',
      title: t('about.milestones.fullImplementation', 'Implementação Completa'),
      description: t(
        'about.milestones.implementationDesc',
        'Plataforma 100% operacional com IA avançada (7 funcionalidades), OpenStreetMap gratuito, sistema de avaliações 5 estrelas, corretora de criptomoedas, nossa própria AgroToken (AGT) e marketplace completo. A revolução do agronegócio está aqui!'
      )
    }
  ];

  const features = [
    {
      icon: <Target size={32} />,
      title: t('about.features.sustainableTech', 'Tecnologia Sustentável'),
      description: t(
        'about.features.sustainableDesc',
        'OpenStreetMap 100% gratuito, sem limites de requisições. Rotas inteligentes que economizam combustível e reduzem emissões de CO2.'
      )
    },
    {
      icon: <Users size={32} />,
      title: t('about.features.democratization', 'Democratização do Agronegócio'),
      description: t(
        'about.features.democratizationDesc',
        'IA de precificação justa para todos, matching automático de motoristas, sistema de avaliações transparente e planos acessíveis desde R$ 29,90/mês.'
      )
    },
    {
      icon: <Globe size={32} />,
      title: t('about.features.globalInnovation', 'Inovação Global'),
      description: t(
        'about.features.globalDesc',
        'Corretora de criptomoedas integrada (BTC, ETH, USDT), MetaMask, nossa própria AgroToken (AGT) e suporte a pagamentos em cripto. O futuro é agora!'
      )
    },
    {
      icon: <Award size={32} />,
      title: t('about.features.guaranteedQuality', 'Qualidade Garantida'),
      description: t(
        'about.features.qualityDesc',
        'Sistema de avaliações 5 estrelas com 4 critérios detalhados, badges automáticas (Top Performer, Premium, Verificado) e detecção de fraudes por IA.'
      )
    }
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div>
      {/* Hero Section - BloomFi Style */}
      <section
        className='bloomfi-hero'
        style={{
          backgroundImage: "url('/images/bela-natureza-retro-com-campo.jpg')",
        }}
      >
        <div className='bloomfi-overlay'></div>
        <div className='bloomfi-hero-content'>
          <motion.div variants={heroVariants} initial='hidden' animate='visible' style={{ textAlign: 'center', maxWidth: '900px' }}>
            <div className='bloomfi-badge' style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
              {t('about.badge')}
            </div>
            <motion.h1 
              className='bloomfi-hero-title' 
              variants={itemVariants}
              style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '1.5rem' }}
            >
              {t('about.heroTitle')}
            </motion.h1>
            <motion.p 
              className='bloomfi-hero-subtitle' 
              variants={itemVariants}
              style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', maxWidth: '700px', margin: '0 auto 2rem' }}
            >
              {t('about.heroDesc')}
            </motion.p>
            <motion.div
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}
              variants={itemVariants}
            >
              <Link to='/contact' className='bloomfi-btn bloomfi-btn-black' style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                {t('about.contactUs')}
                <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
              <Link to='/planos' className='bloomfi-btn bloomfi-btn-secondary' style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                {t('about.ourPlans')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-primary)' }}>
        <div className='text-center'>
          <h2 className='bloomfi-section-title'>{t('about.mission.title', 'Nossa Missão')}</h2>
          <p className='bloomfi-section-subtitle' style={{ maxWidth: '800px', margin: '0 auto' }}>
            {t(
              'about.mission.description',
              'Conectar produtores, compradores e transportadores em uma plataforma única, segura e eficiente, utilizando tecnologia blockchain e inteligência artificial para revolucionar o agronegócio brasileiro.'
            )}
          </p>
        </div>
      </section>

      {/* Values Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-secondary)' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>{t('about.values.title', 'Nossos Valores')}</h2>
          <p className='bloomfi-section-subtitle'>
            {t('about.values.subtitle', 'Os princípios que guiam nossa empresa')}
          </p>
        </div>
        <div className='bloomfi-feature-grid' style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className='bloomfi-feature-card'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className='bloomfi-feature-icon' style={{ margin: '0 0 1.5rem 0' }}>
                {value.icon}
              </div>
              <h3 className='bloomfi-feature-title'>{value.title}</h3>
              <p className='bloomfi-feature-description'>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-primary)' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>{t('about.differentiation.title', 'O Que Nos Diferencia')}</h2>
          <p className='bloomfi-section-subtitle'>
            {t('about.differentiation.subtitle', 'Inovações que transformam o agronegócio')}
          </p>
        </div>
        <div className='bloomfi-feature-grid' style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`bloomfi-feature-card ${index % 2 === 0 ? 'bloomfi-card-purple' : 'bloomfi-card-blue'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className='bloomfi-feature-icon' style={{ margin: '0 0 1.5rem 0' }}>
                {feature.icon}
              </div>
              <h3 className='bloomfi-feature-title'>{feature.title}</h3>
              <p className='bloomfi-feature-description'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-secondary)' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>Nossa Equipe</h2>
          <p className='bloomfi-section-subtitle' style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t('about.team.title', 'Conheça as pessoas por trás da AGROISYNC')}
          </p>
        </div>
        <div className='bloomfi-feature-grid' style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className='bloomfi-feature-card'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 2rem auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 'var(--bloomfi-shadow-lg)',
                  border: '4px solid var(--bloomfi-purple)'
                }}
              >
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
              <h3 className='bloomfi-feature-title' style={{ marginBottom: '0.5rem' }}>{member.name}</h3>
              <div style={{ color: 'var(--bloomfi-purple)', fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>
                {member.role}
              </div>
              <p className='bloomfi-feature-description'>{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-primary)' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>{t('about.journey.title', 'Nossa Jornada')}</h2>
          <p className='bloomfi-section-subtitle'>
            {t('about.journey.subtitle', 'Marcos importantes da nossa história')}
          </p>
        </div>
        <div className='bloomfi-feature-grid' style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className='bloomfi-feature-card'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              style={{ textAlign: 'center', position: 'relative' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--bloomfi-gradient-primary)',
                  borderRadius: 'var(--bloomfi-border-radius-xl) var(--bloomfi-border-radius-xl) 0 0'
                }}
              />
              <div className='bloomfi-stat-number' style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                {milestone.year}
              </div>
              <h3 className='bloomfi-feature-title' style={{ marginBottom: '1rem' }}>{milestone.title}</h3>
              <p className='bloomfi-feature-description'>{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - BloomFi Style */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-secondary)' }}>
        <div className='text-center'>
          <div className='bloomfi-feature-icon' style={{ width: '100px', height: '100px', margin: '0 auto 2rem', fontSize: '3rem' }}>
            <Award size={40} style={{ color: 'white' }} />
          </div>
          <h2 className='bloomfi-section-title' style={{ marginBottom: '1.5rem' }}>
            Faça Parte da <span className='bloomfi-gradient-text'>Revolução</span>
          </h2>
          <p className='bloomfi-section-subtitle' style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Junte-se a nós na missão de transformar o agronegócio brasileiro
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to='/register' className='bloomfi-btn bloomfi-btn-primary'>
              {t('about.startNow')}
              <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link to='/contact' className='bloomfi-btn bloomfi-btn-secondary'>
              {t('about.contactUs')}
            </Link>
          </div>
          <div className='mt-8 flex justify-center'>
            <CryptoHash pageName='about' style={{ display: 'none' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncAbout;
