import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import newsService from '../services/newsService';

const NewsWidget = ({ limit = 5, showBreaking = true }) => {
  const { isDark } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadNews();
  }, [selectedCategory, limit]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      let newsData;
      if (selectedCategory === 'all') {
        newsData = await newsService.getMainNews(limit);
      } else {
        newsData = await newsService.getNewsByCategory(selectedCategory, limit);
      }

      setNews(newsData);
    } catch (err) {
      setError('Erro ao carregar notícias');
      console.error('Erro no widget de notícias:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todas', icon: '📰' },
    { id: 'grains', name: 'Grãos', icon: '🌾' },
    { id: 'livestock', name: 'Pecuária', icon: '🐄' },
    { id: 'technology', name: 'Tecnologia', icon: '🚜' },
    { id: 'market', name: 'Mercado', icon: '📊' }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📰';
  };

  const formatPublishedDate = (date) => {
    const now = new Date();
    const published = new Date(date);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return published.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-center">
          <div className={`w-8 h-8 border-2 rounded-full border-t-transparent animate-spin ${
            isDark ? 'border-cyan-400' : 'border-green-500'
          }`} />
          <span className={`ml-3 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando notícias...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error || !news.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl ${
          isDark
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700'
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📰</div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nenhuma notícia disponível
          </p>
          <button
            onClick={loadNews}
            className={`mt-3 px-4 py-2 rounded-lg text-sm transition-colors ${
              isDark
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl ${
        isDark
          ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700'
          : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Notícias do Agronegócio
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Atualizações em tempo real
          </p>
        </div>
        <button
          onClick={loadNews}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
              : 'text-gray-500 hover:text-green-600 hover:bg-green-500/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filtros de categoria */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? isDark
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-green-500 text-white shadow-lg'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Lista de notícias */}
      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
              isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Badge de notícia quente */}
            {showBreaking && index === 0 && (
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  🔥 BREAKING
                </span>
              </div>
            )}

            {/* Título da notícia */}
            <h4 className={`font-semibold mb-2 line-clamp-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </h4>

            {/* Resumo */}
            <p className={`text-sm mb-3 line-clamp-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.summary}
            </p>

            {/* Meta informações */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  📅 {formatPublishedDate(item.publishedAt)}
                </span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  👁️ {item.views || 'N/A'}
                </span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  📖 {item.readTime || '2 min'}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}>
                {getCategoryIcon(item.category)} {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão "Ver mais" */}
      <div className="mt-6 text-center">
        <button
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            isDark
              ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          Ver Mais Notícias
        </button>
      </div>
    </motion.div>
  );
};

export default NewsWidget;
