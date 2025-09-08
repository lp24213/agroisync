import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import newsService from '../services/newsService'

const NewsWidget = ({ limit = 5, showBreaking = true }) => {
  const { isDark } = useTheme()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadNews()
  }, [selectedCategory, limit])

  const loadNews = async () => {
    try {
      setLoading(true)
      setError(null)

      let newsData
      if (selectedCategory === 'all') {
        newsData = await newsService.getMainNews(limit)
      } else {
        newsData = await newsService.getNewsByCategory(selectedCategory, limit)
      }

      setNews(newsData)
    } catch (err) {
      setError('Erro ao carregar notícias')
      console.error('Erro no widget de notícias:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'Todas', icon: '📰' },
    { id: 'grains', name: 'Grãos', icon: '🌾' },
    { id: 'livestock', name: 'Pecuária', icon: '🐄' },
    { id: 'technology', name: 'Tecnologia', icon: '🚜' },
    { id: 'market', name: 'Mercado', icon: '📊' }
  ]

  const getCategoryIcon = category => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : '📰'
  }

  const formatPublishedDate = date => {
    const now = new Date()
    const published = new Date(date)
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`

    return published.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-xl'
            : 'border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl'
        }`}
      >
        <div className='flex items-center justify-center'>
          <div
            className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${
              isDark ? 'border-cyan-400' : 'border-green-500'
            }`}
          />
          <span className={`ml-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Carregando notícias...</span>
        </div>
      </motion.div>
    )
  }

  if (error || !news.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? 'border border-gray-700 bg-gray-900/80 backdrop-blur-xl'
            : 'border border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl'
        }`}
      >
        <div className='text-center'>
          <div className='mb-2 text-4xl'>📰</div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Nenhuma notícia disponível</p>
          <button
            onClick={loadNews}
            className={`mt-3 rounded-lg px-4 py-2 text-sm transition-colors ${
              isDark ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Tentar novamente
          </button>
        </div>
      </motion.div>
    )
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
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Notícias do Agronegócio
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Atualizações em tempo real</p>
        </div>
        <button
          onClick={loadNews}
          className={`rounded-lg p-2 transition-colors ${
            isDark
              ? 'text-gray-400 hover:bg-cyan-400/10 hover:text-cyan-400'
              : 'text-gray-500 hover:bg-green-500/10 hover:text-green-600'
          }`}
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

      {/* Filtros de categoria */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? isDark
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'bg-green-500 text-white shadow-lg'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className='mr-2'>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Lista de notícias */}
      <div className='space-y-4'>
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
              isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Badge de notícia quente */}
            {showBreaking && index === 0 && (
              <div className='mb-2 flex items-center'>
                <span className='inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400'>
                  🔥 BREAKING
                </span>
              </div>
            )}

            {/* Título da notícia */}
            <h4 className={`mb-2 line-clamp-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </h4>

            {/* Resumo */}
            <p className={`mb-3 line-clamp-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.summary}</p>

            {/* Meta informações */}
            <div className='flex items-center justify-between text-xs'>
              <div className='flex items-center space-x-4'>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  📅 {formatPublishedDate(item.publishedAt)}
                </span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>👁️ {item.views || 'N/A'}</span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>📖 {item.readTime || '2 min'}</span>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {getCategoryIcon(item.category)} {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão "Ver mais" */}
      <div className='mt-6 text-center'>
        <button
          className={`transform rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-105 ${
            isDark
              ? 'bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 hover:shadow-xl'
              : 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl'
          }`}
        >
          Ver Mais Notícias
        </button>
      </div>
    </motion.div>
  )
}

export default NewsWidget
