import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import newsService from '../services/newsService';

const AgriNews = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await newsService.getAgroNews(8);
        if (result && result.length > 0) {
          setNews(result);
        } else {
          setError('Nenhuma notícia encontrada no momento.');
        }
      } catch (err) {
        console.error('Erro ao buscar notícias:', err);
        setError('Erro ao buscar notícias do agronegócio. Tente novamente mais tarde.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    // Atualiza a cada 6 horas (dados mais frescos)
    const interval = setInterval(fetchNews, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="agro-news-section">
        <div className="agro-news-grid">
          <div className="agro-news-card">Carregando notícias reais...</div>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="agro-news-section">
        <h3 className="agro-section-title" style={{ textAlign: 'center' }}>{t('home.news.title')}</h3>
        <div className="agro-news-grid">
          <div className="agro-news-card" style={{ textAlign: 'center', color: '#6c757d' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="agro-news-section">
      <h3 className="agro-section-title" style={{ textAlign: 'center' }}>{t('home.news.title')}</h3>
      {error && (
        <div style={{ padding: '0.5rem', marginBottom: '1rem', background: '#fff3cd', borderRadius: '4px', fontSize: '0.875rem', color: '#856404' }}>
          ⚠️ {error}
        </div>
      )}
      <div className="agro-news-grid">
        {news.map((item, index) => (
          <motion.div
            key={item.url || index}
            className="agro-news-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.imageUrl && (
              <div className="agro-news-image-wrapper">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="agro-news-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="agro-news-content">
              <h4 className="agro-news-title">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h4>
              <p className="agro-news-date">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('pt-BR') : ''}
                {item.source && <span className="agro-news-source"> • {item.source}</span>}
              </p>
              <div className="agro-news-excerpt">
                {item.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .agro-news-section {
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          margin-top: 2rem;
        }

        .agro-section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 1.5rem;
          font-family: 'Roboto', sans-serif;
        }

        .agro-news-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agro-news-card {
          padding: 0;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }

        .agro-news-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .agro-news-image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .agro-news-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .agro-news-card:hover .agro-news-image {
          transform: scale(1.05);
        }

        .agro-news-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
        }

        .agro-news-title {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0;
        }

        .agro-news-title a {
          color: #2a7f4f;
          text-decoration: none;
        }

        .agro-news-title a:hover {
          text-decoration: underline;
        }

        .agro-news-date {
          font-size: 0.8rem;
          color: #6c757d;
          margin: 0;
        }

        .agro-news-source {
          color: #2a7f4f;
          font-weight: 500;
        }

        .agro-news-excerpt {
          font-size: 0.9rem;
          color: #495057;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .agro-news-card {
            padding: 0.75rem;
          }
          
          .agro-section-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AgriNews;