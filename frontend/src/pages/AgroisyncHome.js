import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AgroisyncHome = () => {

  const sectionVariants = {
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
    <div className="agro-home-container">
      {/* Layout Principal - Duas Colunas */}
      <div className="agro-main-layout">
        {/* Coluna Principal - Esquerda */}
        <div className="agro-main-content">
          {/* Hero Section */}
          <section className="agro-hero-section">
            <div className="agro-hero-content">
              <motion.h1 
                className="agro-hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                O Futuro do Agronegócio é Agora
              </motion.h1>
              
              <motion.p 
                className="agro-hero-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                A plataforma mais futurista e sofisticada do mundo para conectar produtores, compradores e transportadores. Design premium, tecnologia de ponta e performance excepcional.
            </motion.p>
          
          <motion.div 
                className="agro-hero-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/register" className="agro-btn-start">
                  Começar Agora
                </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
          <section className="agro-stats-section">
            <div className="agro-stats-grid">
              <motion.div 
                className="agro-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="agro-stat-number">10K+</div>
                <div className="agro-stat-label">Usuários Ativos</div>
              </motion.div>
              
              <motion.div
                className="agro-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="agro-stat-number">R$ 50M+</div>
                <div className="agro-stat-label">Volume Transacionado</div>
              </motion.div>
              
              <motion.div 
                className="agro-stat-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="agro-stat-number">99,9%</div>
                <div className="agro-stat-label">Uptime Garantido</div>
              </motion.div>
        </div>
      </section>

          {/* Features Section */}
          <section className="agro-features-section">
            <motion.div 
              className="agro-features-grid"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="agro-feature-card" variants={itemVariants}>
                <h3 className="agro-feature-title">Tecnologia que Impressiona</h3>
                <p className="agro-feature-description">
                  Recursos avançados que colocam o AgroSync anos à frente da concorrência
                </p>
              </motion.div>
              
              <motion.div className="agro-feature-card" variants={itemVariants}>
                <h3 className="agro-feature-title">Segurança Avançada</h3>
                <p className="agro-feature-description">
                  Proteção de dados com criptografia de nível bancário e autenticação 2FA
                </p>
              </motion.div>
              
              <motion.div className="agro-feature-card" variants={itemVariants}>
                <h3 className="agro-feature-title">Performance Extrema</h3>
                <p className="agro-feature-description">
                  Tecnologia de ponta para transações instantâneas e processamento em tempo real
                </p>
              </motion.div>
              
              <motion.div className="agro-feature-card" variants={itemVariants}>
                <h3 className="agro-feature-title">Global & Local</h3>
                <p className="agro-feature-description">
                  Conectividade mundial com foco no agronegócio brasileiro e internacional
                </p>
              </motion.div>
            </motion.div>
          </section>
        </div>

        {/* Sidebar - Direita */}
        <div className="agro-sidebar">
          {/* Seja Nosso Parceiro */}
          <div className="agro-partner-card">
            <h3 className="agro-partner-title">Seja Nosso Parceiro</h3>
            <div className="agro-partner-image">
              <img src="/assets/parceria.png" alt="Parceria Agroisync" />
            </div>
            <div className="agro-partner-buttons">
              <Link to="/marketplace" className="agro-btn-primary">Explorar Marketplace</Link>
              <Link to="/partnerships" className="agro-btn-secondary">Saiba Mais</Link>
            </div>
          </div>

          {/* Notícias do Agronegócio */}
          <div className="agro-news-card">
            <h3 className="agro-news-title">Notícias do Agronegócio</h3>
            
            <div className="agro-news-items">
              <div className="agro-news-item">
                <div className="agro-news-category">COMMODITIES</div>
                <div className="agro-news-text">
                  Soja atinge maior preço em 3 meses com alta da demanda chinesa
                </div>
                <div className="agro-news-time">3h atrás</div>
              </div>
              
              <div className="agro-news-item">
                <div className="agro-news-category">TECNOLOGIA</div>
                <div className="agro-news-text">
                  Tecnologia SG revoluciona monitoramento de safras no Brasil
                </div>
                <div className="agro-news-time">3h atrás</div>
        </div>
              
              <div className="agro-news-item">
                <div className="agro-news-category">CLIMA</div>
                <div className="agro-news-text">
                  Chuva em excesso preocupa produtores de milho no Centro-Oeste
                </div>
                <div className="agro-news-time">3h atrás</div>
              </div>
            </div>
            </div>
          </div>
        </div>

      <style jsx>{`
        /* Layout Principal - Duas Colunas conforme imagem */
        .agro-home-container {
          background: #F5F5F5; /* Fundo cinza claro da imagem */
          min-height: 100vh;
          position: relative;
        }

        /* Hero Background com imagem inicio.png */
        .agro-hero-section {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/assets/inicio.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
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
          background: #FFFFFF;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .agro-hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          font-family: 'Roboto', sans-serif;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }

        .agro-hero-description {
          font-size: 1.1rem;
          color: #FFFFFF;
          margin-bottom: 2rem;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }

        .agro-btn-start {
          background: #424242;
          color: #FFFFFF;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .agro-btn-start:hover {
          background: #333333;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Statistics Section */
        .agro-stats-section {
          background: #FFFFFF;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
          background: #FFFFFF;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .agro-feature-card {
          padding: 1.5rem;
          border-radius: 8px;
          background: #F8F9FA;
          border: 1px solid #E9ECEF;
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
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
          color: #FFFFFF;
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
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(42, 127, 79, 0.3);
        }

        /* Notícias do Agronegócio */
        .agro-news-card {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
          border-bottom: 1px solid #E9ECEF;
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
            font-size: 1rem;
          }

          .agro-hero-section,
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
    </div>
  );
};

export default AgroisyncHome;