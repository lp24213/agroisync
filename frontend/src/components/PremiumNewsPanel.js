import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Globe, TrendingUp } from 'lucide-react';

const PremiumNewsPanel = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular dados de notícias do agronegócio
    const mockNews = [
      {
        id: 1,
        title: 'Soja brasileira atinge novo recorde de exportação em dezembro',
        summary: 'As exportações de soja do Brasil alcançaram 3,2 milhões de toneladas em dezembro, representando um aumento de 15% em relação ao mesmo período do ano anterior.',
        source: 'Globo Rural',
        publishedAt: '2024-01-15T10:30:00Z',
        url: '#',
        category: 'Commodities',
        image: '/images/news/soja-exportacao.jpg'
      },
      {
        id: 2,
        title: 'Tecnologia agrícola: Drones revolucionam monitoramento de safras',
        summary: 'Novas tecnologias de drones com IA estão permitindo monitoramento mais preciso de safras, aumentando a produtividade em até 20%.',
        source: 'Canal Rural',
        publishedAt: '2024-01-14T14:20:00Z',
        url: '#',
        category: 'Tecnologia',
        image: '/images/news/drones-agricultura.jpg'
      },
      {
        id: 3,
        title: 'Preços do milho sobem com expectativa de menor safra nos EUA',
        summary: 'Os preços do milho registraram alta de 8% esta semana devido às expectativas de redução na safra norte-americana.',
        source: 'Notícias Agrícolas',
        publishedAt: '2024-01-13T09:15:00Z',
        url: '#',
        category: 'Mercado',
        image: '/images/news/milho-precos.jpg'
      },
      {
        id: 4,
        title: 'Agricultura sustentável ganha força com novos incentivos governamentais',
        summary: 'Programa federal oferece crédito especial para produtores que adotam práticas sustentáveis em suas propriedades.',
        source: 'Globo Rural',
        publishedAt: '2024-01-12T16:45:00Z',
        url: '#',
        category: 'Sustentabilidade',
        image: '/images/news/agricultura-sustentavel.jpg'
      },
      {
        id: 5,
        title: 'Crise hídrica afeta produção de algodão no Nordeste',
        summary: 'Produtores de algodão no Nordeste enfrentam desafios com a escassez de água, impactando a qualidade da fibra.',
        source: 'Canal Rural',
        publishedAt: '2024-01-11T11:30:00Z',
        url: '#',
        category: 'Clima',
        image: '/images/news/algodao-nordeste.jpg'
      }
    ];

    const loadNews = async () => {
      try {
        // Simular carregamento de API
        setTimeout(() => {
          setNews(mockNews);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNews([]);
        setIsLoading(false);
      }
    };

    loadNews();
    
    // Atualizar notícias a cada 30 minutos
    const interval = setInterval(loadNews, 1800000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Commodities': '#ffd700',
      'Tecnologia': '#00d4ff',
      'Mercado': '#00ff88',
      'Sustentabilidade': '#8b5cf6',
      'Clima': '#ff4757'
    };
    return colors[category] || '#64748b';
  };

  if (isLoading) {
    return (
      <div className="premium-news-panel">
        <div className="premium-news-loading">
          <div className="premium-loading-spinner"></div>
          <span>Carregando notícias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-news-panel">
      <div className="premium-news-header">
        <div className="premium-news-title">
          <Globe size={24} className="text-neon" />
          <span>Notícias do Agronegócio</span>
        </div>
        <div className="premium-news-subtitle">
          Atualizações em tempo real
        </div>
      </div>
      
      <div className="premium-news-list">
        {news.map((article, index) => (
          <motion.article 
            key={article.id}
            className="premium-news-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="premium-news-content">
              <div className="premium-news-meta">
                <div 
                  className="premium-news-category"
                  style={{ backgroundColor: getCategoryColor(article.category) }}
                >
                  {article.category}
                </div>
                <div className="premium-news-source">
                  <span>{article.source}</span>
                </div>
                <div className="premium-news-date">
                  <Calendar size={12} />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
              
              <div className="premium-news-text">
                <h3 className="premium-news-title-item">
                  {article.title}
                </h3>
                <p className="premium-news-summary">
                  {article.summary}
                </p>
              </div>
              
              <div className="premium-news-actions">
                <a 
                  href={article.url} 
                  className="premium-news-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  <span>Ler mais</span>
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      
      <div className="premium-news-footer">
        <div className="premium-news-refresh">
          <TrendingUp size={16} />
          <span>Atualizado há poucos minutos</span>
        </div>
      </div>
      
      <style jsx>{`
        .premium-news-panel {
          background: var(--matte-black-light);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--shadow-premium);
          max-height: 600px;
          overflow-y: auto;
        }
        
        .premium-news-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          color: var(--premium-gray-dark);
        }
        
        .premium-loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--glass-white);
          border-top: 2px solid var(--neon-blue);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .premium-news-header {
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }
        
        .premium-news-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-xs);
        }
        
        .premium-news-subtitle {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-news-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .premium-news-item {
          background: var(--matte-black-lighter);
          border: 1px solid var(--glass-white);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .premium-news-item:hover {
          border-color: var(--neon-blue);
          box-shadow: var(--shadow-neon);
          transform: translateY(-1px);
        }
        
        .premium-news-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .premium-news-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        
        .premium-news-category {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--matte-black);
          text-transform: uppercase;
        }
        
        .premium-news-source {
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
          font-weight: 500;
        }
        
        .premium-news-date {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        .premium-news-text {
          flex: 1;
        }
        
        .premium-news-title-item {
          font-size: 1rem;
          font-weight: 600;
          color: var(--premium-white);
          margin-bottom: var(--spacing-sm);
          line-height: 1.4;
        }
        
        .premium-news-summary {
          font-size: 0.875rem;
          color: var(--premium-gray-dark);
          line-height: 1.5;
        }
        
        .premium-news-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .premium-news-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--glass-neon);
          border: 1px solid var(--neon-blue);
          border-radius: var(--radius-sm);
          color: var(--neon-blue);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .premium-news-link:hover {
          background: var(--neon-blue);
          color: var(--matte-black);
          box-shadow: var(--shadow-neon);
        }
        
        .premium-news-footer {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--glass-white);
          text-align: center;
        }
        
        .premium-news-refresh {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          font-size: 0.75rem;
          color: var(--premium-gray-dark);
        }
        
        /* Scrollbar personalizada */
        .premium-news-panel::-webkit-scrollbar {
          width: 6px;
        }
        
        .premium-news-panel::-webkit-scrollbar-track {
          background: var(--matte-black-light);
        }
        
        .premium-news-panel::-webkit-scrollbar-thumb {
          background: var(--neon-blue);
          border-radius: 3px;
        }
        
        .premium-news-panel::-webkit-scrollbar-thumb:hover {
          background: var(--neon-blue-light);
        }
        
        @media (max-width: 768px) {
          .premium-news-item {
            padding: var(--spacing-md);
          }
          
          .premium-news-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }
          
          .premium-news-title-item {
            font-size: 0.875rem;
          }
          
          .premium-news-summary {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumNewsPanel;
