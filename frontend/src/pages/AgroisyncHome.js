import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StockTicker from '../components/StockTicker';
import GrainsChart from '../components/GrainsChart';
import CompactWeatherWidget from '../components/CompactWeatherWidget';
import CryptoHash from '../components/CryptoHash';
import GrainInfo from '../components/GrainInfo';
import AgriNews from '../components/AgriNews';

const AgroisyncHome = () => {
  const { t } = useTranslation();
  // Imagem de campo de soja e trigo com cache buster - usando imagem de alta resolução
  const inicioImageUrl = `https://media.istockphoto.com/id/2228728040/pt/foto/soybean-and-wheat-fields-at-summer-season.webp?a=1&b=1&s=612x612&w=0&k=20&c=N6HRSCwp0KbkAMuNBlSM7YbBq74KOBQvKvnRSB3Ws-A=`;

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

  return (
    <div className='agro-home-container'>
      {/* Ticker da Bolsa */}
      <StockTicker />

      {/* Hero Section */}
      <section
        className='agro-hero-fullscreen'
        style={{
          backgroundImage: `url('${inicioImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          maxWidth: '100%',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <div className='agro-hero-overlay' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className='agro-hero-content-centered agro-stagger-children' style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ 
                background: 'rgba(34, 197, 94, 0.15)',
                padding: '10px 24px',
                borderRadius: '30px',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                marginBottom: '24px',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e', letterSpacing: '0.5px' }}>
                🚀 {t('home.title')}
              </span>
            </motion.div>

            <motion.h1
              className='agro-hero-title'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ 
                textAlign: 'center', 
                margin: '0 auto 24px', 
                fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
                lineHeight: '1.2',
                padding: '0 1rem',
                fontWeight: '800'
              }}
            >
              {t('home.heroTitle')} <span style={{ color: '#22c55e' }}>{t('home.heroHighlight')}</span> {t('home.heroTitle2')}
            </motion.h1>

            <motion.p
              className='agro-hero-description'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                textAlign: 'center', 
                margin: '0 auto 32px', 
                fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', 
                maxWidth: '700px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              {t('home.heroSubtitle')}
            </motion.p>

            <motion.div
              className='agro-hero-buttons'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '30px' }}
            >
              <Link 
                to='/register' 
                className='agro-btn-primary agro-btn-animated'
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  padding: '18px 40px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
                  border: 'none'
                }}
              >
                🚀 {t('home.startNow')}
              </Link>
              <Link 
                to='/planos' 
                className='agro-btn-secondary agro-btn-animated'
                style={{
                  padding: '18px 40px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                📊 {t('home.viewPlans')}
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ 
                marginTop: '32px', 
                display: 'flex', 
                gap: 'clamp(12px, 2vw, 20px)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                maxWidth: '900px',
                margin: '32px auto 0'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)', 
                borderRadius: '12px', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ fontSize: 'clamp(18px, 3vw, 20px)' }}>✅</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>{t('home.benefits.freeTrial')}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)', 
                borderRadius: '12px', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ fontSize: 'clamp(18px, 3vw, 20px)' }}>💰</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>{t('home.benefits.noCommission')}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(255, 255, 255, 0.12)', 
                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)', 
                borderRadius: '12px', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ fontSize: 'clamp(18px, 3vw, 20px)' }}>⚡</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>{t('home.benefits.aiIncluded')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Layout Principal - Duas Colunas */}
      <div className='agro-main-layout'>
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
              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(0, 0, 0, 0.05))',
                  border: '2px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
                <h3 className='agro-feature-title' style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                  {t('home.features.costReduction')}
                </h3>
                <p className='agro-feature-description' style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  {t('home.features.costReductionDesc')}
                </p>
                <ul style={{ textAlign: 'left', marginTop: '15px', color: '#666' }}>
                  <li>{t('home.features.fertilizers')}</li>
                  <li>{t('home.features.pesticides')}</li>
                  <li>{t('home.features.fuel')}</li>
                  <li>{t('home.features.irrigation')}</li>
                </ul>
              </motion.div>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.05))',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌤️</div>
                <h3 className='agro-feature-title' style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {t('home.features.weatherForecast')}
                </h3>
                <p className='agro-feature-description' style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  {t('home.features.weatherForecastDesc')}
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{t('home.features.realTimeAlerts')}</span>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{t('home.features.plantingWindow')}</span>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{t('home.features.soilMoisture')}</span>
                </div>
              </motion.div>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.05))',
                  border: '2px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                <h3 className='agro-feature-title' style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
                  {t('home.features.profitSimulator')}
                </h3>
                <p className='agro-feature-description' style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                  {t('home.features.profitSimulatorDesc')}
                </p>
                <div style={{ marginTop: '15px', background: 'rgba(168, 85, 247, 0.15)', padding: '15px', borderRadius: '12px', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', color: '#a855f7', fontWeight: 'bold', marginBottom: '8px' }}>{t('home.features.example')}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{t('home.features.cost')}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{t('home.features.revenue')}</div>
                  <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 'bold', marginTop: '5px' }}>{t('home.features.profit')}</div>
                </div>
              </motion.div>


              <Link to='/marketplace' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                  <h3 className='agro-feature-title'>{t('home.features.marketplace')}</h3>
                  <p className='agro-feature-description'>
                    {t('home.features.marketplaceDesc')}
                  </p>
                </motion.div>
              </Link>

              <Link to='/freights' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚛</div>
                  <h3 className='agro-feature-title'>{t('home.features.smartFreight')}</h3>
                  <p className='agro-feature-description'>
                    {t('home.features.smartFreightDesc')}
                  </p>
                </motion.div>
              </Link>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                <h3 className='agro-feature-title'>{t('home.features.ratings')}</h3>
                <p className='agro-feature-description'>
                  {t('home.features.ratingsDesc')}
                </p>
              </motion.div>

              <Link to='/dashboard' style={{ textDecoration: 'none', color: 'inherit' }}>
                <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants} style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                  <h3 className='agro-feature-title'>{t('home.features.aiChat')}</h3>
                  <p className='agro-feature-description'>
                    {t('home.features.aiChatDesc')}
                  </p>
                </motion.div>
              </Link>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                <h3 className='agro-feature-title'>{t('home.features.partnerships')}</h3>
                <p className='agro-feature-description'>
                  {t('home.features.partnershipsDesc')}
                </p>
              </motion.div>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                <h3 className='agro-feature-title'>{t('home.features.modernPayments')}</h3>
                <p className='agro-feature-description'>
                  {t('home.features.modernPaymentsDesc')}
                </p>
              </motion.div>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h3 className='agro-feature-title'>{t('home.features.realTimeAnalysis')}</h3>
                <p className='agro-feature-description'>
                  {t('home.features.realTimeAnalysisDesc')}
                </p>
              </motion.div>

              <motion.div className='agro-feature-card agro-card-animated' variants={itemVariants}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♿</div>
                <h3 className='agro-feature-title'>{t('home.features.accessibility')}</h3>
                <p className='agro-feature-description'>
                  {t('home.features.accessibilityDesc')}
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Seção de Informações dos Grãos */}
          <GrainInfo />
        </div>

        {/* Sidebar - Direita */}
        <div className='agro-sidebar'>
          {/* Ultra Gráfico de Cotações */}
          {/* Cotações em Tempo Real (melhorado com API) */}
          <GrainsChart />
          
          {/* Notícias do Agronegócio */}
          <AgriNews />

          {/* Widget de Clima Compacto */}
          <CompactWeatherWidget />


        </div>
      </div>

      <style jsx>{`
        /* Layout Principal - Duas Colunas conforme imagem */
        .agro-home-container {
          background: #f5f5f5; /* Fundo cinza claro da imagem */
          min-height: 100vh;
          position: relative;
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
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Coluna Principal - Esquerda */
        .agro-main-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
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
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .agro-feature-card {
          padding: 1.5rem;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .agro-feature-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.75rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-feature-description {
          color: #666666;
          line-height: 1.5;
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar - Direita */
        .agro-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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
      `}</style>
      <div className='mt-8 flex justify-center' aria-hidden>
        <CryptoHash pageName='agroisync-home' visible={false} />
      </div>
    </div>
  );
};

export default AgroisyncHome;
