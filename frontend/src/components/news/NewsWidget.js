import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import newsService from '../../services/newsService';
import { motion } from 'framer-motion';

const NewsWidget = ({ limit = 5, showBreaking = true }) => {
  const { isDark } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

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
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setError('Não foi possível carregar as notícias');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Todas', icon: '📰' },
    { value: 'soja', label: 'Soja', icon: '🌱' },
    { value: 'milho', label: 'Milho', icon: '🌽' },
    { value: 'café', label: 'Café', icon: '☕' },
    { value: 'tecnologia', label: 'Tecnologia', icon: '💻' },
    { value: 'mercado', label: 'Mercado', icon: '📈' },
    { value: 'clima', label: 'Clima', icon: '🌤️' }
  ];

  const getCategoryIcon = category => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : '📰';
  };

  const formatPublishedDate = date => {
    return newsService.formatPublishedDate(date);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-xl'
            : 'border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl'
        }`}
      >
        <div className='flex items-center justify-center space-x-3'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent'></div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Carregando notícias...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-xl'
            : 'border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl'
        }`}
      >
        <div className='text-center'>
          <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20'>
            <span className='text-xl text-red-500'>⚠️</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={loadNews}
            className={`mt-3 rounded-lg px-4 py-2 text-xs transition-colors duration-300 ${
              isDark
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-green-500/20 text-green-600 hover:bg-green-500/30'
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
      className={`rounded-2xl p-6 ${
        isDark
          ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-xl'
          : 'border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl'
      }`}
    >
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notícias do Agronegócio</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Últimas atualizações do setor</p>
        </div>

        <button
          onClick={loadNews}
          className={`rounded-lg p-2 transition-colors duration-300 ${
            isDark
              ? 'text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400'
              : 'text-gray-500 hover:bg-green-500/20 hover:text-green-600'
          }`}
          title='Atualizar'
        >
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
        </button>
      </div>

      {/* Filtros de Categoria */}
      <div className='mb-6'>
        <div className='flex flex-wrap gap-2'>
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? isDark
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-green-500 text-white shadow-lg'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className='mr-2'>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notícias */}
      <div className='space-y-4'>
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`cursor-pointer rounded-xl p-4 transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-50/50 hover:bg-gray-100/70'
            }`}
          >
            {/* Breaking News Badge */}
            {showBreaking && item.isBreaking && (
              <div className='mb-2 flex items-center'>
                <span className='inline-flex items-center rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white'>
                  🔥 BREAKING
                </span>
                <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatPublishedDate(item.publishedAt)}
                </span>
              </div>
            )}

            {/* Categoria */}
            <div className='mb-2 flex items-center'>
              <span className='mr-2 text-lg'>{getCategoryIcon(item.category)}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-600'
                }`}
              >
                {newsService.getCategoryName(item.category)}
              </span>
            </div>

            {/* Título */}
            <h4 className={`mb-2 line-clamp-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </h4>

            {/* Resumo */}
            <p className={`mb-3 line-clamp-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.summary}</p>

            {/* Meta informações */}
            <div className='flex items-center justify-between text-xs'>
              <div className='flex items-center space-x-3'>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>📰 {item.source}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>👤 {item.author}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>⏱️ {item.readTime} min</span>
              </div>

              <div className='flex items-center space-x-2'>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  👁️ {item.views.toLocaleString()}
                </span>
                {!item.isBreaking && (
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatPublishedDate(item.publishedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-1'>
                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`rounded-full px-2 py-1 text-xs ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Ver Mais */}
      <div className='mt-6 text-center'>
        <button
          className={`transform rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105 ${
            isDark
              ? 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
              : 'border border-green-500/30 bg-green-500/20 text-green-600 hover:bg-green-500/30'
          }`}
        >
          Ver Todas as Notícias
        </button>
      </div>

      {/* Atualização */}
      <div className='mt-4 text-center'>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Atualizado às{' '}
          {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default NewsWidget;
