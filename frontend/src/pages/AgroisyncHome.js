import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { DollarSign, CloudSun, BarChart3, Package, Truck, Star } from 'lucide-react';
import GrainsChart from '../components/GrainsChart';
// CompactWeatherWidget removido - usando GlobalWeatherWidget no App.js
import CryptoHash from '../components/CryptoHash';
import GrainInfo from '../components/GrainInfo';
import AgriNews from '../components/AgriNews';

const AgroisyncHome = () => {
  const { t } = useTranslation();
  const [showLogoAnimation, setShowLogoAnimation] = React.useState(true);
  const backgroundRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafId = useRef(null);
  
  // Imagem de campo de soja e trigo com cache buster - usando imagem de alta resolução
  const inicioImageUrl = `/images/bela-natureza-retro-com-campo.jpg`;

  // Parallax otimizado com requestAnimationFrame
  useEffect(() => {
    if (!backgroundRef.current || showLogoAnimation) return;

    let lastTime = 0;
    const throttleTime = 16; // ~60fps

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleTime) return;
      lastTime = now;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalizar posição do mouse (-1 a 1)
      mouseX.current = (clientX / innerWidth) * 2 - 1;
      mouseY.current = (clientY / innerHeight) * 2 - 1;
    };

    const animate = () => {
      // Lerp suave para movimento fluido
      const lerp = 0.05;
      currentX.current += (mouseX.current - currentX.current) * lerp;
      currentY.current += (mouseY.current - currentY.current) * lerp;

      // Aplicar transform com translate3d para GPU acceleration
      if (backgroundRef.current) {
        const moveX = currentX.current * 30; // Movimento máximo de 30px
        const moveY = currentY.current * 30;
        backgroundRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.1)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [showLogoAnimation]);

  React.useEffect(() => {
    if (
      typeof document !== 'undefined' &&
      document.body &&
      document.body.classList &&
      typeof document.body.classList.add === 'function'
    ) {
      if (showLogoAnimation) {
        document.body.classList.add('agro-logo-animation-active');
      } else if (typeof document.body.classList.remove === 'function') {
        document.body.classList.remove('agro-logo-animation-active');
      }
    }
    return () => {
      if (
        typeof document !== 'undefined' &&
        document.body &&
        document.body.classList &&
        typeof document.body.classList.remove === 'function'
      ) {
        document.body.classList.remove('agro-logo-animation-active');
      }
    };
  }, [showLogoAnimation]);

  // Animação de entrada do logo
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogoAnimation(false);
    }, 2000); // Mostra o logo por 2 segundos
    return () => clearTimeout(timer);
  }, []);

  const sectionVariants = {
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

  // Proteção extra: nunca passar undefined/null para Helmet
  const safeTitle = "AGROISYNC - Futuro do Agronegócio | Marketplace + Fretes + IA";
  const safeDescription = "A plataforma mais completa do agronegócio brasileiro. Marketplace de produtos agrícolas, sistema de fretes inteligente, cotações em tempo real, previsão climática e IA integrada. Tudo em um só lugar.";
  const safeKeywords = "agronegócio, marketplace agrícola, fretes agrícolas, cotações soja milho, previsão clima agrícola, IA agronegócio, logística agrícola, produtos agrícolas";
  const safeOgTitle = "AGROISYNC - Futuro do Agronegócio";
  const safeOgDescription = "Marketplace + Fretes + IA. Tudo em um só lugar para o produtor rural. Cotações em tempo real, previsão climática e logística inteligente.";
  const safeOgType = "website";
  const safeOgUrl = "https://agroisync.com/";
  const safeCanonical = "https://agroisync.com/";
  return (
    <>
      <Helmet>
        <title>{safeTitle}</title>
        <meta name="description" content={safeDescription} />
        <meta name="keywords" content={safeKeywords} />
        <meta property="og:title" content={safeOgTitle} />
        <meta property="og:description" content={safeOgDescription} />
        <meta property="og:type" content={safeOgType} />
        <meta property="og:url" content={safeOgUrl} />
        <link rel="canonical" href={safeCanonical} />
      </Helmet>
      {/* Background fixo com parallax - otimizado */}
      <div 
        ref={backgroundRef}
        className='soy-field-background'
        style={{
          position: 'fixed',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `url('${inicioImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          zIndex: -1,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0) scale(1.1)',
          transition: 'transform 0.3s ease-out'
        }}
      />
      {/* Overlay escuro sutil para legibilidade */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      
      <div className='agro-home-container' style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Animação de entrada do Logo Agroisync */}
      <AnimatePresence>
        {showLogoAnimation && (
          <motion.div
            key="logo-animation"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [1, 1, 1]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
              style={{
                width: '320px',
                height: '320px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src="/LOGO_AGROISYNC_TRANSPARENTE.png" 
                alt="Agroisync logo principal" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.src = '/agroisync-logo.svg';
                  e.target.onerror = () => {
                    e.target.style.display = 'none';
                  };
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Conteúdo principal - aparece após animação */}
      {!showLogoAnimation && (
        <>
          {/* Ticker da Bolsa removido (já existe fixo no topo pelo App.js) */}


      {/* Layout Principal - Duas Colunas */}
      <div className='agro-main-layout' style={{ position: 'relative', zIndex: 1, backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)' }}>
        {/* Coluna Principal - Esquerda */}
        <div className='agro-main-content'>
          {/* Features Section */}
          <section className='agro-features-section'>
            <motion.div
              className='agro-features-grid'
              variants={sectionVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
            >
              <motion.div className='bloomfi-feature-card bloomfi-card-purple' variants={itemVariants}>
                <div className='bloomfi-feature-icon'><DollarSign className='h-8 w-8' /></div>
                <h3 className='bloomfi-feature-title'>
                  {t('home.features.costReduction')}
                </h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.costReductionDesc')}
                </p>
                <ul style={{ textAlign: 'left', marginTop: '15px', color: 'var(--bloomfi-text-secondary)', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>• {t('home.features.fertilizers')}</li>
                  <li style={{ marginBottom: '0.5rem' }}>• {t('home.features.pesticides')}</li>
                  <li style={{ marginBottom: '0.5rem' }}>• {t('home.features.fuel')}</li>
                  <li>• {t('home.features.irrigation')}</li>
                </ul>
              </motion.div>

              <motion.div className='bloomfi-feature-card bloomfi-card-blue' variants={itemVariants}>
                <div className='bloomfi-feature-icon'><CloudSun className='h-8 w-8' /></div>
                <h3 className='bloomfi-feature-title'>
                  {t('home.features.weatherForecast')}
                </h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.weatherForecastDesc')}
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className='bloomfi-badge' style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>{t('home.features.realTimeAlerts')}</span>
                  <span className='bloomfi-badge' style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>{t('home.features.plantingWindow')}</span>
                  <span className='bloomfi-badge' style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>{t('home.features.soilMoisture')}</span>
                </div>
              </motion.div>

              <motion.div className='bloomfi-feature-card bloomfi-card-purple' variants={itemVariants}>
                <div className='bloomfi-feature-icon'><BarChart3 className='h-8 w-8' /></div>
                <h3 className='bloomfi-feature-title'>
                  {t('home.features.profitSimulator')}
                </h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.profitSimulatorDesc')}
                </p>
                <div className='bloomfi-card' style={{ marginTop: '15px', padding: '1rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--bloomfi-purple)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('home.features.example')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bloomfi-text-secondary)' }}>{t('home.features.cost')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--bloomfi-text-secondary)' }}>{t('home.features.revenue')}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--bloomfi-purple)', fontWeight: 'bold', marginTop: '0.3125rem' }}>{t('home.features.profit')}</div>
                </div>
              </motion.div>


              <Link to='/marketplace' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='bloomfi-feature-card bloomfi-card-blue' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div className='bloomfi-feature-icon'><Package className='h-8 w-8' /></div>
                  <h3 className='bloomfi-feature-title'>{t('home.features.marketplace')}</h3>
                  <p className='bloomfi-feature-description'>
                    {t('home.features.marketplaceDesc')}
                  </p>
                </motion.div>
              </Link>

              <Link to='/freights' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='bloomfi-feature-card bloomfi-card-purple' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div className='bloomfi-feature-icon'><Truck className='h-8 w-8' /></div>
                  <h3 className='bloomfi-feature-title'>{t('home.features.smartFreight')}</h3>
                  <p className='bloomfi-feature-description'>
                    {t('home.features.smartFreightDesc')}
                  </p>
                </motion.div>
              </Link>

              <motion.div className='bloomfi-feature-card bloomfi-card-silver' variants={itemVariants}>
                <div className='bloomfi-feature-icon'><Star className='h-8 w-8' /></div>
                <h3 className='bloomfi-feature-title'>{t('home.features.ratings')}</h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.ratingsDesc')}
                </p>
              </motion.div>

              <Link to='/dashboard' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='bloomfi-feature-card bloomfi-card-blue' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div className='bloomfi-feature-icon'>💬</div>
                  <h3 className='bloomfi-feature-title'>{t('home.features.aiChat')}</h3>
                  <p className='bloomfi-feature-description'>
                    {t('home.features.aiChatDesc')}
                  </p>
                </motion.div>
              </Link>

              <motion.div className='bloomfi-feature-card bloomfi-card-purple' variants={itemVariants}>
                <div className='bloomfi-feature-icon'>🤝</div>
                <h3 className='bloomfi-feature-title'>{t('home.features.partnerships')}</h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.partnershipsDesc')}
                </p>
              </motion.div>

              <motion.div className='bloomfi-feature-card bloomfi-card-blue' variants={itemVariants}>
                <div className='bloomfi-feature-icon'>💳</div>
                <h3 className='bloomfi-feature-title'>{t('home.features.modernPayments')}</h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.modernPaymentsDesc')}
                </p>
              </motion.div>

              <motion.div className='bloomfi-feature-card bloomfi-card-purple' variants={itemVariants}>
                <div className='bloomfi-feature-icon'>📊</div>
                <h3 className='bloomfi-feature-title'>{t('home.features.realTimeAnalysis')}</h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.realTimeAnalysisDesc')}
                </p>
              </motion.div>

              <motion.div className='bloomfi-feature-card bloomfi-card-silver' variants={itemVariants}>
                <div className='bloomfi-feature-icon'>♿</div>
                <h3 className='bloomfi-feature-title'>{t('home.features.accessibility')}</h3>
                <p className='bloomfi-feature-description'>
                  {t('home.features.accessibilityDesc')}
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Seção de Informações dos Grãos */}
          <GrainInfo />
        </div>

        {/* Sidebar - Direita */}
        {/* Seção de Notícias - Centralizada e Responsiva */}
        <section className='agro-news-main-section'>
          <AgriNews />
        </section>
        {/* Sidebar - Direita */}
        <div className='agro-sidebar'>
          {/* Ultra Gráfico de Cotações */}
          <GrainsChart />
        </div>
      </div>

      <style jsx>{`
        /* Layout Principal - Duas Colunas conforme imagem */
        .agro-home-container {
          background: #f5f5f5; /* Fundo cinza claro da imagem */
          min-height: 100vh;
          position: relative;
        }
          /* Seção principal de notícias centralizada */
          .agro-news-main-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin: 0;
            max-width: 700px;
          }

        /* Hero Fullscreen */
        .agro-hero-fullscreen {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
        }

        .agro-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          z-index: 2;
          width: 100%;
          height: 100%;
        }

        .agro-hero-content-centered {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 3;
          text-align: center;
          max-width: 800px;
          padding: 0 2rem;
          width: 100%;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .agro-hero-description {
          text-align: center;
          margin: 0 auto;
          max-width: 600px;
          display: block;
        }

        .agro-hero-title {
          text-align: center !important;
          margin: 0 auto 1.5rem auto !important;
          display: block !important;
          width: 100% !important;
          font-size: 4rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          line-height: 1.2 !important;
          font-family: 'Roboto', sans-serif !important;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
        }

        .agro-main-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0.75rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        /* Coluna Principal - Esquerda */
        .agro-main-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Hero Section */
        .agro-hero-section {
          background: #ffffff;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .agro-hero-title {
          font-size: 4rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          font-family: 'Roboto', sans-serif;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .agro-hero-description {
          font-size: 1.3rem;
          color: #ffffff;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .agro-hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .agro-btn-primary {
          background: #4caf50;
          color: #ffffff;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
        }

        .agro-btn-primary:hover {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .agro-btn-secondary {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
        }

        .agro-btn-secondary:hover {
          background: #ffffff;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        /* Statistics Section */
        .agro-stats-section {
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .agro-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .agro-stat-item {
          text-align: center;
        }

        .agro-stat-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: #000000;
          margin-bottom: 0.5rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-stat-label {
          font-size: 1rem;
          color: #666666;
          font-family: 'Inter', sans-serif;
        }

        /* Features Section */
        .agro-features-section {
          background: var(--bloomfi-bg-secondary);
          padding: 0.75rem;
          border-radius: 10px;
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .agro-feature-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.5rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-feature-description {
          color: #666666;
          line-height: 1.4;
          font-size: 0.8rem;
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar - Direita */
        .agro-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Seja Nosso Parceiro */
        .agro-partner-card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .agro-partner-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 1rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-partner-image {
          margin-bottom: 1rem;
        }

        .agro-partner-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .agro-partner-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .agro-btn-primary {
          background: #2a7f4f;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .agro-btn-primary:hover {
          background: #1f5f3a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(42, 127, 79, 0.3);
        }

        .agro-btn-secondary {
          background: transparent;
          color: #2a7f4f;
          border: 2px solid #2a7f4f;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .agro-btn-secondary:hover {
          background: #2a7f4f;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(42, 127, 79, 0.3);
        }

        /* Notícias do Agronegócio */
        .agro-news-card {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .agro-news-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 1rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-news-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agro-news-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .agro-news-item:last-child {
          border-bottom: none;
        }

        .agro-news-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: #666666;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
        }

        .agro-news-text {
          font-size: 0.9rem;
          color: #000000;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
        }

        .agro-news-time {
          font-size: 0.8rem;
          color: #999999;
          font-family: 'Inter', sans-serif;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .agro-main-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1rem;
          }
            .agro-news-main-section {
              max-width: 100vw;
              padding: 0 0.5rem;
            }

          .agro-sidebar {
            order: -1;
          }

          .agro-features-grid {
            grid-template-columns: 1fr;
          }

          .agro-stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .agro-hero-title {
            font-size: 2.5rem;
          }
            .agro-news-main-section {
              max-width: 100vw;
              padding: 0 0.25rem;
            }

          .agro-hero-description {
            font-size: 1.1rem;
          }

          .agro-hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .agro-btn-primary,
          .agro-btn-secondary {
            width: 100%;
            max-width: 300px;
            text-align: center;
          }

          .agro-stats-section,
          .agro-features-section {
            padding: 1.5rem;
          }

          .agro-partner-card,
          .agro-news-card {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .agro-hero-title {
            font-size: 2rem;
          }
            .agro-news-main-section {
              max-width: 100vw;
              padding: 0;
            }

          .agro-hero-section,
          .agro-stats-section,
          .agro-features-section {
            padding: 1rem;
          }

          .agro-partner-card,
          .agro-news-card {
            padding: 0.75rem;
          }

          .agro-btn-start {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }
        }

        /* Fix para imagem de fundo no mobile */
        @media (max-width: 768px) {
          .soy-field-background {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-image: url('/images/bela-natureza-retro-com-campo.jpg') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
            z-index: -1 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            transform: translate3d(0, 0, 0) scale(1) !important;
          }
        }
      `}</style>
          <div className='mt-8 flex justify-center' aria-hidden>
            <CryptoHash pageName='agroisync-home' visible={false} />
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default AgroisyncHome;
