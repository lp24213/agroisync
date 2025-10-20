import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield, Zap, Globe, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CryptoHash from '../components/CryptoHash';
// import Noticias from '../components/Noticias'; // Componente removido
// import Ticker from '../components/Ticker'; // Componente removido
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
  const heroImageUrl = `https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`;
  
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
    <div className='min-h-screen'>
      {/* Bolsa de Valores Ticker */}
      <div className='py-8 text-center'>
        <h3 className='text-xl font-semibold text-gray-600'>
          {t('home.ticker.title', 'Ticker de Cotações em Desenvolvimento')}
        </h3>
        <p className='mt-2 text-gray-500'>
          {t('home.ticker.description', 'Em breve teremos ticker de cotações disponível!')}
        </p>
      </div>

      {/* Hero Section Principal */}
      <section
        className='home-hero-desktop relative flex w-full items-center justify-center overflow-hidden hero-section background-image'
          style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600747476236-76579658b1b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FNUE8lMjBERSUyMFNPSkF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          width: '100%',
          minHeight: 'calc(100svh - 64px)',
          zIndex: 1,
          display: 'flex',
          position: 'relative',
          backgroundColor: 'transparent'
        }}
      >
        {/* Overlay sutil para melhorar legibilidade */}
        <div className='absolute inset-0 bg-black/20'></div>

        {/* Imagem de fallback para mobile */}
        <img
          src='https://images.unsplash.com/photo-1600747476236-76579658b1b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FNUE8lMjBERSUyMFNPSkF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1080&q=80'
          alt='Campo de Soja'
          loading='lazy'
          className='absolute inset-0 h-full w-full object-cover md:hidden'
          style={{ zIndex: -1 }}
        />

        {/* Conteúdo Centralizado */}
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center md:flex md:flex-col md:items-center md:justify-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='rounded-3xl border border-white/20 bg-white/95 p-12 shadow-2xl backdrop-blur-md'
          >
            <h1 className='mb-8 text-5xl font-bold text-gray-800 md:text-7xl md:max-w-3xl md:mx-auto'>
              {t('home.partner.title', 'Seja Nosso')}{' '}
              <span className='text-green-600'>{t('home.partner.highlight', 'Parceiro')}</span>
            </h1>
            <p className='mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl md:max-w-2xl md:mx-auto'>
              {t(
                'home.partner.description',
                'Junte-se à revolução do agronegócio brasileiro e faça parte da maior plataforma de conectividade rural do país.'
              )}
            </p>
            <div className='flex flex-col items-center justify-center gap-6 sm:flex-row'>
              <Link to='/register'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-green-700 md:px-10 md:py-5 md:text-xl'
                >
                  Explorar Plataforma
                  <ArrowRight size={24} className='ml-3 inline' />
                </motion.button>
              </Link>
              <Link to='/about'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='rounded-xl border-2 border-green-600 px-8 py-4 text-lg font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white md:px-10 md:py-5 md:text-xl'
                >
                  Saiba Mais
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Premium Cards */}
      <section className='relative py-32'>
        <div className='container-premium'>
          <PremiumScrollReveal delay={0.2}>
            <div className='mb-20 text-center'>
              <PremiumGradientText className='mb-8 text-5xl font-bold md:text-6xl' gradient='cosmic'>
                Nossos Números
              </PremiumGradientText>
              <p className='text-pearl mx-auto max-w-4xl text-xl'>
                Resultados que comprovam nossa excelência e impacto no agronegócio
              </p>
            </div>
          </PremiumScrollReveal>

          <PremiumStaggeredContainer staggerDelay={0.2} className='grid-premium grid-4'>
            {stats.map((stat, index) => (
              <MouseTracker key={stat.label} intensity={0.05}>
                <PremiumFloatingCard delay={index * 0.1} className='text-center'>
                  <div className='mb-4 text-5xl font-bold md:text-6xl'>
                    <PremiumGradientText gradient='metallic'>{stat.number}</PremiumGradientText>
                  </div>
                  <div className='text-pearl text-lg font-semibold'>{stat.label}</div>
                </PremiumFloatingCard>
              </MouseTracker>
            ))}
          </PremiumStaggeredContainer>
        </div>
      </section>

      {/* Campo de Soja 4K - Performance em Tempo Real */}
      <section
        className='relative py-20'
        style={{
          backgroundImage: "url('/images/inicio.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          minHeight: '80vh'
        }}
      >
        <div className='absolute inset-0 bg-black/30'></div>
        <div className='container relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-6 text-4xl font-bold text-white drop-shadow-lg md:text-5xl'>
              {t('home.performance.title', 'Performance em')}{' '}
              <span className='text-yellow-300'>{t('home.performance.highlight', 'Tempo Real')}</span>
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-white/90 drop-shadow-md'>
              {t('home.performance.description', 'Dados atualizados a cada segundo para decisões mais inteligentes')}
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='rounded-2xl bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm transition-transform hover:scale-105'
              >
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-800'>
                  <feature.icon size={32} className='text-white' />
                </div>
                <h3 className='mb-4 text-xl font-bold text-gray-800'>{feature.title}</h3>
                <p className='leading-relaxed text-gray-600'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className='py-8 text-center'>
        <h3 className='text-xl font-semibold text-gray-600'>{t('home.news.title', 'Notícias em Desenvolvimento')}</h3>
        <p className='mt-2 text-gray-500'>
          {t('home.news.description', 'Em breve teremos notícias do agronegócio disponíveis!')}
        </p>
      </div>
      {/* CTA Section - Premium */}
      <section className='bg-gradient-hero py-20'>
        <div className='container text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-primary mb-6 text-4xl font-bold md:text-5xl'>
              {t('home.cta.title', 'Pronto para o')}{' '}
              <span className='text-gradient'>{t('home.cta.highlight', 'Futuro')}</span>?
            </h2>
            <p
              className={`mx-auto mb-12 max-w-3xl text-xl leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {t(
                'home.cta.description',
                'Junte-se a milhares de profissionais do agronegócio que já descobriram o poder da tecnologia Agroisync. Transforme seu negócio hoje mesmo.'
              )}
            </p>
            <div className='flex flex-col items-center justify-center gap-6 sm:flex-row'>
              <Link to='/register' className='btn-premium flex items-center gap-3 px-8 py-4 text-lg font-semibold'>
                Começar Gratuitamente
                <ArrowRight size={20} />
              </Link>
              <Link to='/contact' className='btn-premium-secondary px-8 py-4 text-lg font-semibold'>
                Falar com Especialista
              </Link>
            </div>
            <div className='mt-8 flex justify-center'>
              <CryptoHash pageName='home' style={{ display: 'none' }} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
