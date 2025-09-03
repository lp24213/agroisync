import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';

const HomeNews = () => {
  const { isEnabled, getValue } = useFeatureFlags();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data para notícias
  const mockNewsData = [
    {
      id: 1,
      title: 'Soja atinge recorde de exportação no primeiro semestre',
      summary: 'Exportações brasileiras de soja crescem 15% em relação ao ano anterior',
      source: 'AgroNews',
      publishedAt: '2025-09-03T10:30:00Z',
      url: '#',
      category: 'Commodities'
    },
    {
      id: 2,
      title: 'Nova tecnologia de irrigação aumenta produtividade em 25%',
      summary: 'Sistema inteligente de irrigação promete revolucionar agricultura brasileira',
      source: 'TechAgro',
      publishedAt: '2025-09-03T09:15:00Z',
      url: '#',
      category: 'Tecnologia'
    },
    {
      id: 3,
      title: 'Milho: preços se estabilizam após período de volatilidade',
      summary: 'Mercado de milho encontra equilíbrio com oferta e demanda',
      source: 'MercadoAgro',
      publishedAt: '2025-09-03T08:45:00Z',
      url: '#',
      category: 'Mercado'
    },
    {
      id: 4,
      title: 'Safra de trigo deve superar expectativas este ano',
      summary: 'Produtores comemoram excelente desenvolvimento da safra de trigo',
      source: 'AgroBrasil',
      publishedAt: '2025-09-03T07:30:00Z',
      url: '#',
      category: 'Produção'
    },
    {
      id: 5,
      title: 'Sustentabilidade: novas práticas agrícolas ganham destaque',
      summary: 'Agricultores adotam métodos sustentáveis para preservar o meio ambiente',
      source: 'EcoAgro',
      publishedAt: '2025-09-03T06:20:00Z',
      url: '#',
      category: 'Sustentabilidade'
    }
  ];

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        if (isEnabled('USE_MOCK')) {
          setNewsData(mockNewsData);
        } else {
          // TODO: Implementar chamada real para API de notícias
          // Por enquanto, usar mock como fallback
          setNewsData(mockNewsData);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNewsData(mockNewsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();

    // Atualizar notícias a cada 30 minutos
    const interval = setInterval(fetchNewsData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isEnabled]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Commodities': 'bg-emerald-500/20 text-emerald-400',
      'Tecnologia': 'bg-sky-500/20 text-sky-400',
      'Mercado': 'bg-amber-500/20 text-amber-400',
      'Produção': 'bg-purple-500/20 text-purple-400',
      'Sustentabilidade': 'bg-green-500/20 text-green-400'
    };
    return colors[category] || 'bg-neutral-500/20 text-neutral-400';
  };

  if (!isEnabled('FEATURE_HOME_GRAINS')) {
    return null;
  }

  const newsLimit = getValue('NEWS_LIMIT', 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-neutral-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-100">
          Notícias do Agronegócio
        </h3>
        <Newspaper className="w-5 h-5 text-neutral-400" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-3/4 h-4 bg-neutral-800 rounded animate-pulse"></div>
              <div className="w-full h-3 bg-neutral-800 rounded animate-pulse"></div>
              <div className="w-1/2 h-3 bg-neutral-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {newsData.slice(0, newsLimit).map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-neutral-900/50 rounded-xl border border-white/5 hover:bg-neutral-900/70 transition-colors duration-200"
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {news.source}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-neutral-100 mb-2 line-clamp-2">
                    {news.title}
                  </h4>
                  
                  <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                    {news.summary}
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span className="text-xs text-neutral-500">
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => window.open(news.url, '_blank')}
                  className="p-2 text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
                  aria-label="Ler notícia completa"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-neutral-400 text-center">
          Últimas notícias do agronegócio brasileiro
        </p>
      </div>
    </motion.div>
  );
};

export default HomeNews;
