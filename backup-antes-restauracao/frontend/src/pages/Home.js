import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield, Zap, Globe, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CryptoHash from '../components/CryptoHash';
import {
  PremiumScrollReveal,
  PremiumFloatingCard,
  PremiumStaggeredContainer,
  PremiumGradientText,
  MouseTracker
} from '../components/animations/PremiumAnimations';

const Home = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Hero Section com visual do AgroisyncPlans
  const heroImageUrl = `/images/bela-natureza-retro-com-campo.jpg`;
  
  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de dados com criptografia de nível bancário e autenticação 2FA'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'Tecnologia de ponta para transações instantâneas e processamento em tempo real'
    },
    {
      icon: Globe,
      title: 'Global & Local',
      description: 'Conectividade mundial com foco no agronegócio brasileiro e internacional'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Rede de produtores, compradores e transportadores em constante crescimento'
    }
  ];

  // services: lista de serviços (mantida apenas como documentação local) - não usada diretamente na Home
  // Estatísticas exibidas na seção "Nossos Números"
  const stats = [
    { label: 'Usuários Ativos', number: '10k+' },
    { label: 'Transações/Mês', number: '120k+' },
    { label: 'Parceiros', number: '500+' },
    { label: 'Cidades Atendidas', number: '1.200+' }
  ];
  return (
    <div className='min-h-screen' style={{ background: 'var(--bloomfi-bg-primary)' }}>
      {/* Ticker de Cotações - Renderizado globalmente em App.js */}

      {/* Hero Section - BloomFi Style Compacto e Moderno */}
      <section
        className='bloomfi-hero'
        style={{
          backgroundImage: "url('/images/bela-natureza-retro-com-campo.jpg')",
        }}
      >
        <div className='bloomfi-overlay'></div>
        <div className='bloomfi-hero-content'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='bloomfi-fade-in'
            style={{ textAlign: 'center', width: '100%' }}
          >
            {/* Plus icon acima do título - menor */}
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white', opacity: 0.9 }}>+</div>
            <h1 className='bloomfi-hero-title'>
              Onde o Agronegócio <span className='bloomfi-gradient-text'>Cresce</span>
            </h1>
            <p className='bloomfi-hero-subtitle'>
              Uma plataforma moderna e intuitiva projetada para crescimento nativo e integração perfeita no ecossistema do agronegócio brasileiro.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to='/register' className='bloomfi-btn bloomfi-btn-black' style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}>
                Experimente Agora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Mantido e Reorganizado */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>
            <span className='bloomfi-gradient-text'>Nossos Números</span>
          </h2>
          <p className='bloomfi-section-subtitle'>
            Resultados que comprovam nossa excelência e impacto no agronegócio
          </p>
        </div>
        <div className='bloomfi-stats-grid'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bloomfi-stat-card'
            >
              <div className='bloomfi-stat-number'>{stat.number}</div>
              <div className='bloomfi-stat-label'>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What is Agroisync Section - BloomFi Style EXATO */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h2 className='bloomfi-section-title' style={{ textAlign: 'left', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '2rem' }}>
              O que é Agroisync?
            </h2>
            <Link to='/about' className='bloomfi-btn bloomfi-btn-outline' style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Explorar Agora
              <ArrowRight size={20} />
            </Link>
          </div>
          <div>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--bloomfi-text-secondary)' }}>
              Agroisync é uma plataforma completa de agronegócio que conecta produtores, compradores e transportadores, 
              oferecendo tecnologia avançada, IA integrada e soluções modernas para transformar o campo brasileiro.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - BloomFi Style EXATO */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-secondary)' }}>
        <div className='text-center' style={{ marginBottom: '3rem' }}>
          <h2 className='bloomfi-section-title'>
            {t('home.performance.title', 'O que oferecemos')}
          </h2>
          <p className='bloomfi-section-subtitle'>
            {t('home.performance.description', 'Recursos poderosos para transformar seu agronegócio')}
          </p>
        </div>
        <div className='bloomfi-feature-grid' style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className='bloomfi-feature-card'
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--bloomfi-border-radius-xl)',
                padding: '2.5rem',
                border: '1px solid var(--bloomfi-border-color-light)',
                boxShadow: 'var(--bloomfi-shadow-lg)',
                textAlign: 'left'
              }}
            >
              <div className='bloomfi-feature-icon' style={{ marginBottom: '1.5rem', marginLeft: 0 }}>
                <feature.icon size={32} style={{ color: 'white' }} />
              </div>
              <h3 className='bloomfi-feature-title' style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {feature.title}
              </h3>
              <p className='bloomfi-feature-description' style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notícias - Mantido */}
      <div className='py-8 text-center'>
        <h3 className='text-xl font-semibold text-gray-600'>{t('home.news.title', 'Notícias em Desenvolvimento')}</h3>
        <p className='mt-2 text-gray-500'>
          {t('home.news.description', 'Em breve teremos notícias do agronegócio disponíveis!')}
        </p>
      </div>

      {/* Use Cases Section - BloomFi Style EXATO */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '6rem', paddingBottom: '6rem', background: 'var(--bloomfi-bg-primary)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'start' }}>
          <div>
            <h3 className='bloomfi-section-title' style={{ fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'left' }}>Casos de Uso</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--bloomfi-text-secondary)' }}>
              Agroisync oferece uma variedade de casos de uso para desenvolvedores, empresas e produtores 
              que buscam integrações seguras e lucrativas no agronegócio.
            </p>
          </div>
          <div>
            <h3 className='bloomfi-section-title' style={{ fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'left' }}>Negócios</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--bloomfi-text-secondary)', marginBottom: '1.5rem' }}>
              Aumente o engajamento dos usuários oferecendo Agroisync, uma plataforma segura com alta performance, 
              permitindo que seus clientes cresçam sem esforço em sua plataforma.
            </p>
            <Link to='/business' style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--bloomfi-purple)', fontWeight: '600', textDecoration: 'none' }}>
              Saiba mais
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final - Mantido */}
      <section className='bloomfi-container-premium' style={{ paddingTop: '4rem', paddingBottom: '4rem', background: 'var(--bloomfi-bg-secondary)' }}>
        <div className='text-center'>
          <h2 className='bloomfi-section-title'>
            {t('home.cta.title', 'Pronto para o')}{' '}
            <span className='bloomfi-gradient-text'>{t('home.cta.highlight', 'Futuro')}</span>?
          </h2>
          <p className='bloomfi-section-subtitle'>
            {t(
              'home.cta.description',
              'Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia Agroisync. Transforme seu negócio hoje mesmo.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to='/register' className='bloomfi-btn bloomfi-btn-primary'>
              Começar Gratuitamente
              <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link to='/contact' className='bloomfi-btn bloomfi-btn-secondary'>
              Falar com Especialista
            </Link>
          </div>
          <div className='mt-8 flex justify-center'>
            <CryptoHash pageName='home' style={{ display: 'none' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
