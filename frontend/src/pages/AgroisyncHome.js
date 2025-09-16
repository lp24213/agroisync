import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Truck
} from 'lucide-react';
import CryptoChart from '../components/CryptoChart';
import StockWidget from '../components/StockWidget';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';

const AgroisyncHome = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Marketplace Digital',
      description: 'Conecte-se com compradores e vendedores em uma plataforma segura e eficiente.',
      link: '/marketplace',
    },
    {
      icon: <Truck size={32} />,
      title: 'AgroConecta',
      description: 'Logística inteligente para otimizar toda a cadeia de suprimentos agrícolas.',
      link: '/agroconecta',
    },
    {
      icon: <Zap size={32} />,
      title: 'Tecnologia Blockchain',
      description: 'Transações seguras e transparentes com tecnologia de ponta.',
      link: '/crypto',
    },
    {
      icon: <Shield size={32} />,
      title: 'Analytics Avançado',
      description: 'Insights poderosos para tomar decisões estratégicas no agronegócio.',
      link: '/dashboard',
    },
  ];

  const stats = [
    { number: '10K+', label: t('stats.users'), color: 'var(--txc-light-green)' },
    { number: '50K+', label: t('stats.transactions'), color: 'var(--txc-accent-green)' },
    { number: '$2M+', label: t('stats.volume'), color: 'var(--grao-primary-gold)' },
    { number: '99.9%', label: t('stats.uptime'), color: 'var(--txc-light-green)' },
  ];

  // Variáveis de animação removidas - não utilizadas após implementação do hero prompt

  return (
    <div>
      {/* HERO COM IMAGEM 4K DE PLANTAÇÃO */}
      <AgroisyncHeroPrompt 
        title="Agroisync"
        subtitle="A Plataforma de Agronegócio Mais Futurista do Mundo"
        heroImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop&q=80"
        showCTA={true}
      />

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Nossas Soluções</h2>
            <p>
              Tecnologia avançada para revolucionar o agronegócio brasileiro
            </p>
          </div>
          
          <div className="grid grid-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex-center mb-4" style={{ color: 'var(--txc-primary-green)' }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="btn-secondary">
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.number}
                </div>
                <div className="text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="agro-news-section">
        <div className="agro-container">
          <div className="agro-section-header">
            <h2 className="agro-section-title">Notícias do Agronegócio</h2>
            <p className="agro-section-description">
              Fique por dentro das últimas novidades do setor
            </p>
          </div>
        </div>
      </section>

      {/* Real-time Data Section */}
      <section className="agro-data-section">
        <div className="agro-container">
          <div className="agro-section-header">
            <h2 className="agro-section-title">Dados em Tempo Real</h2>
            <p className="agro-section-description">
              Informações atualizadas sobre clima, criptomoedas e mercado
            </p>
          </div>
          
          <div className="agro-data-grid">
            <div className="agro-data-widget">
              <CryptoChart />
            </div>
            <div className="agro-data-widget">
              <StockWidget />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="agro-cta-section">
        <div className="agro-container">
          <div className="agro-cta-content">
            <h2 className="agro-cta-title">Pronto para revolucionar seu agronegócio?</h2>
            <p className="agro-cta-description">
              Junte-se a milhares de produtores que já transformaram seus negócios com nossa plataforma.
            </p>
            <div className="agro-cta-buttons">
              <Link to="/register" className="agro-btn-primary">
                Começar Agora
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="agro-btn-secondary">
                Falar com Especialista
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .agro-banner-section {
          position: relative;
          height: 70vh;
          min-height: 600px;
          overflow: hidden;
          background: var(--agro-gradient-hero);
        }

        .agro-banner-image {
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.3;
        }

        .agro-banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 10, 10, 0.9) 0%,
            rgba(26, 26, 46, 0.7) 30%,
            rgba(22, 33, 62, 0.7) 70%,
            rgba(10, 10, 10, 0.9) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agro-banner-content {
          text-align: center;
          max-width: 800px;
          padding: 0 20px;
        }

        .agro-banner-title {
          font-size: 4rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
          background: var(--agro-gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glow 3s ease-in-out infinite;
        }

        .agro-banner-description {
          font-size: 1.5rem;
          color: var(--agro-light-gray);
          margin-bottom: 2rem;
          line-height: 1.6;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .agro-banner-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .agro-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .agro-section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .agro-section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--agro-dark-green);
          margin-bottom: 1rem;
        }

        .agro-section-description {
          font-size: 1.125rem;
          color: var(--agro-light-gray);
          max-width: 600px;
          margin: 0 auto;
        }

        .agro-features-section {
          padding: 6rem 0;
          background: var(--agro-white);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .agro-feature-card {
          background: var(--agro-gradient-card);
          border: 1px solid rgba(57, 255, 20, 0.2);
          padding: 2rem;
          border-radius: var(--agro-radius-xl);
          box-shadow: var(--agro-shadow-card);
          text-align: center;
          transition: var(--agro-transition-normal);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .agro-feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--agro-gradient-accent);
        }

        .agro-feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(57, 255, 20, 0.4);
        }

        .agro-feature-icon {
          width: 80px;
          height: 80px;
          background: var(--agro-gradient-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--agro-dark-green);
          box-shadow: var(--agro-shadow-neon-green);
          animation: neon-pulse 3s ease-in-out infinite;
        }

        .agro-feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--agro-neon-green);
          margin-bottom: 1rem;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
        }

        .agro-feature-description {
          color: var(--agro-light-gray);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .agro-feature-link {
          color: var(--agro-green-accent);
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
        }

        .agro-feature-link:hover {
          color: var(--agro-dark-green);
        }

        .agro-stats-section {
          padding: 5rem 0;
          background: var(--agro-dark-green);
        }

        .agro-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .agro-stat-item {
          text-align: center;
          color: white;
        }

        .agro-stat-number {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .agro-stat-label {
          font-size: 1.125rem;
          color: var(--agro-light-gray);
        }

        .agro-news-section {
          padding: 6rem 0;
          background: var(--agro-white);
        }

        .agro-data-section {
          padding: 6rem 0;
          background: #f8f9fa;
        }

        .agro-data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .agro-data-widget {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .agro-cta-section {
          padding: 6rem 0;
          background: var(--agro-dark-green);
          text-align: center;
        }

        .agro-cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .agro-cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }

        .agro-cta-description {
          font-size: 1.125rem;
          color: var(--agro-light-gray);
          margin-bottom: 2rem;
        }

        .agro-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .agro-btn-primary {
          background: var(--agro-gradient-accent);
          color: var(--agro-dark-green);
          padding: 1rem 2rem;
          border-radius: var(--agro-radius-lg);
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--agro-transition-normal);
          box-shadow: var(--agro-shadow-neon-green);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .agro-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: var(--agro-transition-slow);
        }

        .agro-btn-primary:hover::before {
          left: 100%;
        }

        .agro-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(57, 255, 20, 0.6);
        }

        .agro-btn-secondary {
          background: transparent;
          color: var(--agro-neon-blue);
          padding: 1rem 2rem;
          border: 2px solid var(--agro-neon-blue);
          border-radius: var(--agro-radius-lg);
          text-decoration: none;
          font-weight: 600;
          transition: var(--agro-transition-normal);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .agro-btn-secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: var(--agro-neon-blue);
          transition: var(--agro-transition-normal);
          z-index: -1;
        }

        .agro-btn-secondary:hover::before {
          width: 100%;
        }

        .agro-btn-secondary:hover {
          color: var(--agro-dark-green);
          transform: translateY(-3px);
          box-shadow: var(--agro-shadow-neon-blue);
        }

        @media (max-width: 768px) {
          .agro-banner-title {
            font-size: 2.5rem;
          }
          
          .agro-banner-description {
            font-size: 1rem;
          }
          
          .agro-section-title {
            font-size: 2rem;
          }
          
          .agro-features-grid {
            grid-template-columns: 1fr;
          }
          
          .agro-data-grid {
            grid-template-columns: 1fr;
          }
          
          .agro-banner-buttons,
          .agro-cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .agro-features-section,
          .agro-news-section,
          .agro-data-section,
          .agro-cta-section {
            padding: 4rem 0;
          }

          .agro-stats-section {
            padding: 3rem 0;
          }
        }

        @media (max-width: 480px) {
          .agro-banner-title {
            font-size: 2rem;
          }
          
          .agro-banner-description {
            font-size: 0.9rem;
          }
          
          .agro-banner-content {
            padding: 0 16px;
          }
          
          .agro-btn-primary,
          .agro-btn-secondary {
            padding: 0.8rem 1.5rem;
            font-size: 0.9rem;
          }

          .agro-features-section,
          .agro-news-section,
          .agro-data-section,
          .agro-cta-section {
            padding: 3rem 0;
          }

          .agro-stats-section {
            padding: 2.5rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AgroisyncHome;