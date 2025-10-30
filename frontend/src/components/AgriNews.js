import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AgriNews = () => {
  const { t } = useTranslation();
  const news = [
    {
      id: 1,
      title: 'Banana ganha valor e mercado',
      excerpt: 'Em 2020, as balas de banana de Antonina conquistaram o selo de Indicação Geográfica de Procedência – que protege o nome da região onde o produto se tornou notório',
      date: '09/01/2025',
      link: '#'
    },
    {
      id: 2,
      title: '\'Vamos garantir que o produtor volte a produzir\', afirma Fávaro sobre crédito para áreas incendiadas',
      excerpt: 'O programa, parte da linha de crédito Renova Agro, oferece condições facilitadas, como 2 anos de carência e 10 anos para pagamento',
      date: '13/09/2024',
      link: '#'
    },
    {
      id: 3,
      title: 'Canal Rural lança "Calçando a Botina" com foco em aproximar jovens do agronegócio',
      excerpt: 'Novo quadro vai ao ar nesta sexta-feira (6), no Rural Notícias, às 18h45',
      date: '06/09/2024',
      link: '#'
    },
    {
      id: 4,
      title: 'Onda de calor e fortes temporais causam prejuízo em lavouras de SP',
      excerpt: 'Agricultores relatam queda na qualidade de hortifrútis e perdas irreversíveis, especialmente entre as hortaliças',
      date: '17/11/2023',
      link: '#'
    },
    {
      id: 5,
      title: 'Exportações de milho: relatório do USDA não altera liderança brasileira',
      excerpt: 'Brasil já enviou para o mercado externo 25,22 milhões de toneladas; países asiáticos são os maiores consumidores',
      date: '13/09/2023',
      link: '#'
    }
  ];

  return (
    <section className="agro-news-section">
      <h3 className="agro-section-title" style={{ textAlign: 'center' }}>{t('home.news.title')}</h3>
      <div className="agro-news-grid">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            className="agro-news-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="agro-news-content">
              <h4 className="agro-news-title">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h4>
              <p className="agro-news-date">{item.date}</p>
              <div className="agro-news-excerpt">
                {item.excerpt}
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
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease;
        }

        .agro-news-card:hover {
          transform: translateY(-2px);
        }

        .agro-news-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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