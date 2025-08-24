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

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : '📰';
  };

  const formatPublishedDate = (date) => {
    return newsService.formatPublishedDate(date);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando notícias...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-2xl ${
          isDark 
            ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
        }`}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {error}
          </p>
          <button
            onClick={loadNews}
            className={`mt-3 px-4 py-2 text-xs rounded-lg transition-colors duration-300 ${
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
      className={`p-6 rounded-2xl ${
        isDark 
          ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
          : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Notícias do Agronegócio
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Últimas atualizações do setor
          </p>
        </div>
        
        <button
          onClick={loadNews}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            isDark
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20'
              : 'text-gray-500 hover:text-green-600 hover:bg-green-500/20'
          }`}
          title="Atualizar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filtros de Categoria */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? isDark
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-green-500 text-white shadow-lg'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notícias */}
      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-50/50 hover:bg-gray-100/70'
            }`}
          >
            {/* Breaking News Badge */}
            {showBreaking && item.isBreaking && (
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                  🔥 BREAKING
                </span>
                <span className={`ml-2 text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formatPublishedDate(item.publishedAt)}
                </span>
              </div>
            )}

            {/* Categoria */}
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">
                {getCategoryIcon(item.category)}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isDark 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'bg-green-500/20 text-green-600'
              }`}>
                {newsService.getCategoryName(item.category)}
              </span>
            </div>

            {/* Título */}
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
              <div className="flex items-center space-x-3">
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  📰 {item.source}
                </span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  👤 {item.author}
                </span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ⏱️ {item.readTime} min
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  👁️ {item.views.toLocaleString()}
                </span>
                {!item.isBreaking && (
                  <span className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatPublishedDate(item.publishedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-2 py-1 rounded-full text-xs ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
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
      <div className="mt-6 text-center">
        <button
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
            isDark
              ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
              : 'bg-green-500/20 text-green-600 hover:bg-green-500/30 border border-green-500/30'
          }`}
        >
          Ver Todas as Notícias
        </button>
      </div>

      {/* Atualização */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Atualizado às {new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default NewsWidget;
