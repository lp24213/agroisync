import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AgroisyncHome = () => {
  const { t } = useTranslation();

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
          {/* Loja Agroisync */}
          <div className="agro-shop-card">
            <h3 className="agro-shop-title">Loja Agroisync</h3>
            
            <div className="agro-shop-items">
              <div className="agro-shop-item">
                <div className="agro-shop-item-image">
                  <div className="agro-tractor-icon">🚜</div>
                </div>
                <div className="agro-shop-item-info">
                  <div className="agro-shop-item-name">Trator John Deere® 8584</div>
                  <div className="agro-shop-item-price">R$ 120.000</div>
                </div>
              </div>
              
              <div className="agro-shop-item">
                <div className="agro-shop-item-image">
                  <div className="agro-seeder-icon">🌱</div>
                </div>
                <div className="agro-shop-item-info">
                  <div className="agro-shop-item-name">Semedora John Deere®</div>
                  <div className="agro-shop-item-price">R$ 60.000</div>
                </div>
              </div>
              
              <div className="agro-shop-item">
                <div className="agro-shop-item-image">
                  <div className="agro-harvester-icon">🌾</div>
                </div>
                <div className="agro-shop-item-info">
                  <div className="agro-shop-item-name">Colheitadeira Case®</div>
                  <div className="agro-shop-item-price">R$ 850.000</div>
                </div>
          </div>
          
              <div className="agro-shop-item">
                <div className="agro-shop-item-image">
                  <div className="agro-implement-icon">⚙️</div>
                </div>
                <div className="agro-shop-item-info">
                  <div className="agro-shop-item-name">Implemento Agrícola</div>
                  <div className="agro-shop-item-price">R$ 12.600</div>
                </div>
              </div>
            </div>
            
            <div className="agro-shop-link">
              <Link to="/shop">Ver todos os produtos</Link>
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
          color: #000000;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          font-family: 'Roboto', sans-serif;
        }

        .agro-hero-description {
          font-size: 1.1rem;
          color: #666666;
          margin-bottom: 2rem;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
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

        /* Loja Agroisync */
        .agro-shop-card {
          background: #FFFFFF;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .agro-shop-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 1rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-shop-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agro-shop-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #E9ECEF;
        }

        .agro-shop-item:last-child {
          border-bottom: none;
        }

        .agro-shop-item-image {
          width: 60px;
          height: 60px;
          background: #E9ECEF;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .agro-shop-item-info {
          flex: 1;
        }

        .agro-shop-item-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #000000;
          margin-bottom: 0.25rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-shop-item-price {
          font-size: 0.85rem;
          color: #4CAF50;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
        }

        .agro-shop-link {
          margin-top: 1rem;
          text-align: center;
        }

        .agro-shop-link a {
          color: #666666;
          text-decoration: none;
          font-size: 0.9rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-shop-link a:hover {
          color: #000000;
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

          .agro-shop-card,
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

          .agro-shop-card,
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