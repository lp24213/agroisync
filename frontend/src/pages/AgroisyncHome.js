import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Truck,
  Globe
} from 'lucide-react';
import AgroNewsCarousel from '../components/AgroNewsCarousel';
import WeatherWidget from '../components/WeatherWidget';
import CryptoChart from '../components/CryptoChart';
import StockWidget from '../components/StockWidget';

const AgroisyncHome = () => {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Marketplace Inteligente',
      description: 'Conecte-se com compradores e vendedores de commodities agrícolas em uma plataforma segura e eficiente.',
      link: '/marketplace',
    },
    {
      icon: <Truck size={32} />,
      title: 'AgroConecta',
      description: 'Rede de transporte e logística inteligente para otimizar sua cadeia de suprimentos.',
      link: '/agroconecta',
    },
    {
      icon: <Zap size={32} />,
      title: 'Crypto Agro',
      description: 'Tecnologia blockchain para transações seguras e transparentes no agronegócio.',
      link: '/crypto',
    },
    {
      icon: <Shield size={32} />,
      title: 'Analytics Avançado',
      description: 'Dados e insights para tomada de decisão baseada em inteligência artificial.',
      link: '/dashboard',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Usuários Ativos', color: 'var(--agro-green-accent)' },
    { number: '50K+', label: 'Transações', color: 'var(--agro-green-accent)' },
    { number: '$2M+', label: 'Volume', color: 'var(--agro-green-accent)' },
    { number: '99.9%', label: 'Uptime', color: 'var(--agro-green-accent)' },
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
      {/* Banner Principal */}
      <section className="agro-banner-section">
        <div className="agro-banner-image">
          <div className="agro-banner-overlay">
            <div className="agro-banner-content">
              <motion.div
                variants={heroVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 className="agro-banner-title" variants={itemVariants}>
                  Conectando o Agronegócio Brasileiro com Tecnologia
                </motion.h1>
                
                <motion.p className="agro-banner-description" variants={itemVariants}>
                  Plataforma completa para marketplace, logística, criptomoedas e analytics do agronegócio brasileiro.
                </motion.p>
                
                <motion.div className="agro-banner-buttons" variants={itemVariants}>
                  <Link to="/marketplace" className="agro-btn-primary">
                    Explorar Marketplace
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/about" className="agro-btn-secondary">
                    Saiba Mais
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="agro-features-section">
        <div className="agro-container">
          <div className="agro-section-header">
            <h2 className="agro-section-title">Nossas Soluções</h2>
            <p className="agro-section-description">
              Tecnologia avançada para revolucionar o agronegócio brasileiro
            </p>
          </div>
          
          <div className="agro-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="agro-feature-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="agro-feature-icon">
                  {feature.icon}
                </div>
                <h3 className="agro-feature-title">{feature.title}</h3>
                <p className="agro-feature-description">{feature.description}</p>
                <Link to={feature.link} className="agro-feature-link">
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="agro-stats-section">
        <div className="agro-container">
          <div className="agro-stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="agro-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div 
                  className="agro-stat-number"
                  style={{ color: stat.color }}
                >
                  {stat.number}
                </div>
                <div className="agro-stat-label">{stat.label}</div>
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
          <AgroNewsCarousel />
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
              <WeatherWidget />
            </div>
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
          height: 60vh;
          min-height: 500px;
          overflow: hidden;
        }

        .agro-banner-image {
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .agro-banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(31, 46, 31, 0.8) 0%,
            rgba(31, 46, 31, 0.6) 50%,
            rgba(31, 46, 31, 0.8) 100%
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
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .agro-banner-description {
          font-size: 1.25rem;
          color: var(--agro-light-gray);
          margin-bottom: 2rem;
          line-height: 1.6;
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
          padding: 5rem 0;
          background: var(--agro-white);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .agro-feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .agro-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .agro-feature-icon {
          width: 80px;
          height: 80px;
          background: var(--agro-green-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .agro-feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--agro-dark-green);
          margin-bottom: 1rem;
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
          padding: 4rem 0;
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
          padding: 5rem 0;
          background: var(--agro-white);
        }

        .agro-data-section {
          padding: 5rem 0;
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
          padding: 5rem 0;
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
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .agro-btn-primary:hover {
          background: #2dd42d;
          transform: translateY(-2px);
        }

        .agro-btn-secondary {
          background: transparent;
          color: white;
          padding: 1rem 2rem;
          border: 2px solid var(--agro-green-accent);
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .agro-btn-secondary:hover {
          background: var(--agro-green-accent);
          color: var(--agro-dark-green);
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
        }
      `}</style>
    </div>
  );
};

export default AgroisyncHome;